# Version 0.14.6 Design Specification & Implementation Handoff

**Build Target:** Version 0.14.6  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *State-by-State Electorate Realignment, Targeted Inter-Party Ideological Transfers, and Dynamic GOTV Voter Registration Growth*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Compatibility:** `partyChairGame.save.v14.6` (Fully backward-compatible with `v14.5`, `v14.4`, `v14.3`, `v14.2`, `v14.1`, `v14` through `v1`)  
**Design Status:** DESIGN SPECIFICATION ONLY. **DO NOT IMPLEMENT IN THIS CONVERSATION.**  
**Handoff Prompt:** See Section 4 for the complete, copy-pastable prompt for the coding agent.

---

## 1. Executive Summary & Inventory of Changes

Version 0.14.6 packages **3 core Small features and simulation engine overhauls** resolving third-party voter stagnation and overhauling electorate demographics:

| # | Req ID | Feature Title | Tier | Target File(s) | Summary |
| :-: | :---: | :--- | :---: | :--- | :--- |
| **1** | **REQ-143 / BUG-07** | Targeted Inter-Party Realignment Transfers | **Small** | `engine.js` | Directs post-election voter shifts into/out of specific ideological partner parties (Greens/Socialists $\longleftrightarrow$ Democrats; Libertarians/Constitution $\longleftrightarrow$ Republicans) rather than dumping into generic independents. |
| **2** | **REQ-144** | State-by-State Electorate Realignment Engine | **Small** | `engine.js` | Computes the 1/4th Shift Rule independently across all 50 states (+ DC), allowing minor parties to concentrate resources in specific states and build persistent state brands/strongholds over consecutive cycles. |
| **3** | **REQ-145** | Dynamic GOTV Registration Growth Engine | **Small** | `engine.js` | Eliminates the legacy flat 3% annual (+6.09% biennial) automatic growth rate; voter registration expansion is driven dynamically by Get Out The Vote (GOTV) and field operations, adding to the total voter pie without cannibalizing rival parties. |

---

## 2. Technical Subsystem Specifications

### Subsystem A: Targeted Inter-Party Realignment Transfers (`REQ-143` / `BUG-07`)

#### 1. Problem & Root Cause (`engine.js`)
- In `realignVotingBlocksBetweenElections(game, outcome)`:
  - All net party shifts (`totalPartyDelta`) were absorbed into or drawn from `independentVoters` (`newIndependentVoters = Math.max(1_000_000, independentVoters - totalPartyDelta)`).
  - Minor party popular vote totals in `actualVotes` defaulted to static/hardcoded baselines when playing as third parties.
  - As a result, third parties (such as the Greens) did not actively take voters from their ideological rivals (Democrats) when overperforming, leaving party rosters disconnected from election night results.

#### 2. Ideological Realignment Partner Matrix (`engine.js`)
- Define the direct transfer mapping for every party:
  ```javascript
  const REALIGNMENT_PARTNERS = {
    green: 'people',        // Greens trade voters directly with Democrats
    socialist: 'people',    // Socialists trade voters directly with Democrats
    liberty: 'heritage',    // Libertarians trade voters directly with Republicans
    constitution: 'heritage', // Constitution trades voters directly with Republicans
    people: 'heritage',     // Democrats trade swing voters with Republicans (and balance with Greens/Socialists)
    heritage: 'people',     // Republicans trade swing voters with Democrats (and balance with Libertarians/Constitution)
  };
  ```
- When a party gains $+\Delta V$ voters, those voters are deducted directly from its designated ideological partner party. When it loses $-\Delta V$ voters, they return directly to that partner party.
- Custom parties automatically pair with their chosen base template archetype (`game.player.baseTemplateId || 'people'`).

---

### Subsystem B: State-by-State Electorate Realignment Engine (`REQ-144`)

#### 1. Per-State 1/4th Shift Calculation (`engine.js`)
- In `realignVotingBlocksBetweenElections(game, outcome)` in `engine.js`, replace the single national aggregate calculation with a state-by-state execution loop across `voterModel.states`:
  ```javascript
  voterModel.states.forEach((state) => {
    const stateId = state.stateId;
    const stVoters = state.representedVoters || (state.sampleVoters * 100) || 3_000_000;
    const stAff = state.affiliations || {};
    
    // 1. Calculate non-independent partisan voters in this state
    const stPartisans = Object.keys(stAff).reduce((sum, pid) => pid !== 'independent' ? sum + (stAff[pid] || 0) : sum, 0);
    
    // 2. Iterate each tracked party
    trackedParties.forEach(({ id }) => {
      const curPartySample = stAff[id] || 0;
      const expectedShare = stPartisans > 0 ? (curPartySample / stPartisans) * 100 : 2.0;
      
      // Actual share won in this specific state (presidential, senate, governor, or legislative)
      const actualShare = getActualStateVoteShare(outcome, stateId, id, expectedShare);
      const diff = actualShare - expectedShare;
      
      // 1/4th Shift Rule applied locally
      const shiftShare = diff * 0.25;
      const sampleDelta = Math.round(((shiftShare / 100) * stVoters) / 100);
      
      if (sampleDelta !== 0) {
        const partnerId = REALIGNMENT_PARTNERS[id] || 'people';
        const partnerSample = stAff[partnerId] || 0;
        const clampedDelta = sampleDelta > 0 
          ? Math.min(sampleDelta, Math.max(0, partnerSample - 10)) 
          : -Math.min(Math.abs(sampleDelta), Math.max(0, curPartySample - 10));
          
        stAff[id] = Math.max(10, (stAff[id] || 0) + clampedDelta);
        stAff[partnerId] = Math.max(10, (stAff[partnerId] || 0) - clampedDelta);
      }
    });
    state.affiliations = stAff;
  });
  ```

#### 2. Persistent State Brand Building
- Local gains persist in `voterModel.states` across cycles.
- Third parties concentrating candidate funding, surrogate tours, and Volunteer Drives in a single state (e.g. Maine, Oregon, Vermont, New Hampshire) consistently overperform their state baseline, building authentic double-digit regional strongholds over time.
- Reconcile national affiliation totals (`voterModel.affiliations`) by summing all state records:
  $$\text{NationalAffiliation}_{pid} = \sum_{s \in \text{states}} \text{state.affiliations}_{s, pid} \times 100$$

---

### Subsystem C: Dynamic GOTV Registration Growth Engine (`REQ-145`)

#### 1. Removal of Flat Electorate Growth Rate (`engine.js`)
- In `engine.js` line 5002 (`advanceCycle` / `startNextCycle`):
  - **Delete** the legacy $+6.09\%$ automatic flat expansion logic:
    ```javascript
    // REMOVE THIS LEGACY FLAT MULTIPLIER:
    // const stGrowth = Math.round((st.representedVoters || 0) * 0.0609);
    // st.representedVoters = (st.representedVoters || 0) + stGrowth;
    ```
  - Electorates no longer passively expand automatically on every cycle transition.

#### 2. GOTV Operations Drive Total Registration Growth (`engine.js` & `app.js`)
- Get Out The Vote (GOTV) and field operations—specifically the Campaign Phase **Volunteer Drive** (`REQ-142`) and Recruitment Phase field actions—serve as the **primary mechanism for total voter registration growth**.
- When a GOTV operation is conducted:
  ```javascript
  function applyGOTVRegistrationGain(voterModel, stateId, newVotersCount, partyId) {
    const st = voterModel.states.find((s) => s.stateId === stateId);
    if (!st) return;
    const sampleGain = Math.round(newVotersCount / 100);
    
    // Expands total pie of registered & represented voters in that state
    st.cvap = (st.cvap || 0) + newVotersCount;
    st.representedVoters = (st.representedVoters || 0) + newVotersCount;
    st.registeredVoters = (st.registeredVoters || 0) + newVotersCount;
    st.sampleVoters = (st.sampleVoters || 0) + sampleGain;
    
    // Enrolls directly into the acting party's rolls WITHOUT taking from rivals
    st.affiliations[partyId] = (st.affiliations[partyId] || 0) + sampleGain;
    
    // Reconcile national voterModel totals
    voterModel.representedVoters = (voterModel.representedVoters || 0) + newVotersCount;
    voterModel.sampleVoters = (voterModel.sampleVoters || 0) + sampleGain;
    if (voterModel.affiliations[partyId]) {
      voterModel.affiliations[partyId].representedVoters += newVotersCount;
      voterModel.affiliations[partyId].sampleVoters += sampleGain;
    }
  }
  ```
- **Difference from Realignment:** Realignment reallocates existing voters between parties; GOTV expands the total electorate pie by enrolling new voters into the party's base.

---

## 3. Automated Test Verification Suite

Create `scripts/test-v0146-integration.cjs` asserting:
1. **Targeted Inter-Party Realignment:** When Greens gain voters in post-election realignment, voters are deducted from Democrats and credited to Greens.
2. **State-by-State Realignment:** Overperforming in Oregon increases Green voter affiliation in Oregon while leaving other states unaffected.
3. **Flat Growth Removal:** Cycling years from 2028 to 2030 does not automatically add a $+6.09\%$ flat population increase without GOTV actions.
4. **GOTV Total Expansion:** Executing a Volunteer Drive in Wisconsin increases total registered voters in Wisconsin without reducing Democratic or Republican voter counts.
5. **National Accounting Balance:** Sum of all state-level represented voters matches `voterModel.representedVoters`.

---

## 4. Coding Agent Implementation Handoff Prompt

```markdown
You are implementing Version 0.14.6 for Coalition Builder: Party Chair.
Follow the complete technical specification in VERSION_0.14.6_DESIGN.md.

Key tasks:
1. Targeted Inter-Party Realignment Transfers (REQ-143 / BUG-07):
   - In engine.js realignVotingBlocksBetweenElections(), configure REALIGNMENT_PARTNERS so third parties transfer voters directly to/from their ideological counterparts (Greens/Socialists <-> Democrats; Libertarians/Constitution <-> Republicans) rather than dumping into generic independents.
   - Accurately compute actual popular vote share when playing as minor parties.

2. State-by-State Electorate Realignment Engine (REQ-144):
   - Iterate through each state in voterModel.states to calculate expected share, actual vote share, and 1/4th shift deltas locally.
   - Persist state-level affiliations so third parties can build localized regional strongholds across cycles.
   - Reconcile national affiliations to match the sum of all state records.

3. Dynamic GOTV Voter Registration Growth (REQ-145):
   - In engine.js startNextCycle/advanceCycle, remove the hardcoded +6.09% flat growth rate.
   - Wire Volunteer Drive (REQ-142) and field organizing to expand total state registered voters and credit the acting party without cannibalizing rival parties.

4. Verification:
   - Create scripts/test-v0146-integration.cjs asserting all 5 subsystem tests.
   - Run tests and compile executable via ./build.ps1.
```
