/* ============================================================
   WALK TRACKER — Distance vs Displacement Simulator
   ============================================================ */

'use strict';

/* ── state ── */
const app = {
  currentScreen: 'screen-intro',
  selectedPath: 'zigzag',
  q1Done: false,
  q2Done: false,
  sim: {
    waypoints: [], dragging: false,
    charX: 0, charY: 0, startX: 0, startY: 0
  },
  circle: { animId: null, startAngle: -Math.PI / 2 },
  vec: {
    startX: 0, startY: 0, tipX: 0, tipY: 0,
    dragging: false
  },
  speedSim: {
    waypoints: [], dragging: false,
    charX: 0, charY: 0, startX: 0, startY: 0,
    time: 4.0
  }
};

/* ── pixels per metre ── */
const PX_PER_M = 50;

/* ── back-navigation map ── */
const PREV_SCREEN = {
  'screen-1': 'screen-intro',
  'screen-2': 'screen-1',
  'screen-3': 'screen-2',
  'screen-4': 'screen-3',
  'screen-5': 'screen-4',
  'screen-6': 'screen-5',
  'screen-7':  'screen-6',
  'screen-8':  'screen-7',
  'screen-9':  'screen-8',
  'screen-10': 'screen-9',
  'screen-11': 'screen-10',
  'screen-12': 'screen-11'
};

function goBack() {
  const prev = PREV_SCREEN[app.currentScreen];
  if (prev) goToScreen(prev);
}

/* ============================================================
   NARRATION DATA
   dur = estimated ms for the progress-bar animation only;
   actual step advancement is driven by utterance.onend.
   ============================================================ */
const NARR = {
  'screen-1': [
    { text: 'Welcome to Walk Tracker! Here you choose a path type. Let\'s understand how each motion differs in distance and displacement.', hl: '#s1-header', dur: 12000 },
    { text: 'STRAIGHT-LINE motion: you walk directly from point A to B without any turns. Distance equals the length of that straight path. Displacement also equals that same straight stretch — they are EQUAL. When you never change direction, distance = displacement.', hl: '#path-straight', dur: 22000 },
    { text: 'ZIG-ZAG motion: you change direction multiple times. Every extra turn adds to the total path length, so DISTANCE grows large. But displacement only measures the straight line from start to your current position — much shorter! Distance is GREATER than displacement.', hl: '#path-zigzag', dur: 23000 },
    { text: 'CIRCULAR motion: the most dramatic case! You walk a full loop and return exactly to your starting point. Distance equals the full circumference — every single step counts. But displacement equals ZERO because start and end are the same point. Same journey: distance is not zero, displacement is zero!', hl: '#path-circular', dur: 25000 },
    { text: 'Select any path and click Start Walking. The distance and displacement values will update live as you drag the character.', hl: '#start-btn', dur: 13000 }
  ],
  'screen-2': [
    { text: 'This is the main simulator. Drag the green dot anywhere on the grid — your path will be traced automatically.', hl: '#canvas-wrap-2', dur: 11000 },
    { text: 'The RED dashed line traces every step you take. The total length of this line is your DISTANCE — it only grows, never shrinks.', hl: '#sim-dist-card', dur: 14000 },
    { text: 'The BLUE solid arrow always points straight from the starting point S to your current position. That straight-line stretch is your DISPLACEMENT.', hl: '#sim-disp-card', dur: 13000 },
    { text: 'Try zigzagging back and forth. Notice distance keeps climbing while displacement may stay small — or even go back toward zero!', hl: '#canvas-wrap-2', dur: 13000 },
    { text: 'When you are ready, click Next to see the most dramatic example — the circular path.', hl: '#canvas-wrap-2', dur: 9000 }
  ],
  'screen-3': [
    { text: 'Watch carefully as the character walks one complete circle. The RED dashed trail grows with every step — that is accumulating distance.', hl: '#canvas-wrap-3', dur: 13000 },
    { text: 'The blue displacement arrow stretches outward as the character moves away from the start — but notice what happens at the end!', hl: '#circle-disp-card', dur: 13000 },
    { text: 'After one full lap the character is back exactly where it started. Displacement collapses to ZERO — even though distance travelled was 9.42 metres!', hl: '#circle-dist-card', dur: 15000 },
    { text: 'Key insight: distance equals 9.42 metres, displacement equals 0 metres. Same journey, completely different answers. Tap "Why is this 0?" to unlock the explanation.', hl: '#why-btn', dur: 15000 }
  ],
  'screen-4': [
    { text: 'Time to test your understanding! These questions convert what you saw into active recall — the most powerful way to lock in a concept.', hl: '#challenge-header', dur: 14000 },
    { text: 'Question 1 is conceptual. Think back to the circular path animation you just watched. Can displacement be zero while distance is NOT zero?', hl: '#q1-card', dur: 14000 },
    { text: 'Question 2 asks for the MAXIMUM possible displacement for a 10-metre path. Hint: which path shape makes start-to-end distance as large as possible?', hl: '#q2-card', dur: 14000 }
  ],
  'screen-5': [
    { text: 'Advanced mode — this is the bridge to Class 11 vectors. Displacement is broken into its horizontal and vertical components.', hl: '#advanced-badge', dur: 12000 },
    { text: 'The green horizontal arrow shows d-x — how far the end point is to the RIGHT of the start point.', hl: '#dx-card', dur: 12000 },
    { text: 'The green vertical arrow shows d-y — how far the end point is ABOVE the start point.', hl: '#dy-card', dur: 10000 },
    { text: 'The magnitude of displacement is the hypotenuse: square root of d-x squared plus d-y squared. This is just the Pythagorean theorem!', hl: '#mag-card', dur: 13000 },
    { text: 'Theta gives the direction angle. Drag the blue arrow tip on the canvas to explore how the components and magnitude change in real time.', hl: '#theta-card', dur: 14000 }
  ],
  'screen-6': [
    { text: 'Session complete! You have now experienced — not just read — the difference between distance and displacement.', hl: '#recap-title', dur: 10000 },
    { text: 'Key 1: Distance is scalar. It is the total path length — always positive, direction does not matter at all.', hl: '#recap-1', dur: 12000 },
    { text: 'Key 2: Displacement is a vector. It points straight from start to end and can be zero, small, or even negative.', hl: '#recap-2', dur: 13000 },
    { text: 'Key 3: They can give wildly different numbers for the SAME journey. The circle walk proved it — 9.42 metres vs 0 metres. Ready to go further? Click Next to discover speed and velocity!', hl: '#recap-3', dur: 17000 }
  ],
  'screen-7': [
    { text: 'Time transforms position into motion. Until now we only talked about WHERE — now we add WHEN. That single addition unlocks two brand new quantities.', hl: '#s7-header', dur: 13000 },
    { text: 'Drag the character on the grid. The red dashed trail records every step — that growing total is your DISTANCE. Move around freely to build up a path.', hl: '#s7-canvas-wrap', dur: 14000 },
    { text: 'Look at the DISTANCE card — it shows the total length of your path so far. Distance is a scalar: only the amount matters, not the direction. It can only grow, never shrink.', hl: '#s7-dist-card', dur: 14000 },
    { text: 'The blue arrow always points straight from the starting point S to your current position. That is DISPLACEMENT — a vector with both size and direction.', hl: '#s7-disp-card', dur: 14000 },
    { text: 'Now look at the TIME TAKEN box — type how long the walk took. SPEED equals distance divided by whatever time you enter. Try typing 2, then 8. Same path, completely different speed!', hl: '#s7-time-section', dur: 16000 },
    { text: 'SPEED — the orange card — is scalar. Just how many metres of path per second. No direction survives.', hl: '#s7-speed-card', dur: 11000 },
    { text: 'VELOCITY — the purple card — is a vector. Same division, but it divides DISPLACEMENT, so the direction tag travels through untouched. Direction carries through division — that is why velocity stays a vector.', hl: '#s7-velocity-card', dur: 18000 }
  ],
  'screen-8': [
    { text: 'Two formulas, two very different results. The pattern is crisp: what goes in determines what comes out.', hl: '#s8-header', dur: 11000 },
    { text: 'Left panel — SPEED. A scalar divided by time. The formula: speed equals distance divided by time. Here: 12.4 metres divided by 4 seconds equals 3.1 metres per second. No compass direction at all.', hl: '#s8-speed-panel', dur: 17000 },
    { text: 'The worked example walks you through it step by step. Notice how the direction tag is simply absent — scalars have nothing to pass on.', hl: '#s8-speed-formula', dur: 13000 },
    { text: 'Right panel — VELOCITY. A vector divided by time. The formula: velocity equals displacement divided by time. The direction tag 28 degrees NE rides through the division completely unchanged.', hl: '#s8-velocity-panel', dur: 17000 },
    { text: 'Result: 1.8 metres per second pointing 28 degrees NE. Magnitude shrank when we divided by 4 — but direction stayed exactly the same.', hl: '#s8-velocity-formula', dur: 14000 },
    { text: 'The shortcut: time is a plain number — it has no direction to add or remove. Scalar in, scalar out. Vector in, vector out. That is the entire story.', hl: '#s8-shortcut', dur: 15000 }
  ],
  'screen-9': [
    { text: 'One question separates all four quantities: does direction matter? Answer yes — you have a vector. Answer no — you have a scalar.', hl: '#s9-header', dur: 13000 },
    { text: 'The SCALAR column: Distance and Speed. Both are magnitude only — a number and a unit, nothing more. Always positive. Add like ordinary numbers: 5 metres plus 3 metres equals 8 metres, full stop.', hl: '#s9-scalar-panel', dur: 18000 },
    { text: 'The VECTOR column: Displacement and Velocity. Both carry magnitude AND direction. The arrow matters. They add head-to-tail: 3 metres east plus 4 metres north equals 5 metres at 53 degrees — not 7 metres!', hl: '#s9-vector-panel', dur: 20000 },
    { text: 'The pattern locks everything together. Scalar divided by time equals scalar — distance becomes speed. Vector divided by time equals vector — displacement becomes velocity. Four quantities, one unifying rule.', hl: '#s9-pattern', dur: 18000 }
  ],
  'screen-10': [
    { text: 'Here is a classic JEE-style question. A particle moves at constant speed v along a semicircular arc of radius R from point A to point B. What is the magnitude of its average velocity?', hl: '#s10-header', dur: 14000 },
    { text: 'Look at the diagram. The red dashed arc is the actual path — length equals pi times R, exactly half a full circumference. The blue line from A to B is the displacement — the diameter, which equals 2R.', hl: '#s10-canvas', dur: 17000 },
    { text: 'Key: average velocity equals displacement divided by time. Time equals path divided by speed, so time equals pi R over v. Now divide displacement 2R by that time to get 2v over pi.', hl: '#s10-mcq', dur: 16000 },
    { text: 'Choose your answer. Remember: average velocity uses displacement, not path length. That is the single most important difference between speed and velocity!', hl: '#s10-mcq', dur: 12000 }
  ],
  'screen-11': [
    { text: 'Let us build the answer one step at a time. Step 1 — path length. A semicircle is half of a full circle. Full circumference is 2 pi R, so the arc is pi R.', hl: '#s11-step1', dur: 14000 },
    { text: 'Step 2 — time taken. Speed is constant, so time equals path divided by speed. That gives pi R divided by v.', hl: '#s11-step2', dur: 11000 },
    { text: 'Step 3 — displacement. The straight line from A to B is the diameter of the semicircle. Displacement equals 2R. Path was pi R but displacement is only 2R — they are different!', hl: '#s11-step3', dur: 14000 },
    { text: 'Step 4 — average velocity. Divide displacement by time: 2R divided by pi R over v equals 2R times v over pi R. The R cancels, leaving 2v over pi — about 0.64 v. Answer C.', hl: '#s11-step4', dur: 17000 },
    { text: 'The pattern: whenever the path curves, path is greater than displacement, so average speed is always greater than average velocity. They are equal only on a perfectly straight path.', hl: '#s11-pattern', dur: 16000 }
  ],
  'screen-12': [
    { text: 'Now explore this yourself. Pick any arc angle from 30 to 360 degrees. The diagram, the path length, the displacement, and the average velocity all recalculate together instantly.', hl: '#s12-header', dur: 14000 },
    { text: 'The red dashed arc is the path — length equals R times theta in radians. The dotted chord from A to B is the displacement — 2R times sine of theta over 2.', hl: '#s12-canvas', dur: 14000 },
    { text: 'Try 360 degrees — a full circle. Displacement collapses to zero because you end exactly where you started. Average velocity is zero, even though the particle is still moving at speed v the whole time!', hl: '#s12-angle-grid', dur: 17000 },
    { text: 'Now try 30 degrees — a tiny arc. The chord is nearly equal to the arc, so displacement nearly equals path length, and average velocity nearly equals speed. The smaller the arc, the closer the two become.', hl: '#s12-calc-col', dur: 17000 }
  ]
};

/* ============================================================
   NARRATION ENGINE
   ============================================================ */
const narrSt = {};  /* per-screen: { step, playing, timerId } */

/* Chrome has a bug where speechSynthesis pauses itself after ~15 s.
   Periodic pause→resume keeps it alive for long utterances. */
let _ttsKeepalive = null;
function _startKeepalive() {
  _stopKeepalive();
  if (!window.speechSynthesis) return;
  _ttsKeepalive = setInterval(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      speechSynthesis.resume();
    }
  }, 8000);
}
function _stopKeepalive() {
  if (_ttsKeepalive) { clearInterval(_ttsKeepalive); _ttsKeepalive = null; }
}

function initNarr(id) {
  if (!narrSt[id]) narrSt[id] = { step: 0, playing: false, timerId: null };
}

function setNarrText(id, text) {
  const el = document.getElementById('narration-' + id);
  if (el) el.textContent = text;
}

function clearHighlights() {
  document.querySelectorAll('.narration-highlight')
    .forEach(el => el.classList.remove('narration-highlight'));
}

function applyHighlight(selector) {
  if (!selector) return;
  const targets = document.querySelectorAll(selector);
  targets.forEach(el => el.classList.add('narration-highlight'));
}

function animateFill(id, dur) {
  const fill = document.getElementById('fill-' + id);
  if (!fill) return;
  fill.style.transition = 'none';
  fill.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.transition = `width ${dur}ms linear`;
      fill.style.width = '100%';
    });
  });
}

function freezeFill(id) {
  const fill = document.getElementById('fill-' + id);
  if (!fill) return;
  const pct = fill.getBoundingClientRect().width /
               (fill.parentElement.getBoundingClientRect().width || 1) * 100;
  fill.style.transition = 'none';
  fill.style.width = pct + '%';
}

function resetFill(id) {
  const fill = document.getElementById('fill-' + id);
  if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
}

function runStep(id) {
  const ns = narrSt[id];
  const steps = NARR[id];
  if (!ns || !steps || ns.step >= steps.length) { stopNarr(id); return; }

  const s = steps[ns.step];
  const stepIndex = ns.step;
  setNarrText(id, s.text);
  clearHighlights();
  applyHighlight(s.hl);
  animateFill(id, s.dur);

  /* advance() is called when speech ends naturally or via fallback timer.
     Guards ensure it only fires once and only while still on this step. */
  let advanced = false;
  function advance() {
    if (advanced) return;
    if (!ns.playing || ns.step !== stepIndex) return;
    advanced = true;
    clearTimeout(ns.timerId);
    ns.timerId = null;
    ns.step++;
    if (ns.step < steps.length) runStep(id);
    else stopNarr(id);
  }

  if (window.speechSynthesis) {
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(s.text);
    utt.rate = 0.92;
    utt.pitch = 1.0;
    /* Drive step advancement from speech completion, not a fixed timer */
    utt.onend = advance;
    /* onerror fires when cancelled (interrupted) — skip; other errors: advance */
    utt.onerror = ev => { if (ev.error !== 'interrupted') advance(); };
    speechSynthesis.speak(utt);
    _startKeepalive();
    /* Fallback: if onend never fires, advance after dur + generous buffer */
    ns.timerId = setTimeout(advance, s.dur + 5000);
  } else {
    /* No TTS: use the estimated dur directly */
    ns.timerId = setTimeout(advance, s.dur);
  }
}

function toggleNarration(id) {
  initNarr(id);
  const ns = narrSt[id];
  const btn = document.getElementById('playbtn-' + id);
  if (ns.playing) {
    /* Pause */
    ns.playing = false;
    clearTimeout(ns.timerId);
    ns.timerId = null;
    if (window.speechSynthesis) speechSynthesis.cancel();
    freezeFill(id);
    if (btn) { btn.textContent = '▶ Play'; btn.classList.remove('playing'); }
  } else {
    /* Play */
    ns.playing = true;
    if (btn) { btn.textContent = '⏸ Pause'; btn.classList.add('playing'); }
    runStep(id);
  }
}

function restartNarration(id) {
  stopNarr(id);
  initNarr(id);
  narrSt[id].step = 0;
  resetFill(id);
  setNarrText(id, 'Click ▶ Play to start narration.');
}

function stopNarr(id) {
  const ns = narrSt[id];
  if (ns) {
    ns.playing = false;
    clearTimeout(ns.timerId);
    ns.timerId = null;
  }
  const btn = document.getElementById('playbtn-' + id);
  if (btn) { btn.textContent = '▶ Play'; btn.classList.remove('playing'); }
  clearHighlights();
  _stopKeepalive();
  if (window.speechSynthesis) speechSynthesis.cancel();
}

/* ============================================================
   SCREEN NAVIGATION
   ============================================================ */
function goToScreen(id) {
  /* Stop narration and circle animation on current screen */
  stopNarr(app.currentScreen);
  if (app.circle.animId) {
    cancelAnimationFrame(app.circle.animId);
    app.circle.animId = null;
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) t.classList.add('active');
  app.currentScreen = id;

  /* Reset narration state for the incoming screen */
  if (narrSt[id]) {
    narrSt[id].step = 0;
    narrSt[id].playing = false;
    if (narrSt[id].timerId) { clearTimeout(narrSt[id].timerId); narrSt[id].timerId = null; }
  } else {
    initNarr(id);
  }
  resetFill(id);

  /* Screen-specific initialisation */
  if (id === 'screen-2')  { setTimeout(initSimCanvas, 60); }
  if (id === 'screen-3')  { setTimeout(initCircle, 60); }
  if (id === 'screen-5')  { setTimeout(initVectorCanvas, 60); }
  if (id === 'screen-7')  { setTimeout(initSpeedCanvas, 60); }
  if (id === 'screen-10') { setTimeout(drawS10Canvas, 60); }
  if (id === 'screen-11') { setTimeout(drawS11Canvas, 60); }
  if (id === 'screen-12') { setTimeout(initArcActivity, 60); }

  /* Auto-start narration for all screens that have it */
  if (NARR[id]) {
    const narrDelay = (id === 'screen-2' || id === 'screen-3' || id === 'screen-5' || id === 'screen-7' || id === 'screen-12') ? 700 : 500;
    setTimeout(() => {
      if (app.currentScreen === id && !narrSt[id].playing) {
        toggleNarration(id);
      }
    }, narrDelay);
  }

  window.scrollTo(0, 0);
}

/* ============================================================
   SCREEN 1 — PATH SELECTION
   ============================================================ */
function selectPath(type) {
  app.selectedPath = type;
  document.querySelectorAll('.path-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('path-' + type);
  if (card) card.classList.add('selected');
}

function startSimulator() { goToScreen('screen-2'); }

/* ============================================================
   DRAWING HELPERS (shared)
   ============================================================ */
function drawGrid(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.5;
  const cell = 40;
  for (let x = 0; x <= W; x += cell) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += cell) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}

function drawDashedPath(ctx, pts) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.setLineDash([9, 6]);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 4) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(dy, dx);
  const hl = 13;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hl * Math.cos(a - Math.PI / 6), y2 - hl * Math.sin(a - Math.PI / 6));
  ctx.lineTo(x2 - hl * Math.cos(a + Math.PI / 6), y2 - hl * Math.sin(a + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawStartMarker(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', x, y);
  ctx.restore();
}

function drawCharacter(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function dirLabel(dx, dy) {
  const a = Math.atan2(dy, dx) * 180 / Math.PI;
  if (a >= -22.5  && a <  22.5)  return 'E →';
  if (a >=  22.5  && a <  67.5)  return 'NE ↗';
  if (a >=  67.5  && a < 112.5)  return 'N ↑';
  if (a >= 112.5  && a < 157.5)  return 'NW ↖';
  if (a >= -67.5  && a < -22.5)  return 'SE ↘';
  if (a >= -112.5 && a < -67.5)  return 'S ↓';
  if (a >= -157.5 && a < -112.5) return 'SW ↙';
  return 'W ←';
}

/* ============================================================
   SCREEN 2 — SIMULATOR
   ============================================================ */
function initSimCanvas() {
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;
  const W = canvas.width, H = canvas.height;
  const sx = 80, sy = Math.round(H * 0.65);

  Object.assign(app.sim, {
    waypoints: [{ x: sx, y: sy }], dragging: false,
    charX: sx, charY: sy, startX: sx, startY: sy
  });

  updateSimReadouts();
  renderSim();

  /* ── Mouse ── */
  canvas.onmousedown  = e => { if (hitChar(e, canvas)) app.sim.dragging = true; };
  canvas.onmousemove  = e => { if (app.sim.dragging) moveSim(e, canvas); };
  canvas.onmouseup    = ()  => { commitSim(); app.sim.dragging = false; };
  canvas.onmouseleave = ()  => { commitSim(); app.sim.dragging = false; };
  /* ── Touch ── */
  canvas.ontouchstart = e => { e.preventDefault(); if (hitCharTouch(e, canvas)) app.sim.dragging = true; };
  canvas.ontouchmove  = e => { e.preventDefault(); if (app.sim.dragging) moveSimTouch(e, canvas); };
  canvas.ontouchend   = ()  => { commitSim(); app.sim.dragging = false; };
}

function commitSim() {
  if (!app.sim.dragging) return;
  const pts = app.sim.waypoints;
  const last = pts[pts.length - 1];
  if (Math.hypot(app.sim.charX - last.x, app.sim.charY - last.y) > 2)
    pts.push({ x: app.sim.charX, y: app.sim.charY });
}

function clientToCanvas(e, canvas) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (canvas.width  / r.width),
    y: (e.clientY - r.top)  * (canvas.height / r.height)
  };
}
function clientToCanvasTouch(e, canvas) {
  const r = canvas.getBoundingClientRect(), t = e.touches[0];
  return {
    x: (t.clientX - r.left) * (canvas.width  / r.width),
    y: (t.clientY - r.top)  * (canvas.height / r.height)
  };
}
function hitChar(e, canvas) {
  const p = clientToCanvas(e, canvas);
  return Math.hypot(p.x - app.sim.charX, p.y - app.sim.charY) < 30;
}
function hitCharTouch(e, canvas) {
  const p = clientToCanvasTouch(e, canvas);
  return Math.hypot(p.x - app.sim.charX, p.y - app.sim.charY) < 40;
}

function moveSim(e, canvas) {
  const p = clientToCanvas(e, canvas);
  applyMove(p.x, p.y, canvas);
}
function moveSimTouch(e, canvas) {
  const p = clientToCanvasTouch(e, canvas);
  applyMove(p.x, p.y, canvas);
}
function applyMove(mx, my, canvas) {
  const W = canvas.width, H = canvas.height;
  const cx = Math.max(20, Math.min(W - 20, mx));
  const cy = Math.max(20, Math.min(H - 20, my));
  app.sim.charX = cx; app.sim.charY = cy;
  updateSimReadouts();
  renderSim();
}

function renderSim() {
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H);

  /* Committed path: straight lines between waypoints */
  const pts = app.sim.waypoints;
  if (pts.length >= 2) {
    ctx.save();
    ctx.setLineDash([9, 6]);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.restore();
  }

  /* Live segment while dragging */
  if (app.sim.dragging && pts.length > 0) {
    const last = pts[pts.length - 1];
    if (Math.hypot(app.sim.charX - last.x, app.sim.charY - last.y) > 4) {
      ctx.save();
      ctx.setLineDash([9, 6]);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(app.sim.charX, app.sim.charY);
      ctx.stroke();
      ctx.restore();
    }
  }

  const dx = app.sim.charX - app.sim.startX;
  const dy = app.sim.charY - app.sim.startY;
  if (Math.hypot(dx, dy) > 6) drawArrow(ctx, app.sim.startX, app.sim.startY, app.sim.charX, app.sim.charY, '#2563eb');
  drawStartMarker(ctx, app.sim.startX, app.sim.startY);
  drawCharacter(ctx, app.sim.charX, app.sim.charY);
}

function simDist() {
  const pts = app.sim.waypoints;
  let d = 0;
  for (let i = 1; i < pts.length; i++)
    d += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
  if (pts.length > 0) {
    const last = pts[pts.length - 1];
    d += Math.hypot(app.sim.charX - last.x, app.sim.charY - last.y);
  }
  return d / PX_PER_M;
}

function updateSimReadouts() {
  const dx = app.sim.charX - app.sim.startX;
  const dy = app.sim.charY - app.sim.startY;
  const disp = Math.hypot(dx, dy) / PX_PER_M;
  const dir  = disp > 0.05 ? dirLabel(dx, -dy) : '';
  const angle = disp > 0.05 ? Math.abs(Math.atan2(-dy, dx) * 180 / Math.PI).toFixed(0) : '0';
  document.getElementById('sim-distance').textContent    = simDist().toFixed(1) + ' m';
  document.getElementById('sim-displacement').textContent = disp.toFixed(1) + ' m';
  document.getElementById('sim-direction').textContent   = disp > 0.05 ? `at ${angle}° ${dir}` : 'at origin';
}

function resetSim() {
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;
  const H = canvas.height;
  const sx = 80, sy = Math.round(H * 0.65);
  Object.assign(app.sim, {
    waypoints: [{ x: sx, y: sy }], dragging: false,
    charX: sx, charY: sy, startX: sx, startY: sy
  });
  updateSimReadouts();
  renderSim();
}

function simNext() { goToScreen('screen-3'); }

/* ============================================================
   SCREEN 3 — CIRCLE ANIMATION
   ============================================================ */
function initCircle() {
  const canvas = document.getElementById('circle-canvas');
  if (!canvas) return;

  if (app.circle.animId) { cancelAnimationFrame(app.circle.animId); app.circle.animId = null; }

  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 - 10;
  const r  = Math.min(W, H) * 0.30;

  /* Reset UI */
  document.getElementById('circle-distance').textContent     = '0.0 m';
  document.getElementById('circle-displacement').textContent = '0 m';
  document.getElementById('circle-displacement').style.color = '#16a34a';
  document.getElementById('why-btn').classList.remove('hidden');
  document.getElementById('why-box').classList.add('hidden');
  document.getElementById('circle-labels').style.visibility = 'hidden';

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H);

  /* Draw the track outline */
  ctx.save();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();

  const startX = cx + r * Math.cos(app.circle.startAngle);
  const startY = cy + r * Math.sin(app.circle.startAngle);
  drawStartMarker(ctx, startX, startY);
  drawCharacter(ctx, startX, startY);

  /* Circumference in metres (radius treated as 1.5 m) */
  const R_M = 1.5;
  const CIRC_M = 2 * Math.PI * R_M;          /* ≈ 9.42 m */
  const ANIM_DUR = 6000;                      /* ms for one full lap */

  let startTime = null;

  function frame(ts) {
    if (!startTime) startTime = ts;
    const elapsed  = ts - startTime;
    const progress = Math.min(elapsed / ANIM_DUR, 1);
    const angle    = app.circle.startAngle + progress * 2 * Math.PI;

    const charX = cx + r * Math.cos(angle);
    const charY = cy + r * Math.sin(angle);
    const distM = progress * CIRC_M;
    const dispPx = Math.hypot(charX - startX, charY - startY);
    const dispM  = dispPx / r * R_M;

    /* Redraw */
    ctx.clearRect(0, 0, W, H);
    drawGrid(ctx, W, H);

    /* Ghost track */
    ctx.save();
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke();
    ctx.restore();

    /* Travelled arc — red dashed */
    ctx.save();
    ctx.setLineDash([9, 6]);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, app.circle.startAngle, angle, false);
    ctx.stroke();
    ctx.restore();

    /* Displacement arrow */
    if (dispPx > 5 && progress < 0.99) {
      drawArrow(ctx, startX, startY, charX, charY, '#2563eb');
    }

    drawStartMarker(ctx, startX, startY);
    drawCharacter(ctx, charX, charY);

    /* Update readouts */
    document.getElementById('circle-distance').textContent = distM.toFixed(2) + ' m';
    if (progress >= 0.99) {
      document.getElementById('circle-displacement').textContent = '0 m';
      document.getElementById('circle-displacement').style.color = '#16a34a';
      document.getElementById('circle-labels').style.visibility = 'visible';
    } else {
      document.getElementById('circle-displacement').textContent = dispM.toFixed(2) + ' m';
      document.getElementById('circle-displacement').style.color = '';
    }

    if (progress < 1) {
      app.circle.animId = requestAnimationFrame(frame);
    }
  }

  setTimeout(() => { app.circle.animId = requestAnimationFrame(frame); }, 700);
}

function showWhy() {
  document.getElementById('why-btn').classList.add('hidden');
  document.getElementById('why-box').classList.remove('hidden');
}

/* ============================================================
   SCREEN 4 — CHALLENGE QUESTIONS
   ============================================================ */
function answerMCQ(btn, qid) {
  const card  = document.getElementById(qid + '-card');
  const btns  = card.querySelectorAll('.mcq-btn');
  const fb    = document.getElementById(qid + '-feedback');
  btns.forEach(b => { b.disabled = true; });

  if (btn.dataset.correct === 'true') {
    btn.classList.add('correct');
    fb.textContent  = '✓  Correct! The circular path proves it — 9.42 m of distance, 0 m of displacement. Same journey, different numbers.';
    fb.className    = 'q-feedback correct';
    app.q1Done      = true;
  } else {
    btn.classList.add('wrong');
    btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
    fb.textContent = '✗  Not quite. Think about walking a full circle — you covered distance but ended exactly where you started!';
    fb.className   = 'q-feedback wrong';
  }
  fb.classList.remove('hidden');
  checkChallengeComplete();
}

function checkQ2() {
  const input = document.getElementById('q2-input');
  const fb    = document.getElementById('q2-feedback');
  const val   = parseFloat(input.value);

  if (isNaN(val)) {
    fb.textContent = 'Please enter a number.';
    fb.className   = 'q-feedback wrong';
    fb.classList.remove('hidden');
    return;
  }
  if (Math.abs(val - 10) <= 0.5) {
    fb.textContent = '✓  Correct! Maximum displacement equals the total path length (10 m) — but ONLY when the path is a perfectly straight line. Any detour adds to distance without helping displacement.';
    fb.className   = 'q-feedback correct';
    fb.classList.remove('hidden');
    input.disabled = true;
    app.q2Done     = true;
    checkChallengeComplete();
  } else {
    fb.textContent = '✗  Not quite. Think: on which path shape would start-to-end distance be at its greatest? (Answer: 10 m)';
    fb.className   = 'q-feedback wrong';
    fb.classList.remove('hidden');
  }
}

function showHint() {
  document.getElementById('hint-text').classList.remove('hidden');
}

function checkChallengeComplete() {
  if (app.q1Done || app.q2Done) {
    document.getElementById('challenge-next').classList.remove('hidden');
  }
}

/* ============================================================
   SCREEN 5 — VECTOR / ADVANCED CANVAS
   ============================================================ */
function initVectorCanvas() {
  const canvas = document.getElementById('vector-canvas');
  if (!canvas) return;
  const W = canvas.width, H = canvas.height;

  const sx = 90;
  const sy = Math.round(H * 0.76);
  const tx = sx + 6 * PX_PER_M;   /* 6 m east  */
  const ty = sy - 4 * PX_PER_M;   /* 4 m north */

  app.vec.startX = sx; app.vec.startY = sy;
  app.vec.tipX   = Math.min(tx, W - 20);
  app.vec.tipY   = Math.max(ty, 20);

  renderVec();
  updateVecReadouts();

  /* ── Drag tip ── */
  canvas.onmousedown = e => {
    const p = clientToCanvas(e, canvas);
    if (Math.hypot(p.x - app.vec.tipX, p.y - app.vec.tipY) < 22) app.vec.dragging = true;
  };
  canvas.onmousemove = e => {
    if (!app.vec.dragging) return;
    const p = clientToCanvas(e, canvas);
    app.vec.tipX = Math.max(app.vec.startX + 5, Math.min(W - 20, p.x));
    app.vec.tipY = Math.max(20, Math.min(app.vec.startY - 5, p.y));
    renderVec(); updateVecReadouts();
  };
  canvas.onmouseup    = () => { app.vec.dragging = false; };
  canvas.onmouseleave = () => { app.vec.dragging = false; };

  canvas.ontouchstart = e => {
    e.preventDefault();
    const p = clientToCanvasTouch(e, canvas);
    if (Math.hypot(p.x - app.vec.tipX, p.y - app.vec.tipY) < 30) app.vec.dragging = true;
  };
  canvas.ontouchmove = e => {
    e.preventDefault();
    if (!app.vec.dragging) return;
    const p = clientToCanvasTouch(e, canvas);
    app.vec.tipX = Math.max(app.vec.startX + 5, Math.min(W - 20, p.x));
    app.vec.tipY = Math.max(20, Math.min(app.vec.startY - 5, p.y));
    renderVec(); updateVecReadouts();
  };
  canvas.ontouchend = () => { app.vec.dragging = false; };
}

function renderVec() {
  const canvas = document.getElementById('vector-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const { startX: sx, startY: sy, tipX: tx, tipY: ty } = app.vec;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H);

  const dxM = (tx - sx) / PX_PER_M;
  const dyM = (sy - ty) / PX_PER_M;

  /* Axis arrows */
  ctx.save();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(sx - 10, sy); ctx.lineTo(W - 16, sy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx, sy + 10); ctx.lineTo(sx, 14); ctx.stroke();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath(); ctx.moveTo(W - 16, sy); ctx.lineTo(W - 26, sy - 5); ctx.lineTo(W - 26, sy + 5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx, 14); ctx.lineTo(sx - 5, 24); ctx.lineTo(sx + 5, 24); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif';
  ctx.fillText('x', W - 14, sy - 6);
  ctx.fillText('y', sx + 6, 18);
  ctx.restore();

  /* dx component — green dashed horizontal */
  ctx.save();
  ctx.setLineDash([6, 4]); ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, sy); ctx.stroke();
  /* dy component — green dashed vertical */
  ctx.beginPath(); ctx.moveTo(tx, sy); ctx.lineTo(tx, ty); ctx.stroke();
  ctx.restore();

  /* Right-angle box */
  const b = 10;
  ctx.save();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(tx - b, sy); ctx.lineTo(tx - b, sy - b); ctx.lineTo(tx, sy - b); ctx.stroke();
  ctx.restore();

  /* Component labels */
  ctx.save();
  ctx.fillStyle = '#16a34a'; ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`dₓ = ${dxM.toFixed(1)} m`, (sx + tx) / 2, sy + 20);
  ctx.textAlign = 'right';
  ctx.fillText(`d_y = ${dyM.toFixed(1)} m`, tx - 4, (sy + ty) / 2 + 4);
  ctx.restore();

  /* Main displacement arrow — blue */
  drawArrow(ctx, sx, sy, tx, ty, '#2563eb');

  /* d⃗ label near midpoint */
  ctx.save();
  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 17px serif';
  ctx.fillText('d⃗', (sx + tx) / 2 - 18, (sy + ty) / 2 - 10);
  ctx.restore();

  /* Start marker & draggable tip */
  drawStartMarker(ctx, sx, sy);

  ctx.save();
  ctx.fillStyle = '#2563eb';
  ctx.beginPath(); ctx.arc(tx, ty, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(tx, ty, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function updateVecReadouts() {
  const { startX: sx, startY: sy, tipX: tx, tipY: ty } = app.vec;
  const dxM  = (tx - sx) / PX_PER_M;
  const dyM  = (sy - ty) / PX_PER_M;
  const mag  = Math.hypot(dxM, dyM);
  const theta = Math.atan2(dyM, dxM) * 180 / Math.PI;

  document.getElementById('dx-value').textContent    = `dₓ = ${dxM.toFixed(1)} m`;
  document.getElementById('dy-value').textContent    = `d_y = ${dyM.toFixed(1)} m`;
  document.getElementById('mag-value').textContent   = `= ${mag.toFixed(2)} m`;
  document.getElementById('theta-value').textContent =
    `θ = tan⁻¹(${dyM.toFixed(1)}/${dxM.toFixed(1)}) ≈ ${theta.toFixed(1)}°`;
}

/* ============================================================
   SCREEN 7 — SPEED & VELOCITY CANVAS
   ============================================================ */
function initSpeedCanvas() {
  const canvas = document.getElementById('speed-canvas');
  if (!canvas) return;
  const W = canvas.width, H = canvas.height;
  const sx = 80, sy = Math.round(H * 0.65);

  Object.assign(app.speedSim, {
    waypoints: [{ x: sx, y: sy }], dragging: false,
    charX: sx, charY: sy, startX: sx, startY: sy
  });

  const ti = document.getElementById('s7-time-input');
  app.speedSim.time = ti ? (parseFloat(ti.value) || 4.0) : 4.0;

  renderSpeedSim();
  updateSpeedReadouts();

  canvas.onmousedown  = e => { if (_hitSpeed(e, canvas))      app.speedSim.dragging = true; };
  canvas.onmousemove  = e => { if (app.speedSim.dragging) _moveSpeed(clientToCanvas(e, canvas), canvas); };
  canvas.onmouseup    = () => { commitSpeedSim(); app.speedSim.dragging = false; };
  canvas.onmouseleave = () => { commitSpeedSim(); app.speedSim.dragging = false; };
  canvas.ontouchstart = e => { e.preventDefault(); if (_hitSpeedT(e, canvas)) app.speedSim.dragging = true; };
  canvas.ontouchmove  = e => { e.preventDefault(); if (app.speedSim.dragging) _moveSpeed(clientToCanvasTouch(e, canvas), canvas); };
  canvas.ontouchend   = () => { commitSpeedSim(); app.speedSim.dragging = false; };
}

function commitSpeedSim() {
  if (!app.speedSim.dragging) return;
  const pts = app.speedSim.waypoints;
  const last = pts[pts.length - 1];
  if (Math.hypot(app.speedSim.charX - last.x, app.speedSim.charY - last.y) > 2)
    pts.push({ x: app.speedSim.charX, y: app.speedSim.charY });
}

function _hitSpeed(e, canvas) {
  const p = clientToCanvas(e, canvas);
  return Math.hypot(p.x - app.speedSim.charX, p.y - app.speedSim.charY) < 30;
}
function _hitSpeedT(e, canvas) {
  const p = clientToCanvasTouch(e, canvas);
  return Math.hypot(p.x - app.speedSim.charX, p.y - app.speedSim.charY) < 40;
}
function _moveSpeed(p, canvas) {
  const W = canvas.width, H = canvas.height;
  const cx = Math.max(20, Math.min(W - 20, p.x));
  const cy = Math.max(20, Math.min(H - 20, p.y));
  app.speedSim.charX = cx; app.speedSim.charY = cy;
  renderSpeedSim();
  updateSpeedReadouts();
}

function renderSpeedSim() {
  const canvas = document.getElementById('speed-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H);

  /* Committed path: straight lines between waypoints */
  const pts = app.speedSim.waypoints;
  if (pts.length >= 2) {
    ctx.save();
    ctx.setLineDash([9, 6]);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.restore();
  }

  /* Live segment while dragging */
  if (app.speedSim.dragging && pts.length > 0) {
    const last = pts[pts.length - 1];
    if (Math.hypot(app.speedSim.charX - last.x, app.speedSim.charY - last.y) > 4) {
      ctx.save();
      ctx.setLineDash([9, 6]);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(app.speedSim.charX, app.speedSim.charY);
      ctx.stroke();
      ctx.restore();
    }
  }

  const dx = app.speedSim.charX - app.speedSim.startX;
  const dy = app.speedSim.charY - app.speedSim.startY;
  if (Math.hypot(dx, dy) > 6)
    drawArrow(ctx, app.speedSim.startX, app.speedSim.startY, app.speedSim.charX, app.speedSim.charY, '#2563eb');
  drawStartMarker(ctx, app.speedSim.startX, app.speedSim.startY);
  drawCharacter(ctx, app.speedSim.charX, app.speedSim.charY);
}

function updateSpeedSim() {
  const ti = document.getElementById('s7-time-input');
  let t = parseFloat(ti && ti.value);
  if (!isFinite(t) || t <= 0) t = 0.1;
  app.speedSim.time = t;
  updateSpeedReadouts();
}

function speedSimDist() {
  const pts = app.speedSim.waypoints;
  let d = 0;
  for (let i = 1; i < pts.length; i++)
    d += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
  if (pts.length > 0) {
    const last = pts[pts.length - 1];
    d += Math.hypot(app.speedSim.charX - last.x, app.speedSim.charY - last.y);
  }
  return d / PX_PER_M;
}

function updateSpeedReadouts() {
  const dx   = app.speedSim.charX - app.speedSim.startX;
  const dy   = app.speedSim.charY - app.speedSim.startY;
  const disp = Math.hypot(dx, dy) / PX_PER_M;
  const dist = speedSimDist();
  const t    = app.speedSim.time || 4.0;
  const dir  = disp > 0.05 ? dirLabel(dx, -dy) : '';
  const ang  = disp > 0.05 ? Math.abs(Math.atan2(-dy, dx) * 180 / Math.PI).toFixed(0) : '0';

  document.getElementById('s7-distance').textContent       = dist.toFixed(1) + ' m';
  document.getElementById('s7-displacement').textContent   = disp.toFixed(1) + ' m';
  document.getElementById('s7-direction').textContent      = disp > 0.05 ? `at ${ang}° ${dir}` : 'at origin';
  document.getElementById('s7-speed-formula').textContent  = `${dist.toFixed(1)} m ÷ ${t.toFixed(1)} s`;
  document.getElementById('s7-speed').textContent          = (dist / t).toFixed(2) + ' m/s';
  document.getElementById('s7-velocity-formula').textContent = `${disp.toFixed(1)} m ÷ ${t.toFixed(1)} s`;
  document.getElementById('s7-velocity').textContent       = (disp / t).toFixed(2) + ' m/s';
  document.getElementById('s7-vel-direction').textContent  = disp > 0.05 ? `→ ${ang}° ${dir}` : 'at origin';
}

/* ============================================================
   SCREEN 10 — Q3 MCQ
   ============================================================ */
function answerS10(btn, isCorrect) {
  const list = document.getElementById('s10-mcq');
  list.querySelectorAll('.s10-mcq-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');
  document.getElementById('s10-solution').classList.remove('hidden');
}

function drawS10Canvas() {
  const canvas = document.getElementById('s10-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = Math.round(H * 0.64);
  const R = 72;
  const ax = cx - R, bx = cx + R, ay = cy;

  /* Red dashed arc — above diameter from A (left) to B (right) */
  ctx.save();
  ctx.setLineDash([8, 5]);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, R, Math.PI, 0, false);
  ctx.stroke();
  ctx.restore();

  /* Blue displacement line A → B */
  ctx.save();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, ay);
  ctx.stroke();
  ctx.restore();

  /* Radius tick from center to top */
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - R);
  ctx.stroke();
  ctx.restore();

  /* Endpoint dots */
  [[ax, ay], [bx, ay]].forEach(([x, y]) => {
    ctx.save();
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  /* Labels */
  ctx.save();
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText('A', ax - 16, ay + 5);
  ctx.fillText('B', bx + 6, ay + 5);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('R', cx + 4, cy - R / 2 + 4);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'italic 12px serif';
  ctx.textAlign = 'center';
  ctx.fillText('path = πR  (speed v)', cx, cy - R - 10);
  ctx.fillStyle = '#2563eb';
  ctx.fillText('displacement = 2R', cx, cy + 20);
  ctx.restore();
}

/* ============================================================
   SCREEN 11 — SOLUTION CANVAS
   ============================================================ */
function drawS11Canvas() {
  const canvas = document.getElementById('s11-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = Math.round(H * 0.62);
  const R = 62;
  const ax = cx - R, bx = cx + R, ay = cy;

  /* Red dashed arc — above diameter */
  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, Math.PI, 0, false);
  ctx.stroke();
  ctx.restore();

  /* Blue chord */
  ctx.save();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, ay);
  ctx.stroke();
  ctx.restore();

  /* Endpoint dots */
  [[ax, ay], [bx, ay]].forEach(([x, y]) => {
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  /* Labels */
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold italic 14px serif';
  ctx.fillText('πR', cx, cy - R - 8);
  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold italic 14px serif';
  ctx.fillText('2R', cx, cy + 18);
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('A', ax - 16, ay + 5);
  ctx.textAlign = 'right';
  ctx.fillText('B', bx + 16, ay + 5);
  ctx.restore();
}

/* ============================================================
   SCREEN 12 — ARC ACTIVITY
   ============================================================ */
const ARC_ANGLES = [60, 90, 120, 180, 240, 300, 360];
const ARC_V = 5;   /* m/s */
const ARC_R = 2;   /* m   */

const _PI_FRACS = {
  30:'π/6', 45:'π/4', 60:'π/3', 90:'π/2',
  120:'2π/3', 135:'3π/4', 150:'5π/6', 180:'π',
  210:'7π/6', 225:'5π/4', 240:'4π/3', 270:'3π/2',
  300:'5π/3', 315:'7π/4', 330:'11π/6', 360:'2π'
};
function degToFrac(deg) { return _PI_FRACS[deg] || (deg * Math.PI / 180).toFixed(2) + ' rad'; }

function initArcActivity() {
  const grid = document.getElementById('s12-angle-grid');
  if (!grid) return;
  grid.innerHTML = '';
  ARC_ANGLES.forEach(deg => {
    const btn = document.createElement('button');
    btn.className = 'arc-angle-btn';
    btn.textContent = deg + '°';
    btn.dataset.deg = deg;
    btn.onclick = () => selectArcAngle(deg);
    grid.appendChild(btn);
  });
  selectArcAngle(90);
}

function selectArcAngle(deg) {
  document.querySelectorAll('.arc-angle-btn').forEach(b =>
    b.classList.toggle('arc-angle-active', parseInt(b.dataset.deg) === deg)
  );
  updateArcCalc(deg);
  renderArcCanvas(deg);
}

function updateArcCalc(deg) {
  const thetaRad = deg * Math.PI / 180;
  const path = ARC_R * thetaRad;
  const t    = path / ARC_V;
  const disp = 2 * ARC_R * Math.sin(thetaRad / 2);
  const vel  = t > 0 ? disp / t : 0;

  const speed = t > 0 ? path / t : 0;

  document.getElementById('s12-theta-rad').textContent   = 'θ = ' + deg + '° = ' + degToFrac(deg) + ' rad';
  document.getElementById('s12-theta-frac').textContent  = degToFrac(deg);
  document.getElementById('s12-path-val').textContent    = path.toFixed(2) + ' m';
  document.getElementById('s12-path-num').textContent    = path.toFixed(2);
  document.getElementById('s12-time-val').textContent    = t.toFixed(2) + ' s';
  document.getElementById('s12-half-deg').textContent    = (deg / 2).toFixed(0);
  document.getElementById('s12-disp-val').textContent    = disp.toFixed(2) + ' m';
  document.getElementById('s12-disp-num').textContent    = disp.toFixed(2);
  document.getElementById('s12-time-num').textContent    = t.toFixed(2);
  document.getElementById('s12-vel-result').textContent  = vel.toFixed(2) + ' m/s';
  document.getElementById('s12-speed-result').textContent = speed.toFixed(2) + ' m/s';
}

function renderArcCanvas(deg) {
  const canvas = document.getElementById('s12-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H);

  const cx = 150, cy = 140, R = 90;
  const thetaRad = deg * Math.PI / 180;

  /* A is at angle 0 (right), B is at angle -thetaRad in canvas (CCW) */
  const ax = cx + R, ay = cy;
  const bx = cx + R * Math.cos(thetaRad);
  const by = cy - R * Math.sin(thetaRad);

  /* Ghost full circle */
  ctx.save();
  ctx.setLineDash([3, 6]);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  /* Red dashed arc — CCW from A through angle θ */
  ctx.save();
  ctx.setLineDash([8, 5]);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (deg === 360) {
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  } else {
    ctx.arc(cx, cy, R, 0, -thetaRad, true);
  }
  ctx.stroke();
  ctx.restore();

  /* Purple dotted chord (displacement) — skip for 360° */
  if (deg < 360) {
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();
  }

  /* Thin radius line O → A */
  ctx.save();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(ax, ay);
  ctx.stroke();
  ctx.restore();

  /* Small angle arc at centre */
  if (deg > 0 && deg < 360) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, -thetaRad, true);
    ctx.stroke();
    ctx.restore();
  }

  /* Labels */
  ctx.save();
  ctx.setLineDash([]);

  /* O */
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('O', cx - 16, cy + 5);

  /* A */
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('A', ax + 7, ay + 5);

  /* B — offset outward from centre */
  if (deg > 0 && deg < 360) {
    const lblOff = R + 14;
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('B',
      cx + lblOff * Math.cos(thetaRad) - 4,
      cy - lblOff * Math.sin(thetaRad) + 4
    );
  }

  /* R = 2 m label along radius */
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('R = 2 m', cx + 6, cy - 6);

  /* θ label near angle arc */
  if (deg > 0 && deg < 360) {
    const midA = -thetaRad / 2;
    ctx.fillStyle = '#f97316';
    ctx.font = 'italic bold 11px serif';
    ctx.fillText('θ=' + deg + '°',
      cx + 34 * Math.cos(midA) - 10,
      cy + 34 * Math.sin(midA) + 4
    );
  }

  /* "path = Rθ" near arc midpoint */
  const midArcOff = R + 18;
  const midArcX = cx + midArcOff * Math.cos(thetaRad / 2);
  const midArcY = cy - midArcOff * Math.sin(thetaRad / 2);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'italic 11px serif';
  ctx.textAlign = 'center';
  ctx.fillText('path = Rθ', midArcX, midArcY - 2);

  /* "displacement (chord)" near chord midpoint — skip for 360° */
  if (deg > 0 && deg < 360) {
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'italic 10px serif';
    ctx.fillText('displacement', (ax + bx) / 2, (ay + by) / 2 - 8);
  }

  ctx.restore();

  /* Endpoint dots */
  ctx.save();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.arc(ax, ay, 5, 0, Math.PI * 2); ctx.fill();
  if (deg < 360) {
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* Initialise narration state for all screens */
  Object.keys(NARR).forEach(id => {
    initNarr(id);
  });

  /* Default path (no visual pre-selection) */
  app.selectedPath = 'zigzag';

  /* Intro screen is already active via HTML */
  app.currentScreen = 'screen-intro';
});
