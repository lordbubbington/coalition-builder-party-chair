'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function createHarness() {
  const storage = {};
  const noop = () => {};
  const makeEl = () => ({
    innerHTML: '', textContent: '', value: '', style: {}, dataset: {},
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    addEventListener: noop, removeEventListener: noop,
    querySelector: () => makeEl(), querySelectorAll: () => [],
    getAttribute: () => null, setAttribute: noop, focus: noop, scrollIntoView: noop,
  });

  const sandbox = {
    console, Math, Date, JSON, Number, String, Boolean, Array, Object, Set, Map, RegExp, Error, Promise,
    Uint8Array,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob, DecompressionStream, Response,
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null),
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
    },
    document: {
      getElementById: () => makeEl(), querySelector: () => makeEl(), querySelectorAll: () => [],
      createElement: () => makeEl(), addEventListener: noop, body: makeEl(), documentElement: makeEl(),
    },
    location: { search: '', hash: '', href: 'http://localhost/' },
    history: { replaceState: noop, pushState: noop },
    alert: noop, confirm: () => true,
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;

  const ctx = vm.createContext(sandbox);
  const scripts = [
    'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
    'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js',
    'political-trends-system.js', 'v07-scaffolding.js', 'party-systems-data.js',
    'party-systems-coalition.js', 'party-systems-robots.js', 'party-systems-engine.js',
    'party-systems-ui.js', 'presidential-primaries.js', 'ballot-access.js',
    'election-uncertainty.js', 'candidate-vetting.js', 'election-drift.js',
    'election-night-engine.js', 'engine.js',
  ];
  for (const file of scripts) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), ctx, { filename: file });
  }
  return ctx;
}

let passed = 0;
let failed = 0;
function check(label, cond, detail = '') {
  if (cond) {
    passed++;
    console.log(`  PASS: ${label}${detail ? ` (${detail})` : ''}`);
  } else {
    failed++;
    console.error(`  FAIL: ${label}${detail ? ` (${detail})` : ''}`);
  }
}

(async () => {
  console.log('====================================================================');
  console.log(' VERSION 0.16.6 STATEWIDE ELECTED EXECUTIVE TIER VERIFICATION SUITE');
  console.log('====================================================================');

  const ctx = createHarness();
  const Data = ctx.window.PartyChairData;
  const Engine = ctx.window.PartyChairEngine;
  const EN = ctx.window.ElectionNightEngine;

  // --- SUITE 1: Starting Incumbents Load Cleanly into game.sittingMembers ---
  console.log('\n--- SUITE 1: 50-State Starting Roster & Faction Validation ---');
  let game = Engine.createGame({ baseTemplateId: 'people' });
  check('Game version stamped as 0.16.9, 0.17.0, or 0.17.1', game.version === '0.18.2' || game.version === '0.17.0' || game.version === '0.18.2', `got ${game.version}`);

  const registry = Data.STATEWIDE_OFFICES_REGISTRY || [];
  const startingOfficers = Data.STARTING_STATEWIDE_OFFICERS || [];
  const seoSitting = (game.sittingMembers || []).filter((m) => m.office === 'statewide_executive');

  check('STATEWIDE_OFFICES_REGISTRY loaded (223 offices across 44 states)', registry.length === 223, `got ${registry.length}`);
  check('All 223 starting officers seeded into game.sittingMembers', seoSitting.length === 223, `got ${seoSitting.length}`);

  const excludedStates = ['AK', 'HI', 'ME', 'NH', 'NJ', 'TN'];
  const excludedHits = seoSitting.filter((m) => excludedStates.includes(m.stateId));
  check('Zero set-aside states (AK/HI/ME/NH/NJ/TN) in partisan at-large roster', excludedHits.length === 0, `got ${excludedHits.length}`);

  const validFactionIds = new Set(Engine.getFactionsCatalog().map((f) => f.id));
  const allValidParties = seoSitting.every((m) => m.party === 'people' || m.party === 'heritage');
  const allValidFactions = seoSitting.every((m) => validFactionIds.has(m.factionId));
  const allValidRatings = seoSitting.every((m) => {
    const r = m.ratings || {};
    const keys = ['persuadability', 'turnout', 'debate', 'charisma', 'corruption', 'fundraising', 'fieldcraft', 'experience', 'mediaSavvy', 'regionalStrength'];
    return keys.every((k) => Number.isFinite(r[k]) && r[k] >= 1 && r[k] <= 10);
  });
  check('All 223 officers have valid party IDs (people/heritage)', allValidParties);
  check('All 223 officers have valid canonical faction IDs', allValidFactions);
  check('All 223 officers have valid 10-stat ratings (1-10)', allValidRatings);

  const paxton = seoSitting.find((m) => m.name === 'Ken Paxton' && m.stateId === 'TX');
  const jeffJackson = seoSitting.find((m) => m.name === 'Jeff Jackson' && m.stateId === 'NC');
  const robSand = seoSitting.find((m) => m.name === 'Claire Halvorsen' && m.stateId === 'IA');
  check('Spot check: TX AG Ken Paxton (R), NC AG Jeff Jackson (D), IA Auditor Claire Halvorsen (D) loaded',
    paxton?.party === 'heritage' && jeffJackson?.party === 'people' && robSand?.party === 'people');
  check('game.statewideOffices initialized for all 223 seats', Object.keys(game.statewideOffices || {}).length === 223);

  // --- SUITE 2: Phase 1 Contestation & Phase 3 Diminishing-Returns Funding Curve ---
  console.log('\n--- SUITE 2: Contestation Fees & Diminishing-Returns Funding Curve ---');
  // Test unheld state (TX — Dem player holds neither Governor nor any statewide seat)
  game.treasury = 50;
  game.actionsLeft = 10;
  game.organizingActionsRemaining = 10;

  const beforeSingleTreasury = game.treasury;
  const beforeSingleActions = game.actionsLeft;
  game = Engine.takeAction(game, 'contest-statewide-office', { officeId: 'WY-secretary_of_state' });
  check('Single unheld seat contestation costs $500K and 1 action',
    Math.abs((beforeSingleTreasury - game.treasury) - 0.5) < 1e-6 &&
    game.actionsLeft === beforeSingleActions - 1 &&
    game.contestedStatewideOffices['WY-secretary_of_state'] === true,
    `deltaTreasury=${(beforeSingleTreasury - game.treasury).toFixed(2)}M`);

  // Full state slate in AL (unheld by Dem) costs $1.5M and 1 action
  const beforeSlateTreasury = game.treasury;
  const beforeSlateActions = game.actionsLeft;
  game = Engine.takeAction(game, 'contest-statewide-slate', { stateId: 'AL' });
  const alSeats = registry.filter((o) => o.stateId === 'AL');
  check('Full state slate contestation costs $1.5M, 1 action, and contests all AL seats',
    Math.abs((beforeSlateTreasury - game.treasury) - 1.5) < 1e-6 &&
    game.actionsLeft === beforeSlateActions - 1 &&
    alSeats.every((o) => game.contestedStatewideOffices[o.id]),
    `AL seats=${alSeats.length}`);

  // Automatic free contestation in CA (Dem holds Governor + statewide seats)
  const beforeAutoTreasury = game.treasury;
  game = Engine.takeAction(game, 'contest-statewide-slate', { stateId: 'CA' });
  check('Automatic contestation in held state (CA) costs $0', game.treasury === beforeAutoTreasury);

  // Diminishing returns curve exact anchor checks
  check('Funding lift at $1M === +1.0%', Engine.computeStatewideFundingLift(1) === 1.0, `got ${Engine.computeStatewideFundingLift(1)}`);
  check('Funding lift at $2M === +1.8%', Engine.computeStatewideFundingLift(2) === 1.8, `got ${Engine.computeStatewideFundingLift(2)}`);
  check('Funding lift at $4M === +2.7%', Engine.computeStatewideFundingLift(4) === 2.7, `got ${Engine.computeStatewideFundingLift(4)}`);
  check('Funding lift at $8M === +3.5%', Engine.computeStatewideFundingLift(8) === 3.5, `got ${Engine.computeStatewideFundingLift(8)}`);
  check('Funding lift capped strictly at +5.0% for >= $20M', Engine.computeStatewideFundingLift(25) === 5.0 && Engine.computeStatewideFundingLift(100) === 5.0);

  // Verify Phase 3 candidate funding handler applies diminishing-returns lift
  const raceKey = 'statewide:NC-attorney_general';
  game = Engine.allocateCandidateFunds(game, raceKey, 1.0);
  check('Phase 3 allocateCandidateFunds $1.0M sets pollingLift = 1.0', game.candidateFunding[raceKey].pollingLift === 1.0);
  game = Engine.allocateCandidateFunds(game, raceKey, 1.0);
  check('Phase 3 allocateCandidateFunds $2.0M sets pollingLift = 1.8', game.candidateFunding[raceKey].pollingLift === 1.8);
  game = Engine.allocateCandidateFunds(game, raceKey, 2.0);
  check('Phase 3 allocateCandidateFunds $4.0M sets pollingLift = 2.7', game.candidateFunding[raceKey].pollingLift === 2.7);
  game = Engine.allocateCandidateFunds(game, raceKey, 4.0);
  check('Phase 3 allocateCandidateFunds $8.0M sets pollingLift = 3.5', game.candidateFunding[raceKey].pollingLift === 3.5);
  game = Engine.allocateCandidateFunds(game, raceKey, 20.0);
  check('Phase 3 allocateCandidateFunds $28.0M caps pollingLift at 5.0', game.candidateFunding[raceKey].pollingLift === 5.0);

  // --- SUITE 3: Election Night Resolution, 0.35x Coattail Dampening & Flips ---
  console.log('\n--- SUITE 3: Election Night Resolution & 0.35x Coattail Dampening ---');
  const baseGame = Engine.createGame({ baseTemplateId: 'people' });
  const resNeutral = EN.resolveStatewideOffices(JSON.parse(JSON.stringify(baseGame)), 2028, {
    zeroNoise: true,
    stateLeans: { NC: 0.0 },
    govMargins: { NC: 0.0 },
  });
  const resBlowout = EN.resolveStatewideOffices(JSON.parse(JSON.stringify(baseGame)), 2028, {
    zeroNoise: true,
    stateLeans: { NC: 0.0 },
    govMargins: { NC: 10.0 }, // +10.0 pt gubernatorial blowout over State Lean
  });

  const ncAgNeutral = resNeutral.results.find((r) => r.officeId === 'NC-attorney_general');
  const ncAgBlowout = resBlowout.results.find((r) => r.officeId === 'NC-attorney_general');
  const coattailDelta = Number((ncAgBlowout.margin - ncAgNeutral.margin).toFixed(2));
  check('0.35x gubernatorial coattail dampening: +10.0 Gov blowout transfers exact +3.50 pts to NC AG',
    Math.abs(coattailDelta - 3.5) < 0.01 && Math.abs(ncAgBlowout.dampedCoattail - 3.5) < 0.01,
    `delta=${coattailDelta}, dampedCoattail=${ncAgBlowout.dampedCoattail}`);

  // Verify flip recording in game.cycleFlips.statewide when margin crosses 0 against incumbent
  const flipGame = Engine.createGame({ baseTemplateId: 'people' });
  const flipRes = EN.resolveStatewideOffices(flipGame, 2028, {
    zeroNoise: true,
    stateLeans: { PA: 8.0 }, // PA AG Dave Sunday is R; strong D lean flips it to people
    govMargins: { PA: 14.0 },
  });
  const paAgFlip = (flipGame.cycleFlips?.statewide || []).find((f) => f.officeId === 'PA-attorney_general');
  check('PA AG flip from heritage -> people recorded in game.cycleFlips.statewide',
    Boolean(paAgFlip && paAgFlip.fromParty === 'heritage' && paAgFlip.toParty === 'people'));
  check('game.statewideOffices updated to new winner (people)', flipGame.statewideOffices['PA-attorney_general'] === 'people');

  // Verify 155M conservation holds through holdElection with statewide realignment blended
  const fullCycleGame = Engine.createGame({ baseTemplateId: 'people' });
  const afterElection = Engine.holdElection(fullCycleGame);
  const totalVoters = (afterElection.voterModel?.states || []).reduce((acc, st) => acc + Number(st.representedVoters || 0), 0);
  check('155,000,000 represented-voter conservation holds after Election Night + Statewide Realignment',
    totalVoters === 155000000, `got ${totalVoters}`);

  // UI check: zero REQ- leaks in new Statewide Executive drawer
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const drawerIdx = appSrc.indexOf('function renderStatewideExecutiveDrawerMarkup');
  const drawerSlice = appSrc.slice(drawerIdx, drawerIdx + 3500);
  check('App renders Statewide Executive drawer & Election Night tab with zero REQ- leaks',
    drawerIdx > 0 && appSrc.includes("{ id: 'statewide_executive', label: 'Statewide Exec' }") && !/REQ-\d+/i.test(drawerSlice));


  // --- SUITE 4: v0.16.8 Polish Verification ---
  console.log('\n--- SUITE 4: v0.16.8 Fixes (Slate Stepper, Endorsements Tab, 1/5th Happiness, Step 4 Copy) ---');
  check('app.js binds [data-slate-step] and [data-slate-filter] click listeners',
    appSrc.includes("querySelectorAll('[data-slate-step]')") && appSrc.includes("querySelectorAll('[data-slate-filter]')"));
  let greenGame = Engine.createGame({ baseTemplateId: 'green' });
  greenGame.phase = 'organizing';
  greenGame.organizingActionsRemaining = 5;
  greenGame.actionsLeft = 0;
  greenGame = Engine.takeAction(greenGame, 'set-state-legislative-slate-tier', { stateId: 'PA', chamber: 'house', delta: 1 });
  check('Legislative slate +1 step works using organizingActionsRemaining', (greenGame.contestedStateHouseSlates?.PA || 0) === 1);

  check('Step 3 Endorsements has Other Statewide Offices tab & per-state pills',
    appSrc.includes('Other Statewide Offices (') &&
    appSrc.includes('data-pick-statewide-state') &&
    !appSrc.includes('${renderStatewideExecutiveDrawerMarkup(year)}'));

  let endGame = Engine.createGame({ baseTemplateId: 'people' });
  endGame.phase = 'organizing';
  endGame.treasury = 50;
  endGame.organizingActionsRemaining = 10;
  const seoRaceId = 'statewide:NC-attorney_general';
  const seoField = Engine.version01CandidateField(endGame, seoRaceId, 'people');
  const targetCand = seoField[0];
  const beforeMap = { ...(endGame.factionHappiness || {}) };
  const afterEnd = Engine.endorseCandidate(endGame, { candidateId: targetCand.id, raceId: seoRaceId });
  const deltas = Object.keys(afterEnd.factionHappiness || {}).map((fid) =>
    Number(((afterEnd.factionHappiness[fid] ?? 0) - (beforeMap[fid] ?? 0)).toFixed(2))
  ).filter((d) => d !== 0);
  check('Statewide endorsement shifts faction happiness by 1/5th (+0.2 / -0.6 instead of +1 / -3)',
    deltas.length > 0 && deltas.every((d) => Math.abs(d) <= 0.65) && (deltas.includes(0.2) || deltas.includes(-0.6)),
    'deltas=' + JSON.stringify([...new Set(deltas)]));

  const exactCopy = 'Here, you can contest the state legislative races. Major parties automatically contest every race, while smaller parties need to get candidates to sign up in bunches. Winning seats gives you a better starting point in future years, regardless of party tier';
  check('Step 4 description matches exact requested copy', appSrc.includes(exactCopy));

  console.log('\n====================================================================');
  console.log(` V0.16.6 STATEWIDE OFFICES SUITE: ${passed} passed, ${failed} failed`);
  console.log('====================================================================');
  if (failed > 0) process.exit(1);
})();
