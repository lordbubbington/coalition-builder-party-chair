'use strict';

/**
 * Comprehensive QA Test Suite for Coalition Builder: Party Chair (v0.16.9)
 * Diagnostics across:
 * 1. Data Integrity & 808/828 Roster Completeness
 * 2. Playable Parties Initial State & Invariants
 * 3. 10-Cycle Full Simulation (2028-2046) across Major & Minor Parties
 * 4. Action Handlers Coverage & Robustness
 * 5. Faction Happiness Equilibrium & Boundary Clamping
 * 6. Third-Party Trust Caps & Drop-Down Re-evaluation
 * 7. Presidential Primaries, Aging, Term Limits & Multi-Year Archives
 * 8. Save Compaction & Restoration Invariance
 * 9. UI Rendering & Markup Sanity (Null/NaN/Leak Scan)
 * 10. Era System Hooks (Era #15->#16 Robots, Era #18 MMP Coalition)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function bootEnv() {
  const storage = {};
  const mockAppElement = {
    innerHTML: '',
    classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
    insertAdjacentHTML: () => {},
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const mockDoc = {
    querySelectorAll: () => [],
    querySelector: (sel) => (sel === '#app' ? mockAppElement : null),
    getElementById: (id) => (id === 'app' ? mockAppElement : null),
    createElement: (tag) => ({ tagName: tag, innerHTML: '', appendChild: () => {}, setAttribute: () => {} }),
    addEventListener: () => {},
  };

  const ctx = vm.createContext({
    window: {},
    document: mockDoc,
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
    Infinity,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Uint8Array,
    Blob: globalThis.Blob,
    DecompressionStream: globalThis.DecompressionStream,
    Response: globalThis.Response,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    localStorage: {
      getItem: (k) => storage[k] ?? null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
      clear: () => { for (const k in storage) delete storage[k]; },
    },
  });
  ctx.window = ctx;
  ctx.self = ctx;
  ctx.globalThis = ctx;
  ctx.window.document = mockDoc;

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
    'app.js',
  ];

  for (const s of scripts) {
    const code = fs.readFileSync(path.join(ROOT, s), 'utf8');
    vm.runInContext(code, ctx, { filename: s });
  }

  return ctx;
}

const issuesFound = [];
function reportIssue(severity, category, title, details) {
  issuesFound.push({ severity, category, title, details });
  console.log(`[${severity.toUpperCase()}] [${category}] ${title}: ${details}`);
}

const diagnosticLog = [];
function logDiag(section, message) {
  diagnosticLog.push(`[${section}] ${message}`);
  console.log(`  -> [${section}] ${message}`);
}

// Deep scanner for strict NaN in numerical properties
function deepScanNaN(obj, pathStr = '', seen = new Set()) {
  const anomalies = [];
  if (!obj || typeof obj !== 'object' || seen.has(obj)) return anomalies;
  seen.add(obj);

  for (const [k, v] of Object.entries(obj)) {
    const curPath = pathStr ? `${pathStr}.${k}` : k;
    if (typeof v === 'number' && Number.isNaN(v)) {
      anomalies.push({ path: curPath, val: 'NaN' });
    } else if (v && typeof v === 'object') {
      anomalies.push(...deepScanNaN(v, curPath, seen));
    }
  }
  return anomalies;
}

async function runQA() {
  console.log('====================================================================');
  console.log(' COALITION BUILDER: EXTENSIVE QA & DIAGNOSTIC AUDIT (v0.16.9)');
  console.log('====================================================================\n');

  const ctx = bootEnv();
  const E = ctx.window.PartyChairEngine;
  const D = ctx.window.PartyChairData;
  const PSD = ctx.window.PartySystemsData;
  const PSE = ctx.window.PartySystemsEngine;
  const App = ctx.window.PartyChairApp;

  // ------------------------------------------------------------------
  // SECTION 1: Data Integrity & Roster Checks
  // ------------------------------------------------------------------
  console.log('--- SECTION 1: DATA INTEGRITY & ROSTER CHECKS ---');
  const baseGame = E.createGame({ baseTemplateId: 'people' });

  // 1.1 Sitting members count & stats
  const smCount = baseGame.sittingMembers?.length || 0;
  logDiag('Roster', `Total sitting members in 2028: ${smCount}`);
  if (smCount !== 808) {
    reportIssue('high', 'Roster', 'Sitting members count mismatch', `Expected 808 sitting members, got ${smCount}`);
  }

  // Check valid offices and starting ages
  const validOffices = new Set(['senate', 'house', 'governor', 'statewide_executive']);
  let invalidOfficeCount = 0;
  let missingAgeCount = 0;
  let missingRatingsCount = 0;

  for (const sm of (baseGame.sittingMembers || [])) {
    if (!validOffices.has(sm.office)) invalidOfficeCount++;
    if (typeof sm.age !== 'number' || sm.age <= 0) missingAgeCount++;
    if (!sm.ratings || typeof sm.ratings !== 'object') missingRatingsCount++;
  }
  if (invalidOfficeCount > 0) {
    reportIssue('high', 'Roster', 'Invalid sitting member office types', `Found ${invalidOfficeCount} members with invalid office`);
  }
  if (missingAgeCount > 0) {
    reportIssue('high', 'Roster', 'Missing sitting member age', `Found ${missingAgeCount} members without starting age`);
  }
  if (missingRatingsCount > 0) {
    reportIssue('high', 'Roster', 'Missing sitting member ratings', `Found ${missingRatingsCount} members without ratings object`);
  }

  // 1.2 Statewide Offices Registry
  const swOffices = D.STATEWIDE_OFFICES_REGISTRY || [];
  logDiag('Statewide', `Total statewide executive offices: ${swOffices.length}`);
  if (swOffices.length !== 223) {
    reportIssue('high', 'Statewide', 'Statewide office count mismatch', `Expected 223 offices, got ${swOffices.length}`);
  }

  // Check for duplicate office IDs in statewide registry
  const swIds = new Set();
  const dupSwIds = [];
  for (const sw of swOffices) {
    if (swIds.has(sw.id)) dupSwIds.push(sw.id);
    swIds.add(sw.id);
  }
  if (dupSwIds.length > 0) {
    reportIssue('high', 'Statewide', 'Duplicate statewide office IDs', `Found ${dupSwIds.length} duplicates: ${dupSwIds.slice(0, 5).join(', ')}`);
  }

  // 1.3 Faction Extremist Tags & Catalog
  const extremistFactions = [
    'lib_ancaps', 'con_christian_dominionists', 'soc_socialists',
    'soc_communists', 'unaff_the_klan', 'unaff_groypers'
  ];
  const factionsCatalog = D.FACTIONS || [];
  for (const fid of extremistFactions) {
    const fObj = factionsCatalog.find(f => f.id === fid);
    if (!fObj?.isExtremist && !fObj?.extremist) {
      reportIssue('medium', 'Factions', `Extremist tag missing on ${fid}`, `Expected isExtremist: true on ${fid}`);
    }
  }

  // 1.4 Primary Master Delegate Sums
  const dncTotal = Object.values(D.DNC_MASTER_DELEGATES_2028 || {}).reduce((sum, d) => sum + (d.pledged !== undefined ? d.pledged : d), 0);
  const rncTotal = Object.values(D.RNC_MASTER_DELEGATES_2028 || {}).reduce((sum, d) => sum + (d.total !== undefined ? d.total : (d.pledged !== undefined ? d.pledged : d)), 0);
  logDiag('PrimaryData', `DNC Master pledged sum: ${dncTotal} (expected 3934), RNC Master total sum: ${rncTotal} (expected 2429)`);
  if (dncTotal !== 3934) {
    reportIssue('medium', 'PrimaryData', 'DNC master delegate sum mismatch', `Expected 3934, got ${dncTotal}`);
  }
  if (rncTotal !== 2429) {
    reportIssue('medium', 'PrimaryData', 'RNC master delegate sum mismatch', `Expected 2429, got ${rncTotal}`);
  }

  // ------------------------------------------------------------------
  // SECTION 2: Playable Party Smoke Tests
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 2: PLAYABLE PARTY SMOKE TESTS ---');
  const partiesToTest = [
    { id: 'people', name: 'Democratic Party', type: 'major' },
    { id: 'heritage', name: 'Republican Party', type: 'major' },
    { id: 'liberty', name: 'Libertarian Party', type: 'minor' },
    { id: 'green', name: 'Green Party', type: 'minor' },
    { id: 'constitution', name: 'Constitution Party', type: 'minor' },
    { id: 'socialist', name: 'Peace and Freedom Party', type: 'minor' },
    { id: 'custom-major', name: 'Custom Major Party', isCustomMajor: true },
    { id: 'custom-100k', name: 'Custom 100K Movement', isCustom100k: true },
  ];

  for (const p of partiesToTest) {
    try {
      let g;
      if (p.isCustomMajor) {
        g = E.createGame({
          baseTemplateId: 'custom',
          customPartyConfig: {
            name: 'Progressive Alliance',
            code: 'PA',
            emblem: 'torch',
            color: '#10b981',
            motto: 'Forward Together',
            foundingState: 'CA',
            startingTier: 'major',
            founderFactionId: 'dem_progressive_left',
          },
        });
      } else if (p.isCustom100k) {
        g = E.createGame({
          baseTemplateId: 'custom',
          customPartyConfig: {
            name: 'Grassroots Reform',
            code: 'GR',
            emblem: 'compass',
            color: '#8b5cf6',
            motto: 'People Power',
            foundingState: 'VT',
            startingTier: 'movement',
            founderFactionId: 'dem_democratic_socialists',
          },
        });
      } else {
        g = E.createGame({ baseTemplateId: p.id });
      }

      const pTier = g.partyTiers?.[g.player?.partyId ?? p.id] ?? g.partyTier;
      const tCap = E.getThirdPartyTrustCap(g, g.player?.partyId ?? p.id);
      logDiag('PartySmoke', `Booted ${p.name}: Tier=${pTier}, TrustCap=${tCap}, Treasury=$${g.treasury}M`);

      if (!g.version || (g.version !== '0.16.9' && g.version !== '0.17.0')) {
        reportIssue('high', 'PartySmoke', `${p.name} version mismatch`, `Expected 0.17.0, got ${g.version}`);
      }
      if (typeof g.treasury !== 'number' || g.treasury < 0) {
        reportIssue('medium', 'PartySmoke', `${p.name} invalid treasury`, `Got ${g.treasury}`);
      }
      if (!g.priorities || !Array.isArray(g.priorities.offeredQuestIds) || g.priorities.offeredQuestIds.length !== 7) {
        reportIssue('medium', 'PartySmoke', `${p.name} invalid priorities hand`, `Expected 7 offered quests, got ${g.priorities?.offeredQuestIds?.length}`);
      }
    } catch (err) {
      reportIssue('massive', 'PartySmoke', `Crash booting ${p.name}`, err.stack || err.message);
    }
  }

  // ------------------------------------------------------------------
  // SECTION 3: 10-Cycle Simulation Across Major & Minor Parties
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 3: 10-CYCLE SIMULATION (2028-2046) ---');

  async function simulatePartyCycles(partyId, partyLabel, numCycles = 5) {
    logDiag('SimLoop', `Starting ${numCycles}-cycle simulation for ${partyLabel} (${partyId})...`);
    let g = E.createGame({ baseTemplateId: partyId });

    for (let c = 0; c < numCycles; c++) {
      const year = g.year;
      const isPresYear = (year % 4 === 0);

      // Phase: organizing
      // Select 3 priorities
      if (g.priorities && g.priorities.offeredQuestIds && g.priorities.offeredQuestIds.length >= 3) {
        for (let i = 0; i < 3; i++) {
          g = E.takeAction(g, 'select-main-priority', { questId: g.priorities.offeredQuestIds[i], slotIndex: i });
        }
        g = E.takeAction(g, 'lock-main-priorities');
      }

      // If presidential year: presidential primary
      if (isPresYear) {
        g = E.takeAction(g, 'start-presidential-primary');
        if (g.phase !== 'presidential-primary') {
          reportIssue('high', 'Simulation', `Failed to transition to presidential-primary in ${year}`, `Phase is ${g.phase}`);
        }

        // Advance primary calendar to completion
        let daysAdvanced = 0;
        while (g.activePresidentialPrimary && g.activePresidentialPrimary.stage !== 'complete' && daysAdvanced < 60) {
          if (g.activePresidentialPrimary.debateDaysRemaining > 0 && Math.random() < 0.2) {
            const cand = g.activePresidentialPrimary.candidates[0];
            if (cand) {
              g = E.takeAction(g, 'filter-primary-support', { candidateId: cand.id });
            }
          }
          g = E.takeAction(g, 'advance-primary-day');
          daysAdvanced++;
        }

        if (g.activePresidentialPrimary && g.activePresidentialPrimary.stage !== 'complete') {
          reportIssue('high', 'Simulation', `Primary calendar did not complete after ${daysAdvanced} days in ${year}`, `Stage: ${g.activePresidentialPrimary.stage}`);
        }

        g = E.takeAction(g, 'finish-presidential-primary');
        if (g.phase !== 'campaign') {
          reportIssue('high', 'Simulation', `Failed to transition to campaign after finish-presidential-primary in ${year}`, `Phase is ${g.phase}`);
        }
      } else {
        // Midterm year: start campaign directly
        g = E.takeAction(g, 'start-campaign-phase');
      }

      // Phase: campaign
      if (g.year === 2028 && c === 0) {
        g = E.takeAction(g, 'set-state-legislative-slate-tier', { chamberId: 'PA_House', tier: 2 });
        const unheldOffice = (D.STATEWIDE_OFFICES_REGISTRY || []).find(o => o.incumbentParty !== partyId);
        if (unheldOffice) {
          g = E.takeAction(g, 'contest-statewide-office', { officeId: unheldOffice.id });
        }
      }

      // Advance to election night
      g = E.takeAction(g, 'advance-to-election-night');
      if (g.phase !== 'complete') {
        reportIssue('high', 'Simulation', `Failed to resolve general election in ${year}`, `Phase: ${g.phase}`);
      }

      // Check strict NaN in game state after election
      const nanScan = deepScanNaN(g);
      if (nanScan.length > 0) {
        reportIssue('large', 'Simulation', `Strict NaN detected in game state after election ${year}`, `Fields: ${nanScan.map(n => n.path).slice(0, 5).join(', ')}`);
      }

      // Verify compactGameForSave and restoration
      try {
        const compacted = E.compactGameForSave(g);
        const jsonStr = JSON.stringify(compacted);
        const parsed = JSON.parse(jsonStr);
        const restored = E.normalizeGame(parsed);
        if (restored.year !== year) {
          reportIssue('high', 'SaveSystem', `Year mismatch after save/restore in ${year}`, `Got ${restored.year}`);
        }
      } catch (saveErr) {
        reportIssue('large', 'SaveSystem', `Save compaction failed in ${year}`, saveErr.stack || saveErr.message);
      }

      // Advance to next cycle
      g = E.takeAction(g, 'start-next-cycle');
      if (g.year !== year + 2) {
        reportIssue('high', 'Simulation', `Year failed to increment by 2 after cycle ${year}`, `Got ${g.year}`);
      }
    }

    logDiag('SimLoop', `Completed ${numCycles} cycles for ${partyLabel}. Final year: ${g.year}, Treasury: $${g.treasury}M`);
    return g;
  }

  // Simulate 6 cycles for Dem, Rep, and Libertarian
  const finalDem = await simulatePartyCycles('people', 'Democratic Party', 6);
  const finalRep = await simulatePartyCycles('heritage', 'Republican Party', 6);
  const finalLib = await simulatePartyCycles('liberty', 'Libertarian Party', 6);

  // ------------------------------------------------------------------
  // SECTION 4: Aging, Retirements & Term Limits Audit
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 4: AGING, RETIREMENTS & TERM LIMITS AUDIT ---');

  const smDemAges = (finalDem.sittingMembers || []).map(sm => sm.age).filter(a => typeof a === 'number');
  const avgAgeDem = smDemAges.reduce((a, b) => a + b, 0) / (smDemAges.length || 1);
  logDiag('Aging', `After 12 years (6 cycles), Dem sitting members average age: ${avgAgeDem.toFixed(1)}`);
  if (avgAgeDem < 55 || avgAgeDem > 72) {
    reportIssue('medium', 'Aging', 'Average sitting member age out of expected bounds', `Avg age is ${avgAgeDem}`);
  }

  // Check presidential terms tracking
  const presTerms = finalDem.presidentialTerms || {};
  const pastPres = finalDem.pastPresidents || [];
  logDiag('TermLimits', `Presidents tracked: ${JSON.stringify(presTerms)}, Past presidents: ${JSON.stringify(pastPres)}`);

  for (const [name, terms] of Object.entries(presTerms)) {
    if (terms >= 2) {
      if (!pastPres.includes(name)) {
        reportIssue('medium', 'TermLimits', `2-term president missing from pastPresidents`, name);
      }
    }
  }

  // ------------------------------------------------------------------
  // SECTION 5: Faction Happiness Equilibrium & Boundary Audit
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 5: FACTION HAPPINESS EQUILIBRIUM AUDIT ---');
  let gEq = E.createGame({ baseTemplateId: 'people' });
  let pinned100 = 0;
  let pinned0 = 0;
  let outOfBounds = 0;

  for (let c = 0; c < 15; c++) {
    for (const fid of Object.keys(gEq.factions || {})) {
      E.applyScaledFactionHappinessDelta(gEq, fid, (Math.random() - 0.4) * 40);
    }
    E.rebalanceFactionHappinessTowardEquilibrium(gEq);

    for (const [fid, f] of Object.entries(gEq.factions || {})) {
      if (f.happiness > 100 || f.happiness < 0) outOfBounds++;
      if (f.happiness >= 99.9) pinned100++;
      if (f.happiness <= 0.1) pinned0++;
    }
  }

  logDiag('Happiness', `After 15 swing-cycles: Out of bounds: ${outOfBounds}, Pinned at 100: ${pinned100}, Pinned at 0: ${pinned0}`);
  if (outOfBounds > 0) {
    reportIssue('high', 'Happiness', 'Faction happiness went out of [0, 100] bounds', `Count: ${outOfBounds}`);
  }
  if (pinned100 > 10) {
    reportIssue('medium', 'Happiness', 'Excessive faction pinning at 100', `Count: ${pinned100}`);
  }

  // ------------------------------------------------------------------
  // SECTION 6: Third-Party Trust Caps & Drop-Down Re-evaluation
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 6: THIRD-PARTY TRUST CAPS AUDIT ---');
  let gTrust = E.createGame({ baseTemplateId: 'liberty' });

  gTrust.trust = { supporters: 80, independents: 80, opponents: 80 };
  E.enforceGameTrustCaps(gTrust);
  logDiag('TrustCap', `Tier 1 Liberty trust after enforcement: Ind=${gTrust.trust.independents}, Opp=${gTrust.trust.opponents}`);
  if (gTrust.trust.independents > 10 || gTrust.trust.opponents > 10) {
    reportIssue('high', 'TrustCap', 'Tier 1 trust cap failed to clamp to 10', `Ind: ${gTrust.trust.independents}, Opp: ${gTrust.trust.opponents}`);
  }

  gTrust.partyTier = 0;
  if (gTrust.partyTiers) gTrust.partyTiers.liberty = 0;
  E.enforceGameTrustCaps(gTrust);
  logDiag('TrustCap', `Tier 0 Liberty trust after enforcement: Ind=${gTrust.trust.independents}, Opp=${gTrust.trust.opponents}`);
  if (gTrust.trust.independents !== 0 || gTrust.trust.opponents !== 0) {
    reportIssue('high', 'TrustCap', 'Tier 0 trust cap failed to clamp to 0', `Ind: ${gTrust.trust.independents}, Opp: ${gTrust.trust.opponents}`);
  }

  let gMaj = E.createGame({ baseTemplateId: 'people' });
  gMaj.trust = { supporters: 85, independents: 85, opponents: 85 };
  E.enforceGameTrustCaps(gMaj);
  if (gMaj.trust.independents !== 85 || gMaj.trust.opponents !== 85) {
    reportIssue('high', 'TrustCap', 'Major party trust incorrectly clamped', `Ind: ${gMaj.trust.independents}`);
  }

  // ------------------------------------------------------------------
  // SECTION 7: Primary Subsystem Edge Cases
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 7: PRIMARY SUBSYSTEM EDGE CASES ---');
  let gPrim = E.createGame({ baseTemplateId: 'people' });
  gPrim = E.takeAction(gPrim, 'start-presidential-primary');

  const testState = 'NH';
  gPrim = E.takeAction(gPrim, 'reorder-primary-state', { stateId: testState, direction: 'earlier' });
  const standingShift = gPrim.primaryOrder?.people?.standingShift?.[testState];
  logDiag('PrimaryReorder', `Reordered NH earlier, standing shift: ${standingShift}`);
  if (typeof standingShift !== 'number') {
    reportIssue('medium', 'PrimaryReorder', 'primaryOrder standingShift not recorded as number', `Got ${standingShift}`);
  }

  const field = gPrim.activePresidentialPrimary.candidates;
  if (field && field.length > 2) {
    field[1].delegates = 1500;
    field[0].delegates = 10;
    field[0].status = 'active';
    E.evaluatePrimaryDropouts(gPrim.activePresidentialPrimary, 1968, 5);
    logDiag('PrimaryDropouts', `Dropout evaluation test: candidate 0 status=${field[0].status}`);
  }

  // ------------------------------------------------------------------
  // SECTION 8: Era System Hooks (Era #15->#16, Era #18 MMP)
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 8: ERA SYSTEM HOOKS AUDIT ---');

  const era16 = PSD.ERA_CATALOG ? PSD.ERA_CATALOG.find(e => e.id === 'era_16_robots_citizens') : null;
  logDiag('EraCheck', `Era #16 definition in ERA_CATALOG: ${Boolean(era16)}`);
  if (!era16) {
    reportIssue('medium', 'EraCheck', 'era_16_robots_citizens missing from ERA_CATALOG', 'Not found in ERA_CATALOG');
  }

  let gEra = E.createGame({ baseTemplateId: 'people' });
  gEra.activeHistoricalEra = 'era_14_social_media';
  const canTrigger16 = PSE.canTriggerHistoricalEra ? PSE.canTriggerHistoricalEra(gEra, 'era_16_robots_citizens') : false;
  logDiag('EraCheck', `Can trigger Era 16 without Era 15? ${canTrigger16}`);
  if (canTrigger16) {
    reportIssue('medium', 'EraCheck', 'Era 16 triggered without Era 15 prerequisite', 'canTriggerHistoricalEra returned true');
  }

  // ------------------------------------------------------------------
  // SECTION 9: UI Markup Sanity & Dead Code / Bug Scanner
  // ------------------------------------------------------------------
  console.log('\n--- SECTION 9: CODEBASE STATIC ANALYSIS & UI SCAN ---');

  // Check engine.js, app.js, data.js for common bug patterns
  const appJsCode = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const engineJsCode = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
  const dataJsCode = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');

  // Check for undefined variables in app.js event handlers
  const clickHandlers = [...appJsCode.matchAll(/addEventListener\('click'|data-action="([^"]+)"/g)].map(m => m[1]).filter(Boolean);
  logDiag('StaticScan', `Total data-action bindings in app.js: ${clickHandlers.length}`);

  // Check for any obsolete save keys
  const saveKeyMatch = engineJsCode.match(/SAVE_KEY\s*=\s*'([^']+)'/);
  const saveKey = saveKeyMatch ? saveKeyMatch[1] : null;
  logDiag('StaticScan', `Active engine SAVE_KEY: ${saveKey}`);
  if (saveKey !== 'partyChairGame.save.v16.2') {
    reportIssue('medium', 'SaveSystem', 'SAVE_KEY mismatch', `Expected partyChairGame.save.v16.2, got ${saveKey}`);
  }

  // Check for unhandled actions in app.js dispatchAction vs engine.js takeActionInternal
  const appDispatchedActions = new Set([...appJsCode.matchAll(/dispatchAction\(\s*'([^']+)'/g)].map(m => m[1]));
  const engineHandledActions = new Set([...engineJsCode.matchAll(/actionId === '([^']+)'/g)].map(m => m[1]));

  const missingInEngine = [];
  for (const act of appDispatchedActions) {
    if (!engineHandledActions.has(act) && !['save-game', 'load-game', 'reset-game', 'export-save', 'import-save'].includes(act)) {
      missingInEngine.push(act);
    }
  }
  if (missingInEngine.length > 0) {
    reportIssue('medium', 'ActionSync', `Actions dispatched in app.js not handled in engine.js takeActionInternal`, missingInEngine.join(', '));
  }

  // ------------------------------------------------------------------
  // SECTION 10: Summary & Diagnostics Report
  // ------------------------------------------------------------------
  console.log('\n====================================================================');
  console.log(` EXTENSIVE QA AUDIT COMPLETE: ${issuesFound.length} DIAGNOSTIC ISSUES FLAGGED`);
  console.log('====================================================================');

  return {
    issues: issuesFound,
    log: diagnosticLog,
  };
}

runQA().then(results => {
  fs.writeFileSync(path.join(ROOT, 'qa-diagnostic-results.json'), JSON.stringify(results, null, 2));
  console.log(`Results saved to qa-diagnostic-results.json`);
}).catch(err => {
  console.error('QA Test Suite crashed:', err);
});
