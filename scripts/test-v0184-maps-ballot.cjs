/**
 * v0.18.4 Unit & Integration Test Suite:
 * Proposal #2 (State-Level Redistricting & Gerrymandering War Room)
 * Proposal #7 (Ballot Initiatives & Down-Ballot Coattail Engineering)
 */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

const sandbox = {
  window: {},
  document: {
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  console,
  Math,
  JSON,
  Number,
  Object,
  Array,
  String,
  Infinity,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Date,
  Set,
  Map,
  Uint8Array,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  Blob: global.Blob,
  DecompressionStream: global.DecompressionStream,
  Response: global.Response,
  localStorage: mockLocalStorage,
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

function loadScript(filePath) {
  const code = fs.readFileSync(path.resolve(root, filePath), 'utf8');
  vm.runInContext(code, ctx);
}

loadScript('data.js');
loadScript('factions-0.15.js');
loadScript('scenario-2028.js');
loadScript('issues-0.2.1.js');
loadScript('maps-0.3.js');
loadScript('state-house-data-0.5.js');
loadScript('voter-model-0.5.js');
loadScript('demographics-0.9.js');
loadScript('political-trends-system.js');
loadScript('political-texture-system.js');
loadScript('v07-scaffolding.js');
loadScript('party-systems-data.js');
loadScript('party-systems-coalition.js');
loadScript('party-systems-robots.js');
loadScript('party-systems-engine.js');
loadScript('campaign-overhaul.js');
loadScript('redistricting-ballot-system.js');
loadScript('engine.js');

async function runTests() {
  if (sandbox.PartyChairData.VERSION_03_MAPS_READY) {
    await sandbox.PartyChairData.VERSION_03_MAPS_READY;
  }

  const Engine = sandbox.PartyChairEngine;
  const RBS = sandbox.RedistrictingBallotSystem;
  assert(RBS, 'window.RedistrictingBallotSystem must be exposed');

  console.log('=== TEST SUITE: v0.18.4 MAPS & BALLOT (PROPOSALS #2 & #7) ===\n');

  // Test 1: Zero Math.random() & Node module.exports check
  const srcText = fs.readFileSync(path.resolve(root, 'redistricting-ballot-system.js'), 'utf8');
  assert(!srcText.includes('Math.random('), 'redistricting-ballot-system.js must never call Math.random()');
  const nodeMod = require(path.resolve(root, 'redistricting-ballot-system.js'));
  assert.strictEqual(typeof nodeMod.commitDecadeMap, 'function', 'module.exports exposes RedistrictingBallotSystem');
  assert.strictEqual(RBS.seededUnit('test-seed-1'), RBS.seededUnit('test-seed-1'), 'seededUnit must be deterministic');
  console.log('  PASS 1: Deterministic seeded hashing & Node module.exports verified');

  // Test 2: Backward-compatible save normalization
  let game = Engine.createGame({ baseTemplateId: 'people' });
  const legacySave = JSON.parse(JSON.stringify(game));
  delete legacySave.redistrictingWarRoom;
  delete legacySave.activeBallotInitiatives;
  delete legacySave.passedStateInitiatives;
  delete legacySave.redistrictingCommissions;
  const restored = Engine.normalizeGame(legacySave);
  assert(restored.redistrictingWarRoom && restored.redistrictingWarRoom.active === false, 'normalizeGame initializes redistrictingWarRoom');
  assert(Array.isArray(restored.activeBallotInitiatives), 'normalizeGame initializes activeBallotInitiatives');
  assert(restored.passedStateInitiatives && typeof restored.passedStateInitiatives === 'object', 'normalizeGame initializes passedStateInitiatives');
  assert.strictEqual(restored.redistrictingCommissions.CA, true, 'normalizeGame initializes default independent commissions');
  console.log('  PASS 2: Backward-compatible save normalization verified');

  // Test 3: Proposal #7 — Ballot Initiative Sponsorship, EV Cost Scaling, 26-State Eligibility & 3-Per-Cycle Cap
  assert(RBS.BALLOT_INITIATIVE_ARCHETYPES.length >= 10 && RBS.BALLOT_INITIATIVE_ARCHETYPES.length <= 12, '10-12 reusable ballot archetypes');
  assert.strictEqual(RBS.INITIATIVE_ELIGIBLE_STATES.length, 26, '26 real-world initiative states configured');
  assert.strictEqual(RBS.isInitiativeEligibleState(restored, 'TX'), false, 'TX is not an initiative state');
  assert.strictEqual(RBS.isInitiativeEligibleState(restored, 'OH'), true, 'OH is an initiative state');
  assert.strictEqual(RBS.getBallotInitiativeCost(restored, 'AK'), 3, 'Small EV state costs $3M');
  assert.strictEqual(RBS.getBallotInitiativeCost(restored, 'CA'), 6, 'Large EV state costs $6M');

  let bGame = { ...restored, year: 2028, treasury: 30, actionsLeft: 4, organizingActionsRemaining: 10 };
  // Non-initiative state blocked
  const blockedTx = Engine.takeAction(bGame, 'sponsor-ballot-initiative', { stateId: 'TX', archetypeId: 'min_wage_hike' });
  assert.strictEqual(blockedTx.activeBallotInitiatives.length, 0, 'Non-initiative state TX must be blocked');

  // Sponsor 3 valid initiatives (1 Turnout Driver + 2 Structural Reforms)
  bGame = Engine.takeAction(bGame, 'sponsor-ballot-initiative', { stateId: 'AZ', archetypeId: 'reproductive_rights' });
  assert.strictEqual(bGame.activeBallotInitiatives.length, 1, '1st initiative sponsored in AZ');
  assert(bGame.activeBallotInitiatives[0].wedgeApplied === true, 'Turnout driver applies wedge penalty to rival');
  assert(RBS.getBallotAndRedistrictingStateLift(bGame, 'AZ') > 0, 'Active ballot initiative produces positive state lift for sponsor');

  bGame = Engine.takeAction(bGame, 'sponsor-ballot-initiative', { stateId: 'OH', archetypeId: 'independent_redistricting' });
  bGame = Engine.takeAction(bGame, 'sponsor-ballot-initiative', { stateId: 'NV', archetypeId: 'ranked_choice_voting' });
  assert.strictEqual(bGame.activeBallotInitiatives.length, 3, '3 active initiatives allowed');

  // 4th initiative blocked by 3-per-cycle cap
  const capped = Engine.takeAction(bGame, 'sponsor-ballot-initiative', { stateId: 'MI', archetypeId: 'min_wage_hike' });
  assert.strictEqual(capped.activeBallotInitiatives.length, 3, 'Max 3 active ballot initiatives per cycle enforced');
  console.log('  PASS 3: Ballot initiative sponsorship, EV cost scaling, wedge effects & 3-per-cycle cap verified');

  // Test 4: SOEE Rival AI Counter-Funding (-$2M for -3% margin) & Wedge Sponsorship
  const beforeOppTreasury = Number(bGame.parties.heritage.treasury);
  bGame = RBS.runRivalBallotInitiativeAI(bGame, 'organizing');
  const azInit = bGame.activeBallotInitiatives.find((i) => i.stateId === 'AZ' && i.archetypeId === 'reproductive_rights');
  assert.strictEqual(azInit.counterFundingMarginDelta, -3, 'Rival counter-funding reduces YES margin by -3%');
  assert(azInit.counterFundedBy.includes('heritage'), 'Heritage recorded as counter-funder');
  assert(Number(bGame.parties.heritage.treasury) <= beforeOppTreasury - 2, 'Rival treasury deducted for counter-funding');
  const rivalSponsored = bGame.activeBallotInitiatives.filter((i) => i.sponsorPartyId === 'heritage');
  assert(rivalSponsored.length >= 1, 'Rival AI sponsors a wedge initiative in organizing phase');
  console.log('  PASS 4: SOEE rival counter-funding (-$2M / -3%) & wedge sponsorship verified');

  // Test 5: Election Night Ballot Initiative Resolution & Persistent Structural Reforms
  // Force favorable environment so OH IRC and NV RCV pass (>50%)
  bGame.nationalEnvironment = 12;
  bGame = RBS.resolveElectionNightBallotInitiatives(bGame);
  assert(bGame.lastBallotInitiativeResults.length >= 3, 'Election Night ballot results recorded');
  const ohRes = bGame.lastBallotInitiativeResults.find((r) => r.stateId === 'OH' && r.archetypeId === 'independent_redistricting');
  const nvRes = bGame.lastBallotInitiativeResults.find((r) => r.stateId === 'NV' && r.archetypeId === 'ranked_choice_voting');
  assert(ohRes && ohRes.passed === true, `OH IRC expected to pass (got ${ohRes?.yesPct}%)`);
  assert(nvRes && nvRes.passed === true, `NV RCV expected to pass (got ${nvRes?.yesPct}%)`);
  assert.strictEqual(bGame.redistrictingCommissions.OH, true, 'OH Independent Redistricting Commission permanently saved');
  assert.strictEqual(bGame.stateElectoralSystems.NV.allRaces, 'rcv', 'NV Ranked Choice Voting permanently saved in stateElectoralSystems');

  // Verify persistence across cycle transition + normalizeGame reload
  let nextCyc = RBS.advanceCycleRedistrictingAndBallot(bGame, 2030);
  nextCyc = Engine.normalizeGame(JSON.parse(JSON.stringify(nextCyc)));
  assert.strictEqual(nextCyc.activeBallotInitiatives.length, 0, 'Expired cycle initiatives cleared on new cycle');
  assert.strictEqual(nextCyc.redistrictingCommissions.OH, true, 'OH IRC persists across cycles & reload');
  assert.strictEqual(nextCyc.stateElectoralSystems.NV.allRaces, 'rcv', 'NV RCV persists across cycles & reload');
  console.log('  PASS 5: Election Night resolution & cross-cycle reform persistence verified');

  // Test 6: Proposal #2 — Decennial Redistricting War Room (2030)
  let rGame = { ...nextCyc, year: 2030, treasury: 25, actionsLeft: 4 };
  // Give player a trifecta in IL and PA, split control in WI, rival trifecta in TX
  rGame.governorships = { ...rGame.governorships, IL: 'people', PA: 'people', WI: 'people', TX: 'heritage' };
  rGame.stateLegislatures = {
    ...rGame.stateLegislatures,
    IL: ['people', 'people'],
    PA: ['people', 'people'],
    WI: ['heritage', 'heritage'],
    TX: ['heritage', 'heritage'],
  };
  rGame = Engine.runDecennialRedistricting(rGame, 2030);

  assert.strictEqual(rGame.redistrictingWarRoom.active, true, 'Decennial War Room activates on year % 10 === 0');
  const caEntry = rGame.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'CA');
  const ohEntry = rGame.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'OH');
  const ilEntry = rGame.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'IL');
  const paEntry = rGame.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'PA');
  const wiEntry = rGame.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'WI');
  const txEntry = rGame.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'TX');

  assert.strictEqual(caEntry.controlType, 'commission', 'CA is an Independent Commission state');
  assert.strictEqual(caEntry.selectedStrategy, 'fair_compact', 'CA defaults to fair_compact');
  assert.strictEqual(ohEntry.controlType, 'commission', 'OH (reformed via Proposal #7) is now an Independent Commission state');
  assert.strictEqual(ilEntry.controlType, 'player_trifecta', 'IL is a player trifecta');
  assert.strictEqual(paEntry.controlType, 'player_trifecta', 'PA is a player trifecta');
  assert.strictEqual(wiEntry.controlType, 'split', 'WI is a split-control state');
  assert.strictEqual(wiEntry.selectedStrategy, 'incumbent_protection', 'Split-control state defaults to incumbent_protection');
  assert.strictEqual(txEntry.controlType, 'rival_trifecta', 'TX is a rival trifecta');
  assert(['fair_compact', 'incumbent_protection', 'aggressive_gerrymander'].includes(txEntry.selectedStrategy), 'Rival AI selected valid strategy for TX');
  console.log('  PASS 6: Decennial War Room state classification (Commission, Trifecta, Split, Rival AI) verified');

  // Test 7: Strategy selection, dummymander warning, Commit Decade Map, & 435-seat 1:1 parity
  const preTrust = rGame.trust.independents;
  const prePaSittingHap = rGame.sittingMembers.find((m) => m.office === 'house' && (m.stateId === 'PA' || m.state === 'PA'))?.happiness ?? 68;
  rGame = Engine.takeAction(rGame, 'select-redistricting-strategy', { stateId: 'IL', strategy: 'aggressive_gerrymander' });
  rGame = Engine.takeAction(rGame, 'select-redistricting-strategy', { stateId: 'PA', strategy: 'incumbent_protection' });
  rGame = Engine.takeAction(rGame, 'select-redistricting-strategy', { stateId: 'WI', strategy: 'special_master' });

  // Verify dummymander warning helper triggers when a district is stretched into (0, +4.5)
  const dummyCheck = RBS.computeStateStrategyProjection(
    [
      { id: 'XX-1', stateId: 'XX', district: 1, lean: -15 },
      { id: 'XX-2', stateId: 'XX', district: 2, lean: -2.0 },
      { id: 'XX-3', stateId: 'XX', district: 3, lean: -1.5 },
    ],
    'aggressive_gerrymander',
    'people',
    rGame
  );
  assert.strictEqual(dummyCheck.dummymanderWarning, true, 'Dummymander warning triggers when majority stretched < +4.5 lean');

  const preTreasury = rGame.treasury;
  rGame = Engine.takeAction(rGame, 'commit-decade-map', {});
  assert.strictEqual(rGame.redistrictingWarRoom.active, false, 'War Room closes after commit');
  assert(rGame.treasury < preTreasury, 'Committing strategies deducts treasury');
  assert(rGame.redistrictingBacklash.IL && rGame.redistrictingBacklash.IL.turnoutBonus === 10, 'Aggressive gerrymander triggers +10 opposition grassroots turnout backlash');
  assert(rGame.redistrictingWarRoom.pendingChallenges.some((c) => c.stateId === 'IL' && c.resolveYear === 2032), 'Aggressive gerrymander queues 35% court challenge for year + 2');

  const postPaSittingHap = rGame.sittingMembers.find((m) => m.office === 'house' && (m.stateId === 'PA' || m.state === 'PA'))?.happiness;
  assert(postPaSittingHap >= Math.min(100, prePaSittingHap + 4) - 0.1, 'incumbent_protection boosts sitting member happiness by +4 in state');

  // Strict 435-seat 1:1 parity check
  assert.strictEqual(rGame.currentHouseMap.districts.length, 435, 'currentHouseMap.districts has 435 entries');
  assert.strictEqual(rGame.currentHouseMap.modelDistricts.length, 435, 'currentHouseMap.modelDistricts has 435 entries');
  assert.strictEqual(rGame.representatives.length, 435, 'representatives has exactly 435 entries');
  const houseSitting = rGame.sittingMembers.filter((m) => m && m.office === 'house');
  assert.strictEqual(houseSitting.length, 435, 'sittingMembers (house) has exactly 435 entries');
  const repIds = new Set(rGame.representatives.map((r) => r.districtId));
  const sitIds = new Set(houseSitting.map((m) => m.districtId));
  assert.strictEqual(repIds.size, 435, '435 unique representative districtIds');
  assert.strictEqual(sitIds.size, 435, '435 unique sittingMember house districtIds');
  for (const id of repIds) assert(sitIds.has(id), `1:1 parity missing ${id}`);
  console.log('  PASS 7: Commit Decade Map, dummymander warning, trust/happiness effects & exact 435-seat 1:1 parity verified');

  // Test 8: Court Strike-Down Resolution at year + 2 (2032)
  // Find a deterministic seed where IL challenge triggers strike-down (< 0.35)
  let struckSeed = rGame.seed || 2028;
  for (let s = 1; s <= 50; s++) {
    if (RBS.seededUnit(`court-challenge:${s}:2030:IL`) < 0.35) {
      struckSeed = s;
      break;
    }
  }
  const ilBeforeStrike = rGame.currentHouseMap.modelDistricts.filter((d) => d.stateId === 'IL').map((d) => ({ id: d.id, lean: d.lean, base: d.baselineLean }));
  const trustBeforeStrike = rGame.trust.independents;
  const struckGame = RBS.resolvePendingCourtChallenges({ ...rGame, seed: struckSeed }, 2032);
  const ilChallenge = struckGame.redistrictingWarRoom.pendingChallenges.find((c) => c.stateId === 'IL');
  assert.strictEqual(ilChallenge.resolved, true, 'IL court challenge resolved at 2032');
  assert.strictEqual(ilChallenge.struckDown, true, 'IL gerrymander struck down by court');
  assert.strictEqual(struckGame.trust.independents, Math.max(0, trustBeforeStrike - 4), 'Court strike-down applies -4 Independents Trust');
  assert.strictEqual(struckGame.redistrictingStateApprovalPenalties.IL, -5, 'Court strike-down applies -5 state approval penalty');
  const ilAfterStrike = struckGame.currentHouseMap.modelDistricts.filter((d) => d.stateId === 'IL');
  ilAfterStrike.forEach((d) => {
    const prev = ilBeforeStrike.find((x) => x.id === d.id);
    assert.strictEqual(d.lean, prev.base, `Struck-down district ${d.id} reverted to fair_compact baseline lean`);
  });
  console.log('  PASS 8: Court strike-down resolution at year+2 reverts map to baseline with -4 Ind Trust & -5 State Approval');

  // Test 9: UI HTML Builders (0 NaN / 0 undefined)
  const cardHtml = RBS.renderBallotInitiativeActionCard(bGame, { disabled: false, selectedState: 'AZ' });
  const stripHtml = RBS.renderBallotMeasuresStrip(bGame);
  const modalHtml = RBS.renderRedistrictingWarRoomModal({ ...rGame, redistrictingWarRoom: { ...rGame.redistrictingWarRoom, active: true } });
  for (const [label, html] of [['BallotCard', cardHtml], ['BallotStrip', stripHtml], ['WarRoomModal', modalHtml]]) {
    assert(html.length > 100, `${label} rendered non-empty HTML`);
    assert(!/\bNaN\b/.test(html), `${label} contains no NaN`);
    assert(!/\bundefined\b/.test(html), `${label} contains no undefined`);
  }
  console.log('  PASS 9: UI HTML builders render cleanly with 0 NaN and 0 undefined');

  console.log('\nALL 9/9 v0.18.4 MAPS & BALLOT TESTS PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
