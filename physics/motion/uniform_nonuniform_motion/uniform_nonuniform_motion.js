'use strict';

// ─── Narration data ───
const NARR = {
  'screen-1': [
    { text: 'Two types of motion. Uniform motion means equal distance in equal time intervals — speed stays constant, and the distance time graph is a straight line.', hl: '#uniform-card', dur: 8000 },
    { text: 'Non-uniform motion is different: unequal distances in equal intervals. Speed changes — even if direction does not. The distance time graph becomes a curve.', hl: '#nonuniform-card', dur: 8000 },
    { text: "Here is the test you apply to any data table: if delta-s is the same for every equal delta-t, the motion is uniform, otherwise the motion is non uniform. In the below scenario, the distance travelled is 5 metres for each time interval of one second. So the motion is uniform.", hl: '#test-section', dur: 9000 },
  ],
  'screen-2': [
    { text: 'A straight line on the s-t graph means uniform motion. The slope is constant — equal distance covered per unit time.', hl: '#straight-card', dur: 7000 },
    { text: 'A concave-up curve means the object is speeding up. The slope increases with time.', hl: '#concave-card', dur: 6000 },
    { text: 'A concave-down curve means the object is slowing down. The slope decreases with time.', hl: '#speeddown-card', dur: 6000 },
    { text: 'JEE bridge: the slope of a chord gives average speed. Watch the blue secants animate inward. As delta-t shrinks to zero, the chord becomes the green tangent — and its slope is instantaneous speed.', hl: '#jee-bridge', dur: 11000 },
  ],
  'screen-3': [
    { text: 'Watch three cars travel the same track. One moves uniformly, two do not.', hl: '#race-canvas-wrap', dur: 8000 },
    { text: 'Car A moves 4 metres every second — equal delta-s in equal delta-t. That is the uniform car.', hl: '#car-a-card', dur: 6000 },
    { text: 'Car B starts fast and slows down — it covers less and less distance each second. Non-uniform, decelerating.', hl: '#car-b-card', dur: 6000 },
    { text: 'Car C starts slow and speeds up — each second it covers more than the last. Non-uniform, accelerating.', hl: '#car-c-card', dur: 6000 },
  ],
  'screen-5': [
    { text: 'This curve shows non-uniform motion. The blue line is a chord — its slope is the average speed over the interval between the two blue dots.', hl: '#chord-tangent-canvas', dur: 8000 },
    { text: 'Average speed equals delta-s over delta-t — the total distance covered divided by the time taken.', hl: '#avg-speed-section', dur: 7000 },
    { text: 'Instantaneous speed is the slope of the tangent — the green line at a single point. It equals the limit of delta-s over delta-t as delta-t shrinks to zero: ds over dt.', hl: '#inst-speed-section', dur: 9000 },
  ],
  'screen-6': [
    { text: 'Study this data table carefully. Three cars are tracked over three half-hour intervals. Compute the delta-d per interval for each car.', hl: '#q1-table', dur: 9000 },
    { text: 'Which car has the same delta-d in every interval? Select your answer and click Submit.', hl: '#q1-options', dur: 7000 },
  ],
  'screen-7': [
    { text: 'Option B is correct. Car B is the only uniform car.', hl: '#correct-banner', dur: 5000 },
    { text: 'Looking at the differences: Car B gains exactly 2 km every half-hour — constant delta-d in equal delta-t.', hl: '#delta-table', dur: 7000 },
    { text: 'Cars A and C have varying delta-d — non-uniform. Just because a car keeps moving does not make it uniform.', hl: '#reasoning', dur: 7000 },
    { text: "The most common mistake: confusing continuous motion with uniform motion. Uniform needs equal delta-d in equal delta-t — not just non-zero motion.", hl: '#common-trap', dur: 8000 },
  ],
  'screen-8': [
    { text: 'A car makes a round trip: 3 kilometres to school in 10 minutes, then the same 3 kilometres back in 15 minutes. What is the average speed for the full journey?', hl: '#q2-visual', dur: 9000 },
    { text: 'Think carefully: use total distance and total time — not the average of the two speeds. Select your answer and click Submit.', hl: '#q2-options', dur: 8000 },
  ],
  'screen-9': [
    { text: 'Option B is correct. Average speed is 4 metres per second.', hl: '#correct-banner2', dur: 5000 },
    { text: 'Total distance is 6 kilometres — 6000 metres. Total time is 25 minutes — 1500 seconds. Dividing gives 4 metres per second.', hl: '#step-by-step', dur: 8000 },
    { text: 'JEE shortcut for equal distances at two speeds: use the harmonic mean — 2 v1 v2 divided by v1 plus v2. It always gives a smaller result than the arithmetic mean.', hl: '#jee-shortcut', dur: 10000 },
    { text: 'Remember: average speed is the chord on the d-t graph. It depends only on total distance and total time — not on how speed varied in between.', hl: '#concept-callback2', dur: 9000 },
  ],
  'screen-11': [
    { text: 'A ball is thrown straight up and returns to the same hand. No air resistance. Speed — not velocity — is on the y-axis. Observe the trajectory.', hl: '#s11-scenario', dur: 9000 },
    { text: 'Four options show different speed-time shapes. Think about how speed changes as the ball rises and then falls. Select your answer and click Submit.', hl: '#s11-options', dur: 9000 },
  ],
  'screen-12': [
    { text: 'At t equals zero the ball has its full launch speed. That is the starting point of the V — the highest value on the y-axis.', hl: '#s12-step1', dur: 7000 },
    { text: 'Gravity decelerates the ball uniformly. Speed reaches exactly zero for an instant at the apex — the lowest point of the V, touching the t-axis.', hl: '#s12-step2', dur: 8000 },
    { text: 'The ball falls and accelerates at the same rate. It returns to the hand with the same speed it left. The V is perfectly symmetric about the midpoint.', hl: '#s12-step3', dur: 8000 },
  ],
  'screen-13': [
    { text: 'A ball is released from rest on a frictionless incline. The only force along the slope is the component of gravity — constant throughout the slide.', hl: '#s13-scenario', dur: 8000 },
    { text: 'Think about what constant acceleration does to speed over time. Select the correct s-t graph and click Submit.', hl: '#s13-options', dur: 7000 },
  ],
  'screen-14': [
    { text: 'Released from rest means speed is zero at t equals zero. The graph must begin exactly at the origin.', hl: '#s14-step1', dur: 8000 },
    { text: 'The down-slope force is constant since there is no friction. Constant force means constant acceleration — speed grows by the same amount each second.', hl: '#s14-step2', dur: 8000 },
    { text: 'Nothing flattens the line. Without friction or drag, the ball keeps accelerating. The graph is a straight line rising indefinitely.', hl: '#s14-step3', dur: 7000 },
  ],
  'screen-15': [
    { text: 'A car starts from rest, accelerates to cruising speed, travels at constant speed, then brakes to a stop. Three completely different phases.', hl: '#s15-scenario', dur: 8000 },
    { text: 'Each phase leaves a distinct signature on the speed-time graph. Which option shows all three phases correctly? Select and submit.', hl: '#s15-options', dur: 8000 },
  ],
  'screen-16': [
    { text: 'During acceleration, the engine pushes the car from rest. Speed rises linearly — this is the rising segment on the left.', hl: '#s16-step1', dur: 7000 },
    { text: 'At cruising speed, thrust equals resistance. Speed stays constant — this is the flat plateau in the middle.', hl: '#s16-step2', dur: 7000 },
    { text: 'Braking applies a constant retarding force. Speed falls linearly to zero, mirroring the acceleration phase on the right.', hl: '#s16-step3', dur: 7000 },
  ],
  'screen-17': [
    { text: 'A ball is dropped and bounces repeatedly off a hard floor. Each bounce is lower than the last because kinetic energy is lost to heat and sound at each impact.', hl: '#s17-scenario', dur: 9000 },
    { text: 'Think about how speed changes during a fall, during impact, and during each successive bounce. Select the correct graph and click Submit.', hl: '#s17-options', dur: 8000 },
  ],
  'screen-18': [
    { text: 'Released from rest, gravity accelerates the ball downward. Speed climbs linearly until the first impact — the tallest peak on the graph.', hl: '#s18-step1', dur: 7000 },
    { text: 'At each impact, velocity reverses and some energy is lost. The rebound speed is lower than the impact speed — the next peak is shorter and the cycle repeats faster.', hl: '#s18-step2', dur: 9000 },
    { text: 'Each successive bounce loses more energy. Peaks shrink progressively and cycles shorten — the sawtooth pattern decays toward zero.', hl: '#s18-step3', dur: 7000 },
  ],
  'screen-19': [
    { text: 'A pendulum is released from one extreme. It swings to the other extreme and back continuously. Speed is zero at the extremes and maximum at the lowest point.', hl: '#s19-scenario', dur: 9000 },
    { text: 'Speed is a magnitude — it can never be negative. Which graph correctly shows speed touching zero at the extremes and peaking at the bottom? Select and submit.', hl: '#s19-options', dur: 9000 },
  ],
  'screen-20': [
    { text: 'At the extreme of the swing, all energy is potential and speed is exactly zero. The curve starts by touching the t-axis.', hl: '#s20-step1', dur: 7000 },
    { text: 'As the bob swings to the bottom, potential energy converts to kinetic. Speed reaches its maximum at the midpoint — the peak of the first hump.', hl: '#s20-step2', dur: 8000 },
    { text: 'The bob reaches the far extreme and stops momentarily. Speed drops to zero again. The pattern repeats — equal bumps above the axis, never dipping below.', hl: '#s20-step3', dur: 8000 },
  ],
};

// ─── Navigation maps ───
const NEXT_SCREEN = {
  'screen-intro': 'screen-1',
  'screen-1': 'screen-2',
  'screen-2': 'screen-3',
  'screen-3': 'screen-5',
  'screen-5': 'screen-6',
  'screen-6': 'screen-7',
  'screen-7': 'screen-8',
  'screen-8': 'screen-9',
  'screen-9': 'screen-11',
  'screen-11': 'screen-12',
  'screen-12': 'screen-13',
  'screen-13': 'screen-14',
  'screen-14': 'screen-15',
  'screen-15': 'screen-16',
  'screen-16': 'screen-17',
  'screen-17': 'screen-18',
  'screen-18': 'screen-19',
  'screen-19': 'screen-20',
  'screen-20': 'screen-10',
};
const PREV_SCREEN = {};
for (const [k, v] of Object.entries(NEXT_SCREEN)) PREV_SCREEN[v] = k;

let currentScreen = 'screen-intro';

// ─── Navigation ───
function goToScreen(id) {
  document.getElementById(currentScreen).classList.remove('active');
  document.getElementById(id).classList.add('active');
  currentScreen = id;
  narrStop();
  clearHighlights();
  stopAllAnimations();
  hideNarrBar(id === 'screen-intro' || id === 'screen-10');
  initScreen(id);
  if (NARR[id]) {
    narrState.screen = id;
    narrState.step = -1;
    updateNarrText('');
    updateNarrProgress();
    narrPlay();
  }
}

function stopAllAnimations() {
  if (jeeAnimId) { cancelAnimationFrame(jeeAnimId); jeeAnimId = null; }
  stopChordAnim();
  racePause();
}

function nextScreen() {
  const next = NEXT_SCREEN[currentScreen];
  if (next) goToScreen(next);
}

function prevScreen() {
  const prev = PREV_SCREEN[currentScreen];
  if (prev) goToScreen(prev);
}

function hideNarrBar(hide) {
  const bar = document.getElementById('narration-bar');
  bar.classList.toggle('hidden', hide);
}

// ─── Screen initializers ───
function initScreen(id) {
  switch (id) {
    case 'screen-1': initS1Graphs(); break;
    case 'screen-2': drawMiniGraphs(); break;
    case 'screen-3': raceReset(); break;
    case 'screen-5': startChordAnim(); break;
    case 'screen-8': drawRoundTrip(); break;
    case 'screen-11': initSTQ(1); break;
    case 'screen-12': drawSTAnswer1(-1); updateSTStepCards('screen-12', -1); break;
    case 'screen-13': initSTQ(2); break;
    case 'screen-14': drawSTAnswer2(-1); updateSTStepCards('screen-14', -1); break;
    case 'screen-15': initSTQ(3); break;
    case 'screen-16': drawSTAnswer3(-1); updateSTStepCards('screen-16', -1); break;
    case 'screen-17': initSTQ(4); break;
    case 'screen-18': drawSTAnswer4(-1); updateSTStepCards('screen-18', -1); break;
    case 'screen-19': initSTQ(5); break;
    case 'screen-20': drawSTAnswer5(-1); updateSTStepCards('screen-20', -1); break;
  }
}

// ─────────────────────────────────────────
// ─── NARRATION SYSTEM ───
// ─────────────────────────────────────────
const narrState = { screen: null, step: -1, playing: false, timer: null, utterance: null };

function narrToggle() {
  if (narrState.playing) {
    narrPause();
  } else {
    narrPlay();
  }
}

function narrPlay() {
  if (!NARR[narrState.screen]) return;
  const steps = NARR[narrState.screen];
  // If all steps done, restart from beginning
  if (narrState.step >= steps.length) {
    narrState.step = -1;
  }
  narrState.playing = true;
  updateNarrButton();
  if (narrState.step < 0) {
    narrAdvance();
  } else {
    // Re-speak the current step (resuming after pause)
    const step = steps[narrState.step];
    clearHighlights();
    if (step.hl) {
      const el = document.querySelector(step.hl);
      if (el) el.classList.add('hl-active');
    }
    updateNarrText(step.text);
    speak(step.text, step.dur);
  }
}

function narrPause() {
  narrState.playing = false;
  if (narrState.timer) { clearTimeout(narrState.timer); narrState.timer = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  updateNarrButton();
}

function narrStop() {
  narrState.playing = false;
  if (narrState.timer) { clearTimeout(narrState.timer); narrState.timer = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  updateNarrButton();
}

function narrRestart() {
  narrStop();
  narrState.step = -1;
  updateNarrProgress();
  if (narrState.screen === 'screen-3') raceReset();
  narrPlay();
}

function narrAdvance() {
  if (!narrState.playing) return;
  const steps = NARR[narrState.screen];
  if (!steps) return;
  narrState.step++;
  if (narrState.step >= steps.length) {
    narrState.playing = false;
    updateNarrButton();
    updateNarrProgress();
    return;
  }
  const step = steps[narrState.step];
  clearHighlights();
  if (step.hl) {
    const el = document.querySelector(step.hl);
    if (el) el.classList.add('hl-active');
  }
  updateNarrText(step.text);
  updateNarrProgress();
  speak(step.text, step.dur);
  if (narrState.screen === 'screen-2' && narrState.step === 3) startJeeAnim();
  if (narrState.screen === 'screen-3') {
    if (narrState.step === 1) startCar('A');
    else if (narrState.step === 2) startCar('B');
    else if (narrState.step === 3) startCar('C');
  }
  const staScreens = { 'screen-12': drawSTAnswer1, 'screen-14': drawSTAnswer2, 'screen-16': drawSTAnswer3, 'screen-18': drawSTAnswer4, 'screen-20': drawSTAnswer5 };
  if (staScreens[narrState.screen]) {
    staScreens[narrState.screen](narrState.step);
    updateSTStepCards(narrState.screen, narrState.step);
  }
}

function speak(text, fallbackDur) {
  if (narrState.timer) { clearTimeout(narrState.timer); narrState.timer = null; }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1;
    u.onend = () => { if (narrState.playing) narrAdvance(); };
    u.onerror = () => { narrState.timer = setTimeout(narrAdvance, fallbackDur); };
    narrState.utterance = u;
    window.speechSynthesis.speak(u);
    narrState.timer = setTimeout(() => {
      if (narrState.playing && window.speechSynthesis.speaking) return;
      if (narrState.playing) narrAdvance();
    }, fallbackDur + 3000);
  } else {
    narrState.timer = setTimeout(() => { if (narrState.playing) narrAdvance(); }, fallbackDur);
  }
}

function updateNarrText(text) {
  document.getElementById('narr-text').textContent = text;
}

function updateNarrButton() {
  const btn = document.getElementById('btn-narr-toggle');
  if (!btn) return;
  btn.innerHTML = narrState.playing ? '&#9646;&#9646; Pause' : '&#9654; Play';
}

function updateNarrProgress() {
  const fill = document.getElementById('narr-progress-fill');
  if (!fill) return;
  const steps = NARR[narrState.screen];
  if (!steps || steps.length === 0 || narrState.step < 0) {
    fill.style.width = '0%';
    return;
  }
  const pct = ((narrState.step + 1) / steps.length) * 100;
  fill.style.width = Math.min(100, pct) + '%';
}

function clearHighlights() {
  document.querySelectorAll('.hl-active').forEach(el => el.classList.remove('hl-active'));
}

// ─────────────────────────────────────────
// ─── SCREEN 1: Concept card mini-graphs ───
// ─────────────────────────────────────────
const S1_TMAX = 5;
const S1_V = 4;
const S1_W = 300, S1_H = 95;
const S1_PAD = { l: 34, r: 10, t: 10, b: 26 };
const S1_PW = S1_W - S1_PAD.l - S1_PAD.r;
const S1_PH = S1_H - S1_PAD.t - S1_PAD.b;
function s1ToX(t) { return S1_PAD.l + (t / S1_TMAX) * S1_PW; }
function s1ToY(s, sMax) { return S1_H - S1_PAD.b - (s / sMax) * S1_PH; }

function initS1Graphs() {
  drawS1UnifGraph();
  drawS1NonUnifGraph();
}

function s1BaseSVG(sMax, sLabels) {
  const axY = S1_H - S1_PAD.b;
  let h = `<rect x="0" y="0" width="${S1_W}" height="${S1_H}" fill="white"/>`;
  for (let t = 0.5; t < S1_TMAX; t += 0.5) {
    if (Number.isInteger(t)) continue;
    const x = s1ToX(t).toFixed(1);
    h += `<line x1="${x}" y1="${S1_PAD.t}" x2="${x}" y2="${axY}" stroke="#eff1f5" stroke-width="0.8"/>`;
  }
  for (let t = 1; t < S1_TMAX; t++) {
    const x = s1ToX(t).toFixed(1);
    h += `<line x1="${x}" y1="${S1_PAD.t}" x2="${x}" y2="${axY}" stroke="#dde1e7" stroke-width="0.8" stroke-dasharray="2,3"/>`;
  }
  for (const sv of sLabels) {
    if (sv === 0 || sv === sMax) continue;
    const y = s1ToY(sv, sMax).toFixed(1);
    h += `<line x1="${S1_PAD.l}" y1="${y}" x2="${S1_W - S1_PAD.r}" y2="${y}" stroke="#dde1e7" stroke-width="0.8" stroke-dasharray="2,3"/>`;
  }
  h += `<line x1="${S1_PAD.l}" y1="${S1_PAD.t}" x2="${S1_PAD.l}" y2="${axY}" stroke="#374151" stroke-width="1.5"/>`;
  h += `<line x1="${S1_PAD.l}" y1="${axY}" x2="${S1_W - S1_PAD.r}" y2="${axY}" stroke="#374151" stroke-width="1.5"/>`;
  h += `<text x="2" y="${(S1_PAD.t + S1_PH / 2 + 4).toFixed(1)}" font-size="9" fill="#64748b" text-anchor="middle" font-family="system-ui">s</text>`;
  for (const sv of sLabels) {
    h += `<text x="${S1_PAD.l - 4}" y="${(s1ToY(sv, sMax) + 3).toFixed(1)}" font-size="9" fill="#64748b" text-anchor="end" font-family="system-ui">${sv}</text>`;
  }
  h += `<text x="${S1_W - S1_PAD.r + 3}" y="${axY + 4}" font-size="9" fill="#64748b" font-family="system-ui">t</text>`;
  for (let t = 0; t <= S1_TMAX; t++) {
    h += `<text x="${s1ToX(t).toFixed(1)}" y="${axY + 12}" font-size="9" fill="#64748b" text-anchor="middle" font-family="system-ui">${t}</text>`;
  }
  return h;
}

function drawS1UnifGraph() {
  const svg = document.getElementById('c-s1-unif'); if (!svg) return;
  const SMAX = S1_V * S1_TMAX;
  let h = s1BaseSVG(SMAX, [10, 20]);
  for (let t = 0; t < S1_TMAX; t++) {
    const xa = s1ToX(t), xb = s1ToX(t + 1);
    const mid = ((xa + xb) / 2).toFixed(1);
    h += `<rect x="${xa.toFixed(1)}" y="${S1_PAD.t}" width="${(xb - xa).toFixed(1)}" height="${S1_PH}" fill="#2563eb" fill-opacity="${t % 2 === 0 ? 0.06 : 0.12}"/>`;
    h += `<text x="${mid}" y="${S1_PAD.t + 11}" font-size="8" font-weight="700" fill="#1d4ed8" text-anchor="middle" font-family="system-ui">&Delta;s=${S1_V}m</text>`;
    h += `<text x="${mid}" y="${S1_PAD.t + 22}" font-size="8" fill="#1d4ed8" text-anchor="middle" font-family="system-ui">&Delta;t=1s</text>`;
  }
  h += `<line x1="${s1ToX(0).toFixed(1)}" y1="${s1ToY(0, SMAX).toFixed(1)}" x2="${s1ToX(S1_TMAX).toFixed(1)}" y2="${s1ToY(SMAX, SMAX).toFixed(1)}" stroke="#2563eb" stroke-width="2"/>`;
  svg.innerHTML = h;
}

function drawS1NonUnifGraph() {
  const svg = document.getElementById('c-s1-nonunif'); if (!svg) return;
  const SMAX = S1_TMAX * S1_TMAX;
  let h = s1BaseSVG(SMAX, [12, 25]);
  for (let t = 0; t < S1_TMAX; t++) {
    const xa = s1ToX(t), xb = s1ToX(t + 1);
    const ds = (t + 1) * (t + 1) - t * t;
    const mid = ((xa + xb) / 2).toFixed(1);
    h += `<rect x="${xa.toFixed(1)}" y="${S1_PAD.t}" width="${(xb - xa).toFixed(1)}" height="${S1_PH}" fill="#dc2626" fill-opacity="${t % 2 === 0 ? 0.06 : 0.12}"/>`;
    h += `<text x="${mid}" y="${S1_PAD.t + 11}" font-size="8" font-weight="700" fill="#b91c1c" text-anchor="middle" font-family="system-ui">&Delta;s=${ds}m</text>`;
    h += `<text x="${mid}" y="${S1_PAD.t + 22}" font-size="8" fill="#b91c1c" text-anchor="middle" font-family="system-ui">&Delta;t=1s</text>`;
  }
  let pts = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60 * S1_TMAX;
    pts.push(`${s1ToX(t).toFixed(1)},${s1ToY(t * t, SMAX).toFixed(1)}`);
  }
  h += `<polyline points="${pts.join(' ')}" fill="none" stroke="#dc2626" stroke-width="2"/>`;
  svg.innerHTML = h;
}


// ─────────────────────────────────────────
// ─── SCREEN 2: Mini graphs + JEE animation ───
// ─────────────────────────────────────────
const S2_TMAX = 4, S2_SMAX = 12;
const S2_W = 180, S2_H = 105;
const S2_PAD = { l: 28, r: 8, t: 10, b: 24 };
const S2_PW = S2_W - S2_PAD.l - S2_PAD.r;
const S2_PH = S2_H - S2_PAD.t - S2_PAD.b;

function s2ToX(t) { return S2_PAD.l + (t / S2_TMAX) * S2_PW; }
function s2ToY(s) { return S2_H - S2_PAD.b - (s / S2_SMAX) * S2_PH; }

function drawMiniGraphs() {
  drawStraight();
  drawConcave();
  drawSpeedingDown();
}

function s2GridAxes() {
  const axY = S2_H - S2_PAD.b;
  let h = `<rect x="0" y="0" width="${S2_W}" height="${S2_H}" fill="white"/>`;
  for (let t = 1; t < S2_TMAX; t++) {
    const x = s2ToX(t).toFixed(1);
    h += `<line x1="${x}" y1="${S2_PAD.t}" x2="${x}" y2="${axY}" stroke="#e2e8f0" stroke-width="0.8" stroke-dasharray="2,3"/>`;
  }
  const y6 = s2ToY(6).toFixed(1);
  h += `<line x1="${S2_PAD.l}" y1="${y6}" x2="${S2_W - S2_PAD.r}" y2="${y6}" stroke="#e2e8f0" stroke-width="0.8" stroke-dasharray="2,3"/>`;
  h += `<line x1="${S2_PAD.l}" y1="${S2_PAD.t}" x2="${S2_PAD.l}" y2="${axY}" stroke="#374151" stroke-width="1.5"/>`;
  h += `<line x1="${S2_PAD.l}" y1="${axY}" x2="${S2_W - S2_PAD.r}" y2="${axY}" stroke="#374151" stroke-width="1.5"/>`;
  const s2MidY = ((S2_PAD.t + S2_H - S2_PAD.b) / 2).toFixed(1);
  h += `<text x="9" y="${s2MidY}" font-size="9" fill="#64748b" text-anchor="middle" transform="rotate(-90,9,${s2MidY})" font-family="system-ui">s</text>`;
  h += `<text x="${S2_PAD.l - 3}" y="${(s2ToY(S2_SMAX) + 3).toFixed(1)}" font-size="9" fill="#64748b" text-anchor="end" font-family="system-ui">${S2_SMAX}</text>`;
  h += `<text x="${S2_PAD.l - 3}" y="${(s2ToY(6) + 3).toFixed(1)}" font-size="9" fill="#64748b" text-anchor="end" font-family="system-ui">6</text>`;
  h += `<text x="${S2_PAD.l - 3}" y="${(s2ToY(0) + 3).toFixed(1)}" font-size="9" fill="#64748b" text-anchor="end" font-family="system-ui">0</text>`;
  h += `<text x="${S2_W - S2_PAD.r + 3}" y="${(axY + 4).toFixed(1)}" font-size="9" fill="#64748b" font-family="system-ui">t</text>`;
  for (let t = 0; t <= S2_TMAX; t += 2) {
    h += `<text x="${s2ToX(t).toFixed(1)}" y="${(axY + 13).toFixed(1)}" font-size="9" fill="#64748b" text-anchor="middle" font-family="system-ui">${t}</text>`;
  }
  return h;
}

function drawStraight() {
  const svg = document.getElementById('c-straight'); if (!svg) return;
  let h = s2GridAxes();
  h += `<line x1="${s2ToX(0).toFixed(1)}" y1="${s2ToY(0).toFixed(1)}" x2="${s2ToX(S2_TMAX).toFixed(1)}" y2="${s2ToY(S2_SMAX).toFixed(1)}" stroke="#2563eb" stroke-width="2.5"/>`;
  svg.innerHTML = h;
}

function drawConcave() {
  const svg = document.getElementById('c-concave'); if (!svg) return;
  let h = s2GridAxes();
  let pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40 * S2_TMAX;
    const s = S2_SMAX * (t / S2_TMAX) * (t / S2_TMAX);
    pts.push(`${s2ToX(t).toFixed(1)},${s2ToY(s).toFixed(1)}`);
  }
  h += `<polyline points="${pts.join(' ')}" fill="none" stroke="#dc2626" stroke-width="2.5"/>`;
  svg.innerHTML = h;
}

function drawSpeedingDown() {
  const svg = document.getElementById('c-speeddown'); if (!svg) return;
  let h = s2GridAxes();
  let pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40 * S2_TMAX;
    const u = t / S2_TMAX;
    const s = S2_SMAX * u * (2 - u);
    pts.push(`${s2ToX(t).toFixed(1)},${s2ToY(s).toFixed(1)}`);
  }
  h += `<polyline points="${pts.join(' ')}" fill="none" stroke="#dc2626" stroke-width="2.5"/>`;
  svg.innerHTML = h;
}

// JEE bridge animation
let jeeAnimId = null;
let jeeT = 0;

function startJeeAnim() {
  if (jeeAnimId) cancelAnimationFrame(jeeAnimId);
  jeeT = 0;
  jeeAnimLoop();
}

function jeeAnimLoop() {
  drawJeeBridge(jeeT);
  jeeT += 0.004;
  if (jeeT > 1.6) jeeT = 0;
  jeeAnimId = requestAnimationFrame(jeeAnimLoop);
}

function drawJeeBridge(t) {
  const cv = document.getElementById('c-jee'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);

  const pad = { l: 32, r: 14, t: 14, b: 28 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  // Curve: d = a*tau^2, scaled to fill canvas
  const tMax = 6, dMax = 36;
  function toX(tau) { return pad.l + (tau / tMax) * pw; }
  function toY(d)   { return pad.t + ph - (d / dMax) * ph; }
  function dCurve(tau) { return tau * tau; }

  // Grid
  ctx.setLineDash([2, 3]); ctx.strokeStyle = '#dde1e7'; ctx.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    const x = pad.l + pw * i / 5;
    ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + ph); ctx.stroke();
  }
  ctx.setLineDash([]);

  // Axes
  ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ph); ctx.lineTo(pad.l + pw, pad.t + ph); ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '10px system-ui';
  ctx.fillText('s', pad.l - 22, pad.t + 10);
  ctx.fillText('t', pad.l + pw + 4, pad.t + ph + 4);

  // Draw smooth curve
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const tau = (i / 100) * tMax;
    const x = toX(tau), y = toY(dCurve(tau));
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8; ctx.setLineDash([4, 3]); ctx.stroke();
  ctx.setLineDash([]);

  // Point P at tau=2
  const pTau = 2, pD = dCurve(pTau);
  const px = toX(pTau), py = toY(pD);

  let qTau;
  const phase = Math.min(t, 1.0);
  if (phase < 0.25) {
    qTau = 6;
  } else if (phase < 0.5) {
    qTau = 6 - (phase - 0.25) / 0.25 * 1.5;
  } else if (phase < 0.75) {
    qTau = 4.5 - (phase - 0.5) / 0.25 * 1.3;
  } else if (phase < 1.0) {
    qTau = 3.2 - (phase - 0.75) / 0.25 * 1.15;
  } else {
    qTau = pTau + 0.01;
  }

  if (t < 1.0) {
    const qD = dCurve(qTau);
    const qx = toX(qTau), qy = toY(qD);
    // Blue secant chord
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy);
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2; ctx.stroke();
    // Q circle (open)
    ctx.beginPath(); ctx.arc(qx, qy, 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2; ctx.fillStyle = '#fff';
    ctx.fill(); ctx.stroke();
  }

  // Green tangent (slope at P = 2*pTau = 4)
  const slope = 2 * pTau;
  const canvasSlope = -(slope * ph * tMax) / (dMax * pw);
  const tangAlpha = t < 1.0 ? Math.min((t - 0.6) / 0.3, 1) : 1;
  if (tangAlpha > 0) {
    ctx.globalAlpha = Math.max(0, tangAlpha);
    const ext = 70;
    ctx.beginPath();
    ctx.moveTo(px - ext, py - canvasSlope * ext);
    ctx.lineTo(px + ext, py + canvasSlope * ext);
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // P green dot
  ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#16a34a'; ctx.fill();

  // Label Δt→0
  ctx.fillStyle = '#374151'; ctx.font = 'bold 10px system-ui';
  ctx.fillText('Δt → 0', pad.l + 6, pad.t + 18);
  ctx.fillStyle = '#64748b'; ctx.font = '9px system-ui';
  ctx.fillText('(secants → tangent)', pad.l + 4, pad.t + 30);
  ctx.fillText('P', px + 8, py - 4);
}

// ─────────────────────────────────────────
// ─── SCREEN 3: Race animation ───
// ─────────────────────────────────────────
const RACE_DUR = 6.0;
const DIST_B = [0, 4, 7, 9, 10.5, 11.5, 12];
const DIST_C = [0, 1, 2.5, 5, 8.5, 13, 18];

let raceState = {
  animId: null, lastTick: null,
  carT: { A: 0, B: 0, C: 0 },
  carActive: { A: false, B: false, C: false }
};

function getCarDist(car, t) {
  if (car === 'A') return Math.min(4 * t, 24);
  const table = car === 'B' ? DIST_B : DIST_C;
  const i = Math.floor(t);
  if (i >= 6) return table[6];
  const frac = t - i;
  return table[i] + frac * (table[i + 1] - table[i]);
}

function startCar(car) {
  if (raceState.carT[car] >= RACE_DUR) return;
  raceState.carActive[car] = true;
  if (!raceState.animId) {
    raceState.lastTick = null;
    raceState.animId = requestAnimationFrame(raceTick);
  }
}

function racePlay() {
  for (const car of ['A', 'B', 'C']) {
    if (raceState.carT[car] < RACE_DUR) raceState.carActive[car] = true;
  }
  if (!raceState.animId) {
    raceState.lastTick = null;
    raceState.animId = requestAnimationFrame(raceTick);
  }
}

function racePause() {
  raceState.carActive.A = false;
  raceState.carActive.B = false;
  raceState.carActive.C = false;
  if (raceState.animId) { cancelAnimationFrame(raceState.animId); raceState.animId = null; }
}

function raceReset() {
  racePause();
  raceState.carT = { A: 0, B: 0, C: 0 };
  drawRace();
  updateRaceReadouts();
  document.getElementById('race-time').textContent = 'Time elapsed: 0.0 s / 6.0 s';
}

function raceTick(now) {
  if (raceState.lastTick === null) raceState.lastTick = now;
  const dt = (now - raceState.lastTick) / 1000;
  raceState.lastTick = now;
  let anyActive = false;
  for (const car of ['A', 'B', 'C']) {
    if (raceState.carActive[car]) {
      raceState.carT[car] = Math.min(RACE_DUR, raceState.carT[car] + dt);
      if (raceState.carT[car] < RACE_DUR) anyActive = true;
      else raceState.carActive[car] = false;
    }
  }
  drawRace();
  updateRaceReadouts();
  const maxT = Math.max(raceState.carT.A, raceState.carT.B, raceState.carT.C);
  document.getElementById('race-time').textContent = `Time elapsed: ${maxT.toFixed(1)} s / 6.0 s`;
  if (anyActive) raceState.animId = requestAnimationFrame(raceTick);
  else raceState.animId = null;
}

function updateRaceReadouts() {
  document.getElementById('dist-a').textContent = getCarDist('A', raceState.carT.A).toFixed(1) + ' m';
  document.getElementById('dist-b').textContent = getCarDist('B', raceState.carT.B).toFixed(1) + ' m';
  document.getElementById('dist-c').textContent = getCarDist('C', raceState.carT.C).toFixed(1) + ' m';
}

function drawRace() {
  const svg = document.getElementById('c-race'); if (!svg) return;
  const W = 860, H = 210;
  const maxDist = 30, pad = { l: 54, r: 20, t: 20, b: 30 };
  const trackW = W - pad.l - pad.r;
  const laneH = (H - pad.t - pad.b) / 3;
  function toX(d) { return pad.l + (d / maxDist) * trackW; }
  let h = `<rect x="0" y="0" width="${W}" height="${H}" fill="white"/>`;
  const laneColors = ['#eff6ff', '#fff5f5', '#fff5f5'];
  for (let i = 0; i < 3; i++) {
    const y = (pad.t + i * laneH).toFixed(1);
    h += `<rect x="${pad.l}" y="${y}" width="${trackW}" height="${laneH.toFixed(1)}" fill="${laneColors[i]}"/>`;
  }
  for (let d = 0; d <= maxDist; d += 5) {
    const x = toX(d).toFixed(1);
    h += `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${H - pad.b}" stroke="#d1d5db" stroke-width="0.8"/>`;
    h += `<text x="${x}" y="${H - pad.b + 16}" font-size="11" fill="#94a3b8" text-anchor="middle" font-family="system-ui">${d} m</text>`;
  }
  const labels = ['Car A', 'Car B', 'Car C'];
  const carColors = ['#2563eb', '#dc2626', '#dc2626'];
  for (let i = 0; i < 3; i++) {
    const cy = (pad.t + i * laneH + laneH / 2).toFixed(1);
    h += `<text x="4" y="${(parseFloat(cy) + 4).toFixed(1)}" font-size="11" font-weight="bold" fill="${carColors[i]}" font-family="system-ui">${labels[i]}</text>`;
    h += `<line x1="${pad.l}" y1="${cy}" x2="${pad.l + trackW}" y2="${cy}" stroke="#fca5a5" stroke-width="1.2" stroke-dasharray="5,4"/>`;
  }
  h += `<line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H - pad.b}" stroke="#f59e0b" stroke-width="2"/>`;
  h += `<text x="${pad.l - 12}" y="${pad.t + 12}" font-size="10" font-weight="bold" fill="#f59e0b" text-anchor="middle" font-family="system-ui">S</text>`;
  const carIds = ['A', 'B', 'C'];
  const sz = 22;
  for (let i = 0; i < 3; i++) {
    const d = getCarDist(carIds[i], raceState.carT[carIds[i]]);
    const cx = toX(d);
    const cy = pad.t + i * laneH + laneH / 2;
    h += `<rect x="${(cx - sz / 2).toFixed(1)}" y="${(cy - sz / 2).toFixed(1)}" width="${sz}" height="${sz}" fill="${carColors[i]}" rx="2"/>`;
    h += `<circle cx="${(cx - 5).toFixed(1)}" cy="${(cy + 7).toFixed(1)}" r="3" fill="white"/>`;
    h += `<circle cx="${(cx + 5).toFixed(1)}" cy="${(cy + 7).toFixed(1)}" r="3" fill="white"/>`;
  }
  svg.innerHTML = h;
}

// ─────────────────────────────────────────
// ─── SCREEN 5: Chord and tangent diagram ───
// ─────────────────────────────────────────
let chordAnimId = null;
let chordPhase = 0;

function startChordAnim() {
  if (chordAnimId) cancelAnimationFrame(chordAnimId);
  chordPhase = 0;
  chordAnimLoop();
}

function stopChordAnim() {
  if (chordAnimId) { cancelAnimationFrame(chordAnimId); chordAnimId = null; }
}

function chordAnimLoop() {
  drawChordTangent(chordPhase);
  chordPhase += 0.004;
  if (chordPhase > 1.6) chordPhase = 0;
  chordAnimId = requestAnimationFrame(chordAnimLoop);
}

function drawChordTangent(t) {
  if (t === undefined) t = 0;
  const svg = document.getElementById('c-chord'); if (!svg) return;
  const W = 480, H = 360;
  const pad = { l: 60, r: 20, t: 20, b: 40 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const tMax = 6, dMax = 36;
  function toX(tau) { return pad.l + (tau / tMax) * pw; }
  function toY(d) { return pad.t + ph - (d / dMax) * ph; }
  function dCurve(tau) { return tau * tau; }
  let h = `<rect x="0" y="0" width="${W}" height="${H}" fill="white"/>`;
  for (let ii = 0; ii <= 6; ii++) {
    h += `<line x1="${toX(ii).toFixed(1)}" y1="${pad.t}" x2="${toX(ii).toFixed(1)}" y2="${pad.t + ph}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>`;
  }
  for (let d = 0; d <= 36; d += 6) {
    h += `<line x1="${pad.l}" y1="${toY(d).toFixed(1)}" x2="${pad.l + pw}" y2="${toY(d).toFixed(1)}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>`;
  }
  h += `<line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t + ph}" stroke="#374151" stroke-width="1.8"/>`;
  h += `<line x1="${pad.l}" y1="${pad.t + ph}" x2="${pad.l + pw}" y2="${pad.t + ph}" stroke="#374151" stroke-width="1.8"/>`;
  h += `<text x="4" y="${pad.t + 12}" font-size="12" fill="#64748b" font-style="italic" font-family="system-ui">distance (m)</text>`;
  h += `<text x="${pad.l + pw - 28}" y="${pad.t + ph + 30}" font-size="12" fill="#64748b" font-style="italic" font-family="system-ui">time (s)</text>`;
  let pts = [];
  for (let ii = 0; ii <= 100; ii++) {
    const tau = (ii / 100) * tMax;
    pts.push(`${toX(tau).toFixed(1)},${toY(dCurve(tau)).toFixed(1)}`);
  }
  h += `<polyline points="${pts.join(' ')}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"/>`;
  const tP = 2;
  const xP = toX(tP), yP = toY(dCurve(tP));
  let tQ;
  const phase = Math.min(t, 1.0);
  if (phase < 0.25) {
    tQ = 5.5;
  } else if (phase < 0.5) {
    tQ = 5.5 - (phase - 0.25) / 0.25 * 1.5;
  } else if (phase < 0.75) {
    tQ = 4.0 - (phase - 0.5) / 0.25 * 1.5;
  } else if (phase < 1.0) {
    tQ = 2.5 - (phase - 0.75) / 0.25 * 0.48;
  } else {
    tQ = tP + 0.02;
  }
  if (t < 1.0) {
    const xQ = toX(tQ), yQ = toY(dCurve(tQ));
    h += `<line x1="${xP.toFixed(1)}" y1="${yP.toFixed(1)}" x2="${xQ.toFixed(1)}" y2="${yQ.toFixed(1)}" stroke="#2563eb" stroke-width="2.5"/>`;
    h += `<circle cx="${xQ.toFixed(1)}" cy="${yQ.toFixed(1)}" r="6" fill="white" stroke="#2563eb" stroke-width="2"/>`;
    const midX = ((xP + xQ) / 2).toFixed(1);
    const midY = ((yP + yQ) / 2 + 18).toFixed(1);
    h += `<text x="${midX}" y="${midY}" font-size="12" font-weight="bold" font-style="italic" fill="#2563eb" font-family="system-ui">chord = avg speed</text>`;
  }
  const slope = 2 * tP;
  const slopeCanvas = -(slope * ph * tMax) / (dMax * pw);
  const tangAlpha = t < 1.0 ? Math.max(0, Math.min(1, (t - 0.6) / 0.3)) : 1;
  if (tangAlpha > 0) {
    const ext = 70;
    h += `<line x1="${(xP - ext).toFixed(1)}" y1="${(yP - slopeCanvas * ext).toFixed(1)}" x2="${(xP + ext).toFixed(1)}" y2="${(yP + slopeCanvas * ext).toFixed(1)}" stroke="#16a34a" stroke-width="2.5" opacity="${tangAlpha.toFixed(3)}"/>`;
    h += `<text x="${(xP + 6).toFixed(1)}" y="${(yP - 12).toFixed(1)}" font-size="12" font-weight="bold" font-style="italic" fill="#16a34a" opacity="${tangAlpha.toFixed(3)}" font-family="system-ui">tangent = instantaneous</text>`;
  }
  h += `<circle cx="${xP.toFixed(1)}" cy="${yP.toFixed(1)}" r="7" fill="#16a34a"/>`;
  svg.innerHTML = h;
}


// ─────────────────────────────────────────
// ─── SCREEN 8: Round-trip visual ───
// ─────────────────────────────────────────
function drawRoundTrip() {
  const svg = document.getElementById('c-trip'); if (!svg) return;
  const W = 700, H = 90;
  const lx = 60, rx = W - 60;
  let h = `<rect x="0" y="0" width="${W}" height="${H}" fill="white"/>`;
  h += `<line x1="${lx}" y1="28" x2="${rx - 10}" y2="28" stroke="#dc2626" stroke-width="2" stroke-dasharray="8,5"/>`;
  h += `<polygon points="${rx},28 ${rx - 14},22 ${rx - 14},34" fill="#dc2626"/>`;
  h += `<line x1="${rx}" y1="62" x2="${lx + 10}" y2="62" stroke="#dc2626" stroke-width="2" stroke-dasharray="8,5"/>`;
  h += `<polygon points="${lx},62 ${lx + 14},56 ${lx + 14},68" fill="#dc2626"/>`;
  h += `<text x="${(lx + rx) / 2}" y="20" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle" font-family="system-ui">3 km · 10 min</text>`;
  h += `<text x="${(lx + rx) / 2}" y="82" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle" font-family="system-ui">3 km · 15 min</text>`;
  h += `<circle cx="${lx}" cy="45" r="18" fill="#f59e0b"/>`;
  h += `<text x="${lx}" y="50" font-size="14" font-weight="bold" fill="#1e2d3d" text-anchor="middle" font-family="system-ui">H</text>`;
  h += `<text x="${lx}" y="78" font-size="11" fill="#64748b" text-anchor="middle" font-family="system-ui">home</text>`;
  h += `<circle cx="${rx}" cy="45" r="18" fill="#16a34a"/>`;
  h += `<text x="${rx}" y="50" font-size="14" font-weight="bold" fill="white" text-anchor="middle" font-family="system-ui">S</text>`;
  h += `<text x="${rx}" y="78" font-size="11" fill="#64748b" text-anchor="middle" font-family="system-ui">school</text>`;
  svg.innerHTML = h;
}

// ═════════════════════════════════════════
// ─── SPEED-TIME MCQ SHARED HELPERS ───
// ═════════════════════════════════════════

function setupSTQOptions(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.stq-option').forEach(opt => {
    opt.addEventListener('click', () => {
      container.querySelectorAll('.stq-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

function getSelectedSTQ(containerSelector) {
  const sel = document.querySelector(containerSelector + ' .stq-option.selected');
  return sel ? sel.dataset.val : null;
}

function updateSTStepCards(screenId, step) {
  const container = document.getElementById(screenId);
  if (!container) return;
  container.querySelectorAll('.sta-step-card').forEach((card, i) => {
    card.classList.toggle('active', i === step);
  });
}

/* Shared axes SVG string for mini option graphs (viewBox 0 0 120 90) */
function stqAxes() {
  return '<rect x="0" y="0" width="120" height="90" fill="white"/>'
    + '<line x1="12" y1="10" x2="12" y2="78" stroke="#374151" stroke-width="1.5"/>'
    + '<line x1="12" y1="78" x2="110" y2="78" stroke="#374151" stroke-width="1.5"/>'
    + '<text x="5" y="14" font-size="8" fill="#64748b" font-family="system-ui">s</text>'
    + '<text x="112" y="80" font-size="8" fill="#64748b" font-family="system-ui">t</text>';
}

/* Callout circle for answer screen SVGs */
function stCallout(cx, cy, num) {
  return '<circle cx="' + cx + '" cy="' + cy + '" r="15" fill="#f0c04a" stroke="#d97706" stroke-width="2"/>'
    + '<text x="' + cx + '" y="' + (cy + 5) + '" font-size="13" font-weight="bold" fill="#1e2d3d" text-anchor="middle" font-family="system-ui">' + num + '</text>';
}

/* Shared axes for answer screen graphs (430x270, pad l=55 r=15 t=28 b=42) */
function staAxes(W, H, pad, sLabel) {
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  let h = '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="white"/>';
  h += '<line x1="' + pad.l + '" y1="' + pad.t + '" x2="' + pad.l + '" y2="' + (pad.t + ph) + '" stroke="#374151" stroke-width="1.8"/>';
  h += '<line x1="' + pad.l + '" y1="' + (pad.t + ph) + '" x2="' + (pad.l + pw) + '" y2="' + (pad.t + ph) + '" stroke="#374151" stroke-width="1.8"/>';
  h += '<text x="' + (pad.l - 8) + '" y="' + (pad.t - 6) + '" font-size="13" fill="#64748b" font-style="italic" font-family="system-ui">' + (sLabel || 's') + '</text>';
  h += '<text x="' + (pad.l + pw + 8) + '" y="' + (pad.t + ph + 5) + '" font-size="13" fill="#64748b" font-style="italic" font-family="system-ui">t</text>';
  return h;
}

// ═════════════════════════════════════════
// ─── QUESTION SCREEN SCENARIO + OPTION DRAWINGS ───
// ═════════════════════════════════════════

function initSTQ(n) {
  const drawFns = [null, initSTQ1, initSTQ2, initSTQ3, initSTQ4, initSTQ5];
  if (drawFns[n]) drawFns[n]();
}

/* ── MCQ 1: Ball thrown up ── */
function initSTQ1() {
  const sc = document.getElementById('c-s11-scene'); if (!sc) return;
  let h = '<rect x="0" y="0" width="240" height="200" fill="white"/>';
  h += '<line x1="120" y1="185" x2="120" y2="30" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,4"/>';
  h += '<circle cx="120" cy="32" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>';
  h += '<polygon points="113,75 120,55 127,75" fill="#2563eb"/>';
  h += '<polygon points="113,130 120,150 127,130" fill="#dc2626"/>';
  h += '<text x="88" y="72" font-size="12" fill="#2563eb" font-family="system-ui">up</text>';
  h += '<text x="125" y="148" font-size="12" fill="#dc2626" font-family="system-ui">down</text>';
  h += '<rect x="95" y="185" width="50" height="12" rx="2" fill="#94a3b8"/>';
  h += '<text x="120" y="205" font-size="11" fill="#64748b" text-anchor="middle" font-family="system-ui">hand</text>';
  sc.innerHTML = h;

  const A = document.getElementById('s11-ga'); if (A) A.innerHTML = stqAxes() + '<polyline points="12,15 72,78 108,78" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const B = document.getElementById('s11-gb'); if (B) B.innerHTML = stqAxes() + '<line x1="12" y1="32" x2="108" y2="32" stroke="#2563eb" stroke-width="2"/>';
  const C = document.getElementById('s11-gc'); if (C) C.innerHTML = stqAxes() + '<polyline points="12,15 60,78 108,15" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const D = document.getElementById('s11-gd'); if (D) D.innerHTML = stqAxes() + '<polyline points="12,70 108,15" fill="none" stroke="#2563eb" stroke-width="2"/>';
}

/* ── MCQ 2: Frictionless incline ── */
function initSTQ2() {
  const sc = document.getElementById('c-s13-scene'); if (!sc) return;
  let h = '<rect x="0" y="0" width="240" height="200" fill="white"/>';
  h += '<line x1="20" y1="40" x2="200" y2="175" stroke="#374151" stroke-width="2"/>';
  h += '<line x1="20" y1="175" x2="200" y2="175" stroke="#374151" stroke-width="2"/>';
  h += '<line x1="20" y1="40" x2="20" y2="175" stroke="#374151" stroke-width="1" stroke-dasharray="3,3"/>';
  h += '<circle cx="50" cy="60" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>';
  h += '<line x1="60" y1="70" x2="95" y2="103" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr)"/>';
  h += '<polygon points="100,108 85,95 98,89" fill="#2563eb"/>';
  h += '<text x="100" y="195" font-size="12" fill="#64748b" text-anchor="middle" font-style="italic" font-family="system-ui">frictionless</text>';
  sc.innerHTML = h;

  const A = document.getElementById('s13-ga'); if (A) A.innerHTML = stqAxes() + '<line x1="12" y1="32" x2="108" y2="32" stroke="#2563eb" stroke-width="2"/>';
  const B = document.getElementById('s13-gb'); if (B) B.innerHTML = stqAxes() + '<polyline points="12,75 108,14" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const C = document.getElementById('s13-gc'); if (C) C.innerHTML = stqAxes() + '<polyline points="12,78 28,55 45,40 62,30 78,24 94,21 108,19" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const D = document.getElementById('s13-gd'); if (D) D.innerHTML = stqAxes() + '<polyline points="12,78 35,45 55,22 75,14 95,28 108,55" fill="none" stroke="#2563eb" stroke-width="2"/>';
}

/* ── MCQ 3: Car phases ── */
function initSTQ3() {
  const sc = document.getElementById('c-s15-scene'); if (!sc) return;
  let h = '<rect x="0" y="0" width="240" height="200" fill="white"/>';
  h += '<line x1="10" y1="155" x2="230" y2="155" stroke="#374151" stroke-width="1.5"/>';
  const carX = [35, 118, 200], labels = ['accelerate', 'cruise', 'brake'];
  for (let i = 0; i < 3; i++) {
    const cx = carX[i];
    h += '<rect x="' + (cx-18) + '" y="130" width="36" height="22" rx="3" fill="#1e2d3d"/>';
    h += '<circle cx="' + (cx-8) + '" cy="153" r="5" fill="#64748b"/>';
    h += '<circle cx="' + (cx+8) + '" cy="153" r="5" fill="#64748b"/>';
    h += '<text x="' + cx + '" y="175" font-size="10" fill="#64748b" text-anchor="middle" font-style="italic" font-family="system-ui">' + labels[i] + '</text>';
  }
  h += '<line x1="55" y1="143" x2="100" y2="143" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3"/>';
  h += '<line x1="135" y1="143" x2="180" y2="143" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3"/>';
  sc.innerHTML = h;

  const A = document.getElementById('s15-ga'); if (A) A.innerHTML = stqAxes() + '<polyline points="12,78 30,28 72,28 90,78" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const B = document.getElementById('s15-gb'); if (B) B.innerHTML = stqAxes() + '<polyline points="12,65 108,15" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const C = document.getElementById('s15-gc'); if (C) C.innerHTML = stqAxes() + '<line x1="12" y1="40" x2="108" y2="40" stroke="#2563eb" stroke-width="2"/>';
  const D = document.getElementById('s15-gd'); if (D) D.innerHTML = stqAxes() + '<polyline points="12,78 28,52 48,28 65,18 82,28 98,52 108,70" fill="none" stroke="#2563eb" stroke-width="2"/>';
}

/* ── MCQ 4: Ball dropped / bouncing ── */
function initSTQ4() {
  const sc = document.getElementById('c-s17-scene'); if (!sc) return;
  let h = '<rect x="0" y="0" width="240" height="200" fill="white"/>';
  h += '<line x1="10" y1="178" x2="230" y2="178" stroke="#374151" stroke-width="2"/>';
  const bx = [50, 120, 190], bh = [40, 80, 115];
  for (let i = 0; i < 3; i++) {
    h += '<line x1="' + bx[i] + '" y1="' + (bh[i]+14) + '" x2="' + bx[i] + '" y2="178" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,3"/>';
    h += '<circle cx="' + bx[i] + '" cy="' + bh[i] + '" r="12" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>';
  }
  h += '<text x="120" y="198" font-size="11" fill="#64748b" text-anchor="middle" font-style="italic" font-family="system-ui">decreasing peaks</text>';
  sc.innerHTML = h;

  const A = document.getElementById('s17-ga'); if (A) A.innerHTML = stqAxes() + '<polyline points="12,78 60,14 108,78" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const B = document.getElementById('s17-gb'); if (B) B.innerHTML = stqAxes() + '<line x1="12" y1="28" x2="108" y2="28" stroke="#2563eb" stroke-width="2"/>';
  const C = document.getElementById('s17-gc');
  if (C) C.innerHTML = stqAxes() + '<polyline points="12,78 27,13 28,55 42,78 44,36 58,78 60,52 72,78 74,62 85,78 87,68 95,78" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const D = document.getElementById('s17-gd');
  if (D) D.innerHTML = stqAxes() + '<polyline points="12,78 22,55 32,22 42,10 52,22 62,55 72,78 82,55 92,25 102,14 108,25" fill="none" stroke="#2563eb" stroke-width="2"/>';
}

/* ── MCQ 5: Pendulum ── */
function initSTQ5() {
  const sc = document.getElementById('c-s19-scene'); if (!sc) return;
  let h = '<rect x="0" y="0" width="240" height="200" fill="white"/>';
  h += '<circle cx="120" cy="28" r="5" fill="#374151"/>';
  const pos = [[50,120],[120,165],[190,120]];
  const labels2 = ['s = 0', 's max', 's = 0'];
  const colrs = ['#94a3b8','#fbbf24','#94a3b8'];
  for (let i = 0; i < 3; i++) {
    h += '<line x1="120" y1="28" x2="' + pos[i][0] + '" y2="' + pos[i][1] + '" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"/>';
    h += '<circle cx="' + pos[i][0] + '" cy="' + pos[i][1] + '" r="12" fill="' + colrs[i] + '" stroke="#d97706" stroke-width="' + (i===1?2:1.5) + '"/>';
    h += '<text x="' + (pos[i][0] + (i===2?8:-8)) + '" y="' + (pos[i][1]+22) + '" font-size="11" fill="' + (i===1?'#2563eb':'#64748b') + '" text-anchor="' + (i===2?'start':'end') + '" font-style="italic" font-family="system-ui">' + labels2[i] + '</text>';
  }
  sc.innerHTML = h;

  const A = document.getElementById('s19-ga');
  if (A) A.innerHTML = stqAxes() + '<polyline points="12,78 22,60 35,35 50,16 65,12 80,20 95,42 108,65" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const B = document.getElementById('s19-gb'); if (B) B.innerHTML = stqAxes() + '<line x1="12" y1="32" x2="108" y2="32" stroke="#2563eb" stroke-width="2"/>';
  const C = document.getElementById('s19-gc');
  if (C) C.innerHTML = stqAxes() + '<polyline points="12,78 25,35 38,78 51,35 64,78 77,35 90,78 103,35 108,52" fill="none" stroke="#2563eb" stroke-width="2"/>';
  const D = document.getElementById('s19-gd');
  if (D) D.innerHTML = stqAxes() + '<polyline points="12,78 27,13 28,55 42,78 44,36 58,78 60,52 72,78 74,62 85,78 87,68 95,78" fill="none" stroke="#2563eb" stroke-width="2"/>';
}

// ═════════════════════════════════════════
// ─── ANSWER SCREEN DRAWING FUNCTIONS ───
// ═════════════════════════════════════════

/* ── Answer 1: Ball thrown up — symmetric V-shape (screen-12) ── */
function drawSTAnswer1(step) {
  const W = 430, H = 270;
  const pad = { l: 55, r: 15, t: 28, b: 42 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const sc = document.getElementById('c-s12-scene');
  if (sc) {
    let h = '<rect x="0" y="0" width="210" height="220" fill="white"/>';
    h += '<line x1="105" y1="200" x2="105" y2="30" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,4"/>';
    h += '<rect x="82" y="200" width="46" height="10" rx="2" fill="#94a3b8"/>';
    h += '<text x="105" y="218" font-size="10" fill="#64748b" text-anchor="middle" font-style="italic" font-family="system-ui">hand</text>';
    h += '<polygon points="99,90 105,70 111,90" fill="#2563eb"/>';
    h += '<polygon points="99,140 105,160 111,140" fill="#dc2626"/>';
    h += '<text x="78" y="88" font-size="11" fill="#2563eb" font-family="system-ui">up</text>';
    h += '<text x="110" y="158" font-size="11" fill="#dc2626" font-family="system-ui">down</text>';
    if (step >= 0) h += stCallout(72, 192, 1);
    if (step >= 1) h += stCallout(160, 42, 2);
    if (step >= 2) h += stCallout(148, 192, 3);
    sc.innerHTML = h;
  }

  const gr = document.getElementById('c-s12-graph');
  if (gr) {
    let h = staAxes(W, H, pad, 's');
    const x1 = pad.l, x2 = pad.l + pw / 2, x3 = pad.l + pw;
    const y1 = pad.t, y2 = pad.t + ph, y3 = pad.t;
    h += '<polyline points="' + x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3 + '" fill="none" stroke="#2563eb" stroke-width="3"/>';
    if (step >= 0) h += stCallout(x1 + 30, y1 + 30, 1);
    if (step >= 1) h += stCallout(x2, y2 - 30, 2);
    if (step >= 2) h += stCallout(x3 - 30, y3 + 30, 3);
    gr.innerHTML = h;
  }
}

/* ── Answer 2: Frictionless incline — linear rise from 0 (screen-14) ── */
function drawSTAnswer2(step) {
  const W = 430, H = 270;
  const pad = { l: 55, r: 15, t: 28, b: 42 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const sc = document.getElementById('c-s14-scene');
  if (sc) {
    let h = '<rect x="0" y="0" width="210" height="220" fill="white"/>';
    h += '<line x1="15" y1="38" x2="180" y2="188" stroke="#374151" stroke-width="2"/>';
    h += '<line x1="15" y1="188" x2="180" y2="188" stroke="#374151" stroke-width="2"/>';
    h += '<line x1="15" y1="38" x2="15" y2="188" stroke="#374151" stroke-width="1" stroke-dasharray="3,3"/>';
    h += '<text x="92" y="208" font-size="11" fill="#64748b" text-anchor="middle" font-style="italic" font-family="system-ui">frictionless</text>';
    const pts = [[30,55],[95,118],[155,170]];
    pts.forEach((p, i) => {
      if (step >= i) h += stCallout(p[0], p[1], i+1);
    });
    if (step < 0) {
      h += '<circle cx="30" cy="55" r="12" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>';
      h += '<polygon points="45,70 60,62 55,78" fill="#2563eb"/>';
    }
    sc.innerHTML = h;
  }

  const gr = document.getElementById('c-s14-graph');
  if (gr) {
    let h = staAxes(W, H, pad, 's');
    const x1 = pad.l, y1 = pad.t + ph;
    const x3 = pad.l + pw, y3 = pad.t;
    const x2 = pad.l + pw / 2, y2 = pad.t + ph / 2;
    h += '<polyline points="' + x1 + ',' + y1 + ' ' + x3 + ',' + y3 + '" fill="none" stroke="#2563eb" stroke-width="3"/>';
    if (step >= 0) h += stCallout(x1 + 18, y1 - 18, 1);
    if (step >= 1) h += stCallout(x2, y2, 2);
    if (step >= 2) h += stCallout(x3 - 18, y3 + 18, 3);
    gr.innerHTML = h;
  }
}

/* ── Answer 3: Car phases — rise, flat, fall (screen-16) ── */
function drawSTAnswer3(step) {
  const W = 430, H = 270;
  const pad = { l: 55, r: 15, t: 28, b: 42 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const sc = document.getElementById('c-s16-scene');
  if (sc) {
    let h = '<rect x="0" y="0" width="210" height="220" fill="white"/>';
    h += '<line x1="10" y1="178" x2="200" y2="178" stroke="#374151" stroke-width="1.5"/>';
    const carX2 = [42, 105, 168];
    const lbl2 = ['accelerate', 'cruise', 'brake'];
    for (let i = 0; i < 3; i++) {
      const cx = carX2[i];
      h += '<rect x="' + (cx-18) + '" y="148" width="36" height="22" rx="3" fill="' + (step >= i ? '#2563eb' : '#94a3b8') + '"/>';
      h += '<circle cx="' + (cx-8) + '" cy="171" r="5" fill="#64748b"/>';
      h += '<circle cx="' + (cx+8) + '" cy="171" r="5" fill="#64748b"/>';
      h += '<text x="' + cx + '" y="196" font-size="9" fill="#64748b" text-anchor="middle" font-style="italic" font-family="system-ui">' + lbl2[i] + '</text>';
      if (step >= i) h += stCallout(cx, 128, i + 1);
    }
    sc.innerHTML = h;
  }

  const gr = document.getElementById('c-s16-graph');
  if (gr) {
    let h = staAxes(W, H, pad, 's');
    const x0 = pad.l, yB = pad.t + ph, yT = pad.t + ph * 0.25;
    const xRise = pad.l + pw * 0.28, xFlatEnd = pad.l + pw * 0.72, xEnd = pad.l + pw;
    h += '<polyline points="' + x0 + ',' + yB + ' ' + xRise + ',' + yT + ' ' + xFlatEnd + ',' + yT + ' ' + xEnd + ',' + yB + '" fill="none" stroke="#2563eb" stroke-width="3"/>';
    const midFlat = (xRise + xFlatEnd) / 2;
    if (step >= 0) h += stCallout(x0 + (xRise - x0) / 2, (yB + yT) / 2, 1);
    if (step >= 1) h += stCallout(midFlat, yT - 20, 2);
    if (step >= 2) h += stCallout(xFlatEnd + (xEnd - xFlatEnd) / 2, (yB + yT) / 2, 3);
    gr.innerHTML = h;
  }
}

/* ── Answer 4: Bouncing ball — decaying sawtooth (screen-18) ── */
function drawSTAnswer4(step) {
  const W = 430, H = 270;
  const pad = { l: 55, r: 15, t: 28, b: 42 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const sc = document.getElementById('c-s18-scene');
  if (sc) {
    let h = '<rect x="0" y="0" width="210" height="220" fill="white"/>';
    h += '<line x1="10" y1="185" x2="200" y2="185" stroke="#374151" stroke-width="2"/>';
    const bx2 = [45, 105, 165], bh2 = [38, 90, 132];
    for (let i = 0; i < 3; i++) {
      h += '<line x1="' + bx2[i] + '" y1="' + (bh2[i]+14) + '" x2="' + bx2[i] + '" y2="185" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,3"/>';
      h += '<circle cx="' + bx2[i] + '" cy="' + bh2[i] + '" r="11" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>';
      if (step >= i) h += stCallout(bx2[i] - 24, bh2[i] + 5, i + 1);
    }
    sc.innerHTML = h;
  }

  const gr = document.getElementById('c-s18-graph');
  if (gr) {
    let h = staAxes(W, H, pad, 's');
    const xO = pad.l, yB = pad.t + ph;
    const p1x = xO + pw * 0.22, p1y = pad.t + ph * 0.12;
    const d1x = xO + pw * 0.24, d1y = pad.t + ph * 0.45;
    const p2x = xO + pw * 0.48, p2y = pad.t + ph * 0.32;
    const d2x = xO + pw * 0.50, d2y = pad.t + ph * 0.62;
    const p3x = xO + pw * 0.68, p3y = pad.t + ph * 0.50;
    const endX = xO + pw;
    h += '<polyline points="'
      + xO + ',' + yB + ' '
      + p1x + ',' + p1y + ' '
      + d1x + ',' + d1y + ' '
      + xO + pw * 0.26 + ',' + yB + ' '
      + p2x + ',' + p2y + ' '
      + d2x + ',' + d2y + ' '
      + (xO + pw * 0.52) + ',' + yB + ' '
      + p3x + ',' + p3y + ' '
      + (xO + pw * 0.70) + ',' + yB + ' '
      + (xO + pw * 0.82) + ',' + (pad.t + ph * 0.64) + ' '
      + (xO + pw * 0.84) + ',' + yB + ' '
      + (xO + pw * 0.92) + ',' + (pad.t + ph * 0.75) + ' '
      + endX + ',' + yB
      + '" fill="none" stroke="#2563eb" stroke-width="2.5"/>';
    if (step >= 0) h += stCallout(p1x - 18, p1y + 10, 1);
    if (step >= 1) h += stCallout(d1x + 18, d1y + 8, 2);
    if (step >= 2) h += stCallout(p3x + 18, p3y + 5, 3);
    gr.innerHTML = h;
  }
}

/* ── Answer 5: Pendulum — |sine| bumps (screen-20) ── */
function drawSTAnswer5(step) {
  const W = 430, H = 270;
  const pad = { l: 55, r: 15, t: 28, b: 42 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const sc = document.getElementById('c-s20-scene');
  if (sc) {
    let h = '<rect x="0" y="0" width="210" height="220" fill="white"/>';
    h += '<circle cx="105" cy="25" r="5" fill="#374151"/>';
    const pos2 = [[25,125],[105,168],[185,125]];
    const lbl3 = ['s = 0','s max','s = 0'];
    const cl2 = ['#e2e8f0','#fbbf24','#e2e8f0'];
    for (let i = 0; i < 3; i++) {
      h += '<line x1="105" y1="25" x2="' + pos2[i][0] + '" y2="' + pos2[i][1] + '" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"/>';
      h += '<circle cx="' + pos2[i][0] + '" cy="' + pos2[i][1] + '" r="12" fill="' + cl2[i] + '" stroke="#94a3b8" stroke-width="1.5"/>';
      h += '<text x="' + (pos2[i][0] + (i===2 ? 16 : -16)) + '" y="' + (pos2[i][1]+22) + '" font-size="10" fill="' + (i===1?'#2563eb':'#64748b') + '" text-anchor="' + (i===2?'start':'end') + '" font-style="italic" font-family="system-ui">' + lbl3[i] + '</text>';
      if (step >= i) h += stCallout(pos2[i][0] + (i===2?20:-20), pos2[i][1] - 24, i + 1);
    }
    sc.innerHTML = h;
  }

  const gr = document.getElementById('c-s20-graph');
  if (gr) {
    let h = staAxes(W, H, pad, 's');
    const pts = [];
    const nPts = 160;
    for (let i = 0; i <= nPts; i++) {
      const t = i / nPts;
      const x = pad.l + t * pw;
      const y = pad.t + ph - ph * 0.82 * Math.abs(Math.sin(Math.PI * t * 2.5));
      pts.push(x.toFixed(1) + ',' + y.toFixed(1));
    }
    h += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#2563eb" stroke-width="2.5"/>';
    const tPts = [0, 0.2, 0.4];
    const nums2 = [1, 2, 3];
    tPts.forEach((tp, i) => {
      if (step >= i) {
        const cx = pad.l + tp * pw;
        const cy = pad.t + ph - ph * 0.82 * Math.abs(Math.sin(Math.PI * tp * 2.5));
        h += stCallout(Math.round(cx), Math.round(cy) - (Math.abs(Math.sin(Math.PI * tp * 2.5)) > 0.5 ? 22 : 18), nums2[i]);
      }
    });
    gr.innerHTML = h;
  }
}

// ─────────────────────────────────────────
// ─── MCQ Handling ───
// ─────────────────────────────────────────
function setupMCQOptions(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.mcq-option').forEach(opt => {
    opt.addEventListener('click', () => {
      container.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

function getSelectedMCQ(containerSelector) {
  const sel = document.querySelector(containerSelector + ' .mcq-option.selected');
  return sel ? sel.dataset.val : null;
}

function submitMCQ1() {
  const answer = getSelectedMCQ('#q1-options');
  const fb = document.getElementById('mcq1-feedback');
  if (!answer) { fb.textContent = 'Select an option first.'; fb.className = 'mcq-feedback wrong'; return; }
  document.getElementById('btn-mcq1-next').disabled = false;
  if (answer === 'b') {
    fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct';
    setTimeout(() => goToScreen('screen-7'), 1200);
  } else {
    fb.textContent = '✗ Not quite. Check the Δd for each car.'; fb.className = 'mcq-feedback wrong';
    document.querySelector(`#q1-options [data-val="${answer}"]`).classList.add('wrong');
    setTimeout(() => goToScreen('screen-7'), 2000);
  }
}

function submitMCQ2() {
  const answer = getSelectedMCQ('#q2-options');
  const fb = document.getElementById('mcq2-feedback');
  if (!answer) { fb.textContent = 'Select an option first.'; fb.className = 'mcq-feedback wrong'; return; }
  document.getElementById('btn-mcq2-next').disabled = false;
  if (answer === 'b') {
    fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct';
    setTimeout(() => goToScreen('screen-9'), 1200);
  } else {
    fb.textContent = '✗ Not quite. Use total distance ÷ total time.'; fb.className = 'mcq-feedback wrong';
    document.querySelector(`#q2-options [data-val="${answer}"]`).classList.add('wrong');
    setTimeout(() => goToScreen('screen-9'), 2000);
  }
}

// ═════════════════════════════════════════
// ─── SPEED-TIME MCQ SUBMIT HANDLERS ───
// ═════════════════════════════════════════

function submitSTMCQ1() {
  const answer = getSelectedSTQ('#s11-options');
  const fb = document.getElementById('stmcq1-feedback');
  if (!answer) { fb.textContent = 'Select an option first.'; fb.className = 'mcq-feedback wrong'; return; }
  document.getElementById('btn-stmcq1-next').disabled = false;
  if (answer === 'c') {
    fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct';
    setTimeout(() => goToScreen('screen-12'), 1200);
  } else {
    fb.textContent = '✗ Not quite. Think about speed at the apex.'; fb.className = 'mcq-feedback wrong';
    document.querySelector('#s11-options [data-val="' + answer + '"]').classList.add('wrong');
    setTimeout(() => goToScreen('screen-12'), 2000);
  }
}

function submitSTMCQ2() {
  const answer = getSelectedSTQ('#s13-options');
  const fb = document.getElementById('stmcq2-feedback');
  if (!answer) { fb.textContent = 'Select an option first.'; fb.className = 'mcq-feedback wrong'; return; }
  document.getElementById('btn-stmcq2-next').disabled = false;
  if (answer === 'b') {
    fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct';
    setTimeout(() => goToScreen('screen-14'), 1200);
  } else {
    fb.textContent = '✗ Not quite. Constant acceleration means constant slope.'; fb.className = 'mcq-feedback wrong';
    document.querySelector('#s13-options [data-val="' + answer + '"]').classList.add('wrong');
    setTimeout(() => goToScreen('screen-14'), 2000);
  }
}

function submitSTMCQ3() {
  const answer = getSelectedSTQ('#s15-options');
  const fb = document.getElementById('stmcq3-feedback');
  if (!answer) { fb.textContent = 'Select an option first.'; fb.className = 'mcq-feedback wrong'; return; }
  document.getElementById('btn-stmcq3-next').disabled = false;
  if (answer === 'a') {
    fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct';
    setTimeout(() => goToScreen('screen-16'), 1200);
  } else {
    fb.textContent = '✗ Not quite. Look for the three distinct phases.'; fb.className = 'mcq-feedback wrong';
    document.querySelector('#s15-options [data-val="' + answer + '"]').classList.add('wrong');
    setTimeout(() => goToScreen('screen-16'), 2000);
  }
}

function submitSTMCQ4() {
  const answer = getSelectedSTQ('#s17-options');
  const fb = document.getElementById('stmcq4-feedback');
  if (!answer) { fb.textContent = 'Select an option first.'; fb.className = 'mcq-feedback wrong'; return; }
  document.getElementById('btn-stmcq4-next').disabled = false;
  if (answer === 'c') {
    fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct';
    setTimeout(() => goToScreen('screen-18'), 1200);
  } else {
    fb.textContent = '✗ Not quite. Each bounce starts from zero speed.'; fb.className = 'mcq-feedback wrong';
    document.querySelector('#s17-options [data-val="' + answer + '"]').classList.add('wrong');
    setTimeout(() => goToScreen('screen-18'), 2000);
  }
}

function submitSTMCQ5() {
  const answer = getSelectedSTQ('#s19-options');
  const fb = document.getElementById('stmcq5-feedback');
  if (!answer) { fb.textContent = 'Select an option first.'; fb.className = 'mcq-feedback wrong'; return; }
  document.getElementById('btn-stmcq5-next').disabled = false;
  if (answer === 'c') {
    fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct';
    setTimeout(() => goToScreen('screen-20'), 1200);
  } else {
    fb.textContent = '✗ Not quite. Speed (magnitude) never goes negative.'; fb.className = 'mcq-feedback wrong';
    document.querySelector('#s19-options [data-val="' + answer + '"]').classList.add('wrong');
    setTimeout(() => goToScreen('screen-20'), 2000);
  }
}

// ─────────────────────────────────────────
// ─── Init ───
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupMCQOptions('#q1-options');
  setupMCQOptions('#q2-options');
  document.getElementById('screen-intro').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') goToScreen('screen-1');
  });

  hideNarrBar(true);
  goToScreen('screen-intro');
  setupSTQOptions('#s11-options');
  setupSTQOptions('#s13-options');
  setupSTQOptions('#s15-options');
  setupSTQOptions('#s17-options');
  setupSTQOptions('#s19-options');
});
