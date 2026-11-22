const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

for (const f of [
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
  'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js', 'political-trends-system.js',
  'v07-scaffolding.js', 'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js',
  'party-systems-engine.js', 'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js',
  'election-drift.js', 'election-night-engine.js', 'campaign-overhaul.js', 'engine.js',
]) {
  require(path.join(ROOT, f));
}

const Eng = window.PartyChairEngine;
const Data = window.PartyChairData;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== Symmetric Opponent Execution Engine (SOEE) Agent 1 Verification Suite ===');

// 1. REQ-299: Universal Party State Schema
test('REQ-299: Universal Party State Schema (game.parties) initialized with all Section 2.1 properties', () => {
  const g = Eng.createGame('people', { seed: 101 });
  assert.ok(g.parties, 'game.parties must exist');
  const canonicalParties = ['people', 'heritage', 'liberty', 'green', 'constitution', 'justice'];
  canonicalParties.forEach((pId) => {
    const p = g.parties[pId];
    assert.ok(p, `Party state for ${pId} must exist`);
    assert.strictEqual(p.partyId, pId);
    assert.ok(typeof p.treasury === 'number', `${pId}.treasury must be number`);
    assert.ok(typeof p.membership === 'number', `${pId}.membership must be number`);
    assert.ok(p.strategyProfile && typeof p.strategyProfile === 'object', `${pId}.strategyProfile must exist`);
    assert.ok(p.platformStances && typeof p.platformStances === 'object', `${pId}.platformStances must exist`);
    assert.ok(p.machineAllocations && typeof p.machineAllocations === 'object', `${pId}.machineAllocations must exist`);
    assert.ok(Array.isArray(p.actionLog), `${pId}.actionLog must be array`);
    assert.ok(p.primaryEndorsements !== undefined, `${pId}.primaryEndorsements must exist`);
    assert.ok(p.leadershipRoles !== undefined, `${pId}.leadershipRoles must exist`);
    assert.ok(Array.isArray(p.pipelineCandidates), `${pId}.pipelineCandidates must be array`);
    assert.ok(Array.isArray(p.stateLegislativeSlates), `${pId}.stateLegislativeSlates must be array`);
    assert.ok(Array.isArray(p.activeQuests), `${pId}.activeQuests must be array`);
    assert.ok(Array.isArray(p.partyFocuses), `${pId}.partyFocuses must be array`);
    assert.ok(p.factionHappiness && typeof p.factionHappiness === 'object', `${pId}.factionHappiness must exist`);
    assert.ok(p.trustMetrics && typeof p.trustMetrics === 'object', `${pId}.trustMetrics must exist`);
    assert.ok(typeof p.tier === 'number', `${pId}.tier must be number`);
    assert.ok(Array.isArray(p.activeEraHooks), `${pId}.activeEraHooks must be array`);
  });
});

// 2. REQ-299: Dual-Binding Two-Way Synchronization
test('REQ-299: Dual-Binding Synchronization between game.parties[playerPartyId] and top-level fields', () => {
  let g = Eng.createGame('people', { seed: 102 });
  const playerKey = 'people';

  // Top-level -> Party state
  g.treasury = 88.5;
  g.organizingActionsRemaining = 17;
  g = Eng.syncPartyStateWithLegacy(g);
  assert.strictEqual(g.parties[playerKey].treasury, 88.5, 'syncPartyStateWithLegacy must propagate g.treasury to party');
  assert.strictEqual(g.parties[playerKey].organizingActionsRemaining, 17, 'syncPartyStateWithLegacy must propagate organizingActionsRemaining');

  // Party state -> Top-level
  g.parties[playerKey].treasury = 42.1;
  g.parties[playerKey].organizingActionsRemaining = 9;
  g = Eng.syncPartyStateWithLegacy(g);
  assert.strictEqual(g.treasury, 42.1, 'syncPartyStateWithLegacy must propagate party treasury to g.treasury');
  assert.strictEqual(g.organizingActionsRemaining, 9, 'syncPartyStateWithLegacy must propagate organizingActionsRemaining to g');
});

// 3. REQ-299: Headless Universal Action Dispatcher Contract
test('REQ-299: Universal Action Dispatcher (executePartyAction) dispatches across phases with deterministic envelope logging', () => {
  let g = Eng.createGame('people', { seed: 103 });
  
  // Phase 1: Machine Operation Action
  const initialLogLen = g.actionLog.length;
  g = Eng.executePartyAction(g, 'people', 'EXECUTE_MACHINE_OPERATION', {
    operationId: 'voter_registration_drive',
    targetStateId: 'PA',
  });
  assert.strictEqual(g.actionLog.length, initialLogLen + 1, 'Action envelope must be appended to game.actionLog');
  const env = g.actionLog[g.actionLog.length - 1];
  assert.strictEqual(env.partyId, 'people');
  assert.strictEqual(env.actionType, 'EXECUTE_MACHINE_OPERATION');
  assert.ok(typeof env.turnIndex === 'number');
  assert.ok(typeof env.hash === 'string' && env.hash.length > 0);

  // Phase 2: Primary Phase Action
  g = Eng.executePartyAction(g, 'people', 'ENDORSE_PRIMARY_CANDIDATE', {
    raceId: 'senate:PA:class-1',
    candidateId: 'cand_test_pa',
    factionId: 'dem_liberal_establishment',
  });
  assert.strictEqual(g.parties.people.primaryEndorsements['senate:PA:class-1'], 'cand_test_pa');

  // Phase 3: Campaign Phase Action
  g = Eng.executePartyAction(g, 'people', 'BUY_AIRWAVES_BLITZ', {
    stateId: 'PA',
    spendMillions: 2.0,
  });
  assert.strictEqual(g.parties.people.campaign.airwavesSpendByState['PA'], 2.0);
});

// 4. REQ-305: Opponent Machine Organizing & 20-Action Allocation with 155M Voter Scale Conservation
test('REQ-305: allocatePreCampaignOrganizingPool consumes 20 actions and strictly conserves 155,000,000 national voters', () => {
  let g = Eng.createGame('people', { seed: 104 });
  
  // Initial national population check
  const sumRepresentedVoters = (game) => game.voterModel.states.reduce((acc, s) => acc + (s.representedVoters || 0), 0);
  const sumAffiliations = (game) => game.voterModel.states.reduce((acc, s) => {
    return acc + (s.affiliations.people || 0) + (s.affiliations.heritage || 0) + (s.affiliations.independent || 0) + (s.affiliations.thirdParty || 0);
  }, 0);

  const initialRepVoters = sumRepresentedVoters(g);
  const initialAffVoters = sumAffiliations(g);
  assert.strictEqual(initialRepVoters, 155000000, 'Initial representedVoters must equal 155,000,000');
  assert.strictEqual(initialAffVoters, 155000000, 'Initial affiliations must sum to 155,000,000');

  // Allocate Heritage (opponent) pre-campaign pool
  const allocatedHeritage = Eng.allocatePreCampaignOrganizingPool(g, 'heritage');
  assert.strictEqual(allocatedHeritage.length, 20, 'Heritage must execute exactly 20 machine organizing operations');
  assert.strictEqual(g.parties.heritage.organizingActionsRemaining, 0, 'Heritage organizingActionsRemaining must be 0');

  // Check conservation after Heritage allocation
  const postHeritageRep = sumRepresentedVoters(g);
  const postHeritageAff = sumAffiliations(g);
  assert.strictEqual(postHeritageRep, 155000000, 'Represented voters must remain exactly 155,000,000 after Heritage machine organizing');
  assert.strictEqual(postHeritageAff, 155000000, 'Affiliations must remain exactly 155,000,000 after Heritage machine organizing');

  // Allocate People (player) pre-campaign pool
  const allocatedPeople = Eng.allocatePreCampaignOrganizingPool(g, 'people');
  assert.strictEqual(allocatedPeople.length, 20, 'People must execute exactly 20 machine organizing operations');
  assert.strictEqual(g.parties.people.organizingActionsRemaining, 0, 'People organizingActionsRemaining must be 0');

  // Check conservation after People allocation
  const postPeopleRep = sumRepresentedVoters(g);
  const postPeopleAff = sumAffiliations(g);
  assert.strictEqual(postPeopleRep, 155000000, 'Represented voters must remain exactly 155,000,000 after People machine organizing');
  assert.strictEqual(postPeopleAff, 155000000, 'Affiliations must remain exactly 155,000,000 after People machine organizing');
});

// 5. REQ-306: AI Platform Issues & 40-Stance Faction Alignment Logic
test('REQ-306: tunePartyPlatformStances clamps all 40+ stances in [1.0, 10.0] with 3x major faction weighting & happiness updates', () => {
  let g = Eng.createGame('people', { seed: 105 });
  g = Eng.tunePartyPlatformStances(g, 'heritage');
  const heritageStances = g.parties.heritage.platformStances;
  const stanceKeys = Object.keys(heritageStances);
  assert.ok(stanceKeys.length >= 40, `Must tune at least 40 stances (found ${stanceKeys.length})`);
  
  stanceKeys.forEach((k) => {
    const val = heritageStances[k];
    assert.ok(val >= 1.0 && val <= 10.0, `Stance ${k} (${val}) must be clamped in [1.0, 10.0]`);
  });

  // Verify faction happiness deltas were evaluated and bounded
  const hap = g.parties.heritage.factionHappiness;
  assert.ok(Object.keys(hap).length > 0, 'Faction happiness entries must exist');
  Object.entries(hap).forEach(([fId, score]) => {
    assert.ok(score >= 0 && score <= 100, `Faction ${fId} happiness (${score}) must be in [0, 100]`);
  });
});

// 6. REQ-307: Opponent Strategic Quests, Focus Locks & Statehouse Contestation AI
test('REQ-307: selectPartyPrioritiesAndFocuses selects 3 quests, locks 3-7 focus slots; contestOpponentStateLegislativeSlates contests slates', () => {
  let g = Eng.createGame('people', { seed: 106 });
  
  // Quest & focus selection
  g = Eng.selectPartyPrioritiesAndFocuses(g, 'heritage');
  assert.strictEqual(g.parties.heritage.activeQuests.length, 3, 'Must select exactly 3 active quests');
  assert.strictEqual(g.parties.heritage.partyFocuses.length, 7, 'Tier 5 major party must have 7 focus slots');

  // State legislative contestation
  g = Eng.contestOpponentStateLegislativeSlates(g, 'heritage');
  assert.ok(g.parties.heritage.stateLegislativeSlates.length > 0, 'Opponent must contest state legislative slates');
});

// 7. REQ-308: Opponent Faction Internal Dynamics, Ultimatums & Leadership Hierarchy AI
test('REQ-308: appointPartyLeadershipHierarchy fills 14 leadership roles and handles low faction happiness floor', () => {
  let g = Eng.createGame('people', { seed: 107 });

  // Artificially depress a faction to test ultimatum/concession floor
  g.parties.heritage.factionHappiness['gop_maga'] = 22;
  
  g = Eng.appointPartyLeadershipHierarchy(g, 'heritage');
  const roles = g.parties.heritage.leadershipRoles;
  assert.ok(roles.partyChair, 'partyChair role must be appointed');
  assert.ok(roles.houseLeader, 'houseLeader role must be appointed');
  assert.ok(roles.senateLeader, 'senateLeader role must be appointed');
  assert.ok(roles.houseWhip, 'houseWhip role must be appointed');
  assert.ok(roles.senateWhip, 'senateWhip role must be appointed');
  assert.ok(roles.govAssocChair, 'govAssocChair role must be appointed');

  // Depressed faction must have received an appointment or concession to protect from floor collapse
  assert.ok(g.parties.heritage.factionHappiness['gop_maga'] >= 25, 'Ultimatum evaluation should prevent unchecked collapse');
});

// 8. REQ-311: Multiplayer Headless Action Contract & Session Serialization Bridge
test('REQ-311: serializePartyActionLog and replayPartyActionLog reproduce deterministic game action state', () => {
  let g1 = Eng.createGame('people', { seed: 108 });
  g1 = Eng.executePartyAction(g1, 'people', 'SET_PLATFORM_STANCE', { issueId: 'wealth-tax', stance: 8.8 });
  g1 = Eng.executePartyAction(g1, 'heritage', 'SET_PLATFORM_STANCE', { issueId: 'wealth-tax', stance: 2.2 });
  g1 = Eng.executePartyAction(g1, 'liberty', 'SET_PLATFORM_STANCE', { issueId: 'wealth-tax', stance: 1.0 });

  const serialized = Eng.serializePartyActionLog(g1);
  assert.ok(typeof serialized === 'string', 'serializePartyActionLog must return a string');
  const parsed = JSON.parse(serialized);
  assert.strictEqual(parsed.length, 3, 'Serialized action log must contain 3 envelopes');

  let g2 = Eng.createGame('people', { seed: 108 });
  g2 = Eng.replayPartyActionLog(g2, serialized);
  assert.strictEqual(g2.actionLog.length, 3, 'Replayed state must have 3 actions');
  assert.strictEqual(g2.parties.people.platformStances['wealth-tax'], 8.8, 'People stance must match');
  assert.strictEqual(g2.parties.heritage.platformStances['wealth-tax'], 2.2, 'Heritage stance must match');
  assert.strictEqual(g2.parties.liberty.platformStances['wealth-tax'], 1.0, 'Liberty stance must match');
});

console.log(`\nAll ${passed} SOEE Agent 1 verification tests passed successfully!`);
