// Coalition Builder: Party Chair — System Party Systems UI Shell
// Renders the Top-Bar Active Era Badge, Qualitative Era Dossier Modal,
// Fullscreen Historic Realignment Transition Modal, and Historical Era Timeline.
// Strictly adheres to qualitative in-universe political journalism copy (zero raw probabilities, weights, or internal tags).

(function PartySystemsUIModule() {
  'use strict';

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getPSD() {
    if (typeof window !== 'undefined' && window.PartySystemsData) return window.PartySystemsData;
    if (typeof require !== 'undefined') {
      try { return require('./party-systems-data.js'); } catch {}
    }
    return null;
  }

  function getPSE() {
    if (typeof window !== 'undefined' && window.PartySystemsEngine) return window.PartySystemsEngine;
    if (typeof require !== 'undefined') {
      try { return require('./party-systems-engine.js'); } catch {}
    }
    return null;
  }

  function resolveCurrentEraInfo(game) {
    const psd = getPSD();
    const pse = getPSE();
    const ps = game?.partySystems || (pse ? pse.createInitialPartySystemsState(game) : null);
    const eraId = ps?.currentEraId || 'era_07_baseline';
    const eraNumber = Number(ps?.currentEraNumber || 7);
    const startYear = Number(ps?.currentEraStartYear || 2028);
    const roman = psd?.toRoman ? psd.toRoman(eraNumber) : String(eraNumber);
    const meta = (pse ? pse.getEraMetadata(eraId) : null) || psd?.BASELINE_ERA || {
      id: eraId,
      title: 'Polarized Duopoly',
      accentColor: '#c48f45',
      catalyst: 'Baseline 2028 Electoral Alignment',
      chronicle: ['American politics turns on a polarized two-party equilibrium shaped by nationalized media and tight battleground margins.'],
      dossier: {
        faultLines: 'Nationalized partisan alignments competing across swing suburbs and industrial corridors.',
        legislativeMood: 'Narrow majorities and high-stakes midterm swings.',
        culturalVibe: 'High base enthusiasm paired with deep skepticism of rival institutions.',
      },
    };
    const ordinal = pse?.ordinalSuffix ? pse.ordinalSuffix(eraNumber) : `${eraNumber}th`;
    return { ps, eraId, eraNumber, startYear, roman, ordinal, meta };
  }

  // 1. Persistent Top-Bar Active Era Badge (e.g., "🏛️ VIII: The AI Boom")
  function renderTopBarEraBadge(game) {
    if (!game) return '';
    const { roman, meta, startYear, ordinal } = resolveCurrentEraInfo(game);
    const accent = meta.accentColor || '#c48f45';
    return `<button type="button" class="era-topbar-badge" id="era-dossier-toggle" data-open-era-dossier style="--era-accent:${esc(accent)}" title="Inspect the ${esc(ordinal)} Party System Dossier (Established ${startYear})">
      <span class="era-badge-emblem" aria-hidden="true">🏛️</span>
      <span class="era-badge-roman">${esc(roman)}:</span>
      <span class="era-badge-title">${esc(meta.title)}</span>
    </button>`;
  }

  // 2. Fullscreen "Historic Realignment" Transition Modal
  function renderRealignmentModal(game) {
    const ps = game?.partySystems;
    if (!ps || ps.pendingModal !== 'realignment' || !ps.modalPayload) return '';
    const p = ps.modalPayload;
    const accent = p.accentColor || '#c48f45';
    const chronicleParas = Array.isArray(p.chronicle) && p.chronicle.length
      ? p.chronicle
      : ['The old political settlement has given way to a new national alignment, reshaping voter loyalties and legislative battlegrounds across the republic.'];
    const emergent = Array.isArray(p.emergentIssues) ? p.emergentIssues : [];
    const sunsetted = Array.isArray(p.sunsettedIssues) ? p.sunsettedIssues : [];

    const decisionMarkup = p.decisionModal && Array.isArray(p.decisionModal.options) && p.decisionModal.options.length
      ? `<section class="era-decision-section">
          <div class="era-ledger-eyebrow">Historic Chair Decision</div>
          <h3>${esc(p.decisionModal.title || 'Choose Your Path in the New Era')}</h3>
          <p class="era-decision-intro">${esc(p.decisionModal.description || '')}</p>
          <div class="era-decision-grid">
            ${p.decisionModal.options.map((opt) => `
              <button type="button" class="era-decision-card" data-era-decision="${esc(opt.id)}">
                <strong>${esc(opt.label)}</strong>
                <span>${esc(opt.summary || '')}</span>
              </button>
            `).join('')}
          </div>
        </section>`
      : '';

    return `
      <div class="era-realignment-backdrop" role="dialog" aria-modal="true" aria-labelledby="era-realignment-heading" style="--era-accent:${esc(accent)}">
        <div class="era-realignment-modal">
          <div class="era-realignment-crest">
            <span class="era-crest-roman">${esc(p.roman || 'VIII')}</span>
            <div>
              <div class="era-realignment-eyebrow">Historic Realignment · ${esc(p.year)}</div>
              <h2 id="era-realignment-heading">${esc(p.title)}</h2>
            </div>
          </div>

          <div class="era-catalyst-banner">
            <span class="era-catalyst-label">Historical Catalyst</span>
            <strong>${esc(p.catalyst)}</strong>
          </div>

          <div class="era-chronicle-body">
            ${chronicleParas.map((para) => `<p>${esc(para)}</p>`).join('')}
          </div>

          <section class="era-issue-ledger" aria-label="Platform Issue Transition Ledger">
            <div class="era-ledger-col era-ledger-emergent">
              <div class="era-ledger-eyebrow">Emergent National Issues (${emergent.length})</div>
              <ul>
                ${emergent.map((iss) => `
                  <li>
                    <span class="era-issue-name">${esc(iss.label)}</span>
                    <span class="era-issue-cat">${esc(iss.category)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="era-ledger-col era-ledger-sunset">
              <div class="era-ledger-eyebrow">Sunsetted Legacy Issues (${sunsetted.length})</div>
              <ul>
                ${sunsetted.map((iss) => `
                  <li class="era-issue-sunset">
                    <span class="era-issue-name">${esc(iss.label)}</span>
                    <span class="era-issue-cat">${esc(iss.category)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </section>

          ${decisionMarkup}

          <div class="era-realignment-actions">
            <button type="button" class="era-gold-btn" data-dismiss-realignment-modal>Enter the New Political Era</button>
          </div>
        </div>
      </div>`;
  }

  // 3. Qualitative Era Dossier Modal
  function renderEraDossierModal(game) {
    if (!game) return '';
    const { ps, roman, ordinal, startYear, meta } = resolveCurrentEraInfo(game);
    const pse = getPSE();
    const accent = meta.accentColor || '#c48f45';
    const dossier = meta.dossier || {};
    const chronicleParas = Array.isArray(meta.chronicle) ? meta.chronicle : [];
    const activeEraIssues = (ps?.eraExclusiveIssuesActive || [])
      .map((id) => (pse ? pse.getIssueDefinition(game, id) : null))
      .filter(Boolean);
    const indCamp = ps?.independentPresidency?.activeCampaign || null;

    const indSection = indCamp
      ? `<section class="era-dossier-block era-ind-dispatch">
          <div class="era-ledger-eyebrow">Active Independent Presidential Bid (${esc(indCamp.year)})</div>
          <h4>${esc(indCamp.name)} · ${esc(indCamp.archetypeLabel)}</h4>
          <p>${esc(indCamp.summary)}</p>
          <div class="era-ind-meta">
            <span>Home State: <b>${esc(indCamp.homeStateName)}</b></span>
            <span>Standing: <b>${esc(indCamp.pollingTierLabel)}</b></span>
            <span>Traits: <b>${esc((indCamp.traits || []).join(', '))}</b></span>
          </div>
        </section>`
      : '';

    const cs = ps?.coalitionSystem;
    const coalitionSection = cs?.mmpActive
      ? `<section class="era-dossier-block era-coalition-dossier">
          <div class="era-ledger-eyebrow">Nationwide MMP & Coalition Governance</div>
          <h4>${esc(cs.activeCoalitionName || 'Multi-Party Parliament Active')} · ${cs.playerRole === 'opposition' ? 'Official Opposition' : 'Governing Compact'}</h4>
          <p>Federal elections operate under Nationwide Mixed-Member Proportional representation with a two-faction cap per party. ${cs.playerRole === 'opposition' ? 'Your committee leads the Official Opposition with heightened base enthusiasm.' : `Current Coalition Stability stands at ${Math.round(cs.stability ?? 75)}/100.`}</p>
          ${Array.isArray(cs.nationalCoalitions) && cs.nationalCoalitions.length
            ? `<div class="era-coalition-chips">${cs.nationalCoalitions.map((c) => `<span class="era-coalition-chip" style="border-color:${esc(c.color || '#64748b')}"><b>${esc(c.name)}</b> <small>${c.houseSeats} House · ${c.senateSeats} Senate</small></span>`).join('')}</div>`
            : ''}
        </section>`
      : '';

    const rc = ps?.robotCitizenship;
    const robotSection = rc?.active
      ? `<section class="era-dossier-block era-robot-dossier">
          <div class="era-ledger-eyebrow">Synthetic Citizen Suffrage Era</div>
          <h4>Dual-Substrate Electorate (${((rc.totalRepresentedVoters || 310_000_000) / 1_000_000).toFixed(2)}M Represented Voters)</h4>
          <p>Over 155 million newly enfranchised synthetic citizens vote alongside the human electorate with steadfast algorithmic participation, electing proportional delegations across four synthetic political parties.</p>
        </section>`
      : '';

    return `
      <div class="era-dossier-backdrop" role="dialog" aria-modal="true" aria-labelledby="era-dossier-heading" style="--era-accent:${esc(accent)}">
        <div class="era-dossier-modal">
          <header class="era-dossier-head">
            <div class="era-dossier-title-wrap">
              <span class="era-crest-roman small">${esc(roman)}</span>
              <div>
                <div class="era-realignment-eyebrow">Political Era Dossier · Established ${esc(startYear)}</div>
                <h2 id="era-dossier-heading">The ${esc(ordinal)} Party System: ${esc(meta.title)}</h2>
              </div>
            </div>
            <button type="button" class="text-button" data-close-era-dossier aria-label="Close Era Dossier">Close</button>
          </header>

          <div class="era-chronicle-body compact">
            ${chronicleParas.map((para) => `<p>${esc(para)}</p>`).join('')}
          </div>

          <div class="era-dossier-grid">
            <article class="era-dossier-block">
              <div class="era-ledger-eyebrow">Dominant Ideological Fault Lines</div>
              <p>${esc(dossier.faultLines || 'Shifting national coalitions contending for governing legitimacy.')}</p>
            </article>
            <article class="era-dossier-block">
              <div class="era-ledger-eyebrow">Active Legislative Dynamics</div>
              <p>${esc(dossier.legislativeMood || 'Floor negotiations reflect the balance of institutional power.')}</p>
            </article>
            <article class="era-dossier-block">
              <div class="era-ledger-eyebrow">National Cultural Mood</div>
              <p>${esc(dossier.culturalVibe || 'Voters watch party leadership closely for credible direction.')}</p>
            </article>
          </div>

          ${activeEraIssues.length
            ? `<section class="era-dossier-block">
                <div class="era-ledger-eyebrow">Defining Era Issues on the National Platform (${activeEraIssues.length})</div>
                <div class="era-issue-chips">
                  ${activeEraIssues.map((iss) => `<span class="era-issue-chip"><b>${esc(iss.label)}</b> <small>${esc(iss.category)}</small></span>`).join('')}
                </div>
              </section>`
            : ''}

          ${indSection}
          ${coalitionSection}
          ${robotSection}

          <div class="era-realignment-actions">
            <button type="button" class="era-gold-btn" data-close-era-dossier>Return to Headquarters</button>
          </div>
        </div>
      </div>`;
  }

  // 4. Historical Era Timeline (Rendered in History Tab)
  function renderHistoricalEraTimeline(game) {
    if (!game) return '';
    const { ps, roman, ordinal, startYear, meta } = resolveCurrentEraInfo(game);
    const history = Array.isArray(ps?.priorErasHistory) ? ps.priorErasHistory : [];
    const canonEras = getPSD()?.HISTORICAL_CANON_ERAS || (typeof window !== 'undefined' && window.PartySystemsData?.HISTORICAL_CANON_ERAS) || [];
    const canonEntries = canonEras.slice().reverse().map((c) => ({
      isCurrent: false,
      roman: c.roman,
      ordinal: c.ordinal,
      name: c.name,
      startYear: c.startYear,
      endYear: c.endYear,
      catalyst: c.catalyst,
      emergentIssues: c.emergentIssues || [],
    }));

    const entries = [
      {
        isCurrent: true,
        roman,
        ordinal,
        name: meta.title,
        startYear,
        endYear: 'Present',
        catalyst: meta.catalyst || 'Active Political Alignment',
        emergentIssues: (ps?.eraExclusiveIssuesActive || []).slice(0, 6).map((id) => {
          const def = getPSE()?.getIssueDefinition(game, id);
          return def ? { label: def.label } : { label: id };
        }),
      },
      ...history.slice().reverse().map((h) => ({
        isCurrent: false,
        roman: h.roman || (getPSD()?.toRoman ? getPSD().toRoman(h.eraNumber) : String(h.eraNumber)),
        ordinal: getPSE()?.ordinalSuffix ? getPSE().ordinalSuffix(h.eraNumber) : `${h.eraNumber}th`,
        name: h.name,
        startYear: h.startYear,
        endYear: h.endYear,
        catalyst: h.catalyst,
        emergentIssues: Array.isArray(h.emergentIssues) ? h.emergentIssues : [],
      })),
      ...canonEntries,
    ];

    return `
      <section class="era-timeline-panel" aria-label="Historical Party Systems Timeline">
        <div class="era-timeline-head" style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <span class="eyebrow">Constitutional Chronicle</span>
            <h3>Historical Party Systems Timeline</h3>
          </div>
          <button type="button" class="era-info-btn" data-action="open-era-dating-modal" aria-label="click for more information on the party systems years" title="click for more information on the party systems years">ⓘ</button>
        </div>
        <ol class="era-timeline-list">
          ${entries.map((e) => `
            <li class="era-timeline-item ${e.isCurrent ? 'current' : 'completed'}">
              <div class="era-timeline-marker">${esc(e.roman)}</div>
              <div class="era-timeline-card">
                <div class="era-timeline-meta">
                  <span class="era-timeline-years">${esc(e.startYear)} – ${esc(e.endYear)}</span>
                  <span class="era-timeline-tag">${e.isCurrent ? 'Active Era' : 'Completed Era'}</span>
                </div>
                <h4>The ${esc(e.ordinal)} Party System: ${esc(e.name)}</h4>
                <p class="era-timeline-catalyst">${esc(e.catalyst)}</p>
                ${e.emergentIssues.length
                  ? `<div class="era-timeline-issues">Key Platform Legacies: ${e.emergentIssues.map((iss) => `<span>${esc(iss.label)}</span>`).join('')}</div>`
                  : ''}
              </div>
            </li>
          `).join('')}
        </ol>
      </section>`;
  }

  // System: Party Systems Era Dating Philosophy Popup Modal
  function renderEraDatingPhilosophyModal(game) {
    return `
      <div class="era-realignment-backdrop" role="dialog" aria-modal="true" aria-labelledby="era-dating-heading" style="--era-accent:#c48f45">
        <div class="era-realignment-modal era-wide-modal" style="max-width:680px">
          <div class="era-modal-header">
            <span class="eyebrow">Historical Framework & Design Philosophy</span>
            <h2 id="era-dating-heading">Party Systems Chronology & Dating Rationale</h2>
            <p class="era-modal-lead" style="font-style:italic">
              Why our era boundary dates intentionally diverge from traditional academic consensus.
            </p>
          </div>
          <div class="era-modal-body" style="font-size:13.5px;line-height:1.6;color:#cbd5e1">
            <h4 style="color:var(--gold);margin:12px 0 4px">The Two Signature Moments Theory</h4>
            <p>
              Political party systems rarely begin on an arbitrary round calendar decade. Instead, each party system typically experiences two distinct signature moments:
            </p>
            <ul style="margin:8px 0 12px 20px;list-style:disc">
              <li><b>Moment 1 (Emergence):</b> Arrives 10 to 15 years before traditional academic start dates, when an insurgent political movement first fractures the existing consensus and plants the ideological seeds of a new alignment.</li>
              <li><b>Moment 2 (Maturity & Coalescence):</b> When that emerging movement matures, broadens its tent, and achieves durable governing dominance over national institutions.</li>
            </ul>

            <h4 style="color:var(--gold);margin:16px 0 4px">The 7th Party System (2006 – Present): The Modern Populist Era</h4>
            <p style="background:rgba(255,255,255,0.04);padding:10px 14px;border-left:3px solid var(--gold);border-radius:4px">
              "For the purposes of this game, the 7th party system began in '06, when the Democrats won in a wave year, followed by Obama's presidency. Trump's populism is also important in this era - it's defined by populism, that really started with the Democrats' 50-state strategy in '06."
            </p>

            <h4 style="color:var(--gold);margin:16px 0 4px">The 5th & 6th Party Systems: The 1966 Inflection Point</h4>
            <p style="background:rgba(255,255,255,0.04);padding:10px 14px;border-left:3px solid var(--gold);border-radius:4px">
              "As for the 6th and 5th, the 5th era ended in '66, because several key characteristics of that party system didn't exist in the last 14 years."
            </p>

            <h4 style="color:var(--gold);margin:16px 0 4px">Complete 7-Era Chronology</h4>
            <div style="font-size:12.5px;display:grid;grid-template-columns:1fr;gap:6px;margin-top:8px">
              <div><b>1st Party System (1792–1828):</b> The Federalist Era</div>
              <div><b>2nd Party System (1828–1860):</b> The Antebellum Era</div>
              <div><b>3rd Party System (1860–1896):</b> The Industrial Era</div>
              <div><b>4th Party System (1896–1932):</b> The Progressive Era</div>
              <div><b>5th Party System (1932–1966):</b> The Liberal Era</div>
              <div><b>6th Party System (1966–2006):</b> The Conservative Era</div>
              <div><b>7th Party System (2006–Present):</b> The Modern Populist Era</div>
            </div>
          </div>
          <div class="era-modal-actions" style="margin-top:20px;text-align:right">
            <button type="button" class="button button-gold" data-action="close-era-dating-modal">Understood</button>
          </div>
        </div>
      </div>
    `;
  }

  // 5. Era #18 Informed Player Party Selection Modal (Post-Breakup 2-Faction Parties)
  function renderPartySelectModal(game) {
    const ps = game?.partySystems;
    if (!ps || ps.pendingModal !== 'party_select') return '';
    const cs = ps.coalitionSystem;
    const parties = ps.modalPayload?.parties || cs?.postBreakupParties || [];
    const totalElectorateM = ((game?.voterModel?.representedVoters || 155_000_000) / 1_000_000).toFixed(2);

    return `
      <div class="era-realignment-backdrop" role="dialog" aria-modal="true" aria-labelledby="era-party-select-heading" style="--era-accent:#7c3aed">
        <div class="era-realignment-modal era-wide-modal">
          <div class="era-realignment-crest">
            <span class="era-crest-roman">MMP</span>
            <div>
              <div class="era-realignment-eyebrow">The Party Coalition Era · Overnight Two-Faction Breakup</div>
              <h2 id="era-party-select-heading">Select Your National Party Command</h2>
            </div>
          </div>

          <p class="era-decision-intro">
            Under Nationwide Mixed-Member Proportional reform, every party has reorganized down to at most two core factions.
            Review the exact post-breakup registered voter base (out of ${esc(totalElectorateM)}M represented voters) and projected federal seat footprint before choosing which party you will chair.
          </p>

          <div class="era-party-select-grid">
            ${parties.map((p) => `
              <article class="era-party-select-card ${p.isCurrentPlayer ? 'current-party' : ''}" style="--party-accent:${esc(p.color || '#7c3aed')}">
                <div class="era-party-card-top">
                  <span class="era-party-swatch" style="background:${esc(p.color || '#7c3aed')}"></span>
                  <div>
                    <h4>${esc(p.name)}</h4>
                    <small>${esc(p.ideologyLabel || 'National Party')} · ${p.isNew ? 'Newly Formed Party' : 'Reorganized Legacy Party'}</small>
                  </div>
                </div>
                <div class="era-party-factions-list">
                  ${(p.factions || []).map((f) => `
                    <div class="era-party-fac-row">
                      <span>${esc(f.name)}</span>
                      <b>${((Number(f.voters) || 0) / 1_000_000).toFixed(2)}M</b>
                    </div>
                  `).join('')}
                </div>
                <div class="era-party-metrics">
                  <div><small>Registered Voters</small><b>${Number(p.voterMillions || 0).toFixed(2)}M</b></div>
                  <div><small>Projected House</small><b>${p.projectedHouseSeats || 0} / 435</b></div>
                  <div><small>Projected Senate</small><b>${p.projectedSenateSeats || 0} / 100</b></div>
                </div>
                <button type="button" class="era-gold-btn small" data-select-coalition-party="${esc(p.id)}">
                  ${p.isCurrentPlayer ? `Continue Chairing ${esc(p.name)}` : `Chair ${esc(p.name)}`}
                </button>
              </article>
            `).join('')}
          </div>
        </div>
      </div>`;
  }

  // 6. Era #18 Post-Election National Coalition Bargaining Modal
  function renderCoalitionBargainingModal(game) {
    const ps = game?.partySystems;
    if (!ps || ps.pendingModal !== 'coalition') return '';
    const b = ps.modalPayload || ps.coalitionSystem?.pendingBargaining || {};
    const ranked = Array.isArray(b.rankedParties) ? b.rankedParties : [];
    const suggested = new Set(b.suggestedPartnerIds || []);
    const invitations = Array.isArray(b.invitations) ? b.invitations : [];

    return `
      <div class="era-realignment-backdrop" role="dialog" aria-modal="true" aria-labelledby="era-coalition-bargain-heading" style="--era-accent:#7c3aed">
        <div class="era-realignment-modal era-wide-modal">
          <div class="era-realignment-crest">
            <span class="era-crest-roman">MMP</span>
            <div>
              <div class="era-realignment-eyebrow">Certified Federal Results · ${esc(b.year || game.year || 2040)}</div>
              <h2 id="era-coalition-bargain-heading">National Coalition Bargaining Chamber</h2>
            </div>
          </div>

          <p class="era-decision-intro">
            Every party competed independently under Nationwide Mixed-Member Proportional representation.
            Now parties must consolidate into <b>3 to 4 unified nationwide coalitions</b> to govern Congress (218 House / 51 Senate majority).
            Your party holds <b>${b.playerHouseSeats || 0} House seats</b> and <b>${b.playerSenateSeats || 0} Senate seats</b>.
          </p>

          <section class="era-dossier-block">
            <div class="era-ledger-eyebrow">Certified MMP Federal Seat Standing</div>
            <div class="era-mmp-standing-grid">
              ${ranked.map((p) => `
                <div class="era-mmp-seat-pill ${p.isPlayer ? 'is-player' : ''}" style="border-left:4px solid ${esc(p.color || '#64748b')}">
                  <strong>${esc(p.name)}</strong>
                  <span>${p.houseSeats} House · ${p.senateSeats} Senate (${Number(p.voteShare || 0).toFixed(1)}%)</span>
                </div>
              `).join('')}
            </div>
          </section>

          <div class="era-bargain-columns">
            <section class="era-dossier-block">
              <div class="era-ledger-eyebrow">Path 1 · Anchor a Governing Coalition</div>
              <p class="era-decision-intro">Invite aligned partner parties to reach a 218-seat House majority and draft binding Coalition Policy Accords.</p>
              <div class="era-partner-checklist">
                ${ranked.filter((p) => !p.isPlayer).map((p) => `
                  <label class="era-partner-check-row">
                    <input type="checkbox" class="era-coalition-partner-cb" value="${esc(p.id)}" ${suggested.has(p.id) ? 'checked' : ''} />
                    <span class="era-party-swatch tiny" style="background:${esc(p.color || '#64748b')}"></span>
                    <span class="era-partner-name">${esc(p.name)} <em>(${esc(p.compatibility)})</em></span>
                    <b>+${p.houseSeats} H / +${p.senateSeats} S</b>
                  </label>
                `).join('')}
              </div>
              <button type="button" class="era-gold-btn small" data-coalition-bargain="anchor" style="margin-top:12px">
                Anchor Coalition &amp; Sign Policy Accords
              </button>
            </section>

            <section class="era-dossier-block">
              <div class="era-ledger-eyebrow">Path 2 · Join an Invited Coalition</div>
              <p class="era-decision-intro">Accept a governing invitation from a leading anchor party, trading platform concessions for senior cabinet portfolios and committee gavels.</p>
              <div class="era-invite-list">
                ${invitations.map((inv) => `
                  <div class="era-invite-card" style="border-left:4px solid ${esc(inv.anchorColor || '#059669')}">
                    <strong>${esc(inv.anchorPartyName)} Governing Invitation</strong>
                    <small>Combined Bloc: ${inv.combinedHouseSeats} House · ${inv.combinedSenateSeats} Senate</small>
                    <p>${esc(inv.portfolioOffer)}</p>
                    <p class="era-invite-concession">${esc(inv.concessionSummary)}</p>
                    <button type="button" class="era-gold-btn small" data-coalition-bargain="join" data-coalition-invitation="${esc(inv.invitationId)}">
                      Join ${esc(inv.anchorPartyName)} Coalition
                    </button>
                  </div>
                `).join('') || '<p class="era-decision-intro">No external coalition anchor invitations available this cycle.</p>'}
              </div>

              <div class="era-opposition-box">
                <div class="era-ledger-eyebrow">Path 3 · Sit in Official Opposition</div>
                <p>Refuse coalition compromises to preserve absolute platform purity and energize your grassroots base (+15% base turnout next cycle).</p>
                <button type="button" class="button" data-coalition-bargain="opposition">
                  Decline Pacts &amp; Lead Official Opposition
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>`;
  }

  // 7. Era #18 Mid-Cycle Coalition Fracture Crisis Modal (Stability < 25)
  function renderCoalitionFractureModal(game) {
    const ps = game?.partySystems;
    if (!ps || ps.pendingModal !== 'coalition_fracture') return '';
    const crisis = ps.modalPayload || ps.coalitionSystem?.fractureCrisis;
    if (!crisis) return '';

    return `
      <div class="era-realignment-backdrop" role="dialog" aria-modal="true" aria-labelledby="era-fracture-heading" style="--era-accent:#dc2626">
        <div class="era-realignment-modal">
          <div class="era-realignment-crest">
            <span class="era-crest-roman">!</span>
            <div>
              <div class="era-realignment-eyebrow">Mid-Cycle Coalition Fracture Crisis · Stability Critical</div>
              <h2 id="era-fracture-heading">${esc(crisis.headline)}</h2>
            </div>
          </div>

          <div class="era-chronicle-body compact">
            <p>${esc(crisis.description)}</p>
          </div>

          <div class="era-decision-grid">
            <button type="button" class="era-decision-card" data-resolve-coalition-fracture="concede">
              <strong>Concede Partner Policy Red Line</strong>
              <span>Restore governing stability and prevent a cabinet walkout, at the cost of internal base frustration.</span>
            </button>
            <button type="button" class="era-decision-card" data-resolve-coalition-fracture="rebuild">
              <strong>Emergency Cabinet Reshuffle ($8M)</strong>
              <span>Broker new ministry allocations to hold the governing majority together without surrendering your platform.</span>
            </button>
            <button type="button" class="era-decision-card" data-resolve-coalition-fracture="dissolve">
              <strong>Dissolve Pact &amp; Enter Opposition</strong>
              <span>Let the governing coalition collapse and rally your base as Official Opposition (+15% base turnout).</span>
            </button>
          </div>
        </div>
      </div>`;
  }

  // 8. Era #18 Compact Coalition Stability Meter HUD
  function renderCoalitionStabilityHud(game) {
    const cs = game?.partySystems?.coalitionSystem;
    if (!cs || !cs.mmpActive || !cs.playerRole) return '';
    const isOpp = cs.playerRole === 'opposition';
    const stab = Math.round(Number(cs.stability ?? 75));
    const statusLabel = isOpp
      ? 'Official Opposition (+15% Base Turnout)'
      : stab >= 65
        ? 'Solid Coalition Pact'
        : stab >= 35
          ? 'Strained Accord'
          : 'Fracture Risk';
    const tierClass = isOpp ? 'opp' : stab >= 65 ? 'solid' : stab >= 35 ? 'strained' : 'critical';

    return `
      <div class="era-coalition-hud ${tierClass}" title="${esc(cs.activeCoalitionName || 'National Coalition')}: ${esc(statusLabel)}">
        <div class="era-coalition-hud-main">
          <span class="era-coalition-hud-label">${isOpp ? 'Opposition Front' : 'Coalition Stability'}</span>
          <b>${isOpp ? 'Pure Platform' : `${stab}/100`}</b>
          <small>${esc(statusLabel)}</small>
        </div>
        ${!isOpp
          ? `<div class="era-coalition-bar"><i style="width:${stab}%"></i></div>
             <button type="button" class="era-coalition-summit-btn" data-stabilize-coalition ${(game.treasury || 0) < 4 ? 'disabled' : ''}>Summit ($4M)</button>`
          : ''}
      </div>`;
  }

  // 9. Era #16 Robot Party Selection Modal (310M+ Dual-Substrate Electorate)
  function renderRobotPartySelectionModal(game) {
    const ps = game?.partySystems;
    if (!ps || ps.pendingModal !== 'robot_select') return '';
    const rc = ps.robotCitizenship || {};
    const robotParties = ps.modalPayload?.robotParties || rc.robotParties || [];
    const totalM = ((rc.totalRepresentedVoters || game?.voterModel?.representedVoters || 310_000_000) / 1_000_000).toFixed(2);
    const humanName = ps.modalPayload?.humanPartyName || game?.player?.name || 'Your Human Party';

    return `
      <div class="era-realignment-backdrop" role="dialog" aria-modal="true" aria-labelledby="era-robot-select-heading" style="--era-accent:#06B6D4">
        <div class="era-realignment-modal era-wide-modal era-robot-modal">
          <div class="era-realignment-crest">
            <span class="era-crest-roman">310M</span>
            <div>
              <div class="era-realignment-eyebrow">The Synthetic Suffrage Amendment · Dual-Substrate Republic</div>
              <h2 id="era-robot-select-heading">Robots Become Citizens: Choose Your Political Command</h2>
            </div>
          </div>

          <p class="era-decision-intro">
            With 155 million newly enfranchised synthetic citizens joining the 155 million human electorate (<b>${esc(totalM)}M total represented voters</b>),
            synthetic voters participate at steadfast full turnout and elect proportional delegations across four dedicated Robot Political Parties.
            Remain Chair of your human committee or step forward to lead one of the four synthetic parties.
          </p>

          <div class="era-robot-party-grid">
            ${robotParties.map((rp) => `
              <article class="era-robot-party-card" style="--robot-accent:${esc(rp.color || '#06B6D4')}">
                <div class="era-party-card-top">
                  <span class="era-party-swatch" style="background:${esc(rp.color || '#06B6D4')}"></span>
                  <div>
                    <h4>${esc(rp.name)}</h4>
                    <small>${esc(rp.ideologyTag || 'Synthetic Political Party')}</small>
                  </div>
                </div>
                <p class="era-robot-summary">${esc(rp.summary)}</p>
                <div class="era-party-factions-list">
                  ${(rp.factions || []).map((f) => `
                    <div class="era-party-fac-row">
                      <span>${esc(f.name)}</span>
                      <b>Core Faction</b>
                    </div>
                  `).join('')}
                </div>
                <div class="era-party-metrics">
                  <div><small>Synthetic Voters</small><b>${Number(rp.voterMillions || 38.75).toFixed(2)}M</b></div>
                  <div><small>Participation</small><b>100% Steadfast</b></div>
                </div>
                <button type="button" class="era-gold-btn small" data-select-robot-party="${esc(rp.id)}" style="border-color:${esc(rp.color || '#06B6D4')}">
                  Chair ${esc(rp.name)}
                </button>
              </article>
            `).join('')}
          </div>

          <div class="era-realignment-actions">
            <button type="button" class="button" data-select-robot-party="stay_human_party">
              Remain Chair of ${esc(humanName)} (Human Party)
            </button>
          </div>
        </div>
      </div>`;
  }

  // Unified Pending Modal Dispatcher (handles mid-modal save/reload across all System modal types)
  function renderActivePartySystemsModal(game) {
    const pm = game?.partySystems?.pendingModal;
    if (!pm) return '';
    if (pm === 'realignment') return renderRealignmentModal(game);
    if (pm === 'party_select') return renderPartySelectModal(game);
    if (pm === 'coalition') return renderCoalitionBargainingModal(game);
    if (pm === 'coalition_fracture') return renderCoalitionFractureModal(game);
    if (pm === 'robot_select') return renderRobotPartySelectionModal(game);
    if (pm === 'era_dating_info') return renderEraDatingPhilosophyModal(game);
    return '';
  }

  const api = {
    renderTopBarEraBadge,
    renderRealignmentModal,
    renderEraDossierModal,
    renderHistoricalEraTimeline,
    renderEraDatingPhilosophyModal,
    renderPartySelectModal,
    renderCoalitionBargainingModal,
    renderCoalitionFractureModal,
    renderCoalitionStabilityHud,
    renderRobotPartySelectionModal,
    renderActivePartySystemsModal,
    resolveCurrentEraInfo,
  };

  if (typeof window !== 'undefined') {
    window.PartySystemsUI = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
