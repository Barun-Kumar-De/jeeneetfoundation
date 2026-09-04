// ─── Shape definitions ───────────────────────────────────────────────────────

const SHAPES = {
  polygon: {
    name: 'Polygon',
    pathD: 'M 115 85 L 305 60 L 350 185 L 225 258 L 72 200 Z',
    fillClass: 'shape-bg-poly',
    startPt: [115, 85],
    dimLabels: []
  },
  square: {
    name: 'Square',
    pathD: 'M 150 100 L 270 100 L 270 220 L 150 220 Z',
    fillClass: 'shape-bg',
    startPt: [150, 100],
    dimLabels: [
      { x: 210, y: 82, text: 'a' },
      { x: 288, y: 160, text: 'a' },
      { x: 210, y: 238, text: 'a' },
      { x: 132, y: 160, text: 'a' }
    ]
  },
  triangle: {
    name: 'Equilateral Triangle',
    pathD: 'M 210 78 L 280 200 L 140 200 Z',
    fillClass: 'shape-bg-tri',
    startPt: [210, 78],
    dimLabels: [
      { x: 257, y: 127, text: 'a' },
      { x: 210, y: 218, text: 'a' },
      { x: 163, y: 127, text: 'a' }
    ]
  },
  rectangle: {
    name: 'Rectangle',
    pathD: 'M 120 110 L 300 110 L 300 210 L 120 210 Z',
    fillClass: 'shape-bg-rect',
    startPt: [120, 110],
    dimLabels: [
      { x: 210, y: 92, text: 'a' },
      { x: 318, y: 160, text: 'b' },
      { x: 210, y: 228, text: 'a' },
      { x: 102, y: 160, text: 'b' }
    ]
  }
};

// ─── Animation state ──────────────────────────────────────────────────────────

const animState = {
  shape: 'square',
  progress: 0,
  running: true,
  pathEl: null,
  totalLength: 0,
  lastTime: null,
  speed: 0.22,
  raf: null
};

// ─── Narration data ───────────────────────────────────────────────────────────

const NARR_MAIN = [
  {
    text: "Perimeter is the total length around a shape's border. Imagine a tiny insect going for a walk — it starts at one corner and walks along every edge without turning back.",
    hl: '#anim-panel',
    action: () => setPolygon(),
    dur: 9000
  },
  {
    text: "The insect keeps walking until it returns to where it started. The total distance it has travelled is the perimeter of the shape.",
    hl: '#anim-panel',
    action: null,
    dur: 7000
  },
  {
    text: "A square has four equal sides — each 'a' units long. The insect walks side 'a' four times, so the perimeter is 4a units.",
    hl: '[data-shape="square"]',
    action: () => setShape('square'),
    dur: 8000
  },
  {
    text: "An equilateral triangle has three equal sides. The insect walks 'a' units three times. So its perimeter is 3a units.",
    hl: '#formula-triangle',
    action: () => setShape('triangle'),
    dur: 8000
  },
  {
    text: "A rectangle has length 'a' and width 'b'. The insect walks a, then b, then a again, then b again — giving a perimeter of 2 times (a + b).",
    hl: '#formula-rectangle',
    action: () => setShape('rectangle'),
    dur: 9000
  },
  {
    text: "Notice: the square formula P = 4a is actually a special case of the rectangle formula P = 2(a + b). When a = b, we get 2(a + a) = 2 × 2a = 4a.",
    hl: '#special-case-note',
    action: null,
    dur: 10000
  }
];

const NARR_CIRCLES = [
  {
    text: "So far we have measured perimeters of shapes with straight sides. But what about a circle? A circle has a curved boundary — we call its perimeter the circumference.",
    hl: '#circle-anim-panel',
    action: null,
    dur: 16000
  },
  {
    text: "The circumference of a circle equals 2 times pi times the radius r. Pi is the special constant approximately equal to 3.14159 — it is the ratio of any circle's circumference to its diameter.",
    hl: '#cformula-circle',
    action: () => setCircleShape('circle'),
    dur: 18000
  },
  {
    text: "A semi-circle is half a circle. Its perimeter has two parts: the curved arc, which is half the full circumference — that is pi r — and the straight diameter at the base, which is 2r. Together the perimeter is pi r plus 2r.",
    hl: '#cformula-semicircle',
    action: () => setCircleShape('semicircle'),
    dur: 21000
  },
  {
    text: "A sector is a slice of a circle — like a pie slice — with angle theta at the centre. Its arc is the fraction theta over 360 of the full circumference. Adding the two straight radii of length r each gives the full perimeter.",
    hl: '#cformula-sector',
    action: () => setCircleShape('sector'),
    dur: 22000
  },
  {
    text: "Watch the full circle appear in gold — that is the complete circumference 2πr. Our sector's arc is simply the fraction theta over 360 of that full circumference. So the arc equals theta over 360, times 2πr.",
    hl: '#circle-anim-panel',
    action: () => runArcAnimation(),
    dur: 14000
  },
  {
    text: "Notice: a semi-circle is just a sector where theta equals 180 degrees. Substituting gives arc equals 180 over 360 times 2 pi r, which simplifies to pi r. Adding the diameter 2r gives pi r plus 2r — confirming our earlier formula.",
    hl: '#circle-special-note',
    action: () => renderSectorTheta180(),
    dur: 24000
  }
];

const NARR_MCQ2 = [
  {
    text: "Here is a 20-step staircase. Each step is 0.45 cm wide and 0.3 cm tall — you can see the individual step dimensions labelled on the first step. The total width at the bottom is 9 cm and the total height on the left is 6 cm.",
    hl: '#mcq2-diagram',
    action: null,
    dur: 15000
  }
];

const NARR_INSIGHT = [
  {
    text: "Here is the key insight: no matter how many steps the staircase has, its perimeter is always equal to 2 times the total width plus the total height.",
    hl: '#insight-formula-card',
    action: null,
    dur: 12000
  },
  {
    text: "Look at the staircase. The step edges highlighted in blue are all the horizontal treads. Together they span exactly the total width — 9 centimetres — because they cover the full left-to-right distance.",
    hl: '#insight-horiz-label',
    action: null,
    dur: 14000
  },
  {
    text: "The step edges highlighted in orange are all the vertical risers. Together they span exactly the total height — 6 centimetres — because they cover the full top-to-bottom distance.",
    hl: '#insight-vert-label',
    action: null,
    dur: 13000
  },
  {
    text: "Watch the animation: the blue treads slide up to form one long top edge of 9 cm, and the orange risers slide right to form one tall right edge of 6 cm — collapsing the staircase into a rectangle.",
    hl: '#insight-anim-panel',
    action: () => { const b = document.getElementById('btn-animate'); if (b && !b.disabled) runInsightAnimation(); },
    dur: 16000
  },
  {
    text: "The result is a rectangle with the same perimeter. P equals 9 plus 6 plus 9 plus 6, which is 2 times 15, equals 30 centimetres. This is true for any number of steps — only the total width and height matter.",
    hl: '#insight-result-card',
    action: null,
    dur: 16000
  }
];

const NARR_MCQ1 = [
  {
    text: "Here is an L-shaped figure with all six sides labelled. An L-shape has six sides, not four — the inner notch creates two extra sides.",
    hl: '.mcq-diagram-panel',
    action: null,
    dur: 9000
  },
  {
    text: "Trace around the full border of the shape and add every side length. Choose the option that equals that total.",
    hl: '.mcq-options',
    action: null,
    dur: 8000
  }
];

const NARR_MCQ3 = [
  {
    text: "Here is a running track. It has two straight sections, each 36 metres long, and two semicircular ends, each with radius 7 metres. The question asks for the total perimeter of the track.",
    hl: '#mcq3-diagram',
    action: null,
    dur: 14000
  },
  {
    text: "What is the perimeter of the running track?",
    hl: '#mcq3-options',
    action: null,
    dur: 5000
  }
];

const NARR_MCQ3_EXPL = [
  {
    text: "Let's see why 116 metres is correct. The track's boundary has two types of edge: orange straight sections and green curved arcs.",
    hl: '#mcq3-expl-diagram',
    action: null,
    dur: 11000
  },
  {
    text: "The two straight sections, labelled one and two, each measure 36 metres. Together they contribute 2 times 36, which equals 72 metres.",
    hl: '#mcq3-straight-row',
    action: null,
    dur: 11000
  },
  {
    text: "The two green semicircular ends, labelled three, together form one complete circle with radius 7 metres. Its circumference is 2 pi r. Using pi equals 22 over 7, we get 2 times 22 over 7 times 7, which equals 44 metres.",
    hl: '#mcq3-circle-row',
    action: null,
    dur: 18000
  },
  {
    text: "Adding both parts: 72 plus 44 equals 116 metres.",
    hl: '#mcq3-total-box',
    action: null,
    dur: 14000
  }
];

const NARR_EXPL = [
  {
    text: "Let's walk through why 28 cm is correct. The L-shape has six sides — numbered one to six going clockwise from the bottom.",
    hl: '#expl-diagram',
    action: null,
    dur: 9000
  },
  {
    text: "Bottom side one: 8 cm. Right short side two: 2 cm. Step horizontal three: 3 cm. Step vertical four: 4 cm. Top five: 5 cm. Left side six: 6 cm.",
    hl: '#expl-workings',
    action: null,
    dur: 12000
  },
  {
    text: "Adding all six: 8 plus 2 plus 3 plus 4 plus 5 plus 6 equals 28 cm. The inner notch contributes sides three and four — without them you would only count 4 sides and reach just 21 cm.",
    hl: '#expl-total',
    action: null,
    dur: 14000
  }
];

const NARR_MCQ4 = [
  {
    text: 'This shape is a modified half ring. The outer boundary is a semicircle with diameter 28 centimetres. Two straight slanted sides, each of length 7 root 2 centimetres, connect the outer arc to a shorter inner arc. Each side makes a 45 degree angle with the horizontal. Use pi equal to 22 over 7 and root 2 equal to 1.4.',
    hl: '#mcq4-diagram',
    action: null,
    dur: 22000
  },
  {
    text: 'What is the perimeter of this shape?',
    hl: '#mcq4-question-panel',
    action: null,
    dur: 5000
  }
];

const NARR_MCQ4_EXPL = [
  {
    text: 'The perimeter of this shape has four parts: the outer semicircular arc, two slanted sides, and a shorter inner arc. We start with the Pythagorean theorem on one slanted side.',
    hl: '#mcq4-expl-diagram',
    action: () => initMCQ4Expl(),
    dur: 14000
  },
  {
    text: 'Each slanted side makes 45 degrees with the horizontal — so both legs of the right triangle are equal. Slant is 7 root 2, so each leg equals 7 root 2 divided by root 2, which is 7 centimetres. Outer radius R equals 14 centimetres, so the outer arc is pi times R, that is 22 over 7 times 14, which gives 44 centimetres.',
    hl: '#mcq4-outer-arc-row',
    action: () => animMCQ4Outer(),
    dur: 22000
  },
  {
    text: 'Both slanted sides together: 2 times 7 root 2 equals 2 times 9.8, which is 19.6 centimetres.',
    hl: '#mcq4-sides-row',
    action: () => animMCQ4Slants(),
    dur: 8000
  },
  {
    text: 'The inner arc connects the tops of the slanted sides. Those endpoints are 7 centimetres across and 7 centimetres up from the base, so their distance from the centre is root of 7 squared plus 7 squared, which equals 7 root 2. The inner arc subtends 90 degrees. Inner arc equals pi over 2 times 7 root 2, which is 11 times 1.4, giving 15.4 centimetres.',
    hl: '#mcq4-inner-arc-row',
    action: () => animMCQ4Inner(),
    dur: 22000
  },
  {
    text: 'Adding all parts: 44 plus 19.6 plus 15.4 equals 79 centimetres. The key insight is that the inner arc radius equals the slanted side length — both are 7 root 2 — because of the 45 degree right triangle.',
    hl: '#mcq4-total-box',
    action: () => showMCQ4TotalLabel(),
    dur: 14000
  }
];

let NARR = NARR_MAIN;

const narrState = {
  step: -1,
  playing: false,
  utt: null,
  timer: null
};

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

const INSECT = `
  <ellipse rx="6" ry="8" fill="#b91c1c"/>
  <circle cy="-11" r="5" fill="#7f1d1d"/>
  <line x1="-2.5" y1="-15" x2="-7" y2="-21" stroke="#7f1d1d" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="2.5" y1="-15" x2="7" y2="-21" stroke="#7f1d1d" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="-7" cy="-21" r="2" fill="#450a0a"/>
  <circle cx="7" cy="-21" r="2" fill="#450a0a"/>
  <line x1="-6" y1="-4" x2="-13" y2="-2" stroke="#991b1b" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="-6" y1="0" x2="-13" y2="2" stroke="#991b1b" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="-6" y1="4" x2="-13" y2="7" stroke="#991b1b" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="6" y1="-4" x2="13" y2="-2" stroke="#991b1b" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="6" y1="0" x2="13" y2="2" stroke="#991b1b" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="6" y1="4" x2="13" y2="7" stroke="#991b1b" stroke-width="1.2" stroke-linecap="round"/>
`;

// ─── Shape rendering ──────────────────────────────────────────────────────────

function renderShape(shapeName) {
  const svg = document.getElementById('shape-svg');
  svg.innerHTML = '';

  const shape = SHAPES[shapeName];

  // Shape fill
  const fill = svgEl('path', { d: shape.pathD, class: shape.fillClass });
  svg.appendChild(fill);

  // Ghost outline
  const ghost = svgEl('path', { d: shape.pathD, class: 'shape-ghost' });
  svg.appendChild(ghost);

  // Trail path
  const trail = svgEl('path', { id: 'trail-path', d: shape.pathD, class: 'trail-path', 'stroke-dasharray': '1', 'stroke-dashoffset': '1' });
  svg.appendChild(trail);

  // Dimension labels
  for (const lb of shape.dimLabels) {
    const t = svgEl('text', { x: lb.x, y: lb.y, class: 'dim-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    t.textContent = lb.text;
    svg.appendChild(t);
  }

  // Start dot
  const sp = shape.startPt;
  const dot = svgEl('circle', { cx: sp[0], cy: sp[1], r: 6, class: 'start-dot' });
  svg.appendChild(dot);

  // Insect group
  const g = svgEl('g', { id: 'insect' });
  g.innerHTML = INSECT;
  svg.appendChild(g);

  // Hidden path for getPointAtLength
  const hp = svgEl('path', { id: 'hidden-path', d: shape.pathD, fill: 'none', stroke: 'none', opacity: '0' });
  svg.appendChild(hp);

  // Update anim state
  animState.pathEl = hp;
  animState.totalLength = hp.getTotalLength();
  trail.setAttribute('stroke-dasharray', animState.totalLength);
  trail.setAttribute('stroke-dashoffset', animState.totalLength);
}

// ─── Animation loop ───────────────────────────────────────────────────────────

function animLoop(timestamp) {
  if (!animState.running) return;

  const dt = animState.lastTime != null ? (timestamp - animState.lastTime) / 1000 : 0;
  animState.lastTime = timestamp;

  animState.progress += animState.speed * dt;
  if (animState.progress >= 1) animState.progress -= 1;

  const t = animState.progress * animState.totalLength;
  const trail = document.getElementById('trail-path');
  const insect = document.getElementById('insect');

  if (trail && insect && animState.pathEl) {
    trail.setAttribute('stroke-dashoffset', animState.totalLength - t);

    const p1 = animState.pathEl.getPointAtLength(t);
    const t2 = Math.min(t + 2, animState.totalLength - 0.1);
    const p2 = animState.pathEl.getPointAtLength(t2);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI + 90;
    insect.setAttribute('transform', `translate(${p1.x},${p1.y}) rotate(${angle})`);

    const pct = Math.round(animState.progress * 100);
    const fill = document.getElementById('dist-bar-fill');
    const val = document.getElementById('dist-bar-value');
    if (fill) fill.style.width = pct + '%';
    if (val) val.textContent = pct + '%';
  }

  animState.raf = requestAnimationFrame(animLoop);
}

// ─── Shape switching ──────────────────────────────────────────────────────────

function setPolygon() {
  document.querySelectorAll('.shape-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.formula-card').forEach(c => c.classList.remove('active-card'));
  animState.shape = 'polygon';
  animState.progress = 0;
  animState.lastTime = null;
  renderShape('polygon');
  if (animState.raf) cancelAnimationFrame(animState.raf);
  animState.running = true;
  animState.raf = requestAnimationFrame(animLoop);
}

function setShape(shapeName) {
  animState.shape = shapeName;
  animState.progress = 0;
  animState.lastTime = null;

  document.querySelectorAll('.shape-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.shape === shapeName);
  });

  renderShape(shapeName);

  document.querySelectorAll('.formula-card').forEach(c => {
    c.classList.toggle('active-card', c.id === 'formula-' + shapeName);
  });

  if (animState.raf) cancelAnimationFrame(animState.raf);
  animState.running = true;
  animState.raf = requestAnimationFrame(animLoop);
}

// ─── Circle perimeter screen ──────────────────────────────────────────────────

function renderCircleShape(shapeName) {
  const svg = document.getElementById('circle-svg');
  if (!svg) return;
  svg.innerHTML = '';

  if (shapeName === 'circle') {
    const cx = 210, cy = 150, r = 90;
    svg.appendChild(svgEl('circle', { cx, cy, r, fill: '#eff6ff', stroke: 'none' }));
    svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: cx + r, y2: cy, stroke: '#f97316', 'stroke-width': '2', 'stroke-dasharray': '5 3' }));
    svg.appendChild(svgEl('circle', { cx, cy, r, fill: 'none', stroke: '#10b981', 'stroke-width': '3.5' }));
    svg.appendChild(svgEl('circle', { cx, cy, r: 5, fill: '#f97316' }));
    const rT = svgEl('text', { x: cx + r / 2, y: cy - 12, class: 'dim-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    rT.textContent = 'r';
    svg.appendChild(rT);
    const oT = svgEl('text', { x: cx - 13, y: cy - 11, class: 'dim-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    oT.textContent = 'O';
    svg.appendChild(oT);
    const pT = svgEl('text', { x: cx, y: cy + r + 28, class: 'circle-formula-svg', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    pT.textContent = 'P = 2πr';
    svg.appendChild(pT);
    document.getElementById('circle-diagram-label').textContent = 'Circle — perimeter is the full circumference';

  } else if (shapeName === 'semicircle') {
    const cx = 210, cy = 188, r = 92;
    svg.appendChild(svgEl('path', { d: `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy} Z`, fill: '#f0fdf4', stroke: 'none' }));
    svg.appendChild(svgEl('path', { d: `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`, fill: 'none', stroke: '#10b981', 'stroke-width': '3.5', 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('line', { x1: cx - r, y1: cy, x2: cx + r, y2: cy, stroke: '#f97316', 'stroke-width': '3.5', 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('circle', { cx, cy, r: 4, fill: '#64748b' }));
    svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: cx, y2: cy - r, stroke: '#94a3b8', 'stroke-width': '1.5', 'stroke-dasharray': '4 3' }));
    const rT = svgEl('text', { x: cx + 13, y: cy - r / 2, class: 'dim-label', 'text-anchor': 'start', 'dominant-baseline': 'middle' });
    rT.textContent = 'r';
    svg.appendChild(rT);
    const arcT = svgEl('text', { x: cx, y: cy - r - 15, class: 'circle-part-label-green', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    arcT.textContent = 'arc = πr';
    svg.appendChild(arcT);
    const dT = svgEl('text', { x: cx, y: cy + 17, class: 'circle-part-label-orange', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    dT.textContent = 'diameter = 2r';
    svg.appendChild(dT);
    document.getElementById('circle-diagram-label').textContent = 'Semi-circle — arc (green) + diameter (orange)';

  } else if (shapeName === 'sector') {
    const cx = 210, cy = 198, r = 95;
    const theta = 120;
    const toRad = d => d * Math.PI / 180;
    const a1 = 90 + theta / 2;
    const a2 = 90 - theta / 2;
    const lx = +(cx + r * Math.cos(toRad(a1))).toFixed(2);
    const ly = +(cy - r * Math.sin(toRad(a1))).toFixed(2);
    const rx = +(cx + r * Math.cos(toRad(a2))).toFixed(2);
    const ry = +(cy - r * Math.sin(toRad(a2))).toFixed(2);
    svg.appendChild(svgEl('path', { d: `M ${cx},${cy} L ${lx},${ly} A ${r},${r} 0 0 1 ${rx},${ry} Z`, fill: '#fffbeb', stroke: 'none' }));
    svg.appendChild(svgEl('path', { d: `M ${lx},${ly} A ${r},${r} 0 0 1 ${rx},${ry}`, fill: 'none', stroke: '#10b981', 'stroke-width': '3.5', 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: lx, y2: ly, stroke: '#f97316', 'stroke-width': '3', 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: rx, y2: ry, stroke: '#f97316', 'stroke-width': '3', 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('circle', { cx, cy, r: 5, fill: '#64748b' }));
    const sR = 30;
    const alx = +(cx + sR * Math.cos(toRad(a1))).toFixed(2);
    const aly = +(cy - sR * Math.sin(toRad(a1))).toFixed(2);
    const arx = +(cx + sR * Math.cos(toRad(a2))).toFixed(2);
    const ary = +(cy - sR * Math.sin(toRad(a2))).toFixed(2);
    svg.appendChild(svgEl('path', { d: `M ${alx},${aly} A ${sR},${sR} 0 0 1 ${arx},${ary}`, fill: 'none', stroke: '#2563eb', 'stroke-width': '2', 'stroke-linecap': 'round' }));
    const thetaT = svgEl('text', { x: cx, y: cy - sR - 14, class: 'circle-theta-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    thetaT.textContent = 'θ';
    svg.appendChild(thetaT);
    const arcT = svgEl('text', { x: cx, y: cy - r - 16, class: 'circle-part-label-green', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    arcT.textContent = 'arc = (θ/360)×2πr';
    svg.appendChild(arcT);
    const lmx = (cx + lx) / 2;
    const lmy = (cy + ly) / 2;
    const rLT = svgEl('text', { x: lmx - 14, y: lmy, class: 'dim-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    rLT.textContent = 'r';
    svg.appendChild(rLT);
    const rmx = (cx + rx) / 2;
    const rmy = (cy + ry) / 2;
    const rRT = svgEl('text', { x: rmx + 14, y: rmy, class: 'dim-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    rRT.textContent = 'r';
    svg.appendChild(rRT);
    document.getElementById('circle-diagram-label').textContent = 'Sector — arc (green) + two radii (orange)';
  }
}

function setCircleShape(shapeName) {
  if (arcAnimRaf) { cancelAnimationFrame(arcAnimRaf); arcAnimRaf = null; }
  document.querySelectorAll('[data-cshape]').forEach(t => {
    t.classList.toggle('active', t.dataset.cshape === shapeName);
  });
  document.querySelectorAll('#screen-circles .formula-card').forEach(c => {
    c.classList.toggle('active-card', c.id === 'cformula-' + shapeName);
  });
  renderCircleShape(shapeName);
}

let arcAnimRaf = null;

function runArcAnimation() {
  if (arcAnimRaf) { cancelAnimationFrame(arcAnimRaf); arcAnimRaf = null; }
  const svg = document.getElementById('circle-svg');
  if (!svg) return;

  // Re-render clean sector then overlay animation elements
  renderCircleShape('sector');

  const cx = 210, cy = 198, r = 95;
  const circ = 2 * Math.PI * r;

  // Ghost full circle that draws in via dashoffset animation
  const ghost = svgEl('circle', {
    cx, cy, r, fill: 'none', stroke: '#f59e0b', 'stroke-width': '2.5',
    'stroke-dasharray': circ.toFixed(2), 'stroke-dashoffset': circ.toFixed(2)
  });
  svg.appendChild(ghost);

  function mkLbl(y, text, fill, weight) {
    const t = svgEl('text', {
      x: 210, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
      'font-size': '13', fill, 'font-weight': weight,
      'font-family': "'Segoe UI', system-ui, sans-serif", opacity: '0'
    });
    t.textContent = text;
    svg.appendChild(t);
    return t;
  }
  const lbl1 = mkLbl(16, 'Full circle = 2πr', '#d97706', '700');
  const lbl2 = mkLbl(33, 'arc = (θ/360) × full circle', '#059669', '700');
  const lbl3 = mkLbl(50, '∴ arc = (θ/360) × 2πr ✓', '#1a2e44', '800');

  const P = 1200;
  const start = performance.now();
  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  function frame(now) {
    const e = now - start;
    if (e <= P) {
      ghost.setAttribute('stroke-dashoffset', (circ * (1 - ease(e / P))).toFixed(2));
    } else if (e <= 2 * P) {
      ghost.setAttribute('stroke-dashoffset', '0');
      lbl1.setAttribute('opacity', ease((e - P) / P).toFixed(3));
    } else if (e <= 3 * P) {
      lbl1.setAttribute('opacity', '1');
      lbl2.setAttribute('opacity', ease((e - 2 * P) / P).toFixed(3));
    } else if (e <= 4 * P) {
      lbl2.setAttribute('opacity', '1');
      lbl3.setAttribute('opacity', ease((e - 3 * P) / P).toFixed(3));
    } else {
      lbl3.setAttribute('opacity', '1');
      arcAnimRaf = null;
      return;
    }
    arcAnimRaf = requestAnimationFrame(frame);
  }
  arcAnimRaf = requestAnimationFrame(frame);
}

function renderSectorTheta180() {
  if (arcAnimRaf) { cancelAnimationFrame(arcAnimRaf); arcAnimRaf = null; }
  const svg = document.getElementById('circle-svg');
  if (!svg) return;
  svg.innerHTML = '';

  const cx = 210, cy = 188, r = 92;
  svg.appendChild(svgEl('path', { d: `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy} Z`, fill: '#f0fdf4', stroke: 'none' }));
  svg.appendChild(svgEl('path', { d: `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`, fill: 'none', stroke: '#10b981', 'stroke-width': '3.5', 'stroke-linecap': 'round' }));
  svg.appendChild(svgEl('line', { x1: cx - r, y1: cy, x2: cx + r, y2: cy, stroke: '#f97316', 'stroke-width': '3.5', 'stroke-linecap': 'round' }));
  svg.appendChild(svgEl('circle', { cx, cy, r: 4, fill: '#64748b' }));

  // Angle arc showing 180° spans the full diameter line above centre
  const sR = 28;
  svg.appendChild(svgEl('path', { d: `M ${cx - sR},${cy} A ${sR},${sR} 0 0 1 ${cx + sR},${cy}`, fill: 'none', stroke: '#2563eb', 'stroke-width': '2', 'stroke-linecap': 'round' }));
  const thetaT = svgEl('text', { x: cx, y: cy - sR - 10, class: 'circle-theta-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  thetaT.textContent = 'θ = 180°';
  svg.appendChild(thetaT);

  const arcT = svgEl('text', { x: cx, y: cy - r - 16, class: 'circle-part-label-green', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  arcT.textContent = 'arc = (180/360)×2πr = πr';
  svg.appendChild(arcT);
  const dT = svgEl('text', { x: cx, y: cy + 17, class: 'circle-part-label-orange', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  dT.textContent = 'diameter = 2r';
  svg.appendChild(dT);
  document.getElementById('circle-diagram-label').textContent = 'Sector with θ = 180° = semi-circle';
}

// ─── Narration engine ─────────────────────────────────────────────────────────

function clearHighlights() {
  document.querySelectorAll('.hl-active').forEach(el => el.classList.remove('hl-active'));
}

function updateNarrText(text) {
  const el = document.getElementById('narr-text');
  if (el) el.textContent = text;
}

function updateNarrButton() {
  const btn = document.getElementById('btn-narr-toggle');
  if (!btn) return;
  btn.innerHTML = narrState.playing ? '&#9646;&#9646; Pause' : '&#9654; Play';
}

function updateNarrProgress() {
  const fill = document.getElementById('narr-progress-fill');
  if (!fill) return;
  const total = NARR.length;
  const pct = total > 0 ? ((narrState.step + 1) / total) * 100 : 0;
  fill.style.width = pct + '%';
}

function narrAdvance() {
  narrState.step++;
  if (narrState.step >= NARR.length) {
    narrState.playing = false;
    updateNarrButton();
    clearHighlights();
    return;
  }
  speakStep();
}

function speakStep() {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; }

  const step = NARR[narrState.step];
  if (!step) return;

  updateNarrText(step.text);
  updateNarrProgress();

  const utt = new SpeechSynthesisUtterance(step.text);
  utt.rate = 0.95;
  narrState.utt = utt;

  let applied = false;
  function applyVisuals() {
    if (applied || narrState.utt !== utt) return;
    applied = true;
    if (step.action) step.action();
    clearHighlights();
    if (step.hl) {
      const el = document.querySelector(step.hl);
      if (el) el.classList.add('hl-active');
    }
  }

  utt.onstart = applyVisuals;

  utt.onend = () => {
    clearTimeout(narrState.timer);
    if (narrState.playing) narrAdvance();
  };

  narrState.timer = setTimeout(() => {
    applyVisuals();
    if (narrState.utt) { narrState.utt.onend = null; }
    if (narrState.playing) narrAdvance();
  }, step.dur + 1500);

  window.speechSynthesis.speak(utt);
}

function narrStop() {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; window.speechSynthesis.cancel(); narrState.utt = null; }
  narrState.playing = false;
  narrState.step = -1;
  updateNarrButton();
  updateNarrText('');
  clearHighlights();
}

function narrPlay() {
  if (narrState.step >= NARR.length - 1) {
    narrState.step = -1;
  }
  narrState.playing = true;
  updateNarrButton();
  narrAdvance();
}

function narrPause() {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; window.speechSynthesis.cancel(); narrState.utt = null; }
  narrState.playing = false;
  updateNarrButton();
}

function narrToggle() {
  if (narrState.playing) {
    narrPause();
  } else {
    if (narrState.step < 0 || narrState.step >= NARR.length) {
      narrState.step = -1;
      narrPlay();
    } else {
      narrState.playing = true;
      updateNarrButton();
      speakStep();
    }
  }
}

function narrRestart() {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; window.speechSynthesis.cancel(); narrState.utt = null; }
  narrState.playing = false;
  narrState.step = -1;
  updateNarrProgress();
  updateNarrButton();
  updateNarrText('');
  clearHighlights();
  if (NARR === NARR_MAIN) setPolygon();
  else if (NARR === NARR_CIRCLES) setCircleShape('circle');
  narrPlay();
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function showMain() {
  document.getElementById('screen-intro').style.display = 'none';
  document.getElementById('screen-main').style.display = '';
  NARR = NARR_MAIN;
  setPolygon();
  narrPlay();
}

function showIntro() {
  narrStop();
  ['screen-main', 'screen-circles', 'screen-2', 'screen-expl', 'screen-3', 'screen-4', 'screen-mcq3', 'screen-mcq3-expl', 'screen-mcq4', 'screen-mcq4-expl'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('screen-intro').style.display = '';
}

function goToScreen(fromId, toId, narr, autoPlay = true) {
  narrStop();
  document.getElementById(fromId).style.display = 'none';
  document.getElementById(toId).style.display = '';
  NARR = narr;
  if (autoPlay) narrPlay();
}

function showCircles() {
  narrStop();
  document.getElementById('screen-4').style.display = 'none';
  document.getElementById('screen-circles').style.display = '';
  NARR = NARR_CIRCLES;
  setCircleShape('circle');
  narrPlay();
}
function backFromCircles() {
  if (arcAnimRaf) { cancelAnimationFrame(arcAnimRaf); arcAnimRaf = null; }
  narrStop();
  document.getElementById('screen-circles').style.display = 'none';
  document.getElementById('screen-4').style.display = '';
  NARR = NARR_INSIGHT;
}
function showMCQ1()        { goToScreen('screen-main',      'screen-2',        NARR_MCQ1); }
function showMCQ2()        { goToScreen('screen-2',         'screen-expl',     NARR_EXPL); }
function showStaircase()   { goToScreen('screen-expl',      'screen-3',        NARR_MCQ2); }
function backFromMCQ()     { goToScreen('screen-2',         'screen-main',     NARR_MAIN,    false); }
function backFromExpl()    { goToScreen('screen-expl',      'screen-2',        NARR_MCQ1,    false); }
function backFromMCQ2()    { goToScreen('screen-3',         'screen-expl',     NARR_EXPL,    false); }
function showInsight()     { goToScreen('screen-3',         'screen-4',        NARR_INSIGHT); initInsightSVG(); }
function backFromInsight() { if (insightAnimRaf) { cancelAnimationFrame(insightAnimRaf); insightAnimRaf = null; } goToScreen('screen-4', 'screen-3', NARR_MCQ2, false); }
function showMCQ3()        { if (arcAnimRaf) { cancelAnimationFrame(arcAnimRaf); arcAnimRaf = null; } goToScreen('screen-circles', 'screen-mcq3',     NARR_MCQ3); }
function backFromMCQ3()    { narrStop(); document.getElementById('screen-mcq3').style.display = 'none'; document.getElementById('screen-circles').style.display = ''; NARR = NARR_CIRCLES; }
function showMCQ3Expl()    { goToScreen('screen-mcq3',      'screen-mcq3-expl', NARR_MCQ3_EXPL); }
function backFromMCQ3Expl(){ goToScreen('screen-mcq3-expl', 'screen-mcq3',     NARR_MCQ3,    false); }
function showMCQ4()        { goToScreen('screen-mcq3-expl', 'screen-mcq4',     NARR_MCQ4); }
function backFromMCQ4()    { goToScreen('screen-mcq4',      'screen-mcq3-expl', NARR_MCQ3_EXPL, false); }
function showMCQ4Expl()    { goToScreen('screen-mcq4',      'screen-mcq4-expl', NARR_MCQ4_EXPL); initMCQ4Expl(); }
function backFromMCQ4Expl(){ goToScreen('screen-mcq4-expl', 'screen-mcq4',     NARR_MCQ4,    false); }

// ─── MCQ interaction ──────────────────────────────────────────────────────────

const mcqSelected = { 1: null, 2: null, 3: null, 4: null };

const MCQ_CONFIG = {
  1: {
    correct: '28',
    correctText: 'Correct! All six sides: 8 + 2 + 3 + 4 + 5 + 6 = 28 cm.',
    explanations: {
      '21': 'Not quite. 21 cm misses the two inner sides of the notch (3 cm and 4 cm). An L-shape has six sides — count them all.',
      '32': 'Not quite. 32 cm uses the full right side (6 cm) instead of the short portion (2 cm). Look carefully: only 2 cm of the right side remains after the cut.',
      '36': 'Not quite. 36 cm is the area of this L-shape (8×6 − 3×4), not its perimeter. Perimeter means total border length — add the sides, do not multiply them.'
    }
  },
  2: {
    correct: '30',
    correctText: 'Correct! P = 2 × (9 + 6) = 30 cm. The number of steps does not matter — only the total width and height count.',
    explanations: {
      '24': 'Not quite — 24 = 9 + 6 + 9, counting only three sides of the bounding rectangle. Add the fourth: 9 + 6 + 9 + 6 = 30 cm.',
      '26': 'Not quite. With 20 tiny steps, counting individual edges is impractical! Think about the overall shape: P = 2 × (total width + total height).',
      '28': 'Very close — just 2 short. P = 2 × (9 + 6) = 2 × 15 = 30 cm. The step edges always sum to the full width and height.'
    }
  },
  3: {
    correct: '116',
    correctText: 'Correct! Two straight sections (2 × 36 = 72 m) + two semicircles = one full circle (2π × 7 = 44 m) = 116 m.',
    explanations: {
      '94':  'Almost — but there are two semicircular ends, not one. Two halves make one full circle: 2πr = 2 × 22/7 × 7 = 44 m. Total = 72 + 44 = 116 m.',
      '100': 'The curved ends are arcs, not straight lines! Two semicircles give a full circumference: 2π × 7 = 44 m, not 14 + 14. Total = 72 + 44 = 116 m.',
      '160': 'Check the circumference formula — use the radius (7 m), not the diameter (14 m). 2π × 7 = 44 m, so total = 72 + 44 = 116 m.'
    }
  },
  4: {
    correct: '79',
    correctText: 'Correct! Outer arc 44 + two slanted sides 19.6 + inner arc 15.4 = 79 cm.',
    explanations: {
      '80': 'This treats the shape as a standard half ring with horizontal sides and a semicircular inner arc of radius 7. But the inner arc here is only 90°, not 180°, because the sides are slanted at 45°.',
      '69': 'This uses the given slant length (7√2 cm) as 7 cm — skipping the Pythagorean step. Each slant is 7√2 ≈ 9.8 cm, giving sides total 19.6 cm, not 14 cm.',
      '58': 'This counts only the outer arc and both slanted sides (as 7 cm each), omitting the inner arc. All four boundary segments — outer arc, two slants, and inner arc — must be included.'
    }
  }
};

function selectMCQ(n, btn, value) {
  mcqSelected[n] = value;
  document.querySelectorAll(`#mcq${n}-options .mcq-opt`).forEach(b => b.classList.remove('mcq-opt-selected'));
  btn.classList.add('mcq-opt-selected');
}

function submitMCQ(n) {
  const selected = mcqSelected[n];
  if (!selected) return;
  const cfg = MCQ_CONFIG[n];
  const correct = selected === cfg.correct;
  const feedback = document.getElementById(`mcq${n}-feedback`);
  const nextBtn  = document.getElementById(`btn-mcq${n}-next`);
  if (correct) {
    document.querySelectorAll(`#mcq${n}-options .mcq-opt`).forEach(b => {
      b.disabled = true;
      if (b.dataset.value === cfg.correct) b.classList.add('mcq-opt-correct');
    });
    feedback.textContent = cfg.correctText;
    feedback.className = 'mcq-feedback mcq-feedback-correct';
  } else {
    const wrongBtn = document.querySelector(`#mcq${n}-options .mcq-opt[data-value="${selected}"]`);
    if (wrongBtn) { wrongBtn.disabled = true; wrongBtn.classList.add('mcq-opt-wrong'); }
    mcqSelected[n] = null;
    feedback.textContent = cfg.explanations[selected] || 'Not quite — try again.';
    feedback.className = 'mcq-feedback mcq-feedback-wrong';
  }
  nextBtn.disabled = false;
}

// ─── Insight screen ───────────────────────────────────────────────────────────

const INSIGHT_CFG = { x0: 50, y0: 40, W: 220, H: 200, nSteps: 5 };

let insightAnimRaf = null;

function makeSVGEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function initInsightSVG() {
  const svg = document.getElementById('insight-svg');
  if (!svg) return;
  if (insightAnimRaf) { cancelAnimationFrame(insightAnimRaf); insightAnimRaf = null; }
  svg.innerHTML = '';

  const { x0, y0, W, H, nSteps } = INSIGHT_CFG;
  const sw = W / nSteps;
  const sh = H / nSteps;

  // Shape fill
  let d = `M ${x0},${y0}`;
  for (let i = 0; i < nSteps; i++) {
    d += ` L ${x0+(i+1)*sw},${y0+i*sh} L ${x0+(i+1)*sw},${y0+(i+1)*sh}`;
  }
  d += ` L ${x0},${y0+H} Z`;
  svg.appendChild(makeSVGEl('path', { d, class: 'insight-shape-fill' }));

  // Static left and bottom edges
  svg.appendChild(makeSVGEl('line', { x1: x0, y1: y0+H, x2: x0, y2: y0, class: 'insight-static-edge' }));
  svg.appendChild(makeSVGEl('line', { x1: x0, y1: y0+H, x2: x0+W, y2: y0+H, class: 'insight-static-edge' }));

  // Dimension labels (static)
  const lbl = (x, y, text, rot) => {
    const t = makeSVGEl('text', { x, y, class: 'insight-dim-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    if (rot) t.setAttribute('transform', `rotate(${rot},${x},${y})`);
    t.textContent = text;
    svg.appendChild(t);
  };
  lbl(x0 + W/2, y0 + H + 22, 'W = 9 cm');
  lbl(x0 - 20, y0 + H/2, 'H = 6 cm', -90);

  // Colored stair step edges
  for (let i = 0; i < nSteps; i++) {
    const hx1 = x0 + i*sw,     hy = y0 + i*sh, hx2 = x0 + (i+1)*sw;
    const vx  = x0 + (i+1)*sw, vy1 = y0 + i*sh, vy2 = y0 + (i+1)*sh;
    svg.appendChild(makeSVGEl('line', { id: `ih-${i}`, x1: hx1, y1: hy, x2: hx2, y2: hy, class: 'insight-horiz-edge' }));
    svg.appendChild(makeSVGEl('line', { id: `iv-${i}`, x1: vx,  y1: vy1, x2: vx,  y2: vy2, class: 'insight-vert-edge' }));
  }

  const btn = document.getElementById('btn-animate');
  if (btn) { btn.disabled = false; btn.innerHTML = '&#9654; Animate'; btn.onclick = runInsightAnimation; }
}

function runInsightAnimation() {
  if (insightAnimRaf) cancelAnimationFrame(insightAnimRaf);
  const btn = document.getElementById('btn-animate');
  if (btn) btn.disabled = true;

  const { x0, y0, W, H, nSteps } = INSIGHT_CFG;
  const sw = W / nSteps;
  const sh = H / nSteps;
  const DURATION = 2600;
  const start = performance.now();

  function ease(t) { return t < 0.5 ? 2*t*t : -1 + (4-2*t)*t; }

  function frame(now) {
    const raw = Math.min((now - start) / DURATION, 1);
    // Phase 1 (raw 0→0.5): horizontal edges rise to y0
    // Phase 2 (raw 0.5→1): vertical edges slide to x0+W
    const p1 = ease(Math.min(raw * 2, 1));
    const p2 = ease(Math.max((raw - 0.5) * 2, 0));

    for (let i = 0; i < nSteps; i++) {
      const origHy = y0 + i*sh;
      const hy = origHy + (y0 - origHy) * p1;
      const hLine = document.getElementById(`ih-${i}`);
      if (hLine) { hLine.setAttribute('y1', hy); hLine.setAttribute('y2', hy); }

      const origVx = x0 + (i+1)*sw;
      const vx = origVx + (x0 + W - origVx) * p2;
      const vLine = document.getElementById(`iv-${i}`);
      if (vLine) { vLine.setAttribute('x1', vx); vLine.setAttribute('x2', vx); }
    }

    if (raw < 1) {
      insightAnimRaf = requestAnimationFrame(frame);
    } else {
      insightAnimRaf = null;
      showInsightResult();
    }
  }
  insightAnimRaf = requestAnimationFrame(frame);
}

function showInsightResult() {
  const svg = document.getElementById('insight-svg');
  if (!svg) return;
  const { x0, y0, W, H } = INSIGHT_CFG;

  // Top edge label (blue)
  const top = makeSVGEl('text', { x: x0+W/2, y: y0-16, class: 'insight-result-label insight-result-blue', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  top.textContent = 'W = 9 cm';
  svg.appendChild(top);

  // Right edge label (orange)
  const right = makeSVGEl('text', { x: x0+W+26, y: y0+H/2, class: 'insight-result-label insight-result-orange', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  right.setAttribute('transform', `rotate(-90,${x0+W+26},${y0+H/2})`);
  right.textContent = 'H = 6 cm';
  svg.appendChild(right);

  // Result formula
  const res = makeSVGEl('text', { x: x0+W/2, y: y0+H+42, class: 'insight-result-formula', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  res.textContent = 'P = 2(9 + 6) = 30 cm';
  svg.appendChild(res);

  const btn = document.getElementById('btn-animate');
  if (btn) { btn.disabled = false; btn.innerHTML = '&#8635; Reset'; btn.onclick = initInsightSVG; }
}

document.addEventListener('DOMContentLoaded', () => {
  ['screen-main', 'screen-circles', 'screen-2', 'screen-expl', 'screen-3', 'screen-4', 'screen-mcq3', 'screen-mcq3-expl', 'screen-mcq4', 'screen-mcq4-expl'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
});

function initMCQ4Expl() {
  ['mcq4-anim-rs', 'mcq4-anim-oa', 'mcq4-anim-ls', 'mcq4-anim-ia'].forEach(id => {
    const path = document.getElementById(id);
    if (!path) return;
    const len = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });
  ['mcq4-lbl-rs', 'mcq4-lbl-oa', 'mcq4-lbl-ls', 'mcq4-lbl-ia', 'mcq4-lbl-tot'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('visibility', 'hidden');
  });
}

function animMCQ4Seg(segId, labelIds) {
  const path = document.getElementById(segId);
  if (!path) return;
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  path.style.transition = 'none';
  path.getBoundingClientRect();
  path.style.transition = 'stroke-dashoffset 1.2s ease';
  path.style.strokeDashoffset = 0;
  if (labelIds) {
    setTimeout(() => {
      (Array.isArray(labelIds) ? labelIds : [labelIds]).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('visibility', 'visible');
      });
    }, 1300);
  }
}

function animMCQ4Outer()  { animMCQ4Seg('mcq4-anim-oa', ['mcq4-lbl-oa']); }
function animMCQ4Slants() { animMCQ4Seg('mcq4-anim-rs', ['mcq4-lbl-rs']); animMCQ4Seg('mcq4-anim-ls', ['mcq4-lbl-ls']); }
function animMCQ4Inner()  { animMCQ4Seg('mcq4-anim-ia', ['mcq4-lbl-ia']); }
function showMCQ4TotalLabel() {
  const el = document.getElementById('mcq4-lbl-tot');
  if (el) el.setAttribute('visibility', 'visible');
}
