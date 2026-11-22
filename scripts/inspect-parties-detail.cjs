const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

// Find the PARTIES array definition
const pIndex = d.indexOf('const PARTIES = [');
if (pIndex !== -1) {
  const pSlice = d.slice(pIndex, pIndex + 4000);
  console.log('PARTIES snippet:\n', pSlice);
}

// Find if there are ISSUE definitions or PLATFORMS
const issueIndex = d.indexOf('const ISSUES =');
console.log('ISSUES index:', issueIndex);

const platformIndex = d.indexOf('const PLATFORM');
console.log('PLATFORM index:', platformIndex);

// Let's search for "pillars" or "stance"
const matches = d.match(/([a-zA-Z0-9_]+)\s*:\s*\[[\s\S]*?\]/g);
