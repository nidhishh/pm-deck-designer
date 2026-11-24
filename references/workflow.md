# Workflow modes

Each mode is a focused routine. The user can name one directly ("critique slide 2", "densify slide 3", "teardown this deck"), or run the default loop for a new deck:

**shape → research → ideate → build → critique → polish → verify → export**

Checkpoints: **stop and ask the user after shape, research, ideate and critique.**

**Talk before generating (user rule).** Before any build, rebuild, polish, densify, distill or theme change, describe the plan (what is added, what moves, what each region will contain) and wait for an explicit go-ahead. The only exception: fixing obvious render defects (overflow, wraps, collisions) during a build the user already approved. Verify and teardown may run straight through because they change nothing.

A mode applies to the slides named; with no slide named, it applies to the whole deck.

---

## shape (checkpoint)
1. **Diagnose the Problem Archetype & Template** (`narrative-templates.md`): Classify the prompt into one of the **6 Problem Archetypes** (*1: Funnel/Drop-off Fix*, *2: 0-to-1 Build*, *3: Two-Sided Marketplace*, *4: Retention/Habit Decay*, *5: Monetization/Pricing/Market Entry*, *6: Constraint/Technical Redesign*). Select a **Matched Framework Arc** from the 40-framework catalogue so all slides speak the same analytical language. **Never default to the generic textbook combo (`5 Whys + RICE + TAM-SAM-SOM + AARRR`).**
2. **Design the Baton-Pass Continuity Chain**:
   - Slide 1 isolates named Root Drivers **`[D1, D2, D3]`**.
   - Slide 2 segments users by `[D1..D3]` to pick 1 Winning Beachhead **`[Seg-A]`** + Top 3 Prioritized Pains **`[P1, P2, P3]`**.
   - Slide 3 scores and maps MVP features directly against `[P1..P3]` (`[Solves P1]`, etc.) to output 3 Core MVP Modules **`[M1, M2, M3]`** + Explicit Trade-offs **`[T1, T2]`**.
   - Slide 4 builds the GTM wedges, channels, and pricing specifically for **`[Seg-A]`** adopting **`[M1..M3]`**.
   - Slide 5 maps every metric to **`[M1..M3]`** (`[Tracks M1]`) and every risk + trigger metric to **`[T1..T2]`** (`[From T1]`).
3. **Map the 9–11 Regions & Evaluator Questions per Slide**:
   - Assign each slide to its **Bento-Grid Coordinate Blueprint** (`design-system.md` Blueprints 1–5).
   - Designate **1 Hero Region** (1.5–2× larger, `accent` pill, 36–54 pt stat or primary framework diagram).
   - Ensure every region satisfies the **Triplet Rule (`Graphic + Hard Number + Tight Text/Implication Footer`)** and answers a distinct evaluator question.
   - Include at least **1 Insight Move** per slide (non-obvious why, contrarian bet, explicit trade-off, what we won't do, or quantitative kill criteria).
4. **Post the Storyboard Table**: Columns = `Slide & Tracker · Takeaway (Line 1) + Baton Bridge (Line 2) · Baton In → Baton Out · Hero Framework · All 9–11 Regions (Question + Triplet Contents) · Insight Move`. **Stop for approval.**

## research (checkpoint)
Runs by default after shape so slides never look hollow or littered with `[__]` placeholders.
1. List every number slot the approved storyboard needs (market sizes, benchmarks, drop-off rates, adoption stats, pricing, competitor figures).
2. Search for each and sort findings into **Solid / Use with care / Drop** with source links (`SKILL.md` data policy).
3. For slots without a direct public stat, build a visible **Fermi estimation chain** (`12k teams × 40 seats × ₹800/mo = ₹38.4 Cr/yr`, tagged **Estimate**) so the calculation itself adds analytical density to the slide.
4. Leave `[__]` only for the user's private internal metrics or personal story numbers.
5. Post the sourced stats and Fermi chains. **Stop for approval.**

## ideate (checkpoint)
For every framework or Hero graphic on the slide(s):
1. Propose 3–4 visual metaphors (issue tree, waterfall, Kano curve, 2×2 matrix with bubbles, flywheel loop, trade-off sliders, score-bar table, day clock…), each with a one-line rationale and an ASCII preview showing how **Graphic + Number + Text + Implication Footer** pack inside the box with zero wasted whitespace.
2. Mark one as recommended (ensuring no two adjacent slides or side-by-side panels use the same graphic family).
3. Ask with the question tool, up to 4 questions per round.
4. **Stop until answered.** Never render a framework as plain labelled text boxes.

**How to pick candidate graphics** (explain this reasoning to the user when proposing):
1. **Find the framework's logical shape**: causal decomposition (Issue Tree, Fishbone), stage leakage (Funnel Waterfall), two-criteria trade-off (2×2 Matrix), multi-criteria ranking (Score-Bar Table), satisfaction vs. investment (Kano Curve), opposing tensions (Trade-off Sliders), behavioral loop (Hook / Flywheel), P&L bridge (Unit Economics Waterfall), equation hierarchy (North Star Tree).
2. **Pack the Triplet inside the bounding box**: circles, diagonals, and trees leave empty corners if drawn alone—always pair the shape with an inline data legend, equation rows, or an anchored `K.footerBar` implication strip so **≥80% of the region is filled**.
3. **Thread the Baton badges directly onto the graphic**: plot `[P1..P3]` directly onto the 2×2 bubbles; badge `[Solves P1]` directly on the RICE/Kano rows; badge `[Tracks M1]` directly on the metric tree branches.
4. **Build from shapes** (Canva-editable), never native charts.

## build
1. Follow `build-pptx.md` and the **5 Bento-Grid Coordinate Blueprints** in `design-system.md`.
2. Use the high-density helpers in `deck_kit.js` (`K.denseSlide`, `K.sec`, `K.footerBar`, `K.batonPill`, `K.scoreTable`, `K.matrix2x2`, `K.statRings`, `K.ripple`, `K.scorecard`).
3. Build, fix every `Kit warnings` line, export each changed slide to PNG through PowerPoint/LibreOffice when available, view it, fix any overflow, collision, or >20% empty whitespace inside a panel, and rebuild.
4. Save the `.pptx` and preview PNGs to the user's folder.

## critique (checkpoint)
Look at the rendered PNG (or script layout geometry if headless). Output an **issue list only (no scores)**, most severe first. Each issue: what's wrong, where (region), and the exact fix. Check, in order:
0. **Continuity & Framework Fit**: Does the deck repeat generic textbook frameworks without fitting the Problem Archetype? Is the Baton-Pass broken between slides (e.g., Slide 3 features don't map to Slide 2's `[P1..P3]`, or Line 2 of `insightStrip` fails to bridge from the previous slide)? Does any region restate another region?
1. **Whitespace & Triplet Rule (Zero Ugly Boxes)**: Is any panel more than **20% empty background**? Does any region lack one of the Triplet elements (**Graphic + Hard Number + Tight Text/Implication Footer**)? Are table rows or card bullets vertically stretched (`spread rows`) to fake height? Fix by shrinking/splitting the box, adding a data column, or anchoring a `K.footerBar`.
2. **Hierarchy (Squint Test)**: Viewed at thumbnail size, does the takeaway read first and the **Hero region** second? Is there one Hero region at 1.5–2× standard size with an `accent` pill and a 36–54 pt stat or primary diagram? Are there at least 3 container textures (dashed panels, tinted bands/footers, gridded tables)?
3. **Readability**: Any text under `9.5 pt` (`9 pt` for tags/captions/sources), ugly word wraps, or low contrast?
4. **Grid & Alignment**: Any panel edges off the shared Bento-Grid columns, unequal gutters (must be `0.10 in`), or ragged panel bottoms (must align to `y = 7.22 in`)?
5. **Colour Weight**: Accent over ~15%, stray hues, or severity colours outside severity/scorecard cells?
6. **Data Honesty**: Unsourced stats, bare `[__]` holes that a Fermi chain could fill, or missing `Estimate` / `draft, adjust` tags?
End with: "Apply all, pick, or none?" **Stop for the answer.**

## polish
Fix layout and whitespace without changing claims: snap every panel to the Bento-Grid coordinates, equalise gutters to `0.10 in`, align panel bottoms to `7.22 in`, eliminate vertical stretching inside cards/tables, anchor `K.footerBar` strips to close bottom gaps, unify corner radii and stroke weights. Rebuild, export, view. Report changes in one short list.

## densify
Raise a sparse or ugly slide to the full **Triplet Density Bar** (9–12 regions, 320–420 words, ≥80% panel fill).
1. **Eliminate internal whitespace first**: shrink oversized low-data shapes (big circles with 1 number, sparse 2×2s, stretched 3-row tables), embed numbers/equations directly onto the graphic, and anchor a `K.footerBar` implication strip at the bottom of every panel.
2. **Split oversized panels**: where a panel has >20% empty space, split it and add a new analytical region that answers an unanswered evaluator question (e.g., a Fermi cost-of-pain calculation, a counter-metric box, a rejected-alternatives row, or a before/after workflow diff).
3. Keep the Baton-Pass tags (`[D1] → [P1] → [M1]`) and Hero hierarchy intact.

## distill
Make the slide read faster without losing density or numbers: cut prose sentences into compact `**Mechanism → Quantified Impact**` fragments, 1–3 coloured keyphrases per block, sharpen Line 1 of the takeaway to state the conclusion and Line 2 to state the baton bridge + proof. Never drop a number, formula, or source. Report before/after word count.

## verify
Data and continuity audit across the deck:
- Verify the **Baton-Pass chain** across all slides (`[D1..D3]` → `[Seg-A, P1..P3]` → `[M1..M3, T1..T2]` → `GTM` → `Metrics & Triggers`). Flag any orphan feature or disconnected metric.
- List every remaining placeholder (`[__]`, `[X%]`, `[add source]`) by slide.
- Flag any number without a source line or Fermi chain, and check `Validated / Hypothesis / Estimate / draft, adjust` tags.
Output the audit list and fix tagging or baton-badge omissions directly.

## theme
Switch to an existing theme in `assets/themes/`, or create one: ask for brand or mood (offer 3–4 palettes with previews if none given), derive tokens per `design-system.md`, check contrast (dark text on accent ≥ 4.5:1), save as a new JSON, rebuild. Keep accent weight under ~15%.

## export
Canva-readiness check, then deliver:
- No native charts (draw all rings, bars, matrices, and trees from shapes); safe fonts (`Arial` / `Calibri`); shadows only on floating summary/narrative blocks.
- Validate the `.pptx` opens cleanly and export a PDF alongside it when PowerPoint/LibreOffice is available.
- Reply with file links, the Problem Archetype & framework arc used, the theme, and any remaining private-data placeholders from **verify**.

## teardown
Analyse a deck (user's or a reference) to extract what to borrow:
1. Render pages at low resolution; view the opener and 2–3 content pages first.
2. Report per deck: Problem Archetype, cross-slide continuity devices, layout grid, graphic density (how it avoids empty whitespace), colour/type hierarchy, what works, and what fails our quality bar.
3. Propose concrete additions to `design-system.md` or `narrative-templates.md`, and ask before writing them.
