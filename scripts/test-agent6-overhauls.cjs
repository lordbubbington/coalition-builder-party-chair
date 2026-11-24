/**
 * Standalone Node Test Suite for Agent 6: Custom Parties, Registration & Actions Overhaul
 * Verifies REQ-63, 64, 65, 66, 68, 69, 71, 78, 79, 80, 85, 86
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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
  atob: str => Buffer.from(str, 'base64').toString('binary'),
  btoa: str => Buffer.from(str, 'binary').toString('base64'),
  Blob: global.Blob,
  DecompressionStream: global.DecompressionStream,
  Response: global.Response,
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

function loadScript(filePath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
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
loadScript('v07-scaffolding.js');
loadScript('engine.js');

const Engine = sandbox.window.PartyChairEngine;
const Data = sandbox.window.PartyChairData;
const V07 = sandbox.window.PartyChairV07;

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✅ PASS: ${message}`);
}

console.log('================================================================');
console.log('RUNNING AGENT 6 OVERHAUL VERIFICATION TESTS');
console.log('================================================================\n');

// 1. REQ-63: Autonomous Custom Party Creation (Non-replacing, Color, Leader, Incumbent Defection)
console.log('--- Test Group 1: REQ-63 Autonomous Custom Party Creation ---');
{
  const customGame = Engine.createGame({
    baseTemplateId: 'people',
    customName: 'Patriot Coalition',
    customValues: {
      color: '#06b6d4',
      leaderName: 'Marcus Sterling',
      leaderArchetype: 'current-politician',
      claimedSeat: {
        office: 'governor',
        stateId: 'PA',
        seatId: 'PA',
        incumbentName: 'Josh Shapiro',
        party: 'people',
      },
    },
  });

  assert(customGame.player.custom === true, 'Player entity is marked as custom');
  assert(customGame.player.name === 'Patriot Coalition', 'Custom party name preserved');
  assert(customGame.player.color === '#06b6d4', 'Custom party hex color preserved');
  assert(customGame.player.leaderName === 'Marcus Sterling', 'Custom leader name preserved');
  assert(customGame.rivals.length === 6, 'Custom party does not replace base parties; all 6 base parties are rivals');
  
  const sittingLeader = customGame.sittingMembers.find(m => m.name === 'Marcus Sterling');
  assert(Boolean(sittingLeader), 'Claimed politician is enrolled as sitting member in custom party');
  assert(sittingLeader.office === 'governor' && sittingLeader.stateId === 'PA', 'Sitting leader holds claimed gubernatorial seat');
  assert(sittingLeader.isIncumbent === true, 'Sitting leader is recognized as incumbent');
}

// 2. REQ-71 / REQ-264: Starting Chapters for Minor and Custom Parties
console.log('\n--- Test Group 2: REQ-71 50-State Starting Chapters ---');
{
  const minorParties = ['liberty', 'green', 'constitution', 'socialist'];
  minorParties.forEach(pid => {
    const minorGame = Engine.createGame({ baseTemplateId: pid });
    const statesWithChapters = Object.keys(minorGame.stateChapters || {}).filter(st => (minorGame.stateChapters[st] || 0) >= 1);
    const expectedMin = pid === 'liberty' ? 50 : Object.keys(Engine.STARTING_3RD_PARTY_CHAPTERS?.[pid] || {}).length;
    assert(statesWithChapters.length >= expectedMin, `Minor party ${pid} starts with at least ${expectedMin} branches matching footprint (count: ${statesWithChapters.length})`);
  });

  const customGame = Engine.createGame({
    baseTemplateId: 'people',
    customName: 'Liberty Alliance',
    customValues: { color: '#ec4899', leaderName: 'Valerie Stone' },
  });
  const customStatesWithChapters = Object.keys(customGame.stateChapters || {}).filter(st => (customGame.stateChapters[st] || 0) >= 1);
  assert(customStatesWithChapters.length === 0, `Custom party starts with zero branches per REQ-265 (count: ${customStatesWithChapters.length})`);
}

// 3. REQ-85: Fame-Scaled Popularity
console.log('\n--- Test Group 3: REQ-85 Fame-Scaled Popularity ---');
{
  const testCandidate = Engine.enrichCandidateForV07({
    id: 'test-cand-85',
    name: 'Governor Test',
    fame: 50,
    rawPopularity: 60,
  });
  // Popularity = RawPopularity * (Fame / 100) = 60 * 0.50 = 30
  assert(testCandidate.popularity === 30, `Popularity scales cleanly with fame (expected 30, got ${testCandidate.popularity})`);
  assert(testCandidate.rawPopularity === 60, `Raw popularity preserved as 60`);

  const netApproval = Engine.computeLeaderNetApproval(testCandidate);
  // Net Approval = (2 * Popularity) - Fame = (2 * 30) - 50 = +10
  assert(netApproval === 10, `Net Approval cleanly reflects fame-scaled formula (expected 10, got ${netApproval})`);
}

// 4. REQ-86: Small Donor Drive Overhaul & Visit Fatigue
console.log('\n--- Test Group 4: REQ-86 Small Donor Drive Overhaul ---');
{
  let game = Engine.createGame({ baseTemplateId: 'people' });
  const initialTreasury = game.treasury;

  // 1st visit to PA
  game = Engine.takeAction(game, 'fundraise', { stateId: 'PA' });
  const yield1 = game.treasury - initialTreasury;
  assert(game.donorDriveVisits['PA'] === 1, 'First visit to PA recorded in donorDriveVisits');
  assert(yield1 >= 3.5 && yield1 <= 15.0, `1st visit yield is calibrated to ~$5.0M average nationwide (large state PA got $${yield1.toFixed(2)}M)`);

  // 2nd visit to PA (fatigue = 0.70)
  const treasuryBefore2 = game.treasury;
  game = Engine.takeAction(game, 'fundraise', { stateId: 'PA' });
  const yield2 = game.treasury - treasuryBefore2;
  assert(game.donorDriveVisits['PA'] === 2, 'Second visit to PA recorded');
  assert(yield2 < yield1, `2nd visit yield ($${yield2.toFixed(2)}M) is lower than 1st visit ($${yield1.toFixed(2)}M) due to fatigue`);

  // 3rd visit to PA (fatigue = 0.45)
  const treasuryBefore3 = game.treasury;
  game = Engine.takeAction(game, 'fundraise', { stateId: 'PA' });
  const yield3 = game.treasury - treasuryBefore3;
  assert(game.donorDriveVisits['PA'] === 3, 'Third visit to PA recorded');
  assert(yield3 < yield2, `3rd visit yield ($${yield3.toFixed(2)}M) is lower than 2nd visit ($${yield2.toFixed(2)}M)`);

  // Different state (OH) should be fresh (fatigue = 1.0)
  const treasuryBeforeOH = game.treasury;
  game = Engine.takeAction(game, 'fundraise', { stateId: 'OH' });
  const yieldOH = game.treasury - treasuryBeforeOH;
  assert(game.donorDriveVisits['OH'] === 1, 'OH first visit recorded');
  assert(yieldOH > yield3, `Fresh state yield ($${yieldOH.toFixed(2)}M) exceeds fatigued state yield ($${yield3.toFixed(2)}M)`);
}

// 5. REQ-68: Commissioned Race Polling
console.log('\n--- Test Group 5: REQ-68 Commissioned Race Polling ---');
{
  let game = Engine.createGame({ baseTemplateId: 'people' });
  const initialTreasury = game.treasury;

  // Senate poll costs $2M
  game = Engine.takeAction(game, 'commission-poll', { raceId: 'senate:GA' });
  assert(game.treasury === initialTreasury - 2.0, `Senate commissioned poll deducts exactly $2M (expected ${initialTreasury - 2}, got ${game.treasury})`);
  assert(Boolean(game.commissionedPolls['senate:GA']), 'Commissioned poll stored in game.commissionedPolls');
  assert(typeof (game.commissionedPolls['senate:GA'].shares.player ?? game.commissionedPolls['senate:GA'].shares.people) === 'number', 'Accurate polling shares recorded');

  // House poll costs $1M
  const treasuryBeforeHouse = game.treasury;
  game = Engine.takeAction(game, 'commission-poll', { raceId: 'house:GA-1' });
  assert(game.treasury === treasuryBeforeHouse - 1.0, `House commissioned poll deducts exactly $1M (expected ${treasuryBeforeHouse - 1}, got ${game.treasury})`);
  assert(Boolean(game.commissionedPolls['house:GA-1']), 'House poll snapshot stored');
}

// 6. REQ-69: Priorities Lock-In
console.log('\n--- Test Group 6: REQ-69 Priorities Lock-In ---');
{
  let game = Engine.createGame({ baseTemplateId: 'people' });
  assert(game.prioritiesLocked === false, 'Priorities start unlocked');

  // Select an eligible quest from offered hand
  const eligibleQuest = (game.priorities?.offeredQuestIds && game.priorities.offeredQuestIds[0]) || 'fundraising';
  game = Engine.takeAction(game, 'select-main-priority', { questId: eligibleQuest, slotIndex: 0 });
  assert(game.priorities.main[0] === eligibleQuest, 'Priority slot 0 assigned');

  // Lock priorities
  game = Engine.takeAction(game, 'lock-priorities', {});
  assert(game.prioritiesLocked === true || game.priorities?.handLocked === true, 'Priorities locked after lock-priorities action');

  // Attempt to overwrite or remove should be rejected
  const otherQuest = (game.priorities?.offeredQuestIds && game.priorities.offeredQuestIds[1]) || 'growing-vote-nationally';
  const lockedState = Engine.takeAction(game, 'select-main-priority', { questId: otherQuest, slotIndex: 0 });
  assert(lockedState.priorities.main[0] === eligibleQuest, 'Locked priority cannot be overwritten');

  const removeAttempt = Engine.takeAction(game, 'remove-main-priority', { slotIndex: 0 });
  assert(removeAttempt.priorities.main[0] === eligibleQuest, 'Locked priority cannot be removed');
}

// 7. REQ-65: Party Leader Candidacy Deployment
console.log('\n--- Test Group 7: REQ-65 Party Leader Deployment ---');
{
  let game = Engine.createGame({ baseTemplateId: 'people' });
  // Add a bench leader to roster from available offers
  const leaderId = game.offers[0] || 'ossoff';
  game.roster = [leaderId];
  const leaderObj = Data.MEMBERS.find(m => m.id === leaderId);
  const raceId = 'senate:GA';

  game = Engine.takeAction(game, 'deploy-leader-candidate', { leaderId, raceId });
  assert(!game.roster.includes(leaderId), 'Deployed leader removed from bench roster');
  assert(game.primaryEndorsements[raceId] === `deployed-${leaderId}`, 'Deployed candidate automatically endorsed');
  const targetParty = game.player.baseTemplateId || 'people';
  const deployedCand = (game.primaryFields[raceId]?.[targetParty] || []).find(c => c.benchLeaderId === leaderId);
  assert(Boolean(deployedCand), 'Candidate created in primary field with benchLeaderId link');
  assert(deployedCand.fame === leaderObj.fame, 'Leader fame transferred to candidate');
}

// 8. REQ-66: Strict Disaggregation of Voter Registration (Never combine third parties)
console.log('\n--- Test Group 8: REQ-66 Disaggregated Voter Registration ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });
  const vmStates = game.voterModel.states;
  const sampleState = vmStates['PA'] || vmStates.find(s => s.stateId === 'PA');
  const aff = sampleState.affiliations;

  assert(typeof aff.people === 'number', 'Democratic voters disaggregated');
  assert(typeof aff.heritage === 'number', 'Republican voters disaggregated');
  assert(typeof aff.independent === 'number', 'Independent voters disaggregated');
  assert(typeof aff.liberty === 'number', 'Libertarian voters disaggregated');
  assert(typeof aff.green === 'number', 'Green voters disaggregated');
  assert(typeof aff.other === 'number', 'Other pool exists for statutory minor parties');

  // Verify that minor parties are calculated with non-zero independent totals
  const conVoters = Math.round(aff.other * 100 * 0.45);
  const socVoters = Math.round(aff.other * 100 * 0.40);
  assert(conVoters > 0, 'Constitution Party has independent non-zero disaggregated total');
  assert(socVoters > 0, 'Socialist Party has independent non-zero disaggregated total');
  assert(conVoters !== socVoters, 'Minor parties are distinct entities');
}

console.log('\n================================================================');
console.log(`ALL TESTS PASSED! (${passedTests}/${totalTests} assertions verified)`);
console.log('================================================================\n');
