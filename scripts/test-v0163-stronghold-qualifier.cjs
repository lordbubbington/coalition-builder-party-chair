/**
 * Test Suite for REQ-255: Targetable Opponent Stronghold Dropdown Qualification Indicator
 * Target: scripts/test-v0163-stronghold-qualifier.cjs
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('Testing REQ-255 Targetable Opponent Stronghold Dropdown Qualification Indicator...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✅ PASS: ${message}`);
}

const mockAppElement = {
  innerHTML: '',
  classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
  insertAdjacentHTML: () => {},
  addEventListener: () => {},
};

const mockDocument = {
  querySelectorAll: () => [],
  querySelector: () => mockAppElement,
  getElementById: () => mockAppElement,
  addEventListener: () => {},
};

const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
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
  Boolean: Boolean,
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
  if (sandbox.window.PartyChairData?.VERSION_03_MAPS_READY) {
    await sandbox.window.PartyChairData.VERSION_03_MAPS_READY;
  }
  await new Promise((r) => setTimeout(r, 50));

  const renderSelector = sandbox.window.renderTargetTerritorySelectorMarkup || sandbox.window.PartyChairApp?.renderTargetTerritorySelectorMarkup;
  assert(typeof renderSelector === 'function', 'renderTargetTerritorySelectorMarkup is exported and callable');

  const quest = {
    id: 'crack-opponent-stronghold',
    name: 'Crack an Opponent Stronghold',
    isTargetable: true,
  };

  const game = {
    player: { id: 'people', baseTemplateId: 'people' },
    priorities: { handLocked: false },
    customPriorityTracking: {},
  };

  // Known shares matrix with above-threshold, exact-threshold, and below-threshold values
  const knownShares = {
    OH: 58.0, // Qualifying (>= 55%)
    WY: 65.0, // Qualifying (>= 55%)
    TX: 55.0, // Exact threshold (>= 55%)
    PA: 50.0, // Non-qualifying (< 55%)
    FL: 54.9, // Just below threshold (< 55%)
    CA: 35.0, // Non-qualifying (< 55%)
    VT: 30.0, // Non-qualifying (< 55%)
  };

  const html = renderSelector(game, quest, 'OH', knownShares);
  assert(Boolean(html && html.includes('<select')), 'Selector HTML markup renders successfully');

  // Parse options from rendered HTML
  const optionRegex = /<option\s+value="([^"]+)"([^>]*)>([\s\S]*?)<\/option>/g;
  const options = [];
  let match;
  while ((match = optionRegex.exec(html)) !== null) {
    const stateId = match[1];
    const attrs = match[2];
    const text = match[3];
    const isDisabled = attrs.includes('disabled');
    const isSelected = attrs.includes('selected');
    options.push({ stateId, attrs, text, isDisabled, isSelected });
  }

  assert(options.length === 50, `Selector includes all 50 states (got ${options.length})`);

  // 1. Assert only >= 55% states are targetable
  console.log('\n--- Checking Targetability & Disabled Status ---');
  const ohOption = options.find((o) => o.stateId === 'OH');
  const wyOption = options.find((o) => o.stateId === 'WY');
  const txOption = options.find((o) => o.stateId === 'TX');
  const paOption = options.find((o) => o.stateId === 'PA');
  const flOption = options.find((o) => o.stateId === 'FL');
  const caOption = options.find((o) => o.stateId === 'CA');

  assert(ohOption && !ohOption.isDisabled, 'OH (58%) is targetable (not disabled)');
  assert(wyOption && !wyOption.isDisabled, 'WY (65%) is targetable (not disabled)');
  assert(txOption && !txOption.isDisabled, 'TX (55% exact) is targetable (not disabled)');
  assert(paOption && paOption.isDisabled, 'PA (50%) is non-targetable (disabled)');
  assert(flOption && flOption.isDisabled, 'FL (54.9%) is non-targetable (disabled)');
  assert(caOption && caOption.isDisabled, 'CA (35%) is non-targetable (disabled)');

  // 2. Assert threshold states render the qualifying flag
  console.log('\n--- Checking Qualifying Flag Rendering ---');
  assert(ohOption.text.includes('★ Hostile Stronghold') || ohOption.text.includes('Stronghold'), 'OH renders qualifying stronghold flag');
  assert(wyOption.text.includes('★ Hostile Stronghold') || wyOption.text.includes('Stronghold'), 'WY renders qualifying stronghold flag');
  assert(txOption.text.includes('★ Hostile Stronghold') || txOption.text.includes('Stronghold'), 'TX (threshold boundary) renders qualifying stronghold flag');
  assert(!paOption.text.includes('★ Hostile Stronghold'), 'PA (< 55%) does NOT render qualifying stronghold flag');
  assert(!flOption.text.includes('★ Hostile Stronghold'), 'FL (< 55%) does NOT render qualifying stronghold flag');

  // 3. Assert Rule 7 compliance: label copy contains no numeric strings / percentages
  console.log('\n--- Checking Rule 7 (No Raw Numbers / Percentages) ---');
  options.forEach((opt) => {
    assert(!opt.text.includes('%'), `Option ${opt.stateId} contains no percentage sign: "${opt.text}"`);
    assert(!/\d/.test(opt.text), `Option ${opt.stateId} contains no numeric digits: "${opt.text}"`);
  });

  // Check label text as well
  const labelMatch = html.match(/<label[^>]*>([\s\S]*?)<\/label>/);
  if (labelMatch) {
    assert(!labelMatch[1].includes('%'), 'Label contains no percentage sign');
    assert(!/\d/.test(labelMatch[1]), 'Label contains no numeric digits');
  }

  console.log(`\n✅ All REQ-255 stronghold qualifier checks passed (${passedTests}/${totalTests} assertions).`);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
