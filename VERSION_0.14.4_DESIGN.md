# Version 0.14.4 Design Specification & Implementation Handoff

**Build Target:** Version 0.14.4  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Campaign Cadence & Live Polling Maps, Biennial Senate Rotation & Forecaster Scoping, Trust Velocity Dampening, Minor Party Ceilings, and Inter-Cycle Turnover*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Compatibility:** `partyChairGame.save.v14.4` (Fully backward-compatible with `v14.3`, `v14.2`, `v14.1`, `v14` through `v1`)  
**Design Status:** DESIGN SPECIFICATION ONLY. **DO NOT IMPLEMENT IN THIS CONVERSATION.**  
**Handoff Prompt:** See Section 4 for the complete, copy-pastable prompt for the coding agent.

---

## 1. Executive Summary & Inventory of Changes

Version 0.14.4 packages **11 core features** across the Small, Tiny, and Medium tiers:

| # | Req ID | Feature Title | Tier | Target File(s) | Summary |
| :-: | :---: | :--- | :---: | :--- | :--- |
| **1** | **REQ-133** | Campaign Phase Polling & Consensus Forecast Maps | **Medium** | `app.js`, `maps-0.3.js` | 4-tab interactive polling widget (Senators, House, Governor, State Leg) embedded directly above Grand-Strategy Actions using the 13-tier consensus map engine. |
| **2** | **REQ-131** | Campaign Phase Chronological Flavor Rebrand | **Tiny** | `app.js`, UI text | Rebrands campaign phase terminology from "Weeks" to "Months" (`Campaign Month ${month} of 5`) for authentic atmosphere without changing simulation math. |
| **3** | **REQ-132** | Campaign Phase Turn Cadence (5 Turns & 5 Actions) | **Small** | `engine.js`, `app.js` | Shortens campaign phase from 15 turns to 5 turns, increases actions per turn from 3 to 5 (25 total actions), and shifts October Surprise crisis to Turn 4. |
| **4** | **REQ-129** | Recruitment Actions Pool Inter-Cycle Reset | **Small** | `engine.js`, `app.js` | Reinitializes `organizingActionsRemaining = 20` and `actionsLeft = 20` in `startNextCycle()` so new election cycles never start with 0 actions. |
| **5** | **REQ-130** | State Legislative Slate Single-Cycle Scope & Foothold | **Small** | `engine.js`, `app.js` | Contested state slates apply strictly to that election; in future cycles, contestation expires unless $\ge 1$ seat was won, earning a permanent free foothold. |
| **6** | **REQ-134** | Public & Coalition Trust Velocity Dampening | **Small** | `engine.js` | Scales all Public Trust (`trust.independents`) and Coalition Trust (`trust.supporters`) deltas by $\times 0.1$ across events, backlash, autopsies, and actions. |
| **7** | **REQ-135 / REQ-139** | Minor Parties Approval Ceiling (25%) & Benchmark Retention | **Small** | `engine.js` | Enforces a hard cap of 25.0% on national approval for minor parties (`!party.isMajor`) while anchoring starting approval to authentic initial benchmarks (~0.2%–1.8%). |
| **8** | **REQ-136** | Starting Vacancies for Party & Faction Leaders | **Small** | `v07-scaffolding.js` | Party roles (`rhetoricalLeader`, `policyLeader`) and all Faction Leader roles initialize to `null` at game start; institutional roles remain pre-populated. |
| **9** | **REQ-137** | Two-Year Constitutional Senate Class Rotation Engine | **Small** | `engine.js` | Strictly rotates the active Senate class every 2 years ($\text{Class III (2028)} \to \text{Class I (2030)} \to \text{Class II (2032)} \to \text{Class III (2034)}$) in `startNextCycle()`. |
| **10** | **REQ-138** | Dynamic Senate Forecaster Projections | **Small** | `app.js`, `engine.js` | Replaces hardcoded Class III arrays in Forecaster view and battleground table with dynamic races from the active cycle's contested Senate class. |
| **11** | **REQ-140** | Commissioned Race Polling ($1.0M) & Archive | **Small** | `app.js`, `engine.js` | Action to spend $1.0M treasury to commission an internal poll on any race of choice, with a 'Commissioned polls' button displaying the active campaign poll archive. |

---

## 2. Technical Subsystem Specifications

### Subsystem A: Campaign Phase Cadence, Polling & Forecaster Maps (`REQ-131`, `REQ-132`, `REQ-133`)

#### 1. Turn Cadence & Action Economy (`REQ-132` in `engine.js` & `app.js`)
- In `engine.js` (`initialCampaign`, `startCampaignPhase`, `resetCampaignState`):
  ```javascript
  const campaign = {
    active: true,
    week: 1, // Interpreted as Month 1
    maxWeeks: 5, // 5 turns total
    weeklyActionsLeft: 5, // 5 actions per turn
    // ...
  };
  ```
- In `advanceCampaignWeek(game)` (`engine.js`):
  - When `currentWeek >= 5`, conclude campaign and immediately call `resolveVersion01GeneralElection`.
  - Otherwise, increment to `nextWeek = currentWeek + 1`, reset `weeklyActionsLeft = 5`.
  - Shift October Surprise trigger to Turn 4 in `drawCampaignEvent(game, week)`:
    ```javascript
    if (week === 4) {
      // Draw from OCTOBER_SURPRISES
      return { ...surprise, week: 4, isOctoberSurprise: true };
    }
    ```

#### 2. Flavor Rebrand from Weeks to Months (`REQ-131` in `app.js`)
- Update all headers, eyebrows, badges, and button labels:
  - Header: `Campaign Month ${week} of 5`
  - Turn Progression Button: `${week < 5 ? `Advance to Campaign Month ${week + 1} of 5 →` : `Proceed to General Election Night ${game.year || 2028} ★`}`
  - Ticker: `CAMPAIGN MONTH ${week}/5 · ${actionsLeft}/5 ACTIONS REMAINING`
  - Pill: `Campaign Actions: <b>${actionsLeft}/5</b>`

#### 3. Polling & Forecaster Maps Widget (`REQ-133` in `app.js`)
- In `renderCampaignPhase(game)` (`app.js`), immediately above `<section class="v08-campaign-card panel">` (Grand-Strategy Actions), insert the Polling widget:
  ```html
  <section class="panel section-panel v08-campaign-polling-panel" style="margin-bottom:20px">
    <div class="section-heading">
      <div>
        <div class="eyebrow">Battleground Intelligence & Polling Consensus</div>
        <h2>Live Campaign Polling & Consensus Forecasts</h2>
        <p style="margin:4px 0 0;font-size:13px;color:var(--muted)">Synthesized consensus projections across active chambers.</p>
      </div>
      <div class="v07-filter-tabs">
        <button type="button" class="tab-btn ${campaignPollingTab === 'senate' ? 'selected' : ''}" data-camp-poll-tab="senate">Senators</button>
        <button type="button" class="tab-btn ${campaignPollingTab === 'house' ? 'selected' : ''}" data-camp-poll-tab="house">House</button>
        <button type="button" class="tab-btn ${campaignPollingTab === 'governor' ? 'selected' : ''}" data-camp-poll-tab="governor">Governor</button>
        <button type="button" class="tab-btn ${campaignPollingTab === 'stateLeg' ? 'selected' : ''}" data-camp-poll-tab="stateLeg">State Legislature</button>
      </div>
    </div>
    <div class="v08-campaign-map-container" style="min-height:360px">
      <!-- Renders live SVG chamber map via renderChamberMap() with forecasterMapSource = 'consensus' -->
    </div>
    <div class="v08-commissioned-polling-bar" style="display:flex;gap:12px;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
      <button type="button" class="btn btn-primary" id="btn-commission-poll" data-action="commission-race-poll">
        📊 Commission Race Poll ($1.0M)
      </button>
      <button type="button" class="btn btn-secondary" id="btn-view-commissioned-polls" data-action="open-commissioned-polls">
        📋 Commissioned polls (${(game.commissionedPolls || []).length})
      </button>
      <span style="font-size:12px;color:var(--muted)">Poll any contested battleground race to uncover internal margin intelligence.</span>
    </div>
  </section>
  ```
- Clicking tabs toggles `campaignPollingTab` and reactively updates the rendered map.

#### 4. Commissioned Race Polling & Archive (`REQ-140` in `app.js` & `engine.js`)
- **Action Execution (`commissionRacePoll(game, { raceKey, office, stateId })`):**
  - Requires `game.treasury >= 1.0`. Deducts `$1.0M` from `game.treasury`.
  - Generates bespoke poll survey:
    - Calculates baseline matchup from state lean, candidate fame/popularity, environment tilt, and local organization.
    - Applies survey sampling variance ($\pm 3.5\%$ margin of error).
  - Appends to `game.commissionedPolls`:
    ```javascript
    game.commissionedPolls.unshift({
      id: `poll_${Date.now()}`,
      month: game.campaign?.week || 1,
      office, // 'senate', 'house', 'governor', 'stateLeg'
      raceKey,
      stateId,
      title,
      results: { playerShare, rivalShare, undecided, margin },
      moe: 3.5,
      timestamp: Date.now(),
    });
    ```
  - Displays instant poll results modal.
- **Commissioned Polls Drawer/Modal (`renderCommissionedPollsModal(game)`):**
  - Opens when pressing `Commissioned polls`.
  - Displays chronological list of all polls commissioned this cycle with office badge, month polled, top-line candidate percentages, margin, and trend comparison if polled previously.

---

### Subsystem B: Biennial Senate Class Rotation & Scoped Forecasters (`REQ-137`, `REQ-138`)

#### 1. Senate Class Rotation Engine (`REQ-137` in `engine.js`)
- In `engine.js` (`startNextCycle`):
  ```javascript
  const nextYear = (game.year || 2028) + 2;
  const cycleIndex = Math.round((nextYear - 2028) / 2);
  const classes = [3, 1, 2];
  const nextSenateClass = classes[((cycleIndex % 3) + 3) % 3];
  const nextSenateRaces = getActiveSenateRaces(game, nextYear);

  return {
    ...game,
    year: nextYear,
    activeSenateClass: nextSenateClass,
    activeSenateRaces: nextSenateRaces,
    // ...
  };
  ```

#### 2. Dynamic Senate Forecaster Scoping (`REQ-138` in `app.js` & `engine.js`)
- In `app.js` (`forecastersMarkup`):
  - Replace the hardcoded Class III battleground list (`allCompetitiveKeys`):
    ```javascript
    const activeSenateList = game.activeSenateRaces || getActiveSenateRaces(game, game.year || 2028);
    const senateCompetitiveKeys = activeSenateList.map((r) => ({
      key: `senate:${r.stateId}`,
      office: 'U.S. Senate',
      name: `${STATES.find((s) => s.id === r.stateId)?.name || r.stateId} Senate (Class ${game.activeSenateClass === 1 ? 'I' : game.activeSenateClass === 2 ? 'II' : 'III'})`,
    }));
    ```
  - In Forecaster tables and headers, display `U.S. Senate Projection (Class ${activeSenateRoman})`.

---

### Subsystem C: Inter-Cycle Reset & State Legislative Foothold (`REQ-129`, `REQ-130`)

#### 1. Recruitment Actions Pool Reset (`REQ-129` in `engine.js`)
- In `engine.js` (`startNextCycle`):
  ```javascript
  organizingActionsRemaining: 20,
  actionsLeft: 20,
  actionsSpentThisCycle: 0,
  recruitsThisCycle: 0,
  billsThisCycle: 0,
  ```

#### 2. State Legislative Single-Cycle Scope & Retention (`REQ-130` in `engine.js`)
- In `startNextCycle(game)` (`engine.js`):
  ```javascript
  const nextSlates = {};
  STATES.forEach((s) => {
    const seatsHeld = game.stateHouseSeatCounts?.[s.id]?.[playerPartyId] || 0;
    if (seatsHeld >= 1 || isMajorParty) {
      nextSlates[s.id] = true; // Foothold established or major party
    } else {
      nextSlates[s.id] = false; // Expired: must contest again
    }
  });
  ```

---

### Subsystem D: Trust Dampening, Minor Party Ceilings & Leadership Vacancies (`REQ-134`, `REQ-135`, `REQ-136`)

#### 1. Public & Coalition Trust Velocity Dampening (`REQ-134` in `engine.js`)
- Whenever applying trust deltas (`supporters` or `independents`):
  ```javascript
  const dampenedSupportersDelta = (rawDelta.supporters || 0) * 0.1;
  const dampenedIndependentsDelta = (rawDelta.independents || 0) * 0.1;
  ```
  Applies in `applyCampaignEventChoice`, post-election autopsy choices, leadership reassignments, and campaign actions.

#### 2. Minor Parties National Approval Ceiling Cap & Benchmark Retention (`REQ-135` / `REQ-139` in `engine.js`)
- In `computeUnifiedPartyApproval(game)` (`engine.js`):
  Minor party starting approval must anchor strictly to their authentic baseline benchmarks (`baseShare` / `lastPresidentialShare` in `data.js` $\approx 0.2\%–1.8\%$) at game start, rather than jumping to 25.0%. The 25.0% cap operates strictly as an upper ceiling during growth:
  ```javascript
  if (!party.isMajor) {
    const baselineShare = Math.max(0.2, party.baseShare || 1.5);
    const ballotRatio = partyBallot / baselineShare;
    const leaderFactor = (avgLeaderPop - 40) * 0.05;
    const scaledApproval = baselineShare * ballotRatio + leaderFactor + trustTilt * 0.1;
    unified = clamp(round(scaledApproval, 1), 0.1, 25.0);
  }
  ```

#### 3. Starting Vacancies for Party & Faction Leaders (`REQ-136` in `v07-scaffolding.js`)
- In `initializeLeadershipRolesForParty(game, partyIdentityId)`:
  - If `role.category === 'party'` (`rhetoricalLeader`, `policyLeader`) $\implies$ set `roles[role.id] = null;`
  - If `role.category === 'faction'` $\implies$ set `roles[role.id] = null;`
  - Institutional, cabinet, and opposition roles remain initialized to sitting members.

---

## 3. Automated Test Verification Suite

Create `scripts/test-v0144-integration.cjs` asserting:
1. **Campaign Cadence:** Campaign initializes with `maxWeeks: 5`, `weeklyActionsLeft: 5`, and advances through 5 turns to Election Night.
2. **October Surprise Timing:** Triggers specifically on Turn 4 (`week === 4`).
3. **Senate Rotation:** Advancing from 2028 $\to$ 2030 sets `activeSenateClass: 1`; 2030 $\to$ 2032 sets `activeSenateClass: 2`; 2032 $\to$ 2034 sets `activeSenateClass: 3`.
4. **Action Pool Reset:** `startNextCycle()` resets `organizingActionsRemaining: 20` and `actionsLeft: 20`.
5. **State Slate Expiration:** Unheld state slates revert to uncontested in next cycle if 0 seats won; remain contested if $\ge 1$ seat won.
6. **Trust Dampening:** Event choices awarding $+3.0$ trust result in $+0.3$ applied trust.
7. **Minor Approval Ceiling & Benchmark Retention:** Minor parties start at authentic baseline benchmarks (~0.2%–1.8%) and clamp national approval at an upper ceiling of $\le 25.0\%$.
8. **Initial Vacancies:** `initializeLeadershipRolesForParty()` produces `null` for `rhetoricalLeader`, `policyLeader`, and all faction leader roles.
9. **Commissioned Race Polling:** Commissioning a poll deducts $1.0M from treasury, adds a poll to `game.commissionedPolls`, and clicking 'Commissioned polls' opens the campaign polling history modal.

---

## 4. Coding Agent Implementation Handoff Prompt

```markdown
You are implementing Version 0.14.4 for Coalition Builder: Party Chair.
Follow the complete technical specification in VERSION_0.14.4_DESIGN.md.

Key tasks:
1. Campaign Phase Cadence & Polling (REQ-131, REQ-132, REQ-133, REQ-140):
   - Update engine.js initialCampaign & advanceCampaignWeek: maxWeeks = 5, weeklyActionsLeft = 5.
   - Shift October Surprise trigger to Turn 4 (week === 4) in drawCampaignEvent.
   - Update app.js campaign UI copy to "Campaign Month ${week} of 5" and "${actionsLeft}/5 Actions Remaining".
   - Embed 4-tab interactive polling widget (Senators, House, Governor, State Legislature) above Grand Strategy actions in app.js using the consensus forecast map.
   - Add "📊 Commission Race Poll ($1.0M)" button allowing players to spend $1.0M to poll any active race of choice, and adjacent "📋 Commissioned polls" button showing all polls commissioned so far this cycle.

2. Biennial Senate Rotation & Forecasters (REQ-137, REQ-138):
   - In engine.js startNextCycle, rotate activeSenateClass every 2 years: Class III (2028) -> Class I (2030) -> Class II (2032) -> Class III (2034).
   - In app.js forecastersMarkup, dynamically scope Senate projections and table rows to the active Senate class.

3. Inter-Cycle Turnover & State Slates (REQ-129, REQ-130):
   - In engine.js startNextCycle, reinitialize organizingActionsRemaining = 20 and actionsLeft = 20.
   - Reset contested state legislative slates for minor/custom parties unless >= 1 seat was won.

4. Simulation Tuning & Setup (REQ-134, REQ-135, REQ-136):
   - Dampen Public and Coalition trust deltas by multiplying by 0.1 in engine.js.
   - Cap minor party national approval at 25.0% in computeUnifiedPartyApproval() while preserving authentic starting benchmarks (~0.2%–1.8%).
   - In v07-scaffolding.js initializeLeadershipRolesForParty, initialize party and faction leader roles to null.

5. Verification:
   - Create scripts/test-v0144-integration.cjs asserting all 8 subsystem tests.
   - Run tests and compile executable via ./build.ps1.
```
