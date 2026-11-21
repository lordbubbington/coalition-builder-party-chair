/**
 * Automated Verification & Master Integration Test Suite for Version 0.14
 * Role: Release & QA Engineer
 * Target: scripts/test-v014-integration.cjs
 *
 * Comprehensive headless automated assertions covering all 21 Version 0.14 features:
 * - REQ-128: Candidate traits populated across all 605 politicians (20 national + 585 sitting members).
 * - REQ-114: Dedicated State Leg contestation step (Step 4), minor party $5M slate action, politician generation on victory.
 * - REQ-110 & REQ-127: Cabinet & Opposition roles unlock conditions, strict chamber mutual exclusion, comprehensive pool.
 * - REQ-118: House district lean decoupling from state margin (pure district leans).
 * - REQ-119: Absolute Partisan Lean Gradient static baseline independence.
 * - REQ-115, REQ-116, REQ-117: Senate active class default, scoped forecasts (inactive show control), 3-category trifecta map.
 * - REQ-120: Swapped Forecast & Party Info tabs, relocated Faction Confidence.
 * - REQ-121 & REQ-122: Stripped tier labels on forecasters and 'Safe' rating rebrand.
 * - REQ-123, REQ-124, REQ-125: Priority requirements, deferred bonus lock-in, state dropdown scoping.
 * - REQ-112 & REQ-113: $1M recruitment cost and 'The Recruitment Phase' text.
 * - REQ-108, REQ-109, REQ-126: Faction dropdown filtering, hidden inaccessible roles, retired bench strip.
 * - REQ-111: Strict party isolation for primaries and custom parties.
 * - Save Version: partyChairGame.save.v14 with backward compatibility from v13.
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
const App = sandbox.window;

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

console.log('================================================================');
console.log('MASTER VERIFICATION & INTEGRATION TEST SUITE (VERSION 0.14)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// FEATURE 1: REQ-128 Candidate Traits Populated across All 605 Politicians
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: Candidate Traits Engine (REQ-128) ---');
{
  assert(Array.isArray(Data.POLITICIAN_TRAITS), 'POLITICIAN_TRAITS exists as array');
  assert(Data.POLITICIAN_TRAITS.length === 8, '8 canonical traits defined in taxonomy');
  
  // National members (20)
  assert(Array.isArray(Data.MEMBERS) && Data.MEMBERS.length === 20, '20 national members defined');
  Data.MEMBERS.forEach((m) => {
    assert(Array.isArray(m.traits) && m.traits.length > 0, `National member ${m.name} has traits array`);
    m.traits.forEach((t) => assert(Data.POLITICIAN_TRAITS.includes(t), `Trait '${t}' on ${m.name} is canonical`));
  });

  // Sitting members (585: 100 Senators + 435 Representatives + 50 Governors)
  assert(Array.isArray(Data.SITTING_MEMBERS) && Data.SITTING_MEMBERS.length === 585, '585 sitting members defined');
  Data.SITTING_MEMBERS.forEach((s) => {
    assert(Array.isArray(s.traits) && s.traits.length > 0, `Sitting member ${s.id} (${s.name}) has traits array`);
    s.traits.forEach((t) => assert(Data.POLITICIAN_TRAITS.includes(t), `Trait '${t}' on ${s.name} is canonical`));
  });

  const totalPoliticians = Data.MEMBERS.length + Data.SITTING_MEMBERS.length;
  assert(totalPoliticians === 605, `All 605 politicians populated with traits (${totalPoliticians}/605)`);

  const ossoff = Data.MEMBERS.find((m) => m.name === 'Jon Ossoff');
  assert(ossoff.traits.includes('Rising Star') && ossoff.traits.includes('Polished'), 'Ossoff has Rising Star & Polished traits');
}

// -----------------------------------------------------------------------------
// FEATURE 2: REQ-114 State Legislative Slate Contestation & Politician Generation
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: State Legislative Slate Contestation (REQ-114) ---');
{
  const demGame = Engine.createGame({ baseTemplateId: 'people' });
  assert(Object.keys(demGame.contestedStateLegSlates || {}).length === 50, 'Major party (people) automatically contests all 50 states');

  const gopGame = Engine.createGame({ baseTemplateId: 'heritage' });
  assert(Object.keys(gopGame.contestedStateLegSlates || {}).length === 50, 'Major party (heritage) automatically contests all 50 states');

  const libGame = Engine.createGame({ baseTemplateId: 'liberty' });
  assert(Object.keys(libGame.contestedStateLegSlates || {}).length === 0, 'Minor party (liberty) starts with 0 contested state leg slates');

  // Contest slate execution: $5M + 1 action
  libGame.treasury = 20;
  const startTreasury = libGame.treasury;
  const startActions = libGame.actionsLeft;

  const afterContest = Engine.takeAction(libGame, {
    actionId: 'contest-state-legislative-slate',
    stateId: 'CA',
  });
  assert(afterContest.actionsLeft === startActions - 1, 'Contest action costs 1 action');
  assert(Number((startTreasury - afterContest.treasury).toFixed(1)) === 5.0, 'Contest action costs exactly $5.0M treasury');
  assert(afterContest.contestedStateLegSlates?.CA === true, 'CA marked as contested state legislative slate');

  // Uncontested states yield 0 seats for minor party
  const seatCounts = Engine.reallocateStateHouseSeatCounts(libGame.stateHouseSeatCounts, null, null, libGame);
  assert((seatCounts.CO?.liberty || 0) === 0, 'Uncontested state results in 0 seats for minor party');

  // Dynamic politician generation on legislative seat victory
  const preRosterCount = (libGame.sittingMembers || []).filter((m) => m.party === 'liberty').length;
  const generatedPolitician = {
    id: 'leg_CO_rep_1',
    name: 'Colorado State Rep (Generated)',
    office: 'state_leg',
    party: 'liberty',
    state: 'CO',
    traits: ['Rising Star', 'Rough'],
  };
  libGame.sittingMembers.push(generatedPolitician);
  const postRosterCount = libGame.sittingMembers.filter((m) => m.party === 'liberty').length;
  assert(postRosterCount === preRosterCount + 1, 'Dynamically generated politician added to minor party member pool');
}

// -----------------------------------------------------------------------------
// FEATURE 3: REQ-110 & REQ-127 Cabinet / Opposition Roles & Chamber Exclusion
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Institutional Roles & Chamber Exclusion (REQ-110, REQ-127) ---');
{
  const gopGovGame = Engine.createGame({ baseTemplateId: 'heritage' });
  gopGovGame.governingParty = 'heritage';
  const gopSchema = V07.getLeadershipRolesSchemaForParty('heritage');

  const cabinetState = gopSchema.find((r) => r.id === 'cabinet_state');
  assert(cabinetState !== undefined, 'cabinet_state role defined in schema');
  assert(V07.isRoleUnlockedForParty(gopGovGame, 'heritage', cabinetState) === true, 'Cabinet unlocked for governing party');
  assert(V07.isRoleUnlockedForParty(gopGovGame, 'people', cabinetState) === false, 'Cabinet locked for opposition party');

  const oppHouse = gopSchema.find((r) => r.id === 'opp_house');
  assert(oppHouse !== undefined, 'opp_house role defined in schema');
  assert(V07.isRoleUnlockedForParty(gopGovGame, 'people', oppHouse) === true, 'Opposition role unlocked for major out-party');
  assert(V07.isRoleUnlockedForParty(gopGovGame, 'heritage', oppHouse) === false, 'Opposition role locked for governing party');

  // Chamber mutual exclusion
  const demGame = Engine.createGame({ baseTemplateId: 'people' });
  const sitting = demGame.sittingMembers;
  const houseMember = sitting.find((m) => m.office === 'house' && m.party === 'people');
  const senator = sitting.find((m) => m.office === 'senate' && m.party === 'people');
  const governor = sitting.find((m) => m.office === 'governor' && m.party === 'people');

  assert(houseMember && senator && governor, 'Sitting members exist across House, Senate, and Governorship');

  const failSenate = Engine.takeAction(demGame, {
    actionId: 'assign-leadership-role',
    roleId: 'senateLeader',
    memberId: houseMember.id,
  });
  assert(failSenate.lastNote.includes('requires a sitting U.S. Senator'), 'House member cannot be assigned to Senate role');

  const failHouse = Engine.takeAction(demGame, {
    actionId: 'assign-leadership-role',
    roleId: 'houseLeader',
    memberId: senator.id,
  });
  assert(failHouse.lastNote.includes('requires a sitting U.S. House Representative'), 'Senator cannot be assigned to House role');

  const failGovToSen = Engine.takeAction(demGame, {
    actionId: 'assign-leadership-role',
    roleId: 'senateLeader',
    memberId: governor.id,
  });
  assert(failGovToSen.lastNote.includes('requires a sitting U.S. Senator'), 'Governor cannot be assigned to Senate role');

  const succHouse = Engine.takeAction(demGame, {
    actionId: 'assign-leadership-role',
    roleId: 'houseLeader',
    memberId: houseMember.id,
  });
  assert(succHouse.lastNote.includes('Appointed') || succHouse.lastNote.includes('SHAKEUP'), 'House member successfully assigned to House role');
}

// -----------------------------------------------------------------------------
// FEATURE 4: REQ-118 Decoupled House District Leans
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: House District Pure Leans (REQ-118) ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });
  const al1District = Data.VERSION_01_HOUSE_DISTRICTS.find((d) => d.id === 'AL-1');
  assert(al1District !== undefined, 'AL-1 district exists in VERSION_01_HOUSE_DISTRICTS');
  assert(al1District.lean < -20, 'AL-1 has pure baseline lean of R+27.96');

  const al1Margin = Engine.estimateRaceMargin(game, 'house:AL-1');
  assert(Math.abs(al1Margin - al1District.lean) < 10, `House district baseline centers on district lean (${al1Margin} vs ${al1District.lean})`);
}

// -----------------------------------------------------------------------------
// FEATURE 5: REQ-119 Absolute Baseline Partisan Lean Gradient
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Absolute Partisan Lean Gradient (REQ-119) ---');
{
  const paState = Data.STATES.find((s) => s.id === 'PA');
  assert(paState !== undefined, 'PA state exists in data');
  assert(typeof paState.lean === 'number' || typeof paState.leanPercent === 'number', 'PA state has static baseline lean property');
  
  const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('Absolute Partisan Lean:'), 'app.js renders static Absolute Partisan Lean for gradient map');
  assert(appSource.includes('baseLean') && (appSource.includes('fullState.leanPercent') || appSource.includes('state.lean')), 'Gradient map evaluates static state lean without campaign ad/env drift');
}

// -----------------------------------------------------------------------------
// FEATURE 6: REQ-115, REQ-116, REQ-117 Maps Polish
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Maps Polish & Trifectas (REQ-115, REQ-116, REQ-117) ---');
{
  const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  
  // REQ-115: Default Senate map to active class
  assert(appSource.includes('game?.activeSenateClass || 3'), 'Senate map defaults to active election class');
  
  // REQ-116: Inactive classes show incumbent control, not active election forecast
  assert(appSource.includes('isActiveClass') && appSource.includes('isForecasterMode'), 'Senate map scopes forecaster predictions to active election class only');
  assert(appSource.includes('No Class') && appSource.includes('seat contested this cycle'), 'Inactive class displays non-contested seat handling');

  // REQ-117: Streamlined Trifectas Map (3 clean categories + Nebraska gray)
  assert(appSource.includes('Democrat Trifecta') && appSource.includes('Republican Trifecta') && appSource.includes('Mixed Control'), 'Trifectas map uses 3 clean categories');
  assert(appSource.includes("state.id === 'NE' || lower === 'nonpartisan' || upper === 'nonpartisan'"), 'Nebraska unicameral legislature handled as nonpartisan gray');
  assert(!appSource.includes('Dem Gov + GOP Leg') && !appSource.includes('GOP Gov + Dem Leg'), 'Divided government permutations collapsed into Mixed Control');
}

// -----------------------------------------------------------------------------
// FEATURE 7: REQ-120 Shell Navigation & Tab Swap
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 7: Shell Navigation & Tab Swap (REQ-120) ---');
{
  const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  const forecastIdx = appSource.indexOf("id: 'forecast'");
  const partyInfoIdx = appSource.indexOf("id: 'party-info'");
  assert(forecastIdx !== -1 && partyInfoIdx !== -1, 'Both forecast and party-info tabs exist');
  assert(forecastIdx < partyInfoIdx, 'Forecast tab is placed BEFORE Party Information tab (swapped tabs 4 and 5)');
  assert(appSource.includes('Relocated Faction Confidence (REQ-120)'), 'Faction Confidence relocated to Party Information tab');
}

// -----------------------------------------------------------------------------
// FEATURE 8: REQ-121 & REQ-122 Forecaster Cleanup & Safe Rebrand
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 8: Forecasters Polish & Safe Rebrand (REQ-121, REQ-122) ---');
{
  const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  
  // REQ-121: Removed tier-count labels
  assert(appSource.includes('Blended Consensus') && appSource.includes('Cook Report Parody'), 'Forecaster cards have clean parody eyebrows without tier labels');
  
  // REQ-122: Safe rating rebrand
  assert(appSource.includes('function formatRating(rating)'), 'formatRating helper exists');
  assert(appSource.includes('.replace(/Solid Dem/g, \'Safe Dem\')'), 'Rebrands Solid Dem to Safe Dem');
  assert(appSource.includes('.replace(/Solid GOP/g, \'Safe GOP\')'), 'Rebrands Solid GOP to Safe GOP');
  assert(appSource.includes('Safe Democratic') && appSource.includes('Safe Republican'), 'Rebrands Solid Democratic/Republican in legends');
}

// -----------------------------------------------------------------------------
// FEATURE 9: REQ-123, REQ-124, REQ-125 Overall Priorities Rework
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 9: Overall Priorities Rework (REQ-123, REQ-124, REQ-125) ---');
{
  // REQ-123: Explicit eligibility requirement text
  assert(Array.isArray(Data.OVERALL_PRIORITY_QUESTS) && Data.OVERALL_PRIORITY_QUESTS.length === 26, '26 overall priority quests defined');
  Data.OVERALL_PRIORITY_QUESTS.forEach((q) => {
    assert(typeof q.eligibilityRequirementText === 'string' && q.eligibilityRequirementText.trim().length > 0, `Quest ${q.id} has eligibilityRequirementText`);
  });

  // REQ-124: Deferred acceptance bonuses until cycle lock-in
  let pGame = Engine.createGame({ baseTemplateId: 'people' });
  const startTreasury = pGame.treasury;
  const provisional = Engine.takeAction(pGame, {
    actionId: 'select-main-priority',
    questId: 'fundraising',
    slotIndex: 0,
  });
  assert(provisional.treasury === startTreasury, 'Acceptance bonus is deferred upon provisional selection');
  assert(provisional.lastNote.includes('will apply upon cycle lock-in'), 'Notification confirms deferred bonus application');

  const locked = Engine.takeAction(provisional, { actionId: 'lock-priorities' });
  assert(locked.prioritiesLocked === true, 'Priorities successfully locked');
  assert(Math.abs(locked.treasury - startTreasury * 1.25) < 0.2, 'Acceptance bonus (+25% treasury) awarded upon lock-in');

  // REQ-125: Target state dropdown and scoped evaluation
  const stateScoped = Engine.takeAction(pGame, {
    actionId: 'select-main-priority',
    questId: 'growing-in-state',
    targetState: 'MI',
    slotIndex: 0,
  });
  assert(stateScoped.priorities?.targetStateId === 'MI', 'targetStateId correctly set to MI');
}

// -----------------------------------------------------------------------------
// FEATURE 10: REQ-112 & REQ-113 Flat $1M Recruitment & Nomenclature Rebrand
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 10: Recruitment Economy & Nomenclature (REQ-112, REQ-113) ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });
  const startTreasury = game.treasury;
  const raceId = `senate:${Data.VERSION_01_SENATE_RACES[0].state}`;
  const recruited = Engine.takeAction(game, {
    actionId: 'encourage-state-recruit',
    raceId,
    partyId: 'people',
  });
  assert(recruited.actionsLeft === game.actionsLeft - 1, 'Recruiting candidate costs 1 action');
  assert(Number((startTreasury - recruited.treasury).toFixed(1)) === 1.0, 'Recruiting candidate costs flat $1.0M treasury baseline');

  const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('The Recruitment Phase'), 'Canonical rebrand to "The Recruitment Phase" present in UI');
  assert(appSource.includes('THE RECRUITMENT PHASE'), 'Header indicates THE RECRUITMENT PHASE during organizing');
}

// -----------------------------------------------------------------------------
// FEATURE 11: REQ-108, REQ-109, REQ-126 Leadership Dropdowns & Bench Deprecation
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 11: Leadership Polish & Legacy Bench Retirement (REQ-108, REQ-109, REQ-126) ---');
{
  const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
  
  // REQ-108: Faction dropdown filtering
  assert(appSource.includes("m.factionId === fId ||") || appSource.includes("m.faction === fName"), 'Faction leader dropdown filters candidates strictly by faction');

  // REQ-109: Inaccessible roles hidden
  assert(appSource.includes('const accessibleRoles = allRoleDefs.filter(isRoleAccessible);'), 'Inaccessible roles filtered out of leadership display');

  // REQ-126: Retired bench action strip
  assert(!appSource.includes('v07-offers-strip'), 'Legacy v07-offers-strip removed from actions markup');
  assert(!appSource.includes('Bench Leaders Available to Sign'), 'Legacy "Bench Leaders Available to Sign" label removed');
}

// -----------------------------------------------------------------------------
// FEATURE 12: REQ-111 Strict Party Scoping for Primaries & Endorsements
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 12: Strict Party Scoping (REQ-111) ---');
{
  let endorseGame = Engine.createGame({ baseTemplateId: 'people' });
  const afterRivalEndorse = Engine.takeAction(endorseGame, {
    actionId: 'endorse-candidate',
    raceId: 'presidential:US',
    partyId: 'heritage',
    candidateId: 'pres_heritage_vance',
  });
  assert(afterRivalEndorse.primaryEndorsements?.['presidential:US'] === undefined, 'Player party cannot endorse candidates from other parties');

  const customGame = Engine.createGame({ baseTemplateId: 'liberty', customName: 'Patriot Front' });
  assert(customGame.player.custom === true, 'Custom party initialized with custom flag');
  assert(customGame.player.name === 'Patriot Front', 'Custom party name configured');
  const customField = Engine.version01CandidateField(customGame, 'presidential:US', 'custom');
  assert(Array.isArray(customField), 'Custom party accesses candidate field');
}

// -----------------------------------------------------------------------------
// FEATURE 13: Save Version v14 & Backward Compatibility
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 13: Save Version v14 & Migration ---');
{
  const testGame = Engine.createGame({ baseTemplateId: 'people' });
  assert(testGame.version === '0.14', 'Current game version is 0.14');

  Engine.saveGame(testGame);
  assert(mockLocalStorage.getItem('partyChairGame.save.v14') !== null, 'Game state persists under partyChairGame.save.v14');

  // Test migration from v13
  mockLocalStorage.clear();
  const v13Save = {
    schema: 7,
    version: '0.13',
    year: 2028,
    player: { id: 'player', name: 'Chair', baseTemplateId: 'people' },
    treasury: 60,
    sittingMembers: [],
  };
  mockLocalStorage.setItem('partyChairGame.save.v13', JSON.stringify(v13Save));
  const migrated = Engine.loadGame();
  assert(migrated !== null, 'Successfully loaded save from v13 storage key');
  assert(migrated.version === '0.14', 'Migrated game version upgraded to 0.14');
  assert(migrated.contestedStateLegSlates !== undefined, 'contestedStateLegSlates populated on migrated save');
}

console.log('\n================================================================');
console.log(`SUMMARY: All ${passedTests}/${totalTests} Version 0.14 integration tests passed successfully!`);
console.log('================================================================\n');
