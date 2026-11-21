# Coalition Builder: Party Chair — Version 0.15.2 Design Specification

> **Build Type:** Minor Version (`0.0.x`)  
> **Target Version:** Version 0.15.2  
> **Status:** Packaged for Coding Agent Implementation  
> **Features Covered:** `REQ-153` through `REQ-161` (9 Features: 4 Small, 5 Tiny)

---

## 1. Executive Summary & Inventory Matrix

Version 0.15.2 refines coalition and faction mechanics, aligns politician career dynamics directly with party factions, overhauls the Party Focus priorities loop, and cleans up remaining UI verification artifacts.

| Req ID | Title | Size | Target Files | Summary & Key Invariants |
| :--- | :--- | :---: | :--- | :--- |
| **REQ-153** | Faction Recruitment Happiness Threshold | Small | `engine.js`, `app.js` | Factions can only be recruited via Coalition Summit if internal Happiness $\le 30$. Upon signing the accord: $+30$ Confidence (clamped to 100) and Happiness is set to 65. |
| **REQ-154** | Government Control Loss & Federal Lockout Penalties | Small | `engine.js` | Control loss drains Happiness: State Leg ($-1$/state), House ($-10$), Senate ($-10$), Pres ($-12$); leading factions lose half. Major party starting & finishing an election with 0 of 3 federal branches loses $-15$ Confidence AND $-15$ Happiness across all factions. |
| **REQ-155** | Lock In Party Focuses Action & Immediate Bonus Grant | Small | `engine.js`, `app.js` | Focuses do not grant bonuses until locked in. Add `[ Lock In Party Focuses ]` button that commits targets for the cycle and immediately grants bonuses (+5,000 state voters, +500 regional voters, base issue loyalty). Slots lock for the cycle. |
| **REQ-156** | Party Focus Slot Capacity Scaling by Tier | Tiny | `app.js`, `engine.js` | Major parties receive **7 Party Focus slots**; minor/third parties receive **3 Party Focus slots** (replacing flat 10). |
| **REQ-157** | Dynamic Faction Leaders (Major Factions Only) | Tiny | `app.js`, `v07-scaffolding.js` | Leadership Category B slots dynamically reflect actual party factions, restricted to Major factions ($\ge 2.5\text{M}$ voters), yielding 7 for Democrats and 7 for Republicans. Appointing a leader grants **+3 Confidence** to that faction. |
| **REQ-158** | Primary Filtering Support Modifies Happiness | Tiny | `engine.js`, `app.js` | Filtering primary support delivers +10 pt primary swing, awarding **+1 Happiness** to candidate's faction and **-3 Happiness** to all rival party factions. Confidence is unaffected. |
| **REQ-159** | Politician Factions & Dynamic Happiness Coupling | Small | `data.js`, `engine.js` | All 605 politicians assigned to 1 faction by public perception. If a faction leaves the party, its politicians defect with them. Politician starting happiness equals faction happiness and co-moves with faction deltas, while drifting apart through personal chair treatment (filtering $+10$, ad spend up to $+15$, appointments $+15$). |
| **REQ-160** | Remove Verification Checkmark Badge from Factions Header | Tiny | `app.js` | Remove `<span class="v15-cert-badge">✔ Zero-Variance 155M Voter Model Verified</span>` from the top header in `factionsTabMarkup()`. |
| **REQ-161** | Swap National Tug-of-War Momentum Gauge Orientation | Tiny | `app.js`, `v07-scaffolding.js` | Reverse horizontal orientation of the ±20 national environment gauge: Democrats on Left (Blue), Republicans on Right (Red). |

---

## 2. Detailed Technical & Architectural Specifications

### Subsystem A: Faction Recruitment Happiness Threshold (`REQ-153`)
1. **Recruitment Eligibility Check:**
   - In `engine.js` (inside `checkSummitEligibility(game, factionId)` or summit action handler):
     ```javascript
     if ((faction.happiness || 50) > 30) {
       return { eligible: false, reason: "The faction is satisfied with its current independent course (Happiness > 30) and refuses merger talks." };
     }
     ```
2. **Post-Join Acclimation:**
   - When a faction signs a Coalition Accord and joins the party:
     - `faction.confidence = Math.min(100, (faction.confidence || 50) + 30);`
     - `faction.happiness = 65;`

---

### Subsystem B: Government Control Loss & Federal Lockout Penalties (`REQ-154`)
1. **Inter-Cycle Evaluation in `startNextCycle()` (`engine.js`):**
   - Track prior cycle federal & state control: `game.lastCycleControl = { house: bool, senate: bool, pres: bool, stateLegWins: { [partyId]: count } }`.
   - On election night resolution:
     - Calculate losses:
       - Flipped state legislative chambers: $-1$ Happiness per state lost (leading faction: $-0.5$).
       - House majority flipped to rival: $-10$ Happiness (leading faction: $-5$).
       - Senate majority flipped to rival: $-10$ Happiness (leading faction: $-5$).
       - Presidency lost: $-12$ Happiness (leading faction: $-6$).
2. **Total Federal Lockout ("In the Wilderness"):**
   - If party is a Major Party (`party.isMajor` or `['people', 'heritage'].includes(partyId)`):
     - `const enteredWithZero = !prevHouse && !prevSenate && !prevPres;`
     - `const exitedWithZero = !newHouse && !newSenate && !newPres;`
     - If `enteredWithZero && exitedWithZero`:
       ```javascript
       partyFactions.forEach(f => {
         f.confidence = Math.max(1, (f.confidence || 50) - 15);
         f.happiness = Math.max(1, (f.happiness || 65) - 15);
       });
       ```

---

### Subsystem C: Party Focus Capacity & Lock-In Action (`REQ-155`, `REQ-156`)
1. **Tier-Scaled Slot Capacity:**
   - In `app.js` (`step2PrioritiesMarkup`) and `engine.js`:
     ```javascript
     const isMajor = V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(playerIdentity());
     const maxFocusSlots = isMajor ? 7 : 3;
     ```
   - Renders 7 slots for Major parties and 3 slots for Minor parties.
2. **Staged Selection & Lock-In Button:**
   - Focus dropdown selections stage into `game.priorities.additional`, but do NOT apply bonuses while `!game.focusesLocked`.
   - Render button in Tier 2 header: `[ Lock In Party Focuses ]` (active when $\ge 1$ slot assigned and `!game.focusesLocked`).
   - Clicking button:
     - Sets `game.focusesLocked = true`.
     - Immediately executes bonuses:
       - State targets: $+5,000$ registered party voters in target state.
       - Regional targets: $+500$ registered party voters per state across that region.
       - Issue targets: platform alignment and base voter loyalty boost.
     - Disables dropdowns for the remainder of the 2-year cycle.
     - Resets `game.focusesLocked = false` on cycle boundary (`startNextCycle`).

---

### Subsystem D: Dynamic Faction Leaders & Category B Alignment (`REQ-157`)
1. **Major Factions Entitlement:**
   - In `v07-scaffolding.js` and `app.js`: Category B leadership roles are generated dynamically from party factions with $\ge 2,500,000$ voters (Major and Leading factions).
   - Baseline setup generates exactly 7 leaders for Democrats and 7 for Republicans.
2. **Appointment Rules:**
   - Dropdown options strictly filter to politicians who have `cand.factionId === role.factionId`.
   - Appointing a politician to any leadership position awards **+3 Confidence** to their aligned faction (`faction.confidence = Math.min(100, faction.confidence + 3)`).

---

### Subsystem E: Primary Filtering Metric Shift (`REQ-158`)
1. **Filtering Action Execution:**
   - In `engine.js` / `app.js` (`filterPrimarySupport`):
     - Endorsing candidate applies $+10$ point primary polling swing.
     - **Happiness Impact:**
       - Candidate's aligned faction: `candFaction.happiness = Math.min(100, (candFaction.happiness || 65) + 1);`
       - All other party factions: `otherFaction.happiness = Math.max(0, (otherFaction.happiness || 65) - 3);`
     - **Confidence Impact:** Unaffected (no change to confidence).

---

### Subsystem F: Politician Factions & Dynamic Happiness Coupling (`REQ-159`)
1. **100% Politician Faction Assignment:**
   - Ensure every politician record in `data.js` / `game.politicians` has a valid `factionId` mapping to one of the party's constituent factions based on public perception.
2. **Synchronized Co-Movement:**
   - When faction happiness changes by $\Delta H_{\text{faction}}$:
     ```javascript
     game.politicians.filter(p => p.factionId === faction.id).forEach(p => {
       p.happiness = Math.max(0, Math.min(100, (p.happiness || faction.happiness) + deltaH));
     });
     ```
3. **Personal Drift:**
   - Primary Filtering Support: $+10$ individual happiness for the backed candidate, $-5$ for unbacked primary rivals.
   - Candidate Ad Spend Triage: $+1.0$ individual happiness per \$1M allocated (up to $+15$).
   - Leadership & Rising Star appointments: $+15$ individual happiness.
4. **Faction Defection:**
   - If a faction bolts or leaves the party, all member politicians leave the party, vacate leadership roles and cabinet posts, and their seats flip to Independent or the faction's new ballot line.

---

### Subsystem G: Remove Verification Badge from Factions Header (`REQ-160`)
1. In `app.js` (`factionsTabMarkup`):
   - Delete line 5294: `<span class="v15-cert-badge">✔ Zero-Variance 155M Voter Model Verified</span>`.
   - The header cleanly renders the eyebrow and title without the green test badge.

---

### Subsystem H: Swap National Momentum Gauge Orientation (`REQ-161`)
1. In `app.js` / `v07-scaffolding.js` (inside the wave gauge rendering routine):
   - **Swap Bar Gradients & Endpoints:**
     - Left gradient pole: **Democrats (Blue)**, indicating Dem Landslide (+20) and Dem Wave (+10).
     - Center notch: **Even (0)**.
     - Right gradient pole: **Republicans (Red)**, indicating GOP Wave (-10) and GOP Landslide (-20).
   - **Needle Position Mapping:**
     - Recalculate needle offset so positive Democratic momentum shifts the indicator to the left, and Republican momentum shifts the indicator to the right:
       $$\text{needlePercent} = 50 - \left(\frac{\text{nationalEnvironment}}{20} \times 50\right)$$
   - **Label Reorientation:**
     - Left labels: `◀ Dem Landslide (+20)` ... `Dem Wave (+10)`
     - Center label: `Even (0)`
     - Right labels: `GOP Wave (-10)` ... `GOP Landslide (-20) ▶`

---

## 3. Verification & Acceptance Criteria
1. `npm test` passes 100%.
2. `node build.js` compiles clean Windows executable binary with code 0.
3. Verification badge is gone from the Factions Tab header.
4. National Tug-of-War Momentum gauge displays Democrats (Blue) on the Left and Republicans (Red) on the Right.
5. Major parties show 7 focus slots; minor parties show 3 focus slots.
6. Focusing button properly commits bonuses on lock-in.
7. Filtering primary candidates moves happiness (+1 / -3), not confidence.
8. Politicians hold faction IDs, co-move with faction happiness, and defect if their faction exits.
