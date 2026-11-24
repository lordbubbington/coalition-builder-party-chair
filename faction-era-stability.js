// [v0.18.4 FACTION-ERA-FIXES] Standalone Faction & Anchor Stability Module
// Deterministic logic only — no Math.random(). Exposes window.FactionEraStability and module.exports.
(function (root) {
  'use strict';

  const LEGACY_ANCHOR_BY_PARTY = {
    people: 'dem_liberal_establishment',
    heritage: 'gop_maga',
  };

  const LEGACY_PARTY_BY_ANCHOR = {
    dem_liberal_establishment: 'people',
    gop_maga: 'heritage',
  };

  const DRIFT_STEP_PER_CYCLE = 0.35;
  const DRIFT_DISTANCE_THRESHOLD = 3.0;
  const MINORITY_ANCHOR_SHARE_THRESHOLD = 0.30;
  const REALIGN_ACTIONS_COST = 2;
  const REALIGN_MONEY_COST = 10;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function round(val, digits = 2) {
    const mult = Math.pow(10, digits);
    return Math.round(Number(val || 0) * mult) / mult;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isUnaffiliatedPartyId(pid) {
    return pid === 'none' || pid === 'independent' || pid === 'unaffiliated' || pid === '' || pid === null || pid === undefined;
  }

  function getPlayerPartyId(game) {
    return game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || game?.player?.id || 'people');
  }

  function getFactionVoters(game, faction) {
    if (!faction) return 0;
    const vmFactions = game?.voterModel?.factions || {};
    const v = vmFactions[faction.id] ?? vmFactions[faction.name] ?? faction.targetVoters ?? 0;
    return Number.isFinite(Number(v)) ? Number(v) : 0;
  }

  function getPartyIroncladAnchorId(game, partyId) {
    if (!partyId || isUnaffiliatedPartyId(partyId)) return null;
    if (game?.realignedAnchors && game.realignedAnchors[partyId]) {
      return game.realignedAnchors[partyId];
    }
    const flagged = (game?.factions || []).find((f) => f && f.partyId === partyId && Boolean(f.isIroncladAnchor));
    if (flagged) return flagged.id;
    return LEGACY_ANCHOR_BY_PARTY[partyId] || null;
  }

  function isEffectiveIroncladAnchor(game, factionOrId) {
    if (!factionOrId) return false;
    const fid = typeof factionOrId === 'string' ? factionOrId : factionOrId.id;
    if (!fid) return false;
    const f = typeof factionOrId === 'object'
      ? factionOrId
      : (game?.factions || []).find((x) => x && x.id === fid) || null;

    const realigned = game?.realignedAnchors && typeof game.realignedAnchors === 'object'
      ? game.realignedAnchors
      : null;

    if (realigned) {
      // If this faction's party has realigned its anchor, only the new anchor is ironclad
      if (f && f.partyId && realigned[f.partyId]) {
        return realigned[f.partyId] === fid;
      }
      // If this is a legacy hardcoded anchor whose default party realigned away from it, lock is lifted
      const legacyParty = LEGACY_PARTY_BY_ANCHOR[fid];
      if (legacyParty && realigned[legacyParty] && realigned[legacyParty] !== fid) {
        return false;
      }
      // If any party designated this faction as its realigned anchor, it is ironclad
      if (Object.values(realigned).includes(fid)) {
        return true;
      }
    }

    return Boolean(f?.isIroncladAnchor) || fid === 'dem_liberal_establishment' || fid === 'gop_maga';
  }

  function getPartyPlatformCentroid(game, partyId) {
    const playerPid = getPlayerPartyId(game);
    if (partyId === playerPid || partyId === 'player') {
      return {
        economic: clamp(5.5 + Number(game?.player?.economic || 0) * 4.5, 1, 10),
        social: clamp(5.5 + Number(game?.player?.social || 0) * 4.5, 1, 10),
      };
    }
    const rival = (game?.rivals || []).find((r) => r && r.id === partyId);
    if (rival) {
      return {
        economic: clamp(5.5 + Number(rival.economic || 0) * 4.5, 1, 10),
        social: clamp(5.5 + Number(rival.social || 0) * 4.5, 1, 10),
      };
    }
    return { economic: 5.5, social: 5.5 };
  }

  function getPartyAnchorStatus(game, partyId) {
    const factions = Array.isArray(game?.factions) ? game.factions : [];
    const partyFactions = factions.filter((f) => f && f.partyId === partyId);
    const anchorId = getPartyIroncladAnchorId(game, partyId);
    const anchor = partyFactions.find((f) => f.id === anchorId) || null;
    const totalPartyVoters = partyFactions.reduce((sum, f) => sum + getFactionVoters(game, f), 0);
    const anchorVoters = anchor ? getFactionVoters(game, anchor) : 0;
    const anchorShare = totalPartyVoters > 0 ? (anchorVoters / totalPartyVoters) : 0;

    // Determine leading faction from factionDesignations, status/isLeading flags, or voter plurality
    const designations = game?.factionDesignations || {};
    let leadingFaction = partyFactions.find((f) => designations[f.id] === 'leading') || null;
    if (!leadingFaction) {
      const flaggedLeading = partyFactions.filter((f) => f.status === 'leading' || f.isLeading);
      if (flaggedLeading.length === 1) {
        leadingFaction = flaggedLeading[0];
      }
    }
    if (!leadingFaction && partyFactions.length > 0) {
      leadingFaction = [...partyFactions].sort((a, b) => getFactionVoters(game, b) - getFactionVoters(game, a))[0];
    }

    const isLeading = Boolean(anchor && leadingFaction && leadingFaction.id === anchor.id);
    const playerPid = getPlayerPartyId(game);
    const isBigTent = (partyId === playerPid) && game?.identityCrisis?.doctrine === 'big_tent';

    // Candidate new anchor for Party Realignment Charter: current leading faction (if not anchor) or largest non-anchor faction
    let candidateNewAnchor = null;
    if (leadingFaction && anchor && leadingFaction.id !== anchor.id) {
      candidateNewAnchor = leadingFaction;
    } else if (anchor) {
      const others = partyFactions
        .filter((f) => f.id !== anchor.id)
        .sort((a, b) => getFactionVoters(game, b) - getFactionVoters(game, a));
      candidateNewAnchor = others[0] || null;
    }

    return {
      partyId,
      anchor,
      anchorId: anchor?.id || anchorId,
      partyFactions,
      totalPartyVoters,
      anchorVoters,
      anchorShare,
      leadingFaction,
      leadingFactionId: leadingFaction?.id || null,
      isLeading,
      isBigTent,
      candidateNewAnchor,
    };
  }

  function applyAnchorRealignmentDrift(game) {
    if (!game || !Array.isArray(game.factions)) return { game, drifted: [] };
    const parties = new Set();
    game.factions.forEach((f) => {
      if (f && !isUnaffiliatedPartyId(f.partyId) && isEffectiveIroncladAnchor(game, f)) {
        parties.add(f.partyId);
      }
    });

    const drifted = [];
    parties.forEach((pid) => {
      const status = getPartyAnchorStatus(game, pid);
      const anchor = status.anchor;
      if (!anchor) return;
      const eligible = !status.isLeading || status.anchorShare < MINORITY_ANCHOR_SHARE_THRESHOLD || status.isBigTent;
      if (!eligible) return;

      const centroid = getPartyPlatformCentroid(game, pid);
      if (!anchor.sliders || typeof anchor.sliders !== 'object') {
        anchor.sliders = { economic: 5, social: 5, governance: 5 };
      }
      const curEcon = Number(anchor.sliders.economic ?? 5);
      const curSoc = Number(anchor.sliders.social ?? 5);
      const dist = Math.hypot(curEcon - centroid.economic, curSoc - centroid.social);
      if (dist <= DRIFT_DISTANCE_THRESHOLD) return;

      const econDiff = centroid.economic - curEcon;
      const socDiff = centroid.social - curSoc;
      const econDelta = Math.sign(econDiff) * Math.min(DRIFT_STEP_PER_CYCLE, Math.abs(econDiff));
      const socDelta = Math.sign(socDiff) * Math.min(DRIFT_STEP_PER_CYCLE, Math.abs(socDiff));

      anchor.sliders = {
        ...anchor.sliders,
        economic: clamp(round(curEcon + econDelta, 2), 1, 10),
        social: clamp(round(curSoc + socDelta, 2), 1, 10),
      };

      const newDist = Math.hypot(anchor.sliders.economic - centroid.economic, anchor.sliders.social - centroid.social);
      drifted.push({
        partyId: pid,
        factionId: anchor.id,
        fromDistance: round(dist, 2),
        toDistance: round(newDist, 2),
        economic: anchor.sliders.economic,
        social: anchor.sliders.social,
      });
    });

    return { game, drifted };
  }

  function adjustCohabitationPreviewItem(game, playerPartyId, existingFaction, item) {
    if (!existingFaction || !item) return item;
    const currentYear = Number(game?.year || 2028);

    // 1. Skip cohabitation backlash on any faction currently under post-accord bolt immunity
    if (Number(existingFaction.accordCooldownUntilYear || 0) > currentYear && Number(item.happinessDelta || 0) < 0) {
      return {
        ...item,
        impact: 'immune',
        happinessDelta: 0,
        accordImmune: true,
      };
    }

    // 2. Halve hostile cohabitation backlash from a non-leading or minority (<30%) ironclad anchor
    if (
      item.impact === 'hostile'
      && Number(item.happinessDelta || 0) < 0
      && isEffectiveIroncladAnchor(game, existingFaction)
    ) {
      const status = getPartyAnchorStatus(game, playerPartyId);
      if (!status.isLeading || status.anchorShare < MINORITY_ANCHOR_SHARE_THRESHOLD) {
        return {
          ...item,
          happinessDelta: round(Number(item.happinessDelta) * 0.5, 1),
          anchorReliefApplied: true,
        };
      }
    }

    return item;
  }

  function canRealignPartyAnchor(game, partyIdOverride = null) {
    if (!game) return { eligible: false, reason: 'No active game state.' };
    const partyId = partyIdOverride || getPlayerPartyId(game);
    const status = getPartyAnchorStatus(game, partyId);
    if (!status.anchor) {
      return { eligible: false, reason: 'No ironclad anchor faction found in this party.', partyId };
    }

    // Chunk 2.3: Mandatory 8-year (4-cycle) realignment cooldown
    const currentYear = Number(game.year || 2028);
    const lastRealign = Number(game.lastRealignmentYear || 0);
    if (lastRealign > 0 && (currentYear - lastRealign) < 8) {
      return {
        eligible: false,
        reason: `Realignment Cooldown Active: A charter was ratified in ${lastRealign}. Mandatory 8-year (4-cycle) cooldown active until ${lastRealign + 8}.`,
        partyId,
        oldAnchorId: status.anchor.id,
        oldAnchorName: status.anchor.name,
      };
    }

    // Prevent realignment when current anchor is already the plurality leading faction
    if (status.isLeading) {
      return {
        eligible: false,
        reason: `${status.anchor.name} is already the leading plurality faction (${round(status.anchorShare * 100, 1)}% of party voters).`,
        partyId,
        oldAnchorId: status.anchor.id,
        oldAnchorName: status.anchor.name,
        anchorShare: status.anchorShare,
        isLeading: status.isLeading,
      };
    }
    if (!status.candidateNewAnchor) {
      return {
        eligible: false,
        reason: 'Another faction must be present in your party to assume the anchor role.',
        partyId,
        oldAnchorId: status.anchor.id,
        oldAnchorName: status.anchor.name,
      };
    }

    // Prevent targeting a faction previously realigned away
    const prevAnchors = Array.isArray(game.previousAnchorFactions) ? game.previousAnchorFactions : [];
    if (prevAnchors.includes(status.candidateNewAnchor.id)) {
      return {
        eligible: false,
        reason: `Cannot realign anchor to ${status.candidateNewAnchor.name}: this faction was previously realigned away.`,
        partyId,
        oldAnchorId: status.anchor.id,
        oldAnchorName: status.anchor.name,
        newAnchorId: status.candidateNewAnchor.id,
        newAnchorName: status.candidateNewAnchor.name,
      };
    }

    if (game.activeAnchorCrisis && !game.activeAnchorCrisis.resolved) {
      return {
        eligible: false,
        reason: 'Resolve the active Internal Anchor Crisis before convening a Party Realignment Charter.',
        partyId,
        oldAnchorId: status.anchor.id,
        oldAnchorName: status.anchor.name,
        newAnchorId: status.candidateNewAnchor.id,
        newAnchorName: status.candidateNewAnchor.name,
      };
    }
    const actionsLeft = Number(game.organizingActionsRemaining ?? game.actionsLeft ?? 0);
    const treasury = Number(game.treasury || 0);
    return {
      eligible: true,
      canAfford: actionsLeft >= REALIGN_ACTIONS_COST && treasury >= REALIGN_MONEY_COST,
      actionsLeft,
      treasury,
      actionsCost: REALIGN_ACTIONS_COST,
      moneyCost: REALIGN_MONEY_COST,
      partyId,
      oldAnchorId: status.anchor.id,
      oldAnchorName: status.anchor.name,
      newAnchorId: status.candidateNewAnchor.id,
      newAnchorName: status.candidateNewAnchor.name,
      anchorShare: status.anchorShare,
      isLeading: status.isLeading,
      reason: null,
    };
  }

  function executeRealignPartyAnchor(game, payload = {}) {
    if (!game) return game;
    if (game.phase && game.phase !== 'organizing') {
      return { ...game, lastNote: 'Party Realignment Charter is only available during the Organizing phase.' };
    }
    const partyId = payload?.partyId || getPlayerPartyId(game);
    const check = canRealignPartyAnchor(game, partyId);
    if (!check.eligible) {
      return { ...game, lastNote: check.reason || 'Party Realignment Charter is not eligible.' };
    }
    if (check.actionsLeft < REALIGN_ACTIONS_COST) {
      return { ...game, lastNote: `Party Realignment Charter requires ${REALIGN_ACTIONS_COST} organizing actions.` };
    }
    if (check.treasury < REALIGN_MONEY_COST) {
      return { ...game, lastNote: `Party Realignment Charter requires $${REALIGN_MONEY_COST}M.` };
    }

    const note = `PARTY REALIGNMENT CHARTER: Initiated anchor transfer from ${check.oldAnchorName} to ${check.newAnchorName} (-2 Actions, -$10M). Resolve the resulting Anchor Crisis to finalize the transfer.`;
    return {
      ...game,
      treasury: round(check.treasury - REALIGN_MONEY_COST, 2),
      organizingActionsRemaining: Math.max(0, check.actionsLeft - REALIGN_ACTIONS_COST),
      lastRealignmentYear: Number(game.year || 2028),
      previousAnchorFactions: Array.from(new Set([...(game.previousAnchorFactions || []), check.oldAnchorId])),
      activeAnchorCrisis: {
        factionId: check.oldAnchorId,
        partyId,
        year: game.year || 2028,
        turnoutDrag: 0.04,
        fundraisingDrag: 0.15,
        primaryRevolt: true,
        resolved: false,
        isRealignmentCharter: true,
        targetNewAnchorId: check.newAnchorId,
      },
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year || 2028, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };
  }

  function resolveAnchorCrisisRealignment(game) {
    if (!game || !game.activeAnchorCrisis) return game;
    const crisis = game.activeAnchorCrisis;
    let updated = { ...game };

    if (crisis.isRealignmentCharter && crisis.targetNewAnchorId && crisis.partyId) {
      const partyId = crisis.partyId;
      const oldAnchorId = crisis.factionId;
      const newAnchorId = crisis.targetNewAnchorId;

      const nextRealigned = {
        ...(updated.realignedAnchors && typeof updated.realignedAnchors === 'object' ? updated.realignedAnchors : {}),
        [partyId]: newAnchorId,
      };
      updated.realignedAnchors = nextRealigned;

      const nextFactions = (updated.factions || []).map((f) => {
        if (!f) return f;
        if (f.id === oldAnchorId) {
          return { ...f, isIroncladAnchor: false };
        }
        if (f.id === newAnchorId) {
          return { ...f, isIroncladAnchor: true };
        }
        return f;
      });
      updated.factions = nextFactions;

      const oldName = nextFactions.find((f) => f.id === oldAnchorId)?.name || oldAnchorId;
      const newName = nextFactions.find((f) => f.id === newAnchorId)?.name || newAnchorId;
      const note = `PARTY REALIGNMENT CHARTER RATIFIED: ${newName} is now the ironclad anchor of the party. ${oldName}'s anchor lock has been lifted.`;
      updated.lastRealignmentYear = Number(updated.year || 2028);
      updated.previousAnchorFactions = Array.from(new Set([...(updated.previousAnchorFactions || []), oldAnchorId]));
      updated.lastNote = note;
      updated.yearLog = [...(updated.yearLog || []), { year: updated.year || 2028, turn: (updated.chairTurn || 0) + 1, action: note }].slice(-80);
    }

    updated.activeAnchorCrisis = null;
    return updated;
  }

  function renderRealignmentCharterCard(game, partyId, disabled) {
    const check = canRealignPartyAnchor(game, partyId);
    if (!check.eligible) return '';
    const btnDisabled = disabled || !check.canAfford;
    const sharePct = round((check.anchorShare || 0) * 100, 1);
    return `
      <div class="action-card v07-card-highlight" style="border-color:#f59e0b88">
        <div class="action-head"><i>📜</i><b>Party Realignment Charter</b><span>${REALIGN_ACTIONS_COST} actions · $${REALIGN_MONEY_COST}M</span></div>
        <p><b>${escapeHtml(check.oldAnchorName)}</b> is no longer the dominant anchor (${sharePct}% of party voters). Convene a formal charter to transfer ironclad anchor status to <b>${escapeHtml(check.newAnchorName)}</b>. Triggers a one-time Internal Anchor Crisis; resolving it lifts the legacy anchor lock.</p>
        <div class="inline-controls">
          <button type="button" class="button button-small" style="border-color:#f59e0b;color:#fcd34d" data-action="realign-party-anchor" ${btnDisabled ? 'disabled' : ''}>Convene Realignment Charter (2 act · -$10M)</button>
        </div>
      </div>`;
  }

  const api = {
    LEGACY_ANCHOR_BY_PARTY,
    DRIFT_STEP_PER_CYCLE,
    DRIFT_DISTANCE_THRESHOLD,
    MINORITY_ANCHOR_SHARE_THRESHOLD,
    REALIGN_ACTIONS_COST,
    REALIGN_MONEY_COST,
    isUnaffiliatedPartyId,
    getPartyIroncladAnchorId,
    isEffectiveIroncladAnchor,
    getPartyPlatformCentroid,
    getPartyAnchorStatus,
    applyAnchorRealignmentDrift,
    adjustCohabitationPreviewItem,
    canRealignPartyAnchor,
    executeRealignPartyAnchor,
    resolveAnchorCrisisRealignment,
    renderRealignmentCharterCard,
  };

  if (typeof root !== 'undefined' && root) {
    root.FactionEraStability = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
