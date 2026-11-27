/**
 * Coalition Builder: Party Chair — Voting Reform Map Visual Adapter.
 * Generates SVG proportional stripe patterns, NPVIC override hatch patterns,
 * per-state map visual adaptations across presidential/house/state-legislatures modes,
 * and toggleable "Show Voting Systems" SVG overlay micro-badges.
 *
 * Standalone UMD/IIFE module exposing `window.VotingReformMapAdapter` and `module.exports`.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.VotingReformMapAdapter = api;
  }
  if (root && typeof root === 'object') {
    root.VotingReformMapAdapter = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DEFAULT_PARTY_COLORS = {
    people: '#3478c8',
    heritage: '#c9474e',
    liberty: '#eab308',
    green: '#22c55e',
    constitution: '#a855f7',
    socialist: '#f97316',
    independent: '#14b8a6',
    'ind-dem': '#1abc9c',
    'ind-rep': '#d48270',
    player: '#8b5cf6',
    split: '#8654a4',
    nonpartisan: '#475569',
    other: '#c3924d',
    pending: '#334155',
  };

  const PARTY_SHORT_CODES = {
    people: 'D',
    heritage: 'R',
    liberty: 'L',
    green: 'G',
    constitution: 'C',
    socialist: 'S',
    independent: 'I',
    'ind-dem': 'ID',
    'ind-rep': 'IR',
    player: 'P',
    nonpartisan: 'NP',
    other: 'O',
  };

  const PARTY_LABELS = {
    people: 'Democratic',
    heritage: 'Republican',
    liberty: 'Libertarian',
    green: 'Green',
    constitution: 'Constitution',
    socialist: 'Socialist / PFP',
    independent: 'Independent',
    'ind-dem': 'Ind (Dem)',
    'ind-rep': 'Ind (GOP)',
    player: 'Custom Party',
    split: 'Split',
    nonpartisan: 'Nonpartisan',
    other: 'Other',
  };

  const BADGE_PALETTE = {
    RCV: { bg: '#0f172a', border: '#38bdf8', text: '#7dd3fc' },
    APR: { bg: '#0f172a', border: '#34d399', text: '#6ee7b7' },
    PR: { bg: '#0f172a', border: '#a78bfa', text: '#ddd6fe' },
    STV: { bg: '#0f172a', border: '#f472b6', text: '#fbcfe8' },
    MMP: { bg: '#0f172a', border: '#f59e0b', text: '#fde68a' },
    SPLIT: { bg: '#0f172a', border: '#fb923c', text: '#fed7aa' },
    'PROP-EV': { bg: '#0f172a', border: '#22d3ee', text: '#a5f3fc' },
    NPVIC: { bg: '#1e1b4b', border: '#facc15', text: '#fef08a' },
  };

  function safeAttr(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function sanitizeIdPart(str) {
    return String(str || 'x').replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  function normalizeMapMode(mapMode) {
    const raw = String(mapMode || 'presidential').toLowerCase().trim();
    if (raw === 'presidential' || raw === 'election-night' || raw === 'pres') return 'presidential';
    if (raw === 'house' || raw === 'us-house') return 'house';
    if (raw === 'state-legislatures' || raw === 'stateleg' || raw === 'state-leg' || raw === 'legislatures') {
      return 'state-legislatures';
    }
    if (raw === 'governors' || raw === 'governor') return 'governors';
    if (raw === 'senate' || raw === 'senate-class' || raw === 'senate-combined') return 'senate';
    return raw;
  }

  function canonicalPartyColor(partyId, game, customPalette) {
    if (!partyId) return DEFAULT_PARTY_COLORS.pending;
    if (customPalette && customPalette[partyId]) return customPalette[partyId];
    if (partyId === 'player' || (game?.player?.custom && partyId === game.player.id)) {
      return game?.player?.color || customPalette?.player || DEFAULT_PARTY_COLORS.player;
    }
    return DEFAULT_PARTY_COLORS[partyId] || DEFAULT_PARTY_COLORS.other;
  }

  function partyShortCode(partyId, game) {
    if (partyId === 'player' || (game?.player?.custom && partyId === game.player.id)) {
      return String(game?.player?.code || 'P').slice(0, 3).toUpperCase();
    }
    return PARTY_SHORT_CODES[partyId] || String(partyId || '?').slice(0, 2).toUpperCase();
  }

  function partyDisplayLabel(partyId, game) {
    if (partyId === 'player' || (game?.player?.custom && partyId === game.player.id)) {
      return game?.player?.name || 'Custom Party';
    }
    return PARTY_LABELS[partyId] || String(partyId || 'Unknown');
  }

  function normalizeSystemName(sysRaw) {
    const s = String(sysRaw || 'plurality').toLowerCase().trim();
    if (s === 'ranked_choice' || s === 'ranked-choice' || s === 'irv' || s === 'rcv') return 'rcv';
    if (s === 'approval' || s === 'approval_voting') return 'approval';
    if (s === 'proportional' || s === 'open_list_proportional' || s === 'pr' || s === 'proportional_representation') {
      return s === 'open_list_proportional' ? 'open_list_proportional' : 'proportional';
    }
    if (s === 'stv' || s === 'single_transferable_vote') return 'stv';
    if (s === 'mmp' || s === 'mixed_member_proportional') return 'mmp';
    if (s === 'proportional_ev' || s === 'propev') return 'proportional_ev';
    if (s === 'district_split' || s === 'cd_split') return 'district_split';
    if (s === 'npvic') return 'npvic';
    if (s === 'sabato_mended_ec' || s === 'sabato') return 'sabato_mended_ec';
    return s || 'plurality';
  }

  function badgeLabelForSystem(systemId, npvicOverridden = false) {
    if (npvicOverridden || systemId === 'npvic') return 'NPVIC';
    if (systemId === 'rcv') return 'RCV';
    if (systemId === 'approval') return 'APR';
    if (systemId === 'proportional' || systemId === 'open_list_proportional') return 'PR';
    if (systemId === 'stv') return 'STV';
    if (systemId === 'mmp') return 'MMP';
    if (systemId === 'proportional_ev') return 'PROP-EV';
    if (systemId === 'district_split') return 'SPLIT';
    return null;
  }

  function getPatternId(kind, stateId, mapMode = '') {
    const modeTag = mapMode ? `-${sanitizeIdPart(mapMode)}` : '';
    return `reform-${sanitizeIdPart(kind)}${modeTag}-${sanitizeIdPart(stateId)}`;
  }

  function formatBreakdownMap(countsMap, game) {
    if (!countsMap || typeof countsMap !== 'object') return '';
    const entries = Object.entries(countsMap)
      .map(([pid, val]) => [pid, Number(val || 0)])
      .filter(([, val]) => Number.isFinite(val) && val > 0)
      .sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return '';
    return entries.map(([pid, val]) => {
      const displayVal = Number.isInteger(val) ? String(val) : `${val.toFixed(1)}%`;
      return `${partyShortCode(pid, game)} ${displayVal}`;
    }).join(' · ');
  }

  function aggregateClustersSeats(clusters) {
    const agg = {};
    if (!Array.isArray(clusters)) return agg;
    clusters.forEach((cl) => {
      const seatMap = cl?.seatsByParty || cl?.seats || cl;
      if (!seatMap || typeof seatMap !== 'object') return;
      Object.entries(seatMap).forEach(([pid, val]) => {
        if (pid === 'clusterId' || pid === 'name' || pid === 'seats') return;
        const n = Number(val || 0);
        if (Number.isFinite(n) && n > 0) agg[pid] = (agg[pid] || 0) + n;
      });
    });
    return agg;
  }

  function extractSegmentsFromBreakdown(bd, game, customPalette) {
    if (!bd || typeof bd !== 'object') return [];

    // Explicit splits order: evsByParty -> seatsByParty -> stvClusters -> shares
    let sourceMap = null;
    if (bd.evsByParty && typeof bd.evsByParty === 'object') sourceMap = bd.evsByParty;
    else if (bd.evByParty && typeof bd.evByParty === 'object') sourceMap = bd.evByParty;
    else if (bd.seatsByParty && typeof bd.seatsByParty === 'object') sourceMap = bd.seatsByParty;
    else if (Array.isArray(bd.stvClusters) && bd.stvClusters.length > 0) sourceMap = aggregateClustersSeats(bd.stvClusters);
    else if (Array.isArray(bd.clusters) && bd.clusters.length > 0) sourceMap = aggregateClustersSeats(bd.clusters);
    else if (bd.shares && typeof bd.shares === 'object') sourceMap = bd.shares;
    else if (bd.seatShares && typeof bd.seatShares === 'object') sourceMap = bd.seatShares;

    if (!sourceMap) return [];
    return Object.entries(sourceMap)
      .map(([partyId, value]) => ({
        partyId,
        value: Number(value || 0),
        color: canonicalPartyColor(partyId, game, customPalette),
      }))
      .filter((s) => Number.isFinite(s.value) && s.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  function buildProportionalStripePatternSvg(patternId, segments, tileSize = 40, includeClusterAccent = false) {
    if (!Array.isArray(segments) || segments.length === 0) return '';
    const total = segments.reduce((acc, s) => acc + Math.max(0, Number(s.value || 0)), 0);
    if (!Number.isFinite(total) || total <= 0) return '';

    const rects = [];
    let cursor = 0;
    segments.forEach((seg, idx) => {
      const w = idx === segments.length - 1
        ? Math.max(0.5, Number((tileSize - cursor).toFixed(2)))
        : Math.max(0.5, Number(((seg.value / total) * tileSize).toFixed(2)));
      if (cursor < tileSize) {
        const clippedW = Math.min(w, Number((tileSize - cursor).toFixed(2)));
        rects.push(`<rect x="${cursor.toFixed(2)}" y="0" width="${clippedW.toFixed(2)}" height="${tileSize}" fill="${safeAttr(seg.color)}"></rect>`);
        cursor += clippedW;
      }
    });

    if (includeClusterAccent) {
      rects.push(`<line x1="0" y1="0" x2="0" y2="${tileSize}" stroke="#0f172a" stroke-width="1.5" stroke-opacity="0.45"></line>`);
    }

    return `<pattern id="${safeAttr(patternId)}" patternUnits="userSpaceOnUse" width="${tileSize}" height="${tileSize}" patternTransform="rotate(45)">${rects.join('')}</pattern>`;
  }

  function buildNpvicHatchPatternSvg(patternId, npvWinnerColor, localWinnerColor) {
    const base = safeAttr(npvWinnerColor || DEFAULT_PARTY_COLORS.people);
    const hatch = safeAttr(localWinnerColor || DEFAULT_PARTY_COLORS.heritage);
    return (
      `<pattern id="${safeAttr(patternId)}" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(-45)">` +
      `<rect x="0" y="0" width="12" height="12" fill="${base}"></rect>` +
      `<rect x="0" y="0" width="4" height="12" fill="${hatch}" fill-opacity="0.9"></rect>` +
      `</pattern>`
    );
  }

  function normalizeBreakdownsInput(stateBreakdowns) {
    if (!stateBreakdowns) return {};
    if (Array.isArray(stateBreakdowns)) {
      const map = {};
      stateBreakdowns.forEach((entry) => {
        if (entry && entry.stateId) map[entry.stateId] = entry;
      });
      return map;
    }
    return typeof stateBreakdowns === 'object' ? stateBreakdowns : {};
  }

  function deriveFallbackBreakdownsFromGame(game) {
    const derived = {};
    if (!game || typeof game !== 'object') return derived;

    const presByState = game.lastElection?.presidential?.byState || game.lastElection?.presidentialResults || {};
    Object.entries(presByState).forEach(([stId, row]) => {
      if (!row || typeof row !== 'object') return;
      if (row.npvicOverridden || (row.evByParty && Object.values(row.evByParty).filter((v) => v > 0).length >= 2) || (row.evsByParty && Object.values(row.evsByParty).filter((v) => v > 0).length >= 2)) {
        derived[stId] = { ...row, stateId: stId, mapMode: 'presidential' };
      }
    });

    if (Array.isArray(game.representatives) && game.representatives.length > 0) {
      const byState = {};
      game.representatives.forEach((r) => {
        const stId = r?.stateId || r?.state;
        const pid = r?.partyId || r?.party;
        if (!stId || !pid) return;
        byState[stId] ||= {};
        byState[stId][pid] = (byState[stId][pid] || 0) + 1;
      });
      Object.entries(byState).forEach(([stId, seatsByParty]) => {
        const sys = game.stateElectoralSystems?.[stId];
        const normSys = normalizeSystemName(sys?.legislative || sys?.house || sys?.allRaces);
        if (['proportional', 'open_list_proportional', 'stv'].includes(normSys) || !derived[stId]) {
          derived[stId] = { ...(derived[stId] || {}), stateId: stId, seatsByParty, systemId: normSys };
        }
      });
    }

    return derived;
  }

  // --------------------------------------------------------------------------
  // 1. Dynamic SVG Proportional Stripe & NPVIC Hatch <defs> Generator
  // --------------------------------------------------------------------------

  function buildReformPatternDefsData(game, stateBreakdowns, partyColors = {}) {
    const rawMap = Object.keys(normalizeBreakdownsInput(stateBreakdowns)).length > 0
      ? normalizeBreakdownsInput(stateBreakdowns)
      : deriveFallbackBreakdownsFromGame(game);

    const patterns = [];
    const seenPatternIds = new Set();
    const patternIdsByState = {};

    Object.entries(rawMap).forEach(([stId, bd]) => {
      if (!bd || typeof bd !== 'object') return;
      const stateId = bd.stateId || stId;
      const mode = normalizeMapMode(bd.mapMode || bd.mode || '');
      const sys = normalizeSystemName(bd.systemId || bd.system || bd.kind || game?.stateElectoralSystems?.[stateId]?.allRaces);

      const isNpvic = Boolean(bd.npvicOverridden || sys === 'npvic');
      if (isNpvic) {
        const npvPid = bd.npvWinner || bd.awardedParty || bd.winner || 'people';
        const localPid = bd.localWinner || 'heritage';
        const npvColor = canonicalPartyColor(npvPid, game, partyColors);
        const localColor = canonicalPartyColor(localPid, game, partyColors);
        const pid = bd.patternId || getPatternId('npvic', stateId, mode || 'presidential');
        if (!seenPatternIds.has(pid)) {
          seenPatternIds.add(pid);
          patterns.push(buildNpvicHatchPatternSvg(pid, npvColor, localColor));
        }
        patternIdsByState[stateId] = pid;
        return;
      }

      const segments = extractSegmentsFromBreakdown(bd, game, partyColors);
      const isExpanded = Boolean(bd.expandedHouseOverflow || bd.expanded || sys === 'expanded');
      if (segments.length >= 2 || (segments.length === 1 && ['proportional', 'open_list_proportional', 'stv', 'proportional_ev', 'district_split', 'expanded'].includes(sys))) {
        const isStv = sys === 'stv' || Boolean(bd.stvClusters || bd.clusters);
        const kindTag = bd.kind || (isExpanded ? 'expanded' : (isStv ? 'stv' : (sys === 'proportional_ev' ? 'propev' : sys === 'district_split' ? 'split' : 'pr')));
        const pid = bd.patternId || getPatternId(kindTag, stateId, mode);
        if (!seenPatternIds.has(pid)) {
          seenPatternIds.add(pid);
          patterns.push(buildProportionalStripePatternSvg(pid, segments, isStv ? 32 : 40, isStv));
        }
        patternIdsByState[stateId] = pid;
      }
    });

    const svgDefs = `<defs>${patterns.join('')}</defs>`;
    return { svgDefs, patternIdsByState, patterns };
  }

  function buildReformPatternDefs(game, stateBreakdowns, partyColors = {}) {
    return buildReformPatternDefsData(game, stateBreakdowns, partyColors).svgDefs;
  }

  // --------------------------------------------------------------------------
  // 2. Per-State Visual Resolver
  // --------------------------------------------------------------------------

  function getStaticDistrictCountForState(stateId) {
    const districts = (typeof window !== 'undefined' && window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS)
      || (typeof globalThis !== 'undefined' && globalThis.PartyChairData?.VERSION_01_HOUSE_DISTRICTS)
      || [];
    const count = districts.filter((d) => d && d.stateId === stateId).length;
    return count;
  }

  function resolveStateElectoralConfig(game, stateId, mapMode, electionData) {
    const rec = game?.stateElectoralSystems?.[stateId] || {};
    const stElec = electionData?.presidential?.byState?.[stateId]
      || electionData?.presidentialResults?.[stateId]
      || electionData?.byState?.[stateId]
      || electionData?.stateBreakdowns?.[stateId]
      || {};

    let rawSystem = 'plurality';
    if (mapMode === 'presidential') {
      const stateExplicitPres = rec.presidential || (rec.allRaces && rec.allRaces !== 'plurality' ? rec.allRaces : null);
      rawSystem = stElec.systemId || stElec.evSystem || stateExplicitPres || game?.presidentialElectoralSystem || rec.allRaces || 'plurality';
    } else if (mapMode === 'house') {
      rawSystem = stElec.systemId || electionData?.house?.byState?.[stateId]?.systemId || rec.house || rec.legislative || rec.allRaces || 'plurality';
    } else if (mapMode === 'state-legislatures') {
      rawSystem = stElec.systemId || electionData?.stateLegislatures?.[stateId]?.systemId || rec.stateLeg || rec.legislative || rec.allRaces || 'plurality';
    } else {
      rawSystem = stElec.systemId || rec.allRaces || 'plurality';
    }

    if (rawSystem === 'plurality' && stateId === 'AK' && !rec.allRaces) {
      rawSystem = 'rcv';
    }
    if ((mapMode === 'house' || mapMode === 'state-legislatures') && game?.partySystems?.coalitionSystem?.mmpActive) {
      rawSystem = 'mmp';
    }
    return {
      systemId: normalizeSystemName(rawSystem),
      rec,
      stElec,
    };
  }

  function buildMmpSeatBarHtml(localSeatsByParty, listSeatsByParty, game) {
    const localTotal = Object.values(localSeatsByParty || {}).reduce((a, b) => a + Number(b || 0), 0);
    const listTotal = Object.values(listSeatsByParty || {}).reduce((a, b) => a + Number(b || 0), 0);
    const total = Math.max(1, localTotal + listTotal);
    const localPct = Math.round((localTotal / total) * 100);
    const listPct = 100 - localPct;

    const combined = {};
    [localSeatsByParty, listSeatsByParty].forEach((src) => {
      Object.entries(src || {}).forEach(([pid, v]) => {
        const n = Number(v || 0);
        if (n > 0) combined[pid] = (combined[pid] || 0) + n;
      });
    });

    return (
      `<div class="vrm-mmp-bar-wrap" style="margin-top:6px">` +
      `<div style="font-size:11px;color:#fde68a;font-weight:700">MMP: Local (${localTotal}) vs. List Top-Up (${listTotal})</div>` +
      `<div style="display:flex;height:8px;border-radius:4px;overflow:hidden;border:1px solid rgba(255,255,255,0.2);margin-top:3px">` +
      `<span style="width:${localPct}%;background:#38bdf8" title="Local Districts: ${localTotal}"></span>` +
      `<span style="width:${listPct}%;background:#f59e0b" title="List Top-Up: ${listTotal}"></span>` +
      `</div>` +
      `<div style="font-size:11px;margin-top:3px">Seats: ${safeAttr(formatBreakdownMap(combined, game) || `${total} total`)}</div>` +
      `</div>`
    );
  }

  function getStateMapVisualAdaptation(game, stateId, mapMode = 'presidential', electionData = {}) {
    const mode = normalizeMapMode(mapMode);
    const { systemId, rec, stElec } = resolveStateElectoralConfig(game, stateId, mode, electionData);

    const npvicOverridden = Boolean(
      stElec.npvicOverridden
      || electionData?.npvic?.overriddenStates?.[stateId]
      || electionData?.npvicOverriddenStates?.[stateId]
    );

    const sabatoBonusEv = Number(
      stElec.sabatoBonusEv ?? stElec.bonusEv ?? rec.sabatoBonusEv ?? 0
    );
    const sabatoActive = sabatoBonusEv > 0
      || Boolean(
        mode === 'presidential'
        && (game?.presidentialElectoralSystem === 'sabato_mended_ec' || game?.electoralReforms?.sabatoMendedEc || electionData?.sabatoMendedApplied)
        && (sabatoBonusEv > 0 || stElec.sabatoBonusApplied)
      );
    const bonusBadge = sabatoActive
      ? (sabatoBonusEv > 0 ? `+${sabatoBonusEv} Bonus EV` : '+Bonus EV')
      : null;

    const fallbackWinner = stElec.winner || game?.governorships?.[stateId] || 'people';
    const defaultFill = canonicalPartyColor(fallbackWinner, game);

    const result = {
      stateId,
      mapMode: mode,
      systemId: npvicOverridden ? 'npvic' : systemId,
      isReformed: npvicOverridden || systemId !== 'plurality' || sabatoActive,
      fill: defaultFill,
      patternId: null,
      badge: badgeLabelForSystem(systemId, npvicOverridden),
      bonusBadge,
      cssClasses: [],
      bypassDistrictPolygons: false,
      preserveDistrictPolygons: true,
      tooltipNote: '',
      tooltipHtml: '',
      breakdownText: '',
      seatCount: null,
      mmpSeatBarHtml: null,
      npvicOverridden,
    };

    if (result.isReformed) {
      result.cssClasses.push('reformed-state');
    }

    // --- Mode A: Presidential / Election Night ---
    if (mode === 'presidential') {
      if (npvicOverridden) {
        const npvWinner = stElec.npvWinner || stElec.awardedParty || electionData?.npvic?.winner || 'people';
        const localWinner = stElec.localWinner || stElec.winner || 'heritage';
        const patternId = getPatternId('npvic', stateId, mode);
        result.patternId = patternId;
        result.fill = `url(#${patternId})`;
        result.badge = 'NPVIC';
        result.cssClasses.push('npvic-override');
        result.tooltipNote = `Local winner: ${partyDisplayLabel(localWinner, game)} → EVs awarded to ${partyDisplayLabel(npvWinner, game)} via NPVIC`;
        if (bonusBadge) result.tooltipNote += ` · ${bonusBadge}`;
        result.tooltipHtml = `<div><strong>${safeAttr(stateId)} · NPVIC Override</strong><div>${safeAttr(result.tooltipNote)}</div></div>`;
        return result;
      }

      const evMap = stElec.evsByParty || stElec.evByParty || null;
      const nonZeroEvs = evMap
        ? Object.entries(evMap).filter(([, v]) => Number.isFinite(Number(v)) && Number(v) > 0)
        : [];
      if ((systemId === 'proportional_ev' || systemId === 'district_split') && nonZeroEvs.length >= 2) {
        const kind = systemId === 'proportional_ev' ? 'propev' : 'split';
        const patternId = getPatternId(kind, stateId, mode);
        const breakdown = formatBreakdownMap(evMap, game);
        result.patternId = patternId;
        result.fill = `url(#${patternId})`;
        result.badge = systemId === 'proportional_ev' ? 'PROP-EV' : 'SPLIT';
        result.breakdownText = breakdown;
        result.cssClasses.push(systemId === 'proportional_ev' ? 'prop-ev-split' : 'district-ev-split');
        result.tooltipNote = `${result.badge}: ${breakdown}`;
        if (bonusBadge) result.tooltipNote += ` · ${bonusBadge}`;
        result.tooltipHtml = `<div><strong>${safeAttr(stateId)} · ${result.badge}</strong><div>${safeAttr(result.tooltipNote)}</div></div>`;
        return result;
      }

      const presShares = stElec.shares || null;
      if (presShares) {
        result.breakdownText = formatBreakdownMap(presShares, game);
      }
      if (bonusBadge) {
        result.tooltipNote = `${result.badge ? `${result.badge} · ` : ''}${bonusBadge}${result.breakdownText ? ` (${result.breakdownText})` : ''}`;
      } else if (result.badge) {
        result.tooltipNote = `${result.badge}${result.breakdownText ? `: ${result.breakdownText}` : ''}`;
      }
      result.tooltipHtml = `<div>${safeAttr(result.tooltipNote || `${stateId}: ${partyDisplayLabel(fallbackWinner, game)}`)}</div>`;
      return result;
    }

    // --- Mode B & C: House & State Legislatures ---
    const houseStateData = electionData?.house?.byState?.[stateId] || {};
    const legStateData = electionData?.stateLegislatures?.[stateId] || {};
    const rawSeatsMap = stElec.seatsByParty || houseStateData.seatsByParty || legStateData.seatsByParty || null;

    // Derive seat map from game.representatives if House mode and no explicit breakdown supplied
    let seatsByParty = rawSeatsMap;
    if (!seatsByParty && mode === 'house' && Array.isArray(game?.representatives)) {
      const derivedSeats = {};
      game.representatives.forEach((rep) => {
        if ((rep?.stateId || rep?.state) === stateId) {
          const pid = rep.partyId || rep.party || 'people';
          derivedSeats[pid] = (derivedSeats[pid] || 0) + 1;
        }
      });
      if (Object.keys(derivedSeats).length > 0) seatsByParty = derivedSeats;
    }

    const totalSeats = Number(
      stElec.totalSeats
      ?? houseStateData.totalSeats
      ?? legStateData.totalSeats
      ?? (seatsByParty ? Object.values(seatsByParty).reduce((a, b) => a + Number(b || 0), 0) : 0)
    );
    const staticPolyCount = Number(
      electionData?.staticDistrictPolygons?.[stateId]
      ?? game?.staticDistrictPolygons?.[stateId]
      ?? getStaticDistrictCountForState(stateId)
    );
    const declaredNationalHouseSize = Number(
      electionData?.houseSize
      ?? game?.houseSize
      ?? game?.currentHouseMap?.totalDistricts
      ?? 435
    );
    const expandedHouseOverflow = mode === 'house' && (
      (totalSeats > 0 && staticPolyCount > 0 && totalSeats > staticPolyCount)
      || (declaredNationalHouseSize > 435 && totalSeats > staticPolyCount)
    );

    if (systemId === 'proportional' || systemId === 'open_list_proportional') {
      const patternId = getPatternId('pr', stateId, mode);
      const breakdown = formatBreakdownMap(seatsByParty, game);
      result.patternId = patternId;
      result.fill = `url(#${patternId})`;
      result.badge = 'PR';
      result.bypassDistrictPolygons = true;
      result.preserveDistrictPolygons = false;
      result.seatCount = totalSeats || null;
      result.breakdownText = breakdown;
      result.cssClasses.push('proportional-state-fill');
      result.tooltipNote = `${stateId}: ${totalSeats ? `${totalSeats} seats · ` : ''}${breakdown || 'Proportional Representation (PR)'}`;
      result.tooltipHtml = `<div><strong>${safeAttr(stateId)} · Proportional (PR)</strong><div>${safeAttr(result.tooltipNote)}</div></div>`;
      return result;
    }

    if (systemId === 'stv') {
      const clusters = stElec.stvClusters || houseStateData.stvClusters || legStateData.stvClusters || stElec.clusters || [];
      const clusterSeats = aggregateClustersSeats(clusters);
      const effSeats = Object.keys(clusterSeats).length > 0 ? clusterSeats : seatsByParty;
      const patternId = getPatternId('stv', stateId, mode);
      const clusterSummaries = Array.isArray(clusters) && clusters.length > 0
        ? clusters.map((c, idx) => `${c.name || `Cluster ${idx + 1}`}: ${formatBreakdownMap(c.seatsByParty || c.seats || c, game)}`).join(' | ')
        : formatBreakdownMap(effSeats, game);
      result.patternId = patternId;
      result.fill = `url(#${patternId})`;
      result.badge = 'STV';
      result.bypassDistrictPolygons = true;
      result.preserveDistrictPolygons = false;
      result.seatCount = totalSeats || Object.values(effSeats || {}).reduce((a, b) => a + Number(b || 0), 0) || null;
      result.breakdownText = clusterSummaries;
      result.cssClasses.push('stv-cluster-fill');
      result.tooltipNote = `${stateId} STV Clusters: ${clusterSummaries || 'Multi-member STV'}`;
      result.tooltipHtml = `<div><strong>${safeAttr(stateId)} · STV Multi-Member Clusters</strong><div>${safeAttr(clusterSummaries)}</div></div>`;
      return result;
    }

    if (systemId === 'mmp') {
      const localSeats = stElec.localSeatsByParty || houseStateData.localSeatsByParty || legStateData.localSeatsByParty || seatsByParty || {};
      const listSeats = stElec.listSeatsByParty || houseStateData.listSeatsByParty || legStateData.listSeatsByParty || {};
      const mmpBar = buildMmpSeatBarHtml(localSeats, listSeats, game);
      result.badge = 'MMP';
      result.preserveDistrictPolygons = true;
      result.bypassDistrictPolygons = false;
      result.cssClasses.push('mmp-double-border');
      result.mmpSeatBarHtml = mmpBar;
      result.seatCount = totalSeats || null;
      const localTot = Object.values(localSeats).reduce((a, b) => a + Number(b || 0), 0);
      const listTot = Object.values(listSeats).reduce((a, b) => a + Number(b || 0), 0);
      result.breakdownText = `Local ${localTot} + List ${listTot}`;
      result.tooltipNote = `${stateId} · MMP (Local ${localTot} vs. List Top-Up ${listTot})`;
      result.tooltipHtml = `<div><strong>${safeAttr(stateId)} · Mixed-Member Proportional (MMP)</strong>${mmpBar}</div>`;
      return result;
    }

    if (expandedHouseOverflow) {
      const patternId = getPatternId('expanded', stateId, mode);
      const breakdown = formatBreakdownMap(seatsByParty, game);
      result.patternId = patternId;
      result.fill = `url(#${patternId})`;
      result.bypassDistrictPolygons = true;
      result.preserveDistrictPolygons = false;
      result.isReformed = true;
      result.seatCount = totalSeats;
      result.breakdownText = breakdown;
      result.cssClasses.push('expanded-house-prop-fallback');
      result.tooltipNote = `${stateId}: ${totalSeats} House seats${breakdown ? ` (${breakdown})` : ''}`;
      result.tooltipHtml = `<div><strong>${safeAttr(stateId)}: ${totalSeats} House seats</strong>${breakdown ? `<div>${safeAttr(breakdown)}</div>` : ''}</div>`;
      return result;
    }

    if (result.badge) {
      const breakdown = formatBreakdownMap(seatsByParty, game);
      result.breakdownText = breakdown;
      result.tooltipNote = `${stateId} · ${result.badge}${breakdown ? ` (${breakdown})` : ''}`;
      result.tooltipHtml = `<div>${safeAttr(result.tooltipNote)}</div>`;
    }

    return result;
  }

  // --------------------------------------------------------------------------
  // 3. "Show Voting Systems" SVG Overlay Micro-Badges
  // --------------------------------------------------------------------------

  function normalizeCentroidsInput(stateCentroids, game) {
    const out = [];
    if (Array.isArray(stateCentroids)) {
      stateCentroids.forEach((s) => {
        const id = s?.id || s?.stateId;
        const x = Number(s?.cx ?? s?.x);
        const y = Number(s?.cy ?? s?.y);
        if (id && Number.isFinite(x) && Number.isFinite(y)) out.push({ id, x, y });
      });
      return out;
    }
    if (stateCentroids && typeof stateCentroids === 'object') {
      Object.entries(stateCentroids).forEach(([id, pos]) => {
        const x = Number(pos?.cx ?? pos?.x);
        const y = Number(pos?.cy ?? pos?.y);
        if (Number.isFinite(x) && Number.isFinite(y)) out.push({ id, x, y });
      });
      return out;
    }
    const mapStates = (typeof window !== 'undefined' && window.PartyChairData?.MAPS?.states)
      || (typeof globalThis !== 'undefined' && globalThis.PartyChairData?.MAPS?.states)
      || [];
    mapStates.forEach((s) => {
      const x = Number(s?.cx ?? s?.x);
      const y = Number(s?.cy ?? s?.y);
      if (s?.id && Number.isFinite(x) && Number.isFinite(y)) out.push({ id: s.id, x, y });
    });
    return out;
  }

  function renderElectoralSystemBadgesSvg(game, stateCentroids, mapMode = 'presidential', enabled = true, electionData = {}) {
    if (!enabled) return '';
    const mode = normalizeMapMode(mapMode);
    const centroids = normalizeCentroidsInput(stateCentroids, game);
    if (centroids.length === 0) return '';

    const pills = [];
    centroids.forEach(({ id, x, y }) => {
      if (id === 'DC' && mode !== 'presidential') return;
      const adaptation = getStateMapVisualAdaptation(game, id, mode, electionData);
      const badge = adaptation?.badge;
      if (!badge || !BADGE_PALETTE[badge]) return;

      const palette = BADGE_PALETTE[badge];
      const pillWidth = Math.max(24, badge.length * 6.5 + 8);
      const pillHeight = 13;
      const tx = Number((x - pillWidth / 2).toFixed(1));
      const ty = Number((y + 6).toFixed(1));

      pills.push(
        `<g class="reform-system-badge" data-map-state="${safeAttr(id)}" data-reform-badge="${safeAttr(badge)}" transform="translate(${tx},${ty})" pointer-events="none">` +
        `<rect x="0" y="0" width="${pillWidth.toFixed(1)}" height="${pillHeight}" rx="3.5" fill="${palette.bg}" stroke="${palette.border}" stroke-width="1.1"></rect>` +
        `<text x="${(pillWidth / 2).toFixed(1)}" y="9.5" text-anchor="middle" font-size="7.5" font-weight="700" fill="${palette.text}" font-family="ui-sans-serif, system-ui, sans-serif">${safeAttr(badge)}</text>` +
        `</g>`
      );
    });

    if (pills.length === 0) return '';
    return `<g class="reform-badges-layer" data-map-mode="${safeAttr(mode)}">${pills.join('')}</g>`;
  }

  return {
    DEFAULT_PARTY_COLORS,
    PARTY_SHORT_CODES,
    PARTY_LABELS,
    BADGE_PALETTE,
    getPatternId,
    normalizeMapMode,
    normalizeSystemName,
    canonicalPartyColor,
    buildReformPatternDefsData,
    buildReformPatternDefs,
    getStateMapVisualAdaptation,
    renderElectoralSystemBadgesSvg,
  };
});
