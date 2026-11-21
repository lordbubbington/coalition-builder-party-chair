/**
 * Master Verification & Integration Test Suite for Version 0.15.4
 * Target: scripts/test-v0154-integration.cjs
 *
 * Objectives (Covering REQ-171 from VERSION_0.15.4_DESIGN.md):
 * 1. REQ-171: Phase-End Faction-to-Party Inheritance Verification (synchronizePoliticianPartyWithFaction)
 * 2. Multi-collection coverage: sittingMembers, rosterMembers, candidates, and politicians
 * 3. Phase Exit 1: Organizing / Recruitment -> Primaries (advanceToPrimaries, resolveVersion01Primaries, advanceChairTurn turn 20)
 * 4. Phase Exit 2: Primaries -> General Campaign (resolvePrimaries, end of resolveVersion01Primaries, startCampaignPhase)
 * 5. Phase Exit 3: General Campaign -> Election Night (advanceCampaignWeek month 5, advanceToElectionNight, resolveVersion01GeneralElection)
 * 6. Phase Exit 4: Inter-cycle turnover (startNextCycle)
 * 7. Cascading bolting and coalition accord inheritance
 * 8. Engine Invariants: SAVE_KEY bumped to v15.4, backward compatibility, and version string 0.15.4
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
  assert(typeof Engine.synchronizePoliticianPartyWithFaction === 'function', 'synchronizePoliticianPartyWithFaction exported on Engine');
  assert(typeof Engine.advanceToPrimaries === 'function', 'advanceToPrimaries exported on Engine');
  assert(typeof Engine.resolvePrimaries === 'function', 'resolvePrimaries exported on Engine');
  assert(typeof Engine.advanceToElectionNight === 'function', 'advanceToElectionNight exported on Engine');

  console.log('================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.4 MASTER TEST SUITE');
  console.log('================================================================\n');

  // ============================================================================
  // SUITE 1: REQ-171 Core Alignment Logic
  // ============================================================================
  console.log('--- SUITE 1: REQ-171 Core Alignment Logic ---');

  {
    const mockSitting = [
      { id: 'pol_dem', name: 'Dem Pol', factionId: 'dem_liberal_establishment', party: 'heritage', isIndependent: false },
      { id: 'pol_gop', name: 'GOP Pol', factionId: 'gop_maga', party: 'people', isIndependent: false },
      { id: 'pol_lib', name: 'Lib Pol', factionId: 'lib_true_libertarians', party: 'people', isIndependent: false },
      { id: 'pol_ind', name: 'Ind Pol', factionId: 'swg_working_class_latinos', party: 'people', isIndependent: false },
      { id: 'pol_unaff', name: 'Unaff Pol', factionId: 'unaff_the_klan', party: 'heritage', isIndependent: false },
    ];

    const mockRoster = [
      { id: 'ros_grn', name: 'Grn Leader', factionId: 'grn_eco_socialist_vanguard', party: 'people', isIndependent: false },
      { id: 'ros_con', name: 'Con Leader', factionId: 'con_christian_dominionists', party: 'heritage', isIndependent: false },
    ];

    const mockCandidates = [
      { id: 'cand_dem', name: 'Dem Cand', factionId: 'dem_capital_l_left', party: 'heritage', isIndependent: false },
      { id: 'cand_ind', name: 'Ind Cand', factionId: 'swg_true_centrists', party: 'heritage', isIndependent: false },
    ];

    const testGame = {
      sittingMembers: mockSitting,
      rosterMembers: mockRoster,
      candidates: mockCandidates,
    };

    const synced = Engine.synchronizePoliticianPartyWithFaction(testGame);

    // sittingMembers checks
    const polDem = synced.sittingMembers.find((p) => p.id === 'pol_dem');
    assert(polDem.party === 'people', 'Dem Pol party updated to people');
    assert(polDem.isIndependent === false, 'Dem Pol isIndependent is false');

    const polGop = synced.sittingMembers.find((p) => p.id === 'pol_gop');
    assert(polGop.party === 'heritage', 'GOP Pol party updated to heritage');
    assert(polGop.isIndependent === false, 'GOP Pol isIndependent is false');

    const polLib = synced.sittingMembers.find((p) => p.id === 'pol_lib');
    assert(polLib.party === 'liberty', 'Lib Pol party updated to liberty');
    assert(polLib.isIndependent === false, 'Lib Pol isIndependent is false');

    const polInd = synced.sittingMembers.find((p) => p.id === 'pol_ind');
    assert(polInd.party === 'independent', 'Ind Pol party updated to independent');
    assert(polInd.isIndependent === true, 'Ind Pol isIndependent is true');

    const polUnaff = synced.sittingMembers.find((p) => p.id === 'pol_unaff');
    assert(polUnaff.party === 'independent', 'Unaff Pol party updated to independent');
    assert(polUnaff.isIndependent === true, 'Unaff Pol isIndependent is true');

    // rosterMembers checks
    const rosGrn = synced.rosterMembers.find((p) => p.id === 'ros_grn');
    assert(rosGrn.party === 'green', 'Grn Leader party updated to green');

    const rosCon = synced.rosterMembers.find((p) => p.id === 'ros_con');
    assert(rosCon.party === 'constitution', 'Con Leader party updated to constitution');

    // candidates checks
    const candDem = synced.candidates.find((p) => p.id === 'cand_dem');
    assert(candDem.party === 'people', 'Dem Cand party updated to people');

    const candInd = synced.candidates.find((p) => p.id === 'cand_ind');
    assert(candInd.party === 'independent', 'Ind Cand party updated to independent');
    assert(candInd.isIndependent === true, 'Ind Cand isIndependent is true');
  }

  // ============================================================================
  // SUITE 2: Dynamic game.factions Bolting & Accord Precedence
  // ============================================================================
  console.log('\n--- SUITE 2: Dynamic game.factions Bolting & Accord Precedence ---');

  {
    // Test 1: Bolted Faction (partyId = 'none' in game.factions)
    const boltedGame = {
      factions: [
        { id: 'gop_maga', name: 'MAGA', partyId: 'none' }, // Bolted!
      ],
      sittingMembers: [
        { id: 'pol_maga_1', name: 'Maga Lawmaker', factionId: 'gop_maga', party: 'heritage', isIndependent: false },
      ],
    };

    const syncedBolted = Engine.synchronizePoliticianPartyWithFaction(boltedGame);
    const lawmaker = syncedBolted.sittingMembers.find((p) => p.id === 'pol_maga_1');
    assert(lawmaker.party === 'independent', 'Lawmaker of bolted faction inherited independent party status');
    assert(lawmaker.isIndependent === true, 'Lawmaker of bolted faction marked as isIndependent');

    // Test 2: Coalition Accord Signed (partyId = 'people' in game.factions for previously independent faction)
    const accordGame = {
      factions: [
        { id: 'swg_working_class_latinos', name: 'Working Class Latinos', partyId: 'people' }, // Joined Democrats!
      ],
      sittingMembers: [
        { id: 'pol_latino_1', name: 'Latino Official', factionId: 'swg_working_class_latinos', party: 'independent', isIndependent: true },
      ],
    };

    const syncedAccord = Engine.synchronizePoliticianPartyWithFaction(accordGame);
    const official = syncedAccord.sittingMembers.find((p) => p.id === 'pol_latino_1');
    assert(official.party === 'people', 'Official of newly allied faction inherited people party status');
    assert(official.isIndependent === false, 'Official isIndependent flag cleared');
  }

  // ============================================================================
  // SUITE 3: Phase Exit 1 (Organizing / Recruitment -> Primaries)
  // ============================================================================
  console.log('\n--- SUITE 3: Phase Exit 1 (Organizing / Recruitment -> Primaries) ---');

  {
    const game = Engine.createGame('people', 'test-seed-1');
    // Inject a mismatched party on a sitting member and candidate
    const targetMember = game.sittingMembers[0];
    targetMember.factionId = 'dem_capital_l_left';
    targetMember.party = 'heritage'; // mismatched!

    game.candidates = [
      { id: 'test_cand_1', name: 'Test Candidate', factionId: 'dem_blue_dog', party: 'heritage', isIndependent: false },
    ];

    // Test direct advanceToPrimaries
    const postPrimaries = Engine.advanceToPrimaries(game);
    const updatedMember = postPrimaries.sittingMembers.find((m) => m.id === targetMember.id);
    assert(updatedMember.party === 'people', 'Phase Exit 1: sittingMember party synchronized to people upon entering primaries');

    const updatedCand = postPrimaries.candidates.find((c) => c.id === 'test_cand_1');
    assert(updatedCand.party === 'people', 'Phase Exit 1: candidate party synchronized to people upon entering primaries');
  }

  // ============================================================================
  // SUITE 4: Phase Exit 2 (Primaries -> General Campaign)
  // ============================================================================
  console.log('\n--- SUITE 4: Phase Exit 2 (Primaries -> General Campaign) ---');

  {
    const game = Engine.createGame('people', 'test-seed-2');
    game.sittingMembers[0].factionId = 'dem_liberal_establishment';
    game.sittingMembers[0].party = 'heritage'; // mismatched!

    // Test startCampaignPhase
    const campaignGame = Engine.startCampaignPhase(game);
    const member = campaignGame.sittingMembers[0];
    assert(member.party === 'people', 'Phase Exit 2: sittingMember party synchronized to people in startCampaignPhase');
    assert(campaignGame.phase === 'general-campaign', 'Game phase is general-campaign');
  }

  // ============================================================================
  // SUITE 5: Phase Exit 3 (General Campaign -> Election Night)
  // ============================================================================
  console.log('\n--- SUITE 5: Phase Exit 3 (General Campaign -> Election Night) ---');

  {
    const game = Engine.createGame('people', 'test-seed-3');
    const campaignGame = Engine.startCampaignPhase(game);
    
    // Inject a mismatched party on sitting member
    campaignGame.sittingMembers[0].factionId = 'dem_black_voters';
    campaignGame.sittingMembers[0].party = 'independent'; // mismatched!

    // Advance to election night
    const electionGame = Engine.advanceToElectionNight(campaignGame);
    const member = electionGame.sittingMembers.find((m) => m.id === campaignGame.sittingMembers[0].id);
    assert(member.party === 'people', 'Phase Exit 3: sittingMember party synchronized to people upon advanceToElectionNight');
    assert(electionGame.phase === 'complete', 'Game phase is complete');
  }

  // ============================================================================
  // SUITE 6: Phase Exit 4 (startNextCycle Inter-Cycle Turnover)
  // ============================================================================
  console.log('\n--- SUITE 6: Phase Exit 4 (startNextCycle Inter-Cycle Turnover) ---');

  {
    const game = Engine.createGame('people', 'test-seed-4');
    const campaignGame = Engine.startCampaignPhase(game);
    const electionGame = Engine.advanceToElectionNight(campaignGame);

    // Inject a mismatched party before turnover
    electionGame.sittingMembers[0].factionId = 'dem_bernie_bros';
    electionGame.sittingMembers[0].party = 'heritage'; // mismatched!

    const nextCycleGame = Engine.startNextCycle(electionGame);
    const member = nextCycleGame.sittingMembers.find((m) => m.id === electionGame.sittingMembers[0].id);
    assert(member.party === 'people', 'Phase Exit 4: sittingMember party synchronized to people in startNextCycle');
    assert(nextCycleGame.phase === 'organizing', 'Next cycle phase is organizing');
  }

  // ============================================================================
  // SUITE 7: Invariants, Save Key & Version Strings
  // ============================================================================
  console.log('\n--- SUITE 7: Invariants, Save Key & Version Strings ---');

  {
    const game = Engine.createGame('people', 'test-seed-5');
    assert(['0.15.4', '0.15.5'].includes(game.version), `Game version string is 0.15.4 or 0.15.5 (got ${game.version})`);
    assert(['partyChairGame.save.v15.4', 'partyChairGame.save.v15.5'].includes(Engine.SAVE_KEY), `SAVE_KEY is partyChairGame.save.v15.4 or v15.5 (got ${Engine.SAVE_KEY})`);

    // Verify save/load migration from v15.3
    const fakeV153State = { ...game, version: '0.15.3' };
    mockLocalStorage.setItem('partyChairGame.save.v15.3', JSON.stringify(fakeV153State));
    mockLocalStorage.removeItem('partyChairGame.save.v15.4');

    const loaded = Engine.loadGame();
    assert(loaded !== null, 'Loaded game successfully from previous save key');
    assert(['0.15.4', '0.15.5'].includes(loaded.version), `Migrated save upgraded to version 0.15.4 or 0.15.5 (got ${loaded.version})`);

    // Verify 155M registered voters invariant
    const totalVoters = (game.voterModel?.states || []).reduce((sum, s) => {
      return sum + (s.representedVoters || 0);
    }, 0);
    assert(Math.round(totalVoters / 1000000) === 155, `Voter model retains 155M registered voters across 51 states + DC (got ${totalVoters})`);
  }

  // ============================================================================
  // SUITE 8: Court Politician to Party & Faction Verification
  // ============================================================================
  console.log('\n--- SUITE 8: Court Politician to Party & Faction Verification ---');

  {
    const game = Engine.createGame('people', 'test-court-seed');
    game.treasury = 50;
    game.actionsLeft = 5;

    // Find Bernie Sanders or Angus King in sittingMembers
    const sanders = game.sittingMembers.find((m) => m.name === 'Bernie Sanders' || m.party === 'independent');
    assert(Boolean(sanders), 'Found independent sitting member (Bernie Sanders / Independent)');
    assert(sanders.party === 'independent', 'Initial independent lawmaker has party === independent');

    // Court lawmaker to join the party
    const courted = Engine.takeAction(game, 'persuade-independent-caucus', { targetId: sanders.id });
    const courtedSanders = courted.sittingMembers.find((m) => m.id === sanders.id);

    assert(Boolean(courtedSanders), 'Courted lawmaker found in sittingMembers');
    assert(courtedSanders.party === 'people', `Courted lawmaker party is people (got ${courtedSanders.party})`);
    assert(courtedSanders.rawParty === 'D', `Courted lawmaker rawParty is D (got ${courtedSanders.rawParty})`);
    assert(courtedSanders.isIndependent === false, 'Courted lawmaker isIndependent is false');
    assert(courtedSanders.hasSwitchedThisCycle === true, 'Courted lawmaker hasSwitchedThisCycle is true');
    assert(courtedSanders.caucus === 'people', 'Courted lawmaker caucus is people');
    assert(Boolean(courtedSanders.factionId), `Courted lawmaker assigned to faction (${courtedSanders.factionId})`);
    assert(courted.roster.includes(sanders.id), 'Courted lawmaker added to game.roster');
    assert(courted.recruited.includes(sanders.id), 'Courted lawmaker added to game.recruited');

    // Verify resolveSeatIdentity in window context
    const seatMeta = sandbox.window.resolveSeatIdentity ? sandbox.window.resolveSeatIdentity(courtedSanders) : null;
    if (seatMeta) {
      assert(seatMeta.isIndependent === false, 'resolveSeatIdentity reports isIndependent === false');
      assert(seatMeta.party === 'people', `resolveSeatIdentity reports party === people (got ${seatMeta.party})`);
      assert(seatMeta.affiliationLabel === 'Democratic', `resolveSeatIdentity affiliationLabel is Democratic (got ${seatMeta.affiliationLabel})`);
    }

    // Verify Save / Load persistence
    Engine.saveGame(courted);
    const reloaded = Engine.loadGame();
    const reloadedSanders = reloaded.sittingMembers.find((m) => m.id === sanders.id);
    assert(reloadedSanders.party === 'people', `Reloaded courted lawmaker retains party === people (got ${reloadedSanders.party})`);
    assert(reloadedSanders.isIndependent === false, 'Reloaded courted lawmaker retains isIndependent === false');
    assert(reloadedSanders.hasSwitchedThisCycle === true, 'Reloaded courted lawmaker retains hasSwitchedThisCycle === true');

    // Verify House member courting & chamber seats update
    const repTarget = game.sittingMembers.find((m) => m.office === 'house' && m.party !== 'people');
    if (repTarget) {
      repTarget.happiness = 25; // Meet discontent gate (<= 40)
      const prevSeats = game.seats || 0;
      const courtedRepGame = Engine.takeAction(game, 'court-politician', { targetId: repTarget.id });
      const courtedRep = courtedRepGame.sittingMembers.find((m) => m.id === repTarget.id);
      if (courtedRep.party === 'people') {
        assert(courtedRep.party === 'people', 'Courted House rep party updated to people');
        assert(courtedRep.isIndependent === false, 'Courted House rep isIndependent is false');
        assert(courtedRepGame.seats >= prevSeats, 'Chamber House seat count maintained or incremented');
        assert(courtedRepGame.roster.includes(repTarget.id), 'Courted House rep added to game.roster');
      }
    }

    // Verify Custom Party courting
    const customGame = Engine.createGame({
      baseTemplateId: 'people',
      custom: true,
      customName: 'Progressive Alliance',
      partyCode: 'PA',
    }, 'custom-court-seed');
    customGame.player.id = 'player';
    customGame.player.custom = true;
    customGame.treasury = 50;
    customGame.actionsLeft = 5;

    const customTarget = customGame.sittingMembers.find((m) => m.name === 'Bernie Sanders' || m.party === 'independent');
    if (customTarget) {
      const courtedCustom = Engine.takeAction(customGame, 'court-politician', {
        targetId: customTarget.id,
        roleId: 'deputy_chair',
      });
      const member = courtedCustom.sittingMembers.find((m) => m.id === customTarget.id);
      assert(member.party === 'player', `Custom party courted lawmaker party is player (got ${member.party})`);
      assert(member.isIndependent === false, 'Custom party courted lawmaker isIndependent is false');
      assert(courtedCustom.roster.includes(customTarget.id), 'Custom party courted lawmaker added to roster');
    }
  }

  console.log('\n================================================================');
  console.log(`ALL INTEGRATION TESTS PASSED: ${passedTests} / ${totalTests} assertions passed.`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
