# Coalition Builder: Party Chair

**Coalition Builder: Party Chair** is an independent, offline party-building strategy game. Version 0.6 adds national presidential elections, an Electoral College map with live scoreboard, and congressional coattails based on Battle For America's downballot model. It includes the scaled national voter model, 40-issue platform, guided tutorial, and national maps for President, House, Senate, Governorships, and State Legislatures.

## Run it

1. Run `Coalition Builder - Party Chair.exe` on Windows, or open `index.html` in a current desktop browser.
2. Found a party, then use **Export save** to make a portable backup. **Import save** restores a JSON backup.

The game itself uses plain HTML, CSS, and JavaScript and runs offline without a build step. The Windows executable bundles the game and launches it in an Edge app window using a private browser profile under your local application data. Browser saves stay in that profile; use save export/import to move them or keep backups.

## The loop

- Chair the Democratic, Republican, Libertarian, or Green Party, or create a custom party name and platform.
- Begin with established Democratic and Republican organizations in every state; Libertarian and Green organizations are smaller.
- Start with 800 individually recorded local chapters for each major party, distributed by state population proxy and partisan lean. Youth Chapters are listed as a category without game rules.
- Spend 20 chair turns on organizing before party primaries. Each turn has four leadership actions and up to five candidate endorsements.
- Review the House (435 districts), Senate (Classes I, II, and III), governorships, and state legislature maps.
- Track party membership and state, district, and national voter totals on the represented electorate scale; every sample voter represents 100 real voters.
- Decide whether to encourage state recruits to enter a House, Senate, gubernatorial, or state legislative primary. Recruitment costs money and one action; a losing recruit weakens their wing and disappears.
- Work with unique, state-specific four-candidate fields. Democratic fields span progressive and moderate candidates; Republican fields span MAGA and moderate candidates.
- Use a national environment tracker to follow nationwide shifts. In the 2028 scenario, Jon Ossoff’s ticket boosts Democratic turnout in the South and J. D. Vance’s ticket boosts Republican turnout in the Midwest.
- Set positions on 40 national issues using 1–10 sliders. Each change uses a leadership action and slightly updates the relevant party-profile axis. Poll notes reflect issue importance, not support for a specific policy position.
- After primaries resolve, spend four campaign turns targeting states. Each statewide field deployment costs $2M and adds 2.5 support points, up to three deployments per state.
- Resolve presidential and House results, Senate Class III, the 11 scheduled governor contests, and state legislative chamber control.

The game includes pixel-art candidate portraits from the art agent's `candidate-art-clean-v3` selection thumbnails in `assets/candidates/`.

## Project files

- `app.js` — setup, screens, interaction, local save export/import
- `engine.js` — turn progression, primary fields, state recruit outcomes, polls, party simulation, bills, and elections
- `data.js` — party templates, factions, bills, conventions, events, and state map
- `scenario-2028.js` — version 0.1 state, district, Senate class, governor, and state legislature baseline data
- `issues-0.2.1.js` — 40 issue prompts, endpoints, and survey context
- `maps-0.3.js` — compact national district geometry and 2026 control snapshot
- `voter-model-0.5.js` — state and congressional district voter estimates, party totals, and scaled voter ranges
- `state-house-data-0.5.js` — baseline lower-house party seat counts by state
- `scripts/generate-voter-model-0.5.cjs` and `scripts/generate-state-house-data-0.5.cjs` — data generation scripts
- `assets/maps/` — source state boundaries and reported state legislative chamber snapshot
- `scripts/generate-map-data.cjs` — map-data generator (reads Census shapefiles in `obj/cd120-shp/`)
- `VERSION_0.3.md` and `MAP_DATA_0.3.md` — map scope, source dates, and methodology
- `ART_STYLE.md` — studio art and interface direction for this game
- `VERSION_0.1.md` — release scope, data notes, and sources
- `VERSION_0.2.md` — state legislative primary and general campaign scope
- `VERSION_0.2.1.md` — issue platform, visual changes, and poll references
- `VERSION_0.2.2.md` — typography reduction and full-window interface refinement
- `VERSION_0.3.md` — national control maps and election snapshot
- `VERSION_0.4.md` — interactive first-game tutorial
- `VERSION_0.4.1.md` — national map ring-encoding fix
- `VERSION_0.4.2.md` — Senate class winner control snapshot
- `VERSION_0.4.3.md` — independently tracked local chapter networks
- `VERSION_0.5.md` — scaled voter model, dashboard, and source methodology
- `styles.css` — responsive interface
- `assets/candidates/` — portrait thumbnails used by the roster
- `DESIGN.md` — mechanics, balance goals, and next development steps
- `build.ps1` and `launcher.cs` — build the self-contained Windows executable

To rebuild the Windows executable, run `./build.ps1` in PowerShell from this folder. The resulting file is written to `dist/release/`.

This is a playable prototype. House district map fills show reported 2026 election control; gray districts are uncalled or unavailable. State legislative primaries and election results model chamber control rather than individual state-district seats or exact seat counts. See `MAP_DATA_0.3.md` for map sources and caveats.
