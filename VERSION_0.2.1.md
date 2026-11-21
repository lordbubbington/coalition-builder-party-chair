# Version 0.2.1

Version 0.2.1 adds a 40-issue national platform, a 1–10 issue-position slider, a larger responsive interface, and the studio-style Coalition Builder icon.

## Issue platform

The platform has seven categories: Economy & Affordability, Health & Family, Democracy & Government, Immigration & Public Safety, Rights & Education, Climate & Technology, and Foreign Affairs & Defense. Each issue has two labeled policy endpoints and an integer slider from 1 to 10. Starting positions derive from the selected party's existing economic, social, climate, or party-structure profile.

Changing a position uses one leadership action and moves the corresponding existing party axis slightly toward the selected position. This keeps issue choices tied to the game's party profile rather than presenting the issue values as precise public-opinion estimates. Sliders become unavailable when no actions remain or the election is complete.

## Issue research

Poll notes provide salience context only; they do not claim that the public supports either slider endpoint. Sources are linked in the issue panel:

- Pew Research Center, [2026 issue priorities](https://www.pewresearch.org/politics/2026/10/08/economy-ranks-as-top-issue-in-midterms-for-all-voters-but-partisans-differ-over-the-importance-of-other-issues/), survey fielded September 28–October 4, 2026.
- Gallup, [issues voters say matter in the 2026 midterm](https://news.gallup.com/poll/716333/issues-voters-say-matter-midterm.aspx), survey fielded October 1–19, 2026.
- Associated Press, [2026 AP Voter Poll analysis](https://www.ap.org/news-highlights/elections/2026/how-trump-and-republicans-lost-the-2026-midterm-elections-according-to-the-ap-voter-poll/).
- KFF, [health care issues ahead of the 2026 midterm election](https://www.kff.org/public-opinion/kff-health-tracking-poll-health-care-issues-in-the-lead-up-to-the-2026-midterm-election/).

Where a cited survey does not offer a comparable salience measure for an issue, the panel says so instead of assigning a polling percentage. These are national issue prompts, not state-specific public opinion estimates.

## Visual changes

- Existing CSS font sizes have been multiplied by three.
- Grids reflow into a wider, vertically scrolling layout with smaller-screen breakpoints for maps, actions, and issues.
- UI colors and type follow the studio guide in [`ART_STYLE.md`](ART_STYLE.md).
- `assets/coalition-builder-icon.svg` provides the 512×512 square app mark and browser favicon.

## Build

The self-contained executable package now includes `issues-0.2.1.js` and the `assets` directory. Rebuild with `./build.ps1`.
