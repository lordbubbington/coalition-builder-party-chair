const fs = require('fs');

const text = fs.readFileSync('FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv', 'utf8');

function parseCSV(csvText) {
  const rows = [];
  const lines = csvText.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());
    rows.push(cols);
  }
  return rows;
}

const rows = parseCSV(text);
console.log('Total rows (incl header):', rows.length);
console.log('Header:', rows[0]);

const factionTotals = {};
const stateTotals = {};
const partyTotals = {};
let grandTotal = 0;

for (let i = 1; i < rows.length; i++) {
  const [stateCode, stateName, party, factionName, votersStr] = rows[i];
  const voters = parseInt(votersStr, 10);
  if (isNaN(voters)) {
    console.error('Invalid voters at row', i, rows[i]);
    continue;
  }
  factionTotals[factionName] = (factionTotals[factionName] || 0) + voters;
  stateTotals[stateCode] = (stateTotals[stateCode] || 0) + voters;
  partyTotals[party] = (partyTotals[party] || 0) + voters;
  grandTotal += voters;
}

console.log('Grand total voters:', grandTotal);
console.log('Number of unique factions:', Object.keys(factionTotals).length);
console.log('Factions:');
for (const [name, tot] of Object.entries(factionTotals).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${name}: ${tot.toLocaleString()}`);
}
console.log('\nParty totals:');
for (const [party, tot] of Object.entries(partyTotals)) {
  console.log(`  ${party}: ${tot.toLocaleString()}`);
}
