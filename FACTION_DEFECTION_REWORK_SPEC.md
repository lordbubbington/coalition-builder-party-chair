# Implementation Specification: National Faction Defection & Two-Step Secession Overhaul

## 1. Executive Summary & Core Objective

In the current game state, factions almost never leave their parent parties because:
1. `evaluateFactionFriction` only processes the player party (`if (f.partyId !== playerPartyId) continue;`), rendering all AI/rival party factions completely immune to dissatisfaction, ultimatums, and defections.
2. Friction accumulation curves require extreme multi-turn conditions (`Happiness < 35` for 2 turns + platform distance `> 4.5`), while touching `Happiness >= 50` during an ultimatum completely cancels it.
3. The Coalition Summit hard-blocks any faction with `Happiness > 30`, while 89% of factions start with baseline happiness well above 30.
4. There are no active player actions to wedge, subvert, or court rival factions.

**Core Design Mandate:** Factions must never jump directly from one party into another. Instead, factions must follow a strict **Two-Step Secession & Admission Pipeline**:
- **Step 1 (Secession to Independent):** Factions alienate from their parent party (via low happiness, platform divergence, legislative betrayals, or external agitation), issue ultimatums, and **bolt into Independent / Unaffiliated status** (`partyId = 'none'`), severing voters and lawmakers into the independent column.
- **Step 2 (Coalition Admission):** Courting parties can begin courtship once a faction's parent party happiness drops `< 50`, but can only sign a **Coalition Accord / Merger** after the faction has become Independent.

---

## 2. Specification Requirements by Size

### Massive Updates (Count: 2)

#### REC-01: Two-Sided National Faction Friction & Dynamic Rival Party Fracturing
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/party-systems-robots.js`
- **Scope & Implementation:**
  1. In `evaluateFactionFriction(game)` (`engine.js`), remove `if (f.partyId !== playerPartyId) continue;`. Expand the loop to evaluate all recognized factions across all parties (`people`, `heritage`, `liberty`, `green`, `constitution`, `socialist`).
  2. For each party, evaluate ideological Euclidean distance between the faction's ideals and the party's platform positions.
  3. Track friction per faction (`frictionIndex`). When rival party factions hit the ultimatum threshold (`frictionIndex >= 75`), flag an ultimatum for that party's AI chair.
  4. In `party-systems-robots.js`, provide AI chairs with a response decision: spend resources/platform shifts to appease, or suffer a faction bolt.
  5. If an ultimatum expires unappeased, invoke `boltFaction(game, f.id)` to sever the faction into Independent status (`partyId = 'none'`).

#### REC-02: Two-Step Secession & Courting Pipeline (Parent Party -> Independent Bolt -> Coalition Admission)
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/app.js`
- **Scope & Implementation:**
  1. **Strict Prohibition on Direct Party Leaping:** A faction currently affiliated with Party A cannot directly execute a merger accord with Party B. It must become Independent (`partyId === 'none'` or `'independent'`) first.
  2. **Stage 1 — Destabilization & Backchannel Courtship (`Parent Happiness < 50`):**
     - When a faction in a rival party drops below 50 Happiness with its parent party, opposing party chairs unlock the **Open Courtship Dialogue** action.
     - Allows spending organizing actions and funds to cultivate ties, establish goodwill toward the courting party, and amplify friction against the parent party.
  3. **Stage 2 — Secession Execution (`Happiness < 30` or Unresolved Ultimatum):**
     - The faction severs ties from its parent party via `boltFaction`.
     - `f.partyId` transitions to `'none'`.
     - Faction voters in `voterModel.states` move into `affiliations.independent`.
     - Associated sitting lawmakers and candidates switch to Independent status.
  4. **Stage 3 — Coalition Summit & Merger (`Faction is Independent`):**
     - Only once `f.partyId === 'none'` (or `'independent'`) can any party convene the formal **Coalition Summit Accord**.
     - Requires that the faction's affinity/standing with the courting party meets the merger threshold.
     - Executes slider concessions and candidate filtering pacts, then moves 100% of faction voters from `independent` into the adopting party's rolls.

---

### Huge Updates (Count: 2)

#### REC-03: Active Chair Organizing Actions for Opposition Subversion & Wedge Operations
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/app.js`
- **Scope & Implementation:**
  1. Add new dispatchable actions in `engine.js` and render interactive controls in the Organizing Phase UI:
     - `drive-coalition-wedge` (Cost: 1 Action, $2.0M): Target an opposition faction with parent Happiness `< 60`. Imposes `−10` Happiness toward their parent party and adds `+20` to their Friction Index.
     - `subsidize-dissident-caucus` (Cost: 1 Action, $3.0M): Funds rebellious messaging within a rival party, accelerating an active ultimatum countdown by 1 turn.
     - `court-independent-faction` (Cost: 1 Action, $1.5M): Target an already bolted / Independent faction. Increases goodwill toward the player's party by `+15` points, paving the way for a Summit Accord.

#### REC-04: Primary Defeat & Convention Platform Revolt Defections
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/presidential-primaries.js`
- **Scope & Implementation:**
  1. In presidential convention resolution (`presidential-primaries.js`), check if a faction's favored candidate lost the nomination and their platform plank was rejected.
  2. Apply an immediate `−20` to `−30` Happiness shock to the defeated faction.
  3. If the faction's happiness falls `< 30` or friction hits `75`, trigger an immediate convention walkout: the faction bolts into Independent status before the general campaign begins.

---

### Large Updates (Count: 2)

#### REC-05: Legislative & Executive Betrayal Triggers (Red Line Bills)
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/data.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
- **Scope & Implementation:**
  1. In `FACTIONS_CATALOG` (`factions-0.15.js` / `data.js`), assign each faction 1–2 `redLineIssues` or `redLineBills`.
  2. In `engine.js` during bill voting resolution, if a party's chamber majority or president votes for/signs a bill crossing that red line, apply `−25` Happiness and `+35` Friction to that faction.
  3. Crossing two red lines within a single cycle triggers an instant walkout bolt to Independent status.

#### REC-06: Intra-Party Purge / Voluntary Faction Expulsion Action
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/app.js`
- **Scope & Implementation:**
  1. Add a dedicated chair action `expel-faction` (Cost: 1 Action, requires party leadership approval).
  2. Allows a party chair to intentionally sever ties with an extremist or high-friction wing.
  3. Immediately removes the faction from the party, eliminates all associated cohabitation turnout drag, and moves the faction into Independent status (`partyId = 'none'`).

---

### Medium Updates (Count: 3)

#### REC-07: Acceleration & Rebalancing of Friction Index Accumulation
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
- **Scope & Implementation:**
  1. Update `evaluateFactionFriction`:
     - Low happiness friction triggers earlier: `Happiness < 45` adds `+15` friction/turn; `Happiness < 35` adds `+30` friction/turn.
     - Platform distance threshold reduced from `4.5` to `3.2` Euclidean points.
     - Ultimatum trigger threshold reduced from `100` friction down to `75` friction.
     - Remediation floor raised: require `Happiness >= 60` (up from `50`) to avert an ultimatum.

#### REC-08: Electoral Disaster & "Wilderness" Exodus Defections
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
- **Scope & Implementation:**
  1. Expand federal lockout / control loss penalties in `startNextCycleInternal` to apply to AI parties as well.
  2. If a party loses full federal control (House, Senate, Presidency) in a single cycle, non-anchor factions suffer an "Exodus Shock" (`−15` Happiness, `−20` Confidence).
  3. Factions dropping below `25` Confidence have a 35% chance to immediately bolt to Independent status.

#### REC-09: Campaign Resource Starvation Defection Triggers
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/campaign-overhaul.js`
- **Scope & Implementation:**
  1. Track campaign budget distribution per faction during the general election.
  2. If a faction's nominated candidates in competitive battleground races receive $0 funding throughout the campaign, apply a `+25` Neglect Friction penalty at cycle transition.

---

### Small Updates (Count: 2)

#### REC-10: Alignment of UI Summit Gate with Two-Step Courting/Merger Engine
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/app.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
- **Scope & Implementation:**
  1. Align `app.js` faction card buttons with the two-step architecture:
     - For factions in rival parties with `Parent Happiness < 50`: Show button **"🤝 Open Courtship Dialogue (1 Action)"**.
     - For factions that are Independent (`partyId === 'none'` or `'independent'`): Show button **"🏛️ Convene Coalition Summit (1 Action)"**.
     - For factions in rival parties with `Parent Happiness >= 50`: Button is disabled with tooltip: *"Loyal to parent party (Happiness >= 50). Must be destabilized or alienated first."*
  2. Update `checkSummitEligibility` in `engine.js` to strictly enforce:
     - `if (f.partyId !== 'none' && f.partyId !== 'independent') return { eligible: false, reason: 'Faction must secede from its parent party and become Independent before a Coalition Accord can be signed.' };`

#### REC-11: Dynamic Faction Defection Catalysts in Campaign & Inter-Cycle Events
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/data.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
- **Scope & Implementation:**
  1. Add 6 new crisis events to `EVENTS` in `data.js`:
     - `event_union_strike_bolt`: Industrial union faction threatens independent bolt over trade concessions.
     - `event_suburban_moderates_revolt`: Suburban wing threatens walkout over radical candidate rhetoric.
     - `event_evangelical_boycott`: Social conservatives threaten independent ticket unless platform plank reaffirmed.
     - `event_green_left_walkout`: Eco-socialists revolt over energy compromise.
     - `event_libertarian_secession`: Market purists bolt over federal debt expansion.
     - `event_civil_rights_ultimatum`: Minority rights coalition issues secession ultimatum over voting rights compromise.

---

### Tiny Updates (Count: 1)

#### REC-12: Unaffiliated / Independent Faction Active Coalition Bidding Dynamic
- **Target Files:**
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/engine.js`
  - `c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/app.js`
- **Scope & Implementation:**
  1. When a faction has bolted and sits in Independent status (`partyId === 'none'`), display a distinct **"⚡ Actively Courting Coalitions"** status tag.
  2. At the start of each Organizing Phase, calculate ideological affinity toward each party; the faction grants a `+5` starting courtship bonus to the party closest on social/economic sliders.

---

## 3. Implementation Verification & Test Plan

1. **Unit & Integration Tests (`scripts/test-*.cjs`):**
   - Verify that rival factions accumulate friction and can bolt to `partyId === 'none'`.
   - Verify that a faction in a rival party cannot sign a Summit Accord directly without first becoming Independent.
   - Verify that courtship dialogue unlocks when a rival faction's parent happiness is `< 50`.
   - Verify that Independent factions can successfully sign Summit Accords and integrate into player/AI party rolls.
2. **UI & State Validation:**
   - Confirm button states in `app.js` match the exact conditions (Courtship Dialogue `< 50`, Disabled `≥ 50`, Coalition Summit only when Independent).
   - Ensure `voterModel.states` properly move voters into `independent` on bolting and into the new party on merger.
