'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function boot() {
  const storage = {};
  const ctx = vm.createContext({
    window: {}, console, Math, Date, JSON, Number, String, Boolean, Array, Object, Set, Map, RegExp, Error, Promise,
    Uint8Array, Blob, DecompressionStream, Response, setTimeout, clearTimeout, setInterval, clearInterval,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    localStorage: {
      getItem: (k) => storage[k] ?? null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
    },
  });
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  const scripts = [
    'data.js','factions-0.15.js','scenario-2028.js','issues-0.2.1.js','maps-0.3.js',
    'state-house-data-0.5.js','voter-model-0.5.js','demographics-0.9.js','political-trends-system.js',
    'v07-scaffolding.js','party-systems-data.js','party-systems-coalition.js','party-systems-robots.js',
    'party-systems-engine.js','party-systems-ui.js','presidential-primaries.js','ballot-access.js',
    'election-uncertainty.js','candidate-vetting.js','election-drift.js','election-night-engine.js','engine.js',
  ];
  for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

let passed = 0, failed = 0;
function check(label, cond, detail = '') {
  if (cond) {
    passed++;
    console.log(`  PASS: ${label}${detail ? ` (${detail})` : ''}`);
  } else {
    failed++;
    console.error(`  FAIL: ${label}${detail ? ` (${detail})` : ''}`);
  }
}

console.log('====================================================================');
console.log(' VERSION 0.17.0 REQ-291 AGE ENGINE DELTA TEST SUITE');
console.log('====================================================================\n');

const ctx = boot();
const Engine = ctx.PartyChairEngine;

// --- CHECK 1: Birth-Year Persistence & Derived-Age Invariance ---
console.log('--- CHECK 1: Birth-Year Persistence ---');
const initGame = Engine.createGame({ baseTemplateId: 'people' });
const sitting = initGame.sittingMembers || [];
check('Sitting members exist on initial game', sitting.length > 500, `got ${sitting.length}`);

// Advance 1 cycle (+2 years)
const advancedGame = Engine.ensureAndAdvancePoliticianAges(initGame, 2);
const advSitting = advancedGame.sittingMembers || [];
let allHaveBirthYear = true;
let derivedAgeMatches = true;

const advYear = Number(initGame.year || 2028) + 2;
advSitting.forEach((m) => {
  if (typeof m.birthYear !== 'number') allHaveBirthYear = false;
  const derivedAge = advYear - m.birthYear;
  if (m.age !== derivedAge) {
    derivedAgeMatches = false;
  }
});
check('Every sitting member has numerical birthYear persisted', allHaveBirthYear);
check('Derived age (year - birthYear) matches m.age exactly across advancement', derivedAgeMatches);

// Simulate save / load serialization
const serialized = JSON.stringify(advancedGame);
const restored = JSON.parse(serialized);
const restoredSitting = restored.sittingMembers || [];
let saveLoadIntact = true;
restoredSitting.forEach((m) => {
  if (typeof m.birthYear !== 'number' || m.age !== (advYear - m.birthYear)) {
    saveLoadIntact = false;
  }
});
check('Birth-year persistence holds across full JSON save/load cycle', saveLoadIntact);

// --- CHECK 2: Career-Longevity Tracking & Retirement Monotonicity ---
console.log('\n--- CHECK 2: Longevity & Retirement Likelihood ---');
let allHaveLongevity = true;
advSitting.forEach((m) => {
  if (typeof m.careerLongevity !== 'number') allHaveLongevity = false;
});
check('Every politician tracks numerical careerLongevity', allHaveLongevity);

// Retirement odds test inside 78-83 band:
// Construct two synthetic politicians at age 80: one with 2 years longevity, one with 25 years longevity
const mockGame = {
  year: 2030,
  sittingMembers: [
    { id: 'pol-short', name: 'Short Career Pol', age: 78, birthYear: 1950, careerLongevity: 2, office: 'house' },
    { id: 'pol-long', name: 'Long Career Pol', age: 78, birthYear: 1950, careerLongevity: 30, office: 'house' },
  ],
  politicians: [],
};

// Across 100 simulated seeds/years, verify long career retires at least as often as short career
let shortRetirements = 0;
let longRetirements = 0;
for (let y = 2030; y < 2130; y += 2) {
  const gTest = { ...mockGame, year: y };
  const resAdv = Engine.ensureAndAdvancePoliticianAges(gTest, 2);
  const remainingIds = (resAdv.sittingMembers || []).map((m) => m.id);
  if (!remainingIds.includes('pol-short')) shortRetirements++;
  if (!remainingIds.includes('pol-long')) longRetirements++;
}
check('Longevity monotonicity: veteran politicians (30 yrs) retire >= short-career politicians (2 yrs)',
  longRetirements >= shortRetirements,
  `long=${longRetirements}, short=${shortRetirements}`);

// Strict age floor: No politician under 78 ever retires from aging
const under78Game = {
  year: 2028,
  sittingMembers: [
    { id: 'pol-young', name: 'Young Pol', age: 65, birthYear: 1963, careerLongevity: 40, office: 'senate' },
    { id: 'pol-mid', name: 'Mid Pol', age: 74, birthYear: 1954, careerLongevity: 45, office: 'senate' },
  ],
  politicians: [],
};
const under78Adv = Engine.ensureAndAdvancePoliticianAges(under78Game, 2);
check('Strict age floor: zero retirements occur below age 78 even with 40+ years longevity',
  under78Adv.sittingMembers.length === 2);

// --- CHECK 3: Trait Age Gates (Rising Star < 60) ---
console.log('\n--- CHECK 3: Trait Age Gates ---');
// Fresh politicians under 60 can have Rising Star
const mockFreshCandidateYoung = Engine.generateFreshPoliticianForSeat
  ? Engine.generateFreshPoliticianForSeat({ office: 'house', stateId: 'PA', year: 2028, seed: 100 })
  : null;
check('Fresh candidate generated carries birthYear and careerLongevity',
  mockFreshCandidateYoung && typeof mockFreshCandidateYoung.birthYear === 'number' && typeof mockFreshCandidateYoung.careerLongevity === 'number');

// Aging test: Politician with 'Rising Star' aging past 60 has trait retired/converted
const risingStarPol = {
  id: 'pol-star',
  name: 'Aging Star',
  age: 58,
  birthYear: 1970,
  careerLongevity: 8,
  traits: ['Rising Star', 'Polished'],
  office: 'house',
};
const starGame = {
  year: 2028,
  sittingMembers: [],
  politicians: [risingStarPol],
};
const starAgedTo60 = Engine.ensureAndAdvancePoliticianAges(starGame, 2); // 58 -> 60
const agedPol = starAgedTo60.politicians[0];
check('Politician aging to 60 cleanly retires Rising Star trait',
  !agedPol.traits.includes('Rising Star'),
  `traits=${JSON.stringify(agedPol.traits)}`);
check('Rising Star converted cleanly to Established Politician or pruned without error',
  agedPol.traits.includes('Established Politician') || agedPol.traits.includes('Polished'));

// --- CHECK 4: Full Regression against Baseline test-v0169-fixes.cjs Aging Checks ---
console.log('\n--- CHECK 4: Baseline Aging Regression (Fix #10) ---');
let baseGame = Engine.createGame({ baseTemplateId: 'people' });
const initialAges = (baseGame.sittingMembers || []).map((m) => m.age);
const initialAvg = initialAges.reduce((a, b) => a + b, 0) / initialAges.length;

let cur = baseGame;
for (let c = 0; c < 6; c++) {
  cur = Engine.ensureAndAdvancePoliticianAges(cur, 2);
}
const finalAges = (cur.sittingMembers || []).map((m) => m.age);
const finalAvg = finalAges.reduce((a, b) => a + b, 0) / finalAges.length;
check('Aging +12 years over 6 cycles retains expected average advancement and stable roster',
  finalAvg > initialAvg && cur.sittingMembers.length > 500,
  `initAvg=${initialAvg.toFixed(1)}, finalAvg=${finalAvg.toFixed(1)}, members=${cur.sittingMembers.length}`);

console.log('\n====================================================================');
console.log(` REQ-291 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log('====================================================================\n');

if (failed > 0) process.exit(1);
