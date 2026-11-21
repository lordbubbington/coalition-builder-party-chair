'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const engineJs = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');

// Find all dispatchAction('xyz') or takeAction(g, 'xyz') in app.js
const dispatchedMatches = [...appJs.matchAll(/dispatchAction\(\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const dataActionMatches = [...appJs.matchAll(/data-action=["']([^"']+)["']/g)].map(m => m[1]);
const allAppActions = [...new Set([...dispatchedMatches, ...dataActionMatches])];

// Find all actionId === 'xyz' in engine.js
const handledMatches = [...engineJs.matchAll(/actionId === ['"]([^'"]+)['"]/g)].map(m => m[1]);
const allEngineActions = new Set(handledMatches);

console.log(`Total unique actions from app.js: ${allAppActions.length}`);
console.log(`Total unique actions handled in engine.js: ${allEngineActions.size}`);

const unhandled = [];
for (const act of allAppActions) {
  if (!allEngineActions.has(act)) {
    unhandled.push(act);
  }
}

console.log(`\nActions from app.js not directly handled via actionId === '...':`);
console.log(unhandled);

// Also check what functions takeActionInternal calls
fs.writeFileSync(path.join(ROOT, 'action-coverage-results.json'), JSON.stringify({
  totalAppActions: allAppActions.length,
  totalEngineActions: allEngineActions.size,
  unhandled,
}, null, 2));
