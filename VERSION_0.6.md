# Version 0.6 — Presidential Elections, Electoral College Map & Congressional Coattails

## Game changes

- **Presidential Election Simulation**:
  - Implemented the 2028 presidential election across all 51 jurisdictions (50 states plus the District of Columbia), totaling 538 Electoral Votes (270 needed to win).
  - Main scenario tickets: **Jon Ossoff** for Democrats and **J. D. Vance** for Republicans.
  - Jon Ossoff receives a regional turnout advantage across the South (+4.0 points).
  - J. D. Vance receives a regional turnout advantage across the Midwest (+4.0 points).
  - The presidential contest runs on structural fundamentals (state baseline leans, national environment, and regional ticket strengths) and is independent of party chair spending. The player cannot directly impact or spend funds on the presidential ticket.

- **National Presidential Map**:
  - Added **President** as a top-level tab in the national map view alongside House, Senate, Governorships, and State Legislatures.
  - States are shaded by projected or final Electoral College control: Democratic blue (`#3478c8`) for Jon Ossoff, Republican red (`#c9474e`) for J. D. Vance.
  - Interactive Electoral College banner displaying real-time projected EVs for Ossoff vs. Vance with a visual progress bar and a 270-to-win threshold marker.
  - District of Columbia (3 EV) is rendered and hoverable (`DC · 3 EV · Solid D (D+88%)`).
  - State hover tooltips display electoral votes, candidate margin/lead, competitiveness rating (Solid/Likely/Lean/Tossup), modeled voter totals, and the congressional coattail effect.

- **Congressional Coattail Impact (Battle For America Consistent)**:
  - Adopting Battle For America's downballot model (`RACE_WEIGHT.house = 0.34`), top-of-the-ticket presidential margins carry a **34% coattail effect** into all 435 U.S. House districts.
  - Congressional candidates in states where their presidential nominee runs ahead receive a tangible downballot boost; where the presidential ticket struggles, candidates face top-of-ticket drag.
  - Downballot Senate Class III races inherit a 55% presidential coattail effect, and Gubernatorial contests inherit a 42% coattail effect.
  - Each House district's result record and hover tooltip tracks its exact presidential coattail impact (e.g. `Pres. coattail: D +1.4%`).
  - Fixed district organization lookup to use state ID, allowing local chapter networks and statewide campaign deployments to properly empower congressional districts.

- **Election Night & UI**:
  - General election night summary displays a dedicated Presidential Election Result card detailing Electoral College totals, winner, and the downballot coattail influence.
  - Added a step to the interactive first-game tutorial introducing the presidential map and coattails.
  - Rebuilt Windows executable in `dist/release/` and `dist/`.
