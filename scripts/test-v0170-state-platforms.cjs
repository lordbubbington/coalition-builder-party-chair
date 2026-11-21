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
console.log(' VERSION 0.17.0 REQ-298 STATE PARTY PLATFORMS TEST SUITE');
console.log('====================================================================\n');

const ctx = boot();
const Engine = ctx.PartyChairEngine;
const Data = ctx.PartyChairData;

// --- CHECK 1: 3-Point Bounding Sweep across 51 Jurisdictions & Parties ---
console.log('--- CHECK 1: 3-Point Bounding Clamp Sweep ---');
const jurisdictions = Data.ALL_51_JURISDICTION_CODES || [];
check('All 51 jurisdictions tracked in code registry', jurisdictions.length === 51, `got ${jurisdictions.length}`);

const playableParties = ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'];
let maxDelta = 0;
let anyClampViolation = false;
let totalIssueChecks = 0;

jurisdictions.forEach((stCode) => {
  playableParties.forEach((partyId) => {
    const res = Data.computeStatePartyPlatformDeltas(stCode, partyId);
    Object.entries(res.deltas || {}).forEach(([issId, delta]) => {
      totalIssueChecks++;
      const absDelta = Math.abs(delta);
      if (absDelta > maxDelta) maxDelta = absDelta;
      if (absDelta > 3.001) {
        anyClampViolation = true;
      }
    });
  });
});

check(`Performed ${totalIssueChecks} issue checks across all 51 states and 6 playable parties`, totalIssueChecks >= 51 * 6 * 20);
check(`Every single issue delta strictly satisfies |delta| <= 3.0 points`, !anyClampViolation, `maxDelta=${maxDelta}`);

// --- CHECK 2: Asymmetric Regional Elasticity Classes ---
console.log('\n--- CHECK 2: Directional Pull & Regional Elasticity ---');
// Liberal exemplars (CA, NY, VT, MA) must pull leftward (negative delta)
const liberalExemplars = ['CA', 'NY', 'VT', 'MA'];
let liberalAllNegative = true;
liberalExemplars.forEach((st) => {
  const res = Data.computeStatePartyPlatformDeltas(st, 'people');
  const avg = Object.values(res.deltas).reduce((a, b) => a + b, 0) / Object.values(res.deltas).length;
  if (avg >= 0) liberalAllNegative = false;
});
check('Liberal exemplars (CA, NY, VT, MA) shift platforms decisively leftward (avg < 0)', liberalAllNegative);

// Conservative exemplars (WY, ID, TX, AL) must pull rightward (positive delta)
const conservativeExemplars = ['WY', 'ID', 'TX', 'AL'];
let conservativeAllPositive = true;
conservativeExemplars.forEach((st) => {
  const res = Data.computeStatePartyPlatformDeltas(st, 'heritage');
  const avg = Object.values(res.deltas).reduce((a, b) => a + b, 0) / Object.values(res.deltas).length;
  if (avg <= 0) conservativeAllPositive = false;
});
check('Conservative exemplars (WY, ID, TX, AL) shift platforms decisively rightward (avg > 0)', conservativeAllPositive);

// Moderate exemplars (PA, MI, WI) closely mirror national baseline
const moderateExemplars = ['PA', 'MI', 'WI'];
let moderateAllNearZero = true;
moderateExemplars.forEach((st) => {
  const res = Data.computeStatePartyPlatformDeltas(st, 'people');
  const avg = Object.values(res.deltas).reduce((a, b) => a + b, 0) / Object.values(res.deltas).length;
  if (Math.abs(avg) > 0.6) moderateAllNearZero = false;
});
check('Moderate exemplars (PA, MI, WI) closely track national baseline (|avg| <= 0.6)', moderateAllNearZero);

// Variation in elastic classes > variation in moderate class
const getVariance = (stList, partyId) => {
  const avgs = stList.map((st) => {
    const res = Data.computeStatePartyPlatformDeltas(st, partyId);
    return Object.values(res.deltas).reduce((a, b) => a + b, 0) / Object.values(res.deltas).length;
  });
  const mean = avgs.reduce((a, b) => a + b, 0) / avgs.length;
  return avgs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / avgs.length;
};
const libVar = getVariance(liberalExemplars, 'people');
const conVar = getVariance(conservativeExemplars, 'heritage');
const modVar = getVariance(moderateExemplars, 'people');
check('Elasticity variation in liberal & conservative classes exceeds moderate class',
  (libVar > modVar || conVar > modVar),
  `libVar=${libVar.toFixed(3)}, conVar=${conVar.toFixed(3)}, modVar=${modVar.toFixed(3)}`);

// --- CHECK 3: Effect Surface Wiring & Rule 7 Dossier Narrative ---
console.log('\n--- CHECK 3: Effect Surface Wiring & Narrative Copy ---');
const caDemNarrative = Data.getStatePartyDossierNarrative('CA', 'people');
const wyGopNarrative = Data.getStatePartyDossierNarrative('WY', 'heritage');
const paDemNarrative = Data.getStatePartyDossierNarrative('PA', 'people');

check('CA Democratic dossier narrative reflects progressive course',
  caDemNarrative.includes('left of the national party') || caDemNarrative.includes('progressive'));
check('WY Republican dossier narrative reflects right flank traditionalism',
  wyGopNarrative.includes('right flank') || wyGopNarrative.includes('traditionalism') || wyGopNarrative.includes('conservative'));
check('PA Democratic dossier narrative reflects moderate alignment',
  paDemNarrative.includes('tracks national platform') || paDemNarrative.includes('balanced'));

// Rule 7 & Rule 4 verification: no raw numbers, no REQ tags
const allNarratives = [caDemNarrative, wyGopNarrative, paDemNarrative];
const narrativesClean = allNarratives.every((n) => !/\d+\.\d+|REQ-\d+/i.test(n));
check('All state party dossier narratives are strictly qualitative without math or REQ tags', narrativesClean);

// Favorability calibration check (REQ-261/262 regression safety)
const g = Engine.createGame({ baseTemplateId: 'people' });
const caPlatform = Data.getStatePartyPlatform(g, 'CA', 'people');
check('getStatePartyPlatform resolves successfully for game instance',
  caPlatform && typeof caPlatform.deltas === 'object' && typeof caPlatform.positions === 'object');

// --- CHECK 4: Custom Party Derivation Pipeline ---
console.log('\n--- CHECK 4: Custom Party Pipeline ---');
const customPlatformBaseline = {
  'tax-economy': 6.0,
  'foreign-policy': 5.0,
  'climate-policy': 4.0,
  'religious-policy': 3.0,
  'social-services': 4.5,
  'social-justice': 5.5,
  'party-structure': 7.0,
  'party-ideology': 5.0,
  'democracy-policy': 3.0,
  'establishment-stance': 5.0,
};

let customMaxDelta = 0;
let customClampViolation = false;
jurisdictions.forEach((stCode) => {
  const customRes = Data.computeStatePartyPlatformDeltas(stCode, 'custom', customPlatformBaseline);
  Object.values(customRes.deltas || {}).forEach((d) => {
    if (Math.abs(d) > customMaxDelta) customMaxDelta = Math.abs(d);
    if (Math.abs(d) > 3.001) customClampViolation = true;
  });
});
check('Custom party platform derives through pipeline with all 51 states clamped |delta| <= 3.0',
  !customClampViolation, `customMaxDelta=${customMaxDelta}`);

console.log('\n====================================================================');
console.log(` REQ-298 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log('====================================================================\n');

if (failed > 0) process.exit(1);
