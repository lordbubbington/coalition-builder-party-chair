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
console.log(' VERSION 0.17.0 REQ-287 REGISTRATION PATTERNS TEST SUITE');
console.log('====================================================================\n');

const ctx = boot();
const Engine = ctx.PartyChairEngine;
const Data = ctx.PartyChairData;

// --- CHECK 1: Archetype Lift Ordering Matches Relevance Maps ---
console.log('--- CHECK 1: Archetype Lift Ordering ---');
const urbanLiftNY = Data.calculateFactionRegistrationLift('dem_capital_l_left', 'NY');
const urbanLiftWY = Data.calculateFactionRegistrationLift('dem_capital_l_left', 'WY');
const urbanLiftMI = Data.calculateFactionRegistrationLift('dem_capital_l_left', 'MI');
check('Urban archetype has highest lift in NY vs WY and MI',
  urbanLiftNY > urbanLiftWY && urbanLiftNY > urbanLiftMI,
  `NY=${urbanLiftNY}, WY=${urbanLiftWY}, MI=${urbanLiftMI}`);

const frontierLiftWY = Data.calculateFactionRegistrationLift('lib_true_libertarians', 'WY');
const frontierLiftNY = Data.calculateFactionRegistrationLift('lib_true_libertarians', 'NY');
const frontierLiftMI = Data.calculateFactionRegistrationLift('lib_true_libertarians', 'MI');
check('High-elasticity frontier archetype has highest lift in WY vs NY and MI',
  frontierLiftWY > frontierLiftNY && frontierLiftWY > frontierLiftMI,
  `WY=${frontierLiftWY}, NY=${frontierLiftNY}, MI=${frontierLiftMI}`);

const laborLiftMI = Data.calculateFactionRegistrationLift('swg_hard_hats', 'MI');
const laborLiftWY = Data.calculateFactionRegistrationLift('swg_hard_hats', 'WY');
const laborLiftNY = Data.calculateFactionRegistrationLift('swg_hard_hats', 'NY');
check('Labor stronghold archetype has highest lift in MI vs WY and NY',
  laborLiftMI > laborLiftWY && laborLiftMI >= laborLiftNY,
  `MI=${laborLiftMI}, WY=${laborLiftWY}, NY=${laborLiftNY}`);

// Multi-state sample distribution check
const testGame = Engine.createGame({ baseTemplateId: 'people' });
testGame.treasury = 50;
const sampleStates = ['NY', 'WY', 'MI'];
const shapedDriveRes = Engine.executeRegistrationDrive(testGame, {
  drivingFactionId: 'dem_capital_l_left',
  states: sampleStates,
});
const deltas = shapedDriveRes.stateVoterDeltas || {};
const nyGain = deltas.NY?.people || 0;
const wyGain = deltas.WY?.people || 0;
const miGain = deltas.MI?.people || 0;
check('Shaped drive across sample states allocates most voters to urban bastion (NY) for urban archetype',
  nyGain > wyGain && nyGain > miGain,
  `NY=${nyGain}, WY=${wyGain}, MI=${miGain}`);

// --- CHECK 2: Tier Matrix Cost/Yield Invariance (REQ-277 Regression) ---
console.log('\n--- CHECK 2: Tier Matrix Invariance ---');
const expectedMatrix = {
  0: { cost: 0, yield: 100 },
  1: { cost: 1, yield: 1000 },
  2: { cost: 2, yield: 2000 },
  3: { cost: 3, yield: 3000 },
  4: { cost: 4, yield: 5000 },
  5: { cost: 5, yield: 10000 },
};
let matrixIntact = true;
for (let t = 0; t <= 5; t++) {
  const spec = Engine.getRegistrationTierSpec(t);
  if (spec.cost !== expectedMatrix[t].cost || spec.yield !== expectedMatrix[t].yield) {
    matrixIntact = false;
  }
}
check('REQ-277 Tier cost/yield matrix strictly unchanged', matrixIntact);

// --- CHECK 3: 155,000,000 Voter Conservation & Per-State Zero Variance ---
console.log('\n--- CHECK 3: Zero-Variance 155M Conservation ---');
const totalVoters = (shapedDriveRes.voterModel?.states || []).reduce((acc, st) => acc + Number(st.representedVoters || 0), 0);
check('155,000,000 voter scale conserved bit-for-bit after shaped drive', totalVoters === 155000000, `got ${totalVoters}`);

let perStateConservation = true;
(shapedDriveRes.voterModel?.states || []).forEach((st) => {
  const affSum = Number(st.affiliations?.people || 0) +
                 Number(st.affiliations?.heritage || 0) +
                 Number(st.affiliations?.independent || 0) +
                 Number(st.affiliations?.thirdParty ?? (
                   Number(st.affiliations?.liberty || 0) + Number(st.affiliations?.green || 0) + Number(st.affiliations?.other || 0)
                 ));
  if (affSum !== Number(st.sampleVoters || 0)) {
    perStateConservation = false;
  }
});
check('Per-state zero variance holds across all affiliations ledgers', perStateConservation);

const natFactionsSum = Data.FACTIONS_CATALOG.reduce((s, f) => s + Number(shapedDriveRes.voterModel?.factions?.[f.id] || 0), 0);
check('National faction ledgers sum strictly to 155,000,000', natFactionsSum === 155000000, `got ${natFactionsSum}`);

// --- CHECK 4: Era #16 Robot Factions Use Dedicated Archetypes (No Dem Fallback) ---
console.log('\n--- CHECK 4: Era #16 Robot Faction Integrity ---');
const PSE = ctx.PartySystemsEngine;
const PSD = ctx.PartySystemsData;
let g16 = Engine.createGame({ baseTemplateId: 'people' });
g16 = PSE.transitionToPartySystem(g16, PSD.ALL_ERAS_BY_ID['era_16_robots_citizens'], 2044);
const rFactions = (g16.factions || []).filter((f) => String(f.partyId || '').startsWith('robot_'));
const computeMax = rFactions.find((f) => f.id === 'synth_compute_maximalists');
const chassisLab = rFactions.find((f) => f.id === 'synth_chassis_labor');

check('Synth Compute Maximalists has dedicated urban_campus archetype & growthProfile',
  computeMax && computeMax.growthProfile?.archetype === 'urban_campus' && Array.isArray(computeMax.growthProfile.regionalRelevance));
check('Synth Chassis Labor has dedicated labor_stronghold archetype & growthProfile',
  chassisLab && chassisLab.growthProfile?.archetype === 'labor_stronghold' && Array.isArray(chassisLab.growthProfile.regionalRelevance));

const rLiftCA = Data.calculateFactionRegistrationLift(computeMax, 'CA');
const rLiftWY = Data.calculateFactionRegistrationLift(computeMax, 'WY');
check('Robot compute maximalists get high lift in CA vs WY without Democratic fallback',
  rLiftCA > rLiftWY, `CA=${rLiftCA}, WY=${rLiftWY}`);

console.log('\n====================================================================');
console.log(` REQ-287 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log('====================================================================\n');

if (failed > 0) process.exit(1);
