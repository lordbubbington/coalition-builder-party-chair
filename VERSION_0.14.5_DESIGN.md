# Version 0.14.5 Design Specification & Implementation Handoff

**Build Target:** Version 0.14.5  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Grassroots Mobilization (Volunteer Drive), Commissioned Polling & Race Intelligence, Diminishing-Returns Candidate Ad Curves & Office-Tiered Tranches, and Minor Party Benchmark Anchoring*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Compatibility:** `partyChairGame.save.v14.5` (Fully backward-compatible with `v14.4`, `v14.3`, `v14.2`, `v14.1`, `v14` through `v1`)  
**Design Status:** DESIGN SPECIFICATION ONLY. **DO NOT IMPLEMENT IN THIS CONVERSATION.**  
**Handoff Prompt:** See Section 4 for the complete, copy-pastable prompt for the coding agent.

---

## 1. Executive Summary & Inventory of Changes

Version 0.14.5 packages **4 core Small features and bug fixes** across the simulation engine, campaign phase actions, and polling intelligence:

| # | Req ID | Feature Title | Tier | Target File(s) | Summary |
| :-: | :---: | :--- | :---: | :--- | :--- |
| **1** | **REQ-139 / BUG-06** | Minor Party Starting Popularities Benchmark Retention | **Small** | `engine.js` | Anchor minor party starting approvals to authentic initial benchmarks (~0.2%–1.8%) rather than jumping to 25.0%, preserving 25% strictly as an upper growth ceiling. |
| **2** | **REQ-140** | Commissioned Race Polling ($1.0M) & Archive Drawer | **Small** | `app.js`, `engine.js` | Action on the Live Campaign Polling panel to spend $1.0M treasury to commission internal polls on any race, with an adjacent 'Commissioned polls' archive modal. |
| **3** | **REQ-141** | Candidate Ad Funding Diminishing Returns Polling Curve & Office Tranches | **Small** | `engine.js`, `app.js` | Piecewise linear diminishing returns polling curve ($1M $\to$ +1% up to $500M $\to$ +8%), office-tiered tranches ($1M House / $2M Senate & Gov), and unrestricted funding regardless of candidate happiness. |
| **4** | **REQ-142** | Campaign Action: Volunteer Drive (Replacing Caucus Retreat) | **Small** | `app.js`, `engine.js` | Replaces Caucus Retreat with Volunteer Drive ($3M · 1 Action). Includes state dropdown selector and discrete random outcome awarding 500 to 10,000 registered voters (hidden percentages). |

---

## 2. Technical Subsystem Specifications

### Subsystem A: Minor Party Approval Benchmark Retention (`REQ-139` / `BUG-06`)

#### 1. Root Cause & Problem Analysis
- In `engine.js` line 1344 (`computeUnifiedPartyApproval`):
  ```javascript
  let unified = clamp(
    round(genericBallotScore * 0.40 + presComponent * 0.20 + avgLeaderPop * 0.40 + trustTilt + minorScalePenalty + envNudge, 1),
    8,
    92
  );
  if (!party.isMajor) {
    unified = Math.min(unified, 25.0);
  }
  ```
- Because `genericBallotScore` defaults to ~48, `presComponent` to 50, and `avgLeaderPop` to 41, the raw score for minor parties evaluates to ~45.6%. Clamping via `Math.min(unified, 25.0)` artificially inflated all minor parties (Libertarians, Greens, Constitution, Socialists) to **exactly 25.0% approval** at game start.

#### 2. Formula Calibration (`engine.js`)
- Replace the minor party clamping in `computeUnifiedPartyApproval()`:
  ```javascript
  if (!party.isMajor) {
    const baselineShare = Math.max(0.2, party.baseShare || 1.5);
    const ballotRatio = partyBallot / baselineShare;
    const leaderFactor = (avgLeaderPop - 40) * 0.05;
    const scaledApproval = baselineShare * ballotRatio + leaderFactor + (trustTilt || 0) * 0.1;
    unified = clamp(round(scaledApproval, 1), 0.1, 25.0);
  }
  ```
- **Verification:** Minor parties start at their authentic single-digit / fractional baselines (~1.8% for Libertarian/Green, ~0.2% for Constitution/Socialist) while preserving the 25.0% maximum growth ceiling.

---

### Subsystem B: Commissioned Race Polling & History Archive (`REQ-140`)

#### 1. UI Placement & Controls (`app.js`)
- On the **Live Campaign Polling & Consensus Forecasts** panel (`Battleground Intelligence & Polling Consensus`), insert the polling action toolbar:
  ```html
  <div class="v08-commissioned-polling-bar" style="display:flex;gap:12px;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
    <button type="button" class="btn btn-primary" id="btn-commission-poll" data-action="commission-race-poll">
      📊 Commission Race Poll ($1.0M)
    </button>
    <button type="button" class="btn btn-secondary" id="btn-view-commissioned-polls" data-action="open-commissioned-polls">
      📋 Commissioned polls (${(game.commissionedPolls || []).length})
    </button>
    <span style="font-size:12px;color:var(--muted)">Poll any contested battleground race to uncover internal margin intelligence.</span>
  </div>
  ```

#### 2. Poll Generation & Data Architecture (`engine.js`)
- **Execution Function:** `commissionRacePoll(game, { raceKey, office, stateId })`
  - Prerequisites: Requires `game.treasury >= 1.0`. Deducts `$1.0M` from `game.treasury`.
  - Margin Calculation: Evaluates state lean, candidate net approval/fame, national environment tilt, chapter infrastructure, and campaign ad spending.
  - Adds survey variance: $\pm 3.5\%$ margin of error ($N = 600$ likely voters).
  - Record structure added to `game.commissionedPolls`:
    ```javascript
    const pollRecord = {
      id: `poll_${Date.now()}_${raceKey}`,
      month: game.campaign?.week || 1,
      office, // 'senate', 'house', 'governor', 'stateLeg'
      raceKey,
      stateId,
      title: formatRaceTitle(raceKey, office, stateId),
      playerShare: round(playerPoll, 1),
      rivalShare: round(rivalPoll, 1),
      undecided: round(undecided, 1),
      margin: round(playerPoll - rivalPoll, 1),
      moe: 3.5,
      timestamp: Date.now(),
    };
    game.commissionedPolls.unshift(pollRecord);
    ```
- **Archive Viewer (`renderCommissionedPollsModal(game)`):**
  - Displays chronological list of all commissioned polls this cycle.
  - Lists race title, campaign month, top-line candidate shares, margin lead, and trend comparisons if the same race was polled across multiple months.

---

### Subsystem C: Candidate Ad Funding Diminishing Returns & Office-Tiered Tranches (`REQ-141`)

#### 1. Piecewise Linear Diminishing Returns Formula (`engine.js`)
- In `engine.js`, implement `computeFundingPollingLift(dollarsMillions)`:
  ```javascript
  function computeFundingPollingLift(dollarsMillions) {
    const spend = Math.max(0, Number(dollarsMillions) || 0);
    const BRACKETS = [
      { spend: 0, lift: 0.0 },
      { spend: 1, lift: 1.0 },
      { spend: 3, lift: 2.0 },
      { spend: 7, lift: 3.0 },
      { spend: 15, lift: 4.0 },
      { spend: 31, lift: 5.0 },
      { spend: 63, lift: 6.0 },
      { spend: 150, lift: 7.0 },
      { spend: 500, lift: 8.0 },
    ];
    if (spend <= 0) return 0.0;
    for (let i = 0; i < BRACKETS.length - 1; i++) {
      const a = BRACKETS[i];
      const b = BRACKETS[i + 1];
      if (spend >= a.spend && spend <= b.spend) {
        const frac = (spend - a.spend) / (b.spend - a.spend);
        return Number((a.lift + frac * (b.lift - a.lift)).toFixed(2));
      }
    }
    return 8.0; // Clamped at +8.0% for >= $500M
  }
  ```
- *Example:* Spending **$2.0M** falls halfway between $1.0M (+1.0%) and $3.0M (+2.0%) $\implies$ yields **+1.5% in polls**.

#### 2. Office-Tiered Funding Unit Costs (`app.js` & `engine.js`)
- In `allocateCandidateFunds(game, raceKey)`:
  - Determine unit cost based on race type:
    - **U.S. House races:** `$1.0M` per allocation tranche.
    - **U.S. Senate races:** `$2.0M` per allocation tranche.
    - **Gubernatorial races:** `$2.0M` per allocation tranche.
  - In `app.js` Candidate Budget Triage table:
    - House buttons render: `<button ... data-allocate-funds="${cand.raceKey}">+$1M</button>`
    - Senate/Governor buttons render: `<button ... data-allocate-funds="${cand.raceKey}">+$2M</button>`

#### 3. Unrestricted Candidate Happiness Allocation
- Remove any happiness ceiling gating candidate allocations.
- Chairs can freely fund candidates who are at **100% happiness** (`cand.happiness === 100`), gated solely by available treasury funds (`game.treasury >= unitCost`).
- Candidate triage table renders: `Allocated: $X.XM (+Y.Y% in polls)`.

---

### Subsystem D: Campaign Action: Volunteer Drive (`REQ-142`)

#### 1. Action Card Transformation (`app.js`)
- Replace the `Caucus Retreat & Cajoling` action card with `Volunteer Drive`:
  - **Header:** `COST: $3M · 1 ACTION`
  - **Action Title:** `Volunteer Drive`
  - **Flavor Text:**
    `"Deploy professional field organizers and neighborhood precinct captains to launch an intensive voter registration and volunteer mobilization drive in a key state."`
  - **State Dropdown Selector:** Dropdown `<select class="v08-volunteer-state-select">` populating all 50 states (+ DC).
  - **Button:** `<button ... class="button button-gold">Launch Volunteer Drive ($3M · 1 Action) →</button>`

#### 2. Discrete Probability Outcome Distribution (`engine.js`)
- When executed (`executeVolunteerDrive(game, stateId)`):
  - Deducts `$3M` treasury and `1 action`.
  - Evaluates discrete PRNG distribution:
    ```javascript
    const OUTCOMES = [
      { voters: 500, weight: 1 },
      { voters: 1000, weight: 2 },
      { voters: 1500, weight: 4 },
      { voters: 2000, weight: 6 },
      { voters: 2500, weight: 10 },
      { voters: 3000, weight: 15 },
      { voters: 3500, weight: 20 },
      { voters: 4000, weight: 15 },
      { voters: 4500, weight: 10 },
      { voters: 5000, weight: 5 },
      { voters: 6000, weight: 2 },
      { voters: 6500, weight: 2 },
      { voters: 7000, weight: 1 },
      { voters: 7500, weight: 1 },
      { voters: 8000, weight: 1 },
      { voters: 8500, weight: 1 },
      { voters: 9000, weight: 1 },
      { voters: 9500, weight: 1 },
      { voters: 10000, weight: 2 },
    ];
    ```
- **Information Obscurity:** Percentages are hidden from the player. UI displays qualitative vibes only.
- **State Impact:** Adds the registered voters directly to the player's party voter rolls in that state, boosting local turnout and baseline lean on Election Night.

---

## 3. Automated Test Verification Suite

Create `scripts/test-v0145-integration.cjs` asserting:
1. **Minor Benchmark Retention:** Initial minor party approvals evaluate to authentic benchmarks (~0.2%–1.8%) and do not start at 25.0%.
2. **Commissioned Poll Deductions:** Commissioning a poll costs $1.0M treasury and appends a record to `game.commissionedPolls`.
3. **Archive Viewer:** `game.commissionedPolls` displays historical surveys with margin lead and month.
4. **Funding Interpolation Curve:** `computeFundingPollingLift(2.0)` returns exactly `1.5%`.
5. **Office-Tiered Funding Costs:** House allocation spends $1.0M; Senate/Governor allocation spends $2.0M.
6. **100% Happy Funding:** Candidates with `happiness: 100` successfully receive funding allocations.
7. **Volunteer Drive Outcomes:** Volunteer drive spends $3.0M + 1 Action and draws voter gains strictly between 500 and 10,000 voters.

---

## 4. Coding Agent Implementation Handoff Prompt

```markdown
You are implementing Version 0.14.5 for Coalition Builder: Party Chair.
Follow the complete technical specification in VERSION_0.14.5_DESIGN.md.

Key tasks:
1. Minor Party Approval Benchmark Retention (REQ-139 / BUG-06):
   - In engine.js computeUnifiedPartyApproval(), scale minor party approval from baselineShare and localized standing so starting approvals remain at initial benchmarks (~0.2%–1.8%) while retaining the 25.0% upper ceiling cap.

2. Commissioned Race Polling & Archive (REQ-140):
   - In app.js Live Campaign Polling panel, add "📊 Commission Race Poll ($1.0M)" and "📋 Commissioned polls (${count})" buttons.
   - In engine.js commissionRacePoll(), deduct $1.0M, compute race polling with +-3.5% MoE, and record to game.commissionedPolls.
   - Build commissioned polls archive modal displaying survey history and margins.

3. Candidate Ad Funding Diminishing Returns Curve & Office Tranches (REQ-141):
   - In engine.js, implement computeFundingPollingLift() using piecewise linear interpolation across the 9 anchor points ($0M=0% to $500M=8%, e.g. $2M=1.5%).
   - Wire funding lift directly into candidate polling and Election Night vote shares.
   - Set funding tranche buttons to $1.0M for House races and $2.0M for Senate and Governor races in app.js and allocateCandidateFunds().
   - Allow funding candidates even when at 100% happiness.

4. Campaign Action: Volunteer Drive (REQ-142):
   - In app.js and engine.js, replace Caucus Retreat with Volunteer Drive ($3M · 1 Action).
   - Add state dropdown selector.
   - Implement discrete probability distribution (500 to 10,000 voters) without exposing mathematical percentages in the UI.
   - Add enrolled voters to the party's voter base in that state.

5. Verification:
   - Create scripts/test-v0145-integration.cjs asserting all 7 subsystem tests.
   - Run tests and compile executable via ./build.ps1.
```
