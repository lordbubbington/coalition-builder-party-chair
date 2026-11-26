/**
 * Coalition Builder: Party Chair — v0.18.5 Core Module
 * UiSetupViews: Setup screen markup & Custom Party Creator markup.
 * Zero-behavior-change extraction from app.js.
 */
(function (root) {
  'use strict';

  function renderCustomEmblemSvg(emblemId) {
    const emblem = (window.PartyChairData?.CUSTOM_PARTY_EMBLEMS || []).find((e) => e.id === emblemId);
    return emblem ? emblem.svg : '';
  }

  function customPartyCreatorMarkup(state, helpers) {
    const {
      STATES,
      customSelectedEmblem,
      customOrigin,
      customCharterTraits,
      custom100kStateAllocations,
      custom100kName,
      custom100kSliders,
      custom100kIssues,
      customSelectedFactionIds,
      customLeadingFactionId,
      customSchismParent,
      customPartyName,
      customPartyCode,
      customFoundingStateId,
      customPartyColor,
      customPartyMotto,
      customLeaderName,
      selectedLeaderArchetype,
    } = state;
    const {
      safe,
      getCustomLeaderArchetypes,
      renderCurrentPoliticianPicker,
      customPlatformMarkup,
    } = helpers;

    const origins = window.PartyChairData?.CUSTOM_PARTY_ORIGINS || [];
    const traits = window.PartyChairData?.CUSTOM_CHARTER_TRAITS || [];
    const emblems = window.PartyChairData?.CUSTOM_PARTY_EMBLEMS || [];
    const allStates = window.PartyChairData?.STATES || STATES || [];
    const leaderArchetypes = getCustomLeaderArchetypes();

    // Emblem picker
    const emblemsHtml = emblems.map((e) => `
      <button type="button" class="emblem-card ${customSelectedEmblem === e.id ? 'selected' : ''}" data-custom-emblem="${safe(e.id)}" title="${safe(e.name)}">
        ${e.svg}
      </button>
    `).join('');

    // Origin cards
    const originsHtml = origins.map((orig) => `
      <div class="custom-origin-card ${customOrigin === orig.id ? 'selected' : ''}" data-custom-origin="${safe(orig.id)}">
        <b>${safe(orig.name)}</b>
        <small style="color:var(--gold);font-weight:700;margin-bottom:2px">$${orig.startingBudgetMillions}M Starting War Chest</small>
        <small><b>Upside:</b> ${safe(orig.upsides)}</small>
        <small style="color:#f87171"><b>Trade-Off:</b> ${safe(orig.downsides)}</small>
      </div>
    `).join('');

    // Charter traits cards
    const traitsHtml = traits.map((tr) => {
      const isChecked = customCharterTraits.includes(tr.id);
      let isDisabled = false;
      if (tr.id === 'big_tent_pragmatism' && customCharterTraits.includes('doctrinal_vanguard')) isDisabled = true;
      if (tr.id === 'doctrinal_vanguard' && customCharterTraits.includes('big_tent_pragmatism')) isDisabled = true;
      if (!isChecked && customCharterTraits.length >= 2) isDisabled = true;

      return `
        <label class="charter-trait-card ${isDisabled ? 'disabled' : ''} ${isChecked ? 'selected' : ''}">
          <input type="checkbox" data-custom-trait="${safe(tr.id)}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <div>
            <b style="font-size:13px;color:#fff">${safe(tr.name)}</b>
            <small style="display:block;font-size:11.5px;color:#cbd5e1;margin-top:2px">${safe(tr.effects)}</small>
          </div>
        </label>
      `;
    }).join('');

    // Section 04: Starting Movement & Coalition
    let coalitionSectionHtml = '';
    if (customOrigin === 'not_major_movement') {
      const totalAllocated = Object.values(custom100kStateAllocations).reduce((sum, v) => sum + (Number(v) || 0), 0);
      const issues = window.PartyChairData?.VERSION_021_ISSUES || [];
      coalitionSectionHtml = `
        <div class="custom-drawer-section">
          <div class="custom-drawer-section-title">04 / Build Your Custom Founding Faction (100,000 Voters)</div>
          <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px">
            <i>Not a Major Movement</i> starts outside all existing party factions — craft your own 100,000-voter founding movement below.
          </p>
          <div class="custom-100k-form-grid">
            <div>
              <label class="field-label">Faction Name
                <input id="custom-100k-name" maxlength="36" value="${safe(custom100kName)}" placeholder="e.g. Heartland Civic League">
              </label>
            </div>
            <div>
              <label class="field-label">Economic Position: <span id="custom-100k-econ-val">${custom100kSliders.economic}</span>
                <input type="range" id="custom-100k-econ" min="1" max="10" step="0.5" value="${custom100kSliders.economic}">
              </label>
            </div>
            <div>
              <label class="field-label">Social Position: <span id="custom-100k-soc-val">${custom100kSliders.social}</span>
                <input type="range" id="custom-100k-soc" min="1" max="10" step="0.5" value="${custom100kSliders.social}">
              </label>
            </div>
            <div style="display:flex;gap:8px">
              <div style="flex:1">
                <label class="field-label">Core Issue 1
                  <select id="custom-100k-issue-1">
                    ${issues.map((i) => `<option value="${safe(i.id)}" ${custom100kIssues[0] === i.id ? 'selected' : ''}>${safe(i.label)}</option>`).join('')}
                  </select>
                </label>
              </div>
              <div style="flex:1">
                <label class="field-label">Core Issue 2
                  <select id="custom-100k-issue-2">
                    ${issues.map((i) => `<option value="${safe(i.id)}" ${custom100kIssues[1] === i.id ? 'selected' : ''}>${safe(i.label)}</option>`).join('')}
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div style="padding:12px;background:var(--panel);border-radius:6px;border:1px solid var(--line)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <b style="font-size:12.5px;color:var(--gold)">State Voter Allocation</b>
              <span id="custom-100k-total" style="font-size:12px;font-weight:700;color:${totalAllocated === 100000 ? '#86efac' : '#f87171'}">Allocated: ${totalAllocated.toLocaleString()} / 100,000 Voters</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
              <button type="button" class="button button-small" data-alloc-preset="home-state">100% Home State</button>
              <button type="button" class="button button-small" data-alloc-preset="regional">Regional Cluster</button>
              <button type="button" class="button button-small" data-alloc-preset="national">National Prop.</button>
              <button type="button" class="button button-small" data-alloc-preset="clear">Clear</button>
            </div>
            <div class="custom-alloc-accordion-container">
              ${['Northeast', 'Midwest', 'South', 'West'].map((regionName) => {
                const regionStates = allStates.filter((s) => (s.region || 'South') === regionName);
                const regionTotal = regionStates.reduce((sum, s) => sum + (Number(custom100kStateAllocations[s.id]) || 0), 0);
                return `
                  <details class="alloc-region-accordion" open>
                    <summary class="alloc-region-summary">
                      <span>${regionName} (${regionStates.length} States)</span>
                      <small style="color:var(--text-muted)">${regionTotal.toLocaleString()} Voters</small>
                    </summary>
                    <div class="alloc-region-grid">
                      ${regionStates.map((st) => {
                        const val = custom100kStateAllocations[st.id] || 0;
                        return `
                          <div style="display:flex;justify-content:space-between;align-items:center;padding:3px 6px;background:var(--panel2);border:1px solid var(--line);border-radius:4px;font-size:11.5px">
                            <span>${st.id}</span>
                            <input type="number" step="100" min="0" max="100000" data-state-alloc="${st.id}" value="${val}" style="width:70px;padding:2px 4px;font-size:11px;text-align:right">
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </details>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    } else {
      // Catalog Faction Picker with Centroid Compatibility
      const cat = (typeof window.PartyChairEngine?.getFactionsCatalog === 'function' ? window.PartyChairEngine.getFactionsCatalog() : (window.PartyChairData?.ALL_PARTY_FACTIONS || []));
      const factionMap = new Map(cat.map((f) => [f.id, f]));

      let totalVotersChosen = 0;
      customSelectedFactionIds.forEach((fid) => {
        const f = factionMap.get(fid);
        const fVoters = f ? (f.targetVoters || window.PartyChairData?.FACTION_NATIONAL_TOTALS?.[f.id] || 0) : 0;
        totalVotersChosen += fVoters;
      });

      let advisoryLabel = '● Realism Recommended · Under 1.0M Voters';
      if (totalVotersChosen >= 5000000) advisoryLabel = '● Roleplay / Sandbox Experience · Over 5.0M Voters';
      else if (totalVotersChosen >= 1000000) advisoryLabel = '● Healthy Balance Recommended · 1.0M–5.0M Voters';

      const factionsByGroup = {
        'Democratic Factions': cat.filter((f) => f.partyId === 'people'),
        'Republican Factions': cat.filter((f) => f.partyId === 'heritage'),
        'Minor Party Factions': cat.filter((f) => ['liberty', 'green', 'constitution', 'socialist'].includes(f.partyId)),
        'Swing & Independent Wings': cat.filter((f) => ['independent', 'none', 'unaffiliated'].includes(f.partyId) || String(f.id).startsWith('swg_')),
      };

      coalitionSectionHtml = `
        <div class="custom-drawer-section">
          <div class="custom-drawer-section-title">04 / Starting Factions Picker (Select ≥ 1 Faction · Centroid Compatibility)</div>
          <div class="playstyle-advisory-banner">
            <b>${advisoryLabel}</b> (${(totalVotersChosen / 1000000).toFixed(2)}M Voters · ${customSelectedFactionIds.length} Factions Selected)
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
            ${Object.entries(factionsByGroup).map(([grpName, fList]) => `
              <div style="padding:10px;background:rgba(15,23,42,0.5);border-radius:6px;border:1px solid rgba(148,163,184,0.15)">
                <b style="font-size:12px;color:var(--gold);display:block;margin-bottom:8px">${grpName}</b>
                <div style="display:flex;flex-direction:column;gap:6px">
                  ${fList.map((f) => {
                    const isAnchor = f.id === 'dem_liberal_establishment' || f.id === 'gop_maga';
                    const isSelected = customSelectedFactionIds.includes(f.id);
                    const fEcon = f.sliders?.economic ?? f.economic ?? 5;
                    const fSoc = f.sliders?.social ?? f.social ?? 5;
                    const fVoters = f.targetVoters || window.PartyChairData?.FACTION_NATIONAL_TOTALS?.[f.id] || 0;

                    let isPairwiseIncompatible = false;
                    let conflictName = '';
                    if (!isSelected && !isAnchor && customSelectedFactionIds.length > 0) {
                      const sameSchismParent = customOrigin === 'major_schism' && customSchismParent && f.partyId === customSchismParent;
                      if (!sameSchismParent) {
                        const centroidTol = (customOrigin === 'executive_third_way' || customOrigin === 'civic_reform') ? 3.2 : (customOrigin === 'major_schism' ? 3.5 : 2.8);
                        let sumEcon = 0; let sumSoc = 0; let cnt = 0;
                        for (const prevId of customSelectedFactionIds) {
                          const prevF = factionMap.get(prevId);
                          if (!prevF) continue;
                          sumEcon += (prevF.sliders?.economic ?? prevF.economic ?? 5);
                          sumSoc += (prevF.sliders?.social ?? prevF.social ?? 5);
                          cnt++;
                        }
                        if (cnt > 0) {
                          const meanEcon = sumEcon / cnt;
                          const meanSoc = sumSoc / cnt;
                          if (Math.abs(fEcon - meanEcon) > centroidTol + 1e-9 || Math.abs(fSoc - meanSoc) > centroidTol + 1e-9) {
                            isPairwiseIncompatible = true;
                            conflictName = 'selected coalition centroid';
                          }
                        }
                      }
                    }

                    const isDisabled = isAnchor || isPairwiseIncompatible;
                    const tooltip = isAnchor
                      ? 'Ironclad Major Party Anchor Lock: Cannot leave parent party.'
                      : (isPairwiseIncompatible ? `Ideological friction too severe with ${conflictName}` : '');

                    const isChosenLeader = isSelected && (customLeadingFactionId === f.id || (!customLeadingFactionId && customSelectedFactionIds[0] === f.id));
                    return `
                      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                        <label style="display:flex;align-items:flex-start;gap:8px;font-size:12px;color:${isDisabled ? 'rgba(255,255,255,0.4)' : '#fff'};cursor:${isDisabled ? 'not-allowed' : 'pointer'};flex:1" title="${safe(tooltip)}">
                          <input type="checkbox" data-custom-faction="${safe(f.id)}" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                          <div>
                            <b>${safe(f.name)}</b> ${isAnchor ? '<span style="font-size:10px;color:var(--gold)">🔒 ANCHOR</span>' : ''}
                            <small style="display:block;font-size:11px;color:var(--text-muted)">Econ ${fEcon.toFixed(1)} · Soc ${fSoc.toFixed(1)} · ${(fVoters / 1000000).toFixed(2)}M Voters</small>
                          </div>
                        </label>
                        ${isSelected ? `<button type="button" class="button button-small" data-set-custom-leading-faction="${safe(f.id)}" style="padding:2px 7px;font-size:10.5px;white-space:nowrap;${isChosenLeader ? 'background:rgba(226,189,112,0.25);border-color:var(--gold);color:var(--gold);font-weight:700' : 'opacity:0.75'}" title="Set as your party's Leading Faction (sets initial issue stances)">${isChosenLeader ? '👑 Leading Faction' : 'Set Leading'}</button>` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="custom-party-drawer">
        <div class="eyebrow" style="color:var(--gold)">Custom Party Creator</div>
        <h3 style="margin:4px 0 14px;color:#fff">Design Your New Political Movement</h3>

        <!-- 01 / Basic Identity & Branding -->
        <div>
          <div class="custom-drawer-section-title">01 / Core Identity & Branding Suite</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
            <div>
              <label class="field-label">Party Name
                <input id="custom-party-name" maxlength="32" value="${safe(customPartyName)}" placeholder="e.g. Common Ground Party">
              </label>
            </div>
            <div>
              <label class="field-label">3-Letter Broadcast Code
                <input id="custom-party-code" maxlength="4" value="${safe(customPartyCode)}" placeholder="CGP" style="text-transform:uppercase;font-family:monospace">
              </label>
            </div>
            <div>
              <label class="field-label">Founding State Fortress
                <select id="custom-founding-state">
                  ${allStates.map((s) => `<option value="${s.id}" ${customFoundingStateId === s.id ? 'selected' : ''}>${safe(s.name)} (${s.id})</option>`).join('')}
                </select>
              </label>
            </div>
            <div>
              <label class="field-label">Party Color
                <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
                  <input type="color" id="custom-party-color" value="${customPartyColor}" style="width:36px;height:28px;border:none;background:none;cursor:pointer">
                  <input type="text" id="custom-party-color-hex" value="${customPartyColor}" style="width:85px;padding:4px;font-family:monospace;font-size:12px">
                </div>
              </label>
            </div>
          </div>

          <div style="margin-top:12px">
            <label class="field-label">Founding Motto (Broadcast Epigraph)
              <input id="custom-party-motto" maxlength="90" value="${safe(customPartyMotto)}" placeholder="e.g. Pragmatism over partisanship.">
            </label>
          </div>

          <div style="margin-top:12px">
            <label class="field-label">Party Emblem (10 Vector Insignias)</label>
            <div class="emblem-grid">${emblemsHtml}</div>
          </div>
        </div>

        <!-- 02 / Origin Story -->
        <div class="custom-drawer-section">
          <div class="custom-drawer-section-title">02 / Party Origin Story (Pick 1 of 5)</div>
          <div class="custom-origin-grid">${originsHtml}</div>
          ${customOrigin === 'major_schism' ? `
            <div style="margin-top:10px;padding:10px 14px;background:rgba(15,23,42,0.6);border-radius:6px;border:1px solid rgba(148,163,184,0.2);display:flex;align-items:center;gap:16px">
              <b style="font-size:12.5px;color:#fff">Parent Party to Split From:</b>
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#fff;cursor:pointer">
                <input type="radio" name="schism-parent" value="people" ${customSchismParent === 'people' ? 'checked' : ''}> Democratic Party
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#fff;cursor:pointer">
                <input type="radio" name="schism-parent" value="heritage" ${customSchismParent === 'heritage' ? 'checked' : ''}> Republican Party
              </label>
            </div>
          ` : ''}
        </div>

        <!-- 03 / Founding Charter Traits -->
        <div class="custom-drawer-section">
          <div class="custom-drawer-section-title">03 / Founding Charter Traits (Pick 1–2)</div>
          <div class="charter-traits-grid">${traitsHtml}</div>
        </div>

        <!-- 04 / Coalition & Movement -->
        ${coalitionSectionHtml}

        <!-- Founding Figurehead -->
        <div class="custom-drawer-section">
          <div class="custom-drawer-section-title">05 / Founding Party Leader</div>
          <div style="margin-bottom:12px">
            <label class="field-label">Founding Leader Name
              <input id="custom-leader-name" maxlength="40" value="${safe(customLeaderName)}" placeholder="e.g. Jordan Sterling">
            </label>
          </div>
          <div class="v09-leader-archetype-grid">
            ${leaderArchetypes.map((arch) => `
              <button type="button" class="v09-leader-archetype-card ${selectedLeaderArchetype === arch.id ? 'selected' : ''}" data-leader-archetype="${safe(arch.id)}">
                <div class="head">
                  <b>${safe(arch.label)}</b>
                  <span class="fame-pill">Fame ${arch.startingFame || 50}</span>
                </div>
                <p>${safe(arch.description)}</p>
                <span class="upside"><b>Upside:</b> ${safe(arch.upsides)}</span>
                <span class="downside"><b>Downside:</b> ${safe(arch.downsides)}</span>
              </button>
            `).join('')}
          </div>
          ${selectedLeaderArchetype === 'current-politician' ? renderCurrentPoliticianPicker() : ''}
        </div>

        <!-- Platform Customizer -->
        <div class="custom-drawer-section">
          <div class="custom-drawer-section-title">06 / Platform Positions across ${(window.PartyChairData?.VERSION_021_ISSUES || []).length} Issues</div>
          ${customPlatformMarkup()}
        </div>
      </div>
    `;
  }

  function setupMarkup(state, helpers) {
    const {
      game,
      PARTY_ARCHETYPES,
      V07,
      custom,
      selectedTemplate,
      customOrigin,
      customSelectedFactionIds,
      custom100kStateAllocations,
    } = state;
    const {
      customPartyCreatorMarkupFn,
      allocationValidationModalMarkup,
    } = helpers;

    const isCustomMode = custom || selectedTemplate === 'custom';
    return `
      <header class="topbar"><div class="brand"><img class="brand-icon" src="assets/coalition-builder-icon.svg" alt=""> COALITION BUILDER: <i>PARTY CHAIR</i></div><div class="topbar-actions"><button type="button" class="text-button" id="open-save-slots-1" data-dup-id="open-save-slots">Load Saved Game (5 Slots)</button><span class="top-status">VERSION 0.18.9.4</span></div></header>
      <main class="screen setup-screen">
        <section class="hero panel">
          <div class="eyebrow">Build a party that lasts</div>
          <h1>Politics is a long game.<br><span>Make sure your party wins it.</span></h1>
          <p class="hero-copy">Lead an American political party through the years—shaping platforms, guiding contested Presidential Primaries, commanding an interactive 5-month (8-action/month) General Election War Room, and watching live Election Night returns unfold from 2028 onward.</p>
        </section>
        <div class="setup-grid">
          <section class="panel setup-card">
            <div class="eyebrow">01 / Choose the party you will chair</div>
            <h2>Which party will you lead?</h2>
            <div class="archetype-grid">
              ${PARTY_ARCHETYPES.map((party) => {
                const budget = V07 ? V07.startingBudgetForParty(party.id, false) : (party.startingBudget || 150);
                return `<button type="button" data-template="${party.id}" class="archetype ${selectedTemplate === party.id && !isCustomMode ? 'selected' : ''}" style="--party:${party.color}"><span class="party-dot"></span><b>${party.name}</b><small>${party.description} <span class="setup-budget-pill">$${budget}M starting funds · ${party.isMajor ? 'Major Party' : 'Minor Party'}</span></small></button>`;
              }).join('')}
            </div>
            <div style="margin-top:14px">
              <button type="button" id="btn-create-custom-party" class="button ${isCustomMode ? 'button-gold' : ''}" style="width:100%;padding:14px;font-size:14.5px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:10px;border:1.5px dashed var(--gold);background:${isCustomMode ? 'rgba(226,189,112,0.15)' : 'rgba(255,255,255,0.02)'}">
                <span style="font-size:18px">✦</span>
                <span>CREATE CUSTOM PARTY <small style="font-weight:400;opacity:0.85;margin-left:6px">(Start fresh — no preset template inherited)</small></span>
              </button>
            </div>
            ${isCustomMode ? customPartyCreatorMarkupFn() : ''}
            ${isCustomMode && customOrigin !== 'not_major_movement' && (!customSelectedFactionIds || customSelectedFactionIds.length === 0) ? '<p style="color:#f59e0b;font-size:12.5px;margin:8px 0 4px">Select at least one starting faction (including extremist or unaffiliated wings), or choose "Not a Major Movement" to build a custom 100K faction.</p>' : ''}
            <!-- [v0.18.4 ATLAS-HOTSEAT] -->
            ${window.AtlasMultiplayerSystem ? window.AtlasMultiplayerSystem.renderHotseatSetupToggle(isCustomMode ? 'player' : selectedTemplate) : ''}
            <button type="button" id="start-game" class="button button-gold start-button" ${isCustomMode && ((customOrigin === 'not_major_movement' && Object.values(custom100kStateAllocations || {}).reduce((s, v) => s + (Number(v) || 0), 0) !== 100000) || (customOrigin !== 'not_major_movement' && (!customSelectedFactionIds || customSelectedFactionIds.length === 0))) ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>Take the chair <span>→</span></button>
            <p class="setup-foot">Version 0.18.9.4 · Spoiler Realignment &amp; State Senate Tracking · Local autosave</p>
          </section>
          <aside class="panel setup-aside">
            <div class="eyebrow">The ${game?.year || 2028} turn loop</div>
            <div class="loop-step"><i>1</i><span><b>Issue Positions (${window.PartyChairData.VERSION_021_ISSUES.length} Issues)</b><small>Adjust the unified ${window.PartyChairData.VERSION_021_ISSUES.length}-issue platform; your summary ideological axes update automatically.</small></span></div>
            <div class="loop-step"><i>2</i><span><b>Major & Party Focus Priorities</b><small>Select 3 Major Priorities from the Strategic Quests catalog, plus up to 10 Party Focus targets across issues, states, and regions.</small></span></div>
            <div class="loop-step"><i>3</i><span><b>Filter Primary Support</b><small>Inspect 10-stat candidate profiles, Net Approval & Fame in Senate Class III and Governor races. Respect sitting incumbents or face backlash.</small></span></div>
            <div class="loop-step"><i>4</i><span><b>Party Machine Operations</b><small>Spend your 20 pre-campaign leadership actions on 50-state chapters, bills, voter drives, and recruits before the 5-month general campaign.</small></span></div>
            <div class="aside-divider"></div>
            <p class="eyebrow">${game?.year || 2028} Presidential Ticket</p>
            <p class="aside-copy">Jon Ossoff carries the Democratic ticket; J. D. Vance carries the Republican ticket. Top-of-the-ticket margins exert a 34% coattail effect on House districts.</p>
          </aside>
        </div>
        ${allocationValidationModalMarkup()}
      </main>`;
  }

  const UiSetupViews = {
    renderCustomEmblemSvg,
    customPartyCreatorMarkup,
    setupMarkup,
  };

  if (typeof window !== 'undefined') window.UiSetupViews = UiSetupViews;
  if (typeof root !== 'undefined' && root) root.UiSetupViews = UiSetupViews;
  if (typeof module !== 'undefined' && module.exports) module.exports = UiSetupViews;
})(typeof globalThis !== 'undefined' ? globalThis : this);
