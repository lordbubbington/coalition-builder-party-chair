/**
 * Automated Master Verification Suite for Version 0.14.2
 * Target: scripts/test-v0142-integration.cjs
 *
 * Objectives:
 * 1. BUG-04 / REQ-111 (Strict Party Scoping & Custom Party Isolation):
 *    - Custom party playerIdentity() returns 'player', not 'people'.
 *    - Regular party playerIdentity() returns party ID / baseTemplateId.
 * 2. REQ-118 (Cook PVI House District Leans Integration):
 *    - Cook PVI leans correctly assigned in VERSION_01_HOUSE_DISTRICTS:
 *      AL-7 === 20.0, CA-5 === -20.0, AZ-6 === 0.0, WY-1 === -46.0, AL-1 === -34.0.
 *    - estimateRaceMargin for house races uses pure district.lean directly decoupled from presidential margin.
 * 3. BUG-03 (Recruitment Phase 5-Step Stepper):
 *    - engine.js 'set-turn-step' clamp upper bound is 5.
 *    - normalizeGame and hydrateV07GameState clamp upper bound is 5.
 *    - Step 5 is reachable.
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

// Load stack in canonical order
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
const Data = sandbox.window.PartyChairData;
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
  console.log('MASTER VERIFICATION & INTEGRATION TEST SUITE (VERSION 0.14.2)');
  console.log('================================================================\n');

  // -----------------------------------------------------------------------------
  // SUITE 1: BUG-04 / REQ-111 (Strict Party Scoping & Custom Party Isolation)
  // -----------------------------------------------------------------------------
  console.log('--- SUITE 1: Strict Party Scoping & Custom Party Isolation (BUG-04 / REQ-111) ---');
  {
    // Custom party test
    const customGame = Engine.createGame({ baseTemplateId: 'people', customName: 'Patriot Movement' });
    App.setGame(customGame);
    
    // Test playerIdentity() logic
    const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
    assert(appSource.includes("if (game?.player?.custom) return 'player';"), "playerIdentity() returns 'player' for custom parties");
    
    // Evaluate in app context via exported helper
    const resolvedCustomId = App.playerIdentity();
    assert(resolvedCustomId === 'player', `Custom party playerIdentity() returns 'player' (got: ${resolvedCustomId})`);

    // Standard party test
    const gopGame = Engine.createGame({ baseTemplateId: 'heritage' });
    App.setGame(gopGame);
    const resolvedGopId = App.playerIdentity();
    assert(resolvedGopId === 'heritage', `Heritage party playerIdentity() returns 'heritage' (got: ${resolvedGopId})`);

    // Custom party in Step 3 does NOT render Democratic candidates
    App.setGame(customGame);
    const step3Markup = App.step3PrimariesMarkup();
    assert(!step3Markup.includes('Jon Ossoff'), 'Custom party primary markup does NOT include Democratic candidate Jon Ossoff');
    assert(step3Markup.includes('No candidates currently filed in the Patriot Movement primary') || step3Markup.includes('Patriot Movement'), 'Custom party primary shows custom party name and clean status');
    assert(step3Markup.includes('primary-party') && step3Markup.includes('disabled'), '#primary-party select is locked and disabled');
  }

  // -----------------------------------------------------------------------------
  // SUITE 2: REQ-118 (Cook PVI House District Leans Integration)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 2: Cook PVI House District Leans (REQ-118) ---');
  {
    const districts = Data.VERSION_01_HOUSE_DISTRICTS;
    assert(Array.isArray(districts) && districts.length === 435, `All 435 House districts present in data (${districts?.length}/435)`);

    const al7 = districts.find((d) => d.id === 'AL-7');
    assert(al7 && al7.lean === 20.0, `AL-7 Cook PVI lean is exactly 20.0 (D+20.0) [got: ${al7?.lean}]`);

    const ca5 = districts.find((d) => d.id === 'CA-5');
    assert(ca5 && ca5.lean === -20.0, `CA-5 Cook PVI lean is exactly -20.0 (R+20.0) [got: ${ca5?.lean}]`);

    const az6 = districts.find((d) => d.id === 'AZ-6');
    assert(az6 && az6.lean === 0.0, `AZ-6 Cook PVI lean is exactly 0.0 (EVEN) [got: ${az6?.lean}]`);

    const wy1 = districts.find((d) => d.id === 'WY-1');
    assert(wy1 && wy1.lean === -46.0, `WY-1 Cook PVI lean is exactly -46.0 (R+46.0) [got: ${wy1?.lean}]`);

    const al1 = districts.find((d) => d.id === 'AL-1');
    assert(al1 && al1.lean === -34.0, `AL-1 Cook PVI lean is exactly -34.0 (R+34.0) [got: ${al1?.lean}]`);

    // Margin estimation decoupling test
    const testGame = Engine.createGame({ baseTemplateId: 'people' });
    const al7Margin = Engine.estimateRaceMargin(testGame, 'house:AL-7');
    assert(Math.abs(al7Margin - 20.0) < 10, `House race AL-7 margin centers on district lean (+20) [got: ${al7Margin}]`);
  }

  // -----------------------------------------------------------------------------
  // SUITE 3: BUG-03 (Recruitment Phase 5-Step Stepper Safeguard)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 3: Recruitment Phase 5-Step Stepper (BUG-03) ---');
  {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    assert(game.turnStep === 1, 'Initial game turnStep is 1');

    // set-turn-step clamps to 5
    game = Engine.takeAction(game, { id: 'set-turn-step', payload: { step: 5 } });
    assert(game.turnStep === 5, 'set-turn-step allows reaching step 5');

    game = Engine.takeAction(game, { id: 'set-turn-step', payload: { step: 6 } });
    assert(game.turnStep === 5, 'set-turn-step clamps at step 5');

    // normalizeGame & hydrateV07GameState clamp upper bound 5
    const normalized = Engine.normalizeGame({ schema: 7, version: '0.14', year: 2028, player: { id: 'player', baseTemplateId: 'people' }, turnStep: 5 });
    assert(normalized.turnStep === 5, 'normalizeGame preserves turnStep: 5');

    const hydrated = V07.hydrateV07GameState(normalized);
    assert(hydrated.turnStep === 5, 'hydrateV07GameState preserves turnStep: 5');

    // Markup verification
    game.turnStep = 4;
    App.setGame(game);
    const step4Html = App.actionsTabMarkup();
    assert(step4Html.includes('id="step-next"') && step4Html.includes('Next Step (Step 5 of 5) →'), 'Step 4 renders "Next Step (Step 5 of 5) →"');
    assert(!step4Html.includes('id="advance-year"'), 'Step 4 does not render confirm button');

    game.turnStep = 5;
    App.setGame(game);
    const step5Html = App.actionsTabMarkup();
    assert(step5Html.includes('id="advance-year"'), 'Step 5 renders confirm turn button');
    assert(step5Html.includes('Step 5 of 5 · The Recruitment Phase'), 'Step 5 displays "Step 5 of 5 · The Recruitment Phase"');

    // CSS check
    const css = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
    assert(css.includes('grid-template-columns: repeat(5, minmax(0, 1fr));'), '.v07-step-bar has 5 columns in styles.css');
  }

  console.log('\n================================================================');
  console.log(`SUMMARY: All ${passedTests}/${totalTests} Version 0.14.2 tests passed successfully!`);
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
