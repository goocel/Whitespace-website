/*
 * Engagement Scope Builder: the options visitors can choose (production data).
 *
 * Only options approved by Whitespace belong in this file (approved 2026-11-16).
 * Unvalidated offerings (M&A, restructuring, portfolio management, governance, …) live in
 * js/scope-data-pending.js, which is loaded only for local previews and must not ship to main.
 *
 * Editing: labels and hints are plain text and safe to change. Keep each `id` stable — it is what
 * the submission and the saved draft refer to. Service descriptions are deliberately short and
 * provisional until the official service definitions are agreed.
 *
 * Optional per-item fields:
 *   scopes:  ["holding", …]  show the item only for these organization scopes (default: all)
 *   other:   true            the item opens a "please specify" text field
 *   exclusive: true          choosing it clears the other choices in the list (and vice versa)
 */
window.ScopeData = {
  version: "2026-11-16",

  steps: [
    { id: "scope", short: "Scope", title: "Where do you need Whitespace?", hint: "Choose the level of the organization that needs support." },
    {
      id: "priorities",
      short: "Priorities",
      title: "Identify your priorities",
      hint: "Choose the areas you want to focus on. Pick as many as apply.",
      note: "These are areas of focus for a first conversation, not a list of separate services.",
    },
    { id: "coverage", short: "Coverage", title: "Define the organizational coverage", hint: "Which parts of the organization are included?" },
    {
      id: "depth",
      short: "Depth",
      title: "Define the depth of engagement",
      hint: "Two separate dimensions: how far down the organization the work reaches, and which functions it covers. Combine them as you need.",
    },
    { id: "services", short: "Support", title: "Select the type of support", hint: "Choose one or more, or “Not sure yet” if you would like help deciding." },
    { id: "review", short: "Review", title: "Review and send", hint: "Check your configuration, add any context, and tell us how to reach you." },
  ],

  scopes: [
    { id: "holding", label: "Holding Structure", hint: "Group-level or portfolio-level transformation." },
    { id: "subsidiary", label: "Subsidiary / Business Unit", hint: "One or more business entities." },
    { id: "department", label: "Department / Business Function", hint: "A specific function or department." },
    { id: "people", label: "People & Leadership", hint: "Leadership, management and team capability." },
  ],

  priorities: [
    { id: "process-improvement", label: "Business Process Improvement" },
    { id: "workflow-improvement", label: "Workflow Improvement" },
    { id: "operational-effectiveness", label: "Operational Effectiveness" },
    { id: "team-leadership", label: "Team & Leadership Development" },
    { id: "business-transformation", label: "Business Transformation" },
    { id: "implementation-support", label: "Implementation Support" },
    { id: "other", label: "Other", other: true, otherLabel: "Which other priority?" },
    { id: "not-sure", label: "Not sure yet", exclusive: true },
  ],

  coverage: [
    { id: "holding-only", label: "Holding only", entities: true },
    { id: "one-unit", label: "One subsidiary / business unit", entities: true },
    { id: "multiple-units", label: "Multiple subsidiaries / business units", entities: true },
    { id: "selected-departments", label: "Selected departments" },
    { id: "cross-functional", label: "Cross-functional scope" },
    { id: "entire-organization", label: "Entire organization" },
  ],
  entitiesLabel: "Names of the entities or units involved",

  vertical: {
    title: "Vertical coverage",
    hint: "How far down the organization should the work reach?",
    options: [
      { id: "board", label: "Board" },
      { id: "directors", label: "Directors" },
      { id: "managers", label: "Managers / Heads" },
      { id: "team-leaders", label: "Team Leaders" },
      { id: "frontline", label: "Staff / Frontline" },
    ],
  },

  horizontal: {
    title: "Horizontal coverage",
    hint: "Which functions should it cover?",
    options: [
      { id: "sales", label: "Sales" },
      { id: "marketing", label: "Marketing" },
      { id: "finance", label: "Finance" },
      { id: "hr", label: "Human Resources" },
      { id: "operations", label: "Operations" },
      { id: "technology", label: "Technology" },
      { id: "other", label: "Other functions", other: true, otherLabel: "Which other functions?" },
    ],
  },

  // Provisional, short descriptions: replace with the official service definitions once agreed.
  services: [
    { id: "business-transformation", label: "Business Transformation", hint: "Setting the direction of change, its priorities and a roadmap." },
    { id: "implementation", label: "Implementation", hint: "Carrying out initiatives: workflows, processes and adoption." },
    { id: "fractional-leadership", label: "Fractional Leadership", hint: "Senior leadership support, flexibly, as you need it." },
    { id: "not-sure", label: "Not sure yet", hint: "We can work out the right support together.", exclusive: true },
  ],

  review: {
    contextLabel: "Anything else we should know?",
    contextHint: "Optional. The situation today, what you want to change, any timing.",
    disclaimer: "This configuration is a starting point for a conversation. It is not a quote or a commitment from either side.",
    privacy:
      "We use these details only to reply to you and prepare a first conversation about your engagement. When you send this form, your configuration and contact details are emailed to contact@whitespace.id through FormSubmit (formsubmit.co), a third-party form service. Nothing is stored on this website. Until you send it, your draft is kept only in this browser tab.",
    next: [
      "Your configuration reaches the Whitespace team by email.",
      "We review it and reply to arrange a first conversation.",
      "Scope, timing and approach are agreed together, based on your situation.",
    ],
  },
};
