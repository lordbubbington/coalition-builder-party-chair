# Coalition Builder: Party Chair — Workspace Agent Rules

## Strict Scope Discipline & No Unsolicited Deliverables

- **Deliver Strictly What Is Asked:** Answer or execute only the specific objective requested by the user. Do not append unsolicited deliverables, speculative next-phase proposals, or unprompted handoff blocks.
- **No Unsolicited Build Versions:** NEVER propose, initiate, or execute a version bump (`package.json`, `engine.js`, `SAVE_KEY`) or executable build unless the user explicitly instructs you to build, release, or bump a version ("I will tell you when to build a version"). Audits, evaluations, reviews, design notes, and exploratory tasks must NEVER introduce or suggest a new build version.

## Copy-Pastable Handoff Prompts (Explicit User Request Only)

- **Provide Strictly on Explicit Request:** Only provide copy-pastable handoff prompts when the user explicitly asks for them (e.g., "give me a handoff prompt", "write the prompt for the coding agent", "prepare handoff for the next session").
- **Never Include on Unprompted Messages:** Never attach a handoff prompt to audits, reviews, Q&A, status reports, design discussions, or conversational replies unless specifically asked.
- **Formatting When Requested:** Place each prompt inside its own clean fenced code block (` ```text `) with no conversational commentary inside. Prompts must be fully self-contained with exact file paths and clear scope.

## Standalone Code-Edit Minor Version Protocol

Whenever you are **explicitly instructed to edit game code files** (`.js`, `.css`, `.html`, `.cs`) and release a build:

### Applicability
- **Applies when:** You are explicitly tasked with implementing code edits on your own (or as the designated Integration Agent) AND the user has instructed you to build/release or update the game.
- **Does NOT apply when:**
  - The user requested an audit, review, analysis, bug report, or Q&A without asking for code edits or a new build.
  - You only edited documentation/design files.
  - You are a subagent working on a partial slice without integration responsibilities.

### Mandatory Minor Version Release Steps (`0.x.y` -> `0.x.(y+1)`) [Only When Explicitly Building]
1. **Increment the Minor Version (`0.0.x`):**
   - Bump `version` and `description` in `package.json`.
   - Bump `SAVE_KEY` (e.g., `partyChairGame.save.v15.5` -> `partyChairGame.save.v15.6`) while preserving backward-compatible migration from prior save keys in `engine.js`.
   - Bump version strings in `engine.js` (`createGame`, `normalizeGame`, `startNextCycle`, version check arrays) and UI version badges in `app.js`.
2. **Follow Minor Version Changelog & Doc Protocols:**
   - Record the shipped minor version and its changes in `PRIOR_UPDATES.md`.
   - Update `DESIGN.md` and `DESIGN_BACKLOG.md` where relevant to keep active design records synchronized with the live codebase.
3. **Verify & Rebuild Executable:**
   - Run the relevant Node verification/integration test scripts (`scripts/test-*.cjs`) and confirm all checks pass.
   - Rebuild the self-contained Windows executable via `powershell -ExecutionPolicy Bypass -File .\build.ps1` so `dist/release/Coalition Builder - Party Chair.exe` (and `dist/Coalition Builder - Party Chair.exe` when unlocked) contains the new minor version. If the `.exe` is currently locked because the user has it open, report that cleanly.

## Default Update Categorization by Size

Whenever listing, reporting, auditing, or presenting proposed or pending updates, requirements, or backlog items for any build or version:

- **Primary Categorization by Size:** Always group and categorize updates primarily by their **Size** (`Massive`, `Huge`, `Large`, `Medium`, `Small`, `Tiny`) by default, rather than grouping only by thematic clusters or listing them strictly numerically.
- **Explicit Override:** Do not deviate from size-based grouping unless the user explicitly instructs otherwise (e.g., "list chronologically", "group by system/file", or "present by thematic cluster").
- **Clarity & Counts:** Within each size category, state the count, requirement IDs, titles, and target files so build thresholds and scope are immediately visible.
