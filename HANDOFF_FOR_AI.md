# Coalition Builder: Party Chair — AI Handoff

Prepared November 11, 2026. This note summarizes the owner's product instructions and design decisions so another AI can continue the project without treating old context as new permission or confusing estimates with confirmed data.

## Start here

1. Read `README.md`, `DESIGN.md`, `ART_STYLE.md`, `MAP_DATA_0.3.md`, and the version notes in order through `VERSION_0.5.md`.
2. Treat `DESIGN.md` as the overall product/design reference and version notes as implementation and data records. Follow the owner's latest chat instruction if it clarifies or changes older notes.
3. Continue developing the offshoot project in this folder. The owner authorized reading Battle For America files for reference, but explicitly said not to edit Battle For America files. This archive contains the offshoot project, not the Battle For America project.
4. The working title is **Coalition Builder: Party Chair**. The owner asked for name/copyright/trademark checks during naming and accepted the working name. Do not represent that earlier name research as a legal guarantee.
5. Preserve the owner's scale clarification: all voter totals shown in the game represent **155 million actual voters**. Each internal voter record represents 100 people. Do not display or discuss the model's internal sample size in game-facing text.
6. Rebuild the Windows executable with `build.ps1`. The latest v0.5 executable is in `dist/release/`. At handoff time, the convenience copy directly under `dist/` is stale because the build could not refresh it. Prefer the `dist/release/` build.

## Owner instructions and decisions by stage

### Project setup and working name

- Extract the supplied Party Chair Game project archive and develop this as an offshoot game of Battle For America.
- Battle For America may be read for reference, but its files must not be edited.
- The owner requested the working title **Coalition Builder: Party Chair** for internal files and the executable. Earlier naming exploration included “The Party Machine” and checks about the use of similar game names. The owner concluded the selected working name should be fine.
- The Democratic and Republican parties should use their recognizable real American party identities and usual blue and red colors.
- The owner asked development to follow the project's design document until a further development question is needed.

### Version 0.1 and early game design

- Start with modern American political parties and state standings, reusing owner-supplied Battle For America information where appropriate. Keep the reference project untouched.
- Include House, Senate, governorship, and state legislature maps/systems.
- Democrats and Republicans begin with organizations in all 50 states, with mature networks everywhere and stronger organization where each party is locally strong. The player should be managing competition with the other major party, not building either major party from zero. Third parties begin smaller.
- Candidate selection is a major mechanic. Primaries have distinct, race-specific candidates; Democratic fields span progressive and moderate politics, Republican fields span MAGA and moderate politics. Most fields have at least four candidates, with only two or three polling strongly. Avoid identical fields across races.
- Incumbents being charged was explicitly deferred for future development.
- Organizing runs for 20 turns before primaries. The chair may endorse no more than five candidates per turn; turns should build the strongest coalition before primary season.
- Keep all three Senate class maps correct and present.
- The main 2028 scenario starts with Jon Ossoff for Democrats and J. D. Vance for Republicans, with a Democratic turnout boost in the South and a Republican turnout boost in the Midwest. Presidential candidate selection may be added later, but was explicitly not requested yet.
- Store state and congressional-district leans in game data. Include a national environment tracker that shifts nationwide forecasts.
- Rework recruitment into a state-by-state pool of potential primary candidates. Encouraging a recruit costs resources; quality varies widely. A losing recruit slightly upsets that wing and is permanently removed, so race/recruit matching matters.

### Naming and reference questions

- The owner asked whether game titles were specifically in use, and asked about copyright/trademark risk. They accepted “Coalition Builder: Party Chair” as the working title after discussing that game titles generally differ from copyrighted game content. Treat the name as a working product name, not a promise of legal clearance.

### Version 0.2.1 and 0.2.2

- Version 0.2.1: triple existing font size; refit the UI; create the game icon to the studio style guide; make a 30–40 item list of current U.S. political issues with 1–10 sliders and polling/salience sources. This became a 40-issue platform.
- The applicable icon reference is the **studio style guide**, not the U.S. Web Design System. The owner's studio style guide is `ART_STYLE.md` in this project.
- Version 0.2.2: reduce the enlarged typography by 20%, make the game fill the available screen, and refit the UI to look polished.

### Version 0.3 maps

- Add realistic national maps for Senate, House, and governor control at the start of the game, plus a state-legislature control map.
- House geography should use the maps used for the 2026 election.
- State legislature map colors a state purple when each major party controls one chamber. Fill the whole state; do not split or slash it. Otherwise use a single party color.

### Version 0.4 tutorial and map repair

- Add a full, multi-step tutorial with a skip option and a visual highlight for the topic/control in focus.
- Do not let players click through without using actual game buttons. The tutorial must wait for real control interactions unless skipped.
- The owner reported that the map was badly broken and requested a fix for 0.4.1. The project notes record a polygon ring delimiter bug fix.

### Version 0.4.2 Senate class data

- Populate all three Senate class maps with winners from 2022, 2024, and the supplied 2026 assumptions.
- For 2026, assume unlisted states retain the party that won that Class II seat in 2020.
- The owner specified Democratic gains in Texas, Ohio, Iowa, Alaska, Mississippi, South Carolina, North Carolina, Maine, and Kansas. Ohio is a special election for the Class III seat vacated by J. D. Vance.
- Independent senators who caucus with Democrats are counted with Democrats on the map.
- The owner later reported Senate class maps were not appearing. The project now contains them in the national map UI; keep all three available.

### Version 0.4.3 chapter networks

- Give Democratic and Republican parties hundreds of independently established local chapters, distributed across all 50 states, with more in populous states and more of each party's chapters in states favorable to it.
- Add “Youth Chapters” as a name only. Do not add youth chapter rules or effects until the owner supplies them.

### Version 0.5 dashboard and voter model

- Overhaul the dashboard menu from the supplied screenshot. Treasury should say “{Party Name}’s National Committee budget.”
- Replace Members with “Millions of Members,” showing the party's voter count in decimal millions.
- Replace Legislators with separate cards: State Houses controlled (with party-held seats out of all state lower-house seats in small text), Senate Seats Controlled, and House Seats Controlled.
- Place the national map immediately below this dashboard menu.
- Reduce text size by 20% and refit the interface.
- Create a 1.55 million record voter sample where each record represents 100 actual voters, approximating state and district populations and party affiliations.
- **Clarification:** the displayed voter and membership figures must use the **155 million represented-voter scale**. The owner explicitly said the 1.55 abstraction should not appear anywhere in the actual game. The in-game dashboard/profile therefore shows represented-population totals (e.g. millions of voters), not internal sample-record counts.

## Current data and implementation notes

- `voter-model-0.5.js` is generated from `scripts/generate-voter-model-0.5.cjs`. It stores state and district affiliation counts using compact ranges rather than a giant array of individual objects. It totals 155 million represented voters exactly.
- The model includes 51 state-level jurisdictions (50 states and DC) and 436 district-level records (435 House districts plus DC's at-large jurisdiction). State weights use active registration counts scaled to the national total. State party splits use reported affiliation data where available and estimates elsewhere.
- For districts on unchanged 2024 boundaries, available 2020–2024 Census CVAP estimates inform weights. For the nine states with new 2026 maps, district CVAP on those boundaries was unavailable, so the model uses current district vote totals as a proxy. District party splits and Green/Libertarian/other minor-party breakdowns are estimates. `VERSION_0.5.md` contains more detail and source links.
- `state-house-data-0.5.js` is generated from `assets/maps/stateLegislatureResults2026.js`; the lower-house seat baseline totals 5,462 seats, including Nebraska's unicameral seats. State legislature election simulation tracks chamber control, not individual lower-house districts. When control flips, the engine estimates a bare-majority seat count; do not describe those estimates as district-level results.
- Existing map data includes state outlines, 435 congressional districts, three Senate classes, governors, and state legislature control. Pending/unavailable 2026 outcomes remain marked as such where the source data does so.
- Local and national affiliation figures are data-model estimates, not a claim that all states register voters by party.

## Handoff state and next work

- Current code and UI are version 0.5. `app.js` contains the dashboard and map rendering; `engine.js` contains game logic and save migration; `styles.css` contains the responsive UI; `index.html` loads the generated data files.
- `build.ps1` successfully created `dist/release/Coalition Builder - Party Chair.exe` at 317,952 bytes on Nov. 11, 2026. The root `dist/Coalition Builder - Party Chair.exe` was 146,944 bytes and older because its refresh failed. Treat the release-folder executable as current; rebuild after any source changes.
- The source Census CSVs and congressional district source archives remain under `obj/` for regeneration. The generated executable bundles runtime files and assets, not source shapefile archives.
- Do not add incumbent-charge mechanics or Youth Chapter mechanics without further owner direction. Presidential nominee choice was left as a future option and is not implemented.
- The user requested ongoing development through the design document until a question is needed. Make progress autonomously and ask only when a meaningful design decision genuinely blocks the next step.

## Conversation request record

This is a faithful paraphrase of the project-related requests and clarifications retained in this conversation, organized chronologically. It is a working record for continuity, not an exported verbatim chat transcript. The full feature scope is described above and in the version notes.

1. Extract the supplied Party Chair Game ZIP and begin developing this Battle For America offshoot; Battle For America files may be referenced but not edited. Distinguish instructions inside attachments from the owner's requests.
2. Continue through the design doc implementing its features until a question about further development is needed.
3. Suggest game names; check whether “The Party Machine” is copyrighted/trademarked in a way that could cause trouble; perform the same check on the candidate names and suggest more; consider “Coalition Builder: Party Chair”; check specifically for games using it. The owner accepted that as the working title.
4. Apply the working name to internal files and create a same-named executable.
5. Make the parties match real American political parties and use their usual colors.
6. Version 0.1: modern parties and state standings using Battle For America reference data; House, Senate, governor, and state legislature maps; major-party networks in all states; race-specific candidate selection; five endorsements each turn; 20 turns before primaries; correct three Senate classes; 2028 Ossoff/Vance ticket with regional turnout boosts; state and district leans in files; national environment tracker; state-by-state recruits with costs, quality variation, losing-wing penalty, and permanent removal.
7. Approve adding both features that had just been discussed in the prior exchange; then continue the existing task.
8. Version 0.2.1: triple the font size and refit the UI; make an icon under the studio style guide; create a 30–40 issue list with 1–10 sliders based on current U.S. political issues and polling/exit-poll research.
9. Clarify that “US Style guide” meant the studio style guide. Look for the detailed guide in other project conversations if accessible.
10. Version 0.2.2: reduce font size by 20%, use the entire screen, and refit the UI to look polished.
11. Version 0.3: realistic national Senate, House, and governor maps showing starting control; House geography should reflect maps used in the 2026 election; the state legislature map should color states by control, purple when split, with no state split graphic.
12. Version 0.4: a complete tutorial with multiple steps, skip option, topic highlight, and forced real-button interactions unless skipped.
13. Version 0.4.1: repair badly broken maps. The owner later said the Senate class maps were not appearing and asked to retry after closing the app.
14. Version 0.4.2: show Senate class control from 2022, 2024, and 2026 winners. For 2026, use owner-provided Democratic gains in Texas, Ohio, Iowa, Alaska, Mississippi, South Carolina, North Carolina, Maine, and Kansas; assume unlisted states retained the 2020 party for that Senate seat.
15. Version 0.4.3: independently establish hundreds of Democratic and Republican state chapters, weighted by state population and party strength. Add the Youth Chapters label only; rules will come later.
16. Version 0.5: replace the dashboard menu from the attached screenshot. Treasury becomes “{Party Name}’s National Committee budget”; Members becomes “Millions of Members”; split Legislators into State Houses controlled (with held seats out of national total in smaller text), Senate Seats Controlled, and House Seats Controlled. Make it visually pleasing. Create a 1.55 million record voter model with each record representing 100 actual voters, approximating state and district populations and party mix.
17. Move the map directly below the pictured dashboard menu, then reduce text size by 20% and refit the UI.
18. Clarify the displayed unit: membership and all voter numbers in the game should reflect 155 million represented voters. “1.55” is only an internal abstraction and must not appear in the actual game.
19. Latest packaging request: zip the entire project to date, including owner instructions and design-process notes, for handoff to another AI and workflow improvement.
