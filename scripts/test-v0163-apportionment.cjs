/**
 * Verification Test Suite for REQ-249 (Version 0.16.3)
 * Target: scripts/test-v0163-apportionment.cjs
 *
 * Covers Section 7 of VERSION_0.16.3_DESIGN.md:
 * - Largest-Remainder Method (Hare-Niemeyer):
 *   Adversarial 3-way splits (33,333 / 33,333 / 33,334):
 *     33,334 gets 334 units; each 33,333 gets 333 units. Sum = exactly 1,000 units.
 *   51-jurisdiction uniform distribution:
 *     100,000 / 51 = 1960.784... sum of integer units across all 51 states = exactly 1,000.
 * - UI Snapping (app.js):
 *   Inputs with data-state-alloc snap to multiples of 100 on change and blur events.
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

const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

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
    focus: () => { el._focused = true; },
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
  getElementById: (id) => (id === 'app' ? mockAppElement : elementRegistry.get(`#${id}`) || null),
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
  const Data = sandbox.window.PartyChairData;

  console.log('====================================================================');
  console.log(' TEST SUITE: REQ-249 Largest-Remainder Apportionment & Conservation');
  console.log('====================================================================\n');

  // Test 1: Adversarial 3-Way Split (33,333 / 33,333 / 33,334)
  console.log('Test 1: Adversarial 3-way split (33,333 / 33,333 / 33,334)');
  const split3 = {
    PA: 33333,
    MI: 33333,
    WI: 33334,
  };

  const apportioned3 = Engine.apportionSampleUnitsHareNiemeyer(split3, 1000);
  console.log('  Apportionment result:', apportioned3);

  assert(apportioned3.WI === 334, `WI gets 334 sample units (largest remainder): ${apportioned3.WI}`);
  assert(apportioned3.PA === 333, `PA gets 333 sample units: ${apportioned3.PA}`);
  assert(apportioned3.MI === 333, `MI gets 333 sample units: ${apportioned3.MI}`);

  const sum3 = Object.values(apportioned3).reduce((a, b) => a + b, 0);
  assert(sum3 === 1000, `Sum of sample units equals exactly 1,000: ${sum3}`);

  // Test 2: 51-Jurisdiction Spread (50 States + DC)
  console.log('\nTest 2: 51-way distribution across all states');
  const allStateIds = (Data.STATES || []).map((s) => s.id);
  const perStateVoters = Math.floor(100000 / allStateIds.length);
  const remainderVoters = 100000 - perStateVoters * allStateIds.length;

  const split51 = {};
  allStateIds.forEach((sid, idx) => {
    split51[sid] = perStateVoters + (idx < remainderVoters ? 1 : 0);
  });

  const sumInput51 = Object.values(split51).reduce((a, b) => a + b, 0);
  assert(sumInput51 === 100000, `Input allocation sums to exactly 100,000: ${sumInput51}`);

  const apportioned51 = Engine.apportionSampleUnitsHareNiemeyer(split51, 1000);
  const sum51 = Object.values(apportioned51).reduce((a, b) => a + b, 0);
  assert(sum51 === 1000, `Apportionment across 51 jurisdictions conserves exactly 1,000 sample units: ${sum51}`);

  // Test 3: Zero-Drift Invariant on Asymmetric Random-Like Distributions
  console.log('\nTest 3: Asymmetric distribution with prime-number slices');
  const splitAsym = {
    CA: 31415,
    TX: 27182,
    NY: 16180,
    FL: 14142,
    IL: 11081,
  };
  const sumAsym = Object.values(splitAsym).reduce((a, b) => a + b, 0);
  assert(sumAsym === 100000, `Input sums to 100,000: ${sumAsym}`);

  const apportionedAsym = Engine.apportionSampleUnitsHareNiemeyer(splitAsym, 1000);
  const sumAsymResult = Object.values(apportionedAsym).reduce((a, b) => a + b, 0);
  assert(sumAsymResult === 1000, `Apportionment conserves exactly 1,000 units on prime-like slices: ${sumAsymResult}`);

  // Test 4: UI Input Auto-Snapping to Multiples of 100 on change / blur
  console.log('\nTest 4: UI input auto-snapping on change/blur');
  App.setCustom(true);
  App.setCustomOrigin('not_major_movement');

  const paInput = createMockElement('input');
  paInput.dataset.stateAlloc = 'PA';
  elementRegistry.set('[data-state-alloc]', paInput);

  const totalEl = createMockElement('span', 'custom-100k-total');
  elementRegistry.set('#custom-100k-total', totalEl);

  const startBtn = createMockElement('button', 'start-game');
  elementRegistry.set('#start-game', startBtn);

  App.render();

  // Enter a non-multiple of 100 (e.g. 33333)
  paInput.value = '33333';
  paInput.dispatchEvent('change');

  assert(paInput.value === 33300, `Input snapped 33,333 to multiple of 100 (33,300): ${paInput.value}`);
  assert(App.getCustom100kStateAllocations().PA === 33300, `State variable updated to snapped value: ${App.getCustom100kStateAllocations().PA}`);

  // Test blur event with rounding up (e.g. 45678 -> 45700)
  paInput.value = '45678';
  paInput.dispatchEvent('blur');

  assert(paInput.value === 45700, `Input snapped 45,678 to multiple of 100 (45,700): ${paInput.value}`);
  assert(App.getCustom100kStateAllocations().PA === 45700, `State variable updated on blur: ${App.getCustom100kStateAllocations().PA}`);

  console.log(`\n====================================================================`);
  console.log(` REQ-249 RESULTS: ${passedTests} / ${totalTests} assertions passed.`);
  console.log(`====================================================================\n`);
})();
