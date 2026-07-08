# PantryPilot Branching Strategy

## Main Branch

`main` contains the current approved baseline. Direct commits to `main` are not
allowed in the project CM process.

## Feature Branches

Feature branches use this pattern:

```text
feature/<short-description>
```

Examples:

- `feature/recipe-normalization`
- `feature/grocery-list-generation`
- `feature/allergen-safety-filter`

## Fix Branches

Fix branches use this pattern:

```text
fix/<short-description>
```

Examples:

- `fix/unit-conversion-rounding`
- `fix/allergen-alias-match`

## Release Tags

Release tags use semantic versioning:

```text
vMAJOR.MINOR.PATCH
```

Example:

```text
v1.0.0
```

## Merge Rule

All changes merge through pull requests. A pull request must include the reason
for the change, affected configuration items, testing evidence, and rollback
notes.
