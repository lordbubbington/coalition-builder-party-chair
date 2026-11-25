const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

[
  'data.js',
  'factions-0.15.js',
  'scenario-2028.js',
  'issues-0.2.1.js',
  'maps-0.3.js',
  'state-house-data-0.5.js',
  'voter-model-0.5.js',
  'demographic-migration-data.js',
  'demographics-0.9.js',
  'political-trends-system.js',
  'political-texture-system.js',
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'ballot-access.js',
  'election-uncertainty.js',
  'candidate-vetting.js',
  'election-drift.js',
  'election-night-engine.js',
  'media-shocks-system.js',
  'campaign-overhaul.js',
  'campaign-events-system.js',
  'redistricting-ballot-system.js',
  'coalition-politics-system.js',
  'atlas-multiplayer-system.js',
  'leading-faction-system.js',
  'faction-era-stability.js',
  'v0185-playtest-fixes.js',
  'save-migrations.js',
  'persistence-core.js',
  'custom-party-core.js',
  'faction-core.js',
  'engine.js',
].forEach((f) => require(path.join(ROOT, f)));

const Eng = window.PartyChairEngine;
const Demo = window.PartyChairData;
const THIRD_KEYS = ['liberty', 'green', 'constitution', 'socialist', 'other'];

let passed = 0;
function test(name, fn) {
  fn();
  console.log(`  PASS: ${name}`);
  passed++;
}

console.log('=== v0.18.6 DEMOGRAPHICS, 3% GROWTH & AUDIT FIXES SUITE ===');

test('Bug #1: Zero state affiliations conservation leak across migration, generational turnover, and Hare-Niemeyer', () => {
  const g = Eng.createGame('people', { seed: 4201 });
  const vm = g.voterModel;
  const patterns = (Demo.DEMOGRAPHIC_MIGRATION_PATTERNS || []).slice(0, 8);
  Demo.applyInterstateMigration(vm, patterns);
  Demo.applyGenerationalTurnover(vm, 2032);
  Demo.renormalizeElectorateHareNiemeyer(vm, vm.representedVoters);

  let badStates = 0;
  for (const st of vm.states) {
    const baseSum = Object.keys(st.affiliations).filter((k) => k !== 'thirdParty').reduce((s, k) => s + Number(st.affiliations[k] || 0), 0);
    const tpRollup = THIRD_KEYS.reduce((s, tk) => s + Number(st.affiliations[tk] || 0), 0);
    if (Math.abs(baseSum - st.sampleVoters) > 10) badStates++;
    if (Math.abs(Number(st.affiliations.thirdParty || 0) - tpRollup) > 5) badStates++;
  }
  assert.strictEqual(badStates, 0, `Expected 0 states with affiliation leak, found ${badStates}`);
});

test('Population Growth: ~3% per cycle growth adds unmet demand to independents & swing factions while respecting party registration', () => {
  const g = Eng.createGame('people', { seed: 4202 });
  const vm = g.voterModel;
  const startTotal = vm.representedVoters;
  const startInd = vm.states.reduce((s, st) => s + Number(st.affiliations.independent || 0), 0);
  const startSwg = vm.states.reduce((s, st) => s + Object.entries(st.factions || {}).filter(([k]) => k.startsWith('swg_')).reduce((a, [, v]) => a + Number(v || 0), 0), 0);

  Demo.applyCyclePopulationGrowth(vm, 0.03, g.factions);
  const afterTotal = vm.representedVoters;
  const afterInd = vm.states.reduce((s, st) => s + Number(st.affiliations.independent || 0), 0);
  const afterSwg = vm.states.reduce((s, st) => s + Object.entries(st.factions || {}).filter(([k]) => k.startsWith('swg_')).reduce((a, [, v]) => a + Number(v || 0), 0), 0);

  const growthPct = ((afterTotal - startTotal) / startTotal) * 100;
  assert.ok(growthPct >= 2.95 && growthPct <= 3.05, `Expected ~3.0% growth, got ${growthPct.toFixed(3)}%`);
  assert.ok(afterInd > startInd + 4_000_000, `Expected independent voters to absorb growth, delta=${afterInd - startInd}`);
  assert.ok(afterSwg > startSwg + 4_000_000, `Expected swg_* independent factions to grow, delta=${afterSwg - startSwg}`);
});

test('Bug #2: createGame() inline fallback initializes Custom Party cleanly when CustomPartyCore is absent', () => {
  const savedCpc = global.CustomPartyCore;
  const origRequire = require.cache[path.join(ROOT, 'custom-party-core.js')];
  try {
    delete global.CustomPartyCore;
    delete window.CustomPartyCore;
    require.cache[path.join(ROOT, 'custom-party-core.js')] = { exports: {} };
    const g = Eng.createGame({
      baseTemplateId: 'custom',
      customName: 'Fallback Civic Party',
      customOrigin: 'major_schism',
      foundingStateId: 'CO',
      selectedFactionIds: ['dem_blue_dog'],
    });
    assert.strictEqual(g.factions.filter((f) => f.partyId === 'player').length, 1, 'Fallback must assign selected faction to player');
    assert.strictEqual(g.ballotAccess?.player?.presidential?.CO, true, 'Fallback must grant founding state CO ballot access');
    assert.ok(g.treasury >= 25, `Fallback treasury should respect origin budget, got ${g.treasury}`);
  } finally {
    global.CustomPartyCore = savedCpc;
    window.CustomPartyCore = savedCpc;
    if (origRequire) require.cache[path.join(ROOT, 'custom-party-core.js')] = origRequire;
  }
});

test('Bug #4: ensureAndAdvancePoliticianAges with skipSittingAging does not double-age sittingMembers', () => {
  const g = Eng.createGame('people', { seed: 4204 });
  const sampleSit = g.sittingMembers[0];
  const origAge = sampleSit.age;
  const aged = Eng.ensureAndAdvancePoliticianAges(g, 2, { skipSittingAging: true });
  const afterSit = aged.sittingMembers.find((m) => m.id === sampleSit.id);
  assert.strictEqual(afterSit.age, origAge, 'sittingMembers must not be double-aged when skipSittingAging=true');
});

test('Bug #5: actionsLeft decrements cleanly to 3 on refill and normalizeGame preserves organizingActionsRemaining', () => {
  let g = Eng.createGame('people', { seed: 4205 });
  g = { ...g, actionsLeft: 0, organizingActionsRemaining: 16 };
  const afterChap = Eng.takeAction(g, 'chapter', { stateId: 'MI' });
  assert.strictEqual(afterChap.organizingActionsRemaining, 15, `Expected organizingActionsRemaining=15, got ${afterChap.organizingActionsRemaining}`);
  assert.strictEqual(afterChap.actionsLeft, 3, `Expected actionsLeft=3, got ${afterChap.actionsLeft}`);

  const rawSave = { ...g, actionsLeft: 0, organizingActionsRemaining: 12 };
  const norm = Eng.normalizeGame(rawSave);
  assert.strictEqual(norm.actionsLeft, 4, `Expected normalized actionsLeft=4, got ${norm.actionsLeft}`);
  assert.strictEqual(norm.organizingActionsRemaining, 12, `Expected normalized organizingActionsRemaining=12, got ${norm.organizingActionsRemaining}`);
});

console.log(`\nALL ${passed}/${passed} v0.18.6 AUDIT & POPULATION GROWTH TESTS PASSED!`);
