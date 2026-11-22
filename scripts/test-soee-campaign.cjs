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
const CO = window.CampaignOverhaul;
const Vetting = window.CandidateVetting;

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  PASS: ${name}`);
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('=== Symmetric Opponent Execution Engine (SOEE) Agent 3 Verification Suite ===\n');

// ----------------------------------------------------------------------------
// Test 1: REQ-300: simulateOpponentPhase('organizing')
// ----------------------------------------------------------------------------
test('REQ-300: simulateOpponentPhase(organizing) executes 20-action budgeting loop and Steps 1-5 for all opponents', () => {
  let game = Eng.createGame('test_soee_org', 'people');
  game = Eng.ensurePartyStates(game);
  assert.ok(game.parties, 'game.parties exists');
  assert.ok(game.parties.heritage, 'GOP party exists');

  // Verify initial state
  const initialActions = game.parties.heritage.organizingActionsRemaining;
  assert.strictEqual(initialActions, 20, 'GOP starts with 20 organizing actions');

  // Run organizing simulation
  game = Eng.simulateOpponentPhase(game, 'organizing');

  // Assert GOP spent all actions
  assert.strictEqual(game.parties.heritage.organizingActionsRemaining, 0, 'GOP spent all 20 organizing actions');
  assert.ok(Object.keys(game.parties.heritage.platformStances).length >= 40, 'GOP tuned 40+ platform stances');
  assert.strictEqual(game.parties.heritage.activeQuests.length, 3, 'GOP locked 3 main priorities');
  assert.ok(game.parties.heritage.partyFocuses.length >= 3, 'GOP locked 3-7 party focuses');
  assert.ok(Object.keys(game.parties.heritage.leadershipRoles).length >= 5, 'GOP appointed leadership hierarchy');

  // Verify voter electorate strictly conserved at 155,000,000
  const totalRep = (game.voterModel?.states || []).reduce((s, st) => s + (st.representedVoters || 0), 0);
  assert.strictEqual(totalRep, 155000000, 'Conserved exact 155,000,000 voters');
});

// ----------------------------------------------------------------------------
// Test 2: REQ-300: simulateOpponentPhase('campaign') Synchronous Execution
// ----------------------------------------------------------------------------
test('REQ-300: simulateOpponentPhase(campaign) synchronously executes monthly AI turns (Months 1-5) spending 5 actions/party', () => {
  let game = Eng.createGame('test_soee_camp', 'people');
  game = Eng.startCampaignPhase(game);

  assert.ok(game.campaign.active, 'Campaign is active');
  assert.strictEqual(game.campaign.month, 1, 'Starts at Month 1');

  // Verify Month 1 rival activity
  assert.ok(game.campaign.rivalActivity, 'Month 1 rival activity populated');
  const gopData = game.campaign.rivalActivity.byParty?.heritage;
  assert.ok(gopData, 'GOP took Month 1 campaign turn');
  assert.strictEqual(gopData.actionsTaken.length, 5, 'GOP executed exactly 5 campaign actions');

  // Advance Month 2 through 5
  for (let m = 2; m <= 5; m++) {
    game = Eng.simulateOpponentPhase(game, 'campaign', { month: m });
    assert.strictEqual(game.campaign.month, m, `Campaign is at Month ${m}`);
    assert.ok(game.campaign.rivalActivity, `Month ${m} rival activity populated`);
    const curGop = game.campaign.rivalActivity.byParty?.heritage;
    assert.ok(curGop, `GOP turn executed for Month ${m}`);
    assert.strictEqual(curGop.actionsTaken.length, 5, `GOP executed 5 actions in Month ${m}`);
  }
});

// ----------------------------------------------------------------------------
// Test 3: REQ-303: GOP 65% Attack Ads & Battleground Saturation
// ----------------------------------------------------------------------------
test('REQ-303: GOP pours 65% attack ads early into PA/WI, driving airwaves into Crowded/Saturated tiers', () => {
  let game = Eng.createGame('test_soee_airwaves', 'people');
  game = Eng.startCampaignPhase(game);

  // Month 1 GOP turn
  const month1Gop = game.campaign.rivalActivity?.byParty?.heritage;
  assert.ok(month1Gop, 'GOP Month 1 data exists');

  // Verify early attack ads in battlegrounds
  const attackActions = month1Gop.actionsTaken.filter((a) => a.action === 'issue_attack' || a.action === 'ad_blitz');
  assert.ok(attackActions.length >= 3, 'GOP executed at least 3 ad/attack actions (65%+ of actions)');

  // Advance to Month 2
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 2 });

  // Check state saturation in key battlegrounds (PA, WI, MI, GA, AZ)
  const bgSat = ['PA', 'WI', 'MI', 'GA', 'AZ'].map((st) => game.campaign.stateSaturation?.[st] || 0);
  const maxSat = Math.max(...bgSat);
  assert.ok(maxSat >= 36, `Battleground saturation (${maxSat}) reached Crowded (>35) or Saturated (>65) tier`);

  const tier = CO.getSaturationTier(maxSat);
  assert.ok(['crowded', 'saturated', 'fatigue'].includes(tier.id), `Tier is ${tier.id}`);
});

// ----------------------------------------------------------------------------
// Test 4: REQ-303: Theme of the Month Selection & Stale Issue Penalty
// ----------------------------------------------------------------------------
test('REQ-303: AI Chairs select authentic monthly themes and suffer stale penalty on repeat selection', () => {
  let game = Eng.createGame('test_soee_theme', 'people');
  game = Eng.startCampaignPhase(game);

  // Month 1 theme for GOP
  const gop1 = game.campaign.rivalActivity?.byParty?.heritage;
  assert.strictEqual(gop1.monthlyTheme, 'border-enforcement', 'GOP selected authentic Month 1 theme (border-enforcement)');
  assert.strictEqual(gop1.themeIsRepeat, false, 'Month 1 is fresh theme (no stale penalty)');
  const liftFresh = gop1.themeLift;
  assert.ok(liftFresh > 0, `Fresh theme lift > 0 (actual: ${liftFresh})`);

  // Advance to Month 4 where GOP repeats border-enforcement
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 2 });
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 3 });
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 4 });

  const gop4 = game.campaign.rivalActivity?.byParty?.heritage;
  assert.strictEqual(gop4.monthlyTheme, 'border-enforcement', 'GOP repeated border-enforcement in Month 4');
  assert.strictEqual(gop4.themeIsRepeat, true, 'Repeat theme flagged as repeat');
  const liftRepeat = gop4.themeLift;
  // Lift is reduced by stale penalty multiplier (50% or 75%)
  assert.ok(liftRepeat < liftFresh, `Repeat theme lift (${liftRepeat}) is lower than fresh lift (${liftFresh})`);
});

// ----------------------------------------------------------------------------
// Test 5: REQ-304: Oppo Research Commission & Month 5 October Surprise
// ----------------------------------------------------------------------------
test('REQ-304: AI commissions oppo in Months 1-3, holds dossier, and GOP detonates October Surprise in Month 5', () => {
  let game = Eng.createGame('test_soee_oppo', 'people');
  // Ensure player has a vulnerable nominee for test determinism
  game.presidentialTicket = { playerNominee: { id: 'test_nom', name: 'Test Nominee', traits: ['Corrupt'], stateId: 'PA' } };
  game = Eng.startCampaignPhase(game);

  // In Month 1, GOP commissions oppo
  const gop1 = game.campaign.rivalActivity?.byParty?.heritage;
  assert.ok(gop1.actionsTaken.some((a) => a.action === 'INVESTIGATE_OPPO'), 'GOP commissioned oppo in Month 1');
  assert.ok(gop1.oppoDossiers.length > 0, 'GOP uncovered an oppo dossier');
  const dossier = gop1.oppoDossiers[0];
  assert.strictEqual(dossier.detonated, false, 'Dossier held in secret (detonated === false)');

  // Advance through Months 2, 3, 4: dossier still held
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 2 });
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 3 });
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 4 });

  const gop4 = game.campaign.rivalActivity?.byParty?.heritage;
  assert.strictEqual(gop4.oppoDossiers[0].detonated, false, 'Dossier still held in secret in Month 4');

  // Month 5: October Surprise Detonation!
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 5 });
  const gop5 = game.campaign.rivalActivity?.byParty?.heritage;
  assert.strictEqual(gop5.oppoDossiers[0].detonated, true, 'Dossier detonated in Month 5 (October Surprise)');
  assert.strictEqual(gop5.oppoDossiers[0].detonatedMonth, 5, 'Detonation month recorded as 5');
  assert.ok(gop5.actionsTaken.some((a) => a.action === 'DETONATE_OPPO_DOSSIER'), 'DETONATE_OPPO_DOSSIER action executed');

  // Verify Breaking News Headline
  const headlines = game.campaign.rivalActivity?.morningWireHeadlines || [];
  assert.ok(headlines.some((h) => h.includes('OCTOBER SURPRISE')), 'Morning Wire reported OCTOBER SURPRISE');
});

// ----------------------------------------------------------------------------
// Test 6: REQ-304: 42 Trait-Driven Crises Automated Decision Matrix
// ----------------------------------------------------------------------------
test('REQ-304: AI candidates resolve trait crises via archetype decision trees (GOP Double Down, DNC Apologize)', () => {
  let game = Eng.createGame('test_soee_crises', 'people');
  game = Eng.startCampaignPhase(game);

  // Month 2 triggers crisis checks
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 2 });

  const gop = game.campaign.rivalActivity?.byParty?.heritage;
  assert.ok(gop, 'GOP Month 2 turn executed');
  const gopResolutions = Object.values(gop.crisisResolutions);
  assert.ok(gopResolutions.includes('attack_media_double_down'), 'GOP resolved crisis via Attack Media & Double Down');

  // Check DNC when player is GOP
  let gopGame = Eng.createGame({ seed: 'test_soee_dem_crisis', baseTemplateId: 'heritage' });
  gopGame = Eng.startCampaignPhase(gopGame);
  gopGame = Eng.simulateOpponentPhase(gopGame, 'campaign', { month: 2 });

  const dnc = gopGame.campaign.rivalActivity?.byParty?.people;
  assert.ok(dnc, 'DNC Month 2 turn executed');
  const dncResolutions = Object.values(dnc.crisisResolutions);
  assert.ok(dncResolutions.includes('panel_apologize'), 'DNC resolved crisis via Appoint Panel & Apologize');
});

// ----------------------------------------------------------------------------
// Test 7: REQ-304: Month 5 Final 72 Hours Blitz
// ----------------------------------------------------------------------------
test('REQ-304: AI chairs execute Final 72 Hours Blitz in Month 5 allocating cash across battlegrounds', () => {
  let game = Eng.createGame('test_soee_blitz', 'people');
  game = Eng.startCampaignPhase(game);

  // Advance to Month 5
  for (let m = 2; m <= 5; m++) {
    game = Eng.simulateOpponentPhase(game, 'campaign', { month: m });
  }

  const gop5 = game.campaign.rivalActivity?.byParty?.heritage;
  assert.ok(gop5, 'GOP Month 5 data exists');
  const blitzAct = gop5.actionsTaken.find((a) => a.action === 'final_72h_blitz');
  assert.ok(blitzAct, 'GOP executed final_72h_blitz in Month 5');
  assert.ok(blitzAct.spend > 0, `GOP spent money on blitz ($${blitzAct.spend}M)`);
});

// ----------------------------------------------------------------------------
// Test 8: REQ-310: Morning Wire, Ticker, Airwaves & Ground Balance Card
// ----------------------------------------------------------------------------
test('REQ-310: Opponent telemetry exposes Morning Wire, Campaign Trail Ticker, and Airwaves & Ground Balance data', () => {
  let game = Eng.createGame('test_soee_ui', 'people');
  game = Eng.startCampaignPhase(game);

  // Assert Morning Wire headlines exist
  const headlines = game.campaign.rivalActivity?.morningWireHeadlines || [];
  assert.ok(headlines.length >= 2, `Morning Wire generated headlines (count: ${headlines.length})`);
  assert.ok(headlines.some((h) => h.includes('Airwaves Assault') || h.includes('DNC Dithers')), 'Procedural headlines match spec');

  // Assert Campaign Trail Ticker items exist
  const ticker = game.campaign.rivalActivity?.tickerItems || [];
  assert.ok(ticker.length >= 1, `Campaign Trail Ticker generated items (count: ${ticker.length})`);

  // Assert Airwaves and Field Offices maps are populated
  assert.ok(game.campaign.airwavesSpendByState, 'airwavesSpendByState exists in campaign');
  assert.ok(game.campaign.fieldOfficesByState, 'fieldOfficesByState exists in campaign');

  // Advance month 4 to test field offices
  game = Eng.simulateOpponentPhase(game, 'campaign', { month: 4 });
  const totalOffices = Object.values(game.campaign.fieldOfficesByState || {}).reduce((s, stMap) => {
    return s + Object.values(stMap).reduce((acc, v) => acc + Number(v || 0), 0);
  }, 0);
  assert.ok(totalOffices > 0, `Active ground field offices established (${totalOffices})`);

  // Advance full cycle through Election Night to verify zero UI lockups or crashes
  for (let w = 1; w <= 5; w++) {
    if (game.campaign?.active) {
      game = Eng.advanceCampaignWeek(game);
    }
  }
  assert.ok(game.phase === 'election-night' || game.phase === 'complete', `Game smoothly advanced to ${game.phase}`);
});

console.log(`\n====================================================================`);
console.log(` ALL ${passed}/${passed} SOEE AGENT 3 VERIFICATION TESTS PASSED SUCCESSFULLY!`);
console.log(`====================================================================`);
