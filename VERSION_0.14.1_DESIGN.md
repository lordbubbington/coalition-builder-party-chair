# Version 0.14.1 Design Specification & Bug Fix Architecture

**Build Target:** Version 0.14.1 (Quick Bug Fix Patch)  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Recruitment Phase 5-Step Stepper & Engine Step Clamping Hotfix*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Compatibility:** `partyChairGame.save.v14.1` (Fully backward-compatible with `v14` through `v1`)  
**Design Status:** APPROVED FOR IMPLEMENTATION (PENDING AUTHORIZATION)  
**Implementation Rule:** DO NOT IMPLEMENT UNTIL EXPLICITLY AUTHORIZED BY THE OWNER.

---

## 1. Executive Summary & Defect Analysis

### Defect Report (`BUG-03`)
> *"The 5th step of the recruitment phase is broken and not clickable"*

### Root Cause Analysis
In Version 0.14, a dedicated **Step 4: State Legislative Slates** (`REQ-114`) was introduced between Step 3 (Primary Endorsements) and the yearly operational pool. This expanded **The Recruitment Phase** from 4 steps to 5 steps:
1. `Step 1: Unified Platform Issues`
2. `Step 2: Major Priorities & Focus`
3. `Step 3: Primary Endorsements`
4. `Step 4: State Legislative Slates` (`REQ-114`)
5. `Step 5: Recruitment Actions Pool` (formerly Party Machine Operations)

While `app.js` declared all 5 steps in `stepDefs` and wired up `currentStep()` to `Math.min(5, ...)`, five critical architectural and layout disconnects left Step 5 completely inaccessible, unclickable, and visually distorted:

1. **Engine Turn Step Clamping (`engine.js` line 5207):**
   ```javascript
   if (actionId === 'set-turn-step') {
     return { ...game, turnStep: clamp(Number(payload.step || 1), 1, 4) };
   }
   ```
   The engine clamped `turnStep` to an upper bound of `4`. When the player clicked the Step 5 pill (`data-turn-step="5"`), `engine.js` evaluated `clamp(5, 1, 4) === 4` and returned `turnStep: 4`. The state machine refused to enter step 5.

2. **Save & State Hydration Clamping (`engine.js` line 7197 & `v07-scaffolding.js` line 699):**
   Both `normalizeGame()` and `v07-scaffolding.js` clamped `turnStep` with `clamp(Number(parsed.turnStep || 1), 1, 4)`. Even if step 5 were somehow loaded, state hydration instantly demoted it to 4.

3. **Premature Footer Advancement Button (`app.js` line 3532):**
   ```javascript
   ${step < 4
     ? `<button type="button" class="button button-gold" id="step-next">Next Step (Step ${step + 1} of 5) →</button>`
     : `<button type="button" class="button button-gold" id="advance-year" ${canConfirm ? '' : 'disabled'}>${confirmLabel} →</button>`}
   ```
   The conditional check evaluated `step < 4`. When the player reached Step 4, the forward button `#step-next` disappeared completely and was replaced by `#advance-year` (*"Resolve Primaries & Launch General Election Campaign →"*), preventing the player from ever advancing to Step 5 sequentially.

4. **Grid Layout Overflow (`styles.css` line 401):**
   ```css
   .v07-step-bar {
     display: grid;
     grid-template-columns: repeat(4, minmax(0, 1fr));
     gap: 10px;
   }
   ```
   The CSS grid explicitly specified 4 columns. With 5 step pills rendered, the 5th pill wrapped onto an orphaned second row, causing visual clipping and layout disruption.

5. **Eyebrow & Helper String Mismatches (`app.js` line 2132 & 3531):**
   - The header eyebrow in `step4WorkMarkup()` still announced: `Step 4 of 4 · Party Machine Operations`.
   - The navigation footer helper note announced: `Advance through Steps 1–4, then Confirm Turn.`.

6. **Interactive Tutorial Sequence (`app.js` lines 180–204):**
   The guided tutorial expected the final action and `#advance-year` to trigger on Step 4, out-of-sync with the 5-step flow.

---

## 2. Technical Fix Specifications (By File)

### Fix 1: Engine Action Dispatcher (`engine.js`)
- **Target Line:** Line 5207
- **Change:** Expand upper clamping bound from `4` to `5`.
```javascript
// BEFORE:
if (actionId === 'set-turn-step') {
  return { ...game, turnStep: clamp(Number(payload.step || 1), 1, 4) };
}

// AFTER:
if (actionId === 'set-turn-step') {
  return { ...game, turnStep: clamp(Number(payload.step || 1), 1, 5) };
}
```

### Fix 2: State Normalization & Save Deserialization (`engine.js`)
- **Target Line:** Line 7197
- **Change:** Expand upper clamping bound in `normalizeGame()` to `5`.
```javascript
// BEFORE:
turnStep: clamp(Number(parsed.turnStep || 1), 1, 4),

// AFTER:
turnStep: clamp(Number(parsed.turnStep || 1), 1, 5),
```

### Fix 3: Legacy Scaffold Bridge (`v07-scaffolding.js`)
- **Target Line:** Line 699
- **Change:** Expand upper clamping bound in `hydrateV07GameState()` to `5`.
```javascript
// BEFORE:
turnStep: clamp(Number(game.turnStep || 1), 1, 4),

// AFTER:
turnStep: clamp(Number(game.turnStep || 1), 1, 5),
```

### Fix 4: Frontend Step Stepper & Button Rendering (`app.js`)
- **Target Lines:** Lines 3531–3535
- **Change:** Update footer condition to `step < 5` so `#step-next` renders on Step 4 (advancing to Step 5), and `#advance-year` renders exclusively on Step 5. Update helper text to reference Steps 1–5.
```javascript
// BEFORE:
      <div class="v07-step-nav panel">
        <button type="button" class="button" id="step-back" ${step <= 1 ? 'disabled' : ''}>← Back</button>
        <span class="v07-turn-note">${safe(game.lastNote || 'Advance through Steps 1–4, then Confirm Turn.')}</span>
        ${step < 4
          ? `<button type="button" class="button button-gold" id="step-next">Next Step (Step ${step + 1} of 5) →</button>`
          : `<button type="button" class="button button-gold" id="advance-year" ${canConfirm ? '' : 'disabled'}>${confirmLabel} →</button>`}
      </div>

// AFTER:
      <div class="v07-step-nav panel">
        <button type="button" class="button" id="step-back" ${step <= 1 ? 'disabled' : ''}>← Back</button>
        <span class="v07-turn-note">${safe(game.lastNote || 'Advance through Steps 1–5, then Confirm Turn.')}</span>
        ${step < 5
          ? `<button type="button" class="button button-gold" id="step-next">Next Step (Step ${step + 1} of 5) →</button>`
          : `<button type="button" class="button button-gold" id="advance-year" ${canConfirm ? '' : 'disabled'}>${confirmLabel} →</button>`}
      </div>
```

### Fix 5: Step 5 Eyebrow & Nomenclature (`app.js`)
- **Target Line:** Line 2132
- **Change:** Align eyebrow with canonical phase nomenclature (`REQ-113`).
```javascript
// BEFORE:
<div class="eyebrow">Step 4 of 4 · Party Machine Operations</div>

// AFTER:
<div class="eyebrow">Step 5 of 5 · The Recruitment Phase</div>
```

### Fix 6: Step Bar CSS Grid Layout (`styles.css`)
- **Target Line:** Line 401
- **Change:** Set grid template columns to 5 equal columns to seamlessly fit all 5 step pills on desktop.
```css
/* BEFORE: */
.v07-step-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

/* AFTER: */
.v07-step-bar {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}
```

### Fix 7: Tutorial Step Continuity (`app.js`)
- **Target Lines:** Lines 180–204
- **Change:** Insert `step-5-next` tutorial step to guide new chairs cleanly from Step 4 (State Legislative Slates) to Step 5 (Recruitment Actions Pool), updating `fundraise` and `advance-turn` targets to Step 5.
```javascript
    {
      key: 'step-4-next',
      requiredTab: 'actions',
      requiredStep: 3,
      selector: '#step-next',
      title: 'Advance to Step 4: State Legislative Slates',
      body: 'Click Next Step to inspect downballot state legislative slate contestation.',
    },
    {
      key: 'step-5-next',
      requiredTab: 'actions',
      requiredStep: 4,
      selector: '#step-next',
      title: 'Advance to Step 5: Recruitment Actions Pool',
      body: 'Click Next Step to spend leadership actions on state chapters, recruits, state bills, keynote speaker, and fundraising.',
    },
    {
      key: 'fundraise',
      requiredTab: 'actions',
      requiredStep: 5,
      selector: '[data-action="fundraise"]:not(:disabled)',
      fallbackSelector: '#advance-year',
      title: 'Step 5: Choose This Year’s Work',
      body: 'Click Fundraise (or use any yearly organizational action such as opening a state chapter or naming your National Convention Keynote Speaker).',
    },
    {
      key: 'advance-turn',
      requiredTab: 'actions',
      requiredStep: 5,
      selector: '#advance-year:not(:disabled)',
      title: 'Confirm Turn',
      body: 'Click Confirm Turn to advance to the next organizing turn. Confirming Turn 20 resolves primaries and takes you straight into Election Night.',
    },
```

---

## 3. Minimal-Token Implementation Plan

Because Version 0.14.1 is a targeted bug fix across 4 files, it can be executed in a **single, highly efficient agent turn** using minimal tokens:

1. **Recommended Model:** **Gemini 3.8 Flash (High)** (or Gemini 2.5 Flash).
   - *Why Flash:* This patch requires precise targeted surgical edits (changing `<= 4` to `<= 5`, updating 1 CSS grid property, and updating tutorial steps). Gemini Flash processes these edits with near-instant execution and zero AST hallucinations while consuming < 15% of the token quota required by larger reasoning models.
2. **Single Phase Execution:** All edits are contiguous and strictly isolated to:
   - `engine.js` (2 lines)
   - `v07-scaffolding.js` (1 line)
   - `app.js` (15 lines)
   - `styles.css` (1 line)
3. **Automated Verification:** A lightweight Node verification script (`scripts/test-v0141-bugfix.cjs`) validates that `turnStep` smoothly traverses 1 → 2 → 3 → 4 → 5, that pills are clickable, and that the build compiles cleanly.

---

## 4. Copy-Pastable Implementation Prompt

When you are ready to implement Version 0.14.1, copy and paste the prompt below:

```text
Model: Gemini 3.8 Flash (High)
Role: Senior Full-Stack Game Engine & UI Engineer
Target Files:
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\engine.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\v07-scaffolding.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\app.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\styles.css
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\scripts\test-v0141-bugfix.cjs
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\build.ps1

Objective: Implement the Version 0.14.1 hotfix resolving BUG-03 (Step 5 of The Recruitment Phase broken and unclickable).

Instructions:
1. In engine.js:
   - At line 5207 ('set-turn-step'), change clamp upper bound from 4 to 5:
     return { ...game, turnStep: clamp(Number(payload.step || 1), 1, 5) };
   - At line 7197 (normalizeGame), change clamp upper bound from 4 to 5:
     turnStep: clamp(Number(parsed.turnStep || 1), 1, 5),

2. In v07-scaffolding.js:
   - At line 699 (hydrateV07GameState), change clamp upper bound from 4 to 5:
     turnStep: clamp(Number(game.turnStep || 1), 1, 5),

3. In app.js:
   - In actionsTabMarkup() (around line 3532), change condition from `step < 4` to `step < 5`:
     ${step < 5
       ? `<button type="button" class="button button-gold" id="step-next">Next Step (Step ${step + 1} of 5) →</button>`
       : `<button type="button" class="button button-gold" id="advance-year" ${canConfirm ? '' : 'disabled'}>${confirmLabel} →</button>`}
   - Update footer helper text (line 3531) to:
     'Advance through Steps 1–5, then Confirm Turn.'
   - In step4WorkMarkup() (line 2132), update eyebrow to:
     <div class="eyebrow">Step 5 of 5 · The Recruitment Phase</div>
   - In tutorial steps (lines 180-204), add 'step-5-next' so advancing past Step 4 leads to Step 5, and set fundraise/advance-turn requiredStep to 5.

4. In styles.css:
   - At line 401 (.v07-step-bar), change grid-template-columns from repeat(4, minmax(0, 1fr)) to:
     grid-template-columns: repeat(5, minmax(0, 1fr));

5. Verification:
   - Create scripts/test-v0141-bugfix.cjs testing:
     a) dispatching 'set-turn-step' with step 5 returns game.turnStep === 5.
     b) normalizeGame({ turnStep: 5 }) preserves turnStep: 5.
     c) HTML output on step 4 renders id="step-next" (Step 5 of 5).
     d) HTML output on step 5 renders id="advance-year".
   - Run: node scripts/test-v0141-bugfix.cjs.
   - Run: powershell -ExecutionPolicy Bypass -File ./build.ps1 to rebuild the release executable.
```
