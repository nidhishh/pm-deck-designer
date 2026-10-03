# Workflow modes

Each mode is a focused routine. The user can name one directly ("critique slide 2", "densify slide 3", "teardown this deck"), or run the default loop for a new deck:

**shape → ideate → build → critique → polish → verify → export**

Checkpoints: **stop and ask the user after shape, ideate and critique.**

**Talk before generating (user rule).** Before any build, rebuild, polish, densify, distill or theme change, describe the plan (what is added, what moves, what each region will contain) and wait for an explicit go-ahead. The only exception: fixing obvious render defects (overflow, wraps, collisions) during a build the user already approved. Verify and teardown may run straight through because they change nothing.

A mode applies to the slides named; with no slide named, it applies to the whole deck.

---

## shape (checkpoint)
1. Read `narrative-templates.md`. Default flow: Problem → Who faces it (incl. pain-point prioritisation) → Solution/MVP → GTM → Metrics.
2. Set the tracker (6 sections at most) and the CIRCLES step per slide.
3. Per slide, write the takeaway sentence (a point, not a topic) and name the frameworks it will use.
4. Post the storyboard as a table. **Stop for approval.**

## ideate (checkpoint)
For every framework or major graphic on the slide(s):
1. Propose 3–4 visual metaphors (iceberg, curve, funnel, tree, journey, gauge, matrix…), each with a one-line rationale and an ASCII preview.
2. Mark one as recommended.
3. Ask with the question tool (previews on), up to 4 questions per round; include a density question ("which evidence regions to add?") when the slide is below the density bar.
4. **Stop until answered.** Never render a framework as labelled text boxes.

**How to pick candidate graphics** (explain this reasoning to the user when proposing):
1. **Find the framework's logical shape**: causal depth (5 Whys), change over time (ramp-up), sequence (JTBD, journey), part-to-whole (TAM-SAM-SOM), conversion stages (AARRR), two-criteria trade-off (impact × effort, positioning), ranking with scores (RICE), satisfaction vs functionality (Kano), hierarchy (metric tree), cycle (flywheel).
2. **Map shape → graphic family**: depth → iceberg, root tree, drill-down; time → curve or timeline; sequence → chevrons, numbered steps; part-to-whole → concentric circles, donut, stacked bar; stages → funnel; trade-off → 2×2; ranking → bar table; hierarchy → tree; cycle → loop.
3. **Choose the metaphor that carries the slide's argument**: the graphic should say the insight before the text does (an iceberg says "the visible symptom hides the cause").
4. **Keep canonical forms recognisable**: Kano curves, AARRR funnels and RICE tables should look like what evaluators expect; innovate in styling, not structure.
5. **Match honesty to data**: no real numbers → schematic forms (unlabelled curves, shapes) tagged Illustrative, never precise-looking charts.
6. **Fit the region**: tall regions suit icebergs, trees and vertical timelines; wide ones suit curves, chevrons and funnels. Labels must stay ≥ 9.5 pt.
7. **Vary families** across a slide and the deck; never two of the same family side by side.
8. **Build from shapes** (Canva-editable), not native charts.

## build
1. Follow `build-pptx.md` (kit, theme, NODE_PATH, fresh shadow objects).
2. Lay out on the grid; repeated content reuses one function.
3. Build, fix every `Kit warnings` line, export each changed slide to PNG through PowerPoint, view it, fix obvious defects (wraps, overlaps, misalignment), rebuild.
4. Save the .pptx and a preview PNG to the user's folder.

## critique (checkpoint)
Look at the rendered PNG, not just the script. Output an **issue list only (no scores)**, most severe first. Each issue: what's wrong, where (region), and the exact fix. Check, in order:
1. **Readability**: text under 10 pt (9.5 in tables/personas), wraps that break words, low contrast.
2. **Hierarchy**: does the takeaway read first, big numbers second? Competing focal points?
3. **Grid**: edges off the shared columns, unequal gutters, ragged panel bottoms.
4. **Density**: below 6 regions or ~250 words? Empty areas inside panels?
5. **Frameworks**: each drawn as a graphic, tagged with its name, adding insight rather than decoration?
5b. **Graphic density**: any graphic more than ~40% empty (big circles with one number, near-empty quadrants, one-word chevrons, empty bars, tiles around a single figure)? Fix by shrinking, labelling on the graphic, annotating, or merging with its explanation (design-system.md "Information per square inch").
6. **Colour weight**: accent over ~15%, extra hues, severity colours outside severity elements.
7. **Consistency**: tracker identical to other slides, repeated elements share geometry, one icon set.
8. **Data honesty**: unsourced numbers, invented figures, missing Validated/Hypothesis or Illustrative tags.
9. **Beating the references**: anything a reference deck does better (see design-system.md).
End with: "Apply all, pick, or none?" **Stop for the answer.**

## polish
Fix layout without changing content: snap to grid, equalise gutters, align panel tops/bottoms, remove empty space by resizing panels, unify corner radii and stroke weights, consistent icon sizes, tighten label widths. Rebuild, export, view. Report changes in one short list.

## densify
Raise a light slide to the density bar (6–7 regions, ~250–300 words). First reclaim space from low-information graphics (shrink, label on the graphic, merge explanation into it), then prefer adding an **evidence region** (chart, mini-case, timeline, quote chips, stat strip) over enlarging existing ones. If the new region needs a new graphic, run a quick **ideate** round first (that part is a checkpoint). Keep the takeaway unchanged.

## distill
Make the slide read faster without losing claims: cut words to fragments, one idea per block, 1–3 coloured keyphrases per block, sharpen the takeaway so it states the answer. Never drop a number or a source. Report before/after word count.

## verify
Data audit across the deck:
- List every remaining placeholder (`[__]`, `[X%]`, `[add source]`) by slide.
- Flag any number without a source line, and any figure that wasn't supplied by the user or a cited search.
- Check Validated / Hypothesis / Illustrative / "draft, adjust" tags where required (framework scores, estimates).
- Check personas are labelled as personas.
Output the list; fix tagging issues directly; never fill data yourself.

## theme
Switch to an existing theme in `assets/themes/`, or create one: ask for brand or mood (offer 3–4 palettes with previews if none given), derive tokens per design-system.md, check contrast (dark text on accent ≥ 4.5:1), save as a new JSON, rebuild. After switching, check that accent weight is still under ~15% (large accent blocks may need the soft fill).

## export
Canva-readiness check, then deliver:
- No native charts (draw from shapes); fonts are Arial/Calibri or noted for swapping in Canva; shadows only on label/narrative/conclusion blocks.
- Validate the .pptx opens in PowerPoint (COM) and export a PDF alongside it (`$p.SaveAs($pdf, 32)`).
- Reply with file links (paths relative to the workspace), the theme used, and the placeholder list from **verify**.

## teardown
Analyse a deck (user's or a reference) to extract what to borrow:
1. Render pages at low resolution (PyMuPDF if Poppler is missing); view the opener and 2–3 content pages first, more only if needed.
2. Report per deck: layout patterns, graphic devices, colour and type choices, density, what works, what to avoid.
3. Propose concrete additions to `design-system.md` (inspiration only; never copy slides or content), and ask before writing them.
