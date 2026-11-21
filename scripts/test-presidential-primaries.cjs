'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function boot() {
  const storage = {};
  const ctx = vm.createContext({
    window: {}, console, Math, Date, JSON, Number, String, Boolean, Array, Object, Set, Map, RegExp, Error, Promise,
    Uint8Array, atob: (s) => Buffer.from(s, 'base64').toString('binary'), btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob, DecompressionStream, Response, setTimeout, clearTimeout, setInterval, clearInterval,
    localStorage: { getItem: (k) => storage[k] ?? null, setItem: (k, v) => { storage[k] = String(v); }, removeItem: (k) => { delete storage[k]; } },
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
  if (cond) { passed++; console.log(`  PASS: ${label}${detail ? ` (${detail})` : ''}`); }
  else { failed++; console.error(`  FAIL: ${label}${detail ? ` (${detail})` : ''}`); }
}

(async () => {
  console.log('====================================================================');
  console.log(' VERSION 0.16.8 PRESIDENTIAL PRIMARY & EQUILIBRIUM VERIFICATION SUITE');
  console.log('====================================================================');

  const ctx = boot();
  const E = ctx.window.PartyChairEngine;
  const D = ctx.window.PartyChairData;

  // --- CHECK 1: 1 Candidate Per Faction, 50/30/20 Fame Weighting & Dynamic Spawner ---
  console.log('\n--- CHECK 1: 1 Candidate/Faction, 50/30/20 Fame Weighting & Spawner ---');
  const gDem = E.createGame({ baseTemplateId: 'people' });
  check('Game version stamped as 0.16.9, 0.17.0, or 0.17.1', ['0.16.9', '0.17.0', '0.17.1'].includes(gDem.version), `got ${gDem.version}`);

  const demField = E.generatePrimaryField(gDem, 'people');
  const gopField = E.generatePrimaryField(gDem, 'heritage');
  const demFactionsCount = E.getFactionsCatalog().filter((f) => f.partyId === 'people').length;
  const gopFactionsCount = E.getFactionsCatalog().filter((f) => f.partyId === 'heritage').length;
  check('Exactly 1 candidate per Democratic faction with unique colors',
    demField.length === demFactionsCount && new Set(demField.map((c) => c.factionId)).size === demFactionsCount && new Set(demField.map((c) => c.color)).size === demField.length,
    `count=${demField.length}`);
  check('Exactly 1 candidate per Republican faction with unique colors',
    gopField.length === gopFactionsCount && new Set(gopField.map((c) => c.factionId)).size === gopFactionsCount,
    `count=${gopField.length}`);

  // Monte Carlo check of 50/30/20 fame weighting on a faction with 3 politicians
  let gMC = E.createGame({ baseTemplateId: 'people' });
  const testFac = E.getFactionsCatalog().find((f) => f.partyId === 'people');
  gMC.sittingMembers = [
    { id: 'f1', name: 'Top Fame', factionId: testFac.id, party: 'people', fame: 95, quality: 8 },
    { id: 'f2', name: 'Second Fame', factionId: testFac.id, party: 'people', fame: 80, quality: 7 },
    { id: 'f3', name: 'Third Fame', factionId: testFac.id, party: 'people', fame: 65, quality: 6 },
    { id: 'f0', name: 'Former Pres', factionId: testFac.id, party: 'people', fame: 100, quality: 9, isFormerPresident: true },
  ];
  gMC.politicians = [];
  const hits = { f1: 0, f2: 0, f3: 0, f0: 0 };
  for (let i = 0; i < 100; i++) {
    gMC.politicians = [];
    const rVal = i / 100;
    const fld = E.generatePrimaryField(gMC, 'people', () => rVal);
    const c = fld.find((x) => x.factionId === testFac.id);
    if (c && hits[c.id] !== undefined) hits[c.id]++;
  }
  check('Former presidents excluded (0 picks)', hits.f0 === 0, `f0=${hits.f0}`);
  check('50/30/20 fame probability distribution holds accurately',
    hits.f1 === 50 && hits.f2 === 30 && hits.f3 === 20,
    `f1=${hits.f1}/100 (50%), f2=${hits.f2}/100 (30%), f3=${hits.f3}/100 (20%)`);

  // Dynamic spawner for unrepresented faction (0 sitting politicians)
  let gSpawn = E.createGame({ baseTemplateId: 'green' });
  gSpawn.sittingMembers = [];
  gSpawn.politicians = [];
  const grnField = E.generatePrimaryField(gSpawn, 'green');
  check('Unrepresented Green factions spawn office:null candidates at 50% baseline & register in politicians/factionLeaders',
    grnField.length === 2 &&
    grnField.every((c) => c.office === null && c.isGenerated && c.startsAtHalfBaseline) &&
    grnField.every((c) => gSpawn.politicians.some((p) => p.id === c.id) && gSpawn.factionLeaders?.[c.factionId] === c.id));

  // --- CHECK 2: Uneven Partition Randomization Maintains Exact 100% Sum ---
  console.log('\n--- CHECK 2: Uneven Partition Randomization Formula (100% Exact) ---');
  const baseShares = { c1: 35, c2: 25, c3: 18, c4: 12, c5: 6, c6: 4 };
  let allSum100 = true;
  for (let i = 0; i < 200; i++) {
    const out15 = E.applyRandomizationPartition(baseShares, 15);
    const out10 = E.applyRandomizationPartition(baseShares, 10);
    const s15 = Object.values(out15).reduce((a, b) => a + b, 0);
    const s10 = Object.values(out10).reduce((a, b) => a + b, 0);
    if (Math.abs(s15 - 100) > 0.02 || Math.abs(s10 - 100) > 0.02) allSum100 = false;
  }
  check('Uneven partition randomization sums strictly to 100% across 400 trials (15% & 10%)', allSum100);

  // --- CHECK 3: DNC 15% Threshold & RNC WTA / Triggered WTM Delegate Math ---
  console.log('\n--- CHECK 3: DNC 15% & RNC WTA / Triggered WTM Delegate Allocation ---');
  const dncCA = E.allocatePrimaryStateDelegates('people', 'CA', { a: 45, b: 35, c: 12, d: 8 });
  check('DNC CA (424 pledged): sub-15% candidates get 0 delegates & sum === 424',
    dncCA.delegates.c === 0 && dncCA.delegates.d === 0 && (dncCA.delegates.a + dncCA.delegates.b) === 424,
    JSON.stringify(dncCA.delegates));

  const rncFL = E.allocatePrimaryStateDelegates('heritage', 'FL', { a: 42, b: 38, c: 20 });
  check('RNC FL (125 WTA): plurality winner takes all 125 delegates',
    rncFL.delegates.a === 125 && rncFL.delegates.b === 0 && rncFL.delegates.c === 0,
    JSON.stringify(rncFL.delegates));

  const rncTXTrig = E.allocatePrimaryStateDelegates('heritage', 'TX', { a: 52, b: 30, c: 18 });
  const rncTXProp = E.allocatePrimaryStateDelegates('heritage', 'TX', { a: 44, b: 36, c: 15, d: 5 });
  check('RNC TX (151 Triggered WTM): >=50% takes all 151; <50% allocates proportionally (>=20% threshold)',
    rncTXTrig.delegates.a === 151 && rncTXProp.delegates.c === 0 && rncTXProp.delegates.d === 0 && (rncTXProp.delegates.a + rncTXProp.delegates.b) === 151,
    `prop=${JSON.stringify(rncTXProp.delegates)}`);

  // --- CHECK 4 & 5: Neutrality (+5%), Filtering (-2 Happiness / -3 Trust) & Losing Major Faction -2 Confidence ---
  console.log('\n--- CHECK 4 & 5: Neutrality Reward, Filtering Penalties & -2 Confidence ---');
  // 4A. Filtering support on Debate Day 1
  let gFilt = E.startPresidentialPrimary(E.createGame({ baseTemplateId: 'people' }));
  gFilt = E.advancePrimaryCalendar(gFilt); // order -> debates (Day 1)
  const beforeTrust = gFilt.trust.supporters;
  const targetCand = gFilt.activePresidentialPrimary.candidates[0];
  const rivalTop5 = gFilt.activePresidentialPrimary.candidates.filter((c) => c.id !== targetCand.id).sort((a, b) => b.nationalPoll - a.nationalPoll).slice(0, 5);
  const beforeRivalH = Object.fromEntries(rivalTop5.map((c) => [c.factionId, gFilt.factionHappiness[c.factionId] ?? 50]));
  gFilt = E.filterPrimarySupport(gFilt, targetCand.id);
  const afterTarget = gFilt.activePresidentialPrimary.candidates.find((c) => c.id === targetCand.id);
  const allRivalsDropped = rivalTop5.every((c) => (gFilt.factionHappiness[c.factionId] ?? 50) < beforeRivalH[c.factionId]);
  check('Filtering Debate Day grants +5% national lift, deducts -3 Base Trust, and penalizes top-5 rival factions',
    afterTarget.debateLift === 5 && gFilt.trust.supporters === beforeTrust - 3 && allRivalsDropped,
    `trust ${beforeTrust}->${gFilt.trust.supporters}`);

  // 4B & 5. Full neutral primary run -> +5% Happiness to all party factions & -2 Confidence to losing major factions
  let gNeut = E.startPresidentialPrimary(E.createGame({ baseTemplateId: 'people' }));
  const demFacs = E.getFactionsCatalog().filter((f) => f.partyId === 'people');
  const beforeNeutH = Object.fromEntries(demFacs.map((f) => [f.id, gNeut.factionHappiness[f.id] ?? 50]));
  const beforeConf = Object.fromEntries(demFacs.map((f) => [f.id, gNeut.factionConfidence?.[f.id] ?? f.confidence ?? 60]));
  let guard = 0;
  while (gNeut.activePresidentialPrimary.stage !== 'complete' && guard < 40) {
    gNeut = E.advancePrimaryCalendar(gNeut);
    guard++;
  }
  const pDone = gNeut.activePresidentialPrimary;
  const allGainedH = demFacs.every((f) => (gNeut.factionHappiness[f.id] ?? 50) > beforeNeutH[f.id]);
  const losingMajors = demFacs.filter((f) => f.status === 'major' && f.id !== pDone.candidates.find((c) => c.id === pDone.nomineeId)?.factionId);
  const allLosingMajorsLostConf = losingMajors.every((f) => (gNeut.factionConfidence?.[f.id] ?? 60) === beforeConf[f.id] - 2);
  check('Full neutral primary completes, awards +5% Happiness to all party factions & archives in simulatedPrimaries[2028]',
    pDone.stage === 'complete' && pDone.neutralityBonusAwarded === true && allGainedH && Boolean(gNeut.simulatedPrimaries?.[2028]?.people));
  check('Losing major factions lose exact -2 Confidence upon primary conclusion',
    losingMajors.length > 0 && allLosingMajorsLostConf, `losingMajors=${losingMajors.length}`);

  // --- CHECK 6: Issue #6 Options A/B/C 15-Cycle Equilibrium Stability ---
  console.log('\n--- CHECK 6: Issue #6 Options A/B/C 15-Cycle Happiness Equilibrium ---');
  let gEq = E.createGame({ baseTemplateId: 'people' });
  for (let c = 1; c <= 15; c++) {
    gEq.phase = 'campaign';
    gEq = (gEq.year % 4 === 0) ? E.holdElection(gEq) : E.holdMidterm(gEq);
    gEq.phase = 'complete';
    gEq = E.startNextCycle(gEq);
  }
  const vals = E.getFactionsCatalog().map((f) => Number(gEq.factionHappiness[f.id] ?? 50));
  const at100 = vals.filter((v) => v >= 99).length;
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  check('After 15 cycles, 0 factions pin at 100 and lowest factions unfreeze above 20',
    at100 === 0 && minVal > 20 && maxVal < 95, `range=[${minVal.toFixed(1)}..${maxVal.toFixed(1)}], at100=${at100}`);

  
console.log('\n--- CHECK 7: v0.16.9 Critical/High/Med/Low Fixes ---');
const dncPledgedSum = Object.values(vm.runInContext('DNC_MASTER_DELEGATES_2028', ctx)).reduce((a, b) => a + b.pledged, 0);
const rncTotalSum = Object.values(vm.runInContext('RNC_MASTER_DELEGATES_2028', ctx)).reduce((a, b) => a + b.total, 0);
check(`DNC pledged delegate master sum === 3934 (got ${dncPledgedSum})`, dncPledgedSum === 3934);
check(`RNC total delegate master sum === 2429 (got ${rncTotalSum})`, rncTotalSum === 2429);

const pfParty = (D.PARTY_ARCHETYPES || []).find(p => p.id === 'socialist');
check(`Socialist party renamed to Peace and Freedom Party (got ${pfParty && pfParty.name})`, !!(pfParty && pfParty.name === 'Peace and Freedom Party'));

let gFinish = E.createGame({ baseTemplateId: 'people' });
gFinish = E.takeAction(gFinish, 'start-presidential-primary');
let guardC7 = 0;
while (gFinish.activePresidentialPrimary && gFinish.activePresidentialPrimary.stage !== 'complete' && guardC7 < 120) {
  gFinish = E.takeAction(gFinish, 'advance-primary-day');
  guardC7++;
}
gFinish = E.takeAction(gFinish, 'finish-presidential-primary');
check(`finish-presidential-primary enters campaign phase cleanly (phase=${gFinish.phase}, primariesResolved=${gFinish.primariesResolved}, days=${guardC7})`,
  gFinish.phase === 'campaign' && gFinish.primariesResolved === true && gFinish.prioritiesLocked === true && guardC7 > 5);

let gConst = E.createGame({ baseTemplateId: 'constitution' });
gConst = E.takeAction(gConst, 'start-presidential-primary');
const constCands = (gConst.activePresidentialPrimary && gConst.activePresidentialPrimary.candidates) || [];
const constWrongParty = constCands.filter(c => {
  const pol = (gConst.politicians || []).find(p => p.id === c.politicianId);
  return pol && pol.party && pol.party !== 'constitution';
});
check(`1-faction Constitution party spawns 2 same-faction candidates (got ${constCands.length})`, constCands.length === 2);
check(`Constitution primary has 0 wrong-party nominees (got ${constWrongParty.length})`, constWrongParty.length === 0);

let gPF = E.createGame({ baseTemplateId: 'socialist' });
gPF = E.takeAction(gPF, 'start-presidential-primary');
const pfCands = (gPF.activePresidentialPrimary && gPF.activePresidentialPrimary.candidates) || [];
const pfWrongParty = pfCands.filter(c => {
  const pol = (gPF.politicians || []).find(p => p.id === c.politicianId);
  return pol && pol.party && pol.party !== 'socialist';
});
check(`Peace & Freedom primary has 0 wrong-party nominees (got ${pfWrongParty.length})`, pfWrongParty.length === 0);

console.log('\n====================================================================');
  console.log(` V0.16.8 PRESIDENTIAL PRIMARY SUITE: ${passed} passed, ${failed} failed`);
  console.log('====================================================================');
  if (failed > 0) process.exit(1);
})();
