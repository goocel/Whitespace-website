/*
 * Engagement Scope Builder (window.ScopeBuilder).
 *
 * Mount point:  <div data-scope-builder data-submit="preview" data-heading-level="2"></div>
 *   data-submit         "preview" (default) never sends anything; "live" sends through js/form-send.js.
 *                       Keep "preview" until FormSubmit activation for contact@whitespace.id is confirmed.
 *   data-heading-level  level of the step headings (2 under a page h1; 3 inside a section with an h2).
 *
 * Needs js/scope-data.js (window.ScopeData) and js/form-send.js (window.FormSend), loaded first.
 * Everything is rendered from the data, so every page that mounts the builder shares one source.
 * All classes start with "sb-" so the site's shared scripts (site.js, motion.js) and styles
 * (.form, .field, .step, .point …) never touch the builder.
 *
 * Local preview of options pending validation: open the page on localhost / 127.0.0.1 with
 * ?pending=1. js/scope-data-pending.js is then loaded and its items are labelled "Pending
 * validation"; sending is forced to preview. Never loaded anywhere else.
 */
(function () {
  const STORAGE_KEY = "whitespace.scopeBuilder.v1";
  const SCRIPT_SRC = document.currentScript ? document.currentScript.src : "js/scope-builder.js";
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let instances = 0;

  /* ---------- Small DOM helper: h("p", { class: "x" }, "text", childNode) ---------- */
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === false || value == null) return;
      if (key === "text") el.textContent = value;
      else if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? "" : value);
    });
    children.flat().forEach((child) => child != null && child !== false && el.append(child));
    return el;
  }

  /* ---------- Draft in sessionStorage (may be unavailable: private mode, blocked storage) ---------- */
  const storage = {
    load() {
      try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    save(state) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        /* the builder works without a draft */
      }
    },
    clear() {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* nothing to clear */
      }
    },
  };

  const emptyState = () => ({
    v: 1,
    step: 1,
    maxStep: 1,
    scope: "",
    priorities: [],
    priorityOther: "",
    coverage: "",
    entities: "",
    vertical: [],
    horizontal: [],
    horizontalOther: "",
    services: [],
    context: "",
    contact: { name: "", email: "", company: "", position: "", phone: "" },
  });

  /* =====================================================================
     One builder instance
     ===================================================================== */
  function createBuilder(root, data, { pendingPreview = false } = {}) {
    const uid = `sb${++instances}`;
    const id = (name) => `${uid}-${name}`;
    const level = Math.min(Math.max(parseInt(root.dataset.headingLevel, 10) || 2, 2), 5);
    const mode = !pendingPreview && root.dataset.submit === "live" ? "live" : "preview";
    const steps = data.steps;
    const STEP_COUNT = steps.length;

    let state = emptyState();
    const ui = {}; // references to rendered elements

    /* ---------- Lookups ---------- */
    const byId = (list, key) => list.find((item) => item.id === key);
    const labelOf = (list, key) => (byId(list, key) || {}).label || key;
    const pendingTag = (item) => (item && item.status === "pending" ? " (pending validation)" : "");
    const priorityAvailable = (item) => !item.scopes || item.scopes.includes(state.scope);
    // Priorities chosen under another scope stay in the state (so going back restores them) but only
    // those available for the current scope count.
    const activePriorities = () =>
      state.priorities.filter((key) => {
        const item = byId(data.priorities, key);
        return item && priorityAvailable(item);
      });
    const verticalOptions = data.vertical.options;
    const horizontalOptions = data.horizontal.options;

    /* ---------- Rendering helpers ---------- */
    function option({ type, name, item, group }) {
      const input = h("input", { class: "sb-option__input", type, name, value: item.id });
      if (item.exclusive) input.dataset.exclusive = "";
      const label = h(
        "label",
        { class: "sb-option", "data-group": group, "data-scopes": item.scopes ? item.scopes.join(" ") : null },
        input,
        h(
          "span",
          { class: "sb-option__box" },
          h("span", { class: `sb-option__mark sb-option__mark--${type}`, "aria-hidden": "true" }),
          h(
            "span",
            { class: "sb-option__text" },
            h("span", { class: "sb-option__label", text: item.label }),
            item.hint ? h("span", { class: "sb-option__hint", text: item.hint }) : null
          ),
          item.status === "pending" ? h("span", { class: "sb-badge", text: "Pending validation" }) : null
        )
      );
      return label;
    }

    function field({ name, label, type = "text", optional = false, required = false, autocomplete, multiline = false, hint }) {
      const inputId = id(name);
      const errorId = id(`${name}-error`);
      const hintId = hint ? id(`${name}-hint`) : null;
      const control = multiline
        ? h("textarea", { class: "sb-field__input", id: inputId, name, rows: "4", "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") })
        : h("input", {
            class: "sb-field__input",
            id: inputId,
            name,
            type,
            autocomplete,
            required,
            "aria-describedby": [hintId, errorId].filter(Boolean).join(" "),
          });
      return h(
        "div",
        { class: "sb-field", "data-field": name },
        h("label", { class: "sb-field__label", for: inputId }, label, optional ? h("span", { class: "sb-field__opt", text: " (optional)" }) : null),
        hint ? h("p", { class: "sb-field__hint", id: hintId, text: hint }) : null,
        control,
        h("p", { class: "sb-field__error", id: errorId, hidden: true })
      );
    }

    function group({ role = "group", labelledby, describedby, className = "sb-options", children }) {
      return h("div", { class: className, role, "aria-labelledby": labelledby, "aria-describedby": describedby }, children);
    }

    function panel(n, ...body) {
      const step = steps[n - 1];
      const titleId = id(`title-${n}`);
      const hintId = id(`hint-${n}`);
      const errorId = id(`error-${n}`);
      return h(
        "section",
        { class: "sb-panel", "data-step": n, "aria-labelledby": titleId, hidden: true },
        h(
          `h${level}`,
          { class: "sb-panel__title", id: titleId, tabindex: "-1" },
          h("span", { class: "sb-panel__count", text: `Step ${n} of ${STEP_COUNT}` }),
          h("span", { class: "sb-panel__text", text: step.title })
        ),
        h("p", { class: "sb-panel__hint", id: hintId, text: step.hint }),
        step.note ? h("p", { class: "sb-panel__note", text: step.note }) : null,
        h("p", { class: "sb-error", id: errorId, role: "alert", hidden: true }),
        ...body
      );
    }
    const describedBy = (n) => `${id(`hint-${n}`)} ${id(`error-${n}`)}`;

    /* ---------- Build the whole builder ---------- */
    function render() {
      root.textContent = "";
      root.classList.add("sb");

      // Notices
      ui.pendingBanner = pendingPreview
        ? h("p", { class: "sb-notice sb-notice--pending" }, h("strong", { text: "Local preview with pending options. " }), "Items marked “Pending validation” are not approved and never appear in production. Sending is switched off.")
        : null;
      ui.restored = h(
        "p",
        { class: "sb-notice", hidden: true },
        "We restored your selections from earlier in this session. ",
        h("button", { type: "button", class: "sb-link", text: "Start over", onclick: startOver })
      );

      // Progress: numbered stepper (wide screens) and a bar with "Step n of 6" (phones)
      ui.stepButtons = steps.map((step, i) =>
        h(
          "button",
          { type: "button", class: "sb-stepper__btn", "data-go": i + 1, onclick: () => goTo(i + 1) },
          h("span", { class: "sb-stepper__num", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }),
          h("span", { class: "sb-stepper__label", text: step.short }),
          h("span", { class: "sb-sr", text: ` (step ${i + 1} of ${STEP_COUNT})` })
        )
      );
      ui.progressCount = h("p", { class: "sb-progress__count", "aria-hidden": "true" });
      ui.progressBar = h("span", { class: "sb-progress__fill" });
      const progress = h(
        "nav",
        { class: "sb-progress", "aria-label": "Configuration steps" },
        ui.progressCount,
        h("div", { class: "sb-progress__bar", "aria-hidden": "true" }, ui.progressBar),
        h("ol", { class: "sb-stepper" }, ui.stepButtons.map((btn) => h("li", {}, btn)))
      );

      // Step 1: organization scope (one choice)
      const p1 = panel(
        1,
        group({
          role: "radiogroup",
          labelledby: id("title-1"),
          describedby: describedBy(1),
          className: "sb-options sb-options--2",
          children: data.scopes.map((item) => option({ type: "radio", name: "sb-scope", item, group: "scope" })),
        })
      );

      // Step 2: priorities (several; filtered by scope; "Other" opens a text field)
      const p2 = panel(
        2,
        group({
          labelledby: id("title-2"),
          describedby: describedBy(2),
          className: "sb-options sb-options--2",
          children: data.priorities.map((item) => option({ type: "checkbox", name: "sb-priority", item, group: "priority" })),
        }),
        field({ name: "sb-priority-other", label: (byId(data.priorities, "other") || {}).otherLabel || "Please specify" })
      );

      // Step 3: coverage (one choice) + optional entity names
      const p3 = panel(
        3,
        group({
          role: "radiogroup",
          labelledby: id("title-3"),
          describedby: describedBy(3),
          className: "sb-options sb-options--2",
          children: data.coverage.map((item) => option({ type: "radio", name: "sb-coverage", item, group: "coverage" })),
        }),
        field({ name: "sb-entities", label: data.entitiesLabel, optional: true })
      );

      // Step 4: vertical and horizontal coverage, two independent dimensions
      const dimension = (key, conf, extra) => {
        const titleId = id(`${key}-title`);
        const hintId = id(`${key}-hint`);
        return h(
          "div",
          { class: "sb-dimension" },
          h("p", { class: "sb-dimension__title", id: titleId, text: conf.title }),
          h("p", { class: "sb-dimension__hint", id: hintId, text: conf.hint }),
          group({
            labelledby: titleId,
            describedby: `${hintId} ${id("error-4")}`,
            className: "sb-options sb-options--list",
            children: conf.options.map((item) => option({ type: "checkbox", name: `sb-${key}`, item, group: key })),
          }),
          extra
        );
      };
      const p4 = panel(
        4,
        h(
          "div",
          { class: "sb-dimensions" },
          dimension("vertical", data.vertical),
          dimension("horizontal", data.horizontal, field({ name: "sb-horizontal-other", label: (byId(horizontalOptions, "other") || {}).otherLabel || "Please specify" }))
        )
      );

      // Step 5: type of support (several)
      const p5 = panel(
        5,
        group({
          labelledby: id("title-5"),
          describedby: describedBy(5),
          className: "sb-options sb-options--2", // three pillars + "Not sure yet" as a 2 × 2 grid
          children: data.services.map((item) => option({ type: "checkbox", name: "sb-service", item, group: "service" })),
        })
      );

      // Step 6: review, context, contact details, privacy, send
      ui.review = h("dl", { class: "sb-summary__list sb-summary__list--review" });
      ui.sendError = h("div", { class: "sb-alert", role: "alert", tabindex: "-1", hidden: true });
      const contactTitleId = id("contact-title");
      const p6 = panel(
        6,
        h("div", { class: "sb-review" }, ui.review),
        field({ name: "sb-context", label: data.review.contextLabel, hint: data.review.contextHint, multiline: true }),
        h(
          "div",
          { class: "sb-contact", role: "group", "aria-labelledby": contactTitleId },
          h("p", { class: "sb-dimension__title", id: contactTitleId, text: "How can we reach you?" }),
          h(
            "div",
            { class: "sb-contact__grid" },
            field({ name: "sb-name", label: "Name", required: true, autocomplete: "name" }),
            field({ name: "sb-email", label: "Work email", type: "email", required: true, autocomplete: "email" }),
            field({ name: "sb-company", label: "Company", optional: true, autocomplete: "organization" }),
            field({ name: "sb-position", label: "Position", optional: true, autocomplete: "organization-title" }),
            field({ name: "sb-phone", label: "Phone", type: "tel", optional: true, autocomplete: "tel" })
          )
        ),
        h("p", { class: "sb-disclaimer", text: data.review.disclaimer }),
        h("p", { class: "sb-privacy" }, h("strong", { text: "Privacy. " }), data.review.privacy),
        ui.sendError
      );

      ui.panels = [p1, p2, p3, p4, p5, p6];

      // Actions
      ui.back = h("button", { type: "button", class: "sb-btn sb-btn--secondary", text: "Back", onclick: () => goTo(state.step - 1, { validate: false }) });
      ui.toReview = h("button", { type: "button", class: "sb-btn sb-btn--ghost", text: "Back to review", onclick: () => goTo(STEP_COUNT) });
      ui.next = h("button", { type: "submit", class: "btn btn--orange sb-btn--primary", text: "Continue" });
      const actions = h("div", { class: "sb-actions" }, ui.back, h("div", { class: "sb-actions__end" }, ui.toReview, ui.next));

      // Spam trap: people never see or fill it
      const honey = h("input", { type: "text", name: "_honey", class: "sb-honey", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" });

      ui.form = h("form", { class: "sb-form", novalidate: true, "aria-label": "Configure your engagement" }, honey, ...ui.panels, actions);
      ui.form.addEventListener("submit", onSubmit);
      ui.form.addEventListener("change", onChange);
      ui.form.addEventListener("input", onInput);

      // Summary: sticky card (desktop), bottom bar that opens (phones)
      ui.summaryList = h("dl", { class: "sb-summary__list" });
      ui.summaryCount = h("span", { class: "sb-summary__count" });
      ui.summaryToggle = h(
        "button",
        { type: "button", class: "sb-summary__toggle", "aria-expanded": "false", "aria-controls": id("summary-body"), onclick: toggleSummary },
        h("span", { class: "sb-summary__toggle-label", text: "Your configuration" }),
        ui.summaryCount
      );
      ui.next6 = h("ol", { class: "sb-next" }, data.review.next.map((text) => h("li", { text })));
      ui.summaryBody = h(
        "div",
        { class: "sb-summary__body", id: id("summary-body") },
        h("p", { class: "sb-summary__title", text: "Your configuration" }),
        ui.summaryList,
        h("div", { class: "sb-summary__next" }, h("p", { class: "sb-summary__title", text: "What happens next" }), ui.next6),
        h("p", { class: "sb-summary__foot", text: data.review.disclaimer })
      );
      ui.summary = h("aside", { class: "sb-summary", "aria-label": "Your configuration so far" }, ui.summaryToggle, ui.summaryBody);

      ui.layout = h("div", { class: "sb-layout" }, ui.form, ui.summary);
      ui.result = h("div", { class: "sb-result", tabindex: "-1", hidden: true });
      ui.live = h("p", { class: "sb-sr", "aria-live": "polite", "aria-atomic": "true" });

      root.append(...[ui.pendingBanner, ui.restored, progress, ui.layout, ui.result, ui.live].filter(Boolean));
    }

    /* ---------- State ↔ form ---------- */
    const inputs = (name) => [...ui.form.querySelectorAll(`[name="${name}"]`)];
    const checkedValues = (name) => inputs(name).filter((i) => i.checked).map((i) => i.value);
    const valueOf = (name) => ui.form.elements[name].value;

    function readForm() {
      const radio = (name) => (inputs(name).find((i) => i.checked) || {}).value || "";
      state.scope = radio("sb-scope");
      state.priorities = checkedValues("sb-priority");
      state.priorityOther = valueOf("sb-priority-other");
      state.coverage = radio("sb-coverage");
      state.entities = valueOf("sb-entities");
      state.vertical = checkedValues("sb-vertical");
      state.horizontal = checkedValues("sb-horizontal");
      state.horizontalOther = valueOf("sb-horizontal-other");
      state.services = checkedValues("sb-service");
      state.context = valueOf("sb-context");
      state.contact = {
        name: valueOf("sb-name"),
        email: valueOf("sb-email"),
        company: valueOf("sb-company"),
        position: valueOf("sb-position"),
        phone: valueOf("sb-phone"),
      };
    }

    function writeForm() {
      const setChecked = (name, values) => inputs(name).forEach((i) => (i.checked = values.includes(i.value)));
      setChecked("sb-scope", [state.scope]);
      setChecked("sb-priority", state.priorities);
      setChecked("sb-coverage", [state.coverage]);
      setChecked("sb-vertical", state.vertical);
      setChecked("sb-horizontal", state.horizontal);
      setChecked("sb-service", state.services);
      const set = (name, value) => (ui.form.elements[name].value = value || "");
      set("sb-priority-other", state.priorityOther);
      set("sb-entities", state.entities);
      set("sb-horizontal-other", state.horizontalOther);
      set("sb-context", state.context);
      Object.entries(state.contact).forEach(([key, value]) => set(`sb-${key}`, value));
    }

    function persist() {
      storage.save(state);
    }

    /* ---------- Dependent UI: filtered priorities, "specify" fields, entity names ---------- */
    function syncDependents() {
      ui.form.querySelectorAll('.sb-option[data-group="priority"]').forEach((label) => {
        const item = byId(data.priorities, label.querySelector("input").value);
        label.hidden = !priorityAvailable(item);
      });
      const showField = (name, show) => {
        const wrap = ui.form.querySelector(`[data-field="${name}"]`);
        wrap.hidden = !show;
        if (!show) setFieldError(name, "");
      };
      showField("sb-priority-other", activePriorities().includes("other"));
      showField("sb-horizontal-other", state.horizontal.includes("other"));
      const coverage = byId(data.coverage, state.coverage);
      showField("sb-entities", Boolean(coverage && coverage.entities));
    }

    /* ---------- Validation ---------- */
    function setFieldError(name, message) {
      const input = ui.form.elements[name];
      const error = document.getElementById(id(`${name}-error`));
      if (!input || !error) return;
      input.setAttribute("aria-invalid", message ? "true" : "false");
      input.closest(".sb-field").classList.toggle("is-invalid", Boolean(message));
      error.textContent = message;
      error.hidden = !message;
    }

    function setStepError(n, message) {
      const error = document.getElementById(id(`error-${n}`));
      error.textContent = message;
      error.hidden = !message;
      ui.panels[n - 1].classList.toggle("is-invalid", Boolean(message));
      ui.panels[n - 1].querySelectorAll("[role=group], [role=radiogroup]").forEach((g) => {
        if (g.closest(".sb-contact")) return;
        g.setAttribute("aria-invalid", message ? "true" : "false");
      });
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /** Problems on step n: [{ field?, message, focus }] — empty when the step is complete. */
    function problems(n) {
      const list = [];
      const first = (name) => inputs(name).find((i) => !i.closest(".sb-option").hidden);
      if (n === 1 && !state.scope) list.push({ message: "Choose where you need Whitespace.", focus: first("sb-scope") });
      if (n === 2) {
        const active = activePriorities();
        if (!active.length) list.push({ message: "Choose at least one priority, or “Not sure yet”.", focus: first("sb-priority") });
        else if (active.includes("other") && !state.priorityOther.trim())
          list.push({ field: "sb-priority-other", message: "Tell us which other priority, or untick “Other”.", focus: ui.form.elements["sb-priority-other"] });
      }
      if (n === 3 && !state.coverage) list.push({ message: "Choose the organizational coverage.", focus: first("sb-coverage") });
      if (n === 4) {
        if (!state.vertical.length && !state.horizontal.length)
          list.push({ message: "Choose at least one level or one function. You can combine both.", focus: first("sb-vertical") });
        else if (state.horizontal.includes("other") && !state.horizontalOther.trim())
          list.push({ field: "sb-horizontal-other", message: "Tell us which other functions, or untick “Other functions”.", focus: ui.form.elements["sb-horizontal-other"] });
      }
      if (n === 5 && !state.services.length) list.push({ message: "Choose at least one type of support, or “Not sure yet”.", focus: first("sb-service") });
      if (n === 6) {
        const { name, email } = state.contact;
        if (!name.trim()) list.push({ field: "sb-name", message: "Please enter your name.", focus: ui.form.elements["sb-name"] });
        if (!email.trim()) list.push({ field: "sb-email", message: "Please enter your work email.", focus: ui.form.elements["sb-email"] });
        else if (!EMAIL_RE.test(email.trim()))
          list.push({ field: "sb-email", message: "Please enter a valid email address, e.g. name@company.com.", focus: ui.form.elements["sb-email"] });
      }
      return list;
    }

    /** Shows (or clears) the messages for step n; returns true when the step is complete. */
    function validate(n, { show = true } = {}) {
      const list = problems(n);
      if (!show) return !list.length;
      const stepLevel = list.find((p) => !p.field);
      setStepError(n, stepLevel ? stepLevel.message : list.length && n !== 6 ? "Please complete the highlighted field." : "");
      const fieldNames = { 2: ["sb-priority-other"], 4: ["sb-horizontal-other"], 6: ["sb-name", "sb-email"] }[n] || [];
      fieldNames.forEach((name) => setFieldError(name, (list.find((p) => p.field === name) || {}).message || ""));
      if (list.length) {
        announce(`There is a problem on step ${n}: ${list[0].message}`);
        if (list[0].focus) list[0].focus.focus();
      }
      return !list.length;
    }

    const firstIncomplete = (upTo) => {
      for (let n = 1; n <= upTo; n++) if (problems(n).length) return n;
      return 0;
    };

    /* ---------- Navigation ---------- */
    function announce(text) {
      ui.live.textContent = "";
      // A fresh text node in the next frame makes screen readers read repeated messages too.
      requestAnimationFrame(() => (ui.live.textContent = text));
    }

    function show(n, { focus = true, scroll = true } = {}) {
      state.step = n;
      state.maxStep = Math.max(state.maxStep, n);
      ui.panels.forEach((p, i) => {
        const active = i + 1 === n;
        if (active && p.hidden) {
          p.hidden = false;
          if (!reduceMotion()) {
            p.classList.remove("sb-panel--enter");
            void p.offsetWidth; // restart the entrance animation
            p.classList.add("sb-panel--enter");
          }
        } else if (!active) p.hidden = true;
      });
      ui.stepButtons.forEach((btn, i) => {
        const n2 = i + 1;
        btn.toggleAttribute("aria-current", n2 === n);
        if (n2 === n) btn.setAttribute("aria-current", "step");
        btn.disabled = n2 > state.maxStep;
        btn.classList.toggle("is-done", n2 < n || (n2 <= state.maxStep && n2 !== n && !problems(n2).length));
      });
      ui.progressCount.textContent = `Step ${n} of ${STEP_COUNT} · ${steps[n - 1].short}`;
      ui.progressBar.style.transform = `scaleX(${n / STEP_COUNT})`;
      ui.back.hidden = n === 1;
      ui.toReview.hidden = !(state.maxStep === STEP_COUNT && n < STEP_COUNT);
      ui.next.textContent = n === STEP_COUNT ? "Engage Whitespace" : "Continue";
      root.classList.toggle("is-review", n === STEP_COUNT);
      if (n === STEP_COUNT) renderSummary(ui.review, { review: true });
      setSummaryOpen(false);
      renderSummary(ui.summaryList);
      persist();

      if (scroll) {
        const top = root.getBoundingClientRect().top;
        if (top < 0) root.scrollIntoView({ block: "start", behavior: reduceMotion() ? "auto" : "smooth" });
      }
      if (focus) {
        ui.panels[n - 1].querySelector(".sb-panel__title").focus({ preventScroll: true });
        announce(`Step ${n} of ${STEP_COUNT}: ${steps[n - 1].title}`);
      }
    }

    /** Go to step n. Forward moves need every step before n complete; the first gap is shown instead. */
    function goTo(n, { validate: check = true } = {}) {
      if (n < 1 || n > STEP_COUNT) return;
      readForm();
      if (check && n > state.step) {
        const gap = firstIncomplete(n - 1);
        if (gap) {
          if (gap !== state.step) show(gap, { focus: false });
          validate(gap);
          return;
        }
      }
      show(n);
    }

    function onSubmit(event) {
      event.preventDefault();
      readForm();
      if (state.step < STEP_COUNT) {
        if (validate(state.step)) show(state.step + 1);
        return;
      }
      const gap = firstIncomplete(STEP_COUNT);
      if (gap) {
        if (gap !== STEP_COUNT) show(gap, { focus: false });
        validate(gap);
        return;
      }
      submit();
    }

    function onChange(event) {
      const input = event.target;
      // "Not sure yet" and the other choices exclude each other
      if (input.type === "checkbox" && input.checked) {
        const siblings = inputs(input.name);
        if (input.hasAttribute("data-exclusive")) siblings.forEach((i) => i !== input && (i.checked = false));
        else siblings.forEach((i) => i.hasAttribute("data-exclusive") && (i.checked = false));
      }
      readForm();
      syncDependents();
      // Clear a step message as soon as the step is complete
      if (!document.getElementById(id(`error-${state.step}`)).hidden && !problems(state.step).some((p) => !p.field)) setStepError(state.step, "");
      renderSummary(ui.summaryList);
      if (state.step === STEP_COUNT) renderSummary(ui.review, { review: true });
      persist();
    }

    function onInput(event) {
      readForm();
      const name = event.target.name;
      // Re-check a text field while typing only once its message is showing
      if (event.target.getAttribute("aria-invalid") === "true") {
        const problem = problems(state.step).find((p) => p.field === name);
        setFieldError(name, problem ? problem.message : "");
      }
      persist();
    }

    /* ---------- Summary ---------- */
    function summaryRows() {
      const pr = activePriorities().map((key) => {
        const item = byId(data.priorities, key);
        return key === "other" && state.priorityOther.trim() ? `Other: ${state.priorityOther.trim()}` : item.label + pendingTag(item);
      });
      const hz = state.horizontal.map((key) =>
        key === "other" && state.horizontalOther.trim() ? `Other: ${state.horizontalOther.trim()}` : labelOf(horizontalOptions, key)
      );
      const coverage = state.coverage ? labelOf(data.coverage, state.coverage) : "";
      const showEntities = state.entities.trim() && (byId(data.coverage, state.coverage) || {}).entities;
      return [
        { step: 1, key: "Organization scope", value: state.scope ? [labelOf(data.scopes, state.scope)] : [] },
        { step: 2, key: "Priorities", value: pr },
        { step: 3, key: "Coverage", value: coverage ? [coverage, showEntities ? `Entities: ${state.entities.trim()}` : null].filter(Boolean) : [] },
        { step: 4, key: "Vertical coverage", value: state.vertical.map((key) => labelOf(verticalOptions, key)) },
        { step: 4, key: "Horizontal coverage", value: hz },
        { step: 5, key: "Type of support", value: state.services.map((key) => labelOf(data.services, key)) },
      ];
    }

    function renderSummary(list, { review = false } = {}) {
      list.textContent = "";
      const rows = summaryRows();
      rows.forEach((row) => {
        const empty = !row.value.length;
        list.append(
          h(
            "div",
            { class: `sb-summary__row${empty ? " is-empty" : ""}` },
            h("dt", { text: row.key }),
            h("dd", {}, empty ? h("span", { class: "sb-summary__empty", text: "Not chosen yet" }) : h("ul", {}, row.value.map((v) => h("li", { text: v })))),
            // Edit on any step already reached, except the one on screen (the review list: always)
            review || (state.maxStep >= row.step && row.step !== state.step)
              ? h("dd", { class: "sb-summary__edit" }, h("button", { type: "button", class: "sb-link", text: "Edit", "aria-label": `Edit ${row.key.toLowerCase()}`, onclick: () => goTo(row.step, { validate: false }) }))
              : null
          )
        );
      });
      if (list === ui.summaryList) {
        const answered = [state.scope, activePriorities().length, state.coverage, state.vertical.length || state.horizontal.length, state.services.length].filter(Boolean).length;
        ui.summaryCount.textContent = `${answered} of 5 answered`;
      }
    }

    function setSummaryOpen(open) {
      ui.summary.classList.toggle("is-open", open);
      ui.summaryToggle.setAttribute("aria-expanded", String(open));
    }
    function toggleSummary() {
      setSummaryOpen(!ui.summary.classList.contains("is-open"));
    }

    /* ---------- Submission ---------- */
    function buildMessage() {
      const rows = summaryRows();
      const joined = (row) => row.value.join("; ");
      const scopeLabel = state.scope ? labelOf(data.scopes, state.scope) : "";
      const services = state.services.map((key) => labelOf(data.services, key));
      const c = state.contact;
      const fields = {
        "Organization scope": joined(rows[0]),
        Priorities: joined(rows[1]),
        Coverage: joined(rows[2]),
        "Vertical coverage": joined(rows[3]),
        "Horizontal coverage": joined(rows[4]),
        "Type of support": joined(rows[5]),
        Context: state.context.trim(),
        Name: c.name.trim(),
        email: c.email.trim(), // FormSubmit uses the "email" field as the reply-to address
        Company: c.company.trim(),
        Position: c.position.trim(),
        Phone: c.phone.trim(),
        Page: window.location.pathname.split("/").pop() || "index.html",
      };
      Object.keys(fields).forEach((key) => fields[key] === "" && delete fields[key]);
      const config = {
        version: data.version,
        scope: state.scope,
        priorities: activePriorities(),
        priorityOther: activePriorities().includes("other") ? state.priorityOther.trim() : "",
        coverage: state.coverage,
        entities: (byId(data.coverage, state.coverage) || {}).entities ? state.entities.trim() : "",
        vertical: state.vertical,
        horizontal: state.horizontal,
        horizontalOther: state.horizontal.includes("other") ? state.horizontalOther.trim() : "",
        services: state.services,
      };
      return {
        subject: `Engagement scope: ${scopeLabel} · ${services.join(" + ")}`,
        fields,
        extra: { config_json: JSON.stringify(config) },
      };
    }

    async function submit() {
      const message = buildMessage();
      ui.sendError.hidden = true;
      ui.next.disabled = true;
      ui.next.setAttribute("aria-busy", "true");
      ui.next.textContent = mode === "live" ? "Sending…" : "Preparing preview…";
      const result = await window.FormSend.send({ mode, ...message, honey: ui.form.elements._honey.value });
      ui.next.disabled = false;
      ui.next.removeAttribute("aria-busy");
      ui.next.textContent = "Engage Whitespace";

      if (result.status === "preview") return showResult("preview", message, result);
      if (result.status === "sent") {
        storage.clear();
        return showResult("sent", message, result);
      }
      // Failed: everything stays as it is; offer the email app instead
      const body = `${window.FormSend.toText(message.fields)}`;
      ui.sendError.textContent = "";
      ui.sendError.append(
        h("strong", { text: "We couldn't send your configuration just now. " }),
        "Your selections are still here. ",
        h("a", { href: window.FormSend.mailto({ subject: message.subject, body }), text: "Open it in your email app" }),
        " or write to ",
        h("a", { href: `mailto:${window.FormSend.EMAIL}`, text: window.FormSend.EMAIL }),
        "."
      );
      ui.sendError.hidden = false;
      ui.sendError.focus();
      if (result.error) console.warn("Scope builder: sending failed:", result.error);
    }

    function showResult(kind, message, result) {
      ui.result.textContent = "";
      const title = `h${level}`;
      if (kind === "preview") {
        const rows = h("dl", { class: "sb-payload" });
        const add = (key, value) => rows.append(h("div", { class: "sb-payload__row" }, h("dt", { text: key }), h("dd", { text: value })));
        add("Subject", message.subject);
        Object.entries(message.fields).forEach(([key, value]) => add(key === "email" ? "Email" : key, value));
        ui.result.append(
          h("p", { class: "sb-result__tag", text: "Preview mode" }),
          h(title, { class: "sb-result__title", text: "Nothing was sent" }),
          h(
            "p",
            { class: "sb-result__text" },
            "Live sending is switched off on this page until the form service for ",
            window.FormSend.EMAIL,
            " is confirmed. This is exactly what the Whitespace team would receive:"
          ),
          rows,
          h(
            "div",
            { class: "sb-actions sb-actions--result" },
            h("button", { type: "button", class: "sb-btn sb-btn--secondary", text: "Back to review", onclick: () => closeResult() })
          )
        );
      } else {
        ui.result.append(
          h("p", { class: "sb-result__tag", text: "Sent" }),
          h(title, { class: "sb-result__title", text: "Thank you, your configuration has been sent" }),
          h("p", { class: "sb-result__text", text: `We'll reply to ${state.contact.email.trim()}.` }),
          h("ol", { class: "sb-next" }, data.review.next.map((text) => h("li", { text }))),
          h(
            "div",
            { class: "sb-actions sb-actions--result" },
            h("button", { type: "button", class: "sb-btn sb-btn--secondary", text: "Start a new configuration", onclick: () => { closeResult(); startOver(); } })
          )
        );
      }
      ui.layout.hidden = true;
      root.querySelector(".sb-progress").hidden = true;
      ui.result.hidden = false;
      if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: "start", behavior: reduceMotion() ? "auto" : "smooth" });
      ui.result.focus({ preventScroll: true });
      announce(kind === "preview" ? "Preview mode: nothing was sent." : "Your configuration has been sent.");
    }

    function closeResult() {
      ui.result.hidden = true;
      ui.layout.hidden = false;
      root.querySelector(".sb-progress").hidden = false;
      show(STEP_COUNT);
    }

    function startOver() {
      storage.clear();
      state = emptyState();
      writeForm();
      ui.panels.forEach((_, i) => setStepError(i + 1, ""));
      ["sb-priority-other", "sb-horizontal-other", "sb-name", "sb-email"].forEach((n) => setFieldError(n, ""));
      ui.sendError.hidden = true;
      ui.restored.hidden = true;
      syncDependents();
      show(1);
    }

    /* ---------- Start ---------- */
    function init() {
      render();
      const saved = storage.load();
      const hasAnswers = (s) => s && (s.scope || (s.priorities || []).length || s.coverage || (s.services || []).length || (s.contact && s.contact.name));
      if (saved && saved.v === 1 && hasAnswers(saved)) {
        state = { ...emptyState(), ...saved, contact: { ...emptyState().contact, ...(saved.contact || {}) } };
        ui.restored.hidden = false;
      } else {
        // Deep links: ?scope=holding&service=implementation preselect a choice
        const params = new URLSearchParams(window.location.search);
        if (byId(data.scopes, params.get("scope"))) state.scope = params.get("scope");
        const service = params.get("service");
        if (byId(data.services, service)) state.services = [service];
      }
      writeForm();
      readForm(); // drops saved values that no longer exist in the data
      syncDependents();
      const gap = firstIncomplete(Math.max(1, Math.min(state.step, STEP_COUNT)) - 1);
      const start = gap || Math.max(1, Math.min(state.step, STEP_COUNT));
      state.maxStep = Math.min(Math.max(state.maxStep || 1, start), STEP_COUNT);
      show(start, { focus: false, scroll: false });
    }

    init();
    return { goTo, getState: () => JSON.parse(JSON.stringify(state)), startOver };
  }

  /* =====================================================================
     Mounting
     ===================================================================== */
  const LOCAL = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const wantsPending = LOCAL && new URLSearchParams(window.location.search).get("pending") === "1";

  function mergedData(withPending) {
    const base = window.ScopeData;
    if (!withPending || !window.ScopeDataPending) return base;
    // Pending priorities go before "Other" / "Not sure yet"
    const tail = base.priorities.filter((p) => p.other || p.exclusive);
    const head = base.priorities.filter((p) => !p.other && !p.exclusive);
    return { ...base, priorities: [...head, ...window.ScopeDataPending.priorities, ...tail] };
  }

  function mountAll() {
    if (!window.ScopeData || !window.FormSend) {
      console.error("Scope builder: js/scope-data.js and js/form-send.js must load before js/scope-builder.js.");
      return;
    }
    const pending = wantsPending && Boolean(window.ScopeDataPending);
    document.querySelectorAll("[data-scope-builder]").forEach((root) => {
      if (root.dataset.sbMounted) return;
      root.dataset.sbMounted = "true";
      root._scopeBuilder = createBuilder(root, mergedData(pending), { pendingPreview: pending });
    });
  }

  function start() {
    if (!wantsPending || window.ScopeDataPending) return mountAll();
    const script = document.createElement("script");
    script.src = new URL("scope-data-pending.js", SCRIPT_SRC).href;
    script.onload = mountAll;
    script.onerror = mountAll;
    document.head.appendChild(script);
  }

  window.ScopeBuilder = { mountAll };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
