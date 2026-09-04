'use strict';

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────

const NEXT_SCREEN = {
  'screen-intro': 'screen-1',
  'screen-1':     'screen-2',
  'screen-2':     'screen-3',
  'screen-3':     'screen-4'
};
const PREV_SCREEN = Object.fromEntries(Object.entries(NEXT_SCREEN).map(([a, b]) => [b, a]));

function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  narrStop();
  narrState.screen = id;
  narrState.step = -1;
  initScreen(id);
  narrPlay();
}

function nextScreen() {
  const next = NEXT_SCREEN[narrState.screen];
  if (next) goToScreen(next);
}

function prevScreen() {
  const prev = PREV_SCREEN[narrState.screen];
  if (prev) goToScreen(prev);
}

function initScreen(id) {
  if (id === 'screen-1') initLab();
  else if (id === 'screen-2') initConcept();
  else if (id === 'screen-3') initStudio();
  else if (id === 'screen-4') initArena();
}

// ─────────────────────────────────────────────────────────────
// NARRATION ENGINE
// ─────────────────────────────────────────────────────────────

const narrState = { screen: null, step: -1, playing: false, utt: null, timer: null, waitFor: null };

function narrPlay() {
  const steps = NARR[narrState.screen];
  if (!steps || !steps.length) return;
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

function narrStop() {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; window.speechSynthesis.cancel(); narrState.utt = null; }
  narrState.playing = false;
  narrState.step = -1;
  narrState.waitFor = null;
  updateNarrText('');
  updateNarrProgress();
  updateNarrButton();
}

function narrToggle() {
  if (narrState.playing) {
    narrPause();
  } else {
    const steps = NARR[narrState.screen] || [];
    if (narrState.step >= steps.length - 1) narrState.step = -1;
    narrState.playing = true;
    updateNarrButton();
    narrAdvance();
  }
}

function narrRestart() {
  narrStop();
  narrState.step = -1;
  narrPlay();
}

function narrAdvance() {
  narrState.waitFor = null;
  if (!narrState.playing) return;
  const steps = NARR[narrState.screen];
  if (!steps) return;
  narrState.step++;
  if (narrState.step >= steps.length) {
    narrState.playing = false;
    updateNarrButton();
    return;
  }
  const step = steps[narrState.step];
  clearHighlights();        // drop old highlight immediately
  updateNarrText(step.text);
  updateNarrProgress();
  speakStep(step);          // new highlight applied in utt.onstart, in sync with audio
}

function speakStep(step) {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; narrState.utt = null; }
  window.speechSynthesis.cancel();   // stop any stale speech before starting the new step

  const utt = new SpeechSynthesisUtterance(step.text);
  utt.rate = 0.95;
  utt.onstart = () => {              // highlight fires exactly when audio begins
    clearHighlights();
    if (step.hl) {
      const el = document.querySelector(step.hl);
      if (el) el.classList.add('hl-active');
    }
  };
  utt.onend = () => {
    if (step.waitFor && !checkWaitFor(step.waitFor)) {
      narrState.waitFor = step.waitFor;
      narrState.playing = false;
      updateNarrButton();
    } else {
      narrAdvance();
    }
  };
  narrState.utt = utt;
  narrState.timer = setTimeout(() => {
    if (narrState.utt) { narrState.utt.onend = null; }
    if (step.waitFor && !checkWaitFor(step.waitFor)) {
      narrState.waitFor = step.waitFor;
      narrState.playing = false;
      updateNarrButton();
    } else {
      narrAdvance();
    }
  }, step.dur);
  window.speechSynthesis.speak(utt);
}

function checkWaitFor(action) {
  if (action === 'A') return conceptState.showA;
  if (action === 'B') return conceptState.showB;
  return false;
}

function satisfyNarrWait(action) {
  if (narrState.waitFor === action && !narrState.playing) {
    narrState.waitFor = null;
    narrState.playing = true;
    updateNarrButton();
    narrAdvance();
  }
}

function clearHighlights() {
  document.querySelectorAll('.hl-active').forEach(el => el.classList.remove('hl-active'));
}

function updateNarrText(text) {
  const el = document.getElementById('narr-text');
  if (el) el.textContent = text;
}

function updateNarrButton() {
  const btn = document.getElementById('btn-narr-toggle');
  if (btn) btn.innerHTML = narrState.playing ? '&#9646;&#9646; Pause' : '&#9654; Play';
}

function updateNarrProgress() {
  const fill = document.getElementById('narr-progress-fill');
  if (!fill) return;
  const steps = NARR[narrState.screen];
  if (!steps || !steps.length) { fill.style.width = '0%'; return; }
  fill.style.width = Math.max(0, ((narrState.step + 1) / steps.length) * 100) + '%';
}

// ─────────────────────────────────────────────────────────────
// NARRATION DATA
// ─────────────────────────────────────────────────────────────

const NARR = {
  'screen-intro': [
    { text: 'Welcome to Probability Studio — a learning platform for probability, from Class 9 CBSE all the way to JEE. One syllabus, three difficulty tiers.', hl: '.cover-title', dur: 9000 },
    { text: 'The dice grid shows all 36 outcomes when two dice are rolled. The cells highlighted in yellow are the six outcomes where the sum equals seven — the most probable single sum.', hl: '#dice-grid', dur: 10000 },
    { text: 'Hit the Start button to enter the Activity Lab, where you will run your first probability experiment.', hl: '#btn-start', dur: 7000 }
  ],
  'screen-1': [
    { text: 'This is the Activity Lab — your empirical probability playground. Choose an experiment from the left: Toss a Coin, or Roll a Dice.', hl: '.exp-list', dur: 8500 },
    { text: 'Set the number of trials, pick a speed, then hit Run. The die face animates with each trial and the trial log streams every result.', hl: '.run-controls', dur: 8000 },
    { text: 'Watch the histogram bars. Each bar shows empirical probability — the actual share of trials landing on that outcome. As the trial count grows, the bars converge toward the theoretical dashed line. This is the law of large numbers.', hl: '.histogram-panel', dur: 14000 }
  ],
  'screen-2': [
    { text: 'Rolling two dice gives a six by six sample space — thirty-six equally likely outcomes. Each cell shows one possible pair of die faces. The Total Outcomes card on the right always shows n of S equals thirty-six.', hl: '#sample-grid', dur: 11000 },
    { text: 'Click the Event A chip to highlight the outcomes where the two dice sum to seven.', hl: '#chip-A', dur: 6000, waitFor: 'A' },
    { text: 'Six cells light up in blue. P of A equals six out of thirty-six — one sixth. Now click Event B to see which outcomes have a sum of nine or more.', hl: '#chip-B', dur: 10000, waitFor: 'B' },
    { text: 'Ten outcomes light up in red. P of B equals ten out of thirty-six — roughly zero point two seven eight. When you are ready, click Next to continue.', hl: '.expl-nav', dur: 11000 }
  ],
  'screen-3': [
    { text: 'The urn holds four red balls and three blue balls — seven in total. The experiment is to draw two balls one at a time without replacement. Once the first ball is out it stays out, so the second draw comes from only six remaining balls.', hl: '#urn-balls', dur: 23000 },
    { text: 'Two events are defined. Event A is about composition — for example, both draws are Red, or at least one is Blue. Event B is about position — whether the first draw or the second draw is Red. Use the panel on the left to change either event.', hl: '#event-sections', dur: 22000 },
    { text: 'The tree maps every possible two-draw combination. From S, the first branch splits Red or Blue. Each node splits again on the second draw, giving four leaf outcomes: Red-Red, Red-Blue, Blue-Red, and Blue-Blue. The branch labels are conditional probabilities — they change after each draw because the urn is smaller.', hl: '#tree-svg', dur: 26000 },
    { text: 'Multiply the two branch labels to get each leaf probability. Gold leaves are the numerator, pale-yellow leaves complete the denominator. The readout below shows every step of the calculation.', hl: '#result-readout', dur: 18000 },
    { text: 'Then select an operation: A for plain P of A, A-prime for complement, or A given B for conditional probability. Change the operation and watch the highlighted leaves update instantly.', hl: '#operation-section', dur: 16000 }
  ],
  'screen-4': [
    { text: 'Welcome to the Problem Arena. Read the problem carefully. Key words like without replacement and given that signal a conditional probability question.', hl: '.problem-card', dur: 9500 },
    { text: 'Select your answer from the four choices and click Submit to check, or click Show Answer to jump straight to the worked solution.', hl: '.action-row', dur: 8000 },
    { text: 'Study the common mistake note below the solution — it flags the most frequent error for this problem type before you move on.', hl: '.mistake-note', dur: 8500 }
  ]
};

// ─────────────────────────────────────────────────────────────
// ACTIVITY LAB  (screen-1)
// ─────────────────────────────────────────────────────────────

const labState = {
  experiment: 'dice',
  trials: 100,
  speed: 'medium',
  isRunning: false,
  results: [],   // { trial, outcome }
  intervalId: null
};

function initLab() {
  labState.experiment = 'dice';
  labState.trials = 100;
  labState.speed = 'medium';
  labState.isRunning = false;
  labState.results = [];
  clearInterval(labState.intervalId);

  document.getElementById('lab-trial-input').value = 100;
  renderLabExperiments();
  renderSpeedBtns();
  renderDieFace(null);
  renderHistogram();
  renderTrialLog();
  updateRunBtn();
}

function selectExperiment(exp) {
  if (labState.isRunning) return;
  labState.experiment = exp;
  labState.results = [];
  renderLabExperiments();
  renderDieFace(null);
  renderHistogram();
  renderTrialLog();
  setLastRoll('—', '');
}

function renderLabExperiments() {
  const items = document.querySelectorAll('.exp-item');
  items.forEach(el => {
    const isSelected = el.dataset.exp === labState.experiment;
    el.classList.toggle('selected', isSelected);
    const pin = el.querySelector('.pin');
    if (pin) {
      pin.className = 'pin sm' + (isSelected ? ' yellow' : '');
      pin.textContent = isSelected ? '✓' : (el.dataset.exp === 'coin' ? '1' : '2');
    }
  });
}

function selectSpeed(s) {
  labState.speed = s;
  renderSpeedBtns();
}

function renderSpeedBtns() {
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.speed === labState.speed);
  });
}

function runSimulation() {
  if (labState.isRunning) { stopSimulation(); return; }
  const inputEl = document.getElementById('lab-trial-input');
  labState.trials = Math.max(1, Math.min(10000, parseInt(inputEl.value) || 100));
  labState.results = [];
  labState.isRunning = true;
  updateRunBtn();

  const faces = labState.experiment === 'coin' ? ['H', 'T'] : [1, 2, 3, 4, 5, 6];

  if (labState.speed === 'fast') {
    for (let i = 0; i < labState.trials; i++) {
      labState.results.push({ trial: i + 1, outcome: faces[Math.floor(Math.random() * faces.length)] });
    }
    const last = labState.results[labState.results.length - 1];
    setLastRoll(last.outcome, `trial ${labState.trials} / ${labState.trials}`);
    renderDieFace(last.outcome);
    renderHistogram();
    renderTrialLog();
    labState.isRunning = false;
    updateRunBtn();
    return;
  }

  const delay = labState.speed === 'slow' ? 300 : 40;
  let current = 0;

  labState.intervalId = setInterval(() => {
    const outcome = faces[Math.floor(Math.random() * faces.length)];
    current++;
    labState.results.push({ trial: current, outcome });
    setLastRoll(outcome, `trial ${current} / ${labState.trials}`);
    renderDieFace(outcome);

    if (current % 5 === 0 || current === labState.trials) {
      renderHistogram();
      renderTrialLog();
    }

    if (current >= labState.trials) {
      clearInterval(labState.intervalId);
      labState.isRunning = false;
      updateRunBtn();
      renderHistogram();
      renderTrialLog();
    }
  }, delay);
}

function stopSimulation() {
  clearInterval(labState.intervalId);
  labState.isRunning = false;
  updateRunBtn();
}

function resetLab() {
  stopSimulation();
  labState.results = [];
  renderDieFace(null);
  setLastRoll('—', '');
  renderHistogram();
  renderTrialLog();
}

function updateRunBtn() {
  const btn = document.getElementById('btn-run');
  if (!btn) return;
  btn.textContent = labState.isRunning ? '■ Stop' : '▶ Run';
  btn.classList.toggle('running', labState.isRunning);
}

function setLastRoll(val, caption) {
  const v = document.getElementById('last-roll-val');
  const c = document.getElementById('trial-cap');
  if (v) v.textContent = val;
  if (c) c.textContent = caption;
}

function renderDieFace(face) {
  const wrap = document.getElementById('die-svg-wrap');
  if (!wrap) return;
  if (face === null) {
    wrap.innerHTML = buildDieSVG(labState.experiment === 'coin' ? null : null);
    return;
  }
  wrap.innerHTML = labState.experiment === 'coin' ? buildCoinSVG(face) : buildDieSVG(face);
}

function buildDieSVG(face) {
  const dotPositions = {
    null: [],
    1: [[3,3]],
    2: [[1.2,1.2],[4.8,4.8]],
    3: [[1.2,1.2],[3,3],[4.8,4.8]],
    4: [[1.2,1.2],[4.8,1.2],[1.2,4.8],[4.8,4.8]],
    5: [[1.2,1.2],[4.8,1.2],[3,3],[1.2,4.8],[4.8,4.8]],
    6: [[1.2,1.2],[1.2,3],[1.2,4.8],[4.8,1.2],[4.8,3],[4.8,4.8]]
  };
  const dots = (dotPositions[face] || []).map(([cx, cy]) =>
    `<circle cx="${cx}" cy="${cy}" r="0.55" fill="#1F2937"/>`
  ).join('');
  return `<svg viewBox="0 0 6 6" width="80" height="80" style="display:block;">
    <rect x="0.1" y="0.1" width="5.8" height="5.8" rx="1" ry="1"
      fill="white" stroke="#1F2937" stroke-width="0.18"/>
    ${dots}
  </svg>`;
}

function buildCoinSVG(face) {
  const color = face === 'H' ? '#2563EB' : '#DC2626';
  return `<svg viewBox="0 0 80 80" width="80" height="80" style="display:block;">
    <circle cx="40" cy="40" r="36" fill="${color}" stroke="#1F2937" stroke-width="2"/>
    <text x="40" y="52" text-anchor="middle" font-family="Georgia,serif"
      font-size="34" font-weight="700" fill="white">${face}</text>
  </svg>`;
}

function renderHistogram() {
  const chart = document.getElementById('histogram-chart');
  if (!chart) return;
  const faces = labState.experiment === 'coin' ? ['H', 'T'] : [1, 2, 3, 4, 5, 6];
  const theoretical = labState.experiment === 'coin' ? 0.5 : 1 / 6;
  const total = labState.results.length;

  const counts = {};
  faces.forEach(f => counts[f] = 0);
  labState.results.forEach(r => { if (counts[r.outcome] !== undefined) counts[r.outcome]++; });

  const chartH = 90, chartW = chart.clientWidth || 300;
  const barW = Math.floor((chartW - 20) / faces.length) - 4;
  const theoryY = 15;                         // px from top where theoretical line sits
  const maxProb = theoretical * 1.8;          // scale: theoretical maps to 70% of usable height
  const usableH = chartH - theoryY - 16;      // bottom 16px for labels
  const theoryLineY = Math.round((1 - theoretical / maxProb) * usableH) + theoryY;

  let bars = '';
  faces.forEach((f, i) => {
    const prob = total > 0 ? counts[f] / total : 0;
    const barH = Math.min(Math.round((prob / maxProb) * usableH), usableH);
    const barY = theoryY + usableH - barH;
    const x = 10 + i * (barW + 4);
    bars += `<rect x="${x}" y="${barY}" width="${barW}" height="${barH}" fill="#2563EB" rx="2"/>`;
    if (prob > 0) {
      bars += `<text x="${x + barW / 2}" y="${barY + 11}" text-anchor="middle"
        font-family="Consolas,monospace" font-size="9" fill="white" font-weight="700">${prob.toFixed(3)}</text>`;
    }
    bars += `<text x="${x + barW / 2}" y="${chartH - 2}" text-anchor="middle"
      font-family="Consolas,monospace" font-size="10" fill="#6B7280">${f}</text>`;
  });

  const nLabel = total > 0 ? `n = ${total}` : 'n = 0';
  const theoryLabel = labState.experiment === 'coin'
    ? `··· theoretical 1/2 = 0.500   ${nLabel}`
    : `··· theoretical 1/6 = 0.1667   ${nLabel}`;

  chart.innerHTML = `<svg viewBox="0 0 ${chartW} ${chartH}" width="${chartW}" height="${chartH}">
    ${bars}
    <line x1="10" y1="${theoryLineY}" x2="${chartW - 10}" y2="${theoryLineY}"
      stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="${chartW - 12}" y="${theoryLineY - 3}" text-anchor="end"
      font-family="Consolas,monospace" font-size="9" fill="#DC2626" font-style="italic">${theoryLabel}</text>
  </svg>`;
}

function renderTrialLog() {
  const tbody = document.getElementById('trial-log-body');
  if (!tbody) return;
  const recent = labState.results.slice(-30).reverse();
  tbody.innerHTML = '';
  recent.forEach(r => {
    const tr = document.createElement('tr');
    const tdN = document.createElement('td');
    tdN.textContent = String(r.trial).padStart(4, ' ');
    const tdF = document.createElement('td');
    tdF.textContent = r.outcome;
    tr.appendChild(tdN);
    tr.appendChild(tdF);
    tbody.appendChild(tr);
  });
  if (labState.results.length > 30) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 2; td.textContent = '  …';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

function exportCSV() {
  if (!labState.results.length) return;
  const header = 'trial,outcome\n';
  const rows = labState.results.map(r => `${r.trial},${r.outcome}`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `probability_${labState.experiment}_${labState.results.length}_trials.csv`;
  a.click();
}

// ─────────────────────────────────────────────────────────────
// CONCEPT MODULE  (screen-2)
// ─────────────────────────────────────────────────────────────

const conceptState = {
  showA: false,
  showB: false
};

function initConcept() {
  conceptState.showA = false;
  conceptState.showB = false;
  renderConceptLayout();
}

function renderConceptLayout() {
  const body = document.getElementById('concept-tab-body');
  if (!body) return;
  body.innerHTML = `
    <div class="concept-body">
      <div class="dwg grid-panel">
        <div class="event-chips">
          <div class="cap" style="margin-bottom:6px;">events · click to highlight</div>
          <button class="event-chip chip-A${conceptState.showA ? ' on' : ''}" id="chip-A"
            onclick="toggleChip('A')">A · sum is 7</button>
          <button class="event-chip chip-B${conceptState.showB ? ' on' : ''}" id="chip-B"
            onclick="toggleChip('B')">B · sum ≥ 9</button>
          <p class="grid-caption">Each cell = one outcome of rolling two dice. Read as (die₁, die₂).</p>
        </div>
        <div id="sample-grid"></div>
      </div>
      <div class="readout-panels">
        <div class="metric-card">
          <div class="metric-label">total outcomes · n(S)</div>
          <div class="metric-stat lg">36</div>
          <div class="metric-caption">6 × 6 — each die has 6 faces</div>
        </div>
        <div class="metric-card blue" id="readout-A" style="${conceptState.showA ? '' : 'display:none;'}">
          <div class="metric-label">A · sum is 7</div>
          <div class="metric-stat">6 / 36</div>
          <div class="metric-caption">= 1/6 ≈ 0.167</div>
        </div>
        <div class="metric-card red" id="readout-B" style="${conceptState.showB ? '' : 'display:none;'}">
          <div class="metric-label">B · sum ≥ 9</div>
          <div class="metric-stat">10 / 36</div>
          <div class="metric-caption">= 5/18 ≈ 0.278</div>
        </div>
      </div>
    </div>`;
  buildSampleGrid();
}

function buildSampleGrid() {
  const grid = document.getElementById('sample-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let r = 1; r <= 6; r++) {
    for (let c = 1; c <= 6; c++) {
      const cell = document.createElement('div');
      cell.className = 'sample-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.textContent = `${r},${c}`;
      grid.appendChild(cell);
    }
  }
  updateGridHighlight();
}

function updateGridHighlight() {
  document.querySelectorAll('.sample-cell').forEach(cell => {
    const r = +cell.dataset.r, c = +cell.dataset.c;
    const inA = (r + c === 7);
    const inB = (r + c >= 9);
    cell.className = 'sample-cell';
    if (conceptState.showA && conceptState.showB && inA && inB) cell.classList.add('ev-AB');
    else if (conceptState.showA && inA) cell.classList.add('ev-A');
    else if (conceptState.showB && inB) cell.classList.add('ev-B');
  });
}

function toggleChip(event) {
  if (event === 'A') {
    conceptState.showA = !conceptState.showA;
  } else {
    conceptState.showB = !conceptState.showB;
  }
  updateGridHighlight();
  const chipA = document.getElementById('chip-A');
  const chipB = document.getElementById('chip-B');
  if (chipA) chipA.classList.toggle('on', conceptState.showA);
  if (chipB) chipB.classList.toggle('on', conceptState.showB);
  const readoutA = document.getElementById('readout-A');
  const readoutB = document.getElementById('readout-B');
  if (readoutA) readoutA.style.display = conceptState.showA ? '' : 'none';
  if (readoutB) readoutB.style.display = conceptState.showB ? '' : 'none';
  satisfyNarrWait(event);
}

// ─────────────────────────────────────────────────────────────
// VISUALIZATION STUDIO  (screen-3)
// ─────────────────────────────────────────────────────────────

const studioState = {
  red: 4,
  blue: 3,
  eventA: 'both-red',
  eventB: 'first-red',
  operation: 'A-given-B'
};

function initStudio() {
  studioState.red = 4;
  studioState.blue = 3;
  studioState.eventA = 'both-red';
  studioState.eventB = 'first-red';
  studioState.operation = 'A-given-B';
  renderUrnDisplay();
  renderEventOptions();
  renderOperationBtns();
  renderTree();
}

function adjustUrn(color, delta) {
  if (color === 'red') {
    studioState.red = Math.max(1, Math.min(8, studioState.red + delta));
  } else {
    studioState.blue = Math.max(1, Math.min(8, studioState.blue + delta));
  }
  renderUrnDisplay();
  renderTree();
}

function renderUrnDisplay() {
  const wrap = document.getElementById('urn-balls');
  if (!wrap) return;
  const balls = [
    ...Array(studioState.red).fill('red'),
    ...Array(studioState.blue).fill('blue')
  ].map(c => `<span class="ball ${c}"></span>`).join('');
  const n = studioState.red + studioState.blue;
  wrap.innerHTML = `${balls}<span class="urn-label">${studioState.red}R · ${studioState.blue}B · n=${n}</span>`;
  const rCount = document.getElementById('urn-r-count');
  const bCount = document.getElementById('urn-b-count');
  if (rCount) rCount.textContent = studioState.red;
  if (bCount) bCount.textContent = studioState.blue;
}

function setEventA(val) {
  studioState.eventA = val;
  renderEventOptions();
  renderTree();
}

function setEventB(val) {
  studioState.eventB = val;
  renderEventOptions();
  renderTree();
}

function renderEventOptions() {
  const optionsA = [
    { val: 'at-least-one-red',  label: 'At least one Red' },
    { val: 'at-least-one-blue', label: 'At least one Blue' },
    { val: 'both-red',          label: 'Both are Reds' }
  ];
  const optionsB = [
    { val: 'first-red',  label: 'First draw is Red' },
    { val: 'second-red', label: 'Second draw is Red' }
  ];
  const wrapA = document.getElementById('event-A-options');
  const wrapB = document.getElementById('event-B-options');
  if (wrapA) {
    wrapA.innerHTML = optionsA.map(o => `
      <button class="event-option${studioState.eventA === o.val ? ' selected' : ''}"
        onclick="setEventA('${o.val}')">
        <span class="mono" style="font-size:9px;">${studioState.eventA === o.val ? '●' : '○'}</span>
        ${o.label}
      </button>`).join('');
  }
  if (wrapB) {
    wrapB.innerHTML = optionsB.map(o => `
      <button class="event-option${studioState.eventB === o.val ? ' selected' : ''}"
        onclick="setEventB('${o.val}')">
        <span class="mono" style="font-size:9px;">${studioState.eventB === o.val ? '●' : '○'}</span>
        ${o.label}
      </button>`).join('');
  }
}

function setOperation(op) {
  studioState.operation = op;
  renderOperationBtns();
  renderTree();
}

function renderOperationBtns() {
  const ops = ['A', 'complement-A', 'A-given-B'];
  const labels = { 'A': 'A', 'complement-A': "A′", 'A-given-B': 'A | B' };
  document.querySelectorAll('.op-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.op === studioState.operation);
  });
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function simplify(num, den) {
  if (num === 0) return { num: 0, den: 1 };
  const g = gcd(Math.abs(num), Math.abs(den));
  return { num: num / g, den: den / g };
}

function getLeavesA(eventA) {
  return { 'at-least-one-red': ['RR','RB','BR'], 'at-least-one-blue': ['RB','BR','BB'], 'both-red': ['RR'] }[eventA] || [];
}

function getLeavesB(eventB) {
  return { 'first-red': ['RR','RB'], 'second-red': ['RR','BR'] }[eventB] || [];
}

function renderTree() {
  const R = studioState.red, B = studioState.blue, n = R + B;
  if (n < 2) return;

  const p1R = R / n, p1B = B / n;
  const p2RR = (R - 1) / (n - 1), p2RB = B / (n - 1);
  const p2BR = R / (n - 1), p2BB = (B - 1) / (n - 1);

  const denom = n * (n - 1);
  const leafNums = { RR: R*(R-1), RB: R*B, BR: B*R, BB: B*(B-1) };
  const allLeaves = ['RR','RB','BR','BB'];

  const leavesA = new Set(getLeavesA(studioState.eventA));
  const leavesB = new Set(getLeavesB(studioState.eventB));
  const op = studioState.operation;

  // Determine highlight class for each leaf
  function leafHighlight(id) {
    if (op === 'A') return leavesA.has(id) ? 'strong' : 'none';
    if (op === 'complement-A') return !leavesA.has(id) ? 'strong' : 'none';
    // A|B
    const inA = leavesA.has(id), inB = leavesB.has(id);
    if (inA && inB) return 'strong';
    if (!inA && inB) return 'light';
    return 'none';
  }

  // Compute result
  let resultHtml = '';
  if (op === 'A') {
    let num = 0;
    leavesA.forEach(l => num += leafNums[l]);
    const s = simplify(num, denom);
    const dec = (num / denom).toFixed(3);
    resultHtml = `<div class="result-op-label">P(A) &mdash; ${getLeavesA(studioState.eventA).join(' + ')}</div>
      <div class="result-formula"><span class="result-answer">${s.num}/${s.den}</span> = ${dec}</div>`;
  } else if (op === 'complement-A') {
    const complementLeaves = allLeaves.filter(l => !leavesA.has(l));
    let num = 0;
    complementLeaves.forEach(l => num += leafNums[l]);
    const s = simplify(num, denom);
    const dec = (num / denom).toFixed(3);
    resultHtml = `<div class="result-op-label">P(A′) — complement of A &mdash; ${complementLeaves.join(' + ')}</div>
      <div class="result-formula"><span class="result-answer">${s.num}/${s.den}</span> = ${dec}</div>`;
  } else {
    let pAB = 0, pB = 0;
    const numLeaves = [], denLeaves = [];
    allLeaves.forEach(l => {
      if (leavesB.has(l)) {
        pB += leafNums[l];
        if (leavesA.has(l)) { pAB += leafNums[l]; numLeaves.push(l); }
        else { denLeaves.push(l); }
      }
    });
    if (pB === 0) {
      resultHtml = `<div class="result-op-label">P(A | B) — undefined: P(B) = 0</div>`;
    } else {
      const s = simplify(pAB, pB);
      const dec = (pAB / pB).toFixed(3);
      const numChips = numLeaves.map(l => `<span class="result-chip-strong">${l}</span>`).join(' ');
      const denChips = [...numLeaves.map(l => `<span class="result-chip-strong">${l}</span>`),
                        ...denLeaves.map(l => `<span class="result-chip-light">${l}</span>`)].join(' ');
      resultHtml = `
        <div class="result-op-label">P( A | B ) &mdash; conditional probability</div>
        <div class="result-chips">
          <span>numerator (A ∩ B) ·</span> ${numChips}
          <span style="margin-left:8px;">denominator (B) ·</span> ${denChips}
        </div>
        <div class="result-formula">
          ${pAB}/${denom} ÷ ${pB}/${denom} = <span class="result-answer">${s.num}/${s.den}</span> = ${dec}
        </div>`;
    }
  }

  const rr = document.getElementById('result-readout');
  if (rr) rr.innerHTML = resultHtml;

  const titleEl = document.getElementById('tree-title');
  if (titleEl) titleEl.textContent = `Tree · ${R}R + ${B}B, no replacement`;

  // Build SVG
  const svg = document.getElementById('tree-svg');
  if (!svg) return;

  function frac(num, den) {
    const s = simplify(num, den);
    return `${s.num}/${s.den}`;
  }

  function leafRect(id, x, y) {
    const hl = leafHighlight(id);
    if (hl === 'strong') return `<rect x="${x-20}" y="${y-18}" width="105" height="36" rx="4"
      fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    if (hl === 'light')  return `<rect x="${x-20}" y="${y-18}" width="105" height="36" rx="4"
      fill="#FEF9E7" stroke="#FCD34D" stroke-width="1.5" stroke-dasharray="2 3"/>`;
    return '';
  }

  function leafProb(id) {
    const num = leafNums[id], s = simplify(num, denom);
    return `= ${s.num}/${s.den}`;
  }

  const svgContent = `
    <!-- highlight rects behind leaves -->
    ${leafRect('RR', 348, 35)}
    ${leafRect('RB', 348, 110)}
    ${leafRect('BR', 348, 178)}
    ${leafRect('BB', 348, 248)}

    <!-- root -->
    <circle cx="48" cy="140" r="18" fill="#FCD34D" stroke="#1F2937" stroke-width="1.5"/>
    <text x="48" y="145" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="700">S</text>

    <!-- level 1 branches -->
    <line x1="66" y1="140" x2="170" y2="70"  stroke="#1F2937" stroke-width="1.5"/>
    <line x1="66" y1="140" x2="170" y2="210" stroke="#1F2937" stroke-width="1.5"/>
    <text x="88" y="96"  font-family="Consolas,monospace" font-size="11" fill="#2563EB">${frac(R,n)} R</text>
    <text x="88" y="176" font-family="Consolas,monospace" font-size="11" fill="#DC2626">${frac(B,n)} B</text>

    <circle cx="188" cy="70"  r="18" fill="white" stroke="#2563EB" stroke-width="1.5"/>
    <text x="188" y="75" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700">R</text>
    <circle cx="188" cy="210" r="18" fill="white" stroke="#DC2626" stroke-width="1.5"/>
    <text x="188" y="215" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700">B</text>

    <!-- level 2 from R -->
    <line x1="206" y1="70" x2="320" y2="35"  stroke="#1F2937" stroke-width="1.5"/>
    <line x1="206" y1="70" x2="320" y2="110" stroke="#1F2937" stroke-width="1.5"/>
    <text x="228" y="44"  font-family="Consolas,monospace" font-size="10" fill="#2563EB">${frac(R-1,n-1)} R</text>
    <text x="228" y="104" font-family="Consolas,monospace" font-size="10" fill="#DC2626">${frac(B,n-1)} B</text>

    <!-- level 2 from B -->
    <line x1="206" y1="210" x2="320" y2="178" stroke="#1F2937" stroke-width="1.5"/>
    <line x1="206" y1="210" x2="320" y2="248" stroke="#1F2937" stroke-width="1.5"/>
    <text x="228" y="188" font-family="Consolas,monospace" font-size="10" fill="#2563EB">${frac(R,n-1)} R</text>
    <text x="228" y="246" font-family="Consolas,monospace" font-size="10" fill="#DC2626">${frac(B-1,n-1)} B</text>

    <!-- leaf nodes -->
    <circle cx="348" cy="35"  r="15" fill="white" stroke="#059669" stroke-width="1.5"/>
    <text x="348" y="39"  text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700">RR</text>
    <text x="368" y="39"  font-family="Consolas,monospace" font-size="10" fill="#059669">${leafProb('RR')}</text>

    <circle cx="348" cy="110" r="15" fill="white" stroke="#059669" stroke-width="1.5"/>
    <text x="348" y="114" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700">RB</text>
    <text x="368" y="114" font-family="Consolas,monospace" font-size="10" fill="#059669">${leafProb('RB')}</text>

    <circle cx="348" cy="178" r="15" fill="white" stroke="#059669" stroke-width="1.5"/>
    <text x="348" y="182" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700">BR</text>
    <text x="368" y="182" font-family="Consolas,monospace" font-size="10" fill="#059669">${leafProb('BR')}</text>

    <circle cx="348" cy="248" r="15" fill="white" stroke="#059669" stroke-width="1.5"/>
    <text x="348" y="252" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700">BB</text>
    <text x="368" y="252" font-family="Consolas,monospace" font-size="10" fill="#059669">${leafProb('BB')}</text>
  `;

  svg.innerHTML = svgContent;
}

// ─────────────────────────────────────────────────────────────
// PROBLEM ARENA  (screen-4)
// ─────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    tier: 'JEE Mains', marks: '3 marks', set: 'Conditional Probability',
    q: 'Q1 · Conditional Probability',
    body: 'A box contains 4 red and 6 blue balls. Two balls are drawn at random <em>without replacement</em>. Given that the second ball is red, find the probability that the first ball was also red.',
    options: ['A) &nbsp; 2/5', 'B) &nbsp; 1/4', 'C) &nbsp; 1/3', 'D) &nbsp; 2/9'],
    correct: 'C',
    answerLabel: 'C · 1/3',
    explanation: 'Let A = "first ball is red" and B = "second ball is red". Using conditional probability: P(A | B) = P(A ∩ B) / P(B).',
    calc: 'P(A ∩ B) = 4/10 × 3/9 = 12/90\nP(B) = P(R₁R₂) + P(B₁R₂) = 12/90 + 24/90 = 36/90\nP(A | B) = 12/90 ÷ 36/90 = <b class="calc-answer">12/36 = 1/3</b>',
    mistake: 'Common mistake: confusing P(A|B) with P(B|A). Here the <em>given</em> condition is about the second ball, not the first.'
  },
  {
    tier: 'CBSE Boards', marks: '2 marks', set: 'Conditional Probability',
    q: 'Q2 · Conditional Probability',
    body: 'A fair coin is tossed three times. Given that <em>at least two heads</em> appear, what is the probability that all three tosses show heads?',
    options: ['A) &nbsp; 1/2', 'B) &nbsp; 1/4', 'C) &nbsp; 1/8', 'D) &nbsp; 1/3'],
    correct: 'B',
    answerLabel: 'B · 1/4',
    explanation: 'Let A = {HHH} and B = {at least two heads} = {HHT, HTH, THH, HHH}.',
    calc: 'P(A ∩ B) = P(HHH) = 1/8\nP(B) = 4/8 = 1/2\nP(A | B) = (1/8) ÷ (1/2) = <b class="calc-answer">1/4</b>',
    mistake: 'Common mistake: writing P(HHH) = 1/8 directly and forgetting the conditional reduces the sample space to just B.'
  },
  {
    tier: 'JEE Mains', marks: '3 marks', set: 'Conditional Probability',
    q: 'Q3 · Conditional Probability',
    body: 'In a survey, 60% of respondents read newspaper A and 40% read both newspapers A and B. A person is chosen at random from those <em>who read newspaper A</em>. What is the probability they also read newspaper B?',
    options: ['A) &nbsp; 1/3', 'B) &nbsp; 2/3', 'C) &nbsp; 3/5', 'D) &nbsp; 2/5'],
    correct: 'B',
    answerLabel: 'B · 2/3',
    explanation: 'Let A = "reads newspaper A", B = "reads newspaper B". P(A) = 0.6, P(A ∩ B) = 0.4.',
    calc: 'P(B | A) = P(A ∩ B) / P(A)\n         = 0.4 / 0.6\n         = <b class="calc-answer">2/3 ≈ 0.667</b>',
    mistake: 'Common mistake: computing P(A ∩ B)/P(B) instead of P(A ∩ B)/P(A) — confusing which event is the "given".'
  }
];

const arenaState = {
  currentIndex: 0,
  selectedAnswer: null,
  isSubmitted: false,
  isAnswerRevealed: false,
  timerSeconds: 0,
  timerInterval: null
};

function initArena() {
  arenaState.currentIndex = 0;
  loadProblem(0);
}

function loadProblem(idx) {
  clearInterval(arenaState.timerInterval);
  arenaState.selectedAnswer = null;
  arenaState.isSubmitted = false;
  arenaState.isAnswerRevealed = false;
  arenaState.timerSeconds = 0;
  arenaState.currentIndex = idx;

  arenaState.timerInterval = setInterval(() => {
    arenaState.timerSeconds++;
    renderTimer();
  }, 1000);

  renderProblem();
}

function renderTimer() {
  const el = document.getElementById('problem-timer');
  if (!el) return;
  const m = Math.floor(arenaState.timerSeconds / 60);
  const s = arenaState.timerSeconds % 60;
  el.textContent = `timer · ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function selectArenaAnswer(letter) {
  if (arenaState.isSubmitted || arenaState.isAnswerRevealed) return;
  arenaState.selectedAnswer = letter;
  renderMCQOptions();
  document.getElementById('btn-arena-submit').disabled = false;
}

function renderMCQOptions() {
  const prob = PROBLEMS[arenaState.currentIndex];
  const wrap = document.getElementById('mcq-options-wrap');
  if (!wrap) return;
  const letters = ['A','B','C','D'];
  wrap.innerHTML = '';
  prob.options.forEach((opt, i) => {
    const letter = letters[i];
    const btn = document.createElement('button');
    let cls = 'mcq-option';
    if (arenaState.isSubmitted || arenaState.isAnswerRevealed) {
      cls += ' submitted';
      if (letter === prob.correct) cls += ' correct';
      else if (letter === arenaState.selectedAnswer) cls += ' incorrect';
    } else if (arenaState.selectedAnswer === letter) {
      cls += ' selected';
    }
    btn.className = cls;
    btn.onclick = () => selectArenaAnswer(letter);
    btn.innerHTML = `<div class="mcq-radio"></div><span>${opt}</span>`;
    if (arenaState.isSubmitted || arenaState.isAnswerRevealed) btn.disabled = true;
    wrap.appendChild(btn);
  });
}

function submitArena() {
  if (!arenaState.selectedAnswer) return;
  arenaState.isSubmitted = true;
  renderMCQOptions();

  const prob = PROBLEMS[arenaState.currentIndex];
  if (arenaState.selectedAnswer === prob.correct) {
    showArenaAnswer();
  }
  // Show feedback
  document.getElementById('btn-arena-submit').disabled = true;
  const btnShow = document.getElementById('btn-arena-show');
  if (btnShow) btnShow.disabled = false;
}

function showArenaAnswer() {
  clearInterval(arenaState.timerInterval);
  arenaState.isAnswerRevealed = true;
  renderMCQOptions();

  const prob = PROBLEMS[arenaState.currentIndex];
  const mcqWrap = document.getElementById('mcq-options-wrap');
  if (mcqWrap) mcqWrap.style.display = 'none';

  const answerWrap = document.getElementById('answer-card-wrap');
  if (answerWrap) {
    answerWrap.style.display = 'block';
    answerWrap.innerHTML = `
      <div class="answer-card">
        <div class="answer-head">
          <span class="pin sm green">✓</span>
          <span class="answer-title">Answer: ${prob.answerLabel}</span>
        </div>
        <div class="explanation"><strong>Explanation</strong> — ${prob.explanation}</div>
        <div class="calc-box">${prob.calc}</div>
        <div class="mistake-note">${prob.mistake}</div>
      </div>`;
  }

  document.getElementById('btn-arena-submit').disabled = true;
  const btnShow = document.getElementById('btn-arena-show');
  if (btnShow) { btnShow.textContent = '✓ Answer Shown'; btnShow.disabled = true; }
}

function skipArena() {
  const next = arenaState.currentIndex + 1;
  if (next < PROBLEMS.length) loadProblem(next);
  else renderArenaComplete();
}

function renderArenaComplete() {
  clearInterval(arenaState.timerInterval);
  const content = document.getElementById('arena-content');
  if (!content) return;
  content.innerHTML = `
    <div style="text-align:center; padding:40px 20px;">
      <div class="pin" style="width:60px;height:60px;font-size:28px;margin:0 auto 20px;">✓</div>
      <h2 style="font-family:Georgia,serif;font-size:24px;margin-bottom:10px;">All problems complete!</h2>
      <p style="color:var(--muted);margin-bottom:20px;">You have worked through all 3 conditional probability problems.</p>
      <button class="btn-primary" onclick="loadProblem(0)">↺ Restart Problem Set</button>
    </div>`;
}

function renderProblem() {
  const prob = PROBLEMS[arenaState.currentIndex];
  const content = document.getElementById('arena-content');
  if (!content) return;

  const totalProbs = PROBLEMS.length;
  const pNum = arenaState.currentIndex + 1;

  content.innerHTML = `
    <div class="problem-bar">
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="chip blue">${prob.tier}</span>
        <span class="chip">${prob.marks}</span>
      </div>
      <span class="problem-nav">Problem ${pNum} of ${totalProbs} · Set "${prob.set}"</span>
    </div>

    <div class="panel problem-card" style="position:relative;">
      <div class="problem-card-head">
        <span class="problem-q">${prob.q}</span>
        <span class="problem-timer" id="problem-timer">timer · 00:00</span>
      </div>
      <div class="problem-body">${prob.body}</div>
      <div class="mcq-options" id="mcq-options-wrap"></div>
    </div>

    <div id="answer-card-wrap" style="display:none;"></div>

    <div class="action-row">
      <button class="btn-ghost" id="btn-arena-submit" onclick="submitArena()" disabled>Submit</button>
      <button class="btn-primary" id="btn-arena-show" onclick="showArenaAnswer()">Show Answer</button>
      ${pNum < totalProbs ? `<button class="btn-ghost btn-skip" onclick="skipArena()">Skip &rarr;</button>` : ''}
    </div>`;

  renderMCQOptions();
}

// ─────────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Build cover dice grid
  const grid = document.getElementById('dice-grid');
  if (grid) {
    for (let r = 1; r <= 6; r++) {
      for (let c = 1; c <= 6; c++) {
        const cell = document.createElement('div');
        cell.className = 'dice-cell ' + (r + c === 7 ? 'sum7' : 'other');
        cell.textContent = r + c;
        grid.appendChild(cell);
      }
    }
  }

  goToScreen('screen-intro');
});
