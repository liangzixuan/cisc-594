"""Flask presentation layer for the PantryPilot demonstration baseline."""

from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, render_template, request

from src.pantrypilot_app import (
    aggregate_grocery_items,
    describe_release,
    detect_allergen_conflicts,
    is_near_expiry,
    load_config,
    parse_iso_date,
)
from system_test_runner import run_system_tests


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEMO_TODAY = "2026-08-14"

DEMO_RECIPES = [
    {
        "id": "tofu-bowl",
        "name": "Ginger tofu rice bowl",
        "description": "Glazed tofu, broccoli, rice, and scallions",
        "day": "Monday",
        "duration": "25 min",
        "servings": 2,
        "image": "/static/assets/tofu-rice.jpg",
        "tags": ["Vegetarian", "High protein"],
        "ingredients": [
            "rice",
            "tofu",
            "broccoli",
            "soy sauce",
            "scallions",
            "sesame seeds",
        ],
        "grocery_items": [
            {"name": "rice", "quantity": 1, "unit": "cup"},
            {"name": "tofu", "quantity": 14, "unit": "oz"},
            {"name": "broccoli", "quantity": 1, "unit": "head"},
            {"name": "soy sauce", "quantity": 2, "unit": "tbsp"},
            {"name": "scallions", "quantity": 3, "unit": "each"},
            {"name": "olive oil", "quantity": 1, "unit": "tbsp"},
        ],
    },
    {
        "id": "chickpea-bowl",
        "name": "Mediterranean chickpea bowl",
        "description": "Quinoa, cucumber, tomato, olives, and lemon",
        "day": "Wednesday",
        "duration": "20 min",
        "servings": 2,
        "image": "/static/assets/chickpea-bowl.jpg",
        "tags": ["Plant based", "Fiber rich"],
        "ingredients": [
            "quinoa",
            "chickpeas",
            "cucumber",
            "tomato",
            "olives",
            "lemon",
            "olive oil",
        ],
        "grocery_items": [
            {"name": "quinoa", "quantity": 1, "unit": "cup"},
            {"name": "chickpeas", "quantity": 2, "unit": "can"},
            {"name": "cucumber", "quantity": 1, "unit": "each"},
            {"name": "tomato", "quantity": 2, "unit": "each"},
            {"name": "olives", "quantity": 0.5, "unit": "cup"},
            {"name": "lemon", "quantity": 1, "unit": "each"},
            {"name": "olive oil", "quantity": 1, "unit": "tbsp"},
        ],
    },
    {
        "id": "tomato-pasta",
        "name": "Creamy tomato spinach pasta",
        "description": "Penne, tomato, spinach, cream, and parmesan",
        "day": "Friday",
        "duration": "30 min",
        "servings": 3,
        "image": "/static/assets/tomato-pasta.jpg",
        "tags": ["Weeknight", "One pan"],
        "ingredients": [
            "pasta",
            "tomato",
            "spinach",
            "cream",
            "cheese",
            "olive oil",
        ],
        "grocery_items": [
            {"name": "pasta", "quantity": 12, "unit": "oz"},
            {"name": "tomato", "quantity": 2, "unit": "each"},
            {"name": "spinach", "quantity": 5, "unit": "oz"},
            {"name": "cream", "quantity": 1, "unit": "cup"},
            {"name": "parmesan", "quantity": 0.5, "unit": "cup"},
            {"name": "olive oil", "quantity": 1, "unit": "tbsp"},
        ],
    },
]

DEMO_PANTRY = [
    {"id": "pantry-broccoli", "name": "Broccoli", "quantity": "1 head", "expires": "2026-08-14"},
    {"id": "pantry-tofu", "name": "Tofu", "quantity": "14 oz", "expires": "2026-08-17"},
    {"id": "pantry-spinach", "name": "Spinach", "quantity": "5 oz", "expires": "2026-08-18"},
    {"id": "pantry-lemon", "name": "Lemon", "quantity": "2 each", "expires": "2026-08-13"},
    {"id": "pantry-rice", "name": "Rice", "quantity": "4 cups", "expires": "2027-01-10"},
]


def _recipe_by_id(recipe_id: str) -> dict | None:
    return next((recipe for recipe in DEMO_RECIPES if recipe["id"] == recipe_id), None)


def _pantry_status(item: dict, today: str, window_days: int) -> dict:
    expiration = parse_iso_date(item["expires"])
    current_day = parse_iso_date(today)
    days_remaining = (expiration - current_day).days

    if days_remaining < 0:
        status = "expired"
    elif is_near_expiry(expiration, current_day, window_days):
        status = "use-soon"
    else:
        status = "fresh"

    return {**item, "days_remaining": days_remaining, "status": status}


def create_app() -> Flask:
    app = Flask(
        __name__,
        template_folder=str(PROJECT_ROOT / "templates"),
        static_folder=str(PROJECT_ROOT / "static"),
    )

    @app.get("/")
    def index():
        return render_template("index.html")

    @app.get("/api/demo-data")
    def demo_data():
        config = load_config(PROJECT_ROOT / "config" / "app_config.json")
        return jsonify(
            {
                "release": {
                    "identity": describe_release(config),
                    "version": config["baseline_version"],
                    "name": config["release_name"],
                    "environment": config["environment"],
                },
                "features": config["features"],
                "quality_gates": config["quality_gates"],
                "profile": {"name": "Zixuan's household", "allergens": ["soy"]},
                "recipes": DEMO_RECIPES,
                "pantry": DEMO_PANTRY,
                "today": DEMO_TODAY,
            }
        )

    @app.post("/api/check-recipe")
    def check_recipe():
        payload = request.get_json(silent=True) or {}
        recipe = _recipe_by_id(str(payload.get("recipe_id", "")))
        allergens = payload.get("allergens", [])

        if recipe is None:
            return jsonify({"error": "Unknown recipe."}), 404
        if not isinstance(allergens, list) or not all(isinstance(item, str) for item in allergens):
            return jsonify({"error": "Allergens must be a list of strings."}), 400

        conflicts = detect_allergen_conflicts(recipe["ingredients"], allergens)
        return jsonify(
            {
                "recipe_id": recipe["id"],
                "recipe_name": recipe["name"],
                "conflicts": conflicts,
                "safe": not conflicts,
                "decision": "approved" if not conflicts else "blocked",
            }
        )

    @app.post("/api/grocery-list")
    def grocery_list():
        payload = request.get_json(silent=True) or {}
        recipe_ids = payload.get("recipe_ids", [])

        if not isinstance(recipe_ids, list):
            return jsonify({"error": "Recipe IDs must be a list."}), 400

        recipes = [_recipe_by_id(str(recipe_id)) for recipe_id in recipe_ids]
        if any(recipe is None for recipe in recipes):
            return jsonify({"error": "One or more recipes were not found."}), 404

        grocery_recipes = [{"ingredients": recipe["grocery_items"]} for recipe in recipes]
        items = aggregate_grocery_items(grocery_recipes)
        return jsonify({"items": items, "recipe_count": len(recipes), "item_count": len(items)})

    @app.post("/api/pantry-status")
    def pantry_status():
        payload = request.get_json(silent=True) or {}
        today = str(payload.get("today", DEMO_TODAY))

        try:
            window_days = int(payload.get("window_days", 3))
            parse_iso_date(today)
        except (TypeError, ValueError):
            return jsonify({"error": "Use an ISO date and a numeric expiry window."}), 400

        if not 1 <= window_days <= 14:
            return jsonify({"error": "Expiry window must be between 1 and 14 days."}), 400

        items = [_pantry_status(item, today, window_days) for item in DEMO_PANTRY]
        return jsonify(
            {
                "items": items,
                "today": today,
                "window_days": window_days,
                "use_soon_count": sum(item["status"] == "use-soon" for item in items),
                "expired_count": sum(item["status"] == "expired" for item in items),
            }
        )

    @app.get("/api/quality-summary")
    def quality_summary():
        config = load_config(PROJECT_ROOT / "config" / "app_config.json")
        scenarios = run_system_tests()
        passed = sum(item["result"] == "PASS" for item in scenarios)
        return jsonify(
            {
                "release": describe_release(config),
                "gates": config["quality_gates"],
                "scenarios": scenarios,
                "passed": passed,
                "total": len(scenarios),
                "status": "passed" if passed == len(scenarios) else "failed",
            }
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), debug=False)
