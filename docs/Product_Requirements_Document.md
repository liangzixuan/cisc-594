# PantryPilot Product Requirements Document

## Cover Page

| Field | Value |
|---|---|
| Project Name | PantryPilot |
| Student | Zixuan Liang |
| Course | CISC 594 - Software Testing Principles and Techniques |
| Semester | Summer 2026 |
| Repository URL | https://github.com/liangzixuan/cisc-594 |
| Current Branch | `main` |
| Current Commit SHA | `c08567f762e7bbe91a885a962cd1c85d6929c0bc` (application baseline at final review; the later document-only commit is identified in GitHub history and submission metadata) |
| Current Release Version | Backend baseline `1.1.0`; Flask web demonstration is Unreleased |
| Document Version | 1.2 |
| Last Updated | July 23, 2026 |
| Document Basis | Executable code, tests, configuration, change records, release records, and prior project documents |

The immutable Git commit containing this update is identified in the GitHub history and in the assignment submission metadata. A Git-tracked file cannot contain the hash of the commit that contains that same file because changing the embedded hash would create a different commit.

## Revision History

| Version | Date | Git Commit | Description | Author |
|---|---|---|---|---|
| 1.0 | July 21, 2026 | Working-tree artifact | Created the initial as-built PRD as `PantryPilot_Product_Requirements_Document_Zixuan_Liang.md`. | Zixuan Liang |
| 1.1 | July 23, 2026 | `9dfa7bf` | Preserved the as-built requirements and reorganized them as a living PRD with capability, undesirable-event, risk, mitigation, ABC-requirement, and traceability structures required by Prompt 01. | Zixuan Liang |
| 1.2 | July 23, 2026 | This document-only follow-up | Updated the cover page to identify the clean application baseline after the previously Unreleased working-tree artifacts were committed. | Zixuan Liang |

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Product Scope](#2-product-scope)
3. [Software Capabilities](#3-software-capabilities)
4. [Undesirable Events](#4-undesirable-events)
5. [Risk Analysis](#5-risk-analysis)
6. [Risk Prioritization](#6-risk-prioritization)
7. [Risk Mitigation](#7-risk-mitigation)
8. [Functional Requirements](#8-functional-requirements)
9. [Quality Requirements](#9-quality-requirements)
10. [Performance Requirements](#10-performance-requirements)
11. [Assumptions](#11-assumptions)
12. [Constraints](#12-constraints)
13. [External Interfaces](#13-external-interfaces)
14. [Requirements Traceability Matrix](#14-requirements-traceability-matrix)
15. [Future Versions](#15-future-versions)
16. [Open Issues](#16-open-issues)
17. [Glossary](#17-glossary)
18. [Appendix A: Business Rules](#appendix-a-business-rules)
19. [Appendix B: API Contracts](#appendix-b-api-contracts)
20. [Appendix C: Acceptance Scenarios](#appendix-c-acceptance-scenarios)
21. [Appendix D: Repository Evidence](#appendix-d-repository-evidence)

---

# 1. Product Vision

## 1.1 Problem Statement

Household meal planning requires people to reconcile recipes, dietary constraints, pantry inventory, expiry dates, and shopping quantities. Managing these concerns separately creates preventable safety and correctness failures:

- A candidate recipe can violate a declared allergen.
- Duplicate ingredients can produce inconsistent shopping quantities.
- An off-by-one expiry rule can omit food that should be used soon or promote expired food.
- A presentation layer can display a result that differs from the tested backend decision.

PantryPilot demonstrates how deterministic controls, explicit release evidence, and repeatable tests can reduce these risks before more complex optimization or AI behavior is introduced.

## 1.2 Intended Users

- **Household Planner:** Reviews the weekly meal plan, selects allergen constraints, creates a consolidated grocery list, and identifies pantry items that should be used soon.
- **Project Reviewer:** Inspects the controlled release identity, quality gates, repeatable system scenarios, and consistency between the browser demonstration and backend behavior.
- **Product Owner and Developer:** Maintains the code, requirements, tests, configuration items, release records, and risk controls.

## 1.3 Stakeholders

- Zixuan Liang, project owner, developer, tester, and document owner.
- Dr. Khalid Lateef, course instructor and project evaluator.
- A future household user whose safety, privacy, and planning needs drive the longer-term product direction.

## 1.4 Product Goals

1. Prevent a recipe containing a known allergen alias from being approved for a profile that declares that allergen.
2. Keep safety, grocery, expiry, and quality decisions in deterministic backend code rather than browser-only logic.
3. Consolidate grocery items by normalized name and unit.
4. Apply an explicit inclusive pantry expiry boundary.
5. Display release identity, required quality gates, and system-test evidence.
6. Provide a local, repeatable demonstration without a database or external runtime service.
7. Establish controlled foundations for future persistence, optimization, and generated recipe candidates.

## 1.5 Major Features

- Three-meal weekly plan presentation.
- Household allergen controls and deterministic recipe safety decisions.
- Grocery selection and quantity consolidation.
- Pantry expiry classification with selectable windows.
- Quality-gate and release-scenario presentation.
- Responsive local Flask web interface.
- Version-controlled configuration, tests, CI workflow, changelog, and release notes.

## 1.6 Planned Software Versions

| Version | Direction | Evidence Status |
|---|---|---|
| 1.1.0 | Tagged backend baseline for safety and grocery controls. | Implemented and represented by `VERSION`, configuration, core functions, tests, changelog, and release notes. |
| 1.2.0 candidate | Formalize the Flask browser demonstration as a reviewed release baseline. | Web implementation and tests exist under Unreleased; final release number and tag are **To Be Completed**. |
| 2.0.0 candidate | Add persistent profiles, editable recipes and pantry inventory, external recipe ingestion, and constraint-aware planning. | Planned in project documents; architecture and acceptance thresholds are **To Be Completed**. |
| 3.0.0 candidate | Add controlled recipe or substitution generation behind deterministic safety controls. | Product direction only; provider, model, data policy, and release criteria are **To Be Completed**. |

---

# 2. Product Scope

## 2.1 Included Functionality

The current repository includes:

- A Flask server bound to `127.0.0.1`.
- Three in-memory recipes and five in-memory pantry items.
- A fixed demonstration date of August 14, 2026.
- Version-controlled release and quality-gate configuration.
- Exact-match allergen alias normalization and conflict detection.
- Grocery aggregation by normalized item name and unit.
- Pantry classification as `expired`, `use-soon`, or `fresh`.
- JSON endpoints for demonstration data, recipe safety, grocery aggregation, pantry status, and quality evidence.
- Plan, Grocery, Pantry, and Quality browser views.
- A repeatable reset workflow.
- Eleven pytest tests and six formal system-test scenarios.

## 2.2 Excluded Functionality

The current executable baseline does not include:

- Authentication, authorization, or multi-user tenancy.
- Persistent profiles, plans, grocery lists, recipes, or pantry inventory.
- Recipe create, update, delete, search, or import workflows.
- A live recipe API, large-language-model service, or AI substitution workflow.
- Nutrition optimization or constraint solving.
- Pantry-driven plan modification or grocery subtraction.
- Unit conversion across different grocery units.
- Production deployment, monitoring, alerting, backup, recovery, or service-level objectives.
- Payment, ordering, delivery, notification, or calendar integrations.

## 2.3 Current Scope Assessment

| Product Area | Status | Code-Grounded Interpretation |
|---|---|---|
| Household allergen profile | Implemented for demonstration | Four browser checkboxes are held in memory; Soy is selected by default. |
| Recipe library | Partial | Three hard-coded recipes are displayed; storage, search, and CRUD are absent. |
| Weekly meal planning | Partial | Three dated meal cards are displayed; users cannot add, remove, reorder, or persist meals. |
| Allergen safety gate | Implemented | Backend alias matching returns approved or blocked decisions. |
| Grocery generation | Implemented | Selected recipes are consolidated by normalized item name and unit. |
| Pantry expiry status | Implemented | Five items are classified as fresh, use-soon, or expired. |
| Pantry-aware planning | Planned | Pantry status does not affect meal selection or grocery quantities. |
| AI substitutions | Not executable | A feature flag is true, but no model call, generator, or substitution workflow exists. |
| Nutrition optimization | Not implemented | The feature flag is false and no optimizer exists. |
| Quality evidence | Implemented | The UI displays configured gates and executes six release scenarios. |
| Data persistence | Not implemented | Application and browser state reset after refresh or restart. |

## 2.4 Future Enhancements

Future enhancements are described in Section 15. Until code and acceptance evidence exist, they remain planned and are not represented as current functionality.

---

# 3. Software Capabilities

## 3.1 Level-1 Capabilities

The product has seven Level-1 capabilities, which is within the Miller's Law target of approximately seven plus or minus two. Every capability begins with an action verb.

| ID | Level-1 Capability | Purpose |
|---|---|---|
| 1 | Manage Release and Demo Configuration | Control release identity, feature declarations, quality gates, and repeatable demonstration data. |
| 2 | Plan Household Meals | Present a weekly plan and capture household planning inputs while reserving controlled space for future planning logic. |
| 3 | Protect Users from Allergen Conflicts | Normalize safety terms, detect declared allergens, and prevent unsafe decisions from bypassing the backend gate. |
| 4 | Consolidate Grocery Requirements | Select recipe inputs, normalize grocery keys, and aggregate quantities. |
| 5 | Classify Pantry Expiry Status | Validate pantry inputs and classify items using explicit date boundaries. |
| 6 | Verify Release Quality | Load gates, execute scenarios, evaluate results, and expose release evidence. |
| 7 | Operate the Local Demonstration | Serve, validate, and present the responsive browser demonstration. |

## 3.2 Level-2 Capabilities

### 1. Manage Release and Demo Configuration

| ID | Level-2 Capability | Status | Repository Evidence |
|---|---|---|---|
| 1.1 | Load Controlled Configuration | Implemented | `config/app_config.json`, `src/pantrypilot_app.py` |
| 1.2 | Supply Versioned Demo Data | Implemented | `src/web_app.py` |
| 1.3 | Control Release Scope | Partial | `VERSION`, `CHANGELOG.md`, release notes, configuration feature flags |

### 2. Plan Household Meals

| ID | Level-2 Capability | Status | Repository Evidence |
|---|---|---|---|
| 2.1 | Display Weekly Plan | Partial | Three in-memory recipe cards in `src/web_app.py` and Plan rendering in `static/app.js` |
| 2.2 | Select Household Planning Inputs | Partial | Allergen and recipe controls in `templates/index.html` and `static/app.js`; no persistence |
| 2.3 | Restore Default Planning State | Implemented | Reset behavior in `static/app.js` |
| 2.4 | Generate Constraint-Aware Plans | Planned | No optimizer exists; configuration sets `nutrition_optimization` to false |
| 2.5 | Import Recipe Data | Planned | No external recipe client or ingestion pipeline exists |

### 3. Protect Users from Allergen Conflicts

| ID | Level-2 Capability | Status | Repository Evidence |
|---|---|---|---|
| 3.1 | Normalize Safety Terms | Implemented | `ingredient_tokens()` |
| 3.2 | Detect Allergen Conflicts | Implemented | `DEFAULT_ALLERGEN_ALIASES`, `detect_allergen_conflicts()` |
| 3.3 | Enforce Backend Safety Decisions | Implemented | `recipe_is_safe_for_profile()`, `/api/check-recipe`, endpoint tests |
| 3.4 | Filter Generated Candidates | Planned | Deterministic filter exists, but no executable candidate generator exists |

### 4. Consolidate Grocery Requirements

| ID | Level-2 Capability | Status | Repository Evidence |
|---|---|---|---|
| 4.1 | Select Contributing Recipes | Implemented | Grocery controls and `/api/grocery-list` |
| 4.2 | Normalize Grocery Keys | Implemented | `aggregate_grocery_items()` |
| 4.3 | Aggregate Grocery Quantities | Implemented | `aggregate_grocery_items()`, pytest and system-test evidence |

### 5. Classify Pantry Expiry Status

| ID | Level-2 Capability | Status | Repository Evidence |
|---|---|---|---|
| 5.1 | Parse and Validate Pantry Inputs | Implemented | `parse_iso_date()`, `/api/pantry-status` validation |
| 5.2 | Apply Inclusive Expiry Rules | Implemented | `is_near_expiry()`, `_pantry_status()` |
| 5.3 | Present Pantry Classifications | Implemented | Pantry endpoint and browser Pantry view |
| 5.4 | Apply Pantry Status to Planning | Planned | Pantry status does not modify recipes, plans, or grocery quantities |

### 6. Verify Release Quality

| ID | Level-2 Capability | Status | Repository Evidence |
|---|---|---|---|
| 6.1 | Load Required Quality Gates | Implemented | `config/app_config.json`, smoke test |
| 6.2 | Execute and Evaluate Release Scenarios | Implemented | `system_test_runner.py`, `/api/quality-summary` |
| 6.3 | Present Verification Evidence | Implemented | Quality view and endpoint tests |

### 7. Operate the Local Demonstration

| ID | Level-2 Capability | Status | Repository Evidence |
|---|---|---|---|
| 7.1 | Serve and Navigate the Local Interface | Implemented under Unreleased | `src/web_app.py`, `templates/index.html`, `static/app.js` |
| 7.2 | Validate API Requests | Implemented | Flask route validation and error responses |
| 7.3 | Report Startup Failures | Implemented | Initialization error state in `static/app.js` |
| 7.4 | Support Responsive Interaction | Implemented with limits | CSS breakpoints, labels, landmarks, focus styles, and local visual checks |

---

# 4. Undesirable Events

Every Level-2 capability has at least one undesirable event. Planned capabilities are labeled so that prospective risks are not mistaken for completed functionality.

| UE ID | Level-2 Capability | Undesirable Event |
|---|---|---|
| UE-1.1-01 | 1.1 Load Controlled Configuration | The configuration is missing, malformed, or interpreted incorrectly, producing a startup failure or incorrect release identity. |
| UE-1.2-01 | 1.2 Supply Versioned Demo Data | The initialization payload omits or contradicts the versioned recipes, pantry items, profile, gates, or demo date. |
| UE-1.3-01 | 1.3 Control Release Scope | Planned V2 behavior is presented as released, or Unreleased web changes are tagged without satisfying the documented gates. |
| UE-2.1-01 | 2.1 Display Weekly Plan | A planned meal is missing, duplicated, or associated with the wrong day or description. |
| UE-2.2-01 | 2.2 Select Household Planning Inputs | The selected recipe or allergen state is not applied to the next backend evaluation. |
| UE-2.2-02 | 2.2 Select Household Planning Inputs | Sensitive dietary or allergy information is unnecessarily exposed in source, fixtures, logs, configuration, or future external prompts. |
| UE-2.3-01 | 2.3 Restore Default Planning State | Reset leaves stale profile, grocery, pantry-window, quality, or navigation state. |
| UE-2.4-01 | 2.4 Generate Constraint-Aware Plans | A future optimizer returns no feasible plan, exceeds its time bound, or hides relaxed constraints. |
| UE-2.5-01 | 2.5 Import Recipe Data | A future external recipe source is unavailable, rate-limited, incomplete, or inconsistent with the canonical schema. |
| UE-3.1-01 | 3.1 Normalize Safety Terms | Whitespace, case, or an expected alias is normalized incorrectly and causes inconsistent safety comparisons. |
| UE-3.2-01 | 3.2 Detect Allergen Conflicts | A declared allergen or supported alias is not detected in a recipe. |
| UE-3.3-01 | 3.3 Enforce Backend Safety Decisions | An unsafe recipe is approved or the browser displays a decision that differs from the backend response. |
| UE-3.4-01 | 3.4 Filter Generated Candidates | A future nondeterministic recipe or substitution candidate bypasses deterministic filtering and reaches the user with a declared allergen. |
| UE-4.1-01 | 4.1 Select Contributing Recipes | An excluded recipe contributes items, or a selected recipe is omitted from the grocery request. |
| UE-4.2-01 | 4.2 Normalize Grocery Keys | Equivalent items remain split, or quantities with different units are merged without a defined conversion. |
| UE-4.3-01 | 4.3 Aggregate Grocery Quantities | Consolidated quantities are incorrect or an empty selection produces fabricated grocery items. |
| UE-5.1-01 | 5.1 Parse and Validate Pantry Inputs | An invalid date or window is accepted, a valid input is rejected, or an out-of-range window reaches classification logic. |
| UE-5.2-01 | 5.2 Apply Inclusive Expiry Rules | An off-by-one boundary marks expired food as usable or fails to identify an item expiring today or at the selected boundary. |
| UE-5.3-01 | 5.3 Present Pantry Classifications | Visible item statuses or summary counts differ from the pantry endpoint response. |
| UE-5.4-01 | 5.4 Apply Pantry Status to Planning | A future pantry-aware plan recommends an expired item or fails to account for a verified use-soon item. |
| UE-6.1-01 | 6.1 Load Required Quality Gates | A required unit, pull-request, review, or CI gate is absent, disabled, or reported incorrectly. |
| UE-6.2-01 | 6.2 Execute and Evaluate Release Scenarios | A scenario is reported as passing without comparing its actual value with its expected value. |
| UE-6.3-01 | 6.3 Present Verification Evidence | The Quality view misstates scenario details, pass totals, release identity, or overall status. |
| UE-7.1-01 | 7.1 Serve and Navigate the Local Interface | The server, route, asset, or view navigation fails during the local demonstration, or the UI contradicts the backend. |
| UE-7.2-01 | 7.2 Validate API Requests | A malformed request produces a fabricated success, an unhandled exception, or an incorrect status code. |
| UE-7.3-01 | 7.3 Report Startup Failures | Initialization failure remains hidden and leaves the interface in a misleading partial state. |
| UE-7.4-01 | 7.4 Support Responsive Interaction | Content overlaps, controls become unreachable, or text becomes unreadable at a supported viewport. |

---

# 5. Risk Analysis

Likelihood and impact use the required 1-5 scales. Risk Score equals Likelihood multiplied by Impact.

**Likelihood:** 1 Rare, 2 Unlikely, 3 Possible, 4 Likely, 5 Almost Certain.

**Impact:** 1 Negligible, 2 Minor, 3 Moderate, 4 Major, 5 Catastrophic.

| UE ID | Risk Statement | Likelihood | Impact | Risk Score |
|---|---|---:|---:|---:|
| UE-1.1-01 | Configuration defects can prevent startup or cause reviewers to evaluate an incorrect release baseline. | 2 | 4 | 8 |
| UE-1.2-01 | Inconsistent initialization data can make UI behavior and documented acceptance results nonreproducible. | 2 | 3 | 6 |
| UE-1.3-01 | Weak scope control can merge planned AI or optimizer work before the verified V1 baseline is complete. | 2 | 4 | 8 |
| UE-2.1-01 | Incorrect meal-card data can mislead the household planner and weaken demonstration credibility. | 2 | 3 | 6 |
| UE-2.2-01 | Stale selection state can evaluate the wrong recipe or allergen profile and display a misleading decision. | 2 | 4 | 8 |
| UE-2.2-02 | Dietary, allergy, or health-target information can be exposed through development artifacts or future integrations. | 3 | 4 | 12 |
| UE-2.3-01 | An incomplete reset can make repeated demonstrations produce different results. | 2 | 2 | 4 |
| UE-2.4-01 | A future constrained optimizer can be infeasible or too slow under combined nutrition, allergy, and pantry constraints. | 4 | 5 | 20 |
| UE-2.5-01 | A future external recipe dependency can fail, change schema, or omit data and destabilize ingestion and tests. | 4 | 4 | 16 |
| UE-3.1-01 | Incorrect normalization can allow equivalent safety terms to produce different results. | 3 | 4 | 12 |
| UE-3.2-01 | A missed supported allergen alias can allow an unsafe recipe to pass the deterministic gate. | 3 | 5 | 15 |
| UE-3.3-01 | A backend or presentation defect can approve or display a recipe that violates the declared profile. | 3 | 5 | 15 |
| UE-3.4-01 | Future nondeterministic output is expected to contain unsafe or unverified candidates unless every candidate is filtered before display. | 5 | 5 | 25 |
| UE-4.1-01 | Recipe-selection mismatch can omit needed items or include unwanted items in the grocery list. | 2 | 3 | 6 |
| UE-4.2-01 | Incorrect canonicalization or unsupported unit merging can corrupt grocery totals. | 3 | 3 | 9 |
| UE-4.3-01 | Aggregation defects can create incorrect purchase quantities and reduce user trust. | 3 | 3 | 9 |
| UE-5.1-01 | Invalid pantry input can reach date logic and produce an incorrect or failed response. | 2 | 4 | 8 |
| UE-5.2-01 | Expiry boundary defects can promote expired food or fail to prioritize near-expiry food. | 3 | 5 | 15 |
| UE-5.3-01 | Presentation mismatch can hide an expiry classification or count that the backend calculated correctly. | 2 | 4 | 8 |
| UE-5.4-01 | Future pantry-aware planning can recommend expired food or ignore verified expiry priority. | 3 | 5 | 15 |
| UE-6.1-01 | Missing or misreported quality gates can allow an uncontrolled baseline to appear release-ready. | 2 | 4 | 8 |
| UE-6.2-01 | A false PASS can conceal a release defect and invalidate the stated testing outcome. | 2 | 5 | 10 |
| UE-6.3-01 | Incorrect visible evidence can cause a reviewer to accept or reject the wrong release state. | 2 | 3 | 6 |
| UE-7.1-01 | Local server, asset, navigation, or UI/backend consistency failure can prevent a reliable project demonstration. | 2 | 4 | 8 |
| UE-7.2-01 | Weak request validation can return fabricated success or expose an unhandled error path. | 2 | 3 | 6 |
| UE-7.3-01 | Hidden startup failure can leave the user acting on incomplete data. | 2 | 3 | 6 |
| UE-7.4-01 | Responsive defects can make a required workflow unusable on a small screen. | 2 | 2 | 4 |

---

# 6. Risk Prioritization

All undesirable events are sorted from highest to lowest Risk Score. Ties are ordered by UE ID for deterministic presentation.

| Priority | UE ID | Risk Score |
|---:|---|---:|
| 1 | UE-3.4-01 | 25 |
| 2 | UE-2.4-01 | 20 |
| 3 | UE-2.5-01 | 16 |
| 4 | UE-3.2-01 | 15 |
| 5 | UE-3.3-01 | 15 |
| 6 | UE-5.2-01 | 15 |
| 7 | UE-5.4-01 | 15 |
| 8 | UE-2.2-02 | 12 |
| 9 | UE-3.1-01 | 12 |
| 10 | UE-6.2-01 | 10 |
| 11 | UE-4.2-01 | 9 |
| 12 | UE-4.3-01 | 9 |
| 13 | UE-1.1-01 | 8 |
| 14 | UE-1.3-01 | 8 |
| 15 | UE-2.2-01 | 8 |
| 16 | UE-5.1-01 | 8 |
| 17 | UE-5.3-01 | 8 |
| 18 | UE-6.1-01 | 8 |
| 19 | UE-7.1-01 | 8 |
| 20 | UE-1.2-01 | 6 |
| 21 | UE-2.1-01 | 6 |
| 22 | UE-4.1-01 | 6 |
| 23 | UE-6.3-01 | 6 |
| 24 | UE-7.2-01 | 6 |
| 25 | UE-7.3-01 | 6 |
| 26 | UE-2.3-01 | 4 |
| 27 | UE-7.4-01 | 4 |

---

# 7. Risk Mitigation

PantryPilot has no hardware-specific runtime interface or repository evidence for a hardware control. Therefore, every currently justified mitigation is classified as **Pure Software**. No Pure Hardware mitigation is invented merely to populate a category.

| UE ID | Risk Mitigation | Classification |
|---|---|---|
| UE-1.1-01 | Load configuration from the controlled JSON file, verify required release keys through smoke tests, and fail visibly when loading fails. | Pure Software |
| UE-1.2-01 | Keep recipes, pantry data, profile defaults, gates, and the fixed date in one versioned endpoint and verify its response contract. | Pure Software |
| UE-1.3-01 | Preserve the V1/V2 boundary, distinguish `1.1.0` from Unreleased web work, and require branch, review, CI, changelog, and tag controls before release. | Pure Software |
| UE-2.1-01 | Keep the three demo recipes in one controlled data source and verify recipe count and identifiers through endpoint tests. | Pure Software |
| UE-2.2-01 | Make the browser submit current recipe and allergen selections to the backend for each evaluation and retain the backend as the source of truth. | Pure Software |
| UE-2.2-02 | Use synthetic profile data, keep secrets outside version control, redact future logs and prompts, and review configuration items before baselining. | Pure Software |
| UE-2.3-01 | Implement one reset path that restores documented defaults and add browser-level reset verification before tagging the web release. | Pure Software |
| UE-2.4-01 | Before implementation, define a bounded solver runtime, a relaxation order, explicit notices, and property-based feasibility tests. Thresholds are **To Be Completed**. | Pure Software |
| UE-2.5-01 | Before implementation, define a canonical recipe schema, reject incomplete records, cache recorded fixtures, and retain local seed recipes as fallback. The provider is **To Be Completed**. | Pure Software |
| UE-3.1-01 | Centralize trimming and lowercase normalization and maintain regression tests for supported aliases and blank values. | Pure Software |
| UE-3.2-01 | Maintain a controlled alias map, block supported matches deterministically, and expand tests whenever an alias miss is discovered. | Pure Software |
| UE-3.3-01 | Keep safety decisions in the Flask backend, return conflicts and approved/blocked status together, and verify the endpoint contract. | Pure Software |
| UE-3.4-01 | Treat every future generated candidate as untrusted and require deterministic filtering before any user-visible response. Generator-specific evidence is **To Be Completed**. | Pure Software |
| UE-4.1-01 | Submit the explicit selected recipe-ID list, reject unknown IDs, and test full and empty selections. | Pure Software |
| UE-4.2-01 | Use normalized `(name, unit)` keys and prohibit implicit conversion between unlike units. | Pure Software |
| UE-4.3-01 | Sum numeric quantities deterministically and verify duplicate, shared, and empty-list cases through integration tests. | Pure Software |
| UE-5.1-01 | Parse ISO dates, coerce and range-check the window, and return HTTP 400 for malformed or out-of-range requests. | Pure Software |
| UE-5.2-01 | Encode `0 <= days remaining <= window`, classify negative values separately, and test yesterday, today, boundary, and boundary-plus-one cases. | Pure Software |
| UE-5.3-01 | Render backend-provided statuses and counts and verify the endpoint response against known demo data. | Pure Software |
| UE-5.4-01 | Before pantry-aware planning is implemented, define a hard prohibition on expired items and acceptance tests for use-soon prioritization. Detailed planning rules are **To Be Completed**. | Pure Software |
| UE-6.1-01 | Version the four required gates in configuration and verify that each is enabled in smoke tests and the Quality response. | Pure Software |
| UE-6.2-01 | Calculate each PASS or FAIL from actual-versus-expected equality and calculate overall status from all scenario results. | Pure Software |
| UE-6.3-01 | Return scenario details and totals from one backend response and test the visible API contract. | Pure Software |
| UE-7.1-01 | Bind locally, package assets in the repository, delegate decisions to backend APIs, run route tests, and rehearse a resettable demonstration. | Pure Software |
| UE-7.2-01 | Validate request types, ranges, and identifiers at each Flask route and use explicit HTTP 400 or 404 responses. | Pure Software |
| UE-7.3-01 | Replace the loading state with a visible initialization error containing the returned message. | Pure Software |
| UE-7.4-01 | Maintain responsive breakpoints, stable control dimensions, semantic labels, and pre-release desktop and small-screen checks. | Pure Software |

---

# 8. Functional Requirements

Every functional requirement uses the ABC form: an Actor **shall** perform a Behavior **within** a Constraint. Each requirement traces to exactly one Level-2 capability. Planned requirements are not represented as implemented.

| Requirement ID | Level-2 Capability | Functional Requirement | Status |
|---|---|---|---|
| FR-1.1.1 | 1.1 Load Controlled Configuration | The Configuration Loader shall load `config/app_config.json` and derive `PantryPilot 1.1.0: Safety & Grocery Controls` within application initialization. | Implemented |
| FR-1.2.1 | 1.2 Supply Versioned Demo Data | The Demo Data API shall provide release metadata, feature flags, gates, one synthetic profile, three recipes, five pantry items, and the fixed demo date within one successful `GET /api/demo-data` response. | Implemented |
| FR-1.3.1 | 1.3 Control Release Scope | The Release UI shall display the controlled baseline version within the initialized navigation area. | Implemented |
| FR-1.3.2 | 1.3 Control Release Scope | The Release Maintainer shall distinguish tagged backend version `1.1.0` from Unreleased web work within version, changelog, and release records. | Partial process control |
| FR-2.1.1 | 2.1 Display Weekly Plan | The Plan UI shall display the three configured dinners with day, duration, servings, description, and safety state within the Plan view. | Partial; fixed data only |
| FR-2.2.1 | 2.2 Select Household Planning Inputs | The Household Planner shall select a demo recipe and any combination of Soy, Peanut, Milk, and Egg within the available browser controls. | Implemented in memory |
| FR-2.2.2 | 2.2 Select Household Planning Inputs | The Plan UI shall submit the current recipe and allergen selections to the backend within every requested safety reevaluation. | Implemented |
| FR-2.3.1 | 2.3 Restore Default Planning State | The Browser UI shall restore Soy selected, the tofu recipe selected, all grocery recipes selected, a three-day window, an unexecuted Quality view, and Plan navigation within one reset command. | Implemented |
| FR-2.4.1 | 2.4 Generate Constraint-Aware Plans | The future Optimization Engine shall generate a feasible plan or an explicit relaxation result within a solver time bound and target bands that are **To Be Completed**. | Planned |
| FR-2.5.1 | 2.5 Import Recipe Data | The future Recipe Ingestion Service shall normalize provider records and reject missing required fields within a canonical recipe schema whose provider contract is **To Be Completed**. | Planned |
| FR-3.1.1 | 3.1 Normalize Safety Terms | The Safety Normalizer shall trim nonblank ingredient and allergen strings and convert them to lowercase within each safety evaluation. | Implemented |
| FR-3.2.1 | 3.2 Detect Allergen Conflicts | The Allergen Detector shall compare normalized ingredients with the controlled Peanut, Soy, Milk, and Egg alias sets within each recipe evaluation. | Implemented |
| FR-3.3.1 | 3.3 Enforce Backend Safety Decisions | The Recipe Safety API shall return recipe identity, sorted conflicts, a Boolean safety value, and an approved or blocked decision within one valid response. | Implemented |
| FR-3.3.2 | 3.3 Enforce Backend Safety Decisions | The Browser UI shall present the backend safety result without independently recalculating it within the Plan workflow. | Implemented |
| FR-3.4.1 | 3.4 Filter Generated Candidates | The future Candidate Safety Gate shall block every generated recipe or substitution containing a declared allergen within the response path before user display. | Planned; generator **To Be Completed** |
| FR-4.1.1 | 4.1 Select Contributing Recipes | The Household Planner shall include or exclude any demo recipe within the Grocery view before generation. | Implemented |
| FR-4.2.1 | 4.2 Normalize Grocery Keys | The Grocery Aggregator shall trim and lowercase each item name and unit within creation of its canonical aggregation key. | Implemented |
| FR-4.2.2 | 4.2 Normalize Grocery Keys | The Grocery Aggregator shall keep unlike units as separate records within the current no-conversion rule. | Implemented |
| FR-4.3.1 | 4.3 Aggregate Grocery Quantities | The Grocery Aggregator shall sum numeric quantities sharing one normalized name-and-unit key within a selected-recipe request. | Implemented |
| FR-4.3.2 | 4.3 Aggregate Grocery Quantities | The Grocery API shall return zero recipes, zero items, and no fabricated record within a valid empty selection. | Implemented |
| FR-5.1.1 | 5.1 Parse and Validate Pantry Inputs | The Pantry API shall parse an ISO `YYYY-MM-DD` date and a numeric window from 1 through 14 within each classification request. | Implemented |
| FR-5.1.2 | 5.1 Parse and Validate Pantry Inputs | The Pantry API shall reject malformed dates, nonnumeric windows, and out-of-range windows with HTTP 400 within the request response. | Implemented |
| FR-5.2.1 | 5.2 Apply Inclusive Expiry Rules | The Expiry Classifier shall classify dates before the current date as expired within each pantry result. | Implemented |
| FR-5.2.2 | 5.2 Apply Inclusive Expiry Rules | The Expiry Classifier shall classify day zero through the selected future window as use-soon within the inclusive rule `0 <= days remaining <= window`. | Implemented |
| FR-5.3.1 | 5.3 Present Pantry Classifications | The Pantry UI shall display item statuses, use-soon count, expired count, and one-, three-, or five-day selection within each rendered pantry result. | Implemented |
| FR-5.4.1 | 5.4 Apply Pantry Status to Planning | The future Planning Engine shall prohibit expired pantry items and apply verified use-soon priority within pantry-aware planning rules that are **To Be Completed**. | Planned |
| FR-6.1.1 | 6.1 Load Required Quality Gates | The Quality Service shall load and expose required unit-test, pull-request, review, and CI gates within the release-quality response. | Implemented |
| FR-6.2.1 | 6.2 Execute and Evaluate Release Scenarios | The Quality Service shall execute all six formal system scenarios within each `GET /api/quality-summary` request. | Implemented |
| FR-6.2.2 | 6.2 Execute and Evaluate Release Scenarios | The Scenario Evaluator shall calculate PASS or FAIL by comparing actual and expected values within each scenario execution. | Implemented |
| FR-6.3.1 | 6.3 Present Verification Evidence | The Quality Service shall report overall passed status only when every scenario passes within the returned summary. | Implemented |
| FR-6.3.2 | 6.3 Present Verification Evidence | The Quality UI shall display scenario ID, description, expected result, actual result, status, and aggregate count within the executed Quality view. | Implemented |
| FR-7.1.1 | 7.1 Serve and Navigate the Local Interface | The Flask Application shall serve the browser UI and five JSON API routes on loopback within a local demonstration session, while view navigation occurs without a full page reload. | Implemented under Unreleased |
| FR-7.2.1 | 7.2 Validate API Requests | The API Layer shall validate list types, string members, known recipe IDs, ISO dates, and window ranges within the applicable routes and return HTTP 400 or 404 for invalid input. | Implemented |
| FR-7.3.1 | 7.3 Report Startup Failures | The Browser UI shall replace the loading state with a visible returned error message within any failed initialization attempt. | Implemented |
| FR-7.4.1 | 7.4 Support Responsive Interaction | The Web UI shall preserve readable, nonoverlapping, keyboard-focusable workflows within CSS breakpoints at 1040, 820, and 560 pixels and the documented 320-pixel minimum target. | Implemented; formal accessibility audit **To Be Completed** |

---

# 9. Quality Requirements

| ID | Quality Attribute | Measurable Requirement | Current Evidence or Gap |
|---|---|---|---|
| QR-001 | Safety and Determinism | Identical normalized safety, grocery, and expiry inputs shall produce identical outputs in 100% of repeated automated cases. | Pure functions and repeatable tests. |
| QR-002 | Testability | A release candidate shall pass all repository pytest tests and all formal system scenarios before tagging. | Current result: 11 pytest tests and 6 of 6 scenarios pass. |
| QR-003 | Reliability | Every tested invalid API request shall return its documented 4xx response without a fabricated success payload. | Flask validation exists; broader invalid-path coverage remains recommended. |
| QR-004 | Security | The development server shall bind to `127.0.0.1` by default and committed fixtures shall contain synthetic rather than real household data. | Implemented local binding and synthetic demo profile. |
| QR-005 | Maintainability | Every release-affecting code change shall update applicable tests, configuration, changelog, or release records and pass the configured PR/review/CI gates before tagging. | CM documents, configuration gates, and CI workflow. |
| QR-006 | Portability | The application shall install from pinned direct requirements and execute under the repository CI Python version. | Flask 3.1.1, pytest 8.2.2, and Python 3.12 CI. Supported OS matrix is **To Be Completed**. |
| QR-007 | Usability | All four primary views and reset shall remain reachable through visible controls in one browser session. | Implemented Plan, Grocery, Pantry, Quality, and reset controls. |
| QR-008 | Accessibility | All interactive controls shall be keyboard-focusable and have a programmatic label in the rendered interface. | Native controls, labels, landmarks, live regions, and focus styles exist. Formal WCAG target and audit are **To Be Completed**. |
| QR-009 | Runtime Independence | The current demonstration shall complete its primary workflows with zero database connections and zero external application-API calls. | All runtime data and application assets are local. |
| QR-010 | Availability | A production availability objective shall be measurable before any production release. | **To Be Completed**; the current product is a local demonstration. |
| QR-011 | Scalability | A supported concurrent-user target and corresponding load-test threshold shall be defined before multi-user deployment. | **To Be Completed**; no multi-user architecture exists. |
| QR-012 | AI Safety and Explainability | Any future generated candidate shall identify its generator version and deterministic safety result before display. | **To Be Completed**; no executable generator exists. |

---

# 10. Performance Requirements

The repository contains no measured latency, throughput, CPU, memory, or concurrency baseline. Inventing thresholds would violate the prompt. The following measurement requirements must be completed before the relevant release.

| ID | Performance Area | Requirement | Status |
|---|---|---|---|
| PR-001 | Local API Response Time | A maximum p95 response time for each local JSON endpoint under the supported demonstration workload shall be established and tested. | **To Be Completed** |
| PR-002 | Browser Initialization | A maximum time from loading `/` to usable Plan controls on the supported reference machine shall be established and tested. | **To Be Completed** |
| PR-003 | Resource Usage | Maximum resident memory and CPU utilization for the local Flask process shall be established under the reference workload. | **To Be Completed** |
| PR-004 | Concurrency | A supported concurrent-user count and error-rate threshold shall be established before any nonlocal deployment. | **To Be Completed** |
| PR-005 | External Data Throughput | Recipe-ingestion quota, throughput, retry, and timeout targets shall be established if an external provider is selected. | Not applicable to current release; **To Be Completed** for Version 2 |
| PR-006 | Optimization and AI Latency | Solver and model latency limits shall be established before constraint-aware planning or generated candidates are released. | Not applicable to current release; **To Be Completed** for future versions |

---

# 11. Assumptions

1. The current demonstration is used by one local reviewer at a time.
2. The fixed date `2026-08-14` and synthetic household profile are demonstration fixtures, not live user records.
3. Recipe safety ingredients are supplied as structured strings compatible with exact alias matching.
4. Grocery quantities are numeric and already expressed in the unit that should be aggregated.
5. A configuration feature flag is a declaration of direction, not proof that executable functionality exists.
6. Browser state is disposable and may be reset on refresh or restart.
7. The current system is educational demonstration software and not clinical, nutritional, or regulatory advice.
8. Any assumption about production deployment, supported traffic, legal compliance, model provider, external recipe provider, or authoritative allergen taxonomy is **To Be Completed**.

---

# 12. Constraints

| Constraint Area | Current Constraint |
|---|---|
| Programming Language | Python backend and JavaScript browser client. |
| Framework | Flask 3.1.1. |
| Test Tool | pytest 8.2.2 plus the Python system-test runner. |
| Data Storage | In-memory Python structures and version-controlled JSON; no database. |
| Network Exposure | Loopback-only development binding by default. |
| Release Configuration | `VERSION` and `config/app_config.json` identify backend baseline `1.1.0`. |
| Grocery Conversion | Items with different units remain separate; no conversion engine exists. |
| Allergen Matching | Exact normalized terms and a four-category alias map; no free-text ingredient parser. |
| Assets | Browser assets are stored locally in the repository for an offline-capable demonstration. |
| CI | GitHub Actions uses Python 3.12 and runs pytest plus `system_test_runner.py`. |
| Operating Systems and Browsers | Formal support matrix is **To Be Completed**. |
| Hardware | Minimum processor and memory specifications are **To Be Completed** because no performance baseline exists. |
| External APIs | No external application API is used in the current release; future provider selection is **To Be Completed**. |

---

# 13. External Interfaces

## 13.1 User Interfaces

- **Plan:** Weekly meal cards, allergen controls, selected recipe, safety result, and summary metrics.
- **Grocery:** Recipe inclusion controls, generation command, consolidated table, selected-recipe count, and item count.
- **Pantry:** Fixed date, one-, three-, and five-day windows, item statuses, use-soon count, and expired count.
- **Quality:** Release identity, four quality gates, execution command, scenario evidence, and aggregate result.
- **Reset:** Restores the documented repeatable starting state.

## 13.2 Hardware Interfaces

No hardware-specific interface exists in the repository.

## 13.3 Software Interfaces

| Method and Path | Purpose | Request | Successful Result | Error Behavior |
|---|---|---|---|---|
| `GET /` | Load the browser application. | None | Rendered `index.html`. | Standard Flask error behavior. |
| `GET /api/demo-data` | Initialize release and demo data. | None | Release, flags, gates, profile, recipes, pantry, and date. | Configuration or server failure. |
| `POST /api/check-recipe` | Evaluate one recipe against declared allergens. | `recipe_id`, `allergens[]` | Recipe identity, conflicts, safe flag, decision. | 400 for invalid allergens; 404 for unknown recipe. |
| `POST /api/grocery-list` | Consolidate selected recipe ingredients. | `recipe_ids[]` | Items, recipe count, item count. | 400 for non-list; 404 for unknown ID. |
| `POST /api/pantry-status` | Classify pantry items. | `today`, `window_days` | Statuses and summary counts. | 400 for invalid date, type, or range. |
| `GET /api/quality-summary` | Run formal release scenarios. | None | Gates, scenarios, totals, overall status. | Server error if configuration or execution fails. |

## 13.4 Communication Interfaces

- Local HTTP between the browser client and Flask server.
- JSON for all application API requests and responses.
- No WebSocket, message queue, email, SMS, or external service protocol.

## 13.5 External Services

- GitHub provides source control and CI workflow hosting but is not a runtime application dependency.
- No external recipe, optimization, AI, authentication, storage, or monitoring service is called by the current executable application.

---

# 14. Requirements Traceability Matrix

Every functional requirement traces to exactly one Level-2 capability.

| Requirement ID | Level-2 Capability | Requirement Description | Implementation or Verification Evidence |
|---|---|---|---|
| FR-1.1.1 | 1.1 Load Controlled Configuration | Load release configuration and derive identity. | `load_config()`, `describe_release()`, `test_config_loads_and_identifies_release` |
| FR-1.2.1 | 1.2 Supply Versioned Demo Data | Return complete initialization payload. | `/api/demo-data`, `test_demo_page_and_release_data_are_available` |
| FR-1.3.1 | 1.3 Control Release Scope | Display baseline version. | `static/app.js`, demo-data endpoint |
| FR-1.3.2 | 1.3 Control Release Scope | Distinguish tagged backend from Unreleased web work. | `VERSION`, `CHANGELOG.md`, release records |
| FR-2.1.1 | 2.1 Display Weekly Plan | Display three configured meals. | `DEMO_RECIPES`, Plan rendering |
| FR-2.2.1 | 2.2 Select Household Planning Inputs | Select recipe and allergen controls. | `templates/index.html`, `static/app.js` |
| FR-2.2.2 | 2.2 Select Household Planning Inputs | Submit current inputs for reevaluation. | `static/app.js`, `/api/check-recipe` |
| FR-2.3.1 | 2.3 Restore Default Planning State | Restore documented defaults. | Reset implementation in `static/app.js` |
| FR-2.4.1 | 2.4 Generate Constraint-Aware Plans | Generate feasible or explained relaxed plan. | Planned; **To Be Completed** |
| FR-2.5.1 | 2.5 Import Recipe Data | Normalize future external records. | Planned; **To Be Completed** |
| FR-3.1.1 | 3.1 Normalize Safety Terms | Trim and lowercase safety terms. | `ingredient_tokens()` |
| FR-3.2.1 | 3.2 Detect Allergen Conflicts | Compare terms with controlled aliases. | `detect_allergen_conflicts()`, smoke tests |
| FR-3.3.1 | 3.3 Enforce Backend Safety Decisions | Return the complete backend safety result. | `/api/check-recipe`, endpoint test |
| FR-3.3.2 | 3.3 Enforce Backend Safety Decisions | Present rather than recalculate backend result. | `static/app.js`, API delegation |
| FR-3.4.1 | 3.4 Filter Generated Candidates | Filter future candidates before display. | Deterministic filter exists; generator **To Be Completed** |
| FR-4.1.1 | 4.1 Select Contributing Recipes | Include or exclude demo recipes. | Grocery controls and endpoint request |
| FR-4.2.1 | 4.2 Normalize Grocery Keys | Normalize item name and unit. | `aggregate_grocery_items()` |
| FR-4.2.2 | 4.2 Normalize Grocery Keys | Keep different units separate. | Tuple key `(name, unit)` |
| FR-4.3.1 | 4.3 Aggregate Grocery Quantities | Sum duplicate quantities. | Smoke, endpoint, and system tests |
| FR-4.3.2 | 4.3 Aggregate Grocery Quantities | Return empty output for empty selection. | Grocery route behavior |
| FR-5.1.1 | 5.1 Parse and Validate Pantry Inputs | Parse ISO date and valid window. | `parse_iso_date()`, pantry route |
| FR-5.1.2 | 5.1 Parse and Validate Pantry Inputs | Reject invalid pantry inputs. | Pantry route HTTP 400 paths |
| FR-5.2.1 | 5.2 Apply Inclusive Expiry Rules | Separate expired dates. | `_pantry_status()`, boundary tests |
| FR-5.2.2 | 5.2 Apply Inclusive Expiry Rules | Include day zero through boundary. | `is_near_expiry()`, smoke and endpoint tests |
| FR-5.3.1 | 5.3 Present Pantry Classifications | Display statuses, counts, and windows. | Pantry view and endpoint |
| FR-5.4.1 | 5.4 Apply Pantry Status to Planning | Apply expiry to future planning. | Planned; **To Be Completed** |
| FR-6.1.1 | 6.1 Load Required Quality Gates | Expose all four gates. | Config, smoke test, Quality endpoint |
| FR-6.2.1 | 6.2 Execute and Evaluate Release Scenarios | Execute all six scenarios. | `run_system_tests()`, Quality endpoint test |
| FR-6.2.2 | 6.2 Execute and Evaluate Release Scenarios | Compare actual and expected values. | `system_test_runner.py` |
| FR-6.3.1 | 6.3 Present Verification Evidence | Calculate overall status from all scenarios. | `/api/quality-summary` |
| FR-6.3.2 | 6.3 Present Verification Evidence | Display scenario evidence and totals. | Quality rendering and endpoint test |
| FR-7.1.1 | 7.1 Serve and Navigate the Local Interface | Serve local UI and APIs with in-page navigation. | `src/web_app.py`, `templates/index.html`, `static/app.js` |
| FR-7.2.1 | 7.2 Validate API Requests | Return documented 400 and 404 responses. | Flask route validation |
| FR-7.3.1 | 7.3 Report Startup Failures | Display initialization failure. | Error handling in `static/app.js` |
| FR-7.4.1 | 7.4 Support Responsive Interaction | Preserve responsive and keyboard-operable workflows. | `static/styles.css`, semantic HTML; formal audit **To Be Completed** |

---

# 15. Future Versions

## 15.1 Version 1.1.0: Current Backend Baseline

The controlled backend baseline implements configuration identity, quality gates, deterministic allergen matching, grocery aggregation, and inclusive expiry logic. Its core smoke and system tests pass.

## 15.2 Version 1.2.0 Candidate: Formalize the Web Baseline

- Review and tag the Flask UI and API layer.
- Add automated tests for every documented 400 and 404 path.
- Add browser end-to-end tests for Plan, Grocery, Pantry, Quality, navigation, and reset.
- Complete an accessibility audit and resolve material issues.
- Reconcile feature flags with executable capability status.
- Establish initial endpoint and browser performance baselines.

The exact version number and release date are **To Be Completed**.

## 15.3 Version 2.0.0 Candidate: Persistent Household Planning

- Add authenticated household profiles and persistent allergen preferences.
- Add recipe and pantry CRUD, search, and import.
- Save weekly plans and grocery completion state.
- Introduce constraint-aware planning with bounded runtime and explicit relaxation.
- Define privacy, migration, backup, recovery, and audit requirements.

The database, identity provider, external recipe provider, solver, and measurable release thresholds are **To Be Completed**.

## 15.4 Version 3.0.0 Candidate: Controlled Intelligence

- Introduce generated recipes or substitutions behind the deterministic safety gate.
- Version model, prompt, safety policy, and offline fixtures.
- Add adversarial allergen tests, fallback behavior, and explainability evidence.
- Use pantry inventory to alter recommendations and grocery quantities only after unit-conversion and freshness rules are verified.

The model provider, model version, prompt policy, legal review, and production safety case are **To Be Completed**.

---

# 16. Open Issues

1. **Web release number:** Should the web layer become `1.2.0` or a revised `1.1.x` baseline?
   > **To Be Completed**
2. **Feature flag semantics:** Should `ai_substitutions` remain true before an executable substitution workflow exists?
   > **To Be Completed**
3. **Allergen authority:** Which authoritative allergen taxonomy and ingredient parser should replace the four-category demo map?
   > **To Be Completed**
4. **Persistence and privacy:** Which database, identity model, retention policy, encryption controls, and audit rules are required?
   > **To Be Completed**
5. **Unit conversion:** Which conversion and rounding rules are acceptable for grocery aggregation?
   > **To Be Completed**
6. **Performance and availability:** Which latency, concurrency, resource, availability, and recovery targets apply before deployment?
   > **To Be Completed**
7. **Accessibility and compatibility:** Which WCAG target, browsers, operating systems, and mobile devices are required for acceptance?
   > **To Be Completed**
8. **External recipes and optimization:** Which provider, schema, quota, solver, constraints, and relaxation policy will Version 2 use?
   > **To Be Completed**
9. **Generated candidates:** Which model, prompt, safety evidence, fallback, and explainability requirements will Version 3 use?
   > **To Be Completed**

---

# 17. Glossary

| Term | Definition |
|---|---|
| ABC Requirement | A requirement expressed as Actor, `shall`, Behavior, and Constraint. |
| Allergen Alias | A controlled ingredient term treated as equivalent to a declared allergen. |
| Backend Baseline | The tagged and versioned Python capability set represented by release `1.1.0`. |
| Candidate | A recipe, substitution, or plan proposed for evaluation before user display. |
| Canonical Grocery Key | The normalized tuple of item name and unit used for aggregation. |
| Configuration Item | A controlled source, test, configuration, asset, workflow, change record, or release record. |
| Deterministic Safety Gate | Backend logic that returns the same allergen decision for the same normalized inputs. |
| Expired | A pantry item whose expiry date is before the selected current date. |
| Level-1 Capability | A major action-oriented software capability. |
| Level-2 Capability | A hierarchically numbered action that supports exactly one Level-1 capability. |
| Living PRD | A requirements document maintained with the evolving repository rather than created once. |
| Risk Score | Likelihood multiplied by Impact on a 1-25 scale. |
| System Scenario | A release-level test containing a description, expected value, actual value, and calculated result. |
| Unreleased | Implemented work that has not completed the documented release and tagging process. |
| Undesirable Event | A capability-linked outcome that the product or project should prevent or control. |
| Use-Soon | A nonexpired pantry item with days remaining from zero through the selected inclusive window. |

---

# Appendix A: Business Rules

## BR-001: Allergen Alias Rule

The controlled alias map currently covers:

- Peanut: `peanut`, `peanuts`, `peanut butter`, `groundnut`.
- Soy: `soy`, `soybean`, `soybeans`, `soy sauce`, `soy lecithin`.
- Milk: `milk`, `dairy`, `butter`, `cream`, `cheese`.
- Egg: `egg`, `eggs`, `mayonnaise`.

Matching is exact after trimming and lowercasing. It does not parse free-form descriptions, infer misspellings, detect cross-contamination, or consult manufacturer data.

## BR-002: Grocery Canonicalization Rule

Items are grouped by `(normalized name, normalized unit)`. Quantities are converted to floating-point values and summed. Results are sorted by name and unit. Different units are not converted or merged.

## BR-003: Expiry Boundary Rule

An item is use-soon when:

```text
0 <= expiration date - current date <= window days
```

A negative difference is expired. A positive difference beyond the window is fresh.

## BR-004: Release Status Rule

Version `1.1.0` is the tagged backend baseline. The Flask UI and web tests remain Unreleased until they pass the documented branch, review, CI, changelog, release-note, and tagging process.

---

# Appendix B: API Contracts

The authoritative concise interface table appears in Section 13.3. Detailed acceptance behavior includes:

- `POST /api/check-recipe` returns `safe: false`, `conflicts: ["soy"]`, and `decision: "blocked"` for `tofu-bowl` with Soy declared.
- `POST /api/grocery-list` returns three selected recipes and sixteen canonical items for all demo recipes, including `olive oil: 3.0 tbsp` and `tomato: 4.0 each`.
- `POST /api/pantry-status` with August 14, 2026 and a three-day window returns two use-soon items and one expired item.
- `GET /api/quality-summary` executes rather than hard-codes six scenario results.

---

# Appendix C: Acceptance Scenarios

| ID | Given | When | Then |
|---|---|---|---|
| AT-01 | Soy is selected and the tofu bowl is active. | The Plan view evaluates recipe safety. | The recipe is blocked and the conflict list contains Soy. |
| AT-02 | The tofu bowl is blocked. | Soy is cleared and then selected again. | The recipe becomes approved and then blocked again. |
| AT-03 | All three recipes are selected. | The grocery list is generated. | Sixteen canonical items are returned, including `3 tbsp` olive oil and `4 each` tomato. |
| AT-04 | The date is August 14, 2026 and the window is three days. | Pantry status is calculated. | Broccoli and Tofu are use-soon, Spinach is fresh, and Lemon is expired. |
| AT-05 | The Quality view is ready. | Release checks are run. | Four gates and six passing scenario records produce a six-of-six result. |
| AT-06 | An endpoint receives an unknown ID, malformed list, invalid date, or out-of-range window. | The request is processed. | The route returns HTTP 400 or 404 and does not fabricate success. |

---

# Appendix D: Repository Evidence

## D.1 Primary Sources

- `PantryPilot_CM_Generic_Files/src/pantrypilot_app.py`: release, safety, grocery, and expiry functions.
- `PantryPilot_CM_Generic_Files/src/web_app.py`: demo data, routes, validation, and quality summary.
- `PantryPilot_CM_Generic_Files/templates/index.html`: Plan, Grocery, Pantry, and Quality structure.
- `PantryPilot_CM_Generic_Files/static/app.js`: browser state, API integration, rendering, navigation, and reset.
- `PantryPilot_CM_Generic_Files/static/styles.css`: responsive presentation and focus behavior.
- `PantryPilot_CM_Generic_Files/config/app_config.json`: release identity, feature flags, and quality gates.
- `PantryPilot_CM_Generic_Files/tests/test_smoke.py`: six core regression tests.
- `PantryPilot_CM_Generic_Files/tests/test_web_app.py`: five route and integration tests.
- `PantryPilot_CM_Generic_Files/system_test_runner.py`: six formal release scenarios.
- `PantryPilot_CM_Generic_Files/requirements.txt`: pinned direct dependencies.
- `PantryPilot_CM_Generic_Files/CHANGELOG.md` and `releases/`: status accounting and release records.
- `.github/workflows/pantrypilot-ci.yml`: automated pytest and system-test execution.
- `PantryPilot_Product_Requirements_Document_Zixuan_Liang.md`: prior PRD content preserved and reorganized in this living document.

## D.2 Verification Snapshot

At document version 1.2:

- Pytest result: 11 passed.
- Formal system scenarios: 6 passed, 0 failed.
- Backend baseline: `1.1.0`.
- Flask demonstration status: Unreleased.
- Local demonstration command: `PORT=5050 .venv/bin/python -m src.web_app`.
- Local demonstration address: `http://127.0.0.1:5050`.
