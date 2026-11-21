/**
 * Verification Test Suite for REQ-245 (Version 0.16.3)
 * Target: scripts/test-v0163-faction-transfer.cjs
 *
 * Covers Section 3 of VERSION_0.16.3_DESIGN.md:
 * - Faction picker arithmetic: uses targetVoters / FACTION_NATIONAL_TOTALS; no 1.2M constant fallback.
 * - Card display: individual cards display X.XXM Voters at represented-voter scale.
 * - Creation sync: createGame initializes voterModel.affiliations.player with 100:1 ratio.
 * - Realignment preservation: realignVotingBlocksBetweenElections recomputes and preserves player affiliations.
 * - Load-time backfill: normalizeGame defensively reconstructs missing affiliations.player on legacy saves.
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
  let store = {};
  return {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
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
  console.log(' TEST SUITE: REQ-245 Faction Population Display & Voter Transfer');
  console.log('====================================================================\n');

  // Test 1: Picker Arithmetic & Absence of 1.2M Constant Fallback
  console.log('Test 1: Faction picker markup & arithmetic');
  App.setCustom(true);
  App.setCustomOrigin('civic_reform'); // uses faction picker
  App.setCustomSelectedFactionIds(['dem_capital_l_left']);
  const creatorHtml = App.customPartyCreatorMarkup();

  assert(!creatorHtml.includes('1200000') && !creatorHtml.includes('1.20M Voters · 1 Factions Selected'), 'No 1.2M fallback constant in picker total');
  const progExpected = (Data.FACTION_NATIONAL_TOTALS['dem_capital_l_left'] / 1000000).toFixed(2);
  assert(creatorHtml.includes(`${progExpected}M Voters · 1 Factions Selected`), `Picker displays exact target total: ${progExpected}M Voters`);

  // Test 2: Card Display
  console.log('\nTest 2: Faction card display format');
  assert(creatorHtml.includes(`${progExpected}M Voters`), `Faction card contains represented-voter population '${progExpected}M Voters'`);
  assert(creatorHtml.includes('Econ') && creatorHtml.includes('Soc'), 'Faction card retains Econ and Soc placements');

  // Test 3: Creation Sync - 100:1 Relationship in Affiliation Ledger
  console.log('\nTest 3: createGame national affiliation initialization');
  const chosenFactionId = 'dem_capital_l_left';
  const targetVoters = Data.FACTION_NATIONAL_TOTALS[chosenFactionId];
  const game = Engine.createGame({
    baseTemplateId: 'custom',
    customName: 'Progressive Alliance',
    customOrigin: 'civic_reform',
    selectedFactionIds: [chosenFactionId],
    customValues: {
      origin: 'civic_reform',
    },
  });

  assert(Boolean(game.voterModel?.affiliations?.player), 'game.voterModel.affiliations.player is populated');
  const playerAff = game.voterModel.affiliations.player;
  assert(playerAff.name === 'Progressive Alliance', `Player affiliation name matches: ${playerAff.name}`);
  assert(playerAff.representedVoters === targetVoters, `Represented voters match transferred total: ${playerAff.representedVoters}`);
  assert(playerAff.sampleVoters === Math.round(targetVoters / 100), `Sample voters maintain exact 100:1 ratio: ${playerAff.sampleVoters}`);

  // Test 4: Realignment Preservation Across Cycles
  console.log('\nTest 4: Realignment preservation across cycles');
  assert(game.voterModel.affiliations.player.sampleVoters > 0, 'Player affiliation sample units non-zero before realignment');

  // Call realignVotingBlocksBetweenElections
  Engine.realignVotingBlocksBetweenElections(game);
  assert(Boolean(game.voterModel?.affiliations?.player), 'Player affiliation exists after first realignment');
  assert(game.voterModel.affiliations.player.sampleVoters > 0, `Player sample voters non-zero after cycle 1: ${game.voterModel.affiliations.player.sampleVoters}`);
  assert(game.voterModel.affiliations.player.representedVoters === game.voterModel.affiliations.player.sampleVoters * 100, '100:1 relationship preserved after realignment');

  // Call second realignment
  Engine.realignVotingBlocksBetweenElections(game);
  assert(Boolean(game.voterModel?.affiliations?.player), 'Player affiliation exists after second realignment');
  assert(game.voterModel.affiliations.player.sampleVoters > 0, `Player sample voters non-zero after cycle 2: ${game.voterModel.affiliations.player.sampleVoters}`);

  // Test 5: Defensive Load-Time Backfill in normalizeGame
  console.log('\nTest 5: normalizeGame defensive backfill for legacy saves');
  const legacySave = JSON.parse(JSON.stringify(game));
  delete legacySave.voterModel.affiliations.player;
  assert(!legacySave.voterModel.affiliations.player, 'Simulated legacy save lacks affiliations.player');

  const normalized = Engine.normalizeGame(legacySave);
  assert(Boolean(normalized?.voterModel?.affiliations?.player), 'normalizeGame backfilled missing player affiliation');
  assert(normalized.voterModel.affiliations.player.representedVoters > 0, `Backfilled represented voters > 0: ${normalized.voterModel.affiliations.player.representedVoters}`);
  assert(normalized.voterModel.affiliations.player.sampleVoters === Math.round(normalized.voterModel.affiliations.player.representedVoters / 100), 'Backfilled sample voters obey 100:1 ratio');

  console.log(`\n====================================================================`);
  console.log(` REQ-245 RESULTS: ${passedTests} / ${totalTests} assertions passed.`);
  console.log(`====================================================================\n`);
})();
