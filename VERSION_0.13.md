# Coalition Builder: Party Chair — Version 0.13

Version 0.13 expands multi-decade gameplay with persistent politician career progression, high-office ascension pipelines, strategic Super PAC victory compacts, dynamic petition-based ballot access, competitive presidential primaries, and granular faction alignment.

---

## 1. Generational Bench Cultivation & Post-Chair Legacies (`REQ-89` to `REQ-93`, `REQ-106`)

- **Politician Seniority & Career Milestones (`REQ-89` / `BENCH-01`):**
  - Added persistent service records tracking terms completed across offices (`house`, `senate`, `governor`, `stateLeg`) and career achievements.
  - Sitting members accumulate $+2$ to $+5$ Fame per cycle based on national visibility and chamber status. Net approval dynamically evolves with legislative achievements and state performance.
- **The Bench Ascension Pipeline (`REQ-90` / `BENCH-02`):**
  - U.S. Senate and Gubernatorial primary generators query sitting House representatives with $\text{Fame} \ge 45$ and positive net approval to step forward and enter statewide primary fields.
  - Ascending members vacate their congressional district seats, triggering authentic open-seat primary domino effects across the map.
- **Party Chair Mentorship & "Rising Star" Designation (`REQ-91` / `BENCH-03`):**
  - Added the *"Designate Rising Star"* leadership action ($1\text{ action} + \$2\text{M}$ surrogate development fund) for up to 2 high-potential politicians ($\text{Fame} < 50, \text{Quality} \ge 7$), yielding accelerated fame and popularity gains over 10 turns.
- **Politician Aging, Retirement & The Council of Party Elders (`REQ-92` / `BENCH-04`):**
  - Politicians age 2 years per cycle. At age 70+, annual retirement rolls begin (20% base probability, $+15\%$/cycle thereafter).
  - Retiring leaders with Net Approval $\ge +20$ transition into the **Council of Party Elders**, providing an immutable $+1.5$ Confidence stabilization floor to their home faction.
- **Bench Roster UI & Pipeline Scannability Filter (`REQ-93` / `BENCH-05`):**
  - Added quick-filter tabs to the Sitting Members screen (`[All]`, `[Rising Stars]`, `[Ready for Higher Office]`, `[Party Elders]`) and high-contrast copper chevrons marking higher-office contenders.
- **Major Party Restlessness Fame Threshold Elevation (`REQ-106`):**
  - Raised the Fame threshold for major party politicians (Democrats and Republicans) to become restless and demand leadership roles from 75 to **90** (`fame >= 90`), while preserving the 75 threshold for minor parties.

---

## 2. Strategic Alignment Compacts & Super PAC Steering (`REQ-94` to `REQ-96`)

- **National Steering Summit & Joint Victory Compacts (`REQ-94` / `COMP-01`):**
  - Allied Super PACs offer major independent expenditure commitments ($12\text{M}$ to $20\text{M}$ reserved ad airtime) in exchange for governance commitments (appointing a factional campaign chair, prioritizing a specific policy plank, or aligning candidate profiles).
- **Institutional Accountability & Donor Capital Strikes (`REQ-95` / `COMP-02`):**
  - Explicitly reneging on accepted compact terms freezes external ad reserves, triggers an $\$8\text{M}$ donor treasury withdrawal, and penalizes base trust by $-4.0$. Honoring compacts grants a $+10\%$ budget bonus in the subsequent cycle.
- **Compact Status Tracker Widget (`REQ-96` / `COMP-03`):**
  - Embedded a dedicated tracking card in the Finance dashboard detailing partner PACs, promised reserves, agreed terms, and compliance states (*Honored*, *Pending*, *Violated*).

---

## 3. Petition-Based Ballot Access & Presidential Primaries (`REQ-102` to `REQ-104`, `REQ-107`)

- **Deterministic Starting Ballot Access & Petition System (`REQ-102` / `BALLOT-01`):**
  - Initial starting voter baselines initialized at $\sim 100\text{k}$ for both the Green Party and Constitution Party.
  - Deterministic ballot access map established: Green Party on ballot in 2024 Harris states (Senate, Gov, 80% House); Libertarians on ballot nationwide (100% Senate, 100% Gov, 50% House); Constitution & Socialist start at 0%.
  - Added petition mechanic: unlisted parties reaching $\ge 10{,}000$ registered voters in a state can successfully petition for ballot access.
- **2028 Competitive Presidential Primaries & Open Progression (`REQ-103` / `PRES-01`):**
  - 2028 Democratic primary features Jon Ossoff, Alexandria Ocasio-Cortez, and Gavin Newsom polling tightly.
  - 2028 Republican primary features Marco Rubio, J. D. Vance, and Ron DeSantis polling tightly.
  - Post-2028: Sitting presidents run unchallenged; open fields feature the top 10 favorability members.
- **"Filtering Support" & Faction Confidence Impact (`REQ-104` / `ENDORSE-01`):**
  - Rebranded endorsements to **"Filtering support"**, delivering a decisive $10\text{-point}$ primary polling swing.
  - Filtering support grants **$+1$ Confidence** to the supported candidate's faction and imposes **$-3$ Confidence** across all other party factions.
- **Party-Specific Faction Leadership Roles & Alignment (`REQ-107` / `LEAD-01`):**
  - Replaced generic placeholder slots with actual party factions (5 Democratic, 5 Republican).
  - Enforced strict factional membership: only politicians who belong to that specific faction can be appointed as its Faction Leader.

---

## 4. Engine Controls, Turn Flow & Polish (`REQ-88`, `REQ-97` to `REQ-101`, `REQ-105`)

- **Cumulative Inter-Cycle Electorate Growth (`REQ-88` / `GROWTH-01`):**
  - Electorate expands by $+3\%$ annually ($+6.09\%$ per 2-year cycle; $+9.44\text{M}$ voters in first cycle).
  - $100\%$ of new entrants register as Independents / Unaffiliated, naturally diluting partisan baselines and raising general election swing volatility.
- **Major Priorities Confirmation Modal (`REQ-97` / `MODAL-01`):**
  - Added explicit confirmation prompt: *"Are you sure? This can't change after being selected."* Permanently locks slots with padlock status indicators upon confirmation.
- **Terminology & "Party Focus" Expansion (`REQ-98` / `DECK-01`):**
  - Rebranded *Main Priority* to **"Major Priority"**.
  - Rebranded *Additional Priorities* to **"Party Focus"** and expanded capacity from 5 to **10 total slots**.
- **Synchronized Wave Momentum Gauge (`REQ-99` / `WAVE-01`):**
  - Wave Momentum gauge and needle position initialize directly from `game.nationalEnvironment` (starting at D+9.0) rather than defaulting to 0.0.
- **Conditional Senate Subtabs Display (`REQ-100` / `SENATE-01`):**
  - Scoped `.v07-senate-bar` exclusively to the Senate map view; hidden when viewing House, Governor, or State Legislature maps.
- **Organizing Phase Direct Action Pool (`REQ-101` / `ACTION-01`):**
  - Replaced the repetitive 20-turn "Confirm Turn" clicking cycle with a unified pool of **20 Pre-Campaign Leadership Actions** and a direct *"Resolve Primaries & Launch General Election Campaign"* transition control.
- **Stance Prose Typography Scaling (`REQ-105` / `SLIDER-01`):**
  - Scaled down `.v09-stance-callout` font-size to $11.5\text{px}$ to match `.v09-range-pole` boundary text, ensuring clean card proportions without text clipping.

---

## 5. Verification & Executable Release

- **Automated Verification:** `scripts/test-v013-integration.cjs` passed with **51/51 assertions (100% pass rate)**.
- **Canonical Windows Executable:** Compiled via `build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` (670,208 bytes / ~654 KB).
- **Save Version Schema:** Upgraded to `partyChairGame.save.v13` with seamless migration from v12 through v1.
