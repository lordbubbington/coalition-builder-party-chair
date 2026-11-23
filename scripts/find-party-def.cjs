const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

// Find where "Democratic Party" is defined
const idx = d.indexOf('Democratic Party');
if (idx !== -1) {
  console.log(d.slice(Math.max(0, idx - 100), idx + 800));
}
