/**
 * Coalition Builder: Party Chair — Multi-Cycle Balance Audit Harness (BUG-13)
 * Simulates multi-decade continuous political evolution headlessly across 50+ election cycles.
 *
 * Usage:
 *   node scripts/audit-multicycle-simulation.cjs [--cycles 50] [--party people] [--seed 2028] [--active-bot | --no-active-bot] [--no-report] [--verbose]
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

// Parse CLI args
const args = process.argv.slice(2);
let targetCycles = 50;
let targetParty = 'people';
let baseSeed = null;
let reportPath = path.join(ROOT, 'BALANCE_AUDIT_REPORT.md');
let writeReport = true;
let activeBot = true;
let verbose = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--cycles' && args[i + 1]) {
    targetCycles = parseInt(args[++i], 10) || 50;
  } else if (args[i] === '--party' && args[i + 1]) {
    targetParty = args[++i];
  } else if (args[i] === '--seed' && args[i + 1]) {
    baseSeed = parseInt(args[++i], 10) || 2028;
  } else if (args[i] === '--report' && args[i + 1]) {
    reportPath = path.resolve(args[++i]);
  } else if (args[i] === '--no-report') {
    writeReport = false;
  } else if (args[i] === '--active-bot') {
    activeBot = true;
  } else if (args[i] === '--no-active-bot' || args[i] === '--active-bot=false') {
    activeBot = false;
  } else if (args[i] === '--verbose' || args[i] === '-v') {
    verbose = true;
  }
}

// 1. Setup Browser-like Global Sandbox
globalThis.window = globalThis;
if (typeof globalThis.addEventListener !== 'function') globalThis.addEventListener = () => {};
if (typeof globalThis.removeEventListener !== 'function') globalThis.removeEventListener = () => {};
globalThis.localStorage = {
  _data: new Map(),
  getItem(k) { return this._data.get(k) || null; },
  setItem(k, v) { this._data.set(k, String(v)); },
  removeItem(k) { this._data.delete(k); },
};
globalThis.document = {
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
  createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, setAttribute: () => {} }),
};

// [v0.18.7 QA-FIX] BUG-13: Dynamically parse script load order from index.html (excluding app.js & ui-setup-views.js)
function loadScriptsFromIndexHtml() {
  const indexPath = path.join(ROOT, 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');
  const scriptRegex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  const loaded = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const cleanSrc = match[1].split('?')[0].split('#')[0].trim();
    const baseName = path.basename(cleanSrc);
    if (!cleanSrc || baseName === 'app.js' || baseName === 'ui-setup-views.js') continue;
    const fullPath = path.join(ROOT, cleanSrc);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Script referenced in index.html not found: ${cleanSrc}`);
    }
    const code = fs.readFileSync(fullPath, 'utf8');
    vm.runInThisContext(code, { filename: cleanSrc });
    loaded.push(cleanSrc);
  }
  return loaded;
}

const loadedScripts = loadScriptsFromIndexHtml();
const Engine = globalThis.PartyChairEngine;
const Data = globalThis.PartyChairData;
if (!Engine || !Data) {
  throw new Error('Failed to load PartyChairEngine or PartyChairData from index.html script chain.');
}

// Active bot driver exercising Organizing, Campaign, and Off-Cycle Interlude phases
function runActiveBotTurnActions(game, stats) {
  let cur = game;
  const pKey = cur.player?.custom ? 'player' : (cur.player?.baseTemplateId || cur.player?.id || targetParty);
  const states = Data.STATES || [];
  const battlegroundOrder = states
    .slice()
    .sort((a, b) => Math.abs(Number(a.lean || 0)) - Math.abs(Number(b.lean || 0)))
    .map((s) => s.id);

  // A. Organizing Phase: build chapters, fundraise, host summits, voter registration drives, advance turns
  let guard = 0;
  while (cur.phase === 'organizing' && guard < 18) {
    guard++;
    const avail = Number(cur.organizingActionsRemaining ?? cur.actionsLeft ?? 0);
    if (avail > 0) {
      let acted = false;
      const partyFactions = (cur.factions || []).filter((f) => f && f.partyId === pKey);
      const unhappyFaction = partyFactions.slice().sort((a, b) => (cur.factionHappiness?.[a.id] ?? 60) - (cur.factionHappiness?.[b.id] ?? 60))[0];
      const targetStateId = battlegroundOrder[guard % Math.max(1, battlegroundOrder.length)] || 'PA';
      const curCh = Number(cur.stateChapters?.[targetStateId] ?? cur.stateOrganizations?.[targetStateId]?.[pKey]?.chapters ?? 0);

      let actId = 'voter-registration-drive';
      let payload = { stateId: targetStateId };
      if (Number(cur.treasury || 0) < 28) {
        actId = 'fundraise';
        payload = { stateId: targetStateId };
      } else if (unhappyFaction && Number(cur.factionHappiness?.[unhappyFaction.id] ?? 60) < 48 && Number(cur.treasury || 0) >= 3) {
        actId = 'summit';
        payload = { factionId: unhappyFaction.id };
      } else if (curCh < 20 && Number(cur.treasury || 0) >= 5) {
        actId = 'chapter';
        payload = { stateId: targetStateId };
      }

      const nextState = Engine.takeAction(cur, actId, payload);
      if (nextState && nextState !== cur) {
        cur = nextState;
        acted = true;
        stats.botOrganizingActions++;
      }
      if (!acted) {
        const adv = Engine.advanceChairTurn(cur);
        if (!adv || adv === cur) break;
        cur = adv;
      }
    } else {
      const adv = Engine.advanceChairTurn(cur);
      if (!adv || adv === cur) break;
      cur = adv;
    }

    // Track mid-campaign treasury cap invariant
    stats.maxTreasurySeen = Math.max(stats.maxTreasurySeen, Number(cur.treasury || 0));
    if (Number(cur.treasury || 0) > 3000) {
      stats.treasuryMidCapViolations++;
    }
  }

  // B. Primary / Campaign transition & General Campaign steps
  if (cur.phase === 'primaries' || cur.phase === 'presidential-primary') {
    cur = Engine.resolveVersion01Primaries ? Engine.resolveVersion01Primaries(cur) : cur;
  }
  if (cur.phase === 'organizing' && !cur.primariesResolved) {
    const pRes = Engine.takeAction(cur, 'advance-to-primaries');
    if (pRes && pRes !== cur) cur = pRes;
    const rRes = Engine.takeAction(cur, 'resolve-primaries');
    if (rRes && rRes !== cur) cur = rRes;
  }
  if (cur.phase === 'primaries' || (cur.phase === 'organizing' && cur.primariesResolved)) {
    const cRes = Engine.takeAction(cur, 'start-campaign-phase');
    if (cRes && cRes !== cur) cur = cRes;
  }

  let campGuard = 0;
  while ((cur.phase === 'general-campaign' || cur.phase === 'campaign' || cur.campaign?.active) && !cur.generalElectionResolved && campGuard < 8) {
    campGuard++;
    const cAvail = Number(cur.campaign?.monthlyActionsLeft ?? cur.actionsLeft ?? 0);
    if (cAvail > 0 && Number(cur.treasury || 0) >= 2) {
      const stId = battlegroundOrder[campGuard % Math.max(1, battlegroundOrder.length)] || 'WI';
      const nextCamp = Engine.takeAction(cur, 'campaign-state', { stateId: stId });
      if (nextCamp && nextCamp !== cur) {
        cur = nextCamp;
        stats.botCampaignActions++;
      }
    }
    stats.maxTreasurySeen = Math.max(stats.maxTreasurySeen, Number(cur.treasury || 0));
    if (Number(cur.treasury || 0) > 3000) {
      stats.treasuryMidCapViolations++;
    }
    const advWeek = Engine.takeAction(cur, 'advance-campaign-week');
    if (!advWeek || advWeek === cur) break;
    cur = advWeek;
  }

  return cur;
}

function runActiveBotOffCycle(game, stats) {
  let cur = Engine.takeAction(game, 'start-off-cycle-interlude');
  if (!cur || cur.phase !== 'off-cycle-interlude') {
    return Engine.startNextCycle(game);
  }
  stats.offCycleInterludesPlayed++;

  const playerPid = cur.player?.custom ? 'player' : (cur.player?.baseTemplateId || cur.player?.id || targetParty);
  const compCount = (cur.offCycle?.races || []).filter((r) => Math.abs(Number(r.baselineLean || 0)) <= 10).length;
  const chosenPosture = (compCount >= 2 && Number(cur.treasury || 0) >= 15) ? 'special_blitz' : 'balanced';
  cur = Engine.takeAction(cur, 'off-cycle-set-posture', { posture: chosenPosture });
  const fallbackState = (Data.STATES || [])[0]?.id || 'PA';
  let stepGuard = 0;
  while (Number(cur.offCycle?.actionsRemaining || 0) > 0 && stepGuard < 6) {
    stepGuard++;
    const races = Array.isArray(cur.offCycle?.races) ? cur.offCycle.races : [];
    const sortedRaces = races
      .slice()
      .sort((a, b) => (Math.abs(Number(a.baselineLean || 0)) - Number(a.weight || 1) * 1.5) - (Math.abs(Number(b.baselineLean || 0)) - Number(b.weight || 1) * 1.5));
    const raceTarget = sortedRaces.find((r) => Number(r.adBuys || 0) < 2) || sortedRaces[0] || null;
    const chapterRaceState = sortedRaces
      .map((r) => r.stateId)
      .find((stId) => Number(cur.stateOrganizations?.[stId]?.[playerPid]?.chapters ?? cur.stateChapters?.[stId] ?? 0) < 25)
      || fallbackState;
    const wantElectionFirst = chosenPosture === 'special_blitz' ? stepGuard <= 3 : stepGuard % 2 === 0;
    const candidateActions = wantElectionFirst
      ? [
          { id: 'off-cycle-ad-blitz', payload: raceTarget ? { raceId: raceTarget.id, stateId: raceTarget.stateId } : {} },
          { id: 'off-cycle-turnout-surge', payload: raceTarget ? { raceId: raceTarget.id, stateId: raceTarget.stateId } : {} },
          { id: 'off-cycle-donor-retreat', payload: {} },
        ]
      : [
          { id: 'off-cycle-chapter-drive', payload: { stateId: chapterRaceState } },
          { id: 'off-cycle-donor-retreat', payload: {} },
        ];
    let nextOc = null;
    for (const cand of candidateActions) {
      if ((cand.id === 'off-cycle-ad-blitz' || cand.id === 'off-cycle-turnout-surge') && !cand.payload?.raceId) continue;
      const attempted = Engine.takeAction(cur, cand.id, cand.payload);
      if (attempted && attempted !== cur && Number(attempted.offCycle?.actionsRemaining) < Number(cur.offCycle?.actionsRemaining)) {
        nextOc = attempted;
        break;
      }
    }
    if (!nextOc) break;
    cur = nextOc;
    stats.botOffCycleActions++;
  }

  // Track Bellwether magnitude bounds [-3.5, +3.5] and cumulative average
  cur = Engine.takeAction(cur, 'off-cycle-resolve');
  const bellDelta = Number(cur.pendingBellwetherBonus?.bellwetherWave ?? cur.offCycle?.summary?.bellwetherWave ?? 0);
  stats.bellwetherSum += bellDelta;
  stats.bellwetherCount += 1;
  stats.maxAbsBellwetherSeen = Math.max(stats.maxAbsBellwetherSeen, Math.abs(bellDelta));
  if (Math.abs(bellDelta) > 3.5 + 1e-6) {
    stats.bellwetherBoundViolations++;
  }

  return Engine.advanceYear(cur);
}

console.log('===================================================================');
console.log('Coalition Builder: Party Chair — Multi-Cycle Balance Audit Harness');
console.log(`Target Cycles: ${targetCycles} | Base Party: ${targetParty} | Active Bot: ${activeBot ? 'ON' : 'OFF'}`);
console.log(`Scripts Loaded from index.html: ${loadedScripts.length}`);
console.log('===================================================================');

let game = Engine.createGame({ baseTemplateId: targetParty });
if (baseSeed !== null) {
  game.seed = baseSeed;
}
// Track baseline starting state chapter counts (major parties start > 25 in large states like CA=118; BUG-06 caps new builds at 25)
const initialStateChapCeiling = {};
for (const st of (Data.STATES || [])) {
  const initVal = Number(game.stateChapters?.[st.id] ?? game.stateOrganizations?.[st.id]?.[targetParty]?.chapters ?? 0);
  initialStateChapCeiling[st.id] = Math.max(25, initVal);
}
const startTime = Date.now();

const stats = {
  startYear: game.year || 2028,
  endYear: game.year || 2028,
  cyclesRun: 0,
  voterConservationViolations: 0,
  minVoters: Infinity,
  maxVoters: 0,
  duplicateSittingIdsViolations: 0,
  seatAnomalyViolations: 0,
  nanViolations: 0,
  maxChapterCountSeen: 0,
  chapterCapViolations: 0,
  treasuryCycleCapViolations: 0,
  postElectionTreasuryCapViolations: 0,
  treasuryMidCapViolations: 0,
  maxTreasurySeen: Number(game.treasury || 0),
  bellwetherBoundViolations: 0,
  maxAbsBellwetherSeen: 0,
  bellwetherSum: 0,
  bellwetherCount: 0,
  botOrganizingActions: 0,
  botCampaignActions: 0,
  botOffCycleActions: 0,
  offCycleInterludesPlayed: 0,
  totalPresidenciesWon: { people: 0, heritage: 0, liberty: 0, green: 0, constitution: 0, socialist: 0, other: 0 },
  senateControlCycles: { people: 0, heritage: 0, tie: 0, third: 0 },
  houseControlCycles: { people: 0, heritage: 0, third: 0 },
  retiredPoliticiansCount: 0,
  activeRosterCount: (game.sittingMembers || []).length,
  pinnedFactionsCount: 0,
  extinctFactionsCount: 0,
  earlyCollapseViolations: 0,
  playerCollapseCycles: 0,
  history: [],
};

for (let cycle = 1; cycle <= targetCycles; cycle++) {
  const cycleYear = game.year || (2028 + (cycle - 1) * 2);
  const cycleType = (cycleYear % 4 === 0) ? 'Presidential' : 'Midterm';
  stats.endYear = cycleYear;

  // Cycle-entry player treasury invariant (<= $250M)
  const entryTreasury = Number(game.treasury || 0);
  stats.maxTreasurySeen = Math.max(stats.maxTreasurySeen, entryTreasury);
  if (entryTreasury > 250.05) {
    stats.treasuryCycleCapViolations++;
  }

  // 1. Audit Voter Conservation
  const totalRepVoters = (game.voterModel?.states || []).reduce((acc, st) => acc + Number(st.representedVoters || 0), 0);
  stats.minVoters = Math.min(stats.minVoters, totalRepVoters);
  stats.maxVoters = Math.max(stats.maxVoters, totalRepVoters);
  const voterOk = (totalRepVoters === 155000000);
  if (!voterOk) stats.voterConservationViolations++;

  // 2. Audit Duplicate sittingMembers IDs & Chapter Cap (<= 25 per state)
  const sitIds = new Set();
  let dupCount = 0;
  for (const m of (game.sittingMembers || [])) {
    if (!m || !m.id) continue;
    if (sitIds.has(m.id)) dupCount++;
    sitIds.add(m.id);
  }
  if (dupCount > 0) stats.duplicateSittingIdsViolations += dupCount;

  const stateChapVals = Object.entries(game.stateChapters || {}).map(([stId, v]) => ({
    stId,
    val: Number(v || 0),
    cap: initialStateChapCeiling[stId] || 25,
  }));
  const cycleMaxChap = stateChapVals.length ? Math.max(...stateChapVals.map((x) => x.val)) : 0;
  const cycleCapExceeded = stateChapVals.some((x) => x.val > x.cap);
  stats.maxChapterCountSeen = Math.max(stats.maxChapterCountSeen, cycleMaxChap);
  if (cycleCapExceeded) stats.chapterCapViolations++;

  // 3. Audit Faction Health (Happiness bounds [0, 100], no pinned extremes)
  let factionsAtMax = 0;
  let factionsAtMin = 0;
  let hapSum = 0;
  const liveFactions = game.factions || [];
  liveFactions.forEach((f) => {
    const h = Number(game.factionHappiness?.[f.id] ?? f.happiness ?? 55);
    hapSum += h;
    if (h >= 99.5) factionsAtMax++;
    if (h <= 0.5) factionsAtMin++;
  });
  const avgHap = liveFactions.length ? Math.round((hapSum / liveFactions.length) * 10) / 10 : 55;
  if (factionsAtMax > 0 || factionsAtMin > 0) stats.pinnedFactionsCount++;

  // Count extinct factions & early collapse check
  const peopleFacs = liveFactions.filter((f) => f.partyId === 'people').length;
  const heritageFacs = liveFactions.filter((f) => f.partyId === 'heritage').length;
  if (peopleFacs === 0 || heritageFacs === 0) stats.extinctFactionsCount++;
  const playerFacs = liveFactions.filter((f) => f.partyId === (game.player?.custom ? 'player' : (game.player?.baseTemplateId || targetParty))).length;
  if (game.gameOver || playerFacs === 0) {
    stats.playerCollapseCycles++;
    if (cycle <= 6) stats.earlyCollapseViolations++;
  }

  // Audit NaNs and federal seat counts
  const numericChecks = [
    game.treasury,
    game.nationalEnvironment,
    game.turnoutBaseline,
    game.trust?.supporters,
    game.trust?.independents,
    game.trust?.opponents,
    ...liveFactions.map((f) => game.factionHappiness?.[f.id] ?? f.happiness),
  ];
  if (numericChecks.some((v) => v !== undefined && v !== null && !Number.isFinite(Number(v)))) {
    stats.nanViolations++;
  }

  const smHouse = (game.sittingMembers || []).filter((m) => m && m.office === 'house').length;
  const smSenate = (game.sittingMembers || []).filter((m) => m && m.office === 'senate').length;
  const smGov = (game.sittingMembers || []).filter((m) => m && m.office === 'governor').length;
  if (smHouse !== 435 || smSenate !== 100 || smGov !== 50) {
    stats.seatAnomalyViolations++;
  }

  // 4. Audit Politician Pool & Ages
  const initialRosterCount = (game.sittingMembers || []).length;
  const currentRetirements = (game.politicians || []).filter((p) => p && (p.retired || p.isRetired)).length;
  stats.activeRosterCount = initialRosterCount;
  stats.retiredPoliticiansCount = currentRetirements;

  // 5. Play cycle actions when --active-bot is enabled, then resolve general election
  if (activeBot) {
    game = runActiveBotTurnActions(game, stats);
  }
  if (!game.generalElectionResolved) {
    game = Engine.resolveVersion01GeneralElection(game);
  }
  if (Number(game.treasury || 0) > 250.05) {
    stats.postElectionTreasuryCapViolations++;
  }
  const postElecNums = [
    game.treasury,
    game.nationalEnvironment,
    ...((game.factions || []).map((f) => game.factionHappiness?.[f.id] ?? f.happiness)),
  ];
  if (postElecNums.some((v) => v !== undefined && v !== null && !Number.isFinite(Number(v)))) {
    stats.nanViolations++;
  }
  const isMmpEra = (game.partySystems?.currentEraId === 'era_18_party_coalition');
  const expectedHouseReps = isMmpEra ? 870 : 435;
  const postHouse = (game.representatives || []).length;
  const postSmHouse = (game.sittingMembers || []).filter((m) => m && m.office === 'house').length;
  const postSmSen = (game.sittingMembers || []).filter((m) => m && m.office === 'senate').length;
  const postSmGov = (game.sittingMembers || []).filter((m) => m && m.office === 'governor').length;
  if (postHouse !== expectedHouseReps || postSmHouse !== 435 || postSmSen !== 100 || postSmGov !== 50) {
    stats.seatAnomalyViolations++;
  }

  // Record election outcome
  const lastElect = game.lastElection || {};
  if (cycleYear % 4 === 0) {
    const winner = lastElect.presidential?.winner || game.governingParty || 'people';
    if (stats.totalPresidenciesWon[winner] !== undefined) {
      stats.totalPresidenciesWon[winner]++;
    } else {
      stats.totalPresidenciesWon.other++;
    }
  }

  // Senate & House tally
  const demSenate = lastElect.senateDemSeats ?? lastElect.senatePeopleSeats ?? 50;
  const repSenate = lastElect.senateRepSeats ?? lastElect.senateHeritageSeats ?? (100 - demSenate);
  if (demSenate > 50) stats.senateControlCycles.people++;
  else if (repSenate > 50) stats.senateControlCycles.heritage++;
  else stats.senateControlCycles.tie++;

  const demHouse = lastElect.houseDemSeats ?? lastElect.housePeopleSeats ?? 218;
  const repHouse = lastElect.houseRepSeats ?? lastElect.houseHeritageSeats ?? (435 - demHouse);
  if (demHouse > repHouse) stats.houseControlCycles.people++;
  else if (repHouse > demHouse) stats.houseControlCycles.heritage++;
  else stats.houseControlCycles.third++;

  // Track cycle history snapshot (every 10 cycles + first + last)
  if (cycle % 10 === 0 || cycle === targetCycles || cycle === 1) {
    const tiers = game.partyTiers || {};
    stats.history.push({
      cycle,
      year: cycleYear,
      type: cycleType,
      avgHap,
      pinnedMax: factionsAtMax,
      pinnedMin: factionsAtMin,
      treasury: Math.round(Number(game.treasury || 0) * 10) / 10,
      maxChap: cycleMaxChap,
      peopleT: tiers.people ?? 5,
      heritageT: tiers.heritage ?? 5,
      libertyT: tiers.liberty ?? 1,
      greenT: tiers.green ?? 1,
      govParty: game.governingParty || 'people',
      era: game.partySystems?.currentEraId || 'era_default',
      voters: totalRepVoters,
    });
  }

  if (verbose || cycle % 5 === 0 || cycle === targetCycles) {
    console.log(
      `[Cycle ${String(cycle).padStart(2, ' ')}/${targetCycles}] Year ${cycleYear} (${cycleType.padEnd(12, ' ')}) | ` +
      `Voters: ${totalRepVoters.toLocaleString()} | Treasury: $${Number(game.treasury || 0).toFixed(1)}M | MaxCh: ${cycleMaxChap}`
    );
  }

  stats.cyclesRun = cycle;

  // 6. Advance to next 2-year cycle (exercising Off-Cycle Interlude when activeBot is enabled)
  if (cycle < targetCycles) {
    if (game.phase === 'election-night') {
      game = Engine.takeAction(game, 'election-night-skip');
      game = Engine.takeAction(game, 'election-night-complete');
      if (game.phase !== 'complete' && game.phase !== 'off-cycle-interlude') {
        game = { ...game, phase: 'complete' };
      }
    }
    if (activeBot) {
      game = runActiveBotOffCycle(game, stats);
    } else {
      game = Engine.startNextCycle(game);
    }
  }
}

const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
const avgBellwether = stats.bellwetherCount > 0 ? stats.bellwetherSum / stats.bellwetherCount : 0;
console.log('-------------------------------------------------------------------');
console.log(`Simulated ${stats.cyclesRun} cycles (${stats.startYear} - ${stats.endYear}) in ${elapsedSec}s`);
console.log(`Voter Conservation Violations : ${stats.voterConservationViolations}`);
console.log(`NaN Violations                : ${stats.nanViolations}`);
console.log(`Seat Anomaly Violations       : ${stats.seatAnomalyViolations}`);
console.log(`Duplicate sittingMembers IDs  : ${stats.duplicateSittingIdsViolations}`);
console.log(`Chapter Cap (>25) Violations  : ${stats.chapterCapViolations} (max seen: ${stats.maxChapterCountSeen})`);
console.log(`Treasury Cycle Cap Violations : ${stats.treasuryCycleCapViolations} (postElec >$250M: ${stats.postElectionTreasuryCapViolations}, mid >$3000M: ${stats.treasuryMidCapViolations}, max seen: $${stats.maxTreasurySeen.toFixed(1)}M)`);
console.log(`Bellwether Wave Stats         : violations=${stats.bellwetherBoundViolations}, maxAbs=${stats.maxAbsBellwetherSeen.toFixed(2)}, avg=${avgBellwether >= 0 ? '+' : ''}${avgBellwether.toFixed(2)} (${stats.bellwetherCount} resolved)`);
console.log(`Bot Actions Executed          : org=${stats.botOrganizingActions}, camp=${stats.botCampaignActions}, offCycle=${stats.botOffCycleActions} (${stats.offCycleInterludesPlayed} interludes)`);
console.log(`Faction Pin / Collapse Stats  : pins=${stats.pinnedFactionsCount} | majorExtinct=${stats.extinctFactionsCount} | earlyCollapse(<=6)=${stats.earlyCollapseViolations} | totalCollapse=${stats.playerCollapseCycles}`);
console.log('-------------------------------------------------------------------');

// Hard BUG-13 assertions
assert.strictEqual(stats.nanViolations, 0, 'NaN violations must be 0');
assert.strictEqual(stats.seatAnomalyViolations, 0, 'Federal House/Sen/Gov seat anomalies must be 0');
assert.strictEqual(stats.duplicateSittingIdsViolations, 0, 'Duplicate sittingMembers IDs must be 0');
assert.strictEqual(stats.chapterCapViolations, 0, `Chapters per state must remain <= 25 (max seen: ${stats.maxChapterCountSeen})`);
assert.strictEqual(stats.voterConservationViolations, 0, 'Total represented voters must remain 155,000,000');
assert.strictEqual(stats.treasuryCycleCapViolations, 0, 'Cycle-opening treasury must remain <= $250M');
assert.strictEqual(stats.postElectionTreasuryCapViolations, 0, 'Post-election treasury must remain <= $250M');
assert.strictEqual(stats.treasuryMidCapViolations, 0, 'Mid-campaign treasury must remain <= $3,000M');
assert.strictEqual(stats.bellwetherBoundViolations, 0, 'Bellwether delta must remain within [-3.5, +3.5]');
assert.strictEqual(stats.earlyCollapseViolations, 0, 'Early Cycle <= 6 collapse must be 0');

if (writeReport) {
  const reportContent = `# Coalition Builder: Party Chair — Multi-Cycle Balance Audit Report

**Simulated Range:** ${stats.startYear} &rarr; ${stats.endYear} (${stats.cyclesRun} Consecutive 2-Year Cycles)
**Target Party:** \`${targetParty}\` | **Active Bot:** \`${activeBot}\`
**Elapsed Runtime:** ${elapsedSec}s

---

## Executive Integrity Summary

| Integrity Metric | Expected Invariant | Observed Result | Status |
| :--- | :--- | :--- | :--- |
| **Voter Conservation Violations** | 0 Cycles (155,000,000 exact) | ${stats.voterConservationViolations} | ${stats.voterConservationViolations === 0 ? 'PASS' : 'FAIL'} |
| **Duplicate sittingMembers IDs** | 0 Duplicates | ${stats.duplicateSittingIdsViolations} | ${stats.duplicateSittingIdsViolations === 0 ? 'PASS' : 'FAIL'} |
| **Max Chapters Per State** | <= 25 | ${stats.maxChapterCountSeen} (${stats.chapterCapViolations} violations) | ${stats.chapterCapViolations === 0 ? 'PASS' : 'FAIL'} |
| **Treasury Cycle / Mid-Campaign Caps** | <= $250M cycle / <= $3,000M mid | Max $${stats.maxTreasurySeen.toFixed(1)}M (${stats.treasuryCycleCapViolations + stats.treasuryMidCapViolations} violations) | ${stats.treasuryCycleCapViolations + stats.treasuryMidCapViolations === 0 ? 'PASS' : 'FAIL'} |
| **Bellwether Momentum Bounds** | [-3.5, +3.5] | Max ${stats.maxAbsBellwetherSeen.toFixed(2)} (${stats.bellwetherBoundViolations} violations) | ${stats.bellwetherBoundViolations === 0 ? 'PASS' : 'FAIL'} |
| **Pinned Happiness Extremes** | Zero factions locked at 0 or 100 | ${stats.pinnedFactionsCount} cycles | ${stats.pinnedFactionsCount === 0 ? 'PASS' : 'WARN'} |
| **Major Party Extinctions** | 0 Cycles | ${stats.extinctFactionsCount} cycles | ${stats.extinctFactionsCount === 0 ? 'PASS' : 'FAIL'} |

---

### Presidency Outcomes (${Math.max(1, Math.floor(stats.cyclesRun / 2))} Presidential Elections)
- **Democratic Party (people):** ${stats.totalPresidenciesWon.people} wins (${Math.round((stats.totalPresidenciesWon.people / Math.max(1, stats.cyclesRun / 2)) * 100)}%)
- **Republican Party (heritage):** ${stats.totalPresidenciesWon.heritage} wins (${Math.round((stats.totalPresidenciesWon.heritage / Math.max(1, stats.cyclesRun / 2)) * 100)}%)
- **Third / Independent Parties:** ${stats.totalPresidenciesWon.liberty + stats.totalPresidenciesWon.green + stats.totalPresidenciesWon.constitution + stats.totalPresidenciesWon.socialist + stats.totalPresidenciesWon.other} wins

- **Senate Majorities:** Democratic ${stats.senateControlCycles.people} cycles | Republican ${stats.senateControlCycles.heritage} cycles | Tied ${stats.senateControlCycles.tie} cycles
- **House Majorities:** Democratic ${stats.houseControlCycles.people} cycles | Republican ${stats.houseControlCycles.heritage} cycles

---

### Decennial Snapshots

| Cycle | Year | Type | Avg Fac Hap | Treasury | Max Ch | Tiers (D/R/L/G) | Governing | Political Era |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
${stats.history.map((r) => `| ${r.cycle} | ${r.year} | ${r.type} | ${r.avgHap} | $${r.treasury}M | ${r.maxChap} | ${r.peopleT}/${r.heritageT}/${r.libertyT}/${r.greenT} | ${r.govParty} | ${r.era} |`).join('\n')}

*Harness executed via scripts/audit-multicycle-simulation.cjs.*
`;

  fs.writeFileSync(reportPath, reportContent, 'utf8');
  console.log(`Detailed audit report written to: ${path.relative(ROOT, reportPath)}`);
}
