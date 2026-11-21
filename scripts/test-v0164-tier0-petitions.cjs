
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
const conGame = env.Engine.createGame({ baseTemplateId: 'constitution' });
const libGame = env.Engine.createGame({ baseTemplateId: 'liberty' });

const c0 = env.Ballot.calculatePetitionCost(conGame, 'PA', 'prudent', 'constitution');
const c1 = env.Ballot.calculatePetitionCost(libGame, 'PA', 'prudent', 'liberty');
assert(c0.costPerSignature === 5.00, 'Tier 0 petition cost per signature === $5.00');
assert(c1.costPerSignature === 3.50, 'Tier 1 petition cost per signature === $3.50');
assert(c0.cost > c1.cost, 'Tier 0 petition total cost exceeds Tier 1 cost');

conGame.activePetitionDrives = { PA: { partyId: 'constitution', stateId: 'PA', bufferPct: 150, qualified: true, signaturesCollected: 10000 } };
libGame.activePetitionDrives = { PA: { partyId: 'liberty', stateId: 'PA', bufferPct: 150, qualified: true, signaturesCollected: 10000 } };
const ch0 = env.Ballot.evaluateBallotChallenges(conGame, { forceCompetitive: true, fixedRoll: 0.60 });
const ch1 = env.Ballot.evaluateBallotChallenges(libGame, { forceCompetitive: true, fixedRoll: 0.60 });
assert(Math.abs(ch0.challenges[0].failRate - (ch1.challenges[0].failRate + 0.30)) < 0.001, 'Tier 0 audit failRate is exactly +30% above Tier 1 baseline');
assert(ch0.challenges[0].disqualified === true && ch1.challenges[0].disqualified === false, 'Tier 0 fails audit at 0.60 roll while Tier 1 survives');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
