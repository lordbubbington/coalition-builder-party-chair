# Version 0.10 — The 10 Platform Pillars & Continuous Political Evolution Update

## Overview

Version 0.10 (**Master Build: "The 10 Platform Pillars & Continuous Political Evolution Update"**) implements the complete **10-Pillars Platform Architecture** specified in `PLATFORM_10_PILLARS_SPECIFICATION.md`, incorporating real-time descriptive stance text across all 41 national issues, strict voter-impact decoupling of internal party machinery (Pillars 7 & 8), continuous multi-cycle political evolution with the 1/4th inter-cycle realignment rule, atmospheric policy bill vibes, and refined political forecasters.

---

## 1. 10 Platform Pillars System & Real-Time Stance Descriptions

- **Full 10-Pillar Platform Hierarchy (`PLATFORM_10_PILLARS_SPECIFICATION.md`)**:
  - Organized all 41 national issues under 10 cohesive thematic platform pillars:
    1. **Tax & Economic Policy** (Issues: Taxes & Spending, Corporate Tax Rate, Wealth Tax, Cost of Living, Business Regulation, Monetary Policy)
    2. **Foreign Policy** (Issues: Foreign Policy & Alliances, Defense Spending, Iran Policy, Israel-Palestine)
    3. **Climate Policy** (Issues: Climate Action & Emissions, Energy Mix, Green Standards)
    4. **Religious Policy** (Issues: Religious Liberty, Church-State Separation in Schools, Faith-Based Funding)
    5. **Social Services Policy** (Issues: Medicare & Social Security, Health Coverage, SNAP & Food Aid, Prescription Drug Prices, Minimum Wage)
    6. **Social Justice** (Issues: Racial Equity, Voting Rules & Access, LGBTQ+ Rights, Criminal Justice Reform, Abortion, Immigration Visas, Border Enforcement, NIMBYism & Housing)
    7. **Party Structure** (Issues: State vs Federal Party Power, Primary Rules & Ballots, Campaign Finance Reform) — *Internal Party Machinery (Does Not Impact Voters)*
    8. **Party Ideology** (Issues: Platform Enforcement & Discipline, Ideological Purity vs Big-Tent, Candidate Autonomy) — *Internal Party Machinery (Does Not Impact Voters)*
    9. **Democracy Policy** (Issues: Checks & Balances, Government Corruption & Ethics, Election Certification & Norms)
    10. **Establishment Stance** (Issues: Institutional Trust, Political Insiders vs Outsiders, Populist Revolt)

- **Mandatory Decoupling of Pillars 7 and 8 from Voters**:
  - **Pillar 7 (Party Structure)** and **Pillar 8 (Party Ideology)** govern purely internal party machinery, candidate autonomy, and discipline.
  - Changes to issues under Pillars 7 and 8 strictly **do not** alter summary ideological axes (`recalculateWeightedPlatformAxes`), do not adjust public voter trust, and do not shift voter preferences.
  - Tagged visibly in the Platform Profile dashboard with a distinct badge: `Internal Party Machinery (Does Not Impact Voters)`.

- **Expanded Issues & Specific Party Stances**:
  - Added new issues with explicit 1–10 positions across parties:
    - **Abortion**: Greens: 2, Democrats: 4, Republicans: 8, Libertarians: 5.
    - **Immigration Visas**: Greens: 1 (Stance 1: "No borders, at all"), Democrats: 4, Republicans: 9, Libertarians: 2.
    - **Border Enforcement**: Greens: 1, Democrats: 5, Republicans: 8, Libertarians: 1.
    - **Affordability / Cost of Living**: Pillar 1 (Taxes & Economy). Stances: Green: 1, Dem: 3, GOP: 8, Lib: 10.
    - **Minimum Wage**: Pillar 5 (Social Services). Stances: Green: 1, Dem: 3, GOP: 8, Lib: 10.
    - **Business Regulation & Antitrust**: Pillar 1 (Taxes & Economy). Stances: Green: 1, Dem: 3, GOP: 8, Lib: 10.
    - **Monetary Policy & Federal Reserve**: Pillar 1 (Taxes & Economy). Stances: Green: 2, Dem: 4, GOP: 7, Lib: 10.
    - **NIMBYism & Housing Abundance**: Pillar 6 (Social Justice). Stances: Green: 3, Dem: 4, GOP: 7, Lib: 1.
  - Implemented the **Pillar Fallback Rule**: If an individual issue lacks an explicit party position, it automatically inherits the platform pillar's baseline default.

- **Real-Time 1–10 Descriptive Stance Text**:
  - Each of the 41 issues possesses full 1–10 descriptive sentences in `window.PartyChairData.STANCE_DESCRIPTIONS`.
  - When the player adjusts any slider in Step 1, the descriptive prose immediately updates live beneath the slider (`#stance-desc-${issue.id}`), letting the player read exactly what policy position is being adopted at each number without requiring full tab reload.

- **10-Pillars Platform Dashboard**:
  - Replaced the legacy 4-axis list in `platformMarkup()` with an all-inclusive 10-pillar summary card.
  - Shows progress track, numerical score (`1.0 – 10.0`), low-end descriptor, high-end descriptor, and internal machinery tags for Pillars 7 & 8.

---

## 2. Continuous Multi-Cycle Political Evolution & The 1/4th Rule

- **Continuous Multi-Cycle Evolution Philosophy (`REQ-56`)**:
  - Added prominent game style documentation in `GAME_STYLE_GUIDE.md`: *Coalition Builder: Party Chair* is designed as a continuous simulation across multiple presidential, midterm, and off-year election cycles with evolving parties, voters, maps, and politics.
  - **Inter-Cycle Electorate Realignment**:
    - Parties maintain existing voting blocks between election cycles.
    - A party's expected popular vote is computed based on its share of **total non-independent voters** ($V_p / N_{\text{non-ind}} \times 100\%$).
    - Overperforming parties gain voters; underperforming parties lose voters.
    - The shift moves by **1/4th of the difference** as a percentage of the total electorate:
      $$\Delta \text{Share}_p = \frac{\text{Actual}_p - \text{Expected}_p}{4}$$
    - **Strict Invariant**: Parties DO NOT gain or lose electorate baseline share during campaigns or election week; realignment occurs **only between election cycles**.
  - Detailed post-election breakdown is displayed on the post-election screen (`realignmentSummaryMarkup()`).

---

## 3. UI, Atmospheric Vibes & Bug Fixes

- **Satirical Forecaster Screen Polish**:
  - Removed forward developer labels and the green button from the Pundit Forecaster menu.
  - Added "Obscures Some Information & Atmospheric Vibes" rule to `GAME_STYLE_GUIDE.md`.
- **Atmospheric Policy Bill Vibes**:
  - Removed raw `+4.5` math labels from player-facing UI and bill previews.
  - Implemented dynamic bill outcome: between `-3.0` and `+5.0` state support based on local issue proximity (diff 0 = 80% success, diff 9 = 0% success), presenting the player with narrative political vibes of risk and reward rather than overt probability formulas.
- **Electorate Affiliation Breakdown**:
  - Third-party voters are split into distinct rows for **Libertarian**, **Green**, and **Other Minor Parties** in the Electorate Affiliation card.
- **RCV Transfer Weight Copy**:
  - Updated RCV line to: `RCV / 3-Party Transfer Weight (If policy is enacted): (Projected percentage of RCV votes)`.
- **Hero Banner Copy**:
  - Updated headline and subtitle:
    > **Politics is a long game. Make sure your party wins it.**
    > *Lead an American political party through the years, choosing their platform, policies, and candidates. Starting with the 2028 election, you will take charge of a party of your choice (Or make your own!), and can grow it to glory - or bring it to ruin.*
- **Universal Senate Map**:
  - Universal 100-Seat Senate map remains the default subtab, highlighting split delegations and Independent aquamarine green (`#1abc9c`) for Angus King and Bernie Sanders.
- **Save Migration & Hydration**:
  - Updated save key to `partyChairGame.save.v10` with backward compatibility for `v9`, `v8`, `v7`, etc.

---

## 4. Verification & Packaging

- **Automated Test Suite**: Full Node test suite verified zero script compilation errors, complete 41-issue stance descriptions, 10-pillar structure, pillar 7 & 8 voter decoupling, and inter-cycle realignment calculation.
- **Executable Binary**: Compiled via `build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` (472,064 bytes).
