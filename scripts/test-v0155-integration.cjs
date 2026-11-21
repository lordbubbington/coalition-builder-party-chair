/**
 * Master Verification & Integration Test Suite for Version 0.15.5
 * Target: scripts/test-v0155-integration.cjs
 *
 * Objectives (Covering VERSION_0.15.5_DESIGN.md):
 * 1. REQ-172: Persistent Multi-Cycle Voter Registration Carryover
 * 2. REQ-173: Multi-Party Forecaster Engine with Live Polling Integration & Turn/Phase Reactivity
 * 3. REQ-174: Third-Party Forecast Map Color Gradients & Legend Omission Protocol
 * 4. REQ-175: Voter Faction Realignment via 1/4th Shift Rule
 * 5. Invariants, Save Key & Version Migrations (0.15.5, partyChairGame.save.v15.5)
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

// Load script stack in canonical dependency order
loadScript('data.js');
loadScript('factions-0.15.js');
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

async function waitForApp() {
  let tries = 0;
  while (!sandbox.window.PartyChairApp && tries < 50) {
    await new Promise((r) => setTimeout(r, 100));
    tries++;
  }
  if (!sandbox.window.PartyChairApp) {
    throw new Error('PartyChairApp failed to initialize on window');
  }
  console.log('  ✅ PASS: PartyChairApp initialized on window');
}

async function runSuite() {
  await waitForApp();

  const Engine = sandbox.window.PartyChairEngine;
  const Data = sandbox.window.PartyChairData;
  const App = sandbox.window.PartyChairApp;

  assert(Boolean(Engine), 'PartyChairEngine initialized on window');
  assert(typeof Engine.buildForecasters === 'function', 'buildForecasters exported on Engine');
  assert(typeof Engine.estimateRaceMargin === 'function', 'estimateRaceMargin exported on Engine');
  assert(typeof Engine.realignVotingBlocksBetweenElections === 'function', 'realignVotingBlocksBetweenElections exported on Engine');
  assert(typeof Engine.startNextCycle === 'function', 'startNextCycle exported on Engine');

  console.log('================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.5 MASTER TEST SUITE');
  console.log('================================================================\n');

  // ============================================================================
  // SUITE 1: REQ-172 Persistent Multi-Cycle Voter Registration Carryover
  // ============================================================================
  console.log('--- SUITE 1: REQ-172 Persistent Multi-Cycle Voter Registration Carryover ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const initialNatTotal = game.voterModel.representedVoters;
    const initialPaVoters = game.voterModel.states.find((s) => s.stateId === 'PA' || s.id === 'PA').representedVoters;

    // Simulate voter registration gains in PA (+250,000 Democratic voters)
    Engine.addVotersToModel(game.voterModel, 'PA', 250000, 'people');
    const paAfter = game.voterModel.states.find((s) => s.stateId === 'PA' || s.id === 'PA').representedVoters;
    assert(paAfter === initialPaVoters + 250000, `PA voter roll incremented from ${initialPaVoters} to ${paAfter}`);
    assert(game.voterModel.representedVoters === initialNatTotal + 250000, 'National represented voters dynamically incremented');

    // Simulate cycle turnover via startNextCycle
    const nextGame = Engine.startNextCycle(game);

    // Verify PA voter count persists without being reset to static 155M baseline
    const paNext = nextGame.voterModel.states.find((s) => s.stateId === 'PA' || s.id === 'PA').representedVoters;
    assert(paNext === initialPaVoters + 250000, `PA voter roll retained cumulative gains into next cycle: ${paNext}`);
    assert(nextGame.voterModel.representedVoters === initialNatTotal + 250000, `National electorate retained cumulative gains into next cycle: ${nextGame.voterModel.representedVoters}`);

    // Verify Invariant: National total must equal the exact sum of all state voter rolls
    const sumStateVoters = nextGame.voterModel.states.reduce((acc, s) => acc + (s.representedVoters || 0), 0);
    assert(nextGame.voterModel.representedVoters === sumStateVoters, `National represented voters (${nextGame.voterModel.representedVoters}) exactly matches sum of state rolls (${sumStateVoters})`);

    // Verify Invariant: National faction totals must equal the sum of state faction counts
    let factionSumMatch = true;
    for (const fId of Object.keys(nextGame.voterModel.factions)) {
      const natCount = nextGame.voterModel.factions[fId];
      const sumStateFactions = nextGame.voterModel.states.reduce((acc, s) => acc + (s.factions?.[fId] || 0), 0);
      if (natCount !== sumStateFactions) {
        factionSumMatch = false;
        console.error(`Faction mismatch for ${fId}: nat=${natCount}, sumStates=${sumStateFactions}`);
        break;
      }
    }
    assert(factionSumMatch, 'All national faction counts match the sum of state faction matrices');
  }

  // ============================================================================
  // SUITE 2: REQ-173 Multi-Party Forecaster Engine with Live Polling & Reactivity
  // ============================================================================
  console.log('\n--- SUITE 2: REQ-173 Multi-Party Forecaster Engine with Live Polling & Reactivity ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const forecasters = Engine.buildForecasters(game);

    // Bernie Sanders (VT Senate) should yield an Independent projection
    const vtSenateRating = forecasters.consensus['senate:VT'];
    assert(vtSenateRating && vtSenateRating.includes('IND'), `Vermont Senate consensus forecaster projects Independent lead: "${vtSenateRating}"`);

    // Multi-Party Outlets test: Sallow, Cooked, Inside all evaluate multi-party ratings
    assert(forecasters.sallow['senate:VT'].includes('IND'), `Sallow's Crystal Ball projects IND for senate:VT: "${forecasters.sallow['senate:VT']}"`);
    assert(forecasters.cooked['senate:VT'].includes('IND'), `Cooked Political Report projects IND for senate:VT: "${forecasters.cooked['senate:VT']}"`);
    assert(forecasters.inside['senate:VT'].includes('IND'), `Upside Elections projects IND for senate:VT: "${forecasters.inside['senate:VT']}"`);

    // Commissioned Poll Integration
    // Commissioning a poll in PA Senate with Green or Libertarian lead
    game.treasury = 50;
    const pollResult = Engine.commissionRacePoll(game, { raceKey: 'senate:PA' });
    assert(Boolean(pollResult.commissionedPolls?.['senate:PA']), 'commissionRacePoll recorded poll in commissionedPolls');
    assert(Boolean(pollResult.forecasters), 'commissionRacePoll refreshed forecasters on returned state');

    // Test third-party lead rating generation (e.g. mock a 3rd party poll lead)
    const thirdPartyGame = JSON.parse(JSON.stringify(game));
    thirdPartyGame.commissionedPolls['senate:ME'] = {
      raceKey: 'senate:ME',
      stateId: 'ME',
      leadParty: 'IND',
      leadMargin: 12.5,
      sampledMargin: 12.5,
      cycleYear: 2028,
    };
    const meRating = Engine.evaluateRaceRatings(thirdPartyGame, 'senate:ME', 2.0, 0);
    assert(meRating.consensus.includes('IND'), `Maine Senate with commissioned IND lead evaluates to IND rating: "${meRating.consensus}"`);

    // Test consensus aggregation across diverse 3rd party ratings
    const consensusTest = Engine.consensusRating('Lean LIB', 'Likely LIB', 'Tilt LIB');
    assert(consensusTest === 'Lean LIB', `Consensus of Lean/Likely/Tilt LIB correctly aggregates to "Lean LIB" (got "${consensusTest}")`);

    const splitThirdConsensus = Engine.consensusRating('Solid GRN', 'Solid GRN', 'Likely GRN');
    assert(splitThirdConsensus === 'Solid GRN', `Consensus of Solid/Solid/Likely GRN aggregates to "Solid GRN" (got "${splitThirdConsensus}")`);

    // Verify Forecaster reactivity on operational turn advancement
    const turn1Game = Engine.advanceChairTurn(game);
    assert(Boolean(turn1Game.forecasters), 'advanceChairTurn updates forecasters reactively');

    // Verify Forecaster reactivity on campaign actions
    const fundingGame = Engine.allocateCandidateFunds(turn1Game, 'senate:PA', 5.0);
    assert(Boolean(fundingGame.forecasters), 'allocateCandidateFunds updates forecasters reactively');
  }

  // ============================================================================
  // SUITE 3: REQ-174 Third-Party Forecast Map Colors & Legend Omission Protocol
  // ============================================================================
  console.log('\n--- SUITE 3: REQ-174 Third-Party Forecast Map Colors & Legend Omission Protocol ---');
  {
    const Data = sandbox.window.PartyChairData;
    const tierColors = Data.TIER_13_COLORS;

    // Verify LIB colors (4-tier amber gradient)
    assert(tierColors['Solid LIB'] === '#b45309', `Solid LIB color is #b45309 (got ${tierColors['Solid LIB']})`);
    assert(tierColors['Likely LIB'] === '#d97706', `Likely LIB color is #d97706 (got ${tierColors['Likely LIB']})`);
    assert(tierColors['Lean LIB'] === '#f59e0b', `Lean LIB color is #f59e0b (got ${tierColors['Lean LIB']})`);
    assert(tierColors['Tilt LIB'] === '#fde68a', `Tilt LIB color is #fde68a (got ${tierColors['Tilt LIB']})`);

    // Verify GRN colors (4-tier emerald gradient)
    assert(tierColors['Solid GRN'] === '#047857', `Solid GRN color is #047857 (got ${tierColors['Solid GRN']})`);
    assert(tierColors['Likely GRN'] === '#10b981', `Likely GRN color is #10b981 (got ${tierColors['Likely GRN']})`);
    assert(tierColors['Lean GRN'] === '#34d399', `Lean GRN color is #34d399 (got ${tierColors['Lean GRN']})`);
    assert(tierColors['Tilt GRN'] === '#a7f3d0', `Tilt GRN color is #a7f3d0 (got ${tierColors['Tilt GRN']})`);

    // Verify CON, SOC, and IND colors
    assert(tierColors['Solid CON'] === '#581c87', `Solid CON color is #581c87`);
    assert(tierColors['Solid SOC'] === '#881337', `Solid SOC color is #881337`);
    assert(tierColors['Solid IND'] === '#0f766e', `Solid IND color is #0f766e`);

    // Verify Legend Omission Protocol: TIER_13_ORDER contains only standard 2-party continuum
    assert(Array.isArray(Engine.TIER_13_ORDER), 'TIER_13_ORDER is an array');
    assert(Engine.TIER_13_ORDER.length === 13, `TIER_13_ORDER has exactly 13 tiers (got ${Engine.TIER_13_ORDER.length})`);
    const containsThirdPartyInLegend = Engine.TIER_13_ORDER.some((t) => t.includes('LIB') || t.includes('GRN') || t.includes('CON') || t.includes('SOC') || t.includes('IND'));
    assert(!containsThirdPartyInLegend, 'TIER_13_ORDER strictly omits third-party ratings from the forecast legend continuum');

    // Verify App CSS classes in styles.css
    const cssContent = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
    assert(cssContent.includes('.rating-solid-lib'), 'styles.css includes .rating-solid-lib');
    assert(cssContent.includes('.rating-solid-grn'), 'styles.css includes .rating-solid-grn');
    assert(cssContent.includes('.rating-solid-con'), 'styles.css includes .rating-solid-con');
    assert(cssContent.includes('.rating-solid-soc'), 'styles.css includes .rating-solid-soc');
    assert(cssContent.includes('.rating-solid-ind'), 'styles.css includes .rating-solid-ind');
  }

  // ============================================================================
  // SUITE 4: REQ-175 Voter Faction Realignment via 1/4th Shift Rule
  // ============================================================================
  console.log('\n--- SUITE 4: REQ-175 Voter Faction Realignment via 1/4th Shift Rule ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'green' });
    const initialPaEco = game.voterModel.states.find((s) => s.stateId === 'PA' || s.id === 'PA').factions?.['grn_eco_socialist_vanguard'] || 0;
    const initialPaLeft = game.voterModel.states.find((s) => s.stateId === 'PA' || s.id === 'PA').factions?.['dem_capital_l_left'] || 0;

    // Create a mock election outcome where Green outperforms its baseline in PA
    const outcome = {
      presidentialResults: {
        PA: {
          shares: {
            people: 44,
            heritage: 45,
            green: 11, // Outperformed baseline
          },
        },
      },
      nationalVote: {
        green: 5,
      },
    };

    const realignedGame = Engine.realignVotingBlocksBetweenElections(game, outcome);
    const postPaEco = realignedGame.voterModel.states.find((s) => s.stateId === 'PA' || s.id === 'PA').factions?.['grn_eco_socialist_vanguard'] || 0;

    assert(postPaEco !== initialPaEco, `Green faction in PA experienced realignment transfer: ${initialPaEco} -> ${postPaEco}`);

    // Verify national faction totals match sum of state factions post-realignment
    let nationalReconciled = true;
    for (const fid of Object.keys(realignedGame.voterModel.factions)) {
      const natCount = realignedGame.voterModel.factions[fid];
      const sumStates = realignedGame.voterModel.states.reduce((acc, st) => acc + (st.factions?.[fid] || 0), 0);
      if (natCount !== sumStates) {
        nationalReconciled = false;
        console.error(`Post-realignment faction mismatch for ${fid}: nat=${natCount}, sumStates=${sumStates}`);
        break;
      }
    }
    assert(nationalReconciled, 'National voterModel.factions reconciled with state faction sums post-realignment');
  }

  // ============================================================================
  // SUITE 5: Invariants, Save Key & Version Migrations
  // ============================================================================
  console.log('\n--- SUITE 5: Invariants, Save Key & Version Migrations ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    assert(game.version === '0.15.5', `Game version is 0.15.5 (got ${game.version})`);
    assert(Engine.SAVE_KEY === 'partyChairGame.save.v15.5', `Engine SAVE_KEY is partyChairGame.save.v15.5 (got ${Engine.SAVE_KEY})`);

    // Verify Save & Load round-trip with current version
    mockLocalStorage.clear();
    Engine.saveGame(game);
    const loadedGame = Engine.loadGame();
    assert(Boolean(loadedGame), 'Game successfully loaded from localStorage');
    assert(loadedGame.version === '0.15.5', `Loaded game version is 0.15.5 (got ${loadedGame.version})`);

    // Verify Backward Compatibility: Loading a v15.4 save
    mockLocalStorage.clear();
    const v154Save = JSON.parse(JSON.stringify(game));
    v154Save.version = '0.15.4';
    mockLocalStorage.setItem('partyChairGame.save.v15.4', JSON.stringify(v154Save));

    const migratedGame = Engine.loadGame();
    assert(Boolean(migratedGame), 'Successfully migrated and loaded save from partyChairGame.save.v15.4');
    assert(migratedGame.version === '0.15.5', `Migrated game version normalized to 0.15.5 (got ${migratedGame.version})`);

    // Verify Backward Compatibility: Loading a v15.3 save
    mockLocalStorage.clear();
    const v153Save = JSON.parse(JSON.stringify(game));
    v153Save.version = '0.15.3';
    mockLocalStorage.setItem('partyChairGame.save.v15.3', JSON.stringify(v153Save));

    const migratedV153 = Engine.loadGame();
    assert(Boolean(migratedV153), 'Successfully migrated and loaded save from partyChairGame.save.v15.3');
    assert(migratedV153.version === '0.15.5', `Migrated game version normalized to 0.15.5 (got ${migratedV153.version})`);

    // Verify package.json version
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));
    assert(pkg.version === '0.15.5', `package.json version is 0.15.5 (got ${pkg.version})`);
  }

  console.log('\n================================================================');
  console.log(` ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (100%)`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:\n', err);
  process.exit(1);
});
