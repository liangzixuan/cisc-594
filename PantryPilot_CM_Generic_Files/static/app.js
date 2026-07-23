const state = {
  data: null,
  activeView: "plan",
  selectedRecipeId: null,
  allergens: [],
  safetyByRecipe: {},
  groceryRecipeIds: [],
  grocery: null,
  pantry: null,
  expiryWindow: 3,
  quality: null,
};

const viewMeta = {
  plan: {
    kicker: "Week of August 10",
    title: "Weekly plan",
    summary: "Three dinners reviewed against your household profile.",
  },
  grocery: {
    kicker: "Generated from the weekly plan",
    title: "Grocery list",
    summary: "Overlapping ingredients are normalized and consolidated.",
  },
  pantry: {
    kicker: "Expiry-aware inventory",
    title: "Pantry status",
    summary: "Prioritize food inside the selected use-soon window.",
  },
  quality: {
    kicker: "Controlled baseline evidence",
    title: "Quality controls",
    summary: "Run the same release-level scenarios used in the system test report.",
  },
};

const groceryCategories = {
  broccoli: "Produce",
  scallions: "Produce",
  cucumber: "Produce",
  tomato: "Produce",
  lemon: "Produce",
  spinach: "Produce",
  tofu: "Chilled",
  cream: "Chilled",
  parmesan: "Chilled",
};

const gateLabels = {
  unit_tests_required: ["Unit tests", "Required"],
  pull_request_required: ["Pull request", "Required"],
  review_required: ["Code review", "Required"],
  ci_required: ["CI execution", "Required"],
};

const gateOrder = [
  "unit_tests_required",
  "pull_request_required",
  "review_required",
  "ci_required",
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "PantryPilot request failed.");
  }
  return payload;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function setView(view) {
  state.activeView = view;
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== view;
  });
  document.querySelector("#page-kicker").textContent = viewMeta[view].kicker;
  document.querySelector("#page-title").textContent = viewMeta[view].title;
  document.querySelector("#page-summary").textContent = viewMeta[view].summary;
  window.scrollTo(0, 0);
  refreshIcons();
}

function selectedRecipe() {
  return state.data.recipes.find((recipe) => recipe.id === state.selectedRecipeId);
}

function formatQuantity(value) {
  const number = Number(value);
  return Number.isInteger(number) ? String(number) : number.toFixed(1).replace(/\.0$/, "");
}

function categoryFor(name) {
  return groceryCategories[name] || "Pantry";
}

function categoryClass(category) {
  return category.toLowerCase();
}

function renderRecipeList() {
  const list = document.querySelector("#recipe-list");
  list.innerHTML = state.data.recipes.map((recipe) => {
    const result = state.safetyByRecipe[recipe.id];
    const status = result ? (result.safe ? "approved" : "blocked") : "checking";
    const icon = status === "approved" ? "circle-check" : status === "blocked" ? "shield-alert" : "loader-circle";
    const label = status === "approved" ? "Approved" : status === "blocked" ? "Blocked" : "Checking";
    return `
      <button class="recipe-card ${recipe.id === state.selectedRecipeId ? "selected" : ""}" type="button" data-recipe-id="${escapeHtml(recipe.id)}" aria-label="Review ${escapeHtml(recipe.name)}">
        <img class="recipe-image" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.name)}">
        <span class="recipe-copy">
          <span class="recipe-day">${escapeHtml(recipe.day)}</span>
          <h3>${escapeHtml(recipe.name)}</h3>
          <p>${escapeHtml(recipe.description)}</p>
          <span class="recipe-meta">
            <span><i data-lucide="clock-3"></i>${escapeHtml(recipe.duration)}</span>
            <span><i data-lucide="users"></i>${escapeHtml(recipe.servings)} servings</span>
            <span><i data-lucide="leaf"></i>${escapeHtml(recipe.tags[0])}</span>
          </span>
        </span>
        <span class="recipe-card-status ${status}" title="${label}" aria-label="${label}"><i data-lucide="${icon}"></i></span>
      </button>`;
  }).join("");

  list.querySelectorAll("[data-recipe-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRecipeId = button.dataset.recipeId;
      renderRecipeList();
      renderSafetyResult(state.safetyByRecipe[state.selectedRecipeId]);
      refreshIcons();
    });
  });
  refreshIcons();
}

function renderSafetyResult(result) {
  const recipe = selectedRecipe();
  document.querySelector("#selected-recipe-summary").innerHTML = `
    <span>Candidate recipe</span><strong>${escapeHtml(recipe.name)}</strong>`;

  const target = document.querySelector("#safety-result");
  if (!result) {
    target.className = "safety-result checking";
    target.innerHTML = `<span class="result-icon"><i data-lucide="loader-circle"></i></span><div><strong>Checking recipe</strong><p>Evaluating normalized ingredient aliases.</p></div>`;
  } else if (result.safe) {
    target.className = "safety-result approved";
    target.innerHTML = `<span class="result-icon"><i data-lucide="shield-check"></i></span><div><strong>Approved for this profile</strong><p>No declared allergen aliases were found. The recipe may continue to planning.</p></div>`;
  } else {
    const conflicts = result.conflicts.map((item) => item[0].toUpperCase() + item.slice(1)).join(", ");
    target.className = "safety-result blocked";
    target.innerHTML = `<span class="result-icon"><i data-lucide="shield-x"></i></span><div><strong>Blocked by safety gate</strong><p>${escapeHtml(conflicts)} conflict detected in the normalized ingredient list.</p></div>`;
  }
  refreshIcons();
}

function updatePlanMetrics() {
  const blocked = Object.values(state.safetyByRecipe).filter((result) => !result.safe).length;
  document.querySelector("#metric-meals").textContent = state.data.recipes.length;
  document.querySelector("#metric-blocked").textContent = blocked;
  document.querySelector("#metric-grocery").textContent = state.grocery?.item_count ?? "—";
  document.querySelector("#recipe-count").textContent = `${state.data.recipes.length} recipes`;
}

async function evaluateRecipes() {
  state.safetyByRecipe = {};
  renderRecipeList();
  renderSafetyResult(null);

  const results = await Promise.all(state.data.recipes.map((recipe) => api("/api/check-recipe", {
    method: "POST",
    body: JSON.stringify({ recipe_id: recipe.id, allergens: state.allergens }),
  })));
  state.safetyByRecipe = Object.fromEntries(results.map((result) => [result.recipe_id, result]));
  renderRecipeList();
  renderSafetyResult(state.safetyByRecipe[state.selectedRecipeId]);
  updatePlanMetrics();
}

function renderAllergenControls() {
  document.querySelectorAll("#allergen-options input").forEach((input) => {
    input.checked = state.allergens.includes(input.value);
    input.addEventListener("change", async () => {
      state.allergens = [...document.querySelectorAll("#allergen-options input:checked")].map((item) => item.value);
      await evaluateRecipes();
    });
  });
}

function renderGroceryFilters() {
  const target = document.querySelector("#grocery-recipe-filter");
  target.innerHTML = state.data.recipes.map((recipe) => `
    <label><input type="checkbox" value="${escapeHtml(recipe.id)}" ${state.groceryRecipeIds.includes(recipe.id) ? "checked" : ""}><span>${escapeHtml(recipe.day)} · ${escapeHtml(recipe.name)}</span></label>`).join("");
  target.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      state.groceryRecipeIds = [...target.querySelectorAll("input:checked")].map((item) => item.value);
    });
  });
}

function renderGrocery() {
  if (!state.grocery) return;
  const body = document.querySelector("#grocery-table-body");
  if (!state.grocery.items.length) {
    body.innerHTML = `<tr><td colspan="4">Select at least one recipe to build a grocery list.</td></tr>`;
  } else {
    body.innerHTML = state.grocery.items.map((item) => {
      const category = categoryFor(item.name);
      return `
        <tr>
          <td><span class="ingredient-name"><span class="ingredient-swatch ${categoryClass(category)}"></span>${escapeHtml(item.name)}</span></td>
          <td><strong>${escapeHtml(formatQuantity(item.quantity))}</strong> ${escapeHtml(item.unit)}</td>
          <td>${escapeHtml(category)}</td>
          <td><span class="table-status"><i data-lucide="circle-check"></i>Consolidated</span></td>
        </tr>`;
    }).join("");
  }
  document.querySelector("#grocery-count").textContent = `${state.grocery.item_count} items`;
  document.querySelector("#grocery-recipe-total").textContent = state.grocery.recipe_count;
  document.querySelector("#grocery-item-total").textContent = state.grocery.item_count;
  updatePlanMetrics();
  refreshIcons();
}

async function generateGrocery(showConfirmation = false) {
  const button = document.querySelector("#generate-grocery");
  button.disabled = true;
  state.grocery = await api("/api/grocery-list", {
    method: "POST",
    body: JSON.stringify({ recipe_ids: state.groceryRecipeIds }),
  });
  renderGrocery();
  button.disabled = false;
  if (showConfirmation) showToast(`${state.grocery.item_count} grocery items consolidated.`);
}

function renderPantry() {
  if (!state.pantry) return;
  const list = document.querySelector("#pantry-list");
  const statusCopy = {
    "use-soon": "Use soon",
    expired: "Expired",
    fresh: "Fresh",
  };
  list.innerHTML = state.pantry.items.map((item) => {
    const days = item.days_remaining;
    const dayCopy = days < 0 ? `${Math.abs(days)} day overdue` : days === 0 ? "Expires today" : `${days} days remaining`;
    return `
      <div class="pantry-item">
        <span class="pantry-item-icon"><i data-lucide="package"></i></span>
        <span class="pantry-item-copy"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.quantity)}</span></span>
        <span class="pantry-expiry"><strong>${escapeHtml(dayCopy)}</strong><span>${escapeHtml(item.expires)}</span></span>
        <span class="status-label ${escapeHtml(item.status)}">${escapeHtml(statusCopy[item.status])}</span>
      </div>`;
  }).join("");
  document.querySelector("#pantry-count").textContent = `${state.pantry.items.length} items`;
  document.querySelector("#use-soon-count").textContent = state.pantry.use_soon_count;
  document.querySelector("#expired-count").textContent = state.pantry.expired_count;
  document.querySelector("#window-value").textContent = state.pantry.window_days;
  refreshIcons();
}

async function loadPantry(windowDays = state.expiryWindow) {
  state.expiryWindow = windowDays;
  state.pantry = await api("/api/pantry-status", {
    method: "POST",
    body: JSON.stringify({ today: state.data.today, window_days: windowDays }),
  });
  renderPantry();
}

function renderQualityGates() {
  document.querySelector("#quality-gates").innerHTML = gateOrder.map((key) => {
    const enabled = state.data.quality_gates[key];
    const [label, detail] = gateLabels[key];
    return `<div class="gate-item"><i data-lucide="${enabled ? "badge-check" : "circle-x"}"></i><span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(detail)}</small></span></div>`;
  }).join("");
  refreshIcons();
}

function renderQuality() {
  if (!state.quality) return;
  document.querySelector("#scenario-list").innerHTML = state.quality.scenarios.map((scenario) => {
    const passed = scenario.result === "PASS";
    return `
      <div class="scenario-row">
        <span class="scenario-id">${escapeHtml(scenario.id)}</span>
        <span class="scenario-copy"><strong>${escapeHtml(scenario.description)}</strong><span>${escapeHtml(JSON.stringify(scenario.actual))}</span></span>
        <span class="scenario-result ${passed ? "" : "fail"}"><i data-lucide="${passed ? "check" : "x"}"></i>${escapeHtml(scenario.result)}</span>
      </div>`;
  }).join("");

  const score = document.querySelector("#quality-score");
  score.className = `quality-score ${state.quality.status}`;
  score.innerHTML = `
    <span class="score-ring"><strong>${state.quality.passed}</strong><small>/ ${state.quality.total}</small></span>
    <h2>Release checks</h2>
    <p>${state.quality.status === "passed" ? "Controlled baseline verified" : "Release review required"}</p>`;
  const status = document.querySelector("#quality-status");
  status.className = `section-count ${state.quality.status === "passed" ? "" : "neutral"}`;
  status.textContent = `${state.quality.passed} / ${state.quality.total} passed`;
  refreshIcons();
}

async function runQualityChecks() {
  const button = document.querySelector("#run-quality-checks");
  button.disabled = true;
  button.innerHTML = `<i data-lucide="loader-circle"></i><span>Running checks</span>`;
  refreshIcons();
  const [quality] = await Promise.all([
    api("/api/quality-summary"),
    new Promise((resolve) => window.setTimeout(resolve, 650)),
  ]);
  state.quality = quality;
  renderQuality();
  button.disabled = false;
  button.innerHTML = `<i data-lucide="rotate-cw"></i><span>Run again</span>`;
  refreshIcons();
  showToast(`${quality.passed} of ${quality.total} release checks passed.`);
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  document.querySelector("#generate-grocery").addEventListener("click", () => generateGrocery(true));
  document.querySelector("#run-quality-checks").addEventListener("click", runQualityChecks);
  document.querySelector("#reset-demo").addEventListener("click", async () => {
    state.selectedRecipeId = state.data.recipes[0].id;
    state.allergens = [...state.data.profile.allergens];
    state.groceryRecipeIds = state.data.recipes.map((recipe) => recipe.id);
    state.expiryWindow = 3;
    state.quality = null;
    document.querySelectorAll("#allergen-options input").forEach((input) => {
      input.checked = state.allergens.includes(input.value);
    });
    renderGroceryFilters();
    document.querySelectorAll("#window-control button").forEach((button) => button.classList.toggle("active", Number(button.dataset.window) === 3));
    document.querySelector("#scenario-list").innerHTML = `<div class="quality-empty"><i data-lucide="flask-conical"></i><p>Run the checks to evaluate the controlled baseline.</p></div>`;
    document.querySelector("#quality-score").className = "quality-score";
    document.querySelector("#quality-score").innerHTML = `<span class="score-ring"><strong>—</strong><small>/ 6</small></span><h2>Release checks</h2><p>Waiting for execution</p>`;
    document.querySelector("#quality-status").textContent = "Ready to run";
    document.querySelector("#quality-status").className = "section-count neutral";
    await Promise.all([evaluateRecipes(), generateGrocery(), loadPantry(3)]);
    setView("plan");
    showToast("Demo returned to the default soy-allergy scenario.");
  });
  document.querySelectorAll("#window-control button").forEach((button) => {
    button.addEventListener("click", async () => {
      document.querySelectorAll("#window-control button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      await loadPantry(Number(button.dataset.window));
    });
  });
}

async function initialize() {
  try {
    state.data = await api("/api/demo-data");
    state.selectedRecipeId = state.data.recipes[0].id;
    state.allergens = [...state.data.profile.allergens];
    state.groceryRecipeIds = state.data.recipes.map((recipe) => recipe.id);

    document.querySelector("#sidebar-release").textContent = `v${state.data.release.version}`;
    document.querySelector("#quality-release").textContent = `PantryPilot ${state.data.release.version}`;
    renderAllergenControls();
    renderGroceryFilters();
    renderQualityGates();
    bindEvents();

    await Promise.all([evaluateRecipes(), generateGrocery(), loadPantry()]);
    updatePlanMetrics();
    setView("plan");
    document.querySelector("#app-shell").setAttribute("aria-hidden", "false");
    document.querySelector("#loading-screen").classList.add("hidden");
    refreshIcons();
  } catch (error) {
    document.querySelector("#loading-screen").innerHTML = `<strong>PantryPilot could not start</strong><span>${escapeHtml(error.message)}</span>`;
  }
}

refreshIcons();
initialize();
