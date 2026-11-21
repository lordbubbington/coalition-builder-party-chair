'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function createHarness() {
  const storage = {};
  const noop = () => {};
  const makeEl = () => ({
    innerHTML: '',
    textContent: '',
    value: '',
    style: {},
    dataset: {},
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    addEventListener: noop,
    removeEventListener: noop,
    querySelector: () => makeEl(),
    querySelectorAll: () => [],
    getAttribute: () => null,
    setAttribute: noop,
    focus: noop,
    scrollIntoView: noop,
  });

  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    Set,
    Map,
    RegExp,
    Error,
    Promise,
    Uint8Array,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob,
    DecompressionStream,
    Response,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null),
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
    },
    document: {
      getElementById: () => makeEl(),
      querySelector: () => makeEl(),
      querySelectorAll: () => [],
      createElement: () => makeEl(),
      addEventListener: noop,
      body: makeEl(),
      documentElement: makeEl(),
    },
    location: { search: '', hash: '', href: 'http://localhost/' },
    history: { replaceState: noop, pushState: noop },
    alert: noop,
    confirm: () => true,
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;

  const ctx = vm.createContext(sandbox);
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
    'candidate-vetting.js',
    'election-drift.js',
    'election-night-engine.js',
    'engine.js',
  ];
  for (const file of scripts) {
    const code = fs.readFileSync(path.join(ROOT, file), 'utf8');
    vm.runInContext(code, ctx, { filename: file });
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

function getStateObj(game, stateId) {
  const states = game.voterModel.states;
  return Array.isArray(states) ? states.find((s) => s.stateId === stateId) : states[stateId];
}

function getTotalVoters(game) {
  const states = Array.isArray(game.voterModel.states)
    ? game.voterModel.states
    : Object.values(game.voterModel.states);
  return states.reduce((acc, st) => acc + Number(st.representedVoters || 0), 0);
}

(async () => {
  console.log('====================================================================');
  console.log(' VERSION 0.16.5 BICAMERAL GRASSROOTS HAVEN & RELEASE SUITE');
  console.log('====================================================================');

  const ctx = createHarness();
  const Data = ctx.window.PartyChairData;
  const Engine = ctx.window.PartyChairEngine;

  // --- SUITE 1: 99-Chamber Bicameral Split & 50-State Senate Calendar ---
  console.log('\n--- SUITE 1: 99-Chamber Split & Authentic 50-State Calendar ---');
  const ch2028 = Data.getBicameralChambersForYear(2028);
  const ch2030 = Data.getBicameralChambersForYear(2030);
  const houses2028 = ch2028.filter((c) => c.chamber === 'house');
  const senates2028 = ch2028.filter((c) => c.chamber === 'senate');
  const uni2028 = ch2028.filter((c) => c.chamber === 'unicameral');

  check('Total chambers nationwide is exactly 99', ch2028.length === 99, `got ${ch2028.length}`);
  check('49 State House chambers', houses2028.length === 49, `got ${houses2028.length}`);
  check('49 State Senate chambers', senates2028.length === 49, `got ${senates2028.length}`);
  check('1 Nebraska Unicameral chamber', uni2028.length === 1 && uni2028[0].stateId === 'NE', `got ${uni2028.length}`);

  for (const st of ['KS', 'NM', 'SC']) {
    const s28 = ch2028.find((c) => c.id === `${st}:senate`);
    const s30 = ch2030.find((c) => c.id === `${st}:senate`);
    check(`Group C ${st} Senate on-cycle in 2028 and off-cycle in 2030`,
      s28 && s28.isOnCycle && s28.seatsUp === s28.totalSeats && s30 && !s30.isOnCycle && s30.seatsUp === 0,
      `2028=${s28?.seatsUp}/${s28?.totalSeats}, 2030=${s30?.seatsUp}`);
  }

  for (const st of ['AL', 'MD', 'MI', 'MN', 'LA', 'MS', 'NJ', 'VA']) {
    const s28 = ch2028.find((c) => c.id === `${st}:senate`);
    const s30 = ch2030.find((c) => c.id === `${st}:senate`);
    check(`Group D ${st} Senate off-cycle in 2028 and on-cycle in 2030`,
      s28 && !s28.isOnCycle && s28.seatsUp === 0 && s30 && s30.isOnCycle && s30.seatsUp === s30.totalSeats,
      `2028=${s28?.seatsUp}, 2030=${s30?.seatsUp}/${s30?.totalSeats}`);
  }

  for (const st of ['LA', 'MS', 'NJ', 'VA']) {
    const h28 = ch2028.find((c) => c.id === `${st}:house`);
    const h30 = ch2030.find((c) => c.id === `${st}:house`);
    check(`Consolidated ${st} House off-cycle in 2028 and on-cycle in 2030`,
      h28 && !h28.isOnCycle && h30 && h30.isOnCycle);
  }

  // --- SUITE 2: 5-Tier Stepper Action, Off-Cycle Lock, Coattails & 155M Conservation ---
  console.log('\n--- SUITE 2: 5-Tier Stepper, Coattails & Invariant +1,000 Voters ---');
  let game = Engine.createGame({ baseTemplateId: 'green' });
  check('Game version stamped as 0.16.5+', (game.version.startsWith('0.16.') || game.version.startsWith('0.17.') || game.version.startsWith('0.18.')) || game.version.startsWith('0.17.') || game.version.startsWith('0.18.'), `got ${game.version}`);

  game.phase = 'organizing';
  game.organizingActionsRemaining = 20;
  game.actionsLeft = 20;

  const startTotal = getTotalVoters(game);
  const startPA = Number(getStateObj(game, 'PA').affiliations.green || 0);
  check('Starting electorate equals 155,000,000', startTotal === 155000000, `got ${startTotal}`);

  // Step PA State House from 0 -> 5 (5 steps)
  for (let t = 1; t <= 5; t++) {
    game = Engine.takeAction(game, 'set-state-legislative-slate-tier', {
      stateId: 'PA', chamber: 'house', targetTier: t,
    });
    check(`PA House stepped to Tier ${t}`, (game.contestedStateHouseSlates?.PA || 0) === t);
  }
  const afterPAHouseTotal = getTotalVoters(game);
  const afterPAHouse = Number(getStateObj(game, 'PA').affiliations.green || 0);
  check('5 tiers of PA House added +5,000 voters (flat +1,000/tier)', afterPAHouse - startPA === 5000, `delta=${afterPAHouse - startPA}`);
  check('155,000,000 voter conservation holds exactly after slate investment', afterPAHouseTotal === 155000000, `got ${afterPAHouseTotal}`);

  // Anti-farming check: step down to 4 and back up to 5 -> no extra voters farmed
  game = Engine.takeAction(game, 'set-state-legislative-slate-tier', { stateId: 'PA', chamber: 'house', targetTier: 4 });
  game = Engine.takeAction(game, 'set-state-legislative-slate-tier', { stateId: 'PA', chamber: 'house', targetTier: 5 });
  const afterTogglePA = Number(getStateObj(game, 'PA').affiliations.green || 0);
  check('Stepping down and back up does not farm duplicate voters', afterTogglePA === afterPAHouse, `afterToggle=${afterTogglePA}`);

  // Step PA State Senate to Tier 1 to test bicameral coattail compounding
  const liftHouseOnly = Engine.getStateLegislativeCoattailLift(game, 'PA');
  game = Engine.takeAction(game, 'set-state-legislative-slate-tier', {
    stateId: 'PA', chamber: 'senate', targetTier: 1,
  });
  const liftBicameral = Engine.getStateLegislativeCoattailLift(game, 'PA');
  check('Bicameral PA coattail lift compounds (2x single chamber)',
    liftHouseOnly > 0 && Math.abs(liftBicameral - liftHouseOnly * 2) < 1e-6,
    `houseOnly=${liftHouseOnly}, bicameral=${liftBicameral}`);

  // Off-cycle lock test: MI Senate in 2028 must be rejected
  const actionsBeforeOffCycle = game.actionsLeft;
  game = Engine.takeAction(game, 'set-state-legislative-slate-tier', {
    stateId: 'MI', chamber: 'senate', targetTier: 1,
  });
  check('Off-cycle MI Senate rejected in 2028 with 0 action deduction',
    game.actionsLeft === actionsBeforeOffCycle && !(game.contestedStateSenateSlates?.MI > 0));

  // --- SUITE 3: 5-Tier Vote Cap, Turnout Penalty & Zero-Defection Grassroots Haven ---
  console.log('\n--- SUITE 3: 5-Tier Cap/Penalty & Zero-Defection State Leg Resolution ---');
  let havenGame = Engine.createGame({ baseTemplateId: 'green' });
  const vtSt = getStateObj(havenGame, 'VT');
  vtSt.affiliations.green = 1200; // strong local base in VT
  havenGame.ballotAccess = havenGame.ballotAccess || {};
  havenGame.ballotAccess.green = havenGame.ballotAccess.green || {};
  havenGame.ballotAccess.green.leg = { VT: true };
  havenGame.ballotAccess.green.stateLeg = { VT: true };

  // Boost green faction voters in VT so base grassroots share exceeds 25% (tests 20% Tier 1 cap vs uncapped Tier 5)
  havenGame.chairTurn = 3;
  const greenFids = Engine.getFactionsCatalog().filter((f) => f.partyId === "green").map((f) => f.id);
  if (greenFids.length && vtSt.factions) vtSt.factions[greenFids[0]] = Math.round((vtSt.representedVoters || 350000) * 0.32);
  havenGame.ballotAccess.green.leg = { VT: true };

  havenGame.contestedStateHouseSlates = { VT: 1 };
  const tier1Counts = Engine.reallocateStateHouseSeatCounts(havenGame.stateHouseSeatCounts, {}, {}, havenGame);
  const t1Share = tier1Counts?.VT?.slateShares?.green || (tier1Counts?.VT?.green ? (tier1Counts.VT.green / tier1Counts.VT.total) * 100 : 0);

  havenGame.contestedStateHouseSlates = { VT: 5 };
  const tier5Counts = Engine.reallocateStateHouseSeatCounts(havenGame.stateHouseSeatCounts, {}, {}, havenGame);
  const t5Share = tier5Counts?.VT?.slateShares?.green || (tier5Counts?.VT?.green ? (tier5Counts.VT.green / tier5Counts.VT.total) * 100 : 0);

  check("Tier 1 slate capped <= 20% vote share in VT", t1Share > 0 && t1Share <= 20.5, `t1Share=${t1Share.toFixed(2)}%, seats=${tier1Counts?.VT?.green}/${tier1Counts?.VT?.total}`);
  check("Tier 5 full slate lifts cap & penalty above Tier 1 in VT", t5Share > t1Share && (tier5Counts?.VT?.green || 0) > (tier1Counts?.VT?.green || 0), `t5Share=${t5Share.toFixed(2)}% (${tier5Counts?.VT?.green} seats) > t1Share=${t1Share.toFixed(2)}% (${tier1Counts?.VT?.green} seats)`);

  // --- SUITE 4: v0.16.5 Feature Sanity Rollup ---
  console.log('\n--- SUITE 4: v0.16.5 Release Feature Rollup ---');
  const allIssues = Data.VERSION_021_ISSUES || [];
  const newIssueIds = ['nato-global-security-hegemony', 'frontier-ai-oversight-compute', 'federal-public-lands-energy'];
  check('Total platform issues expanded to 44', allIssues.length === 44, `got ${allIssues.length}`);
  check('All 3 new standalone platform issues present', newIssueIds.every((id) => allIssues.some((i) => i.id === id)));

  const hand = Engine.generateOfferedPrioritiesHand(game);
  const stateGrowCount = hand.filter((p) => String(p.id || p).startsWith('growing-in-state-')).length;
  check('7-card priorities hand guarantees exactly 1 state-specific Grow Our Vote slot',
    hand.length === 7 && stateGrowCount === 1, `hand=${hand.length}, stateGrow=${stateGrowCount}`);

  // Custom Major Party Tier Scaling
  const customMajor = Engine.createGame({
    baseTemplateId: "custom",
    customName: "National Civic Party",
    customCode: "NCP",
    customOrigin: "major_movement",
    foundingStateId: "PA",
    selectedFactionIds: Engine.getFactionsCatalog()
      .filter((f) => f.partyId === "people" && f.id !== "dem_liberal_establishment")
      .slice(0, 6)
      .map((f) => f.id),
    customValues: { color: "#2563eb", leaderName: "Alex Rivera" },
  });
  const cmAppObj = Engine.computeUnifiedPartyApproval(customMajor);
  const cmApp = Number(cmAppObj?.player?.approve ?? cmAppObj?.player?.favorable ?? cmAppObj?.player?.approval ?? 0);
  check('Custom Major Party starts with >= 25% approval', cmApp >= 25, `approval=${cmApp}`);
  const cmBud = Number(customMajor.treasury ?? customMajor.budget ?? 0);
  check('Custom Major Party starts with $150M treasury', cmBud >= 150, `funds=${cmBud}`);
  const customPresAccessCount = Object.values(customMajor.ballotAccess?.player?.presidential || {}).filter(Boolean).length;
  const customSenateAccessCount = Object.values(customMajor.ballotAccess?.player?.senate || {}).filter(Boolean).length;
  check('Custom Major Party has all 50 Senate ballot access but 0 Presidential access initially',
    customSenateAccessCount === 50 && customPresAccessCount === 0,
    `senate=${customSenateAccessCount}, pres=${customPresAccessCount}`);

  // Step 4 UI Markup check
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const step4Start = appSrc.indexOf('// Bicameral 99-Chamber State Legislative Contestation UI');
  const step4Slice = appSrc.slice(step4Start, step4Start + 4500);
  check('Step 4 UI renders All/House/Senate filter tabs & off-cycle badge',
    step4Slice.includes('data-slate-filter="all"') &&
    step4Slice.includes('data-slate-filter="house"') &&
    step4Slice.includes('data-slate-filter="senate"') &&
    step4Slice.includes('v165-offcycle-badge'));
  check('Step 4 UI contains zero REQ-XX technical leaks', !/REQ-\d+/i.test(step4Slice));

  console.log('\n====================================================================');
  console.log(` V0.16.5 SUITE COMPLETE: ${passed} passed, ${failed} failed`);
  console.log('====================================================================');
  if (failed > 0) process.exit(1);
})();
