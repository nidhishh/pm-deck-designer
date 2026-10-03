# pm-deck-designer

A [Claude Code](https://claude.com/claude-code) skill that designs **dense, well-structured product-management decks**: APM/PM case studies, product teardowns, go-to-market plans, case-competition submissions and launch or roadmap walkthroughs. It outputs editable PowerPoint (`.pptx`) files that also import cleanly into Canva.

It handles the structure, the story and the design. You keep control of the data: it never invents statistics, quotes or market sizes, and marks every gap as a visible `[placeholder]`.

## What it does

- **Tells the story in order.** The default flow is Problem → Who faces it → Solution / MVP → Go-to-market → Metrics, with a section tracker on every slide and a one-line takeaway that states each slide's point.
- **Draws frameworks as graphics, not text.** CIRCLES, 5 Whys, JTBD, RICE, Kano, MoSCoW, TAM-SAM-SOM, positioning 2×2s, AARRR and North Star trees. It proposes 3–4 visual options for each and asks you to pick.
- **Builds dense slides.** About 85% of the canvas is content, with 9–12 regions per slide and a sourced number or graphic in every region. Graphics must carry information, not decoration.
- **Researches evidence on request.** It returns a shortlist of stats sorted into *Solid*, *Use with care* and *Drop*, and uses only the figures you approve. Full source links go in the speaker notes.
- **Checks its own work.** It exports each slide through PowerPoint, reviews the image for overflow, alignment and empty space, and fixes what it finds.

## Modes

Name a mode to run it on its own, or let a new deck run the default loop: **shape → ideate → build → critique → polish → verify → export**.

| Mode | What it does |
|---|---|
| `shape` | Storyboard: tracker sections, one takeaway per slide, frameworks per slide |
| `ideate` | Offers visual options for each framework and asks you to choose |
| `build` | Builds the slides and checks each one through PowerPoint |
| `critique` | Lists issues by severity, each with the exact fix |
| `polish` | Fixes alignment and spacing without changing content |
| `densify` | Turns weak graphics into informative ones and adds evidence |
| `distill` | Cuts words and sharpens takeaways |
| `verify` | Lists placeholders, unsourced numbers and missing tags |
| `theme` | Switches or creates a colour theme |
| `export` | Final `.pptx` plus a PDF, checked for Canva import |
| `teardown` | Studies a reference deck and extracts principles to borrow |

It always describes planned changes and waits for your go-ahead before building or rebuilding.

## Install

Clone into your Claude Code skills folder:

```bash
git clone https://github.com/nidhishh/pm-deck-designer.git ~/.claude/skills/pm-deck-designer
```

On Windows that's `C:\Users\<you>\.claude\skills\pm-deck-designer`.

**Requirements:**
- Node.js 18 or later
- These npm packages in the folder where decks are built (the skill asks before installing them):
  ```bash
  npm install pptxgenjs react react-dom sharp react-icons
  ```
- Optional: **Microsoft PowerPoint** (Windows) so the skill can check rendered slides through COM. LibreOffice works as an alternative.

## Usage

Start a Claude Code session and describe the deck:

- "Make a PM deck: design a feature to improve Swiggy reorders"
- "Teardown deck for Spotify's onboarding"
- "Case-competition deck for this prompt: …"

Or run a single mode: "critique slide 3", "densify slide 2", "switch theme to teal", "teardown this PDF".

## Repository layout

```
SKILL.md                      Entry point: modes, standing rules, data policy
references/
  workflow.md                 The 11 modes and their routines
  design-system.md            Tokens, dense layout spec, graphic rules
  narrative-templates.md      Deck flows and framework → graphic mapping
  build-pptx.md               Build steps and platform gotchas
scripts/
  deck_kit.js                 pptxgenjs component kit, including dense-layout helpers
  example_build.js            A complete dense problem slide (reference build)
assets/
  themes/*.json               Colour themes (default blue-yellow, indigo-coral)
  html-deck-shell.html        Starting point for HTML decks
```

## Themes

Two themes ship by default: **blue + yellow** and **indigo + coral**. To add your own, copy a file in `assets/themes/`, change the colour tokens, and ask the skill to use it. It checks contrast and keeps the accent colour under about 15% of each slide.
