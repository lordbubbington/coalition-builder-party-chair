/**
 * Coalition Builder: Party Chair — v0.18.8 Procedural Faction Naming, Issue Inheritance & Temperaments
 * Standalone UMD/IIFE module (Wave 1 Module #2).
 * Exposes window.ProceduralFactionNaming (browser) and module.exports (Node/CommonJS).
 */
(function (root) {
  'use strict';

  const FORBIDDEN_GEOGRAPHIC_PATTERNS = [
    // 50 US States & DC / Territories
    /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming|puerto rico|columbia)\b/i,
    // Major US cities
    /\b(atlanta|austin|baltimore|boston|charlotte|chicago|cincinnati|cleveland|columbus|dallas|denver|detroit|houston|indianapolis|jacksonville|kansas city|las vegas|los angeles|memphis|miami|milwaukee|minneapolis|nashville|new orleans|newark|oakland|oklahoma city|omaha|orlando|philadelphia|phoenix|pittsburgh|portland|raleigh|sacramento|salt lake|san antonio|san diego|san francisco|san jose|seattle|st\.?\s*louis|tampa|tucson)\b/i,
    // US geographic regions & directional geography
    /\b(northeast|northwest|southeast|southwest|midwest|midwestern|new england|mid-atlantic|sun\s*belt|sunbelt|rust\s*belt|rustbelt|appalachia|appalachian|heartland|dixie|pacific|atlantic|great lakes|rocky mountain|great plains|deep south|bible belt|corn belt|cascadia|bay area|silicon valley|wall street)\b/i,
    /\b(northern|southern|eastern|western|coastal|inland)\b/i,
  ];

  // ============================================================================
  // 1. PRIMARY ISSUE ROOTS (~200+ entries mapped across all 44+ game issues)
  // ============================================================================
  const ISSUE_ROOTS_BY_ID = {
    'taxes-spending': ['Tax-Cut', 'Fiscal-Balance', 'Revenue-Reform', 'Spending-Cap', 'Low-Tax'],
    'corporate-tax-rate': ['Corporate-Rate', 'Enterprise-Tax', 'Minimum-Tax', 'Job-Creator', 'Capital-Incentive'],
    'wealth-tax': ['Wealth-Tax', 'Capital-Gains', 'Fair-Share', 'Asset-Stewardship', 'Top-Bracket'],
    'cost-of-living': ['Affordability', 'Cost-of-Living', 'Inflation-Relief', 'Price-Stability', 'Paycheck-Defense'],
    'business-regulation': ['Anti-Trust', 'Deregulation', 'Small-Shop', 'Break-Up-Monopolies', 'Pro-Competition'],
    'monetary-policy': ['Sound-Money', 'Fed-Audit', 'Price-Anchor', 'Hard-Currency', 'Monetary-Reform'],
    'foreign-policy': ['Non-Interventionist', 'Diplomatic-Restraint', 'Alliance-First', 'Sovereign-Realism', 'Peace-Accord'],
    'defense-spending': ['Readiness', 'Pentagon-Audit', 'Defense-Rebuild', 'Deterrence', 'Arsenal-Shield'],
    'iran-policy': ['Maximum-Pressure', 'Gulf-Deterrence', 'Nuclear-Containment', 'De-Escalation', 'Sanctions-Hawk'],
    'israel-palestine': ['Conditional-Aid', 'Two-State', 'Levant-Alliance', 'Humanitarian-Peace', 'Security-Compact'],
    'climate-action': ['Net-Zero', 'Green-Transition', 'Carbon-Cap', 'Clean-Climate', 'Emissions-Freedom'],
    'energy-mix': ['Energy-Abundance', 'Grid-Expansion', 'Zero-Fracking', 'Domestic-Drill', 'All-Source-Power'],
    'green-standards': ['Clean-Mandate', 'Subsidy-Repeal', 'Grid-Modernization', 'Battery-Scale', 'Nuclear-Baseload'],
    'religious-liberty': ['Conscience-Rights', 'Secular-Neutrality', 'Faith-Shield', 'Religious-Autonomy', 'Plural-Liberty'],
    'church-state-schools': ['Secular-Classroom', 'Parent-Choice', 'Moral-Curriculum', 'First-Amendment', 'Academic-Freedom'],
    'faith-based-funding': ['Charity-Compact', 'Secular-Grants', 'Faith-Partnership', 'Civic-Almsgiving', 'Parish-Relief'],
    'medicare-social-security': ['Entitlement-Defense', 'Solvency-First', 'Senior-Lockbox', 'Retirement-Security', 'Benefit-Shield'],
    'health-coverage': ['Single-Payer', 'Medicare-for-All', 'Patient-Choice', 'Public-Option', 'Care-Access'],
    'snap-food-aid': ['Nutrition-Safety', 'Work-Requirement', 'Food-Security', 'Welfare-Reform', 'Family-Pantry'],
    'prescription-drugs': ['Drug-Price-Cap', 'Pharma-Competition', 'Patent-Reform', 'Affordable-Meds', 'Bio-Innovation'],
    'minimum-wage': ['Living-Wage', 'Paycheck-Floor', 'Labor-Dignity', 'Wage-Freedom', 'Worker-Pay'],
    'racial-equity': ['Civil-Rights', 'Equal-Opportunity', 'Merit-First', 'Justice-Equity', 'Colorblind-Law'],
    'voting-rules': ['Voting-Access', 'Ballot-Integrity', 'Voter-ID', 'Civic-Franchise', 'Fair-Ballot'],
    'lgbtq-policy': ['Equality-Act', 'Traditional-Norms', 'Non-Discrimination', 'Family-Code', 'Civil-Protection'],
    'criminal-justice-reform': ['Rule-of-Law', 'Sentencing-Reform', 'Safe-Streets', 'Second-Chance', 'Law-and-Order'],
    'abortion': ['Reproductive-Rights', 'Right-to-Life', 'Privacy-Shield', 'Unborn-Defense', 'Care-Autonomy'],
    'immigration-visas': ['Merit-Visa', 'Humanitarian-Asylum', 'Skill-Talent', 'Quota-Reset', 'Guest-Worker'],
    'border-enforcement': ['Border-First', 'Sovereign-Border', 'Port-Security', 'Asylum-Order', 'Enforcement-First'],
    'nimbyism-housing': ['Pro-Builder', 'Housing-Abundance', 'Zoning-Reform', 'Homeowner-Defense', 'Supply-First'],
    'state-federal': ['Federalist', 'Tenth-Amendment', 'National-Standard', 'Local-Charter', 'Decentralist'],
    'primary-rules': ['Open-Primary', 'Ranked-Choice', 'Ballot-Access', 'Delegate-Voice', 'Fair-Primary'],
    'campaign-finance-reform': ['Small-Donor', 'Clean-Money', 'Anti-PAC', 'Speech-Funding', 'Public-Finance'],
    'platform-enforcement': ['Big-Tent-Charter', 'Platform-Unity', 'Conscience-Vote', 'Creed-Discipline', 'Open-Slate'],
    'ideological-purity': ['Doctrinal-Core', 'Coalition-Realism', 'Pragmatic-Center', 'Creed-Guard', 'Big-Tent-Accord'],
    'candidate-autonomy': ['Free-Conscience', 'Caucus-Unity', 'Independent-Voice', 'Whip-Discipline', 'Nominee-Autonomy'],
    'democracy-checks': ['Checks-and-Balances', 'Executive-Restraint', 'Strong-Presidency', 'Parliamentary-Check', 'Charter-Guard'],
    'corruption-ethics': ['Anti-Corruption', 'Ethics-Watchdog', 'Stock-Ban', 'Clean-Government', 'Civil-Merit'],
    'election-certification': ['Count-Integrity', 'Electoral-Count', 'Neutral-Canvas', 'Ballot-Confidence', 'Peaceful-Transfer'],
    'institutional-trust': ['Institution-Defense', 'Media-Accountability', 'Truth-and-Trust', 'Establishment-Break', 'Civic-Norms'],
    'insider-influence': ['Drain-the-Swamp', 'Anti-Lobbyist', 'Revolving-Door-Ban', 'Expert-Stewardship', 'Clean-Lobby'],
    'populist-revolt': ['Populist-Mandate', 'Anti-Cartel', 'Citizen-Jury', 'Working-Revolt', 'Techno-Governance'],
    'nato-global-security-hegemony': ['NATO-Shield', 'Treaty-Restraint', 'Allied-Burden', 'Free-World-Guard', 'Strategic-Autonomy'],
    'frontier-ai-oversight-compute': ['AI-Safety', 'Anti-Automation', 'Compute-Abundance', 'Model-Licensing', 'Tech-Sovereignty'],
    'federal-public-lands-energy': ['Public-Stewardship', 'Energy-Permitting', 'Conservation-Trust', 'Resource-Transfer', 'Mineral-Security'],
    // Supplemental issue-key aliases mapped from factions-0.15.js keyIssues & eras
    'tariffs': ['Tariff-Shield', 'Domestic-Manufacturing', 'Fair-Trade', 'Reshoring'],
    'guns': ['Second-Amendment', 'Gun-Safety', 'Self-Defense', 'Background-Check'],
    'crypto': ['Crypto-Freedom', 'Digital-Privacy', 'Free-Speech-Tech', 'Open-Ledger'],
    'agriculture': ['Farm-Parity', 'Crop-Security', 'Grower-Alliance', 'Food-Independence'],
  };

  const PRIMARY_ISSUE_ROOTS = Array.from(new Set(Object.values(ISSUE_ROOTS_BY_ID).flat()));

  // ============================================================================
  // 2. IDEOLOGICAL / SHIFT MODIFIERS (~60+ entries)
  // ============================================================================
  const IDEOLOGICAL_MODIFIERS = [
    'Hardline', 'Moderate', 'Populist', 'Centrist', 'Nationalist',
    'Progressive', 'Free-Market', 'Traditional', 'Hawkish', 'Fiscally-Disciplined',
    'Anti-Populist', 'Worker-First', 'Libertarian', 'Social-Democratic', 'Fiscal-Conservative',
    'Supply-Side', 'Demand-Side', 'Institutional', 'Anti-Corporate', 'Pro-Enterprise',
    'Constitutionalist', 'Paleoconservative', 'Neoliberal', 'Social-Gospel', 'Eco-Modernist',
    'Degrowth', 'Techno-Optimist', 'Anti-Monopolist', 'Sovereign', 'Pluralist',
    'Traditionalist', 'Secular', 'Deregulatory', 'Reform-Minded', 'Orthodox',
    'Heterodox', 'Incrementalist', 'Structuralist', 'Abundance-Minded', 'Austerity',
    'Pro-Labor', 'Pro-Growth', 'Anti-Cartel', 'Civic-Nationalist', 'Market-Skeptical',
    'Federalist', 'Communitarian', 'Strict-Constructionist', 'Mainstream', 'Left-Populist',
    'Right-Populist', 'Center-Left', 'Center-Right', 'Market-Oriented', 'Restraint-First',
    'Deterrence-Minded', 'Fair-Trade', 'Free-Trade', 'Deficit-Conscious', 'Social-Insurance',
    'Anti-Establishment', 'Pro-Competition',
  ];

  // ============================================================================
  // 3. PARENT HERITAGE ROOTS (~150+ entries covering all 20 starting factions + fallbacks)
  // ============================================================================
  const PARENT_HERITAGE_MAP = {
    // 20 Starting Major-Party Factions (factions-0.15.js #1-#20)
    dem_liberal_establishment: ['Institutional', 'Mainstream-Liberal', 'Norm-Keeper', 'Apparatus-Loyalist', 'Steady-Governance', 'Coalition-Steward'],
    dem_black_voters: ['Civil-Rights-Legacy', 'Voting-Justice', 'Freedom-Charter', 'Equal-Ballot', 'Civic-Dignity'],
    dem_capital_l_left: ['Progressive-Vanguard', 'Left-Flank', 'Systemic-Reform', 'Green-Equity', 'Social-Guarantee'],
    dem_neo_liberals: ['Market-Liberal', 'Global-Trade', 'Technocratic-Center', 'Growth-Pragmatist', 'Modern-Policy', 'Fiscal-Pragmatist'],
    dem_abundance: ['State-Capacity', 'Pro-Builder', 'Permitting-Reform', 'Transit-Modernizer', 'Abundance-Charter', 'Clean-Growth'],
    dem_bernie_bros: ['Economic-Populist', 'Antitrust-Left', 'Working-Class-Progressive', 'Wealth-Reform', 'Grassroots-Left', 'Labor-Populist'],
    dem_faith_based_liberals: ['Social-Gospel', 'Compassionate-Civic', 'Moral-Covenant', 'Interfaith-Justice', 'Community-Mercy', 'Conscience-Progressive'],
    dem_blue_dog: ['Fiscal-Centrist', 'Deficit-Hawk', 'Blue-Dog', 'Small-Town-Moderate', 'Bipartisan-Budget', 'Balanced-Center'],
    dem_traditional_latin: ['Family-Labor', 'Aspirational-Working', 'Main-Street-Civic', 'Enterprise-Family', 'Community-Dignity'],
    gop_faith_and_flag: ['Faith-and-Flag', 'Traditional-Creed', 'Family-Covenant', 'Religious-Heritage', 'Moral-Conservative', 'Sanctuary-Right'],
    gop_maga: ['America-First', 'National-Populist', 'Tariff-Nationalist', 'Sovereign-Worker', 'Anti-Globalist-Right', 'Populist-Movement'],
    gop_western_mavericks: ['Liberty-Maverick', 'Freeholder', 'Second-Amendment', 'Small-Government', 'Individual-Autonomy', 'Constitutional-Maverick'],
    gop_blood_and_soil: ['Hard-Sovereignty', 'Zero-Immigration', 'Heritage-Nationalist', 'Border-Hardliner', 'Strict-Nationhood', 'Closed-Border'],
    gop_suburban_moderates: ['Kitchen-Table-GOP', 'Local-Restraint', 'Parent-Choice', 'Taxpayer-Moderate', 'Center-Right-Civic', 'Pro-Business-Moderate'],
    gop_neo_cons: ['Peace-Through-Strength', 'Defense-Hawk', 'Alliance-Steward', 'Global-Deterrence', 'Security-Internationalist', 'Arsenal-Conservative'],
    gop_paleocons: ['Old-Right', 'Non-Interventionist-Right', 'Decentralized-Traditional', 'Constitutional-Federalist', 'Restraint-Traditionalist', 'Anti-War-Right'],
    gop_mormons: ['Conscience-Civic', 'Refuge-and-Family', 'Orderly-Liberty', 'Moral-Stewardship', 'Principled-Right'],
    gop_traditional_farmers: ['Agrarian', 'Crop-Steward', 'Co-Op-Producer', 'Family-Farm', 'Commodity-Security', 'Grower-Conservative'],
    gop_market_country_club: ['Supply-Side', 'Free-Enterprise', 'Capital-Market', 'Boardroom-Conservative', 'Deregulation-First', 'Chamber-Fiscal'],
    gop_cubans: ['Anti-Totalitarian', 'Sanctions-Hawk', 'Free-Enterprise-Exile', 'Hemispheric-Liberty', 'Sovereign-Trade'],

    // Swing, Minor & Unaffiliated Factions (fallbacks so later-generation splits keep rich lineage)
    swg_true_centrists: ['Problem-Solver', 'Bipartisan-Bridge', 'Gridlock-Breaker', 'Pragmatic-Center', 'Consensus-Civic'],
    swg_hard_hats: ['Union-Hall', 'Shopfloor-Manufacturing', 'Blue-Collar-Trade', 'Industrial-Worker', 'Domestic-Mill'],
    swg_podcast_bros: ['Free-Speech-Digital', 'Anti-Gatekeeper', 'Open-Forum', 'Crypto-Skeptic-Elite', 'Independent-Creator'],
    swg_country_club_centrists: ['Fiscal-Discipline', 'Capital-Moderate', 'Chamber-Centrist', 'Tax-Restraint-Center', 'Market-Pragmatist'],
    swg_technocrats: ['Innovation-First', 'High-Skill-Growth', 'Compute-Modernizer', 'Evidence-Policy', 'R-and-D-Center'],
    swg_grillers: ['Grocery-Budget', 'Paycheck-Focus', 'Non-Ideological-Family', 'Price-Watch', 'Everyday-Household'],
    swg_religious_moderates: ['Civic-Charity', 'Parish-Bridge', 'Community-Care', 'Faithful-Moderate', 'Neighborhood-Steward'],
    lib_true_libertarians: ['Natural-Rights', 'Voluntaryist', 'Limited-Charter', 'Individual-Liberty', 'Free-Association'],
    lib_ancaps: ['Zero-Statist', 'Rothbardian', 'Sound-Currency-Radical', 'Private-Law', 'Total-Tax-Abolition'],
    lib_classical_liberals: ['Classical-Liberal', 'Civil-Libertarian', 'Free-Commerce', 'Due-Process', 'Open-Society'],
    grn_eco_socialist_vanguard: ['Eco-Socialist', 'Fossil-Exit', 'Public-Commons', 'Green-Workers', 'Climate-Mobilization'],
    grn_yimby: ['Urbanist-Abundance', 'Housing-First', 'Transit-Civic', 'Permitting-Yes', 'Density-Reform'],
    con_christian_dominionists: ['Natural-Law-Charter', 'Theocratic-Right', 'Moral-Ordinance', 'Creed-Primacy', 'Traditional-Sovereign'],
    soc_socialists: ['Worker-Ownership', 'Public-Banking', 'Union-Democracy', 'Social-Commons', 'Cooperative-Commonwealth'],
    soc_communists: ['Industrial-Collective', 'Planned-Commons', 'Anti-Monopoly-Syndicate', 'Workers-Front', 'Labor-Vanguard'],
    unaff_groypers: ['Zero-Migration', 'Ultra-Nationalist', 'Culture-Counter', 'Sovereign-Reaction', 'Insular-Right'],
    unaff_the_klan: ['Extreme-Reactionary', 'Exclusionary-Hardline', 'Authoritarian-Fringe', 'Ultra-Militant'],
  };

  const GENERIC_HERITAGE_BY_PARTY = {
    people: ['Civic-Reform', 'Coalition-Liberal', 'Opportunity-Charter', 'Public-Investment', 'Modern-Democratic'],
    heritage: ['Constitutional-Order', 'Enterprise-Conservative', 'National-Heritage', 'Taxpayer-Defense', 'Traditional-Right'],
    liberty: ['Individualist', 'Free-Market-Liberty', 'Constitutional-Limit', 'Civil-Freedom', 'Non-Aggression'],
    green: ['Ecological-Commons', 'Clean-Future', 'Zero-Waste-Civic', 'Sustainable-Democracy', 'Renewable-Accord'],
    constitution: ['Founding-Charter', 'Tenth-Amendment-Right', 'Moral-Republic', 'Sovereign-Law', 'Originalist'],
    socialist: ['Solidarity-Labor', 'Public-Enterprise', 'Worker-Commonwealth', 'Social-Ownership', 'Rank-and-File-Left'],
    independent: ['Unaligned-Center', 'Cross-Party-Reform', 'Ticket-Splitter', 'Open-Coalition', 'Civic-Balance'],
  };

  const PARENT_HERITAGE_ROOTS = Array.from(
    new Set([
      ...Object.values(PARENT_HERITAGE_MAP).flat(),
      ...Object.values(GENERIC_HERITAGE_BY_PARTY).flat(),
    ])
  );

  // ============================================================================
  // 4. ARCHETYPE & TONE DESCRIPTORS (~50+ entries, STRICTLY non-geographic)
  // ============================================================================
  const ARCHETYPE_TONE_DESCRIPTORS = [
    'Pragmatic', 'Hardline', 'Reform', 'Revival', 'Common-Sense',
    'Maverick', 'Dissident', 'Anti-Establishment', 'Realist', 'Vanguard',
    'Principled', 'Modern', 'Forward', 'Independent', 'Main Street',
    'Kitchen-Table', 'Working-Family', 'Small-Business', 'Pocketbook', 'Next-Gen',
    'Old-Guard', 'Civic', 'Grassroots', 'Outsider', 'Technocratic',
    'Constitutional', 'Taxpayer', 'Blue-Collar', 'White-Collar', 'Everyday',
    'Hardworking', 'Union-Hall', 'Bread-and-Butter', 'Town-Hall', 'Shopfloor',
    'Paycheck', 'Homeowner', 'Parent-Led', 'Veteran-Led', 'Youth-Led',
    'Senior-Advocate', 'Enterprise', 'Rank-and-File', 'Dissenting', 'Unaligned',
    'Bridge-Building', 'Solution-First', 'Future-Focused', 'Accountability', 'Anti-Gridlock',
    'Citizen-Led', 'Steadfast',
  ];

  // ============================================================================
  // 5. CORE NOUNS (~40+ entries)
  // ============================================================================
  const CORE_NOUNS = [
    'Advocates', 'Coalition', 'Reformers', 'Movement', 'Wing',
    'Bloc', 'Hawks', 'Moderates', 'Populists', 'Dissidents',
    'Mavericks', 'Breakaways', 'Conservatives', 'Liberals', 'Democrats',
    'Nationalists', 'Realists', 'Republicans', 'Libertarians', 'Progressives',
    'Traditionalists', 'Pragmatists', 'Technocrats', 'Institutionalists', 'Activists',
    'Voters', 'Organizers', 'Loyalists', 'Champions', 'Defenders',
    'Builders', 'Skeptics', 'Purists', 'Modernizers', 'Contenders',
    'Independents', 'Unionists', 'Internationalists', 'Federalists', 'Individualists',
    'Stewards',
  ];

  // ============================================================================
  // 6. MOVEMENT SUFFIXES (~35+ entries)
  // ============================================================================
  const MOVEMENT_SUFFIXES = [
    'Caucus-Wing', 'Revivalists', 'Network', 'Alliance', 'Front',
    'Forum', 'Initiative', 'Compact', 'Action Bloc', 'League',
    'Assembly', 'Working Group', 'Project', 'Roundtable', 'Guild',
    'Federation', 'Campaign', 'Standard-Bearers', 'Partnership', 'Council',
    'Union', 'Association', 'Collective', 'Fellowship', 'Congress',
    'Accord', 'Platform', 'Covenant', 'Circle', 'Syndicate',
    'Charter', 'Wave', 'Brigade', 'Consensus', 'Guildhall',
    'Coalition-Front',
  ];

  // ============================================================================
  // Default Issue Catalog Fallback (44 canonical issues from issues-0.2.1.js)
  // ============================================================================
  const FALLBACK_ISSUE_LIST = [
    { id: 'taxes-spending', label: 'Taxes and public spending', axis: 'economic', pillarId: 'tax-economy', defaultStance: 5.0 },
    { id: 'corporate-tax-rate', label: 'Corporate tax rate and incentives', axis: 'economic', pillarId: 'tax-economy', defaultStance: 5.0 },
    { id: 'wealth-tax', label: 'Wealth tax and capital gains', axis: 'economic', pillarId: 'tax-economy', defaultStance: 5.0 },
    { id: 'cost-of-living', label: 'Affordability and cost of living', axis: 'economic', pillarId: 'tax-economy', defaultStance: 4.5, highSalience: true },
    { id: 'business-regulation', label: 'Business regulation and antitrust', axis: 'economic', pillarId: 'tax-economy', defaultStance: 5.0 },
    { id: 'monetary-policy', label: 'Monetary policy and the Federal Reserve', axis: 'economic', pillarId: 'tax-economy', defaultStance: 5.5 },
    { id: 'foreign-policy', label: 'U.S. foreign policy and alliances', axis: 'social', pillarId: 'foreign-policy', defaultStance: 4.5 },
    { id: 'defense-spending', label: 'Defense spending and military readiness', axis: 'economic', pillarId: 'foreign-policy', defaultStance: 5.5 },
    { id: 'iran-policy', label: 'Iran and regional conflict', axis: 'social', pillarId: 'foreign-policy', defaultStance: 5.5 },
    { id: 'israel-palestine', label: 'Israel and Palestinian territories', axis: 'social', pillarId: 'foreign-policy', defaultStance: 5.5 },
    { id: 'climate-action', label: 'Climate targets and emissions', axis: 'climate', pillarId: 'climate-policy', defaultStance: 4.5, highSalience: true },
    { id: 'energy-mix', label: 'Energy mix and domestic production', axis: 'climate', pillarId: 'climate-policy', defaultStance: 5.5, highSalience: true },
    { id: 'green-standards', label: 'Clean energy standards and subsidies', axis: 'climate', pillarId: 'climate-policy', defaultStance: 4.5 },
    { id: 'religious-liberty', label: 'Religious liberty and civil rights', axis: 'social', pillarId: 'religious-policy', defaultStance: 5.5 },
    { id: 'church-state-schools', label: 'Religion in public schools and education', axis: 'social', pillarId: 'religious-policy', defaultStance: 5.0 },
    { id: 'faith-based-funding', label: 'Faith-based social services and public funding', axis: 'social', pillarId: 'religious-policy', defaultStance: 5.0 },
    { id: 'medicare-social-security', label: 'Medicare and Social Security', axis: 'economic', pillarId: 'social-services', defaultStance: 4.0, highSalience: true },
    { id: 'health-coverage', label: 'Health coverage structure', axis: 'economic', pillarId: 'social-services', defaultStance: 4.5, highSalience: true },
    { id: 'snap-food-aid', label: 'SNAP and food assistance rules', axis: 'economic', pillarId: 'social-services', defaultStance: 4.5 },
    { id: 'prescription-drugs', label: 'Prescription drug prices', axis: 'economic', pillarId: 'social-services', defaultStance: 4.0 },
    { id: 'minimum-wage', label: 'Minimum wage and worker compensation', axis: 'economic', pillarId: 'social-services', defaultStance: 4.5 },
    { id: 'racial-equity', label: 'Race and equal opportunity', axis: 'social', pillarId: 'social-justice', defaultStance: 4.5 },
    { id: 'voting-rules', label: 'Voting access and election procedures', axis: 'social', pillarId: 'social-justice', defaultStance: 4.5, highSalience: true },
    { id: 'lgbtq-policy', label: 'LGBTQ+ civil rights and protections', axis: 'social', pillarId: 'social-justice', defaultStance: 4.5 },
    { id: 'criminal-justice-reform', label: 'Sentencing and criminal justice reform', axis: 'social', pillarId: 'social-justice', defaultStance: 5.5 },
    { id: 'abortion', label: 'Abortion and reproductive rights', axis: 'social', pillarId: 'social-justice', defaultStance: 5.0, highSalience: true },
    { id: 'immigration-visas', label: 'Legal immigration and visas', axis: 'social', pillarId: 'social-justice', defaultStance: 4.5 },
    { id: 'border-enforcement', label: 'Border enforcement and security', axis: 'social', pillarId: 'social-justice', defaultStance: 6.0, highSalience: true },
    { id: 'nimbyism-housing', label: 'NIMBYism and housing development', axis: 'economic', pillarId: 'social-justice', defaultStance: 4.5, highSalience: true },
    { id: 'state-federal', label: 'Federal standards vs. state party autonomy', axis: 'local', pillarId: 'party-structure', defaultStance: 5.5 },
    { id: 'primary-rules', label: 'Primary rules and ballot access', axis: 'local', pillarId: 'party-structure', defaultStance: 4.5 },
    { id: 'campaign-finance-reform', label: 'Campaign finance and spending limits', axis: 'economic', pillarId: 'party-structure', defaultStance: 4.5 },
    { id: 'platform-enforcement', label: 'Platform enforcement on nominees', axis: 'local', pillarId: 'party-ideology', defaultStance: 5.5 },
    { id: 'ideological-purity', label: 'Ideological purity vs. big-tent realism', axis: 'local', pillarId: 'party-ideology', defaultStance: 5.5 },
    { id: 'candidate-autonomy', label: 'Caucus discipline and conscience voting', axis: 'local', pillarId: 'party-ideology', defaultStance: 5.5 },
    { id: 'democracy-checks', label: 'Democracy and checks on executive power', axis: 'local', pillarId: 'democracy-policy', defaultStance: 4.5, highSalience: true },
    { id: 'corruption-ethics', label: 'Government corruption and civil service', axis: 'local', pillarId: 'democracy-policy', defaultStance: 4.0 },
    { id: 'election-certification', label: 'Election certification and neutral administration', axis: 'local', pillarId: 'democracy-policy', defaultStance: 4.0 },
    { id: 'institutional-trust', label: 'Institutional trust and media relations', axis: 'local', pillarId: 'establishment-stance', defaultStance: 5.0 },
    { id: 'insider-influence', label: 'Lobbyist influence and revolving-door culture', axis: 'local', pillarId: 'establishment-stance', defaultStance: 6.0 },
    { id: 'populist-revolt', label: 'Populist revolt vs. technocratic governance', axis: 'local', pillarId: 'establishment-stance', defaultStance: 5.5, highSalience: true },
    { id: 'nato-global-security-hegemony', label: 'NATO & Global Security Hegemony', axis: 'local', pillarId: 'foreign-policy', defaultStance: 5.5 },
    { id: 'frontier-ai-oversight-compute', label: 'Frontier AI Oversight & Compute Infrastructure', axis: 'economic', pillarId: 'climate-policy', defaultStance: 5.5, highSalience: true },
    { id: 'federal-public-lands-energy', label: 'Federal Public Lands & Energy Deregulation', axis: 'climate', pillarId: 'climate-policy', defaultStance: 5.5 },
  ];

  // ============================================================================
  // Temperament Definitions (Section 2E)
  // ============================================================================
  const TEMPERAMENTS = {
    true_believer: {
      id: 'true_believer',
      label: 'True Believer',
      summary: 'High ideological loyalty while the party backs its Primary Issue; harsh penalty if betrayed on that issue.',
      modifiers: {
        appeasementMultiplier: 0.85,
        primaryIssueBetrayalPenalty: 1.75,
        losingStreakBoltMultiplier: 0.35,
        caucusFrayMultiplier: 0.85,
      },
    },
    fair_weather: {
      id: 'fair_weather',
      label: 'Fair-Weather',
      summary: 'Results-driven coalition partner — loyal during winning streaks, sharp bolt risk after 2 consecutive losing cycles.',
      modifiers: {
        appeasementMultiplier: 1.0,
        primaryIssueBetrayalPenalty: 1.0,
        losingStreakBoltMultiplier: 1.85,
        caucusFrayMultiplier: 1.1,
      },
    },
    transactional: {
      id: 'transactional',
      label: 'Transactional',
      summary: '+40% appeasement efficiency via budget, patronage, and endorsements, but lower ideological loyalty and faster Caucus fray if neglected.',
      modifiers: {
        appeasementMultiplier: 1.4,
        primaryIssueBetrayalPenalty: 0.75,
        losingStreakBoltMultiplier: 1.15,
        caucusFrayMultiplier: 1.35,
      },
    },
  };

  // ============================================================================
  // Helpers & Issue Normalization
  // ============================================================================
  function round1(n) {
    return Math.round(Number(n) * 10) / 10;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function createRng(rngOrSeed) {
    if (typeof rngOrSeed === 'function') return rngOrSeed;
    if (Number.isFinite(Number(rngOrSeed))) {
      let state = (Math.floor(Number(rngOrSeed)) >>> 0) || 2028;
      return function () {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
      };
    }
    return Math.random;
  }

  function pick(arr, rng) {
    if (!Array.isArray(arr) || !arr.length) return '';
    const idx = Math.floor(clamp(rng(), 0, 0.9999999) * arr.length);
    return arr[idx];
  }

  function containsGeographicTerm(text) {
    if (!text) return false;
    return FORBIDDEN_GEOGRAPHIC_PATTERNS.some((rx) => rx.test(String(text)));
  }

  function getCatalogIssues() {
    const loaded = (typeof window !== 'undefined' && window.PartyChairData?.VERSION_021_ISSUES)
      || (typeof globalThis !== 'undefined' && globalThis.PartyChairData?.VERSION_021_ISSUES);
    if (Array.isArray(loaded) && loaded.length) return loaded;
    return FALLBACK_ISSUE_LIST;
  }

  function normalizeIssueToken(str) {
    return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function resolveIssueMeta(issueInput) {
    const catalog = getCatalogIssues();
    if (issueInput && typeof issueInput === 'object') {
      const found = catalog.find((c) => c.id === issueInput.id || normalizeIssueToken(c.label) === normalizeIssueToken(issueInput.label));
      return {
        id: issueInput.id || found?.id || normalizeIssueToken(issueInput.label).replace(/\s+/g, '-'),
        label: issueInput.label || issueInput.name || found?.label || String(issueInput.id || 'Reform Policy'),
        axis: issueInput.axis || found?.axis || 'economic',
        pillarId: issueInput.pillarId || found?.pillarId || 'tax-economy',
        salience: Number(issueInput.salience || (issueInput.isShockIssue ? 3 : issueInput.isEraIssue ? 2 : 1)),
        isEraIssue: Boolean(issueInput.isEraIssue),
        isShockIssue: Boolean(issueInput.isShockIssue),
      };
    }
    const raw = String(issueInput || '').trim();
    const norm = normalizeIssueToken(raw);
    const exact = catalog.find((c) => c.id === raw || normalizeIssueToken(c.label) === norm);
    if (exact) {
      return { id: exact.id, label: exact.label, axis: exact.axis || 'economic', pillarId: exact.pillarId || 'tax-economy', salience: 1 };
    }
    // Partial keyword match across catalog labels
    const words = norm.split(' ').filter((w) => w.length >= 4);
    const partial = words.length ? catalog.find((c) => words.some((w) => normalizeIssueToken(c.label).includes(w) || c.id.includes(w))) : null;
    if (partial) {
      return { id: partial.id, label: raw || partial.label, axis: partial.axis || 'economic', pillarId: partial.pillarId || 'tax-economy', salience: 1, matchedId: partial.id };
    }
    return { id: norm.replace(/\s+/g, '-') || 'cost-of-living', label: raw || 'Cost of Living', axis: 'economic', pillarId: 'tax-economy', salience: 1 };
  }

  function getIssueRootsForIssue(issueInput) {
    const meta = resolveIssueMeta(issueInput);
    const key = meta.matchedId || meta.id;
    if (ISSUE_ROOTS_BY_ID[key]) return ISSUE_ROOTS_BY_ID[key];
    const norm = normalizeIssueToken(meta.label || meta.id);
    if (norm.includes('tariff') || norm.includes('trade')) return ISSUE_ROOTS_BY_ID.tariffs;
    if (norm.includes('second amendment') || norm.includes('gun')) return ISSUE_ROOTS_BY_ID.guns;
    if (norm.includes('crypto') || norm.includes('speech')) return ISSUE_ROOTS_BY_ID.crypto;
    if (norm.includes('agricultur') || norm.includes('farm') || norm.includes('crop')) return ISSUE_ROOTS_BY_ID.agriculture;
    if (norm.includes('healthcare') || norm.includes('health')) return ISSUE_ROOTS_BY_ID['health-coverage'];
    if (norm.includes('border') || norm.includes('immigration')) return ISSUE_ROOTS_BY_ID['border-enforcement'];
    if (norm.includes('climate') || norm.includes('fossil') || norm.includes('carbon')) return ISSUE_ROOTS_BY_ID['climate-action'];
    if (norm.includes('housing') || norm.includes('zoning') || norm.includes('nimby')) return ISSUE_ROOTS_BY_ID['nimbyism-housing'];
    if (norm.includes('ai') || norm.includes('compute')) return ISSUE_ROOTS_BY_ID['frontier-ai-oversight-compute'];
    if (norm.includes('tax')) return ISSUE_ROOTS_BY_ID['taxes-spending'];
    if (norm.includes('nato') || norm.includes('defense')) return ISSUE_ROOTS_BY_ID['nato-global-security-hegemony'];
    if (norm.includes('antitrust') || norm.includes('monopol') || norm.includes('regulation')) return ISSUE_ROOTS_BY_ID['business-regulation'];
    if (norm.includes('voting') || norm.includes('ballot')) return ISSUE_ROOTS_BY_ID['voting-rules'];
    if (norm.includes('relig')) return ISSUE_ROOTS_BY_ID['religious-liberty'];
    return PRIMARY_ISSUE_ROOTS;
  }

  function getHeritageRootsForParent(parentFaction, partyId) {
    if (parentFaction && PARENT_HERITAGE_MAP[parentFaction.id]) {
      return PARENT_HERITAGE_MAP[parentFaction.id];
    }
    if (parentFaction?.parentFactionId && PARENT_HERITAGE_MAP[parentFaction.parentFactionId]) {
      return PARENT_HERITAGE_MAP[parentFaction.parentFactionId];
    }
    const pid = partyId || parentFaction?.partyId || 'independent';
    if (GENERIC_HERITAGE_BY_PARTY[pid]) return GENERIC_HERITAGE_BY_PARTY[pid];
    return PARENT_HERITAGE_ROOTS;
  }

  // ============================================================================
  // Combinatorial Scale & Name Generation (6 Birth-Mode-Aware Templates)
  // ============================================================================
  function getCombinatorialStats() {
    const issueN = PRIMARY_ISSUE_ROOTS.length;
    const modN = IDEOLOGICAL_MODIFIERS.length;
    const herN = PARENT_HERITAGE_ROOTS.length;
    const toneN = ARCHETYPE_TONE_DESCRIPTORS.length;
    const nounN = CORE_NOUNS.length;
    const sufN = MOVEMENT_SUFFIXES.length;

    // Raw cartesian product across the 6 birth-mode-aware templates:
    // T1: [The ]{Tone} {Issue} {Noun}
    // T2: {Modifier} {Issue} {Suffix}
    // T3: {Tone} {Heritage} {Noun}
    // T4: {Modifier} {Heritage} {Suffix}
    // T5: {Tone} {Modifier} {Issue} {Suffix}  (and 3-word {Issue} {Tone} {Suffix})
    // T6: {Modifier} {Tone} {Heritage} {Noun} (and 3-word {Modifier} {Issue} {Noun})
    const t1 = toneN * issueN * nounN;
    const t2 = modN * issueN * sufN;
    const t3 = toneN * herN * nounN;
    const t4 = modN * herN * sufN;
    const t5 = toneN * modN * issueN * sufN;
    const t6 = modN * toneN * herN * nounN;
    const rawTotal = t1 + t2 + t3 + t4 + t5 + t6;

    // Conservative clean journalistic estimate (filtering ~30% redundant stems & party noun mismatches)
    const estimatedCleanTotal = Math.floor(rawTotal * 0.68);
    return {
      pools: {
        PRIMARY_ISSUE_ROOTS: issueN,
        IDEOLOGICAL_MODIFIERS: modN,
        PARENT_HERITAGE_ROOTS: herN,
        ARCHETYPE_TONE_DESCRIPTORS: toneN,
        CORE_NOUNS: nounN,
        MOVEMENT_SUFFIXES: sufN,
      },
      templateCounts: { t1, t2, t3, t4, t5, t6 },
      rawTotal,
      estimatedCleanTotal,
    };
  }

  function hasRedundantWordStem(tokens) {
    const stems = [];
    for (const raw of tokens) {
      const parts = String(raw || '').toLowerCase().split(/[\s-]+/).filter((w) => w.length >= 3);
      for (const p of parts) {
        const stem = p.slice(0, Math.min(6, p.length));
        if (stems.some((s) => s === p || s === stem || (stem.length >= 5 && s.startsWith(stem)))) {
          return true;
        }
        stems.push(p);
      }
    }
    return false;
  }

  function pickCleanNoun(rng, partyId) {
    const blocked = new Set();
    if (partyId && partyId !== 'people') blocked.add('Democrats');
    if (partyId && partyId !== 'heritage') blocked.add('Republicans');
    if (partyId && partyId !== 'liberty') blocked.add('Libertarians');
    const pool = blocked.size ? CORE_NOUNS.filter((n) => !blocked.has(n)) : CORE_NOUNS;
    return pick(pool, rng);
  }

  function normalizeFactionNameKey(name) {
    return String(name || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function buildUsedNameSet(game) {
    const set = new Set();
    if (Array.isArray(game?.usedFactionNames)) {
      game.usedFactionNames.forEach((n) => {
        const k = normalizeFactionNameKey(n);
        if (k) set.add(k);
      });
    }
    if (Array.isArray(game?.factions)) {
      game.factions.forEach((f) => {
        const k = normalizeFactionNameKey(f?.name);
        if (k) set.add(k);
      });
    }
    return set;
  }

  function recordUsedFactionName(game, name) {
    const norm = normalizeFactionNameKey(name);
    if (!norm || !game || typeof game !== 'object') return norm;
    if (!Array.isArray(game.usedFactionNames)) game.usedFactionNames = [];
    if (!game.usedFactionNames.includes(norm)) {
      game.usedFactionNames.push(norm);
    }
    return norm;
  }

  function renderCandidateFromTemplate(templateIdx, ctx, rng) {
    const { primaryIssue, parentFaction, partyId } = ctx;
    const issuePool = primaryIssue ? getIssueRootsForIssue(primaryIssue) : PRIMARY_ISSUE_ROOTS;
    const heritagePool = getHeritageRootsForParent(parentFaction, partyId);

    // Blend focused pool (~70%) with broad pool (~30%) so a single issue/parent can spawn rich distinct names
    const issueRoot = (rng() < 0.72 && issuePool.length) ? pick(issuePool, rng) : pick(PRIMARY_ISSUE_ROOTS, rng);
    const heritageRoot = (rng() < 0.72 && heritagePool.length) ? pick(heritagePool, rng) : pick(PARENT_HERITAGE_ROOTS, rng);
    const mod = pick(IDEOLOGICAL_MODIFIERS, rng);
    const tone = pick(ARCHETYPE_TONE_DESCRIPTORS, rng);
    const noun = pickCleanNoun(rng, partyId);
    const suffix = pick(MOVEMENT_SUFFIXES, rng);

    let tokens;
    let useThe = false;
    switch (templateIdx) {
      case 0: // T1: [The] Tone + Issue + Noun
        tokens = [tone, issueRoot, noun];
        useThe = rng() < 0.35;
        break;
      case 1: // T2: Modifier + Issue + Suffix
        tokens = [mod, issueRoot, suffix];
        break;
      case 2: // T3: Tone + Heritage + Noun
        tokens = [tone, heritageRoot, noun];
        useThe = rng() < 0.25;
        break;
      case 3: // T4: Modifier + Heritage + Suffix
        tokens = [mod, heritageRoot, suffix];
        break;
      case 4: // T5: Tone + Modifier + Issue + Suffix (or concise 3-word Issue + Tone + Suffix)
        tokens = rng() < 0.5 ? [tone, mod, issueRoot, suffix] : [issueRoot, tone, suffix];
        break;
      case 5: // T6: Modifier + Tone + Heritage + Noun (or concise Modifier + Issue + Noun)
      default:
        tokens = rng() < 0.5 ? [mod, tone, heritageRoot, noun] : [mod, issueRoot, noun];
        break;
    }

    if (hasRedundantWordStem(tokens)) return null;
    const rawName = (useThe ? 'The ' : '') + tokens.join(' ');
    const cleaned = rawName.replace(/\s+/g, ' ').trim();
    if (containsGeographicTerm(cleaned)) return null;
    return cleaned;
  }

  /**
   * Generate a unique non-geographic journalistic faction name for the campaign.
   * Checks & updates `game.usedFactionNames`.
   */
  function generateUniqueFactionName(options = {}) {
    const birthMode = options.birthMode || 'emerge';
    const rng = createRng(options.rng);
    const game = options.game || null;
    const usedSet = options.usedSet || buildUsedNameSet(game);

    const templateWeightsByMode = {
      emerge: [0, 1, 4, 0, 1, 5],
      sever: [2, 3, 0, 1, 5, 4],
      split: [2, 3, 5, 0, 1, 4],
    };
    const modeTemplates = templateWeightsByMode[birthMode] || [0, 1, 2, 3, 4, 5];

    for (let attempt = 0; attempt < 96; attempt++) {
      const tpl = attempt < 48
        ? pick(modeTemplates, rng)
        : Math.floor(rng() * 6);
      const candidate = renderCandidateFromTemplate(tpl, options, rng);
      if (!candidate) continue;
      const key = normalizeFactionNameKey(candidate);
      if (!usedSet.has(key)) {
        usedSet.add(key);
        recordUsedFactionName(game, candidate);
        return candidate;
      }
    }

    // Guaranteed collision-free journalistic fallback using deterministic combinatorics
    const ordinals = ['Second-Wave', 'New-Charter', 'Independent-Line', 'Renewal', 'Reform-Compact', 'Bicameral', 'Direct-Action', 'Civic-Line'];
    for (let i = 0; i < 500; i++) {
      const t = ARCHETYPE_TONE_DESCRIPTORS[(i + Math.floor(rng() * 50)) % ARCHETYPE_TONE_DESCRIPTORS.length];
      const m = IDEOLOGICAL_MODIFIERS[(i * 7 + Math.floor(rng() * 60)) % IDEOLOGICAL_MODIFIERS.length];
      const r = PRIMARY_ISSUE_ROOTS[(i * 13 + Math.floor(rng() * 200)) % PRIMARY_ISSUE_ROOTS.length];
      const s = MOVEMENT_SUFFIXES[(i * 3 + Math.floor(rng() * 35)) % MOVEMENT_SUFFIXES.length];
      const ord = ordinals[i % ordinals.length];
      const tokens = i < 250 ? [t, m, r, s] : [ord, t, m, r, s];
      if (hasRedundantWordStem(tokens)) continue;
      const candidate = tokens.join(' ');
      if (containsGeographicTerm(candidate)) continue;
      const key = normalizeFactionNameKey(candidate);
      if (!usedSet.has(key)) {
        usedSet.add(key);
        recordUsedFactionName(game, candidate);
        return candidate;
      }
    }

    const lastResort = `Reform-Charter ${pick(IDEOLOGICAL_MODIFIERS, rng)} ${pick(MOVEMENT_SUFFIXES, rng)} ${usedSet.size + 1}`;
    usedSet.add(normalizeFactionNameKey(lastResort));
    recordUsedFactionName(game, lastResort);
    return lastResort;
  }

  // ============================================================================
  // Issue Inheritance (Section 2C)
  // ============================================================================
  function buildPrioritizedFreshPool(activeIssues, excludedTokens, rng) {
    const catalog = getCatalogIssues();
    const rawInputs = Array.isArray(activeIssues) && activeIssues.length ? activeIssues : catalog;
    const normalizedPool = [];
    const seenIds = new Set();

    const addCandidate = (item) => {
      const meta = resolveIssueMeta(item);
      const normLabel = normalizeIssueToken(meta.label);
      const normId = normalizeIssueToken(meta.id);
      if (excludedTokens.has(normLabel) || excludedTokens.has(normId)) return;
      if (seenIds.has(meta.id)) return;
      seenIds.add(meta.id);
      normalizedPool.push(meta);
    };

    rawInputs.forEach(addCandidate);
    catalog.forEach(addCandidate);

    // Shuffle within salience tiers so era/shock/high-salience issues lead
    const highTier = normalizedPool.filter((x) => x.isShockIssue || x.isEraIssue || x.salience >= 2 || x.highSalience);
    const stdTier = normalizedPool.filter((x) => !highTier.includes(x));

    const shuffle = (arr) => {
      const copy = arr.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(clamp(rng(), 0, 0.9999999) * (i + 1));
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
      return copy;
    };

    return [...shuffle(highTier), ...shuffle(stdTier)];
  }

  /**
   * Select child Key Issues and primaryIssueId based on birth mode:
   * - emerge: 2 fresh high-salience/era/shock issues (primaryIssueId = issues[0])
   * - sever: 0 parent issues; 2 fresh high-salience issues (primaryIssueId = issues[0])
   * - split: sibling A gets [parent.keyIssues[0], freshA] (primary = parent[0]);
   *          sibling B gets [parent.keyIssues[1], freshB] (primary = parent[1])
   */
  function selectChildIssues(birthMode, parentFaction, activeIssues, rngInput) {
    const rng = createRng(rngInput);
    const parentKeys = Array.isArray(parentFaction?.keyIssues)
      ? parentFaction.keyIssues.filter(Boolean)
      : [];
    const excluded = new Set();
    parentKeys.forEach((k) => {
      const meta = resolveIssueMeta(k);
      excluded.add(normalizeIssueToken(k));
      excluded.add(normalizeIssueToken(meta.id));
      excluded.add(normalizeIssueToken(meta.label));
    });

    const freshPool = buildPrioritizedFreshPool(activeIssues, excluded, rng);
    const pickFresh = (idx, fallbackLabel) => {
      const entry = freshPool[idx];
      if (!entry) return fallbackLabel;
      return entry.id || entry.label;
    };

    if (birthMode === 'split') {
      const inheritedA = parentKeys[0] || pickFresh(0, 'cost-of-living');
      const inheritedB = parentKeys[1] || pickFresh(1, 'climate-action');
      const freshA = pickFresh(0, 'cost-of-living');
      const freshB = pickFresh(1, 'voting-rules');
      return {
        birthMode: 'split',
        childA: {
          keyIssues: [inheritedA, freshA],
          primaryIssueId: inheritedA,
          inheritedParentIssues: parentKeys[0] ? [inheritedA] : [],
        },
        childB: {
          keyIssues: [inheritedB, freshB],
          primaryIssueId: inheritedB,
          inheritedParentIssues: parentKeys[1] ? [inheritedB] : [],
        },
        siblingPairs: [
          { keyIssues: [inheritedA, freshA], primaryIssueId: inheritedA },
          { keyIssues: [inheritedB, freshB], primaryIssueId: inheritedB },
        ],
      };
    }

    // Both 'emerge' and 'sever' inherit 0 parent Key Issues and pick 2 fresh issues
    const issue1 = pickFresh(0, 'cost-of-living');
    const issue2 = pickFresh(1, 'democracy-checks');
    return {
      birthMode: birthMode === 'sever' ? 'sever' : 'emerge',
      keyIssues: [issue1, issue2],
      primaryIssueId: issue1,
      issues: [issue1, issue2],
      inheritedParentIssues: [],
    };
  }

  // ============================================================================
  // Temperaments (Section 2E)
  // ============================================================================
  function rollFactionTemperament(rngInput, birthMode = 'emerge') {
    const rng = createRng(rngInput);
    const r = clamp(rng(), 0, 0.9999999);
    // Mode-weighted distribution across all 3 canonical archetypes
    let key;
    if (birthMode === 'emerge') {
      key = r < 0.45 ? 'true_believer' : r < 0.75 ? 'fair_weather' : 'transactional';
    } else if (birthMode === 'sever') {
      key = r < 0.40 ? 'true_believer' : r < 0.70 ? 'fair_weather' : 'transactional';
    } else {
      key = r < 0.34 ? 'true_believer' : r < 0.68 ? 'fair_weather' : 'transactional';
    }
    const base = TEMPERAMENTS[key];
    return {
      id: base.id,
      label: base.label,
      summary: base.summary,
      modifiers: { ...base.modifiers },
    };
  }

  // ============================================================================
  // Ideology Slider Placement & Complete Profile Builder
  // ============================================================================
  function computeChildSliders(birthMode, parentFaction, partyDefaults, primaryIssueId, siblingIndex, rng) {
    const base = parentFaction?.sliders
      || partyDefaults
      || { social: 5.0, economic: 5.0, governance: 5.0 };

    if (birthMode === 'emerge') {
      const issueMeta = resolveIssueMeta(primaryIssueId);
      const midOrParty = partyDefaults || { social: 5.0, economic: 5.0, governance: 5.0 };
      const jitter = () => (rng() - 0.5) * 2.4;
      let social = Number(midOrParty.social ?? 5.0) + jitter();
      let economic = Number(midOrParty.economic ?? 5.0) + jitter();
      let governance = Number(midOrParty.governance ?? 5.0) + (rng() * 2.2 - 0.4); // new movements skew slightly higher anti-est/populist
      if (issueMeta.axis === 'social') social += (rng() < 0.5 ? -0.8 : 0.8);
      if (issueMeta.axis === 'economic') economic += (rng() < 0.5 ? -0.8 : 0.8);
      return {
        social: round1(clamp(social, 1.0, 10.0)),
        economic: round1(clamp(economic, 1.0, 10.0)),
        governance: round1(clamp(governance, 1.0, 10.0)),
      };
    }

    if (birthMode === 'split') {
      const dir = siblingIndex === 1 ? 1 : -1;
      const dSocial = dir * (0.6 + rng() * 0.7);
      const dEcon = dir * (0.6 + rng() * 0.7);
      const dGov = -dir * (0.4 + rng() * 0.8);
      return {
        social: round1(clamp(Number(base.social ?? 5.0) + dSocial, 1.0, 10.0)),
        economic: round1(clamp(Number(base.economic ?? 5.0) + dEcon, 1.0, 10.0)),
        governance: round1(clamp(Number(base.governance ?? 5.0) + dGov, 1.0, 10.0)),
      };
    }

    // 'sever': near parent/party sliders with a clear breakaway shift vector
    const signA = rng() < 0.5 ? -1 : 1;
    const signB = rng() < 0.5 ? -1 : 1;
    return {
      social: round1(clamp(Number(base.social ?? 5.0) + signA * (0.8 + rng() * 1.0), 1.0, 10.0)),
      economic: round1(clamp(Number(base.economic ?? 5.0) + signB * (0.8 + rng() * 1.0), 1.0, 10.0)),
      governance: round1(clamp(Number(base.governance ?? 5.0) + (0.7 + rng() * 1.1), 1.0, 10.0)),
    };
  }

  function buildProceduralId(partyId, name, game, rng) {
    const prefixMap = { people: 'dem', heritage: 'gop', liberty: 'lib', green: 'grn', constitution: 'con', socialist: 'soc', independent: 'swg' };
    const pfx = prefixMap[partyId] || 'dyn';
    const slug = String(name || 'faction')
      .toLowerCase()
      .replace(/^the\s+/, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 32);
    const existingIds = new Set((game?.factions || []).map((f) => f?.id).filter(Boolean));
    let id = `${pfx}_${slug}`;
    if (!existingIds.has(id)) return id;
    const suffix = Math.floor(rng() * 9000 + 1000);
    id = `${pfx}_${slug}_${suffix}`;
    return id;
  }

  function buildRedLineSlugs(keyIssues) {
    return (keyIssues || []).slice(0, 2).map((k) => {
      const meta = resolveIssueMeta(k);
      return `${meta.id}-betrayal`;
    });
  }

  function buildFlavorNarrative(birthMode, name, parentFaction, keyIssues, temperamentObj) {
    const primaryLabel = resolveIssueMeta(keyIssues?.[0]).label;
    const secondaryLabel = resolveIssueMeta(keyIssues?.[1]).label;
    const parentName = parentFaction?.name || 'the broader party coalition';

    if (birthMode === 'split') {
      return `${name} emerged from the breakup of ${parentName}, carrying forward its core commitment to ${primaryLabel} alongside a renewed push on ${secondaryLabel}. As a ${temperamentObj.label} wing, ${temperamentObj.summary.charAt(0).toLowerCase()}${temperamentObj.summary.slice(1)}`;
    }
    if (birthMode === 'sever') {
      return `${name} broke away from ${parentName} to forge a distinct ideological identity around ${primaryLabel} and ${secondaryLabel}. Operating with a ${temperamentObj.label} temperament, ${temperamentObj.summary.charAt(0).toLowerCase()}${temperamentObj.summary.slice(1)}`;
    }
    return `${name} surged into national politics around ${primaryLabel} and ${secondaryLabel}, mobilizing a fresh bloc of voters with a ${temperamentObj.label} temperament.`;
  }

  /**
   * Build a complete procedural faction profile.
   * Strictly rejects racial/identity/religious generation or splitting.
   */
  function buildProceduralFactionProfile(params = {}) {
    const birthMode = params.birthMode || 'emerge';
    const requestedType = params.type || params.factionType || 'ideological';
    if (['racial', 'identity', 'religious'].includes(requestedType)) {
      throw new Error(`ProceduralFactionNaming: '${requestedType}' blocs cannot be procedurally generated.`);
    }

    const parentFaction = params.parentFaction || null;
    if ((birthMode === 'sever' || birthMode === 'split') && parentFaction && ['racial', 'identity', 'religious'].includes(parentFaction.type)) {
      throw new Error(`ProceduralFactionNaming: protected '${parentFaction.type}' parent '${parentFaction.id}' cannot undergo ${birthMode}.`);
    }

    const rng = createRng(params.rng ?? params.seed ?? params.game?.seed);
    const game = params.game || null;
    const partyId = params.partyId || parentFaction?.partyId || 'independent';
    const siblingIndex = Number(params.siblingIndex || 0);

    // Issue inheritance (allow caller to pass preselectedIssues for split pairs)
    let keyIssues;
    let primaryIssueId;
    if (Array.isArray(params.preselectedIssues) && params.preselectedIssues.length >= 2) {
      keyIssues = params.preselectedIssues.slice(0, 2);
      primaryIssueId = params.primaryIssueId || keyIssues[0];
    } else {
      const sel = selectChildIssues(birthMode, parentFaction, params.activeIssues, rng);
      if (birthMode === 'split') {
        const chosen = siblingIndex === 1 ? sel.childB : sel.childA;
        keyIssues = chosen.keyIssues;
        primaryIssueId = chosen.primaryIssueId;
      } else {
        keyIssues = sel.keyIssues;
        primaryIssueId = sel.primaryIssueId;
      }
    }

    const name = generateUniqueFactionName({
      birthMode,
      primaryIssue: primaryIssueId,
      parentFaction,
      partyId,
      game,
      usedSet: params.usedSet,
      rng,
    });

    const id = params.id || buildProceduralId(partyId, name, game, rng);
    const sliders = params.sliders || computeChildSliders(birthMode, parentFaction, params.partyDefaults, primaryIssueId, siblingIndex, rng);
    const temperamentObj = params.temperamentOverride
      ? (TEMPERAMENTS[params.temperamentOverride] || rollFactionTemperament(rng, birthMode))
      : rollFactionTemperament(rng, birthMode);

    let targetVoters = Number(params.targetVoters);
    if (!Number.isFinite(targetVoters) || targetVoters <= 0) {
      if (birthMode === 'emerge') {
        targetVoters = Math.round(350_000 + rng() * 500_000); // 350,000 - 850,000 (< 1,000,000)
      } else if (birthMode === 'sever') {
        const pVoters = Number(parentFaction?.targetVoters || 3_000_000);
        targetVoters = Math.round(pVoters * (0.20 + rng() * 0.15));
      } else {
        const pVoters = Number(parentFaction?.targetVoters || 4_500_000);
        targetVoters = Math.round(pVoters * (0.45 + rng() * 0.10));
      }
    }

    const baseHap = clamp(Math.round(Number(params.startingHappiness ?? (birthMode === 'emerge' ? 68 : (parentFaction?.happiness ?? 55)))), 30, 85);
    const viralRunwayCyclesLeft = birthMode === 'emerge' ? 4 : 0;
    const vanguardCyclesLeft = birthMode === 'emerge' ? 3 : 0;

    return {
      id,
      name,
      partyId,
      type: 'ideological',
      status: targetVoters >= 5_000_000 ? 'major' : 'minor',
      targetVoters,
      sliders,
      keyIssues,
      primaryIssueId,
      redLineIssues: buildRedLineSlugs(keyIssues),
      temperament: temperamentObj.id,
      temperamentDetails: temperamentObj,
      flavor: buildFlavorNarrative(birthMode, name, parentFaction, keyIssues, temperamentObj),
      birthMode,
      parentFactionId: birthMode === 'emerge' ? null : (parentFaction?.id || null),
      startingHappiness: baseHap,
      happiness: baseHap,
      frictionIndex: birthMode === 'emerge' ? 5 : 15,
      cohesion: round1(clamp(Number(parentFaction?.cohesion ?? 0.65) + (birthMode === 'emerge' ? 0.1 : 0.05), 0.35, 0.9)),
      viralRunwayCyclesLeft,
      vanguardCyclesLeft,
      caucusId: null,
      isExtremist: Boolean(params.isExtremist),
      anchorPoliticianId: params.anchorPoliticianId || null,
      createdYear: Number(game?.year || params.year || 2028),
    };
  }

  /**
   * Convenience builder producing both symmetrical sibling children for a 'split' event.
   */
  function buildSplitFactionPair(params = {}) {
    const parentFaction = params.parentFaction;
    if (!parentFaction) {
      throw new Error('ProceduralFactionNaming.buildSplitFactionPair requires parentFaction.');
    }
    if (['racial', 'identity', 'religious'].includes(parentFaction.type)) {
      throw new Error(`ProceduralFactionNaming: protected '${parentFaction.type}' parent '${parentFaction.id}' cannot split.`);
    }
    const rng = createRng(params.rng ?? params.seed ?? params.game?.seed);
    const sel = selectChildIssues('split', parentFaction, params.activeIssues, rng);
    const parentVoters = Number(params.totalVoters ?? parentFaction.targetVoters ?? 4_500_000);
    const shareA = 0.45 + rng() * 0.10; // 45% - 55%
    const votersA = Math.round(parentVoters * shareA);
    const votersB = Math.max(100_000, parentVoters - votersA);

    const childA = buildProceduralFactionProfile({
      ...params,
      birthMode: 'split',
      siblingIndex: 0,
      preselectedIssues: sel.childA.keyIssues,
      primaryIssueId: sel.childA.primaryIssueId,
      targetVoters: votersA,
      rng,
    });
    const childB = buildProceduralFactionProfile({
      ...params,
      birthMode: 'split',
      siblingIndex: 1,
      preselectedIssues: sel.childB.keyIssues,
      primaryIssueId: sel.childB.primaryIssueId,
      targetVoters: votersB,
      rng,
    });
    return [childA, childB];
  }

  const ProceduralFactionNaming = {
    PRIMARY_ISSUE_ROOTS,
    ISSUE_ROOTS_BY_ID,
    IDEOLOGICAL_MODIFIERS,
    PARENT_HERITAGE_ROOTS,
    PARENT_HERITAGE_MAP,
    ARCHETYPE_TONE_DESCRIPTORS,
    CORE_NOUNS,
    MOVEMENT_SUFFIXES,
    TEMPERAMENTS,
    FORBIDDEN_GEOGRAPHIC_PATTERNS,
    containsGeographicTerm,
    getCombinatorialStats,
    generateUniqueFactionName,
    selectChildIssues,
    rollFactionTemperament,
    buildProceduralFactionProfile,
    buildSplitFactionPair,
    resolveIssueMeta,
  };

  if (typeof window !== 'undefined') window.ProceduralFactionNaming = ProceduralFactionNaming;
  if (typeof root !== 'undefined' && root) root.ProceduralFactionNaming = ProceduralFactionNaming;
  if (typeof module !== 'undefined' && module.exports) module.exports = ProceduralFactionNaming;
})(typeof globalThis !== 'undefined' ? globalThis : this);
