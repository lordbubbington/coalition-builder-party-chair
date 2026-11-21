/**
 * Test Suite for REQ-253: Responsive Drawers & 50-State Scroll Trap Resolution
 * Target: scripts/test-v0163-responsive-drawers.cjs
 */

const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '..', 'styles.css');
const appPath = path.resolve(__dirname, '..', 'app.js');

const css = fs.readFileSync(cssPath, 'utf8');
const appJs = fs.readFileSync(appPath, 'utf8');

console.log('Testing REQ-253 responsive drawers and 50-state scroll trap resolution...\n');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`  ✅ PASS: ${message}`);
  }
}

// 1. Check .draft-hand-grid in styles.css
console.log('1. Checking .draft-hand-grid rules in styles.css:');
const draftGridMatch = css.match(/\.draft-hand-grid\s*\{([^}]+)\}/);
assert(Boolean(draftGridMatch), '.draft-hand-grid rule exists');
if (draftGridMatch) {
  const body = draftGridMatch[1];
  assert(body.includes('repeat(auto-fill, minmax(240px, 1fr))'), '.draft-hand-grid uses repeat(auto-fill, minmax(240px, 1fr))');
}

// Check media query collapse for .draft-hand-grid (< 480px)
const draftMediaMatch = css.match(/@media[^{]*max-width:\s*480px[^{]*\{([\s\S]*?\.draft-hand-grid[\s\S]*?\})/);
assert(Boolean(draftMediaMatch && draftMediaMatch[1].includes('grid-template-columns: 1fr')), '.draft-hand-grid collapses to 1 column below 480px');

// Check .custom-100k-form-grid in styles.css
console.log('\n2. Checking .custom-100k-form-grid rules in styles.css:');
assert(css.includes('.custom-100k-form-grid'), '.custom-100k-form-grid class exists in styles.css');
const formGridMedia = css.match(/@media[^{]*max-width:\s*540px[^{]*\{([\s\S]*?\.custom-100k-form-grid[\s\S]*?\})/);
assert(Boolean(formGridMedia && formGridMedia[1].includes('grid-template-columns: 1fr')), '.custom-100k-form-grid collapses to 1 column below 540px');

// 3. Check app.js Section 04 markup structure
console.log('\n3. Checking Custom Party Section 04 markup in app.js:');
assert(appJs.includes('class="custom-100k-form-grid"'), 'Section 04 markup carries .custom-100k-form-grid');

// Check that inline fixed 2-column styles are gone from Section 04
const hasInline2Col = /grid-template-columns:\s*1fr\s+1fr/.test(appJs.slice(appJs.indexOf('04 / Build Your Custom Founding Faction'), appJs.indexOf('04 / Starting Factions Picker')));
assert(!hasInline2Col, 'Section 04 contains no inline fixed 2-column styles');

// 4. Check that fixed 160px height is gone and accordion is present
console.log('\n4. Checking state allocation container in app.js:');
const hasFixed160 = /max-height:\s*160px/.test(appJs.slice(appJs.indexOf('04 / Build Your Custom Founding Faction'), appJs.indexOf('04 / Starting Factions Picker')));
assert(!hasFixed160, 'No fixed 160px height remains on state allocation container');

const hasAccordion = appJs.includes('alloc-region-accordion') && appJs.includes('<details') && appJs.includes('<summary');
assert(hasAccordion, 'Expandable regional accordion (<details>/<summary>) is present');

// 5. Check data attributes for state inputs are intact
assert(appJs.includes('data-state-alloc="${st.id}"'), 'State allocation inputs retain data-state-alloc attributes');

if (failed) {
  console.error('\n❌ REQ-253 tests failed.');
  process.exit(1);
} else {
  console.log('\n✅ All REQ-253 responsive drawer tests passed successfully (100%).');
  process.exit(0);
}
