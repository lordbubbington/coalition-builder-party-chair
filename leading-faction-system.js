/* ==========================================================================
   Dynamic Leading Faction Succession System (v0.18.4)
   Standalone module exposing window.LeadingFactionSystem and module.exports.
   Zero Math.random() — 100% deterministic logic.
   ========================================================================== */
(function initLeadingFactionSystem(root) {
  'use strict';

  const WEIGHTS = {
    governor: 5,
    senate: 3,
    house: 1,
  };

  const TAKEOVER_THRESHOLD_MULTIPLIER = 1.5;
  const ACCEPT_HAPPINESS_BONUS = 5;
  const REFUSE_HAPPINESS_PENALTY = -20;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function round(n, places) {
    const p = places === undefined ? 1 : places;
    const factor = Math.pow(10, p);
    return Math.round(n * factor) / factor;
  }

  function escapeHtml(val) {
    return String(val == null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPlayerPartyId(game) {
    if (!game || !game.player) return 'people';
    if (game.player.custom) return 'player';
    if (game.player.id && game.player.id !== 'player') return game.player.id;
    return game.player.baseTemplateId || 'people';
  }

  function normalizePartyId(pid, game) {
    if (!pid) return null;
    const raw = String(pid).trim();
    if (!raw || raw === 'none' || raw === 'independent' || raw === 'unaffiliated') return null;
    if (raw === 'democrat') return 'people';
    if (raw === 'republican') return 'heritage';
    if (raw === 'libertarian') return 'liberty';
    if (raw === 'player' && game && game.player && !game.player.custom) {
      return getPlayerPartyId(game);
    }
    return raw;
  }

  function getPartyDisplayName(game, partyId) {
    const pid = normalizePartyId(partyId, game) || partyId;
    if (game && game.player) {
      const playerPid = getPlayerPartyId(game);
      if (pid === playerPid || pid === 'player') {
        return game.player.name || game.player.shortName || pid;
      }
    }
    if (game && Array.isArray(game.rivals)) {
      const rival = game.rivals.find((r) => r && (r.id === pid || r.baseTemplateId === pid));
      if (rival) return rival.name || rival.shortName || pid;
    }
    const defaults = {
      people: 'Democratic Party',
      heritage: 'Republican Party',
      liberty: 'Libertarian Party',
      green: 'Green Party',
      constitution: 'Constitution Party',
      socialist: 'Socialist Party',
    };
    return defaults[pid] || pid;
  }

  function getActiveParties(game) {
    const set = new Set(['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist']);
    if (game && game.player && game.player.custom) {
      set.add('player');
    }
    const factions = (game && Array.isArray(game.factions)) ? game.factions : [];
    factions.forEach((f) => {
      if (f && f.partyId && f.partyId !== 'none' && f.partyId !== 'independent' && f.partyId !== 'unaffiliated') {
        set.add(f.partyId);
      }
    });
    return Array.from(set);
  }

  function resolveMemberFactionId(member, partyId, partyFactions) {
    if (!member || !Array.isArray(partyFactions) || !partyFactions.length) return null;
    const raw = member.factionId || member.faction || member.wing || null;
    if (!raw) return null;
    const nameToId = (typeof window !== 'undefined' && window.PartyChairData && window.PartyChairData.FACTION_NAME_TO_ID)
      ? window.PartyChairData.FACTION_NAME_TO_ID
      : {};
    const mapped = nameToId[raw] || raw;
    const match = partyFactions.find((f) => (
      f && (f.id === mapped || f.id === raw || f.name === raw || f.name === mapped || f.legacyId === raw)
    ));
    return match ? match.id : null;
  }

  function resolveIncomingPresident(game, factionsList) {
    if (!game) return null;
    const cp = game.currentPresident && typeof game.currentPresident === 'object' ? game.currentPresident : null;
    const rawPresParty = (cp && (cp.partyId || cp.party))
      || game.governingParty
      || (game.lastElection && game.lastElection.presidentialWinner)
      || null;
    const presParty = normalizePartyId(rawPresParty, game);
    if (!presParty) return null;

    const allFactions = Array.isArray(factionsList) && factionsList.length
      ? factionsList
      : (Array.isArray(game.factions) ? game.factions : []);
    const partyFactions = allFactions.filter((f) => f && f.partyId === presParty);
    if (!partyFactions.length) return { partyId: presParty, factionId: null, name: cp ? cp.name : null };

    // 1. Direct factionId / faction / wing on currentPresident
    if (cp) {
      const directFac = resolveMemberFactionId(cp, presParty, partyFactions);
      if (directFac) {
        return { partyId: presParty, factionId: directFac, name: cp.name || null };
      }
    }

    // 2. Match incoming president by name / id / office in incoming pools
    const presName = (cp && cp.name)
      || (game.lastElection && game.lastElection.presidential && game.lastElection.presidential.winnerNominee)
      || (game.presidentialTicket && game.presidentialTicket[presParty])
      || null;
    const presId = cp && cp.id ? cp.id : null;

    const pools = [
      ...(Array.isArray(game.sittingMembers) ? game.sittingMembers : []),
      ...(Array.isArray(game.politicians) ? game.politicians : []),
      ...(Array.isArray(game.rosterMembers) ? game.rosterMembers : []),
      ...(Array.isArray(game.generatedMembers) ? game.generatedMembers : []),
      ...(Array.isArray(game.candidates) ? game.candidates : []),
    ];

    let presMember = null;
    if (presId) {
      presMember = pools.find((m) => m && m.id === presId);
    }
    if (!presMember && presName) {
      const lower = String(presName).toLowerCase();
      presMember = pools.find((m) => m && m.name && String(m.name).toLowerCase() === lower);
    }
    if (!presMember) {
      presMember = (Array.isArray(game.sittingMembers) ? game.sittingMembers : []).find((m) => (
        m && m.office === 'president' && normalizePartyId(m.party || m.partyId, game) === presParty
      ));
    }

    if (presMember) {
      const resolvedFac = resolveMemberFactionId(presMember, presParty, partyFactions);
      if (resolvedFac) {
        return { partyId: presParty, factionId: resolvedFac, name: presMember.name || presName };
      }
    }

    // 3. Check primaryResults for presidential winner
    if (Array.isArray(game.primaryResults) && presName) {
      const lower = String(presName).toLowerCase();
      const pr = game.primaryResults.find((r) => r && r.winnerName && String(r.winnerName).toLowerCase() === lower);
      if (pr) {
        const prFac = resolveMemberFactionId(pr, presParty, partyFactions);
        if (prFac) {
          return { partyId: presParty, factionId: prFac, name: pr.winnerName || presName };
        }
      }
    }

    return { partyId: presParty, factionId: null, name: presName };
  }

  function classifyOffice(officeRaw) {
    if (!officeRaw) return null;
    const o = String(officeRaw).toLowerCase().trim();
    if (o === 'governor' || o === 'gov') return 'governor';
    if (o === 'senate' || o === 'senator') return 'senate';
    if (o === 'house' || o === 'representative' || o === 'rep') return 'house';
    return null;
  }

  function computeWeightedLegislatorScores(game, partyId, partyFactions) {
    const scores = {};
    (partyFactions || []).forEach((f) => {
      if (!f || !f.id) return;
      scores[f.id] = {
        factionId: f.id,
        factionName: f.name || f.id,
        govs: 0,
        sens: 0,
        house: 0,
        score: 0,
      };
    });

    const sitting = Array.isArray(game && game.sittingMembers) ? game.sittingMembers : [];
    sitting.forEach((m) => {
      if (!m || m.retired || m.isRetired || m.outgoing || m.defeated) return;
      const mParty = normalizePartyId(m.party || m.partyId || m.caucus, game);
      if (mParty !== partyId) return;

      const officeType = classifyOffice(m.office);
      if (!officeType) return;

      const facId = resolveMemberFactionId(m, partyId, partyFactions);
      if (!facId || !scores[facId]) return;

      if (officeType === 'governor') {
        scores[facId].govs += 1;
        scores[facId].score += WEIGHTS.governor;
      } else if (officeType === 'senate') {
        scores[facId].sens += 1;
        scores[facId].score += WEIGHTS.senate;
      } else if (officeType === 'house') {
        scores[facId].house += 1;
        scores[facId].score += WEIGHTS.house;
      }
    });

    return scores;
  }

  function getFactionVoters(game, faction) {
    const vf = game && game.voterModel && game.voterModel.factions ? game.voterModel.factions : {};
    return Number(vf[faction.id] ?? vf[faction.name] ?? faction.targetVoters ?? 0);
  }

  function getCurrentLeadingFactionId(game, partyId, partyFactions) {
    if (!Array.isArray(partyFactions) || !partyFactions.length) return null;

    const tracked = game && game.leadingFactionByParty ? game.leadingFactionByParty[partyId] : null;
    if (tracked && partyFactions.some((f) => f.id === tracked)) {
      return tracked;
    }

    const designations = (game && game.factionDesignations) || {};
    const byDesig = partyFactions.find((f) => designations[f.id] === 'leading');
    if (byDesig) return byDesig.id;

    const byFlag = partyFactions.find((f) => f.status === 'leading' || f.isLeading);
    if (byFlag) return byFlag.id;

    if (partyId === 'heritage' && partyFactions.some((f) => f.id === 'gop_maga')) return 'gop_maga';
    if (partyId === 'people' && partyFactions.some((f) => f.id === 'dem_liberal_establishment')) return 'dem_liberal_establishment';

    const sorted = partyFactions.slice().sort((a, b) => {
      const diff = getFactionVoters(game, b) - getFactionVoters(game, a);
      if (diff !== 0) return diff;
      return String(a.id).localeCompare(String(b.id));
    });
    return sorted[0].id;
  }

  function syncPartyLeadingDesignation(partyId, leadingId, factions, designations, leadingByParty) {
    if (!leadingId) return;
    leadingByParty[partyId] = leadingId;
    factions.forEach((f) => {
      if (!f || f.partyId !== partyId) return;
      if (f.id === leadingId) {
        designations[f.id] = 'leading';
        f.status = 'leading';
        f.isLeading = true;
      } else {
        if (designations[f.id] === 'leading' || f.status === 'leading' || f.isLeading) {
          designations[f.id] = 'major';
          f.status = 'major';
        }
        f.isLeading = false;
      }
    });
  }

  function applyHappinessDeltaToState(state, factionId, delta) {
    const f = state.factions.find((x) => x && x.id === factionId);
    const currentH = Number(
      state.factionHappiness[factionId]
      ?? state.factionStandings[factionId]
      ?? (f ? f.happiness : undefined)
      ?? 65
    );
    const nextH = clamp(round(currentH + delta, 1), 0, 100);

    state.factionHappiness[factionId] = nextH;
    state.factionStandings[factionId] = nextH;
    if (f) {
      f.happiness = nextH;
      if (f.name) {
        state.factionHappiness[f.name] = nextH;
        state.factionStandings[f.name] = nextH;
      }
      if (f.legacyId) {
        state.factionStandings[f.legacyId] = nextH;
      }
      // Keep symmetric game.parties[*].factionHappiness in lockstep so save/reload sync preserves deltas
      if (state.parties && typeof state.parties === 'object') {
        const nextParties = { ...state.parties };
        const partyKeys = [f.partyId, 'player'].filter(Boolean);
        partyKeys.forEach((pk) => {
          if (nextParties[pk] && typeof nextParties[pk] === 'object') {
            const pfHap = { ...(nextParties[pk].factionHappiness || {}) };
            pfHap[factionId] = nextH;
            if (f.name) pfHap[f.name] = nextH;
            nextParties[pk] = { ...nextParties[pk], factionHappiness: pfHap };
          }
        });
        state.parties = nextParties;
      }
    }

    // Co-movement for sitting members & politicians in the affected faction
    if (Array.isArray(state.sittingMembers)) {
      state.sittingMembers = state.sittingMembers.map((m) => {
        if (m && (m.factionId === factionId || m.faction === factionId)) {
          return { ...m, happiness: clamp(round((m.happiness ?? 65) + delta, 1), 0, 100) };
        }
        return m;
      });
    }
    if (Array.isArray(state.politicians)) {
      state.politicians = state.politicians.map((p) => {
        if (p && (p.factionId === factionId || p.faction === factionId)) {
          return { ...p, happiness: clamp(round((p.happiness ?? 65) + delta, 1), 0, 100) };
        }
        return p;
      });
    }
    return nextH;
  }

  /**
   * Evaluates Dynamic Leading Faction Succession Rules between cycles.
   * MUST be called AFTER incoming sittingMembers and currentPresident are finalized.
   */
  function evaluateLeadingFactionSuccession(game) {
    if (!game) return game;

    const nextFactions = Array.isArray(game.factions)
      ? game.factions.map((f) => (f ? { ...f } : f))
      : [];
    const nextDesignations = { ...(game.factionDesignations || {}) };
    const nextLeadingByParty = { ...(game.leadingFactionByParty || {}) };
    const nextYearLog = Array.isArray(game.yearLog) ? game.yearLog.slice() : [];
    let pendingChallenge = null;

    const playerPartyId = getPlayerPartyId(game);
    const incomingPres = resolveIncomingPresident(game, nextFactions);
    const parties = getActiveParties(game);
    const cycleYear = game.year || 2028;
    const turnNum = (game.chairTurn || 0) + 1;

    parties.forEach((pid) => {
      const partyFactions = nextFactions.filter((f) => f && f.partyId === pid);
      if (!partyFactions.length) return;

      const currentLeadingId = getCurrentLeadingFactionId(
        { ...game, factions: nextFactions, factionDesignations: nextDesignations, leadingFactionByParty: nextLeadingByParty },
        pid,
        partyFactions
      );
      const currentLeadingObj = partyFactions.find((f) => f.id === currentLeadingId) || partyFactions[0];
      const partyName = getPartyDisplayName(game, pid);

      // Rule 1: Presidential Override (All Parties)
      if (incomingPres && incomingPres.partyId === pid && incomingPres.factionId) {
        const presFacObj = partyFactions.find((f) => f.id === incomingPres.factionId);
        if (presFacObj) {
          if (presFacObj.id !== currentLeadingId) {
            const presLabel = incomingPres.name ? `President ${incomingPres.name}` : 'the incoming President';
            nextYearLog.push({
              year: cycleYear,
              turn: turnNum,
              action: `Presidential Override: ${presFacObj.name} assumed leadership of the ${partyName} following the inauguration of ${presLabel} (succeeding ${currentLeadingObj ? currentLeadingObj.name : currentLeadingId}).`,
            });
          }
          syncPartyLeadingDesignation(pid, presFacObj.id, nextFactions, nextDesignations, nextLeadingByParty);
          return;
        }
      }

      // Rule 2: Out-of-Power Weighted Legislator Takeover (All Parties without the Presidency)
      const holdsPresidency = Boolean(incomingPres && incomingPres.partyId === pid);
      if (!holdsPresidency && partyFactions.length > 1) {
        const scores = computeWeightedLegislatorScores(game, pid, partyFactions);
        const currentEntry = scores[currentLeadingId] || {
          factionId: currentLeadingId,
          factionName: currentLeadingObj ? currentLeadingObj.name : currentLeadingId,
          govs: 0,
          sens: 0,
          house: 0,
          score: 0,
        };

        const challengers = partyFactions
          .filter((f) => f.id !== currentLeadingId)
          .map((f) => ({
            ...scores[f.id],
            voters: getFactionVoters(game, f),
          }))
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.voters !== a.voters) return b.voters - a.voters;
            return String(a.factionId).localeCompare(String(b.factionId));
          });

        const topChallenger = challengers[0];
        const qualifies = Boolean(
          topChallenger
          && topChallenger.score > 0
          && topChallenger.score >= currentEntry.score * TAKEOVER_THRESHOLD_MULTIPLIER
        );

        if (qualifies) {
          if (pid === playerPartyId) {
            // Rule 3: Player Refusal Option — defer swap until player decides
            syncPartyLeadingDesignation(pid, currentLeadingId, nextFactions, nextDesignations, nextLeadingByParty);
            pendingChallenge = {
              partyId: pid,
              currentLeadingId,
              currentLeadingName: currentEntry.factionName,
              currentScore: currentEntry.score,
              currentBreakdown: {
                governors: currentEntry.govs,
                senators: currentEntry.sens,
                house: currentEntry.house,
              },
              challengerId: topChallenger.factionId,
              challengerName: topChallenger.factionName,
              challengerScore: topChallenger.score,
              challengerBreakdown: {
                governors: topChallenger.govs,
                senators: topChallenger.sens,
                house: topChallenger.house,
              },
              year: cycleYear,
            };
            return;
          }

          // AI rival party: auto-transition without blocking modal
          syncPartyLeadingDesignation(pid, topChallenger.factionId, nextFactions, nextDesignations, nextLeadingByParty);
          nextYearLog.push({
            year: cycleYear,
            turn: turnNum,
            action: `Leadership Transition: ${topChallenger.factionName} (${topChallenger.score} pts) took control of the ${partyName} from ${currentEntry.factionName} (${currentEntry.score} pts) based on incoming legislative strength.`,
          });
          return;
        }
      }

      // No takeover — ensure current leading designation stays cleanly synced
      syncPartyLeadingDesignation(pid, currentLeadingId, nextFactions, nextDesignations, nextLeadingByParty);
    });

    return {
      ...game,
      factions: nextFactions,
      factionDesignations: nextDesignations,
      leadingFactionByParty: nextLeadingByParty,
      pendingLeadingFactionChallenge: pendingChallenge,
      yearLog: nextYearLog.slice(-80),
    };
  }

  /**
   * Resolves a pending player party leading-faction challenge ('accept' or 'refuse').
   */
  function resolveLeadingFactionChallenge(game, payload) {
    if (!game || !game.pendingLeadingFactionChallenge) return game;

    const p = (payload && payload.payload) ? payload.payload : (payload || {});
    const decision = String(p.decision || p.choice || '').toLowerCase().trim();
    if (decision !== 'accept' && decision !== 'refuse') return game;

    const ch = game.pendingLeadingFactionChallenge;
    const nextState = {
      ...game,
      factions: Array.isArray(game.factions) ? game.factions.map((f) => (f ? { ...f } : f)) : [],
      factionDesignations: { ...(game.factionDesignations || {}) },
      leadingFactionByParty: { ...(game.leadingFactionByParty || {}) },
      factionHappiness: { ...(game.factionHappiness || game.factionStandings || {}) },
      factionStandings: { ...(game.factionStandings || game.factionHappiness || {}) },
      sittingMembers: Array.isArray(game.sittingMembers) ? game.sittingMembers.slice() : [],
      politicians: Array.isArray(game.politicians) ? game.politicians.slice() : [],
      yearLog: Array.isArray(game.yearLog) ? game.yearLog.slice() : [],
      pendingLeadingFactionChallenge: null,
    };

    const cycleYear = ch.year || game.year || 2028;
    const turnNum = (game.chairTurn || 0) + 1;

    if (decision === 'accept') {
      syncPartyLeadingDesignation(
        ch.partyId,
        ch.challengerId,
        nextState.factions,
        nextState.factionDesignations,
        nextState.leadingFactionByParty
      );
      applyHappinessDeltaToState(nextState, ch.challengerId, ACCEPT_HAPPINESS_BONUS);
      const note = `Leadership Transition Accepted: ${ch.challengerName} (${ch.challengerScore} pts) became the party's leading faction, succeeding ${ch.currentLeadingName} (${ch.currentScore} pts). (+${ACCEPT_HAPPINESS_BONUS} Happiness to ${ch.challengerName})`;
      nextState.yearLog.push({ year: cycleYear, turn: turnNum, action: note });
      nextState.yearLog = nextState.yearLog.slice(-80);
      nextState.lastNote = note;
      return nextState;
    }

    // decision === 'refuse'
    syncPartyLeadingDesignation(
      ch.partyId,
      ch.currentLeadingId,
      nextState.factions,
      nextState.factionDesignations,
      nextState.leadingFactionByParty
    );
    applyHappinessDeltaToState(nextState, ch.challengerId, REFUSE_HAPPINESS_PENALTY);
    const note = `Leadership Takeover Refused: ${ch.currentLeadingName} retained party leadership over ${ch.challengerName} (${ch.challengerScore} pts vs. ${ch.currentScore} pts). (${REFUSE_HAPPINESS_PENALTY} Happiness to ${ch.challengerName})`;
    nextState.yearLog.push({ year: cycleYear, turn: turnNum, action: note });
    nextState.yearLog = nextState.yearLog.slice(-80);
    nextState.lastNote = note;
    return nextState;
  }

  /**
   * Renders the decision modal markup for the player's party when Rule 2 triggers.
   */
  function renderLeadingFactionChallengeModal(game, safeFn) {
    const ch = game && game.pendingLeadingFactionChallenge;
    if (!ch) return '';
    const s = typeof safeFn === 'function' ? safeFn : escapeHtml;

    const curScore = Number(ch.currentScore || 0);
    const chalScore = Number(ch.challengerScore || 0);
    const curB = ch.currentBreakdown || {};
    const chalB = ch.challengerBreakdown || {};
    const curGovs = Number(curB.governors || 0);
    const curSens = Number(curB.senators || 0);
    const curHouse = Number(curB.house || 0);
    const chalGovs = Number(chalB.governors || 0);
    const chalSens = Number(chalB.senators || 0);
    const chalHouse = Number(chalB.house || 0);
    const threshold = round(curScore * TAKEOVER_THRESHOLD_MULTIPLIER, 1);

    return `
      <div class="v07-modal-overlay" id="leading-faction-challenge-modal" role="dialog" aria-modal="true" aria-labelledby="leading-faction-challenge-title" style="z-index:1060">
        <div class="v07-modal-card" style="max-width:640px;width:94%;padding:24px;background:var(--panel, #16202b);border:1px solid rgba(212,175,55,0.45);border-radius:12px">
          <div class="eyebrow" style="color:var(--gold, #e5b84b);margin-bottom:6px">Party Leadership Challenge · Cycle ${s(ch.year || game.year || 2028)}</div>
          <h2 id="leading-faction-challenge-title" style="margin:0 0 10px;font-size:20px;color:var(--text, #f1f5f9)">${s(ch.challengerName)} Demands Party Leadership</h2>
          <p style="font-size:14px;line-height:1.55;color:var(--muted, #cbd5e1);margin:0 0 16px">
            With the party out of the White House, <b>${s(ch.challengerName)}</b> has surpassed the 1.5&times; incoming legislative weight threshold (${threshold} pts) needed to challenge <b>${s(ch.currentLeadingName)}</b> for control of the party apparatus.
          </p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px">
            <div style="padding:12px;border-radius:8px;background:rgba(15,23,42,0.55);border:1px solid rgba(148,163,184,0.25)">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;margin-bottom:4px">Current Leading Faction</div>
              <div style="font-size:15px;font-weight:700;color:#e2e8f0;margin-bottom:6px">${s(ch.currentLeadingName)}</div>
              <div style="font-size:22px;font-weight:800;color:#94a3b8;margin-bottom:6px">${curScore} pts</div>
              <div style="font-size:12px;color:#94a3b8">${curGovs} Gov (&times;5) &middot; ${curSens} Sen (&times;3) &middot; ${curHouse} House (&times;1)</div>
            </div>
            <div style="padding:12px;border-radius:8px;background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.45)">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--gold, #e5b84b);margin-bottom:4px">Qualifying Challenger</div>
              <div style="font-size:15px;font-weight:700;color:#f8fafc;margin-bottom:6px">${s(ch.challengerName)}</div>
              <div style="font-size:22px;font-weight:800;color:var(--gold, #e5b84b);margin-bottom:6px">${chalScore} pts</div>
              <div style="font-size:12px;color:#cbd5e1">${chalGovs} Gov (&times;5) &middot; ${chalSens} Sen (&times;3) &middot; ${chalHouse} House (&times;1)</div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px">
            <button type="button" class="button button-gold" data-action="resolve-leading-faction-challenge" data-decision="accept" style="display:flex;justify-content:space-between;align-items:center;text-align:left;padding:12px 14px">
              <div>
                <div style="font-weight:700;font-size:14px">Accept Leadership Transition</div>
                <div style="font-size:12px;opacity:0.9;margin-top:2px">${s(ch.challengerName)} becomes Leading Faction (+5 Happiness); ${s(ch.currentLeadingName)} becomes Major Faction.</div>
              </div>
            </button>
            <button type="button" class="button" data-action="resolve-leading-faction-challenge" data-decision="refuse" style="display:flex;justify-content:space-between;align-items:center;text-align:left;padding:12px 14px;border-color:rgba(239,68,68,0.55);background:rgba(239,68,68,0.12)">
              <div>
                <div style="font-weight:700;font-size:14px">Refuse Takeover</div>
                <div style="font-size:12px;opacity:0.9;margin-top:2px">${s(ch.currentLeadingName)} retains party leadership; ${s(ch.challengerName)} suffers &minus;20 Happiness.</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const api = {
    WEIGHTS,
    TAKEOVER_THRESHOLD_MULTIPLIER,
    ACCEPT_HAPPINESS_BONUS,
    REFUSE_HAPPINESS_PENALTY,
    getPlayerPartyId,
    normalizePartyId,
    resolveIncomingPresident,
    computeWeightedLegislatorScores,
    getCurrentLeadingFactionId,
    evaluateLeadingFactionSuccession,
    resolveLeadingFactionChallenge,
    renderLeadingFactionChallengeModal,
  };

  if (typeof window !== 'undefined') {
    window.LeadingFactionSystem = api;
  }
  if (typeof global !== 'undefined') {
    global.LeadingFactionSystem = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
