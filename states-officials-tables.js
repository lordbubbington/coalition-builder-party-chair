(function initStatesOfficialsTables() {
  'use strict';

  const SUBVIEW_IDS = [
    'statewide-offices',
    'senate-seats',
    'house-seats',
    'state-house-seats',
    'state-senate-seats',
  ];

  const PARTY_META = {
    people: {
      key: 'people',
      label: 'Democratic',
      abbr: 'D',
      headerColor: '#72bbf6',
      cellColor: '#9bc7f2',
      pillBg: '#1d4165',
      pillText: '#b4d4ff',
      pillBorder: 'rgba(114, 187, 246, 0.45)',
    },
    heritage: {
      key: 'heritage',
      label: 'Republican',
      abbr: 'R',
      headerColor: '#e77c85',
      cellColor: '#f0989e',
      pillBg: '#622f37',
      pillText: '#ffc0c0',
      pillBorder: 'rgba(231, 124, 133, 0.45)',
    },
    independent: {
      key: 'independent',
      label: 'Independent',
      abbr: 'I',
      headerColor: '#a9b4bf',
      cellColor: '#c8d1db',
      pillBg: '#273549',
      pillText: '#d9e2ec',
      pillBorder: 'rgba(169, 180, 191, 0.45)',
    },
    liberty: {
      key: 'liberty',
      label: 'Libertarian',
      abbr: 'L',
      headerColor: '#e2bd45',
      cellColor: '#ebd178',
      pillBg: 'rgba(226, 189, 69, 0.18)',
      pillText: '#ebd178',
      pillBorder: 'rgba(226, 189, 69, 0.45)',
    },
    green: {
      key: 'green',
      label: 'Green',
      abbr: 'G',
      headerColor: '#55bf78',
      cellColor: '#8ce4be',
      pillBg: 'rgba(85, 191, 120, 0.18)',
      pillText: '#8ce4be',
      pillBorder: 'rgba(85, 191, 120, 0.45)',
    },
    constitution: {
      key: 'constitution',
      label: 'Constitution',
      abbr: 'C',
      headerColor: '#a84214',
      cellColor: '#c9714b',
      pillBg: 'rgba(168, 66, 20, 0.24)',
      pillText: '#e69873',
      pillBorder: 'rgba(201, 113, 75, 0.45)',
    },
    socialist: {
      key: 'socialist',
      label: 'Peace & Freedom',
      abbr: 'PF',
      headerColor: '#d62828',
      cellColor: '#e86464',
      pillBg: 'rgba(214, 40, 40, 0.20)',
      pillText: '#f07c7c',
      pillBorder: 'rgba(214, 40, 40, 0.45)',
    },
  };

  const MATRIX_PARTY_KEYS = [
    'people',
    'heritage',
    'independent',
    'liberty',
    'green',
    'constitution',
    'socialist',
  ];

  let selectedStatewideOfficeState = null;
  let selectedLegInspectorState = { lower: 'PA', upper: 'PA' };
  let selectedLegInspectorSort = { lower: 'closest', upper: 'closest' };
  const sortStateByView = {
    'senate-seats': { col: 'stateId', dir: 'asc' },
    'house-seats': { col: 'stateId', dir: 'asc' },
    'state-house-seats': { col: 'stateId', dir: 'asc' },
    'state-senate-seats': { col: 'stateId', dir: 'asc' },
  };

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getData() {
    return (typeof window !== 'undefined' && window.PartyChairData) ? window.PartyChairData : {};
  }

  function getStatesList() {
    const raw = getData().STATES || [];
    return raw.filter((s) => s && s.id && s.id !== 'DC');
  }

  function isCustomPlayerGame(game) {
    return Boolean(game?.player?.custom || game?.player?.id === 'custom');
  }

  function getCustomPartyMeta(game) {
    const name = String(game?.player?.name || 'Custom Party');
    const color = String(game?.player?.color || '#8b5cf6');
    let abbr = String(game?.player?.code || game?.player?.shortName || '').trim().toUpperCase();
    if (!abbr) {
      const letters = name
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .replace(/[^A-Z0-9]/gi, '')
        .toUpperCase();
      abbr = letters.slice(0, 3) || 'CP';
    }
    return {
      key: 'cust',
      label: name,
      abbr,
      headerColor: color,
      cellColor: color,
      pillBg: `${color}2b`,
      pillText: color,
      pillBorder: `${color}73`,
    };
  }

  function canonicalPartyKey(rawParty, game) {
    if (rawParty === null || rawParty === undefined || rawParty === '') return 'other';
    const raw = String(rawParty).trim();
    const low = raw.toLowerCase();
    const isCustom = isCustomPlayerGame(game);

    if (low === 'player' || (game?.player?.id && raw === game.player.id && isCustom)) {
      if (isCustom) return 'cust';
      return game?.player?.baseTemplateId || (game?.player?.id !== 'player' ? game?.player?.id : null) || 'people';
    }
    if (low === 'people' || low === 'dem' || low === 'democratic' || low === 'd') return 'people';
    if (low === 'heritage' || low === 'rep' || low === 'gop' || low === 'republican' || low === 'r') return 'heritage';
    if (low === 'independent' || low === 'ind' || low === 'i') return 'independent';
    if (low === 'liberty' || low === 'libertarian' || low === 'lib' || low === 'l') return 'liberty';
    if (low === 'green' || low === 'grn' || low === 'g') return 'green';
    if (low === 'constitution' || low === 'const' || low === 'con' || low === 'c') return 'constitution';
    if (low === 'socialist' || low === 'pfp' || low === 'peace_and_freedom' || low === 'peace & freedom' || low === 'soc' || low === 'pf') return 'socialist';
    return low;
  }

  function resolvePartyMeta(rawParty, game) {
    const key = canonicalPartyKey(rawParty, game);
    if (key === 'cust') return getCustomPartyMeta(game);
    if (PARTY_META[key]) return PARTY_META[key];
    return {
      key: 'other',
      label: String(rawParty || 'Other'),
      abbr: 'O',
      headerColor: '#94a3b8',
      cellColor: '#94a3b8',
      pillBg: 'rgba(148, 163, 184, 0.16)',
      pillText: '#cbd5e1',
      pillBorder: 'rgba(148, 163, 184, 0.35)',
    };
  }

  function partyPillMarkup(rawParty, game, useAbbr = false) {
    const meta = resolvePartyMeta(rawParty, game);
    const text = useAbbr ? meta.abbr : meta.label;
    return `<span class="v07-party-tag" style="display:inline-block;background:${esc(meta.pillBg)};color:${esc(meta.pillText)};border:1px solid ${esc(meta.pillBorder)}">${esc(text)}</span>`;
  }

  function resolveMemberTraits(member, fallbackKey) {
    const map = getData().POLITICIAN_TRAITS_MAP || {};
    if (member && Array.isArray(member.traits) && member.traits.length) {
      return member.traits;
    }
    if (member?.name && Array.isArray(map[member.name]) && map[member.name].length) {
      return map[member.name];
    }
    if (member?.id && Array.isArray(map[member.id]) && map[member.id].length) {
      return map[member.id];
    }
    if (fallbackKey && Array.isArray(map[fallbackKey]) && map[fallbackKey].length) {
      return map[fallbackKey];
    }
    return [];
  }

  function traitsMarkup(traits) {
    if (!traits || !traits.length) return '<span style="color:var(--text-muted, #64748b)">—</span>';
    const reg = getData().EXPANDED_POLITICIAN_TRAITS_REGISTRY || {};
    return `<span class="v14-traits-container">${traits.map((t) => {
      const cls = `v14-trait-chip v14-trait-${String(t).toLowerCase().trim().replace(/\s+/g, '-')}`;
      const desc = reg[t]?.description || t;
      return `<span class="${esc(cls)}" title="${esc(desc)}">${esc(t)}</span>`;
    }).join('')}</span>`;
  }

  function formatQuality(q) {
    const num = Number(q);
    if (!Number.isFinite(num) || num <= 0) return '—';
    const rounded = Math.round(num * 10) / 10;
    return `${rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1)}/10`;
  }

  function getSelectedStatewideOfficeState(fallbackStateId = 'AL') {
    const states = getStatesList();
    if (selectedStatewideOfficeState && states.some((s) => s.id === selectedStatewideOfficeState)) {
      return selectedStatewideOfficeState;
    }
    if (fallbackStateId && states.some((s) => s.id === fallbackStateId)) {
      selectedStatewideOfficeState = fallbackStateId;
      return selectedStatewideOfficeState;
    }
    selectedStatewideOfficeState = states[0]?.id || 'AL';
    return selectedStatewideOfficeState;
  }

  function setSelectedStatewideOfficeState(stateId) {
    const states = getStatesList();
    if (stateId && (!states.length || states.some((s) => s.id === stateId))) {
      selectedStatewideOfficeState = stateId;
    }
    return selectedStatewideOfficeState;
  }

  function getSortState(subview) {
    return sortStateByView[subview] || { col: 'stateId', dir: 'asc' };
  }

  function setSort(subview, col) {
    if (!subview || !col) return getSortState(subview);
    const cur = sortStateByView[subview] || { col: 'stateId', dir: 'asc' };
    if (cur.col === col) {
      cur.dir = cur.dir === 'asc' ? 'desc' : 'asc';
    } else {
      cur.col = col;
      cur.dir = col === 'stateId' || col === 'name' ? 'asc' : 'desc';
    }
    sortStateByView[subview] = cur;
    return cur;
  }

  function sortArrow(subview, col) {
    const cur = getSortState(subview);
    if (cur.col !== col) return '';
    return cur.dir === 'asc' ? ' ▲' : ' ▼';
  }

  function sortRows(rows, subview) {
    const { col, dir } = getSortState(subview);
    const copy = rows.slice();
    copy.sort((a, b) => {
      const valA = a[col] ?? a.name ?? '';
      const valB = b[col] ?? b.name ?? '';
      if (typeof valA === 'string' && typeof valB === 'string') {
        const cmp = valA.localeCompare(valB);
        return dir === 'asc' ? cmp : -cmp;
      }
      const numA = Number(valA) || 0;
      const numB = Number(valB) || 0;
      if (numA !== numB) return dir === 'asc' ? numA - numB : numB - numA;
      return String(a.stateId || '').localeCompare(String(b.stateId || ''));
    });
    return copy;
  }

  function renderStatewideOffices(game, ctx = {}) {
    const data = getData();
    const states = getStatesList();
    const activeStateId = getSelectedStatewideOfficeState(ctx.activeStateId || 'AL');
    const stateObj = states.find((s) => s.id === activeStateId) || { id: activeStateId, name: activeStateId };
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    const currentYear = Number(game?.year || 2028);

    const govMember = sitting.find((m) => m && m.office === 'governor' && m.stateId === activeStateId) || null;
    const mapGovParty = data.VERSION_03_MAPS?.governors?.[activeStateId] || data.VERSION_01_GOVERNORS?.[activeStateId];
    const govParty = game?.governorships?.[activeStateId] || govMember?.partyId || govMember?.party || mapGovParty || 'heritage';
    const activeGovStates = Array.isArray(game?.activeGubernatorialStates)
      ? game.activeGubernatorialStates
      : (data.VERSION_01_GUBERNATORIAL_ELECTIONS || []);
    const govNextYear = govMember?.nextElectionYear || (activeGovStates.includes(activeStateId) ? currentYear : (govMember?.electionYear ? Number(govMember.electionYear) + 4 : null));

    const govStatusParts = [];
    govStatusParts.push(govMember?.isIncumbent === false ? 'Open' : 'Incumbent');
    if (govMember?.termLimited) govStatusParts.push('Term-Limited');
    if (govNextYear) govStatusParts.push(`Up in ${govNextYear}`);
    if (Number.isFinite(Number(govMember?.happiness))) govStatusParts.push(`Happiness ${Math.round(Number(govMember.happiness))}`);

    const officeRows = [
      {
        office: 'Governor',
        party: govParty,
        holderName: govMember?.name || `${stateObj.name} Governor`,
        traits: resolveMemberTraits(govMember, `governor:${activeStateId}`),
        quality: govMember?.quality ?? 7,
        status: govStatusParts.join(' · '),
      },
    ];

    const registry = Array.isArray(data.STATEWIDE_OFFICES_REGISTRY)
      ? data.STATEWIDE_OFFICES_REGISTRY
      : (Array.isArray(data.STATEWIDE_OFFICES) ? data.STATEWIDE_OFFICES : []);
    const startingOfficers = Array.isArray(data.STARTING_STATEWIDE_OFFICERS) ? data.STARTING_STATEWIDE_OFFICERS : [];

    const stateRegistry = registry.filter((o) => o && o.stateId === activeStateId);
    const matchedIds = new Set();

    stateRegistry.forEach((o) => {
      matchedIds.add(o.id);
      const liveOfficer = sitting.find(
        (m) => m && (m.office === 'statewide_executive' || m.office === 'minorStatewide')
          && (m.officeId === o.id || (m.stateId === activeStateId && m.subOffice === o.officeKey))
      );
      const fallbackOfficer = startingOfficers.find((s) => s && (s.officeId === o.id || (s.stateId === activeStateId && s.subOffice === o.officeKey)));
      const officer = liveOfficer || fallbackOfficer || null;
      const officeParty = game?.statewideOffices?.[o.id] || officer?.partyId || officer?.party || 'heritage';

      const statusParts = [];
      statusParts.push(officer?.isIncumbent === false ? 'Open' : 'Incumbent');
      if (officer?.termLimited) statusParts.push('Term-Limited');
      if (o.nextElectionYear) statusParts.push(`Up in ${o.nextElectionYear}`);
      if (Number.isFinite(Number(officer?.happiness))) statusParts.push(`Happiness ${Math.round(Number(officer.happiness))}`);

      officeRows.push({
        office: o.title || o.officeKey || o.id,
        party: officeParty,
        holderName: officer?.name || 'Incumbent',
        traits: resolveMemberTraits(officer, o.id),
        quality: officer?.quality ?? 6,
        status: statusParts.join(' · '),
      });
    });

    sitting
      .filter((m) => m && (m.office === 'statewide_executive' || m.office === 'minorStatewide') && m.stateId === activeStateId)
      .forEach((extra) => {
        const eid = extra.officeId || `${extra.stateId}-${extra.subOffice}`;
        if (matchedIds.has(eid)) return;
        const statusParts = [extra.isIncumbent === false ? 'Open' : 'Incumbent'];
        if (extra.termLimited) statusParts.push('Term-Limited');
        if (extra.nextElectionYear) statusParts.push(`Up in ${extra.nextElectionYear}`);
        if (Number.isFinite(Number(extra.happiness))) statusParts.push(`Happiness ${Math.round(Number(extra.happiness))}`);
        officeRows.push({
          office: extra.title || extra.subOffice || 'Statewide Office',
          party: extra.partyId || extra.party || 'heritage',
          holderName: extra.name || 'Incumbent',
          traits: resolveMemberTraits(extra, eid),
          quality: extra.quality ?? 6,
          status: statusParts.join(' · '),
        });
      });

    return `
      <div class="v07-filter-tabs" style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 14px">
        ${states.map((st) => `
          <button type="button"
            class="button button-small ${st.id === activeStateId ? 'button-gold selected' : ''}"
            data-sot-state="${esc(st.id)}"
            title="${esc(st.name)}"
            style="min-width:40px;padding:4px 8px">${esc(st.id)}</button>
        `).join('')}
      </div>

      <div class="state-reg-table-wrap" style="overflow-x:auto;margin-top:8px;border:1px solid rgba(255,255,255,0.12);border-radius:8px">
        <table class="state-reg-table" style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:left">
          <thead>
            <tr style="background:rgba(255,255,255,0.04);border-bottom:2px solid rgba(255,255,255,0.15);color:var(--gold);text-transform:uppercase;font-size:11px">
              <th style="padding:10px 12px;text-align:left">Office (${esc(stateObj.name)})</th>
              <th style="padding:10px 12px;text-align:left">Party</th>
              <th style="padding:10px 12px;text-align:left">Officeholder Name</th>
              <th style="padding:10px 12px;text-align:left">Traits</th>
              <th style="padding:10px 12px;text-align:right">Quality</th>
              <th style="padding:10px 12px;text-align:left">Status</th>
            </tr>
          </thead>
          <tbody>
            ${officeRows.map((row) => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.15)">
                <td style="padding:8px 12px;font-weight:600">${esc(row.office)}</td>
                <td style="padding:8px 12px">${partyPillMarkup(row.party, game, false)}</td>
                <td style="padding:8px 12px;font-weight:600">${esc(row.holderName)}</td>
                <td style="padding:8px 12px">${traitsMarkup(row.traits)}</td>
                <td style="padding:8px 12px;text-align:right;font-weight:600">${esc(formatQuality(row.quality))}</td>
                <td style="padding:8px 12px;color:var(--text-muted, #94a3b8)">${esc(row.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function resolveUniversalSenateSeats(game, ctx = {}) {
    if (Array.isArray(ctx.senators) && ctx.senators.length) {
      return ctx.senators;
    }
    const data = getData();
    const mapSenators = Array.isArray(data.VERSION_03_MAPS?.senators) ? data.VERSION_03_MAPS.senators : [];
    const sittingSenators = (game?.sittingMembers || []).filter((m) => m && m.office === 'senate');
    const class3Results = new Map((game?.senateResults || []).map((r) => [r.stateId, r]));

    if (!mapSenators.length) {
      return sittingSenators.map((m) => ({
        ...m,
        classNum: Number(m.senateClass || m.class || 3),
        incumbent: m.name || m.incumbent || 'Senator',
      }));
    }

    return mapSenators.map((row) => {
      const cls = Number(row.class);
      const liveMatch = sittingSenators.find((m) => m.stateId === row.stateId && Number(m.senateClass || m.class) === cls);
      let merged = liveMatch ? { ...row, ...liveMatch, incumbent: liveMatch.name || row.incumbent } : { ...row };
      if (game?.phase === 'complete' && cls === 3 && class3Results.has(row.stateId)) {
        const res = class3Results.get(row.stateId);
        merged = {
          ...merged,
          party: res.winner,
          rawParty: res.rawParty || res.winner,
          caucus: res.caucus || res.winner,
          incumbent: res.incumbent || res.candidateName || merged.incumbent || merged.name,
        };
      }
      return { ...merged, classNum: cls };
    });
  }

  function resolveSenatorSeatPartyKey(seat, game) {
    if (!seat) return null;
    const raw = String(seat.rawParty || seat.party || '').toLowerCase();
    const incName = seat.incumbent || seat.name || '';
    const exc = getData().getIndependentException ? getData().getIndependentException(seat) : null;
    const isInd = !seat.hasSwitchedThisCycle && (
      seat.isIndependent === true
      || raw === 'independent'
      || raw === 'i'
      || seat.party === 'independent'
      || Boolean(exc)
      || ['Bernie Sanders', 'Angus King'].includes(incName)
    );
    if (isInd) return 'independent';
    return canonicalPartyKey(seat.partyId || seat.party, game);
  }

  function renderSenateSeats(game, ctx = {}) {
    const states = getStatesList();
    const allSeats = resolveUniversalSenateSeats(game, ctx);
    const byStateAndClass = new Map();
    allSeats.forEach((seat) => {
      const cls = Number(seat.classNum || seat.senateClass || seat.class);
      if (seat.stateId && [1, 2, 3].includes(cls)) {
        byStateAndClass.set(`${seat.stateId}:${cls}`, seat);
      }
    });

    const rows = states.map((st) => ({
      stateId: st.id,
      name: st.name || st.id,
      class1: byStateAndClass.get(`${st.id}:1`) || null,
      class2: byStateAndClass.get(`${st.id}:2`) || null,
      class3: byStateAndClass.get(`${st.id}:3`) || null,
    }));

    const sorted = sortRows(rows, 'senate-seats');

    const renderClassCell = (seat) => {
      if (!seat) {
        return '<td style="padding:8px 12px;text-align:center;color:var(--text-muted, #64748b)">—</td>';
      }
      const pKey = resolveSenatorSeatPartyKey(seat, game);
      const meta = resolvePartyMeta(pKey, game);
      const senatorName = seat.incumbent || seat.name || 'Senator';
      const statusNote = seat.isIncumbent === false ? 'Open' : 'Incumbent';
      const caucusNote = pKey === 'independent' && seat.caucus
        ? ` · Caucuses ${seat.caucus === 'people' ? 'Dem' : seat.caucus === 'heritage' ? 'GOP' : seat.caucus}`
        : '';
      const tip = `${senatorName} (${meta.label}${caucusNote}) · ${statusNote}`;
      return `<td style="padding:8px 12px;text-align:center" title="${esc(tip)}">${partyPillMarkup(pKey, game, true)}</td>`;
    };

    return `
      <div class="state-reg-table-wrap" style="overflow-x:auto;margin-top:14px;border:1px solid rgba(255,255,255,0.12);border-radius:8px">
        <table class="state-reg-table" style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:center">
          <thead>
            <tr style="background:rgba(255,255,255,0.04);border-bottom:2px solid rgba(255,255,255,0.15);color:var(--gold);text-transform:uppercase;font-size:11px">
              <th style="padding:10px 12px;text-align:left;cursor:pointer" data-sot-sort="senate-seats:stateId">States${sortArrow('senate-seats', 'stateId')}</th>
              <th style="padding:10px 12px;text-align:center">Class 1</th>
              <th style="padding:10px 12px;text-align:center">Class 2</th>
              <th style="padding:10px 12px;text-align:center">Class 3</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((row) => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.15)">
                <td style="padding:8px 12px;text-align:left"><b>${esc(row.name)}</b> <small style="color:var(--text-muted)">(${esc(row.stateId)})</small></td>
                ${renderClassCell(row.class1)}
                ${renderClassCell(row.class2)}
                ${renderClassCell(row.class3)}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function extractSeatRowCounts(rawRow, game, isCustomPlayer) {
    const counts = {
      people: 0,
      heritage: 0,
      independent: 0,
      liberty: 0,
      green: 0,
      constitution: 0,
      socialist: 0,
      cust: 0,
    };
    if (!rawRow || typeof rawRow !== 'object') return counts;

    const SKIP_KEYS = new Set([
      'total',
      'other',
      'unallocated',
      'chamber',
      'sourceStatus',
      'electoralSystem',
      'seatsByParty',
      'stvClusters',
      'localSeatsByParty',
      'listSeatsByParty',
    ]);

    Object.entries(rawRow).forEach(([k, val]) => {
      if (SKIP_KEYS.has(k)) return;
      const n = Number(val);
      if (!Number.isFinite(n) || n <= 0) return;
      const canon = canonicalPartyKey(k, game);
      if (canon === 'cust') {
        if (isCustomPlayer) counts.cust += n;
      } else if (counts[canon] !== undefined) {
        counts[canon] += n;
      }
    });
    return counts;
  }

  function resolveControllingParty(counts, legControl, game, isUnicameral) {
    if (isUnicameral) return null;
    const keys = [...MATRIX_PARTY_KEYS];
    if (isCustomPlayerGame(game)) keys.push('cust');

    let maxSeats = 0;
    let leaders = [];
    keys.forEach((k) => {
      const v = Number(counts[k] || 0);
      if (v > maxSeats) {
        maxSeats = v;
        leaders = [k];
      } else if (v === maxSeats && v > 0) {
        leaders.push(k);
      }
    });

    if (maxSeats <= 0 || leaders.length === 0) return null;
    if (leaders.length === 1) return leaders[0];

    if (legControl) {
      const ctrlCanon = canonicalPartyKey(legControl, game);
      if (leaders.includes(ctrlCanon)) return ctrlCanon;
    }
    return null;
  }

  function renderSeatMatrixTable({ subviewId, rows, showControlCheck, game }) {
    const isCustomPlayer = isCustomPlayerGame(game);
    const customMeta = isCustomPlayer ? getCustomPartyMeta(game) : null;
    const sorted = sortRows(rows, subviewId);

    const formatSeatCell = (count, total, isControl) => {
      const n = Number(count || 0);
      const pct = total > 0 ? ((n / total) * 100).toFixed(1) : '0.0';
      const check = isControl
        ? ' <span title="Controlling Party" style="font-weight:800">✓</span>'
        : '';
      return `${n}${check} <small style="color:var(--text-muted)">(${pct}%)</small>`;
    };

    return `
      <div class="state-reg-table-wrap" style="overflow-x:auto;margin-top:14px;border:1px solid rgba(255,255,255,0.12);border-radius:8px">
        <table class="state-reg-table" style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:right">
          <thead>
            <tr style="background:rgba(255,255,255,0.04);border-bottom:2px solid rgba(255,255,255,0.15);color:var(--gold);text-transform:uppercase;font-size:11px">
              <th style="padding:10px 12px;text-align:left;cursor:pointer" data-sot-sort="${esc(subviewId)}:stateId">State${sortArrow(subviewId, 'stateId')}</th>
              <th style="padding:10px 12px;cursor:pointer" data-sot-sort="${esc(subviewId)}:total">Total Seats${sortArrow(subviewId, 'total')}</th>
              <th style="padding:10px 12px;cursor:pointer;color:#72bbf6" data-sot-sort="${esc(subviewId)}:people">Democratic${sortArrow(subviewId, 'people')}</th>
              <th style="padding:10px 12px;cursor:pointer;color:#e77c85" data-sot-sort="${esc(subviewId)}:heritage">Republican${sortArrow(subviewId, 'heritage')}</th>
              <th style="padding:10px 12px;cursor:pointer;color:#a9b4bf" data-sot-sort="${esc(subviewId)}:independent">Independent${sortArrow(subviewId, 'independent')}</th>
              <th style="padding:10px 12px;cursor:pointer;color:#e2bd45" data-sot-sort="${esc(subviewId)}:liberty">Libertarian${sortArrow(subviewId, 'liberty')}</th>
              <th style="padding:10px 12px;cursor:pointer;color:#55bf78" data-sot-sort="${esc(subviewId)}:green">Green${sortArrow(subviewId, 'green')}</th>
              <th style="padding:10px 12px;cursor:pointer;color:#a84214" data-sot-sort="${esc(subviewId)}:constitution">Constitution${sortArrow(subviewId, 'constitution')}</th>
              <th style="padding:10px 12px;cursor:pointer;color:#d62828" data-sot-sort="${esc(subviewId)}:socialist">Peace &amp; Freedom${sortArrow(subviewId, 'socialist')}</th>
              ${isCustomPlayer ? `<th style="padding:10px 12px;cursor:pointer;color:${esc(customMeta.headerColor)}" data-sot-sort="${esc(subviewId)}:cust">${esc(customMeta.label)}${sortArrow(subviewId, 'cust')}</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${sorted.map((row) => {
              const ctrl = showControlCheck ? row.controlParty : null;
              const stateNote = row.isUnicameral ? `${row.stateId} · Unicameral` : row.stateId;
              const totalCell = row.isUnicameral
                ? `${row.total} <small style="color:var(--text-muted)">(Unicameral)</small>`
                : String(row.total);
              return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.15)">
                  <td style="padding:8px 12px;text-align:left">
                    <b>${esc(row.name)}</b> <small style="color:var(--text-muted)">(${esc(stateNote)})</small>
                  </td>
                  <td style="padding:8px 12px;font-weight:600">${totalCell}</td>
                  <td style="padding:8px 12px;color:#9bc7f2">${formatSeatCell(row.people, row.total, ctrl === 'people')}</td>
                  <td style="padding:8px 12px;color:#f0989e">${formatSeatCell(row.heritage, row.total, ctrl === 'heritage')}</td>
                  <td style="padding:8px 12px;color:#c8d1db">${formatSeatCell(row.independent, row.total, ctrl === 'independent')}</td>
                  <td style="padding:8px 12px;color:#ebd178">${formatSeatCell(row.liberty, row.total, ctrl === 'liberty')}</td>
                  <td style="padding:8px 12px;color:#8ce4be">${formatSeatCell(row.green, row.total, ctrl === 'green')}</td>
                  <td style="padding:8px 12px;color:#c9714b">${formatSeatCell(row.constitution, row.total, ctrl === 'constitution')}</td>
                  <td style="padding:8px 12px;color:#e86464">${formatSeatCell(row.socialist, row.total, ctrl === 'socialist')}</td>
                  ${isCustomPlayer ? `<td style="padding:8px 12px;color:${esc(customMeta.cellColor)}">${formatSeatCell(row.cust, row.total, ctrl === 'cust')}</td>` : ''}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderHouseSeats(game) {
    const data = getData();
    const states = getStatesList();
    const isCustomPlayer = isCustomPlayerGame(game);

    const byState = {};
    states.forEach((st) => {
      byState[st.id] = {
        stateId: st.id,
        name: st.name || st.id,
        total: 0,
        people: 0,
        heritage: 0,
        independent: 0,
        liberty: 0,
        green: 0,
        constitution: 0,
        socialist: 0,
        cust: 0,
        controlParty: null,
        isUnicameral: false,
      };
    });

    const seenDistricts = new Set();
    const addSeat = (stateId, districtId, rawParty) => {
      if (!stateId || stateId === 'DC' || !byState[stateId]) return;
      if (districtId && seenDistricts.has(districtId)) return;
      if (districtId) seenDistricts.add(districtId);
      const canon = canonicalPartyKey(rawParty, game);
      const rec = byState[stateId];
      rec.total += 1;
      if (canon === 'cust') {
        if (isCustomPlayer) rec.cust += 1;
      } else if (rec[canon] !== undefined) {
        rec[canon] += 1;
      }
    };

    const reps = Array.isArray(game?.representatives) ? game.representatives : [];
    reps.forEach((r) => {
      if (!r || r.vacant) return;
      const dId = r.districtId || r.id;
      const stId = r.stateId || (dId ? String(dId).split('-')[0] : null);
      addSeat(stId, dId, r.partyId || r.party);
    });

    const sittingHouse = (game?.sittingMembers || []).filter((m) => m && m.office === 'house');
    sittingHouse.forEach((m) => {
      const dId = m.districtId || m.district || m.id;
      const stId = m.stateId || (dId ? String(dId).split('-')[0] : null);
      addSeat(stId, dId, m.partyId || m.party || m.caucus);
    });

    const mapHouse = Array.isArray(data.VERSION_03_MAPS?.houseResults) ? data.VERSION_03_MAPS.houseResults : [];
    mapHouse.forEach((row) => {
      if (!row || row.pending) return;
      const dId = row.id || row.districtId;
      const stId = row.stateId || (dId ? String(dId).split('-')[0] : null);
      addSeat(stId, dId, row.party);
    });

    return renderSeatMatrixTable({
      subviewId: 'house-seats',
      rows: Object.values(byState),
      showControlCheck: false,
      game,
    });
  }


  function renderStateLegDistrictInspector(game, chamber, ctx = {}) {
    const engine = (typeof window !== 'undefined' && window.PartyChairEngine) ? window.PartyChairEngine : null;
    if (!engine || typeof engine.resolveStateLegislatureDistricts !== 'function') return '';
    const chKey = chamber === 'upper' ? 'upper' : 'lower';
    const states = getStatesList().filter((s) => s.id !== 'DC' && s.id !== 'NE');
    const validIds = new Set(states.map((s) => s.id));
    if (!validIds.has(selectedLegInspectorState[chKey])) {
      selectedLegInspectorState[chKey] = validIds.has(ctx?.activeStateId) ? ctx.activeStateId : (states[0]?.id || 'PA');
    }
    const stId = selectedLegInspectorState[chKey];
    const sortMode = selectedLegInspectorSort[chKey] || 'closest';
    const res = engine.resolveStateLegislatureDistricts(game, stId, chKey);
    const stObj = states.find((s) => s.id === stId);
    const chamberLabel = chKey === 'upper' ? 'State Senate' : 'State House';
    const playerId = res.playerIdentity;
    const playerMeta = resolvePartyMeta(playerId, game);
    const playerLabel = playerMeta?.label || playerId;

    const seats = [...(res.seats || [])];
    if (sortMode === 'closest') {
      seats.sort((a, b) => {
        const aTrail = a.status === 'Trailing' ? 0 : (a.status === 'Leading' ? 1 : 2);
        const bTrail = b.status === 'Trailing' ? 0 : (b.status === 'Leading' ? 1 : 2);
        if (aTrail !== bTrail) return aTrail - bTrail;
        if (aTrail === 0) return (a.playerDistance ?? 999) - (b.playerDistance ?? 999);
        if (aTrail === 1) return (a.playerMargin ?? 999) - (b.playerMargin ?? 999);
        return a.number - b.number;
      });
    } else {
      seats.sort((a, b) => a.number - b.number);
    }

    const playerWins = seats.filter((s) => s.status === 'Leading').length;
    const within5 = seats.filter((s) => s.status === 'Trailing' && s.playerDistance <= 5).length;
    const within10 = seats.filter((s) => s.status === 'Trailing' && s.playerDistance <= 10).length;

    const optionsHtml = states.map((s) =>
      `<option value="${esc(s.id)}" ${s.id === stId ? 'selected' : ''}>${esc(s.name)} (${esc(s.id)})</option>`
    ).join('');

    const rowsHtml = seats.map((seat) => {
      const topParties = Object.entries(seat.shares || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([pid, pct]) => `${esc(resolvePartyMeta(pid, game)?.label || pid)} ${Number(pct).toFixed(1)}%`)
        .join(' · ');

      let marginBadge = '<span style="color:var(--muted)">Uncontested</span>';
      if (seat.status === 'Leading') {
        marginBadge = `<span style="color:#4ade80;font-weight:700">Leading +${Number(seat.playerMargin || 0).toFixed(1)}%</span>`;
      } else if (seat.status === 'Trailing') {
        const dist = Number(seat.playerDistance || 0);
        const color = dist <= 5 ? '#fbbf24' : (dist <= 10 ? '#f59e0b' : 'var(--muted)');
        marginBadge = `<span style="color:${color};font-weight:${dist <= 10 ? '700' : '400'}">-${dist.toFixed(1)}% to win</span>`;
      }

      return `<tr>
        <td><b>${esc(seat.districtId)}</b></td>
        <td>${partyPillMarkup(seat.winner, game)}</td>
        <td style="text-align:right;font-family:Consolas,monospace">${res.playerContested ? `${Number(seat.playerPct || 0).toFixed(1)}%` : '—'}</td>
        <td style="text-align:right;font-family:Consolas,monospace">${Number(seat.leaderPct || 0).toFixed(1)}%</td>
        <td style="text-align:right;font-family:Consolas,monospace">${marginBadge}</td>
        <td style="font-size:11.5px;color:var(--muted)">${topParties}</td>
      </tr>`;
    }).join('');

    return `
      <div class="sot-district-inspector" style="margin-bottom:16px;padding:12px 14px;background:#101a26;border:1px solid var(--line);border-radius:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
          <div>
            <div class="eyebrow" style="font-size:11px;color:var(--gold)">Individual Seat Inspector · ${esc(chamberLabel)}</div>
            <h4 style="margin:2px 0 0;font-size:15px">${esc(stObj?.name || stId)} ${esc(chamberLabel)} (${res.total} Seats)</h4>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <label style="font-size:12px;color:var(--muted)">State:</label>
            <select data-sot-leg-state="${chKey}" style="padding:4px 8px;border-radius:6px;background:#0b131c;color:var(--text);border:1px solid var(--line);font-size:12.5px">
              ${optionsHtml}
            </select>
            <button type="button" class="button button-small ${sortMode === 'closest' ? 'button-gold' : ''}" data-sot-leg-sort="${chKey}:closest" style="padding:4px 8px;font-size:11.5px">Closest to Win</button>
            <button type="button" class="button button-small ${sortMode === 'number' ? 'button-gold' : ''}" data-sot-leg-sort="${chKey}:number" style="padding:4px 8px;font-size:11.5px">Seat #</button>
          </div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12px;font-family:Consolas,monospace;color:var(--gold);margin-bottom:10px">
          <span><b>${esc(playerLabel)} Projected:</b> ${playerWins}/${res.total}</span>
          <span><b>Within 5%:</b> ${within5}</span>
          <span><b>Within 10%:</b> ${within10}</span>
          <span><b>System:</b> ${esc(String(res.system || 'plurality').toUpperCase())}</span>
        </div>
        <div style="max-height:380px;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:8px">
          <table class="v08-triage-table" style="margin:0;width:100%">
            <thead>
              <tr>
                <th>Seat</th>
                <th>Projected Winner</th>
                <th style="text-align:right">${esc(playerLabel)} %</th>
                <th style="text-align:right">Leader %</th>
                <th style="text-align:right">Margin / Distance</th>
                <th>Top Parties</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>`;
  }

  function renderStateHouseSeats(game, ctx = {}) {
    const data = getData();
    const states = getStatesList();
    const isCustomPlayer = isCustomPlayerGame(game);
    const countsMap = game?.stateHouseSeatCounts || data.VERSION_05_STATE_HOUSE_SEATS?.states || {};

    const rows = states.map((st) => {
      const rawRow = countsMap[st.id] || {};
      const counts = extractSeatRowCounts(rawRow, game, isCustomPlayer);
      const summed = Object.values(counts).reduce((a, b) => a + b, 0) + Number(rawRow.other || 0) + Number(rawRow.unallocated || 0);
      const total = Number(rawRow.total) || summed || 0;
      const isUnicameral = st.id === 'NE' || rawRow.chamber === 'unicameral';
      const legCtrl = Array.isArray(game?.stateLegislatures?.[st.id]) ? game.stateLegislatures[st.id][0] : null;
      return {
        stateId: st.id,
        name: st.name || st.id,
        total,
        ...counts,
        isUnicameral,
        controlParty: resolveControllingParty(counts, legCtrl, game, isUnicameral),
      };
    });

    return renderStateLegDistrictInspector(game, 'lower', ctx) + renderSeatMatrixTable({
      subviewId: 'state-house-seats',
      rows,
      showControlCheck: true,
      game,
    });
  }

  function renderStateSenateSeats(game, ctx = {}) {
    const data = getData();
    const states = getStatesList();
    const isCustomPlayer = isCustomPlayerGame(game);
    const engine = (typeof window !== 'undefined' && window.PartyChairEngine) ? window.PartyChairEngine : null;
    const countsMap = game?.stateSenateSeatCounts
      || (engine?.buildStartingStateSenateSeatCounts
        ? engine.buildStartingStateSenateSeatCounts(game?.stateHouseSeatCounts, game?.stateLegislatures)
        : {});

    const rows = states.map((st) => {
      const rawRow = countsMap[st.id] || {};
      const counts = extractSeatRowCounts(rawRow, game, isCustomPlayer);
      const summed = Object.values(counts).reduce((a, b) => a + b, 0) + Number(rawRow.other || 0) + Number(rawRow.unallocated || 0);
      const fallbackTotal = Number(data.STATE_SENATE_SEAT_TOTALS?.[st.id] || 0);
      const total = Number(rawRow.total) || summed || fallbackTotal;
      const isUnicameral = st.id === 'NE' || rawRow.chamber === 'unicameral';
      const legCtrl = Array.isArray(game?.stateLegislatures?.[st.id]) ? game.stateLegislatures[st.id][1] : null;
      return {
        stateId: st.id,
        name: st.name || st.id,
        total,
        ...counts,
        isUnicameral,
        controlParty: resolveControllingParty(counts, legCtrl, game, isUnicameral),
      };
    });

    return renderStateLegDistrictInspector(game, 'upper', ctx) + renderSeatMatrixTable({
      subviewId: 'state-senate-seats',
      rows,
      showControlCheck: true,
      game,
    });
  }

  function renderSubview(subview, game, ctx = {}) {
    switch (subview) {
      case 'statewide-offices':
        return renderStatewideOffices(game, ctx);
      case 'senate-seats':
        return renderSenateSeats(game, ctx);
      case 'house-seats':
        return renderHouseSeats(game);
      case 'state-house-seats':
        return renderStateHouseSeats(game, ctx);
      case 'state-senate-seats':
        return renderStateSenateSeats(game, ctx);
      default:
        return '';
    }
  }

  function attachListeners(onUpdate) {
    if (typeof document === 'undefined' || typeof onUpdate !== 'function') return;
    document.querySelectorAll('[data-sot-state]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setSelectedStatewideOfficeState(btn.dataset.sotState);
        onUpdate();
      });
    });
    document.querySelectorAll('[data-sot-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        const raw = String(th.dataset.sotSort || '');
        const idx = raw.indexOf(':');
        if (idx > 0) {
          setSort(raw.slice(0, idx), raw.slice(idx + 1));
          onUpdate();
        }
      });
    });
    document.querySelectorAll('[data-sot-leg-state]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const ch = sel.dataset.sotLegState === 'upper' ? 'upper' : 'lower';
        selectedLegInspectorState[ch] = sel.value;
        onUpdate();
      });
    });
    document.querySelectorAll('[data-sot-leg-sort]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = String(btn.dataset.sotLegSort || '');
        const idx = raw.indexOf(':');
        if (idx > 0) {
          const ch = raw.slice(0, idx) === 'upper' ? 'upper' : 'lower';
          selectedLegInspectorSort[ch] = raw.slice(idx + 1);
          onUpdate();
        }
      });
    });
  }

  const API = {
    SUBVIEW_IDS,
    getSelectedStatewideOfficeState,
    setSelectedStatewideOfficeState,
    getSortState,
    setSort,
    renderSubview,
    renderStatewideOffices,
    renderSenateSeats,
    renderHouseSeats,
    renderStateHouseSeats,
    renderStateSenateSeats,
    attachListeners,
  };

  if (typeof window !== 'undefined') {
    window.StatesOfficialsTables = API;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }
})();
