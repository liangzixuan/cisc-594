"""Generic PantryPilot application entry point for CM demonstration."""

from __future__ import annotations

import json
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path


DEFAULT_ALLERGEN_ALIASES = {
    "peanut": {"peanut", "peanuts", "peanut butter", "groundnut"},
    "soy": {"soy", "soybean", "soybeans", "soy sauce", "soy lecithin"},
    "milk": {"milk", "dairy", "butter", "cream", "cheese"},
    "egg": {"egg", "eggs", "mayonnaise"},
}


def load_config(path: str | Path = "config/app_config.json") -> dict:
    """Load the version-controlled PantryPilot configuration file."""
    with Path(path).open("r", encoding="utf-8") as file:
        return json.load(file)


def describe_release(config: dict) -> str:
    """Return a stable release description used by smoke tests and CI."""
    app_name = config["app_name"]
    version = config["baseline_version"]
    release_name = config["release_name"]
    return f"{app_name} {version}: {release_name}"


def ingredient_tokens(ingredients: list[str]) -> set[str]:
    """Normalize ingredient names for deterministic safety checks."""
    return {ingredient.strip().lower() for ingredient in ingredients if ingredient.strip()}


def detect_allergen_conflicts(
    ingredients: list[str],
    allergens: list[str],
    aliases: dict[str, set[str]] | None = None,
) -> list[str]:
    """Return declared allergens that appear in a candidate recipe."""
    alias_map = aliases or DEFAULT_ALLERGEN_ALIASES
    normalized_ingredients = ingredient_tokens(ingredients)
    conflicts: list[str] = []

    for allergen in ingredient_tokens(allergens):
        known_terms = alias_map.get(allergen, {allergen})
        if normalized_ingredients.intersection(known_terms):
            conflicts.append(allergen)

    return sorted(conflicts)


def recipe_is_safe_for_profile(recipe: dict, profile: dict) -> bool:
    """Validate that a recipe does not violate the profile allergen list."""
    ingredients = recipe.get("ingredients", [])
    allergens = profile.get("allergens", [])
    return not detect_allergen_conflicts(ingredients, allergens)


def aggregate_grocery_items(recipes: list[dict]) -> list[dict]:
    """Consolidate recipe ingredients by canonical item name and unit."""
    totals: dict[tuple[str, str], float] = defaultdict(float)

    for recipe in recipes:
        for ingredient in recipe.get("ingredients", []):
            name = ingredient["name"].strip().lower()
            unit = ingredient.get("unit", "each").strip().lower()
            quantity = float(ingredient.get("quantity", 1))
            totals[(name, unit)] += quantity

    return [
        {"name": name, "quantity": quantity, "unit": unit}
        for (name, unit), quantity in sorted(totals.items())
    ]


def parse_iso_date(value: str | date) -> date:
    """Parse an ISO date string while accepting date objects in tests."""
    if isinstance(value, date):
        return value
    return datetime.strptime(value, "%Y-%m-%d").date()


def is_near_expiry(expiration_date: str | date, today: str | date, window_days: int = 3) -> bool:
    """Return True when an item expires from today through the inclusive window."""
    expiration = parse_iso_date(expiration_date)
    current_day = parse_iso_date(today)
    delta = (expiration - current_day).days
    return 0 <= delta <= window_days


if __name__ == "__main__":
    print(describe_release(load_config()))
