
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
const socGame = env.Engine.createGame({ baseTemplateId: 'socialist' });
const customGame = env.Engine.createGame({ isCustom: true, customName: 'Zero Movement', customOrigin: 'grassroots_micro' });
const libGame = env.Engine.createGame({ baseTemplateId: 'liberty' });
const demGame = env.Engine.createGame({ baseTemplateId: 'people' });

assert(env.Engine.getMaxFocusSlots(conGame, 'player') === 1, 'Tier 0 focus slots === 1');
assert(env.Engine.getMaxFocusSlots(libGame, 'player') === 3, 'Tier 1 focus slots === 3');
assert(env.Engine.getMaxFocusSlots(demGame, 'player') === 7, 'Tier 5 focus slots === 7');
const t3Game = { ...libGame, partyTiers: { ...libGame.partyTiers, liberty: 3 } };
assert(env.Engine.getMaxFocusSlots(t3Game, 'player') === 5, 'Tier 3 focus slots === 5');

assert(env.Engine.calculatePartyFundraising(conGame, 'player', 10).multiplier === 0.35, 'Tier 0 fundraising multiplier === 0.35');
assert(env.Engine.calculatePartyFundraising(libGame, 'player', 10).multiplier === 0.75, 'Tier 1 fundraising multiplier === 0.75');
assert(env.Engine.calculatePartyFundraising(demGame, 'player', 10).multiplier === 1.0, 'Tier 5 fundraising multiplier === 1.0');

assert(conGame.treasury <= 1.0, 'Constitution starting warchest capped <= $1.0M: ' + conGame.treasury);
assert(socGame.treasury <= 1.0, 'Socialist starting warchest capped <= $1.0M: ' + socGame.treasury);
assert(customGame.treasury <= 1.0, 'Custom 100K starting warchest capped <= $1.0M: ' + customGame.treasury);

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
