// ============================================================================
// COALITION BUILDER: PARTY CHAIR — v0.18.8 IDENTITY & RELIGIOUS VOTING BLOCS
// Standalone UMD/IIFE module exposing window.IdentityBlocSystem & module.exports.
// Hard Guardrails:
//   - All racial, identity, and religious blocs are protected from procedural
//     Emerge/Sever/Split, <100K dissolution, and keep stagnant demographic size.
//   - White voters NEVER unify into a single voting bloc.
//   - Exact voter conservation across Event A (Split), Event B (Latino Unify),
//     and Event C (Emergent Identity Bloc Formation).
// ============================================================================
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.IdentityBlocSystem = api;
  } else if (root && typeof root === 'object') {
    root.IdentityBlocSystem = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const IDENTITY_BLOC_CATALOG = [
    {
      id: 'black_voters',
      label: 'Black Voters',
      type: 'racial',
      startsAs: 'unified',
      emergentVoters: 11029800,
      unifiedBloc: {
        id: 'dem_black_voters',
        name: 'Black Voters',
        partyId: 'people',
        type: 'racial',
        status: 'major',
        sliders: { social: 4.0, economic: 3.0, governance: 7.8 },
        keyIssues: ['Civil Rights', 'Voting Access'],
        redLineIssues: ['voting-rights-rollback', 'civil-rights-retrenchment'],
        startingHappiness: 66,
        cohesion: 0.75,
        flavor: 'The African American Voting Block — a cornerstone coalition of the Democratic Party since the civil rights movement.'
      },
      subFactions: [
        {
          id: 'black_church_traditionalists',
          name: 'Black Church Traditionalists',
          partyId: 'people',
          type: 'racial',
          status: 'minor',
          share: 0.35,
          sliders: { social: 5.8, economic: 3.4, governance: 6.5 },
          keyIssues: ['Voting Access', 'Community Investment'],
          redLineIssues: ['voting-rights-rollback', 'religious-exemption-repeal'],
          startingHappiness: 64,
          cohesion: 0.76,
          flavor: 'Church-anchored Black civic networks pairing civil rights defense with faith-rooted community stability.'
        },
        {
          id: 'black_progressive_organizers',
          name: 'Black Progressive Organizers',
          partyId: 'people',
          type: 'racial',
          status: 'minor',
          share: 0.28,
          sliders: { social: 2.2, economic: 2.0, governance: 8.5 },
          keyIssues: ['Civil Rights', 'Criminal Justice Reform'],
          redLineIssues: ['voting-rights-rollback', 'civil-rights-retrenchment'],
          startingHappiness: 56,
          cohesion: 0.80,
          flavor: 'Younger urban organizers pressing for structural justice reform, economic equity, and grassroots accountability.'
        },
        {
          id: 'black_suburban_entrepreneurs',
          name: 'Black Suburban Entrepreneurs',
          partyId: 'independent',
          type: 'racial',
          status: 'minor',
          share: 0.22,
          sliders: { social: 4.8, economic: 5.4, governance: 5.2 },
          keyIssues: ['Small Business Capital', 'Housing Affordability'],
          redLineIssues: ['small-business-tax-hike', 'credit-access-rollback'],
          startingHappiness: 54,
          cohesion: 0.58,
          flavor: 'Upwardly mobile suburban professionals and business owners weighing tax competitiveness alongside civil rights.'
        },
        {
          id: 'black_populist_conservatives',
          name: 'Black Populist Conservatives',
          partyId: 'heritage',
          type: 'racial',
          status: 'fringe',
          share: 0.15,
          sliders: { social: 6.9, economic: 5.8, governance: 6.0 },
          keyIssues: ['School Choice', 'Border & Labor Protection'],
          redLineIssues: ['school-choice-ban', 'religious-exemption-repeal'],
          startingHappiness: 52,
          cohesion: 0.62,
          flavor: 'Socially traditional, populist-leaning Black voters drawn to educational choice and domestic wage protection.'
        }
      ]
    },
    {
      id: 'latino_voters',
      label: 'Latino Voters',
      type: 'racial',
      startsAs: 'split',
      startingSubFactionIds: ['dem_traditional_latin', 'swg_working_class_latinos', 'gop_cubans'],
      emergentVoters: 6730800,
      unifiedBloc: {
        id: 'latino_unified_bloc',
        name: 'Unified Latino Coalition',
        partyId: 'people',
        type: 'racial',
        status: 'major',
        sliders: { social: 5.6, economic: 4.3, governance: 5.4 },
        keyIssues: ['Comprehensive Immigration Reform', 'Small Business & Wage Growth'],
        redLineIssues: ['mass-deportation-crackdown', 'wage-floor-repeal'],
        startingHappiness: 58,
        cohesion: 0.65,
        flavor: 'A rare, historic pan-Latino electoral alignment uniting working-class, traditional, and heritage Hispanic voters.'
      },
      subFactions: [
        {
          id: 'dem_traditional_latin',
          name: 'Traditional Latin Voters',
          partyId: 'people',
          type: 'racial',
          status: 'minor',
          share: 0.30,
          sliders: { social: 5.0, economic: 4.0, governance: 6.0 },
          keyIssues: ['Comprehensive Immigration Reform', 'Labor Standards Enforcement'],
          redLineIssues: ['free-trade-concessions', 'right-to-work-mandate'],
          startingHappiness: 60,
          cohesion: 0.66,
          flavor: 'Longtime Democratic-aligned Hispanic households prioritizing immigration reform, union protections, and family mobility.'
        },
        {
          id: 'swg_working_class_latinos',
          name: 'Working Class Latinos',
          partyId: 'independent',
          type: 'racial',
          status: 'minor',
          share: 0.38,
          sliders: { social: 6.2, economic: 4.5, governance: 5.0 },
          keyIssues: ['Small Business Loans', 'Public Safety & Policing'],
          redLineIssues: ['entitlement-cuts', 'institutional-norm-breach'],
          startingHappiness: 54,
          cohesion: 0.56,
          flavor: 'Pragmatic, pocketbook-focused Hispanic tradespeople and entrepreneurs decisive in Sun Belt swing states.'
        },
        {
          id: 'gop_cubans',
          name: 'Cubans',
          partyId: 'heritage',
          type: 'racial',
          status: 'fringe',
          share: 0.14,
          sliders: { social: 7.0, economic: 7.5, governance: 4.0 },
          keyIssues: ['Anti-Communist Foreign Policy', 'Sanctions Enforcement'],
          redLineIssues: ['entitlement-cuts', 'institutional-norm-breach'],
          startingHappiness: 62,
          cohesion: 0.74,
          flavor: 'South Florida Cuban-American and anti-authoritarian exiles anchored by free-enterprise economics and hardline diplomacy.'
        },
        {
          id: 'latino_evangelical_populists',
          name: 'Latino Evangelical Populists',
          partyId: 'heritage',
          type: 'racial',
          status: 'minor',
          share: 0.18,
          sliders: { social: 7.6, economic: 5.2, governance: 5.8 },
          keyIssues: ['Religious Liberty', 'Family Tax Relief'],
          redLineIssues: ['religious-exemption-repeal', 'social-liberalization'],
          startingHappiness: 58,
          cohesion: 0.70,
          flavor: 'Faith-driven Hispanic voters prioritizing family tax credits, religious liberty, and cultural conservatism.'
        }
      ]
    },
    {
      id: 'east_asian_voters',
      label: 'East Asian Voters',
      type: 'racial',
      startsAs: 'emergent',
      emergentVoters: 2850000,
      unifiedBloc: {
        id: 'identity_east_asian_bloc',
        name: 'East Asian Voters',
        partyId: 'people',
        type: 'racial',
        status: 'minor',
        sliders: { social: 4.4, economic: 5.4, governance: 3.4 },
        keyIssues: ['STEM & Merit Education', 'Small Business & Trade'],
        redLineIssues: ['anti-asian-discrimination', 'selective-school-elimination'],
        startingHappiness: 56,
        cohesion: 0.62,
        flavor: 'Suburban and metropolitan East Asian-American voters mobilized around educational merit, public safety, and economic openness.'
      },
      subFactions: [
        {
          id: 'east_asian_suburban_meritocrats',
          name: 'East Asian Suburban Meritocrats',
          partyId: 'independent',
          type: 'racial',
          status: 'minor',
          share: 0.32,
          sliders: { social: 5.2, economic: 6.2, governance: 3.0 },
          keyIssues: ['Merit Admissions', 'Public Safety & Policing'],
          redLineIssues: ['selective-school-elimination', 'property-tax-surge'],
          startingHappiness: 55,
          cohesion: 0.64,
          flavor: 'Achievement-focused suburban families prioritizing selective public schools, neighborhood safety, and fiscal discipline.'
        },
        {
          id: 'east_asian_progressive_professionals',
          name: 'East Asian Progressive Professionals',
          partyId: 'people',
          type: 'racial',
          status: 'minor',
          share: 0.30,
          sliders: { social: 2.8, economic: 4.2, governance: 3.5 },
          keyIssues: ['Civil Rights Protections', 'Climate & Clean Tech'],
          redLineIssues: ['anti-asian-discrimination', 'civil-rights-retrenchment'],
          startingHappiness: 58,
          cohesion: 0.62,
          flavor: 'Coastal urban professionals championing civil rights, green infrastructure, and inclusive governance.'
        },
        {
          id: 'east_asian_small_business_conservatives',
          name: 'East Asian Small-Business Conservatives',
          partyId: 'heritage',
          type: 'racial',
          status: 'minor',
          share: 0.22,
          sliders: { social: 6.4, economic: 7.2, governance: 3.8 },
          keyIssues: ['Small Business Deregulation', 'Tax Relief'],
          redLineIssues: ['small-business-tax-hike', 'commercial-regulation-surge'],
          startingHappiness: 56,
          cohesion: 0.66,
          flavor: 'Independent merchants and franchise owners favoring lower commercial taxes, deregulation, and law-and-order policing.'
        },
        {
          id: 'east_asian_pacific_civic_coalition',
          name: 'Asian-Pacific Civic Advocates',
          partyId: 'people',
          type: 'racial',
          status: 'fringe',
          share: 0.16,
          sliders: { social: 3.6, economic: 3.8, governance: 4.5 },
          keyIssues: ['Hate Crime Enforcement', 'Healthcare Access'],
          redLineIssues: ['anti-asian-discrimination', 'healthcare-access-cuts'],
          startingHappiness: 57,
          cohesion: 0.68,
          flavor: 'Community-service coalitions focused on language access, elder care, and anti-bias enforcement.'
        }
      ]
    },
    {
      id: 'south_asian_voters',
      label: 'South Asian Voters',
      type: 'racial',
      startsAs: 'emergent',
      emergentVoters: 2150000,
      unifiedBloc: {
        id: 'identity_south_asian_bloc',
        name: 'South Asian Voters',
        partyId: 'people',
        type: 'racial',
        status: 'minor',
        sliders: { social: 4.2, economic: 5.6, governance: 3.6 },
        keyIssues: ['High-Skilled Immigration', 'Tech & Entrepreneurship'],
        redLineIssues: ['h1b-visa-freeze', 'immigration-cap-squeeze'],
        startingHappiness: 58,
        cohesion: 0.64,
        flavor: 'Fast-growing South Asian-American electorate bridging tech corridors, medical professions, and small-business networks.'
      },
      subFactions: [
        {
          id: 'south_asian_tech_pluralists',
          name: 'South Asian Tech Pluralists',
          partyId: 'people',
          type: 'racial',
          status: 'minor',
          share: 0.34,
          sliders: { social: 3.2, economic: 5.2, governance: 3.0 },
          keyIssues: ['High-Skilled Visas', 'AI & Innovation Policy'],
          redLineIssues: ['h1b-visa-freeze', 'tech-innovation-moratorium'],
          startingHappiness: 60,
          cohesion: 0.64,
          flavor: 'Engineers, physicians, and founders backing legal high-skilled immigration reform and research investment.'
        },
        {
          id: 'south_asian_progressive_youth',
          name: 'South Asian Progressive Youth',
          partyId: 'people',
          type: 'racial',
          status: 'fringe',
          share: 0.24,
          sliders: { social: 2.0, economic: 2.4, governance: 6.2 },
          keyIssues: ['Civil Rights', 'Student Debt & Healthcare'],
          redLineIssues: ['civil-rights-retrenchment', 'healthcare-access-cuts'],
          startingHappiness: 52,
          cohesion: 0.72,
          flavor: 'Second-generation campus and metro activists prioritizing racial justice, climate action, and universal care.'
        },
        {
          id: 'south_asian_enterprise_moderates',
          name: 'South Asian Enterprise Moderates',
          partyId: 'independent',
          type: 'racial',
          status: 'minor',
          share: 0.24,
          sliders: { social: 5.0, economic: 6.6, governance: 3.2 },
          keyIssues: ['Small Business Credit', 'US-India Trade Ties'],
          redLineIssues: ['small-business-tax-hike', 'tariff-trade-war'],
          startingHappiness: 56,
          cohesion: 0.58,
          flavor: 'Hospitality, retail, and logistics owners seeking pro-growth tax policy and open bilateral trade.'
        },
        {
          id: 'south_asian_family_conservatives',
          name: 'South Asian Family Conservatives',
          partyId: 'heritage',
          type: 'racial',
          status: 'fringe',
          share: 0.18,
          sliders: { social: 6.8, economic: 7.0, governance: 3.8 },
          keyIssues: ['Tax Cuts & Deregulation', 'Educational Excellence'],
          redLineIssues: ['wealth-tax-hike', 'selective-school-elimination'],
          startingHappiness: 55,
          cohesion: 0.62,
          flavor: 'Tradition-minded suburban households drawn to merit-based education, low capital-gains taxes, and family enterprise.'
        }
      ]
    },
    {
      id: 'jewish_voters',
      label: 'Jewish Voters',
      type: 'religious',
      startsAs: 'emergent',
      emergentVoters: 2650000,
      unifiedBloc: {
        id: 'identity_jewish_bloc',
        name: 'Jewish Voters',
        partyId: 'people',
        type: 'religious',
        status: 'minor',
        sliders: { social: 3.4, economic: 4.4, governance: 2.8 },
        keyIssues: ['Antisemitism & Security', 'US-Israel Alliance'],
        redLineIssues: ['israel-security-cutoff', 'antisemitism-enforcement-rollback'],
        startingHappiness: 55,
        cohesion: 0.60,
        flavor: 'Historically civic-minded religious and cultural bloc balancing pluralistic democracy with security and alliance commitments.'
      },
      subFactions: [
        {
          id: 'jewish_liberal_institutionalists',
          name: 'Liberal Jewish Institutionalists',
          partyId: 'people',
          type: 'religious',
          status: 'minor',
          share: 0.38,
          sliders: { social: 2.6, economic: 3.8, governance: 2.2 },
          keyIssues: ['Civil Rights & Pluralism', 'Institutional Norms'],
          redLineIssues: ['institutional-norm-breach', 'antisemitism-enforcement-rollback'],
          startingHappiness: 60,
          cohesion: 0.66,
          flavor: 'Mainline Reform and Conservative congregations defending constitutional guardrails, church-state separation, and civil rights.'
        },
        {
          id: 'jewish_centrist_security_hawks',
          name: 'Centrist Jewish Security Hawks',
          partyId: 'independent',
          type: 'religious',
          status: 'minor',
          share: 0.26,
          sliders: { social: 4.2, economic: 5.4, governance: 3.0 },
          keyIssues: ['US-Israel Alliance', 'Campus Antisemitism Enforcement'],
          redLineIssues: ['israel-security-cutoff', 'antisemitism-enforcement-rollback'],
          startingHappiness: 50,
          cohesion: 0.68,
          flavor: 'Swing-voting moderates ready to cross party lines over alliance reliability and domestic security enforcement.'
        },
        {
          id: 'jewish_orthodox_conservatives',
          name: 'Orthodox Jewish Conservatives',
          partyId: 'heritage',
          type: 'religious',
          status: 'minor',
          share: 0.22,
          sliders: { social: 8.2, economic: 6.8, governance: 4.2 },
          keyIssues: ['Religious School Choice', 'Religious Liberty'],
          redLineIssues: ['religious-exemption-repeal', 'israel-security-cutoff'],
          startingHappiness: 62,
          cohesion: 0.82,
          flavor: 'Tight-knit Orthodox communities prioritizing parochial school funding, religious accommodation, and strong foreign security ties.'
        },
        {
          id: 'jewish_progressive_reformers',
          name: 'Progressive Jewish Reformers',
          partyId: 'people',
          type: 'religious',
          status: 'fringe',
          share: 0.14,
          sliders: { social: 1.8, economic: 2.2, governance: 5.8 },
          keyIssues: ['Social Justice', 'Diplomatic Peace Initiatives'],
          redLineIssues: ['civil-rights-retrenchment', 'entitlement-cuts'],
          startingHappiness: 51,
          cohesion: 0.72,
          flavor: 'Urban progressive activists emphasizing domestic social safety nets, labor solidarity, and multilateral diplomacy.'
        }
      ]
    },
    {
      id: 'muslim_voters',
      label: 'Muslim Voters',
      type: 'religious',
      startsAs: 'emergent',
      emergentVoters: 1750000,
      unifiedBloc: {
        id: 'identity_muslim_bloc',
        name: 'Muslim Voters',
        partyId: 'independent',
        type: 'religious',
        status: 'minor',
        sliders: { social: 5.8, economic: 3.6, governance: 6.2 },
        keyIssues: ['Civil Liberties & Anti-Discrimination', 'Middle East Foreign Policy'],
        redLineIssues: ['travel-ban-reinstatement', 'civil-liberties-surveillance'],
        startingHappiness: 48,
        cohesion: 0.66,
        flavor: 'Cohesive yet ideologically cross-pressured Muslim-American electorate decisive in Great Lakes and Sun Belt battlegrounds.'
      },
      subFactions: [
        {
          id: 'muslim_civil_rights_progressives',
          name: 'Muslim Civil Rights Progressives',
          partyId: 'people',
          type: 'religious',
          status: 'minor',
          share: 0.34,
          sliders: { social: 3.4, economic: 2.5, governance: 6.8 },
          keyIssues: ['Civil Liberties', 'Healthcare & Labor Equity'],
          redLineIssues: ['travel-ban-reinstatement', 'civil-liberties-surveillance'],
          startingHappiness: 52,
          cohesion: 0.70,
          flavor: 'Civic advocacy networks fighting discrimination while pushing for universal healthcare and labor protections.'
        },
        {
          id: 'muslim_foreign_policy_independents',
          name: 'Muslim Foreign-Policy Independents',
          partyId: 'independent',
          type: 'religious',
          status: 'minor',
          share: 0.30,
          sliders: { social: 5.6, economic: 3.8, governance: 7.4 },
          keyIssues: ['Middle East Foreign Policy', 'Anti-War Diplomacy'],
          redLineIssues: ['interventionist-escalation', 'travel-ban-reinstatement'],
          startingHappiness: 45,
          cohesion: 0.74,
          flavor: 'Uncommitted and third-party-open voters conditioning coalition support on peaceful foreign policy accountability.'
        },
        {
          id: 'muslim_family_values_conservatives',
          name: 'Muslim Family-Values Conservatives',
          partyId: 'heritage',
          type: 'religious',
          status: 'fringe',
          share: 0.20,
          sliders: { social: 7.8, economic: 5.6, governance: 4.6 },
          keyIssues: ['Parental Rights in Education', 'Religious Liberty'],
          redLineIssues: ['religious-exemption-repeal', 'parental-rights-curb'],
          startingHappiness: 54,
          cohesion: 0.72,
          flavor: 'Socially conservative Muslim households aligning on parental curriculum rights and religious freedom.'
        },
        {
          id: 'muslim_small_business_moderates',
          name: 'Muslim Small-Business Moderates',
          partyId: 'independent',
          type: 'religious',
          status: 'fringe',
          share: 0.16,
          sliders: { social: 5.8, economic: 6.0, governance: 4.2 },
          keyIssues: ['Small Business Access', 'Community Safety'],
          redLineIssues: ['small-business-tax-hike', 'commercial-regulation-surge'],
          startingHappiness: 53,
          cohesion: 0.58,
          flavor: 'Metro entrepreneurs and professionals prioritizing stable local commerce, neighborhood safety, and balanced budgets.'
        }
      ]
    },
    {
      id: 'native_american_voters',
      label: 'Native American Voters',
      type: 'racial',
      startsAs: 'emergent',
      emergentVoters: 1450000,
      unifiedBloc: {
        id: 'identity_native_american_bloc',
        name: 'Native American Voters',
        partyId: 'people',
        type: 'racial',
        status: 'minor',
        sliders: { social: 4.6, economic: 3.2, governance: 6.8 },
        keyIssues: ['Tribal Sovereignty & Treaties', 'Rural Infrastructure & Healthcare'],
        redLineIssues: ['tribal-land-rollback', 'ihs-funding-cuts'],
        startingHappiness: 52,
        cohesion: 0.68,
        flavor: 'Sovereign tribal nations and urban Indigenous voters wielding decisive margins in Mountain West and Northern Plains states.'
      },
      subFactions: [
        {
          id: 'native_sovereignty_defenders',
          name: 'Tribal Sovereignty Defenders',
          partyId: 'people',
          type: 'racial',
          status: 'minor',
          share: 0.38,
          sliders: { social: 4.2, economic: 3.0, governance: 7.2 },
          keyIssues: ['Tribal Sovereignty & Treaties', 'Voting Access'],
          redLineIssues: ['tribal-land-rollback', 'voting-rights-rollback'],
          startingHappiness: 56,
          cohesion: 0.76,
          flavor: 'Tribal leadership coalitions defending treaty obligations, reservation jurisdiction, and rural ballot access.'
        },
        {
          id: 'native_environmental_stewards',
          name: 'Indigenous Environmental Stewards',
          partyId: 'people',
          type: 'racial',
          status: 'fringe',
          share: 0.26,
          sliders: { social: 2.8, economic: 2.4, governance: 7.6 },
          keyIssues: ['Public Lands & Water Rights', 'Clean Energy Transition'],
          redLineIssues: ['tribal-land-rollback', 'pipeline-easement-override'],
          startingHappiness: 50,
          cohesion: 0.78,
          flavor: 'Water protectors and land stewards opposing extractive encroachments on sacred sites and watersheds.'
        },
        {
          id: 'native_rural_economic_pragmatists',
          name: 'Native Rural Economic Pragmatists',
          partyId: 'independent',
          type: 'racial',
          status: 'fringe',
          share: 0.22,
          sliders: { social: 5.5, economic: 5.0, governance: 5.6 },
          keyIssues: ['Tribal Enterprise & Energy', 'Rural Broadband & Roads'],
          redLineIssues: ['ihs-funding-cuts', 'rural-infrastructure-freeze'],
          startingHappiness: 52,
          cohesion: 0.60,
          flavor: 'Reservation enterprise managers focused on broadband, clinics, gaming/hospitality, and energy self-determination.'
        },
        {
          id: 'native_traditional_conservatives',
          name: 'Native Traditional Conservatives',
          partyId: 'heritage',
          type: 'racial',
          status: 'fringe',
          share: 0.14,
          sliders: { social: 6.8, economic: 5.8, governance: 5.4 },
          keyIssues: ['Local Autonomy', 'Resource Development'],
          redLineIssues: ['federal-land-lockup', 'religious-exemption-repeal'],
          startingHappiness: 54,
          cohesion: 0.64,
          flavor: 'Energy-producing tribal communities favoring local mineral autonomy, traditional family values, and reduced federal red tape.'
        }
      ]
    }
  ];

  // Explicit static lookup sets for existing and catalog identity/religious factions
  const EXISTING_IDENTITY_FACTION_IDS = new Set([
    'dem_black_voters',
    'dem_traditional_latin',
    'gop_cubans',
    'swg_working_class_latinos',
    'gop_mormons',
    'dem_faith_based_liberals',
    'gop_faith_and_flag',
    'swg_religious_moderates'
  ]);

  const CATALOG_BY_ID = new Map();
  const ALL_IDENTITY_FACTION_IDS = new Set(EXISTING_IDENTITY_FACTION_IDS);

  for (const group of IDENTITY_BLOC_CATALOG) {
    CATALOG_BY_ID.set(group.id, group);
    if (group.unifiedBloc?.id) ALL_IDENTITY_FACTION_IDS.add(group.unifiedBloc.id);
    for (const sub of group.subFactions || []) {
      ALL_IDENTITY_FACTION_IDS.add(sub.id);
    }
  }

  const EMERGENT_GROUP_IDS = IDENTITY_BLOC_CATALOG
    .filter((g) => g.startsAs === 'emergent')
    .map((g) => g.id);

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  function defaultRng(seed) {
    if (typeof seed === 'function') return seed;
    let s = Number.isFinite(Number(seed)) ? (Number(seed) >>> 0) : 0x9e3779b9;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function resolveRng(rngOrSeed) {
    return typeof rngOrSeed === 'function' ? rngOrSeed : Math.random;
  }

  function ensureIdentityBlocState(game) {
    if (!game || typeof game !== 'object') {
      return { unifiedGroups: {}, splitGroups: {}, emergedGroups: [] };
    }
    if (!game.identityBlocState || typeof game.identityBlocState !== 'object') {
      game.identityBlocState = {
        unifiedGroups: { black_voters: 'dem_black_voters' },
        splitGroups: {
          latino_voters: ['dem_traditional_latin', 'swg_working_class_latinos', 'gop_cubans']
        },
        emergedGroups: []
      };
    }
    if (!game.identityBlocState.unifiedGroups || typeof game.identityBlocState.unifiedGroups !== 'object') {
      game.identityBlocState.unifiedGroups = {};
    }
    if (!game.identityBlocState.splitGroups || typeof game.identityBlocState.splitGroups !== 'object') {
      game.identityBlocState.splitGroups = {};
    }
    if (!Array.isArray(game.identityBlocState.emergedGroups)) {
      game.identityBlocState.emergedGroups = [];
    }
    return game.identityBlocState;
  }

  function getFactionVoters(game, faction) {
    if (!faction) return 0;
    const vmVal = game?.voterModel?.factions?.[faction.id];
    if (vmVal !== undefined && vmVal !== null && Number.isFinite(Number(vmVal))) {
      return Math.max(0, Math.round(Number(vmVal)));
    }
    return Math.max(0, Math.round(Number(faction.targetVoters ?? faction.voters ?? 0)));
  }

  function setFactionVoters(game, faction, voters) {
    const clean = Math.max(0, Math.round(Number(voters || 0)));
    faction.targetVoters = clean;
    if (game?.voterModel?.factions && typeof game.voterModel.factions === 'object') {
      game.voterModel.factions[faction.id] = clean;
    }
  }

  function buildFactionInstance(template, voters, group) {
    const cleanVoters = Math.max(0, Math.round(Number(voters || 0)));
    const keyIssues = Array.isArray(template.keyIssues) ? [...template.keyIssues] : [];
    return {
      id: template.id,
      name: template.name,
      partyId: template.partyId,
      type: template.type || group?.type || 'racial',
      status: template.status || 'minor',
      targetVoters: cleanVoters,
      sliders: { ...(template.sliders || { social: 5, economic: 5, governance: 5 }) },
      keyIssues,
      primaryIssueId: keyIssues[0] || null,
      redLineIssues: Array.isArray(template.redLineIssues) ? [...template.redLineIssues] : [],
      startingHappiness: Number(template.startingHappiness ?? 55),
      cohesion: Number(template.cohesion ?? 0.65),
      flavor: template.flavor || '',
      birthMode: 'identity_event',
      parentFactionId: null,
      viralRunwayCyclesLeft: 0,
      vanguardCyclesLeft: 0,
      temperament: null,
      isExtremist: false,
      anchorPoliticianId: null,
      caucusId: null,
      isIdentityBloc: true,
      identityGroupId: group ? group.id : null
    };
  }

  function allocateExactShares(totalVoters, templates) {
    const total = Math.max(0, Math.round(Number(totalVoters || 0)));
    if (!templates.length) return [];
    const weightSum = templates.reduce((sum, t) => sum + Math.max(0.01, Number(t.share || 0.25)), 0);
    const allocations = templates.map((t) => {
      const raw = (total * Math.max(0.01, Number(t.share || 0.25))) / weightSum;
      return Math.floor(raw);
    });
    let assigned = allocations.reduce((a, b) => a + b, 0);
    let remainder = total - assigned;
    // Distribute remainder deterministically starting with highest-weight sub-faction
    const order = templates
      .map((t, idx) => ({ idx, w: Number(t.share || 0.25) }))
      .sort((a, b) => b.w - a.w);
    let cursor = 0;
    while (remainder > 0) {
      allocations[order[cursor % order.length].idx] += 1;
      remainder -= 1;
      cursor += 1;
    }
    return allocations;
  }

  // --------------------------------------------------------------------------
  // Hard Guardrails
  // --------------------------------------------------------------------------
  function isWhiteIdentityAttempt(groupIdOrName) {
    if (!groupIdOrName) return false;
    return /\bwhite\b/i.test(String(groupIdOrName).replace(/_/g, ' '));
  }

  function isProtectedIdentityBloc(faction) {
    if (!faction) return false;
    if (typeof faction === 'string') {
      return ALL_IDENTITY_FACTION_IDS.has(faction);
    }
    if (typeof faction !== 'object') return false;
    const t = String(faction.type || '').toLowerCase();
    if (t === 'racial' || t === 'identity' || t === 'religious') return true;
    if (faction.isIdentityBloc === true) return true;
    if (faction.birthMode === 'identity_event') return true;
    if (faction.id && ALL_IDENTITY_FACTION_IDS.has(faction.id)) return true;
    return false;
  }

  function getIdentityGroup(groupId) {
    return CATALOG_BY_ID.get(groupId) || null;
  }

  // --------------------------------------------------------------------------
  // Event A: Identity Bloc Split (Unified -> 2-4 Fixed Set Sub-Factions)
  // --------------------------------------------------------------------------
  function triggerIdentityBlocSplit(game, groupId, rng) {
    if (isWhiteIdentityAttempt(groupId)) {
      return { ok: false, reason: 'white_voters_excluded' };
    }
    const group = getIdentityGroup(groupId);
    if (!group) {
      return { ok: false, reason: 'unknown_group' };
    }
    if (!game || !Array.isArray(game.factions)) {
      return { ok: false, reason: 'invalid_game' };
    }
    const state = ensureIdentityBlocState(game);
    const rand = resolveRng(rng);
    const unifiedId = group.unifiedBloc?.id;
    const unifiedIdx = game.factions.findIndex(
      (f) => f && (f.id === unifiedId || (f.identityGroupId === groupId && f.id === unifiedId))
    );
    if (unifiedIdx === -1) {
      return { ok: false, reason: 'not_unified' };
    }

    const unifiedFaction = game.factions[unifiedIdx];
    const totalVoters = getFactionVoters(game, unifiedFaction);
    const maxSub = Math.min(4, (group.subFactions || []).length);
    if (maxSub < 2) {
      return { ok: false, reason: 'insufficient_subfactions' };
    }

    // Pick 2 to 4 sub-factions (4 max)
    const splitCount = 2 + Math.floor(rand() * (maxSub - 1));
    const pool = [...group.subFactions];
    // Weighted/randomized selection keeping deterministic stability with rng
    const chosen = [];
    while (chosen.length < splitCount && pool.length > 0) {
      const idx = Math.floor(rand() * pool.length);
      chosen.push(pool.splice(idx, 1)[0]);
    }

    const voterShares = allocateExactShares(totalVoters, chosen);
    const createdFactions = chosen.map((tpl, i) => {
      const inst = buildFactionInstance(tpl, voterShares[i], group);
      inst.parentFactionId = unifiedFaction.id;
      return inst;
    });

    // Replace unified faction with split sub-factions
    game.factions.splice(unifiedIdx, 1, ...createdFactions);

    if (game.voterModel?.factions) {
      delete game.voterModel.factions[unifiedFaction.id];
      for (const f of createdFactions) {
        game.voterModel.factions[f.id] = f.targetVoters;
      }
    }
    if (game.factionStandings) {
      const prevH = game.factionStandings[unifiedFaction.id];
      for (const f of createdFactions) {
        game.factionStandings[f.id] = Number.isFinite(Number(prevH)) ? Number(prevH) : f.startingHappiness;
      }
    }

    delete state.unifiedGroups[groupId];
    state.splitGroups[groupId] = createdFactions.map((f) => f.id);
    if (group.startsAs === 'emergent' && !state.emergedGroups.includes(groupId)) {
      state.emergedGroups.push(groupId);
    }

    return {
      ok: true,
      type: 'identity_split',
      groupId,
      label: group.label,
      removedFactionId: unifiedFaction.id,
      createdFactions,
      factionIds: createdFactions.map((f) => f.id),
      totalVoters,
      headline: `${group.label} Coalition Fractures Into Distinct Sub-Blocs`,
      description: `${unifiedFaction.name} (${(totalVoters / 1e6).toFixed(2)}M voters) realigned into ${createdFactions.map((f) => f.name).join(', ')}.`
    };
  }

  // --------------------------------------------------------------------------
  // Event B: Latino Unification (Active Latino Sub-Factions -> Unified Bloc)
  // --------------------------------------------------------------------------
  function triggerLatinoUnification(game, rng) {
    if (!game || !Array.isArray(game.factions)) {
      return { ok: false, reason: 'invalid_game' };
    }
    const group = getIdentityGroup('latino_voters');
    const state = ensureIdentityBlocState(game);
    const unifiedId = group.unifiedBloc.id;

    if (game.factions.some((f) => f && f.id === unifiedId)) {
      return { ok: false, reason: 'already_unified' };
    }

    const latinoSubIds = new Set((group.subFactions || []).map((s) => s.id));
    const activeSubs = game.factions.filter(
      (f) => f && (latinoSubIds.has(f.id) || f.identityGroupId === 'latino_voters')
    );
    if (activeSubs.length < 2) {
      return { ok: false, reason: 'insufficient_active_subfactions' };
    }

    const totalVoters = activeSubs.reduce((sum, f) => sum + getFactionVoters(game, f), 0);
    const avgHappiness = Math.round(
      activeSubs.reduce((sum, f) => sum + Number(game.factionStandings?.[f.id] ?? f.startingHappiness ?? 55), 0) / activeSubs.length
    );

    const activeIdSet = new Set(activeSubs.map((f) => f.id));
    const firstIdx = game.factions.findIndex((f) => f && activeIdSet.has(f.id));
    const remaining = game.factions.filter((f) => !f || !activeIdSet.has(f.id));

    const unifiedFaction = buildFactionInstance(group.unifiedBloc, totalVoters, group);
    unifiedFaction.startingHappiness = avgHappiness;

    const insertIdx = firstIdx >= 0 ? Math.min(firstIdx, remaining.length) : remaining.length;
    remaining.splice(insertIdx, 0, unifiedFaction);
    game.factions = remaining;

    if (game.voterModel?.factions) {
      for (const id of activeIdSet) delete game.voterModel.factions[id];
      game.voterModel.factions[unifiedFaction.id] = totalVoters;
    }
    if (game.factionStandings) {
      game.factionStandings[unifiedFaction.id] = avgHappiness;
    }

    delete state.splitGroups.latino_voters;
    state.unifiedGroups.latino_voters = unifiedFaction.id;

    return {
      ok: true,
      type: 'latino_unification',
      groupId: 'latino_voters',
      label: group.label,
      mergedFactionIds: [...activeIdSet],
      unifiedFaction,
      factionIds: [unifiedFaction.id],
      totalVoters,
      headline: 'Historic Pan-Latino Electoral Unification',
      description: `${activeSubs.map((f) => f.name).join(', ')} converged into the ${unifiedFaction.name} (${(totalVoters / 1e6).toFixed(2)}M voters).`
    };
  }

  // --------------------------------------------------------------------------
  // Event C: Emergent Identity Bloc Formation (5 Emergent Groups)
  // --------------------------------------------------------------------------
  function triggerEmergentIdentityBloc(game, groupId, rng) {
    if (isWhiteIdentityAttempt(groupId)) {
      return { ok: false, reason: 'white_voters_excluded' };
    }
    const group = getIdentityGroup(groupId);
    if (!group || group.startsAs !== 'emergent') {
      return { ok: false, reason: 'not_emergent_group' };
    }
    if (!game || !Array.isArray(game.factions)) {
      return { ok: false, reason: 'invalid_game' };
    }

    const state = ensureIdentityBlocState(game);
    const subIds = new Set((group.subFactions || []).map((s) => s.id));
    const alreadyInFactions = game.factions.some(
      (f) => f && (f.id === group.unifiedBloc.id || subIds.has(f.id) || f.identityGroupId === groupId)
    );
    if (state.emergedGroups.includes(groupId) || alreadyInFactions) {
      return { ok: false, reason: 'already_emerged' };
    }

    const targetSize = Math.max(100000, Math.round(Number(group.emergentVoters || 1500000)));
    let drawnVoters = 0;

    // Draw voters cleanly from non-protected donor factions so electorate total stays conserved
    const donors = game.factions.filter((f) => f && !isProtectedIdentityBloc(f) && getFactionVoters(game, f) > 150000);
    const totalAvailable = donors.reduce((sum, f) => sum + Math.max(0, getFactionVoters(game, f) - 120000), 0);

    if (game.factions.length > 0 && totalAvailable > 0) {
      const drawTarget = Math.min(targetSize, totalAvailable);
      let remainingToDraw = drawTarget;
      const donorCaps = donors.map((f) => ({
        faction: f,
        spare: Math.max(0, getFactionVoters(game, f) - 120000)
      }));

      for (let i = 0; i < donorCaps.length; i++) {
        const d = donorCaps[i];
        if (remainingToDraw <= 0) break;
        const proportional = i === donorCaps.length - 1
          ? remainingToDraw
          : Math.min(d.spare, Math.floor((drawTarget * d.spare) / totalAvailable));
        const take = Math.min(d.spare, Math.max(0, proportional), remainingToDraw);
        if (take > 0) {
          setFactionVoters(game, d.faction, getFactionVoters(game, d.faction) - take);
          drawnVoters += take;
          remainingToDraw -= take;
        }
      }
      // Top-off any rounding remainder
      for (const d of donorCaps) {
        if (remainingToDraw <= 0) break;
        const spareNow = Math.max(0, getFactionVoters(game, d.faction) - 120000);
        const take = Math.min(spareNow, remainingToDraw);
        if (take > 0) {
          setFactionVoters(game, d.faction, getFactionVoters(game, d.faction) - take);
          drawnVoters += take;
          remainingToDraw -= take;
        }
      }
    } else if (game.factions.length === 0) {
      // Empty sandbox fixture: allow spawning at catalog size
      drawnVoters = targetSize;
    } else {
      return { ok: false, reason: 'no_available_donor_voters' };
    }

    const emergentFaction = buildFactionInstance(group.unifiedBloc, drawnVoters, group);
    game.factions.push(emergentFaction);
    if (game.voterModel?.factions) {
      game.voterModel.factions[emergentFaction.id] = drawnVoters;
    }
    if (game.factionStandings) {
      game.factionStandings[emergentFaction.id] = emergentFaction.startingHappiness;
    }

    state.emergedGroups.push(groupId);
    state.unifiedGroups[groupId] = emergentFaction.id;

    return {
      ok: true,
      type: 'identity_emerge',
      groupId,
      label: group.label,
      emergentFaction,
      factionIds: [emergentFaction.id],
      totalVoters: drawnVoters,
      headline: `${group.label} Organize as Recognized National Voting Bloc`,
      description: `${emergentFaction.name} (${(drawnVoters / 1e6).toFixed(2)}M voters) consolidated around ${emergentFaction.keyIssues.join(' and ')}.`
    };
  }

  // --------------------------------------------------------------------------
  // Cycle-End Evaluator (Conservative Historic Pacing: max 1 event / cycle)
  // --------------------------------------------------------------------------
  function evaluateIdentityBlocEvents(game, rng) {
    if (!game || !Array.isArray(game.factions)) {
      return { events: [], summary: [] };
    }
    const rand = resolveRng(rng);
    const state = ensureIdentityBlocState(game);
    const events = [];

    // Collect eligible Event A (splits), Event B (Latino unify), Event C (emergent)
    const unifiedSplitCandidates = [];
    for (const group of IDENTITY_BLOC_CATALOG) {
      const uid = group.unifiedBloc?.id;
      if (uid && game.factions.some((f) => f && f.id === uid)) {
        unifiedSplitCandidates.push(group.id);
      }
    }

    const latinoGroup = getIdentityGroup('latino_voters');
    const latinoSubIds = new Set((latinoGroup?.subFactions || []).map((s) => s.id));
    const latinoCanUnify =
      !game.factions.some((f) => f && f.id === latinoGroup.unifiedBloc.id) &&
      game.factions.filter((f) => f && (latinoSubIds.has(f.id) || f.identityGroupId === 'latino_voters')).length >= 2;

    const emergentCandidates = EMERGENT_GROUP_IDS.filter((gid) => {
      if (state.emergedGroups.includes(gid)) return false;
      const g = getIdentityGroup(gid);
      const subIds = new Set((g.subFactions || []).map((s) => s.id));
      return !game.factions.some((f) => f && (f.id === g.unifiedBloc.id || subIds.has(f.id) || f.identityGroupId === gid));
    });

    // Conservative pacing (~15% total chance per cycle, max 1 historic event per cycle)
    const roll = rand();
    if (roll < 0.06 && emergentCandidates.length > 0) {
      const pick = emergentCandidates[Math.floor(rand() * emergentCandidates.length)];
      const res = triggerEmergentIdentityBloc(game, pick, rand);
      if (res.ok) events.push(res);
    } else if (roll >= 0.06 && roll < 0.105 && latinoCanUnify) {
      const res = triggerLatinoUnification(game, rand);
      if (res.ok) events.push(res);
    } else if (roll >= 0.105 && roll < 0.15 && unifiedSplitCandidates.length > 0) {
      const pick = unifiedSplitCandidates[Math.floor(rand() * unifiedSplitCandidates.length)];
      const res = triggerIdentityBlocSplit(game, pick, rand);
      if (res.ok) events.push(res);
    }

    const summary = events.map((ev) => ({
      type: ev.type,
      groupId: ev.groupId,
      headline: ev.headline,
      description: ev.description,
      totalVoters: ev.totalVoters
    }));

    return { events, summary };
  }

  return {
    IDENTITY_BLOC_CATALOG,
    EXISTING_IDENTITY_FACTION_IDS: [...EXISTING_IDENTITY_FACTION_IDS],
    EMERGENT_GROUP_IDS,
    isProtectedIdentityBloc,
    isWhiteIdentityAttempt,
    getIdentityGroup,
    ensureIdentityBlocState,
    triggerIdentityBlocSplit,
    triggerLatinoUnification,
    triggerEmergentIdentityBloc,
    evaluateIdentityBlocEvents
  };
});
