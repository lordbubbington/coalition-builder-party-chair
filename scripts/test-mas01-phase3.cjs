/**
 * Automated Verification & Integration Suite for MAS-01 Phase 3
 * Target: scripts/test-mas01-phase3.cjs
 *
 * Covers the 8 Structural Party-Spawning & Group E Follow-Up Eras:
 * - Era #2: The Moderate Party (Group A · Weight = 3)
 * - Era #3: The 6-Party System (Group B · Weight = 3)
 * - Era #10: Regional Parties Emerge (Group D · Weight = 1)
 * - Era #17: Ecological Collapse (Group D · Weight = 1)
 * - Era #22: The Neo-Federalist Reunion (Group E · Weight = 5 · >= 35 yrs after Era #10)
 * - Era #23: The Secular Enlightenment Revival (Group E · Weight = 5 · >= 30 yrs after Era #9)
 * - Era #24: The Human-Verified Backlash (Group E · Weight = 5 · >= 35 yrs after Era #15)
 * - Era #25: The Planetary Thermostat Era (Group E · Weight = 5 · >= 40 yrs after Era #13 or #17)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0;
let total = 0;

function assert(cond, msg) {
  total += 1;
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  }
  passed += 1;
  console.log(`  ✅ PASS: ${msg}`);
}

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

const mockAppElement = {
  innerHTML: '',
  classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
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
  localStorage: mockLocalStorage,
  console,
  setTimeout,
  clearTimeout,
  Math,
  JSON,
  Number,
  String,
  Array,
  Object,
  Infinity,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Date,
  Set,
  Map,
  Uint8Array,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  Blob: globalThis.Blob,
  DecompressionStream: globalThis.DecompressionStream,
  Response: globalThis.Response,
};
sandbox.window = sandbox;
sandbox.window.document = mockDocument;
const ctx = vm.createContext(sandbox);

function loadScript(relPath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', relPath), 'utf8');
  vm.runInContext(code, ctx, { filename: relPath });
}

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
  'party-systems-data.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'v07-scaffolding.js',
  'engine.js',
  'app.js',
].forEach(loadScript);

const Engine = sandbox.window.PartyChairEngine;
const PSData = sandbox.window.PartySystemsData;
const PSEngine = sandbox.window.PartySystemsEngine;
const PSUI = sandbox.window.PartySystemsUI;
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));

async function runTests() {
  let waitTries = 0;
  while (!sandbox.window.PartyChairApp && waitTries < 40) {
    await new Promise((r) => setTimeout(r, 50));
    waitTries += 1;
  }
  const App = sandbox.window.PartyChairApp;
  assert(Boolean(App), 'PartyChairApp initialized cleanly in headless harness');

  console.log('================================================================');
  console.log(' MAS-01 PHASE 3: STRUCTURAL PARTY-SPAWNING & FOLLOW-UP ERAS SUITE');
  console.log('================================================================\n');

  // ------------------------------------------------------------------
  // SUITE 1: Base Version 0.15.9 Preservation & Phase 3 Data Catalogs
  // ------------------------------------------------------------------
  console.log('--- SUITE 1: Base Version 0.15.9 Invariants & Phase 3 Catalogs ---');
  {
    assert(pkg.version === '0.15.9', `package.json preserves base version 0.15.9 (got ${pkg.version})`);
    assert(Engine.SAVE_KEY === 'partyChairGame.save.v15.9', `SAVE_KEY preserves partyChairGame.save.v15.9 (got ${Engine.SAVE_KEY})`);
    assert(Array.isArray(PSData.PHASE3_ERA_IDS) && PSData.PHASE3_ERA_IDS.length === 8, 'PHASE3_ERA_IDS defines all 8 Phase 3 eras');
    assert(PSData.MODERATE_PARTY_DEF?.id === 'moderate' && PSData.MODERATE_PARTY_DEF?.color === '#5C9E7A', 'MODERATE_PARTY_DEF configured with id=moderate and color=#5C9E7A');
    assert(Array.isArray(PSData.MODERATE_PARTY_FACTIONS) && PSData.MODERATE_PARTY_FACTIONS.length === 4, '4 dedicated Moderate Party factions defined');
    assert(Array.isArray(PSData.REGIONAL_PARTY_CATALOG) && PSData.REGIONAL_PARTY_CATALOG.length === 6, '6 territorial regional parties defined');
    assert(Array.isArray(PSData.ECOLOGICAL_COLLAPSE_GREEN_FACTIONS) && PSData.ECOLOGICAL_COLLAPSE_GREEN_FACTIONS.length === 4, '4 dedicated Ecological Collapse Green factions defined');
    assert(Array.isArray(PSData.PLANETARY_THERMOSTAT_BLOCS) && PSData.PLANETARY_THERMOSTAT_BLOCS.length === 4, '4 Planetary Thermostat rainfall blocs defined');

    PSData.PHASE3_ERA_IDS.forEach((eraId) => {
      const meta = PSEngine.getEraMetadata(eraId);
      const plugin = PSEngine.getEraPlugin(eraId);
      assert(Boolean(meta && plugin), `Era plugin & metadata registered for ${eraId}`);
      assert(Array.isArray(meta.issueSwaps) && meta.issueSwaps.length >= 5, `${eraId} defines ${meta.issueSwaps.length} issue swaps`);
      assert(Boolean(meta.dossier?.campaignAdvisory), `${eraId} carries qualitative campaignAdvisory`);
    });
  }

  // ------------------------------------------------------------------
  // SUITE 2: Era #2 The Moderate Party (Group A · Weight = 3)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 2: Era #2 The Moderate Party (Spawning, Defection & Chair Switch) ---');
  {
    const base = Engine.createGame({ baseTemplateId: 'people' });
    const extremeGame = { ...base, winningPresidentAvgStance: 9.4 };
    const eligible = PSEngine.getEligiblePartySystems(extremeGame, 2040);
    const modCand = eligible.find((c) => c.era.id === 'era_02_moderate_party');
    assert(Boolean(modCand) && modCand.weight === 3, 'Era #2 eligible with Weight 3 when winning president stance >= 9.0');

    const era2 = PSEngine.transitionToPartySystem(extremeGame, PSData.ALL_ERAS_BY_ID.era_02_moderate_party, 2040);
    assert(PSEngine.getActiveIssuesForGame(era2).length === 41, 'Era #2 maintains strict 41-issue invariant');
    assert(era2.partySystems.eraExclusiveIssuesActive.length === 5, 'Era #2 introduces exact 5 era-exclusive issues');

    const modRival = era2.rivals.find((r) => r.id === 'moderate');
    assert(Boolean(modRival) && modRival.name === 'Moderate Party' && modRival.color === '#5C9E7A', 'Moderate Party spawned into game.rivals with #5C9E7A color');
    assert(era2.partyTiers.moderate === 5, 'Moderate Party elevated to Tier 5 Major Party');
    assert(Engine.hasBallotAccess(era2, 'moderate', 'senate:PA') === true, 'Moderate Party granted nationwide ballot access');

    const modFactionIds = ['mod_former_dems', 'mod_former_reps', 'mod_pragmatic_populists', 'mod_rhetorical_moderates'];
    modFactionIds.forEach((fid) => {
      assert(era2.factions.some((f) => f.id === fid && f.partyId === 'moderate'), `Moderate faction ${fid} spawned`);
    });

    const defectedOfficials = era2.sittingMembers.filter((m) => m.party === 'moderate');
    assert(defectedOfficials.length > 0 && era2.partySystems.moderateParty.defectedCount === defectedOfficials.length, `Mass defection moved ${defectedOfficials.length} moderate sitting officials into Moderate Party`);

    // 155M voter invariant check
    const sumVoters = era2.voterModel.states.reduce((s, st) => s + (st.representedVoters || 0), 0);
    assert(sumVoters === 155_000_000 && era2.voterModel.representedVoters === 155_000_000, `Era #2 preserves exact 155M voter scale (${sumVoters})`);
    assert((era2.voterModel.affiliations.moderate?.representedVoters || 0) > 10_000_000, `Moderate Party holds real represented voters (${era2.voterModel.affiliations.moderate.representedVoters.toLocaleString()})`);

    // Decision Modal & Chair Switch Action + Save/Reload Persistence
    const modal = era2.partySystems.modalPayload?.decisionModal;
    assert(Boolean(modal) && modal.options.some((o) => o.id === 'chair_moderate_party') && modal.options.some((o) => o.id === 'stay_current_party'), 'Era #2 decision modal exposes Defect & Chair vs. Stay options');

    const switched = Engine.takeAction(era2, 'resolve-era-decision', { decisionId: 'chair_moderate_party' });
    assert(switched.player.baseTemplateId === 'moderate' && switched.player.name === 'Moderate Party', 'Resolving chair_moderate_party switches player to chair Moderate Party');
    assert(switched.rivals.some((r) => r.id === 'people'), 'Former player party (Democratic) preserved cleanly in rivals');
    assert(switched.partySystems.pendingModal === null, 'Decision resolution clears realignment modal');

    mockLocalStorage.clear();
    Engine.saveGame(switched);
    const reloaded = Engine.loadGame();
    assert(reloaded.player.baseTemplateId === 'moderate' && reloaded.player.name === 'Moderate Party', 'Moderate Party Chair status persists cleanly across save/reload');
    assert(reloaded.partySystems.moderateParty?.active === true && reloaded.partySystems.moderateParty?.playerDefected === true, 'moderateParty state persists across save/reload');
  }

  // ------------------------------------------------------------------
  // SUITE 3: Era #3 The 6-Party System (Group B · Weight = 3)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 3: Era #3 The 6-Party System (MAGA Rename, 6-Way Split & Coalition Rule) ---');
  {
    const base = Engine.createGame({ baseTemplateId: 'people' });
    // Seed 6 distinct parties holding Senate seats
    const senSix = JSON.parse(JSON.stringify(base));
    const sixParties = ['people', 'heritage', 'liberty', 'green', 'socialist', 'constitution'];
    let assignedIdx = 0;
    senSix.sittingMembers.forEach((m) => {
      if (m.office === 'senate' && assignedIdx < sixParties.length) {
        m.party = sixParties[assignedIdx];
        m.caucus = sixParties[assignedIdx];
        assignedIdx += 1;
      }
    });

    const eligible = PSEngine.getEligiblePartySystems(senSix, 2040);
    const sixCand = eligible.find((c) => c.era.id === 'era_03_six_party_system');
    assert(Boolean(sixCand) && sixCand.weight === 3, 'Era #3 eligible with Weight 3 when >= 6 distinct parties hold U.S. Senate seats');

    const era3 = PSEngine.transitionToPartySystem(senSix, PSData.ALL_ERAS_BY_ID.era_03_six_party_system, 2040);
    assert(PSEngine.getActiveIssuesForGame(era3).length === 41, 'Era #3 maintains strict 41-issue invariant');
    assert(era3.partySystems.eraExclusiveIssuesActive.length === 7, 'Era #3 introduces exact 7 era-exclusive issues');

    // Constitution -> MAGA Party rename
    const magaRival = era3.rivals.find((r) => r.id === 'constitution');
    assert(Boolean(magaRival) && magaRival.name === 'MAGA Party', 'Constitution Party formally renamed to MAGA Party');
    assert(PSEngine.getPartyDisplayName(era3, 'constitution') === 'MAGA Party', 'getPartyDisplayName returns MAGA Party');

    // Electorate fractured ~10/10/20/20/20/20 on 155M scale
    const sumVoters = era3.voterModel.states.reduce((s, st) => s + (st.representedVoters || 0), 0);
    assert(sumVoters === 155_000_000 && era3.voterModel.representedVoters === 155_000_000, `Era #3 preserves exact 155M voter scale (${sumVoters})`);
    const aff = era3.voterModel.affiliations;
    const partisanTotal = ['people', 'heritage', 'liberty', 'green', 'socialist', 'constitution']
      .reduce((acc, pid) => acc + (aff[pid]?.representedVoters || 0), 0);
    const demPct = (aff.people.representedVoters / partisanTotal) * 100;
    const repPct = (aff.heritage.representedVoters / partisanTotal) * 100;
    const libPct = (aff.liberty.representedVoters / partisanTotal) * 100;
    const grnPct = (aff.green.representedVoters / partisanTotal) * 100;
    const socPct = (aff.socialist.representedVoters / partisanTotal) * 100;
    const magaPct = (aff.constitution.representedVoters / partisanTotal) * 100;
    assert(Math.abs(demPct - 10) < 1.5 && Math.abs(repPct - 10) < 1.5, `Dem (${demPct.toFixed(1)}%) & Rep (${repPct.toFixed(1)}%) fractured to ~10% each`);
    assert(Math.abs(libPct - 20) < 1.5 && Math.abs(grnPct - 20) < 1.5 && Math.abs(socPct - 20) < 1.5 && Math.abs(magaPct - 20) < 1.5, `Lib (${libPct.toFixed(1)}%), Green (${grnPct.toFixed(1)}%), Soc (${socPct.toFixed(1)}%), MAGA (${magaPct.toFixed(1)}%) fractured to ~20% each`);

    // Coalition majority requirement
    assert(PSEngine.isCoalitionMajorityRequired(era3) === true, 'Era #3 enforces cross-party coalition requirement');
    const hungCheck = Engine.detectHungChambers(
      era3,
      { people: 45, heritage: 45, liberty: 88, green: 87, socialist: 85, constitution: 85 },
      { people: 10, heritage: 10, liberty: 20, green: 20, socialist: 20, constitution: 20 }
    );
    assert(hungCheck.houseHung && hungCheck.senateHung && hungCheck.negotiations.length >= 2, 'Era #3 flags coalition bargaining in hung 6-party House & Senate');

    // Switch chair to MAGA Party (constitution) via decision modal & persist across save/reload
    const switchedMaga = Engine.takeAction(era3, 'resolve-era-decision', { decisionId: 'switch_party:constitution' });
    assert(switchedMaga.player.baseTemplateId === 'constitution' && switchedMaga.player.name === 'MAGA Party', 'Player can switch to chair MAGA Party via Era #3 decision');

    const switchedSoc = Engine.takeAction(switchedMaga, 'switch-chair-party', { partyId: 'socialist' });
    assert(switchedSoc.player.baseTemplateId === 'socialist', 'Player can switch to chair any of the 6 parties via switch-chair-party action');

    mockLocalStorage.clear();
    Engine.saveGame(switchedMaga);
    const reloadedMaga = Engine.loadGame();
    assert(reloadedMaga.player.name === 'MAGA Party' && reloadedMaga.partyNames.constitution === 'MAGA Party', 'MAGA Party rename & chair switch persist cleanly across save/reload');
  }

  // ------------------------------------------------------------------
  // SUITE 4: Era #10 Regional Parties Emerge (Group D · Weight = 1)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 4: Era #10 Regional Parties Emerge (6 Territorial Powerhouses) ---');
  {
    const base = Engine.createGame({ baseTemplateId: 'people' });
    const era10 = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_10_regional_parties, 2040);

    assert(PSEngine.getActiveIssuesForGame(era10).length === 41, 'Era #10 maintains strict 41-issue invariant');
    assert(era10.partySystems.eraExclusiveIssuesActive.length === 8, 'Era #10 introduces exact 8 era-exclusive issues');

    const expectedNames = [
      'Mountain Labor & Energy League',
      'Town Hall Civic Alliance',
      'Dixie Faith & Heritage Coalition',
      'Western Frontier & Public Lands League',
      'Pacific Commonwealth Party',
      'Lone Star Enterprise Alliance',
    ];
    expectedNames.forEach((name) => {
      assert(era10.rivals.some((r) => r.name === name && r.isRegional), `Regional party spawned: ${name}`);
    });

    // Verify territorial dominance in home states and negligible presence outside home region
    const txObj = sandbox.window.PartyChairData.STATES.find((s) => s.id === 'TX');
    const maObj = sandbox.window.PartyChairData.STATES.find((s) => s.id === 'MA');
    const txShares = Engine.supportByState(era10, txObj);
    const maShares = Engine.supportByState(era10, maObj);
    assert(txShares.reg_lone_star > 25 && txShares.reg_new_england < 1.0, `Lone Star Alliance dominates TX (${txShares.reg_lone_star.toFixed(1)}%) while Town Hall Alliance stays regional (${txShares.reg_new_england.toFixed(2)}%)`);
    assert(maShares.reg_new_england > 25 && maShares.reg_lone_star < 1.0, `Town Hall Civic Alliance dominates MA (${maShares.reg_new_england.toFixed(1)}%) while Lone Star stays regional (${maShares.reg_lone_star.toFixed(2)}%)`);
    assert(Engine.hasBallotAccess(era10, 'reg_lone_star', 'senate:TX') === true, 'Lone Star Alliance holds ballot access in TX');
    assert(Engine.hasBallotAccess(era10, 'reg_lone_star', 'senate:MA') === false, 'Lone Star Alliance lacks ballot access outside its home territory (MA)');

    const sumVoters = era10.voterModel.states.reduce((s, st) => s + (st.representedVoters || 0), 0);
    assert(sumVoters === 155_000_000, `Era #10 preserves exact 155M voter scale (${sumVoters})`);
  }

  // ------------------------------------------------------------------
  // SUITE 5: Era #17 Ecological Collapse (Group D · Weight = 1)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 5: Era #17 Ecological Collapse (Green Surge, 0-Cost Chapters, 3x Funds & 4 Eco Factions) ---');
  {
    const grnBase = Engine.createGame({ baseTemplateId: 'green' });
    const basePoll = Engine.nationalPoll(grnBase).player;
    const preSmallDollarGame = JSON.parse(JSON.stringify(grnBase));
    preSmallDollarGame.treasury = 10;
    const preFundRes = Engine.takeAction(preSmallDollarGame, 'fundraise', { stateId: 'PA' });
    const preRaised = preFundRes.treasury - 10;

    const era17 = PSEngine.transitionToPartySystem(grnBase, PSData.ALL_ERAS_BY_ID.era_17_ecological_collapse, 2040);
    assert(PSEngine.getActiveIssuesForGame(era17).length === 41, 'Era #17 maintains strict 41-issue invariant');
    assert(era17.partySystems.eraExclusiveIssuesActive.length === 9, 'Era #17 introduces exact 9 era-exclusive issues');

    // +25% polling lift & nationwide ballot access
    const postPoll = Engine.nationalPoll(era17).player;
    assert(postPoll > basePoll + 12, `Green Party national polling surged dramatically (${basePoll.toFixed(1)}% -> ${postPoll.toFixed(1)}%)`);
    assert(era17.partySystems.eraState.greenBaselineBoost === 25.0, 'greenBaselineBoost recorded at +25.0%');
    assert(Engine.hasBallotAccess(era17, 'green', 'senate:WY') === true && Engine.hasBallotAccess(era17, 'green', 'house:TX-1') === true, 'Green Party holds 100% automatic nationwide ballot access');

    // 3x small-dollar fundraising yield
    assert(PSEngine.dispatchEraHook(era17, 'getFundraisingModifier', 'small-dollar', { partyId: 'green' }) === 3.0, 'Era #17 grants 3.0x small-dollar fundraising modifier to Green Party');
    const era17FundTest = JSON.parse(JSON.stringify(era17));
    era17FundTest.treasury = 10;
    const postFundRes = Engine.takeAction(era17FundTest, 'fundraise', { stateId: 'PA' });
    const postRaised = postFundRes.treasury - 10;
    assert(postRaised > preRaised * 2.2, `Green small-dollar drive jumped sharply ($${preRaised.toFixed(1)}M -> $${postRaised.toFixed(1)}M)`);

    // 0-cost state chapter creation (succeeds even at $0M treasury!)
    assert(PSEngine.getChapterCostModifier(era17, 'green') === 0, 'Era #17 sets chapter cost modifier to 0 for Green Party');
    const brokeGreen = JSON.parse(JSON.stringify(era17));
    brokeGreen.treasury = 0;
    brokeGreen.actionsLeft = 5;
    const prevCaChapters = brokeGreen.stateChapters?.CA || 0;
    const afterChapter = Engine.takeAction(brokeGreen, 'chapter', { stateId: 'CA' });
    assert(afterChapter.treasury === 0 && (afterChapter.stateChapters?.CA || 0) === prevCaChapters + 1, 'Green Party opens state chapter at $0M treasury in Era #17');

    // 4 dedicated ecological factions replace legacy Green factions
    const ecoNames = ['Eco-Liberals', 'Eco-Fascists', 'Deep Ecology Vanguard', 'Industrial Adaptationists'];
    const greenFactions = era17.factions.filter((f) => f.partyId === 'green');
    assert(greenFactions.length === 4, `Green Party has exact 4 dedicated ecological factions (got ${greenFactions.length})`);
    ecoNames.forEach((nm) => {
      assert(greenFactions.some((f) => f.name === nm), `Ecological faction active: ${nm}`);
    });
    assert(!era17.factions.some((f) => f.id === 'grn_eco_socialist_vanguard' || f.id === 'grn_yimby'), 'Legacy Green factions cleanly replaced');

    const sumVoters = era17.voterModel.states.reduce((s, st) => s + (st.representedVoters || 0), 0);
    assert(sumVoters === 155_000_000, `Era #17 preserves exact 155M voter scale (${sumVoters})`);
  }

  // ------------------------------------------------------------------
  // SUITE 6: Group E Follow-Up Eras (#22, #23, #24, #25 · Weight = 5)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 6: Group E Follow-Up Eras (#22, #23, #24, #25 · Predecessors & Modifiers) ---');
  {
    const base = Engine.createGame({ baseTemplateId: 'people' });

    // --- Era #22: The Neo-Federalist Reunion (>= 35 yrs after Era #10) ---
    assert(!PSEngine.getEligiblePartySystems(base, 2080).some((c) => c.era.id === 'era_22_neo_federalist'), 'Era #22 blocked without Era #10 predecessor');
    const era10 = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_10_regional_parties, 2040);
    assert(!PSEngine.getEligiblePartySystems(era10, 2074).some((c) => c.era.id === 'era_22_neo_federalist'), 'Era #22 blocked at 34 yrs after Era #10 (< 35 yr floor)');
    const cand22 = PSEngine.getEligiblePartySystems(era10, 2075).find((c) => c.era.id === 'era_22_neo_federalist');
    assert(Boolean(cand22) && cand22.weight === 5, 'Era #22 eligible with Weight 5 at >= 35 yrs after Era #10');

    const era22 = PSEngine.transitionToPartySystem(era10, PSData.ALL_ERAS_BY_ID.era_22_neo_federalist, 2076);
    assert(PSEngine.getActiveIssuesForGame(era22).length === 41, 'Era #22 maintains strict 41-issue invariant');
    assert(PSEngine.isRegionalMergerEnabled(era22) === true, 'Era #22 unlocks cross-regional merger action');

    era22.treasury = 50;
    era22.actionsLeft = 5;
    const preTxVoters = era22.voterModel.states.find((s) => s.stateId === 'TX').affiliations.people;
    const afterMerge = Engine.takeAction(era22, 'absorb-regional-party', { regionalPartyId: 'reg_lone_star' });
    const postTxVoters = afterMerge.voterModel.states.find((s) => s.stateId === 'TX').affiliations.people;
    assert(afterMerge.partySystems.regionalParties.absorbedPartyIds.includes('reg_lone_star'), 'Era #22 cross-regional merger absorbs Lone Star Enterprise Alliance');
    assert(!afterMerge.rivals.some((r) => r.id === 'reg_lone_star'), 'Absorbed regional party removed from active rivals');
    assert(postTxVoters > preTxVoters, `Absorbing Lone Star Alliance transferred TX voters to player party (${preTxVoters} -> ${postTxVoters})`);
    assert(afterMerge.voterModel.representedVoters === 155_000_000, 'Era #22 regional merger preserves exact 155M voter scale');

    // --- Era #23: The Secular Enlightenment Revival (>= 30 yrs after Era #9) ---
    assert(!PSEngine.getEligiblePartySystems(base, 2080).some((c) => c.era.id === 'era_23_secular_enlightenment'), 'Era #23 blocked without Era #9 predecessor');
    const era9 = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_09_great_awakening, 2040);
    assert(!PSEngine.getEligiblePartySystems(era9, 2068).some((c) => c.era.id === 'era_23_secular_enlightenment'), 'Era #23 blocked at 28 yrs after Era #9 (< 30 yr floor)');
    const cand23 = PSEngine.getEligiblePartySystems(era9, 2070).find((c) => c.era.id === 'era_23_secular_enlightenment');
    assert(Boolean(cand23) && cand23.weight === 5, 'Era #23 eligible with Weight 5 at >= 30 yrs after Era #9');

    const era23 = PSEngine.transitionToPartySystem(era9, PSData.ALL_ERAS_BY_ID.era_23_secular_enlightenment, 2070);
    assert(PSEngine.getActiveIssuesForGame(era23).length === 41, 'Era #23 maintains strict 41-issue invariant');
    assert(era23.partySystems.eraState.pillar4Baseline === 3.0, 'Era #23 reverses Pillar 4 baseline from 7.0 to 3.0 (secular constitutionalism)');
    const secTurnout = PSEngine.dispatchEraHook(era23, 'getTurnoutModifier', 'people', 'PA', { pillar4Stance: 3.0 });
    const secVol = PSEngine.getVolunteerDriveMultiplier(era23, { pillar4Stance: 3.0 });
    const sectMargin = PSEngine.getCandidateMarginModifier(era23, { pillar4Stance: 8.5 }, 'PA');
    assert(secTurnout === 6.0 && secVol === 1.35 && sectMargin === -4.0, `Era #23 boosts secular turnout (+${secTurnout}%), volunteers (${secVol}x), and penalizes sectarian platforms (${sectMargin}%)`);

    // --- Era #24: The Human-Verified Backlash (>= 35 yrs after Era #15) ---
    assert(!PSEngine.getEligiblePartySystems(base, 2080).some((c) => c.era.id === 'era_24_human_verified'), 'Era #24 blocked without Era #15 predecessor');
    const era15 = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040);
    assert(!PSEngine.getEligiblePartySystems(era15, 2074).some((c) => c.era.id === 'era_24_human_verified'), 'Era #24 blocked at 34 yrs after Era #15 (< 35 yr floor)');
    const cand24 = PSEngine.getEligiblePartySystems(era15, 2075).find((c) => c.era.id === 'era_24_human_verified');
    assert(Boolean(cand24) && cand24.weight === 5, 'Era #24 eligible with Weight 5 at >= 35 yrs after Era #15');

    const era24 = PSEngine.transitionToPartySystem(era15, PSData.ALL_ERAS_BY_ID.era_24_human_verified, 2076);
    assert(PSEngine.getActiveIssuesForGame(era24).length === 41, 'Era #24 maintains strict 41-issue invariant');
    assert(PSEngine.getAnalogCampaignMultiplier(era24) === 1.75 && PSEngine.getAlgorithmicCampaignMultiplier(era24) === 0.45, 'Era #24 applies 1.75x analog multiplier & 0.45x algorithmic penalty');
    assert(PSEngine.getVolunteerDriveMultiplier(era24) === 1.60, 'Era #24 grants 1.60x human volunteer drive surge');
    assert(PSEngine.dispatchEraHook(era24, 'getFundraisingModifier', 'chapter') === 1.65 && PSEngine.dispatchEraHook(era24, 'getFundraisingModifier', 'viral') === 0.45, 'Era #24 boosts physical chapter revenue (1.65x) and penalizes viral algorithmic drives (0.45x)');

    // Verify member-tour analog surge in engine.js
    const baseTour = JSON.parse(JSON.stringify(base));
    const era24Tour = JSON.parse(JSON.stringify(era24));
    const tourMember = baseTour.sittingMembers.find((m) => m.party === 'people');
    baseTour.actionsLeft = 5;
    era24Tour.actionsLeft = 5;
    const baseTourMemGain = Engine.takeAction(baseTour, 'member-tour', { memberId: tourMember.id, stateId: 'PA' }).memberships - baseTour.memberships;
    const era24TourMemGain = Engine.takeAction(era24Tour, 'member-tour', { memberId: tourMember.id, stateId: 'PA' }).memberships - era24Tour.memberships;
    assert(era24TourMemGain > baseTourMemGain, `Era #24 in-person member tour membership gain boosted (${baseTourMemGain} -> ${era24TourMemGain})`);

    // --- Era #25: The Planetary Thermostat Era (>= 40 yrs after Era #13 OR Era #17) ---
    assert(!PSEngine.getEligiblePartySystems(base, 2090).some((c) => c.era.id === 'era_25_planetary_thermostat'), 'Era #25 blocked without Era #13 or Era #17 predecessor');
    const era13 = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_13_green_transition, 2040);
    const era17p = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_17_ecological_collapse, 2040);
    assert(!PSEngine.getEligiblePartySystems(era13, 2078).some((c) => c.era.id === 'era_25_planetary_thermostat'), 'Era #25 blocked at 38 yrs after Era #13 (< 40 yr floor)');
    const cand25From13 = PSEngine.getEligiblePartySystems(era13, 2080).find((c) => c.era.id === 'era_25_planetary_thermostat');
    const cand25From17 = PSEngine.getEligiblePartySystems(era17p, 2080).find((c) => c.era.id === 'era_25_planetary_thermostat');
    assert(Boolean(cand25From13) && cand25From13.weight === 5, 'Era #25 eligible with Weight 5 at >= 40 yrs after Era #13');
    assert(Boolean(cand25From17) && cand25From17.weight === 5, 'Era #25 eligible with Weight 5 at >= 40 yrs after Era #17');

    const era25 = PSEngine.transitionToPartySystem(era17p, PSData.ALL_ERAS_BY_ID.era_25_planetary_thermostat, 2080);
    assert(PSEngine.getActiveIssuesForGame(era25).length === 41, 'Era #25 maintains strict 41-issue invariant');
    const sal25 = PSEngine.getIssueSalienceModifiers(era25);
    assert(sal25 && Object.keys(sal25.weights).length === 8 && Object.values(sal25.weights).every((w) => w === 3.2), 'Era #25 elevates all 8 planetary weather-engineering issues to 3.2x salience');
    const azTurnout = PSEngine.dispatchEraHook(era25, 'getTurnoutModifier', 'people', 'AZ');
    assert(azTurnout >= 2.5, `Era #25 applies regional water/rainfall bloc turnout swing in AZ (+${azTurnout}%)`);
  }

  // ------------------------------------------------------------------
  // SUITE 7: UI Wiring & Qualitative Vibes Scan (GAME_STYLE_GUIDE.md)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 7: UI Controls & Qualitative Vibes Scan ---');
  {
    const forbiddenPatterns = [/REQ-\d+/i, /MAS-\d+/i, /Weight\s*=\s*\d/i, /1\.55M/i];
    const base = Engine.createGame({ baseTemplateId: 'people' });

    PSData.PHASE3_ERA_IDS.forEach((eraId) => {
      const meta = PSEngine.getEraMetadata(eraId);
      const transitioned = PSEngine.transitionToPartySystem(base, meta, 2044);
      App.setGame(transitioned);
      const combinedUiText = [
        meta.title,
        meta.catalyst,
        ...(meta.chronicle || []),
        meta.dossier?.faultLines || '',
        meta.dossier?.legislativeMood || '',
        meta.dossier?.culturalVibe || '',
        meta.dossier?.campaignAdvisory || '',
        PSUI.renderRealignmentModal(transitioned),
        PSUI.renderEraDossierModal(transitioned),
        App.activeEraFeedbackBannerMarkup(),
      ].join('\n');

      forbiddenPatterns.forEach((rx) => {
        assert(!rx.test(combinedUiText), `${eraId}: zero forbidden technical leaks matching ${rx}`);
      });
    });

    // Verify Era #2 realignment modal renders [data-era-decision]
    const era2Ui = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_02_moderate_party, 2040);
    const modal2Html = PSUI.renderRealignmentModal(era2Ui);
    assert(modal2Html.includes('data-era-decision="chair_moderate_party"'), 'Era #2 realignment modal renders data-era-decision="chair_moderate_party" button');

    // Verify Era #3 renders 6-Party Chair Switcher including MAGA Party
    const era3Ui = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_03_six_party_system, 2040);
    App.setGame(era3Ui);
    const switcherHtml = App.eraChairSwitcherMarkup();
    assert(switcherHtml.includes('data-switch-chair-party="constitution"') && switcherHtml.includes('MAGA Party'), 'Era #3 Chair Switcher renders MAGA Party switch button');

    // Verify Era #10 renders Regional Party territorial badge on Texas state card
    const era10Ui = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_10_regional_parties, 2040);
    App.setGame(era10Ui);
    const txBadge = App.getStateElectoralBadgesMarkup('TX');
    assert(txBadge.includes('Lone Star Enterprise Alliance'), 'Era #10 renders Lone Star Enterprise Alliance territorial badge on TX');

    // Verify Era #17 renders Free ($0M) chapter creation for Green Party
    const grnStart = Engine.createGame({ baseTemplateId: 'green' });
    const era17Ui = PSEngine.transitionToPartySystem(grnStart, PSData.ALL_ERAS_BY_ID.era_17_ecological_collapse, 2040);
    App.setGame(era17Ui);
    const step5Html = App.step4WorkMarkup();
    assert(step5Html.includes('Free ($0M)'), 'Era #17 displays Free ($0M) state chapter cost for Green Party');

    // Verify Era #22 renders Cross-Regional Merger controls
    const era22Ui = PSEngine.transitionToPartySystem(era10Ui, PSData.ALL_ERAS_BY_ID.era_22_neo_federalist, 2076);
    App.setGame(era22Ui);
    const mergerHtml = App.eraRegionalMergerMarkup();
    assert(mergerHtml.includes('data-absorb-regional-party="reg_lone_star"'), 'Era #22 renders cross-regional merger controls for regional powerhouses');
  }

  console.log('\n================================================================');
  console.log(` ALL MAS-01 PHASE 3 CHECKS PASSED: ${passed}/${total} (100%)`);
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ MAS-01 PHASE 3 SUITE FAILED:\n', err);
  process.exit(1);
});
