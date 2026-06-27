# PantryPilot Configuration Management Plan

## 1. Scope

This CM plan applies to PantryPilot project artifacts, including source code,
configuration files, requirements, tests, release notes, and operational
documentation. The objective is to keep every change traceable from request to
review, test, merge, and release.

## 2. Configuration Items

| Configuration item | Location | Control method |
|---|---|---|
| Source code | `src/` | Pull request review and CI |
| Tests | `tests/` | Pull request review and CI |
| Runtime configuration | `config/` | Version-controlled JSON and environment template |
| CM documentation | `docs/` | Review before merge |
| Release records | `CHANGELOG.md`, `releases/` | Updated before tagging |
| CI workflow | `.github/workflows/ci.yml` | Protected main branch |

## 3. Baselines

The current baseline is `v1.0.0`, representing the PantryPilot "Plan & Adapt"
scope. A baseline is created only after tests pass, release notes are updated,
and the change set is approved.

## 4. Change Control

1. Create a branch from `main`.
2. Make changes to the relevant configuration items.
3. Run tests locally.
4. Open a pull request using the project template.
5. Confirm CI passes.
6. Review changes against requirements and CM impact.
7. Merge after approval.
8. Update changelog and tag a release when a baseline is reached.

## 5. Status Accounting

Status is tracked through Git commit history, pull requests, CI results, tags,
and release notes. Each release must identify what changed, why it changed,
which tests were run, and whether any risks remain.

## 6. Configuration Audits

Before each tagged release, the project owner verifies:

- Version file matches the release tag.
- Changelog includes the release.
- CI workflow passes.
- Configuration files do not contain secrets.
- Test suite passes.
- Release notes describe the delivered baseline.

## 7. Roles

| Role | Responsibility |
|---|---|
| Project owner | Approves baselines, resolves conflicts, tags releases |
| Developer | Creates branches, commits changes, runs tests |
| Reviewer | Checks correctness, CM impact, and test evidence |
| CI workflow | Enforces automated checks before merge |
