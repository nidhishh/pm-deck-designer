# Pattern library (by deck type)

These patterns come from reference decks. **They are options, not rules.** Which ones fit depends on the kind of deck being made. During shape, name the deck type, offer the matching patterns, and let the user choose. Never apply a whole row by default. As with all references, borrow the device and never the content.

## Contents
- B2B platform / data tool
- Redesign under a constraint
- New consumer / AI product
- Offline / physical product
- Usable in any deck type
- What to avoid from these references

## B2B platform / data tool
*Sources: HiLabs APM 2025 (risk and rate benchmarking for healthcare payers), OneIT (IT agency marketplace).*

| Pattern | What it is | When it earns its place |
|---|---|---|
| Annotated dashboard mockup | A hi-fi product screen sits in the centre with callouts on all four sides. Leader lines tie each callout to its UI element, and each callout gives the element's name and the value it delivers. Exactly one callout is filled in the accent colour as "What's new here?", the differentiating feature. | The solution is a dashboard or tool, and the judges need to see that it's real. Use one slide per major module and repeat the same geometry. |
| Data-pipeline architecture | Sources → ingestion → storage → cleaning → ML layer → visualisation → outcomes per persona, with the real stack named at each step (Airflow, S3, dbt, XGBoost…). | The case is technical or data-heavy and feasibility is the judges' question. Keep it to one region and don't let it become the hero. |
| Segment table with target ticks | Rows are attributes (size, revenue, data budget, tech maturity) and columns are segments. A tick and a "Target market" tag mark the chosen column. | Choosing a beachhead among B2B segments. |
| Fermi-sized TAM/SAM/SOM | Concentric circles, each with its equation beside it (`12 Mn firms × $20 Mn × 3.1%`). | Market sizing that has no source, so the working has to be visible. |
| Press-headline evidence | Masthead and headline chips (Mint, ET, WSJ), each with its date. | A B2B pain that is reported in the press but has no survey behind it. Use them only if the headlines are real and cited. |
| Value-proposition table | Feature × user action × system response × value for each persona. | Several personas use the same features differently. |
| Phased GTM with outcome footer | One column per phase, with rows for target, core focus, partnerships and marketing. A bar under each column holds that phase's outcome metrics (pilot payers, ARR, model accuracy). | Phased rollout. The footer row turns the plan into commitments. |

## Redesign under a constraint
*Source: the Google Maps data-scarcity case (Flipkart Wired).*

| Pattern | What it is | When it earns its place |
|---|---|---|
| Four "why" panels | A grid: Why this product? · Why the problem matters · Why the company should care · Why now. Each panel holds 3–4 icon points. | The prompt says "pick a product". It justifies the pick before any design. |
| World-assumptions panel | A numbered list that defines the hypothetical world (data cap 500 MB/month, 2G/3G at 0.1–1 Mbps, 50/30 urban/rural). | Moonshot or "imagine a world where…" prompts. It fixes the rules the solution is judged against. |
| Per-feature cost breakdown | Vertical bars of the scarce resource used by each feature (MB per hour of navigation, per 100 km² of tiles…), with the total called out. | The constraint can be measured. It shows exactly where the savings have to come from. |
| Phone screens tagged with savings | Numbered callouts on the redesigned screens, each with its saving ("Lazy image load: save ~1 MB / 10 images"). | Redesign slides. Each change is tied to the constraint. |
| Quantified before/after chart | Two lines for before and after across the stages of the journey, plus a callout scaling the gain up ("35% saved = 10 PB a month worldwide"), with its assumptions listed. | The hero of the impact slide. It needs a real or Fermi-derived per-stage baseline. |
| Unfair-advantage bubble chart | x = layer of the ecosystem, y = years for a rival to replicate it, bubble size = scale. The company's assets sit at the top and rivals sit lower. | "Why should *this* company build it?" A moat argument drawn as a picture. |

## New consumer / AI product
*Sources: JARVIS AI browser (Risa Labs), Boredom Café (Flipkart Wired).*

| Pattern | What it is | When it earns its place |
|---|---|---|
| Primary-research strip | Compact chips (178 surveys · 21 interviews · 72% undergraduates), a word cloud of the answers, and 3–4 key findings with %. | The user ran a survey. Never use it for invented research. |
| Diverging behaviour-shift bars | One row per behaviour, as stacked bars of decrease / same / increase, with a net-intent % column and a one-chip interpretation per row. | Showing how behaviour changes under a new technology or constraint. Densest when the survey data exists. |
| 24-hour day clock | A radial day of the persona, with where the time and screen use go and the gap the product fills. | Products about time or attention (wellbeing, focus, commuting). |
| Emotional-arc chart | A feeling or state curve over the duration of one session, with emoji or labels at the stages. | Experience-led products where the journey *is* the value. Mark it Illustrative unless measured. |
| RICE table with top 3 boxed | A full RICE table with a rank column; the top 3 ranks are outlined. | A long feature list that has to be cut down to an MVP. |

## Offline / physical product
*Source: Boredom Café.*

| Pattern | What it is | When it earns its place |
|---|---|---|
| MoSCoW-scored alternatives | Rows are criteria and columns are the existing alternatives plus ours. Each cell gets a Must / Should / Could / Won't verdict and a score, with a total row. | "Why the current options fail", for when a ✓/~/✕ scorecard is too coarse. |
| Tension → Our choice → De-risk | Each trade-off is a triplet: the tension, what we chose, and how we limit the downside. Four of them go in a 2×2. | Any trade-offs slide. It is stronger than a pros/cons list because it ends in a mitigation. |
| Pilot-location map | A map of the city with the chosen pilot area marked, and the reasons for it (density of the target users, commute). | A launch that depends on location (offline, hyperlocal, quick commerce). |
| MVP validation goal | Target numbers after N months (500+ paid sessions, 40% repeat, 3+ corporate partners) and the claim they would prove. | Any MVP slide. It turns "pilot" into a test that can pass or fail. |

## Usable in any deck type

| Pattern | What it is |
|---|---|
| Metric levels | North star (a formula written as a fraction) → L1 metrics → L2 metrics → supporting/guardrail metrics. Each row has its formula, description and goal. |
| AARRR with formulas | One row per stage, with the metric as a fraction and the stage letter large at the right. |
| Risk table with trigger metric | Columns: risk · why it matters · mitigation · trigger metric (the number that says the risk is happening). Probability and impact can be shown as 5-dot ratings. |
| Themed tracker | A domain metaphor that fills as the deck progresses: a syringe barrel (healthcare), a car driving a road to a map pin (maps). Offer it as a fourth tracker style next to tabs, chevron and bottom. Keep the labels readable at 9 pt or larger. |
| Trade-off sliders | Pairs of opposing values (data efficiency ↔ real-time accuracy), with markers for the current product and for our solution. |

## What to avoid from these references
- Text at 6–7 pt (the Google Maps and JARVIS decks). The skill's floors still apply: cut words or split the slide.
- Mascots, clip-art characters and photos of real executives used as decoration.
- More than one accent family, with each panel in its own hue.
- Grids of flat, equal boxes with no hero (HiLabs). The rule of one hero per slide still holds.
- Impact claims with no source or working ("guarantees $0.5M savings"). Use a Fermi chain or a range instead.
