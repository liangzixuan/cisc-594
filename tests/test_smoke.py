from src.pantrypilot_app import describe_release, load_config


def test_config_loads_and_identifies_release():
    config = load_config()

    assert config["app_name"] == "PantryPilot"
    assert config["baseline_version"] == "1.0.0"
    assert describe_release(config) == "PantryPilot 1.0.0: Plan & Adapt"


def test_quality_gates_are_enabled_for_baseline():
    config = load_config()
    gates = config["quality_gates"]

    assert gates["unit_tests_required"] is True
    assert gates["pull_request_required"] is True
    assert gates["review_required"] is True
    assert gates["ci_required"] is True
