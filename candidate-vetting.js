/**
 * Coalition Builder: Party Chair — Version 0.16.1
 * candidate-vetting.js: Candidate Vulnerability Ratings, Vetting Action & Campaign Scandal Crises
 *
 * Requirements:
 *  - REQ-212: Hidden Candidate Vulnerability Scores & "Vet Candidate" Action
 *      (0-100 hidden score; trait weights; $500k treasury action unmasks qualitative tiers:
 *       Clean 0-20, Minor 21-45, Baggage 46-74, Toxic 75-100; strictly no numeric score in UI)
 *  - REQ-213: Mid-Campaign Scandal Blowups (Abandon vs. Defend Dilemma)
 *      (Week 3-4 campaign crisis for unvetted/vulnerable nominees in competitive races;
 *       Option A: Stand By Nominee for $3.5M warchest, -4% poll drag, +4 faction happiness;
 *       Option B: Abandon Nominee forfeiting seat, +2 independent trust, -14 faction happiness & bolt warning)
 */

(function (root, factory) {
  const api = factory();
  if (typeof window !== 'undefined') {
    window.CandidateVetting = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.CandidateVetting = api;
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Trait vulnerability weights per REQ-212
  const TRAIT_VULNERABILITY_WEIGHTS = {
    corrupt: 45,
    Corrupt: 45,
    undisciplined: 30,
    Undisciplined: 30,
    rough: 15,
    Rough: 15,
    polished: -10,
    Polished: -10,
    disciplined: -20,
    Disciplined: -20,
    squeaky_clean: -45,
    'Squeaky Clean': -45,
    squeakyclean: -45,
  };

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function round(val, decimals = 1) {
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  /**
   * Deterministic hash from candidate string id to produce baseline variance (20-45).
   */
  function hashCandidateId(id = '') {
    let hash = 0;
    const str = String(id || 'candidate');
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 20 + Math.abs(hash % 26); // Baseline between 20 and 45
  }

  /**
   * Compute a politician's hidden vulnerability score (0 to 100) based on baseline and traits.
   * REQ-212
   */
  function computeCandidateVulnerabilityScore(politician = {}) {
    if (!politician) return 35;
    if (typeof politician.vulnerabilityScore === 'number' && Number.isFinite(politician.vulnerabilityScore)) {
      return clamp(Math.round(politician.vulnerabilityScore), 0, 100);
    }

    const base = hashCandidateId(politician.id || politician.name);
    let traitAdjustment = 0;
    const traits = Array.isArray(politician.traits) ? politician.traits : [];

    traits.forEach((t) => {
      const traitKey = typeof t === 'string' ? t.trim() : (t?.id || t?.name || '');
      if (TRAIT_VULNERABILITY_WEIGHTS[traitKey] !== undefined) {
        traitAdjustment += TRAIT_VULNERABILITY_WEIGHTS[traitKey];
      }
    });

    // Also check for specific boolean flags if present
    if (politician.isCorrupt) traitAdjustment += 45;
    if (politician.isSqueakyClean) traitAdjustment -= 45;

    return clamp(Math.round(base + traitAdjustment), 0, 100);
  }

  /**
   * Map score (0-100) to qualitative exposure tier.
   * REQ-212:
   *  - Clean: 0-20 (or <=25)
   *  - Minor: 21-45 (or 26-55)
   *  - Baggage: 46-74 (or 56-74)
   *  - Toxic: 75-100
   */
  function hasCandidateTrait(politician, traitName) {
    const traits = Array.isArray(politician?.traits) ? politician.traits : [];
    const target = String(traitName || '').toLowerCase();
    return traits.some((t) => String(typeof t === 'string' ? t : (t?.name || t?.id || '')).toLowerCase() === target);
  }

  // v0.16.5: Corrupt doubles scandal blowup odds (2.0x); Squeaky Clean grants total oppo/scandal immunity (0.0x)
  function getCandidateScandalOddsMultiplier(politician = {}) {
    if (hasCandidateTrait(politician, 'Squeaky Clean') || politician?.isSqueakyClean) return 0.0;
    if (hasCandidateTrait(politician, 'Corrupt') || politician?.isCorrupt) return 2.0;
    return 1.0;
  }

  // REQ-302: Candidate Electability Trait Modifiers & Regression Score
  const CANDIDATE_ELECTABILITY_TRAIT_MODIFIERS = {
    'Rising Star': 12,
    'Polished': 10,
    'Disciplined': 10,
    'Squeaky Clean': 8,
    'Established politician': (partyId) => (['green', 'socialist'].includes(partyId) ? -15 : 6),
    'Rough': (partyId) => (['heritage', 'socialist'].includes(partyId) ? 4 : -6),
    'Undisciplined': -18,
    'Corrupt': -25,
  };

  /**
   * REQ-302: Weighted Candidate Electability Regression Formula
   * Electability = (Fame * 0.25) + (Popularity * 0.35) + TraitModifiers - (IdeologicalDistance * 12)
   */
  function calculateCandidateElectability(cand, partyId, gameOrState = null) {
    if (!cand) return 50.0;
    const fame = Number(cand.fame ?? 40);
    const popularity = Number(cand.popularity ?? (typeof cand.approval === 'number' ? cand.approval : 55));
    const traits = Array.isArray(cand.traits)
      ? cand.traits.map((t) => (typeof t === 'string' ? t.trim() : (t?.name || t?.id || '')))
      : [];

    let traitMod = 0;
    if (traits.some((t) => t.toLowerCase() === 'rising star')) traitMod += 12;
    if (traits.some((t) => t.toLowerCase() === 'polished')) traitMod += 10;
    if (traits.some((t) => t.toLowerCase() === 'disciplined')) traitMod += 10;
    if (traits.some((t) => t.toLowerCase() === 'squeaky clean')) traitMod += 8;
    if (traits.some((t) => t.toLowerCase() === 'established politician')) {
      traitMod += ['green', 'socialist'].includes(partyId) ? -15 : 6;
    }
    if (traits.some((t) => t.toLowerCase() === 'rough')) {
      traitMod += ['heritage', 'socialist'].includes(partyId) ? 4 : -6;
    }
    if (traits.some((t) => t.toLowerCase() === 'undisciplined')) traitMod -= 18;
    if (traits.some((t) => t.toLowerCase() === 'corrupt')) traitMod -= 25;

    let distance = 0;
    const stances = gameOrState?.parties?.[partyId]?.platformStances;
    if (stances && cand.issuePositions && Object.keys(cand.issuePositions).length > 0) {
      const diffs = Object.keys(stances).map((k) => Math.abs(Number(stances[k] || 5.5) - Number(cand.issuePositions[k] || 5.5)));
      distance = diffs.reduce((a, b) => a + b, 0) / Math.max(1, diffs.length);
    } else if (cand.ideologyScore !== undefined) {
      const partyIdeal = partyId === 'people' ? 3.5 : partyId === 'heritage' ? 7.5 : partyId === 'liberty' ? 5.0 : partyId === 'socialist' ? 1.5 : partyId === 'green' ? 2.0 : partyId === 'constitution' ? 8.5 : 5.5;
      distance = Math.abs(Number(cand.ideologyScore) - partyIdeal);
    } else if (cand.sliders && cand.sliders.economic !== undefined) {
      const partyIdeal = partyId === 'people' ? 3.5 : partyId === 'heritage' ? 7.5 : partyId === 'liberty' ? 5.0 : partyId === 'socialist' ? 1.5 : partyId === 'green' ? 2.0 : partyId === 'constitution' ? 8.5 : 5.5;
      const candAvg = (Number(cand.sliders.economic || 5) + Number(cand.sliders.social || 5)) / 2;
      distance = Math.abs(candAvg - partyIdeal);
    } else {
      distance = 1.0;
    }

    const score = (fame * 0.25) + (popularity * 0.35) + traitMod - (distance * 12);
    return round(clamp(score, 0, 100), 1);
  }

  function getVulnerabilityTier(score) {
    const s = Number(score) || 0;
    if (s <= 20) return 'Clean';
    if (s <= 45) return 'Minor';
    if (s <= 74) return 'Baggage';
    return 'Toxic';
  }

  /**
   * Map score to qualitative narrative report (GAME_STYLE_GUIDE.md Rule 7: no raw numbers).
   */
  function getQualitativeVettingReport(score) {
    const tier = getVulnerabilityTier(score);
    switch (tier) {
      case 'Clean':
        return {
          tier: 'Clean',
          label: 'Clean Record',
          summary: 'Clean Record — Comprehensive vetting reveals no significant liabilities.',
          riskLevel: 'Negligible Exposure',
          atmosphericVibe: 'Squeaky clean opposition profile; robust against oppo dumps.',
        };
      case 'Minor':
        return {
          tier: 'Minor',
          label: 'Minor Vulnerabilities',
          summary: 'Moderate Scrutiny — Minor financial and rhetorical controversies detected; manageable risk.',
          riskLevel: 'Moderate Scrutiny',
          atmosphericVibe: 'Suburban whisper liabilities and minor opposition fodder; routine media scrutiny.',
        };
      case 'Baggage':
        return {
          tier: 'Baggage',
          label: 'Significant Baggage',
          summary: 'Significant Baggage — Substantial opposition research vulnerabilities; notable scandal exposure.',
          riskLevel: 'High Vulnerability',
          atmosphericVibe: 'Serious oppo liabilities; opposition campaign war rooms actively shopping dossier to press.',
        };
      case 'Toxic':
      default:
        return {
          tier: 'Toxic',
          label: 'Toxic Record',
          summary: 'Toxic Record — Severe liabilities, hostile paper trail, and catastrophic scandal vulnerability.',
          riskLevel: 'Critical Exposure',
          atmosphericVibe: 'Ticking time-bomb record; catastrophic vulnerability under general election press scrutiny.',
        };
    }
  }

  /**
   * Retrieve or deterministically assign candidate vulnerability score and record.
   */
  function getOrAssignCandidateVulnerability(game, politician) {
    if (!politician) return null;
    const polId = politician.id || politician.name;
    const existing = game?.candidateVetting?.[polId];
    if (existing && typeof existing.score === 'number') {
      return existing;
    }

    const score = computeCandidateVulnerabilityScore(politician);
    const report = getQualitativeVettingReport(score);
    const entry = {
      id: polId,
      score,
      tier: report.tier,
      label: report.label,
      summary: report.summary,
      riskLevel: report.riskLevel,
      vetted: Boolean(politician.isVetted || existing?.vetted),
    };

    if (game) {
      game.candidateVetting = game.candidateVetting || {};
      game.candidateVetting[polId] = entry;
    }
    return entry;
  }

  /**
   * REQ-212: Action — "Vet Candidate"
   * Costs $500k ($500,000 / $0.5M) Treasury.
   * Unmasks qualitative background report, marking candidate as vetted.
   */
  function vetCandidateAction(game, payload = {}) {
    if (!game) return game;
    const candidateId = payload.candidateId || payload.id;
    if (!candidateId) return game;

    // Check treasury cost ($500,000 / $0.5M depending on treasury unit scale)
    const cost = (game.treasury > 1000) ? 500000 : 0.5;
    if ((game.treasury || 0) < cost) {
      return {
        ...game,
        lastError: 'Insufficient Treasury funds for candidate vetting ($500,000 required).',
      };
    }

    // Locate politician across game candidate pools
    let pol = null;
    const pools = [
      ...(game.candidates || []),
      ...(game.rosterMembers || []),
      ...(game.roster || []),
      ...(game.sittingMembers || []),
      ...(game.generatedMembers || []),
    ];
    // Also check primaryFields (flattening nested { [raceId]: { [partyId]: Candidate[] } })
    if (game.primaryFields) {
      Object.values(game.primaryFields).forEach((raceParties) => {
        if (Array.isArray(raceParties)) {
          pools.push(...raceParties);
        } else if (raceParties && typeof raceParties === 'object') {
          Object.values(raceParties).forEach((fList) => {
            if (Array.isArray(fList)) pools.push(...fList);
          });
        }
      });
    }

    pol = pools.find((c) => (c && (c.id === candidateId || c.name === candidateId)));
    if (!pol && typeof candidateId === 'string' && candidateId.includes(':')) {
      const parts = candidateId.split(':');
      if (parts.length >= 3) {
        const pKey = parts[parts.length - 2];
        const idx = parseInt(parts[parts.length - 1], 10);
        const raceKey = parts.slice(0, parts.length - 2).join(':');
        if (!isNaN(idx)) {
          pol = game.primaryFields?.[raceKey]?.[pKey]?.[idx];
          if (!pol) {
            const engine = typeof PartyChairEngine !== 'undefined' ? PartyChairEngine : (typeof window !== 'undefined' && window.PartyChairEngine ? window.PartyChairEngine : (typeof globalThis !== 'undefined' && globalThis.PartyChairEngine ? globalThis.PartyChairEngine : null));
            if (engine && typeof engine.version01CandidateField === 'function') {
              const field = engine.version01CandidateField(game, raceKey, pKey);
              if (field && field[idx]) pol = field[idx];
            }
          }
        }
      }
    }
    if (!pol) {
      // Create minimal politician wrapper if not found in standard arrays
      pol = { id: candidateId, name: payload.candidateName || 'Primary Candidate' };
    } else if (!pol.name) {
      pol.name = payload.candidateName || 'Primary Candidate';
    }

    const record = getOrAssignCandidateVulnerability(game, pol);
    record.vetted = true;
    pol.isVetted = true;
    pol.vulnerabilityTier = record.tier;
    pol.vettingReport = record.summary;

    const updatedVetting = {
      ...(game.candidateVetting || {}),
      [candidateId]: record,
    };

    const nextTreasury = Math.max(0, (game.treasury || 0) - cost);
    const note = `Completed background vetting on ${pol.name}: ${record.label}. ${record.summary}`;

    return {
      ...game,
      treasury: nextTreasury,
      candidateVetting: updatedVetting,
      lastNote: note,
    };
  }

  /**
   * REQ-213: Mid-Campaign Scandal Blowups (Evaluate at Campaign Phase / Weeks 3-4)
   * Evaluated during campaign weeks for nominees in competitive battleground races.
   */
  function evaluateCampaignScandals(game, options = {}) {
    if (!game || !game.campaign?.active) return game;
    if (game.pendingScandalCrisis) return game; // A crisis is already waiting for resolution

    const currentWeek = Number(game.campaign.week ?? game.campaign.currentWeek ?? 1);

    // Evaluate unvetted running mate scandal in October (Month 5 / Week 5)
    if ((currentWeek >= 5 || options.evaluateVpScandal || options.force) && (game.selectedVp || game.presidentialPrimaries?.conventionData?.selectedVp)) {
      game = evaluateVpScandal(game, options);
    }

    // Allow evaluation in weeks 3 or 4, or forced via options
    if (currentWeek < 3 && !options.force) return game;

    // Search for nominees in general campaigns
    const nominees = [];
    const playerParty = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');

    if (game.generalCampaigns) {
      Object.entries(game.generalCampaigns).forEach(([raceKey, camp]) => {
        const nom = camp.nominee || camp.candidate;
        if (nom) {
          nominees.push({
            raceKey,
            stateId: raceKey.split(':')[1]?.split('-')[0] || 'PA',
            raceType: raceKey.split(':')[0] || 'senate',
            candidate: nom,
          });
        }
      });
    }

    // Also check contested statewide executive nominees
    if (game.contestedStatewideOffices && typeof game.contestedStatewideOffices === 'object') {
      Object.entries(game.contestedStatewideOffices).forEach(([officeId, entry]) => {
        if (!entry) return;
        const nom = (typeof entry === 'object' && (entry.nominee || entry.candidate)) || null;
        if (nom) {
          const stId = (typeof entry === 'object' && entry.stateId) || String(officeId).split(':')[0] || 'PA';
          nominees.push({
            raceKey: `statewide_executive:${officeId}`,
            stateId: stId,
            raceType: 'statewide_executive',
            candidate: nom,
          });
        }
      });
    }

    // Also check presidential ticket
    if (game.presidentialTicket?.playerNominee) {
      nominees.push({
        raceKey: 'president',
        stateId: 'US',
        raceType: 'president',
        candidate: game.presidentialTicket.playerNominee,
      });
    }

    // Filter to candidates with vulnerability >= 46 or unvetted high-risk
    const vulnerableNominees = [];
    nominees.forEach((n) => {
      const oddsMult = getCandidateScandalOddsMultiplier(n.candidate);
      // Squeaky Clean grants total immunity to opposition research / scandal blowups
      if (oddsMult <= 0) return;

      const record = getOrAssignCandidateVulnerability(game, n.candidate);
      const score = record.score;
      const isVetted = Boolean(record.vetted || n.candidate.isVetted);
      const effectiveScore = clamp(Math.round(score * oddsMult), 0, 200);

      // Corrupt doubles blowup odds (lower threshold & prioritized)
      if (score >= 46 || (!isVetted && score >= 35) || (oddsMult >= 2.0 && score >= 25) || options.force) {
        vulnerableNominees.push({
          ...n,
          score,
          effectiveScore,
          scandalOddsMultiplier: oddsMult,
          isVetted,
          record,
        });
      }
    });
    vulnerableNominees.sort((a, b) => (b.effectiveScore || b.score) - (a.effectiveScore || a.score));

    if (!vulnerableNominees.length) return game;

    // Pick candidate: either target from options or first eligible
    const target = options.targetCandidateId
      ? vulnerableNominees.find((v) => v.candidate.id === options.targetCandidateId) || vulnerableNominees[0]
      : vulnerableNominees[0];

    if (!target) return game;

    const cand = target.candidate;
    const candName = cand.name || 'Party Nominee';
    const factionId = cand.factionId || cand.faction || 'dem_liberal_establishment';

    // Construct crisis payload
    const crisis = {
      id: `scandal_${cand.id || 'nominee'}_w${currentWeek}`,
      candidateId: cand.id,
      candidateName: candName,
      raceKey: target.raceKey,
      raceType: target.raceType,
      stateId: target.stateId,
      factionId: factionId,
      vulnerabilityTier: target.record.tier,
      isVetted: target.isVetted,
      title: `Emergency Media Inquest: ${candName}`,
      headline: `Bombshell Opposition Records Erupt Against ${candName}`,
      narrative: `Investigative reporters have published extensive opposition research detailing liabilities and controversial conduct surrounding ${candName}. Cable news networks are leading with the revelations, and campaign strategists are urging an immediate strategic decision.`,
      options: [
        {
          id: 'stand_by',
          label: 'Stand By Nominee',
          costDollars: 3500000,
          costDescription: '$3.5M Treasury',
          impacts: [
            'Nominee suffers -4.0% individual polling drag (-2 Quality, -10 Popularity)',
            'National party absorbs minor -1.5% suburban approval ding',
            'Candidate\'s aligned faction appreciates committee loyalty (+4 Happiness)',
            'Seat remains contested in the general election'
          ],
        },
        {
          id: 'abandon',
          label: 'Abandon and Disavow Nominee',
          costDollars: 0,
          costDescription: 'No Treasury Cost',
          impacts: [
            'Pull all committee advertising warchest and issue formal disavowal',
            'Protects national party brand (+2 Independent Trust)',
            'Nominee collapses by -18.0% (effectively conceding seat)',
            'Candidate\'s aligned faction is furious (-14 Happiness & Bolt Warning)'
          ],
        },
      ],
    };

    return {
      ...game,
      pendingScandalCrisis: crisis,
      activeCampaignScandals: [...(game.activeCampaignScandals || []), crisis],
      lastNote: `Emergency Crisis: Opposition scandal erupted concerning ${candName}.`,
    };
  }

  /**
   * REQ-213: Resolve Scandal Crisis (Option A: Stand By vs Option B: Abandon)
   */
  function resolveScandalCrisis(game, payload = {}) {
    if (!game || !game.pendingScandalCrisis) return game;
    const crisis = game.pendingScandalCrisis;
    const option = payload.option || payload.choiceId || payload.choice || 'stand_by';

    let working = { ...game };
    const candId = crisis.candidateId;
    const factionId = crisis.factionId;

    if (option === 'stand_by') {
      // Option A: Stand By Nominee
      // Costs $3.5M
      const cost = 3500000;
      working.treasury = Math.max(0, (working.treasury || 0) - cost);

      // Nominee impact: -4% polling drag, -2 quality, -10 popularity
      const updatePol = (pol) => {
        if (!pol || (pol.id !== candId && pol.name !== crisis.candidateName)) return pol;
        pol.scandalPenalty = round((pol.scandalPenalty || 0) - 4.0, 1);
        pol.quality = Math.max(1, (pol.quality || 6) - 2);
        pol.popularity = Math.max(5, (pol.popularity || 50) - 10);
        return {
          ...pol,
          scandalPenalty: pol.scandalPenalty,
          quality: pol.quality,
          popularity: pol.popularity,
        };
      };

      if (working.candidates) working.candidates = working.candidates.map(updatePol);
      if (working.rosterMembers) working.rosterMembers = working.rosterMembers.map(updatePol);
      if (working.sittingMembers) working.sittingMembers = working.sittingMembers.map(updatePol);
      if (working.generalCampaigns?.[crisis.raceKey]?.nominee) {
        working.generalCampaigns[crisis.raceKey].nominee = updatePol(working.generalCampaigns[crisis.raceKey].nominee);
      }

      // Party absorbs -1.5% suburban approval / trust ding
      if (working.trust) {
        working.trust = {
          ...working.trust,
          independents: clamp(round((working.trust.independents || 50) - 1.5, 1), 0, 100),
        };
      }
      if (working.presidentialApproval) {
        working.presidentialApproval = clamp(round(working.presidentialApproval - 1.5, 1), 10, 90);
      }

      // Faction appreciates loyalty: +4 Happiness
      if (factionId && working.factionStandings) {
        const curH = Number(working.factionStandings[factionId] ?? 65);
        working.factionStandings[factionId] = clamp(round(curH + 4, 1), 0, 100);
      }
      if (factionId && working.factions) {
        working.factions = working.factions.map((f) => {
          if (f.id === factionId || f.name === factionId) {
            return { ...f, happiness: clamp(round((f.happiness || 65) + 4, 1), 0, 100) };
          }
          return f;
        });
      }

      working.lastNote = `Stood by ${crisis.candidateName}: expended $3.5M legal/communications warchest. Candidate endured -4.0% drag but remains contested. Aligned faction appreciates committee loyalty (+4 Happiness).`;
    } else {
      // Option B: Abandon Nominee
      // Costs $0M
      // Protects national party brand (+2 Independent Trust)
      if (working.trust) {
        working.trust = {
          ...working.trust,
          independents: clamp(round((working.trust.independents || 50) + 2.0, 1), 0, 100),
        };
      }

      // Nominee vote collapses by -18.0% (effectively conceding seat)
      const updatePolAbandoned = (pol) => {
        if (!pol || (pol.id !== candId && pol.name !== crisis.candidateName)) return pol;
        pol.scandalPenalty = round((pol.scandalPenalty || 0) - 18.0, 1);
        pol.abandoned = true;
        pol.quality = Math.max(1, (pol.quality || 6) - 3);
        return {
          ...pol,
          scandalPenalty: pol.scandalPenalty,
          abandoned: true,
          quality: pol.quality,
        };
      };

      if (working.candidates) working.candidates = working.candidates.map(updatePolAbandoned);
      if (working.rosterMembers) working.rosterMembers = working.rosterMembers.map(updatePolAbandoned);
      if (working.sittingMembers) working.sittingMembers = working.sittingMembers.map(updatePolAbandoned);
      if (working.generalCampaigns?.[crisis.raceKey]?.nominee) {
        working.generalCampaigns[crisis.raceKey].nominee = updatePolAbandoned(working.generalCampaigns[crisis.raceKey].nominee);
      }

      // Candidate's faction is furious: -14 Happiness, +20 friction, bolt warning
      let factionName = factionId;
      if (factionId && working.factionStandings) {
        const curH = Number(working.factionStandings[factionId] ?? 65);
        const newH = clamp(round(curH - 14, 1), 0, 100);
        working.factionStandings[factionId] = newH;
      }
      if (factionId && working.factions) {
        working.factions = working.factions.map((f) => {
          if (f.id === factionId || f.name === factionId) {
            factionName = f.name || factionId;
            const newH = clamp(round((f.happiness || 65) - 14, 1), 0, 100);
            const newFriction = clamp(round((f.frictionIndex || 0) + 20, 1), 0, 100);
            return {
              ...f,
              happiness: newH,
              frictionIndex: newFriction,
              boltWarning: newH < 35,
            };
          }
          return f;
        });
      }

      working.factionBoltThreats = working.factionBoltThreats || [];
      working.factionBoltThreats.push({
        factionId,
        narrative: `Factional Outrage: Backlash over the abandonment of ${crisis.candidateName} has sent ${factionName} happiness plummeting (-14 Happiness).`,
      });

      working.lastNote = `Abandoned ${crisis.candidateName}: pulled committee advertising and disavowed nominee (-18.0% polling collapse). Protected independent trust (+2 Trust), but infuriated candidate's faction (-14 Happiness).`;
    }

    // Clear active crisis
    working.pendingScandalCrisis = null;
    return working;
  }

  // =========================================================================
  // VICE PRESIDENTIAL & RUNNING-MATE SELECTION WAR ROOM & SKELETONS (CHUNKS 3.2 & 3.3)
  // =========================================================================

  const FALLBACK_RUNNING_MATES = {
    people: [
      { id: 'vp_people_wi', name: 'Sen. Tammy Baldwin', stateId: 'WI', office: 'senate', fame: 70, quality: 8, factionId: 'dem_liberal_establishment', traits: ['Polished', 'Disciplined', 'Bipartisan Dealmaker'] },
      { id: 'vp_people_pa', name: 'Gov. Josh Shapiro', stateId: 'PA', office: 'governor', fame: 72, quality: 8, factionId: 'dem_liberal_establishment', traits: ['Prosecutorial Edge', 'Polished', 'Rising Star'] },
      { id: 'vp_people_ga', name: 'Sen. Raphael Warnock', stateId: 'GA', office: 'senate', fame: 74, quality: 8, factionId: 'dem_black_voters', traits: ['Oratorical Phenom', 'Grassroots Organizer', 'Disciplined'] },
      { id: 'vp_people_mi', name: 'Gov. Gretchen Whitmer', stateId: 'MI', office: 'governor', fame: 78, quality: 8, factionId: 'dem_liberal_establishment', traits: ['Polished', 'Prosecutorial Edge', 'Rising Star'] },
      { id: 'vp_people_ky', name: 'Gov. Andy Beshear', stateId: 'KY', office: 'governor', fame: 68, quality: 8, factionId: 'dem_liberal_establishment', traits: ['Prosecutorial Edge', 'Squeaky Clean', 'Bipartisan Dealmaker'] },
    ],
    heritage: [
      { id: 'vp_heritage_nh', name: 'Gov. Chris Sununu', stateId: 'NH', office: 'governor', fame: 66, quality: 7, factionId: 'gop_suburban_moderates', traits: ['Polished', 'Disciplined', 'Bipartisan Dealmaker'] },
      { id: 'vp_heritage_al', name: 'Sen. Katie Britt', stateId: 'AL', office: 'senate', fame: 64, quality: 7, factionId: 'gop_traditional_conservatives', traits: ['Rising Star', 'Polished', 'Committee Workhorse'] },
      { id: 'vp_heritage_va', name: 'Gov. Glenn Youngkin', stateId: 'VA', office: 'governor', fame: 72, quality: 8, factionId: 'gop_suburban_moderates', traits: ['Self-Made Entrepreneur', 'Polished', 'Disciplined'] },
      { id: 'vp_heritage_fl', name: 'Sen. Marco Rubio', stateId: 'FL', office: 'senate', fame: 80, quality: 7, factionId: 'gop_traditional_conservatives', traits: ['Sunday Show Fixture', 'Polished', 'Established Politician'] },
      { id: 'vp_heritage_sc', name: 'Sen. Tim Scott', stateId: 'SC', office: 'senate', fame: 72, quality: 8, factionId: 'gop_black_conservatives', traits: ['Oratorical Phenom', 'Disciplined', 'Polished'] },
    ],
    liberty: [
      { id: 'vp_liberty_ga', name: 'Chase Oliver', stateId: 'GA', office: 'party_leader', fame: 45, quality: 7, factionId: 'liberty_radicals', traits: ['Grassroots Organizer', 'Digital Native', 'Rising Star'] },
      { id: 'vp_liberty_va', name: 'Mike ter Maat', stateId: 'VA', office: 'party_leader', fame: 42, quality: 7, factionId: 'liberty_pragmatists', traits: ['Budget Hawk', 'Disciplined', 'Academic Theorist'] },
      { id: 'vp_liberty_sc', name: 'Spike Cohen', stateId: 'SC', office: 'party_leader', fame: 48, quality: 7, factionId: 'liberty_radicals', traits: ['Digital Native', 'Floor Speech Maverick', 'Polished'] },
      { id: 'vp_liberty_nh', name: 'Jeremy Kauffman', stateId: 'NH', office: 'party_leader', fame: 40, quality: 6, factionId: 'liberty_radicals', traits: ['Rough', 'Undisciplined', 'Populist Firebrand'] },
    ],
    green: [
      { id: 'vp_green_wa', name: 'Kshama Sawant', stateId: 'WA', office: 'party_leader', fame: 46, quality: 7, factionId: 'green_eco_socialists', traits: ['Grassroots Organizer', 'Populist Firebrand', 'Doctrinal Purist'] },
      { id: 'vp_green_ca', name: 'Butch Ware', stateId: 'CA', office: 'party_leader', fame: 44, quality: 6, factionId: 'green_activists', traits: ['Academic Theorist', 'Doctrinal Purist', 'Rough'] },
      { id: 'vp_green_ma', name: 'Jill Stein', stateId: 'MA', office: 'party_leader', fame: 60, quality: 7, factionId: 'green_activists', traits: ['Doctrinal Purist', 'Grassroots Organizer', 'Established Politician'] },
      { id: 'vp_green_ny', name: 'Howie Hawkins', stateId: 'NY', office: 'party_leader', fame: 42, quality: 6, factionId: 'green_eco_socialists', traits: ['Union Stalwart', 'Rough', 'Doctrinal Purist'] },
    ],
    constitution: [
      { id: 'vp_const_ut', name: 'Scott Bradley', stateId: 'UT', office: 'party_leader', fame: 40, quality: 6, factionId: 'const_paleoconservatives', traits: ['Academic Theorist', 'Disciplined', 'Doctrinal Purist'] },
      { id: 'vp_const_tn', name: 'Randall Terry', stateId: 'TN', office: 'party_leader', fame: 45, quality: 6, factionId: 'const_theocrats', traits: ['Backbench Agitator', 'Populist Firebrand', 'Undisciplined'] },
      { id: 'vp_const_wv', name: 'Don Blankenship', stateId: 'WV', office: 'party_leader', fame: 42, quality: 5, factionId: 'const_paleoconservatives', traits: ['Self-Made Entrepreneur', 'Rough', 'Corrupt'] },
      { id: 'vp_const_va', name: 'Darrell Castle', stateId: 'TN', office: 'party_leader', fame: 38, quality: 6, factionId: 'const_paleoconservatives', traits: ['Disciplined', 'Quiet Diplomat'] },
    ],
    socialist: [
      { id: 'vp_soc_ca', name: 'Gloria La Riva', stateId: 'CA', office: 'party_leader', fame: 44, quality: 6, factionId: 'soc_anti_imperialists', traits: ['Union Stalwart', 'Doctrinal Purist', 'Established Politician'] },
      { id: 'vp_soc_ny', name: 'Claudia De la Cruz', stateId: 'NY', office: 'party_leader', fame: 46, quality: 7, factionId: 'soc_militant_labor', traits: ['Grassroots Organizer', 'Populist Firebrand', 'Rising Star'] },
      { id: 'vp_soc_nj', name: 'Cornel West', stateId: 'NJ', office: 'party_leader', fame: 62, quality: 7, factionId: 'soc_democratic_socialists', traits: ['Oratorical Phenom', 'Academic Theorist', 'Floor Speech Maverick'] },
      { id: 'vp_soc_il', name: 'Karina Garcia', stateId: 'IL', office: 'party_leader', fame: 40, quality: 6, factionId: 'soc_militant_labor', traits: ['Grassroots Organizer', 'Digital Native'] },
    ],
  };

  /**
   * Chunk 3.2: Generate a vetted shortlist of 4 potential running mates balancing distinct strategic angles:
   * 1. Home-State / Regional Anchor (+3.5% to +5.0% home-state lift, +1.5% regional coattails)
   * 2. Factional Peacekeeper (+15 Happiness, +10 Confidence to major rival faction)
   * 3. Ideological Complement (balances ticket, +4.0 suburban independent trust)
   * 4. High-Energy Attack Dog (+2.0% national base turnout lift)
   */
  function generateVpRunningMateShortlist(game, playerPartyId = null) {
    const partyId = playerPartyId || (game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people'));
    const nominee = game?.presidentialPrimaries?.nominee
      || (game?.presidentialTicket?.[partyId] ? { name: game.presidentialTicket[partyId] } : null)
      || (game?.presidentialTicket?.playerNominee || null);
    const nomineeState = nominee?.stateId || nominee?.state || 'PA';
    const nomineeFaction = nominee?.factionId || nominee?.faction || 'dem_liberal_establishment';

    // 1. Gather all potential prospects from sitting members, standouts, and fallbacks
    const pool = [];
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    sitting.forEach((m) => {
      if ((m.party === partyId || m.caucus === partyId) && (m.office === 'senate' || m.office === 'governor' || m.office === 'stateLeg')) {
        if (!nominee || m.name !== nominee.name) {
          pool.push(m);
        }
      }
    });

    // Add standouts
    if (game?.stateLegStandouts?.[partyId]) {
      game.stateLegStandouts[partyId].forEach((s) => {
        if (!pool.some((p) => p.id === s.id || p.name === s.name)) {
          pool.push(s);
        }
      });
    }

    // Add party fallbacks
    const customLabel = (game?.player?.name || 'Party').trim();
    const fallbacks = FALLBACK_RUNNING_MATES[partyId] || [
      { id: `vp_custom_1`, name: `${customLabel} Co-Chair Alex Mercer`, stateId: 'PA', office: 'party_leader', fame: 55, quality: 7, factionId: 'establishment', traits: ['Polished', 'Disciplined'] },
      { id: `vp_custom_2`, name: `${customLabel} Organizer Dana Reyes`, stateId: 'OH', office: 'party_leader', fame: 52, quality: 7, factionId: 'reform', traits: ['Grassroots Organizer', 'Rising Star'] },
      { id: `vp_custom_3`, name: `${customLabel} Policy Director Jordan Ellis`, stateId: 'MI', office: 'party_leader', fame: 50, quality: 7, factionId: 'moderates', traits: ['Budget Hawk', 'Disciplined'] },
      { id: `vp_custom_4`, name: `${customLabel} Trail Agitator Morgan Hayes`, stateId: 'WI', office: 'party_leader', fame: 54, quality: 7, factionId: 'populist', traits: ['Populist Firebrand', 'Floor Speech Maverick'] },
    ];
    fallbacks.forEach((f) => {
      if (!pool.some((p) => p.name === f.name)) {
        pool.push(f);
      }
    });

    // 2. Identify candidate for Angle 1: Home-State / Regional Anchor
    // Prefers Rust Belt / Sun Belt battlegrounds different from nominee
    const battlegroundStates = ['PA', 'WI', 'MI', 'GA', 'AZ', 'NC', 'NV', 'OH', 'NH', 'FL', 'VA'];
    let anchorCand = pool.find((c) => c.stateId !== nomineeState && battlegroundStates.includes(c.stateId)) || pool[0];
    const usedIds = new Set([anchorCand.id || anchorCand.name]);

    // 3. Identify candidate for Angle 2: Factional Peacekeeper
    // Prefers rival faction within party
    const factions = (Array.isArray(game?.factions) && game.factions.length)
      ? game.factions.filter((f) => f.partyId === partyId)
      : (window.PartyChairData?.FACTIONS_CATALOG || []).filter((f) => f.partyId === partyId);
    const rivalFaction = factions.find((f) => f.id !== nomineeFaction && f.status === 'major') || factions.find((f) => f.id !== nomineeFaction) || factions[0];
    const rivalFactionId = rivalFaction?.id || 'dem_progressive_left';
    const rivalFactionName = rivalFaction?.name || 'Progressive Left';

    let peacekeeperCand = pool.find((c) => !usedIds.has(c.id || c.name) && (c.factionId === rivalFactionId || c.faction === rivalFactionName))
      || pool.find((c) => !usedIds.has(c.id || c.name) && c.factionId !== nomineeFaction)
      || pool.find((c) => !usedIds.has(c.id || c.name))
      || fallbacks[1];
    usedIds.add(peacekeeperCand.id || peacekeeperCand.name);

    // 4. Identify candidate for Angle 3: Ideological Complement
    // Balances ticket (moderate/pragmatist if nominee is ideological, or vice versa)
    let complementCand = pool.find((c) => !usedIds.has(c.id || c.name) && (hasCandidateTrait(c, 'Bipartisan Dealmaker') || hasCandidateTrait(c, 'Quiet Diplomat') || hasCandidateTrait(c, 'Polished')))
      || pool.find((c) => !usedIds.has(c.id || c.name))
      || fallbacks[2];
    usedIds.add(complementCand.id || complementCand.name);

    // 5. Identify candidate for Angle 4: High-Energy Attack Dog
    // Prefers firebrands, mavericks, grassroots organizers
    let attackDogCand = pool.find((c) => !usedIds.has(c.id || c.name) && (hasCandidateTrait(c, 'Populist Firebrand') || hasCandidateTrait(c, 'Floor Speech Maverick') || hasCandidateTrait(c, 'Rough') || hasCandidateTrait(c, 'Grassroots Organizer')))
      || pool.find((c) => !usedIds.has(c.id || c.name))
      || fallbacks[3];
    usedIds.add(attackDogCand.id || attackDogCand.name);

    // Helper to enrich prospect with vetting and angle info
    const enrichProspect = (base, angle, title, dossier, bonuses = {}) => {
      const pol = { ...base };
      pol.strategicAngle = angle;
      pol.angleTitle = title;
      pol.dossier = dossier;
      Object.assign(pol, bonuses);

      // Hidden vulnerability score
      const vulnScore = computeCandidateVulnerabilityScore(pol);
      pol.vulnerabilityScore = vulnScore;
      const vettingRec = game?.candidateVetting?.[pol.id];
      if (vettingRec && vettingRec.vetted) {
        pol.isVetted = true;
        pol.vulnerabilityTier = vettingRec.tier;
        pol.vettingReport = vettingRec.summary;
      } else if (pol.isVetted) {
        pol.vulnerabilityTier = getVulnerabilityTier(vulnScore);
        pol.vettingReport = getQualitativeVettingReport(vulnScore).summary;
      } else {
        pol.isVetted = false;
        pol.vulnerabilityTier = 'Unvetted';
        pol.vettingReport = null;
      }
      return pol;
    };

    const shortlist = [
      enrichProspect(
        anchorCand,
        'home_state_anchor',
        'Home-State / Regional Anchor',
        `Strong ${anchorCand.stateId || 'Battleground'} Appeal · Battleground Coattails Anchor`,
        { homeStateLift: 4.5, regionalCoattailBoost: 1.5 }
      ),
      enrichProspect(
        peacekeeperCand,
        'factional_peacekeeper',
        'Factional Peacekeeper',
        `Unifies the ${rivalFactionName} · Factional Harmony Accord`,
        { targetFactionId: rivalFactionId, targetFactionName: rivalFactionName, factionHappinessGain: 15, factionConfidenceGain: 10 }
      ),
      enrichProspect(
        complementCand,
        'ideological_complement',
        'Ideological Complement',
        'Balances the National Ticket · Broad Suburban Independent Appeal',
        { independentTrustBoost: 4.0 }
      ),
      enrichProspect(
        attackDogCand,
        'attack_dog',
        'High-Energy Attack Dog',
        'Grassroots Base Mobilizer · Relentless Campaign Trail Attack Dog',
        { baseTurnoutLift: 2.0 }
      ),
    ];

    if (game) {
      game.vpShortlist = shortlist;
      if (game.presidentialPrimaries?.conventionData) {
        game.presidentialPrimaries.conventionData.vpShortlist = shortlist;
        game.presidentialPrimaries.conventionData.vpRoster = shortlist;
      }
    }

    return shortlist;
  }

  /**
   * Chunk 3.3: Action — "Full Background Audit" ($3M from National Treasury)
   * Unmasks qualitative background report, marking running-mate prospect as vetted.
   */
  function auditVpAction(game, payload = {}) {
    if (!game) return game;
    const candidateId = payload.candidateId || payload.id || payload.vpId;
    if (!candidateId) return game;

    // Cost: $3M ($3,000,000 / 3.0 in $M scale)
    const cost = (game.treasury > 1000) ? 3000000 : 3.0;
    if ((game.treasury || 0) < cost) {
      return {
        ...game,
        lastError: 'Insufficient Treasury funds for running-mate background audit ($3.0M required).',
      };
    }

    // Locate running mate across shortlist, convention roster, sitting members, politicians
    let cand = null;
    const candidates = [
      ...(game.vpShortlist || []),
      ...(game.presidentialPrimaries?.conventionData?.vpShortlist || []),
      ...(game.presidentialPrimaries?.conventionData?.vpRoster || []),
      ...(game.sittingMembers || []),
      ...(game.politicians || []),
    ];
    cand = candidates.find((c) => c && (c.id === candidateId || c.name === candidateId));
    if (!cand) {
      cand = { id: candidateId, name: payload.candidateName || 'Running Mate Prospect' };
    }

    const record = getOrAssignCandidateVulnerability(game, cand);
    record.vetted = true;
    cand.isVetted = true;
    cand.vulnerabilityTier = record.tier;
    cand.vettingReport = record.summary;

    // Update in shortlist and convention data if present
    const updateInList = (list) => {
      if (!Array.isArray(list)) return list;
      return list.map((item) => {
        if (item && (item.id === candidateId || item.name === cand.name)) {
          return { ...item, isVetted: true, vulnerabilityTier: record.tier, vettingReport: record.summary };
        }
        return item;
      });
    };

    let updatedVpShortlist = updateInList(game.vpShortlist);
    let updatedConv = game.presidentialPrimaries?.conventionData ? { ...game.presidentialPrimaries.conventionData } : null;
    if (updatedConv) {
      if (updatedConv.vpRoster) updatedConv.vpRoster = updateInList(updatedConv.vpRoster);
      if (updatedConv.vpShortlist) updatedConv.vpShortlist = updateInList(updatedConv.vpShortlist);
      if (updatedConv.selectedVp && (updatedConv.selectedVp.id === candidateId || updatedConv.selectedVp.name === cand.name)) {
        updatedConv.selectedVp = { ...updatedConv.selectedVp, isVetted: true, vulnerabilityTier: record.tier, vettingReport: record.summary };
      }
    }

    const nextTreasury = Math.max(0, (game.treasury || 0) - cost);
    const note = `Completed full background audit on running-mate prospect ${cand.name}: ${record.label}. ${record.summary}`;

    const nextPrimaries = updatedConv ? { ...game.presidentialPrimaries, conventionData: updatedConv } : game.presidentialPrimaries;
    return {
      ...game,
      treasury: nextTreasury,
      candidateVetting: {
        ...(game.candidateVetting || {}),
        [candidateId]: record,
      },
      vpShortlist: updatedVpShortlist,
      presidentialPrimaries: nextPrimaries,
      lastNote: note,
    };
  }

  /**
   * Chunk 3.3: October Vetting Scandal Blowups for Unvetted Running Mates
   * If unvetted, high vulnerability (score >= 46, Baggage or Toxic) has a 35% chance
   * in October of inflicting -3.0% national presidential polling and -8 Supporter Trust.
   */
  function evaluateVpScandal(game, options = {}) {
    if (!game) return game;
    if (game.vpScandalTriggered) return game; // Already triggered once

    const vp = game.selectedVp || game.presidentialPrimaries?.conventionData?.selectedVp;
    if (!vp) return game;

    // If vetted, completely immune to unvetted vetting blowup
    const record = getOrAssignCandidateVulnerability(game, vp);
    if (vp.isVetted || record?.vetted) return game;

    // Check vulnerability score & tier
    const score = record?.score ?? computeCandidateVulnerabilityScore(vp);
    const tier = record?.tier ?? getVulnerabilityTier(score);

    // Only candidates with notable liabilities (Baggage / Toxic, or score >= 46) trigger
    if (score < 46 && tier !== 'Baggage' && tier !== 'Toxic' && !options.force) {
      return game;
    }

    // 35% probability during October
    const rollSeed = `${game.seed || 2028}:${game.year || 2028}:vp_scandal:${vp.id || vp.name}`;
    const roll = hashCandidateId(rollSeed) / 100.0;
    const triggers = options.force || (roll < 0.35);

    if (!triggers) return game;

    let working = { ...game };
    working.vpScandalTriggered = true;

    // Inflict -3.0% national presidential polling drag
    if (typeof working.presidentialApproval === 'number') {
      working.presidentialApproval = clamp(round(working.presidentialApproval - 3.0, 1), 0, 100);
    }
    if (typeof working.nationalPolling === 'number') {
      working.nationalPolling = clamp(round(working.nationalPolling - 3.0, 1), 0, 100);
    }
    working.vpPollingDrag = 3.0;
    working.vpScandalPollingPenalty = (working.vpScandalPollingPenalty || 0) - 3.0;

    // Inflict -8 Supporter Trust
    if (working.trust) {
      const curSupporters = working.trust.supporters ?? working.trust.base ?? 70;
      working.trust = {
        ...working.trust,
        supporters: clamp(round(curSupporters - 8.0, 1), 0, 100),
      };
      if (typeof working.trust.base === 'number') {
        working.trust.base = clamp(round(working.trust.base - 8.0, 1), 0, 100);
      }
    }

    const crisis = {
      id: `vp_scandal_${vp.id || 'running_mate'}`,
      candidateId: vp.id,
      candidateName: vp.name,
      raceKey: 'president',
      title: `October Surprise: Running-Mate Vetting Scandal Engulfs ${vp.name}`,
      headline: `Bombshell Liabilities and Past Financial Conflicts Erupt Around ${vp.name}`,
      narrative: `With just weeks remaining until Election Day, investigative journalists have unmasked severe financial irregularities and controversial paper trails surrounding unvetted running mate ${vp.name}. The revelation has dominated cable airwaves, eroding supporter trust (-8 Trust) and pulling national ticket polling down by -3.0%.`,
    };

    working.activeCampaignScandals = [...(working.activeCampaignScandals || []), crisis];
    working.lastNote = `OCTOBER SURPRISE: Unvetted running mate ${vp.name} engulfed in an explosive vetting scandal (-3.0% presidential polling, -8 Supporter Trust).`;

    return working;
  }

  /**
   * Resolve Vice Presidential Running Mate Selection & Apply Strategic Angle Bonuses
   */
  function resolveVpSelectionWithWarRoom(game, candidateId) {
    if (!game) return game;
    let working = { ...game };

    // Locate candidate in shortlist or convention data
    let vp = null;
    const candidates = [
      ...(working.vpShortlist || []),
      ...(working.presidentialPrimaries?.conventionData?.vpShortlist || []),
      ...(working.presidentialPrimaries?.conventionData?.vpRoster || []),
      ...(working.sittingMembers || []),
      ...(working.politicians || []),
    ];
    vp = candidates.find((c) => c && (c.id === candidateId || c.name === candidateId));
    if (!vp && working.presidentialPrimaries?.conventionData?.vpRoster) {
      vp = working.presidentialPrimaries.conventionData.vpRoster.find((c) => c.id === candidateId || c.name === candidateId);
    }
    if (!vp) return game;

    working.selectedVp = vp;
    working.selectedVpId = vp.id;

    const playerParty = working.player?.custom ? 'player' : (working.player?.baseTemplateId || 'people');
    if (working.presidentialPrimaries) {
      working.presidentialPrimaries.vpSelectionByParty = working.presidentialPrimaries.vpSelectionByParty || {};
      working.presidentialPrimaries.vpSelectionByParty[playerParty] = vp.name;
      if (working.presidentialPrimaries.conventionData) {
        working.presidentialPrimaries.conventionData.selectedVp = vp;
        working.presidentialPrimaries.conventionData.selectedVpId = vp.id;
      }
    }

    let angleNote = '';

    // Apply strategic angle instant benefits
    if (vp.strategicAngle === 'factional_peacekeeper') {
      // +15 Happiness and +10 Confidence to major rival faction
      const targetFid = vp.targetFactionId || vp.factionId;
      if (targetFid) {
        if (working.factionStandings) {
          const curH = Number(working.factionStandings[targetFid] ?? 60);
          working.factionStandings[targetFid] = clamp(round(curH + 15, 1), 0, 100);
        }
        if (working.factionHappiness) {
          const curH = Number(working.factionHappiness[targetFid] ?? 60);
          working.factionHappiness[targetFid] = clamp(round(curH + 15, 1), 0, 100);
        }
        if (working.factionConfidence) {
          const curC = Number(working.factionConfidence[targetFid] ?? 60);
          working.factionConfidence[targetFid] = clamp(round(curC + 10, 1), 0, 100);
        }
        if (Array.isArray(working.factions)) {
          working.factions = working.factions.map((f) => {
            if (f.id === targetFid || f.name === targetFid) {
              return {
                ...f,
                happiness: clamp(round((f.happiness || 60) + 15, 1), 0, 100),
                confidence: clamp(round((f.confidence || 60) + 10, 1), 0, 100),
              };
            }
            return f;
          });
        }
      }
      angleNote = `Factional Peacekeeper accord: ${vp.name} cements party unity (+15 Happiness, +10 Confidence to ${vp.targetFactionName || 'rival wing'}).`;
    } else if (vp.strategicAngle === 'ideological_complement') {
      // Balances ticket, lifting suburban independent trust by +4.0
      working.trust = working.trust || {};
      working.trust.independents = clamp(round((working.trust.independents || 50) + 4.0, 1), 0, 100);
      if (typeof working.trust.suburban === 'number') {
        working.trust.suburban = clamp(round(working.trust.suburban + 4.0, 1), 0, 100);
      }
      angleNote = `Ideological Complement: ${vp.name} balances the ticket (+4.0 Suburban Independent Trust).`;
    } else if (vp.strategicAngle === 'attack_dog') {
      // Delivers +2.0% national base turnout lift
      working.vpBaseTurnoutLift = 2.0;
      angleNote = `High-Energy Attack Dog: ${vp.name} takes the fight to the airwaves (+2.0% national base turnout).`;
    } else {
      // Home-State / Regional Anchor: delivers +3.5% to +5.0% home-state lift and +1.5% regional coattails
      working.vpHomeStateLift = vp.homeStateLift || 4.5;
      working.vpRegionalCoattailBoost = vp.regionalCoattailBoost || 1.5;
      angleNote = `Home-State / Regional Anchor: ${vp.name} solidifies battleground firewalls across ${vp.stateId || 'home state'}.`;
    }

    working.lastNote = `Vice Presidential Selection: ${vp.name} officially named running mate! ${angleNote}`;
    return working;
  }

  return {
    TRAIT_VULNERABILITY_WEIGHTS,
    computeCandidateVulnerabilityScore,
    getCandidateScandalOddsMultiplier,
    getVulnerabilityTier,
    getQualitativeVettingReport,
    getOrAssignCandidateVulnerability,
    vetCandidateAction,
    evaluateCampaignScandals,
    resolveScandalCrisis,
    calculateCandidateElectability,
    CANDIDATE_ELECTABILITY_TRAIT_MODIFIERS,
    generateVpRunningMateShortlist,
    auditVpAction,
    evaluateVpScandal,
    resolveVpSelectionWithWarRoom,
    FALLBACK_RUNNING_MATES,
  };
});
