# CISC 594: Software Testing Principles and Techniques

This repository contains coursework and the semester project for CISC 594 at
Harrisburg University of Science and Technology. The work applies software
quality assurance, risk management, configuration management, and system
testing practices to the PantryPilot project and the Therac-25 case study.

## Semester Project: PantryPilot

PantryPilot is a smart meal and grocery planning concept designed around user
dietary constraints, recipe ingredients, grocery-list aggregation, and pantry
expiry rules. The executable project baseline demonstrates how safety-critical
logic and release evidence can be managed with disciplined software quality
practices.

The current `1.1.0` baseline includes:

- Version-controlled application and quality-gate configuration.
- Deterministic allergen-conflict detection.
- Recipe safety checks against a user's allergy profile.
- Grocery item aggregation by ingredient and unit.
- Pantry-expiry boundary handling.
- Automated regression tests and a manual system-test runner.
- GitHub Actions CI, release notes, branching guidance, and a CM plan.

See the [detailed PantryPilot README](PantryPilot_CM_Generic_Files/README.md)
for setup instructions, commands, test scenarios, release history, risk
controls, limitations, and future work.

## Repository Guide

| Path | Contents |
|---|---|
| `PantryPilot_CM_Generic_Files/` | Executable PantryPilot source, tests, configuration, CI, CM documentation, and release records. |
| `PantryPilot_*Report*` | PantryPilot risk management, configuration management, and system testing reports in editable and submission formats. |
| `PantryPilot_Final_Project_Presentation_*` | Final project presentation in PowerPoint and PDF formats. |
| `Therac25_*` | Therac-25 SQA review, risk analysis, source packet, spreadsheet, and rendered deliverables. |
| `build_*.py` and `build_*.mjs` | Reproducible scripts used to generate course documents and supporting artifacts. |
| `Course Syllabus.docx` | Course syllabus retained with the coursework archive. |

## Run PantryPilot

From the repository root:

```bash
cd PantryPilot_CM_Generic_Files
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python src/pantrypilot_app.py
```

Expected application output:

```text
PantryPilot 1.1.0: Safety & Grocery Controls
```

Run the automated and system-level checks:

```bash
python -m pytest
python system_test_runner.py
```

## Quality and Configuration Management

The PantryPilot baseline treats source, tests, runtime configuration, CI,
release records, and CM documentation as controlled configuration items.
Changes are expected to move through a feature branch, test execution, pull
request review, CI validation, merge to `main`, and a tagged release baseline.

The principal quality rule is that generated or optimized meal advice must not
become user-facing until deterministic safety controls validate it. This rule
connects the project's risk analysis to its implementation and regression
tests.

## Academic Context

- Course: CISC 594, Software Testing Principles and Techniques
- Program: M.S. in Software Engineering
- Student: Zixuan Liang
- Term: Summer 2026

Course submissions are retained in both editable source formats and final PDF
formats to preserve traceability between authored work and submitted evidence.
