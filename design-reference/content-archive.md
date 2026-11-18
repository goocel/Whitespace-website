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

## Home — removed in the November 2026 redesign (Phase 2, branch `feature/scope-builder`)

The Home page was restructured after `whitespace_website_redesign_brief.md` (Hero → Scope Builder → Approach + first
90 days → Services → People, Process, Business → Case studies → CTA). Everything below was on Home until then, text
exactly as it appeared.

### Hero (before)

- **Headline:** Practical business transformation, now built around AI
- **Lead:** We help companies put AI to work inside their real business processes, and fix the business around it. One team that understands both the business and the technology.
- **Buttons:** Start a conversation → (contact.html) · How it works (#how)
- **Meta title:** Whitespace Solutions — Practical business transformation, built around AI
- **Meta description:** Whitespace Solutions: practical business transformation, now built around AI. We help companies put AI to work inside their real business processes.

### "The problem" (dark band, looping card stack; deck p.3)

Label *The problem* · Title **Most advice stops at the slide deck** ("slide deck" with the colour sweep of
`js/slide-deck-wave.js`) · Lead: *Companies pay for strategy, then struggle to turn it into change. We don't hand over a deck and leave.*
The section also lives on as the article `insights/slide-deck.html`. Its CSS (`css/home.css` "The problem"),
the loop in `js/home.js` and `js/slide-deck-wave.js` are kept, unused on Home.

| What usually happens | What we do instead |
| --- | --- |
| **Strategy without execution** — The report is delivered, the consultants leave. | **Hands-on execution** — We work inside the business until it runs. |
| **Slow and theoretical** — Months of analysis before anything changes. | **Quick wins first** — Proven practices, applied fast, improved as we go. |
| **No accountability** — Nobody owns whether it actually worked. | **Measured results** — Clear KPIs, tracked with you over time. |

### "Three ways we help" (before)

Label *The solution* · Lead: *AI first, grounded in business. AI only pays off when the process around it is right, so we do both, and lend you senior capacity when you need it.*
Order was AI Implementation, Business Transformation, Fractional Leadership. Card heads: "AI built into how your company runs." /
"Fix what holds the business back." / "Senior capacity, without full-time hires." The points themselves are kept (AI points now sit
under **Implementation**).

### "How it works" four steps (before; replaced by the first 90 days)

Lead: *Four steps, and you decide at the end of each one.* (Title "Start small, prove it, then grow" is kept.)

| Step | Text | Small card |
| --- | --- | --- |
| 01 Talk it through | A first conversation about where the business is stuck. | *Bring to the first conversation:* One process — where it leaks · Last month's exceptions — cases that needed a person · The person who runs it — knows where it breaks |
| 02 Diagnose | We look at the process, data and people behind the problem. | *Where does the business leak?* Time · Cash · Control — Looked at: Process · Data · People |
| 03 Build with your team | Early changes that pay back, with AI where it fits. | *Picking the quick wins:* Value × Feasibility × Risk — Built: with your team, not for it |
| 04 Run and measure | Your team runs it, and we check results against the goals set at the start. | *At the end of each step:* Goals set at the start ✓ · Results checked with you ✓ — Next step: Your call |

### Runway → EBITDA case (inside "How it works")

**Not to be published again until the underlying data and the client's permission are verified** (redesign brief §2.3, §5 section 7).
Title *From a three-month runway to nearly positive EBITDA* · Text: *A series A consumer electronics startup came to us with three
months of cash left. Six months later it was close to EBITDA break-even.* · Tag: *Business Transformation · Turnaround · 6 months* ·
Caption: *Consumer electronics, series A. Illustrative shape of the turnaround, not client figures.*
The chart animation stays in `js/home-motion.js` (it only runs when `.chart svg` exists) and its CSS in `css/home.css`. Markup:

```html
        <div class="case">
          <figure class="case__chart">
            <div class="chart">
              <svg viewBox="0 0 700 330" role="img" aria-labelledby="chartTitle" data-reveal>
                <title id="chartTitle">Illustrative turnaround: cash runway dips until month 1.4, then climbs to break-even EBITDA by month 6</title>
                <rect x="52" y="42" width="298" height="218" fill="#fff3e6" />
                <g stroke="#e2e4e7" stroke-width="1">
                  <line x1="449" y1="42" x2="449" y2="260" />
                  <line x1="548" y1="42" x2="548" y2="260" />
                  <line x1="647" y1="42" x2="647" y2="260" />
                </g>
                <line x1="350" y1="86" x2="647" y2="86" stroke="#15171a" stroke-width="1.5" />
                <path class="rw-line rw-before" d="M52 182 C 100 190, 150 215, 190 243" pathLength="1" />
                <path class="rw-line rw-after" d="M190 243 C 260 250, 320 220, 400 165 S 560 92, 647 89" pathLength="1" />
                <circle class="rw-pivot" cx="190" cy="243" r="6" />
                <circle class="rw-end" cx="647" cy="89" r="8" />
                <g class="chart__label">
                  <text x="63" y="64">Runway at start: 3 months</text>
                  <text x="647" y="72" text-anchor="end">Break-even EBITDA</text>
                </g>
                <g class="chart__axis" text-anchor="middle">
                  <text x="52" y="290">Start</text>
                  <text x="151" y="290">M1</text>
                  <text x="250" y="290">M2</text>
                  <text x="350" y="290">M3</text>
                  <text x="449" y="290">M4</text>
                  <text x="548" y="290">M5</text>
                  <text x="647" y="290">M6</text>
                </g>
              </svg>
            </div>
            <figcaption class="caption">Consumer electronics, series A. Illustrative shape of the turnaround, not client figures.</figcaption>
          </figure>
          <div class="case__text">
            <h3 class="subtitle">From a three-month runway to nearly positive EBITDA</h3>
            <p>A series A consumer electronics startup came to us with three months of cash left. Six months later it was close to EBITDA break-even.</p>
            <p class="caption">Business Transformation · Turnaround · 6 months</p>
          </div>
        </div>
```

### "Why Whitespace" (before)

Label *Why Whitespace* · Title **Business sense and AI in one team** · Lead: *Traditional consultants know the business but rarely
build. Software vendors build, but only their own tool. We do both, and stay through rollout.*

| Card | Text |
| --- | --- |
| Practical (`proactive`) | **Solutions you can run on Monday.** No 100-page report that sits on a shelf. |
| Applicable (`tailored`) | **Fits your team, budget and culture.** Built on the systems you already have. |
| Affordable (`strategic`) | **Spend where it pays back.** Lean team, focused scope, no big-firm overhead. |

"Practical. Applicable. Affordable." stays in the footer tagline on every page.

### Comparison table (was `hidden` under "Why Whitespace"; deck p.14)

The JS that popped the ticks in (`js/home-motion.js`, `.why-table`) only runs when the table exists. Markup:

```html
        <div class="why__wrap" hidden>
          <div class="why__inner">
            <table class="why-table">
              <thead>
                <tr>
                  <th scope="col"><span class="sr-only">Criteria</span></th>
                  <th scope="col">Traditional consulting</th>
                  <th scope="col">AI / software vendor</th>
                  <th scope="col" class="why-table__us">Whitespace Solutions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Understands your business processes</th>
                  <td data-label="Traditional consulting"><span class="mark mark--yes" role="img" aria-label="Yes">✓</span>Yes</td>
                  <td data-label="AI / software vendor"><span class="mark mark--no" role="img" aria-label="No">✕</span>Limited</td>
                  <td class="why-table__us" data-label="Whitespace Solutions"><span class="mark mark--yes" role="img" aria-label="Yes">✓</span>Yes, from 40+ companies</td>
                </tr>
                <tr>
                  <th scope="row">Builds AI into your workflows</th>
                  <td data-label="Traditional consulting"><span class="mark mark--no" role="img" aria-label="No">✕</span>Rarely</td>
                  <td data-label="AI / software vendor"><span class="mark mark--part" role="img" aria-label="Partly">~</span>Their own tool only</td>
                  <td class="why-table__us" data-label="Whitespace Solutions"><span class="mark mark--yes" role="img" aria-label="Yes">✓</span>Tool-neutral, fit to need</td>
                </tr>
                <tr>
                  <th scope="row">Executes hands-on with your team</th>
                  <td data-label="Traditional consulting"><span class="mark mark--no" role="img" aria-label="No">✕</span>Report and leave</td>
                  <td data-label="AI / software vendor"><span class="mark mark--part" role="img" aria-label="Partly">~</span>Setup and support</td>
                  <td class="why-table__us" data-label="Whitespace Solutions"><span class="mark mark--yes" role="img" aria-label="Yes">✓</span>Alongside your team</td>
                </tr>
                <tr>
                  <th scope="row">Thinks like the owner</th>
                  <td data-label="Traditional consulting"><span class="mark mark--part" role="img" aria-label="Partly">~</span>Framework-driven</td>
                  <td data-label="AI / software vendor"><span class="mark mark--no" role="img" aria-label="No">✕</span>Product-driven</td>
                  <td class="why-table__us" data-label="Whitespace Solutions"><span class="mark mark--yes" role="img" aria-label="Yes">✓</span>Founder's lens</td>
                </tr>
                <tr>
                  <th scope="row">Practical and affordable</th>
                  <td data-label="Traditional consulting"><span class="mark mark--no" role="img" aria-label="No">✕</span>Premium fees</td>
                  <td data-label="AI / software vendor"><span class="mark mark--part" role="img" aria-label="Partly">~</span>Licences add up</td>
                  <td class="why-table__us" data-label="Whitespace Solutions"><span class="mark mark--yes" role="img" aria-label="Yes">✓</span>Fees sized to the problem</td>
                </tr>
                <tr>
                  <th scope="row">Accountable for results</th>
                  <td data-label="Traditional consulting"><span class="mark mark--no" role="img" aria-label="No">✕</span>Ends at delivery</td>
                  <td data-label="AI / software vendor"><span class="mark mark--part" role="img" aria-label="Partly">~</span>Uptime, not outcomes</td>
                  <td class="why-table__us" data-label="Whitespace Solutions"><span class="mark mark--yes" role="img" aria-label="Yes">✓</span>Goals measured with you</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
```

### Closing CTA (before)

Title **Where is your whitespace?** (first line orange) · Text: *Bring one problem to a discovery session: the process where time,
cash or control leaks, last month's exceptions, and the person who runs it. We'll map it with you.* · Button: Start a conversation →

### "Work in practice" (case studies, removed 2026-11-17)

Replaced on Home by **Perspectives and case studies** (two case studies + one perspective, the same cards as
`insights.html`), because three cards per service repeated "Three ways we help". Label *Case studies* · Title
**Work in practice** · Lead: *One engagement for each way we help. Client names withheld.* Source: company deck, Oct 2026
(p.15 client journeys, p.9 Invoice OCR); no outcomes were shown.

| Card | Meta | Facts | Link |
| --- | --- | --- | --- |
| **Fixing operations, then automating** | Business Transformation | Client: Consumer goods manufacturer · What we did: Production planning process → Quick wins → Automated reporting & BI dashboards | See client journeys (industries.html) |
| **Invoice OCR: from a mountain of paper to checked records** | Implementation · AI | Client: A finance team · Challenge: Most of its time went on paperwork and data entry: invoices, delivery notes and receipts keyed by hand. · What we did: AI reads and matches supplier, reference and amount into checked records; every exception goes to a person. Illustrative flow. | Read the case (insights/invoice-ocr.html) |
| **Embedded partner, ongoing** | Fractional Leadership · with Business Transformation | Client: Consumer retail brand · What we did: Diagnostic → Growth blueprint → Transformation office & KPIs → Executive coaching | See client journeys (industries.html) |

Art: `proactive`, `productivity`, `partnership` (data-pad 0.3). CSS `.case-card` / `.case-facts` removed from `css/home.css`.
