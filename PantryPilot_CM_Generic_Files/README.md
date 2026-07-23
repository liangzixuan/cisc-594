# PantryPilot

PantryPilot is a CISC 594 semester project that demonstrates how a smart meal
and grocery planning application can be managed with disciplined software
quality assurance practices. The repository contains a generic, executable
baseline for the project rather than a production web application. Its purpose
is to show traceable configuration management, risk-driven controls, release
baselines, CI checks, and system-level test evidence.

## Project Summary

PantryPilot helps a household plan meals while accounting for dietary
constraints, recipe ingredients, grocery-list aggregation, and pantry-expiry
rules. The larger product concept includes AI-assisted recipe substitutions and
future nutrition optimization. The current repository focuses on the safety and
configuration-management baseline needed before those higher-risk features are
expanded.

Key quality theme:

> AI or optimizer output should not directly become user-facing advice unless
> deterministic safety controls can verify it first.

## Current Baseline

| Item | Value |
|---|---|
| Application | PantryPilot |
| Current version | `1.1.0` |
| Release name | Safety & Grocery Controls |
| Main baseline tag | `v1.1.0` |
| Previous baseline tag | `v1.0.0` |
| Configuration owner | Zixuan Liang |
| Course | CISC 594 Software Testing Principles and Techniques |

## Features Demonstrated

The current executable baseline demonstrates:

- Release configuration loading from a version-controlled JSON file.
- Stable release identity reporting.
- Required quality-gate configuration checks.
- Deterministic allergen-conflict detection for generated recipe output.
- Recipe safety evaluation against a user allergy profile.
- Grocery item aggregation by canonical ingredient name and unit.
- Pantry-expiry boundary logic using an inclusive near-expiry window.
- Automated regression tests with `pytest`.
- A manual system-test runner for release-level evidence.
- A local web interface for demonstrating safety, grocery, pantry, and quality
  workflows without external services.

The broader product concept also includes:

- User dietary profiles and preferences.
- Recipe library and external recipe ingestion.
- Weekly meal planning.
- AI-assisted substitutions.
- Future nutrition optimization.
- Future pantry-aware meal ranking.

## Repository Structure

```text
PantryPilot_CM_Generic_Files/
  README.md
  VERSION
  CHANGELOG.md
  requirements.txt
  system_test_runner.py
  templates/
    index.html
  static/
    app.js
    styles.css
    assets/
  src/
    pantrypilot_app.py
    web_app.py
  config/
    app_config.json
    environment.example
  docs/
    branching_strategy.md
    configuration_management_plan.md
    git_commands_used.md
  releases/
    release_notes_v1.0.0.md
    release_notes_v1.1.0.md
  tests/
    test_smoke.py
    test_web_app.py
```

Repository-level GitHub configuration is stored at
`../.github/pull_request_template.md` and
`../.github/workflows/pantrypilot-ci.yml` because `CISC-594` is the GitHub
repository root.

## Main Source Files

| File | Purpose |
|---|---|
| `src/pantrypilot_app.py` | Generic PantryPilot application functions used by tests and system scenarios. |
| `src/web_app.py` | Flask application and deterministic API endpoints used by the demonstration UI. |
| `templates/index.html` | Single-screen PantryPilot demo with Plan, Grocery, Pantry, and Quality views. |
| `static/app.js` | Browser interactions and API integration for the demo. |
| `static/styles.css` | Responsive presentation styling for desktop and mobile. |
| `config/app_config.json` | Version-controlled application baseline, feature flags, and quality-gate settings. |
| `tests/test_smoke.py` | Automated smoke/regression tests for release identity, gates, allergen filtering, grocery aggregation, and expiry logic. |
| `system_test_runner.py` | Manual system-level test runner used as evidence in the system testing report. |
| `../.github/workflows/pantrypilot-ci.yml` | Repository-level GitHub Actions workflow that installs dependencies and runs the PantryPilot test suites. |
| `CHANGELOG.md` | Status accounting record for release-level changes. |
| `docs/configuration_management_plan.md` | Configuration item, baseline, change-control, status-accounting, and audit plan. |

## Requirements

- Python 3.11 or later for local execution.
- Python 3.12 in GitHub Actions CI.
- `pip`.
- Flask for the local web demonstration.
- `pytest` for automated tests.

Declared Python dependencies are pinned in `requirements.txt`.

## Setup

From the PantryPilot project directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If you do not want to create a virtual environment, you can still install the
test dependency in your active Python environment:

```bash
python -m pip install -r requirements.txt
```

## Run the Application Baseline

The generic app entry point prints the configured release identity:

```bash
python src/pantrypilot_app.py
```

Expected output:

```text
PantryPilot 1.1.0: Safety & Grocery Controls
```

## Run the Web Demo

From the PantryPilot project directory:

```bash
python -m src.web_app
```

Open `http://127.0.0.1:5000` in a browser. The demo begins with a soy allergy
enabled and the ginger tofu recipe selected, making the safety gate's blocking
decision immediately visible.

Suggested live-demo sequence:

1. In **Plan**, show that soy sauce blocks the tofu bowl, then clear the Soy
   checkbox to show the same recipe pass the deterministic safety gate.
2. In **Grocery**, generate the combined list and point out that three separate
   olive-oil entries become one `3 tbsp` item.
3. In **Pantry**, change the use-soon window from three to five days and show
   how the boundary classification changes.
4. In **Quality**, run the release checks and show all six system scenarios
   passing against the controlled `1.1.0` baseline.

## Run Automated Tests

```bash
python -m pytest
```

The test suite verifies:

- Configuration loads and reports the correct release.
- Required quality gates are enabled.
- Known allergen aliases are blocked.
- Safe recipes pass the allergen filter.
- Duplicate grocery items are aggregated by name and unit.
- Pantry-expiry logic handles boundary dates correctly.

## Run System Tests

The manual system-test runner executes release-level scenarios and prints the
expected and actual result for each scenario:

```bash
python system_test_runner.py
```

Current system scenarios:

| ID | Scenario | Expected result |
|---|---|---|
| `V1-ST-01` | Load release configuration and display release identity. | `PantryPilot 1.1.0: Safety & Grocery Controls` |
| `V1-ST-02` | Confirm release quality gates are enabled. | Unit, pull request, review, and CI gates enabled. |
| `V1-ST-03` | Consolidate duplicate grocery items from multiple recipes. | Rice aggregates to `3.0 cup`. |
| `V1.1-ST-01` | Block generated recipe output containing a known allergen alias. | Soy conflict detected and recipe marked unsafe. |
| `V1.1-ST-02` | Allow recipe output when no declared allergen is present. | Recipe marked safe. |
| `V1.1-ST-03` | Evaluate pantry-expiry boundary dates. | Today and +3 days are near-expiry; yesterday and +4 days are not. |

## Configuration Management Approach

This repository demonstrates the configuration-management workflow used for the
semester project:

1. Keep controlled artifacts in version control.
2. Create feature branches from `main`.
3. Make scoped changes to source, tests, config, and documentation.
4. Run local tests before review.
5. Open a pull request using the project template.
6. Require review and CI checks before merge.
7. Update `CHANGELOG.md` and release notes.
8. Tag stable baselines such as `v1.0.0` and `v1.1.0`.

Controlled configuration items include:

- Source code in `src/`.
- Automated tests in `tests/`.
- System-test runner in `system_test_runner.py`.
- Runtime configuration in `config/`.
- CI workflow in `.github/workflows/pantrypilot-ci.yml` at the CISC-594 repository root.
- CM documentation in `docs/`.
- Release records in `CHANGELOG.md` and `releases/`.

See `docs/configuration_management_plan.md` and
`docs/branching_strategy.md` for the full process.

## Release History

### `v1.1.0` - Safety & Grocery Controls

Added:

- Deterministic allergen-conflict detection.
- Recipe safety evaluation against profile allergens.
- Grocery aggregation by canonical item name and unit.
- Inclusive pantry-expiry boundary logic.
- Regression tests for the new safety and grocery controls.
- Release notes for the safety-control baseline.

### `v1.0.0` - Plan & Adapt Baseline

Added:

- Initial CM repository structure.
- Basic app configuration.
- Generic application entry point.
- Smoke tests.
- CI workflow.
- Branching strategy and CM plan.
- Release notes for the first baseline.

## Risk Controls Represented in This Repository

| Risk | Control in this baseline |
|---|---|
| Unsafe AI-generated recipe output reaches an allergic user. | Deterministic allergen conflict detection and regression tests. |
| Grocery list quantities become incorrect when recipes overlap. | Canonical grocery aggregation by ingredient name and unit. |
| Pantry expiry logic mishandles boundary dates. | Inclusive near-expiry function and boundary tests. |
| Changes are released without traceability. | Branching strategy, CI, changelog, release notes, and tags. |
| Configuration files expose unsafe or inconsistent settings. | Version-controlled config and environment template. |

## CI/CD

GitHub Actions is configured in `.github/workflows/pantrypilot-ci.yml` at the
CISC-594 repository root.

The workflow:

1. Checks out the repository.
2. Sets up Python 3.12.
3. Installs dependencies from `requirements.txt`.
4. Runs `pytest` and the manual system-test runner.

This is intentionally lightweight because the repository is a generic CM and
SQA demonstration baseline.

## Known Limitations

This repository is not a full production PantryPilot application. It does not
currently include:

- Web or mobile user interface.
- Authentication or persistent user accounts.
- Database storage.
- Live external recipe API calls.
- Live AI model integration.
- Production nutrition optimization solver.
- Deployment infrastructure.

Those features are part of the future product direction and should be added
only after the safety, CM, and testing controls remain stable.

## Suggested Future Work

- Add a small API layer for recipe and profile operations.
- Add persistent storage for profiles, recipes, pantry inventory, and meal
  plans.
- Add recorded fixtures for external recipe API responses.
- Add property-based tests for grocery aggregation and date boundaries.
- Add a bounded nutrition optimization prototype with explicit relaxation
  rules.
- Add end-to-end tests once a UI or API service exists.
- Add security checks for secrets, dependency vulnerabilities, and profile-data
  handling.

## Academic Context

This repository was prepared for CISC 594, Software Testing Principles and
Techniques. The emphasis is on software quality practices: requirements,
configuration management, risk management, release baselines, and system
testing.

Prepared by Zixuan Liang.
