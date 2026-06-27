# PantryPilot Configuration Management Repository

This generic repository demonstrates configuration management (CM) for the
PantryPilot semester project. PantryPilot is a smart meal and grocery planner
that maintains user dietary constraints, recipe data, weekly meal plans,
grocery lists, AI-assisted substitutions, nutrition optimization, and
pantry-aware planning.

## CM Purpose

Configuration management controls project artifacts so each release is
traceable, repeatable, reviewable, and recoverable. This repository uses
generic files to show how PantryPilot would manage:

- Source code
- Configuration files
- Requirements and CM documentation
- Tests
- Pull requests and review records
- CI checks
- Version tags and release notes

## Repository Structure

```text
PantryPilot_CM_Generic_Files/
  README.md
  VERSION
  CHANGELOG.md
  requirements.txt
  config/
    app_config.json
    environment.example
  docs/
    branching_strategy.md
    configuration_management_plan.md
    git_commands_used.md
  src/
    pantrypilot_app.py
  tests/
    test_smoke.py
  releases/
    release_notes_v1.0.0.md
  .github/
    pull_request_template.md
    workflows/ci.yml
```

## CM Levels Demonstrated

Beginner CM:
Repository initialization, README, basic source/config files, staged commits,
and push-ready structure.

Intermediate CM:
Branching strategy, pull-request template, review checklist, and controlled
merge expectations.

Expert CM:
Automated CI workflow, version file, changelog, and release notes for a tagged
release.

## Current Baseline

- Baseline: `v1.0.0`
- Release name: PantryPilot Plan & Adapt
- Configuration owner: Zixuan Liang
- Course: CISC 594 Software Testing Principles and Techniques
