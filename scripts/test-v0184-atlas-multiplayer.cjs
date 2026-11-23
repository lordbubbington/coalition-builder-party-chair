const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

for (const f of [
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
  'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js', 'political-trends-system.js',
  'v07-scaffolding.js', 'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js',
  'party-systems-engine.js', 'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js',
  'election-drift.js', 'election-night-engine.js', 'campaign-overhaul.js',
  'atlas-multiplayer-system.js', 'engine.js',
]) {
  require(path.join(ROOT, f));
}

const Eng = window.PartyChairEngine;
const AMS = window.AtlasMultiplayerSystem;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== v0.18.4 Political Atlas & Hotseat Multiplayer Verification Suite ===');

// 1. Determinism / Zero Math.random() check
test('Zero Math.random() usage in atlas-multiplayer-system.js', () => {
  const src = fs.readFileSync(path.join(ROOT, 'atlas-multiplayer-system.js'), 'utf8');
  const codeOnly = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.strictEqual(/Math\.random\s*\(/.test(codeOnly), false, 'atlas-multiplayer-system.js must never call Math.random()');
  assert.strictEqual(AMS.fnv1aHash('test-seed'), AMS.fnv1aHash('test-seed'));
});

// 2. Snapshot recording & 30-cycle size budget (< 80 KB) + 40-cycle cap + compactGameForSave preservation
test('Proposal #10: 30-cycle Atlas snapshot recording stays < 80 KB, caps at 40 cycles, and survives compactGameForSave', () => {
  let g = Eng.createGame({ baseTemplateId: 'people', seed: 2028 });
  for (let i = 0; i < 30; i += 1) {
    g.year = 2028 + i * 2;
    g.governingParty = i % 2 === 0 ? 'people' : 'heritage';
    g.lastElection = {
      year: g.year,
      presidentialWinner: g.governingParty,
      evByParty: g.governingParty === 'people' ? { people: 306, heritage: 232 } : { heritage: 295, people: 243 },
      presidentialResults: Object.fromEntries((g.states || []).map((s, idx) => [
        s.id,
        { winner: (idx + i) % 2 === 0 ? 'people' : 'heritage', margin: Number(((idx % 7) + 0.4).toFixed(1)) },
      ])),
      popularVoteShares: { people: 51.2, heritage: 46.8, liberty: 2.0 },
    };
    g = AMS.recordAtlasSnapshot(g);
  }
  assert.strictEqual(g.atlasHistory.length, 30, 'Should record 30 cycle snapshots');
  const bytes30 = Buffer.byteLength(JSON.stringify(g.atlasHistory), 'utf8');
  assert.ok(bytes30 < 80 * 1024, `30-cycle atlasHistory must be < 80 KB (got ${bytes30} bytes)`);

  const sample = g.atlasHistory[0];
  for (const key of [
    'year', 'eraId', 'presWinner', 'evByParty', 'houseSeatsByParty',
    'senateSeatsByParty', 'playerVoteShare', 'playerTier',
    'factionOwnershipMap', 'statePresWinners', 'biggestUpset',
  ]) {
    assert.ok(Object.prototype.hasOwnProperty.call(sample, key), `Snapshot missing required key: ${key}`);
  }

  // Test 40-cycle cap (push 15 more -> 45 total, should cap at 40)
  for (let i = 30; i < 45; i += 1) {
    g.year = 2028 + i * 2;
    g = AMS.recordAtlasSnapshot(g);
  }
  assert.strictEqual(g.atlasHistory.length, 40, 'atlasHistory must be capped at 40 cycles');

  const compacted = Eng.compactGameForSave(g);
  assert.strictEqual(compacted.atlasHistory.length, 40, 'compactGameForSave must preserve atlasHistory');
});

// 3. Chair Legacy Score (0-1000) & Epithets
test('Proposal #10: computeChairLegacy weights trifectas, Tier 0/1->5 ascent, coalition retention, longevity, and assigns epithets', () => {
  // High-scoring Architect of Realignment (minor party ascending Tier 1 -> Tier 5 with trifectas)
  let asc = Eng.createGame({ baseTemplateId: 'green', seed: 303 });
  asc.legacyMeta = { startingTier: 1, peakTier: 5, longestServingOfficial: null, coalitionEvents: [] };
  asc.partyTiers = { ...(asc.partyTiers || {}), green: { tier: 5 } };
  asc.atlasHistory = [2028, 2032, 2036, 2040].map((yr, idx) => ({
    year: yr,
    eraId: idx < 2 ? 'era_contemporary' : 'era_realignment',
    presWinner: 'green',
    evByParty: { green: 340, people: 110, heritage: 88 },
    houseSeatsByParty: { green: 245, people: 100, heritage: 90 },
    senateSeatsByParty: { green: 56, people: 22, heritage: 22 },
    playerVoteShare: 48.5,
    playerTier: 5,
    factionOwnershipMap: { green_ecosocialists: 'green', green_pragmatists: 'green' },
    statePresWinners: { CA: 'green', NY: 'green', PA: 'green' },
    biggestUpset: { stateId: 'PA', raceType: 'president', winner: 'green', margin: 0.6, expectedParty: 'heritage' },
  }));
  const legHigh = AMS.computeChairLegacy(asc, 'green');
  assert.ok(legHigh.score >= 700 && legHigh.score <= 1000, `Expected high score (got ${legHigh.score})`);
  assert.strictEqual(legHigh.epithet, 'Architect of Realignment');
  assert.strictEqual(legHigh.highlights.federalTrifectas, 4);
  assert.strictEqual(legHigh.highlights.erasSurvived.length, 2);
  assert.ok(legHigh.highlights.biggestEvLandslide && legHigh.highlights.biggestEvLandslide.ev === 340);
  assert.ok(legHigh.highlights.narrowestUpset && legHigh.highlights.narrowestUpset.stateId === 'PA');

  // Party Collapse -> Party Gravedigger
  let collapsed = Eng.createGame({ baseTemplateId: 'people', seed: 404 });
  collapsed.gameOver = true;
  collapsed.gameOverReason = 'party_collapse';
  const legLow = AMS.computeChairLegacy(collapsed, 'people');
  assert.ok(legLow.score <= 150, `Expected collapsed score <= 150 (got ${legLow.score})`);
  assert.strictEqual(legLow.epithet, 'Party Gravedigger');
});

// 4. Backward compatibility in normalizeGame()
test('Backward compatibility: normalizeGame preserves single-player defaults when atlasHistory/multiplayer absent', () => {
  const raw = Eng.createGame({ baseTemplateId: 'people', seed: 505 });
  delete raw.atlasHistory;
  delete raw.multiplayer;
  delete raw.legacyMeta;
  const norm = Eng.normalizeGame(raw);
  assert.ok(Array.isArray(norm.atlasHistory), 'atlasHistory initialized');
  assert.strictEqual(norm.multiplayer.enabled, false, 'multiplayer disabled by default');
  assert.strictEqual(AMS.isMultiplayerEnabled(norm), false);
});

// 5. Hotseat turn handoff, syncPartyStateWithLegacy rebinding, and privacy isolation
test('Proposal #12: Hotseat organizing handoff rebinds syncPartyStateWithLegacy cleanly with zero privacy leakage', () => {
  let g = Eng.createGame({ baseTemplateId: 'people', seed: 606 });
  g = AMS.initHotseatMultiplayer(g, 'people', 'heritage');
  assert.strictEqual(AMS.isMultiplayerEnabled(g), true);
  assert.deepStrictEqual(g.multiplayer.humanPartyIds, ['people', 'heritage']);

  // Player 1 (people) sets custom treasury, actions, and private oppo/notes
  g.treasury = 123.4;
  g.organizingActionsRemaining = 14;
  g.campaign = g.campaign || { active: false, month: 1, week: 1 };
  g.campaign.oppoDossiers = [{ id: 'secret_p1_dossier', target: 'heritage', severity: 9 }];
  g.chairPrivateNotes = 'P1 SECRET STRATEGY: Blitz PA & MI';
  g.parties.heritage.treasury = 211.5;
  g.parties.heritage.organizingActionsRemaining = 19;

  // Player 1 locks turn -> Privacy Curtain activates, top-level private data scrubbed
  g = AMS.endHotseatTurn(g);
  assert.strictEqual(g.multiplayer.privacyCurtainActive, true, 'Privacy curtain must activate after P1 locks');
  assert.strictEqual(g.multiplayer.activeHumanIndex, 1, 'Active human index must advance to Player 2');
  assert.strictEqual(g.campaign.oppoDossiers.length, 0, 'P1 oppo dossiers must be scrubbed during Privacy Curtain');
  assert.strictEqual(g.chairPrivateNotes, '', 'P1 private notes must be scrubbed during Privacy Curtain');
  assert.strictEqual(g.parties.people.treasury, 123.4, 'P1 treasury flushed to game.parties.people');

  // Player 2 reveals turn -> rebound to heritage, zero leakage of P1 intel
  g = AMS.revealHotseatTurn(g);
  assert.strictEqual(g.multiplayer.privacyCurtainActive, false, 'Privacy curtain lifts on reveal');
  assert.strictEqual(g.player.baseTemplateId, 'heritage', 'Active player rebound to heritage');
  assert.strictEqual(g.treasury, 211.5, 'Top-level treasury rebound to P2 treasury');
  assert.strictEqual(g.organizingActionsRemaining, 19, 'Top-level organizing actions rebound to P2');
  assert.strictEqual(g.campaign.oppoDossiers.length, 0, 'P2 must not see P1 oppo dossiers');
  assert.strictEqual(g.chairPrivateNotes, '', 'P2 must not see P1 private notes');

  // Player 2 adds own private note & spends treasury, then locks -> AI opponents run without touching P1/P2
  g.treasury = 199.0;
  g.chairPrivateNotes = 'P2 SECRET STRATEGY: Defend OH & IA';
  g = AMS.endHotseatTurn(g);
  assert.strictEqual(g.multiplayer.privacyCurtainActive, true, 'Privacy curtain activates for next round');
  assert.strictEqual(g.multiplayer.activeHumanIndex, 0, 'Rotates back to Player 1');
  assert.strictEqual(g.parties.people.treasury, 123.4, 'AI simulation must not overwrite P1 treasury');
  assert.strictEqual(g.parties.heritage.treasury, 199.0, 'AI simulation must not overwrite P2 treasury');

  // Player 1 reveals again -> gets own private oppo & notes back
  g = AMS.revealHotseatTurn(g);
  assert.strictEqual(g.player.baseTemplateId, 'people');
  assert.strictEqual(g.treasury, 123.4);
  assert.strictEqual(g.campaign.oppoDossiers.length, 1);
  assert.strictEqual(g.campaign.oppoDossiers[0].id, 'secret_p1_dossier');
  assert.strictEqual(g.chairPrivateNotes, 'P1 SECRET STRATEGY: Blitz PA & MI');
});

// 6. Simultaneous Campaign Monthly Resolution
test('Proposal #12: Campaign War Room queues orders from both players and resolves simultaneously', () => {
  let g = Eng.createGame({ baseTemplateId: 'people', seed: 707 });
  g = AMS.initHotseatMultiplayer(g, 'people', 'heritage');
  g.phase = 'general-campaign';
  g.campaign = { active: true, month: 1, week: 1, maxWeeks: 5, airwavesSpendByState: {}, fieldOfficesByState: {}, stateSaturation: {} };
  g.parties.people.treasury = 80;
  g.parties.heritage.treasury = 80;

  g = AMS.queueHotseatMonthlyOrder(g, 'people', { type: 'airwaves', stateId: 'PA', spendMillions: 5 });
  g = AMS.endHotseatTurn(g);
  assert.strictEqual(g.multiplayer.privacyCurtainActive, true);
  g = AMS.revealHotseatTurn(g);

  g = AMS.queueHotseatMonthlyOrder(g, 'heritage', { type: 'airwaves', stateId: 'PA', spendMillions: 4 });
  g = AMS.endHotseatTurn(g);

  assert.strictEqual(Object.keys(g.multiplayer.pendingMonthlyOrders).length, 0, 'Pending orders cleared after simultaneous resolution');
  assert.ok((g.campaign.airwavesSpendByState.PA?.people || 0) >= 5, 'P1 PA airwaves applied');
  assert.ok((g.campaign.airwavesSpendByState.PA?.heritage || 0) >= 4, 'P2 PA airwaves applied');
});

// 7. Async Turn File (.cbturn.json) export/import round-trip & tamper detection
test('Proposal #12: .cbturn.json export/import round-trip preserves state and rejects tampered checksums', () => {
  let g = Eng.createGame({ baseTemplateId: 'people', seed: 808 });
  g = AMS.initHotseatMultiplayer(g, 'people', 'green');
  g.treasury = 77.7;
  g.chairPrivateNotes = 'TOP SECRET';
  g = AMS.endHotseatTurn(g);

  const exported = AMS.exportTurnFile(g);
  const parsed = JSON.parse(exported);
  assert.strictEqual(parsed.format, 'cbturn-v1');
  assert.strictEqual(parsed.nextPartyId, 'green');
  assert.strictEqual(parsed.game.chairPrivateNotes, '', 'Exported file must scrub top-level private notes');

  const imported = AMS.importTurnFile(exported);
  assert.strictEqual(imported.ok, true, `Import failed: ${imported.error}`);
  assert.strictEqual(imported.game.multiplayer.enabled, true);
  assert.strictEqual(imported.game.multiplayer.privacyCurtainActive, true);
  assert.strictEqual(imported.game.parties.people.treasury, 77.7);

  // Tamper checksum
  parsed.checksum = '00000000';
  const tampered = AMS.importTurnFile(JSON.stringify(parsed));
  assert.strictEqual(tampered.ok, false, 'Tampered turn file must be rejected');
});

console.log(`\nALL ${passed} TESTS PASSED!`);
