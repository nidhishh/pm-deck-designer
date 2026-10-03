---
name: pm-deck-designer
description: Design aesthetic, well-paced product-management decks (APM/PM case studies, product teardowns, product-build and go-to-market cases, PRD/launch/roadmap walkthroughs, case-competition and interview submissions) as PowerPoint (.pptx) or single-file HTML slides. Focuses on visual design and narrative flow - a persistent section tracker, dense poster-style slides with dashed panels, pill headers, icons, personas, charts, risk/mitigation and metric cards - while the user controls the data. Use this skill whenever the user wants a PM-style deck, a case-study or case-competition deck, a product strategy or GTM deck, a product teardown, or says things like "make this look like a proper PM deck", "design my case deck", "storyboard my product deck", "make my slides more aesthetic", or shares a product-case prompt and asks for slides, even if they do not mention a template or style. Brand-agnostic; blue and yellow by default, with a theme setting for any brand.
---

# PM Deck Designer

Builds decks that read like the best case-competition submissions: a bold opening question, a section tracker that never leaves the screen, dense but scannable "poster" slides, and a story that answers the prompt's questions in order. The user owns the content and data; this skill owns structure, flow and design.

## What good looks like

- **Flow**: tracker labels plus takeaway strips alone retell the story. Each section answers one sub-question of the prompt.
- **Design**: one dominant colour, one sharp accent, dashed panels with pill headers, a visual device in every region (icon, chart, number, table, mockup), bold keyphrases for skimming.
- **Density**: dense by default (these are read as documents), with light slides only for key moments (question, breakdown, one statement, closing).

## Modes

The skill runs as named modes, like `impeccable`: **shape, ideate, build, critique, polish, densify, distill, verify, theme, export, teardown**. When the user names a mode ("critique slide 2", "densify slide 3", "teardown this deck", "switch theme"), read `references/workflow.md` and run that mode. For a new deck, run the default loop **shape → ideate → build → critique → polish → verify → export**, stopping for the user after shape, ideate and critique. The steps below are the detail behind shape and build.

## Workflow

### 1. Gather only what is missing

Infer from the request before asking. You need:
- **The prompt or topic** (and the user's sub-questions if they have them).
- **Output format**: PowerPoint (.pptx) or HTML slides. Default to PPTX for submissions, competitions, interviews and anything emailed; HTML for web sharing or presenting from a browser. If genuinely unclear, ask one short question.
- **Use**: pre-read (default, dense) or presented live (lighter variant: split posters in two, 14 pt body).
- **Theme**: default blue and yellow unless the user gives brand colours, a logo, or reference images. From brand colours, derive the theme per design-system.md. From new reference decks, render pages, sample the palette, and note what differs from the defaults before building.

Ask at most 3 questions in one go, and skip any the user already answered.

### 2. Choose the narrative

Read `references/narrative-templates.md`, pick one of the four templates (Product build, Strategy/GTM, Market and unit economics, Phased roadmap), and adapt the tracker labels to the prompt's sub-questions. Mixing is allowed; six tracker sections is the maximum.

### Standing rules from the user
- **Maximum density** (≈85% of the canvas as content, 9–12 regions, sourced numbers everywhere possible): see design-system.md "Dense layout spec".
- **Talk before generating**: describe planned changes and wait for a go-ahead before any build or rebuild (workflow.md).
- **Frameworks as graphics, chosen with the user** through questions with previews; no line charts without real data; no decorative graphics.
- **References are inspiration only**; every deck must beat them (design-system.md "Beating the references").

### 3. Storyboard in the reply, then wait for approval

Post a compact storyboard so the flow is visible and easy to correct: one line per slide with its tracker section, the takeaway sentence, and the main devices ("persona cards ×3 + journey table"). Then **stop and wait for the user's OK** before building. Building a full deck is expensive; a wrong storyboard wastes all of it. Skip the wait only when the user has said "just build it" or similar. If the user supplied draft content, map it onto the storyboard and keep their meaning and numbers; tighten wording to fit rather than rewriting claims.

### 4. Apply the design system and build

- `references/design-system.md`: tokens, palette discipline, type scale, density budget, tracker, anatomy. Read before laying out any slide.
- `references/components.md`: the component catalogue with the kit function and HTML class for each.
- **PPTX**: read `references/build-pptx.md` and invoke the pptx skill (`anthropic-skills:pptx`); build with `scripts/deck_kit.js` (see `scripts/example_build.js` for a complete working deck).
- **HTML**: read `references/build-html.md`; start from `assets/html-deck-shell.html`; icons via `scripts/icon_svg.js`.

**If a referenced file is missing**, do not stop: follow the rules in this SKILL.md, build with the pptx skill's own approach (or plain HTML), and tell the user which files were missing.

### 5. Check, then deliver

Default check (cheap): review the build script for the usual defects - text likely to overflow its box, overlapping pills or badges, empty space inside panels, and a tracker whose position or labels differ between slides. Fix in the build script and rebuild. Validate PPTX with the pptx skill's `validate.py` if available.

Full visual QA (render every slide to an image and inspect it) only when the user asks for it, or before a final submission the user flags as final. It needs LibreOffice and costs far more tokens.

Deliver per the build reference, and in the reply list: template used, theme colours, and every placeholder the user still needs to fill.

## Data policy (important)

The user controls the data. **Never invent statistics, sources, benchmarks, quotes from real people, market sizes, or company facts.** Where a number belongs, write a bracketed slot (`[X%]`, `[₹ amount]`, `Source: [add source]`) and make the slot visually obvious. If the user asks you to find or fill figures, search, cite the source on the slide, and mark anything estimated as "Illustrative".

**When a slide is light on evidence, offer to research sourced numbers** (sourced stats are what make reference decks look dense and credible). Return a shortlist sorted into **Solid** (peer-reviewed or large primary surveys), **Use with care** (widely reported but secondhand) and **Drop** (blogs, unverifiable), each with its link. Use only figures the user approves; put full source links in the speaker notes and a short citation on the slide.

**Illustrated metaphors.** When a graphic works best as an illustration (an iceberg, a seesaw), offer an image-generation prompt for the user to run (e.g. in Gemini) with exact aspect ratio, palette hexes, waterline or anchor positions, transparent background and "no text". Leave a labelled placeholder (`K.imageSlot`) and place the file automatically once it appears in the user's folder (match by filename keyword). Persona names, quotes and journeys are fictional by design; label them as personas, never as research findings unless the user says they are.

## Rules that are easy to get wrong

- Same tracker labels, order and position on every poster slide; only the active item changes.
- Takeaway strips state a point ("Every idle moment is filled, so the mind never rests"), not a topic ("Problem").
- Repeated slide types (phases, personas, metric cards) reuse identical geometry.
- Accent colour is for emphasis only; severity colours appear only in severity and target elements.
- Text floors on dense slides: body 9.5 pt, captions/sources/tags 9 pt; if it will not fit, cut words or split the slide rather than shrinking further.
- Use only images the user supplied; otherwise initials avatars and Lucide icons. Never fetch or invent photos or logos.
- Number every claim's source line when a figure appears; leave `[add source]` if unknown.

## Iterating with the user

When they ask for a change ("make slide 4 lighter", "swap to chevron tracker", "use our brand colours"), edit the build script (or theme file) and rebuild the whole deck so styling stays consistent; do not patch single slides by hand. If they share a new reference deck, extract what they like (layout, graphic style, flow) and fold it into the theme or component choices, and say what you changed.

## Files

- `references/workflow.md`: the named modes and their routines
- `references/narrative-templates.md`: the four flows, slide by slide
- `references/design-system.md`: tokens and rules
- `references/components.md`: component catalogue
- `references/build-pptx.md`, `references/build-html.md`: build and QA procedures
- `assets/themes/default-blue-yellow.json`: default theme (copy to rebrand)
- `assets/html-deck-shell.html`: HTML starting point
- `scripts/deck_kit.js`, `scripts/example_build.js`, `scripts/icon_svg.js`: PPTX kit, working example, HTML icon helper
