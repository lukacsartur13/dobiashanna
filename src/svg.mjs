// Every drawing on the site is generated here, as plain SVG strings.
// One coordinate language throughout: the garden plan is 1 unit = 5 cm.

const f = n => Math.round(n * 10) / 10;
const P = ([x, y]) => `${f(x)},${f(y)}`;

// Deterministic randomness, so a rebuild never reshuffles the planting.
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The tree / shrub plan symbol: a circle with a scalloped edge.
export function scallop(cx, cy, r, n = 12, b = 1.16) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2;
    const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
    const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    const c = [cx + r * b * Math.cos(am), cy + r * b * Math.sin(am)];
    if (i === 0) d += `M${P(p0)}`;
    d += ` Q${P(c)} ${P(p1)}`;
  }
  return d + 'Z';
}

function tree(cx, cy, r, cls = 'tree') {
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    return `<line class="ln-hair" x1="${f(cx + r * 0.18 * Math.cos(a))}" y1="${f(cy + r * 0.18 * Math.sin(a))}" x2="${f(cx + r * 0.78 * Math.cos(a))}" y2="${f(cy + r * 0.78 * Math.sin(a))}"/>`;
  }).join('');
  return `<g class="${cls}">
    <path class="canopy fl" d="${scallop(cx, cy, r, Math.round(r / 4.2) + 6)}"/>
    <path class="ln" d="${scallop(cx, cy, r, Math.round(r / 4.2) + 6)}"/>
    ${spokes}
    <line class="ln-hair" x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}"/><line class="ln-hair" x1="${cx}" y1="${cy - 5}" x2="${cx}" y2="${cy + 5}"/>
  </g>`;
}

function shrub(cx, cy, r) {
  return `<path class="shrub fl" d="${scallop(cx, cy, r, 7, 1.22)}"/><path class="ln-thin" d="${scallop(cx, cy, r, 7, 1.22)}"/>`;
}

function dimH(x1, x2, y, label) {
  return `<g class="dim">
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>
    <line x1="${x1 - 3}" y1="${y + 3}" x2="${x1 + 3}" y2="${y - 3}"/><line x1="${x2 - 3}" y1="${y + 3}" x2="${x2 + 3}" y2="${y - 3}"/>
    <line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 5}"/><line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 5}"/>
    <rect class="dim-bg nd" x="${(x1 + x2) / 2 - 17}" y="${y - 6}" width="34" height="12"/>
    <text class="t t-dim" x="${(x1 + x2) / 2}" y="${y + 3}" text-anchor="middle">${label}</text>
  </g>`;
}
function dimV(x, y1, y2, label) {
  const cy = (y1 + y2) / 2;
  return `<g class="dim">
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/>
    <line x1="${x - 3}" y1="${y1 + 3}" x2="${x + 3}" y2="${y1 - 3}"/><line x1="${x - 3}" y1="${y2 + 3}" x2="${x + 3}" y2="${y2 - 3}"/>
    <rect class="dim-bg nd" x="${x - 6}" y="${cy - 17}" width="12" height="34"/>
    <text class="t t-dim" x="${x}" y="${cy}" text-anchor="middle" transform="rotate(-90 ${x} ${cy}) translate(0 3)">${label}</text>
  </g>`;
}
function level(x, y, label) {
  return `<g class="lvl"><path class="ln-thin" d="M${x - 5} ${y - 8} H${x + 5} L${x} ${y} Z"/><line class="ln-thin" x1="${x}" y1="${y}" x2="${x + 34}" y2="${y}"/><text class="t t-dim" x="${x + 8}" y="${y - 3}">${label}</text></g>`;
}

// ---------------------------------------------------------------- THE PLAN
// One garden, drawn as four separable sheets. The homepage hero shows them
// fused; the scroll stage pulls them apart.
const LAWN = 'M255 290 C 250 250 300 245 340 262 C 390 284 430 250 480 255 C 540 262 585 300 580 360 C 575 420 520 440 470 420 C 420 400 380 430 330 420 C 280 410 260 340 255 290 Z';
const POND = 'M430 120 C 440 88 500 84 530 104 C 562 126 548 166 510 173 C 470 181 418 152 430 120 Z';
const PATH = 'M240 232 C 330 238 345 330 410 360 S 525 430 568 540';

export function planLayers(t) {
  const r = rng(7);

  const base = `
    <rect class="paper-bg nd" x="0" y="0" width="800" height="600"/>
    <rect class="frame" x="8" y="8" width="784" height="584"/>
    <line class="frame" x1="650" y1="8" x2="650" y2="592"/>
    <rect class="boundary nd" x="40" y="40" width="580" height="520"/>
    <rect class="house-fill fl nd" x="60" y="55" width="220" height="130"/>
    <rect class="ln-bold" x="60" y="55" width="220" height="130"/>
    <rect class="dim-bg nd" x="126" y="110" width="88" height="22"/>
    <text class="t t-lg" x="170" y="125" text-anchor="middle">${t.house}</text>
    <text class="t t-xs" x="330" y="588" text-anchor="middle">${t.street}</text>
    <g class="tb">
      <path class="ln" d="${scallop(674, 39, 13, 9)}"/><line class="ln-hair" x1="670" y1="39" x2="678" y2="39"/><line class="ln-hair" x1="674" y1="35" x2="674" y2="43"/>
      <text class="t t-b" x="695" y="36">DÓBIÁS</text><text class="t t-b" x="695" y="49">HANNA</text>
      ${t.tb.map(([k, v], i) => `<line class="frame" x1="650" y1="${70 + i * 44}" x2="792" y2="${70 + i * 44}"/><text class="t t-xs" x="662" y="${86 + i * 44}">${k}</text><text class="t t-v" x="662" y="${104 + i * 44}">${v}</text>`).join('')}
      <line class="frame" x1="650" y1="290" x2="792" y2="290"/>
      <g transform="translate(721 360)"><circle class="ln-thin" r="24"/><path class="north fl nd" d="M0 -20 L7 8 L0 3 L-7 8 Z"/><path class="ln-thin" d="M0 -20 L7 8 L0 3 L-7 8 Z"/><text class="t t-b" y="-30" text-anchor="middle">${t.north}</text></g>
      <g transform="translate(671 450)">
        <rect class="sb-a fl nd" x="0" y="0" width="25" height="6"/><rect class="ln-thin" x="0" y="0" width="100" height="6"/><rect class="sb-a fl nd" x="50" y="0" width="25" height="6"/>
        <text class="t t-xs" x="0" y="20" text-anchor="middle">0</text><text class="t t-xs" x="50" y="20" text-anchor="middle">2,5</text><text class="t t-xs" x="100" y="20" text-anchor="middle">5 m</text>
      </g>
      <text class="t t-xs" x="662" y="560">${t.copy}</text>
      <text class="t t-xs" x="662" y="574">DH · ${t.sheet}</text>
    </g>`;

  const concept = `
    ${t.zones.map(z => `<g class="zone zone--${z.c}">
      <ellipse class="bub nd" cx="${z.x}" cy="${z.y}" rx="${z.rx}" ry="${z.ry}"/>
      <text class="t t-zone" x="${z.x}" y="${z.y - 2}" text-anchor="middle">${z.n}</text>
      <text class="t t-zd" x="${z.x}" y="${z.y + 14}" text-anchor="middle">${z.d}</text></g>`).join('')}
    <path class="flow nd" d="M258 214 C 300 190 360 160 398 146"/>
    <path class="flow nd" d="M226 284 C 250 300 262 312 272 322"/>
    <path class="flow nd" d="M540 410 C 560 380 570 330 562 260 C 556 220 540 200 520 196"/>
    <path class="flow nd" d="M300 470 C 260 500 220 500 190 470"/>
    <g class="screen"><path class="flow-s nd" d="M60 552 L80 544 L100 552 L120 544 L140 552 L160 544 L180 552 L200 544 L220 552 L240 544 L260 552"/><text class="t t-zd" x="160" y="536" text-anchor="middle">${t.screen}</text></g>`;

  const dots = [];
  const cluster = (x0, y0, w, h, n, palette) => {
    for (let i = 0; i < n; i++) dots.push(`<circle class="pd pd--${palette[i % palette.length]} fl nd" cx="${f(x0 + r() * w)}" cy="${f(y0 + r() * h)}" r="${f(2.2 + r() * 2.6)}"/>`);
  };
  cluster(66, 272, 166, 38, 46, ['blush', 'violet', 'pollen', 'violet']);
  cluster(440, 172, 90, 18, 16, ['violet', 'blush']);
  cluster(410, 96, 24, 50, 10, ['pollen', 'violet']);

  const hedge = [];
  for (let x = 300; x <= 540; x += 24) hedge.push(shrub(x, 538, 12));
  for (let y = 250; y <= 394; y += 24) hedge.push(shrub(598, y, 12));

  const tags = [[370, 95, 42, 1], [575, 455, 45, 2], [230, 500, 40, 3], [215, 330, 20, 4]];

  const plant = `
    <path class="lawn fl nd" d="${LAWN}"/>
    <path class="bed-p fl nd" d="M60 268 H240 Q254 292 236 316 H60 Z"/>
    <path class="ln-thin" d="M60 268 H240 Q254 292 236 316 H60 Z"/>
    ${dots.join('')}
    ${hedge.join('')}
    ${tags.map(([x, y, rr]) => tree(x, y, rr)).join('')}
    ${tags.map(([x, y, rr, n]) => `<g class="tag"><line class="ln-hair" x1="${f(x + rr * 0.7)}" y1="${f(y - rr * 0.7)}" x2="${f(x + rr * 0.7 + 14)}" y2="${f(y - rr * 0.7 - 14)}"/><circle class="tag-c fl nd" cx="${f(x + rr * 0.7 + 21)}" cy="${f(y - rr * 0.7 - 21)}" r="9"/><circle class="ln-thin" cx="${f(x + rr * 0.7 + 21)}" cy="${f(y - rr * 0.7 - 21)}" r="9"/><text class="t t-tag" x="${f(x + rr * 0.7 + 21)}" y="${f(y - rr * 0.7 - 18)}" text-anchor="middle">${n}</text></g>`).join('')}`;

  const beds = [70, 115, 160].map(x => `<rect class="wood fl nd" x="${x}" y="330" width="32" height="110"/><rect class="ln" x="${x}" y="330" width="32" height="110"/>`).join('');
  const slats = Array.from({ length: 7 }, (_, i) => `<line class="ln-hair" x1="${564 + i * 7.3}" y1="165" x2="${564 + i * 7.3}" y2="223"/>`).join('');

  const build = `
    <path class="water fl nd" d="${POND}"/>
    <path class="ln" d="${POND}"/>
    <path class="ripple nd" d="M455 122 C 475 112 500 114 515 124"/><path class="ripple nd" d="M462 140 C 480 132 500 134 512 142"/>
    <rect class="pave fl nd" x="60" y="185" width="180" height="80"/>
    <rect class="ln" x="60" y="185" width="180" height="80"/>
    <path class="stones nd" d="${PATH}"/>
    <path class="ln-thin" d="${LAWN}"/>
    ${beds}
    <rect class="wood fl nd" x="70" y="460" width="30" height="30"/><rect class="ln-thin" x="70" y="460" width="30" height="30"/>
    <rect class="ln" x="560" y="165" width="52" height="58"/>${slats}
    ${dimH(60, 280, 47, '11,00')}
    ${dimV(50, 185, 265, '4,00')}
    ${dimH(40, 620, 572, '29,00')}
    ${dimV(26, 40, 560, '26,00')}
    ${dimH(70, 192, 452, '6,10')}
    ${level(150, 226, '±0,00')}
    ${level(420, 306, '−0,15')}
    ${level(478, 146, '−0,60')}`;

  return { base, concept, plant, build };
}

export function heroPlan(t) {
  const l = planLayers(t);
  return `<svg class="plan" viewBox="0 0 800 600" data-draw role="img" aria-label="${t.aria}">
    <g class="g-base">${l.base}</g><g class="g-build">${l.build}</g><g class="g-plant">${l.plant}</g></svg>`;
}

export function stagePlan(t) {
  const l = planLayers(t);
  const sheet = (k, inner, label) => `<div class="lyr lyr--${k}"><svg viewBox="0 0 800 600" aria-hidden="true">${inner}</svg><span class="lyr__tag">${label}</span></div>`;
  return `<div class="stack" role="img" aria-label="${t.aria}">
    ${sheet('base', l.base, t.layerNames[0])}
    ${sheet('build', l.build, t.layerNames[3])}
    ${sheet('plant', l.plant, t.layerNames[2])}
    ${sheet('concept', l.concept, t.layerNames[1])}
  </div>`;
}

// ---------------------------------------------------------- SHARED DEFS
export const DEFS_BASE = `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
  <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="pt-ln" x1="0" y1="0" x2="0" y2="7"/></pattern>
  <pattern id="pave" width="20" height="10" patternUnits="userSpaceOnUse"><rect class="pt-stone" width="20" height="10"/><path class="pt-joint" d="M0 0 H20 M0 10 H20 M0 0 V5 M10 5 V10 M20 0 V5 M0 5 H20"/></pattern>
  <pattern id="wood" width="32" height="6" patternUnits="userSpaceOnUse"><rect class="pt-wood" width="32" height="6"/><line class="pt-grain" x1="0" y1="5.5" x2="32" y2="5.5"/></pattern>
  <pattern id="soil" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect class="pt-soil" width="9" height="9"/><line class="pt-ln" x1="0" y1="0" x2="0" y2="9"/></pattern>
  <pattern id="sub" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="pt-sub" width="14" height="14"/><line class="pt-ln2" x1="0" y1="0" x2="0" y2="14"/><line class="pt-ln2" x1="7" y1="0" x2="7" y2="14"/></pattern>
  <pattern id="gravel" width="16" height="12" patternUnits="userSpaceOnUse"><rect class="pt-grv" width="16" height="12"/><circle class="pt-pebble" cx="4" cy="3" r="2.2"/><circle class="pt-pebble" cx="12" cy="8" r="2.6"/><circle class="pt-pebble" cx="9" cy="2" r="1.2"/><circle class="pt-pebble" cx="2" cy="9" r="1.4"/></pattern>
  <pattern id="sand" width="6" height="6" patternUnits="userSpaceOnUse"><rect class="pt-sand" width="6" height="6"/><circle class="pt-dot" cx="1.5" cy="1.5" r=".6"/><circle class="pt-dot" cx="4.5" cy="4" r=".5"/></pattern>
  <marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="mk" d="M0 0 L10 5 L0 10 z"/></marker>
  <radialGradient id="g-canopy" cx="35%" cy="30%" r="75%"><stop offset="0" class="st-c1"/><stop offset="1" class="st-c2"/></radialGradient>
  <radialGradient id="g-canopy2" cx="35%" cy="30%" r="75%"><stop offset="0" class="st-d1"/><stop offset="1" class="st-d2"/></radialGradient>
  <linearGradient id="g-water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="st-w1"/><stop offset="1" class="st-w2"/></linearGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
</defs></svg>`;

// ---------------------------------------------------------- ICONS
export const ICON = {
  concept: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><ellipse cx="17" cy="18" rx="12" ry="9"/><ellipse cx="32" cy="31" rx="12" ry="10"/><path d="M26 15 C 34 12 40 16 40 22" stroke-dasharray="2 3"/><circle cx="11" cy="37" r="5"/></svg>`,
  planting: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="${scallop(24, 22, 14, 9, 1.2)}"/><path d="M24 12 V40 M24 22 L31 16 M24 28 L16 22"/><path d="M14 42 H34"/></svg>`,
  construction: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><rect x="8" y="14" width="32" height="22"/><path d="M8 8 V11 M40 8 V11 M8 9.5 H40 M5 6 L11 13 M37 6 L43 13"/><path d="M8 25 H40 M20 14 V36" stroke-dasharray="2 2"/></svg>`,
  visual: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M24 6 L40 15 V33 L24 42 L8 33 V15 Z"/><path d="M8 15 L24 24 L40 15 M24 24 V42"/></svg>`,
  ruler: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M8 40 L8 8 L40 40 Z"/><path d="M8 16 H12 M8 22 H14 M8 28 H12 M8 34 H14"/><path d="M15 33 L15 25 L23 33 Z"/></svg>`,
  coin: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><ellipse cx="24" cy="14" rx="14" ry="6"/><path d="M10 14 V24 C10 27.3 16.3 30 24 30 C31.7 30 38 27.3 38 24 V14"/><path d="M10 24 V34 C10 37.3 16.3 40 24 40 C31.7 40 38 37.3 38 34 V24"/></svg>`,
  sheet: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><rect x="9" y="6" width="30" height="36"/><path d="M15 14 H33 M15 20 H33 M15 26 H26"/><path d="M27 31 L31 36 L39 26"/></svg>`,
  grow: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M6 42 H42"/><path d="M24 42 V18"/><path d="M24 26 C 14 26 10 18 10 12 C 18 12 24 16 24 26 Z"/><path d="M24 20 C 32 20 38 14 38 7 C 30 7 24 12 24 20 Z"/></svg>`,
  climate: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M10 31 V10 A4 4 0 0 1 18 10 V31 A7 7 0 1 1 10 31 Z"/><path d="M14 34 V16"/><path d="M18 14 H21 M18 20 H21 M18 26 H21"/><path d="M27 42 C 26 30 32 21 44 18 C 45 31 38 40 27 42 Z"/><path d="M27 42 L39 25"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" class="ico-arw" aria-hidden="true"><path d="M4 12 H19 M13 6 L19 12 L13 18"/></svg>`,
};

export const LOGO = `<svg viewBox="0 0 40 40" class="logo-mark" aria-hidden="true"><path d="${scallop(20, 20, 14, 10, 1.18)}"/><path d="M14 20 H26 M20 14 V26" class="lm-x"/></svg>`;

// ---------------------------------------------------------- CONCEPT HERO
export function bubbleDiagram(t) {
  const B = [
    { x: 180, y: 160, r: 92, c: 'blush' }, { x: 395, y: 135, r: 70, c: 'water' },
    { x: 410, y: 320, r: 110, c: 'sage' }, { x: 175, y: 360, r: 72, c: 'pollen' }, { x: 520, y: 430, r: 46, c: 'moss' },
  ];
  const links = [[0, 1], [0, 2], [0, 3], [2, 4], [1, 2], [3, 2]];
  return `<svg class="bubbles" viewBox="0 0 600 500" data-draw role="img" aria-label="${t.aria}">
    <rect class="frame nd" x="10" y="10" width="580" height="480" rx="2"/>
    ${links.map(([a, b]) => `<line class="flow nd" x1="${B[a].x}" y1="${B[a].y}" x2="${B[b].x}" y2="${B[b].y}"/>`).join('')}
    ${B.map((b, i) => `<g class="bb bb--${i}"><circle class="bub bub--${b.c} nd" cx="${b.x}" cy="${b.y}" r="${b.r}"/>
      <text class="t t-zone" x="${b.x}" y="${b.y - 2}" text-anchor="middle">${t.zones[i][0]}</text>
      <text class="t t-zd" x="${b.x}" y="${b.y + 15}" text-anchor="middle">${t.zones[i][1]}</text></g>`).join('')}
    <text class="t t-xs" x="28" y="474">${t.caption}</text>
  </svg>`;
}

// ---------------------------------------------------------- PLANTING HERO
export function plantSymbols(t) {
  const r = rng(21);
  const grass = (cx, cy, s) => `<g class="grass">${Array.from({ length: 11 }, (_, i) => {
    const a = -Math.PI / 2 + (i - 5) * 0.2;
    return `<line class="ln-thin" x1="${cx}" y1="${cy}" x2="${f(cx + Math.cos(a) * s * (0.7 + r() * 0.4))}" y2="${f(cy + Math.sin(a) * s * (0.7 + r() * 0.4))}"/>`;
  }).join('')}<circle class="pd pd--pollen fl nd" cx="${cx}" cy="${cy}" r="3"/></g>`;
  const star = (cx, cy, R, n = 14) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? R * 0.55 : R; d += `${i ? 'L' : 'M'}${P([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])}`; }
    return `<g class="conifer"><path class="conifer-f fl nd" d="${d}Z"/><path class="ln" d="${d}Z"/><circle class="ln-hair" cx="${cx}" cy="${cy}" r="3"/></g>`;
  };
  const drift = [];
  for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 1; drift.push(`<circle class="pd pd--${['violet', 'blush', 'violet'][i % 3]} fl nd" cx="${f(430 + Math.cos(a) * 95 * d)}" cy="${f(370 + Math.sin(a) * 55 * d)}" r="${f(2.5 + r() * 3)}"/>`); }
  const lab = (x, y, x2, y2, txt, sub, anchor = 'start') => `<g class="lab"><polyline class="ln-hair" points="${x},${y} ${x2},${y2} ${x2 + (anchor === 'start' ? 24 : -24)},${y2}"/><circle class="dot-ink fl nd" cx="${x}" cy="${y}" r="2.5"/>
    <text class="t-lat" x="${x2 + (anchor === 'start' ? 30 : -30)}" y="${y2 + 4}" text-anchor="${anchor}">${txt}</text><text class="t t-xs" x="${x2 + (anchor === 'start' ? 30 : -30)}" y="${y2 + 18}" text-anchor="${anchor}">${sub}</text></g>`;
  return `<svg class="symbols" viewBox="0 0 600 500" data-draw role="img" aria-label="${t.aria}">
    <path class="bed-p fl nd" d="M60 300 C 60 220 160 180 260 200 C 360 220 420 200 500 230 C 570 258 570 420 500 440 C 400 470 300 450 200 460 C 110 470 60 400 60 300 Z"/>
    <path class="ln-thin" stroke-dasharray="4 4" d="M60 300 C 60 220 160 180 260 200 C 360 220 420 200 500 230 C 570 258 570 420 500 440 C 400 470 300 450 200 460 C 110 470 60 400 60 300 Z"/>
    <g class="sym sym--1">${tree(190, 160, 105, 'tree tree--big')}</g>
    <g class="sym sym--2">${star(440, 120, 54)}</g>
    <g class="sym sym--3">${shrub(300, 300, 34)}${shrub(345, 335, 26)}</g>
    <g class="sym sym--4">${drift.join('')}</g>
    <g class="sym sym--5">${grass(140, 390, 34)}${grass(190, 420, 28)}${grass(240, 395, 32)}</g>
    ${lab(190, 160, 120, 40, 'Acer campestre', t.l[0], 'end')}
    ${lab(470, 110, 520, 50, 'Taxus baccata', t.l[1], 'end')}
    ${lab(320, 300, 380, 250, 'Viburnum tinus', t.l[2])}
    ${lab(470, 380, 500, 470, 'Salvia nemorosa', t.l[3], 'end')}
    ${lab(170, 400, 100, 470, 'Miscanthus sinensis', t.l[4])}
  </svg>`;
}

// ---------------------------------------------------------- BLOOM CALENDAR
export function bloomCalendar(t) {
  // [latin, from month 0-11, to month (inclusive, may wrap), kind]
  const rows = [
    ['Hamamelis × intermedia', 0, 2, 'pollen'], ['Helleborus orientalis', 1, 3, 'blush'],
    ['Magnolia stellata', 2, 3, 'paper'], ['Allium ‘Purple Sensation’', 4, 5, 'violet'],
    ['Lavandula angustifolia', 5, 7, 'violet'], ['Salvia nemorosa', 5, 8, 'violet'],
    ['Echinacea purpurea', 6, 8, 'blush'], ['Hydrangea paniculata', 6, 9, 'paper'],
    ['Aster × frikartii', 7, 9, 'violet'], ['Acer palmatum', 9, 10, 'clay'],
    ['Miscanthus sinensis', 8, 1, 'straw'], ['Taxus baccata', 0, 11, 'moss'],
  ];
  const x0 = 220, w = 40, rh = 30, y0 = 40, W = x0 + w * 12 + 20;
  const H = y0 + rows.length * rh + 20;
  const bar = (a, b, y, k) => {
    const seg = (s, e) => `<rect class="bar bar--${k}" x="${x0 + s * w + 3}" y="${y + 7}" width="${(e - s + 1) * w - 6}" height="${rh - 14}" rx="${(rh - 14) / 2}"/>`;
    return a <= b ? seg(a, b) : seg(a, 11) + seg(0, b);
  };
  return `<svg class="calendar" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t.aria}">
    ${t.months.map((m, i) => `<text class="t t-xs" x="${x0 + i * w + w / 2}" y="26" text-anchor="middle">${m}</text><line class="cal-grid" x1="${x0 + i * w}" y1="34" x2="${x0 + i * w}" y2="${H - 14}"/>`).join('')}
    <line class="cal-grid" x1="${x0 + 12 * w}" y1="34" x2="${x0 + 12 * w}" y2="${H - 14}"/>
    ${rows.map(([n, a, b, k], i) => `<g class="cal-row" style="--r:${i}"><rect class="cal-hit" x="0" y="${y0 + i * rh}" width="${W}" height="${rh}"/><text class="t-lat" x="${x0 - 14}" y="${y0 + i * rh + 20}" text-anchor="end">${n}</text>${bar(a, b, y0 + i * rh, k)}</g>`).join('')}
    <g class="cal-now" data-x0="${x0}" data-w="${w}"><line x1="0" y1="30" x2="0" y2="${H - 10}"/><text class="t t-b" x="0" y="${H - 1}" text-anchor="middle">${t.now}</text></g>
  </svg>`;
}

// ---------------------------------------------------------- SECTION A–A
export function sectionDrawing(t) {
  const tufts = Array.from({ length: 26 }, (_, i) => { const x = 46 + i * 10.6; return `<path class="ln-thin" d="M${x} 220 l-3 -9 M${x} 220 l1 -11 M${x} 220 l4 -8"/>`; }).join('');
  const joints = Array.from({ length: 11 }, (_, i) => `<line class="ln-thin" x1="${360 + i * 26}" y1="220" x2="${360 + i * 26}" y2="232"/>`).join('');
  const call = (x, y, ly, txt, sub) => `<g class="call"><polyline class="ln-hair" points="${x},${y} 640,${ly} 652,${ly}"/><circle class="dot-ink fl nd" cx="${x}" cy="${y}" r="2.4"/><text class="t t-b" x="658" y="${ly + 1}">${txt}</text><text class="t t-xs" x="658" y="${ly + 14}">${sub}</text></g>`;
  return `<svg class="section" viewBox="0 0 800 420" data-draw role="img" aria-label="${t.aria}">
    <rect class="frame nd" x="8" y="8" width="784" height="404"/>
    <rect class="soil fl nd" x="30" y="220" width="300" height="40"/><rect class="sub fl nd" x="30" y="260" width="300" height="120"/>
    <rect class="sub fl nd" x="340" y="300" width="290" height="80"/>
    <rect class="grv fl nd" x="340" y="244" width="290" height="56"/>
    <rect class="snd fl nd" x="340" y="232" width="290" height="12"/>
    <rect class="stone-f fl nd" x="340" y="220" width="290" height="12"/>
    <rect class="curb fl nd" x="330" y="212" width="10" height="56"/>
    <path class="ln-bold" d="M30 220 H330 V212 H340 V220 H630"/>
    <path class="ln" d="M30 260 H330 M340 232 H630 M340 244 H630 M330 268 H340 V212"/>
    <path class="geo nd" d="M340 300 H630"/>
    <path class="ln" d="M30 380 H630 M630 220 V380"/>
    ${joints}${tufts}
    <g class="elev-tree"><path class="ln" d="M150 220 C 148 190 146 160 150 128 M150 170 C 136 160 128 150 124 138 M150 156 C 164 146 172 136 176 124"/>
      <path class="canopy fl nd" d="M90 120 C 80 80 110 46 150 44 C 196 42 222 76 214 116 C 208 146 176 150 150 146 C 118 150 96 146 90 120 Z"/>
      <path class="ln" d="M90 120 C 80 80 110 46 150 44 C 196 42 222 76 214 116 C 208 146 176 150 150 146 C 118 150 96 146 90 120 Z"/></g>
    <g><path class="shrub fl nd" d="M250 220 C 240 200 252 182 272 184 C 292 180 306 198 296 220 Z"/><path class="ln" d="M250 220 C 240 200 252 182 272 184 C 292 180 306 198 296 220 Z"/></g>
    ${level(380, 220, '±0,00')}${level(200, 220, '−0,03')}
    <g class="dim"><line x1="360" y1="196" x2="600" y2="196" marker-end="url(#arw)"/><text class="t t-dim" x="480" y="190" text-anchor="middle">${t.slope}</text></g>
    ${call(600, 226, 150, t.c[0][0], t.c[0][1])}
    ${call(590, 238, 190, t.c[1][0], t.c[1][1])}
    ${call(600, 272, 245, t.c[2][0], t.c[2][1])}
    ${call(600, 300, 300, t.c[3][0], t.c[3][1])}
    ${call(600, 340, 350, t.c[4][0], t.c[4][1])}
    <text class="t t-xs" x="50" y="246">${t.topsoil}</text>
    ${dimV(20, 220, 260, '30')}
    <text class="t t-b" x="30" y="404">${t.title}</text>
  </svg>`;
}

// ---------------------------------------------------------- ISOMETRIC 3D
export function isoGarden(t) {
  const ox = 360, oy = 120;
  const iso = (x, y, z = 0) => [ox + (x - y) * 0.866, oy + (x + y) * 0.5 - z];
  const poly = (pts, cls) => `<polygon class="${cls}" points="${pts.map(p => P(iso(...p))).join(' ')}"/>`;
  const box = (x0, y0, z0, x1, y1, z1, c) =>
    poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], `${c}-t`) +
    poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], `${c}-r`) +
    poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], `${c}-f`);
  const ell = (cx, cy, rx, ry, z, cls) => poly(Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), z]; }), cls);
  const treeIso = (x, y, h, r, k = 1) => {
    const [bx, by] = iso(x, y, 0), [tx, ty] = iso(x, y, h);
    return `<g class="iso-tree">${ell(x + 14, y + 14, r * 0.95, r * 0.95, 0, 'shadow')}
      <line class="trunk" x1="${f(bx)}" y1="${f(by)}" x2="${f(tx)}" y2="${f(ty)}"/>
      <path class="branches" d="M${f(tx)} ${f(ty + 18)} l-12 -16 M${f(tx)} ${f(ty + 10)} l14 -18 M${f(tx)} ${f(ty + 4)} l-4 -22"/>
      <circle class="crown crown--${k}" cx="${f(tx)}" cy="${f(ty - r * 0.35)}" r="${r}"/><circle class="crown-hi" cx="${f(tx - r * 0.3)}" cy="${f(ty - r * 0.7)}" r="${f(r * 0.5)}"/></g>`;
  };
  const stones = Array.from({ length: 8 }, (_, i) => { const u = i / 7, x = 105 + u * 165, y = 105 + u * 140 + Math.sin(u * 3.2) * 18; return poly([[x, y, 1], [x + 14, y, 1], [x + 14, y + 9, 1], [x, y + 9, 1]], 'stone'); }).join('');
  const windows = [0, 1, 2].map(i => poly([[110, 12 + i * 22, 22], [110, 26 + i * 22, 22], [110, 26 + i * 22, 52], [110, 12 + i * 22, 52]], 'win')).join('') +
    poly([[20, 80, 0], [52, 80, 0], [52, 80, 56], [20, 80, 56]], 'win') + poly([[64, 80, 22], [96, 80, 22], [96, 80, 52], [64, 80, 52]], 'win');
  const posts = [[232, 112], [282, 112], [232, 152], [282, 152]].map(([x, y]) => { const a = iso(x, y, 0), b = iso(x, y, 46); return `<line class="post" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`; }).join('');
  const beams = Array.from({ length: 6 }, (_, i) => { const y = 108 + i * 9.4, a = iso(226, y, 46), b = iso(288, y, 46); return `<line class="beam" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`; }).join('');
  return `<svg class="iso" viewBox="0 0 720 440" role="img" aria-label="${t.aria}">
    ${box(0, 0, -16, 300, 260, 0, 'gnd')}
    ${ell(222, 58, 44, 28, 0.5, 'pond')}
    ${box(0, 80, 0, 100, 132, 3, 'ter')}
    ${stones}
    ${box(0, 0, 0, 110, 80, 70, 'hs')}
    ${windows}
    ${box(-4, -4, 70, 114, 84, 76, 'roof')}
    ${treeIso(160, 34, 74, 34, 1)}
    ${posts}${beams}
    ${[10, 40, 70].map(x => box(x, 168, 0, x + 20, 240, 12, 'bed')).join('')}
    ${treeIso(58, 252, 56, 26, 2)}
    ${treeIso(262, 196, 82, 38, 1)}
    ${box(118, 250, 0, 298, 259, 20, 'hedge')}
    <text class="t t-xs" x="24" y="420">${t.caption}</text>
  </svg>`;
}

// ---------------------------------------------------------- PORTRAIT FRAME
// Hanna's photo inside the drawn arch: the outline draws itself, then the photo fades in.
export function archPortrait(t, src) {
  const arch = 'M30 510 V200 C30 100 110 20 200 20 C290 20 370 100 370 200 V510 Z';
  return `<svg class="arch" viewBox="0 0 400 520" data-draw role="img" aria-label="${t}">
    <defs><clipPath id="arch-clip"><path d="${arch}"/></clipPath></defs>
    <path class="arch-bg fl nd" d="${arch}"/>
    <image class="fl" href="${src}" x="30" y="20" width="340" height="490" preserveAspectRatio="xMidYMid slice" clip-path="url(#arch-clip)"/>
    <path class="ln-thin arch-in" d="M48 510 V204 C48 112 120 38 200 38 C280 38 352 112 352 204 V510"/>
    <path class="ln" d="${arch}"/>
  </svg>`;
}

// ---------------------------------------------------------- PROCESS STEM
export function stem() {
  const d = 'M20 0 C 8 120 32 240 20 360 C 8 480 32 600 20 720 C 10 820 28 920 20 1000';
  return `<svg class="stem" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true"><path class="stem-bg" d="${d}"/></svg>
  <div class="stem-clip" aria-hidden="true"><svg class="stem" viewBox="0 0 40 1000" preserveAspectRatio="none"><path class="stem-fg" d="${d}"/></svg></div>`;
}

// ---------------------------------------------------------- LAYOUT SYSTEM PIECES
// Drafting corner marks, used on every framed object.
export const PLUS4 = '<i class="px px--tl" aria-hidden="true"></i><i class="px px--tr" aria-hidden="true"></i><i class="px px--bl" aria-hidden="true"></i><i class="px px--br" aria-hidden="true"></i>';

// Section divider: a planting row in plan view on a ruled baseline.
function hedgeBand(seed = 5) {
  const r = rng(seed), parts = [];
  let x = 8;
  for (let i = 0; x < 2600; i++) {
    if (i % 7 === 3) {
      parts.push(`<path class="ln-thin" d="${scallop(x + 16, 22, 16, 11)}"/><line class="ln-hair" x1="${x + 11}" y1="22" x2="${x + 21}" y2="22"/><line class="ln-hair" x1="${x + 16}" y1="17" x2="${x + 16}" y2="27"/>`);
      x += 40;
    } else if (i % 7 === 6) {
      parts.push(`<circle class="band-dot" cx="${x + 4}" cy="${f(26 + (r() - 0.5) * 6)}" r="2.6"/><circle class="band-dot band-dot--b" cx="${x + 11}" cy="${f(20 + (r() - 0.5) * 6)}" r="2.2"/>`);
      x += 18;
    } else {
      const rr = 6 + r() * 3.5;
      parts.push(`<path class="band-s" d="${scallop(x + rr, f(24 + (r() - 0.5) * 5), rr, 7, 1.22)}"/>`);
      x += rr * 2 + 3;
    }
  }
  const ticks = Array.from({ length: Math.ceil(x / 20) }, (_, i) => `<line class="ln-hair" x1="${i * 20}" y1="${i % 5 ? 43 : 40}" x2="${i * 20}" y2="47"/>`).join('');
  return { w: Math.round(x), g: `<g id="band-g"><line class="ln-thin" x1="0" y1="45" x2="${Math.round(x)}" y2="45"/>${ticks}${parts.join('')}</g>` };
}
const BAND = hedgeBand();
export const BAND_DEF = BAND.g;
export const band = (cls = '') => `<div class="band ${cls}" aria-hidden="true"><svg viewBox="0 0 ${BAND.w} 48" preserveAspectRatio="xMinYMid slice"><use href="#band-g"/></svg></div>`;

// Hand-drawn loop around a key word.
export const SCRIBBLE = '<svg class="scr__svg" viewBox="0 0 200 64" preserveAspectRatio="none" aria-hidden="true"><path d="M14 38 C 26 10 150 2 186 22 C 206 36 172 58 100 58 C 36 58 2 46 10 28 C 16 14 66 6 128 9"/></svg>';

// ---------------------------------------------------------- REGION ICONS
Object.assign(ICON, {
  wind: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M6 18 H30 C35 18 37 12 32 10 C28 9 26 12 27 14"/><path d="M6 26 H38 C43 26 44 33 39 34 C35 35 33 32 34 30"/><path d="M6 34 H22"/></svg>`,
  water: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M24 6 C 24 6 12 20 12 28 C 12 35 17.5 40 24 40 C 30.5 40 36 35 36 28 C 36 20 24 6 24 6 Z"/><path d="M18 30 C 18 33 20.5 35 23 35"/><path d="M4 44 C 10 41 14 47 20 44 S 30 41 36 44 S 42 47 44 44"/></svg>`,
  soil: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M4 18 H44"/><path d="M24 18 V8 M24 12 C 20 8 15 8 13 10 C 16 13 21 13 24 12 Z M24 10 C 28 6 33 6 35 8 C 32 11 27 11 24 10 Z"/><circle cx="12" cy="27" r="2.5"/><circle cx="26" cy="31" r="3"/><circle cx="37" cy="26" r="2"/><circle cx="18" cy="38" r="2"/><circle cx="34" cy="38" r="2.5"/></svg>`,
  eye: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M4 24 C 10 14 17 10 24 10 C 31 10 38 14 44 24 C 38 34 31 38 24 38 C 17 38 10 34 4 24 Z"/><circle cx="24" cy="24" r="7"/><path d="M8 40 L40 8"/></svg>`,
  slope: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M4 40 H12 V32 H20 V24 H28 V16 H36 V8 H44"/><path d="M4 40 L44 8" stroke-dasharray="2 3"/><path d="M4 44 H44"/></svg>`,
  sun: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><circle cx="24" cy="24" r="8"/><path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M10 10 L14 14 M34 34 L38 38 M10 38 L14 34 M34 14 L38 10"/></svg>`,
  calendar: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><rect x="6" y="10" width="36" height="32"/><path d="M6 18 H42 M15 6 V14 M33 6 V14"/><path d="M14 26 H18 M22 26 H26 M30 26 H34 M14 34 H18 M22 34 H26"/></svg>`,
  pin: `<svg viewBox="0 0 48 48" class="ico" aria-hidden="true"><path d="M24 44 C 24 44 10 28 10 19 C 10 11 16.3 5 24 5 C 31.7 5 38 11 38 19 C 38 28 24 44 24 44 Z"/><circle cx="24" cy="19" r="5"/></svg>`,
});

// ---------------------------------------------------------- REGION MAPS
// Schematic, not cartographic: rivers, lake, contours and towns in roughly the right places.
const wob = (cx, cy, rx, ry, seed, n = 18, amp = 0.12) => {
  const r = rng(seed); let d = '';
  const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, k = 1 + (r() - 0.5) * amp * 2; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; });
  pts.forEach((p, i) => { const q = pts[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; d += i ? ` Q${P(p)} ${P(m)}` : `M${P([(pts[n - 1][0] + p[0]) / 2, (pts[n - 1][1] + p[1]) / 2])} Q${P(p)} ${P(m)}`; });
  return d + 'Z';
};
const pin = (x, y, name, main, i, anchor = 'start') => `<g class="mpin${main ? ' mpin--main' : ''}" transform="translate(${f(x)} ${f(y)})" style="--d:${600 + i * 70}ms"><circle class="mpin-r" r="${main ? 13 : 8}"/><circle class="mpin-c" r="${main ? 4.5 : 3}"/><text class="t ${main ? 't-mmain' : 't-mpin'}" x="${anchor === 'end' ? -10 : 10}" y="-8" text-anchor="${anchor}">${name}</text></g>`;

const MAPS = {
  gyor() {
    const fields = Array.from({ length: 34 }, (_, i) => `<line class="map-field" x1="${-200 + i * 26}" y1="400" x2="${80 + i * 26}" y2="0"/>`).join('');
    const towns = [[405, 176, 'Győr', 1], [175, 92, 'Mosonmagyaróvár'], [62, 372, 'Sopron'], [255, 300, 'Csorna'], [178, 300, 'Kapuvár', 0, 'end'], [470, 292, 'Pannonhalma'], [340, 336, 'Tét'], [448, 228, 'Győrújbarát'], [290, 132, 'Lébény']];
    return {
      art: `${fields}
        <path class="map-water map-water--fill" d="M18 268 C 40 248 92 254 102 282 C 112 312 92 346 60 350 C 30 352 12 320 18 268 Z"/>
        <text class="t-map" x="58" y="306" text-anchor="middle">Fertő</text>
        <path class="map-river map-river--xl" d="M10 70 C 120 48 200 82 300 70 S 470 100 590 124"/>
        <path class="map-river" d="M175 92 C 230 120 300 130 340 150 S 390 168 405 176"/>
        <path class="map-river" d="M150 400 C 200 360 260 330 300 290 S 380 214 405 176"/>
        <text class="t-map" x="255" y="104">Szigetköz</text><text class="t-map" x="520" y="96">Duna</text><text class="t-map" x="215" y="378">Rába</text>
        ${[20, 34, 48].map((r, i) => `<path class="map-contour" d="${wob(475, 300, r * 1.3, r, 40 + i)}"/>`).join('')}`,
      towns,
    };
  },
  budapest() {
    const grid = Array.from({ length: 9 }, (_, i) => `<line class="map-field" x1="${350 + i * 26}" y1="150" x2="${350 + i * 26}" y2="400"/><line class="map-field" x1="340" y1="${160 + i * 28}" x2="580" y2="${160 + i * 28}"/>`).join('');
    const hills = [[1, 1], [0.78, 0.8], [0.56, 0.6], [0.34, 0.4]].map(([a, b], i) => `<path class="map-contour" d="${wob(180, 205, 120 * a, 100 * b, 70 + i, 20, 0.16)}"/>`).join('');
    const towns = [[330, 258, 'Budapest', 1], [255, 66, 'Szentendre', 0, 'end'], [214, 98, 'Pomáz', 0, 'end'], [262, 172, 'Üröm', 0, 'end'], [196, 150, 'Solymár', 0, 'end'], [168, 228, 'Budakeszi', 0, 'end'], [222, 304, 'Budaörs', 0, 'end'], [180, 348, 'Törökbálint', 0, 'end'], [240, 398, 'Érd', 0, 'end'], [96, 318, 'Biatorbágy', 0, 'end'], [372, 112, 'Dunakeszi'], [432, 146, 'Fót'], [474, 74, 'Veresegyház'], [540, 206, 'Gödöllő', 0, 'end']];
    return {
      art: `${grid}${hills}
        <ellipse class="map-ring" cx="320" cy="260" rx="200" ry="170"/><text class="t-map" x="470" y="408">M0</text>
        <path class="map-river map-river--xl" d="M300 0 C 282 60 322 110 302 160 C 286 200 322 250 316 300 C 312 350 290 400 300 440"/>
        <path class="map-river" d="M300 30 C 252 64 258 112 302 160"/>
        <text class="t-map" x="330" y="40">Duna</text><text class="t-map" x="120" y="196">Budai-hegység</text>`,
      towns,
    };
  },
  balaton() {
    const A = [70, 352], B = [540, 118], L = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const d = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm = [-d[1], d[0]];
    const at = (t, o) => [A[0] + d[0] * L * t + nrm[0] * o, A[1] + d[1] * L * t + nrm[1] * o];
    const half = t => 8 + 30 * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.6);
    const tihany = t => -26 * Math.exp(-Math.pow((t - 0.72) / 0.025, 2));
    const N = 60, north = [], south = [];
    for (let i = 0; i <= N; i++) { const t = i / N; north.push(at(t, -half(t) - tihany(t))); south.push(at(t, half(t))); }
    const lake = `M${north.map(P).join(' L')} L${south.reverse().map(P).join(' L')} Z`;
    const line = (o, t0, t1, seed) => { const r = rng(seed); let s = ''; for (let i = 0; i <= 30; i++) { const t = t0 + (t1 - t0) * i / 30; s += (i ? ' L' : 'M') + P(at(t, o + (r() - 0.5) * 8)); } return s; };
    const bad = at(0.29, -62);
    const T = (t, o, name, main = 0, anchor) => [...at(t, o), name, main, anchor];
    const towns = [T(0.02, -26, 'Keszthely', 0, 'end'), T(0.29, -86, 'Badacsony', 0, 'end'), T(0.4, -54, 'Révfülöp', 0, 'end'), T(0.705, -24, 'Tihany', 0, 'end'), T(0.8, -50, 'Balatonfüred', 1, 'end'), T(0.95, -44, 'Balatonalmádi', 0, 'end'),
      T(0.3, 48, 'Fonyód'), T(0.45, 48, 'Balatonlelle'), T(0.64, 48, 'Balatonföldvár'), T(0.86, 46, 'Siófok')];
    return {
      art: `${[-74, -100, -126].map((o, i) => `<path class="map-contour" d="${line(o, 0.04, 1.02, 90 + i)}"/>`).join('')}
        ${[12, 22, 32].map(r => `<circle class="map-contour" cx="${f(bad[0])}" cy="${f(bad[1])}" r="${r}"/>`).join('')}
        <path class="map-rail" d="${line(78, -0.02, 1.02, 99)}"/>
        <path class="map-water map-water--fill map-lake" d="${lake}"/>
        <text class="t-map t-map--lake" x="${f(at(0.5, 0)[0])}" y="${f(at(0.5, 0)[1] + 4)}" text-anchor="middle" transform="rotate(${f(Math.atan2(d[1], d[0]) * 180 / Math.PI)} ${f(at(0.5, 0)[0])} ${f(at(0.5, 0)[1])})">Balaton</text>`,
      towns,
    };
  },
};

export function regionMap(key, t, { mini = false } = {}) {
  const m = MAPS[key]();
  return `<svg class="rmap${mini ? ' rmap--mini' : ''}" viewBox="0 0 600 440" ${mini ? 'preserveAspectRatio="xMidYMid slice" aria-hidden="true"' : `role="img" aria-label="${t.aria}"`}${mini ? '' : ' data-draw'}>
    <defs><clipPath id="rm-${key}${mini ? '-m' : ''}"><rect x="10" y="10" width="580" height="384"/></clipPath></defs>
    <rect class="paper-bg nd" x="0" y="0" width="600" height="440"/>
    <g clip-path="url(#rm-${key}${mini ? '-m' : ''})">${m.art}</g>
    <rect class="frame" x="10" y="10" width="580" height="420"/>
    <line class="frame" x1="10" y1="394" x2="590" y2="394"/>
    ${m.towns.map(([x, y, n, main, anchor], i) => pin(x, y, n, main, i, anchor)).join('')}
    <g transform="translate(560 44)"><circle class="ln-thin" r="14"/><path class="north nd" d="M0 -11 L4 5 L0 2 L-4 5 Z"/><text class="t t-b" y="-19" text-anchor="middle">${t.north}</text></g>
    <text class="t t-b" x="22" y="416">${t.title}</text>
    <text class="t t-xs" x="578" y="416" text-anchor="end">${t.note}</text>
  </svg>`;
}
