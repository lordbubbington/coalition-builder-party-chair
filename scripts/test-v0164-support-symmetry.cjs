
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
const asDem = env.Engine.createGame({ baseTemplateId: 'people' });
const asLib = env.Engine.createGame({ baseTemplateId: 'liberty' });
const asGrn = env.Engine.createGame({ baseTemplateId: 'green' });
const asSoc = env.Engine.createGame({ baseTemplateId: 'socialist' });
const asCon = env.Engine.createGame({ baseTemplateId: 'constitution' });

// A/B selection parity: Liberty as human vs Liberty as NPC in PA (where Liberty has access)
const pa = env.Data.STATES.find((s) => s.id === 'PA');
const libHumanPA = env.Engine.supportByState(asLib, pa).player;
const libNpcPA = env.Engine.supportByState(asDem, pa).liberty;
assert(Math.abs(libHumanPA - libNpcPA) < 1.5, 'Liberty human vs NPC turn-1 PA support aligned (human=' + libHumanPA + ', npc=' + libNpcPA + ')');

// Design baseline national polling check (no 2x-7x selection jump)
function avgNational(game) {
  let sum = 0;
  env.Data.STATES.forEach((st) => { sum += (env.Engine.supportByState(game, st).player || 0); });
  return sum / env.Data.STATES.length;
}
assert(avgNational(asLib) <= 3.0, 'Liberty turn-1 avg polling within design baseline (<=3.0%): ' + avgNational(asLib).toFixed(2));
assert(avgNational(asGrn) <= 3.0, 'Green turn-1 avg polling within design baseline (<=3.0%): ' + avgNational(asGrn).toFixed(2));
assert(avgNational(asSoc) <= 1.0, 'Socialist turn-1 avg polling within design baseline (<=1.0%): ' + avgNational(asSoc).toFixed(2));
assert(avgNational(asCon) <= 1.0, 'Constitution turn-1 avg polling within design baseline (<=1.0%): ' + avgNational(asCon).toFixed(2));

// Custom zero-chapter preservation (REQ-265)
const customG = env.Engine.createGame({ isCustom: true, customName: 'Zero Infra', customOrigin: 'grassroots_micro' });
const totalCustomCh = Object.values(customG.stateChapters || {}).reduce((a, b) => a + b, 0);
assert(totalCustomCh === 0, 'REQ-265 custom zero-chapter start preserved');

// Mood symmetry check in source
const engSrc = fs.readFileSync(path.resolve(__dirname, '..', 'engine.js'), 'utf8');
assert(engSrc.includes('const playerCampaignScale = isMajor ? 1.0 : footprintScale;'), 'playerCampaignScale applied in supportByState');
assert(engSrc.includes("const mediaProfile = getMediaVisibilityProfile(game, sameAsPlayer ? 'player' : party.id);"), 'Symmetric mediaProfile & publicMood across player and rivals');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
