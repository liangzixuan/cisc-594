# PantryPilot Final Presentation and Live Demo Script

**Presenter:** Zixuan Liang  
**Course:** CISC 594 Software Testing Principles and Techniques  
**Target length:** 12-14 minutes, including a 3-minute live demonstration  
**Presentation:** `PantryPilot_Final_Project_Presentation_Zixuan_Liang_Updated.pptx`  
**Demo URL:** `http://127.0.0.1:5050`

## Before the Presentation

1. Start the application from `PantryPilot_CM_Generic_Files`:

   ```bash
   PORT=5050 .venv/bin/python -m src.web_app
   ```

2. Open `http://127.0.0.1:5050` in Chrome and confirm the Plan view loads.
3. Click the reset icon in the upper-right corner so Soy is selected and the tofu recipe is blocked.
4. Keep the presentation and browser in separate windows so `Command+Tab` switches between them.
5. Close unrelated tabs and notifications. Keep the browser at 100% zoom.
6. Confirm that the Quality view displays "Ready to run" before beginning.

## Slide-by-Slide Script

### Slide 1 - PantryPilot

**Time:** 30 seconds

**Say:**

> Good evening. My project is PantryPilot, a smart meal and grocery planning system. The application helps a household build meal plans, account for allergies and preferences, combine grocery items, and use pantry food before it expires.
>
> The central idea of this project is that useful automation is not enough by itself. PantryPilot is useful only when its intelligent behavior is bounded by traceable, executable quality controls. I will show how risk management, configuration management, and system testing support that goal, and then demonstrate the controls in the working application.

### Slide 2 - Required Final Presentation Sections

**Time:** 25 seconds

**Say:**

> I organized the presentation around the five required sections: the project and its features, my role, risk identification and tracking, configuration management, and system testing. The live demonstration connects these sections. The interface does not present separate or invented results; it exposes the same controlled functions and release scenarios documented in the reports.

### Slide 3 - Project Introduction

**Time:** 45 seconds

**Say:**

> PantryPilot addresses three related problems. First, meal planning is fragmented across recipe, pantry, and shopping tools. Second, household constraints such as allergies, disliked ingredients, and nutrition goals can conflict. Third, grocery decisions often ignore food already at home, which contributes to waste.
>
> The broader concept includes profiles, recipes, weekly plans, AI-assisted substitutions, grocery lists, and pantry-aware recommendations. For this course project, I deliberately narrowed the executable baseline to the controls that can be verified deterministically: allergen checking, grocery aggregation, pantry-expiry classification, release identity, and quality-gate evidence. The current baseline validates candidate output; it does not depend on a live external AI service during the demo.

### Slide 4 - Project Features and Live Demonstration

**Time:** About 3 minutes

**Say before switching windows:**

> The controlled version 1.1.0 baseline contains the backend safety and grocery controls. The web presentation layer makes those controls observable through four views: Plan, Grocery, Pantry, and Quality. I will follow that same path now.

**Action:** Use `Command+Tab` to switch to the browser.

#### Demo Step 1 - Plan Safety Gate

**Action:** Stay on **Plan**. Select the **Ginger tofu rice bowl** if it is not already selected. Point to the checked **Soy** profile option and the red blocked result.

**Say:**

> The household profile currently declares a soy allergy. The selected tofu bowl contains soy sauce, so the deterministic safety gate normalizes the ingredient name, compares it with the profile, and blocks the recipe before it can continue to planning. Notice that the weekly summary also reports one safety conflict.

**Action:** Clear the **Soy** checkbox. Wait for the result to change to approved.

**Say:**

> When I remove soy from the profile, the same recipe is reevaluated and approved. This is not a color change implemented only in the browser. The browser calls a Flask endpoint, and the endpoint delegates the decision to the same Python allergen-control function exercised by the tests.

**Action:** Select **Soy** again so the blocked result returns.

**Say:**

> Restoring the profile produces the same blocked decision, demonstrating a repeatable control rather than a one-time example.

#### Demo Step 2 - Grocery Aggregation

**Action:** Click **Grocery**, confirm all three recipes are selected, and click **Generate list**. Point to the item total and the olive-oil example on the right.

**Say:**

> The Grocery view combines the ingredients from all three planned meals. Names and units are normalized before quantities are added. Here, three separate one-tablespoon olive-oil entries become one three-tablespoon item. Duplicate tomato entries are also consolidated. This reduces inconsistent quantities and gives one traceable grocery output.

#### Demo Step 3 - Pantry Boundary

**Action:** Click **Pantry**. Keep the default **3 days** selected. Point to Broccoli, Tofu, Spinach, and the counts on the right.

**Say:**

> The demo date is August 14. With an inclusive three-day use-soon window, broccoli expiring today and tofu expiring in three days are both included. Spinach at plus four days remains fresh, while the already expired lemon is excluded from planning. This boundary is important because off-by-one errors are easy to hide in date logic.

**Action:** Click **5 days** and point out that the use-soon count changes from 2 to 3.

**Say:**

> Expanding the window to five days immediately includes spinach. The visible change confirms the intended rule: day zero through the selected boundary are included, but expired items remain a separate category.

#### Demo Step 4 - Quality Evidence

**Action:** Click **Quality**. Point briefly to the four required gates, then click **Run release checks**.

**Say while the checks run:**

> The Quality view loads the controlled release identity and its required unit-test, pull-request, review, and CI gates. This button executes the same six release-level scenarios used in the system testing report.

**Action:** When the score changes to **6 / 6**, point to the scenario list and score.

**Say:**

> All six formal scenarios pass. They cover release identity, enabled quality gates, grocery aggregation, unsafe and safe allergen decisions, and pantry-expiry boundaries. Later, I will distinguish these six release scenarios from the full eleven-test pytest suite.

**Action:** Use `Command+Tab` to return to the presentation and advance to Slide 5.

### Slide 5 - System Architecture

**Time:** 45 seconds

**Say:**

> This diagram explains what happened during the demo. The household profile and user actions enter through the browser. The browser calls stable Flask API routes. Flask delegates to deterministic core functions for grocery aggregation, expiry classification, and allergen blocking. The results then return as both a user-visible decision and testable evidence.
>
> The important design decision is that the browser never decides whether a recipe is safe. The backend remains the source of truth, so presentation logic cannot silently override a safety decision.

### Slide 6 - My Role

**Time:** 35 seconds

**Say:**

> This was completed as an individual project, so I owned every project role. I defined the concept and scope, maintained the risk register, established the GitHub configuration-management process, implemented the deterministic controls and Flask demonstration, created the automated and system tests, and prepared the reports and presentation. This also allowed me to maintain direct traceability from each identified risk to its implementation and verification evidence.

### Slide 7 - Risk Identification and Tracking Method

**Time:** 45 seconds

**Say:**

> Risk management was iterative rather than a one-time list. I identified risks from safety-sensitive output, external dependencies, optimization complexity, profile data, boundary logic, and release scope. Each risk received likelihood and impact values from one to five, and the total score was calculated as likelihood multiplied by impact.
>
> I reviewed the risks weekly and connected each active risk to a control, a test, a CI check, or a documented scope decision. The UI consistency risk, R8, was added only after the web layer existed. That is an example of the register changing with the project rather than remaining static.

### Slide 8 - Top Project Risks

**Time:** 45 seconds

**Say:**

> The highest risk was unsafe generated output reaching a user with an allergy. Its likelihood score of five multiplied by an impact score of five produced a priority of twenty-five. Optimizer infeasibility followed at four times five, or twenty. These scores justified addressing the safety control before expanding optimization features.
>
> The new UI and demo consistency risk scored eight. It is lower than the safety and data risks, but still significant because an interface that contradicts the backend could misrepresent a safety decision. Five Flask endpoint tests and browser review reduce that risk.

### Slide 9 - Risk Mitigation and Control

**Time:** 50 seconds

**Say:**

> My control rule was that each major risk needed both a design response and repeatable evidence. Unsafe allergen output is blocked by the deterministic filter and verified by system scenario V1.1-ST-01. Pantry boundary risk is reduced through an inclusive rule and verified at today, plus three days, plus four days, and yesterday.
>
> External API instability is isolated from the release tests by using local fixtures and normalized data. Optimizer risk is controlled through scope: the unbounded optimizer was not included in the version 1.1 release. Finally, the UI risk is reduced by treating Flask as the source of truth, storing assets locally, providing a resettable state, and verifying the web contracts with WEB-01 through WEB-05.

### Slide 10 - Configuration Management Approach

**Time:** 50 seconds

**Say:**

> The configuration-management workflow starts from the stable main baseline. Changes are developed on a feature branch, reviewed through a pull request, and accepted only after the CI gate runs the automated tests and system scenarios. Stable releases receive tags and release records.
>
> Version 1.1.0 remains the tagged backend baseline. The Flask demonstration is recorded honestly under the Unreleased section until it completes the same review and tagging process. Controlled items now include backend and Flask source, HTML, JavaScript, CSS, local assets, tests, requirements, CI configuration, change records, reports, and release documentation.

### Slide 11 - Repository and Release Records

**Time:** 40 seconds

**Say:**

> The entire CISC-594 directory is the GitHub repository root, while PantryPilot remains a controlled project folder inside it. The repository preserves the main and feature branches, the version 1.0.0 and 1.1.0 tags, the original project history, and identifiable baseline, feature, release, and history-merge commits.
>
> The GitHub Actions workflow runs pytest and the system test runner. The changelog, release notes, updated reports, tests, tags, and commit history provide configuration status accounting and traceability rather than relying only on the current source files.

### Slide 12 - System Testing Approach

**Time:** 50 seconds

**Say:**

> Testing used two related evidence layers. Six formal release scenarios cover configuration identity, gates, grocery behavior, allergen decisions, and pantry boundaries. Five Flask test-client cases verify browser-facing routes, request validation, API decisions, and quality-summary reporting. Together with the original core tests, that produces eleven pytest tests.
>
> The local environment used Python 3.11, Flask 3.1.1, pytest 8.2.2, and Chrome for browser review, while CI uses Python 3.12. Manual desktop and mobile review supplements the API tests because layout and responsive behavior are visual concerns. The report documents the setup commands and exact expected and actual results.

### Slide 13 - Actual Results

**Time:** 30 seconds

**Say:**

> The final execution result was eleven of eleven pytest tests passed, including the five web and API regression tests. Separately, six of six formal release scenarios passed. No defects were observed in this controlled baseline. These results support release readiness for the demonstrated scope, but they do not claim that future AI, optimization, or production integrations have already been verified.

### Slide 14 - Closing

**Time:** 30 seconds

**Say:**

> The main takeaway is that PantryPilot's quality story is visible in working software, not only in documents. The demonstration exposed the same deterministic decisions, versioned controls, risk mitigations, and test evidence described in the reports and repository.
>
> By connecting risk, configuration management, implementation, and system testing, the project shows how a useful automation feature can be made reviewable and repeatable. Thank you. I am ready for questions.

## Live Demo Recovery Script

If the browser cannot load, remain on Slide 4 and use the embedded screenshot.

**Say:**

> I have a captured image of the same controlled application state on this slide. The Plan view shows the soy conflict blocked by the backend safety gate. The remaining sequence moves through grocery normalization, the inclusive pantry boundary, and the Quality view, where the six release scenarios execute. The results are also independently documented on Slide 13 and in the system testing report.

Do not spend presentation time troubleshooting. Continue directly to Slide 5 and explain the architecture.

## Likely Questions and Short Answers

### Is an AI model running in this demo?

> No. AI-assisted substitutions are part of the broader product concept. This release focuses on the deterministic control that must validate candidate output before it reaches a user. Keeping the demo local also removes external-service instability from the evidence.

### Why are there 11 tests but only 6 scenarios?

> The six scenarios are formal release-level system procedures with expected and actual results. The eleven pytest tests include core regressions plus five Flask web and API integration tests. They are complementary evidence sets, not conflicting counts.

### Is the web application included in the v1.1.0 tag?

> No. Version 1.1.0 is the tagged backend safety-and-grocery baseline. The Flask presentation layer is recorded under Unreleased until it completes the same branch, review, CI, and tagging process.

### Why use Flask for the interface?

> Flask provides a thin local HTTP layer while preserving the deterministic Python functions as the source of truth. It makes the controls easy to demonstrate without introducing a database or external service that is outside the release scope.

### What is the most important risk?

> Unsafe generated output reaching an allergic user. It scored five for likelihood and five for impact, producing the highest score of twenty-five. That is why deterministic allergen blocking was implemented before broader AI or optimization features.

### What would be tested next?

> I would add browser-level end-to-end automation, accessibility checks, persistent data tests, security testing for profile information, and controlled tests for any external recipe or AI service before those integrations entered a release baseline.
