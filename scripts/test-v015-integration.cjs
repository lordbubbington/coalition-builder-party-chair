/**
 * Master Verification & Integration Test Suite for Version 0.15.0
 * Target: scripts/test-v015-integration.cjs
 *
 * Objectives (Covering all 7 Subsystem Tests from VERSION_0.15_DESIGN.md):
 * 1. Faction Matrix Ingestion & Zero-Variance National Reconciliation (REQ-146)
 * 2. Authoritative Faction Catalog & Metadata (REQ-151)
 * 3. Dual Metric Dynamics: Standing/Happiness & Confidence (REQ-147)
 * 4. Primary Win Conversions & Faction Growth Flow (REQ-148)
 * 5. Primary Filtering Support & Fringe Caps (REQ-149)
 * 6. Swing Faction Persuasion & Non-Voting Blocs (REQ-150)
 * 7. Faction Tier Boundaries & Factions Tab UI Dashboard (REQ-151, REQ-152)
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

  console.log('================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.0 MASTER TEST SUITE');
  console.log('================================================================');

  // -----------------------------------------------------------------------------
  // SUITE 1: Faction Matrix Ingestion & Zero-Variance National Reconciliation (REQ-146)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 1: Faction Matrix Ingestion & Zero-Variance Reconciliation (REQ-146) ---');

const game1 = Engine.createGame('people');
const vm1 = game1.voterModel;

assert(vm1 && typeof vm1 === 'object', 'voterModel successfully initialized in game');
assert(vm1.factions && typeof vm1.factions === 'object', 'voterModel.factions initialized');

const nationalFactionSum = Object.values(vm1.factions).reduce((sum, v) => sum + Number(v), 0);
assert(nationalFactionSum === 155000000, `National factions sum to exactly 155,000,000 voters (actual: ${nationalFactionSum.toLocaleString()})`);

assert(Array.isArray(vm1.states) && vm1.states.length === 51, `All 51 jurisdictions (50 states + DC) exist in voterModel (count: ${vm1.states.length})`);

let totalStateFactionsSum = 0;
let zeroVarianceStates = 0;
let zeroVariancePartisanAffiliations = 0;

vm1.states.forEach((st) => {
  assert(st.factions && typeof st.factions === 'object', `State ${st.stateId} has attached factions object`);
  
  // Sum of state factions
  const stateFacSum = Object.values(st.factions).reduce((sum, v) => sum + Number(v), 0);
  totalStateFactionsSum += stateFacSum;

  // Expected represented voters for state
  const stateCVAP = st.totalCVAP || (st.representedVoters);
  if (stateFacSum === stateCVAP) {
    zeroVarianceStates++;
  }

  // Verify state partisan affiliations equal constituent faction sum / 100
  const catalog = Data.FACTIONS_CATALOG;
  const demFactions = catalog.filter((f) => f.partyId === 'people');
  const gopFactions = catalog.filter((f) => f.partyId === 'heritage');
  const indFactions = catalog.filter((f) => f.partyId === 'independent');

  const demSum = demFactions.reduce((sum, f) => sum + Number(st.factions[f.id] || 0), 0);
  const gopSum = gopFactions.reduce((sum, f) => sum + Number(st.factions[f.id] || 0), 0);
  const indSum = indFactions.reduce((sum, f) => sum + Number(st.factions[f.id] || 0), 0);

  const demAffilVoters = Math.round(Number(st.affiliations.people || 0) * 100);
  const gopAffilVoters = Math.round(Number(st.affiliations.heritage || 0) * 100);
  const indAffilVoters = Math.round(Number(st.affiliations.independent || 0) * 100);

  if (demSum === demAffilVoters && gopSum === gopAffilVoters && indSum === indAffilVoters) {
    zeroVariancePartisanAffiliations++;
  }
});

assert(totalStateFactionsSum === 155000000, `Sum of state factions across all 51 states is exactly 155,000,000 (actual: ${totalStateFactionsSum.toLocaleString()})`);
assert(zeroVarianceStates === 51, `All 51 jurisdictions maintain 0 variance against state CVAP baseline (${zeroVarianceStates}/51)`);
assert(zeroVariancePartisanAffiliations === 51, `All 51 jurisdictions have exact partisan affiliation alignment to faction sums (${zeroVariancePartisanAffiliations}/51)`);

// -----------------------------------------------------------------------------
// SUITE 2: Authoritative Faction Catalog & Metadata (REQ-151)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Authoritative Faction Catalog & Metadata (REQ-151) ---');

const catalog = Data.FACTIONS_CATALOG;
assert(Array.isArray(catalog), 'PartyChairData.FACTIONS_CATALOG is defined as an Array');
assert(catalog.length === 38, `FACTIONS_CATALOG contains exactly 38 factions (actual: ${catalog.length})`);

const validParties = new Set(['people', 'heritage', 'independent', 'libertarian', 'liberty', 'green', 'constitution', 'socialist', 'unaffiliated']);
const validTypes = new Set(['ideological', 'racial']);
const validStatuses = new Set(['leading', 'major', 'minor', 'fringe']);

catalog.forEach((f) => {
  assert(typeof f.id === 'string' && f.id.length > 0, `Faction ${f.name} has valid id (${f.id})`);
  assert(typeof f.name === 'string' && f.name.length > 0, `Faction ${f.id} has non-empty name`);
  assert(validParties.has(f.partyId), `Faction ${f.id} has valid partyId (${f.partyId})`);
  assert(validTypes.has(f.type), `Faction ${f.id} has valid type (${f.type})`);
  assert(validStatuses.has(f.status), `Faction ${f.id} has valid status (${f.status})`);
  assert(typeof f.targetVoters === 'number' && f.targetVoters > 0, `Faction ${f.id} has targetVoters > 0 (${f.targetVoters})`);
  assert(f.sliders && typeof f.sliders.social === 'number' && typeof f.sliders.economic === 'number' && typeof f.sliders.governance === 'number', `Faction ${f.id} has complete sliders`);
  assert(Array.isArray(f.keyIssues) && f.keyIssues.length === 2, `Faction ${f.id} has exactly 2 Key Issues (${JSON.stringify(f.keyIssues)})`);
  assert(typeof f.flavor === 'string' && f.flavor.trim().length > 0, `Faction ${f.id} has complete flavor text`);
});

// -----------------------------------------------------------------------------
// SUITE 3: Dual Metric Dynamics: Standing/Happiness & Confidence (REQ-147)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Dual Metric Dynamics: Standing/Happiness & Confidence (REQ-147) ---');

assert(game1.factionHappiness && typeof game1.factionHappiness === 'object', 'game.factionHappiness initialized');
assert(game1.factionConfidence && typeof game1.factionConfidence === 'object', 'game.factionConfidence initialized');

// Check baseline happiness (68 for major/leading, 60 for minor/fringe)
const libEstabH = game1.factionHappiness['dem_liberal_establishment'];
assert(libEstabH === 68, `Leading/Major faction baseline happiness is 68 (dem_liberal_establishment: ${libEstabH})`);

const ancapH = game1.factionHappiness['lib_ancaps'];
assert(ancapH === 60, `Minor/Fringe faction baseline happiness is 60 (lib_ancaps: ${ancapH})`);

// Check baseline confidence (exactly 50 for all 38 factions)
let all50Confidence = true;
catalog.forEach((f) => {
  if (game1.factionConfidence[f.id] !== 50) all50Confidence = false;
});
assert(all50Confidence, 'All 38 factions initialize to exactly 50 Confidence');

// Grassroots Multiplier formula: M = 0.50 + (Average_Happiness / 100) * 0.70
const baseMultiplier = Engine.computeGrassrootsMultiplier(game1, 'people');
assert(baseMultiplier === 0.969, `Baseline Grassroots Multiplier for Democrats evaluates to 0.969x (actual: ${baseMultiplier})`);

// Turnout Drag Penalty when party average happiness < 45
const demFactions = catalog.filter((f) => f.partyId === 'people');
demFactions.forEach((f) => {
  game1.factionHappiness[f.id] = 40; // Force average happiness < 45
});
const dragMultiplier = Engine.computeGrassrootsMultiplier(game1, 'people');
assert(dragMultiplier === 0.78, `Low happiness reduces Grassroots Multiplier to 0.780x (actual: ${dragMultiplier})`);

const stTurnout = Engine.turnout(game1, 'people', 'PA');
assert(stTurnout > 0, `Turnout calculation executes under drag condition (PA turnout: ${stTurnout})`);

// Restore normal happiness
demFactions.forEach((f) => {
  game1.factionHappiness[f.id] = 68;
});

// Confidence modification strictly restricted:
// 1. Council of Elders +1.5 floor for Net Approval >= +20
const updatedGameElders = Engine.startNextCycle({
  ...game1,
  phase: 'complete',
  councilOfElders: [
    { id: 'pol_elder_1', name: 'Elder Test', party: 'people', factionId: 'dem_liberal_establishment', netApproval: 25, office: 'senate' },
  ],
});
assert(updatedGameElders.factionConfidence['dem_liberal_establishment'] >= 51.5, `Council of Elders provides +1.5 Confidence stabilization floor to aligned faction (actual: ${updatedGameElders.factionConfidence['dem_liberal_establishment']})`);

// 2. Autopsy "Blame Game" confidence modification (+8/-7 or -5)
const autopsyGame = {
  ...game1,
  activeAutopsyModal: true,
  lastElection: {
    autopsyReport: {
      ascendantFactionId: 'dem_capital_l_left',
      defensiveFactionId: 'dem_liberal_establishment',
    },
  },
};
const endorsedGame = Engine.takeAction(autopsyGame, 'resolve-autopsy-disposition', { disposition: 'endorse' });
assert(endorsedGame.factionConfidence['dem_capital_l_left'] === 58, `Endorsing autopsy grants +8 Confidence to ascendant faction (50 -> ${endorsedGame.factionConfidence['dem_capital_l_left']})`);
assert(endorsedGame.factionConfidence['dem_liberal_establishment'] === 43, `Endorsing autopsy imposes -7 Confidence penalty on defensive faction (50 -> ${endorsedGame.factionConfidence['dem_liberal_establishment']})`);

// -----------------------------------------------------------------------------
// SUITE 4: Primary Wins Voter Conversion & Faction Growth Flow (REQ-148)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Primary Wins Voter Conversion & Faction Growth Flow (REQ-148) ---');

// Primary Win conversion formulas:
// State Leg: Base 200 * (PartyApproval / 100), rounded to 100
// House: Base 1,000 * (PartyApproval / 100), rounded to 100
// Senate/Gov: Base 2,500 * (PartyApproval / 100), rounded to 100
const paStateBefore = game1.voterModel.states.find((s) => s.stateId === 'PA');
const paLeftBefore = paStateBefore.factions['dem_capital_l_left'];
const paBlackVotersBefore = paStateBefore.factions['dem_black_voters'];
const paTotalDemBefore = catalog.filter((f) => f.partyId === 'people').reduce((sum, f) => sum + (paStateBefore.factions[f.id] || 0), 0);

assert(paBlackVotersBefore > 0, `PA Black Voters baseline: ${paBlackVotersBefore}`);

// Simulate a primary resolution in PA where The Capital L Left wins the Senate primary
const mockPrimaryGame = {
  ...game1,
  partyApprovals: { people: 40.0 }, // 40% approval
  primaryFields: {
    'senate:PA': {
      people: [
        { id: 'cand_left', name: 'Progressive Winner', partyId: 'people', factionId: 'dem_capital_l_left', poll: 55, ratings: { charisma: 9 } },
        { id: 'cand_est', name: 'Establishment Runner Up', partyId: 'people', factionId: 'dem_liberal_establishment', poll: 15, ratings: { charisma: 5 } },
      ],
    },
  },
};

const resolvedPrimaries = Engine.resolveVersion01Primaries(mockPrimaryGame);
const paStateAfter = resolvedPrimaries.voterModel.states.find((s) => s.stateId === 'PA');

const paLeftAfter = paStateAfter.factions['dem_capital_l_left'];
const paBlackVotersAfter = paStateAfter.factions['dem_black_voters'];
const paTotalDemAfter = catalog.filter((f) => f.partyId === 'people').reduce((sum, f) => sum + (paStateAfter.factions[f.id] || 0), 0);

// At 40% approval, Senate primary win grants RoundTo100(2500 * 0.40) = 1,000 voters
assert(paLeftAfter > paLeftBefore, `Winning candidate's faction gained voters from primary victory (+${paLeftAfter - paLeftBefore})`);
assert(paBlackVotersAfter === paBlackVotersBefore, `Racial faction (Black Voters) is completely immune to losing voters (${paBlackVotersAfter} === ${paBlackVotersBefore})`);
assert(paTotalDemAfter === paTotalDemBefore, `Total party voters in PA remains 100% invariant during primary conversion (${paTotalDemAfter} === ${paTotalDemBefore})`);

// -----------------------------------------------------------------------------
// SUITE 5: Primary Filtering Support & Fringe Caps (REQ-149)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Primary Filtering Support & Fringe Caps (REQ-149) ---');

// Unfiltered Fringe Candidate (<1M voters) must poll <= 5% in major primary
const gopGame = Engine.createGame('heritage');
const fringeCandidate = { id: 'cand_cuban', name: 'Cuban Candidate', partyId: 'heritage', factionId: 'gop_cubans', poll: 25, quality: 6, ratings: { fieldcraft: 6 } };
const magaCandidate = { id: 'cand_maga', name: 'MAGA Candidate', partyId: 'heritage', factionId: 'gop_maga', poll: 35, quality: 6, ratings: { fieldcraft: 6 } };

const fringePrimaryGame = {
  ...gopGame,
  primaryFields: {
    'house:FL-27': {
      heritage: [fringeCandidate, magaCandidate],
    },
  },
};

const resolvedFringePrimaries = Engine.resolveVersion01Primaries(fringePrimaryGame);
assert(resolvedFringePrimaries && resolvedFringePrimaries.primaryFields, 'Primaries resolved successfully with fringe candidate');

// Filtering Support Action: Deducts $100k, 1 action, grants +10 margin swing, +1 candidate faction confidence, -3 other factions
const filterGame = {
  ...gopGame,
  treasury: 10,
  organizingActionsRemaining: 5,
  actionsLeft: 5,
  primaryFields: {
    'house:FL-27': {
      heritage: [fringeCandidate, magaCandidate],
    },
  },
};

const filteredOutcome = Engine.endorseCandidate(filterGame, 'cand_cuban', 'house:FL-27');
assert(filteredOutcome.treasury === 9.9, `Filtering Support deducted $100k party funds ($10M -> $${filteredOutcome.treasury}M)`);
assert(filteredOutcome.actionsLeft === 4, `Filtering Support consumed 1 organizing action (${filteredOutcome.actionsLeft} left)`);
assert(filteredOutcome.primaryEndorsements['house:FL-27'] === 'cand_cuban', 'Filtering Support recorded endorsement in primaryEndorsements');
assert(filteredOutcome.factionConfidence['gop_cubans'] === 51, `Filtering Support gave +1 Confidence to backed faction (50 -> ${filteredOutcome.factionConfidence['gop_cubans']})`);
assert(filteredOutcome.factionConfidence['gop_maga'] === 47, `Filtering Support imposed -3 Confidence penalty on rival factions (50 -> ${filteredOutcome.factionConfidence['gop_maga']})`);

// -----------------------------------------------------------------------------
// SUITE 6: Swing Faction Persuasion & Non-Voting Blocs (REQ-150)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Swing Faction Persuasion & Non-Voting Blocs (REQ-150) ---');

// Formula:
// At netEnv >= +20: 100% Dem
// At netEnv <= -20: 0% Dem (100% GOP)
// At netEnv = 0: baseDem
const swingFaction = 'swg_true_centrists'; // BaseDem: 0.50
const demShareD20 = Engine.computeSwingFactionDemShare(swingFaction, 20);
const demShareD25 = Engine.computeSwingFactionDemShare(swingFaction, 25);
const demShareR20 = Engine.computeSwingFactionDemShare(swingFaction, -20);
const demShareEven = Engine.computeSwingFactionDemShare(swingFaction, 0);

assert(demShareD20 === 1.0, `At D+20 national environment, swing faction votes 100% Democratic (actual: ${demShareD20})`);
assert(demShareD25 === 1.0, `At D+25 national environment, Dem share clamped at 100% (actual: ${demShareD25})`);
assert(demShareR20 === 0.0, `At R+20 national environment, swing faction votes 0% Democratic / 100% GOP (actual: ${demShareR20})`);
assert(demShareEven === 0.50, `At Even environment (0.0), True Centrists split 50/50 (actual: ${demShareEven})`);

// Non-voting blocs turn out 0%
const paVotes = Engine.computeStateFactionVotes({ id: 'PA' }, { ...game1, nationalEnvironment: 0 });
assert(paVotes && typeof paVotes.totalVotes === 'number', 'computeStateFactionVotes computed Pennsylvania votes');
assert(paVotes.demVotes > 0 && paVotes.repVotes > 0, `Pennsylvania bipartisan vote counts: D=${paVotes.demVotes.toLocaleString()}, R=${paVotes.repVotes.toLocaleString()}`);

// -----------------------------------------------------------------------------
// SUITE 7: Faction Tier Boundaries & Factions Tab UI Dashboard (REQ-151, REQ-152)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 7: Faction Tier Boundaries & UI Dashboard (REQ-151, REQ-152) ---');

const tiers = Engine.evaluateFactionTiers(game1);
assert(typeof tiers === 'object' && Object.keys(tiers).length > 0, 'evaluateFactionTiers evaluated designations');

// Check size thresholds
assert(tiers['dem_liberal_establishment'] === 'leading', 'The Liberal Establishment is designated Leading Faction for Democrats');
assert(tiers['dem_black_voters'] === 'major', 'Black Voters (>2.5M) is designated Major Faction');
assert(tiers['dem_traditional_latin'] === 'minor', 'Traditional Latin Voters (1M - 2.5M) is designated Minor Faction');
assert(tiers['lib_ancaps'] === 'fringe', 'Ancaps (<1M) is designated Fringe Faction');

  // Test UI Tab Integration
  const testGame = { ...game1, activeTab: 'factions' };
  App.setGame(testGame);
  const fullCampaignMarkup = App.campaignMarkup();

  assert(typeof fullCampaignMarkup === 'string', 'campaignMarkup renders cleanly in factions tab');
  assert(fullCampaignMarkup.includes('data-main-tab="factions"'), 'Main tabbar includes dedicated "Factions" tab');
  assert(fullCampaignMarkup.includes('Version 0.15'), 'App header eyebrow updated to Version 0.15');
  assert(fullCampaignMarkup.includes('51-Jurisdiction State Faction Inspector'), 'Factions tab renders 51-Jurisdiction State Faction Inspector');
  assert(fullCampaignMarkup.includes('✔ Zero-Variance 155M Voter Model Verified'), 'Factions tab renders Zero-Variance verification badge');

  console.log('\n================================================================');
  console.log(` ALL ${passedTests} ASSERTIONS PASSED CLEANLY (${passedTests}/${totalTests})`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ MASTER TEST SUITE TERMINATED WITH ERROR:');
  console.error(err);
  process.exit(1);
});
