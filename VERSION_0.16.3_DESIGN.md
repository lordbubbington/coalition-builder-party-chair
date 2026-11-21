This document is reference-only. Coding AIs must not act on anything in this document unless explicitly tasked through the owner's handoff prompt. If you have questions about any requirement, route them to the Design Agent chat and reference this document as the authority.

Coalition Builder: Party Chair — Version 0.16.3 Design Document (Bug-Fix Release)

1. Release Header

Version: 0.16.3 (third-digit bump from 0.16.2)

Release type: Bug-fix / stabilization release. This version contains no new features. Every requirement is a FIX that corrects defects introduced or surfaced in the 0.16.x line.

Workflow: Each fix was diagnosed by the owner with a separate QA agent; the root cause and fix direction come from that diagnosis. The Design Agent converts them into requirements. This document accumulates fixes one by one as the owner reports them.

Scope: this single document contains ALL requirements reported since v0.16.2 shipped: REQ-245 through REQ-265 (21 requirements: 3 Medium, 11 Small, 7 Tiny). The v0.16.2 Gameplay Balance & UX Review batch (REQ-247 – REQ-256) is included as Sections 5–14 at the owner's direction; no separate backlog document governs them.

Version bump & SAVE_KEY: Owned exclusively by the Release Integrator. No schema changes are intended in this release; the existing save key is expected to remain unchanged unless the Release Integrator decides an individual fix requires migration (each FIX section flags save-compatibility notes where relevant).

Status: PACKAGED — Nov 18, 2026 (owner build command). Single-release packaging of all 21 requirements; no Huge or Large pending, so per protocol the third digit bumps: 0.16.2 → 0.16.3. Handoff prompts are in Section 26.

2. Fix Inventory (Grouped by SIZE)

Massive

(none)

Huge

(none)

Large

(none)

Medium

REQ-247 — Fatal Custom Party Cycle Transition Engine Fix (startNextCycle)

REQ-248 — 100K Founding Faction Voter Model Injection & Sample Unit Scaling

REQ-249 — Largest-Remainder Apportionment & Integer Sample Unit Conservation

Small

REQ-245 — Fix Faction Population Display and Voter Transfer in Custom Party Creator

REQ-250 — Draft-of-7 Redraw Pool Check & Hard Ceiling Cap (20-Action Pool)

REQ-251 — 100K State Allocation Validation Modal & Silent Reset Prevention

REQ-252 — Statehouse Standout Persistent ID & Milestone Continuity

REQ-253 — Responsive Drawers & 50-State Scroll Trap Resolution

REQ-258 — Strict Ballot Access Zero-Polling Invariant Across All Races

REQ-259 — 2028 Starting Baseline 3.0% Polling Ceiling for Non-Major Parties

REQ-260 — Socialist Vermont Peak & Regional Geographic Calibration

REQ-261 — House Downballot National Environment Calibration (D+9 Generic Ballot & District Baseline)

REQ-262 — Senate Downballot National Environment Calibration (D+9 State Partisan Lean Baseline & Race Resolution)

REQ-264 — 3rd Party State Chapter Footprint Rebalance

Tiny

REQ-246 — Custom Party Deselection & Setup Choice Persistence

REQ-254 — Semantic CSS Variable Binding for v0.16.2 Elements

REQ-255 — Targetable Opponent Stronghold Dropdown Qualification Indicator

REQ-256 — Succession Crisis Atmospheric Text & Trait Interpolation

REQ-257 — 2026 Midterm Baseline Popular Vote Calibration

REQ-263 — Fix "Take the Chair" Mismatched Custom Party Input Selectors

REQ-265 — Custom Party Zero-Infrastructure Starting Rule

3. REQ-245 — Fix Faction Population Display and Voter Transfer in Custom Party Creator

Size: SmallType: Bug fix (defect correction, no new player-facing feature intent)Source: Owner + QA agent diagnosis, Nov 18, 2026

3.1 Symptoms

In the Custom Party Creator, the faction picker reads a property that does not exist on the faction catalog objects, so the faction population figures shown while building a custom party are wrong (and silently fall back to a hardcoded value).

The individual faction cards show only Econ/Soc placements; the voter population backing each faction is not visible to the player at selection time.

Voters transferred into a custom party are never written into the player's national affiliation record at game creation, and the election-cycle voting-block realignment subsequently wipes the custom party's voter block. Custom party voter totals effectively vanish between elections.

3.2 Root Cause

app.js customPartyCreatorMarkup reads f.representedVoters, which is not a property on FACTIONS_CATALOG entries; the population lives in f.targetVoters (with FACTION_NATIONAL_TOTALS as the authoritative national figure). A hardcoded fallback masks the miss.

engine.js createGame never initializes game.voterModel.affiliations.player with the transferred voters.

engine.js realignVotingBlocksBetweenElections does not recompute the player affiliation, so realignment rebuilds every voting block except the custom party's.

3.3 Affected Files

app.js — lines 1518–1585 (customPartyCreatorMarkup); picker property at line 1521; faction card rendering at lines 1578–1581.

engine.js — lines 4050–4075 (createGame); lines 7125–7160 (realignVotingBlocksBetweenElections, with the realignment block at 7126–7146).

factions-0.15.js — read-only reference: FACTIONS_CATALOG, FACTION_NATIONAL_TOTALS.

3.4 Fix Specification

Part 1 — app.js: Faction Picker Property Bug

At the faction picker (app.js line 1521), replace the read of f.representedVoters with:

 (f.targetVoters || window.PartyChairData?.FACTION_NATIONAL_TOTALS?.[f.id] || 0)

Remove the hardcoded fallback branch (else totalVotersChosen += 1200000). No silent 1.2M padding: if a faction's population cannot be resolved, it contributes 0 and the defect is visible, not masked.

On each individual faction card (app.js lines 1578–1581), display the actual population alongside the Econ/Soc readouts, in the form:

 · ${(fVoters / 1000000).toFixed(2)}M Voters

 where fVoters resolves through the same expression as (1) above, so card display and picker totals always agree.

Player-facing copy note: the X.XXM Voters figure must always resolve to the represented-voter scale (155,000,000 total US voters). It must never expose the internal sample-voter abstraction. No percentages or formula names in the display — population count only, styled consistently with existing faction card copy.

Part 2 — engine.js: National Affiliation & Realignment Sync

In createGame, immediately after line 4075, initialize the player's national affiliation with the transferred voters:

 game.voterModel.affiliations.player = {
   name: player.name,
   sampleVoters: Math.round(totalVotersTransferred / 100),
   representedVoters: totalVotersTransferred,
 };

 sampleVoters and representedVoters must stay in their fixed 100:1 relationship, consistent with the rest of the voter model.

In realignVotingBlocksBetweenElections (engine.js lines 7126–7146), add:

 const sumPlayer = sumF('player');
 stAff.player = Math.round(sumPlayer / 100);

 so realignment recomputes and preserves the custom party's voter block on every between-elections cycle, exactly as it does for the other national affiliations.

3.5 Save-Compatibility Notes

New games: affiliations.player is written at creation; no further action needed.

Existing saves launched under 0.16.2 (custom party already in play): game.voterModel.affiliations.player may be missing. Recommended defensive load-time backfill in the save-load path: if a custom party is active and affiliations.player is absent, initialize it from the party's recorded represented-voter total (same shape as 3.4 Part 2, item 1). This is a correctness backfill, not a schema migration; the Release Integrator decides whether it lands in this build or a follow-up, and owns any SAVE_KEY decision (none expected for REQ-245).

3.6 Acceptance Criteria

Custom Party Creator picker totals equal the sum of the per-card population figures shown, with no silent padding; if a faction's population cannot resolve, the UI contributes 0 rather than 1.2M.

Each faction card displays its population alongside Econ/Soc, at the represented-voter scale.

A newly created custom party game has game.voterModel.affiliations.player.representedVoters equal to the voters transferred at creation.

Running realignVotingBlocksBetweenElections preserves the player's affiliation block (non-zero before and after realignment; values recomputed, not zeroed).

No regression in standard (non-custom) party creation or realignment paths.

3.7 Test Plan

New script: scripts/test-v0163-faction-transfer.cjs (follows the project's .cjs test convention alongside test-v0162-*.cjs scripts).

Picker arithmetic: build the creator markup against the faction catalog; assert the chosen-total uses targetVoters/FACTION_NATIONAL_TOTALS, and that no 1.2M constant appears anywhere in the picker path.

Card display: assert each faction card string contains the X.XXM Voters segment computed from the same source as the total.

Creation sync: run createGame with a custom party and transferred voters; assert affiliations.player.sampleVoters and representedVoters exist with the 100:1 relationship.

Realignment preservation: call realignVotingBlocksBetweenElections twice; assert affiliations.player remains present and non-zero across cycles.

Load backfill: simulate a 0.16.2 save without affiliations.player; assert the defensive backfill populates it.Rebuild check: powershell -ExecutionPolicy Bypass -File .\build.ps1 after all edits.

4. REQ-246 — Custom Party Deselection & Setup Choice Persistence

Size: TinyType: Bug fix (setup-screen UX defect, no new feature intent)Target files: app.js onlyDependencies / related: REQ-235 (Custom Party Creator, v0.16.2); QA agent's BUG-08Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: reported under the QA agent's label (REQ-245/BUG-08); renumbered by the Design Agent because REQ-245 was already allocated to the faction population/voter-transfer fix in Section 3.

4.1 Symptom

On the 2028 Setup Screen, once a player opens the Custom Party Creator, they are effectively trapped in custom mode: clicking any of the 6 preset party archetypes does not cleanly switch back. Additionally, any customized party settings (issue positions, name, color, motto) are wiped when the player navigates between preset parties, so work done in the creator is lost during normal setup exploration.

4.2 Root Cause

The [data-template] click handler never explicitly clears custom mode (custom = false), so isCustomMode can continue to evaluate true and the Custom Party Creator panel (customPartyCreatorMarkup()) stays active.

The same handler prematurely nulls customIssuePositions, destroying the player's customized positions on every preset-party click.

Name/color/motto inputs have no change listeners bound in bind(), so those choices are never synced into state and vanish on re-render.

4.3 Fix Specification

Part 1 — Mode Toggling ([data-template] Handler)

When any of the 6 preset party archetype buttons ([data-template]) is clicked, explicitly set custom = false. Setting custom = false guarantees isCustomMode evaluates to false, which:

hides the Custom Party Creator panel (customPartyCreatorMarkup()),

applies the .selected border/styling to the clicked preset party, and

un-highlights the CREATE CUSTOM PARTY button.

Part 2 — Choice Persistence During Setup

Remove the premature customIssuePositions = null; wipe from the [data-template] click listener, so customized issue positions survive navigating back and forth between preset parties.

Add input change listeners in bind() for #custom-party-name, #custom-party-color, and #custom-party-color-hex so name, color, and motto choices sync immediately to their state variables (customPartyName, customPartyColor, customPartyMotto, etc.) and are not lost when toggling between parties.

Part 3 — Reset on Game Start

Preserve all custom party configuration in memory across party switches during the entire pre-game setup phase.

Only reset custom creator state variables to their default values when #start-game is clicked and a new game session actually launches.

4.4 Save-Compatibility Notes

None. This is pre-game setup UI only; no save data exists before #start-game and no schema fields are touched.

4.5 Acceptance Criteria

Opening the Custom Party Creator and then clicking any preset archetype exits custom mode: creator panel hides, the preset gets .selected styling, and the CREATE CUSTOM PARTY button un-highlights.

After customizing issue positions, name, color, and motto, toggling to a preset party and back to the creator restores all of those choices intact.

State variables (customPartyName, customPartyColor, customPartyMotto, customIssuePositions) persist across any number of preset↔custom switches during setup.

No custom creator state mutation occurs from party switching alone; defaults are restored only after #start-game launches a new session.

No regression: starting a game with a preset archetype remains unaffected.

4.6 Test Plan

New script: scripts/test-v0163-setup-persistence.cjs (or a merged test-v0163-setup.cjs if the Release Integrator prefers one script per file-touch area).

Mode exit: simulate a [data-template] click while custom = true; assert custom === false and the creator panel is hidden in the rendered markup.

Position persistence: set customIssuePositions, toggle through preset parties, return to custom mode; assert positions are unchanged (no null wipe).

Input sync: fire change events on #custom-party-name, #custom-party-color, #custom-party-color-hex; assert state variables match the input values after re-render.

Reset boundary: assert no state variable resets occur on preset clicks; assert full reset to defaults only on #start-game.

5. REQ-247 — Fatal Custom Party Cycle Transition Engine Fix (startNextCycle)

Size: MediumType: Bug fix (fatal engine crash)Target file: engine.js (line 10405, line 10544, checkFounderSuccessionTrigger, processOrphanedFactionRehoming)Dependencies / related: REQ-238 (orphaned faction rehoming), REQ-242 (founder succession crisis). The lifecycle invariant below applies to the custom party only.Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-01 by the QA agent; moved into this version document at the owner's direction.

5.1 Symptom & Root Cause

When a custom party finishes Cycle 1, the game crashes with TypeError: Assignment to constant variable. At engine.js line 10405, refreshed is declared const; line 10544 then executes refreshed = checkFounderSuccessionTrigger(refreshed);, attempting reassignment to a constant. Compounding it, checkFounderSuccessionTrigger returns a boolean, so even a successful reassignment would replace the entire game state object with true/false.

5.2 Fix Specification

Declare let refreshed at line 10405.

Invoke checkFounderSuccessionTrigger(refreshed); in place as a mutator, with no reassignment of refreshed.

Ensure processOrphanedFactionRehoming(refreshed) returns a clean, updated game state.

Invariant: a custom party must smoothly cycle 2028 → 2030 → 2032 → 2034 without state corruption or crashes.

5.3 Save-Compatibility Notes

None. Crash repair and mutator conversion only; no schema change, no SAVE_KEY action.

5.4 Acceptance Criteria

A custom party completing Cycle 1 transitions to the next cycle without a TypeError.

refreshed remains the game state object through the entire transition; no boolean overwrite.

The succession trigger's effects persist via in-place mutation.

The full 2028 → 2030 → 2032 → 2034 chain completes with no state corruption.

5.5 Test Plan

New script: scripts/test-v0163-cycle-transition.cjs:

Complete Cycle 1 for a custom party; assert no exception and a valid game state object at every step.

Assert checkFounderSuccessionTrigger is invoked as a mutator (no assignment site remains).

Assert processOrphanedFactionRehoming returns a clean updated state.

Drive the full 2028 → 2034 cycle chain; assert continuity of party, affiliations, and candidate records.

6. REQ-248 — 100K Founding Faction Voter Model Injection & Sample Unit Scaling

Size: MediumType: Bug fix (electorate model injection)Target file: engine.js (line 3958, custom party creation injection paths)Dependencies / related: REQ-240 (100K Founding Faction Builder), REQ-249, REQ-251, REQ-245Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-02; moved into this version document at the owner's direction.

6.1 Symptom & Root Cause

At engine.js line 3958, state allocation reads stateAllocs[st.id], but the key in voterModel.states is st.stateId. Because st.id is undefined, alloc evaluates to 0 for every state, so custom founding factions are never injected into the voter model. Separately, alloc is in represented voters (100,000 scale) while st.affiliations holds sample voter units (1 unit = 100 real voters): adding raw represented voters to st.affiliations would corrupt the national voter model.

6.2 Fix Specification

Fix the state lookup: const alloc = Number(stateAllocs[st.stateId || st.id] || 0);

Scale represented voters to sample units: const allocSample = Math.round(alloc / 100);

Add allocSample to st.affiliations.player and deduct allocSample from st.affiliations.independent.

Inject raw represented voters (alloc) into st.factions.custom_founding_faction and deduct alloc proportionally from swing factions in st.factions.

Invariant: zero-variance conservation of the 155,000,000 represented voter scale (1,550,000 sample units) across all 51 jurisdictions. The internal sample abstraction is never player-facing.

6.3 Save-Compatibility Notes

Existing 0.16.2 custom-party saves created before this fix lack the injection. Best-effort load-time backfill from the party's recorded totals (same code path as REQ-245's affiliations.player backfill); the Release Integrator decides inclusion. No schema change, no SAVE_KEY action.

6.4 Acceptance Criteria

alloc resolves correctly per state via st.stateId.

Each state's affiliations.player gains exactly allocSample and affiliations.independent loses exactly allocSample.

st.factions.custom_founding_faction gains alloc, with proportional deductions from swing factions.

A 51-jurisdiction sweep after creation shows zero-voter drift; the founding faction's national total is exactly the transferred voters.

6.5 Test Plan

New script: scripts/test-v0163-founding-injection.cjs:

Lookup: assert alloc resolves via st.stateId for every state.

Affiliation ledger: per state, assert the player/independent sample-unit transfer is exact.

Faction ledger: per state, assert the raw-voter injection and proportional swing deduction.

Conservation sweep: sum all jurisdictions; assert exact conservation and a correct founding faction national total.

7. REQ-249 — Largest-Remainder Apportionment & Integer Sample Unit Conservation

Size: MediumType: Bug fix (apportionment math and validation)Target files: engine.js (state allocation apportionment); app.js (allocation inputs)Dependencies / related: REQ-240, REQ-248, REQ-251Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-03; moved into this version document at the owner's direction.

7.1 Symptom

Non-multiple-of-100 state allocations (e.g., 33,333 / 33,333 / 33,334 across 3 states) cause rounding drift when divided by 100, losing or generating phantom integer sample units.

7.2 Fix Specification

Engine: implement Hare-Niemeyer (Largest Remainder Method) for state allocation apportionment, guaranteeing that the sum of sample units across all states equals exactly 1,000 (representing exactly 100,000 voters) with zero integer drift.

UI (app.js): enforce step="100" auto-snapping on input change/blur so users cannot submit non-integer-hundred slices.

Invariant: bit-for-bit conservation of exactly 1,000 sample units across all valid custom faction state distributions.

7.3 Save-Compatibility Notes

None. Applies at initialization and input time; no schema change, no SAVE_KEY action.

7.4 Acceptance Criteria

Any valid distribution of the 100,000 founding voters apportions to exactly 1,000 sample units across states, with no lost or phantom units.

Allocation inputs snap to multiples of 100 on change/blur.

The 33,333 / 33,333 / 33,334 case produces exactly 1,000 units with zero drift.

7.5 Test Plan

New script: scripts/test-v0163-apportionment.cjs:

Adversarial splits: apportion 33,333/33,333/33,334 and other non-multiple splits; assert the exact 1,000-unit total and per-state largest-remainder assignment.

51-way spread: apportion across all jurisdictions; assert exact conservation.

Snapping: fire change/blur with non-hundred values; assert snapped multiples of 100.

8. REQ-250 — Draft-of-7 Redraw Pool Check & Hard Ceiling Cap (20-Action Pool)

Size: SmallType: Bug fix (draft action economy)Target files: engine.js (line 11315, redraw validation); app.js (draft UI)Dependencies / related: REQ-230 (Draft-of-7 engine), REQ-231 (escalating-cost redraws)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-04; moved into this version document at the owner's direction.

8.1 Symptom

The organizing phase runs on a 20-action pool (organizingActionsRemaining). At engine.js line 11315, the redraw check queries updated.actionsLeft < cost instead of the 20-action pool; because actionsLeft refills in 4-action chunks, Redraw 5 (cost: 5 actions) is permanently unpurchasable even with 10+ actions remaining.

8.2 Fix Specification

Update redraw validation to (updated.organizingActionsRemaining ?? updated.actionsLeft) >= cost, deducting cost from both organizingActionsRemaining and actionsLeft.

Cap the maximum redraw cost at 4 actions (Math.min(4, redrawCount + 1)) so players can continue redrawing as long as they have organizing actions remaining.

⚠ Design Doctrine — Major vs. Minor Party Dynamic (intentionally intact): building a minor party is intentionally difficult. Minor parties receive no action subsidies and no free redraws; every redraw action spent directly penalizes ballot petition and recruitment capacity. This fix repairs the check only and must not soften the minor-party opportunity cost in any way.

8.3 Save-Compatibility Notes

None. Economy logic; no schema change, no SAVE_KEY action.

8.4 Acceptance Criteria

Redraws are purchasable whenever organizingActionsRemaining >= cost, independent of the 4-chunk actionsLeft refill state.

Deductions hit both counters exactly.

No redraw ever costs more than 4 actions.

Minor parties receive no subsidies or free redraws in any path.

8.5 Test Plan

New script: scripts/test-v0163-redraw-pool.cjs:

Unpurchasable case repaired: Redraw 5 with actionsLeft < 5 but pool ≥ 5; assert the purchase succeeds.

Dual deduction: both counters reduce by exactly cost.

Ceiling: redrawCount ≥ 3 → cost stays capped at 4.

Doctrine: no secondary credit top-ups for minor parties in the redraw path; zero/negative pool rejected.

9. REQ-251 — 100K State Allocation Validation Modal & Silent Reset Prevention

Size: SmallType: Bug fix (setup UI & validation)Target files: app.js (setup allocation UI, launch button); engine.js (line 3915, allocation guard)Dependencies / related: REQ-240, REQ-249, REQ-253 (the drawer whose inputs are validated)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-05; moved into this version document at the owner's direction.

9.1 Symptom

At engine.js line 3915, if state allocations do not sum to exactly 100,000, the engine silently collapses 100% of the movement into the founding state (PA). The UI neither blocks form submission nor warns the player.

9.2 Fix Specification

Disable the "Start Game" / "Launch Movement" button whenever total allocated voters !== 100,000.

On an attempted submission with an incomplete allocation, present a validation modal: "State voter allocations sum to X / 100,000. Please allocate exactly 100,000 voters before launching."

Defense in depth: with the UI guard in place, the engine's silent-collapse branch must become unreachable; if invoked anyway (guard bypass), it must fail loudly rather than silently redirect voters.

9.3 Save-Compatibility Notes

None. Pre-game validation; no schema change, no SAVE_KEY action.

9.4 Acceptance Criteria

The launch button is disabled at any total other than exactly 100,000, with live total feedback.

The validation modal shows the correct running total in place of X.

A complete allocation launches normally.

The engine's silent collapse-to-PA branch can never execute silently.

9.5 Test Plan

New script: scripts/test-v0163-alloc-validation.cjs:

Gating: partial totals → button disabled; modal fires on attempt with correct copy (X / 100,000).

Launch: exact 100,000 → launch proceeds.

Engine guard: assert the silent-collapse branch is unreachable/fails loudly when called with bad sums.

10. REQ-252 — Statehouse Standout Persistent ID & Milestone Continuity

Size: SmallType: Bug fix (career progression engine)Target file: engine.js (line 7935, encourageStateRecruit)Dependencies / related: REQ-224 (statehouse standout spawner), REQ-225 (promotion pipeline)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-06; moved into this version document at the owner's direction.

10.1 Symptom

Promoting a sitting statehouse standout generates a new recruit.id rather than keeping standout.id, severing career tracking and legislative milestone history.

10.2 Fix Specification

Retain recruit.id = standout.id when promoting a standout via encourageStateRecruit.

Ensure careerMilestones cleanly appends "Served in State Legislature" and carries forward prior terms served without creating orphaned records.

10.3 Save-Compatibility Notes

Prospective only: records already severed in existing 0.16.2 saves cannot be retro-merged; no schema change, no SAVE_KEY action.

10.4 Acceptance Criteria

A promoted standout keeps the same ID.

careerMilestones appends the statehouse service entry exactly once and lists prior terms.

No duplicate or orphaned records result from promotion.

10.5 Test Plan

New script: scripts/test-v0163-standout-id.cjs:

Promote a standout; assert ID equality before/after.

Assert milestone history carries forward with the appended service entry and no duplicates.

Assert no orphaned records remain with the old ID.

11. REQ-253 — Responsive Drawers & 50-State Scroll Trap Resolution

Size: SmallType: Bug fix (responsive UX)Target files: styles.css (.draft-hand-grid); app.js (Custom Party drawer markup, Section 04 form)Dependencies / related: REQ-235 (custom party setup flow), REQ-251 (validation in the same form), REQ-254 (theme bindings for the same components)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-07; moved into this version document at the owner's direction.

11.1 Symptom

Section 04 of the Custom Party drawer uses inline static 2-column styles that collide on screens < 540px, and the 50-state allocation inputs sit in a static 160px box that captures touch swipe gestures on mobile, trapping scrolling.

11.2 Fix Specification

In styles.css, update .draft-hand-grid to repeat(auto-fill, minmax(240px, 1fr)), collapsing to 1 column below 480px.

In app.js, replace the inline 2-column styles with a responsive class (.custom-100k-form-grid) that collapses to 1 column on viewports < 540px.

Replace the 160px fixed-height state allocation box with an expandable regional accordion/drawer.

11.3 Save-Compatibility Notes

None. Presentation only.

11.4 Acceptance Criteria

No layout collisions below 540px; the form collapses to a single column.

The 50-state allocation form no longer traps touch scrolling; regions expand/collapse cleanly.

Light and dark dashboard modes are both unaffected visually (composes with REQ-254).

11.5 Test Plan

New script: scripts/test-v0163-responsive-drawers.cjs (static checks plus a manual mobile smoke pass):

Assert the .draft-hand-grid rule uses repeat(auto-fill, minmax(240px, 1fr)) with a < 480px single-column collapse.

Assert the Section 04 markup carries .custom-100k-form-grid and contains no inline fixed 2-column styles.

Assert no fixed 160px height remains on the state allocation container and the accordion is present.

Owner manual smoke test at < 540px on touch.

12. REQ-254 — Semantic CSS Variable Binding for v0.16.2 Elements

Size: TinyType: Bug fix (theme consistency)Target file: styles.cssDependencies / related: REQ-253 (same components), REQ-251 (same drawer)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-08; moved into this version document at the owner's direction.

12.1 Symptom

Newly introduced drawer and modal classes hardcode dark hex/rgba values (#0f172a, rgba(15,23,42,0.8)), breaking theme inheritance in light dashboard modes.

12.2 Fix Specification

Bind .draft-priority-card, .custom-party-drawer, .succession-modal-panel, and .anchor-crisis-panel to the CSS custom properties (var(--panel), var(--panel2), var(--text), var(--line)), removing the hardcoded dark values so both light and dark dashboard modes render correctly.

12.3 Acceptance Criteria

The four classes reference only semantic custom properties for panel, text, and line colors.

No hardcoded hex or rgba values remain in their rules.

Light mode no longer renders dark-on-dark surfaces for these elements.

12.4 Test Plan

New script: scripts/test-v0163-theme-bindings.cjs: assert each of the four class rules references var(--panel)/var(--panel2)/var(--text)/var(--line) and contains no hardcoded #0f172a or rgba(15,23,42,*) values.

13. REQ-255 — Targetable Opponent Stronghold Dropdown Qualification Indicator

Size: TinyType: Bug fix (UI telemetry)Target file: app.js (target territory selector for crack-an-opponent-stronghold)Dependencies / related: REQ-233 (crack stronghold/fortress priorities)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-09; moved into this version document at the owner's direction.

13.1 Symptom

The target territory selector for crack-an-opponent-stronghold lists all 50 states without indicating which qualify (opponent share >= 55%).

13.2 Fix Specification

Flag or filter states in the dropdown that meet the >= 55% opponent vote share threshold, so only qualifying states are targetable (or non-qualifying states are visibly grayed). Flag wording follows Game Style Guide Rule 7: atmospheric cue language (e.g., indicating fertile vs. hostile terrain), with no raw percentages in the copy.

13.3 Acceptance Criteria

States with opponent share >= 55% are clearly targetable in the dropdown.

States below the threshold are either hidden or visibly non-qualifying.

Flag copy complies with Rule 7 (no raw numbers).

13.4 Test Plan

New script: scripts/test-v0163-stronghold-qualifier.cjs: build the selector against a matrix with known shares; assert only >= 55% states are targetable, threshold states render the qualifying flag, and label copy contains no numeric strings.

14. REQ-256 — Succession Crisis Atmospheric Text & Trait Interpolation

Size: TinyType: Enhancement of atmospheric copy (Rule 7 family)Target file: app.js (succession modal rendering)Dependencies / related: REQ-242 (succession crisis), REQ-239 (origin archetypes)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: originally labeled REQ-AUD-10; moved into this version document at the owner's direction.

14.1 Symptom

Succession cards use generic text rather than referencing the specific founding chair or active archetype bonuses.

14.2 Fix Specification

Interpolate founderName and active archetype traits directly into the option descriptions on the succession modal. All copy must follow Game Style Guide Rule 7: atmospheric narrative language with no raw numbers, percentages, or formula names.

14.3 Acceptance Criteria

Succession modal option descriptions reference the founder by name.

Active archetype trait phrases appear in the option text.

No raw math appears in the rendered copy.

14.4 Test Plan

New script: scripts/test-v0163-succession-text.cjs: render the succession modal options; assert founderName appears, archetype trait phrases appear, and option copy contains no digits or percentage signs.

15. REQ-257 — 2026 Midterm Baseline Popular Vote Calibration

Size: TinyType: Bug fix (scenario baseline data calibration)Target file: scenario-2028.js (lines 6190–6194, window.PartyChairData.HISTORICAL_ELECTIONS)Related UI: app.js line 4264 (Unified Election History Timeline)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA agent's label "REQ-260"; renumbered by the Design Agent to the next free master-counter ID. If the owner has reserved REQ-258–REQ-260 in the workspace for other items, the Design Agent will re-map on notice.

15.1 Symptom

The "2026 Midterm (Scenario Baseline)" entry in HISTORICAL_ELECTIONS reports a national popular vote of D 51.4% / R 46.8%, contradicting the canonical scenario baseline margin of D 56.2% / R 42.3%. The wrong figures surface in the Unified Election History Timeline's 2026 Scenario Baseline card.

15.2 Root Cause

The nationalVote object of the 2026 Midterm baseline entry holds incorrect party values in the static scenario reference data.

15.3 Fix Specification

In scenario-2028.js, locate the 2026 Midterm baseline entry in window.PartyChairData.HISTORICAL_ELECTIONS and set its nationalVote to:

"nationalVote": {
  "people": 56.2,
  "heritage": 42.3,
  "other": 1.5
}

No other historical election entries are touched.

15.4 Save-Compatibility Notes

None. This is static scenario reference data, not save state; the corrected figures apply to all games on next load. No SAVE_KEY action.

15.5 Acceptance Criteria

The HISTORICAL_ELECTIONS 2026 Midterm baseline entry reads exactly people: 56.2, heritage: 42.3, other: 1.5.

Sum conservation: people + heritage + other === 100.0 exactly.

The Unified Election History Timeline (app.js line 4264) "2026 Scenario Baseline" card displays "Popular Vote: D 56.2% / R 42.3%".

All other HISTORICAL_ELECTIONS entries remain unchanged.

15.6 Verification / Test Plan

New script: scripts/test-v0163-baseline-calibration.cjs:

Assert the 2026 baseline entry's nationalVote values match the canonical figures above.

Assert 100.0% sum conservation across people, heritage, and other.

Assert no other entries in HISTORICAL_ELECTIONS were modified from their pre-fix values.

16. REQ-258 — Strict Ballot Access Zero-Polling Invariant Across All Races

Size: SmallType: Balance invariant fix (engine logic correction; no new player-facing feature intent)Target file: engine.js (supportByState, hasBallotAccess, commissionRacePoll, version01CandidateField, reallocateStateHouseSeatCounts)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "REQ-BAL-01"; allocated next free master-counter ID.

16.1 Symptom

Parties with zero ballot access in a state still poll between 0.3% and 2.5% there. supportByState computes presidential polling shares for third parties (Socialist, Constitution, Green, Liberty, Custom) from demographic elasticity, memberships, and ideological proximity without ever verifying ballot access, and commissionRacePoll plus the candidate recruitment pipelines allow non-zero polling in districts and states where the party has not qualified for the ballot.

16.2 Root Cause

No polling path gates its share computation on hasBallotAccess; access data exists in the game state but is not consulted before scoring.

16.3 Fix Specification

Part 1 — Presidential / Electoral College Polling (supportByState)

In supportByState(game, state):

Check hasBallotAccess(game, party.id, 'presidential:' + stateId).

If false, the party's raw score for that state is set strictly to 0.0.

When normalizing state shares to 100%, any party lacking ballot access in that state must output strictly 0.0%.

Part 2 — Race-Specific Polling (commissionRacePoll)

In commissionRacePoll(game, payload):

Check hasBallotAccess(game, identityId, raceKey).

If false, set playerShare = 0.0% and allocate the remaining share between the major parties and undecideds.

Part 3 — Senate & House Candidates (version01CandidateField)

For non-major parties lacking ballot access for raceId:

Candidates must not appear on active general election ballots.

Their poll share must evaluate to 0.0%.

Part 4 — State Legislative Slates (reallocateStateHouseSeatCounts)

If !hasBallotAccess(game, partyId, 'state-leg:' + stateId):

That party's state legislative slate vote share must be strictly 0.0%.

Doctrine alignment: This invariant strengthens the owner-mandated intentional minor-party difficulty doctrine (see REQ-250): missing ballot access is a hard wall, not a soft penalty. The fix must not add any compensating subsidy elsewhere.

16.4 Save-Compatibility Notes

None expected. Access data already lives in game state; this is computed-at-read polling logic only, with no schema change and no SAVE_KEY action.

16.5 Acceptance Criteria

Any party without ballot access in a given state polls at exactly 0.0% in that state for the relevant office (presidential, Senate/House race, or state legislative slate).

Running supportByState across all 50 states + DC for a party with {} starting ballot access produces 0.0% in every one of the 51 jurisdictions.

commissionRacePoll with no access yields playerShare = 0.0% with the remainder allocated to major parties and undecideds, summing to 100%.

Non-major-party candidates lacking race access do not appear on active general election ballots.

No regression: parties holding ballot access poll normally in every path.

16.6 Test Plan

New script: scripts/test-v0163-ballot-access-invariant.cjs:

Presidential sweep: run supportByState for a party with {} access across all 51 jurisdictions; assert 0.0 raw and normalized share everywhere.

Race polling: call commissionRacePoll without race access; assert playerShare === 0 and share conservation to 100% among majors + undecideds.

Candidate field: build version01CandidateField for a race without access; assert the party's candidates are absent from the ballot and its share is 0.0.

State-leg slates: run reallocateStateHouseSeatCounts without 'state-leg:' + stateId access; assert a 0.0% slate share.

Positive regression: repeat all four paths with valid access; assert pre-fix behavior is preserved.

Player-facing copy note: zero-access display follows the game's established polling presentation conventions for sub-threshold parties; no new numeric readouts are introduced.

17. REQ-259 — 2028 Starting Baseline 3.0% Polling Ceiling for Non-Major Parties

Size: SmallType: Balance invariant fix (starting-baseline calibration; no new player-facing feature intent)Target files: engine.js (createGame, supportByState, version01CandidateField, reallocateStateHouseSeatCounts); scenario-2028.js (version01PrimaryField, starting state baselines)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "REQ-BAL-02"; allocated next free master-counter ID.

17.1 Symptom

On the initial 2028 scenario baseline, third parties and player-selected minor parties can occasionally register above 3.0% in specific states or races, and human minor-party chairs can experience immediate turn-1 campaign calculation spikes.

17.2 Design Intent

Building a minor party starts with severe disadvantages. On the initial 2028 map, only Democrats (people) and Republicans (heritage) may start above 3.0%.

17.3 Fix Specification

Part 1 — Scope & Scope Boundary

Applies strictly to the initial starting baseline map of cycle 2028 (game.year === 2028 at game start).

Not a permanent cap for subsequent years or later cycles. Minor parties can legitimately grow beyond 3.0% through gameplay, organizing, and campaign investments. The clamp must be implemented as a starting-baseline initialization step, never as a standing ceiling inside the live polling functions.

Part 2 — Applicable Parties

All parties other than people (Democrats) and heritage (Republicans): liberty, green, socialist, constitution, independent candidates, and custom minor parties.

Part 3 — Ceiling Enforcement

Electoral College (Presidential): On the starting 2028 baseline, clamp each non-major party's presidential share in every state: share = Math.min(share, 3.0).

Senate Races: All starting 2028 Senate candidate polling shares for non-major candidates must not exceed 3.0%.

House Races: All starting 2028 House district candidate polling shares for non-major candidates must not exceed 3.0%.

State Legislative Slates: Initial 2028 state legislature vote shares for non-major parties must not exceed 3.0%.

Part 4 — Human Player Minor Party Handling

When the player starts as a minor party in 2028, initial campaign bonuses (morale lift, chapter lift) must be tempered at cycle initialization so starting support begins from the ≤ 3.0% foundation.

Doctrine alignment: This is the starting-baseline twin of REQ-258's hard wall: severe intentional minor-party opening disadvantage — but, per the scope boundary, growth beyond the ceiling through play remains fully legitimate. No subsidies are introduced.

17.4 Save-Compatibility Notes

None. The clamp applies only during 2028 game initialization; no schema fields change and no SAVE_KEY action is required.

17.5 Acceptance Criteria

On the initial 2028 game board, no party other than Democrats or Republicans polls above 3.0% in any Senate race, House race, or State Legislature slate.

No non-major party begins above 3.0% in any state in the Electoral College on the starting 2028 map.

In later cycles (e.g., 2030+), a minor party that has organically grown past 3.0% is NOT clamped back down.

A human player starting as a minor party begins at or below 3.0% everywhere, with no turn-1 spike above the ceiling.

17.6 Test Plan

New script: scripts/test-v0163-baseline-ceilings.cjs:

Initial board sweep: create a 2028 game; iterate every state's presidential share, every Senate/House race share, and every state-leg slate; assert all non-major-party values ≤ 3.0.

Major exemption: assert people and heritage are never clamped.

Player minor party: create a 2028 game with a human minor party; assert no value above 3.0 after initialization and no morale/chapter lift escapes the clamp.

Non-permanence: advance a minor party above 3.0% in a later cycle (simulate growth, then poll); assert the later-cycle value persists unclamped.

18. REQ-260 — Socialist Vermont Peak & Regional Geographic Calibration

Size: SmallType: Balance calibration fix (regional/demographic data tuning; no player-facing copy changes)Target files: factions-0.15.js (FACTION_STATE_MATRIX, Vermont & regional densities); engine.js (regionalIdeal, supportByState); scenario-2028.js (minor party regional baseline weights)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "REQ-BAL-03"; allocated next free master-counter ID.

18.1 Symptom

Green rival support averages ~2.1% in the Northeast and ~1.7% in the Midwest, while Socialists average only ~0.29% and ~0.24% in those regions. Vermont (VT) is also not mathematically anchored as the Socialist party's #1 state under all conditions.

18.2 Fix Specification

Part 1 — Vermont: Absolute Top State for Socialists

In supportByState(game, state): for the socialist party (and a Socialist player), Vermont (VT) must be mathematically guaranteed to be their highest polling state nationally under all conditions (VT.socialist > ANY_OTHER_STATE.socialist).

In factions-0.15.js (FACTION_STATE_MATRIX): rebalance Vermont faction densities so soc_socialists and soc_communists hold their highest per-capita concentration in Vermont and exceed Green faction voters there (VT.soc_socialists + VT.soc_communists > VT.grn_eco_socialist_vanguard + VT.grn_yimby).

Part 2 — Northeast Regional Invariant (Socialist > Green)

Calibrate regionalIdeal.Northeast and the ideological distance multipliers so Socialists outperform Greens across the Northeast region (avg(Northeast.socialist) > avg(Northeast.green)).

Part 3 — Midwest Regional Invariant (Socialist > Green)

Calibrate regionalIdeal.Midwest economic and labor weights so Socialists outperform Greens across the Midwest region (avg(Midwest.socialist) > avg(Midwest.green)).

Part 4 — West Regional Invariant (Green > Socialist)

Maintain Pacific environmental and climate action weights in regionalIdeal.West so Greens outperform Socialists across the West region (avg(West.green) > avg(West.socialist)).

Interaction note: This calibration composes with REQ-259 (3.0% starting ceiling) and REQ-258 (ballot access walls); regional ordering must hold within those constraints, not override them.

18.3 Save-Compatibility Notes

FACTION_STATE_MATRIX and regionalIdeal tuning affect live polling computations for existing saves as well as new ones; this is expected recalibration behavior, not a schema change. No SAVE_KEY action required.

18.4 Acceptance Criteria

In baseline polling across all states:

Vermont (VT) is the #1 highest polling state for the Socialist party.

Regional average polling shows Socialist > Green in the Northeast.

Regional average polling shows Socialist > Green in the Midwest.

Regional average polling shows Green > Socialist in the West.

18.5 Test Plan

New script: scripts/test-v0163-regional-calibration.cjs:

VT anchor: compute baseline supportByState for the Socialist party in all 51 jurisdictions; assert VT is the argmax.

VT density check: assert VT.soc_socialists + VT.soc_communists > VT.grn_eco_socialist_vanguard + VT.grn_yimby in FACTION_STATE_MATRIX.

Regional invariants: assert avg(Northeast.socialist) > avg(Northeast.green), avg(Midwest.socialist) > avg(Midwest.green), and avg(West.green) > avg(West.socialist).

Constraint composition: rerun with a 2028 baseline (REQ-259 ceiling and REQ-258 access walls active) and assert the four-ordering invariants still hold within the clamped values.

19. REQ-261 — House Downballot National Environment Calibration (D+9 Generic Ballot & District Baseline)

Size: SmallType: Balance calibration fix (electoral environment transmission; no new player-facing feature intent)Target files: engine.js (calculateDistrictElection, estimateRaceMarginInternal, supportByState); scenario-2028.js (starting 2028 district election baseline)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "REQ-ENV-01"; allocated next free master-counter ID.

19.1 Symptom

The 2028 cycle initializes nationalEnvironment: 9 (D+9), but the environment transmits at full strength only to the presidential race. In the House, calculateDistrictElection damps presidential coattails by 0.34 (presMargin * 0.34) and supportByState applies only an attenuated lift (0.14 * 0.82), yielding a national generic House vote of ~D+2.8 (Dem 49.4% / GOP 46.6%) instead of D+9. In estimateRaceMarginInternal House races multiply nationalMargin by coattailWeight = 0.34, diluting a D+9 wave down to +3.06 points in district forecasts and ratings.

19.2 Fix Specification

Part 1 — Generic Congressional Ballot Invariant (D+9 at Start)

At the 2028 start, the aggregate national House vote share / generic ballot baseline must directly reflect nationalEnvironment: 9:

Dem Vote = 50% + (nationalEnvironment / 2) = 54.5%

GOP Vote = 50% − (nationalEnvironment / 2) = 45.5%

National Margin = D+9.0%

Interpretation note: this invariant governs the two-party (Dem/GOP) national aggregate. Per-race shares continue to normalize as today, so minor-party candidacies (capped by REQ-259, walled by REQ-258) must not be zeroed out to satisfy the aggregate — the invariant is measured on the Dem-vs-GOP margin.

Part 2 — District Baseline Margin Formula

Congressional district baselines must start centered on their normal district partisan lean plus the full national environment, replacing the 0.34 environment scaling:

Baseline District Margin = district.lean + nationalEnvironment

Examples in a D+9 environment: an EVEN district starts D+9.0; an R+4 district starts D+5.0; an R+12 district starts R+3.0.

Part 3 — Forecast & Resolution Engine Alignment

In estimateRaceMarginInternal(game, raceKey) for kind === 'house': replace the diluted nationalMargin * 0.34 coattail term with the full nationalMargin (or game.nationalEnvironment).

In calculateDistrictElection(game, year): ensure district vote distributions (allShares and firstChoice) center each district contest around district.lean + nationalEnvironment + candidateQualityLift + fundingLift.

19.3 Save-Compatibility Notes

None. Computed election logic only; no schema change, no SAVE_KEY action.

19.4 Acceptance Criteria

Running calculateDistrictElection on a new 2028 game produces a national House popular vote margin of approximately D+9.0% (within ± 0.5%).

House district forecasts in buildForecasters().polling reflect district.lean + nationalEnvironment before candidate-specific quality and funding adjustments.

19.5 Test Plan

New script: scripts/test-v0163-env-house.cjs:

Generic ballot: create a 2028 game; aggregate House popular vote; assert the Dem/GOP margin is D+9.0 ± 0.5.

District baselines: assert each district's pre-candidate forecast margin evaluates to district.lean + 9.0.

Spot checks: EVEN district ≈ D+9.0; R+4 ≈ D+5.0; R+12 ≈ R+3.0.

Candidate adjustments still apply: quality/funding lifts shift the baseline after the lean + environment foundation.

20. REQ-262 — Senate Downballot National Environment Calibration (D+9 State Partisan Lean Baseline & Race Resolution)

Size: SmallType: Balance calibration fix (electoral environment transmission; no new player-facing feature intent)Target files: engine.js (estimateRaceMarginInternal, candidateMargin, buildForecasters, resolveVersion01GeneralElection)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "REQ-ENV-02"; allocated next free master-counter ID.

20.1 Symptom

Senate races do not operate in the full D+9 national environment: estimateRaceMarginInternal and candidateMargin compute Senate baselines from presMargin * 0.55 and a heavily muted supportByState partisan delta. Result: severely dampened battlegrounds — Ohio (lean R+9.55) starts R+2.8 instead of R+0.55 (Toss-Up); Pennsylvania (lean D+1.33) starts D+6.8 instead of D+10.33; Montana (lean R+18.7) starts R+7.8 instead of R+9.7; Wisconsin (lean D+1.0) starts D+4.2 instead of D+10.0.

20.2 Fix Specification

Part 1 — Senate Baseline Calibration (State Lean + Full National Environment)

Every Senate contest must baseline from the state's normal partisan lean adjusted for the full nationalEnvironment:

Senate Baseline Margin = state.leanPercent + nationalEnvironment

Examples in a D+9 environment: an EVEN state starts D+9.0; an R+9.55 state like Ohio starts R+0.55 (Toss-Up); an R+8.0 state like Texas starts D+1.0; a D+1.33 state like Pennsylvania starts D+10.33.

Part 2 — Forecast Margin Engine (estimateRaceMarginInternal for senate)

Update so the fundamentals baseline is computed as:

Fundamentals Margin = state.leanPercent + nationalEnvironment + candidateQuality + incumbentLift

Eliminate the 0.55 dilution on the national environment so it transmits 1:1 into the Senate baseline.

Part 3 — General Election Resolution (candidateMargin in resolveVersion01GeneralElection)

In candidateMargin(raceId, state), ensure the starting point for Senate races incorporates the full national environment rather than fractional coattails (coattailWeight = 0.55).

Part 4 — Forecaster Ratings Consistency (buildForecasters)

Starting Senate ratings (sallow, cooked, inside, consensus) must evaluate on margins incorporating the full D+9 environment, moving states with leans between R+5 and R+9 firmly into Toss-Up / Tilt categories at game start.

20.3 Save-Compatibility Notes

None. Computed race logic; no schema change, no SAVE_KEY action.

20.4 Acceptance Criteria

On turn 1 of the 2028 cycle (with nationalEnvironment: 9), Senate race margins in buildForecasters().polling evaluate to approximately state.leanPercent + 9.0 (adjusted for sitting incumbent and candidate quality).

An R+9 state (e.g., Ohio) evaluates as a Toss-Up / Tilt race at game start rather than a safe or favored Republican hold.

A neutral/even state (lean 0.0) starts at approximately D+9.0% in Senate baseline estimates.

20.5 Test Plan

New script: scripts/test-v0163-env-senate.cjs:

Baseline sweep: for every 2028 Senate contest, assert the fundamentals margin ≈ lean + 9.0 before candidate adjustments.

Named battlegrounds: OH ≈ R+0.55; PA ≈ D+10.33; MT ≈ R+9.7; WI ≈ D+10.0; TX (R+8.0) ≈ D+1.0.

Ratings: assert R+5–R+9 lean states open as Toss-Up / Tilt in all four forecaster decks.

Regression: incumbent and candidate-quality lifts still move margins off the baseline.

21. REQ-263 — Fix "Take the Chair" Mismatched Custom Party Input Selectors

Size: TinyType: Bug fix (setup flow fatal silent failure)Target files: app.js (customPartyCreatorMarkup, #start-game event listener, input listeners)Related: REQ-246 (setup choice persistence — shares input listeners and ID family with this fix), REQ-235 (custom party creator), REQ-245 (creator population display)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "BUG-UI-01"; allocated next free master-counter ID.

21.1 Symptom & Root Cause

Filling out custom party details and clicking "Take the Chair" (#start-game) silently fails — no validation highlight, no game start. The creator drawer (customPartyCreatorMarkup, lines 1604–1625) renders custom--prefixed IDs (#custom-party-name, #custom-leader-name, #custom-party-color / #custom-party-color-hex), but the #start-game handler (lines 8794–8808) and input listeners (lines 8713, 8772) query legacy un-prefixed IDs (#party-name, #leader-name, #party-color-hex), which evaluate to null. customName therefore resolves to "", the validation guard fires, and it attempts to focus .invalid on a nonexistent element before return; — aborting the launch before createGame() runs.

21.2 Fix Specification

Part 1 — Update #start-game DOM Selectors (app.js lines 8796–8808)

Read from the active custom party IDs with fallback to legacy IDs:

const nameInput = document.querySelector('#custom-party-name') || document.querySelector('#party-name');
if (nameInput) customPartyName = nameInput.value;

const leaderInput = document.querySelector('#custom-leader-name') || document.querySelector('#leader-name');
if (leaderInput) customLeaderName = leaderInput.value;

const colorInput = document.querySelector('#custom-party-color-hex')
  || document.querySelector('#custom-party-color')
  || document.querySelector('#party-color-hex')
  || document.querySelector('#party-color');
if (colorInput) customPartyColor = colorInput.value;

Part 2 — Fix Validation Focus & Fallback (app.js lines 8804–8808)

When validating custom && !customName, target the actual DOM input element:

const customNameInput = document.querySelector('#custom-party-name') || document.querySelector('#party-name');
if (custom && !customName) {
  customNameInput?.focus();
  customNameInput?.classList.add('invalid');
  return;
}

Part 3 — Wire Real-Time Input Listeners (app.js lines 8713, 8772)

document.querySelector('#custom-party-name')?.addEventListener('input', (e) => {
  customPartyName = e.target.value;
});
document.querySelector('#custom-leader-name')?.addEventListener('input', (e) => {
  customLeaderName = e.target.value;
});

Consolidation note with REQ-246: REQ-246 binds change listeners for #custom-party-name, #custom-party-color, and #custom-party-color-hex. Consolidate the REQ-246 and REQ-263 listener bindings into one consistent binding block (single source of truth per input) so the two requirements cannot write conflicting or duplicate handlers.

21.3 Save-Compatibility Notes

None. Pre-game setup UI only.

21.4 Acceptance Criteria

Clicking "Create Custom Party", entering a party name, and clicking "Take the Chair" successfully creates the game and transitions to the dashboard.

The custom party name, leader name, and color entered in the setup drawer are correctly reflected on the player's dashboard and sidebar.

If the party name is left blank, the visible #custom-party-name input is properly focused and highlighted with the .invalid CSS state rather than failing silently.

21.5 Test Plan

Extend scripts/test-v0163-setup-persistence.cjs (same setup-flow family) with a REQ-263 case set:

Launch path: simulate creator open → name entered → #start-game; assert createGame is reached.

Lift-through: name/leader/color values appear in the launched game's player identity.

Validation: empty name → assert focus target resolves to #custom-party-name and .invalid is applied; no silent abort.

22. REQ-264 — 3rd Party State Chapter Footprint Rebalance

Size: SmallType: Balance calibration fix (starting infrastructure realism)Target files: engine.js (createGame, buildStateOrganizations, supportByState); scenario-2028.js (starting state organization defaults)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "REQ-CHAP-01"; allocated next free master-counter ID.

22.1 Symptom

engine.js (lines 3591–3600) assigns 1 chapter to every minor party in every state indiscriminately, inflating third-party grassroots presence where no historical or electoral footprint exists (e.g., Constitution party chapters in Vermont or Hawaii; Socialist chapters in Idaho or Alabama).

22.2 Fix Specification

Replace the uniform 1-chapter-per-state loop with explicit state-by-state chapter assignment dictionaries for each established third party:

Libertarian Party (liberty) — 80 chapters total: baseline of exactly 1 chapter in all 50 states; Prairie concentration (ND, SD, NE, KS, OK, MT, WY, IA: 3 each), Appalachia concentration (WV: 4; KY, TN, PA: 3 each; OH, VA, NC: 2 each), Western/Interior fringe (ID, UT, CO, MO: 2 each); all other states exactly 1.

Green Party (green) — 40 chapters total: Pacific/West Coast core (CA: 12; OR: 6; WA: 6; HI: 2; AK: 2 = 28), Western/Mountain hubs (CO: 3; NM: 2; NV: 2; AZ: 1 = 8), Northeast progressive enclaves (VT: 2; MA: 1; NY: 1 = 4); all other states 0.

Socialist Party (socialist) — 15 chapters total: strictly Northeast + Midwest — VT: 3 (anchor state), NY: 2, MA: 2, PA: 1, ME: 1 (Northeast, 9); IL: 2, MI: 2, WI: 1, MN: 1 (Midwest, 6); all other states 0.

Constitution Party (constitution) — 15 chapters total: strictly Southern — AL, MS, SC, TN, GA, TX: 2 each; NC, LA, AR: 1 each; all other states 0.

22.3 Exact State-by-State Reference Dictionary

const STARTING_3RD_PARTY_CHAPTERS = {
  liberty: {
    AL: 1, AK: 1, AZ: 1, AR: 1, CA: 1, CO: 2, CT: 1, DE: 1, FL: 1, GA: 1,
    HI: 1, ID: 2, IL: 1, IN: 1, IA: 3, KS: 3, KY: 3, LA: 1, ME: 1, MD: 1,
    MA: 1, MI: 1, MN: 1, MS: 1, MO: 2, MT: 3, NE: 3, NV: 1, NH: 1, NJ: 1,
    NM: 1, NY: 1, NC: 2, ND: 3, OH: 2, OK: 3, OR: 1, PA: 3, RI: 1, SC: 1,
    SD: 3, TN: 3, TX: 1, UT: 2, VT: 1, VA: 2, WA: 1, WV: 4, WI: 1, WY: 3,
  },
  green: {
    CA: 12, OR: 6, WA: 6, CO: 3, HI: 2, AK: 2, NM: 2, NV: 2, VT: 2, AZ: 1, MA: 1, NY: 1,
  },
  socialist: {
    VT: 3, NY: 2, MA: 2, IL: 2, MI: 2, PA: 1, ME: 1, WI: 1, MN: 1,
  },
  constitution: {
    AL: 2, MS: 2, SC: 2, TN: 2, GA: 2, TX: 2, NC: 1, LA: 1, AR: 1,
  },
};

22.4 Save-Compatibility Notes

Starting-state defaults affect new 2028 games only; existing saves keep their organization state. No schema change, no SAVE_KEY action.

22.5 Acceptance Criteria

Starting chapter totals at 2028 initialization match:

Libertarians: exactly 80 chapters.

Greens: exactly 40 chapters (36 West/Pacific, 4 Northeast).

Socialists: exactly 15 chapters (all Northeast/Midwest; 0 South/West).

Constitution Party: exactly 15 chapters (all South; 0 elsewhere).

game.stateOrganizations[stateId][partyId].chapters returns 0 for any state outside that party's footprint.

22.6 Test Plan

New script: scripts/test-v0163-chapter-footprint.cjs:

Totals: sum chapters per party at 2028 init; assert 80 / 40 / 15 / 15.

Dictionary fidelity: assert every state's chapter count matches STARTING_3RD_PARTY_CHAPTERS exactly.

Zero footprint: assert 0 chapters for every non-listed state/party pair.

Regional invariants: Greens 36 West/Pacific + 4 NE; Socialists 9 NE + 6 Midwest, 0 South/West; Constitution all South.

23. REQ-265 — Custom Party Zero-Infrastructure Starting Rule

Size: TinyType: Balance invariant fix (custom party starting state)Target files: engine.js (createGame, buildStateChaptersMap)Related: REQ-264 (established third-party footprints — the custom party path is separate from STARTING_3RD_PARTY_CHAPTERS), REQ-240 (100K Founding Faction Builder), REQ-259 (3.0% starting ceiling)Source: Owner + QA agent diagnosis, Nov 18, 2026. Note: submitted under the QA label "REQ-CHAP-02"; allocated next free master-counter ID.

23.1 Symptom

engine.js (lines 3601–3606) gives custom parties chapters: 1 in every state at initialization (50 chapters), contradicting the core design narrative that a brand-new party has no pre-existing political infrastructure and must build its state machine through chair organizing actions.

23.2 Fix Specification

In createGame (engine.js line 3603): set starting chapters to 0 across all states for custom parties:

 if (isCustom) {
   stateOrganizations[state.id]['player'] = {
     chapters: 0,
     strength: 0,
   };
 }

In buildStateChaptersMap (engine.js line 1847): ensure a custom player party's chapter count reads stateOrganizations[state.id]['player']?.chapters ?? 0.

In game.stateChapters: initialize every state entry for a custom party to 0.

Doctrine alignment: This is the infrastructure twin of the intentional minor-party difficulty doctrine (REQ-250, REQ-258, REQ-259): a custom party starts from nothing, everywhere.

23.3 Save-Compatibility Notes

Starting-state defaults affect new games only; no schema change, no SAVE_KEY action.

23.4 Acceptance Criteria

A custom party at 2028 launch has 0 chapters in every state (game.stateOrganizations entries all chapters: 0, strength: 0).

game.stateChapters shows 0 for every state for the custom party.

buildStateChaptersMap returns 0 for the custom player party in all states where no chapters have been organized.

23.5 Test Plan

Extend scripts/test-v0163-chapter-footprint.cjs with a REQ-265 case set:

Zero start: create a 2028 game with a custom party; assert every stateOrganizations[stateId]['player'].chapters === 0.

Chapter map: assert game.stateChapters is all zeros for the custom party, and buildStateChaptersMap reads the ?? 0 fallback.

24. Testing Summary (grows with each fix)

Test Script

Covers

scripts/test-v0163-cycle-transition.cjs

REQ-247 (no-crash cycle run, mutator conversion, clean rehoming, 2028→2034 chain)

scripts/test-v0163-founding-injection.cjs

REQ-248 (stateId lookup, affiliation ledger, faction ledger, conservation sweep)

scripts/test-v0163-apportionment.cjs

REQ-249 (Hare-Niemeyer exact 1,000 units, adversarial splits, step-100 snapping)

scripts/test-v0163-faction-transfer.cjs

REQ-245 (picker totals, card display, creation sync, realignment preservation, load backfill)

scripts/test-v0163-setup-persistence.cjs

REQ-246 (mode exit, position persistence, input sync, reset boundary) + REQ-263 (launch path, lift-through, validation focus)

scripts/test-v0163-redraw-pool.cjs

REQ-250 (pool-based validation, dual deduction, 4-cost cap, no minor-party subsidies)

scripts/test-v0163-alloc-validation.cjs

REQ-251 (launch gating, modal copy, engine silent-collapse unreachable)

scripts/test-v0163-standout-id.cjs

REQ-252 (ID retention, milestone continuity, no orphans)

scripts/test-v0163-responsive-drawers.cjs

REQ-253 (grid rules, class replacement, accordion, no touch trap)

scripts/test-v0163-theme-bindings.cjs

REQ-254 (semantic variable binding, no hardcoded hex)

scripts/test-v0163-stronghold-qualifier.cjs

REQ-255 (>= 55% qualification flags, Rule 7 copy)

scripts/test-v0163-succession-text.cjs

REQ-256 (founder interpolation, archetype traits, no raw math)

scripts/test-v0163-baseline-calibration.cjs

REQ-257 (baseline values, 100.0% conservation, no collateral entry changes)

scripts/test-v0163-ballot-access-invariant.cjs

REQ-258 (presidential sweep, race polling, candidate field, state-leg slates, positive regression)

scripts/test-v0163-baseline-ceilings.cjs

REQ-259 (initial 2028 sweep, major exemption, player minor start, non-permanence in later cycles)

scripts/test-v0163-regional-calibration.cjs

REQ-260 (VT anchor, VT densities, regional orderings, composition with ceiling and access walls)

scripts/test-v0163-env-house.cjs

REQ-261 (generic ballot D+9 ± 0.5, district lean+env baselines, spot checks, candidate adjustments)

scripts/test-v0163-env-senate.cjs

REQ-262 (fundamentals sweep, OH/PA/MT/WI/TX battlegrounds, forecaster ratings, adjustments regression)

scripts/test-v0163-chapter-footprint.cjs

REQ-264 (80/40/15/15 totals, dictionary fidelity, zero footprint) + REQ-265 (custom zero start, chapter map fallback)

25. Release Checklist (executed by Release Integrator only, at build time)

All FIX-REQ sections in this document implemented and individually tested.

Full regression pass on existing v0.16.2 test suites (test-v0162-*.cjs, test-mas01-phase4.cjs) plus this release's scripts.

Version string bump to 0.16.3 (Release Integrator only).

SAVE_KEY decision confirmed (no change expected for REQ-245; revisit per-fix as more fixes land).

powershell -ExecutionPolicy Bypass -File .\build.ps1 clean build.

Owner smoke test per acceptance criteria in each FIX section.

Owner archives implemented fixes (REQ-245 through REQ-265) in the workspace DESIGN_BACKLOG.md active queue where logged (Selective Archival rule; TBD items are never touched).

26. Master Handoff Prompts

How to use: export/save this document as VERSION_0.16.3_DESIGN.md in the workspace root (c:\Users\rober\.gemini\antigravity\scratch\party-chair-game) before launching any agent. Then paste Prompt 1 into your first coding AI session, Prompt 2 into a second, Prompt 3 into a third, and Prompt 4 into a fourth; run those four agents in parallel. When all four report completion, paste Prompt 5 (Release Integrator) into a final session. Each prompt is self-contained. Do not edit code files by hand while agents are running; route any design question back to the Design Agent chat with a reference to this document.

Prompt 1 — Coding Agent A: Setup Flow, Creator UI & Creation-Path Engine

You are a coding agent working in this workspace:
c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

The design authority is VERSION_0.16.3_DESIGN.md in the workspace root. Open it and read it BEFORE writing any code. It is a reference document: implement only what this prompt explicitly assigns to you, and if anything in it seems ambiguous or conflicts with the code, STOP and report the question to the owner for routing to the Design Agent. Do not improvise design.

YOUR ASSIGNMENT — the following sections of VERSION_0.16.3_DESIGN.md, and nothing else:
- Section 3 (REQ-245): faction population display in the Custom Party Creator + player affiliation voter transfer at game creation.
- Section 4 (REQ-246): custom party deselection and setup choice persistence on the 2028 setup screen.
- Section 6 (REQ-248): 100K founding faction voter model injection and sample unit scaling (two-ledger rule).
- Section 7 (REQ-249): Hare-Niemeyer largest-remainder apportionment with exact 1,000 sample-unit conservation, plus step="100" input snapping.
- Section 9 (REQ-251): state allocation validation modal, launch-button gating, and silent reset prevention.
- Section 21 (REQ-263): "Take the Chair" custom party input selector fix. Per Section 21's consolidation note, merge these listener bindings with REQ-246's into one consistent binding block — do not create duplicate or competing handlers.
- Section 22 (REQ-264): third-party state chapter footprint rebalance using the exact STARTING_3RD_PARTY_CHAPTERS dictionary (do not alter its values).
- Section 23 (REQ-265): custom party zero-infrastructure starting rule.

FILE OWNERSHIP (other agents are working in parallel; respect these boundaries):
- engine.js: the game-creation region (roughly lines 3591–4100: state organizations, allocation guard at ~3915, injection at ~3958, affiliations init at ~4050–4075), plus buildStateChaptersMap and realignVotingBlocksBetweenElections.
- app.js: the 2028 setup screen, customPartyCreatorMarkup, bind(), and the #start-game handler.
- Agent 2 also touches createGame for the 2028 starting-baseline clamp (REQ-259); keep your edits line-local so both changes can coexist.

HARD RULES:
- No new dependencies; vanilla JS in the existing project structure only.
- Do not modify the SAVE_KEY, the save schema, or the game version.
- Player-facing copy shows represented-voter scale population figures only; never expose the internal sample-unit abstraction or requirement IDs in UI text.
- REQ-249's conservation invariant is absolute: the sum of state sample units must equal exactly 1,000 with zero drift for any valid distribution.
- REQ-245's defensive load-time backfill and REQ-248's best-effort backfill share one code path; implement both per their sections.

TESTS — write these scripts under scripts\ and make them pass:
- scripts/test-v0163-faction-transfer.cjs (REQ-245 — all five cases in Section 3.7)
- scripts/test-v0163-setup-persistence.cjs (REQ-246 cases in Section 4.6 plus REQ-263 cases in Section 21.5)
- scripts/test-v0163-founding-injection.cjs (REQ-248)
- scripts/test-v0163-apportionment.cjs (REQ-249)
- scripts/test-v0163-alloc-validation.cjs (REQ-251)
- scripts/test-v0163-chapter-footprint.cjs (REQ-264 totals/dictionary fidelity plus REQ-265 zero start)

WHEN DONE: report which requirements you implemented, the exact files and functions changed, test results for every script above, and any spec question you hit. Do not start the Release Integrator's work (version bump, full regression pass, build.ps1).

Prompt 2 — Coding Agent B: Polling, Ballot Access & National Environment Calibration

You are a coding agent working in this workspace:
c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

The design authority is VERSION_0.16.3_DESIGN.md in the workspace root. Open it and read it BEFORE writing any code. It is a reference document: implement only what this prompt explicitly assigns to you, and if anything in it seems ambiguous or conflicts with the code, STOP and report the question to the owner for routing to the Design Agent. Do not improvise design.

YOUR ASSIGNMENT — the following sections of VERSION_0.16.3_DESIGN.md, and nothing else:
- Section 15 (REQ-257): 2026 Midterm baseline popular vote calibration (exact values given; no other HISTORICAL_ELECTIONS entries may change).
- Section 16 (REQ-258): strict ballot access zero-polling invariant across all four polling paths.
- Section 17 (REQ-259): 2028 starting baseline 3.0% polling ceiling for non-major parties. This is an initialization-time-only clamp: it must NEVER limit a party in later cycles. See Section 17.3 Part 1.
- Section 18 (REQ-260): Socialist Vermont peak and regional geographic calibration.
- Section 19 (REQ-261): House downballot national environment calibration (D+9 generic ballot and district baselines).
- Section 20 (REQ-262): Senate downballot national environment calibration (D+9 state lean baselines and forecaster ratings).

FILE OWNERSHIP (other agents are working in parallel; respect these boundaries):
- engine.js: supportByState, commissionRacePoll, version01CandidateField, reallocateStateHouseSeatCounts, estimateRaceMarginInternal, candidateMargin, buildForecasters, resolveVersion01GeneralElection, calculateDistrictElection, regionalIdeal, plus the 2028 initialization clamp block in createGame.
- scenario-2028.js and factions-0.15.js data/baseline entries referenced by your sections.
- Agent A owns the rest of createGame's creation region; your createGame edit is limited to the baseline ceiling clamp.

HARD RULES:
- REQ-258 is a hard wall: a party without ballot access polls exactly 0.0% in that jurisdiction for that office — but parties WITH access must poll normally (positive regression required), and you must not add any compensating subsidy anywhere.
- REQ-259 must not become a permanent cap. Implement it as a starting-baseline initialization step, never a standing clamp inside the live polling functions.
- REQ-260's regional orderings must compose WITHIN REQ-259 ceilings and REQ-258 walls — the orderings hold among clamped values, they do not override the clamps.
- REQ-261's D+9 generic ballot invariant governs the two-party (Dem/GOP) national aggregate; do not zero out third-party per-race shares to force the aggregate.
- No new dependencies; do not modify the SAVE_KEY, save schema, or game version.

TESTS — write these scripts under scripts\ and make them pass:
- scripts/test-v0163-baseline-calibration.cjs (REQ-257)
- scripts/test-v0163-ballot-access-invariant.cjs (REQ-258 — all five cases including the {} access 51-jurisdiction sweep)
- scripts/test-v0163-baseline-ceilings.cjs (REQ-259 — including the non-permanence case: later-cycle growth above 3.0% must persist unclamped)
- scripts/test-v0163-regional-calibration.cjs (REQ-260 — including composition with REQ-258/259 clamps active)
- scripts/test-v0163-env-house.cjs (REQ-261)
- scripts/test-v0163-env-senate.cjs (REQ-262)

WHEN DONE: report which requirements you implemented, the exact files and functions changed, test results for every script above, and any spec question you hit. Do not start the Release Integrator's work.

Prompt 3 — Coding Agent C: Lifecycle Engine, Action Economy & Careers

You are a coding agent working in this workspace:
c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

The design authority is VERSION_0.16.3_DESIGN.md in the workspace root. Open it and read it BEFORE writing any code. It is a reference document: implement only what this prompt explicitly assigns to you, and if anything in it seems ambiguous or conflicts with the code, STOP and report the question to the owner for routing to the Design Agent. Do not improvise design.

YOUR ASSIGNMENT — the following sections of VERSION_0.16.3_DESIGN.md, and nothing else. REQ-247 is the highest-priority fix in this release (a fatal crash); implement and verify it first.
- Section 5 (REQ-247): fatal custom party cycle transition fix in startNextCycle — const-to-let at line 10405, checkFounderSuccessionTrigger converted to an in-place mutator call (never reassign refreshed), and processOrphanedFactionRehoming returning a clean game state.
- Section 8 (REQ-250): Draft-of-7 redraw pool check and hard ceiling cap. Read Section 8.2's design doctrine: minor parties get NO action subsidies and NO free redraws — repair the check without softening minor-party difficulty in any way.
- Section 10 (REQ-252): statehouse standout persistent ID and milestone continuity in encourageStateRecruit.

FILE OWNERSHIP (other agents are working in parallel; respect these boundaries):
- engine.js, limited to three function areas: startNextCycle (~lines 10405–10544), the redraw validation (~line 11315), and encourageStateRecruit (~line 7935). You do not touch createGame or any polling function.

HARD RULES:
- No new dependencies; do not modify the SAVE_KEY, save schema, or game version.
- REQ-247's invariant: a custom party must cycle smoothly 2028 → 2030 → 2032 → 2034 with no crash and no state corruption; refreshed must remain the game state object at every step.
- REQ-250: redraws validate against (organizingActionsRemaining ?? actionsLeft) with deductions on BOTH counters, and cost caps at Math.min(4, redrawCount + 1).
- REQ-252 is prospective: do not attempt to retro-merge severed records in existing saves.

TESTS — write these scripts under scripts\ and make them pass:
- scripts/test-v0163-cycle-transition.cjs (REQ-247 — no-crash cycle run, mutator conversion, clean rehoming, full 2028→2034 chain)
- scripts/test-v0163-redraw-pool.cjs (REQ-250 — all four cases plus the no-subsidiy doctrine check)
- scripts/test-v0163-standout-id.cjs (REQ-252)

WHEN DONE: report which requirements you implemented, the exact files and functions changed, test results for every script above, and any spec question you hit. Do not start the Release Integrator's work.

Prompt 4 — Coding Agent D: Responsive Layout, Theme Binding & Atmospheric Polish

You are a coding agent working in this workspace:
c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

The design authority is VERSION_0.16.3_DESIGN.md in the workspace root. Open it and read it BEFORE writing any code. It is a reference document: implement only what this prompt explicitly assigns to you, and if anything in it seems ambiguous or conflicts with the code, STOP and report the question to the owner for routing to the Design Agent. Do not improvise design.

YOUR ASSIGNMENT — the following sections of VERSION_0.16.3_DESIGN.md, and nothing else:
- Section 11 (REQ-253): responsive drawers and 50-state scroll trap resolution.
- Section 12 (REQ-254): semantic CSS variable binding for .draft-priority-card, .custom-party-drawer, .succession-modal-panel, and .anchor-crisis-panel.
- Section 13 (REQ-255): targetable opponent stronghold dropdown qualification indicator (>= 55% opponent share).
- Section 14 (REQ-256): succession crisis atmospheric text and trait interpolation.

FILE OWNERSHIP (other agents are working in parallel; respect these boundaries):
- styles.css is fully yours.
- app.js: your edits are confined to the Custom Party drawer's Section 04 markup STRUCTURE (class swap and accordion per REQ-253), the crack-an-opponent-stronghold target selector, and the succession modal rendering. Coding Agent A owns the listeners, input values, and validation logic in the same drawer — keep your drawer edits limited to markup structure lines so both sets of changes coexist.

HARD RULES:
- No new dependencies; do not modify the SAVE_KEY, save schema, or game version.
- REQ-254: the four named classes must bind to var(--panel), var(--panel2), var(--text), var(--line); no hardcoded hex or rgba values may remain in their rules, and both light and dark dashboard modes must render correctly.
- REQ-255 and REQ-256 are player-facing copy: no raw percentages, formula names, or other numeric readouts in the new text — atmospheric narrative language only, per the game's style guide.
- REQ-256 interpolates founderName and active archetype traits into succession option descriptions.

TESTS — write these scripts under scripts\ and make them pass:
- scripts/test-v0163-responsive-drawers.cjs (REQ-253 static checks: grid rules, class replacement, no fixed-height state box, accordion present)
- scripts/test-v0163-theme-bindings.cjs (REQ-254)
- scripts/test-v0163-stronghold-qualifier.cjs (REQ-255, including the no-numeric-copy check)
- scripts/test-v0163-succession-text.cjs (REQ-256)

WHEN DONE: report which requirements you implemented, the exact files and functions changed, test results for every script above, and any spec question you hit. Do not start the Release Integrator's work.

Prompt 5 — Release Integrator

You are the Release Integrator for Version 0.16.3 of Coalition Builder: Party Chair, working in this workspace:
c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

Four coding agents (A: setup/creation path; B: polling and calibration; C: lifecycle/economy/careers; D: visual polish) have implemented the 21 requirements of VERSION_0.16.3_DESIGN.md (REQ-245 through REQ-265). The design authority is VERSION_0.16.3_DESIGN.md in the workspace root. Your job is integration and release only: you implement NO new requirements. If an acceptance criterion in the design document cannot be met, STOP and report it to the owner for routing to the Design Agent — do not ship silently.

INTEGRATION STEPS:
1. Verify every requirement in the design document's Section 2 inventory (REQ-245 – REQ-265) has been implemented. Cross-check each requirement's section in the document against the code.
2. Resolve merged changes in shared files, known edit checkpoints:
   - engine.js (Agents A, B, C): Agent B's 2028 baseline clamp in createGame must coexist with Agent A's creation-region changes; Agent C's three function areas must remain intact.
   - app.js (Agents A, D): Agent D's drawer markup structure changes must coexist with Agent A's listeners and validation logic.
   - scenario-2028.js and factions-0.15.js (Agent B) and styles.css (Agent D).
3. Run the COMPLETE test matrix:
   - All new v0.16.3 scripts: scripts/test-v0163-cycle-transition.cjs, test-v0163-founding-injection.cjs, test-v0163-apportionment.cjs, test-v0163-faction-transfer.cjs, test-v0163-setup-persistence.cjs, test-v0163-redraw-pool.cjs, test-v0163-alloc-validation.cjs, test-v0163-standout-id.cjs, test-v0163-responsive-drawers.cjs, test-v0163-theme-bindings.cjs, test-v0163-stronghold-qualifier.cjs, test-v0163-succession-text.cjs, test-v0163-baseline-calibration.cjs, test-v0163-ballot-access-invariant.cjs, test-v0163-baseline-ceilings.cjs, test-v0163-regional-calibration.cjs, test-v0163-env-house.cjs, test-v0163-env-senate.cjs, test-v0163-chapter-footprint.cjs.
   - Existing regression suites: all test-v0162-*.cjs scripts and test-mas01-phase4.cjs. No regression is acceptable.
4. SAVE_KEY decision: confirm no schema change shipped. The expected key remains partyChairGame.save.v16.2 — the REQ-245/REQ-248 load-time backfills restore values, they do not migrate structure. If you find a genuine schema change, STOP and report before touching the key.
5. Bump the game version string to 0.16.3. ONLY you perform this bump; no coding agent should have touched it.
6. Build: run powershell -ExecutionPolicy Bypass -File .\build.ps1 and confirm a clean build.
7. Report to the owner: full pass/fail matrix for every script, the version bump confirmation, the SAVE_KEY decision, and the rebuilt bundle location. Flag any requirement whose acceptance criteria remain unmet rather than shipping silently.

The owner performs the final smoke test per each requirement's acceptance criteria, and archives REQ-245 – REQ-265 from the workspace DESIGN_BACKLOG.md active queue where logged (never touching TBD items).