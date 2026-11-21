# Version 0.14.3 Design Specification & Implementation Handoff

**Build Target:** Version 0.14.3  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Campaign Phase Candidate Scoping & 3rd Party Mechanics, Dynamic Contestation Quotas, State Legislature Variable Costs, and Electorate Footprint Recalibration*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Compatibility:** `partyChairGame.save.v14.3` (Fully backward-compatible with `v14.2`, `v14.1`, `v14` through `v1`)  
**Design Status:** DESIGN SPECIFICATION ONLY. **DO NOT IMPLEMENT IN THIS CONVERSATION.**  
**Handoff Prompt:** See Section 4 for the complete, copy-pastable prompt for the coding agent.

---

## 1. Executive Summary & Inventory of Changes

Version 0.14.3 packages **6 core features and fixes**:

| # | Feature / Bug | Category | Target File(s) | Summary |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Campaign Phase Party Candidate Isolation** | Bug Fix (`BUG-05`) | `engine.js`, `app.js` | Eliminate Democratic candidate fallback in `initializeCandidateFunding()` and `generateWeeklyRequests()`. Strictly scope candidate funding entries to the player's active party. |
| **2** | **Third-Party Campaign Phase Architecture** | Campaign Mechanics | `engine.js`, `app.js` | Minor and custom parties do not have access to Super PACs. In `candidateFunding`, only races where the party actually fielded a nominee are registered. |
| **3** | **Libertarian Starting Race Contestation Quotas** | Ballot Access & Data | `engine.js` | At start of game, Libertarians contest 100% of active Senate races, 60% of House districts (randomly assigned via PRNG), and 100% of active Governor races. |
| **4** | **Green Starting Race Contestation Quotas** | Ballot Access & Data | `engine.js` | At start of game, Greens contest 50% of active Senate races (randomly assigned), 30% of House districts (randomly assigned), and 50% of active Governor races (randomly assigned). |
| **5** | **State Legislature Variable Cost & 1-Seat Rule (`LEG-02`)** | Economy & Downballot | `engine.js`, `app.js` | Slate contestation cost scales by Electoral Votes from $1M (3 EVs) to $5M (54 EVs), rounded to the nearest million ($\text{round}(1 + 4 \times \frac{\text{EV}-3}{51})$). Parties automatically contest state legislatures if holding $\ge 1$ seat. |
| **6** | **Accurate Minor Party Starting Voter Scalings** | Demographics & UI | `engine.js`, `app.js`, `voter-model-0.5.js` | Greens start with 0.50M voters (5,000 sample voters); Socialists and Constitution start with 0.10M voters (1,000 sample voters). Fix `modeledVotersForParty()` to prevent 3.6M `other` fallback. |

---

## 2. Technical Subsystem Specifications

### Feature 1: Campaign Phase Party Candidate Isolation (`BUG-05`)
- **Problem:** When playing as any non-Democratic party (Republicans, Libertarians, Greens, Socialists, Constitution, or Custom), the 15-week campaign dashboard displayed Democratic candidates in the triage list, and Super PAC funding requests asked for money on behalf of Democratic candidates.
- **Root Cause:**
  - In `engine.js` line 3946 (`initializeCandidateFunding`):
    `const identityId = ['people', 'heritage'].includes(game.player?.baseTemplateId) ? game.player.baseTemplateId : 'people';`
  - In `engine.js` line 3988 (`generateWeeklyRequests`):
    `const identityId = ['people', 'heritage'].includes(game.player?.baseTemplateId) ? game.player.baseTemplateId : 'people';`
  - Any party that was not `people` or `heritage` defaulted directly to `'people'` (Democratic).
- **Code Fix (`engine.js` lines 3946 & 3988):**
  ```javascript
  const identityId = (game.player?.custom) ? 'player' : (game.player?.id || game.player?.baseTemplateId || 'people');
  ```
- **Primary Results Lookup (`engine.js` line 3953):**
  Query `resultsByRace[`${raceKey}:${identityId}`]` strictly matching the player party's primary winner.

---

### Feature 2: Third-Party Campaign Phase Architecture
- **No Super PAC Access for Minor Parties:**
  - Minor and custom parties (`!isMajorParty(game, 'player')`) operate without Super PAC apparatus.
  - In `engine.js` (`generateWeeklyRequests`):
    ```javascript
    if (!isMajorParty(game, 'player')) {
      return []; // Third parties have no Super PAC weekly requests
    }
    ```
  - In `app.js` (`campaignDashboardMarkup`):
    When `!isMajorParty(game, 'player')`, suppress the Super PAC allocation panel and replace it with direct committee treasury support triage.
- **Nominee-Only Candidate Registration:**
  - In `initializeCandidateFunding()`: Major parties field candidates in all 435 House, active Senate, and active Governor races.
  - **Third Parties:** Only register races in `candidateFunding` where the party **actually fielded a nominee** (`winner !== undefined`):
    ```javascript
    const registerRace = (raceKey, kind, houseIncumbentAmt, nonIncMajorAmt) => {
      const winner = resultsByRace[`${raceKey}:${identityId}`];
      if (!major && !winner) {
        return; // Skip race: third party has no nominee in this contest
      }
      ...
    };
    ```
  - This ensures minor party chairs only manage races they actually contested and recruited for during The Recruitment Phase.

---

### Features 3 & 4: Libertarian & Green Starting Race Contestation Quotas
- **Target Function:** `buildStartingBallotAccess(seed = 2028)` in `engine.js`.
- **Deterministic PRNG Helper:** Use seeded hash `version01Hash(`${seed}:${raceKey}:${partyId}`)` to guarantee deterministic, persistent random assignment.
- **Libertarian Contestation Quota (Feature 3):**
  - **Senate:** **100%** of active constitutional Senate races (`allStates.map((st) => [st, true])`).
  - **Governorships:** **100%** of active 2028 gubernatorial races (`activeGovStates.map((st) => [st, true])`).
  - **U.S. House:** Exactly **60%** of congressional districts, randomly assigned via hash:
    ```javascript
    const libertyHouse = {};
    houseDistricts.forEach((d) => {
      const h = version01Hash(`${seed}:house:${d.id}:liberty`);
      if ((h % 100) < 60) libertyHouse[d.id] = true;
    });
    ```
- **Green Contestation Quota (Feature 4):**
  - **Senate:** Exactly **50%** of active constitutional Senate races, randomly assigned:
    ```javascript
    const greenSenate = {};
    activeSenateStates.forEach((st) => {
      const h = version01Hash(`${seed}:senate:${st}:green`);
      if ((h % 100) < 50) greenSenate[st] = true;
    });
    ```
  - **Governorships:** Exactly **50%** of active 2028 gubernatorial contests, randomly assigned:
    ```javascript
    const greenGov = {};
    activeGovStates.forEach((st) => {
      const h = version01Hash(`${seed}:gov:${st}:green`);
      if ((h % 100) < 50) greenGov[st] = true;
    });
    ```
  - **U.S. House:** Exactly **30%** of congressional districts, randomly assigned via hash:
    ```javascript
    const greenHouse = {};
    houseDistricts.forEach((d) => {
      const h = version01Hash(`${seed}:house:${d.id}:green`);
      if ((h % 100) < 30) greenHouse[d.id] = true;
    });
    ```

---

### Feature 5: State Legislature Variable Cost, 1-Seat Automatic Contestation & Single-Cycle Scope (`LEG-02`)
- **Single-Election Scope for Contested Slates:**
  - Choosing to contest a state legislative slate in The Recruitment Phase (paying EV-scaled $1M–$5M + 1 action) **strictly guarantees ballot contestation for THAT election cycle only**.
  - In future elections, minor and custom parties must start over and choose to contest the slate again—**unless they won at least one seat in that state legislature**.
- **1-Seat Automatic Contestation Rule (Foothold Retention):**
  - If a party controls $\ge 1$ seat in a state's legislature (`game.stateHouseSeatCounts[stateId]?.[partyId] >= 1`), that legislature carries over into all future cycles with **permanent, free automatic contestation** (Universal Allocation).
  - In states where a contested slate yielded 0 seats won, slate access expires upon cycle transition in `startNextCycle()`, reverting to uncontested (0% presence).
- **Dynamic Slate Cost (EV-Scaled) for Unheld States (0 Seats):**
  - Cost scales strictly by **Electoral Votes (EV)**, rounded to the nearest whole million:
    $$\text{Cost}(\$M) = \text{round}\left(1 + 4 \times \frac{\text{EV} - 3}{51}\right)$$
  - Plus **1 Leadership Action**.
  - **50-State Tiers:**
    - **$1M (28 States, 3–9 EVs):** AK, DE, ND, SD, VT, WY, HI, ID, ME, MT, NH, RI, WV, NE, NM, AR, IA, KS, MS, NV, UT, CT, OK, KY, LA, OR, AL, SC.
    - **$2M (18 States, 10–19 EVs):** CO, MD, MN, MO, WI, AZ, IN, MA, TN, WA, VA, NJ, MI, GA, NC, OH, IL, PA.
    - **$3M (2 States, 20–35 EVs):** NY (28), FL (30).
    - **$4M (1 State, 36–45 EVs):** TX (40).
    - **$5M (1 State, >45 EVs):** CA (54).
- **UI Button Label in Step 4:**
  `Contest Slate · $${slateCost}M (1 action)`

---

### Feature 6: Minor Party Starting Voter Scalings
- **155M Electorate Model Scalings (1 sample voter = 100 represented voters):**
  - **Greens:** **0.50 Million voters** $\longrightarrow$ **5,000 sample voters** (distributed across states, $\sim 100$ per state).
  - **Socialists:** **0.10 Million voters** $\longrightarrow$ **1,000 sample voters** (distributed across states, $\sim 20$ per state).
  - **Constitution Party:** **0.10 Million voters** $\longrightarrow$ **1,000 sample voters** (distributed across states, $\sim 20$ per state).
- **Target Files & Functions:**
  1. `engine.js` (`ensureThirdPartyAffiliations` / `createGame`):
     ```javascript
     voterModel.affiliations.thirdParty.byParty.green = 5000;       // 0.50M represented voters
     voterModel.affiliations.thirdParty.byParty.socialist = 1000;   // 0.10M represented voters
     voterModel.affiliations.thirdParty.byParty.constitution = 1000;// 0.10M represented voters
     ```
  2. `app.js` (`modeledVotersForParty` line 316):
     ```javascript
     function modeledVotersForParty(partyId) {
       const affiliations = (game?.voterModel?.affiliations) || VOTER_MODEL.affiliations;
       if (partyId === 'people') return affiliations.people.representedVoters;
       if (partyId === 'heritage') return affiliations.heritage.representedVoters;
       if (partyId === 'independent') return affiliations.independent.representedVoters;
       if (['liberty', 'green', 'socialist', 'constitution'].includes(partyId)) {
         return (affiliations.thirdParty?.byParty?.[partyId] || 0) * 100;
       }
       if (partyId === 'player') {
         return (affiliations.thirdParty?.byParty?.player || affiliations.thirdParty?.byParty?.[game.player?.baseTemplateId] || 1000) * 100;
       }
       return (affiliations.thirdParty?.byParty?.other || 0) * 100;
     }
     ```
  3. This completely prevents Socialists, Greens, and Constitution chairs from seeing 3.60M (the `other` bucket) on their dashboard.

---

## 3. Minimal-Token Implementation Plan

- **Recommended Model:** **Gemini 3.8 Flash (High)**.
- **Scope:** 2 main files (`engine.js`, `app.js`), plus an automated verification test script (`scripts/test-v0143-integration.cjs`).
- **Token Efficiency:** Clear, targeted replacements for `initializeCandidateFunding`, `buildStartingBallotAccess`, and `modeledVotersForParty`.

---

## 4. Copy-Pastable Implementation Prompt for Coding Agent

Copy and paste the entire block below to your coding agent:

```text
Model: Gemini 3.8 Flash (High)
Role: Senior Full-Stack Game Simulation & UI Engineer
Target Files:
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\engine.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\app.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\scripts\test-v0143-integration.cjs
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\build.ps1

Objective: Implement Version 0.14.3 encompassing 6 key updates: Campaign Phase party candidate isolation, 3rd party nominee-only campaign triage with no Super PACs, Libertarian and Green starting contestation quotas, EV-scaled state legislature contestation costs, and accurate starting voter scalings for Greens (0.5M), Socialists (0.1M), and Constitution (0.1M).

Instructions:

1. Campaign Phase Party Candidate Isolation & Third Party Architecture (Features 1 & 2):
   a. In engine.js (initializeCandidateFunding, line 3946):
      - Replace identityId line with:
        const identityId = (game.player?.custom) ? 'player' : (game.player?.id || game.player?.baseTemplateId || 'people');
      - In registerRace(): if (!major && !winner) return;
        (Third parties only register candidateFunding for races where they actually had a nominee).
   b. In engine.js (generateWeeklyRequests, line 3988):
      - If (!isMajorParty(game, 'player')) return [];
        (Third parties have no Super PAC weekly funding requests).
      - Replace identityId line with:
        const identityId = (game.player?.custom) ? 'player' : (game.player?.id || game.player?.baseTemplateId || 'people');
   c. In app.js (campaignDashboardMarkup):
      - When !isMajorParty(game, 'player'), suppress Super PAC request blocks and display a note:
        "Independent & Grassroots Campaign: Third parties do not operate Super PACs. Direct campaign assistance is funded from committee treasury."

2. Libertarian & Green Starting Race Contestation Quotas (Features 3 & 4):
   a. In engine.js (buildStartingBallotAccess, lines 75-100):
      - Libertarians:
        - senate: all active Senate states (100%).
        - governor: all active Governor states (100%).
        - house: exactly 60% of House districts randomly assigned using version01Hash(`${seed}:house:${d.id}:liberty`) % 100 < 60.
      - Greens:
        - senate: exactly 50% of active Senate states randomly assigned using version01Hash(`${seed}:senate:${st}:green`) % 100 < 50.
        - governor: exactly 50% of active Governor states randomly assigned using version01Hash(`${seed}:gov:${st}:green`) % 100 < 50.
        - house: exactly 30% of House districts randomly assigned using version01Hash(`${seed}:house:${d.id}:green`) % 100 < 30.

3. State Legislature Variable Cost, 1-Seat Automatic Contestation & Single-Cycle Scope (Feature 5):
   a. In engine.js and app.js:
      - Helper formula for slate cost by state EV:
        function stateSlateCost(stateEv) {
          const ev = Math.max(3, Math.min(54, Number(stateEv || 3)));
          return Math.round(1 + 4 * (ev - 3) / 51);
        }
      - In contest-state-legislative-slate action handler:
        Deduct stateSlateCost(state.ev) (between $1M and $5M) from committee treasury + 1 action for THAT election only.
      - Single-Election Scope & Reset (startNextCycle):
        Contested slates expire between election cycles. Only states where game.stateHouseSeatCounts[stateId]?.[partyId] >= 1 carry over with automatic free contestation. In states where 0 seats were won, the state reverts to uncontested and must be contested again.
      - In app.js step4StateLegMarkup:
        Display EV-scaled cost on button: "Contest Slate · $${cost}M (1 action)".

4. Accurate Starting Voter Scalings for Minor Parties (Feature 6):
   a. In engine.js (ensureThirdPartyAffiliations):
      - voterModel.affiliations.thirdParty.byParty.green = 5000;       // 0.50M represented voters
      - voterModel.affiliations.thirdParty.byParty.socialist = 1000;   // 0.10M represented voters
      - voterModel.affiliations.thirdParty.byParty.constitution = 1000;// 0.10M represented voters
      - Update perState sample voter allocations in states array to sum to these totals.
   b. In app.js (modeledVotersForParty, line 316):
      - Replace function with:
        function modeledVotersForParty(partyId) {
          const affiliations = (game?.voterModel?.affiliations) || VOTER_MODEL.affiliations;
          if (partyId === 'people') return affiliations.people.representedVoters;
          if (partyId === 'heritage') return affiliations.heritage.representedVoters;
          if (partyId === 'independent') return affiliations.independent.representedVoters;
          if (['liberty', 'green', 'socialist', 'constitution'].includes(partyId)) {
            return (affiliations.thirdParty?.byParty?.[partyId] || 0) * 100;
          }
          if (partyId === 'player') {
            return (affiliations.thirdParty?.byParty?.player || affiliations.thirdParty?.byParty?.[game.player?.baseTemplateId] || 1000) * 100;
          }
          return (affiliations.thirdParty?.byParty?.other || 0) * 100;
        }

5. Verification & Executable Build:
   a. Create scripts/test-v0143-integration.cjs asserting:
      - Minor parties only register nominees in candidateFunding.
      - Libertarians have 100% Senate/Gov and ~60% House ballot access.
      - Greens have ~50% Senate/Gov and ~30% House ballot access.
      - stateSlateCost(3) === 1, stateSlateCost(54) === 5, stateSlateCost(19) === 2.
      - modeledVotersForParty('green') === 500000.
      - modeledVotersForParty('socialist') === 100000.
      - modeledVotersForParty('constitution') === 100000.
   b. Run: node scripts/test-v0143-integration.cjs.
   c. Compile executable: powershell -ExecutionPolicy Bypass -File ./build.ps1.
   d. Confirm dist/release/Coalition Builder - Party Chair.exe is rebuilt.
```
