// ============================================================================
// COALITION BUILDER: PARTY CHAIR — VOTING REFORMS & TRIFECTA REFORMS UI
// Standalone UMD/IIFE module exposing window.VotingReformsUI & module.exports.
// ============================================================================
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.VotingReformsUI = api;
  } else if (root && typeof root === 'object') {
    root.VotingReformsUI = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const LENS_MODES = [
    { id: 'legislative', label: 'Legislative System' },
    { id: 'presidential_ev', label: 'Presidential EV Rule' },
    { id: 'single_winner', label: 'Single-Winner System' }
  ];

  const LEGISLATIVE_SYSTEMS = [
    { id: 'fptp', label: 'FPTP (Plurality)', color: '#475569' },
    { id: 'proportional', label: 'Proportional', color: '#3b82f6' },
    { id: 'open_list_proportional', label: 'Open-List PR', color: '#6366f1' },
    { id: 'stv', label: 'STV (Multi-Member)', color: '#10b981' },
    { id: 'state_mmp', label: 'State MMP', color: '#eab308' }
  ];

  const PRESIDENTIAL_EV_RULES = [
    { id: 'winner_take_all', label: 'Winner-Take-All', color: '#475569' },
    { id: 'district_split', label: 'District Split (ME/NE)', color: '#f59e0b' },
    { id: 'proportional_ev', label: 'Proportional EV', color: '#3b82f6' },
    { id: 'npvic', label: 'NPVIC Signatory', color: '#10b981' }
  ];

  const SINGLE_WINNER_SYSTEMS = [
    { id: 'plurality', label: 'Plurality', color: '#475569' },
    { id: 'rcv', label: 'RCV (Ranked Choice)', color: '#3b82f6' },
    { id: 'approval_voting', label: 'Approval Voting', color: '#10b981' }
  ];

  const STATE_NAMES = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
    MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
    NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
    VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
  };

  // 11x8 US Tile-Grid coordinates for guaranteed clean SVG fallback
  const TILE_GRID = {
    AK: [0, 0], ME: [10, 0],
    VT: [9, 1], NH: [10, 1],
    WA: [0, 2], ID: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], WI: [5, 2], MI: [6, 2], NY: [8, 2], MA: [9, 2], RI: [10, 2],
    OR: [0, 3], NV: [1, 3], WY: [2, 3], SD: [3, 3], IA: [4, 3], IL: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3],
    CA: [0, 4], UT: [1, 4], CO: [2, 4], NE: [3, 4], MO: [4, 4], KY: [5, 4], WV: [6, 4], VA: [7, 4], MD: [8, 4], DE: [9, 4],
    AZ: [1, 5], NM: [2, 5], KS: [3, 5], AR: [4, 5], TN: [5, 5], NC: [6, 5], SC: [7, 5],
    OK: [3, 6], LA: [4, 6], MS: [5, 6], AL: [6, 6], GA: [7, 6],
    HI: [0, 7], TX: [3, 7], FL: [8, 7]
  };

  const SABATO_PROPOSALS = [
    {
      id: 'sabato_136_senate',
      title: '136-Seat U.S. Senate',
      desc: 'Adds 36 national and populous-state Senate seats to balance small-state malapportionment.'
    },
    {
      id: 'sabato_1000_house_redistricting',
      title: '1,000-Seat House & Nonpartisan Redistricting',
      desc: 'Expands the U.S. House to 1,000 seats and mandates independent redistricting commissions nationwide.'
    },
    {
      id: 'sabato_mended_ec',
      title: 'Mended Electoral College',
      desc: 'Abolishes faithless electors and awards national popular-vote bonus Electoral Votes.'
    },
    {
      id: 'sabato_rotating_primaries',
      title: 'Rotating 4-Month Regional Primaries',
      desc: 'Replaces front-loaded primaries with 4 rotating monthly regional presidential windows.'
    },
    {
      id: 'sabato_6yr_presidency',
      title: '6-Year Presidency & Cycle Overhaul',
      desc: 'Establishes a single 6-year presidential term (renewable via House confidence) and aligns federal terms.'
    }
  ];

  const HOUSE_EXPANSION_RULES = [
    { id: 'house_435', label: 'Standard 435', seats: 435, evs: 538, desc: 'Current Permanent Apportionment Act baseline (435 House + 100 Senate + 3 DC).' },
    { id: 'house_wyoming_573', label: 'Wyoming Rule (573)', seats: 573, evs: 676, desc: 'Sizes every House district to match Wyoming’s population (~573 House seats).' },
    { id: 'house_cube_root_692', label: 'Cube Root Rule (692)', seats: 692, evs: 795, desc: 'Sets U.S. House size to the cube root of national population (~692 seats).' },
    { id: 'house_sabato_1000', label: 'Sabato 1,000', seats: 1000, evs: 1103, desc: 'Expands the House to 1,000 seats, cutting district size by more than half.' }
  ];

  function defaultSafe(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolvePlayerParty(game) {
    if (game?.player?.custom) return 'player';
    return game?.player?.baseTemplateId || game?.player?.id || 'people';
  }

  function getStateRecord(game, stateId) {
    const raw = game?.stateElectoralSystems?.[stateId];
    const npvic = Array.isArray(game?.npvicStates) && game.npvicStates.includes(stateId);
    const defaultEvRule = (stateId === 'ME' || stateId === 'NE') ? 'district_split' : 'winner_take_all';

    if (typeof raw === 'string') {
      const s = raw.toLowerCase();
      return {
        legislative: ['proportional', 'open_list_proportional', 'stv', 'state_mmp'].includes(s) ? s : 'fptp',
        singleWinner: ['rcv', 'approval', 'approval_voting'].includes(s) ? (s === 'approval' ? 'approval_voting' : s) : 'plurality',
        presidentialEvRule: npvic ? 'npvic' : defaultEvRule,
        isNpvic: npvic
      };
    }
    const obj = raw && typeof raw === 'object' ? raw : {};
    const legRaw = String(obj.legislative || 'fptp').toLowerCase();
    const singleRaw = String(obj.allRaces || obj.singleWinner || (stateId === 'AK' ? 'rcv' : 'plurality')).toLowerCase();
    const evRaw = String(obj.presidentialEvRule || defaultEvRule).toLowerCase();

    return {
      legislative: legRaw === 'plurality' ? 'fptp' : legRaw,
      singleWinner: singleRaw === 'approval' ? 'approval_voting' : (singleRaw === 'fptp' ? 'plurality' : singleRaw),
      presidentialEvRule: npvic ? 'npvic' : evRaw,
      isNpvic: npvic
    };
  }

  function getColorForState(game, stateId, lensMode) {
    const rec = getStateRecord(game, stateId);
    if (lensMode === 'presidential_ev') {
      if (rec.isNpvic) return '#10b981';
      const found = PRESIDENTIAL_EV_RULES.find((r) => r.id === rec.presidentialEvRule);
      return found ? found.color : '#475569';
    }
    if (lensMode === 'single_winner') {
      const found = SINGLE_WINNER_SYSTEMS.find((r) => r.id === rec.singleWinner);
      return found ? found.color : '#475569';
    }
    const found = LEGISLATIVE_SYSTEMS.find((r) => r.id === rec.legislative);
    return found ? found.color : '#475569';
  }

  function computeTrifectaStatus(game) {
    const pid = resolvePlayerParty(game);
    const matches = (v) => v === pid || (pid === 'player' && v === game?.player?.baseTemplateId);

    const hasPres = Boolean(
      game?.trifectaStatus?.presidency ??
      (game?.presidentParty && matches(game.presidentParty)) ??
      (game?.lastElection?.presidential?.winner && matches(game.lastElection.presidential.winner))
    );

    const houseTotal = Number(game?.federalReforms?.houseSize || game?.representatives?.length || 435);
    const houseMaj = Math.floor(houseTotal / 2) + 1;
    const playerHouse = Number.isFinite(Number(game?.seats))
      ? Number(game.seats)
      : (Array.isArray(game?.representatives) ? game.representatives.filter((r) => matches(r?.party)).length : 0);
    const hasHouse = Boolean(game?.trifectaStatus?.house ?? (playerHouse >= houseMaj));

    const senateTotal = Number(game?.federalReforms?.senateSize || 100);
    const senateMaj = Math.floor(senateTotal / 2) + 1;
    let playerSenate = Number(game?.senateSeats?.[pid] ?? game?.senateSeatsCount ?? 0);
    if (!playerSenate && Array.isArray(game?.senateRoster)) {
      playerSenate = game.senateRoster.filter((s) => matches(s?.caucus || s?.party)).length;
    }
    const hasSenate = Boolean(
      game?.trifectaStatus?.senate ??
      (playerSenate >= senateMaj || (playerSenate === Math.floor(senateTotal / 2) && hasPres))
    );

    return {
      hasPres,
      hasHouse,
      hasSenate,
      hasTrifecta: hasPres && hasHouse && hasSenate
    };
  }

  // --------------------------------------------------------------------------
  // 1. Interactive 50-State Voting Systems Map Panel
  // --------------------------------------------------------------------------
  function renderElectoralSystemsVisualMap(game, lensModeArg = 'legislative', selectedStateArg = null, safe) {
    const esc = typeof safe === 'function' ? safe : defaultSafe;
    let lensMode = lensModeArg;
    let selectedStateId = selectedStateArg;
    if (lensModeArg && typeof lensModeArg === 'object') {
      lensMode = lensModeArg.lensMode || 'legislative';
      selectedStateId = lensModeArg.selectedStateId || null;
    }
    lensMode = LENS_MODES.some((l) => l.id === lensMode) ? lensMode : 'legislative';
    if (!selectedStateId || !STATE_NAMES[selectedStateId]) selectedStateId = 'PA';

    const legendItems = lensMode === 'presidential_ev'
      ? PRESIDENTIAL_EV_RULES
      : (lensMode === 'single_winner' ? SINGLE_WINNER_SYSTEMS : LEGISLATIVE_SYSTEMS);

    const geoStates = (typeof window !== 'undefined' && window.PartyChairData?.VERSION_03_MAPS?.states) || null;
    let svgBody = '';
    let viewBox = '0 0 680 460';

    if (geoStates && Object.keys(geoStates).length >= 50) {
      viewBox = window.PartyChairData.VERSION_03_MAPS.viewBox || '0 0 960 600';
      svgBody = Object.keys(STATE_NAMES).map((sid) => {
        const st = geoStates[sid];
        if (!st?.d) return '';
        const dPath = String(st.d).replace(/!/g, ' ');
        const fill = getColorForState(game, sid, lensMode);
        const selCls = sid === selectedStateId ? 'selected' : '';
        return `<path class="vr-state-shape ${selCls}" d="${esc(dPath)}" fill="${esc(fill)}" data-vr-state="${esc(sid)}"><title>${esc(STATE_NAMES[sid])}</title></path>`;
      }).join('');
    } else {
      svgBody = Object.entries(TILE_GRID).map(([sid, [col, row]]) => {
        const x = 18 + col * 58;
        const y = 16 + row * 54;
        const fill = getColorForState(game, sid, lensMode);
        const selCls = sid === selectedStateId ? 'selected' : '';
        return `
          <g>
            <rect class="vr-state-shape ${selCls}" x="${x}" y="${y}" width="52" height="48" rx="7" fill="${esc(fill)}" data-vr-state="${esc(sid)}">
              <title>${esc(STATE_NAMES[sid])}</title>
            </rect>
            <text class="vr-tile-label" x="${x + 26}" y="${y + 24}">${esc(sid)}</text>
          </g>`;
      }).join('');
    }

    const activeRec = getStateRecord(game, selectedStateId);

    return `
      <section class="vr-panel" data-vr-map-panel>
        <div class="vr-header">
          <div>
            <h3>50-State Voting Systems Map</h3>
            <p class="vr-sub">Switch lenses or click any state to configure legislative, presidential EV, and single-winner rules.</p>
          </div>
          <div class="vr-lens-tabs" role="tablist">
            ${LENS_MODES.map((m) => `<button type="button" class="vr-lens-tab ${lensMode === m.id ? 'active' : ''}" data-vr-lens="${esc(m.id)}">${esc(m.label)}</button>`).join('')}
          </div>
        </div>

        <div class="vr-map-wrap">
          <svg class="vr-svg-map" viewBox="${esc(viewBox)}" role="img" aria-label="50-State Voting Systems Map">
            ${svgBody}
          </svg>
          <div class="vr-legend">
            ${legendItems.map((it) => `<span class="vr-legend-item"><i class="vr-legend-swatch" style="background:${esc(it.color)}"></i>${esc(it.label)}</span>`).join('')}
          </div>
        </div>

        <!-- Inline Quick-Editor Card -->
        <div class="vr-quick-editor" data-vr-editor="${esc(selectedStateId)}">
          <div class="vr-quick-head">
            <h4>${esc(selectedStateId)} · ${esc(STATE_NAMES[selectedStateId] || selectedStateId)} Quick Reform Editor</h4>
            <button type="button" class="vr-action-btn" data-action="toggle-npvic" data-state-id="${esc(selectedStateId)}">
              ${activeRec.isNpvic ? '✓ NPVIC Signatory (Leave Compact)' : '+ Join NPVIC Compact'}
            </button>
          </div>
          <div class="vr-quick-controls">
            <div class="vr-field">
              <label for="vr-leg-select">Legislative System</label>
              <select id="vr-leg-select" data-action="set-state-voting-reform" data-reform-scope="legislative" data-state-id="${esc(selectedStateId)}">
                ${LEGISLATIVE_SYSTEMS.map((s) => `<option value="${esc(s.id)}" ${activeRec.legislative === s.id ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}
              </select>
            </div>
            <div class="vr-field">
              <label for="vr-ev-select">Presidential EV Rule</label>
              <select id="vr-ev-select" data-action="set-state-voting-reform" data-reform-scope="presidentialEvRule" data-state-id="${esc(selectedStateId)}">
                ${PRESIDENTIAL_EV_RULES.filter((r) => r.id !== 'npvic').map((s) => `<option value="${esc(s.id)}" ${activeRec.presidentialEvRule === s.id ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}
              </select>
            </div>
            <div class="vr-field">
              <label for="vr-single-select">Single-Winner System</label>
              <select id="vr-single-select" data-action="set-state-voting-reform" data-reform-scope="singleWinner" data-state-id="${esc(selectedStateId)}">
                ${SINGLE_WINNER_SYSTEMS.map((s) => `<option value="${esc(s.id)}" ${activeRec.singleWinner === s.id ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      </section>`;
  }

  // --------------------------------------------------------------------------
  // 2. Nationwide Trifecta Federal Reforms Panel
  // --------------------------------------------------------------------------
  function renderTrifectaReformsPanel(game, safe) {
    const esc = typeof safe === 'function' ? safe : defaultSafe;
    const tri = computeTrifectaStatus(game);
    const fed = game?.federalReforms || {};
    const enactedSet = new Set(Array.isArray(fed.enactedIds) ? fed.enactedIds : []);
    const disabledAttr = tri.hasTrifecta ? '' : 'disabled title="Requires Nationwide Trifecta (Presidency + U.S. House + U.S. Senate)"';
    const currentHouseRule = fed.houseExpansionRule || (fed.houseSize === 1000 ? 'house_sabato_1000' : (fed.houseSize === 692 ? 'house_cube_root_692' : (fed.houseSize === 573 ? 'house_wyoming_573' : 'house_435')));

    return `
      <section class="vr-panel" data-vr-trifecta-panel>
        <div class="vr-header">
          <div>
            <h3>Nationwide Trifecta Federal Reforms</h3>
            <p class="vr-sub">Enact structural constitutional, House apportionment, turnout, and campaign finance reforms while holding a federal trifecta.</p>
          </div>
          <div class="vr-trifecta-status ${tri.hasTrifecta ? 'active' : ''}">
            <span>Trifecta:</span>
            <span class="vr-branch-pill ${tri.hasPres ? 'held' : 'lost'}">Presidency ${tri.hasPres ? '✓' : '✗'}</span>
            <span class="vr-branch-pill ${tri.hasHouse ? 'held' : 'lost'}">House ${tri.hasHouse ? '✓' : '✗'}</span>
            <span class="vr-branch-pill ${tri.hasSenate ? 'held' : 'lost'}">Senate ${tri.hasSenate ? '✓' : '✗'}</span>
          </div>
        </div>

        <div class="vr-cards-grid">
          <!-- Card 1: Larry Sabato's 5 Constitutional Proposals -->
          <div class="vr-card">
            <h4>Larry Sabato’s 5 Constitutional Proposals</h4>
            <div class="vr-proposal-list">
              ${SABATO_PROPOSALS.map((prop) => {
                const isEnacted = enactedSet.has(prop.id) || Boolean(fed[prop.id]);
                return `
                  <div class="vr-proposal-item ${isEnacted ? 'enacted' : ''}">
                    <div class="vr-proposal-top">
                      <b>${esc(prop.title)}</b>
                      ${isEnacted ? '<span class="vr-preview-chip">Enacted ✓</span>' : ''}
                    </div>
                    <div class="vr-proposal-desc">${esc(prop.desc)}</div>
                    <button type="button" class="vr-action-btn" data-action="enact-trifecta-reform" data-reform-id="${esc(prop.id)}" ${isEnacted ? 'disabled' : disabledAttr}>
                      ${isEnacted ? 'Enacted' : 'Enact Proposal'}
                    </button>
                  </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Card 2: House Expansion Rules -->
          <div class="vr-card">
            <h4>U.S. House Expansion Rules</h4>
            <div class="vr-proposal-list">
              ${HOUSE_EXPANSION_RULES.map((rule) => {
                const isCurrent = currentHouseRule === rule.id;
                return `
                  <div class="vr-proposal-item ${isCurrent ? 'enacted' : ''}">
                    <div class="vr-proposal-top">
                      <b>${esc(rule.label)}</b>
                      <span class="vr-preview-chip">${esc(rule.seats)} House · ${esc(rule.evs)} EVs</span>
                    </div>
                    <div class="vr-proposal-desc">${esc(rule.desc)}</div>
                    <button type="button" class="vr-action-btn" data-action="enact-trifecta-reform" data-reform-id="${esc(rule.id)}" ${isCurrent ? 'disabled' : disabledAttr}>
                      ${isCurrent ? 'Active Rule' : `Set ${rule.seats}-Seat House`}
                    </button>
                  </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Card 3: National Turnout & Campaign Finance -->
          <div class="vr-card">
            <h4>National Turnout &amp; Campaign Finance</h4>
            <div class="vr-proposal-list">
              <div class="vr-proposal-item ${fed.compulsoryVoting ? 'enacted' : ''}">
                <div class="vr-proposal-top">
                  <b>Compulsory Voting</b>
                  <span class="vr-preview-chip">${fed.compulsoryVoting ? 'Active (+Turnout)' : 'Voluntary'}</span>
                </div>
                <div class="vr-proposal-desc">Requires universal voter participation with civic exemptions, lifting turnout and stabilizing electorate swings.</div>
                <button type="button" class="vr-action-btn" data-action="enact-trifecta-reform" data-reform-id="${fed.compulsoryVoting ? 'repeal_compulsory_voting' : 'compulsory_voting'}" ${disabledAttr}>
                  ${fed.compulsoryVoting ? 'Repeal Compulsory Voting' : 'Enact Compulsory Voting'}
                </button>
              </div>

              <div class="vr-proposal-item ${fed.superPacsBanned ? 'enacted' : ''}">
                <div class="vr-proposal-top">
                  <b>Super-PAC Ban &amp; Clean Elections</b>
                  <span class="vr-preview-chip">${fed.superPacsBanned ? 'Super-PACs Banned' : 'Super-PACs Legal'}</span>
                </div>
                <div class="vr-proposal-desc">Outlaws unlimited outside Super-PAC expenditures nationwide, shifting campaigns to small-dollar and party committees.</div>
                <button type="button" class="vr-action-btn" data-action="enact-trifecta-reform" data-reform-id="${fed.superPacsBanned ? 'reenable_super_pacs' : 'ban_super_pacs'}" ${disabledAttr}>
                  ${fed.superPacsBanned ? 'Re-Enable Super-PACs' : 'Ban Super-PACs'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  // --------------------------------------------------------------------------
  // 3. Super-PAC Banned Notice
  // --------------------------------------------------------------------------
  function renderSuperPacsBannedNotice(game, safe) {
    if (!game?.federalReforms?.superPacsBanned) return '';
    const esc = typeof safe === 'function' ? safe : defaultSafe;
    return `
      <div class="vr-superpac-banned-card" data-vr-superpac-banned>
        <div>
          <b>Super-PACs Banned Nationwide (Federal Clean Elections Act)</b>
          <p>${esc('Independent dark-money Super-PAC expenditures are currently prohibited across all federal races. Repeal via Nationwide Trifecta Reforms to restore outside PAC spending.')}</p>
        </div>
        <span class="vr-preview-chip">Outside PACs: $0M</span>
      </div>`;
  }

  // --------------------------------------------------------------------------
  // Event Binding Helper
  // --------------------------------------------------------------------------
  function bindVotingReformsEvents(container, game, uiState = {}, callbacks = {}) {
    if (!container || typeof container.addEventListener !== 'function') return;
    if (container.__vrBound) return;
    container.__vrBound = true;

    container.addEventListener('click', (e) => {
      const lensBtn = e.target?.closest?.('[data-vr-lens]');
      if (lensBtn) {
        uiState.lensMode = lensBtn.getAttribute('data-vr-lens') || 'legislative';
        callbacks?.onStateChange?.({ ...uiState });
        return;
      }

      const stateEl = e.target?.closest?.('[data-vr-state]');
      if (stateEl) {
        uiState.selectedStateId = stateEl.getAttribute('data-vr-state') || 'PA';
        callbacks?.onStateChange?.({ ...uiState });
        return;
      }

      const actionBtn = e.target?.closest?.('[data-action="enact-trifecta-reform"], [data-action="toggle-npvic"]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-action');
        callbacks?.onAction?.(action, {
          reformId: actionBtn.getAttribute('data-reform-id'),
          stateId: actionBtn.getAttribute('data-state-id')
        });
      }
    });

    container.addEventListener('change', (e) => {
      const sel = e.target?.closest?.('[data-action="set-state-voting-reform"]');
      if (sel) {
        callbacks?.onAction?.('set-state-voting-reform', {
          stateId: sel.getAttribute('data-state-id'),
          scope: sel.getAttribute('data-reform-scope'),
          value: sel.value
        });
      }
    });
  }

  return {
    LENS_MODES,
    LEGISLATIVE_SYSTEMS,
    PRESIDENTIAL_EV_RULES,
    SINGLE_WINNER_SYSTEMS,
    SABATO_PROPOSALS,
    HOUSE_EXPANSION_RULES,
    computeTrifectaStatus,
    renderElectoralSystemsVisualMap,
    renderTrifectaReformsPanel,
    renderSuperPacsBannedNotice,
    bindVotingReformsEvents
  };
});
