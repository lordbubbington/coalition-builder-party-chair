'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');
const sandbox = {
  console, Math, Date, JSON, Set, Map, Array, Object, Number, String, Boolean, RegExp, Error, TypeError,
  parseInt, parseFloat, isNaN, isFinite, Uint8Array, TextDecoder,
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: { querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, setAttribute: () => {} }), head: { appendChild: () => {} }, getElementById: () => null, addEventListener: () => {} },
};
sandbox.window = sandbox;
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.self = sandbox;

const ctx = vm.createContext(sandbox);
const loadOrder = [
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'state-house-data-0.5.js',
  'voter-model-0.5.js', 'demographic-migration-data.js', 'demographics-0.9.js',
  'political-trends-system.js', 'political-texture-system.js', 'v07-scaffolding.js',
  'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js', 'party-systems-engine.js',
  'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js', 'election-drift.js',
  'election-night-engine.js', 'media-shocks-system.js', 'campaign-overhaul.js', 'campaign-events-system.js',
  'redistricting-ballot-system.js', 'coalition-politics-system.js', 'atlas-multiplayer-system.js',
  'leading-faction-system.js', 'faction-era-stability.js', 'v0185-playtest-fixes.js',
  'save-migrations.js', 'persistence-core.js', 'custom-party-core.js', 'faction-core.js',
  'procedural-faction-naming.js', 'faction-caucus-system.js', 'dynamic-faction-lifecycle.js',
  'identity-bloc-system.js', 'faction-caucus-ui.js', 'engine.js',
];
for (const file of loadOrder) {
  const fullPath = path.join(repoDir, file);
  if (fs.existsSync(fullPath)) vm.runInContext(fs.readFileSync(fullPath, 'utf8'), ctx, { filename: file });
}

const E = sandbox.PartyChairEngine;
const V07 = sandbox.PartyChairV07;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS [${passed}]: ${name}`);
}

// 1. Focus Slots 1 / 3 / 4 / 5 / 6 / 7
test('Stage 2 #1: Focus slots map cleanly to 1/3/4/5/6/7 across Tiers 0-5', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  const expected = { 0: 1, 1: 3, 2: 4, 3: 5, 4: 6, 5: 7 };
  for (const [t, slots] of Object.entries(expected)) {
    g.partyTiers = { ...g.partyTiers, green: Number(t) };
    assert.strictEqual(E.getMaxFocusSlots(g, 'player'), slots, `Tier ${t} expected ${slots} focus slots`);
  }
});

// 2. Reworked Tier 0-5 Promotion Thresholds (including split Tier 3->4 paths)
test('Stage 2 #2: Reworked Tier promotion thresholds (Tier 0->1, 1->2, 2->3, split 3->4, 4->5)', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.elections = [{ type: 'presidential', nationalVote: { people: 48, heritage: 47, green: 2.5 } }];
  assert.strictEqual(V07.computePartyInstitutionalTierRaw(g, 'player'), 2, '2.5% Pres vote -> Tier 2');

  g.elections = [{ type: 'presidential', nationalVote: { people: 48, heritage: 45, green: 5.0 } }];
  assert.strictEqual(V07.computePartyInstitutionalTierRaw(g, 'player'), 3, '5.0% Pres vote -> Tier 3');

  // Tier 3->4 Path B: >= 10 combined Senate + Governorships (even with 0% Pres vote)
  g.elections = [{ type: 'presidential', nationalVote: { people: 49, heritage: 49, green: 1.0 } }];
  g.governorships = { VT: 'green', ME: 'green', NH: 'green', OR: 'green', WA: 'green', CA: 'green', CO: 'green', MN: 'green', NM: 'green', NY: 'green' };
  assert.strictEqual(V07.computePartyInstitutionalTierRaw(g, 'player'), 4, '10 Governorships -> Tier 4 via Path B');

  // Tier 3->4 Path A: >= 50 House AND >= 5 Sen+Gov
  g.governorships = { VT: 'green', ME: 'green', NH: 'green', OR: 'green', WA: 'green' };
  g.seats = 50;
  assert.strictEqual(V07.computePartyInstitutionalTierRaw(g, 'player'), 4, '50 House + 5 Govs -> Tier 4 via Path A');

  // Tier 4->5: >= 20% Pres vote
  g.elections = [{ type: 'presidential', nationalVote: { people: 40, heritage: 39, green: 20.5 } }];
  assert.strictEqual(V07.computePartyInstitutionalTierRaw(g, 'player'), 5, '20.5% Pres vote -> Tier 5');
});

// 3. Tier 0/1 Faction Recruitment & Politician Courting Lock; Unlocks at Tier 2
test('Stage 2 #3: Faction recruitment & politician courting locked for Tiers 0-1, unlocked at Tier 2', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.partyTiers.green = 1;
  const indF = g.factions.find((f) => f.partyId === 'independent');
  const eligT1 = E.checkSummitEligibility(g, indF.id);
  assert.strictEqual(eligT1.eligible, false, 'Tier 1 blocked from faction recruitment');
  assert(eligT1.reason.includes('Tier 2'), `Expected Tier 2 message, got: ${eligT1.reason}`);
});

// 4. Tier 3 On/Off State Spoiler Removal + Tier 4 Halves Duverger Everywhere
test('Stage 2 #4: Tier 3 removes spoiler in states with federal/gov office (on/off), Tier 4 halves everywhere', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.partyTiers.green = 3;
  // Initially no office in PA -> has spoiler
  const before = E.computeStrategicVotingDefection(g, 'green', 'PA', 'presidential', 8.0);
  assert(before.defectionRate > 0, 'Tier 3 without office in PA still has spoiler');
  // Grant PA Governorship -> 0% spoiler (on)
  g.governorships.PA = 'green';
  const withGov = E.computeStrategicVotingDefection(g, 'green', 'PA', 'presidential', 8.0);
  assert.strictEqual(withGov.defectionRate, 0, 'Tier 3 with PA Governorship gets 0% spoiler');
  // Lose PA Governorship -> spoiler returns (off)
  g.governorships.PA = 'people';
  const afterLoss = E.computeStrategicVotingDefection(g, 'green', 'PA', 'presidential', 8.0);
  assert(afterLoss.defectionRate > 0, 'Losing PA office turns spoiler back on');
});

// 5. Tier 3 Regional Chapter Momentum (Exact VT 20% -> NY 1%->3%, MA 9%->10%, NH 15%->15% check!)
test('Stage 2 #5: Regional Chapter Momentum adds +2% to neighbors >= 10 pts behind (VT=20% -> NY+2%, MA+1%, NH+0%)', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.partyTiers.green = 3;
  const setPct = (stId, greenPct) => {
    const st = g.voterModel.states.find((s) => (s.stateId || s.id) === stId);
    const tot = 1000000;
    st.affiliations = { people: Math.round(tot * (0.50 - greenPct / 200)), heritage: Math.round(tot * (0.40 - greenPct / 200)), independent: Math.round(tot * 0.10), green: Math.round(tot * (greenPct / 100)), liberty: 0, constitution: 0, socialist: 0, other: 0 };
  };
  setPct('VT', 20);
  setPct('NY', 1);
  setPct('MA', 9);
  setPct('NH', 15);

  const res = E.applyRegionalChapterMomentum(g);
  const getPct = (stId) => {
    const aff = res.voterModel.states.find((s) => (s.stateId || s.id) === stId).affiliations;
    const tot = ['people', 'heritage', 'independent', 'green', 'liberty', 'constitution', 'socialist', 'other'].reduce((s, k) => s + Number(aff[k] || 0), 0);
    return (aff.green / tot) * 100;
  };
  assert(Math.abs(getPct('NY') - 3.0) < 0.1, `Expected NY ~3.0%, got ${getPct('NY').toFixed(2)}%`);
  assert(Math.abs(getPct('MA') - 10.0) < 0.1, `Expected MA ~10.0%, got ${getPct('MA').toFixed(2)}%`);
  assert(Math.abs(getPct('NH') - 15.0) < 0.1, `Expected NH ~15.0%, got ${getPct('NH').toFixed(2)}%`);
});

// 6. Starting State Legislative Slates by Tier + Seat-Control Bonus Slates (ignoring cap)
test('Stage 2 #6: Starting statehouse slates (0/10/40/100/250/All) + seat-control bonus slates bypass cap', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  const sumSlates = (m) => Object.values(m).reduce((s, v) => s + Number(v || 0), 0);
  const maxSlate = (m) => Math.max(0, ...Object.values(m).map(Number));

  const t0 = E.generateStartingStateLegSlates(g, 'green', 0);
  assert.strictEqual(sumSlates(t0.houseSlates), 0, 'Tier 0 gets 0 starting slates');

  const t1 = E.generateStartingStateLegSlates(g, 'green', 1);
  assert.strictEqual(sumSlates(t1.houseSlates), 10, 'Tier 1 gets 10 starting slates');
  assert.strictEqual(maxSlate(t1.houseSlates), 1, 'Tier 1 cap is max 1 slate/state');

  const t2 = E.generateStartingStateLegSlates(g, 'green', 2);
  assert.strictEqual(sumSlates(t2.houseSlates), 40, 'Tier 2 gets 40 starting slates');
  assert(maxSlate(t2.houseSlates) <= 2, 'Tier 2 cap is max 2 slates/state');

  const t3 = E.generateStartingStateLegSlates(g, 'green', 3);
  assert.strictEqual(sumSlates(t3.houseSlates), 100, 'Tier 3 gets 100 starting slates');
  assert(maxSlate(t3.houseSlates) <= 3, 'Tier 3 cap is max 3 slates/state');

  // Seat-Control Bonus: Majority in VT -> free full slate (5) ignoring Tier 1 cap of 1!
  g.stateHouseSeatCounts.VT = { total: 150, green: 80, people: 50, heritage: 20 };
  const t1WithMaj = E.generateStartingStateLegSlates(g, 'green', 1);
  assert.strictEqual(t1WithMaj.houseSlates.VT, 5, 'Majority in VT grants free full 5-slate ignoring Tier 1 cap');
});

// 7. Confidence & Supply Bargaining: Largest Party (even 3rd party) offers deals with Tier 1-3 legitimization tax
test('Stage 2 #7: Largest 3rd party can offer Confidence & Supply deals with Tier 1-3 legitimization tax', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.partyTiers.green = 2;
  const hung = E.detectHungChambers(g, { green: 190, people: 145, heritage: 100 }, {}, null);
  const houseNeg = hung.negotiations.find((n) => n.chamber === 'house');
  assert(houseNeg, 'Hung House negotiation triggered when Green is largest party (190 seats)');
  assert.strictEqual(houseNeg.role, 'plurality_leader_offer', 'Role is plurality_leader_offer');
  assert.strictEqual(houseNeg.minorPartyLegitimizationTax, true, 'Tier 2 minor party pays legitimization tax');
  assert(houseNeg.requiredConcessions >= 3, 'Tier 1-3 minor party must offer heavier concessions');
});

// 8. Tier-Up Modal & Unpopular Major-Nominee Multipliers
test('Stage 2 #8: Tier-Up modal payload & Unpopular Major-Nominee double multipliers work cleanly', () => {
  const modal = E.buildTierUpModalPayload(1, 2, 2032);
  assert.strictEqual(modal.newTier, 2, 'Modal tracks newTier');
  assert.strictEqual(modal.focusSlots, 4, 'Tier 2 modal shows 4 focus slots');
  assert(modal.perks.length >= 3, 'Modal lists newly unlocked perks');

  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.partyTiers.green = 1;
  g.presidentialTicket = { people: 'Unpopular Dem', heritage: 'Unpopular Rep' };
  g.partyApprovals = { people: { approval: 35 }, heritage: { approval: 36 } }; // both <= -10 net
  const mults = E.getMajorNomineeUnpopularityMultipliers(g, 'player');
  assert.strictEqual(mults.persuasionMult, 2.0, 'Tier 1 gets 2x persuasion when both major nominees <= -10 net');
  assert.strictEqual(mults.registrationMult, 2.0, 'Tier 1 gets 2x registration when both major nominees <= -10 net');
});

console.log(`\nALL ${passed}/8 STAGE 2 TESTS PASSED!`);
