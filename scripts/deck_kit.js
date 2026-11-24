/**
 * deck_kit.js — pptxgenjs component kit for dense, PM-style "poster" decks.
 *
 * Usage:
 *   const { createDeck, loadTheme } = require('<skill>/scripts/deck_kit.js');
 *   const K = createDeck(loadTheme('<skill>/assets/themes/default-blue-yellow.json'), { title: '...' });
 *   const { slide, box } = K.contentSlide({ sections: [...], active: 0, takeaway: {...} });
 *   await K.save('/mnt/user-data/outputs/deck.pptx');
 *
 * Conventions
 *  - Canvas is 13.333 x 7.5 in (LAYOUT_WIDE). All x/y/w/h are inches.
 *  - Text accepts **double-asterisk** spans, rendered bold in the primary color.
 *  - Components that draw icons are async: ALWAYS `await` them.
 *  - Hex colors never carry '#'.
 */
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');

const W = 13.333;
const H = 7.5;
const M = 0.35; // outer margin on dense slides
const G = 0.15; // gutter between blocks

function loadTheme(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// mix two hex colors: t=0 -> a, t=1 -> b
function mix(a, b, t) {
  const pa = [0, 2, 4].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [0, 2, 4].map((i) => parseInt(b.slice(i, i + 2), 16));
  return pa
    .map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function createDeck(theme, meta = {}) {
  const c = theme.colors;
  const F = theme.fonts;
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = meta.title || 'Deck';
  pres.author = meta.author || '';
  pres.theme = { headFontFace: F.head, bodyFontFace: F.body };
  pres.defineSlideMaster({ title: 'PM_DARK', background: { color: c.primary } });
  pres.defineSlideMaster({ title: 'PM_LIGHT', background: { color: c.surface } });

  const K = { pres, theme, c, F, W, H, M, G, mix, warnings: [] };
  const iconCache = new Map();

  // ---------- text helpers ----------
  function rt(str, base = {}, hl = {}) {
    const parts = String(str).split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== '');
    return parts.map((p) =>
      p.startsWith('**') && p.endsWith('**')
        ? { text: p.slice(2, -2), options: { ...base, bold: true, color: hl.color || c.primary } }
        : { text: p, options: { ...base } }
    );
  }
  K.rt = rt;

  // crude overflow estimator: warns when text likely exceeds its box
  function estHeight(paras, w, size, paraAfter = 0, bullets = false) {
    const cpl = Math.max(4, Math.floor(((w - 0.1 - (bullets ? 0.17 : 0)) * 72) / (size * 0.5)));
    let lines = 0;
    paras.forEach((p) => {
      const len = String(p).replace(/\*\*/g, '').length;
      lines += Math.max(1, Math.ceil(len / cpl));
    });
    return (lines * size * 1.2 + paraAfter * Math.max(0, paras.length - 1)) / 72 + 0.08;
  }

  /** Text box. content: string or array of paragraph strings. */
  function text(slide, content, o) {
    const size = o.size || 10.5;
    if (size < 9 && !o.allowSmall) K.warnings.push(`font ${size}pt is below the 9pt floor: "${String(content).slice(0, 30)}"`);
    const base = {
      fontFace: o.font || F.body,
      fontSize: size,
      color: o.color || c.ink,
      bold: !!o.bold,
      italic: !!o.italic,
    };
    const paras = Array.isArray(content) ? content : [content];
    const runs = [];
    paras.forEach((p, i) => {
      const pr = rt(p, base, { color: o.hl });
      pr.forEach((r, j) => {
        if (o.bullets) r.options.bullet = { indent: 11 };
        if (o.paraAfter != null) r.options.paraSpaceAfter = o.paraAfter;
        if (j === pr.length - 1 && i < paras.length - 1) r.options.breakLine = true;
      });
      runs.push(...pr);
    });
    if (o.h && !o.noFitCheck) {
      const need = estHeight(paras, o.w, size, o.paraAfter || 0, !!o.bullets);
      if (need > o.h * 1.08) K.warnings.push(`possible overflow (need ~${need.toFixed(2)}in, box ${o.h.toFixed(2)}in): "${String(paras[0]).slice(0, 40)}"`);
    }
    slide.addText(runs, {
      x: o.x, y: o.y, w: o.w, h: o.h,
      align: o.align || 'left',
      valign: o.valign || 'top',
      margin: o.margin != null ? o.margin : 3,
      isTextBox: true,
      fit: 'none',
      rotate: o.rotate,
    });
  }
  K.text = text;

  // ---------- icons ----------
  async function iconData(name, color) {
    const key = name + color;
    if (iconCache.has(key)) return iconCache.get(key);
    const icons = require('react-icons/lu');
    const Comp = icons[name];
    if (!Comp) throw new Error(`Unknown Lucide icon "${name}" (use react-icons/lu names, e.g. LuRocket)`);
    let svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { size: '256', color: '#' + color }));
    svg = svg.replace(/currentColor/g, '#' + color);
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    const data = 'image/png;base64,' + buf.toString('base64');
    iconCache.set(key, data);
    return data;
  }

  /** Icon inside a soft circle. */
  async function iconBadge(slide, o) {
    const d = o.d || 0.55;
    slide.addShape(pres.shapes.OVAL, { x: o.x, y: o.y, w: d, h: d, fill: { color: o.fill || c.primarySoft }, line: { color: o.ring || c.primary, width: o.ring === false ? 0 : 1 } });
    const s = d * 0.52;
    slide.addImage({ data: await iconData(o.icon, o.color || c.primary), x: o.x + (d - s) / 2, y: o.y + (d - s) / 2, w: s, h: s });
  }
  async function icon(slide, o) {
    slide.addImage({ data: await iconData(o.icon, o.color || c.primary), x: o.x, y: o.y, w: o.size || 0.3, h: o.size || 0.3 });
  }
  K.iconBadge = iconBadge;
  K.icon = icon;

  // ---------- primitives ----------
  function pill(slide, o) {
    const h = o.h || 0.34;
    const v = o.variant || 'accent';
    const style = {
      accent: { fill: c.accent, color: c.primary, line: c.primary },
      primary: { fill: c.primary, color: 'FFFFFF', line: c.primary },
      soft: { fill: c.primarySoft, color: c.primary, line: c.primaryMid },
      white: { fill: 'FFFFFF', color: c.primary, line: c.primaryMid },
    }[v];
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: o.x, y: o.y, w: o.w, h, rectRadius: h / 2,
      fill: { color: style.fill }, line: { color: style.line, width: v === 'primary' ? 0 : 1 },
    });
    text(slide, o.text, { x: o.x, y: o.y, w: o.w, h, size: o.size || 11, bold: true, color: style.color, align: 'center', valign: 'middle', margin: 2, noFitCheck: true });
  }

  function panel(slide, o) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.radius != null ? o.radius : 0.14,
      fill: { color: o.fill || c.card },
      line: o.noLine ? { color: o.fill || c.card, width: 0 } : { color: o.color || c.primary, width: 1.25, dashType: o.dashed === false ? 'solid' : 'dash' },
    });
  }

  /** Dashed panel with a pill straddling its top edge. Returns the inner content box. */
  function section(slide, o) {
    const ph = 0.34;
    const top = o.y + ph / 2;
    panel(slide, { x: o.x, y: top, w: o.w, h: o.h - ph / 2, fill: o.fill, dashed: o.dashed, color: o.color });
    const pw = o.pillW || Math.min(o.w - 0.6, Math.max(1.6, String(o.title).length * 0.11 + 0.6));
    pill(slide, { x: o.x + (o.w - pw) / 2, y: o.y, w: pw, h: ph, text: o.title, variant: o.variant || 'accent', size: o.pillSize || 11 });
    return { x: o.x + 0.14, y: o.y + ph + 0.08, w: o.w - 0.28, h: o.h - ph - 0.18 };
  }

  /** Objective / takeaway strip: accent label + primary bar. */
  function objective(slide, o) {
    const h = o.h || 0.42;
    const lw = o.label ? o.labelW || 1.55 : 0;
    if (o.label) {
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: o.y, w: lw + 0.2, h, rectRadius: 0.1, fill: { color: c.accent }, line: { color: c.accent, width: 0 } });
      text(slide, o.label, { x: o.x, y: o.y, w: lw, h, size: 12, bold: true, color: c.primary, align: 'center', valign: 'middle', noFitCheck: true });
    }
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x + lw, y: o.y, w: o.w - lw, h, rectRadius: 0.1, fill: { color: c.primary }, line: { color: c.primary, width: 0 } });
    text(slide, o.text, { x: o.x + lw + 0.1, y: o.y, w: o.w - lw - 0.2, h, size: o.size || 13, bold: true, color: 'FFFFFF', hl: c.accent, align: 'center', valign: 'middle', noFitCheck: true });
  }

  function badge(slide, o) {
    const d = o.d || 0.3;
    slide.addShape(pres.shapes.OVAL, { x: o.x, y: o.y, w: d, h: d, fill: { color: o.fill || c.accent }, line: { color: o.line || c.primary, width: 1 } });
    text(slide, String(o.n), { x: o.x, y: o.y, w: d, h: d, size: o.size || 10, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
  }

  function vpill(slide, o) {
    // vertical pill: visible size vw (narrow) x vh (tall), text reads bottom-to-top
    const cx = o.x + o.vw / 2, cy = o.y + o.vh / 2;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx - o.vh / 2, y: cy - o.vw / 2, w: o.vh, h: o.vw, rectRadius: o.vw / 2, rotate: 270,
      fill: { color: o.variant === 'primary' ? c.primary : c.accent }, line: { color: c.primary, width: 1 },
    });
    text(slide, o.text, { x: cx - o.vh / 2, y: cy - o.vw / 2, w: o.vh, h: o.vw, size: o.size || 11, bold: true, color: o.variant === 'primary' ? 'FFFFFF' : c.primary, align: 'center', valign: 'middle', rotate: 270, margin: 0, noFitCheck: true });
  }
  K.pill = pill; K.panel = panel; K.section = section; K.objective = objective; K.badge = badge; K.vpill = vpill;

  // ---------- navigation tracker ----------
  /** Draws the section tracker. Returns the y-range left for content: { top, bottom }. */
  function nav(slide, o) {
    const n = o.sections.length;
    const style = o.style || 'chevron';
    if (style === 'chevron') {
      const h = 0.6, depth = 0.22, step = W / n;
      o.sections.forEach((label, i) => {
        const isA = i === o.active;
        const x = i === 0 ? 0 : i * step - depth * 0.35;
        const w = i === 0 ? step + depth * 0.5 : i === n - 1 ? W - x : step + depth * 0.5;
        slide.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, {
          x, y: 0, w, h, fill: { color: isA ? c.accent : c.primary }, line: { color: 'FFFFFF', width: 1.5 },
        });
        text(slide, label, { x: x + (i === 0 ? 0.1 : depth + 0.05), y: 0, w: w - depth - 0.2, h, size: 11, bold: true, color: isA ? c.primary : 'FFFFFF', align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
      });
      return { top: h + 0.12, bottom: H - 0.15 };
    }
    if (style === 'tabs') {
      const y = 0.14, h = 0.5, gap = 0.06, x0 = M, tw = (W - 2 * x0 - gap * (n - 1)) / n;
      o.sections.forEach((label, i) => {
        const isA = i === o.active, x = x0 + i * (tw + gap);
        slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: tw, h, rectRadius: 0.06, fill: { color: isA ? c.accent : c.primary }, line: { color: isA ? c.primary : c.primaryDark, width: 1 } });
        text(slide, label, { x, y, w: tw, h, size: 12, bold: true, color: isA ? c.primary : 'FFFFFF', align: 'center', valign: 'middle', noFitCheck: true });
      });
      return { top: y + h + 0.14, bottom: H - 0.15 };
    }
    // bottom: pill bar with the active label emphasised
    const h = 0.6, y = H - h - 0.12;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.2, y, w: W - 0.4, h, rectRadius: h / 2, fill: { color: c.accent }, line: { color: c.primary, width: 1.5 } });
    const dim = mix(c.accent, c.muted, 0.85), step = (W - 0.8) / n;
    o.sections.forEach((label, i) => {
      const isA = i === o.active;
      text(slide, label, { x: 0.4 + i * step, y, w: step, h, size: isA ? 14 : 12, bold: true, color: isA ? c.ink : dim, align: 'center', valign: 'middle', noFitCheck: true });
    });
    return { top: 0.2, bottom: y - 0.12 };
  }
  K.nav = nav;

  // ---------- slide factories ----------
  /** Dense "poster" slide: tracker + optional takeaway strip. Returns { slide, box }. */
  function contentSlide(o) {
    const slide = pres.addSlide({ masterName: 'PM_LIGHT' });
    if (o.notes) slide.addNotes(o.notes);
    const r = o.sections ? nav(slide, { sections: o.sections, active: o.active || 0, style: o.nav }) : { top: 0.2, bottom: H - 0.15 };
    let y = r.top, bottom = r.bottom;
    if (o.takeaway) {
      objective(slide, { x: M, y, w: W - 2 * M, label: o.takeaway.label, text: o.takeaway.text, h: o.takeaway.h || 0.42 });
      y += (o.takeaway.h || 0.42) + 0.14;
    }
    if (o.source) {
      text(slide, o.source, { x: M, y: bottom - 0.22, w: W - 2 * M, h: 0.22, size: 9, italic: true, color: c.muted, valign: 'middle', noFitCheck: true });
      bottom -= 0.26;
    }
    return { slide, box: { x: M, y, w: W - 2 * M, h: bottom - y } };
  }

  /** Light/dark "key moment" slide: one big statement. Words in **..** get the accent color. */
  function statementSlide(o) {
    const dark = o.dark !== false;
    const slide = pres.addSlide({ masterName: dark ? 'PM_DARK' : 'PM_LIGHT' });
    if (o.notes) slide.addNotes(o.notes);
    if (o.kicker) pill(slide, { x: 1.0, y: 1.5, w: Math.max(2, o.kicker.length * 0.13 + 0.6), text: o.kicker, variant: 'accent' });
    text(slide, o.text, { x: 1.0, y: 2.1, w: W - 2.0, h: 3.2, size: o.size || 38, bold: true, color: dark ? 'FFFFFF' : c.ink, hl: dark ? c.accent : c.primary, valign: 'middle', noFitCheck: true });
    if (o.sub) text(slide, o.sub, { x: 1.0, y: 5.4, w: W - 2.0, h: 0.9, size: 16, color: dark ? c.primaryMid : c.muted, noFitCheck: true });
    return slide;
  }

  /** Opening: the problem statement as a bold question. */
  function questionSlide(o) {
    const slide = pres.addSlide({ masterName: 'PM_DARK' });
    if (o.notes) slide.addNotes(o.notes);
    if (o.kicker) pill(slide, { x: 1.0, y: 1.0, w: Math.max(2, o.kicker.length * 0.13 + 0.6), text: o.kicker });
    text(slide, o.question, { x: 1.0, y: 1.7, w: W - 2.0, h: 3.6, size: o.size || 32, bold: true, color: 'FFFFFF', hl: c.accent, valign: 'middle', noFitCheck: true });
    if (o.byline) text(slide, o.byline, { x: 1.0, y: 5.7, w: 8, h: 1.2, size: 13, color: c.primaryMid, paraAfter: 3, noFitCheck: true });
    if (o.brand) text(slide, o.brand, { x: W - 4.0, y: H - 0.8, w: 3.4, h: 0.4, size: 12, bold: true, color: 'FFFFFF', align: 'right', noFitCheck: true });
    return slide;
  }

  /** Opening 2: the sub-questions, numbered. These become the tracker sections. */
  function breakdownSlide(o) {
    const slide = pres.addSlide({ masterName: 'PM_DARK' });
    if (o.notes) slide.addNotes(o.notes);
    const items = o.items, n = items.length;
    const avail = H - 1.6, rowH = Math.min(0.95, avail / n), top = (H - rowH * n) / 2;
    items.forEach((t, i) => {
      const y = top + i * rowH;
      badge(slide, { x: 1.0, y: y + rowH / 2 - 0.22, d: 0.44, n: i + 1, size: 13 });
      text(slide, t, { x: 1.7, y, w: W - 3.0, h: rowH, size: o.size || 20, bold: true, color: 'FFFFFF', hl: c.accent, valign: 'middle', noFitCheck: true });
    });
    return slide;
  }

  function closingSlide(o = {}) {
    const slide = pres.addSlide({ masterName: 'PM_DARK' });
    text(slide, o.title || 'Thank you', { x: 0.5, y: 2.4, w: W - 1, h: 1.6, size: 60, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', noFitCheck: true });
    if (o.sub) text(slide, o.sub, { x: 1.5, y: 4.2, w: W - 3, h: 1.0, size: 18, color: c.primaryMid, align: 'center', noFitCheck: true });
    return slide;
  }
  K.contentSlide = contentSlide; K.statementSlide = statementSlide; K.questionSlide = questionSlide; K.breakdownSlide = breakdownSlide; K.closingSlide = closingSlide;

  // ---------- content components ----------
  /** Evidence callout: a stat/claim with its source. */
  function evidence(slide, o) {
    const hasFill = o.fill !== false;
    panel(slide, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill === 'accent' ? c.accentSoft : hasFill ? c.card : c.surface, color: o.fill === 'accent' ? c.warning : c.primary });
    const srcH = o.source ? 0.2 : 0;
    text(slide, o.text, { x: o.x + 0.08, y: o.y + 0.05, w: o.w - 0.16, h: o.h - 0.1 - srcH, size: o.size || 10, valign: 'middle', italic: !!o.italic });
    if (o.source) text(slide, 'Source: ' + o.source, { x: o.x + 0.08, y: o.y + o.h - 0.27, w: o.w - 0.16, h: 0.22, size: 9, italic: true, color: c.muted, align: 'right', noFitCheck: true });
  }

  /** Big number with label. */
  function stat(slide, o) {
    panel(slide, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill || c.card, dashed: false, color: c.primaryMid });
    text(slide, o.value, { x: o.x, y: o.y + 0.04, w: o.w, h: o.h * 0.5, size: o.size || 26, bold: true, color: c.primary, align: 'center', valign: 'middle', noFitCheck: true });
    text(slide, o.label, { x: o.x + 0.08, y: o.y + o.h * 0.5, w: o.w - 0.16, h: o.h * 0.48, size: o.labelSize || 10, color: c.ink, align: 'center', valign: 'top' });
  }

  function statCircle(slide, o) {
    const d = o.d || 0.95;
    slide.addShape(pres.shapes.OVAL, { x: o.x, y: o.y, w: d, h: d, fill: { color: c.primary }, line: { color: c.primaryMid, width: 3 } });
    text(slide, o.value, { x: o.x, y: o.y, w: d, h: d, size: o.size || 17, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
  }

  /** Native doughnut with the % in the middle. */
  function donut(slide, o) {
    const d = o.d || 0.9;
    slide.addChart(pres.charts.DOUGHNUT, [{ name: o.label || 'v', labels: ['a', 'b'], values: [o.pct, 100 - o.pct] }], {
      x: o.x, y: o.y, w: d, h: d, holeSize: 66, chartColors: [c.primary, c.primaryMid],
      showLegend: false, showTitle: false, showLabel: false, showValue: false, showPercent: false,
      dataBorder: { pt: 1, color: 'FFFFFF' },
    });
    text(slide, o.pct + '%', { x: o.x, y: o.y, w: d, h: d, size: o.size || 10, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
  }

  /** Native bar chart in theme colours. */
  function barChart(slide, o) {
    slide.addChart(pres.charts.BAR, [{ name: o.name || 'Series', labels: o.labels, values: o.values }], {
      x: o.x, y: o.y, w: o.w, h: o.h, barDir: o.horizontal ? 'bar' : 'col', chartColors: [c.primary],
      showLegend: false, showTitle: !!o.title, title: o.title, titleFontSize: 11, titleColor: c.ink, titleFontFace: '+mn-lt',
      showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: c.ink, dataLabelFontSize: 10, dataLabelFontFace: '+mn-lt',
      catAxisLabelColor: c.ink, catAxisLabelFontSize: 10, catAxisLabelFontFace: '+mn-lt',
      valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, barGapWidthPct: 60,
    });
  }
  K.evidence = evidence; K.stat = stat; K.statCircle = statCircle; K.donut = donut; K.barChart = barChart;

  /** Avatar: initials circle, or a supplied image path. */
  function avatar(slide, o) {
    const d = o.d || 0.7;
    if (o.image) {
      slide.addImage({ path: o.image, x: o.x, y: o.y, w: d, h: d, rounding: true });
    } else {
      slide.addShape(pres.shapes.OVAL, { x: o.x, y: o.y, w: d, h: d, fill: { color: o.fill || c.primary }, line: { color: c.accent, width: 2 } });
      text(slide, o.initials, { x: o.x, y: o.y, w: d, h: d, size: d * 24, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
    }
  }

  /**
   * Persona card (zero-whitespace dense layout).
   * o: {x,y,w,h,name,meta,quote,stat?,baton?,blocks:[{label,items[]}],solution,image?,initials?}
   */
  function persona(slide, o) {
    panel(slide, { x: o.x, y: o.y, w: o.w, h: o.h, fill: c.accentSoft, color: c.warning, dashed: false });
    avatar(slide, { x: o.x + 0.1, y: o.y + 0.1, d: 0.56, image: o.image, initials: o.initials || o.name.split(' ').map((s) => s[0]).join('').slice(0, 2) });
    const tagW = o.baton ? 0.65 : 0;
    text(slide, o.name, { x: o.x + 0.74, y: o.y + 0.08, w: o.w - 0.84 - tagW, h: 0.28, size: 13, bold: true, color: c.primary, valign: 'middle', noFitCheck: true });
    if (o.baton) pill(slide, { x: o.x + o.w - 0.72, y: o.y + 0.1, w: 0.62, h: 0.22, text: o.baton, variant: 'primary', size: 9 });
    text(slide, o.meta, { x: o.x + 0.74, y: o.y + 0.36, w: o.w - 0.84, h: 0.3, size: 9.5, color: c.muted, noFitCheck: true });
    let y = o.y + 0.72;
    if (o.quote) {
      rrect(slide, { x: o.x + 0.1, y, w: o.w - 0.2, h: 0.42, fill: 'FFFFFF', line: c.primaryMid });
      text(slide, '“' + o.quote + '”', { x: o.x + 0.16, y, w: o.w - 0.32, h: 0.42, size: 9.5, italic: true, valign: 'middle' });
      y += 0.48;
    }
    const solH = o.solution ? 0.46 : 0;
    const avail = o.y + o.h - solH - 0.08 - y;
    const need = o.blocks.map((b) => 0.24 + b.items.length * 0.19 + 0.05);
    const total = need.reduce((a, b) => a + b, 0);
    if (total > avail * 1.05) K.warnings.push(`persona "${o.name}" needs ~${total.toFixed(2)}in for its blocks but only ${avail.toFixed(2)}in is available; give the card more height or cut items`);
    if (total < avail * 0.72) K.warnings.push(`persona "${o.name}" has >25% empty vertical space (${total.toFixed(2)}in used of ${avail.toFixed(2)}in); add a workflow/metric block or shrink card height`);
    o.blocks.forEach((b, i) => {
      const bh = need[i];
      pill(slide, { x: o.x + 0.1, y, w: Math.max(1.1, b.label.length * 0.085 + 0.3), h: 0.22, text: b.label, variant: 'primary', size: 9.5 });
      text(slide, b.items, { x: o.x + 0.1, y: y + 0.24, w: o.w - 0.2, h: bh - 0.24, size: 9.5, bullets: true });
      y += bh;
    });
    if (o.solution) {
      panel(slide, { x: o.x + 0.08, y: o.y + o.h - solH - 0.06, w: o.w - 0.16, h: solH, fill: c.primarySoft, color: c.primaryMid, dashed: false });
      text(slide, '**Implication / Wedge →** ' + o.solution, { x: o.x + 0.14, y: o.y + o.h - solH - 0.04, w: o.w - 0.28, h: solH - 0.04, size: 9.5, valign: 'middle' });
    }
  }
  K.avatar = avatar; K.persona = persona;

  /**
   * Problem / solution columns. o: {x,y,w,h,cols:[{title,problem,solution,icon?}]}
   * Left rail has vertical "Problems"/"Solutions" pills.
   */
  async function problemSolution(slide, o) {
    const rail = 0.4, n = o.cols.length;
    const cw = (o.w - rail - 0.1) / n;
    const th = 0.34, half = (o.h - th - 0.1) / 2;
    const y1 = o.y + th + 0.06, y2 = y1 + half + 0.06;
    vpill(slide, { x: o.x, y: y1, vw: rail - 0.05, vh: half, text: 'Problems', variant: 'primary' });
    vpill(slide, { x: o.x, y: y2, vw: rail - 0.05, vh: half, text: 'Solutions', variant: 'accent' });
    for (let i = 0; i < n; i++) {
      const col = o.cols[i], x = o.x + rail + 0.1 + i * cw;
      pill(slide, { x: x + 0.1, y: o.y, w: cw - 0.2, h: th, text: col.title, variant: 'accent', size: 10.5 });
      const iw = col.icon ? 0.62 : 0;
      text(slide, col.problem, { x: x + 0.1, y: y1, w: cw - 0.2 - iw, h: half - 0.04, size: 10 });
      text(slide, col.solution, { x: x + 0.1, y: y2, w: cw - 0.2 - iw, h: half - 0.04, size: 10 });
      if (col.icon) {
        await iconBadge(slide, { x: x + cw - 0.1 - 0.52, y: y1 + half / 2 - 0.26, d: 0.52, icon: col.icon, fill: c.primarySoft });
        await iconBadge(slide, { x: x + cw - 0.1 - 0.52, y: y2 + half / 2 - 0.26, d: 0.52, icon: col.solIcon || col.icon, fill: c.accentSoft, ring: c.warning });
      }
      if (i < n - 1) slide.addShape(pres.shapes.LINE, { x: x + cw, y: y1, w: 0, h: 2 * half + 0.06, line: { color: c.primaryMid, width: 1, dashType: 'dash' } });
    }
    slide.addShape(pres.shapes.LINE, { x: o.x + rail + 0.1, y: y1 + half + 0.03, w: o.w - rail - 0.1, h: 0, line: { color: c.primaryMid, width: 1, dashType: 'dash' } });
  }
  K.problemSolution = problemSolution;

  // ---------- tables ----------
  function sevCell(level) {
    const map = { high: c.danger, medium: c.warning, low: c.positive };
    const col = map[String(level).toLowerCase()] || c.muted;
    return { text: level, options: { bold: true, align: 'center', color: mix(col, '000000', 0.25), fill: { color: mix(col, 'FFFFFF', 0.82) } } };
  }
  K.sevCell = sevCell;

  /**
   * Generic styled table (capped row height so tables never stretch with ugly blank whitespace).
   * o: {x,y,w,colW[] (scaled to w),header[],rows[][],size?,firstCol?:'soft'|'none',h?,rowH?,footer?}
   * A cell is a string (supports **bold**) or { text, options }.
   */
  function table(slide, o) {
    const size = o.size || 9.5;
    const base = { fontFace: F.body, fontSize: size, color: c.ink, valign: 'middle' };
    const hdr = o.header.map((h) => ({ text: h, options: { ...base, bold: true, color: 'FFFFFF', fill: { color: c.primary }, align: 'center', fontSize: size + 0.5 } }));
    const body = o.rows.map((r, ri) =>
      r.map((cell, ci) => {
        const obj = typeof cell === 'object' && cell !== null && !Array.isArray(cell);
        const t = obj ? cell.text : cell;
        const own = obj ? cell.options || {} : {};
        const fill = ci === 0 && o.firstCol !== 'none' ? c.primarySoft : ri % 2 ? c.surface : 'FFFFFF';
        return { text: typeof t === 'string' ? rt(t, { ...base, ...(own.bold ? { bold: true } : {}) }) : t, options: { ...base, fill: { color: fill }, bold: ci === 0 && o.firstCol !== 'none', ...own } };
      })
    );
    const sum = o.colW.reduce((a, b) => a + b, 0);
    const colW = o.colW.map((v) => (v * o.w) / sum);
    const footH = o.footer ? 0.30 : 0;
    const availH = o.h ? o.h - footH - (o.footer ? 0.04 : 0) : null;
    const hdrH = 0.28;
    let rowH = o.rowH;
    if (availH) {
      const rawRowH = (availH - hdrH) / o.rows.length;
      if (rawRowH > 0.46) K.warnings.push(`table at (${o.x.toFixed(1)},${o.y.toFixed(1)}) has tall stretched rows (${rawRowH.toFixed(2)}in/row for ${o.rows.length} rows); add more data rows or attach a footer`);
      const capped = Math.min(0.42, rawRowH);
      rowH = [hdrH, ...o.rows.map(() => capped)];
    }
    slide.addTable([hdr, ...body], {
      x: o.x, y: o.y, w: o.w, colW, rowH, margin: [0.02, 0.05, 0.02, 0.05],
      border: { type: 'solid', pt: 0.75, color: c.primaryMid },
    });
    if (o.footer && o.h) {
      const fy = o.y + o.h - footH;
      rrect(slide, { x: o.x, y: fy, w: o.w, h: footH, r: 0.06, fill: c.accentSoft, line: c.accent });
      text(slide, o.footer, { x: o.x + 0.08, y: fy, w: o.w - 0.16, h: footH, size: 9, valign: 'middle', noFitCheck: true });
    }
  }
  K.table = table;

  /** Metric card (tightly packed: name, baton tag, formula, desc, benchmark, target, guardrail). */
  function metricCard(slide, o) {
    const x = o.x, y = o.y, w = o.w;
    panel(slide, { x, y: y + 0.15, w, h: o.h - 0.15, fill: c.card, color: c.primaryMid, dashed: false });
    pill(slide, { x: x + 0.08, y, w: w - 0.16, h: 0.30, text: o.name, variant: 'primary', size: 10.5 });
    let cy = y + 0.36;
    if (o.baton) {
      pill(slide, { x: x + 0.1, y: cy, w: w - 0.2, h: 0.20, text: o.baton, variant: 'soft', size: 9 });
      cy += 0.24;
    }
    if (o.formula) {
      rrect(slide, { x: x + 0.08, y: cy, w: w - 0.16, h: 0.34, fill: c.primarySoft });
      text(slide, o.formula, { x: x + 0.12, y: cy, w: w - 0.24, h: 0.34, size: 10, bold: true, color: c.primary, align: 'center', valign: 'middle', font: 'Cambria', noFitCheck: true });
      cy += 0.38;
    }
    if (o.desc) {
      text(slide, o.desc, { x: x + 0.1, y: cy, w: w - 0.2, h: 0.42, size: 9.5, align: 'center', valign: 'middle' });
      cy += 0.45;
    }
    if (o.benchmark) {
      panel(slide, { x: x + 0.08, y: cy, w: w - 0.16, h: 0.40, fill: c.accentSoft, color: c.warning, dashed: false });
      text(slide, '**Benchmark:** ' + o.benchmark, { x: x + 0.12, y: cy, w: w - 0.24, h: 0.40, size: 9.5, valign: 'middle' });
      cy += 0.44;
    }
    if (o.target) {
      const remH = Math.max(0.36, o.y + o.h - cy - 0.08);
      panel(slide, { x: x + 0.08, y: cy, w: w - 0.16, h: remH, fill: c.card, color: c.danger });
      text(slide, o.target, { x: x + 0.12, y: cy, w: w - 0.24, h: remH, size: 9.5, valign: 'middle', align: 'center' });
    }
  }
  K.metricCard = metricCard;

  /** Timeline arrow with labelled segments. Returns column geometry for content below. */
  function timeline(slide, o) {
    const n = o.phases.length, h = o.h || 0.6;
    slide.addShape(pres.shapes.RIGHT_ARROW, { x: o.x, y: o.y, w: o.w, h, fill: { color: c.primarySoft }, line: { color: c.primaryMid, width: 1 } });
    const cw = (o.w - 0.4) / n, cols = [];
    o.phases.forEach((p, i) => {
      const x = o.x + 0.1 + i * cw;
      text(slide, [`**${p.label}**`, ...(p.sub ? [p.sub] : [])], { x, y: o.y, w: cw, h, size: 10.5, align: 'center', valign: 'middle', noFitCheck: true });
      cols.push({ x: x + 0.05, w: cw - 0.1 });
    });
    return cols;
  }

  /** Numbered step chain. o: {x,y,w,h,items:[string]} */
  function steps(slide, o) {
    const n = o.items.length, gap = 0.3, bw = (o.w - gap * (n - 1)) / n;
    o.items.forEach((t, i) => {
      const x = o.x + i * (bw + gap);
      panel(slide, { x, y: o.y + 0.2, w: bw, h: o.h - 0.2, fill: c.accentSoft, color: c.warning, dashed: false });
      text(slide, t, { x: x + 0.06, y: o.y + 0.26, w: bw - 0.12, h: o.h - 0.3, size: 10, bold: true, color: c.primary, align: 'center', valign: 'middle' });
      badge(slide, { x: x - 0.06, y: o.y, n: i + 1, d: 0.34 });
      if (i < n - 1) slide.addShape(pres.shapes.RIGHT_ARROW, { x: x + bw + 0.03, y: o.y + o.h / 2 + 0.02, w: gap - 0.06, h: 0.2, fill: { color: c.primary }, line: { color: c.primary, width: 0 } });
    });
  }
  K.timeline = timeline; K.steps = steps;

  /** Phone mockup. Returns the inner screen box. */
  function phone(slide, o) {
    const w = o.h * 0.48, r = w * 0.13;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: o.y, w, h: o.h, rectRadius: r, fill: { color: c.ink }, line: { color: c.ink, width: 0 } });
    const inset = 0.07;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x + inset, y: o.y + inset, w: w - 2 * inset, h: o.h - 2 * inset, rectRadius: r * 0.75, fill: { color: o.screen || 'FFFFFF' }, line: { color: o.screen || 'FFFFFF', width: 0 } });
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x + w * 0.35, y: o.y + inset + 0.05, w: w * 0.3, h: 0.1, rectRadius: 0.05, fill: { color: c.ink }, line: { color: c.ink, width: 0 } });
    return { x: o.x + inset + 0.05, y: o.y + inset + 0.28, w: w - 2 * inset - 0.1, h: o.h - 2 * inset - 0.4, outerW: w };
  }
  /** Numbered callout box (title + text) with a badge. */
  function callout(slide, o) {
    panel(slide, { x: o.x, y: o.y, w: o.w, h: o.h, fill: c.primarySoft, color: c.primaryMid, dashed: false });
    badge(slide, { x: o.x - 0.1, y: o.y - 0.1, n: o.n, d: 0.3 });
    text(slide, [`**${o.title}**`, ...(Array.isArray(o.body) ? o.body : [o.body])], { x: o.x + 0.2, y: o.y + 0.12, w: o.w - 0.3, h: o.h - 0.16, size: o.size || 9.5, paraAfter: 2 });
  }
  K.phone = phone; K.callout = callout;

  // =====================================================================
  // DENSE LAYOUT KIT (proven on the ArchitectOS problem slide)
  // Thin tabs, compact insight strip, 0.1in gutters, compact panels,
  // sources running vertically in the right margin. Content ≈ 85% of canvas.
  // =====================================================================
  const R = W - 0.47;          // content right edge; the margin holds vertical sources
  const GD = 0.1;              // dense gutter
  const DENSE = { top: 1.2, bottom: 7.22 };
  K.R = R; K.GD = GD; K.DENSE = DENSE;

  /** Fresh shadow object every call (pptxgenjs mutates shadow objects in place). */
  const shadow = () => ({ type: 'outer', blur: 4, offset: 2, angle: 45, color: '000000', opacity: 0.2 });
  K.shadow = shadow;

  /** Straight line between two points (handles direction via flipV). */
  function seg(slide, x1, y1, x2, y2, line) {
    slide.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (x2 - x1) * (y2 - y1) < 0, line });
  }
  /** Rounded rect. o: {x,y,w,h,fill,line?,lw?,dash?,r?,shadow?} */
  function rrect(slide, o) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r || 0.08, fill: { color: o.fill }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color: o.fill, width: 0 }, shadow: o.shadow ? shadow() : undefined });
  }
  function circle(slide, cx, cy, d, fill, line, lw = 1) {
    slide.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: fill }, line: line ? { color: line, width: lw } : { color: fill, width: 0 } });
  }
  K.seg = seg; K.rrect = rrect; K.circle = circle;

  /** Compact section: dashed panel + small soft pill (0.28in). Returns inner box. */
  function sec(slide, o) {
    const ph = 0.28;
    panel(slide, { x: o.x, y: o.y + ph / 2, w: o.w, h: o.h - ph / 2, fill: o.fill });
    const pw = Math.min(o.w - 0.32, o.pillW || String(o.title).length * 0.082 + 0.36);
    pill(slide, { x: o.x + (o.w - pw) / 2, y: o.y, w: pw, h: ph, text: o.title, variant: o.variant || 'soft', size: 10 });
    return { x: o.x + 0.12, y: o.y + ph + 0.08, w: o.w - 0.24, h: o.h - ph - 0.16 };
  }
  K.sec = sec;

  /** Thin tracker tabs (0.36in) aligned to the dense content edges. */
  function navCompact(slide, sections, active) {
    const y = 0.12, h = 0.36, gap = 0.06, tw = (R - M - gap * (sections.length - 1)) / sections.length;
    sections.forEach((l, i) => {
      const x = M + i * (tw + gap), on = i === active;
      rrect(slide, { x, y, w: tw, h, r: 0.06, fill: on ? c.accent : c.primary });
      text(slide, l, { x, y, w: tw, h, size: 11, bold: true, color: on ? c.primary : 'FFFFFF', align: 'center', valign: 'middle', noFitCheck: true });
    });
  }
  K.navCompact = navCompact;

  /** Compact two-line insight strip (0.56in): label block, claim (13pt) + subline (9.5pt), optional chip (e.g. CIRCLES step). */
  function insightStrip(slide, o) {
    const y = 0.56, h = 0.56, lw = 1.15;
    rrect(slide, { x: M, y, w: lw, h, r: 0.08, fill: c.accent });
    text(slide, o.label || 'INSIGHT', { x: M, y, w: lw - 0.08, h, size: 11, bold: true, color: c.primary, align: 'center', valign: 'middle', noFitCheck: true });
    const bx = M + lw - 0.08, bw = R - bx, tw = o.chip ? bw - 1.8 : bw - 0.3;
    rrect(slide, { x: bx, y, w: bw, h, r: 0.08, fill: c.primary });
    text(slide, o.line1, { x: bx + 0.16, y: y + 0.04, w: tw, h: 0.28, size: 13, bold: true, color: 'FFFFFF', hl: c.accent, valign: 'middle', noFitCheck: true });
    if (o.line2) text(slide, o.line2, { x: bx + 0.16, y: y + 0.31, w: tw, h: 0.22, size: 9.5, color: c.primaryMid, hl: c.accent, valign: 'middle', noFitCheck: true });
    if (o.chip) pill(slide, { x: R - 1.55, y: y + (h - 0.28) / 2, w: 1.42, h: 0.28, text: o.chip, variant: 'soft', size: 9.5 });
  }
  K.insightStrip = insightStrip;

  /** Vertical source line in the right margin. */
  function sourcesVertical(slide, str) {
    const len = DENSE.bottom - DENSE.top, sw = 0.3, cx = W - 0.25, cy = DENSE.top + len / 2;
    text(slide, str, { x: cx - len / 2, y: cy - sw / 2, w: len, h: sw, size: 9, italic: true, color: c.muted, align: 'center', valign: 'middle', rotate: 270, margin: 0, noFitCheck: true });
  }
  K.sourcesVertical = sourcesVertical;

  /**
   * Dense poster slide: thin tabs + compact insight strip + vertical sources.
   * o: {sections, active, insight:{label,line1,line2,chip}, sources, notes}
   * Returns { slide, box } where box is the content area (y 1.2 → 7.22, x M → R).
   */
  function denseSlide(o) {
    const slide = pres.addSlide({ masterName: 'PM_LIGHT' });
    if (o.notes) slide.addNotes(o.notes);
    if (o.sections) navCompact(slide, o.sections, o.active || 0);
    if (o.insight) insightStrip(slide, o.insight);
    if (o.sources) sourcesVertical(slide, o.sources);
    return { slide, box: { x: M, y: DENSE.top, w: R - M, h: DENSE.bottom - DENSE.top } };
  }
  K.denseSlide = denseSlide;

  /** Donut ring filled to a real percentage (shapes only, Canva-safe). Verified: 25/50/75% render exactly. */
  function donutRing(slide, cx, cy, d, pct, label, o = {}) {
    slide.addShape(pres.shapes.BLOCK_ARC, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, angleRange: [0, 359.9], arcThicknessRatio: 0.26, fill: { color: c.primarySoft }, line: { color: c.primarySoft, width: 0 } });
    slide.addShape(pres.shapes.BLOCK_ARC, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, angleRange: [270, (270 + pct * 3.6) % 360], arcThicknessRatio: 0.26, fill: { color: o.color || c.primary }, line: { color: o.color || c.primary, width: 0 } });
    text(slide, label, { x: cx - d / 2, y: cy - 0.15, w: d, h: 0.3, size: o.size || 12, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
  }
  K.donutRing = donutRing;

  /**
   * Stat strip of donut rings: o: {x,y,w,h, stats:[[pct,label,caption,source]]}. Captions support **bold**.
   */
  function statRings(slide, o) {
    const cellW = o.w / o.stats.length, dd = Math.min(0.78, o.h);
    o.stats.forEach(([p, lab, cap, src], i) => {
      const x = o.x + i * cellW;
      if (i) seg(slide, x - 0.04, o.y + 0.04, x - 0.04, o.y + o.h - 0.04, { color: c.primarySoft, width: 1 });
      donutRing(slide, x + 0.06 + dd / 2, o.y + o.h / 2, dd, p, lab);
      text(slide, cap, { x: x + dd + 0.14, y: o.y, w: cellW - dd - 0.2, h: o.h - 0.2, size: 9, valign: 'middle', noFitCheck: true });
      if (src) text(slide, src, { x: x + dd + 0.14, y: o.y + o.h - 0.2, w: cellW - dd - 0.2, h: 0.2, size: 9, italic: true, color: c.muted, noFitCheck: true });
    });
  }
  K.statRings = statRings;

  /**
   * Concentric ripple rings (impact spreading outward) with a numbered legend.
   * o: {x,y,w,h, items:[[name, metric, desc]]} (inner → outer, up to 4).
   */
  function ripple(slide, o) {
    const n = o.items.length, rmax = Math.min(1.03, o.h / 2), rr = o.items.map((_, i) => rmax * (i + 1) / n);
    const cx = o.x + rmax, cy = o.y + o.h / 2;
    const fills = [c.primary, mix(c.primary, c.primaryMid, 0.55), c.primaryMid, c.primarySoft];
    for (let i = n - 1; i >= 0; i--) circle(slide, cx, cy, rr[i] * 2, fills[i] || c.primarySoft, i === n - 1 ? c.primaryMid : 'FFFFFF', 1.25);
    rr.forEach((r, i) => {
      // markers spread around the rings at different angles so they never bunch
      const mid = i === 0 ? 0 : (rr[i - 1] + r) / 2, ang = (-35 + i * 35) * Math.PI / 180;
      const mx = cx + mid * Math.cos(ang), my = cy + mid * Math.sin(ang);
      circle(slide, mx, my, 0.22, c.accent, c.primary, 1);
      text(slide, String(i + 1), { x: mx - 0.11, y: my - 0.11, w: 0.22, h: 0.22, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
    });
    const lx = cx + rmax + 0.16, lw = o.x + o.w - lx, rh = o.h / n;
    o.items.forEach(([name, metric, desc], i) => {
      const y = o.y + i * rh;
      circle(slide, lx + 0.1, y + 0.16, 0.2, c.accent, c.primary, 1);
      text(slide, String(i + 1), { x: lx, y: y + 0.06, w: 0.2, h: 0.2, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0, noFitCheck: true });
      text(slide, name, { x: lx + 0.26, y: y + 0.04, w: lw - 0.26, h: 0.24, size: 9.5, bold: true, color: c.primary, valign: 'middle', noFitCheck: true });
      text(slide, `**${metric}** ${desc}`, { x: lx + 0.26, y: y + 0.27, w: lw - 0.26, h: rh - 0.3, size: 9, valign: 'top', noFitCheck: true });
    });
  }
  K.ripple = ripple;

  /**
   * Alternatives scorecard: rows of options × criteria with ✓ / ~ / ✕ cells. Async (icons).
   * o: {x,y,w,h, cols:[..], rows:[[icon,name,['y'|'n'|'p',...]]], footnote?}
   */
  async function scorecard(slide, o) {
    const labW = o.labW || 1.2, colW = (o.w - labW) / o.cols.length, hdrH = 0.3, footH = o.footnote === false ? 0 : 0.2;
    const srh = (o.h - hdrH - footH - 0.04) / o.rows.length;
    o.cols.forEach((t, j) => text(slide, t, { x: o.x + labW + j * colW, y: o.y, w: colW, h: hdrH, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle', noFitCheck: true }));
    const cell = { y: ['✓', c.positive], n: ['✕', c.danger], p: ['~', c.warning] };
    for (let i = 0; i < o.rows.length; i++) {
      const [ic, name, vals] = o.rows[i], y = o.y + hdrH + i * srh;
      await iconBadge(slide, { x: o.x, y: y + (srh - 0.24) / 2, d: 0.24, icon: ic });
      text(slide, name, { x: o.x + 0.28, y, w: labW - 0.3, h: srh, size: 9.5, bold: true, color: c.primary, valign: 'middle', noFitCheck: true });
      vals.forEach((v, j) => {
        const [sym, col] = cell[v], x = o.x + labW + j * colW;
        rrect(slide, { x: x + 0.04, y: y + 0.04, w: colW - 0.08, h: srh - 0.08, fill: mix(col, 'FFFFFF', 0.82) });
        text(slide, sym, { x, y, w: colW, h: srh, size: 14, bold: true, color: mix(col, '000000', 0.3), align: 'center', valign: 'middle', noFitCheck: true });
      });
    }
    if (footH) text(slide, o.footnote || '✓ yes · ~ partial · ✕ no · ratings are draft judgements', { x: o.x, y: o.y + o.h - footH, w: o.w, h: footH, size: 9, italic: true, color: c.muted, align: 'center', noFitCheck: true });
  }
  K.scorecard = scorecard;

  /** Image slot for a user-supplied illustration (e.g. a Gemini iceberg): places the file if found, else a labelled placeholder. */
  function imageSlot(slide, o) {
    if (o.path && fs.existsSync(o.path)) slide.addImage({ path: o.path, x: o.x, y: o.y, w: o.w, h: o.h, sizing: { type: 'contain', w: o.w, h: o.h } });
    else {
      rrect(slide, { x: o.x, y: o.y, w: o.w, h: o.h, fill: c.primarySoft, line: c.primaryMid, dash: 'dash' });
      text(slide, o.label || 'Image slot', { x: o.x, y: o.y + o.h / 2 - 0.2, w: o.w, h: 0.4, size: 9, color: c.muted, align: 'center', valign: 'middle', noFitCheck: true });
    }
  }
  K.imageSlot = imageSlot;

  /**
   * Anchored Implication / Decision Footer Bar inside a panel (eliminates bottom whitespace).
   * Takes the inner box returned by K.sec and mutates/returns the remaining upper box.
   * o: {box, text, h?:0.28, variant?:'accent'|'soft'}
   */
  function footerBar(slide, o) {
    const fh = o.h || 0.28, b = o.box;
    const fy = b.y + b.h - fh;
    const isAcc = o.variant === 'accent';
    rrect(slide, { x: b.x, y: fy, w: b.w, h: fh, r: 0.06, fill: isAcc ? c.accentSoft : c.primarySoft, line: isAcc ? c.accent : c.primaryMid });
    text(slide, o.text, { x: b.x + 0.08, y: fy, w: b.w - 0.16, h: fh, size: 9.5, valign: 'middle', noFitCheck: true });
    return { x: b.x, y: b.y, w: b.w, h: b.h - fh - 0.06 };
  }
  K.footerBar = footerBar;

  /**
   * Compact Baton Carryover Badge ([D1], [P1], [Solves P1], [M1], [Tracks M1]).
   * o: {x, y, w?, h?:0.20, code, variant?:'primary'|'accent'|'soft'}
   */
  function batonPill(slide, o) {
    const h = o.h || 0.20;
    const w = o.w || Math.max(0.48, String(o.code).length * 0.08 + 0.18);
    pill(slide, { x: o.x, y: o.y, w, h, text: o.code, variant: o.variant || 'primary', size: 9 });
    return w;
  }
  K.batonPill = batonPill;

  /**
   * High-density Score-Bar Table (for RICE, Segment Selection, Channel Economics, or Pain Scoring).
   * Renders rows with inline horizontal score bars, baton badges, and an optional anchored footer.
   * o: {x, y, w, h, cols:[{label, w, type?:'text'|'bar'|'badge'}], rows:[[cell,...]], maxScore?:100, footer?}
   */
  function scoreTable(slide, o) {
    const footH = o.footer ? 0.28 : 0;
    const hdrH = 0.28;
    const availH = o.h - footH - hdrH - (o.footer ? 0.04 : 0);
    const rh = availH / o.rows.length;
    const sumW = o.cols.reduce((a, c2) => a + (c2.w || 1), 0);
    const colW = o.cols.map((c2) => ((c2.w || 1) * o.w) / sumW);
    let cx = o.x;
    rrect(slide, { x: o.x, y: o.y, w: o.w, h: hdrH, r: 0.05, fill: c.primary });
    o.cols.forEach((col, j) => {
      text(slide, col.label, { x: cx + 0.04, y: o.y, w: colW[j] - 0.08, h: hdrH, size: 9.5, bold: true, color: 'FFFFFF', align: col.type === 'text' ? 'left' : 'center', valign: 'middle', noFitCheck: true });
      cx += colW[j];
    });
    const maxS = o.maxScore || 100;
    o.rows.forEach((r, i) => {
      const ry = o.y + hdrH + i * rh;
      const isHighlight = r.highlight;
      const cells = Array.isArray(r) ? r : r.cells;
      rrect(slide, { x: o.x, y: ry, w: o.w, h: rh, r: 0.03, fill: isHighlight ? c.accentSoft : i % 2 ? c.surface : 'FFFFFF', line: isHighlight ? c.accent : c.primarySoft, lw: isHighlight ? 1.25 : 0.5 });
      let rx = o.x;
      cells.forEach((val, j) => {
        const cw = colW[j], col = o.cols[j];
        if (col.type === 'bar') {
          const num = typeof val === 'object' ? val.score : Number(val) || 0;
          const lab = typeof val === 'object' && val.label ? val.label : String(val);
          const barMaxW = cw - 0.16, bh = Math.min(0.20, rh - 0.06);
          const fillW = Math.max(0.12, Math.min(1, num / maxS) * barMaxW);
          rrect(slide, { x: rx + 0.08, y: ry + (rh - bh) / 2, w: barMaxW, h: bh, r: bh / 2, fill: c.primarySoft });
          rrect(slide, { x: rx + 0.08, y: ry + (rh - bh) / 2, w: fillW, h: bh, r: bh / 2, fill: isHighlight ? c.primary : c.primaryMid });
          text(slide, lab, { x: rx + 0.08, y: ry, w: barMaxW, h: rh, size: 9, bold: true, color: isHighlight && num >= 50 ? 'FFFFFF' : c.ink, align: 'center', valign: 'middle', noFitCheck: true });
        } else if (col.type === 'badge') {
          const bw = Math.min(cw - 0.1, Math.max(0.5, String(val).length * 0.08 + 0.16));
          pill(slide, { x: rx + (cw - bw) / 2, y: ry + (rh - 0.2) / 2, w: bw, h: 0.2, text: String(val), variant: isHighlight ? 'accent' : 'soft', size: 9 });
        } else {
          text(slide, String(val), { x: rx + 0.06, y: ry, w: cw - 0.12, h: rh, size: 9.5, bold: j === 0 || isHighlight, color: j === 0 ? c.primary : c.ink, valign: 'middle', noFitCheck: true });
        }
        rx += cw;
      });
    });
    if (o.footer) {
      const fy = o.y + o.h - footH;
      rrect(slide, { x: o.x, y: fy, w: o.w, h: footH, r: 0.06, fill: c.primarySoft, line: c.primaryMid });
      text(slide, o.footer, { x: o.x + 0.08, y: fy, w: o.w - 0.16, h: footH, size: 9.5, valign: 'middle', noFitCheck: true });
    }
  }
  K.scoreTable = scoreTable;

  /**
   * Dense 2x2 Prioritisation Matrix with shaded winning quadrant, quadrant headers, plotted data bubbles, and footer.
   * o: {x, y, w, h, xAxis, yAxis, quads:[TL, TR, BL, BR], points:[{code, label, x:0..1, y:0..1, metric?, win?}], footer?}
   */
  function matrix2x2(slide, o) {
    const footH = o.footer ? 0.28 : 0;
    const axisW = 0.22, axisH = 0.20;
    const gx = o.x + axisW, gy = o.y, gw = o.w - axisW, gh = o.h - axisH - footH - (o.footer ? 0.04 : 0);
    const hw = gw / 2, hh = gh / 2;
    // 4 quadrants: TL (0), TR (1 - default winning quadrant), BL (2), BR (3)
    const qCoords = [
      [gx, gy, c.surface, false],
      [gx + hw, gy, c.accentSoft, true],
      [gx, gy + hh, c.surface, false],
      [gx + hw, gy + hh, c.primarySoft, false],
    ];
    qCoords.forEach(([qx, qy, fill, isWin], i) => {
      rrect(slide, { x: qx + 0.02, y: qy + 0.02, w: hw - 0.04, h: hh - 0.04, r: 0.06, fill, line: isWin ? c.accent : c.primaryMid, lw: isWin ? 1.5 : 0.75 });
      if (o.quads && o.quads[i]) {
        text(slide, o.quads[i], { x: qx + 0.06, y: qy + 0.03, w: hw - 0.12, h: 0.18, size: 8.5, allowSmall: true, bold: true, color: isWin ? c.primary : c.muted, align: i % 2 ? 'right' : 'left', noFitCheck: true });
      }
    });
    // axes labels
    text(slide, o.yAxis || 'Severity / Impact ↑', { x: o.x + axisW / 2 - gh / 2, y: gy + gh / 2 - axisW / 2, w: gh, h: axisW, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle', rotate: 270, margin: 0, noFitCheck: true });
    text(slide, o.xAxis || 'Frequency / Urgency →', { x: gx, y: gy + gh, w: gw, h: axisH, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle', noFitCheck: true });
    // Group points by quadrant and stack or place cleanly so 3 points fit in a quadrant without overlap
    const byQuad = [[], [], [], []];
    (o.points || []).forEach((pt) => {
      const qi = (pt.y >= 0.5 ? 0 : 2) + (pt.x >= 0.5 ? 1 : 0);
      byQuad[qi].push(pt);
    });
    byQuad.forEach((pts, qi) => {
      if (!pts.length) return;
      const qx0 = qi % 2 ? gx + hw : gx;
      const qy0 = qi < 2 ? gy : gy + hh;
      const topPad = 0.22, botPad = 0.04, availQH = hh - topPad - botPad;
      const gap = 0.03;
      const bh = Math.min(0.34, (availQH - gap * (pts.length - 1)) / pts.length);
      pts.forEach((pt, idx) => {
        const isW = pt.win !== false && qi === 1;
        const bw = hw - 0.14;
        const bx = qx0 + 0.07;
        const by = pts.length === 1
          ? qy0 + topPad + (availQH - bh) * (1 - (pt.y % 0.5) * 2) * 0.5
          : qy0 + topPad + idx * (bh + gap);
        rrect(slide, { x: bx, y: by, w: bw, h: bh, r: 0.05, fill: isW ? c.primary : 'FFFFFF', line: isW ? c.accent : c.primary, lw: 1.1 });
        const line1 = (pt.code ? `**[${pt.code}]** ` : '') + pt.label;
        text(slide, pt.metric ? `${line1} · ${pt.metric}` : line1, {
          x: bx + 0.04, y: by, w: bw - 0.08, h: bh,
          size: 8.5, allowSmall: true, bold: isW, color: isW ? 'FFFFFF' : c.ink, hl: isW ? c.accent : c.primary, align: 'center', valign: 'middle', noFitCheck: true,
        });
      });
    });
    if (o.footer) {
      const fy = o.y + o.h - footH;
      rrect(slide, { x: o.x, y: fy, w: o.w, h: footH, r: 0.06, fill: c.primarySoft, line: c.primaryMid });
      text(slide, o.footer, { x: o.x + 0.08, y: fy, w: o.w - 0.16, h: footH, size: 9.5, valign: 'middle', noFitCheck: true });
    }
  }
  K.matrix2x2 = matrix2x2;

  /** Write the file and push the palette into the PowerPoint theme. */
  K.save = async function (file) {
    await pres.writeFile({ fileName: file });
    const candidates = [process.env.PPTX_SKILL_DIR && process.env.PPTX_SKILL_DIR + '/scripts/apply_theme.js', '/mnt/skills/public/pptx/scripts/apply_theme.js'].filter(Boolean);
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const { applyTheme } = require(p);
        await applyTheme(file, {
          name: theme.name, headFontFace: F.head, bodyFontFace: F.body,
          colors: { dk1: c.ink, lt1: 'FFFFFF', dk2: c.primaryDark, lt2: c.surface, accent1: c.primary, accent2: c.accent, accent3: c.primaryMid, accent4: c.positive, accent5: c.warning, accent6: c.danger, hlink: c.primary, folHlink: c.muted },
        });
        break;
      }
    }
    if (K.warnings.length) console.warn('\nKit warnings:\n - ' + K.warnings.join('\n - '));
    return file;
  };

  return K;
}

module.exports = { createDeck, loadTheme, mix, W, H, M, G };
