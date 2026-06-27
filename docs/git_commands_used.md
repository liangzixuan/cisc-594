# Generic Git Commands for the PantryPilot CM Exercise

These commands show how the generic files would be placed under configuration
management in GitHub.

## Beginner Level

```sh
git init
git add README.md VERSION CHANGELOG.md config src tests docs releases .github
git commit -m "Initial PantryPilot CM baseline"
git branch -M main
git remote add origin https://github.com/your-username/PantryPilot-CM.git
git push -u origin main
```

## Intermediate Level

```sh
git checkout -b feature/cm-baseline-docs
git add docs/configuration_management_plan.md docs/branching_strategy.md
git commit -m "Add CM plan and branching strategy"
git push origin feature/cm-baseline-docs
```

Then open a pull request from `feature/cm-baseline-docs` into `main`.

## Expert Level

```sh
git add .github/workflows/ci.yml CHANGELOG.md releases/release_notes_v1.0.0.md
git commit -m "Add CI workflow and release documentation"
git push origin main
git tag -a v1.0.0 -m "Release PantryPilot CM baseline v1.0.0"
git push origin v1.0.0
```
