'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('====================================================================');
console.log(' v0.18.8 4-CYCLE HEADLESS SIMULATION & ELECTORATE INVARIANT TEST');
console.log('====================================================================');

const ROOT = path.resolve(__dirname, '..');

function boot() {
  const storage = {};
  const ctx = vm.createContext({
    window: {},
    console,
    Math,
    Date,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    Set,
    Map,
    RegExp,
    Error,
    Promise,
    Uint8Array,
    Blob,
    DecompressionStream: typeof DecompressionStream !== 'undefined' ? DecompressionStream : undefined,
    Response: typeof Response !== 'undefined' ? Response : undefined,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    document: {
      createElement: () => ({ style: {}, appendChild: () => {} }),
      head: { appendChild: () => {} },
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
    },
    localStorage: {
      getItem: (k) => storage[k] ?? null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
      clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
    },
  });
  ctx.window = ctx;
  ctx.self = ctx;
  ctx.globalThis = ctx;

  const scripts = [
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
    'party-systems-ui.js',
    'presidential-primaries.js',
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
    'ui-setup-views.js',
    'off-cycle-interlude.js',
    'procedural-faction-naming.js',
    'faction-caucus-system.js',
    'dynamic-faction-lifecycle.js',
    'identity-bloc-system.js',
    'faction-caucus-ui.js',
    'engine.js',
  ];

  for (const f of scripts) {
    const fullPath = path.join(ROOT, f);
    if (fs.existsSync(fullPath)) {
      vm.runInContext(fs.readFileSync(fullPath, 'utf8'), ctx, { filename: f });
    }
  }

  return ctx;
}

const ctx = boot();
const E = ctx.window.PartyChairEngine;

assert(E && typeof E.createGame === 'function', 'PartyChairEngine.createGame must be loaded');

// 1. Test createGame() initialization
let game = E.createGame({ baseTemplateId: 'people', seed: 2028 });

assert(Array.isArray(game.usedFactionNames), 'game.usedFactionNames must be initialized as array');
assert(typeof game.threePartyChaosActive === 'boolean', 'game.threePartyChaosActive must be boolean');
assert(typeof game.identityBlocState === 'object', 'game.identityBlocState must be initialized');
assert(Array.isArray(game.caucuses) && game.caucuses.length >= 6, `game.caucuses must have starting caucuses, got ${game.caucuses?.length}`);

const instCaucus = game.caucuses.find((c) => c.name.includes('Institutional'));
assert(instCaucus && instCaucus.status === 'historic' && instCaucus.strength === 68, 'The Institutional Caucus must be Historic with strength 68');
const magaCaucus = game.caucuses.find((c) => c.name.includes('MAGA'));
assert(magaCaucus && magaCaucus.strength === 56, 'The MAGA Caucus must have strength 56');

console.log('  PASS: createGame() initialized with 2028 starting caucuses & state contracts');

// 2. Advance 4 cycles (2028 -> 2030 -> 2032 -> 2034 -> 2036)
for (let cycle = 1; cycle <= 4; cycle++) {
  const startYear = game.year;
  game = { ...game, phase: 'complete' };
  game = E.startNextCycle(game);

  assert.strictEqual(game.year, startYear + 2, `Cycle ${cycle} must advance year by +2, got ${game.year}`);
  assert(game.lastLifecycleDigest, `Cycle ${cycle} must populate game.lastLifecycleDigest`);
  assert(Array.isArray(game.caucuses) && game.caucuses.length > 0, `Cycle ${cycle} must maintain caucuses`);

  // Verify electorate conservation
  const vmStates = game.voterModel?.states;
  if (Array.isArray(vmStates)) {
    const totalRep = vmStates.reduce((acc, st) => {
      const repSum = (st.affiliations?.people || 0) + (st.affiliations?.heritage || 0) + (st.affiliations?.independent || 0) + (st.affiliations?.thirdParty || 0);
      return acc + repSum;
    }, 0);
    const diff = Math.abs(totalRep - 155000000);
    assert(diff <= 51, `Cycle ${cycle} electorate sum variance must be <= 51 due to rounding, got diff=${diff}`);
  }

  console.log(`  PASS: Cycle ${cycle} advanced cleanly to ${game.year} (Chaos=${game.threePartyChaosActive}, Caucuses=${game.caucuses.length}, DigestEvents=${game.lastLifecycleDigest?.events?.length || 0})`);
}

console.log('====================================================================');
console.log(' 4-CYCLE HEADLESS SIMULATION PASSED 100%!');
console.log('====================================================================');
