'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const ctx = {
  console, Math, Date, JSON, Set, Map, Array, Object, Number, String, Boolean, RegExp, Error, TypeError,
  parseInt, parseFloat, isNaN, isFinite, Uint8Array, TextDecoder,
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: { querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, setAttribute: () => {} }), head: { appendChild: () => {} }, getElementById: () => null, addEventListener: () => {} },
};
ctx.window = ctx; ctx.global = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);

const indexHtml = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
for (const rel of [...indexHtml.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1])) {
  if (rel.includes('maps-0.3.js') || rel.includes('app.js')) continue;
  const full = path.join(REPO, rel.split('?')[0]);
  if (fs.existsSync(full)) vm.runInContext(fs.readFileSync(full, 'utf8'), ctx, { filename: rel });
}

const E = ctx.PartyChairEngine;
const V07 = ctx.PartyChairV07;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS [${passed}]: ${name}`);
}

test('Hotfix #1: Democratic Party gets 3 Caucus Leader slots + 1 solo >=5M Faction slot (Abundance) and 0 slots for factions inside caucuses', () => {
  const g = E.createGame({ baseTemplateId: 'people', seed: 2028 });
  const dyn = V07.getDynamicCaucusAndFactionRoles(g, 'people');
  const caucusRoles = dyn.filter((r) => r.category === 'caucus');
  const factionRoles = dyn.filter((r) => r.category === 'faction');
  assert.strictEqual(caucusRoles.length, 3, `Expected 3 Dem caucus leader slots, got ${caucusRoles.length}`);
  assert.strictEqual(factionRoles.length, 1, `Expected 1 solo >=5M Dem faction slot (Abundance), got ${factionRoles.map((r) => r.id).join(', ')}`);
  assert.strictEqual(factionRoles[0].factionId, 'dem_abundance', 'Only Abundance (6.6M solo) should have an individual faction leader slot');
  assert(!factionRoles.some((r) => ['dem_liberal_establishment', 'dem_black_voters', 'dem_capital_l_left', 'dem_neo_liberals', 'dem_blue_dog'].includes(r.factionId)), 'Factions inside caucuses must NOT get individual faction leader slots');
});

test('Hotfix #2: Green Party gets 0 faction/caucus slots initially, and gains a Caucus Leader slot regardless of size when a multi-faction caucus forms', () => {
  let g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  const baseRoles = (V07.LEADERSHIP_ROLES_SCHEMA || []).filter((r) => r.category !== 'faction');
  const dynBefore = V07.getDynamicCaucusAndFactionRoles(g, 'green');
  const unlockedBefore = [...baseRoles, ...dynBefore].filter((r) => V07.isRoleUnlockedForParty(g, 'green', r));
  assert.strictEqual(dynBefore.length, 0, 'Green solo factions (<5M) should have 0 caucus/faction leader slots');
  assert(unlockedBefore.length <= 8, `Green should hide locked institutional roles (got ${unlockedBefore.length} roles, expected <= 8)`);

  // Form a tiny (<1M) multi-faction caucus for Green
  g.caucuses.push({
    id: 'caucus_grn_unity',
    partyId: 'green',
    name: 'Eco-Unity Caucus',
    status: 'active',
    strength: 50,
    cyclesActive: 1,
    representativeName: null,
    memberFactionIds: ['grn_eco_socialist_vanguard', 'grn_yimby'],
  });
  const dynAfter = V07.getDynamicCaucusAndFactionRoles(g, 'green');
  assert.strictEqual(dynAfter.length, 1, 'Multi-faction caucus must get a Caucus Leader slot regardless of membership level');
  assert.strictEqual(dynAfter[0].id, 'caucus_caucus_grn_unity');

  // Assign a Green politician to the caucus leader slot and verify caucus.representativeName updates!
  const cand = (g.politicians || []).find((p) => p && p.party === 'green') || (g.sittingMembers || []).find((m) => m && m.party === 'green');
  assert(cand, 'Found Green candidate to appoint');
  const gAssigned = E.takeAction(g, 'assign-leadership-role', { roleId: 'caucus_caucus_grn_unity', memberId: cand.id });
  const updatedCaucus = gAssigned.caucuses.find((c) => c.id === 'caucus_grn_unity');
  assert.strictEqual(updatedCaucus.representativeName, cand.name, `Caucus representativeName should update to ${cand.name}, got ${updatedCaucus.representativeName}`);
});

test('Hotfix #3: Tier 0-1 parties are blocked from ALL faction recruitment actions in engine', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  g.treasury = 20;
  g.organizingActionsRemaining = 10;
  const indF = g.factions.find((f) => f.partyId === 'independent');
  const rivalF = g.factions.find((f) => f.partyId === 'people');
  g.factionHappiness[rivalF.id] = 30;

  const r1 = E.takeAction(g, 'court-independent-faction', { factionId: indF.id });
  assert(String(r1.lastNote || '').includes('Tier 2'), `court-independent-faction must block Tier 1, got: ${r1.lastNote}`);

  const r2 = E.takeAction(g, 'open-courtship-dialogue', { factionId: rivalF.id });
  assert(String(r2.lastNote || '').includes('Tier 2'), `open-courtship-dialogue must block Tier 1, got: ${r2.lastNote}`);

  const r3 = E.takeAction(g, 'drive-coalition-wedge', { factionId: rivalF.id });
  assert(String(r3.lastNote || '').includes('Tier 2'), `drive-coalition-wedge must block Tier 1, got: ${r3.lastNote}`);
});

console.log(`\nALL ${passed}/3 HOTFIX TESTS PASSED!`);
