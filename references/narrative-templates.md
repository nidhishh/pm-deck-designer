# Narrative templates

Pick a **Problem Archetype** and a **Narrative Template**, then adapt them. These come from reference decks that all follow two core laws:
1. **Horizontal story spine**: the deck answers the prompt's sub-questions in the order they were asked, and the section tracker mirrors those sub-questions. A reader who sees only the tracker labels and the takeaway strips should be able to retell the entire story.
2. **Continuous Baton-Pass flow**: frameworks are never picked in isolation per slide. The winning output of Slide $N$'s framework becomes the direct input (rows, axes, or tags) of Slide $N+1$'s framework, visibly linked with carryover badges (`[D1] → [P1] → [M1] → [Metric 1]`).

## Contents
- Choosing a template & problem archetype
- Problem-archetype routing & matched framework arcs
- The Baton-Pass contract (cross-slide continuity)
- Frame shared by every template (open, tracker, close)
- Template A: Product build
- Template B: Strategy / go-to-market
- Template C: Market and unit economics
- Template D: Phased roadmap
- Expanded framework catalogue (35+ frameworks)
- Mixing templates
- Flow checks before you build

## Choosing a template & problem archetype

First match the prompt's overall deliverable to a **Template**, then match its core tension to one of the **6 Problem Archetypes** below.

| The prompt sounds like | Use Template | Default Archetype |
|---|---|---|
| "Design a product that…", "Build a feature for…", "0-to-1 workflow tool" | A: Product build | Archetype 2 (0-to-1 Build) |
| "Improve conversion / reorders / checkout / onboarding in X" | A: Product build | Archetype 1 (Funnel / Drop-off Fix) |
| "D30 retention is falling", "Increase engagement / habit frequency" | A: Product build | Archetype 4 (Retention / Habit Decay) |
| "Fix creator / seller / driver supply or match rate on a platform" | A or B | Archetype 3 (Two-Sided Marketplace) |
| "How would you launch / grow / go to market…", "You are a founder who wants…" | B: Strategy / GTM | Archetype 2 or 5 |
| "Should we enter this market?", "Evaluate quick commerce for students", pricing/P&L | C: Market and unit economics | Archetype 5 (Monetization & Market Entry) |
| "Redesign X under a 500MB / latency / offline / regulatory cap" | A: Product build | Archetype 6 (Constraint Redesign) |
| "How would you colonise / roll out / transform… over N years", multi-stage programs | D: Phased roadmap | Archetype 5 or 6 |
| Teardown of an existing product | A, with "Problem" replaced by "Current System & Friction Audit" and "Users & Pains" focused on gap prioritisation | Archetype 1 or 4 |

If two fit, take the one whose first section matches the prompt's first question.

---

## Problem-archetype routing & matched framework arcs

**Never use the generic textbook set (`5 Whys + Personas + RICE + TAM-SAM-SOM + AARRR`) across every deck.** Different problems have different physics. Selecting a **Matched Framework Arc** ensures that all 5–6 slides speak the same analytical language and build a single coherent argument.

| Archetype | When to use | Slide 1: Problem Diagnosis | Slide 2: Users & Pain Prioritisation | Slide 3: Solution & MVP Architecture | Slide 4: Go-to-Market & Rollout | Slide 5: Metrics, Guardrails & Risks |
|---|---|---|---|---|---|---|
| **1. Funnel / Drop-off Fix** | Checkout drop, reorder friction, activation churn, onboarding stall | **Funnel Drop-off Waterfall** + **Step-by-Step Friction Audit** (isolating where % leakage peaks) | **Behavioral Cohort Split** (Completers vs. High-Intent Drop-offs) + **Latency/Effort Decay Curve** | **Friction-to-Fix Impact × Effort Matrix** + **Before/After UX Screen Diff** (tagged with `[Solves P1..P3]`) | **Phased A/B Rollout Gates** + **Contextual Trigger Loop** (in-app hook at drop-off moment) | **Stage-Conversion Lift Tree** (`L0 → L1 → L2`) + **Cannibalization / Latency Guardrails** |
| **2. 0-to-1 Product / Workflow Build** | New product, unmet need, B2B/AI workflow tool | **JTBD Outcome Gap** + **Alternatives Scorecard** (`✓/~/✕`) + **Cost-of-Problem Fermi Maths** | **Frequency × Severity 2×2 Pain Matrix** + **24-Hour Day / Workflow Clock** + **Beachhead Segment Table** | **Kano Model** (Must-Be / Performance / Delighter) + **System Data Pipeline / Loop** + **Intentional Trade-offs** | **Bowling-Pin Beachhead Expansion** + **Fermi TAM-SAM-SOM** + **First-100 Wedge Playbook** | **North Star Equation Tree** (`NSM = f(x,y,z)`) + **Pre-Mortem Risk × Trigger Metric Matrix** |
| **3. Two-Sided Marketplace / Ecosystem** | Buyers vs. sellers, creators vs. viewers, drivers vs. riders | **Liquidity Bottleneck Map** (Supply vs. Demand mismatch by time/tier) + **Value-Leakage Tree** | **Multi-Sided Stakeholder Matrix** (Side A & Side B incentives, friction, switch barriers) | **Marketplace Flywheel Architecture** + **Incentive Alignment & Matching Rules Table** | **Chicken-and-Egg Seeding Playbook** (Supply-first vs. Demand-first geo-wedge) | **Liquidity Ratio, Match Rate & Time-to-Fill** + **Take-Rate / Disintermediation Risk Table** |
| **4. Retention / Habit Decay** | D30 churn, decaying DAU/MAU, notification fatigue, feature abandonment | **Cohort Retention Decay Curve** (identifying the exact day/action where the cliff happens) + **Root-Cause Fishbone** | **Power User vs. Dormant Cohort Divergence Bars** + **Aha-Moment Correlation Table** | **Hook Model Loop** (Trigger → Action → Variable Reward → Investment) + **MoSCoW Feature Cut** | **Lifecycle Re-engagement Matrix** (At-risk triggers, win-back channels, habit streaks) | **HEART Framework Matrix** + **Retention Flattening & Lness (L7+/30) Counter-Metrics** |
| **5. Monetization, Pricing & Market Entry** | New market entry, unit-economics fix, pricing tiers, B2B expansion | **Value-Chain Margin Pool / Leakage Waterfall** + **Porter's 5 Forces / Competitor Radar** | **Willingness-to-Pay (WTP) vs. Usage Intensity 2×2** + **3-Layer Viability Filter Gate** | **Good-Better-Best Packaging Matrix** + **Build vs. Buy vs. Partner Trade-off Table** | **Channel × CAC / Payback Period Matrix** + **3-Phase GTM with Outcome Commitment Footers** | **Unit Economics P&L Waterfall** (`GMV → CM1 → CM2 → EBITDA`) + **Kill-Criteria Thresholds** |
| **6. Constraint / Technical Redesign** | Low bandwidth (500MB cap), offline-first, low-end hardware, strict compliance | **Scarce-Resource Budget Breakdown** (e.g. MB/hr or ms/call per feature) + **World-Assumptions Panel** | **Critical vs. Discretionary Use-Case Matrix** + **Environment / Edge-Case Persona Split** | **Trade-off Sliders** (e.g. Accuracy ↔ Bandwidth) + **Annotated Screens with Per-Change Savings** | **Graceful Degradation Tiers** (Online → Cached → SMS/Lite fallback rollout) | **Quantified Before/After Resource Chart** + **Failure-Mode & Quality-Floor Guardrails** |

---

## The Baton-Pass contract (cross-slide continuity)

Discontinuity happens when Slide 2 ignores Slide 1's diagnosis, or Slide 3 prioritizes features that don't match Slide 2's pain points. Every deck must enforce a strict **Baton-Pass Chain** across slides:

1. **Slide 1 → Slide 2 Baton (`[D1..D3]` → `[Seg-A]` + `[P1..P3]`)**:
   - Slide 1's problem framework decomposes the problem into **2–3 named Root Drivers** badged `[D1]`, `[D2]`, `[D3]`.
   - Slide 2 must segment users specifically by their exposure to `[D1..D3]`, select **one winning Beachhead Segment (`[Seg-A]`)**, and rank the **Top 3 Prioritized Pains (`[P1]`, `[P2]`, `[P3]`)** inside that segment.
2. **Slide 2 → Slide 3 Baton (`[P1..P3]` → `[M1..M3]` + `[T1..T2]`)**:
   - Every feature/module evaluated in Slide 3's prioritization framework (Kano, RICE, Impact × Effort, MoSCoW) **must carry a `[Solves P1]`, `[Solves P2]`, or `[Solves P3]` badge**. No orphan features are allowed.
   - Slide 3 outputs **3 Core MVP Modules (`[M1]`, `[M2]`, `[M3]`)** and **2–3 Explicit Trade-offs / Intentional Simplifications (`[T1]`, `[T2]`)** (what we deliberately chose *not* to build or to simplify).
3. **Slide 3 → Slide 4 Baton (`[Seg-A]` + `[M1..M3]` → `GTM Wedges`)**:
   - Slide 4's GTM phases, channels, and pricing must explicitly target **`[Seg-A]`** (from Slide 2) using **`[M1..M3]`** as the acquisition/activation wedge.
4. **Slide 4 → Slide 5 Baton (`[M1..M3]` + `[T1..T2]` → `Metrics & Guardrails`)**:
   - Every L1/L2 metric on Slide 5 is tagged with the MVP module it measures (`[Tracks M1]`, `[Tracks M2]`, `[Tracks M3]`).
   - Every Risk row on Slide 5 maps directly to one of the Intentional Trade-offs from Slide 3 (`[From T1]`, `[From T2]`) or a GTM bottleneck from Slide 4, paired with a quantitative **Trigger Metric** and **Mitigation**.
5. **The Insight Strip Bridge Rule**:
   - On Slides 2–6, **Line 1** of the top `insightStrip` states the slide's sharp answer; **Line 2** must explicitly bridge from the previous slide's baton with a concrete number (e.g., *"Because [Seg-A: Tier-2 Power Buyers] lose 4.2 hrs/wk on [P1: manual SKU matching] (Slide 2), our MVP automates catalog mapping first…"*).

---

## Frame shared by every template

**Opening (choose based on context — align with design-system.md)**:
- **Case competitions (when organiser format requires it)**: Open with two dark-background key-moment slides:
  1. **Question slide**: the prompt as one bold sentence, 1 to 2 key words in the accent color. Small kicker pill above ("Product Design Case"). Name and context at the bottom.
  2. **Breakdown slide**: the prompt's sub-questions, numbered, mapped 1-to-1 to the tracker sections and the Problem Archetype flow.
- **Portfolio, interview, and executive pre-read decks**: Open with a **dense Executive-Summary Poster** (the question in a header band, problem archetype context, the case in $N$ answers matching the tracker, at-a-glance sourced stats, and an approach strip tagged Validated / Hypothesis), or a single dark Question slide followed immediately by Slide 1.

**Content slides (dense posters)**: each one is a high-density poster (`~85%` canvas coverage, **9 to 12 regions**, **Triplet Rule: Graphic + Hard Number + Tight Text/Implication in every region**) with the tracker visible at the top and a 2-line takeaway/insight strip that states the point of the slide as a sentence (Line 1) and bridges from the prior slide with proof (Line 2).

**Close with one of**: a key-moment statement slide (the one sentence the room should remember) and/or a dark "Thank you" slide. A compact **"Kill criteria & scope limits"** box on the final poster slide is required when flagging what would make the team pivot or stop.

*(Terminology note: "dense slides" have a light `surface` background and 9–12 regions; "key-moment slides" have a dark `primary` background and 1 big statement).*

---

## Template A: Product build (Default 5-section spine)

Tracker: **Problem · Users & Pains · Solution & MVP · Go-to-Market · Metrics & Risks** (5 sections, 5 to 6 dense poster slides; Solution may span 2 slides if needed—Concept/Prioritisation + UX Experience/Trade-offs—under the same tracker tab).

| # | Slide | Takeaway strip says (Line 1 + Line 2 bridge) | Baton In → Baton Out | Required Regions (9–11 regions, each packing Graphic + Number + Text) |
|---|---|---|---|---|
| 1 | **Problem** | Why the status quo is broken and why now + macro/micro proof | `Prompt` → **Root Drivers `[D1, D2, D3]`** | (1) Hook quote / discovery signal with stat circle; (2) JTBD & scope boundaries table (`In/Out of scope`); (3) **Hero**: Root-cause framework graphic (e.g. Issue Tree / Funnel Waterfall / 5-Whys Iceberg) isolating `[D1..D3]`; (4) 4-ring sourced validation strip; (5) Ripple-of-pain or Cost-of-Problem Fermi calculation tile; (6) Alternatives scorecard (`✓/~/✕`) with bottom **Gap conclusion row** |
| 2 | **Users & Pains** | Who feels `[D1..D3]` most and which pains win | **`[D1..D3]`** → **Beachhead `[Seg-A]` + Top Pains `[P1, P2, P3]`** | (1) Segment comparison matrix (3–4 segments × 5 criteria + `Target ✓` tick on `[Seg-A]`); (2–3) 2 compact Persona / Behavioral Cohort cards with quantitative tags & 24-hr clock or divergence bars; (4) **Hero**: 2×2 Frequency × Severity Pain Matrix highlighting `[P1, P2, P3]`; (5) User journey friction table (`Stage · Action · Friction · Metric · Opportunity`); (6) Beachhead selection & willingness-to-adopt footer bar |
| 3 | **Solution & MVP** | How our MVP solves `[P1..P3]` and what we deliberately cut | **`[Seg-A, P1..P3]`** → **MVP Modules `[M1, M2, M3]` + Trade-offs `[T1, T2]`** | (1) Product lockup + end-to-end Core System Loop / Architecture pipeline; (2) **Hero**: Annotated UI mockups or 3 MVP Module cards (`[M1..M3]`), each tagged `[Solves P1..P3]` with mechanism + expected lift; (3) Prioritisation framework graphic (Kano curve or RICE/Impact-Effort score-bar table) showing cut features; (4) Intentional Simplifications / Trade-off Sliders (`[T1, T2]`: Tension → Choice → De-risk) |
| 4 | **Go-to-Market** | How we win `[Seg-A]` first and scale economically | **`[Seg-A, M1..M3]`** → **Phased Commitments & CAC/Payback Wedges** | (1) Fermi-sized TAM-SAM-SOM concentric rings or Wedge Expansion map with visible equations; (2) **Hero**: 3-Phase GTM Timeline (`Pilot → Wedge → Scale`) with target, core loop, channel, and **anchored Outcome Footer bar** per phase; (3) Channel × CAC × Payback comparison table; (4) Growth Flywheel or Good-Better-Best packaging tier cards |
| 5 | **Metrics & Risks** | How we measure `[M1..M3]` and guard against `[T1..T2]` | **`[M1..M3, T1..T2]`** → **North Star Equation, Guardrails & Kill Criteria** | (1) **Hero**: North Star Equation Tree (`NSM = Input 1 × Input 2 × Input 3` + Counter-metric); (2) L1/L2 Metric table by stage (`Metric · Formula · Baseline → Target · Tracks [M1..M3]`); (3) Risk × Severity × **Trigger Metric** × Mitigation table mapped to `[T1..T2]`; (4) Kill-Criteria & 90-day validation gate box |

## Template B: Strategy / go-to-market

Tracker (adapt labels to the prompt's questions): **Strategic Choice · Target Identification · Positioning & Loop · Go-to-Market · Economics & Investment · Metrics & Risks**

| # | Slide | Takeaway strip says | Baton In → Baton Out | Required Regions (9–11 regions) |
|---|---|---|---|---|
| 1 | **Strategic choice** | Which strategic bet wins and why | `Options` → **Winning Bet `[Bet-A]` + 3 Key Constraints `[C1..C3]`** | Options vs. Weighted Criteria decision matrix with score bars; 3 sourced evidence callouts; Market shift / Why-now stat rings; Rejected bets & why they lost |
| 2 | **Identification** | How we filter and select the highest-ROI target | **`[Bet-A, C1..C3]`** → **Target Tier `[Tier-1]` + Selection Funnel** | Multi-stage filtering funnel with % pass-through rates; Judging/Scoring criteria donut + weight table; Target profile cards with unit-value math; Perks / Value-exchange row |
| 3 | **Positioning & loop** | What moat we build around `[Tier-1]` | **`[Tier-1]`** → **Core Positioning Pillars `[Pos-1..3]`** | 2×2 Competitive Positioning map with whitespace callout; 4-quadrant Flywheel loop with conversion elasticities; Unfair-advantage replication-time chart; Proof mini-cases |
| 4 | **Go-to-market** | How the rollout unfolds phase by phase | **`[Pos-1..3]`** → **Phase 1–3 Deliverables & Channel Mix** | 3-phase timeline arrow with 5–6 quantified actions + **Outcome Footer bar** per column; Step-by-step capability staircase (1-2-3); Channel economics & partner matrix |
| 5 | **Economics & investment** | What it costs, who pays, and when it pays back | **`Phase 1–3`** → **Capital Allocation & Break-even Gate** | Phase-by-phase cost & ROI breakdown table; Revenue/Margin build waterfall; Capital sources / monetization split; Explicit budget trade-offs (`Tension → Choice → De-risk`) |
| 6 | **Metrics & risks** | How we track traction and what triggers a pivot | **`Economics & Trade-offs`** → **Scorecard, Trigger Metrics & Kill Gate** | 4 formula-driven Metric Cards (`Formula · Benchmark · Target · Guardrail`); Paired Risk → Trigger Metric → Mitigation matrix; Kill criteria box |

## Template C: Market and unit economics

Tracker: **Market & Demand Diagnosis · Unit Economics & Competitive Moat · Precision Segmentation & Launch Gate** (3 to 4 sections; maximum data density)

| # | Slide | Takeaway strip says | Baton In → Baton Out | Required Regions (9–12 regions) |
|---|---|---|---|---|
| 1 | **Market & demand diagnosis** | What the data proves about demand and friction | `Market Prompt` → **3 Quantified Friction Gaps `[G1..G3]`** | Primary/Secondary research strip (sample/source chips); Demand driver bar chart or treemap; 4-ring KPI stat strip with citations; Value-chain margin leakage table; Customer pain-severity distribution |
| 2 | **Unit economics & moat** | Does the P&L work and where is the margin won | **`[G1..G3]`** → **Order-Level P&L Levers `[L1..L3]` & Viability Threshold** | 7-axis Competitor Radar or Scorecard; Consumer journey cost-and-drop-off map; **Hero**: Order-level Unit Economics Waterfall (`AOV → COGS → Delivery/Variable → CM1 → CAC → CM2 → Payback`); Formulae & sensitivity table |
| 3 | **Precision segmentation** | Where to launch first and the exact go/no-go rule | **`[L1..L3]`** → **Launch Cohort `[Cohort-1]` & Launch Gate Rule** | 3-layer Analytical Filter (`Market Filter → Behavioral Split → Viability Score ≥ X`) with a formal **Launch Gate Rule**; Cohort comparison table (`AOV · Frequency · Margin · CAC · Payback`); Pilot geo/density map or rollout scorecard |

## Template D: Phased roadmap

Tracker: **Framing & Budget · Phase I · Phase II · Phase III · Metrics & Risk Governance** (bottom or chevron tracker works well here; the phase slides share identical geometry)

| # | Slide | Takeaway strip says | Baton In → Baton Out | Required Regions (9–10 regions) |
|---|---|---|---|---|
| 1 | **Framing & budget** | The end-state goal, the constraint budget, and the ROI pitch | `Mandate` → **Phase Gates `[Gate 1..3]` & Budget Split** | OBJECTIVE strip; World-assumptions & baseline state panel; Phase budget & milestone allocation table with share bars; Stakeholder value-proposition matrix |
| 2..N | **Phase slides** | What this phase unlocks and its exit gate to Phase $K+1$ | **`[Gate K-1]`** → **Deliverables `[Del-1..4]` & `[Gate K]`** | **Identical layout every time**: OBJECTIVE strip; 4 Key Action modules (each with icon, budget share donut, mechanism, and output KPI); Resource/Stack requirement row; Paired Bottleneck → Solution columns; **Exit Gate criteria footer** |
| N+1 | **Metrics & governance** | How we measure program success and contain tail risks | **`All Phases`** → **Program Scorecard & Contingency Triggers** | Program North Star & phase-gate KPI table; Risk × Severity × Trigger Metric × Mitigation matrix; Scope boundary & Kill-criteria box |

---

## Expanded framework catalogue (35+ named frameworks)

Every content slide applies **at least one primary framework (drawn as the Hero graphic)** plus **1–2 supporting analytical devices** (Fermi calculation box, comparison scorecard, or stat-ring strip). Put the framework's name in a small tag on the panel (`"KANO"`, `"ISSUE TREE"`, `"HOOK LOOP"`) so evaluators see deliberate structured thinking.

| Stage | Named Frameworks to Choose From (Pick based on Problem Archetype — never repeat the same set across decks) | Visual Graphic Form (Shapes + Data + Labels on Graphic) |
|---|---|---|
| **1. Problem Diagnosis** | **1. MECE Issue / Cost Driver Tree** · **2. Funnel Drop-off Waterfall** · **3. Fishbone (Ishikawa)** · **4. 5 Whys Iceberg** · **5. JTBD Outcome-Expectation Gap** · **6. Alternatives Scorecard (`✓/~/✕` or MoSCoW-scored)** · **7. Force-Field Analysis (Drivers vs. Blockers)** · **8. Value-Chain Margin Pool / Leakage** · **9. Scarce-Resource Budget Breakdown** · **10. System Causal Loop (Reinforcing Bottleneck)** | Root-to-branch tree with % weights at nodes; stepped waterfall bars showing drop-off delta; fishbone ribs grouped by System/UX/Policy; waterline iceberg; multi-column scored matrix with bottom gap bar |
| **2. Users & Pain Prioritisation** | **11. Frequency × Severity Pain 2×2** · **12. Behavioral Cohort Divergence Bars** · **13. 24-Hour Day / Workflow Clock** · **14. Multi-Sided Stakeholder Value/Pain Matrix** · **15. Willingness-to-Pay vs. Pain Intensity 2×2** · **16. 3-Layer Viability Filter Funnel** · **17. Switcher vs. Loyalist Friction Matrix** · **18. Journey Friction & Emotion-Arc Map** | Shaded 2×2 quadrant with plotted `[P1..P3]` bubbles + data callouts; diverging horizontal stacked bars (`Decrease / Same / Increase`); radial/linear time breakdown; multi-row journey grid with emotion curve & metric row |
| **3. Solution & MVP Architecture** | **19. Kano Model (Must-Be / Performance / Delighter)** · **20. RICE / ICE Score-Bar Table** · **21. Impact × Effort 2×2** · **22. Hook Model (Trigger-Action-Reward-Investment)** · **23. Marketplace Flywheel with Elasticities** · **24. Trade-off Sliders (Opposing Constraints)** · **25. Tension → Choice → De-risk Matrix** · **26. Build vs. Buy vs. Partner Matrix** · **27. Data-Pipeline / System State Architecture** | Kano axes with plotted `[M1..M3]` curves; table with inline horizontal score bars & `[Solves P1]` badges; 4-node cycle with conversion drivers; dual-marker sliders comparing Status Quo vs. Our MVP |
| **4. Go-to-Market & Economics** | **28. Bowling-Pin Beachhead Expansion** · **29. Fermi TAM-SAM-SOM Concentric Rings** · **30. Good-Better-Best Packaging Matrix** · **31. Channel × CAC × Payback Matrix** · **32. Chicken-and-Egg Marketplace Seeding Playbook** · **33. 3-Phase Rollout with Outcome Gate Footers** · **34. Viral / Referral Loop (`K-factor` math)** | Bowling-pin sequence showing transfer of trust/data; concentric rings with full equation strings beside each ring; 3-tier pricing table with anchor highlight; phase columns with hard exit-gate footers |
| **5. Metrics, P&L & Risks** | **35. North Star Equation Tree (`NSM = f(x,y,z)`)** · **36. L0 / L1 / L2 + Counter-Metric Hierarchy** · **37. HEART Framework Matrix** · **38. AARRR Funnel with Fraction Formulas** · **39. Unit Economics Waterfall (`GMV → CM1 → CM2`)** · **40. Pre-Mortem Risk × Trigger Metric × Mitigation Matrix** | Hierarchical equation tree connecting input levers to NSM; 5×3 HEART grid; stepped P&L bridge chart; severity-colored risk table with explicit quantitative trigger thresholds & kill criteria |

**Anti-Repetition Rule**: In `shape` mode, never select the default 4-pack (`5 Whys + RICE + TAM-SAM-SOM + AARRR`). Choose frameworks that match the **Problem Archetype** and ensure **no two consecutive slides use the same visual graphic family** (e.g. don't put a 2×2 matrix on Slide 2 and another 2×2 matrix as the hero of Slide 3).

**Ideate the graphic with the user.** Never render a framework as plain labelled text boxes. For each major framework, propose 3–4 visual metaphors (tree, waterfall, curve, matrix, loop, sliders, scorecard…) and **ask the user to choose before building**.

---

## Content bar & Triplet Density Rule (required on every slide)

1. **Evaluator Question Map**: During `shape`, list the 8–10 sharp questions an evaluator would ask on that slide. Every region answers **one distinct question**—never restate what another region already said.
2. **Triplet Region Rule (Zero Ugly Whitespace)**: Every single region on a slide must pack **all three**:
   - **A Visual Structure / Graphic** (table grid, score bars, ring, flow nodes, matrix, or sliders),
   - **A Hard Number / Formula** (sourced stat, Fermi calculation, % lift, ₹/$ impact, or draft score),
   - **Tight Mechanism Text + Bottom Implication Strip** (ending in a `primarySoft` or `accentSoft` footer row that states `"So what / Decision →"` so no box ever has blank vertical padding).
3. **Insight Move per Slide**: Every slide carries at least one non-obvious move: a **non-obvious root cause**, a **contrarian bet**, an **explicit trade-off (`Tension → Choice → De-risk`)**, **what we won't do**, or **quantitative kill criteria**.
4. **Numbers Before Build**: Run `research` or build visible **Fermi estimation chains** (`12k teams × 40 seats × ₹800/mo = ₹38.4 Cr`, tagged `Estimate`) so panels contain real analytical density rather than bare `[__]` holes.

## Mixing templates

Interview-style product cases often need Template A plus pieces of B or C (for example, adding a Unit Economics Waterfall from C into Slide 4/5 of A). Keep the tracker to **at most 6 sections**: beyond 6, tabs get cramped and the narrative loses focus.

## Flow checks before you build

1. **Horizontal story check**: Read only tracker labels + 2-line insight strips in order. Does Line 1 state the answer and Line 2 bridge from the previous slide with a number?
2. **Archetype & Framework variety check**: Do the chosen frameworks match the Problem Archetype rather than defaulting to `5 Whys + RICE + TAM-SAM-SOM + AARRR`? Are adjacent hero graphics from different visual families?
3. **Baton-Pass continuity check**: Do Slide 1's Root Drivers (`[D1..D3]`) feed Slide 2's Segment & Pains (`[Seg-A, P1..P3]`), which badge Slide 3's MVP Modules (`[M1..M3, T1..T2]`), which drive Slide 4's GTM and Slide 5's Metrics & Risk triggers?
4. **Triplet & Whitespace check**: Does every region contain **Graphic + Number + Text/Implication Footer**, with **<20% whitespace** inside every panel and **9–12 regions** covering ~85% of the slide?
5. **Hero & Data check**: Is there one clear Hero region (1.5–2× size, 40–60 pt stat or full framework diagram), and is every number either user-supplied, sourced, or shown as a visible Fermi chain?
