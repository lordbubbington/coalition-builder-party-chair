# Version 0.3 map data

Snapshot date: November 10, 2026. These maps initialize new games at the start of the 2028 scenario.

## Geography

- Congressional districts: U.S. Census Bureau [2026 TIGER/Line files](https://www.census.gov/geographies/mapping-files/2026/geo/tiger-line-file.html), state-level CD120 shapefiles, with one correction. The Census Bureau says its Missouri 2026 shapefile had not yet been regenerated after the Supreme Court blocked Missouri's newer map for the general election. The game therefore uses Missouri's [2024 CD119 shapefile](https://www2.census.gov/geo/tiger/TIGER2024/CD/tl_2024_29_cd119.zip), whose boundaries were also used in 2022 and 2024, for the Missouri districts. For the other states, CD120 reflects the district geography submitted for the 2026 cycle. The generator excludes statewide `ZZ` records and validates the final set at 435 districts.
- State outlines: generalized state geometry already used by this project, derived from the studio's Battle For America project. Those reference files were copied into this game; the original Battle For America files were not edited.
- Alaska and Hawaii are projected into inset regions; the lower 48 use a contiguous U.S. projection.

## Party-control snapshots

- House and Senate: reported 2026 election winners and remaining uncalled seats were read from the [120th United States Congress membership and election-results page](https://en.wikipedia.org/wiki/120th_United_States_Congress), checked on November 10, 2026. For Senate maps, independent senators who caucus with Democrats count as Democratic control. Gray marks results that are not called or not listed.
- Governors: current party control was initialized from the project's 2026 governor snapshot; Alaska is updated to Democratic control, and Kansas remains explicitly pending.
- State legislatures: chamber control comes from the included Stateside-reported [2026 state legislative election snapshot](https://www.stateside.com/election/2026-state-legislative-elections), checked November 10, 2026. Its unresolved Alaska and North Carolina control is represented as unknown. Nebraska is shown as nonpartisan. Split Democratic/Republican chambers are purple as one whole-state fill.

These are reported, provisional results, not certified records. The [Associated Press 2026 results update](https://apnews.com/article/90ce111a971a0f70ba938d27fe69f65d) noted that congressional races remained outstanding on November 10. Control can change when outstanding races are called or certification completes. The map's sources and snapshots should be refreshed before a later release.

## Generation

Run `node scripts/generate-map-data.cjs` from the project folder after placing the Census shapefiles in `obj/cd120-shp/`. The script simplifies and delta-encodes SVG paths, compresses the payload, and writes `maps-0.3.js`. `index.html` loads this file before the game scripts use map data. The build script includes it in the Windows executable.
