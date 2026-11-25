/**
 * Coalition Builder: Party Chair — v0.18.8 Procedural Faction Naming, Issue Inheritance & Temperaments Test Suite
 * Verifies non-geographic pools, >1M combinatorial space, zero-duplicate generation across 1,000+ names,
 * Emerge/Sever/Split issue inheritance, Temperament rolls, and hard racial/identity guardrails.
 */
'use strict';

const assert = require('assert');
globalThis.window = globalThis;

require('../issues-0.2.1.js');
const { FACTIONS_CATALOG } = require('../factions-0.15.js');
const Naming = require('../procedural-faction-naming.js');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

function makeSeededRng(seed = 202801) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

console.log('=== v0.18.8 PROCEDURAL FACTION NAMING & TEMPERAMENTS TEST SUITE ===');

test('1. All 6 non-geographic pools meet scale requirements & cover 20 starting major factions + 44 issues', () => {
  assert(Naming.PRIMARY_ISSUE_ROOTS.length >= 190, `Expected >=190 PRIMARY_ISSUE_ROOTS, got ${Naming.PRIMARY_ISSUE_ROOTS.length}`);
  assert(Naming.IDEOLOGICAL_MODIFIERS.length >= 60, `Expected >=60 IDEOLOGICAL_MODIFIERS, got ${Naming.IDEOLOGICAL_MODIFIERS.length}`);
  assert(Naming.PARENT_HERITAGE_ROOTS.length >= 145, `Expected >=145 PARENT_HERITAGE_ROOTS, got ${Naming.PARENT_HERITAGE_ROOTS.length}`);
  assert(Naming.ARCHETYPE_TONE_DESCRIPTORS.length >= 48, `Expected >=48 ARCHETYPE_TONE_DESCRIPTORS, got ${Naming.ARCHETYPE_TONE_DESCRIPTORS.length}`);
  assert(Naming.CORE_NOUNS.length >= 40, `Expected >=40 CORE_NOUNS, got ${Naming.CORE_NOUNS.length}`);
  assert(Naming.MOVEMENT_SUFFIXES.length >= 35, `Expected >=35 MOVEMENT_SUFFIXES, got ${Naming.MOVEMENT_SUFFIXES.length}`);

  const startingMajors = FACTIONS_CATALOG.filter((f) => f.partyId === 'people' || f.partyId === 'heritage');
  assert.strictEqual(startingMajors.length, 20, 'Expected exact 20 starting Dem+GOP factions in factions-0.15.js');
  startingMajors.forEach((fac) => {
    assert(Array.isArray(Naming.PARENT_HERITAGE_MAP[fac.id]) && Naming.PARENT_HERITAGE_MAP[fac.id].length >= 4, `Missing heritage roots for starting faction ${fac.id}`);
  });

  const issues = globalThis.PartyChairData.VERSION_021_ISSUES || [];
  assert(issues.length >= 44, `Expected >=44 VERSION_021_ISSUES, got ${issues.length}`);
  issues.forEach((iss) => {
    assert(Array.isArray(Naming.ISSUE_ROOTS_BY_ID[iss.id]) && Naming.ISSUE_ROOTS_BY_ID[iss.id].length >= 4, `Missing issue roots for ${iss.id}`);
  });
});

test('2. Zero geographic terms (states, cities, US regions) across all 6 pools', () => {
  const allPools = [
    ...Naming.PRIMARY_ISSUE_ROOTS,
    ...Naming.IDEOLOGICAL_MODIFIERS,
    ...Naming.PARENT_HERITAGE_ROOTS,
    ...Naming.ARCHETYPE_TONE_DESCRIPTORS,
    ...Naming.CORE_NOUNS,
    ...Naming.MOVEMENT_SUFFIXES,
  ];
  const offending = allPools.filter((entry) => Naming.containsGeographicTerm(entry));
  assert.deepStrictEqual(offending, [], `Found forbidden geographic terms in pools: ${offending.join(', ')}`);
});

test('3. Combinatorial naming space strictly exceeds 1,000,000 clean journalistic names', () => {
  const stats = Naming.getCombinatorialStats();
  assert(stats.rawTotal > 1_000_000, `rawTotal too low: ${stats.rawTotal}`);
  assert(stats.estimatedCleanTotal > 1_000_000, `estimatedCleanTotal must exceed 1,000,000, got ${stats.estimatedCleanTotal}`);
});

test('4. Generates 1,000 unique non-geographic names with 0 duplicates via game.usedFactionNames', () => {
  const rng = makeSeededRng(18801);
  const game = {
    factions: FACTIONS_CATALOG.slice(0, 20),
    usedFactionNames: [],
  };
  const modes = ['emerge', 'sever', 'split'];
  const generated = [];
  for (let i = 0; i < 1000; i++) {
    const mode = modes[i % 3];
    const parent = FACTIONS_CATALOG[i % 20];
    const name = Naming.generateUniqueFactionName({
      birthMode: mode,
      parentFaction: parent,
      partyId: parent.partyId,
      primaryIssue: (globalThis.PartyChairData.VERSION_021_ISSUES[i % 44] || {}).id,
      game,
      rng,
    });
    assert(typeof name === 'string' && name.trim().length >= 8, `Invalid generated name: ${name}`);
    assert(!Naming.containsGeographicTerm(name), `Generated name contained geographic term: ${name}`);
    generated.push(name);
  }
  const normalizedUnique = new Set(generated.map((n) => n.toLowerCase().trim()));
  assert.strictEqual(normalizedUnique.size, 1000, `Expected 1,000 unique names, got ${normalizedUnique.size}`);
  assert.strictEqual(game.usedFactionNames.length, 1000, 'game.usedFactionNames did not record all 1,000 entries');
});

test('5. selectChildIssues enforces exact Emerge, Sever, and Split issue inheritance rules', () => {
  const rng = makeSeededRng(18802);
  const parent = {
    id: 'gop_maga',
    name: 'Nationalist Populists (MAGA)',
    partyId: 'heritage',
    keyIssues: ['border-enforcement', 'Cost of Living'],
  };
  const prioritizedActive = [
    { id: 'frontier-ai-oversight-compute', label: 'Frontier AI Oversight', isShockIssue: true, salience: 3 },
    { id: 'climate-action', label: 'Climate targets and emissions', isEraIssue: true, salience: 2 },
    { id: 'taxes-spending', label: 'Taxes and public spending', salience: 1 },
  ];

  // Emerge: 2 fresh issues, primaryIssueId === issues[0]
  const emergeSel = Naming.selectChildIssues('emerge', null, prioritizedActive, rng);
  assert.strictEqual(emergeSel.keyIssues.length, 2);
  assert.strictEqual(emergeSel.primaryIssueId, emergeSel.keyIssues[0]);
  assert.notStrictEqual(emergeSel.keyIssues[0], emergeSel.keyIssues[1]);
  assert(
    ['frontier-ai-oversight-compute', 'climate-action'].includes(emergeSel.keyIssues[0]),
    `Expected high-salience shock/era issue first for Emerge, got ${emergeSel.keyIssues[0]}`
  );

  // Sever: 0 parent Key Issues inherited; 2 fresh issues
  const severSel = Naming.selectChildIssues('sever', parent, prioritizedActive, rng);
  assert.strictEqual(severSel.keyIssues.length, 2);
  assert.strictEqual(severSel.inheritedParentIssues.length, 0);
  assert.strictEqual(severSel.primaryIssueId, severSel.keyIssues[0]);
  assert(!severSel.keyIssues.includes('border-enforcement') && !severSel.keyIssues.includes('cost-of-living') && !severSel.keyIssues.includes('Cost of Living'),
    `Sever must inherit 0 parent issues, got ${JSON.stringify(severSel.keyIssues)}`);

  // Split: 2 sibling pairs; Child A takes parent[0] + 1 fresh, Child B takes parent[1] + 1 fresh
  const splitSel = Naming.selectChildIssues('split', parent, prioritizedActive, rng);
  assert.strictEqual(splitSel.childA.keyIssues.length, 2);
  assert.strictEqual(splitSel.childB.keyIssues.length, 2);
  assert.strictEqual(splitSel.childA.keyIssues[0], 'border-enforcement');
  assert.strictEqual(splitSel.childA.primaryIssueId, 'border-enforcement');
  assert.strictEqual(splitSel.childB.keyIssues[0], 'Cost of Living');
  assert.strictEqual(splitSel.childB.primaryIssueId, 'Cost of Living');
  assert.notStrictEqual(splitSel.childA.keyIssues[1], splitSel.childB.keyIssues[1], 'Split siblings must pick distinct fresh issues');
  assert(![splitSel.childA.keyIssues[1], splitSel.childB.keyIssues[1]].includes('border-enforcement'));
});

test('6. rollFactionTemperament produces all 3 valid archetypes with expected modifiers', () => {
  const rng = makeSeededRng(18803);
  const counts = { true_believer: 0, fair_weather: 0, transactional: 0 };
  for (let i = 0; i < 600; i++) {
    const t = Naming.rollFactionTemperament(rng, ['emerge', 'sever', 'split'][i % 3]);
    assert(['true_believer', 'fair_weather', 'transactional'].includes(t.id), `Unexpected temperament id: ${t.id}`);
    assert(typeof t.label === 'string' && t.label.length > 0);
    assert(typeof t.summary === 'string' && t.summary.length > 10);
    assert(Number.isFinite(t.modifiers.appeasementMultiplier));
    assert(Number.isFinite(t.modifiers.primaryIssueBetrayalPenalty));
    assert(Number.isFinite(t.modifiers.losingStreakBoltMultiplier));
    assert(Number.isFinite(t.modifiers.caucusFrayMultiplier));
    if (t.id === 'transactional') assert.strictEqual(t.modifiers.appeasementMultiplier, 1.4);
    if (t.id === 'true_believer') assert(t.modifiers.primaryIssueBetrayalPenalty >= 1.5);
    if (t.id === 'fair_weather') assert(t.modifiers.losingStreakBoltMultiplier >= 1.5);
    counts[t.id]++;
  }
  assert(counts.true_believer > 100 && counts.fair_weather > 100 && counts.transactional > 100, `Unbalanced temperament distribution: ${JSON.stringify(counts)}`);
});

test('7. buildProceduralFactionProfile & buildSplitFactionPair honor sliders, budgets, and hard identity guards', () => {
  const rng = makeSeededRng(18804);
  const game = { year: 2032, factions: FACTIONS_CATALOG.slice(), usedFactionNames: [] };

  // Emerge profile
  const emerged = Naming.buildProceduralFactionProfile({
    birthMode: 'emerge',
    partyId: 'people',
    partyDefaults: { social: 3.5, economic: 3.5, governance: 4.0 },
    game,
    rng,
  });
  assert.strictEqual(emerged.birthMode, 'emerge');
  assert.strictEqual(emerged.parentFactionId, null);
  assert.strictEqual(emerged.type, 'ideological');
  assert(emerged.targetVoters >= 350_000 && emerged.targetVoters <= 850_000, `Unexpected emerge voters: ${emerged.targetVoters}`);
  assert.strictEqual(emerged.viralRunwayCyclesLeft, 4);
  assert.strictEqual(emerged.vanguardCyclesLeft, 3);
  assert.strictEqual(emerged.primaryIssueId, emerged.keyIssues[0]);

  // Sever profile
  const parent = FACTIONS_CATALOG.find((f) => f.id === 'gop_maga');
  const severed = Naming.buildProceduralFactionProfile({
    birthMode: 'sever',
    parentFaction: parent,
    game,
    rng,
  });
  assert.strictEqual(severed.birthMode, 'sever');
  assert.strictEqual(severed.parentFactionId, 'gop_maga');
  assert(severed.targetVoters >= Math.floor(parent.targetVoters * 0.19) && severed.targetVoters <= Math.ceil(parent.targetVoters * 0.36));
  assert(severed.sliders.social >= 1 && severed.sliders.social <= 10);

  // Split pair
  const splitParent = { ...FACTIONS_CATALOG.find((f) => f.id === 'dem_abundance'), targetVoters: 5_000_000 };
  const [childA, childB] = Naming.buildSplitFactionPair({ parentFaction: splitParent, game, rng });
  assert.strictEqual(childA.birthMode, 'split');
  assert.strictEqual(childB.birthMode, 'split');
  assert.notStrictEqual(childA.name, childB.name);
  assert.strictEqual(childA.targetVoters + childB.targetVoters, 5_000_000);
  assert.strictEqual(childA.primaryIssueId, splitParent.keyIssues[0]);
  assert.strictEqual(childB.primaryIssueId, splitParent.keyIssues[1]);
  assert.notStrictEqual(childA.sliders.social, childB.sliders.social, 'Split siblings must diverge on sliders');

  // Hard identity / racial guards
  assert.throws(() => {
    Naming.buildProceduralFactionProfile({ birthMode: 'emerge', type: 'racial', partyId: 'people', game, rng });
  }, /cannot be procedurally generated/i);
  assert.throws(() => {
    Naming.buildProceduralFactionProfile({ birthMode: 'emerge', type: 'identity', partyId: 'people', game, rng });
  }, /cannot be procedurally generated/i);

  const blackVoters = FACTIONS_CATALOG.find((f) => f.id === 'dem_black_voters');
  assert.throws(() => {
    Naming.buildProceduralFactionProfile({ birthMode: 'sever', parentFaction: blackVoters, game, rng });
  }, /protected/i);
  assert.throws(() => {
    Naming.buildSplitFactionPair({ parentFaction: blackVoters, game, rng });
  }, /protected/i);
});

if (process.exitCode && process.exitCode !== 0) {
  console.error('\nTEST SUITE FAILED');
  process.exit(process.exitCode);
} else {
  console.log(`\nALL ${passed}/${passed} PROCEDURAL FACTION NAMING TESTS PASSED!`);
}
