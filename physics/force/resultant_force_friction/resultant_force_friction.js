/* ─── NAVIGATION ─── */
const NEXT_SCREEN = {
  'screen-intro': 'screen-1',
  'screen-1': 'screen-2',
  'screen-2': 'screen-3',
  'screen-3': 'screen-4',
  'screen-4': 'screen-5',
  'screen-5': 'screen-6',
  'screen-6': 'screen-7',
  'screen-7': 'screen-8',
  'screen-8': 'screen-9',
  'screen-9': 'screen-10',
  'screen-10': 'screen-11',
  'screen-11': 'screen-12',
  'screen-12': 'screen-13',
  'screen-13': 'screen-14',
  'screen-14': 'screen-15',
  'screen-15': 'screen-16',
  'screen-16': 'screen-17',
  'screen-17': 'screen-18',
  'screen-18': 'screen-19',
  'screen-19': 'screen-20',
  'screen-20': 'screen-21',
};
const PREV_SCREEN = Object.fromEntries(Object.entries(NEXT_SCREEN).map(([a, b]) => [b, a]));

function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  narrStop();
  initScreen(id);
  narrPlay();
}
function nextScreen() {
  const cur = document.querySelector('.screen.active');
  if (cur && NEXT_SCREEN[cur.id]) goToScreen(NEXT_SCREEN[cur.id]);
}
function prevScreen() {
  const cur = document.querySelector('.screen.active');
  if (cur && PREV_SCREEN[cur.id]) goToScreen(PREV_SCREEN[cur.id]);
}

function initScreen(id) {
  switch (id) {
    case 'screen-2':  initAngleScreen(); break;
    case 'screen-3':  init3DScreen(); break;
    case 'screen-4':  initTugScreen(); break;
    case 'screen-5':  initMCQ('mcq1'); break;
    case 'screen-6':  initGuidedPractice1(); break;
    case 'screen-7':  clearS6Timers(); showS6Groups([]); break;
    case 'screen-8':  initMCQ('mcq2'); break;
    case 'screen-9':  initGuidedPractice2(); break;
    case 'screen-10': clearS8Timers(); showS8Groups([]); break;
    case 'screen-11': initMCQ('mcq3'); break;
    case 'screen-12': initGuidedPractice3(); break;
    case 'screen-13': clearS10Timers(); showS10Groups([]); break;
    case 'screen-14': initFriction14Anim(); break;
    case 'screen-15': initFrictionLab(); break;
    case 'screen-16': initMCQ('mcq4'); break;
    case 'screen-18': initMCQ('mcq5'); break;
    case 'screen-20': initMCQ('mcq6'); break;
  }
}

/* ─── NARRATION ENGINE ─── */
const narrState = { step: -1, playing: false, utt: null, timer: null };

const NARR = {
  'screen-intro': [
    { text: 'Welcome to this lesson on Resultant Force and Friction. You will explore how forces combine and what happens when surfaces push back.', hl: '.intro-title', dur: 11000 },
    { text: 'We will go through interactive simulations, worked examples, and practice questions to build your understanding step by step.', hl: '.intro-subtitle', dur: 9000 },
  ],
  'screen-1': [
    { text: 'The resultant force is the single force that has the same effect as all real forces combined. The block only feels this net force.', hl: '#case-equal', dur: 11000 },
    { text: 'When two equal and opposite forces act, the net force is zero — the block stays at rest.', hl: '#case-equal', dur: 8000 },
    { text: 'When forces are unequal and opposite, subtract the smaller. Here, 15 minus 10 gives a net 5 Newtons — the block accelerates in that direction.', hl: '#case-unequal', dur: 12000, onStart: () => animateBlock('unequal') },
    { text: 'When forces are in the same direction, add them. Here, 4 plus 3 gives 7 Newtons net — the block accelerates in that direction.', hl: '#case-same', dur: 10000, onStart: () => animateBlock('same') },
    { text: "Newton's Second Law uses the resultant, not any single force. F net equals m times a.", hl: '#case-same', dur: 7500 },
  ],
  'screen-2': [
    { text: 'When a force is applied at an angle, only its horizontal component actually slides the block. Click an angle to see how much of the 20 Newton force acts horizontally.', hl: '.angle-pills', dur: 13000 },
    { text: 'The solid blue arrow shows the full force F. The dashed green arrow shows F cosine theta — the horizontal component. Both values appear on the diagram alongside the arrows.', hl: '#s2-diagram', dur: 13000 },
    { text: 'F cosine theta is the slice of force along the ground. That is what pushes the block.', hl: '#card-fcos', dur: 8000 },
    { text: 'F sine theta lifts the block vertically. It does not contribute to sliding — it reduces the normal force.', hl: '#card-fsin', dur: 9000 },
    { text: 'Look at the table. At zero degrees, all 20 Newtons pull horizontally. At 90 degrees, cosine is zero — no horizontal pull at all.', hl: '#s2-table', dur: 11000 },
    { text: 'Now try it yourself — click each angle button and watch F cosine theta and F sine theta update on the diagram and in the cards. Notice how the horizontal pull shrinks to zero as theta reaches 90 degrees.', hl: '.angle-pills', dur: 14000 },
  ],
  'screen-3': [
    { text: 'In three dimensions, a force F can be split into three components — one along each axis. Each component uses the same formula: F times the cosine of the angle between F and that axis. Use the Rotate Left and Rotate Right buttons below the diagram to view it from different angles.', hl: '#s3-diagram', dur: 16000 },
    { text: 'Select alpha first — that sets the x-axis angle. Once alpha is chosen, only the beta values that keep the constraint satisfiable become available. Gamma is then computed automatically.', hl: '#panel-3d', dur: 14000 },
    { text: 'The three direction cosines are not independent. Cos squared alpha plus cos squared beta plus cos squared gamma must equal exactly one. Gamma is always set to satisfy this automatically.', hl: '#constraint-display', dur: 14000 },
    { text: 'Try setting alpha to 90 degrees. That makes F perpendicular to x — so the x-component is zero. Watch which beta values remain available and how gamma adjusts.', hl: '#alpha-pills', dur: 13000 },
    { text: 'Watch the three component cards on the right update as you change angles and magnitude. All three components always satisfy the direction-cosine identity.', hl: '#s3-cards', dur: 12000 },
  ],
  'screen-4': [
    { text: 'This simulator has two opposing forces. F1 pushes the block from the right at an angle, F2 opposes it from the left. Set magnitude and angle for each.', hl: '.tug-panels', dur: 12000 },
    { text: 'Adjust Force 1 using the arrows for magnitude and the angle pills. Only its cosine theta component acts horizontally.', hl: '#force-panel-1', dur: 10000 },
    { text: 'Do the same for Force 2. Each force contributes F times cosine theta of horizontal pull.', hl: '#force-panel-2', dur: 8000 },
    { text: 'The resultant equals F1 cosine theta1 minus F2 cosine theta2. Positive means the block moves right, negative means left, zero means it stays put.', hl: '#s4-readouts', dur: 12000 },
  ],
  'screen-5': [
    { text: 'A 20 Newton force is applied at 30 degrees above horizontal. A 15 Newton force opposes it horizontally. The block has mass 2 kilograms. Find the direction and acceleration.', hl: '.mcq-question-panel', dur: 13000 },
    { text: 'Key step: decompose the 20 Newton force first. Find F cosine 30 degrees — only the horizontal component matters. The vertical sin component is a distractor.', hl: '.mcq-diagram-panel', dur: 12000 },
    { text: 'Select your answer and click Check Answer.', hl: '.mcq-options-grid', dur: 5000 },
  ],
  'screen-6': [
    { text: 'Guided practice for Question 1. Three possible workflows are shown — only one applies the correct sequence of steps.', hl: '.screen-title', dur: 10000 },
    { text: 'Read each workflow carefully.', hl: '#gp1-workflows', dur: 9000 },
    { text: 'Select your chosen workflow and click Submit. You can move on to see the full solution at any time using the Next button.', hl: '.gp-wf-controls', dur: 10000 },
  ],
  'screen-7': [
    { text: 'The correct answer is C — 1.16 metres per second squared toward the 20 Newton horizontal direction. Here is the full working.', hl: '.answer-banner', dur: 10000 },
    { text: 'Step 1: decompose the 20 Newton force. Cosine 30 degrees is 0.866. So the horizontal component is 17.32 Newtons forward.', hl: '#step6-1', dur: 14500, onStart: () => { clearS6Timers(); scheduleS6(3000, ['angled']); scheduleS6(6500, ['angled','decomp']); } },
    { text: 'Step 2: the 15 Newton force is already fully horizontal, acting in the backward direction.', hl: '#step6-2', dur: 9000, onStart: () => { clearS6Timers(); scheduleS6(1500, ['angled','decomp','f15']); } },
    { text: 'Step 3: subtract. 17.32 minus 15 equals 2.32 Newtons net forward.', hl: '#step6-3', dur: 10000, onStart: () => { clearS6Timers(); scheduleS6(2500, ['angled','decomp','f15','net']); } },
    { text: 'Step 4: apply Newton\'s Second Law. Acceleration equals F net over m — 2.32 divided by 2 equals 1.16 metres per second squared.', hl: '#step6-4', dur: 15000, onStart: () => { clearS6Timers(); scheduleS6(6000, ['angled','decomp','f15','net','acc']); } },
  ],
  'screen-8': [
    { text: 'Three forces act on a 5 kilogram block: 10 Newtons East, 6 root 3 Newtons North, and 4 Newtons West. Find the resultant acceleration.', hl: '.mcq-question-panel', dur: 11000 },
    { text: 'Strategy: first cancel the East-West forces to find the net east component. Then combine with North using Pythagoras.', hl: '.mcq-diagram-panel', dur: 9000 },
    { text: 'Remember: tangent of 60 degrees equals root 3. Know which axis you are measuring the angle from.', hl: '.mcq-options-grid', dur: 8000 },
  ],
  'screen-9': [
    { text: 'Guided practice for Question 2. Three workflows are shown — only one correctly handles all three forces and combines them in the right order.', hl: '.screen-title', dur: 11000 },
    { text: 'Look carefully at how each workflow deals with the East and West forces. One workflow ignores a force, and one combines them the wrong way.', hl: '#gp2-workflows', dur: 13000 },
    { text: 'Select the workflow you think is correct and click Submit. You can move to the full solution at any time using the Next button.', hl: '.gp-wf-controls', dur: 10000 },
  ],
  'screen-10': [
    { text: 'The correct answer is B — 2.4 metres per second squared at 60 degrees North of East.', hl: '.answer-banner', dur: 10500 },
    { text: 'Step 1: cancel East-West. 10 minus 4 equals 6 Newtons East.', hl: '#step8-1', dur: 8000, onStart: () => { clearS8Timers(); scheduleS8(500, ['east','west']); scheduleS8(4500, ['neteast']); } },
    { text: 'Step 2: the North component is 6 root 3, approximately 10.39 Newtons.', hl: '#step8-2', dur: 9500, onStart: () => { clearS8Timers(); scheduleS8(1000, ['neteast','north']); } },
    { text: 'Step 3: use Pythagoras. Root of 6 squared plus 6 root 3 squared equals root 144 equals 12 Newtons.', hl: '#step8-3', dur: 12500, onStart: () => { clearS8Timers(); scheduleS8(2000, ['neteast','pyth']); } },
    { text: 'Step 4: divide by mass. 12 divided by 5 equals 2.4 metres per second squared.', hl: '#step8-4', dur: 10000, onStart: () => { clearS8Timers(); scheduleS8(1500, ['neteast','pyth','acc']); } },
    { text: 'Step 5: the direction angle. Tangent theta equals root 3 so theta equals 60 degrees from East toward North.', hl: '#step8-5', dur: 11000, onStart: () => { clearS8Timers(); scheduleS8(2000, ['neteast','pyth','acc','angle']); } },
  ],
  'screen-11': [
    { text: 'A 10 Newton force is applied at 60 degrees above horizontal. A second 6 Newton force opposes it horizontally. Find the net horizontal force.', hl: '.mcq-question-panel', dur: 11000 },
    { text: 'Key: cosine of 60 degrees equals 0.5. So the 10 Newton force gives only 5 Newtons of horizontal pull. Compare that with the 6 Newton opposing force.', hl: '.mcq-diagram-panel', dur: 12000 },
    { text: 'Which is bigger: 5 Newtons forward or 6 Newtons backward? That tells you which way the net force points.', hl: '.mcq-options-grid', dur: 9000 },
  ],
  'screen-12': [
    { text: 'Question 3 asks for the net horizontal force when a 10 Newton force acts at 60 degrees and a 6 Newton force acts horizontally in the opposite direction. Three workflows are shown — choose the correct one.', hl: '.gp-problem-recap', dur: 14000 },
    { text: 'Workflow A skips decomposition and uses the full 10 Newton value directly. This is wrong — the angled force only contributes its horizontal component.', hl: '#gp3-wf-A', dur: 11000 },
    { text: 'Workflow C uses sine 60 instead of cosine 60. Sine gives the vertical component, not the horizontal one. This is a common trig error.', hl: '#gp3-wf-C', dur: 10000 },
    { text: 'Workflow B is correct. Decompose with cosine 60 to get 5 Newtons forward, then subtract the 6 Newton backward force to get 1 Newton net in the backward direction.', hl: '#gp3-wf-B', dur: 13000 },
  ],
  'screen-13': [
    { text: 'The correct answer is B — 1 Newton in the direction of the 6 Newton force. Here is the working.', hl: '.answer-banner', dur: 12000 },
    { text: 'Step 1: find the horizontal component of the 10 Newton force. 10 times cosine 60 equals 10 times 0.5 — that is 5 Newtons forward.', hl: '#step10-1', dur: 15000, onStart: () => { clearS10Timers(); scheduleS10(4000, ['angled','arc']); scheduleS10(9500, ['angled','arc','hcomp']); } },
    { text: 'Step 2: the 6 Newton force is fully horizontal, acting in the backward direction.', hl: '#step10-2', dur: 10000, onStart: () => { clearS10Timers(); scheduleS10(2000, ['angled','arc','hcomp','oppose']); } },
    { text: 'Step 3: subtract in the opposing direction. 6 minus 5 equals 1 Newton — net force is in the 6 Newton direction.', hl: '#step10-3', dur: 13000, onStart: () => { clearS10Timers(); scheduleS10(5000, ['angled','arc','hcomp','oppose','net']); } },
    { text: 'Step 4: the vertical component — 10 times sine 60 equals 8.66 Newtons — lifts the block but does not slide it. It is a distractor.', hl: '#step10-4', dur: 16000, onStart: () => { clearS10Timers(); scheduleS10(2000, ['angled','arc','hcomp','oppose','net','vcomp']); } },
  ],
  'screen-14': [
    { text: 'Friction is not a fixed number. It depends on two things: the coefficient mu, which describes the pair of surfaces, and the normal force N — how hard the block presses down.', hl: '#friction-diagram', dur: 14000 },
    { text: 'As you push the block, friction grows to exactly cancel your push — keeping the block still. This is static friction: reactive and self-adjusting.', hl: '#fr14-anim-panel', dur: 13000, onStart: () => { clearFr14Timers(); fr14Timers.push(setTimeout(fr14Phase1, 800)); } },
    { text: 'When push reaches f max — mu times N — friction cannot grow further. Push harder and the block breaks free and slides.', hl: '#fr14-anim-panel', dur: 13000, onStart: () => { clearFr14Timers(); fr14Timers.push(setTimeout(fr14Phase2, 500)); } },
    { text: 'Mu depends entirely on the pair of surfaces in contact. Ice has mu 0.05 — nearly no friction. Sandpaper has mu 0.80 — very hard to move.', hl: '#surface-cards', dur: 12000 },
    { text: 'Heavier block means greater normal force, which means greater maximum friction. Double the mass, double f max — same mu.', hl: '#surface-cards', dur: 10000 },
  ],
  'screen-15': [
    { text: 'Pick a surface using the tabs. Each tab changes mu. Watch f max jump with the same mass — same block, wildly different push needed.', hl: '#fl-tabs', dur: 11000 },
    { text: 'Adjust mass with the arrows. A heavier block presses harder, raising the normal force and lifting the friction limit.', hl: '#fl-mass-control', dur: 10000 },
    { text: 'Drag the applied force slider to the right. While you are below f max, friction adjusts to match and the block stays still.', hl: '#fl-slider-control', dur: 10000 },
    { text: 'Push past f max and the block breaks free. The gauge turns green and the status switches to moving.', hl: '#fl-gauge', dur: 9000 },
  ],
  'screen-16': [
    { text: 'A 5 kilogram block sits on polished wood with mu equals 0.20. What minimum horizontal force is needed to just start it moving? Take g as 9.8 metres per second squared.', hl: '.mcq-question-panel', dur: 13000 },
    { text: 'Use the formula: f max equals mu times m times g. The block starts moving when the push just exceeds this value.', hl: '.mcq-diagram-panel', dur: 10000 },
    { text: 'Watch the units: without g you get mu times m in kilograms, not Newtons. Always include g.', hl: '.mcq-options-grid', dur: 8500 },
  ],
  'screen-17': [
    { text: 'The correct answer is B — 9.8 Newtons. Just enough to overcome maximum static friction.', hl: '.answer-banner', dur: 8000 },
    { text: 'Step 1: find the normal force. N equals m times g — 5 times 9.8 equals 49 Newtons.', hl: '#step14-1', dur: 9000 },
    { text: 'Step 2: find maximum static friction. f max equals mu times N — 0.20 times 49 equals 9.8 Newtons.', hl: '#step14-2', dur: 9500 },
    { text: 'Step 3: the minimum force to start moving is just greater than f max — approximately 9.8 Newtons.', hl: '#step14-3', dur: 9000 },
  ],
  'screen-18': [
    { text: 'A 5 kg block, mu equals 0.40, g equals 10. Two questions: at what applied force does the block start moving, and what is the friction force when 15 Newtons is applied?', hl: '.mcq-question-panel', dur: 14000 },
    { text: 'Part 1: find f max. Part 2: remember friction is reactive — it adjusts to oppose the push exactly, up to its limit.', hl: '.mcq-diagram-panel', dur: 10000 },
    { text: 'Key idea: friction at 15 Newtons applied is not necessarily 20 Newtons. Think about what happens below the threshold.', hl: '.mcq-options-grid', dur: 10000 },
  ],
  'screen-19': [
    { text: 'The correct answer is C — starts moving at 20 Newtons, and friction at 15 Newtons applied equals 15 Newtons.', hl: '.answer-banner', dur: 10000 },
    { text: 'Step 1: normal force. N equals m times g — 5 times 10 equals 50 Newtons.', hl: '#step16-1', dur: 8000 },
    { text: 'Step 2: maximum friction. f max equals mu times N — 0.40 times 50 equals 20 Newtons. Block moves only when F exceeds 20.', hl: '#step16-2', dur: 11000 },
    { text: 'Step 3: at F equals 15 Newtons — below the threshold — friction adjusts to exactly cancel the push. Friction equals 15 Newtons.', hl: '#step16-3', dur: 11000 },
    { text: 'Step 4: net force is 15 minus 15 equals zero — no acceleration. The block stays put.', hl: '#step16-4', dur: 9000 },
  ],
  'screen-20': [
    { text: 'A 10 Newton force at 30 degrees pulls a 2 kilogram block. Mu equals 0.50, g equals 10. Does the block move?', hl: '.mcq-question-panel', dur: 10000 },
    { text: 'Sneaky part: the upward component F sine theta reduces the normal force. The new N is mg minus F sine theta — not just mg.', hl: '.mcq-diagram-panel', dur: 12000 },
    { text: 'Calculate the new normal force first, then find the new f max, then compare with the horizontal push.', hl: '.mcq-options-grid', dur: 9000 },
  ],
  'screen-21': [
    { text: 'The correct answer is C — yes, the block moves. The upward lift reduces the normal force, which shrinks f max below the horizontal push.', hl: '.answer-banner', dur: 12000 },
    { text: 'Step 1: horizontal component — F cosine 30 degrees equals 10 times 0.866 equals approximately 8.7 Newtons.', hl: '#step18-1', dur: 10000 },
    { text: 'Step 2: vertical component — F sine 30 degrees equals 10 times 0.5 equals 5 Newtons upward.', hl: '#step18-2', dur: 9000 },
    { text: 'Step 3: new normal force. N equals mg minus F sine theta — 2 times 10 minus 5 equals 15 Newtons. Not 20!', hl: '#step18-3', dur: 11000 },
    { text: 'Step 4: maximum friction with the new N. f max equals mu times N — 0.50 times 15 equals 7.5 Newtons.', hl: '#step18-4', dur: 10000 },
    { text: 'Step 5: compare. 8.7 Newtons push is greater than 7.5 Newtons friction — the block moves. Angling up reduces friction.', hl: '#step18-5', dur: 11000 },
  ],
};

function narrPlay() {
  if (narrState.playing) return;
  const cur = document.querySelector('.screen.active');
  if (!cur) return;
  const steps = NARR[cur.id];
  if (!steps || steps.length === 0) return;
  narrState.playing = true;
  if (narrState.step < 0) narrState.step = 0;
  updateNarrButton();
  speakStep(cur.id, steps);
}
function narrPause() {
  if (!narrState.playing) return;
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
  clearHighlights();
  updateNarrText('');
  updateNarrButton();
  updateNarrProgress(0, 0);
}
function narrToggle() {
  if (narrState.playing) { narrPause(); return; }
  const cur = document.querySelector('.screen.active');
  if (!cur) return;
  const steps = NARR[cur.id];
  if (!steps) return;
  if (narrState.step >= steps.length) narrState.step = 0;
  narrPlay();
}
function narrRestart() {
  narrStop();
  narrState.step = 0;
  narrPlay();
}
function narrAdvance() {
  const cur = document.querySelector('.screen.active');
  if (!cur) return;
  const steps = NARR[cur.id];
  if (!steps) return;
  narrState.step++;
  if (narrState.step >= steps.length) {
    narrState.playing = false;
    updateNarrButton();
    clearHighlights();
    return;
  }
  speakStep(cur.id, steps);
}
function speakStep(screenId, steps) {
  clearTimeout(narrState.timer);
  if (narrState.utt) { narrState.utt.onend = null; }
  const step = steps[narrState.step];
  if (!step) return;
  clearHighlights();
  if (step.hl) {
    document.querySelectorAll(step.hl).forEach(el => el.classList.add('hl-active'));
  }
  if (step.onStart) step.onStart();
  updateNarrText(step.text);
  updateNarrProgress(narrState.step + 1, steps.length);
  const utt = new SpeechSynthesisUtterance(step.text);
  utt.rate = 0.95;
  utt.onend = () => { if (narrState.playing) narrAdvance(); };
  narrState.utt = utt;
  narrState.timer = setTimeout(() => { if (narrState.playing) narrAdvance(); }, step.dur);
  window.speechSynthesis.speak(utt);
}
function clearHighlights() {
  document.querySelectorAll('.hl-active').forEach(el => el.classList.remove('hl-active'));
  stopBlockAnim('unequal');
  stopBlockAnim('same');
}
/* ─── BLOCK ANIMATION (screen-1 cases) ─── */
const blockAnimState = {};
function animateBlock(caseId) {
  stopBlockAnim(caseId);
  const g = document.getElementById('block-' + caseId + '-g');
  if (!g) return;
  const distance = 46; // SVG user units
  const slideMs = 1500, holdMs = 600, period = slideMs + holdMs;
  let t0 = null;
  function frame(ts) {
    if (!t0) t0 = ts;
    const elapsed = (ts - t0) % period;
    let x, op;
    if (elapsed < slideMs) {
      const p = elapsed / slideMs;
      x = distance * p * p; // ease-in (quadratic)
      op = 1;
    } else {
      const fp = (elapsed - slideMs) / holdMs;
      if (fp < 0.25) { x = distance; op = 1 - fp / 0.25; }
      else if (fp < 0.75) { x = 0; op = 0; }
      else { x = 0; op = (fp - 0.75) / 0.25; }
    }
    g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' 0)');
    g.style.opacity = op.toFixed(2);
    blockAnimState[caseId] = requestAnimationFrame(frame);
  }
  blockAnimState[caseId] = requestAnimationFrame(frame);
}
function stopBlockAnim(caseId) {
  if (blockAnimState[caseId]) { cancelAnimationFrame(blockAnimState[caseId]); delete blockAnimState[caseId]; }
  const g = document.getElementById('block-' + caseId + '-g');
  if (g) { g.removeAttribute('transform'); g.style.opacity = ''; }
}

function updateNarrText(t) { const el = document.getElementById('narr-text'); if (el) el.textContent = t; }
function updateNarrButton() {
  const btn = document.getElementById('btn-narr-toggle');
  if (btn) btn.innerHTML = narrState.playing ? '&#9646;&#9646; Pause' : '&#9654; Play';
}
function updateNarrProgress(step, total) {
  const fill = document.getElementById('narr-progress-fill');
  if (fill) fill.style.width = total > 0 ? `${(step / total) * 100}%` : '0%';
}

/* ─── SVG HELPERS ─── */
function svgArrow(x1, y1, x2, y2, color, id, dashed, strokeWidth) {
  const mkr = `mkr-${id || Math.random().toString(36).slice(2)}`;
  const sw = strokeWidth || 2;
  const dashAttr = dashed ? 'stroke-dasharray="6,4"' : '';
  return `<defs>
    <marker id="${mkr}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="${color}"/>
    </marker>
  </defs>
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
    stroke="${color}" stroke-width="${sw}" ${dashAttr}
    marker-end="url(#${mkr})"/>`;
}

/* ─── SCREEN 2: FORCE AT ANGLE ─── */
let s2Angle = 30;
const S2_ANGLES = [0, 30, 45, 60, 90];
const F2 = 20;

function initAngleScreen() {
  s2Angle = 30;
  renderAngleScreen();
}
function selectAngle(deg) {
  s2Angle = deg;
  renderAngleScreen();
}
function renderAngleScreen() {
  S2_ANGLES.forEach(a => {
    const pill = document.getElementById(`s2-pill-${a}`);
    if (pill) pill.classList.toggle('active', a === s2Angle);
  });
  const rad = s2Angle * Math.PI / 180;
  const fcos = +(F2 * Math.cos(rad)).toFixed(1);
  const fsin = +(F2 * Math.sin(rad)).toFixed(1);
  const el = v => document.getElementById(v);
  if (el('val-fcos')) el('val-fcos').textContent = fcos.toFixed(1) + ' N';
  if (el('val-fsin')) el('val-fsin').textContent = fsin.toFixed(1) + ' N';
  if (el('formula-fcos')) el('formula-fcos').textContent = `F · cos ${s2Angle}° = 20 · ${Math.cos(rad).toFixed(3)}`;
  if (el('formula-fsin')) el('formula-fsin').textContent = `F · sin ${s2Angle}° = 20 · ${Math.sin(rad).toFixed(3)}`;
  // Table highlight
  S2_ANGLES.forEach(a => {
    const row = document.getElementById(`s2-row-${a}`);
    if (row) row.classList.toggle('row-active', a === s2Angle);
  });
  // Diagram
  drawAngleDiagram();
}
function drawAngleDiagram() {
  const svg = document.getElementById('s2-diagram');
  if (!svg) return;
  const W = 240, H = 130;
  const rad = s2Angle * Math.PI / 180;
  const gy = 100;
  const bw = 40, bh = 28;
  const ox = 80;
  const bx = ox - bw / 2, by = gy - bh;
  const scale = 70;
  const startX = ox, startY = by;
  const fx = startX + scale * Math.cos(rad);
  const fy = startY - scale * Math.sin(rad);
  const cx = fx;
  const fcos = (F2 * Math.cos(rad)).toFixed(1);
  const fsin = (F2 * Math.sin(rad)).toFixed(1);

  const mkrId = 'arr' + Math.random().toString(36).slice(2, 6);
  const mkrIdH = 'arrH' + Math.random().toString(36).slice(2, 6);

  const mxF = (startX + fx) / 2, myF = (startY + fy) / 2;
  const labelFx = mxF - Math.sin(rad) * 12;
  const labelFy = myF - Math.cos(rad) * 12;

  const sinLabelY = startY - (startY - fy) * 0.75;

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `
    <defs>
      <marker id="${mkrId}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6"/>
      </marker>
      <marker id="${mkrIdH}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#059669"/>
      </marker>
    </defs>
    <title>Force at angle diagram</title>
    <line x1="10" y1="${gy}" x2="${W - 10}" y2="${gy}" stroke="#9ca3af" stroke-width="1.5"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="none" stroke="#1a2e44" stroke-width="2"/>
    ${s2Angle > 0 && s2Angle < 90 ? `<line x1="${startX}" y1="${startY}" x2="${fx - (fx - startX) * 0.07}" y2="${fy - (fy - startY) * 0.07}"
      stroke="#3b82f6" stroke-width="2.5" marker-end="url(#${mkrId})"/>` : ''}
    ${s2Angle > 0 && s2Angle < 90 ? `<line x1="${startX}" y1="${startY}" x2="${cx - scale * Math.cos(rad) * 0.05}" y2="${startY}"
      stroke="#059669" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#${mkrIdH})"/>` : ''}
    ${s2Angle > 0 && s2Angle < 90 ? `<line x1="${cx}" y1="${startY}" x2="${cx}" y2="${fy + 5}"
      stroke="#059669" stroke-width="1.5" stroke-dasharray="5,4"/>` : ''}
    ${s2Angle > 0 && s2Angle < 90 ? `<path d="M ${startX + 20} ${startY} A 20 20 0 0 0 ${startX + 20 * Math.cos(rad)} ${startY - 20 * Math.sin(rad)}"
      fill="none" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="${startX + 26}" y="${startY - 6}" font-size="10" fill="#f59e0b" font-weight="700">θ = ${s2Angle}°</text>` : ''}
    ${s2Angle > 0 && s2Angle < 90 ? `<text x="${labelFx}" y="${labelFy}" font-size="10" fill="#3b82f6" font-weight="700" text-anchor="middle">F = 20 N</text>` : ''}
    ${s2Angle > 0 && s2Angle < 90 ? `<text x="${(startX + cx) / 2}" y="${gy + 14}" font-size="9" fill="#059669" font-weight="600" text-anchor="middle">F cos θ = ${fcos} N</text>` : ''}
    ${s2Angle > 0 && s2Angle < 90 ? `<text x="${cx + 5}" y="${sinLabelY - 3}" font-size="9" fill="#059669" font-style="italic">F sin θ</text>
    <text x="${cx + 5}" y="${sinLabelY + 8}" font-size="9" fill="#059669" font-weight="600">${fsin} N</text>` : ''}
    ${s2Angle === 0 ? `<line x1="${startX}" y1="${startY}" x2="${startX + scale - 8}" y2="${startY}"
      stroke="#3b82f6" stroke-width="2.5" marker-end="url(#${mkrId})"/>
    <text x="${startX + 5}" y="${startY - 6}" font-size="10" fill="#3b82f6" font-weight="700">F = 20 N  (θ = 0°)</text>
    <text x="${W / 2}" y="${gy + 14}" font-size="9" fill="#059669" font-weight="600" text-anchor="middle">F cos 0° = ${fcos} N  ·  F sin 0° = 0.0 N</text>` : ''}
    ${s2Angle === 90 ? `<line x1="${startX}" y1="${startY}" x2="${startX}" y2="${startY - scale + 8}"
      stroke="#3b82f6" stroke-width="2.5" marker-end="url(#${mkrId})"/>
    <text x="${startX + 5}" y="${startY - scale * 0.5}" font-size="10" fill="#3b82f6" font-weight="700">F = 20 N  (θ = 90°)</text>
    <text x="${W / 2}" y="${gy + 14}" font-size="9" fill="#059669" font-weight="600" text-anchor="middle">F cos 90° = 0.0 N  ·  F sin 90° = ${fsin} N</text>` : ''}
  `;
}

/* ─── SCREEN 3: FORCE IN 3D ─── */
let s3F = 20, s3Alpha = 60, s3Beta = 60, s3Gamma = 45;
let s3RotAngle = Math.PI / 6;
const S3_ANGLES = [0, 30, 45, 60, 90];

function cos2(deg) { return Math.cos(deg * Math.PI / 180) ** 2; }
function validBetasFor(alpha) {
  return S3_ANGLES.filter(b => {
    const rem = 1 - cos2(alpha) - cos2(b);
    return rem >= -0.01 && S3_ANGLES.some(g => Math.abs(cos2(g) - rem) < 0.02);
  });
}
function autoGamma(alpha, beta) {
  const rem = 1 - cos2(alpha) - cos2(beta);
  return S3_ANGLES.find(g => Math.abs(cos2(g) - rem) < 0.02) ?? 90;
}

function init3DScreen() {
  s3F = 20; s3Alpha = 60; s3Beta = 60;
  s3Gamma = autoGamma(s3Alpha, s3Beta);
  s3RotAngle = Math.PI / 6;
  updateStepperDisplay('s3-mag', s3F);
  renderS3AlphaPills();
  renderS3BetaPills();
  renderS3GammaPills();
  update3D();
}

function renderS3AlphaPills() {
  S3_ANGLES.forEach(a => {
    const p = document.getElementById(`alpha-pill-${a}`);
    if (p) { p.classList.toggle('active', a === s3Alpha); p.disabled = false; }
  });
}
function renderS3BetaPills() {
  const valid = validBetasFor(s3Alpha);
  if (!valid.includes(s3Beta)) s3Beta = valid[0] ?? 90;
  S3_ANGLES.forEach(b => {
    const p = document.getElementById(`beta-pill-${b}`);
    if (p) { p.classList.toggle('active', b === s3Beta); p.disabled = !valid.includes(b); }
  });
}
function renderS3GammaPills() {
  S3_ANGLES.forEach(g => {
    const p = document.getElementById(`gamma-pill-${g}`);
    if (p) { p.classList.toggle('active', g === s3Gamma); p.disabled = true; }
  });
}

function select3DAngle(axis, deg) {
  if (axis === 'alpha') {
    s3Alpha = deg;
    renderS3AlphaPills();
    renderS3BetaPills();
    s3Gamma = autoGamma(s3Alpha, s3Beta);
    renderS3GammaPills();
  } else if (axis === 'beta') {
    if (!validBetasFor(s3Alpha).includes(deg)) return;
    s3Beta = deg;
    s3Gamma = autoGamma(s3Alpha, s3Beta);
    S3_ANGLES.forEach(b => { const p = document.getElementById(`beta-pill-${b}`); if (p) p.classList.toggle('active', b === s3Beta); });
    renderS3GammaPills();
  }
  update3D();
}

function stepS3Rotate(dir) {
  s3RotAngle += dir * Math.PI / 8;
  update3D();
}
function stepS3Mag(delta) {
  s3F = Math.max(1, Math.min(50, s3F + delta));
  updateStepperDisplay('s3-mag', s3F);
  update3D();
}
function updateStepperDisplay(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function update3D() {
  const ar = s3Alpha * Math.PI / 180;
  const br = s3Beta * Math.PI / 180;
  const gr = s3Gamma * Math.PI / 180;
  const fx = +(s3F * Math.cos(ar)).toFixed(2);
  const fy = +(s3F * Math.cos(br)).toFixed(2);
  const fz = +(s3F * Math.cos(gr)).toFixed(2);
  const sum = +(Math.cos(ar) ** 2 + Math.cos(br) ** 2 + Math.cos(gr) ** 2).toFixed(2);

  const el = id => document.getElementById(id);
  if (el('val-fx')) el('val-fx').textContent = Math.abs(fx).toFixed(2) + ' N';
  if (el('val-fy')) el('val-fy').textContent = Math.abs(fy).toFixed(2) + ' N';
  if (el('val-fz')) el('val-fz').textContent = Math.abs(fz).toFixed(2) + ' N';
  if (el('formula-fx')) el('formula-fx').textContent = `${s3F}·cos${s3Alpha}°`;
  if (el('formula-fy')) el('formula-fy').textContent = `${s3F}·cos${s3Beta}°`;
  if (el('formula-fz')) el('formula-fz').textContent = `${s3F}·cos${s3Gamma}°`;

  const c1 = +Math.cos(ar).toFixed(2), c2 = +Math.cos(br).toFixed(2), c3 = +Math.cos(gr).toFixed(2);
  const valid = Math.abs(sum - 1) < 0.02;
  const cd = el('constraint-display');
  if (cd) {
    cd.textContent = `${(c1*c1).toFixed(2)} + ${(c2*c2).toFixed(2)} + ${(c3*c3).toFixed(2)} = ${sum.toFixed(2)} ${valid ? '✓' : '✗'}`;
    cd.classList.toggle('invalid', !valid);
  }
  draw3DDiagram(fx, fy, fz);
}

function draw3DDiagram(Fx, Fy, Fz) {
  const svg = document.getElementById('s3-diagram');
  if (!svg) return;
  const W = 360, H = 280;
  const ox = 180, oy = 155;
  const sc = 62;

  function proj(x, y, z) {
    const rx = x * Math.cos(s3RotAngle) - y * Math.sin(s3RotAngle);
    const ry = x * Math.sin(s3RotAngle) + y * Math.cos(s3RotAngle);
    return {
      x: ox + (rx - ry) * sc * Math.cos(Math.PI / 6),
      y: oy + (rx + ry) * sc * Math.sin(Math.PI / 6) - z * sc,
    };
  }

  const o = proj(0, 0, 0);
  const axLen = 1.8;
  const xe = proj(axLen, 0, 0), ye = proj(0, axLen, 0), ze = proj(0, 0, axLen);
  const mag = Math.sqrt(Fx * Fx + Fy * Fy + Fz * Fz) || 1;
  const fscale = 1.4;
  const nx = (Fx / mag) * fscale, ny = (Fy / mag) * fscale, nz = (Fz / mag) * fscale;
  const Fp = proj(nx, ny, nz);
  const Fxp = proj(nx, 0, 0), Fyp = proj(0, ny, 0), Fzp = proj(0, 0, nz);

  // X-Y plane polygon at z=0
  const pl = 1.3;
  const xyC = [proj(0,0,0), proj(pl,0,0), proj(pl,pl,0), proj(0,pl,0)];
  const xyPoly = xyC.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const xyCX = (xyC[0].x+xyC[1].x+xyC[2].x+xyC[3].x)/4;
  const xyCY = (xyC[0].y+xyC[1].y+xyC[2].y+xyC[3].y)/4;

  // Arc helper: small arc at origin from axis direction to F direction
  function arcBetween(axPt, fPt, r) {
    const dx1=axPt.x-o.x, dy1=axPt.y-o.y, dx2=fPt.x-o.x, dy2=fPt.y-o.y;
    const l1=Math.sqrt(dx1*dx1+dy1*dy1)||1, l2=Math.sqrt(dx2*dx2+dy2*dy2)||1;
    const ux1=dx1/l1, uy1=dy1/l1, ux2=dx2/l2, uy2=dy2/l2;
    const cross=ux1*uy2-uy1*ux2;
    if (Math.abs(cross)<0.06) return null;
    const sweep=cross>0?1:0;
    const p1x=o.x+ux1*r, p1y=o.y+uy1*r;
    const p2x=o.x+ux2*r, p2y=o.y+uy2*r;
    const bx=ux1+ux2, by=uy1+uy2, bl=Math.sqrt(bx*bx+by*by)||1;
    const lr=r+13;
    return {
      path:`M ${p1x.toFixed(1)} ${p1y.toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${p2x.toFixed(1)} ${p2y.toFixed(1)}`,
      lx:o.x+(bx/bl)*lr, ly:o.y+(by/bl)*lr
    };
  }

  const arcA = arcBetween(xe, Fp, 18);
  const arcB = arcBetween(ye, Fp, 26);
  const arcG = arcBetween(ze, Fp, 12);

  const mkr = (id, col) => `<marker id="${id}" markerWidth="8" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L0,7 L8,3.5 z" fill="${col}"/></marker>`;

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `
    <defs>
      ${mkr('mkx','#9ca3af')} ${mkr('mky','#9ca3af')} ${mkr('mkz','#9ca3af')}
      ${mkr('mkF','#3b82f6')} ${mkr('mkFx','#059669')} ${mkr('mkFy','#059669')} ${mkr('mkFz','#059669')}
    </defs>
    <title>3D force diagram</title>
    <!-- X-Y plane -->
    <polygon points="${xyPoly}" fill="#e0f2fe" fill-opacity="0.45" stroke="#93c5fd" stroke-width="0.8"/>
    <text x="${xyCX.toFixed(1)}" y="${(xyCY+4).toFixed(1)}" font-size="9" fill="#60a5fa" text-anchor="middle" font-style="italic">X-Y plane</text>
    <!-- Axes -->
    <line x1="${o.x}" y1="${o.y}" x2="${xe.x}" y2="${xe.y}" stroke="#9ca3af" stroke-width="1.5" marker-end="url(#mkx)"/>
    <line x1="${o.x}" y1="${o.y}" x2="${ye.x}" y2="${ye.y}" stroke="#9ca3af" stroke-width="1.5" marker-end="url(#mky)"/>
    <line x1="${o.x}" y1="${o.y}" x2="${ze.x}" y2="${ze.y}" stroke="#9ca3af" stroke-width="1.5" marker-end="url(#mkz)"/>
    <!-- Axis labels -->
    <text x="${(xe.x+6).toFixed(1)}" y="${(xe.y+4).toFixed(1)}" font-size="14" fill="#6b7280" font-style="italic">x</text>
    <text x="${(ye.x-14).toFixed(1)}" y="${(ye.y+4).toFixed(1)}" font-size="14" fill="#6b7280" font-style="italic">y</text>
    <text x="${(ze.x+4).toFixed(1)}" y="${(ze.y-4).toFixed(1)}" font-size="14" fill="#6b7280" font-style="italic">z</text>
    <!-- Component projections (dashed) -->
    <line x1="${o.x}" y1="${o.y}" x2="${Fxp.x}" y2="${Fxp.y}" stroke="#059669" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#mkFx)"/>
    <line x1="${o.x}" y1="${o.y}" x2="${Fyp.x}" y2="${Fyp.y}" stroke="#059669" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#mkFy)"/>
    <line x1="${o.x}" y1="${o.y}" x2="${Fzp.x}" y2="${Fzp.y}" stroke="#059669" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#mkFz)"/>
    <!-- Parallelepiped edges -->
    <line x1="${Fp.x}" y1="${Fp.y}" x2="${Fxp.x}" y2="${Fxp.y}" stroke="#059669" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.5"/>
    <line x1="${Fp.x}" y1="${Fp.y}" x2="${Fyp.x}" y2="${Fyp.y}" stroke="#059669" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.5"/>
    <line x1="${Fp.x}" y1="${Fp.y}" x2="${Fzp.x}" y2="${Fzp.y}" stroke="#059669" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.5"/>
    <!-- Angle arcs -->
    ${arcG?`<path d="${arcG.path}" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="${arcG.lx.toFixed(1)}" y="${arcG.ly.toFixed(1)}" font-size="10" fill="#f59e0b" font-weight="700" text-anchor="middle">γ=${s3Gamma}°</text>`:''}
    ${arcA?`<path d="${arcA.path}" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="${arcA.lx.toFixed(1)}" y="${arcA.ly.toFixed(1)}" font-size="10" fill="#f59e0b" font-weight="700" text-anchor="middle">α=${s3Alpha}°</text>`:''}
    ${arcB?`<path d="${arcB.path}" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="${arcB.lx.toFixed(1)}" y="${arcB.ly.toFixed(1)}" font-size="10" fill="#f59e0b" font-weight="700" text-anchor="middle">β=${s3Beta}°</text>`:''}
    <!-- Force vector F (drawn on top) -->
    <line x1="${o.x}" y1="${o.y}" x2="${Fp.x}" y2="${Fp.y}" stroke="#3b82f6" stroke-width="3" marker-end="url(#mkF)"/>
    <!-- F label -->
    <text x="${(Fp.x+6).toFixed(1)}" y="${(Fp.y-4).toFixed(1)}" font-size="12" fill="#3b82f6" font-weight="700">F = ${s3F} N</text>
    <!-- Component labels -->
    <text x="${(Fxp.x+4).toFixed(1)}" y="${(Fxp.y+4).toFixed(1)}" font-size="10" fill="#059669" font-style="italic">F_x</text>
    <text x="${(Fyp.x-22).toFixed(1)}" y="${(Fyp.y+4).toFixed(1)}" font-size="10" fill="#059669" font-style="italic">F_y</text>
    <text x="${(Fzp.x+4).toFixed(1)}" y="${Fzp.y.toFixed(1)}" font-size="10" fill="#059669" font-style="italic">F_z</text>
  `;
}

/* ─── SCREEN 4: FORCE TUG ─── */
let tugF1 = 20, tugA1 = 30, tugF2 = 15, tugA2 = 0;
const TUG_ANGLES = [0, 30, 45, 60, 90];

function initTugScreen() {
  tugF1 = 20; tugA1 = 30; tugF2 = 15; tugA2 = 0;
  updateTugPills(1, tugA1);
  updateTugPills(2, tugA2);
  updateStepperDisplay('tug-mag1', tugF1);
  updateStepperDisplay('tug-mag2', tugF2);
  updateTug();
}
function stepTug(force, delta) {
  if (force === 1) { tugF1 = Math.max(1, Math.min(50, tugF1 + delta)); updateStepperDisplay('tug-mag1', tugF1); }
  else { tugF2 = Math.max(1, Math.min(50, tugF2 + delta)); updateStepperDisplay('tug-mag2', tugF2); }
  updateTug();
}
function selectTugAngle(force, deg) {
  if (force === 1) tugA1 = deg;
  else tugA2 = deg;
  updateTugPills(force, deg);
  updateTug();
}
function updateTugPills(force, val) {
  TUG_ANGLES.forEach(a => {
    const p = document.getElementById(`tug-pill-${force}-${a}`);
    if (p) p.classList.toggle('active', a === val);
  });
}
function updateTug() {
  const r1 = tugA1 * Math.PI / 180, r2 = tugA2 * Math.PI / 180;
  const c1 = +(tugF1 * Math.cos(r1)).toFixed(1);
  const c2 = +(tugF2 * Math.cos(r2)).toFixed(1);
  const res = +(c1 - c2).toFixed(1);
  const dir = res > 0.05 ? '→' : res < -0.05 ? '←' : '·';
  const el = id => document.getElementById(id);
  if (el('tug-c1')) el('tug-c1').textContent = c1.toFixed(1) + ' N';
  if (el('tug-c2')) el('tug-c2').textContent = c2.toFixed(1) + ' N';
  if (el('tug-res')) el('tug-res').textContent = Math.abs(res).toFixed(1) + ' N ' + dir;
  drawTugDiagram(c1, c2, res);
}

function drawTugDiagram(c1, c2, res) {
  const svg = document.getElementById('s4-diagram');
  if (!svg) return;
  const W = 440, H = 150;
  const ox = 220, oy = 72;
  const bw = 54, bh = 38;
  const r1 = tugA1 * Math.PI / 180, r2 = tugA2 * Math.PI / 180;
  const maxF = Math.max(tugF1, tugF2, 1);
  const sc = 75 / maxF;

  const F1len = tugF1 * sc, F2len = tugF2 * sc;
  const Clen = Math.min(Math.abs(res) * sc, 65);

  const uid = Math.random().toString(36).slice(2, 6);
  const mkr = (id, col) => `<marker id="${id}" markerWidth="8" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L0,7 L8,3.5 z" fill="${col}"/></marker>`;

  const F1x = ox + bw / 2 + F1len * Math.cos(r1);
  const F1y = oy - bh / 2 - F1len * Math.sin(r1);
  const F2x = ox - bw / 2 - F2len * Math.cos(r2);
  const F2y = oy - bh / 2 - F2len * Math.sin(r2);

  const groundY = oy + bh / 2;
  const resDir = res >= 0 ? 1 : -1;
  const resEndX = ox + resDir * Clen;

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `
    <defs>
      ${mkr(`tf1-${uid}`, '#3b82f6')} ${mkr(`tf2-${uid}`, '#3b82f6')}
      ${mkr(`tres-${uid}`, '#059669')}
    </defs>
    <title>Force tug diagram</title>
    <!-- ground -->
    <line x1="20" y1="${groundY}" x2="${W - 20}" y2="${groundY}" stroke="#9ca3af" stroke-width="1.5"/>
    <!-- block -->
    <rect x="${ox - bw / 2}" y="${oy - bh / 2}" width="${bw}" height="${bh}" fill="none" stroke="#1a2e44" stroke-width="2.5"/>
    <!-- F1 arrow -->
    <line x1="${ox + bw / 2}" y1="${oy - bh / 2}" x2="${F1x}" y2="${F1y}" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#tf1-${uid})"/>
    <text x="${(ox + bw / 2 + F1x) / 2 + 4}" y="${(oy - bh / 2 + F1y) / 2 - 5}" font-size="11" fill="#3b82f6" font-weight="700">F₁=${tugF1}N@${tugA1}°</text>
    <!-- F2 arrow -->
    <line x1="${ox - bw / 2}" y1="${oy - bh / 2}" x2="${F2x}" y2="${F2y}" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#tf2-${uid})"/>
    <text x="${Math.min(ox - bw / 2, F2x) - 4}" y="${(oy - bh / 2 + F2y) / 2 - 5}" font-size="11" fill="#3b82f6" font-weight="700" text-anchor="end">F₂=${tugF2}N@${tugA2}°</text>
    <!-- Resultant: green arrow above label, pointing in direction of net force -->
    ${Math.abs(res) > 0.05 ? `
      <line x1="${ox}" y1="${groundY + 12}" x2="${resEndX + (resDir > 0 ? -6 : 6)}" y2="${groundY + 12}" stroke="#059669" stroke-width="2.5" marker-end="url(#tres-${uid})"/>
      <text x="${ox}" y="${groundY + 30}" font-size="10" fill="#059669" font-weight="700" text-anchor="middle">${Math.abs(res).toFixed(1)} N ${resDir > 0 ? '→' : '←'} · block accelerates</text>
    ` : `
      <text x="${ox}" y="${groundY + 20}" font-size="10" fill="#6b7280" text-anchor="middle">Net = 0 · block at rest</text>
    `}
  `;
}

/* ─── MCQ ─── */
const MCQ_CORRECT = { mcq1: 'C', mcq2: 'B', mcq3: 'B', mcq4: 'B', mcq5: 'C', mcq6: 'C' };
let mcqSelected = {};

function initMCQ(id) { mcqSelected[id] = null; }

function selectMCQ(id, opt) {
  mcqSelected[id] = opt;
  ['A', 'B', 'C', 'D'].forEach(o => {
    const btn = document.getElementById(`${id}-opt-${o}`);
    if (btn) { btn.classList.toggle('selected', o === opt); btn.classList.remove('correct', 'wrong'); }
  });
  const fb = document.getElementById(`${id}-feedback`);
  if (fb) { fb.textContent = ''; fb.className = 'mcq-feedback'; }
}

function checkMCQ(id, nextScreen) {
  if (!mcqSelected[id]) return;
  const correct = MCQ_CORRECT[id];
  const sel = mcqSelected[id];
  ['A', 'B', 'C', 'D'].forEach(o => {
    const btn = document.getElementById(`${id}-opt-${o}`);
    if (!btn) return;
    btn.disabled = true;
    if (o === correct) btn.classList.add('correct');
    else if (o === sel) btn.classList.add('wrong');
  });
  const fb = document.getElementById(`${id}-feedback`);
  if (fb) {
    if (sel === correct) { fb.textContent = '✓ Correct!'; fb.className = 'mcq-feedback correct-msg'; }
    else { fb.textContent = `✗ Try again — correct is ${correct}`; fb.className = 'mcq-feedback wrong-msg'; }
  }
  const nextBtn = document.getElementById(`${id}-next`);
  if (nextBtn) nextBtn.disabled = false;
}

/* ─── FRICTION LAB (Screen 12) ─── */
const SURFACES = {
  ice:       { mu: 0.05, label: 'Ice',          color: '#bfdbfe', desc: 'Slips with almost any push' },
  wood:      { mu: 0.20, label: 'Polished wood', color: '#d4a574', desc: 'Moderate' },
  carpet:    { mu: 0.45, label: 'Carpet',        color: '#b45309', desc: 'Stubborn' },
  sandpaper: { mu: 0.80, label: 'Sandpaper',     color: '#6b7280', desc: 'Very hard to move' },
};
const SURFACE_KEYS = ['ice', 'wood', 'carpet', 'sandpaper'];
let flSurface = 'wood', flMass = 5, flForce = 6.5;

function initFrictionLab() {
  flSurface = 'wood'; flMass = 5; flForce = 6.5;
  const slider = document.getElementById('fl-slider');
  if (slider) { slider.min = 0; slider.max = 500; slider.step = 0.5; slider.value = flForce; }
  updateFlTabs();
  updateStepperDisplay('fl-mass-val', flMass);
  updateFrictionLab();
}

function selectFlSurface(key) {
  flSurface = key;
  updateFlTabs();
  updateFrictionLab();
}

function stepFlMass(delta) {
  flMass = Math.max(1, Math.min(50, flMass + delta));
  updateStepperDisplay('fl-mass-val', flMass);
  updateFrictionLab();
}

function setFlForce(val) {
  flForce = parseFloat(val);
  const el = document.getElementById('fl-force-val');
  if (el) el.textContent = flForce.toFixed(1) + ' N';
  updateFrictionLab();
}

function updateFlTabs() {
  SURFACE_KEYS.forEach(k => {
    const tab = document.getElementById(`fl-tab-${k}`);
    if (tab) tab.classList.toggle('fl-tab-active', k === flSurface);
  });
}

function updateFrictionLab() {
  const mu = SURFACES[flSurface].mu;
  const N  = +(flMass * 9.8).toFixed(1);
  const fmax = +(mu * N).toFixed(1);
  const applied = +flForce.toFixed(1);
  const friction = Math.min(applied, fmax);
  const moving = applied > fmax;

  const el = id => document.getElementById(id);
  if (el('fl-formula-N'))    el('fl-formula-N').textContent    = `N = m·g = ${flMass} × 9.8 = ${N} N`;
  if (el('fl-formula-fmax')) el('fl-formula-fmax').textContent = `f_max = μ·N = ${mu} × ${N} = ${fmax} N`;
  if (el('fl-formula-app'))  el('fl-formula-app').textContent  = `F_applied = ${applied} N`;

  const status = el('fl-status');
  if (status) {
    status.textContent = moving
      ? `STATUS: moving! · block accelerates (F > f_max)`
      : `STATUS: at rest · friction adjusting (f = ${friction.toFixed(1)} N)`;
    status.className = 'fl-status ' + (moving ? 'fl-status-moving' : 'fl-status-rest');
  }

  // Gauge: full height = fmax visual scale (use fmax * 1.5 as max for bar)
  const gaugeMax = Math.max(fmax * 1.5, applied * 1.05, 1);
  const fillPct  = Math.min((applied / gaugeMax) * 100, 100);
  const fmaxPct  = Math.min((fmax    / gaugeMax) * 100, 100);
  const gFill = el('fl-gauge-fill');
  const gLine = el('fl-gauge-fmax-line');
  const gLabel = el('fl-gauge-fmax-label');
  if (gFill) {
    gFill.style.height = fillPct + '%';
    gFill.style.background = moving ? '#059669' : '#f59e0b';
  }
  if (gLine)  gLine.style.bottom  = fmaxPct + '%';
  if (gLabel) { gLabel.style.bottom = fmaxPct + '%'; gLabel.textContent = `f_max ${fmax}N`; }

  drawFrictionDiagram(applied, fmax, N, flMass, moving);
}

function drawFrictionDiagram(applied, fmax, N, mass, moving) {
  const svg = document.getElementById('fl-diagram');
  if (!svg) return;
  const W = 420, H = 180;
  const gy = 138, bw = 80, bh = 54;
  const ox = W / 2;
  const by = gy - bh;

  const scale = 90;
  const appLen = Math.min((applied / Math.max(fmax * 1.5, applied + 1)) * scale, scale);
  const fricVal = moving ? fmax : Math.min(applied, fmax);
  const friLen = Math.min((fricVal / Math.max(fmax * 1.5, applied + 1)) * scale, scale);
  const normLen = 52, weightLen = 52;

  const mkr = (id, col) => `<marker id="${id}" markerWidth="8" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L0,7 L8,3.5 z" fill="${col}"/></marker>`;

  const slideStyle = moving
    ? `<style>@keyframes fl-blk-slide{from{transform:translateX(-210px)}to{transform:translateX(210px)}}#fl-block-grp{animation:fl-blk-slide 2s linear infinite}</style>`
    : '';

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `
    <defs>
      ${slideStyle}
      ${mkr('fd-app','#3b82f6')} ${mkr('fd-fri','#ef4444')}
      ${mkr('fd-nrm','#374151')} ${mkr('fd-wgt','#374151')}
    </defs>
    <title>Friction force diagram</title>
    <line x1="20" y1="${gy}" x2="${W-20}" y2="${gy}" stroke="#9ca3af" stroke-width="1.5"/>
    <g id="fl-block-grp">
      <rect x="${ox-bw/2}" y="${by}" width="${bw}" height="${bh}" fill="none" stroke="#1a2e44" stroke-width="2.5"/>
      <text x="${ox}" y="${by+bh/2+5}" text-anchor="middle" font-size="13" font-weight="700" fill="#1a2e44">${mass} kg</text>
      <line x1="${ox}" y1="${by}" x2="${ox}" y2="${by-normLen+6}" stroke="#374151" stroke-width="2" marker-end="url(#fd-nrm)"/>
      <text x="${ox+4}" y="${by-normLen-4}" font-size="10" fill="#374151">N = ${N} N</text>
      <line x1="${ox}" y1="${gy}" x2="${ox}" y2="${gy+weightLen-6}" stroke="#374151" stroke-width="2" marker-end="url(#fd-wgt)"/>
      <text x="${ox+4}" y="${gy+weightLen+12}" font-size="10" fill="#374151">W = ${(mass*9.8).toFixed(1)} N</text>
      ${appLen > 2 ? `<line x1="${ox+bw/2}" y1="${by+bh/2}" x2="${ox+bw/2+appLen-6}" y2="${by+bh/2}" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#fd-app)"/>
      <text x="${ox+bw/2+appLen/2}" y="${by+bh/2-8}" font-size="10" fill="#3b82f6" text-anchor="middle">F = ${applied.toFixed(1)} N</text>` : ''}
      ${friLen > 2 ? `<line x1="${ox-bw/2}" y1="${by+bh/2}" x2="${ox-bw/2-friLen+6}" y2="${by+bh/2}" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#fd-fri)"/>
      <text x="${ox-bw/2-friLen/2}" y="${by+bh/2-8}" font-size="10" fill="#ef4444" text-anchor="middle">f = ${fricVal.toFixed(1)} N</text>` : ''}
    </g>
  `;
}

/* ─── SCREEN 6 — progressive force diagram ─── */
const s6Timers = [];
function clearS6Timers() { s6Timers.forEach(clearTimeout); s6Timers.length = 0; }
function scheduleS6(ms, ids) { s6Timers.push(setTimeout(() => showS6Groups(ids), ms)); }
function showS6Groups(ids) {
  ['angled','decomp','f15','net','acc'].forEach(key => {
    const el = document.getElementById('diag6-' + key);
    if (el) el.style.display = ids.includes(key) ? '' : 'none';
  });
}

/* ─── SCREEN 6 — guided practice Q1 ─── */
let gp1Selected = null;

function initGuidedPractice1() {
  gp1Selected = null;
  ['A', 'B', 'C'].forEach(w => {
    const card = document.getElementById('gp1-wf-' + w);
    if (card) { card.className = 'gp-workflow-card'; card.disabled = false; }
  });
  const fb = document.getElementById('gp1-wf-feedback');
  if (fb) { fb.textContent = ''; fb.className = 'gp-feedback'; }
}

function selectWorkflow(letter) {
  gp1Selected = letter;
  ['A', 'B', 'C'].forEach(w => {
    const card = document.getElementById('gp1-wf-' + w);
    if (card) card.classList.toggle('gp-wf-selected', w === letter);
  });
  const fb = document.getElementById('gp1-wf-feedback');
  if (fb) { fb.textContent = ''; fb.className = 'gp-feedback'; }
}

function submitWorkflow() {
  const fb = document.getElementById('gp1-wf-feedback');
  if (!fb) return;
  if (!gp1Selected) { fb.textContent = 'Select a workflow first.'; fb.className = 'gp-feedback gp-fb-wrong'; return; }
  const reasons = {
    A: 'Workflow A skips decomposition — the 20 N force is at an angle, so only its horizontal component can be directly combined with the 15 N force.',
    C: 'Workflow C adds the forces instead of subtracting — the 15 N force opposes the forward component, so they partially cancel.'
  };
  if (gp1Selected === 'B') {
    fb.textContent = '✓ Correct! Decompose the angled force first, then subtract the opposing force.';
    fb.className = 'gp-feedback gp-fb-right';
    ['A', 'B', 'C'].forEach(w => {
      const card = document.getElementById('gp1-wf-' + w);
      if (card) { card.classList.remove('gp-wf-selected'); card.classList.add(w === 'B' ? 'gp-wf-correct' : 'gp-wf-wrong'); card.disabled = true; }
    });
  } else {
    fb.textContent = '✗ Not quite. ' + reasons[gp1Selected];
    fb.className = 'gp-feedback gp-fb-wrong';
  }
}

/* ─── SCREEN 9 — guided practice Q2 ─── */
let gp2Selected = null;

function initGuidedPractice2() {
  gp2Selected = null;
  ['A', 'B', 'C'].forEach(w => {
    const card = document.getElementById('gp2-wf-' + w);
    if (card) { card.className = 'gp-workflow-card'; card.disabled = false; }
  });
  const fb = document.getElementById('gp2-wf-feedback');
  if (fb) { fb.textContent = ''; fb.className = 'gp-feedback'; }
}

function selectWorkflow2(letter) {
  gp2Selected = letter;
  ['A', 'B', 'C'].forEach(w => {
    const card = document.getElementById('gp2-wf-' + w);
    if (card) card.classList.toggle('gp-wf-selected', w === letter);
  });
  const fb = document.getElementById('gp2-wf-feedback');
  if (fb) { fb.textContent = ''; fb.className = 'gp-feedback'; }
}

function submitWorkflow2() {
  const fb = document.getElementById('gp2-wf-feedback');
  if (!fb) return;
  if (!gp2Selected) { fb.textContent = 'Select a workflow first.'; fb.className = 'gp-feedback gp-fb-wrong'; return; }
  const reasons = {
    B: 'Workflow B ignores the 4 N West force entirely — all three forces must be accounted for before applying Pythagoras.',
    C: 'Workflow C adds East and West instead of subtracting — the West force opposes East, so net East = 10 − 4 = 6 N, not 10 + 4 = 14 N.'
  };
  if (gp2Selected === 'A') {
    fb.textContent = '✓ Correct! Cancel opposing E-W forces first, then apply Pythagoras to the remaining perpendicular components.';
    fb.className = 'gp-feedback gp-fb-right';
    ['A', 'B', 'C'].forEach(w => {
      const card = document.getElementById('gp2-wf-' + w);
      if (card) { card.classList.remove('gp-wf-selected'); card.classList.add(w === 'A' ? 'gp-wf-correct' : 'gp-wf-wrong'); card.disabled = true; }
    });
  } else {
    fb.textContent = '✗ Not quite. ' + reasons[gp2Selected];
    fb.className = 'gp-feedback gp-fb-wrong';
  }
}

/* ─── SCREEN 10 — progressive force diagram (Answer 2) ─── */
const s8Timers = [];
function clearS8Timers() { s8Timers.forEach(clearTimeout); s8Timers.length = 0; }
function scheduleS8(ms, ids) { s8Timers.push(setTimeout(() => showS8Groups(ids), ms)); }
function showS8Groups(ids) {
  ['east','west','neteast','north','pyth','acc','angle'].forEach(key => {
    const el = document.getElementById('diag8-' + key);
    if (el) el.style.display = ids.includes(key) ? '' : 'none';
  });
}

/* ─── SCREEN 12 — Guided Practice Q3 ─── */
let gp3Selected = null;
function initGuidedPractice3() {
  gp3Selected = null;
  ['A', 'B', 'C'].forEach(w => {
    const card = document.getElementById('gp3-wf-' + w);
    if (card) { card.className = 'gp-workflow-card'; card.disabled = false; }
  });
  const fb = document.getElementById('gp3-wf-feedback');
  if (fb) { fb.textContent = ''; fb.className = 'gp-feedback'; }
}
function selectWorkflow3(letter) {
  gp3Selected = letter;
  ['A', 'B', 'C'].forEach(w => {
    const card = document.getElementById('gp3-wf-' + w);
    if (card) card.classList.toggle('gp-wf-selected', w === letter);
  });
  const fb = document.getElementById('gp3-wf-feedback');
  if (fb) { fb.textContent = ''; fb.className = 'gp-feedback'; }
}
function submitWorkflow3() {
  const fb = document.getElementById('gp3-wf-feedback');
  if (!fb) return;
  if (!gp3Selected) { fb.textContent = 'Select a workflow first.'; fb.className = 'gp-feedback gp-fb-wrong'; return; }
  const reasons = {
    A: 'Workflow A uses the full 10 N directly — but the force is angled. Only its horizontal component (cos 60° = 5 N) acts along the surface.',
    C: 'Workflow C uses sin 60° instead of cos 60°. Sine gives the vertical component; cosine gives the horizontal one.'
  };
  if (gp3Selected === 'B') {
    fb.textContent = '✓ Correct! Decompose with cos 60° to get 5 N forward, then subtract the 6 N backward force.';
    fb.className = 'gp-feedback gp-fb-right';
    ['A', 'B', 'C'].forEach(w => {
      const card = document.getElementById('gp3-wf-' + w);
      if (card) { card.classList.remove('gp-wf-selected'); card.classList.add(w === 'B' ? 'gp-wf-correct' : 'gp-wf-wrong'); card.disabled = true; }
    });
  } else {
    fb.textContent = '✗ Not quite. ' + reasons[gp3Selected];
    fb.className = 'gp-feedback gp-fb-wrong';
  }
}

/* ─── SCREEN 13 — progressive force diagram (Answer 3) ─── */
const s10Timers = [];
function clearS10Timers() { s10Timers.forEach(clearTimeout); s10Timers.length = 0; }
function scheduleS10(ms, ids) { s10Timers.push(setTimeout(() => showS10Groups(ids), ms)); }
function showS10Groups(ids) {
  ['angled','arc','hcomp','oppose','net','vcomp'].forEach(key => {
    const el = document.getElementById('diag10-' + key);
    if (el) el.style.display = ids.includes(key) ? '' : 'none';
  });
}

/* ─── SCREEN 14 — friction animation ─── */
const fr14Timers = [];
let fr14SlideIv = null;
function clearFr14Timers() {
  fr14Timers.forEach(clearTimeout); fr14Timers.length = 0;
  if (fr14SlideIv) { clearInterval(fr14SlideIv); fr14SlideIv = null; }
}

function fr14SlideBlock() {
  if (fr14SlideIv) { clearInterval(fr14SlideIv); fr14SlideIv = null; }
  const g = document.getElementById('fr14-block-group');
  if (!g) return;
  let dx = 0;
  fr14SlideIv = setInterval(() => {
    dx += 2;
    g.setAttribute('transform', 'translate(' + dx + ',0)');
    if (dx >= 60) { clearInterval(fr14SlideIv); fr14SlideIv = null; }
  }, 20);
}

function fr14Render(pushLen, fricLen, statusText, statusText2, showMax, showSlide) {
  const BLOCK_RIGHT = 165, BLOCK_LEFT = 115;
  const pLine = document.getElementById('fr14-push');
  const pLbl  = document.getElementById('fr14-push-lbl');
  const fLine = document.getElementById('fr14-fric');
  const fLbl  = document.getElementById('fr14-fric-lbl');
  if (pLine) { pLine.setAttribute('x2', BLOCK_RIGHT + pushLen); pLine.style.display = pushLen > 2 ? '' : 'none'; }
  if (pLbl)  { pLbl.setAttribute('x', BLOCK_RIGHT + pushLen / 2); pLbl.style.display = pushLen > 2 ? '' : 'none'; }
  if (fLine) { fLine.setAttribute('x2', BLOCK_LEFT - fricLen); fLine.style.display = fricLen > 2 ? '' : 'none'; }
  if (fLbl)  { fLbl.setAttribute('x', BLOCK_LEFT - fricLen / 2); fLbl.style.display = fricLen > 2 ? '' : 'none'; }
  const mm = document.getElementById('fr14-maxmark');
  if (mm) mm.style.display = showMax ? '' : 'none';
  const sl = document.getElementById('fr14-slide');
  if (sl) sl.style.display = showSlide ? '' : 'none';
  const s1 = document.getElementById('fr14-status');
  const s2 = document.getElementById('fr14-status2');
  if (s1) s1.textContent = statusText  || '';
  if (s2) s2.textContent = statusText2 || '';
}

function initFriction14Anim() {
  clearFr14Timers();
  const g = document.getElementById('fr14-block-group');
  if (g) g.setAttribute('transform', 'translate(0,0)');
  fr14Render(0, 0, '', '', false, false);
}

function fr14Phase1() {
  fr14Render(18, 18, 'f = F — friction balances push', 'block stays still', false, false);
  fr14Timers.push(setTimeout(() => fr14Render(36, 36, 'f = F — friction balances push', 'block stays still', false, false), 2000));
  fr14Timers.push(setTimeout(() => fr14Render(55, 55, 'F = f_max — at the limit', '', true, false), 4000));
}

function fr14Phase2() {
  fr14Render(55, 55, 'F = f_max — at the limit', '', true, false);
  fr14Timers.push(setTimeout(() => fr14Render(80, 55, 'F > f_max — friction cannot keep up!', '', true, false), 2500));
  fr14Timers.push(setTimeout(() => {
    fr14Render(80, 55, 'Block is sliding!', '', true, true);
    fr14SlideBlock();
  }, 4500));
}

document.addEventListener('DOMContentLoaded', () => {
  goToScreen('screen-intro');
});


