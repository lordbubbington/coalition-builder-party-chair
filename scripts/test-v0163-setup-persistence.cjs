/**
 * Verification Test Suite for REQ-246 & REQ-263 (Version 0.16.3)
 * Target: scripts/test-v0163-setup-persistence.cjs
 *
 * Covers:
 * - Section 4 (REQ-246): Mode exit, issue position persistence across preset toggling, input sync, reset boundary.
 * - Section 21 (REQ-263): #start-game custom-prefixed selectors, validation focus on #custom-party-name, full game launch lift-through.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

const mockLocalStorage = (() => {
  let store = {
    'partyChairGame.tutorial.v07': JSON.stringify({ status: 'completed' }),
  };
  return {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

// DOM Mocking Infrastructure
const elementRegistry = new Map();

function createMockElement(tagName = 'div', id = '', classes = []) {
  const classList = new Set(classes);
  const listeners = {};
  const el = {
    tagName: tagName.toUpperCase(),
    id,
    value: '',
    checked: false,
    disabled: false,
    style: {},
    dataset: {},
    classList: {
      add: (c) => classList.add(c),
      remove: (c) => classList.delete(c),
      toggle: (c) => (classList.has(c) ? classList.delete(c) : classList.add(c)),
      contains: (c) => classList.has(c),
    },
    addEventListener: (type, fn) => {
      listeners[type] = listeners[type] || [];
      listeners[type].push(fn);
    },
    dispatchEvent: (type, eventObj = {}) => {
      const evt = { target: el, currentTarget: el, type, ...eventObj };
      (listeners[type] || []).forEach((fn) => fn(evt));
    },
    focus: () => {
      el._focused = true;
    },
    setAttribute: (k, v) => { el[k] = v; },
    removeAttribute: (k) => { delete el[k]; },
    insertAdjacentHTML: () => {},
    innerHTML: '',
  };
  return el;
}

const mockAppElement = createMockElement('div', 'app');

const mockDocument = {
  querySelectorAll: (selector) => {
    const results = [];
    for (const [sel, el] of elementRegistry.entries()) {
      if (sel === selector || (sel.startsWith(selector) && sel.length >= selector.length)) {
        results.push(el);
      }
    }
    return results;
  },
  querySelector: (selector) => {
    if (selector === '#app') return mockAppElement;
    return elementRegistry.get(selector) || null;
  },
  getElementById: (id) => {
    if (id === 'app') return mockAppElement;
    return elementRegistry.get(`#${id}`) || null;
  },
  addEventListener: () => {},
};

const sandbox = {
  window: {},
  document: mockDocument,
  localStorage: mockLocalStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math,
  JSON: JSON,
  Number: Number,
  String: String,
  Array: Array,
  Object: Object,
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
};
sandbox.window = sandbox;
sandbox.window.document = mockDocument;
const ctx = vm.createContext(sandbox);

function loadScript(relPath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', relPath), 'utf8');
  vm.runInContext(code, ctx, { filename: relPath });
}

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
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'engine.js',
  'app.js',
].forEach(loadScript);

(async () => {
  await new Promise((r) => setTimeout(r, 100));

  const Engine = sandbox.window.PartyChairEngine;
  const App = sandbox.window.PartyChairApp;

  console.log('====================================================================');
  console.log(' TEST SUITE: REQ-246 & REQ-263 Setup Persistence & Input Selectors');
  console.log('====================================================================\n');

  // Test 1: Mode Exit ([data-template] clears custom mode)
  console.log('Test 1: Preset party selection exits custom mode');
  App.setCustom(true);
  App.setCustomSelectedTemplate('custom');
  assert(App.getCustom() === true, 'Custom mode initially active');

  // Register preset button elements
  const peopleBtn = createMockElement('button', '', ['archetype']);
  peopleBtn.dataset.template = 'people';
  elementRegistry.set('[data-template]', peopleBtn);

  // Re-run render to bind listeners
  App.render();
  peopleBtn.dispatchEvent('click');

  assert(App.getCustom() === false, 'Clicking preset button sets custom = false');
  assert(App.getCustomSelectedTemplate() === 'people', 'Selected template switched to preset (people)');

  const setupHtml = App.setupMarkup();
  assert(!setupHtml.includes('Design Your New Political Movement'), 'Creator drawer hidden when in preset mode');
  assert(setupHtml.includes('data-template="people" class="archetype selected"'), 'Preset party has selected class');

  // Test 2: Choice Persistence Across Party Switching
  console.log('\nTest 2: Choice persistence across party switches');
  App.setCustom(true);
  App.setCustomSelectedTemplate('custom');
  App.setCustomPartyName('Liberty & Justice Movement');
  App.setCustomLeaderName('Alex Vance');
  App.setCustomPartyColor('#10b981');
  App.setCustomPartyMotto('Forward Together.');
  App.setCustomIssuePositions({ 'minimum-wage': 9, 'climate-action': 8 });

  // Toggle to preset party Heritage
  const heritageBtn = createMockElement('button', '', ['archetype']);
  heritageBtn.dataset.template = 'heritage';
  elementRegistry.set('[data-template]', heritageBtn);
  App.render();
  heritageBtn.dispatchEvent('click');

  assert(App.getCustom() === false, 'Switched to Heritage (custom = false)');
  assert(App.getCustomSelectedTemplate() === 'heritage', 'Template is now heritage');

  // Positions and metadata MUST be intact
  const savedPositions = App.getCustomIssuePositions();
  assert(Boolean(savedPositions), 'Custom issue positions NOT wiped on preset click (no null wipe)');
  assert(savedPositions['minimum-wage'] === 9, 'Custom issue position minimum-wage preserved');
  assert(savedPositions['climate-action'] === 8, 'Custom issue position climate-action preserved');
  assert(App.getCustomPartyName() === 'Liberty & Justice Movement', 'Party name preserved');
  assert(App.getCustomLeaderName() === 'Alex Vance', 'Leader name preserved');
  assert(App.getCustomPartyColor() === '#10b981', 'Party color preserved');
  assert(App.getCustomPartyMotto() === 'Forward Together.', 'Party motto preserved');

  // Switch back to custom mode
  App.setCustom(true);
  App.setCustomSelectedTemplate('custom');
  assert(App.getCustom() === true, 'Returned to custom mode');
  assert(App.getCustomIssuePositions()['minimum-wage'] === 9, 'Positions restored intact upon return');

  // Test 3: Input Synchronization (REQ-246 & REQ-263 consolidated listeners)
  console.log('\nTest 3: Real-time input synchronization');
  const customNameInput = createMockElement('input', 'custom-party-name');
  const customLeaderInput = createMockElement('input', 'custom-leader-name');
  const customColorInput = createMockElement('input', 'custom-party-color');
  const customColorHexInput = createMockElement('input', 'custom-party-color-hex');

  elementRegistry.set('#custom-party-name', customNameInput);
  elementRegistry.set('#custom-leader-name', customLeaderInput);
  elementRegistry.set('#custom-party-color', customColorInput);
  elementRegistry.set('#custom-party-color-hex', customColorHexInput);

  App.render();

  customNameInput.value = 'New Horizons Party';
  customNameInput.dispatchEvent('input', { target: customNameInput });
  assert(App.getCustomPartyName() === 'New Horizons Party', 'Party name synced on input event');

  customLeaderInput.value = 'Morgan Taylor';
  customLeaderInput.dispatchEvent('change', { target: customLeaderInput });
  assert(App.getCustomLeaderName() === 'Morgan Taylor', 'Leader name synced on change event');

  customColorHexInput.value = '#ec4899';
  customColorHexInput.dispatchEvent('input', { target: customColorHexInput });
  assert(App.getCustomPartyColor() === '#ec4899', 'Party color synced from hex input');
  assert(customColorInput.value === '#ec4899', 'Color picker input updated to match hex input');

  // Test 4: Validation Guard & Focus Target on Empty Name (REQ-263 Part 2)
  console.log('\nTest 4: Empty name validation highlights #custom-party-name');
  App.setCustomPartyName('');
  customNameInput.value = '';
  customNameInput._focused = false;
  customNameInput.classList.remove('invalid');

  const startBtn = createMockElement('button', 'start-game');
  elementRegistry.set('#start-game', startBtn);
  App.render();

  startBtn.dispatchEvent('click');
  assert(customNameInput._focused === true, '#custom-party-name received focus on validation failure');
  assert(customNameInput.classList.contains('invalid'), '#custom-party-name received .invalid class');
  assert(!App.getGame(), 'Game creation aborted on empty name');

  // Test 5: Successful Game Launch Lift-Through & Reset Boundary
  console.log('\nTest 5: Full game launch lift-through and post-launch setup reset');
  App.setCustomPartyName('Solidarity Union');
  App.setCustomLeaderName('Samira Khan');
  App.setCustomPartyColor('#6366f1');
  App.setCustomOrigin('civic_reform');
  App.setCustomSelectedFactionIds(['dem_capital_l_left']);
  customNameInput.value = 'Solidarity Union';
  customLeaderInput.value = 'Samira Khan';
  customColorHexInput.value = '#6366f1';
  customColorInput.value = '#6366f1';

  startBtn.dispatchEvent('click');
  const launchedGame = App.getGame();
  assert(Boolean(launchedGame), 'Game successfully launched on Take the Chair');
  assert(launchedGame.player.name === 'Solidarity Union', `Launched party name is Solidarity Union: ${launchedGame.player.name}`);
  assert(launchedGame.player.color === '#6366f1', `Launched party color is #6366f1: ${launchedGame.player.color}`);
  assert(launchedGame.player.leaderName === 'Samira Khan', `Launched leader name is Samira Khan: ${launchedGame.player.leaderName}`);

  // Assert reset boundary: setup defaults restored AFTER launch
  assert(App.getCustom() === false, 'Setup state custom reset to false post-launch');
  assert(App.getCustomPartyName() === '', 'Setup customPartyName reset to default');
  assert(App.getCustomIssuePositions() === null, 'Setup customIssuePositions reset to null');

  console.log(`\n====================================================================`);
  console.log(` REQ-246 & REQ-263 RESULTS: ${passedTests} / ${totalTests} assertions passed.`);
  console.log(`====================================================================\n`);
})();
