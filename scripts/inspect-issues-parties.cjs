const fs = require('fs');

console.log('=== Checking data.js and engine.js ===');
if (fs.existsSync('data.js')) {
  const d = fs.readFileSync('data.js', 'utf8');
  console.log('data.js size:', d.length);
  // Look for party definitions
  const partySection = d.match(/const\s+PARTIES\s*=\s*\[[\s\S]*?\n\s*\];/);
  if (partySection) {
    console.log('Found PARTIES constant');
  }
}

// Let's require data.js or inspect global objects
try {
  // Let's see what keys are exported or defined
  const dataContent = fs.readFileSync('data.js', 'utf8');
  // find party list
  const partyNames = [];
  const pRegex = /id:\s*['"]([a-zA-Z0-9_-]+)['"],\s*name:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = pRegex.exec(dataContent)) !== null) {
    partyNames.push({ id: match[1], name: match[2] });
  }
  console.log('Parties found:', partyNames.slice(0, 10));

  // Let's check pillars / issues
  const pillarMatches = [];
  const pilRegex = /id:\s*['"]([a-zA-Z0-9_-]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*description:/g;
  while ((match = pilRegex.exec(dataContent)) !== null) {
    pillarMatches.push({ id: match[1], name: match[2] });
  }
  console.log('Pillars/Issues found:', pillarMatches.slice(0, 15));
} catch (e) {
  console.error('Error:', e);
}
