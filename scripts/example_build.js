const fs = require('fs');
const path = require('path');
const SKILL = 'C:/Users/colos/.claude/skills/pm-deck-designer';
const { createDeck, loadTheme } = require(path.join(SKILL, 'scripts/deck_kit.js'));
const LU = require('react-icons/lu');
const theme = loadTheme(path.join(SKILL, 'assets/themes/indigo-coral.json'));
const K = createDeck(theme, { title: 'ArchitectOS: Product & GTM Case', author: 'Nidhish Javvadi' });
const { pres, c, M, W } = K;
const OUT = process.env.OUT || 'C:/Users/colos/OneDrive/Desktop/resumes/ArchitectOS_deck.pptx';
const ASSETS = 'C:/Users/colos/OneDrive/Desktop/resumes';
const SECTIONS = ['Problem', 'Users', 'Solution', 'Go-to-market', 'Metrics'];
const R = W - 0.47;            // content right edge (sources run vertically in the margin)
const G = 0.1;                 // gutter

// ---------- helpers ----------
const ic = (...names) => names.find((n) => LU[n]) || 'LuCircle';
const sh = () => ({ type: 'outer', blur: 4, offset: 2, angle: 45, color: '000000', opacity: 0.2 });
const T = (s, t, o) => K.text(s, t, { noFitCheck: true, ...o });
function seg(s, x1, y1, x2, y2, line) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (x2 - x1) * (y2 - y1) < 0, line });
}
function rrect(s, o) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r || 0.08, fill: { color: o.fill }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color: o.fill, width: 0 }, shadow: o.shadow ? sh() : undefined });
}
function circle(s, cx, cy, d, fill, line, lw = 1) {
  s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: fill }, line: line ? { color: line, width: lw } : { color: fill, width: 0 } });
}
// compact section: dashed panel + small soft pill; returns inner box
function sec(s, o) {
  const ph = 0.28;
  K.panel(s, { x: o.x, y: o.y + ph / 2, w: o.w, h: o.h - ph / 2 });
  const pw = o.pillW || String(o.title).length * 0.085 + 0.4;
  K.pill(s, { x: o.x + (o.w - pw) / 2, y: o.y, w: pw, h: ph, text: o.title, variant: 'soft', size: 10 });
  return { x: o.x + 0.12, y: o.y + ph + 0.08, w: o.w - 0.24, h: o.h - ph - 0.16 };
}
function tabs(s, active) {
  const y = 0.12, h = 0.36, gap = 0.06, tw = (R - M - gap * (SECTIONS.length - 1)) / SECTIONS.length;
  SECTIONS.forEach((l, i) => {
    const x = M + i * (tw + gap), on = i === active;
    rrect(s, { x, y, w: tw, h, r: 0.06, fill: on ? c.accent : c.primary });
    T(s, l, { x, y, w: tw, h, size: 11, bold: true, color: on ? c.primary : 'FFFFFF', align: 'center', valign: 'middle' });
  });
}
function insightStrip(s, o) {
  const y = 0.56, h = 0.56, lw = 1.15;
  rrect(s, { x: M, y, w: lw, h, r: 0.08, fill: c.accent });
  T(s, o.label, { x: M, y, w: lw - 0.08, h, size: 11, bold: true, color: c.primary, align: 'center', valign: 'middle' });
  const bx = M + lw - 0.08, bw = R - bx;
  rrect(s, { x: bx, y, w: bw, h, r: 0.08, fill: c.primary });
  T(s, o.line1, { x: bx + 0.16, y: y + 0.04, w: bw - 1.8, h: 0.28, size: 13, bold: true, color: 'FFFFFF', hl: c.accent, valign: 'middle' });
  T(s, o.line2, { x: bx + 0.16, y: y + 0.31, w: bw - 1.8, h: 0.22, size: 9.5, color: c.primaryMid, valign: 'middle' });
  K.pill(s, { x: R - 1.55, y: y + (h - 0.28) / 2, w: 1.42, h: 0.28, text: o.chip, variant: 'soft', size: 9.5 });
  return y + h;
}
function donut(s, cx, cy, d, pct, label) {
  s.addShape(pres.shapes.BLOCK_ARC, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, angleRange: [0, 359.9], arcThicknessRatio: 0.26, fill: { color: c.primarySoft }, line: { color: c.primarySoft, width: 0 } });
  const end = (270 + pct * 3.6) % 360;
  s.addShape(pres.shapes.BLOCK_ARC, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, angleRange: [270, end], arcThicknessRatio: 0.26, fill: { color: c.primary }, line: { color: c.primary, width: 0 } });
  T(s, label, { x: cx - d / 2, y: cy - 0.15, w: d, h: 0.3, size: 12, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0 });
}
function findImage(re) {
  const f = fs.readdirSync(ASSETS).find((n) => re.test(n) && /\.(png|jpe?g|webp)$/i.test(n));
  return f ? path.join(ASSETS, f) : null;
}

(async () => {
  const { slide: s } = K.contentSlide({
    notes: 'Problem slide. Left: my Svamaan story, discovery signal, root cause (iceberg). Middle: the problem framed with JTBD and scope, then who else it hurts (ripple). Strip: sourced validation. Right: why every workaround fails, the gap, and a teaser of ArchitectOS.\n\nSources: Xia et al., "Measuring Program Comprehension", IEEE TSE 2017 (58% of time on comprehension) https://xin-xia.github.io/publication/TSE17.pdf · Atlassian State of Developer Experience 2024 (2 in 3 lose 8+ hrs/week; 41% cite insufficient docs) https://www.atlassian.com/blog/developer/developer-experience-report-2024 · Stack Overflow Developer Survey 2024 (61% search 30+ min/day; 30% hit knowledge silos 10+ times/week) https://survey.stackoverflow.co/2024/professional-developers · Google Q1 2025 earnings call (30%+ of new code AI-generated).' });
  tabs(s, 0);
  insightStrip(s, { label: 'INSIGHT', chip: 'C · Comprehend',
    line1: 'Codebases grow faster than anyone can understand them, so **new engineers stall**',
    line2: 'AI now writes 30%+ of Google’s new code; understanding it is the bottleneck' });

  const y0 = 1.2, r1b = 3.2, vY = 3.3, vB = 4.6, r3 = 4.7, BOT = 7.22;
  const xA = M, wA = 4.1, xB = xA + wA + G, wB = 4.3, xC = xB + wB + G, wC = R - xC;

  // ================= A1: hook + discovery signal =================
  T(s, '“', { x: xA - 0.02, y: y0 - 0.16, w: 0.4, h: 0.55, size: 36, bold: true, color: c.primary, font: 'Arial' });
  T(s, 'I had **[__ weeks]** to automate a 5-stage underwriting workflow in a codebase I had never seen.', { x: xA + 0.36, y: y0, w: wA - 0.36, h: 0.42, size: 10.5, italic: true, valign: 'middle' });
  T(s, '— Me, AI & Analytics Intern at Svamaan Financial', { x: xA + 0.36, y: y0 + 0.42, w: wA - 0.36, h: 0.18, size: 9, color: c.muted });
  const dy = y0 + 0.7, dh = r1b - dy, bd = 0.92;
  circle(s, xA + bd / 2, dy + 0.06 + bd / 2, bd, c.primary, c.primaryMid, 3);
  T(s, '[5]', { x: xA, y: dy + 0.2, w: bd, h: 0.32, size: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0 });
  T(s, 'discovery sessions', { x: xA + 0.08, y: dy + 0.5, w: bd - 0.16, h: 0.36, size: 9, color: 'FFFFFF', align: 'center', valign: 'top', margin: 0 });
  T(s, 'alumni & PMs', { x: xA - 0.05, y: dy + bd + 0.1, w: bd + 0.1, h: 0.18, size: 9, color: c.muted, align: 'center' });
  const qx = xA + bd + 0.14, qw = wA - bd - 0.14, qh = (dh - 0.12) / 3;
  for (let i = 0; i < 3; i++) {
    const y = dy + i * (qh + 0.06);
    rrect(s, { x: qx, y, w: qw, h: qh, fill: c.primarySoft });
    T(s, '“[Quote backing the problem]” — [Role]', { x: qx + 0.08, y, w: qw - 0.16, h: qh, size: 9.5, italic: true, valign: 'middle' });
  }

  // ================= B1: problem statement (JTBD + scope) =================
  const pb = sec(s, { x: xB, y: y0, w: wB, h: r1b - y0, title: 'Problem statement & scope', pillW: 2.35 });
  const jh = 0.4;
  rrect(s, { x: pb.x, y: pb.y, w: pb.w, h: jh, fill: c.accentSoft, line: c.accent });
  K.pill(s, { x: pb.x + 0.06, y: pb.y + (jh - 0.22) / 2, w: 0.5, h: 0.22, text: 'JTBD', variant: 'primary', size: 9 });
  T(s, 'When I **join a new codebase**, I want to **see how it fits** so I can **ship confidently**', { x: pb.x + 0.62, y: pb.y, w: pb.w - 0.66, h: jh, size: 9.5, valign: 'middle' });
  const prows = [
    [ic('LuUsers'), 'Who', 'Hires, interns, new owners', '→ slide 2'],
    [ic('LuTriangleAlert', 'LuAlertTriangle'), 'Problem', 'No system view → **[__ wks]**', 'Seen at Svamaan'],
    [ic('LuTrendingDown'), 'Impact', 'Slow delivery, **₹[__]**/hire', '[__] hrs/wk seniors'],
    [ic('LuListChecks', 'LuClipboardList'), 'Assumptions', '[__]k+ lines, thin docs', 'Test in pilots'],
    [ic('LuBan'), 'Out of scope', 'Writing code; doc tools', 'Focus: understanding'],
  ];
  const py0 = pb.y + jh + 0.04, prh = (pb.y + pb.h - py0) / prows.length, tagW = 1.18;
  for (let i = 0; i < prows.length; i++) {
    const [icon, lab, t, tg] = prows[i], y = py0 + i * prh;
    if (i) seg(s, pb.x, y, pb.x + pb.w, y, { color: c.primarySoft, width: 1 });
    await K.iconBadge(s, { x: pb.x, y: y + (prh - 0.2) / 2, d: 0.2, icon });
    T(s, lab, { x: pb.x + 0.25, y, w: 0.85, h: prh, size: 9.5, bold: true, color: c.primary, valign: 'middle' });
    T(s, t, { x: pb.x + 1.1, y, w: pb.w - 1.1 - tagW - 0.04, h: prh, size: 9.5, valign: 'middle' });
    K.pill(s, { x: pb.x + pb.w - tagW, y: y + (prh - 0.2) / 2, w: tagW, h: 0.2, text: tg, variant: 'white', size: 9 });
  }

  // ================= validation strip (A+B) =================
  const vb = sec(s, { x: xA, y: vY, w: wA + G + wB, h: vB - vY, title: 'Problem validation · what the research says', pillW: 3.4 });
  const stats = [
    [58, '58%', 'of developer time goes to **understanding** code, not writing it', 'Xia et al. ’17'],
    [67, '2 in 3', 'developers lose **8+ hrs a week** to inefficiencies', 'Atlassian ’24'],
    [61, '61%', 'spend **30+ min a day** searching for answers', 'Stack Overflow ’24'],
    [30, '30%', 'hit **knowledge silos 10+ times** a week', 'Stack Overflow ’24'],
  ];
  const cellW = vb.w / stats.length, dd = Math.min(0.78, vb.h);
  stats.forEach(([p, lab, cap, src], i) => {
    const x = vb.x + i * cellW;
    if (i) seg(s, x - 0.04, vb.y + 0.04, x - 0.04, vb.y + vb.h - 0.04, { color: c.primarySoft, width: 1 });
    donut(s, x + 0.06 + dd / 2, vb.y + vb.h / 2, dd, p, lab);
    T(s, cap, { x: x + dd + 0.14, y: vb.y, w: cellW - dd - 0.2, h: vb.h - 0.2, size: 9, valign: 'middle' });
    T(s, src, { x: x + dd + 0.14, y: vb.y + vb.h - 0.2, w: cellW - dd - 0.2, h: 0.2, size: 9, italic: true, color: c.muted });
  });

  // ================= A3: 5 Whys iceberg =================
  const ib = sec(s, { x: xA, y: r3, w: wA, h: BOT - r3, title: '5 Whys · Iceberg', pillW: 1.7 });
  const fh = ib.h, fw = fh * 0.5625, wl = ib.y + 0.2 * fh;
  const img = findImage(/iceberg/i);
  if (img) s.addImage({ path: img, x: ib.x, y: ib.y, w: fw, h: fh, sizing: { type: 'contain', w: fw, h: fh } });
  else {
    rrect(s, { x: ib.x, y: ib.y, w: fw, h: fh, fill: c.primarySoft, line: c.primaryMid, dash: 'dash' });
    T(s, 'Iceberg image (Gemini)', { x: ib.x, y: ib.y + fh / 2 - 0.2, w: fw, h: 0.4, size: 9, color: c.muted, align: 'center', valign: 'middle' });
  }
  const lx = ib.x + fw + 0.12, lwid = ib.x + ib.w - lx;
  seg(s, ib.x + fw, wl, ib.x + ib.w, wl, { color: c.primaryMid, width: 1, dashType: 'dash' });
  T(s, '**Symptom:** weeks to a first shipped change', { x: lx, y: ib.y, w: lwid, h: wl - ib.y, size: 9.5, valign: 'middle' });
  const whys = ['**Why 1:** can’t see how the system fits', '**Why 2:** docs missing or out of date', '**Why 3:** code outpaces doc updates', '**Why 4:** docs are manual and unowned', '**Root:** knowledge lives in heads, not code'];
  const rh = (ib.y + ib.h - wl) / whys.length;
  whys.forEach((t, i) => {
    const yc = wl + rh * (i + 0.5), root = i === whys.length - 1;
    if (root) rrect(s, { x: lx - 0.06, y: yc - rh / 2 + 0.03, w: lwid + 0.06, h: rh - 0.06, fill: c.accentSoft, line: c.accent });
    seg(s, ib.x + fw + 0.02, yc, lx - 0.08, yc, { color: c.primaryMid, width: 1, dashType: 'sysDot' });
    T(s, t, { x: lx, y: yc - rh / 2, w: lwid - 0.04, h: rh, size: 9.5, valign: 'middle' });
  });

  // ================= B3: ripple of pain (concentric rings) =================
  const rb = sec(s, { x: xB, y: r3, w: wB, h: BOT - r3, title: 'Ripple of pain · it spreads outward', pillW: 2.75 });
  const rr = [0.3, 0.55, 0.8, Math.min(1.03, rb.h / 2)], ccx = rb.x + rr[3], ccy = rb.y + rb.h / 2;
  const ringFill = [c.primary, K.mix(c.primary, c.primaryMid, 0.55), c.primaryMid, c.primarySoft];
  for (let i = 3; i >= 0; i--) circle(s, ccx, ccy, rr[i] * 2, ringFill[i], i === 3 ? c.primaryMid : 'FFFFFF', 1.25);
  const mx = [ccx, ccx + (rr[0] + rr[1]) / 2, ccx + (rr[1] + rr[2]) / 2, ccx + (rr[2] + rr[3]) / 2];
  mx.forEach((x, i) => {
    circle(s, x, ccy, 0.22, c.accent, c.primary, 1);
    T(s, String(i + 1), { x: x - 0.11, y: ccy - 0.11, w: 0.22, h: 0.22, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0 });
  });
  const who = [
    ['New hire', '[__ wks]', 'to first change'],
    ['Senior engineer', '[__] hrs/wk', 'on repeat Qs'],
    ['Eng manager', '[__] wks', 'roadmap slip'],
    ['Company', '₹[__]', 'lost per hire'],
  ];
  const lx2 = ccx + rr[3] + 0.16, lw2 = rb.x + rb.w - lx2, wrh = rb.h / who.length;
  who.forEach(([name, metric, desc], i) => {
    const y = rb.y + i * wrh;
    circle(s, lx2 + 0.1, y + 0.16, 0.2, c.accent, c.primary, 1);
    T(s, String(i + 1), { x: lx2, y: y + 0.06, w: 0.2, h: 0.2, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle', margin: 0 });
    T(s, name, { x: lx2 + 0.26, y: y + 0.04, w: lw2 - 0.26, h: 0.24, size: 9.5, bold: true, color: c.primary, valign: 'middle' });
    T(s, `**${metric}** ${desc}`, { x: lx2 + 0.26, y: y + 0.27, w: lw2 - 0.26, h: wrh - 0.3, size: 9, valign: 'top' });
  });

  // ================= C1: alternatives scorecard =================
  const sb = sec(s, { x: xC, y: y0, w: wC, h: vB - y0 + 0.02, title: 'Why today’s options fail', pillW: 2.2 });
  const cols = ['Fast', 'Accurate', 'System view', 'Scales'];
  const rows = [
    [ic('LuUser'), 'Ask a senior', ['n', 'y', 'y', 'n']],
    [ic('LuHandshake', 'LuUsers'), 'Onboarding buddy', ['p', 'y', 'p', 'n']],
    [ic('LuFileText'), 'Read the docs', ['y', 'n', 'p', 'y']],
    [ic('LuMessageSquare'), 'Ask AI chat', ['y', 'p', 'n', 'y']],
    [ic('LuSearch'), 'Search & guess', ['n', 'n', 'n', 'p']],
  ];
  const labW = 1.2, colW = (sb.w - labW) / cols.length, hdrH = 0.34, footH = 0.2;
  const srh = (sb.h - hdrH - footH - 0.04) / rows.length;
  cols.forEach((t, j) => T(s, t, { x: sb.x + labW + j * colW, y: sb.y, w: colW, h: hdrH, size: 9, bold: true, color: c.primary, align: 'center', valign: 'middle' }));
  const cell = { y: ['✓', c.positive], n: ['✕', c.danger], p: ['~', c.warning] };
  for (let i = 0; i < rows.length; i++) {
    const [icon, name, vals] = rows[i], y = sb.y + hdrH + i * srh;
    await K.iconBadge(s, { x: sb.x, y: y + (srh - 0.24) / 2, d: 0.24, icon });
    T(s, name, { x: sb.x + 0.28, y, w: labW - 0.3, h: srh, size: 9.5, bold: true, color: c.primary, valign: 'middle' });
    vals.forEach((v, j) => {
      const [sym, col] = cell[v], x = sb.x + labW + j * colW;
      rrect(s, { x: x + 0.04, y: y + 0.04, w: colW - 0.08, h: srh - 0.08, fill: K.mix(col, 'FFFFFF', 0.82) });
      T(s, sym, { x, y, w: colW, h: srh, size: 14, bold: true, color: K.mix(col, '000000', 0.3), align: 'center', valign: 'middle' });
    });
  }
  T(s, '✓ yes · ~ partial · ✕ no · ratings are draft judgements', { x: sb.x, y: sb.y + sb.h - footH, w: sb.w, h: footH, size: 9, italic: true, color: c.muted, align: 'center' });

  // ================= C2: gap + conclusion =================
  const gy = r3, gh = 0.72;
  rrect(s, { x: xC, y: gy, w: wC, h: gh, fill: c.accentSoft, line: c.accent, lw: 1.5, shadow: true });
  T(s, '**Gap:** none is fast, accurate **and** shows the whole system. **The code has to explain itself.**', { x: xC + 0.12, y: gy, w: wC - 0.24, h: gh, size: 10, align: 'center', valign: 'middle' });

  // ================= C3: ArchitectOS teaser =================
  const tb = sec(s, { x: xC, y: gy + gh + G, w: wC, h: BOT - (gy + gh + G), title: 'Coming up · the fix', pillW: 1.7 });
  const gw = 1.05, nodes = [[0.5, 0.18], [0.15, 0.5], [0.85, 0.45], [0.35, 0.85], [0.75, 0.88], [0.5, 0.52]];
  const NP = ([fx, fy]) => [tb.x + fx * gw, tb.y + 0.02 + fy * (tb.h * 0.62)];
  [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [1, 3], [2, 4]].forEach(([a, b]) => { const [x1, y1] = NP(nodes[a]), [x2, y2] = NP(nodes[b]); seg(s, x1, y1, x2, y2, { color: c.primaryMid, width: 1.5 }); });
  nodes.forEach((n, i) => { const [x, y] = NP(n); circle(s, x, y, i === 5 ? 0.26 : 0.16, i === 5 ? c.accent : c.primary, 'FFFFFF', 1); });
  T(s, 'ArchitectOS', { x: tb.x + gw + 0.12, y: tb.y, w: tb.w - gw - 0.12, h: 0.34, size: 16, bold: true, color: c.primary, valign: 'middle', font: 'Arial' });
  T(s, 'See any codebase as a **system**, not a file tree', { x: tb.x + gw + 0.12, y: tb.y + 0.34, w: tb.w - gw - 0.12, h: 0.36, size: 9.5, valign: 'top' });
  const feats = [[ic('LuScanSearch', 'LuSearch'), 'Scan'], [ic('LuNetwork', 'LuWorkflow', 'LuGitFork'), 'Map'], [ic('LuSparkles', 'LuWandSparkles'), 'Explain']];
  const fy = tb.y + tb.h - 0.3, fwid = (tb.w - 0.1) / 3;
  for (let i = 0; i < feats.length; i++) {
    const x = tb.x + i * fwid;
    rrect(s, { x, y: fy, w: fwid - 0.06, h: 0.3, fill: c.primarySoft });
    await K.icon(s, { x: x + 0.08, y: fy + 0.06, size: 0.18, icon: feats[i][0] });
    T(s, feats[i][1], { x: x + 0.3, y: fy, w: fwid - 0.4, h: 0.3, size: 9.5, bold: true, color: c.primary, valign: 'middle' });
  }

  // ================= sources (vertical, right margin) =================
  const sl = 6.6, sw = 0.3, scx = W - 0.25, scy = y0 + (BOT - y0) / 2;
  T(s, 'Sources: Xia et al., IEEE TSE 2017 · Atlassian State of DevEx 2024 · Stack Overflow Developer Survey 2024 · Google Q1 2025 earnings call. [__] = to fill; scorecard ratings are draft judgements.',
    { x: scx - sl / 2, y: scy - sw / 2, w: sl, h: sw, size: 9, italic: true, color: c.muted, align: 'center', valign: 'middle', rotate: 270, margin: 0 });

  await K.save(OUT);
  console.log('saved', OUT, img ? 'with image ' + img : '(iceberg placeholder)');
})();
