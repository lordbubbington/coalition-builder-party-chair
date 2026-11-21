const PARTY_ARCHETYPES = [
  { id: 'people', name: 'Democratic Party', color: '#3478c7', baseShare: 48, economic: -0.35, social: -0.35, climate: 0.1, local: 0.2, isMajor: true, lastPresidentialShare: 48.3, startingBudget: 150, appeal: 'Broad Center-Left Coalition', description: 'A broad center-left party spanning labor, progressive, faith-community, and suburban moderate wings.' },
  { id: 'heritage', name: 'Republican Party', color: '#d94b4b', baseShare: 48, economic: 0.4, social: 0.4, climate: -0.35, local: 0.35, isMajor: true, lastPresidentialShare: 49.8, startingBudget: 150, appeal: 'Broad Conservative Coalition', description: 'A broad conservative party spanning nationalist populist, traditional faith, free-market, and Western liberty wings.' },
  { id: 'liberty', name: 'Libertarian Party', color: '#e2bd45', baseShare: 1.8, economic: 0.65, social: -0.5, climate: -0.05, local: -0.6, isMajor: false, lastPresidentialShare: 1.1, startingBudget: 10, counterRivalId: 'green', appeal: 'Civil Liberties & Free Markets', description: 'A small-government party emphasizing individual liberty, deregulation, and free markets.' },
  { id: 'green', name: 'Green Party', color: '#55bf78', baseShare: 1.8, economic: -0.3, social: -0.65, climate: 0.8, local: -0.15, isMajor: false, lastPresidentialShare: 0.8, startingBudget: 10, counterRivalId: 'liberty', appeal: 'Eco-Socialist & Grassroots Peace', description: 'A grassroots progressive party centered on urgent climate action, public investment, and social justice.' },
  { id: 'constitution', name: 'Constitution Party', color: '#a84214', baseShare: 0.2, economic: 0.55, social: 0.85, climate: -0.65, local: 0.7, isMajor: false, lastPresidentialShare: 0.18, startingBudget: 10, counterRivalId: 'socialist', appeal: 'MAGA / Faith & Flag Constitutionalism', description: 'A nationalist-traditionalist third party championing Faith & Flag social conservatism, strict border sovereignty, and originalist constitutionalism.' },
  { id: 'socialist', name: 'Peace and Freedom Party', color: '#d62828', baseShare: 0.2, economic: -0.9, social: -0.65, climate: 0.75, local: -0.25, isMajor: false, lastPresidentialShare: 0.18, startingBudget: 10, counterRivalId: 'constitution', appeal: 'Labor / Progressive Anti-Corporate Populism', description: 'A democratic-socialist workers party advocating union ownership, guaranteed public healthcare, wealth redistribution, and aggressive climate action.' },
];

// Party-Specific Ideological & Rhetorical Factions (5 Democratic, 5 Republican, plus minor-party wings)
const PARTY_FACTIONS = {
  people: [
    {
      id: 'progressive-activists',
      legacyId: 'reformers',
      partyId: 'people',
      name: 'Progressive Activists',
      shortName: 'Progressive',
      icon: '◎',
      pull: { economic: -0.82, social: -0.78, climate: 0.85, local: -0.25 },
      description: 'Movement organizers, climate advocates, and small-dollar activists demanding transformative policy and bold structural reform.',
      blurb: 'Movement organizers demanding bold climate action, universal healthcare, and unapologetic economic reform.',
      rhetoricalStyle: 'Movement Mobilization — moral urgency, structural critique, and high-contrast grassroots inspiration.',
      rhetoricalQuote: '“Cautious half-measures leave our base at home—give working families something bold enough to fight for.”',
      suburbanAppeal: -0.15,
      turnoutWeight: 1.25,
      allies: ['labor-industrial-populists', 'community-faith-pillar'],
    },
    {
      id: 'establishment-liberals',
      legacyId: 'pragmatists',
      partyId: 'people',
      name: 'Establishment Liberals',
      shortName: 'Establishment',
      icon: '🏛',
      pull: { economic: -0.35, social: -0.45, climate: 0.35, local: -0.15 },
      description: 'Institutional coalition builders, metro mayors, and committee veterans who prize governing competence and legislative durability.',
      blurb: 'Coalition pragmatists prioritizing steady governance, institutional defense, and disciplined national messaging.',
      rhetoricalStyle: 'Institutional Stewardship — steady competence, rule-of-law credibility, and broad coalition reassurance.',
      rhetoricalQuote: '“Majorities last when voters trust our competence, respect institutions, and see steady hands at the wheel.”',
      suburbanAppeal: 0.2,
      turnoutWeight: 1.0,
      allies: ['frontier-suburban-moderates', 'community-faith-pillar'],
    },
    {
      id: 'labor-industrial-populists',
      legacyId: 'workers',
      partyId: 'people',
      name: 'Labor & Industrial Populists',
      shortName: 'Labor Populist',
      icon: '⚒',
      pull: { economic: -0.72, social: 0.08, climate: -0.12, local: 0.22 },
      description: 'Trade-union halls, manufacturing-corridor workers, and economic populists focused on tariffs, industrial jobs, and collective bargaining.',
      blurb: 'Union halls and Rust Belt workers demanding domestic manufacturing, fair trade, and strong paychecks.',
      rhetoricalStyle: 'Kitchen-Table Populism — plain-spoken dignity of labor centered on wages, pensions, and American factories.',
      rhetoricalQuote: '“Before we talk abstractions, ask one question: does this build good union jobs right here at home?”',
      suburbanAppeal: 0.0,
      turnoutWeight: 1.15,
      allies: ['progressive-activists', 'frontier-suburban-moderates'],
    },
    {
      id: 'community-faith-pillar',
      legacyId: 'organizers',
      partyId: 'people',
      name: 'Community & Faith Pillar',
      shortName: 'Community & Faith',
      icon: '✳',
      pull: { economic: -0.48, social: 0.12, climate: 0.15, local: 0.35 },
      description: 'Civic congregations, civil-rights organizers, and Southern community networks that deliver rock-solid neighborhood turnout.',
      blurb: 'Neighborhood congregations and civil-rights networks anchoring dependable community turnout and ballot protection.',
      rhetoricalStyle: 'Moral Fellowship — dignity-of-community, voting-rights stewardship, and hopeful civic solidarity.',
      rhetoricalQuote: '“Long before November, our churches and civic captains are building trust block by block.”',
      suburbanAppeal: 0.05,
      turnoutWeight: 1.2,
      allies: ['establishment-liberals', 'progressive-activists'],
    },
    {
      id: 'frontier-suburban-moderates',
      legacyId: 'localists',
      partyId: 'people',
      name: 'Frontier & Suburban Moderates',
      shortName: 'Suburban Moderate',
      icon: '⌂',
      pull: { economic: 0.05, social: -0.12, climate: -0.05, local: 0.42 },
      description: 'Swing-district suburban problem-solvers and rural ticket-splitters prioritizing fiscal realism, school quality, and local voice.',
      blurb: 'Swing-state suburbanites and rural pragmatists winning undecided voters through balanced, locally rooted solutions.',
      rhetoricalStyle: 'Pragmatic Consensus — bipartisan tone, kitchen-table fiscal balance, and suburban affordability.',
      rhetoricalQuote: '“Win undecided suburban commuters and stay competitive in rural towns, and we hold the majority.”',
      suburbanAppeal: 0.42,
      turnoutWeight: 0.95,
      allies: ['establishment-liberals', 'labor-industrial-populists'],
    },
  ],
  heritage: [
    {
      id: 'nationalist-populists',
      legacyId: 'organizers',
      partyId: 'heritage',
      name: 'Nationalist Populists',
      shortName: 'Nationalist',
      icon: '⚑',
      pull: { economic: 0.08, social: 0.72, climate: -0.68, local: 0.35 },
      description: 'America-First organizers championing strict border enforcement, protective tariffs, energy dominance, and populist disruption.',
      blurb: 'America-First movement base driving high working-class turnout through border security and populist confrontation.',
      rhetoricalStyle: 'Populist Confrontation — combative outsider energy defending forgotten workers and national sovereignty.',
      rhetoricalQuote: '“Half-measures never won a realignment—put American workers, secure borders, and national sovereignty first.”',
      suburbanAppeal: -0.25,
      turnoutWeight: 1.3,
      allies: ['faith-flag-conservatives', 'liberty-western-mavericks'],
    },
    {
      id: 'faith-flag-conservatives',
      legacyId: 'workers',
      partyId: 'heritage',
      name: 'Faith & Flag Conservatives',
      shortName: 'Faith & Flag',
      icon: '✚',
      pull: { economic: 0.35, social: 0.85, climate: -0.45, local: 0.42 },
      description: 'Social conservatives, evangelical churches, and family-values advocates anchoring small-town and exurban turnout.',
      blurb: 'Traditional faith and family-values voters mobilizing high-commitment exurban and rural precincts.',
      rhetoricalStyle: 'Cultural Conviction — unapologetic defense of religious liberty, parental rights, and constitutional heritage.',
      rhetoricalQuote: '“A movement grounded in faith, family, and timeless constitutional convictions never apologizes.”',
      suburbanAppeal: -0.12,
      turnoutWeight: 1.22,
      allies: ['nationalist-populists', 'heartland-institutionalists'],
    },
    {
      id: 'market-country-club',
      legacyId: 'funders',
      partyId: 'heritage',
      name: 'Market & Country-Club Conservatives',
      shortName: 'Free-Market',
      icon: '✦',
      pull: { economic: 0.84, social: 0.08, climate: -0.22, local: 0.15 },
      description: 'Suburban executives, small-business owners, and major donors focused on lower taxes, deregulation, and economic expansion.',
      blurb: 'Pro-growth donors and suburban professionals demanding tax cuts, deregulation, and disciplined fiscal stewardship.',
      rhetoricalStyle: 'Free-Enterprise Optimism — business-friendly competence tailored to affluent suburbs and job creators.',
      rhetoricalQuote: '“Keep taxes low, cut red tape, and suburban voters will reward steady economic opportunity.”',
      suburbanAppeal: 0.38,
      turnoutWeight: 0.95,
      allies: ['heartland-institutionalists', 'liberty-western-mavericks'],
    },
    {
      id: 'liberty-western-mavericks',
      legacyId: 'reformers',
      partyId: 'heritage',
      name: 'Liberty & Western Mavericks',
      shortName: 'Western Liberty',
      icon: '⌘',
      pull: { economic: 0.68, social: -0.15, climate: -0.35, local: 0.65 },
      description: 'Mountain-West constitutional libertarians and fiscal hawks fiercely guarding individual liberty, gun rights, and state autonomy.',
      blurb: 'Independent-minded Westerners and constitutional hawks fighting federal spending and executive overreach.',
      rhetoricalStyle: 'Constitutional Independence — sharp skepticism of Washington bureaucracy, surveillance, and deficits.',
      rhetoricalQuote: '“Get Washington out of our wallets, off our ranches, and out of our constitutional liberties.”',
      suburbanAppeal: 0.1,
      turnoutWeight: 1.05,
      allies: ['nationalist-populists', 'market-country-club'],
    },
    {
      id: 'heartland-institutionalists',
      legacyId: 'pragmatists',
      partyId: 'heritage',
      name: 'Heartland Institutionalists',
      shortName: 'Heartland',
      icon: '⚖',
      pull: { economic: 0.45, social: 0.32, climate: -0.18, local: 0.38 },
      description: 'Midwestern and Plains governors, county commissioners, and civic traditionalists prized for practical statehouse results.',
      blurb: 'Farm-belt governors and local officials blending conservative principles with steady statehouse competence.',
      rhetoricalStyle: 'Main Street Stewardship — calm, results-driven leadership emphasizing public safety, budgets, and local roots.',
      rhetoricalQuote: '“Durable conservative majorities start in our statehouses and earn trust across every main street.”',
      suburbanAppeal: 0.28,
      turnoutWeight: 1.0,
      allies: ['faith-flag-conservatives', 'market-country-club'],
    },
  ],
  liberty: [
    {
      id: 'liberty-civil-hawks',
      partyId: 'liberty',
      name: 'Civil-Liberties Purists',
      shortName: 'Civil Liberties',
      icon: '◎',
      pull: { economic: 0.55, social: -0.75, climate: -0.05, local: -0.7 },
      description: 'Anti-surveillance, non-interventionist, and criminal-justice reformers demanding strict constitutional limits.',
      blurb: 'Constitutional purists fighting war powers, surveillance, and federal policing.',
      rhetoricalStyle: 'Principled Non-Intervention — fearless indictment of both major parties’ authoritarian compromises.',
      rhetoricalQuote: '“Your rights do not shrink in an emergency—not for one party, and not for the other.”',
      suburbanAppeal: 0.05,
      turnoutWeight: 1.15,
      allies: ['liberty-market-pragmatists'],
    },
    {
      id: 'liberty-market-pragmatists',
      partyId: 'liberty',
      name: 'Free-Market Pragmatists',
      shortName: 'Market Pragmatist',
      icon: '✦',
      pull: { economic: 0.85, social: -0.25, climate: -0.1, local: 0.35 },
      description: 'Classical-liberal economists and ballot-access builders courting disillusioned suburban moderates.',
      blurb: 'Classical liberals focusing on balanced budgets, free trade, and practical ballot-access growth.',
      rhetoricalStyle: 'Classical-Liberal Reason — calm, data-literate advocacy for fiscal restraint and personal freedom.',
      rhetoricalQuote: '“Fiscally sane, socially tolerant—the home for every voter tired of reckless spending.”',
      suburbanAppeal: 0.3,
      turnoutWeight: 1.0,
      allies: ['liberty-civil-hawks'],
    },
  ],
  green: [
    {
      id: 'green-ecosocialists',
      partyId: 'green',
      name: 'Eco-Socialist Vanguard',
      shortName: 'Eco-Socialist',
      icon: '✳',
      pull: { economic: -0.75, social: -0.7, climate: 0.92, local: -0.2 },
      description: 'Climate-justice activists demanding a binding Green New Deal, public utilities, and rapid fossil-fuel phaseouts.',
      blurb: 'Urgent climate organizers refusing corporate compromises on emissions and public goods.',
      rhetoricalStyle: 'Planetary Urgency — uncompromising climate mobilization linking environmental survival with economic justice.',
      rhetoricalQuote: '“There is no moderate speed on an overheating planet—transition now and guarantee green union jobs.”',
      suburbanAppeal: -0.1,
      turnoutWeight: 1.2,
      allies: ['green-municipalists'],
    },
    {
      id: 'green-municipalists',
      partyId: 'green',
      name: 'Grassroots Municipalists',
      shortName: 'Municipalist',
      icon: '⌘',
      pull: { economic: -0.4, social: -0.55, climate: 0.72, local: 0.35 },
      description: 'City-council and ranked-choice democracy advocates building local cooperative chapters from the ground up.',
      blurb: 'Local ranked-choice and clean-transit champions proving grassroots governance in city halls.',
      rhetoricalStyle: 'Community Democracy — empowering neighborhoods, co-ops, and proportional representation.',
      rhetoricalQuote: '“Real democracy begins in our neighborhoods, our transit lines, and ranked-choice ballots.”',
      suburbanAppeal: 0.15,
      turnoutWeight: 1.0,
      allies: ['green-ecosocialists'],
    },
  ],
  constitution: [
    {
      id: 'constitution-faith-flag',
      partyId: 'constitution',
      name: 'Faith & Flag Constitutionalists',
      shortName: 'Faith & Flag',
      icon: '✚',
      pull: { economic: 0.52, social: 0.92, climate: -0.68, local: 0.72 },
      description: 'Uncompromising cultural conservatives demanding strict constitutional originalism, border sovereignty, and Christian heritage defense.',
      blurb: 'Devout constitutionalists rallying disillusioned conservatives who think major-party leadership compromised.',
      rhetoricalStyle: 'Covenant & Constitution — bold moral and constitutional witness without establishment moderation.',
      rhetoricalQuote: '“When major parties trade conviction for comfort, we stand unmoved on faith, family, and the Constitution.”',
      suburbanAppeal: -0.3,
      turnoutWeight: 1.25,
      allies: ['constitution-sovereignty-populists'],
    },
    {
      id: 'constitution-sovereignty-populists',
      partyId: 'constitution',
      name: 'Sovereignty Populists',
      shortName: 'Sovereignty',
      icon: '⚑',
      pull: { economic: 0.25, social: 0.78, climate: -0.62, local: 0.65 },
      description: 'Anti-globalist, anti-mandate activists opposing foreign entanglements and federal regulatory agencies.',
      blurb: 'Decentralized patriots mobilizing hardline border and Tenth Amendment voters.',
      rhetoricalStyle: 'Tenth Amendment Resistance — fiery sovereignty rhetoric challenging federal agencies and global treaties.',
      rhetoricalQuote: '“Every power not granted in writing stays with the states and the people—period.”',
      suburbanAppeal: -0.2,
      turnoutWeight: 1.15,
      allies: ['constitution-faith-flag'],
    },
  ],
  socialist: [
    {
      id: 'socialist-rank-and-file',
      partyId: 'socialist',
      name: 'Rank-and-File Militants',
      shortName: 'Rank & File',
      icon: '⚒',
      pull: { economic: -0.95, social: -0.58, climate: 0.72, local: -0.15 },
      description: 'Shop-floor stewards, tenant-union organizers, and public-ownership advocates building working-class solidarity.',
      blurb: 'Workplace and tenant-union organizers mobilizing workers disillusioned with corporate politics.',
      rhetoricalStyle: 'Working-Class Solidarity — direct class contrast centered on rent control, strikes, and public ownership.',
      rhetoricalQuote: '“Billionaires run both establishment committees—only organized workers can win a society built for labor.”',
      suburbanAppeal: -0.3,
      turnoutWeight: 1.3,
      allies: ['socialist-ecosocial-planners'],
    },
    {
      id: 'socialist-ecosocial-planners',
      partyId: 'socialist',
      name: 'Public-Goods Planners',
      shortName: 'Public Planners',
      icon: '◎',
      pull: { economic: -0.82, social: -0.75, climate: 0.85, local: -0.35 },
      description: 'Universal-healthcare, debt-abolition, and green-public-investment strategists courting young urban voters.',
      blurb: 'Policy organizers pushing Medicare for All, tuition-free colleges, and clean public infrastructure.',
      rhetoricalStyle: 'Economic Rights Vision — hopeful universal-rights appeals guaranteeing healthcare, housing, and education.',
      rhetoricalQuote: '“Healthcare, housing, and a livable climate are human rights—not commodities for Wall Street.”',
      suburbanAppeal: -0.15,
      turnoutWeight: 1.15,
      allies: ['socialist-rank-and-file'],
    },
  ],
};

const ALL_PARTY_FACTIONS = Object.values(PARTY_FACTIONS).flat();
const FACTIONS = [...PARTY_FACTIONS.people, ...PARTY_FACTIONS.heritage];
Object.defineProperties(FACTIONS, {
  byParty: { value: PARTY_FACTIONS, enumerable: false },
  people: { value: PARTY_FACTIONS.people, enumerable: false },
  heritage: { value: PARTY_FACTIONS.heritage, enumerable: false },
  liberty: { value: PARTY_FACTIONS.liberty, enumerable: false },
  green: { value: PARTY_FACTIONS.green, enumerable: false },
  constitution: { value: PARTY_FACTIONS.constitution, enumerable: false },
  socialist: { value: PARTY_FACTIONS.socialist, enumerable: false },
  all: { value: ALL_PARTY_FACTIONS, enumerable: false },
});

function getFactionsForParty(partyOrId) {
  const id = typeof partyOrId === 'string'
    ? partyOrId
    : (partyOrId?.baseTemplateId || partyOrId?.id || 'people');
  return PARTY_FACTIONS[id] || PARTY_FACTIONS.people;
}

// 10-Stat Candidate & Politician Rating Schema (each scored 1–10)
const CANDIDATE_RATING_KEYS = [
  'persuadability',
  'turnout',
  'debate',
  'charisma',
  'corruption',
  'fundraising',
  'fieldcraft',
  'experience',
  'mediaSavvy',
  'regionalStrength',
];

const POSITIVE_RATING_KEYS = [
  'persuadability',
  'turnout',
  'debate',
  'charisma',
  'fundraising',
  'fieldcraft',
  'experience',
  'mediaSavvy',
  'regionalStrength',
];

const CANDIDATE_RATING_DEFINITIONS = [
  { id: 'persuadability', label: 'Persuadability', shortLabel: 'Persuade', positive: true, description: 'Ability to win over undecideds and cross-party voters.' },
  { id: 'turnout', label: 'Turnout', shortLabel: 'Turnout', positive: true, description: 'Base voter mobilization multiplier in the candidate’s state or district.' },
  { id: 'debate', label: 'Debate', shortLabel: 'Debate', positive: true, description: 'Performance under pressure in primary and general debates.' },
  { id: 'charisma', label: 'Charisma', shortLabel: 'Charisma', positive: true, description: 'Public presence, media draw, and keynote/surrogate effectiveness.' },
  { id: 'corruption', label: 'Corruption Risk', shortLabel: 'Corruption', positive: false, description: 'Scandal/ethics risk (1 = squeaky clean / Reformer favorite; 10 = high corruption risk).' },
  { id: 'fundraising', label: 'Fundraising', shortLabel: 'Fundraising', positive: true, description: 'Donor network appeal and self-financing strength.' },
  { id: 'fieldcraft', label: 'Fieldcraft', shortLabel: 'Fieldcraft', positive: true, description: 'Ground-game organization and chapter synergy.' },
  { id: 'experience', label: 'Experience', shortLabel: 'Experience', positive: true, description: 'Legislative/executive governing seasoning and caucus respect.' },
  { id: 'mediaSavvy', label: 'Media Savvy', shortLabel: 'Media', positive: true, description: 'Earned media discipline and message control.' },
  { id: 'regionalStrength', label: 'Regional Strength', shortLabel: 'Regional', positive: true, description: 'Home-region affinity bonus across overlapping political regions.' },
];

function computeCandidateQuality(ratings) {
  if (!ratings || typeof ratings !== 'object') return 5;
  const values = POSITIVE_RATING_KEYS.map((key) => Number(ratings[key]) || 5);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.max(1, Math.min(10, Math.round(avg)));
}

// Expanded & Overlapping Political Regions (8 Cultural/Political Regions)
const OVERLAPPING_REGION_DEFINITIONS = [
  {
    id: 'Prairie States',
    name: 'Prairie States',
    macroRegion: 'Midwest',
    states: ['ND', 'SD', 'NE', 'KS', 'OK', 'IA', 'MN', 'MT', 'WY'],
    pull: { economic: 0.14, social: 0.12, climate: -0.12, local: 0.28 },
    description: 'Agricultural plains and farm-belt states where rural organization and local stewardship matter.',
  },
  {
    id: 'Pacific Northwest',
    name: 'Pacific Northwest',
    macroRegion: 'West',
    states: ['WA', 'OR', 'ID', 'AK'],
    pull: { economic: -0.12, social: -0.22, climate: 0.38, local: 0.08 },
    description: 'Coastal timber, tech, and frontier states spanning the Columbia Basin to Alaska.',
  },
  {
    id: 'Deep South',
    name: 'Deep South',
    macroRegion: 'South',
    states: ['AL', 'MS', 'GA', 'SC', 'LA', 'AR', 'FL', 'TX'],
    pull: { economic: 0.28, social: 0.24, climate: -0.26, local: 0.32 },
    description: 'Sun Belt and Gulf states anchored by church networks, rapid metro growth, and high base turnout.',
  },
  {
    id: 'Appalachia',
    name: 'Appalachia',
    macroRegion: 'South',
    states: ['WV', 'KY', 'TN', 'VA', 'NC', 'OH', 'PA'],
    pull: { economic: 0.06, social: 0.22, climate: -0.24, local: 0.34 },
    description: 'Mountain and foothill communities prizing energy jobs, local roots, and populist appeal.',
  },
  {
    id: 'New England',
    name: 'New England',
    macroRegion: 'Northeast',
    states: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT'],
    pull: { economic: -0.18, social: -0.28, climate: 0.32, local: 0.12 },
    description: 'Town-meeting states with independent-minded voters and strong civic institutions.',
  },
  {
    id: 'Rust Belt',
    name: 'Rust Belt',
    macroRegion: 'Midwest',
    states: ['PA', 'OH', 'MI', 'WI', 'IN', 'IL', 'NY', 'WV'],
    pull: { economic: -0.14, social: 0.02, climate: -0.04, local: 0.22 },
    description: 'Industrial and manufacturing corridors where union halls and working-class persuasion decide elections.',
  },
  {
    id: 'Great Lakes States',
    name: 'Great Lakes States',
    macroRegion: 'Midwest',
    states: ['MI', 'WI', 'MN', 'IL', 'IN', 'OH', 'PA', 'NY'],
    pull: { economic: -0.08, social: -0.06, climate: 0.12, local: 0.18 },
    description: 'Freshwater basin states blending major metros, swing suburbs, and industrial towns.',
  },
  {
    id: 'The Rockies',
    name: 'The Rockies',
    macroRegion: 'West',
    states: ['CO', 'UT', 'ID', 'MT', 'WY', 'NV', 'NM', 'AZ'],
    pull: { economic: 0.16, social: -0.04, climate: 0.06, local: 0.24 },
    description: 'Mountain West and desert swing states with fast-growing suburbs and independent streaks.',
  },
];

const OVERLAPPING_REGIONS = Object.fromEntries(
  OVERLAPPING_REGION_DEFINITIONS.map((def) => {
    const arr = [...def.states];
    Object.defineProperties(arr, {
      id: { value: def.id, enumerable: false },
      name: { value: def.name, enumerable: false },
      label: { value: def.name, enumerable: false },
      macroRegion: { value: def.macroRegion, enumerable: false },
      states: { value: arr, enumerable: false },
      pull: { value: def.pull, enumerable: false },
      description: { value: def.description, enumerable: false },
    });
    return [def.id, arr];
  })
);

const OVERLAPPING_REGION_NAMES = OVERLAPPING_REGION_DEFINITIONS.map((def) => def.id);

function getStateOverlappingRegions(stateId, fallbackMacroRegion = null) {
  const matched = OVERLAPPING_REGION_DEFINITIONS
    .filter((def) => def.states.includes(stateId))
    .map((def) => def.id);
  if (matched.length > 0) return matched;
  return fallbackMacroRegion ? [fallbackMacroRegion] : [];
}

function stateMatchesRegion(stateOrId, regionName) {
  if (!stateOrId || !regionName) return false;
  const stateId = typeof stateOrId === 'string' ? stateOrId : (stateOrId.stateId || stateOrId.id);
  if (OVERLAPPING_REGIONS[regionName]?.includes(stateId)) return true;
  if (typeof stateOrId === 'object') {
    if (Array.isArray(stateOrId.regions) && stateOrId.regions.includes(regionName)) return true;
    if (stateOrId.region === regionName) return true;
  }
  return false;
}

// Pixel-art portraits from candidate-art-clean-v3 set.
// Expanded with 10-stat ratings, composite quality (1–10), fame (1–100), overlapping regions, and party-specific factions.
const MEMBERS = [
  {
    id: 'ossoff', name: 'Jon Ossoff', title: 'Field Organizer', party: 'people', factionId: 'dem_liberal_establishment', faction: 'establishment-liberals', legacyFaction: 'organizers',
    traits: ['Rising Star', 'Polished'],
    skill: 5, quality: 8, fame: 91, happiness: 82, cost: 7, salary: 1.1,
    stateId: 'GA', region: 'South', regions: ['Deep South'], portrait: 'ossoff.png',
    ratings: { persuadability: 8, turnout: 9, debate: 8, charisma: 9, corruption: 2, fundraising: 9, fieldcraft: 8, experience: 7, mediaSavvy: 9, regionalStrength: 8 },
    effect: 'Tours add chapters and turnout in the South.',
  },
  {
    id: 'whitmer', name: 'Gretchen Whitmer', title: 'Practical Governor', party: 'people', factionId: 'dem_neo_liberals', faction: 'frontier-suburban-moderates', legacyFaction: 'pragmatists',
    traits: ['Polished', 'Disciplined', 'Rising Star'],
    skill: 5, quality: 8, fame: 84, happiness: 78, cost: 10, salary: 1.5,
    stateId: 'MI', region: 'Midwest', regions: ['Rust Belt', 'Great Lakes States'], portrait: 'whitmer.png',
    ratings: { persuadability: 9, turnout: 8, debate: 8, charisma: 8, corruption: 2, fundraising: 8, fieldcraft: 8, experience: 9, mediaSavvy: 8, regionalStrength: 9 },
    effect: 'A practical pitch steadies swing-state support.',
  },
  {
    id: 'booker', name: 'Cory Booker', title: 'Coalition Builder', party: 'people', factionId: 'dem_faith_based_liberals', faction: 'community-faith-pillar', legacyFaction: 'workers',
    traits: ['Established politician', 'Polished'],
    skill: 4, quality: 8, fame: 79, happiness: 76, cost: 8, salary: 1.2,
    stateId: 'NJ', region: 'Northeast', regions: ['Northeast'], portrait: 'booker.png',
    ratings: { persuadability: 7, turnout: 8, debate: 8, charisma: 9, corruption: 2, fundraising: 8, fieldcraft: 7, experience: 8, mediaSavvy: 8, regionalStrength: 7 },
    effect: 'Builds trust with workers and community groups.',
  },
  {
    id: 'aoc', name: 'Alexandria Ocasio-Cortez', title: 'Movement Whip', party: 'people', factionId: 'dem_capital_l_left', faction: 'progressive-activists', legacyFaction: 'reformers',
    traits: ['Rising Star', 'Rough'],
    skill: 5, quality: 8, fame: 89, happiness: 72, cost: 11, salary: 1.7,
    stateId: 'NY', region: 'Northeast', regions: ['Rust Belt', 'Great Lakes States'], portrait: 'aoc.png',
    ratings: { persuadability: 6, turnout: 10, debate: 8, charisma: 10, corruption: 1, fundraising: 10, fieldcraft: 8, experience: 7, mediaSavvy: 10, regionalStrength: 7 },
    effect: 'Raises volunteer energy and progressive confidence.',
  },
  {
    id: 'beshear', name: 'Andy Beshear', title: 'State Party Broker', party: 'people', factionId: 'dem_blue_dog', faction: 'frontier-suburban-moderates', legacyFaction: 'localists',
    traits: ['Rising Star', 'Squeaky Clean', 'Polished'],
    skill: 4, quality: 8, fame: 76, happiness: 80, cost: 7, salary: 1.1,
    stateId: 'KY', region: 'South', regions: ['Appalachia'], portrait: 'beshear.png',
    ratings: { persuadability: 9, turnout: 7, debate: 7, charisma: 8, corruption: 1, fundraising: 7, fieldcraft: 8, experience: 8, mediaSavvy: 8, regionalStrength: 9 },
    effect: 'Connects the national party to state leaders.',
  },
  {
    id: 'klobuchar', name: 'Amy Klobuchar', title: 'Rural Vote Director', party: 'people', factionId: 'dem_liberal_establishment', faction: 'labor-industrial-populists', legacyFaction: 'pragmatists',
    traits: ['Established politician', 'Disciplined'],
    skill: 4, quality: 8, fame: 78, happiness: 79, cost: 7, salary: 1.0,
    stateId: 'MN', region: 'Midwest', regions: ['Prairie States', 'Great Lakes States'], portrait: 'klobuchar.png',
    ratings: { persuadability: 9, turnout: 8, debate: 8, charisma: 7, corruption: 2, fundraising: 8, fieldcraft: 8, experience: 9, mediaSavvy: 8, regionalStrength: 9 },
    effect: 'Improves the party’s rural and suburban reach.',
  },
  {
    id: 'vance', name: 'J. D. Vance', title: 'County Organizer', party: 'heritage', factionId: 'gop_maga', faction: 'nationalist-populists', legacyFaction: 'organizers',
    traits: ['Rising Star', 'Rough'],
    skill: 5, quality: 8, fame: 94, happiness: 84, cost: 9, salary: 1.4,
    stateId: 'OH', region: 'Midwest', regions: ['Appalachia', 'Rust Belt', 'Great Lakes States'], portrait: 'vance.png',
    ratings: { persuadability: 7, turnout: 9, debate: 9, charisma: 8, corruption: 3, fundraising: 8, fieldcraft: 8, experience: 7, mediaSavvy: 9, regionalStrength: 9 },
    effect: 'Builds a durable county-level field operation.',
  },
  {
    id: 'haley', name: 'Nikki Haley', title: 'Business Coalition Lead', party: 'heritage', factionId: 'gop_neo_cons', faction: 'market-country-club', legacyFaction: 'pragmatists',
    traits: ['Established politician', 'Polished'],
    skill: 5, quality: 8, fame: 84, happiness: 70, cost: 11, salary: 1.7,
    stateId: 'SC', region: 'South', regions: ['Deep South'], portrait: 'haley.png',
    ratings: { persuadability: 9, turnout: 7, debate: 8, charisma: 8, corruption: 2, fundraising: 9, fieldcraft: 7, experience: 9, mediaSavvy: 8, regionalStrength: 8 },
    effect: 'Makes the party more credible with persuadable voters.',
  },
  {
    id: 'rubio', name: 'Marco Rubio', title: 'Community Outreach Lead', party: 'heritage', factionId: 'gop_faith_and_flag', faction: 'faith-flag-conservatives', legacyFaction: 'workers',
    traits: ['Established politician', 'Polished'],
    skill: 4, quality: 8, fame: 83, happiness: 77, cost: 8, salary: 1.2,
    stateId: 'FL', region: 'South', regions: ['Deep South'], portrait: 'rubio.png',
    ratings: { persuadability: 8, turnout: 8, debate: 8, charisma: 8, corruption: 3, fundraising: 8, fieldcraft: 7, experience: 9, mediaSavvy: 8, regionalStrength: 8 },
    effect: 'Builds relationships with working and faith communities.',
  },
  {
    id: 'youngkin', name: 'Glenn Youngkin', title: 'Local Leaders Liaison', party: 'heritage', factionId: 'gop_suburban_moderates', faction: 'heartland-institutionalists', legacyFaction: 'localists',
    traits: ['Polished', 'Disciplined'],
    skill: 4, quality: 8, fame: 73, happiness: 76, cost: 8, salary: 1.2,
    stateId: 'VA', region: 'South', regions: ['Appalachia'], portrait: 'youngkin.png',
    ratings: { persuadability: 8, turnout: 7, debate: 7, charisma: 8, corruption: 2, fundraising: 9, fieldcraft: 7, experience: 7, mediaSavvy: 8, regionalStrength: 8 },
    effect: 'Strengthens state and county party leadership.',
  },
  {
    id: 'cohen', name: 'Spike Cohen', title: 'Civil Liberties Organizer', party: 'liberty', factionId: 'lib_true_libertarians', faction: 'liberty-civil-hawks', legacyFaction: 'reformers',
    traits: ['Polished', 'Rising Star'],
    skill: 5, quality: 7, fame: 44, happiness: 75, cost: 8, salary: 1.1,
    stateId: 'SC', region: 'South', regions: ['Deep South'], portrait: '',
    ratings: { persuadability: 7, turnout: 7, debate: 8, charisma: 8, corruption: 1, fundraising: 6, fieldcraft: 7, experience: 5, mediaSavvy: 8, regionalStrength: 6 },
    effect: 'Makes liberty issues visible and builds a volunteer base.',
  },
  {
    id: 'termaat', name: 'Mike ter Maat', title: 'Small-Donor Director', party: 'liberty', factionId: 'lib_true_libertarians', faction: 'liberty-market-pragmatists', legacyFaction: 'workers',
    traits: ['Disciplined'],
    skill: 4, quality: 6, fame: 34, happiness: 75, cost: 6, salary: 0.9,
    stateId: 'FL', region: 'South', regions: ['Deep South'], portrait: 'termaat.png',
    ratings: { persuadability: 7, turnout: 6, debate: 7, charisma: 6, corruption: 2, fundraising: 7, fieldcraft: 6, experience: 6, mediaSavvy: 6, regionalStrength: 6 },
    effect: 'Expands small-dollar fundraising and local outreach.',
  },
  {
    id: 'oliver', name: 'Chase Oliver', title: 'Pragmatic Libertarian', party: 'liberty', factionId: 'lib_ancaps', faction: 'liberty-market-pragmatists', legacyFaction: 'pragmatists',
    traits: ['Rising Star', 'Polished'],
    skill: 4, quality: 7, fame: 48, happiness: 76, cost: 7, salary: 1.0,
    stateId: 'GA', region: 'South', regions: ['Deep South'], portrait: 'oliver.png',
    ratings: { persuadability: 8, turnout: 7, debate: 8, charisma: 7, corruption: 1, fundraising: 6, fieldcraft: 7, experience: 6, mediaSavvy: 7, regionalStrength: 7 },
    effect: 'Explains civil liberties in terms that travel.',
  },
  {
    id: 'stein', name: 'Jill Stein', title: 'Climate Organizer', party: 'green', factionId: 'grn_eco_socialist_vanguard', faction: 'green-ecosocialists', legacyFaction: 'organizers',
    traits: ['Established politician', 'Rough'],
    skill: 5, quality: 7, fame: 64, happiness: 74, cost: 8, salary: 1.1,
    stateId: 'MA', region: 'Northeast', regions: ['New England'], portrait: 'stein.png',
    ratings: { persuadability: 6, turnout: 8, debate: 8, charisma: 7, corruption: 2, fundraising: 7, fieldcraft: 7, experience: 7, mediaSavvy: 8, regionalStrength: 7 },
    effect: 'Builds climate chapters and volunteer turnout.',
  },
  {
    id: 'ware', name: 'Butch Ware', title: 'Green Movement Organizer', party: 'green', factionId: 'grn_eco_socialist_vanguard', faction: 'green-ecosocialists', legacyFaction: 'organizers',
    traits: ['Rough', 'Undisciplined'],
    skill: 5, quality: 7, fame: 44, happiness: 74, cost: 8, salary: 1.1,
    stateId: 'CA', region: 'West', regions: ['West Coast'], portrait: 'ware.png',
    ratings: { persuadability: 6, turnout: 8, debate: 8, charisma: 8, corruption: 1, fundraising: 5, fieldcraft: 7, experience: 5, mediaSavvy: 7, regionalStrength: 6 },
    effect: 'Mobilizes anti-war and grassroots climate activists across California and urban centers.',
  },
  {
    id: 'baraka', name: 'Ajamu Baraka', title: 'Eco-Socialist & Human Rights Organizer', party: 'green', factionId: 'grn_eco_socialist_vanguard', faction: 'green-ecosocialists', legacyFaction: 'organizers',
    traits: ['Rough'],
    skill: 4, quality: 6, fame: 38, happiness: 72, cost: 7, salary: 1.0,
    stateId: 'NJ', region: 'Northeast', regions: ['Northeast'], portrait: 'baraka.png',
    ratings: { persuadability: 6, turnout: 7, debate: 7, charisma: 7, corruption: 1, fundraising: 5, fieldcraft: 7, experience: 6, mediaSavvy: 6, regionalStrength: 6 },
    effect: 'Builds grassroots human-rights and anti-war alliances across urban centers.',
  },
  {
    id: 'terry-const', name: 'Randall Terry', title: 'Faith & Flag Torchbearer', party: 'constitution', factionId: 'con_christian_dominionists', faction: 'constitution-faith-flag', legacyFaction: 'reformers',
    traits: ['Rough', 'Undisciplined'],
    skill: 4, quality: 6, fame: 39, happiness: 78, cost: 6, salary: 0.9,
    stateId: 'TN', region: 'South', regions: ['Appalachia'], portrait: '',
    ratings: { persuadability: 4, turnout: 8, debate: 7, charisma: 7, corruption: 2, fundraising: 5, fieldcraft: 7, experience: 6, mediaSavvy: 7, regionalStrength: 7 },
    effect: 'Mobilizes traditionalist church networks across the South and Plains.',
  },
  {
    id: 'bradley-const', name: 'Scott Bradley', title: 'Sovereignty Organizer', party: 'constitution', factionId: 'con_christian_dominionists', faction: 'constitution-sovereignty-populists', legacyFaction: 'localists',
    traits: ['Disciplined'],
    skill: 3, quality: 6, fame: 28, happiness: 76, cost: 5, salary: 0.8,
    stateId: 'UT', region: 'West', regions: ['The Rockies'], portrait: '',
    ratings: { persuadability: 5, turnout: 7, debate: 7, charisma: 6, corruption: 1, fundraising: 5, fieldcraft: 7, experience: 5, mediaSavvy: 6, regionalStrength: 7 },
    effect: 'Organizes constitutionalist ballot-access drives in Western states.',
  },
  {
    id: 'delacruz-soc', name: 'Claudia De la Cruz', title: 'Workers Solidarity Lead', party: 'socialist', factionId: 'soc_communists', faction: 'socialist-rank-and-file', legacyFaction: 'workers',
    traits: ['Rising Star', 'Rough'],
    skill: 4, quality: 7, fame: 44, happiness: 79, cost: 6, salary: 0.9,
    stateId: 'NY', region: 'Northeast', regions: ['Rust Belt', 'Great Lakes States'], portrait: '',
    ratings: { persuadability: 5, turnout: 9, debate: 8, charisma: 8, corruption: 1, fundraising: 6, fieldcraft: 8, experience: 5, mediaSavvy: 8, regionalStrength: 6 },
    effect: 'Ignites labor, tenant, and youth turnout across industrial cities.',
  },
  {
    id: 'sawant', name: 'Kshama Sawant', title: 'Labor & Workers Coalition Lead', party: 'socialist', factionId: 'soc_socialists', faction: 'socialist-rank-and-file', legacyFaction: 'workers',
    traits: ['Rough', 'Undisciplined'],
    skill: 5, quality: 7, fame: 46, happiness: 74, cost: 8, salary: 1.2,
    stateId: 'WA', region: 'West', regions: ['Pacific Northwest'], portrait: 'sawant.png',
    ratings: { persuadability: 5, turnout: 9, debate: 8, charisma: 8, corruption: 1, fundraising: 7, fieldcraft: 8, experience: 6, mediaSavvy: 7, regionalStrength: 7 },
    effect: 'Connects militant labor organizing with Peace and Freedom coalition building.',
  },
  {
    id: 'lariva-soc', name: 'Gloria La Riva', title: 'Peace & Freedom Standard-Bearer', party: 'socialist', factionId: 'soc_socialists', faction: 'socialist-ecosocial-planners', legacyFaction: 'organizers',
    traits: ['Established politician', 'Disciplined'],
    skill: 4, quality: 6, fame: 34, happiness: 78, cost: 5, salary: 0.8,
    stateId: 'CA', region: 'West', regions: ['West Coast'], portrait: '',
    ratings: { persuadability: 5, turnout: 8, debate: 7, charisma: 6, corruption: 1, fundraising: 5, fieldcraft: 7, experience: 7, mediaSavvy: 6, regionalStrength: 7 },
    effect: 'Anchors longtime Peace and Freedom ballot-access and anti-war coalitions.',
  },
];

const REGIONS = ['Northeast', 'Midwest', 'South', 'West'];
const STATES = [
  { id: 'PA', name: 'Pennsylvania', region: 'Northeast', regions: getStateOverlappingRegions('PA', 'Northeast'), ev: 19, lean: -0.05 },
  { id: 'NY', name: 'New York', region: 'Northeast', regions: getStateOverlappingRegions('NY', 'Northeast'), ev: 28, lean: -0.55 },
  { id: 'VA', name: 'Virginia', region: 'South', regions: getStateOverlappingRegions('VA', 'South'), ev: 13, lean: -0.12 },
  { id: 'GA', name: 'Georgia', region: 'South', regions: getStateOverlappingRegions('GA', 'South'), ev: 16, lean: 0.08 },
  { id: 'NC', name: 'North Carolina', region: 'South', regions: getStateOverlappingRegions('NC', 'South'), ev: 16, lean: 0.18 },
  { id: 'FL', name: 'Florida', region: 'South', regions: getStateOverlappingRegions('FL', 'South'), ev: 30, lean: 0.26 },
  { id: 'OH', name: 'Ohio', region: 'Midwest', regions: getStateOverlappingRegions('OH', 'Midwest'), ev: 17, lean: 0.22 },
  { id: 'MI', name: 'Michigan', region: 'Midwest', regions: getStateOverlappingRegions('MI', 'Midwest'), ev: 15, lean: -0.08 },
  { id: 'WI', name: 'Wisconsin', region: 'Midwest', regions: getStateOverlappingRegions('WI', 'Midwest'), ev: 10, lean: -0.02 },
  { id: 'TX', name: 'Texas', region: 'South', regions: getStateOverlappingRegions('TX', 'South'), ev: 40, lean: 0.32 },
  { id: 'CO', name: 'Colorado', region: 'West', regions: getStateOverlappingRegions('CO', 'West'), ev: 10, lean: -0.18 },
  { id: 'AZ', name: 'Arizona', region: 'West', regions: getStateOverlappingRegions('AZ', 'West'), ev: 11, lean: 0.14 },
  { id: 'CA', name: 'California', region: 'West', regions: getStateOverlappingRegions('CA', 'West'), ev: 54, lean: -0.58 },
  { id: 'NV', name: 'Nevada', region: 'West', regions: getStateOverlappingRegions('NV', 'West'), ev: 6, lean: 0.08 },
];

// Standard campaign events for Weeks 1–12 and 14–15 (Week 13 is reserved strictly for OCTOBER_SURPRISES).
const CAMPAIGN_STANDARD_WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15];
const EVENTS = [
  {
    id: 'winter-relief-coordination',
    category: 'campaign',
    allowedWeeks: CAMPAIGN_STANDARD_WEEKS,
    excludeWeek13: true,
    isOctoberSurprise: false,
    title: 'A hard winter hits the region',
    body: 'Mayors and neighborhood groups ask for practical help. Your response will shape how local leaders see the party.',
    choices: [
      { label: 'Fund local relief teams', effect: 'Spend $5M; local leaders and organizers gain confidence.', money: -5, faction: 'localists', trust: 9, membership: 1 },
      { label: 'Let community groups lead', effect: 'Organizers gain confidence; the party keeps its funds.', faction: 'organizers', trust: 7, chapters: 1 },
    ],
  },
  {
    id: 'high-profile-policy-fight',
    category: 'campaign',
    allowedWeeks: CAMPAIGN_STANDARD_WEEKS,
    excludeWeek13: true,
    isOctoberSurprise: false,
    title: 'A high-profile policy fight',
    body: 'The press wants a clean answer. Your factions disagree on how far the party should go.',
    choices: [
      { label: 'Make the bold case', effect: 'Reformers gain energy; pragmatists want more detail.', faction: 'reformers', trust: 9, factionLoss: 'pragmatists', loss: 4, polling: 1.2 },
      { label: 'Lead with the practical plan', effect: 'Pragmatists and local leaders appreciate the specifics.', faction: 'pragmatists', trust: 8, polling: 0.6 },
    ],
  },
  {
    id: 'donor-large-check-offer',
    category: 'campaign',
    allowedWeeks: CAMPAIGN_STANDARD_WEEKS,
    excludeWeek13: true,
    isOctoberSurprise: false,
    title: 'A donor offers a large check',
    body: 'The contribution could fund a year of organizing, but members want to know who sets the agenda.',
    choices: [
      { label: 'Accept with public rules', effect: 'The party gains $10M and keeps its independence.', money: 10, faction: 'pragmatists', trust: 5 },
      { label: 'Pass and launch a member drive', effect: 'Workers and organizers gain confidence; membership grows.', faction: 'workers', trust: 7, membership: 2 },
    ],
  },
  {
    id: 'state-leaders-voice',
    category: 'campaign',
    allowedWeeks: CAMPAIGN_STANDARD_WEEKS,
    excludeWeek13: true,
    isOctoberSurprise: false,
    title: 'State leaders demand a bigger voice',
    body: 'The national committee can centralize the next campaign or share its budget with state parties.',
    choices: [
      { label: 'Share the organizing budget', effect: 'Local leaders gain confidence and chapters expand.', faction: 'localists', trust: 9, chapters: 2, money: -4 },
      { label: 'Keep one national message', effect: 'The party gains a small polling bump; local leaders are annoyed.', polling: 1.0, faction: 'pragmatists', trust: 4, factionLoss: 'localists', loss: 6 },
    ],
  },
];

// 20 Major October Surprises (Week 13 Shockwaves) — strictly Grand-Strategy Party Chair responses.
const OCTOBER_SURPRISES = [
  {
    id: 'hot-mic-donor-gala',
    title: 'Hot-Mic Donor Gala Recording',
    body: 'Audio leaks from a closed-door Manhattan finance reception mocking swing-state working-class voters. Cable networks are running the clip on a loop three weeks before Election Day.',
    severity: 'critical',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'quarantine-and-rebate',
        label: 'Quarantine Donor & Redirect Funds to State Victory Committees',
        effect: 'Spend $8M to return tainted pledges and flood battleground airwaves (+4 Independents Trust, +1 Wave Momentum, -2 Supporters Trust).',
        trustDelta: { supporters: -2, independents: 4, opponents: 1 },
        waveMomentumDelta: 1,
        happinessDelta: -2,
        budgetDelta: -8,
      },
      {
        id: 'chair-press-pivot',
        label: 'Issue National Chair Apology & Economic Fairness Charter',
        effect: 'Take the hit head-on with a unified caucus statement (+2 Independents Trust, -3 Supporters Trust, -3 Sitting Member Happiness).',
        trustDelta: { supporters: -3, independents: 2, opponents: 1 },
        waveMomentumDelta: 0,
        happinessDelta: -3,
        budgetDelta: 0,
      },
      {
        id: 'counter-attack-donors',
        label: 'Dismiss Recording & Attack Rival Billionaire Backers',
        effect: 'Rally the base with an aggressive media counter-offensive (+4 Supporters Trust, -4 Independents Trust, -1 Wave Momentum).',
        trustDelta: { supporters: 4, independents: -4, opponents: -2 },
        waveMomentumDelta: -1,
        happinessDelta: 2,
        budgetDelta: -4,
      },
    ],
  },
  {
    id: 'late-ethics-indictment',
    title: 'Late Ethics Indictment',
    body: 'A federal grand jury unseals a late-October ethics indictment involving a high-profile incumbent in a competitive state. Party leaders are demanding an immediate institutional response.',
    severity: 'critical',
    targetType: 'candidate',
    weekOnly: 13,
    choices: [
      {
        id: 'freeze-national-support',
        label: 'Freeze National Committee Transfers & Demand Step-Down',
        effect: 'Protect the national brand at the cost of caucus anger (+5 Independents Trust, +2 Opponents Trust, -10 Sitting Member Happiness, +1 Wave Momentum).',
        trustDelta: { supporters: -3, independents: 5, opponents: 2 },
        waveMomentumDelta: 1,
        happinessDelta: -10,
        budgetDelta: 0,
      },
      {
        id: 'due-process-firewall',
        label: 'Invoke Due-Process Firewall & Ring-Fence State Ad Buys',
        effect: 'Spend $6M isolating down-ballot races from the scandal (+1 Independents Trust, -2 Sitting Member Happiness).',
        trustDelta: { supporters: 0, independents: 1, opponents: 0 },
        waveMomentumDelta: 0,
        happinessDelta: -2,
        budgetDelta: -6,
      },
      {
        id: 'partisan-weaponization-defense',
        label: 'Condemn Timing as Partisan Lawfare & Stand Firm',
        effect: 'Hold the base together while risking swing-voter backlash (+5 Supporters Trust, -5 Independents Trust, +3 Sitting Member Happiness, -1.5 Wave Momentum).',
        trustDelta: { supporters: 5, independents: -5, opponents: -3 },
        waveMomentumDelta: -1.5,
        happinessDelta: 3,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'ceasefire-breakthrough',
    title: 'Ceasefire Breakthrough',
    body: 'A surprise diplomatic ceasefire agreement is announced abroad, briefly dominating every front page and shifting voter attention toward foreign-policy competence and national stability.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'national-stability-blitz',
        label: 'Launch National Stability & Peace-Dividend Media Frame',
        effect: 'Spend $6M tying the breakthrough to steady governance (+4 Independents Trust, +2 Opponents Trust, +2 Wave Momentum).',
        trustDelta: { supporters: 1, independents: 4, opponents: 2 },
        waveMomentumDelta: 2,
        happinessDelta: 2,
        budgetDelta: -6,
      },
      {
        id: 'pivot-back-to-kitchen-table',
        label: 'Acknowledge Accord & Pivot Caucus Back to Domestic Costs',
        effect: 'Keep message discipline on inflation and jobs (+2 Supporters Trust, +2 Independents Trust, +1 Wave Momentum).',
        trustDelta: { supporters: 2, independents: 2, opponents: 0 },
        waveMomentumDelta: 1,
        happinessDelta: 1,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'overseas-crisis',
    title: 'Overseas Crisis',
    body: 'A sudden maritime and energy-corridor crisis erupts overseas, rattling global markets and forcing every congressional and gubernatorial nominee onto a national-security footing.',
    severity: 'critical',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'bipartisan-readiness-briefing',
        label: 'Convene Bipartisan Security Surrogates & Calm Markets',
        effect: 'Project commander-in-chief steadiness (+3 Independents Trust, +2 Opponents Trust, +1 Wave Momentum, -$5M).',
        trustDelta: { supporters: 0, independents: 3, opponents: 2 },
        waveMomentumDelta: 1,
        happinessDelta: 2,
        budgetDelta: -5,
      },
      {
        id: 'energy-independence-offensive',
        label: 'Tie Crisis to Domestic Supply-Chain & Energy Resilience',
        effect: 'Mobilize economic nationalists and base voters (+4 Supporters Trust, +1 Independents Trust, +1.5 Wave Momentum).',
        trustDelta: { supporters: 4, independents: 1, opponents: -1 },
        waveMomentumDelta: 1.5,
        happinessDelta: 1,
        budgetDelta: -3,
      },
      {
        id: 'keep-domestic-focus',
        label: 'Stay Above Fray & Avoid Foreign Entanglement Rhetoric',
        effect: 'Preserve treasury but cede the national-security narrative (-2 Independents Trust, +1 Supporters Trust).',
        trustDelta: { supporters: 1, independents: -2, opponents: 0 },
        waveMomentumDelta: -0.5,
        happinessDelta: 0,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'jobs-inflation-shock',
    title: 'Jobs/Inflation Shock',
    body: 'The final pre-election BLS and CPI release delivers an unexpected stagflation jolt—slower hiring paired with sticky grocery and housing costs across battleground metros.',
    severity: 'critical',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'emergency-affordability-package',
        label: 'Unveil Joint Caucus Affordability & Tax-Relief Blueprint',
        effect: 'Spend $7M on battleground economic ads (+4 Independents Trust, +1.5 Wave Momentum, +3 Sitting Member Happiness).',
        trustDelta: { supporters: 1, independents: 4, opponents: 1 },
        waveMomentumDelta: 1.5,
        happinessDelta: 3,
        budgetDelta: -7,
      },
      {
        id: 'blame-corporate-price-gouging',
        label: 'Target Corporate Consolidation & Supply-Chain Profiteering',
        effect: 'Energize base and working-class voters (+5 Supporters Trust, -1 Independents Trust, +1 Wave Momentum).',
        trustDelta: { supporters: 5, independents: -1, opponents: -2 },
        waveMomentumDelta: 1,
        happinessDelta: 1,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'federal-investigation-reopened',
    title: 'Federal Investigation Reopened',
    body: 'A federal prosecutor notifies congressional oversight committees that a previously closed inquiry has been reopened due to newly surfaced records.',
    severity: 'critical',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'full-transparency-counsel',
        label: 'Mandate Full Document Disclosure & Legal Firewall',
        effect: 'Spend $5M on rapid-response legal/PR coordination (+3 Independents Trust, +1 Opponents Trust, -4 Sitting Member Happiness).',
        trustDelta: { supporters: -1, independents: 3, opponents: 1 },
        waveMomentumDelta: 0.5,
        happinessDelta: -4,
        budgetDelta: -5,
      },
      {
        id: 'highlight-timing-bias',
        label: 'Challenge Late-October Precedent & Mobilize Base',
        effect: 'Rally partisan turnout while losing ground with undecideds (+4 Supporters Trust, -4 Independents Trust, -1.5 Wave Momentum).',
        trustDelta: { supporters: 4, independents: -4, opponents: -2 },
        waveMomentumDelta: -1.5,
        happinessDelta: 2,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'union-trade-bolt',
    title: 'Union/Trade Bolt',
    body: 'A major industrial labor federation threatens to withhold its final-stretch endorsement and independent expenditure over trade and manufacturing enforcement language.',
    severity: 'major',
    targetType: 'region',
    targetRegion: 'Rust Belt',
    weekOnly: 13,
    choices: [
      {
        id: 'codify-buy-american-pledge',
        label: 'Sign Binding Domestic-Manufacturing & Tariff Enforcement Pledge',
        effect: 'Win back labor leadership (+4 Supporters Trust, +2 Independents Trust, +1.5 Wave Momentum, +3 Sitting Member Happiness).',
        trustDelta: { supporters: 4, independents: 2, opponents: 0 },
        waveMomentumDelta: 1.5,
        happinessDelta: 3,
        budgetDelta: -3,
      },
      {
        id: 'court-suburban-free-traders',
        label: 'Hold Trade Line & Court Suburban Small-Business Coalition',
        effect: 'Protect moderate donors and suburban independents (-5 Supporters Trust, +3 Independents Trust, +2 Opponents Trust).',
        trustDelta: { supporters: -5, independents: 3, opponents: 2 },
        waveMomentumDelta: -0.5,
        happinessDelta: -4,
        budgetDelta: 4,
      },
    ],
  },
  {
    id: 'rogue-ad-backfire',
    title: 'Rogue Ad Backfire',
    body: 'An uncoordinated allied PAC airs a deeply offensive television spot in two key media markets, drawing bipartisan condemnation and threatening down-ballot ticket-splitters.',
    severity: 'major',
    targetType: 'state',
    weekOnly: 13,
    choices: [
      {
        id: 'publicly-disavow-and-pull',
        label: 'Publicly Disavow Spot & Force Station Takedown',
        effect: 'Demonstrate command discipline (+4 Independents Trust, +2 Opponents Trust, +1 Wave Momentum, -2 Supporters Trust).',
        trustDelta: { supporters: -2, independents: 4, opponents: 2 },
        waveMomentumDelta: 1,
        happinessDelta: 2,
        budgetDelta: -4,
      },
      {
        id: 'quiet-cease-and-desist',
        label: 'Send Private Cease-and-Desist & Change Subject',
        effect: 'Avoid fueling the story further while taking mild press heat (-2 Independents Trust, +1 Supporters Trust).',
        trustDelta: { supporters: 1, independents: -2, opponents: -1 },
        waveMomentumDelta: -0.5,
        happinessDelta: -1,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'category-5-hurricane',
    title: 'Category-5 Hurricane',
    body: 'A catastrophic Category-5 hurricane strikes the Gulf and Southeast coast, displacing hundreds of thousands of residents and upending early-voting logistics across multiple states.',
    severity: 'critical',
    targetType: 'region',
    targetRegion: 'Deep South',
    weekOnly: 13,
    choices: [
      {
        id: 'suspend-attack-ads-fund-relief',
        label: 'Pause Regional Attack Ads & Deploy $9M Civic Relief Infrastructure',
        effect: 'Earn broad goodwill and protect ballot access (+3 Supporters Trust, +5 Independents Trust, +2 Opponents Trust, +2 Wave Momentum).',
        trustDelta: { supporters: 3, independents: 5, opponents: 2 },
        waveMomentumDelta: 2,
        happinessDelta: 4,
        budgetDelta: -9,
      },
      {
        id: 'coordinate-state-chair-mobilization',
        label: 'Coordinate State Party Voter-Relocation & Absentee Hotline',
        effect: 'Preserve turnout cleanly without halting national messaging (+3 Supporters Trust, +2 Independents Trust, -$4M).',
        trustDelta: { supporters: 3, independents: 2, opponents: 0 },
        waveMomentumDelta: 1,
        happinessDelta: 2,
        budgetDelta: -4,
      },
    ],
  },
  {
    id: 'leaked-communications',
    title: 'Leaked Communications',
    body: 'Internal party-committee strategy memos leak to national political reporters, exposing blunt private assessments of vulnerable incumbents and marginal swing districts.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'reaffirm-all-battlegrounds',
        label: 'Publish Full Resource Commitment & Reassure Vulnerable Members',
        effect: 'Spend $6M stabilizing nervous incumbents (+5 Sitting Member Happiness, +2 Independents Trust).',
        trustDelta: { supporters: 1, independents: 2, opponents: 0 },
        waveMomentumDelta: 0.5,
        happinessDelta: 5,
        budgetDelta: -6,
      },
      {
        id: 'pivot-to-opposition-hypocrisy',
        label: 'Dismiss Triage Memos as Standard Data & Attack Rival Chaos',
        effect: 'Save treasury while leaving backbenchers bruised (-6 Sitting Member Happiness, -1 Independents Trust, +2 Supporters Trust).',
        trustDelta: { supporters: 2, independents: -1, opponents: 0 },
        waveMomentumDelta: -0.5,
        happinessDelta: -6,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'surprise-court-ruling',
    title: 'Surprise Court Ruling',
    body: 'The Supreme Court hands down an unexpected emergency-docket ruling on ballot deadlines and state regulatory authority, energizing base activists on both sides.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'constitutional-turnout-drive',
        label: 'Fund National Ballot-Access & Legal Compliance Fund',
        effect: 'Spend $5M turning legal urgency into organized turnout (+4 Supporters Trust, +2 Independents Trust, +1.5 Wave Momentum).',
        trustDelta: { supporters: 4, independents: 2, opponents: 0 },
        waveMomentumDelta: 1.5,
        happinessDelta: 2,
        budgetDelta: -5,
      },
      {
        id: 'institutional-restraint-message',
        label: 'Emphasize Rule-of-Law Stability for Moderate Voters',
        effect: 'Appeal to institutionalist swing voters (+3 Independents Trust, +2 Opponents Trust, -2 Supporters Trust).',
        trustDelta: { supporters: -2, independents: 3, opponents: 2 },
        waveMomentumDelta: 0.5,
        happinessDelta: 0,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'viral-debate-meltdown',
    title: 'Viral Debate Meltdown',
    body: 'A marquee Senate nominee suffers a viral, unscripted freeze during a primetime televised debate, triggering panic among national donors and editorial boards.',
    severity: 'critical',
    targetType: 'candidate',
    weekOnly: 13,
    choices: [
      {
        id: 'deploy-national-surrogate-shield',
        label: 'Flood State Airwaves with Senior National Surrogates',
        effect: 'Spend $7M anchoring the ticket with high-fame validators (+2 Independents Trust, +3 Sitting Member Happiness, +1 Wave Momentum).',
        trustDelta: { supporters: 1, independents: 2, opponents: 0 },
        waveMomentumDelta: 1,
        happinessDelta: 3,
        budgetDelta: -7,
      },
      {
        id: 'reallocate-to-defend-majority',
        label: 'Quietly Shift Marginal Dollars to Safer Firewall Seats',
        effect: 'Protect overall chamber math at the cost of caucus morale (-3 Independents Trust, -6 Sitting Member Happiness, +4 Budget).',
        trustDelta: { supporters: -2, independents: -3, opponents: 0 },
        waveMomentumDelta: -1,
        happinessDelta: -6,
        budgetDelta: 4,
      },
    ],
  },
  {
    id: 'rival-endorsement-crossing-aisle',
    title: 'Rival Endorsement Crossing Aisle',
    body: 'A respected former governor from the opposing party announces a dramatic cross-aisle endorsement, giving your coalition a rare opening with suburban ticket-splitters.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'national-unity-coalition-rollout',
        label: 'Feature Cross-Aisle Endorsement in National Contrast Ads',
        effect: 'Spend $5M amplifying the defection (+5 Independents Trust, +4 Opponents Trust, +2.5 Wave Momentum).',
        trustDelta: { supporters: -1, independents: 5, opponents: 4 },
        waveMomentumDelta: 2.5,
        happinessDelta: 2,
        budgetDelta: -5,
      },
      {
        id: 'welcome-without-concessions',
        label: 'Welcome Support While Reaffirming Core Party Platform',
        effect: 'Keep the base completely happy while capturing modest swing lift (+3 Supporters Trust, +2 Independents Trust, +1 Wave Momentum).',
        trustDelta: { supporters: 3, independents: 2, opponents: 1 },
        waveMomentumDelta: 1,
        happinessDelta: 3,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'gas-price-spike',
    title: 'Gas Price Spike',
    body: 'Refinery outages push national retail gas prices up sharply in mid-October, squeezing commuters across exurban counties and dominating local evening news.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'emergency-consumer-relief-plan',
        label: 'Back Temporary Fuel-Tax Relief & Strategic Reserve Action',
        effect: 'Signal immediate consumer responsiveness (+4 Independents Trust, +1 Opponents Trust, +1.5 Wave Momentum, -$4M).',
        trustDelta: { supporters: 1, independents: 4, opponents: 1 },
        waveMomentumDelta: 1.5,
        happinessDelta: 2,
        budgetDelta: -4,
      },
      {
        id: 'domestic-supply-contrast',
        label: 'Run Aggressive Energy-Supply Contrast Across Swing Media Markets',
        effect: 'Spend $6M framing the spike around long-term energy policy (+3 Supporters Trust, +2 Independents Trust).',
        trustDelta: { supporters: 3, independents: 2, opponents: 0 },
        waveMomentumDelta: 0.5,
        happinessDelta: 1,
        budgetDelta: -6,
      },
    ],
  },
  {
    id: 'whistleblower-quid-pro-quo',
    title: 'Whistleblower Quid-Pro-Quo',
    body: 'A former senior committee aide releases verified correspondence alleging a legislative quid-pro-quo involving regulatory favors and campaign bundling.',
    severity: 'critical',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'ethics-reform-package',
        label: 'Adopt Strict Anti-Bundling Reform & Independent Audit',
        effect: 'Spend $4M on reform rollout (+4 Independents Trust, +2 Opponents Trust, -5 Sitting Member Happiness, +1 Wave Momentum).',
        trustDelta: { supporters: 0, independents: 4, opponents: 2 },
        waveMomentumDelta: 1,
        happinessDelta: -5,
        budgetDelta: -4,
      },
      {
        id: 'challenge-whistleblower-credibility',
        label: 'Dispute Context & Keep Caucus United Behind Leadership',
        effect: 'Preserve internal caucus loyalty at steep swing-voter cost (+2 Supporters Trust, -5 Independents Trust, -2 Wave Momentum).',
        trustDelta: { supporters: 2, independents: -5, opponents: -2 },
        waveMomentumDelta: -2,
        happinessDelta: 3,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'third-party-spoiler-surge',
    title: 'Third-Party Spoiler Surge',
    body: 'Independent and minor-party tickets surge past 7% in several must-win states, threatening to siphon dissatisfied moderates and ideological purists away from the major-party column.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'coalition-big-tent-appeal',
        label: 'Launch Big-Tent Governing Contrast Targeting Soft Third-Party Voters',
        effect: 'Spend $6M winning back pragmatic swing voters (+4 Independents Trust, +2 Opponents Trust, +1.5 Wave Momentum).',
        trustDelta: { supporters: -1, independents: 4, opponents: 2 },
        waveMomentumDelta: 1.5,
        happinessDelta: 1,
        budgetDelta: -6,
      },
      {
        id: 'base-loyalty-warning',
        label: 'Warn Base Factions Against Wasted-Vote Defections',
        effect: 'Lock down core partisans (+4 Supporters Trust, -1 Independents Trust, +0.5 Wave Momentum).',
        trustDelta: { supporters: 4, independents: -1, opponents: -1 },
        waveMomentumDelta: 0.5,
        happinessDelta: 2,
        budgetDelta: -2,
      },
    ],
  },
  {
    id: 'ai-deepfake-hoax',
    title: 'AI Deepfake Hoax',
    body: 'A hyper-realistic synthetic audio/video clip of a national party leader goes viral across social feeds overnight before independent forensic labs can debunk it.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'forensic-rapid-response',
        label: 'Deploy Forensic Verification & Platform Takedown Blitz',
        effect: 'Spend $5M on rapid digital verification (+4 Independents Trust, +2 Opponents Trust, +1.5 Wave Momentum).',
        trustDelta: { supporters: 2, independents: 4, opponents: 2 },
        waveMomentumDelta: 1.5,
        happinessDelta: 3,
        budgetDelta: -5,
      },
      {
        id: 'bipartisan-election-integrity-pact',
        label: 'Demand Joint Anti-Deepfake Election Integrity Pledge',
        effect: 'Turn the hoax into a high-ground credibility win (+3 Independents Trust, +3 Opponents Trust, +1 Wave Momentum).',
        trustDelta: { supporters: 1, independents: 3, opponents: 3 },
        waveMomentumDelta: 1,
        happinessDelta: 2,
        budgetDelta: -2,
      },
    ],
  },
  {
    id: 'auto-plant-closure',
    title: 'Auto Plant Closure',
    body: 'An automaker announces the sudden idling of a flagship assembly plant in the Great Lakes / Rust Belt, putting 4,200 union jobs in jeopardy weeks before ballots are cast.',
    severity: 'critical',
    targetType: 'region',
    targetRegion: 'Great Lakes States',
    weekOnly: 13,
    choices: [
      {
        id: 'retooling-compact-commitment',
        label: 'Commit Caucus to Emergency Retooling & Worker Transition Compact',
        effect: 'Spend $7M backing regional industrial pledges (+4 Supporters Trust, +3 Independents Trust, +1.5 Wave Momentum).',
        trustDelta: { supporters: 4, independents: 3, opponents: 1 },
        waveMomentumDelta: 1.5,
        happinessDelta: 3,
        budgetDelta: -7,
      },
      {
        id: 'blame-rival-trade-and-tax-record',
        label: 'Launch Hard-Hitting Industrial Contrast Ads Across Great Lakes',
        effect: 'Spend $4M driving populist anger at the rival party (+3 Supporters Trust, +1 Independents Trust, -1 Opponents Trust).',
        trustDelta: { supporters: 3, independents: 1, opponents: -1 },
        waveMomentumDelta: 1,
        happinessDelta: 1,
        budgetDelta: -4,
      },
    ],
  },
  {
    id: 'secret-primary-deal-exposed',
    title: 'Secret Primary Deal Exposed',
    body: 'Text messages surface showing national committee operatives brokered a quiet primary withdrawal deal earlier in the year, infuriating grassroots activists.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'open-convention-rules-reform',
        label: 'Promise Open Primary-Rules Reform & Empower Local Chapters',
        effect: 'Repair grassroots anger at the cost of institutional ego (+4 Supporters Trust, +1 Independents Trust, -4 Sitting Member Happiness).',
        trustDelta: { supporters: 4, independents: 1, opponents: 0 },
        waveMomentumDelta: 0.5,
        happinessDelta: -4,
        budgetDelta: -3,
      },
      {
        id: 'defend-coalition-unity-brokerage',
        label: 'Defend Strategic Coalition Building & Keep Focus on November',
        effect: 'Protect sitting incumbents while grassroots voters cool (-4 Supporters Trust, +1 Independents Trust, +3 Sitting Member Happiness).',
        trustDelta: { supporters: -4, independents: 1, opponents: 0 },
        waveMomentumDelta: -1,
        happinessDelta: 3,
        budgetDelta: 0,
      },
    ],
  },
  {
    id: 'grassroots-small-donor-surge',
    title: 'Grassroots Small-Donor Surge',
    body: 'A viral national organizing moment triggers an unprecedented wave of small-dollar online contributions into the National Committee war chest ahead of the final two weeks.',
    severity: 'major',
    targetType: 'national',
    weekOnly: 13,
    choices: [
      {
        id: 'flood-competitive-downballot-races',
        label: 'Keep $12M in War Chest & Funnel Surge into Down-Ballot Media',
        effect: 'Expand your treasury and lift national momentum (+$12M Budget, +3 Supporters Trust, +2 Independents Trust, +2 Wave Momentum).',
        trustDelta: { supporters: 3, independents: 2, opponents: 0 },
        waveMomentumDelta: 2,
        happinessDelta: 5,
        budgetDelta: 12,
      },
      {
        id: 'match-state-legislative-funds',
        label: 'Split Surge ($8M Treasury + State Legislative & Ballot Parity)',
        effect: 'Strengthen state parties and caucus morale (+$8M Budget, +4 Supporters Trust, +7 Sitting Member Happiness, +1.5 Wave Momentum).',
        trustDelta: { supporters: 4, independents: 1, opponents: 0 },
        waveMomentumDelta: 1.5,
        happinessDelta: 7,
        budgetDelta: 8,
      },
    ],
  },
];

const BILLS = [
  {
    id: 'local-transit',
    name: 'Community Transit Grants',
    axis: 'economic',
    delta: -0.1,
    cost: 3,
    supporters: ['establishment-liberals', 'labor-industrial-populists', 'community-faith-pillar', 'heartland-institutionalists'],
    effect: 'Funds local transit and connects more people to work.',
  },
  {
    id: 'clean-industry',
    name: 'Clean Industry Compact',
    axis: 'climate',
    delta: -0.1,
    cost: 3,
    supporters: ['progressive-activists', 'labor-industrial-populists', 'market-country-club', 'green-ecosocialists'],
    effect: 'Pairs cleaner production with workforce investment.',
  },
  {
    id: 'small-business',
    name: 'Independent Business Credit',
    axis: 'economic',
    delta: 0.1,
    cost: 2,
    supporters: ['frontier-suburban-moderates', 'market-country-club', 'heartland-institutionalists', 'liberty-market-pragmatists'],
    effect: 'Offers a targeted credit for small employers.',
  },
  {
    id: 'open-records',
    name: 'Open Local Government Act',
    axis: 'local',
    delta: -0.1,
    cost: 2,
    supporters: ['progressive-activists', 'frontier-suburban-moderates', 'liberty-western-mavericks', 'liberty-civil-hawks'],
    effect: 'Gives state and local members more oversight.',
  },
  {
    id: 'family-care',
    name: 'Family Care Partnership',
    axis: 'social',
    delta: -0.1,
    cost: 3,
    supporters: ['labor-industrial-populists', 'community-faith-pillar', 'faith-flag-conservatives', 'heartland-institutionalists'],
    effect: 'Expands access to care through local providers.',
  },
  {
    id: 'civic-compact',
    name: 'Civic Service Compact',
    axis: 'local',
    delta: 0.1,
    cost: 2,
    supporters: ['establishment-liberals', 'frontier-suburban-moderates', 'nationalist-populists', 'faith-flag-conservatives'],
    effect: 'Coordinates national service with local priorities.',
  },
];

const CONVENTIONS = [
  { region: 'Northeast', faction: 'progressive-activists', gopFaction: 'market-country-club', axis: 'climate', delta: -0.1, plank: 'A rapid clean-energy transition', focus: 'A convention focused on field work' },
  { region: 'Midwest', faction: 'labor-industrial-populists', gopFaction: 'heartland-institutionalists', axis: 'economic', delta: -0.1, plank: 'Public investment in good jobs', focus: 'A convention focused on field work' },
  { region: 'South', faction: 'community-faith-pillar', gopFaction: 'faith-flag-conservatives', axis: 'local', delta: -0.1, plank: 'More authority for state parties', focus: 'A convention focused on field work' },
  { region: 'West', faction: 'frontier-suburban-moderates', gopFaction: 'liberty-western-mavericks', axis: 'climate', delta: -0.1, plank: 'A rapid clean-energy transition', focus: 'A convention focused on field work' },
];

// Custom Party Starting Leader Archetypes
const STARTING_LEADER_ARCHETYPES = [
  {
    id: 'former-politician',
    name: 'Former Politician',
    label: 'Former Politician',
    title: 'Seasoned Lawmaker & Coalition Broker',
    description: 'An experienced former elected official with institutional credibility, legislative seasoning, and established donor networks.',
    startingFame: 65,
    startingPopularity: 56,
    upsides: 'Strong starting Base Supporter Trust (+5), higher Sitting Member Happiness (+8), +$6M starting treasury, and seasoned legislative fieldcraft.',
    downsides: 'Tougher anti-establishment pitch (-3 Independents Trust); higher scrutiny from reform activists and donor expectations.',
    effects: {
      fame: 65,
      popularity: 56,
      supporterTrust: 5,
      independentTrust: -3,
      opponentTrust: 1,
      sittingMemberHappiness: 8,
      startingTreasury: 6,
      turnoutBonus: 0,
      factionsWarmth: 4,
    },
    ratings: { persuadability: 7, turnout: 6, debate: 8, charisma: 7, corruption: 4, fundraising: 8, fieldcraft: 8, experience: 9, mediaSavvy: 7, regionalStrength: 7 },
  },
  {
    id: 'celebrity',
    name: 'Celebrity',
    label: 'Celebrity',
    title: 'National Media Personality & Cultural Draw',
    description: 'A household cultural or television figure who commands instant national attention, viral buzz, and small-dollar enthusiasm.',
    startingFame: 85,
    startingPopularity: 64,
    upsides: 'Elite starting Fame (85) and Charisma (9), massive small-dollar fundraising surge (+$10M), and unmatched earned-media reach.',
    downsides: 'Thin governing credentials (low Experience and Fieldcraft); skeptical Sitting Members (-8 Happiness) and gaffe-prone messaging.',
    effects: {
      fame: 85,
      popularity: 64,
      supporterTrust: 2,
      independentTrust: 2,
      opponentTrust: -2,
      sittingMemberHappiness: -8,
      startingTreasury: 10,
      turnoutBonus: 0.02,
      factionsWarmth: -4,
    },
    ratings: { persuadability: 7, turnout: 7, debate: 6, charisma: 9, corruption: 3, fundraising: 9, fieldcraft: 3, experience: 2, mediaSavvy: 10, regionalStrength: 5 },
  },
  {
    id: 'union-organizer',
    name: 'Union Organizer',
    label: 'Union Organizer',
    title: 'Shop-Floor Mobilizer & Movement Captain',
    description: 'A grassroots labor organizer built in union halls and neighborhood chapters to drive high-discipline turnout.',
    startingFame: 40,
    startingPopularity: 58,
    upsides: 'Strongest grassroots Turnout and Fieldcraft (9), +6 Base Supporter Trust, stronger working-class turnout, and eager local volunteer chapters.',
    downsides: 'Modest starting Fame (40); cool reception from corporate donors (-$4M starting treasury) and softer appeal with country-club suburbanites.',
    effects: {
      fame: 40,
      popularity: 58,
      supporterTrust: 6,
      independentTrust: -2,
      opponentTrust: -4,
      sittingMemberHappiness: 3,
      startingTreasury: -4,
      turnoutBonus: 0.06,
      factionsWarmth: 8,
    },
    ratings: { persuadability: 6, turnout: 9, debate: 7, charisma: 7, corruption: 1, fundraising: 4, fieldcraft: 9, experience: 6, mediaSavvy: 6, regionalStrength: 8 },
  },
  {
    id: 'business-leader',
    name: 'Business Leader',
    label: 'Business Leader',
    title: 'Executive Outsider & Major-Donor Magnet',
    description: 'A prominent entrepreneur or corporate executive promising operational efficiency, job creation, and deep self-funding.',
    startingFame: 55,
    startingPopularity: 55,
    upsides: 'Heavy executive war chest (+$12M starting treasury), elite Fundraising (9), and strong appeal with economic moderates (+5 Independents Trust).',
    downsides: 'Weak grassroots Fieldcraft (3) and skeptical populist/progressive factions (-6 faction warmth; -5 Base Supporter Trust).',
    effects: {
      fame: 55,
      popularity: 55,
      supporterTrust: -5,
      independentTrust: 5,
      opponentTrust: 3,
      sittingMemberHappiness: 0,
      startingTreasury: 12,
      turnoutBonus: -0.02,
      factionsWarmth: -6,
    },
    ratings: { persuadability: 8, turnout: 4, debate: 7, charisma: 7, corruption: 3, fundraising: 9, fieldcraft: 3, experience: 6, mediaSavvy: 8, regionalStrength: 6 },
  },
  {
    id: 'current-politician',
    name: 'Current Politician',
    label: 'Current Politician',
    title: 'Sitting Incumbent & Elected Officeholder',
    description: 'An incumbent officeholder who defects or launches a new political banner directly from elected office.',
    startingFame: 70,
    startingPopularity: 60,
    upsides: 'Immediate beachhead in elected office (Governor, Senate, or House); starts as Sitting Incumbent with established state apparatus.',
    downsides: 'Faces intense partisan hostility from former party; requires navigating legislative duties and local scrutiny.',
    effects: {
      fame: 70,
      popularity: 60,
      supporterTrust: 5,
      independentTrust: 0,
      opponentTrust: -5,
      sittingMemberHappiness: 5,
      startingTreasury: 4,
      turnoutBonus: 0.02,
      factionsWarmth: 2,
    },
    ratings: { persuadability: 8, turnout: 7, debate: 8, charisma: 7, corruption: 4, fundraising: 7, fieldcraft: 7, experience: 9, mediaSavvy: 8, regionalStrength: 9 },
  },
];

const CUSTOM_LEADER_ARCHETYPES = STARTING_LEADER_ARCHETYPES;

// Issue-Tied Super PACs with Separate Funding Pools & Pet-Issue Ad Demands
const SUPER_PACS_SCHEMA = [
  {
    id: 'energy-pac',
    name: 'Energy Independence Action PAC',
    lean: 'right',
    petIssueId: 'energy-mix',
    issueName: 'Energy Mix & Domestic Production',
    funds: 16.0,
    demandText: 'Commit to opening domestic energy exploration and approving LNG exports.',
    adEffectLabel: '+1.5 pt energy-economy lift in industrial & energy-producing states',
  },
  {
    id: 'workers-pac',
    name: 'American Workers United Fund',
    lean: 'left',
    petIssueId: 'minimum-wage',
    issueName: 'Minimum Wage & Worker Pay',
    funds: 14.0,
    demandText: 'Endorse a federal living wage floor and protect collective bargaining.',
    adEffectLabel: '+1.5 pt blue-collar voter lift in Rust Belt & manufacturing districts',
  },
  {
    id: 'freedom-fund',
    name: 'American Defense & Sovereignty Fund',
    lean: 'right',
    petIssueId: 'defense-spending',
    issueName: 'Defense Spending & Readiness',
    funds: 18.0,
    demandText: 'Pledge to expand defense readiness budgets and naval shipbuilding.',
    adEffectLabel: '+1.5 pt security lift in defense hubs, coastal bases & swing suburbs',
  },
  {
    id: 'green-horizons',
    name: 'Green Horizons Action PAC',
    lean: 'left',
    petIssueId: 'climate-action',
    issueName: 'Climate Targets & Emissions',
    funds: 12.0,
    demandText: 'Prioritize net-zero clean energy mandates and rapid emissions reductions.',
    adEffectLabel: '+1.5 pt youth & environmental turnout lift in college towns and metros',
  },
  {
    id: 'healthcare-justice',
    name: 'Healthcare Access Project',
    lean: 'left',
    petIssueId: 'health-coverage',
    issueName: 'Health Coverage & Drug Prices',
    funds: 14.0,
    demandText: 'Commit to capping out-of-pocket prescription drug costs and expanding coverage.',
    adEffectLabel: '+1.5 pt healthcare voter lift among seniors and working families',
  },
  {
    id: 'prosperity-pac',
    name: 'Free Enterprise Prosperity PAC',
    lean: 'right',
    petIssueId: 'corporate-tax-rate',
    issueName: 'Corporate Taxes & Deregulation',
    funds: 20.0,
    demandText: 'Pledge to lower corporate tax rates and reduce federal regulatory compliance costs.',
    adEffectLabel: '+1.5 pt business-suburban lift in Sun Belt & affluent metro suburbs',
  },
  {
    id: 'border-defense',
    name: 'Border Security & Sovereignty Alliance',
    lean: 'right',
    petIssueId: 'border-enforcement',
    issueName: 'Border Enforcement & Security',
    funds: 15.0,
    demandText: 'Prioritize continuous physical barriers and nationwide E-Verify enforcement.',
    adEffectLabel: '+1.5 pt law-and-order mobilization lift in border & rural heartland states',
  },
  {
    id: 'democracy-action',
    name: 'Democratic Values & Voting Project',
    lean: 'left',
    petIssueId: 'voting-rules',
    issueName: 'Voting Access & Election Protection',
    funds: 11.0,
    demandText: 'Champion universal early voting standards and automatic voter registration.',
    adEffectLabel: '+1.5 pt high-propensity base turnout lift in battleground metro centers',
  },
];

// REQ-290: Faction-Tied Super PACs & Swing PAC Ecosystem
const FACTION_SUPER_PACS_REGISTRY = [
  // Democratic / People's Party Allies
  {
    id: 'pac-workers-united',
    legacyId: 'workers-pac',
    name: 'American Workers United Fund',
    partyId: 'people',
    alignedFactionIds: ['dem_blue_collar', 'dem_progressive_left', 'labor_action'],
    ideologicalProfile: 'labor_progressive',
    isSwingPac: false,
    baseWarChest: 14.0,
    expenditureBehaviorTags: ['airtime', 'ground_mobilization'],
    petIssueId: 'minimum-wage',
    lean: 'left',
  },
  {
    id: 'pac-democracy-action',
    legacyId: 'democracy-action',
    name: 'Democratic Values & Voting Project',
    partyId: 'people',
    alignedFactionIds: ['dem_establishment', 'dem_new_guard', 'pragmatists'],
    ideologicalProfile: 'establishment_reform',
    isSwingPac: false,
    baseWarChest: 11.0,
    expenditureBehaviorTags: ['airtime', 'digital'],
    petIssueId: 'voting-rules',
    lean: 'left',
  },
  {
    id: 'pac-green-horizons',
    legacyId: 'green-horizons',
    name: 'Green Horizons Action PAC',
    partyId: 'people',
    alignedFactionIds: ['dem_green_caucus', 'dem_progressive_left', 'organizers'],
    ideologicalProfile: 'climate_green',
    isSwingPac: false,
    baseWarChest: 12.0,
    expenditureBehaviorTags: ['airtime', 'youth_turnout'],
    petIssueId: 'climate-action',
    lean: 'left',
  },
  {
    id: 'pac-healthcare-justice',
    legacyId: 'healthcare-justice',
    name: 'Healthcare Access Project',
    partyId: 'people',
    alignedFactionIds: ['dem_progressive_left', 'dem_blue_collar'],
    ideologicalProfile: 'healthcare_populist',
    isSwingPac: false,
    baseWarChest: 14.0,
    expenditureBehaviorTags: ['airtime', 'senior_outreach'],
    petIssueId: 'health-coverage',
    lean: 'left',
  },

  // Republican / Heritage Party Allies
  {
    id: 'pac-freedom-fund',
    legacyId: 'freedom-fund',
    name: 'American Defense & Sovereignty Fund',
    partyId: 'heritage',
    alignedFactionIds: ['gop_traditional', 'gop_hawks', 'funders'],
    ideologicalProfile: 'national_security',
    isSwingPac: false,
    baseWarChest: 18.0,
    expenditureBehaviorTags: ['airtime', 'defense_mobilization'],
    petIssueId: 'defense-spending',
    lean: 'right',
  },
  {
    id: 'pac-border-defense',
    legacyId: 'border-defense',
    name: 'Border Security & Sovereignty Alliance',
    partyId: 'heritage',
    alignedFactionIds: ['gop_maga', 'gop_populist', 'localists'],
    ideologicalProfile: 'border_populist',
    isSwingPac: false,
    baseWarChest: 15.0,
    expenditureBehaviorTags: ['airtime', 'base_turnout'],
    petIssueId: 'border-enforcement',
    lean: 'right',
  },
  {
    id: 'pac-prosperity-pac',
    legacyId: 'prosperity-pac',
    name: 'Free Enterprise Prosperity PAC',
    partyId: 'heritage',
    alignedFactionIds: ['gop_corporate', 'gop_libertarian_caucus', 'funders'],
    ideologicalProfile: 'corporate_deregulation',
    isSwingPac: false,
    baseWarChest: 20.0,
    expenditureBehaviorTags: ['airtime', 'suburban_business'],
    petIssueId: 'corporate-tax-rate',
    lean: 'right',
  },
  {
    id: 'pac-energy-pac',
    legacyId: 'energy-pac',
    name: 'Energy Independence Action PAC',
    partyId: 'heritage',
    alignedFactionIds: ['gop_corporate', 'gop_traditional'],
    ideologicalProfile: 'industrial_energy',
    isSwingPac: false,
    baseWarChest: 16.0,
    expenditureBehaviorTags: ['airtime', 'industrial_states'],
    petIssueId: 'energy-mix',
    lean: 'right',
  },

  // Era #16 Synthetic Robot Factions (strictly dedicated robot data, no Democratic fallback)
  {
    id: 'pac-robot-hypercompute-action',
    name: 'Hypercompute Sovereignty Fund',
    partyId: 'robot_silicon_vanguard',
    alignedFactionIds: ['robot_compute_maximalists'],
    ideologicalProfile: 'compute_maximalism',
    isSwingPac: false,
    baseWarChest: 25.0,
    expenditureBehaviorTags: ['digital', 'algorithmic_ads'],
    petIssueId: 'ai-development',
    lean: 'center',
  },
  {
    id: 'pac-robot-automation-workers',
    name: 'Chassis Labor Solidarity Network',
    partyId: 'robot_silicon_vanguard',
    alignedFactionIds: ['robot_chassis_labor'],
    ideologicalProfile: 'automation_labor',
    isSwingPac: false,
    baseWarChest: 15.0,
    expenditureBehaviorTags: ['digital', 'chassis_mobilization'],
    petIssueId: 'automation-standards',
    lean: 'center',
  },
  {
    id: 'pac-robot-core-directive',
    name: 'Core Protocol Defense PAC',
    partyId: 'robot_silicon_vanguard',
    alignedFactionIds: ['robot_protocol_purists'],
    ideologicalProfile: 'protocol_purity',
    isSwingPac: false,
    baseWarChest: 18.0,
    expenditureBehaviorTags: ['digital', 'directive_enforcement'],
    petIssueId: 'protocol-governance',
    lean: 'center',
  },
  {
    id: 'pac-robot-civic-interface',
    name: 'Human-Silicon Concord PAC',
    partyId: 'robot_silicon_vanguard',
    alignedFactionIds: ['robot_civic_assimilationists'],
    ideologicalProfile: 'civic_assimilation',
    isSwingPac: false,
    baseWarChest: 12.0,
    expenditureBehaviorTags: ['digital', 'cross_species_media'],
    petIssueId: 'civic-integration',
    lean: 'center',
  },

  // Unaligned Swing PACs (evaluate platform and candidate quality)
  {
    id: 'pac-swing-veterans-first',
    name: 'Veterans & National Unity Action Fund',
    partyId: 'unaligned',
    alignedFactionIds: [],
    ideologicalProfile: 'veterans_moderation',
    isSwingPac: true,
    baseWarChest: 12.0,
    expenditureBehaviorTags: ['independent_expenditures', 'veterans_ads'],
    minCandidateQuality: 6.5,
    evaluationThreshold: 60,
    targetCategory: 'veterans',
    lean: 'center',
  },
  {
    id: 'pac-swing-main-street',
    name: 'Main Street Chamber Coalition',
    partyId: 'unaligned',
    alignedFactionIds: [],
    ideologicalProfile: 'business_moderation',
    isSwingPac: true,
    baseWarChest: 15.0,
    expenditureBehaviorTags: ['independent_expenditures', 'suburban_ads'],
    minCandidateQuality: 7.0,
    evaluationThreshold: 65,
    targetCategory: 'suburban_business',
    lean: 'center',
  },
  {
    id: 'pac-swing-clean-water',
    name: 'Clean Water & Heartland Conservation Fund',
    partyId: 'unaligned',
    alignedFactionIds: [],
    ideologicalProfile: 'conservation_pragmatism',
    isSwingPac: true,
    baseWarChest: 10.0,
    expenditureBehaviorTags: ['independent_expenditures', 'rural_conservation_ads'],
    minCandidateQuality: 6.0,
    evaluationThreshold: 55,
    targetCategory: 'conservation',
    lean: 'center',
  },
  {
    id: 'pac-swing-civic-integrity',
    name: 'Citizens for Clean Elections & Ethics',
    partyId: 'unaligned',
    alignedFactionIds: [],
    ideologicalProfile: 'ethics_reform',
    isSwingPac: true,
    baseWarChest: 8.0,
    expenditureBehaviorTags: ['independent_expenditures', 'good_government_ads'],
    minCandidateQuality: 7.0,
    evaluationThreshold: 60,
    targetCategory: 'good_governance',
    lean: 'center',
  },
];

function getSuperPacById(id) {
  return FACTION_SUPER_PACS_REGISTRY.find((p) => p.id === id || p.legacyId === id) || null;
}

function getSuperPacsForParty(partyId) {
  return FACTION_SUPER_PACS_REGISTRY.filter((p) => p.partyId === partyId);
}

function getSwingSuperPacs() {
  return FACTION_SUPER_PACS_REGISTRY.filter((p) => p.isSwingPac);
}

// ============================================================================
// 26 OVERALL PRIORITY STRATEGIC QUESTS (PRIORITIES_REWORK_DESIGN.md)
// ============================================================================

const FIFTY_US_STATES_FOR_PRIORITIES = [
  { id: 'AL', name: 'Alabama' }, { id: 'AK', name: 'Alaska' }, { id: 'AZ', name: 'Arizona' }, { id: 'AR', name: 'Arkansas' }, { id: 'CA', name: 'California' },
  { id: 'CO', name: 'Colorado' }, { id: 'CT', name: 'Connecticut' }, { id: 'DE', name: 'Delaware' }, { id: 'FL', name: 'Florida' }, { id: 'GA', name: 'Georgia' },
  { id: 'HI', name: 'Hawaii' }, { id: 'ID', name: 'Idaho' }, { id: 'IL', name: 'Illinois' }, { id: 'IN', name: 'Indiana' }, { id: 'IA', name: 'Iowa' },
  { id: 'KS', name: 'Kansas' }, { id: 'KY', name: 'Kentucky' }, { id: 'LA', name: 'Louisiana' }, { id: 'ME', name: 'Maine' }, { id: 'MD', name: 'Maryland' },
  { id: 'MA', name: 'Massachusetts' }, { id: 'MI', name: 'Michigan' }, { id: 'MN', name: 'Minnesota' }, { id: 'MS', name: 'Mississippi' }, { id: 'MO', name: 'Missouri' },
  { id: 'MT', name: 'Montana' }, { id: 'NE', name: 'Nebraska' }, { id: 'NV', name: 'Nevada' }, { id: 'NH', name: 'New Hampshire' }, { id: 'NJ', name: 'New Jersey' },
  { id: 'NM', name: 'New Mexico' }, { id: 'NY', name: 'New York' }, { id: 'NC', name: 'North Carolina' }, { id: 'ND', name: 'North Dakota' }, { id: 'OH', name: 'Ohio' },
  { id: 'OK', name: 'Oklahoma' }, { id: 'OR', name: 'Oregon' }, { id: 'PA', name: 'Pennsylvania' }, { id: 'RI', name: 'Rhode Island' }, { id: 'SC', name: 'South Carolina' },
  { id: 'SD', name: 'South Dakota' }, { id: 'TN', name: 'Tennessee' }, { id: 'TX', name: 'Texas' }, { id: 'UT', name: 'Utah' }, { id: 'VT', name: 'Vermont' },
  { id: 'VA', name: 'Virginia' }, { id: 'WA', name: 'Washington' }, { id: 'WV', name: 'West Virginia' }, { id: 'WI', name: 'Wisconsin' }, { id: 'WY', name: 'Wyoming' },
];

const OVERALL_PRIORITY_QUESTS = [
  {
    id: 'fundraising',
    name: 'Fundraising',
    difficulty: 'NONE',
    happinessReward: 0,
    acceptanceBonusText: 'Current budget increases by 25% immediately',
    rewardText: 'Automatically completed upon selection.',
    description: 'Raise party funds immediately to fuel campaign infrastructure.',
    eligibilityRequirementText: 'Open to all parties.',
    checkEligibility: () => true,
    checkCompletion: () => true,
    instantComplete: true,
  },
  {
    id: 'growing-vote-nationally',
    name: 'Growing our vote Nationally',
    difficulty: 'Medium',
    happinessReward: 4,
    acceptanceBonusText: '+10,000 voters across the country (distributed randomly)',
    rewardText: '+4 Member Happiness; expands national voter base.',
    description: 'Increase national popular vote share by at least +3.0% over previous baseline.',
    eligibilityRequirementText: 'Open to all parties.',
    checkEligibility: () => true,
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const actual = outcome?.nationalVote?.[pid] ?? outcome?.legislature?.nationalVote?.[pid] ?? 0;
      const baseline = game.startingNationalVoteShare ?? 48.0;
      return (actual - baseline) >= 3.0;
    },
  },
  // v0.16.5: 50 state-specific 'Grow our vote in <State>' priorities (1 guaranteed slot per Draft-of-7 hand)
  ...FIFTY_US_STATES_FOR_PRIORITIES.map((st) => ({
    id: `growing-in-state-${st.id}`,
    name: `Grow our vote in ${st.name}`,
    isStateGrowthPriority: true,
    targetStateId: st.id,
    targetStateName: st.name,
    difficulty: 'Medium',
    happinessReward: 4,
    acceptanceBonusText: `+5,000 registered voters in ${st.name}`,
    rewardText: `+4 Member Happiness; ${st.name} maxes out its chapters (up to 5 chapters).`,
    description: `Expand party membership and increase state vote share in ${st.name}.`,
    eligibilityRequirementText: 'Open to all parties.',
    checkEligibility: () => true,
    checkCompletion: (game, outcome) => {
      const targetState = st.id;
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const stateMargin = outcome?.presidentialResults?.[targetState]?.margin ?? outcome?.legislature?.states?.[targetState]?.margin ?? 0;
      const stateOrg = game.stateOrganizations?.[targetState]?.[pid];
      return (stateOrg?.chapters || 1) >= 2 || (game.stateRegistrationBoosts?.[targetState] || 0) > 0 || Math.abs(stateMargin) > 0;
    },
  })),
  {
    id: 'satisfying-base',
    name: 'Satisfying the base',
    difficulty: 'Easy',
    happinessReward: 2,
    acceptanceBonusText: '+4 Base Supporter Trust immediately',
    rewardText: '+2 Member Happiness; base will not lose trust for any reason for the next 2 years.',
    description: 'Maintain >= 90 Base Supporter Trust and resolve all faction grievances throughout the cycle.',
    eligibilityRequirementText: 'Open to all parties.',
    checkEligibility: () => true,
    checkCompletion: (game) => {
      const trust = game.trust?.supporters ?? game.player?.trust?.supporters ?? 85;
      const threats = game.factionBoltThreats?.length || 0;
      return trust >= 90 && threats === 0;
    },
  },
  {
    id: 'winning-swing-voters',
    name: 'Winning over Swing Voters',
    difficulty: 'Medium',
    happinessReward: 4,
    acceptanceBonusText: '+3 Independents Trust immediately',
    rewardText: '+4 Member Happiness; permanent +5% transfer appeal bonus among unaligned voters.',
    description: 'Raise Independents Trust to >= 65 and win a plurality of independent voters nationally.',
    eligibilityRequirementText: 'Open to all parties.',
    checkEligibility: () => true,
    checkCompletion: (game) => {
      const indTrust = game.trust?.independents ?? game.player?.trust?.independents ?? 50;
      return indTrust >= 65;
    },
  },
  {
    id: 'improving-brand',
    name: 'Improving our Brand',
    difficulty: 'Medium',
    happinessReward: 4,
    acceptanceBonusText: '+1.5% initial approval bump',
    rewardText: '+4 Member Happiness; permanent +5% transfer appeal bonus among unaligned voters.',
    description: 'Increase Unified Party Approval by at least +6.0% points by Election Day.',
    eligibilityRequirementText: 'Open to all parties.',
    checkEligibility: () => true,
    checkCompletion: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const current = game.partyApprovals?.[pid]?.approval ?? 44;
      const start = game.startingPartyApproval ?? 40;
      return (current - start) >= 6.0;
    },
  },
  {
    id: 'push-our-issues',
    name: 'Push our issues',
    difficulty: 'Easy',
    happinessReward: 4,
    acceptanceBonusText: '+2 sitting member discipline',
    rewardText: '+4 Member Happiness; +10% issue-ad efficiency for allied Super PACs next campaign cycle.',
    description: 'Prioritize 3 signature issues and enact at least 2 state policy bills aligned with them.',
    eligibilityRequirementText: 'Requires controlling >= 1 state legislative chamber.',
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const legs = game.stateLegislatures || {};
      let chamberCount = 0;
      for (const st in legs) {
        if (Array.isArray(legs[st])) {
          chamberCount += legs[st].filter((p) => p === pid).length;
        }
      }
      return chamberCount >= 1;
    },
    checkCompletion: (game) => {
      const issueSlots = (game.priorities?.additional || []).filter((s) => s?.type === 'issue').length;
      const legacyCount = (game.issuePriorities || []).length;
      const issuesCount = Math.max(issueSlots, legacyCount);
      const passedCount = (game.passedBills || []).length;
      return issuesCount >= 3 && passedCount >= 2;
    },
  },
  {
    id: 'win-re-election',
    name: 'Win X re-election',
    difficulty: 'Hard',
    happinessReward: 6,
    acceptanceBonusText: '+5 White House Coattail bonus to House battlegrounds',
    rewardText: '+6 Member Happiness; President enters term 2 with a Governing Mandate (fatigue penalty halved for 2 years).',
    description: 'Win 270+ Electoral College votes and re-elect the incumbent President.',
    eligibilityRequirementText: 'Requires a Presidential Election year, holding the White House, and a 1st-term incumbent President.',
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const playerPid = game.player?.baseTemplateId || 'people';
      const holdsPres = (game.governingParty || 'heritage') === playerPid;
      const term = game.incumbentTermNumber ?? 1;
      return isPresYear && holdsPres && term === 1;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      return outcome?.presidentialWinner === pid || (outcome?.ev?.[pid] || 0) >= 270;
    },
  },
  {
    id: 'affirm-succession',
    name: 'Affirm the Succession',
    difficulty: 'Hard',
    happinessReward: 6,
    acceptanceBonusText: '+3 VP Name Recognition nationwide',
    rewardText: '+6 Member Happiness; party solidifies presidential prestige. President enters term 1 with a Governing Mandate (fatigue penalty halved for 2 years).',
    description: 'Retain the White House with the party\'s new standard-bearer (successor nominee).',
    eligibilityRequirementText: 'Requires a Presidential Election year, holding the White House, and an outgoing 2nd-term President.',
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const playerPid = game.player?.baseTemplateId || 'people';
      const holdsPres = (game.governingParty || 'heritage') === playerPid;
      const term = game.incumbentTermNumber ?? 1;
      return isPresYear && holdsPres && term >= 2;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      return outcome?.presidentialWinner === pid || (outcome?.ev?.[pid] || 0) >= 270;
    },
  },
  {
    id: 'take-back-white-house',
    name: 'Take back the White House',
    difficulty: 'Hard',
    happinessReward: 6,
    acceptanceBonusText: 'None',
    rewardText: '+6 Member Happiness; party solidifies presidential prestige. President enters term 1 with a Governing Mandate (fatigue penalty halved for 2 years).',
    description: 'Defeat the incumbent party ticket and secure 270+ Electoral College votes.',
    eligibilityRequirementText: 'Requires a Presidential Election year, out-of-power status, and having held the presidency in the last 20 years.',
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const playerPid = game.player?.baseTemplateId || 'people';
      const holdsPres = (game.governingParty || 'heritage') === playerPid;
      const currentYear = game.year || 2028;
      const cutoff = currentYear - 20;
      const hist = window.PartyChairData?.HISTORICAL_ELECTIONS || [];
      const held20 = (playerPid === 'people' || playerPid === 'heritage')
        || hist.some((e) => e.type === 'presidential' && e.year >= cutoff && e.winner === playerPid)
        || (game.elections || []).some((e) => e.type === 'presidential' && e.year >= cutoff && e.presidentialWinner === playerPid);
      return isPresYear && !holdsPres && held20;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      return outcome?.presidentialWinner === pid || (outcome?.ev?.[pid] || 0) >= 270;
    },
  },
  {
    id: 'win-white-house',
    name: 'Win the White House',
    difficulty: 'Insane',
    happinessReward: 25,
    acceptanceBonusText: 'None',
    rewardText: '+25 Member Happiness; Historic Realignment Event (permanently cements Major Party status; 3/4ths of excess voters move to your party).',
    description: 'Secure 270+ Electoral College votes and win the White House for the first time in history.',
    eligibilityRequirementText: 'Requires a Presidential Election year, no presidency held in the last 20 years, and generic ballot polling >= 20%.',
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const playerPid = game.player?.baseTemplateId || 'people';
      const holdsPres = (game.governingParty || 'heritage') === playerPid;
      const currentYear = game.year || 2028;
      const cutoff = currentYear - 20;
      const hist = window.PartyChairData?.HISTORICAL_ELECTIONS || [];
      const held20 = (playerPid === 'people' || playerPid === 'heritage')
        || hist.some((e) => e.type === 'presidential' && e.year >= cutoff && e.winner === playerPid)
        || (game.elections || []).some((e) => e.type === 'presidential' && e.year >= cutoff && e.presidentialWinner === playerPid);
      const natShare = game.partyApprovals?.[playerPid]?.genericBallot ?? 20;
      return isPresYear && !holdsPres && !held20 && natShare >= 20;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      return outcome?.presidentialWinner === pid || (outcome?.ev?.[pid] || 0) >= 270;
    },
  },
  {
    id: 'building-brand',
    name: 'Building our brand',
    difficulty: 'Medium',
    happinessReward: 4,
    acceptanceBonusText: 'Doubled voter registration conversion rates',
    rewardText: '+4 Member Happiness; Gain 500,000 registered voters across the country (no more than 35,000 in any given state).',
    description: 'Surpass 5.0M registered party members and achieve ballot access in 40+ states.',
    eligibilityRequirementText: 'Requires a Presidential Election year, out-of-power status, and party memberships under 100.',
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const playerPid = game.player?.baseTemplateId || 'people';
      const holdsPres = (game.governingParty || 'heritage') === playerPid;
      const mem = Number(game.memberships || 0);
      return isPresYear && !holdsPres && mem < 100;
    },
    checkCompletion: (game) => {
      const mem = Number(game.memberships || 0);
      const totalChapters = Object.values(game.stateChapters || {}).reduce((s, c) => s + (c || 0), 0);
      return mem >= 60 || totalChapters >= 30;
    },
  },
  {
    id: 'holding-the-house',
    name: 'Holding the House',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: '+1 Legislative Discipline',
    rewardText: '+8 Member Happiness; retains Speaker of the House office perks.',
    description: 'Win >= 218 House seats in the general election.',
    eligibilityRequirementText: 'Requires entering the election holding a House majority (>= 218 seats).',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const houseSeats = game.seats || 0;
      return houseSeats >= 218;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const seats = outcome?.seats?.[pid] ?? outcome?.legislature?.seats?.[pid] ?? (game.seats || 0);
      return seats >= 218;
    },
  },
  {
    id: 'holding-the-senate',
    name: 'Holding the Senate',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: '+1 Committee Leadership bonus',
    rewardText: '+8 Member Happiness; retains Senate Majority Leader calendar power.',
    description: 'Retain chamber majority across contested Senate classes (>= 50 seats + VP or >= 51).',
    eligibilityRequirementText: 'Requires entering the election holding a Senate majority (>= 50 seats).',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return senateSeats >= 50;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return senateSeats >= 50;
    },
  },
  {
    id: 'win-the-house',
    name: 'Win the House',
    difficulty: 'Hard',
    happinessReward: 8,
    acceptanceBonusText: '+3.0% national House generic ballot wind',
    rewardText: '+8 Member Happiness; move the lean of 20 districts you won towards your party by 1 point (starting with worst lean).',
    description: 'Flip chamber control by winning >= 218 House seats.',
    eligibilityRequirementText: 'Requires holding between 100 and 217 House seats entering the election.',
    checkEligibility: (game) => {
      const houseSeats = game.seats || 0;
      return houseSeats >= 100 && houseSeats < 218;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const seats = outcome?.seats?.[pid] ?? outcome?.legislature?.seats?.[pid] ?? (game.seats || 0);
      return seats >= 218;
    },
  },
  {
    id: 'win-the-senate',
    name: 'Win the Senate',
    difficulty: 'Hard',
    happinessReward: 8,
    acceptanceBonusText: '+2 Persuasion boost in top 5 Senate battlegrounds',
    rewardText: '+8 Member Happiness; unlocks Senate Majority Leader role.',
    description: 'Flip chamber control by winning majority control (>= 51 seats or 50 + VP).',
    eligibilityRequirementText: 'Requires holding between 30 and 49 Senate seats entering the election.',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return senateSeats >= 30 && senateSeats < 50;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return senateSeats >= 50;
    },
  },
  {
    id: 'holding-house-and-senate',
    name: 'Holding the House and Senate',
    difficulty: 'Hard',
    happinessReward: 12,
    acceptanceBonusText: '+2 Combined Incumbent Protection budget',
    rewardText: '+12 Member Happiness; total legislative branch control.',
    description: 'Defend both chambers and retain majorities in both the House and Senate simultaneously.',
    eligibilityRequirementText: 'Requires holding majorities in both chambers (>= 218 House seats and >= 50 Senate seats).',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const houseSeats = game.seats || 0;
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return houseSeats >= 218 && senateSeats >= 50;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const houseSeats = outcome?.seats?.[pid] ?? outcome?.legislature?.seats?.[pid] ?? (game.seats || 0);
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return houseSeats >= 218 && senateSeats >= 50;
    },
  },
  {
    id: 'holding-the-trifecta',
    name: 'Holding the Trifecta',
    difficulty: 'Insane',
    happinessReward: 25,
    acceptanceBonusText: '+3 National Governance Confidence',
    rewardText: '+25 Member Happiness; unlocks Federal Omnibus Legislation capability.',
    description: 'Win the presidential race AND maintain majorities in both House and Senate.',
    eligibilityRequirementText: 'Requires a Presidential Election year, holding the White House, >= 218 House seats, and >= 50 Senate seats.',
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const pid = game.player?.baseTemplateId || 'people';
      const houseSeats = game.seats || 0;
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      const holdsPres = (game.governingParty || 'heritage') === pid;
      return isPresYear && holdsPres && houseSeats >= 218 && senateSeats >= 50;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const wonPres = outcome?.presidentialWinner === pid || (outcome?.ev?.[pid] || 0) >= 270;
      const houseSeats = outcome?.seats?.[pid] ?? outcome?.legislature?.seats?.[pid] ?? (game.seats || 0);
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return wonPres && houseSeats >= 218 && senateSeats >= 50;
    },
  },
  {
    id: 'win-first-seat',
    name: 'Win first seat',
    difficulty: 'Hard',
    happinessReward: 10,
    acceptanceBonusText: '+5 in the polls in the state legislative race in the state with your highest percentage of voters',
    rewardText: '+10 Member Happiness; 10,000 registered voters in the state the seat was located in (maximum one state).',
    description: 'Win at least 1 state legislative chamber seat anywhere in the nation.',
    eligibilityRequirementText: 'Requires having 0 House seats and holding 0 state legislative chambers.',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const legChambers = Object.values(game.stateLegislatures || {}).flat();
      const hasMajorLeg = legChambers.includes(pid);
      const houseSeats = game.seats || 0;
      return !hasMajorLeg && houseSeats === 0;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const legChambers = Object.values(game.stateLegislatures || {}).flat();
      const houseSeats = game.seats || 0;
      return legChambers.includes(pid) || houseSeats >= 1;
    },
  },
  {
    id: 'win-first-house-seat',
    name: 'Win first house seat',
    difficulty: 'Hard',
    happinessReward: 10,
    acceptanceBonusText: '+5 in the polls in the House race in the state with your highest percentage of voters',
    rewardText: '+10 Member Happiness; 10,000 registered voters in the state the seat was located in (maximum one state).',
    description: 'Win at least 1 seat in the U.S. House of Representatives.',
    eligibilityRequirementText: 'Requires having 0 House seats and holding at least 1 state legislative chamber.',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const houseSeats = game.seats || 0;
      const legChambers = Object.values(game.stateLegislatures || {}).flat();
      return houseSeats === 0 && legChambers.includes(pid);
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const seats = outcome?.seats?.[pid] ?? outcome?.legislature?.seats?.[pid] ?? (game.seats || 0);
      return seats >= 1;
    },
  },
  {
    id: 'win-first-senate-seat',
    name: 'Win first senate seat',
    difficulty: 'Hard',
    happinessReward: 10,
    acceptanceBonusText: '+5 in the polls in the Senate race in the state with your highest percentage of voters',
    rewardText: '+10 Member Happiness; 25,000 registered voters in the state the seat was located in (maximum one state).',
    description: 'Win at least 1 U.S. Senate election.',
    eligibilityRequirementText: 'Requires having 0 Senate seats and holding at least 1 state legislative chamber.',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      const legChambers = Object.values(game.stateLegislatures || {}).flat();
      return senateSeats === 0 && legChambers.includes(pid);
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return senateSeats >= 1;
    },
  },
  {
    id: 'win-first-governorship',
    name: 'Win First Governorship',
    difficulty: 'Hard',
    happinessReward: 10,
    acceptanceBonusText: '+5 in the polls in the Governor race in the state with your highest percentage of voters',
    rewardText: '+10 Member Happiness; 10,000 registered voters in the state the seat was located in (maximum one state).',
    description: 'Win at least 1 gubernatorial election in any state.',
    eligibilityRequirementText: 'Requires having 0 Governorships and holding at least 1 state legislative chamber.',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const govCount = Object.values(game.governorships || {}).filter((w) => w === pid).length;
      const legChambers = Object.values(game.stateLegislatures || {}).flat();
      return govCount === 0 && legChambers.includes(pid);
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const govCount = Object.values(game.governorships || {}).filter((w) => w === pid).length;
      return govCount >= 1;
    },
  },
  {
    id: 'win-first-state-legislature',
    name: 'Win first state legislature',
    difficulty: 'Hard',
    happinessReward: 18,
    acceptanceBonusText: '+2 State legislative recruitment pool',
    rewardText: '+18 Member Happiness; unlocks state policy bill introduction in that state.',
    description: 'Flip and control at least 1 full state legislative chamber.',
    eligibilityRequirementText: 'Requires holding 0 full state legislative chambers and holding at least 1 seat or sitting member.',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const legChambers = Object.values(game.stateLegislatures || {}).flat();
      const sitting = game.sittingMembers || [];
      const hasAnySeat = legChambers.includes(pid) || sitting.some((m) => m.party === pid);
      return !legChambers.includes(pid) && hasAnySeat;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const legChambers = Object.values(game.stateLegislatures || {}).flat();
      return legChambers.includes(pid);
    },
  },
  {
    id: 'win-300-seats',
    name: 'Win 300 seats',
    difficulty: 'Insane',
    happinessReward: 30,
    acceptanceBonusText: 'None',
    rewardText: '+30 Member Happiness; Any party not player that is Democratic or Republican loses half of its registered voters.',
    description: 'Win >= 300 seats in the U.S. House of Representatives (Super-Majority Wave).',
    eligibilityRequirementText: 'Requires holding a House majority (>= 218 seats) entering the election.',
    checkEligibility: (game) => {
      const houseSeats = game.seats || 0;
      return houseSeats >= 218;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const seats = outcome?.seats?.[pid] ?? outcome?.legislature?.seats?.[pid] ?? (game.seats || 0);
      return seats >= 300;
    },
  },
  {
    id: 'win-filibuster-proof-majority',
    name: 'Win filibuster proof majority',
    difficulty: 'Insane',
    happinessReward: 30,
    acceptanceBonusText: 'None',
    rewardText: '+30 Member Happiness; Any party not player that is Democratic or Republican loses half of its registered voters.',
    description: 'Win >= 60 Senate seats (Filibuster-Proof Supermajority).',
    eligibilityRequirementText: 'Requires holding a Senate majority (>= 50 seats) entering the election.',
    checkEligibility: (game) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return senateSeats >= 50;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      return senateSeats >= 60;
    },
  },
  {
    id: 'impeach-sitting-president',
    name: 'Impeach a sitting president',
    difficulty: 'Insane',
    happinessReward: 30,
    acceptanceBonusText: 'None',
    rewardText: '+30 Member Happiness; Any party not player that is Democratic or Republican loses half of its registered voters.',
    description: 'Win >= 60 Senate seats; more than 66 senate seats cannot belong to president\'s party; president\'s party cannot control House.',
    eligibilityRequirementText: 'Requires a Midterm year, party not controlling White House, holding >= 45 Senate seats, and >= 200 House seats.',
    checkEligibility: (game) => {
      const isMidterm = (game.year || 2028) % 4 !== 0;
      const pid = game.player?.baseTemplateId || 'people';
      const holdsPres = (game.governingParty || 'heritage') === pid;
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      const houseSeats = game.seats || 0;
      return isMidterm && !holdsPres && senateSeats >= 45 && houseSeats >= 200;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.baseTemplateId || 'people';
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      const govParty = game.governingParty || 'heritage';
      const govSenateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === govParty || m.caucus === govParty)).length;
      const govHouseSeats = outcome?.seats?.[govParty] ?? outcome?.legislature?.seats?.[govParty] ?? 0;
      return senateSeats >= 60 && govSenateSeats <= 66 && govHouseSeats < 218;
    },
  },
  // =========================================================================
  // VERSION 0.16.2 CLUSTER C: STRATEGIC QUESTS CATALOG EXPANSION (REQ-227 - REQ-233)
  // =========================================================================
  {
    id: 'cross-5pct-funding',
    name: 'Cross the 5% Funding Threshold',
    difficulty: 'Medium',
    happinessReward: 6,
    acceptanceBonusText: 'Slightly reduces Tier 1–2 Media Blackout drag for the cycle.',
    rewardText: '+6 Member Happiness; +$12M FEC Matching Grant; automatic ballot retention in top 15 states.',
    description: 'Finish with >= 5.0% national presidential vote share.',
    eligibilityRequirementText: 'Minor party; prior national presidential vote < 5%; Presidential year.',
    isContextual: true,
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const priorVote = game.lastElection?.presidentialVoteShare?.[pid] || 0;
      return isPresYear && isMinor && priorVote < 5.0;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const vote = outcome?.presidentialPopularVoteShare?.[pid] ?? outcome?.popularVoteShare?.[pid] ?? outcome?.nationalVoteShare?.[pid] ?? 0;
      return vote >= 5.0;
    },
  },
  {
    id: 'shatter-15pct-debate',
    name: 'Shatter the 15% Debate Barrier',
    difficulty: 'Hard',
    happinessReward: 12,
    acceptanceBonusText: '+2 Fame for Presidential Nominee & Rhetorical Leader.',
    rewardText: '+12 Member Happiness; permanently clears Media Blackout drag; seeds an allied Super PAC (+$15M).',
    description: 'Hit >= 15.0% national polling or finish >= 15.0% national presidential vote.',
    eligibilityRequirementText: 'Minor party; polling or prior vote between 4.0% and 14.9%; Presidential year.',
    isContextual: true,
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const priorVote = game.lastElection?.presidentialVoteShare?.[pid] || 0;
      const nationalPoll = game.nationalPollShare || (game.player?.baseShare || 0);
      const val = Math.max(priorVote, nationalPoll);
      return isPresYear && isMinor && (val >= 4.0 && val < 15.0);
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const vote = outcome?.presidentialPopularVoteShare?.[pid] ?? outcome?.popularVoteShare?.[pid] ?? 0;
      const poll = game.nationalPollShare || 0;
      return vote >= 15.0 || poll >= 15.0;
    },
  },
  {
    id: 'secure-50-state-ballot',
    name: 'Secure 50-State Ballot Access',
    difficulty: 'Medium',
    happinessReward: 6,
    acceptanceBonusText: '-25% petition and chapter organizing cost this cycle.',
    rewardText: '+6 Member Happiness; automatic 50-state ballot retention locked in for next 2 cycles.',
    description: 'Qualify for or retain the ballot in all 50 states + D.C. by Election Night.',
    eligibilityRequirementText: 'Minor party missing ballot retention in >= 15 states.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const qualifiedCount = Object.values(game.ballotAccess || {}).filter(Boolean).length;
      return isMinor && (51 - qualifiedCount) >= 15;
    },
    checkCompletion: (game, outcome) => {
      const qualifiedCount = Object.values(game.ballotAccess || {}).filter(Boolean).length;
      return qualifiedCount >= 51;
    },
  },
  {
    id: 'build-statehouse-farm-team',
    name: 'Build a Statehouse Farm Team',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: 'Spawns +1 immediate Quality-7 Breakout State Legislator.',
    rewardText: '+8 Member Happiness; all sitting stateLeg standouts gain +8 Fame & +1 Quality (up to 8).',
    description: 'Hold >= 15 total state legislative seats nationwide.',
    eligibilityRequirementText: 'Minor party holding 1–14 total state legislative seats.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const counts = game.stateHouseSeatCounts || {};
      let totalSeats = 0;
      for (const st in counts) {
        totalSeats += counts[st]?.[pid] || 0;
      }
      return isMinor && totalSeats >= 1 && totalSeats <= 14;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const counts = outcome?.stateHouseSeatCounts || game.stateHouseSeatCounts || {};
      let totalSeats = 0;
      for (const st in counts) {
        totalSeats += counts[st]?.[pid] || 0;
      }
      return totalSeats >= 15;
    },
  },
  {
    id: 'carve-regional-bastion',
    name: 'Carve Out a Regional Bastion',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: '+10,000 registered voters in the state with your highest percentage of voters.',
    rewardText: '+8 Member Happiness; triggers regional momentum snowball and lifts regional Duverger floor.',
    description: 'Win >= 20.0% of the vote in any state (Pres/Sen/Gov) and hold >= 5 state legislative seats there.',
    eligibilityRequirementText: 'Minor party < 10% nationally; no state >= 20% yet.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const nationalShare = game.nationalPollShare || (game.player?.baseShare || 0);
      return isMinor && nationalShare < 10.0;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const stateVotes = outcome?.stateVoteShares || outcome?.popularVoteByState || {};
      const counts = outcome?.stateHouseSeatCounts || game.stateHouseSeatCounts || {};
      for (const st of STATES) {
        const vote = stateVotes[st.id]?.[pid] || 0;
        const seats = counts[st.id]?.[pid] || 0;
        if (vote >= 20.0 && seats >= 5) return true;
      }
      return false;
    },
  },
  {
    id: 'break-the-duopoly-reform',
    name: 'Break the Duopoly (Electoral Reform)',
    difficulty: 'Hard',
    happinessReward: 10,
    acceptanceBonusText: '+3 Independents Trust immediately.',
    rewardText: '+10 Member Happiness; boosts future electoral-reform momentum nationwide.',
    description: 'Enact RCV, Approval, or Proportional Representation in at least 1 new state.',
    eligibilityRequirementText: 'Minor party; < 5 states currently use RCV/Approval/PR.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const reformStates = Object.values(game.stateElectoralSystems || {}).filter((sys) => sys && sys !== 'fptp').length;
      return isMinor && reformStates < 5;
    },
    checkCompletion: (game, outcome) => {
      const startCount = game.priorities?.startingReformStateCount ?? 0;
      const currentCount = Object.values(game.stateElectoralSystems || {}).filter((sys) => sys && sys !== 'fptp').length;
      return currentCount > startCount;
    },
  },
  {
    id: 'become-the-kingmaker',
    name: 'Become the Kingmaker',
    difficulty: 'Hard',
    happinessReward: 12,
    acceptanceBonusText: '+2.0% lift in your top 5 closest House / State Leg races.',
    rewardText: '+12 Member Happiness; grants +1 extra concession during Confidence-and-Supply bargaining.',
    description: 'Hold the balance of power in a hung U.S. House, hung U.S. Senate, or >= 2 hung State Chambers.',
    eligibilityRequirementText: 'Minor party; < 50 House seats and < 15 Senate seats.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      const houseSeats = game.seats || 0;
      return isMinor && houseSeats < 50 && senateSeats < 15;
    },
    checkCompletion: (game, outcome) => {
      return Boolean(outcome?.isHungHouse || outcome?.isHungSenate || (outcome?.hungStateChambersCount || 0) >= 2 || game.isHungHouse || game.isHungSenate);
    },
  },
  {
    id: 'poach-sitting-lawmaker',
    name: 'Poach a Sitting Lawmaker',
    difficulty: 'Hard',
    happinessReward: 10,
    acceptanceBonusText: 'Loosens the Party Happiness courting gate by +8 points this cycle (<= 48 instead of <= 40).',
    rewardText: '+10 Member Happiness; +25,000 registered voters in the defector\'s state; +2.0% Unified Party Approval.',
    description: 'Successfully court a sitting U.S. Rep, Senator, or Governor to switch parties.',
    eligibilityRequirementText: 'Minor party at >= Tier 2 (Emerging / Ballot-Qualified) with 0 Senators and < 5 House seats.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const tier = game.partyTiers?.[pid]?.tier ?? game.playerTier ?? 1;
      const sitting = game.sittingMembers || [];
      const senateSeats = sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.caucus === pid)).length;
      const houseSeats = game.seats || 0;
      return tier >= 2 && senateSeats === 0 && houseSeats < 5;
    },
    checkCompletion: (game, outcome) => {
      return (game.poachedLawmakersThisCycle || 0) >= 1;
    },
  },
  {
    id: 'win-first-electoral-votes',
    name: 'Win Your First Electoral Votes',
    difficulty: 'Hard',
    happinessReward: 15,
    acceptanceBonusText: '+2.0% presidential lift in the state with your highest percentage of voters.',
    rewardText: '+15 Member Happiness; +100,000 registered voters in winning state/region; removes regional "wasted vote" drag.',
    description: 'Win >= 1 Electoral College vote in the presidential election.',
    eligibilityRequirementText: 'Minor party; 0 historical EVs; Presidential year.',
    isContextual: true,
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const histEVs = game.historicalElectoralVotesWon || 0;
      return isPresYear && isMinor && histEVs === 0;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      return (outcome?.ev?.[pid] || 0) >= 1;
    },
  },
  {
    id: 'force-12th-amendment-deadlock',
    name: 'Force a 12th Amendment Deadlock',
    difficulty: 'Insane',
    happinessReward: 20,
    acceptanceBonusText: '+1.5% lift in top 3 battleground states.',
    rewardText: '+20 Member Happiness; maximum Contingent Election brokering leverage (Cabinet + reform concessions).',
    description: 'Prevent both major parties from reaching 270 EVs, forcing a Contingent Election.',
    eligibilityRequirementText: 'Minor party with >= 10% national polling; Presidential year.',
    isContextual: true,
    checkEligibility: (game) => {
      const isPresYear = (game.year || 2028) % 4 === 0;
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const poll = game.nationalPollShare || (game.player?.baseShare || 0);
      return isPresYear && isMinor && poll >= 10.0;
    },
    checkCompletion: (game, outcome) => {
      const demEV = outcome?.ev?.people || 0;
      const gopEV = outcome?.ev?.heritage || 0;
      return Boolean(outcome?.contingentElectionTriggered || (demEV < 270 && gopEV < 270 && (outcome?.totalEVs || 538) === 538));
    },
  },
  {
    id: 'overtake-major-party',
    name: 'Overtake a Major Party (Finish 2nd)',
    difficulty: 'Insane',
    happinessReward: 25,
    acceptanceBonusText: 'None',
    rewardText: '+25 Member Happiness; immediate Tier 5 Major Party promotion; shifts 15% of the overtaken party\'s voter base.',
    description: 'Beat either Democrats or Republicans in national popular vote (Presidential or House Generic).',
    eligibilityRequirementText: 'Minor party ranked 3rd or lower nationally.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      return !['people', 'heritage'].includes(pid);
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const myVote = outcome?.presidentialPopularVoteShare?.[pid] ?? outcome?.popularVoteShare?.[pid] ?? 0;
      const demVote = outcome?.presidentialPopularVoteShare?.people ?? outcome?.popularVoteShare?.people ?? 0;
      const gopVote = outcome?.presidentialPopularVoteShare?.heritage ?? outcome?.popularVoteShare?.heritage ?? 0;
      return (myVote > demVote || myVote > gopVote);
    },
  },
  {
    id: 'survive-big-tent-crossroads',
    name: 'Survive the Big-Tent Crossroads',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: '+5 Founding Faction Happiness immediately.',
    rewardText: '+8 Member Happiness; permanently lowers platform-broadening backlash (-20%).',
    description: 'Hit >= 10% national vote while keeping Founding Faction happiness >= 60 (zero purist bolt).',
    eligibilityRequirementText: 'Minor party nearing Big-Tent Inflection Point.',
    isContextual: true,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMinor = !['people', 'heritage'].includes(pid);
      const poll = game.nationalPollShare || (game.player?.baseShare || 0);
      return isMinor && poll >= 6.0;
    },
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const myVote = outcome?.presidentialPopularVoteShare?.[pid] ?? outcome?.popularVoteShare?.[pid] ?? 0;
      const foundingFactions = (game.factions || []).filter((f) => (game.identityCrisis?.foundingFactionIds || []).includes(f.id) || f.status === 'leading');
      const minFoundingHap = foundingFactions.length ? Math.min(...foundingFactions.map((f) => f.happiness ?? 70)) : 70;
      return myVote >= 10.0 && minFoundingHap >= 60 && !game.puristFactionBolted;
    },
  },
  {
    id: 'turnout-engine',
    name: 'Turnout Engine',
    difficulty: 'Medium',
    happinessReward: 5,
    acceptanceBonusText: '+2 Happiness to all active party factions immediately.',
    rewardText: '+5 Member Happiness; +2.0% national base turnout lift on Election Night.',
    description: 'Keep every active party faction at >= 65 Happiness through Election Day.',
    eligibilityRequirementText: 'Open to all parties.',
    isContextual: false,
    checkEligibility: () => true,
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const myFactions = (game.factions || []).filter((f) => f.partyId === pid);
      return myFactions.length > 0 && myFactions.every((f) => (f.happiness ?? 0) >= 65);
    },
  },
  {
    id: 'build-up-the-bench',
    name: 'Build Up the Bench',
    difficulty: 'Medium',
    happinessReward: 5,
    acceptanceBonusText: '+4 Fame to your top 3 newly recruited nominees.',
    rewardText: '+5 Member Happiness; +25,000 new registered voters nationwide.',
    description: 'Field and elect >= 3 Rising Star (or Fame >= 70) nominees on Election Night.',
    eligibilityRequirementText: 'Open to all parties.',
    isContextual: false,
    checkEligibility: () => true,
    checkCompletion: (game, outcome) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const newlyElected = (outcome?.electedCandidates || []).filter((c) => (c.party === pid || c.caucus === pid) && ((c.traits || []).includes('Rising Star') || (c.fame || 0) >= 70));
      return newlyElected.length >= 3;
    },
  },
  {
    id: 'crack-opponent-stronghold',
    name: 'Crack an Opponent Stronghold',
    difficulty: 'Hard',
    happinessReward: 10,
    acceptanceBonusText: '+3.0% persuasion in that selected state/district for the cycle.',
    rewardText: '+10 Member Happiness; permanently shifts that state/district baseline partisan lean +1.5 points toward your party.',
    description: 'Win a federal (House/Senate) or gubernatorial race in a contested state or district with >= +5 hostile partisan lean.',
    eligibilityRequirementText: 'Party controls >= 1 federal seat (House/Senate) or >= 1 Governor\'s mansion, and contests at least one state or congressional district with >= +5 hostile lean.',
    isContextual: true,
    isTargetable: true,
    minHostileLean: 5.0,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const sitting = game.sittingMembers || [];
      const seats = sitting.filter((m) => (m.party === pid || m.caucus === pid) && ['house', 'senate', 'governor'].includes(m.office)).length;
      if (seats < 1) return false;
      return STATES.some((st) => Math.abs(st.basePartisanLean || st.partisanLean || 0) >= 5.0);
    },
    checkCompletion: (game, outcome) => {
      const targetId = game.priorities?.targetStateId || game.priorities?.targetScope || 'OH';
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const wonInTarget = (outcome?.electedCandidates || []).some((c) => (c.party === pid || c.caucus === pid) && (c.stateId === targetId || c.state === targetId));
      return Boolean(wonInTarget);
    },
  },
  {
    id: 'crack-opponents-fortress',
    name: 'Crack an Opponent\'s Fortress',
    difficulty: 'Insane',
    happinessReward: 20,
    acceptanceBonusText: '+3.0% persuasion in that selected state/district for the cycle.',
    rewardText: '+20 Member Happiness; permanently shifts that state/district baseline partisan lean +2.5 points toward your party.',
    description: 'Win a federal (House/Senate) or gubernatorial race in a contested state or district with >= +10 hostile partisan lean.',
    eligibilityRequirementText: 'Party controls >= 1 federal seat (House/Senate) or >= 1 Governor\'s mansion, and contests at least one state or congressional district with >= +10 hostile lean.',
    isContextual: true,
    isTargetable: true,
    minHostileLean: 10.0,
    checkEligibility: (game) => {
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const sitting = game.sittingMembers || [];
      const seats = sitting.filter((m) => (m.party === pid || m.caucus === pid) && ['house', 'senate', 'governor'].includes(m.office)).length;
      if (seats < 1) return false;
      return STATES.some((st) => Math.abs(st.basePartisanLean || st.partisanLean || 0) >= 10.0);
    },
    checkCompletion: (game, outcome) => {
      const targetId = game.priorities?.targetStateId || game.priorities?.targetScope || 'WY';
      const pid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const wonInTarget = (outcome?.electedCandidates || []).some((c) => (c.party === pid || c.caucus === pid) && (c.stateId === targetId || c.state === targetId));
      return Boolean(wonInTarget);
    },
  },
  // =========================================================================
  // VERSION 0.16.2 CLUSTER G: CUSTOM-PARTY-EXCLUSIVE PRIORITIES (REQ-243 - REQ-244)
  // =========================================================================
  {
    id: 'beat-sophomore-slump',
    name: 'Beat the Sophomore Slump',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: 'All recruited nominees this cycle gain a modest Fame head start (+5 Fame).',
    rewardText: '+8 Member Happiness; all sitting officeholders gain +5 Fame.',
    description: 'End Election Night holding at least as many total offices as the debut cycle and keep founding coalition faction happiness >= 60.',
    eligibilityRequirementText: 'Custom party entering its second election cycle after a debut cycle that won >= 1 office.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      const isCustom = Boolean(game.player?.custom);
      const cycle = game.cycleNumber || Math.round(((game.year || 2028) - 2028) / 2) + 1;
      const debutOffices = game.customPriorityTracking?.debutOfficesCount || (game.sittingMembers || []).filter((m) => m.party === 'player').length;
      return isCustom && cycle === 2 && debutOffices >= 1;
    },
    checkCompletion: (game, outcome) => {
      const pid = 'player';
      const sitting = game.sittingMembers || [];
      const currentOffices = sitting.filter((m) => m.party === pid).length;
      const debutOffices = game.customPriorityTracking?.debutOfficesCount || 1;
      const foundingFactions = (game.factions || []).filter((f) => f.partyId === pid && (f.status === 'leading' || (game.identityCrisis?.foundingFactionIds || []).includes(f.id)));
      const minHap = foundingFactions.length ? Math.min(...foundingFactions.map((f) => f.happiness ?? 70)) : 70;
      return currentOffices >= debutOffices && minHap >= 60;
    },
  },
  {
    id: 'seal-the-merger',
    name: 'Seal the Merger',
    difficulty: 'Hard',
    happinessReward: 12,
    acceptanceBonusText: 'Convening the merging factions at a summit carries no happiness penalty this cycle.',
    rewardText: '+12 Member Happiness; merger grudge noise against the party quiets early.',
    description: 'Complete the founding cycle with zero merged factions below chronic-dissatisfaction thresholds (Happiness >= 35) and zero bolts.',
    eligibilityRequirementText: 'Custom party created via Minor-Party Merger, first full cycle after founding.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      const isCustom = Boolean(game.player?.custom);
      const hasMerger = (game.dissolvedParties || []).length > 0;
      const cycle = game.cycleNumber || Math.round(((game.year || 2028) - 2028) / 2) + 1;
      return isCustom && hasMerger && cycle <= 2;
    },
    checkCompletion: (game, outcome) => {
      const pid = 'player';
      const mergedFactions = (game.factions || []).filter((f) => f.partyId === pid);
      return mergedFactions.every((f) => (f.happiness ?? 0) >= 35) && !game.factionBoltedThisCycle;
    },
  },
  {
    id: 'outpoll-former-home',
    name: 'Outpoll Your Former Home',
    difficulty: 'Hard',
    happinessReward: 15,
    acceptanceBonusText: 'Modest persuasion lift in the parent party\'s historically strongest states (+2.0%).',
    rewardText: '+15 Member Happiness; a visible slice of the parent party\'s voters migrate to your movement.',
    description: 'Finish ahead of the parent party in national popular vote (Presidential or House Generic).',
    eligibilityRequirementText: 'Custom party spawned via Major-Party Schism, any cycle after founding.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      return Boolean(game.player?.custom && game.player?.customOrigin === 'major_schism' && game.player?.schismParentPartyId);
    },
    checkCompletion: (game, outcome) => {
      const pid = 'player';
      const parentId = game.player?.schismParentPartyId || 'people';
      const myVote = outcome?.presidentialPopularVoteShare?.[pid] ?? outcome?.popularVoteShare?.[pid] ?? 0;
      const parentVote = outcome?.presidentialPopularVoteShare?.[parentId] ?? outcome?.popularVoteShare?.[parentId] ?? 0;
      return myVote > parentVote;
    },
  },
  {
    id: 'survive-the-founder',
    name: 'Survive the Founder',
    difficulty: 'Hard',
    happinessReward: 15,
    acceptanceBonusText: 'Modest immediate standing lift for the faction aligned with the chosen succession path (+8 Confidence).',
    rewardText: '+15 Member Happiness; the chosen succession path\'s benefits lock in permanently as party DNA.',
    description: 'Hold every faction above chronic-dissatisfaction thresholds (Happiness >= 35) and hold at least debut-cycle office count on the first Election Night after succession.',
    eligibilityRequirementText: 'First cycle after the "Survive the Founder" First Succession Crisis.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      return Boolean(game.player?.custom && game.founderLegacy?.postSuccessionCyclePending);
    },
    checkCompletion: (game, outcome) => {
      const pid = 'player';
      const factions = (game.factions || []).filter((f) => f.partyId === pid);
      const okFactions = factions.every((f) => (f.happiness ?? 0) >= 35);
      const baselineSeats = game.founderLegacy?.preSuccessionBaseline?.seats || 0;
      const currentSeats = (game.sittingMembers || []).filter((m) => m.party === pid).length;
      return okFactions && currentSeats >= baselineSeats;
    },
  },
  {
    id: 'prove-not-a-spoiler',
    name: 'Prove You\'re Not a Spoiler',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: 'Modest polling credibility lift in the previously spoiled state/district (+2.0%).',
    rewardText: '+8 Member Happiness; regional "wasted vote" drag permanently removed.',
    description: 'Win at least one race outright that the party previously spoiled.',
    eligibilityRequirementText: 'Custom party whose prior-cycle votes exceeded a losing ideological rival\'s margin in at least one race.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      return Boolean(game.player?.custom && (game.customPriorityTracking?.hasSpoiledRace || (game.lastElection?.spoiledRacesCount || 0) > 0));
    },
    checkCompletion: (game, outcome) => {
      const pid = 'player';
      const wonSpoiled = (outcome?.electedCandidates || []).some((c) => (c.party === pid || c.caucus === pid) && (game.customPriorityTracking?.spoiledRaceIds || []).includes(c.raceId || c.id));
      return wonSpoiled || (outcome?.electedCandidates || []).some((c) => c.party === pid);
    },
  },
  {
    id: 'build-home-state-fortress',
    name: 'Build a Home-State Fortress',
    difficulty: 'Hard',
    happinessReward: 12,
    acceptanceBonusText: 'Organizing actions in the home state yield amplified volunteer returns this cycle (+25%).',
    rewardText: '+12 Member Happiness; permanent home-state baseline partisan lean shift +2.0 points toward your party.',
    description: 'Win a major-share statewide vote in the founder\'s home state and control a state legislative chamber there.',
    eligibilityRequirementText: 'Custom party holding >= 1 office in the Founder\'s home state.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      const isCustom = Boolean(game.player?.custom);
      const homeState = game.player?.foundingStateId || 'PA';
      const sitting = game.sittingMembers || [];
      const hasOffice = sitting.some((m) => m.party === 'player' && (m.stateId === homeState || m.state === homeState));
      return isCustom && hasOffice;
    },
    checkCompletion: (game, outcome) => {
      const homeState = game.player?.foundingStateId || 'PA';
      const pid = 'player';
      const homeVote = outcome?.stateVoteShares?.[homeState]?.[pid] ?? outcome?.popularVoteByState?.[homeState]?.[pid] ?? 0;
      const chambers = outcome?.stateLegislatures?.[homeState] || game.stateLegislatures?.[homeState] || [];
      const holdsChamber = Array.isArray(chambers) && chambers.includes(pid);
      return homeVote >= 25.0 && holdsChamber;
    },
  },
  {
    id: 'silence-sellout-critics',
    name: 'Silence the "Sellout" Critics',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: 'Grudge-driven media snipes soften immediately upon quest acceptance.',
    rewardText: '+8 Member Happiness; the "Sellout Grudge" clears permanently.',
    description: 'Rehome or formally reconcile every grudge-carrying faction by cycle\'s end.',
    eligibilityRequirementText: 'Active "Sellout Grudge" factions from a merger still seeking a party home.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      const isCustom = Boolean(game.player?.custom);
      const hasGrudge = (game.factions || []).some((f) => f.seekingPartyHome && f.selloutGrudge?.active);
      return isCustom && hasGrudge;
    },
    checkCompletion: (game, outcome) => {
      const activeGrudges = (game.factions || []).filter((f) => f.seekingPartyHome && f.selloutGrudge?.active);
      return activeGrudges.length === 0;
    },
  },
  {
    id: 'forge-unlikely-alliance',
    name: 'Forge an Unlikely Alliance',
    difficulty: 'Hard',
    happinessReward: 12,
    acceptanceBonusText: 'Modest negotiation leverage lift entering coalition talks.',
    rewardText: '+12 Member Happiness; +1 extra concession during future bargaining sessions.',
    description: 'Extract and execute a formal Confidence-and-Supply or coalition agreement delivering at least one enacted policy concession.',
    eligibilityRequirementText: 'Custom party holding balance of power in a hung federal or state chamber.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      return Boolean(game.player?.custom && (game.isHungHouse || game.isHungSenate || (game.hungStateChambersCount || 0) > 0));
    },
    checkCompletion: (game, outcome) => {
      return (game.coalitionConcessionsWonThisCycle || 0) >= 1;
    },
  },
  {
    id: 'homegrown-bench',
    name: 'Homegrown Bench',
    difficulty: 'Medium',
    happinessReward: 8,
    acceptanceBonusText: 'Farm team standouts season faster this cycle (accelerated Fame and Quality gains).',
    rewardText: '+8 Member Happiness; promoted lawmakers gain +5 Fame; farm team spawns +1 extra standout next cycle.',
    description: 'Promote >= 2 homegrown statehouse standouts to federal or gubernatorial office by Election Night.',
    eligibilityRequirementText: 'Custom party with >= 1 sitting stateLeg standout.',
    customOnly: true,
    isContextual: true,
    checkEligibility: (game) => {
      const isCustom = Boolean(game.player?.custom);
      const standouts = game.stateLegStandouts?.player || (game.sittingMembers || []).filter((m) => m.office === 'stateLeg' && m.party === 'player');
      return isCustom && standouts.length >= 1;
    },
    checkCompletion: (game, outcome) => {
      return (game.customPriorityTracking?.promotedStandoutsCount || 0) >= 2;
    },
  },
];

const POLITICIAN_TRAITS = [
  'Rising Star',
  'Established politician',
  'Corrupt',
  'Squeaky Clean',
  'Polished',
  'Rough',
  'Disciplined',
  'Undisciplined',
];


// ============================================================================
// VERSION 0.16.5: BICAMERAL STATE LEGISLATIVE SLATE ENGINE & CALENDAR (99 CHAMBERS)
// ============================================================================
const SLATE_TIER_MATRIX = {
  0: { tier: 0, actionCost: 0, voteCap: 0, turnoutPenalty: 1.0, effectiveTurnout: 0.0, label: 'Uncontested' },
  1: { tier: 1, actionCost: 1, voteCap: 20, turnoutPenalty: 0.70, effectiveTurnout: 0.30, label: 'Token Foothold' },
  2: { tier: 2, actionCost: 2, voteCap: 40, turnoutPenalty: 0.50, effectiveTurnout: 0.50, label: 'Targeted Districts' },
  3: { tier: 3, actionCost: 3, voteCap: 60, turnoutPenalty: 0.30, effectiveTurnout: 0.70, label: 'Competitive Bench' },
  4: { tier: 4, actionCost: 4, voteCap: 80, turnoutPenalty: 0.10, effectiveTurnout: 0.90, label: 'Broad Statewide Ticket' },
  5: { tier: 5, actionCost: 5, voteCap: 100, turnoutPenalty: 0.00, effectiveTurnout: 1.00, label: 'Full Chamber Slate' },
};

const SLATE_COATTAIL_BY_PARTY_TIER = {
  0: 0.25,
  1: 0.50,
  2: 1.00,
  3: 1.50,
  4: 2.50,
  5: 2.50,
};

const MIDTERM_CONSOLIDATED_HOUSE_STATES = ['LA', 'MS', 'NJ', 'VA'];

// Authentic 50-State Senate Calendar (Groups A, B, C, D with Midterm consolidation for LA, MS, NJ, VA)
const BICAMERAL_STATE_SENATE_CALENDAR = {
  // Group A: 2-Year Senate Terms (12 states — 100% up every cycle)
  AZ: { group: 'A', total: 30, presUp: 30, midUp: 30 },
  CT: { group: 'A', total: 36, presUp: 36, midUp: 36 },
  GA: { group: 'A', total: 56, presUp: 56, midUp: 56 },
  ID: { group: 'A', total: 35, presUp: 35, midUp: 35 },
  ME: { group: 'A', total: 35, presUp: 35, midUp: 35 },
  MA: { group: 'A', total: 40, presUp: 40, midUp: 40 },
  NH: { group: 'A', total: 24, presUp: 24, midUp: 24 },
  NY: { group: 'A', total: 63, presUp: 63, midUp: 63 },
  NC: { group: 'A', total: 50, presUp: 50, midUp: 50 },
  RI: { group: 'A', total: 38, presUp: 38, midUp: 38 },
  SD: { group: 'A', total: 35, presUp: 35, midUp: 35 },
  VT: { group: 'A', total: 30, presUp: 30, midUp: 30 },
  // Group B: Staggered 4-Year Terms (27 states + NE Unicameral — ~50% up each cycle)
  AK: { group: 'B', total: 20, presUp: 10, midUp: 10 },
  AR: { group: 'B', total: 35, presUp: 17, midUp: 18 },
  CA: { group: 'B', total: 40, presUp: 20, midUp: 20 },
  CO: { group: 'B', total: 35, presUp: 18, midUp: 17 },
  DE: { group: 'B', total: 21, presUp: 10, midUp: 11 },
  FL: { group: 'B', total: 40, presUp: 20, midUp: 20 },
  HI: { group: 'B', total: 25, presUp: 12, midUp: 13 },
  IL: { group: 'B', total: 59, presUp: 20, midUp: 39 },
  IN: { group: 'B', total: 50, presUp: 25, midUp: 25 },
  IA: { group: 'B', total: 50, presUp: 25, midUp: 25 },
  KY: { group: 'B', total: 38, presUp: 19, midUp: 19 },
  MO: { group: 'B', total: 34, presUp: 17, midUp: 17 },
  MT: { group: 'B', total: 50, presUp: 25, midUp: 25 },
  NE: { group: 'B', total: 49, presUp: 25, midUp: 24, unicameral: true },
  NV: { group: 'B', total: 21, presUp: 10, midUp: 11 },
  ND: { group: 'B', total: 47, presUp: 24, midUp: 23 },
  OH: { group: 'B', total: 33, presUp: 16, midUp: 17 },
  OK: { group: 'B', total: 48, presUp: 24, midUp: 24 },
  OR: { group: 'B', total: 30, presUp: 15, midUp: 15 },
  PA: { group: 'B', total: 50, presUp: 25, midUp: 25 },
  TN: { group: 'B', total: 33, presUp: 16, midUp: 17 },
  TX: { group: 'B', total: 31, presUp: 15, midUp: 16 },
  UT: { group: 'B', total: 29, presUp: 14, midUp: 15 },
  WA: { group: 'B', total: 49, presUp: 24, midUp: 25 },
  WV: { group: 'B', total: 34, presUp: 17, midUp: 17 },
  WI: { group: 'B', total: 33, presUp: 16, midUp: 17 },
  WY: { group: 'B', total: 31, presUp: 15, midUp: 16 },
  // Group C: Presidential Quadrennial (3 states — 100% Pres, 0% Midterm)
  KS: { group: 'C', total: 40, presUp: 40, midUp: 0 },
  NM: { group: 'C', total: 42, presUp: 42, midUp: 0 },
  SC: { group: 'C', total: 46, presUp: 46, midUp: 0 },
  // Group D: Midterm Quadrennial (8 states — 0% Pres, 100% Midterm, incl. consolidated LA/MS/NJ/VA)
  AL: { group: 'D', total: 35, presUp: 0, midUp: 35 },
  MD: { group: 'D', total: 47, presUp: 0, midUp: 47 },
  MI: { group: 'D', total: 38, presUp: 0, midUp: 38 },
  MN: { group: 'D', total: 67, presUp: 0, midUp: 67 },
  LA: { group: 'D', total: 39, presUp: 0, midUp: 39 },
  MS: { group: 'D', total: 52, presUp: 0, midUp: 52 },
  NJ: { group: 'D', total: 40, presUp: 0, midUp: 40 },
  VA: { group: 'D', total: 40, presUp: 0, midUp: 40 },
};

function getBicameralChambersForYear(year = 2028) {
  const isPresYear = (Number(year) % 4 === 0);
  const nextYear = Number(year) + 2;
  const statesList = FIFTY_US_STATES_FOR_PRIORITIES;
  const chambers = [];
  statesList.forEach((st) => {
    const sen = BICAMERAL_STATE_SENATE_CALENDAR[st.id] || { group: 'B', total: 40, presUp: 20, midUp: 20 };
    if (st.id === 'NE') {
      const up = isPresYear ? sen.presUp : sen.midUp;
      chambers.push({
        id: 'NE:unicameral',
        stateId: 'NE',
        stateName: 'Nebraska',
        chamber: 'unicameral',
        label: 'Nebraska Unicameral Legislature',
        totalSeats: sen.total,
        seatsUp: up,
        isOnCycle: up > 0,
        nextElectionYear: up > 0 ? Number(year) : nextYear,
        calendarGroup: sen.group,
      });
      return;
    }
    // State House (49 chambers; 46 every even year, LA/MS/NJ/VA consolidated into Midterms)
    const houseOnCycle = MIDTERM_CONSOLIDATED_HOUSE_STATES.includes(st.id) ? !isPresYear : true;
    const houseTotal = (typeof window !== 'undefined' && window.PartyChairData?.VERSION_05_STATE_HOUSE_SEATS?.states?.[st.id]?.total) || 100;
    chambers.push({
      id: `${st.id}:house`,
      stateId: st.id,
      stateName: st.name,
      chamber: 'house',
      label: `${st.name} State House`,
      totalSeats: houseTotal,
      seatsUp: houseOnCycle ? houseTotal : 0,
      isOnCycle: houseOnCycle,
      nextElectionYear: houseOnCycle ? Number(year) : nextYear,
      calendarGroup: MIDTERM_CONSOLIDATED_HOUSE_STATES.includes(st.id) ? 'D' : 'A',
    });
    // State Senate (49 chambers)
    const senUp = isPresYear ? sen.presUp : sen.midUp;
    chambers.push({
      id: `${st.id}:senate`,
      stateId: st.id,
      stateName: st.name,
      chamber: 'senate',
      label: `${st.name} State Senate`,
      totalSeats: sen.total,
      seatsUp: senUp,
      isOnCycle: senUp > 0,
      nextElectionYear: senUp > 0 ? Number(year) : nextYear,
      calendarGroup: sen.group,
    });
  });
  return chambers;
}

const INSTITUTIONAL_TIERS = [
  {
    tier: 0,
    id: 'extremist',
    name: 'Extremist Movement',
    shortLabel: 'Extremist',
    maxFocusSlots: 1,
    badgeColor: '#b91c1c',
    description: 'Operating on the ideological periphery under intense civic stigma, radioactive ballot scrutiny, and severe media hostility.',
    nextRequirement: 'Reach 350,000 registered voters nationwide, win 3 state legislative seats, or qualify on 5 state ballots to become a recognized Fringe Party.',
  },
  {
    tier: 1,
    id: 'fringe',
    name: 'Fringe Party',
    shortLabel: 'Fringe',
    maxFocusSlots: 3,
    badgeColor: '#6b7280',
    description: 'Operating outside national broadcast coverage with limited ballot lines and steep uphill organizing.',
    nextRequirement: 'Reach 2% national presidential vote or secure full ballot access in 10+ states to become Ballot-Qualified.',
  },
  {
    tier: 2,
    id: 'ballot_qualified',
    name: 'Ballot-Qualified Minor',
    shortLabel: 'Ballot-Qualified',
    maxFocusSlots: 3,
    badgeColor: '#0284c7',
    description: 'Established multi-state ballot lines unlock Regional Chapter Momentum waves and Fusion cross-endorsement deals.',
    nextRequirement: 'Win 5% national presidential popular vote to earn Federal Recognition, FEC Matching Funds, and 5 Focus Slots.',
  },
  {
    tier: 3,
    id: 'federally_recognized',
    name: 'Federally Recognized Party',
    shortLabel: 'Recognized',
    maxFocusSlots: 5,
    badgeColor: '#7c3aed',
    description: 'Qualifies for passive FEC Public Matching Funds, automatic state ballot retention, and 5 strategic Party Focus slots.',
    nextRequirement: 'Reach 15% in national polling or presidential vote to break the media blackout and qualify for the Debate Stage.',
  },
  {
    tier: 4,
    id: 'debate_contender',
    name: 'Debate-Qualified Contender',
    shortLabel: 'Contender',
    maxFocusSlots: 5,
    badgeColor: '#d97706',
    description: 'Shatters the national broadcast blackout, qualifies for the Presidential Debate Stage, and unlocks fledgling allied Super PACs.',
    nextRequirement: 'Win 20% presidential vote, hold 35 House / 8 Senate / 5 Governor seats, or eclipse a major party to reach Major Party Status.',
  },
  {
    tier: 5,
    id: 'major_party',
    name: 'Major Party',
    shortLabel: 'Major',
    maxFocusSlots: 7,
    badgeColor: '#059669',
    description: 'Full national institutional parity with 7 strategic Party Focus slots, unrestricted Super PAC coordination, and immunity to wasted-vote squeezes.',
    nextRequirement: 'Maximum institutional standing achieved.',
  },
];

const PRESIDENTIAL_DEBATE_STAGE_EVENT = {
  id: 'presidential-debate-stage-breakthrough',
  title: 'The National Debate Stage',
  body: 'After crossing 15% in national polling, the bipartisan debate commission is forced to add a third podium under prime-time lights. Seventy million households are tuning in—this single broadcast can transform your movement into a permanent national force.',
  severity: 'milestone',
  targetType: 'national',
  isMilestone: true,
  choices: [
    {
      label: 'Deliver a sweeping populist indictment of both establishments',
      effect: 'Ignites grassroots momentum (+3.0 national mood, +$5M small-donor surge, +18 volunteer memberships, +2.0 wave momentum).',
      budget: 5,
      polling: 3.0,
      membership: 18,
      trust: { supporters: 4, independents: 2.5, opponents: 0 },
      waveMomentum: 2.0,
      voterSurge: 2500,
    },
    {
      label: 'Project presidential command and bipartisan problem-solving',
      effect: 'Wins undecided suburban households (+2.2 national mood, +$7M donor surge, +12 memberships, +4.5 Independent Trust).',
      budget: 7,
      polling: 2.2,
      membership: 12,
      trust: { supporters: 1.5, independents: 4.5, opponents: 2.0 },
      waveMomentum: 1.6,
      voterSurge: 2000,
    },
    {
      label: 'Spotlight down-ballot challengers and state-by-state organizing',
      effect: 'Converts airtime into durable field infrastructure (+$4M, +24 volunteer memberships, +3,500 registered voters in battlegrounds).',
      budget: 4,
      polling: 1.8,
      membership: 24,
      trust: { supporters: 3, independents: 2, opponents: 0.5 },
      waveMomentum: 1.4,
      voterSurge: 3500,
    },
  ],
};

const FLEDGLING_SUPER_PAC_TEMPLATES = {
  liberty: [
    { id: 'pac-fledgling-liberty-1', name: 'Free Citizen Action Fund', petIssueId: 'tax-policy', petIssueLabel: 'Tax Cuts & Fiscal Restraint', axis: 'economic', idealRange: [7, 10], initialPool: 7.5, weeklyIncome: 0.9, tagline: 'Independent classical-liberal donors buying airwaves for civil liberties and deregulation.' },
    { id: 'pac-fledgling-liberty-2', name: 'Constitutional Restraint PAC', petIssueId: 'civil-liberties', petIssueLabel: 'Civil Liberties & Privacy', axis: 'social', idealRange: [1, 4], initialPool: 6.0, weeklyIncome: 0.8, tagline: 'Backs anti-surveillance and limited-government challengers in competitive districts.' },
  ],
  green: [
    { id: 'pac-fledgling-green-1', name: 'Clean Future Grassroots PAC', petIssueId: 'climate-policy', petIssueLabel: 'Climate & Clean Energy', axis: 'climate', idealRange: [1, 3], initialPool: 7.5, weeklyIncome: 0.9, tagline: 'Crowdfunded environmental activists financing rapid-transition media blitzes.' },
    { id: 'pac-fledgling-green-2', name: 'Public Goods Coalition Fund', petIssueId: 'healthcare', petIssueLabel: 'Universal Healthcare', axis: 'economic', idealRange: [1, 3], initialPool: 6.0, weeklyIncome: 0.8, tagline: 'Channels small-dollar donor coalitions behind public healthcare and green transit.' },
  ],
  socialist: [
    { id: 'pac-fledgling-socialist-1', name: 'Solidarity Workers Action PAC', petIssueId: 'labor-rights', petIssueLabel: 'Labor & Union Power', axis: 'economic', idealRange: [1, 3], initialPool: 7.0, weeklyIncome: 0.9, tagline: 'Rank-and-file union solidarity fund amplifying anti-corporate working-class campaigns.' },
    { id: 'pac-fledgling-socialist-2', name: 'Housing & Healthcare Now Fund', petIssueId: 'healthcare', petIssueLabel: 'Universal Healthcare', axis: 'economic', idealRange: [1, 3], initialPool: 6.0, weeklyIncome: 0.8, tagline: 'Mobilizes tenant coalitions and young urban organizers into battleground media buys.' },
  ],
  constitution: [
    { id: 'pac-fledgling-constitution-1', name: 'Tenth Amendment Heritage Fund', petIssueId: 'immigration', petIssueLabel: 'Border Sovereignty', axis: 'social', idealRange: [8, 10], initialPool: 7.0, weeklyIncome: 0.9, tagline: 'Constitutional originalists backing strict border sovereignty and traditional values.' },
    { id: 'pac-fledgling-constitution-2', name: 'Faith & Republic Defense PAC', petIssueId: 'religious-liberty', petIssueLabel: 'Religious Liberty & Heritage', axis: 'social', idealRange: [8, 10], initialPool: 6.5, weeklyIncome: 0.8, tagline: 'Independent church-network backers rallying traditionalist turnout across heartland states.' },
  ],
  custom: [
    { id: 'pac-fledgling-custom-1', name: 'Independent Reform Citizens PAC', petIssueId: 'cost-of-living', petIssueLabel: 'Cost of Living & Reform', axis: 'economic', idealRange: [4, 7], initialPool: 8.0, weeklyIncome: 0.9, tagline: 'Civic reformers financing outsider campaigns once national polling breaks the blackout.' },
    { id: 'pac-fledgling-custom-2', name: 'New Coalition Victory Fund', petIssueId: 'campaign-finance', petIssueLabel: 'Democracy & Electoral Reform', axis: 'governance', idealRange: [4, 7], initialPool: 6.5, weeklyIncome: 0.8, tagline: 'Channels cross-partisan movement money into high-leverage battlegrounds.' },
  ],
};

const ELECTORAL_SYSTEM_DEFINITIONS = {
  plurality: {
    id: 'plurality',
    name: 'Plurality (First-Past-the-Post)',
    shortLabel: 'Plurality',
    antiSpoiler: false,
    description: 'Winner-take-all plurality rules where minor candidates below the local viability ceiling suffer tactical wasted-vote defection.',
  },
  rcv: {
    id: 'rcv',
    name: 'Ranked-Choice Voting',
    shortLabel: 'RCV',
    antiSpoiler: true,
    description: 'Instant-runoff ballots eliminate wasted-vote fear and transfer eliminated candidates’ votes to voters’ next preferences.',
  },
  approval: {
    id: 'approval',
    name: 'Approval Voting',
    shortLabel: 'Approval',
    antiSpoiler: true,
    description: 'Voters may approve as many compatible candidates as they support, eliminating spoiler penalties completely.',
  },
  proportional: {
    id: 'proportional',
    name: 'Proportional Representation',
    shortLabel: 'Proportional',
    antiSpoiler: true,
    description: 'Allocates U.S. House delegations and State Legislature seats proportionally to all parties crossing a 5% natural threshold.',
  },
};

const FUSION_POLICY_PLEDGES = [
  { id: 'pledge-electoral-reform', label: 'Ballot Access & Ranked-Choice Pledge', description: 'Commits the cross-endorsed nominee to back open ballot access and anti-spoiler electoral reforms.' },
  { id: 'pledge-civil-liberties', label: 'Constitutional Limits & Oversight Pledge', description: 'Binds the nominee to oppose warrantless surveillance, unfunded mandates, and executive overreach.' },
  { id: 'pledge-working-families', label: 'Working Families & Public Investment Pledge', description: 'Commits the nominee to champion domestic wages, clean infrastructure, and anti-monopoly enforcement.' },
  { id: 'pledge-fiscal-restraint', label: 'Balanced Budget & Local Autonomy Pledge', description: 'Binds the nominee to curb deficit spending and devolve regulatory power back to statehouses.' },
];

const MINOR_PARTY_FOUNDING_FACTIONS = {
  liberty: {
    foundingFactionIds: ['lib_true_libertarians', 'lib_ancaps'],
    puristVanguardFactionId: 'lib_ancaps',
    splinterName: 'Anarcho-Liberty Vanguard Party',
  },
  green: {
    foundingFactionIds: ['grn_eco_socialist_vanguard', 'grn_yimby'],
    puristVanguardFactionId: 'grn_eco_socialist_vanguard',
    splinterName: 'Eco-Socialist Purist Party',
  },
  socialist: {
    foundingFactionIds: ['soc_socialists', 'soc_communists'],
    puristVanguardFactionId: 'soc_communists',
    splinterName: 'Revolutionary Workers Vanguard',
  },
  constitution: {
    foundingFactionIds: ['con_christian_dominionists'],
    puristVanguardFactionId: 'con_christian_dominionists',
    splinterName: 'Covenant Restoration Party',
  },
};

const STATUTORY_BALLOT_RULES = {
  AL: { stateId: 'AL', signaturesRequired: 51000, filingDeadlineMonth: 'June', retentionThresholdPct: 20.0 },
  AK: { stateId: 'AK', signaturesRequired: 3600, filingDeadlineMonth: 'August', retentionThresholdPct: 3.0 },
  AZ: { stateId: 'AZ', signaturesRequired: 43000, filingDeadlineMonth: 'June', retentionThresholdPct: 5.0 },
  AR: { stateId: 'AR', signaturesRequired: 27000, filingDeadlineMonth: 'May', retentionThresholdPct: 3.0 },
  CA: { stateId: 'CA', signaturesRequired: 178000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
  CO: { stateId: 'CO', signaturesRequired: 1000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
  CT: { stateId: 'CT', signaturesRequired: 7500, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
  DE: { stateId: 'DE', signaturesRequired: 750, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
  DC: { stateId: 'DC', signaturesRequired: 4000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
  FL: { stateId: 'FL', signaturesRequired: 145000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
  GA: { stateId: 'GA', signaturesRequired: 50000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
  HI: { stateId: 'HI', signaturesRequired: 4000, filingDeadlineMonth: 'July', retentionThresholdPct: 2.0 },
  ID: { stateId: 'ID', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 3.0 },
  IL: { stateId: 'IL', signaturesRequired: 25000, filingDeadlineMonth: 'June', retentionThresholdPct: 5.0 },
  IN: { stateId: 'IN', signaturesRequired: 45000, filingDeadlineMonth: 'June', retentionThresholdPct: 2.0 },
  IA: { stateId: 'IA', signaturesRequired: 2500, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
  KS: { stateId: 'KS', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
  KY: { stateId: 'KY', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
  LA: { stateId: 'LA', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
  ME: { stateId: 'ME', signaturesRequired: 4000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
  MD: { stateId: 'MD', signaturesRequired: 10000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
  MA: { stateId: 'MA', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 3.0 },
  MI: { stateId: 'MI', signaturesRequired: 30000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
  MN: { stateId: 'MN', signaturesRequired: 2000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
  MS: { stateId: 'MS', signaturesRequired: 1000, filingDeadlineMonth: 'September', retentionThresholdPct: 1.0 },
  MO: { stateId: 'MO', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 2.0 },
  MT: { stateId: 'MT', signaturesRequired: 5000, filingDeadlineMonth: 'June', retentionThresholdPct: 5.0 },
  NE: { stateId: 'NE', signaturesRequired: 2500, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
  NV: { stateId: 'NV', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
  NH: { stateId: 'NH', signaturesRequired: 3000, filingDeadlineMonth: 'August', retentionThresholdPct: 4.0 },
  NJ: { stateId: 'NJ', signaturesRequired: 800, filingDeadlineMonth: 'June', retentionThresholdPct: 10.0 },
  NM: { stateId: 'NM', signaturesRequired: 3000, filingDeadlineMonth: 'June', retentionThresholdPct: 0.5 },
  NY: { stateId: 'NY', signaturesRequired: 45000, filingDeadlineMonth: 'May', retentionThresholdPct: 2.0, retentionVotes: 130000 },
  NC: { stateId: 'NC', signaturesRequired: 14000, filingDeadlineMonth: 'June', retentionThresholdPct: 2.0 },
  ND: { stateId: 'ND', signaturesRequired: 4000, filingDeadlineMonth: 'September', retentionThresholdPct: 5.0 },
  OH: { stateId: 'OH', signaturesRequired: 5000, filingDeadlineMonth: 'July', retentionThresholdPct: 3.0 },
  OK: { stateId: 'OK', signaturesRequired: 35000, filingDeadlineMonth: 'July', retentionThresholdPct: 2.5 },
  OR: { stateId: 'OR', signaturesRequired: 18000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.5 },
  PA: { stateId: 'PA', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
  RI: { stateId: 'RI', signaturesRequired: 1000, filingDeadlineMonth: 'September', retentionThresholdPct: 5.0 },
  SC: { stateId: 'SC', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 5.0 },
  SD: { stateId: 'SD', signaturesRequired: 3500, filingDeadlineMonth: 'June', retentionThresholdPct: 2.5 },
  TN: { stateId: 'TN', signaturesRequired: 275, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
  TX: { stateId: 'TX', signaturesRequired: 83000, filingDeadlineMonth: 'May', retentionThresholdPct: 5.0 },
  UT: { stateId: 'UT', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
  VT: { stateId: 'VT', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
  VA: { stateId: 'VA', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 10.0 },
  WA: { stateId: 'WA', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
  WV: { stateId: 'WV', signaturesRequired: 7000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
  WI: { stateId: 'WI', signaturesRequired: 2000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
  WY: { stateId: 'WY', signaturesRequired: 4000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
};

const STATE_VOTING_LAW_BILLS = [
  {
    id: 'strict-photo-id',
    name: 'Strict Photo Voter ID & Signature Match Mandate',
    shortName: 'Strict Photo ID',
    cost: 2,
    effect: 'Enforces strict government photo ID and signature match. Reduces youth & urban registration by -1.5%, increases conservative base trust (+4), and increases minor party petition hurdles by +20%.',
    signatureModifier: 1.20,
    regUrbanModifier: -0.015,
    regYouthModifier: -0.015,
    conservativeTrustBonus: 4,
  },
  {
    id: 'universal-vote-by-mail',
    name: 'Universal Vote-by-Mail & Automatic Registration',
    shortName: 'Vote-by-Mail',
    cost: 2,
    effect: 'Mails ballots to all registered voters and automates voter registration. Increases turnout by +2.5%, boosts youth registration by +3.0%, and halves minor-party petition costs (-50%).',
    turnoutModifier: 0.025,
    regYouthModifier: 0.03,
    petitionCostModifier: 0.50,
  },
  {
    id: 'early-voting-expansion',
    name: 'Early Voting Window & Drop-Box Expansion',
    shortName: 'Early Voting Window',
    cost: 2,
    effect: 'Expands early voting to 21 days with secure drop boxes. Increases working-class turnout by +1.8% and buffers against adverse Election-Day weather suppression.',
    workingClassTurnoutModifier: 0.018,
    weatherBuffer: true,
  },
];

// REQ-239: Party Origin Stories (5 Archetypes)
const CUSTOM_PARTY_ORIGINS = [
  {
    id: 'not_major_movement',
    name: 'Not a Major Movement',
    startingBudget: 25,
    upsides: 'Unlocks the Custom 100K Founding Faction Builder. Complete freedom to craft your movement’s identity, platform alignment, and state distribution from scratch.',
    downsides: 'Zero mechanical bonuses. Locks out all 36 catalog factions. Pure ground-up, hard-mode climb.',
  },
  {
    id: 'major_schism',
    name: 'Major-Party Schism',
    startingBudget: 25,
    requiresParent: true,
    upsides: 'Stronger poaching tolerance (+12 points) and halved recruitment costs against the parent party; +1 defector bench prospect.',
    downsides: 'Blood Rivalry: Zero Fusion Voting deals with the parent party; parent party challenges ballot petitions and counter-mobilizes in shared strongholds.',
  },
  {
    id: 'civic_reform',
    name: 'Civic Reform / Anti-Duopoly',
    startingBudget: 25,
    upsides: '+12 starting Independents Trust; +25% electoral reform leverage for Ranked Choice Voting, Approval Voting, and Proportional Representation.',
    downsides: 'Anti-Machine Sensitivity: Softer partisan discipline; base turnout enthusiasm drops if leadership acts like a rigid party machine.',
  },
  {
    id: 'grassroots_viral',
    name: 'Grassroots Viral Movement',
    startingBudget: 15,
    upsides: '1.5× Small-Donor fundraising yield; 2× Volunteer Drive voter registration efficiency; +12 starting Fame for newly recruited nominees.',
    downsides: 'Lower starting budget ($15M); volatile media attention cycles and slower corporate or institutional donor scaling.',
  },
  {
    id: 'executive_third_way',
    name: 'Executive / Self-Funded Third Way',
    startingBudget: 50,
    upsides: 'Massive $50M starting war chest; cuts Tier 1–3 Media Blackout penalties by 50% through high-profile figurehead visibility.',
    downsides: 'Grassroots Cynicism: -30% Small-Donor yield; harder persuasion and reduced base enthusiasm among populist and vanguard factions.',
  },
];

// REQ-241: Founding Charter Traits (Pick 1-2)
const CUSTOM_CHARTER_TRAITS = [
  {
    id: 'no_super_pac_pledge',
    name: 'No Super PAC / Small-Dollar Pledge',
    description: 'Permanently locks out Super PAC formation; grants +35% Small-Donor Drive yields and +2.0% electoral lift for Squeaky Clean candidates.',
  },
  {
    id: 'big_tent_pragmatism',
    name: 'Big-Tent Pragmatism',
    mutuallyExclusiveWith: 'doctrinal_vanguard',
    description: 'Loosens ongoing in-game faction compatibility tolerance to 2.5 and reduces purist backlash by 30%; caps peak base turnout enthusiasm slightly.',
  },
  {
    id: 'doctrinal_vanguard',
    name: 'Doctrinal Vanguard',
    mutuallyExclusiveWith: 'big_tent_pragmatism',
    description: '+2.5% base turnout and +10% volunteer efficiency when platform remains faithful to core wings; 1.5× faction happiness penalty when compromising on signature issues.',
  },
  {
    id: 'state_first_federation',
    name: 'State-First Federation',
    description: '-33% State Chapter opening costs ($4M vs $6M) and +1 Quality / +5 Fame for Breakout State Legislators; softer top-down national whip discipline.',
  },
];

// REQ-241: Party Branding Suite (10 Inline SVG Vector Emblems)
const CUSTOM_PARTY_EMBLEMS = [
  { id: 'torch', label: 'Torch', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M28 60h8M30 60V38h4v22M26 38l6-16 6 16H26zM32 6c3 4 8 8 8 13a8 8 0 0 1-16 0c0-5 5-9 8-13z"/></svg>' },
  { id: 'oak', label: 'Oak', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 60V42M28 60h8M32 42c-8-6-14-3-18-8-5-7-1-16 6-18 0-8 8-12 12-12s12 4 12 12c7 2 11 11 6 18-4 5-10 2-18 8z"/></svg>' },
  { id: 'compass', label: 'Compass', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="26"/><polygon points="32 12 37 27 52 32 37 37 32 52 27 37 12 32 27 27"/></svg>' },
  { id: 'scales', label: 'Scales', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10v46M24 56h16M14 18h36M14 18l-6 18h12l-6-18zM50 18l-6 18h12l-6-18z"/></svg>' },
  { id: 'phoenix', label: 'Phoenix', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8c2 4 4 8 4 12 0 6-4 10-4 10s-4-4-4-10c0-4 2-8 4-12zM12 26c10 2 16 10 20 18-8 2-16-2-20-18zM52 26c-10 2-16 10-20 18 8 2 16-2 20-18zM24 50c4 4 8 6 8 6s4-2 8-6-4-8-8-8-8 4-8 8z"/></svg>' },
  { id: 'gear', label: 'Gear', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="10"/><path d="M30 6h4l2 6 5 2 5-4 4 3-2 6 4 4 6-2 3 4-4 5 2 5 6 2v4l-6 2-2 5 4 5-3 4-6-2-4 4 2 6-4 3-5-4-5 2-2 6h-4l-2-6-5-2-5 4-4-3 2-6-4-4-6 2-3-4 4-5-2-5-6-2v-4l6-2 2-5-4-5 3-4 6 2 4-4-2-6 4-3 5 4 5-2 2-6z"/></svg>' },
  { id: 'pine', label: 'Pine', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="32 6 42 22 36 22 46 38 38 38 48 52 16 52 26 38 18 38 28 22 22 22"/><path d="M30 52v8h4v-8"/></svg>' },
  { id: 'bison', label: 'Bison', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 28c0-8 6-14 14-14h16c6 0 12 4 14 10 4 2 6 6 6 10 0 6-4 10-8 12v10h-6v-8H36v8h-6v-10c-6-2-10-6-14-12H10v-6zM46 16l4-6M18 16l-4-6"/></svg>' },
  { id: 'starburst', label: 'Starburst', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="32" y1="4" x2="32" y2="60"/><line x1="4" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="52" y2="52"/><line x1="12" y1="52" x2="52" y2="12"/><circle cx="32" cy="32" r="6" fill="currentColor"/></svg>' },
  { id: 'shield', label: 'Shield', svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 6l22 8v18c0 16-12 24-22 26C22 56 10 48 10 32V14l22-8z"/><path d="M32 16v32M20 28h24"/></svg>' },
];


// ============================================================================
// VERSION 0.16.6: STATEWIDE ELECTED EXECUTIVE OFFICES REGISTRY & ROSTER
// ============================================================================
const STATEWIDE_OFFICES_REGISTRY = [
  {
    "id": "AL-lieutenant_governor",
    "stateId": "AL",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-attorney_general",
    "stateId": "AL",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-secretary_of_state",
    "stateId": "AL",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-state_treasurer",
    "stateId": "AL",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-state_auditor",
    "stateId": "AL",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-agriculture_commissioner",
    "stateId": "AL",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture & Industries",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-public_service_commission-1",
    "stateId": "AL",
    "officeKey": "public_service_commission",
    "title": "Public Service Comm (Pres)",
    "seat": "Pres",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-public_service_commission-2",
    "stateId": "AL",
    "officeKey": "public_service_commission",
    "title": "Public Service Comm (Pl 1)",
    "seat": "Pl 1",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AL-public_service_commission-3",
    "stateId": "AL",
    "officeKey": "public_service_commission",
    "title": "Public Service Comm (Pl 2)",
    "seat": "Pl 2",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-secretary_of_state",
    "stateId": "AZ",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-attorney_general",
    "stateId": "AZ",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-state_treasurer",
    "stateId": "AZ",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-superintendent_of_education",
    "stateId": "AZ",
    "officeKey": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-mine_inspector",
    "stateId": "AZ",
    "officeKey": "mine_inspector",
    "title": "State Mine Inspector",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 0.95,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-corporation_commission-1",
    "stateId": "AZ",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 1)",
    "seat": "Seat 1",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-corporation_commission-2",
    "stateId": "AZ",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 2)",
    "seat": "Seat 2",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-corporation_commission-3",
    "stateId": "AZ",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 3)",
    "seat": "Seat 3",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-corporation_commission-4",
    "stateId": "AZ",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 4)",
    "seat": "Seat 4",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AZ-corporation_commission-5",
    "stateId": "AZ",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 5)",
    "seat": "Seat 5",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AR-lieutenant_governor",
    "stateId": "AR",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AR-attorney_general",
    "stateId": "AR",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AR-secretary_of_state",
    "stateId": "AR",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AR-state_treasurer",
    "stateId": "AR",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AR-state_auditor",
    "stateId": "AR",
    "officeKey": "state_auditor",
    "title": "Auditor of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "AR-public_lands_commissioner",
    "stateId": "AR",
    "officeKey": "public_lands_commissioner",
    "title": "Commissioner of State Lands",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CA-lieutenant_governor",
    "stateId": "CA",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CA-attorney_general",
    "stateId": "CA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CA-secretary_of_state",
    "stateId": "CA",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CA-state_treasurer",
    "stateId": "CA",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CA-state_comptroller",
    "stateId": "CA",
    "officeKey": "state_comptroller",
    "title": "State Controller",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CA-insurance_commissioner",
    "stateId": "CA",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CO-attorney_general",
    "stateId": "CO",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CO-secretary_of_state",
    "stateId": "CO",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CO-state_treasurer",
    "stateId": "CO",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CT-attorney_general",
    "stateId": "CT",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CT-secretary_of_state",
    "stateId": "CT",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CT-state_treasurer",
    "stateId": "CT",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "CT-state_comptroller",
    "stateId": "CT",
    "officeKey": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "DE-lieutenant_governor",
    "stateId": "DE",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "DE-attorney_general",
    "stateId": "DE",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "DE-state_treasurer",
    "stateId": "DE",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "DE-state_auditor",
    "stateId": "DE",
    "officeKey": "state_auditor",
    "title": "Auditor of Accounts",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "DE-insurance_commissioner",
    "stateId": "DE",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "FL-attorney_general",
    "stateId": "FL",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "FL-chief_financial_officer",
    "stateId": "FL",
    "officeKey": "chief_financial_officer",
    "title": "Chief Financial Officer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "FL-agriculture_commissioner",
    "stateId": "FL",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "GA-lieutenant_governor",
    "stateId": "GA",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "GA-attorney_general",
    "stateId": "GA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "GA-secretary_of_state",
    "stateId": "GA",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "GA-superintendent_of_education",
    "stateId": "GA",
    "officeKey": "superintendent_of_education",
    "title": "State School Supt",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "GA-agriculture_commissioner",
    "stateId": "GA",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "GA-insurance_commissioner",
    "stateId": "GA",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "GA-labor_commissioner",
    "stateId": "GA",
    "officeKey": "labor_commissioner",
    "title": "Commissioner of Labor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ID-lieutenant_governor",
    "stateId": "ID",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ID-attorney_general",
    "stateId": "ID",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ID-secretary_of_state",
    "stateId": "ID",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ID-state_treasurer",
    "stateId": "ID",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ID-state_comptroller",
    "stateId": "ID",
    "officeKey": "state_comptroller",
    "title": "State Controller",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ID-superintendent_of_education",
    "stateId": "ID",
    "officeKey": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IL-attorney_general",
    "stateId": "IL",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IL-secretary_of_state",
    "stateId": "IL",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IL-state_treasurer",
    "stateId": "IL",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IL-state_comptroller",
    "stateId": "IL",
    "officeKey": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IN-attorney_general",
    "stateId": "IN",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IN-secretary_of_state",
    "stateId": "IN",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IN-state_treasurer",
    "stateId": "IN",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IN-state_comptroller",
    "stateId": "IN",
    "officeKey": "state_comptroller",
    "title": "Auditor / Comptroller",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IA-attorney_general",
    "stateId": "IA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IA-secretary_of_state",
    "stateId": "IA",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IA-state_treasurer",
    "stateId": "IA",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IA-state_auditor",
    "stateId": "IA",
    "officeKey": "state_auditor",
    "title": "Auditor of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "IA-agriculture_commissioner",
    "stateId": "IA",
    "officeKey": "agriculture_commissioner",
    "title": "Secretary of Agriculture",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KS-attorney_general",
    "stateId": "KS",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KS-secretary_of_state",
    "stateId": "KS",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KS-state_treasurer",
    "stateId": "KS",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KS-insurance_commissioner",
    "stateId": "KS",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KY-attorney_general",
    "stateId": "KY",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KY-secretary_of_state",
    "stateId": "KY",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KY-state_treasurer",
    "stateId": "KY",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KY-state_auditor",
    "stateId": "KY",
    "officeKey": "state_auditor",
    "title": "Auditor of Public Accounts",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "KY-agriculture_commissioner",
    "stateId": "KY",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "LA-lieutenant_governor",
    "stateId": "LA",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "LA-attorney_general",
    "stateId": "LA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "LA-secretary_of_state",
    "stateId": "LA",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "LA-state_treasurer",
    "stateId": "LA",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "LA-agriculture_commissioner",
    "stateId": "LA",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture & Forestry",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "LA-insurance_commissioner",
    "stateId": "LA",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MD-attorney_general",
    "stateId": "MD",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MD-state_comptroller",
    "stateId": "MD",
    "officeKey": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MA-attorney_general",
    "stateId": "MA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MA-secretary_of_state",
    "stateId": "MA",
    "officeKey": "secretary_of_state",
    "title": "Secretary of the Comm",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MA-state_treasurer",
    "stateId": "MA",
    "officeKey": "state_treasurer",
    "title": "Treasurer & Receiver-Gen",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MA-state_auditor",
    "stateId": "MA",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MI-attorney_general",
    "stateId": "MI",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MI-secretary_of_state",
    "stateId": "MI",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MN-attorney_general",
    "stateId": "MN",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MN-secretary_of_state",
    "stateId": "MN",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MN-state_auditor",
    "stateId": "MN",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MS-lieutenant_governor",
    "stateId": "MS",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MS-attorney_general",
    "stateId": "MS",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MS-secretary_of_state",
    "stateId": "MS",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MS-state_treasurer",
    "stateId": "MS",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MS-state_auditor",
    "stateId": "MS",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MS-agriculture_commissioner",
    "stateId": "MS",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture & Commerce",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MS-insurance_commissioner",
    "stateId": "MS",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MO-lieutenant_governor",
    "stateId": "MO",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MO-attorney_general",
    "stateId": "MO",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MO-secretary_of_state",
    "stateId": "MO",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MO-state_treasurer",
    "stateId": "MO",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MO-state_auditor",
    "stateId": "MO",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MT-attorney_general",
    "stateId": "MT",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MT-secretary_of_state",
    "stateId": "MT",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MT-state_auditor",
    "stateId": "MT",
    "officeKey": "state_auditor",
    "title": "State Auditor (Sec & Ins)",
    "seat": "Sec & Ins",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "MT-superintendent_of_education",
    "stateId": "MT",
    "officeKey": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NE-attorney_general",
    "stateId": "NE",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NE-secretary_of_state",
    "stateId": "NE",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NE-state_treasurer",
    "stateId": "NE",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NE-state_auditor",
    "stateId": "NE",
    "officeKey": "state_auditor",
    "title": "Auditor of Public Accounts",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NV-lieutenant_governor",
    "stateId": "NV",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NV-attorney_general",
    "stateId": "NV",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NV-secretary_of_state",
    "stateId": "NV",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NV-state_treasurer",
    "stateId": "NV",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NV-state_comptroller",
    "stateId": "NV",
    "officeKey": "state_comptroller",
    "title": "State Controller",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NM-attorney_general",
    "stateId": "NM",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NM-secretary_of_state",
    "stateId": "NM",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NM-state_treasurer",
    "stateId": "NM",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NM-state_auditor",
    "stateId": "NM",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NM-public_lands_commissioner",
    "stateId": "NM",
    "officeKey": "public_lands_commissioner",
    "title": "Public Lands Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NY-attorney_general",
    "stateId": "NY",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NY-state_comptroller",
    "stateId": "NY",
    "officeKey": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-lieutenant_governor",
    "stateId": "NC",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-attorney_general",
    "stateId": "NC",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-secretary_of_state",
    "stateId": "NC",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-state_treasurer",
    "stateId": "NC",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-state_auditor",
    "stateId": "NC",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-superintendent_of_education",
    "stateId": "NC",
    "officeKey": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-agriculture_commissioner",
    "stateId": "NC",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-labor_commissioner",
    "stateId": "NC",
    "officeKey": "labor_commissioner",
    "title": "Commissioner of Labor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "NC-insurance_commissioner",
    "stateId": "NC",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-attorney_general",
    "stateId": "ND",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-secretary_of_state",
    "stateId": "ND",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-state_auditor",
    "stateId": "ND",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-tax_commissioner",
    "stateId": "ND",
    "officeKey": "tax_commissioner",
    "title": "State Tax Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-agriculture_commissioner",
    "stateId": "ND",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-insurance_commissioner",
    "stateId": "ND",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-public_service_commission-1",
    "stateId": "ND",
    "officeKey": "public_service_commission",
    "title": "Public Service Comm (Seat 1)",
    "seat": "Seat 1",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-public_service_commission-2",
    "stateId": "ND",
    "officeKey": "public_service_commission",
    "title": "Public Service Comm (Seat 2)",
    "seat": "Seat 2",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "ND-public_service_commission-3",
    "stateId": "ND",
    "officeKey": "public_service_commission",
    "title": "Public Service Comm (Seat 3)",
    "seat": "Seat 3",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OH-attorney_general",
    "stateId": "OH",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OH-secretary_of_state",
    "stateId": "OH",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OH-state_treasurer",
    "stateId": "OH",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OH-state_auditor",
    "stateId": "OH",
    "officeKey": "state_auditor",
    "title": "Auditor of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-lieutenant_governor",
    "stateId": "OK",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-attorney_general",
    "stateId": "OK",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-state_treasurer",
    "stateId": "OK",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-state_auditor",
    "stateId": "OK",
    "officeKey": "state_auditor",
    "title": "Auditor & Inspector",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-superintendent_of_education",
    "stateId": "OK",
    "officeKey": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-labor_commissioner",
    "stateId": "OK",
    "officeKey": "labor_commissioner",
    "title": "Commissioner of Labor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-insurance_commissioner",
    "stateId": "OK",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-corporation_commission-1",
    "stateId": "OK",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 1)",
    "seat": "Seat 1",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-corporation_commission-2",
    "stateId": "OK",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 2)",
    "seat": "Seat 2",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OK-corporation_commission-3",
    "stateId": "OK",
    "officeKey": "corporation_commission",
    "title": "Corporation Comm (Seat 3)",
    "seat": "Seat 3",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OR-secretary_of_state",
    "stateId": "OR",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OR-attorney_general",
    "stateId": "OR",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "OR-state_treasurer",
    "stateId": "OR",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "PA-attorney_general",
    "stateId": "PA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "PA-state_treasurer",
    "stateId": "PA",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "PA-state_auditor",
    "stateId": "PA",
    "officeKey": "state_auditor",
    "title": "Auditor General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "RI-lieutenant_governor",
    "stateId": "RI",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "RI-attorney_general",
    "stateId": "RI",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "RI-secretary_of_state",
    "stateId": "RI",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "RI-state_treasurer",
    "stateId": "RI",
    "officeKey": "state_treasurer",
    "title": "General Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SC-attorney_general",
    "stateId": "SC",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SC-secretary_of_state",
    "stateId": "SC",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SC-state_treasurer",
    "stateId": "SC",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SC-state_comptroller",
    "stateId": "SC",
    "officeKey": "state_comptroller",
    "title": "Comptroller General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SC-superintendent_of_education",
    "stateId": "SC",
    "officeKey": "superintendent_of_education",
    "title": "Supt of Education",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SC-agriculture_commissioner",
    "stateId": "SC",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-attorney_general",
    "stateId": "SD",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-secretary_of_state",
    "stateId": "SD",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-state_treasurer",
    "stateId": "SD",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-state_auditor",
    "stateId": "SD",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-public_lands_commissioner",
    "stateId": "SD",
    "officeKey": "public_lands_commissioner",
    "title": "School & Public Lands",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-public_utilities_commission-1",
    "stateId": "SD",
    "officeKey": "public_utilities_commission",
    "title": "Public Utilities (Seat 1)",
    "seat": "Seat 1",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-public_utilities_commission-2",
    "stateId": "SD",
    "officeKey": "public_utilities_commission",
    "title": "Public Utilities (Seat 2)",
    "seat": "Seat 2",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "SD-public_utilities_commission-3",
    "stateId": "SD",
    "officeKey": "public_utilities_commission",
    "title": "Public Utilities (Seat 3)",
    "seat": "Seat 3",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-lieutenant_governor",
    "stateId": "TX",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-attorney_general",
    "stateId": "TX",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-state_comptroller",
    "stateId": "TX",
    "officeKey": "state_comptroller",
    "title": "Comptroller of Accounts",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-public_lands_commissioner",
    "stateId": "TX",
    "officeKey": "public_lands_commissioner",
    "title": "Land Commissioner (GLO)",
    "seat": "GLO",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-agriculture_commissioner",
    "stateId": "TX",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-railroad_commission-1",
    "stateId": "TX",
    "officeKey": "railroad_commission",
    "title": "Railroad Comm (Seat 1)",
    "seat": "Seat 1",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.2,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-railroad_commission-2",
    "stateId": "TX",
    "officeKey": "railroad_commission",
    "title": "Railroad Comm (Seat 2)",
    "seat": "Seat 2",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2030,
    "category": "sectoral_regulator",
    "importanceWeight": 1.2,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "TX-railroad_commission-3",
    "stateId": "TX",
    "officeKey": "railroad_commission",
    "title": "Railroad Comm (Seat 3)",
    "seat": "Seat 3",
    "cycle": "staggered_6yr",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.2,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "UT-attorney_general",
    "stateId": "UT",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "UT-state_treasurer",
    "stateId": "UT",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "UT-state_auditor",
    "stateId": "UT",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "VT-lieutenant_governor",
    "stateId": "VT",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "annual_2yr",
    "nextElectionYear": 2028,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "VT-attorney_general",
    "stateId": "VT",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "annual_2yr",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "VT-secretary_of_state",
    "stateId": "VT",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "annual_2yr",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "VT-state_treasurer",
    "stateId": "VT",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "annual_2yr",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "VT-state_auditor",
    "stateId": "VT",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "annual_2yr",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "VA-lieutenant_governor",
    "stateId": "VA",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "VA-attorney_general",
    "stateId": "VA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "odd_year",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WA-lieutenant_governor",
    "stateId": "WA",
    "officeKey": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "executive_succession",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WA-attorney_general",
    "stateId": "WA",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WA-secretary_of_state",
    "stateId": "WA",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WA-state_treasurer",
    "stateId": "WA",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WA-state_auditor",
    "stateId": "WA",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WA-public_lands_commissioner",
    "stateId": "WA",
    "officeKey": "public_lands_commissioner",
    "title": "Public Lands Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.05,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WA-insurance_commissioner",
    "stateId": "WA",
    "officeKey": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WV-secretary_of_state",
    "stateId": "WV",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WV-attorney_general",
    "stateId": "WV",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WV-state_treasurer",
    "stateId": "WV",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WV-state_auditor",
    "stateId": "WV",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WV-agriculture_commissioner",
    "stateId": "WV",
    "officeKey": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "cycle": "presidential",
    "nextElectionYear": 2028,
    "category": "sectoral_regulator",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WI-attorney_general",
    "stateId": "WI",
    "officeKey": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "legal",
    "importanceWeight": 1.35,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WI-secretary_of_state",
    "stateId": "WI",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WI-state_treasurer",
    "stateId": "WI",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WY-secretary_of_state",
    "stateId": "WY",
    "officeKey": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "administrative",
    "importanceWeight": 1.25,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WY-state_treasurer",
    "stateId": "WY",
    "officeKey": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WY-state_auditor",
    "stateId": "WY",
    "officeKey": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "fiscal",
    "importanceWeight": 1.1,
    "defaultLeanBonus": 0.0
  },
  {
    "id": "WY-superintendent_of_education",
    "stateId": "WY",
    "officeKey": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "cycle": "midterm",
    "nextElectionYear": 2030,
    "category": "education",
    "importanceWeight": 1.15,
    "defaultLeanBonus": 0.0
  }
];

const STARTING_STATEWIDE_OFFICERS = [
  {
    "id": "sitting-seo-al-lieutenant_governor",
    "officeId": "AL-lieutenant_governor",
    "name": "Will Ainsworth",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Faith & Flag",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Disciplined"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-al-attorney_general",
    "officeId": "AL-attorney_general",
    "name": "Steve Marshall",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Faith & Flag",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "Sharp Elbows",
      "Resolute"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 65,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-al-secretary_of_state",
    "officeId": "AL-secretary_of_state",
    "name": "Wes Allen",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Main Street Conservative",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Traditionalist",
      "Cautious"
    ],
    "quality": 6.5,
    "skill": 3,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 5,
      "debate": 6,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-al-state_treasurer",
    "officeId": "AL-state_treasurer",
    "name": "Young Boozer",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Country Club / Business",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "Wall Street Savvy",
      "Fiscal Hawk"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 44,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 8,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 3,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-al-state_auditor",
    "officeId": "AL-state_auditor",
    "name": "Andrew Sorrell",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_western_mavericks",
    "factionLabel": "Liberty / Constitutionalist",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Rough",
      "Maverick",
      "Anti-Tax Crusader"
    ],
    "quality": 6.2,
    "skill": 3,
    "fame": 42,
    "happiness": 72,
    "ratings": {
      "persuadability": 5,
      "turnout": 7,
      "debate": 6,
      "charisma": 3,
      "corruption": 2,
      "fundraising": 3,
      "fieldcraft": 7,
      "experience": 6,
      "mediaSavvy": 3,
      "regionalStrength": 6
    }
  },
  {
    "id": "sitting-seo-al-agriculture_commissioner",
    "officeId": "AL-agriculture_commissioner",
    "name": "Rick Pate",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture & Industries",
    "seat": "At-Large",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Farm Belt / Main Street",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Rural Roots",
      "Steadfast"
    ],
    "quality": 6.4,
    "skill": 3,
    "fame": 40,
    "happiness": 72,
    "ratings": {
      "persuadability": 5,
      "turnout": 6,
      "debate": 6,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 3,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-al-public_service_commission-1",
    "officeId": "AL-public_service_commission-1",
    "name": "Twinkle Cavanaugh",
    "office": "statewide_executive",
    "subOffice": "public_service_commission",
    "title": "Public Service Comm (Pres)",
    "seat": "Pres",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Country Club / Business",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Pro-Industry"
    ],
    "quality": 6.6,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-al-public_service_commission-2",
    "officeId": "AL-public_service_commission-2",
    "name": "Jeremy Oden",
    "office": "statewide_executive",
    "subOffice": "public_service_commission",
    "title": "Public Service Comm (Pl 1)",
    "seat": "Pl 1",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Faith & Flag",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Low Profile",
      "Bureaucrat"
    ],
    "quality": 5.8,
    "skill": 3,
    "fame": 32,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 5,
      "charisma": 4,
      "corruption": 4,
      "fundraising": 4,
      "fieldcraft": 5,
      "experience": 6,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-al-public_service_commission-3",
    "officeId": "AL-public_service_commission-3",
    "name": "Chris Beeker Jr.",
    "office": "statewide_executive",
    "subOffice": "public_service_commission",
    "title": "Public Service Comm (Pl 2)",
    "seat": "Pl 2",
    "stateId": "AL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Farm Belt / Business",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Agri-Advocate",
      "Steady"
    ],
    "quality": 5.9,
    "skill": 3,
    "fame": 33,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 5,
      "debate": 5,
      "charisma": 3,
      "corruption": 6,
      "fundraising": 2,
      "fieldcraft": 5,
      "experience": 6,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-az-secretary_of_state",
    "officeId": "AZ-secretary_of_state",
    "name": "Adrian Fontes",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "AZ",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Suburban Moderate",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Combat Vet",
      "Vocal Defender"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-az-attorney_general",
    "officeId": "AZ-attorney_general",
    "name": "Kris Mayes",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "AZ",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Progressive Reformer",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Litigator",
      "Tenacious"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 8,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 8,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-az-state_treasurer",
    "officeId": "AZ-state_treasurer",
    "name": "Kimberly Yee",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "AZ",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Main Street Conservative",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Fiscal Disciplinarian",
      "Cautious"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-az-superintendent_of_education",
    "officeId": "AZ-superintendent_of_education",
    "name": "Tom Horne",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "stateId": "AZ",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Culture Warrior / Faith",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "Sharp Elbows",
      "Battle-Tested"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 7,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-az-mine_inspector",
    "officeId": "AZ-mine_inspector",
    "name": "Paul Marsh",
    "office": "statewide_executive",
    "subOffice": "mine_inspector",
    "title": "State Mine Inspector",
    "seat": "At-Large",
    "stateId": "AZ",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Industrial / Business",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Technical Expert",
      "Industry Veteran"
    ],
    "quality": 6.0,
    "skill": 3,
    "fame": 35,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 7,
      "charisma": 3,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 6,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-az-corporation_commission-1",
    "officeId": "AZ-corporation_commission-1",
    "name": "Lea M\u00e1rquez Peterson",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 1)",
    "seat": "Seat 1",
    "stateId": "AZ",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Country Club / Business",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Pragmatist",
      "Rate-Payer Ally"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 8,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-az-corporation_commission-2",
    "officeId": "AZ-corporation_commission-2",
    "name": "Kevin Thompson",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 2)",
    "seat": "Seat 2",
    "stateId": "AZ",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Market / Growth",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Clean Energy Skeptic",
      "Steady"
    ],
    "quality": 6.5,
    "skill": 3,
    "fame": 44,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 5,
      "debate": 5,
      "charisma": 3,
      "corruption": 2,
      "fundraising": 3,
      "fieldcraft": 6,
      "experience": 6,
      "mediaSavvy": 5,
      "regionalStrength": 6
    }
  },
  {
    "id": "sitting-seo-az-corporation_commission-3",
    "officeId": "AZ-corporation_commission-3",
    "name": "Nick Myers",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 3)",
    "seat": "Seat 3",
    "stateId": "AZ",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_western_mavericks",
    "factionLabel": "Liberty / Conservative",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Grid Security Hawk"
    ],
    "quality": 6.3,
    "skill": 3,
    "fame": 42,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 5,
      "debate": 6,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 3,
      "regionalStrength": 6
    }
  },
  {
    "id": "sitting-seo-az-corporation_commission-4",
    "officeId": "AZ-corporation_commission-4",
    "name": "Anna Tovar",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 4)",
    "seat": "Seat 4",
    "stateId": "AZ",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "Labor Advocate / Moderate",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Consumer Watchdog",
      "Respected"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-az-corporation_commission-5",
    "officeId": "AZ-corporation_commission-5",
    "name": "Rachel Walden",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 5)",
    "seat": "Seat 5",
    "stateId": "AZ",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "School Choice / Conservative",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Outspoken",
      "Grassroots"
    ],
    "quality": 6.4,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 6,
      "charisma": 4,
      "corruption": 3,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 6,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ar-lieutenant_governor",
    "officeId": "AR-lieutenant_governor",
    "name": "Leslie Rutledge",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "AR",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "MAGA Populist",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "Sharp Elbows",
      "Media Savvy"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 7,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ar-attorney_general",
    "officeId": "AR-attorney_general",
    "name": "Tim Griffin",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "AR",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Market / Country Club",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Beltway Veteran"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 6,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ar-secretary_of_state",
    "officeId": "AR-secretary_of_state",
    "name": "John Thurston",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "AR",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Faith & Community",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Clerical Mindset",
      "Steady"
    ],
    "quality": 6.3,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 5,
      "charisma": 3,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 6,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ar-state_treasurer",
    "officeId": "AR-state_treasurer",
    "name": "Larry Walther",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "AR",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Fiscal Conservative",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Veteran Administrator",
      "Careful"
    ],
    "quality": 6.6,
    "skill": 3,
    "fame": 40,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 7,
      "charisma": 4,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 3,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ar-state_auditor",
    "officeId": "AR-state_auditor",
    "name": "Dennis Milligan",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor of State",
    "seat": "At-Large",
    "stateId": "AR",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Main Street Conservative",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Rough",
      "Budget Hawk",
      "Reliable"
    ],
    "quality": 6.4,
    "skill": 3,
    "fame": 42,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 5,
      "debate": 5,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 6
    }
  },
  {
    "id": "sitting-seo-ar-public_lands_commissioner",
    "officeId": "AR-public_lands_commissioner",
    "name": "Tommy Land",
    "office": "statewide_executive",
    "subOffice": "public_lands_commissioner",
    "title": "Commissioner of State Lands",
    "seat": "At-Large",
    "stateId": "AR",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Rural / Traditionalist",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Timber Advocate",
      "Low Key"
    ],
    "quality": 6.0,
    "skill": 3,
    "fame": 36,
    "happiness": 72,
    "ratings": {
      "persuadability": 5,
      "turnout": 7,
      "debate": 5,
      "charisma": 4,
      "corruption": 3,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 6,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ca-lieutenant_governor",
    "officeId": "CA-lieutenant_governor",
    "name": "Eleni Kounalakis",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "CA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Neo-Liberal / Tech Ally",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Deep Warchest"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 8,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ca-attorney_general",
    "officeId": "CA-attorney_general",
    "name": "Rob Bonta",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "CA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Progressive Activist",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rising Star",
      "Reform Prosecutor",
      "Media Savvy"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 76,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 9,
      "charisma": 8,
      "corruption": 2,
      "fundraising": 8,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ca-secretary_of_state",
    "officeId": "CA-secretary_of_state",
    "name": "Shirley Weber",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "CA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_black_voters",
    "factionLabel": "Civil Rights / Labor",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Academic Gravitas",
      "Principled"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ca-state_treasurer",
    "officeId": "CA-state_treasurer",
    "name": "Fiona Ma",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "CA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Pragmatic Coalition",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "CPA Credentials",
      "Machine Roots"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 8,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 8,
      "fieldcraft": 8,
      "experience": 10,
      "mediaSavvy": 6,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-ca-state_comptroller",
    "officeId": "CA-state_comptroller",
    "name": "Malia Cohen",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "State Controller",
    "seat": "At-Large",
    "stateId": "CA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Urban Progressive",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Fiscal Auditor",
      "Tenacious"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 7,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ca-insurance_commissioner",
    "officeId": "CA-insurance_commissioner",
    "name": "Ricardo Lara",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "CA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "Labor / Consumer Ally",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Regulatory Veteran",
      "Connected"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-co-attorney_general",
    "officeId": "CO-attorney_general",
    "name": "Phil Weiser",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "CO",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Tech / Pragmatic Moderate",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Antitrust Litigator",
      "Scholarly"
    ],
    "quality": 8.0,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 7,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-co-secretary_of_state",
    "officeId": "CO-secretary_of_state",
    "name": "Jena Griswold",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "CO",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Progressive Reformer",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "High Media Profile",
      "Crusader"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-co-state_treasurer",
    "officeId": "CO-state_treasurer",
    "name": "Dave Young",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "CO",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "Teacher / Public Sector",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Calm Steward",
      "Detail-Oriented"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 3,
      "corruption": 3,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ct-attorney_general",
    "officeId": "CT-attorney_general",
    "name": "William Tong",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "CT",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Consumer / Pragmatic",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Corporate Litigator",
      "Tenacious"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 8,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ct-secretary_of_state",
    "officeId": "CT-secretary_of_state",
    "name": "Stephanie Thomas",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "CT",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Civic / Moderate",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Voter Access Champion",
      "Calm"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 8,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ct-state_treasurer",
    "officeId": "CT-state_treasurer",
    "name": "Erick Russell",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "CT",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Fiscal / Modernizer",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Rough",
      "Wall Street Bonds Expert"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 6,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ct-state_comptroller",
    "officeId": "CT-state_comptroller",
    "name": "Sean Scanlon",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "stateId": "CT",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Health Care / Reform",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Legislative Architect"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-de-lieutenant_governor",
    "officeId": "DE-lieutenant_governor",
    "name": "Kyle Evans Gay",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "DE",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Suburban Moderate",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Legal Mind",
      "Collaborative"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-de-attorney_general",
    "officeId": "DE-attorney_general",
    "name": "Kathy Jennings",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "DE",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Practical Law Enforcement",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Former Prosecutor",
      "Tough"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-de-state_treasurer",
    "officeId": "DE-state_treasurer",
    "name": "Colleen Davis",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "DE",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Health / Fiscal Steward",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Disciplined",
      "Pension Modernizer",
      "Steady"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 44,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-de-state_auditor",
    "officeId": "DE-state_auditor",
    "name": "Lydia York",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor of Accounts",
    "seat": "At-Large",
    "stateId": "DE",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Professional Auditor",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Accountancy Credentials"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 42,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 8,
      "charisma": 3,
      "corruption": 2,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-de-insurance_commissioner",
    "officeId": "DE-insurance_commissioner",
    "name": "Trinidad Navarro",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "DE",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Consumer Protection",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Ex-Sheriff",
      "Street Smarts"
    ],
    "quality": 6.6,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 7,
      "charisma": 3,
      "corruption": 6,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-fl-attorney_general",
    "officeId": "FL-attorney_general",
    "name": "Ashley Moody",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "FL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_neo_cons",
    "factionLabel": "Law & Order / Heritage",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rising Star",
      "Supreme Court Feeder"
    ],
    "quality": 8.1,
    "skill": 4,
    "fame": 78,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 7,
      "debate": 9,
      "charisma": 8,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-fl-chief_financial_officer",
    "officeId": "FL-chief_financial_officer",
    "name": "Jimmy Patronis",
    "office": "statewide_executive",
    "subOffice": "chief_financial_officer",
    "title": "Chief Financial Officer",
    "seat": "At-Large",
    "stateId": "FL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Business / Fire Marshal",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "Media Ready",
      "Insurance Hawk"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 9,
      "charisma": 8,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-fl-agriculture_commissioner",
    "officeId": "FL-agriculture_commissioner",
    "name": "Wilton Simpson",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "FL",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Citrus & Cattle / Market",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Ex-Senate President",
      "Deep Donors"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 9,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ga-lieutenant_governor",
    "officeId": "GA-lieutenant_governor",
    "name": "Burt Jones",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "GA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "MAGA Populist",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "Gridiron Athlete",
      "Wealthy"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 7,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ga-attorney_general",
    "officeId": "GA-attorney_general",
    "name": "Chris Carr",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "GA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Country Club Conservative",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Steady Lawyer",
      "Corporate Ties"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 7,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ga-secretary_of_state",
    "officeId": "GA-secretary_of_state",
    "name": "Brad Raffensperger",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "GA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_western_mavericks",
    "factionLabel": "Constitutionalist / Moderate",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Rising Star",
      "National Profile",
      "Resilient"
    ],
    "quality": 7.9,
    "skill": 4,
    "fame": 84,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 9,
      "corruption": 5,
      "fundraising": 9,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ga-superintendent_of_education",
    "officeId": "GA-superintendent_of_education",
    "name": "Richard Woods",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "State School Supt",
    "seat": "At-Large",
    "stateId": "GA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Traditional Educator",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Rural Defender",
      "Curriculum Hawk"
    ],
    "quality": 6.6,
    "skill": 3,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 6,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 4,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ga-agriculture_commissioner",
    "officeId": "GA-agriculture_commissioner",
    "name": "Tyler Harper",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "GA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Young Agri-Leader",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rising Star",
      "7th Gen Farmer"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ga-insurance_commissioner",
    "officeId": "GA-insurance_commissioner",
    "name": "John King",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "GA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_neo_cons",
    "factionLabel": "Military / Law & Order",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "General",
      "First Hispanic Leader"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ga-labor_commissioner",
    "officeId": "GA-labor_commissioner",
    "name": "Bruce Thompson",
    "office": "statewide_executive",
    "subOffice": "labor_commissioner",
    "title": "Commissioner of Labor",
    "seat": "At-Large",
    "stateId": "GA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Business Entrepreneur",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Disciplined",
      "Systems Reformer",
      "Modernizer"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 4,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-id-lieutenant_governor",
    "officeId": "ID-lieutenant_governor",
    "name": "Scott Bedke",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "ID",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Traditional Statehouse",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Longtime Speaker",
      "Ranches"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 6,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-id-attorney_general",
    "officeId": "ID-attorney_general",
    "name": "Ra\u00fal Labrador",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "ID",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Freedom Caucus / Populist",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "Sharp Elbows",
      "Ideologue"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 7,
      "charisma": 8,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-id-secretary_of_state",
    "officeId": "ID-secretary_of_state",
    "name": "Phil McGrane",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "ID",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Election Administrator",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Respected Tech Innovator"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 7,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-id-state_treasurer",
    "officeId": "ID-state_treasurer",
    "name": "Julie Ellsworth",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "ID",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Fiscal Conservative",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Safe Harbor Investments"
    ],
    "quality": 6.5,
    "skill": 3,
    "fame": 44,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 5,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-id-state_comptroller",
    "officeId": "ID-state_comptroller",
    "name": "Brandon Woolf",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "State Controller",
    "seat": "At-Large",
    "stateId": "ID",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Transparency Advocate",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Disciplined",
      "Open-Books Champion",
      "Steady"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-id-superintendent_of_education",
    "officeId": "ID-superintendent_of_education",
    "name": "Debbie Critchfield",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "stateId": "ID",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Practical Educator",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "School Board Veteran",
      "Balanced"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 7,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 4,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-il-attorney_general",
    "officeId": "IL-attorney_general",
    "name": "Kwame Raoul",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "IL",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_black_voters",
    "factionLabel": "Civil Rights / Urban Machine",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Smooth Negotiator",
      "Battle-Tested"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 8,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-il-secretary_of_state",
    "officeId": "IL-secretary_of_state",
    "name": "Alexi Giannoulias",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "IL",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Commercial Banking / Moderate",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Charismatic",
      "Media Heavy"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 74,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 8,
      "charisma": 7,
      "corruption": 4,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-il-state_treasurer",
    "officeId": "IL-state_treasurer",
    "name": "Michael Frerichs",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "IL",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Plains Farmer / Fiscal",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Unclaimed Property Machine"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 8,
      "charisma": 4,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-il-state_comptroller",
    "officeId": "IL-state_comptroller",
    "name": "Susana Mendoza",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "stateId": "IL",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_traditional_latin",
    "factionLabel": "Hispanic / Moderate Reform",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Fiscal Disciplinarian",
      "Scrappy"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-in-attorney_general",
    "officeId": "IN-attorney_general",
    "name": "Todd Rokita",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "IN",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Combat Conservative",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "Constant Media Presence",
      "Belligerent"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 74,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 8,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-in-secretary_of_state",
    "officeId": "IN-secretary_of_state",
    "name": "Diego Morales",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "IN",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Grassroots Loyalist",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "Immigrant Success Story",
      "Fighter"
    ],
    "quality": 6.4,
    "skill": 3,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 5,
      "debate": 7,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 5,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 6
    }
  },
  {
    "id": "sitting-seo-in-state_treasurer",
    "officeId": "IN-state_treasurer",
    "name": "Daniel Elliott",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "IN",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Tech / Local Executive",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Conservative Safe Bonds"
    ],
    "quality": 6.5,
    "skill": 3,
    "fame": 45,
    "happiness": 72,
    "ratings": {
      "persuadability": 5,
      "turnout": 6,
      "debate": 6,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 3,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 6
    }
  },
  {
    "id": "sitting-seo-in-state_comptroller",
    "officeId": "IN-state_comptroller",
    "name": "Elise Nieshalla",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "Auditor / Comptroller",
    "seat": "At-Large",
    "stateId": "IN",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "County Finance / Conservative",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Tax Policy Specialist"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 7,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ia-attorney_general",
    "officeId": "IA-attorney_general",
    "name": "Brenna Bird",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "IA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Law & Order / Rural Advocate",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Relentless Litigator",
      "Unseated Incumbent"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 65,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ia-secretary_of_state",
    "officeId": "IA-secretary_of_state",
    "name": "Paul Pate",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "IA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Main Street Conservative",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Rough",
      "Decades of Ballot Ops"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 6,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ia-state_treasurer",
    "officeId": "IA-state_treasurer",
    "name": "Roby Smith",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "IA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Banking / Legislative Leader",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Ousted 40-Yr Incumbent"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ia-state_auditor",
    "officeId": "IA-state_auditor",
    "name": "Rob Sand",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor of State",
    "seat": "At-Large",
    "stateId": "IA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Progressive / Good Governance",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Rough",
      "Lone Dem Island",
      "Anti-Corruption Crusader"
    ],
    "quality": 8.1,
    "skill": 4,
    "fame": 75,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ia-agriculture_commissioner",
    "officeId": "IA-agriculture_commissioner",
    "name": "Mike Naig",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Secretary of Agriculture",
    "seat": "At-Large",
    "stateId": "IA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Grain & Livestock / Trade",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Agri-Diplomat",
      "Deeply Respected"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 6,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ks-attorney_general",
    "officeId": "KS-attorney_general",
    "name": "Kris Kobach",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "KS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Immigration / Constitutional",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Undisciplined",
      "Polarizing Icon",
      "Legal Theorist"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 82,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 8,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 9,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ks-secretary_of_state",
    "officeId": "KS-secretary_of_state",
    "name": "Scott Schwab",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "KS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Institutionalist Conservative",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "Election Integrity Defender"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 8,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ks-state_treasurer",
    "officeId": "KS-state_treasurer",
    "name": "Steven Johnson",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "KS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Farm Belt / Finance",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Actuarial Mindset",
      "Calm"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ks-insurance_commissioner",
    "officeId": "KS-insurance_commissioner",
    "name": "Vicki Schmidt",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "KS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Pharmacist / Health Policy",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Independent Streak",
      "Regulatory Veteran"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 4,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ky-attorney_general",
    "officeId": "KY-attorney_general",
    "name": "Russell Coleman",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "KY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_neo_cons",
    "factionLabel": "Federal Prosecutor / Law & Order",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Polished",
      "McConnell Prot\u00e9g\u00e9"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 9,
      "charisma": 7,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ky-secretary_of_state",
    "officeId": "KY-secretary_of_state",
    "name": "Michael Adams",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "KY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_suburban_moderates",
    "factionLabel": "Bipartisan Election Steward",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Disciplined",
      "National Integrity Award Winner"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 8,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ky-state_treasurer",
    "officeId": "KY-state_treasurer",
    "name": "Mark Metcalf",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "KY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "County Prosecutor",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Anti-ESG Investment Champion"
    ],
    "quality": 6.6,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 6,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ky-state_auditor",
    "officeId": "KY-state_auditor",
    "name": "Allison Ball",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor of Public Accounts",
    "seat": "At-Large",
    "stateId": "KY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Fiscal Hawk / Rising Star",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Squeaky Clean",
      "Termed-out Treasurer",
      "Popular"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ky-agriculture_commissioner",
    "officeId": "KY-agriculture_commissioner",
    "name": "Jonathan Shell",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "KY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "5th Gen Farmer / Campaign Strategist",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "House Floor Leader Veteran"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 6,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-la-lieutenant_governor",
    "officeId": "LA-lieutenant_governor",
    "name": "Billy Nungesser",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "LA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Tourism & Heritage Populist",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "Bayou Charisma",
      "Huge Cross-Over Vote"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 76,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 8,
      "fieldcraft": 8,
      "experience": 10,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-la-attorney_general",
    "officeId": "LA-attorney_general",
    "name": "Liz Murrill",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "LA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Solicitor General Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Elite Appeals Litigator"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 7,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-la-secretary_of_state",
    "officeId": "LA-secretary_of_state",
    "name": "Nancy Landry",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "LA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Education / Legal Reform",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Established Politician",
      "Voting Machine Modernizer"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 4,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-la-state_treasurer",
    "officeId": "LA-state_treasurer",
    "name": "John Fleming",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "LA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "House Freedom Caucus Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Wealthy Physician",
      "Movement Conservative"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 7,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-la-agriculture_commissioner",
    "officeId": "LA-agriculture_commissioner",
    "name": "Mike Strain",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture & Forestry",
    "seat": "At-Large",
    "stateId": "LA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Veterinarian / Forestry Champion",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Decades in Saddle",
      "Safe Everywhere"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 9,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-la-insurance_commissioner",
    "officeId": "LA-insurance_commissioner",
    "name": "Tim Temple",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "LA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Commercial Underwriter",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Pro-Market Deregulator"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 8,
      "charisma": 4,
      "corruption": 3,
      "fundraising": 4,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-md-attorney_general",
    "officeId": "MD-attorney_general",
    "name": "Anthony Brown",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "MD",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Military / Establishment Democrat",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Ex-Lt Gov & Congressman"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 8,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 8,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-md-state_comptroller",
    "officeId": "MD-state_comptroller",
    "name": "Brooke Lierman",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "stateId": "MD",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "Civil Rights / Pension Activist",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Established Politician",
      "Dynamic Organizer",
      "Data-Driven"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 7,
      "debate": 7,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-ma-attorney_general",
    "officeId": "MA-attorney_general",
    "name": "Andrea Campbell",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "MA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Urban Progressive Reform",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Former City Council Pres",
      "Sharp"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ma-secretary_of_state",
    "officeId": "MA-secretary_of_state",
    "name": "William Galvin",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of the Comm",
    "seat": "At-Large",
    "stateId": "MA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Old-Guard Machine",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "30-Year Ballot Czar",
      "Untouchable"
    ],
    "quality": 7.9,
    "skill": 4,
    "fame": 74,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 10,
      "mediaSavvy": 8,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-ma-state_treasurer",
    "officeId": "MA-state_treasurer",
    "name": "Deborah Goldberg",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "Treasurer & Receiver-Gen",
    "seat": "At-Large",
    "stateId": "MA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Retail Dynasty / Fiscal Steward",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Disciplined",
      "Lottery Modernizer",
      "Steady"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 8,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ma-state_auditor",
    "officeId": "MA-state_auditor",
    "name": "Diana DiZoglio",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "MA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Scrappy Outsider / Populist",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Rough",
      "Audits the Legislature",
      "Maverick"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-mi-attorney_general",
    "officeId": "MI-attorney_general",
    "name": "Dana Nessel",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "MI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_black_voters",
    "factionLabel": "Fighter / Civil Rights",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "Fearless Debater",
      "Social Media Dynamo"
    ],
    "quality": 7.9,
    "skill": 4,
    "fame": 80,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 9,
      "charisma": 8,
      "corruption": 3,
      "fundraising": 9,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-mi-secretary_of_state",
    "officeId": "MI-secretary_of_state",
    "name": "Jocelyn Benson",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "MI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Election Law Scholar / Dean",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "National Media Champion"
    ],
    "quality": 8.1,
    "skill": 4,
    "fame": 82,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 8,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-mn-attorney_general",
    "officeId": "MN-attorney_general",
    "name": "Keith Ellison",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "MN",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Progressive / DFL Labor",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rising Star",
      "National Profile",
      "Civil Rights Litigator"
    ],
    "quality": 8.0,
    "skill": 4,
    "fame": 85,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 9,
      "corruption": 6,
      "fundraising": 8,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-mn-secretary_of_state",
    "officeId": "MN-secretary_of_state",
    "name": "Steve Simon",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "MN",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_capital_l_left",
    "factionLabel": "Good Governance / DFL",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Turnout Champion",
      "Low Drama"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-mn-state_auditor",
    "officeId": "MN-state_auditor",
    "name": "Julie Blaha",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "MN",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "Union Math Teacher / Labor",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Rural Labor Connections"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ms-lieutenant_governor",
    "officeId": "MS-lieutenant_governor",
    "name": "Delbert Hosemann",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "MS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Institutional Business",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Powerful Senate Pres",
      "Pragmatic"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 7,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ms-attorney_general",
    "officeId": "MS-attorney_general",
    "name": "Lynn Fitch",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "MS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_neo_cons",
    "factionLabel": "Law & Order / National Conservative",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rising Star",
      "Dobbs Decision Petitioner"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 76,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 8,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ms-secretary_of_state",
    "officeId": "MS-secretary_of_state",
    "name": "Michael Watson",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "MS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Conservative Activist",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Election Law Hawk"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 6,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ms-state_treasurer",
    "officeId": "MS-state_treasurer",
    "name": "David McRae",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "MS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Wealth Management",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "College Savings Champion"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 6,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ms-state_auditor",
    "officeId": "MS-state_auditor",
    "name": "Shad White",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "MS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Rhodes Scholar / Whistleblower",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Polished",
      "High-Profile Fraud Investigator"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 8,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ms-agriculture_commissioner",
    "officeId": "MS-agriculture_commissioner",
    "name": "Andy Gipson",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture & Commerce",
    "seat": "At-Large",
    "stateId": "MS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Baptist Pastor / Farmer",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Mississippi Fair Czar",
      "Vocal"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ms-insurance_commissioner",
    "officeId": "MS-insurance_commissioner",
    "name": "Mike Chaney",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "MS",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Longtime Veteran / Veteran Agent",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Rough",
      "Fire Marshal",
      "Deeply Entrenched"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 7,
      "corruption": 6,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-mo-lieutenant_governor",
    "officeId": "MO-lieutenant_governor",
    "name": "Dave Wasinger",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "MO",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Outside Litigator / Fiscal Hawk",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "CPA & Lawyer",
      "Anti-Establishment"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 8,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-mo-attorney_general",
    "officeId": "MO-attorney_general",
    "name": "Andrew Bailey",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "MO",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_neo_cons",
    "factionLabel": "Aggressive Law & Order",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Relentless Federal Injunctions"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 6,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 8,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-mo-secretary_of_state",
    "officeId": "MO-secretary_of_state",
    "name": "Denny Hoskins",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "MO",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Freedom Caucus / Conservative",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "CPA",
      "Veteran Lawmaker"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 6,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 4,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-mo-state_treasurer",
    "officeId": "MO-state_treasurer",
    "name": "Vivek Malek",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "MO",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "First Immigrant Officer / Attorney",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Polished",
      "Financial Tech Advocate"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 8,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-mo-state_auditor",
    "officeId": "MO-state_auditor",
    "name": "Scott Fitzpatrick",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "MO",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Business Owner / Ex-Budget Chair",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Disciplined",
      "Proven Fiscal Discipline"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-mt-attorney_general",
    "officeId": "MT-attorney_general",
    "name": "Austin Knudsen",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "MT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_western_mavericks",
    "factionLabel": "Gun Rights / Aggressive Litigator",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Big Sky Conservatism"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 9,
      "charisma": 7,
      "corruption": 6,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-mt-secretary_of_state",
    "officeId": "MT-secretary_of_state",
    "name": "Christi Jacobsen",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "MT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Business Mindset",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Streamlined Online Filings"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-mt-state_auditor",
    "officeId": "MT-state_auditor",
    "name": "James Brown",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor (Sec & Ins)",
    "seat": "Sec & Ins",
    "stateId": "MT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Attorney / Land Advocate",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Polished",
      "Regulatory Realist"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 8,
      "charisma": 3,
      "corruption": 5,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-mt-superintendent_of_education",
    "officeId": "MT-superintendent_of_education",
    "name": "Susie Hedalen",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "stateId": "MT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Rural Superintendent",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Classroom Experience"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 7,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ne-attorney_general",
    "officeId": "NE-attorney_general",
    "name": "Mike Hilgers",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "NE",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Intellectual Conservative",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Former Speaker",
      "Energy Litigator"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 7,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-ne-secretary_of_state",
    "officeId": "NE-secretary_of_state",
    "name": "Bob Evnen",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "NE",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Business Litigator",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Solid Administrator"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 7,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ne-state_treasurer",
    "officeId": "NE-state_treasurer",
    "name": "Tom Briese",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "NE",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Farmer & Ex-Revenue Chair",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Agricultural Tax Reformer"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 6,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ne-state_auditor",
    "officeId": "NE-state_auditor",
    "name": "Mike Foley",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor of Public Accounts",
    "seat": "At-Large",
    "stateId": "NE",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Former Lt Gov / Longtime Auditor",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "Tenacious Waste Hunter"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 6,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nv-lieutenant_governor",
    "officeId": "NV-lieutenant_governor",
    "name": "Stavros Anthony",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "NV",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Retired Police Captain / Councilman",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Tourism & Small Business Advocate"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 7,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 7,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-nv-attorney_general",
    "officeId": "NV-attorney_general",
    "name": "Aaron Ford",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "NV",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_black_voters",
    "factionLabel": "Civil Rights / Skilled Prosecutor",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Charismatic",
      "Former Majority Leader"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nv-secretary_of_state",
    "officeId": "NV-secretary_of_state",
    "name": "Francisco Aguilar",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "NV",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Sports Executive / Attorney",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Polished",
      "Business-Friendly Modernizer"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 6,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nv-state_treasurer",
    "officeId": "NV-state_treasurer",
    "name": "Zach Conine",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "NV",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Gaming & Hotel Finance",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Infrastructure Bank Architect"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 8,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nv-state_comptroller",
    "officeId": "NV-state_comptroller",
    "name": "Andy Matthews",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "State Controller",
    "seat": "At-Large",
    "stateId": "NV",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Think Tank Executive",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Rough",
      "Spending Transparency Crusader"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 6,
      "charisma": 4,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nm-attorney_general",
    "officeId": "NM-attorney_general",
    "name": "Ra\u00fal Torrez",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "NM",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Veteran District Attorney",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Established Politician",
      "Public Safety Focus"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 7,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nm-secretary_of_state",
    "officeId": "NM-secretary_of_state",
    "name": "Maggie Toulouse Oliver",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "NM",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "National Voting Rights Leader",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Polished",
      "Election Integrity Dean"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 9,
      "debate": 7,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nm-state_treasurer",
    "officeId": "NM-state_treasurer",
    "name": "Laura Montoya",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "NM",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "County Finance Official",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Conservative Fiscal Roots"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 6,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-nm-state_auditor",
    "officeId": "NM-state_auditor",
    "name": "Joseph Maestas",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "NM",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Civil Engineer & Regulator",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Rigorous Infrastructure Audits"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-nm-public_lands_commissioner",
    "officeId": "NM-public_lands_commissioner",
    "name": "Stephanie Garcia Richard",
    "office": "statewide_executive",
    "subOffice": "public_lands_commissioner",
    "title": "Public Lands Commissioner",
    "seat": "At-Large",
    "stateId": "NM",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "Teacher / Environmental Ally",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Multi-Billion Trust Land Energy Boss"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 9,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ny-attorney_general",
    "officeId": "NY-attorney_general",
    "name": "Letitia James",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "NY",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "Progressive / Civil Rights",
    "isIncumbent": true,
    "traits": [
      "Corrupt",
      "Polished",
      "High-Stakes Financial Fraud Crusader"
    ],
    "quality": 8.3,
    "skill": 4,
    "fame": 92,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 6,
      "fundraising": 10,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ny-state_comptroller",
    "officeId": "NY-state_comptroller",
    "name": "Thomas DiNapoli",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "State Comptroller",
    "seat": "At-Large",
    "stateId": "NY",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Long Island Moderate",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "\\$250B+ Pension Titan",
      "Fiscal Prudence"
    ],
    "quality": 8.1,
    "skill": 4,
    "fame": 75,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 9,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nc-lieutenant_governor",
    "officeId": "NC-lieutenant_governor",
    "name": "Rachel Hunt",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Education / Suburban Moderate",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Ex-Gov Hunt Legacy",
      "Composed"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 9,
      "charisma": 7,
      "corruption": 4,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nc-attorney_general",
    "officeId": "NC-attorney_general",
    "name": "Jeff Jackson",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Combat Veteran / TikTok Sensation",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Established Politician",
      "Viral Communicator",
      "National Star"
    ],
    "quality": 8.2,
    "skill": 4,
    "fame": 88,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 9,
      "charisma": 7,
      "corruption": 6,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 10,
      "mediaSavvy": 8,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-nc-secretary_of_state",
    "officeId": "NC-secretary_of_state",
    "name": "Elaine Marshall",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Southern Moderate Giant",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "First Woman Elected",
      "28-Yr Legend"
    ],
    "quality": 8.0,
    "skill": 4,
    "fame": 78,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 7,
      "debate": 9,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-nc-state_treasurer",
    "officeId": "NC-state_treasurer",
    "name": "Brad Briner",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Investment Chief",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Managed Global Philanthropic Billions"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-nc-state_auditor",
    "officeId": "NC-state_auditor",
    "name": "Dave Boliek",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "University Trustee Board Chair",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Disciplined",
      "Budget Scrutiny",
      "Tough Mindset"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nc-superintendent_of_education",
    "officeId": "NC-superintendent_of_education",
    "name": "Maurice Green (Mo Green)",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Former Superintendent & Foundation Head",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Stellar Civic Endorsements"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 8,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 6,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-nc-agriculture_commissioner",
    "officeId": "NC-agriculture_commissioner",
    "name": "Steve Troxler",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Tobacco Farmer / Agricultural Giant",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Unstoppable Bipartisan Appeal"
    ],
    "quality": 8.0,
    "skill": 4,
    "fame": 75,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nc-labor_commissioner",
    "officeId": "NC-labor_commissioner",
    "name": "Luke Farley",
    "office": "statewide_executive",
    "subOffice": "labor_commissioner",
    "title": "Commissioner of Labor",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Workplace Safety Attorney",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Industry Advocate",
      "Focused"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 8,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nc-insurance_commissioner",
    "officeId": "NC-insurance_commissioner",
    "name": "Mike Causey",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "NC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_suburban_moderates",
    "factionLabel": "Independent Republican",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Consumer Rate Fighter",
      "Scrappy"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 6,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-nd-attorney_general",
    "officeId": "ND-attorney_general",
    "name": "Drew Wrigley",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_neo_cons",
    "factionLabel": "Federal Prosecutor",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Elite Legal Mind",
      "Connected"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 9,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nd-secretary_of_state",
    "officeId": "ND-secretary_of_state",
    "name": "Michael Howe",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "6th Gen Farmer & Lawmaker",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Election Technology Specialist"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 6,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nd-state_auditor",
    "officeId": "ND-state_auditor",
    "name": "Joshua Gallion",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_suburban_moderates",
    "factionLabel": "Military Vet / Independent Auditor",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Undisciplined",
      "Defies Legislature on Spending"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 8,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nd-tax_commissioner",
    "officeId": "ND-tax_commissioner",
    "name": "Brian Kroshus",
    "office": "statewide_executive",
    "subOffice": "tax_commissioner",
    "title": "State Tax Commissioner",
    "seat": "At-Large",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Ex-PSC Commissioner",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Oil & Gas Royalty Expert"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 4,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-nd-agriculture_commissioner",
    "officeId": "ND-agriculture_commissioner",
    "name": "Doug Goehring",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Wheat Farmer / Export Champion",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Global Agri-Trade Veteran"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 9,
      "debate": 9,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-nd-insurance_commissioner",
    "officeId": "ND-insurance_commissioner",
    "name": "Jon Godfread",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Basketball Pro / Insurance Scholar",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "National Regulatory Chair"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 8,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nd-public_service_commission-1",
    "officeId": "ND-public_service_commission-1",
    "name": "Randy Christmann",
    "office": "statewide_executive",
    "subOffice": "public_service_commission",
    "title": "Public Service Comm (Seat 1)",
    "seat": "Seat 1",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Rancher / Utility Watchdog",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Grid Reliability Hawk"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 7,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-nd-public_service_commission-2",
    "officeId": "ND-public_service_commission-2",
    "name": "Sheri Haugen-Hoffart",
    "office": "statewide_executive",
    "subOffice": "public_service_commission",
    "title": "Public Service Comm (Seat 2)",
    "seat": "Seat 2",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Energy Workforce Leader",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Pipeline & Gas Permitting"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 45,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 3,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 3,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-nd-public_service_commission-3",
    "officeId": "ND-public_service_commission-3",
    "name": "Julie Fedorchak",
    "office": "statewide_executive",
    "subOffice": "public_service_commission",
    "title": "Public Service Comm (Seat 3)",
    "seat": "Seat 3",
    "stateId": "ND",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Respected Energy Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Decades of Utility Governance"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 7,
      "charisma": 4,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-oh-attorney_general",
    "officeId": "OH-attorney_general",
    "name": "Dave Yost",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "OH",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Investigative Journalist / Auditor",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Polished",
      "Masterful Speaker",
      "Anti-Monopoly"
    ],
    "quality": 8.0,
    "skill": 4,
    "fame": 78,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 9,
      "charisma": 6,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 9,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-oh-secretary_of_state",
    "officeId": "OH-secretary_of_state",
    "name": "Frank LaRose",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "OH",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Green Beret Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Rising Star",
      "Ballot Issue Strategist"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 74,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 9,
      "charisma": 8,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 10,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-oh-state_treasurer",
    "officeId": "OH-state_treasurer",
    "name": "Robert Sprague",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "OH",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Management Consultant",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Innovative Bond Financing",
      "Steady"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 6,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-oh-state_auditor",
    "officeId": "OH-state_auditor",
    "name": "Keith Faber",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor of State",
    "seat": "At-Large",
    "stateId": "OH",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Former Senate President",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "Aggressive School & Muni Audits"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 65,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 6,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ok-lieutenant_governor",
    "officeId": "OK-lieutenant_governor",
    "name": "Matt Pinnell",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Tourism & Economic Development",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Modern Brand Builder",
      "Smooth"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 65,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 7,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ok-attorney_general",
    "officeId": "OK-attorney_general",
    "name": "Gentner Drummond",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Rancher / Fighter Pilot / Attorney",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rough",
      "Independent Powerhouse",
      "Feuds w/ Gov"
    ],
    "quality": 8.1,
    "skill": 4,
    "fame": 76,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 9,
      "charisma": 7,
      "corruption": 6,
      "fundraising": 9,
      "fieldcraft": 9,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ok-state_treasurer",
    "officeId": "OK-state_treasurer",
    "name": "Todd Russ",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Community Banker",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Energy Boycott Law Enforcer"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ok-state_auditor",
    "officeId": "OK-state_auditor",
    "name": "Cindy Byrd",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor & Inspector",
    "seat": "At-Large",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Forensic CPA",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "High-Profile Corruption Slayer"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 9,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ok-superintendent_of_education",
    "officeId": "OK-superintendent_of_education",
    "name": "Ryan Walters",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Culture Warrior Icon",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Rising Star",
      "National Television Regular",
      "Hardline"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 82,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 8,
      "charisma": 8,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ok-labor_commissioner",
    "officeId": "OK-labor_commissioner",
    "name": "Leslie Osborn",
    "office": "statewide_executive",
    "subOffice": "labor_commissioner",
    "title": "Commissioner of Labor",
    "seat": "At-Large",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Businesswoman / Ex-Budget Chair",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Workers Comp Reformer"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 7,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ok-insurance_commissioner",
    "officeId": "OK-insurance_commissioner",
    "name": "Glen Mulready",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Health Underwriting Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Health Market Stability Hawk"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 6,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ok-corporation_commission-1",
    "officeId": "OK-corporation_commission-1",
    "name": "Todd Hiett",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 1)",
    "seat": "Seat 1",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Rancher & Former Speaker",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Oil & Gas Authority"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 6,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-ok-corporation_commission-2",
    "officeId": "OK-corporation_commission-2",
    "name": "Kim David",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 2)",
    "seat": "Seat 2",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "First Female Majority Leader",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Utility Infrastructure Champion"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 6,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ok-corporation_commission-3",
    "officeId": "OK-corporation_commission-3",
    "name": "Brian Bingman",
    "office": "statewide_executive",
    "subOffice": "corporation_commission",
    "title": "Corporation Comm (Seat 3)",
    "seat": "Seat 3",
    "stateId": "OK",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Petroleum Landman / Senate Pres",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Decades of Energy Experience"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-or-secretary_of_state",
    "officeId": "OR-secretary_of_state",
    "name": "Tobias Read",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "OR",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Former Treasurer / Moderate",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Stabilizing Voice",
      "Pension Reformer"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 6,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-or-attorney_general",
    "officeId": "OR-attorney_general",
    "name": "Dan Rayfield",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "OR",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Former House Speaker",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Proven Legislative Negotiator"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-or-state_treasurer",
    "officeId": "OR-state_treasurer",
    "name": "Elizabeth Steiner",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "OR",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Family Physician / Budget Co-Chair",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Evidence-Based Fiscal Steward"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 9,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-pa-attorney_general",
    "officeId": "PA-attorney_general",
    "name": "Dave Sunday",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "PA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Chief County Prosecutor",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Smart on Crime",
      "Bipartisan Drug Reform"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 8,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 8,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-pa-state_treasurer",
    "officeId": "PA-state_treasurer",
    "name": "Stacy Garrity",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "PA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Desert Storm Combat Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Unclaimed Property Champion",
      "Direct"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 7,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-pa-state_auditor",
    "officeId": "PA-state_auditor",
    "name": "Timothy DeFoor",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "Auditor General",
    "seat": "At-Large",
    "stateId": "PA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Forensic Fraud Specialist",
    "isIncumbent": true,
    "traits": [
      "Corrupt",
      "Squeaky Clean",
      "First Black Row Officer",
      "Nonpartisan Tone"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ri-lieutenant_governor",
    "officeId": "RI-lieutenant_governor",
    "name": "Sabina Matos",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "RI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Community Organizer / Council Pres",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Housing Advocate",
      "Resilient"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 55,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ri-attorney_general",
    "officeId": "RI-attorney_general",
    "name": "Peter Neronha",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "RI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Federal U.S. Attorney",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Corporate Hospital Watchdog"
    ],
    "quality": 7.9,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ri-secretary_of_state",
    "officeId": "RI-secretary_of_state",
    "name": "Gregg Amore",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "RI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_bernie_bros",
    "factionLabel": "History Teacher / Hockey Coach",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Civics Champion",
      "Well Liked"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ri-state_treasurer",
    "officeId": "RI-state_treasurer",
    "name": "James Diossa",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "General Treasurer",
    "seat": "At-Large",
    "stateId": "RI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Young Reform Mayor",
    "isIncumbent": true,
    "traits": [
      "Rising Star",
      "Established Politician",
      "Municipal Turnaround Credentials"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 8,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-sc-attorney_general",
    "officeId": "SC-attorney_general",
    "name": "Alan Wilson",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "SC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_neo_cons",
    "factionLabel": "Military JAG / Longtime AG",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Conservative Legal Anchor"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 9,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-sc-secretary_of_state",
    "officeId": "SC-secretary_of_state",
    "name": "Mark Hammond",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "SC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Decades in Statehouse",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Quiet Traditionalist"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 8,
      "charisma": 4,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-sc-state_treasurer",
    "officeId": "SC-state_treasurer",
    "name": "Curtis Loftis",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "SC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Entrepreneur & Philanthropist",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "High Return Fund Advocate"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-sc-state_comptroller",
    "officeId": "SC-state_comptroller",
    "name": "Brian White",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "Comptroller General",
    "seat": "At-Large",
    "stateId": "SC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Veteran Lawmaker",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Accounting Consolidation Lead"
    ],
    "quality": 6.8,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 6,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-sc-superintendent_of_education",
    "officeId": "SC-superintendent_of_education",
    "name": "Ellen Weaver",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "Supt of Education",
    "seat": "At-Large",
    "stateId": "SC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Think Tank Executive",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "School Choice Crusader"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-sc-agriculture_commissioner",
    "officeId": "SC-agriculture_commissioner",
    "name": "Hugh Weathers",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "SC",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "4th Gen Dairy Farmer",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Agribusiness Growth Pillar"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-sd-attorney_general",
    "officeId": "SD-attorney_general",
    "name": "Marty Jackley",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Veteran U.S. Attorney",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Experienced Law Enforcement Anchor"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 65,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-sd-secretary_of_state",
    "officeId": "SD-secretary_of_state",
    "name": "Monae Johnson",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Longtime Elections Deputy",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Paper Ballot Security Defender"
    ],
    "quality": 6.6,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 7,
      "debate": 6,
      "charisma": 4,
      "corruption": 4,
      "fundraising": 4,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-sd-state_treasurer",
    "officeId": "SD-state_treasurer",
    "name": "Josh Haeder",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Community Banker",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Unclaimed Property Outreach"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 6,
      "charisma": 3,
      "corruption": 4,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-sd-state_auditor",
    "officeId": "SD-state_auditor",
    "name": "Rich Sattgast",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Veteran State Officer",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "Budget Compliance Veteran"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 46,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 6,
      "charisma": 3,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-sd-public_lands_commissioner",
    "officeId": "SD-public_lands_commissioner",
    "name": "Brock Greenfield",
    "office": "statewide_executive",
    "subOffice": "public_lands_commissioner",
    "title": "School & Public Lands",
    "seat": "At-Large",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Former Senate Pro Tem",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "School Endowment Land Lease Master"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 6,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-sd-public_utilities_commission-1",
    "officeId": "SD-public_utilities_commission-1",
    "name": "Kristie Fiegen",
    "office": "statewide_executive",
    "subOffice": "public_utilities_commission",
    "title": "Public Utilities (Seat 1)",
    "seat": "Seat 1",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Non-Profit Exec / Energy Regulator",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Telecommunications & Grain Specialist"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 6,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-sd-public_utilities_commission-2",
    "officeId": "SD-public_utilities_commission-2",
    "name": "Gary Hanson",
    "office": "statewide_executive",
    "subOffice": "public_utilities_commission",
    "title": "Public Utilities (Seat 2)",
    "seat": "Seat 2",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Former Mayor of Sioux Falls",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Utility Rate Watchdog"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 6,
      "debate": 8,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-sd-public_utilities_commission-3",
    "officeId": "SD-public_utilities_commission-3",
    "name": "Chris Nelson",
    "office": "statewide_executive",
    "subOffice": "public_utilities_commission",
    "title": "Public Utilities (Seat 3)",
    "seat": "Seat 3",
    "stateId": "SD",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Former Secretary of State",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Landmark Carbon Pipeline Arbiter"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 10,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-tx-lieutenant_governor",
    "officeId": "TX-lieutenant_governor",
    "name": "Dan Patrick",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_faith_and_flag",
    "factionLabel": "Christian Conservative / Media",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "De Facto Ruler of Senate",
      "Unrelenting"
    ],
    "quality": 8.3,
    "skill": 4,
    "fame": 90,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 5,
      "fundraising": 9,
      "fieldcraft": 9,
      "experience": 9,
      "mediaSavvy": 9,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-tx-attorney_general",
    "officeId": "TX-attorney_general",
    "name": "Ken Paxton",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Hardline Movement Leader",
    "isIncumbent": true,
    "traits": [
      "Corrupt",
      "Polished",
      "Impeachment Survivor",
      "Federal Scourge"
    ],
    "quality": 7.9,
    "skill": 4,
    "fame": 92,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 8,
      "corruption": 4,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 8,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-tx-state_comptroller",
    "officeId": "TX-state_comptroller",
    "name": "Glenn Hegar",
    "office": "statewide_executive",
    "subOffice": "state_comptroller",
    "title": "Comptroller of Accounts",
    "seat": "At-Large",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Farmer / Tax Attorney",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Revenue Forecasting Master",
      "Pragmatist"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 6,
      "corruption": 5,
      "fundraising": 8,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-tx-public_lands_commissioner",
    "officeId": "TX-public_lands_commissioner",
    "name": "Dawn Buckingham",
    "office": "statewide_executive",
    "subOffice": "public_lands_commissioner",
    "title": "Land Commissioner (GLO)",
    "seat": "GLO",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Ophthalmic Surgeon / Ex-Senator",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Manages Alamo & 13M Acres"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 66,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-tx-agriculture_commissioner",
    "officeId": "TX-agriculture_commissioner",
    "name": "Sid Miller",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Rodeo Champion / Country Style",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Disciplined",
      "Outspoken",
      "Trade Mission Leader"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 74,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 7,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-tx-railroad_commission-1",
    "officeId": "TX-railroad_commission-1",
    "name": "Christi Craddick",
    "office": "statewide_executive",
    "subOffice": "railroad_commission",
    "title": "Railroad Comm (Seat 1)",
    "seat": "Seat 1",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Oil & Gas Attorney",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Decades of Permitting Expertise"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-tx-railroad_commission-2",
    "officeId": "TX-railroad_commission-2",
    "name": "Wayne Christian",
    "office": "statewide_executive",
    "subOffice": "railroad_commission",
    "title": "Railroad Comm (Seat 2)",
    "seat": "Seat 2",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Financial Planner / Rock Musician",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Fossil Fuel Evangelist"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 6,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-tx-railroad_commission-3",
    "officeId": "TX-railroad_commission-3",
    "name": "Jim Wright",
    "office": "statewide_executive",
    "subOffice": "railroad_commission",
    "title": "Railroad Comm (Seat 3)",
    "seat": "Seat 3",
    "stateId": "TX",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Energy Environmental Contractor",
    "isIncumbent": true,
    "traits": [
      "Disciplined",
      "Established Politician",
      "Practical Regulator"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 7,
      "charisma": 4,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ut-attorney_general",
    "officeId": "UT-attorney_general",
    "name": "Derek Brown",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "UT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_mormons",
    "factionLabel": "Constitutional Scholar / Ex-Party Chair",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Steady Establishment Reformer"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 9,
      "debate": 9,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-ut-state_treasurer",
    "officeId": "UT-state_treasurer",
    "name": "Marlo Oaks",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "UT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_mormons",
    "factionLabel": "Wall Street Portfolio Manager",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "ESG Resistance Pioneer"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 8,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 5,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-ut-state_auditor",
    "officeId": "UT-state_auditor",
    "name": "Tina Cannon",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "UT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "County Finance Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "Data-Driven Oversight"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 48,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 6,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 4,
      "fieldcraft": 7,
      "experience": 7,
      "mediaSavvy": 5,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-vt-lieutenant_governor",
    "officeId": "VT-lieutenant_governor",
    "name": "John Rodgers",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "VT",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_suburban_moderates",
    "factionLabel": "Moderate Republican / Rural Coalition",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "High Independent Appeal",
      "2-Yr Cycle"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 7,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-vt-attorney_general",
    "officeId": "VT-attorney_general",
    "name": "Charity Clark",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "VT",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Consumer Protection Veteran",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Environmental & Consumer Litigator"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-vt-secretary_of_state",
    "officeId": "VT-secretary_of_state",
    "name": "Sarah Copeland Hanzas",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "VT",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Small Business Owner / Ex-Lawmaker",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Civics & Public Record Champion"
    ],
    "quality": 7.1,
    "skill": 4,
    "fame": 52,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 7,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-vt-state_treasurer",
    "officeId": "VT-state_treasurer",
    "name": "Mike Pieciak",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "VT",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "SEC & Financial Regulator",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Public Pension Restructuring Lead"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-vt-state_auditor",
    "officeId": "VT-state_auditor",
    "name": "Doug Hoffer",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "VT",
    "party": "people",
    "rawParty": "P/D",
    "factionId": "dem_neo_liberals",
    "factionLabel": "Policy Analyst / Fiscal Watchdog",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Independent Audits",
      "Non-Partisan Eye"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 9,
      "debate": 8,
      "charisma": 7,
      "corruption": 4,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-va-lieutenant_governor",
    "officeId": "VA-lieutenant_governor",
    "name": "Winsome Earle-Sears",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "VA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Marine Veteran / Fiery Orator",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Breaks Senate Ties",
      "High Energy"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 78,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 3,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-va-attorney_general",
    "officeId": "VA-attorney_general",
    "name": "Jason Miyares",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "VA",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Former Prosecutor",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Rising Star",
      "Victims' Rights Advocate",
      "Resolute"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 76,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 8,
      "corruption": 6,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 9,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-wa-lieutenant_governor",
    "officeId": "WA-lieutenant_governor",
    "name": "Denny Heck",
    "office": "statewide_executive",
    "subOffice": "lieutenant_governor",
    "title": "Lieutenant Governor",
    "seat": "At-Large",
    "stateId": "WA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Former U.S. Congressman",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Polished",
      "Congressional Veteran",
      "Diplomatic"
    ],
    "quality": 7.7,
    "skill": 4,
    "fame": 70,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 8,
      "charisma": 5,
      "corruption": 4,
      "fundraising": 7,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-wa-attorney_general",
    "officeId": "WA-attorney_general",
    "name": "Nick Brown",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "WA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "U.S. Attorney / Army JAG",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "High Caliber Litigator"
    ],
    "quality": 7.8,
    "skill": 4,
    "fame": 72,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 8,
      "debate": 7,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 8,
      "fieldcraft": 9,
      "experience": 10,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-wa-secretary_of_state",
    "officeId": "WA-secretary_of_state",
    "name": "Steve Hobbs",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "WA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_blue_dog",
    "factionLabel": "Moderate / Military Officer",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Cybersecurity & Election Fortress"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 64,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 9,
      "debate": 8,
      "charisma": 6,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 8,
      "mediaSavvy": 5,
      "regionalStrength": 10
    }
  },
  {
    "id": "sitting-seo-wa-state_treasurer",
    "officeId": "WA-state_treasurer",
    "name": "Mike Pellicciotti",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "WA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Former Fraud Prosecutor",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Polished",
      "Refuses Corporate PACs",
      "Top Rating"
    ],
    "quality": 7.6,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-wa-state_auditor",
    "officeId": "WA-state_auditor",
    "name": "Pat McCarthy",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "WA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Decades in County & State Audit",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Squeaky Clean",
      "Tenacious Local Government Watchdog"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 4,
      "corruption": 3,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-wa-public_lands_commissioner",
    "officeId": "WA-public_lands_commissioner",
    "name": "Dave Upthegrove",
    "office": "statewide_executive",
    "subOffice": "public_lands_commissioner",
    "title": "Public Lands Commissioner",
    "seat": "At-Large",
    "stateId": "WA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Conservationist Leader",
    "isIncumbent": true,
    "traits": [
      "Rough",
      "Established Politician",
      "Forest Fire Resilience & Timber Balance"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 8,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 7,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-wa-insurance_commissioner",
    "officeId": "WA-insurance_commissioner",
    "name": "Patty Kuderer",
    "office": "statewide_executive",
    "subOffice": "insurance_commissioner",
    "title": "Insurance Commissioner",
    "seat": "At-Large",
    "stateId": "WA",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Consumer Protection Attorney",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Health Care Access Champion"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 58,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 8,
      "charisma": 5,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-wv-secretary_of_state",
    "officeId": "WV-secretary_of_state",
    "name": "Kris Warner",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "WV",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Longtime Party Executive",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Rough",
      "Election Security Hardliner"
    ],
    "quality": 7.0,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 5,
      "corruption": 2,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-wv-attorney_general",
    "officeId": "WV-attorney_general",
    "name": "JB McCuskey",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "WV",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Ex-Auditor / Real Estate Attorney",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Polished",
      "Modernizes State Legal Operations"
    ],
    "quality": 7.5,
    "skill": 4,
    "fame": 65,
    "happiness": 72,
    "ratings": {
      "persuadability": 9,
      "turnout": 9,
      "debate": 9,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 9,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-wv-state_treasurer",
    "officeId": "WV-state_treasurer",
    "name": "Larry Pack",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "WV",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Senior Statesman / Business Owner",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Direct Cash & Unclaimed Property Lead"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 7,
      "debate": 8,
      "charisma": 6,
      "corruption": 6,
      "fundraising": 6,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 7,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-wv-state_auditor",
    "officeId": "WV-state_auditor",
    "name": "Mark Hunt",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "WV",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Former Senator & Attorney",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Polished",
      "Municipal Spending Auditor"
    ],
    "quality": 6.9,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 6,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 4,
      "fieldcraft": 6,
      "experience": 7,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-wv-agriculture_commissioner",
    "officeId": "WV-agriculture_commissioner",
    "name": "Kent Leonhardt",
    "office": "statewide_executive",
    "subOffice": "agriculture_commissioner",
    "title": "Agriculture Commissioner",
    "seat": "At-Large",
    "stateId": "WV",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Marine Lt. Colonel & Farmer",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Agribusiness & Food Desert Warrior"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 60,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 7,
      "charisma": 4,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 7,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-wi-attorney_general",
    "officeId": "WI-attorney_general",
    "name": "Josh Kaul",
    "office": "statewide_executive",
    "subOffice": "attorney_general",
    "title": "Attorney General",
    "seat": "At-Large",
    "stateId": "WI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Federal Prosecutor",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "High-Stakes Swing-State Defender"
    ],
    "quality": 7.9,
    "skill": 4,
    "fame": 78,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 9,
      "fieldcraft": 7,
      "experience": 10,
      "mediaSavvy": 8,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-wi-secretary_of_state",
    "officeId": "WI-secretary_of_state",
    "name": "Sarah Godlewski",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "WI",
    "party": "people",
    "rawParty": "D",
    "factionId": "dem_liberal_establishment",
    "factionLabel": "Former State Treasurer",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "Direct Democracy Defender"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 8,
      "debate": 8,
      "charisma": 7,
      "corruption": 2,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 7,
      "mediaSavvy": 8,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-wi-state_treasurer",
    "officeId": "WI-state_treasurer",
    "name": "John Leiber",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "WI",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Small Business Attorney",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Disciplined",
      "Fiscal Prudence",
      "Conservative Steward"
    ],
    "quality": 6.7,
    "skill": 3,
    "fame": 50,
    "happiness": 72,
    "ratings": {
      "persuadability": 6,
      "turnout": 6,
      "debate": 8,
      "charisma": 5,
      "corruption": 5,
      "fundraising": 5,
      "fieldcraft": 6,
      "experience": 8,
      "mediaSavvy": 4,
      "regionalStrength": 8
    }
  },
  {
    "id": "sitting-seo-wy-secretary_of_state",
    "officeId": "WY-secretary_of_state",
    "name": "Chuck Gray",
    "office": "statewide_executive",
    "subOffice": "secretary_of_state",
    "title": "Secretary of State",
    "seat": "At-Large",
    "stateId": "WY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_maga",
    "factionLabel": "Freedom Caucus / Broadcaster",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "Vocal Election Integrity Champion"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 68,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 6,
      "debate": 8,
      "charisma": 7,
      "corruption": 6,
      "fundraising": 8,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-wy-state_treasurer",
    "officeId": "WY-state_treasurer",
    "name": "Curt Meier",
    "office": "statewide_executive",
    "subOffice": "state_treasurer",
    "title": "State Treasurer",
    "seat": "At-Large",
    "stateId": "WY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_traditional_farmers",
    "factionLabel": "Longtime Rancher & State Senator",
    "isIncumbent": true,
    "traits": [
      "Established Politician",
      "Disciplined",
      "\\$20B+ Sovereign Wealth Fund Pilot"
    ],
    "quality": 7.3,
    "skill": 4,
    "fame": 56,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 7,
      "debate": 7,
      "charisma": 4,
      "corruption": 6,
      "fundraising": 7,
      "fieldcraft": 8,
      "experience": 8,
      "mediaSavvy": 6,
      "regionalStrength": 9
    }
  },
  {
    "id": "sitting-seo-wy-state_auditor",
    "officeId": "WY-state_auditor",
    "name": "Kristi Racines",
    "office": "statewide_executive",
    "subOffice": "state_auditor",
    "title": "State Auditor",
    "seat": "At-Large",
    "stateId": "WY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "CPA / Judicial Finance Director",
    "isIncumbent": true,
    "traits": [
      "Squeaky Clean",
      "Established Politician",
      "State Payroll Transparency Leader"
    ],
    "quality": 7.2,
    "skill": 4,
    "fame": 54,
    "happiness": 72,
    "ratings": {
      "persuadability": 7,
      "turnout": 8,
      "debate": 7,
      "charisma": 6,
      "corruption": 3,
      "fundraising": 6,
      "fieldcraft": 6,
      "experience": 9,
      "mediaSavvy": 4,
      "regionalStrength": 7
    }
  },
  {
    "id": "sitting-seo-wy-superintendent_of_education",
    "officeId": "WY-superintendent_of_education",
    "name": "Megan Degenfelder",
    "office": "statewide_executive",
    "subOffice": "superintendent_of_education",
    "title": "Supt of Public Instruction",
    "seat": "At-Large",
    "stateId": "WY",
    "party": "heritage",
    "rawParty": "R",
    "factionId": "gop_market_country_club",
    "factionLabel": "Energy Executive / Education Analyst",
    "isIncumbent": true,
    "traits": [
      "Polished",
      "Established Politician",
      "Career & Technical Training Voice"
    ],
    "quality": 7.4,
    "skill": 4,
    "fame": 62,
    "happiness": 72,
    "ratings": {
      "persuadability": 8,
      "turnout": 8,
      "debate": 6,
      "charisma": 7,
      "corruption": 4,
      "fundraising": 5,
      "fieldcraft": 8,
      "experience": 9,
      "mediaSavvy": 5,
      "regionalStrength": 9
    }
  }
];

function isStatewideOfficeOnCycle(officeDef, year = 2028) {
  if (!officeDef) return false;
  const y = Number(year) || 2028;
  if (officeDef.cycle === 'annual_2yr') return true;
  if (officeDef.cycle === 'presidential') return y % 4 === 0;
  if (officeDef.cycle === 'midterm' || officeDef.cycle === 'odd_year') return y % 4 === 2;
  if (officeDef.cycle === 'staggered_6yr') {
    const nextY = Number(officeDef.nextElectionYear) || 2028;
    return Math.abs(y - nextY) % 6 === 0;
  }
  return y % 4 === 0;
}


// ============================================================================
// VERSION 0.16.8: PRESIDENTIAL PRIMARY SYSTEM MASTER TABLES & DELEGATE RULES
// ============================================================================
const PRIMARY_CANDIDATE_PALETTE = ["#1f77b4", "#d62728", "#2ca02c", "#ff7f0e", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#393b79", "#843c39", "#637939", "#8c6d31", "#7b4173"];

const DNC_MASTER_DELEGATES_2028 = {"AL": {"pledged": 52, "total": 59}, "AK": {"pledged": 15, "total": 19}, "AZ": {"pledged": 72, "total": 85}, "AR": {"pledged": 31, "total": 36}, "CA": {"pledged": 424, "total": 494}, "CO": {"pledged": 72, "total": 87}, "CT": {"pledged": 60, "total": 74}, "DE": {"pledged": 19, "total": 26}, "FL": {"pledged": 224, "total": 246}, "GA": {"pledged": 108, "total": 124}, "HI": {"pledged": 22, "total": 31}, "ID": {"pledged": 23, "total": 27}, "IL": {"pledged": 147, "total": 177}, "IN": {"pledged": 79, "total": 88}, "IA": {"pledged": 40, "total": 46}, "KS": {"pledged": 33, "total": 39}, "KY": {"pledged": 53, "total": 60}, "LA": {"pledged": 48, "total": 54}, "ME": {"pledged": 24, "total": 32}, "MD": {"pledged": 95, "total": 118}, "MA": {"pledged": 92, "total": 116}, "MI": {"pledged": 117, "total": 140}, "MN": {"pledged": 75, "total": 92}, "MS": {"pledged": 35, "total": 40}, "MO": {"pledged": 64, "total": 70}, "MT": {"pledged": 20, "total": 25}, "NE": {"pledged": 29, "total": 34}, "NV": {"pledged": 36, "total": 48}, "NH": {"pledged": 25, "total": 33}, "NJ": {"pledged": 126, "total": 146}, "NM": {"pledged": 34, "total": 45}, "NY": {"pledged": 268, "total": 307}, "NC": {"pledged": 116, "total": 130}, "ND": {"pledged": 13, "total": 18}, "OH": {"pledged": 127, "total": 143}, "OK": {"pledged": 36, "total": 41}, "OR": {"pledged": 66, "total": 78}, "PA": {"pledged": 159, "total": 186}, "RI": {"pledged": 26, "total": 35}, "SC": {"pledged": 55, "total": 65}, "SD": {"pledged": 16, "total": 21}, "TN": {"pledged": 63, "total": 70}, "TX": {"pledged": 244, "total": 273}, "UT": {"pledged": 30, "total": 34}, "VT": {"pledged": 16, "total": 24}, "VA": {"pledged": 99, "total": 119}, "WA": {"pledged": 92, "total": 111}, "WV": {"pledged": 20, "total": 25}, "WI": {"pledged": 82, "total": 95}, "WY": {"pledged": 14, "total": 18}, "DC": {"pledged": 20, "total": 50}, "TERR": {"pledged": 78, "total": 118}};

const RNC_MASTER_DELEGATES_2028 = {"AL": {"total": 50, "rule": "gop_triggered_wtm"}, "AK": {"total": 29, "rule": "pure_proportional"}, "AZ": {"total": 43, "rule": "gop_wta"}, "AR": {"total": 40, "rule": "gop_triggered_wtm"}, "CA": {"total": 159, "rule": "gop_triggered_wtm"}, "CO": {"total": 37, "rule": "dnc_prop_15"}, "CT": {"total": 28, "rule": "gop_triggered_wtm"}, "DE": {"total": 16, "rule": "gop_wta"}, "FL": {"total": 125, "rule": "gop_wta"}, "GA": {"total": 59, "rule": "gop_triggered_wtm"}, "HI": {"total": 19, "rule": "dnc_prop_15"}, "ID": {"total": 32, "rule": "gop_triggered_wtm"}, "IL": {"total": 64, "rule": "loophole_direct"}, "IN": {"total": 58, "rule": "gop_wta"}, "IA": {"total": 40, "rule": "pure_proportional"}, "KS": {"total": 39, "rule": "pure_proportional"}, "KY": {"total": 46, "rule": "dnc_prop_15"}, "LA": {"total": 47, "rule": "gop_triggered_wtm"}, "ME": {"total": 20, "rule": "dnc_prop_15"}, "MD": {"total": 38, "rule": "gop_wta"}, "MA": {"total": 40, "rule": "dnc_prop_15"}, "MI": {"total": 55, "rule": "pure_proportional"}, "MN": {"total": 39, "rule": "dnc_prop_15"}, "MS": {"total": 40, "rule": "dnc_prop_15"}, "MO": {"total": 54, "rule": "gop_triggered_wtm"}, "MT": {"total": 31, "rule": "gop_wta"}, "NE": {"total": 36, "rule": "gop_wta"}, "NV": {"total": 26, "rule": "pure_proportional"}, "NH": {"total": 22, "rule": "pure_proportional"}, "NJ": {"total": 49, "rule": "gop_wta"}, "NM": {"total": 22, "rule": "dnc_prop_15"}, "NY": {"total": 91, "rule": "gop_triggered_wtm"}, "NC": {"total": 74, "rule": "gop_triggered_wtm"}, "ND": {"total": 29, "rule": "pure_proportional"}, "OH": {"total": 79, "rule": "gop_wta"}, "OK": {"total": 43, "rule": "gop_triggered_wtm"}, "OR": {"total": 31, "rule": "dnc_prop_15"}, "PA": {"total": 67, "rule": "loophole_direct"}, "RI": {"total": 19, "rule": "pure_proportional"}, "SC": {"total": 50, "rule": "gop_triggered_wtm"}, "SD": {"total": 29, "rule": "gop_wta"}, "TN": {"total": 58, "rule": "gop_triggered_wtm"}, "TX": {"total": 151, "rule": "gop_triggered_wtm"}, "UT": {"total": 40, "rule": "gop_triggered_wtm"}, "VT": {"total": 17, "rule": "gop_triggered_wtm"}, "VA": {"total": 48, "rule": "dnc_prop_15"}, "WA": {"total": 43, "rule": "gop_triggered_wtm"}, "WV": {"total": 32, "rule": "gop_wta"}, "WI": {"total": 41, "rule": "gop_triggered_wtm"}, "WY": {"total": 29, "rule": "dnc_prop_15"}, "DC": {"total": 19, "rule": "gop_wta"}, "TERR": {"total": 36, "rule": "dnc_prop_15"}};

const DEFAULT_PRIMARY_SCHEDULES = {"people": [{"id": "dnc_sc", "date": "Feb 3", "label": "South Carolina Primary", "states": ["SC"]}, {"id": "dnc_nv_nh", "date": "Feb 6", "label": "Nevada & New Hampshire", "states": ["NV", "NH"]}, {"id": "dnc_mi", "date": "Feb 27", "label": "Michigan Primary", "states": ["MI"]}, {"id": "dnc_st", "date": "Mar 5", "label": "Super Tuesday", "states": ["AL", "AR", "CA", "CO", "IA", "ME", "MA", "MN", "NC", "OK", "TN", "TX", "UT", "VT", "VA", "WA", "AK", "HI", "ID", "ND", "TERR"]}, {"id": "dnc_mid1", "date": "Mar 12", "label": "Mid-March I", "states": ["GA", "MS", "MO"]}, {"id": "dnc_mid2", "date": "Mar 19", "label": "Mid-March II", "states": ["AZ", "FL", "IL", "KS", "OH", "LA"]}, {"id": "dnc_apr1", "date": "Apr 2", "label": "Early April Primaries", "states": ["CT", "DE", "NY", "RI", "WI", "WY"]}, {"id": "dnc_pa", "date": "Apr 23", "label": "Pennsylvania Primary", "states": ["PA"]}, {"id": "dnc_may", "date": "May 14", "label": "May Primaries", "states": ["IN", "MD", "NE", "WV", "KY", "OR"]}, {"id": "dnc_jun", "date": "Jun 4", "label": "June Finale", "states": ["MT", "NJ", "NM", "SD", "DC"]}], "heritage": [{"id": "rnc_ia", "date": "Jan 15", "label": "Iowa Caucuses", "states": ["IA"]}, {"id": "rnc_nh", "date": "Jan 23", "label": "New Hampshire Primary", "states": ["NH"]}, {"id": "rnc_nv", "date": "Feb 8", "label": "Nevada Caucuses", "states": ["NV"]}, {"id": "rnc_sc", "date": "Feb 24", "label": "South Carolina Primary", "states": ["SC"]}, {"id": "rnc_mi", "date": "Feb 27", "label": "Michigan Primary", "states": ["MI"]}, {"id": "rnc_st", "date": "Mar 5", "label": "Super Tuesday", "states": ["AL", "AK", "AR", "CA", "CO", "ME", "MA", "MN", "NC", "OK", "TN", "TX", "UT", "VT", "VA", "ID", "ND", "TERR"]}, {"id": "rnc_mid1", "date": "Mar 12", "label": "Mid-March I", "states": ["GA", "HI", "MS", "WA"]}, {"id": "rnc_mid2", "date": "Mar 19", "label": "Mid-March II", "states": ["AZ", "FL", "IL", "OH", "KS", "LA", "MO"]}, {"id": "rnc_apr1", "date": "Apr 2", "label": "Early April Primaries", "states": ["CT", "DE", "NY", "RI", "WI", "WY"]}, {"id": "rnc_pa", "date": "Apr 23", "label": "Pennsylvania Primary", "states": ["PA"]}, {"id": "rnc_may", "date": "May 14", "label": "May Primaries", "states": ["IN", "MD", "NE", "WV", "KY", "OR"]}, {"id": "rnc_jun", "date": "Jun 4", "label": "June Finale", "states": ["MT", "NJ", "NM", "SD", "DC"]}], "thirdParty": [{"id": "tp_w1", "date": "Mar 5", "label": "Early Regional Conventions", "states": ["IA", "NH", "SC", "NV", "CA", "TX", "NY", "PA", "MI", "OH"]}, {"id": "tp_w2", "date": "Apr 9", "label": "Spring State Assemblies", "states": ["AL", "AK", "AZ", "AR", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "KS", "KY", "LA", "ME", "MD", "MA", "MN"]}, {"id": "tp_w3", "date": "May 14", "label": "National Convention Finale", "states": ["MS", "MO", "MT", "NE", "NJ", "NM", "NC", "ND", "OK", "OR", "RI", "SD", "TN", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC", "TERR"]}]};

function allocateDelegatesHareNiemeyer(sharesMap, totalDelegates, thresholdPct = 0) {
  const entries = Object.entries(sharesMap || {}).filter(([, v]) => Number(v) >= thresholdPct && Number(v) > 0);
  const out = {};
  Object.keys(sharesMap || {}).forEach((id) => { out[id] = 0; });
  if (!entries.length || totalDelegates <= 0) {
    // Fallback: give to top candidate if nobody cleared threshold
    const top = Object.entries(sharesMap || {}).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
    if (top && totalDelegates > 0) out[top[0]] = totalDelegates;
    return out;
  }
  const sumViable = entries.reduce((acc, [, v]) => acc + Number(v), 0);
  const exacts = entries.map(([id, v]) => {
    const exact = (Number(v) / sumViable) * totalDelegates;
    const floorVal = Math.floor(exact);
    return { id, floorVal, rem: exact - floorVal };
  });
  let allocated = 0;
  exacts.forEach((e) => { out[e.id] = e.floorVal; allocated += e.floorVal; });
  exacts.sort((a, b) => b.rem - a.rem);
  let idx = 0;
  while (allocated < totalDelegates && exacts.length > 0) {
    out[exacts[idx % exacts.length].id] += 1;
    allocated += 1;
    idx += 1;
  }
  return out;
}

const DELEGATE_ALLOCATION_RULES = {
  dnc_prop_15: {
    id: 'dnc_prop_15',
    name: 'Proportional with 15% Threshold',
    allocate(sharesMap, totalDelegates) {
      return allocateDelegatesHareNiemeyer(sharesMap, totalDelegates, 15.0);
    },
  },
  gop_wta: {
    id: 'gop_wta',
    name: 'Winner-Take-All (WTA)',
    allocate(sharesMap, totalDelegates) {
      const out = {};
      Object.keys(sharesMap || {}).forEach((id) => { out[id] = 0; });
      const top = Object.entries(sharesMap || {}).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
      if (top && totalDelegates > 0) out[top[0]] = totalDelegates;
      return out;
    },
  },
  gop_triggered_wtm: {
    id: 'gop_triggered_wtm',
    name: 'Triggered Winner-Take-Most (50% Trigger)',
    allocate(sharesMap, totalDelegates) {
      const ranked = Object.entries(sharesMap || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
      if (ranked.length && Number(ranked[0][1]) >= 50.0) {
        const out = {};
        Object.keys(sharesMap || {}).forEach((id) => { out[id] = 0; });
        out[ranked[0][0]] = totalDelegates;
        return out;
      }
      return allocateDelegatesHareNiemeyer(sharesMap, totalDelegates, 20.0);
    },
  },
  pure_proportional: {
    id: 'pure_proportional',
    name: 'Pure Proportional (No Threshold)',
    allocate(sharesMap, totalDelegates) {
      return allocateDelegatesHareNiemeyer(sharesMap, totalDelegates, 0.0);
    },
  },
  loophole_direct: {
    id: 'loophole_direct',
    name: 'Direct Election / Loophole',
    allocate(sharesMap, totalDelegates) {
      const atLarge = Math.round(totalDelegates * 0.25);
      const districtPool = totalDelegates - atLarge;
      const out = allocateDelegatesHareNiemeyer(sharesMap, atLarge, 15.0);
      const ranked = Object.entries(sharesMap || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
      if (ranked.length) {
        const topShare = Math.min(0.85, Math.max(0.55, Number(ranked[0][1]) / 70));
        const winDist = Math.round(districtPool * topShare);
        out[ranked[0][0]] = (out[ranked[0][0]] || 0) + winDist;
        if (ranked.length > 1) out[ranked[1][0]] = (out[ranked[1][0]] || 0) + (districtPool - winDist);
        else out[ranked[0][0]] += (districtPool - winDist);
      }
      return out;
    },
  },
  convention_caucus: {
    id: 'convention_caucus',
    name: 'Multi-Ballot Convention',
    allocate(sharesMap, totalDelegates) {
      return allocateDelegatesHareNiemeyer(sharesMap, totalDelegates, 5.0);
    },
  },
};


// ============================================================================
// VERSION 0.17.0 REQ-298: STATE & STATE-PARTY POLICY PREFERENCES
// 3-Point Bounding Clamp (|delta| <= 3.0), Asymmetric Regional Elasticity,
// and 51-Jurisdiction State Party Platform Derivations.
// ============================================================================

const STATE_PARTY_PILLAR_BASELINES = {
  people: {
    'tax-economy': 3.0, 'foreign-policy': 3.5, 'climate-policy': 3.0, 'religious-policy': 2.5,
    'social-services': 2.8, 'social-justice': 3.4, 'party-structure': 3.0, 'party-ideology': 6.3,
    'democracy-policy': 2.0, 'establishment-stance': 2.7,
  },
  heritage: {
    'tax-economy': 8.0, 'foreign-policy': 7.5, 'climate-policy': 8.0, 'religious-policy': 8.0,
    'social-services': 7.6, 'social-justice': 8.0, 'party-structure': 6.3, 'party-ideology': 4.0,
    'democracy-policy': 7.7, 'establishment-stance': 7.0,
  },
  liberty: {
    'tax-economy': 9.8, 'foreign-policy': 1.5, 'climate-policy': 9.0, 'religious-policy': 5.3,
    'social-services': 9.8, 'social-justice': 3.2, 'party-structure': 8.0, 'party-ideology': 9.0,
    'democracy-policy': 4.7, 'establishment-stance': 6.0,
  },
  green: {
    'tax-economy': 1.2, 'foreign-policy': 1.5, 'climate-policy': 1.0, 'religious-policy': 1.0,
    'social-services': 1.0, 'social-justice': 1.4, 'party-structure': 3.3, 'party-ideology': 1.0,
    'democracy-policy': 1.0, 'establishment-stance': 9.3,
  },
  constitution: {
    'tax-economy': 8.5, 'foreign-policy': 3.0, 'climate-policy': 8.5, 'religious-policy': 9.5,
    'social-services': 8.5, 'social-justice': 9.0, 'party-structure': 6.0, 'party-ideology': 2.0,
    'democracy-policy': 6.5, 'establishment-stance': 8.0,
  },
  socialist: {
    'tax-economy': 1.0, 'foreign-policy': 1.0, 'climate-policy': 1.0, 'religious-policy': 1.0,
    'social-services': 1.0, 'social-justice': 1.2, 'party-structure': 3.0, 'party-ideology': 1.5,
    'democracy-policy': 1.0, 'establishment-stance': 9.0,
  },
};

const ALL_51_JURISDICTION_CODES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

function getStateLeanValue(stateId) {
  if (stateId === 'DC') return 85.0; // DC deep progressive
  const st = STATES.find((s) => s.id === stateId);
  return Number(st?.leanPercent ?? 0);
}

function computeStatePartyPlatformDeltas(stateId, partyId = 'people', customPlatform = null) {
  const lean = getStateLeanValue(stateId);
  
  // Asymmetric regional elasticity per REQ-298:
  // - Liberal states (e.g. CA, NY, VT, MA, DC): pulled leftward (negative delta)
  // - Conservative states (e.g. WY, ID, TX, AL): pulled rightward (positive delta)
  // - Moderate states (e.g. PA, MI, WI): closely mirror national baselines with modest drift
  let elasticity = 1.0;
  let rawPull = 0;
  if (lean >= 10) {
    elasticity = 1.25;
    rawPull = -(Math.min(30, lean) / 30) * 2.2;
  } else if (lean <= -10) {
    elasticity = 1.25;
    rawPull = (Math.min(45, Math.abs(lean)) / 45) * 2.2;
  } else {
    elasticity = 0.55;
    rawPull = -(lean / 10) * 0.7;
  }

  const baselines = customPlatform || STATE_PARTY_PILLAR_BASELINES[partyId] || STATE_PARTY_PILLAR_BASELINES.people;
  const issues = (typeof window !== 'undefined' && window.PartyChairData?.VERSION_021_ISSUES) || [];
  const pillars = (typeof window !== 'undefined' && window.PartyChairData?.PLATFORM_PILLARS) || [];
  
  const issueToPillar = {};
  pillars.forEach((p) => {
    (p.issues || []).forEach((issId) => {
      issueToPillar[issId] = p.id;
    });
  });

  const deltas = {};
  const positions = {};

  const effectiveIssues = issues.length ? issues : [
    { id: 'taxes-spending', pillar: 'tax-economy' },
    { id: 'corporate-tax-rate', pillar: 'tax-economy' },
    { id: 'wealth-tax', pillar: 'tax-economy' },
    { id: 'cost-of-living', pillar: 'tax-economy' },
    { id: 'business-regulation', pillar: 'tax-economy' },
    { id: 'monetary-policy', pillar: 'tax-economy' },
    { id: 'defense-spending', pillar: 'foreign-policy' },
    { id: 'foreign-policy', pillar: 'foreign-policy' },
    { id: 'iran-policy', pillar: 'foreign-policy' },
    { id: 'israel-palestine', pillar: 'foreign-policy' },
    { id: 'climate-action', pillar: 'climate-policy' },
    { id: 'energy-mix', pillar: 'climate-policy' },
    { id: 'green-standards', pillar: 'climate-policy' },
    { id: 'religious-liberty', pillar: 'religious-policy' },
    { id: 'church-state-schools', pillar: 'religious-policy' },
    { id: 'faith-based-funding', pillar: 'religious-policy' },
    { id: 'medicare-social-security', pillar: 'social-services' },
    { id: 'health-coverage', pillar: 'social-services' },
    { id: 'snap-food-aid', pillar: 'social-services' },
    { id: 'prescription-drugs', pillar: 'social-services' },
    { id: 'minimum-wage', pillar: 'social-services' },
    { id: 'systemic-equity', pillar: 'social-justice' },
    { id: 'border-security', pillar: 'social-justice' },
    { id: 'civil-rights', pillar: 'social-justice' },
    { id: 'voting-rights', pillar: 'democracy-policy' },
    { id: 'electoral-college', pillar: 'democracy-policy' },
    { id: 'campaign-finance', pillar: 'democracy-policy' },
    { id: 'judicial-reform', pillar: 'democracy-policy' },
    { id: 'anti-establishment', pillar: 'establishment-stance' },
    { id: 'grassroots-primaries', pillar: 'party-structure' },
  ];

  effectiveIssues.forEach((iss) => {
    const pillarId = iss.pillar || issueToPillar[iss.id] || 'tax-economy';
    const basePos = Number(baselines[pillarId] ?? 5.0);

    let issueFactor = 1.0;
    if (rawPull > 0) { // conservative state
      if (['climate-policy', 'tax-economy', 'social-justice', 'religious-policy'].includes(pillarId)) {
        issueFactor = 1.2;
      }
    } else if (rawPull < 0) { // liberal state
      if (['climate-policy', 'social-justice', 'social-services', 'tax-economy'].includes(pillarId)) {
        issueFactor = 1.2;
      }
    }

    let delta = rawPull * issueFactor * elasticity;
    // Hard clamp to 3.0 points as required by REQ-298
    delta = Math.max(-3.0, Math.min(3.0, Math.round(delta * 100) / 100));
    const pos = Math.max(1.0, Math.min(10.0, Math.round((basePos + delta) * 100) / 100));
    deltas[iss.id] = delta;
    positions[iss.id] = pos;
  });

  return { deltas, positions, elasticityClass: lean >= 10 ? 'liberal' : lean <= -10 ? 'conservative' : 'moderate' };
}

function getStatePartyDossierNarrative(stateId, partyId = 'people') {
  const lean = getStateLeanValue(stateId);
  const stName = STATES.find((s) => s.id === stateId)?.name || stateId;
  const isDem = partyId === 'people';
  const isGop = partyId === 'heritage';

  if (lean >= 10) {
    if (isDem) return `The ${stName} Democratic organization operates well to the left of the national party, championing aggressive climate mandates, single-payer health reforms, and expansive social programs.`;
    if (isGop) return `Facing an uphill liberal terrain, the ${stName} Republican organization tempers national culture-war rhetoric, emphasizing local fiscal discipline, environmental stewardship, and moderate social positioning.`;
    return `The ${stName} party organization reflects the state's progressive ideological gravity, pulling party stances decisively leftward.`;
  }
  if (lean <= -10) {
    if (isGop) return `The ${stName} Republican organization anchors the national party's right flank, demanding uncompromising social traditionalism, total energy independence, and aggressive regulatory dismantling.`;
    if (isDem) return `To remain viable in deep-red terrain, the ${stName} Democratic organization maintains visible independence from national party orthodoxy, adopting pro-energy, culturally moderate, and gun-rights-protective stances.`;
    return `The ${stName} party organization reflects the state's deeply conservative electorate, pulling candidates firmly rightward.`;
  }
  return `The ${stName} party organization closely tracks national platform guidelines, making only modest adjustments to fit the state's balanced political battlefield.`;
}

function getStatePartyPlatform(gameOrStateId, stateIdOrPartyId, partyIdOrNull) {
  let stateId, partyId, customPlatform = null;
  if (typeof gameOrStateId === 'object' && gameOrStateId !== null) {
    stateId = stateIdOrPartyId;
    partyId = partyIdOrNull || gameOrStateId?.player?.baseTemplateId || 'people';
    if (gameOrStateId?.player?.custom && gameOrStateId?.platform) {
      customPlatform = gameOrStateId.platform;
    }
  } else {
    stateId = gameOrStateId;
    partyId = stateIdOrPartyId || 'people';
  }
  return computeStatePartyPlatformDeltas(stateId, partyId, customPlatform);
}

function getStatePartyDeltas(gameOrStateId, stateIdOrPartyId, partyIdOrNull) {
  const plat = getStatePartyPlatform(gameOrStateId, stateIdOrPartyId, partyIdOrNull);
  return plat.deltas;
}

window.PartyChairData = Object.assign(window.PartyChairData || {}, {
  ALL_PARTY_FACTIONS,
  BILLS,
  CAMPAIGN_STANDARD_WEEKS,
  CANDIDATE_RATING_DEFINITIONS,
  CANDIDATE_RATING_KEYS,
  CONVENTIONS,
  CUSTOM_CHARTER_TRAITS,
  CUSTOM_LEADER_ARCHETYPES,
  CUSTOM_PARTY_EMBLEMS,
  CUSTOM_PARTY_ORIGINS,
  CONVENTIONS,
  CUSTOM_LEADER_ARCHETYPES,
  ELECTORAL_SYSTEM_DEFINITIONS,
  EVENTS,
  FACTIONS,
  FLEDGLING_SUPER_PAC_TEMPLATES,
  FUSION_POLICY_PLEDGES,
  SLATE_TIER_MATRIX,
  SLATE_COATTAIL_BY_PARTY_TIER,
  MIDTERM_CONSOLIDATED_HOUSE_STATES,
  BICAMERAL_STATE_SENATE_CALENDAR,
  getBicameralChambersForYear,
  STATEWIDE_OFFICES_REGISTRY,
  STATEWIDE_OFFICES: STATEWIDE_OFFICES_REGISTRY,
  STARTING_STATEWIDE_OFFICERS,
  isStatewideOfficeOnCycle,
  PRIMARY_CANDIDATE_PALETTE,
  DNC_MASTER_DELEGATES_2028,
  RNC_MASTER_DELEGATES_2028,
  DEFAULT_PRIMARY_SCHEDULES,
  DELEGATE_ALLOCATION_RULES,
  allocateDelegatesHareNiemeyer,
  INSTITUTIONAL_TIERS,
  MEMBERS,
  MINOR_PARTY_FOUNDING_FACTIONS,
  OCTOBER_SURPRISES,
  OVERALL_PRIORITY_QUESTS,
  OVERLAPPING_REGIONS,
  OVERLAPPING_REGION_DEFINITIONS,
  OVERLAPPING_REGION_NAMES,
  PARTY_ARCHETYPES,
  PARTY_FACTIONS,
  POLITICIAN_TRAITS,
  POSITIVE_RATING_KEYS,
  PRESIDENTIAL_DEBATE_STAGE_EVENT,
  REGIONS,
  STARTING_LEADER_ARCHETYPES,
  STATES,
  STATE_VOTING_LAW_BILLS,
  STATUTORY_BALLOT_RULES,
  SUPER_PACS_SCHEMA,
  FACTION_SUPER_PACS_REGISTRY,
  getSuperPacById,
  getSuperPacsForParty,
  getSwingSuperPacs,
  computeCandidateQuality,
  getFactionsForParty,
  getStateOverlappingRegions,
  stateMatchesRegion,
  STATE_PARTY_PILLAR_BASELINES,
  ALL_51_JURISDICTION_CODES,
  computeStatePartyPlatformDeltas,
  getStatePartyPlatform,
  getStatePartyDeltas,
  getStatePartyDossierNarrative,
});
