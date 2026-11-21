# Coalition Builder: Party Chair — Election Night Broadcast Screen Design (`ELECTION_NIGHT_DESIGN.md`)

**Status:** Formal Design Specification (Ready for Implementation)  
**Reference Blueprint:** Modeled faithfully on *Battle for America 2028*'s Election Night Decision Desk (`v35.0.0`), adapted natively to *Coalition Builder: Party Chair*'s multi-party (6+ parties & custom parties), 155M-voter, Presidential/Midterm, and electoral-reform (`REQ-185` / `MAS-01`) architecture.  
**Art Direction:** AI Games Studio palette (`GAME_STYLE_GUIDE.md` Section 3 — Deep Navy `hsl(226 24% 7%)`, Raised Navy `hsl(226 21% 12%)`, Warm Ivory `hsl(42 25% 92%)`, Muted Copper `hsl(32 48% 48%)`, Muted Teal `hsl(174 36% 56%)`, Coral `hsl(7 62% 59%)`, plus official Party Colors).

---

## 1. Executive Overview & Player Experience

Instead of jumping straight from the final campaign turn to a static *"Election Night is Decided"* summary panel, concluding the General Election Campaign launches a **fullscreen, real-time Election Night Decision Desk** spanning **`7:00 PM ET` to `4:00 AM ET`** (with speed controls and an instant `Skip to the end` button).

### Core Pillars Copied & Adapted from *Battle for America*
1. **Authentic 51-Jurisdiction Poll-Closing Schedule:** States remain muted slate (`polls not closed / too early to call`) until their real Eastern Time poll-closing minute arrives—from `7:00 PM ET` (GA, IN, KY, SC, VT, VA) through `1:00 AM ET` (AK).
2. **Non-Linear, Variable-Drop Ballot Simulation (Zero Artificial Linearity):** Votes do **not** tick upward smoothly or linearly. Each race's precomputed final vote total is fractured into hundreds of **log-uniformly sized ballot drops (`100` to `10,000` ballots)**, each assigned an independent **Box-Muller Gaussian partisan lean skew (`σ = 13.333` pts)** drawn strictly from each party's remaining uncounted vote pool. This organically creates rural early surges, big metro/mail-in dumps, "red mirages," "blue shifts," and dramatic lead changes—while guaranteeing **100% exact mathematical convergence** to the precomputed Election Night result when `100%` is counted.
3. **13-Tier Margin-vs.-Reporting Race-Calling Engine:** Blowouts (`≥15%`) call right at poll close, mid-tier races call only after passing strict reporting thresholds *and* confirming the eventual winner actually leads in live counted ballots, and nail-biters (`<3%`) hold until `100%` is counted.
4. **5 Multi-Race Tabs + Dual Map Color Modes:** Switch seamlessly live during the count between **President**, **Senate**, **House**, **Governors**, and **State Legislatures**, toggling between **Winner** mode (dark called / light counting / slate unreported) and **Margin of victory** mode, with state fill opacity brightening dynamically as more ballots report (`0.40 -> 1.00`).
5. **Live Broadcast Desk Sidebar:** Real-time multi-party scoreboard, **Sallow Live Desk Forecast** (recomputing every 15 simulated minutes by blending counted ballots with remaining-vote expectations), reverse-chronological clickable **"Just Called"** feed, and **"The Count"** live table sorted **closest races first**.

---

## 2. Architecture & File Layout

Keep the Election Night simulation engine cleanly decoupled from `engine.js` and `app.js`:

- **`election-night-engine.js`** *(New standalone module, loaded before `app.js`)*
  - Pure deterministic timeline generator (`buildElectionNightTimeline(game, election)`), snapshot evaluator (`evaluateElectionNightAt(timeline, elapsedMinutes)`), non-linear ballot-drop generator, 13-tier Decision Desk caller, and live 15-minute Monte Carlo forecast engine (`computeLiveDeskForecast(...)`).
  - Zero DOM dependencies — 100% unit-testable in Node (`scripts/test-election-night.cjs`).
- **`app.js`** *(UI Integration)*
  - Renders the fullscreen Election Night Broadcast Desk (`renderElectionNightScreen()`) whenever `game.electionNight?.active === true`.
  - Manages `setInterval` playback loop (`100ms` tick), speed/pause state, active race tab, map color mode (`winner` vs. `margin`), expanded "Just Called" call-card inspection, and dismissible breaking-call banner.
  - Clicking **`See the full results`** clears `game.electionNight.active = false` and hands seamlessly off into *Party Chair*'s existing Post-Election flow (Recounts if enabled, 12th Amendment Contingent Election `REQ-191`, Kingmaker Caucus `REQ-187`/`188`, Election Autopsy, and Inter-Cycle Realignment).
- **`styles.css`** *(Broadcast Desk Styling)*
  - AI Games Studio dark-navy broadcast console, pulsing live pill, tabular numerals (`font-variant-numeric: tabular-nums`), pop-in call animations, responsive 2-column (`1.5fr / 1fr`) layout, and closest-first live count bars.

---

## 3. Simulation Engine Specification (`election-night-engine.js`)

### 3.1. Clock, Poll-Closing Schedule & Reporting Pace
- **Start Time:** `START_MINUTE = 1140` (`7:00 PM ET`).
- **Elapsed Time `t`:** Measured in simulated minutes from `7:00 PM ET` (`t = 0` → `7:00 PM ET`).
- **51-Jurisdiction Poll-Closing Table (`POLL_CLOSE_MINUTES`):**

| Poll Close (ET) | Minute Offset (`t`) | Jurisdictions |
| :--- | :---: | :--- |
| **7:00 PM ET** | `0` | GA, IN, KY, SC, VT, VA |
| **7:30 PM ET** | `30` | NC, OH, WV |
| **8:00 PM ET** | `60` | AL, CT, DC, DE, FL, IL, KS, ME, MD, MA, MI, MS, MO, NH, NJ, OK, PA, RI, TN, TX |
| **8:30 PM ET** | `90` | AR |
| **9:00 PM ET** | `120` | AZ, CO, IA, LA, MN, NE, NM, NY, ND, SD, WI, WY |
| **10:00 PM ET** | `180` | MT, NV, UT |
| **11:00 PM ET** | `240` | CA, ID, OR, WA |
| **12:00 AM ET** | `300` | HI |
| **1:00 AM ET** | `360` | AK |

- **State-Scaled Reporting Duration:**
  - *Battle for America* spans every state from its `close` up to `end = maxClose + 180` (`540` min = **`4:00 AM ET`**), while narratively describing *"two hours in the smallest, six in the largest."*
  - **Exact Duration Formula:** Scale each state's `duration` by state electorate/EV weight between **`120` minutes (2 hours)** for tiny states (`3–4` EV, e.g., VT, WY, AK) and **`360` minutes (6 hours)** for mega-states (CA, TX, FL, NY, PA), capped so `close + duration <= 540` (or setting `end = max(close + duration)` across all active races, roughly `3:30–4:30 AM ET`). This ensures small Eastern states finish counting around `9:00–10:00 PM ET` while giant battlegrounds (PA, MI, WI, AZ, GA, CA) stretch suspensefully past midnight!
- **Playback Speeds:**
  - Tick interval: `TICK_MS = 100` (`10` FPS smooth clock & count updates).
  - Base rate: `BASE_MIN_PER_SEC = 3` simulated minutes per real second (`0.3` min per `100ms` tick → a full 9-hour night runs in ~3 minutes at `1×`, ~90s at `2×`, ~45s at `4×`, ~22s at `8×`).
  - Controls: **`Pause / Play`**, **`1×`**, **`2×`**, **`4×`**, **`8×`**, and **`Skip to the end`** (jumps `t = timeline.end`).

### 3.2. Non-Linear Reporting Method (The Core Algorithm)

To guarantee **non-linear, lumpy, realistic vote counting** with **zero drift from the final certified election result**, every race with party vote shares uses *Battle for America*'s **Seeded Log-Uniform Ballot-Drop Pool Algorithm**:

#### Step 1 — Deterministic Seeding (`fnv1aUnit(key)`)
Use a fast 32-bit FNV-1a hash normalized to `[0, 1)` seeded with `${game.year}|${game.seed || playerPartyId}|${raceKind}|${raceId}` so scrubbing/re-evaluating at any minute `t` is **100% deterministic** and flicker-free.

#### Step 2 — Exact Integer Final Vote Pool (Largest-Remainder Method)
Given total modeled ballots `cast = max(100, round(raceCastBallots))` (for performance while preserving 155M-scale proportions, internally simulate drops on a scaled ballot count e.g. `1:100` = `1.55M` total national agents, matching *Party Chair*'s `1:100` internal voter scale, and multiply displayed raw vote counts by `100` if shown):
1. Normalize all competing parties' final vote shares (`people`, `heritage`, `liberty`, `green`, `constitution`, `socialist`, `independent`, `player`/custom, plus any active `MAS-01` parties) to sum to `100%`.
2. Compute exact integer vote targets `remaining[p] = floor(cast * share[p] / 100)` and distribute the rounding remainder `+1` to the parties with the largest fractional remainders.
3. Result: `sum(remaining) === cast` exactly.

#### Step 3 — Log-Uniform Random Drop Sizes (`100` to `10,000` units)
Slice `cast` into a sequence of discrete ballot drops `sizes[]`:
```js
let left = cast;
let idx = 0;
while (left > 10000) {
  const u = fnv1aUnit(`${seed}|size|${idx}`);
  const raw = Math.round(100 * Math.pow(100, u)); // log-uniform in [100, 10000]
  const size = Math.max(100, Math.min(10000, left - 100, raw));
  sizes.push(size);
  left -= size;
  idx += 1;
}
if (left > 0) sizes.push(left);
```
- **Why Log-Uniform Matters:** Most batches are small-to-medium (`100–1,500`, mimicking individual rural/suburban precincts), punctuated irregularly by huge metro/mail-in dumps (`4,000–10,000`), creating an unmistakably **non-linear, bursty** reporting cadence!

#### Step 4 — Per-Drop Gaussian Partisan Skew & Constrained Pool Draw
For each drop `i` of size `sizes[i]`:
- **If `i === sizes.length - 1` (final drop):** Release `{ ...remaining }` verbatim so cumulative totals equal the exact precomputed final result.
- **Otherwise:**
  1. Draw a Box-Muller standard normal deviate `Z = sqrt(-2 * ln(max(1e-4, u1))) * cos(2 * PI * u2)`.
  2. Compute partisan shift `delta = Z * 13.333` percentage points.
  3. **Multi-Party Skew Extension (for *Party Chair*'s 6+ Party System):**
     - Shift the top-2 parties symmetrically (`top1 += delta`, `top2 -= delta`, floored at `0.2%`), and apply a smaller independent Gaussian jitter (`Z_k * 3.5` scaled by party share) to any active third/minor parties with `> 1%` share so minor-party strongholds (e.g., Green campus precincts, Libertarian Mountain-West counties) also surge and recede organically!
     - Re-normalize shifted batch shares to `100%`.
  4. **Constrained Integer Allocation (`allocateDropFromPool`):** Distribute `sizes[i]` ballots proportionally to the skewed batch shares, **strictly capping** each party at its `remaining[p]` uncounted votes (redistributing overflow among still-available parties), and decrement `remaining[p]`.
  5. **Non-Linear Timestamp Spacing:** Assign each drop a reporting timestamp:
     ```js
     // Slight concave pacing + per-drop jitter, sorted monotonically inside [close, close + duration]
     const progress = (i + 1) / sizes.length;
     const concave = Math.pow(progress, 1 / 1.15); // early burst, slower late-mail tail
     const time = close + duration * concave;
     ```

#### Step 5 — Concave Fallback Curve (Aggregate Races Without Ballot Pools)
For any chamber/aggregate race without per-ballot drops (e.g., nonpartisan unicameral Nebraska or summary state legislative chambers):
- Progress curve: `pct = 100 * (1 - Math.pow(1 - clamp((t - close) / duration, 0, 1), 1.4))`
- Decaying skew: `skew(pct) = initialSkew * Math.pow(1 - pct / 100, 0.9)`, clamped inside a strict late-count envelope (`uncapped` below `79%`, linearly tightening from `2.0 -> 1.0` across `79–89%`, and `1.0 -> 0.0` across `89–99%`).

### 3.3. 13-Tier Decision Desk Race-Calling Rules

Identical to *Battle for America*'s proven suspense curve (`CALL_TIERS`):

| Final Winning Margin (`|lead|`) | Min `% Counted` Required | Must Eventual Winner Currently Lead? |
| :---: | :---: | :---: |
| `≥ 15.0%` | `0%` *(calls immediately at poll close)* | No |
| `14.0% – 14.9%` | `4%` | No |
| `13.0% – 13.9%` | `11%` | **Yes** |
| `12.0% – 12.9%` | `18%` | **Yes** |
| `11.0% – 11.9%` | `28%` | **Yes** |
| `10.0% – 10.9%` | `41%` | **Yes** |
| `9.0% – 9.9%` | `59%` | **Yes** |
| `8.0% – 8.9%` | `68%` | **Yes** |
| `7.0% – 7.9%` | `75%` | **Yes** |
| `6.0% – 6.9%` | `84%` | **Yes** |
| `5.0% – 5.9%` | `91%` | **Yes** |
| `3.0% – 4.9%` | `95%` | **Yes** |
| `< 3.0%` | `100%` *(holds until final drop)* | N/A |

- **RCV / Multi-Party Handling:** For states using Ranked-Choice Voting (`REQ-185`, e.g., Alaska), the live count displays live first-choice / RCV leader shares and calls only when the RCV margin satisfies the tier rule.
- **No Premature Wrong Calls:** Because tiers `3%–13%` require `currentLiveLeader === finalWinner`, a state experiencing a red mirage or blue shift **cannot** be falsely called early—the desk visibly holds the call until the real leader overtakes in counted votes!

### 3.4. Live Desk Forecast ("Sallow Live Forecast")

Modeled on *Battle for America*'s **Nick Bronze Live Forecast**, re-evaluated every **`15` simulated minutes** (`Math.floor(t / 15) * 15`) so it updates smoothly without jittering every 100ms:
1. **Blended State Expectation:** For every reporting race, blend its pre-election model baseline (`expectedMargin`) with its live counted margin (`liveMargin`) weighted by `pct / 100`:
   $$\text{blendedMargin}_s = \text{expected}_s + (\text{liveMargin}_s - \text{expected}_s) \cdot \frac{\text{pct}_s}{100}$$
2. **Shrinking Remaining Uncertainty:** Run **`120` seeded Monte Carlo draws** combining correlated national shock + regional shock + state noise, each multiplied by remaining uncounted fraction `(1 - pct / 100)`. Once a state reaches `100%` (or is called), its variance drops to `0`.
3. **Display Adaptation (Honoring *Party Chair* Forecaster Branding & Multi-Party):**
   - **President Tab:** Displays **Sallow Live Desk Forecast** (`reported votes + remaining-vote model`) with live win odds for top competing tickets (including viable third parties / Independents if `>1%` odds) and `"projections, not calls"` sublabel.
   - **Senate & House Tabs:** Displays **Sallow Live Control Forecast** showing chamber control probabilities (`D control`, `R control`, any viable third-party/coalition control, and `Hung / No Majority` chance!) plus **median seat estimate & 80% seat range** (e.g., `D median 224 · 80% range 214–235`).

---

## 4. Screen Layout, Race Tabs & UI Components

### 4.1. Top Decision Desk Header Bar (`GV` Equivalent)
Single responsive top bar spanning the full width (`max-width: 1280px`):
- **Left Cluster:**
  - Status Pill: Pulsing Coral/Red **`● LIVE`** badge while counting; switches to warm gold **`★ CALLED`** when `t >= end`.
  - Live Clock: Bold tabular-nums clock (`7:00 PM ET` → `4:00 AM ET`).
  - Desk Label: `DECISION DESK · NOV [DAY], [YEAR]`.
- **Right Cluster:**
  - **4-Phase Indicator** (label + 4 progress pips):
    - *Presidential Year:* `1. Polls close` → `2. Early returns` → `3. Decisive states` → `4. Presidency called` *(or `No Electoral College majority`)*
    - *Midterm Year:* `1. Polls close` → `2. Early returns` → `3. Battleground counts` → `4. All races called`
  - **Playback Controls:** `⏸ / ▶` Pause/Resume button, speed pills **`1×`**, **`2×`**, **`4×`**, **`8×`** (active pill highlighted in Muted Copper/Gold), and **`Skip to the end ⏭`** button.

### 4.2. Dismissible Breaking-Call Banner (`NH` Equivalent)
Pops in directly below the Decision Desk header with a copper/gold gradient border and angled stamp badge when a major national threshold is clinched:
- **Presidential Year:** Triggers the instant any ticket hits **`270` called Electoral Votes**:
  - Stamp: `THE PRESIDENCY IS CALLED`
  - Headline: `[Nominee Name] wins the White House`
  - Subline: `[Winner EV]–[Runner-up EV] · [X]% counted` (plus third-party EV if any)
  - Dismiss `✕` button so the player can keep watching downballot races cleanly.
- **Midterm Year:** Triggers when either **U.S. House (`218` seats)** or **U.S. Senate (`51` seats)** control is officially clinched by the desk (with dismiss `✕`).

### 4.3. Main 2-Column Broadcast Grid (`1.5fr` Left / `1fr` Right)

#### Left Column — Top: Interactive Multi-Race Map Panel (`OH` Equivalent)
1. **Top Toolbar:**
   - **5 Race Tabs** (pill segmented control):
     1. **`President`** *(hidden or replaced by `White House` summary badge in Midterm years, defaulting active tab to `Senate` in Midterms and `President` in Presidential years)*
     2. **`Senate`** *(Class I/II/III seats up this cycle + carried seats)*
     3. **`House`** *(State summary map + clickable state drilldown / district table; supports Standard 435-district, Proportional `PR`, and `MMP` list-seat rules!)*
     4. **`Governors`** *(Scheduled gubernatorial races this cycle)*
     5. **`State Legislatures`** *(50-state chamber control map, rendering solid whole-state purple for split control and slate-gray for Nebraska's nonpartisan unicameral)*
   - **Map Color Mode Toggle** (top-right):
     - **`Winner`** *(Default)*: Dark saturated party color = **Called**; bright/medium party color = **Leading (counting)**; muted slate `#22304F` = **Polls not closed / not reporting**.
     - **`Margin of victory`**: Intensity gradient showing safe vs. tilt margins across reporting states.
2. **Interactive US Map:**
   - Reuses *Party Chair*'s existing SVG US map geometry (including DC inset, ME/NE congressional district dots on the President tab, and tooltips showing `{State} · {EV/Seats} · {Leader +Margin} · {X}% counted · {called/counting}` or `{State} · too early to call`).
   - **Dynamic Map Brightness:** `fillOpacity = reporting ? (0.40 + 0.60 * (pct / 100)) : 1.0` so states visibly brighten as their count fills in!
   - Clicking a state highlights it in "The Count" list below (or filters House districts for that state on the House tab!).
3. **Map Footer & Legend:**
   - Left: Live summary string tailored to the active tab (e.g., `241D – 219R · 12L called · 78% of the vote in` or `312 of 435 districts called`).
   - Right: Reporting counter (`39 of 51 states called`, `64 chambers counting`, etc.).
   - Legend swatches (`Called`, active competing parties, `Not reporting`) + subtle helper note (`Map brightness shows vote counted` on President; `State summary map · district results are in the list below` on House).

#### Left Column — Bottom: `"The Count"` Live Closest-First Table (`jH` Equivalent)
- Header: **`THE COUNT`** (left) · **`closest first`** (right).
- Displays every currently reporting race for the active tab, sorted ascending by `Math.abs(liveLead)` so nail-biters automatically bubble to the very top!
- Each row (`max-height: 280px`, scrollable):
  - **Code:** `PA`, `GA`, `PA-07`, `AZ-Upper`, etc.
  - **Race Name:** `Pennsylvania`, `Pennsylvania 7th`, `Arizona Senate`, etc.
  - **Live Leader & Margin:** Colored by current live leader (e.g., `DEM +0.4`, `REP +1.1`, `GRN +2.8`, `IND +0.9`).
  - **Mini Progress Bar:** `3px` tall bar filled to `pct%` in the current leader's party color.
  - **Status Column:** Gold **`CALLED`** label once called, or tabular **`64%`** while counting.
- Before `7:00 PM ET` / first poll close: `No polls have closed yet.`

#### Right Column — Top: Active Tab Scoreboard + Live Forecast (`kH` + `AH` Equivalent)
- **Scoreboard Header:** Active tab title (`The Presidency`, `The Senate`, `The House`, `The Governorships`, `State Legislatures`) + national tab **`X% counted`**.
- **Multi-Party Big Numbers & Progress Bar:**
  - Displays the player's party and primary rival prominently on left/right (e.g., big `30px` tabular numerals) with threshold label in the center (`270 to win`, `51 to win`, `218 to win`, or `called`).
  - **Party Chair Multi-Party Upgrade:** Whenever any 3rd/4th party (Libertarian, Green, Constitution, Socialist, Independent, Custom, or `MAS-01` Regional/Robot party) holds called EVs/seats (`> 0`), renders a crisp **multi-segment stacked bar** plus compact colored pill chips below the bar so minor-party breakthroughs are immediately celebrated!
- **Embedded Sallow Live Forecast Card:** Live presidential win odds (`President` tab) or chamber control odds + median/80% seat range (`Senate` / `House` tabs).
- **Scoreboard Footer:** Progress count (`38 of 51 states called`) + right-aligned **`Called by the desk`** (emerald/teal) or **`No call yet`**.

#### Right Column — Middle: `"Just Called"` Play-by-Play Feed (`MH` Equivalent)
- Header: **`JUST CALLED`**
- Reverse-chronological scrollable feed (`max-height: 260px`) of every call across **all 5 tabs** (optional tiny tab filter toggle `All | Current Tab` so the player can either watch the full firehose or focus on one race type!).
- Each newly called race animates in (`pop-in`) showing:
  - Race badge/icon (`PRES`, `SEN`, `HOU`, `GOV`, `LEG`) + Race Name (`Georgia`, `MI-07`, `Ohio Senate`)
  - Winning Party pill (colored) + Exact Call Timestamp (`9:42 PM ET`)
- **Clickable Expandable Call Detail:** Clicking any item opens an inline broadcast note underneath:
  - *Example:* `Georgia (Presidential): 91% counted when called. Democrats led by 5.4 points when the Decision Desk made the call; remaining uncounted ballots are no longer enough to close the gap.`
  - *(Note: Respects `GAME_STYLE_GUIDE.md` Rule 7 — frames the call explanation in realistic broadcast-desk prose rather than exposing raw internal formula constants like `sH` or `finalMargin` before `100%` is counted!)*

#### Right Column — Bottom: Pacing Footer / Completion Card
- **While Counting:** Subtle caption: *"States report at their own pace: two hours in the smallest, six in the largest. The desk calls a race once the margin is safe at the share counted."*
- **When `t >= end` (All Ballots Counted):** Pops in a bordered **Final Decision Card**:
  - Eyebrow: `ALL RETURNS COUNTED`
  - Headline: Winning Presidential ticket (or `Electoral College Deadlock — House Contingent Election` / Midterm Chamber Control headline).
  - Concise summary line (final EC score or House/Senate majority tallies).
  - Full-width primary Copper/Gold CTA button: **`See the full results →`** — exits the Election Night Broadcast Desk and opens Party Chair's existing Post-Election Autopsy, Recount/Contingent/Kingmaker modals, and Next Cycle flow.

---

## 5. Edge Cases & Integration with *Party Chair* Systems

1. **Midterm Cycles (2030, 2034, …):**
   - No `President` race exists; default active tab is **`Senate`** (or `House`), header reads `Midterm Decision Desk`, and Phase 4 triggers when House & Senate control are both called.
2. **Third-Party / Custom Party Player:**
   - Scoreboard left side always showcases the **player's party** (with its custom name and color) against the leading opponent, while every other seat-winning party appears dynamically in the multi-segment bar and "Just Called" feed.
3. **Electoral Systems (`REQ-185` / `MAS-01 #18`):**
   - **Alaska RCV:** Live count evaluates RCV rounds on currently counted ballots before calling.
   - **Proportional House (`PR`) & Nationwide `MMP`:** Matches *Battle for America*'s `houseRule` handling (`state-allocation` calls for PR; `district` + `list-seats` calls for MMP).
4. **Electoral College Deadlock (`REQ-190` / `REQ-191`) & Hung Chambers (`REQ-187` / `REQ-188`):**
   - If `100%` of states are called with no ticket at `270 EV`, Phase 4 displays `No Electoral College majority`, the completion card announces a **12th Amendment Contingent Election**, and clicking **`See the full results →`** immediately opens the Contingent Election modal.
5. **Save / Reload Safety:**
   - Precomputed `game.election` is committed before the Election Night Broadcast Desk opens, with `game.electionNight = { active: true, year: game.year }`. Reloading mid-broadcast cleanly resumes Election Night (or lets the player `Skip to the end`) with zero state corruption or double-counting of inter-cycle realignments!
6. **Zero-Performance-Lag Guarantee (435 House Districts + 50 States):**
   - For the 435 House districts, generate compact drop counts (`12–24` variable drops per district, log-uniform scaled to district ballots) so `buildElectionNightTimeline()` runs in **< 40ms** and each `100ms` tick evaluates in **< 5ms**.

---

## 6. Verification & Automated Test Checklist (`scripts/test-election-night.cjs`)

1. **Non-Linearity Verification:** Assert that for sample competitive states (PA, GA, MI, WI, AZ), intermediate `pct` increments are non-uniform (variance of step deltas `> 0`) and live margins fluctuate realistically (not constant equal to final margin) across early drops.
2. **100% Exact Convergence:** Assert that at `t = timeline.end`, every single Presidential state, ME/NE district, Senate race, House district (all 435), Governor race, and State Legislature chamber matches `game.election`'s final shares and winners to exact precision.
3. **Poll-Closing Discipline:** Assert that at `t = 0` (`7:00 PM ET`), only 7:00 PM ET states can begin reporting, while CA (`t = 240`) and AK (`t = 360`) remain strictly at `0%` reporting before their poll-closing minutes.
4. **13-Tier Call Discipline:** Assert a `16%` blowout calls at poll close, a `6.5%` race does not call before `84%` counted (and never while the winner trails in live drops), and a `1.2%` nail-biter holds until `100%`.
5. **Multi-Party & Midterm Compatibility:** Verify clean timeline generation for (a) 2028 Presidential 6-party race, (b) 2030 Midterm cycle (no Presidential tab), (c) Custom party player, and (d) Electoral College deadlock (`< 270` EV).
