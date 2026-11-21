// Coalition Builder: Party Chair — MAS-01 Phase 4: Era #18 The Party Coalition Era
// Implements Overnight 2-Faction Party Cap & Rearrangement, Nationwide Mixed-Member Proportional (MMP)
// seat allocation, Post-Election 3-4 Coalition Bargaining Loop, Policy Accords, Stability Meter (0-100),
// and Mid-Cycle Fracture Crises.

(function PartySystemsCoalitionModule() {
  'use strict';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const round = (n, places = 2) => Math.round(n * (10 ** places)) / (10 ** places);

  function fnvHash(text) {
    let h = 2166136261;
    const s = String(text || '');
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }

  function getChairData() {
    if (typeof window !== 'undefined' && window.PartyChairData) return window.PartyChairData;
    return {};
  }

  function getPSE() {
    if (typeof window !== 'undefined' && window.PartySystemsEngine) return window.PartySystemsEngine;
    if (typeof require !== 'undefined') {
      try { return require('./party-systems-engine.js'); } catch {}
    }
    return null;
  }

  // Distinct high-contrast color palette for spawned post-breakup parties
  const SPAWNED_PARTY_COLORS = [
    '#2563EB', // Cobalt Blue
    '#DC2626', // Crimson Red
    '#059669', // Emerald Green
    '#D97706', // Amber Gold
    '#7C3AED', // Royal Violet
    '#0891B2', // Cerulean Teal
    '#DB2777', // Magenta Rose
    '#4F46E5', // Deep Indigo
    '#65A30D', // Olive Lime
    '#EA580C', // Burnt Orange
    '#0D9488', // Sea Teal
    '#9333EA', // Amethyst
    '#B45309', // Copper Ochre
    '#BE123C', // Ruby Red
    '#1D4ED8', // Navy Blue
    '#047857', // Forest Green
  ];

  // Ideological naming matrix for newly paired/solo parties
  function synthesizePartyIdentity(factions, index, usedNames = new Set()) {
    const fList = Array.isArray(factions) ? factions.filter(Boolean) : [];
    const avgEcon = fList.length
      ? fList.reduce((s, f) => s + Number(f.sliders?.economic ?? 5), 0) / fList.length
      : 5;
    const avgSoc = fList.length
      ? fList.reduce((s, f) => s + Number(f.sliders?.social ?? 5), 0) / fList.length
      : 5;

    let baseCandidates;
    if (avgEcon <= 3.5 && avgSoc <= 4.0) {
      baseCandidates = ['Social Democratic Alliance', 'Progressive Labor Front', 'Solidarity Civic Party', 'New Commonwealth Party'];
    } else if (avgEcon <= 4.0 && avgSoc > 4.0) {
      baseCandidates = ['Working Families Party', 'Heartland Labor Coalition', 'Civic Populist Union', 'Main Street Workers Party'];
    } else if (avgEcon >= 6.5 && avgSoc >= 6.5) {
      baseCandidates = ['American Renewal Party', 'Constitutional Renewal Party', 'Traditionalist Alliance', 'Sovereign Republic Party'];
    } else if (avgEcon >= 6.5 && avgSoc < 6.5) {
      baseCandidates = ['Free Enterprise Party', 'Classical Liberal Alliance', 'Liberty & Commerce Party', 'Market Reform Party'];
    } else if (avgSoc <= 4.0) {
      baseCandidates = ['Civic Reform Party', 'Modernist Democratic League', 'Urban Renewal Party', 'Future Republic Party'];
    } else if (avgSoc >= 6.5) {
      baseCandidates = ['Constitutional Covenant Coalition', 'Family & Tradition Alliance', 'Civic Values Party', 'American Covenant Party'];
    } else {
      baseCandidates = ['National Center Party', 'Pragmatic Reform Alliance', 'Civic Consensus Party', 'United Republic Party'];
    }

    let name = baseCandidates.find((c) => !usedNames.has(c));
    if (!name) {
      const leadWord = (fList[0]?.name || 'Civic').replace(/^The\s+/i, '').split(/\s+/).slice(0, 2).join(' ');
      name = `${leadWord} Party`;
      if (usedNames.has(name)) {
        name = `${leadWord} Alliance ${index + 1}`;
      }
    }
    usedNames.add(name);

    const shortName = name.replace(/\s+(Party|Alliance|Coalition|Front|Union|League)$/i, '');
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 24);
    const prefix = fList.length >= 2 ? 'pair' : 'solo';
    const id = `${prefix}_${slug}_${index + 1}`;
    const color = SPAWNED_PARTY_COLORS[index % SPAWNED_PARTY_COLORS.length];

    return { id, name, shortName, color, avgEcon, avgSoc };
  }

  function getFactionStances(faction) {
    const s = faction?.sliders || {};
    const fiscal = Number.isFinite(Number(s.economic))
      ? Number(s.economic)
      : Number.isFinite(Number(faction?.stances?.fiscal))
        ? Number(faction.stances.fiscal)
        : clamp(round(5.5 + Number(faction?.pull?.economic || 0) * 4.5, 2), 1, 10);
    const social = Number.isFinite(Number(s.social))
      ? Number(s.social)
      : Number.isFinite(Number(faction?.stances?.social))
        ? Number(faction.stances.social)
        : clamp(round(5.5 + Number(faction?.pull?.social || 0) * 4.5, 2), 1, 10);
    return { fiscal, social };
  }

  function ideologicalDistance(f1, f2) {
    const s1 = getFactionStances(f1);
    const s2 = getFactionStances(f2);
    return round(Math.abs(s1.fiscal - s2.fiscal) + Math.abs(s1.social - s2.social), 3);
  }

  function computeFactionVoterTotals(game) {
    const totals = {};
    const vm = game?.voterModel;
    if (vm && Array.isArray(vm.states) && vm.states.length > 0) {
      vm.states.forEach((st) => {
        if (st.factions && typeof st.factions === 'object') {
          Object.entries(st.factions).forEach(([fid, cnt]) => {
            totals[fid] = (totals[fid] || 0) + Math.max(0, Number(cnt) || 0);
          });
        }
      });
    }
    if (Object.keys(totals).length === 0 && vm?.factions && typeof vm.factions === 'object') {
      Object.entries(vm.factions).forEach(([fid, cnt]) => {
        totals[fid] = Math.max(0, Number(cnt) || 0);
      });
    }
    (game?.factions || []).forEach((f) => {
      if (!totals[f.id]) {
        totals[f.id] = Math.max(0, Number(f.targetVoters || 0));
      }
    });
    return totals;
  }

  function resolvePartyKey(party) {
    if (!party) return 'people';
    if (party.id === 'player') return party.custom ? 'player' : (party.baseTemplateId || 'people');
    return party.id || party.baseTemplateId || 'people';
  }

  function getAllGameParties(game) {
    const list = [];
    const seen = new Set();
    if (game?.player) {
      const k = resolvePartyKey(game.player);
      seen.add(k);
      list.push({ ...game.player, _partyKey: k, _isPlayer: true });
    }
    (game?.rivals || []).forEach((r) => {
      const k = resolvePartyKey(r);
      if (!seen.has(k)) {
        seen.add(k);
        list.push({ ...r, _partyKey: k, _isPlayer: false });
      }
    });
    return list;
  }

  function buildStancesForSpawnedParty(game, avgEcon, avgSoc) {
    const pse = getPSE();
    const activeIssues = pse ? pse.getActiveIssuesForGame(game) : (getChairData().VERSION_021_ISSUES || []);
    const map = {};
    activeIssues.forEach((iss) => {
      const base = iss.axis === 'social' ? avgSoc : avgEcon;
      map[iss.id] = clamp(Math.round(base), 1, 10);
    });
    return map;
  }

  function transferFactionVotersToParty(game, factionIds, fromPartyId, toPartyId) {
    const vm = game?.voterModel;
    if (!vm || !Array.isArray(vm.states) || !factionIds.length || fromPartyId === toPartyId) return 0;
    let movedVoters = 0;
    vm.states.forEach((st) => {
      if (!st.affiliations) return;
      let factionSumInState = 0;
      if (st.factions && typeof st.factions === 'object') {
        factionIds.forEach((fid) => {
          factionSumInState += Math.max(0, Number(st.factions[fid] || 0));
        });
      }
      if (factionSumInState <= 0) return;
      const _is1to1 = (vm.voterScale === '1:1') || (Number(vm.sampleVoters || 0) >= 10_000_000);
      const sampleToMove = _is1to1 ? Math.round(factionSumInState) : Math.round(factionSumInState / 100);
      if (sampleToMove <= 0) return;

      const sourceKey = (fromPartyId === 'independent' || fromPartyId === 'unaffiliated' || !fromPartyId) ? 'independent' : fromPartyId;
      const availSource = Math.max(0, Number(st.affiliations[sourceKey] || 0));
      let actualMoved = Math.min(availSource, sampleToMove);
      st.affiliations[sourceKey] = availSource - actualMoved;

      // If source party sample pool had rounding slack, pull remaining from independent to preserve exact state total
      if (actualMoved < sampleToMove && sourceKey !== 'independent') {
        const indAvail = Math.max(0, Number(st.affiliations.independent || 0));
        const extra = Math.min(indAvail, sampleToMove - actualMoved);
        st.affiliations.independent = indAvail - extra;
        actualMoved += extra;
      }

      st.affiliations[toPartyId] = (Number(st.affiliations[toPartyId]) || 0) + actualMoved;
      movedVoters += _is1to1 ? actualMoved : actualMoved * 100;
    });
    return movedVoters;
  }

  function spawnReorganizedParty(game, factionsList, spawnIdx, usedNames) {
    const chair = getChairData();
    const regions = chair.REGIONS || ['Northeast', 'Midwest', 'South', 'West'];
    const states = chair.STATES || [];
    const pse = getPSE();

    const ident = synthesizePartyIdentity(factionsList, spawnIdx, usedNames);
    const econAxis = clamp(round((ident.avgEcon - 5.5) / 4.5, 2), -1, 1);
    const socAxis = clamp(round((ident.avgSoc - 5.5) / 4.5, 2), -1, 1);

    const factionIds = factionsList.map((f) => f.id);
    const voterTotalsMap = computeFactionVoterTotals(game);
    const totalVoters = factionIds.reduce((sum, fid) => sum + (voterTotalsMap[fid] || 0), 0);
    const totalElectorate = Number(game?.voterModel?.representedVoters || 155_000_000) || 155_000_000;
    const baseShare = clamp(round((totalVoters / totalElectorate) * 100, 2), 2.5, 32);

    const newPartyObj = {
      id: ident.id,
      baseTemplateId: ident.id,
      name: ident.name,
      shortName: ident.shortName,
      color: ident.color,
      economic: econAxis,
      social: socAxis,
      climate: clamp(round(-econAxis * 0.45, 2), -1, 1),
      local: clamp(round((socAxis - econAxis) * 0.25, 2), -1, 1),
      baseShare,
      isMajor: true,
      isSpawned: true,
      isCoalitionEraParty: true,
      factionIds: [...factionIds],
      trust: { supporters: 78, independents: 56, opponents: 24 },
      issuePositions: buildStancesForSpawnedParty(game, ident.avgEcon, ident.avgSoc),
    };

    // Reassign factions to the newly spawned party and move their voters cleanly
    factionsList.forEach((f) => {
      const oldParty = f.partyId || 'independent';
      transferFactionVotersToParty(game, [f.id], oldParty, ident.id);
      f.previousPartyId = oldParty;
      f.partyId = ident.id;
    });

    // Register in game.rivals, partyTiers, partyNames, ballotAccess, organizations, stateOrganizations
    game.rivals = Array.isArray(game.rivals) ? game.rivals : [];
    if (!game.rivals.some((r) => r.id === ident.id)) {
      game.rivals.push(newPartyObj);
    }
    game.partyTiers = { ...(game.partyTiers || {}), [ident.id]: 4 };
    game.partyNames = { ...(game.partyNames || {}), [ident.id]: ident.name };
    game.partyIssuePositions = { ...(game.partyIssuePositions || {}), [ident.id]: newPartyObj.issuePositions };
    if (pse?.grantFullNationwideBallotAccess) {
      pse.grantFullNationwideBallotAccess(game, ident.id);
    }

    game.organizations = game.organizations || {};
    game.organizations[ident.id] = {
      treasury: Math.max(35, Math.round(baseShare * 3.5)),
      memberships: Math.max(45, Math.round(baseShare * 6.5)),
      chapters: Object.fromEntries(regions.map((r) => [r, Math.max(4, Math.round(baseShare * 0.7))])),
      leaders: [],
      factionStandings: Object.fromEntries(factionIds.map((fid) => [fid, game.factionHappiness?.[fid] ?? 70])),
    };

    game.stateOrganizations = game.stateOrganizations || {};
    states.forEach((st) => {
      game.stateOrganizations[st.id] ||= {};
      game.stateOrganizations[st.id][ident.id] = {
        chapters: Math.max(2, Math.round(baseShare * 0.4)),
        strength: clamp(Math.round(40 + baseShare * 1.6), 35, 85),
      };
    });

    return newPartyObj;
  }

  // ============================================================================
  // 1. OVERNIGHT 2-FACTION PARTY CAP & REARRANGEMENT ALGORITHM (Section 6.1.2)
  // ============================================================================

  function findEligibleNonPartyFaction(game, targetFaction, maxAxisDiff = 1.5, usedNonPartyIds = new Set()) {
    const s1 = getFactionStances(targetFaction);
    const nonPartyFactions = (game.factions || []).filter((f) => (
      f && (f.partyId === 'independent' || f.partyId === 'unaffiliated' || !f.partyId) && !usedNonPartyIds.has(f.id)
    ));
    let best = null;
    let bestDist = Infinity;
    nonPartyFactions.forEach((cand) => {
      const s2 = getFactionStances(cand);
      const fiscalDist = Math.abs(s1.fiscal - s2.fiscal);
      const socialDist = Math.abs(s1.social - s2.social);
      if (fiscalDist <= maxAxisDiff && socialDist <= maxAxisDiff) {
        const d = fiscalDist + socialDist;
        if (d < bestDist) {
          bestDist = d;
          best = cand;
        }
      }
    });
    return best;
  }

  function executeTwoFactionPartyReorganization(game) {
    if (!game) return { newParties: [], survivingParties: [], expelledCount: 0, postBreakupParties: [] };
    const pse = getPSE();
    const factionVoterMap = computeFactionVoterTotals(game);
    const allParties = getAllGameParties(game);
    const usedNames = new Set(allParties.map((p) => p.name));

    const expelledFactions = [];
    const survivingPartyIds = [];

    // Step 1: Enforce strict 2-faction maximum on every existing party
    allParties.forEach((party) => {
      const pid = party._partyKey;
      const partyFactions = (game.factions || []).filter((f) => f.partyId === pid);
      survivingPartyIds.push(pid);

      if (partyFactions.length <= 2) {
        const fIds = partyFactions.map((f) => f.id);
        if (party._isPlayer && game.player) {
          game.player.factionIds = fIds;
        } else {
          const rObj = (game.rivals || []).find((r) => resolvePartyKey(r) === pid);
          if (rObj) rObj.factionIds = fIds;
        }
        return;
      }

      // Sort factions descending by represented voter count
      const sorted = partyFactions.slice().sort((a, b) => (factionVoterMap[b.id] || 0) - (factionVoterMap[a.id] || 0));

      // Retain largest faction
      const primary = sorted[0];

      // Find closest ideologically aligned among the next 3 largest
      const pool = sorted.slice(1, 4);
      pool.sort((a, b) => ideologicalDistance(primary, a) - ideologicalDistance(primary, b));
      const secondary = pool[0];

      const retainedIds = new Set([primary.id, secondary.id]);
      sorted.forEach((f) => {
        if (!retainedIds.has(f.id)) {
          expelledFactions.push(f);
        }
      });

      if (party._isPlayer && game.player) {
        game.player.factionIds = [primary.id, secondary.id];
      } else {
        const rObj = (game.rivals || []).find((r) => resolvePartyKey(r) === pid);
        if (rObj) rObj.factionIds = [primary.id, secondary.id];
      }
    });

    const expelledCount = expelledFactions.length;
    const newParties = [];
    const usedNonPartyIds = new Set();
    let spawnIdx = 0;

    // Step 2: Pair expelled factions within <= 1.5 points on BOTH fiscal and social axes
    while (expelledFactions.length >= 2) {
      const f1 = expelledFactions.shift();
      const s1 = getFactionStances(f1);
      let bestIdx = -1;
      let bestDist = Infinity;

      expelledFactions.forEach((f2, idx) => {
        const s2 = getFactionStances(f2);
        const fiscalDist = Math.abs(s1.fiscal - s2.fiscal);
        const socialDist = Math.abs(s1.social - s2.social);
        if (fiscalDist <= 1.5 && socialDist <= 1.5) {
          const dist = fiscalDist + socialDist;
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
          }
        }
      });

      if (bestIdx !== -1) {
        const f2 = expelledFactions.splice(bestIdx, 1)[0];
        newParties.push(spawnReorganizedParty(game, [f1, f2], spawnIdx++, usedNames));
      } else {
        // Fallback: pair with eligible non-party faction within <= 1.5 bounds
        const nonPartyMatch = findEligibleNonPartyFaction(game, f1, 1.5, usedNonPartyIds);
        if (nonPartyMatch) {
          usedNonPartyIds.add(nonPartyMatch.id);
          newParties.push(spawnReorganizedParty(game, [f1, nonPartyMatch], spawnIdx++, usedNames));
        } else {
          // Solo remainder forms standalone party
          newParties.push(spawnReorganizedParty(game, [f1], spawnIdx++, usedNames));
        }
      }
    }

    // Step 3: Handle single remaining expelled faction
    if (expelledFactions.length === 1) {
      const lastExpelled = expelledFactions.shift();
      const nonPartyMatch = findEligibleNonPartyFaction(game, lastExpelled, 1.5, usedNonPartyIds);
      if (nonPartyMatch) {
        usedNonPartyIds.add(nonPartyMatch.id);
        newParties.push(spawnReorganizedParty(game, [lastExpelled, nonPartyMatch], spawnIdx++, usedNames));
      } else {
        newParties.push(spawnReorganizedParty(game, [lastExpelled], spawnIdx++, usedNames));
      }
    }

    // Reconcile voter model totals cleanly (0 variance on 155M / 310M scale)
    if (game.voterModel && pse?.reconcileVoterModelTotals) {
      pse.reconcileVoterModelTotals(game.voterModel);
    }

    // Reassign sitting officials & politicians whose faction moved into a newly spawned party
    const factionToParty = {};
    (game.factions || []).forEach((f) => {
      if (f.id && f.partyId) factionToParty[f.id] = f.partyId;
    });
    const syncMemberList = (list) => (Array.isArray(list) ? list.map((m) => {
      const mappedParty = m.factionId ? factionToParty[m.factionId] : null;
      if (mappedParty && mappedParty !== 'independent' && mappedParty !== m.party) {
        return {
          ...m,
          previousParty: m.party || m.partyId,
          party: mappedParty,
          partyId: mappedParty,
          caucus: mappedParty,
          hasSwitchedThisCycle: true,
        };
      }
      return m;
    }) : list);
    if (Array.isArray(game.sittingMembers)) game.sittingMembers = syncMemberList(game.sittingMembers);
    if (Array.isArray(game.politicians)) game.politicians = syncMemberList(game.politicians);

    // Recalculate updated party summaries for Informed Player Party Selection Modal
    const refreshedVoterMap = computeFactionVoterTotals(game);
    const totalElectorate = Number(game?.voterModel?.representedVoters || 155_000_000) || 155_000_000;
    const allPostParties = getAllGameParties(game);
    const partisanTotalVoters = allPostParties.reduce((sum, p) => {
      const pid = p._partyKey;
      const pFacs = (game.factions || []).filter((f) => f.partyId === pid);
      const v = pFacs.reduce((acc, f) => acc + (refreshedVoterMap[f.id] || 0), 0);
      return sum + v;
    }, 0) || 1;

    const postBreakupParties = allPostParties.map((p) => {
      const pid = p._partyKey;
      const pFacs = (game.factions || []).filter((f) => f.partyId === pid);
      const exactVoters = pFacs.reduce((acc, f) => acc + (refreshedVoterMap[f.id] || 0), 0);
      const pctOfElectorate = round((exactVoters / totalElectorate) * 100, 2);
      const partisanShare = exactVoters / partisanTotalVoters;
      const projectedHouseSeats = Math.max(0, Math.round(partisanShare * 435));
      const projectedSenateSeats = Math.max(0, Math.round(partisanShare * 100));

      // Update live party baseShare and factionIds
      const liveBaseShare = clamp(round(pctOfElectorate, 2), 1.5, 45);
      if (p._isPlayer && game.player) {
        game.player.baseShare = liveBaseShare;
        game.player.factionIds = pFacs.map((f) => f.id);
      } else {
        const rObj = (game.rivals || []).find((r) => resolvePartyKey(r) === pid);
        if (rObj) {
          rObj.baseShare = liveBaseShare;
          rObj.factionIds = pFacs.map((f) => f.id);
        }
      }

      const avgEcon = pFacs.length
        ? round(pFacs.reduce((s, f) => s + getFactionStances(f).fiscal, 0) / pFacs.length, 1)
        : 5.0;
      const avgSoc = pFacs.length
        ? round(pFacs.reduce((s, f) => s + getFactionStances(f).social, 0) / pFacs.length, 1)
        : 5.0;

      const ideologyLabel = avgEcon <= 3.8 && avgSoc <= 4.2 ? 'Progressive Left'
        : avgEcon <= 4.4 ? 'Center-Left & Labor'
          : avgEcon >= 6.4 && avgSoc >= 6.4 ? 'National Conservative'
            : avgEcon >= 6.2 ? 'Free-Market Right'
              : 'Centrist & Reform';

      return {
        id: pid,
        name: (pse?.getPartyDisplayName ? pse.getPartyDisplayName(game, pid) : p.name) || p.name,
        color: p.color || '#64748b',
        isNew: Boolean(newParties.some((np) => np.id === pid)),
        isCurrentPlayer: Boolean(p._isPlayer),
        factionIds: pFacs.map((f) => f.id),
        factions: pFacs.map((f) => ({
          id: f.id,
          name: f.name,
          voters: refreshedVoterMap[f.id] || 0,
          fiscal: getFactionStances(f).fiscal,
          social: getFactionStances(f).social,
        })),
        exactVoters,
        baseShare: liveBaseShare,
        voterMillions: round(exactVoters / 1_000_000, 2),
        electorateSharePct: pctOfElectorate,
        projectedHouseSeats,
        projectedSenateSeats,
        avgEcon,
        avgSoc,
        ideologyLabel,
      };
    }).sort((a, b) => b.exactVoters - a.exactVoters);

    return {
      newParties,
      survivingPartyIds,
      expelledCount,
      postBreakupParties,
    };
  }

  // ============================================================================
  // 2. NATIONWIDE MIXED-MEMBER PROPORTIONAL (MMP) SEAT ALLOCATION (Section 6.1.4)
  // ============================================================================

  function allocateMMPSeats(voteSharesByParty, constituencySeatsByParty, totalChamberSeats, thresholdPct = 3.0) {
    const partyIds = Object.keys(voteSharesByParty || {}).filter((pid) => Number(voteSharesByParty[pid]) > 0);
    if (!partyIds.length) return { finalSeats: { ...constituencySeatsByParty }, compensatorySeats: {}, qualifiedPartyIds: [] };

    // Parties qualify if national popular vote >= thresholdPct OR won >= 3 constituency seats (classic MMP rule)
    const qualified = partyIds.filter((pid) => (
      Number(voteSharesByParty[pid] || 0) >= thresholdPct
      || Number(constituencySeatsByParty?.[pid] || 0) >= 3
    ));
    const effectivePool = qualified.length ? qualified : partyIds;
    const totalQualVote = effectivePool.reduce((s, pid) => s + Math.max(0, Number(voteSharesByParty[pid] || 0)), 0) || 1;

    // Largest Remainder (Hamilton) proportional target seats
    const rawTargets = {};
    const finalSeats = {};
    const remainders = [];
    let assigned = 0;

    effectivePool.forEach((pid) => {
      const exact = (Math.max(0, Number(voteSharesByParty[pid] || 0)) / totalQualVote) * totalChamberSeats;
      const constituency = Math.max(0, Number(constituencySeatsByParty?.[pid] || 0));
      const base = Math.floor(exact);
      rawTargets[pid] = exact;
      // Preserve constituency seat floor where possible without exceeding total chamber seats
      finalSeats[pid] = base;
      assigned += base;
      remainders.push({ pid, rem: exact - base, constituency, vote: Number(voteSharesByParty[pid] || 0) });
    });

    // Assign remaining compensatory seats to largest remainders
    remainders.sort((a, b) => b.rem - a.rem || b.vote - a.vote);
    let left = totalChamberSeats - assigned;
    for (let i = 0; i < remainders.length && left > 0; i += 1) {
      finalSeats[remainders[i].pid] += 1;
      left -= 1;
    }

    // Ensure non-qualified parties get 0 list seats (keeping any won single-member seat only if under cap)
    partyIds.forEach((pid) => {
      if (finalSeats[pid] === undefined) finalSeats[pid] = 0;
    });

    // Compute compensatory list seats added over direct constituency winners
    const compensatorySeats = {};
    partyIds.forEach((pid) => {
      const direct = Math.max(0, Number(constituencySeatsByParty?.[pid] || 0));
      compensatorySeats[pid] = Math.max(0, (finalSeats[pid] || 0) - direct);
    });

    return { finalSeats, compensatorySeats, qualifiedPartyIds: effectivePool };
  }

  function getMMPThresholdPct(game) {
    // Tuned by Era #18 issue `era18-mmp-threshold` (1 -> 2.0%, 10 -> 5.0%), default 3.0%
    const val = Number(game?.issuePositions?.['era18-mmp-threshold'] ?? 4);
    if (!Number.isFinite(val)) return 3.0;
    return round(clamp(2.0 + ((val - 1) / 9) * 3.0, 2.0, 5.0), 1);
  }

  function resolveNationwideMMP(game, districtElection, senateSeatsByParty = null) {
    if (!game || !districtElection) return null;
    const playerKey = resolvePartyKey(game.player);
    const parties = getAllGameParties(game);
    const thresholdPct = getMMPThresholdPct(game);

    // Aggregate nationwide vote shares from all 435 districts (or nationalVote fallback)
    const rawVotes = {};
    parties.forEach((p) => { rawVotes[p._partyKey] = 0; });
    const districts = Array.isArray(districtElection.districtResults) ? districtElection.districtResults : [];

    if (districts.length > 0) {
      districts.forEach((d) => {
        Object.entries(d.allShares || {}).forEach(([pid, share]) => {
          const normPid = pid === 'player' ? playerKey : pid;
          rawVotes[normPid] = (rawVotes[normPid] || 0) + Math.max(0, Number(share) || 0);
        });
      });
      const sumAll = Object.values(rawVotes).reduce((a, b) => a + b, 0) || 1;
      Object.keys(rawVotes).forEach((pid) => {
        rawVotes[pid] = round((rawVotes[pid] / sumAll) * 100, 2);
      });
    } else if (districtElection.nationalVote) {
      Object.entries(districtElection.nationalVote).forEach(([pid, share]) => {
        if (pid === 'player' && !game.player?.custom) return;
        const normPid = pid === 'player' ? playerKey : pid;
        rawVotes[normPid] = Math.max(0, Number(share) || 0);
      });
    }

    // Constituency House winners before compensatory top-up
    const constituencyHouse = {};
    districts.forEach((d) => {
      const normPid = d.partyId === 'player' ? playerKey : d.partyId;
      constituencyHouse[normPid] = (constituencyHouse[normPid] || 0) + 1;
    });

    const houseMMP = allocateMMPSeats(rawVotes, constituencyHouse, 435, thresholdPct);
    const senateMMP = allocateMMPSeats(rawVotes, senateSeatsByParty || {}, 100, thresholdPct);

    // Rebalance districtResults party assignments so summed representatives match MMP 435 seats exactly
    const targetPool = [];
    Object.entries(houseMMP.finalSeats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([pid, count]) => {
        const enginePid = (pid === playerKey) ? 'player' : pid;
        for (let i = 0; i < count; i += 1) {
          targetPool.push(enginePid);
        }
      });

    // Keep constituency seats for each party first, then fill compensatory seats cleanly
    const remainingQuota = {};
    Object.entries(houseMMP.finalSeats).forEach(([pid, count]) => {
      const enginePid = (pid === playerKey) ? 'player' : pid;
      remainingQuota[enginePid] = count;
    });

    const unassignedIndices = [];
    districts.forEach((d, idx) => {
      const curPid = d.partyId;
      if ((remainingQuota[curPid] || 0) > 0) {
        remainingQuota[curPid] -= 1;
        d.mmpSeatType = 'constituency';
      } else {
        unassignedIndices.push(idx);
      }
    });

    const compensatoryPool = [];
    Object.entries(remainingQuota)
      .sort((a, b) => b[1] - a[1])
      .forEach(([enginePid, cnt]) => {
        for (let i = 0; i < cnt; i += 1) compensatoryPool.push(enginePid);
      });

    unassignedIndices.forEach((dIdx, i) => {
      const assignedPid = compensatoryPool[i];
      if (assignedPid && districts[dIdx]) {
        districts[dIdx].partyId = assignedPid;
        districts[dIdx].mmpSeatType = 'party-list';
        districts[dIdx].electoralSystem = 'mmp';
      }
    });

    // Rebuild seats object keyed by engine party IDs ('player' + rival IDs)
    const nextEngineSeats = {};
    parties.forEach((p) => {
      const engineId = p._isPlayer ? 'player' : p.id;
      nextEngineSeats[engineId] = houseMMP.finalSeats[p._partyKey] || 0;
    });

    return {
      mmpActive: true,
      thresholdPct,
      nationalVoteShares: rawVotes,
      constituencyHouseSeats: constituencyHouse,
      houseSeatsByParty: houseMMP.finalSeats,
      compensatoryHouseSeats: houseMMP.compensatorySeats,
      senateSeatsByParty: senateMMP.finalSeats,
      qualifiedPartyIds: houseMMP.qualifiedPartyIds,
      engineHouseSeats: nextEngineSeats,
    };
  }

  // ============================================================================
  // 3. POST-ELECTION 3–4 COALITION BARGAINING LOOP (Section 6.1.4)
  // ============================================================================

  const COALITION_ARCHETYPES = [
    { id: 'progressive_front', name: 'Progressive-Solidarity Coalition', color: '#2563EB', centerEcon: 2.5, centerSoc: 2.5 },
    { id: 'civic_center_bloc', name: 'National Civic-Center Alliance', color: '#059669', centerEcon: 5.0, centerSoc: 4.5 },
    { id: 'conservative_reform_bloc', name: 'Conservative-Reform Coalition', color: '#DC2626', centerEcon: 7.8, centerSoc: 7.2 },
    { id: 'liberty_frontier_bloc', name: 'Liberty & Frontier Compact', color: '#D97706', centerEcon: 7.4, centerSoc: 3.6 },
  ];

  function getPartyCentroid(game, partyId) {
    const pFacs = (game?.factions || []).filter((f) => f.partyId === partyId);
    if (pFacs.length > 0) {
      const fiscal = pFacs.reduce((s, f) => s + getFactionStances(f).fiscal, 0) / pFacs.length;
      const social = pFacs.reduce((s, f) => s + getFactionStances(f).social, 0) / pFacs.length;
      return { fiscal: round(fiscal, 2), social: round(social, 2) };
    }
    const party = getAllGameParties(game).find((p) => p._partyKey === partyId);
    if (party) {
      return {
        fiscal: clamp(round(5.5 + Number(party.economic || 0) * 4.5, 2), 1, 10),
        social: clamp(round(5.5 + Number(party.social || 0) * 4.5, 2), 1, 10),
      };
    }
    return { fiscal: 5.0, social: 5.0 };
  }

  function partyIdeologicalDistance(game, pidA, pidB) {
    const cA = getPartyCentroid(game, pidA);
    const cB = getPartyCentroid(game, pidB);
    return round(Math.abs(cA.fiscal - cB.fiscal) + Math.abs(cA.social - cB.social), 2);
  }

  function buildCoalitionRedLines(game, partnerIds) {
    const lines = [];
    partnerIds.forEach((pid) => {
      const c = getPartyCentroid(game, pid);
      const pse = getPSE();
      const pName = (pse?.getPartyDisplayName ? pse.getPartyDisplayName(game, pid) : pid) || pid;
      if (c.fiscal <= 3.8) {
        lines.push({ partnerId: pid, partnerName: pName, axis: 'economic', direction: 'max', threshold: 5.5, label: `${pName}: Protect progressive fiscal & social investment planks` });
      } else if (c.fiscal >= 6.5) {
        lines.push({ partnerId: pid, partnerName: pName, axis: 'economic', direction: 'min', threshold: 5.0, label: `${pName}: Uphold tax restraint & pro-enterprise budget limits` });
      }
      if (c.social <= 3.8) {
        lines.push({ partnerId: pid, partnerName: pName, axis: 'social', direction: 'max', threshold: 5.5, label: `${pName}: Safeguard civil rights & pluralist social protections` });
      } else if (c.social >= 6.8) {
        lines.push({ partnerId: pid, partnerName: pName, axis: 'social', direction: 'min', threshold: 5.0, label: `${pName}: Defend traditional community & institutional norms` });
      }
    });
    if (!lines.length && partnerIds.length) {
      const pid = partnerIds[0];
      const pse = getPSE();
      const pName = (pse?.getPartyDisplayName ? pse.getPartyDisplayName(game, pid) : pid) || pid;
      lines.push({ partnerId: pid, partnerName: pName, axis: 'economic', direction: 'band', min: 3.0, max: 7.5, label: `${pName}: Maintain pragmatic center-lane legislative balance` });
    }
    return lines.slice(0, 4);
  }

  function consolidateIntoNationalCoalitions(game, houseSeatsByParty, senateSeatsByParty, playerCoalitionSpec = null) {
    const pse = getPSE();
    const activePartyIds = Object.keys(houseSeatsByParty || {})
      .filter((pid) => (houseSeatsByParty[pid] || 0) > 0 || (senateSeatsByParty?.[pid] || 0) > 0)
      .sort((a, b) => (houseSeatsByParty[b] || 0) - (houseSeatsByParty[a] || 0));

    const coalitions = [];
    const assigned = new Set();

    // 1. Place the player's chosen coalition (if anchoring or joining) first
    if (playerCoalitionSpec && Array.isArray(playerCoalitionSpec.memberPartyIds) && playerCoalitionSpec.memberPartyIds.length > 0) {
      const members = [...new Set(playerCoalitionSpec.memberPartyIds)].filter((pid) => activePartyIds.includes(pid) || pid === resolvePartyKey(game.player));
      members.forEach((m) => assigned.add(m));
      const hSeats = members.reduce((s, pid) => s + (houseSeatsByParty[pid] || 0), 0);
      const sSeats = members.reduce((s, pid) => s + (senateSeatsByParty?.[pid] || 0), 0);
      coalitions.push({
        id: playerCoalitionSpec.id || 'player_coalition',
        name: playerCoalitionSpec.name || 'National Governing Coalition',
        role: playerCoalitionSpec.role || (hSeats >= 218 ? 'governing' : 'opposition'),
        anchorPartyId: playerCoalitionSpec.anchorPartyId || members[0],
        memberPartyIds: members,
        houseSeats: hSeats,
        senateSeats: sSeats,
        isPlayerCoalition: true,
        color: playerCoalitionSpec.color || game?.player?.color || '#3478c8',
        redLines: buildCoalitionRedLines(game, members.filter((id) => id !== resolvePartyKey(game.player))),
      });
    }

    // 2. Cluster remaining parties into 2 to 3 additional nationwide coalitions (so total is strictly 3 to 4 coalitions)
    const remaining = activePartyIds.filter((pid) => !assigned.has(pid));
    const targetOtherCount = coalitions.length > 0 ? 3 : 4;
    const buckets = COALITION_ARCHETYPES.slice(0, targetOtherCount).map((arch) => ({
      ...arch,
      memberPartyIds: [],
    }));

    remaining.forEach((pid) => {
      const c = getPartyCentroid(game, pid);
      let bestBucket = buckets[0];
      let bestD = Infinity;
      buckets.forEach((b) => {
        const d = Math.abs(c.fiscal - b.centerEcon) + Math.abs(c.social - b.centerSoc);
        if (d < bestD) {
          bestD = d;
          bestBucket = b;
        }
      });
      bestBucket.memberPartyIds.push(pid);
    });

    // Keep non-empty buckets; if fewer than 3 total coalitions and a bucket has >= 2 parties, split the largest bucket
    let nonEmpty = buckets.filter((b) => b.memberPartyIds.length > 0);
    while (coalitions.length + nonEmpty.length < 3) {
      const splittable = nonEmpty.slice().sort((a, b) => b.memberPartyIds.length - a.memberPartyIds.length)[0];
      if (!splittable || splittable.memberPartyIds.length < 2) break;
      const splitMember = splittable.memberPartyIds.pop();
      const splitName = (pse?.getPartyDisplayName ? pse.getPartyDisplayName(game, splitMember) : splitMember) || splitMember;
      nonEmpty.push({
        id: `bloc_${splitMember}`,
        name: `${splitName} Opposition Front`,
        color: '#64748b',
        memberPartyIds: [splitMember],
      });
    }
    // Cap total coalitions at 4 by merging smallest extra bucket into nearest neighbor
    while (coalitions.length + nonEmpty.length > 4) {
      nonEmpty.sort((a, b) => a.memberPartyIds.length - b.memberPartyIds.length);
      const tiny = nonEmpty.shift();
      if (nonEmpty.length > 0) {
        nonEmpty[0].memberPartyIds.push(...tiny.memberPartyIds);
      }
    }

    nonEmpty.forEach((b) => {
      const hSeats = b.memberPartyIds.reduce((s, pid) => s + (houseSeatsByParty[pid] || 0), 0);
      const sSeats = b.memberPartyIds.reduce((s, pid) => s + (senateSeatsByParty?.[pid] || 0), 0);
      const anchor = b.memberPartyIds.slice().sort((x, y) => (houseSeatsByParty[y] || 0) - (houseSeatsByParty[x] || 0))[0];
      coalitions.push({
        id: b.id,
        name: b.name,
        role: 'opposition',
        anchorPartyId: anchor,
        memberPartyIds: b.memberPartyIds,
        houseSeats: hSeats,
        senateSeats: sSeats,
        isPlayerCoalition: false,
        color: b.color || '#64748b',
        redLines: [],
      });
    });

    // Designate governing majority coalition (highest House seats >= 218, else largest governing plurality)
    const existingGov = coalitions.find((c) => c.role === 'governing' && c.houseSeats >= 218);
    if (!existingGov) {
      const largest = coalitions.slice().sort((a, b) => b.houseSeats - a.houseSeats)[0];
      coalitions.forEach((c) => {
        c.role = (c === largest) ? 'governing' : 'opposition';
      });
    }

    return coalitions;
  }

  function buildCoalitionBargainingState(game, mmpSummary) {
    const pse = getPSE();
    const playerKey = resolvePartyKey(game.player);
    const houseSeats = mmpSummary?.houseSeatsByParty || {};
    const senateSeats = mmpSummary?.senateSeatsByParty || {};
    const voteShares = mmpSummary?.nationalVoteShares || {};

    const rankedParties = Object.keys(houseSeats)
      .filter((pid) => (houseSeats[pid] || 0) > 0 || pid === playerKey)
      .map((pid) => {
        const pObj = getAllGameParties(game).find((p) => p._partyKey === pid);
        const dist = pid === playerKey ? 0 : partyIdeologicalDistance(game, playerKey, pid);
        return {
          id: pid,
          name: (pse?.getPartyDisplayName ? pse.getPartyDisplayName(game, pid) : pObj?.name) || pid,
          color: pObj?.color || '#64748b',
          houseSeats: houseSeats[pid] || 0,
          senateSeats: senateSeats[pid] || 0,
          voteShare: round(Number(voteShares[pid] || 0), 1),
          distanceFromPlayer: dist,
          isPlayer: pid === playerKey,
          compatibility: dist <= 2.5 ? 'High Alignment' : dist <= 5.0 ? 'Pragmatic Partner' : 'Ideological Stretch',
        };
      })
      .sort((a, b) => b.houseSeats - a.houseSeats);

    const playerRank = rankedParties.findIndex((p) => p.id === playerKey);
    const playerEntry = rankedParties.find((p) => p.id === playerKey) || { houseSeats: 0, senateSeats: 0 };
    const canAnchor = playerRank <= 3 || playerEntry.houseSeats >= 45;

    // Build recommended anchor partner slate that crosses 218 House seats
    const sortedPartners = rankedParties.filter((p) => p.id !== playerKey).sort((a, b) => a.distanceFromPlayer - b.distanceFromPlayer || b.houseSeats - a.houseSeats);
    const suggestedPartnerIds = [];
    let runningHouse = playerEntry.houseSeats;
    for (const cand of sortedPartners) {
      if (runningHouse >= 222) break;
      suggestedPartnerIds.push(cand.id);
      runningHouse += cand.houseSeats;
    }

    // Build up to 2 concrete invitations from larger/aligned parties for the "Join" option
    const invitations = rankedParties
      .filter((p) => p.id !== playerKey && p.houseSeats >= 20)
      .sort((a, b) => a.distanceFromPlayer - b.distanceFromPlayer || b.houseSeats - a.houseSeats)
      .slice(0, 2)
      .map((anchor, idx) => {
        const allies = [anchor.id, playerKey];
        let seatsH = anchor.houseSeats + playerEntry.houseSeats;
        let seatsS = anchor.senateSeats + playerEntry.senateSeats;
        const extras = rankedParties
          .filter((p) => !allies.includes(p.id))
          .sort((a, b) => partyIdeologicalDistance(game, anchor.id, a.id) - partyIdeologicalDistance(game, anchor.id, b.id));
        for (const ex of extras) {
          if (seatsH >= 220) break;
          allies.push(ex.id);
          seatsH += ex.houseSeats;
          seatsS += ex.senateSeats;
        }
        return {
          invitationId: `invite_${anchor.id}_${idx}`,
          anchorPartyId: anchor.id,
          anchorPartyName: anchor.name,
          anchorColor: anchor.color,
          memberPartyIds: allies,
          combinedHouseSeats: seatsH,
          combinedSenateSeats: seatsS,
          portfolioOffer: idx === 0
            ? 'Ways & Means Committee Gavel + Treasury & Labor Cabinet Portfolios'
            : 'Appropriations Vice-Chair + Energy & Commerce Cabinet Portfolios',
          concessionSummary: `Align floor votes with ${anchor.name}'s core fiscal accord in exchange for governing seniority.`,
        };
      });

    return {
      year: game.year || 2040,
      thresholdPct: mmpSummary?.thresholdPct || 3.0,
      playerPartyId: playerKey,
      playerHouseSeats: playerEntry.houseSeats,
      playerSenateSeats: playerEntry.senateSeats,
      canAnchor,
      rankedParties,
      suggestedPartnerIds,
      invitations,
      houseSeatsByParty: houseSeats,
      senateSeatsByParty: senateSeats,
    };
  }

  function resolveCoalitionBargaining(game, payload = {}) {
    if (!game?.partySystems?.coalitionSystem) return game;
    const cs = game.partySystems.coalitionSystem;
    const bargaining = cs.pendingBargaining || game.partySystems.modalPayload || {};
    const mode = payload.mode || payload.choice || 'anchor';
    const playerKey = resolvePartyKey(game.player);
    const pse = getPSE();
    const playerName = (pse?.getPartyDisplayName ? pse.getPartyDisplayName(game, playerKey) : game.player?.name) || 'Your Party';
    const houseSeats = bargaining.houseSeatsByParty || cs.lastMmpSummary?.houseSeatsByParty || {};
    const senateSeats = bargaining.senateSeatsByParty || cs.lastMmpSummary?.senateSeatsByParty || {};

    let playerSpec = null;
    let initialStability = 75;
    let roleSummary = '';
    let accords = [];
    let oppositionTurnoutBonus = 0;

    if (mode === 'anchor') {
      const requestedPartners = Array.isArray(payload.partnerIds) && payload.partnerIds.length
        ? payload.partnerIds
        : (bargaining.suggestedPartnerIds || []);
      const members = [...new Set([playerKey, ...requestedPartners])];
      const partnerIds = members.filter((id) => id !== playerKey);
      const avgDist = partnerIds.length
        ? partnerIds.reduce((s, pid) => s + partyIdeologicalDistance(game, playerKey, pid), 0) / partnerIds.length
        : 0;
      initialStability = clamp(Math.round(86 - avgDist * 4.5), 42, 92);
      const hSum = members.reduce((s, pid) => s + (houseSeats[pid] || 0), 0);
      playerSpec = {
        id: `coalition_anchor_${game.year || 2040}`,
        name: payload.coalitionName || `${playerName.replace(/\s+Party$/i, '')}-Led Governing Coalition`,
        role: hSum >= 218 ? 'governing' : 'minority_governing',
        anchorPartyId: playerKey,
        memberPartyIds: members,
        color: game.player?.color || '#3478c8',
      };
      accords = buildCoalitionRedLines(game, partnerIds);
      roleSummary = `Anchored a ${members.length}-party coalition (${hSum} House seats) with binding policy accords.`;
    } else if (mode === 'join') {
      const invId = payload.invitationId;
      const inv = (bargaining.invitations || []).find((i) => i.invitationId === invId) || (bargaining.invitations || [])[0];
      const members = inv?.memberPartyIds || [playerKey, ...(bargaining.suggestedPartnerIds || []).slice(0, 2)];
      const anchorId = inv?.anchorPartyId || members.find((id) => id !== playerKey) || playerKey;
      const partnerIds = members.filter((id) => id !== playerKey);
      const avgDist = partnerIds.length
        ? partnerIds.reduce((s, pid) => s + partyIdeologicalDistance(game, playerKey, pid), 0) / partnerIds.length
        : 2.0;
      initialStability = clamp(Math.round(80 - avgDist * 4.0), 40, 88);
      const anchorName = (pse?.getPartyDisplayName ? pse.getPartyDisplayName(game, anchorId) : anchorId) || anchorId;
      playerSpec = {
        id: `coalition_join_${anchorId}_${game.year || 2040}`,
        name: `${anchorName.replace(/\s+Party$/i, '')}–${playerName.replace(/\s+Party$/i, '')} Accord`,
        role: 'governing',
        anchorPartyId: anchorId,
        memberPartyIds: members,
        color: inv?.anchorColor || game.player?.color || '#059669',
      };
      accords = buildCoalitionRedLines(game, partnerIds);
      roleSummary = `Joined ${anchorName}'s governing coalition (${inv?.portfolioOffer || 'Senior Committee Portfolios'}).`;
    } else {
      // Sit in Opposition: Preserve platform purity; gain +15% base enthusiast turnout
      initialStability = 100;
      oppositionTurnoutBonus = 15.0;
      playerSpec = {
        id: `coalition_opp_${playerKey}_${game.year || 2040}`,
        name: `${playerName} Official Opposition`,
        role: 'opposition',
        anchorPartyId: playerKey,
        memberPartyIds: [playerKey],
        color: game.player?.color || '#7c3aed',
      };
      accords = [];
      roleSummary = `Declined coalition compromises to lead the Official Opposition (+15% base enthusiast turnout, zero platform dilution).`;
    }

    const nationalCoalitions = consolidateIntoNationalCoalitions(game, houseSeats, senateSeats, playerSpec);
    const activePlayerCoalition = nationalCoalitions.find((c) => c.isPlayerCoalition) || nationalCoalitions[0];

    const updatedCoalitionSystem = {
      ...cs,
      mmpActive: true,
      bargainingResolvedForYear: game.year || 2040,
      pendingBargaining: null,
      playerRole: mode, // 'anchor' | 'join' | 'opposition'
      nationalCoalitions,
      activeCoalitionId: activePlayerCoalition?.id || null,
      activeCoalitionName: activePlayerCoalition?.name || null,
      partnerPartyIds: (activePlayerCoalition?.memberPartyIds || []).filter((id) => id !== playerKey),
      activeAccords: accords,
      stability: initialStability,
      oppositionTurnoutBonus,
      fractureCrisis: null,
      stabilityHistory: [
        ...(cs.stabilityHistory || []),
        { year: game.year || 2040, stability: initialStability, event: roleSummary },
      ].slice(-24),
    };

    const note = `COALITION ACCORD SIGNED: ${roleSummary}`;
    const nextGame = {
      ...game,
      partySystems: {
        ...game.partySystems,
        pendingModal: null,
        modalPayload: null,
        coalitionSystem: updatedCoalitionSystem,
      },
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };

    if (mode === 'join' && game.treasury !== undefined) {
      nextGame.sittingMemberHappiness = clamp(Number(game.sittingMemberHappiness ?? 70) + 4, 0, 100);
    }

    return nextGame;
  }

  // ============================================================================
  // 4. COALITION STABILITY METER (0-100) & MID-CYCLE FRACTURE CRISES
  // ============================================================================

  function evaluateCoalitionStabilityImpact(game, actionContext = {}) {
    const cs = game?.partySystems?.coalitionSystem;
    if (!cs || !cs.mmpActive || cs.playerRole === 'opposition' || !Array.isArray(cs.activeAccords) || !cs.activeAccords.length) {
      return game;
    }

    const axis = actionContext.axis || 'economic';
    const stanceValue = Number.isFinite(Number(actionContext.stanceValue))
      ? Number(actionContext.stanceValue)
      : clamp(round(5.5 + Number(game?.player?.[axis] || 0) * 4.5, 2), 1, 10);

    let violatedAccords = [];
    cs.activeAccords.forEach((acc) => {
      if (acc.axis && acc.axis !== axis) return;
      if (acc.direction === 'max' && stanceValue > acc.threshold) {
        violatedAccords.push(acc);
      } else if (acc.direction === 'min' && stanceValue < acc.threshold) {
        violatedAccords.push(acc);
      } else if (acc.direction === 'band' && (stanceValue < acc.min || stanceValue > acc.max)) {
        violatedAccords.push(acc);
      }
    });

    const isBill = actionContext.kind === 'bill';
    let delta = 0;
    let reason = '';

    if (violatedAccords.length > 0) {
      delta = isBill ? -(16 + violatedAccords.length * 4) : -(10 + violatedAccords.length * 3);
      reason = `Violated coalition red line (${violatedAccords[0].label})`;
    } else if (isBill) {
      delta = 6;
      reason = `Enacted accord-aligned legislation (${actionContext.label || 'policy bill'})`;
    } else {
      return game;
    }

    const prevStab = Number.isFinite(Number(cs.stability)) ? Number(cs.stability) : 70;
    const nextStab = clamp(Math.round(prevStab + delta), 0, 100);

    let fractureCrisis = cs.fractureCrisis || null;
    if (nextStab < 25 && !fractureCrisis) {
      const leadPartner = violatedAccords[0]?.partnerName || cs.partnerPartyIds?.[0] || 'Coalition Partner';
      fractureCrisis = {
        id: `fracture_${game.year || 2040}_${game.chairTurn || 1}`,
        year: game.year || 2040,
        partnerName: leadPartner,
        partnerId: violatedAccords[0]?.partnerId || cs.partnerPartyIds?.[0] || null,
        stabilityAtTrigger: nextStab,
        triggerReason: reason,
        headline: `MID-CYCLE COALITION FRACTURE CRISIS: ${leadPartner} Threatens Cabinet Walkout!`,
        description: `Coalition Stability plunged to ${nextStab}/100 after ${reason}. ${leadPartner} ministers have suspended floor cooperation and threatened a constructive no-confidence vote unless the Chair intervenes immediately.`,
      };
    }

    const nextCS = {
      ...cs,
      stability: nextStab,
      fractureCrisis,
      stabilityHistory: [
        ...(cs.stabilityHistory || []),
        { year: game.year || 2040, stability: nextStab, delta, event: reason },
      ].slice(-24),
    };

    const nextPS = {
      ...game.partySystems,
      coalitionSystem: nextCS,
    };
    if (fractureCrisis && !nextPS.pendingModal) {
      nextPS.pendingModal = 'coalition_fracture';
      nextPS.modalPayload = fractureCrisis;
    }

    return {
      ...game,
      partySystems: nextPS,
      lastNote: fractureCrisis
        ? fractureCrisis.headline
        : `${game.lastNote || ''} (Coalition Stability: ${nextStab}/100)`.trim(),
    };
  }

  function resolveCoalitionFractureCrisis(game, choice = 'concede') {
    const cs = game?.partySystems?.coalitionSystem;
    if (!cs || !cs.fractureCrisis) return game;

    const crisis = cs.fractureCrisis;
    let nextStab = cs.stability;
    let nextRole = cs.playerRole;
    let nextOppositionBonus = cs.oppositionTurnoutBonus || 0;
    let nextPartners = [...(cs.partnerPartyIds || [])];
    let nextTreasury = Number(game.treasury || 0);
    let nextHappiness = Number(game.sittingMemberHappiness ?? 70);
    let note = '';

    if (choice === 'concede') {
      nextStab = 52;
      nextHappiness = clamp(nextHappiness - 6, 0, 100);
      note = `Conceded policy guardrails to ${crisis.partnerName}, restoring Coalition Stability to ${nextStab}/100 and averting a floor collapse.`;
    } else if (choice === 'rebuild') {
      nextTreasury = Math.max(0, round(nextTreasury - 8, 1));
      nextStab = 45;
      note = `Brokered an emergency coalition cabinet reshuffle (-$8M committee diplomacy), stabilizing the governing pact at ${nextStab}/100.`;
    } else {
      // Dissolve coalition & enter Official Opposition
      nextRole = 'opposition';
      nextPartners = [];
      nextStab = 100;
      nextOppositionBonus = 15.0;
      nextHappiness = clamp(nextHappiness - 4, 0, 100);
      note = `Coalition pact dissolved after ${crisis.partnerName} walked out! Your party moves to Official Opposition (+15% base turnout, snap-election pressure rising).`;
    }

    const nextCS = {
      ...cs,
      stability: nextStab,
      playerRole: nextRole,
      partnerPartyIds: nextPartners,
      oppositionTurnoutBonus: nextOppositionBonus,
      fractureCrisis: null,
      fractureCount: Number(cs.fractureCount || 0) + 1,
      stabilityHistory: [
        ...(cs.stabilityHistory || []),
        { year: game.year || 2040, stability: nextStab, event: note },
      ].slice(-24),
    };

    return {
      ...game,
      treasury: nextTreasury,
      sittingMemberHappiness: nextHappiness,
      partySystems: {
        ...game.partySystems,
        pendingModal: game.partySystems.pendingModal === 'coalition_fracture' ? null : game.partySystems.pendingModal,
        modalPayload: game.partySystems.pendingModal === 'coalition_fracture' ? null : game.partySystems.modalPayload,
        coalitionSystem: nextCS,
      },
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };
  }

  function stabilizeCoalitionSummit(game) {
    const cs = game?.partySystems?.coalitionSystem;
    if (!cs || !cs.mmpActive || cs.playerRole === 'opposition') return game;
    if ((game.treasury || 0) < 4) {
      return { ...game, lastNote: 'Coalition Leadership Summit requires $4M in committee funds.' };
    }
    const nextStab = clamp(Math.round(Number(cs.stability ?? 60) + 14), 0, 100);
    const note = `Convened National Coalition Leadership Summit (-$4M): restored partner confidence and raised Coalition Stability to ${nextStab}/100.`;
    return {
      ...game,
      treasury: round(Number(game.treasury || 0) - 4, 1),
      partySystems: {
        ...game.partySystems,
        coalitionSystem: {
          ...cs,
          stability: nextStab,
          stabilityHistory: [
            ...(cs.stabilityHistory || []),
            { year: game.year || 2040, stability: nextStab, delta: 14, event: 'Coalition Leadership Summit' },
          ].slice(-24),
        },
      },
      lastNote: note,
    };
  }

  // ============================================================================
  // 5. ERA #18 PLUGIN BUILDER & NORMALIZATION
  // ============================================================================

  function normalizeCoalitionSystemState(cs) {
    if (!cs || typeof cs !== 'object') return null;
    return {
      mmpActive: Boolean(cs.mmpActive),
      enteredYear: Number(cs.enteredYear || 2040),
      twoFactionCapEnforced: Boolean(cs.twoFactionCapEnforced),
      expelledCount: Number(cs.expelledCount || 0),
      postBreakupParties: Array.isArray(cs.postBreakupParties) ? cs.postBreakupParties : [],
      partySelectionCompleted: Boolean(cs.partySelectionCompleted),
      playerRole: cs.playerRole || null,
      nationalCoalitions: Array.isArray(cs.nationalCoalitions) ? cs.nationalCoalitions : [],
      activeCoalitionId: cs.activeCoalitionId || null,
      activeCoalitionName: cs.activeCoalitionName || null,
      partnerPartyIds: Array.isArray(cs.partnerPartyIds) ? cs.partnerPartyIds : [],
      activeAccords: Array.isArray(cs.activeAccords) ? cs.activeAccords : [],
      stability: Number.isFinite(Number(cs.stability)) ? clamp(Number(cs.stability), 0, 100) : 75,
      oppositionTurnoutBonus: Number(cs.oppositionTurnoutBonus || 0),
      fractureCrisis: cs.fractureCrisis || null,
      fractureCount: Number(cs.fractureCount || 0),
      pendingBargaining: cs.pendingBargaining || null,
      lastMmpSummary: cs.lastMmpSummary || null,
      bargainingResolvedForYear: cs.bargainingResolvedForYear || null,
      stabilityHistory: Array.isArray(cs.stabilityHistory) ? cs.stabilityHistory : [],
    };
  }

  function createEra18Plugin() {
    return {
      id: 'era_18_party_coalition',
      onEraEnter(game) {
        const reorg = executeTwoFactionPartyReorganization(game);
        game.partySystems.coalitionSystem = normalizeCoalitionSystemState({
          mmpActive: true,
          enteredYear: Number(game.year || 2040),
          twoFactionCapEnforced: true,
          expelledCount: reorg.expelledCount,
          postBreakupParties: reorg.postBreakupParties,
          partySelectionCompleted: false,
          playerRole: null,
          nationalCoalitions: [],
          stability: 75,
          oppositionTurnoutBonus: 0,
        });
        game.partySystems.eraState = {
          ...(game.partySystems.eraState || {}),
          mmpActive: true,
          twoFactionCapEnforced: true,
          coalitionMajorityRequired: true,
          spawnedCoalitionParties: reorg.newParties.map((p) => ({ id: p.id, name: p.name, color: p.color })),
        };
      },
      onElectionResolve(game, outcome) {
        const cs = game?.partySystems?.coalitionSystem;
        if (!cs || !cs.mmpActive) return;
        const mmpSummary = outcome?.mmpSummary || cs.lastMmpSummary || null;
        if (!mmpSummary) return;
        const bargaining = buildCoalitionBargainingState(game, mmpSummary);
        cs.lastMmpSummary = mmpSummary;
        cs.pendingBargaining = bargaining;
        game.partySystems.pendingModal = 'coalition';
        game.partySystems.modalPayload = bargaining;
      },
      getTurnoutModifier(game, partyId) {
        const cs = game?.partySystems?.coalitionSystem;
        if (!cs || !cs.mmpActive) return 0;
        const playerKey = resolvePartyKey(game.player);
        const resolved = (!partyId || partyId === 'player') ? playerKey : partyId;
        if (resolved === playerKey && cs.playerRole === 'opposition') {
          return Number(cs.oppositionTurnoutBonus || 15.0);
        }
        return 0;
      },
      getStrategicDefectionModifier() {
        return 0; // Nationwide MMP eliminates two-party wasted-vote defection completely
      },
      getDecisionModal(game) {
        const cs = game?.partySystems?.coalitionSystem;
        const parties = cs?.postBreakupParties || [];
        return {
          type: 'party_select',
          title: 'The Great Party Breakup: Select Your Post-Realignment Party',
          description: 'Under Nationwide Mixed-Member Proportional reform, every sprawling big-tent party has reorganized down to at most two core factions. Inspect each surviving and newly formed party’s constituent factions and exact registered voter base before selecting your command.',
          parties,
          options: parties.map((p) => ({
            id: `switch_party:${p.id}`,
            label: `Chair ${p.name} (${p.voterMillions.toFixed(2)}M voters)`,
            summary: `${p.factions.map((f) => f.name).join(' + ')} · Est. ${p.projectedHouseSeats} House / ${p.projectedSenateSeats} Senate seats`,
          })),
        };
      },
      resolveDecision(game, decisionId) {
        const pse = getPSE();
        let next = game;
        if (String(decisionId).startsWith('switch_party:')) {
          const targetId = String(decisionId).split(':')[1];
          if (pse?.switchPlayerChairParty) {
            next = pse.switchPlayerChairParty(game, targetId);
          }
        }
        if (next.partySystems?.coalitionSystem) {
          next.partySystems = {
            ...next.partySystems,
            coalitionSystem: {
              ...next.partySystems.coalitionSystem,
              partySelectionCompleted: true,
            },
          };
        }
        return next;
      },
    };
  }

  const api = {
    SPAWNED_PARTY_COLORS,
    COALITION_ARCHETYPES,
    getFactionStances,
    ideologicalDistance,
    computeFactionVoterTotals,
    findEligibleNonPartyFaction,
    executeTwoFactionPartyReorganization,
    allocateMMPSeats,
    getMMPThresholdPct,
    resolveNationwideMMP,
    consolidateIntoNationalCoalitions,
    buildCoalitionBargainingState,
    resolveCoalitionBargaining,
    evaluateCoalitionStabilityImpact,
    resolveCoalitionFractureCrisis,
    stabilizeCoalitionSummit,
    normalizeCoalitionSystemState,
    createEra18Plugin,
  };

  if (typeof window !== 'undefined') {
    window.PartySystemsCoalition = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
