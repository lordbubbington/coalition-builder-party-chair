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

const sandbox = {
  window: {},
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
const ctx = vm.createContext(sandbox);

function loadScript(filePath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
  vm.runInContext(code, ctx);
}

// Load stack
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

const Engine = sandbox.window.PartyChairEngine;
const Data = sandbox.window.PartyChairData;
const V07 = sandbox.window.PartyChairV07;

console.log('--- STARTING VERSION 0.14 BACKEND INTEGRATION TESTS ---');

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

// 1. REQ-128: Candidate Traits Data
assert(Array.isArray(Data.MEMBERS), 'Data.MEMBERS must be array');
assert(Data.MEMBERS.length === 20, 'Must have 20 national members');
Data.MEMBERS.forEach((m) => {
  assert(Array.isArray(m.traits) && m.traits.length > 0, `Member ${m.name} must have traits array`);
  m.traits.forEach((t) => assert(Data.POLITICIAN_TRAITS.includes(t), `Trait ${t} on ${m.name} must be canonical`));
});
const ossoff = Data.MEMBERS.find((m) => m.name === 'Jon Ossoff');
assert(ossoff.traits.includes('Rising Star') && ossoff.traits.includes('Polished'), 'Ossoff traits match specification');

assert(Array.isArray(Data.SITTING_MEMBERS), 'Data.SITTING_MEMBERS must be array');
assert(Data.SITTING_MEMBERS.length === 585, 'Must have 585 sitting members');
Data.SITTING_MEMBERS.forEach((s) => {
  assert(Array.isArray(s.traits) && s.traits.length > 0, `Sitting member ${s.id} (${s.name}) must have traits array`);
  s.traits.forEach((t) => assert(Data.POLITICIAN_TRAITS.includes(t), `Trait ${t} on ${s.name} must be canonical`));
});

assert(Array.isArray(Data.POLITICIAN_TRAITS), 'POLITICIAN_TRAITS must be array');
assert(Data.POLITICIAN_TRAITS.length === 8, 'Must have 8 canonical traits');

// 2. REQ-118: House Decoupling
const game = Engine.createGame({ baseTemplateId: 'people' });
const al1Margin = Engine.estimateRaceMargin(game, 'house:AL-1');
const al1District = Data.VERSION_01_HOUSE_DISTRICTS.find((d) => d.id === 'AL-1');
assert(al1District, 'AL-1 district must exist');
// House race baseline should correlate with district.lean (-27.96) rather than state presidential lean
assert(Math.abs(al1Margin - al1District.lean) < 10, 'House margin should center near pure district lean');

// 3. REQ-112: Flat $1.0M Recruitment Cost
const startTreasury = game.treasury;
const raceId = `senate:${Data.VERSION_01_SENATE_RACES[0].state}`;
const afterRecruit = Engine.takeAction(game, {
  actionId: 'encourage-state-recruit',
  raceId,
  partyId: 'people',
});
assert(afterRecruit.actionsLeft === game.actionsLeft - 1, 'Should deduct 1 action');
assert(Number((startTreasury - afterRecruit.treasury).toFixed(1)) === 1.0, 'Should deduct exactly $1.0M treasury');

// 4. REQ-114: State Legislative Slate Contestation & Politician Generation
const demGame = Engine.createGame({ baseTemplateId: 'people' });
assert(Object.keys(demGame.contestedStateLegSlates || {}).length === 50, 'Major party contests all 50 states');

const libGame = Engine.createGame({ baseTemplateId: 'liberty' });
assert(Object.keys(libGame.contestedStateLegSlates || {}).length === 0, 'Minor party starts with 0 contested states');

libGame.treasury = 20;
const startLibTreasury = libGame.treasury;
const startActions = libGame.actionsLeft;

const afterContestAction = Engine.takeAction(libGame, {
  actionId: 'contest-state-legislative-slate',
  stateId: 'CO',
});

assert(afterContestAction.actionsLeft === startActions - 1, 'Deducts 1 action');
assert(Number((startLibTreasury - afterContestAction.treasury).toFixed(1)) === 5.0, 'Deducts $5.0M treasury');
assert(afterContestAction.contestedStateLegSlates?.CO === true, 'CO is now contested');

// Uncontested state legislative slates result in 0 seats for minor party
const seatCounts = Engine.reallocateStateHouseSeatCounts(libGame.stateHouseSeatCounts, null, null, libGame);
assert((seatCounts.CO?.liberty || 0) === 0, 'Should get 0 seats in uncontested state');

// 5. REQ-110 & REQ-127: Leadership Hierarchy, Cabinet, Opposition & Chamber Scoping
const gameGopPres = Engine.createGame({ baseTemplateId: 'heritage' });
gameGopPres.governingParty = 'heritage';
const schemaGop = V07.getLeadershipRolesSchemaForParty('heritage');
const cabinetStateRole = schemaGop.find((r) => r.id === 'cabinet_state');
assert(cabinetStateRole, 'cabinet_state must exist');

// GOP holds presidency: cabinet unlocked for GOP
assert(V07.isRoleUnlockedForParty(gameGopPres, 'heritage', cabinetStateRole) === true, 'Cabinet unlocked for governing party');
// Dems do NOT hold presidency: cabinet locked for Dems
assert(V07.isRoleUnlockedForParty(gameGopPres, 'people', cabinetStateRole) === false, 'Cabinet locked for opposition party');

// Opposition roles unlocked for largest non-presidential party
const oppHouseRole = schemaGop.find((r) => r.id === 'opp_house');
assert(oppHouseRole, 'opp_house must exist');
assert(V07.isRoleUnlockedForParty(gameGopPres, 'people', oppHouseRole) === true, 'Opposition unlocked for largest non-presidential party');
assert(V07.isRoleUnlockedForParty(gameGopPres, 'heritage', oppHouseRole) === false, 'Opposition locked for governing party');

// Chamber mutual exclusion
const sitting = game.sittingMembers;
const houseMember = sitting.find((m) => m.office === 'house' && m.party === 'people');
const senator = sitting.find((m) => m.office === 'senate' && m.party === 'people');
const governor = sitting.find((m) => m.office === 'governor' && m.party === 'people');

assert(houseMember && senator && governor, 'Must have sitting members of all 3 chambers');

// 1. Assign House member to Senate role -> MUST FAIL
const failSenate = Engine.takeAction(game, {
  actionId: 'assign-leadership-role',
  roleId: 'senateLeader',
  memberId: houseMember.id,
});
assert(failSenate.lastNote.includes('requires a sitting U.S. Senator'), 'Cannot assign House member to Senate role');

// 2. Assign Senator to House role -> MUST FAIL
const failHouse = Engine.takeAction(game, {
  actionId: 'assign-leadership-role',
  roleId: 'houseLeader',
  memberId: senator.id,
});
assert(failHouse.lastNote.includes('requires a sitting U.S. House Representative'), 'Cannot assign Senator to House role');

// 3. Assign Governor to Senate role -> MUST FAIL
const failGovToSen = Engine.takeAction(game, {
  actionId: 'assign-leadership-role',
  roleId: 'senateLeader',
  memberId: governor.id,
});
assert(failGovToSen.lastNote.includes('requires a sitting U.S. Senator'), 'Cannot assign Governor to Senate role');

// 4. Assign House member to House role -> MUST SUCCEED
const succHouse = Engine.takeAction(game, {
  actionId: 'assign-leadership-role',
  roleId: 'houseLeader',
  memberId: houseMember.id,
});
assert(succHouse.lastNote.includes('Appointed') || succHouse.lastNote.includes('SHAKEUP'), 'Assigning House member to House role succeeds');

// 6. REQ-123, REQ-124, REQ-125: Overall Priorities Rework
assert(Data.OVERALL_PRIORITY_QUESTS.length === 26, 'Must have 26 quests');
Data.OVERALL_PRIORITY_QUESTS.forEach((q) => {
  assert(typeof q.eligibilityRequirementText === 'string' && q.eligibilityRequirementText.trim().length > 0, `Quest ${q.id} must have eligibilityRequirementText`);
});

// Deferred acceptance bonuses until lock-in
let priorityGame = Engine.createGame({ baseTemplateId: 'people' });
const initialTreasury = priorityGame.treasury;

const afterSelect = Engine.takeAction(priorityGame, {
  actionId: 'select-main-priority',
  questId: 'fundraising',
  slotIndex: 0,
});
assert(afterSelect.treasury === initialTreasury, 'Acceptance bonus must be deferred upon provisional selection');
assert(afterSelect.lastNote.includes('will apply upon cycle lock-in'), 'Note indicates deferred bonus');

const afterLock = Engine.takeAction(afterSelect, {
  actionId: 'lock-priorities',
});
assert(afterLock.prioritiesLocked === true, 'Priorities are now locked');
assert(Math.abs(afterLock.treasury - initialTreasury * 1.25) < 0.2, 'Acceptance bonus applied upon lock-in');

// Scope targetStateId strictly to chosen state
const afterSelectState = Engine.takeAction(priorityGame, {
  actionId: 'select-main-priority',
  questId: 'growing-in-state',
  targetState: 'MI',
  slotIndex: 0,
});
assert(afterSelectState.priorities?.targetStateId === 'MI', 'targetStateId is MI');

const afterLockState = Engine.takeAction(afterSelectState, {
  actionId: 'lock-priorities',
});
const miState = afterLockState.voterModel?.states?.find((s) => s.stateId === 'MI');
assert(miState, 'MI state must exist in voter model');

// 7. REQ-111: Strict Party Isolation
let endorseGame = Engine.createGame({ baseTemplateId: 'people' });
const afterEndorse = Engine.takeAction(endorseGame, {
  actionId: 'endorse-candidate',
  raceId: 'presidential:US',
  partyId: 'heritage',
  candidateId: 'pres_heritage_vance',
});
assert(afterEndorse.primaryEndorsements?.['presidential:US'] === undefined, 'Cannot endorse candidates outside player party');

// 8. Save Version v14
assert(game.version === '0.14', 'game.version must be 0.14');
Engine.saveGame(game);
assert(mockLocalStorage.getItem('partyChairGame.save.v14'), 'Must save under v14 key');

mockLocalStorage.clear();
mockLocalStorage.setItem('partyChairGame.save.v13', JSON.stringify({ ...game, version: '0.13' }));
const loaded = Engine.loadGame();
assert(loaded, 'Must load from v13 save key');
assert(loaded.version === '0.14', 'Migrates to v14');

console.log(`\n========================================`);
console.log(`ALL ${passedTests}/${totalTests} BACKEND INTEGRATION TESTS PASSED!`);
console.log(`========================================\n`);
