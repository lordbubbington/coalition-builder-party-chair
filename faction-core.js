/**
 * Coalition Builder: Party Chair — v0.18.5 Core Module
 * FactionCore: Faction friction, bolting/severance, coalition summits, merger demands,
 * coalition accords, and zero-faction party collapse detection.
 * Zero-behavior-change extraction from engine.js.
 */
(function (root) {
  'use strict';

  const RECOGNIZED_FRICTION_PARTIES = new Set(['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist', 'player']);

  function isUnaffiliatedPartyId(pid) {
    return pid === 'none' || pid === 'independent' || pid === 'unaffiliated' || pid === '' || pid === null || pid === undefined;
  }

  // Bug #7 / #12: Game-Over rule when player loses all factions in their party
  function evaluateZeroFactionCollapse(game) {
    if (!game || !Array.isArray(game.factions) || game.factions.length === 0) return game;
    const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
    const remaining = game.factions.filter((f) => f && f.partyId === pid);
    if (remaining.length === 0 && !game.gameOver) {
      const pName = game.player?.name || 'Your Party';
      const msg = `Every faction in ${pName} has abandoned the coalition. Without a voter base or allied wings, the party has collapsed.`;
      return {
        ...game,
        gameOver: true,
        gameOverReason: 'party_collapse',
        gameOverTitle: 'Party Collapsed — All Factions Lost',
        gameOverMessage: msg,
        lastNote: `GAME OVER: ${msg}`,
      };
    }
    return game;
  }

  // SUM-01 + REC-01 + REC-07: Two-Sided National Faction Friction & Ultimatum Detachment Loop
  function evaluateFactionFriction(game, deps) {
    const { clamp, round, computeFactionKeyIssuesDistance, boltFactionFn } = deps;
    const playerPartyId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
    const factions = game.factions || [];
    let updatedGame = { ...game };

    for (const f of factions) {
      if (!f || !RECOGNIZED_FRICTION_PARTIES.has(f.partyId)) continue;
      const isPlayerFaction = f.partyId === playerPartyId;

      const curH = Number(updatedGame.factionHappiness?.[f.id] ?? updatedGame.factionHappiness?.[f.name] ?? f.happiness ?? 60);
      let frictionDelta = 0;

      // REC-07: Rebalanced low-happiness friction curve (<35: +30, <45: +15)
      if (curH < 35) {
        f.chronicLowTurns = (f.chronicLowTurns || 0) + 1;
        frictionDelta += 30;
      } else if (curH < 45) {
        f.chronicLowTurns = 0;
        frictionDelta += 15;
      } else {
        f.chronicLowTurns = 0;
      }

      // REC-07 + [v0.18.7 QA-FIX] BUG-11: Platform Abandonment threshold 3.2; cool friction -10/turn when dist <= 2.8 and curH >= 52
      const dist = computeFactionKeyIssuesDistance(updatedGame, f, f.partyId);
      if (dist > 3.2) {
        frictionDelta += 15;
      } else if (curH >= 60 && dist <= 2.5) {
        frictionDelta -= 15;
      } else if (curH >= 52 && dist <= 2.8) {
        frictionDelta -= 10;
      }

      const isVanguardFounding = isPlayerFaction
        && updatedGame.identityCrisis?.doctrine === 'vanguard'
        && (updatedGame.identityCrisis?.foundingFactionIds || []).includes(f.id);
      if (isVanguardFounding && frictionDelta > 0) {
        frictionDelta = round(frictionDelta * 0.6, 1);
      }
      // [v0.18.7 QA-FIX] BUG-01: Early-game stability protection for minor parties with <= 2 factions (first 3 cycles)
      const partyFactionCount = factions.filter((x) => x && x.partyId === f.partyId).length;
      const isMinorProtectedWindow = !['people', 'heritage'].includes(f.partyId)
        && partyFactionCount <= 2
        && Number(updatedGame.year || 2028) <= Number(updatedGame.startYear || 2028) + 6;
      const isLeadFoundingWing = f.status === 'leading'
        || f.id === updatedGame.leadingFactionByParty?.[f.partyId]
        || ['soc_socialists', 'con_christian_dominionists', 'grn_eco_socialist_vanguard', 'lib_true_libertarians'].includes(f.id);
      if (isMinorProtectedWindow && frictionDelta > 0) {
        frictionDelta = round(frictionDelta * 0.5, 1);
      }
      f.frictionIndex = clamp((f.frictionIndex || 0) + frictionDelta, 0, 100);
      if (isMinorProtectedWindow && (isLeadFoundingWing || partyFactionCount <= 1) && curH >= 20) {
        f.frictionIndex = Math.min(f.frictionIndex, 55);
        f.ultimatumTurnsRemaining = null;
        continue;
      }

      // 3. Ultimatum handling (REC-07: remediation floor raised to Happiness >= 60; threshold lowered to 75)
      // Bug #24: Post-accord bolt-immunity cooldown prevents immediate boomerang bolts
      if (Number(f.accordCooldownUntilYear || 0) > Number(updatedGame.year || 2028)) {
        f.frictionIndex = Math.min(f.frictionIndex, 35);
        f.ultimatumTurnsRemaining = null;
        continue;
      }

      // Bug #25: Mild ideological equilibrium recovery prevents chronic happiness floor compression
      if (curH < 52 && dist <= 2.8) {
        const recoveredH = clamp(round(curH + 3, 1), 0, 100);
        f.happiness = recoveredH;
        if (updatedGame.factionHappiness) updatedGame.factionHappiness[f.id] = recoveredH;
        if (updatedGame.factionStandings) updatedGame.factionStandings[f.id] = recoveredH;
      }

      if (f.ultimatumTurnsRemaining !== null && f.ultimatumTurnsRemaining !== undefined) {
        if (curH >= 60) {
          f.ultimatumTurnsRemaining = null;
          f.frictionIndex = Math.min(f.frictionIndex, 40);
          if (f.isPuristBoltThreat && updatedGame.identityCrisis) {
            f.isPuristBoltThreat = false;
            updatedGame.identityCrisis = {
              ...updatedGame.identityCrisis,
              puristRevoltPending: false,
              puristRevoltTurnsRemaining: null,
              puristRevoltAppeased: true,
            };
            updatedGame.factionBoltThreats = (updatedGame.factionBoltThreats || []).filter((t) => t.factionId !== f.id);
          }
          const note = `Ultimatum averted with ${f.name}: Happiness restored to ${curH}/100, Friction Index lowered to ${f.frictionIndex}.`;
          updatedGame.yearLog = [...(updatedGame.yearLog || []), { year: updatedGame.year, turn: (updatedGame.chairTurn || 0) + 1, action: note }].slice(-80);
        } else {
          if (!isPlayerFaction && typeof window !== 'undefined' && window.PartySystemsRobots?.evaluateRivalChairUltimatumResponse) {
            const aiResp = window.PartySystemsRobots.evaluateRivalChairUltimatumResponse(updatedGame, f, f.partyId);
            if (aiResp && aiResp.action === 'appease') {
              const note = `Rival Chair appeased ${f.name} (-$${aiResp.cost}M), averting a coalition bolt.`;
              updatedGame.yearLog = [...(updatedGame.yearLog || []), { year: updatedGame.year, turn: (updatedGame.chairTurn || 0) + 1, action: note }].slice(-80);
              continue;
            }
          }
          f.ultimatumTurnsRemaining -= 1;
          if (f.isPuristBoltThreat && updatedGame.identityCrisis) {
            updatedGame.identityCrisis = {
              ...updatedGame.identityCrisis,
              puristRevoltTurnsRemaining: Math.max(0, f.ultimatumTurnsRemaining),
            };
          }
          if (f.ultimatumTurnsRemaining <= 0) {
            updatedGame = boltFactionFn ? boltFactionFn(updatedGame, f.id) : boltFaction(updatedGame, f.id, deps);
          }
        }
      } else if (f.frictionIndex >= 75) {
        f.ultimatumTurnsRemaining = 2;
        const note = isPlayerFaction
          ? `CRISIS: The ${f.name} has issued an official ULTIMATUM! Address core grievances within 2 turns or the faction will formally withdraw from the party.`
          : `NATIONAL CRISIS: The ${f.name} has issued a secession ULTIMATUM to its parent party (${f.partyId})!`;
        updatedGame.yearLog = [...(updatedGame.yearLog || []), { year: updatedGame.year, turn: (updatedGame.chairTurn || 0) + 1, action: note }].slice(-80);
        if (isPlayerFaction) updatedGame.lastNote = note;
      }
    }

    // Bug #25: AI Coalition Re-Admission Loop for bolted Unaffiliated factions
    const curYr = Number(updatedGame.year || 2028);
    const aiCandidates = ['people', 'heritage', 'green', 'liberty', 'constitution', 'socialist']
      .filter((pid) => pid !== playerPartyId && !(updatedGame.dissolvedParties || []).includes(pid));
    for (const bf of (updatedGame.factions || [])) {
      // [QA-BATCH2-FIX] B2-05: Recognize all unaffiliated/independent/none party IDs for AI coalition re-admission
      if (!bf || !isUnaffiliatedPartyId(bf.partyId)) continue;
      if (bf.boltedYear && (curYr - Number(bf.boltedYear)) < 2) continue;
      let bestPid = null;
      let bestDist = 3.25;
      for (const pid of aiCandidates) {
        if (bf.formerPartyId === pid && ((bf.reunificationCooldownYear && curYr < Number(bf.reunificationCooldownYear)) || (bf.boltedYear && (curYr - Number(bf.boltedYear)) < 6))) continue;
        const d = computeFactionKeyIssuesDistance(updatedGame, bf, pid);
        if (d < bestDist) {
          bestDist = d;
          bestPid = pid;
        }
      }
      if (bestPid) {
        bf.partyId = bestPid;
        bf.activelyCourting = false;
        bf.frictionIndex = 0;
        bf.ultimatumTurnsRemaining = null;
        bf.happiness = 65;
        bf.accordCooldownUntilYear = curYr + 6;
        if (updatedGame.factionHappiness) updatedGame.factionHappiness[bf.id] = 65;
        if (updatedGame.factionStandings) updatedGame.factionStandings[bf.id] = 65;
        // Transfer faction voters from independent into adopting AI party
        const vmAi = updatedGame.voterModel;
        if (vmAi && Array.isArray(vmAi.states)) {
          const _aiDiv = (vmAi.voterScale === '1:1' || Number(vmAi.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
          vmAi.states.forEach((st) => {
            const fv = Number(st.factions?.[bf.id] || 0);
            if (fv > 0 && st.affiliations) {
              const sh = Math.round(fv / _aiDiv);
              const ded = Math.min(Number(st.affiliations.independent || 0), sh);
              st.affiliations.independent = Math.max(0, Number(st.affiliations.independent || 0) - ded);
              st.affiliations[bestPid] = Number(st.affiliations[bestPid] || 0) + ded;
            }
          });
        }
        const note = `COALITION REALIGNMENT: Independent faction ${bf.name} joined ${bestPid} after negotiations.`;
        updatedGame.yearLog = [...(updatedGame.yearLog || []), { year: curYr, turn: (updatedGame.chairTurn || 0) + 1, action: note }].slice(-80);
      }
    }

    updatedGame = evaluateZeroFactionCollapse(updatedGame);
    return updatedGame;
  }

  // SUM-01 & REQ-159 & REQ-236: Faction Bolting (Severance Execution & Defection)
  function boltFaction(game, factionId, deps) {
    const {
      getFactionEraStability,
      triggerInternalAnchorCrisis,
      syncLeadershipRolesState,
      evaluateFactionTiers,
      computeGrassrootsMultiplier,
    } = deps;
    // REQ-236 & [v0.18.4 FACTION-ERA-FIXES]: Ironclad Leading-Faction Anchor Lock
    const _fesBolt = getFactionEraStability ? getFactionEraStability() : null;
    if (_fesBolt ? _fesBolt.isEffectiveIroncladAnchor(game, factionId) : (factionId === 'dem_liberal_establishment' || factionId === 'gop_maga')) {
      return triggerInternalAnchorCrisis(game, factionId);
    }
    const playerPartyId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
    const factions = game.factions || [];
    const f = factions.find((x) => x.id === factionId);
    if (!f) return game;
    const sourcePartyId = !isUnaffiliatedPartyId(f.partyId) ? f.partyId : playerPartyId; // [QA-BATCH2-FIX] B2-05

    // 1. Status update: shift to Unaffiliated / Independent (REC-02 + REC-12)
    // v0.18.8 CAUCUS & DYNAMIC FACTION HOOK: Partner Exit Shock (-18 Happiness / +20 Friction on caucus partners)
    const fcsBolt = (typeof window !== 'undefined' && window.FactionCaucusSystem)
      || (typeof global !== 'undefined' && global.FactionCaucusSystem)
      || (typeof globalThis !== 'undefined' && globalThis.FactionCaucusSystem)
      || null;
    if (fcsBolt && typeof fcsBolt.handleCaucusPartnerExit === 'function') {
      fcsBolt.handleCaucusPartnerExit(game, factionId, 'bolt');
    }

    f.formerPartyId = sourcePartyId;
    f.boltedYear = game.year || 2028;
    f.reunificationCooldownYear = Number(game.year || 2028) + 6;
    f.activelyCourting = true;
    f.partyId = 'unaffiliated';
    f.ultimatumTurnsRemaining = null;
    f.frictionIndex = 0;

    // 2. Voter Severance across all states from sourcePartyId into state.affiliations.independent
    const vm = game.voterModel;
    if (vm && Array.isArray(vm.states)) {
      const _bfDiv = (vm.voterScale === '1:1' || Number(vm.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
      vm.states.forEach((state) => {
        const fVoters = state.factions?.[factionId] || 0;
        if (fVoters > 0 && state.affiliations) {
          const shift = Math.round(fVoters / _bfDiv);
          const deduct = Math.min(Number(state.affiliations[sourcePartyId] || 0), shift);
          state.affiliations[sourcePartyId] = Math.max(0, Number(state.affiliations[sourcePartyId] || 0) - deduct);
          state.affiliations.independent = Number(state.affiliations.independent || 0) + deduct;
          if (['green', 'liberty', 'constitution', 'socialist', 'other'].includes(sourcePartyId)) {
            state.affiliations.thirdParty = (state.affiliations.green || 0) + (state.affiliations.liberty || 0) + (state.affiliations.constitution || 0) + (state.affiliations.socialist || 0) + (state.affiliations.other || 0);
          }
        }
      });

      const _bfMult = (vm.voterScale === '1:1' || Number(vm.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
      const stateSourceSum = vm.states.reduce((sum, s) => sum + (s.affiliations?.[sourcePartyId] || 0), 0);
      const stateIndSum = vm.states.reduce((sum, s) => sum + (s.affiliations?.independent || 0), 0);
      if (vm.affiliations?.[sourcePartyId]) {
        vm.affiliations[sourcePartyId].sampleVoters = stateSourceSum;
        vm.affiliations[sourcePartyId].representedVoters = stateSourceSum * _bfMult;
      }
      if (vm.affiliations?.independent) {
        vm.affiliations.independent.sampleVoters = stateIndSum;
        vm.affiliations.independent.representedVoters = stateIndSum * _bfMult;
      }
    }

    // 3. Lawmaker Defection: sitting members and politicians belonging to this faction defect and become Independents (REQ-159)
    const defectingMemberIds = new Set();
    const updatedSittingMembers = (game.sittingMembers || []).map((m) => {
      if (m.factionId === factionId || m.faction === f.name || m.faction === factionId) {
        defectingMemberIds.add(m.id);
        if (m.sittingId) defectingMemberIds.add(m.sittingId);
        return {
          ...m,
          party: 'independent',
          partyId: 'independent',
          rawParty: 'I',
          caucus: 'independent',
        };
      }
      return m;
    });

    const updatedPoliticians = (game.politicians || []).map((m) => {
      if (m.factionId === factionId || m.faction === f.name || m.faction === factionId) {
        defectingMemberIds.add(m.id);
        if (m.sittingId) defectingMemberIds.add(m.sittingId);
        return {
          ...m,
          party: 'independent',
          partyId: 'independent',
          rawParty: 'I',
          caucus: 'independent',
        };
      }
      return m;
    });

    // 4. Vacate leadership roles and cabinet posts held by defectors (REQ-159)
    const currentRoles = { ...(game.leadershipRoles?.player || game.player?.leadershipRoles || {}) };
    Object.keys(currentRoles).forEach((roleId) => {
      if (defectingMemberIds.has(currentRoles[roleId])) {
        delete currentRoles[roleId];
      }
    });
    const syncedRoles = syncLeadershipRolesState(game, currentRoles);

    // 5. Super PAC Loss: revoke allied Super PAC
    const updatedSuperPacs = (game.superPacs || []).map((pac) => {
      if (pac.factionId === factionId || pac.petIssueLabel === f.keyIssues?.[0] || pac.petIssueLabel === f.keyIssues?.[1]) {
        return { ...pac, active: false, revoked: true };
      }
      return pac;
    });

    // 6. Remove any active compacts with this faction
    const updatedPacts = (game.activeCoalitionPacts || []).filter((p) => p.factionId !== factionId);

    // 7. REQ-194: If the bolting faction is the Founding Purist Vanguard, spawn a named Splinter Fourth Party
    const isPuristBolt = Boolean(f.isPuristBoltThreat) || (game.identityCrisis?.puristVanguardFactionId === factionId);
    const nextSplinters = Array.isArray(game.activeSplinters) ? [...game.activeSplinters] : [];
    let nextIdentityCrisis = game.identityCrisis ? { ...game.identityCrisis } : null;
    let note = `SEVERANCE EXECUTED: The ${f.name} has formally bolted the party, shifting all voters and sitting lawmakers to Independent status!`;

    if (isPuristBolt) {
      const foundingMeta = window.PartyChairData?.MINOR_PARTY_FOUNDING_FACTIONS?.[playerPartyId];
      const splinterName = foundingMeta?.splinterName || `${f.name} Vanguard Party`;
      const votersSiphoned = Number(game.voterModel?.factions?.[factionId] ?? f.targetVoters ?? 250000);
      const splinterRecord = {
        id: `splinter-purist-${factionId}-${game.year || 2028}`,
        name: splinterName,
        parentPartyId: playerPartyId,
        factionId,
        factionName: f.name,
        homeRegion: 'National',
        isNationalSplinter: true,
        spoilerShare: 3.5,
        turnoutPenalty: 4.5,
        votersSiphoned,
        yearSpawned: game.year || 2028,
        cyclesRemaining: 2,
      };
      if (!nextSplinters.some((sp) => sp.id === splinterRecord.id)) {
        nextSplinters.push(splinterRecord);
      }
      f.isPuristBoltThreat = false;
      if (nextIdentityCrisis) {
        nextIdentityCrisis.puristRevoltPending = false;
        nextIdentityCrisis.puristRevoltTurnsRemaining = null;
        nextIdentityCrisis.puristSplinterSpawned = true;
        nextIdentityCrisis.splinterPartyName = splinterName;
      }
      note = `PURIST REVOLT: The ${f.name} bolted over Big-Tent moderation and founded the ${splinterName}, siphoning base voters and inflicting national spoiler drag!`;
    }

    // Bug #4: Mirror sitting House defections into game.representatives
    const defectingDistrictIds = new Set(
      updatedSittingMembers
        .filter((m) => m.office === 'house' && (defectingMemberIds.has(m.id) || (m.sittingId && defectingMemberIds.has(m.sittingId))))
        .map((m) => m.districtId || m.district)
        .filter(Boolean)
    );
    const updatedRepresentatives = Array.isArray(game.representatives)
      ? game.representatives.map((r) => (defectingDistrictIds.has(r.districtId || r.id)
        ? { ...r, party: 'independent', partyId: 'independent' }
        : r))
      : game.representatives;

    const nextBoltThreats = (game.factionBoltThreats || []).filter((t) => t.factionId !== factionId);
    // [v0.18.4 COALITION-POLITICS] Vacate patronage slots held by bolting faction
    const cpsBolt = (typeof window !== 'undefined' && window.CoalitionPoliticsSystem) || (typeof globalThis !== 'undefined' && globalThis.CoalitionPoliticsSystem) || null;
    const vacatedPat = cpsBolt?.vacatePatronageForFaction ? cpsBolt.vacatePatronageForFaction(game, factionId) : { patronageAppointments: game.patronageAppointments, vacatedSlots: [] };

    return evaluateZeroFactionCollapse({
      ...game,
      ...syncedRoles,
      politicians: updatedPoliticians,
      sittingMembers: updatedSittingMembers,
      representatives: updatedRepresentatives,
      superPacs: updatedSuperPacs,
      activeCoalitionPacts: updatedPacts,
      patronageAppointments: vacatedPat.patronageAppointments, // [v0.18.4 COALITION-POLITICS]
      activeSplinters: nextSplinters.slice(-10),
      factionBoltThreats: nextBoltThreats,
      identityCrisis: nextIdentityCrisis || game.identityCrisis,
      factionDesignations: evaluateFactionTiers(game),
      grassrootsMultiplier: computeGrassrootsMultiplier(game),
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    });
  }

  // REQ-153: Coalition Summit Eligibility Check
  function checkSummitEligibility(game, factionId, deps) {
    const { computeFactionKeyIssuesDistance, generateMergerCoalitionDemandsFn } = deps;
    const playerPartyId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
    const factions = game.factions || window.PartyChairData?.FACTIONS_CATALOG || [];
    const f = factions.find((x) => x.id === factionId);
    if (!f) return { eligible: false, reason: 'Faction not found.' };
    if (f.partyId === playerPartyId) {
      return { eligible: false, reason: 'The faction is already a member of your party.' };
    }
    // v0.18.8 CAUCUS & DYNAMIC FACTION HOOK: Anti-Poaching Lock
    const fcsPoach = (typeof window !== 'undefined' && window.FactionCaucusSystem)
      || (typeof global !== 'undefined' && global.FactionCaucusSystem)
      || (typeof globalThis !== 'undefined' && globalThis.FactionCaucusSystem)
      || null;
    if (fcsPoach && typeof fcsPoach.isProtectedByAntiPoachingLock === 'function') {
      const lock = fcsPoach.isProtectedByAntiPoachingLock(game, factionId);
      if (lock && lock.locked) {
        return {
          eligible: false,
          canCourt: false,
          reason: `${f.name} is protected by the anti-poaching discipline of ${lock.caucusName || 'its caucus'} (Caucus Strength ${lock.strength} >= 45). Disrupt caucus strength below 45 before courting or summit talks.`,
        };
      }
    }
    // REC-02 & REC-10 & [v0.18.4 FACTION-ERA-FIXES]: Strict Two-Step Secession Gate
    if (!isUnaffiliatedPartyId(f.partyId)) {
      return {
        eligible: false,
        reason: 'Faction must secede from its parent party and become Independent before a Coalition Accord can be signed.',
        canCourt: Number(game.factionHappiness?.[f.id] ?? f.happiness ?? 50) < 50,
      };
    }
    // Bug #24 & Chunk 2.3: 6-year cooldown against immediately re-admitting a faction that just bolted from this same party
    if (f.formerPartyId === playerPartyId && ((f.reunificationCooldownYear && Number(game.year || 2028) < Number(f.reunificationCooldownYear)) || (f.boltedYear && ((Number(game.year || 2028) - Number(f.boltedYear)) < 6)))) {
      return {
        eligible: false,
        reason: `${f.name} recently seceded from your party (${f.boltedYear}) and refuses immediate reunification talks (6-year cooldown active).`,
      };
    }
    const curH = Number(game.factionHappiness?.[f.id] ?? f.happiness ?? 50);
    const courtshipScore = Number(game.factionCourtship?.[f.id]?.[playerPartyId] || 0);
    // [v0.18.8 PLAYTEST-FIX #6] Independent/Unaffiliated factions qualify when Goodwill >= 15 (1 Court action) OR Happiness <= 40
    if (f.partyId !== 'none' && curH > 40 && courtshipScore < 15) {
      return {
        eligible: false,
        needsCourtship: true,
        courtshipScore,
        requiredGoodwill: 15,
        reason: `Build at least 15 Coalition Goodwill (currently ${courtshipScore}/15 — click "Court Independent ($1.5M)" once) or wait for Independent Happiness <= 40 (currently ${Math.round(curH)}) before convening a Coalition Summit.`,
      };
    }
    // Bug #22: Hard ideological-distance guard on Coalition Summits
    const summitDist = computeFactionKeyIssuesDistance(game, f, playerPartyId);
    if (summitDist > 5.5) {
      return {
        eligible: false,
        reason: `Ideological gap with ${f.name} is too wide (distance ${summitDist.toFixed(1)} > 5.5). Shift your platform closer first.`,
      };
    }
    const demands = generateMergerCoalitionDemandsFn
      ? generateMergerCoalitionDemandsFn(game, factionId)
      : generateMergerCoalitionDemands(game, factionId, deps);
    if (demands && demands.blocked) {
      return { eligible: false, reason: demands.blockedReason, demands };
    }
    return { eligible: true, demands };
  }

  // SUM-02 & SUM-03: Tiered Demands Engine & 5M Invariant & REQ-153 Happiness Threshold
  function generateMergerCoalitionDemands(game, factionId, deps) {
    const {
      EXTREMIST_FACTION_IDS,
      getFactionKeyIssueIdeals,
      getPartyKeyIssueStance,
      clamp,
      round,
      getFactionEraStability,
    } = deps;
    const playerPartyId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
    const factions = game.factions || window.PartyChairData?.FACTIONS_CATALOG || [];
    const f = factions.find((x) => x.id === factionId);
    if (!f) return null;

    const natVoters = Number(game.voterModel?.factions?.[f.id] ?? f.targetVoters ?? 1000000);
    let tier = 'minor';
    if (natVoters < 1000000 || f.status === 'fringe') tier = 'fringe';
    else if (natVoters >= 5000000 || f.status === 'major' || f.status === 'leading') tier = 'major';

    // 5.0M-Member Invariant for Extremist Factions
    if (EXTREMIST_FACTION_IDS && EXTREMIST_FACTION_IDS.has(f.id)) {
      const totalPartyVoters = (game.factions || []).filter((x) => x.partyId === playerPartyId).reduce((s, x) => s + Number(game.voterModel?.factions?.[x.id] ?? x.targetVoters ?? 0), 0);
      const otherMembers = totalPartyVoters - natVoters;
      if (otherMembers > 5000000) {
        return {
          factionId: f.id,
          factionName: f.name,
          tier,
          blocked: true,
          blockedReason: `The ${f.name} refuses to negotiate with a party containing over 5 million members of other factions.`,
          sliderShifts: [],
          filteringPact: { targetFiltersPerCycle: 0, cyclesRemaining: 0 },
          cohabitationPreview: [],
        };
      }
    }

    const ideals = getFactionKeyIssueIdeals(f);
    const cur0 = getPartyKeyIssueStance(game, ideals[0].name);
    const cur1 = getPartyKeyIssueStance(game, ideals[1].name);

    const sliderShifts = [];
    let filteringPact = { targetFiltersPerCycle: 0, cyclesRemaining: 0 };

    if (tier === 'fringe') {
      if (cur0 !== ideals[0].ideal) {
        sliderShifts.push({
          issue: ideals[0].name,
          from: cur0,
          to: cur0 + (ideals[0].ideal > cur0 ? 1 : -1),
          target: ideals[0].ideal,
        });
      } else if (cur1 !== ideals[1].ideal) {
        sliderShifts.push({
          issue: ideals[1].name,
          from: cur1,
          to: cur1 + (ideals[1].ideal > cur1 ? 1 : -1),
          target: ideals[1].ideal,
        });
      }
    } else if (tier === 'minor') {
      const delta0 = ideals[0].ideal > cur0 ? 1 : (ideals[0].ideal < cur0 ? -1 : 0);
      const delta1 = ideals[1].ideal > cur1 ? 1 : (ideals[1].ideal < cur1 ? -1 : 0);
      sliderShifts.push({
        issue: ideals[0].name,
        from: cur0,
        to: cur0 + delta0,
        target: ideals[0].ideal,
      });
      sliderShifts.push({
        issue: ideals[1].name,
        from: cur1,
        to: cur1 + delta1,
        target: ideals[1].ideal,
      });
      filteringPact = { targetFiltersPerCycle: 1, cyclesRemaining: 5 };
    } else {
      sliderShifts.push({
        issue: ideals[0].name,
        from: cur0,
        to: ideals[0].ideal,
        target: ideals[0].ideal,
      });
      sliderShifts.push({
        issue: ideals[1].name,
        from: cur1,
        to: ideals[1].ideal,
        target: ideals[1].ideal,
      });
      filteringPact = { targetFiltersPerCycle: 5, cyclesRemaining: 5 };
    }

    // Ideological Cohabitation Preview (SUM-05 & REQ-193: Big-Tent cuts cohabitation drag by 60%)
    const bigTentDragFactor = game.identityCrisis?.doctrine === 'big_tent' ? 0.4 : 1.0;
    const existingMemberFactions = (game.factions || []).filter((x) => x.partyId === playerPartyId && x.id !== f.id);
    const cohabitationPreview = existingMemberFactions.map((ef) => {
      const dist = Math.hypot(
        (f.sliders?.social ?? 5) - (ef.sliders?.social ?? 5),
        (f.sliders?.economic ?? 5) - (ef.sliders?.economic ?? 5),
        (f.sliders?.governance ?? 5) - (ef.sliders?.governance ?? 5)
      );
      let impact = 'compatible';
      let delta = 2;
      if (dist > 4.0) {
        impact = 'hostile';
        delta = -round(clamp(round(12 + (dist - 4.0) * 2), 12, 18) * bigTentDragFactor, 1);
      } else if (dist >= 2.5) {
        impact = 'strain';
        delta = -round(4 * bigTentDragFactor, 1);
      }
      // [v0.18.4 FACTION-ERA-FIXES] Non-leading anchor cohabitation relief & accord cooldown immunity
      const _basePreview = { factionId: ef.id, factionName: ef.name, distance: round(dist, 2), impact, happinessDelta: delta };
      const _fesCohab = getFactionEraStability ? getFactionEraStability() : null;
      return _fesCohab ? _fesCohab.adjustCohabitationPreviewItem(game, playerPartyId, ef, _basePreview) : _basePreview;
    });

    const baseDemands = {
      factionId: f.id,
      factionName: f.name,
      tier,
      blocked: false,
      blockedReason: null,
      sliderShifts,
      filteringPact,
      cohabitationPreview,
    };
    // [v0.18.4 COALITION-POLITICS] Major bolted factions can demand 1 guaranteed Cabinet/Shadow slot
    const cpsDem = (typeof window !== 'undefined' && window.CoalitionPoliticsSystem) || (typeof globalThis !== 'undefined' && globalThis.CoalitionPoliticsSystem) || null;
    return cpsDem?.augmentMergerDemandsWithPatronage ? cpsDem.augmentMergerDemandsWithPatronage(game, factionId, baseDemands) : baseDemands;
  }

  // SUM-02, SUM-03, SUM-05: Coalition Summit Signing & Backlash
  function signCoalitionAccord(game, factionId, demands = null, deps = {}) {
    const {
      clamp,
      round,
      applyFactionHappinessDelta,
      evaluateFactionTiers,
      computeGrassrootsMultiplier,
      checkIdentityCrisisTrigger,
      generateMergerCoalitionDemandsFn,
    } = deps;
    const playerPartyId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
    const factions = game.factions || [];
    const f = factions.find((x) => x.id === factionId);
    if (!f) return game;

    // Chunk 2.3: Cap Coalition Accords at 2 per organizing phase
    const accordsThisCycle = Number(game.accordsThisCycle || 0);
    if (accordsThisCycle >= 2) {
      return {
        ...game,
        lastNote: 'Maximum 2 Coalition Accords per Organizing Phase reached.',
        error: 'Maximum 2 Coalition Accords per Organizing Phase reached.',
      };
    }

    const resolvedDemands = demands || (generateMergerCoalitionDemandsFn
      ? generateMergerCoalitionDemandsFn(game, factionId)
      : generateMergerCoalitionDemands(game, factionId, deps));
    if (!resolvedDemands || resolvedDemands.blocked) {
      return {
        ...game,
        lastNote: resolvedDemands?.blockedReason || 'Coalition summit is blocked.',
        error: resolvedDemands?.blockedReason || 'Coalition summit is blocked.',
      };
    }

    // Spend 1 organizing action
    if (game.organizingActionsRemaining !== undefined && game.organizingActionsRemaining < 1) return game;
    const nextActions = game.organizingActionsRemaining !== undefined ? Math.max(0, game.organizingActionsRemaining - 1) : (game.actionsLeft ? game.actionsLeft - 1 : 0);

    // 1. Apply slider shifts
    const nextIssuePositions = { ...(game.issuePositions || {}) };
    (resolvedDemands.sliderShifts || []).forEach((shift) => {
      nextIssuePositions[shift.issue] = shift.to;
    });

    // 2. Register multi-cycle filtering pact if applicable (SUM-04)
    const nextActivePacts = [...(game.activeCoalitionPacts || [])];
    if (resolvedDemands.filteringPact && resolvedDemands.filteringPact.targetFiltersPerCycle > 0) {
      nextActivePacts.push({
        factionId: f.id,
        factionName: f.name,
        targetFiltersPerCycle: resolvedDemands.filteringPact.targetFiltersPerCycle,
        cyclesRemaining: resolvedDemands.filteringPact.cyclesRemaining,
        filtersAppliedThisCycle: 0,
      });
    }

    // 3. Ideological Cohabitation Backlash (SUM-05, scaled by accordsThisCycle)
    const cohabScale = 1 + 0.15 * accordsThisCycle;
    const nextHappiness = { ...(game.factionHappiness || {}) };
    let severeBacklashCount = 0;
    (resolvedDemands.cohabitationPreview || []).forEach((cp) => {
      const curH = Number(nextHappiness[cp.factionId] ?? 60);
      const scaledDelta = round(cp.happinessDelta * cohabScale, 1);
      nextHappiness[cp.factionId] = clamp(curH + scaledDelta, 0, 100);
      if (cp.impact === 'hostile') {
        severeBacklashCount++;
      }
    });

    const bigTentDragFactor = game.identityCrisis?.doctrine === 'big_tent' ? 0.4 : 1.0;
    const nextCohabitationTurnoutDrag = severeBacklashCount > 0
      ? round(3.0 * bigTentDragFactor, 2)
      : (game.cohabitationTurnoutDrag || 0);

    // 4. Admit Faction (REQ-153)
    f.partyId = playerPartyId;
    f.frictionIndex = 0;
    f.ultimatumTurnsRemaining = null;
    f.confidence = Math.min(100, (f.confidence || 50) + 30);
    f.happiness = 65;
    nextHappiness[f.id] = 65;
    const nextConfidence = { ...(game.factionConfidence || {}) };
    nextConfidence[f.id] = f.confidence;
    if (f.name) nextConfidence[f.name] = f.confidence;

    // Propagate cohabitation deltas to politicians (REQ-159)
    (resolvedDemands.cohabitationPreview || []).forEach((cp) => {
      const scaledDelta = round(cp.happinessDelta * cohabScale, 1);
      applyFactionHappinessDelta(game, cp.factionId, scaledDelta);
    });
    if (Array.isArray(game.politicians)) {
      game.politicians.filter((p) => p.factionId === f.id).forEach((p) => { p.happiness = 65; });
    }
    if (Array.isArray(game.sittingMembers)) {
      // Bug #24: Post-accord bolt-immunity cooldown & higher starting happiness
      f.accordCooldownUntilYear = Number(game.year || 2028) + 6;
      f.happiness = 72;
      f.frictionIndex = 0;
      f.ultimatumTurnsRemaining = null;
      if (game.factionHappiness) game.factionHappiness[f.id] = 72;
      if (game.factionStandings) game.factionStandings[f.id] = 72;
      // Bug #5: Transfer adopted faction voters from independent into playerPartyId
      const vmAcc = game.voterModel;
      if (vmAcc && Array.isArray(vmAcc.states)) {
        const _acDiv = (vmAcc.voterScale === '1:1' || Number(vmAcc.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
        vmAcc.states.forEach((st) => {
          const fv = Number(st.factions?.[f.id] || 0);
          if (fv > 0 && st.affiliations) {
            const sh = Math.round(fv / _acDiv);
            const ded = Math.min(Number(st.affiliations.independent || 0), sh);
            st.affiliations.independent = Math.max(0, Number(st.affiliations.independent || 0) - ded);
            st.affiliations[playerPartyId] = Number(st.affiliations[playerPartyId] || 0) + ded;
          }
        });
        const _acMult = (vmAcc.voterScale === '1:1' || Number(vmAcc.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
        const sumP = vmAcc.states.reduce((s, st) => s + Number(st.affiliations?.[playerPartyId] || 0), 0);
        const sumI = vmAcc.states.reduce((s, st) => s + Number(st.affiliations?.independent || 0), 0);
        if (vmAcc.affiliations?.[playerPartyId]) {
          vmAcc.affiliations[playerPartyId].sampleVoters = sumP;
          vmAcc.affiliations[playerPartyId].representedVoters = sumP * _acMult;
        }
        if (vmAcc.affiliations?.independent) {
          vmAcc.affiliations.independent.sampleVoters = sumI;
          vmAcc.affiliations.independent.representedVoters = sumI * _acMult;
        }
        if (vmAcc.affiliations?.thirdParty?.byParty && ['liberty', 'green', 'constitution', 'socialist'].includes(playerPartyId)) {
          vmAcc.affiliations.thirdParty.byParty[playerPartyId] = sumP;
        }
      }
      game.sittingMembers.filter((p) => p.factionId === f.id).forEach((p) => { p.happiness = 72; p.party = playerPartyId; p.partyId = playerPartyId; });
    }

    // 5. Voter Influx: 100% of faction voters across all states move from Independent into Party
    const vm = game.voterModel;
    if (vm && Array.isArray(vm.states)) {
      vm.states.forEach((state) => {
        const fVoters = state.factions?.[factionId] || 0;
        if (fVoters > 0) {
          const shift = Math.round(fVoters);
          state.affiliations.independent = Math.max(0, (state.affiliations.independent || 0) - shift);
          state.affiliations[playerPartyId] = (state.affiliations[playerPartyId] || 0) + shift;
        }
      });

      // Reconcile national party totals
      const _caMult = (vm.voterScale === '1:1' || Number(vm.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
      const statePlayerSum = vm.states.reduce((sum, s) => sum + (s.affiliations[playerPartyId] || 0), 0) * _caMult;
      const stateIndSum = vm.states.reduce((sum, s) => sum + (s.affiliations.independent || 0), 0) * _caMult;
      if (vm.affiliations[playerPartyId]) vm.affiliations[playerPartyId].representedVoters = statePlayerSum;
      if (vm.affiliations.independent) vm.affiliations.independent.representedVoters = stateIndSum;
    }

    const accordVoters = Number(vm?.factions?.[f.id] ?? f.targetVoters ?? 0);
    const note = `Coalition Accord signed with ${f.name}: 100% of faction voters admitted to party rolls (${(accordVoters / 1_000_000).toFixed(2)}M voters).`;

    // [v0.18.7 QA-FIX] BUG-11: Coalition-Wide Summit Splash (+2 Happiness, -5 Friction to aligned party factions with dist <= 2.8)
    const _splashDistFn = deps?.computeFactionKeyIssuesDistance;
    (factions || []).forEach((otherF) => {
      if (!otherF || otherF.id === f.id || otherF.partyId !== playerPartyId) return;
      const d = typeof _splashDistFn === 'function'
        ? _splashDistFn(game, otherF, playerPartyId)
        : Math.hypot(
            (Number(otherF.sliders?.economic ?? 5) - Number(f.sliders?.economic ?? 5)),
            (Number(otherF.sliders?.social ?? 5) - Number(f.sliders?.social ?? 5)),
            (Number(otherF.sliders?.governance ?? 5) - Number(f.sliders?.governance ?? 5))
          );
      if (d <= 2.8) {
        const curH = Number(nextHappiness[otherF.id] ?? otherF.happiness ?? 60);
        const splashedH = clamp(round(curH + 2, 1), 0, 100);
        nextHappiness[otherF.id] = splashedH;
        otherF.happiness = splashedH;
        otherF.frictionIndex = clamp(round((otherF.frictionIndex || 0) - 5, 1), 0, 100);
      }
    });

    const signedState = {
      ...game,
      accordsThisCycle: accordsThisCycle + 1,
      organizingActionsRemaining: nextActions,
      actionsLeft: nextActions,
      issuePositions: nextIssuePositions,
      activeCoalitionPacts: nextActivePacts,
      factionHappiness: nextHappiness,
      factionConfidence: nextConfidence,
      factionStandings: { ...(game.factionStandings || {}), ...nextHappiness },
      cohabitationTurnoutDrag: nextCohabitationTurnoutDrag,
      factionDesignations: evaluateFactionTiers(game),
      grassrootsMultiplier: computeGrassrootsMultiplier({ ...game, factionHappiness: nextHappiness }),
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };
    const crisisEval = checkIdentityCrisisTrigger(signedState);
    if (signedState.identityCrisis) {
      signedState.identityCrisis = {
        ...signedState.identityCrisis,
        nonFoundingShare: crisisEval.nonFoundingShare,
        totalPartyVoters: crisisEval.totalPartyVoters,
        triggered: signedState.identityCrisis.triggered || crisisEval.shouldTrigger,
      };
    }
    return signedState;
  }

  // [QA-BATCH2-FIX] B2-04: Dynamically recalculate faction status & sizeTier from live conserved voters
  function recalculateFactionStatusTiers(game) {
    if (!game || !Array.isArray(game.factions)) return game;
    const vmStates = Array.isArray(game.voterModel?.states) ? game.voterModel.states : null;
    const stateTotals = {};
    if (vmStates) {
      vmStates.forEach((st) => {
        if (!st?.factions) return;
        Object.entries(st.factions).forEach(([fid, v]) => {
          stateTotals[fid] = (stateTotals[fid] || 0) + Math.max(0, Math.round(Number(v || 0)));
        });
      });
    }
    if (game.voterModel) {
      game.voterModel.factions = vmStates ? stateTotals : (game.voterModel.factions || {});
    }
    game.factions.forEach((f) => {
      if (!f) return;
      const liveVoters = vmStates
        ? Math.max(0, Number(stateTotals[f.id] || 0))
        : Math.max(0, Math.round(Number(game.voterModel?.factions?.[f.id] ?? f.voters ?? f.targetVoters ?? 0)));
      f.voters = liveVoters;
      f.nationalVoters = liveVoters;
      f.targetVoters = liveVoters;
      const sizeTier = liveVoters >= 12000000 ? 'major' : (liveVoters >= 2000000 ? 'minor' : 'fringe');
      f.sizeTier = sizeTier;
      const isLead = Boolean(f.id === game.leadingFactionByParty?.[f.partyId] || f.isLeading);
      f.status = isLead ? 'leading' : sizeTier;
    });
    return game;
  }

  // [QA-BATCH2-FIX] B2-03: Dissolve non-protected <25k / 0-voter ghost factions after 2 consecutive low cycles
  function pruneExtinctFactions(game) {
    if (!game || !Array.isArray(game.factions)) return { game, dissolved: [] };
    const protectedTypes = new Set(['racial', 'identity', 'religious']);
    const dissolved = [];
    const curYear = Number(game.year || 2028);
    if (!Array.isArray(game.dissolvedFactions)) game.dissolvedFactions = [];

    const vmStates = Array.isArray(game.voterModel?.states) ? game.voterModel.states : null;
    const stateTotals = {};
    if (vmStates) {
      vmStates.forEach((st) => {
        if (!st?.factions) return;
        Object.entries(st.factions).forEach(([fid, cnt]) => {
          stateTotals[fid] = (stateTotals[fid] || 0) + Math.max(0, Math.round(Number(cnt || 0)));
        });
      });
    }

    const remaining = [];
    const toRemoveIds = new Set();
    game.factions.forEach((f) => {
      if (!f) return;
      const voters = vmStates
        ? Number(stateTotals[f.id] || 0)
        : Number(game.voterModel?.factions?.[f.id] ?? f.voters ?? f.targetVoters ?? 0);
      const isProtected = Boolean(
        f.isExtremist
        || f.extremist
        || f.isIdentityBloc
        || f.protectedIdentityBloc
        || protectedTypes.has(String(f.type || '').toLowerCase())
      );
      if (isProtected) {
        f.lowVoterCycles = 0;
        remaining.push(f);
        return;
      }
      if (voters < 25000) {
        f.lowVoterCycles = Number(f.lowVoterCycles || 0) + 1;
        if (f.lowVoterCycles >= 2) {
          toRemoveIds.add(f.id);
          dissolved.push({ id: f.id, name: f.name, partyId: f.partyId, voters, year: curYear, reason: 'below_25k_extinct' });
          return;
        }
      } else {
        f.lowVoterCycles = 0;
      }
      remaining.push(f);
    });

    if (dissolved.length > 0) {
      game.factions = remaining;
      dissolved.forEach((d) => {
        game.dissolvedFactions.push(d);
        const neighbor = remaining
          .filter((r) => r && r.partyId === d.partyId)
          .sort((a, b) => Number(b.voters || b.targetVoters || 0) - Number(a.voters || a.targetVoters || 0))[0]
          || remaining.find((r) => r && !protectedTypes.has(String(r.type || '').toLowerCase()));
        if (vmStates) {
          vmStates.forEach((st) => {
            if (!st?.factions) return;
            const residual = Number(st.factions[d.id] || 0);
            if (residual > 0 && neighbor) {
              st.factions[neighbor.id] = (st.factions[neighbor.id] || 0) + residual;
            }
            delete st.factions[d.id];
          });
        }
        if (game.voterModel?.factions) delete game.voterModel.factions[d.id];
        if (game.factionHappiness) delete game.factionHappiness[d.id];
        if (game.factionStandings) delete game.factionStandings[d.id];
        if (game.leadingFactionByParty && game.leadingFactionByParty[d.partyId] === d.id) {
          const nextLead = remaining
            .filter((r) => r && r.partyId === d.partyId)
            .sort((a, b) => Number(b.voters || b.targetVoters || 0) - Number(a.voters || a.targetVoters || 0))[0];
          if (nextLead) game.leadingFactionByParty[d.partyId] = nextLead.id;
          else delete game.leadingFactionByParty[d.partyId];
        }
        const roleKey = `faction_${d.id}`;
        if (game.leadershipRoles && typeof game.leadershipRoles === 'object') {
          delete game.leadershipRoles[roleKey];
          Object.values(game.leadershipRoles).forEach((sub) => {
            if (sub && typeof sub === 'object' && !Array.isArray(sub)) delete sub[roleKey];
          });
        }
        if (Array.isArray(game.yearLog)) {
          game.yearLog.push({
            year: curYear,
            turn: (game.chairTurn || 0) + 1,
            action: `${d.name} has dissolved into political irrelevance.`,
          });
        }
      });
    }
    return { game, dissolved };
  }

  // [QA-BATCH2-FIX] B2-02: Organic inter-cycle faction emergence & splinter generator with voter conservation
  function evaluateDynamicFactionEmergence(game, options = {}) {
    if (!game || !Array.isArray(game.factions)) return { game, emerged: [] };
    const maxFactions = Number(options.maxActiveFactions ?? 45);
    const cooldownCycles = Number(options.cooldownCycles ?? 4);
    const curYear = Number(game.year || 2028);
    const lastYear = Number(game.lastOrganicEmergenceYear || 0);
    if (game.factions.length >= maxFactions) return { game, emerged: [] };
    if (!options.force && lastYear > 0 && (curYear - lastYear) < cooldownCycles * 2) {
      return { game, emerged: [] };
    }

    const protectedTypes = new Set(['racial', 'identity', 'religious']);
    const partyTotals = {};
    game.factions.forEach((f) => {
      if (!f || isUnaffiliatedPartyId(f.partyId)) return;
      partyTotals[f.partyId] = (partyTotals[f.partyId] || 0) + Number(f.voters || f.targetVoters || 0);
    });

    const vmStates = Array.isArray(game.voterModel?.states) ? game.voterModel.states : null;
    const emerged = [];

    // Trigger A: Large unhappy/drifting faction (>= 18M voters OR >= 25% of major party) splinters 20-30%
    const candidateParent = game.factions.find((f) => {
      if (!f || isUnaffiliatedPartyId(f.partyId) || protectedTypes.has(String(f.type || '').toLowerCase())) return false;
      const fv = Number(f.voters || f.targetVoters || game.voterModel?.factions?.[f.id] || 0);
      const pShare = partyTotals[f.partyId] > 0 ? fv / partyTotals[f.partyId] : 0;
      const isLarge = fv >= 18000000 || (['people', 'heritage'].includes(f.partyId) && pShare >= 0.25 && fv >= 4000000);
      const hap = Number(game.factionHappiness?.[f.id] ?? f.happiness ?? 60);
      const fric = Number(f.frictionIndex || 0);
      return isLarge && (hap < 35 || fric >= 65);
    });

    if (candidateParent) {
      const parentVoters = Number(candidateParent.voters || candidateParent.targetVoters || game.voterModel?.factions?.[candidateParent.id] || 0);
      const splitShare = 0.25;
      const childVoters = Math.round(parentVoters * splitShare);
      if (childVoters >= 350000) {
        const seq = (game.factions.length + 1);
        const childId = `org_splinter_${candidateParent.partyId}_${curYear}_${seq}`;
        const childName = `${candidateParent.name.replace(/^The\s+/i, '')} Dissidents (${curYear})`;
        const baseSliders = candidateParent.sliders || { social: 5, economic: 5, governance: 5 };
        const child = {
          id: childId,
          name: childName,
          partyId: candidateParent.partyId,
          type: 'ideological',
          status: childVoters >= 12000000 ? 'major' : (childVoters >= 2000000 ? 'minor' : 'fringe'),
          sizeTier: childVoters >= 12000000 ? 'major' : (childVoters >= 2000000 ? 'minor' : 'fringe'),
          voters: childVoters,
          targetVoters: childVoters,
          sliders: {
            social: Math.max(1, Math.min(10, Number(baseSliders.social ?? 5) + (candidateParent.partyId === 'people' ? -0.8 : 0.8))),
            economic: Math.max(1, Math.min(10, Number(baseSliders.economic ?? 5) + (candidateParent.partyId === 'people' ? -0.8 : 0.8))),
            governance: Math.max(1, Math.min(10, Number(baseSliders.governance ?? 5) + 0.7)),
          },
          keyIssues: Array.isArray(candidateParent.keyIssues) ? candidateParent.keyIssues.slice(0, 2) : ['taxes-spending', 'institutional-trust'],
          birthMode: 'sever',
          parentFactionId: candidateParent.id,
          happiness: 55,
          startingHappiness: 55,
          cohesion: 0.6,
          frictionIndex: 0,
        };
        candidateParent.voters = parentVoters - childVoters;
        candidateParent.targetVoters = candidateParent.voters;
        if (vmStates) {
          vmStates.forEach((st) => {
            if (!st?.factions) return;
            const pv = Math.max(0, Math.round(Number(st.factions[candidateParent.id] || 0)));
            const take = Math.round(pv * splitShare);
            st.factions[candidateParent.id] = pv - take;
            st.factions[child.id] = (st.factions[child.id] || 0) + take;
          });
        }
        if (game.voterModel?.factions) {
          game.voterModel.factions[candidateParent.id] = candidateParent.voters;
          game.voterModel.factions[child.id] = childVoters;
        }
        if (game.factionHappiness) game.factionHappiness[child.id] = 55;
        if (game.factionStandings) game.factionStandings[child.id] = 55;
        game.factions.push(child);
        game.lastOrganicEmergenceYear = curYear;
        emerged.push({ mode: 'splinter', parentId: candidateParent.id, faction: child });
      }
    }

    return { game, emerged };
  }

  const FactionCore = {
    RECOGNIZED_FRICTION_PARTIES,
    isUnaffiliatedPartyId,
    evaluateZeroFactionCollapse,
    evaluateFactionFriction,
    boltFaction,
    checkSummitEligibility,
    generateMergerCoalitionDemands,
    signCoalitionAccord,
    recalculateFactionStatusTiers,
    pruneExtinctFactions,
    evaluateDynamicFactionEmergence,
  };

  if (typeof window !== 'undefined') window.FactionCore = FactionCore;
  if (typeof root !== 'undefined' && root) root.FactionCore = FactionCore;
  if (typeof module !== 'undefined' && module.exports) module.exports = FactionCore;
})(typeof globalThis !== 'undefined' ? globalThis : this);
