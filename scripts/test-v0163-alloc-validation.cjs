/**
 * Verification Test Suite for REQ-251 (Version 0.16.3)
 * Target: scripts/test-v0163-alloc-validation.cjs
 *
 * Covers Section 9 of VERSION_0.16.3_DESIGN.md:
 * - UI Launch Gating:
 *   #start-game button is disabled whenever customOrigin === 'not_major_movement' and allocSum !== 100,000.
 * - Validation Modal:
 *   Attempting launch with incomplete allocation renders modal overlay with exact copy:
 *   "State voter allocations sum to X / 100,000. Please allocate exactly 100,000 voters before launching."
 * - Full Allocation Launch:
 *   Exact 100,000 allocation enables button and allows game start.
 * - Engine-Level Guard:
 *   Calling createGame directly with an invalid allocation throws an Error rather than silently redirecting to PA.
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
    setAttribute: (k, v) => {
      el[k] = v;
      if (k === 'disabled') el.disabled = true;
    },
    removeAttribute: (k) => {
      delete el[k];
      if (k === 'disabled') el.disabled = false;
    },
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

  console.log('====================================================================');
  console.log(' TEST SUITE: REQ-251 100K State Allocation Validation & Gating');
  console.log('====================================================================\n');

  // Test 1: Button Gating in Render Markup (Partial Allocation)
  console.log('Test 1: Launch button disabled in markup when allocSum !== 100,000');
  App.setCustom(true);
  App.setCustomSelectedTemplate('custom');
  App.setCustomOrigin('not_major_movement');
  App.setCustomPartyName('Prairie Coalition');
  App.setCustom100kStateAllocations({ PA: 45000 }); // only 45,000 / 100,000

  const setupPartialHtml = App.setupMarkup();
  assert(setupPartialHtml.includes('id="start-game" class="button button-gold start-button" disabled'), 'Button has disabled attribute in rendered HTML');
  assert(setupPartialHtml.includes('opacity:0.5;cursor:not-allowed'), 'Button has disabled opacity and cursor styling');

  // Test 2: Validation Modal on Click Attempt with Incomplete Allocation
  console.log('\nTest 2: Validation modal triggers on click attempt with bad sum');
  const startBtn = createMockElement('button', 'start-game');
  elementRegistry.set('#start-game', startBtn);
  App.render();

  startBtn.dispatchEvent('click');
  assert(App.getAllocValidationModalOpen() === true, 'Validation modal opened on attempt');
  assert(App.getAllocValidationSum() === 45000, `Modal record shows exact partial sum: ${App.getAllocValidationSum()}`);

  const modalHtml = App.allocationValidationModalMarkup();
  const expectedCopy = 'State voter allocations sum to 45,000 / 100,000. Please allocate exactly 100,000 voters before launching.';
  assert(modalHtml.includes(expectedCopy), `Modal contains exact required copy: "${expectedCopy}"`);

  // Dismiss modal
  const closeBtn = createMockElement('button', 'btn-close-alloc-modal');
  elementRegistry.set('#btn-close-alloc-modal', closeBtn);
  App.render();
  closeBtn.dispatchEvent('click');
  assert(App.getAllocValidationModalOpen() === false, 'Modal closed on dismiss button click');

  // Test 3: Complete Allocation Enables Launch Button
  console.log('\nTest 3: Exactly 100,000 voters enables button and allows launch');
  App.setCustom100kStateAllocations({ PA: 50000, OH: 50000 });
  const setupCompleteHtml = App.setupMarkup();
  assert(!setupCompleteHtml.includes('disabled style="opacity:0.5;cursor:not-allowed"'), 'Complete 100,000 allocation removes disabled attribute');

  // Test 4: Engine-Level Guard Against Silent Collapse to PA
  console.log('\nTest 4: Engine fails loudly rather than silently collapsing to PA');
  let engineThrew = false;
  let thrownMessage = '';

  try {
    Engine.createGame({
      baseTemplateId: 'custom',
      customName: 'Illegal Movement',
      customOrigin: 'not_major_movement',
      customFactionName: 'Broken Wing',
      customFactionStateAllocations: { PA: 25000 }, // sum 25,000 !== 100,000
      customValues: {
        origin: 'not_major_movement',
      },
    });
  } catch (err) {
    engineThrew = true;
    thrownMessage = err.message;
  }

  assert(engineThrew === true, 'createGame threw an Error when state allocations did not sum to 100,000');
  assert(thrownMessage.includes('100,000'), `Error message explains required 100,000 sum: "${thrownMessage}"`);

  console.log(`\n====================================================================`);
  console.log(` REQ-251 RESULTS: ${passedTests} / ${totalTests} assertions passed.`);
  console.log(`====================================================================\n`);
})();
