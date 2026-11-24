// Coalition Builder: Party Chair — Demographic Electorate Model
// Census CVAP demographic breakdowns, group-level elasticity, and baseline party affiliations.

(function PartyChairDemographicsModule() {
  const DEFAULT_GROUPS = [
    {
      id: 'white',
      name: 'White',
      cvapPercent: 65,
      swingElasticity: 1.45,
      baselinePartyShare: { people: 40, heritage: 52, independent: 8 },
      issuePriorities: [
        { issueId: 'cost-of-living', weight: 1.2 },
        { issueId: 'taxes-spending', weight: 1.1 },
        { issueId: 'border-enforcement', weight: 1.0 },
      ],
    },
    {
      id: 'black',
      name: 'Black',
      cvapPercent: 13,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 82, heritage: 11, independent: 7 },
      issuePriorities: [
        { issueId: 'racial-equity', weight: 1.3 },
        { issueId: 'criminal-justice-reform', weight: 1.2 },
        { issueId: 'voting-rules', weight: 1.1 },
      ],
    },
    {
      id: 'hispanic',
      name: 'Hispanic / Latino',
      cvapPercent: 14,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 56, heritage: 36, independent: 8 },
      issuePriorities: [
        { issueId: 'cost-of-living', weight: 1.2 },
        { issueId: 'immigration-visas', weight: 1.2 },
        { issueId: 'minimum-wage', weight: 1.0 },
      ],
    },
    {
      id: 'asian',
      name: 'Asian',
      cvapPercent: 5,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 60, heritage: 33, independent: 7 },
      issuePriorities: [
        { issueId: 'business-regulation', weight: 1.2 },
        { issueId: 'taxes-spending', weight: 1.1 },
        { issueId: 'health-coverage', weight: 1.0 },
      ],
    },
    {
      id: 'native',
      name: 'Native American',
      cvapPercent: 1,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 58, heritage: 34, independent: 8 },
      issuePriorities: [
        { issueId: 'state-federal', weight: 1.3 },
        { issueId: 'health-coverage', weight: 1.1 },
        { issueId: 'climate-action', weight: 1.0 },
      ],
    },
    {
      id: 'multiracial',
      name: 'Multiracial',
      cvapPercent: 2,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 62, heritage: 30, independent: 8 },
      issuePriorities: [
        { issueId: 'climate-action', weight: 1.2 },
        { issueId: 'lgbtq-policy', weight: 1.1 },
        { issueId: 'voting-rules', weight: 1.0 },
      ],
    },
  ];

  function buildById(groups) {
    return Object.fromEntries(groups.map((g) => [g.id, { ...g }]));
  }

  function cloneDefaultDemographicConfig() {
    const groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
    return {
      version: '0.10',
      description: 'Census CVAP demographic electorate model with group-specific voting elasticity and baseline leanings.',
      groups,
      byId: buildById(groups),
      nationalCvapShares: {
        white: 0.65,
        hispanic: 0.14,
        black: 0.13,
        asian: 0.05,
        nativeAmerican: 0.01,
        multiracial: 0.02,
      },
      elasticityMultipliers: {
        white: 1.45,
        hispanic: 1.15,
        black: 0.75,
        asian: 1.10,
        nativeAmerican: 1.05,
        multiracial: 1.20,
      },
      groupBaselines: {
        white: { people: 40, heritage: 52, independent: 38, liberty: 3, green: 1, other: 4 },
        black: { people: 82, heritage: 11, independent: 24, liberty: 1, green: 2, other: 4 },
        hispanic: { people: 56, heritage: 36, independent: 34, liberty: 2, green: 2, other: 4 },
        asian: { people: 60, heritage: 33, independent: 35, liberty: 2, green: 2, other: 3 },
        nativeAmerican: { people: 58, heritage: 34, independent: 30, liberty: 3, green: 3, other: 2 },
        multiracial: { people: 62, heritage: 30, independent: 38, liberty: 3, green: 3, other: 2 },
      },
      groupPriorities: {
        white: ['cost-of-living', 'taxes-spending', 'border-enforcement', 'business-regulation'],
        black: ['racial-equity', 'criminal-justice-reform', 'voting-rules', 'health-coverage', 'minimum-wage'],
        hispanic: ['cost-of-living', 'immigration-visas', 'health-coverage', 'minimum-wage'],
        asian: ['business-regulation', 'taxes-spending', 'health-coverage'],
        nativeAmerican: ['state-federal', 'health-coverage', 'climate-action'],
        multiracial: ['climate-action', 'lgbtq-policy', 'voting-rules'],
      },
      cloneDefaultDemographicConfig,
      updateGroupAffiliationShare,
    };
  }

  function updateGroupAffiliationShare(config, groupId, partyId, value) {
    const next = JSON.parse(JSON.stringify(config));
    const targetGroup = next.groups.find((g) => g.id === groupId);
    if (!targetGroup) return next;
    const clampedVal = Math.max(0, Math.min(100, Number(value) || 0));
    const otherParties = Object.keys(targetGroup.baselinePartyShare).filter((p) => p !== partyId);
    const otherTotal = otherParties.reduce((sum, p) => sum + (targetGroup.baselinePartyShare[p] || 0), 0);
    const remaining = Math.max(0, 100 - clampedVal);
    targetGroup.baselinePartyShare[partyId] = clampedVal;
    if (otherTotal > 0) {
      otherParties.forEach((p) => {
        targetGroup.baselinePartyShare[p] = Math.round((targetGroup.baselinePartyShare[p] / otherTotal) * remaining * 10) / 10;
      });
      const currentSum = Object.values(targetGroup.baselinePartyShare).reduce((a, b) => a + b, 0);
      const diff = 100 - currentSum;
      if (otherParties.length > 0) {
        targetGroup.baselinePartyShare[otherParties[0]] = Math.round((targetGroup.baselinePartyShare[otherParties[0]] + diff) * 10) / 10;
      }
    } else {
      const split = remaining / (otherParties.length || 1);
      otherParties.forEach((p) => {
        targetGroup.baselinePartyShare[p] = split;
      });
    }
    next.byId = buildById(next.groups);
    next.cloneDefaultDemographicConfig = cloneDefaultDemographicConfig;
    next.updateGroupAffiliationShare = updateGroupAffiliationShare;
    return next;
  }

  const DEMOGRAPHIC_CONFIG = cloneDefaultDemographicConfig();

  // ============================================================================
  // MULTI-CYCLE MIGRATION & GENERATIONAL TURNOVER ENGINE (Chunk 5.2 - 5.4)
  // ============================================================================

  function hashSeed(str) {
    let value = 2166136261;
    for (let i = 0; i < str.length; i++) {
      value ^= str.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return (value >>> 0) / 4294967295;
  }

  function getMigrationPatternsCatalog() {
    if (typeof window !== 'undefined' && window.PartyChairData?.MIGRATION_PATTERNS) {
      return window.PartyChairData.MIGRATION_PATTERNS;
    }
    if (typeof require !== 'undefined') {
      try {
        const migData = require('./demographic-migration-data.js');
        if (migData?.MIGRATION_PATTERNS) return migData.MIGRATION_PATTERNS;
      } catch {}
    }
    return [];
  }

  function getGenerationalCohortsCatalog() {
    if (typeof window !== 'undefined' && window.PartyChairData?.GENERATIONAL_COHORTS) {
      return window.PartyChairData.GENERATIONAL_COHORTS;
    }
    if (typeof require !== 'undefined') {
      try {
        const migData = require('./demographic-migration-data.js');
        if (migData?.GENERATIONAL_COHORTS) return migData.GENERATIONAL_COHORTS;
      } catch {}
    }
    return {};
  }

  /**
   * Select 3 to 6 active migration patterns deterministically based on seed, cycle year, and macro environment.
   */
  function selectDeterministicMigrationPatterns(seed = 2028, year = 2028, macroEnv = 0, count = null) {
    const catalog = getMigrationPatternsCatalog();
    if (!catalog || catalog.length === 0) return [];

    const baseSeedStr = `${seed}:${year}:interstate-migration`;
    const numPatterns = count || (3 + Math.floor(hashSeed(`${baseSeedStr}:count`) * 4)); // 3 to 6

    const scored = catalog.map((p, idx) => {
      let weight = 1.0;
      const trendStr = (p.trend || '').toLowerCase();
      if (trendStr.includes('sun belt') || trendStr === 'sun_belt_boom') {
        weight *= (macroEnv > 0 ? 1.25 : 1.0);
      } else if (trendStr.includes('rust belt') || trendStr === 'rust_belt_outmigration') {
        weight *= (macroEnv < 0 ? 1.25 : 1.0);
      } else if (trendStr.includes('cost-of-living') || trendStr === 'climate_cost_of_living') {
        weight *= 1.1;
      }
      const randRoll = hashSeed(`${baseSeedStr}:${p.id || idx}`);
      return { pattern: p, score: randRoll * weight };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, numPatterns).map((s) => s.pattern);
  }

  /**
   * Apply interstate migration vectors to voterModel with STRICT NET 0 VARIANCE.
   * Every single represented voter gained by destStates is deducted from originStates.
   */
  function applyInterstateMigration(voterModel, activePatterns = []) {
    if (!voterModel || !Array.isArray(voterModel.states) || !Array.isArray(activePatterns) || activePatterns.length === 0) {
      return { voterModel, transferredTotal: 0, appliedPatterns: [] };
    }

    const stateMap = new Map();
    voterModel.states.forEach((st) => {
      stateMap.set(st.stateId || st.id, st);
    });

    let transferredTotal = 0;
    const appliedPatterns = [];

    activePatterns.forEach((pat) => {
      const origins = (pat.originStates || []).filter((id) => stateMap.has(id));
      const dests = (pat.destStates || []).filter((id) => stateMap.has(id));
      if (origins.length === 0 || dests.length === 0) return;

      const baseVolume = Number(pat.voterVolume) || 30000;
      // Apportion volume across origins and dests
      const volumePerPair = Math.max(500, Math.floor(baseVolume / (origins.length * dests.length)));

      let patternNetTransferred = 0;

      origins.forEach((origId) => {
        const origState = stateMap.get(origId);
        dests.forEach((destId) => {
          if (origId === destId) return;
          const destState = stateMap.get(destId);

          // Check origin has enough represented voters (keep at least 100k)
          const origVoters = Number(origState.representedVoters || 0);
          const actualTransfer = Math.min(volumePerPair, Math.max(0, origVoters - 100000));
          if (actualTransfer <= 0) return;

          // 1. Deduct strictly from originState
          origState.representedVoters = Math.max(0, origVoters - actualTransfer);
          origState.sampleVoters = (voterModel.voterScale === '1:1' || Number(voterModel.sampleVoters || 0) >= 10000000)
            ? origState.representedVoters
            : Math.round(origState.representedVoters / 100);

          // 2. Add strictly to destState
          const destVoters = Number(destState.representedVoters || 0);
          destState.representedVoters = destVoters + actualTransfer;
          destState.sampleVoters = (voterModel.voterScale === '1:1' || Number(voterModel.sampleVoters || 0) >= 10000000)
            ? destState.representedVoters
            : Math.round(destState.representedVoters / 100);

          // 3. Faction & Affiliation shift in destination state based on pattern skew
          const skew = pat.ideologicalSkew || {};
          const affinities = skew.factionAffinities || {};
          const affKeys = Object.keys(affinities);

          if (destState.factions && affKeys.length > 0) {
            const transferPerFaction = Math.max(10, Math.floor(actualTransfer / affKeys.length));
            affKeys.forEach((fid) => {
              destState.factions[fid] = (destState.factions[fid] || 0) + transferPerFaction;
            });
          }

          // Bug #1: Adjust origin state base affiliations (excluding derived 'thirdParty' rollup) & preserve third-party share on destination
          const THIRD_KEYS = ['liberty', 'green', 'constitution', 'socialist', 'other'];
          const deductedByThird = {};
          let totalDeductedThird = 0;
          const is1to1Mig = (voterModel.voterScale === '1:1' || Number(voterModel.sampleVoters || 0) >= 10000000);
          const transferSample = is1to1Mig ? actualTransfer : Math.round(actualTransfer / 100);

          if (origState.affiliations) {
            const baseKeys = Object.keys(origState.affiliations).filter((k) => k !== 'thirdParty');
            const sumBase = baseKeys.reduce((a, k) => a + Number(origState.affiliations[k] || 0), 0) || 1;
            const affRatio = Math.min(0.95, transferSample / sumBase);
            let totalDeducted = 0;
            baseKeys.forEach((pk) => {
              const currentAff = Number(origState.affiliations[pk] || 0);
              const deduct = Math.min(currentAff, Math.round(currentAff * affRatio));
              origState.affiliations[pk] = Math.max(0, currentAff - deduct);
              totalDeducted += deduct;
              if (THIRD_KEYS.includes(pk)) {
                deductedByThird[pk] = (deductedByThird[pk] || 0) + deduct;
                totalDeductedThird += deduct;
              }
            });
            const origRem = transferSample - totalDeducted;
            if (origRem !== 0 && origState.affiliations.independent !== undefined) {
              origState.affiliations.independent = Math.max(0, Number(origState.affiliations.independent || 0) - origRem);
            }
            if (origState.affiliations.thirdParty !== undefined) {
              origState.affiliations.thirdParty = THIRD_KEYS.reduce((s, tk) => s + Number(origState.affiliations[tk] || 0), 0);
            }
          }

          // Adjust destination state affiliations (crediting transferred thirdParty share so conservation holds 100%)
          if (destState.affiliations) {
            const econDelta = Number(skew.econDelta || 0);
            const isMoreLeft = econDelta < 0;
            const targetParty = isMoreLeft ? 'people' : 'heritage';
            const remainingForMajorInd = Math.max(0, transferSample - totalDeductedThird);
            const bonusParty = Math.round(remainingForMajorInd * 0.45);
            const indParty = Math.round(remainingForMajorInd * 0.35);
            const otherParty = Math.max(0, remainingForMajorInd - bonusParty - indParty);

            destState.affiliations[targetParty] = (destState.affiliations[targetParty] || 0) + bonusParty;
            destState.affiliations.independent = (destState.affiliations.independent || 0) + indParty;
            const counterParty = targetParty === 'people' ? 'heritage' : 'people';
            destState.affiliations[counterParty] = (destState.affiliations[counterParty] || 0) + otherParty;
            THIRD_KEYS.forEach((tk) => {
              if (deductedByThird[tk]) {
                destState.affiliations[tk] = (destState.affiliations[tk] || 0) + deductedByThird[tk];
              }
            });
            if (destState.affiliations.thirdParty !== undefined) {
              destState.affiliations.thirdParty = THIRD_KEYS.reduce((s, tk) => s + Number(destState.affiliations[tk] || 0), 0);
            }
          }

          patternNetTransferred += actualTransfer;
          transferredTotal += actualTransfer;
        });
      });

      appliedPatterns.push({
        id: pat.id,
        name: pat.name,
        trend: pat.trend,
        transferred: patternNetTransferred,
        origins,
        dests,
      });
    });

    // Preserve current electorate total (supports ~3%/cycle population growth) with exact zero-variance conservation
    const migTargetTotal = Number(voterModel.representedVoters || 155000000);
    renormalizeElectorateHareNiemeyer(voterModel, migTargetTotal);

    return { voterModel, transferredTotal, appliedPatterns };
  }

  /**
   * Apply generational cohort aging turnover at 4-year presidential election boundaries.
   * - Silent / Older Boomers: Mortality attrition (-1.5% per cycle).
   * - Gen Z: High youth climate & tech progressive/libertarian salience.
   * - Gen Alpha: Enters electorate starting at 2030, swelling independent, technocratic, and minor-party factions.
   */
  function applyGenerationalTurnover(voterModel, year = 2028) {
    if (!voterModel || !Array.isArray(voterModel.states)) return voterModel;

    const cohorts = getGenerationalCohortsCatalog();
    const isGenAlphaActive = year >= 2030;
    const is1to1 = (voterModel.voterScale === '1:1' || Number(voterModel.sampleVoters || 0) >= 10000000);
    const divScale = is1to1 ? 1 : 100;

    voterModel.states.forEach((st) => {
      const stateVoters = Number(st.representedVoters || 0);
      if (stateVoters <= 0) return;

      // Turnover volume per state at 4-year cycle (~1.5% of electorate turnover)
      const turnoverVoters = Math.round(stateVoters * 0.015);
      const turnoverScaled = Math.round(turnoverVoters / divScale);

      // 1. Shift from older traditional affiliations/factions
      if (st.factions) {
        const seniorFactions = cohorts.silent_boomers?.coreFactions || ['gop_faith_and_flag', 'gop_paleocons', 'dem_faith_based_liberals'];
        seniorFactions.forEach((fid) => {
          if (st.factions[fid]) {
            const deduct = Math.min(st.factions[fid], Math.round(turnoverVoters * 0.15));
            st.factions[fid] = Math.max(0, st.factions[fid] - deduct);
          }
        });

        // 2. Shift into Gen Z & Gen Alpha factions
        const youthFactions = isGenAlphaActive
          ? (cohorts.gen_alpha?.coreFactions || ['swg_technocrats', 'swg_girlypops', 'swg_podcast_bros', 'lib_ancaps', 'grn_yimby', 'dem_bernie_bros'])
          : (cohorts.gen_z?.coreFactions || ['dem_capital_l_left', 'dem_abundance', 'swg_technocrats', 'swg_podcast_bros', 'lib_true_libertarians']);

        const gainPerYouthFaction = Math.round(turnoverVoters / youthFactions.length);
        youthFactions.forEach((fid) => {
          st.factions[fid] = (st.factions[fid] || 0) + gainPerYouthFaction;
        });
      }

      // 3. Affiliation realignments: younger cohorts expand independent and third-party affiliations
      if (st.affiliations) {
        const indBonus = Math.round(turnoverScaled * (isGenAlphaActive ? 0.50 : 0.40));
        const thirdBonus = Math.round(turnoverScaled * (isGenAlphaActive ? 0.20 : 0.10));
        const duopolyDeduct = indBonus + thirdBonus;

        const demDeduct = Math.round(duopolyDeduct * 0.50);
        const repDeduct = duopolyDeduct - demDeduct;

        if (st.affiliations.people) {
          st.affiliations.people = Math.max(0, Number(st.affiliations.people || 0) - demDeduct);
        }
        if (st.affiliations.heritage) {
          st.affiliations.heritage = Math.max(0, Number(st.affiliations.heritage || 0) - repDeduct);
        }
        st.affiliations.independent = (Number(st.affiliations.independent || 0)) + indBonus;

        // Bug #1: Distribute 100% of thirdBonus across base third-party keys, then derive thirdParty rollup
        const libAdd = Math.round(thirdBonus * 0.45);
        const grnAdd = Math.round(thirdBonus * 0.30);
        const conAdd = Math.round(thirdBonus * 0.15);
        const socAdd = Math.max(0, thirdBonus - libAdd - grnAdd - conAdd);
        st.affiliations.liberty = (Number(st.affiliations.liberty || 0)) + libAdd;
        st.affiliations.green = (Number(st.affiliations.green || 0)) + grnAdd;
        st.affiliations.constitution = (Number(st.affiliations.constitution || 0)) + conAdd;
        st.affiliations.socialist = (Number(st.affiliations.socialist || 0)) + socAdd;
        st.affiliations.thirdParty = ['liberty', 'green', 'constitution', 'socialist', 'other']
          .reduce((s, tk) => s + Number(st.affiliations[tk] || 0), 0);
      }
    });

    // Zero-variance reconciliation preserving current electorate total
    const turnTargetTotal = Number(voterModel.representedVoters || 155000000);
    renormalizeElectorateHareNiemeyer(voterModel, turnTargetTotal);
    return voterModel;
  }

  /**
   * Hare-Niemeyer exact zero-variance renormalization across all 51 jurisdictions locking to targetTotal.
   */
  function renormalizeElectorateHareNiemeyer(voterModel, targetTotal = 155000000) {
    if (!voterModel || !Array.isArray(voterModel.states) || voterModel.states.length === 0) return voterModel;

    const currentTotal = voterModel.states.reduce((acc, st) => acc + Number(st.representedVoters || 0), 0);
    if (currentTotal <= 0) return voterModel;

    const entries = voterModel.states.map((st) => {
      const rawVal = Number(st.representedVoters || 0);
      const exact = (rawVal / currentTotal) * targetTotal;
      const integerPart = Math.floor(exact);
      const remainder = exact - integerPart;
      return { st, rawVal, exact, integerPart, remainder, assigned: integerPart };
    });

    const sumInteger = entries.reduce((acc, e) => acc + e.assigned, 0);
    const remainderToDistribute = targetTotal - sumInteger;

    entries.sort((a, b) => {
      if (Math.abs(b.remainder - a.remainder) > 1e-9) return b.remainder - a.remainder;
      if (b.rawVal !== a.rawVal) return b.rawVal - a.rawVal;
      return String(a.st.stateId || a.st.id).localeCompare(String(b.st.stateId || b.st.id));
    });

    for (let i = 0; i < remainderToDistribute && i < entries.length; i++) {
      entries[i].assigned += 1;
    }

    const is1to1 = (voterModel.voterScale === '1:1' || targetTotal >= 10000000);

    entries.forEach((e) => {
      const newStRep = e.assigned;
      const oldStRep = e.rawVal;
      e.st.representedVoters = newStRep;
      e.st.sampleVoters = is1to1 ? newStRep : Math.round(newStRep / 100);

      // Bug #1: Exclude derived 'thirdParty' rollup when reconciling state affiliations
      if (e.st.affiliations) {
        const THIRD_KEYS = ['liberty', 'green', 'constitution', 'socialist', 'other'];
        const affKeys = Object.keys(e.st.affiliations).filter((k) => k !== 'thirdParty');
        const affSum = affKeys.reduce((s, k) => s + Number(e.st.affiliations[k] || 0), 0);
        const affTarget = is1to1 ? newStRep : e.st.sampleVoters;
        const affDiff = affTarget - affSum;
        if (affDiff !== 0) {
          const targetAffKey = e.st.affiliations.independent !== undefined ? 'independent' : affKeys[0];
          if (targetAffKey) {
            e.st.affiliations[targetAffKey] = Math.max(0, Number(e.st.affiliations[targetAffKey] || 0) + affDiff);
          }
        }
        if (e.st.affiliations.thirdParty !== undefined) {
          e.st.affiliations.thirdParty = THIRD_KEYS.reduce((s, tk) => s + Number(e.st.affiliations[tk] || 0), 0);
        }
      }
    });

    voterModel.representedVoters = targetTotal;
    voterModel.sampleVoters = is1to1 ? targetTotal : Math.round(targetTotal / 100);

    // Reconcile national affiliation rollups from state totals
    if (voterModel.affiliations) {
      const mult = is1to1 ? 1 : 100;
      const THIRD_KEYS = ['liberty', 'green', 'constitution', 'socialist', 'other'];
      Object.keys(voterModel.affiliations).forEach((ak) => {
        if (ak === 'thirdParty') return;
        const sumA = voterModel.states.reduce((s, st) => s + Number(st.affiliations?.[ak] || 0), 0);
        if (voterModel.affiliations[ak] && typeof voterModel.affiliations[ak] === 'object') {
          voterModel.affiliations[ak].sampleVoters = sumA;
          voterModel.affiliations[ak].representedVoters = sumA * mult;
        }
      });
      if (voterModel.affiliations.thirdParty && typeof voterModel.affiliations.thirdParty === 'object') {
        const tpSum = voterModel.states.reduce((s, st) => s + THIRD_KEYS.reduce((ts, tk) => ts + Number(st.affiliations?.[tk] || 0), 0), 0);
        voterModel.affiliations.thirdParty.sampleVoters = tpSum;
        voterModel.affiliations.thirdParty.representedVoters = tpSum * mult;
        if (voterModel.affiliations.thirdParty.byParty) {
          THIRD_KEYS.forEach((tk) => {
            if (voterModel.affiliations.thirdParty.byParty[tk] !== undefined) {
              voterModel.affiliations.thirdParty.byParty[tk] = voterModel.states.reduce((s, st) => s + Number(st.affiliations?.[tk] || 0), 0);
            }
          });
        }
      }
    }

    return voterModel;
  }

  /**
   * ~3% per-cycle electorate population growth:
   * Parties register new voters during the cycle; any remaining demand up to +3%
   * flows into state independents & independent/swing factions during post-election realignment.
   */
  function applyCyclePopulationGrowth(voterModel, growthRate = 0.03, gameFactions = null) {
    if (!voterModel || !Array.isArray(voterModel.states) || voterModel.states.length === 0) return voterModel;
    const is1to1 = (voterModel.voterScale === '1:1' || Number(voterModel.sampleVoters || 0) >= 10000000);
    const mult = is1to1 ? 1 : 100;
    const currentTotal = voterModel.states.reduce((acc, st) => acc + Number(st.representedVoters || 0), 0);
    if (currentTotal <= 0) return voterModel;

    const prevBaseline = Number(voterModel.cycleBaselineVoters || currentTotal);
    const targetTotal = Math.round(prevBaseline * (1 + growthRate));
    const remainingDemand = Math.max(0, targetTotal - currentTotal);

    if (remainingDemand > 0) {
      const indFacIds = Array.isArray(gameFactions)
        ? gameFactions.filter((f) => f && (['independent', 'none', 'unaffiliated'].includes(f.partyId) || String(f.id).startsWith('swg_'))).map((f) => f.id)
        : [];
      let distributed = 0;
      voterModel.states.forEach((st, idx) => {
        const share = Number(st.representedVoters || 0) / currentTotal;
        const addRep = (idx === voterModel.states.length - 1)
          ? Math.max(0, remainingDemand - distributed)
          : Math.round(remainingDemand * share);
        distributed += addRep;
        if (addRep <= 0) return;

        st.representedVoters = Number(st.representedVoters || 0) + addRep;
        const addSample = is1to1 ? addRep : Math.round(addRep / mult);
        st.sampleVoters = Number(st.sampleVoters || 0) + addSample;
        st.affiliations = st.affiliations || {};
        st.affiliations.independent = Number(st.affiliations.independent || 0) + addSample;

        // Grow independent/swing factions proportionally to match remaining demand
        if (st.factions) {
          const stIndKeys = indFacIds.length
            ? indFacIds.filter((fid) => st.factions[fid] !== undefined)
            : Object.keys(st.factions).filter((fid) => String(fid).startsWith('swg_'));
          if (stIndKeys.length > 0) {
            const stIndSum = stIndKeys.reduce((s, fid) => s + Math.max(1, Number(st.factions[fid] || 0)), 0);
            let fDist = 0;
            stIndKeys.forEach((fid, fi) => {
              const fAdd = (fi === stIndKeys.length - 1)
                ? Math.max(0, addRep - fDist)
                : Math.round(addRep * (Math.max(1, Number(st.factions[fid] || 0)) / stIndSum));
              fDist += fAdd;
              st.factions[fid] = Number(st.factions[fid] || 0) + fAdd;
            });
          }
        }
      });
    }

    voterModel.cycleBaselineVoters = Math.max(targetTotal, currentTotal);
    renormalizeElectorateHareNiemeyer(voterModel, voterModel.cycleBaselineVoters);
    return voterModel;
  }

  const exportObj = {
    DEMOGRAPHIC_CONFIG,
    selectDeterministicMigrationPatterns,
    applyInterstateMigration,
    applyGenerationalTurnover,
    renormalizeElectorateHareNiemeyer,
    applyCyclePopulationGrowth,
  };

  if (typeof window !== 'undefined') {
    window.PartyChairData = window.PartyChairData || {};
    window.PartyChairData.DEMOGRAPHIC_CONFIG = DEMOGRAPHIC_CONFIG;
    window.PartyChairData.selectDeterministicMigrationPatterns = selectDeterministicMigrationPatterns;
    window.PartyChairData.applyInterstateMigration = applyInterstateMigration;
    window.PartyChairData.applyGenerationalTurnover = applyGenerationalTurnover;
    window.PartyChairData.renormalizeElectorateHareNiemeyer = renormalizeElectorateHareNiemeyer;
    window.PartyChairData.applyCyclePopulationGrowth = applyCyclePopulationGrowth;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportObj;
  }
})();