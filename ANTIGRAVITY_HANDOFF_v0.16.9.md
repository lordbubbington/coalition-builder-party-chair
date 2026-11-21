# Coalition Builder: Party Chair — Engineering Handoff (`v0.16.6` → `v0.16.9`)

**Purpose:** Complete changelog, architecture reference, state schema additions, and design guardrails for resuming development in Antigravity from **version `0.16.9`**.

---

## 1. Release Summary & Verification Status

- **Current Version:** `0.16.9` (stamped in `engine.js`, `app.js`, `package.json`, `build.js`, `index.html`, `BUILD_EXE.bat`).
- **Automated Verification Suites (229/229 Passing, 0 Failures):**
  - `scripts/test-v0169-fixes.cjs` — 16/16 PASS
  - `scripts/test-presidential-primaries.cjs` — 21/21 PASS
  - `scripts/test-statewide-offices.cjs` — 32/32 PASS
  - `scripts/test-v0165-bicameral-haven.cjs` — 41/41 PASS
  - `scripts/test-v0162-integration.cjs` — 119/119 PASS
- **Windows Executable Launcher Fix (MUST PRESERVE):**
  - `BUILD_EXE.bat` and `build.ps1` **must retain strict Windows `CRLF` (`\r\n`, 0 LF-only lines)** so double-clicking `BUILD_EXE.bat` on Windows compiles and launches `dist\Coalition Builder - Party Chair.exe` cleanly.
  - `BUILD_EXE.bat` includes `Unblock-File`, `goto :failed` error handling, and `build.ps1` wraps compilation in `try/catch` with red error output.

---

## 2. Chronological Changelog (`v0.16.6.1` → `v0.16.9`)

### Version `0.16.6.1` — State Legislative Slates & Statewide Executive Endorsements
- **State Legislative Slate Stepper Fix (`app.js`, `engine.js`):** Fixed broken tier-increment buttons by wiring `[data-slate-step]` and `[data-slate-filter]` listeners to `set-state-legislative-slate-tier` using `organizingActionsRemaining`.
- **Other Statewide Offices Endorsements Tab (`app.js`, `engine.js`):** Added an **Other Statewide Offices** tab on the Step 3 Endorsements page with per-state tabs (matching Senate/Governor tabs) where players choose which statewide executive race to endorse.
- **1/5th Statewide Happiness Weight (`engine.js`):** Scaled faction happiness and related endorsement impacts for non-governor statewide executive races to **1/5th** of gubernatorial races (`+0.2` / `-0.6` instead of `+1` / `-3`).
- **Step 4 Copy Update (`app.js`):** Updated the Step 4 State Legislative slate explainer text verbatim to:
  > *"Here, you can contest the state legislative races. Major parties automatically contest every race, while smaller parties need to get candidates to sign up in bunches. Winning seats gives you a better starting point in future years, regardless of party tier"*

### Version `0.16.6.2` — Full 223-Seat Statewide Roster, Extremist Tag & 3rd-Party Trust Caps
- **Complete 223 Partisan Statewide Executive Offices (`data.js`, `scenario-2028.js`, `engine.js`):** Populated all **223** partisan at-large statewide executive offices across **44 states** (excluding set-aside states AK, HI, ME, NH, NJ, TN) with real 2028 incumbents, parties, canonical faction IDs, and 10-stat ratings, bringing total `sittingMembers` to **808** (`100` Senate, `435` House, `50` Governor, `223` Statewide Executive).
- **State Legislative Panel UI Cleanup (`app.js`):**
  - Removed Coattail Lift from the State Legislature slate panel UI (in-game coattail mechanic preserved).
  - Removed the per-chamber `"+x.xx% Statewide Polling · +x Registered Voters"` text from each individual state legislature card.
  - Reduced state legislative slate tier increment cost from 2 actions to **1 action**.
- **Extremist Faction Tag (`factions-0.15.js`, `app.js`, `engine.js`):** Replaced the prose *"They should never be a member of a party with more than 5 million members of other factions"* with a visible **`extremist`** badge/tag and corresponding party-membership constraint on the 6 extremist factions (`lib_ancaps`, `con_christian_dominionists`, `soc_socialists`, `soc_communists`, `unaff_the_klan`, `unaff_groypers`).
- **Primary Support Filter Cleanup (`app.js`):** Removed `(Minor/Ballot Access)` endorsement filter options.
- **3rd-Party Trust Cap (`engine.js`):** Added `getThirdPartyTrustCap()`, `applyThirdPartyTrustCap()`, and `enforceGameTrustCaps()` capping Independent and Opponent trust at `10 × partyTier` for 3rd parties (Major parties uncapped; Tier 0 capped at `0`).

### Version `0.16.7` — Local 5-Slot Save System & QA Stabilization
- **Local 5-Slot IndexedDB Save System (`engine.js`, `app.js`):** Replaced borrowed import/export save UI with a local **5-slot save manager** backed by IndexedDB (`CoalitionBuilderSavesDB` / `saveSlots` store) alongside `SAVE_KEY = 'partyChairGame.save.v16.2'` and `compactGameForSave()`.
- **Core Bug Fixes (`engine.js`, `app.js`):** Resolved QA issues #1, #2, #4, #6, #7, and #8 from the v0.16.6.2 audit (including state chapter/endorsement edge cases, UI state sync, and validation fixes).

### Version `0.16.7.2` — Dynamic Candidate Spawner, Tier Drop-Downs & Era #15→#16 Gating
- **Dynamic Politician Spawner (`engine.js`, `v07-scaffolding.js`):** Added `generateFreshPoliticianForSeat()` and `replenishVacantSittingMembers()` to dynamically generate new candidates with randomized stats/traits for lower-level races (House and non-governor statewide executive primaries) and replenish vacated seats at cycle start.
- **Save Capacity Upgrade (`engine.js`):** Raised save payload budget via IndexedDB + `compactGameForSave()` (eliminating the 5 MB `localStorage` ceiling).
- **Clean IF-Check Party Tier Re-Evaluation & Drop-Downs (`engine.js`):** Rewrote `evaluatePartyInstitutionalTiers()` as clean cycle-start `IF` evaluations so parties can **drop down tiers** (losing tier-gated perks like focus slots when they fall below requirements). State legislative wins count for **1 cycle only** (`stateLegWonLastCycle`); Senate seats count for the duration held.
- **Re-Election Bonus Removal (`engine.js`):** Removed the automatic `+3` fame and `+0.1` quality bonus for winning re-election.
- **Statewide Candidate Quality Weight (`election-night-engine.js`, `engine.js`):** Increased candidate quality impact in statewide executive races by **4×** (`3.2` weight).
- **Era #15 → Era #16 Prerequisite (`party-systems-engine.js`):** Enforced that `era_16_robots_citizens` cannot trigger unless `era_15_ai_boom` has already occurred.
- **Strategic Priority Evaluators & Legislative Bill Failure Feedback (`engine.js`, `app.js`):** Added missing evaluators matching stated quest goals, added explicit player feedback explaining why failed bills did not pass, and scrubbed excess/redundant UI elements.

### Version `0.16.8` — Full Presidential Primary System & Faction Happiness Equilibrium
- **Faction Happiness Equilibrium (Options A, B, and C in `engine.js`):**
  - **Option A:** Flip-only statewide happiness swings capped at **`±20`** per cycle.
  - **Option B:** `rebalanceFactionHappinessTowardEquilibrium()` pulls all factions **25%** toward ideological/macro equilibrium at the start of every cycle.
  - **Option C:** `applyScaledFactionHappinessDelta()` applies diminishing returns `(100 - cur) / 50` above 75 and `cur / 50` below 25 (preventing factions from pinning at 0 or 100 over 15+ cycles).
- **Presidential Primary Master Data (`data.js`):**
  - Added `DNC_MASTER_DELEGATES_2028` (51 jurisdictions + `TERR`) and `RNC_MASTER_DELEGATES_2028` (51 jurisdictions + `TERR`).
  - Added `DEFAULT_PRIMARY_SCHEDULES` (DNC early window, RNC Rule 16, Super Tuesday, post-Super Tuesday spring, and third-party conventions) and `DELEGATE_ALLOCATION_RULES` (`dnc_prop_15`, `gop_wta`, `gop_triggered_wtm`, `pure_proportional`, `loophole_direct`, `convention_caucus`).
- **Presidential Primary Core Engine (`engine.js`, `v07-scaffolding.js`):**
  - Introduced `phase: 'presidential-primary'` between `organizing` and `campaign` in presidential years (`year % 4 === 0`, starting 2028).
  - Implemented `generatePrimaryField()` & `pickPrimaryCandidateForFaction()` (1 candidate per faction, 50%/30%/20% fame-weighted top-3 pick, dynamic `office: null` spawner at 50% baseline for unrepresented factions registered via `registerDynamicFactionPolitician()`, unique high-contrast candidate colors).
  - Implemented Primary Order customization (`reorderPrimaryState()` with `±1..3` standing/trust shifts persisted in `game.primaryOrder[partyId]`), 5 Debate Days (`+5%` national lift on filtering, `-3` Base Trust, top-5 rival faction trust penalty), exact 100%-sum uneven partition randomization (`applyRandomizationPartition()`), delegate allocation, dropout evaluation (`evaluatePrimaryDropouts()`), neutrality reward (`+5%` happiness to all party factions if 0 interventions), `-2` confidence penalty for losing major factions, and multi-year archiving in `game.simulatedPrimaries[year]`.
  - Fixed `version01Hash` normalization (`(Math.abs(version01Hash(...)) % 100000) / 100000`) in all primary RNG lambdas.
- **Presidential Primary Interactive UI (`app.js`):**
  - Built full interactive primary view: Primary Order editor, Debate Day action bar, Filter Support controls, delegate progress bar with clinch marker, interactive SVG Primary Map, state-by-state results table, and **Primary Archive** modal.

### Version `0.16.8.1` — Primary Polish, Delegate Reconciliation & Peace and Freedom Rename
- **Critical Routing & Filtering Fixes (`app.js`, `engine.js`):**
  - Routed `start-campaign` inside `dispatchAction()` (`app.js`) into `start-presidential-primary` in presidential years when the primary has not run yet.
  - Wired all 5 primary actions (`start-presidential-primary`, `reorder-primary-state`, `advance-primary-day`, `filter-primary-support`, `finish-presidential-primary`) inside `takeActionInternal()` (`engine.js`).
  - Fixed `finish-presidential-primary` to enter `phase: 'campaign'` with `primariesResolved = true` and `prioritiesLocked = true`.
  - Filtered `pickPrimaryCandidateForFaction()` by both `factionId` and `party`/`partyId` so minor parties never draft wrong-party nominees.
- **High-Impact Fixes (`engine.js`, `app.js`):**
  - Retired legacy v0.16.1 Cluster A `presidentialPrimaries` initialization and removed `presidentialPrimaryGauntletMarkup(game)` from Step 3.
  - Added dynamic `computePrimaryClinchTarget()` (`Math.floor(totalScheduledDelegates / 2) + 1`).
- **Medium & Low Fixes (`data.js`, `engine.js`, `app.js`):**
  - **1-Faction Challenger Rule:** Kept the behavior where a 1-faction party (e.g., Constitution Party or 1-faction Custom-100K) spawns a 2nd rival challenger from that same faction (the only case where a faction has 2 presidential candidates).
  - Wired `applyScaledFactionHappinessDelta()` into remaining raw `factionHappiness` writes in `engine.js`.
  - Reconciled `DNC_MASTER_DELEGATES_2028` pledged sum to exact **`3,934`** (`1,968` clinch) and `RNC_MASTER_DELEGATES_2028` total sum to exact **`2,429`** (`1,215` clinch).
  - Implemented the 15% Top-2 fragmentation split branch in `evaluatePrimaryDropouts()`.
  - Added `DC` and `Territories / Abroad` (`TERR`) winner inset badges below the SVG Primary Map (`app.js`).
  - Pruned empty date buckets in `reorderPrimaryState()` and skipped empty days in `advancePrimaryCalendar()`.
  - Added a Year Selector pill bar (`2028`, `2032`, ...) to the Primary Archive modal (`app.js`).
- **Party Rename (`data.js`, `engine.js`, `app.js`, `party-systems-engine.js`):** Renamed `"Socialist Party"` to **`"Peace and Freedom Party"`** across all player-facing strings (internal ID `'socialist'` preserved for save/voter-model compatibility).

### Version `0.16.9` — Final Pre-Handoff Fixes (Current Build)
- **AI Simulated Primary Winners Synced to General Election (`engine.js`):** `startPresidentialPrimary()` now writes every simulated rival party's `nomineeName` into `game.presidentialTicket`, and `predictPresidential()` / `holdElectionInternal()` propagate all parties' primary winners onto `lastElection.presidential.ticket` and `lastElection.partyNominees` (replacing hardcoded `"J. D. Vance"` / generic minor-party slates).
- **Former President & 2-Term Tracking (`engine.js`):** `holdElectionInternal()` now tracks `game.currentPresident`, `game.presidentialTerms[name]`, and `game.pastPresidents`, and stamps `isFormerPresident: true` on matching `politicians` and `sittingMembers` when a president leaves office or wins a 2nd term. `generatePrimaryField()` excludes all `pastPresidents`, `isFormerPresident`, and 2-term winners.
- **3rd-Party Trust Cap Re-Clamping on Tier Drop-Down (`engine.js`):** Updated `getThirdPartyTrustCap()` to honor updated persisted `game.partyTiers[resolvedId]` immediately and added `enforceGameTrustCaps(finalElectionState)` right after post-election tier re-evaluation so dropping from Tier 1 → Tier 0 immediately clamps Independent and Opponent trust to `0`.
- **Era #16 (Robots) & Era #18 (Coalition/MMP) Cross-System Fixes (`engine.js`):**
  - Verified Era #16 synthetic robot voters maintain their 8 dedicated `robot_*` factions (`2` per Robot party).
  - Updated `generatePrimaryField()` to merge `game.factions` and `ROBOT_PARTY_BY_ID[resolvedParty].factions` with the base catalog so switching to a Robot party in Era #16 spawns its own 2 robot-faction primary candidates instead of falling back to the 8 Democratic factions.
  - Updated `holdElectionInternal()` to run `calculateDistrictElection(game, game.year)` / `resolveNationwideMMP()` when `coalitionSystem.mmpActive` is true, attaching `outcome.mmp` / `outcome.mmpSummary` and triggering `buildCoalitionBargainingState()` on presidential elections.
  - Updated `startPresidentialPrimary()` to scale `schedule` and `clinchTarget` for Era #18 post-breakup coalition parties instead of inheriting DNC's 1,968 delegate target.
- **Minor-Party Politician Roster Cleanup (`data.js`, `scenario-2028.js`, `presidential-primaries.js`, `app.js`):**
  - Moved **Butch Ware** from `liberty` → `green` (`grn_eco_socialist_vanguard`).
  - Added **Spike Cohen** to `liberty` (`lib_true_libertarians`).
  - Moved **Kshama Sawant** from `green` → `socialist` (`soc_socialists`, Peace and Freedom Party).
  - Moved **Ajamu Baraka** from `grn_yimby` → `grn_eco_socialist_vanguard`.
  - Replaced **Brian Carroll** in `socialist` with **Gloria La Riva** (`lariva-soc`, `soc_socialists`).
- **Politician & Sitting Member Aging & Retirement (`engine.js`):**
  - Added `computeDeterministicStartAge()` and `ensureAndAdvancePoliticianAges(game, deltaYears)` called in `createGame()` (seeding realistic starting ages on all 808 `sittingMembers` and 828 `politicians`) and in `startNextCycleInternal()` (`+2` years/cycle).
  - Politicians aged `78–83` roll for retirement (45%/cycle) and mandatorily retire at `84+`. Retired sitting members vacate their seats and are replaced by `replenishVacantSittingMembers()`; retired politicians are excluded from `generatePrimaryField()`.
- **Bounded Save Compaction (`engine.js`):** Extended `compactGameForSave()` to compact `simulatedPrimaries` older than 2 presidential cycles (retaining nominee, candidate totals, and per-state winner/color for the Archive UI & map while stripping verbose per-state vote/delegate breakdowns), cap `statewideOfficesHistory` to the most recent 6 cycles, and clear completed `activePresidentialPrimary` outside the primary phase.
- **Stale Primary State Cleanup (`engine.js`):** `finish-presidential-primary` now clears `activePresidentialPrimary: null` once archived and transitioned into `'campaign'`.
- **Peace & Freedom Description Scrub (`engine.js:108`):** Reworded the Peace and Freedom Party description to remove the leftover `"socialist party"` phrasing.

---

## 3. User-Confirmed Intended Mechanics (DO NOT "FIX" OR CHANGE)

The user explicitly confirmed the following behaviors are **intended** and should **not** be altered or re-flagged in future QA:

1. **Midterm Voter Model Drift (`holdMidterm` → `realignVotingBlocksBetweenElections`):** Intentionally allows represented voter totals to shift over midterms. **Do not clamp or normalize this.**
2. **Era-Spawned Party Voter Drift (Era #2 Moderate Party, Era #10 Regional Parties, Era #17 Ecological Collapse, Era #16 Robots):** Intentionally allowed as long as Era #16's synthetic voters have their own dedicated factions (verified: 8 robot factions). **Do not alter.**
3. **Custom-100K (`Not a Major Movement`) Tier 0 `0` Trust Cap:** Intended that Independent/Opponent trust is capped at `0` at Tier 0.
4. **Statewide Executive Offices Omitted from Phase 3 Candidate Triage UI:** Intended; candidate quality weight is intentionally `4×` (`3.2`).
5. **1-Faction Party Spawning 2 Same-Faction Presidential Candidates:** Intended as the sole case where a single faction fields 2 presidential primary candidates.
6. **Legacy `presidential-primaries.js` `advancePrimaryWave` Stub:** User plans to work on any separate delegate changes manually; leave untouched.
7. **Continuous Numbering Preference:** When presenting numbered QA or change lists to the user, never restart numbering at `1` in new sections.

---

## 4. Key Files Modified Across `v0.16.6.1` → `v0.16.9`

| File | Primary Changes |
|---|---|
| `engine.js` | Presidential Primary engine (`startPresidentialPrimary`, `generatePrimaryField`, `pickPrimaryCandidateForFaction`, `reorderPrimaryState`, `advancePrimaryCalendar`, `filterPrimarySupport`, `evaluatePrimaryDropouts`, `computePrimaryClinchTarget`), Options A/B/C happiness equilibrium (`applyScaledFactionHappinessDelta`, `rebalanceFactionHappinessTowardEquilibrium`), `generateFreshPoliticianForSeat` & `replenishVacantSittingMembers`, `ensureAndAdvancePoliticianAges`, `getThirdPartyTrustCap` / `enforceGameTrustCaps`, 5-slot IndexedDB save system & enhanced `compactGameForSave`, AI primary→general ticket sync, `pastPresidents`/`presidentialTerms` tracking, Era #16/#18 primary & MMP hooks. |
| `app.js` | Presidential Primary full UI & SVG map (with DC/TERR badges and Primary Archive Year Selector), Other Statewide Offices Endorsements tab, State Leg slate stepper fix & UI cleanup, Extremist faction badge, 5-slot local save modal, `POLITICIAN_TRAITS_MAP` updates (`Gloria La Riva`, `Spike Cohen`), Peace & Freedom Party display strings. |
| `data.js` | `DNC_MASTER_DELEGATES_2028` (3,934 pledged), `RNC_MASTER_DELEGATES_2028` (2,429 total), `DEFAULT_PRIMARY_SCHEDULES`, `DELEGATE_ALLOCATION_RULES`, 223-seat `STATEWIDE_OFFICES_REGISTRY`, Peace & Freedom Party rename, minor-party roster cleanup (Butch Ware, Spike Cohen, Kshama Sawant, Ajamu Baraka, Gloria La Riva). |
| `v07-scaffolding.js` | Dynamic `office: null` politician registration (`registerDynamicFactionPolitician`), faction leader eligibility. |
| `scenario-2028.js` | 223 statewide incumbents + updated minor-party faction mappings. |
| `factions-0.15.js` | `extremist: true` tag on 6 extremist factions; removed inline 5M restriction prose. |
| `election-night-engine.js` | 223 statewide office resolution, 0.35× gubernatorial coattail dampening, 4× candidate quality weight. |
| `party-systems-engine.js` | Era #15 → Era #16 prerequisite check; Peace & Freedom Party display string sync. |
| `presidential-primaries.js` | Updated minor-party fallback candidate names (`Gloria La Riva`, `Butch Ware`, `Kshama Sawant`). |
| `BUILD_EXE.bat` & `build.ps1` | Windows `CRLF` launcher fix (`Unblock-File`, `goto :failed`, `try/catch` error reporting, version `0.16.9`). |
| `scripts/test-v0169-fixes.cjs` | New 16-check verification suite covering all v0.16.9 fixes. |
| `scripts/test-presidential-primaries.cjs` | 21-check Presidential Primary & Happiness Equilibrium verification suite. |
