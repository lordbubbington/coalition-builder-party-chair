
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
let g = env.Engine.createGame({ baseTemplateId: 'constitution' });
g.treasury = 50;
g.actionsLeft = 10;
g.ballotAccess.constitution = { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} };

assert(env.Ballot.canLaunchPetitionDrive(g, 'PA', 'prudent', 'constitution') === true, 'Can launch presidential petition in uncertified PA');
const after = env.Ballot.launchPetitionDrive(g, { stateId: 'PA', bufferTier: 'prudent', partyId: 'constitution' });
const acc = after.ballotAccess.constitution;
assert(acc.presidential.PA === true && acc.PA === true, 'Presidential access granted in PA');
assert(!acc.senate?.PA, 'Senate access NOT auto-granted');
assert(!acc.governor?.PA, 'Governor access NOT auto-granted');
assert(!acc.leg?.PA, 'State leg access NOT auto-granted');
assert(!Object.keys(acc.house || {}).some((k) => k.startsWith('PA-')), 'House district access NOT auto-granted');
assert(env.Ballot.canLaunchPetitionDrive(after, 'PA', 'prudent', 'constitution') === false, 'canLaunchPetitionDrive blocks already presidential-certified PA');

// Downballot gate regression (REQ-258): presidential-only access polls 0.0% in Senate/House/Governor/Leg
assert(env.Engine.hasBallotAccess(after, 'constitution', 'presidential:PA') === true, 'hasBallotAccess true for presidential:PA');
assert(env.Engine.hasBallotAccess(after, 'constitution', 'senate:PA') === false, 'hasBallotAccess false for senate:PA');
assert(env.Engine.hasBallotAccess(after, 'constitution', 'governor:PA') === false, 'hasBallotAccess false for governor:PA');
assert(env.Engine.hasBallotAccess(after, 'constitution', 'state-leg:PA') === false, 'hasBallotAccess false for state-leg:PA');
assert(env.Engine.hasBallotAccess(after, 'constitution', 'house:PA-1') === false, 'hasBallotAccess false for house:PA-1');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
