# Design system

The look comes from four reference decks: a persistent section tracker, dense poster slides built from dashed containers and pill labels, flat icons and charts in every region, and a restrained blue-and-yellow palette. This file is the rulebook; components.md is the catalogue.

## Contents
- Theme tokens (brand-agnostic)
- Palette discipline
- Typography and density
- Canvas, grid, spacing
- Poster-slide anatomy
- The tracker
- Containers and labels
- Graphics: what goes in every region
- Light slides (key moments)
- Deliberate departures from the pptx skill's defaults

## Theme tokens (brand-agnostic)

Everything reads from a theme JSON. Default: `assets/themes/default-blue-yellow.json`. To rebrand, copy it and change values; never hard-code hex in a build script.

| Token | Role | Default |
|---|---|---|
| `primary` | dominant colour: tracker, dark slides, table headers, key text | `1E3FBF` |
| `primaryDark` | borders on primary, theme dark 2 | `0B2A8C` |
| `primarySoft` | pale tint for callouts, first table column, soft pills | `E6E9FB` |
| `primaryMid` | mid tint for borders, donut remainder | `B9C0F2` |
| `accent` | the one sharp colour: active tracker item, header pills, highlighted words on dark | `FFE500` |
| `accentSoft` | pale accent for evidence boxes, persona cards, step boxes | `FFF6A6` |
| `ink` | body text | `111C4A` |
| `muted` | sources, meta text | `5B6489` |
| `surface` | slide background for dense slides | `F4F5FA` |
| `card` | panel fill | `FFFFFF` |
| `positive` / `warning` / `danger` | semantic only (severity, targets) | green / amber / red |
| fonts `head`, `body` | PPTX: safe fonts so QA is trustworthy. HTML: Outfit with fallbacks | Arial / Calibri |

**When the user brings a brand**: map their primary to `primary`, their highlight colour to `accent`, derive `primarySoft` (primary mixed ~90% with white), `primaryMid` (~70% white), `accentSoft` (accent ~65% white). Keep `ink` dark enough for 7:1 contrast on `surface`. If they supply a logo, place it top-left on dark slides and in the closing slide; keep it off dense poster slides unless asked, because the tracker owns the top edge.

## Palette discipline

- **Primary dominates** (about 60 to 70 percent of the colour weight: tracker, headers, dark slides). Tints of it fill supporting areas.
- **Accent is for emphasis only**: the active tracker item, header pills, the takeaway label, and highlighted words on dark slides. If more than about 15 percent of a slide is accent, it stops being emphasis.
- **One accent family.** The Superstar reference drifted into rose, olive and mustard on top of blue and yellow; that is the failure to avoid. Severity colours appear only in severity cells and target boxes.
- Keywords in body text: wrap in `**…**` and they render bold in `primary` (or accent on dark). Highlight 1 to 3 phrases per block, the ones a skimmer should catch.

## Typography and density

Dense is the default, so the floors are lower than a keynote deck. Small text only works with strong hierarchy.

| Element | Dense slide | Light slide |
|---|---|---|
| Takeaway strip | 13 to 15 pt bold | n/a |
| Tracker labels | 11 to 12 pt bold | n/a |
| Pill / block header | 10.5 to 12 pt bold | n/a |
| Big number / stat | 22 to 34 pt bold | 60 pt+ |
| Body in blocks | **9.5 to 11 pt** (floor 9.5; captions, tags and sources 9) | 18 to 24 pt |
| Source / footnote | 9 pt italic muted | 12 pt |
| Statement text | n/a | 36 to 54 pt bold |

**Density budget per dense slide (user standard: as dense as possible)**
- **9 to 12 content regions**; content covers **~85% of the canvas** (see "Dense layout spec"). More than 12: split the slide.
- About **300 to 400 words** total, with a **sourced number or a graphic in every region**. Empty space inside a panel is a defect: fill it with evidence, never by enlarging boxes or fonts.
- Each text block 15 to 45 words. Sentences, not paragraphs. Prefer fragments with a bold key phrase.
- Every region carries a visual device: pill header, icon, number, chart, table, or mockup. A bare bulleted list in a bare box is a defect.
- If the user will present live rather than send as a pre-read, offer a lighter variant: split each poster into 2 slides and raise body text to 14 pt.

## Canvas, grid, spacing

- PPTX canvas 13.333 × 7.5 in (LAYOUT_WIDE). HTML canvas 1280 × 720 px, scaled to fit. Same proportions, so layouts transfer.
- Outer margin 0.35 in. Gutter between blocks 0.15 in. Panel corner radius 0.14 in. Pill radius = half its height.
- Align block edges to a shared grid: two columns (50/50 or 46/54), three columns, or four columns. Do not stagger edges by small amounts.
- Equal gutters everywhere. Uneven gaps read as accidents.
- Fill the frame. Large empty regions inside a panel mean the panel is oversized: shrink it or add the missing visual.

## Dense layout spec (default for PPTX; overrides the margins above)

Proven on the ArchitectOS problem slide. Build with `K.denseSlide`, `K.sec` and the other dense helpers in `deck_kit.js`.

| Element | Spec |
|---|---|
| Tracker | Thin tabs, 0.36 in tall at y 0.12, aligned to the content edges (`K.navCompact`) |
| Insight strip | 0.56 in at y 0.56: label block + claim (13 pt) + subline (9.5 pt) + CIRCLES chip (`K.insightStrip`) |
| Content area | y 1.2 → 7.22, x 0.35 → W − 0.47 (≈ 85% of the canvas) |
| Gutters | 0.1 in everywhere |
| Panels | Compact: soft pill 0.28 in / 10 pt, inner padding 0.12 in (`K.sec`) |
| Sources | Vertical, 9 pt italic, in the right margin (`K.sourcesVertical`) |
| Conclusion | Lives inside a region (e.g. the scorecard's gap row), not a separate full-width bar |

**No full-width bands for a single sentence** (e.g. a JTBD strip): fold small frameworks into an existing panel as a highlighted row.

## Poster-slide anatomy

Top to bottom:
1. **Tracker** (edge of slide). Active section in accent.
2. **Takeaway strip**: optional label pill (OBJECTIVE, INSIGHT, FOCUS, MVP, RISKS, NORTH STAR) + one sentence with 1 to 2 bold keywords. 13 to 15 pt.
3. **Body**: a 2 to 4 column grid of dashed panels. Left column usually holds the "what" (actions, concept, personas); right column the "so what" (evidence, risks, metrics).
4. **Source line** (9 pt italic, bottom-left) whenever a number appears. Placeholders say `Source: [add source]`.

## The tracker

Three interchangeable styles; pick one per deck and never mix:
- **tabs** (rounded tabs, top): best for 4 to 6 short labels; the cleanest and most modern. Default.
- **chevron** (arrow segments, top): best for process-like stories (Template B, C).
- **bottom** (pill bar, bottom): best for phase decks (Template D); put the rocket or a small icon next to the active label if wanted.

Rules: active = accent fill with primary text, others = primary fill with white text (bottom style: active = ink, bold, larger; others dimmed). Same labels, order and position on every poster slide. No more than 6 labels. Two-line labels are fine in chevron style.

## Containers and labels

- **Dashed panel** (1.25 pt primary dashed border, white fill, 0.14 in radius) groups related content. The default container.
- **Pill header straddling the panel's top edge** names the group (accent fill, primary text; or `soft` for secondary groups, `primary` for emphasis). Keep header text to 1 to 4 words.
- **Solid pale cards** (`primarySoft` or `accentSoft` fill, no dash) for callouts, personas, steps, benchmarks.
- **Objective strip**: accent label + primary bar, sentence in white with accent keywords.
- Do not use single-side accent borders, header bars as decoration, or lines under titles. The tracker is navigation, not ornament.

## Graphics: what goes in every region

Pick the lightest device that fits; vary them across the slide so it does not look like six copies of one box.

| Content | Device |
|---|---|
| A list of 3 to 6 capabilities/actions | icon-in-circle + bold label + one line |
| A sequence / causal chain | numbered steps with arrows |
| A share of a whole | donut with % in the centre |
| A comparison of values | native bar chart in primary |
| One striking number | stat circle or stat tile |
| A claim needing proof | evidence callout (dashed, accent-soft) with source |
| A person | persona card with avatar (initials circle if no image), quote, tags |
| An app screen | phone mockup with numbered callouts |
| Options vs criteria | matrix table with High / Moderate / Limited ratings |
| Risks | severity table, severity colour only in that cell |
| Time | arrow timeline with a column per phase |

**Graphic rules (user preferences):**
- **No line charts** unless there is real time-series data with numbers; schematic trend lines read as filler.
- **No decorative graphics.** Every graphic must argue something; a timeline or icon list that only restates text is a defect.
- Proven devices: **donut rings filled to a real %** for sourced stats (`K.statRings`), **concentric ripple rings** for impact spreading outward (`K.ripple`), an **alternatives scorecard** (✓/~/✕) for "why current options fail" (`K.scorecard`), an **illustrated metaphor** (e.g. iceberg) via a user-generated image in `K.imageSlot`.

**Information per square inch (user rule: graphics must not lower density).** A graphic earns its area only with data or text in it.
1. **Size to information**: a donut with one number is ~0.5 in; a 2×2 shrinks to its points or carries more of them.
2. **Labels on the graphic**: text inside bars, inside TAM rings, on ripple bands; no separate legends that duplicate space.
3. **Every shape carries content**: chevrons hold a description line, not one word; bars hold label + value; quadrants hold a one-line "so what".
4. **Annotate**: small callouts on graphics ("← we start here", "+3 hrs/wk") add meaning without boxes.
5. **Cut decoration**: no icon circles or avatars by default, no tile backgrounds around a single number; one compact row of figures beats four tiles.
6. **Graphic and explanation share a region**: text wraps around the graphic instead of sitting in a separate box.
7. **Check**: any graphic whose area is more than ~40% empty (no text or data) is a defect.

Icons: Lucide, flat, one colour from the theme, always inside a soft circle when next to text. Never mix icon sets. Images the user supplies (avatars, product photos, logos) go in rounded frames; never invent or fetch photos. If an avatar image is missing, use initials.

## Light slides (key moments)

Dark `primary` or light `surface` background, one idea, 36 to 54 pt statement with 1 to 2 accent words, optional kicker pill and one sub-line. Use for: question, breakdown, one "bet" statement, closing. Never put a light slide between two sections of a single story arc unless it is the statement that resolves that section.

## Beating the references

The reference decks are **inspiration for layout and visual devices only**. Never reproduce one slide for slide, and never copy their content. Every deck this skill makes should be clearly better than them on these points, where the references fall short:

| References often… | Ours always… |
|---|---|
| Cram text until it shrinks to 7–8 pt | Hold the 10 pt floor; cut words or split the slide instead |
| Let panel edges drift a few pixels | Snap every edge to the shared grid; equal gutters everywhere |
| Pile on accent colours and header styles | One accent, at most two header styles per slide, used with intent |
| Use a different visual style on every slide | Repeat geometry for repeated content so the reader learns it once |
| Mix icon sets, photos and 3D characters | One flat icon set in theme colours; photos only if the user supplies them |
| Fill the space with paragraphs | Fragments with 1–3 coloured keyphrases; narrative blocks of 3 lines or fewer |
| Present estimates as facts | Source every number; tag claims **Validated** or **Hypothesis** where relevant |
| Bury the answer | Takeaway strips that state the answer; tracker + strips retell the story alone |
| Rotate long text vertically | Rotate only short labels (4 words or fewer) |

Before delivering, check each slide against this table. If a reference does something better than a slide you built, borrow the idea and say so.

## Signature details (from the reference review)

The Hollow deck is the quality bar; these details are what separate it from the other three references. Use them on every poster slide.

- **Two header styles, used with intent.** Round pills straddling dashed panels (default) and **label blocks**: a yellow rectangle, corner radius ~0.06 in, with a soft drop shadow, sitting above a group ("Problem Validation", "Proposed Solution"). Use label blocks for the 1–2 main groups on a slide, pills for sub-panels.
- **Vertical rail labels.** A tall `primarySoft` rail with rotated primary text ("Why does it matter?") labels a whole row of panels and saves a header line. Use at most 2 per slide.
- **Narrative block.** A short paragraph framing the slide sits in a `primarySoft` rounded block (radius ~0.2 in, soft shadow), with 3–5 bold keyphrases. Prefer it to bullets for the "why" text.
- **Pull quote** at the top of a problem slide: one line, large curly quote marks in `primary`.
- **Product lockup.** Icon or logo, product name very large in `primary`, tagline beside or below it in `primaryMid`. It anchors the solution area.
- **Feature cards.** A dashed box with a large solid icon (no circle), the feature name in bold `primary`, a short inline subtitle, and a 2-line description.
- **Stat circles with a thick `primaryMid` ring**, in a row, each with a dashed caption box underneath that has 1–2 coloured keywords.
- **Conclusion bar** at the bottom of a dense slide: a yellow rounded bar, the "so what" in one or two lines, keyphrases bold. It sits beside the takeaway strip and does not repeat it.
- **Coloured keywords**, not just bold: key phrases inside body text go `primary` (bold or regular). Use 1–3 per block.
- **Subtle shadows** on label blocks, narrative blocks and conclusion bars only (offset ~2 pt, blur ~4 pt, ~20% opacity). Never on dashed panels.
- **Dotted vertical divider** between the two main columns when they hold different kinds of content (story vs evidence).
- **Sources rotated vertically** along the right edge when the bottom is full.
- **Active tracker tab may carry a small icon** next to its label.

From the second reference batch (Team Synapse video-commerce, Mars "Overview", Boredom text deck):

- **Two-line headline strip.** Line 1 is the claim with 1–2 keywords in accent (the answer, not the topic). Line 2 is the supporting evidence in a smaller `primary` subline ("video converts ~10× better, India just hit $14B festive sale…"). Use it when one strip has to carry both point and proof.
- **Stakeholder bands.** For multi-sided problems (customers / sellers / creators), stack full-width horizontal bands, each with its own label bar, and repeat the same column structure inside every band.
- **Row label badges.** An icon or illustration in a circle with a 1–2 word label ("Festive surge", "Engagement proof") at the left of each evidence row, so rows can be scanned by label alone.
- **Scale-of-opportunity strip.** A bottom row of 3 stat callouts that sizes the prize, with sources.
- **Failure-lesson callout.** "What went wrong elsewhere" (a competitor's failed attempt) in a callout with a `danger`-tinted border and a one-line "lesson for us". Pairs with competition slides.
- **Priority tiers.** Stacked HIGH / MEDIUM / LOW blocks in severity colours with icon labels either side, for prioritisation slides. Tier colours count as semantic, so they are allowed here.
- **Brand logos** as evidence anchors only when the user supplies them; otherwise a text chip with the company name.

Avoid what the weaker references show: walls of paragraph text with no containers (the Boredom text deck), white slides with plain coloured headings and no panels, header pills in extra hues (the Superstar deck's salmon and pink), a full gradient frame around every slide (Network Navigators), and photo or 3D-character clutter on the opener.

**Opener.** The competition references use a plain blue slide with the prompt question and highlighted name and ID boxes, because the organiser requires that format. Use that only when a competition requires it. For portfolio and interview decks, the opener is a dense executive-summary poster: the question in a header band, context, the case in N answers matching the tracker, at-a-glance stats, and an approach strip tagged Validated / Hypothesis.

## Deliberate departures from the pptx skill's defaults

The general pptx guidance sets 14 pt body text and warns against full-width bars. These decks intentionally differ because they are read as documents (case competitions, pre-reads), and the user asked for this density and tracker. Keep the other pptx rules: no text overflow, no overlapping, safe fonts, and validate before delivering (full render per build-pptx.md "Checks"). When the user says the deck will be presented live to an audience, move toward the lighter variant above.
