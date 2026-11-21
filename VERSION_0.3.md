# Version 0.3 — National control maps

Version 0.3 adds geographic maps for the U.S. House, Senate, governorships, and state legislatures. New games start with a 2026 control snapshot in those offices, ahead of the 2028 organizing cycle.

## What changed

- Replaced the state and district card view with national maps, Alaska and Hawaii insets, state labels, legends, and hover details.
- Added 435 congressional district shapes based on the Census Bureau's 2026 TIGER/Line district geography used for the 2026 election cycle.
- Added House district control from reported 2026 election results. Uncalled or unavailable outcomes remain gray.
- Added map selection for all three staggered Senate classes. Each class shows its current state delegation control; the 2028 election still contests Class III.
- Added current governor party and state legislative chamber control to new-game state.
- Split state legislatures are filled purple across the whole state. The map does not divide states into chamber halves. Nebraska is marked nonpartisan; unsettled chamber control is gray.
- Rebuilt the Windows executable to bundle the new map data.

## Caveats

2026 election returns are still provisional where races have not been called. The map marks those districts or offices as pending rather than treating a projected lead as a final win. State legislative control uses a reported post-election snapshot and has unsettled entries where the source does not establish control. These maps show party control, not exact seat-level state legislative election results.

See [MAP_DATA_0.3.md](MAP_DATA_0.3.md) for detailed source and geography notes.
