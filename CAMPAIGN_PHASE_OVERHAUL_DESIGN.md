# Coalition Builder: Party Chair — Campaign Phase Overhaul & v0.18.0 Design Specification

**Status:** Implementation-Ready Design Specification (ready for immediate implementation on top of `v0.17.1` commit `ebf8cd8`)

**Target Version:** `v0.18.0` (building on `v0.17.1`)

**Primary Files:** `engine.js`, `app.js`, `data.js`, `election-night-engine.js`, `voter-model-0.5.js`, `party-systems-robots.js`, `scenario-2028.js`, `v07-scaffolding.js`, plus new standalone module `campaign-overhaul.js` (recommended for clean parallel Git workflow).

## 1. Core Campaign Cadence, Action Economy & Monthly Efficiency Curve

### 1.1 Five-Month Cadence & 8 Actions Per Month

* Reframe the 5-turn Campaign Phase from **Weeks 1–5** to **Months 1–5** (`June`, `July`, `August`, `September`, `October` — or `Month 1` through `Month 5`).

* Increase the player's action budget from **5 actions → 8 actions per month** (`campaign.monthlyActionsLeft = 8`, `campaign.maxMonthlyActions = 8`).

* Add a clean action-slot registry so the 5 approved new campaign actions (Section 9) plug cleanly into `takeActionInternal()` and the Campaign UI action bar alongside existing actions.

### 1.2 Monthly Persuasion vs. Turnout Efficiency Curve (Intentional Buff)

Every campaign action is tagged with an effect profile (`persuasion`, `turnout`, `hybrid`, or `membership`). When applied during Month `m`, its base persuasion/turnout effect is multiplied by the monthly efficiency table below (intentionally stronger than prior builds so campaign decisions meaningfully swing races):

| Campaign Month | Persuasion Efficiency | Turnout Efficiency | Strategic Identity |
| ----- | ----- | ----- | ----- |
| **Month 1** (June) | **300%** (`3.00×`) | **25%** (`0.25×`) | Early narrative framing, persuasion ads, coalition outreach |
| **Month 2** (July) | **200%** (`2.00×`) | **50%** (`0.50×`) | First debate, swing-state persuasion, oppo research setup |
| **Month 3** (August) | **150%** (`1.50×`) | **150%** (`1.50×`) | Balanced inflection point — both persuasion & early GOTV shine |
| **Month 4** (September) | **50%** (`0.50×`) | **200%** (`2.00×`) | Base mobilization, surrogate tours, toss-up rescue, second debate |
| **Month 5** (October) | **25%** (`0.25×`) | **300%** (`3.00×`) | Full GOTV sprint, October Surprises, Final 72 Hours Blitz |

* **UI Display:** Display the active month's Persuasion (`300%`) and Turnout (`25%`) efficiency pills prominently in the Campaign Header Bar and on every action card's projected impact tooltip.

## 2. Live Opponent Counterplay & Momentum

### 2.1 Expansive Rival Chair AI & "This Month on the Trail"

Each active rival party (`people`, `heritage`, `liberty`, `green`, `constitution`, `socialist`, plus any Era-spawned parties) executes an autonomous **Rival Chair Turn** at the end of every Campaign Month before the player begins the next month.

* **Rival Chair State (`game.campaign.rivalActivity`):**

  * Tracks each rival's monthly budget allocation, targeted states, action types (`ad_blitz`, `gotv_drive`, `rally_tour`, `surrogate_drop`, `issue_attack`, `downballot_rescue`, `oppo_drop`), and cumulative spend per state.

* **Rival Chair Target Scoring Algorithm:**

  * **Major Parties:** Score all 51 jurisdictions by `(ElectoralVotes × ClosenessWeight) + (CompetitiveSenateGovBonus) + (CounterPlayerBonus)`.

    * *Defensive Counterplay:* If the player invested heavily in a state during Month `m`, the rival chair has a 60% chance to allocate defensive counter-spending in Month `m+1` if the margin is within `±8%`.

    * *Offensive Flank:* Allocates 25–35% of budget to "poach" a leaning state where the player spent `$0` in the prior month.

    * *Downballot Triage (Months 4–5):* Diverts up to 30% of late-month funds into toss-up Senate, Governor, and Statewide Executive races within `±4%`.

  * **Third Parties:** Concentrate 70%+ of their smaller budget in states where they have ballot access and strongest faction density (targeting 5% national funding or 15% debate thresholds, plus Grassroots Haven state legislative states).

* **Visibility & UI:**

  * **"This Month on the Trail" Live Ticker & Intel Feed:** Summarizes the top 4–6 rival moves each month (e.g., *"Republican Chair poured \$6.5M into PA & WI airwaves; Libertarian Chair launched a NH grassroots blitz"*).

  * **Campaign Map Action Pins:** Toggleable map overlay showing rival ad-spend icons, rally pins, and heat rings on contested states, plus a side-by-side **Airwaves Balance** meter (`Your Spend vs. Rival Spend`) when clicking any state.

### 2.2 State-Level Airwaves Saturation & Diminishing Returns

* Track `game.campaign.stateSaturation[stateId]` (`0` to `100`) per state, incremented by **all** parties' media/ad spending in that state (`+12` per `$1M` equivalent normalized by state EV size).

* **Saturation Tiers:**

  * `0–35` (**Open Airwaves**): `1.00×` ad cost, `100%` persuasion effectiveness.

  * `36–65` (**Crowded Market**): `1.25×` ad cost, `75%` persuasion effectiveness.

  * `66–85` (**Saturated**): `1.60×` ad cost, `45%` persuasion effectiveness.

  * `86–100` (**Ad Fatigue**): `2.00×` ad cost, `20%` persuasion effectiveness (plus small Independent annoyance drag `-0.3` if you keep spamming).

* **Monthly Decay:** Saturation cools by `-20` points between months, rewarding timing and geographic rotation into under-contested swing states and downballot races.

### 2.3 Monthly Narrative Framing ("Theme of the Month")

At the start of each month (free strategic selection before spending your 8 actions, or 1st action slot), select **1 of the 44 active platform issues** as your party's national **Theme of the Month**.

* **Agreement & Salience Bonus:**

  * Compute national public alignment between your party's stance on the chosen issue and the electorate's weighted median preference, multiplied by the issue's current salience.

  * **High-Salience Agreement Bonus:** If the issue is in the top tier of national importance AND the country agrees with your party's position (alignment within `±0.35`), award an extra **`+1.5%` nationwide persuasion lift** (scaled by the month's Persuasion Efficiency) and **`+2` Independent Trust**.

  * **Coalition Clash Trade-off:** If a major faction in your own party strongly disagrees with the stance (`distance > 0.6`), that faction loses `-2` happiness while swing voters gain appeal.

* **Repeat-Issue Penalty (`game.campaign.usedThemes`):**

  * Selecting an issue you have **already used earlier in the same campaign** triggers **"Stale Messaging"**: persuasion effectiveness on the theme is cut by **50%**, Independent Trust drops `-2`, and rival chairs gain a free counter-framing bonus (`+0.8%` national swing). Selecting the same issue in consecutive months doubles the penalty.

## 3. High-Stakes Set Pieces & Trait-Driven Crises

### 3.1 Interactive General Election Debates (High Issue Variety)

* **Schedule:**

  * **Presidential Years:** **2 Debates** — Month 2 (Domestic & Economic Focus) and Month 4 (Foreign Policy, Governance & Closing Argument).

  * **Midterm Years:** **1 National Congressional/Gubernatorial Showcase Debate** in Month 3.

* **Third-Party Breakout Stage:** Any third party polling `>= 15%` nationally (or holding a special Era exception) qualifies for the main debate stage, triggering a **Breakout Moment** (`+3.0%` national awareness/persuasion boost and permanent visibility lift for the rest of the cycle).

* **Anti-Staleness Rotating Question Engine:**

  * Each debate features **3 distinct live questions** drawn without replacement from a **30+ question bank mapped across all 44 platform issues** (Economy & Inflation, Healthcare & Drug Pricing, NATO & Global Security, Frontier AI Oversight, Climate & Energy, Immigration & Border, Housing & YIMBY, Supreme Court & Civil Rights, National Debt & Taxes, Trade & Tariffs, Labor & Unions, Education, Gun Policy, Tech Antitrust, Public Lands, Democracy Reform, etc.).

  * Questions are weighted toward the current Party Systems Era's active issues and high-salience issues, and tracked in `game.debateQuestionsAsked` so the same question never repeats within 3 election cycles.

* **Playable Flow:**

  1. **Pre-Debate Prep Posture** (choose 1): *Attack Opponent's Record* (high variance, hurts rival poll), *Protect the Base* (turnout + faction happiness), *Pivot to Swing Issues* (Independent persuasion), or *Elevate Downballot Ticket* (Senate/Gov/Statewide coattail lift).

  2. **3 Live Question Responses:** For each question, pick from 3 tailored framing answers (Ideological Base / Pragmatic Center / Aggressive Counter-Punch).

  3. **Resolution Formula:** Weighted by nominee's `debate`, `charisma`, `mediaSavvy`, `quality`, issue alignment, and traits (`Polished` halves gaffe risk; `Disciplined` stabilizes floor; `Rough` boosts knockout upside AND blowback risk; `Undisciplined` adds unscripted-gaffe chance).

### 3.2 Trait-Triggered "October Surprises" & Rapid-Response Crisis Catalog (42 Unique Events)

In Months 2–5, the engine scans active nominees on the ballot (Presidential, Senate, Governor, and Statewide Executive) and fires **1–2 trait-driven campaign moments per month** (weighted toward Months 4–5). Each event names the **actual politician, state, and race**, and offers **3 distinct tactical responses** (e.g., *Defend & Rally Base*, *Distance & Protect Downballot*, *Counter-Attack / Spin*).

#### A. `Undisciplined` Trait Crises (8 Events)

1. **Hot-Mic Town Hall Gaffe:** Nominee caught on an open mic mocking local voters in a swing county.

2. **Midnight Social-Media Meltdown:** Candidate posts an unvetted 3 AM tirade alienating suburban Independents.

3. **Off-Script Interview Detour:** Candidate abandons talking points on Sunday morning TV and contradicts the party platform on a core issue.

4. **Heated Heckler Confrontation:** Viral clip of nominee losing their temper with a voter outside a diner.

5. **Leaked Campaign Staff Audio:** Candidate heard berating volunteers and calling a key coalition faction "dead weight."

6. **Unauthorized Policy Promise:** Nominee pledges a massive unfunded program live on air without Chair sign-off.

7. **Podcast Tangent Firestorm:** Candidate spends 40 minutes on a fringe podcast making headline-grabbing remarks.

8. **Debate-Stage Cross-Talk Blowup:** Candidate talks over the moderator and insults a popular local official.

#### B. `Corrupt` Trait Crises (8 Events)

 9. **Shell-Company Donor Dump:** Investigative outlet links nominee's leadership PAC to undisclosed dark-money shell LLCs.

10. **Stock-Trade Timing Scandal:** Financial disclosures reveal suspiciously timed trades right before a committee briefing.

11. **No-Bid State Contract Kickback:** Whistleblower alleges a major donor received a lucrative state contract after maxing out donations.

12. **Luxury Lobbyist Retreat Photos:** Tabloid publishes photos of the candidate vacationing on a corporate lobbyist's yacht during a cost-of-living crunch.

13. **Campaign Finance Reporting Probe:** FEC/state ethics board opens a formal inquiry into unreported consulting payments to family members.

14. **Pay-to-Play Endorsement Leak:** Leaked text messages suggest a quid-pro-quo promise for a regulatory appointment.

15. **Ghost-Employee Payroll Story:** Local paper uncovers campaign disbursements to a non-existent field firm.

16. **Tax-Shelter Offshore Revelation:** Documents tie candidate's family trust to offshore tax havens days before early voting opens.

#### C. `Rough` Trait Moments — High Risk / High Reward (6 Events)

17. **Combative Union Hall Speech:** Blistering populist rant goes viral—thrills working-class base, rattles moderate donors.

18. **Cable-News Host Ambush Turned Reversal:** Candidate aggressively dismantles a hostile interviewer live on air.

19. **Attack-Ad Overreach:** Hard-hitting negative spot triggers bipartisan editorial pushback for crossing the line.

20. **Rival Nickname Sticks:** Candidate coins a devastating viral label for their opponent that dominates headlines all month.

21. **Feud with Local Newspaper Editorial Board:** Candidate publicly shreds the state's largest paper at a rally.

22. **Populist Boycott Call:** Nominee calls for a boycott of a major employer in a swing state—energizing activists while alarming business factions.

#### D. `Rising Star` Viral Upside & Pressure Moments (6 Events)

23. **Breakout Viral Town Hall Clip:** Authentic 90-second answer hits 20M views overnight, surging youth & Independent persuasion.

24. **Small-Dollar Fundraising Explosion:** Grassroots surge brings in an unexpected `$3M–$6M` windfall in 48 hours.

25. **National Magazine Profile:** Glowing cover story boosts nominee fame (`+6`) and downballot coattails across the region.

26. **Overexposure Backlash:** Rival super PACs flood the zone painting the rising star as "all style, no substance."

27. **Celebrity / Cultural Endorsement Wave:** High-profile cultural figures rally behind the candidate in key metro markets.

28. **Grassroots Volunteer Stampede:** State chapters report double the normal weekend canvassing sign-ups.

#### E. `Established Politician` Moments (4 Events)

29. **20-Year-Old Floor Vote Unearthed:** Rival researchers dig up an unpopular decade-old vote that clashes with today's base.

30. **Bipartisan Elder Statesman Endorsement:** Respected retired opposing-party official crosses the aisle to vouch for your nominee.

31. **Insider "Swamp" Attack Ad Blitz:** Populist challenger paints the nominee as a creature of Washington.

32. **Institutional Donor Coalition Rally:** Legacy donors and trade associations step in to backstop a cash-strapped battleground.

#### F. `Polished` & `Disciplined` Moments (4 Events)

33. **Flawless Crisis Press Conference:** Nominee calmly defuses a brewing controversy in 5 minutes, earning praise across editorial pages.

34. **Telegenic Local-TV Sweep:** Candidate crushes 6 swing-market local news interviews in a single day.

35. **Robotic / Over-Rehearsed Critique:** Viral montage mocks the nominee for repeating the exact same focus-grouped slogan four times.

36. **Precision Ground-Game Execution:** Campaign's disciplined scheduling hits every media market before early-voting deadlines.

#### G. `Squeaky Clean` Moments (3 Events)

37. **Failed Rival Smear Backfire:** Opponent's negative attack collapses under fact-checking, giving your nominee a sympathy bounce (`+2.0%`).

38. **Ethics Reform Town Hall Halo:** Independent watchdogs spotlight nominee's clean financial disclosures, lifting Independent trust.

39. **Bipartisan Integrity Endorsement:** Good-government coalition highlights your candidate in a tight statewide or Senate contest.

#### H. External & Coalition Shocks (3 Events)

40. **Late-Breaking Economic Data Release:** Surprise inflation or jobs report jolts the national environment for the governing party.

41. **Severe Weather / Early-Voting Disruption:** Major storm hits a battleground region, shifting turnout logistics toward parties with strong local chapters.

42. **Third-Party Spoiler Surge Headline:** A minor-party nominee spikes 4 points in a swing state, forcing major-party chairs to decide whether to attack them or court their voters.

*Every single crisis guarantees at least 3 meaningful player choices—no auto-resolved dead popups—and tracks `firedCrisisIds` per cycle so no event repeats in the same campaign.*

### 3.3 Opposition Research ("Oppo Drops")

* **Action (`commission-oppo-research`):** Available in Months 1–3 (`1 action` + `$1.5M–$3M` depending on race tier: Presidential, Senate, Governor, Statewide).

* **Discovery Roll:** Higher probability of uncovering a **High-Severity Dossier** if the targeted rival has `Corrupt` (`85%` hit rate) or `Undisciplined` (`70%`), moderate against `Rough` / `Established Politician` (`45%`), low against `Squeaky Clean` (`15%`, with backfire risk).

* **War Room Storage & Timing (`game.campaign.oppoDossiers`):**

  * Uncovered dossiers sit in your War Room until you choose to **Detonate** (`release-oppo-dossier`, `1 action`).

  * **Early Drop (Months 2–3):** Smaller single-month hit (`-2.0%` rival poll) + unlocks cheap follow-up attack ads that bleed the opponent over multiple months.

  * **October Surprise (Month 5):** Massive immediate shock (`-3.5%` to `-5.0%` rival poll in target state/nationally) with **zero time for the rival chair to recover**, at slightly higher Independent cynicism risk if overused.

## 4. Surrogates, Primary Rivals & Coalition Drama

### 4.1 Deployable Surrogates (Top 10 Most Famous Politicians, Min. Fame 50)

* **Simple, Transparent Eligibility Rule:** Your active surrogate pool is automatically populated from your party's **top 10 most famous non-retired politicians with `fame >= 50`** (combining `sittingMembers`, `politicians`, and losing presidential primary rivals from your party).

* **Deployment (`deploy-surrogate`, `1 action`):**

  * Each surrogate can be deployed **once per month** to a chosen state (or regional tour).

  * **Synergy Multipliers:**

    * `+50%` bonus if the target state is in the surrogate's `regions` or `stateId`.

    * `+40%` turnout bonus among voters belonging to the surrogate's `factionId`.

  * **Primary Unity Healing:** Deploying a losing Presidential Primary rival who belongs to a different faction heals their faction's post-primary `-2` confidence loss and adds `+3` happiness—provided their faction's current happiness is `>= 40` (otherwise they decline until you mend fences).

### 4.2 Faction Trail Ultimatums

* **Trigger:** At the start of Month 3 or Month 4, if any **major faction** in your party has `factionHappiness < 35` (and hasn't already issued an ultimatum this cycle), they issue a public **Trail Ultimatum**.

* **Choices:**

  1. **Meet Their Demand** (e.g., fund their favored downballot race, adopt their messaging line, or feature their leader): `+10` faction happiness, restores full base GOTV turnout, costs `$2M` or `-2` Independent Trust.

  2. **Offer a Compromise:** `+5` faction happiness, half cost, minor `-1` trust hit.

  3. **Call Their Bluff / Ignore:** No immediate cash/trust cost, but that faction suffers a `-12%` turnout penalty on Election Night and `-4` confidence.

### 4.3 Downballot Rescue & Coattail Triage ("Toss-Up Watch")

* In **Months 4 and 5**, a dedicated **"Toss-Up Watch"** card automatically surfaces the **4 closest races** on the ballot (across Senate, Governor, and the 223 Statewide Executive offices) where your party is within `±4.0%`.

* One-click **Emergency Rescue Infusion** (`$1.5M–$3M` + `1 action`) or **Surrogate Dispatch** directly from the Toss-Up Watch panel, creating late-campaign tension between padding Presidential EVs and saving Senate control or a critical Attorney General seat.

## 5. Correlated Polling Error Model & Election Eve Final Blitz

### 5.1 Correlated National & Regional Polling Error (Randomized at Resolution)

Instead of flat per-state noise, polling error is resolved at the end of the campaign with realistic national + regional correlation:

1. **National Systematic Error (`natError`):**

   * Draw a random direction (`+1` or `-1` favoring one coalition/party) and magnitude in **`[2.0, 6.0]` percentage points**, centered around a **`~4.0`-point average** (triangular/clamped-normal distribution with mean `4.0`, min `2.0`, max `6.0`).

2. **Regional Error Clusters (`regionErrors`):**

   * For each geographic/demographic region (`Northeast`, `Midwest / Rust Belt`, `Deep South`, `Appalachia`, `Sun Belt`, `Great Plains`, `The Rockies`, `West Coast`, `Pacific Northwest`), draw a correlated regional offset in **`[-3.5, +3.5]`** around `natError`.

   * States with similar demographic/urban-rural profiles share an additional small demographic correlation term so neighboring and similar states miss in tandem.

3. **State-Level Error Spread (`±5.0` Points Around National Miss):**

   * For each state `s`, compute:
     `stateError[s] = clamp(natError + 0.65 * regionError[s] + 0.35 * stateNoise[s], natError - 5.0, natError + 5.0)`

   * *Example:* If `natError = +5.0`, some states end up at `0.0` (dead on the money) while others miss by `+10.0`, with states in the same region clustering tightly together.

   * State misses move in the same direction as the national miss (`[0, natError + 5]` when `|natError| >= 5`, or `[natError - 5, natError + 5]` generally so every state stays within the exact `±5`-point spread band around `natError`).

4. **Recalculated National Polling Miss on End Screen:**

   * After resolving all 51 jurisdictions with their final state errors, recalculate the **actual realized national polling miss** (weighted by actual state votes cast / electorate share) and display a dedicated **"Polling Accuracy & Miss Report"** on the Election Night / End Screen showing:

     * **Realized National Polling Miss** (e.g., *Polls underestimated Democratic Party by +4.3 pts nationally*)

     * **Regional Miss Breakdown** (e.g., *Midwest +6.8, Sun Belt +1.9, Northeast +4.1*)

     * **Dead-On State** (smallest miss) and **Biggest Upset / Miss State** (largest miss).

### 5.2 Election Eve Final Blitz (Month 5 — "Final 72 Hours")

* As the closing beat of Month 5 (right before clicking into Election Night), open a **Final 72 Hours** modal where you pick **3 final battleground stops** for your presidential ticket (or top 3 Senate/Governor targets in midterms).

* Each stop delivers a sharp Month-5 turnout surge (`300%` efficiency applied), and the modal reveals the **rival chairs' 3 final stops side-by-side** right before polls open.

## 6. Dynamic `Corrupt` Trait Overhaul

Replace static hardcoded `"Corrupt"` trait assignments with a dynamic, living corruption lifecycle:

1. **Scrub Static Starting Assignments (`app.js`, `data.js`, `scenario-2028.js`):**

   * Strip `"Corrupt"` from hardcoded entries in `POLITICIAN_TRAITS_MAP` and static starting rosters so no real-world politician is permanently hardcoded as corrupt across every playthrough.

2. **Game Start — 10% Random Assignment (`createGame`):**

   * Immediately after building `game.sittingMembers` and `game.politicians`, iterate over all unique politicians and assign `"Corrupt"` with an exact **10% probability** (`rng() < 0.10`, seeded deterministically from `game.seed`).

   * If a politician receives `"Corrupt"`, automatically remove `"Squeaky Clean"` if present (mutually exclusive traits).

3. **Newly Generated Politicians — 5% Assignment (`generateFreshPoliticianForSeat`, Statehouse Standouts, Dynamic Primary Candidates):**

   * Every newly spawned politician rolls `rng() < 0.05` (**5% chance**) to start with `"Corrupt"` (mutually exclusive with `"Squeaky Clean"`).

4. **Per-Cycle Drift — 1% Chance Every Cycle (`startNextCycleInternal`):**

   * At the start of every new election cycle, every active, non-retired politician in `sittingMembers` and `politicians` who does **not** currently have `"Corrupt"` rolls `rng() < 0.01` (**1% chance**) to gain `"Corrupt"` (removing `"Squeaky Clean"` if they had it).

   * Sync updated trait lists between matching `sittingMembers` and `politicians` records by `id` / `name` so UI badges, vetting, and October Surprise crisis triggers always match.

## 7. Election Night Screen Flicker Fix & Hover Vote Percentages (QA Fixes #1 & #2)

### 7.1 Fixing the 100ms Full-Page Refresh Bug (`app.js:8722–8735`)

* **Verified Root Cause in `v0.17.1`:** `ensureElectionNightPlayback()` at `app.js:8722–8735` runs `setInterval(..., 100)` and calls full **`render()` 10 times per second** (every 100ms), tearing down and rebuilding `root.innerHTML` continuously—resetting scroll position, stealing clicks, and breaking tab/dropdown interaction.

* **Required Architectural Fix (`app.js`):**

  1. **Render the Election Night shell ONCE** when entering `phase === 'election-night'` (or when the user explicitly clicks a tab like *Presidential / Senate / House / Governor / Statewide*).

  2. **In-Place DOM Patching Only (`patchElectionNightLiveDOM()`):** On each playback tick, update **only** targeted data nodes via `data-en-*` attributes (`textContent` for EV totals, seat counts, elapsed clock, % reporting, newly called ticker items, and `style.fill` / `fillOpacity` / `classList` on SVG state paths). **Never** rewrite `root.innerHTML`, reset `scrollTop`, or change the user's active tab/page during live ticks.

  3. **Clean Interval Lifecycle:** Keep a single module-scoped `electionNightInterval` cleared immediately on pause, completion, or phase exit.

### 7.2 Hover Vote Percentages on All Elections

* Attach lightweight delegated `pointerenter` / `pointermove` / `pointerleave` listeners to the Election Night SVG map states and every race card/row (Presidential, Senate, House, Governor, Statewide Executive).

* Hovering any state or race displays a floating, non-blocking tooltip positioned near the cursor showing:

  * **Race Title & State** (e.g., *Pennsylvania — U.S. Senate*)

  * **Status & % Reporting** (e.g., *78% Reporting · Too Close to Call* or *Called for Democratic Party*)

  * **Every Candidate / Party's Exact Vote Percentage** (`49.4%` vs `47.8%` vs `2.8%`) with party color swatches and live margin (`D+1.6%`).

* Because the DOM is patched in place rather than wiped every 100ms, the tooltip stays rock-steady and updates its live numbers smoothly under the cursor.

## 8. Native `1:1` Voter Scale Migration (`1:100` → `1:1`) & Exact Adjustment Audit (QA Fix #5)

### 8.1 Performance Guarantee

* Moving from `1:100` (`1,550,000` sample units representing `155,000,000` voters) to native `1:1` (`155,000,000` stored directly) causes **virtually zero performance slowdown**, because all engine math operates on aggregated integer counts per `(state × faction)` (\~1,887 numbers total), never per-individual-voter loops. JavaScript `Number` handles exact integers up to `9 × 10^15`.

### 8.2 Complete File-by-File Number & Constant Adjustment Map

Every single `1:100` sample-unit constant, divisor, and display multiplier audited in `v0.17.1` must be updated in lockstep:

| File & Exact Locations | Current `1:100` Logic | Required `1:1` Update |
| ----- | ----- | ----- |
| `voter-model-0.5.js` (line 2 master object) | `populationUnit: "Each sample voter represents 100 real voters."`, `sampleVoters: 1550000`, per-state `sampleVoters` & `affiliations` (`1:100`), per-district `sampleVoters`, `affiliations`, and `segments` (`firstVoterId`, `count`) at `1:100`. | Convert master `VERSION_05_VOTER_MODEL` (either in-file or via startup normalization) so `sampleVoters === representedVoters === 155000000`, `populationUnit: "1:1 represented voters"`, and all state/district `affiliations` and `segments` counts are native `1:1` integers (exact `×100` of legacy sample counts). |
| `engine.js` (`reconcileVoterModel`, lines 197–231) | Divides `sumDem`, `sumRep`, `sumInd`, `sumMinor`, `libSum`, `grnSum`, `conSum`, `socSum`, and `stRep` by `/ 100`; multiplies `st.sampleVoters * 100`. | Store direct `1:1` integers (`st.affiliations.people = Math.round(sumDem)`, etc.); set `st.sampleVoters = st.representedVoters = stRep`; remove all `/ 100` and `* 100` conversions. |
| `engine.js` (lines 376–377, 943, 1377, 2166, 2451, 2533–2571, 3059, 3492, 3954) | `representedVoters = sampleVoters * 100`; `shift = Math.round(fVoters / 100)`; `sampleDelta = Math.round(voterCount / 100)`; `Math.round(halved / 100)`; `exact = rep / 100`. | Replace every `Math.round(x / 100)` with `Math.round(x)` and every `sampleVoters * 100` with `representedVoters` directly so voter transfers (`+1,000` state leg slate, `100,000` custom faction, chapter growth, realignment) operate cleanly in `1:1` integer voters. |
| `party-systems-robots.js` | `SYNTHETIC_SAMPLE_VOTERS = 1_550_000` paired with `SYNTHETIC_ELECTORATE_VOTERS = 155_000_000`. | Set `SYNTHETIC_SAMPLE_VOTERS = 155_000_000` so Era #16 synthetic suffrage adds `155,000,000` native `1:1` robot voters (total `310,000,000`) with zero `100×` conversion. |
| `app.js` (lines 882, 887, 889, 2109–2118 \[QA Fix #5\], 5806, 5813, 5829–5830, 6379, 6390–6401) | Multiplies `aff.thirdParty.byParty[pid] * 100`, `voters.representedVoters * 100`, `voters.affiliations.people * 100`, `st.sampleVoters * 100`, `aff[pid] * 100`, and \`rawOther = (aff.other |  |
| `app.js` (lines 10235, 10278) | Custom-100K state allocation slider snaps to multiples of `100` (`Math.round(raw / 100) * 100`). | Keep clean `100`-voter UI slider step (or allow `1`-voter fine input) while validating exact `100,000` native `1:1` voters. |
| `engine.js` (`migrateLoadedGame`) | Assumes legacy saves use `1:100` `sampleVoters`. | Detect legacy `1:100` saves (`voterModel.sampleVoters < 10_000_000`) and automatically scale `sampleVoters`, `affiliations`, and `districts` counts by `×100` once on load, stamping `voterModel.voterScale = '1:1'`. |

## 9. Approved New Campaign Actions (Paired with 8 Actions/Month Budget)

All 5 approved actions below plug directly into the 8-actions/month Campaign Phase economy and respect the Section 1.2 Monthly Persuasion/Turnout efficiency curve:

1. **Micro-Targeted Faction Ads (`campaign-microtarget-faction` — Persuasion + Membership):**

   * **Cost:** `1 action` + `$1.5M` treasury.

   * **Effect:** Targets one chosen faction across a selected region (rather than an entire state). Delivers a strong persuasion lift to that faction (scaled by the active month's Persuasion Efficiency, peaking in Months 1–2) at **50% lower airwaves saturation** than broad state ads, **plus a small boost to party `memberships` (`+3` to `+6`, scaled by ideological alignment with the targeted faction)**.

2. **Statewide Town Hall Barnstorm (`campaign-town-hall-barnstorm` — Hybrid Persuasion + Turnout):**

   * **Cost:** `1 action` + `$500K` treasury.

   * **Effect:** Sends your nominee on a multi-county town hall tour in one state. Lifts Independent persuasion (scaled by Persuasion Efficiency), improves local candidate quality perception, **and grants a small base turnout boost (`+0.8%` base turnout scaled by the active month's Turnout Efficiency)**. Grants higher upside for `Polished` and `Rising Star` nominees; carries a small gaffe trigger risk for `Undisciplined` nominees.

3. **Coalition Unity Summit (`campaign-coalition-unity-summit` — Coalition Stabilization):**

   * **Cost:** `1 action` + `$0` treasury.

   * **Effect:** Convenes two feuding or unhappy factions in your party; raises both factions' `factionHappiness` by **`+5`** (through `applyScaledFactionHappinessDelta`), clears pending Month 3–4 Trail Ultimatum risk for those factions, and costs **`-1` Independent Trust**.

4. **Third-Party Spoiler Wedge / Vote-Splitting Blitz (`campaign-spoiler-wedge` — Persuasion, Major Parties Only):**

   * **Cost:** `1 action` + `$1.5M` treasury (locked to Major Parties only).

   * **Effect:** Quietly amplifies a minor party that ideologically overlaps your *opponent's* base in a target swing state, siphoning **`1.0%–2.0%`** from your rival (scaled by Persuasion Efficiency). Carries a `20%` exposure chance that triggers a minor Independent Trust (`-2`) and editorial blowback penalty.

5. **Grassroots Viral Livestream / Small-Dollar Telethon (`campaign-viral-telethon` — Fundraising + Membership):**

   * **Cost:** `1 action` + `$0` treasury.

   * **Effect:** Raises emergency mid-campaign treasury cash (**`$2.0M–$5.0M`** scaled by nominee `mediaSavvy`, `fame`, and grassroots multiplier) **and grants a direct boost to party `memberships` (`+4` to `+10` — explicitly boosting membership, NOT turnout)**. Especially strong for third parties and `Rising Star` nominees (cooldown: once per month).

## 10. Additional `v0.17.1` QA Fixes & Explicit Preservation Rules

* **QA Fix #4 — Scrub Leftover `"SOC"` / `"Socialist"` UI Labels (`app.js`):**

  * Update `getElectionPartyShort('socialist')` from `'SOC'` → `'PFP'`.

  * Update the short-label fallback (`canonicalId === 'socialist' ? 'Soc'`) → `'PFP'`.

  * Update the voter-registration table column header (`data-reg-sort="soc"`) from `Socialist` → `Peace & Freedom`.

  * Preserve internal party ID `'socialist'` everywhere for save and voter-model compatibility.

* **Explicit Preservation Rule (QA #3 — DO NOT PRUNE):**

  * Do **not** delete or prune retired politicians from `game.politicians` in `compactGameForSave()` or `startNextCycleInternal()`. Full historical politician rosters must be preserved across long games.