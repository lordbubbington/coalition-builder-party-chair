const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

function loadScriptsFromIndexHtml() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const scriptRegex = /<script\s+src="([^"]+)"><\/script>/gi;
  const loaded = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const src = match[1].split('?')[0];
    if (src === 'app.js' || src === 'ui-setup-views.js') continue;
    const fullPath = path.join(ROOT, src);
    if (!fs.existsSync(fullPath)) continue;
    const code = fs.readFileSync(fullPath, 'utf8');
    vm.runInThisContext(code, { filename: fullPath });
    loaded.push(src);
  }
  return loaded;
}

loadScriptsFromIndexHtml();

const Engine = window.PartyChairEngine;
const Data = window.PartyChairData;
const V07 = window.PartyChairV07;
const OffCycle = window.OffCycleInterludeSystem;
const PSE = window.PartySystemsEngine;

let passed = 0;
function test(name, fn) {
  fn();
  console.log(`  PASS: ${name}`);
  passed++;
}

console.log('=== v0.18.7 QA BUGFIXES & BALANCE REGRESSION SUITE (BUG-01..BUG-12) ===');

test('BUG-01: Peace & Freedom (socialist) Turn 1 alignment & 4-turn survival protection', () => {
  const g = Engine.createGame('socialist', { seed: 7001 });
  assert.strictEqual(g.player.baseTemplateId, 'socialist');
  const socFacs = (g.factions || []).filter((f) => f.partyId === 'socialist');
  assert.ok(socFacs.length >= 2, `Expected >=2 socialist factions, got ${socFacs.length}`);

  const ecoSoc = socFacs.find((f) => f.id === 'soc_socialists');
  const marLen = socFacs.find((f) => f.id === 'soc_communists');
  assert.ok(ecoSoc && marLen, 'Expected soc_socialists and soc_communists factions');
  assert.strictEqual(ecoSoc.status, 'leading', 'soc_socialists should be leading wing');
  assert.ok((ecoSoc.startingHappiness ?? 0) >= 48, `Expected soc_socialists startingHappiness >= 48, got ${ecoSoc.startingHappiness}`);
  assert.ok((marLen.startingHappiness ?? 0) >= 46, `Expected soc_communists startingHappiness >= 46, got ${marLen.startingHappiness}`);
  assert.strictEqual(ecoSoc.sliders.social, 2, 'soc_socialists social slider aligned to 2');
  assert.ok(ecoSoc.sliders.economic <= 1.2, 'soc_socialists economic slider aligned <= 1.2');
  assert.strictEqual(Engine.getPartyKeyIssueStance(g, 'Climate Policy'), 2);

  let cur = g;
  for (let i = 0; i < 4; i++) {
    cur = Engine.evaluateFactionFriction(cur);
    cur = Engine.advanceChairTurn(cur);
  }
  assert.ok(!cur.gameOver, 'Peace & Freedom should survive early protected turns without Turn 1/Cycle 1 collapse');
  const remaining = (cur.factions || []).filter((f) => f.partyId === 'socialist');
  assert.ok(remaining.length >= 1, 'At least one Peace & Freedom faction must survive');
  const leadAfter = remaining.find((f) => f.id === 'soc_socialists') || remaining[0];
  assert.ok(Number(leadAfter.frictionIndex || 0) <= 55, `Protected window friction should cap <= 55, got ${leadAfter.frictionIndex}`);
  assert.strictEqual(leadAfter.ultimatumTurnsRemaining ?? null, null, 'No Turn 1 ultimatum during early protected window');
});

test('BUG-02: Tier-0 Ascension Gauntlet requires real growth and never skips straight past Tier 1', () => {
  for (const minorId of ['socialist', 'constitution']) {
    const g = Engine.createGame(minorId, { seed: 7002 });
    assert.strictEqual(V07.getPartyInstitutionalTier(g, minorId), 0, `${minorId} should start at Tier 0`);

    const g0 = Engine.advanceChairTurn(g);
    const eval0 = V07.evaluateAscensionGauntlet(g0, minorId);
    assert.strictEqual(eval0.completed, false, `${minorId} should NOT auto-complete Gauntlet with 0 expansion`);
    const tiers0 = V07.evaluatePartyInstitutionalTiers(g0);
    assert.strictEqual(tiers0[minorId], 0, `${minorId} must remain Tier 0 with 0 expansion`);

    // Grant grassroots +250k voters AND simulated Tier-5 House critical mass — exit from Tier 0 must still cap strictly at Tier 1
    const gBoosted = JSON.parse(JSON.stringify(g0));
    gBoosted.voterModel.affiliations = gBoosted.voterModel.affiliations || {};
    const prevRep = Number(gBoosted.voterModel.affiliations[minorId]?.representedVoters ?? gBoosted.startingPartyVoters?.[minorId] ?? 241200);
    gBoosted.voterModel.affiliations[minorId] = {
      ...(gBoosted.voterModel.affiliations[minorId] || {}),
      representedVoters: prevRep + 250000,
    };
    gBoosted.representatives = Array.from({ length: 40 }, (_, i) => ({
      id: `sim-rep-${minorId}-${i}`,
      stateId: 'CA',
      partyId: minorId,
      office: 'house',
    }));
    const tiers1 = V07.evaluatePartyInstitutionalTiers(gBoosted);
    assert.strictEqual(tiers1[minorId], 1, `${minorId} Tier-0 exit must cap at Tier 1 on Cycle 1`);
  }
});

test('BUG-03: Zero duplicate sittingMembers IDs & clean seat deduplication preferring newer year', () => {
  const sample = [
    { id: 'dup-id', name: 'Old Member', office: 'house', stateId: 'PA', districtId: 'PA-01', electionYear: 2024 },
    { id: 'dup-id', name: 'New Member', office: 'house', stateId: 'PA', districtId: 'PA-01', electionYear: 2028 },
    { id: 'gov-old', name: 'Old Gov', office: 'governor', stateId: 'VA', electionYear: 2025 },
    { id: 'gov-new', name: 'New Gov', office: 'governor', stateId: 'VA', electionYear: 2029 },
    { id: 'sen-old', name: 'Old Sen', office: 'senate', stateId: 'OH', senateClass: 1, electionYear: 2024 },
    { id: 'sen-new', name: 'New Sen', office: 'senate', stateId: 'OH', senateClass: 1, electionYear: 2028 },
  ];
  const dedupedEng = Engine.deduplicateSittingMembers(sample);
  const dedupedOc = OffCycle.deduplicateSittingMembers(sample);
  assert.strictEqual(dedupedEng.length, 3, 'Engine deduplicator should yield 3 unique seat holders');
  assert.strictEqual(dedupedOc.length, 3, 'OffCycle deduplicator should yield 3 unique seat holders');
  assert.strictEqual(dedupedEng.find((m) => m.office === 'house').name, 'New Member');
  assert.strictEqual(dedupedEng.find((m) => m.office === 'governor').name, 'New Gov');
  assert.strictEqual(dedupedEng.find((m) => m.office === 'senate').name, 'New Sen');

  let g = Engine.createGame('people', { seed: 7003 });
  g = Engine.replenishVacantSittingMembers(g, 2028);
  g = Engine.resolveVersion01GeneralElection(g);
  const seenIds = new Set();
  for (const m of (g.sittingMembers || [])) {
    assert.ok(!seenIds.has(m.id), `Duplicate sittingMembers id detected: ${m.id}`);
    seenIds.add(m.id);
  }
  const h = (g.sittingMembers || []).filter((m) => m && m.office === 'house').length;
  const s = (g.sittingMembers || []).filter((m) => m && m.office === 'senate').length;
  const gv = (g.sittingMembers || []).filter((m) => m && m.office === 'governor').length;
  assert.strictEqual(h, 435, `Expected 435 House seats, got ${h}`);
  assert.strictEqual(s, 100, `Expected 100 Senate seats, got ${s}`);
  assert.strictEqual(gv, 50, `Expected 50 Governor seats, got ${gv}`);

  // Also verify 2030 decennial redistricting + startNextCycle keeps exact 435 House seats (no pre-redistricting ghosts)
  let gDec = Engine.startNextCycle({ ...g, phase: 'complete' }); // -> 2030
  gDec = Engine.resolveVersion01GeneralElection(gDec); // decennial 2030 redistricting
  gDec = Engine.startNextCycle({ ...gDec, phase: 'complete' }); // -> 2032
  const hDec = (gDec.sittingMembers || []).filter((m) => m && m.office === 'house').length;
  assert.strictEqual(hDec, 435, `Expected 435 House seats post-2030 redistricting + cycle advance, got ${hDec}`);
});

test('BUG-04 & BUG-05: Clamped chapterDiff/Bellwether bounds & Tier-5 ascended off-cycle contenders', () => {
  const g = Engine.createGame('liberty', { seed: 7004 });
  g.partyTiers = { ...(g.partyTiers || {}), liberty: 5 };
  g.treasury = 120;
  // Extreme 25 vs 0 chapter & 100 vs 0 trust disparity should still stay strictly bounded
  g.stateOrganizations = g.stateOrganizations || {};
  g.stateOrganizations.VA = {
    ...(g.stateOrganizations.VA || {}),
    liberty: { chapters: 25, strength: 100 },
    heritage: { chapters: 0, strength: 0 },
  };
  g.stateChapters = { ...(g.stateChapters || {}), VA: 25 };
  g.trust = { supporters: 100, independents: 75, opponents: 50 };

  let oc = OffCycle.initializeOffCycleInterlude(g, 2029);
  assert.strictEqual(oc.offCycle.oddYear, 2029);
  const vaRace = oc.offCycle.races.find((r) => r.stateId === 'VA');
  assert.ok(vaRace && vaRace.candidates && vaRace.candidates.liberty, 'Tier-5 ascended Liberty must field an active candidate in 2029 VA off-cycle race');

  oc = OffCycle.setPosture(oc, 'special_blitz');
  oc = OffCycle.handleAction(oc, 'oc-ad-blitz', { raceId: vaRace.id });
  const resolved = OffCycle.resolveOffCycleInterlude(oc);
  const wave = Number(resolved.pendingBellwetherBonus?.bellwetherWave ?? 0);
  assert.ok(Math.abs(wave) <= 3.5 + 1e-6, `Expected bellwetherWave within [-3.5, +3.5], got ${wave}`);
  const vaAfter = resolved.offCycle.races.find((r) => r.id === vaRace.id);
  const libShare = Number(vaAfter.result?.shares?.liberty || 0);
  assert.ok(libShare > 5, `Tier-5 ascended Liberty should earn significant contender share in VA, got ${libShare}%`);

  // Confirm 4n+3 pattern (2031 KY/LA/MS) also works cleanly
  const oc31 = OffCycle.initializeOffCycleInterlude({ ...g, year: 2030 }, 2031);
  const states31 = new Set((oc31.offCycle.races || []).map((r) => r.stateId));
  assert.ok(states31.has('KY') && states31.has('LA') && states31.has('MS'), '2031 interlude must include KY, LA, MS');
});

test('BUG-06: MAX_STATE_CHAPTERS = 25 enforced across organizing, off-cycle & SOEE machine ops', () => {
  assert.strictEqual(Engine.MAX_STATE_CHAPTERS, 25);
  assert.strictEqual(OffCycle.MAX_STATE_CHAPTERS, 25);

  const g = Engine.createGame('people', { seed: 7006 });
  g.treasury = 100;
  g.actionsLeft = 4;
  g.stateChapters = { ...(g.stateChapters || {}), PA: 25 };
  g.stateOrganizations = { ...(g.stateOrganizations || {}), PA: { ...(g.stateOrganizations?.PA || {}), people: { chapters: 25, strength: 100 } } };

  const afterOrg = Engine.takeAction(g, 'chapter', { stateId: 'PA' });
  assert.strictEqual(afterOrg.treasury, 100, 'Organizing chapter at 25/25 must not deduct treasury');
  assert.strictEqual(afterOrg.actionsLeft, 4, 'Organizing chapter at 25/25 must not deduct actionsLeft');
  assert.strictEqual(afterOrg.stateChapters.PA, 25);
  assert.ok(/Max Chapters Reached/i.test(afterOrg.lastNote || ''), 'Should surface Max Chapters Reached note');

  const gOc = OffCycle.initializeOffCycleInterlude(g, 2029);
  const gOcPost = OffCycle.setPosture(gOc, 'balanced');
  const beforeOcCash = gOcPost.treasury;
  const beforeOcActs = gOcPost.offCycle.actionsRemaining;
  const afterOc = Engine.takeAction(gOcPost, 'off-cycle-chapter-drive', { stateId: 'PA' });
  assert.strictEqual(afterOc.treasury, beforeOcCash, 'Off-cycle chapter drive at 25/25 must not deduct cash');
  assert.strictEqual(afterOc.offCycle.actionsRemaining, beforeOcActs, 'Off-cycle chapter drive at 25/25 must not deduct action');

  const afterSoee = Engine.applyMachineOperation(g, 'people', 'build_chapter', { stateId: 'PA' });
  assert.strictEqual(afterSoee.stateOrganizations?.PA?.people?.chapters, 25, 'SOEE build_chapter must not exceed 25');
});

test('BUG-07: Post-election treasury carryover cap ($250M Tier 5, $50M Tier 3-4, $20M Tier 0-2) + Supporter goodwill', () => {
  const gMajor = Engine.createGame('people', { seed: 7007 });
  gMajor.treasury = 900;
  gMajor.trust = { supporters: 60, independents: 50, opponents: 20 };
  const afterMaj = Engine.resolveVersion01GeneralElection(gMajor);
  assert.ok(afterMaj.treasury <= 250, `Major post-election treasury must cap <= $250M, got ${afterMaj.treasury}`);
  assert.ok(afterMaj.trust && typeof afterMaj.trust === 'object', 'Closeout goodwill must preserve trust as an object');
  assert.ok(Number.isFinite(afterMaj.trust.supporters) && afterMaj.trust.supporters >= 62, `Supporter trust goodwill must add cleanly without NaN, got ${afterMaj.trust?.supporters}`);
  assert.ok(afterMaj.player?.trust && typeof afterMaj.player.trust === 'object' && Number.isFinite(afterMaj.player.trust.supporters), 'player.trust must remain a valid object');
  assert.ok((afterMaj.yearLog || []).some((e) => /Post-Election Campaign Account Closeout/i.test(e.action || '')), 'Closeout note expected in yearLog');

  const gMinor = Engine.createGame('green', { seed: 7008 });
  gMinor.treasury = 180;
  const afterMin = Engine.resolveVersion01GeneralElection(gMinor);
  assert.ok(afterMin.treasury <= 20, `Tier 1 minor post-election treasury must cap <= $20M, got ${afterMin.treasury}`);

  const gMid = Engine.createGame('liberty', { seed: 7009 });
  gMid.partyTiers = { ...(gMid.partyTiers || {}), liberty: 3 };
  gMid.treasury = 160;
  const afterMid = Engine.resolveVersion01GeneralElection(gMid);
  assert.ok(afterMid.treasury <= 50, `Tier 3 post-election treasury must cap <= $50M, got ${afterMid.treasury}`);
});

test('BUG-08: Tier-5 drop-down on presidential cycle collapse & focusStates trim on cycle rollover', () => {
  const g = Engine.createGame('liberty', { seed: 7010 });
  g.year = 2032;
  g.partyTiers = { ...(g.partyTiers || {}), liberty: 5 };
  // Give Liberty <20% nationalVote and insufficient seats so computed raw tier drops well below 5
  g.elections = [{ year: 2032, type: 'presidential', nationalVote: { people: 48, heritage: 47, liberty: 3.5 } }];
  g.focusStates = ['PA', 'WI', 'MI', 'AZ', 'GA', 'NV', 'NC', 'NH', 'MN', 'CO'];
  const evalTiers = V07.evaluatePartyInstitutionalTiers(g);
  assert.strictEqual(evalTiers.liberty, 4, `Collapsed Tier-5 party on pres cycle should drop 1 tier (5 -> 4), got ${evalTiers.liberty}`);

  const gNext = Engine.startNextCycle({
    ...g,
    phase: 'complete',
    partyTiers: { ...(g.partyTiers || {}), liberty: 1 },
    generalElectionResolved: true,
    lastElection: { year: 2032, type: 'presidential', nationalVote: { people: 48, heritage: 47, liberty: 3.5 } },
  });
  const maxFocus = Engine.getMaxFocusSlots(gNext, 'player');
  assert.ok((gNext.focusStates || []).length <= maxFocus, `focusStates should trim to maxFocus (${maxFocus}), got ${(gNext.focusStates || []).length}`);
});

test('BUG-09: Expired era boost decay halves greenBaselineBoost, baseShare & crossEndorsementBoost', () => {
  const g = Engine.createGame('people', { seed: 7011 });
  g.partySystems.currentEraId = 'era_07_baseline';
  g.partySystems.eraState = {
    ...(g.partySystems.eraState || {}),
    greenBaselineBoost: 8.0,
    greenZeroCostChapters: true,
    greenSmallDollarMultiplier: 2.5,
    crossEndorsementBoost: 4.0,
  };
  g.rivals = (g.rivals || []).map((r) => (r.id === 'green' ? { ...r, baseShare: 10.0 } : r));
  const decayed = PSE.decayExpiredEraBoosts(g);
  assert.strictEqual(decayed.partySystems.eraState.greenBaselineBoost, 4.0);
  assert.strictEqual(decayed.partySystems.eraState.greenZeroCostChapters, false);
  assert.strictEqual(decayed.partySystems.eraState.greenSmallDollarMultiplier, 1.0);
  assert.strictEqual(decayed.partySystems.eraState.crossEndorsementBoost, 2.0);
  const greenRival = decayed.rivals.find((r) => r.id === 'green');
  assert.strictEqual(greenRival.baseShare, 6.0, 'Green rival baseShare above 2.0 should decay halfway toward 2.0');
});

test('BUG-10: Foothold Duverger defection halving when >= 2 House seats held in state', () => {
  const gBase = Engine.createGame('green', { seed: 7012 });
  gBase.partyTiers = { ...(gBase.partyTiers || {}), green: 1 };
  gBase.representatives = (gBase.representatives || []).filter((r) => r.stateId !== 'CA' && r.state !== 'CA');
  const defNoFoothold = Engine.computeStrategicVotingDefection(gBase, 'green', 'CA', 'presidential', 6.0);

  const gFoothold = JSON.parse(JSON.stringify(gBase));
  gFoothold.representatives.push(
    { id: 'grn-ca-1', stateId: 'CA', partyId: 'green', office: 'house' },
    { id: 'grn-ca-2', stateId: 'CA', partyId: 'green', office: 'house' },
  );
  const defFoothold = Engine.computeStrategicVotingDefection(gFoothold, 'green', 'CA', 'presidential', 6.0);
  assert.ok(defFoothold.defectionRate < defNoFoothold.defectionRate * 0.6, `Expected halved defection with >=2 CA House seats (${defFoothold.defectionRate} vs ${defNoFoothold.defectionRate})`);
});

test('BUG-11: Coalition summit splash (+2 Happiness, -5 Friction) & healthy faction friction cooling', () => {
  const g = Engine.createGame('people', { seed: 7013 });
  const peoFacs = (g.factions || []).filter((f) => f.partyId === 'people');
  assert.ok(peoFacs.length >= 2, 'Expected >= 2 Democratic factions');

  // Identify a real aligned Democratic faction (dist <= 2.8 cools friction on evaluateFactionFriction)
  const aligned = peoFacs.find((f) => {
    const probe = JSON.parse(JSON.stringify(g));
    probe.factions = probe.factions.map((x) => (x.id === f.id ? { ...x, frictionIndex: 40 } : x));
    probe.factionHappiness[f.id] = 56;
    const res = Engine.evaluateFactionFriction(probe);
    const out = res.factions.find((x) => x.id === f.id);
    return Number(out.frictionIndex) < 40;
  });
  assert.ok(aligned, 'Expected at least one Democratic faction aligned within dist <= 2.8 of platform');
  const target = peoFacs.find((f) => f.id !== aligned.id);

  const gWork = JSON.parse(JSON.stringify(g));
  gWork.factions = gWork.factions.map((f) => (f.id === aligned.id ? { ...f, frictionIndex: 40 } : f));
  gWork.factionHappiness[target.id] = 45;
  gWork.factionHappiness[aligned.id] = 56;
  gWork.treasury = 50;
  gWork.actionsLeft = 4;

  // Test friction cooling (-10/turn when dist <= 2.8 & hap >= 52)
  const cooled = Engine.evaluateFactionFriction(gWork);
  const cooledAligned = cooled.factions.find((f) => f.id === aligned.id);
  assert.ok(Number(cooledAligned.frictionIndex) <= 30, `Expected aligned healthy faction friction to cool <= 30, got ${cooledAligned.frictionIndex}`);

  // Test summit action splash (+2 happiness & -5 friction to aligned neighbor)
  const preHap = gWork.factionHappiness[aligned.id];
  const preFric = 40;
  const afterSummit = Engine.takeAction(gWork, 'summit', { factionId: target.id });
  const afterAligned = afterSummit.factions.find((f) => f.id === aligned.id);
  assert.ok(afterSummit.factionHappiness[aligned.id] >= preHap + 2, 'Aligned neighbor should receive +2 splash happiness from summit');
  assert.ok(Number(afterAligned.frictionIndex) <= preFric - 5, 'Aligned neighbor should receive -5 friction relief from summit');
});

test('BUG-12: evaluateViabilityBreakthroughs populates at Tier 5+ and normalizes player House/15% triggers', () => {
  const g = Engine.createGame('liberty', { seed: 7014 });
  g.partyTiers = { ...(g.partyTiers || {}), liberty: 5 };
  const evalRes = Engine.evaluateViabilityBreakthroughs(g, {
    presidential: { byState: { NH: { shares: { player: 16.2 } } } },
    senate: [],
    governors: [],
    legislature: { districts: [{ stateId: 'ME', partyId: 'player' }] },
  });
  assert.strictEqual(evalRes.viabilityBreakthroughs.liberty.NH.trigger, 'viability-share-threshold');
  assert.strictEqual(evalRes.viabilityBreakthroughs.liberty.ME.trigger, 'house-delegation-breakthrough');
  assert.strictEqual(evalRes.viabilityBreakthroughs.liberty.NH.active, true);
  assert.strictEqual(evalRes.viabilityBreakthroughs.liberty.ME.active, true);
});

console.log(`\nALL ${passed}/11 v0.18.7 QA BUGFIX TESTS PASSED.`);
