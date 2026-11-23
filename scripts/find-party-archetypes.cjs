const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

const idx = d.indexOf('const PARTY_ARCHETYPES = [');
if (idx !== -1) {
  console.log(d.slice(idx, idx + 2500));
}
