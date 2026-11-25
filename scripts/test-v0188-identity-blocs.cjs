'use strict';

const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Load factions-0.15.js to verify real catalog integration
global.window = { PartyChairData: {} };
const { FACTIONS_CATALOG } = require(path.join(ROOT, 'factions-0.15.js'));
const IdentityBlocSystem = require(path.join(ROOT, 'identity-bloc-system.js'));

const {
  IDENTITY_BLOC_CATALOG,
  EMERGENT_GROUP_IDS,
  isProtectedIdentityBloc,
  isWhiteIdentityAttempt,
  ensureIdentityBlocState,
  triggerIdentityBlocSplit,
  triggerLatinoUnification,
  triggerEmergentIdentityBloc,
  evaluateIdentityBlocEvents
} = IdentityBlocSystem;

function makeDeterministicRng(seed = 12345) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createTestGame() {
  const factions = JSON.parse(JSON.stringify(FACTIONS_CATALOG));
  const voterModelFactions = {};
  const factionStandings = {};
  for (const f of factions) {
    voterModelFactions[f.id] = f.targetVoters;
    factionStandings[f.id] = f.startingHappiness ?? 55;
  }
  const game = {
    year: 2028,
    factions,
    factionStandings,
    voterModel: {
      factions: voterModelFactions
    }
  };
  ensureIdentityBlocState(game);
  return game;
}

function sumAllVoters(game) {
  return game.factions.reduce((sum, f) => sum + Number(f.targetVoters || 0), 0);
}

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

console.log('====================================================================');
console.log(' v0.18.8 IDENTITY & RELIGIOUS VOTING BLOCS UNIT TEST SUITE');
console.log('====================================================================');

// 1. Catalog & Fixed Set Structure
test('Catalog contains exact 7 curated identity/religious groups with up to 4 sub-factions each', () => {
  assert.strictEqual(IDENTITY_BLOC_CATALOG.length, 7);
  const expectedIds = [
    'black_voters',
    'latino_voters',
    'east_asian_voters',
    'south_asian_voters',
    'jewish_voters',
    'muslim_voters',
    'native_american_voters'
  ];
  assert.deepStrictEqual(IDENTITY_BLOC_CATALOG.map((g) => g.id), expectedIds);

  const seenSubNames = new Set();
  for (const group of IDENTITY_BLOC_CATALOG) {
    assert(group.unifiedBloc && group.unifiedBloc.id && group.unifiedBloc.name, `${group.id} needs unifiedBloc`);
    assert(Array.isArray(group.subFactions) && group.subFactions.length >= 2 && group.subFactions.length <= 4,
      `${group.id} must have 2-4 fixed set sub-factions`);
    for (const sub of group.subFactions) {
      assert(!seenSubNames.has(sub.name), `Duplicate sub-faction name: ${sub.name}`);
      seenSubNames.add(sub.name);
      assert(sub.sliders && Number.isFinite(sub.sliders.social) && Number.isFinite(sub.sliders.economic) && Number.isFinite(sub.sliders.governance),
        `${sub.id} missing sliders`);
      assert(Array.isArray(sub.keyIssues) && sub.keyIssues.length === 2, `${sub.id} must have 2 Key Issues`);
    }
  }
});

// 2. White Voters Exclusion Guardrail
test('White voters NEVER unify into a single voting bloc', () => {
  for (const group of IDENTITY_BLOC_CATALOG) {
    assert(!/\bwhite\b/i.test(group.id) && !/\bwhite\b/i.test(group.label), 'No white group in catalog');
    assert(!/\bwhite\b/i.test(group.unifiedBloc.name), 'No white unified bloc name');
  }
  assert.strictEqual(isWhiteIdentityAttempt('white_voters'), true);
  assert.strictEqual(isWhiteIdentityAttempt('White Unified Bloc'), true);

  const game = createTestGame();
  const resC = triggerEmergentIdentityBloc(game, 'white_voters', makeDeterministicRng(1));
  assert.strictEqual(resC.ok, false);
  assert.strictEqual(resC.reason, 'white_voters_excluded');

  const resA = triggerIdentityBlocSplit(game, 'white_voters', makeDeterministicRng(1));
  assert.strictEqual(resA.ok, false);
  assert.strictEqual(resA.reason, 'white_voters_excluded');
});

// 3. Protection Against Procedural & <100K Dissolution Rules
test('isProtectedIdentityBloc protects all existing and generated identity/religious blocs', () => {
  const mustProtect = [
    'dem_black_voters',
    'dem_traditional_latin',
    'gop_cubans',
    'swg_working_class_latinos',
    'gop_mormons',
    'dem_faith_based_liberals',
    'gop_faith_and_flag',
    'swg_religious_moderates'
  ];
  for (const id of mustProtect) {
    const f = FACTIONS_CATALOG.find((x) => x.id === id);
    assert(f, `Missing expected faction ${id} in factions-0.15.js`);
    assert.strictEqual(isProtectedIdentityBloc(f), true, `${id} must be protected`);
    assert.strictEqual(isProtectedIdentityBloc(id), true, `${id} string ID must be protected`);
  }

  const mustNotProtect = ['dem_liberal_establishment', 'dem_capital_l_left', 'gop_maga', 'gop_neo_cons'];
  for (const id of mustNotProtect) {
    const f = FACTIONS_CATALOG.find((x) => x.id === id);
    assert(f, `Missing expected faction ${id} in factions-0.15.js`);
    assert.strictEqual(isProtectedIdentityBloc(f), false, `${id} should NOT be protected`);
  }
});

// 4. Event A: Black Voters Split with Exact Voter Conservation
test('Event A splits unified Black Voters into 2-4 sub-factions with exact voter conservation', () => {
  const game = createTestGame();
  const totalBefore = sumAllVoters(game);
  const blackBefore = game.factions.find((f) => f.id === 'dem_black_voters').targetVoters;

  const res = triggerIdentityBlocSplit(game, 'black_voters', makeDeterministicRng(42));
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.type, 'identity_split');
  assert(res.createdFactions.length >= 2 && res.createdFactions.length <= 4);
  assert.strictEqual(game.factions.some((f) => f.id === 'dem_black_voters'), false);

  const blackAfter = res.createdFactions.reduce((s, f) => s + f.targetVoters, 0);
  assert.strictEqual(blackAfter, blackBefore, 'Black voters total must be conserved down to 1 voter');
  assert.strictEqual(sumAllVoters(game), totalBefore, 'Total electorate must be conserved');

  for (const sub of res.createdFactions) {
    assert.strictEqual(isProtectedIdentityBloc(sub), true);
    assert.strictEqual(sub.birthMode, 'identity_event');
    assert.strictEqual(sub.primaryIssueId, sub.keyIssues[0]);
  }
});

// 5. Event B + Event A: Latino Unification -> Re-Split Cycle
test('Event B unifies Latino sub-factions, then Event A re-splits with exact voter conservation', () => {
  const game = createTestGame();
  const totalBefore = sumAllVoters(game);
  const latinoIds = new Set(['dem_traditional_latin', 'swg_working_class_latinos', 'gop_cubans']);
  const latinoVotersBefore = game.factions
    .filter((f) => latinoIds.has(f.id))
    .reduce((s, f) => s + f.targetVoters, 0);

  // Step 1: Unify
  const unifyRes = triggerLatinoUnification(game, makeDeterministicRng(7));
  assert.strictEqual(unifyRes.ok, true);
  assert.strictEqual(unifyRes.type, 'latino_unification');
  assert.strictEqual(unifyRes.unifiedFaction.id, 'latino_unified_bloc');
  assert.strictEqual(unifyRes.unifiedFaction.targetVoters, latinoVotersBefore);
  assert.strictEqual(sumAllVoters(game), totalBefore, 'Electorate conserved after Latino unification');
  assert.strictEqual(isProtectedIdentityBloc(unifyRes.unifiedFaction), true);

  // Step 2: Re-split via Event A
  const splitRes = triggerIdentityBlocSplit(game, 'latino_voters', makeDeterministicRng(99));
  assert.strictEqual(splitRes.ok, true);
  assert.strictEqual(splitRes.type, 'identity_split');
  assert(splitRes.createdFactions.length >= 2 && splitRes.createdFactions.length <= 4);
  const latinoVotersAfter = splitRes.createdFactions.reduce((s, f) => s + f.targetVoters, 0);
  assert.strictEqual(latinoVotersAfter, latinoVotersBefore, 'Latino voters conserved after re-split');
  assert.strictEqual(sumAllVoters(game), totalBefore, 'Electorate conserved after Latino re-split');
});

// 6. Event C: All 5 Emergent Identity Blocs Form & Conserve Electorate + Can Split
test('Event C forms all 5 emergent blocs cleanly, prevents duplicates, conserves electorate, and allows Event A split', () => {
  assert.deepStrictEqual(EMERGENT_GROUP_IDS, [
    'east_asian_voters',
    'south_asian_voters',
    'jewish_voters',
    'muslim_voters',
    'native_american_voters'
  ]);

  const game = createTestGame();
  const totalBefore = sumAllVoters(game);
  const rng = makeDeterministicRng(2028);

  for (const gid of EMERGENT_GROUP_IDS) {
    const res = triggerEmergentIdentityBloc(game, gid, rng);
    assert.strictEqual(res.ok, true, `Failed to emerge ${gid}: ${res.reason}`);
    assert.strictEqual(res.type, 'identity_emerge');
    assert(res.totalVoters >= 100000);
    assert.strictEqual(isProtectedIdentityBloc(res.emergentFaction), true);
    assert.strictEqual(sumAllVoters(game), totalBefore, `Electorate conserved after ${gid} emergence`);

    // Duplicate emergence must be blocked
    const dup = triggerEmergentIdentityBloc(game, gid, rng);
    assert.strictEqual(dup.ok, false);
    assert.strictEqual(dup.reason, 'already_emerged');

    // Emergent bloc can subsequently split via Event A
    const splitRes = triggerIdentityBlocSplit(game, gid, rng);
    assert.strictEqual(splitRes.ok, true, `Emergent group ${gid} should be splittable via Event A`);
    assert.strictEqual(sumAllVoters(game), totalBefore, `Electorate conserved after ${gid} split`);
  }
});

// 7. Cycle-End Evaluator Conservative Pacing
test('evaluateIdentityBlocEvents paces historic events conservatively and conserves electorate', () => {
  const game = createTestGame();
  const totalBefore = sumAllVoters(game);
  const rng = makeDeterministicRng(777);

  let eventCount = 0;
  for (let cycle = 0; cycle < 40; cycle++) {
    const out = evaluateIdentityBlocEvents(game, rng);
    assert(Array.isArray(out.events) && Array.isArray(out.summary));
    assert(out.events.length <= 1, 'At most 1 identity bloc event per cycle');
    eventCount += out.events.length;
    assert.strictEqual(sumAllVoters(game), totalBefore, `Electorate conserved at cycle ${cycle}`);
  }
  assert(eventCount > 0 && eventCount <= 15, `Expected conservative historic pacing (got ${eventCount} events in 40 cycles)`);
});

console.log('\n====================================================================');
console.log(` RESULTS: ${passed} passed, ${failed} failed`);
console.log('====================================================================');
if (failed > 0) process.exit(1);
