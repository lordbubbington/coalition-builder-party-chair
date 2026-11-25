/**
 * Coalition Builder: Party Chair — v0.18.8 Module
 * FactionCaucusUI: Pure HTML-builder UI renderer for Intra-Party Caucuses,
 * Dynamic Faction Meta Badges, Kickers (Temperament, Vanguard Pull, Viral Runway),
 * 3-Party Chaos Banner, and Cycle-End Lifecycle Digest Cards.
 *
 * Self-contained UMD/IIFE module exposing window.FactionCaucusUI and module.exports.
 */
(function (root) {
  'use strict';

  const STYLE_ELEMENT_ID = 'v0188-caucus-lifecycle-styles';

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, (ch) => {
      switch (ch) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return ch;
      }
    });
  }

  function clamp(num, min, max) {
    const n = Number(num);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  const TEMPERAMENT_META = {
    true_believer: {
      label: 'True Believer',
      cls: 'v188-badge-believer',
      tooltip: 'True Believer: High ideological loyalty — will not bolt if the party holds its primary issue, even during losing streaks; severe happiness & friction penalty if betrayed on its primary issue.',
    },
    fair_weather: {
      label: 'Fair-Weather',
      cls: 'v188-badge-fairweather',
      tooltip: 'Fair-Weather: Results-driven winner — loyal while the party holds power or wins cycles; sharp happiness/cohesion drop and high bolt risk after 2 consecutive losing cycles.',
    },
    transactional: {
      label: 'Transactional',
      cls: 'v188-badge-transactional',
      tooltip: 'Transactional: Cheap to appease with budget, patronage, or endorsements (+40% appeasement efficiency), but low baseline ideological loyalty and faster Caucus fray if neglected.',
    },
  };

  const BIRTH_MODE_META = {
    emerge: { label: 'Emerged', cls: 'v188-badge-birth-emerge', tip: 'Emerged organically from era salience or an open ideological gap.' },
    sever: { label: 'Severed', cls: 'v188-badge-birth-sever', tip: 'Severed from a low-cohesion parent faction with fresh issue priorities.' },
    split: { label: 'Split', cls: 'v188-badge-birth-split', tip: 'Born from a symmetrical 2-way split of a large low-cohesion faction.' },
    merger: { label: 'Merged', cls: 'v188-badge-birth-merger', tip: 'Formed via a coalition merger of ideologically aligned factions.' },
    identity_event: { label: 'Identity Event', cls: 'v188-badge-birth-identity', tip: 'Formed or restructured through a historic Identity & Religious Bloc event.' },
  };

  const DIGEST_EVENT_META = {
    emerge: { tag: 'Emerge', cls: 'v188-digest-emerge', icon: '✦' },
    sever: { tag: 'Sever', cls: 'v188-digest-sever', icon: '⚡' },
    split: { tag: 'Split', cls: 'v188-digest-split', icon: '⑂' },
    merger: { tag: 'Merger', cls: 'v188-digest-merger', icon: '⊕' },
    merge: { tag: 'Merger', cls: 'v188-digest-merger', icon: '⊕' },
    dissolution: { tag: 'Dissolution', cls: 'v188-digest-dissolve', icon: '✕' },
    dissolve: { tag: 'Dissolution', cls: 'v188-digest-dissolve', icon: '✕' },
    caucus_formation: { tag: 'Caucus Formed', cls: 'v188-digest-caucus', icon: '🏛️' },
    caucus_fray: { tag: 'Caucus Fray', cls: 'v188-digest-fray', icon: '⚠' },
    caucus_historic: { tag: 'Historic Hardening', cls: 'v188-digest-historic', icon: '★' },
    caucus_dissolved: { tag: 'Caucus Dissolved', cls: 'v188-digest-dissolve', icon: '✕' },
    identity_split: { tag: 'Identity Event A · Bloc Split', cls: 'v188-digest-identity', icon: '◈' },
    identity_event_a: { tag: 'Identity Event A · Bloc Split', cls: 'v188-digest-identity', icon: '◈' },
    identity_unification: { tag: 'Identity Event B · Latino Unification', cls: 'v188-digest-identity', icon: '◈' },
    identity_event_b: { tag: 'Identity Event B · Latino Unification', cls: 'v188-digest-identity', icon: '◈' },
    identity_emergent: { tag: 'Identity Event C · Emergent Bloc', cls: 'v188-digest-identity', icon: '◈' },
    identity_event_c: { tag: 'Identity Event C · Emergent Bloc', cls: 'v188-digest-identity', icon: '◈' },
  };

  function getScopedStyles() {
    return `<style id="${STYLE_ELEMENT_ID}">
.v188-caucus-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid var(--line, hsl(220 14% 26% / .85));
  border-radius: var(--radius, 14px);
  background: linear-gradient(155deg, #1a2634 0%, #121a24 100%);
  color: var(--text, hsl(42 25% 92%));
}
.v188-caucus-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.v188-caucus-panel-head h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text, hsl(42 25% 92%));
}
.v188-caucus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 12px;
}
.v188-caucus-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--line, hsl(220 14% 26% / .85));
  border-radius: 10px;
  background: linear-gradient(160deg, #182330 0%, #101822 100%);
}
.v188-caucus-card.is-historic {
  border-color: rgba(226, 189, 112, 0.55);
  box-shadow: inset 0 0 0 1px rgba(226, 189, 112, 0.14);
}
.v188-caucus-card.is-solo {
  border-style: dashed;
  opacity: 0.92;
}
.v188-caucus-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.v188-caucus-name {
  margin: 0;
  font-size: 16.5px;
  font-weight: 700;
  color: var(--text, hsl(42 25% 92%));
}
.v188-caucus-rep {
  font-size: 12px;
  color: var(--muted, hsl(220 12% 68%));
}
.v188-caucus-rep b {
  color: var(--text, hsl(42 25% 92%));
}
.v188-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  font-family: Consolas, monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}
.v188-status-historic {
  background: rgba(226, 189, 112, 0.22);
  border: 1px solid #e2bd70;
  color: #f3d28a;
}
.v188-status-active {
  background: rgba(117, 200, 154, 0.16);
  border: 1px solid rgba(117, 200, 154, 0.55);
  color: #8bd8ad;
}
.v188-status-solo {
  background: rgba(160, 175, 189, 0.12);
  border: 1px solid rgba(160, 175, 189, 0.35);
  color: var(--muted, #a0afbd);
}
.v188-strength-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.v188-strength-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted, #a0afbd);
}
.v188-strength-label strong {
  font-family: Consolas, monospace;
  color: var(--text, hsl(42 25% 92%));
}
.v188-caucus-protections {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.v188-prot-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  font-family: Consolas, monospace;
}
.v188-prot-poach {
  background: rgba(226, 189, 112, 0.14);
  border: 1px solid rgba(226, 189, 112, 0.45);
  color: #f0d188;
}
.v188-prot-primary {
  background: rgba(131, 168, 213, 0.15);
  border: 1px solid rgba(131, 168, 213, 0.45);
  color: #9ec2eb;
}
.v188-member-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.v188-member-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--line, hsl(220 14% 26% / .85));
  background: #0e1620;
  color: var(--text, hsl(42 25% 92%));
  font-size: 11.5px;
}
.v188-meta-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  margin-top: 6px;
}
.v188-meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 6px;
  font-family: Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text, hsl(42 25% 92%));
}
.v188-badge-believer {
  background: rgba(139, 92, 246, 0.18);
  border-color: rgba(167, 139, 250, 0.55);
  color: #ddd6fe;
}
.v188-badge-fairweather {
  background: rgba(245, 158, 11, 0.16);
  border-color: rgba(251, 191, 36, 0.5);
  color: #fde68a;
}
.v188-badge-transactional {
  background: rgba(14, 165, 233, 0.16);
  border-color: rgba(56, 189, 248, 0.5);
  color: #bae6fd;
}
.v188-badge-vanguard {
  background: rgba(236, 72, 153, 0.18);
  border-color: rgba(244, 114, 182, 0.55);
  color: #fbcfe8;
}
.v188-badge-viral {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(52, 211, 153, 0.55);
  color: #a7f3d0;
}
.v188-badge-identity {
  background: rgba(226, 189, 112, 0.16);
  border-color: rgba(226, 189, 112, 0.5);
  color: #f3d28a;
}
.v188-badge-extremist {
  background: rgba(232, 136, 126, 0.18);
  border-color: rgba(232, 136, 126, 0.6);
  color: #fca5a5;
}
.v188-badge-birth-emerge,
.v188-badge-birth-sever,
.v188-badge-birth-split,
.v188-badge-birth-merger,
.v188-badge-birth-identity {
  background: rgba(148, 163, 184, 0.14);
  border-color: rgba(148, 163, 184, 0.4);
  color: #cbd5e1;
}
.v188-chaos-banner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  margin-bottom: 14px;
  border: 1px solid rgba(232, 136, 126, 0.7);
  border-left: 5px solid #e8887e;
  border-radius: 10px;
  background: linear-gradient(125deg, rgba(127, 29, 29, 0.34), rgba(23, 33, 45, 0.94));
  color: var(--text, hsl(42 25% 92%));
}
.v188-chaos-banner-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 15.5px;
  color: #fca5a5;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.v188-chaos-banner p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.45;
  color: #e2e8f0;
}
.v188-digest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
}
.v188-digest-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px;
  border: 1px solid var(--line, hsl(220 14% 26% / .85));
  border-radius: 9px;
  background: #101923;
}
.v188-digest-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.v188-digest-tag {
  font-family: Consolas, monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--gold, #e2bd70);
}
.v188-digest-title {
  margin: 0;
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text, hsl(42 25% 92%));
}
.v188-digest-desc {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--muted, #a0afbd);
}
</style>`;
  }

  function ensureStylesInjected() {
    if (typeof document === 'undefined' || !document.head) return false;
    if (document.getElementById(STYLE_ELEMENT_ID)) return true;
    const raw = getScopedStyles();
    const inner = raw.replace(/^<style[^>]*>/i, '').replace(/<\/style>$/i, '');
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ELEMENT_ID;
    styleEl.textContent = inner;
    document.head.appendChild(styleEl);
    return true;
  }

  function resolvePartyLabel(game, partyId) {
    if (!partyId) return 'Party';
    if (partyId === 'people') return 'Democratic Party';
    if (partyId === 'heritage') return 'Republican Party';
    if (partyId === 'player' && game?.player?.name) return game.player.name;
    const found = (game?.rivals || []).find((r) => r && r.id === partyId);
    if (found?.name) return found.name;
    return partyId;
  }

  function renderCaucusOverviewPanel(game, partyId) {
    if (!game) {
      return '<section class="v188-caucus-panel panel"><p class="v188-caucus-rep">No active game state available.</p></section>';
    }
    const targetPartyId = partyId || (game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people'));
    const allCaucuses = Array.isArray(game.caucuses) ? game.caucuses : [];
    const partyCaucuses = targetPartyId === 'all'
      ? allCaucuses
      : allCaucuses.filter((c) => c && c.partyId === targetPartyId);

    const factionById = new Map();
    (Array.isArray(game.factions) ? game.factions : []).forEach((f) => {
      if (f && f.id) factionById.set(f.id, f);
    });

    const partyLabel = targetPartyId === 'all' ? 'All Parties' : resolvePartyLabel(game, targetPartyId);

    if (partyCaucuses.length === 0) {
      return `<section class="v188-caucus-panel panel" data-party-id="${escapeHtml(targetPartyId)}">
        <div class="v188-caucus-panel-head">
          <h3>Intra-Party Caucuses · ${escapeHtml(partyLabel)}</h3>
          <span class="v188-status-badge v188-status-solo">0 Caucuses</span>
        </div>
        <p class="v188-caucus-rep">No multi-faction or solo caucuses are currently organized for ${escapeHtml(partyLabel)}.</p>
      </section>`;
    }

    const cardsHtml = partyCaucuses.map((caucus) => {
      const status = String(caucus.status || 'active').toLowerCase();
      const isHistoric = status === 'historic';
      const isSolo = status === 'solo';
      const statusBadgeCls = isHistoric
        ? 'v188-status-historic'
        : isSolo
          ? 'v188-status-solo'
          : 'v188-status-active';
      const statusLabel = isHistoric ? 'Historic' : isSolo ? 'Solo' : 'Active';

      const hasNumericStrength = caucus.strength !== null && caucus.strength !== undefined && Number.isFinite(Number(caucus.strength));
      const strength = hasNumericStrength ? clamp(Math.round(Number(caucus.strength)), 0, 100) : 0;
      const antiPoach = !isSolo && hasNumericStrength && strength >= 45;
      const primaryNonAggression = !isSolo && hasNumericStrength && strength >= 35;

      const meterColor = isHistoric ? '#e2bd70' : strength >= 45 ? '#75c89a' : strength >= 35 ? '#83a8d5' : '#e8887e';
      const strengthBlock = isSolo && !hasNumericStrength
        ? `<div class="v188-strength-wrap">
            <div class="v188-strength-label"><span>Caucus Strength</span><strong>— (Unallied)</strong></div>
          </div>`
        : `<div class="v188-strength-wrap">
            <div class="v188-strength-label"><span>Caucus Strength</span><strong>${strength} / 100</strong></div>
            <div class="meter"><i style="width:${strength}%;--meter:${meterColor}"></i></div>
          </div>`;

      const protectionsHtml = (antiPoach || primaryNonAggression)
        ? `<div class="v188-caucus-protections">
            ${antiPoach ? `<span class="v188-prot-chip v188-prot-poach" title="Anti-Poaching Lock active while strength >= 45: rival Party Chairs cannot poach individual members out of this Caucus.">🛡️ Anti-Poaching Lock</span>` : ''}
            ${primaryNonAggression ? `<span class="v188-prot-chip v188-prot-primary" title="Primary Non-Aggression active while strength >= 35: members coordinate around a unified candidate in ~88% of non-presidential primaries.">🤝 Primary Non-Aggression</span>` : ''}
          </div>`
        : '';

      const repName = caucus.representativeName ? escapeHtml(caucus.representativeName) : 'Unassigned';
      const memberIds = Array.isArray(caucus.memberFactionIds) ? caucus.memberFactionIds : [];
      const memberPills = memberIds.map((fid) => {
        const fObj = factionById.get(fid);
        const fName = fObj?.name || fid;
        return `<span class="v188-member-pill" data-faction-id="${escapeHtml(fid)}">${escapeHtml(fName)}</span>`;
      }).join('');

      return `<article class="v188-caucus-card panel ${isHistoric ? 'is-historic' : ''} ${isSolo ? 'is-solo' : ''}" data-caucus-id="${escapeHtml(caucus.id || '')}">
        <div class="v188-caucus-card-head">
          <div>
            <h4 class="v188-caucus-name">${escapeHtml(caucus.name || 'Unnamed Caucus')}</h4>
            <div class="v188-caucus-rep">Representative: <b>${repName}</b></div>
          </div>
          <span class="v188-status-badge ${statusBadgeCls}">${statusLabel}</span>
        </div>
        ${strengthBlock}
        ${protectionsHtml}
        <div class="v188-member-pills">${memberPills || '<span class="v188-caucus-rep">No member factions</span>'}</div>
      </article>`;
    }).join('');

    return `<section class="v188-caucus-panel panel" data-party-id="${escapeHtml(targetPartyId)}">
      <div class="v188-caucus-panel-head">
        <h3>Intra-Party Caucuses · ${escapeHtml(partyLabel)}</h3>
        <span class="v188-status-badge v188-status-active">${partyCaucuses.length} ${partyCaucuses.length === 1 ? 'Caucus' : 'Caucuses'}</span>
      </div>
      <div class="v188-caucus-grid">${cardsHtml}</div>
    </section>`;
  }

  function renderFactionMetaBadges(faction, game) {
    if (!faction || typeof faction !== 'object') return '';
    const badges = [];

    if (faction.temperament && TEMPERAMENT_META[faction.temperament]) {
      const tMeta = TEMPERAMENT_META[faction.temperament];
      badges.push(
        `<span class="v188-meta-badge ${tMeta.cls}" title="${escapeHtml(tMeta.tooltip)}">${escapeHtml(tMeta.label)}</span>`
      );
    }

    const vanguardLeft = Number(faction.vanguardCyclesLeft || 0);
    if (vanguardLeft > 0) {
      const cycleUnit = vanguardLeft === 1 ? 'cycle' : 'cycles';
      badges.push(
        `<span class="v188-meta-badge v188-badge-vanguard" title="Vanguard Overton Pull: Nudges neighboring same-party factions toward this faction's primary issue and stance.">Vanguard Pull (${vanguardLeft} ${cycleUnit})</span>`
      );
    }

    const viralLeft = Number(faction.viralRunwayCyclesLeft || 0);
    if (viralLeft > 0) {
      const cycleUnit = viralLeft === 1 ? 'cycle' : 'cycles';
      badges.push(
        `<span class="v188-meta-badge v188-badge-viral" title="Viral Runway: Fast-growing newly emerged faction receiving +35% to +55% momentum per cycle.">Viral Runway (${viralLeft} ${cycleUnit})</span>`
      );
    }

    const fType = String(faction.type || '').toLowerCase();
    const isProtectedIdentity = Boolean(
      faction.isProtectedIdentityBloc
      || fType === 'racial'
      || fType === 'identity'
      || fType === 'religious'
    );
    if (isProtectedIdentity) {
      badges.push(
        `<span class="v188-meta-badge v188-badge-identity" title="Protected Identity Bloc: Exempt from procedural Emerge, Sever, Split, and <100K dissolution rules.">Protected Identity Bloc</span>`
      );
    }

    if (faction.isExtremist) {
      badges.push(
        `<span class="v188-meta-badge v188-badge-extremist" title="Extremist factions never dissolve automatically, even below 100K voters.">Extremist (Permanent)</span>`
      );
    }

    if (faction.birthMode && BIRTH_MODE_META[faction.birthMode]) {
      const bMeta = BIRTH_MODE_META[faction.birthMode];
      badges.push(
        `<span class="v188-meta-badge ${bMeta.cls}" title="${escapeHtml(bMeta.tip)}">${escapeHtml(bMeta.label)}</span>`
      );
    }

    if (badges.length === 0) return '';
    return `<div class="v188-meta-badges" data-faction-id="${escapeHtml(faction.id || '')}">${badges.join('')}</div>`;
  }

  function renderThreePartyChaosBanner(game) {
    if (!game || game.threePartyChaosActive !== true) return '';
    return `<div class="v188-chaos-banner" role="alert" aria-live="polite">
      <div class="v188-chaos-banner-head">
        <span>⚠</span>
        <span>3-Major-Party Chaos Mode Active</span>
      </div>
      <p><strong>3 major parties are active</strong> simultaneously (≥18% national share or ≥15% of Congress). <strong>Party-preservation walls have collapsed</strong> (55%–65% of declining voters spill freely across all 3 parties and Independents), and <strong>realignment volatility is 2x+</strong> (2.0x–2.5x voter swings, -25% Sever/Split thresholds, and 2.0x Caucus fray).</p>
    </div>`;
  }

  function normalizeDigestEvents(eventsInput) {
    if (!eventsInput) return [];
    if (Array.isArray(eventsInput)) return eventsInput.filter(Boolean);
    if (typeof eventsInput === 'object') {
      if (Array.isArray(eventsInput.events)) return eventsInput.events.filter(Boolean);
      const collected = [];
      ['births', 'mergers', 'dissolutions', 'caucusEvents', 'identityEvents'].forEach((key) => {
        if (Array.isArray(eventsInput[key])) {
          eventsInput[key].forEach((ev) => {
            if (ev) collected.push(ev);
          });
        }
      });
      return collected;
    }
    return [];
  }

  function renderLifecycleDigestCards(events) {
    const list = normalizeDigestEvents(events);
    if (list.length === 0) {
      return '<div class="v188-digest-grid"><p class="v188-digest-desc">No major faction lifecycle, caucus, or identity-bloc events occurred this cycle.</p></div>';
    }

    const cardsHtml = list.map((ev) => {
      const rawType = String(ev.type || ev.mode || ev.eventType || 'lifecycle').toLowerCase();
      const meta = DIGEST_EVENT_META[rawType] || {
        tag: ev.category || ev.type || 'Lifecycle Event',
        cls: 'v188-digest-generic',
        icon: '•',
      };
      const title = ev.title || ev.headline || ev.factionName || ev.caucusName || ev.groupName || meta.tag;
      const desc = ev.description || ev.summary || ev.message || ev.detail || '';
      const subMeta = [];
      if (ev.partyId) subMeta.push(`Party: ${ev.partyId}`);
      if (ev.year) subMeta.push(`Cycle ${ev.year}`);

      return `<article class="v188-digest-card ${meta.cls}" data-event-type="${escapeHtml(rawType)}">
        <div class="v188-digest-head">
          <span class="v188-digest-tag">${meta.icon} ${escapeHtml(meta.tag)}</span>
          ${subMeta.length ? `<span class="v188-caucus-rep">${escapeHtml(subMeta.join(' · '))}</span>` : ''}
        </div>
        <h4 class="v188-digest-title">${escapeHtml(title)}</h4>
        ${desc ? `<p class="v188-digest-desc">${escapeHtml(desc)}</p>` : ''}
      </article>`;
    }).join('');

    return `<div class="v188-digest-grid">${cardsHtml}</div>`;
  }

  const api = {
    STYLE_ELEMENT_ID,
    escapeHtml,
    getScopedStyles,
    ensureStylesInjected,
    renderCaucusOverviewPanel,
    renderFactionMetaBadges,
    renderThreePartyChaosBanner,
    renderLifecycleDigestCards,
  };

  if (root && typeof root === 'object') {
    root.FactionCaucusUI = api;
  }
  if (typeof window !== 'undefined') {
    window.FactionCaucusUI = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
