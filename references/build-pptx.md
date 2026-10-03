# Building the PPTX

Invoke the pptx skill (`anthropic-skills:pptx`) first for pptxgenjs gotchas, validation and rendering commands. This file covers only what is specific to this skill: the helper kit and the build loop.

## Setup

```js
const path = require('path');
const SKILL = '<absolute path of this skill folder: the folder you read SKILL.md from>';
const { createDeck, loadTheme } = require(path.join(SKILL, 'scripts/deck_kit.js'));
const theme = loadTheme(path.join(SKILL, 'assets/themes/default-blue-yellow.json'));
const K = createDeck(theme, { title: 'Deck title', author: 'Name' });
```

Write the build script as `build.js` in the session scratchpad directory (or the user's working directory if they want to keep it). The kit needs these packages; if they are missing, run `npm install pptxgenjs react react-dom sharp react-icons` in that folder first (ask the user before installing). Run with `node build.js`.

Wrap everything in `(async () => { … })()` because icon components are async: **always `await` `K.iconBadge`, `K.icon`, `K.problemSolution`** or the icons silently go missing.

## Dense slides (default)

Start every poster slide with `const { slide, box } = K.denseSlide({ sections, active, insight: { label, line1, line2, chip }, sources, notes })` and lay out regions inside `box` with `K.GD` (0.1 in) gutters. Dense helpers: `K.sec` (compact panel), `K.statRings` / `K.donutRing` (sourced %), `K.ripple` (concentric impact rings), `await K.scorecard` (✓/~/✕ matrix), `K.imageSlot` (user illustration or placeholder), `K.rrect`, `K.circle`, `K.seg`, `K.shadow()`. `scripts/example_build.js` is the ArchitectOS problem slide (built before these helpers existed, with the same logic written inline): use it as the reference for density and composition.

## Build loop

1. **Theme**: copy and edit the theme JSON if the user supplied brand colours (see design-system.md). Save the copy next to the build script and `loadTheme` it.
2. **Opening**: `K.questionSlide`, then `K.breakdownSlide`.
3. **Per content slide**: `const { slide, box } = K.contentSlide({ sections, active, nav, takeaway, source })`, then lay out inside `box` with a grid you compute from `box.x/y/w/h`:
   - Decide columns first (e.g., `lw = box.w * 0.46`, right column the remainder, gutter `K.G`).
   - Put a `K.section(...)` in each cell; it returns the inner box. Place everything else relative to that inner box so nothing hard-codes slide coordinates.
4. **Closing**: statement slide and/or `K.closingSlide`.
5. `await K.save('<user working directory>/<name>.pptx')`. This also writes the palette into the PowerPoint theme when the pptx skill is present, so the colour picker shows the brand colours.
6. Read any `Kit warnings` printed by the build: they flag likely text overflow and sub-9 pt text. Fix them and rebuild.

## Layout tips that keep dense slides clean

- Compute heights from content: a 3-bullet block at 10 pt needs about 0.75 in, a persona block about 0.55 in per list. Size panels to content, then distribute leftover space evenly rather than leaving one panel half empty.
- Keep the same x for left edges of stacked panels and the same y for tops of side-by-side panels.
- For a repeated layout (phase slides), write one function `phaseSlide(data, activeIndex)` and call it per phase; only data changes.
- Text sits in boxes with `margin: 3pt`. When a pill or icon must align with text, offset by about 0.04 in.
- Do not shrink body text below 10 pt (9.5 pt allowed in persona and table cells). If it does not fit: cut words, enlarge the panel, or split the slide.

## Fonts

Theme fonts default to Arial (headings) and Calibri (body) because they render true-to-width in the QA preview. If the user wants Outfit, Montserrat or another font: set it in the theme, leave about 10 percent slack in every text box, and tell the user the font must be installed on the machine that opens the file.

## Checks

**Default (cheap, always):**
1. Zero `Kit warnings` from the build.
2. Validate with the pptx skill's `validate.py` (path as given in that skill), if available.
3. Re-read the build script for: tracker data identical across poster slides except `active`; repeated layouts going through one shared function; leftover placeholders other than intentional `[X]` data slots.

**Full visual QA (only when the user asks, or for a submission they flag as final):**
convert to PDF with the pptx skill's `soffice.py` (needs LibreOffice), render pages to JPEG (`pdftoppm -jpeg -r 80 deck.pdf slide`, needs Poppler; on Windows install it or ask the user), then view each image and check, in order:
1. Text cut off or spilling out of its box (most common).
2. Overlap: pills over text, callout badges over body text, charts over labels.
3. Tracker identical on every poster slide except the active item.
4. Empty areas inside panels; unequal gutters; misaligned columns.
5. Every region has a visual device; at least one slide per section has a chart, icon set, table or mockup.

If LibreOffice or Poppler is missing, say so and skip the render rather than installing software without asking.

Fix in the build script and rebuild; do not hand-edit the XML. Re-render only the slides you changed.

## Delivering

Save the .pptx to the user's working directory and give its path as a clickable link. In the reply list: the template used, any placeholders the user must fill (data, sources, images), and the theme colours so they can adjust.

## Windows / Claude Code gotchas (learned on the first build)

- **Module path:** `deck_kit.js` resolves packages from its own folder. Run builds with `NODE_PATH=<build folder>/node_modules node build.js`.
- **Shadows:** pptxgenjs mutates a shadow object in place. Reusing one object on several shapes produces absurd values and a "file is corrupted" error. Always pass a fresh object: `const sh = () => ({ type: 'outer', blur: 4, offset: 2, angle: 45, color: '000000', opacity: 0.2 })`, then `shadow: sh()`.
- **Preview without LibreOffice:** if PowerPoint is installed, export through COM from a local (non-OneDrive) copy: `$pp=New-Object -ComObject PowerPoint.Application; $p=$pp.Presentations.Open($path,-1,0,0); $p.Slides.Item(1).Export($png,'PNG',1600,900); $p.Close(); $pp.Quit()`. Pass -1/0 for the MsoTriState arguments, not $true/$false.
- **Finding a corrupt element:** cut the slide XML's `<p:spTree>` children in halves until PowerPoint opens it.
- **Canva import:** PPTX shapes and text import as editable elements. Avoid native charts (draw them from shapes instead).
