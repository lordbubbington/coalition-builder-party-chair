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
console.log(' VERSION 0.17.0 REQ-297 FACTION COHESION METRIC TEST SUITE');
console.log('====================================================================\n');

const ctx = boot();
const Engine = ctx.PartyChairEngine;
const Data = ctx.PartyChairData;

// --- CHECK 1: Catalog Sweep for Cohesion Attribute ---
console.log('--- CHECK 1: Catalog Sweep ---');
const catalog = Data.FACTIONS_CATALOG || [];
check('All 37 catalog factions loaded', catalog.length === 37, `got ${catalog.length}`);

let allHaveCohesion = true;
let inBounds = true;
catalog.forEach((f) => {
  if (typeof f.cohesion !== 'number') allHaveCohesion = false;
  if (f.cohesion < 0.1 || f.cohesion > 1.0) inBounds = false;
});
check('Every catalog faction carries numerical cohesion', allHaveCohesion);
check('All cohesion values within [0.1, 1.0] design band', inBounds);

// Extremist factions must have maximum doctrinal cohesion (>= 0.90)
const extremistIds = ['lib_ancaps', 'con_christian_dominionists', 'soc_socialists', 'soc_communists', 'unaff_groypers', 'unaff_the_klan'];
const allExtremistsHigh = extremistIds.every((id) => {
  const f = catalog.find((x) => x.id === id);
  return f && f.cohesion >= 0.90;
});
check('All 6 extremist factions have doctrinal cohesion >= 0.90', allExtremistsHigh);

// Centrist big-tent factions have lower cohesion (<= 0.45)
const centristIds = ['swg_true_centrists', 'swg_grillers', 'swg_podcast_bros', 'dem_neo_liberals', 'gop_suburban_moderates'];
const allCentristsLow = centristIds.every((id) => {
  const f = catalog.find((x) => x.id === id);
  return f && f.cohesion <= 0.45;
});
check('Centrist/big-tent factions have flexible cohesion <= 0.45', allCentristsLow);

// --- CHECK 2: Era #16 Robot Factions Dedicated Cohesion ---
console.log('\n--- CHECK 2: Era #16 Robot Factions Cohesion ---');
const PSE = ctx.PartySystemsEngine;
const PSD = ctx.PartySystemsData;
let g16 = Engine.createGame({ baseTemplateId: 'people' });
g16 = PSE.transitionToPartySystem(g16, PSD.ALL_ERAS_BY_ID['era_16_robots_citizens'], 2044);
const rFactions = (g16.factions || []).filter((f) => String(f.partyId || '').startsWith('robot_'));
check('Era #16 has 8 dedicated robot factions', rFactions.length === 8);

let robotsHaveCohesion = true;
rFactions.forEach((rf) => {
  if (typeof rf.cohesion !== 'number' || rf.cohesion < 0.1 || rf.cohesion > 1.0) {
    robotsHaveCohesion = false;
  }
});
check('All 8 robot factions carry valid numerical cohesion without Democratic fallback', robotsHaveCohesion);

const protoPurists = rFactions.find((rf) => rf.id === 'synth_protocol_purists');
const civicAssim = rFactions.find((rf) => rf.id === 'synth_civic_assimilationists');
check('Synth Protocol Purists (0.95) cohesion > Synth Civic Assimilationists (0.35)',
  protoPurists && civicAssim && protoPurists.cohesion > civicAssim.cohesion,
  `purists=${protoPurists?.cohesion}, assim=${civicAssim?.cohesion}`);

// --- CHECK 3: Candidate Platform Deviation Tolerance Scaling ---
console.log('\n--- CHECK 3: Platform Deviation Tolerance Scaling ---');
// High-cohesion faction candidates tolerate less fuzz/deviation from their national doctrine
const highCohesionF = catalog.find((f) => f.id === 'soc_socialists'); // 0.95
const lowCohesionF = catalog.find((f) => f.id === 'swg_true_centrists'); // 0.30

const highCohesionWeight = Data.getFactionCohesion(highCohesionF);
const lowCohesionWeight = Data.getFactionCohesion(lowCohesionF);
check('High cohesion weight (0.95) strictly greater than low cohesion weight (0.30)',
  highCohesionWeight > lowCohesionWeight,
  `high=${highCohesionWeight}, low=${lowCohesionWeight}`);

// Candidate deviation fuzz tolerance: (1 - cohesion)
const highTolerance = 1 - highCohesionWeight;
const lowTolerance = 1 - lowCohesionWeight;
check('High-cohesion candidates have tighter deviation tolerance than big-tent candidates',
  highTolerance < lowTolerance,
  `highTolerance=${highTolerance.toFixed(2)}, lowTolerance=${lowTolerance.toFixed(2)}`);

// --- CHECK 4: Qualitative Dossier Labels (Rule 7 Compliance) ---
console.log('\n--- CHECK 4: Rule 7 Qualitative Labels ---');
const highLabel = Data.getFactionCohesionLabel(0.95);
const medHighLabel = Data.getFactionCohesionLabel(0.75);
const medLabel = Data.getFactionCohesionLabel(0.55);
const flexibleLabel = Data.getFactionCohesionLabel(0.40);
const looseLabel = Data.getFactionCohesionLabel(0.25);

check('High cohesion (0.95) produces "Ironclad Doctrinal Bloc"', highLabel === 'Ironclad Doctrinal Bloc');
check('Disciplined caucus (0.75) produces "Disciplined Ideological Caucus"', medHighLabel === 'Disciplined Ideological Caucus');
check('Principled (0.55) produces "Principled Coalition"', medLabel === 'Principled Coalition');
check('Flexible (0.40) produces "Flexible Big-Tent Wing"', flexibleLabel === 'Flexible Big-Tent Wing');
check('Loose (0.25) produces "Sprawling, Easygoing Coalition"', looseLabel === 'Sprawling, Easygoing Coalition');

// Rule 7 & Rule 4 verification: labels contain zero math, percentages, or REQ IDs
const allLabels = [highLabel, medHighLabel, medLabel, flexibleLabel, looseLabel];
const zeroMathLeaks = allLabels.every((l) => !/\d+%|\d+\.\d+|REQ-\d+/i.test(l));
check('All dossier labels are strictly qualitative cable-news narrative with zero math or REQ leaks', zeroMathLeaks);

console.log('\n====================================================================');
console.log(` REQ-297 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log('====================================================================\n');

if (failed > 0) process.exit(1);
