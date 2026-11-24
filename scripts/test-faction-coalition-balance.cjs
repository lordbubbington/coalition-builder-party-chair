/**
 * scripts/test-faction-coalition-balance.cjs
 * Verification test suite for Developer 2: Faction Dynamics, Minor-Party Ascent & Coalition Balance
 * Chunks 2.1 - 2.5
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

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
  'political-texture-system.js',
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'ballot-access.js',
  'candidate-vetting.js',
  'election-uncertainty.js',
  'election-drift.js',
  'election-night-engine.js',
  'campaign-overhaul.js',
  'media-shocks-system.js',
  'faction-era-stability.js',
  'redistricting-ballot-system.js',
  'atlas-multiplayer-system.js',
  'engine.js',
].forEach((file) => require(path.join(ROOT, file)));

const Engine = global.PartyChairEngine;
const FactionsCatalog = global.PartyChairData.FACTIONS_CATALOG;
const FactionEraStability = global.FactionEraStability;
const RedistrictingBallotSystem = global.RedistrictingBallotSystem;
const AtlasMultiplayerSystem = global.AtlasMultiplayerSystem;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('====================================================================');
console.log(' TEST SUITE: Faction Dynamics, Minor-Party Ascent & Coalition Balance');
console.log('====================================================================\n');

// ====================================================================
// CHUNK 2.1: Small-Population Breakthrough & High-Leverage Mid-Game Sinks
// ====================================================================
console.log('--- 1. Chunk 2.1: Break Tier 2 Glass Ceiling in Small-Population States ---');

// Test reallocateStateHouseSeatCounts Regional Breakthrough in NH
const mockGameNH = Engine.createGame({ playerParty: 'liberty' });
mockGameNH.stateOrganizations = {
  NH: {
    liberty: { chapters: 7 },
    people: { chapters: 2 },
    heritage: { chapters: 2 },
  },
};
mockGameNH.contestedStateLegSlates = { NH: 5 };
mockGameNH.contestedStateHouseSlates = { NH: 5 };

// Simulate NH statehouse reallocation where liberty gets 10% vote
const nhOldControls = { NH: ['heritage'] };
const nhNewControls = { NH: ['heritage'] };
const initialCounts = {
  NH: { people: 190, heritage: 210, independent: 0, other: 0, total: 400 },
};

// Force party votes to reflect 10% for liberty
const reallocated = Engine.reallocateStateHouseSeatCounts(initialCounts, nhOldControls, nhNewControls, {
  ...mockGameNH,
  voterModel: {
    states: [
      {
        stateId: 'NH',
        affiliations: {
          people: 45,
          heritage: 45,
          liberty: 10,
          independent: 0,
        },
      },
    ],
  },
});

const nhResult = reallocated.NH;
assert(nhResult && nhResult.liberty >= 1 && nhResult.liberty <= 4, `NH Regional Breakthrough granted 1-4 seats to Libertarians at 10% vote (actual: ${nhResult?.liberty})`);
assert(nhResult.people + nhResult.heritage + nhResult.liberty + (nhResult.independent || 0) === 400, 'NH total statehouse seats conserved at exactly 400');

// Test evaluateStatehouseStandouts hooks into these statehouse seat wins
mockGameNH.stateHouseSeatCounts = reallocated;
const standoutsResult = Engine.evaluateStatehouseStandouts(mockGameNH, {});
assert(Array.isArray(standoutsResult.stateLegStandouts?.liberty) && standoutsResult.stateLegStandouts.liberty.length >= 1, `evaluateStatehouseStandouts generated farm team standouts for Libertarians (count: ${standoutsResult.stateLegStandouts?.liberty?.length})`);
assert(standoutsResult.stateLegStandouts.liberty[0].stateId === 'NH', `Standout belongs to breakthrough state NH (actual: ${standoutsResult.stateLegStandouts.liberty[0].stateId})`);

// Test High-Leverage Mid-Game Treasury Sinks
console.log('\n--- High-Leverage Mid-Game Treasury Sinks ($15M-$30M+) ---');
let sinkGame = Engine.createGame({ playerParty: 'liberty' });
sinkGame.treasury = 50.0;
sinkGame.organizingActionsRemaining = 15;
sinkGame.actionsLeft = 4;

// Sink 1: Regional Broadcast Media Buy ($15M)
sinkGame = Engine.takeAction(sinkGame, 'regional-broadcast-buy', { region: 'New England' });
assert(sinkGame.treasury === 35.0, `Regional Broadcast Buy deducted $15M (treasury: ${sinkGame.treasury})`);
assert(sinkGame.stateRegistrationBoosts?.NH >= 2.5, `Regional Broadcast Buy gave +2.5% registration boost in NH (actual: ${sinkGame.stateRegistrationBoosts?.NH})`);

// Sink 2: RCV Ballot Initiative ($20M)
sinkGame = Engine.takeAction(sinkGame, 'rcv-ballot-initiative', { stateId: 'NH' });
assert(sinkGame.treasury === 15.0, `RCV Ballot Initiative deducted $20M (treasury: ${sinkGame.treasury})`);
assert(sinkGame.stateElectoralSystems?.NH?.allRaces === 'rcv', 'RCV permanently enacted in NH');

// Verify RCV collapses wasted-vote defection in NH
const defectionCheck = Engine.computeStrategicVotingDefection(sinkGame, 'liberty', 'NH', 'presidential', 11.5);
assert(defectionCheck.defectionRate === 0 && defectionCheck.defectedShare === 0, 'Wasted-vote strategic defection collapsed to 0% in RCV state');

// Sink 3: Fusion Cross-Endorsement ($15M)
sinkGame = Engine.takeAction(sinkGame, 'fusion-cross-endorsement', { raceId: 'senate:ME', partnerPartyId: 'people' });
assert(sinkGame.treasury === 0.0, `Fusion Cross-Endorsement deducted $15M (treasury: ${sinkGame.treasury})`);
assert(Boolean(sinkGame.fusionEndorsements?.['senate:ME']), 'Fusion agreement registered in fusionEndorsements for senate:ME');
assert(sinkGame.fusionEndorsements['senate:ME'].fusionLift === 3.5, 'Fusion agreement provides +3.5% fusion ballot line lift');


// ====================================================================
// CHUNK 2.2: Soften Ancaps Defection Cliff & Libertarian Wing Expansion
// ====================================================================
console.log('\n--- 2. Chunk 2.2: Soften Ancaps Defection Cliff & Libertarian Expansion ---');

const ancaps = FactionsCatalog.find((f) => f.id === 'lib_ancaps');
assert(Boolean(ancaps), 'lib_ancaps exists in FACTIONS_CATALOG');
assert(ancaps.startingHappiness === 48, `Ancaps startingHappiness raised from 30 to 48 (actual: ${ancaps.startingHappiness})`);

const classicalLibs = FactionsCatalog.find((f) => f.id === 'lib_classical_liberals');
assert(Boolean(classicalLibs), 'lib_classical_liberals added to FACTIONS_CATALOG');
assert(classicalLibs.partyId === 'liberty', 'Classical Liberals belongs to liberty party');
assert(classicalLibs.targetVoters === 350000, `Classical Liberals target voters === 350,000 (actual: ${classicalLibs.targetVoters})`);
assert(classicalLibs.startingHappiness === 65, `Classical Liberals starting happiness === 65 (actual: ${classicalLibs.startingHappiness})`);
assert(classicalLibs.keyIssues.includes('Free Trade') && classicalLibs.keyIssues.includes('Civil Liberties'), 'Classical Liberals has Free Trade and Civil Liberties as key issues');

// Test Turn-1/Turn-2 Ancaps defection cliff softened (does not bolt on turn 1)
const initLibGame = Engine.createGame({ playerParty: 'liberty' });
const initAncapsH = initLibGame.factionHappiness?.lib_ancaps ?? initLibGame.factionStandings?.lib_ancaps;
assert(initAncapsH >= 45, `Libertarians start with Ancaps happiness >= 45 (actual: ${initAncapsH})`);

// Test Faction Courtship / Re-recruitment organizing action
console.log('\n--- Faction Courtship / Re-recruitment Action ---');
let courtGame = Engine.createGame({ playerParty: 'liberty' });
courtGame.treasury = 20.0;
courtGame.organizingActionsRemaining = 10;
courtGame.actionsLeft = 4;
// Mark Ancaps as bolted / unaffiliated
const ancapFaction = courtGame.factions.find((f) => f.id === 'lib_ancaps');
ancapFaction.partyId = 'unaffiliated';
ancapFaction.formerPartyId = 'liberty';
ancapFaction.happiness = 48;
courtGame.factionHappiness.lib_ancaps = 48;

courtGame = Engine.takeAction(courtGame, 'court-bolted-faction', { factionId: 'lib_ancaps' });
assert(courtGame.treasury === 16.0, `Faction Courtship deducted $4.0M (treasury: ${courtGame.treasury})`);
const reCourtH = courtGame.factionHappiness.lib_ancaps;
assert(reCourtH === 63, `Faction happiness raised by +15 from 48 to 63 (actual: ${reCourtH})`);
const reCourtedFaction = courtGame.factions.find((f) => f.id === 'lib_ancaps');
assert(reCourtedFaction.partyId === 'liberty', 'Re-recruited faction successfully rejoined liberty party');


// ====================================================================
// CHUNK 2.3: Prevent Realignment Ping-Pong & Accord Churn
// ====================================================================
console.log('\n--- 3. Chunk 2.3: Prevent Realignment Charter Ping-Pong & Accord Churn ---');

let realignGame = Engine.createGame({ playerParty: 'people' });
realignGame.year = 2030;
realignGame.lastRealignmentYear = 2028; // only 2 years ago (cooldown requires 8 years)

const cooldownCheck = FactionEraStability.canRealignPartyAnchor(realignGame, 'people');
assert(cooldownCheck.eligible === false, 'Realignment blocked by mandatory 8-year cooldown');
assert(cooldownCheck.reason.includes('8-year') || cooldownCheck.reason.includes('Cooldown Active'), `Rejection message cites 8-year cooldown: "${cooldownCheck.reason}"`);

// Test blocking targeting a previously discarded anchor
realignGame.lastRealignmentYear = 2020; // 10 years ago, cooldown passed
realignGame.previousAnchorFactions = ['dem_progressive_left'];
const statusMock = FactionEraStability.getPartyAnchorStatus(realignGame, 'people');
if (statusMock?.candidateNewAnchor) {
  realignGame.previousAnchorFactions.push(statusMock.candidateNewAnchor.id);
  const prevAnchorCheck = FactionEraStability.canRealignPartyAnchor(realignGame, 'people');
  assert(prevAnchorCheck.eligible === false, 'Cannot realign back to a previously discarded anchor faction');
}

// Test Coalition Accord Cap (2 per organizing phase)
let accordGame = Engine.createGame({ playerParty: 'people' });
accordGame.organizingActionsRemaining = 10;
accordGame.actionsLeft = 4;
accordGame.accordsThisCycle = 2; // already signed 2 accords this phase

// Mock an independent faction ready for accord
const indF = accordGame.factions.find((f) => f.id === 'dem_capital_l_left') || accordGame.factions[2];
indF.partyId = 'unaffiliated';
accordGame.factionHappiness[indF.id] = 40;

const thirdAccordAttempt = Engine.takeAction(accordGame, 'sign-coalition-accord', { factionId: indF.id, forceAccord: true });
assert(thirdAccordAttempt.accordsThisCycle === 2, 'Accords count capped at 2; third accord blocked');
assert(thirdAccordAttempt.lastNote.includes('Maximum 2 Coalition Accords'), `Third accord rejected with message: "${thirdAccordAttempt.lastNote}"`);

// Test post-bolt reunification cooldown extended to 6 years
indF.formerPartyId = 'people';
indF.boltedYear = 2028;
indF.reunificationCooldownYear = 2034;
accordGame.year = 2030; // 2 years later (less than 6)
const eligibility = Engine.checkSummitEligibility(accordGame, indF.id);
assert(eligibility.eligible === false, 'Reunification summit blocked within 6-year cooldown');
assert(eligibility.reason.includes('6-year') || eligibility.reason.includes('cooldown'), `Cooldown rejection message: "${eligibility.reason}"`);


// ====================================================================
// CHUNK 2.4: Cap Decennial Redistricting Independents Trust Swing
// ====================================================================
console.log('\n--- 4. Chunk 2.4: Cap Decennial Redistricting Independents Trust Swing ---');

let redistGame = Engine.createGame({ playerParty: 'people' });
redistGame.year = 2030;
redistGame.treasury = 50;
redistGame.actionsLeft = 10;
redistGame.trust = { supporters: 80, independents: 50, opponents: 20 };

// Create War Room state with 12 player-controlled states choosing fair_compact (unclamped would be +12)
const modelDistricts = [];
for (let i = 1; i <= 40; i++) {
  modelDistricts.push({ id: `CA-${i}`, stateId: 'CA', district: i, lean: 15, baselineLean: 15 });
}
redistGame['2030 map'] = { modelDistricts };
redistGame.currentHouseMap = { modelDistricts };

const controlledStates = [];
for (let s = 1; s <= 12; s++) {
  controlledStates.push({ stateId: `S${s}`, controlType: 'player_trifecta', selectedStrategy: 'fair_compact' });
}
redistGame.redistrictingWarRoom = {
  active: true,
  controlledStates,
  selections: Object.fromEntries(controlledStates.map((st) => [st.stateId, 'fair_compact'])),
};

const committed = RedistrictingBallotSystem.commitDecadeMap(redistGame);
const trustDelta = committed.trust.independents - 50;
assert(trustDelta <= 8 && trustDelta >= -8, `Independents Trust swing is clamped within [-8, +8] (actual delta: ${trustDelta}, trust: ${committed.trust.independents})`);
assert(trustDelta === 6, `Fair & compact strategies capped at +6 max (actual: ${trustDelta})`);


// ====================================================================
// CHUNK 2.5: Rebalance Coattails & Hall of Fame Fallback
// ====================================================================
console.log('\n--- 5. Chunk 2.5: Presidential Coattails & Hall of Fame Fallback ---');

// Test presidential coattails strengthening when popular vote margin >= 4.0%
const presCoattailGame = Engine.createGame({ playerParty: 'people' });
presCoattailGame.year = 2028;
presCoattailGame.nationalEnvironment = 12.0; // D+12 landslide (margin >= 4.0%)
const presHouseResult = Engine.calculateDistrictElection(presCoattailGame, 2028);
assert(presHouseResult && presHouseResult.seats.people >= 235, `Landslide presidential margin transmits strong coattails to House (Dem seats: ${presHouseResult.seats.people})`);

// Test Hall of Fame atmospheric fallback when 0 seats won
const zeroSeatGame = Engine.createGame({ playerParty: 'liberty' });
zeroSeatGame.sittingMembers = []; // 0 seats won
zeroSeatGame.year = 2032; // 4 years played

const legacySummary = AtlasMultiplayerSystem.generateLegacySummary(zeroSeatGame, 'liberty');
const longestOfficial = legacySummary.highlights?.longestServingOfficial;
assert(Boolean(longestOfficial), 'Hall of Fame fallback provides an official entry when 0 seats won');
assert(longestOfficial.office.includes('Chair') || longestOfficial.office.includes('Officer') || longestOfficial.office.includes('Nominee'), `Fallback official has appropriate party leadership title: "${longestOfficial.office}"`);
assert(longestOfficial.yearsServed >= 2, `Fallback official served multi-year term (actual: ${longestOfficial.yearsServed} yrs)`);

console.log('\n====================================================================');
console.log(` ALL CHUNKS 2.1 - 2.5 TESTS COMPLETED: ${passed} Passed, ${failed} Failed`);
console.log('====================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
