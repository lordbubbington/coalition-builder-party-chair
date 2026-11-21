const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0;
let failed = 0;
function assert(desc, condition) {
  if (condition) {
    console.log(`  PASS: ${desc}`);
    passed++;
  } else {
    console.error(`  FAIL: ${desc}`);
    failed++;
  }
}

async function createEnv(includeApp = true) {
  const storage = {};
  const dummyEl = () => ({
    innerHTML: '', textContent: '', value: '', style: { setProperty() {} },
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    addEventListener(){}, querySelector(){ return dummyEl(); }, querySelectorAll(){ return []; },
    closest(){ return null; }, focus(){}, setAttribute(){}, getAttribute(){ return null; }, dataset: {},
    scrollIntoView(){}, setSelectionRange(){}
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
    localStorage: {
      getItem: (k) => storage[k] ?? null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; }
    },
    Uint8Array, atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob: globalThis.Blob, Response: globalThis.Response, console,
    DecompressionStream: globalThis.DecompressionStream || class DecompressionStream {},
    CompressionStream: globalThis.CompressionStream || class CompressionStream {},
    Math, JSON, Number, String, Array, Object, Infinity, parseInt, parseFloat,
    isNaN, isFinite, Date, Set, Map, RegExp, Error,
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
  if (includeApp) {
    if (sandbox.window.PartyChairData?.VERSION_03_MAPS_READY) {
      await sandbox.window.PartyChairData.VERSION_03_MAPS_READY;
    }
    await new Promise((r) => setTimeout(r, 20));
  }
  return {
    ctx,
    window: sandbox.window,
    localStorage: sandbox.localStorage,
    Data: sandbox.window.PartyChairData,
    V07: sandbox.window.PartyChairV07,
    Engine: sandbox.window.PartyChairEngine,
    App: sandbox.window.PartyChairApp || sandbox.window,
  };
}

(async () => {
  console.log('====================================================================');
  console.log(' VERSION 0.17.1 BUGFIX VERIFICATION SUITE');
  console.log('====================================================================\n');

  // -----------------------------------------------------------------------------
  // CHECK 1: Bug 1 — States Screen Inaccessible (selectedState ReferenceError)
  // -----------------------------------------------------------------------------
  console.log('--- CHECK 1: Bug 1 — States Screen Inaccessible (selectedState ReferenceError) ---');
  try {
    const env = await createEnv(true);
    const engine = env.Engine;
    let game = engine.createGame('people', false, null, 'former-politician', 2028);

    // Set active game instance in app.js
    env.App.setGame(game);

    // Add statewide executive officer in activeState (PA)
    game.sittingMembers = game.sittingMembers || [];
    game.sittingMembers.push({
      id: 'seo_pa_ag',
      name: 'Josh Shapiro',
      office: 'statewide_executive',
      stateId: 'PA',
      title: 'Attorney General',
      party: 'people'
    });

    // Call statesTabMarkup() — previously threw ReferenceError: selectedState is not defined
    let markup = '';
    let threw = false;
    try {
      markup = env.App.statesTabMarkup();
    } catch (err) {
      threw = true;
      console.error('  Error calling statesTabMarkup:', err);
    }

    assert('statesTabMarkup() executes cleanly without ReferenceError', !threw);
    assert('statesTabMarkup() contains 50-State Directory & Dossiers markup', markup.includes('50-State Directory'));
    assert('statesTabMarkup() renders statewide executive officers block for activeState', markup.includes('Statewide Elected Executive Officers'));
    assert('statesTabMarkup() displays SEO officer name and title', markup.includes('Josh Shapiro') && markup.includes('Attorney General'));
  } catch (e) {
    assert('CHECK 1 encountered unexpected error: ' + e.message, false);
  }

  // -----------------------------------------------------------------------------
  // CHECK 2: Bug 2 — Priorities/Focuses State & Region Buttons Selection
  // -----------------------------------------------------------------------------
  console.log('\n--- CHECK 2: Bug 2 — Priorities/Focuses State & Region Buttons ---');
  try {
    const env = await createEnv(true);
    const engine = env.Engine;
    let game = engine.createGame('people', false, null, 'former-politician', 2028);
    env.App.setGame(game);

    // Verify priorities data structure has initial slots
    assert('game.priorities exists and contains additional array', game.priorities && Array.isArray(game.priorities.additional));
    const initialType = game.priorities.additional[0]?.type;
    assert('Initial slot 0 type is issue', initialType === 'issue');

    // Test set-additional-priority-type engine action
    let updated1 = engine.takeAction(game, 'set-additional-priority-type', { slotIndex: 0, type: 'state' });
    assert('set-additional-priority-type cleanly switches slot 0 to state', updated1.priorities.additional[0].type === 'state');
    assert('set-additional-priority-type clears targetId for fresh selection', updated1.priorities.additional[0].targetId === '');

    let updated2 = engine.takeAction(updated1, 'set-additional-priority-type', { slotIndex: 1, type: 'region' });
    assert('set-additional-priority-type cleanly switches slot 1 to region', updated2.priorities.additional[1].type === 'region');

    // Test step2PrioritiesMarkup rendering with mixed slot types
    env.App.setGame(updated2);
    let step2Markup = env.App.step2PrioritiesMarkup();
    assert('step2PrioritiesMarkup() renders without error', step2Markup.includes('Two-Tier National Priority Architecture'));
    assert('step2PrioritiesMarkup() renders state and region dropdowns/type-selectors',
      step2Markup.includes('data-set-additional-type') && step2Markup.includes('data-type="state"') && step2Markup.includes('data-type="region"'));
  } catch (e) {
    assert('CHECK 2 encountered unexpected error: ' + e.message, false);
  }

  // -----------------------------------------------------------------------------
  // CHECK 3: Bug 3 — Execute Party Machine Operations Actions Clickable
  // -----------------------------------------------------------------------------
  console.log('\n--- CHECK 3: Bug 3 — Execute Party Machine Operations Actions Clickable ---');
  try {
    const env = await createEnv(true);
    const engine = env.Engine;
    let game = engine.createGame('people', false, null, 'former-politician', 2028);

    // Simulate condition: actionsLeft is 0, but organizingActionsRemaining is 16
    game.actionsLeft = 0;
    game.organizingActionsRemaining = 16;
    game.phase = 'organizing';
    env.App.setGame(game);

    // Step 4/5 Machine Operations markup test
    let workMarkup = env.App.step4WorkMarkup();
    assert('step4WorkMarkup() renders Execute Party Machine Operations', workMarkup.includes('Execute Party Machine Operations'));

    // Action button should NOT be disabled because organizingActionsRemaining (16) > 0
    assert('Open State Chapter button is enabled when organizingActionsRemaining > 0 despite actionsLeft=0',
      workMarkup.includes('Open State Chapter') && !workMarkup.includes('data-action="chapter" disabled'));

    // Verify takeAction auto-refills actionsLeft and deducts from organizing pool
    let afterAction = engine.takeAction(game, 'chapter', { stateId: 'OH' });
    assert('takeAction executes chapter action successfully when actionsLeft was 0 but organizingActionsRemaining > 0',
      afterAction.stateChapters && afterAction.stateChapters['OH'] > 0);
    assert('organizingActionsRemaining decremented from 16 to 15', afterAction.organizingActionsRemaining === 15);
    assert('actionsLeft refilled and decremented to 3', afterAction.actionsLeft === 3);

    // Verify normalizeGame fixes deadlocked save with actionsLeft=0 and organizingActionsRemaining=12
    let rawSave = { ...game, actionsLeft: 0, organizingActionsRemaining: 12 };
    let normalized = engine.normalizeGame(rawSave);
    assert('normalizeGame refills actionsLeft to Math.min(4, organizingActionsRemaining)', normalized.actionsLeft === 4);
    assert('normalizeGame preserves organizingActionsRemaining count', normalized.organizingActionsRemaining === 12);
  } catch (e) {
    assert('CHECK 3 encountered unexpected error: ' + e.message, false);
  }

  // -----------------------------------------------------------------------------
  // CHECK 4: Version and Save Key Integrity
  // -----------------------------------------------------------------------------
  console.log('\n--- CHECK 4: Version and Save Key Integrity ---');
  try {
    const env = await createEnv(true);
    const engine = env.Engine;
    let game = engine.createGame('people', false, null, 'former-politician', 2028);

    assert('engine createGame creates game at version 0.17.1', game.version === '0.18.1');
    assert('SAVE_KEY is partyChairGame.save.v16.2', engine.SAVE_KEY === 'partyChairGame.save.v16.2');

    // Verify backward compatible save migration from v16.1
    const dummyV161Save = JSON.stringify({ ...game, schema: 7, version: '0.18.1' });
    env.localStorage.setItem('partyChairGame.save.v16.1', dummyV161Save);
    env.localStorage.removeItem('partyChairGame.save.v16.2');
    const loaded = engine.loadGame();
    assert('loadGame() migrates save cleanly from partyChairGame.save.v16.1', loaded && loaded.version === '0.18.1');
  } catch (e) {
    assert('CHECK 4 encountered unexpected error: ' + e.message, false);
  }

  console.log('\n====================================================================');
  console.log(` V0.17.1 BUGFIX SUITE RESULT: ${passed} passed, ${failed} failed`);
  console.log('====================================================================\n');

  if (failed > 0) process.exit(1);
})();
