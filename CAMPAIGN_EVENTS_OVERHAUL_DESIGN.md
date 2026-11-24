# Coalition Builder: Party Chair — Campaign Events Overhaul Design Specification

**Status:** Implementation-Ready Design Specification (targeting `v0.18.5+` on top of `main` `a59a8ba`)

**Architecture Target:** New standalone module `campaign-events-system.js` (`window.CampaignEventsSystem` + `module.exports`) with minimal surgical hooks (`// [v0.18.5 CAMPAIGN-EVENTS]`) in `engine.js`, `campaign-overhaul.js`, `app.js`, `index.html`, and `build.ps1`. Zero `Math.random()` calls — 100% deterministic seeded FNV-1a hashing.

**Scope Summary:** Replaces the legacy 4-event standard campaign loop and uniform 3-button crisis boilerplate with a **157-event** dynamic, tier-aware, multi-month narrative engine featuring tailored asymmetric dilemmas, cross-system hooks, a **1/3 voter-registration choice guarantee** across Tiers 1–4 (with realistic probabilistic outcomes), Rival Chair news-cycle counterplay, a Breaking News Desk UI, and one ultra-rare **all-tier generational windfall event** awarding **+10,000 registered voters in 10 seeded states**.

## 1. Diagnosis of Current Bottlenecks

| Current Bottleneck | Location in Codebase | Player-Facing Symptom | 
| ----- | ----- | ----- | 
| **Tiny standard pool** | `data.js` (`EVENTS`, lines 670–807) | Only 4 generic campaign events recycle across 40+ years; 6 others are hardcoded DNC/GOP walkouts referencing dead v0.1 faction buckets (`localists`, `pragmatists`, `reformers`, `workers`). | 
| **Boilerplate crisis choices** | `campaign-overhaul.js` (`buildCrisisChoices`) | All 30+ trait crises share the exact same 3 positive or 3 negative buttons regardless of headline. | 
| **Over-dampened impact** | `engine.js` (`applyCampaignEventChoice`) | Trust deltas are multiplied by `0.1x` (`+4` becomes `+0.4`), and effects expire after a single month with zero follow-up memory. | 
| **Zero context awareness** | `engine.js` & `campaign-overhaul.js` | Events ignore Party Tier (0–5), active Campaign Theme, closest battleground states, active Media/Economic Shocks, and live 37-faction IDs. | 
| **Passive presentation** | `app.js` & `engine.js:14117` | Events sit buried on a tall scrolling dashboard and silently auto-resolve Choice 0 if the player clicks Advance Month. | 

## 2. Core Architecture & Data Schema

### 2.1 Standalone Module & State Schema

All event definitions, selection logic, multi-month arc state machines, voter-registration resolution, rival reactions, and Breaking News modal markup live in `campaign-events-system.js`. Backward-compatible defaults are hydrated in `normalizeGame()` and preserved in `compactGameForSave()`:

```
game.campaignEvents = {
  history: [],              // Capped at 60 entries: { year, month, eventId, title, choiceId, outcomeTag, keyStates, summary }
  firedEventIds: [],        // Recently fired IDs (cooldown of 6 cycles before repeat)
  activeArcs: [],           // Multi-month chains: { arcId, currentBeat, maxBeats, stateId, factionId, flags, nextMonth }
  pendingEvent: null,       // Active event requiring player decision before advancing month
  jackpotTriggered: false,  // Ensures ultra-rare generational windfall feels truly once-in-a-career
  jackpotYear: null,        // Year triggered (optional 15-cycle cooldown if multi-century play)
  rivalReactions: [],       // Current month's rival chair responses shown in Morning Wire
};

```

### 2.2 Event Object Contract

Every event in the 157-event catalog conforms to a strict schema:

```
{
  id: 'ev_t2_04_podcast_wave',
  title: 'Three-Hour Long-Form Podcast Goes Viral',
  tierPool: 'tier2',                 // 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5' | 'universal' | 'jackpot'
  category: 'media_viral',           // 'scandal' | 'gaffe' | 'economic' | 'coalition' | 'media_viral' | 'grassroots' | 'ballot_legal' | 'debate_trail' | 'foreign_shock'
  severity: 'major',                 // 'standard' | 'major' | 'critical' | 'historic'
  hasVoterRegOption: true,           // Exact 1/3 guarantee across Tiers 1, 2, 3, and 4
  arcId: null,                       // Optional multi-month arc identifier
  arcBeat: 0,                        // 1, 2, or 3 for chained events
  requires: {                        // Optional dynamic predicates
    minMonth: 1, maxMonth: 5,
    shockType: null,                 // e.g. 'inflation', 'geopolitical'
    ballotInitiativeActive: false,
    hasThreatenedIncumbent: false,
  },
  bodyTemplate: '...',               // Dynamic tokens: {STATE}, {REGION}, {RIVAL_PARTY}, {RIVAL_NOMINEE}, {FACTION}, {INCUMBENT}, {THEME}, {ERA}
  choices: [ /* 3 bespoke asymmetric options */ ],
}

```

### 2.3 Deterministic Selection & Anti-Repetition

* **Seeded Hashing:** All draws use `fnv1aHash(`${game.seed}:${game.year}:m${month}:ev:${salt}`)`.

* **Cooldown:** An event cannot repeat within **6 election cycles** (12 in-game years) unless all eligible events in the player's tier pool have been exhausted.

* **Monthly Cadence:** Each campaign month (Months 1–5) fires **1 primary Campaign Event** (guaranteed) plus up to **1 active Multi-Month Arc follow-up** or **Trait Crisis** in Months 2–5. Month 4/5 retains elevated October Surprise weighting.

## 3. The Five Core System Improvements

### Improvement #1 — Context-Specific, Asymmetric Dilemmas

Replace `buildCrisisChoices()` and generic 2-button events with **bespoke 3-choice structures** tailored to each event's archetype, where every choice trades off a distinct resource or constituency:

| Dilemma Axis | Choice A (High-Investment / Aggressive) | Choice B (Coalition / Strategic Pivot) | Choice C (Grassroots / Asymmetric Trade-Off) | 
| ----- | ----- | ----- | ----- | 
| **Resource Cost** | Spend treasury (`$1.5M–$8M`) or **2 Campaign Actions** | Shift a live platform stance (`±0.8` to `±1.5`) or spend **1 Action** | Sacrifice short-term poll margin (`-0.8%`) for long-term **Voter Registration** or **Trust** | 
| **Targeting** | Multi-state regional boost (`{REGION}`) or rival airwaves disruption | Live faction happiness (`+8` on `{FACTION}`, `-5` on rival wing) | Free field office, airwaves saturation clear (`-25`), or burn an existing **Oppo Dossier** to flip the news cycle | 
| **Transparency** | Every button displays explicit **Stakes Chips** before clicking: affected state(s), live faction name(s), cost (`$` or Actions), and projected range (e.g., `PA, MI +1.2% to +2.4%`, `True Libertarians +7 Hap`). | Same | Same | 

### Improvement #2 — Multi-Month Story Arcs (2–3 Beat Chains)

Introduce **10 flagship 3-beat branching story arcs** (30 of the 157 events, distributed cleanly across Universal and Tier pools) that span Months 1–5 and remember earlier decisions:

| Arc ID | Beat 1 (Month 1–2) | Beat 2 (Month 3–4, Branches on Beat 1) | Beat 3 (Month 4–5 / Debate Callback) | 
| ----- | ----- | ----- | ----- | 
| `arc_whistleblower` | **Internal Donor Memo Leaks** (Contain quietly vs. Release full ledger vs. Blame rival hack) | If hidden → **Media Feeding Frenzy** (escalates `-2.5%`); if released → **Transparency Halo** | **Debate Stage Ambush**: Moderator injects a custom follow-up question referencing your Beat 1–2 handling | 
| `arc_grassroots_wave` | **Breakout Town Hall in `{STATE}`** | **Regional Volunteer Stampede** (expand to neighboring `{REGION}` states vs. lock down `{STATE}`) | **Election-Week Turnout Surge** (`+2.0%` to `+3.5%` turnout in targeted states) | 
| `arc_coalition_rift` | **Restless `{FACTION}` Public Manifesto** | **Emergency Trail Summit** (platform concession vs. hold firm vs. surrogate mediation) | **October Unity Rally or Floor Boycott** (directly impacts faction bolt risk & base turnout) | 
| `arc_ballot_lawfare` | **Rival Ballot-Access Challenge in `{STATE}`** (Tiers 1–3) | **Federal Appellate Emergency Hearing** | **Courtroom Victory Martyrdom Bounce** or **Write-In Contingency Scramble** | 
| `arc_economic_jolt` | **Sudden Regional Plant Closure in `{REGION}`** | **Bipartisan Relief Bill Showdown** | **Pocketbook Closing Argument** (amplifies or undercuts active Campaign Theme) | 
| `arc_debate_gate` | **Debate Commission Polling Threshold Fight** (Tiers 1–3) | **Counter-Programming Livestream Town Hall** | **National Breakthrough or Media Blackout** | 
| `arc_superpac_rogue` | **Allied Super PAC Airs Unauthorized Attack Ad** (Tiers 3–5) | **Fact-Check Backlash & Network Pull** | **Donor Revolt or Hardline Base Consolidation** | 
| `arc_foreign_flashpoint` | **Overseas Diplomatic Flashpoint** | **Bipartisan Briefing vs. Partisan Critique** | **Commander-in-Chief Closing Test** | 
| `arc_incumbent_feud` | **Threatened `{INCUMBENT}` Breaks with National Ticket** | **Coattail Negotiation in `{STATE}`** | **Split-Ticket Truce or Primary Revenge Fallout** | 
| `arc_voter_surge` | **Campus & Working-Class Registration Drive Ignites** | **Secretary of State Filing Bottleneck** | **Record Early-Vote Turnout Wave** | 

### Improvement #3 — Dynamic Context Injection & Cross-System Hooks

* **Live Token Resolution:** Every event resolves tokens from real game state before rendering:

  * `{STATE}` → Closest competitive state (within `±6%`) or player's highest-priority stronghold for Tier 0–2 parties.

  * `{REGION}` → Census region of `{STATE}` (e.g., Rust Belt, Mountain West, Sun Belt, New England).

  * `{FACTION}` → Live faction from `game.factions.filter(f => f.partyId === playerPartyId)` (preferring lowest-happiness or theme-aligned wing; **0 legacy v0.1 faction IDs**).

  * `{INCUMBENT}` → Closest threatened sitting Senator/Governor/Rep in `game.sittingMembers` (falls back to top nominee for Tier 0–2).

  * `{RIVAL_PARTY}` / `{RIVAL_NOMINEE}` → Leading rival party and ticket nominee.

  * `{THEME}` → Active Monthly Campaign Theme issue label.

* **Cross-System Hooks:**

  * **Media & Shocks (`media-shocks-system.js`):** Active economic or geopolitical shocks weight shock-linked events `+3x` and let event choices amplify or mitigate shock penalties.

  * **Ballot Initiatives (`redistricting-ballot-system.js`):** When an active ballot measure is on the ballot in `{STATE}`, ballot-linked events unlock choices to co-brand the measure for turnout or registration lift.

  * **Leading Faction (`leading-faction-system.js`):** Coalition events adjust faction influence and friction directly on the live leading/challenger factions.

  * **Rival October Surprises (`campaign-overhaul.js`):** When an AI Rival Chair detonates an oppo dossier in Month 4–5, it spawns a linked counterplay event rather than a passive ticker line.

### Improvement #4 — Meaningful Mechanical Stakes & Rival Counterplay

* **Lift the `0.1x` Trust Dampener:** Replace the flat `0.1x` multiplier in `applyCampaignEventChoice` with tier-scaled, severity-aware caps:

  * `standard` events: `0.4x` trust scaling (typical net `±1.0` to `±2.5` trust)

  * `major` / `critical` / October Surprise events: `0.75x–1.0x` trust scaling (typical net `±2.5` to `±5.0` trust)

* **Tangible Board Effects:** Event choices can trigger:

  * **Regional Poll Swings:** `+1.0%` to `+2.8%` across 2–4 states in `{REGION}` (stored in `game.campaign.eventStatePolls`).

  * **Airwaves Saturation Relief:** `-20` to `-35` saturation in `{STATE}` (opening fresh media buys).

  * **Instant Field Offices / Chapters:** `+1` free field office or state chapter written to `stateOrganizations[stateId][playerPartyId]` (fixing the `.player` vs. preset party key split).

  * **Direct Voter Registration:** Strictly conserves the **155,000,000** national electorate by transferring represented voters from `independent`/`other` pools into `playerPartyId` in targeted state(s).

* **Rival Chair News-Cycle Reactions:** Whenever a national/regional event resolves, the leading Rival Chair deterministically selects a counter-posture (e.g., *GOP Chair pivoted to inflation attack ads in PA & WI*) and logs a 1-line headline to the **Morning Wire** with a modest opposing adjustment so the news cycle feels contested.

### Improvement #5 — Breaking News Desk UI & Political Atlas Integration

* **Breaking News Modal (`critical`, `historic`, Arc Climax, October Surprises):**

  * Renders as a high-contrast broadcast-desk modal with severity badge (`BREAKING NEWS`, `COALITION ALERT`, `OCTOBER SURPRISE`, or gold `HISTORIC MOMENT`), dynamic state/faction context strip, and 3 rich choice cards with inline Stakes Chips.

  * **Must-Resolve Gate:** Clicking "Advance Month" while `game.campaignEvents.pendingEvent` is unresolved focuses/opens the Breaking News Desk instead of silently executing Choice 0.

* **Campaign Timeline Strip:** Compact 5-month horizontal breadcrumb inside the War Room showing the defining event + outcome badge for each month (`M1 → M2 → M3 → M4 → M5`).

* **Political Atlas Hook:** At `resolveGeneralElection`, attach `definingEvent: { title, month, choiceLabel, impactSummary }` to the cycle's `atlasHistory` snapshot (\~120 bytes) so the Electoral Timelapse and Legacy Scorecard preserve the story of each election.

## 4. Voter-Registration Option Rule (Tiers 1–4 Exact 1/3 Guarantee)

### 4.1 Pool Distribution & Exact 1/3 Math

To guarantee that **1/3 (33.3%) of eligible events for Tier 1, Tier 2, Tier 3, and Tier 4 parties** include a voter-registration choice—while keeping Tier 5 focused on governing/major-party crises—the **157 events** are partitioned as follows:

| Event Pool | Eligible Tiers | Total Events | Events With Voter-Reg Choice (`[REG]`) | Exact `[REG]` Share | 
| ----- | ----- | ----- | ----- | ----- | 
| **Tier 1 Core Pool** (Grassroots / Insurgent) | Tier 0–1 | 30 | **10** | **33.3%** | 
| **Tier 2 Core Pool** (Emerging Regional) | Tier 2 | 30 | **10** | **33.3%** | 
| **Tier 3 Core Pool** (Contending Third / Mid-Tier) | Tier 3 | 30 | **10** | **33.3%** | 
| **Tier 4 Core Pool** (Major Challenger / Contender) | Tier 4 | 30 | **10** | **33.3%** | 
| **Universal Multi-Tier & Story-Arc Pool** | Tiers 1–5 | 18 | **6** | **33.3%** | 
| **Tier 5 Exclusive Pool** (Dominant Major / Incumbent) | Tier 5 | 18 | 2 | 11.1% | 
| **Ultra-Rare Generational Windfall ("Jackpot")** | **All Tiers (0–5)** | 1 | **1** (Guaranteed +100k) | — | 
| **TOTAL CATALOG** | — | **157** | **49** | **Exact 16/48 (33.3%) per Tier 1–4** | 

### 4.2 "Usually (But Not Always)" Registration Resolution Mechanic

When a player selects a `[REG]` choice on any Tier 1–4 event, registration **usually succeeds, but is not guaranteed 100% of the time**, creating genuine risk-reward tension:

* **Base Success Probability:** **78%** (deterministic seeded roll via `seededUnit(`${seed}:${year}:m${month}:reg:${eventId}`)`).

* **Modifiers (clamped to `[55%, 92%]`):**

  * `+8%` if the player has ≥ 2 state chapters or an active field office in `{STATE}`.

  * `+5%` in Months 1–3 (early registration window before state registration deadlines).

  * `-10%` in Month 5 (post-deadline friction in most states).

  * `+5%` if `trust.independents >= 25`.

* **Outcome Bands:**

  * **Strong Success (rolled within top 25% of success band):** `1.35x` voter registration yield (`+3,500` to `+14,000` voters depending on Tier & state population, strictly conserved from unaffiliated/independent voters in `{STATE}`).

  * **Standard Success (remaining success band — \~78% combined chance):** `1.0x` voter registration yield (`+2,500` to `+10,000` voters in `{STATE}`).

  * **Friction / Fizzle (\~22% miss chance):** Registration drive hits clerk backlogs, weather, or competing turnout noise → **0 net new registered voters** (player receives a small consolation `+0.4%` name-ID / `+1` supporter trust bump and clear narrative feedback explaining why the drive stalled).

## 5. The Ultra-Rare All-Tier "Jackpot" Event

### 5.1 Identity & Emotional Framing

* **Event ID:** `ev_historic_civic_awakening`

* **Title:** **"The Midnight Broadcast: A Generational Political Awakening"** *(never labeled "Jackpot" in-game)*

* **Subtitle / Eyebrow:** `HISTORIC BREAKING EVENT · ONCE-IN-A-GENERATION SURGE`

* **Visual & Audio Treatment:** Full-screen gold-and-amber Breaking News Flash modal with an animated pulse border, distinct headline banner (`"SOMETHING UNPRECEDENTED JUST HAPPENED"`), and a 10-state surge grid lighting up all 10 states that caught fire.

* **Narrative Copy:**

  > *"An unscripted 4-minute exchange from your `{STATE}` town hall—captured on a volunteer's phone and amplified overnight by podcasters, local radio hosts, and grassroots organizers—has detonated across the country. County election clerks from coast to coast are reporting overwhelmed online voter-registration portals and lines outside local offices. Political veterans are calling it a lightning-in-a-bottle moment that comes around once in a career."*

### 5.2 Trigger Rules & Mechanical Reward

* **Tier Eligibility:** **Any Tier (Tier 0, 1, 2, 3, 4, or 5)** — equally thrilling whether you are a scrappy Tier 0/1 custom or Libertarian party or a Tier 5 major party in a deadlocked race.

* **Trigger Odds:** **1.8% per campaign month** (deterministic roll via `seededUnit(`${seed}:${year}:m\${month}:historic_windfall`)`), capped at **once per 15 election cycles** (`jackpotTriggered` flag) so hitting it genuinely feels like striking gold.

* **Exact Voter Reward:** Deterministically selects **10 distinct U.S. states** (weighted slightly toward states with available unaffiliated/independent voters, avoiding duplicates) and adds **exactly `+10,000` registered party voters in each of the 10 states** (**`+100,000` total voters**).

* **155,000,000 Conservation Rule:** In each of the 10 selected states, the `+10,000` voters are transferred cleanly out of `independent` / `other` (and if needed, proportionally from opposing pools) so national represented voters remain locked at exactly `155,000,000`.

* **Player Choice (All 3 Choices Lock In the 10 × 10,000 Voter Windfall — Plus a Strategic Bonus):**

  1. **Ride the Lightning Nationwide (\$0):** Lock in **+10,000 voters in all 10 states (+100,000 total)** + `+3.0` Independents Trust + `-15` Airwaves Saturation in all 10 states.

  2. **Convert the Moment into a Grassroots War Chest (\$0):** Lock in **+10,000 voters in all 10 states (+100,000 total)** + `+$6.0M` small-dollar fundraising surge + `+4` happiness across all party factions.

  3. **Pour Fuel on the 10-State Map (\$2.0M):** Lock in **+10,000 voters in all 10 states (+100,000 total)** + `+1` free field office in 3 of the 10 states + `+1.5%` turnout lift across all 10 states.

* **Political Atlas Pin:** Permanently recorded in `game.legacyMeta` and the cycle's Political Atlas snapshot as a gold-starred **Historic Turning Point**.

## 6. Complete 157-Event Master Catalog

Events marked **`[REG]`** include a voter-registration choice (78% base success rate, usually but not always succeeding). Events marked **`[ARC]`** belong to one of the 10 multi-month story arcs.

### 6.1 Tier 1 Core Pool — Grassroots & Insurgent Parties (30 Events | 10 `[REG]` = 33.3%)

| \# | ID | Title | Category | Tag | 
| ----- | ----- | ----- | ----- | ----- | 
| 1 | `ev_t1_01` | Ballot-Access Petition Signature Challenge in `{STATE}` | `ballot_legal` | `[ARC]` | 
| 2 | `ev_t1_02` | County Fair Straw Poll Surprise Win in `{STATE}` | `grassroots` | **`[REG]`** | 
| 3 | `ev_t1_03` | Local Radio Host Grants Uncut 90-Minute Interview | `media_viral` | **`[REG]`** | 
| 4 | `ev_t1_04` | Major-Party "Spoiler Effect" Op-Ed Blitz | `debate_trail` | — | 
| 5 | `ev_t1_05` | College Campus Free-Speech Rally Sparks Sign-Ups | `grassroots` | **`[REG]`** | 
| 6 | `ev_t1_06` | Secretary of State Notary Technicality Threatens Filing | `ballot_legal` | — | 
| 7 | `ev_t1_07` | Small-Town Diner Livestream Hits 2M Views | `media_viral` | **`[REG]`** | 
| 8 | `ev_t1_08` | Volunteer Van Breaks Down Mid-Tour in `{STATE}` | `grassroots` | — | 
| 9 | `ev_t1_09` | Disillusioned `{RIVAL_PARTY}` Precinct Captain Defects | `coalition` | **`[REG]`** | 
| 10 | `ev_t1_10` | Debate Commission Refuses Stage Entry | `debate_trail` | `[ARC]` | 
| 11 | `ev_t1_11` | Rival Purists Demand Ideological Litmus Test | `coalition` | — | 
| 12 | `ev_t1_12` | Crowdfunded Billboard Campaign Goes Up on `{STATE}` Interstate | `media_viral` | **`[REG]`** | 
| 13 | `ev_t1_13` | Municipal Election Clerk Praises Clean Filing | `ballot_legal` | — | 
| 14 | `ev_t1_14` | Indie Documentary Crew Follows Your Trail Bus | `media_viral` | — | 
| 15 | `ev_t1_15` | Farmers' Market & Union Hall Listening Tour | `grassroots` | **`[REG]`** | 
| 16 | `ev_t1_16` | Fringe Spokesperson Off-Message Podcast Rant | `gaffe` | — | 
| 17 | `ev_t1_17` | Regional Third-Party Coalition Endorsement Offer | `coalition` | — | 
| 18 | `ev_t1_18` | State Legislature Floats Higher Ballot-Signature Threshold | `ballot_legal` | — | 
| 19 | `ev_t1_19` | Viral Infographics Break Through Local Subreddits in `{STATE}` | `media_viral` | **`[REG]`** | 
| 20 | `ev_t1_20` | Micro-Donor Match Challenge from Retired Entrepreneur | `economic` | — | 
| 21 | `ev_t1_21` | County Courthouse Steps Rally Draws Unexpected Crowd | `grassroots` | **`[REG]`** | 
| 22 | `ev_t1_22` | Local Newspaper Editorial Calls Your Platform "Refreshingly Honest" | `media_viral` | — | 
| 23 | `ev_t1_23` | Rival Campaigns Poach Your Field Organizers in `{STATE}` | `coalition` | — | 
| 24 | `ev_t1_24` | Federal Matching-Funds 5% Threshold Polling Surge | `economic` | — | 
| 25 | `ev_t1_25` | Door-to-Door Ballot-Line Canvass Hits Rural Counties | `grassroots` | **`[REG]`** | 
| 26 | `ev_t1_26` | Overzealous Volunteer Clashes with Local Press | `gaffe` | — | 
| 27 | `ev_t1_27` | Cross-Party Town Hall on `{THEME}` Draws Undecideds | `debate_trail` | — | 
| 28 | `ev_t1_28` | State Supreme Court Grants Emergency Ballot Injunction | `ballot_legal` | `[ARC]` | 
| 29 | `ev_t1_29` | Counter-Programming Livestream Debate Draws 800k Viewers | `debate_trail` | `[ARC]` | 
| 30 | `ev_t1_30` | Write-In Contingency Scramble in `{STATE}` | `ballot_legal` | `[ARC]` | 

### 6.2 Tier 2 Core Pool — Emerging Regional Parties (30 Events | 10 `[REG]` = 33.3%)

| \# | ID | Title | Category | Tag | 
| ----- | ----- | ----- | ----- | ----- | 
| 31 | `ev_t2_01` | Three-Hour Long-Form Podcast Goes Viral | `media_viral` | **`[REG]`** | 
| 32 | `ev_t2_02` | Regional Chamber of Commerce Invites Your Nominee | `economic` | — | 
| 33 | `ev_t2_03` | First Competitive State-House District Polls Within 3 Points | `grassroots` | **`[REG]`** | 
| 34 | `ev_t2_04` | `{RIVAL_PARTY}` Runs "A Vote for Them Is a Vote for Us" Mailers | `debate_trail` | — | 
| 35 | `ev_t2_05` | State-Level Ranked-Choice Voting Coalition Seeks Co-Sponsor | `ballot_legal` | **`[REG]`** | 
| 36 | `ev_t2_06` | Regional TV News Anchors Feature Your `{STATE}` Surge | `media_viral` | — | 
| 37 | `ev_t2_07` | Internal Split Between Pragmatic Builders and Movement Purists | `coalition` | — | 
| 38 | `ev_t2_08` | Multi-County Voter Registration Caravan in `{REGION}` | `grassroots` | **`[REG]`** | 
| 39 | `ev_t2_09` | Retired State Senator Endorses Your Reform Slate | `coalition` | — | 
| 40 | `ev_t2_10` | Rapid-Growth Accounting Audit Finds Filing Errors | `scandal` | — | 
| 41 | `ev_t2_11` | Suburban Parent Coalition Rallies Around Your `{THEME}` Plank | `grassroots` | **`[REG]`** | 
| 42 | `ev_t2_12` | Rival Opposition Researchers Dig Up Nominee's Old Blog Posts | `scandal` | — | 
| 43 | `ev_t2_13` | Regional Tech & Small-Business Founders Host Fundraiser | `economic` | — | 
| 44 | `ev_t2_14` | Local Mayor Switches Registration to Your Party in `{STATE}` | `coalition` | **`[REG]`** | 
| 45 | `ev_t2_15` | Cable News Panel Mocks Your Polling Ceiling | `media_viral` | — | 
| 46 | `ev_t2_16` | Weekend Canvass Blitz Breaks State Chapter Record | `grassroots` | **`[REG]`** | 
| 47 | `ev_t2_17` | Fusion Cross-Endorsement Feelers from Vulnerable Incumbent | `coalition` | — | 
| 48 | `ev_t2_18` | `{STATE}` Polling Firm Finally Includes Your Ticket in Top-Line | `media_viral` | — | 
| 49 | `ev_t2_19` | Youth & First-Time Voter Festival Booths Overflow in `{STATE}` | `grassroots` | **`[REG]`** | 
| 50 | `ev_t2_20` | State Party Chair Feuds with National Committee Over Messaging | `coalition` | — | 
| 51 | `ev_t2_21` | Regional Energy/Cost-of-Living Forum Hands You the Mic | `economic` | — | 
| 52 | `ev_t2_22` | Rural Broadband & Civic Access Registration Drive | `grassroots` | **`[REG]`** | 
| 53 | `ev_t2_23` | Controversial Donor Pledge Tests Party Ethics Charter | `scandal` | — | 
| 54 | `ev_t2_24` | Rival Super PAC Buys First Negative Ad Against Your Party | `debate_trail` | — | 
| 55 | `ev_t2_25` | Independent Voter League Co-Hosts Registration Night in `{STATE}` | `grassroots` | **`[REG]`** | 
| 56 | `ev_t2_26` | Statehouse Slate Nominee Delivers Viral Floor Speech | `media_viral` | — | 
| 57 | `ev_t2_27` | Ballot-Position Lawsuit Over "Top-of-Ticket" Column Order | `ballot_legal` | — | 
| 58 | `ev_t2_28` | Regional Newspaper Syndicate Runs Profile on Your Chairmanship | `media_viral` | — | 
| 59 | `ev_t2_29` | National Debate Exclusion Fuels Protest March Outside Venue | `debate_trail` | `[ARC]` | 
| 60 | `ev_t2_30` | `{STATE}` Duopoly Dissatisfaction Hits Record High | `economic` | — | 

### 6.3 Tier 3 Core Pool — Contending Third & Breakthrough Parties (30 Events | 10 `[REG]` = 33.3%)

| \# | ID | Title | Category | Tag | 
| ----- | ----- | ----- | ----- | ----- | 
| 61 | `ev_t3_01` | National Poll Crosses 15% Debate Stage Threshold | `debate_trail` | **`[REG]`** | 
| 62 | `ev_t3_02` | Sitting U.S. Representative Explores Caucus Switch | `coalition` | — | 
| 63 | `ev_t3_03` | Both Major Parties Coordinate Attack Ads Against Your Surge | `debate_trail` | — | 
| 64 | `ev_t3_04` | Tri-State Grassroots Voter Registration Push in `{REGION}` | `grassroots` | **`[REG]`** | 
| 65 | `ev_t3_05` | Wall Street & Policy Think-Tanks Request Economic White Paper | `economic` | — | 
| 66 | `ev_t3_06` | `{STATE}` Governor's Race Turns Into a True Three-Way Toss-Up | `debate_trail` | **`[REG]`** | 
| 67 | `ev_t3_07` | Allied Super PAC Airs Unauthorized Hard-Edge Attack Spot | `scandal` | `[ARC]` | 
| 68 | `ev_t3_08` | National Labor or Trade Association Splits Endorsement | `coalition` | — | 
| 69 | `ev_t3_09` | Primetime Network Town Hall Slot Secured | `media_viral` | **`[REG]`** | 
| 70 | `ev_t3_10` | `{FACTION}` Threatens Revolt Over Big-Tent Moderation | `coalition` | — | 
| 71 | `ev_t3_11` | Early-Voting Mailer Blitz Targets Independent Households | `grassroots` | **`[REG]`** | 
| 72 | `ev_t3_12` | Nominee Stumbles on Foreign-Policy Pop Quiz | `gaffe` | — | 
| 73 | `ev_t3_13` | 12th Amendment Deadlock Scenario Dominates Sunday Shows | `media_viral` | — | 
| 74 | `ev_t3_14` | Rival Party Offers Quiet Non-Aggression Pact in `{STATE}` | `coalition` | — | 
| 75 | `ev_t3_15` | Civic-Tech App Automates Voter Registration at Your Rallies | `grassroots` | **`[REG]`** | 
| 76 | `ev_t3_16` | High-Profile Surrogate Faces Ethics Inquiry | `scandal` | — | 
| 77 | `ev_t3_17` | Regional Swing-County Registration Surge in `{STATE}` | `grassroots` | **`[REG]`** | 
| 78 | `ev_t3_18` | Major Pollster Overhauls Likely-Voter Model After Your Gains | `media_viral` | — | 
| 79 | `ev_t3_19` | Fact-Check Backlash Forces Network Ad Pull | `scandal` | `[ARC]` | 
| 80 | `ev_t3_20` | Coalition Bargaining Speculation Spooks `{FACTION}` | `coalition` | — | 
| 81 | `ev_t3_21` | Working-Class Voter Registration Drive in `{REGION}` | `grassroots` | **`[REG]`** | 
| 82 | `ev_t3_22` | `{INCUMBENT}` Breaks Ranks on `{THEME}` in `{STATE}` | `coalition` | `[ARC]` | 
| 83 | `ev_t3_23` | Bipartisan Editorial Board Endorses Your Congressional Slate | `media_viral` | — | 
| 84 | `ev_t3_24` | Ballot-Initiative Co-Branding Sparks Turnout & Sign-Ups | `ballot_legal` | **`[REG]`** | 
| 85 | `ev_t3_25` | Rival Chair Leaks Private Coalition-Talks Audio | `scandal` | — | 
| 86 | `ev_t3_26` | Suburban Women & Independents Registration Forum | `grassroots` | **`[REG]`** | 
| 87 | `ev_t3_27` | Regional Infrastructure Crisis Tests Governing Credibility | `economic` | — | 
| 88 | `ev_t3_28` | Donor Revolt vs. Hardline Base Consolidation | `coalition` | `[ARC]` | 
| 89 | `ev_t3_29` | Coattail Negotiation with `{INCUMBENT}` in `{STATE}` | `coalition` | `[ARC]` | 
| 90 | `ev_t3_30` | Split-Ticket Truce or Primary Revenge Fallout | `coalition` | `[ARC]` | 

### 6.4 Tier 4 Core Pool — Major Contender Parties (30 Events | 10 `[REG]` = 33.3%)

| \# | ID | Title | Category | Tag | 
| ----- | ----- | ----- | ----- | ----- | 
| 91 | `ev_t4_01` | Swing-State Voter Registration War Peaks in `{STATE}` | `grassroots` | **`[REG]`** | 
| 92 | `ev_t4_02` | Shadow Transition Team Names Leak to Washington Press | `scandal` | — | 
| 93 | `ev_t4_03` | National Union & Trade Federation Endorsement Bidding War | `coalition` | — | 
| 94 | `ev_t4_04` | Battleground Suburban Registration Blitz Across `{REGION}` | `grassroots` | **`[REG]`** | 
| 95 | `ev_t4_05` | `{RIVAL_NOMINEE}` Challenges You to Unmoderated Town Hall | `debate_trail` | — | 
| 96 | `ev_t4_06` | Mega-Donor Bundler Threatens Freeze Over `{THEME}` | `economic` | — | 
| 97 | `ev_t4_07` | High-Turnout Early-Vote Registration Surge in `{STATE}` | `grassroots` | **`[REG]`** | 
| 98 | `ev_t4_08` | Swing-State Governor Refuses to Appear at National Rally | `coalition` | — | 
| 99 | `ev_t4_09` | Network Fact-Check Spotlight on Rival's Economic Math | `media_viral` | — | 
| 100 | `ev_t4_10` | Rural County-Chair Rebellion Over Ad-Buy Allocation | `coalition` | — | 
| 101 | `ev_t4_11` | Multilingual Community Registration Campaign in `{STATE}` | `grassroots` | **`[REG]`** | 
| 102 | `ev_t4_12` | Opposing Super PAC Saturates `{STATE}` Media Markets | `debate_trail` | — | 
| 103 | `ev_t4_13` | Former Cabinet Secretary Endorses Your Ticket | `media_viral` | — | 
| 104 | `ev_t4_14` | Young-Voter Concert & Registration Tour Hits `{REGION}` | `grassroots` | **`[REG]`** | 
| 105 | `ev_t4_15` | Leaked Internal Polling Memo Sparks Media Panic | `scandal` | — | 
| 106 | `ev_t4_16` | Congressional Leadership Clashes with Presidential Campaign | `coalition` | — | 
| 107 | `ev_t4_17` | Veteran & First-Responder Registration Push in `{STATE}` | `grassroots` | **`[REG]`** | 
| 108 | `ev_t4_18` | Surprise Federal Reserve Rate Signal Reshapes `{THEME}` | `economic` | — | 
| 109 | `ev_t4_19` | Rival Campaign Suffers High-Profile Staff Resignation | `media_viral` | — | 
| 110 | `ev_t4_20` | Faith & Civic Network Voter Registration Weekend | `grassroots` | **`[REG]`** | 
| 111 | `ev_t4_21` | Downballot Senate Incumbents Demand Emergency Ad Rescue | `coalition` | — | 
| 112 | `ev_t4_22` | Viral Hot-Mic Moment at `{STATE}` Press Gaggle | `gaffe` | — | 
| 113 | `ev_t4_23` | Union-Hall & Plant-Gate Voter Registration Push | `grassroots` | **`[REG]`** | 
| 114 | `ev_t4_24` | Regional Supply-Chain Disruption Hits `{REGION}` Headlines | `economic` | — | 
| 115 | `ev_t4_25` | Rival Oppo Dossier Drops on Senior Surrogate | `scandal` | — | 
| 116 | `ev_t4_26` | Statewide Ballot-Initiative Registration Synergy in `{STATE}` | `ballot_legal` | **`[REG]`** | 
| 117 | `ev_t4_27` | Bipartisan Foreign-Policy Elders Issue Warning Letter | `foreign_shock` | — | 
| 118 | `ev_t4_28` | Senior-Citizen & Retiree Registration Drive in `{STATE}` | `grassroots` | **`[REG]`** | 
| 119 | `ev_t4_29` | National Convention Bounce Fades Faster Than Modeled | `media_viral` | — | 
| 120 | `ev_t4_30` | Late-Cycle Third-Party Surge Threatens `{STATE}` Margin | `debate_trail` | — | 

### 6.5 Tier 5 Exclusive Pool — Dominant Major & Governing Parties (18 Events | 2 `[REG]`)

| \# | ID | Title | Category | Tag | 
| ----- | ----- | ----- | ----- | ----- | 
| 121 | `ev_t5_01` | Cabinet Resignation Rumors Shake Incumbent Credibility | `scandal` | — | 
| 122 | `ev_t5_02` | White House Rose Garden Signing Backfires on `{THEME}` | `gaffe` | — | 
| 123 | `ev_t5_03` | Federal Government Shutdown Standoff Weeks Before Election | `economic` | — | 
| 124 | `ev_t5_04` | Supreme Court Emergency Shadow-Docket Ruling Polarizes Base | `ballot_legal` | — | 
| 125 | `ev_t5_05` | Trifecta Fatigue: Independent Voters Demand Divided Check | `coalition` | — | 
| 126 | `ev_t5_06` | Billion-Dollar Super PAC Coordination Complaint Filed | `scandal` | — | 
| 127 | `ev_t5_07` | Speaker & Senate Leader Publicly Undercut Chair Strategy | `coalition` | — | 
| 128 | `ev_t5_08` | National Infrastructure Ribbon-Cutting Blitz in `{REGION}` | `economic` | — | 
| 129 | `ev_t5_09` | Foreign Trade Retaliation Tariffs Hit `{STATE}` Exports | `foreign_shock` | — | 
| 130 | `ev_t5_10` | Historic 50-State Voter Registration Machine Mobilizes | `grassroots` | **`[REG]`** | 
| 131 | `ev_t5_11` | Incumbent Approval Rating Diverges Sharply from Downballot | `debate_trail` | — | 
| 132 | `ev_t5_12` | Wall Street Donor Strike Over Tax/Regulatory Plank | `economic` | — | 
| 133 | `ev_t5_13` | Former President Delivers Barnburner Rally in `{STATE}` | `media_viral` | — | 
| 134 | `ev_t5_14` | National Security Leak Triggers Emergency Briefing | `foreign_shock` | — | 
| 135 | `ev_t5_15` | Swing-District House Freshmen Demand Distance from Top Ticket | `coalition` | — | 
| 136 | `ev_t5_16` | Battleground Turnout & Registration Warchest Unlock | `grassroots` | **`[REG]`** | 
| 137 | `ev_t5_17` | Major Network Anchor Presses Nominee on Unkept Promise | `debate_trail` | — | 
| 138 | `ev_t5_18` | Late-Breaking Jobs & CPI Print Dominates Final 10 Days | `economic` | — | 

### 6.6 Universal Multi-Tier & Story-Arc Pool (18 Events | 6 `[REG]` = 33.3% | Eligible Tiers 1–5)

| \# | ID | Title | Category | Tag | 
| ----- | ----- | ----- | ----- | ----- | 
| 139 | `ev_u_01` | Internal Donor Memo Leaks to Investigative Desk | `scandal` | `[ARC]` | 
| 140 | `ev_u_02` | Whistleblower Fallout: Media Feeding Frenzy vs. Transparency Halo | `scandal` | `[ARC]` | 
| 141 | `ev_u_03` | Debate Stage Ambush: Moderator Reopens Leaked Memo | `debate_trail` | `[ARC]` | 
| 142 | `ev_u_04` | Breakout Town Hall Moment in `{STATE}` | `media_viral` | `[ARC]` **`[REG]`** | 
| 143 | `ev_u_05` | Regional Volunteer Stampede Across `{REGION}` | `grassroots` | `[ARC]` **`[REG]`** | 
| 144 | `ev_u_06` | Election-Week Turnout Surge Wave in `{STATE}` | `grassroots` | `[ARC]` | 
| 145 | `ev_u_07` | Restless `{FACTION}` Publishes Open Manifesto | `coalition` | `[ARC]` | 
| 146 | `ev_u_08` | Emergency Trail Coalition Summit with `{FACTION}` | `coalition` | `[ARC]` | 
| 147 | `ev_u_09` | October Unity Rally or Floor Boycott Showdown | `coalition` | `[ARC]` | 
| 148 | `ev_u_10` | Sudden Regional Plant Closure Shakes `{REGION}` | `economic` | `[ARC]` | 
| 149 | `ev_u_11` | Emergency Relief Package Showdown Over `{REGION}` Jobs | `economic` | `[ARC]` | 
| 150 | `ev_u_12` | Pocketbook Closing Argument Tests `{THEME}` | `economic` | `[ARC]` | 
| 151 | `ev_u_13` | Overseas Diplomatic Flashpoint Dominates Cable News | `foreign_shock` | `[ARC]` | 
| 152 | `ev_u_14` | Bipartisan Security Briefing vs. Partisan Critique | `foreign_shock` | `[ARC]` | 
| 153 | `ev_u_15` | Commander-in-Chief Closing Test | `foreign_shock` | `[ARC]` | 
| 154 | `ev_u_16` | Campus & Working-Class Registration Drive Ignites in `{STATE}` | `grassroots` | `[ARC]` **`[REG]`** | 
| 155 | `ev_u_17` | Secretary of State Registration Backlog Threatens New Voters | `ballot_legal` | `[ARC]` **`[REG]`** | 
| 156 | `ev_u_18` | Record Early-Vote & Registration Surge in `{REGION}` | `grassroots` | `[ARC]` **`[REG]`** | 

*(Note: `ev_u_01`–`ev_u_18` contains 5 `[REG]` arc beats above; add `[REG]` to `ev_u_06` Election-Week Same-Day Registration & Turnout Surge in `{STATE}` to lock the Universal Pool at exactly **6/18 = 33.3%**.)*

### 6.7 Ultra-Rare Generational Windfall Event (1 Event | Eligible All Tiers 0–5)

| \# | ID | Title | Category | Mechanical Effect | 
| ----- | ----- | ----- | ----- | ----- | 
| 157 | `ev_historic_civic_awakening` | **The Midnight Broadcast: A Generational Political Awakening** | `historic` | **+10,000 registered voters in 10 seeded states (+100,000 total)**, strictly conserving 155,000,000 electorate, plus choice of Trust/Saturation, `+$6M` small-dollar surge, or 3 free field offices + turnout lift. | 

## 7. Minimal Surgical Integration Plan (Merge-Safe)

| File | Surgical Hook (`// [v0.18.5 CAMPAIGN-EVENTS]`) | 
| ----- | ----- | 
| `campaign-events-system.js` *(new)* | Full 157-event catalog, dynamic token resolver, multi-month arc engine, 78%-base `[REG]` resolver with 155M conservation, generational windfall handler, Rival Chair reaction generator, Breaking News Desk modal + Campaign Timeline markup, and delegated UI bindings. | 
| `engine.js` | 5 small hooks: (1) initialize `campaignEvents` in `normalizeGame()`, (2) preserve/cap in `compactGameForSave()`, (3) trigger monthly event roll in `advanceCampaignWeek()` and guard against advancing while `pendingEvent` is unresolved, (4) dispatch `resolve-campaign-event-v2` in `takeAction()`, (5) attach `definingEvent` to `atlasHistory` snapshot at election resolution. | 
| `campaign-overhaul.js` | 2 small hooks: (1) pass `pendingDebate` arc callback questions from `activeArcs` into `buildDebateEvent()`, (2) route rival October Surprise detonations into a linked counterplay event. | 
| `app.js` | 3 small hooks: (1) render Campaign Timeline strip in Campaign Dashboard, (2) append `CampaignEventsSystem.renderOverlays(game)` in `render()`, (3) bind UI in `render()` via `CampaignEventsSystem.bindUI(...)`. | 
| `index.html` & `build.ps1` | Add 1 `<script>` tag and 1 `$packageItems` entry (preserving strict Windows CRLF on `build.ps1` and `BUILD_EXE.bat`). | 

## 8. Automated Verification & Balance Audit Checklist

A dedicated test suite `scripts/test-v0185-campaign-events.cjs` will verify:

1. **Catalog Count:** `CATALOG.length >= 150` (exact `157` unique IDs, zero duplicates, zero `Math.random()`).

2. **Exact 1/3 `[REG]` Invariant:** For each of Tier 1, Tier 2, Tier 3, and Tier 4, `eligibleWithReg / totalEligible === 1/3` (`16 / 48 = 33.3%`).

3. **"Usually, Not Always" `[REG]` Distribution:** Across 200 seeded trials, `[REG]` choices succeed \~75–85% of the time, fizzle \~15–25% of the time, and preserve exact `155,000,000` national voter conservation on every single trial.

4. **Generational Windfall ("Jackpot") Event:** Triggers for any tier (0–5), selects **10 distinct states**, adds **exactly `+10,000` voters per state** (`+100,000` total), and preserves `155,000,000` total voters.

5. **Multi-Month Arc Continuity:** Beat 1 choice sets flags that branch Beat 2 and inject a custom Beat 3 / Debate Stage callback.

6. **Zero Dead Faction Keys:** Every dynamic `{FACTION}` resolution maps to a live ID in `game.factions` with zero references to legacy `localists`/`pragmatists`/`workers`/`reformers`.

7. **Live Headless Chromium Smoke Test:** Breaking News Desk modal renders cleanly, blocks advancing month until resolved, updates Campaign Timeline strip, and produces 0 console errors / 0 `NaN` DOM hits.