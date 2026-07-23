"""Manual system-test runner for the PantryPilot system testing report."""

from __future__ import annotations

from src.pantrypilot_app import (
    aggregate_grocery_items,
    describe_release,
    detect_allergen_conflicts,
    is_near_expiry,
    load_config,
    recipe_is_safe_for_profile,
)


def run_system_tests() -> list[dict]:
    config = load_config()
    tests = [
        {
            "id": "V1-ST-01",
            "description": "Load the release configuration and display release identity.",
            "expected": "PantryPilot 1.1.0: Safety & Grocery Controls",
            "actual": describe_release(config),
            "expected_value": "PantryPilot 1.1.0: Safety & Grocery Controls",
        },
        {
            "id": "V1-ST-02",
            "description": "Confirm release quality gates are enabled.",
            "expected": "unit, PR, review, and CI gates enabled",
            "actual": ", ".join(
                gate for gate, enabled in sorted(config["quality_gates"].items()) if enabled
            ),
            "expected_value": "ci_required, pull_request_required, review_required, unit_tests_required",
        },
        {
            "id": "V1-ST-03",
            "description": "Consolidate duplicate grocery items from multiple recipes.",
            "expected": "rice quantity is aggregated to 3.0 cup",
            "actual": aggregate_grocery_items(
                [
                    {"ingredients": [{"name": "Rice", "quantity": 1, "unit": "cup"}]},
                    {"ingredients": [{"name": "rice", "quantity": 2, "unit": "cup"}]},
                ]
            ),
            "expected_value": [{"name": "rice", "quantity": 3.0, "unit": "cup"}],
        },
        {
            "id": "V1.1-ST-01",
            "description": "Block unsafe generated recipe output containing a known allergen alias.",
            "expected": "soy conflict detected; recipe is unsafe",
            "actual": {
                "conflicts": detect_allergen_conflicts(
                    ["rice", "soy lecithin", "broccoli"], ["soy"]
                ),
                "safe": recipe_is_safe_for_profile(
                    {"ingredients": ["rice", "soy lecithin", "broccoli"]},
                    {"allergens": ["soy"]},
                ),
            },
            "expected_value": {"conflicts": ["soy"], "safe": False},
        },
        {
            "id": "V1.1-ST-02",
            "description": "Allow recipe output when no declared allergen is present.",
            "expected": "recipe is safe",
            "actual": recipe_is_safe_for_profile(
                {"ingredients": ["rice", "broccoli", "olive oil"]},
                {"allergens": ["soy", "peanut"]},
            ),
            "expected_value": True,
        },
        {
            "id": "V1.1-ST-03",
            "description": "Evaluate pantry expiry boundary dates.",
            "expected": "today and +3 days are near-expiry; yesterday and +4 days are not",
            "actual": {
                "today": is_near_expiry("2026-08-14", "2026-08-14"),
                "plus_3": is_near_expiry("2026-08-17", "2026-08-14"),
                "plus_4": is_near_expiry("2026-08-18", "2026-08-14"),
                "yesterday": is_near_expiry("2026-08-13", "2026-08-14"),
            },
            "expected_value": {
                "today": True,
                "plus_3": True,
                "plus_4": False,
                "yesterday": False,
            },
        },
    ]

    for test in tests:
        test["result"] = "PASS" if test["actual"] == test.pop("expected_value") else "FAIL"
    return tests


if __name__ == "__main__":
    for item in run_system_tests():
        print(f"{item['id']}: {item['result']}")
        print(f"  description: {item['description']}")
        print(f"  expected: {item['expected']}")
        print(f"  actual: {item['actual']}")
