const fs = require('fs');
const vm = require('vm');

// Load voter model
const ctx = vm.createContext({ window: { PartyChairData: {} } });
vm.runInContext(fs.readFileSync('voter-model-0.5.js', 'utf8'), ctx);
const voterModel = ctx.window.PartyChairData.VERSION_05_VOTER_MODEL;

// Name to ID mapping
const FACTION_NAME_TO_ID = {
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
  'Neo-Nazi’s': 'unaff_neo_nazis',
  'Non-Aligned Regional Activists': 'unaff_regional_activists',
};

const csvText = fs.readFileSync('FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv', 'utf8');
const lines = csvText.split(/\r?\n/);

const stateFactions = {};
const nationalFactions = {};

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
  const fid = FACTION_NAME_TO_ID[fName] || fName;
  if (!stateFactions[stCode]) stateFactions[stCode] = {};
  stateFactions[stCode][fid] = (stateFactions[stCode][fid] || 0) + count;
  stateFactions[stCode][fName] = (stateFactions[stCode][fName] || 0) + count;
  nationalFactions[fid] = (nationalFactions[fid] || 0) + count;
}

console.log('Processed states:', Object.keys(stateFactions).length);
console.log('Processed factions:', Object.keys(nationalFactions).length);
let sumNat = Object.values(nationalFactions).reduce((a,b) => a+b, 0);
console.log('Sum national factions:', sumNat);
