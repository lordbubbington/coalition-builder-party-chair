# Version 0.14.2 Design Specification & Implementation Handoff

**Build Target:** Version 0.14.2 (Bug Fix & Cook PVI House District Calibration Patch)  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Party Candidate Isolation & Custom Scoping Hotfix, Authentic Cook PVI Congressional District Leans Integration, and Stepper Polish*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Compatibility:** `partyChairGame.save.v14.2` (Fully backward-compatible with `v14.1`, `v14` through `v1`)  
**Data Reference:** [**CURRENT_IN_GAME_DISTRICT_LEANS_COOK_PVI.csv**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/CURRENT_IN_GAME_DISTRICT_LEANS_COOK_PVI.csv)  
**Implementation Rule:** Authored by Design Agent. **DO NOT IMPLEMENT IN THIS CONVERSATION.** Hand off to an implementation agent using the copy-pastable prompt in Section 4.

---

## 1. Executive Summary & Defect Overview

Version 0.14.2 addresses two major defects and integrates the authoritative 435-district Cook PVI partisan leans dataset:

1. **Party Candidate Isolation & Custom Party Scoping (`BUG-04 / REQ-111`):**
   - **Problem:** When playing as a custom party or third party, the game displays Democratic primary candidates, prompts the player to endorse or rally behind Democrats, and populates keynote speaker and surrogate tour rosters with Democratic politicians.
   - **Root Cause:** In `app.js` (line 321), `playerIdentity()` hardcoded a fallback returning `'people'` (Democratic) whenever `baseTemplateId` was not in a preset list. Furthermore, `game.roster` for custom parties inherited Democratic leaders, and `step3PrimariesMarkup()` did not completely isolate custom primary pools.
   - **Resolution:** Decouple `playerIdentity()` so it strictly returns `'player'` for custom parties, enforce strict party filtering across all primary fields, keynote speaker lists, surrogate tour pools, and leadership hierarchy assignments, ensuring players **only control, see, and endorse candidates of their own party**.

2. **Integration of Cook PVI House District Leans (`REQ-118 / HOUSE-01`):**
   - **Problem:** Seed district leans in `scenario-2028.js` contained prototype artifacts (e.g., all Alabama seats were deep red including `AL-7`, while all California seats were blue including Republican-held seats).
   - **Resolution:** Ingest all 435 district leans from [**CURRENT_IN_GAME_DISTRICT_LEANS_COOK_PVI.csv**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/CURRENT_IN_GAME_DISTRICT_LEANS_COOK_PVI.csv) directly into `VERSION_01_HOUSE_DISTRICTS` in `scenario-2028.js` (and `data.js`), giving every congressional district authentic real-world partisan baselines (e.g., `AL-7` is `D+20.0`, `CA-5` is `R+20.0`, `AZ-6` is `EVEN`).

3. **Recruitment Phase 5-Step Stepper Safeguard (`BUG-03`):**
   - Verify that step clamps in `engine.js` (lines 5207, 7197) and `v07-scaffolding.js` (line 699) use `[1, 5]`, and footer navigation in `app.js` renders `#step-next` on Step 4 and `#advance-year` on Step 5.

---

## 2. Technical Subsystem Specifications

### Subsystem A: Strict Party Scoping & Custom Party Isolation (`BUG-04 / REQ-111`)

#### 1. Core Party Identity Decoupling (`app.js` line 320)
```javascript
// BEFORE:
function playerIdentity() {
  return ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'].includes(game.player.baseTemplateId) ? game.player.baseTemplateId : 'people';
}

// AFTER:
function playerIdentity() {
  if (game?.player?.custom) return 'player';
  if (game?.player?.id && game.player.id !== 'player') return game.player.id;
  if (game?.player?.baseTemplateId) return game.player.baseTemplateId;
  return 'people';
}
```

#### 2. Primary Endorsement Field Isolation (`app.js` lines 1856–1915)
- In `step3PrimariesMarkup()`, strictly lock `primaryParty` to `playerIdentity()`:
  ```javascript
  const identity = playerIdentity();
  primaryParty = identity;
  ```
- If the player's party has no auto-generated primary field in `scenario-2028.js` (`rawField.length === 0`), display the custom recruit card and clean empty field notice. **Never fall back to Democratic candidates (`people`) or rival fields.**
- Lock the `#primary-party` select dropdown to the player's party with no ability to switch to rival major parties.

#### 3. Surrogate Tour & Keynote Speaker Roster Isolation (`app.js` lines 2110–2120)
- In `step4WorkMarkup()`:
  - `keynotePool`: Filter strictly by `m.party === identity`.
  - `tourPool`: Filter strictly by `m.party === identity`.
  - For custom parties (`identity === 'player'`), exclude politicians whose `party !== 'player'`.

#### 4. Leadership Hierarchy Scoping (`app.js` lines 4656–4666)
- In `partyInfoTabMarkup()`:
  - `partySitting`: Strictly `(game.sittingMembers || []).filter((m) => m.party === identity)`.
  - `benchMembers`: Filter by `m.party === identity`.
  - Exclude rival party sitting members from being assigned to custom party leadership positions.

---

### Subsystem B: Cook PVI Congressional District Leans Integration (`REQ-118`)

- **Source File:** `c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\CURRENT_IN_GAME_DISTRICT_LEANS_COOK_PVI.csv`
- **Target File:** `scenario-2028.js` (and `data.js`)
- **Data Replacement in `VERSION_01_HOUSE_DISTRICTS`:**
  Update each district object's `lean` property with the value from column `In_Game_District_Lean_Raw`:
  - `AL-1`: `lean: -34.0` (R+34.0)
  - `AL-2`: `lean: -14.0` (R+14.0)
  - `AL-7`: `lean: 20.0` (D+20.0 — Rep. Terri Sewell)
  - `AK-1`: `lean: -7.0` (R+7.0)
  - `AZ-1`: `lean: -2.0` (R+2.0)
  - `AZ-3`: `lean: 44.0` (D+44.0)
  - `AZ-6`: `lean: 0.0` (EVEN Toss-Up)
  - `CA-1`: `lean: 14.0` (D+14.0)
  - `CA-5`: `lean: -20.0` (R+20.0 — Rep. Tom McClintock)
  - `TX-38`: `lean: -15.0` (R+15.0)
  - `WY-1`: `lean: -46.0` (R+46.0)
- **Engine Calculation Check (`engine.js` `estimateRaceMarginInternal`):**
  Ensure that for House races (`kind === 'house'`), margin projection calculates from `district.lean` directly rather than statewide baseline leans.

---

### Subsystem C: Stepper Continuity Safeguard (`BUG-03`)

- `engine.js` line 5207: `turnStep: clamp(Number(payload.step || 1), 1, 5)`
- `engine.js` line 7197: `turnStep: clamp(Number(parsed.turnStep || 1), 1, 5)`
- `v07-scaffolding.js` line 699: `turnStep: clamp(Number(game.turnStep || 1), 1, 5)`
- `app.js` line 3532: `${step < 5 ? '<button id="step-next">...' : '<button id="advance-year">...'}`
- `styles.css` line 401: `.v07-step-bar { grid-template-columns: repeat(5, minmax(0, 1fr)); }`

---

## 3. Minimal-Token Implementation Plan

- **Recommended Model:** **Gemini 3.8 Flash (High)** (or Gemini 2.5 Flash).
- **Execution Strategy:** Single-phase handoff prompt. The implementation agent runs a small Node script to update `VERSION_01_HOUSE_DISTRICTS` from the CSV with zero manual typing of 435 numbers, edits `app.js` for party isolation, runs verification, and compiles `build.ps1`.

---

## 4. Copy-Pastable Implementation Prompt for Coding Agent

Copy and paste the entire block below to your coding agent:

```text
Model: Gemini 3.8 Flash (High)
Role: Senior Full-Stack Game Engine & UI Engineer
Target Files:
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\app.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\engine.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\scenario-2028.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\data.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\v07-scaffolding.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\styles.css
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\CURRENT_IN_GAME_DISTRICT_LEANS_COOK_PVI.csv
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\build.ps1

Objective: Implement Version 0.14.2 resolving BUG-04 (Party Candidate Scoping), integrating Cook PVI district leans (REQ-118), and confirming BUG-03 (5-step stepper).

Instructions:

1. BUG-04 / REQ-111 (Strict Party Scoping & Custom Party Isolation):
   a. In app.js (line 320), replace playerIdentity() with:
      function playerIdentity() {
        if (game?.player?.custom) return 'player';
        if (game?.player?.id && game.player.id !== 'player') return game.player.id;
        if (game?.player?.baseTemplateId) return game.player.baseTemplateId;
        return 'people';
      }
   b. In app.js (step3PrimariesMarkup, around line 1858):
      - Ensure primaryParty strictly equals playerIdentity().
      - If rawField.length === 0, show clean empty-field notice and recruit prospect for the player's party; NEVER fall back to Democratic candidates.
      - Ensure the #primary-party select is locked and only displays the player's party.
   c. In app.js (step4WorkMarkup, lines 2110-2120):
      - In keynotePool and tourPool, filter sitting members strictly by m.party === playerIdentity().
      - Exclude politicians from other parties when leading a custom party.
   d. In app.js (partyInfoTabMarkup, lines 4656-4666):
      - Filter partySitting and benchMembers strictly by m.party === playerIdentity().

2. REQ-118 (Cook PVI House District Leans Integration):
   a. In scenario-2028.js (and data.js), update VERSION_01_HOUSE_DISTRICTS:
      - Read CURRENT_IN_GAME_DISTRICT_LEANS_COOK_PVI.csv (located in the workspace).
      - Map each district ID (e.g. 'AL-1' through 'WY-1') to its In_Game_District_Lean_Raw value.
      - Update the 'lean' property of every district in VERSION_01_HOUSE_DISTRICTS to match the CSV (e.g., AL-7 = 20.0, CA-5 = -20.0, AZ-6 = 0.0, WY-1 = -46.0).
   b. In engine.js (estimateRaceMarginInternal):
      - When kind === 'house', ensure margin baseline uses district.lean directly decoupled from statewide presidential margin.

3. BUG-03 (Recruitment Phase 5-Step Stepper Safeguard):
   a. In engine.js:
      - Line 5207: clamp(Number(payload.step || 1), 1, 5)
      - Line 7197: turnStep: clamp(Number(parsed.turnStep || 1), 1, 5)
   b. In v07-scaffolding.js line 699:
      - turnStep: clamp(Number(game.turnStep || 1), 1, 5)
   c. In app.js line 3532:
      - Change condition to `${step < 5 ? ... id="step-next" ... : ... id="advance-year" ...}`
      - Line 3531 text: 'Advance through Steps 1–5, then Confirm Turn.'
      - Line 2132 eyebrow: 'Step 5 of 5 · The Recruitment Phase'
   d. In styles.css line 401:
      - .v07-step-bar { grid-template-columns: repeat(5, minmax(0, 1fr)); }

4. Verification & Build:
   a. Create scripts/test-v0142-integration.cjs asserting:
      - Custom party playerIdentity() returns 'player', not 'people'.
      - Cook PVI leans correctly assigned (AL-7 === 20, CA-5 === -20, WY-1 === -46).
      - Step 5 is reachable with clamp upper bound 5.
   b. Run: node scripts/test-v0142-integration.cjs.
   c. Compile executable: powershell -ExecutionPolicy Bypass -File ./build.ps1.
   d. Confirm dist/release/Coalition Builder - Party Chair.exe is rebuilt.
```
