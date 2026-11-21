# Coalition Builder: Party Chair — Version 0.15.3 Design Specification

> **Build Type:** Minor Version (`0.0.x`)  
> **Target Version:** Version 0.15.3  
> **Status:** Packaged for Coding Agent Implementation  
> **Features Covered:** `REQ-162` through `REQ-170` (9 Features: 3 Medium, 4 Small, 2 Tiny)

---

## 1. Executive Summary & Inventory Matrix

Version 0.15.3 overhauls the map intelligence ecosystem, establishes real-time reactive feedback for state voter registrations, balances pre-campaign machine operations into a clean 8-card grid, restricts premier party privileges to appointed leadership figures, deprecates legacy UI relics (party wings, redundant sidebar widgets), and introduces a multi-office cross-party defection engine.

| Req ID | Title | Size | Target Files | Summary & Key Invariants |
| :--- | :--- | :---: | :--- | :--- |
| **REQ-162** | Forecast Maps Relocation to Forecasts Tab | Medium | `app.js`, `maps-0.3.js` | Move interactive Presidential and House projection maps from Map menu into Forecasts tab between summary cards and comparison table. Add cycling Senate class forecast map. |
| **REQ-163** | Political Landscape Map Restructuring | Medium | `app.js`, `maps-0.3.js`, `engine.js` | Map screen displays current/historical reality: 2024/Recent Presidential results, current 435 House control, current Senate class control, and 50-state combined Senate delegation (Blue 2 D, Red 2 R, Purple split). |
| **REQ-164** | Real-Time Reactive State Voter Registration Table | Small | `app.js`, `engine.js` | Disaggregated State Voter Registration Table dynamically binds to live `game.voterModel.states`, re-rendering immediately on any voter gain action with low-pop precision and delta badges (`+5K`). |
| **REQ-165** | Voter Registration & Outreach Action Rebalance | Small | `app.js`, `engine.js` | Remove non-functional second demographic dropdown. Rebalance voter gain: Minor parties gain $+1,000\text{ voters/EV}$; Major parties gain $+2,500\text{ voters/EV}$. Mutates live voter model directly. |
| **REQ-166** | Deprecate & Remove Legacy "Faction Confidence" Sidebar Panel | Tiny | `app.js`, `styles.css` | Remove legacy sidebar markup in `app.js` (lines 5070–5077). Reclaim right-column sidebar for Platform Profile and State Policy Bills. Preserve simulation engine invariants in `engine.js`. |
| **REQ-167** | Universal Politician Faction Display & Legacy Wing Deprecation | Small | `app.js`, `styles.css` | Every politician (candidates, leaders, sitting officials) visibly displays their assigned faction badge across all UI screens. Purge all obsolete "party wing" labels. Dropdown menus excluded from badges. |
| **REQ-168** | Restrict Keynote Speaker & State Tour to Active Party Leaders | Small | `app.js` | National Convention Keynote and State Tour actions strictly require an actively appointed Party Leader (`game.leadershipRoles.player`). Sitting officeholders without leadership posts are ineligible. |
| **REQ-169** | Remove Redundant Faction Summit & Leadership Hierarchy Cards | Tiny | `app.js`, `styles.css` | Remove 'Hold a Faction Summit' and 'Party Leadership Hierarchy' cards from Step 5 organizing grid, perfectly rebalancing the 2-column layout to an even 8 core machine operations (4 on each side). |
| **REQ-170** | Court Politician Action Overhaul | Medium | `app.js`, `engine.js` | Expand courting to Senators, Governors, and House members (labeled by office). Discontent gate: Happiness $\le 40$. Ideological gate: non-racial faction within 2.0 pts on both axes. Major succeeds; minor demands Party Leader post. Join closest faction. |

---

## 2. Detailed Technical & Architectural Specifications

### Subsystem A: Map Architecture & Forecaster Relocation (`REQ-162`, `REQ-163`)

#### 1. Relocation of Forecast Maps to Forecasts Tab (`REQ-162`)
- In `app.js` (inside `forecastersMarkup()`):
  - Extract the interactive projection maps container currently residing in `renderPoliticalLandscape` (Presidential and House forecaster maps).
  - Insert the forecast maps container directly between the **Pundit Forecaster Multi-Chamber Projections** summary cards and the **Battleground Race Ratings Comparison** table.
  - Add an interactive **Senate Forecast Map** representing the active constitutional Senate class (Class III in 2028, Class I in 2030, Class II in 2032):
    - Contested states shaded by 13-tier consensus forecaster ratings (or selected forecaster model).
    - Inactive Senate states shaded in neutral/current-control muted tones.
  - Forecaster model toggle pills (Blended Consensus, The Cooked Report, Sallow's Crystal Ball, Upside Elections) switch ratings seamlessly across Presidential, House, and Senate forecast maps.

#### 2. Restructuring Political Landscape Maps to Current/Historical Reality (`REQ-163`)
- In `renderPoliticalLandscape()` (`app.js`, `maps-0.3.js`):
  - The "Political Landscape" screen is re-anchored strictly to current political reality and historical outcomes:
    1. **Recent Presidential Election Map:** Displays certified results of the most recent presidential election (starts at 2024 certified results: Trump Red, Harris Blue; updates at the conclusion of each presidential cycle to show the newly elected administration).
    2. **Current House Control Map:** Shaded by sitting incumbent party control across all 435 congressional districts (Democrat Blue, Republican Red, Independent/Third Party).
    3. **Current Senate Class Map:** Displays incumbent party control for the 33–34 seats in the active Senate class going into the election (not a forward projection).
    4. **Combined 50-State Senate Map:** 50-state delegation map:
       - **Blue:** Both Senators are Democrats (or caucus Dem).
       - **Red:** Both Senators are Republicans (or caucus GOP).
       - **Purple:** Split delegation (1 Democrat and 1 Republican).

---

### Subsystem B: Live Electorate Synchronization & Action Rebalancing (`REQ-164`, `REQ-165`)

#### 1. Real-Time Reactive State Voter Registration Table (`REQ-164`)
- In `app.js` (`renderStateVoterRegistrationTable(game)`):
  - Ensure table rows bind directly to live `game.voterModel.states` data rather than static snapshots.
  - When any action increases registered voters in a state (e.g. Volunteer Drive via `executeVolunteerDrive`, Party Focus lock-in via `lockInPartyFocuses`, or Voter Registration & Outreach via `voter-registration-drive`):
    - Dispatch a state change event and immediately re-render `renderStateVoterRegistrationTable(game)` if currently visible.
    - Low-population precision: For smaller population states (VT, WY, AK, DE, ND, SD), display sufficient decimal resolution or dynamic K/M units so that gains of $+3,000$ to $+15,000$ voters are visibly obvious.
    - Render an in-cycle gain delta badge (e.g. `<span class="v15-reg-gain-badge">+5K</span>`) on the affected state row and party column.

#### 2. Voter Registration & Outreach Action Rebalance (`REQ-165`)
- In `step5StatesMarkup()` (`app.js`):
  - Remove the non-functional second demographic dropdown (`<select id="reg-demographic">`).
  - The card inline controls contain solely:
    - `<select id="reg-state">` (Target State)
    - `<button data-action="voter-registration-drive">Register</button>` (1 Action · $5M)
- In `engine.js` / action handler:
  - Calculate voter registration gain scaled by the target state's Electoral Vote count:
    ```javascript
    const isMajor = V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(playerIdentity());
    const stateEv = stateObj?.ev || 3;
    const voterGain = isMajor ? (2500 * stateEv) : (1000 * stateEv);
    ```
  - Mutate live state allocations directly via `addVotersToModel(game.voterModel, targetStateId, voterGain, playerPartyId)`.
  - Immediately refresh the Disaggregated State Voter Registration Table to display the new voters.

---

### Subsystem C: UI Cleanup, Grid Balance & Leadership Privileges (`REQ-166`, `REQ-168`, `REQ-169`)

#### 1. Deprecate Legacy Faction Confidence Sidebar Panel (`REQ-166`)
- In `app.js` (Party Information / Dashboard view, lines 5070–5077):
  - Remove `<section class="panel section-panel">...<div class="faction-list">${factionsMarkup()}</div></section>`.
  - Clean up / deprecate `function factionsMarkup()`.
  - Reclaim `<aside class="right-column">` space, neatly prioritizing Platform Profile (`platformMarkup()`) and State Policy Bills (`legislationMarkup()`).
  - Preserve underlying simulation logic in `engine.js` (`factionHappiness`, `factionConfidence`, `factionPenalty(game)` continue updating and reporting via the top-level Factions Tab).

#### 2. Restrict Keynote Speaker & State Tour to Active Party Leaders (`REQ-168`)
- In `app.js` (`step5StatesMarkup()`):
  - Form the eligible pool strictly from appointed Party Leaders:
    ```javascript
    const appointedLeaderIds = Object.values(game.leadershipRoles?.player || game.player?.leadershipRoles || {}).filter(Boolean);
    const partyLeaderPool = appointedLeaderIds.map((id) => memberById(id)).filter(Boolean);
    ```
  - `#keynote-speaker`: Filter dropdown to `partyLeaderPool`. If empty, show disabled prompt `[ Appoint Party Leaders in Leadership Menu to Select Keynote ]`.
  - `#tour-member`: Filter dropdown to `partyLeaderPool`. If empty, disable tour deployment until leaders are appointed.

#### 3. Remove Redundant Faction Summit & Leadership Hierarchy Cards (`REQ-169`)
- In `app.js` (`step5StatesMarkup()`):
  - Remove the `Hold a Faction Summit` card (lines 2306–2314).
  - Remove the `Party Leadership Hierarchy (14 Roles)` card (lines 2332–2344).
  - The remaining 8 core action cards render in a perfectly balanced 4x2 grid (4 on left, 4 on right):
    1. *Open a State Chapter* ($6M · 1 Act)
    2. *Statewide Voter Registration & Outreach* ($5M · 1 Act · `REQ-165`)
    3. *Court Politician to Caucus / Defect* ($4M · 1 Act · `REQ-170`)
    4. *State-Targeted Policy Bill* ($2–3M · 1 Act)
    5. *National Convention Keynote Speaker* (Free · 1x Cycle · `REQ-168`)
    6. *Recruit State Candidate* (1 Act)
    7. *Send a Leader on State Tour* (1 Act · `REQ-168`)
    8. *Run a Small-Donor Drive* (1 Act)

---

### Subsystem D: Universal Character Consistency & Courting Defection Engine (`REQ-167`, `REQ-170`)

#### 1. Universal Politician Faction Display & Wing Deprecation (`REQ-167`)
- Enforce the Universal "Politician" Terminology Rule: applies to all characters (candidates, leaders, sitting officials).
- In `app.js` (`memberMetricsBadgesMarkup(member)` and character inspection cards):
  - Render an in-universe styled faction badge: `<span class="v15-politician-faction-badge">${safe(factionName)}</span>`.
  - Completely purge all obsolete "party wing" references (`m.wing`, `${recruit.wing}`, `${candidate.wing}`, `.quote-wing-tag`).
  - Dropdown select menus (`<select>`) are strictly excluded from badge injection to avoid rendering glitches.

#### 2. Court Politician Action Overhaul (`REQ-170`)
- In `step5StatesMarkup()` & action handler (`persuade-independent-caucus` / `court-politician`):
  1. **Multi-Office Pool:** Include sitting **Senators**, **Governors**, and **House Representatives**.
     - Dropdown label format: `${officePrefix} ${m.name} (${m.stateId || m.district} · ${partyLabel})`.
  2. **Discontent Gate:** If politician is affiliated with or in a party, require `(politician.happiness || 50) <= 40`.
  3. **Ideological Compatibility Bridge:** Politician only appears available if the player's party contains at least one **non-racial faction** within 2.0 points ideologically on both social and economic issues:
     - `Math.abs(playerFaction.economic - targetFaction.economic) <= 2.0 && Math.abs(playerFaction.social - targetFaction.social) <= 2.0`
     - Exclude racial identity factions (`dem_black_voters`, `dem_traditional_latin`, `gop_cubans`, etc.).
  4. **Party Tier Execution:**
     - **Major Party:** Courting succeeds immediately upon action execution ($4M · 1 Action).
     - **Minor Party:** Politician demands an appointed **Party Leadership role** (`leadershipRoles`). Player confirms appointment to finalize defection.
  5. **Faction Assignment:** Defecting politician joins the faction in the player's party with the minimum Euclidean distance on social and economic axes:
     $$\text{dist} = \sqrt{(\text{Econ}_p - \text{Econ}_t)^2 + (\text{Social}_p - \text{Social}_t)^2}$$
     Personal happiness couples to the new faction baseline.

---

## 3. Implementation Checklist for Coding Agent

- [ ] **Step 1: Map Relocation (`REQ-162`, `REQ-163`)**
  - [ ] Move projection maps into `forecastersMarkup()` in `app.js` with cycling Senate forecast map.
  - [ ] Re-anchor `renderPoliticalLandscape()` to Recent Presidential, Current House, Current Senate Class, and 50-State Combined Senate delegation.
- [ ] **Step 2: Live Voter Registration Reactivity & EV Rebalance (`REQ-164`, `REQ-165`)**
  - [ ] Update `renderStateVoterRegistrationTable(game)` to bind live to `game.voterModel.states` and re-render on action dispatch.
  - [ ] Remove second demographic dropdown from Voter Registration card in `step5StatesMarkup()`.
  - [ ] Rebalance voter gain: $1,000\times \text{EV}$ (Minor) or $2,500\times \text{EV}$ (Major).
- [ ] **Step 3: UI Streamlining & Leadership Privileges (`REQ-166`, `REQ-168`, `REQ-169`)**
  - [ ] Remove legacy Faction Confidence sidebar section in `app.js` (lines 5070–5077) and clean `factionsMarkup()`.
  - [ ] Filter Keynote Speaker and State Tour dropdowns strictly to appointed `partyLeaderPool`.
  - [ ] Remove Faction Summit and Leadership Hierarchy cards from Step 5, yielding an even 4x2 grid (8 cards).
- [ ] **Step 4: Character Factions & Courting Overhaul (`REQ-167`, `REQ-170`)**
  - [ ] Display faction badges on all politician inspection cards; purge legacy "wing" text.
  - [ ] Implement multi-office courting (Senators, Governors, House) with $\le 40$ Happiness gate, 2-point non-racial ideological bridge, minor party leadership demand, and closest faction assignment.
- [ ] **Step 5: Verification & Executable Build**
  - [ ] Run `node build.js` and verify clean build exit code 0.
