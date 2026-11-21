# Coalition Builder: Party Chair — TBD Updates

This document maintains the persistent, dedicated repository of **TBD (To Be Determined) designs, exploratory concepts, and future feature reminders** for **Coalition Builder: Party Chair**.

> ⚠️ **MANDATORY DESIGN PROTOCOL FOR TBD UPDATES:**
> 1. Whenever the project owner requests adding a **"TBD"** change, concept, or reminder to the design document or the backlog, **add it directly to this document (`TBD_UPDATES.md`) instead**.
> 2. Items in this document represent active conceptual reminders and research targets awaiting formal specification and sizing for near-term builds or major version planning.
> 3. When reviewing or providing an accounting of TBD items, read them out directly from this document.
> 4. *(Version 0.17.0 Completion Note):* The flagship major package for **Version 0.17.0** has shipped in full per [**VERSION_0.17.0_DESIGN.md**](VERSION_0.17.0_DESIGN.md) covering `TBD-03`, `TBD-09`, `TBD-10`, `TBD-11`, `TBD-13`, `TBD-16`, `TBD-17`, `TBD-20`, `TBD-21`, `TBD-26`, `TBD-27`, and `TBD-29` as requirements `REQ-287` through `REQ-298`. Promoted concepts are archived below in Section 3 per the Selective Archival rule. Active conceptual items (`TBD-02`, `TBD-15`, `TBD-18`, `TBD-19`, `TBD-24`) remain in the active conceptual queue.

---

## 1. TBD Conceptual Queue & Master Inventory (Active)

| Ref ID | TBD Topic | Suggested Scope | Date Logged | Architectural Intent & Core Concept | Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **TBD-02** | Electoral System Reform Policy Bills (MMP & Proportional Representation) | Large | Nov 13, 2026 | Expand policy bills beyond state spending to landmark structural reforms fundamentally altering electoral systems (MMP, multi-member PR, national RCV). | 💡 Active Queue |
| **TBD-15** | Scale-Tiered Polling Gain Costs (Bigger Races Cost More) | Medium / Large | Nov 15, 2026 | Scale candidate polling gain dollar costs by race scale and media market size; larger electorate races require proportionally more money to achieve the same 1.0% lift. | 💡 Active Queue |
| **TBD-18** | Complex Faction Demands — Legislative Bill Enactment | Medium | Nov 15, 2026 | Minor and Major factions demanding guaranteed passage of specific legislative bills during the biennial session. | 💡 Active Queue |
| **TBD-19** | Complex Faction Demands — National Convention Keynotes | Small | Nov 15, 2026 | Demands for prime-time National Convention Keynote addresses to elevate a faction's national profile. | 💡 Active Queue |
| **TBD-24** | Federal Governing & Legislative Agenda Loop | Large | Nov 15, 2026 | Passable federal legislative agenda when controlling Congress/Presidency; passing bills lifts environment but burns faction capital. | 💡 Active Queue |

---

## 2. Detailed Conceptual Notes & Future Research (Active Queue)

### TBD-02: Electoral System Reform Policy Bills (MMP & Proportional Representation)
- **Core Concept:** Expand the legislative policy bill system beyond fiscal expenditures into structural democratic reforms.
- **Architectural Scope:** Allow state or federal legislation enacting Mixed-Member Proportional (MMP), multi-member ranked-choice districts, or proportional representation, radically changing minor party seat acquisition formulas.
- *Cross-reference (`REQ-185`, `REQ-186`):* `REQ-185` establishes the permanent `game.stateElectoralSystems` engine (RCV, Approval, Proportional House/State Leg, starting with Alaska RCV), while `REQ-186` serves only as a temporary inter-cycle random popup for third-party playtesting until `TBD-02` replaces it with player/legislature-driven reform bills and ballot initiatives.
- *Cross-reference (`REQ-187`, `REQ-188`, `REQ-191`):* Kingmaker Caucus bargaining (`REQ-187` / `REQ-188`) and 12th Amendment Contingent Elections (`REQ-191`) serve as high-leverage diplomatic pathways to enact `REQ-185` state electoral reforms before full legislative reform bills ship.

### TBD-15: Scale-Tiered Polling Gain Costs (Bigger Races Cost More)
- **Core Concept:** Electorate and media market size scaling for candidate ad expenditures.
- **Architectural Scope:**
  - Currently, candidate ad funding uses a unified diminishing returns curve ($1M $\to$ +1.0% to $500M $\to$ +8.0%).
  - In real-world elections, moving the needle by 1.0% in an individual congressional district (e.g. 750,000 citizens) or a low-cost media market state (Wyoming, Vermont, North Dakota) costs far less money than moving the needle by 1.0% in massive mega-states (California, Texas, Florida, New York) or nationwide in a presidential campaign.
  - Explore integrating an **Electoral Scale Multiplier** into the funding curve:
    - **House District / Small States (CVAP $< 2\text{M}$):** Standard or discount cost baseline ($0.75\times–1.0\times$ cost per point).
    - **Mid-Sized States (CVAP $2\text{M}–6\text{M}$):** Standard baseline ($1.0\times$).
    - **Large / Expensive Media States (CVAP $> 10\text{M}$, e.g. CA, TX, FL, NY, PA):** Require $1.5\times–3.0\times$ more expenditure for each percentage point of polling gain to model broadcast ad rate inflation and electorate dilution.
    - **Presidential Campaigns:** Requires tens to hundreds of millions across nationwide battlegrounds to achieve equivalent fractional polling movement.

### TBD-18: Complex Faction Demands — Legislative Bill Enactment
- **Core Concept:** Minor and Major factions demanding the guaranteed passage (not just introduction) of a specific legislative bill addressing their core issues during the biennial session.

### TBD-19: Complex Faction Demands — National Convention Keynotes
- **Core Concept:** Demands for the prime-time National Convention Keynote address to elevate their faction's national ideological profile.

### TBD-24: Federal Governing & Legislative Agenda Loop (Topic E)
- **Core Concept:** While state trifectas currently unlock state policy bills, there is no active federal governing loop when a party captures national power.
- **Architectural Scope:**
  - **Federal Legislative Agenda:** When a party holds federal governing power (controlling the White House and/or congressional majorities in the House or Senate), it unlocks a dynamic legislative agenda of passable federal policy bills across economic, social, energy, and judicial domains.
  - **Passing Popular Legislation:** Successfully shepherding high-profile federal bills through Congress boosts the national macroeconomic environment, elevates presidential approval, and grants lasting systemic bonuses.
  - **Faction Capital Burn & Base Disillusionment:**
    - Passing compromise legislation burns internal faction political capital, alienating purist or factional hardliners who demand ideological orthodoxy.
    - Conversely, legislative paralysis or failing to deliver on promised flagship agenda items triggers severe base disillusionment, depressing core faction happiness, member donations, and midterm turnout.
- *Cross-reference (`REQ-187`, `REQ-191`):* Confidence-and-Supply bargains (`REQ-187`) and Contingent Election Cabinet/Platform commitments (`REQ-191`) create multi-party governing coalitions that `TBD-24` can later tie into federal bill passage and breach-of-deal consequences.

---

## 3. Archived & Shipped in Version 0.17.0 (Faction Systems Release)

| Ref ID | TBD Topic | Shipped Version | Shipped Req ID | Summary of Shipped Implementation |
| :--- | :--- | :---: | :---: | :--- |
| **TBD-03** | Party-Differentiated Voter Registration Patterns | v0.17.0 | REQ-287 | 6 faction growth archetypes with geographical lift multipliers; shaped drives conserve 155M electorate. |
| **TBD-09** | Modular "Filtering Support" Architecture | v0.17.0 | REQ-288 | 3-part intervention toolkit (Political Capital, Staff Support, Donor Conduits); parity doctrine enforced. |
| **TBD-10** | Modular Faction Endorsement Repercussions | v0.17.0 | REQ-289 | Loyalty boost (+3.5*assets) & cohesion-scaled resentment; escalation ladder (donor withholding -> bolt warning). |
| **TBD-11** | Faction-Tied Super PACs & Swing PAC Ecosystem | v0.17.0 | REQ-290 | Faction Super PAC registry; Tier 4 unlock gate/revocation; access coupling; Swing PAC doctrine evaluation. |
| **TBD-13** | Politician & Candidate Chronological Age Engine | v0.17.0 | REQ-291 | Birth year persistence; longevity weighting; 78–83 retirement window; age-gated trait conversion. |
| **TBD-16** | Complex Faction Demands — Leadership Appointments | v0.17.0 | REQ-292 | Uniform offer schema; gavel appointments module; acceptance loyalty reward & refusal penalty. |
| **TBD-17** | Complex Faction Demands — Super PAC Airtime Warchests | v0.17.0 | REQ-293 | Super PAC airtime demand module; bastion spending audit; allied PAC access loss breaches demand. |
| **TBD-20** | Complex Faction Demands — Candidate Slate Quotas | v0.17.0 | REQ-294 | 25%–35% slate quotas audited at candidate recruitment close across party-scoped candidates. |
| **TBD-21** | Complex Faction Demands — Rival Faction Quarantine | v0.17.0 | REQ-295 | Hostile faction pair demand module; Satisfy, Refuse, and Fake Compliance paths with cohesion decay. |
| **TBD-26** | Faction Power vs. Size Attrition Mechanics | v0.17.0 | REQ-296 | 5-level officeholder audit (incl. statewide exec 0.20); bounded attrition toward power balance. |
| **TBD-27** | Faction Ideological Tightness Metric | v0.17.0 | REQ-297 | Numerical cohesion (0.10–1.00) across all 45 factions; scales backlash, demands, attrition & tolerance. |
| **TBD-29** | State & State-Party Policy Preferences | v0.17.0 | REQ-298 | 51-jurisdiction baseline platform deltas with hard 3-point clamp and asymmetric regional elasticity. |
