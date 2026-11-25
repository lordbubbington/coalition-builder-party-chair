'use strict';

const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Boot browser-like sandbox (matches existing repo test suites)
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

const LOAD_ORDER = [
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
  'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographic-migration-data.js',
  'demographics-0.9.js', 'political-trends-system.js', 'v07-scaffolding.js',
  'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js',
  'party-systems-engine.js', 'ballot-access.js', 'election-uncertainty.js',
  'candidate-vetting.js', 'election-drift.js', 'election-night-engine.js',
  'media-shocks-system.js', 'campaign-overhaul.js', 'off-cycle-interlude.js', 'engine.js',
];

for (const f of LOAD_ORDER) {
  require(path.join(ROOT, f));
}

const Eng = window.PartyChairEngine;
const OCI = window.OffCycleInterludeSystem;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

function assertNoNaN(obj, label, strictDefined = true) {
  const seen = new Set();
  function walk(val, p) {
    if (typeof val === 'number') {
      assert.ok(Number.isFinite(val), `${label}: non-finite number at ${p}: ${val}`);
      return;
    }
    if (!val || typeof val !== 'object') return;
    if (seen.has(val)) return;
    seen.add(val);
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) walk(val[i], `${p}[${i}]`);
    } else {
      for (const k of Object.keys(val)) {
        if (strictDefined) {
          assert.notStrictEqual(val[k], undefined, `${label}: unexpected undefined at ${p}.${k}`);
        }
        walk(val[k], `${p}.${k}`);
      }
    }
  }
  walk(obj, label);
}

console.log('=== OFF-CYCLE INTERLUDE TURN — PHASE 1 ENGINE & TEST SUITE ===');

// 1. Deterministic 4n+1 (2029) & 4n+3 (2031) Roster Generation + Cabinet/Retirement Special Elections
test('1. 4n+1 (VA/NJ + Cabinet specials) and 4n+3 (KY/LA/MS + retirement special) rosters', () => {
  // 4n+1 with >=52 governing Senators -> 2 federal special elections (House + Senate)
  const gBase = Eng.createGame('people', { seed: 202901 });
  const sitting52 = gBase.sittingMembers.map((m) => ({ ...m }));
  let govCount = 0;
  for (let i = 0; i < sitting52.length && govCount < 53; i++) {
    if (sitting52[i].office === 'senate') {
      sitting52[i].party = 'heritage';
      sitting52[i].caucus = 'heritage';
      govCount += 1;
    }
  }
  const g4n1High = OCI.initializeOffCycleInterlude({ ...gBase, governingParty: 'heritage', sittingMembers: sitting52, phase: 'complete' }, 2029);
  assert.strictEqual(g4n1High.phase, 'off-cycle-interlude');
  assert.strictEqual(g4n1High.year, 2028, 'game.year must remain 2028 until completion');
  assert.strictEqual(g4n1High.offCycle.oddYear, 2029);
  const kinds2029 = g4n1High.offCycle.races.map((r) => `${r.kind}:${r.stateId}`);
  assert.ok(kinds2029.includes('governor:VA'), '2029 includes VA Governor');
  assert.ok(kinds2029.includes('state_leg:VA'), '2029 includes VA State Leg');
  assert.ok(kinds2029.includes('governor:NJ'), '2029 includes NJ Governor');
  assert.ok(kinds2029.includes('state_leg:NJ'), '2029 includes NJ State Leg');
  assert.strictEqual(g4n1High.offCycle.races.filter((r) => r.kind === 'house_special').length, 1, '2029 includes 1 House special');
  assert.strictEqual(g4n1High.offCycle.races.filter((r) => r.kind === 'senate_special').length, 1, '2029 includes Senate special when >=52 WH senators');

  // 4n+1 with <52 governing Senators -> 1 federal special election (House only)
  const sitting48 = gBase.sittingMembers.map((m) => ({ ...m }));
  let hSen = 0;
  for (let i = 0; i < sitting48.length; i++) {
    if (sitting48[i].office === 'senate') {
      const p = hSen < 48 ? 'heritage' : 'people';
      sitting48[i].party = p;
      sitting48[i].caucus = p;
      hSen += 1;
    }
  }
  const g4n1Low = OCI.initializeOffCycleInterlude({ ...gBase, governingParty: 'heritage', sittingMembers: sitting48, phase: 'complete' }, 2029);
  assert.strictEqual(g4n1Low.offCycle.races.filter((r) => r.kind === 'house_special').length, 1);
  assert.strictEqual(g4n1Low.offCycle.races.filter((r) => r.kind === 'senate_special').length, 0, 'No Senate special when WH holds <52 Senate seats');

  // 4n+3 (2031): KY, LA, MS Governors & State Legs + 1 federal vacancy (80% House / 20% Senate)
  const g4n3 = OCI.initializeOffCycleInterlude({ ...gBase, year: 2030, phase: 'complete' }, 2031);
  const kinds2031 = g4n3.offCycle.races.map((r) => `${r.kind}:${r.stateId}`);
  ['KY', 'LA', 'MS'].forEach((st) => {
    assert.ok(kinds2031.includes(`governor:${st}`), `2031 includes ${st} Governor`);
    assert.ok(kinds2031.includes(`state_leg:${st}`), `2031 includes ${st} State Leg`);
  });
  const fed2031 = g4n3.offCycle.races.filter((r) => r.kind === 'house_special' || r.kind === 'senate_special');
  assert.strictEqual(fed2031.length, 1, '2031 generates exactly 1 federal special election');

  // Verify ~80/20 House/Senate distribution across deterministic seeds
  let houseCnt = 0;
  let senateCnt = 0;
  for (let s = 1; s <= 50; s++) {
    const r = OCI.initializeOffCycleInterlude({ ...gBase, seed: 9000 + s, year: 2030, phase: 'complete' }, 2031);
    const sp = r.offCycle.races.find((x) => x.kind === 'house_special' || x.kind === 'senate_special');
    if (sp.kind === 'house_special') houseCnt += 1;
    if (sp.kind === 'senate_special') senateCnt += 1;
  }
  assert.ok(houseCnt > 25 && senateCnt > 2, `Expected ~80/20 House/Senate split across 50 seeds, got House=${houseCnt}, Senate=${senateCnt}`);
});

// 2. Strategic Postures & Action Budget / Cost Bounds
test('2. Strategic Postures enforce exact budgets, -20% discounts, +15% blitz lift, and min-track rules', () => {
  let g = Eng.createGame('people', { seed: 202902 });
  g.treasury = 100;
  g = OCI.initializeOffCycleInterlude({ ...g, phase: 'complete' }, 2029);

  // Party-Building Focus: 5 actions, -20% chapter/media cost, min 1 on party building
  g = Eng.takeAction(g, 'off-cycle-set-posture', { posture: 'party_building' });
  assert.strictEqual(g.offCycle.actionsRemaining, 5);
  assert.strictEqual(OCI.getActionCashCost(g, 'oc-chapter-drive', 'people'), 3.2, 'Chapter drive -20% ($4.0M -> $3.2M)');
  assert.strictEqual(OCI.getActionCashCost(g, 'oc-media-buildout', 'people'), 4.8, 'Media buildout -20% ($6.0M -> $4.8M)');

  // Spend 4 election actions; 5th action must reject election and allow party-building
  const vaGovId = g.offCycle.races.find((r) => r.id.includes('gov-VA')).id;
  const njGovId = g.offCycle.races.find((r) => r.id.includes('gov-NJ')).id;
  g = Eng.takeAction(g, 'off-cycle-ad-blitz', { raceId: vaGovId });
  g = Eng.takeAction(g, 'off-cycle-turnout-surge', { raceId: vaGovId });
  g = Eng.takeAction(g, 'off-cycle-ad-blitz', { raceId: njGovId });
  g = Eng.takeAction(g, 'off-cycle-turnout-surge', { raceId: njGovId });
  assert.strictEqual(g.offCycle.actionsRemaining, 1);
  const rejected = Eng.takeAction(g, 'off-cycle-deploy-surrogate', { raceId: vaGovId });
  assert.strictEqual(rejected.offCycle.actionsRemaining, 1, 'Last action blocked from Track B when minPartyBuilding=1 unmet');
  g = Eng.takeAction(rejected, 'off-cycle-chapter-drive', { stateId: 'VA' });
  assert.strictEqual(g.offCycle.actionsRemaining, 0);

  // Special-Election Blitz: 5 actions, +15% persuasion lift, min 1 on off-cycle races
  let gBlitz = Eng.createGame('people', { seed: 202903 });
  gBlitz.treasury = 100;
  gBlitz = OCI.initializeOffCycleInterlude({ ...gBlitz, phase: 'complete' }, 2029);
  gBlitz = Eng.takeAction(gBlitz, 'off-cycle-set-posture', { posture: 'special_blitz' });
  assert.strictEqual(gBlitz.offCycle.actionsRemaining, 5);
  gBlitz = Eng.takeAction(gBlitz, 'off-cycle-chapter-drive', { stateId: 'VA' });
  gBlitz = Eng.takeAction(gBlitz, 'off-cycle-donor-retreat');
  gBlitz = Eng.takeAction(gBlitz, 'off-cycle-donor-retreat');
  gBlitz = Eng.takeAction(gBlitz, 'off-cycle-faction-mend');
  const blockedParty = Eng.takeAction(gBlitz, 'off-cycle-federal-scout', { stateId: 'PA' });
  assert.strictEqual(blockedParty.offCycle.actionsRemaining, 1, 'Last action blocked from Track A under special_blitz if 0 election actions spent');
  const rIdBlitz = blockedParty.offCycle.races[0].id;
  const afterBlitzAd = Eng.takeAction(blockedParty, 'off-cycle-ad-blitz', { raceId: rIdBlitz });
  assert.strictEqual(afterBlitzAd.offCycle.actionsRemaining, 0);
  const rObj = afterBlitzAd.offCycle.races.find((r) => r.id === rIdBlitz);
  assert.ok(rObj.playerLift > 2.2, `Special-Election Blitz +15% should exceed base 2.2% lift (got ${rObj.playerLift})`);

  // Balanced Split: 4 actions
  let gBal = Eng.createGame('heritage', { seed: 202904 });
  gBal = OCI.initializeOffCycleInterlude({ ...gBal, phase: 'complete' }, 2029);
  gBal = Eng.takeAction(gBal, 'off-cycle-set-posture', { posture: 'balanced' });
  assert.strictEqual(gBal.offCycle.actionsRemaining, 4);
});

// 3. All 9 Actions, Caps, Tier Scaling, Diminishing Returns, Surrogate Fame & 15% Oppo Backfire
test('3. All 9 actions deduct cash/actions accurately, enforce caps, and handle surrogate fame + oppo backfire', () => {
  let g = Eng.createGame('people', { seed: 202905 });
  g.treasury = 80;
  g = OCI.initializeOffCycleInterlude({ ...g, phase: 'complete' }, 2029);
  g = Eng.takeAction(g, 'off-cycle-set-posture', { posture: 'balanced' });

  // Track A: Donor Retreat cap 2x
  const t0 = g.treasury;
  g = Eng.takeAction(g, 'off-cycle-donor-retreat');
  assert.strictEqual(g.treasury, t0 + 18, 'Tier 5 donor retreat grants +$18M');
  g = Eng.takeAction(g, 'off-cycle-donor-retreat');
  assert.strictEqual(g.treasury, t0 + 36);
  const overDonor = Eng.takeAction(g, 'off-cycle-donor-retreat');
  assert.strictEqual(overDonor.treasury, t0 + 36, '3rd donor retreat rejected');
  assert.strictEqual(overDonor.offCycle.actionsRemaining, 2);

  // Track A: Chapter Drive (+2 chapters, +0.4% reg boost), Media Buildout (+3.5), Faction Mend (+8H, -15F), Federal Scout
  const vaChapBefore = g.stateOrganizations.VA.people.chapters;
  const vaRegBefore = g.stateRegistrationBoosts.VA || 0;
  g = Eng.takeAction(g, 'off-cycle-chapter-drive', { stateId: 'VA' });
  assert.strictEqual(g.stateOrganizations.VA.people.chapters, vaChapBefore + 2);
  assert.ok(Math.abs((g.stateRegistrationBoosts.VA || 0) - (vaRegBefore + 0.4)) < 0.01);

  // Use a fresh game for remaining Track A checks
  let gA = Eng.createGame('people', { seed: 202906 });
  gA.treasury = 60;
  gA.factions[0].happiness = 45;
  gA.factions[0].frictionIndex = 68;
  gA.factions[0].ultimatumTurnsRemaining = 1;
  gA = OCI.initializeOffCycleInterlude({ ...gA, phase: 'complete' }, 2029);
  gA = Eng.takeAction(gA, 'off-cycle-media-buildout', { channel: 'broadcast' });
  assert.ok(gA.mediaEcosystem.people.broadcast >= 38.5, 'Broadcast reach increased by +3.5');
  const targetFid = gA.factions.find((f) => f.partyId === 'people').id;
  gA = Eng.takeAction(gA, 'off-cycle-faction-mend', { factionId: targetFid });
  const mended = gA.factions.find((f) => f.id === targetFid);
  assert.strictEqual(mended.frictionIndex, 53, 'Faction friction reduced by 15 (68 -> 53)');
  assert.strictEqual(mended.ultimatumTurnsRemaining, null, 'Ultimatum averted when friction drops below 60');
  const polCountBefore = gA.politicians.length;
  gA = Eng.takeAction(gA, 'off-cycle-federal-scout', { stateId: 'PA' });
  assert.strictEqual(gA.politicians.length, polCountBefore + 1);
  const scout = gA.offCycle.scoutedCandidates[0];
  assert.ok(scout.quality >= 7 && scout.quality <= 9 && scout.fame >= 35 && scout.fame <= 55, 'Scouted candidate meets Q7-9 / Fame 35-55 spec');

  // Unaffordable check: treasury $0.1M rejects paid action cleanly
  const broke = Eng.takeAction({ ...gA, treasury: 0.1 }, 'off-cycle-federal-scout', { stateId: 'OH' });
  assert.strictEqual(broke.treasury, 0.1, 'Unaffordable action must not mutate treasury');
  assert.strictEqual(broke.offCycle.actionsRemaining, gA.offCycle.actionsRemaining);

  // Track B: Ad Blitz diminishing returns & 2-buy cap
  let gB = Eng.createGame('people', { seed: 202907 });
  gB.treasury = 80;
  gB = OCI.initializeOffCycleInterlude({ ...gB, phase: 'complete' }, 2029);
  const raceId = gB.offCycle.races[0].id;
  gB = Eng.takeAction(gB, 'off-cycle-ad-blitz', { raceId });
  const lift1 = gB.offCycle.races[0].playerLift;
  gB = Eng.takeAction(gB, 'off-cycle-ad-blitz', { raceId });
  const lift2Delta = gB.offCycle.races[0].playerLift - lift1;
  assert.ok(lift2Delta > 0 && lift2Delta < lift1 * 0.6, `2nd ad buy must have ~50% diminishing return (1st=${lift1}, 2nd=${lift2Delta})`);
  const overAd = Eng.takeAction(gB, 'off-cycle-ad-blitz', { raceId });
  assert.strictEqual(overAd.offCycle.races[0].adBuys, 2, '3rd ad buy rejected');

  // Track B: Surrogate Fame (+4 on win, -2 on loss >8%)
  let gSurWin = Eng.createGame('people', { seed: 202908 });
  gSurWin = OCI.initializeOffCycleInterlude({ ...gSurWin, phase: 'complete' }, 2029);
  const winRace = gSurWin.offCycle.races.find((r) => r.stateId === 'NJ' && r.kind === 'governor');
  winRace.baselineLean = 22.0; // Guaranteed Dem win
  const surCand = gSurWin.sittingMembers.find((m) => m.party === 'people' && m.fame <= 80);
  const startFame = surCand.fame;
  gSurWin = Eng.takeAction(gSurWin, 'off-cycle-deploy-surrogate', { raceId: winRace.id, politicianId: surCand.id });
  gSurWin = Eng.takeAction(gSurWin, 'off-cycle-resolve');
  const endFame = gSurWin.sittingMembers.find((m) => m.id === surCand.id).fame;
  assert.strictEqual(endFame, Math.min(100, startFame + 4), 'Surrogate gains +4 Fame on win');

  let gSurLoss = Eng.createGame('people', { seed: 202909 });
  gSurLoss = OCI.initializeOffCycleInterlude({ ...gSurLoss, phase: 'complete' }, 2031);
  const lossRace = gSurLoss.offCycle.races.find((r) => r.stateId === 'KY' && r.kind === 'governor');
  lossRace.baselineLean = -28.0; // Loss > 8%
  const surCand2 = gSurLoss.sittingMembers.find((m) => m.party === 'people' && m.fame >= 30);
  const startFame2 = surCand2.fame;
  gSurLoss = Eng.takeAction(gSurLoss, 'off-cycle-deploy-surrogate', { raceId: lossRace.id, politicianId: surCand2.id });
  gSurLoss = Eng.takeAction(gSurLoss, 'off-cycle-resolve');
  const endFame2 = gSurLoss.sittingMembers.find((m) => m.id === surCand2.id).fame;
  assert.strictEqual(endFame2, Math.max(1, startFame2 - 2), 'Surrogate loses -2 Fame on >8% defeat');

  // Track B: Oppo Drop 15% backfire against Clean/Integrity rival
  let backfireSeed = null;
  for (let s = 1; s <= 120; s++) {
    if (OCI.seededUnit(`oc-oppo:${s}:2029:oc-2029-gov-VA`) < 0.15) {
      backfireSeed = s;
      break;
    }
  }
  assert.ok(backfireSeed !== null, 'Found deterministic seed for 15% oppo backfire roll');
  let gOppo = Eng.createGame('people');
  gOppo.seed = backfireSeed;
  gOppo.treasury = 50;
  gOppo = OCI.initializeOffCycleInterlude({ ...gOppo, phase: 'complete' }, 2029);
  const vaRace = gOppo.offCycle.races.find((r) => r.id === 'oc-2029-gov-VA');
  vaRace.candidates.heritage.traits = ['Clean', 'Integrity'];
  gOppo = Eng.takeAction(gOppo, 'off-cycle-oppo-drop', { raceId: vaRace.id });
  assert.strictEqual(gOppo.offCycle.races[0].playerLift, -0.8, '15% backfire turns oppo-drop into -0.8% self-penalty');
});

// 4. Bellwether Clamping [-3.5, +3.5], Sitting-Member Sync (0 Duplicates) & Year+2 Handoff
test('4. Bellwether clamping [-3.5, +3.5], governorships/sittingMembers updates (0 dupes), and advanceYear handoff', () => {
  let g = Eng.createGame('people', { seed: 202910 });
  g = OCI.initializeOffCycleInterlude({ ...g, phase: 'complete' }, 2029);
  // Inject massive lift across all races to verify clamp at +3.5
  g.offCycle.races.forEach((r) => { r.playerLift = 45; });
  g = Eng.takeAction(g, 'off-cycle-resolve');
  assert.strictEqual(g.pendingBellwetherBonus.bellwetherWave, 3.5, 'Bellwether Wave clamped strictly at +3.5');
  assert.ok(g.pendingBellwetherBonus.donorDelta <= 15 && g.pendingBellwetherBonus.trustDelta <= 5);

  // Verify governorships, stateLegislatures, sittingMembers (0 duplicate IDs)
  const vaGovMembers = g.sittingMembers.filter((m) => m.id === 'governor:VA');
  assert.strictEqual(vaGovMembers.length, 1, 'No duplicate governor:VA sittingMembers');
  assert.strictEqual(g.governorships.VA, g.offCycle.races.find((r) => r.id === 'oc-2029-gov-VA').result.winner);
  assert.strictEqual(g.stateLegislatures.VA.length, 2);

  const envBefore = g.nationalEnvironment;
  const scouted = OCI.initializeOffCycleInterlude({ ...Eng.createGame('people', { seed: 202911 }), phase: 'complete' }, 2029);
  const withScout = Eng.takeAction({ ...scouted, treasury: 50 }, 'off-cycle-federal-scout', { stateId: 'PA' });
  const scoutId = withScout.offCycle.scoutedCandidates[0].id;
  const handedOffScout = Eng.takeAction(withScout, 'off-cycle-complete');
  assert.strictEqual(handedOffScout.year, 2030);
  assert.ok(handedOffScout.politicians.some((p) => p.id === scoutId), 'Scouted federal primary recruit survives into 2030 cycle');

  // Verify advanceYear applies pendingBellwetherBonus cleanly and lands in 2030 organizing
  const afterAdvance = Eng.advanceYear(g);
  assert.strictEqual(afterAdvance.year, 2030, 'Hand off strictly to year + 2');
  assert.strictEqual(afterAdvance.phase, 'organizing');
  assert.strictEqual(afterAdvance.pendingBellwetherBonus, null, 'pendingBellwetherBonus cleared after application');
  assert.strictEqual(afterAdvance.offCycle.active, false, 'offCycle.active cleared');
  assert.ok(Math.abs(afterAdvance.lastBellwetherSummary.bellwetherWave - 3.5) < 0.01);
  assert.ok(afterAdvance.nationalEnvironment !== envBefore || afterAdvance.waveMomentum > 0, 'Bellwether bonus shifted 2030 environment/momentum');
  assertNoNaN(afterAdvance, 'afterAdvance-people', false);
  assertNoNaN(afterAdvance.offCycle, 'afterAdvance-offCycle', true);
  assertNoNaN(afterAdvance.lastBellwetherSummary, 'afterAdvance-bellwether', true);

  // Verify negative clamp at -3.5 (with BUG-04 rival lift capped at +4.5%)
  let gNeg = Eng.createGame('people', { seed: 202912 });
  gNeg = OCI.initializeOffCycleInterlude({ ...gNeg, phase: 'complete' }, 2029);
  gNeg.offCycle.races.forEach((r) => { r.playerLift = -50; });
  gNeg = OCI.resolveOffCycleInterlude(gNeg);
  assert.strictEqual(gNeg.pendingBellwetherBonus.bellwetherWave, -3.5, 'Negative Bellwether Wave clamped strictly at -3.5');
});

// 5. All 6 Party Archetypes End-to-End (0 NaN / undefined, election-night-complete enterOffCycle, Save/Reload)
test('5. All 6 party archetypes (people, heritage, liberty, green, constitution, socialist) complete interlude cleanly with 0 NaN', () => {
  const archetypes = ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'];
  archetypes.forEach((pid, idx) => {
    let g = Eng.createGame(pid, { seed: 300000 + idx });
    g = Eng.takeAction(g, 'finish-presidential-primary');
    for (let m = 1; m <= 5; m++) g = Eng.takeAction(g, 'advance-campaign-week');
    g = Eng.takeAction(g, 'election-night-skip');
    g = Eng.takeAction(g, 'election-night-complete', { enterOffCycle: true });

    assert.strictEqual(g.phase, 'off-cycle-interlude', `${pid}: election-night-complete enterOffCycle enters off-cycle-interlude`);
    assert.ok(g.offCycle && g.offCycle.active && g.offCycle.oddYear === 2029);

    g = Eng.takeAction(g, 'off-cycle-set-posture', { posture: 'balanced' });
    g = Eng.takeAction(g, 'off-cycle-donor-retreat');
    g = Eng.takeAction(g, 'off-cycle-chapter-drive', { stateId: 'VA' });
    g = Eng.takeAction(g, 'off-cycle-deploy-surrogate', { raceId: g.offCycle.races[0].id });

    // Save/load round-trip mid-interlude
    Eng.saveGame(g);
    const reloaded = Eng.loadGame();
    assert.strictEqual(reloaded.phase, 'off-cycle-interlude', `${pid}: mid-interlude save preserves phase`);
    assert.strictEqual(reloaded.offCycle.actionsRemaining, 1, `${pid}: mid-interlude save preserves actionsRemaining`);

    const resolved = Eng.takeAction(reloaded, 'off-cycle-resolve');
    assert.strictEqual(resolved.offCycle.resolved, true);
    assert.ok(resolved.pendingBellwetherBonus.bellwetherWave >= -3.5 && resolved.pendingBellwetherBonus.bellwetherWave <= 3.5);

    const nextCycle = Eng.takeAction(resolved, 'off-cycle-complete');
    assert.strictEqual(nextCycle.year, 2030, `${pid}: completes cleanly to 2030`);
    assert.strictEqual(nextCycle.phase, 'organizing');
    assertNoNaN(nextCycle.offCycle, `${pid}:offCycle`);
    assertNoNaN(nextCycle.lastBellwetherSummary, `${pid}:bellwether`);
    assert.ok(Number.isFinite(nextCycle.treasury), `${pid}: finite treasury`);
    assert.ok(Number.isFinite(nextCycle.nationalEnvironment), `${pid}: finite nationalEnvironment`);
  });
});

// 6. window.TimeEngine.getOddYearRaces Override Hook
test('6. window.TimeEngine.getOddYearRaces override hook is honored when mocked', () => {
  const prevTimeEngine = window.TimeEngine;
  try {
    window.TimeEngine = {
      getOddYearRaces: (game, oddYear) => [
        {
          id: `hist-${oddYear}-senate-AL`,
          kind: 'senate_special',
          stateId: 'AL',
          senateClass: 2,
          title: '2017 Alabama U.S. Senate Special (Historical Hook)',
          baselineLean: -22.5,
          vacancyReason: 'Historical TimeEngine Override',
        },
      ],
    };
    const g = Eng.createGame('people', { seed: 202999 });
    const oc = OCI.initializeOffCycleInterlude({ ...g, phase: 'complete' }, 2029);
    assert.strictEqual(oc.offCycle.races.length, 1);
    assert.strictEqual(oc.offCycle.races[0].id, 'hist-2029-senate-AL');
    assert.strictEqual(oc.offCycle.races[0].weight, 1.2);
    assert.strictEqual(oc.offCycle.races[0].baselineLean, -22.5);
  } finally {
    if (prevTimeEngine === undefined) delete window.TimeEngine;
    else window.TimeEngine = prevTimeEngine;
  }
});

// 7. Phase 2 UI Rendering & Decision Desk Verification (0 NaN / undefined across all 6 archetypes)
test('7. renderScreen and renderDecisionDesk emit valid markup with 0 NaN/undefined across all 6 archetypes', () => {
  const archetypes = ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'];
  archetypes.forEach((pid, idx) => {
    let g = OCI.initializeOffCycleInterlude({ ...Eng.createGame(pid, { seed: 400000 + idx }), phase: 'complete' }, 2029);
    const preHtml = OCI.renderScreen(g);
    assert.ok(preHtml.includes('2029 Off-Cycle Interlude'), `${pid}: header renders oddYear`);
    assert.ok(preHtml.includes('Track A: Party Building (Pre-Primary)'), `${pid}: Track A rendered`);
    assert.ok(preHtml.includes('Track B: Off-Cycle &amp; Special Elections') || preHtml.includes('Track B: Off-Cycle & Special Elections'), `${pid}: Track B rendered`);
    assert.ok(preHtml.includes('Party-Building Focus') && preHtml.includes('Special-Election Blitz') && preHtml.includes('Balanced Split'), `${pid}: all 3 postures rendered`);
    assert.ok(preHtml.includes('DEM') && preHtml.includes('GOP') && !/\b(PEO|HER)\b/.test(preHtml), `${pid}: canonical DEM/GOP party badges rendered`);
    assert.ok(!/\bNaN\b|\bundefined\b/.test(preHtml), `${pid}: pre-resolution UI contains zero NaN or undefined`);

    g = OCI.resolveOffCycleInterlude(g);
    const deskHtml = OCI.renderDecisionDesk(g);
    const postScreenHtml = OCI.renderScreen(g);
    assert.ok(deskHtml.includes('Proceed to 2030 Federal Cycle'), `${pid}: Decision Desk CTA renders Year+2`);
    assert.ok(postScreenHtml.includes('Bellwether Wave Momentum'), `${pid}: post-resolution screen renders Decision Desk`);
    assert.ok(!/\bNaN\b|\bundefined\b/.test(postScreenHtml), `${pid}: post-resolution UI contains zero NaN or undefined`);
  });
});

console.log(`\nALL ${passed}/7 OFF-CYCLE INTERLUDE TESTS PASSED!`);
