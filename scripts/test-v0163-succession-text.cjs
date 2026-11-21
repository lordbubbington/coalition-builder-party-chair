/**
 * Test Suite for REQ-256: Succession Crisis Atmospheric Text & Trait Interpolation
 * Target: scripts/test-v0163-succession-text.cjs
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('Testing REQ-256 Succession Crisis Atmospheric Text & Trait Interpolation...\n');

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

  const renderSuccession = sandbox.window.renderSuccessionCrisisModalMarkup || sandbox.window.PartyChairApp?.renderSuccessionCrisisModalMarkup;
  assert(typeof renderSuccession === 'function', 'renderSuccessionCrisisModalMarkup is exported and callable');

  // Test Case 1: Custom founder with explicit traits array
  console.log('\n--- Test Case 1: Explicit Founder & Archetype Traits ---');
  const game1 = {
    founderLegacy: {
      active: true,
      successionTriggered: true,
      successionResolved: false,
      founderName: 'Elena Rostova',
      successionTriggerReason: 'retirement',
      archetypeTraits: ['Civic Reform', 'Big-Tent Pragmatism'],
    },
    player: { name: 'Civic Renewal Party' },
  };

  const html1 = renderSuccession(game1);
  assert(Boolean(html1 && html1.includes('succession-modal-panel')), 'Succession modal renders for Elena Rostova');
  assert(html1.includes('Elena Rostova'), 'Founder name Elena Rostova appears in the succession modal');
  assert(html1.includes('Civic Reform'), 'Trait phrase "Civic Reform" appears in succession option text');
  assert(html1.includes('Big-Tent Pragmatism'), 'Trait phrase "Big-Tent Pragmatism" appears in succession option text');

  // Extract option descriptions and effect blocks
  const cardRegex = /<div class="succession-card">([\s\S]*?)<\/button>\s*<\/div>/g;
  let cardMatch;
  let cardCount1 = 0;
  while ((cardMatch = cardRegex.exec(html1)) !== null) {
    cardCount1++;
    const cardContent = cardMatch[1];
    // Option copy: text in <p>, .succession-effect, heading and button
    const cardText = cardContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    assert(!cardText.includes('%'), `Card ${cardCount1} copy contains no percentage sign: "${cardText}"`);
    assert(!/\d/.test(cardText), `Card ${cardCount1} copy contains no numeric digits: "${cardText}"`);
  }
  assert(cardCount1 === 3, `All 3 succession cards rendered (got ${cardCount1})`);

  // Test Case 2: Custom party with origin archetype & charter trait IDs
  console.log('\n--- Test Case 2: Origin Archetype & Charter Traits via IDs ---');
  const game2 = {
    founderLegacy: {
      active: true,
      successionTriggered: true,
      successionResolved: false,
      founderName: 'Marcus Vance',
      successionTriggerReason: 'aura_expired',
    },
    customParty: {
      originStoryId: 'grassroots_viral',
      charterTraitIds: ['state_first_federation'],
    },
    customLeaderArchetype: 'activist-organizer',
    player: { name: 'Solidarity Movement' },
  };

  const html2 = renderSuccession(game2);
  assert(Boolean(html2 && html2.includes('succession-modal-panel')), 'Succession modal renders for Marcus Vance');
  assert(html2.includes('Marcus Vance'), 'Founder name Marcus Vance appears in modal');
  assert(html2.includes('Grassroots Viral Movement'), 'Origin archetype "Grassroots Viral Movement" appears in option text');
  assert(html2.includes('State-First Federation'), 'Charter trait "State-First Federation" appears in option text');

  let cardCount2 = 0;
  while ((cardMatch = cardRegex.exec(html2)) !== null) {
    cardCount2++;
    const cardContent = cardMatch[1];
    const cardText = cardContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    assert(!cardText.includes('%'), `Game2 Card ${cardCount2} copy contains no percentage sign: "${cardText}"`);
    assert(!/\d/.test(cardText), `Game2 Card ${cardCount2} copy contains no numeric digits: "${cardText}"`);
  }
  assert(cardCount2 === 3, `All 3 succession cards rendered for Game 2`);

  // Test Case 3: Major Defeat reason & Fallback Founder Name
  console.log('\n--- Test Case 3: Major Defeat Trigger Reason & Personality Interpolation ---');
  const game3 = {
    founderLegacy: {
      active: true,
      successionTriggered: true,
      successionResolved: false,
      founderName: 'Jordan Sterling',
      successionTriggerReason: 'major_defeat',
      founderArchetypeId: 'celebrity',
    },
    player: { leaderName: 'Jordan Sterling' },
  };

  const html3 = renderSuccession(game3);
  assert(html3.includes('Jordan Sterling'), 'Founder name Jordan Sterling appears');
  assert(html3.includes('Celebrity'), 'Leader archetype Celebrity appears');
  assert(!html3.includes('+10%'), 'Old raw "+10%" fundraising lift is completely removed');

  let cardCount3 = 0;
  while ((cardMatch = cardRegex.exec(html3)) !== null) {
    cardCount3++;
    const cardContent = cardMatch[1];
    const cardText = cardContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    assert(!cardText.includes('%'), `Game3 Card ${cardCount3} copy contains no percentage sign: "${cardText}"`);
    assert(!/\d/.test(cardText), `Game3 Card ${cardCount3} copy contains no numeric digits: "${cardText}"`);
  }
  assert(cardCount3 === 3, `All 3 succession cards rendered for Game 3`);

  console.log(`\n✅ All REQ-256 succession text checks passed (${passedTests}/${totalTests} assertions).`);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
