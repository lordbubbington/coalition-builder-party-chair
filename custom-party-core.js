/**
 * Coalition Builder: Party Chair — v0.18.5 Core Module
 * CustomPartyCore: Custom Party faction compatibility checks, Turn 1 voter/seat/tier/budget
 * calibration, and derived ideological axis helpers.
 * Zero-behavior-change extraction from engine.js.
 */
(function (root) {
  'use strict';

  function filterCompatibleCustomFactions(rawChosen, customOrigin, schismParentPartyId, catFactions) {
    // Anchor Lock Defense: dem_liberal_establishment & gop_maga cannot leave
    const safeChosen = (Array.isArray(rawChosen) ? rawChosen : []).filter(
      (id) => id !== 'dem_liberal_establishment' && id !== 'gop_maga'
    );
    // Bug #18: Centroid-based compatibility tolerance (enables cross-party centrist & single-party replacement coalitions)
    const validChosenIds = [];
    const factionLookup = new Map((catFactions || []).map((f) => [f.id, f]));
    const centroidTol = (customOrigin === 'executive_third_way' || customOrigin === 'civic_reform')
      ? 3.2
      : (customOrigin === 'major_schism' ? 3.5 : 2.8);

    for (const fid of safeChosen) {
      const f = factionLookup.get(fid);
      if (!f) continue;
      const fEcon = f.sliders?.economic ?? f.economic ?? 5;
      const fSoc = f.sliders?.social ?? f.social ?? 5;
      if (validChosenIds.length === 0) {
        validChosenIds.push(fid);
        continue;
      }
      const sameSchismParent = customOrigin === 'major_schism' && schismParentPartyId && f.partyId === schismParentPartyId;
      if (sameSchismParent) {
        validChosenIds.push(fid);
        continue;
      }
      const meanEcon = validChosenIds.reduce((s, id) => s + (factionLookup.get(id)?.sliders?.economic ?? 5), 0) / validChosenIds.length;
      const meanSoc = validChosenIds.reduce((s, id) => s + (factionLookup.get(id)?.sliders?.social ?? 5), 0) / validChosenIds.length;
      if (Math.abs(fEcon - meanEcon) <= centroidTol + 1e-9 && Math.abs(fSoc - meanSoc) <= centroidTol + 1e-9) {
        validChosenIds.push(fid);
      }
    }
    return { validChosenIds, factionLookup };
  }

  // [v0.18.8 PLAYTEST-FIX #11] Derive full platform issuePositions directly from the chosen Leading Faction's sliders & keyIssues
  function deriveIssuePositionsFromFaction(leadingFaction, issuesCatalog = null, fallbackPositions = null) {
    const issues = Array.isArray(issuesCatalog) && issuesCatalog.length
      ? issuesCatalog
      : ((typeof window !== 'undefined' && window.PartyChairData?.VERSION_021_ISSUES) || (typeof global !== 'undefined' && global.PartyChairData?.VERSION_021_ISSUES) || []);
    const base = { ...(fallbackPositions || {}) };
    if (!leadingFaction || !issues.length) return base;
    const econ = Number(leadingFaction.sliders?.economic ?? leadingFaction.economic ?? 5.5);
    const soc = Number(leadingFaction.sliders?.social ?? leadingFaction.social ?? 5.5);
    const gov = Number(leadingFaction.sliders?.governance ?? leadingFaction.governance ?? 5.5);
    const clamp10 = (v) => Math.max(1, Math.min(10, Math.round(v)));
    issues.forEach((issue) => {
      if (!issue || !issue.id) return;
      const cat = String(issue.category || '').toLowerCase();
      const axis = String(issue.axis || '').toLowerCase();
      let score = (econ + soc) / 2;
      if (axis === 'economic' || cat.includes('econ') || cat.includes('tax') || cat.includes('fiscal') || cat.includes('labor') || cat.includes('trade') || cat.includes('health')) {
        score = econ;
      } else if (axis === 'social' || cat.includes('social') || cat.includes('cultur') || cat.includes('civil') || cat.includes('rights') || cat.includes('immig')) {
        score = soc;
      } else if (axis === 'governance' || cat.includes('gov') || cat.includes('democ') || cat.includes('instit') || cat.includes('foreign') || cat.includes('security')) {
        score = gov;
      } else if (axis === 'climate' || cat.includes('climat') || cat.includes('energ') || cat.includes('envir')) {
        score = (econ * 0.65 + soc * 0.35);
      }
      base[issue.id] = clamp10(score);
    });
    return base;
  }

  function computeDerivedCustomPartyAxes(validChosenIds, factionLookup, deps = {}) {
    const roundFn = deps.round || ((v, d = 2) => { const m = 10 ** d; return Math.round(v * m) / m; });
    const clampFn = deps.clamp || ((v, lo, hi) => Math.max(lo, Math.min(hi, v)));
    if (!Array.isArray(validChosenIds) || validChosenIds.length === 0) return null;

    let wSum = 0; let wEcon = 0; let wSoc = 0;
    let largestFid = validChosenIds[0]; let largestV = -1;
    validChosenIds.forEach((fid) => {
      const fm = factionLookup.get(fid);
      const fv = Math.max(1, Number(fm?.targetVoters || window.PartyChairData?.FACTION_NATIONAL_TOTALS?.[fid] || 100000));
      if (fv > largestV) { largestV = fv; largestFid = fid; }
      wSum += fv;
      wEcon += fv * Number(fm?.sliders?.economic ?? 5.5);
      wSoc += fv * Number(fm?.sliders?.social ?? 5.5);
    });
    const avgEcon10 = wEcon / Math.max(1, wSum);
    const avgSoc10 = wSoc / Math.max(1, wSum);
    const economic = roundFn(clampFn((avgEcon10 - 5.5) / 4.5, -1, 1), 2);
    const social = roundFn(clampFn((avgSoc10 - 5.5) / 4.5, -1, 1), 2);
    const climate = roundFn(clampFn(-economic * 0.75, -1, 1), 2);
    const local = roundFn(clampFn(social * 0.65, -1, 1), 2);
    return { economic, social, climate, local, largestFid };
  }

  function initializeCustomPartyState(game, player, opts, params, deps) {
    const {
      customOrigin,
      schismParentPartyId,
      foundingStateId,
      startingWarChest,
      archetypeTreasuryDelta,
      customLeader,
      customArchetype,
      seed,
    } = params;
    const {
      STATES,
      clamp,
      round,
      apportionSampleUnitsHareNiemeyer,
      getFactionsCatalog,
      startingIssuePositions,
      computePartyInstitutionalTierRaw,
      computeUnifiedPartyApproval,
    } = deps;

    if (customOrigin === 'not_major_movement') {
      const cfId = 'custom_founding_faction';
      const cfName = (opts.customFactionName || `${player.name} Movement`).trim().slice(0, 36);
      const cfSliders = opts.customFactionSliders || { economic: player.economic, social: player.social, governance: 5.0 };
      const cfIssues = Array.isArray(opts.customFactionKeyIssues) && opts.customFactionKeyIssues.length === 2
        ? opts.customFactionKeyIssues
        : ['healthcare-model', 'campaign-finance'];
      let stateAllocs = opts.customFactionStateAllocations || { [player.foundingStateId || 'PA']: 100000 };
      let allocSum = Object.values(stateAllocs).reduce((sum, v) => sum + (Number(v) || 0), 0);
      if (allocSum !== 100000) {
        throw new Error(`State voter allocations sum to ${allocSum} / 100,000. Exactly 100,000 voters required.`);
      }

      // REQ-249: Hare-Niemeyer largest-remainder apportionment with exact 1,000 sample-unit conservation
      const sampleUnitsMap = apportionSampleUnitsHareNiemeyer(stateAllocs, 1000);

      game.customFaction100k = {
        id: cfId,
        name: cfName,
        partyId: 'player',
        type: 'ideological',
        status: 'leading',
        isCustomFounding: true,
        targetVoters: 100000,
        sliders: cfSliders,
        keyIssues: cfIssues,
        stateAllocations: stateAllocs,
      };

      const cfObj = {
        id: cfId,
        name: cfName,
        partyId: 'player',
        status: 'leading',
        isCustomFounding: true,
        sliders: cfSliders,
        economic: cfSliders.economic,
        social: cfSliders.social,
        governance: cfSliders.governance,
        happiness: 75,
        confidence: 65,
        frictionIndex: 0,
        keyIssues: cfIssues,
      };
      game.factions = [cfObj, ...(game.factions || [])];
      game.factionHappiness[cfId] = 75;
      game.factionConfidence[cfId] = 65;
      game.factionStandings[cfId] = 75;
      game.factionDesignations[cfId] = 'leading';

      // REQ-248: 155M Zero-Variance Electorate Injection: Two-Ledger Rule
      if (game.voterModel && Array.isArray(game.voterModel.states)) {
        game.voterModel.states.forEach((st) => {
          st.affiliations = st.affiliations || {};
          st.factions = st.factions || {};
          const stKey = st.stateId || st.id;
          const alloc = Number(stateAllocs[stKey] || 0);
          const allocSample = Number(sampleUnitsMap[stKey] || 0);

          if (alloc > 0 || allocSample > 0) {
            // Ledger 1: Sample units transfer
            st.affiliations.player = (st.affiliations.player || 0) + allocSample;
            let remainingSampleDeduct = allocSample;
            const indCount = st.affiliations.independent || 0;
            const indDeduct = Math.min(indCount, remainingSampleDeduct);
            st.affiliations.independent -= indDeduct;
            remainingSampleDeduct -= indDeduct;
            if (remainingSampleDeduct > 0) {
              const otherAffKeys = Object.keys(st.affiliations).filter((k) => k !== 'player' && (st.affiliations[k] || 0) > 0);
              for (const k of otherAffKeys) {
                const d = Math.min(st.affiliations[k], remainingSampleDeduct);
                st.affiliations[k] -= d;
                remainingSampleDeduct -= d;
                if (remainingSampleDeduct <= 0) break;
              }
            }

            // Ledger 2: Represented voters injection and proportional swing deduction
            st.factions[cfId] = alloc;
            let remainingToDeduct = alloc;
            const swgKeys = Object.keys(st.factions).filter((k) => k.startsWith('swg_'));
            const swgTotal = swgKeys.reduce((acc, k) => acc + (st.factions[k] || 0), 0);
            if (swgTotal > 0) {
              let deducted = 0;
              swgKeys.forEach((k) => {
                const portion = Math.min(st.factions[k] || 0, Math.round(remainingToDeduct * ((st.factions[k] || 0) / swgTotal)));
                st.factions[k] -= portion;
                deducted += portion;
              });
              let remainderDeduct = remainingToDeduct - deducted;
              if (remainderDeduct !== 0 && swgKeys.length > 0) {
                st.factions[swgKeys[0]] = Math.max(0, (st.factions[swgKeys[0]] || 0) - remainderDeduct);
              }
            }
          } else {
            if (st.affiliations.player === undefined) st.affiliations.player = 0;
            if (st.factions[cfId] === undefined) st.factions[cfId] = 0;
          }
        });
      }
      player.baseShare = (100000 / 155000000) * 100;
      if (!game.voterModel.affiliations) game.voterModel.affiliations = {};
      game.voterModel.affiliations.player = {
        name: player.name,
        sampleVoters: 1000,
        representedVoters: 100000,
      };
    } else {
      // Catalog Factions Chosen
      const rawChosen = Array.isArray(opts.selectedFactionIds)
        ? opts.selectedFactionIds
        : (Array.isArray(opts.startingSelectedFactionIds) ? opts.startingSelectedFactionIds : []);
      const catFactions = getFactionsCatalog();
      const { validChosenIds, factionLookup } = filterCompatibleCustomFactions(
        rawChosen,
        customOrigin,
        schismParentPartyId,
        catFactions
      );

      player.startingSelectedFactionIds = validChosenIds;

      // Minor-Party Merger Dissolution
      const minorPartyFactions = {
        liberty: catFactions.filter((f) => f.partyId === 'liberty').map((f) => f.id),
        green: catFactions.filter((f) => f.partyId === 'green').map((f) => f.id),
        constitution: catFactions.filter((f) => f.partyId === 'constitution').map((f) => f.id),
        socialist: catFactions.filter((f) => f.partyId === 'socialist').map((f) => f.id),
      };

      const dissolvingParties = new Set();
      validChosenIds.forEach((fid) => {
        for (const [mpId, fList] of Object.entries(minorPartyFactions)) {
          if (fList.includes(fid)) {
            dissolvingParties.add(mpId);
          }
        }
      });

      game.dissolvedParties = Array.from(dissolvingParties);
      dissolvingParties.forEach((mpId) => {
        const absorbed = validChosenIds.filter((fid) => minorPartyFactions[mpId].includes(fid));
        const orphaned = minorPartyFactions[mpId].filter((fid) => !validChosenIds.includes(fid));
        game.dissolvedPartyDetails[mpId] = {
          mergedInto: 'player',
          year: game.year || 2028,
          absorbedFactionIds: absorbed,
          orphanedFactionIds: orphaned,
        };
      });

      let totalVotersTransferred = 0;
      if (game.voterModel && Array.isArray(game.voterModel.states)) {
        validChosenIds.forEach((fid) => {
          const fObj = (game.factions || []).find((f) => f.id === fid);
          const origParty = fObj?.partyId || factionLookup.get(fid)?.partyId || 'independent';
          if (fObj) {
            fObj.partyId = 'player';
            fObj.happiness = 75;
            fObj.confidence = 65;
            game.factionHappiness[fid] = 75;
            game.factionConfidence[fid] = 65;
            game.factionStandings[fid] = 75;
          }
          game.voterModel.states.forEach((st) => {
            st.affiliations = st.affiliations || {};
            st.factions = st.factions || {};
            const count = st.factions[fid] || 0;
            if (count > 0) {
              const _c1to1 = (game.voterModel?.voterScale === '1:1' || Number(game.voterModel?.sampleVoters || 0) >= 10_000_000);
              const countSample = _c1to1 ? Math.round(count) : Math.round(count / 100);
              if (origParty && st.affiliations[origParty] !== undefined) {
                st.affiliations[origParty] = Math.max(0, (st.affiliations[origParty] || 0) - countSample);
              }
              st.affiliations.player = (st.affiliations.player || 0) + countSample;
              totalVotersTransferred += count;
            }
          });
        });

        // REQ-245 Part 2 + Bug #6: Reconcile ALL national affiliations from state totals so Turn 1 never double-counts (>100%)
        if (!game.voterModel.affiliations) game.voterModel.affiliations = {};
        const _c1to1Nat = (game.voterModel?.voterScale === '1:1' || Number(game.voterModel?.sampleVoters || 0) >= 10_000_000);
        const _natMult = _c1to1Nat ? 1 : 100;
        game.voterModel.affiliations.player = {
          name: player.name,
          sampleVoters: _c1to1Nat ? Math.round(totalVotersTransferred) : Math.round(totalVotersTransferred / 100),
          representedVoters: totalVotersTransferred,
        };
        ['people', 'heritage', 'independent', 'liberty', 'green', 'constitution', 'socialist'].forEach((ak) => {
          const stSum = game.voterModel.states.reduce((s, st) => s + Number(st.affiliations?.[ak] || 0), 0);
          if (game.voterModel.affiliations[ak]) {
            game.voterModel.affiliations[ak].sampleVoters = stSum;
            game.voterModel.affiliations[ak].representedVoters = stSum * _natMult;
          }
          if (game.voterModel.affiliations?.thirdParty?.byParty && ['liberty', 'green', 'constitution', 'socialist'].includes(ak)) {
            game.voterModel.affiliations.thirdParty.byParty[ak] = stSum;
          }
        });

        // Bug #10: Derive Custom Party ideological axes from voter-weighted centroid of selected starting factions
        const derivedAxes = computeDerivedCustomPartyAxes(validChosenIds, factionLookup, { round, clamp });
        // [v0.18.8 PLAYTEST-FIX #11] Respect player-chosen Leading Faction and derive issuePositions from it
        const chosenLeadingId = (opts?.customLeadingFactionId && validChosenIds.includes(opts.customLeadingFactionId))
          ? opts.customLeadingFactionId
          : (derivedAxes?.largestFid || validChosenIds[0]);
        if (chosenLeadingId) {
          game.leadingFactionId = chosenLeadingId;
          if (!game.factionDesignations) game.factionDesignations = {};
          game.factionDesignations[chosenLeadingId] = 'leading';
          const leadObj = factionLookup.get(chosenLeadingId);
          if (leadObj) {
            game.issuePositions = deriveIssuePositionsFromFaction(leadObj, null, game.issuePositions);
          }
        }
        if (derivedAxes) {
          player.economic = derivedAxes.economic;
          player.social = derivedAxes.social;
          player.climate = derivedAxes.climate;
          player.local = derivedAxes.local;
          const derivedIssues = startingIssuePositions(player);
          player.issuePositions = derivedIssues;
          game.issuePositions = derivedIssues;
          // Mark largest faction as founding anchor (reduces friction slightly, still allows Game Over if lost)
          const anchorObj = (game.factions || []).find((f) => f.id === derivedAxes.largestFid);
          if (anchorObj) anchorObj.isFoundingAnchor = true;
        }

        // Orphaned hardliners become Independent with Sellout Grudge
        dissolvingParties.forEach((mpId) => {
          const orphaned = game.dissolvedPartyDetails[mpId]?.orphanedFactionIds || [];
          orphaned.forEach((orfId) => {
            const orfObj = (game.factions || []).find((f) => f.id === orfId);
            if (orfObj) {
              orfObj.partyId = 'none';
              orfObj.originMinorPartyId = mpId;
              orfObj.seekingPartyHome = true;
              orfObj.selloutGrudge = {
                active: true,
                targetPartyId: 'player',
                cyclesRemaining: 3,
                snipesFired: 0,
                rehomedPartyId: null,
              };
            }
            game.voterModel.states.forEach((st) => {
              st.affiliations = st.affiliations || {};
              st.factions = st.factions || {};
              const count = st.factions[orfId] || 0;
              if (count > 0) {
                if (st.affiliations[mpId] !== undefined) {
                  st.affiliations[mpId] = Math.max(0, (st.affiliations[mpId] || 0) - count);
                }
                st.affiliations.independent = (st.affiliations.independent || 0) + count;
              }
            });
          });
        });
      }

      // Scrub dissolved minor parties from rivals & ballots
      if (dissolvingParties.size > 0) {
        game.rivals = (game.rivals || []).filter((r) => !dissolvingParties.has(r.id));
        dissolvingParties.forEach((mpId) => {
          delete game.organizations[mpId];
          if (game.ballotAccess && game.ballotAccess[mpId]) {
            delete game.ballotAccess[mpId];
          }
          if (game.ballotAccessStatutory && game.ballotAccessStatutory[mpId]) {
            delete game.ballotAccessStatutory[mpId];
          }
        });
      }

      // Universal Politician Transfer
      const transferPol = (p) => {
        const fId = p.factionId || p.faction;
        if (validChosenIds.includes(fId)) {
          p.party = 'player';
          p.rawParty = player.customCode || 'C';
          if (p.isIncumbent || p.incumbent) {
            if (p.office === 'house') {
              game.seats = Math.max(1, (game.seats || 0) + 1);
              if (p.districtId) {
                const rep = (game.representatives || []).find((r) => r.districtId === p.districtId || r.id === p.districtId);
                if (rep) { rep.party = 'player'; rep.partyId = 'player'; }
              }
            } else if (p.office === 'governor' && p.stateId) {
              game.governorships = game.governorships || {};
              game.governorships[p.stateId] = 'player';
            }
          }
        } else {
          for (const mpId of dissolvingParties) {
            if (game.dissolvedPartyDetails[mpId]?.orphanedFactionIds?.includes(fId)) {
              p.party = 'independent';
              p.rawParty = 'IND';
              break;
            }
          }
        }
      };

      (game.sittingMembers || []).forEach(transferPol);
      (game.politicians || []).forEach(transferPol);
      (game.generatedMembers || []).forEach(transferPol);
      (game.offers || []).forEach(transferPol);

      player.baseShare = (totalVotersTransferred / 155000000) * 100;
    }

    // Dynamic Starting Ascent Tier, Focus Slots, Ballot Access, Treasury & Approval Calibration (v0.16.9)
    const actualStartingVoters = customOrigin === 'not_major_movement' ? 100000 : Math.round((player.baseShare / 100) * 155000000);
    let voterStartTier = 0;
    if (actualStartingVoters >= 25000000) voterStartTier = 5;
    else if (actualStartingVoters >= 12000000) voterStartTier = 4;
    else if (actualStartingVoters >= 5000000) voterStartTier = 3;
    else if (actualStartingVoters >= 2000000) voterStartTier = 2;
    else if (actualStartingVoters >= 350000) voterStartTier = 1;
    else voterStartTier = 0;
    const rawComputedTier = computePartyInstitutionalTierRaw(game, 'player');
    // Bug #19: Cap Turn 1 tier so voter share isn't jumped straight to Tier 5 on medium splinters
    const startTier = clamp(Math.max(voterStartTier, Math.min(voterStartTier + 1, rawComputedTier)), 0, 5);

    const startFocusSlots = startTier <= 0 ? 1 : startTier >= 5 ? 7 : startTier >= 3 ? 5 : 3;

    game.partyTiers = {
      ...(game.partyTiers || {}),
      player: startTier,
    };
    if (startTier >= 1) {
      game.ascensionGauntletCompleted = { ...(game.ascensionGauntletCompleted || {}), player: true };
    }
    if (game.priorities?.additional) {
      game.priorities.additional = Array.from({ length: startFocusSlots }, () => ({ type: 'issue', targetId: '' }));
    }

    // Bug #19/#20: Preserve advertised origin startingWarChest as floor
    const majorBaselineBudget = window.PartyChairV07?.STARTING_BUDGETS?.major ?? 150;
    const customTierTreasuryMap = {
      0: startingWarChest,
      1: Math.max(10.0, startingWarChest),
      2: Math.max(25.0, startingWarChest),
      3: Math.max(45.0, startingWarChest),
      4: Math.max(85.0, startingWarChest),
      5: majorBaselineBudget,
    };
    const tierBaseTreasury = customTierTreasuryMap[startTier] ?? startingWarChest;
    game.treasury = Math.max(1.0, round(tierBaseTreasury + archetypeTreasuryDelta, 1));

    // Tier-scaled downballot ballot access
    const downballotStateCountByTier = { 0: 0, 1: 3, 2: 10, 3: 20, 4: 35, 5: 50 };
    const downballotCount = downballotStateCountByTier[startTier] ?? 0;
    const allFiftyStates = STATES.filter((s) => s.id !== 'DC');
    const rankedCustomStates = allFiftyStates.slice().sort((a, b) => {
      const stA = (game.voterModel?.states || []).find((x) => (x.stateId || x.id) === a.id);
      const stB = (game.voterModel?.states || []).find((x) => (x.stateId || x.id) === b.id);
      const totA = Number(stA?.representedVoters || 1);
      const totB = Number(stB?.representedVoters || 1);
      const _shMult = (game.voterModel?.voterScale === '1:1' || Number(game.voterModel?.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
      const shA = (Number(stA?.affiliations?.player || 0) * _shMult) / totA;
      const shB = (Number(stB?.affiliations?.player || 0) * _shMult) / totB;
      return shB - shA;
    });
    const grantedDownballotStates = startTier >= 5
      ? allFiftyStates.map((s) => s.id)
      : rankedCustomStates.slice(0, downballotCount).map((s) => s.id);
    const grantedSet = new Set(grantedDownballotStates);
    const allHouseDistricts = window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS || [];
    const customBallotObj = { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} };
    // Bug #19/#20: Always guarantee ballot access (presidential + downballot) in the chosen foundingStateId
    if (foundingStateId && !grantedSet.has(foundingStateId)) {
      grantedSet.add(foundingStateId);
      grantedDownballotStates.push(foundingStateId);
    }
    if (foundingStateId) {
      customBallotObj.presidential[foundingStateId] = true;
    }
    if (startTier >= 5) {
      STATES.forEach((s) => { customBallotObj.presidential[s.id] = true; });
    }
    grantedDownballotStates.forEach((stId) => {
      customBallotObj.senate[stId] = true;
      customBallotObj.governor[stId] = true;
      customBallotObj.leg[stId] = true;
    });
    allHouseDistricts.forEach((d) => {
      if (grantedSet.has(d.stateId)) customBallotObj.house[d.id] = true;
    });
    game.ballotAccess = {
      ...(game.ballotAccess || {}),
      player: customBallotObj,
    };
    if (downballotCount > 0) {
      const nextSlates = { ...(game.contestedStateLegSlates || {}) };
      grantedDownballotStates.forEach((stId) => { nextSlates[stId] = true; });
      game.contestedStateLegSlates = nextSlates;
    }

    game.founderLegacy = {
      active: true,
      founderId: customLeader ? customLeader.id : `founder-${seed}`,
      founderName: customLeader ? customLeader.name : player.leaderName,
      founderArchetypeId: customArchetype?.id || player.leaderArchetype || null,
      movementAuraCyclesRemaining: 3,
      auraFundraisingBonus: 0.20,
      auraRecruitmentLift: 1.0,
      successionTriggered: false,
      successionResolved: false,
      successionTriggerReason: null,
      successionYear: null,
      successionOutcome: null,
      postSuccessionCyclePending: false,
      preSuccessionBaseline: { voteShare: player.baseShare, seats: game.seats || 0 },
    };

    game.player = player;
    game.partyApprovals = computeUnifiedPartyApproval(game);
    return game;
  }

  const CustomPartyCore = {
    filterCompatibleCustomFactions,
    deriveIssuePositionsFromFaction,
    computeDerivedCustomPartyAxes,
    initializeCustomPartyState,
  };

  if (typeof window !== 'undefined') window.CustomPartyCore = CustomPartyCore;
  if (typeof root !== 'undefined' && root) root.CustomPartyCore = CustomPartyCore;
  if (typeof module !== 'undefined' && module.exports) module.exports = CustomPartyCore;
})(typeof globalThis !== 'undefined' ? globalThis : this);
