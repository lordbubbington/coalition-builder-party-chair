/**
 * Master Verification & Integration Test Suite for Version 0.15.2
 * Target: scripts/test-v0152-integration.cjs
 *
 * Objectives (Covering all 8 Features REQ-153 through REQ-160 from VERSION_0.15.2_DESIGN.md):
 * 1. REQ-153: Faction Recruitment Happiness Threshold (<= 30) & Post-Join Acclimation (+30 Conf, H=65)
 * 2. REQ-154: Control Loss Penalties & Total Federal Lockout ("In the Wilderness" -15 Conf, -15 Happ)
 * 3. REQ-155 & REQ-156: Party Focus Slots (7 Major / 3 Minor) & [Lock In Party Focuses] Action
 * 4. REQ-157: Dynamic Faction Leaders (7 Dem / 7 GOP, candidate filtering, +3 Confidence)
 * 5. REQ-158: Primary Filtering Support (+1 Faction Happ, -3 Rival Factions Happ, Confidence unaffected)
 * 6. REQ-159: Politician Universe (605 politicians with factionId, co-movement, drift, bolting defection & role vacating)
 * 7. REQ-160: Removal of Verification Badge from Factions Tab Header
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
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.2 MASTER TEST SUITE');
  console.log('================================================================');

  // -----------------------------------------------------------------------------
  // SUITE 1: REQ-153 Faction Recruitment Happiness Threshold & Acclimation
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 1: REQ-153 Faction Recruitment Happiness Threshold & Acclimation ---');
  let g1 = Engine.createGame('people');

  // Test 1a: Independent / external faction with Happiness > 30 is refused
  const hardHatsFaction = g1.factions.find((f) => f.id === 'swg_hard_hats');
  assert(Boolean(hardHatsFaction), 'Hard Hats faction found in game');
  hardHatsFaction.happiness = 45;
  g1.factionHappiness['swg_hard_hats'] = 45;

  const eligRefused = Engine.checkSummitEligibility(g1, 'swg_hard_hats');
  assert(eligRefused.eligible === false, 'Hard Hats ineligible for recruitment when Happiness > 30 (got 45)');
  assert(eligRefused.reason.includes('Happiness > 30') && eligRefused.reason.includes('refuses merger talks'),
    'Ineligibility message exactly matches specification: ' + eligRefused.reason);

  // Test 1b: Attempting to sign accord via takeAction while Happiness > 30 is blocked
  const blockedAction = Engine.takeAction(g1, { type: 'convene-coalition-summit', factionId: 'swg_hard_hats' });
  assert(blockedAction.error && blockedAction.error.includes('Happiness > 30'), 'takeAction convene-coalition-summit blocked for Happiness > 30');

  // Test 1c: When Happiness <= 30, recruitment is allowed
  hardHatsFaction.happiness = 28;
  g1.factionHappiness['swg_hard_hats'] = 28;
  const eligAllowed = Engine.checkSummitEligibility(g1, 'swg_hard_hats');
  assert(eligAllowed.eligible === true, 'Hard Hats eligible for recruitment when Happiness <= 30 (got 28)');

  // Test 1d: Post-Join Acclimation: +30 Confidence (clamped to 100) and Happiness set to 65
  hardHatsFaction.confidence = 50;
  g1.factionConfidence['swg_hard_hats'] = 50;
  const signedGame = Engine.signCoalitionAccord(g1, 'swg_hard_hats', eligAllowed.demands);
  const admittedHardHats = signedGame.factions.find((f) => f.id === 'swg_hard_hats');
  assert(admittedHardHats.partyId === 'people', 'Faction joined the party (partyId = people)');
  assert(admittedHardHats.confidence === 80, `Confidence received +30 boost (was 50, now ${admittedHardHats.confidence})`);
  assert(admittedHardHats.happiness === 65, `Happiness set to 65 (got ${admittedHardHats.happiness})`);

  // Test 1e: Confidence clamping to 100
  let g1Clamped = Engine.createGame('people');
  const unionFaction = g1Clamped.factions.find((f) => f.id === 'swg_union_rail');
  if (unionFaction) {
    unionFaction.happiness = 20;
    unionFaction.confidence = 85;
    g1Clamped.factionHappiness['swg_union_rail'] = 20;
    g1Clamped.factionConfidence['swg_union_rail'] = 85;
    const clampedSigned = Engine.signCoalitionAccord(g1Clamped, 'swg_union_rail');
    const admittedUnion = clampedSigned.factions.find((f) => f.id === 'swg_union_rail');
    assert(admittedUnion.confidence === 100, `Confidence correctly clamped at 100 on post-join acclimation (was 85, got ${admittedUnion.confidence})`);
  }

  // -----------------------------------------------------------------------------
  // SUITE 2: REQ-154 Control Loss Penalties & Federal Lockout ("In the Wilderness")
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 2: REQ-154 Control Loss Penalties & Total Federal Lockout ---');
  let g2 = Engine.createGame('people');
  g2.phase = 'complete';

  // Seed prior cycle control: held House, Senate, Pres, and 20 State Leg
  g2.lastCycleControl = {
    house: true,
    senate: true,
    pres: true,
    stateLegWins: { people: 20 },
  };

  // Simulate loss of House, Senate, Pres, and 2 state legislative chambers
  g2.seats = 200; // Lost house (<218)
  g2.governingParty = 'heritage'; // Lost presidency
  g2.sittingMembers = g2.sittingMembers.map((m) => {
    if ((m.office === 'senate' || m.office === 'house') && (m.party === 'people' || m.caucus === 'people')) {
      return { ...m, party: 'heritage', caucus: 'heritage' }; // strip majorities (<50, <218)
    }
    return m;
  });
  g2.stateLegislatures = Object.fromEntries(
    Object.entries(g2.stateLegislatures || {}).map(([st, ch]) => [st, ['heritage']])
  ); // 0 state leg wins -> lost 20 state legs
  g2.stateHouseSeatCounts = {};

  const libEstBefore = g2.factions.find((f) => f.id === 'dem_liberal_establishment'); // Leading faction
  const bernieBefore = g2.factions.find((f) => f.id === 'dem_bernie_bros'); // Non-leading major faction
  const libEstHBefore = libEstBefore.happiness;
  const bernieHBefore = bernieBefore.happiness;

  const nextCycleGame = Engine.startNextCycle(g2);
  const libEstAfter = nextCycleGame.factions.find((f) => f.id === 'dem_liberal_establishment');
  const bernieAfter = nextCycleGame.factions.find((f) => f.id === 'dem_bernie_bros');

  // Expected losses:
  // House lost: -10 (leading: -5)
  // Senate lost: -10 (leading: -5)
  // Pres lost: -12 (leading: -6)
  // State leg lost: 20 * 1 = -20 (leading: 20 * 0.5 = -10)
  // Total non-leading penalty: -(10 + 10 + 12 + 20) = -52
  // Total leading penalty: -(5 + 5 + 6 + 10) = -26
  assert(libEstAfter.happiness === Math.max(0, libEstHBefore - 26), `Leading faction took half control loss penalties (-26, was ${libEstHBefore}, now ${libEstAfter.happiness})`);
  assert(bernieAfter.happiness === Math.max(0, bernieHBefore - 52), `Non-leading faction took full control loss penalties (-52, was ${bernieHBefore}, now ${bernieAfter.happiness})`);

  // Test Total Federal Lockout ("In the Wilderness"):
  // Major party enters cycle with 0 of 3 federal branches, and finishes with 0 of 3
  let g2Wilderness = Engine.createGame('people');
  g2Wilderness.phase = 'complete';
  g2Wilderness.lastCycleControl = {
    house: false,
    senate: false,
    pres: false,
    stateLegWins: { people: 15 },
  };
  g2Wilderness.seats = 190;
  g2Wilderness.governingParty = 'heritage';
  g2Wilderness.sittingMembers = g2Wilderness.sittingMembers.map((m) => {
    if ((m.office === 'senate' || m.office === 'house') && (m.party === 'people' || m.caucus === 'people')) {
      return { ...m, party: 'heritage', caucus: 'heritage' };
    }
    return m;
  });
  const demFactionsPre = g2Wilderness.factions.filter((f) => f.partyId === 'people');
  const avgConfBefore = demFactionsPre.reduce((s, f) => s + f.confidence, 0) / demFactionsPre.length;
  const avgHappBefore = demFactionsPre.reduce((s, f) => s + f.happiness, 0) / demFactionsPre.length;

  const g2WildernessNext = Engine.startNextCycle(g2Wilderness);
  const demFactionsPost = g2WildernessNext.factions.filter((f) => f.partyId === 'people');
  const avgConfAfter = demFactionsPost.reduce((s, f) => s + f.confidence, 0) / demFactionsPost.length;
  const avgHappAfter = demFactionsPost.reduce((s, f) => s + f.happiness, 0) / demFactionsPost.length;

  assert(avgConfAfter <= avgConfBefore - 15, `Federal Lockout deducted -15 Confidence across all factions (was ${avgConfBefore}, now ${avgConfAfter})`);
  assert(avgHappAfter <= avgHappBefore - 15, `Federal Lockout deducted -15 Happiness across all factions (was ${avgHappBefore}, now ${avgHappAfter})`);

  // -----------------------------------------------------------------------------
  // SUITE 3: REQ-155 & REQ-156 Party Focus Capacity & Lock-In Action
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 3: REQ-155 & REQ-156 Party Focus Capacity & Lock-In Action ---');
  let g3Major = Engine.createGame('people');
  let g3Minor = Engine.createGame('liberty');

  // Test 3a: Capacity scaling
  assert(g3Major.priorities.additional.length === 7, `Major party initialized with 7 focus slots (got ${g3Major.priorities.additional.length})`);
  assert(g3Minor.priorities.additional.length === 3, `Minor party initialized with 3 focus slots (got ${g3Minor.priorities.additional.length})`);

  // Test 3b: Staging focus selections does NOT apply bonuses while !focusesLocked
  const paStateBefore = g3Major.voterModel.states.find((s) => s.stateId === 'PA');
  const paVotersBefore = paStateBefore.affiliations.people;
  const trustBefore = g3Major.trust.supporters;

  g3Major = Engine.takeAction(g3Major, 'set-additional-priority', {
    slotIndex: 0,
    type: 'state',
    targetId: 'PA',
  });
  g3Major = Engine.takeAction(g3Major, 'set-additional-priority', {
    slotIndex: 1,
    type: 'issue',
    targetId: 'healthcare-public-option',
  });

  const paStateStaged = g3Major.voterModel.states.find((s) => s.stateId === 'PA');
  assert(paStateStaged.affiliations.people === paVotersBefore, 'State voter total unchanged while focus is staged');
  assert(g3Major.trust.supporters === trustBefore, 'Supporter trust unchanged while focus is staged');
  assert(g3Major.focusesLocked === false, 'focusesLocked is false initially');

  // Test 3c: [Lock In Party Focuses] commits targets and immediately executes bonuses
  g3Major = Engine.takeAction(g3Major, 'lock-party-focuses');
  assert(g3Major.focusesLocked === true, 'focusesLocked is now true');

  const paStateLocked = g3Major.voterModel.states.find((s) => s.stateId === 'PA');
  assert(paStateLocked.affiliations.people === paVotersBefore + 50, `State focus granted +5,000 registered party voters (+50 sample units) (was ${paVotersBefore}, now ${paStateLocked.affiliations.people})`);
  assert(g3Major.trust.supporters > trustBefore, `Issue focus granted base loyalty trust boost (was ${trustBefore}, now ${g3Major.trust.supporters})`);

  // Test 3d: Once locked, further modifications to priorities are blocked
  const attemptChange = Engine.takeAction(g3Major, 'set-additional-priority', {
    slotIndex: 0,
    type: 'state',
    targetId: 'FL',
  });
  assert(attemptChange.priorities.additional[0].targetId === 'PA', 'Cannot modify focus slots once locked for the cycle');

  const attemptClear = Engine.takeAction(g3Major, 'clear-additional-priority', {
    slotIndex: 0,
  });
  assert(attemptClear.priorities.additional[0].targetId === 'PA', 'Cannot clear focus slots once locked for the cycle');

  // Test 3e: focusesLocked resets to false on startNextCycle
  g3Major.phase = 'complete';
  const g3Next = Engine.startNextCycle(g3Major);
  assert(g3Next.focusesLocked === false, 'focusesLocked reset to false for new cycle');
  assert(g3Next.priorities.additional.length === 7, 'Next cycle initialized with fresh 7 focus slots');

  // -----------------------------------------------------------------------------
  // SUITE 4: REQ-157 Dynamic Faction Leaders & Category B Alignment
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 4: REQ-157 Dynamic Faction Leaders & Category B Alignment ---');
  const demRoles = sandbox.window.PartyChairV07.getLeadershipRolesSchemaForParty('people');
  const gopRoles = sandbox.window.PartyChairV07.getLeadershipRolesSchemaForParty('heritage');

  const demFactionRoles = demRoles.filter((r) => r.category === 'faction');
  const gopFactionRoles = gopRoles.filter((r) => r.category === 'faction');

  assert(demFactionRoles.length === 7, `Exactly 7 Major faction leadership roles for Democrats (got ${demFactionRoles.length})`);
  assert(gopFactionRoles.length === 7, `Exactly 7 Major faction leadership roles for Republicans (got ${gopFactionRoles.length})`);

  // Verify that all 7 Dem faction roles match factions with >= 2.5M voters
  const demMajorFactionIds = [
    'dem_liberal_establishment',
    'dem_black_voters',
    'dem_capital_l_left',
    'dem_neo_liberals',
    'dem_bernie_bros',
    'dem_faith_based_liberals',
    'dem_blue_dog',
  ];
  demFactionRoles.forEach((role) => {
    assert(demMajorFactionIds.includes(role.factionId), `Role ${role.id} belongs to Major Dem faction ${role.factionId}`);
  });

  // Test appointment: appointing a leader awards +3 Confidence to their faction
  let g4 = Engine.createGame('people');
  const aoc = g4.politicians.find((p) => p.name === 'Alexandria Ocasio-Cortez' || p.id === 'aoc');
  assert(Boolean(aoc), 'AOC found in politician roster');
  assert(aoc.factionId === 'dem_capital_l_left', `AOC factionId is dem_capital_l_left (got ${aoc.factionId})`);

  const capLeftConfBefore = g4.factionConfidence['dem_capital_l_left'] || 50;
  const aocHappBefore = aoc.happiness || 65;

  g4 = Engine.takeAction(g4, {
    type: 'assign-leadership-role',
    roleId: 'faction_dem_capital_l_left',
    memberId: aoc.id,
  });

  const capLeftConfAfter = g4.factionConfidence['dem_capital_l_left'];
  assert(capLeftConfAfter === capLeftConfBefore + 3, `Appointing faction leader awarded +3 Confidence to faction (was ${capLeftConfBefore}, now ${capLeftConfAfter})`);

  const aocAfter = g4.politicians.find((p) => p.id === aoc.id);
  assert(aocAfter.happiness === aocHappBefore + 15, `Appointing to leadership awarded +15 individual happiness to politician (was ${aocHappBefore}, now ${aocAfter.happiness})`);

  // Test faction mismatch validation: cannot appoint politician from different faction
  const ossoff = g4.politicians.find((p) => p.name === 'Jon Ossoff' || p.id === 'ossoff');
  assert(Boolean(ossoff), 'Ossoff found');
  assert(ossoff.factionId === 'dem_liberal_establishment', 'Ossoff belongs to dem_liberal_establishment');

  const invalidAppt = Engine.takeAction(g4, {
    type: 'assign-leadership-role',
    roleId: 'faction_dem_capital_l_left',
    memberId: ossoff.id,
  });
  assert(invalidAppt.lastNote && invalidAppt.lastNote.includes('faction mismatch'), 'Faction mismatch blocked assignment: ' + invalidAppt.lastNote);

  // -----------------------------------------------------------------------------
  // SUITE 5: REQ-158 Primary Filtering Support Modifies Happiness
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 5: REQ-158 Primary Filtering Support Modifies Happiness ---');
  let g5 = Engine.createGame('people');

  // Use active primary race senate:GA
  const field = Engine.version01CandidateField(g5, 'senate:GA', 'people');
  assert(field.length > 1, `senate:GA field populated with ${field.length} candidates`);
  const candA = field[0];
  const candAFactionId = candA.factionId || 'dem_capital_l_left';
  const candAPollBefore = candA.poll || 15;

  const candAHBefore = g5.factionHappiness[candAFactionId];
  const estHBefore = g5.factionHappiness['dem_liberal_establishment'];
  const candACBefore = g5.factionConfidence[candAFactionId];
  const estCBefore = g5.factionConfidence['dem_liberal_establishment'];

  g5 = Engine.endorseCandidate(g5, { raceId: 'senate:GA', candidateId: candA.id });

  const candAHAfter = g5.factionHappiness[candAFactionId];
  const estHAfter = g5.factionHappiness['dem_liberal_establishment'];
  const candACAfter = g5.factionConfidence[candAFactionId];
  const estCAfter = g5.factionConfidence['dem_liberal_establishment'];

  assert(candAHAfter === candAHBefore + 1, `Candidate's faction gained +1 Happiness (was ${candAHBefore}, now ${candAHAfter})`);
  assert(estHAfter === estHBefore - 3, `Rival party faction lost -3 Happiness (was ${estHBefore}, now ${estHAfter})`);
  assert(candACAfter === candACBefore, `Confidence is completely unaffected for candidate faction (${candACAfter} === ${candACBefore})`);
  assert(estCAfter === estCBefore, `Confidence is completely unaffected for rival faction (${estCAfter} === ${estCBefore})`);

  // Verify candidate poll boost
  const updatedField = Engine.version01CandidateField(g5, 'senate:GA', 'people');
  const endorsedCand = updatedField.find((c) => c.id === candA.id);
  assert(endorsedCand.poll === candAPollBefore + 10, `Endorsed candidate received +10 pt polling swing (was ${candAPollBefore}, now ${endorsedCand.poll})`);

  // -----------------------------------------------------------------------------
  // SUITE 6: REQ-159 Politician Factions & Dynamic Happiness Coupling
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 6: REQ-159 Politician Factions & Coupling ---');
  let g6 = Engine.createGame('people');

  // Test 6a: 100% of 605 politicians have a valid factionId
  assert(Array.isArray(g6.politicians) && g6.politicians.length === 605, `Politician universe has exactly 605 politicians (got ${g6.politicians?.length})`);
  const missingFaction = g6.politicians.filter((p) => !p.factionId);
  assert(missingFaction.length === 0, `0 politicians missing factionId across all 605 records (missing: ${missingFaction.length})`);

  const validFactionIds = new Set(Data.FACTIONS_CATALOG.map((f) => f.id));
  const invalidFaction = g6.politicians.filter((p) => !validFactionIds.has(p.factionId));
  assert(invalidFaction.length === 0, `All 605 politicians have factionId referencing a valid catalog entry (invalid: ${invalidFaction.length})`);

  // Test 6b: Synchronized Co-Movement: faction deltas propagate to politicians
  const targetFactionId = 'dem_capital_l_left';
  const polsInFaction = g6.politicians.filter((p) => p.factionId === targetFactionId);
  assert(polsInFaction.length > 0, `Found ${polsInFaction.length} politicians in ${targetFactionId}`);

  const samplePol = polsInFaction[0];
  const samplePolHBefore = samplePol.happiness;

  // Induce faction happiness change (+5) via co-movement
  Engine.applyFactionHappinessDelta(g6, targetFactionId, 5);
  assert(samplePol.happiness === samplePolHBefore + 5, `Politician happiness co-moved by +5 with faction delta (was ${samplePolHBefore}, now ${samplePol.happiness})`);

  // Test 6c: Personal Drift - Candidate Ad Spend Triage (+1.0 happiness per $1M, up to +15)
  g6.phase = 'general-campaign';
  g6.treasury = 50;
  g6.candidateFunding = {
    'senate:GA': {
      candidateId: samplePol.id,
      candidateName: samplePol.name,
      partyId: 'people',
      office: 'senate',
      stateId: 'GA',
      allocation: 0,
      happiness: 60,
    }
  };
  samplePol.raceId = 'senate:GA';
  const polHBeforeAd = samplePol.happiness;
  g6 = Engine.allocateCandidateFunds(g6, 'senate:GA', 10); // $10M spend -> +10 happiness

  assert(samplePol.happiness === polHBeforeAd + 10, `Ad spend allocated +$10M awarded +10 individual happiness drift (was ${polHBeforeAd}, now ${samplePol.happiness})`);

  // Test 6d: Faction Defection / Bolting flips lawmaker to Independent and vacates roles
  g6.leadershipRoles = {
    player: {
      speakerOfHouse: samplePol.id,
      policyLeader: samplePol.id,
    }
  };
  assert(g6.leadershipRoles.player.speakerOfHouse === samplePol.id, 'Sample pol assigned as Speaker of House');

  g6 = Engine.boltFaction(g6, targetFactionId);
  const defectorPol = g6.politicians.find((p) => p.id === samplePol.id);
  assert(defectorPol.party === 'independent', `Defecting lawmaker party flipped to independent (got ${defectorPol.party})`);
  assert(defectorPol.caucus === 'independent', `Defecting lawmaker caucus flipped to independent (got ${defectorPol.caucus})`);
  assert(!g6.leadershipRoles.player.speakerOfHouse, 'Speaker of House vacated by defecting lawmaker');
  assert(!g6.leadershipRoles.player.policyLeader, 'Policy Leader role vacated by defecting lawmaker');

  // -----------------------------------------------------------------------------
  // SUITE 7: REQ-160 Verification Badge Removed from Factions Header
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 7: REQ-160 Verification Badge Removed from Factions Header ---');
  let g7 = Engine.createGame('people');
  App.setGame(g7);
  const factionsTabHtml = App.factionsTabMarkup();
  assert(!factionsTabHtml.includes('✔ Zero-Variance 155M Voter Model Verified'), 'Verification checkmark badge is NOT present in Factions tab HTML');
  assert(!factionsTabHtml.includes('v15-cert-badge"'), 'v15-cert-badge CSS class is NOT present in Factions tab header');
  assert(factionsTabHtml.includes('National Faction Health & 51-State Allocations'), 'Factions tab header title renders cleanly');
  assert(factionsTabHtml.includes('Version 0.15 Coalition Dynamics'), 'Factions tab eyebrow renders cleanly');

  // -----------------------------------------------------------------------------
  // SUITE 8: UI Integration & Priorities Deck Render
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 8: UI Integration & Priorities Deck Render ---');
  let g8Major = Engine.createGame('people');
  App.setGame(g8Major);
  const majorPrioritiesHtml = App.step2PrioritiesMarkup();
  assert(majorPrioritiesHtml.includes('Party Focus 7'), 'Major party renders Party Focus 7 slot');
  assert(!majorPrioritiesHtml.includes('Party Focus 8'), 'Major party does NOT render Party Focus 8 slot (strictly 7 slots)');
  assert(majorPrioritiesHtml.includes('btn-lock-party-focuses'), 'Tier 2 renders [Lock In Party Focuses] button');

  let g8Minor = Engine.createGame('liberty');
  App.setGame(g8Minor);
  const minorPrioritiesHtml = App.step2PrioritiesMarkup();
  assert(minorPrioritiesHtml.includes('Party Focus 3'), 'Minor party renders Party Focus 3 slot');
  assert(!minorPrioritiesHtml.includes('Party Focus 4'), 'Minor party does NOT render Party Focus 4 slot (strictly 3 slots)');

  console.log('\n================================================================');
  console.log(`ALL INTEGRATION TESTS PASSED: ${passedTests} / ${totalTests} assertions passed.`);
  console.log('================================================================');
}

runSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
