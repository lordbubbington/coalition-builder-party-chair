# Coalition Builder: Party Chair — Version 0.15.5 Design Specification

> **Build Type:** Minor Version (`0.0.x`)  
> **Target Version:** Version 0.15.5  
> **Status:** Packaged for Coding Agent Implementation  
> **Features Covered:** `REQ-172` through `REQ-175` (4 Features: 1 Medium, 3 Small)

---

## 1. Executive Summary & Inventory Matrix

Version 0.15.5 brings major enhancements to long-term electorate growth, multi-party forecaster intelligence, third-party map visualization, and faction-voter synchronization:
1. **Persistent Electorate Growth (`REQ-172`):** Voter registration gains achieved through field operations carry over permanently across 2-year cycles, cumulatively expanding the total electorate year-over-year.
2. **Multi-Party & Live Polling Forecasters (`REQ-173`):** Pundit forecast models (*Cooked*, *Sallow*, *Upside*, and *Consensus*) break out of the binary two-party assumption to model third-party contention, ideological spoiler siphoning, live commissioned poll data, and recalculate at the close of every operational turn and phase.
3. **Third-Party Forecast Map Gradients & Legend Omission (`REQ-174`):** Forecast maps render third-party leads in calibrated multi-tier color gradients (Solid, Likely, Lean, Tilt) while strictly omitting third-party colors from the map legends/keys to preserve clean broadcast styling.
4. **Voter Faction Realignment (`REQ-175`):** When voters switch parties via the 1/4th Shift Realignment Rule between cycles, their underlying faction affiliations shift in lockstep to ideologically compatible recipient factions.

| Req ID | Title | Size | Target Files | Summary & Key Invariants |
| :--- | :--- | :---: | :--- | :--- |
| **REQ-172** | Persistent Multi-Cycle Voter Registration Carryover | Small | `engine.js` | In-cycle voter gains permanently carry over into subsequent cycles ($2028 \to 2030 \to 2032+$), progressively expanding total represented voters year over year with zero baseline resets. |
| **REQ-173** | Multi-Party Forecasters with Live Polling & Reactivity | Medium | `engine.js`, `app.js` | Forecasters account for 3rd parties and siphoning, ingest commissioned polls and tracking data, and refresh at the end of every individual turn and phase transition. |
| **REQ-174** | Third-Party Forecast Map Gradients & Legend Omission | Small | `maps-0.3.js`, `app.js` | 3rd party leaders shaded on forecast maps with 4-tier intensity gradients (Libertarian Gold, Green Emerald, Constitution Purple, Socialist Crimson, Independent Teal); strictly omitted from map legend keys. |
| **REQ-175** | Voter Faction Realignment via 1/4th Shift Rule | Small | `engine.js` | When voters shift parties during inter-cycle realignment, their underlying faction memberships (`state.factions` and `voterModel.factions`) shift to ideologically closest recipient factions. |

---

## 2. Detailed Technical & Architectural Specifications

### Subsystem A: Persistent Multi-Cycle Voter Registration Carryover (`REQ-172`)

#### 1. Core Mechanics (`engine.js`)
- In `startNextCycle(game)` and `realignVotingBlocksBetweenElections(game, outcome)`:
  - Preserve `game.voterModel` dynamically mutated state across cycles.
  - Do NOT reset `state.representedVoters`, `state.affiliations`, or `voterModel.representedVoters` to hardcoded static baselines (e.g. 155.00M).
  - Calculate national represented voters as:
    $$\text{Total Electorate}_{Y+2} = \sum_{\text{states}} \text{state.representedVoters}$$
  - The 1/4th Shift Realignment Rule operates directly on the newly expanded voter base.

---

### Subsystem B: Multi-Party Forecaster Engine with Live Polling Integration & Turn/Phase Reactivity (`REQ-173`)

#### 1. Multi-Party Margin Modeling (`estimateRaceMarginInternal` & `presidentialStateMargin` in `engine.js`)
- Expand race margin evaluation beyond binary `people` vs. `heritage`:
  - Evaluate all ballot-qualified parties (Libertarian, Green, Constitution, Socialist, Independent, and custom parties) based on:
    - Candidate quality differential (`cand.quality`).
    - In-state registered voter share (`state.affiliations[partyId]`).
    - Campaign treasury funding allocations (`candidateFunding[raceKey]`) and media market ad saturation (`raceAdModifiers[raceKey]`).
  - **Spoiler / Siphon Dynamics:**
    - Third-party candidate strength siphons from ideologically aligned major parties (Greens/Socialists draw from Democrats; Libertarians/Constitution draw from Republicans).
  - **Third-Party Contention:**
    - When a third-party or independent candidate leads the field or polls in contention, forecasters assign ratings to that party (e.g. `Tilt LIB`, `Lean GRN`, `Likely IND`, `Solid SOC`).

#### 2. Live Polling Synthesis
- Forecasters dynamically blend structural fundamentals with live campaign polling:
  - **Commissioned Internal Polls (`game.commissionedPolls`):** When a race has a commissioned poll on record, blend the poll spread into the margin with high recency weighting (e.g., 40% poll / 60% fundamentals).
  - **Campaign Tracking & Wave Shifts:** Weekly tracking shifts and wave momentum (`game.campaign.waveMomentum`) actively influence projected spreads.

#### 3. Systematic Turn-End & Phase-End Forecast Refresh
- Ensure `buildForecasters(game)` executes systematically:
  1. **At the end of every individual operational turn:**
     - After each Chair Machine Operation in Phase 1 (turns 1 to 5).
     - After each weekly turn in Phase 3 (weeks 1 to 5).
  2. **At every phase transition exit:**
     - Phase 1 exit (Recruitment $\to$ Primaries).
     - Phase 2 exit (Primaries $\to$ General Campaign).
     - Phase 3 exit (Campaign $\to$ Election Night).
     - Phase 4 exit (Election Night & Realignment $\to$ Next Cycle).

---

### Subsystem C: Third-Party Forecast Map Color Gradients & Legend Omission (`REQ-174`)

#### 1. Multi-Tier Third-Party Gradients (`maps-0.3.js` & `app.js`)
- On all forecast maps (Presidential, House, Senate, and outlet-specific maps), support multi-tier gradients for third parties:
  - **Libertarian (Amber / Gold):**
    - `Solid LIB`: `#b45309` · `Likely LIB`: `#d97706` · `Lean LIB`: `#f59e0b` · `Tilt LIB`: `#fde68a`
  - **Green (Emerald / Forest Green):**
    - `Solid GRN`: `#047857` · `Likely GRN`: `#10b981` · `Lean GRN`: `#34d399` · `Tilt GRN`: `#a7f3d0`
  - **Constitution (Purple / Violet):**
    - `Solid CON`: `#581c87` · `Likely CON`: `#7e22ce` · `Lean CON`: `#a855f7` · `Tilt CON`: `#e9d5ff`
  - **Socialist (Crimson / Rose):**
    - `Solid SOC`: `#881337` · `Likely SOC`: `#be123c` · `Lean SOC`: `#f43f5e` · `Tilt SOC`: `#fecdd3`
  - **Independent (Teal / Cyan):**
    - `Solid IND`: `#0f766e` · `Likely IND`: `#14b8a6` · `Lean IND`: `#2dd4bf` · `Tilt IND`: `#99f6e4`
  - **Custom Parties:**
    - Procedurally generate 4 tiers from the party's primary theme hex.
- Update `ratingColor(rating)` and `ratingClass(rating)` in `app.js` to recognize and color these third-party rating tiers.

#### 2. Strict Legend Omission Protocol
- In `renderSvgMap()` (`app.js` lines ~4330–4365), maintain the forecast map legends (`.v08-gradient-legend`, `.map-legend`, `.v08-gradient-continuous-bar`) showing **only the standard Democratic $\leftrightarrow$ Republican continuum**.
- Third-party color swatches and labels are **strictly omitted** from the legend key.

---

### Subsystem D: Voter Faction Realignment via 1/4th Shift Rule (`REQ-175`)

#### 1. Realignment Faction Transfer Synchronization (`engine.js`)
- In `realignVotingBlocksBetweenElections(game, outcome)`:
  - Whenever voters shift between parties in a state via the 1/4th Shift Rule:
    - Deduct shifting voters proportionally from the departing party's factions in that state (`state.factions`).
    - Add shifting voters to ideologically closest recipient factions in the new party in that state (`state.factions`):
      - **Green $\leftrightarrow$ Democrat Transfers:** Source/allocate via *Progressive Activists* and *New Deal Labor Coalition*.
      - **Libertarian $\leftrightarrow$ Republican Transfers:** Source/allocate via *Liberty Caucus & Free Marketeers*.
      - **Democrat $\leftrightarrow$ Republican Swing:** Source/allocate via *Suburban Moderates* and *Main Street Conservatives*.
  - **National Reconciliation:**
    - Recalculate national faction totals (`voterModel.factions`) by aggregating across all states, guaranteeing 100% mathematical consistency with party registration rolls.

---

## 3. Verification & Validation Plan

1. **Voter Persistence Check:**
   - Execute volunteer drives and outreach in Cycle 2028; advance to Cycle 2030; confirm state and national voter totals reflect cumulative growth rather than resetting to 155M.
2. **Forecaster Multi-Party & Polling Check:**
   - Run a campaign as a third party; verify third-party leads show valid ratings (`Tilt LIB`, `Lean GRN`, etc.) instead of defaulting to Toss-Up yellow.
   - Commission an internal poll; verify the race margin shifts reactively in the pundit cards and consensus table.
   - Execute a turn action; verify forecaster predictions refresh immediately.
3. **Map Color & Legend Check:**
   - Confirm third-party leading states render in proper color gradients on forecast maps.
   - Confirm map legends remain cleanly formatted with the 2-party continuum and no third-party clutter.
4. **Faction Voter Synchronization Check:**
   - Verify that after inter-cycle realignment, faction voter counts in `state.factions` and `voterModel.factions` reflect inter-party voter shifts.
5. **Build Compilation:**
   - Run `node build.js` to confirm the Windows executable packages cleanly with exit code 0.
