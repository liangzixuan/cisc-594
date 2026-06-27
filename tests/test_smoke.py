from src.pantrypilot_app import (
    aggregate_grocery_items,
    describe_release,
    detect_allergen_conflicts,
    is_near_expiry,
    load_config,
    recipe_is_safe_for_profile,
)


def test_config_loads_and_identifies_release():
    config = load_config()

    assert config["app_name"] == "PantryPilot"
    assert config["baseline_version"] == "1.1.0"
    assert describe_release(config) == "PantryPilot 1.1.0: Safety & Grocery Controls"


def test_quality_gates_are_enabled_for_baseline():
    config = load_config()
    gates = config["quality_gates"]

    assert gates["unit_tests_required"] is True
    assert gates["pull_request_required"] is True
    assert gates["review_required"] is True
    assert gates["ci_required"] is True


def test_allergen_filter_blocks_known_aliases():
    recipe = {"ingredients": ["rice", "soy lecithin", "broccoli"]}
    profile = {"allergens": ["soy"]}

    assert detect_allergen_conflicts(recipe["ingredients"], profile["allergens"]) == ["soy"]
    assert recipe_is_safe_for_profile(recipe, profile) is False


def test_safe_recipe_passes_allergen_filter():
    recipe = {"ingredients": ["rice", "broccoli", "olive oil"]}
    profile = {"allergens": ["peanut", "soy"]}

    assert recipe_is_safe_for_profile(recipe, profile) is True


def test_grocery_items_are_aggregated_by_name_and_unit():
    recipes = [
        {"ingredients": [{"name": "Rice", "quantity": 1, "unit": "cup"}]},
        {"ingredients": [{"name": "rice", "quantity": 2, "unit": "cup"}]},
        {"ingredients": [{"name": "Broccoli", "quantity": 1, "unit": "head"}]},
    ]

    assert aggregate_grocery_items(recipes) == [
        {"name": "broccoli", "quantity": 1.0, "unit": "head"},
        {"name": "rice", "quantity": 3.0, "unit": "cup"},
    ]


def test_expiry_window_is_inclusive_and_rejects_expired_items():
    assert is_near_expiry("2026-07-28", "2026-07-28") is True
    assert is_near_expiry("2026-07-31", "2026-07-28") is True
    assert is_near_expiry("2026-08-01", "2026-07-28") is False
    assert is_near_expiry("2026-07-27", "2026-07-28") is False
