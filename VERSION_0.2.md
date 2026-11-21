# Coalition Builder: Party Chair — Version 0.2

Version 0.2 carries the 2028 scenario beyond the 20-turn organizing and primary phase into general election night.

## Added in 0.2

- The primary catalog now includes 98 state legislative chamber-control races: lower and upper chambers in 49 states. Nebraska is omitted because its legislature is nonpartisan.
- Each state legislative primary has a distinct four-candidate Democratic and Republican field and supports the same endorsement and recruit mechanics as federal and gubernatorial races.
- Primary results retain the winning candidate's quality and wing for general-election calculations.
- After the primaries, the chair gets four general campaign turns, each with four actions. A field deployment costs $2M and adds 2.5 support points in a selected state, with a maximum of three deployments per state.
- Statewide campaigns influence presidential and House forecasts and the Senate, governor, and state legislative results for that state.
- Election night resolves the presidential contest, 435 U.S. House districts, all 34 Senate Class III seats, the 11 scheduled governor races, and partisan control of both state legislative chambers outside Nebraska.
- The 2028 Democratic and Republican presidential candidates display as Jon Ossoff and J. D. Vance.
- Saves migrate to the new general-campaign phase while keeping prior v0.1 saves loadable.

## Modeling limits

- The state legislature map does not include individual state legislative districts or chamber seat totals. The 98 contests decide chamber control directly; results are not projections of exact seat counts.
- State legislative, Senate, and governor general-election margins use each state’s party support, candidate quality, and Senate incumbent party. Candidate names and quality are fictional game data.
- The presidential and U.S. House count continues to use the existing four-party ranked-choice engine. The general campaign adds state-level support to that model.
- Senate Classes I and II remain carryover map classes; only Class III votes in the 2028 scenario.

See [VERSION_0.1.md](VERSION_0.1.md) for the original map data notes and source list.
