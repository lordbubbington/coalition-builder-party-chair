
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




const appSrc = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
assert(appSrc.includes('Launch Presidential Ballot Access Petition Drive'), 'Presidential scope title present');
assert(appSrc.includes('1 action · Statutory Cost · Presidential Slate'), 'Presidential scope badge present');
assert(appSrc.includes('Petition Presidential Ballot Line'), 'Presidential scope button present');
assert(appSrc.includes('Downballot ballot access (U.S. Senate, House, Governor, and State Legislature) must be obtained separately per contest.'), 'Downballot separation note present');
assert(appSrc.includes('Active state chapters trim statutory filing costs'), 'Rule 7 sanitized cost copy present');
assert(!appSrc.includes('-35% cost discount'), 'Raw -35% percentage removed from petition card');
assert(appSrc.includes('Full 50-State Presidential Ballot Access Certified:'), '50-state+DC presidential completion banner present');
assert(appSrc.includes('!(acc && (acc.presidential?.[s.id] || acc[s.id]))'), 'Dropdown filters on presidential qualification');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
