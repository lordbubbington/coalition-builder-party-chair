/**
 * Coalition Builder: Party Chair — Version 0.16.1 Phase 2 Verification Suite
 *
 * Verifies Cluster B: Ballot Access, Uncertainty & Election Night Administration (REQ-204 through REQ-211)
 *
 * Test Suites:
 *  1. REQ-204: Correlated Regional & State Polling Error (Box-Muller Gaussian sigma=2.8%, regional error correlation)
 *  2. REQ-205: Shy-Voter Bias & Late-Breaking Undecided Swing (Rough/Undisciplined candidate drag, 65/35 late break)
 *  3. REQ-206: 50-State Statutory Signature & Retention Table (Tier 1 Fringe 0-ballot baseline, Courting Lock & Tracker Sync)
 *  4. REQ-207: Petition Drive Action & State Qualification Loop ($1.5M-$6M cost, Chapter -35% discount, buffer slider)
 *  5. REQ-208: Major-Party Petition Challenges & Signature Audits (AI challenges minor parties >=2.5% in swing states)
 *  6. REQ-209: Ballot-Access Legal Defense Crisis Modal (Law firm $2.5M, Signature cure blitz, or Concede state)
 *  7. REQ-210: Automatic Close-Margin Statutory Recounts (Margin <=0.50% triggers recount; stochastic +/-0.12% adjustment; hooks REQ-191)
 *  8. REQ-211: State Trifecta Voting-Law Policy Bills (Strict Photo ID, Universal Vote-by-Mail, Early Voting window)
 *  9. Save Normalization & Atmospheric Vibes Audit (Zero REQ-XX leaks, 155M scale)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

function createHeadlessSandbox() {
  const store = {};
  const mockLocalStorage = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };

  const docListeners = {};
  const mockDocument = {
    addEventListener: (type, fn) => { docListeners[type] = docListeners[type] || []; docListeners[type].push(fn); },
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: { innerHTML: '', appendChild: () => {}, classList: { add: () => {}, remove: () => {} } },
  };

  const mockWindow = {
    localStorage: mockLocalStorage,
    document: mockDocument,
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: () => {},
    location: { reload: () => {} },
  };

  const ctx = {
    window: mockWindow,
    document: mockDocument,
    localStorage: mockLocalStorage,
    console,
    Math,
    Date,
    JSON,
    Number,
    String,
    Array,
    Object,
    Set,
    Map,
    Uint8Array,
    atob: (str) => Buffer.from(str, 'base64').toString('binary'),
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    Blob: globalThis.Blob,
    DecompressionStream: globalThis.DecompressionStream,
    Response: globalThis.Response,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Buffer,
    setTimeout,
    clearTimeout,
  };
  ctx.global = ctx;
  ctx.globalThis = ctx;
  ctx.self = ctx;
  vm.createContext(ctx);

  const scripts = [
    'data.js',
    'factions-0.15.js',
    'scenario-2028.js',
    'issues-0.2.1.js',
    'maps-0.3.js',
    'state-house-data-0.5.js',
    'voter-model-0.5.js',
    'demographics-0.9.js',
    'political-trends-system.js',
    'v07-scaffolding.js',
    'party-systems-data.js',
    'party-systems-coalition.js',
    'party-systems-robots.js',
    'party-systems-engine.js',
    'party-systems-ui.js',
    'presidential-primaries.js',
    'ballot-access.js',
    'election-uncertainty.js',
    'engine.js',
  ];

  scripts.forEach((relPath) => {
    const fullPath = path.join(ROOT, relPath);
    const code = fs.readFileSync(fullPath, 'utf8');
    vm.runInContext(code, ctx, { filename: relPath });
  });

  return ctx;
}

let totalPasses = 0;
function test(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    totalPasses += 1;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('====================================================================');
console.log(' COALITION BUILDER: PARTY CHAIR — V0.16.1 PHASE 2 VERIFICATION SUITE');
console.log('====================================================================\n');

// --------------------------------------------------------------------
// SUITE 1: REQ-204: Correlated Regional & State Polling Error
// --------------------------------------------------------------------
console.log('--- SUITE 1: REQ-204: Correlated Regional & State Polling Error ---');

test('generateCorrelatedPollingError draws regional error vector for all 4 Census Regions', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);
  const result = ctx.window.ElectionUncertainty.generateCorrelatedPollingError(game, { seed: 1042 });

  assert.ok(result.correlatedRegionalError, 'Should return correlatedRegionalError');
  const regions = ['Northeast', 'Midwest', 'South', 'West'];
  regions.forEach((r) => {
    assert.strictEqual(typeof result.correlatedRegionalError[r], 'number', `Region ${r} should have numeric error`);
    assert.ok(isFinite(result.correlatedRegionalError[r]), `Region ${r} error must be finite`);
  });
});

test('generateCorrelatedPollingError covers all 50 states + DC and shares regional correlation', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);
  const result = ctx.window.ElectionUncertainty.generateCorrelatedPollingError(game, { seed: 8888 });

  const states = ctx.window.PartyChairData.STATES;
  assert.strictEqual(states.length, 50, 'States catalog should have 50 states');
  states.forEach((st) => {
    assert.strictEqual(typeof result.statePollingErrors[st.id], 'number', `State ${st.id} must receive polling error`);
  });
  assert.strictEqual(typeof result.statePollingErrors.DC, 'number', 'DC must receive polling error');

  // Verify regional clustering: average error of Midwest states should be centered around Midwest regional error
  const midwestStates = states.filter((s) => s.region === 'Midwest').map((s) => s.id);
  const midwestErrors = midwestStates.map((id) => result.statePollingErrors[id]);
  const avgMidwest = midwestErrors.reduce((a, b) => a + b, 0) / midwestErrors.length;
  const regMidwest = result.correlatedRegionalError.Midwest;
  assert.ok(Math.abs(avgMidwest - regMidwest) < 1.0, 'State errors should cluster around regional error delta');
});

// --------------------------------------------------------------------
// SUITE 2: REQ-205: Shy-Voter Bias & Late-Breaking Undecided Swing
// --------------------------------------------------------------------
console.log('\n--- SUITE 2: REQ-205: Shy-Voter Bias & Late-Breaking Swing ---');

test('evaluateShyVoterBias flags non-response bias for Rough / Undisciplined candidates', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  const cleanCand = { name: 'Moderate Leader', traits: ['Polished', 'Disciplined'] };
  const shyCand = { name: 'Outsider Firebrand', traits: ['Rough', 'Undisciplined'] };

  const resClean = ctx.window.ElectionUncertainty.evaluateShyVoterBias(game, cleanCand, 'people');
  assert.strictEqual(resClean.active, false, 'Clean candidate should not have shy-voter bias');
  assert.strictEqual(resClean.pollSuppressionPct, 0.0);

  const resShy = ctx.window.ElectionUncertainty.evaluateShyVoterBias(game, shyCand, 'people');
  assert.strictEqual(resShy.active, true, 'Rough/Undisciplined candidate must have shy-voter bias');
  assert.strictEqual(resShy.pollSuppressionPct, 2.0, 'Poll suppression should be 2.0%');
  assert.strictEqual(resShy.hiddenTurnoutLiftPct, 2.0, 'Hidden vote lift should be 2.0%');
});

test('evaluateShyVoterBias flags non-response bias for non-mainstream platform stances (>8.5 or <1.5)', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  game.platform = { economic: 9.2, social: 9.0, climate: 8.8 };
  const resRadical = ctx.window.ElectionUncertainty.evaluateShyVoterBias(game, null, 'player');
  assert.strictEqual(resRadical.active, true, 'Extreme platform stances must trigger shy-voter bias');
});

test('resolveLateBreakingUndecidedSwing breaks 65% toward favored party and delivers atmospheric note', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);
  game.campaign = { waveMomentum: 2.5 }; // Favors people

  const result = ctx.window.ElectionUncertainty.resolveLateBreakingUndecidedSwing(game, { undecidedPoolPct: 4.0 });
  assert.strictEqual(result.favoredParty, 'people', 'Positive wave momentum must favor player party');
  assert.strictEqual(result.breakShareFavored, 0.65, 'Favored party must capture 65% of undecideds');
  assert.strictEqual(result.breakShareRival, 0.35, 'Rival party receives 35%');
  assert.strictEqual(result.favoredGain, 2.6, '4.0% * 0.65 = 2.6%');
  assert.strictEqual(result.rivalGain, 1.4, '4.0% * 0.35 = 1.4%');
  assert.strictEqual(result.netMarginShift, 1.2, 'Net margin shift must be +1.2%');
  assert.ok(result.note.includes('Late-deciding suburban voters appear to be breaking decisively'), 'Must include authentic atmospheric note');
});

// --------------------------------------------------------------------
// SUITE 3: REQ-206: 50-State Statutory Signature & Retention Table
// --------------------------------------------------------------------
console.log('\n--- SUITE 3: REQ-206: 50-State Statutory Signature & Retention Table ---');

test('STATUTORY_BALLOT_RULES covers all 50 states + DC with authentic benchmarks', () => {
  const ctx = createHeadlessSandbox();
  const rules = ctx.window.PartyChairData.STATUTORY_BALLOT_RULES;

  assert.ok(rules, 'STATUTORY_BALLOT_RULES must exist');
  assert.strictEqual(Object.keys(rules).length, 51, 'Must include 50 states + DC (51 total)');

  // Verify specified benchmarks from VERSION_0.16.1_DESIGN.md
  assert.strictEqual(rules.CA.signaturesRequired, 178000);
  assert.strictEqual(rules.CA.retentionThresholdPct, 2.0);
  assert.strictEqual(rules.TX.signaturesRequired, 83000);
  assert.strictEqual(rules.TX.retentionThresholdPct, 5.0);
  assert.strictEqual(rules.FL.signaturesRequired, 145000);
  assert.strictEqual(rules.FL.retentionThresholdPct, 1.0);
  assert.strictEqual(rules.PA.signaturesRequired, 5000);
  assert.strictEqual(rules.PA.retentionThresholdPct, 2.0);
  assert.strictEqual(rules.NY.signaturesRequired, 45000);
  assert.strictEqual(rules.NY.retentionThresholdPct, 2.0);
  assert.strictEqual(rules.OK.signaturesRequired, 35000);
  assert.strictEqual(rules.OK.retentionThresholdPct, 2.5);
  assert.strictEqual(rules.TN.signaturesRequired, 275);
  assert.strictEqual(rules.TN.retentionThresholdPct, 5.0);
  assert.strictEqual(rules.CO.signaturesRequired, 1000);
  assert.strictEqual(rules.CO.retentionThresholdPct, 1.0);
});

test('Tier 1 Fringe starts with zero ballot access and zero automatic retention across all states', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('constitution', false, {}, 2028);

  const tier = ctx.window.PartyChairEngine.getPartyInstitutionalTier(game, 'constitution');
  assert.strictEqual(tier, 1, 'Constitution party should start at Tier 1 (Fringe)');

  const statutory = ctx.window.BallotAccess.buildStartingStatutoryBallotTable(game);
  const constStates = Object.keys(statutory.constitution || {});
  assert.strictEqual(constStates.length, 51, 'Should evaluate all 51 jurisdictions');

  constStates.forEach((st) => {
    assert.strictEqual(statutory.constitution[st].qualified, false, `State ${st} must be unqualified for Tier 1 Fringe`);
    assert.strictEqual(statutory.constitution[st].method, 'none', `State ${st} cannot have automatic retention`);
  });

  const fringeAccess = game.ballotAccess.constitution;
  assert.strictEqual(Object.keys(fringeAccess.senate || {}).length, 0, 'Tier 1 Fringe must have 0 senate ballot states');
  assert.strictEqual(Object.keys(fringeAccess.governor || {}).length, 0, 'Tier 1 Fringe must have 0 governor ballot states');
});

test('Tier 1 Fringe is strictly barred from courting sitting politicians (REQ-170)', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('socialist', false, {}, 2028);
  game.treasury = 20.0;
  game.actionsLeft = 5;

  const target = (game.sittingMembers || []).find((m) => m.office === 'house');
  assert.ok(target, 'Should have sitting house member');

  const updated = ctx.window.PartyChairEngine.takeAction(game, 'court-politician', { memberId: target.id });
  assert.strictEqual(updated.treasury, 20.0, 'Treasury should not be spent');
  assert.strictEqual(updated.actionsLeft, 5, 'Actions should not be deducted');
  assert.ok(updated.lastNote.includes('Fringe movements lack the statutory ballot standing'), 'Must return qualitative restriction note');
});

test('Courting defection immediately synchronizes House, Senate, and Gubernatorial seat trackers', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);
  game.treasury = 30.0;
  game.actionsLeft = 10;
  game.sittingMembers = game.sittingMembers || [];

  // 1. House member defection (Pick target with ideological bridge, e.g. AR-1 Rick Crawford)
  const gopRep = game.sittingMembers.find((m) => m.id === 'house:AR-1') ||
    game.sittingMembers.find((m) => m.office === 'house' && m.party === 'heritage');
  if (gopRep) {
    gopRep.happiness = 20; // Discontent
    gopRep.factionId = 'gop_traditional_farmers'; // Bridge within 2.0 pts of dem_blue_dog
    const initialSeats = game.seats || 0;
    const resHouse = ctx.window.PartyChairEngine.takeAction(game, 'court-politician', { memberId: gopRep.id });
    assert.strictEqual(resHouse.seats, initialSeats + 1, 'House seat count must immediately increment by +1');
  }

  // 2. Governor defection (VT Phil Scott)
  const gopGov = game.sittingMembers.find((m) => m.id === 'governor:VT') ||
    game.sittingMembers.find((m) => m.office === 'governor' && m.party === 'heritage');
  if (gopGov) {
    gopGov.happiness = 20;
    gopGov.factionId = 'gop_suburban_moderates'; // Bridge within 2.0 pts of dem_blue_dog
    const govState = gopGov.stateId || gopGov.state;
    const resGov = ctx.window.PartyChairEngine.takeAction(game, 'court-politician', { memberId: gopGov.id });
    assert.strictEqual(resGov.governorships[govState], 'people', 'Governorship must immediately transfer to player party');
  }

  // 3. Senate member defection (KY Andy Barr)
  const gopSen = game.sittingMembers.find((m) => m.id === 'senate:KY:class-2') ||
    game.sittingMembers.find((m) => m.office === 'senate' && m.party === 'heritage');
  if (gopSen) {
    gopSen.happiness = 20;
    gopSen.factionId = 'gop_suburban_moderates'; // Bridge within 2.0 pts of dem_blue_dog
    const initSenate = (game.sittingMembers || []).filter((m) => m.office === 'senate' && (m.party === 'people' || m.caucus === 'people')).length;
    const resSen = ctx.window.PartyChairEngine.takeAction(game, 'court-politician', { memberId: gopSen.id });
    assert.strictEqual(resSen.senateSeats, initSenate + 1, 'Senate seat count must immediately increment by +1');
  }
});

// --------------------------------------------------------------------
// SUITE 4: REQ-207: Petition Drive Action & State Qualification Loop
// --------------------------------------------------------------------
console.log('\n--- SUITE 4: REQ-207: Petition Drive Action & Qualification Loop ---');

test('calculatePetitionCost enforces baseline clamping ($1.5M-$6.0M), buffer scaling, and chapter discount', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('liberty', false, {}, 2028);
  game.stateChapters = {};

  // California: 178,000 signatures * $3.50 = $623,000 (0.623M) -> clamped to $1.5M minimum base
  // With 1.5x buffer -> $1.5M * 1.5 = $2.25M
  const caCost = ctx.window.BallotAccess.calculatePetitionCost(game, 'CA', 'prudent', 'liberty');
  assert.strictEqual(caCost.signaturesTarget, Math.round(178000 * 1.5));
  assert.strictEqual(caCost.bufferMultiplier, 1.5);
  assert.strictEqual(caCost.bufferPct, 150);
  assert.strictEqual(caCost.cost, 2.25, 'Base $1.5M * 1.5x buffer = $2.25M');

  // Test active chapter discount (-35%):
  game.stateChapters = { CA: 1 };
  const caCostWithChapter = ctx.window.BallotAccess.calculatePetitionCost(game, 'CA', 'prudent', 'liberty');
  assert.strictEqual(caCostWithChapter.hasChapter, true);
  assert.strictEqual(caCostWithChapter.cost, Math.round(2.25 * 0.65 * 100) / 100, '-35% chapter discount applied');
});

test('launchPetitionDrive deducts action/treasury, certifies ballot access, and updates statutory tables', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('liberty', false, {}, 2028);
  game.stateChapters = {};
  game.treasury = 20.0;
  game.actionsLeft = 5;

  assert.strictEqual(Boolean(game.ballotAccess?.liberty?.CA), false, 'Liberty starts unqualified in CA');

  const updated = ctx.window.PartyChairEngine.takeAction(game, 'launch-petition-drive', {
    stateId: 'CA',
    bufferTier: 'ironclad',
    partyId: 'liberty',
  });

  assert.strictEqual(updated.actionsLeft, 4, 'Should deduct 1 leadership action');
  assert.ok(updated.treasury < 20.0, 'Treasury should be deducted');
  assert.strictEqual(updated.ballotAccess.liberty.CA, true, 'CA must now be qualified in ballotAccess');
  assert.strictEqual(updated.ballotAccess.liberty.senate.CA, true, 'Senate CA qualified');
  assert.strictEqual(updated.ballotAccess.liberty.governor.CA, true, 'Governor CA qualified');
  assert.strictEqual(updated.activePetitionDrives.CA.qualified, true, 'activePetitionDrives must record qualification');
  assert.strictEqual(updated.activePetitionDrives.CA.bufferPct, 200, 'Ironclad buffer is 200%');
  assert.strictEqual(updated.ballotAccessStatutory.liberty.CA.qualified, true, 'Statutory table must mark qualified');
  assert.ok(updated.lastNote.includes('Petition Certified'), 'Must log celebratory certification note');
});

// --------------------------------------------------------------------
// SUITE 5: REQ-208: Major-Party Petition Challenges & Signature Audits
// --------------------------------------------------------------------
console.log('\n--- SUITE 5: REQ-208: Major-Party Petition Challenges & Signature Audits ---');

test('evaluateBallotChallenges triggers audit when minor party >= 2.5% in swing state (<3.0% margin)', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  game.activePetitionDrives = {
    PA: { partyId: 'liberty', stateId: 'PA', qualified: true, bufferPct: 110, signaturesCollected: 5500 },
  };

  // Buffer < 120% has 80% disqualification rate. Using fixedRoll 0.50 (< 0.80) to test disqualification trigger:
  const res = ctx.window.BallotAccess.evaluateBallotChallenges(game, { fixedRoll: 0.50 });
  assert.strictEqual(res.challenges.length, 1, 'Should trigger 1 signature challenge in PA');
  assert.strictEqual(res.challenges[0].stateId, 'PA');
  assert.strictEqual(res.challenges[0].disqualified, true);
  assert.ok(res.game.pendingBallotCrisis, 'Must set pendingBallotCrisis upon disqualification');
  assert.strictEqual(res.game.pendingBallotCrisis.stateId, 'PA');
});

test('evaluateBallotChallenges throws out challenge when buffer >= 180% (92% survival rate)', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  game.activePetitionDrives = {
    PA: { partyId: 'liberty', stateId: 'PA', qualified: true, bufferPct: 200, signaturesCollected: 10000 },
  };

  // Buffer >= 180% has only 8% failure rate. With roll = 0.50, survival is guaranteed:
  const res = ctx.window.BallotAccess.evaluateBallotChallenges(game, { fixedRoll: 0.50 });
  assert.strictEqual(res.challenges[0].disqualified, false, 'Challenge should be thrown out with prejudice');
  assert.strictEqual(res.game.pendingBallotCrisis, null, 'No crisis triggered');
});

// --------------------------------------------------------------------
// SUITE 6: REQ-209: Ballot-Access Legal Defense Crisis Modal
// --------------------------------------------------------------------
console.log('\n--- SUITE 6: REQ-209: Ballot-Access Legal Defense Crisis Modal ---');

test('resolveBallotCrisis Option A (Elite Law Firm) spends $2.5M and overturns with 70% success', () => {
  const ctx = createHeadlessSandbox();
  let game = ctx.window.PartyChairEngine.createGame('liberty', false, {}, 2028);
  game.treasury = 10.0;
  game.pendingBallotCrisis = { stateId: 'PA', partyId: 'liberty', bufferPct: 110, challengerParty: 'heritage' };

  // Roll < 0.70 succeeds
  const resSuccess = ctx.window.BallotAccess.resolveBallotCrisis(game, { option: 'law_firm', fixedRoll: 0.40 });
  assert.strictEqual(resSuccess.treasury, 7.5, 'Deducts $2.5M treasury');
  assert.strictEqual(resSuccess.pendingBallotCrisis, null, 'Clears crisis');
  assert.ok(resSuccess.lastNote.includes('Legal Victory'), 'Notes court victory');

  // Roll >= 0.70 fails
  game.treasury = 10.0;
  game.pendingBallotCrisis = { stateId: 'PA', partyId: 'liberty', bufferPct: 110, challengerParty: 'heritage' };
  const resFail = ctx.window.BallotAccess.resolveBallotCrisis(game, { option: 'law_firm', fixedRoll: 0.85 });
  assert.strictEqual(resFail.treasury, 7.5);
  assert.strictEqual(Boolean(resFail.ballotAccess?.liberty?.PA), false, 'Ballot line revoked upon defeat');
  assert.ok(resFail.lastNote.includes('Court Defeat'), 'Notes court defeat');
});

test('resolveBallotCrisis Option B (Signature Cure Blitz) spends 1 action + $1.5M with 60% success', () => {
  const ctx = createHeadlessSandbox();
  let game = ctx.window.PartyChairEngine.createGame('liberty', false, {}, 2028);
  game.treasury = 10.0;
  game.actionsLeft = 5;
  game.pendingBallotCrisis = { stateId: 'WI', partyId: 'liberty', bufferPct: 110, challengerParty: 'people' };

  const resSuccess = ctx.window.BallotAccess.resolveBallotCrisis(game, { option: 'cure_blitz', fixedRoll: 0.30 });
  assert.strictEqual(resSuccess.treasury, 8.5, 'Deducts $1.5M');
  assert.strictEqual(resSuccess.actionsLeft, 4, 'Deducts 1 action');
  assert.ok(resSuccess.lastNote.includes('Cure Blitz Succeeded'));
});

test('resolveBallotCrisis Option C (Concede State Line) forfeits ballot line and applies morale shock', () => {
  const ctx = createHeadlessSandbox();
  let game = ctx.window.PartyChairEngine.createGame('liberty', false, {}, 2028);
  game.treasury = 10.0;
  game.stateChapters = { MI: 1 };
  game.chapterMorale = { MI: 70 };
  game.pendingBallotCrisis = { stateId: 'MI', partyId: 'liberty', bufferPct: 100, challengerParty: 'heritage' };

  const resConcede = ctx.window.BallotAccess.resolveBallotCrisis(game, { option: 'concede' });
  assert.strictEqual(resConcede.treasury, 10.0, 'Concede costs $0');
  assert.strictEqual(Boolean(resConcede.ballotAccess?.liberty?.MI), false, 'Ballot access revoked in MI');
  assert.strictEqual(resConcede.chapterMorale.MI, 55, 'Applies -15 chapter morale shock (70 -> 55)');
  assert.ok(resConcede.lastNote.includes('Conceded State Line'));
});

// --------------------------------------------------------------------
// SUITE 7: REQ-210: Automatic Close-Margin Statutory Recounts
// --------------------------------------------------------------------
console.log('\n--- SUITE 7: REQ-210: Automatic Close-Margin Statutory Recounts ---');

test('evaluateCloseMarginRecounts identifies states with margin <= 0.50% and applies recount adjustment', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  const electionReturns = {
    presidential: {
      GA: { stateId: 'GA', ev: 16, margin: 0.15, winner: 'people' }, // <= 0.50% -> triggers recount
      TX: { stateId: 'TX', ev: 40, margin: 4.50, winner: 'heritage' }, // Not close
    },
    evByParty: { people: 275, heritage: 263 },
  };

  const outcome = ctx.window.ElectionUncertainty.evaluateCloseMarginRecounts(game, electionReturns, { fixedDelta: 0.05 });
  assert.strictEqual(outcome.recounts.length, 1, 'GA must trigger statutory recount');
  assert.strictEqual(outcome.recounts[0].stateId, 'GA');
  assert.strictEqual(outcome.recounts[0].initialMargin, 0.15);
  assert.strictEqual(outcome.recounts[0].recountAdjustment, 0.05);
  assert.strictEqual(outcome.recounts[0].finalMargin, 0.20);
  assert.strictEqual(outcome.recounts[0].flipped, false);
});

test('evaluateCloseMarginRecounts flips state when adjustment inverts margin and triggers REQ-191 Contingent Election', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  // Dem had 275 EVs, winning GA (16 EV) by razor-thin +0.08%
  const electionReturns = {
    presidential: {
      GA: { stateId: 'GA', ev: 16, margin: 0.08, winner: 'people' },
    },
    evByParty: { people: 275, heritage: 263 },
  };

  // Recount adjustment of -0.11% inverts margin to -0.03% (GOP flip)
  const outcome = ctx.window.ElectionUncertainty.evaluateCloseMarginRecounts(game, electionReturns, { fixedDelta: -0.11 });
  assert.strictEqual(outcome.flippedStates.length, 1, 'GA should flip');
  assert.strictEqual(outcome.flippedStates[0].newWinner, 'heritage');
  assert.strictEqual(outcome.evByParty.people, 259, 'People lost 16 EVs (275 -> 259)');
  assert.strictEqual(outcome.evByParty.heritage, 279, 'Heritage gained 16 EVs (263 -> 279)');
  assert.strictEqual(outcome.contingentElectionTriggered, false, 'Heritage reached 279 >= 270');

  // Now test flipping into an electoral deadlock (< 270):
  const deadlockedReturns = {
    presidential: {
      GA: { stateId: 'GA', ev: 16, margin: 0.08, winner: 'people' },
    },
    evByParty: { people: 271, heritage: 257, liberty: 10 },
  };
  const deadlockedOutcome = ctx.window.ElectionUncertainty.evaluateCloseMarginRecounts(game, deadlockedReturns, { fixedDelta: -0.11 });
  assert.strictEqual(deadlockedOutcome.evByParty.people, 255);
  assert.strictEqual(deadlockedOutcome.evByParty.heritage, 273);
  // Max is 273 (no deadlock). What if 3-way split: 268 vs 260 vs 10?
  const threeWayReturns = {
    presidential: {
      GA: { stateId: 'GA', ev: 16, margin: 0.08, winner: 'people' },
    },
    evByParty: { people: 270, heritage: 248, liberty: 20 },
  };
  const threeWayOutcome = ctx.window.ElectionUncertainty.evaluateCloseMarginRecounts(game, threeWayReturns, { fixedDelta: -0.11 });
  assert.strictEqual(threeWayOutcome.evByParty.people, 254);
  assert.strictEqual(threeWayOutcome.evByParty.heritage, 264);
  assert.strictEqual(threeWayOutcome.contingentElectionTriggered, true, 'Max EV is 264 < 270 -> Triggers Contingent Election!');
  assert.ok(threeWayOutcome.game.pendingContingentElection, 'pendingContingentElection state must be created');
});

// --------------------------------------------------------------------
// SUITE 8: REQ-211: State Trifecta Voting-Law Policy Bills
// --------------------------------------------------------------------
console.log('\n--- SUITE 8: REQ-211: State Trifecta Voting-Law Policy Bills ---');

test('hasPartyStateTrifecta correctly evaluates Governor + both legislative chambers', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  game.governorships = { CA: 'people', TX: 'heritage', NE: 'people' };
  game.stateLegislatures = {
    CA: ['people', 'people'],
    TX: ['heritage', 'heritage'],
    FL: ['heritage', 'people'], // Split
  };

  assert.strictEqual(ctx.window.BallotAccess.hasPartyStateTrifecta(game, 'CA', 'people'), true, 'CA is Dem trifecta');
  assert.strictEqual(ctx.window.BallotAccess.hasPartyStateTrifecta(game, 'TX', 'heritage'), true, 'TX is GOP trifecta');
  assert.strictEqual(ctx.window.BallotAccess.hasPartyStateTrifecta(game, 'TX', 'people'), false);
  assert.strictEqual(ctx.window.BallotAccess.hasPartyStateTrifecta(game, 'FL', 'heritage'), false, 'FL is divided government');
  assert.strictEqual(ctx.window.BallotAccess.hasPartyStateTrifecta(game, 'NE', 'people'), true, 'NE is nonpartisan unicameral');
});

test('enactStateVotingLaw signs bill into law and modifies petition costs / signature requirements', () => {
  const ctx = createHeadlessSandbox();
  let game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);
  game.stateChapters = {};
  game.treasury = 10.0;
  game.actionsLeft = 5;
  game.governorships = { CA: 'people' };
  game.stateLegislatures = { CA: ['people', 'people'] };

  // 1. Enact Universal Vote-by-Mail
  game = ctx.window.PartyChairEngine.takeAction(game, 'enact-state-voting-law', {
    stateId: 'CA',
    billId: 'universal-vote-by-mail',
    partyId: 'people',
  });

  assert.strictEqual(game.actionsLeft, 4, 'Deducts 1 action');
  assert.strictEqual(game.treasury, 8.0, 'Deducts $2M enactment cost');
  assert.ok(game.stateVotingLaws.CA.includes('universal-vote-by-mail'), 'CA voting laws must record VBM');
  assert.ok(game.lastNote.includes('Universal Vote-by-Mail & Automatic Registration officially signed into law'));

  // Verify that Universal Vote-by-Mail in CA halves petition costs for other parties
  const vbmCost = ctx.window.BallotAccess.calculatePetitionCost(game, 'CA', 'prudent', 'liberty');
  assert.strictEqual(vbmCost.hasVBM, true);
  assert.strictEqual(vbmCost.cost, Math.round(2.25 * 0.50 * 100) / 100, 'Petition cost must be halved (-50%)');

  // 2. Enact Strict Photo ID in TX (GOP trifecta)
  game.governorships.TX = 'people';
  game.stateLegislatures.TX = ['people', 'people'];
  game = ctx.window.PartyChairEngine.takeAction(game, 'enact-state-voting-law', {
    stateId: 'TX',
    billId: 'strict-photo-id',
    partyId: 'people',
  });

  assert.ok(game.stateVotingLaws.TX.includes('strict-photo-id'));
  const photoIdCost = ctx.window.BallotAccess.calculatePetitionCost(game, 'TX', 'minimum', 'liberty');
  assert.strictEqual(photoIdCost.hasPhotoId, true);
  assert.strictEqual(photoIdCost.signaturesRequired, Math.round(83000 * 1.20), 'Signatures required increased by +20%');
});

// --------------------------------------------------------------------
// SUITE 9: Save Normalization & Invariants Audit
// --------------------------------------------------------------------
console.log('\n--- SUITE 9: Save Normalization & Invariants Audit ---');

test('normalizeGame preserves statutory ballot table, petition drives, and uncertainty across save/reload', () => {
  const ctx = createHeadlessSandbox();
  const game = ctx.window.PartyChairEngine.createGame('people', false, {}, 2028);

  game.activePetitionDrives = {
    NV: { partyId: 'player', stateId: 'NV', qualified: true, bufferPct: 150 },
  };
  game.stateVotingLaws = {
    CO: ['universal-vote-by-mail'],
  };
  game.electionUncertainty = {
    correlatedRegionalError: { West: 1.5 },
    statePollingErrors: { NV: 1.8 },
    shyVoterTiedParties: ['player'],
    pendingRecounts: [],
  };

  const serialized = JSON.stringify(game);
  const reloaded = ctx.window.PartyChairEngine.normalizeGame(JSON.parse(serialized));

  assert.ok(reloaded.ballotAccessStatutory, 'ballotAccessStatutory must persist');
  assert.strictEqual(reloaded.activePetitionDrives.NV.qualified, true, 'activePetitionDrives must persist');
  assert.strictEqual(reloaded.stateVotingLaws.CO[0], 'universal-vote-by-mail', 'stateVotingLaws must persist');
  assert.strictEqual(reloaded.electionUncertainty.correlatedRegionalError.West, 1.5, 'correlatedRegionalError must persist');
});

test('Zero REQ-XX or MAS-XX tags appear in player-facing UI text', () => {
  const rawApp = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const rawBallot = fs.readFileSync(path.join(ROOT, 'ballot-access.js'), 'utf8');
  const rawUncertainty = fs.readFileSync(path.join(ROOT, 'election-uncertainty.js'), 'utf8');

  const uiRegex = /<[^>]+>[^<]*(REQ-\d+|MAS-\d+)[^<]*<\/[^>]+>/i;
  assert(!uiRegex.test(rawApp), 'app.js free of HTML REQ tags');
  assert(!uiRegex.test(rawBallot), 'ballot-access.js free of HTML REQ tags');
  assert(!uiRegex.test(rawUncertainty), 'election-uncertainty.js free of HTML REQ tags');
});

console.log('\n====================================================================');
console.log(` ALL CHECKS PASSED: ${totalPasses}/${totalPasses} (100%)`);
console.log('====================================================================');
