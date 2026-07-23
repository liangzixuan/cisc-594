from src.web_app import create_app


def client():
    app = create_app()
    app.config.update(TESTING=True)
    return app.test_client()


def test_demo_page_and_release_data_are_available():
    test_client = client()

    page = test_client.get("/")
    data = test_client.get("/api/demo-data").get_json()

    assert page.status_code == 200
    assert b"PantryPilot" in page.data
    assert data["release"]["version"] == "1.1.0"
    assert len(data["recipes"]) == 3


def test_recipe_endpoint_blocks_known_soy_alias():
    response = client().post(
        "/api/check-recipe",
        json={"recipe_id": "tofu-bowl", "allergens": ["soy"]},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "recipe_id": "tofu-bowl",
        "recipe_name": "Ginger tofu rice bowl",
        "conflicts": ["soy"],
        "safe": False,
        "decision": "blocked",
    }


def test_grocery_endpoint_consolidates_shared_items():
    response = client().post(
        "/api/grocery-list",
        json={"recipe_ids": ["tofu-bowl", "chickpea-bowl", "tomato-pasta"]},
    )
    payload = response.get_json()

    olive_oil = next(item for item in payload["items"] if item["name"] == "olive oil")
    tomato = next(item for item in payload["items"] if item["name"] == "tomato")

    assert response.status_code == 200
    assert payload["recipe_count"] == 3
    assert olive_oil == {"name": "olive oil", "quantity": 3.0, "unit": "tbsp"}
    assert tomato == {"name": "tomato", "quantity": 4.0, "unit": "each"}


def test_pantry_endpoint_applies_inclusive_three_day_window():
    response = client().post(
        "/api/pantry-status",
        json={"today": "2026-08-14", "window_days": 3},
    )
    payload = response.get_json()
    statuses = {item["name"]: item["status"] for item in payload["items"]}

    assert response.status_code == 200
    assert payload["use_soon_count"] == 2
    assert payload["expired_count"] == 1
    assert statuses["Broccoli"] == "use-soon"
    assert statuses["Tofu"] == "use-soon"
    assert statuses["Spinach"] == "fresh"
    assert statuses["Lemon"] == "expired"


def test_quality_endpoint_executes_release_scenarios():
    response = client().get("/api/quality-summary")
    payload = response.get_json()

    assert response.status_code == 200
    assert payload["status"] == "passed"
    assert payload["passed"] == payload["total"] == 6
    assert all(scenario["result"] == "PASS" for scenario in payload["scenarios"])
