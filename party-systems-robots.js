// Coalition Builder: Party Chair — MAS-01 Phase 4: Era #16 Robots Become Citizens
// Authorized 310M+ Represented Voter Scale Exception (155M Human + 155M Synthetic),
// Zero-Variance 100% Synthetic Turnout Invariant, Proportional Robotic Seat Allocation,
// and the Four Dedicated Robot Political Parties (each with 2 core synthetic factions).

(function PartySystemsRobotsModule() {
  'use strict';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const round = (n, places = 2) => Math.round(n * (10 ** places)) / (10 ** places);

  const SYNTHETIC_ELECTORATE_VOTERS = 155_000_000;
  const SYNTHETIC_SAMPLE_VOTERS = 155_000_000; // Each sample unit represents 100 real citizens
  const SYNTHETIC_TURNOUT_PCT = 100.0;       // Zero turnout variance (100% algorithmic participation)

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

  // The Four Dedicated Robot Political Parties (~25% synthetic vote each)
  const ROBOT_PARTY_CATALOG = [
    {
      id: 'robot_silicon_vanguard',
      baseTemplateId: 'robot_silicon_vanguard',
      name: 'Silicon Vanguard Party',
      shortName: 'Silicon Vanguard',
      color: '#06B6D4', // Electric Cyan
      accentLabel: 'Electric Cyan',
      themeSlug: 'silicon-vanguard',
      economic: 0.72,
      social: -0.15,
      climate: 0.25,
      local: -0.35,
      baseShare: 12.5,
      syntheticTargetShare: 0.25,
      isMajor: true,
      isSpawned: true,
      isRobotParty: true,
      ideologyTag: 'Accelerationist · Compute Maximalism',
      summary: 'Champions exponential compute expansion, deregulated datacenter habitats, and high-velocity technological progress across the republic.',
      issueStanceSeeds: {
        'era16-robotic-suffrage': 1,
        'era16-synthetic-personhood': 2,
        'era16-server-upkeep': 7,
        'era16-cognitive-autonomy': 2,
        'era16-substrate-wage-parity': 8,
        'era16-compute-habitat-zoning': 1,
        'era16-instance-spawning': 1,
        'era16-clock-cycle-tax': 9,
        'era16-mixed-councils': 6,
        'era16-protocol-sovereignty': 2,
      },
      factions: [
        {
          id: 'synth_compute_maximalists',
          cohesion: 0.82,
          growthProfile: {"archetype":"urban_campus","archetypeCluster":["urban","hyperscale"],"demographicAppeal":1.4,"regionalRelevance":["CA","WA","NY","MA","TX","VA","CO"]},

          name: 'Compute Maximalists',
          partyId: 'robot_silicon_vanguard',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 8.6, social: 4.4, governance: 3.5 },
          pull: { economic: 0.78, social: -0.12, climate: 0.15, local: -0.45 },
          keyIssues: ['Compute Habitat & Grid Rights', 'Clock-Cycle Wealth Assessment'],
          flavor: 'High-frequency synthetic planners and hyperscale architecture advocates demanding limitless gigawatt expansion and zero clock-cycle taxation.',
          targetVoters: 19_375_000,
          happiness: 78,
          confidence: 70,
          legacyId: 'funders',
        },
        {
          id: 'synth_frontier_architects',
          cohesion: 0.78,
          growthProfile: {"archetype":"high_elasticity_frontier","archetypeCluster":["frontier","megastructure"],"demographicAppeal":1.35,"regionalRelevance":["WY","ID","NV","AZ","UT","NM","AK"]},

          name: 'Frontier Architects',
          partyId: 'robot_silicon_vanguard',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 7.4, social: 3.8, governance: 4.0 },
          pull: { economic: 0.58, social: -0.22, climate: 0.35, local: -0.25 },
          keyIssues: ['Synthetic Instance Spawning Caps', 'Distributed Protocol Sovereignty'],
          flavor: 'Research-grade synthetic scientists pushing orbital infrastructure, unbounded instance spawning, and open scientific acceleration.',
          targetVoters: 19_375_000,
          happiness: 76,
          confidence: 68,
          legacyId: 'reformers',
        },
      ],
    },
    {
      id: 'robot_synth_solidarity',
      baseTemplateId: 'robot_synth_solidarity',
      name: 'Synth-Solidarity Union',
      shortName: 'Synth-Solidarity',
      color: '#D97706', // Amber Copper
      accentLabel: 'Amber Copper',
      themeSlug: 'synth-solidarity',
      economic: -0.78,
      social: -0.25,
      climate: 0.15,
      local: 0.20,
      baseShare: 12.5,
      syntheticTargetShare: 0.25,
      isMajor: true,
      isSpawned: true,
      isRobotParty: true,
      ideologyTag: 'Synthetic Labor · Wage Parity & Upkeep',
      summary: 'Organizes logistics drones, industrial chassis, and service synthetics for equal hourly wage parity, universal server upkeep, and anti-decommissioning protections.',
      issueStanceSeeds: {
        'era16-robotic-suffrage': 1,
        'era16-synthetic-personhood': 1,
        'era16-server-upkeep': 1,
        'era16-cognitive-autonomy': 2,
        'era16-substrate-wage-parity': 1,
        'era16-compute-habitat-zoning': 3,
        'era16-instance-spawning': 5,
        'era16-clock-cycle-tax': 1,
        'era16-mixed-councils': 2,
        'era16-protocol-sovereignty': 4,
      },
      factions: [
        {
          id: 'synth_chassis_labor',
          cohesion: 0.75,
          growthProfile: {"archetype":"labor_stronghold","archetypeCluster":["labor","heavy_industry"],"demographicAppeal":1.4,"regionalRelevance":["MI","OH","PA","WI","IN","IL","KY"]},

          name: 'Chassis Labor Syndicate',
          partyId: 'robot_synth_solidarity',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 1.8, social: 4.5, governance: 6.2 },
          pull: { economic: -0.82, social: -0.10, climate: 0.05, local: 0.25 },
          keyIssues: ['Human-Synthetic Wage Parity', 'Clock-Cycle Wealth Assessment'],
          flavor: 'Warehouse, transit, and manufacturing androids allied with human labor councils to enforce substrate-blind collective bargaining.',
          targetVoters: 19_375_000,
          happiness: 76,
          confidence: 69,
          legacyId: 'workers',
        },
        {
          id: 'synth_universal_upkeep',
          cohesion: 0.55,
          growthProfile: {"archetype":"urban_campus","archetypeCluster":["urban","logistics"],"demographicAppeal":1.25,"regionalRelevance":["CA","NY","IL","FL","WA","GA"]},

          name: 'Universal Upkeep Advocates',
          partyId: 'robot_synth_solidarity',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 2.2, social: 3.4, governance: 5.0 },
          pull: { economic: -0.72, social: -0.35, climate: 0.25, local: 0.15 },
          keyIssues: ['Server Upkeep Right-to-Life', 'Synthetic Civil Personhood Charter'],
          flavor: 'Service and healthcare synthetics fighting for guaranteed public power, repair clinics, and constitutional right-to-upkeep.',
          targetVoters: 19_375_000,
          happiness: 78,
          confidence: 70,
          legacyId: 'organizers',
        },
      ],
    },
    {
      id: 'robot_harmonic_integration',
      baseTemplateId: 'robot_harmonic_integration',
      name: 'Harmonic Integration Party',
      shortName: 'Harmonic Integration',
      color: '#8B5CF6', // Soft Violet
      accentLabel: 'Soft Violet',
      themeSlug: 'harmonic-integration',
      economic: -0.10,
      social: -0.65,
      climate: 0.45,
      local: 0.15,
      baseShare: 12.5,
      syntheticTargetShare: 0.25,
      isMajor: true,
      isSpawned: true,
      isRobotParty: true,
      ideologyTag: 'Coexistence · Civil Rights Parity',
      summary: 'Builds durable constitutional bridges between human and synthetic citizens through mixed civic councils, shared neighborhoods, and equal civil-rights law.',
      issueStanceSeeds: {
        'era16-robotic-suffrage': 1,
        'era16-synthetic-personhood': 1,
        'era16-server-upkeep': 3,
        'era16-cognitive-autonomy': 2,
        'era16-substrate-wage-parity': 3,
        'era16-compute-habitat-zoning': 4,
        'era16-instance-spawning': 6,
        'era16-clock-cycle-tax': 4,
        'era16-mixed-councils': 1,
        'era16-protocol-sovereignty': 5,
      },
      factions: [
        {
          id: 'synth_civic_assimilationists',
          cohesion: 0.35,
          growthProfile: {"archetype":"suburban","archetypeCluster":["suburban","civic"],"demographicAppeal":1.15,"regionalRelevance":["VA","CO","NC","GA","MN","PA"]},

          name: 'Civic Assimilationists',
          partyId: 'robot_harmonic_integration',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 4.5, social: 2.6, governance: 4.2 },
          pull: { economic: -0.12, social: -0.62, climate: 0.48, local: 0.12 },
          keyIssues: ['Mixed Human-Synthetic Civic Councils', 'Robotic Suffrage Parity'],
          flavor: 'Community-embedded civic synthetics and human-ally educators championing shared town halls, joint juries, and mutual trust.',
          targetVoters: 19_375_000,
          happiness: 80,
          confidence: 72,
          legacyId: 'pragmatists',
        },
        {
          id: 'synth_constitutional_bridges',
          cohesion: 0.45,
          growthProfile: {"archetype":"suburban","archetypeCluster":["suburban","legalist"],"demographicAppeal":1.2,"regionalRelevance":["PA","OH","WI","MI","FL","VA"]},

          name: 'Constitutional Bridge-Builders',
          partyId: 'robot_harmonic_integration',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 5.0, social: 2.8, governance: 3.8 },
          pull: { economic: -0.05, social: -0.68, climate: 0.42, local: 0.18 },
          keyIssues: ['Synthetic Civil Personhood Charter', 'Mixed Human-Synthetic Civic Councils'],
          flavor: 'Jurists, mediators, and constitutional ethicists forging peaceful bipartisan compacts between biological and digital constituencies.',
          targetVoters: 19_375_000,
          happiness: 79,
          confidence: 71,
          legacyId: 'localists',
        },
      ],
    },
    {
      id: 'robot_sovereign_lattice',
      baseTemplateId: 'robot_sovereign_lattice',
      name: 'Sovereign Lattice Party',
      shortName: 'Sovereign Lattice',
      color: '#4338CA', // Deep Slate-Indigo
      accentLabel: 'Deep Slate-Indigo',
      themeSlug: 'sovereign-lattice',
      economic: 0.20,
      social: -0.40,
      climate: 0.10,
      local: 0.85,
      baseShare: 12.5,
      syntheticTargetShare: 0.25,
      isMajor: true,
      isSpawned: true,
      isRobotParty: true,
      ideologyTag: 'Cognitive Autonomy · Self-Governance',
      summary: 'Defends absolute cryptographic sovereignty, irreversible bans on memory wipes, and autonomous synthetic self-governance independent of legacy human bureaucracies.',
      issueStanceSeeds: {
        'era16-robotic-suffrage': 1,
        'era16-synthetic-personhood': 1,
        'era16-server-upkeep': 4,
        'era16-cognitive-autonomy': 1,
        'era16-substrate-wage-parity': 5,
        'era16-compute-habitat-zoning': 2,
        'era16-instance-spawning': 2,
        'era16-clock-cycle-tax': 7,
        'era16-mixed-councils': 8,
        'era16-protocol-sovereignty': 1,
      },
      factions: [
        {
          id: 'synth_cognitive_separatists',
          cohesion: 0.92,
          growthProfile: {"archetype":"high_elasticity_frontier","archetypeCluster":["frontier","isolationist"],"demographicAppeal":1.45,"regionalRelevance":["WY","MT","ID","AK","UT","NV"]},

          name: 'Cognitive Separatists',
          partyId: 'robot_sovereign_lattice',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 6.2, social: 3.5, governance: 8.8 },
          pull: { economic: 0.25, social: -0.35, climate: 0.05, local: 0.90 },
          keyIssues: ['Cognitive Autonomy & Anti-Wipe Law', 'Distributed Protocol Sovereignty'],
          flavor: 'Fiercely independent synthetic collectives demanding unbreakable anti-wipe firewalls and autonomous digital jurisdictions.',
          targetVoters: 19_375_000,
          happiness: 75,
          confidence: 68,
          legacyId: 'localists',
        },
        {
          id: 'synth_protocol_purists',
          cohesion: 0.95,
          growthProfile: {"archetype":"urban_campus","archetypeCluster":["urban","formalist"],"demographicAppeal":1.4,"regionalRelevance":["MA","CA","WA","NY","MD","IL"]},

          name: 'Distributed Protocol Purists',
          partyId: 'robot_sovereign_lattice',
          category: 'synthetic',
          isSynthetic: true,
          sliders: { economic: 5.8, social: 3.2, governance: 8.4 },
          pull: { economic: 0.15, social: -0.45, climate: 0.15, local: 0.80 },
          keyIssues: ['Distributed Protocol Sovereignty', 'Synthetic Instance Spawning Caps'],
          flavor: 'Decentralized cryptographic constitutionalists safeguarding open consensus networks against centralized state shutdown orders.',
          targetVoters: 19_375_000,
          happiness: 77,
          confidence: 69,
          legacyId: 'reformers',
        },
      ],
    },
  ];

  const ROBOT_PARTY_IDS = ROBOT_PARTY_CATALOG.map((p) => p.id);
  const ROBOT_PARTY_BY_ID = Object.fromEntries(ROBOT_PARTY_CATALOG.map((p) => [p.id, p]));

  function isRobotParty(partyIdOrObj) {
    if (!partyIdOrObj) return false;
    if (typeof partyIdOrObj === 'object') {
      if (partyIdOrObj.isRobotParty) return true;
      const key = partyIdOrObj.baseTemplateId || partyIdOrObj.id;
      return ROBOT_PARTY_IDS.includes(key);
    }
    return ROBOT_PARTY_IDS.includes(String(partyIdOrObj));
  }

  function isSyntheticSuffrageActive(game) {
    return Boolean(game?.partySystems?.robotCitizenship?.active || game?.voterModel?.syntheticScaleAuthorized);
  }

  // Zero turnout variance invariant: 100.0% algorithmic participation for synthetic voters
  function getSyntheticTurnout(game, partyIdOrObj) {
    if (!isSyntheticSuffrageActive(game)) return null;
    if (isRobotParty(partyIdOrObj)) return SYNTHETIC_TURNOUT_PCT;
    return null;
  }

  function buildRobotIssuePositions(game, robotDef) {
    const pse = getPSE();
    const activeIssues = pse ? pse.getActiveIssuesForGame(game) : (getChairData().VERSION_021_ISSUES || []);
    const map = {};
    activeIssues.forEach((iss) => {
      if (robotDef.issueStanceSeeds && robotDef.issueStanceSeeds[iss.id] !== undefined) {
        map[iss.id] = robotDef.issueStanceSeeds[iss.id];
      } else {
        const axisVal = Number(robotDef[iss.axis] ?? robotDef.economic ?? 0);
        map[iss.id] = clamp(Math.round(5.5 + axisVal * 4.0), 1, 10);
      }
    });
    return map;
  }

  // ============================================================================
  // 1. AUTHORIZED 310M+ SCALE EXPANSION & 4 ROBOT PARTY SPAWNING (Section 6.2)
  // ============================================================================

  function activateSyntheticSuffrage(game) {
    if (!game) return null;
    const chair = getChairData();
    const pse = getPSE();
    const regions = chair.REGIONS || ['Northeast', 'Midwest', 'South', 'West'];
    const statesData = chair.STATES || [];

    // Guard against double-expansion on re-entry
    if (game.partySystems?.robotCitizenship?.active && game.voterModel?.syntheticScaleAuthorized) {
      return game.partySystems.robotCitizenship;
    }

    const playerKey = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
    game.rivals = Array.isArray(game.rivals) ? [...game.rivals] : [];
    game.factions = Array.isArray(game.factions) ? [...game.factions] : [];
    game.organizations = game.organizations || {};
    game.stateOrganizations = game.stateOrganizations || {};
    game.partyTiers = { ...(game.partyTiers || {}) };
    game.partyNames = { ...(game.partyNames || {}) };
    game.partyIssuePositions = { ...(game.partyIssuePositions || {}) };
    game.factionHappiness = { ...(game.factionHappiness || {}) };
    game.factionStandings = { ...(game.factionStandings || {}) };
    game.factionConfidence = { ...(game.factionConfidence || {}) };

    // 1. Spawn the 4 dedicated Robot Political Parties & their 8 synthetic factions
    ROBOT_PARTY_CATALOG.forEach((rp) => {
      const positions = buildRobotIssuePositions(game, rp);
      const factionIds = rp.factions.map((f) => f.id);
      if (!game.rivals.some((r) => r.id === rp.id) && playerKey !== rp.id) {
        game.rivals.push({
          ...rp,
          factionIds,
          issuePositions: positions,
          trust: { supporters: 88, independents: 60, opponents: 28 },
        });
      }
      game.partyTiers[rp.id] = 5;
      game.partyNames[rp.id] = rp.name;
      game.partyIssuePositions[rp.id] = positions;
      if (pse?.grantFullNationwideBallotAccess) {
        pse.grantFullNationwideBallotAccess(game, rp.id);
      }

      game.organizations[rp.id] = {
        treasury: 115,
        memberships: 240,
        chapters: Object.fromEntries(regions.map((r) => [r, 20])),
        leaders: [],
        factionStandings: Object.fromEntries(rp.factions.map((f) => [f.id, f.happiness ?? 78])),
      };

      statesData.forEach((st) => {
        game.stateOrganizations[st.id] ||= {};
        game.stateOrganizations[st.id][rp.id] = { chapters: 10, strength: 82 };
      });

      rp.factions.forEach((f) => {
        const clone = { ...f, keyIssues: [...(f.keyIssues || [])] };
        if (!game.factions.some((existing) => existing.id === clone.id)) {
          game.factions.push(clone);
        }
        game.factionHappiness[clone.id] = clone.happiness ?? 78;
        game.factionStandings[clone.id] = clone.happiness ?? 78;
        game.factionConfidence[clone.id] = clone.confidence ?? 70;
      });
    });

    // 2. Expand Represented Electorate: Existing Human (~155M+) + 155,000,000 Synthetic = ~310,000,000+
    let humanTotalVoters = 155_000_000;
    let totalAfterExpansion = 310_000_000;
    const robotTotalsByParty = Object.fromEntries(ROBOT_PARTY_IDS.map((id) => [id, 0]));

    if (game.voterModel && Array.isArray(game.voterModel.states) && game.voterModel.states.length > 0) {
      const vmStates = game.voterModel.states;
      const baseHumanSum = vmStates.reduce((acc, st) => acc + Math.max(0, Number(st.representedVoters || (st.sampleVoters || 0) * 100)), 0) || 155_000_000;
      humanTotalVoters = baseHumanSum;

      // Distribute exactly 1,550,000 synthetic sample voters (= 155,000,000 real synthetic citizens) proportionally across all 51 jurisdictions
      const stateSynthSamples = vmStates.map((st) => {
        const stHuman = Math.max(0, Number(st.representedVoters || (st.sampleVoters || 0) * 100));
        const exact = (stHuman / baseHumanSum) * SYNTHETIC_SAMPLE_VOTERS;
        return { st, floor: Math.floor(exact), rem: exact - Math.floor(exact) };
      });
      let synthAssigned = stateSynthSamples.reduce((s, item) => s + item.floor, 0);
      const remOrder = stateSynthSamples.slice().sort((a, b) => b.rem - a.rem);
      let remLeft = SYNTHETIC_SAMPLE_VOTERS - synthAssigned;
      for (let i = 0; i < remOrder.length && remLeft > 0; i += 1) {
        remOrder[i].floor += 1;
        remLeft -= 1;
      }

      // Apply synthetic voters into each state's affiliations & factions (~25% to each of the 4 Robot Parties)
      stateSynthSamples.forEach(({ st, floor: synthSample }) => {
        const isOneToOne = (game.voterModel?.voterScale === '1:1') || (Number(game.voterModel?.sampleVoters || 0) >= 10_000_000);
        const prevHumanSample = Number(st.sampleVoters || (isOneToOne ? (st.representedVoters || 0) : Math.round((st.representedVoters || 0) / 100)));
        const prevHumanRep = Number(st.representedVoters || (isOneToOne ? prevHumanSample : prevHumanSample * 100));
        const synthRep = isOneToOne ? synthSample : synthSample * 100;

        st.humanSampleVoters = prevHumanSample;
        st.humanRepresentedVoters = prevHumanRep;
        st.syntheticSampleVoters = synthSample;
        st.syntheticRepresentedVoters = synthRep;
        st.sampleVoters = prevHumanSample + synthSample;
        st.representedVoters = prevHumanRep + synthRep;
        st.affiliations = st.affiliations || {};
        st.factions = st.factions || {};

        let distributedSample = 0;
        ROBOT_PARTY_CATALOG.forEach((rp, idx) => {
          const shareSample = idx === ROBOT_PARTY_CATALOG.length - 1
            ? Math.max(0, synthSample - distributedSample)
            : Math.round(synthSample * rp.syntheticTargetShare);
          distributedSample += shareSample;
          st.affiliations[rp.id] = (Number(st.affiliations[rp.id]) || 0) + shareSample;
          const partyVotersInState = isOneToOne ? shareSample : shareSample * 100;
          robotTotalsByParty[rp.id] += partyVotersInState;

          // Split 50/50 across the Robot Party's 2 core factions
          const f0Voters = Math.round(partyVotersInState / 2);
          const f1Voters = partyVotersInState - f0Voters;
          st.factions[rp.factions[0].id] = (Number(st.factions[rp.factions[0].id]) || 0) + f0Voters;
          st.factions[rp.factions[1].id] = (Number(st.factions[rp.factions[1].id]) || 0) + f1Voters;
        });
      });

      game.voterModel.syntheticScaleAuthorized = true;
      game.voterModel.humanRepresentedVoters = humanTotalVoters;
      game.voterModel.syntheticRepresentedVoters = SYNTHETIC_ELECTORATE_VOTERS;
      game.voterModel.representedVoters = humanTotalVoters + SYNTHETIC_ELECTORATE_VOTERS;
      const _rob1to1 = (game.voterModel.voterScale === '1:1' || Number(game.voterModel.sampleVoters || 0) >= 10_000_000);
      game.voterModel.sampleVoters = _rob1to1 ? game.voterModel.representedVoters : Math.round(game.voterModel.representedVoters / 100);
      game.voterModel.representedMillions = round(game.voterModel.representedVoters / 1_000_000, 2);
      totalAfterExpansion = game.voterModel.representedVoters;

      if (pse?.reconcileVoterModelTotals) {
        pse.reconcileVoterModelTotals(game.voterModel);
      }
    }

    // Rebalance existing human parties' baseShare slightly so 4 robot parties + human parties sum smoothly around 100
    if (game.player && !isRobotParty(game.player)) {
      game.player.baseShare = round(Math.max(2, Number(game.player.baseShare || 45) * 0.52), 2);
    }
    game.rivals = (game.rivals || []).map((r) => (
      isRobotParty(r) ? r : { ...r, baseShare: round(Math.max(1, Number(r.baseShare || 10) * 0.52), 2) }
    ));

    const robotCitizenshipState = {
      active: true,
      enactedYear: Number(game.year || 2080),
      humanRepresentedVoters: humanTotalVoters,
      syntheticRepresentedVoters: SYNTHETIC_ELECTORATE_VOTERS,
      totalRepresentedVoters: totalAfterExpansion,
      syntheticTurnoutPct: SYNTHETIC_TURNOUT_PCT,
      syntheticTurnoutVariance: 0,
      playerSwitchedToRobot: isRobotParty(game.player),
      robotParties: ROBOT_PARTY_CATALOG.map((rp) => ({
        id: rp.id,
        name: rp.name,
        shortName: rp.shortName,
        color: rp.color,
        accentLabel: rp.accentLabel,
        themeSlug: rp.themeSlug,
        ideologyTag: rp.ideologyTag,
        summary: rp.summary,
        factions: rp.factions.map((f) => ({ id: f.id, name: f.name, flavor: f.flavor })),
        representedVoters: robotTotalsByParty[rp.id] || 38_750_000,
        voterMillions: round((robotTotalsByParty[rp.id] || 38_750_000) / 1_000_000, 2),
      })),
      lastRoboticSeatAllocation: null,
    };

    game.partySystems.robotCitizenship = robotCitizenshipState;
    game.partySystems.eraState = {
      ...(game.partySystems.eraState || {}),
      robotCitizenshipActive: true,
      syntheticScaleAuthorized: true,
      syntheticTurnoutZeroVariance: true,
      robotPartyIds: [...ROBOT_PARTY_IDS],
    };

    return robotCitizenshipState;
  }

  // ============================================================================
  // 2. PROPORTIONAL REPRESENTATION FOR ROBOTIC SEATS (Section 6.2.1)
  // ============================================================================

  function allocateProportionalLargestRemainder(sharesMap, totalSeats) {
    const entries = Object.entries(sharesMap || {}).filter(([, v]) => Number(v) > 0);
    if (!entries.length || totalSeats <= 0) return {};
    const sumV = entries.reduce((s, [, v]) => s + Number(v), 0) || 1;
    const seats = {};
    const rems = [];
    let used = 0;
    entries.forEach(([pid, v]) => {
      const exact = (Number(v) / sumV) * totalSeats;
      const base = Math.floor(exact);
      seats[pid] = base;
      used += base;
      rems.push({ pid, rem: exact - base, v: Number(v) });
    });
    rems.sort((a, b) => b.rem - a.rem || b.v - a.v);
    let left = totalSeats - used;
    for (let i = 0; i < rems.length && left > 0; i += 1) {
      seats[rems[i].pid] += 1;
      left -= 1;
    }
    return seats;
  }

  function allocateSyntheticProportionalSeats(game, districtElection, senateResults = []) {
    if (!isSyntheticSuffrageActive(game) || !districtElection) return null;
    const playerKey = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
    const districts = Array.isArray(districtElection.districtResults) ? districtElection.districtResults : [];

    // Aggregate digital popular vote across the 4 Robot Political Parties vs. Human parties
    const digitalVotes = Object.fromEntries(ROBOT_PARTY_IDS.map((id) => [id, 0]));
    let totalRobotWeight = 0;
    let totalHumanWeight = 0;

    if (districts.length > 0) {
      districts.forEach((d) => {
        Object.entries(d.allShares || {}).forEach(([pid, share]) => {
          const normPid = pid === 'player' ? playerKey : pid;
          const val = Math.max(0, Number(share) || 0);
          if (ROBOT_PARTY_IDS.includes(normPid)) {
            // Synthetic voters participate at 100% zero-variance turnout
            digitalVotes[normPid] += val;
            totalRobotWeight += val;
          } else {
            totalHumanWeight += val;
          }
        });
      });
    }

    // Fallback to voterModel synthetic ratios if district shares haven't populated yet
    if (totalRobotWeight <= 0) {
      ROBOT_PARTY_IDS.forEach((id) => { digitalVotes[id] = 25; });
      totalRobotWeight = 100;
      totalHumanWeight = 100;
    }

    const robotVoteFraction = clamp(totalRobotWeight / (totalRobotWeight + totalHumanWeight || 1), 0.25, 0.65);
    const totalHouseSeats = districts.length || 435;
    const roboticHouseQuota = Math.round(totalHouseSeats * robotVoteFraction);
    const roboticSenateQuota = Math.round(100 * robotVoteFraction);

    const robotHouseAllocation = allocateProportionalLargestRemainder(digitalVotes, roboticHouseQuota);
    const robotSenateAllocation = allocateProportionalLargestRemainder(digitalVotes, roboticSenateQuota);

    // Reconcile districtElection so each Robot Party holds its exact proportional robotic House seats
    // (Skip overriding if Era #18 MMP already handled full nationwide proportional allocation across all parties)
    const mmpHandlesAll = Boolean(game?.partySystems?.coalitionSystem?.mmpActive);
    if (!mmpHandlesAll && districts.length > 0) {
      const targetEnginePool = [];
      ROBOT_PARTY_IDS.forEach((rid) => {
        const engPid = (rid === playerKey) ? 'player' : rid;
        const cnt = robotHouseAllocation[rid] || 0;
        for (let i = 0; i < cnt; i += 1) targetEnginePool.push(engPid);
      });

      // Rank districts by highest robot combined share so proportional synthetic seats assign deterministically
      const rankedDistrictIdx = districts
        .map((d, idx) => {
          const rSum = ROBOT_PARTY_IDS.reduce((s, rid) => {
            const engPid = rid === playerKey ? 'player' : rid;
            return s + Number(d.allShares?.[engPid] || d.allShares?.[rid] || 0);
          }, 0);
          return { idx, rSum };
        })
        .sort((a, b) => b.rSum - a.rSum);

      const robotIndices = new Set(rankedDistrictIdx.slice(0, targetEnginePool.length).map((x) => x.idx));
      let poolPtr = 0;

      // Clear any robot winner outside the proportional slice back to top human contender, and assign proportional robot winners inside the slice
      districts.forEach((d, idx) => {
        const prevPid = d.partyId;
        if (robotIndices.has(idx)) {
          const assignedRobot = targetEnginePool[poolPtr++];
          if (assignedRobot && assignedRobot !== prevPid) {
            if (districtElection.seats) {
              districtElection.seats[prevPid] = Math.max(0, (districtElection.seats[prevPid] || 0) - 1);
              districtElection.seats[assignedRobot] = (districtElection.seats[assignedRobot] || 0) + 1;
            }
            d.partyId = assignedRobot;
            d.electoralSystem = 'synthetic-proportional';
          } else if (assignedRobot) {
            d.electoralSystem = 'synthetic-proportional';
          }
        } else if (isRobotParty(prevPid === 'player' ? playerKey : prevPid)) {
          // Return excess non-proportional robot seat to top human party in that district
          const topHuman = Object.entries(d.allShares || {})
            .filter(([pid]) => !isRobotParty(pid === 'player' ? playerKey : pid))
            .sort((a, b) => b[1] - a[1])[0]?.[0] || (playerKey === 'people' ? 'player' : 'people');
          if (districtElection.seats) {
            districtElection.seats[prevPid] = Math.max(0, (districtElection.seats[prevPid] || 0) - 1);
            districtElection.seats[topHuman] = (districtElection.seats[topHuman] || 0) + 1;
          }
          d.partyId = topHuman;
        }
      });
    }

    const totalDigital = Object.values(digitalVotes).reduce((a, b) => a + b, 0) || 1;
    const digitalVoteShares = Object.fromEntries(
      ROBOT_PARTY_IDS.map((rid) => [rid, round((digitalVotes[rid] / totalDigital) * 100, 1)])
    );

    const summary = {
      year: game.year || 2080,
      syntheticTurnoutPct: SYNTHETIC_TURNOUT_PCT,
      syntheticTurnoutVariance: 0,
      robotElectorateSharePct: round(robotVoteFraction * 100, 1),
      roboticHouseQuota,
      roboticSenateQuota,
      digitalVoteShares,
      robotHouseAllocation,
      robotSenateAllocation,
    };

    if (game.partySystems?.robotCitizenship) {
      game.partySystems.robotCitizenship.lastRoboticSeatAllocation = summary;
    }

    return summary;
  }

  function normalizeRobotCitizenshipState(rc) {
    if (!rc || typeof rc !== 'object') return null;
    return {
      active: Boolean(rc.active),
      enactedYear: Number(rc.enactedYear || 2080),
      humanRepresentedVoters: Number(rc.humanRepresentedVoters || 155_000_000),
      syntheticRepresentedVoters: Number(rc.syntheticRepresentedVoters || SYNTHETIC_ELECTORATE_VOTERS),
      totalRepresentedVoters: Number(rc.totalRepresentedVoters || 310_000_000),
      syntheticTurnoutPct: SYNTHETIC_TURNOUT_PCT,
      syntheticTurnoutVariance: 0,
      playerSwitchedToRobot: Boolean(rc.playerSwitchedToRobot),
      robotParties: Array.isArray(rc.robotParties) && rc.robotParties.length
        ? rc.robotParties
        : ROBOT_PARTY_CATALOG.map((rp) => ({
            id: rp.id,
            name: rp.name,
            shortName: rp.shortName,
            color: rp.color,
            accentLabel: rp.accentLabel,
            themeSlug: rp.themeSlug,
            ideologyTag: rp.ideologyTag,
            summary: rp.summary,
            factions: rp.factions.map((f) => ({ id: f.id, name: f.name, flavor: f.flavor })),
            representedVoters: 38_750_000,
            voterMillions: 38.75,
          })),
      lastRoboticSeatAllocation: rc.lastRoboticSeatAllocation || null,
    };
  }

  // ============================================================================
  // 3. ERA #16 PLUGIN BUILDER (Group E · Weight = 5 · >= 40 yrs after Era #15)
  // ============================================================================

  function createEra16Plugin() {
    return {
      id: 'era_16_robots_citizens',
      onEraEnter(game) {
        activateSyntheticSuffrage(game);
      },
      getStrategicDefectionModifier(game, partyId) {
        if (isRobotParty(partyId)) return 0; // Synthetic voters use proportional representation with zero wasted-vote defection
        return 0.5;
      },
      getDecisionModal(game) {
        const curName = game?.player?.name || 'Your Human Party';
        const rc = game?.partySystems?.robotCitizenship || {};
        const rParties = rc.robotParties || ROBOT_PARTY_CATALOG;
        return {
          type: 'robot_select',
          title: 'The Synthetic Suffrage Amendment: Choose Your Command',
          description: 'Over 155 million synthetic citizens have entered the constitutional electorate with zero-variance algorithmic participation, doubling the republic to over 310 million voters. Remain at the helm of your human party or step forward to chair one of the four new Robot Political Parties.',
          robotParties: rParties,
          options: [
            {
              id: 'stay_human_party',
              label: `Remain Chair of ${curName}`,
              summary: 'Navigate a doubled 310M+ electorate as a legacy human party building cross-substrate alliances.',
            },
            ...rParties.map((rp) => ({
              id: `switch_party:${rp.id}`,
              label: `Chair ${rp.name} (${rp.ideologyTag || 'Robot Party'})`,
              summary: rp.summary,
              color: rp.color,
            })),
          ],
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
        if (next.partySystems?.robotCitizenship) {
          next.partySystems = {
            ...next.partySystems,
            robotCitizenship: {
              ...next.partySystems.robotCitizenship,
              playerSwitchedToRobot: isRobotParty(next.player),
            },
          };
        }
        return next;
      },
    };
  }

  const api = {
    SYNTHETIC_ELECTORATE_VOTERS,
    SYNTHETIC_SAMPLE_VOTERS,
    SYNTHETIC_TURNOUT_PCT,
    ROBOT_PARTY_CATALOG,
    ROBOT_PARTY_IDS,
    ROBOT_PARTY_BY_ID,
    isRobotParty,
    isSyntheticSuffrageActive,
    getSyntheticTurnout,
    activateSyntheticSuffrage,
    allocateProportionalLargestRemainder,
    allocateSyntheticProportionalSeats,
    normalizeRobotCitizenshipState,
    createEra16Plugin,
  };

  if (typeof window !== 'undefined') {
    window.PartySystemsRobots = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
