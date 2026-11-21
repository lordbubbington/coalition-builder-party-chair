
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0;
let total = 0;
function assert(cond, msg) {
  total++;
  if (!cond) {
    console.error('  FAIL:', msg);
    throw new Error('Assertion failed: ' + msg);
  }
  passed++;
  console.log('  PASS:', msg);
}

function createEnv(includeApp = false) {
  const storage = {};
  const dummyEl = () => ({
    innerHTML: '', textContent: '', value: '', style: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    addEventListener(){}, querySelector(){ return null; }, querySelectorAll(){ return []; },
    closest(){ return null; }, focus(){}, setAttribute(){}, getAttribute(){ return null; }, dataset: {},
  });
  const doc = {
    getElementById: () => dummyEl(),
    querySelector: () => dummyEl(),
    querySelectorAll: () => [],
    createElement: () => dummyEl(),
    body: dummyEl(),
    documentElement: { style: { setProperty(){} }, dataset: {} },
    addEventListener(){},
  };
  const sandbox = {
    window: { PartyChairData: {}, addEventListener(){}, location: { reload(){} }, innerWidth: 1440 },
    document: doc,
    localStorage: { getItem: (k) => storage[k] ?? null, setItem: (k, v) => { storage[k] = String(v); }, removeItem: (k) => { delete storage[k]; } },
    Uint8Array, atob: (s) => Buffer.from(s, 'base64').toString('binary'), btoa: (s) => Buffer.from(s, 'binary').toString('base64'), Blob: globalThis.Blob, DecompressionStream: globalThis.DecompressionStream, Response: globalThis.Response, console, Math, JSON, Number, String, Array, Object, Infinity, parseInt, parseFloat, isNaN, isFinite, Date, Set, Map, RegExp, Error,
    setTimeout: () => 0, clearTimeout: () => {}, requestAnimationFrame: () => 0,
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.document = doc;
  sandbox.window.localStorage = sandbox.localStorage;
  sandbox.global = sandbox;
  const ctx = vm.createContext(sandbox);
  const scripts = [
    'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
    'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js', 'political-trends-system.js',
    'v07-scaffolding.js', 'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js',
    'party-systems-engine.js', 'party-systems-ui.js', 'presidential-primaries.js', 'ballot-access.js',
    'election-uncertainty.js', 'candidate-vetting.js', 'election-drift.js', 'election-night-engine.js',
    'engine.js',
  ];
  if (includeApp) scripts.push('app.js');
  for (const rel of scripts) {
    const code = fs.readFileSync(path.resolve(__dirname, '..', rel), 'utf8');
    vm.runInContext(code, ctx, { filename: rel });
  }
  return {
    ctx,
    window: sandbox.window,
    Data: sandbox.window.PartyChairData,
    V07: sandbox.window.PartyChairV07,
    Engine: sandbox.window.PartyChairEngine,
    Ballot: sandbox.window.BallotAccess,
    Primaries: sandbox.window.PresidentialPrimaries,
    Coalition: sandbox.window.PartySystemsCoalition,
    App: sandbox.window.PartyChairApp || sandbox.window,
  };
}


const env = createEnv(false);

// Path 1: >= 350,000 voters
let g1 = env.Engine.createGame({ baseTemplateId: 'constitution' });
assert(env.Engine.getPartyInstitutionalTier(g1, 'player') === 0, 'Starts Tier 0');
g1.voterModel.factions['con_christian_dominionists'] = 360000;
g1 = env.Engine.checkAndApplyAscensionGauntlet(g1, 'player');
assert(env.Engine.getPartyInstitutionalTier(g1, 'player') === 1, 'Path 1 (>=350K voters) promotes to Tier 1');
assert(g1.pendingAscensionGauntletModal?.title === 'Crossing into the Fringe', 'Crossing into the Fringe modal fires');
assert(!/\d+%|0\.15|0\.35|REQ-/.test(g1.pendingAscensionGauntletModal.body), 'Modal copy obeys Rule 7 & Rule 4');

// Verify immediate unlocks
assert(env.Engine.getMaxFocusSlots(g1, 'player') === 3, 'Unlock: focus slots expand to 3');
assert(env.Engine.getMediaVisibilityProfile(g1, 'player').earnedMediaMultiplier === 0.45, 'Unlock: earned media triples to 0.45');
assert(env.Engine.getMediaVisibilityProfile(g1, 'player').waveMomentumCap === 1.5, 'Unlock: wave momentum cap lifts to 1.5');
const defAfter = env.Engine.computeStrategicDefection(g1, 'constitution', 'PA', 'presidential', 2.0);
assert(defAfter.defectionRate >= 0.42 && defAfter.defectionRate <= 0.65, 'Unlock: defection drops to Tier 1 band');
assert(env.Ballot.calculatePetitionCost(g1, 'PA', 'prudent', 'constitution').costPerSignature === 3.50, 'Unlock: petition cost normalizes to $3.50/sig');

// Permanence after dropping below 350K + save/load roundtrip
g1.voterModel.factions['con_christian_dominionists'] = 150000;
const reloaded = JSON.parse(JSON.stringify(g1));
assert(env.Engine.getPartyInstitutionalTier(reloaded, 'player') === 1, 'Promoted party never re-evaluates to Tier 0 below 350K');

// Path 2: >= 3 statehouse seats
let g2 = env.Engine.createGame({ baseTemplateId: 'socialist' });
g2.stateHouseSeatCounts.VT = { ...(g2.stateHouseSeatCounts.VT || {}), socialist: 3 };
g2 = env.Engine.checkAndApplyAscensionGauntlet(g2, 'player');
assert(env.Engine.getPartyInstitutionalTier(g2, 'player') === 1, 'Path 2 (>=3 state leg seats) promotes to Tier 1');

// Path 3: >= 5 state presidential ballots
let g3 = env.Engine.createGame({ baseTemplateId: 'socialist' });
g3.ballotAccess.socialist = { presidential: { VT: true, NY: true, CA: true, OR: true, WA: true }, senate: {}, governor: {}, house: {}, leg: {} };
g3 = env.Engine.checkAndApplyAscensionGauntlet(g3, 'player');
assert(env.Engine.getPartyInstitutionalTier(g3, 'player') === 1, 'Path 3 (>=5 state ballots) promotes to Tier 1');

// Path 4: >= 1.0% national popular vote
let g4 = env.Engine.createGame({ baseTemplateId: 'constitution' });
g4.elections = [{ year: 2028, type: 'presidential', nationalVote: { people: 50, heritage: 48, constitution: 1.2, player: 1.2 } }];
g4 = env.Engine.checkAndApplyAscensionGauntlet(g4, 'player');
assert(env.Engine.getPartyInstitutionalTier(g4, 'player') === 1, 'Path 4 (>=1.0% national PV) promotes to Tier 1');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
