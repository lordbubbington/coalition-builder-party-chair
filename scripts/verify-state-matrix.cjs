const fs = require('fs');
const lines = fs.readFileSync('HISTORICAL_STARTING_DATES_STATE_MATRIX.csv', 'utf8').trim().split('\n').slice(1);
const counts = {};
lines.forEach(l => {
  const yr = l.split(',')[0].replace(/"/g, '');
  counts[yr] = (counts[yr] || 0) + 1;
});
console.log('Years and state counts in state matrix:');
console.table(counts);
