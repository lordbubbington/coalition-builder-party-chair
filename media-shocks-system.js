/* ============================================================================
 * COALITION BUILDER: PARTY CHAIR — v0.18.4 MEDIA ECOSYSTEM & DYNAMIC SHOCKS
 * Standalone Module: Proposal #4 (Media Ecosystem & Information Wars) &
 *                    Proposal #8 (Dynamic Economic & Geopolitical Shocks)
 * Exposes window.MediaShocksSystem (browser) and module.exports (Node tests).
 * Strictly deterministic: strictly deterministic seeded hashing.
 * ============================================================================ */
(function (global) {
  'use strict';

  // --------------------------------------------------------------------------
  // DETERMINISTIC HELPERS (SEEDED HASHING ONLY)
  // --------------------------------------------------------------------------
  function clamp(v, lo, hi) {
    const n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  function round(v, d = 2) {
    const f = Math.pow(10, d);
    return Math.round((Number(v) || 0) * f) / f;
  }

  function hashFloat(str) {
    let h = 2166136261;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 100000) / 100000;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getPlayerKey(game) {
    return game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
  }

  function getPrimaryRivalKey(game) {
    const pKey = getPlayerKey(game);
    if (pKey === 'people') return 'heritage';
    if (pKey === 'heritage') return 'people';
    const gov = game?.governingParty;
    if (gov && gov !== pKey && ['people', 'heritage'].includes(gov)) return gov;
    return 'people';
  }

  // --------------------------------------------------------------------------
  // PROPOSAL #4: MEDIA ECOSYSTEM CATALOG & BASELINES
  // --------------------------------------------------------------------------
  const MEDIA_CHANNELS = [
    {
      id: 'broadcast',
      name: 'Broadcast',
      fullName: 'Legacy / Broadcast',
      color: '#60a5fa',
      desc: 'High Moderate/Independent persuasion, slow-moving; dampens incoming October Surprises.',
    },
    {
      id: 'cable',
      name: 'Cable',
      fullName: 'Partisan Cable / Talk',
      color: '#f59e0b',
      desc: 'High base enthusiasm & fundraising; over-indexing (>75) penalizes Independents Trust.',
    },
    {
      id: 'digital',
      name: 'Digital',
      fullName: 'Digital / Podcasts / Short-Form',
      color: '#a78bfa',
      desc: 'High youth/low-propensity turnout & narrative velocity; >=45 cuts Tier 1-3 Media Blackout by 50%.',
    },
    {
      id: 'local',
      name: 'Local',
      fullName: 'Local Press',
      color: '#34d399',
      desc: 'Buffers down-ballot House/Senate incumbents against national wave drags; dampens surprises.',
    },
  ];

  const CHANNEL_IDS = MEDIA_CHANNELS.map((c) => c.id);

  // Realistic 2028 party baselines (0-100)
  const MEDIA_BASELINES_2028 = {
    people:       { broadcast: 64, cable: 56, digital: 58, local: 54 },
    heritage:     { broadcast: 52, cable: 70, digital: 64, local: 56 },
    liberty:      { broadcast: 16, cable: 24, digital: 42, local: 18 },
    green:        { broadcast: 14, cable: 16, digital: 38, local: 22 },
    constitution: { broadcast: 10, cable: 22, digital: 28, local: 16 },
    socialist:    { broadcast: 10, cable: 14, digital: 40, local: 15 },
    custom:       { broadcast: 18, cable: 18, digital: 28, local: 20 },
  };

  // Persona-matched rival AI channel preferences
  const RIVAL_CHANNEL_PREFS = {
    heritage:     ['cable', 'digital', 'local', 'broadcast'],
    people:       ['broadcast', 'digital', 'local', 'cable'],
    liberty:      ['digital', 'cable', 'broadcast', 'local'],
    green:        ['digital', 'local', 'broadcast', 'cable'],
    constitution: ['cable', 'local', 'digital', 'broadcast'],
    socialist:    ['digital', 'local', 'cable', 'broadcast'],
    default:      ['digital', 'broadcast', 'local', 'cable'],
  };

  function buildPartyMediaEntry(partyId, customOrigin = null) {
    const base = MEDIA_BASELINES_2028[partyId] || MEDIA_BASELINES_2028.custom;
    const entry = {
      broadcast: base.broadcast,
      cable: base.cable,
      digital: base.digital,
      local: base.local,
      upkeepChannels: [],
      counterPenalties: [],
    };
    if (customOrigin === 'executive_third_way') {
      entry.broadcast = clamp(entry.broadcast + 15, 0, 100);
    } else if (customOrigin === 'grassroots_viral') {
      entry.digital = clamp(entry.digital + 20, 0, 100);
    } else if (customOrigin === 'major_schism') {
      entry.broadcast = clamp(entry.broadcast + 10, 0, 100);
      entry.cable = clamp(entry.cable + 10, 0, 100);
    } else if (customOrigin === 'civic_reform') {
      entry.local = clamp(entry.local + 8, 0, 100);
      entry.broadcast = clamp(entry.broadcast + 8, 0, 100);
    }
    return entry;
  }

  function createInitialMediaEcosystem(game) {
    const eco = {};
    const keys = ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'];
    const pKey = getPlayerKey(game);
    const customOrigin = game?.player?.customOrigin || game?.player?.origin || null;

    keys.forEach((k) => {
      eco[k] = buildPartyMediaEntry(k, k === pKey ? customOrigin : null);
    });
    if (game?.player?.custom || pKey === 'player') {
      eco.player = buildPartyMediaEntry('custom', customOrigin);
    }
    return eco;
  }

  function normalizeMediaEcosystem(parsedEco, game) {
    const defaults = createInitialMediaEcosystem(game);
    if (!parsedEco || typeof parsedEco !== 'object') return defaults;
    const out = { ...defaults };
    Object.keys(parsedEco).forEach((pid) => {
      const raw = parsedEco[pid];
      if (!raw || typeof raw !== 'object') return;
      const fb = defaults[pid] || buildPartyMediaEntry('custom');
      out[pid] = {
        broadcast: clamp(raw.broadcast ?? fb.broadcast, 0, 100),
        cable: clamp(raw.cable ?? fb.cable, 0, 100),
        digital: clamp(raw.digital ?? fb.digital, 0, 100),
        local: clamp(raw.local ?? fb.local, 0, 100),
        upkeepChannels: Array.isArray(raw.upkeepChannels) ? raw.upkeepChannels.filter((c) => CHANNEL_IDS.includes(c)) : [],
        counterPenalties: Array.isArray(raw.counterPenalties)
          ? raw.counterPenalties.filter((cp) => cp && CHANNEL_IDS.includes(cp.channel) && Number(cp.cyclesRemaining) > 0)
          : [],
      };
    });
    return out;
  }

  function resolveEcoPartyKey(game, partyId) {
    if (!partyId || partyId === 'player') return getPlayerKey(game);
    return partyId;
  }

  function getEffectiveChannelReach(game, partyId, channel) {
    const eco = game?.mediaEcosystem;
    if (!eco || !CHANNEL_IDS.includes(channel)) return 40;
    const key = resolveEcoPartyKey(game, partyId);
    const rec = eco[key] || eco[getPlayerKey(game)] || null;
    if (!rec) return 30;
    const base = Number(rec[channel] ?? 30);
    const penalty = (rec.counterPenalties || [])
      .filter((cp) => cp && cp.channel === channel && Number(cp.cyclesRemaining) > 0)
      .reduce((sum, cp) => sum + Number(cp.amount || 0), 0);
    return clamp(round(base - penalty, 1), 0, 100);
  }

  function getPartyCompositeReach(game, partyId) {
    const b = getEffectiveChannelReach(game, partyId, 'broadcast');
    const c = getEffectiveChannelReach(game, partyId, 'cable');
    const d = getEffectiveChannelReach(game, partyId, 'digital');
    const l = getEffectiveChannelReach(game, partyId, 'local');
    return round((b * 0.30 + c * 0.20 + d * 0.30 + l * 0.20), 2);
  }

  function getReachDifferential(game, partyId = 'player', rivalPartyId = null) {
    const pKey = resolveEcoPartyKey(game, partyId);
    const rKey = rivalPartyId ? resolveEcoPartyKey(game, rivalPartyId) : getPrimaryRivalKey(game);
    return round(getPartyCompositeReach(game, pKey) - getPartyCompositeReach(game, rKey), 2);
  }

  // Ad persuasion modifier: -15% to +20% (0.85x to 1.20x) based on reach differential
  function getAdPersuasionMultiplier(game, partyId = 'player', rivalPartyId = null) {
    if (!game?.mediaEcosystem) return 1.0;
    const diff = getReachDifferential(game, partyId, rivalPartyId);
    const adj = clamp((diff / 100) * 0.50, -0.15, 0.20);
    return round(1.0 + adj, 3);
  }

  // Positive reach differential slows ad saturation buildup (up to 28% slower)
  function getAdSaturationScale(game, partyId = 'player', rivalPartyId = null) {
    if (!game?.mediaEcosystem) return 1.0;
    const diff = getReachDifferential(game, partyId, rivalPartyId);
    if (diff <= 0) return 1.0;
    return round(clamp(1.0 - diff * 0.006, 0.72, 1.0), 3);
  }

  // High Digital/Cable (>=60 avg) amplifies opponent October Surprises by 1.35x;
  // High Broadcast/Local (>=60 avg) dampens incoming surprises by 0.75x.
  function getOctoberSurpriseMultiplier(game, attackerPartyId, defenderPartyId = 'player') {
    if (!game?.mediaEcosystem) return 1.0;
    const attDigital = getEffectiveChannelReach(game, attackerPartyId, 'digital');
    const attCable = getEffectiveChannelReach(game, attackerPartyId, 'cable');
    const attAvg = (attDigital + attCable) / 2;

    const defBroadcast = getEffectiveChannelReach(game, defenderPartyId, 'broadcast');
    const defLocal = getEffectiveChannelReach(game, defenderPartyId, 'local');
    const defAvg = (defBroadcast + defLocal) / 2;

    let mult = 1.0;
    if (attAvg >= 60) mult *= 1.35;
    if (defAvg >= 60) mult *= 0.75;
    return round(mult, 3);
  }

  // Tier 1-3 minor/custom parties with digital >= 45 cut Media Blackout penalties by 50%
  function applyBlackoutBypass(profile, game, partyId = 'player') {
    if (!profile || !game?.mediaEcosystem) return profile;
    const tier = Number(profile.tier ?? 0);
    if (tier < 1 || tier > 3 || !profile.mediaBlackout) return profile;
    const dig = getEffectiveChannelReach(game, partyId, 'digital');
    if (dig < 45) return profile;

    const earned = Number(profile.earnedMediaMultiplier ?? 0.5);
    const fund = Number(profile.fundraisingMultiplier ?? 0.8);
    const waveCap = Number(profile.waveMomentumCap ?? 2.0);
    return {
      ...profile,
      earnedMediaMultiplier: round(1.0 - (1.0 - earned) * 0.5, 3),
      fundraisingMultiplier: round(1.0 - (1.0 - fund) * 0.5, 3),
      waveMomentumCap: round(waveCap + (10.0 - waveCap) * 0.5, 2),
      digitalBlackoutBypass: true,
    };
  }

  // Local Press buffers down-ballot House/Senate incumbents against national wave drags
  function getLocalIncumbentWaveBuffer(game, incumbentPartyId, natEnv) {
    if (!game?.mediaEcosystem || !incumbentPartyId) return 0;
    const env = Number(natEnv || 0);
    if (Math.abs(env) < 0.5) return 0;
    const localReach = getEffectiveChannelReach(game, incumbentPartyId, 'local');
    if (localReach < 45) return 0;
    // Positive natEnv favors 'people' (Dem), negative favors 'heritage' (Rep)
    const isDem = incumbentPartyId === 'people';
    const isRep = incumbentPartyId === 'heritage';
    const facingHeadwind = (isDem && env < 0) || (isRep && env > 0);
    if (!facingHeadwind) return 0;
    const bufferFrac = clamp(((localReach - 40) / 60) * 0.25, 0, 0.25);
    const bufferMag = Math.abs(env) * bufferFrac;
    return round(isDem ? bufferMag : -bufferMag, 2);
  }

  // Digital volatility on debate gaffes
  function getDigitalGaffeVolatilityMultiplier(game, partyId = 'player') {
    if (!game?.mediaEcosystem) return 1.0;
    const dig = getEffectiveChannelReach(game, partyId, 'digital');
    if (dig >= 65) return 1.25;
    if (dig >= 50) return 1.12;
    return 1.0;
  }

  // SOEE Rival AI: opponent chairs invest in 1-2 media channels per cycle matching persona
  function runRivalMediaInvestments(game) {
    if (!game) return game;
    const eco = normalizeMediaEcosystem(game.mediaEcosystem, game);
    const pKey = getPlayerKey(game);
    const seed = game.seed || 2028;
    const year = game.year || 2028;
    const logNotes = [];

    Object.keys(eco).forEach((rid) => {
      if (rid === pKey || rid === 'player') return;
      const prefs = RIVAL_CHANNEL_PREFS[rid] || RIVAL_CHANNEL_PREFS.default;
      const isMajor = rid === 'people' || rid === 'heritage';
      const partyRec = game.parties?.[rid];
      let availCash = Number(partyRec?.treasury ?? (isMajor ? 24 : 10));
      const slots = isMajor ? 2 : 1;
      const entry = {
        ...eco[rid],
        upkeepChannels: [...(eco[rid].upkeepChannels || [])],
      };

      let invested = 0;
      for (let i = 0; i < prefs.length && invested < slots; i++) {
        const ch = prefs[i];
        // Slight deterministic tie-break variation across cycles
        const pickIdx = (i === 0 && hashFloat(`${seed}:${year}:ai-media:${rid}`) > 0.72 && prefs[1]) ? 1 : i;
        const targetCh = prefs[pickIdx];
        if (entry.upkeepChannels.includes(targetCh)) continue;
        if (availCash >= 6) {
          entry[targetCh] = clamp(round(entry[targetCh] + 8, 1), 0, 100);
          entry.upkeepChannels.push(targetCh);
          availCash = round(availCash - 6, 2);
          invested++;
        } else if (targetCh === 'digital') {
          // Low-budget minor party organic digital push
          entry.digital = clamp(round(entry.digital + 3, 1), 0, 100);
          entry.upkeepChannels.push('digital');
          invested++;
        }
      }

      if (partyRec && Number.isFinite(partyRec.treasury)) {
        partyRec.treasury = Math.max(0, availCash);
      }
      eco[rid] = entry;
      if (invested > 0) {
        logNotes.push(`${rid}: invested in ${entry.upkeepChannels.slice(-invested).join(', ')}`);
      }
    });

    return {
      ...game,
      mediaEcosystem: eco,
      mediaAiLastNotes: logNotes,
    };
  }

  // --------------------------------------------------------------------------
  // PROPOSAL #8: DYNAMIC ECONOMIC & GEOPOLITICAL SHOCKS CATALOG
  // --------------------------------------------------------------------------
  const MACRO_SHOCK_CATALOG = [
    {
      id: 'ai_labor_disruption',
      title: 'AI & Automation Labor Disruption',
      shortTitle: 'AI Labor Shock',
      category: 'Tech & Labor',
      polarity: 'negative',
      totalCycles: 3,
      governingApprovalByStage: { onset: -2, peak: -3, resolution: -1 },
      smallDonorYieldMult: 1.0,
      salienceMultipliers: {
        'frontier-ai-oversight-compute': 2.2,
        'cost-of-living': 2.0,
        'minimum-wage': 2.0,
        'business-regulation': 1.8,
        'populist-revolt': 1.8,
        'tax-economy': 1.8,
      },
      regionalShifts: {
        states: ['MI', 'OH', 'PA', 'WI', 'IN', 'IL', 'CA', 'WA', 'NY', 'MA', 'TX', 'VA'],
        populistBoost: 1.8,
        leanDelta: 0.6,
      },
      pivotIssues: ['frontier-ai-oversight-compute', 'cost-of-living'],
      pivotTargetStance: 4.5,
      summary: 'Rapid enterprise AI deployment triggers white-collar layoffs and union pushback across Rust Belt & Tech metros.',
      dossierLines: [
        'Salience Surge: Frontier AI Oversight (2.2x), Cost of Living (2.0x), Minimum Wage (2.0x).',
        'Coalition Impact: Populist surge in Rust Belt & Tech metros; moderate governing approval pressure.',
        'Chair Counterplay: Use Crisis Pivot to align tech/labor sliders at 50% faction friction or pass Emergency Response.',
      ],
      chyronByStage: {
        onset: 'BREAKING: Major white-collar AI restructurings jolt Tech corridors and Rust Belt plants — labor angst surges.',
        peak: 'CRISIS PEAK: Automation layoffs dominate town halls; voters demand AI guardrails and retraining.',
        resolution: 'TRANSITION: New AI labor compacts stabilize metro job markets as productivity gains filter through.',
      },
    },
    {
      id: 'stagflation_spiral',
      title: 'Stagflation Spiral',
      shortTitle: 'Stagflation Crisis',
      category: 'Macroeconomic',
      polarity: 'negative',
      totalCycles: 3,
      governingApprovalByStage: { onset: -6, peak: -6, resolution: -4 },
      smallDonorYieldMult: 0.85,
      salienceMultipliers: {
        'cost-of-living': 2.4,
        'taxes-spending': 2.1,
        'tax-economy': 2.1,
        'monetary-policy': 2.0,
        'corporate-tax-rate': 1.7,
      },
      regionalShifts: {
        states: ['PA', 'MI', 'WI', 'AZ', 'NV', 'GA', 'NC'],
        populistBoost: 1.2,
        leanDelta: 0,
      },
      pivotIssues: ['cost-of-living', 'taxes-spending'],
      pivotTargetStance: 5.5,
      summary: 'Sticky inflation collides with slowing GDP growth, hammering household budgets and small-donor fundraising.',
      dossierLines: [
        'Salience Surge: Cost of Living (2.4x), Taxes & Spending (2.1x), Monetary Policy (2.0x).',
        'Macro Penalty: -6 governing approval/cycle and -15% small-donor fundraising yield nationwide.',
        'Chair Counterplay: Crisis Pivot on affordability sliders at half friction or shorten arc by 1 cycle.',
      ],
      chyronByStage: {
        onset: 'ECONOMY ALERT: CPI spikes above 4.8% as quarterly growth stalls — stagflation fears grip swing states.',
        peak: 'STAGFLATION SPIRAL: Household grocery and housing costs squeeze families; small-donor giving drops 15%.',
        resolution: 'SOFTENING INFLATION: Fed tightening cools price pressures as wage growth catches up.',
      },
    },
    {
      id: 'geopolitical_flashpoint',
      title: 'Geopolitical Flashpoint',
      shortTitle: 'Global Flashpoint',
      category: 'Foreign Crisis',
      polarity: 'negative',
      totalCycles: 3,
      governingApprovalByStage: { onset: 5, peak: 0, resolution: -8 },
      smallDonorYieldMult: 1.0,
      salienceMultipliers: {
        'foreign-policy': 2.3,
        'defense-spending': 2.2,
        'nato-global-security-hegemony': 2.0,
        'iran-policy': 1.9,
      },
      regionalShifts: {
        states: ['VA', 'NC', 'FL', 'TX', 'GA', 'AZ'],
        populistBoost: 0.8,
        leanDelta: 0,
      },
      pivotIssues: ['foreign-policy', 'defense-spending'],
      pivotTargetStance: 6.0,
      summary: 'An overseas security crisis sparks an initial Rally-Round-the-Flag boost (+5) before turning into bitter war fatigue (-8).',
      dossierLines: [
        'Salience Surge: Foreign Policy (2.3x), Defense Spending (2.2x), NATO Security (2.0x).',
        'Arc Trajectory: +5 governing approval Rally in Cycle 1 (Onset), flattening in Peak, flipping to -8 war-fatigue by Cycle 3.',
        'Chair Counterplay: Pivot foreign/defense positioning early or pass Emergency Response to exit war-fatigue faster.',
      ],
      chyronByStage: {
        onset: 'FLASHPOINT: Overseas naval standoff triggers bipartisan Rally-Round-the-Flag surge (+5% approval).',
        peak: 'PROLONGED STANDOFF: Defense supplemental splits Congress as allies press Washington for clarity.',
        resolution: 'WAR FATIGUE: Protracted entanglement drains public patience (-8% governing approval drag).',
      },
    },
    {
      id: 'sovereign_debt_crunch',
      title: 'Sovereign Debt & Bond Crunch',
      shortTitle: 'Debt Crunch',
      category: 'Fiscal Crisis',
      polarity: 'negative',
      totalCycles: 3,
      governingApprovalByStage: { onset: -3, peak: -4, resolution: -2 },
      smallDonorYieldMult: 0.95,
      superPacFrictionRisk: true,
      salienceMultipliers: {
        'taxes-spending': 2.3,
        'tax-economy': 2.2,
        'monetary-policy': 2.0,
        'corporate-tax-rate': 1.9,
        'medicare-social-security': 1.8,
      },
      regionalShifts: {
        states: ['NY', 'NJ', 'CT', 'FL', 'AZ', 'VA'],
        populistBoost: 0.5,
        leanDelta: 0,
      },
      pivotIssues: ['taxes-spending', 'corporate-tax-rate'],
      pivotTargetStance: 5.5,
      summary: 'Treasury yields surge past 6%, forcing a stark austerity vs. tax-hike showdown and straining Super PAC alliances.',
      dossierLines: [
        'Salience Surge: Taxes & Spending (2.3x), Monetary Policy (2.0x), Corporate Tax Rate (1.9x).',
        'Donor Risk: Binary austerity vs. tax-hike clash creates Super PAC friction if fiscal stances drift.',
        'Chair Counterplay: Use Crisis Pivot to recalibrate fiscal sliders with 50% reduced faction backlash.',
      ],
      chyronByStage: {
        onset: 'BOND MARKET JOLT: 10-year Treasury yields surge — Capitol Hill braces for austerity vs. tax-hike showdown.',
        peak: 'DEBT CRUNCH PEAK: Rating agencies warn on deficit trajectory; Super PAC megadonors demand fiscal clarity.',
        resolution: 'FISCAL ACCORD: Bipartisan deficit framework calms bond auctions and eases borrowing costs.',
      },
    },
    {
      id: 'clean_energy_boom',
      title: 'Clean Energy & Grid Boom',
      shortTitle: 'Clean Energy Boom',
      category: 'Economic Boom',
      polarity: 'positive',
      totalCycles: 2,
      governingApprovalByStage: { onset: 4, peak: 4, resolution: 4 },
      smallDonorYieldMult: 1.05,
      salienceMultipliers: {
        'climate-action': 2.0,
        'energy-mix': 2.1,
        'green-standards': 1.9,
        'climate-policy': 2.0,
      },
      regionalShifts: {
        states: ['AZ', 'NV', 'CO', 'NM', 'CA', 'WA', 'TX'],
        populistBoost: 0,
        leanDelta: 0.8,
      },
      pivotIssues: ['energy-mix', 'climate-action'],
      pivotTargetStance: 4.5,
      summary: 'Grid-scale battery and solar manufacturing surges across the West and Sunbelt, lifting governing approval by +4/cycle.',
      dossierLines: [
        'Salience Surge: Energy Mix (2.1x), Climate Action (2.0x), Green Standards (1.9x).',
        'Macro Tailwind: +4 governing approval/cycle and regional lean shifts across Sunbelt & Western grid hubs.',
        'Chair Opportunity: Pivot energy/climate sliders at half friction to ride the clean-tech wave.',
      ],
      chyronByStage: {
        onset: 'ENERGY BOOM: Record clean-grid investments spark hiring wave across Sunbelt and Mountain West (+4% approval).',
        peak: 'GRID EXPANSION: Utility costs drop in solar-storage corridors as domestic battery output doubles.',
        resolution: 'BOOM MATURES: Clean energy manufacturing cements permanent regional economic gains.',
      },
    },
    {
      id: 'manufacturing_renaissance',
      title: 'Domestic Manufacturing Renaissance',
      shortTitle: 'Mfg. Renaissance',
      category: 'Industrial Boom',
      polarity: 'positive',
      totalCycles: 3,
      governingApprovalByStage: { onset: 4, peak: 4, resolution: 3 },
      smallDonorYieldMult: 1.05,
      salienceMultipliers: {
        'business-regulation': 1.9,
        'cost-of-living': 1.8,
        'minimum-wage': 1.8,
        'taxes-spending': 1.7,
        'tax-economy': 1.8,
      },
      regionalShifts: {
        states: ['MI', 'OH', 'PA', 'WI', 'IN', 'NC', 'GA'],
        populistBoost: 0.5,
        leanDelta: 0.7,
      },
      pivotIssues: ['business-regulation', 'minimum-wage'],
      pivotTargetStance: 5.0,
      summary: 'Semiconductor and industrial reshoring revitalizes Rust Belt and Piedmont factory towns (+4 governing approval).',
      dossierLines: [
        'Salience Surge: Business Regulation (1.9x), Cost of Living (1.8x), Minimum Wage (1.8x).',
        'Macro Tailwind: +4 governing approval/cycle and regional lean shifts across Industrial Midwest & Piedmont.',
        'Chair Opportunity: Align industrial & wage sliders with Crisis Pivot at half the normal faction friction.',
      ],
      chyronByStage: {
        onset: 'INDUSTRIAL SURGE: Reshored semiconductor and EV plants open across Midwest & Piedmont (+4% approval).',
        peak: 'FACTORY BOOM: Blue-collar wage growth hits 20-year high across PA, MI, OH, and WI.',
        resolution: 'NEW BASELINE: Reshored supply chains stabilize regional employment across swing industrial counties.',
      },
    },
  ];

  function getShockDef(arcId) {
    return MACRO_SHOCK_CATALOG.find((s) => s.id === arcId) || MACRO_SHOCK_CATALOG[0];
  }

  function stageForCycle(cycleIndex, totalCycles) {
    if (cycleIndex <= 1) return 'onset';
    if (cycleIndex >= totalCycles) return 'resolution';
    return 'peak';
  }

  function instantiateShockArc(def, startYear) {
    const totalCycles = clamp(Number(def.totalCycles || 3), 2, 4);
    return {
      id: def.id,
      title: def.title,
      shortTitle: def.shortTitle,
      category: def.category,
      polarity: def.polarity || 'negative',
      stage: 'onset',
      cycleIndex: 1,
      totalCycles,
      startYear: Number(startYear || 2028),
      salienceMultipliers: { ...(def.salienceMultipliers || {}) },
      summary: def.summary,
      dossierLines: [...(def.dossierLines || [])],
      emergencyShortened: false,
      pivotUsedYear: null,
    };
  }

  function pickDeterministicShock(seed, year, excludeId = null) {
    const pool = MACRO_SHOCK_CATALOG.filter((s) => s.id !== excludeId);
    const idx = Math.floor(hashFloat(`${seed || 2028}:${year}:macro-shock-arc`) * pool.length);
    return instantiateShockArc(pool[idx] || MACRO_SHOCK_CATALOG[0], year);
  }

  function getIssueSalienceMultiplier(game, issueId) {
    const arc = game?.activeMacroArc;
    if (!arc || !issueId) return 1.0;
    const raw = Number(arc.salienceMultipliers?.[issueId] || 0);
    if (!raw || raw <= 1.0) return 1.0;
    // Slight stage modulation while strictly keeping affected issues within [1.5, 2.5]
    const stageFactor = arc.stage === 'peak' ? 1.08 : (arc.stage === 'resolution' ? 0.90 : 0.96);
    return round(clamp(raw * stageFactor, 1.5, 2.5), 2);
  }

  function getDebateSalienceMultiplier(game, questions = []) {
    if (!game?.activeMacroArc || !Array.isArray(questions) || !questions.length) return 1.0;
    const mults = questions.map((q) => getIssueSalienceMultiplier(game, q?.issueId));
    const maxM = Math.max(...mults, 1.0);
    if (maxM <= 1.0) return 1.0;
    // Blend average and peak so debate swings feel impactful without breaking bounds
    const avg = mults.reduce((s, v) => s + v, 0) / mults.length;
    return round(clamp(avg * 0.65 + maxM * 0.35, 1.0, 2.2), 2);
  }

  function getSmallDonorYieldMultiplier(game) {
    let mult = 1.0;
    const arc = game?.activeMacroArc;
    if (arc) {
      const def = getShockDef(arc.id);
      if (def && Number.isFinite(def.smallDonorYieldMult)) {
        mult *= def.smallDonorYieldMult;
      }
    }
    // Partisan Cable channel boosts small-donor fundraising slightly (+0% to +12%)
    if (game?.mediaEcosystem) {
      const cable = getEffectiveChannelReach(game, 'player', 'cable');
      if (cable > 50) {
        mult *= 1.0 + clamp((cable - 50) / 50 * 0.12, 0, 0.12);
      }
    }
    return round(mult, 3);
  }

  // --------------------------------------------------------------------------
  // LIFECYCLE HOOKS: INITIALIZE, NORMALIZE, ADVANCE CYCLE
  // --------------------------------------------------------------------------
  function initializeState(game) {
    if (!game) return game;
    const mediaEcosystem = createInitialMediaEcosystem(game);
    const activeMacroArc = pickDeterministicShock(game.seed || 2028, game.year || 2028, null);
    return {
      ...game,
      mediaEcosystem,
      activeMacroArc,
      macroArcHistory: [],
    };
  }

  function normalizeState(ready, parsed = {}) {
    if (!ready) return ready;
    const mediaEcosystem = normalizeMediaEcosystem(parsed?.mediaEcosystem || ready.mediaEcosystem, ready);
    let activeMacroArc = parsed?.activeMacroArc || ready.activeMacroArc || null;
    if (!activeMacroArc || !activeMacroArc.id) {
      activeMacroArc = pickDeterministicShock(ready.seed || 2028, ready.year || 2028, null);
    } else {
      const def = getShockDef(activeMacroArc.id);
      const totalCycles = clamp(Number(activeMacroArc.totalCycles || def.totalCycles || 3), 2, 4);
      const cycleIndex = clamp(Number(activeMacroArc.cycleIndex || 1), 1, totalCycles);
      activeMacroArc = {
        ...instantiateShockArc(def, activeMacroArc.startYear || ready.year || 2028),
        ...activeMacroArc,
        totalCycles,
        cycleIndex,
        stage: activeMacroArc.stage || stageForCycle(cycleIndex, totalCycles),
        salienceMultipliers: activeMacroArc.salienceMultipliers || { ...def.salienceMultipliers },
      };
    }
    const macroArcHistory = Array.isArray(parsed?.macroArcHistory)
      ? parsed.macroArcHistory
      : (Array.isArray(ready.macroArcHistory) ? ready.macroArcHistory : []);
    return {
      ...ready,
      mediaEcosystem,
      activeMacroArc,
      macroArcHistory,
    };
  }

  function advanceCycle(game, nextYear) {
    if (!game) return game;
    const year = Number(nextYear || (game.year || 2028) + 2);

    // 1. Media Ecosystem natural decay (-2/cycle without upkeep) & counter-narrative expiry
    const eco = normalizeMediaEcosystem(game.mediaEcosystem, game);
    Object.keys(eco).forEach((pid) => {
      const rec = { ...eco[pid] };
      const upkeep = new Set(Array.isArray(rec.upkeepChannels) ? rec.upkeepChannels : []);
      CHANNEL_IDS.forEach((ch) => {
        if (!upkeep.has(ch)) {
          rec[ch] = clamp(round(Number(rec[ch] || 0) - 2, 1), 0, 100);
        }
      });
      rec.upkeepChannels = [];
      rec.counterPenalties = (rec.counterPenalties || [])
        .map((cp) => ({ ...cp, cyclesRemaining: Number(cp.cyclesRemaining || 0) - 1 }))
        .filter((cp) => cp.cyclesRemaining > 0);
      eco[pid] = rec;
    });

    // Cable over-indexing (>75) trust penalty for player
    const pKey = getPlayerKey(game);
    let nextTrust = game.trust ? { ...game.trust } : { supporters: 65, independents: 40, opponents: 12 };
    if (Number(eco[pKey]?.cable || 0) > 75) {
      nextTrust.independents = clamp(round((nextTrust.independents ?? 40) - 1.5, 1), 0, 100);
    }

    // 2. Advance multi-cycle Macro Shock Arc (onset -> peak -> resolution -> next arc)
    let curArc = game.activeMacroArc ? { ...game.activeMacroArc } : pickDeterministicShock(game.seed || 2028, year, null);
    const history = Array.isArray(game.macroArcHistory) ? [...game.macroArcHistory] : [];

    const nextCycleIndex = Number(curArc.cycleIndex || 1) + 1;
    if (nextCycleIndex > Number(curArc.totalCycles || 3)) {
      history.push({
        id: curArc.id,
        title: curArc.title,
        startYear: curArc.startYear || year - 4,
        endYear: year - 2,
        totalCycles: curArc.totalCycles,
        shortened: Boolean(curArc.emergencyShortened),
      });
      curArc = pickDeterministicShock(game.seed || 2028, year, curArc.id);
    } else {
      curArc.cycleIndex = nextCycleIndex;
      curArc.stage = stageForCycle(nextCycleIndex, curArc.totalCycles);
    }

    // 3. Apply active shock governing approval & regional lean shifts
    const def = getShockDef(curArc.id);
    const appDelta = Number(def.governingApprovalByStage?.[curArc.stage] ?? 0);
    let nextPresApp = Number(game.presidentialApproval ?? 48);
    if (appDelta !== 0) {
      nextPresApp = clamp(round(nextPresApp + appDelta, 1), 15, 85);
    }

    // Regional lean shifts for booms/disruptions
    const nextDrift = { ...(game.statePartisanDrift || {}) };
    if (def.regionalShifts && Array.isArray(def.regionalShifts.states) && def.regionalShifts.leanDelta) {
      const govSign = (game.governingParty === 'heritage') ? -1 : 1;
      const shift = def.polarity === 'positive'
        ? def.regionalShifts.leanDelta * govSign
        : -def.regionalShifts.leanDelta * govSign * 0.5;
      def.regionalShifts.states.forEach((st) => {
        nextDrift[st] = round(clamp(Number(nextDrift[st] || 0) + shift, -15, 15), 2);
      });
    }

    let updated = {
      ...game,
      mediaEcosystem: eco,
      trust: nextTrust,
      activeMacroArc: curArc,
      macroArcHistory: history.slice(-12),
      presidentialApproval: nextPresApp,
      statePartisanDrift: nextDrift,
    };

    // 4. SOEE Rival AI invests in 1-2 media channels matching persona
    updated = runRivalMediaInvestments(updated);
    return updated;
  }

  // --------------------------------------------------------------------------
  // CHAIR ACTIONS: invest-media-channel, launch-counter-narrative, crisis-pivot
  // --------------------------------------------------------------------------
  function consumeOrganizingAction(game) {
    const orgRem = typeof game.organizingActionsRemaining === 'number'
      ? game.organizingActionsRemaining
      : (typeof game.actionsLeft === 'number' ? game.actionsLeft : 0);
    if (orgRem < 1) return null;
    const nextOrg = Math.max(0, orgRem - 1);
    const nextAct = typeof game.actionsLeft === 'number' ? Math.max(0, game.actionsLeft - 1) : nextOrg;
    return { organizingActionsRemaining: nextOrg, actionsLeft: nextAct };
  }

  function handleAction(game, actionId, payload = {}) {
    if (!game) return null;
    const p = payload?.payload ? payload.payload : (payload || {});

    if (actionId === 'invest-media-channel') {
      const cost = 6;
      const channel = CHANNEL_IDS.includes(p.channel) ? p.channel : 'digital';
      const acts = consumeOrganizingAction(game);
      if (!acts) return { ...game, lastNote: 'No organizing actions remaining to invest in media channels.' };
      if ((game.treasury || 0) < cost) return { ...game, lastNote: `Need $${cost}M to invest in ${channel} media reach.` };

      const eco = normalizeMediaEcosystem(game.mediaEcosystem, game);
      const pKey = getPlayerKey(game);
      const rec = {
        ...eco[pKey],
        upkeepChannels: [...(eco[pKey].upkeepChannels || [])],
      };
      const before = Number(rec[channel] || 0);
      const after = clamp(round(before + 8, 1), 0, 100);
      rec[channel] = after;
      if (!rec.upkeepChannels.includes(channel)) rec.upkeepChannels.push(channel);
      eco[pKey] = rec;

      let nextTrust = game.trust ? { ...game.trust } : { supporters: 65, independents: 40, opponents: 12 };
      let cableWarn = '';
      if (channel === 'cable' && after > 75) {
        nextTrust.independents = clamp(round((nextTrust.independents ?? 40) - 2, 1), 0, 100);
        cableWarn = ' (Over-indexed Cable >75: -2 Independents Trust)';
      }
      const chObj = MEDIA_CHANNELS.find((c) => c.id === channel) || { fullName: channel };
      const note = `Invested $${cost}M in ${chObj.fullName}: reach ${before} → ${after} (+8 permanent, upkeep secured).${cableWarn}`;
      return {
        ...game,
        ...acts,
        treasury: round((game.treasury || 0) - cost, 2),
        mediaEcosystem: eco,
        trust: nextTrust,
        lastNote: note,
        yearLog: [...(game.yearLog || []), { year: game.year, turn: game.chairTurn, action: note }].slice(-80),
      };
    }

    if (actionId === 'launch-counter-narrative') {
      const cost = 4;
      const channel = CHANNEL_IDS.includes(p.channel) ? p.channel : 'broadcast';
      const targetPartyId = p.targetPartyId || p.rivalId || getPrimaryRivalKey(game);
      const acts = consumeOrganizingAction(game);
      if (!acts) return { ...game, lastNote: 'No organizing actions remaining for a counter-narrative blitz.' };
      if ((game.treasury || 0) < cost) return { ...game, lastNote: `Need $${cost}M to launch a counter-narrative.` };

      const eco = normalizeMediaEcosystem(game.mediaEcosystem, game);
      if (!eco[targetPartyId]) eco[targetPartyId] = buildPartyMediaEntry(targetPartyId);
      const targetRec = {
        ...eco[targetPartyId],
        counterPenalties: [...(eco[targetPartyId].counterPenalties || [])],
      };
      targetRec.counterPenalties.push({
        channel,
        amount: 7,
        cyclesRemaining: 2,
        sourcePartyId: getPlayerKey(game),
      });
      eco[targetPartyId] = targetRec;

      const chObj = MEDIA_CHANNELS.find((c) => c.id === channel) || { fullName: channel };
      const note = `Counter-Narrative Blitz ($${cost}M): suppressed ${targetPartyId} reach in ${chObj.fullName} by -7 for 2 cycles.`;
      return {
        ...game,
        ...acts,
        treasury: round((game.treasury || 0) - cost, 2),
        mediaEcosystem: eco,
        lastNote: note,
        yearLog: [...(game.yearLog || []), { year: game.year, turn: game.chairTurn, action: note }].slice(-80),
      };
    }

    if (actionId === 'crisis-pivot') {
      const arc = game.activeMacroArc;
      if (!arc) return { ...game, lastNote: 'No active national crisis or climate arc to pivot toward.' };
      const acts = consumeOrganizingAction(game);
      if (!acts) return { ...game, lastNote: 'No organizing actions remaining for Crisis Pivot.' };

      const mode = p.mode || 'slider_pivot';
      const def = getShockDef(arc.id);

      if (mode === 'emergency_response') {
        if (arc.polarity === 'positive') {
          return { ...game, lastNote: 'Emergency Response only applies to negative national crisis arcs.' };
        }
        if (arc.emergencyShortened) {
          return { ...game, lastNote: `Emergency Response already enacted for ${arc.title}.` };
        }
        const cost = 3;
        if ((game.treasury || 0) < cost) {
          return { ...game, lastNote: `Need $${cost}M to pass an Emergency Response package.` };
        }
        const newTotal = Math.max(Number(arc.cycleIndex || 1), Number(arc.totalCycles || 3) - 1);
        const nextArc = {
          ...arc,
          totalCycles: newTotal,
          stage: stageForCycle(arc.cycleIndex, newTotal),
          emergencyShortened: true,
        };
        const note = `Emergency Response passed ($${cost}M): shortened ${arc.title} by 1 cycle (${arc.totalCycles} → ${newTotal} cycles).`;
        return {
          ...game,
          ...acts,
          treasury: round((game.treasury || 0) - cost, 2),
          activeMacroArc: nextArc,
          lastNote: note,
          yearLog: [...(game.yearLog || []), { year: game.year, turn: game.chairTurn, action: note }].slice(-80),
        };
      }

      // Default mode: 'slider_pivot' — shift 2 issue sliders toward crisis target for half faction-friction penalty
      const issueIds = Array.isArray(p.issues) && p.issues.length >= 2
        ? p.issues.slice(0, 2)
        : (def.pivotIssues || ['cost-of-living', 'taxes-spending']).slice(0, 2);
      const targetVal = clamp(Number(p.targetStance ?? def.pivotTargetStance ?? 5.5), 1, 10);
      const nextPositions = { ...(game.issuePositions || {}) };
      const nextPlayerPositions = { ...(game.player?.issuePositions || {}) };

      issueIds.forEach((iid) => {
        const cur = Number(nextPositions[iid] ?? nextPlayerPositions[iid] ?? 5.5);
        const step = cur < targetVal ? Math.min(1.0, targetVal - cur) : -Math.min(1.0, cur - targetVal);
        const updatedVal = clamp(round(cur + step, 1), 1, 10);
        nextPositions[iid] = updatedVal;
        nextPlayerPositions[iid] = updatedVal;
      });

      // Half the normal faction-friction penalty (-1.5 instead of -3.0 on affected factions)
      const pKey = getPlayerKey(game);
      const nextFH = { ...(game.factionHappiness || {}) };
      const partyFacs = (game.factions || []).filter((f) => f && f.partyId === pKey);
      partyFacs.forEach((f) => {
        const curH = Number(nextFH[f.id] ?? 55);
        nextFH[f.id] = clamp(round(curH - 1.5, 1), 0, 100);
      });

      const nextTrust = {
        ...(game.trust || { supporters: 65, independents: 40, opponents: 12 }),
        independents: clamp(round((game.trust?.independents ?? 40) + 1.5, 1), 0, 100),
      };

      const note = `Crisis Pivot (${arc.shortTitle}): shifted ${issueIds.join(' & ')} toward crisis consensus at 50% faction friction (+1.5 Independents Trust).`;
      return {
        ...game,
        ...acts,
        issuePositions: nextPositions,
        player: { ...(game.player || {}), issuePositions: nextPlayerPositions },
        factionHappiness: nextFH,
        trust: nextTrust,
        activeMacroArc: { ...arc, pivotUsedYear: game.year || 2028 },
        lastNote: note,
        yearLog: [...(game.yearLog || []), { year: game.year, turn: game.chairTurn, action: note }].slice(-80),
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // UI MARKUP BUILDERS (CALLED VIA SURGICAL HOOKS IN app.js)
  // --------------------------------------------------------------------------
  function getChyronOverride(game) {
    const arc = game?.activeMacroArc;
    if (!arc) return null;
    const def = getShockDef(arc.id);
    const headline = def.chyronByStage?.[arc.stage] || arc.summary;
    const tag = arc.polarity === 'positive'
      ? `MACRO CLIMATE · ${String(arc.stage || 'onset').toUpperCase()}`
      : `NATIONAL CRISIS · ${String(arc.stage || 'onset').toUpperCase()}`;
    return {
      categoryLabel: tag,
      headline: `${arc.title}: ${headline}`,
    };
  }

  function renderTopHudPill(game) {
    const arc = game?.activeMacroArc;
    if (!arc) return '';
    const isPos = arc.polarity === 'positive';
    const bg = isPos ? 'rgba(52,211,153,0.16)' : 'rgba(248,113,113,0.18)';
    const border = isPos ? 'rgba(52,211,153,0.45)' : 'rgba(248,113,113,0.5)';
    const fg = isPos ? '#6ee7b7' : '#fca5a5';
    const icon = isPos ? '▲' : '⚠';
    const stageLabel = String(arc.stage || 'onset').toUpperCase();
    const open = Boolean(typeof window !== 'undefined' && window.__msDossierOpen);

    return `
      <span class="ms-hud-wrap" style="position:relative;display:inline-flex;align-items:center;">
        <button type="button" data-ms-toggle-dossier="1" title="Click for 3-line National Crisis / Climate Dossier"
          style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;border:1px solid ${border};background:${bg};color:${fg};font-size:11.5px;font-weight:700;cursor:pointer;">
          <span>${icon}</span>
          <span>${escapeHtml(arc.shortTitle || arc.title)}</span>
          <span style="opacity:0.8;font-size:10px;padding:1px 5px;border-radius:4px;background:rgba(0,0,0,0.25);">${stageLabel} ${arc.cycleIndex}/${arc.totalCycles}</span>
        </button>
        ${open ? `
          <div class="ms-dossier-popover" style="position:absolute;top:115%;right:0;z-index:999;width:340px;max-width:90vw;background:#0f172a;border:1px solid ${border};border-radius:10px;padding:12px 14px;box-shadow:0 12px 28px rgba(0,0,0,0.55);text-align:left;color:#f1f5f9;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <b style="color:${fg};font-size:13px;">${escapeHtml(arc.title)}</b>
              <button type="button" data-ms-toggle-dossier="1" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;">✕</button>
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">${escapeHtml(arc.category)} · Stage: <b>${stageLabel}</b> (Cycle ${arc.cycleIndex} of ${arc.totalCycles})</div>
            <ul style="margin:0;padding-left:16px;font-size:12px;line-height:1.45;color:#e2e8f0;">
              ${(arc.dossierLines || [arc.summary]).slice(0, 3).map((ln) => `<li style="margin-bottom:4px;">${escapeHtml(ln)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </span>`;
  }

  function renderMediaBalanceBar(game) {
    if (!game) return '';
    const eco = normalizeMediaEcosystem(game.mediaEcosystem, game);
    const pKey = getPlayerKey(game);
    const rKey = getPrimaryRivalKey(game);
    const diff = getReachDifferential({ ...game, mediaEcosystem: eco }, pKey, rKey);
    const adMult = getAdPersuasionMultiplier({ ...game, mediaEcosystem: eco }, pKey, rKey);
    const satScale = getAdSaturationScale({ ...game, mediaEcosystem: eco }, pKey, rKey);
    const pName = game.player?.name || pKey;
    const rName = rKey === 'heritage' ? 'Republican Party' : (rKey === 'people' ? 'Democratic Party' : rKey);
    const diffColor = diff >= 0 ? '#6ee7b7' : '#fca5a5';
    const adPct = Math.round((adMult - 1) * 100);

    const rows = MEDIA_CHANNELS.map((ch) => {
      const myVal = getEffectiveChannelReach({ ...game, mediaEcosystem: eco }, pKey, ch.id);
      const rivVal = getEffectiveChannelReach({ ...game, mediaEcosystem: eco }, rKey, ch.id);
      const total = Math.max(1, myVal + rivVal);
      const myPct = Math.round((myVal / total) * 100);
      return `
        <div style="background:rgba(30,41,59,0.55);padding:7px 9px;border-radius:6px;">
          <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:4px;">
            <span style="font-weight:700;color:${ch.color};">${escapeHtml(ch.name)}</span>
            <span style="color:#cbd5e1;"><b>${myVal}</b> vs ${rivVal}</span>
          </div>
          <div style="height:6px;border-radius:999px;background:rgba(148,163,184,0.22);overflow:hidden;display:flex;">
            <div style="width:${myPct}%;background:${ch.color};"></div>
            <div style="width:${100 - myPct}%;background:rgba(248,113,113,0.55);"></div>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="ms-media-balance" style="background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.25);border-radius:8px;padding:10px 14px;margin:10px 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
          <div style="font-size:12px;font-weight:700;color:#e2bd70;letter-spacing:0.04em;">
            MEDIA BALANCE · ${escapeHtml(pName)} vs ${escapeHtml(rName)}
          </div>
          <div style="font-size:11px;color:#cbd5e1;">
            Reach Diff: <b style="color:${diffColor};">${diff >= 0 ? '+' : ''}${diff}</b> · Ad Persuasion: <b>${adPct >= 0 ? '+' : ''}${adPct}%</b> · Saturation Drag: <b>${Math.round(satScale * 100)}%</b>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(145px, 1fr));gap:8px;">
          ${rows}
        </div>
      </div>`;
  }

  function renderOrganizingCards(game, disabledAttr = '') {
    if (!game) return '';
    const eco = normalizeMediaEcosystem(game.mediaEcosystem, game);
    const pKey = getPlayerKey(game);
    const rKey = getPrimaryRivalKey(game);
    const cash = Number(game.treasury || 0);
    const noAct = Boolean(disabledAttr) || (Number(game.organizingActionsRemaining ?? game.actionsLeft ?? 0) < 1);
    const arc = game.activeMacroArc;

    const channelPills = MEDIA_CHANNELS.map((ch) => {
      const v = getEffectiveChannelReach({ ...game, mediaEcosystem: eco }, pKey, ch.id);
      return `<span style="font-size:11px;padding:2px 7px;border-radius:999px;background:rgba(30,41,59,0.8);border:1px solid ${ch.color}55;color:${ch.color};">${ch.name}: <b>${v}</b></span>`;
    }).join(' ');

    const rivalOptions = Object.keys(eco)
      .filter((k) => k !== pKey && k !== 'player')
      .map((k) => `<option value="${escapeHtml(k)}" ${k === rKey ? 'selected' : ''}>${escapeHtml(k.charAt(0).toUpperCase() + k.slice(1))}</option>`)
      .join('');

    return `
      <!-- v0.18.4 Proposal #4: Media Ecosystem & Counter-Narrative -->
      <div class="action-card ms-media-card">
        <div class="action-head"><i>📡</i><b>Media Ecosystem &amp; Information War</b><span>1 action · $6M Invest / $4M Counter</span></div>
        <p>Build persistent 4-channel media reach (+8 permanent, avoids -2/cycle decay) or launch a Counter-Narrative blitz (-7 rival reach for 2 cycles).</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">${channelPills}</div>
        <div class="inline-controls" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
          <select id="ms-channel-select" style="flex:1;min-width:120px;">
            ${MEDIA_CHANNELS.map((c) => `<option value="${c.id}">${escapeHtml(c.fullName)}</option>`).join('')}
          </select>
          <select id="ms-rival-select" style="flex:1;min-width:110px;">
            ${rivalOptions}
          </select>
          <button type="button" class="button button-small button-gold" data-ms-action="invest-media-channel" ${noAct || cash < 6 ? 'disabled' : ''}>Invest +8 ($6M)</button>
          <button type="button" class="button button-small" data-ms-action="launch-counter-narrative" ${noAct || cash < 4 ? 'disabled' : ''}>Counter -7 ($4M)</button>
        </div>
      </div>

      <!-- v0.18.4 Proposal #8: National Crisis Pivot -->
      ${arc ? `
      <div class="action-card ms-crisis-card">
        <div class="action-head"><i>⚡</i><b>Crisis Pivot · ${escapeHtml(arc.shortTitle || arc.title)}</b><span>1 action · ${String(arc.stage || 'onset').toUpperCase()} (${arc.cycleIndex}/${arc.totalCycles})</span></div>
        <p>${escapeHtml(arc.summary)}</p>
        <div class="inline-controls" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
          <button type="button" class="button button-small button-gold" data-ms-action="crisis-pivot" data-ms-mode="slider_pivot" ${noAct ? 'disabled' : ''}>Pivot 2 Crisis Sliders (50% Friction)</button>
          ${arc.polarity !== 'positive' ? `
            <button type="button" class="button button-small" data-ms-action="crisis-pivot" data-ms-mode="emergency_response" ${noAct || cash < 3 || arc.emergencyShortened ? 'disabled' : ''}>${arc.emergencyShortened ? 'Emergency Passed' : 'Emergency Response (-1 Cycle · $3M)'}</button>
          ` : ''}
        </div>
      </div>` : ''}
    `;
  }

  function handleUiClick(event, getGame, setGame, saveFn, renderFn) {
    const toggleBtn = event?.target?.closest?.('[data-ms-toggle-dossier]');
    if (toggleBtn) {
      if (typeof window !== 'undefined') {
        window.__msDossierOpen = !window.__msDossierOpen;
      }
      if (typeof renderFn === 'function') renderFn();
      return true;
    }
    const actBtn = event?.target?.closest?.('[data-ms-action]');
    if (!actBtn) return false;
    const game = typeof getGame === 'function' ? getGame() : null;
    if (!game) return false;
    const actionId = actBtn.getAttribute('data-ms-action');
    const chSel = typeof document !== 'undefined' ? document.getElementById('ms-channel-select') : null;
    const rivSel = typeof document !== 'undefined' ? document.getElementById('ms-rival-select') : null;
    const payload = {
      channel: actBtn.getAttribute('data-ms-channel') || chSel?.value || 'digital',
      targetPartyId: rivSel?.value || getPrimaryRivalKey(game),
      mode: actBtn.getAttribute('data-ms-mode') || 'slider_pivot',
    };
    const next = global.PartyChairEngine?.takeAction
      ? global.PartyChairEngine.takeAction(game, actionId, payload)
      : (handleAction(game, actionId, payload) || game);
    if (typeof setGame === 'function') setGame(next);
    if (typeof saveFn === 'function') saveFn(next);
    if (typeof renderFn === 'function') renderFn();
    return true;
  }

  // --------------------------------------------------------------------------
  // PUBLIC API EXPORT
  // --------------------------------------------------------------------------
  const API = {
    VERSION: '0.18.4',
    MEDIA_CHANNELS,
    CHANNEL_IDS,
    MEDIA_BASELINES_2028,
    MACRO_SHOCK_CATALOG,
    hashFloat,
    createInitialMediaEcosystem,
    normalizeMediaEcosystem,
    getEffectiveChannelReach,
    getPartyCompositeReach,
    getReachDifferential,
    getAdPersuasionMultiplier,
    getAdSaturationScale,
    getOctoberSurpriseMultiplier,
    applyBlackoutBypass,
    getLocalIncumbentWaveBuffer,
    getDigitalGaffeVolatilityMultiplier,
    runRivalMediaInvestments,
    getShockDef,
    pickDeterministicShock,
    getIssueSalienceMultiplier,
    getDebateSalienceMultiplier,
    getSmallDonorYieldMultiplier,
    initializeState,
    normalizeState,
    advanceCycle,
    handleAction,
    getChyronOverride,
    renderTopHudPill,
    renderMediaBalanceBar,
    renderOrganizingCards,
    handleUiClick,
  };

  if (typeof global !== 'undefined') {
    global.MediaShocksSystem = API;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
