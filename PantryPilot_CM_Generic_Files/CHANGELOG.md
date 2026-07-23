# Changelog

All notable PantryPilot configuration-management changes are recorded here.

## [Unreleased]

### Added

- Flask demonstration UI for weekly planning, grocery aggregation, pantry
  expiry status, and release-quality evidence.
- Interactive allergen profile controls backed by the deterministic recipe
  safety gate.
- API-level regression tests for the web presentation layer.
- Project-local recipe photography and Lucide icon runtime for an offline demo.

### Changed

- System-test results are now calculated from expected and actual values rather
  than assigned a fixed display status.

## [1.1.0] - 2026-08-04

### Added

- Deterministic allergen-conflict detection for generated recipe output.
- Grocery aggregation logic for canonical item names and units.
- Inclusive pantry-expiry window check for boundary-date testing.
- Regression tests covering safety filtering, grocery aggregation, and expiry logic.

### Configuration Baseline

- Baseline tag: `v1.1.0`
- Release type: Controlled feature-branch update
- Change authority: Individual project owner

## [1.0.0] - 2026-07-14

### Added

- Initial CM baseline for PantryPilot generic project files.
- README describing repository purpose and artifact structure.
- Application configuration file for version-controlled runtime settings.
- Generic Python source file representing the project entry point.
- Smoke test to demonstrate CI verification.
- Branching strategy and CM plan documentation.
- Pull-request template for controlled change review.
- GitHub Actions CI workflow.
- Release notes for the `v1.0.0` baseline.

### Configuration Baseline

- Baseline tag: `v1.0.0`
- Release type: Course project CM exercise
- Change authority: Individual project owner
