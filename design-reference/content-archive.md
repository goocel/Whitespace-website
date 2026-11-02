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

## Home — "Three ways we help" points not shown

The Home practice cards keep four points per practice (plus "Your whitespace"). These were the
matrix cells before; most still appear on the practice pages.

| Practice | Point no longer listed on Home | Now covered by |
| --- | --- | --- |
| AI Implementation | Process automation | Agents, automation and AI tools |
| AI Implementation | Automated reporting · Chat-based AI assistant · Connected workflows and CRM · Document reading and OCR | AI in daily work |
| AI Implementation | Leadership knowledge base · Team training and adoption | Knowledge capture and team training |
| AI Implementation | IT team productivity · Blind-spot analysis | AI page, "AI at work" |
| Business Transformation | Business model design | Corporate strategy and business model |
| Business Transformation | Turnaround and restructuring · Lean operations and cost optimization | Lean operations and turnaround |
| Business Transformation | Dashboards and BI | Transformation office, KPIs and BI |
| Business Transformation | Performance and talent management | BT page, Organizational productivity |
| Business Transformation | Partnerships, M&A and integration · New revenue models and pricing | BT page, Deals & growth |
| Business Transformation | Fundraising and capital structure | BT page, Capital management |
| Fractional Leadership | Interim CEO office · Interim COO · Interim CFO · Interim strategy lead | Interim C-level |
| Fractional Leadership | Opening new markets · Winning customers | Business development as a service |
| Fractional Leadership | Driving execution | Embedded partner |
| Fractional Leadership | Building the leaders you have | Executive coaching |

## Home — engagement example under "How it works"

Removed from Home (user, 29 Oct). Still on `practices/fractional-leadership.html` as a client example.

- Caption: Example · Security services · Client name withheld
- Title: From strategy to AI-enabled sales.
- Text: One engagement that grew step by step, from direction-setting to AI in the sales process.
- Flow: Corporate strategy → Go-to-market transformation → Sales force enablement → AI quote-to-cash (AI step highlighted)

## About — hero note

Removed 2 November 2026 (the user found the hero too wordy). It sat under the hero illustration:

> One team that understands both the business and the technology: AI implementation, business
> transformation from turnaround to deals and capital, and senior leaders when you need them.
> Practical. Applicable. Affordable.

## Practice pages — hero notes

Removed 2 November 2026; each sat under the hero illustration (the leads above them stayed):

| Page | Note |
| --- | --- |
| AI Implementation | AI only pays off when the process around it is right. That is why the same team also fixes the business around it. |
| Business Transformation | From the first diagnostic to the transformation office that keeps the change going, we work inside the business until it runs. |
| Fractional Leadership | From one quarter to a full turnaround, we fill the seat until your own team is ready to take it over. |

## Services — hero note

Removed 2 November 2026, with the practice-page notes; it sat under the hero illustration:

> AI only pays off when the process around it is right. That is why we do both, and lend you senior
> capacity when you need it.

## Industries and Careers — hero notes

Removed 2 November 2026, with the other hero notes; each sat under the hero illustration:

| Page | Note |
| --- | --- |
| Industries | Wide exposure means we have usually seen your problem before, in another industry. |
| Careers | You will sit inside client companies, not behind them: close to the decisions, the data and the people who run the business. |
