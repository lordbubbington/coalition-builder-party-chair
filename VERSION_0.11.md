# Version 0.11 — The Decennial Redistricting, 10-Slot Priorities & Dynamic Electoral Maps Update

## Overview

Version 0.11 (**Master Build: "The Decennial Redistricting, 10-Slot Priorities & Dynamic Electoral Maps Update"**) represents a major milestone in *Coalition Builder: Party Chair*. This release unites Huntington-Hill decennial reapportionment post-2030, dynamic assembly of congressional district maps, procedural geometry for up to 200 districts per megastate, narrative text-first platform stance displays, a dedicated 5th "Party Information" tab, the expanded 10-slot priority framework with 25 Overall Priority Quests, and the player-requested 1–10 issue customization in the "Create a Custom Party" setup screen.

---

## 1. Huntington-Hill Decennial Reapportionment & Dynamic Maps (`REQ-62`, `REQ-58`, `REQ-59`)

- **Huntington-Hill Method of Equal Proportions**:
  - Implemented the official U.S. statutory Huntington-Hill reapportionment algorithm in `scenario-2028.js` and `engine.js` (`apportionHuntingtonHill`).
  - Decennial redistricting automatically triggers post-election in 2030 based on decennial population forecasts (`getDecennialStatePopulations(2030)`).
  - Guarantees every state receives at least 1 seat, accurately allocating all 435 U.S. House seats based on relative population shifts (e.g., Sunbelt gains in TX/FL, apportionment shifts in CA/NY/IL/OH).
- **Dynamic National House Map Assembly (`assembleNationalHouseMap`)**:
  - Automatically loads and renders the appropriate national map:
    - **2028 Cycle**: Renders the baseline 2028 map (`base map`).
    - **2030 Cycle & Beyond**: Assembles the reapportioned `2030 map`, persisting state seat totals, electoral votes, and congressional district delegations directly into `game.houseMaps['2030 map']`.
- **Modular District Map Slices & Procedural Geometry**:
  - Precalculated SVG district slices stored in `assets/maps/district-slices.json` for all 50 states + DC.
  - Robust procedural geometry engine (`generateStateDistrictSlices`) provides clean, non-overlapping geometric SVG paths supporting up to **200 districts** for megastates (CA, TX, FL, NY) and up to **50 districts** for all other states.

---

## 2. Text-First Platform Stance Displays (`REQ-60`)

- **Narrative Stance Callouts in Step 1**:
  - Overhauled the Step 1 platform customization screen in `app.js` to prioritize text-first clarity over abstract numbers.
  - Every national issue features a narrative stance callout (`v09-stance-callout`) displaying descriptive prose directly from `window.PartyChairData.STANCE_DESCRIPTIONS`.
  - When adjusting any 1–10 slider, live DOM event listeners instantly update the stance description without requiring page or tab reloads.

---

## 3. Dedicated 5th "Party Information" Tab (`REQ-57`)

- **Centralized Party & Electorate Intelligence**:
  - Introduced a permanent 5th main navigation tab: **Party Information** (`party-info`).
  - Migrated key strategic indicators into a clean, dedicated dashboard:
    1. **Tri-Partisan Electorate Trust System**: Public Trust, Coalition Partner Trust, and Ideological Authenticity scores.
    2. **Unified Party Approval Tracker**: Net approval ratings across Major, Minor, and Emerging parties.
    3. **Faction Confidence & Loyalty**: Internal faction stability, defection/bolt threat indicators, and leadership standing.
    4. **Electorate Affiliation Model**: Real-time demographic voting bloc affiliations and partisan elasticity metrics.
    5. **Atmospheric Forecasters & National Environment**: Sabato's Crystal Ball, Cook Political Report, and national partisan climate trends.

---

## 4. 10-Slot Priority Framework & 25 Overall Priority Quests (`REQ-61`)

- **10-Slot Priority Framework**:
  - Expanded party focus capacity to 10 slots: 3 Core National Issues plus up to 7 Regional Focus slots.
  - Allows chairs to tailor deep regional strategies across the Rust Belt, Sun Belt, Pacific Rim, Black Belt, Great Plains, and Interior West.
- **25 Overall Priority Quests**:
  - Implemented 25 strategic overarching party quests in `engine.js` (`OVERALL_PRIORITY_QUESTS`):
    - *Electoral Breakthroughs*: Sunbelt Surge, Rust Belt Revival, Coastal Fortress, Great Plains Foothold, Mountain West Breakthrough.
    - *Congressional Milestones*: House Majority, Senate Majority, Supermajority Push, Filibuster Defense.
    - *Coalition & Ideology*: Ideological Purity, Big Tent Harmony, Youth Surge, Labor Alliance, Suburban Inroads.
    - *Party Machinery*: 50-State Strategy, Grassroots Chapter Expansion, Super PAC Resistance, War Chest Mastery.
  - **Scaled Member Happiness Rewards**:
    - Completed quests award **+5 to +20 Member Happiness** upon election resolution, directly reinforcing incumbent retention, caucus unity, and defection prevention.

---

## 5. Custom Party Setup: 1–10 Issue Position Customization

- **Platform Customization Overhaul**:
  - Replaced legacy 4 ideological axis sliders on the "Create a Custom Party" setup screen with full individual issue configuration across all national issues in `window.PartyChairData.VERSION_021_ISSUES`.
  - Each issue features a 1–10 scale slider with real-time descriptive prose from `STANCE_DESCRIPTIONS`.
  - Filterable by issue categories (Economy & Affordability, Foreign Policy & Defense, Climate & Energy, Social Services, Social Justice, Democracy & Governance).
  - Dynamically calculates summary ideological axes via `recalculateWeightedPlatformAxes` while properly preserving player-selected issue stances in `game.issuePositions`.

---

## 6. Architecture, Save Migration & Release Packaging

- **Save Schema 7 (`partyChairGame.save.v11`)**:
  - Incremented save schema to version 7 and primary save key to `partyChairGame.save.v11`.
  - Full multi-version backward compatibility chain supporting saves from v10, v9, v8, v7, down to v1.
- **Executable Binary**:
  - Standalone release binary compiled via `./build.ps1`:
    - Path: `dist/release/Coalition Builder - Party Chair.exe`
    - Native WebView2 wrapper embedding all game assets, styles, scripts, and precomputed district maps.
- **Production Deployment**:
  - Copied to user's primary application folder: `C:\Users\rober\OneDrive\Documents\Party Chair Game\`.
