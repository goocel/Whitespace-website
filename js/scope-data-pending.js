/*
 * Engagement Scope Builder: options PENDING VALIDATION by Whitespace.
 *
 * NOT FOR PRODUCTION. Do not merge this file into main and do not add a <script> tag for it.
 * js/scope-builder.js loads it only on a local preview (localhost / 127.0.0.1) opened with
 * ?pending=1, and marks every item "Pending validation". Once an item is approved, move it into
 * js/scope-data.js (without `status`) and delete it here.
 *
 * Source: whitespace_website_redesign_brief.md §3.2 (Step 2 examples), minus the items that were
 * approved as general priorities on 2026-11-16.
 */
window.ScopeDataPending = {
  priorities: [
    // Holding Structure
    { id: "mna", label: "Mergers & Acquisitions (M&A)", scopes: ["holding"], status: "pending" },
    { id: "restructuring", label: "Corporate restructuring", scopes: ["holding"], status: "pending" },
    { id: "portfolio", label: "Portfolio or group management", scopes: ["holding"], status: "pending" },
    { id: "new-business", label: "New business development", scopes: ["holding"], status: "pending" },
    { id: "governance", label: "Group governance and operating model", scopes: ["holding"], status: "pending" },
    // Subsidiary / Business Unit
    { id: "operational-excellence", label: "Operational excellence", scopes: ["subsidiary"], status: "pending" },
    { id: "performance-improvement", label: "Business performance improvement", scopes: ["subsidiary"], status: "pending" },
    // People & Leadership
    { id: "fractional-leadership-priority", label: "Fractional leadership", scopes: ["people"], status: "pending" },
    { id: "leadership-effectiveness", label: "Leadership effectiveness", scopes: ["people"], status: "pending" },
    { id: "role-clarity", label: "Role and accountability clarity", scopes: ["people"], status: "pending" },
    { id: "change-adoption", label: "Change management and adoption", scopes: ["people"], status: "pending" },
  ],
};
