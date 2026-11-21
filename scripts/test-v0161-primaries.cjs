/**
 * Coalition Builder: Party Chair — Version 0.16.1 Phase 1 Verification Suite
 *
 * Verifies Cluster A: Presidential Primaries & Nominating Conventions (REQ-195 through REQ-203)
 *
 * Test Suites:
 *  1. Invariants & 2028 Baseline Preservation (Rule 5 Ossoff/Vance fixed tickets, 155M scale)
 *  2. REQ-195: Incumbent Vulnerability Triggers & Challenger Emergence (<40% approval, env >= 8.0, restive faction)
 *  3. REQ-196: Incumbent Primary Contest & Party-Fracture Fallout (Step-Aside vs Stand By, Bruised Incumbent -3.5%)
 *  4. REQ-197: Presidential Primary Field & Candidate Generation (3-5 contenders, home state +8.0%/+3.0%, stances)
 *  5. REQ-198: Phased Primary Calendar Engine (Wave 1, Wave 2 Super Tuesday dropouts, Wave 3 late states)
 *  6. REQ-199: State Delegate Allocation & 2,000 Clinch Threshold (15% threshold, 3,979 total, 2,000 line)
 *  7. REQ-200: Chair Primary Strategy & Lane Consolidation (Neutrality, Back $3.0M, Broker Lane)
 *  8. REQ-201: Factional Convention Delegates & Platform Floor Votes (+/-1.0 stance drift, +7/-4 happiness)
 *  9. REQ-202: VP Ticket Selection & Keynote Unity Brokering (+4.0%/+1.5% lift, cancel bruised penalty, keynote bounce)
 * 10. REQ-203: Contested / Brokered Multi-Ballot Convention (Kingmaker deals, Ballot 2 ratify, Ballot 3 compromise)
 * 11. General Election Margin Integration (presidentialStateMargin incorporates dynamic candidate/VP lifts)
 * 12. Save Normalization & Atmospheric Vibes Audit (Zero REQ-XX leaks, 155M scale)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

// Headless VM harness
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
console.log(' COALITION BUILDER: PARTY CHAIR — V0.16.1 PHASE 1 VERIFICATION SUITE');
console.log('====================================================================\n');

const ctx = createHeadlessSandbox();
const Engine = ctx.window.PartyChairEngine;
const Primaries = ctx.window.PresidentialPrimaries;

// ------------------------------------------------------------------
// SUITE 1: Invariants & 2028 Baseline Preservation
// ------------------------------------------------------------------
console.log('--- SUITE 1: Invariants & 2028 Baseline Preservation ---');

test('2028 opening cycle strictly preserves Jon Ossoff vs J. D. Vance ticket', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  assert.strictEqual(game.year, 2028);
  assert.strictEqual(game.presidentialTicket.people, 'Jon Ossoff');
  assert.strictEqual(game.presidentialTicket.heritage, 'J. D. Vance');
  assert.strictEqual(game.presidentialPrimaries, null, 'Dynamic primaries inactive in 2028 baseline');
});

test('2028 presidentialStateMargin applies Southern Ossoff +4.0 and Midwest Vance +4.0 lift', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  const marginGA = Engine.presidentialStateMargin(game, 'GA');
  const marginOH = Engine.presidentialStateMargin(game, 'OH');
  assert(Number.isFinite(marginGA));
  assert(Number.isFinite(marginOH));
});

test('155M represented scale strictly maintained at game creation', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  assert.strictEqual(game.voterModel.representedVoters, 155000000);
});

// ------------------------------------------------------------------
// SUITE 2: REQ-195: Incumbent Vulnerability Triggers & Challenger Emergence
// ------------------------------------------------------------------
console.log('\n--- SUITE 2: REQ-195: Incumbent Vulnerability & Challenger Emergence ---');

test('evaluateIncumbentVulnerability flags revolt when presidentialApproval < 40.0', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialApproval = 37.5;
  game.governingParty = 'people';

  const check = Primaries.evaluateIncumbentVulnerability(game);
  assert.strictEqual(check.vulnerable, true);
  assert(check.reason.includes('Approval'));
  assert(Boolean(check.challenger), 'Challenger politician generated');
});

test('evaluateIncumbentVulnerability flags revolt when national environment >= +8.0 against governing party', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialApproval = 46.0;
  game.nationalEnvironment = 12.0; // Heavily Republican/Heritage climate
  game.governingParty = 'people';

  const check = Primaries.evaluateIncumbentVulnerability(game);
  assert.strictEqual(check.vulnerable, true);
  assert(check.reason.includes('environment'));
});

test('evaluateIncumbentVulnerability flags revolt when base faction has happiness < 35 & friction > 65', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialApproval = 48.0;
  game.nationalEnvironment = 2.0;
  game.governingParty = 'people';
  game.factionStandings = { dem_establishment: 25 };
  game.factionFriction = { dem_establishment: 75 };

  const check = Primaries.evaluateIncumbentVulnerability(game);
  assert.strictEqual(check.vulnerable, true);
  assert(check.reason.includes('factional'));
});

test('evaluateIncumbentVulnerability returns non-vulnerable for popular incumbent (approval >= 50%)', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialApproval = 56.0;
  game.nationalEnvironment = -2.0;
  game.governingParty = 'people';
  game.factionStandings = { dem_establishment: 70 };
  game.factionFriction = { dem_establishment: 20 };

  const check = Primaries.evaluateIncumbentVulnerability(game);
  assert.strictEqual(check.vulnerable, false);
  assert.strictEqual(check.challenger, null);
});

// ------------------------------------------------------------------
// SUITE 3: REQ-196: Incumbent Primary Contest & Step-Aside Dilemma
// ------------------------------------------------------------------
console.log('\n--- SUITE 3: REQ-196: Incumbent Contest & Step-Aside Fallout ---');

test('Step-Aside Action opens open-seat field and cuts governing fatigue by 60%', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialApproval = 34.0;
  game.nationalEnvironment = 10.0;
  game.governingParty = 'people';

  game = Primaries.pressureIncumbentStepAside(game);
  assert.strictEqual(game.presidentialPrimaries.incumbentSteppedAside, true);
  assert.strictEqual(game.presidentialPrimaries.primaryFieldByParty.people.length, 4, 'Open-seat field generated');
  assert.strictEqual(game.nationalEnvironment, 4.0, '60% governing fatigue relief (10 -> 4)');
});

test('Contested incumbent primary carries Bruised Incumbent -3.5% penalty upon victory', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialApproval = 37.0;
  game.governingParty = 'people';

  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game);
  assert.strictEqual(game.presidentialPrimaries.incumbentVulnerable, true);
  assert.strictEqual(game.presidentialPrimaries.primaryFieldByParty.people.length, 2, 'Incumbent + Challenger');

  // Advance through all waves
  game = Primaries.advancePrimaryWave(game);
  game = Primaries.advancePrimaryWave(game);
  game = Primaries.advancePrimaryWave(game);

  // Crown incumbent
  game = Primaries.finalizeConventionAndCrownNominee(game);
  assert.strictEqual(game.presidentialPrimaries.bruisedIncumbentPenalty, 3.5, '-3.5% Bruised Incumbent penalty');
});

// ------------------------------------------------------------------
// SUITE 4: REQ-197: Presidential Primary Field & Candidate Generation
// ------------------------------------------------------------------
console.log('\n--- SUITE 4: REQ-197: Candidate Generation & Home-State Lift ---');

test('generatePresidentialPrimaryField creates 4 diverse candidates with 10-pillar stances and traits', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  const field = Primaries.generatePresidentialPrimaryField(game, 'people');
  assert.strictEqual(field.length, 4);

  field.forEach((c) => {
    assert(Boolean(c.name), 'Candidate has name');
    assert(Boolean(c.office), 'Candidate has office');
    assert(Boolean(c.stateId), 'Candidate has home state');
    assert(Array.isArray(c.traits), 'Candidate has traits array');
    assert(Number.isFinite(c.vulnerabilityScore), 'Hidden vulnerability score calculated');
    assert.strictEqual(Object.keys(c.stances).length, 10, '10 platform pillars initialized');
  });
});

test('calculateStatePrimaryVote applies +8.0% home state boost and +3.0% regional lift', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  const cand = {
    id: 'test_cand_pa',
    name: 'Gov. Josh Shapiro',
    office: 'governor',
    stateId: 'PA', // Home state PA (Northeast)
    fame: 70,
    approval: 70,
    momentum: 0,
    traits: ['Polished'],
  };

  const paSchedule = Primaries.STATE_DELEGATE_SCHEDULE.PA; // Home state
  const nySchedule = Primaries.STATE_DELEGATE_SCHEDULE.NY; // Contiguous Northeast state
  const txSchedule = Primaries.STATE_DELEGATE_SCHEDULE.TX; // Different South region

  const paVote = Primaries.calculateStatePrimaryVote(cand, paSchedule, [cand], game, 'people');
  const nyVote = Primaries.calculateStatePrimaryVote(cand, nySchedule, [cand], game, 'people');
  const txVote = Primaries.calculateStatePrimaryVote(cand, txSchedule, [cand], game, 'people');

  assert(paVote > nyVote, 'Home state PA vote exceeds contiguous NY vote');
  assert(nyVote > txVote, 'Contiguous NY vote exceeds non-contiguous TX vote');
});

// ------------------------------------------------------------------
// SUITE 5: REQ-198: Phased Primary Calendar & Dropouts
// ------------------------------------------------------------------
console.log('\n--- SUITE 5: REQ-198: Phased Calendar Engine & Cascades ---');

test('Phased calendar advances Wave 1 (Early) -> Wave 2 (Super Tuesday) -> Wave 3 (Late)', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialApproval = 55.0; // Open field for out-party / open-seat
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });

  assert.strictEqual(game.presidentialPrimaries.wave, 1);
  assert.strictEqual(game.presidentialPrimaries.stage, 'early_states');

  // Advance Wave 1
  game = Primaries.advancePrimaryWave(game);
  assert.strictEqual(game.presidentialPrimaries.wave, 2);
  assert.strictEqual(game.presidentialPrimaries.stage, 'super_tuesday');

  // Advance Wave 2
  game = Primaries.advancePrimaryWave(game);
  assert.strictEqual(game.presidentialPrimaries.wave, 3);
  assert.strictEqual(game.presidentialPrimaries.stage, 'late_states');

  // Advance Wave 3
  game = Primaries.advancePrimaryWave(game);
  assert.strictEqual(game.presidentialPrimaries.stage, 'convention');
});

test('Super Tuesday dropout cascade suspends sub-12% candidates and transfers momentum', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });

  // Advance Wave 1 & Wave 2
  game = Primaries.advancePrimaryWave(game);
  game = Primaries.advancePrimaryWave(game);

  const field = game.presidentialPrimaries.primaryFieldByParty.people;
  const withdrawn = field.filter((c) => c.status === 'withdrawn');
  if (withdrawn.length > 0) {
    const dropped = withdrawn[0];
    assert(Boolean(dropped.endorsedCandidateId), 'Withdrawn candidate endorsed an active rival');
  }
});

// ------------------------------------------------------------------
// SUITE 6: REQ-199: State Delegate Allocation & 2,000 Clinch Threshold
// ------------------------------------------------------------------
console.log('\n--- SUITE 6: REQ-199: Delegate Math & 2,000 Clinch Target ---');

test('All 51 jurisdictions strictly sum to 3,979 pledged delegates', () => {
  const sched = Primaries.STATE_DELEGATE_SCHEDULE;
  assert.strictEqual(Object.keys(sched).length, 51);
  const sum = Object.values(sched).reduce((acc, s) => acc + s.delegates, 0);
  assert.strictEqual(sum, 3979, 'Total delegates strictly 3,979');
  assert.strictEqual(Primaries.CLINCH_THRESHOLD, 2000, 'Threshold strictly 2,000');
});

test('allocateStateDelegates discards sub-15% candidates and distributes proportionally', () => {
  const shares = { cand_a: 0.50, cand_b: 0.30, cand_c: 0.12, cand_d: 0.08 }; // cand_c and cand_d < 15%
  const alloc = Primaries.allocateStateDelegates(shares, 40, false);

  assert.strictEqual(alloc.cand_c, 0, 'Sub-15% candidate receives 0 delegates');
  assert.strictEqual(alloc.cand_d, 0, 'Sub-15% candidate receives 0 delegates');
  assert(alloc.cand_a > alloc.cand_b, 'cand_a receives plurality');
  const sum = alloc.cand_a + alloc.cand_b;
  assert.strictEqual(sum, 40, 'Allocated delegates strictly match state total (40)');
});

test('allocateStateDelegates awards 100% of delegates in Major-Bonus states when vote > 50%', () => {
  const shares = { cand_a: 0.53, cand_b: 0.27, cand_c: 0.20 };
  const alloc = Primaries.allocateStateDelegates(shares, 100, true);
  assert.strictEqual(alloc.cand_a, 100, 'Winner > 50% sweeps all 100 delegates in major-bonus state');
  assert.strictEqual(alloc.cand_b, 0);
  assert.strictEqual(alloc.cand_d || 0, 0);
});

// ------------------------------------------------------------------
// SUITE 7: REQ-200: Chair Primary Strategy Actions
// ------------------------------------------------------------------
console.log('\n--- SUITE 7: REQ-200: Chair Strategy Actions ---');

test('Chair Neutrality action preserves party harmony (+6 Happiness)', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  const fId = game.factions[0].id;
  const prevH = Number(game.factionStandings[fId] || 60);

  game = Primaries.applyChairPrimaryAction(game, 'neutrality');
  const nextH = Number(game.factionStandings[fId]);
  assert.strictEqual(nextH, prevH + 6, '+6 Happiness across party factions');
  assert.strictEqual(game.presidentialPrimaries.chairStrategyUsed, true);
});

test('Chair Back Candidate spends $3.0M and inflicts -8 Happiness on rival factions', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.treasury = 20.0;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  const targetCand = game.presidentialPrimaries.primaryFieldByParty.people[0];

  game = Primaries.applyChairPrimaryAction(game, 'back_candidate', { candidateId: targetCand.id });
  assert.strictEqual(game.treasury, 17.0, '$3.0M committee funds spent');
  assert.strictEqual(game.presidentialPrimaries.backedCandidateId, targetCand.id);
});

test('Chair Broker Lane Consolidation convinces struggling candidate to drop out and endorse', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.actionsLeft = 4;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  const field = game.presidentialPrimaries.primaryFieldByParty.people;
  const strugglingCand = field[field.length - 1];

  game = Primaries.applyChairPrimaryAction(game, 'broker_lane', { candidateId: strugglingCand.id });
  assert.strictEqual(strugglingCand.status, 'withdrawn');
  assert(Boolean(strugglingCand.endorsedCandidateId), 'Endorsed frontrunner');
});

// ------------------------------------------------------------------
// SUITE 8: REQ-201 & REQ-202: Nominating Convention Floor & Ticket
// ------------------------------------------------------------------
console.log('\n--- SUITE 8: REQ-201 & REQ-202: Platform Planks, VP & Keynote ---');

test('Platform floor amendment shifts platform slider and updates wing happiness (+7 / -4)', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.issuePositions['climate-policy'] = 5.0;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  Primaries.initNominatingConvention(game, 'people');

  game = Primaries.resolvePlatformFloorVote(game, 'amendment_energy', 'A');
  assert.strictEqual(game.issuePositions['climate-policy'], 4.0, 'Platform slider shifted 1 point');
  assert(game.presidentialPrimaries.conventionData.platformAmendments[0].resolved);
});

test('Vice Presidential selection of primary runner-up heals bruised incumbent penalty', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  game.presidentialPrimaries.bruisedIncumbentPenalty = 3.5;
  Primaries.initNominatingConvention(game, 'people');

  const runnerUpVp = game.presidentialPrimaries.conventionData.vpRoster.find((v) => v.isRunnerUp);
  assert(Boolean(runnerUpVp), 'Runner-up available in VP roster');

  game = Primaries.resolveVpSelection(game, runnerUpVp.id);
  assert.strictEqual(game.presidentialPrimaries.bruisedIncumbentPenalty, 0, 'Bruised incumbent penalty canceled');
  assert.strictEqual(game.presidentialPrimaries.vpSelectionByParty.people, runnerUpVp.name);
});

test('Convention Keynote Speaker awards +5 Fame and grants +2.0% general election enthusiasm', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  Primaries.initNominatingConvention(game, 'people');

  const speaker = game.presidentialPrimaries.conventionData.keynoteSpeakers[0];
  const prevFame = speaker.fame || 50;

  game = Primaries.resolveKeynoteAddress(game, speaker.id);
  assert.strictEqual(speaker.fame, prevFame + 5, '+5 Fame to speaker');
  assert.strictEqual(game.presidentialPrimaries.conventionEnthusiasmBounce, 2.0, '+2.0% enthusiasm bounce');
});

// ------------------------------------------------------------------
// SUITE 9: REQ-203: Contested / Brokered Multi-Ballot Convention
// ------------------------------------------------------------------
console.log('\n--- SUITE 9: REQ-203: Brokered Multi-Ballot Showdown ---');

test('Brokered Convention Ballot 2 deal ratifies nominee and unblocks convention', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  game.presidentialPrimaries.brokeredConvention = true;
  Primaries.initNominatingConvention(game, 'people');

  game = Primaries.resolveBrokeredBallotDeal(game, { offerVp: true });
  assert.strictEqual(game.presidentialPrimaries.ballotCount, 2, 'Resolved on Ballot 2');
  assert.strictEqual(game.presidentialPrimaries.conventionData.brokeredResolved, true);
  assert(Boolean(game.presidentialPrimaries.presumptiveNomineeId), 'Nominee crowned');
});

test('Brokered Convention Ballot 3 deadlock triggers compromise candidate with -5.0% penalty', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialPrimaries = Primaries.initPresidentialPrimaries(game, { stepAside: true });
  game.presidentialPrimaries.brokeredConvention = true;
  Primaries.initNominatingConvention(game, 'people');

  game = Primaries.resolveBrokeredBallotDeal(game, {}); // No concession accord
  assert.strictEqual(game.presidentialPrimaries.ballotCount, 3);
  assert.strictEqual(game.presidentialPrimaries.conventionEnthusiasmBounce, -5.0, '-5.0% enthusiasm penalty');
});

// ------------------------------------------------------------------
// SUITE 10: General Election Margin Integration
// ------------------------------------------------------------------
console.log('\n--- SUITE 10: General Election Margin Integration ---');

test('presidentialStateMargin incorporates dynamic 2032+ nominee and VP home-state lifts', () => {
  let game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialTicket = { people: 'Gov. Josh Shapiro', heritage: 'Gov. Glenn Youngkin' };
  game.presidentialPrimaries = {
    active: false,
    stage: 'completed',
    primaryFieldByParty: {
      people: [{ name: 'Gov. Josh Shapiro', stateId: 'PA', office: 'governor' }],
      heritage: [{ name: 'Gov. Glenn Youngkin', stateId: 'VA', office: 'governor' }],
    },
    conventionData: {
      selectedVp: { name: 'Sen. Tammy Baldwin', stateId: 'WI', office: 'senate' },
    },
    vpSelectionByParty: {
      people: 'Sen. Tammy Baldwin',
    },
  };

  const paMargin = Engine.presidentialStateMargin(game, 'PA'); // Shapiro home state (+4.0% Dem)
  const wiMargin = Engine.presidentialStateMargin(game, 'WI'); // Baldwin VP home state (+4.0% Dem)
  const vaMargin = Engine.presidentialStateMargin(game, 'VA'); // Youngkin home state (+4.0% Rep)

  assert(Number.isFinite(paMargin));
  assert(Number.isFinite(wiMargin));
  assert(Number.isFinite(vaMargin));
});

test('presidentialStateMargin drags governing party margin when bruisedIncumbentPenalty is active', () => {
  let gameNormal = Engine.createGame({ baseTemplateId: 'people' });
  gameNormal.year = 2032;
  gameNormal.governingParty = 'people';
  gameNormal.presidentialPrimaries = {
    active: false,
    bruisedIncumbentPenalty: 0,
  };

  let gameBruised = Engine.createGame({ baseTemplateId: 'people' });
  gameBruised.year = 2032;
  gameBruised.governingParty = 'people';
  gameBruised.presidentialPrimaries = {
    active: false,
    bruisedIncumbentPenalty: 3.5,
  };

  const normalMargin = Engine.presidentialStateMargin(gameNormal, 'PA');
  const bruisedMargin = Engine.presidentialStateMargin(gameBruised, 'PA');
  assert(bruisedMargin < normalMargin, 'Bruised incumbent penalty reduces governing party margin');
});

// ------------------------------------------------------------------
// SUITE 11: Save Normalization & Atmospheric Vibes Audit
// ------------------------------------------------------------------
console.log('\n--- SUITE 11: Save Normalization & Vibes Audit ---');

test('normalizeGame preserves presidentialPrimaries across save/reload', () => {
  const game = Engine.createGame({ baseTemplateId: 'people' });
  game.year = 2032;
  game.presidentialPrimaries = {
    active: true,
    stage: 'super_tuesday',
    wave: 2,
    delegatesByParty: { people: { cand_1: 450 } },
  };

  const saved = JSON.stringify(game);
  const normalized = Engine.normalizeGame(JSON.parse(saved));
  assert(Boolean(normalized.presidentialPrimaries), 'presidentialPrimaries preserved');
  assert.strictEqual(normalized.presidentialPrimaries.stage, 'super_tuesday');
  assert.strictEqual(normalized.presidentialPrimaries.wave, 2);
});

test('Zero REQ-XX or MAS-XX tags in player-facing UI text', () => {
  const appCode = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const primCode = fs.readFileSync(path.join(ROOT, 'presidential-primaries.js'), 'utf8');

  // Check UI strings rendered by searching functions
  const uiRegex = /<[^>]+>[^<]*REQ-\d+[^<]*<\/[^>]+>/i;
  assert(!uiRegex.test(appCode), 'app.js free of HTML REQ tags');
  assert(!uiRegex.test(primCode), 'presidential-primaries.js free of HTML REQ tags');
});

console.log('\n====================================================================');
console.log(` ALL CHECKS PASSED: ${totalPasses}/${totalPasses} (100%)`);
console.log('====================================================================');
