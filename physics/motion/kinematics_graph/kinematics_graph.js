// ── Screen navigation ──
const NEXT_SCREEN = {
  'screen-intro': 'screen-1',
  'screen-1':  'screen-2',
  'screen-2':  'screen-3',
  'screen-3':  'screen-4',
  'screen-4':  'screen-5',
  'screen-5':  'screen-6',
  'screen-6':  'screen-7',
  'screen-7':  'screen-8',
  'screen-8':  'screen-9',
  'screen-9':  'screen-10',
  'screen-10': 'screen-11',
  'screen-11': 'screen-12',
  'screen-12': 'screen-13',
  'screen-13': 'screen-14',
  'screen-14': 'screen-15',
  'screen-15': 'screen-16',
  'screen-16': 'screen-17',
  'screen-17': 'screen-18',
  'screen-18': 'screen-19',
};
const PREV_SCREEN = Object.fromEntries(Object.entries(NEXT_SCREEN).map(([a,b])=>[b,a]));

let currentScreen = 'screen-intro';

function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  currentScreen = id;
  narrStop();
  clearHighlights();
  const bar = document.getElementById('narration-bar');
  if (bar) bar.style.display = id === 'screen-intro' ? 'none' : 'flex';
  initScreen(id);
  if (id !== 'screen-intro') narrPlay();
}

function nextScreen() {
  const n = NEXT_SCREEN[currentScreen];
  if (n) goToScreen(n);
}

function prevScreen() {
  const p = PREV_SCREEN[currentScreen];
  if (p) goToScreen(p);
}

function initScreen(id) {
  if (id === 'screen-intro') initIntro();
  if (id === 'screen-1')  drawScreen1();
  if (id === 'screen-2')  drawScreen2();
  if (id === 'screen-3')  drawScreen3();
  if (id === 'screen-4')  drawScreen4();
  if (id === 'screen-5')  drawScreen5();
  if (id === 'screen-6')  drawScreen6();
  if (id === 'screen-7')  drawMCQ1();
  if (id === 'screen-8')  drawAnswer1();
  if (id === 'screen-9')  drawMCQ2();
  if (id === 'screen-10') drawAnswer2();
  if (id === 'screen-11') drawMCQ3();
  if (id === 'screen-12') drawAnswer3();
  if (id === 'screen-13') drawMCQ4();
  if (id === 'screen-14') drawAnswer4();
  if (id === 'screen-15') drawMCQ5();
  if (id === 'screen-16') drawAnswer5();
  if (id === 'screen-17') drawMCQ6();
  if (id === 'screen-18') drawAnswer6();
  if (id === 'screen-19') initSandbox();
}

// ── Narration engine ──
const narrState = { step: -1, playing: false, utt: null, timer: null, resumeInterval: null };

const NARR = {
  'screen-intro': [],
  'screen-1': [
    { text: 'Acceleration is the rate of change of velocity — it tells you how quickly velocity is changing each second.', hl: '#s1-def-title', dur: 9000 },
    { text: 'The symbol is a and the unit is metres per second squared.', hl: '#s1-def-unit', dur: 6000 },
    { text: 'When velocity rises, acceleration is positive — the object is speeding up.', hl: '#s1-def-pos', dur: 6000 },
    { text: 'When velocity falls, acceleration is negative — this is called deceleration.', hl: '#s1-def-neg', dur: 6000 },
    { text: 'Acceleration is a vector, so direction matters — the sign tells you which way the velocity change points.', hl: '#s1-def-vector', dur: 8000 },
    { text: 'A car speeding up has positive acceleration; a car braking has negative acceleration.', hl: '#s1-def-ex-car1, #s1-def-ex-car2', dur: 7000 },
    { text: 'A ball thrown upward decelerates on the way up, then accelerates back down under gravity.', hl: '#s1-def-ex-ball1, #s1-def-ex-ball2', dur: 7000 },
    { text: 'The formula is a equals v minus u over t, where u is initial velocity and v is final velocity. The unit is metres per second squared.', hl: '#s1-formula', dur: 12000 },
    { text: 'The illustration shows the key idea: accelerating means growing arrows — each second the object moves faster. Decelerating means shrinking arrows.', hl: '#s1-illus', dur: 11000 },
  ],
  'screen-2': [
    { text: 'Consider a particle with uniform acceleration that starts from rest — at t equals zero the initial velocity u is zero.', hl: '#s2-setup-rest', dur: 10000 },
    { text: 'The acceleration a stays constant throughout — it does not change at any point during the motion.', hl: '#s2-setup-accel', dur: 8000 },
    { text: 'Since u is zero, velocity at any time is simply v equals a times t — this follows directly from the definition a equals v over t.', hl: '#s2-setup-vderiv', dur: 12000 },
    { text: 'Distance is average speed times time. Average speed is zero plus v over two, which is v over two. Substituting v equals a t gives d equals one half a t squared.', hl: '#s2-setup-dderiv', dur: 14000 },
    { text: 'The formula card on the right confirms: v equals a times t.', hl: '#s2-vformula', dur: 6000 },
    { text: 'And displacement is one half a t squared.', hl: '#s2-dformula', dur: 5000 },
    { text: 'The v–t graph is a straight line through the origin. The d–t graph is an upward-curving parabola that starts flat and steepens over time.', hl: '#s2-graphs', dur: 12000 },
  ],
  'screen-3': [
    { text: 'Now suppose the particle already has some initial velocity u when the clock starts.', hl: '#s3-setup', dur: 7000 },
    { text: 'Velocity is now u plus a times t. The v–t graph still has slope a, but the y-intercept shifts up to u instead of starting at zero.', hl: '#s3-vformula', dur: 9000 },
    { text: 'Distance becomes u times t plus one half a t squared. The area under v–t is now a trapezoid — a rectangle of height u plus a triangle on top.', hl: '#s3-dformula', dur: 10000 },
    { text: 'The v–t graph starts at u and rises with slope a. The d–t graph is a tilted parabola — it climbs immediately from t equals zero, unlike the rest-start case.', hl: '#s3-graphs', dur: 10000 },
  ],
  'screen-4': [
    { text: 'Deceleration is just negative acceleration. The same formulas apply — you simply plug in a negative value for a.', hl: '#s4-key', dur: 8000 },
    { text: 'Velocity falls as v equals u minus a times t. The v–t graph drops linearly until it hits zero at t-stop equals u over a.', hl: '#s4-vformula', dur: 9000 },
    { text: 'Distance grows as u t minus one half a t squared — it rises, then levels off when the particle stops.', hl: '#s4-dformula', dur: 8000 },
    { text: 'After stopping, with friction present, static friction holds the object in place. Velocity stays at zero and distance stays constant.', hl: '#s4-graphs', dur: 9000 },
  ],
  'screen-5': [
    { text: 'Kinetic friction between two sliding surfaces always opposes the direction of motion. The friction force is mu-k times the normal force N.', hl: '#s5-key', dur: 9000 },
    { text: 'On a flat horizontal surface, this gives a constant deceleration of mu-k times g. It is constant because mu-k does not change with speed.', hl: '#s5-illus', dur: 9000 },
    { text: 'The v–t graph under kinetic friction is a straight line dropping to zero — a linear deceleration to rest. Once v reaches zero, static friction takes over and the object stays put.', hl: '#s5-graph', dur: 10000 },
  ],
  'screen-6': [
    { text: 'Here is the key insight that ties all the graphs together: velocity is the slope of the d–t graph at any moment, and acceleration is the slope of the v–t graph.', hl: '#s6-key', dur: 10000 },
    { text: 'A steep d–t curve means large velocity. A flat d–t means the object is nearly at rest. If d–t bends upward, acceleration is positive; bending downward means negative acceleration.', hl: '#s6-left-pair', dur: 10000 },
    { text: 'When v–t is a straight line with constant slope, the a–t graph is a flat horizontal line — constant acceleration. One graph gives you the other two by reading its slope.', hl: '#s6-right-pair', dur: 10000 },
  ],
  'screen-7': [
    { text: 'MCQ 1. A ball is thrown vertically upward. It rises, momentarily stops at the apex, then falls back to the thrower\'s hand. Ignore air resistance.', hl: '#mcq1-scenario', dur: 9000 },
    { text: 'Your task: pick the option whose d–t, v–t, and a–t graphs all tell a consistent story for this motion.', hl: '#mcq1-options', dur: 7000 },
    { text: 'Hint: read each row carefully. Think about what happens to displacement, velocity, and acceleration at launch, at the apex, and on the way back down.', hl: '#mcq1-hint', dur: 9000 },
  ],
  'screen-8': [
    { text: 'The answer is Option B. Displacement follows an arch — it rises to a peak and returns to zero. Velocity is linear and crosses zero at the apex. Acceleration is constant negative g throughout.', hl: '#ans1-graphs', dur: 12000 },
    { text: 'Step 1 — at launch: d is zero, v is at its maximum positive value, and a is already negative g the moment the hand releases.', hl: '#ans1-step1', dur: 9000 },
    { text: 'Step 2 — at the apex: d is at its maximum. v equals zero for an instant. a is still negative g — gravity does not switch off at the top.', hl: '#ans1-step2', dur: 9000 },
    { text: 'Step 3 — back at the hand: d returns to zero. v is now at its maximum negative value, same speed as launch but downward. a remains negative g the whole journey.', hl: '#ans1-step3', dur: 10000 },
  ],
  'screen-9': [
    { text: 'MCQ 2. A ball is released from rest at the top of a frictionless incline. It slides down with constant acceleration g-sin-theta.', hl: '#mcq2-scenario', dur: 9000 },
    { text: 'Pick the option whose d–t, v–t, and a–t graphs all tell a consistent story for this motion.', hl: '#mcq2-options', dur: 7000 },
    { text: 'Hint: since there is no friction, the slope of the incline provides a constant net force the whole way down. What does constant acceleration look like on each graph?', hl: '#mcq2-hint', dur: 9000 },
  ],
  'screen-10': [
    { text: 'The answer is Option A. Displacement follows a parabola, velocity rises linearly, and acceleration is a flat positive constant throughout.', hl: '#ans2-graphs', dur: 10000 },
    { text: 'Step 1 — just released: d is approximately zero, v equals zero, and a is the constant down-slope acceleration g-sin-theta.', hl: '#ans2-step1', dur: 8000 },
    { text: 'Step 2 — halfway down: d has grown quadratically. v has grown to half its final value. a is unchanged because the frictionless slope provides constant force.', hl: '#ans2-step2', dur: 9000 },
    { text: 'Step 3 — at the bottom: d is at its maximum. v is at its maximum. a is still the same constant — the frictionless slope produces the same acceleration throughout.', hl: '#ans2-step3', dur: 10000 },
  ],
  'screen-11': [
    { text: 'MCQ 3. A car accelerates from rest, cruises at constant speed, then brakes to a stop. Three distinct phases.', hl: '#mcq3-scenario', dur: 8000 },
    { text: 'Pick the option whose d–t, v–t, and a–t graphs all correctly show all three phases.', hl: '#mcq3-options', dur: 7000 },
    { text: 'Hint: during cruising, velocity is constant — what does that mean for the a–t graph and the d–t slope?', hl: '#mcq3-hint', dur: 8000 },
  ],
  'screen-12': [
    { text: 'The answer is Option C. Distance grows throughout — steepening, then linear, then flattening. Velocity is a trapezoid. Acceleration steps positive, zero, then negative.', hl: '#ans3-graphs', dur: 11000 },
    { text: 'Step 1 — accelerating: the engine pushes forward. d curves upward with increasing slope, v rises linearly, a is a constant positive value.', hl: '#ans3-step1', dur: 9000 },
    { text: 'Step 2 — cruising: throttle balances drag. d grows linearly — constant slope — v is flat at cruising speed, and a equals zero.', hl: '#ans3-step2', dur: 9000 },
    { text: 'Step 3 — braking: constant retarding force. d still grows but its slope flattens. v falls linearly to zero. a is constant negative.', hl: '#ans3-step3', dur: 9000 },
  ],
  'screen-13': [
    { text: 'MCQ 4. A ball is dropped from a height onto a hard floor. It bounces several times, each bounce reaching a lower peak. Ignore air resistance.', hl: '#mcq4-scenario', dur: 9000 },
    { text: 'Pick the option whose d–t and v–t graphs correctly capture the bouncing motion with decreasing peaks.', hl: '#mcq4-options', dur: 7000 },
    { text: 'Hint: between bounces, the ball is in free fall — what shape should each hump of the d–t graph be? And what happens to velocity at the moment of each impact?', hl: '#mcq4-hint', dur: 10000 },
  ],
  'screen-14': [
    { text: 'The answer is Option B. Distance shows decreasing humps — parabolic arcs touching zero at each bounce — and velocity is a signed sawtooth shrinking toward zero.', hl: '#ans4-graphs', dur: 11000 },
    { text: 'Step 1 — first fall: d falls from the initial height to zero. v goes from zero at the apex to its largest negative value at impact.', hl: '#ans4-step1', dur: 9000 },
    { text: 'Step 2 — first bounce: ball reverses direction at the floor, v jumps positive, then rises to a smaller peak. The second hump in d–t is smaller than the first.', hl: '#ans4-step2', dur: 9000 },
    { text: 'Step 3 — later bounces: each cycle the peak shrinks because energy is lost at every impact. Eventually the ball comes to rest at the floor.', hl: '#ans4-step3', dur: 9000 },
  ],
  'screen-15': [
    { text: 'MCQ 5. A pendulum is released from one extreme. It swings back and forth. Displacement d is the signed horizontal displacement from the equilibrium centre.', hl: '#mcq5-scenario', dur: 10000 },
    { text: 'Pick the option whose d–t, v–t, and a–t graphs all correctly describe one full oscillation.', hl: '#mcq5-options', dur: 7000 },
    { text: 'Hint: this is simple harmonic motion. All three quantities — displacement, velocity, and acceleration — are sinusoidal, each 90 degrees apart in phase.', hl: '#mcq5-hint', dur: 9000 },
  ],
  'screen-16': [
    { text: 'The answer is Option D. All three graphs are sinusoids, with d, v, and a each shifted 90 degrees in phase from the previous.', hl: '#ans5-graphs', dur: 10000 },
    { text: 'Step 1 — at the extreme: d is at its maximum. v equals zero because the pendulum was released from rest. a is at its maximum negative — the restoring force points back to centre.', hl: '#ans5-step1', dur: 10000 },
    { text: 'Step 2 — through the centre: d equals zero. v is at its largest magnitude — fastest point. a equals zero because there is no restoring force at the equilibrium position.', hl: '#ans5-step2', dur: 10000 },
    { text: 'Step 3 — at the other extreme: d is at its maximum negative. v equals zero again. a is now maximum positive — restoring force now points back toward centre from the other side.', hl: '#ans5-step3', dur: 10000 },
  ],
  'screen-17': [
    { text: 'MCQ 6. A ball slides down a rough frictional incline, then onto an adjacent upward incline which is also rough. It eventually stops. d is the distance travelled along the path.', hl: '#mcq6-scenario', dur: 11000 },
    { text: 'Pick the option whose d–t, v–t, and a–t graphs correctly capture both phases of motion.', hl: '#mcq6-options', dur: 7000 },
    { text: 'Hint: on the down-slope, friction opposes motion upward so the net force is partially down-slope, giving positive acceleration. On the up-slope, both gravity and friction oppose motion, giving a larger deceleration.', hl: '#mcq6-hint', dur: 12000 },
  ],
  'screen-18': [
    { text: 'The answer is Option A. Distance grows and then plateaus when the ball stops. Velocity is a triangle — rises then falls to zero. Acceleration steps positive on the down-slope, then negative on the up-slope, then zero when stopped.', hl: '#ans6-graphs', dur: 13000 },
    { text: 'Step 1 — released at the top of the down-slope: v is zero, d is zero. Friction is less than the down-slope gravity component so net force is down the slope — positive acceleration.', hl: '#ans6-step1', dur: 11000 },
    { text: 'Step 2 — at the joint between slopes: d equals the length of the first slope. v is at its maximum. Transitioning to the up-slope, both gravity and friction now oppose motion — acceleration flips to a larger negative value.', hl: '#ans6-step2', dur: 12000 },
    { text: 'Step 3 — comes to rest on the up-slope: steadily decelerated, v reaches zero. Static friction holds the ball in place. d stays flat, v equals zero, a equals zero.', hl: '#ans6-step3', dur: 11000 },
  ],
  'screen-19': [
    { text: 'Welcome to the Acceleration Sandbox. Click any grid point on the acceleration graph to place a point — each click snaps to the nearest integer grid corner. Connect two or more points to define a piecewise-linear acceleration profile.', hl: '#sb-at-panel', dur: 15000 },
    { text: 'The velocity graph updates live as you draw. Velocity at any moment equals the accumulated area swept under the acceleration curve. Flat positive acceleration gives a steadily rising velocity; negative acceleration makes it fall.', hl: '#sb-vt-panel', dur: 14000 },
    { text: 'Displacement follows one step further — area under the velocity curve gives running displacement. Try different acceleration shapes and watch how both derived graphs react together. Use Undo to remove the last point, or Clear to start fresh.', hl: '#sb-dt-panel', dur: 14000 },
  ],
};

function startResumeInterval() {
  if (narrState.resumeInterval) return;
  narrState.resumeInterval = setInterval(() => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
  }, 9000);
}

function stopResumeInterval() {
  clearInterval(narrState.resumeInterval);
  narrState.resumeInterval = null;
}

function narrPlay() {
  if (narrState.playing) return;
  narrState.playing = true;
  if (narrState.step < 0) narrState.step = 0;
  startResumeInterval();
  speakStep();
}

function narrPause() {
  narrState.playing = false;
  clearTimeout(narrState.timer);
  stopResumeInterval();
  if (narrState.utt) { narrState.utt.onend = null; window.speechSynthesis.cancel(); narrState.utt = null; }
  updateNarrButton();
}

function narrStop() {
  narrState.playing = false;
  narrState.step = -1;
  clearTimeout(narrState.timer);
  stopResumeInterval();
  if (narrState.utt) { narrState.utt.onend = null; window.speechSynthesis.cancel(); narrState.utt = null; }
  updateNarrText('');
  updateNarrButton();
  updateNarrProgress();
}

function narrToggle() {
  if (narrState.playing) {
    narrPause();
  } else {
    if (narrState.step < 0) narrState.step = 0;
    const steps = NARR[currentScreen] || [];
    if (narrState.step >= steps.length) narrState.step = 0;
    narrState.playing = true;
    startResumeInterval();
    speakStep();
  }
}

function narrRestart() {
  narrStop();
  narrState.step = 0;
  narrState.playing = true;
  startResumeInterval();
  speakStep();
}

function narrAdvance() {
  const steps = NARR[currentScreen] || [];
  narrState.step++;
  if (narrState.step >= steps.length) {
    narrState.playing = false;
    updateNarrButton();
    return;
  }
  speakStep();
}

function speakStep() {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; }
  const steps = NARR[currentScreen] || [];
  if (narrState.step < 0 || narrState.step >= steps.length) {
    narrState.playing = false;
    updateNarrButton();
    return;
  }
  const step = steps[narrState.step];
  clearHighlights();
  if (step.hl) {
    document.querySelectorAll(step.hl).forEach(el => el.classList.add('hl-active'));
  }
  updateNarrText(step.text);
  updateNarrButton();
  updateNarrProgress();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(step.text);
    utt.rate = 0.95;
    utt.onend = () => { if (narrState.playing) narrAdvance(); };
    narrState.utt = utt;
    narrState.timer = setTimeout(() => {
      if (narrState.playing) narrAdvance();
    }, step.dur + 2000);
    window.speechSynthesis.speak(utt);
  } else {
    narrState.timer = setTimeout(() => {
      if (narrState.playing) narrAdvance();
    }, step.dur);
  }
}

function updateNarrText(t) {
  const el = document.getElementById('narr-text');
  if (el) el.textContent = t;
}

function updateNarrButton() {
  const btn = document.getElementById('btn-narr-toggle');
  if (btn) btn.innerHTML = narrState.playing ? '&#9646;&#9646; Pause' : '&#9654; Play';
}

function updateNarrProgress() {
  const steps = NARR[currentScreen] || [];
  const pct = steps.length === 0 ? 0 : ((narrState.step + 1) / steps.length) * 100;
  const fill = document.getElementById('narr-progress-fill');
  if (fill) fill.style.width = Math.max(0, pct) + '%';
}

function clearHighlights() {
  document.querySelectorAll('.hl-active').forEach(el => el.classList.remove('hl-active'));
}

// ── Canvas drawing helpers ──
// ── SVG helpers ──
function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k,v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

function getSVG(id) {
  const s = document.getElementById(id);
  if (!s) return null;
  const W = parseFloat(s.getAttribute('width'));
  const H = parseFloat(s.getAttribute('height'));
  if (!s.getAttribute('viewBox')) s.setAttribute('viewBox', `0 0 ${W} ${H}`);
  return {s, W, H};
}

function clearSVG(s) {
  while (s.firstChild) s.removeChild(s.firstChild);
}

function drawAxesSVG(s, W, H, labelX, labelY) {
  clearSVG(s);
  const ox=28, oy=10, ex=W-10, ey=H-22;
  s.appendChild(svgEl('polyline',{points:`${ox},${oy} ${ox},${ey} ${ex},${ey}`,stroke:'#1e293b','stroke-width':'1.5',fill:'none'}));
  s.appendChild(svgEl('polyline',{points:`${ox-4},${oy+8} ${ox},${oy} ${ox+4},${oy+8}`,stroke:'#1e293b','stroke-width':'1.5',fill:'none'}));
  s.appendChild(svgEl('polyline',{points:`${ex-8},${ey-4} ${ex},${ey} ${ex-8},${ey+4}`,stroke:'#1e293b','stroke-width':'1.5',fill:'none'}));
  const ly=svgEl('text',{x:ox+4,y:oy+10,fill:'#1e293b','font-size':'11','font-style':'italic','font-family':'serif'}); ly.textContent=labelY; s.appendChild(ly);
  const lx=svgEl('text',{x:ex-8,y:ey-4,fill:'#1e293b','font-size':'11','font-style':'italic','font-family':'serif'}); lx.textContent=labelX; s.appendChild(lx);
  return {ox,oy,ex,ey};
}

function plotLineSVG(s, pts, color, ox, oy, ex, ey) {
  const p=pts.map(([x,y])=>`${ox+x*(ex-ox)},${ey-y*(ey-oy)}`).join(' ');
  s.appendChild(svgEl('polyline',{points:p,stroke:color,'stroke-width':'2',fill:'none'}));
}

function plotCurveSVG(s, fn, color, ox, oy, ex, ey, steps=80) {
  const p=[];
  for(let i=0;i<=steps;i++){const t=i/steps;p.push(`${ox+t*(ex-ox)},${ey-fn(t)*(ey-oy)}`);}
  s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:color,'stroke-width':'2',fill:'none'}));
}

function drawStepDotSVG(s, x, y, label, ox, oy, ex, ey) {
  const px=ox+x*(ex-ox), py=ey-y*(ey-oy);
  s.appendChild(svgEl('circle',{cx:px,cy:py,r:'9',fill:'#f59e0b'}));
  const t=svgEl('text',{x:px,y:py+3.5,fill:'#1a2535','font-size':'9','font-weight':'bold','font-family':'sans-serif','text-anchor':'middle'}); t.textContent=label; s.appendChild(t);
}

function svgCaption(s, text, ox, ey) {
  const t=svgEl('text',{x:ox,y:ey+12,fill:'#64748b','font-size':'9','font-family':'sans-serif'}); t.textContent=text; s.appendChild(t);
}

function svgDashLine(s, x1, y1, x2, y2, stroke) {
  s.appendChild(svgEl('line',{x1,y1,x2,y2,stroke,'stroke-width':'0.8','stroke-dasharray':'3,3'}));
}

// ── Intro ──
function initIntro() {
  ['intro-d','intro-v','intro-a'].forEach(id => {
    const sv=document.getElementById(id);
    if(!sv) return;
    const W=parseFloat(sv.getAttribute('width')),H=parseFloat(sv.getAttribute('height'));
    sv.setAttribute('viewBox',`0 0 ${W} ${H}`);
    clearSVG(sv);
    sv.appendChild(svgEl('rect',{x:0,y:0,width:W,height:H,fill:'#000'}));
    const ox=18,oy=8,ex=W-8,ey=H-14;
    if(id==='intro-d'){
      const p=[];for(let i=0;i<=60;i++){const t=i/60;p.push(`${ox+t*(ex-ox)},${ey-t*t*(ey-oy)}`);}
      sv.appendChild(svgEl('polyline',{points:p.join(' '),stroke:'#f59e0b','stroke-width':'2',fill:'none'}));
    } else if(id==='intro-v'){
      sv.appendChild(svgEl('line',{x1:ox,y1:ey,x2:ex,y2:oy,stroke:'#f59e0b','stroke-width':'2'}));
    } else {
      sv.appendChild(svgEl('line',{x1:ox,y1:oy+20,x2:ex,y2:oy+20,stroke:'#f59e0b','stroke-width':'2'}));
    }
    const label=id==='intro-d'?'d':id==='intro-v'?'v':'a';
    const tY=svgEl('text',{x:ox+2,y:oy+10,fill:'#f59e0b','font-size':'11','font-style':'italic','font-weight':'bold','font-family':'serif'}); tY.textContent=label; sv.appendChild(tY);
    const tX=svgEl('text',{x:ex-8,y:ey-2,fill:'#f59e0b','font-size':'10','font-style':'italic','font-family':'serif'}); tX.textContent='t'; sv.appendChild(tX);
  });
}

// ── Screen 1 — Acceleration/Deceleration illustration ──
function drawScreen1() {
  const r=getSVG('s1-illus-canvas');
  if(!r) return;
  const {s,W,H}=r; clearSVG(s);
  const tLabels=['t = 1','t = 2','t = 3'];

  // ── Accelerating section ──
  const tAcc=svgEl('text',{x:10,y:16,fill:'#2563eb','font-size':'11.5','font-weight':'bold','font-family':'sans-serif'}); tAcc.textContent='Accelerating (+a)'; s.appendChild(tAcc);
  const accLen=[50,90,140];
  for(let i=0;i<3;i++){
    const y=32+i*35;
    s.appendChild(svgEl('line',{x1:20,y1:y,x2:20+accLen[i],y2:y,stroke:'#2563eb','stroke-width':'2.5'}));
    s.appendChild(svgEl('polygon',{points:`${20+accLen[i]},${y-5} ${20+accLen[i]+9},${y} ${20+accLen[i]},${y+5}`,fill:'#2563eb'}));
    const t=svgEl('text',{x:175,y:y+4,fill:'#64748b','font-size':'10.5','font-family':'sans-serif'}); t.textContent=tLabels[i]; s.appendChild(t);
  }
  // vertical trend arrow — pointing DOWN (velocity increases as time progresses downward)
  s.appendChild(svgEl('line',{x1:248,y1:32,x2:248,y2:100,stroke:'#2563eb','stroke-width':'2'}));
  s.appendChild(svgEl('polygon',{points:'243,92 248,102 253,92',fill:'#2563eb'}));
  const lUp=svgEl('text',{x:258,y:64,fill:'#2563eb','font-size':'10.5','font-weight':'600','font-family':'sans-serif'}); lUp.textContent='Velocity going up'; s.appendChild(lUp);

  // ── Separator ──
  s.appendChild(svgEl('line',{x1:8,y1:122,x2:W-8,y2:122,stroke:'#e2e8f0','stroke-width':'1'}));

  // ── Decelerating section ──
  const tDec=svgEl('text',{x:10,y:140,fill:'#dc2626','font-size':'11.5','font-weight':'bold','font-family':'sans-serif'}); tDec.textContent='Decelerating (−a)'; s.appendChild(tDec);
  const decLen=[140,90,50];
  for(let i=0;i<3;i++){
    const y=156+i*35;
    s.appendChild(svgEl('line',{x1:20,y1:y,x2:20+decLen[i],y2:y,stroke:'#dc2626','stroke-width':'2.5'}));
    s.appendChild(svgEl('polygon',{points:`${20+decLen[i]},${y-5} ${20+decLen[i]+9},${y} ${20+decLen[i]},${y+5}`,fill:'#dc2626'}));
    const t=svgEl('text',{x:175,y:y+4,fill:'#64748b','font-size':'10.5','font-family':'sans-serif'}); t.textContent=tLabels[i]; s.appendChild(t);
  }
  // vertical trend arrow — pointing DOWN
  s.appendChild(svgEl('line',{x1:248,y1:152,x2:248,y2:222,stroke:'#dc2626','stroke-width':'2'}));
  s.appendChild(svgEl('polygon',{points:'243,214 248,224 253,214',fill:'#dc2626'}));
  const lDn=svgEl('text',{x:258,y:188,fill:'#dc2626','font-size':'10.5','font-weight':'600','font-family':'sans-serif'}); lDn.textContent='Velocity going down'; s.appendChild(lDn);
}

// ── Screen 2 — Starts from rest graphs ──
function drawScreen2() {
  let r=getSVG('s2-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0],[1,1]],'#2563eb',ox,oy,ex,ey);}
  r=getSVG('s2-dt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');plotCurveSVG(s,t=>t*t,'#2563eb',ox,oy,ex,ey);}
}

// ── Screen 3 — Non-zero initial velocity ──
function drawScreen3() {
  let r=getSVG('s3-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0.35],[1,1]],'#2563eb',ox,oy,ex,ey);}
  r=getSVG('s3-dt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');plotCurveSVG(s,t=>0.35*t+0.65*t*t,'#2563eb',ox,oy,ex,ey);}
}

// ── Screen 4 — Deceleration ──
function drawScreen4() {
  let r=getSVG('s4-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,1],[0.7,0],[1,0]],'#2563eb',ox,oy,ex,ey);}
  r=getSVG('s4-dt');
  if(r){
    const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');
    plotCurveSVG(s,t=>{const u=Math.min(t,0.7);return u-0.5*u*u/0.7;},'#2563eb',ox,oy,ex,ey);
    const stopY=0.7-0.5*0.7;
    plotLineSVG(s,[[0.7,stopY],[1,stopY]],'#2563eb',ox,oy,ex,ey);
  }
}

// ── Screen 5 — Kinetic friction ──
function drawScreen5() {
  const ri=getSVG('s5-illus-canvas');
  if(ri){
    const{s,W,H}=ri; clearSVG(s);
    s.appendChild(svgEl('line',{x1:30,y1:H-30,x2:W-30,y2:H-30,stroke:'#94a3b8','stroke-width':'1.5'}));
    for(let x=30;x<W-30;x+=12){s.appendChild(svgEl('line',{x1:x,y1:H-30,x2:x-8,y2:H-20,stroke:'#94a3b8','stroke-width':'1.5'}));}
    const bx=W/2-30,by=H-80,bw=60,bh=40;
    s.appendChild(svgEl('rect',{x:bx,y:by,width:bw,height:bh,fill:'#e2e8f0',stroke:'#475569','stroke-width':'2'}));
    s.appendChild(svgEl('line',{x1:bx+bw+4,y1:by+bh/2,x2:bx+bw+40,y2:by+bh/2,stroke:'#2563eb','stroke-width':'2.5'}));
    s.appendChild(svgEl('polygon',{points:`${bx+bw+40},${by+bh/2-5} ${bx+bw+50},${by+bh/2} ${bx+bw+40},${by+bh/2+5}`,fill:'#2563eb'}));
    const tv=svgEl('text',{x:bx+bw+54,y:by+bh/2+4,fill:'#2563eb','font-size':'12','font-family':'sans-serif'}); tv.textContent='v'; s.appendChild(tv);
    s.appendChild(svgEl('line',{x1:bx-4,y1:by+bh/2,x2:bx-40,y2:by+bh/2,stroke:'#16a34a','stroke-width':'2.5'}));
    s.appendChild(svgEl('polygon',{points:`${bx-40},${by+bh/2-5} ${bx-50},${by+bh/2} ${bx-40},${by+bh/2+5}`,fill:'#16a34a'}));
    const tf=svgEl('text',{x:bx-120,y:by+bh/2-8,fill:'#16a34a','font-size':'10','font-family':'sans-serif'}); tf.textContent='friction = μₖN'; s.appendChild(tf);
  }
  const rg=getSVG('s5-graph-canvas');
  if(rg){
    const{s,W,H}=rg;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');
    plotLineSVG(s,[[0,1],[0.85,0],[1,0]],'#2563eb',ox,oy,ex,ey);
    drawStepDotSVG(s,0.02,0.97,'1',ox,oy,ex,ey);
    drawStepDotSVG(s,0.43,0.5,'2',ox,oy,ex,ey);
    drawStepDotSVG(s,0.85,0.02,'3',ox,oy,ex,ey);
  }
}

// ── Screen 6 — Slope relationships ──
function drawScreen6() {
  let r=getSVG('s6-dt-left');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');plotCurveSVG(s,t=>t*t,'#2563eb',ox,oy,ex,ey);}
  r=getSVG('s6-vt-left');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0],[1,1]],'#2563eb',ox,oy,ex,ey);}
  r=getSVG('s6-vt-right');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0],[1,1]],'#2563eb',ox,oy,ex,ey);}
  r=getSVG('s6-at-right');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','a');plotLineSVG(s,[[0,0.5],[1,0.5]],'#2563eb',ox,oy,ex,ey);}
}

// ── MCQ option drawing helpers ──
function drawMCQOption(svgId, graphFns) {
  const r=getSVG(svgId);
  if(!r) return;
  const{s,W,H}=r; clearSVG(s);
  const rows=graphFns.length;
  const rh=Math.floor(H/rows);
  graphFns.forEach((g,i)=>{
    const oy2=i*rh+4,ey2=(i+1)*rh-8,ox2=20,ex2=W-8;
    s.appendChild(svgEl('polyline',{points:`${ox2},${oy2} ${ox2},${ey2} ${ex2},${ey2}`,stroke:'#1e293b','stroke-width':'1',fill:'none'}));
    const tl=svgEl('text',{x:ox2+2,y:oy2+9,fill:'#334155','font-size':'9','font-family':'serif'}); tl.textContent=g.label; s.appendChild(tl);
    const color=g.color||'#2563eb';
    if(g.type==='curve'){
      const p=[];for(let k=0;k<=60;k++){const t=k/60;const y=g.fn(t);p.push(`${ox2+t*(ex2-ox2)},${ey2-y*(ey2-oy2)}`);}
      s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:color,'stroke-width':'1.8',fill:'none'}));
    } else if(g.type==='line'||g.type==='step'){
      const p=g.pts.map(([x,y])=>`${ox2+x*(ex2-ox2)},${ey2-y*(ey2-oy2)}`).join(' ');
      s.appendChild(svgEl('polyline',{points:p,stroke:color,'stroke-width':'1.8',fill:'none'}));
    }
  });
}

// ── MCQ 1 — Ball thrown up ──
function drawMCQ1() {
  const rs=getSVG('mcq1-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('rect',{x:W/2-20,y:H-10,width:40,height:8,fill:'#94a3b8'}));
    const th=svgEl('text',{x:W/2,y:H-1,'text-anchor':'middle',fill:'#94a3b8','font-size':'10','font-family':'sans-serif'}); th.textContent='hand'; s.appendChild(th);
    s.appendChild(svgEl('line',{x1:W/2-10,y1:H-18,x2:W/2-10,y2:20,stroke:'#2563eb','stroke-width':'1.5','stroke-dasharray':'4,3'}));
    s.appendChild(svgEl('line',{x1:W/2+10,y1:20,x2:W/2+10,y2:H-18,stroke:'#dc2626','stroke-width':'1.5','stroke-dasharray':'4,3'}));
    s.appendChild(svgEl('circle',{cx:W/2,cy:14,r:10,fill:'#f59e0b'}));
    const tup=svgEl('text',{x:W/2-30,y:H/2,fill:'#2563eb','font-size':'10','font-family':'sans-serif'}); tup.textContent='up'; s.appendChild(tup);
    const tdn=svgEl('text',{x:W/2+14,y:H/2,fill:'#dc2626','font-size':'10','font-family':'sans-serif'}); tdn.textContent='down'; s.appendChild(tdn);
  }

  const optA=[
    {label:'d',type:'line',pts:[[0,1],[0.5,0],[1,1]],color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.6],[1,0.6]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.3],[1,0.3]],color:'#2563eb'},
  ];
  const optB=[
    {label:'d',type:'curve',fn:t=>4*t*(1-t)*0.95,color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.9],[0.5,0.5],[1,0.05]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.3],[1,0.3]],color:'#2563eb'},
  ];
  const optC=[
    {label:'d',type:'curve',fn:t=>t*t,color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.05],[1,0.95]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
  ];
  const optD=[
    {label:'d',type:'line',pts:[[0,0],[1,1]],color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.3],[1,0.3]],color:'#2563eb'},
  ];
  drawMCQOption('mcq1-opt-a',optA);
  drawMCQOption('mcq1-opt-b',optB);
  drawMCQOption('mcq1-opt-c',optC);
  drawMCQOption('mcq1-opt-d',optD);
}


const MCQ_SCREEN = {1:'screen-7',2:'screen-9',3:'screen-11',4:'screen-13',5:'screen-15',6:'screen-17'};

function submitMCQ(n) {
  const correct={1:'B',2:'A',3:'C',4:'B',5:'D',6:'A'};
  const sel=window['_mcq'+n+'sel'];
  const fb=document.getElementById('mcq'+n+'-feedback');
  const nextBtn=document.getElementById('btn-mcq'+n+'-next');
  if(!sel){if(fb){fb.textContent='Please select an option.';fb.className='mcq-feedback';}return;}
  const isCorrect=sel===correct[n];
  document.querySelectorAll('#'+MCQ_SCREEN[n]+' .mcq-option').forEach(el=>{el.classList.remove('selected','correct','wrong');});
  const selEl=document.getElementById('mcq'+n+'-opt-'+sel.toLowerCase());
  const selBox=selEl&&selEl.closest('.mcq-option');
  if(selBox) selBox.classList.add(isCorrect?'correct':'wrong');
  if(fb){fb.textContent=isCorrect?'Correct! Well done.':'Not quite — try reading each graph carefully.';fb.className='mcq-feedback '+(isCorrect?'correct':'wrong');}
  if(nextBtn){nextBtn.disabled=false;nextBtn.removeAttribute('disabled');}
}

function selectMCQ(n,letter){
  document.querySelectorAll('#'+MCQ_SCREEN[n]+' .mcq-option').forEach(el=>{
    el.classList.remove('selected','correct','wrong');
  });
  const el=document.getElementById('mcq'+n+'-opt-'+letter.toLowerCase());
  if(el) el.closest('.mcq-option').classList.add('selected');
  window['_mcq'+n+'sel']=letter;
}

// ── MCQ 1 Answer ──
function drawAnswer1() {
  const rs=getSVG('ans1-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('rect',{x:W/2-20,y:H-10,width:40,height:8,fill:'#94a3b8'}));
    s.appendChild(svgEl('line',{x1:W/2,y1:H-18,x2:W/2,y2:20,stroke:'#2563eb','stroke-width':'1.5','stroke-dasharray':'4,3'}));
    [[W/2-8,H-25,'1'],[W/2,18,'2'],[W/2+8,H-25,'3']].forEach(([cx,cy,lbl])=>{
      s.appendChild(svgEl('circle',{cx,cy,r:9,fill:'#f59e0b'}));
      const t=svgEl('text',{x:cx,y:cy+3.5,fill:'#1a2535','font-size':'9','font-weight':'bold','font-family':'sans-serif','text-anchor':'middle'}); t.textContent=lbl; s.appendChild(t);
    });
    const tup=svgEl('text',{x:W/2-22,y:H/2,fill:'#64748b','font-size':'9','font-family':'sans-serif'}); tup.textContent='up'; s.appendChild(tup);
    const tdn=svgEl('text',{x:W/2+12,y:H/2,fill:'#64748b','font-size':'9','font-family':'sans-serif'}); tdn.textContent='down'; s.appendChild(tdn);
  }
  let r=getSVG('ans1-dt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');plotCurveSVG(s,t=>4*t*(1-t)*0.9,'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.05,0.17,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.9,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.95,0.17,'3',ox,oy,ex,ey);svgCaption(s,'d–t for option B',ox,ey);}
  r=getSVG('ans1-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0.9],[1,-0.05]],'#2563eb',ox,oy,ex,ey);svgDashLine(s,ox,ey,ex,ey,'#cbd5e1');drawStepDotSVG(s,0.05,0.88,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.4,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.94,0.02,'3',ox,oy,ex,ey);svgCaption(s,'v–t for option B',ox,ey);}
  r=getSVG('ans1-at');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','a');plotLineSVG(s,[[0,0.3],[1,0.3]],'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.05,0.3,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.3,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.94,0.3,'3',ox,oy,ex,ey);svgCaption(s,'a–t for option B',ox,ey);}
}

// ── MCQ 2 ──
function drawMCQ2() {
  const rs=getSVG('mcq2-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('polyline',{points:`20,${H-20} ${W-20},${H-20} 20,20 20,${H-20}`,stroke:'#475569','stroke-width':'2',fill:'none'}));
    const tf=svgEl('text',{x:W/2-30,y:H-8,fill:'#64748b','font-size':'10','font-family':'sans-serif'}); tf.textContent='frictionless'; s.appendChild(tf);
    s.appendChild(svgEl('circle',{cx:28,cy:28,r:10,fill:'#f59e0b'}));
    s.appendChild(svgEl('line',{x1:40,y1:40,x2:80,y2:80,stroke:'#2563eb','stroke-width':'2'}));
    s.appendChild(svgEl('polygon',{points:'80,80 70,85 75,70',fill:'#2563eb'}));
  }

  drawMCQOption('mcq2-opt-a',[
    {label:'d',type:'curve',fn:t=>t*t,color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.02],[1,0.95]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq2-opt-b',[
    {label:'d',type:'curve',fn:t=>t*t,color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.1],[1,0.1]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq2-opt-c',[
    {label:'d',type:'curve',fn:t=>Math.sqrt(t)*0.9,color:'#2563eb'},
    {label:'v',type:'curve',fn:t=>0.9-0.9*t*t*0.5,color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.8],[1,0.05]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq2-opt-d',[
    {label:'d',type:'curve',fn:t=>4*t*(1-t)*0.9,color:'#2563eb'},
    {label:'v',type:'curve',fn:t=>4*t*(1-t),color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.1]],color:'#2563eb'},
  ]);
}

function drawAnswer2() {
  const rs=getSVG('ans2-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('polyline',{points:`20,${H-20} ${W-20},${H-20} 20,20 20,${H-20}`,stroke:'#475569','stroke-width':'2',fill:'none'}));
    const tf=svgEl('text',{x:W/2-30,y:H-8,fill:'#64748b','font-size':'10','font-family':'sans-serif'}); tf.textContent='frictionless'; s.appendChild(tf);
    [[28,28,'1'],[W/2-10,H/2-10,'2'],[W-22,H-22,'3']].forEach(([cx,cy,lbl])=>{
      s.appendChild(svgEl('circle',{cx,cy,r:9,fill:'#f59e0b'}));
      const t=svgEl('text',{x:cx,y:cy+3.5,fill:'#1a2535','font-size':'9','font-weight':'bold','font-family':'sans-serif','text-anchor':'middle'}); t.textContent=lbl; s.appendChild(t);
    });
  }
  let r=getSVG('ans2-dt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');plotCurveSVG(s,t=>t*t,'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.05,0.005,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.25,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.95,0.9,'3',ox,oy,ex,ey);svgCaption(s,'d–t for option A',ox,ey);}
  r=getSVG('ans2-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0.02],[1,0.95]],'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.05,0.07,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.48,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.95,0.93,'3',ox,oy,ex,ey);svgCaption(s,'v–t for option A',ox,ey);}
  r=getSVG('ans2-at');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','a');plotLineSVG(s,[[0,0.5],[1,0.5]],'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.05,0.5,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.5,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.95,0.5,'3',ox,oy,ex,ey);svgCaption(s,'a–t for option A',ox,ey);}
}

// ── MCQ 3 ──
function drawMCQ3() {
  const rs=getSVG('mcq3-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    [{x:20,lbl:'accelerate'},{x:W/2-25,lbl:'cruise'},{x:W-80,lbl:'brake'}].forEach(c=>{
      s.appendChild(svgEl('rect',{x:c.x,y:H/2-15,width:55,height:25,fill:'#e2e8f0',stroke:'#475569','stroke-width':'1.5'}));
      [c.x+10,c.x+42].forEach(wx=>{s.appendChild(svgEl('circle',{cx:wx,cy:H/2+12,r:7,fill:'#475569'}));});
      const t=svgEl('text',{x:c.x+27,y:H/2+30,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'sans-serif'}); t.textContent=c.lbl; s.appendChild(t);
    });
  }
  drawMCQOption('mcq3-opt-a',[
    {label:'d',type:'line',pts:[[0,0.02],[1,0.95]],color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.1],[1,0.1]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq3-opt-b',[
    {label:'d',type:'curve',fn:t=>t*t,color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.02],[1,0.95]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq3-opt-c',[
    {label:'d',type:'curve',fn:t=>{if(t<0.33)return 0.5*t*t/0.33;if(t<0.67)return 0.5*(t-0.33)/0.34*0.34+0.083;return 0.083+0.34+0.5*(t-0.67)*(t-0.67)/0.33;}},
    {label:'v',type:'line',pts:[[0,0],[0.33,0.6],[0.67,0.6],[1,0]],color:'#2563eb'},
    {label:'a',type:'step',pts:[[0,0.7],[0.33,0.7],[0.33,0.5],[0.67,0.5],[0.67,0.25],[1,0.25]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq3-opt-d',[
    {label:'d',type:'curve',fn:t=>4*t*(1-t)*0.9,color:'#2563eb'},
    {label:'v',type:'curve',fn:t=>4*t*(1-t),color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
  ]);
}

function drawAnswer3() {
  const rs=getSVG('ans3-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    const cx=[30,W/2-20,W-80];
    const lbls=['accelerate','cruise','brake'];
    cx.forEach((x,i)=>{
      s.appendChild(svgEl('rect',{x,y:H/2-18,width:50,height:22,fill:'#e2e8f0',stroke:'#475569','stroke-width':'1.5'}));
      [x+8,x+38].forEach(wx=>{s.appendChild(svgEl('circle',{cx:wx,cy:H/2+6,r:6,fill:'#475569'}));});
      s.appendChild(svgEl('circle',{cx:x+25,cy:H/2-28,r:9,fill:'#f59e0b'}));
      const tn=svgEl('text',{x:x+25,y:H/2-24.5,'text-anchor':'middle',fill:'#1a2535','font-size':'9','font-weight':'bold','font-family':'sans-serif'}); tn.textContent=i+1; s.appendChild(tn);
      const tl=svgEl('text',{x:x+25,y:H/2+22,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'sans-serif'}); tl.textContent=lbls[i]; s.appendChild(tl);
    });
  }
  let r=getSVG('ans3-dt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');plotCurveSVG(s,t=>{if(t<0.33)return 0.5*t*t/(0.33*0.33)*0.3;if(t<0.67)return 0.15+(t-0.33)/0.34*0.5;return 0.65+(t-0.67)/0.33*0.3;},'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.17,0.06,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.4,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.83,0.8,'3',ox,oy,ex,ey);svgCaption(s,'d–t for option C',ox,ey);}
  r=getSVG('ans3-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0],[0.33,0.7],[0.67,0.7],[1,0]],'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.17,0.35,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.7,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.83,0.35,'3',ox,oy,ex,ey);svgCaption(s,'v–t for option C',ox,ey);}
  r=getSVG('ans3-at');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','a');plotLineSVG(s,[[0,0.75],[0.33,0.75],[0.33,0.5],[0.67,0.5],[0.67,0.25],[1,0.25]],'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.17,0.75,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.5,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.83,0.25,'3',ox,oy,ex,ey);svgCaption(s,'a–t for option C',ox,ey);}
}

// ── MCQ 4 — Bouncing ball ──
function drawMCQ4() {
  const rs=getSVG('mcq4-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('line',{x1:10,y1:H-15,x2:W-10,y2:H-15,stroke:'#94a3b8','stroke-width':'1.5'}));
    const heights=[H-70,H-45,H-30],xs=[W*0.2,W*0.5,W*0.78];
    heights.forEach((hy,i)=>{
      s.appendChild(svgEl('circle',{cx:xs[i],cy:hy,r:9,fill:'#f59e0b'}));
      s.appendChild(svgEl('line',{x1:xs[i],y1:hy+9,x2:xs[i],y2:H-15,stroke:'#dc2626','stroke-width':'1','stroke-dasharray':'3,3'}));
    });
    const tc=svgEl('text',{x:W/2,y:H-2,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'sans-serif'}); tc.textContent='decreasing peaks'; s.appendChild(tc);
  }

  // Option A: straight line d-t drop, flat v-t
  drawMCQ4Option('mcq4-opt-a',[
    {label:'d',type:'line',pts:[[0,0.9],[1,0.05]]},
    {label:'v',type:'line',pts:[[0,0.3],[1,0.3]]},
  ]);
  // Option B: correct — decreasing humps, sawtooth v
  drawMCQ4Option('mcq4-opt-b',[
    {label:'d',type:'bounce'},
    {label:'v',type:'sawtooth'},
  ]);
  // Option C: equal humps d-t, flat v
  drawMCQ4Option('mcq4-opt-c',[
    {label:'d',type:'equalhumps'},
    {label:'v',type:'line',pts:[[0,0.5],[1,0.5]]},
  ]);
  // Option D: parabola d-t, linear v
  drawMCQ4Option('mcq4-opt-d',[
    {label:'d',type:'curve',fn:t=>t*t},
    {label:'v',type:'line',pts:[[0,0.05],[1,0.95]]},
  ]);
}

function drawMCQ4Option(svgId, graphFns) {
  const r=getSVG(svgId);
  if(!r) return;
  const{s,W,H}=r; clearSVG(s);
  const rows=graphFns.length;
  const rh=Math.floor(H/rows);
  graphFns.forEach((g,i)=>{
    const oy2=i*rh+4,ey2=(i+1)*rh-8,ox2=20,ex2=W-8;
    s.appendChild(svgEl('polyline',{points:`${ox2},${oy2} ${ox2},${ey2} ${ex2},${ey2}`,stroke:'#1e293b','stroke-width':'1',fill:'none'}));
    const tl=svgEl('text',{x:ox2+2,y:oy2+9,fill:'#334155','font-size':'9','font-family':'serif'}); tl.textContent=g.label; s.appendChild(tl);
    if(g.type==='curve'){
      const p=[];for(let k=0;k<=60;k++){const t=k/60;const y=g.fn(t);p.push(`${ox2+t*(ex2-ox2)},${ey2-y*(ey2-oy2)}`);}
      s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:'#2563eb','stroke-width':'1.8',fill:'none'}));
    } else if(g.type==='line'){
      const p=g.pts.map(([x,y])=>`${ox2+x*(ex2-ox2)},${ey2-y*(ey2-oy2)}`).join(' ');
      s.appendChild(svgEl('polyline',{points:p,stroke:'#2563eb','stroke-width':'1.8',fill:'none'}));
    } else if(g.type==='bounce'){
      const peaks=[0.9,0.6,0.38,0.22,0.1],times=[0,0.3,0.52,0.68,0.8,0.88,1];
      const p=[];
      for(let b=0;b<4;b++){
        const t0=times[b],t1=times[b+1],peak=peaks[b];
        for(let k=0;k<=20;k++){const tt=t0+(t1-t0)*k/20;const local=(tt-t0)/(t1-t0);const y=peak*4*local*(1-local);p.push(`${ox2+tt*(ex2-ox2)},${ey2-y*(ey2-oy2)}`);}
      }
      s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:'#2563eb','stroke-width':'1.8',fill:'none'}));
    } else if(g.type==='sawtooth'){
      const midY=ey2-(ey2-oy2)*0.5;
      s.appendChild(svgEl('line',{x1:ox2,y1:midY,x2:ex2,y2:midY,stroke:'#cbd5e1','stroke-width':'0.7','stroke-dasharray':'2,2'}));
      const times=[0,0.3,0.52,0.68,0.8,0.88,1],vpeaks=[0.9,0.6,0.38,0.22,0.1];
      const p=[`${ox2},${midY}`];
      for(let b=0;b<4;b++){
        const t0=times[b],t1=times[b+1],vp=vpeaks[b];
        p.push(`${ox2+t0*(ex2-ox2)},${midY+(vp*(ey2-oy2)*0.5)}`);
        p.push(`${ox2+t0*(ex2-ox2)},${midY-(vp*(ey2-oy2)*0.5)}`);
        p.push(`${ox2+t1*(ex2-ox2)},${midY+(vpeaks[b+1]?(vpeaks[b+1]*(ey2-oy2)*0.5):0)}`);
      }
      s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:'#2563eb','stroke-width':'1.8',fill:'none'}));
    } else if(g.type==='equalhumps'){
      const p=[];
      for(let b=0;b<4;b++){
        const t0=b*0.25,t1=(b+1)*0.25;
        for(let k=0;k<=20;k++){const tt=t0+(t1-t0)*k/20;const local=(tt-t0)/(t1-t0);const y=0.8*4*local*(1-local);p.push(`${ox2+tt*(ex2-ox2)},${ey2-y*(ey2-oy2)}`);}
      }
      s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:'#2563eb','stroke-width':'1.8',fill:'none'}));
    }
  });
}

function selectMCQ4(letter) {
  document.querySelectorAll('#screen-13 .mcq4-option').forEach(el=>{el.classList.remove('selected','correct','wrong');});
  const el=document.getElementById('mcq4-opt-'+letter.toLowerCase());
  const box=el&&el.closest('.mcq4-option');
  if(box) box.classList.add('selected');
  window._mcq4sel=letter;
}

function submitMCQ4() {
  const sel=window._mcq4sel;
  const fb=document.getElementById('mcq4-feedback');
  const nextBtn=document.getElementById('btn-mcq4-next');
  if(!sel){if(fb){fb.textContent='Please select an option.';fb.className='mcq-feedback';}return;}
  const isCorrect=sel==='B';
  document.querySelectorAll('#screen-13 .mcq4-option').forEach(el=>{el.classList.remove('selected','correct','wrong');});
  const selEl=document.getElementById('mcq4-opt-'+sel.toLowerCase());
  const selBox=selEl&&selEl.closest('.mcq4-option');
  if(selBox) selBox.classList.add(isCorrect?'correct':'wrong');
  if(fb){fb.textContent=isCorrect?'Correct! Well done.':'Not quite — try reading each graph carefully.';fb.className='mcq-feedback '+(isCorrect?'correct':'wrong');}
  if(nextBtn){nextBtn.disabled=false;nextBtn.removeAttribute('disabled');}
}

function drawAnswer4() {
  const rs=getSVG('ans4-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('line',{x1:10,y1:H-15,x2:W-10,y2:H-15,stroke:'#94a3b8','stroke-width':'1.5'}));
    const heights=[H-75,H-50,H-30],xs=[W*0.2,W*0.5,W*0.78];
    heights.forEach((hy,i)=>{
      s.appendChild(svgEl('circle',{cx:xs[i],cy:hy,r:9,fill:'#f59e0b'}));
      const tn=svgEl('text',{x:xs[i],y:hy+3.5,'text-anchor':'middle',fill:'#1a2535','font-size':'9','font-weight':'bold','font-family':'sans-serif'}); tn.textContent=i+1; s.appendChild(tn);
      s.appendChild(svgEl('line',{x1:xs[i],y1:hy+9,x2:xs[i],y2:H-15,stroke:'#dc2626','stroke-width':'1','stroke-dasharray':'3,3'}));
    });
    const tc=svgEl('text',{x:W/2,y:H-2,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'sans-serif'}); tc.textContent='decreasing peaks'; s.appendChild(tc);
  }
  let r=getSVG('ans4-dt');
  if(r){
    const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');
    const times=[0,0.3,0.52,0.68,0.8,1],peaks=[0.9,0.6,0.38,0.2];
    const p=[];
    for(let b=0;b<4;b++){const t0=times[b],t1=times[b+1],pk=peaks[b];for(let k=0;k<=20;k++){const tt=t0+(t1-t0)*k/20;const local=(tt-t0)/(t1-t0);const y=pk*4*local*(1-local);p.push(`${ox+tt*(ex-ox)},${ey-y*(ey-oy)}`);}}
    s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:'#2563eb','stroke-width':'2',fill:'none'}));
    drawStepDotSVG(s,0.15,0.7,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.41,0.55,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.6,0.32,'3',ox,oy,ex,ey);svgCaption(s,'d–t for option B',ox,ey);
  }
  r=getSVG('ans4-vt');
  if(r){
    const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');
    const midY=ey-(ey-oy)*0.5;
    svgDashLine(s,ox,midY,ex,midY,'#cbd5e1');
    const times=[0,0.3,0.52,0.68,0.8,1],vpeaks=[0.9,0.6,0.38,0.2];
    const p=[`${ox},${midY-(vpeaks[0]*(ey-oy)*0.45)}`];
    for(let b=0;b<4;b++){const t1=times[b+1],vp=vpeaks[b];p.push(`${ox+t1*(ex-ox)},${midY+(vp*(ey-oy)*0.42)}`);if(b<3){p.push(`${ox+t1*(ex-ox)},${midY-(vpeaks[b+1]*(ey-oy)*0.42)}`);}}
    s.appendChild(svgEl('polyline',{points:p.join(' '),stroke:'#2563eb','stroke-width':'2',fill:'none'}));
    drawStepDotSVG(s,0.15,0.72,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.41,0.48,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.6,0.56,'3',ox,oy,ex,ey);svgCaption(s,'v–t for option B',ox,ey);
  }
}

// ── MCQ 5 — Pendulum ──
function drawMCQ5() {
  const rs=getSVG('mcq5-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('circle',{cx:W/2,cy:10,r:5,fill:'#1e293b'}));
    s.appendChild(svgEl('line',{x1:W/2,y1:15,x2:W/2,y2:H*0.55,stroke:'#94a3b8','stroke-width':'1','stroke-dasharray':'3,3'}));
    s.appendChild(svgEl('circle',{cx:W/2,cy:H*0.6,r:10,fill:'#f59e0b'}));
    s.appendChild(svgEl('circle',{cx:20,cy:H*0.6,r:9,fill:'none',stroke:'#94a3b8','stroke-width':'1.5'}));
    s.appendChild(svgEl('circle',{cx:W-20,cy:H*0.6,r:9,fill:'none',stroke:'#94a3b8','stroke-width':'1.5'}));
    const rad=H*0.55,arcX=W/2,arcY=10;
    const x1=arcX+rad*Math.cos(Math.PI*0.6),y1=arcY+rad*Math.sin(Math.PI*0.6);
    const x2=arcX+rad*Math.cos(Math.PI*0.4),y2=arcY+rad*Math.sin(Math.PI*0.4);
    s.appendChild(svgEl('path',{d:`M ${x1.toFixed(1)},${y1.toFixed(1)} A ${rad},${rad} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)}`,stroke:'#cbd5e1','stroke-width':'1',fill:'none'}));
  }

  drawMCQOption('mcq5-opt-a',[
    {label:'d',type:'curve',fn:t=>0.5+0.5*Math.abs(Math.cos(Math.PI*t*2)),color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq5-opt-b',[
    {label:'d',type:'curve',fn:t=>0.5+0.5*Math.cos(Math.PI*t*2),color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.9],[1,0.05]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.1],[1,0.1]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq5-opt-c',[
    {label:'d',type:'curve',fn:t=>0.5+0.45*Math.sin(Math.PI*t*2+Math.PI/2),color:'#2563eb'},
    {label:'v',type:'curve',fn:t=>0.5+0.45*Math.sin(Math.PI*t*2),color:'#2563eb'},
    {label:'a',type:'curve',fn:t=>0.5+0.45*Math.sin(Math.PI*t*2-Math.PI/2),color:'#2563eb'},
  ]);
  drawMCQOption('mcq5-opt-d',[
    {label:'d',type:'curve',fn:t=>0.5+0.45*Math.cos(Math.PI*t*2),color:'#2563eb'},
    {label:'v',type:'curve',fn:t=>0.5-0.45*Math.sin(Math.PI*t*2),color:'#2563eb'},
    {label:'a',type:'curve',fn:t=>0.5-0.45*Math.cos(Math.PI*t*2),color:'#2563eb'},
  ]);
}

function drawAnswer5() {
  const rs=getSVG('ans5-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('circle',{cx:W/2,cy:10,r:5,fill:'#1e293b'}));
    s.appendChild(svgEl('line',{x1:W/2,y1:15,x2:W/2,y2:H*0.55,stroke:'#94a3b8','stroke-width':'1','stroke-dasharray':'3,3'}));
    [[20,H*0.6,'1'],[W/2,H*0.6,'3'],[W-20,H*0.6,'2']].forEach(([cx,cy,lbl],i)=>{
      if(i===1){s.appendChild(svgEl('circle',{cx,cy,r:9,fill:'#f59e0b'}));}
      else{s.appendChild(svgEl('circle',{cx,cy,r:9,fill:'none',stroke:'#94a3b8','stroke-width':'1.5'}));}
      const t=svgEl('text',{x:cx,y:cy+3.5,'text-anchor':'middle',fill:'#1a2535','font-size':'9','font-weight':'bold','font-family':'sans-serif'}); t.textContent=lbl; s.appendChild(t);
    });
  }
  let r=getSVG('ans5-dt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');const midY=ey-(ey-oy)*0.5;svgDashLine(s,ox,midY,ex,midY,'#cbd5e1');plotCurveSVG(s,t=>0.5+0.45*Math.cos(Math.PI*t*2),'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.03,0.95,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.05,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.97,0.95,'3',ox,oy,ex,ey);svgCaption(s,'d–t for option D',ox,ey);}
  r=getSVG('ans5-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');const midY=ey-(ey-oy)*0.5;svgDashLine(s,ox,midY,ex,midY,'#cbd5e1');plotCurveSVG(s,t=>0.5-0.45*Math.sin(Math.PI*t*2),'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.03,0.5,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.25,0.05,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.75,0.95,'3',ox,oy,ex,ey);svgCaption(s,'v–t for option D',ox,ey);}
  r=getSVG('ans5-at');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','a');const midY=ey-(ey-oy)*0.5;svgDashLine(s,ox,midY,ex,midY,'#cbd5e1');plotCurveSVG(s,t=>0.5-0.45*Math.cos(Math.PI*t*2),'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.03,0.05,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.95,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.97,0.05,'3',ox,oy,ex,ey);svgCaption(s,'a–t for option D',ox,ey);}
}

// ── MCQ 6 — Frictional incline ──
function drawMCQ6() {
  const rs=getSVG('mcq6-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('polyline',{points:`5,10 ${W/2-5},${H-20} ${W-5},10`,stroke:'#475569','stroke-width':'2',fill:'none'}));
    const tf=svgEl('text',{x:W/2,y:H-5,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'sans-serif'}); tf.textContent='friction on both'; s.appendChild(tf);
    s.appendChild(svgEl('circle',{cx:12,cy:14,r:9,fill:'#f59e0b'}));
    s.appendChild(svgEl('line',{x1:12,y1:14,x2:W/2-5,y2:H-20,stroke:'#94a3b8','stroke-width':'1','stroke-dasharray':'3,3'}));
  }

  drawMCQOption('mcq6-opt-a',[
    {label:'d',type:'curve',fn:t=>{if(t<0.5)return 2*t*t;return 1-2*(1-t)*(1-t);}},
    {label:'v',type:'line',pts:[[0,0],[0.5,0.8],[1,0]],color:'#2563eb'},
    {label:'a',type:'step',pts:[[0,0.75],[0.5,0.75],[0.5,0.3],[0.85,0.3],[0.85,0.5],[1,0.5]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq6-opt-b',[
    {label:'d',type:'curve',fn:t=>4*t*(1-t)*0.9},
    {label:'v',type:'line',pts:[[0,0.9],[1,0.05]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.2],[1,0.2]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq6-opt-c',[
    {label:'d',type:'curve',fn:t=>t*t},
    {label:'v',type:'line',pts:[[0,0.05],[1,0.95]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
  ]);
  drawMCQOption('mcq6-opt-d',[
    {label:'d',type:'line',pts:[[0,0.9],[0.5,0.1],[1,0.9]],color:'#2563eb'},
    {label:'v',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
    {label:'a',type:'line',pts:[[0,0.5],[1,0.5]],color:'#2563eb'},
  ]);
}

function drawAnswer6() {
  const rs=getSVG('ans6-scene-canvas');
  if(rs){
    const{s,W,H}=rs; clearSVG(s);
    s.appendChild(svgEl('polyline',{points:`5,10 ${W/2-5},${H-20} ${W-5},10`,stroke:'#475569','stroke-width':'2',fill:'none'}));
    const tf=svgEl('text',{x:W/2,y:H-5,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'sans-serif'}); tf.textContent='friction on both'; s.appendChild(tf);
    [[12,14,'1'],[W/2-5,H-20,'2'],[W-30,30,'3']].forEach(([cx,cy,lbl])=>{
      s.appendChild(svgEl('circle',{cx,cy,r:9,fill:'#f59e0b'}));
      const t=svgEl('text',{x:cx,y:Number(cy)+3.5,'text-anchor':'middle',fill:'#1a2535','font-size':'9','font-weight':'bold','font-family':'sans-serif'}); t.textContent=lbl; s.appendChild(t);
    });
  }
  let r=getSVG('ans6-dt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','d');plotCurveSVG(s,t=>{if(t<0.5)return 0.5*(t/0.5)*(t/0.5)*0.8;const u=(t-0.5)/0.5;return 0.8-0.8*u*u*0.5;},'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.05,0.02,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.8,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.9,0.78,'3',ox,oy,ex,ey);svgCaption(s,'d–t for option A',ox,ey);}
  r=getSVG('ans6-vt');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','v');plotLineSVG(s,[[0,0],[0.5,0.85],[0.75,0.02],[1,0.02]],'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.25,0.42,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.85,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.85,0.02,'3',ox,oy,ex,ey);svgCaption(s,'v–t for option A',ox,ey);}
  r=getSVG('ans6-at');
  if(r){const{s,W,H}=r;const{ox,oy,ex,ey}=drawAxesSVG(s,W,H,'t','a');plotLineSVG(s,[[0,0.7],[0.5,0.7],[0.5,0.3],[0.75,0.3],[0.75,0.5],[1,0.5]],'#2563eb',ox,oy,ex,ey);drawStepDotSVG(s,0.25,0.7,'1',ox,oy,ex,ey);drawStepDotSVG(s,0.5,0.5,'2',ox,oy,ex,ey);drawStepDotSVG(s,0.85,0.5,'3',ox,oy,ex,ey);svgCaption(s,'a–t for option A',ox,ey);}
}

// ── Sandbox (Screen 19) ──
let sbPoints = [];
let sbDrawMode = true;
const SB_W = 900, SB_H = 280;
const SB_OX = 52, SB_OY = 15, SB_EX = 890, SB_EY = 255;
const SB_T_MAX = 10, SB_A_MIN = -3, SB_A_MAX = 3;

function sbTtoX(t) { return SB_OX + t / SB_T_MAX * (SB_EX - SB_OX); }
function sbAtoY(a) { return SB_EY - (a - SB_A_MIN) / (SB_A_MAX - SB_A_MIN) * (SB_EY - SB_OY); }
function sbXtoT(x) { return (x - SB_OX) / (SB_EX - SB_OX) * SB_T_MAX; }
function sbYtoA(y) { return SB_A_MIN + (SB_EY - y) / (SB_EY - SB_OY) * (SB_A_MAX - SB_A_MIN); }

function initSandbox() {
  sbPoints = [];
  sbDrawMode = true;
  sbUpdateDrawBtn();
  sbDrawAll();
}

function sbToggleDraw() {
  sbDrawMode = !sbDrawMode;
  sbUpdateDrawBtn();
  const svg = document.getElementById('sb-at-svg');
  if (svg) svg.style.cursor = sbDrawMode ? 'crosshair' : 'default';
}

function sbUpdateDrawBtn() {
  const btn = document.getElementById('sb-btn-draw');
  if (!btn) return;
  btn.classList.toggle('sb-btn-active', sbDrawMode);
}

function sbUndo() { sbPoints.pop(); sbDrawAll(); }
function sbClear() { sbPoints = []; sbDrawAll(); }

function sbHandleClick(evt) {
  if (!sbDrawMode) return;
  const svg = document.getElementById('sb-at-svg');
  const rect = svg.getBoundingClientRect();
  const svgX = (evt.clientX - rect.left) * (SB_W / rect.width);
  const svgY = (evt.clientY - rect.top) * (SB_H / rect.height);
  const t = Math.round(Math.max(0, Math.min(SB_T_MAX, sbXtoT(svgX))));
  const a = Math.round(Math.max(SB_A_MIN, Math.min(SB_A_MAX, sbYtoA(svgY))));
  sbPoints.push({t, a});
  sbDrawAll();
}

function sbHandleHover(evt) {
  if (!sbDrawMode) return;
  const svg = document.getElementById('sb-at-svg');
  const rect = svg.getBoundingClientRect();
  const svgX = (evt.clientX - rect.left) * (SB_W / rect.width);
  const svgY = (evt.clientY - rect.top) * (SB_H / rect.height);
  const t = Math.round(Math.max(0, Math.min(SB_T_MAX, sbXtoT(svgX))));
  const a = Math.round(Math.max(SB_A_MIN, Math.min(SB_A_MAX, sbYtoA(svgY))));
  const hd = document.getElementById('sb-hover-dot');
  if (hd) { hd.setAttribute('cx', sbTtoX(t)); hd.setAttribute('cy', sbAtoY(a)); hd.setAttribute('visibility', 'visible'); }
}

function sbHandleMouseLeave() {
  const hd = document.getElementById('sb-hover-dot');
  if (hd) hd.setAttribute('visibility', 'hidden');
}

function sbGetSorted() {
  const map = new Map();
  sbPoints.forEach(p => map.set(p.t, p.a));
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([t, a]) => ({t, a}));
}

function sbGetA(t, sorted) {
  if (sorted.length < 2) return 0;
  if (t <= sorted[0].t) return sorted[0].a;
  if (t >= sorted[sorted.length - 1].t) return sorted[sorted.length - 1].a;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (t >= sorted[i].t && t <= sorted[i + 1].t) {
      const frac = (t - sorted[i].t) / (sorted[i + 1].t - sorted[i].t);
      return sorted[i].a + frac * (sorted[i + 1].a - sorted[i].a);
    }
  }
  return 0;
}

function sbComputeVT() {
  const N = 200, dt = SB_T_MAX / N;
  const v = [0];
  const sorted = sbGetSorted();
  for (let i = 0; i < N; i++) {
    const a0 = sbGetA(i * dt, sorted);
    const a1 = sbGetA((i + 1) * dt, sorted);
    v.push(v[i] + (a0 + a1) / 2 * dt);
  }
  return v;
}

function sbComputeDT(v) {
  const N = v.length - 1, dt = SB_T_MAX / N;
  const d = [0];
  for (let i = 0; i < N; i++) d.push(d[i] + (v[i] + v[i + 1]) / 2 * dt);
  return d;
}

function sbDrawATGraph() {
  const svg = document.getElementById('sb-at-svg');
  if (!svg) return;
  clearSVG(svg);
  svg.setAttribute('viewBox', `0 0 ${SB_W} ${SB_H}`);
  const ox = SB_OX, oy = SB_OY, ex = SB_EX, ey = SB_EY;

  svg.appendChild(svgEl('rect', {x:0,y:0,width:SB_W,height:SB_H,fill:'#f8fafc',rx:'4'}));

  for (let t = 0; t <= SB_T_MAX; t++) {
    svg.appendChild(svgEl('line', {x1:sbTtoX(t),y1:oy,x2:sbTtoX(t),y2:ey,stroke:'#e2e8f0','stroke-width':'1'}));
  }
  for (let a = SB_A_MIN; a <= SB_A_MAX; a++) {
    const y = sbAtoY(a);
    svg.appendChild(svgEl('line', {x1:ox,y1:y,x2:ex,y2:y,stroke:a===0?'#94a3b8':'#e2e8f0','stroke-width':a===0?'1.2':'1'}));
  }

  const z = sbAtoY(0);
  svg.appendChild(svgEl('line', {x1:ox,y1:oy-5,x2:ox,y2:ey+2,stroke:'#1e293b','stroke-width':'1.5'}));
  svg.appendChild(svgEl('line', {x1:ox-2,y1:z,x2:ex+5,y2:z,stroke:'#1e293b','stroke-width':'1.5'}));
  svg.appendChild(svgEl('polyline', {points:`${ox-4},${oy+8} ${ox},${oy-2} ${ox+4},${oy+8}`,stroke:'#1e293b','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(svgEl('polyline', {points:`${ex-5},${z-4} ${ex+3},${z} ${ex-5},${z+4}`,stroke:'#1e293b','stroke-width':'1.5',fill:'none'}));

  const la = svgEl('text', {x:ox+4,y:oy+11,fill:'#1e293b','font-size':'12','font-style':'italic','font-family':'serif'}); la.textContent='a'; svg.appendChild(la);
  const lt = svgEl('text', {x:ex-4,y:z-5,fill:'#1e293b','font-size':'10','font-style':'italic','font-family':'serif'}); lt.textContent='t (s)'; svg.appendChild(lt);

  for (let t = 0; t <= SB_T_MAX; t += 2) {
    const lbl = svgEl('text', {x:sbTtoX(t),y:ey+15,fill:'#64748b','font-size':'9','font-family':'sans-serif','text-anchor':'middle'}); lbl.textContent=String(t); svg.appendChild(lbl);
  }
  for (let a = SB_A_MIN; a <= SB_A_MAX; a++) {
    if (a === 0) continue;
    const lbl = svgEl('text', {x:ox-5,y:sbAtoY(a)+4,fill:'#64748b','font-size':'9','font-family':'sans-serif','text-anchor':'end'}); lbl.textContent=String(a); svg.appendChild(lbl);
  }

  for (let t = 0; t <= SB_T_MAX; t++) {
    for (let a = SB_A_MIN; a <= SB_A_MAX; a++) {
      svg.appendChild(svgEl('circle', {cx:sbTtoX(t),cy:sbAtoY(a),r:'2',fill:'#cbd5e1','pointer-events':'none'}));
    }
  }

  const sorted = sbGetSorted();
  if (sorted.length >= 2) {
    const pts = sorted.map(p => `${sbTtoX(p.t)},${sbAtoY(p.a)}`).join(' ');
    svg.appendChild(svgEl('polyline', {points:pts,stroke:'#2563eb','stroke-width':'2.5',fill:'none','stroke-linejoin':'round'}));
  }
  sorted.forEach(p => {
    svg.appendChild(svgEl('circle', {cx:sbTtoX(p.t),cy:sbAtoY(p.a),r:'5',fill:'#2563eb',stroke:'#fff','stroke-width':'2','pointer-events':'none'}));
  });

  svg.appendChild(svgEl('circle', {id:'sb-hover-dot',cx:'0',cy:'0',r:'7',fill:'none',stroke:'#f59e0b','stroke-width':'2',visibility:'hidden','pointer-events':'none'}));
}

function sbDrawDerivedGraph(svgId, vals, labelY) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  clearSVG(svg);
  const W = parseFloat(svg.getAttribute('width')), H = parseFloat(svg.getAttribute('height'));
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.appendChild(svgEl('rect', {x:0,y:0,width:W,height:H,fill:'#f8fafc',rx:'4'}));
  const ox=50, oy=12, ex=W-15, ey=H-22;

  const vMax = Math.max(0, ...vals), vMin = Math.min(0, ...vals);
  const vSpan = vMax - vMin;
  const yMax = vSpan < 0.01 ? 1 : vMax + vSpan * 0.12;
  const yMin = vSpan < 0.01 ? -1 : vMin - vSpan * 0.12;
  const yRange = yMax - yMin;
  const toY = v => ey - (v - yMin) / yRange * (ey - oy);
  const toX = t => ox + t / SB_T_MAX * (ex - ox);
  const zeroY = toY(0);

  svg.appendChild(svgEl('line', {x1:ox,y1:zeroY,x2:ex,y2:zeroY,stroke:'#e2e8f0','stroke-width':'1'}));
  svg.appendChild(svgEl('line', {x1:ox,y1:oy-4,x2:ox,y2:ey+2,stroke:'#1e293b','stroke-width':'1.5'}));
  svg.appendChild(svgEl('line', {x1:ox-2,y1:zeroY,x2:ex+5,y2:zeroY,stroke:'#1e293b','stroke-width':'1.5'}));
  svg.appendChild(svgEl('polyline', {points:`${ox-3},${oy+6} ${ox},${oy-2} ${ox+3},${oy+6}`,stroke:'#1e293b','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(svgEl('polyline', {points:`${ex-4},${zeroY-3} ${ex+3},${zeroY} ${ex-4},${zeroY+3}`,stroke:'#1e293b','stroke-width':'1.5',fill:'none'}));

  const la = svgEl('text', {x:ox+4,y:oy+10,fill:'#1e293b','font-size':'11','font-style':'italic','font-family':'serif'}); la.textContent=labelY; svg.appendChild(la);
  const ltt = svgEl('text', {x:ex-4,y:zeroY-5,fill:'#1e293b','font-size':'9','font-style':'italic','font-family':'serif'}); ltt.textContent='t (s)'; svg.appendChild(ltt);

  for (let t = 0; t <= SB_T_MAX; t += 2) {
    const lbl = svgEl('text', {x:toX(t),y:ey+14,fill:'#64748b','font-size':'9','font-family':'sans-serif','text-anchor':'middle'}); lbl.textContent=String(t); svg.appendChild(lbl);
  }

  const N = vals.length - 1;
  const pts = vals.map((v, i) => `${toX(i / N * SB_T_MAX)},${toY(v)}`).join(' ');
  svg.appendChild(svgEl('polyline', {points:pts,stroke:'#2563eb','stroke-width':'2',fill:'none'}));
}

function sbDrawAll() {
  sbDrawATGraph();
  const empty = new Array(201).fill(0);
  if (sbGetSorted().length < 2) {
    sbDrawDerivedGraph('sb-vt-svg', empty, 'v');
    sbDrawDerivedGraph('sb-dt-svg', empty, 'd');
    return;
  }
  const v = sbComputeVT();
  sbDrawDerivedGraph('sb-vt-svg', v, 'v');
  sbDrawDerivedGraph('sb-dt-svg', sbComputeDT(v), 'd');
}

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => {
  goToScreen('screen-intro');
});
