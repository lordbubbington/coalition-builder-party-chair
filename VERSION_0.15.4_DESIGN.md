# Coalition Builder: Party Chair — Version 0.15.4 Design Specification

> **Build Type:** Minor Version (`0.0.x`)  
> **Target Version:** Version 0.15.4  
> **Status:** Packaged for Coding Agent Implementation  
> **Features Covered:** `REQ-171` (1 Feature: 1 Small)

---

## 1. Executive Summary & Inventory Matrix

Version 0.15.4 establishes the simulation engine's automated faction-to-party inheritance invariant, guaranteeing that all individual politicians across the entire 600+ character database remain in strict synchronization with their faction's partisan allegiance at the close of every operational phase.

| Req ID | Title | Size | Target Files | Summary & Key Invariants |
| :--- | :--- | :---: | :--- | :--- |
| **REQ-171** | Phase-End Faction-to-Party Inheritance Verification | Small | `engine.js` | Systematic phase-end sweep across all politicians (sitting members, roster, candidates): if their faction belongs to a party, they belong to that party; if their faction is outside all parties, they become Independent. Evaluated at every phase transition. |

---

## 2. Detailed Technical & Architectural Specifications

### Subsystem: Phase-End Faction-to-Party Inheritance (`REQ-171`)

#### 1. Core Alignment Logic (`engine.js`)
Create a dedicated reconciliation helper in `engine.js`:
```javascript
function synchronizePoliticianPartyWithFaction(game) {
  if (!game) return game;
  const catalog = getFactionsCatalog ? getFactionsCatalog() : [];
  const partyFactions = game.partyFactions || {};

  const resolveFactionParty = (factionId) => {
    if (!factionId) return null;
    const fObj = catalog.find((f) => f.id === factionId) || (game.factions || []).find((f) => f.id === factionId);
    if (!fObj) return null;
    // Check if faction is affiliated with a recognized party
    if (fObj.partyId && fObj.partyId !== 'independent' && fObj.partyId !== 'unaffiliated') {
      return fObj.partyId;
    }
    return 'independent';
  };

  const updateMember = (m) => {
    if (!m || !m.factionId) return m;
    const targetParty = resolveFactionParty(m.factionId);
    if (!targetParty) return m;
    if (m.party !== targetParty) {
      return {
        ...m,
        party: targetParty,
        // If flipping to independent or new party, clear obsolete caucus flags unless explicitly caucusing
        isIndependent: targetParty === 'independent',
      };
    }
    return m;
  };

  // Synchronize across all politician collections in game state
  const nextSitting = (game.sittingMembers || []).map(updateMember);
  const nextRoster = (game.rosterMembers || []).map(updateMember);
  const nextCandidates = (game.candidates || []).map(updateMember);

  return {
    ...game,
    sittingMembers: nextSitting,
    rosterMembers: nextRoster,
    candidates: nextCandidates,
  };
}
```

#### 2. Phase-End Integration Points
Invoke `synchronizePoliticianPartyWithFaction(game)` at the completion of each phase transition in `engine.js`:
1. **End of Phase 1:** Inside `advanceToPrimaries(game)` or when transitioning from organizing to primaries.
2. **End of Phase 2:** Inside `resolvePrimaries(game)` when advancing to the general campaign.
3. **End of Phase 3:** Inside `advanceToElectionNight(game)` before election calculations run.
4. **End of Phase 4:** Inside `startNextCycle(game)` during inter-cycle turnover and realignment.

#### 3. Cascading Defection Handling
- When a faction departs, bolts (`REQ-30`), or joins a new party via a Coalition Accord (`SUM-02`), this sweep ensures that all affiliated politicians (candidates, leaders, and sitting officials) automatically inherit their faction's new party label without manual state mutation.

---

## 3. Implementation Checklist for Coding Agent

- [ ] **Step 1: Implement Helper Function in `engine.js`**
  - [ ] Implement `synchronizePoliticianPartyWithFaction(game)` to resolve `faction.partyId` and align `politician.party`.
- [ ] **Step 2: Hook into Phase Transitions**
  - [ ] Hook phase-end sweep into Phase 1 exit (Organizing $\to$ Primaries).
  - [ ] Hook phase-end sweep into Phase 2 exit (Primaries $\to$ General Campaign).
  - [ ] Hook phase-end sweep into Phase 3 exit (Campaign $\to$ Election Night).
  - [ ] Hook phase-end sweep into Phase 4 exit (`startNextCycle` inter-cycle turnover).
- [ ] **Step 3: Verification & Executable Build**
  - [ ] Run `node build.js` and verify that `dist/release/Coalition Builder - Party Chair.exe` builds cleanly with code 0.
