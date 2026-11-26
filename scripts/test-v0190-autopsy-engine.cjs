'use strict';

const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AutopsySystem = require(path.join(ROOT, 'autopsy-system.js'));

const {
  ELECTORATE_TOTAL,
  determineAutopsyTrack,
  evaluateAutopsyMilestones,
  computeAutopsyPoints,
  determineMajorPartyScenario,
  resolveTargetStatesForOption,
  buildPendingAutopsy,
  applyAutopsyOption,
  renderAutopsyOptionsMarkup
} = AutopsySystem;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS: ${name}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL: ${name}\n   -> ${err.message}`);
  }
}

function makeMockCatalogPool(prefix, withStates = true) {
  return Array.from({ length: 7 }, (_, i) => ({
    id: `${prefix}_opt_${i + 1}`,
    title: `${prefix.toUpperCase()} Option ${i + 1}`,
    theme: 'Coalition Strategy',
    summaryTemplate: withStates
      ? `Launch targeted campaign across {STATES} for option ${i + 1}.`
      : `National strategy boost for option ${i + 1}.`,
    stateTargeting: withStates ? { mode: i % 2 === 0 ? 'top_states' : 'swing_states', count: i < 4 ? 2 : 3 } : null,
    effects: {
      addPartyVoters: 500000,
      treasuryDelta: 12,
      trustDelta: 4,
      addChapters: 2
    }
  }));
}

function makeMockGame(partyId = 'green') {
  return {
    seed: 2028,
    year: 2028,
    treasury: 10,
    chairConfidence: 50,
    caucusFriction: 20,
    leaderApproval: 48,
    partyApproval: 52,
    trust: { base: 55, independents: 45, opponents: 20 },
    player: { id: partyId, baseTemplateId: partyId, tier: 2, custom: false },
    voterModel: {
      voterScale: '1:1',
      sampleVoters: ELECTORATE_TOTAL,
      representedVoters: ELECTORATE_TOTAL,
      affiliations: {
        people: { name: 'Democratic', sampleVoters: 55000000, representedVoters: 55000000 },
        heritage: { name: 'Republican', sampleVoters: 52000000, representedVoters: 52000000 },
        independent: { name: 'Independent', sampleVoters: 43000000, representedVoters: 43000000 },
        liberty: { name: 'Libertarian', sampleVoters: 2000000, representedVoters: 2000000 },
        green: { name: 'Green', sampleVoters: 1500000, representedVoters: 1500000 },
        constitution: { name: 'Constitution', sampleVoters: 500000, representedVoters: 500000 },
        socialist: { name: 'Socialist', sampleVoters: 500000, representedVoters: 500000 },
        other: { name: 'Other', sampleVoters: 500000, representedVoters: 500000 },
        thirdParty: { name: 'Third Party', sampleVoters: 5000000, representedVoters: 5000000 }
      },
      states: {
        WY: { affiliations: { people: 100000, heritage: 200000, independent: 100000, green: 50000, thirdParty: 50000 } },
        MT: { affiliations: { people: 200000, heritage: 300000, independent: 150000, green: 40000, thirdParty: 40000 } },
        PA: { affiliations: { people: 3000000, heritage: 2950000, independent: 1500000, green: 100000, thirdParty: 100000 } },
        MI: { affiliations: { people: 2400000, heritage: 2350000, independent: 1200000, green: 80000, thirdParty: 80000 } },
        WI: { affiliations: { people: 1400000, heritage: 1380000, independent: 700000, green: 60000, thirdParty: 60000 } }
      }
    },
    stateOrganizations: {
      WY: { green: { support: 9.5, chapters: 1 } },
      MT: { green: { support: 8.2, chapters: 1 } },
      PA: { green: { support: 4.5, chapters: 2 } },
      MI: { green: { support: 4.1, chapters: 1 } },
      WI: { green: { support: 3.9, chapters: 1 } }
    },
    caucuses: [
      { id: 'c_1', partyId: 'green', name: 'Eco-Labor Caucus', status: 'active', strength: 60 }
    ],
    factions: [
      { id: 'f_ind', partyId: 'independent', name: 'Independent Reformers', isIdentityBloc: false }
    ],
    sittingMembers: [
      { id: 'm_1', name: 'Sen. Independent', party: 'independent', caucus: 'independent' }
    ],
    autopsyMilestonesEarned: {}
  };
}

function sumNationalAffiliations(vm) {
  return Object.entries(vm.affiliations)
    .filter(([k]) => k !== 'thirdParty')
    .reduce((s, [, v]) => s + Number(v.representedVoters || 0), 0);
}

console.log('====================================================================');
console.log(' v0.19.0 POST-CYCLE AUTOPSY ENGINE UNIT TEST SUITE');
console.log('====================================================================');

// 1. Track Routing
test('determineAutopsyTrack routes minor/3-party chaos vs major 2-party cleanly', () => {
  assert.strictEqual(determineAutopsyTrack({}, {}, { enteringMajorCount: 2, enteringTier: 4 }), 'minor');
  assert.strictEqual(determineAutopsyTrack({}, {}, { enteringMajorCount: 2, enteringTier: 3, currentTier: 5 }), 'minor');
  assert.strictEqual(determineAutopsyTrack({}, {}, { enteringMajorCount: 3, enteringTier: 5 }), 'minor');
  assert.strictEqual(determineAutopsyTrack({}, {}, { enteringMajorCount: 2, enteringTier: 5 }), 'major');
});

// 2. Milestones & Deduplication
test('evaluateAutopsyMilestones awards all 12 one-time milestones without double counting', () => {
  const game = makeMockGame('green');
  const fullCounts = {
    houseSeats: 25,
    senateSeats: 10,
    governors: 10,
    stateHouseSeats: 1,
    stateSenateSeats: 0,
    stateLegChambersControlled: 10
  };
  const first = evaluateAutopsyMilestones(game, 'green', null, { counts: fullCounts });
  assert.strictEqual(first.newlyEarnedIds.length, 12);
  // 10 * (+1) + 2 * (+2) = 14 points
  assert.strictEqual(first.milestonePoints, 14);

  // Persist and re-run: must earn 0 new milestones
  game.autopsyMilestonesEarned = first.updatedMilestonesMap;
  const second = evaluateAutopsyMilestones(game, 'green', null, { counts: fullCounts });
  assert.strictEqual(second.newlyEarnedIds.length, 0);
  assert.strictEqual(second.milestonePoints, 0);
});

// 3. Autopsy Points Math & >20 Clamping
test('computeAutopsyPoints calculates formula accurately and clamps [0, 20]', () => {
  const game = makeMockGame('green');
  // 2 priorities + tier 3 + (3 - 1)*2 (=4) + 3 milestone = 12
  assert.strictEqual(
    computeAutopsyPoints(game, {}, {
      partyId: 'green',
      achievedPriorities: 2,
      currentTier: 3,
      enteringTier: 1,
      milestonePoints: 3
    }),
    12
  );

  // > 20 clamps to 20: 3 + 5 + (5 - 0)*2 + 14 = 32 -> 20
  assert.strictEqual(
    computeAutopsyPoints(game, {}, {
      partyId: 'green',
      achievedPriorities: 3,
      currentTier: 5,
      enteringTier: 0,
      milestonePoints: 14
    }),
    20
  );
});

// 4. All 10 Major Party Scenarios (M1..M10)
test('determineMajorPartyScenario enforces strict top-to-bottom precedence across M1..M10', () => {
  const g = makeMockGame('people');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 0, hasPres: false, hasHouse: false, hasSenate: false }), 'M1');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 0, hasPres: false, hasHouse: true, hasSenate: false }), 'M2');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 1, hasPres: false, hasHouse: false, hasSenate: false }), 'M3');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 2, hasPres: false, hasHouse: false, hasSenate: false }), 'M4');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 3, hasPres: false, hasHouse: true, hasSenate: true }), 'M5');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 0, hasPres: true, hasHouse: false, hasSenate: false }), 'M6');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 1, hasPres: true, hasHouse: false, hasSenate: false }), 'M7');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 2, hasPres: true, hasHouse: false, hasSenate: false }), 'M8');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 3, hasPres: true, hasHouse: true, hasSenate: false }), 'M9');
  assert.strictEqual(determineMajorPartyScenario(g, {}, { partyId: 'people', achievedPriorities: 3, hasPres: true, hasHouse: true, hasSenate: true }), 'M10');
});

// 5. Explicit State Naming (<= 5 states)
test('resolveTargetStatesForOption injects concrete state names when count <= 5', () => {
  const game = makeMockGame('green');
  const opt = {
    id: 'opt_wy_mt',
    title: 'Mountain Foothold',
    summaryTemplate: 'Build permanent county chapters in {STATES}.',
    stateTargeting: { mode: 'top_states', count: 2, explicitStates: ['WY', 'MT'] }
  };
  const resolved = resolveTargetStatesForOption(game, 'green', opt);
  assert.deepStrictEqual(resolved.resolvedStateIds, ['WY', 'MT']);
  assert.strictEqual(resolved.resolvedStateNames, 'Wyoming & Montana');
  assert.strictEqual(resolved.summaryText, 'Build permanent county chapters in Wyoming & Montana.');
});

// 6. buildPendingAutopsy & renderAutopsyOptionsMarkup (determinism + hidden score)
test('buildPendingAutopsy draws 3 deterministic unique options and hides Autopsy Points from UI', () => {
  const game = makeMockGame('green');
  const catalogs = {
    minorLow: makeMockCatalogPool('low'),
    minorHigh: makeMockCatalogPool('high'),
    major: { M1: makeMockCatalogPool('m1') }
  };
  const ctx = {
    partyId: 'green',
    enteringMajorCount: 2,
    enteringTier: 2,
    currentTier: 2,
    achievedPriorities: 1,
    counts: { houseSeats: 0, senateSeats: 0, governors: 0, stateHouseSeats: 0, stateSenateSeats: 0, stateLegChambersControlled: 0 },
    catalogs
  };

  const pendingA = buildPendingAutopsy(game, { year: 2028 }, ctx);
  const pendingB = buildPendingAutopsy(game, { year: 2028 }, ctx);
  assert.strictEqual(pendingA.track, 'minor');
  assert.strictEqual(pendingA.options.length, 3);
  assert.deepStrictEqual(pendingA.options.map((o) => o.id), pendingB.options.map((o) => o.id));
  assert.strictEqual(new Set(pendingA.options.map((o) => o.id)).size, 3);
  assert.strictEqual(pendingA.autopsyPoints, undefined, 'Raw autopsyPoints must stay hidden');

  game.pendingAutopsyOptions = pendingA.options;
  const html = renderAutopsyOptionsMarkup(game);
  assert(!/autopsy\s*points/i.test(html), 'UI markup must never mention Autopsy Points');
  assert(html.includes('data-autopsy-option-id="'), 'UI must include button data-autopsy-option-id');
});

// 7. applyAutopsyOption (155M conservation + clamping + multi-effects)
test('applyAutopsyOption conserves 155M electorate, syncs thirdParty, clamps metrics, and applies effects', () => {
  const game = makeMockGame('green');
  game.pendingAutopsyOptions = [
    {
      id: 'mega_test_opt',
      partyId: 'green',
      title: 'Ballot & Grassroots Surge',
      theme: 'Expansion',
      summaryTemplate: 'Surge across {STATES}.',
      stateTargeting: { mode: 'top_states', count: 2, explicitStates: ['WY', 'MT'] },
      effects: {
        addPartyVoters: 1250000,
        treasuryDelta: 999,
        trustDelta: 90,
        happinessDelta: 10,
        confidenceDelta: 25,
        frictionDelta: -10,
        approvalDelta: 15,
        grantBallotAccess: true,
        addChapters: 3,
        organizingActionsDelta: 2,
        addStateLegSlates: 2,
        enactReform: 'approval_voting',
        caucusStrengthDelta: 15,
        hardenCaucusHistoric: true,
        spawnCandidate: { name: 'Elena Vance', office: 'senate' },
        recruitLawmaker: true,
        recruitFaction: true
      }
    }
  ];
  game.factionStandings = { f_ind: 50 };

  const next = applyAutopsyOption(game, 'mega_test_opt');

  // Electorate conservation
  assert.strictEqual(sumNationalAffiliations(next.voterModel), ELECTORATE_TOTAL);
  assert.strictEqual(next.voterModel.affiliations.green.representedVoters, 2750000);
  assert.strictEqual(next.voterModel.affiliations.independent.representedVoters, 41750000);
  const expectedTp = ['liberty', 'green', 'constitution', 'socialist', 'other'].reduce(
    (s, k) => s + next.voterModel.affiliations[k].representedVoters,
    0
  );
  assert.strictEqual(next.voterModel.affiliations.thirdParty.representedVoters, expectedTp);

  // Clamping checks
  assert.strictEqual(next.treasury, 250);
  assert.strictEqual(next.trust.base, 100);
  assert.strictEqual(next.chairConfidence, 75);
  assert.strictEqual(next.caucusFriction, 10);

  // Structural effects
  assert.strictEqual(next.ballotAccess.green.WY, true);
  assert.strictEqual(next.ballotAccess.green.presidential.MT, true);
  assert.strictEqual(next.stateChapters.WY, 3);
  assert.strictEqual(next.bonusActions, 2);
  assert.strictEqual(next.stateLegSlates.green.house.WY, 2);
  assert.strictEqual(next.stateElectoralSystems.WY, 'approval_voting');
  assert.strictEqual(next.caucuses[0].status, 'historic');
  assert.strictEqual(next.caucuses[0].strength, 75);
  assert.strictEqual(next.recruitedCandidates.length, 1);
  assert.strictEqual(next.sittingMembers[0].party, 'green');
  assert.strictEqual(next.factions[0].partyId, 'green');
  assert.strictEqual(next.pendingAutopsyOptions.length, 0);
  assert.strictEqual(next.autopsyDisposition.optionId, 'mega_test_opt');
});

console.log('\n====================================================================');
console.log(` RESULTS: ${passed} passed, ${failed} failed`);
console.log('====================================================================');
if (failed > 0) process.exit(1);
