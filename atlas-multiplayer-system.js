/* ==========================================================================
   v0.18.4 STANDALONE MODULE:
   Proposal #10 — Chair Legacy, Hall of Fame & Post-Game Political Atlas
   Proposal #12 — Multiplayer / Hotseat "Dueling Chairs" Mode
   Exposes window.AtlasMultiplayerSystem (and module.exports for Node tests).
   Zero Math.random() — 100% deterministic seeded hashing.
   ========================================================================== */
(function (global) {
  'use strict';

  const MAX_ATLAS_CYCLES = 40;
  const TURN_FILE_FORMAT = 'cbturn-v1';

  const PARTY_META = {
    people: { id: 'people', name: 'Democratic Party', short: 'DEM', color: '#2b6cb0', isMajor: true },
    heritage: { id: 'heritage', name: 'Republican Party', short: 'GOP', color: '#c53030', isMajor: true },
    liberty: { id: 'liberty', name: 'Libertarian Party', short: 'LIB', color: '#d69e2e', isMajor: false },
    green: { id: 'green', name: 'Green Party', short: 'GRN', color: '#2f855a', isMajor: false },
    constitution: { id: 'constitution', name: 'Constitution Party', short: 'CON', color: '#805ad5', isMajor: false },
    socialist: { id: 'socialist', name: 'Socialist Party', short: 'SOC', color: '#e53e3e', isMajor: false },
    justice: { id: 'justice', name: 'Justice Party', short: 'JUS', color: '#319795', isMajor: false },
    independent: { id: 'independent', name: 'Independent', short: 'IND', color: '#718096', isMajor: false },
    player: { id: 'player', name: 'Custom Party', short: 'CST', color: '#8b5cf6', isMajor: false },
  };

  const HARRIS_2024_STATES = new Set([
    'CA', 'CO', 'CT', 'DE', 'DC', 'HI', 'IL', 'MD', 'MA', 'MN',
    'NH', 'NJ', 'NM', 'NY', 'OR', 'RI', 'VT', 'VA', 'WA', 'ME',
  ]);

  /* ------------------------------------------------------------------------
     Deterministic Hash & Utility Helpers (No Math.random)
     ------------------------------------------------------------------------ */
  function fnv1aHash(str) {
    const s = String(str || '');
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  function seededUnit(seedStr) {
    const hex = fnv1aHash(seedStr);
    return (parseInt(hex, 16) >>> 0) / 4294967296;
  }

  function clamp(v, lo, hi) {
    const n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  function round1(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 10) / 10;
  }

  function safeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function decodeSvgPath(encoded) {
    if (!encoded || typeof encoded !== 'string') return '';
    let x = 0;
    let y = 0;
    let position = 0;
    const number = () => {
      let result = 0;
      let shift = 0;
      let chunk;
      do {
        chunk = encoded.charCodeAt(position++) - 63;
        result |= (chunk & 0x1f) << shift;
        shift += 5;
      } while (chunk >= 0x20 && position < encoded.length);
      return result & 1 ? ~(result >> 1) : result >> 1;
    };
    const coords = [];
    while (position < encoded.length) {
      x += number();
      y += number();
      coords.push([x / 10, y / 10]);
    }
    if (!coords.length) return '';
    return `M${coords.map(([px, py]) => `${px},${py}`).join('L')}Z`;
  }

  function getActivePartyId(game) {
    if (!game) return 'people';
    if (game.player?.custom) return 'player';
    return game.player?.baseTemplateId || game.player?.id || 'people';
  }

  function getPartyMeta(game, partyId) {
    if (!partyId) return { id: 'other', name: 'Other', short: 'OTH', color: '#64748b' };
    if (partyId === 'player' && game?.player) {
      return {
        id: 'player',
        name: game.player.name || 'Custom Party',
        short: (game.player.code || 'CST').slice(0, 4).toUpperCase(),
        color: game.player.color || '#8b5cf6',
        isMajor: false,
      };
    }
    const savedProfile = game?.multiplayer?.partyProfiles?.[partyId];
    if (savedProfile) {
      return {
        id: partyId,
        name: savedProfile.name || PARTY_META[partyId]?.name || partyId,
        short: savedProfile.short || PARTY_META[partyId]?.short || partyId.slice(0, 3).toUpperCase(),
        color: savedProfile.color || PARTY_META[partyId]?.color || '#64748b',
        isMajor: Boolean(savedProfile.isMajor ?? PARTY_META[partyId]?.isMajor),
      };
    }
    if (PARTY_META[partyId]) return PARTY_META[partyId];
    const dataArch = (global.PartyChairData?.PARTY_ARCHETYPES || []).find((a) => a.id === partyId);
    if (dataArch) {
      return {
        id: dataArch.id,
        name: dataArch.name,
        short: (dataArch.shortName || dataArch.id.slice(0, 3)).toUpperCase(),
        color: dataArch.color || '#64748b',
        isMajor: Boolean(dataArch.isMajor),
      };
    }
    return { id: partyId, name: String(partyId), short: String(partyId).slice(0, 3).toUpperCase(), color: '#64748b', isMajor: false };
  }

  function getPartyColor(game, partyId) {
    return getPartyMeta(game, partyId).color || '#64748b';
  }

  /* ========================================================================
     NORMALIZATION & SAVE COMPACTION (Backward Compatibility)
     ======================================================================== */
  function defaultMultiplayerState() {
    return {
      enabled: false,
      mode: 'hotseat',
      humanPartyIds: [],
      activeHumanIndex: 0,
      privacyCurtainActive: false,
      pendingMonthlyOrders: {},
      turnOrderOffset: 0,
      lockedPartyIdsThisRound: [],
      privateNotesByParty: {},
      privateOppoByParty: {},
      partyProfiles: {},
      roundNumber: 1,
    };
  }

  function normalizeAtlasAndMultiplayer(game) {
    if (!game || typeof game !== 'object') return game;
    if (!Array.isArray(game.atlasHistory)) {
      game.atlasHistory = [];
    } else if (game.atlasHistory.length > MAX_ATLAS_CYCLES) {
      game.atlasHistory = game.atlasHistory.slice(-MAX_ATLAS_CYCLES);
    }

    if (!game.legacyMeta || typeof game.legacyMeta !== 'object') {
      const pId = getActivePartyId(game);
      const curTier = Number(game.partyTiers?.[pId]?.tier ?? game.partyTiers?.[pId] ?? game.parties?.[pId]?.tier ?? (['people', 'heritage'].includes(pId) ? 5 : 1));
      game.legacyMeta = {
        startingTier: clamp(curTier, 0, 5),
        peakTier: clamp(curTier, 0, 5),
        longestServingOfficial: null,
        coalitionEvents: [],
        retired: false,
      };
    }

    const baseMp = defaultMultiplayerState();
    if (!game.multiplayer || typeof game.multiplayer !== 'object') {
      game.multiplayer = baseMp;
    } else {
      game.multiplayer = {
        ...baseMp,
        ...game.multiplayer,
        enabled: Boolean(game.multiplayer.enabled),
        mode: game.multiplayer.mode === 'async_file' ? 'async_file' : 'hotseat',
        humanPartyIds: Array.isArray(game.multiplayer.humanPartyIds) ? [...game.multiplayer.humanPartyIds] : [],
        activeHumanIndex: Number.isFinite(Number(game.multiplayer.activeHumanIndex)) ? Number(game.multiplayer.activeHumanIndex) : 0,
        privacyCurtainActive: Boolean(game.multiplayer.privacyCurtainActive),
        pendingMonthlyOrders: (game.multiplayer.pendingMonthlyOrders && typeof game.multiplayer.pendingMonthlyOrders === 'object')
          ? game.multiplayer.pendingMonthlyOrders : {},
        turnOrderOffset: Number(game.multiplayer.turnOrderOffset || 0),
        lockedPartyIdsThisRound: Array.isArray(game.multiplayer.lockedPartyIdsThisRound) ? [...game.multiplayer.lockedPartyIdsThisRound] : [],
        privateNotesByParty: (game.multiplayer.privateNotesByParty && typeof game.multiplayer.privateNotesByParty === 'object')
          ? game.multiplayer.privateNotesByParty : {},
        privateOppoByParty: (game.multiplayer.privateOppoByParty && typeof game.multiplayer.privateOppoByParty === 'object')
          ? game.multiplayer.privateOppoByParty : {},
        partyProfiles: (game.multiplayer.partyProfiles && typeof game.multiplayer.partyProfiles === 'object')
          ? game.multiplayer.partyProfiles : {},
        roundNumber: Math.max(1, Number(game.multiplayer.roundNumber || 1)),
      };
    }
    return game;
  }

  function compactAtlasForSave(copy) {
    if (!copy || typeof copy !== 'object') return copy;
    if (Array.isArray(copy.atlasHistory)) {
      copy.atlasHistory = copy.atlasHistory.slice(-MAX_ATLAS_CYCLES).map((snap) => ({
        year: Number(snap.year || 2028),
        eraId: String(snap.eraId || 'era_contemporary'),
        presWinner: snap.presWinner || null,
        evByParty: snap.evByParty || {},
        houseSeatsByParty: snap.houseSeatsByParty || {},
        senateSeatsByParty: snap.senateSeatsByParty || {},
        playerVoteShare: round1(snap.playerVoteShare || 0),
        playerTier: clamp(Number(snap.playerTier ?? 1), 0, 5),
        factionOwnershipMap: snap.factionOwnershipMap || {},
        statePresWinners: snap.statePresWinners || {},
        biggestUpset: snap.biggestUpset || null,
      }));
    }
    if (copy.legacyMeta && Array.isArray(copy.legacyMeta.coalitionEvents) && copy.legacyMeta.coalitionEvents.length > 80) {
      copy.legacyMeta = {
        ...copy.legacyMeta,
        coalitionEvents: copy.legacyMeta.coalitionEvents.slice(-80),
      };
    }
    return copy;
  }

  /* ========================================================================
     PROPOSAL #10: COMPACT CYCLE SNAPSHOT RECORDER
     ======================================================================== */
  function tallySeatsByParty(game, office) {
    const counts = {};
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    sitting.forEach((m) => {
      if (!m || m.office !== office) return;
      const pid = m.party || m.caucus || 'independent';
      counts[pid] = (counts[pid] || 0) + 1;
    });
    return counts;
  }

  function extractStatePresWinners(game) {
    const out = {};
    const le = game?.lastElection || {};
    const raw = le.presidentialResults || le.presidential?.byState || game?.presidentialResults || game?.presidentialForecast?.byState || null;
    if (raw && typeof raw === 'object') {
      Object.entries(raw).forEach(([stId, val]) => {
        if (!stId || stId.length > 3) return;
        const winner = typeof val === 'string' ? val : (val?.winner || val?.party || null);
        if (winner) out[stId] = winner;
      });
    }
    if (Object.keys(out).length === 0 && Array.isArray(game?.states)) {
      game.states.forEach((s) => {
        const lean = Number(s.lean || 0);
        out[s.id] = lean < 0 ? 'people' : lean > 0 ? 'heritage' : (HARRIS_2024_STATES.has(s.id) ? 'people' : 'heritage');
      });
    }
    return out;
  }

  function extractEvByParty(game, statePresWinners) {
    const le = game?.lastElection || {};
    const direct = le.evByParty || le.presidential?.evByParty || le.presidential?.ev || le.presidential?.electoralVotes;
    if (direct && typeof direct === 'object' && Object.keys(direct).length > 0) {
      const clean = {};
      Object.entries(direct).forEach(([k, v]) => {
        const n = Number(v || 0);
        if (n > 0) clean[k] = Math.round(n);
      });
      if (Object.keys(clean).length > 0) return clean;
    }
    const tally = {};
    const states = Array.isArray(game?.states) ? game.states : (global.PartyChairData?.STATES || []);
    const evMap = new Map(states.map((s) => [s.id, Number(s.ev || s.electoralVotes || 3)]));
    Object.entries(statePresWinners || {}).forEach(([stId, winner]) => {
      const ev = evMap.get(stId) || (stId === 'DC' ? 3 : 3);
      tally[winner] = (tally[winner] || 0) + ev;
    });
    return tally;
  }

  function detectBiggestUpset(game, statePresWinners) {
    const le = game?.lastElection || {};
    const states = Array.isArray(game?.states) ? game.states : (global.PartyChairData?.STATES || []);
    const stateMap = new Map(states.map((s) => [s.id, s]));
    let best = null;

    const presRaw = le.presidentialResults || le.presidential?.byState || game?.presidentialResults || {};
    Object.entries(statePresWinners || {}).forEach(([stId, winner]) => {
      const st = stateMap.get(stId);
      const leanPct = st ? (st.leanPercent !== undefined ? Number(st.leanPercent) : -Number(st.lean || 0) * 100) : 0;
      const expected = leanPct >= 0 ? 'people' : 'heritage';
      const entry = presRaw[stId];
      const rawMargin = (entry && typeof entry === 'object' && Number.isFinite(Number(entry.margin)))
        ? Math.abs(Number(entry.margin))
        : Math.max(0.1, round1(Math.abs(leanPct) * 0.25 + 0.5));
      const surpriseScore = winner !== expected ? Math.abs(leanPct) + (10 / (rawMargin + 1)) : (rawMargin < 2.0 ? (4 - rawMargin) : 0);
      if (surpriseScore > 0 && (!best || surpriseScore > best._score)) {
        best = {
          stateId: stId,
          raceType: 'president',
          winner,
          expectedParty: expected,
          margin: round1(rawMargin),
          _score: surpriseScore,
        };
      }
    });

    if (best) {
      delete best._score;
      return best;
    }
    return null;
  }

  function extractFactionOwnershipMap(game) {
    const map = {};
    const facs = Array.isArray(game?.factions) ? game.factions : [];
    facs.forEach((f) => {
      if (f && f.id) {
        map[f.id] = f.partyId || f.party || 'unaffiliated';
      }
    });
    return map;
  }

  function computePlayerVoteShare(game, playerPartyId) {
    const le = game?.lastElection || {};
    const shares = le.popularVoteShares || le.presidential?.shares || le.shares || le.nationalShares || null;
    if (shares && typeof shares === 'object' && Number.isFinite(Number(shares[playerPartyId]))) {
      const val = Number(shares[playerPartyId]);
      return round1(val <= 1.0 ? val * 100 : val);
    }
    const pop = le.popularVote || le.presidential?.popularVote;
    if (pop && typeof pop === 'object') {
      const total = Object.values(pop).reduce((s, v) => s + Number(v || 0), 0);
      if (total > 0 && Number.isFinite(Number(pop[playerPartyId]))) {
        return round1((Number(pop[playerPartyId]) / total) * 100);
      }
    }
    const voterStates = game?.voterModel?.states;
    if (Array.isArray(voterStates) && voterStates.length > 0) {
      let pVotes = 0;
      let totalV = 0;
      voterStates.forEach((st) => {
        const aff = st.affiliations || {};
        pVotes += Number(aff[playerPartyId] || 0);
        Object.values(aff).forEach((v) => { totalV += Number(v || 0); });
      });
      if (totalV > 0) return round1((pVotes / totalV) * 100);
    }
    const house = tallySeatsByParty(game, 'house');
    const totalH = Object.values(house).reduce((s, v) => s + v, 0);
    if (totalH > 0) return round1(((house[playerPartyId] || 0) / totalH) * 100);
    return 0;
  }

  function recordAtlasSnapshot(game) {
    if (!game || typeof game !== 'object') return game;
    normalizeAtlasAndMultiplayer(game);

    const year = Number(game.year || 2028);
    const pId = getActivePartyId(game);
    const eraId = String(game.partySystems?.currentEraId || game.partySystems?.eraId || game.eraId || 'era_contemporary');
    const statePresWinners = extractStatePresWinners(game);
    const evByParty = extractEvByParty(game, statePresWinners);

    let presWinner = game.lastElection?.presidentialWinner
      || game.lastElection?.presidential?.winner
      || game.governingParty
      || null;
    if (!presWinner && Object.keys(evByParty).length > 0) {
      presWinner = Object.entries(evByParty).sort((a, b) => b[1] - a[1])[0][0];
    }

    const houseSeatsByParty = tallySeatsByParty(game, 'house');
    const senateSeatsByParty = tallySeatsByParty(game, 'senate');
    const playerVoteShare = computePlayerVoteShare(game, pId);
    const rawTier = game.partyTiers?.[pId]?.tier ?? game.partyTiers?.[pId] ?? game.parties?.[pId]?.tier ?? (['people', 'heritage'].includes(pId) ? 5 : 1);
    const playerTier = clamp(Number(rawTier), 0, 5);
    const factionOwnershipMap = extractFactionOwnershipMap(game);
    const biggestUpset = detectBiggestUpset(game, statePresWinners);

    const snapshot = {
      year,
      eraId,
      presWinner,
      evByParty,
      houseSeatsByParty,
      senateSeatsByParty,
      playerVoteShare,
      playerTier,
      factionOwnershipMap,
      statePresWinners,
      biggestUpset,
    };

    // Detect faction bolts between previous snapshot and current snapshot
    const prevSnap = game.atlasHistory.length > 0 ? game.atlasHistory[game.atlasHistory.length - 1] : null;
    if (prevSnap && prevSnap.year !== year && prevSnap.factionOwnershipMap) {
      const events = Array.isArray(game.legacyMeta.coalitionEvents) ? [...game.legacyMeta.coalitionEvents] : [];
      Object.entries(factionOwnershipMap).forEach(([fId, curParty]) => {
        const oldParty = prevSnap.factionOwnershipMap[fId];
        if (oldParty && oldParty !== curParty) {
          events.push({ year, factionId: fId, type: 'bolt', fromParty: oldParty, toParty: curParty });
        }
      });
      // Also record any recent summits from yearLog
      (game.yearLog || []).forEach((entry) => {
        const txt = String(entry?.action || '');
        if (entry?.year === year && /summit/i.test(txt)) {
          events.push({ year, factionId: entry.factionId || 'coalition', type: 'summit', note: txt.slice(0, 80) });
        }
      });
      game.legacyMeta.coalitionEvents = events.slice(-80);
    }

    // Track peak tier & longest-serving party official
    game.legacyMeta.peakTier = Math.max(Number(game.legacyMeta.peakTier || 0), playerTier);
    const pool = [...(game.sittingMembers || []), ...(game.councilOfElders || [])].filter((m) => m && (m.party === pId || m.caucus === pId));
    pool.forEach((m) => {
      const startYr = Number(m.electedYear || m.startYear || (year - Math.max(2, Number(m.terms || 1) * 2)));
      const served = Math.max(2, (Number(m.retiredYear || year) - startYr));
      const curBest = game.legacyMeta.longestServingOfficial;
      if (!curBest || served > Number(curBest.yearsServed || 0)) {
        game.legacyMeta.longestServingOfficial = {
          name: m.name || 'Unnamed Official',
          office: m.office || 'official',
          state: m.state || m.stateId || 'US',
          party: m.party || pId,
          yearsServed: served,
          startYear: startYr,
        };
      }
    });

    // Replace existing snapshot for same year or append (capped at 40)
    const nextHistory = game.atlasHistory.filter((s) => s && Number(s.year) !== year);
    nextHistory.push(snapshot);
    game.atlasHistory = nextHistory.slice(-MAX_ATLAS_CYCLES);

    return game;
  }

  /* ========================================================================
     PROPOSAL #10: HALL OF FAME & CHAIR LEGACY SCORE (0-1000 + EPITHET)
     ======================================================================== */
  function computeChairLegacy(game, targetPartyId = null) {
    if (!game) {
      return {
        score: 0,
        epithet: 'Caretaker',
        breakdown: { trifectas: 0, tierAscent: 0, coalitionRetention: 0, longevity: 0, electoralStrength: 0 },
        highlights: {},
      };
    }
    normalizeAtlasAndMultiplayer(game);
    const pId = targetPartyId || getActivePartyId(game);
    const history = Array.isArray(game.atlasHistory) ? game.atlasHistory : [];
    const cycles = history.length;

    let federalTrifectas = 0;
    let biggestEvLandslide = null;
    let narrowestUpset = null;
    const erasSet = new Set();
    let totalVoteShare = 0;

    // Faction loyalty & turbulence tracking across snapshots
    const factionSwitches = {};
    const factionCyclesWithPlayer = {};
    const factionNames = new Map((game.factions || []).map((f) => [f.id, f.name || f.id]));

    history.forEach((snap, idx) => {
      if (snap.eraId) erasSet.add(snap.eraId);
      totalVoteShare += Number(snap.playerVoteShare || 0);

      const hSeats = Number(snap.houseSeatsByParty?.[pId] || 0);
      const sSeats = Number(snap.senateSeatsByParty?.[pId] || 0);
      const hasPres = snap.presWinner === pId;
      if (hasPres && hSeats >= 218 && sSeats >= 50) {
        federalTrifectas += 1;
      }

      // Biggest EV landslide (any presidential cycle)
      const evEntries = Object.entries(snap.evByParty || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
      if (evEntries.length > 0 && Number(snap.year) % 4 === 0) {
        const [winP, winEv] = evEntries[0];
        const runnerEv = evEntries.length > 1 ? Number(evEntries[1][1]) : 0;
        const margin = Number(winEv) - runnerEv;
        if (!biggestEvLandslide || Number(winEv) > biggestEvLandslide.ev) {
          biggestEvLandslide = { year: snap.year, winner: winP, ev: Number(winEv), margin };
        }
      }

      // Narrowest upset
      if (snap.biggestUpset && Number.isFinite(Number(snap.biggestUpset.margin))) {
        if (!narrowestUpset || Number(snap.biggestUpset.margin) < Number(narrowestUpset.margin)) {
          narrowestUpset = { year: snap.year, ...snap.biggestUpset };
        }
      }

      // Faction ownership tracking
      const ownMap = snap.factionOwnershipMap || {};
      const prevOwn = idx > 0 ? (history[idx - 1].factionOwnershipMap || {}) : null;
      Object.entries(ownMap).forEach(([fId, owner]) => {
        if (owner === pId) {
          factionCyclesWithPlayer[fId] = (factionCyclesWithPlayer[fId] || 0) + 1;
        }
        if (prevOwn && prevOwn[fId] && prevOwn[fId] !== owner) {
          factionSwitches[fId] = (factionSwitches[fId] || 0) + 1;
        }
      });
    });

    if (erasSet.size === 0) {
      erasSet.add(String(game.partySystems?.currentEraId || 'era_contemporary'));
    }

    // Most loyal vs most turbulent faction
    let mostLoyalFaction = null;
    Object.entries(factionCyclesWithPlayer).forEach(([fId, count]) => {
      const switches = factionSwitches[fId] || 0;
      const loyaltyScore = count * 10 - switches * 15;
      if (!mostLoyalFaction || loyaltyScore > mostLoyalFaction._score) {
        mostLoyalFaction = {
          factionId: fId,
          name: factionNames.get(fId) || fId,
          cyclesLoyal: count,
          switches,
          _score: loyaltyScore,
        };
      }
    });
    if (mostLoyalFaction) delete mostLoyalFaction._score;

    let mostTurbulentFaction = null;
    Object.entries(factionSwitches).forEach(([fId, switches]) => {
      if (!mostTurbulentFaction || switches > mostTurbulentFaction.switches) {
        mostTurbulentFaction = {
          factionId: fId,
          name: factionNames.get(fId) || fId,
          switches,
        };
      }
    });
    if (!mostTurbulentFaction) {
      // Fallback to lowest happiness faction currently in party
      const partyFacs = (game.factions || []).filter((f) => f && f.partyId === pId);
      if (partyFacs.length > 0) {
        const sorted = partyFacs.slice().sort((a, b) => Number(a.happiness ?? 60) - Number(b.happiness ?? 60));
        mostTurbulentFaction = { factionId: sorted[0].id, name: sorted[0].name || sorted[0].id, switches: 0 };
        if (!mostLoyalFaction) {
          const top = sorted[sorted.length - 1];
          mostLoyalFaction = { factionId: top.id, name: top.name || top.id, cyclesLoyal: Math.max(1, cycles), switches: 0 };
        }
      }
    }

    // Longest-serving official fallback from live sittingMembers
    let longestOfficial = game.legacyMeta?.longestServingOfficial || null;
    if (!longestOfficial) {
      const curYear = Number(game.year || 2028);
      const members = (game.sittingMembers || []).filter((m) => m && (m.party === pId || m.caucus === pId));
      if (members.length > 0) {
        const bestM = members.slice().sort((a, b) => Number(b.terms || b.age || 0) - Number(a.terms || a.age || 0))[0];
        longestOfficial = {
          name: bestM.name || 'Party Veteran',
          office: bestM.office || 'representative',
          state: bestM.state || bestM.stateId || 'US',
          party: pId,
          yearsServed: Math.max(2, Number(bestM.terms || 1) * 2),
          startYear: curYear - Math.max(2, Number(bestM.terms || 1) * 2),
        };
      }
    }

    // Tier ascent math
    const startingTier = clamp(Number(game.legacyMeta?.startingTier ?? (['people', 'heritage'].includes(pId) ? 5 : 1)), 0, 5);
    const curTier = clamp(Number(game.partyTiers?.[pId]?.tier ?? game.partyTiers?.[pId] ?? game.parties?.[pId]?.tier ?? startingTier), 0, 5);
    const peakTier = Math.max(startingTier, curTier, Number(game.legacyMeta?.peakTier || 0));
    const tierGain = Math.max(0, peakTier - startingTier);

    // Weighted Score Components (Total 0 - 1000)
    // 1. Federal Trifectas: up to 300 pts (60 pts per trifecta, max 5)
    const trifectaScore = Math.min(300, federalTrifectas * 60);

    // 2. Tier 0/1 -> Tier 5 Ascent & Institutional Stature: up to 220 pts
    const tierAscentScore = Math.min(220, Math.round(tierGain * 45 + peakTier * 14));

    // 3. Coalition Retention: up to 200 pts
    const activePartyFactions = (game.factions || []).filter((f) => f && f.partyId === pId);
    const totalBolts = Object.values(factionSwitches).reduce((s, v) => s + v, 0);
    const retentionRatio = activePartyFactions.length > 0
      ? clamp(1 - (totalBolts / Math.max(4, activePartyFactions.length * Math.max(1, cycles * 0.5))), 0, 1)
      : 0;
    const avgHappiness = activePartyFactions.length > 0
      ? activePartyFactions.reduce((s, f) => s + Number(f.happiness ?? 60), 0) / activePartyFactions.length
      : 0;
    const coalitionRetentionScore = game.gameOver && game.gameOverReason === 'party_collapse'
      ? 0
      : Math.min(200, Math.round(retentionRatio * 130 + (clamp(avgHappiness, 0, 100) / 100) * 70));

    // 4. Longevity & Eras Survived: up to 180 pts
    const longevityScore = Math.min(180, Math.round(Math.min(20, cycles) * 6 + Math.min(4, erasSet.size) * 15));

    // 5. Electoral Strength: up to 100 pts
    const avgVoteShare = cycles > 0 ? totalVoteShare / cycles : computePlayerVoteShare(game, pId);
    const electoralStrengthScore = Math.min(100, Math.round(clamp(avgVoteShare, 0, 60) * (100 / 60)));

    let totalScore = clamp(
      trifectaScore + tierAscentScore + coalitionRetentionScore + longevityScore + electoralStrengthScore,
      0,
      1000
    );
    if (game.gameOver && game.gameOverReason === 'party_collapse') {
      totalScore = Math.min(totalScore, 145);
    }

    // Epithet assignment
    let epithet = 'Caretaker';
    if (game.gameOver && game.gameOverReason === 'party_collapse') {
      epithet = 'Party Gravedigger';
    } else if (totalScore >= 820 || (tierGain >= 3 && peakTier >= 4) || (federalTrifectas >= 3 && erasSet.size >= 2)) {
      epithet = 'Architect of Realignment';
    } else if (totalScore >= 650 && federalTrifectas >= 2) {
      epithet = 'Master of the Machine';
    } else if ((!['people', 'heritage'].includes(pId) && (tierGain >= 2 || avgVoteShare >= 15)) || (totalScore >= 520 && federalTrifectas === 0)) {
      epithet = 'Kingmaker';
    } else if (totalScore >= 420) {
      epithet = 'Coalition Builder';
    } else if (totalScore >= 240) {
      epithet = 'Caretaker';
    } else {
      epithet = 'Party Gravedigger';
    }

    return {
      score: Math.round(totalScore),
      epithet,
      breakdown: {
        trifectas: trifectaScore,
        tierAscent: tierAscentScore,
        coalitionRetention: coalitionRetentionScore,
        longevity: longevityScore,
        electoralStrength: electoralStrengthScore,
      },
      highlights: {
        longestServingOfficial: longestOfficial,
        biggestEvLandslide,
        narrowestUpset,
        mostLoyalFaction,
        mostTurbulentFaction,
        erasSurvived: Array.from(erasSet),
        federalTrifectas,
        cyclesCompleted: cycles,
        startingTier,
        peakTier,
        avgVoteShare: round1(avgVoteShare),
      },
    };
  }

  /* ========================================================================
     PROPOSAL #12: MULTIPLAYER / HOTSEAT "DUELING CHAIRS" MODE
     ======================================================================== */
  function snapshotPartyProfile(game, partyId) {
    if (partyId === 'player' && game?.player?.custom) {
      return {
        id: 'player',
        baseTemplateId: game.player.baseTemplateId || 'player',
        name: game.player.name || 'Custom Party',
        color: game.player.color || '#8b5cf6',
        code: game.player.code || 'CST',
        emblem: game.player.emblem || null,
        customMotto: game.player.customMotto || '',
        custom: true,
        isMajor: false,
      };
    }
    const meta = getPartyMeta(game, partyId);
    return {
      id: partyId,
      baseTemplateId: partyId,
      name: meta.name,
      color: meta.color,
      short: meta.short,
      custom: false,
      isMajor: Boolean(meta.isMajor),
    };
  }

  function initHotseatMultiplayer(game, party1Id, party2Id, options = {}) {
    if (!game) return game;
    normalizeAtlasAndMultiplayer(game);
    const engine = options.engine || global.PartyChairEngine;
    if (engine && typeof engine.ensurePartyStates === 'function') {
      game = engine.ensurePartyStates(game);
    }
    const p1 = party1Id || getActivePartyId(game);
    const p2 = (party2Id && party2Id !== p1) ? party2Id : (p1 === 'heritage' ? 'people' : 'heritage');

    const profiles = {
      ...(game.multiplayer.partyProfiles || {}),
      [p1]: snapshotPartyProfile(game, p1),
      [p2]: snapshotPartyProfile(game, p2),
    };

    game.multiplayer = {
      ...defaultMultiplayerState(),
      enabled: true,
      mode: options.mode === 'async_file' ? 'async_file' : 'hotseat',
      humanPartyIds: [p1, p2],
      activeHumanIndex: 0,
      privacyCurtainActive: false,
      pendingMonthlyOrders: {},
      turnOrderOffset: 0,
      lockedPartyIdsThisRound: [],
      privateNotesByParty: { [p1]: '', [p2]: '' },
      privateOppoByParty: { [p1]: [], [p2]: [] },
      partyProfiles: profiles,
      roundNumber: 1,
    };

    // Ensure both human parties exist in game.parties
    if (game.parties && engine && typeof engine.buildInitialPartyState === 'function') {
      [p1, p2].forEach((pid) => {
        if (!game.parties[pid]) {
          game.parties[pid] = engine.buildInitialPartyState(game, pid);
        }
      });
    }
    if (engine && typeof engine.syncPartyStateWithLegacy === 'function') {
      game = engine.syncPartyStateWithLegacy(game, { fromLegacy: true });
    }
    return game;
  }

  function isMultiplayerEnabled(game) {
    return Boolean(game?.multiplayer?.enabled && Array.isArray(game.multiplayer.humanPartyIds) && game.multiplayer.humanPartyIds.length >= 2);
  }

  function getActiveHumanPartyId(game) {
    if (!isMultiplayerEnabled(game)) return getActivePartyId(game);
    const ids = game.multiplayer.humanPartyIds;
    const idx = clamp(Number(game.multiplayer.activeHumanIndex || 0), 0, ids.length - 1);
    return ids[idx];
  }

  function isHumanParty(game, partyId) {
    if (!isMultiplayerEnabled(game)) return partyId === getActivePartyId(game);
    return game.multiplayer.humanPartyIds.includes(partyId);
  }

  function rebindActiveHumanParty(game, targetPartyId, options = {}) {
    if (!game || !targetPartyId) return game;
    normalizeAtlasAndMultiplayer(game);
    const engine = options.engine || global.PartyChairEngine;
    if (engine && typeof engine.ensurePartyStates === 'function') {
      game = engine.ensurePartyStates(game);
    }

    const outgoingPartyId = getActivePartyId(game);
    const mp = game.multiplayer;

    // 1. Flush outgoing player's legacy fields into game.parties[outgoingPartyId]
    // (Skip re-flushing scrubbed top-level secrets if already isolated by endHotseatTurn behind Privacy Curtain)
    if (outgoingPartyId && game.parties?.[outgoingPartyId] && !mp.privacyCurtainActive) {
      if (engine && typeof engine.syncPartyStateWithLegacy === 'function') {
        game = engine.syncPartyStateWithLegacy(game, { fromLegacy: true });
      }
      // Isolate outgoing player's private oppo dossiers & notes
      if (game.campaign && Array.isArray(game.campaign.oppoDossiers)) {
        mp.privateOppoByParty[outgoingPartyId] = JSON.parse(JSON.stringify(game.campaign.oppoDossiers));
      }
      if (typeof game.chairPrivateNotes === 'string') {
        mp.privateNotesByParty[outgoingPartyId] = game.chairPrivateNotes;
      }
      mp.partyProfiles[outgoingPartyId] = snapshotPartyProfile(game, outgoingPartyId);
    }

    // 2. Clear sensitive top-level fields so zero leakage occurs
    if (game.campaign) {
      game.campaign.oppoDossiers = [];
    }
    game.chairPrivateNotes = '';

    // 3. Rebind game.player identity to targetPartyId
    const targetProfile = mp.partyProfiles[targetPartyId] || snapshotPartyProfile(game, targetPartyId);
    mp.partyProfiles[targetPartyId] = targetProfile;
    game.player = {
      ...(game.player || {}),
      id: targetProfile.id,
      baseTemplateId: targetProfile.baseTemplateId,
      name: targetProfile.name,
      color: targetProfile.color,
      custom: Boolean(targetProfile.custom),
      code: targetProfile.code || targetProfile.short,
      emblem: targetProfile.emblem || null,
      customMotto: targetProfile.customMotto || '',
    };

    // 4. Reset sync watermarks & load targetPartyId from game.parties[targetPartyId]
    delete game.__lastSyncedTopTreasury;
    delete game.__lastSyncedPartyTreasury;
    delete game.__lastSyncedTopActions;
    delete game.__lastSyncedPartyActions;

    if (engine && typeof engine.syncPartyStateWithLegacy === 'function') {
      game = engine.syncPartyStateWithLegacy(game, { fromParty: true });
    }

    // 5. Restore incoming player's own private oppo dossiers & notes
    if (game.campaign) {
      const ownOppo = mp.privateOppoByParty[targetPartyId];
      game.campaign.oppoDossiers = Array.isArray(ownOppo) ? JSON.parse(JSON.stringify(ownOppo)) : [];
    }
    game.chairPrivateNotes = typeof mp.privateNotesByParty[targetPartyId] === 'string'
      ? mp.privateNotesByParty[targetPartyId]
      : '';

    return game;
  }

  function queueHotseatMonthlyOrder(game, partyId, order) {
    if (!game || !partyId || !order) return game;
    normalizeAtlasAndMultiplayer(game);
    const mp = game.multiplayer;
    if (!mp.pendingMonthlyOrders[partyId]) {
      mp.pendingMonthlyOrders[partyId] = {
        airwavesSpendByState: {},
        fieldOfficesByState: {},
        monthlyTheme: null,
        surrogates: [],
        queuedActions: [],
      };
    }
    const bucket = mp.pendingMonthlyOrders[partyId];
    if (order.type === 'airwaves' && order.stateId) {
      bucket.airwavesSpendByState[order.stateId] = round1((bucket.airwavesSpendByState[order.stateId] || 0) + Number(order.spendMillions || 1));
    } else if (order.type === 'field_office' && order.stateId) {
      bucket.fieldOfficesByState[order.stateId] = (bucket.fieldOfficesByState[order.stateId] || 0) + Number(order.count || 1);
    } else if (order.type === 'theme' && order.issueId) {
      bucket.monthlyTheme = order.issueId;
    } else if (order.type === 'surrogate' && order.politicianId && order.stateId) {
      bucket.surrogates.push({ politicianId: order.politicianId, stateId: order.stateId });
    }
    bucket.queuedActions.push({ ...order, queuedAtMonth: Number(game.campaign?.month || game.campaign?.week || 1) });
    return game;
  }

  function resolveSimultaneousCampaignMonth(game, options = {}) {
    if (!game || !isMultiplayerEnabled(game)) return game;
    const engine = options.engine || global.PartyChairEngine;
    const co = options.campaignOverhaul || global.CampaignOverhaul;
    const mp = game.multiplayer;
    const month = clamp(Number(game.campaign?.month || game.campaign?.week || 1), 1, 5);

    if (!game.campaign) game.campaign = { active: true, month, week: month, maxWeeks: 5 };
    if (!game.campaign.airwavesSpendByState) game.campaign.airwavesSpendByState = {};
    if (!game.campaign.fieldOfficesByState) game.campaign.fieldOfficesByState = {};
    if (!game.campaign.stateSaturation) game.campaign.stateSaturation = {};

    // Apply ALL human players' pending orders simultaneously (no last-mover advantage)
    mp.humanPartyIds.forEach((pid) => {
      const orders = mp.pendingMonthlyOrders[pid];
      if (!orders) return;

      Object.entries(orders.airwavesSpendByState || {}).forEach(([stId, spend]) => {
        const amt = Number(spend || 0);
        if (amt <= 0) return;
        if (!game.campaign.airwavesSpendByState[stId]) game.campaign.airwavesSpendByState[stId] = {};
        game.campaign.airwavesSpendByState[stId][pid] = round1((game.campaign.airwavesSpendByState[stId][pid] || 0) + amt);
        if (game.parties?.[pid]) {
          game.parties[pid].treasury = round1(Math.max(0, Number(game.parties[pid].treasury || 0) - amt));
          if (!game.parties[pid].campaign) game.parties[pid].campaign = {};
          if (!game.parties[pid].campaign.airwavesSpendByState) game.parties[pid].campaign.airwavesSpendByState = {};
          game.parties[pid].campaign.airwavesSpendByState[stId] = round1((game.parties[pid].campaign.airwavesSpendByState[stId] || 0) + amt);
        }
        if (co && typeof co.addStateSaturation === 'function') {
          co.addStateSaturation(game.campaign.stateSaturation, stId, amt);
        }
      });

      Object.entries(orders.fieldOfficesByState || {}).forEach(([stId, cnt]) => {
        const n = Number(cnt || 0);
        if (n <= 0) return;
        if (!game.campaign.fieldOfficesByState[stId]) game.campaign.fieldOfficesByState[stId] = {};
        game.campaign.fieldOfficesByState[stId][pid] = (game.campaign.fieldOfficesByState[stId][pid] || 0) + n;
        if (game.parties?.[pid]) {
          const cost = n * 1.5;
          game.parties[pid].treasury = round1(Math.max(0, Number(game.parties[pid].treasury || 0) - cost));
        }
      });

      if (orders.monthlyTheme && game.parties?.[pid]?.campaign) {
        game.parties[pid].campaign.monthlyTheme = orders.monthlyTheme;
      }
    });

    // Clear pending orders after simultaneous resolution
    mp.pendingMonthlyOrders = {};
    mp.lockedPartyIdsThisRound = [];

    // Run remaining AI parties for this campaign month
    if (engine && typeof engine.simulateOpponentPhase === 'function') {
      game = engine.simulateOpponentPhase(game, 'campaign', { month });
    }

    // Advance the campaign month (or trigger Election Night if Month 5 finished)
    if (engine && typeof engine.advanceCampaignWeek === 'function' && game.campaign?.active) {
      game = engine.advanceCampaignWeek(game);
    }

    // Reset active human to cycle's starting chair (with Privacy Curtain if still in campaign)
    if (game.campaign?.active && game.phase !== 'election-night' && game.phase !== 'complete') {
      const startIdx = game.multiplayer.turnOrderOffset % game.multiplayer.humanPartyIds.length;
      game.multiplayer.activeHumanIndex = startIdx;
      game.multiplayer.privacyCurtainActive = true;
    } else {
      // Shared Election Night: no privacy curtain!
      game.multiplayer.privacyCurtainActive = false;
    }

    return game;
  }

  function endHotseatTurn(game, options = {}) {
    if (!game || !isMultiplayerEnabled(game)) return game;
    const engine = options.engine || global.PartyChairEngine;
    const mp = game.multiplayer;
    const currentPartyId = getActiveHumanPartyId(game);

    // Flush current player's state and isolate private intel before handoff
    if (engine && typeof engine.syncPartyStateWithLegacy === 'function') {
      game = engine.syncPartyStateWithLegacy(game, { fromLegacy: true });
    }
    if (game.campaign && Array.isArray(game.campaign.oppoDossiers)) {
      mp.privateOppoByParty[currentPartyId] = JSON.parse(JSON.stringify(game.campaign.oppoDossiers));
      game.campaign.oppoDossiers = [];
    }
    if (typeof game.chairPrivateNotes === 'string') {
      mp.privateNotesByParty[currentPartyId] = game.chairPrivateNotes;
      game.chairPrivateNotes = '';
    }

    if (!mp.lockedPartyIdsThisRound.includes(currentPartyId)) {
      mp.lockedPartyIdsThisRound.push(currentPartyId);
    }

    const allHumansLocked = mp.humanPartyIds.every((pid) => mp.lockedPartyIdsThisRound.includes(pid));

    if (!allHumansLocked) {
      // Pass chair to next human player behind Privacy Curtain
      mp.activeHumanIndex = (mp.activeHumanIndex + 1) % mp.humanPartyIds.length;
      mp.privacyCurtainActive = true;
      return game;
    }

    // All human players have locked their turn for this round!
    mp.lockedPartyIdsThisRound = [];
    mp.roundNumber = Number(mp.roundNumber || 1) + 1;

    if (game.campaign?.active || game.phase === 'campaign' || game.phase === 'general-campaign') {
      game = resolveSimultaneousCampaignMonth(game, options);
      return game;
    }

    // Organizing Phase: run remaining AI parties via simulateOpponentPhase (protecting all human treasuries/actions)
    if (engine && typeof engine.simulateOpponentPhase === 'function') {
      const savedHuman = {};
      game.multiplayer.humanPartyIds.forEach((pid) => {
        if (game.parties?.[pid]) {
          savedHuman[pid] = {
            treasury: game.parties[pid].treasury,
            organizingActionsRemaining: game.parties[pid].organizingActionsRemaining,
          };
        }
      });
      game = engine.simulateOpponentPhase(game, 'organizing');
      Object.entries(savedHuman).forEach(([pid, vals]) => {
        if (game.parties?.[pid]) {
          game.parties[pid].treasury = vals.treasury;
          game.parties[pid].organizingActionsRemaining = vals.organizingActionsRemaining;
        }
      });
      const curPid = getActivePartyId(game);
      if (savedHuman[curPid]) {
        game.treasury = savedHuman[curPid].treasury;
        game.organizingActionsRemaining = savedHuman[curPid].organizingActionsRemaining;
        game.__lastSyncedTopTreasury = game.treasury;
        game.__lastSyncedPartyTreasury = game.treasury;
      }
    }

    // Rotate back to first human player of this cycle behind Privacy Curtain
    game.multiplayer.activeHumanIndex = game.multiplayer.turnOrderOffset % game.multiplayer.humanPartyIds.length;
    game.multiplayer.privacyCurtainActive = true;
    return game;
  }

  function revealHotseatTurn(game, options = {}) {
    if (!game || !isMultiplayerEnabled(game)) return game;
    const nextPartyId = getActiveHumanPartyId(game);
    game = rebindActiveHumanParty(game, nextPartyId, options);
    game.multiplayer.privacyCurtainActive = false;
    return game;
  }

  function onNextCycleMultiplayer(game, options = {}) {
    if (!game || !isMultiplayerEnabled(game)) return game;
    const mp = game.multiplayer;
    mp.turnOrderOffset = Number(mp.turnOrderOffset || 0) + 1;
    mp.activeHumanIndex = mp.turnOrderOffset % mp.humanPartyIds.length;
    mp.lockedPartyIdsThisRound = [];
    mp.pendingMonthlyOrders = {};
    mp.privacyCurtainActive = true;
    const firstParty = mp.humanPartyIds[mp.activeHumanIndex];
    return rebindActiveHumanParty(game, firstParty, options);
  }

  /* ========================================================================
     PROPOSAL #12: ASYNC TURN-FILE EXPORT / IMPORT (.cbturn.json)
     ======================================================================== */
  function exportTurnFile(game, options = {}) {
    if (!game) throw new Error('Cannot export turn file without a game state.');
    normalizeAtlasAndMultiplayer(game);
    const engine = options.engine || global.PartyChairEngine;
    const compacted = (engine && typeof engine.compactGameForSave === 'function')
      ? engine.compactGameForSave(game)
      : JSON.parse(JSON.stringify(game));

    // Ensure privacy curtain is active for recipient and top-level private intel is scrubbed
    if (compacted.multiplayer?.enabled) {
      compacted.multiplayer.privacyCurtainActive = true;
    }
    if (compacted.campaign) {
      compacted.campaign.oppoDossiers = [];
    }
    compacted.chairPrivateNotes = '';

    const payload = {
      format: TURN_FILE_FORMAT,
      version: '0.18.4',
      year: Number(compacted.year || 2028),
      phase: compacted.phase || 'organizing',
      roundNumber: Number(compacted.multiplayer?.roundNumber || 1),
      nextPartyId: getActiveHumanPartyId(compacted),
      humanPartyIds: compacted.multiplayer?.humanPartyIds || [getActivePartyId(compacted)],
      game: compacted,
    };
    const serializedGame = JSON.stringify(payload.game);
    payload.checksum = fnv1aHash(`${TURN_FILE_FORMAT}:${payload.year}:${payload.nextPartyId}:${serializedGame}`);
    return JSON.stringify(payload, null, 2);
  }

  function importTurnFile(jsonText, options = {}) {
    try {
      const parsed = typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText;
      if (!parsed || parsed.format !== TURN_FILE_FORMAT || !parsed.game || typeof parsed.game !== 'object') {
        return { ok: false, error: 'Invalid turn file format (expected cbturn-v1).' };
      }
      const serializedGame = JSON.stringify(parsed.game);
      const expectedChecksum = fnv1aHash(`${TURN_FILE_FORMAT}:${parsed.year}:${parsed.nextPartyId}:${serializedGame}`);
      if (parsed.checksum && parsed.checksum !== expectedChecksum) {
        return { ok: false, error: 'Turn file checksum mismatch — file may be corrupted or modified.' };
      }
      const engine = options.engine || global.PartyChairEngine;
      let restored = (engine && typeof engine.normalizeGame === 'function')
        ? engine.normalizeGame(parsed.game)
        : parsed.game;
      if (!restored) {
        return { ok: false, error: 'Could not normalize game state from turn file.' };
      }
      restored = normalizeAtlasAndMultiplayer(restored);
      if (restored.multiplayer?.enabled) {
        restored.multiplayer.privacyCurtainActive = true;
      }
      return {
        ok: true,
        game: restored,
        meta: {
          year: parsed.year,
          phase: parsed.phase,
          nextPartyId: parsed.nextPartyId,
          roundNumber: parsed.roundNumber,
          checksum: expectedChecksum,
        },
      };
    } catch (err) {
      return { ok: false, error: `Failed to parse turn file: ${err.message}` };
    }
  }

  /* ========================================================================
     UI STATE & HTML MARKUP RENDERERS (Atlas Modal, Retirement, Hotseat)
     ======================================================================== */
  const uiState = {
    atlasOpen: false,
    atlasTab: 'timelapse', // 'timelapse' | 'coalition' | 'legacy'
    atlasYearIndex: 0,
    atlasPlaying: false,
    atlasPlayTimer: null,
    retirementView: false,
    hotseatEnabledSetup: false,
    hotseatParty2Setup: 'heritage',
    importError: '',
  };

  function openAtlasModal(game, tab = 'timelapse', isRetirement = false) {
    uiState.atlasOpen = true;
    uiState.atlasTab = tab;
    uiState.retirementView = Boolean(isRetirement);
    const len = Array.isArray(game?.atlasHistory) ? game.atlasHistory.length : 0;
    uiState.atlasYearIndex = Math.max(0, len - 1);
    stopAtlasTimelapse();
  }

  function closeAtlasModal() {
    uiState.atlasOpen = false;
    uiState.retirementView = false;
    stopAtlasTimelapse();
  }

  function stopAtlasTimelapse() {
    uiState.atlasPlaying = false;
    if (uiState.atlasPlayTimer) {
      clearInterval(uiState.atlasPlayTimer);
      uiState.atlasPlayTimer = null;
    }
  }

  function renderHotseatSetupToggle(selectedParty1Id) {
    const p1 = selectedParty1Id || 'people';
    if (uiState.hotseatParty2Setup === p1) {
      uiState.hotseatParty2Setup = p1 === 'heritage' ? 'people' : 'heritage';
    }
    const candidates = ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist', 'justice']
      .filter((pid) => pid !== p1);
    return `
      <div class="panel" id="hotseat-setup-box" style="margin:14px 0;padding:14px 16px;border:1px solid rgba(226,189,112,0.35);background:rgba(15,23,42,0.55);border-radius:10px">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:700;font-size:14px;color:#f8fafc">
          <input type="checkbox" id="toggle-hotseat-mode" ${uiState.hotseatEnabledSetup ? 'checked' : ''} style="width:18px;height:18px;accent-color:#e2bd70">
          <span>2-Player Dueling Chairs (Hotseat &amp; Async Turn File)</span>
        </label>
        <p style="margin:6px 0 0;font-size:12.5px;color:#94a3b8;line-height:1.45">
          Pass the chair between two human players with fullscreen Privacy Curtains, simultaneous Campaign War Room resolution, and <code>.cbturn.json</code> export/import.
        </p>
        ${uiState.hotseatEnabledSetup ? `
          <div style="margin-top:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <label style="font-size:12.5px;color:#cbd5e1;font-weight:600" for="hotseat-party2-select">Player 2 Party:</label>
            <select id="hotseat-party2-select" style="background:#0f172a;color:#f8fafc;border:1px solid #475569;border-radius:6px;padding:6px 10px;font-size:13px">
              ${candidates.map((pid) => `<option value="${pid}" ${uiState.hotseatParty2Setup === pid ? 'selected' : ''}>${safeHtml(PARTY_META[pid]?.name || pid)}</option>`).join('')}
            </select>
          </div>
        ` : ''}
      </div>
    `;
  }

  function applyHotseatSetupToGame(game) {
    if (!game || !uiState.hotseatEnabledSetup) return game;
    const p1 = getActivePartyId(game);
    const p2 = uiState.hotseatParty2Setup === p1 ? (p1 === 'heritage' ? 'people' : 'heritage') : uiState.hotseatParty2Setup;
    return initHotseatMultiplayer(game, p1, p2);
  }

  function renderHeaderControls(game) {
    if (!game) return '';
    const mpBadge = isMultiplayerEnabled(game)
      ? `<span style="background:rgba(226,189,112,0.18);border:1px solid rgba(226,189,112,0.55);color:#f3d285;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700">DUELING CHAIRS · P${(game.multiplayer.activeHumanIndex || 0) + 1}</span>`
      : '';
    return `
      ${mpBadge}
      <button type="button" class="text-button" id="btn-open-political-atlas" data-action="open-political-atlas">Political Atlas</button>
      <button type="button" class="text-button" id="btn-retire-chair" data-action="retire-from-chair">Retire from Chair</button>
    `;
  }

  function renderHotseatTurnButton(game) {
    if (!isMultiplayerEnabled(game) || game.phase === 'election-night' || game.phase === 'complete') return '';
    const mp = game.multiplayer;
    const curPid = getActiveHumanPartyId(game);
    const curMeta = getPartyMeta(game, curPid);
    const isLastHuman = mp.lockedPartyIdsThisRound.length >= mp.humanPartyIds.length - 1;
    const isCampaign = Boolean(game.campaign?.active || game.phase === 'campaign' || game.phase === 'general-campaign');
    const label = isLastHuman
      ? (isCampaign ? `Lock ${curMeta.short} Orders & Resolve Month →` : `Lock ${curMeta.short} Turn & Run AI Opponents →`)
      : `Lock Turn & Pass Chair →`;
    return `
      <button type="button" class="button button-gold" id="btn-hotseat-end-turn" data-action="hotseat-end-turn" style="margin-left:8px">
        ${safeHtml(label)}
      </button>
    `;
  }

  function renderTimelapseSvg(game, snap, MAPS) {
    const mapData = MAPS || global.PartyChairData?.VERSION_03_MAPS;
    if (!mapData || !Array.isArray(mapData.states)) {
      return '<div style="padding:32px;text-align:center;color:#94a3b8">Map geometry loading…</div>';
    }
    const winners = snap?.statePresWinners || {};
    const stateRows = mapData.states.filter((s) => s.id !== 'DC');
    const paths = stateRows.map((st) => {
      const winner = winners[st.id] || (HARRIS_2024_STATES.has(st.id) ? 'people' : 'heritage');
      const fill = getPartyColor(game, winner);
      const wName = getPartyMeta(game, winner).name;
      const d = st.q ? st.q.split('!').map(decodeSvgPath).join('') : '';
      return `<path d="${d}" style="fill:${fill};stroke:#0f172a;stroke-width:0.85;transition:fill 0.25s ease" data-atlas-state="${st.id}"><title>${safeHtml(st.name || st.id)} (${st.id}): ${safeHtml(wName)}</title></path>`;
    }).join('');
    const dcGeo = mapData.states.find((s) => s.id === 'DC');
    let dcDot = '';
    if (dcGeo) {
      const dcW = winners.DC || 'people';
      dcDot = `<circle cx="${dcGeo.cx}" cy="${dcGeo.cy}" r="5" style="fill:${getPartyColor(game, dcW)};stroke:#fff;stroke-width:1"><title>DC: ${safeHtml(getPartyMeta(game, dcW).name)}</title></circle>`;
    }
    return `<svg viewBox="${mapData.viewBox || '0 0 960 600'}" style="width:100%;max-height:400px;display:block" role="img" aria-label="Political Atlas Electoral Timelapse Map">${paths}${dcDot}</svg>`;
  }

  function renderAtlasModalMarkup(game, MAPS) {
    if (!uiState.atlasOpen || !game) return '';
    normalizeAtlasAndMultiplayer(game);
    const history = game.atlasHistory || [];
    const legacy = computeChairLegacy(game);
    const activeTab = uiState.atlasTab;

    // Fallback baseline snapshot if no general election completed yet
    const displayHistory = history.length > 0 ? history : [{
      year: Number(game.year || 2028),
      eraId: String(game.partySystems?.currentEraId || 'era_contemporary'),
      presWinner: game.governingParty || 'heritage',
      evByParty: { heritage: 312, people: 226 },
      houseSeatsByParty: tallySeatsByParty(game, 'house'),
      senateSeatsByParty: tallySeatsByParty(game, 'senate'),
      playerVoteShare: computePlayerVoteShare(game, getActivePartyId(game)),
      playerTier: clamp(Number(game.partyTiers?.[getActivePartyId(game)]?.tier ?? 1), 0, 5),
      factionOwnershipMap: extractFactionOwnershipMap(game),
      statePresWinners: Object.fromEntries((global.PartyChairData?.STATES || []).map((s) => [s.id, HARRIS_2024_STATES.has(s.id) ? 'people' : 'heritage'])),
      biggestUpset: null,
      _isBaseline: true,
    }];
    const safeIdx = clamp(uiState.atlasYearIndex, 0, displayHistory.length - 1);
    const snap = displayHistory[safeIdx];

    let tabBody = '';
    if (activeTab === 'timelapse') {
      const evSorted = Object.entries(snap.evByParty || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
      const totalEv = Math.max(1, evSorted.reduce((s, [, v]) => s + Number(v || 0), 0));
      const houseStr = Object.entries(snap.houseSeatsByParty || {})
        .sort((a, b) => b[1] - a[1]).slice(0, 4)
        .map(([p, c]) => `<span style="color:${getPartyColor(game, p)};font-weight:700">${safeHtml(getPartyMeta(game, p).short)} ${c}</span>`).join(' · ') || '—';
      const senateStr = Object.entries(snap.senateSeatsByParty || {})
        .sort((a, b) => b[1] - a[1]).slice(0, 4)
        .map(([p, c]) => `<span style="color:${getPartyColor(game, p)};font-weight:700">${safeHtml(getPartyMeta(game, p).short)} ${c}</span>`).join(' · ') || '—';
      tabBody = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <button type="button" class="button button-small button-gold" id="atlas-timelapse-play" data-action="atlas-toggle-play">${uiState.atlasPlaying ? '❚❚ Pause' : '▶ Play Timelapse'}</button>
            <strong style="font-size:18px;color:#f8fafc">${snap.year}${snap._isBaseline ? ' (Pre-Election Baseline)' : ''}</strong>
            <span style="font-size:12px;color:#94a3b8;background:#1e293b;padding:3px 8px;border-radius:6px">Era: ${safeHtml(snap.eraId)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:220px;max-width:420px">
            <span style="font-size:12px;color:#94a3b8">${displayHistory[0].year}</span>
            <input type="range" id="atlas-year-slider" min="0" max="${Math.max(0, displayHistory.length - 1)}" value="${safeIdx}" style="flex:1;accent-color:#e2bd70">
            <span style="font-size:12px;color:#94a3b8">${displayHistory[displayHistory.length - 1].year}</span>
          </div>
        </div>
        <div style="display:flex;height:14px;border-radius:999px;overflow:hidden;background:#1e293b;margin-bottom:10px">
          ${evSorted.map(([p, ev]) => `<div style="width:${(Number(ev) / totalEv) * 100}%;background:${getPartyColor(game, p)}" title="${safeHtml(getPartyMeta(game, p).name)}: ${ev} EV"></div>`).join('')}
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:#cbd5e1;margin-bottom:12px">
          <span><b>EV:</b> ${evSorted.map(([p, ev]) => `<span style="color:${getPartyColor(game, p)};font-weight:700">${safeHtml(getPartyMeta(game, p).short)} ${ev}</span>`).join(' / ')}</span>
          <span><b>House:</b> ${houseStr}</span>
          <span><b>Senate:</b> ${senateStr}</span>
          <span><b>Your Share:</b> ${Number(snap.playerVoteShare || 0).toFixed(1)}% (Tier ${snap.playerTier})</span>
        </div>
        <div style="background:#0b1220;border:1px solid #1e293b;border-radius:10px;padding:12px">
          ${renderTimelapseSvg(game, snap, MAPS)}
        </div>
        ${snap.biggestUpset ? `
          <div style="margin-top:10px;padding:8px 12px;background:rgba(226,189,112,0.12);border:1px solid rgba(226,189,112,0.35);border-radius:8px;font-size:12.5px;color:#f3d285">
            <strong>Biggest Upset (${snap.year}):</strong> ${safeHtml(snap.biggestUpset.stateId)} (${safeHtml(snap.biggestUpset.raceType)}) won by ${safeHtml(getPartyMeta(game, snap.biggestUpset.winner).name)} by ${Number(snap.biggestUpset.margin || 0).toFixed(1)}%
          </div>
        ` : ''}
      `;
    } else if (activeTab === 'coalition') {
      const factionIds = Object.keys(displayHistory[displayHistory.length - 1]?.factionOwnershipMap || {});
      const nameMap = new Map((game.factions || []).map((f) => [f.id, f.name || f.id]));
      const events = game.legacyMeta?.coalitionEvents || [];
      const eventLookup = new Map();
      events.forEach((ev) => {
        eventLookup.set(`${ev.year}:${ev.factionId}`, ev);
      });
      tabBody = `
        <p style="margin:0 0 10px;font-size:13px;color:#94a3b8">Faction coalition ownership across recorded cycles. Cells marked <b>⚡</b> indicate a faction bolt/realignment; <b>★</b> marks a coalition summit.</p>
        <div style="overflow:auto;max-height:430px;border:1px solid #1e293b;border-radius:8px">
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="background:#1e293b;color:#e2e8f0;position:sticky;top:0">
                <th style="text-align:left;padding:8px 10px;min-width:170px">Faction</th>
                ${displayHistory.map((s) => `<th style="padding:8px 6px;text-align:center">${s.year}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${factionIds.slice(0, 45).map((fId) => `
                <tr style="border-top:1px solid #1e293b">
                  <td style="padding:6px 10px;color:#e2e8f0;font-weight:600">${safeHtml(nameMap.get(fId) || fId)}</td>
                  ${displayHistory.map((s) => {
                    const owner = s.factionOwnershipMap?.[fId] || 'unaffiliated';
                    const ev = eventLookup.get(`${s.year}:${fId}`);
                    const badge = ev ? (ev.type === 'bolt' ? '⚡' : '★') : '';
                    return `<td style="padding:5px;text-align:center;background:${getPartyColor(game, owner)}33;color:#f8fafc;border-left:1px solid #0f172a" title="${safeHtml(nameMap.get(fId) || fId)} (${s.year}): ${safeHtml(getPartyMeta(game, owner).name)}">
                      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${getPartyColor(game, owner)};margin-right:4px"></span>${safeHtml(getPartyMeta(game, owner).short)}${badge ? ` <b style="color:#fbbf24">${badge}</b>` : ''}
                    </td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      const h = legacy.highlights || {};
      const b = legacy.breakdown || {};
      const officialTxt = h.longestServingOfficial
        ? `${h.longestServingOfficial.name} (${h.longestServingOfficial.office}, ${h.longestServingOfficial.state}) — ${h.longestServingOfficial.yearsServed} yrs`
        : 'No multi-cycle tenure recorded yet';
      const landslideTxt = h.biggestEvLandslide
        ? `${h.biggestEvLandslide.year}: ${getPartyMeta(game, h.biggestEvLandslide.winner).name} (${h.biggestEvLandslide.ev} EV, +${h.biggestEvLandslide.margin})`
        : 'No presidential election recorded yet';
      const upsetTxt = h.narrowestUpset
        ? `${h.narrowestUpset.year} ${h.narrowestUpset.stateId}: ${getPartyMeta(game, h.narrowestUpset.winner).name} (+${Number(h.narrowestUpset.margin || 0).toFixed(1)}%)`
        : 'None recorded yet';
      tabBody = `
        ${uiState.retirementView ? `
          <div style="margin-bottom:14px;padding:12px 16px;background:rgba(226,189,112,0.14);border:1px solid rgba(226,189,112,0.5);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <div><strong style="color:#f3d285;font-size:15px">Chair Retirement Summary</strong><div style="font-size:12.5px;color:#cbd5e1">Review your final legacy record before stepping down, or close this ledger to keep playing.</div></div>
            <button type="button" class="button button-gold" id="btn-confirm-retire-setup" data-action="confirm-retire-to-setup">Step Down &amp; Return to Setup</button>
          </div>
        ` : ''}
        <div style="display:grid;grid-template-columns:minmax(220px,1fr) 2fr;gap:16px;margin-bottom:16px">
          <div style="background:#0b1220;border:1px solid #334155;border-radius:12px;padding:18px;text-align:center">
            <div style="font-size:11.5px;text-transform:uppercase;letter-spacing:0.12em;color:#94a3b8">Chair Legacy Score</div>
            <div id="atlas-legacy-score" style="font-size:48px;font-weight:800;color:#e2bd70;line-height:1.1;margin:8px 0">${legacy.score}<span style="font-size:18px;color:#64748b">/1000</span></div>
            <div id="atlas-legacy-epithet" style="display:inline-block;padding:5px 12px;border-radius:999px;background:rgba(226,189,112,0.18);border:1px solid rgba(226,189,112,0.45);color:#f3d285;font-weight:700;font-size:13px">${safeHtml(legacy.epithet)}</div>
          </div>
          <div style="background:#0b1220;border:1px solid #1e293b;border-radius:12px;padding:16px">
            <div style="font-size:12px;font-weight:700;color:#e2e8f0;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.08em">Score Breakdown</div>
            ${[
              ['Federal Trifectas', b.trifectas || 0, 300],
              ['Institutional Ascent (Tier 0/1 → 5)', b.tierAscent || 0, 220],
              ['Coalition Retention', b.coalitionRetention || 0, 200],
              ['Longevity & Eras Survived', b.longevity || 0, 180],
              ['Electoral Strength', b.electoralStrength || 0, 100],
            ].map(([label, val, max]) => `
              <div style="margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:#cbd5e1;margin-bottom:3px"><span>${label}</span><b>${val} / ${max}</b></div>
                <div style="height:6px;background:#1e293b;border-radius:999px;overflow:hidden"><div style="width:${Math.round((val / max) * 100)}%;height:100%;background:#e2bd70"></div></div>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">
          <div style="background:#0b1220;border:1px solid #1e293b;border-radius:8px;padding:12px"><small style="color:#94a3b8;display:block">Longest-Serving Official</small><b style="color:#f8fafc;font-size:13px">${safeHtml(officialTxt)}</b></div>
          <div style="background:#0b1220;border:1px solid #1e293b;border-radius:8px;padding:12px"><small style="color:#94a3b8;display:block">Biggest EV Landslide</small><b style="color:#f8fafc;font-size:13px">${safeHtml(landslideTxt)}</b></div>
          <div style="background:#0b1220;border:1px solid #1e293b;border-radius:8px;padding:12px"><small style="color:#94a3b8;display:block">Narrowest Upset</small><b style="color:#f8fafc;font-size:13px">${safeHtml(upsetTxt)}</b></div>
          <div style="background:#0b1220;border:1px solid #1e293b;border-radius:8px;padding:12px"><small style="color:#94a3b8;display:block">Most Loyal vs. Most Turbulent</small><b style="color:#f8fafc;font-size:13px">${safeHtml(h.mostLoyalFaction?.name || '—')} / ${safeHtml(h.mostTurbulentFaction?.name || '—')}</b></div>
          <div style="background:#0b1220;border:1px solid #1e293b;border-radius:8px;padding:12px"><small style="color:#94a3b8;display:block">Eras Survived (${(h.erasSurvived || []).length})</small><b style="color:#f8fafc;font-size:13px">${safeHtml((h.erasSurvived || []).join(', ') || 'era_contemporary')}</b></div>
          <div style="background:#0b1220;border:1px solid #1e293b;border-radius:8px;padding:12px"><small style="color:#94a3b8;display:block">Federal Trifectas &amp; Tier Ascent</small><b style="color:#f8fafc;font-size:13px">${h.federalTrifectas || 0} Trifectas · Tier ${h.startingTier ?? 1} → ${h.peakTier ?? 1}</b></div>
        </div>
      `;
    }

    return `
      <div id="political-atlas-modal" style="position:fixed;inset:0;z-index:100020;background:rgba(2,6,23,0.92);display:flex;align-items:center;justify-content:center;padding:20px">
        <div style="width:100%;max-width:1040px;max-height:92vh;overflow:auto;background:#0f172a;border:1.5px solid rgba(226,189,112,0.5);border-radius:14px;padding:22px;color:#f8fafc;box-shadow:0 28px 70px rgba(0,0,0,0.75)">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;border-bottom:1px solid #1e293b;padding-bottom:12px">
            <div>
              <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#e2bd70;font-weight:700">Post-Game &amp; Live Historical Ledger</div>
              <h2 style="margin:2px 0 0;font-size:22px;color:#fff">Political Atlas &amp; Chair Hall of Fame</h2>
            </div>
            <button type="button" class="button button-small" id="btn-close-political-atlas" data-action="close-political-atlas">Close ✕</button>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
            <button type="button" class="button button-small ${activeTab === 'timelapse' ? 'button-gold' : ''}" data-atlas-tab="timelapse">1. Electoral Map Timelapse</button>
            <button type="button" class="button button-small ${activeTab === 'coalition' ? 'button-gold' : ''}" data-atlas-tab="coalition">2. Coalition Timeline</button>
            <button type="button" class="button button-small ${activeTab === 'legacy' ? 'button-gold' : ''}" data-atlas-tab="legacy">3. Hall of Fame &amp; Legacy Scorecard</button>
          </div>
          ${tabBody}
        </div>
      </div>
    `;
  }

  function renderPrivacyCurtainMarkup(game) {
    if (!game || !isMultiplayerEnabled(game) || !game.multiplayer.privacyCurtainActive) return '';
    if (game.phase === 'election-night' || game.phase === 'complete') return '';
    const mp = game.multiplayer;
    const nextPid = getActiveHumanPartyId(game);
    const nextMeta = getPartyMeta(game, nextPid);
    const playerNum = (mp.activeHumanIndex || 0) + 1;
    const phaseLabel = game.campaign?.active
      ? `Campaign War Room · Month ${game.campaign.month || game.campaign.week || 1}/5`
      : `Organizing Phase · ${game.year || 2028}`;

    return `
      <div id="hotseat-privacy-curtain" style="position:fixed;inset:0;z-index:100010;background:linear-gradient(160deg,#020617 0%,#0f172a 60%,#1e1b4b 100%);display:flex;align-items:center;justify-content:center;padding:24px">
        <div style="max-width:560px;width:100%;background:rgba(15,23,42,0.95);border:2px solid ${safeHtml(nextMeta.color)};border-radius:16px;padding:32px;text-align:center;color:#f8fafc;box-shadow:0 30px 80px rgba(0,0,0,0.8)">
          <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#94a3b8;font-weight:700;margin-bottom:8px">Dueling Chairs · Privacy Curtain</div>
          <div style="font-size:13px;color:#cbd5e1;margin-bottom:14px">${safeHtml(phaseLabel)}</div>
          <h2 style="margin:0 0 8px;font-size:26px;color:#fff">Pass to Player ${playerNum}: <span style="color:${safeHtml(nextMeta.color)}">${safeHtml(nextMeta.name)}</span></h2>
          <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.5">
            The previous chair's treasury, private opposition dossiers, and pending campaign orders are hidden. Hand the seat to Player ${playerNum} before revealing.
          </p>
          <button type="button" class="button button-gold" id="btn-hotseat-reveal-turn" data-action="hotseat-reveal-turn" style="width:100%;padding:14px 20px;font-size:15px;font-weight:700;margin-bottom:14px">
            Reveal &amp; Take the Chair →
          </button>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding-top:12px;border-top:1px solid #1e293b">
            <button type="button" class="button button-small" id="btn-hotseat-export-turn" data-action="hotseat-export-turn">Export Turn File (.cbturn.json)</button>
            <label class="button button-small" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px">
              <span>Import Turn File</span>
              <input type="file" id="input-hotseat-import-turn" accept=".json,.cbturn.json" style="display:none">
            </label>
          </div>
          ${uiState.importError ? `<div style="margin-top:10px;color:#f87171;font-size:12.5px">${safeHtml(uiState.importError)}</div>` : ''}
        </div>
      </div>
    `;
  }

  function renderOverlays(game, MAPS) {
    return renderPrivacyCurtainMarkup(game) + renderAtlasModalMarkup(game, MAPS);
  }

  const _liveBridge = { game: null, hooks: {} };

  function ensureDelegatedListeners() {
    if (typeof document === 'undefined' || global.__v0184AtlasHotseatBound) return;
    global.__v0184AtlasHotseatBound = true;

    document.addEventListener('click', (e) => {
      const target = e.target;
      const g = _liveBridge.game;
      const { setGame, render, saveGame, resetToSetup } = _liveBridge.hooks || {};

      const tabBtn = target?.closest?.('[data-atlas-tab]');
      if (tabBtn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        uiState.atlasTab = tabBtn.dataset.atlasTab;
        if (uiState.atlasTab !== 'timelapse') stopAtlasTimelapse();
        if (typeof render === 'function') render();
        return;
      }

      const actBtn = target?.closest?.('[data-action]');
      if (!actBtn) return;
      const act = actBtn.getAttribute('data-action');

      if (act === 'open-political-atlas') {
        e.preventDefault();
        e.stopImmediatePropagation();
        openAtlasModal(g, actBtn.dataset.atlasStartTab || 'timelapse', false);
        if (typeof render === 'function') render();
      } else if (act === 'retire-from-chair') {
        e.preventDefault();
        e.stopImmediatePropagation();
        openAtlasModal(g, 'legacy', true);
        if (typeof render === 'function') render();
      } else if (act === 'confirm-retire-to-setup') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeAtlasModal();
        if (typeof resetToSetup === 'function') resetToSetup();
      } else if (act === 'close-political-atlas') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeAtlasModal();
        if (typeof render === 'function') render();
      } else if (act === 'atlas-toggle-play') {
        e.preventDefault();
        e.stopImmediatePropagation();
        const len = Math.max(1, (g?.atlasHistory || []).length);
        if (uiState.atlasPlaying) {
          stopAtlasTimelapse();
          if (typeof render === 'function') render();
        } else {
          uiState.atlasPlaying = true;
          uiState.atlasPlayTimer = setInterval(() => {
            if (!uiState.atlasOpen || !uiState.atlasPlaying) {
              stopAtlasTimelapse();
              return;
            }
            uiState.atlasYearIndex = (uiState.atlasYearIndex + 1) % len;
            if (typeof _liveBridge.hooks?.render === 'function') _liveBridge.hooks.render();
          }, 1100);
          if (typeof render === 'function') render();
        }
      } else if (act === 'hotseat-end-turn') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!g) return;
        const next = endHotseatTurn(g);
        if (typeof setGame === 'function') setGame(next);
        if (typeof saveGame === 'function') saveGame(next);
        if (typeof render === 'function') render();
      } else if (act === 'hotseat-reveal-turn') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!g) return;
        uiState.importError = '';
        const next = revealHotseatTurn(g);
        if (typeof setGame === 'function') setGame(next);
        if (typeof saveGame === 'function') saveGame(next);
        if (typeof render === 'function') render();
      } else if (act === 'hotseat-export-turn') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!g) return;
        const textOut = exportTurnFile(g);
        const nextPid = getActiveHumanPartyId(g);
        const filename = `coalition-turn-${g.year || 2028}-${nextPid}.cbturn.json`;
        const blob = new Blob([textOut], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, true);
  }

  function bindUI(game, hooks = {}) {
    if (typeof document === 'undefined') return;
    _liveBridge.game = game;
    _liveBridge.hooks = hooks;
    ensureDelegatedListeners();

    const { setGame, render, saveGame } = hooks;

    // Setup Hotseat Toggle
    const hsCheck = document.querySelector('#toggle-hotseat-mode');
    if (hsCheck) {
      hsCheck.addEventListener('change', (e) => {
        uiState.hotseatEnabledSetup = Boolean(e.target.checked);
        if (typeof render === 'function') render();
      });
    }
    const hsP2 = document.querySelector('#hotseat-party2-select');
    if (hsP2) {
      hsP2.addEventListener('change', (e) => {
        uiState.hotseatParty2Setup = e.target.value;
      });
    }

    // Atlas Year Slider
    const slider = document.querySelector('#atlas-year-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        stopAtlasTimelapse();
        uiState.atlasYearIndex = Number(e.target.value) || 0;
        if (typeof render === 'function') render();
      });
    }

    // Hotseat: Import Turn File (.cbturn.json)
    const fileInput = document.querySelector('#input-hotseat-import-turn');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const res = importTurnFile(String(reader.result || ''));
          if (!res.ok) {
            uiState.importError = res.error || 'Import failed.';
            if (typeof render === 'function') render();
            return;
          }
          uiState.importError = '';
          if (typeof setGame === 'function') setGame(res.game);
          if (typeof saveGame === 'function') saveGame(res.game);
          if (typeof render === 'function') render();
        };
        reader.readAsText(file);
      });
    }
  }

  const AtlasMultiplayerSystem = {
    VERSION: '0.18.4',
    MAX_ATLAS_CYCLES,
    TURN_FILE_FORMAT,
    fnv1aHash,
    seededUnit,
    defaultMultiplayerState,
    normalizeAtlasAndMultiplayer,
    compactAtlasForSave,
    recordAtlasSnapshot,
    computeChairLegacy,
    initHotseatMultiplayer,
    isMultiplayerEnabled,
    getActiveHumanPartyId,
    isHumanParty,
    rebindActiveHumanParty,
    queueHotseatMonthlyOrder,
    resolveSimultaneousCampaignMonth,
    endHotseatTurn,
    revealHotseatTurn,
    onNextCycleMultiplayer,
    exportTurnFile,
    importTurnFile,
    openAtlasModal,
    closeAtlasModal,
    renderHotseatSetupToggle,
    applyHotseatSetupToGame,
    renderHeaderControls,
    renderHotseatTurnButton,
    renderAtlasModalMarkup,
    renderPrivacyCurtainMarkup,
    renderOverlays,
    bindUI,
    _uiState: uiState,
  };

  if (typeof document !== 'undefined') {
    ensureDelegatedListeners();
  }
  if (typeof global !== 'undefined') {
    global.AtlasMultiplayerSystem = AtlasMultiplayerSystem;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtlasMultiplayerSystem;
  }
})(typeof window !== 'undefined' ? window : global);
