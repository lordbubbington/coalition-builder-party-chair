/**
 * Verification Test Suite for Developer 4:
 * Donor Class Dark-Money Blocs & Electoral Reform Sandbox
 * Target: scripts/test-dark-money-electoral-reform.cjs
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('====================================================================');
console.log(' DEVELOPER 4: DARK-MONEY BLOCS & ELECTORAL REFORM SANDBOX SUITE');
console.log('====================================================================');

// 1. Setup headless environment
global.window = global;
const storageMem = new Map();
global.localStorage = {
  getItem: (k) => storageMem.get(k) || null,
  setItem: (k, v) => storageMem.set(k, String(v)),
  removeItem: (k) => storageMem.delete(k),
};

const mockAppElement = {
  innerHTML: '',
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  insertAdjacentHTML() {},
  addEventListener() {},
};

global.document = {
  querySelector: () => mockAppElement,
  querySelectorAll: () => [mockAppElement],
  getElementById: () => mockAppElement,
  addEventListener: () => {},
};

// Load required scripts in proper dependency order
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
  'ballot-access.js',
  'election-uncertainty.js',
  'candidate-vetting.js',
  'election-drift.js',
  'election-night-engine.js',
  'media-shocks-system.js',
  'campaign-overhaul.js',
  'campaign-events-system.js',
  'redistricting-ballot-system.js',
  'coalition-politics-system.js',
  'atlas-multiplayer-system.js',
  'leading-faction-system.js',
  'faction-era-stability.js',
  'v0185-playtest-fixes.js',
  'engine.js',
  'app.js',
];

const ROOT = path.resolve(__dirname, '..');
for (const s of scripts) {
  require(path.join(ROOT, s));
}

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    throw err;
  }
}

const Data = window.PartyChairData;
const Engine = window.PartyChairEngine;
const BallotAccess = window.BallotAccess;

(async () => {
  // Wait a tick for async app.js initialization
  await new Promise((r) => setTimeout(r, 60));

  // --------------------------------------------------------------------------
  // CHUNK 4.1: Six Dark-Money Super PAC Blocs Catalog & Properties
  // --------------------------------------------------------------------------
  console.log('\n--- CHUNK 4.1: DARK-MONEY BLOCS & DONOR REVOLTS ---');

  test('DARK_MONEY_BLOCS catalog has 6 distinct interest-group blocs with required properties', () => {
    assert(Array.isArray(Data.DARK_MONEY_BLOCS), 'DARK_MONEY_BLOCS must be an array');
    assert.strictEqual(Data.DARK_MONEY_BLOCS.length, 6, 'Must define exactly 6 dark-money blocs');

    const expectedIds = [
      'tech_innovation_pac',
      'organized_labor_pac',
      'wall_street_finance_pac',
      'energy_independence_pac',
      'grassroots_small_dollar_pac',
      'pharma_health_pac',
    ];

    expectedIds.forEach((id) => {
      const b = Data.DARK_MONEY_BLOCS.find((bloc) => bloc.id === id);
      assert(b, `Bloc '${id}' must exist in catalog`);
      assert(b.name, `Bloc '${id}' must have a name`);
      assert(b.sector, `Bloc '${id}' must have a sector`);
      assert(typeof b.infusion === 'number' && b.infusion >= 15, `Bloc '${id}' must have infusion >= $15M`);
      assert(b.redLine && b.redLine.description, `Bloc '${id}' must define a red line with description`);
    });
  });

  test('Forming alliance with a dark-money bloc grants infusion and updates fundraising', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    const initialTreasury = game.treasury || 0;

    game = Engine.partnerWithDarkMoneyBloc(game, 'tech_innovation_pac');
    assert(game.darkMoneyBlocs.activeBlocs.includes('tech_innovation_pac'), 'tech_innovation_pac should be active');
    assert.strictEqual(game.treasury, initialTreasury + 25.0, 'Treasury should increase by $25M infusion');

    const fProfile = Engine.calculatePartyFundraising(game, 'player');
    assert.strictEqual(fProfile.darkMoneyActiveCount, 1, 'Should report 1 active dark-money PAC');
    assert.strictEqual(fProfile.totalOutsideWarchest, 25.0, 'Should report $25M total outside warchest');
    assert(fProfile.darkMoneyOutsideSpending > 0, 'Should calculate dark-money outside spending yield');
  });

  test('Platform slider shift crossing red line triggers Donor Revolt and airtime penalty', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    game = Engine.partnerWithDarkMoneyBloc(game, 'tech_innovation_pac');

    const treasuryBefore = game.treasury;
    // Shift economic axis to 7.5 (threshold is 6.5)
    game.player.axes = { ...(game.player.axes || {}), economic: 7.5 };
    game.player.economic = 0.5; // (0.5 + 1) * 4.5 + 1 = 7.75

    game = Engine.checkDonorRedLineRevolts(game);

    assert(game.donorClassRevoltActive, 'donorClassRevoltActive flag must be true');
    assert(game.primaryChallengesRisk, 'primaryChallengesRisk flag must be true');
    assert(!game.darkMoneyBlocs.activeBlocs.includes('tech_innovation_pac'), 'Revolted bloc must be removed from active');
    assert(game.darkMoneyBlocs.blocs.tech_innovation_pac.revolted, 'Bloc state must record revolted: true');
    assert(game.darkMoneyBlocs.blocs.tech_innovation_pac.frozen, 'Bloc state must record frozen: true');
    assert(game.darkMoneyBlocs.donorRevolts.length >= 1, 'Donor revolts log must record the event');
    assert(game.treasury < treasuryBefore, 'Treasury must reflect withdrawn airtime penalty');
  });

  test('Legislative bill enactment crossing red line triggers immediate Donor Revolt', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    game = Engine.partnerWithDarkMoneyBloc(game, 'wall_street_finance_pac');
    assert(game.darkMoneyBlocs.activeBlocs.includes('wall_street_finance_pac'), 'Wall Street PAC must be active');

    // Enact Wealth Tax bill
    game.passedBills = [...(game.passedBills || []), { id: 'wealth-tax', stateId: 'US', year: 2028 }];
    game = Engine.checkDonorRedLineRevolts(game);

    assert(game.darkMoneyBlocs.blocs.wall_street_finance_pac.revolted, 'Wall Street PAC must revolt on wealth tax enactment');
    assert(game.darkMoneyBlocs.donorRevolts.some((r) => r.blocId === 'wall_street_finance_pac'), 'Revolt must be logged');
  });

  test('Environmental, Pharma, Labor, and Grassroots red lines trigger properly', () => {
    // Energy Independence revolt on carbon-tax
    let g1 = Engine.createGame({ baseTemplateId: 'people' });
    g1 = Engine.partnerWithDarkMoneyBloc(g1, 'energy_independence_pac');
    g1.passedBills = [{ id: 'carbon-tax', stateId: 'US', year: 2028 }];
    g1 = Engine.checkDonorRedLineRevolts(g1);
    assert(g1.darkMoneyBlocs.blocs.energy_independence_pac.revolted, 'Energy PAC must revolt on carbon tax');

    // Pharma revolt on drug-price-caps
    let g2 = Engine.createGame({ baseTemplateId: 'people' });
    g2 = Engine.partnerWithDarkMoneyBloc(g2, 'pharma_health_pac');
    g2.passedBills = [{ id: 'drug-price-caps', stateId: 'US', year: 2028 }];
    g2 = Engine.checkDonorRedLineRevolts(g2);
    assert(g2.darkMoneyBlocs.blocs.pharma_health_pac.revolted, 'Pharma PAC must revolt on drug price caps');

    // Organized Labor revolt on low economic slider (economic < 4.0)
    let g3 = Engine.createGame({ baseTemplateId: 'people' });
    g3 = Engine.partnerWithDarkMoneyBloc(g3, 'organized_labor_pac');
    g3.player.axes = { economic: 3.0 };
    g3 = Engine.checkDonorRedLineRevolts(g3);
    assert(g3.darkMoneyBlocs.blocs.organized_labor_pac.revolted, 'Organized Labor must revolt when economic slider < 4.0');

    // Grassroots network revolt on corporate PAC alliance bill
    let g4 = Engine.createGame({ baseTemplateId: 'people' });
    g4 = Engine.partnerWithDarkMoneyBloc(g4, 'grassroots_small_dollar_pac');
    g4.passedBills = [{ id: 'corporate-pac-alliance', stateId: 'US', year: 2028 }];
    g4 = Engine.checkDonorRedLineRevolts(g4);
    assert(g4.darkMoneyBlocs.blocs.grassroots_small_dollar_pac.revolted, 'Grassroots Network must revolt on corporate PAC alliance');
  });

  // --------------------------------------------------------------------------
  // CHUNK 4.2: Electoral Reform Sandbox — Approval Voting & Open-List PR
  // --------------------------------------------------------------------------
  console.log('\n--- CHUNK 4.2: ELECTORAL REFORM SANDBOX ---');

  test('STATE_ELECTORAL_SYSTEMS catalog defines approval_voting and open_list_proportional', () => {
    assert(Data.STATE_ELECTORAL_SYSTEMS, 'STATE_ELECTORAL_SYSTEMS must be defined');
    assert(Data.STATE_ELECTORAL_SYSTEMS.approval_voting, 'approval_voting must be in catalog');
    assert(Data.STATE_ELECTORAL_SYSTEMS.open_list_proportional, 'open_list_proportional must be in catalog');
    assert.strictEqual(Data.STATE_ELECTORAL_SYSTEMS.approval_voting.isAntiSpoiler, true, 'Approval voting must be anti-spoiler');
    assert.strictEqual(Data.STATE_ELECTORAL_SYSTEMS.open_list_proportional.isProportional, true, 'Open-list PR must be proportional');
    assert.strictEqual(Data.STATE_ELECTORAL_SYSTEMS.open_list_proportional.thresholdPct, 4.0, 'Open-list PR must specify 4.0% threshold');
  });

  test('processStateElectoralReform enacts Approval Voting and eliminates strategic defection completely', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    game = BallotAccess.processStateElectoralReform(game, 'PA', 'approval_voting');

    const stSys = Engine.getStateElectoralSystem(game, 'PA', 'presidential');
    assert.strictEqual(stSys.effectiveSystem, 'approval_voting', 'PA presidential system should be approval_voting');
    assert.strictEqual(stSys.isAntiSpoiler, true, 'Approval voting must be anti-spoiler');

    // Verify Duverger strategic defection is completely eliminated (0% defection rate)
    const defResult = Engine.computeStrategicVotingDefection(game, 'green', 'PA', 'presidential', 8.5);
    assert.strictEqual(defResult.defectionRate, 0, 'Approval voting must eliminate defection rate');
    assert.strictEqual(defResult.defectedShare, 0, 'Approval voting must eliminate defected share');
    assert.strictEqual(defResult.retainedShare, 8.5, 'Voters must remain at true 8.5% alignment');
    assert.strictEqual(defResult.bypassed, true, 'Strategic defection must be marked bypassed');
  });

  test('processStateElectoralReform enacts Open-List PR for House delegations with 4.0% threshold', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    game = BallotAccess.processStateElectoralReform(game, 'PA', 'open_list_proportional');

    const houseSys = Engine.getStateElectoralSystem(game, 'PA', 'house');
    assert.strictEqual(houseSys.effectiveSystem, 'open_list_proportional', 'PA legislative system should be open_list_proportional');
    assert.strictEqual(houseSys.isProportional, true, 'Must be proportional');
    assert.strictEqual(houseSys.isAntiSpoiler, true, 'Must be anti-spoiler');

    // Test proportional seat allocation with 4.0% threshold on 17 seats
    const shares = { people: 46.0, heritage: 44.0, green: 5.5, liberty: 3.5, constitution: 1.0 };
    const alloc = Engine.allocateProportionalSeats(shares, 17, 4.0);

    assert(alloc.green >= 1, 'Green Party at 5.5% (>= 4.0% threshold) must win at least 1 proportional House seat');
    assert.strictEqual(alloc.liberty || 0, 0, 'Liberty at 3.5% (< 4.0% threshold) must not qualify for proportional seats');
    const totalAllocated = Object.values(alloc).reduce((s, v) => s + v, 0);
    assert.strictEqual(totalAllocated, 17, 'Total allocated seats must equal 17');
  });

  test('reallocateHouseSeats executes proportional reallocation on multi-seat states', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    game = BallotAccess.processStateElectoralReform(game, 'PA', 'open_list_proportional');

    const fakeDistricts = [
      { id: 'PA-01', stateId: 'PA', partyId: 'people', allShares: { people: 48, heritage: 44, green: 8 } },
      { id: 'PA-02', stateId: 'PA', partyId: 'people', allShares: { people: 48, heritage: 44, green: 8 } },
      { id: 'PA-03', stateId: 'PA', partyId: 'heritage', allShares: { people: 48, heritage: 44, green: 8 } },
      { id: 'PA-04', stateId: 'PA', partyId: 'heritage', allShares: { people: 48, heritage: 44, green: 8 } },
    ];
    const seats = { people: 2, heritage: 2, green: 0 };

    const res = Engine.reallocateHouseSeats(game, fakeDistricts, seats);
    assert(res.seats.green >= 1, 'Green Party must be allocated at least 1 seat under proportional reallocation');
    assert.strictEqual(res.seats.people + res.seats.heritage + res.seats.green, 4, 'Total seats must remain 4');
  });

  // --------------------------------------------------------------------------
  // CHUNK 4.3: National Popular Vote Interstate Compact (NPVIC) Engine
  // --------------------------------------------------------------------------
  console.log('\n--- CHUNK 4.3: NPVIC PRESIDENTIAL ENGINE ---');

  test('NPVIC tracks compacting states and cumulative electoral votes', () => {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    assert(Array.isArray(game.npvicStates), 'game.npvicStates must be initialized as an array');
    const initialEV = Engine.getNpvicTotalEV(game);
    assert(initialEV > 0 && initialEV < 270, `Default compacting states should sum to ~205-209 EVs (< 270), got ${initialEV}`);
    assert.strictEqual(Engine.isNpvicActive(game), false, 'Default compact must be inactive (< 270 EVs)');
  });

  test('Joining NPVIC states pushes compact past 270 EVs and triggers activation', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    assert.strictEqual(Engine.isNpvicActive(game), false);

    // Add battleground states to push past 270 EVs (PA: 19, NC: 16, GA: 16, MI: 15, OH: 17)
    game = Engine.joinNpvic(game, 'PA');
    game = Engine.joinNpvic(game, 'NC');
    game = Engine.joinNpvic(game, 'GA');
    game = Engine.joinNpvic(game, 'MI');
    game = Engine.joinNpvic(game, 'OH');

    const totalEV = Engine.getNpvicTotalEV(game);
    assert(totalEV >= 270, `Total EV must be >= 270, got ${totalEV}`);
    assert.strictEqual(Engine.isNpvicActive(game), true, 'NPVIC must be active when total EV >= 270');
  });

  test('When NPVIC is active, all 270+ compacting EVs award in a block to national popular vote winner', () => {
    let game = Engine.createGame({ baseTemplateId: 'people' });
    // Expand compact to trigger activation
    ['PA', 'NC', 'GA', 'MI', 'OH', 'FL', 'TX'].forEach((st) => {
      game = Engine.joinNpvic(game, st);
    });
    assert.strictEqual(Engine.isNpvicActive(game), true, 'NPVIC must be active');

    const forecast = Engine.presidentialForecast(game);
    assert.strictEqual(forecast.npvicActive, true, 'Forecast must flag npvicActive: true');
    assert(forecast.npvicWinner, 'Forecast must identify npvicWinner');
    assert(forecast.npvicTotalEV >= 270, 'Forecast must report npvicTotalEV >= 270');

    // All compacting states should be awarded to the npvicWinner
    const compactStates = new Set(game.npvicStates);
    compactStates.forEach((stId) => {
      const row = forecast.byState[stId];
      if (row) {
        assert.strictEqual(row.winner, forecast.npvicWinner, `Compacting state ${stId} must be awarded to NPVIC winner`);
      }
    });

    // National popular vote winner must receive at least 270 EVs
    assert(forecast.evByParty[forecast.npvicWinner] >= 270, 'NPVIC winner must have >= 270 electoral votes');
    assert.strictEqual(forecast.contingentElectionRequired, false, 'Contingent election must not be required when compact awards >= 270 EVs');
  });

  // --------------------------------------------------------------------------
  // CHUNK 4.4: UI Dashboards & Atmospheric Displays
  // --------------------------------------------------------------------------
  console.log('\n--- CHUNK 4.4: UI DASHBOARDS & ATMOSPHERIC DISPLAYS ---');

  test('renderFinanceTab produces valid HTML with Donor Blocs dossier and warchests', () => {
    const App = window.PartyChairApp;
    assert(typeof App.renderFinanceTab === 'function', 'renderFinanceTab must be exported on PartyChairApp');

    let game = Engine.createGame({ baseTemplateId: 'people' });
    game = Engine.partnerWithDarkMoneyBloc(game, 'tech_innovation_pac');

    const html = App.renderFinanceTab(game);
    assert(html.includes('Donor Class Dark-Money Super PAC Blocs'), 'Must render Donor Blocs header');
    assert(html.includes('Tech Innovation Coalition PAC'), 'Must render active Tech Innovation PAC');
    assert(html.includes('ACTIVE ALLIANCE'), 'Must render ACTIVE ALLIANCE badge');
    assert(html.includes('POLICY RED LINE:'), 'Must render policy red line disclosure');
    assert(html.includes('Campaign Finance & Mega-Donor Warchests'), 'Must render finance overview');
  });

  test('renderElectoralSystemsMap produces valid HTML with NPVIC tracker and 50-state roster', () => {
    const App = window.PartyChairApp;
    assert(typeof App.renderElectoralSystemsMap === 'function', 'renderElectoralSystemsMap must be exported on PartyChairApp');

    let game = Engine.createGame({ baseTemplateId: 'people' });
    const html = App.renderElectoralSystemsMap(game);

    assert(html.includes('National Popular Vote Interstate Compact (NPVIC)'), 'Must render NPVIC header');
    assert(html.includes('npvic-progress-bar'), 'Must render NPVIC progress bar');
    assert(html.includes('50-State Electoral Systems Roster'), 'Must render 50-state roster');
    assert(html.includes('state-reform-select'), 'Must render electoral reform dropdown selectors');
  });

  test('Presidential map includes atmospheric NPVIC tracker banner', () => {
    const App = window.PartyChairApp;
    const testGame = Engine.createGame({ baseTemplateId: 'people' });
    App.setGame(testGame);
    App.setActiveMap('presidential');
    const markup = App.mapTabMarkup();
    assert(markup.includes('National Popular Vote Interstate Compact (NPVIC)'), 'Presidential map must include NPVIC tracker');
    assert(markup.includes('npvic-status-pill'), 'Must include NPVIC status pill');
  });

  console.log('\n====================================================================');
  console.log(` ALL TESTS PASSED: ${passed}/${total}`);
  console.log('====================================================================\n');
})();
