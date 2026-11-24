# Design system

The look comes from four reference decks: a persistent section tracker, dense poster slides built from dashed containers and pill labels, flat icons and charts in every region, and a restrained blue-and-yellow palette. This file is the rulebook; components.md is the catalogue.

## Contents
- Theme tokens (brand-agnostic)
- Palette discipline
- Typography and density
- Visual hierarchy & the Triplet Region Rule (zero ugly whitespace)
- Canvas, grid, spacing
- Dense layout spec & 5-slide Bento-Grid coordinate blueprints
- Poster-slide anatomy
- The tracker
- Containers, carryover badges, and footer bars
- Graphics: what goes in every region
- Key-moment slides (dark background)
- Beating the references
- Signature details
- Deliberate departures from the pptx skill's defaults

## Theme tokens (brand-agnostic)

Everything reads from a theme JSON. Default: `assets/themes/default-blue-yellow.json`. To rebrand, copy it and change values; never hard-code hex in a build script.

| Token | Role | Default |
|---|---|---|
| `primary` | dominant colour: tracker, dark slides, table headers, key text | `1E3FBF` |
| `primaryDark` | borders on primary, theme dark 2 | `0B2A8C` |
| `primarySoft` | pale tint for callouts, first table column, soft pills, implication footers | `E6E9FB` |
| `primaryMid` | mid tint for borders, donut remainder | `B9C0F2` |
| `accent` | the one sharp colour: active tracker item, header pills, highlighted words on dark | `FFE500` |
| `accentSoft` | pale accent for evidence boxes, persona cards, step boxes, decision footers | `FFF6A6` |
| `ink` | body text | `111C4A` |
| `muted` | sources, meta text | `5B6489` |
| `surface` | slide background for dense slides | `F4F5FA` |
| `card` | panel fill | `FFFFFF` |
| `positive` / `warning` / `danger` | semantic only (severity, targets, scorecard cells) | green / amber / red |
| fonts `head`, `body` | PPTX: safe fonts so QA is trustworthy. HTML: Outfit with fallbacks | Arial / Calibri |

**When the user brings a brand**: map their primary to `primary`, their highlight colour to `accent`, derive `primarySoft` (primary mixed ~90% with white), `primaryMid` (~70% white), `accentSoft` (accent ~65% white). Keep `ink` dark enough for 7:1 contrast on `surface`. If they supply a logo, place it top-left on dark slides and in the closing slide; keep it off dense poster slides unless asked, because the tracker owns the top edge.

## Palette discipline

- **Primary dominates** (about 60 to 70 percent of the colour weight: tracker, headers, dark slides). Tints of it fill supporting areas.
- **Accent is for emphasis only**: the active tracker item, Hero header pills, the takeaway label, and highlighted words on dark slides. If more than about 15 percent of a slide is accent, it stops being emphasis.
- **One accent family.** The Superstar reference drifted into rose, olive and mustard on top of blue and yellow; that is the failure to avoid. Severity colours appear only in severity cells, scorecard ratings, and target boxes.
- Keywords in body text: wrap in `**…**` and they render bold in `primary` (or accent on dark). Highlight 1 to 3 phrases per block, the ones a skimmer should catch.

## Typography and density

Dense is the default, so the floors are lower than a keynote deck. Small text only works with strong hierarchy.

| Element | Dense poster slide | Key-moment slide (dark) |
|---|---|---|
| Takeaway strip (Line 1 claim / Line 2 bridge) | 13 pt bold / 9.5 pt regular | n/a |
| Tracker labels | 11 to 12 pt bold | n/a |
| Pill / block header | 10 to 11.5 pt bold | n/a |
| **Hero number / focal stat** | **36 to 54 pt bold (one per slide)** | 72 pt+ |
| Big number / stat tile | 20 to 30 pt bold | 60 pt+ |
| Body in blocks & tables | **9.5 to 10.5 pt** (floor 9.5; captions, tags and sources 9) | 18 to 24 pt |
| Implication / Decision footer bar | 9.5 pt bold keyphrases | n/a |
| Source / footnote | 9 pt italic muted | 12 pt |
| Statement text | n/a | 36 to 54 pt bold |

**Density budget per dense slide (user standard: maximum analytical density, zero wasted whitespace)**
- **9 to 12 content regions** covering **~85% of the canvas** (see "Dense layout spec"). More than 12: split the slide.
- **320 to 420 words** total across the slide, with **Text + Graphic + Hard Number packed inside every region** (see "The Triplet Region Rule" below).
- **Density means distinct arguments, not filler**: Every region answers a distinct evaluator question (narrative-templates.md). Never restate the same point in two boxes.
- Each text block is 15 to 45 words. Compact fragments with bold keyphrases (`**mechanism → impact**`), never bloated prose paragraphs.

---

## Visual hierarchy & the Triplet Region Rule (zero ugly whitespace)

### 1. The Triplet Region Rule (Every Region = Graphic + Number + Text/Footer)
Ugly slides happen when a panel holds *only* a sparse diagram floating in white space, *only* a few stretched text lines, or *only* a single number inside a big empty tile. **Every region on a slide must pack all three layers:**
1. **A Visual Structure / Graphic**: a multi-column table (`≥4 rows × 4 cols`), inline horizontal score bars, donut rings, a 2×2 quadrant with plotted data bubbles, a flow diagram with annotated arrows, or diverging bars.
2. **Hard Numbers / Formulas**: sourced percentages, ₹/$ figures, Fermi multiplication chains (`12k × 40 × ₹800`), conversion deltas, or baseline → target ranges embedded directly on the graphic and headers.
3. **Tight Mechanism Text + Anchored Footer Bar**: explanatory labels wrapped tightly around the graphic, plus an anchored **`0.26–0.30 in` Implication / Decision Footer Bar** (`K.footerBar`, filled with `primarySoft` or `accentSoft`) at the bottom of the panel stating `"So what / Decision → ..."`.

**No Spread Rows & No >20% Whitespace:**
- **Never stretch row spacing or line spacing** to fill a tall box. Text and graphic ink must cover **≥80% of every panel's interior**.
- If a panel has leftover vertical space at the bottom, either (a) add a data column/row, (b) add an anchored `K.footerBar` implication strip, or (c) split the panel horizontally into two distinct regions.

### 2. Visual Hierarchy: One Hero Region per Slide (The Squint Test)
Nine identical white dashed boxes look like wallpaper. When you squint at a slide at thumbnail size, the eye must read in order: **(1) Takeaway Strip → (2) The Hero Region → (3) Supporting Regions**.
- **One Hero Region (1.5× to 2× larger than standard panels)**: Houses the primary framework graphic of the slide (e.g., the 2×2 Pain Matrix on Slide 2, the Annotated MVP Modules / Kano Matrix on Slide 3, the 3-Phase GTM Matrix on Slide 4, the North Star Equation Tree / P&L Waterfall on Slide 5) or a **36–54 pt Hero Stat + Breakdown**. Give the Hero an **`accent` pill header** (`variant: 'accent'`) or a soft tinted background (`primarySoft` / `accentSoft` border emphasis), while secondary panels use `soft` pills (`variant: 'soft'`).
- **At least 3 container textures per slide**: Combine (1) white dashed panels (`K.sec`), (2) solid tinted bands/footers (`primarySoft` / `accentSoft`), and (3) dense gridded tables or dark-header strips so the slide has architectural rhythm.

---

## Canvas, grid, spacing

- PPTX canvas `13.333 × 7.5 in` (`LAYOUT_WIDE`). HTML canvas `1280 × 720 px`, scaled to fit.
- Outer margin `M = 0.35 in`. Right content edge `R = 12.863 in` (`W - 0.47`), leaving the right margin for the rotated vertical source line.
- Dense gutter `G = 0.10 in` everywhere (horizontal and vertical). Equal gutters are mandatory.
- Content area runs from `y = 1.20 in` to `y = 7.22 in` (`height = 6.02 in`, `width = 12.513 in`, covering **~85% of the canvas**).

---

## Dense layout spec & 5-slide Bento-Grid coordinate blueprints

Wait no longer to improvise coordinates on Slides 2–5. Every slide starts with `K.denseSlide` (thin tracker tabs at `y: 0.12, h: 0.36`, two-line insight strip at `y: 0.56, h: 0.56`, vertical sources at `x: W - 0.25`) and uses one of these **proven 9–11 region Bento-Grid coordinate blueprints** (`x: 0.35 → 12.86`, `y: 1.20 → 7.22`, gutter `G = 0.10`):

### Blueprint 1: Problem Diagnosis Slide (9–10 Regions)
*Used in `example_build.js` — 3 Columns (`wA = 4.10`, `wB = 4.30`, `wC = 3.91`)*
- **Top-Left (`x: 0.35, y: 1.20, w: 4.10, h: 2.00`)**: Pull quote + Discovery stat circle + 3 stakeholder evidence quote chips.
- **Top-Middle (`x: 4.55, y: 1.20, w: 4.30, h: 2.00`)**: Problem Statement & Scope panel (`JTBD` highlighted banner + 5-row icon table: `Who · Root Problem · Quantified Impact · Assumptions · Out of Scope`).
- **Mid Strip across Col A+B (`x: 0.35, y: 3.30, w: 8.50, h: 1.30`)**: Sourced Validation Strip (`K.statRings` — 4 filled percentage donut rings with bold captions & citations).
- **Bottom-Left (`x: 0.35, y: 4.70, w: 4.10, h: 2.52`)**: **Hero Root-Cause Graphic** (e.g., Issue Tree / Funnel Drop-off Waterfall / 5 Whys Iceberg isolating Root Drivers **`[D1]`, `[D2]`, `[D3]`**).
- **Bottom-Middle (`x: 4.55, y: 4.70, w: 4.30, h: 2.52`)**: Cost-of-Problem Fermi Breakdown & Ripple of Pain (`K.ripple` — concentric rings with per-stakeholder ₹/$ or hour loss).
- **Top-Right (`x: 8.95, y: 1.20, w: 3.91, h: 3.42`)**: Alternatives Scorecard (`K.scorecard` — 5 existing workarounds × 4 criteria with `✓/~/✕` cells).
- **Mid-Right (`x: 8.95, y: 4.70, w: 3.91, h: 0.72`)**: Highlighted Gap & Conclusion Bar (`accentSoft` with shadow, stating the exact system gap).
- **Bottom-Right (`x: 8.95, y: 5.52, w: 3.91, h: 1.70`)**: Solution Thesis / Baton Hand-off (`[D1..D3]` summary + 3 capability pills).

### Blueprint 2: Users & Pain Prioritisation Slide (9–10 Regions)
*Baton In: Root Drivers `[D1..D3]` → Baton Out: Winning Beachhead `[Seg-A]` + Top 3 Pains `[P1, P2, P3]`*
- **Top-Left & Center (`x: 0.35, y: 1.20, w: 8.10, h: 1.85`)**: **Segment Selection Matrix** (`K.scoreTable` — 4 candidate user segments × 6 attributes: `Market Size, Exposure to [D1..D3], Frequency, Urgency, WTP, Verdict`, with **`[Seg-A] Target ✓`** highlighted + bottom implication bar).
- **Top-Right (`x: 8.55, y: 1.20, w: 4.31, h: 3.05`)**: **Hero 2×2 Pain Prioritisation Matrix** (`K.matrix2x2` — *Frequency × Severity* or *WTP × Pain*, plotting 6 pain points as numbered data bubbles and shading the top-right winning quadrant containing **`[P1]`, `[P2]`, `[P3]`** + bottom selection rule bar).
- **Mid-Left (`x: 0.35, y: 3.15, w: 4.00, h: 2.25`)**: **Primary Beachhead Persona / Cohort Card (`[Seg-A]`)** (compact header + quantitative workflow stat + pain bullets badged `[P1]`, `[P2]` + 24-hr time-allocation bar + anchored `Why they adopt first →` footer).
- **Mid-Center (`x: 4.45, y: 3.15, w: 4.00, h: 2.25`)**: **Secondary / Ecosystem Stakeholder or Behavioral Cohort Split** (Completers vs. Drop-offs diverging bars or Partner/Admin persona card + `[P3]` badge + footer bar).
- **Mid-Right (`x: 8.55, y: 4.35, w: 4.31, h: 1.05`)**: **Pain-to-Cost Fermi Box** (3 rows quantifying the exact time/money lost to `[P1]`, `[P2]`, `[P3]` with sources/estimates).
- **Bottom Full-Width (`x: 0.35, y: 5.50, w: 12.51, h: 1.72`)**: **User Journey & Friction Map** (5 stages × 5 rows: `Stage · User Action · Current Tool · Friction Point [P1..P3] · Drop-off / Latency Metric · Product Opportunity`).

### Blueprint 3: Solution & MVP Architecture Slide (9–11 Regions)
*Baton In: `[Seg-A]` & Pains `[P1..P3]` → Baton Out: 3 MVP Modules `[M1..M3]` + Explicit Trade-offs `[T1..T2]`*
- **Top Full-Width Strip (`x: 0.35, y: 1.20, w: 12.51, h: 1.15`)**: **Product Lockup & End-to-End System Architecture / Core Loop** (Left `2.6 in`: Product name, tagline, North Star value prop; Right `9.8 in`: 5-step connected data/workflow pipeline `Trigger/Input → Engine/Model → Action → Feedback Loop` with stack/latency labels on every node).
- **Mid-Left & Center (`x: 0.35, y: 2.45, w: 7.90, h: 2.95`)**: **Hero: 3 MVP Module Cards / Annotated Mockups (`[M1]`, `[M2]`, `[M3]`)** (3 columns of `w: 2.56 in` each; every card carries a **`[Solves P1/P2/P3]` baton badge**, UI wireframe or mechanism flow, 3 technical/UX specs, and an anchored **`Expected Lift: +X%`** footer bar).
- **Mid-Right (`x: 8.35, y: 2.45, w: 4.51, h: 2.95`)**: **Framework Prioritisation Graphic (Kano Curve or RICE Score-Bar Table)** (Scores 6 candidate features against Reach/Impact/Confidence/Effort or Kano categories; top 3 **`[M1..M3]`** boxed in `accent`, bottom 3 explicitly marked **`Cut for v2`**).
- **Bottom-Left (`x: 0.35, y: 5.50, w: 6.20, h: 1.72`)**: **Explicit Trade-offs & Intentional Simplifications (`[T1]`, `[T2]`, `[T3]`)** (`Tension → Our Choice → How We De-risk` table or Trade-off Sliders comparing Status Quo vs. MVP).
- **Bottom-Right (`x: 6.65, y: 5.50, w: 6.21, h: 1.72`)**: **Before vs. After Workflow / Unit Impact Diff** (Quantified step-by-step comparison showing time/cost/clicks dropping from `Baseline` to `With [M1..M3]`, plus an anchored MVP exit-validation goal).

### Blueprint 4: Go-to-Market, Rollout & Economics Slide (9–10 Regions)
*Baton In: `[Seg-A]` & `[M1..M3]` → Baton Out: Phased Targets, Channel CAC/Payback & Pricing*
- **Top-Left (`x: 0.35, y: 1.20, w: 3.90, h: 2.75`)**: **Fermi Market Sizing (TAM-SAM-SOM Rings + Equation Table)** (Concentric rings on left + 3 visible equation rows on right: `Total Market → Serviceable Segment → 18-Mo Beachhead [Seg-A]` with ₹/$ values and bottom take-rate bar).
- **Bottom-Left (`x: 0.35, y: 4.05, w: 3.90, h: 3.17`)**: **Acquisition Loop / Flywheel & Good-Better-Best Pricing Tiers** (Top half: 4-node growth loop with conversion driver %; Bottom half: 3-tier packaging table `Free/Pilot · Pro · Enterprise` with price anchor & margin %).
- **Top-Right (`x: 4.35, y: 1.20, w: 8.51, h: 3.35`)**: **Hero: 3-Phase Rollout Matrix (`Phase 1: Wedge [Seg-A] → Phase 2: Expand → Phase 3: Scale`)** (Timeline chevron header + 3 aligned columns; each column has 4 structured rows: `Target Cohort · Core Hook [M1..M3] · Distribution Channel · Ops/Tech Enabler`, capped at the bottom by a bold **Phase Outcome & Exit-Gate Footer Bar**: e.g. `Gate 1: 500 active teams, >40% W4 retention`).
- **Bottom-Right (`x: 4.35, y: 4.65, w: 8.51, h: 2.57`)**: **Channel Economics & Investment ROI Table** (`Channel · Target Segment · Mechanism · Est. CAC · Conversion % · Payback Months · Share of Growth` across 4–5 channels + anchored capital-allocation footer).

### Blueprint 5: Metrics, Guardrails & Risk Governance Slide (9–10 Regions)
*Baton In: `[M1..M3]` & Trade-offs `[T1..T2]` → Baton Out: North Star Tree, Trigger Metrics & Kill Criteria*
- **Top-Left (`x: 0.35, y: 1.20, w: 5.80, h: 2.85`)**: **Hero: North Star Metric Equation Tree** (Top box: **North Star Metric + exact mathematical formula + 12-mo target**; branching down into **3 L1 Input Levers** directly tagged `[Tracks M1]`, `[Tracks M2]`, `[Tracks M3]`, plus a highlighted **`danger`-bordered Counter-Metric / Guardrail box** so growth can't be gamed).
- **Top-Right (`x: 6.25, y: 1.20, w: 6.61, h: 2.85`)**: **Full-Funnel / HEART / AARRR Metric Scorecard Table** (6 rows × 6 columns: `Layer/Stage · Metric Name · Exact Formula · Baseline · 6-Mo Target · Owner/Module [M1..M3]` with inline target progress bars).
- **Bottom-Left (`x: 0.35, y: 4.15, w: 8.20, h: 3.07`)**: **Pre-Mortem Risk × Trigger Metric × Mitigation Matrix** (5 rows × 5 columns: `Risk & Source [From T1/T2] · Category · Severity (High/Med/Low) · Quantitative Trigger Metric (when alarm fires) · Concrete Engineering/Ops Mitigation`).
- **Bottom-Right (`x: 8.65, y: 4.15, w: 4.21, h: 3.07`)**: **90-Day Pilot Validation Gate & Kill Criteria Panel** (Top: 3 hard numbers the MVP pilot must hit in 90 days to unlock Phase 2 budget; Bottom: `accentSoft` **Kill Criteria / Pivot Rule** box stating what signal makes us stop or pivot, plus scope boundaries).

---

## Poster-slide anatomy

Top to bottom:
1. **Tracker** (`y: 0.12, h: 0.36`). Active section in `accent`.
2. **Two-Line Insight Strip** (`y: 0.56, h: 0.56`): Left `accent` label block (`INSIGHT`, `USERS`, `MVP`, `GTM`, `METRICS`) + Right `primary` bar with **Line 1** (the slide's claim in 13 pt bold white with 1–2 `accent` keywords), **Line 2** (the continuity bridge from the previous slide's baton + hard proof in 9.5 pt `primaryMid`), and a right-aligned **Framework / CIRCLES chip**.
3. **Body** (`y: 1.20 → 7.22`): 9–12 regions snapped to one of the 5 Bento-Grid blueprints above. Every region follows the **Triplet Rule (`Graphic + Number + Text/Footer`)**.
4. **Vertical Source Line** (`x: W - 0.25`, rotated 270°, 9 pt italic `muted`): Lists every citation and notes whether estimates are Fermi-derived or draft framework scores.

## The tracker

Four interchangeable styles; pick one per deck and never mix:
- **tabs** (compact rounded tabs, top `0.36 in`): default for 5 to 6 sections (`K.navCompact`).
- **chevron** (arrow segments, top `0.60 in`): best for linear process stories (Template B, C).
- **bottom** (pill bar, bottom): best for multi-phase roadmaps (Template D).
- **themed** (domain progress bar): optional when the user asks for a domain metaphor.

Rules: active = `accent` fill with `primary` text, others = `primary` fill with white text. Identical labels, order, and geometry on every poster slide. Maximum 6 labels.

## Containers, carryover badges, and footer bars

- **Compact dashed panel (`K.sec`)**: `1.25 pt` primary dashed border, white fill, `0.14 in` radius, `0.28 in` straddling pill header (`variant: 'accent'` for the Hero panel, `'soft'` for supporting panels).
- **Anchored Footer Bar (`K.footerBar`)**: A `0.26–0.30 in` rounded strip anchored at the bottom interior of a panel (`primarySoft` or `accentSoft` fill) carrying `"So what → ..."` or `"Decision: ..."` so panels never end with empty white space.
- **Baton Carryover Badges (`K.batonPill`)**: Compact pill tags (`h: 0.20 in, size: 8.5–9 pt bold`) badging **`[D1]`**, **`[P1]`**, **`[Solves P1]`**, **`[M1]`**, **`[Tracks M1]`**, **`[From T1]`** to visually stitch Slide 1 through Slide 5 together.
- **No full-width bands for a single sentence**: Fold small frameworks (like a JTBD sentence) inside the top of an existing panel (`0.38 in` banner) rather than wasting a full-width row across the slide.

## Graphics: what goes in every region

Pick a graphic family that matches the logical shape of the framework, and **never place two graphics of the same family side by side**.

| Analytical Need | Dense Graphic Device |
|---|---|
| Root-cause decomposition | MECE Issue Tree with % weights at nodes, or 5-Whys Iceberg with dotted waterline rows |
| Funnel / stage leakage | Stepped Waterfall or Horizontal Funnel bars with drop-off `%` and `-₹/$` callouts inside each bar |
| Prioritising items on 2 axes | Shaded 2×2 Matrix (`K.matrix2x2`) with plotted numbered bubbles, data tags, and tinted winning quadrant |
| Scoring options across criteria | High-density Score-Bar Table (`K.scoreTable`) with inline horizontal fill bars, rank badges, and baton tags |
| Comparing workarounds | Alternatives Scorecard (`K.scorecard`) with `✓ / ~ / ✕` semantic cells + bottom Gap conclusion bar |
| Share / validation stats | 4-cell Stat Ring Strip (`K.statRings`) withBLOCK_ARC percentage rings + bold captions + citations |
| Multi-tier impact spreading | Concentric Ripple Rings (`K.ripple`) with angled numbered markers + quantified stakeholder legend |
| Satisfaction vs. investment | Kano Curve (2D axes with Must-Be, Performance, Delighter curves + plotted `[M1..M3]` points) |
| Opposing architectural tensions | Trade-off Sliders (horizontal dual-marker rails showing Status Quo marker vs. Our MVP marker) |
| Unit economics / P&L bridge | Stepped Waterfall (`AOV → COGS → CM1 → CAC → CM2`) with ₹/% labels inside/above every bar |
| Metric hierarchy | North Star Equation Tree (`L0 = L1a × L1b × L1c` + Counter-metric guardrail box) |

**Information per square inch (strict anti-whitespace rules):**
1. **Zero >20% empty area**: Any graphic or panel whose interior is more than 20% blank background is a defect.
2. **Labels live ON the graphic**: Put values, equations, and `← wedge` annotations directly inside/beside bars, rings, and quadrants—no sparse external legends.
3. **Every shape carries 2+ pieces of data**: A chevron holds `Phase Name + Timeframe + Goal KPI`; a quadrant bubble holds `[P1] Title + Freq % + Cost`; a table cell holds `Score + Visual Bar`.
4. **Never stretch rows**: Keep table rows compact (`0.26–0.34 in` per row); if space remains at the bottom of a box, add more rows or an anchored `K.footerBar`.

## Key-moment slides (dark background)

Dark `primary` background, one focal statement in `36 to 54 pt` bold white with 1–2 `accent` words, optional kicker pill and sub-line. Use only for: opening question, breakdown (when competition rules require a 2-slide dark opener), one mid/end key statement, and closing. Never insert a dark key-moment slide in the middle of an analytical multi-slide chain where it breaks the baton flow.

## Beating the references

The reference decks are inspiration for layout and visual devices only. Every deck this skill builds must beat them on these points:

| References often… | Ours always… |
|---|---|
| Cram text down to 6–7 pt | Hold the 9.5 pt body floor (9 pt tags/sources); cut prose fluff to tight fragments |
| Leave awkward blank white space inside cards or around circles | Fill ≥80% of every panel using the **Triplet Rule (`Graphic + Number + Text/Footer`)** |
| Repeat the same 4 frameworks (`5 Whys, RICE, TAM, AARRR`) on every topic | Route via **6 Problem Archetypes** across **40 named frameworks** |
| Treat each slide as an isolated poster with disconnected features | Enforce the **Baton-Pass Contract (`[D1] → [P1] → [M1] → [Metric 1]`)** across all slides |
| Draw 9 identical-looking white boxes (wallpaper effect) | Establish **1 Hero Region (1.5–2× size, accent pill, 36–54 pt stat or main diagram)** + 3 textures |
| Drift panel edges or use uneven gaps | Lock to the 5 Bento-Grid coordinate blueprints with exact `0.10 in` gutters |
| Leave bare `[__]` holes or unverified claims | Research sourced stats or show visible **Fermi calculation chains** tagged `Estimate` |

## Signature details

Use these high-craft details on every poster slide:
- **Hero accent pill vs. supporting soft pills**: Only the Hero panel (and key callout badges) gets an `accent` header pill; supporting panels use `soft` (`primarySoft`) pills so the eye immediately finds the Hero.
- **Two-line Insight Strip with Baton Bridge**: Line 1 states the conclusion; Line 2 bridges from the previous slide's winning baton with a hard number.
- **Anchored Implication Footers (`K.footerBar`)**: Every major panel ends with a tinted bottom strip (`"So what → ..."`), eliminating bottom whitespace and forcing every box to make a point.
- **Baton Carryover Pills (`K.batonPill`)**: `[P1]`, `[Solves P1]`, `[M1]`, `[Tracks M1]` visibly link problems to users, solutions, GTM, and metrics.
- **Coloured keywords (`**…**`)**: 1–3 keyphrases per text block rendered bold in `primary` (or `accent` on dark backgrounds) for 5-second skimming.
- **Subtle outer shadows (`K.shadow()`)**: Applied only to floating summary/gap bars and narrative callouts, never to dashed containers.
- **Vertical right-margin sources (`K.sourcesVertical`)**: Keeps the bottom of the canvas free for full-height Bento panels (`y → 7.22 in`).

## Deliberate departures from the pptx skill's defaults

General presentation skills assume 14–18 pt keynote slides with 1 idea per slide. PM case-competition and pre-read decks are read as dense analytical blueprints (`9.5–10.5 pt` body, 9–12 regions, 320–420 words). Keep all strict rendering quality gates: zero text overflow, zero overlapping shapes, safe fonts (`Arial` / `Calibri`), and full visual verification when requested.
