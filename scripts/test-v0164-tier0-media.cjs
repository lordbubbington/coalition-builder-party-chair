
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
const demGame = env.Engine.createGame({ baseTemplateId: 'people' });

const t0Prof = env.Engine.getMediaVisibilityProfile(conGame, 'player');
const t1Prof = env.Engine.getMediaVisibilityProfile(libGame, 'player');
const t5Prof = env.Engine.getMediaVisibilityProfile(demGame, 'player');
assert(t0Prof.earnedMediaMultiplier === 0.15, 'Tier 0 earnedMediaMultiplier === 0.15');
assert(t0Prof.waveMomentumCap === 0.0, 'Tier 0 waveMomentumCap === 0.0');
assert(t1Prof.earnedMediaMultiplier === 0.45 && t1Prof.waveMomentumCap === 1.5, 'Tier 1 media profile preserved');
assert(t5Prof.earnedMediaMultiplier === 1.0, 'Major party media profile preserved');

const waveGame = { ...conGame, chairTurn: 3, nationalEnvironment: 12, campaign: { ...conGame.campaign, waveBonus: 4.0 } };
assert(env.Engine.computeWaveMomentum(waveGame) <= 0.0, 'Tier 0 wave momentum capped at 0.0 even in strong national wave');

const t0DefLow = env.Engine.computeStrategicDefection(conGame, 'constitution', 'PA', 'presidential', 1.0);
const t0DefHigh = env.Engine.computeStrategicDefection(conGame, 'constitution', 'PA', 'presidential', 15.0);
assert(t0DefLow.defectionRate >= 0.75 && t0DefLow.defectionRate <= 0.85, 'Tier 0 defection near 0% in 75%-85% band: ' + t0DefLow.defectionRate);
assert(t0DefHigh.defectionRate >= 0.75 && t0DefHigh.defectionRate <= 0.85, 'Tier 0 defection near threshold in 75%-85% band: ' + t0DefHigh.defectionRate);

const t1Def = env.Engine.computeStrategicDefection(libGame, 'liberty', 'PA', 'presidential', 2.0);
assert(t1Def.defectionRate >= 0.42 && t1Def.defectionRate <= 0.65, 'Tier 1 defection preserved in 42%-65% band: ' + t1Def.defectionRate);

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
