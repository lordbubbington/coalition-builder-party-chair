/**
 * Diagnostic and Functional Test Suite for Decennial Redistricting & Dynamic Maps (REQ-62)
 */

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

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
  removeEventListener: () => {},
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
  Blob: global.Blob,
  DecompressionStream: global.DecompressionStream,
  Response: global.Response,
  localStorage: mockLocalStorage,
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

function loadScript(filePath) {
  const code = fs.readFileSync(path.resolve(root, filePath), 'utf8');
  vm.runInContext(code, ctx);
}

// Load full game stack
loadScript('data.js');
loadScript('scenario-2028.js');
loadScript('issues-0.2.1.js');
loadScript('maps-0.3.js');
loadScript('state-house-data-0.5.js');
loadScript('voter-model-0.5.js');
loadScript('demographics-0.9.js');
loadScript('political-trends-system.js');
loadScript('political-texture-system.js');
loadScript('party-systems-data.js');
loadScript('party-systems-coalition.js');
loadScript('party-systems-robots.js');
loadScript('party-systems-engine.js');
loadScript('campaign-overhaul.js');
loadScript('engine.js');

async function runTests() {
  if (sandbox.PartyChairData.VERSION_03_MAPS_READY) {
    await sandbox.PartyChairData.VERSION_03_MAPS_READY;
  }

  const Engine = sandbox.PartyChairEngine;

  console.log('=== TEST SUITE: DECENNIAL REDISTRICTING & MAP SYSTEM (REQ-62) ===\n');

  // 1. Test Huntington-Hill Apportionment for 2030
  console.log('Test 1: Huntington-Hill Apportionment Math (2030 Census populations)');
  const getPops = sandbox.PartyChairData.getDecennialStatePopulations;
  const apportion = sandbox.PartyChairData.apportionHuntingtonHill;

  assert(typeof getPops === 'function', 'getDecennialStatePopulations is defined');
  assert(typeof apportion === 'function', 'apportionHuntingtonHill is defined');

  const pops2030 = getPops(2030);
  const seats2030 = apportion(pops2030, 435);
  const totalSeats = Object.values(seats2030).reduce((sum, s) => sum + s, 0);
  console.log(`  Total apportioned seats: ${totalSeats} across ${Object.keys(seats2030).length} states`);
  assert.strictEqual(totalSeats, 435, 'Total apportioned seats must equal 435');

  // 2. Test Decennial Redistricting Engine Execution
  console.log('\nTest 2: runDecennialRedistricting Execution at Year 2030');
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2030;

  game = Engine.runDecennialRedistricting(game, 2030);

  assert.strictEqual(game.decennialRedistrictingResolved, true, 'decennialRedistrictingResolved is true');
  assert.strictEqual(game.lastDecennialYear, 2030, 'lastDecennialYear is 2030');
  assert.strictEqual(game.activeHouseMapKey, '2030 map', 'activeHouseMapKey is "2030 map"');
  assert(game['2030 map'], 'game["2030 map"] exists');
  assert.strictEqual(game.currentHouseMap, game['2030 map'], 'currentHouseMap points to 2030 map');

  const assembledMap = game['2030 map'];
  console.log(`  Assembled map total districts: ${assembledMap.districts.length}`);
  console.log(`  Assembled map total modelDistricts: ${assembledMap.modelDistricts.length}`);
  assert.strictEqual(assembledMap.districts.length, 435, 'Assembled map districts array must have 435 entries');
  assert.strictEqual(assembledMap.modelDistricts.length, 435, 'Assembled map modelDistricts array must have 435 entries');

  // Check PA (unchanged 17 seats): preserved baseline geometry
  const paDistricts = assembledMap.districts.filter(d => d.stateId === 'PA');
  assert.strictEqual(paDistricts.length, 17, 'PA has 17 districts');
  assert(paDistricts[0].q && paDistricts[0].q.length > 10, 'PA-1 has valid geometry');

  // Check TX (expanded from 38 to 40 seats)
  const txDistricts = assembledMap.districts.filter(d => d.stateId === 'TX');
  assert.strictEqual(txDistricts.length, 40, 'TX has 40 districts');
  const tx40 = assembledMap.districts.find(d => d.id === 'TX-40');
  assert(tx40, 'TX-40 district exists');
  assert(tx40.q && tx40.q.length > 5, 'TX-40 has clipped polygon geometry');
  assert(typeof tx40.cx === 'number' && typeof tx40.cy === 'number', 'TX-40 has numeric coordinates');

  // Check CA (decreased from 52 to 50 seats)
  const caDistricts = assembledMap.districts.filter(d => d.stateId === 'CA');
  assert.strictEqual(caDistricts.length, 50, 'CA has 50 districts');
  assert.strictEqual(assembledMap.districts.some(d => d.id === 'CA-51'), false, 'CA-51 absent');
  assert.strictEqual(assembledMap.districts.some(d => d.id === 'CA-52'), false, 'CA-52 absent');

  // 3. Test legislativeDistricts() post-redistricting
  console.log('\nTest 3: legislativeDistricts() returns redrawn districts');
  const legDistricts = Engine.legislativeDistricts(game);
  assert.strictEqual(legDistricts.length, 435, 'legislativeDistricts must return 435 districts');

  // 4. Test calculateDistrictElection() on redrawn map
  console.log('\nTest 4: calculateDistrictElection() on redrawn map');
  const electionResult = Engine.calculateDistrictElection(game, 2032);
  assert.strictEqual(electionResult.representatives.length, 435, 'Must elect exactly 435 representatives');
  const electedTx = electionResult.representatives.filter(r => r.stateId === 'TX');
  assert.strictEqual(electedTx.length, 40, 'Elected 40 representatives for Texas');
  const electedCa = electionResult.representatives.filter(r => r.stateId === 'CA');
  assert.strictEqual(electedCa.length, 50, 'Elected 50 representatives for California');
  console.log('  ✓ 435 representatives successfully elected across new apportionment');

  // 5. Test Forecasters on Redistricted Districts
  console.log('\nTest 5: Forecasters & Race Margins on Redistricted Districts');
  game.representatives = electionResult.representatives;
  const forecasters = Engine.buildForecasters(game);
  assert(forecasters.consensus['house:TX-40'], 'Consensus forecaster includes house:TX-40');
  assert(forecasters.sallow['house:TX-40'], 'Sallow forecaster includes house:TX-40');
  assert(forecasters.cooked['house:TX-40'], 'Cooked forecaster includes house:TX-40');
  assert(forecasters.inside['house:TX-40'], 'Inside forecaster includes house:TX-40');
  console.log('  TX-40 Forecaster ratings:', {
    consensus: forecasters.consensus['house:TX-40'],
    sallow: forecasters.sallow['house:TX-40'],
    cooked: forecasters.cooked['house:TX-40'],
    inside: forecasters.inside['house:TX-40'],
  });
  console.log('  ✓ Forecasters successfully evaluate newly apportioned districts');

  // 6. Test App.js Renderer Integration
  console.log('\nTest 6: App.js Map Renderer Integration');
  loadScript('factions-0.15.js');
  loadScript('v07-scaffolding.js');
  loadScript('party-systems-ui.js');
  loadScript('ballot-access.js');
  loadScript('election-uncertainty.js');
  loadScript('candidate-vetting.js');
  loadScript('election-drift.js');
  loadScript('election-night-engine.js');
  loadScript('app.js');

  let tries = 0;
  while (!sandbox.window.PartyChairApp && tries < 50) {
    await new Promise((r) => setTimeout(r, 50));
    tries++;
  }
  const App = sandbox.window.PartyChairApp;
  assert(App, 'PartyChairApp initialized on window');

  // Set active game in sandbox
  sandbox.game = game;
  const houseMap = App.nationalMapSvg('house', { forecaster: false });
  assert(houseMap && typeof houseMap.view === 'string', 'nationalMapSvg returns map object with view SVG string');
  assert(houseMap.view.includes('TX-40'), 'House SVG map contains TX-40 district');
  assert(!houseMap.view.includes('CA-51: Result pending (uncalled)'), 'House SVG map does not contain orphaned CA-51');
  assert(!houseMap.view.includes('CA-52: Result pending (uncalled)'), 'House SVG map does not contain orphaned CA-52');
  console.log('  ✓ nationalMapSvg("house") correctly renders redistricted map geometry and seats');

  // Check forecaster mode SVG
  const houseForecasterMap = App.nationalMapSvg('house', { forecaster: true });
  assert(houseForecasterMap && typeof houseForecasterMap.view === 'string', 'nationalMapSvg forecaster returns view SVG string');
  assert(houseForecasterMap.view.includes('TX-40 District · Rating:'), 'Forecaster SVG map includes TX-40 rating tooltip');
  console.log('  ✓ nationalMapSvg("house", { forecaster: true }) correctly renders forecaster map with redistricted seats');

  console.log('\n=== ALL REDISTRICTING MAP CHECKS PASSED SUCCESSFULLY ===');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
