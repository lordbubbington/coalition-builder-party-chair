/**
 * Coalition Builder: Party Chair — Party Politicians Directory UI
 * Displays all politicians in each party with tabs for parties & the 7 election types
 * (Senate, House, Governor, Presidency, Minor Statewide, State Senate, State House) and state filter.
 * Opens by default on the player's party Senators.
 */
(function PoliticiansDirectoryUIModule(root) {
  'use strict';

  const ELECTION_TABS = [
    { id: 'senate', label: 'Senate' },
    { id: 'house', label: 'House' },
    { id: 'governor', label: 'Governor' },
    { id: 'presidency', label: 'Presidency' },
    { id: 'minor-statewide', label: 'Minor Statewide' },
    { id: 'state-senate', label: 'State Senate' },
    { id: 'state-house', label: 'State House' },
    { id: 'all', label: 'All' },
  ];

  const PARTY_META = {
    people: { label: 'Democratic', color: '#3478c8', abbr: 'D' },
    heritage: { label: 'Republican', color: '#c9474e', abbr: 'R' },
    liberty: { label: 'Libertarian', color: '#e2bd45', abbr: 'L' },
    green: { label: 'Green', color: '#55bf78', abbr: 'G' },
    constitution: { label: 'Constitution', color: '#a84214', abbr: 'C' },
    socialist: { label: 'Peace & Freedom', color: '#d62828', abbr: 'PF' },
    independent: { label: 'Independent', color: '#94a3b8', abbr: 'I' },
  };

  let state = {
    partyTab: null,       // initialized to player's party on first render
    electionTab: 'senate', // always opens on Senators
    stateFilter: 'ALL',
    search: '',
  };

  function safe(v) {
    return String(v ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  function resolvePlayerPartyId(game) {
    if (!game?.player) return 'people';
    if (game.player.custom) return 'player';
    return game.player.baseTemplateId || (game.player.id && game.player.id !== 'player' ? game.player.id : 'people');
  }

  function normalizePartyKey(rawParty, game) {
    if (!rawParty) return 'independent';
    const p = String(rawParty).trim();
    if (p === 'player') return game?.player?.custom ? 'player' : resolvePlayerPartyId(game);
    if (p === 'D' || p === 'dem' || p === 'democratic') return 'people';
    if (p === 'R' || p === 'rep' || p === 'republican') return 'heritage';
    if (p === 'I' || p === 'ind') return 'independent';
    if (p === 'L') return 'liberty';
    if (p === 'G') return 'green';
    if (p === 'C') return 'constitution';
    if (p === 'S' || p === 'PF') return 'socialist';
    return p;
  }

  function classifyElectionType(m) {
    const office = String(m.office || '').toLowerCase();
    const chamber = String(m.chamber || '').toLowerCase();
    const title = String(m.title || m.officeLabel || '').toLowerCase();
    const id = String(m.id || m.raceId || '').toLowerCase();

    if (office === 'president' || office === 'vicepresident' || office === 'presidency' || id.startsWith('presidential:') || title.includes('president')) {
      return 'presidency';
    }
    if (office === 'senate' || chamber === 'senate' || id.startsWith('senate:')) {
      return 'senate';
    }
    if (office === 'house' || chamber === 'house' || id.startsWith('house:')) {
      return 'house';
    }
    if (office === 'governor' || id.startsWith('governor:') || title === 'governor') {
      return 'governor';
    }
    if (office === 'statesenate' || office === 'state_senate' || office === 'state-senate' || chamber === 'upper' || chamber === 'state_senate' || title.includes('state senat')) {
      return 'state-senate';
    }
    if (office === 'statehouse' || office === 'state_house' || office === 'state-house' || office === 'stateleg' || office === 'state_leg' || office === 'state-leg' || chamber === 'lower' || chamber === 'state_house' || title.includes('state rep') || title.includes('state house') || title.includes('state leg') || title.includes('assembly')) {
      return 'state-house';
    }
    if (office === 'statewide' || office === 'minor_statewide' || id.startsWith('statewide:') || title.includes('attorney general') || title.includes('secretary of state') || title.includes('treasurer') || title.includes('auditor') || title.includes('comptroller') || title.includes('lieutenant governor') || title.includes('lt. governor') || title.includes('commissioner')) {
      return 'minor-statewide';
    }
    return 'minor-statewide';
  }

  function formatOfficeBadge(m, eType) {
    const st = m.stateId || m.state || '';
    if (eType === 'senate') {
      const cls = m.senateClass || m.class || m.classNum;
      return `U.S. Senator${st ? ` (${st}${cls ? ` · Class ${cls}` : ''})` : ''}`;
    }
    if (eType === 'house') {
      const dist = m.districtId || (st && m.district ? `${st}-${m.district}` : st);
      return `U.S. Rep.${dist ? ` (${dist})` : ''}`;
    }
    if (eType === 'governor') return `Governor${st ? ` (${st})` : ''}`;
    if (eType === 'presidency') return m.title || m.officeLabel || 'Presidential';
    if (eType === 'state-senate') return `State Senator${st ? ` (${st})` : ''}`;
    if (eType === 'state-house') return `State Rep.${st ? ` (${st})` : ''}`;
    return m.title || m.officeLabel || (st ? `Statewide (${st})` : 'Statewide');
  }

  function formatStatus(m) {
    if (m.retired) return 'Retired';
    if (m.vacant) return 'Vacant';
    if (m.isNominee) return 'Nominee';
    if (m.isIncumbent || m.incumbent) return m.upIn2028 ? 'Incumbent · Up' : 'Incumbent';
    if (m.isStateLegStandout) return 'State Leg. Standout';
    if (m.recruit) return 'Recruit';
    return 'Active';
  }

  function resolveFactionLabel(game, m) {
    const fId = m.factionId || m.faction;
    if (!fId) return '—';
    const list = (game?.factions && game.factions.length) ? game.factions : (root.PartyChairData?.FACTIONS_CATALOG || []);
    const found = list.find((f) => f && (f.id === fId || f.name === fId || f.legacyId === fId));
    return found ? found.name : String(fId);
  }

  function collectAllPoliticians(game) {
    const byKey = new Map();
    const addEntry = (raw, overrideType = null) => {
      if (!raw || !raw.name || raw.vacant) return;
      const eType = overrideType || classifyElectionType(raw);
      const partyKey = normalizePartyKey(raw.party || raw.partyId || raw.caucus, game);
      const st = raw.stateId || raw.state || (raw.districtId ? String(raw.districtId).split('-')[0] : '') || '';
      const dedupeKey = `${String(raw.name).trim().toLowerCase()}|${eType}|${st}`;
      const existing = byKey.get(dedupeKey);
      if (existing) {
        if (!existing.traits?.length && raw.traits?.length) existing.traits = raw.traits;
        if (!existing.factionId && raw.factionId) existing.factionId = raw.factionId;
        if (existing.quality == null && raw.quality != null) existing.quality = raw.quality;
        return;
      }
      byKey.set(dedupeKey, {
        id: raw.id || dedupeKey,
        name: raw.name,
        partyKey,
        electionType: eType,
        stateId: st,
        districtId: raw.districtId || null,
        senateClass: raw.senateClass || raw.class || raw.classNum || null,
        title: raw.title || raw.officeLabel || null,
        officeLabel: formatOfficeBadge(raw, eType),
        factionLabel: resolveFactionLabel(game, raw),
        quality: raw.quality ?? raw.rating ?? null,
        fame: raw.fame ?? null,
        happiness: raw.happiness ?? null,
        traits: Array.isArray(raw.traits) ? raw.traits : [],
        status: formatStatus(raw),
      });
    };

    // 1. Sitting members (Senate, House, Governor, President/VP, State Leg, Minor Statewide)
    (game?.sittingMembers || []).forEach((m) => addEntry(m));

    // 2. General politician pool (includes former officeholders, presidential contenders, defectors)
    (game?.politicians || []).forEach((p) => addEntry(p));

    // 3. State legislative standouts (split cleanly into State Senate vs State House)
    const standouts = game?.stateLegStandouts || {};
    Object.entries(standouts).forEach(([pKey, arr]) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((s, idx) => {
        if (!s) return;
        const ch = String(s.chamber || s.office || '').toLowerCase();
        const forcedType = (ch.includes('upper') || ch.includes('senate'))
          ? 'state-senate'
          : (ch.includes('lower') || ch.includes('house'))
            ? 'state-house'
            : (idx % 3 === 0 ? 'state-senate' : 'state-house');
        addEntry({ ...s, party: s.party || pKey, isStateLegStandout: true }, forcedType);
      });
    });

    // 4. Presidential primary contenders & nominees
    const presPrim = game?.presidentialPrimaries || {};
    Object.entries(presPrim).forEach(([pKey, entry]) => {
      const cands = Array.isArray(entry) ? entry : (entry?.candidates || []);
      cands.forEach((c) => addEntry({ ...c, party: c.party || pKey, title: 'Presidential Candidate' }, 'presidency'));
    });
    const presNoms = game?.presidentialNominees || {};
    Object.entries(presNoms).forEach(([pKey, nom]) => {
      if (nom && nom.name) addEntry({ ...nom, party: nom.party || pKey, isNominee: true, title: 'Presidential Nominee' }, 'presidency');
    });

    // 5. Minor statewide offices catalog + live control
    const swCatalog = root.PartyChairData?.STATEWIDE_OFFICES || [];
    const swLive = game?.statewideOffices || {};
    const swIncumbents = game?.statewideOfficeHolders || {};
    swCatalog.forEach((o) => {
      if (!o || !o.id) return;
      const liveHolder = swIncumbents[o.id];
      const holderParty = swLive[o.id] || liveHolder?.party || o.party || 'heritage';
      const holderName = liveHolder?.name || o.incumbent || o.incumbentName || `${o.stateId} ${o.title || o.office || 'Official'}`;
      addEntry({
        id: `statewide:${o.id}`,
        name: holderName,
        party: holderParty,
        stateId: o.stateId || o.state,
        title: o.title || o.office || 'Statewide Office',
        quality: liveHolder?.quality ?? o.quality ?? 6,
        fame: liveHolder?.fame ?? o.fame ?? 30,
        happiness: liveHolder?.happiness ?? 65,
        traits: liveHolder?.traits || o.traits || [],
        isIncumbent: true,
      }, 'minor-statewide');
    });

    return Array.from(byKey.values());
  }

  function getPartyTabs(game) {
    const tabs = [
      { id: 'people', ...PARTY_META.people },
      { id: 'heritage', ...PARTY_META.heritage },
      { id: 'liberty', ...PARTY_META.liberty },
      { id: 'green', ...PARTY_META.green },
      { id: 'constitution', ...PARTY_META.constitution },
      { id: 'socialist', ...PARTY_META.socialist },
    ];
    if (game?.player?.custom) {
      tabs.push({
        id: 'player',
        label: game.player.name || 'Custom Party',
        color: game.player.color || '#14b8a6',
        abbr: game.player.partyCode || 'C',
      });
    }
    tabs.push({ id: 'independent', ...PARTY_META.independent });
    return tabs;
  }

  function ensureInitialized(game) {
    if (!state.partyTab) {
      state.partyTab = resolvePlayerPartyId(game);
    }
  }

  function resetToDefault(game) {
    state.partyTab = resolvePlayerPartyId(game);
    state.electionTab = 'senate';
    state.stateFilter = 'ALL';
    state.search = '';
  }

  function renderPoliticiansDirectoryTab(game) {
    ensureInitialized(game);
    const allPols = collectAllPoliticians(game);
    const partyTabs = getPartyTabs(game);
    const statesList = (root.PartyChairData?.STATES || root.STATES || []).slice().sort((a, b) => String(a.name || a.id).localeCompare(String(b.name || b.id)));

    const activeParty = partyTabs.find((p) => p.id === state.partyTab) || partyTabs[0];
    const partyPols = allPols.filter((p) => p.partyKey === activeParty.id);

    const countByElection = {};
    ELECTION_TABS.forEach((et) => {
      countByElection[et.id] = et.id === 'all'
        ? partyPols.length
        : partyPols.filter((p) => p.electionType === et.id).length;
    });

    const filtered = partyPols.filter((p) => {
      if (state.electionTab !== 'all' && p.electionType !== state.electionTab) return false;
      if (state.stateFilter !== 'ALL' && p.stateId !== state.stateFilter) return false;
      if (state.search) {
        const q = state.search.toLowerCase();
        const hay = `${p.name} ${p.officeLabel} ${p.stateId} ${p.factionLabel} ${(p.traits || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const stCmp = String(a.stateId || 'ZZ').localeCompare(String(b.stateId || 'ZZ'));
      if (stCmp !== 0) return stCmp;
      return String(a.name).localeCompare(String(b.name));
    });

    return `
      <section class="panel section-panel" id="politicians-directory-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Party Rosters &amp; Officeholders</div>
            <h2>Politicians Directory</h2>
          </div>
          <span class="turnout-chip" style="border-color:${activeParty.color}66;color:${activeParty.color}">${safe(activeParty.label)} · ${filtered.length} Shown (${partyPols.length} Total)</span>
        </div>

        <div class="v07-subview-toggle" style="display:flex;gap:8px;margin:10px 0 12px;flex-wrap:wrap">
          ${partyTabs.map((pt) => {
            const pCount = allPols.filter((p) => p.partyKey === pt.id).length;
            const isActive = pt.id === activeParty.id;
            return `<button type="button" class="button button-small ${isActive ? 'button-gold' : ''}" data-pol-party-tab="${safe(pt.id)}" style="${isActive ? '' : `border-color:${pt.color}55;color:${pt.color}`}">${safe(pt.label)} (${pCount})</button>`;
          }).join('')}
        </div>

        <div class="v07-filter-tabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          ${ELECTION_TABS.map((et) => `
            <button type="button" data-pol-election-tab="${safe(et.id)}" class="${state.electionTab === et.id ? 'selected' : ''}">
              ${safe(et.label)} (${countByElection[et.id] || 0})
            </button>
          `).join('')}
        </div>

        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px">
          <select id="pol-state-filter" style="padding:6px 10px;background:#101924;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:13px">
            <option value="ALL" ${state.stateFilter === 'ALL' ? 'selected' : ''}>All States</option>
            ${statesList.map((s) => `<option value="${safe(s.id)}" ${state.stateFilter === s.id ? 'selected' : ''}>${safe(s.id)} · ${safe(s.name || s.id)}</option>`).join('')}
          </select>
          <input type="search" id="pol-search-input" placeholder="Filter by name, faction, or trait..." value="${safe(state.search)}" style="flex:1;min-width:220px;padding:6px 12px;background:#101924;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:13px">
        </div>

        <div class="v15-reg-table-wrap" style="overflow-x:auto">
          <table class="v15-reg-table" style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr>
                <th style="text-align:left">Politician</th>
                <th style="text-align:left">Office</th>
                <th style="text-align:left">State</th>
                <th style="text-align:left">Faction</th>
                <th style="text-align:right">Quality</th>
                <th style="text-align:right">Fame</th>
                <th style="text-align:right">Happiness</th>
                <th style="text-align:left">Traits</th>
                <th style="text-align:left">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length ? filtered.map((p) => `
                <tr>
                  <td><b>${safe(p.name)}</b></td>
                  <td>${safe(p.officeLabel)}</td>
                  <td>${safe(p.stateId || '—')}</td>
                  <td>${safe(p.factionLabel)}</td>
                  <td style="text-align:right;font-family:Consolas,monospace">${p.quality != null ? `${Math.round(p.quality)}/10` : '—'}</td>
                  <td style="text-align:right;font-family:Consolas,monospace">${p.fame != null ? Math.round(p.fame) : '—'}</td>
                  <td style="text-align:right;font-family:Consolas,monospace">${p.happiness != null ? `${Math.round(p.happiness)}/100` : '—'}</td>
                  <td>${p.traits.length ? p.traits.map((t) => `<span class="v07-mini-badge">${safe(t)}</span>`).join(' ') : '<span style="color:var(--muted)">—</span>'}</td>
                  <td><small style="color:var(--muted)">${safe(p.status)}</small></td>
                </tr>
              `).join('') : `
                <tr><td colspan="9" style="text-align:center;padding:20px;color:var(--muted)">No politicians match the selected party, election type, and state filters.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function bindEvents(onRerender) {
    const panel = typeof document !== 'undefined' ? document.getElementById('politicians-directory-panel') : null;
    if (!panel) return;
    panel.querySelectorAll('[data-pol-party-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.partyTab = btn.dataset.polPartyTab;
        if (typeof onRerender === 'function') onRerender();
      });
    });
    panel.querySelectorAll('[data-pol-election-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.electionTab = btn.dataset.polElectionTab;
        if (typeof onRerender === 'function') onRerender();
      });
    });
    const stSel = panel.querySelector('#pol-state-filter');
    if (stSel) {
      stSel.addEventListener('change', () => {
        state.stateFilter = stSel.value || 'ALL';
        if (typeof onRerender === 'function') onRerender();
      });
    }
    const searchEl = panel.querySelector('#pol-search-input');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        state.search = searchEl.value || '';
        if (typeof onRerender === 'function') onRerender();
      });
    }
  }

  const API = {
    ELECTION_TABS,
    collectAllPoliticians,
    renderPoliticiansDirectoryTab,
    bindEvents,
    resetToDefault,
    getState: () => ({ ...state }),
    setState: (patch) => { state = { ...state, ...(patch || {}) }; },
  };

  if (typeof window !== 'undefined') window.PoliticiansDirectoryUI = API;
  if (typeof globalThis !== 'undefined') globalThis.PoliticiansDirectoryUI = API;
  if (typeof module === 'object' && module.exports) module.exports = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
