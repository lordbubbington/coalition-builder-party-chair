const fs = require('fs');

const catalog = [
  // --- DEMOCRATIC PARTY (8 Factions: 52,649,500 Registered Voters) ---
  {
    id: 'dem_liberal_establishment',
    name: 'The Liberal Establishment',
    partyId: 'people',
    type: 'ideological',
    status: 'leading',
    targetVoters: 12270000,
    sliders: { social: 4.0, economic: 4.0, governance: 2.0 },
    keyIssues: ['Institutional Norms', 'Entitlement Defense'],
    flavor: 'The traditional backbone of the Democratic Party—elected officials, party apparatus loyalists, and suburban pragmatists who favor steady governance, institutional guardrails, and incremental reform.'
  },
  {
    id: 'dem_black_voters',
    name: 'Black Voters',
    partyId: 'people',
    type: 'racial',
    status: 'major',
    targetVoters: 11760000,
    sliders: { social: 4.0, economic: 3.0, governance: 7.8 },
    keyIssues: ['Civil Rights', 'Voting Access'],
    flavor: 'The African American Voting Block - have been a core faction of the democratic party since the civil rights movement'
  },
  {
    id: 'dem_capital_l_left',
    name: 'The Capital L Left',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 7160000,
    sliders: { social: 2.0, economic: 2.0, governance: 6.0 },
    keyIssues: ['Universal Healthcare', 'Climate Action'],
    flavor: 'Extreme on Rhetoric, Extreme on Policy - these are the progressives that are keeping fox news in business'
  },
  {
    id: 'dem_neo_liberals',
    name: 'Neo-Liberals',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 5620000,
    sliders: { social: 3.7, economic: 4.8, governance: 2.0 },
    keyIssues: ['Free Trade Agreements', 'Corporate Tax Competitiveness'],
    flavor: 'Pro-globalization, free-trade technocrats and educated professionals who combine socially progressive values with market-oriented economic policies and fiscal prudence.'
  },
  {
    id: 'dem_bernie_bros',
    name: 'Bernie Bros',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 5110000,
    sliders: { social: 3.3, economic: 1.8, governance: 9.0 },
    keyIssues: ['Wealth and Capital Gains', 'Business Regulation and Antitrust Laws'],
    flavor: 'These are voters who became engaged in politics during Bernie Sanders 2016 campaign. They’re milder on social views and rhetoric, but very left leaning on economic issues. It also has a strong populist current.'
  },
  {
    id: 'dem_faith_based_liberals',
    name: 'Faith Based Liberals',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 5110000,
    sliders: { social: 5.0, economic: 2.0, governance: 4.0 },
    keyIssues: ['Voting Rights', 'Civil Rights Protections'],
    flavor: 'Mainline Protestant, Catholic, and interfaith social-gospel voters who view progressive politics as a moral duty to care for the poor, marginalized, and vulnerable.'
  },
  {
    id: 'dem_blue_dog',
    name: 'Blue Dog Democrats',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 3780000,
    sliders: { social: 5.5, economic: 5.5, governance: 5.0 },
    keyIssues: ['Balanced Budget Amendment', 'Rural Healthcare Support'],
    flavor: 'Fiscally conservative and culturally moderate Democrats who represent rural, small-town, and border districts, emphasizing bipartisan compromise and deficit reduction.'
  },
  {
    id: 'dem_traditional_latin',
    name: 'Traditional Latin Voters',
    partyId: 'people',
    type: 'racial',
    status: 'minor',
    targetVoters: 1839500,
    sliders: { social: 5.0, economic: 4.0, governance: 6.0 },
    keyIssues: ['Comprehensive Immigration Reform', 'Labor Standards Enforcement'],
    flavor: 'Multi-generational Hispanic and Latino families in urban centers and agricultural belts who blend socially moderate family values with support for public education and healthcare access.'
  },

  // --- REPUBLICAN PARTY (11 Factions: 49,077,200 Registered Voters) ---
  {
    id: 'gop_faith_and_flag',
    name: 'Faith & Flag Conservatives',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 9015000,
    sliders: { social: 9.0, economic: 6.0, governance: 6.0 },
    keyIssues: ['Religious Liberty', 'Right to Life Protections'],
    flavor: 'Evangelical and devout traditionalist Christians who prioritize social conservatism, judicial originalism, and the defense of religious institutions in public life.'
  },
  {
    id: 'gop_maga',
    name: 'Nationalist Populists (MAGA)',
    partyId: 'heritage',
    type: 'ideological',
    status: 'leading',
    targetVoters: 7011000,
    sliders: { social: 8.5, economic: 4.8, governance: 8.5 },
    keyIssues: ['Border Security Wall', 'Tariffs & Trade Protection'],
    flavor: 'America-First working-class nationalists energized by Donald Trump, emphasizing strict border enforcement, protectionist trade policies, and cultural populism.'
  },
  {
    id: 'gop_western_mavericks',
    name: 'Liberty & Western Mavericks',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 6510000,
    sliders: { social: 4.5, economic: 8.5, governance: 9.0 },
    keyIssues: ['Second Amendment Rights', 'Federal Land Transfer'],
    flavor: 'Rugged individualists, ranchers, and Second Amendment absolutists across the Mountain West who demand federal land divestment and radical regulatory relief.'
  },
  {
    id: 'gop_blood_and_soil',
    name: 'Blood and Soil Nationalists',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 6010000,
    sliders: { social: 9.8, economic: 5.0, governance: 9.5 },
    keyIssues: ['Immigration Enforcement', 'National Sovereignty'],
    flavor: 'Hardline nativist reactionaries who demand an end to legal immigration, aggressive deportation operations, and the cultural reassertion of European heritage.'
  },
  {
    id: 'gop_suburban_moderates',
    name: 'Frontier & Suburban Moderates',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 5208000,
    sliders: { social: 4.0, economic: 7.2, governance: 2.5 },
    keyIssues: ['Suburban School Choice', 'Local Tax Restraint'],
    flavor: 'College-educated suburbanites and Sunbelt professionals who favor pro-business tax policy and public safety while rejecting conspiratorial rhetoric and cultural extremism.'
  },
  {
    id: 'gop_neo_cons',
    name: 'Neo-Cons',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 5108000,
    sliders: { social: 6.5, economic: 7.5, governance: 3.0 },
    keyIssues: ['Defense Modernization', 'NATO Expansion'],
    flavor: 'Hawkish foreign policy institutionalists and defense-sector advocates who champion global American hegemony, democratic interventionism, and deterrence against authoritarian rivals.'
  },
  {
    id: 'gop_paleocons',
    name: 'Paleocons',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 3005000,
    sliders: { social: 9.5, economic: 5.5, governance: 8.0 },
    keyIssues: ['Foreign Non-Intervention', 'Decentralized Federalism'],
    flavor: 'Old-Right isolationists who combine deep cultural traditionalism with fierce opposition to foreign wars, global trade pacts, and centralized federal power.'
  },
  {
    id: 'gop_mormons',
    name: 'Mormons',
    partyId: 'heritage',
    type: 'racial',
    status: 'minor',
    targetVoters: 2404000,
    sliders: { social: 7.5, economic: 7.0, governance: 2.0 },
    keyIssues: ['Religious Freedom Protections', 'Refugee Resettlement'],
    flavor: 'Latter-day Saint voters across the Intermountain West who pair devout family values and fiscal conservatism with institutional decency, civic trust, and welcoming refugee attitudes.'
  },
  {
    id: 'gop_traditional_farmers',
    name: 'Traditional Farmers',
    partyId: 'heritage',
    type: 'ideological',
    status: 'minor',
    targetVoters: 2003200,
    sliders: { social: 7.0, economic: 5.0, governance: 6.0 },
    keyIssues: ['Agricultural Subsidies & Crop Insurance', 'Rural Broadband Infrastructure'],
    flavor: 'Generational agricultural producers and rural smallholders who depend on farm bill protections, biofuel mandates, and water rights while maintaining traditional cultural leanings.'
  },
  {
    id: 'gop_market_country_club',
    name: 'Market & Country-Club Conservatives',
    partyId: 'heritage',
    type: 'ideological',
    status: 'minor',
    targetVoters: 2003000,
    sliders: { social: 4.5, economic: 9.0, governance: 2.0 },
    keyIssues: ['Corporate Tax Reductions', 'Financial Deregulation'],
    flavor: 'Wealthy corporate executives, financiers, and donors who focus primarily on supply-side tax cuts, capital gains relief, and minimal government intervention in capital markets.'
  },
  {
    id: 'gop_cubans',
    name: 'Cubans',
    partyId: 'heritage',
    type: 'racial',
    status: 'fringe',
    targetVoters: 800000,
    sliders: { social: 7.0, economic: 7.5, governance: 4.0 },
    keyIssues: ['Anti-Communist Foreign Policy', 'Sanctions Enforcement'],
    flavor: 'South Florida Cuban-American voting bloc with deep anti-communist convictions, fiercely loyal to hardline foreign policy against Latin American dictatorships and supportive of free-market policies.'
  },

  // --- INDEPENDENT / SWING FACTIONS (9 Factions: 48,029,800 Registered Voters) ---
  {
    id: 'swg_true_centrists',
    name: 'True Centrists',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 9006000,
    sliders: { social: 5.0, economic: 5.0, governance: 5.0 },
    keyIssues: ['Government Gridlock Reform', 'Bipartisan Infrastructure'],
    flavor: 'The perfect ideological center of the American electorate, evenly divided and skeptical of ideological purity from both parties, deciding general election outcomes.'
  },
  {
    id: 'swg_hard_hats',
    name: 'Hard Hats',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 6004000,
    sliders: { social: 7.2, economic: 3.1, governance: 6.0 },
    keyIssues: ['Domestic Manufacturing', 'Union Protections'],
    flavor: 'Union Voters and Construction workers used to be reliably democratic - but the Trump Coalition swallowed them up'
  },
  {
    id: 'swg_podcast_bros',
    name: 'Podcast Bros',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 6004000,
    sliders: { social: 6.8, economic: 3.9, governance: 9.0 },
    keyIssues: ['Cryptocurrency Freedom', 'Free Speech Online'],
    flavor: 'These low information voters get most of their news from podcasts - and that’s how they decide on who they vote for, too'
  },
  {
    id: 'swg_country_club_centrists',
    name: 'Country Club Centrists',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 5503500,
    sliders: { social: 3.4, economic: 8.1, governance: 2.0 },
    keyIssues: ['Fiscal Discipline', 'Free Market Deregulation'],
    flavor: 'These voters used to be dyed in the wool republicans - but Trump changed everything'
  },
  {
    id: 'swg_technocrats',
    name: 'Technocrats',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 5503500,
    sliders: { social: 2.5, economic: 8.8, governance: 2.0 },
    keyIssues: ['Artificial Intelligence Deregulation', 'High-Skill Immigration'],
    flavor: 'These voters believe in the power of technology. They hold progressive social views (civil rights, free speech) but despise regulatory barriers, compute controls, and wealth taxes.'
  },
  {
    id: 'swg_grillers',
    name: 'Grillers',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 5003000,
    sliders: { social: 5.5, economic: 5.5, governance: 3.0 },
    keyIssues: ['Inflation Reduction', 'Lower Grocery Prices'],
    flavor: 'These voters don’t follow politics closely - they just want to be left alone and grill. But when food, gas, and energy prices spike, they deliver brutal verdicts to the governing party.'
  },
  {
    id: 'swg_religious_moderates',
    name: 'Religious Moderates',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 4502800,
    sliders: { social: 6.5, economic: 4.8, governance: 4.0 },
    keyIssues: ['Charitable Giving Incentives', 'Community Poverty Programs'],
    flavor: 'Churchgoers, Catholics, and interfaith believers who resist hard-right Christian nationalism but expect politicians to respect personal faith, family values, and basic community compassion.'
  },
  {
    id: 'swg_working_class_latinos',
    name: 'Working Class Latinos',
    partyId: 'independent',
    type: 'racial',
    status: 'major',
    targetVoters: 4002500,
    sliders: { social: 6.2, economic: 4.5, governance: 5.0 },
    keyIssues: ['Small Business Loans', 'Public Safety & Policing'],
    flavor: 'Blue-collar Hispanic voters in Nevada, Arizona, Texas, and the Rust Belt who prioritize steady jobs, law and order, and small-business opportunity, swinging fluidly between both major parties.'
  },
  {
    id: 'swg_girlypops',
    name: 'Girlypops',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 2500500,
    sliders: { social: 2.5, economic: 5.0, governance: 7.0 },
    keyIssues: ['Reproductive Healthcare Access', 'Equal Pay Protections'],
    flavor: 'Young, pop-culture-fluent women who care deeply about reproductive autonomy, social equality, and campus climate, but distrust career politicians and rigid ideological labels.'
  },

  // --- MINOR & UNAFFILIATED PARTIES (10 Factions: 5,243,500 Registered Voters) ---
  {
    id: 'lib_true_libertarians',
    name: 'True Libertarians',
    partyId: 'liberty',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 956600,
    sliders: { social: 3.8, economic: 9.5, governance: 9.3 },
    keyIssues: ['Tax Policy', 'Gun Policy'],
    flavor: 'True libertarians are hard to come by - but these voters believe in true small government, not just on liberal issues'
  },
  {
    id: 'lib_ancaps',
    name: 'Ancaps',
    partyId: 'liberty',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 191300,
    sliders: { social: 3.5, economic: 10.0, governance: 10.0 },
    keyIssues: ['Abolition of the Federal Reserve', 'Total Tax Elimination'],
    flavor: 'These voters don’t think the government should exist. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'grn_eco_socialist_vanguard',
    name: 'Eco-Socialist Vanguard',
    partyId: 'green',
    type: 'ideological',
    status: 'leading',
    targetVoters: 383800,
    sliders: { social: 1.2, economic: 1.3, governance: 9.0 },
    keyIssues: ['Fossil Fuel Nationalization', 'Degrowth Climate Transition'],
    flavor: 'The Eco-Socialist Vanguard warns of the coming eco-apoclypse'
  },
  {
    id: 'grn_yimby',
    name: 'YIMBYs',
    partyId: 'green',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 109600,
    sliders: { social: 2.8, economic: 3.1, governance: 5.0 },
    keyIssues: ['NIMBYism and Housing Development', 'Affordability and the Cost of Living'],
    flavor: 'These leftie voters left the democrats over housing issues - now they’re in an uncomfortable alliance with the greens'
  },
  {
    id: 'con_christian_dominionists',
    name: 'Christian Dominionists & Theocrats',
    partyId: 'constitution',
    type: 'ideological',
    status: 'leading',
    targetVoters: 230000,
    sliders: { social: 10.0, economic: 6.4, governance: 9.5 },
    keyIssues: ['Religious Liberty', 'Religion in Public Schools'],
    flavor: 'Radical religious reconstructionists who believe American civil law should be completely replaced with biblical law and Christian governance. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'soc_socialists',
    name: 'Socialists',
    partyId: 'socialist',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 138000,
    sliders: { social: 2.0, economic: 1.2, governance: 9.0 },
    keyIssues: ['Worker-Owned Enterprises', 'Public Banking Infrastructure'],
    flavor: 'These voters are socialists, who idealize Karl Marx. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'soc_communists',
    name: 'Communists',
    partyId: 'socialist',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 92000,
    sliders: { social: 5.0, economic: 1.0, governance: 7.0 },
    keyIssues: ['Expropriation of Corporate Monopolies', 'Centralized Economic Planning'],
    flavor: 'These are communists, who want total state control over the economy. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'unaff_groypers',
    name: 'Groypers',
    partyId: 'unaffiliated',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 200000,
    sliders: { social: 9.2, economic: 6.1, governance: 9.5 },
    keyIssues: ['Immigration Moratorium', 'Anti-Globalist Sovereignty'],
    flavor: 'Online alt-right provocateurs and youth reactionaries who use irony, memes, and internet culture to push far-right ethno-nationalist talking points into mainstream discourse.'
  },
  {
    id: 'unaff_the_klan',
    name: 'The Klan & Neo-Nazis',
    partyId: 'unaffiliated',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 142200,
    sliders: { social: 10.0, economic: 5.5, governance: 10.0 },
    keyIssues: ['Racial Segregation', 'Totalitarian State Authority'],
    flavor: 'These voters support the Klu Klux Klan and Neo-Nazis. They turn out 0% and should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'unaff_regional_activists',
    name: 'Non-Aligned Regional Activists',
    partyId: 'unaffiliated',
    type: 'ideological',
    status: 'major',
    targetVoters: 2800000,
    sliders: { social: 5.0, economic: 5.0, governance: 5.0 },
    keyIssues: ['Direct Democracy Initiatives', 'Regional Autonomy'],
    flavor: 'Independent local civic groups, ballot initiative campaigns, and regional issue advocates unaligned with any national party apparatus.'
  }
];

// Mapping from CSV Faction Name to Catalog IDs
const CSV_NAME_TO_ID = {
  'The Liberal Establishment': 'dem_liberal_establishment',
  'Black Voters': 'dem_black_voters',
  'The Capital L Left': 'dem_capital_l_left',
  'Neo-Liberals': 'dem_neo_liberals',
  'Bernie Bros': 'dem_bernie_bros',
  'Faith Based Liberals': 'dem_faith_based_liberals',
  'Blue Dog Democrats': 'dem_blue_dog',
  'Traditional Latin Voters': 'dem_traditional_latin',
  'Faith & Flag Conservatives': 'gop_faith_and_flag',
  'Nationalist Populists (MAGA)': 'gop_maga',
  'Liberty & Western Mavericks': 'gop_western_mavericks',
  'Blood and Soil Nationalists': 'gop_blood_and_soil',
  'Frontier & Suburban Moderates': 'gop_suburban_moderates',
  'Neo-Cons': 'gop_neo_cons',
  'Paleocons': 'gop_paleocons',
  'Mormons': 'gop_mormons',
  'Traditional Farmers': 'gop_traditional_farmers',
  'Market & Country-Club Conservatives': 'gop_market_country_club',
  'Cubans': 'gop_cubans',
  'True Centrists': 'swg_true_centrists',
  'Hard Hats': 'swg_hard_hats',
  'Podcast Bros': 'swg_podcast_bros',
  'Country Club Centrists': 'swg_country_club_centrists',
  'Technocrats': 'swg_technocrats',
  'Grillers': 'swg_grillers',
  'Religious Moderates': 'swg_religious_moderates',
  'Working Class Latinos': 'swg_working_class_latinos',
  'Girlypops': 'swg_girlypops',
  'True Libertarians': 'lib_true_libertarians',
  'Ancaps': 'lib_ancaps',
  'Eco-Socialist Vanguard': 'grn_eco_socialist_vanguard',
  'YIMBYs': 'grn_yimby',
  'YIMBY’s': 'grn_yimby',
  'Christian Dominionists & Theocrats': 'con_christian_dominionists',
  'Socialists': 'soc_socialists',
  'Communists': 'soc_communists',
  'Groypers': 'unaff_groypers',
  'The Klan & Neo-Nazis': 'unaff_the_klan',
  'The Klan': 'unaff_the_klan',
  "Neo-Nazi's": 'unaff_the_klan',
  'Neo-Nazis': 'unaff_the_klan',
  'Non-Aligned Regional Activists': 'unaff_regional_activists',
};

// Parse CSV
const csvText = fs.readFileSync('FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv', 'utf8');
const lines = csvText.split(/\r?\n/);

const stateMatrix = {};
const nationalTotals = {};

// Initialize stateMatrix for all 51 jurisdictions
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const cols = [];
  let cur = '';
  let inQuotes = false;
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) { cols.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  cols.push(cur.trim());
  const [stCode, stName, party, fName, countStr] = cols;
  const count = parseInt(countStr, 10);
  if (isNaN(count)) continue;

  if (!stateMatrix[stCode]) stateMatrix[stCode] = {};

  const fid = CSV_NAME_TO_ID[fName] || fName;
  stateMatrix[stCode][fid] = (stateMatrix[stCode][fid] || 0) + count;
  nationalTotals[fid] = (nationalTotals[fid] || 0) + count;
}

// Generate factions-0.15.js file
const fileContent = `/**
 * Coalition Builder: Party Chair - Version 0.15.0 Factions Engine
 * Authoritative 38-Faction Catalog & Zero-Variance 51-State Matrix
 */
(function(root) {
  'use strict';

  const FACTIONS_CATALOG = ${JSON.stringify(catalog, null, 2)};

  const FACTION_NAME_TO_ID = ${JSON.stringify(CSV_NAME_TO_ID, null, 2)};

  const FACTION_STATE_MATRIX = ${JSON.stringify(stateMatrix, null, 2)};

  const FACTION_NATIONAL_TOTALS = ${JSON.stringify(nationalTotals, null, 2)};

  const PartyChairData = (root.PartyChairData = root.PartyChairData || {});
  PartyChairData.FACTIONS_CATALOG = FACTIONS_CATALOG;
  PartyChairData.FACTION_NAME_TO_ID = FACTION_NAME_TO_ID;
  PartyChairData.FACTION_STATE_MATRIX = FACTION_STATE_MATRIX;
  PartyChairData.FACTION_NATIONAL_TOTALS = FACTION_NATIONAL_TOTALS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      FACTIONS_CATALOG,
      FACTION_NAME_TO_ID,
      FACTION_STATE_MATRIX,
      FACTION_NATIONAL_TOTALS
    };
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
`;

fs.writeFileSync('factions-0.15.js', fileContent, 'utf8');
console.log('factions-0.15.js generated successfully! Length:', fileContent.length);
