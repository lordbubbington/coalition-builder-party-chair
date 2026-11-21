const fs = require('fs');
const vm = require('vm');

// Load voter-model-0.5.js
const ctx = vm.createContext({ window: { PartyChairData: {} } });
vm.runInContext(fs.readFileSync('voter-model-0.5.js', 'utf8'), ctx);
const voterModel = ctx.window.PartyChairData.VERSION_05_VOTER_MODEL;

// Load CSV
const csvText = fs.readFileSync('FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv', 'utf8');
const lines = csvText.split(/\r?\n/);

const stateData = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  // Parse cols
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
  if (!stateData[stCode]) {
    stateData[stCode] = { dem: 0, rep: 0, ind: 0, minor: 0, total: 0 };
  }
  if (party === 'Democratic') stateData[stCode].dem += count;
  else if (party === 'Republican') stateData[stCode].rep += count;
  else if (party === 'Independent/Swing') stateData[stCode].ind += count;
  else stateData[stCode].minor += count;
  stateData[stCode].total += count;
}

let errors = 0;
for (const st of voterModel.states) {
  const code = st.stateId;
  const csv = stateData[code];
  if (!csv) {
    console.error('Missing state in CSV:', code);
    errors++;
    continue;
  }
  const demTarget = (st.affiliations.people || 0) * 100;
  const repTarget = (st.affiliations.heritage || 0) * 100;
  const indTarget = (st.affiliations.independent || 0) * 100;
  const minorTarget = (st.affiliations.thirdParty || 0) * 100;
  const totalTarget = st.representedVoters;

  if (csv.dem !== demTarget) {
    console.error(`Mismatch DEM in ${code}: CSV=${csv.dem}, VM=${demTarget}`);
    errors++;
  }
  if (csv.rep !== repTarget) {
    console.error(`Mismatch REP in ${code}: CSV=${csv.rep}, VM=${repTarget}`);
    errors++;
  }
  if (csv.ind !== indTarget) {
    console.error(`Mismatch IND in ${code}: CSV=${csv.ind}, VM=${indTarget}`);
    errors++;
  }
  if (csv.minor !== minorTarget) {
    console.error(`Mismatch MINOR in ${code}: CSV=${csv.minor}, VM=${minorTarget}`);
    errors++;
  }
  if (csv.total !== totalTarget) {
    console.error(`Mismatch TOTAL in ${code}: CSV=${csv.total}, VM=${totalTarget}`);
    errors++;
  }
}

if (errors === 0) {
  console.log('✅ ZERO VARIANCE: All 51 jurisdictions match voter-model-0.5.js exactly across Democratic, Republican, Independent, Minor, and Total represented voters!');
} else {
  console.log(`❌ Found ${errors} mismatches.`);
}
