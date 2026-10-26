# Content archive

Content taken off the pages in the October 2026 refinement, kept here so it can be reused. The text is
exactly as it appeared on the site. Source of most of it: the deck *Company overview, October 2026*.

## Home — "The problem" rows not shown

The page keeps three of the five rows (Strategy without execution, Slow and theoretical, No
accountability). These two were removed because the Why Whitespace cards on the same page already say
the same thing (Affordable; Applicable):

| What usually happens | What we do instead |
| --- | --- |
| **Expensive** — Big-firm fees, little left for implementation. | **Affordable and focused** — Lean team, scope sized to what matters most. |
| **One-size-fits-all** — Big-company templates that don't fit your reality. | **Built for your context** — Designed around your team, budget and culture. |

## Home — client journeys not shown

The page keeps one example (Security services: Corporate strategy → Go-to-market transformation →
Sales force enablement → AI quote-to-cash). Client names withheld.

| Client | Title | Journey |
| --- | --- | --- |
| Consumer retail brand | Embedded partner, ongoing | Diagnostic → Growth blueprint → Transformation office & KPIs → Executive coaching |
| Consumer goods manufacturer | Fixing operations, then automating | Production planning process → Quick wins → Automated reporting & BI dashboards |
| Multi-outlet F&B group | One view of the business | End-to-end diagnostic → Expansion & outlet performance → Business control tower |

## About — "Our workflow" (three phases, nine steps)

Removed from About; Home shows the four-step summary ("How it works"). Lead: *Three phases, nine
steps. Each phase ends with something you can decide on.*

1. **Pre-engagement**
   1. Initial exploration — Identify objectives, stakeholders and potential areas of collaboration.
   2. Preliminary assessment — Evaluate feasibility, challenges and opportunities.
   3. Proposal & alignment — A formal proposal of scope and deliverables, agreed by all parties.
2. **Engagement**
   4. Client discovery — Belief audits, focus interviews and data analysis to find the patterns that matter.
   5. Solution design — Design and develop the solution with your team.
   6. Presentation & discussion — Present, gather feedback and refine together.
3. **Partnership**
   7. Implementation strategy — Plan the steps, resources and timelines for implementation.
   8. Execution & support — Put the plan into action, monitor progress and support the rollout.
   9. Evaluation & closure — Measure against objectives, close formally and document the lessons.

Markup and styles: `.phases > .phase > ol.phase__steps > li.step` (still in `css/components.css` and the
style guide). Illustrations `pre`, `engagement`, `partnership` are still in `js/isometric.js`.

## About — industries

The page now shows the deck's 13 industries in six groups. Earlier it showed 18 industries; that
grouping is kept below. The individual icon for each industry (one tile per industry) is in git
history (commit `618d2eb`, `about.html`). Earlier grouping (18 industries):

| Group | Industries |
| --- | --- |
| Consumer goods & retail | Consumer goods · Retail · Manufacturing & retail |
| Food & agriculture | Food & beverage · Agri-food |
| Industry & energy | Automotive · Energy services · Natural resources |
| Services & logistics | Security services · Logistics · Agencies |
| Health & finance | Pharma & health · Financial services |
| Technology & media | Consumer electronics · Smart home technology · Ticketing technology · Metaverse technology · Media & entertainment |

The deck lists 13 industries and folds the technology sectors into "Technology". Removed from the page:
Manufacturing & retail, Consumer electronics, Smart home technology, Ticketing technology, Metaverse
technology, Media & entertainment. Agencies moved from "Services & logistics" to "Technology & agencies".

## Business Transformation — engagements not shown

The page keeps one engagement per practice. Anonymized, client names withheld.

| Sector | Engagement | Area | Timeline |
| --- | --- | --- | --- |
| Ticketing technology | Revamped the business and operating models of a series A ticketing startup, establishing operational excellence. | Turnaround & transformation | 3 months |
| Consumer electronics | Built an internal data infrastructure for a series A startup, turning it into a data-centric company. | Organizational productivity | Not disclosed |
| Manufacturing & retail | Evaluated potential revenue streams from sustainable investments, opening strategic growth options. | Deals & growth, capital management | Not disclosed |
