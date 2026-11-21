# Version 0.12 — The Multi-Cycle Federalism & Coalition Autopsies Update

**Build Target:** Version 0.12  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Multi-Cycle Continuous Realignment, State Legislative Bell-Curve Engine, Post-Election Autopsies, Atmospheric Dispatches & Autonomous Custom Parties*  
**Release Date:** November 13, 2026  
**Status:** Integrated, Verified, and Released  

---

## Executive Summary

Version 0.12 is a monumental release for *Coalition Builder: Party Chair*, transforming the game from a single-cycle campaign sandbox into a multi-decade grand political simulation. It introduces continuous election advancement across constitutional Senate class rotations, alternating Presidential and Midterm environments, a mathematically rigorous 100-seat bell-curve state legislative engine, post-election coalition autopsies with competing faction blame games, state party federalism with friction and receivership administration, a 13-tier blended consensus forecaster gradient, and fully autonomous custom party creation with real-world incumbent seat claiming.

Every system adheres strictly to the **155.00M represented-voter scale**, complete formula and decimal masking, clean qualitative feedback, and studio aesthetic invariants.

---

## 1. Multi-Cycle Election Advancement & Warchest Rollover (`REQ-70`, `REQ-67`)

- **Constitutional Senate Class Rotation:**
  - Continuous cycle transitions rotate the active U.S. Senate class strictly according to the constitutional schedule:
    $$\text{Class III} \longrightarrow \text{Class I} \longrightarrow \text{Class II} \longrightarrow \text{Class III}$$
  - 2028: Class III (34 seats) | 2030: Class I (33 seats) | 2032: Class II (33 seats) | 2034: Class III (34 seats), etc.
  - Active Senate race rosters automatically populate based on sitting senators and historical seat baselines.
- **Alternating Cycle Dynamics:**
  - Toggles between Presidential election cycles (with presidential top-of-ticket coattails and electoral college maps) and Midterm cycles (focused on congressional and gubernatorial control).
- **Staggered Gubernatorial Calendars:**
  - Midterm elections contest 36 gubernatorial seats (TX, FL, NY, CA, PA, MI, OH, GA, NV, AZ, etc.).
  - Presidential elections contest 11 gubernatorial seats (DE, IN, MO, MT, NC, ND, UT, WA, WV, etc.).
  - Two-year states (NH, VT) contest gubernatorial races on every ballot.
- **Probabilistic Macro National Environment Engine:**
  - Computes the national environment for subsequent cycles using Gaussian distributions $\mathcal{N}(\mu, \sigma)$ with deterministic cycle seed hashing:
    - **Midterm Fatigue:** Incumbent president's party faces headwinds $\sim 80\%$ of the time ($-3.0$ to $-7.0$ points), with $\sim 20\%$ chance of neutral or favorable terrain.
    - **First-Term Re-Election Benchmark ($\sim 90\%$ Win Rate):** First-term incumbents receive natural structural incumbency bonuses ($+2.5$ to $+5.0$ environment rebound), winning $\sim 90\%$ of the time under standard play.
    - **Successor Nominee Benchmark ($\sim 90\%$ Loss Rate):** Two-term fatigue shifts the environment toward the out-party such that successors lose $\sim 90\%$ of the time without extraordinary overperformance.
- **Persistent Warchest Rollover (`REQ-67`):**
  - 100% of unspent treasury rolls over cleanly turn-to-turn and from election night into the next cycle's organizing phase for both the player and AI rival organizations.

---

## 2. State Legislature Seat Assignment Engine (`REQ-72`)

- **Standardized 100-Seat Bell-Curve Function (`seatsForVoteShare100`):**
  - **Threshold:** $< 15\%$ vote share = **0 seats**.
  - **Monopoly:** $\ge 85\%$ vote share = **100 seats** ($100\%$).
  - **Piecewise S-Curve Formula:**
    - Zone 1 ($15\% \le V < 40\%$): $\text{Seats}_{100}(V) = (V - 15) \times 0.40$ (gains $10\%$ seats across 25 pts).
    - Zone 2 ($40\% \le V < 60\%$): $\text{Seats}_{100}(V) = 10 + (V - 40) \times 4.0$ (steep swing zone; gains $80\%$ seats across 20 pts).
    - Zone 3 ($60\% \le V \le 85\%$): $\text{Seats}_{100}(V) = 90 + (V - 60) \times 0.40$ (gains final $10\%$ seats).
  - Perfect mathematical symmetry: $S(V) + S(100 - V) \equiv 100$ for all $V \in [0, 100]$.
- **Chamber Scaling & Multi-Party Allocation:**
  - Scales by Legislature Ratio ($\text{TotalChamberSeats} / 100$).
  - 2-Party races allocate seats via largest-remainder rounding.
  - Multi-Party races (3+ parties at $\ge 15\%$): Iterative step-up loop adds $+1$ seat at a time to the qualifying party whose seat allocation most closely preserves its baseline seat proportion ($\text{SeatPct}_p$), not raw vote share.
  - Verified across all 50 state chambers allocating all **5,462 legislative seats nationwide** with zero missing or excess seats.

---

## 3. Modular District Slices Across All 50 States (`REQ-62`, `REQ-72 DATA`)

- **Complete 50-State Slices Catalog:**
  - Generated and verified 50 modular state district slice files in `assets/districts/<STATE>-<N>.json`.
  - Big Four Megastates (CA, NY, FL, TX) support up to **200 districts**; remaining 46 states support up to **50 districts**.
  - Every district slice includes bounding box geometry, SVG path coordinates, citizen population representation, CVAP representation, and legislative ratios.

---

## 4. Post-Election Coalition Autopsies & Executive Dispositions (`REQ-73` to `REQ-77`)

- **Fullscreen Autopsy Modal (`.v07-autopsy-modal-overlay`):**
  - Automatically triggered upon election certification in Raised Navy styling with full keyboard Esc and trap handling.
- **3-Paragraph Coalition Movement Dossier (`REQ-73`):**
  - Dynamically synthesizes coalition realignment across the **155.00M represented electorate**, detailing net shifts among College-Educated Moderates, Working-Class Voters, Racial & Cultural Cohorts, and Independent Defectors.
- **Regional Faultlines Tracker (`REQ-74`):**
  - Categorizes national shifts into Solidified Bastions ($+7.5$ to $+18$ pts), Emerging Battlegrounds (within $\pm 4.5$ pts), and Lost Bastions.
- **Faction Post-Mortem & Blame Game (`REQ-75`):**
  - Competing public inquest statements issued in distinct faction voices: Ascendant Reform Wings push for ideological platform cementation, while Institutional Stewardship Wings demand suburban pragmatism and governing discipline.
- **Strategic Chair Dispositions (`REQ-76`):**
  - **Endorse Recommendations:** Empowers ascendant grassroots wing ($+8$ Confidence, $+4$ Supporter Trust; establishment chafes at $-5$ Member Happiness, $-7$ Confidence).
  - **Shelve Report:** Maintains party unity ($+4$ Sitting Member Happiness, $+\$5\text{M}$ donor treasury; movement activists frustrated at $-5$ Confidence).
  - **Regional Review:** Orders regional decentralization review ($-\$3\text{M}$ national administrative cost, state party federations stabilized).

---

## 5. State Party Federalism & Receivership Administration (`REQ-81` to `REQ-84`)

- **State Platform Tolerance & Friction (`REQ-81`):**
  - Compares national platform positions against state voter median tolerance baselines.
  - **Mild Friction (> 3.0 pts):** Local candidates distance from ticket; $-15\%$ chapter fundraising efficiency.
  - **Severe Rebellion (> 4.5 pts):** State Chair repudiates national planks; $-20\%$ turnout bonus and alert banner.
- **State Machine Crises (`REQ-82`):**
  - Dynamic mid-cycle crises (Bankruptcy, Factional Civil War, Corruption) presenting tough intervention dilemmas:
    1. **Full Federal Receivership:** Bailout debt ($-\$5\text{M}$), install national administration for 2 years (20 turns).
    2. **Matching Grant:** $-\$3\text{M}$ conditional funding with $60\%$ stabilization probability.
    3. **Non-Intervention:** Conserves funds but depresses volunteer morale and candidate recruitment.
- **Federal Receivership Administration (`REQ-83`):**
  - Costs $\$500\text{k}/\text{turn}$ overhead per state under administration, decrements turns automatically, and clears upon expiration.
- **Visual Health Status Pips (`REQ-84`):**
  - 4-Tier color status indicators across the 50-State Directory: Green (Healthy), Blue (Receivership), Amber (Friction), Coral (Crisis/Severe Rebellion).

---

## 6. Pundit Forecaster Maps & 13-Tier Consensus Engine (`REQ-87`)

- **Multi-Chamber Projections:**
  - Dedicated map views and projection cards for U.S. Senate, U.S. House, and the Presidency.
  - Parody forecasters: Sallow's Crystal Ball, Cooked Political Report, and Upside/Inside Elections.
- **Discrete 7-Tier vs. Blended 13-Tier Ratings:**
  - Individual outlets report in standard 7 discrete tiers: `Solid`, `Likely`, `Lean`, `Toss-up`.
  - Consensus averaging interpolates into a **13-Tier Continuous Spectrum**:
    `Solid Dem` $\longleftrightarrow$ `Very Likely Dem` $\longleftrightarrow$ `Likely Dem` $\longleftrightarrow$ `Favored Dem` $\longleftrightarrow$ `Lean Dem` $\longleftrightarrow$ `Tilt Dem` $\longleftrightarrow$ `Toss-Up` $\longleftrightarrow$ `Tilt GOP` $\longleftrightarrow$ `Lean GOP` $\longleftrightarrow$ `Favored GOP` $\longleftrightarrow$ `Likely GOP` $\longleftrightarrow$ `Very Likely GOP` $\longleftrightarrow$ `Solid GOP`.
- **Continuous Color Palette:**
  - `#1d4ed8` $\to$ `#2563eb` $\to$ `#3b82f6` $\to$ `#60a5fa` $\to$ `#93c5fd` $\to$ `#bfdbfe` $\to$ `#fbbf24` $\to$ `#fecaca` $\to$ `#fca5a5` $\to$ `#f87171` $\to$ `#ef4444` $\to$ `#dc2626` $\to$ `#b91c1c`.

---

## 7. Autonomous Custom Party Creation & Incumbent Seat Claiming (`REQ-63`)

- **Autonomous Non-Replacing Entities:**
  - Custom parties exist alongside all 6 base parties without replacing or overwriting standard rivals.
  - Full customization: Nameable starting party chair, color picker for custom hex code, and customizable 1–10 issue positions.
- **Hierarchical Politician Incumbent Seat Claiming:**
  - When choosing the "Current Politician" archetype, a 3-step picker (`Office` $\to$ `State` $\to$ `Seat`) inspects real-world incumbents (Governor, Senate, House).
  - The claimed seat and incumbent politician successfully transfer to the custom party as a sitting elected member and incumbent candidate.
- **Standalone Voter Accounting:**
  - Dedicated column in the Registered Voters sidebar and state registration tables without generic third-party bundling.

---

## 8. Actions Overhaul & Atmospheric Wire (`REQ-64` to `REQ-86`)

- **Minor Party Tracking (`REQ-64`):** Dedicated race filters tracking statutory ballot access thresholds ($2\%/5\%$) and spoiler margin viability alerts.
- **Leader Candidacy Deployment (`REQ-65`):** Bench leaders deployed directly into Senate, Governor, or House races, transferring personal Fame and Popularity into candidate baseline quality.
- **State Voter Registration Table (`REQ-66`):** Disaggregated state drill-down tracking registered voters by individual party.
- **Commissioned Race Polling (`REQ-68`):** Snapshot polling costing $\$1\text{M}$ (House) or $\$2\text{M}$ (Senate/Governor).
- **Priorities Lock-In (`REQ-69`):** 3 Main Priorities locked upon confirmation for the entire 2-year cycle with padlock status indicators.
- **50-State Starting Chapters (`REQ-71`):** Minor and custom parties begin with 1 branch in each of the 50 states (50 initial branches).
- **Fame-Scaled Popularity (`REQ-85`):**
  $$\text{Effective Popularity} = \text{Raw Popularity} \times \left(\frac{\text{Fame}}{100}\right)$$
  $$\text{Net Approval} = (2 \times \text{Effective Popularity}) - \text{Fame}$$
- **State-Targeted Small Donor Drive Overhaul (`REQ-86`):** Requires target state selection; yield incorporates visit frequency fatigue ($1.0\times \to 0.70\times \to 0.45\times \to 0.25\times$), state membership density, faction happiness, and campaign finance deregulation stances (up to $2.0\times$ multiplier). Calibrated to $\$5.0\text{M}$ national first-visit benchmark.
- **Atmospheric Wire & Sanitization (`REQ-78`, `REQ-79`, `REQ-80`):** Morning Wire ticker header ("The Beltway Rundown"), qualitative Field Director Dispatches, and complete decimal and formula stripping across all UI views.

---

## 9. Save System & Release Verification

- **Save Schema 7 (`partyChairGame.save.v12`):**
  - Updated primary save key to `partyChairGame.save.v12`.
  - Comprehensive backward compatibility chain supporting saves from v11, v10, v9, down to v1.
- **Automated Verification Test Suite:**
  - Executed `scripts/test-agent7-integration.cjs`, `scripts/test-agent6-overhauls.cjs`, and `scripts/test-req72-seats.cjs`.
  - **631 total assertions verified (100% pass rate)** across all 10 subsystems.
- **Release Executable Binary:**
  - Compiled via `./build.ps1` using Microsoft .NET C# Compiler (`csc.exe`).
  - Output binary: `dist/release/Coalition Builder - Party Chair.exe` (658,432 bytes / ~643 KB).
  - Clean startup with zero console errors.
