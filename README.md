# pm-deck-designer

An agent skill for **Claude Code, Google Antigravity, and OpenAI Codex** that designs **ultra-dense, well-structured product-management decks**: APM/PM case studies, product teardowns, go-to-market plans, case-competition submissions, and launch or roadmap walkthroughs. It outputs editable PowerPoint (`.pptx`) files (Canva-ready shapes) or single-file HTML slides.

It handles problem-archetype routing, cross-slide story continuity, and high-density visual architecture. You keep control of the data: it never invents statistics, quotes, or market sizes—it researches sourced numbers, builds visible **Fermi estimation chains**, and marks private-data gaps as explicit `[placeholders]`.

## What it does

- **Routes by Problem Archetype (no repetitive textbook decks).** Instead of repeating `5 Whys + RICE + TAM-SAM-SOM + AARRR` on every deck, it classifies each prompt into one of **6 Problem Archetypes** (*Funnel/Drop-off Fix*, *0-to-1 Build*, *Two-Sided Marketplace*, *Retention/Habit Decay*, *Monetization & Market Entry*, *Constraint Redesign*) and selects a **Matched Framework Arc** from **40+ named PM/consulting frameworks**.
- **Enforces a Continuous Baton-Pass Thread (`[D1] → [P1] → [M1] → [Metric 1]`).** Slide $N$'s winning outputs become Slide $N+1$'s direct inputs:
  - **Slide 1 (Problem)** isolates Root Drivers **`[D1, D2, D3]`** →
  - **Slide 2 (Users & Pains)** scores segments against `[D1..D3]` to pick Winning Beachhead **`[Seg-A]`** + Top 3 Pains **`[P1, P2, P3]`** →
  - **Slide 3 (Solution & MVP)** scores and badges every feature with **`[Solves P1..P3]`** to output 3 Core MVP Modules **`[M1, M2, M3]`** + Explicit Trade-offs **`[T1, T2]`** →
  - **Slide 4 (Go-to-Market)** targets **`[Seg-A]`** using **`[M1..M3]`** as the acquisition wedge →
  - **Slide 5 (Metrics & Risks)** maps every metric to **`[Tracks M1..M3]`** and every risk + trigger metric to **`[From T1..T2]`**.
  - **Insight Strip Bridge**: Line 1 states the slide's sharp takeaway; Line 2 explicitly bridges from the previous slide's baton with a hard number.
- **Zero Ugly Whitespace (The Triplet Region Rule & 5 Bento-Grid Blueprints).** About 85% of the canvas is content (`9–12 regions`, `320–420 words`), snapped to **5 full-slide Bento-Grid coordinate blueprints** with **1 Hero Region** (1.5–2× larger, `accent` pill, 36–54 pt stat or primary framework graphic). Every single panel must pack **all three elements**:
  1. **A Visual Structure / Graphic** (score-bar table, shaded 2×2 matrix, waterfall, Kano curve, pipeline, or diverging bars),
  2. **Hard Numbers / Formulas** (sourced stats, ₹/$ impacts, conversion deltas, or Fermi equations),
  3. **Tight Mechanism Text + Anchored Implication Footer (`K.footerBar`)** (`"So what / Decision → ..."`), covering ≥80% of the box with zero stretched rows.
- **Researches evidence & builds Fermi chains before building.** Returns a shortlist of stats sorted into *Solid*, *Use with care*, and *Drop*, and constructs visible **Fermi chains** (`1.8M couples × 2.1 lost orders/mo × ₹580 × 38% = ₹834 Cr/yr`, tagged `Estimate`) where public stats don't exist.
- **Checks its own work.** Exports each slide to PNG through PowerPoint/LibreOffice, reviews the rendered image for text overflow, bubble collisions, baton continuity, and >20% empty whitespace, and fixes what it finds.

## Modes

Name a mode to run it on its own, or let a new deck run the default loop:
**`shape → research → ideate → build → critique → polish → verify → export`**

| Mode | What it does |
|---|---|
| `shape` | Diagnoses Problem Archetype, selects Matched Framework Arc, maps the Baton-Pass chain (`[D1] → [P1] → [M1]`), and outputs the 9–11 region storyboard table |
| `research` | Searches for required stats (*Solid / Use with care / Drop*) and drafts visible Fermi estimation chains for unsourced slots |
| `ideate` | Proposes 3–4 visual metaphors per framework with ASCII previews showing how Graphic + Number + Text + Footer pack cleanly |
| `build` | Builds the slides on the 5 Bento-Grid coordinate blueprints using `deck_kit.js` and checks rendered PNGs |
| `critique` | Audits continuity (`[D1] → [P1] → [M1]`), Triplet density (<20% whitespace), Hero hierarchy (squint test), readability, and grid alignment |
| `polish` | Snaps edges to the Bento grid, equalises `0.10 in` gutters, removes vertical row stretching, and anchors `K.footerBar` strips |
| `densify` | Splits sparse panels, shrinks low-data shapes, embeds numbers on graphics, and adds evidence/Fermi regions answering new evaluator questions |
| `distill` | Cuts prose to `**Mechanism → Quantified Impact**` fragments and sharpens the 2-line takeaway + baton bridge |
| `verify` | Audits the cross-slide Baton-Pass chain, lists remaining private-data placeholders, and checks `Validated / Estimate / draft` tags |
| `theme` | Switches or derives a brand colour theme while keeping contrast ≥4.5:1 and accent weight under ~15% |
| `export` | Final Canva-ready `.pptx` plus a PDF and verification summary |
| `teardown` | Studies a reference deck and extracts layout, continuity, and graphic-density patterns to borrow |

It always describes planned changes and waits for your go-ahead before building or rebuilding.

## Install

### Quick Clone (Single Agent)
```bash
# Claude Code
git clone https://github.com/nidhishh/pm-deck-designer.git ~/.claude/skills/pm-deck-designer

# Google Antigravity
git clone https://github.com/nidhishh/pm-deck-designer.git ~/.gemini/config/skills/pm-deck-designer

# OpenAI Codex
git clone https://github.com/nidhishh/pm-deck-designer.git ~/.agents/skills/pm-deck-designer
```

### Multi-Agent Installer (Windows PowerShell / macOS / Linux)
If using the multi-agent installer scripts (`install.ps1` / `install.sh`):
```powershell
./install.ps1                       # all three agents, global
./install.ps1 -Target antigravity   # just one
./install.ps1 -Link                 # symlink, so edits in this repo go live
```

**Requirements:**
- Node.js 18 or later
- These npm packages in the folder where decks are built (the skill asks before installing them):
  ```bash
  npm install pptxgenjs react react-dom sharp react-icons
  ```
- Optional: **Microsoft PowerPoint** (Windows COM) or **LibreOffice** so the skill can render slides to PNG for visual QA.

## Usage

Describe the deck and your prompt:

- "Make a PM deck: design a feature to improve Swiggy Instamart repeat reorders"
- "Teardown deck for Spotify's onboarding drop-off"
- "Case-competition deck for this prompt: …"

Or run a single mode: `"shape this prompt"`, `"critique slide 3"`, `"densify slide 2"`, `"switch theme to indigo-coral"`, `"teardown this PDF"`.

## Repository layout

```text
SKILL.md                        Entry point: modes, Problem-Archetype routing, Triplet Rule, data policy
references/
  workflow.md                   The 12 modes and their routines (shape, research, ideate, build, critique…)
  narrative-templates.md        6 Problem Archetypes, Baton-Pass contract, 4 templates, 40+ named frameworks
  design-system.md              Tokens, Triplet Region Rule, Hero hierarchy, 5 Bento-Grid slide blueprints
  build-pptx.md                 Build steps, visual QA checks, and platform gotchas
scripts/
  deck_kit.js                   pptxgenjs component kit (denseSlide, sec, footerBar, batonPill, scoreTable, matrix2x2, statRings, ripple, scorecard…)
  example_build.js              Complete dense reference slide build
assets/
  themes/*.json                 Colour themes (default-blue-yellow, indigo-coral)
  html-deck-shell.html          Starting point for HTML decks
```

## Themes

Two themes ship by default: **blue + yellow** (`default-blue-yellow.json`) and **indigo + coral** (`indigo-coral.json`). To add your own, copy a file in `assets/themes/`, change the colour tokens, and ask the skill to use it. It checks contrast and keeps the accent colour under about 15% of each slide.
