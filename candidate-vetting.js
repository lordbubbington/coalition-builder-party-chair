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

    // Check treasury cost ($500,000)
    const cost = 0.5; // $500K in $M units
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
    // Also check primaryFields
    if (game.primaryFields) {
      Object.values(game.primaryFields).forEach((fList) => {
        if (Array.isArray(fList)) pools.push(...fList);
      });
    }

    pol = pools.find((c) => (c.id === candidateId || c.name === candidateId));
    if (!pol) {
      // Create minimal politician wrapper if not found in standard arrays
      pol = { id: candidateId, name: payload.candidateName || candidateId };
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
  };
});
