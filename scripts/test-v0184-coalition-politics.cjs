'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Minimal browser-like global harness
global.window = global;
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function loadBrowserScript(relPath) {
  const full = path.join(ROOT, relPath);
  const code = fs.readFileSync(full, 'utf8');
  // eslint-disable-next-line no-eval
  (0, eval)(code);
}

// Load data & systems in index.html order
[
  'data.js',
  'factions-0.15.js',
  'scenario-2028.js',
  'issues-0.2.1.js',
  'maps-0.3.js',
  'state-house-data-0.5.js',
  'voter-model-0.5.js',
  'demographics-0.9.js',
  'political-trends-system.js',
  'political-texture-system.js',
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'ballot-access.js',
  'election-uncertainty.js',
  'candidate-vetting.js',
  'election-drift.js',
  'election-night-engine.js',
  'campaign-overhaul.js',
  'coalition-politics-system.js',
  'presidential-primaries.js',
  'engine.js',
].forEach(loadBrowserScript);

const CPS = global.CoalitionPoliticsSystem;
const PP = global.PresidentialPrimaries;
const Engine = global.PartyChairEngine;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== v0.18.4 COALITION POLITICS VERIFICATION SUITE (Proposals #5, #6, #9) ===');

// 0. Static checks: zero Math.random() & strict CRLF on build.ps1 / BUILD_EXE.bat
test('Zero Math.random() in coalition-politics-system.js & strict CRLF on build scripts', () => {
  const src = fs.readFileSync(path.join(ROOT, 'coalition-politics-system.js'), 'utf8');
  assert.strictEqual(/\bMath\.random\s*\(/.test(src), false, 'coalition-politics-system.js must not call Math.random()');
  for (const fname of ['build.ps1', 'BUILD_EXE.bat']) {
    const buf = fs.readFileSync(path.join(ROOT, fname));
    const stripped = buf.toString('binary').replace(/\r\n/g, '');
    assert.strictEqual(stripped.includes('\n'), false, `${fname} must have 0 LF-only lines`);
  }
});

// 1. Proposal #5: Primary Rules & Delegate Math Engineering
test('Proposal #5: Primary rules locked in presidential year (2028), editable in midterm Organizing (2030)', () => {
  let game = Engine.createGame({ partyId: 'people', year: 2028, seed: 42 });
  assert.strictEqual(CPS.isPrimaryRulesEditable(game), false, 'Should be locked in 2028 presidential year');
  const blocked = Engine.takeAction(game, 'update-primary-rules', { allocation: 'winner_take_all_states' });
  assert.ok(blocked.error, 'Should return error when editing in presidential year');
  assert.strictEqual(blocked.primaryRules.people.allocation, 'proportional_15');

  // Switch to 2030 midterm organizing
  game = { ...game, year: 2030, phase: 'organizing', treasury: 25, organizingActionsRemaining: 10, actionsLeft: 10 };
  assert.strictEqual(CPS.isPrimaryRulesEditable(game), true, 'Should be editable in 2030 midterm organizing');

  const anchor = game.factions.find((f) => f.id === 'dem_liberal_establishment');
  const minor = game.factions.find((f) => f.partyId === 'people' && f.id !== 'dem_liberal_establishment');
  const anchorBefore = game.factionHappiness?.[anchor.id] ?? anchor.happiness;
  const minorBefore = game.factionHappiness?.[minor.id] ?? minor.happiness;

  const wta = Engine.takeAction(game, 'update-primary-rules', {
    allocation: 'winner_take_all_states',
    superdelegatePct: 15,
    eligibility: 'open',
    swapOutState: 'IA',
    swapInState: 'MI',
  });
  assert.strictEqual(wta.error, null);
  assert.strictEqual(wta.primaryRules.people.allocation, 'winner_take_all_states');
  assert.strictEqual(wta.primaryRules.people.superdelegatePct, 15);
  assert.strictEqual(wta.primaryRules.people.eligibility, 'open');
  assert.deepStrictEqual(wta.primaryRules.people.earlyStates, ['MI', 'NH', 'NV', 'SC']);
  assert.strictEqual(wta.treasury, 23);
  assert.strictEqual(wta.organizingActionsRemaining, 9);
  assert.ok(wta.trust.independents > game.trust.independents, 'Open primary should boost Independents Trust');

  const anchorAfter = wta.factionHappiness?.[anchor.id] ?? wta.factions.find((f) => f.id === anchor.id).happiness;
  const minorAfter = wta.factionHappiness?.[minor.id] ?? wta.factions.find((f) => f.id === minor.id).happiness;
  assert.ok(anchorAfter !== anchorBefore, 'Anchor happiness should update');
  assert.ok(minorAfter < minorBefore, 'Minor faction happiness should drop under WTA + open + superdelegates');
});

test('Proposal #5: presidential-primaries.js delegate math (WTA, pure proportional 0%, earlyStates, REC-04 Revolt)', () => {
  const shares = { a: 0.42, b: 0.35, c: 0.13, d: 0.10 };
  const wtaAlloc = PP.allocateStateDelegates(shares, 100, false, { allocation: 'winner_take_all_states' });
  assert.deepStrictEqual(wtaAlloc, { a: 100, b: 0, c: 0, d: 0 }, 'WTA must award 100% to plurality winner');

  const pureAlloc = PP.allocateStateDelegates(shares, 100, false, { allocation: 'pure_proportional_no_threshold' });
  assert.ok(pureAlloc.c > 0 && pureAlloc.d > 0, 'Pure proportional (0% threshold) must award delegates to sub-15% candidates');
  assert.strictEqual(pureAlloc.a + pureAlloc.b + pureAlloc.c + pureAlloc.d, 100);

  const prop15Alloc = PP.allocateStateDelegates(shares, 100, false, { allocation: 'proportional_15' });
  assert.strictEqual(prop15Alloc.c, 0, '15% threshold must exclude 13% candidate');
  assert.strictEqual(prop15Alloc.d, 0, '15% threshold must exclude 10% candidate');

  // Custom earlyStates in Wave 1
  const wave1 = CPS.getEffectiveWaveStates(PP.STATE_DELEGATE_SCHEDULE, 1, { earlyStates: ['MI', 'PA', 'GA', 'AZ'] });
  assert.deepStrictEqual(wave1.map((s) => s.stateId).sort(), ['AZ', 'GA', 'MI', 'PA']);

  // REC-04 Superdelegate Convention Revolt when superdelegatePct >= 15 overturns pledged plurality winner
  const mockGame = Engine.createGame({ partyId: 'people', year: 2032, seed: 77 });
  mockGame.primaryRules.people.superdelegatePct = 25;
  const targetFaction = mockGame.factions.find((f) => f.partyId === 'people' && f.id !== 'dem_liberal_establishment');
  const beforeHap = mockGame.factionHappiness?.[targetFaction.id] ?? targetFaction.happiness ?? 65;
  const mockPrimaries = {
    backedCandidateId: 'cand_est',
    primaryFieldByParty: {
      people: [
        { id: 'cand_pop', name: 'Insurgent Leader', factionId: targetFaction.id, fame: 60, delegates: 1900, status: 'active' },
        { id: 'cand_est', name: 'Establishment Pick', factionId: 'dem_liberal_establishment', fame: 85, delegates: 1750, status: 'active' },
      ],
    },
    delegatesByParty: { people: { cand_pop: 1900, cand_est: 1750 } },
  };
  const revoltRes = CPS.evaluateSuperdelegateAndConventionRevolt(mockGame, 'people', mockPrimaries);
  assert.strictEqual(revoltRes.revoltTriggered, true, 'Overturning pledged plurality with 25% superdelegates must trigger REC-04 Revolt');
  assert.strictEqual(mockPrimaries.superdelegateRevolt.happinessShock, -25);
  assert.strictEqual(mockPrimaries.superdelegateRevolt.walkoutThreat, true);
  assert.ok(mockPrimaries.chairBrokeredLeverage >= 10, 'Superdelegates must grant >= +10 chair brokered leverage');
  const afterHap = mockGame.factionHappiness?.[targetFaction.id] ?? targetFaction.happiness;
  assert.ok(afterHap <= beforeHap - 25 || afterHap === 0, `Expected -25 happiness shock (${beforeHap} -> ${afterHap})`);
});

// 2. Proposal #6: Cabinet, Court & Shadow-Cabinet Patronage
test('Proposal #6: Governing vs Opposition slots, allied faction bonuses, Senate check, bolt vacating, merger demand', () => {
  let game = Engine.createGame({ partyId: 'people', year: 2028, seed: 101 });
  // Out of power (heritage governs in 2028 default)
  game.governingParty = 'heritage';
  const oppSlots = CPS.getPatronageSlotsForParty(game, 'people');
  assert.strictEqual(oppSlots.mode, 'opposition');
  assert.deepStrictEqual(
    oppSlots.slots.map((s) => s.id),
    ['shadow_foreign', 'shadow_economy', 'finance_chair', 'house_campaign_chair', 'senate_campaign_chair', 'party_strategist']
  );

  // Switch to In Power (Governing Party)
  game.governingParty = 'people';
  const govSlots = CPS.getPatronageSlotsForParty(game, 'people');
  assert.strictEqual(govSlots.mode, 'governing');
  assert.deepStrictEqual(
    govSlots.slots.map((s) => s.id),
    ['sec_state', 'sec_treasury', 'attorney_general', 'sec_domestic', 'scotus_nominee', 'chief_of_staff']
  );

  // Assign an allied faction pick with high competence
  const allied = game.factions.find((f) => f.partyId === 'people' && f.id !== 'dem_liberal_establishment');
  allied.happiness = 55;
  allied.frictionIndex = 40;
  if (game.factionHappiness) game.factionHappiness[allied.id] = 55;
  if (game.factionStandings) game.factionStandings[allied.id] = 55;
  if (game.factionFriction) game.factionFriction[allied.id] = 40;

  game = Engine.takeAction(game, 'assign-patronage-slot', {
    slotId: 'sec_treasury',
    candidateId: 'custom_high_comp',
    candidateName: 'Rep. Ally HighComp',
    factionId: allied.id,
    competence: 85,
  });
  assert.strictEqual(game.error, null);
  const appt = game.patronageAppointments.people.sec_treasury;
  assert.ok(appt, 'Appointment must be stored');
  assert.strictEqual(appt.approvalBonusPerCycle, 1.5);
  const updatedAllied = game.factions.find((f) => f.id === allied.id);
  assert.strictEqual(game.factionHappiness?.[allied.id] ?? updatedAllied.happiness, 65, 'Allied faction must gain +10 Happiness');
  assert.strictEqual(game.factionFriction?.[allied.id] ?? updatedAllied.frictionIndex, 25, 'Allied faction must get -15 Friction');
  assert.ok(updatedAllied.boltImmunityCycles >= 1, 'Allied faction must get +1 cycle bolt immunity');

  // Senate confirmation check: extremist pick without >= 50 Senate seats fails
  game.senateSeats = { people: 40, heritage: 60 };
  const extAttempt = Engine.takeAction(game, 'assign-patronage-slot', {
    slotId: 'attorney_general',
    candidateId: 'ext_nominee',
    candidateName: 'Extremist Nominee',
    isExtremist: true,
    competence: 60,
  });
  assert.ok(extAttempt.error && extAttempt.lastPatronageConfirmation?.status === 'rejected', 'Extremist pick with 40 Senate seats should fail confirmation');

  // BoltFaction must vacate slots held by bolting faction
  const boltedGame = Engine.boltFaction(game, allied.id);
  assert.strictEqual(boltedGame.patronageAppointments.people.sec_treasury, undefined, 'Bolting faction must vacate its patronage slot');

  // generateMergerCoalitionDemands: major bolted faction demands 1 guaranteed Cabinet/Shadow slot
  const boltedFactionRef = boltedGame.factions.find((f) => f.id === allied.id);
  boltedFactionRef.status = 'major';
  boltedFactionRef.targetVoters = 4000000;
  if (boltedGame.voterModel?.factions) boltedGame.voterModel.factions[allied.id] = 4000000;
  const demands = Engine.generateMergerCoalitionDemands(boltedGame, allied.id);
  assert.ok(demands && demands.patronageDemand && demands.patronageDemand.required === true && demands.patronageDemand.count === 1, 'Major bolted faction must demand 1 guaranteed Cabinet/Shadow slot');
});

// 3. Proposal #9: Era-Gated Interactive Coalition & Splinter Diplomacy Hub
test('Proposal #9: Strict Era-Gating (hidden in quiet baseline, unlocked in Six-Party / MMP / Hung Congress / 3+ bolted)', () => {
  const baseGame = Engine.createGame({ partyId: 'people', year: 2028, seed: 55 });
  // Ensure quiet baseline (< 3 bolted factions)
  baseGame.factions.forEach((f) => {
    if (f.partyId === 'none' || f.partyId === 'unaffiliated') f.partyId = 'people';
  });
  baseGame.partySystems = { currentEraId: 'era_07_baseline', coalitionSystem: { mmpActive: false } };
  baseGame.pendingKingmakerNegotiations = [];
  baseGame.pendingContingentElection = null;
  assert.strictEqual(CPS.isDiplomacyHubUnlocked(baseGame), false, 'Diplomacy Hub MUST be hidden in quiet era_07_baseline');

  // Unlock via Six-Party System
  const sixParty = { ...baseGame, partySystems: { currentEraId: 'era_03_six_party_system', coalitionSystem: { mmpActive: false } } };
  assert.strictEqual(CPS.isDiplomacyHubUnlocked(sixParty), true, 'Must unlock in era_03_six_party_system');

  // Unlock via MMP
  const mmpGame = { ...baseGame, partySystems: { currentEraId: 'era_07_baseline', coalitionSystem: { mmpActive: true } } };
  assert.strictEqual(CPS.isDiplomacyHubUnlocked(mmpGame), true, 'Must unlock when coalitionSystem.mmpActive is true');

  // Unlock via 3+ bolted factions (partyId === 'none')
  const threeBolted = {
    ...baseGame,
    factions: baseGame.factions.map((f, idx) => (idx < 3 ? { ...f, partyId: 'none' } : { ...f })),
  };
  assert.strictEqual(CPS.isDiplomacyHubUnlocked(threeBolted), true, 'Must unlock with >= 3 bolted Independent factions');

  // Unlock via Hung Congress
  const hungGame = { ...baseGame, pendingKingmakerNegotiations: [{ partyId: 'liberty' }] };
  assert.strictEqual(CPS.isDiplomacyHubUnlocked(hungGame), true, 'Must unlock during Hung Congress');
});

test('Proposal #9: Bidding War Board, Non-Aggression/Fusion Pacts with Blood Rivalry guard, and Bargaining Table', () => {
  let game = Engine.createGame({ partyId: 'people', year: 2028, seed: 99 });
  game.partySystems = { currentEraId: 'era_03_six_party_system', coalitionSystem: { mmpActive: false } };
  game.factions[1].partyId = 'none';
  game.factionCourtship = { [game.factions[1].id]: { people: 42, green: 31, heritage: 5 } };

  const board = CPS.getFactionBiddingWarBoard(game);
  assert.ok(board.length >= 1, 'Bidding board should list bolted faction');
  const row = board.find((r) => r.factionId === game.factions[1].id);
  assert.strictEqual(row.bids[0].partyId, 'people');
  assert.strictEqual(row.bids[0].goodwill, 42);

  // Sign Fusion Pact with ideologically adjacent Green Party
  game = Engine.takeAction(game, 'propose-diplomacy-pact', {
    targetPartyId: 'green',
    stateId: 'PA',
    pactType: 'fusion',
    expiresYear: 2032,
  });
  assert.strictEqual(game.error, null);
  assert.strictEqual(game.diplomacyPacts.length, 1);
  assert.strictEqual(game.diplomacyPacts[0].expiresYear, 2032);

  // Blood Rivalry blocks pact with schismParentPartyId
  game.player.schismParentPartyId = 'socialist';
  const bloodBlocked = Engine.takeAction(game, 'propose-diplomacy-pact', {
    targetPartyId: 'socialist',
    stateId: 'NY',
    pactType: 'stand_down',
  });
  assert.ok(bloodBlocked.error && bloodBlocked.error.includes('Blood Rivalry'), 'Blood Rivalry must block schism parent pact');

  // Bargaining Table trades Committee Chairs + 2 Planks + Proposal #6 Cabinet Slot
  game.governingParty = 'people';
  game = Engine.takeAction(game, 'bargain-coalition-table', {
    partnerPartyId: 'green',
    committeeChairs: true,
    platformPlanks: ['tax-economy', 'social-justice'],
    cabinetSlotId: 'sec_domestic',
  });
  assert.strictEqual(game.error, null);
  assert.strictEqual(game.coalitionBargains.length, 1);
  assert.ok(game.patronageAppointments.people.sec_domestic, 'Bargaining table must assign Proposal #6 Cabinet slot');
  assert.strictEqual(game.patronageAppointments.people.sec_domestic.partnerPartyId, 'green');
});

test('Backward compatibility: normalizeGame() initializes missing v0.18.4 fields cleanly', () => {
  const legacy = Engine.createGame({ partyId: 'heritage', year: 2028, seed: 12 });
  delete legacy.primaryRules;
  delete legacy.patronageAppointments;
  delete legacy.diplomacyPacts;
  const restored = Engine.normalizeGame(legacy);
  assert.ok(restored.primaryRules && restored.primaryRules.heritage.allocation === 'proportional_15');
  assert.ok(restored.patronageAppointments && typeof restored.patronageAppointments.heritage === 'object');
  assert.ok(Array.isArray(restored.diplomacyPacts));
});

console.log(`\nALL ${passed}/${passed} v0.18.4 COALITION POLITICS TESTS PASSED!`);
