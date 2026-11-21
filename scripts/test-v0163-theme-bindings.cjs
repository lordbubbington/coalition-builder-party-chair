/**
 * Test Suite for REQ-254: Semantic CSS Variable Binding for v0.16.2 Elements
 * Target: scripts/test-v0163-theme-bindings.cjs
 */

const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '..', 'styles.css');
const css = fs.readFileSync(cssPath, 'utf8');

const targetClasses = [
  'draft-priority-card',
  'custom-party-drawer',
  'succession-modal-panel',
  'anchor-crisis-panel',
];

console.log('Testing REQ-254 semantic CSS variable bindings in styles.css...\n');

let failed = false;

targetClasses.forEach((cls) => {
  // Find the primary class rule block (e.g. .cls { ... } or .cls, .other { ... })
  const baseRegex = new RegExp(`\\.${cls}\\s*(?:,[^{]*)?\\{([^}]+)\\}`, 'g');
  let match;
  let foundBase = false;

  while ((match = baseRegex.exec(css)) !== null) {
    foundBase = true;
    const ruleBody = match[1];
    console.log(`Checking base rule for .${cls}:`);

    // Must reference var(--panel), var(--panel2), var(--text), and var(--line)
    const hasPanel = ruleBody.includes('var(--panel)') || ruleBody.includes('var(--panel2)');
    const hasText = ruleBody.includes('var(--text)');
    const hasLine = ruleBody.includes('var(--line)');

    if (!hasPanel) {
      console.error(`  ❌ FAIL: .${cls} rule does not reference var(--panel) or var(--panel2)`);
      failed = true;
    } else {
      console.log(`  ✅ PASS: .${cls} binds to var(--panel) / var(--panel2)`);
    }

    if (!hasLine) {
      console.error(`  ❌ FAIL: .${cls} rule does not reference var(--line)`);
      failed = true;
    } else {
      console.log(`  ✅ PASS: .${cls} binds to var(--line)`);
    }

    if (!hasText) {
      console.error(`  ❌ FAIL: .${cls} rule does not reference var(--text)`);
      failed = true;
    } else {
      console.log(`  ✅ PASS: .${cls} binds to var(--text)`);
    }

    // Must not contain #0f172a or rgba(15,23,42,*)
    if (/#0f172a/i.test(ruleBody) || /rgba\(\s*15\s*,\s*23\s*,\s*42/i.test(ruleBody)) {
      console.error(`  ❌ FAIL: .${cls} rule contains hardcoded dark values (#0f172a or rgba(15,23,42,*))`);
      failed = true;
    } else {
      console.log(`  ✅ PASS: .${cls} contains no hardcoded #0f172a or rgba(15,23,42,*)`);
    }

    // Must contain no hardcoded hex or rgba values
    if (/#[0-9a-fA-F]{3,8}/.test(ruleBody)) {
      console.error(`  ❌ FAIL: .${cls} rule contains hardcoded hex values`);
      failed = true;
    } else {
      console.log(`  ✅ PASS: .${cls} contains no hardcoded hex`);
    }

    if (/rgba?\s*\(/.test(ruleBody)) {
      console.error(`  ❌ FAIL: .${cls} rule contains hardcoded rgba/rgb values`);
      failed = true;
    } else {
      console.log(`  ✅ PASS: .${cls} contains no hardcoded rgba/rgb`);
    }
  }

  if (!foundBase) {
    console.error(`❌ FAIL: Could not find base CSS rule for .${cls}`);
    failed = true;
  }

  // Also verify all related selectors (e.g. .cls:hover, .cls.selected) do not use hardcoded hex or rgba
  const allRegex = new RegExp(`\\.${cls}[^{]*\\{([^}]+)\\}`, 'g');
  while ((match = allRegex.exec(css)) !== null) {
    const body = match[1];
    if (/#0f172a/i.test(body) || /rgba\(\s*15\s*,\s*23\s*,\s*42/i.test(body)) {
      console.error(`  ❌ FAIL: Related rule for .${cls} contains hardcoded dark values`);
      failed = true;
    }
    if (/#[0-9a-fA-F]{3,8}/.test(body)) {
      console.error(`  ❌ FAIL: Related rule for .${cls} contains hardcoded hex values`);
      failed = true;
    }
    if (/rgba?\s*\(/.test(body)) {
      console.error(`  ❌ FAIL: Related rule for .${cls} contains hardcoded rgba/rgb values`);
      failed = true;
    }
  }
});

if (failed) {
  console.error('\n❌ REQ-254 tests failed.');
  process.exit(1);
} else {
  console.log('\n✅ All REQ-254 theme binding tests passed successfully (100%).');
  process.exit(0);
}
