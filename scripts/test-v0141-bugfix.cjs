/**
 * Verification Suite for Version 0.14.1 Bug Fix (BUG-03: Step 5 of The Recruitment Phase)
 * Target: scripts/test-v0141-bugfix.cjs
 *
 * Assertions:
 * a) dispatching 'set-turn-step' with step 5 returns game.turnStep === 5.
 * b) normalizeGame({ turnStep: 5 }) preserves turnStep: 5.
 * c) HTML output on step 4 renders id="step-next" (Step 5 of 5).
 * d) HTML output on step 5 renders id="advance-year".
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
    _dump: () => store,
  };
})();

const mockAppElement = {
  innerHTML: '',
  classList: {
    toggle: () => {},
    add: () => {},
    remove: () => {},
    contains: () => false,
  },
  insertAdjacentHTML: () => {},
  addEventListener: () => {},
};

const mockDocument = {
  querySelectorAll: () => [],
  querySelector: (sel) => (sel === '#app' ? mockAppElement : null),
  getElementById: (id) => (id === 'app' ? mockAppElement : null),
  addEventListener: () => {},
};

const sandbox = {
  window: {},
  document: mockDocument,
  console: console,
  Math: Math,
  JSON: JSON,
  Number: Number,
  Object: Object,
  Array: Array,
  String: String,
  Infinity: Infinity,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  Date: Date,
  Set: Set,
  Map: Map,
  Uint8Array: Uint8Array,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  Blob: globalThis.Blob,
  DecompressionStream: globalThis.DecompressionStream,
  Response: globalThis.Response,
  localStorage: mockLocalStorage,
};
sandbox.window = sandbox;
sandbox.window.document = mockDocument;
const ctx = vm.createContext(sandbox);

function loadScript(filePath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
  vm.runInContext(code, ctx);
}

// Load stack
loadScript('data.js');
loadScript('scenario-2028.js');
loadScript('issues-0.2.1.js');
loadScript('maps-0.3.js');
loadScript('state-house-data-0.5.js');
loadScript('voter-model-0.5.js');
loadScript('demographics-0.9.js');
loadScript('political-trends-system.js');
loadScript('v07-scaffolding.js');
loadScript('engine.js');
loadScript('app.js');

const Engine = sandbox.window.PartyChairEngine;
const V07 = sandbox.window.PartyChairV07;

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✅ PASS: ${message}`);
}

async function runTests() {
  // Wait for async initialization in app.js
  let attempts = 0;
  while (!sandbox.window.PartyChairApp && attempts < 20) {
    await new Promise((r) => setTimeout(r, 20));
    attempts++;
  }
  const App = sandbox.window.PartyChairApp;
  assert(App !== undefined, 'PartyChairApp initialized on window');

  console.log('================================================================');
  console.log('BUG-03 VERIFICATION TEST SUITE (VERSION 0.14.1)');
  console.log('================================================================\n');

  // 1. Dispatching 'set-turn-step' with step 5
  console.log('--- 1. Engine "set-turn-step" Clamp Upper Bound ---');
  {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    assert(game.turnStep === 1, 'Initial game turnStep is 1');

    game = Engine.takeAction(game, { id: 'set-turn-step', payload: { step: 5 } });
    assert(game.turnStep === 5, 'dispatching "set-turn-step" with step 5 returns game.turnStep === 5');

    // Verify upper bound clamp at 5
    game = Engine.takeAction(game, { id: 'set-turn-step', payload: { step: 6 } });
    assert(game.turnStep === 5, 'dispatching "set-turn-step" with step 6 clamps to 5');
  }

  // 2. normalizeGame({ turnStep: 5 }) & hydrateV07GameState({ turnStep: 5 })
  console.log('\n--- 2. normalizeGame & hydrateV07GameState Preservation ---');
  {
    const rawSave = {
      schema: 7,
      version: '0.14',
      year: 2028,
      player: { id: 'player', name: 'Chair', baseTemplateId: 'people' },
      treasury: 100,
      turnStep: 5,
      sittingMembers: [],
    };

    const normalized = Engine.normalizeGame(rawSave);
    assert(normalized.turnStep === 5, 'normalizeGame({ turnStep: 5 }) preserves turnStep: 5');

    const hydrated = V07.hydrateV07GameState(normalized);
    assert(hydrated.turnStep === 5, 'hydrateV07GameState preserves turnStep: 5');
  }

  // 3. HTML output on step 4 renders id="step-next" (Step 5 of 5)
  console.log('\n--- 3. Step 4 Actions Markup Output ---');
  {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    game.turnStep = 4;
    App.setGame(game);
    const markupStep4 = App.actionsTabMarkup();

    assert(markupStep4.includes('id="step-next"'), 'HTML output on step 4 contains id="step-next"');
    assert(markupStep4.includes('Next Step (Step 5 of 5) →'), 'HTML output on step 4 button reads "Next Step (Step 5 of 5) →"');
    assert(!markupStep4.includes('id="advance-year"'), 'HTML output on step 4 does NOT render confirm button id="advance-year"');
  }

  // 4. HTML output on step 5 renders id="advance-year"
  console.log('\n--- 4. Step 5 Actions Markup Output ---');
  {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    game.turnStep = 5;
    App.setGame(game);
    const markupStep5 = App.actionsTabMarkup();

    assert(markupStep5.includes('id="advance-year"'), 'HTML output on step 5 renders confirm button id="advance-year"');
    assert(!markupStep5.includes('id="step-next"'), 'HTML output on step 5 does NOT render id="step-next"');
    assert(markupStep5.includes('Step 5 of 5 · The Recruitment Phase'), 'Step 5 markup contains correct eyebrow "Step 5 of 5 · The Recruitment Phase"');
  }

  // 5. CSS Step Bar 5 Columns Verification
  console.log('\n--- 5. CSS Grid Step Bar Columns ---');
  {
    const css = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
    assert(css.includes('grid-template-columns: repeat(5, minmax(0, 1fr));'), '.v07-step-bar has 5 equal columns');
  }

  console.log('\n================================================================');
  console.log(`SUMMARY: All ${passedTests}/${totalTests} BUG-03 fix tests passed successfully!`);
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
