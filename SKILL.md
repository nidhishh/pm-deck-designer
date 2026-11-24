---
name: pm-deck-designer
description: Design aesthetic, well-paced product-management decks (APM/PM case studies, product teardowns, product-build and go-to-market cases, PRD/launch/roadmap walkthroughs, case-competition and interview submissions) as PowerPoint (.pptx) or single-file HTML slides. Focuses on visual design and narrative flow - a persistent section tracker, dense poster-style slides with dashed panels, pill headers, icons, personas, charts, risk/mitigation and metric cards - while the user controls the data. Use this skill whenever the user wants a PM-style deck, a case-study or case-competition deck, a product strategy or GTM deck, a product teardown, or says things like "make this look like a proper PM deck", "design my case deck", "storyboard my product deck", "make my slides more aesthetic", or shares a product-case prompt and asks for slides, even if they do not mention a template or style. Brand-agnostic; blue and yellow by default, with a theme setting for any brand.
---

# PM Deck Designer

Builds decks that read like the best case-competition submissions: a bold opening question, a section tracker that never leaves the screen, ultra-dense but scannable "poster" slides with zero wasted whitespace, and a continuous analytical thread that answers the prompt's questions in order. The user owns the content and data; this skill owns problem-archetype routing, cross-slide continuity, and visual architecture.

## What good looks like

- **Problem-Driven Flow & Baton Continuity**: Every prompt is routed through one of **6 Problem Archetypes** (`narrative-templates.md`) so the deck selects a **Matched Framework Arc** (from 40+ named frameworks) rather than repeating generic textbook slides. Slide $N$'s winning output becomes Slide $N+1$'s direct input via visible carryover badges (`Root Drivers [D1..D3] → Beachhead [Seg-A] & Pains [P1..P3] → MVP Modules [M1..M3] & Trade-offs [T1..T2] → GTM Wedges → Metrics & Risk Triggers`).
- **Triplet Density (Zero Ugly Whitespace)**: Every single region on a slide packs **all three elements**: **(1) a visual graphic/table**, **(2) a hard number/formula**, and **(3) tight mechanism text + an anchored bottom implication bar (`"So what →"`)**, covering ≥80% of its box with no stretched blank space.
- **Visual Hierarchy (Squint Test)**: 9–12 regions per slide locked to the **5 Bento-Grid Coordinate Blueprints** (`design-system.md`), anchored by **1 Hero Region** (1.5–2× larger, `accent` header pill, 36–54 pt focal stat or primary framework diagram) and at least 3 container textures.

## Modes

The skill runs as named modes: **shape, research, ideate, build, critique, polish, densify, distill, verify, theme, export, teardown**. When the user names a mode ("critique slide 2", "densify slide 3", "teardown this deck", "switch theme"), read `references/workflow.md` and run that mode. For a new deck, run the default loop **shape → research → ideate → build → critique → polish → verify → export**, stopping for the user after shape, research, ideate and critique.

## Workflow

### 1. Gather only what is missing

Infer from the request before asking. You need:
- **The prompt or topic** (and the user's sub-questions if they have them).
- **Output format**: PowerPoint (`.pptx`) or HTML slides. Default to PPTX for submissions, competitions, interviews and anything emailed; HTML for web sharing or presenting from a browser.
- **Use**: pre-read / submission (default, maximum poster density) or presented live (lighter variant: split posters in two, 14 pt body).
- **Theme**: default blue and yellow unless the user gives brand colours, a logo, or reference images.

Ask at most 3 questions in one go, and skip any the user already answered.

### 2. Route by Problem Archetype & design the Baton-Pass chain

Read `references/narrative-templates.md`:
1. Classify the prompt into one of the **6 Problem Archetypes** (*Funnel/Drop-off Fix*, *0-to-1 Build*, *Two-Sided Marketplace*, *Retention/Habit Decay*, *Monetization/Pricing/Market Entry*, *Constraint/Technical Redesign*).
2. Pick a **Matched Framework Arc** from the 40-framework catalogue so every slide's framework connects naturally to the next. **Never default to the repetitive `5 Whys + RICE + TAM-SAM-SOM + AARRR` set.**
3. Define the **Baton-Pass Chain** (`[D1..D3] → [Seg-A, P1..P3] → [M1..M3, T1..T2] → GTM → Metrics/Risks`) and ensure Line 2 of each slide's top `insightStrip` explicitly bridges from the prior slide's winning baton with a hard number.

### Standing rules from the user
- **Triplet Region Rule (no ugly whitespace)**: Every region must contain **Graphic + Hard Number + Tight Text/Implication Footer (`K.footerBar`)**, filling ≥80% of the panel with zero stretched rows (`design-system.md`).
- **Every region answers a distinct evaluator question; never restate what is already on the slide.** Each slide carries at least one **Insight Move** (non-obvious why, contrarian bet, explicit trade-off, what we won't do, kill criteria).
- **One Hero per slide**: one region at 1.5–2× the others with an `accent` pill, a 36–54 pt number or full-size framework graphic, and at least 3 container styles across the slide.
- **Research numbers or show Fermi chains before building**: sourced figures or visible Fermi equations (`12k × 40 × ₹800 = ₹38.4 Cr`, tagged `Estimate`), not bare `[__]` holes.
- **Talk before generating**: describe planned changes and wait for a go-ahead before any build or rebuild (`workflow.md`).
- **Frameworks as graphics, chosen with the user**; no line charts without real time-series data; no decorative graphics.

### 3. Storyboard, then wait for approval

Present the storyboard table (`Slide & Tracker · Takeaway Line 1 + Baton Bridge Line 2 · Baton In → Baton Out · Hero Framework · All 9–11 Regions with Question + Triplet Contents · Insight Move`). Then **stop and wait for the user's OK** before building.

### 4. Apply the design system and build

- `references/design-system.md`: tokens, palette discipline, Triplet Region Rule, Hero hierarchy, and the **5 Bento-Grid Coordinate Blueprints** (exact `x, y, w, h` layouts for Problem, Users, Solution, GTM, and Metrics slides). Read before laying out any slide.
- `references/components.md`: the component catalogue with the kit function and HTML class for each.
- **PPTX**: read `references/build-pptx.md`; build with `scripts/deck_kit.js` (`K.denseSlide`, `K.sec`, `K.footerBar`, `K.batonPill`, `K.scoreTable`, `K.matrix2x2`, `K.statRings`, `K.ripple`, `K.scorecard`).
- **HTML**: read `references/build-html.md`; start from `assets/html-deck-shell.html`; icons via `scripts/icon_svg.js`.

### 5. Check, then deliver

Review the build script and rendered output against the `critique` checklist in `references/workflow.md`:
- Zero text overflow, zero overlapping pills/badges, and **zero panels with >20% empty whitespace or stretched rows**.
- Verify the **Baton-Pass badges (`[D1] → [P1] → [M1]`)** and identical tracker geometry across all slides.

Deliver per the build reference, listing: Problem Archetype & framework arc used, Baton-Pass summary, theme colours, and any private-data placeholders the user still needs to fill.

## Data policy (important)

The user controls the data. **Never invent statistics, sources, benchmarks, quotes from real people, market sizes, or company facts.**
- During the **research** step, search for public stats and sort them into **Solid**, **Use with care**, and **Drop** with links. Use only figures the user approves; put full links in speaker notes and short citations in the vertical right margin (`K.sourcesVertical`).
- Where no public stat exists, build a visible **Fermi estimation chain** on the slide (`Inputs × Rates = Output`, tagged **Estimate**) so the box stays dense and verifiable. Reserve `[__]` only for the user's private internal metrics.

## Rules that are easy to get wrong

- Same tracker labels, order and position on every poster slide; only the active item changes.
- `insightStrip` Line 1 states the slide's point; Line 2 bridges from the previous slide's baton with a number.
- Every panel ends with content or an anchored `K.footerBar` (`"So what → ..."`)—never empty white space at the bottom of a box.
- Only the Hero region (and key badges) gets an `accent` header pill; supporting panels use `soft` (`primarySoft`) pills.
- Text floors on dense slides: body `9.5 pt`, captions/sources/tags `9 pt`; cut prose fluff to fragments rather than shrinking font size below `9 pt`.

## Files

- `references/workflow.md`: the named modes and their routines
- `references/narrative-templates.md`: 6 Problem Archetypes, Baton-Pass contract, 4 templates, 40+ frameworks
- `references/design-system.md`: tokens, Triplet Region Rule, Hero hierarchy, 5 Bento-Grid slide blueprints
- `references/components.md`: component catalogue
- `references/build-pptx.md`, `references/build-html.md`: build and QA procedures
- `assets/themes/default-blue-yellow.json`, `assets/themes/indigo-coral.json`: themes
- `assets/html-deck-shell.html`: HTML starting point
- `scripts/deck_kit.js`, `scripts/example_build.js`, `scripts/icon_svg.js`: PPTX kit, reference build, HTML icon helper
