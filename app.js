(async function PartyChairApp() {
const { BILLS, CONVENTIONS, FACTIONS, MEMBERS, PARTY_ARCHETYPES, REGIONS, STATES } = window.PartyChairData;
const { advanceYear, createGame, currentEvent, factionPenalty, isMajorParty: engineIsMajorParty, legislativeDistricts, loadGame, nationalPoll, normalizeGame, partyList, presidentialForecast, presidentialStateMargin, primaryScore, resolveConvention, resolveEvent, saveGame, supportByState, takeAction, exportSave } = window.PartyChairEngine;
const isMajorParty = (g, p) => (engineIsMajorParty ? engineIsMajorParty(g, p) : (window.PartyChairV07 ? window.PartyChairV07.isMajorParty(g, p) : ['people', 'heritage'].includes(playerIdentity())));
const V07 = window.PartyChairV07;
await window.PartyChairData.VERSION_03_MAPS_READY;
if (V07) V07.applySenate2026AuditToMaps();
const MAPS = window.PartyChairData.VERSION_03_MAPS;
const VOTER_MODEL = window.PartyChairData.VERSION_05_VOTER_MODEL;

const app = document.querySelector('#app');
let game = (typeof window.PartyChairEngine.loadGameAsync === 'function')
  ? await window.PartyChairEngine.loadGameAsync()
  : loadGame();
if (game && V07 && (!game.sittingMembers?.length || !game.trust || !game.leadershipRoles)) {
  game = V07.hydrateV07GameState(game);
}

let selectedTemplate = 'people';
let custom = false;
let selectedLeaderArchetype = 'former-politician';
let customIssueCategory = 'All';
let customIssuePositions = null;
let customPartyName = '';
let customPartyColor = '#8b5cf6';
let customLeaderName = '';
let customPoliticianOffice = 'governor';
let customPoliticianState = 'PA';
let customPoliticianSeat = 'PA';
let customPartyCode = 'CGP';
let customPartyMotto = 'Pragmatism over partisanship.';
let customFoundingStateId = 'PA';
let customSelectedEmblem = 'compass';
let customOrigin = 'civic_reform';
let customSchismParent = 'people';
let customCharterTraits = ['big_tent_pragmatism', 'state_first_federation'];
let customSelectedFactionIds = [];
let custom100kName = 'Heartland Civic League';
let custom100kSliders = { economic: 5.0, social: 5.0, governance: 5.0 };
let custom100kIssues = ['campaign-finance', 'healthcare-model'];
let custom100kStateAllocations = { PA: 100000 };
let stateSubview = 'directory';
let regSortCol = 'state';
let regSortDir = 'asc';
let activeMap = 'house';
let senateMapClass = 'universal';
let mapState = 'PA';
let primaryRace = 'senate:GA';
let primaryFilter = 'senate';
let primaryStatewideState = null;
let saveSlotsModalOpen = false;
let cachedSaveSlots = null;
let primaryArchiveOpen = false;
let primaryArchiveParty = 'people';
let primaryArchiveYear = null;
let primaryFilterStatePick = '';
let primaryFilterAssets = { politicalCapital: true, staffSupport: false, donorConduits: false };
let primaryParty = 'people';
let issueCategory = 'Economy & Affordability';
let priorityIssueCategory = 'All';
let allowExtraRegions = false;
let stateRegionFilter = 'All';
let stateSearch = '';
let stateBillEligibleOnly = false;
let roleCategoryFilter = 'all';
let campaignTriageFilter = 'all';
let campaignTriageSearch = '';
let deploymentModalOpen = false;
let questModalOpen = false;
let questModalTargetSlot = 0;
let forecasterRaceFilter = 'all';
let forecasterMapSource = 'consensus';
let historyViewTab = 'all';
let majorPrioritiesConfirmModalOpen = false;
let sittingMembersFilter = 'all';
let campaignPollingTab = 'senate';
let commissionPollModalOpen = false;
let summitModalOpen = false;
let summitModalFactionId = null;
let commissionedPollsModalOpen = false;
let factionCategoryFilter = 'player';
let factionInspectorState = 'CA';
let kingmakerSelectedPartner = null;
let kingmakerSelectedConcession = 'gavels';
let kingmakerReformType = 'rcv';
let kingmakerTargetState1 = 'PA';
let kingmakerTargetState2 = 'CO';
let contingentEndorseParty = 'people';
let contingentConcession = 'cabinet';
let contingentCabinetRole = 'cabinet_state';
let contingentReformType = 'rcv';
let fusionPartnerSelection = null;
let eraDossierModalOpen = false;
let allocValidationModalOpen = false;
let allocValidationSum = 0;

function resetCustomPartySetupDefaults() {
  custom = false;
  selectedLeaderArchetype = 'former-politician';
  customIssueCategory = 'All';
  customIssuePositions = null;
  customPartyName = '';
  customPartyColor = '#8b5cf6';
  customLeaderName = '';
  customPoliticianOffice = 'governor';
  customPoliticianState = 'PA';
  customPoliticianSeat = 'PA';
  customPartyCode = 'CGP';
  customPartyMotto = 'Pragmatism over partisanship.';
  customFoundingStateId = 'PA';
  customSelectedEmblem = 'compass';
  customOrigin = 'civic_reform';
  customSchismParent = 'people';
  customCharterTraits = ['big_tent_pragmatism', 'state_first_federation'];
  customSelectedFactionIds = [];
  custom100kName = 'Heartland Civic League';
  custom100kSliders = { economic: 5.0, social: 5.0, governance: 5.0 };
  custom100kIssues = ['campaign-finance', 'healthcare-model'];
  custom100kStateAllocations = { PA: 100000 };
  allocValidationModalOpen = false;
  allocValidationSum = 0;
}

function allocationValidationModalMarkup() {
  if (!allocValidationModalOpen) return '';
  return `
    <div class="v08-modal-overlay" id="alloc-validation-modal-overlay">
      <div class="v08-modal-content" style="max-width:480px;padding:24px;border:1px solid var(--line);background:var(--panel);border-radius:8px">
        <div class="eyebrow" style="color:var(--gold);margin-bottom:8px">State Allocation Incomplete</div>
        <h3 style="margin:0 0 12px;color:#fff">Voter Allocation Error</h3>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:var(--text-muted)">
          State voter allocations sum to ${allocValidationSum.toLocaleString()} / 100,000. Please allocate exactly 100,000 voters before launching.
        </p>
        <div style="display:flex;justify-content:flex-end">
          <button type="button" class="button button-gold" id="btn-close-alloc-modal">Understood</button>
        </div>
      </div>
    </div>
  `;
}

function activePlatformIssues() {
  if (game && window.PartySystemsEngine?.getActiveIssuesForGame) {
    return window.PartySystemsEngine.getActiveIssuesForGame(game);
  }
  return window.PartyChairData.VERSION_021_ISSUES || [];
}

function issueStanceText(issueId, value) {
  if (game && window.PartySystemsEngine?.getIssueStanceDescription) {
    return window.PartySystemsEngine.getIssueStanceDescription(game, issueId, value);
  }
  return window.PartyChairData.STANCE_DESCRIPTIONS?.[issueId]?.[value]
    || 'Balanced national policy framework prioritizing pragmatic compromises.';
}

function candidateEraBadgeMarkup(candidate, stateId = null) {
  if (!game || !candidate || !window.PartySystemsEngine) return '';
  const pse = window.PartySystemsEngine;
  const eraId = game.partySystems?.currentEraId || 'era_07_baseline';
  if (eraId === 'era_07_baseline') return '';
  const badges = [];
  if (eraId === 'era_11_generational_succession') {
    const age = pse.resolveCandidateAge(candidate, game.year || 2028);
    if (age > 65) {
      badges.push(`<span class="v07-mini-badge" style="background:rgba(217,119,6,0.18);border-color:#d97706;color:#fbbf24" title="Senior contender facing generational turnout headwinds in the current political climate">Senior Generation</span>`);
    } else if (age < 45) {
      badges.push(`<span class="v07-mini-badge" style="background:rgba(16,185,129,0.18);border-color:#10b981;color:#6ee7b7" title="Next-generation contender inspiring surging youth volunteer energy">Next-Gen Surge</span>`);
    }
  } else if (eraId === 'era_12_digital_syndicate' && Number(candidate.fame || 0) > 80) {
    badges.push(`<span class="v07-mini-badge" style="background:rgba(14,165,233,0.18);border-color:#0ea5e9;color:#7dd3fc" title="High-profile digital communicator capable of viral small-dollar fundraising surges">Viral Reach</span>`);
  } else if (eraId === 'era_21_metro_vs_heartland' && stateId && stateId !== 'US') {
    const arch = pse.resolveCandidateGeoArchetype(candidate);
    const stMetro = pse.isMetroState(stateId);
    if (arch !== 'balanced') {
      const matched = (arch === 'metro' && stMetro) || (arch === 'heartland' && !stMetro);
      const label = arch === 'metro' ? 'Metro Profile' : 'Heartland Profile';
      const tip = matched
        ? 'Geographic identity aligns closely with local electorate density.'
        : 'Geographic archetype clashes with local voters, creating steep general-election headwinds.';
      const style = matched
        ? 'background:rgba(16,185,129,0.18);border-color:#10b981;color:#6ee7b7'
        : 'background:rgba(239,68,68,0.18);border-color:#ef4444;color:#fca5a5';
      badges.push(`<span class="v07-mini-badge" style="${style}" title="${safe(tip)}">${safe(label)}${matched ? ' ✓' : ' ⚠'}</span>`);
    }
  } else if (eraId === 'era_26_post_citizens_united' && pse.hasSqueakyCleanTrait(candidate)) {
    badges.push(`<span class="v07-mini-badge" style="background:rgba(5,150,105,0.2);border-color:#059669;color:#6ee7b7" title="Squeaky Clean reputation qualifies this campaign for enhanced public matching funds">Public Match Eligible</span>`);
  } else if ((eraId === 'era_08_ideologies_cool' || eraId === 'era_01_anti_extremist') && pse.isExtremistCandidate(candidate, game)) {
    badges.push(`<span class="v07-mini-badge" style="background:rgba(239,68,68,0.18);border-color:#ef4444;color:#fca5a5" title="Hardline ideological profile risks general-election backlash in the prevailing moderate climate">Polarization Risk</span>`);
  }
  return badges.join('');
}

function eraChairSwitcherMarkup() {
  if (!game || !window.PartySystemsEngine) return '';
  const pse = window.PartySystemsEngine;
  const ps = game.partySystems;
  const eraId = ps?.currentEraId || 'era_07_baseline';
  const currentKey = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');

  let switchOptions = [];
  let heading = '';

  if (eraId === 'era_03_six_party_system') {
    heading = 'Six-Party Republic Chair Switcher';
    switchOptions = ['people', 'heritage', 'liberty', 'green', 'socialist', 'constitution'].map((id) => ({
      id,
      label: pse.getPartyDisplayName(game, id),
    }));
  } else if (eraId === 'era_02_moderate_party' || ps?.moderateParty?.active) {
    heading = 'Moderate Realignment Chair Command';
    const baseIds = ['moderate', 'people', 'heritage'];
    if (!baseIds.includes(currentKey) && currentKey !== 'player') baseIds.push(currentKey);
    switchOptions = baseIds.map((id) => ({
      id,
      label: pse.getPartyDisplayName(game, id),
    }));
  } else if (eraId === 'era_10_regional_parties' && ps?.regionalParties?.active) {
    heading = 'Territorial Regional Powerhouses';
    const absorbed = new Set(ps.regionalParties.absorbedPartyIds || []);
    switchOptions = (ps.regionalParties.parties || [])
      .filter((r) => !absorbed.has(r.id))
      .map((r) => ({ id: r.id, label: `${r.shortName || r.name} (${r.regionLabel})`, color: r.color }));
  }

  if (!switchOptions.length) return '';
  return `
    <div class="era-chair-switcher" style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(148,163,184,0.18)">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:6px">${safe(heading)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${switchOptions.map((opt) => {
          const isActive = opt.id === currentKey;
          const borderStyle = opt.color ? `border-color:${safe(opt.color)}` : '';
          return `<button type="button" class="button button-small ${isActive ? 'button-gold' : ''}" data-switch-chair-party="${safe(opt.id)}" ${isActive ? 'disabled' : ''} style="${borderStyle}" title="${isActive ? 'Currently chairing this national committee' : `Switch leadership to chair ${safe(opt.label)}`}">${isActive ? '✓ ' : ''}${safe(opt.label)}</button>`;
        }).join('')}
      </div>
    </div>`;
}

function eraRegionalMergerMarkup() {
  if (!game || !window.PartySystemsEngine) return '';
  const pse = window.PartySystemsEngine;
  if (!pse.isRegionalMergerEnabled(game)) return '';
  const currentKey = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
  if (String(currentKey).startsWith('reg_')) return '';
  const rp = game.partySystems?.regionalParties;
  if (!rp || !Array.isArray(rp.parties) || !rp.parties.length) return '';
  const absorbed = new Set(rp.absorbedPartyIds || []);
  const canAfford = (game.actionsLeft || 0) > 0 && Number(game.treasury || 0) >= 6;

  return `
    <div class="era-regional-merger-panel" style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(148,163,184,0.18)">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:6px">Neo-Federalist Cross-Regional Mergers (1 Action · $6M)</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${rp.parties.map((r) => {
          const isAbsorbed = absorbed.has(r.id);
          if (isAbsorbed) {
            return `<span class="v07-mini-badge" style="background:rgba(16,185,129,0.16);border-color:#10b981;color:#6ee7b7" title="Regional machine unified into a national coalition">✓ ${safe(r.regionLabel)} Reunified</span>`;
          }
          return `<button type="button" class="button button-small" data-absorb-regional-party="${safe(r.id)}" ${canAfford ? '' : 'disabled'} style="border-color:${safe(r.color || '#c48f45')}" title="Negotiate a Neo-Federalist merger to absorb ${safe(r.name)} across ${(r.homeStates || []).join(', ')}">Absorb ${safe(r.shortName || r.name)} (${safe(r.regionLabel)})</button>`;
        }).join('')}
      </div>
    </div>`;
}

function regionalStateBadgeMarkup(stateId, compact = false) {
  if (!game || !window.PartySystemsEngine) return '';
  const reg = window.PartySystemsEngine.getRegionalPartyForState(game, stateId);
  if (!reg) return '';
  return `<span class="v159-sys-badge era-regional-badge" style="background:${safe(reg.color || '#8b5a2b')}26;border-color:${safe(reg.color || '#8b5a2b')};color:var(--text)" title="${safe(reg.name)} commands a fiercely rooted territorial stronghold across ${safe(reg.regionLabel)}.">${compact ? `⚑ ${safe(reg.shortName || reg.regionLabel)}` : `⚑ ${safe(reg.name)}`}</span>`;
}

function activeEraFeedbackBannerMarkup() {
  if (!game || !window.PartySystemsEngine) return '';
  const pse = window.PartySystemsEngine;
  const ps = game.partySystems;
  const eraId = ps?.currentEraId || 'era_07_baseline';
  if (eraId === 'era_07_baseline') return '';
  const meta = pse.getEraMetadata(eraId);
  const advisory = pse.getActiveEraAdvisory(game);
  const accent = meta?.accentColor || '#c48f45';
  const es = ps?.eraState || {};
  const chips = [];

  if (eraId === 'era_02_moderate_party' || ps?.moderateParty?.active) {
    const defCount = Number(ps?.moderateParty?.defectedCount || 0);
    chips.push(`<span class="v07-mini-badge" style="background:rgba(92,158,122,0.2);border-color:#5C9E7A;color:#a7f3d0" title="Sitting moderate lawmakers crossed the aisle to establish the Moderate Party">Moderate Party Active${defCount > 0 ? ` · ${defCount} Defected Officials` : ''}</span>`);
  }
  if (eraId === 'era_03_six_party_system') {
    chips.push(`<span class="v07-mini-badge" style="background:rgba(168,66,20,0.2);border-color:#a84214;color:#fdba74" title="Legislative majorities require cross-party coalition accords across six evenly matched national parties">Six-Party Republic · Coalition Majorities Required</span>`);
  }
  if (eraId === 'era_05_independent_surge') {
    const indCount = Object.keys(es.independentDownballotRaces || {}).length;
    chips.push(`<span class="v07-mini-badge" title="Independent candidates are competing aggressively across Congress with no wasted-vote stigma">Independent Wave · ${indCount} Contested Races</span>`);
  }
  if (eraId === 'era_10_regional_parties') {
    const activeRegs = (ps?.regionalParties?.parties || []).filter((p) => !(ps?.regionalParties?.absorbedPartyIds || []).includes(p.id)).length;
    chips.push(`<span class="v07-mini-badge" style="background:rgba(180,83,9,0.2);border-color:#b45309;color:#fcd34d" title="Six territorial regional parties dominate local loyalties across their home regions">${activeRegs} Territorial Regional Powerhouses Active</span>`);
  }
  if (eraId === 'era_14_tripartite_corporatist') {
    chips.push(`<span class="v07-mini-badge" title="Enacting state bills requires endorsements from both a Labor bloc and a Business bloc">Tripartite Labor + Business Sign-Off Required</span>`);
  }
  if (eraId === 'era_15_ai_boom' && es.aiAlignments?.player?.label) {
    chips.push(`<span class="v07-mini-badge" title="Current platform posture along the defining Artificial Intelligence realignment">AI Posture: ${safe(es.aiAlignments.player.label)}</span>`);
  }
  if (eraId === 'era_17_ecological_collapse') {
    chips.push(`<span class="v07-mini-badge" style="background:rgba(16,185,129,0.2);border-color:#10b981;color:#6ee7b7" title="Existential climate crises have propelled the Green Party into national ascendancy with effortless chapter organizing and surging small-dollar enthusiasm">Ecological Crisis · Green Party Ascendant</span>`);
  }
  if (eraId === 'era_19_charismatic_movement' && es.successionWarActive) {
    chips.push(`<span class="v07-mini-badge" style="background:rgba(239,68,68,0.2);border-color:#ef4444;color:#fca5a5" title="An open movement leadership transition has triggered fierce intraparty primary competition">Succession War Active</span>`);
  }
  if (eraId === 'era_22_neo_federalist') {
    chips.push(`<span class="v07-mini-badge" style="background:rgba(59,130,246,0.2);border-color:#3b82f6;color:#93c5fd" title="National party committees can now negotiate cross-regional mergers to reunify splintered regional machines">Unionist Restoration · Cross-Regional Mergers Open</span>`);
  }
  if (eraId === 'era_23_secular_enlightenment') {
    chips.push(`<span class="v07-mini-badge" style="background:rgba(14,165,233,0.2);border-color:#0ea5e9;color:#7dd3fc" title="A sweeping secular constitutionalist revival is energizing young and non-sectarian voters">Secular Constitutionalist Revival</span>`);
  }
  if (eraId === 'era_24_human_verified') {
    chips.push(`<span class="v07-mini-badge" style="background:rgba(217,119,6,0.2);border-color:#d97706;color:#fde68a" title="Voters reward brick-and-mortar chapters and in-person state tours while recoiling from algorithmic media blitzes">Human-Verified Analog Surge</span>`);
  }
  if (eraId === 'era_25_planetary_thermostat') {
    const disputed = es.disputedBlocName || 'Arid Southwest Basin';
    chips.push(`<span class="v07-mini-badge" style="background:rgba(2,132,199,0.2);border-color:#0284c7;color:#7dd3fc" title="Regional rainfall and geo-engineering blocs are driving fierce local turnout swings">Water & Rainfall Flashpoint: ${safe(disputed)}</span>`);
  }
  if (eraId === 'era_26_post_citizens_united') {
    chips.push(`<span class="v07-mini-badge" style="background:rgba(5,150,105,0.2);border-color:#059669;color:#6ee7b7" title="Super PACs are dissolved nationwide; grassroots chapters and public matching lead campaign finance">Grassroots & Public Match Era</span>`);
  }

  return `
    <div class="era-campaign-briefing" style="margin:0 0 14px;padding:12px 14px;border-radius:10px;border:1px solid ${safe(accent)}55;border-left:4px solid ${safe(accent)};background:linear-gradient(135deg,#131b26,#0f1620)">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
        <strong style="font-size:13.5px;color:var(--text)">🏛️ Active Political Climate: ${safe(meta?.title || 'Realigned Era')}</strong>
        <button type="button" class="button button-small" data-open-era-dossier title="Open the full Political Era Dossier">Inspect Dossier</button>
      </div>
      ${advisory ? `<p style="margin:0;font-size:12.5px;line-height:1.45;color:var(--muted)">${safe(advisory)}</p>` : ''}
      ${chips.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">${chips.join('')}</div>` : ''}
      ${eraChairSwitcherMarkup()}
      ${eraRegionalMergerMarkup()}
    </div>`;
}
let fusionPledgeSelection = 'pledge-electoral-reform';
const ACTION_STATE_SELECT_IDS = new Set([
  'chapter-state', 'reg-state', 'bill-state', 'tour-state', 'fundraise-state',
  'petition-state', 'voting-law-state', 'oppo-select', 'volunteer-state-select',
  'joint-state-select', 'ballot-state-select',
]);
let bicameralChamberFilter = 'all';
const actionStateSelections = {};
function getSelectedActionState(selectId, fallback) {
  return actionStateSelections[selectId] || fallback || mapState || 'PA';
}
function setSelectedActionState(selectId, stateId) {
  if (selectId && stateId) actionStateSelections[selectId] = stateId;
}
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  document.addEventListener('change', (e) => {
    const el = e && e.target;
    if (el && el.id && ACTION_STATE_SELECT_IDS.has(el.id) && el.value) {
      actionStateSelections[el.id] = el.value;
    }
  });
}

function formatPartyDisplayName(partyId, format = 'short') {
  if (partyId === 'people') return format === 'short' ? 'Dem' : 'Democratic';
  if (partyId === 'heritage') return format === 'short' ? 'GOP' : 'Republican';
  if (partyId === 'nonpartisan') return 'Nonpartisan';
  return partyId;
}

const FALLBACK_INSTITUTIONAL_TIERS = [
  { tier: 0, id: 'extremist', name: 'Extremist Movement', shortLabel: 'Extremist', maxFocusSlots: 1, badgeColor: '#b91c1c', description: 'Operating on the ideological periphery under intense civic stigma, radioactive ballot scrutiny, and severe media hostility.', nextRequirement: 'Build a broad grassroots base, win state legislative footholds, secure multi-state ballot access, or break through in federal voting to become a recognized Fringe Party.' },
  { tier: 1, id: 'fringe', name: 'Fringe Party', shortLabel: 'Fringe', maxFocusSlots: 3, badgeColor: '#6b7280', description: 'Operating outside national broadcast coverage with limited ballot lines.', nextRequirement: 'Reach 2% national presidential vote or secure full ballot access in 10+ states to become Ballot-Qualified.' },
  { tier: 2, id: 'ballot_qualified', name: 'Ballot-Qualified Minor', shortLabel: 'Ballot-Qualified', maxFocusSlots: 3, badgeColor: '#0284c7', description: 'Multi-state ballot lines unlock Regional Chapter Momentum waves and Fusion cross-endorsement deals.', nextRequirement: 'Win 5% national presidential popular vote to earn Federal Recognition, FEC Matching Funds, and 5 Focus Slots.' },
  { tier: 3, id: 'federally_recognized', name: 'Federally Recognized Party', shortLabel: 'Recognized', maxFocusSlots: 5, badgeColor: '#7c3aed', description: 'Qualifies for FEC Public Matching Funds, automatic ballot retention, and 5 strategic Party Focus slots.', nextRequirement: 'Reach 15% in national polling or presidential vote to break the media blackout and qualify for the Debate Stage.' },
  { tier: 4, id: 'debate_contender', name: 'Debate-Qualified Contender', shortLabel: 'Contender', maxFocusSlots: 5, badgeColor: '#d97706', description: 'Shatters the national broadcast blackout, qualifies for the Presidential Debate Stage, and unlocks allied Super PACs.', nextRequirement: 'Win 20% presidential vote, hold 35 House / 8 Senate / 5 Governor seats, or eclipse a major party to achieve Major Party Status.' },
  { tier: 5, id: 'major_party', name: 'Major Party', shortLabel: 'Major', maxFocusSlots: 7, badgeColor: '#059669', description: 'Full national institutional parity with 7 Party Focus slots and immunity to tactical wasted-vote squeezes.', nextRequirement: 'Maximum institutional standing achieved.' },
];

function getPlayerTierInfo(g = game) {
  const tierNum = window.PartyChairEngine?.getPartyInstitutionalTier
    ? window.PartyChairEngine.getPartyInstitutionalTier(g, 'player')
    : (V07?.getPartyInstitutionalTier ? V07.getPartyInstitutionalTier(g, 'player') : (isMajorParty(g, 'player') ? 5 : 1));
  const catalog = window.PartyChairData?.INSTITUTIONAL_TIERS || FALLBACK_INSTITUTIONAL_TIERS;
  return catalog.find((t) => t.tier === tierNum) || FALLBACK_INSTITUTIONAL_TIERS.find((t) => t.tier === tierNum) || FALLBACK_INSTITUTIONAL_TIERS[0];
}

function getPlayerMaxFocusSlots(g = game) {
  if (window.PartyChairEngine?.getMaxFocusSlots) return window.PartyChairEngine.getMaxFocusSlots(g, 'player');
  if (V07?.getMaxFocusSlots) return V07.getMaxFocusSlots(g, 'player');
  return getPlayerTierInfo(g).maxFocusSlots || 3;
}

function ascensionGauntletProgressStripMarkup(g = game) {
  const info = getPlayerTierInfo(g);
  if (info.tier !== 0) return '';
  const evalFn = window.PartyChairEngine?.evaluateAscensionGauntlet || V07?.evaluateAscensionGauntlet;
  const status = evalFn ? evalFn(g, 'player') : null;
  const paths = status?.paths || {};
  const pathMeta = [
    { key: 'grassroots_expansion', label: 'Grassroots Base' },
    { key: 'statehouse_foothold', label: 'Statehouse Foothold' },
    { key: 'multi_state_footprint', label: 'Multi-State Ballot Footprint' },
    { key: 'popular_vote_beachhead', label: 'Federal Vote Beachhead' },
  ];
  let best = { label: 'Grassroots Base', ratio: 0 };
  pathMeta.forEach((pm) => {
    const r = Number(paths[pm.key]?.ratio || 0);
    if (r >= best.ratio) best = { label: pm.label, ratio: r };
  });
  const cue = best.ratio >= 0.85
    ? 'On the Threshold of Fringe Recognition'
    : best.ratio >= 0.55
      ? 'Gathering Breakout Momentum'
      : best.ratio >= 0.25
        ? 'Early Grassroots Traction'
        : 'Deep Ideological Isolation';
  return `<div class="v164-gauntlet-strip" title="Operating on the ideological periphery under intense civic stigma, radioactive ballot scrutiny, and severe media hostility."><span class="v164-gauntlet-label">Ascension Gauntlet · ${safe(best.label)}</span><span class="v164-gauntlet-cue">${safe(cue)}</span></div>`;
}

function institutionalStatusBadgeMarkup(g = game, compact = false) {
  const info = getPlayerTierInfo(g);
  if (info.tier === 0) {
    const tier0Tooltip = 'Operating on the ideological periphery under intense civic stigma, radioactive ballot scrutiny, and severe media hostility.';
    if (compact) {
      return `<span class="v159-resource-tier-line tier-0" style="color:${info.badgeColor}" title="${safe(tier0Tooltip)}"><i style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${info.badgeColor}"></i>[ Tier 0 · Extremist Movement ]</span>`;
    }
    return `<span class="v159-tier-badge tier-0" style="background:${info.badgeColor}" title="${safe(tier0Tooltip)}"><span class="v159-tier-dot"></span><span>[ Tier 0 · Extremist Movement ]</span></span>${ascensionGauntletProgressStripMarkup(g)}`;
  }
  const tooltip = `${info.name} (Tier ${info.tier} of 5) — ${info.description} Next rung: ${info.nextRequirement}`;
  if (compact) {
    return `<span class="v159-resource-tier-line" style="color:${info.badgeColor}" title="${safe(tooltip)}"><i style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${info.badgeColor}"></i>${safe(info.name)} (${info.maxFocusSlots} Focus Slots)</span>`;
  }
  return `<span class="v159-tier-badge tier-${info.tier}" title="${safe(tooltip)}"><span class="v159-tier-dot"></span><span>${safe(info.shortLabel)} · Tier ${info.tier}</span></span>`;
}

function partyDoctrineBadgeMarkup(g = game) {
  const doc = g?.identityCrisis?.doctrine;
  if (!doc) return '';
  if (doc === 'big_tent') {
    return `<span class="v159-doctrine-badge doctrine-big-tent" title="Permanent Party Doctrine: Moderate & Professionalize — Institutional donors unlocked, reduced coalition friction, and elevated Independent standing.">🏛️ Big-Tent Coalition</span>`;
  }
  return `<span class="v159-doctrine-badge doctrine-vanguard" title="Permanent Party Doctrine: Populist Vanguard — Elevated base turnout, amplified grassroots energy, and firm ideological identity.">🔥 Populist Vanguard</span>`;
}

function getStateElectoralBadgesMarkup(stateId, compact = false) {
  const sys = window.PartyChairEngine?.getStateElectoralSystem
    ? window.PartyChairEngine.getStateElectoralSystem(game, stateId)
    : (game?.stateElectoralSystems?.[stateId] || (stateId === 'AK' ? { allRaces: 'rcv', legislative: 'plurality' } : { allRaces: 'plurality', legislative: 'plurality' }));
  const defs = window.PartyChairData?.ELECTORAL_SYSTEM_DEFINITIONS || {};
  const badges = [];
  if (sys.allRaces === 'rcv') {
    badges.push(`<span class="v159-sys-badge sys-rcv" title="${safe(defs.rcv?.description || 'Ranked-Choice Voting eliminates wasted-vote spoiler penalties.')}">RCV</span>`);
  } else if (sys.allRaces === 'approval') {
    badges.push(`<span class="v159-sys-badge sys-approval" title="${safe(defs.approval?.description || 'Approval Voting eliminates wasted-vote spoiler penalties.')}">Approval</span>`);
  }
  if (sys.legislative === 'proportional') {
    badges.push(`<span class="v159-sys-badge sys-prop" title="${safe(defs.proportional?.description || 'Proportional Representation allocates U.S. House and State Legislature seats proportionally.')}">${compact ? 'Prop. Leg' : 'Proportional House/Leg'}</span>`);
  }
  if (!badges.length && !compact) {
    badges.push(`<span class="v159-sys-badge sys-plurality" title="${safe(defs.plurality?.description || 'Standard winner-take-all plurality voting.')}">Plurality</span>`);
  }
  const regionalBadge = regionalStateBadgeMarkup(stateId, compact);
  if (regionalBadge) badges.push(regionalBadge);
  return badges.join('');
}

function getStateBreakthroughBadgeMarkup(stateId, compact = false) {
  const playerKey = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
  if (!game?.player?.custom && ['people', 'heritage'].includes(playerKey)) return '';
  const btMap = game?.viabilityBreakthroughs?.[playerKey] || {};
  if (btMap[stateId]) {
    return `<span class="v159-breakthrough-badge shattered" title="Your party shattered the local viability ceiling in this state — voters no longer abandon your ballot line over spoiler fears.">${compact ? '⚡ Shattered' : '⚡ Viability Ceiling Shattered'}</span>`;
  }
  const stateRegs = stateOverlappingRegions(stateId);
  const spilloverNeighbor = Object.keys(btMap).find((btSt) => {
    if (!btMap[btSt] || btSt === stateId) return false;
    const neighborRegs = stateOverlappingRegions(btSt);
    return neighborRegs.some((r) => stateRegs.includes(r));
  });
  if (spilloverNeighbor) {
    const nName = STATES.find((s) => s.id === spilloverNeighbor)?.name || spilloverNeighbor;
    return `<span class="v159-breakthrough-badge spillover" title="Regional breakthrough momentum from ${safe(nName)} is easing tactical voting headwinds across this region.">${compact ? '🌊 Spillover' : `🌊 Regional Spillover (${safe(nName)})`}</span>`;
  }
  return '';
}

function pollingMarginColor(canonicalPartyId, margin, fallbackColor = '#9333ea') {
  const absM = Math.abs(Number(margin) || 0);
  if (absM < 3.0) {
    if (canonicalPartyId === 'people') return '#dbeafe';
    if (canonicalPartyId === 'heritage') return '#fee2e2';
    return '#cbd5e1';
  }
  if (canonicalPartyId === 'people') {
    if (absM >= 20) return '#1d4ed8';
    if (absM >= 10) return '#2563eb';
    return '#60a5fa';
  }
  if (canonicalPartyId === 'heritage') {
    if (absM >= 20) return '#b91c1c';
    if (absM >= 10) return '#dc2626';
    return '#f87171';
  }
  if (canonicalPartyId === 'liberty') {
    if (absM >= 20) return '#b45309';
    if (absM >= 10) return '#d97706';
    return '#f59e0b';
  }
  if (canonicalPartyId === 'green') {
    if (absM >= 20) return '#047857';
    if (absM >= 10) return '#10b981';
    return '#34d399';
  }
  if (canonicalPartyId === 'constitution') {
    if (absM >= 20) return '#581c87';
    if (absM >= 10) return '#7e22ce';
    return '#a855f7';
  }
  if (canonicalPartyId === 'socialist') {
    if (absM >= 20) return '#881337';
    if (absM >= 10) return '#be123c';
    return '#f43f5e';
  }
  if (canonicalPartyId === 'independent') {
    if (absM >= 20) return '#0f766e';
    if (absM >= 10) return '#14b8a6';
    return '#2dd4bf';
  }
  const tierHint = absM >= 20 ? 'solid' : absM >= 10 ? 'likely' : 'lean';
  return proceduralCustomColor(tierHint, fallbackColor);
}

function getStatePollingBreakdown(stateObj, districtObj = null, raceId = null) {
  const fullState = STATES.find((s) => s.id === (stateObj?.id || stateObj)) || stateObj;
  // [v0.18.4 MINOR-PARTY-FIXES] Pass raceId when polling downballot contests so ballot-certified minor parties show real shares
  const rawSupport = fullState ? supportByState(game, fullState, raceId ? { raceId } : undefined) : {};
  const parties = partyList(game);
  const rows = parties.map((p) => {
    const canonicalId = (p.id === 'player' && !p.custom) ? (p.baseTemplateId || 'people') : p.id;
    const shortName = canonicalId === 'people' ? 'Dem'
      : canonicalId === 'heritage' ? 'Rep'
      : canonicalId === 'green' ? 'Green'
      : canonicalId === 'liberty' ? 'Lib'
      : canonicalId === 'constitution' ? 'Const'
      : canonicalId === 'socialist' ? 'PFP'
      : p.name.split(' ')[0];
    return {
      id: p.id,
      canonicalId,
      shortName,
      name: p.name,
      color: p.color || '#8b5cf6',
      share: Number(rawSupport[p.id] ?? rawSupport[canonicalId] ?? 0),
    };
  });

  if (districtObj && typeof districtObj.lean === 'number' && fullState) {
    const stateBaseLean = fullState.leanPercent !== undefined ? fullState.leanPercent : (fullState.lean !== undefined ? -fullState.lean * 100 : 0);
    const delta = (districtObj.lean - stateBaseLean) * 0.5;
    const demRow = rows.find((r) => r.canonicalId === 'people');
    const repRow = rows.find((r) => r.canonicalId === 'heritage');
    if (demRow && repRow) {
      demRow.share = Math.max(1.5, demRow.share + delta);
      repRow.share = Math.max(1.5, repRow.share - delta);
      const total = rows.reduce((s, r) => s + r.share, 0) || 100;
      rows.forEach((r) => { r.share = (r.share / total) * 100; });
    }
  }

  const sorted = rows.slice().sort((a, b) => b.share - a.share);
  const leader = sorted[0] || { canonicalId: 'people', shortName: 'Dem', color: '#3478c8', share: 50 };
  const runnerUp = sorted[1] || { canonicalId: 'heritage', shortName: 'Rep', color: '#c9474e', share: 50 };
  const margin = leader.share - runnerUp.share;
  // [v0.18.4 MINOR-PARTY-FIXES] Always include the player's own party in race polling breakdowns even below 0.5%
  const visible = sorted.filter((r, idx) => idx < 2 || r.id === 'player' || r.share >= 0.5);
  const summaryText = visible.map((r) => `${r.shortName}: ${r.share.toFixed(1)}%`).join(' · ');
  return { sorted, leader, runnerUp, margin, summaryText };
}

const TUTORIAL_STORAGE_KEY = 'partyChairGame.tutorial.v07';
let tutorialActive = false;
let tutorialStepIndex = 0;
try {
  const savedTutorial = JSON.parse(localStorage.getItem(TUTORIAL_STORAGE_KEY) || 'null');
  if (game && !['completed', 'skipped'].includes(savedTutorial?.status)) {
    tutorialActive = true;
    tutorialStepIndex = savedTutorial?.status === 'active' ? Number(savedTutorial.step) || 0 : 0;
    persistTutorial('active');
  }
} catch { /* A damaged tutorial marker should not block starting a game. */ }

function currentTab() {
  return game?.activeTab || 'actions';
}
function currentStep() {
  return Math.max(1, Math.min(5, Number(game?.turnStep || 1)));
}

function tutorialSteps() {
  if (!game) return [];
  const has = (selector) => Boolean(document.querySelector(selector));
  const majorParty = ['people', 'heritage'].includes(game.player.baseTemplateId);
  const tab = currentTab();
  const stepNum = currentStep();

  const steps = [
    {
      key: 'nav-map',
      selector: '[data-main-tab="map"]',
      title: 'Fullscreen Tab Navigation',
      body: 'Coalition Builder v0.7 organizes your command center into four fullscreen views: Actions, Map, States, and Forecast. Click the Map tab to inspect the national political landscape.',
    },
    {
      key: 'presidential-map',
      requiredTab: 'map',
      selector: '[data-map="presidential"]',
      title: 'The Presidential Map',
      body: 'The presidential map projects the Electoral College battle between Jon Ossoff and J. D. Vance (538 EV total, 270 to win). Top-of-the-ticket margins carry a 34% coattail effect into U.S. House districts.',
    },
    {
      key: 'senate-class-i',
      requiredTab: 'map',
      selector: '[data-senate-class="I"]',
      title: 'Senate Class I (2024 Winners)',
      body: 'All three Senate classes are always accessible from the map bar. Click Class I to inspect the 33 seats elected in 2024.',
    },
    {
      key: 'senate-class-ii',
      requiredTab: 'map',
      selector: '[data-senate-class="II"]',
      title: 'Senate Class II (2026 Audit)',
      body: 'Click Class II to inspect the 33 seats from the 2026 midterms, including Democratic gains such as Mary Peltola (AK) and Scott Colom (MS).',
    },
    {
      key: 'senate-class-iii',
      requiredTab: 'map',
      selector: '[data-senate-class="III"]',
      title: 'Senate Class III (Up in 2028)',
      body: 'Click Class III to inspect the 34 Senate seats contested in this 2028 cycle.',
    },
    {
      key: 'nav-states',
      selector: '[data-main-tab="states"]',
      title: '50-State Directory & Roster',
      body: 'Click the States tab to inspect overlapping cultural/political regions, state party chapters, sitting Senators/Governors/Reps, and state legislative bill eligibility.',
    },
    {
      key: 'nav-forecast',
      selector: '[data-main-tab="forecast"]',
      title: 'Trust, Leadership & Forecast',
      body: 'Click the Forecast tab to review your Tri-Partisan Electorate Trust (Supporters, Independents, Opponents), the 14 Party Leadership Roles, and election projections.',
    },
    {
      key: 'nav-actions',
      selector: '[data-main-tab="actions"]',
      title: 'Return to Turn Workflow',
      body: 'Click the Actions tab to enter the 4-Step Guided Turn Workflow.',
    },
    {
      key: 'issue-slider',
      requiredTab: 'actions',
      requiredStep: 1,
      selector: 'input[data-issue]',
      event: 'change',
      title: 'Step 1: Unified Party Platform',
      body: 'Move any 1–10 issue slider and release it. Your national issue stances directly recalculate your party’s summary ideological axes and electorate trust.',
    },
    {
      key: 'step-2-next',
      requiredTab: 'actions',
      requiredStep: 1,
      selector: '#step-next',
      title: 'Advance to Step 2: Priorities',
      body: 'Click Next Step to choose your 3 core issue priorities and regional priorities.',
    },
    {
      key: 'toggle-region-priority',
      requiredTab: 'actions',
      requiredStep: 2,
      selector: '[data-set-additional-type][data-type="region"]',
      title: 'Step 2: Regional & Strategic Party Focus',
      body: 'Configure Party Focus slots across national issues, critical battleground states, and cultural regions to target turnout and field persuasion.',
    },
    {
      key: 'step-3-next',
      requiredTab: 'actions',
      requiredStep: 2,
      selector: '#step-next',
      title: 'Advance to Step 3: Filter Primary Support',
      body: 'Click Next Step to inspect Senate Class III and 2028 Governor primary fields, 10-stat candidate ratings, and Fame.',
    },
    {
      key: 'endorse-candidate',
      requiredTab: 'actions',
      requiredStep: 3,
      selector: majorParty && has('[data-action="candidate-endorse"]:not(:disabled)')
        ? '[data-action="candidate-endorse"]:not(:disabled)'
        : '#primary-race',
      event: majorParty && has('[data-action="candidate-endorse"]:not(:disabled)') ? 'click' : 'change',
      title: 'Step 3: Filter Primary Support Carefully',
      body: majorParty
        ? 'Filter institutional support for 1 candidate per Senate Class III or Governor race for a decisive +10% primary poll boost. Warning: filtering support against a sitting INCUMBENT of your party triggers severe backlash (-18 Sitting Member Happiness, -8 Supporter Trust).'
        : 'Select any race to inspect major-party primary candidates, their 10-stat ratings, and Fame scores.',
    },
    {
      key: 'step-4-next',
      requiredTab: 'actions',
      requiredStep: 3,
      selector: '#step-next',
      title: 'Advance to Step 4: State Legislative Contestation',
      body: 'Click Next Step to inspect and contest state legislative candidate slates.',
    },
    {
      key: 'step-5-next',
      requiredTab: 'actions',
      requiredStep: 4,
      selector: '#step-next',
      title: 'Advance to Step 5: This Year’s Work',
      body: 'Click Next Step to spend leadership actions on state chapters, recruits, state bills, keynote speaker, summits, and fundraising.',
    },
    {
      key: 'fundraise',
      requiredTab: 'actions',
      requiredStep: 5,
      selector: '[data-action="fundraise"]:not(:disabled)',
      fallbackSelector: '#advance-year',
      title: 'Step 5: Choose This Year’s Work',
      body: 'Click Fundraise (or use any yearly organizational action such as opening a state chapter or naming your National Convention Keynote Speaker).',
    },
    {
      key: 'advance-turn',
      requiredTab: 'actions',
      requiredStep: 5,
      selector: '#advance-year:not(:disabled)',
      title: 'Confirm Turn',
      body: 'Click Confirm Turn to advance to the next organizing turn. Confirming Turn 20 resolves primaries and takes you straight into Election Night.',
    },
  ];
  return steps.map((s) => ({
    ...s,
    effectiveSelector: (s.fallbackSelector && !has(s.selector)) ? s.fallbackSelector : s.selector,
  }));
}

function persistTutorial(status = 'active') {
  localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify({ status, step: tutorialStepIndex }));
}
function completeTutorialStep(expectedKey) {
  if (!tutorialActive) return;
  const steps = tutorialSteps();
  if (expectedKey && steps[tutorialStepIndex]?.key !== expectedKey) return;
  tutorialStepIndex += 1;
  if (tutorialStepIndex >= steps.length) {
    tutorialActive = false;
    tutorialStepIndex = steps.length;
    persistTutorial('completed');
  } else {
    persistTutorial('active');
  }
}
function renderTutorial() {
  app.classList.toggle('tutorial-active', tutorialActive);
  if (!tutorialActive || !game) return;
  const steps = tutorialSteps();
  if (tutorialStepIndex >= steps.length) {
    tutorialActive = false;
    persistTutorial('completed');
    return;
  }
  const step = steps[tutorialStepIndex];
  const sel = step.effectiveSelector || step.selector;
  let target = document.querySelector(sel);

  // If the current step belongs to a tab/step the player isn't on yet, auto-align only if it was skipped past cleanly,
  // or prompt them to switch if missing.
  if (!target && step.requiredTab && currentTab() !== step.requiredTab) {
    game = takeAction(game, 'set-active-tab', { tab: step.requiredTab });
    if (step.requiredStep) game = takeAction(game, 'set-turn-step', { step: step.requiredStep });
    app.innerHTML = campaignMarkup();
    bind();
    target = document.querySelector(sel);
  } else if (!target && step.requiredStep && currentStep() !== step.requiredStep) {
    game = takeAction(game, 'set-turn-step', { step: step.requiredStep });
    app.innerHTML = campaignMarkup();
    bind();
    target = document.querySelector(sel);
  }

  const card = `<div class="tutorial-scrim" aria-hidden="true"></div><aside class="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tutorial-title"><div class="eyebrow">Version 0.9 Tutorial · ${tutorialStepIndex + 1} of ${steps.length}</div><h2 id="tutorial-title">${safe(step.title)}</h2><p>${safe(step.body)}</p>${tutorialStepIndex === 0 ? '<small class="tutorial-save-note">You will use the game’s real controls, and your choices apply to this party. Skip any time.</small>' : ''}<div class="tutorial-hint">${target && !target.disabled ? 'Click or interact with the highlighted control to continue.' : 'Review the highlighted step, or skip tutorial.'}</div><div class="tutorial-actions"><button type="button" class="tutorial-skip" id="tutorial-skip">Skip tutorial</button></div></aside>`;
  const attachSkip = () => document.querySelector('#tutorial-skip')?.addEventListener('click', () => {
    tutorialActive = false;
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify({ status: 'skipped', step: tutorialStepIndex }));
    render();
  });

  if (!target || target.disabled) {
    app.insertAdjacentHTML('beforeend', card);
    attachSkip();
    return;
  }
  target.classList.add('tutorial-spotlight');
  target.setAttribute('aria-describedby', 'tutorial-title');
  app.insertAdjacentHTML('beforeend', card);
  attachSkip();
  requestAnimationFrame(() => target.scrollIntoView({ block: 'center', behavior: 'smooth' }));
}

document.addEventListener('click', (event) => {
  if (!tutorialActive || !game) return;
  if (event.target.closest('#tutorial-skip')) return;
  const step = tutorialSteps()[tutorialStepIndex];
  const sel = step?.effectiveSelector || step?.selector;
  const target = sel && document.querySelector(sel);
  if (target && event.target.closest(sel) === target) {
    if (step.event !== 'change') completeTutorialStep(step.key);
    return;
  }
  if (!target || target.disabled) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}, true);

// Global Keyboard Listener for Autopsy Modal Esc Key Handling (REQ-77)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && game?.activeAutopsyModal) {
    dispatchAction('close-autopsy-modal');
    render();
  }
});

// Delegated Click Listener for Party Focus Type Switchers (Bugfix v0.18.2)
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const btn = event.target?.closest ? event.target.closest('[data-set-additional-type]') : null;
    if (!btn || !game || game.focusesLocked) return;
    const maxFocusSlots = getPlayerMaxFocusSlots(game);
    const slotIdx = Number(btn.dataset.setAdditionalType) || 0;
    const newType = btn.dataset.type;
    if (!game.priorities) {
      game.priorities = { main: [], additional: [] };
    }
    if (!Array.isArray(game.priorities.additional)) {
      game.priorities.additional = [];
    }
    while (game.priorities.additional.length < maxFocusSlots) {
      game.priorities.additional.push({ type: 'issue', targetId: '' });
    }
    const currentSlot = game.priorities.additional[slotIdx] || { type: 'issue', targetId: '' };
    if (currentSlot.type !== newType) {
      game.priorities.additional[slotIdx] = { type: newType, targetId: '' };
      dispatchAction('set-additional-priority-type', { slotIndex: slotIdx, type: newType });
      render();
    }
  });
}

const money = (value) => `$${Math.round(value)}M`;
const safe = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const formatMillions = (voters) => ((Number(voters) || 0) / 1_000_000).toFixed(2);
const roundTo = (value, places = 1) => { const factor = 10 ** places; return Math.round(value * factor) / factor; };

let forecastMapChamber = 'presidential';

// REQ-167: Universal Politician Faction Name Resolver
function resolveMemberFactionName(member) {
  if (!member) return 'Coalition';
  const fId = member.factionId || (window.PartyChairData?.resolvePoliticianFactionId ? window.PartyChairData.resolvePoliticianFactionId(member) : null);
  const catalog = (game?.factions && game.factions.length) ? game.factions : (window.PartyChairData?.FACTIONS_CATALOG || []);
  const fObj = catalog.find((f) => f.id === fId || f.name === member.faction || f.id === member.faction);
  if (fObj) return fObj.name;
  if (member.faction) return member.faction;
  return 'Coalition';
}

function modeledVotersForParty(partyId) {
  const affiliations = (game?.voterModel?.affiliations) || VOTER_MODEL.affiliations;
  if (partyId === 'people') return affiliations.people?.representedVoters || 0;
  if (partyId === 'heritage') return affiliations.heritage?.representedVoters || 0;
  if (partyId === 'independent') return affiliations.independent?.representedVoters || 0;
  if (affiliations[partyId]?.representedVoters) {
    return affiliations[partyId].representedVoters;
  }
  if (affiliations.thirdParty?.byParty?.[partyId]) {
    return affiliations.thirdParty.byParty[partyId];
  }
  if (partyId === 'player') {
    const baseKey = game?.player?.baseTemplateId;
    if (baseKey && affiliations[baseKey]?.representedVoters) return affiliations[baseKey].representedVoters;
    return (affiliations.thirdParty?.byParty?.player || affiliations.thirdParty?.byParty?.[baseKey] || 100000);
  }
  return (affiliations.thirdParty?.byParty?.other || 0);
}

function totalModeledElectorate() {
  return Number(game?.voterModel?.representedVoters || 155_000_000);
}

function robotPartyThemeClass() {
  const psr = window.PartySystemsRobots;
  const p = game?.player;
  if (!p) return '';
  if (psr?.isRobotParty(p) || p.isRobotParty) {
    const slug = p.themeSlug || psr?.ROBOT_PARTY_BY_ID?.[p.baseTemplateId]?.themeSlug || 'silicon-vanguard';
    return `robot-party-theme robot-theme-${slug}`;
  }
  return '';
}

function stateSlateCost(stateEv) {
  const ev = Math.max(3, Math.min(54, Number(stateEv || 3)));
  return Math.round(1 + 4 * (ev - 3) / 51);
}

function playerIdentity() {
  if (game?.player?.custom) return 'player';
  if (game?.player?.id && game.player.id !== 'player') return game.player.id;
  if (game?.player?.baseTemplateId) return game.player.baseTemplateId;
  return 'people';
}

function playerStateHouseSeats() {
  const counts = game.stateHouseSeatCounts || window.PartyChairData.VERSION_05_STATE_HOUSE_SEATS.states;
  return Object.values(counts).reduce((sum, row) => sum + (row[playerIdentity()] || 0), 0);
}

function playerSenateSeats() {
  if (typeof allUniversalSenateSeats === 'function' && MAPS?.senators) {
    const pid = playerIdentity();
    return allUniversalSenateSeats().filter((seat) => seat.party === pid || seat.caucus === pid).length;
  }
  const byState = new Map((game?.senateResults || []).map((row) => [row.stateId, row.winner]));
  return (MAPS?.senators || []).filter((seat) => (Number(seat.class) === 3 && byState.has(seat.stateId) ? byState.get(seat.stateId) : seat.party) === playerIdentity()).length;
}

function playerHouseSeats() {
  if (game?.phase === 'complete' && game?.lastElection && game?.representatives?.length) {
    return game.representatives.filter((row) => row.partyId === game.player.id || row.partyId === playerIdentity()).length;
  }
  const pid = playerIdentity();
  const sittingHouse = (game?.sittingMembers || []).filter((m) => m.office === 'house');
  const liveMap = new Map(sittingHouse.map((m) => [m.districtId || m.district, m.party || m.caucus]));
  return (MAPS?.houseResults || []).filter((row) => {
    if (row.pending) return false;
    const p = liveMap.get(row.id) || row.party;
    return p === pid || p === game?.player?.id;
  }).length;
}

function playerGovernorshipsCount() {
  const pid = playerIdentity();
  return Object.keys(MAPS?.governors || {}).filter((st) => (game?.governorships?.[st] || MAPS.governors[st]) === pid).length;
}

function allCandidateRecords() {
  const sitting = game?.sittingMembers || window.PartyChairData.SITTING_MEMBERS || [];
  const generated = game?.generatedMembers || [];
  const members = MEMBERS || [];
  const standouts = Object.values(game?.stateLegStandouts || {}).flat();
  const overrides = game?.memberStatOverrides || {};
  return [...sitting, ...generated, ...members, ...standouts].map((m) => (overrides[m.id] ? { ...m, ...overrides[m.id] } : m));
}

const memberById = (id) => allCandidateRecords().find((m) => m.id === id || m.sittingId === id);
const template = () => PARTY_ARCHETYPES.find((party) => party.id === selectedTemplate) || PARTY_ARCHETYPES[0];
function templateForDisplay(id) { return PARTY_ARCHETYPES.find((party) => party.id === id)?.name || 'Independent'; }

function totalPlayerStateChapters() {
  const identity = playerIdentity();
  const stateMap = game.stateChapters || {};
  const fromStateMap = Object.values(stateMap).reduce((sum, v) => sum + Number(v || 0), 0);
  if (fromStateMap > 0) return fromStateMap;
  const fromOrgs = Object.values(game.stateOrganizations || {}).reduce((sum, rec) => sum + Number(rec[identity]?.chapters || 0), 0);
  if (fromOrgs > 0) return fromOrgs;
  return Object.values(game.chapters || {}).reduce((a, b) => a + b, 0);
}

function stateChaptersFor(stateId, partyId = playerIdentity()) {
  if (partyId === playerIdentity() && Number.isFinite(game.stateChapters?.[stateId])) {
    return game.stateChapters[stateId];
  }
  return game.stateOrganizations?.[stateId]?.[partyId]?.chapters ?? 0;
}

function stateOverlappingRegions(stateId) {
  const stateObj = STATES.find((s) => s.id === stateId);
  if (window.PartyChairData.getStateOverlappingRegions) {
    return window.PartyChairData.getStateOverlappingRegions(stateId, stateObj?.region);
  }
  if (V07?.regionsForState) return V07.regionsForState(stateId, stateObj?.region);
  return stateObj?.regions || (stateObj?.region ? [stateObj.region] : []);
}

function ratingDefinitions() {
  return window.PartyChairData.CANDIDATE_RATING_DEFINITIONS || (V07?.CANDIDATE_RATING_KEYS || []).map((k) => ({
    id: k.id,
    label: k.label,
    shortLabel: k.label,
    positive: k.positive,
    description: k.desc,
  }));
}

function statBarsMarkup(ratings = {}, compact = false) {
  const defs = ratingDefinitions();
  return `<div class="v07-stat-grid ${compact ? 'compact' : ''}">${defs.map((stat) => {
    const val = Math.max(1, Math.min(10, Number(ratings[stat.id] ?? 5)));
    const pct = val * 10;
    const isRisk = !stat.positive;
    const barColor = isRisk
      ? (val >= 7 ? '#e8887e' : val <= 3 ? '#75c89a' : '#e2bd70')
      : (val >= 8 ? '#75c89a' : val >= 5 ? 'hsl(174 36% 56%)' : '#e8887e');
    return `<div class="v07-stat-item" title="${safe(stat.description || '')}"><div class="v07-stat-row"><span>${safe(compact ? (stat.shortLabel || stat.label) : stat.label)}</span><b>${val}/10</b></div><div class="meter v07-stat-meter"><i style="width:${pct}%;--meter:${barColor}"></i></div></div>`;
  }).join('')}</div>`;
}

/* ==========================================================================
   VERSION 0.9 HELPERS: NET APPROVAL, FACTIONS, SENATE, PACs & DEMOGRAPHICS
   ========================================================================== */
function effectiveMemberFame(member = {}) {
  return Math.max(1, Math.min(100, Math.round(Number(member.fame ?? member.startingFame ?? 40))));
}

function effectiveMemberPopularity(member = {}) {
  if (member.popularity !== undefined && Number.isFinite(Number(member.popularity))) {
    return Math.max(1, Math.min(100, Math.round(Number(member.popularity))));
  }
  const base = Number.isFinite(Number(member.happiness))
    ? Number(member.happiness)
    : (52 + ((member.quality || 6) - 5) * 4 + ((member.ratings?.charisma || 5) - 5) * 2);
  return Math.max(15, Math.min(95, Math.round(base)));
}

function effectiveMemberNetApproval(member = {}) {
  if (member.netApproval !== undefined && Number.isFinite(Number(member.netApproval))) {
    return Math.round(Number(member.netApproval));
  }
  const pop = effectiveMemberPopularity(member);
  const fame = effectiveMemberFame(member);
  return Math.round((2 * pop) - fame);
}

// REQ-128: Candidate Traits Engine & 8-Trait Character System
const POLITICIAN_TRAITS_MAP = window.PartyChairData?.POLITICIAN_TRAITS_MAP || {"Jon Ossoff":["Rising Star","Polished","Media Darling"],"Gretchen Whitmer":["Polished","Prosecutorial Edge","Disciplined","Rising Star"],"Cory Booker":["Oratorical Phenom","Digital Native","Polished"],"Alexandria Ocasio-Cortez":["Grassroots Organizer","Digital Native","Floor Speech Maverick","Rising Star"],"Andy Beshear":["Prosecutorial Edge","Squeaky Clean","Bipartisan Dealmaker"],"Amy Klobuchar":["Prosecutorial Edge","Committee Workhorse","Disciplined"],"J. D. Vance":["Military Veteran","Floor Speech Maverick","Populist Firebrand"],"Nikki Haley":["Polished","Disciplined","Established Politician"],"Marco Rubio":["Sunday Show Fixture","Polished","Established Politician"],"Glenn Youngkin":["Self-Made Entrepreneur","Polished","Disciplined"],"Butch Ware":["Academic Theorist","Doctrinal Purist","Rough"],"Mike ter Maat":["Budget Hawk","Disciplined","Academic Theorist"],"Chase Oliver":["Grassroots Organizer","Digital Native","Rising Star"],"Jill Stein":["Doctrinal Purist","Grassroots Organizer","Established Politician"],"Kshama Sawant":["Grassroots Organizer","Populist Firebrand","Doctrinal Purist"],"Ajamu Baraka":["Grassroots Organizer","Doctrinal Purist","Rough"],"Randall Terry":["Backbench Agitator","Populist Firebrand","Undisciplined"],"Scott Bradley":["Academic Theorist","Disciplined","Doctrinal Purist"],"Claudia De la Cruz":["Grassroots Organizer","Populist Firebrand","Rising Star"],"Gloria La Riva":["Union Stalwart","Doctrinal Purist","Established Politician"],"Spike Cohen":["Digital Native","Floor Speech Maverick","Polished"],"Lisa Murkowski":["Dynastic Name","Bipartisan Dealmaker","Principled Contrarian"],"Mary Peltola":["Small-Town Pillar","Bipartisan Dealmaker","Squeaky Clean"],"Katie Britt":["Rising Star","Polished","Committee Workhorse"],"Tommy Tuberville":["Local Sports Legend","Rough","Undisciplined"],"John Boozman":["Small-Town Pillar","Committee Workhorse","Polished"],"Tom Cotton":["Military Veteran","Disciplined","Sunday Show Fixture"],"Mark Kelly":["Military Veteran","Squeaky Clean","Disciplined"],"Ruben Gallego":["Military Veteran","Rough","Rising Star"],"Adam Schiff":["Prosecutorial Edge","Polished","Committee Workhorse"],"Alex Padilla":["Machine Loyalist","Committee Workhorse","Statehouse Alum"],"John Hickenlooper":["Self-Made Entrepreneur","Bipartisan Dealmaker","Polished"],"Michael Bennet":["Quiet Diplomat","Budget Hawk","Cautious Deliberator"],"Chris Murphy":["Floor Speech Maverick","Quiet Diplomat","Disciplined"],"Richard Blumenthal":["Prosecutorial Edge","Committee Workhorse","Polished"],"Chris Coons":["Quiet Diplomat","Bipartisan Dealmaker","Disciplined"],"Lisa Blunt Rochester":["Small-Town Pillar","Committee Workhorse","Polished"],"Ashley Moody":["Prosecutorial Edge","Machine Loyalist","Polished"],"Rick Scott":["Self-Made Entrepreneur","Deep-Pocket Rolodex","Disciplined"],"Raphael Warnock":["Oratorical Phenom","Grassroots Organizer","Disciplined"],"Brian Schatz":["Quiet Diplomat","Digital Native","Disciplined"],"Mazie Hirono":["Union Stalwart","Floor Speech Maverick","Rough"],"Chuck Grassley":["Small-Town Pillar","Committee Workhorse","Established Politician"],"Josh Turek":["Local Sports Legend","Grassroots Organizer","Rising Star"],"Jim Risch":["Prosecutorial Edge","Quiet Diplomat","Disciplined"],"Mike Crapo":["Budget Hawk","Committee Workhorse","Disciplined"],"Juliana Stratton":["Established Politician"],"Tammy Duckworth":["Military Veteran","Floor Speech Maverick","Disciplined"],"Jim Banks":["Military Veteran","Disciplined","Statehouse Alum"],"Todd Young":["Military Veteran","Quiet Diplomat","Disciplined"],"Adam Hamilton":["Established Politician","Disciplined"],"Jerry Moran":["Small-Town Pillar","Committee Workhorse","Disciplined"],"Andy Barr":["K-Street Veteran","Budget Hawk","Polished"],"Rand Paul":["Principled Contrarian","Budget Hawk","Rough"],"Bill Cassidy":["Quiet Diplomat","Bipartisan Dealmaker","Disciplined"],"John Kennedy":["Rough","Sunday Show Fixture","Gaffe Prone"],"Ed Markey":["Grassroots Organizer","Floor Speech Maverick","Established Politician"],"Elizabeth Warren":["Academic Theorist","Committee Workhorse","Populist Firebrand"],"Angela Alsobrooks":["Prosecutorial Edge","Rising Star","Polished"],"Chris Van Hollen":["Quiet Diplomat","Committee Workhorse","Disciplined"],"Angus King":["Quiet Diplomat","Bipartisan Dealmaker","Squeaky Clean"],"Troy Jackson":["Union Stalwart","Rough","Small-Town Pillar"],"Elissa Slotkin":["Military Veteran","Disciplined","Rising Star"],"Haley Stevens":["Union Stalwart","Committee Workhorse","Polished"],"Angie Craig":["Established Politician","Polished"],"Eric Schmitt":["Rising Star","Polished"],"Josh Hawley":["Prosecutorial Edge","Floor Speech Maverick","Sunday Show Fixture"],"Roger Wicker":["Military Veteran","Committee Workhorse","Disciplined"],"Scott Colom":["Squeaky Clean","Established Politician","Rough"],"Steve Daines":["Self-Made Entrepreneur","Sunday Show Fixture","Disciplined"],"Tim Sheehy":["Military Veteran","Self-Made Entrepreneur","Rising Star"],"Roy Cooper":["Prosecutorial Edge","Quiet Diplomat","Statehouse Alum"],"Ted Budd":["Small-Town Pillar","Budget Hawk","Disciplined"],"John Hoeven":["Self-Made Entrepreneur","Quiet Diplomat","Disciplined"],"Kevin Cramer":["Sunday Show Fixture","Rough","Established Politician"],"Deb Fischer":["Small-Town Pillar","Committee Workhorse","Cautious Deliberator"],"Pete Ricketts":["Self-Made Entrepreneur","Deep-Pocket Rolodex","Machine Loyalist"],"Chris Pappas":["Established Politician"],"Maggie Hassan":["Prosecutorial Edge","Committee Workhorse","Statehouse Alum"],"Andy Kim":["Quiet Diplomat","Grassroots Organizer","Squeaky Clean"],"Ben Ray Lujan":["Machine Loyalist","Committee Workhorse","Statehouse Alum"],"Martin Heinrich":["Academic Theorist","Quiet Diplomat","Polished"],"Catherine Cortez Masto":["Prosecutorial Edge","Quiet Diplomat","Disciplined"],"Jacky Rosen":["Digital Native","Bipartisan Dealmaker","Disciplined"],"Chuck Schumer":["Machine Loyalist","Sunday Show Fixture","Established Politician"],"Kirsten Gillibrand":["Committee Workhorse","Disciplined","Polished"],"Bernie Moreno":["Self-Made Entrepreneur","Deep-Pocket Rolodex","Polished"],"Sherrod Brown":["Union Stalwart","Rough","Relentless Door-Knocker"],"James Lankford":["Committee Workhorse","Bipartisan Dealmaker","Disciplined"],"Markwayne Mullin":["Local Sports Legend","Rough","Undisciplined"],"Jeff Merkley":["Grassroots Organizer","Committee Workhorse","Statehouse Alum"],"Ron Wyden":["Committee Workhorse","Digital Native","Disciplined"],"Dave McCormick":["Military Veteran","Self-Made Entrepreneur","Deep-Pocket Rolodex"],"John Fetterman":["Rough","Populist Firebrand","Principled Contrarian"],"Jack Reed":["Military Veteran","Quiet Diplomat","Cautious Deliberator"],"Sheldon Whitehouse":["Prosecutorial Edge","Floor Speech Maverick","Academic Theorist"],"Annie Andrews":["Squeaky Clean","Established Politician","Rough"],"Tim Scott":["Oratorical Phenom","Charismatic Fundraiser","Polished"],"John Thune":["Machine Loyalist","Quiet Diplomat","Disciplined"],"Mike Rounds":["Small-Town Pillar","Quiet Diplomat","Statehouse Alum"],"Bill Hagerty":["Self-Made Entrepreneur","K-Street Veteran","Disciplined"],"Marsha Blackburn":["Sunday Show Fixture","Floor Speech Maverick","Disciplined"],"James Talarico":["Established Politician","Polished"],"Ted Cruz":["Prosecutorial Edge","Floor Speech Maverick","Sunday Show Fixture"],"John Curtis":["Established Politician","Polished"],"Mike Lee":["Academic Theorist","Budget Hawk","Principled Contrarian"],"Mark Warner":["Self-Made Entrepreneur","Bipartisan Dealmaker","Deep-Pocket Rolodex"],"Tim Kaine":["Quiet Diplomat","Small-Town Pillar","Statehouse Alum"],"Bernie Sanders":["Grassroots Organizer","Populist Firebrand","Doctrinal Purist"],"Peter Welch":["Quiet Diplomat","Committee Workhorse","Statehouse Alum"],"Maria Cantwell":["Committee Workhorse","Digital Native","Statehouse Alum"],"Patty Murray":["Committee Workhorse","Grassroots Organizer","Disciplined"],"Ron Johnson":["Self-Made Entrepreneur","Floor Speech Maverick","Rough"],"Tammy Baldwin":["Grassroots Organizer","Committee Workhorse","Statehouse Alum"],"Jim Justice":["Self-Made Entrepreneur","Rough","Teflon Brand"],"Shelley Moore Capito":["Dynastic Name","Bipartisan Dealmaker","Statehouse Alum"],"Harriet Hageman":["Established Politician","Polished"],"John Barrasso":["Sunday Show Fixture","Machine Loyalist","Statehouse Alum"],"Click Bishop":["Squeaky Clean","Established Politician"],"Sarah Huckabee Sanders":["Rising Star","Rough"],"Katie Hobbs":["Grassroots Organizer","Quiet Diplomat","Statehouse Alum"],"Eleni Kounalakis":["Established Politician"],"Phil Weiser":["Squeaky Clean","Established Politician","Polished"],"Ned Lamont":["Established Politician","Polished"],"Matt Meyer":["Squeaky Clean","Established Politician"],"Byron Donalds":["Rising Star","Polished"],"Keisha Lance Bottoms":["Squeaky Clean","Established Politician","Polished"],"Josh Green":["Squeaky Clean","Polished"],"Rob Sand":["Prosecutorial Edge","Squeaky Clean","Media Darling"],"Brad Little":["Established Politician","Disciplined"],"JB Pritzker":["Self-Made Entrepreneur","Deep-Pocket Rolodex","Polished"],"Mike Braun":["Established Politician","Disciplined"],"Sharice Davids":["Squeaky Clean","Established Politician","Polished"],"Jeff Landry":["Rough","Undisciplined"],"Maura Healey":["Rising Star","Polished"],"Wes Moore":["Military Veteran","Oratorical Phenom","Rising Star"],"Shenna Bellows":["Rough","Disciplined"],"Jocelyn Benson":[],"Tim Walz":["Military Veteran","Union Stalwart","Rough"],"Mike Kehoe":["Squeaky Clean","Established Politician","Rough"],"Tate Reeves":["Established Politician","Disciplined"],"Greg Gianforte":["Rough","Established Politician"],"Josh Stein":["Squeaky Clean","Established Politician","Polished"],"Kelly Armstrong":["Squeaky Clean","Established Politician"],"Jim Pillen":["Rough"],"Kelly Ayotte":["Established Politician","Polished"],"Mikie Sherrill":["Rising Star","Polished"],"Deb Haaland":["Established Politician","Disciplined"],"Aaron Ford":["Polished","Disciplined"],"Kathy Hochul":["Established Politician","Polished"],"Amy Acton":["Squeaky Clean","Established Politician"],"Gentner Drummond":["Established Politician","Polished"],"Tina Kotek":["Disciplined","Polished"],"Josh Shapiro":["Prosecutorial Edge","Polished","Statehouse Alum"],"Dan McKee":["Established Politician","Disciplined"],"Alan Wilson":["Established Politician","Rough"],"Larry Rhoden":["Squeaky Clean","Established Politician","Polished"],"Gina Hinojosa":["Established Politician"],"Spencer Cox":["Small-Town Pillar","Bipartisan Dealmaker","Squeaky Clean"],"Abigail Spanberger":["Rising Star","Polished","Disciplined"],"Phil Scott":["Small-Town Pillar","Bipartisan Dealmaker","Teflon Brand"],"Bob Ferguson":["Disciplined","Polished"],"Mandela Barnes":["Polished"],"Patrick Morrisey":["Squeaky Clean","Undisciplined"],"Chuck Gray":["Squeaky Clean","Established Politician","Rough"],"AK-1":["Small-Town Pillar","Bipartisan Dealmaker","Squeaky Clean"],"AL-1":["Polished"],"AL-2":["Established Politician","Polished"],"AL-3":["Established Politician","Disciplined"],"AL-4":["Polished","Disciplined"],"AL-5":["Rough","Undisciplined"],"AL-6":["Squeaky Clean","Rough"],"AL-7":["Rough","Undisciplined"],"AR-1":["Squeaky Clean","Polished"],"AR-2":["Squeaky Clean"],"AR-3":["Undisciplined"],"AR-4":["Rough"],"AZ-1":["Polished"],"AZ-2":["Polished","Disciplined"],"AZ-3":["Squeaky Clean","Polished"],"AZ-4":["Established Politician","Polished"],"AZ-5":["Squeaky Clean","Polished"],"AZ-6":["Established Politician"],"AZ-7":["Established Politician"],"AZ-8":["Rough"],"AZ-9":["Rough","Undisciplined"],"CA-1":["Undisciplined"],"CA-2":["Disciplined"],"CA-3":["Squeaky Clean","Rough"],"CA-4":["Polished"],"CA-5":["Rough"],"CA-6":["Disciplined"],"CA-7":["Disciplined"],"CA-8":["Polished","Disciplined"],"CA-9":["Established Politician","Rough"],"CA-10":["Squeaky Clean","Polished"],"CA-11":["Machine Loyalist","Deep-Pocket Rolodex","Committee Workhorse"],"CA-12":["Rough"],"CA-13":["Established Politician","Polished"],"CA-14":["Rough","Undisciplined"],"CA-15":["Established Politician","Polished"],"CA-16":["Squeaky Clean","Disciplined"],"CA-17":["Rising Star","Polished"],"CA-18":["Squeaky Clean","Polished"],"CA-19":["Polished"],"CA-20":["Rough"],"CA-21":["Rough"],"CA-22":["Squeaky Clean","Disciplined"],"CA-23":["Rough"],"CA-24":["Disciplined"],"CA-25":["Rough"],"CA-26":["Rough"],"CA-27":["Rough"],"CA-28":["Established Politician"],"CA-29":["Squeaky Clean"],"CA-30":["Squeaky Clean","Undisciplined"],"CA-31":["Established Politician"],"CA-32":["Squeaky Clean","Established Politician"],"CA-33":["Disciplined","Established Politician"],"CA-34":[],"CA-35":["Polished"],"CA-36":["Polished","Established Politician"],"CA-37":["Disciplined"],"CA-38":["Polished"],"CA-39":["Squeaky Clean","Polished"],"CA-40":["Squeaky Clean"],"CA-41":["Squeaky Clean","Disciplined"],"CA-42":["Squeaky Clean","Established Politician","Rough"],"CA-43":["Established Politician","Rough"],"CA-44":[],"CA-45":["Polished","Disciplined"],"CA-46":["Rough","Disciplined"],"CA-47":["Rough","Disciplined"],"CA-48":["Squeaky Clean","Rough"],"CA-49":["Disciplined"],"CA-50":["Rough","Undisciplined"],"CA-51":["Squeaky Clean","Disciplined"],"CA-52":["Rough","Undisciplined"],"CO-1":["Squeaky Clean"],"CO-2":["Squeaky Clean","Rough"],"CO-3":["Rough"],"CO-4":["Squeaky Clean","Established Politician","Rough"],"CO-5":["Rough"],"CO-6":["Squeaky Clean","Rough"],"CO-7":["Squeaky Clean"],"CO-8":["Squeaky Clean","Polished"],"CT-1":["Squeaky Clean","Disciplined"],"CT-2":["Rough"],"CT-3":["Established Politician","Rough"],"CT-4":["Squeaky Clean","Rough"],"CT-5":["Squeaky Clean","Polished"],"DE-1":["Polished"],"FL-1":["Squeaky Clean","Disciplined"],"FL-2":["Squeaky Clean"],"FL-3":["Polished"],"FL-4":["Rough"],"FL-5":["Rough"],"FL-6":["Squeaky Clean","Established Politician","Rough"],"FL-7":["Established Politician"],"FL-8":["Rough"],"FL-9":["Rough","Undisciplined"],"FL-10":["Rising Star","Rough"],"FL-11":["Rough"],"FL-12":["Squeaky Clean","Polished"],"FL-13":["Rising Star","Rough"],"FL-14":["Squeaky Clean"],"FL-15":["Established Politician"],"FL-16":["Squeaky Clean"],"FL-17":["Squeaky Clean","Polished"],"FL-18":["Squeaky Clean","Undisciplined"],"FL-19":["Squeaky Clean"],"FL-20":["Rough"],"FL-21":["Established Politician","Disciplined"],"FL-22":["Disciplined"],"FL-23":["Polished"],"FL-24":["Established Politician"],"FL-25":["Squeaky Clean","Polished"],"FL-26":["Disciplined"],"FL-27":["Disciplined"],"FL-28":["Squeaky Clean","Rough"],"GA-1":["Polished","Disciplined"],"GA-2":["Established Politician","Disciplined"],"GA-3":["Established Politician"],"GA-4":["Rough"],"GA-5":["Polished","Disciplined"],"GA-6":["Rough"],"GA-7":["Polished"],"GA-8":["Polished"],"GA-9":["Undisciplined"],"GA-10":["Established Politician"],"GA-11":["Polished","Disciplined"],"GA-12":["Squeaky Clean"],"GA-13":["Polished"],"GA-14":["Squeaky Clean"],"HI-1":["Rough"],"HI-2":[],"IA-1":["Rough"],"IA-2":[],"IA-3":["Established Politician","Polished"],"IA-4":["Rough","Undisciplined"],"ID-1":["Polished","Disciplined"],"ID-2":["Polished","Disciplined"],"IL-1":["Squeaky Clean"],"IL-2":["Disciplined"],"IL-3":["Established Politician"],"IL-4":["Established Politician"],"IL-5":["Disciplined"],"IL-6":["Squeaky Clean","Polished"],"IL-7":[],"IL-8":["Polished","Disciplined"],"IL-9":["Squeaky Clean","Rough"],"IL-10":["Squeaky Clean","Established Politician","Polished"],"IL-11":["Rough"],"IL-12":["Established Politician","Disciplined"],"IL-13":["Squeaky Clean","Disciplined"],"IL-14":["Rising Star","Polished"],"IL-15":["Polished","Disciplined"],"IL-16":["Polished"],"IL-17":["Established Politician"],"IN-1":["Squeaky Clean","Established Politician"],"IN-2":[],"IN-3":["Polished","Disciplined"],"IN-4":["Polished"],"IN-5":["Rough"],"IN-6":["Rough"],"IN-7":["Squeaky Clean"],"IN-8":["Rough","Undisciplined"],"IN-9":["Squeaky Clean","Disciplined"],"KS-1":["Established Politician"],"KS-2":["Established Politician","Polished"],"KS-3":["Rough"],"KS-4":["Rough","Undisciplined"],"KY-1":["Polished"],"KY-2":["Rough"],"KY-3":["Squeaky Clean","Polished"],"KY-4":["Principled Contrarian","Budget Hawk","Rough"],"KY-5":["Established Politician","Disciplined"],"KY-6":["Polished"],"LA-1":["Established Politician","Disciplined"],"LA-2":["Rough"],"LA-3":["Rough","Undisciplined"],"LA-4":["Disciplined","Polished"],"LA-5":["Rough"],"LA-6":["Squeaky Clean","Rough"],"MA-1":["Rough"],"MA-2":["Squeaky Clean","Rough"],"MA-3":["Disciplined"],"MA-4":["Squeaky Clean","Polished"],"MA-5":["Disciplined","Established Politician"],"MA-6":["Rough"],"MA-7":["Rough"],"MA-8":["Rough","Undisciplined"],"MA-9":["Established Politician"],"MD-1":["Squeaky Clean","Rough"],"MD-2":["Polished","Disciplined"],"MD-3":["Rough","Disciplined"],"MD-4":["Squeaky Clean","Polished"],"MD-5":["Established Politician"],"MD-6":["Rough"],"MD-7":["Polished"],"MD-8":["Academic Theorist","Floor Speech Maverick","Prosecutorial Edge"],"ME-1":["Squeaky Clean","Polished"],"ME-2":["Military Veteran","Principled Contrarian","Rough"],"MI-1":["Established Politician"],"MI-2":["Squeaky Clean","Polished"],"MI-3":["Disciplined"],"MI-4":["Undisciplined"],"MI-5":["Squeaky Clean","Polished"],"MI-6":["Polished","Disciplined"],"MI-7":["Squeaky Clean","Established Politician","Rough"],"MI-8":["Polished","Disciplined"],"MI-9":["Squeaky Clean","Rough"],"MI-10":["Squeaky Clean","Disciplined"],"MI-11":["Rough"],"MI-12":["Rough","Undisciplined"],"MI-13":["Squeaky Clean","Rough"],"MN-1":["Established Politician"],"MN-2":[],"MN-3":["Polished","Disciplined"],"MN-4":["Polished"],"MN-5":["Rough","Undisciplined"],"MN-6":["Squeaky Clean"],"MN-7":["Rough"],"MN-8":["Rough"],"MO-1":["Squeaky Clean","Rough"],"MO-2":["Polished","Disciplined"],"MO-3":["Squeaky Clean","Polished"],"MO-4":["Rough"],"MO-5":["Established Politician"],"MO-6":["Squeaky Clean","Polished"],"MO-7":["Polished"],"MO-8":["Disciplined"],"MS-1":["Disciplined"],"MS-2":["Polished","Disciplined"],"MS-3":["Squeaky Clean","Polished"],"MS-4":["Squeaky Clean","Rough"],"MT-1":["Rough","Undisciplined"],"MT-2":["Rough"],"NC-1":["Disciplined"],"NC-2":["Rough"],"NC-3":["Rough"],"NC-4":["Squeaky Clean","Polished"],"NC-5":["Disciplined"],"NC-6":["Polished"],"NC-7":["Rough"],"NC-8":["Rough"],"NC-9":["Squeaky Clean","Polished"],"NC-10":["Rough"],"NC-11":["Rough"],"NC-12":["Squeaky Clean","Rough"],"NC-13":["Rough"],"NC-14":["Undisciplined"],"ND-1":["Squeaky Clean","Rough"],"NE-1":["Established Politician","Disciplined"],"NE-2":["Squeaky Clean","Rough"],"NE-3":["Established Politician"],"NH-1":["Squeaky Clean","Rough"],"NH-2":["Rough"],"NJ-1":["Polished","Disciplined"],"NJ-2":["Squeaky Clean","Rough"],"NJ-3":["Squeaky Clean","Established Politician","Polished"],"NJ-4":["Polished"],"NJ-5":["Squeaky Clean","Polished"],"NJ-6":["Rough"],"NJ-7":["Squeaky Clean","Rough"],"NJ-8":["Squeaky Clean","Rough"],"NJ-9":["Polished"],"NJ-10":["Squeaky Clean","Rough"],"NJ-11":["Rough"],"NJ-12":["Rough","Disciplined"],"NM-1":["Squeaky Clean","Established Politician","Polished"],"NM-2":["Squeaky Clean","Rough"],"NM-3":["Disciplined"],"NV-1":["Rough"],"NV-2":["Disciplined"],"NV-3":["Squeaky Clean","Disciplined"],"NV-4":[],"NY-1":["Established Politician"],"NY-2":["Polished"],"NY-3":["Squeaky Clean","Polished"],"NY-4":["Squeaky Clean","Polished"],"NY-5":["Rough"],"NY-6":["Undisciplined"],"NY-7":["Squeaky Clean","Rough"],"NY-8":["Oratorical Phenom","Machine Loyalist","Polished"],"NY-9":["Rough"],"NY-10":["Polished"],"NY-11":["Rough","Disciplined"],"NY-12":["Rough"],"NY-13":["Rough"],"NY-14":["Grassroots Organizer","Digital Native","Floor Speech Maverick","Rising Star"],"NY-15":["Polished","Disciplined"],"NY-16":["Rough"],"NY-17":["Squeaky Clean","Rough"],"NY-18":["Rising Star","Polished"],"NY-19":["Squeaky Clean","Established Politician"],"NY-20":["Polished"],"NY-21":["Rough"],"NY-22":["Polished","Disciplined"],"NY-23":["Established Politician"],"NY-24":["Rough","Undisciplined"],"NY-25":["Rough"],"NY-26":["Squeaky Clean","Polished"],"OH-1":["Rough","Disciplined"],"OH-2":["Rough","Undisciplined"],"OH-3":["Rough"],"OH-4":["Floor Speech Maverick","Backbench Agitator","Rough"],"OH-5":["Squeaky Clean","Rough"],"OH-6":["Squeaky Clean","Polished"],"OH-7":["Rough","Undisciplined"],"OH-8":["Squeaky Clean","Disciplined"],"OH-9":["Established Politician","Disciplined"],"OH-10":["Rough"],"OH-11":["Polished","Disciplined"],"OH-12":["Rough","Disciplined"],"OH-13":["Rough","Undisciplined"],"OH-14":["Squeaky Clean","Established Politician"],"OH-15":["Rough","Undisciplined"],"OK-1":["Squeaky Clean","Rough"],"OK-2":["Polished","Disciplined"],"OK-3":["Rough"],"OK-4":["Rough"],"OK-5":["Rough","Disciplined"],"OR-1":["Disciplined"],"OR-2":[],"OR-3":["Polished"],"OR-4":["Rough"],"OR-5":["Polished","Disciplined"],"OR-6":["Rough","Disciplined"],"PA-1":["Established Politician","Polished"],"PA-2":["Disciplined"],"PA-3":["Squeaky Clean"],"PA-4":["Squeaky Clean","Undisciplined"],"PA-5":["Squeaky Clean","Disciplined"],"PA-6":["Established Politician","Disciplined"],"PA-7":["Squeaky Clean","Rough"],"PA-8":["Union Stalwart","Prosecutorial Edge","Bipartisan Dealmaker"],"PA-9":["Rough"],"PA-10":["Rough","Disciplined"],"PA-11":["Squeaky Clean","Established Politician"],"PA-12":["Rough","Disciplined"],"PA-13":["Rough"],"PA-14":["Squeaky Clean","Polished"],"PA-15":["Squeaky Clean","Polished"],"PA-16":["Squeaky Clean","Polished"],"PA-17":["Squeaky Clean","Polished"],"RI-1":["Undisciplined"],"RI-2":["Squeaky Clean","Polished"],"SC-1":["Rough"],"SC-2":["Disciplined"],"SC-3":["Polished"],"SC-4":["Squeaky Clean","Established Politician","Rough"],"SC-5":["Squeaky Clean"],"SC-6":["Established Politician","Disciplined"],"SC-7":["Squeaky Clean","Polished"],"SD-1":["Squeaky Clean","Polished"],"TN-1":["Squeaky Clean","Rough"],"TN-2":["Squeaky Clean","Rough"],"TN-3":["Squeaky Clean","Rough"],"TN-4":[],"TN-5":["Undisciplined"],"TN-6":["Squeaky Clean","Polished"],"TN-7":["Established Politician"],"TN-8":["Polished"],"TN-9":["Established Politician","Rough"],"TX-1":["Squeaky Clean","Rough"],"TX-2":["Disciplined"],"TX-3":["Squeaky Clean"],"TX-4":["Established Politician","Polished"],"TX-5":["Squeaky Clean","Polished"],"TX-6":["Established Politician","Disciplined"],"TX-7":["Rough","Disciplined"],"TX-8":["Polished","Disciplined"],"TX-9":["Polished","Disciplined"],"TX-10":["Established Politician"],"TX-11":["Squeaky Clean"],"TX-12":["Polished"],"TX-13":["Squeaky Clean","Established Politician","Rough"],"TX-14":["Rough","Undisciplined"],"TX-15":["Rough"],"TX-16":["Rough"],"TX-17":["Rough"],"TX-18":["Rough"],"TX-19":["Squeaky Clean"],"TX-20":["Rough","Undisciplined"],"TX-21":["Budget Hawk","Backbench Agitator","Doctrinal Purist"],"TX-22":["Polished"],"TX-23":["Polished","Disciplined"],"TX-24":["Rough"],"TX-25":["Squeaky Clean","Polished"],"TX-26":["Squeaky Clean","Rough"],"TX-27":["Polished"],"TX-28":["Established Politician"],"TX-29":["Rough"],"TX-30":["Squeaky Clean","Rough"],"TX-31":["Squeaky Clean","Undisciplined"],"TX-32":["Squeaky Clean","Rough"],"TX-33":["Squeaky Clean","Polished"],"TX-34":["Squeaky Clean","Polished"],"TX-35":["Established Politician","Polished"],"TX-36":["Squeaky Clean","Rough"],"TX-37":["Rough","Undisciplined"],"TX-38":["Squeaky Clean","Rough"],"UT-1":["Established Politician","Polished"],"UT-2":["Rough"],"UT-3":["Rough"],"UT-4":["Squeaky Clean","Polished"],"VA-1":["Established Politician"],"VA-2":["Squeaky Clean","Rough"],"VA-3":["Established Politician","Rough"],"VA-4":["Squeaky Clean","Rough"],"VA-5":["Rough"],"VA-6":["Squeaky Clean","Polished"],"VA-7":["Squeaky Clean","Polished"],"VA-8":["Polished","Disciplined"],"VA-9":["Rough"],"VA-10":["Undisciplined"],"VA-11":[],"VT-1":["Polished","Disciplined"],"WA-1":["Squeaky Clean","Polished"],"WA-2":["Rough"],"WA-3":["Rough","Rising Star"],"WA-4":["Squeaky Clean"],"WA-5":["Polished"],"WA-6":["Squeaky Clean"],"WA-7":["Grassroots Organizer","Doctrinal Purist","Floor Speech Maverick"],"WA-8":["Disciplined"],"WA-9":["Squeaky Clean"],"WA-10":["Undisciplined"],"WI-1":["Squeaky Clean","Polished"],"WI-2":["Rough"],"WI-3":["Polished"],"WI-4":["Established Politician","Disciplined"],"WI-5":["Squeaky Clean","Rough"],"WI-6":["Established Politician"],"WI-7":["Polished"],"WI-8":["Rough"],"WV-1":["Established Politician","Polished"],"WV-2":["Squeaky Clean","Polished"],"WY-1":["Rough"],"Lindsey Graham":["Sunday Show Fixture","Prosecutorial Edge","Kingmaker Conduit"],"John Cornyn":["Prosecutorial Edge","Machine Loyalist","Disciplined"],"Mitt Romney":["Self-Made Entrepreneur","Principled Contrarian","Polished"],"Cynthia Lummis":["Small-Town Pillar","Budget Hawk","Statehouse Alum"],"Ron DeSantis":["Military Veteran","Prosecutorial Edge","Disciplined"],"Brian Kemp":["Small-Town Pillar","Machine Loyalist","Statehouse Alum"],"Tony Evers":["Academic Theorist","Quiet Diplomat","Squeaky Clean"],"Jared Polis":["Self-Made Entrepreneur","Digital Native","Bipartisan Dealmaker"],"Mike DeWine":["Small-Town Pillar","Prosecutorial Edge","Statehouse Alum"],"Greg Abbott":["Prosecutorial Edge","Machine Loyalist","Established Politician"],"Gavin Newsom":["Oratorical Phenom","Polished","Digital Native"],"Joe Lombardo":["Small-Town Pillar","Disciplined","Bipartisan Dealmaker"],"Eric Holcomb":["Military Veteran","Bipartisan Dealmaker","Disciplined"],"Ken Paxton":["Prosecutorial Edge","Rough","Backbench Agitator"],"Nancy Pelosi":["Machine Loyalist","Deep-Pocket Rolodex","Committee Workhorse"],"Hakeem Jeffries":["Oratorical Phenom","Machine Loyalist","Polished"],"Steve Scalise":["Machine Loyalist","Sunday Show Fixture","Statehouse Alum"],"Jim Jordan":["Floor Speech Maverick","Backbench Agitator","Statehouse Alum"],"Jamie Raskin":["Academic Theorist","Floor Speech Maverick","Statehouse Alum"],"Pramila Jayapal":["Grassroots Organizer","Doctrinal Purist","Statehouse Alum"],"Ro Khanna":["Academic Theorist","Digital Native","Bipartisan Dealmaker"],"Thomas Massie":["Principled Contrarian","Budget Hawk","Rough"],"Chip Roy":["Budget Hawk","Backbench Agitator","Doctrinal Purist"],"Matt Gaetz":["Backbench Agitator","Floor Speech Maverick","Statehouse Alum"],"Marjorie Taylor Greene":["Backbench Agitator","Populist Firebrand","Undisciplined"],"Jared Golden":["Military Veteran","Principled Contrarian","Relentless Door-Knocker"],"Matt Cartwright":["Union Stalwart","Prosecutorial Edge","Bipartisan Dealmaker"],"Marcy Kaptur":["Union Stalwart","Small-Town Pillar","Relentless Door-Knocker"],"Don Bacon":["Military Veteran","Bipartisan Dealmaker","Cautious Deliberator"],"Tony Gonzales":["Military Veteran","Bipartisan Dealmaker","Disciplined"],"Scott Perry":["Military Veteran","Budget Hawk","Backbench Agitator"],"Lauren Boebert":["Backbench Agitator","Populist Firebrand","Undisciplined"],"Ilhan Omar":["Grassroots Organizer","Populist Firebrand","Statehouse Alum"],"Rashida Tlaib":["Grassroots Organizer","Union Stalwart","Statehouse Alum"],"senate:AL:class-2":["Local Sports Legend","Rough","Undisciplined"],"senate:AL:class-3":["Rising Star","Polished","Committee Workhorse"],"senate:AK:class-3":["Dynastic Name","Bipartisan Dealmaker","Principled Contrarian"],"senate:AZ:class-3":["Military Veteran","Squeaky Clean","Disciplined"],"senate:AZ:class-1":["Military Veteran","Rough","Rising Star"],"senate:AR:class-2":["Military Veteran","Disciplined","Sunday Show Fixture"],"senate:CA:class-1":["Prosecutorial Edge","Polished","Committee Workhorse"],"senate:CT:class-1":["Floor Speech Maverick","Quiet Diplomat","Disciplined"],"senate:FL:class-3":["Sunday Show Fixture","Polished","Established Politician"],"senate:FL:class-1":["Self-Made Entrepreneur","Deep-Pocket Rolodex","Disciplined"],"senate:GA:class-2":["Rising Star","Polished","Floor Speech Maverick"],"senate:GA:class-3":["Oratorical Phenom","Grassroots Organizer","Disciplined"],"senate:IN:class-3":["Military Veteran","Quiet Diplomat","Disciplined"],"senate:IA:class-3":["Small-Town Pillar","Committee Workhorse","Established Politician"],"senate:KY:class-3":["Principled Contrarian","Budget Hawk","Rough"],"senate:LA:class-3":["Rough","Sunday Show Fixture","Gaffe Prone"],"senate:ME:class-1":["Quiet Diplomat","Bipartisan Dealmaker","Squeaky Clean"],"senate:MA:class-1":["Academic Theorist","Committee Workhorse","Populist Firebrand"],"senate:MI:class-1":["Military Veteran","Disciplined","Rising Star"],"senate:MN:class-1":["Prosecutorial Edge","Committee Workhorse","Disciplined"],"senate:MO:class-1":["Prosecutorial Edge","Floor Speech Maverick","Sunday Show Fixture"],"senate:NJ:class-2":["Oratorical Phenom","Digital Native","Polished"],"senate:NY:class-3":["Machine Loyalist","Sunday Show Fixture","Established Politician"],"senate:NY:class-1":["Committee Workhorse","Disciplined","Polished"],"senate:OH:class-1":["Union Stalwart","Rough","Disciplined"],"senate:OH:class-3":["Military Veteran","Floor Speech Maverick","Populist Firebrand"],"senate:PA:class-3":["Rough","Populist Firebrand","Principled Contrarian"],"senate:TX:class-1":["Prosecutorial Edge","Floor Speech Maverick","Sunday Show Fixture"],"senate:VT:class-1":["Grassroots Organizer","Populist Firebrand","Doctrinal Purist"],"senate:WV:class-1":["Self-Made Entrepreneur","Rough","Teflon Brand"],"governor:MI":["Polished","Prosecutorial Edge","Disciplined","Rising Star"],"governor:KY":["Prosecutorial Edge","Squeaky Clean","Bipartisan Dealmaker"],"governor:PA":["Prosecutorial Edge","Polished","Bipartisan Dealmaker"],"governor:FL":["Military Veteran","Prosecutorial Edge","Disciplined"],"governor:VA":["Self-Made Entrepreneur","Polished","Disciplined"],"governor:GA":["Small-Town Pillar","Machine Loyalist","Disciplined"],"governor:VT":["Small-Town Pillar","Bipartisan Dealmaker","Teflon Brand"],"governor:UT":["Small-Town Pillar","Bipartisan Dealmaker","Squeaky Clean"],"governor:MD":["Military Veteran","Oratorical Phenom","Rising Star"],"governor:WI":["Academic Theorist","Quiet Diplomat","Squeaky Clean"],"governor:IL":["Self-Made Entrepreneur","Deep-Pocket Rolodex","Polished"],"governor:CO":["Self-Made Entrepreneur","Digital Native","Bipartisan Dealmaker"],"governor:OH":["Small-Town Pillar","Prosecutorial Edge","Established Politician"],"governor:TX":["Prosecutorial Edge","Machine Loyalist","Established Politician"],"governor:CA":["Oratorical Phenom","Polished","Digital Native"],"governor:MN":["Military Veteran","Union Stalwart","Rough"],"house:NY-14":["Grassroots Organizer","Digital Native","Floor Speech Maverick","Rising Star"],"house:AK-1":["Small-Town Pillar","Bipartisan Dealmaker","Squeaky Clean"],"house:OH-4":["Floor Speech Maverick","Backbench Agitator","Rough"],"house:MD-8":["Academic Theorist","Floor Speech Maverick","Prosecutorial Edge"],"house:KY-4":["Principled Contrarian","Budget Hawk","Rough"],"house:TX-21":["Budget Hawk","Backbench Agitator","Doctrinal Purist"],"house:WA-7":["Grassroots Organizer","Doctrinal Purist","Floor Speech Maverick"],"house:ME-2":["Military Veteran","Principled Contrarian","Rough"],"house:PA-8":["Union Stalwart","Prosecutorial Edge","Bipartisan Dealmaker"],"house:CA-11":["Machine Loyalist","Deep-Pocket Rolodex","Committee Workhorse"],"house:NY-8":["Oratorical Phenom","Machine Loyalist","Polished"],"Bob Menendez":["Established Politician","Undisciplined","K-Street Veteran"]};
if (window.PartyChairData) window.PartyChairData.POLITICIAN_TRAITS_MAP = POLITICIAN_TRAITS_MAP;

function getPoliticianTraits(member) {
  if (!member) return [];
  if (Array.isArray(member.traits) && member.traits.length) return member.traits;
  const name = member.name || member.id;
  if (POLITICIAN_TRAITS_MAP[name]) return POLITICIAN_TRAITS_MAP[name];
  if (POLITICIAN_TRAITS_MAP[member.id]) return POLITICIAN_TRAITS_MAP[member.id];
  return [];
}

function traitChipClass(trait) {
  const t = String(trait).toLowerCase().trim().replace(/\s+/g, '-');
  return `v14-trait-chip v14-trait-${t}`;
}

function getPoliticianTraitDescription(trait) {
  if (!trait) return '';
  const reg = window.PartyChairData?.EXPANDED_POLITICIAN_TRAITS_REGISTRY;
  if (reg && reg[trait] && reg[trait].description) return reg[trait].description;
  return trait;
}

function politicianTraitsBadgesMarkup(member) {
  if (!member) return '';
  const traits = getPoliticianTraits(member);
  if (!traits.length) return '';
  return `<span class="v14-traits-container">${traits.map((t) => `<span class="${traitChipClass(t)}" title="${safe(getPoliticianTraitDescription(t))}">${safe(t)}</span>`).join('')}</span>`;
}

// REQ-50 & REQ-128 & REQ-167: Politician Faction Badge + Net Approval + Popularity + Fame + Traits
function memberMetricsBadgesMarkup(member = {}, extraBadges = '') {
  const net = effectiveMemberNetApproval(member);
  const pop = effectiveMemberPopularity(member);
  const fame = effectiveMemberFame(member);
  const netTone = net >= 15 ? 'pos' : net < 0 ? 'neg' : 'neu';
  const netSign = net > 0 ? '+' : '';
  const traitsHtml = politicianTraitsBadgesMarkup(member);
  const factionName = resolveMemberFactionName(member);
  const factionBadge = `<span class="v15-politician-faction-badge">${safe(factionName)}</span>`;
  return `<span class="v09-leader-metrics">${factionBadge}<span class="v09-net-badge ${netTone}" title="Net Approval rating">Net ${netSign}${net}</span><span class="v09-pop-badge" title="Leader Popularity">Pop ${pop}</span><span class="v07-fame-badge" title="National Name Recognition / Fame">Fame ${fame}/100</span>${extraBadges}</span>${traitsHtml}`;
}

function effectiveSenateClassNum(cls) {
  if (cls === 'universal') return 'universal';
  return V07 ? V07.normalizeSenateClassNumber(cls) : ({ I: 1, II: 2, III: 3 }[cls] || 3);
}

function resolveSeatIdentity(seat, liveSitting = null) {
  const src = liveSitting ? { ...seat, ...liveSitting } : seat;
  const rawParty = String(src.rawParty || src.party || '').toLowerCase();
  const incName = src.incumbent || src.label || '';
  const exc = window.PartyChairData.getIndependentException ? window.PartyChairData.getIndependentException(src) : null;
  const isInd = !src.hasSwitchedThisCycle && (
    src.isIndependent === true ||
    rawParty === 'independent' ||
    rawParty === 'i' ||
    src.party === 'independent' ||
    Boolean(exc) ||
    ['Bernie Sanders', 'Angus King'].includes(incName)
  );
  if (isInd) {
    const caucus = src.caucus || exc?.caucus || 'people';
    const visualKey = caucus === 'people' ? 'ind-dem' : caucus === 'heritage' ? 'ind-rep' : 'other';
    return {
      isIndependent: true,
      party: 'independent',
      caucus,
      visualKey,
      colorHex: caucus === 'people' ? '#1abc9c' : caucus === 'heritage' ? '#d48270' : '#c3924d',
      affiliationLabel: caucus === 'people'
        ? 'Independent (Caucuses Democratic)'
        : caucus === 'heritage'
          ? 'Independent (Caucuses Republican)'
          : 'Independent (Unaligned)',
    };
  }
  const p = src.party === 'heritage' ? 'heritage' : src.party === 'people' ? 'people' : (src.party || 'other');
  const partyColor = p === 'people' ? '#3478c8' : p === 'heritage' ? '#c9474e' : p === 'player' ? (game.player?.color || '#8b5cf6') : (PARTY_ARCHETYPES.find((pa) => pa.id === p)?.color || '#c3924d');
  const partyLabel = p === 'people' ? 'Democratic' : p === 'heritage' ? 'Republican' : p === 'player' ? (game.player?.name || 'Custom') : (templateForDisplay(p) || p);
  return {
    isIndependent: false,
    party: p,
    caucus: p,
    visualKey: p,
    colorHex: partyColor,
    affiliationLabel: partyLabel,
  };
}

function allUniversalSenateSeats() {
  const class3Results = new Map((game.senateResults || []).map((r) => [r.stateId, r]));
  const sittingSenators = (game.sittingMembers || []).filter((m) => m.office === 'senate');
  return MAPS.senators.map((row) => {
    const cls = Number(row.class);
    const liveMatch = sittingSenators.find((m) => m.stateId === row.stateId && Number(m.senateClass || m.class) === cls);
    let merged = liveMatch ? { ...row, ...liveMatch, incumbent: liveMatch.name || row.incumbent } : { ...row };
    if (game.phase === 'complete' && cls === 3 && class3Results.has(row.stateId)) {
      const res = class3Results.get(row.stateId);
      merged = {
        ...merged,
        party: res.winner,
        rawParty: res.rawParty || res.winner,
        caucus: res.caucus || res.winner,
        incumbent: res.incumbent || res.candidateName || merged.incumbent || merged.label,
        label: `${res.incumbent || merged.label} (${res.winner === 'people' ? 'D' : res.winner === 'heritage' ? 'R' : 'I'} winner)`,
      };
    }
    const idMeta = resolveSeatIdentity(merged);
    return { ...merged, ...idMeta, classNum: cls };
  });
}

function computeSenateChamberBreakdown() {
  const seats = allUniversalSenateSeats();
  let demStraight = 0;
  let indDem = 0;
  let repStraight = 0;
  let indRep = 0;
  let other = 0;
  seats.forEach((s) => {
    if (s.isIndependent && s.caucus === 'people') indDem += 1;
    else if (s.isIndependent && s.caucus === 'heritage') indRep += 1;
    else if (s.party === 'people') demStraight += 1;
    else if (s.party === 'heritage') repStraight += 1;
    else other += 1;
  });
  const demCaucus = demStraight + indDem;
  const repCaucus = repStraight + indRep;
  const presWinner = game.phase === 'complete' && game.lastElection?.presidentialWinner
    ? game.lastElection.presidentialWinner
    : (game.administrationParty || 'heritage');
  const vpParty = presWinner === 'people' ? 'people' : 'heritage';
  const vpName = vpParty === 'people' ? 'Democratic VP' : (game.presidentialTicket?.heritage || 'J. D. Vance');
  return { seats, demStraight, indDem, repStraight, indRep, other, demCaucus, repCaucus, vpParty, vpName };
}

function partySpecificFactions(identity = playerIdentity()) {
  const external = window.PartyChairData.PARTY_FACTIONS?.[identity]
    || window.PartyChairData.PARTY_SPECIFIC_FACTIONS?.[identity];
  if (Array.isArray(external) && external.length) return external;

  const fallbackCatalogs = {
    people: [
      { id: 'progressive-activists', legacyKey: 'reformers', name: 'Progressive Activists', icon: '✦', quote: 'Bold structural reform rallies new voters and leaves half-measures behind.', blurb: 'Champion rapid climate action, healthcare expansion, and grassroots movement energy.' },
      { id: 'establishment-liberals', legacyKey: 'pragmatists', name: 'Establishment Liberals', icon: '🏛', quote: 'Durable governing majorities demand steady institutions and disciplined coalitions.', blurb: 'Anchor national fundraising, judicial defense, and suburban Democratic governance.' },
      { id: 'labor-industrial-populists', legacyKey: 'workers', name: 'Labor & Industrial Populists', icon: '⚒', quote: 'Win back the union hall, the factory floor, and every working-family paycheck.', blurb: 'Push collective bargaining, industrial reshoring, and pocketbook economic populism.' },
      { id: 'community-faith-pillar', legacyKey: 'organizers', name: 'Community & Faith Pillar', icon: '🕊', quote: 'Turnout starts in neighborhood civic halls, churches, and trusted local organizing.', blurb: 'Mobilize civil-rights networks, urban neighborhoods, and relational voter outreach.' },
      { id: 'frontier-suburban-moderates', legacyKey: 'localists', name: 'Frontier & Suburban Moderates', icon: '🧭', quote: 'Hold the center on pragmatic problem-solving to carry battleground districts.', blurb: 'Protect swing seats through bipartisan tone, fiscal guardrails, and suburban appeal.' },
    ],
    heritage: [
      { id: 'nationalist-populists', legacyKey: 'workers', name: 'Nationalist Populists', icon: '⚑', quote: 'Put American workers, secure borders, and national sovereignty first without apology.', blurb: 'Rally working-class heartland voters around trade protection, border security, and anti-elite rhetoric.' },
      { id: 'faith-flag-conservatives', legacyKey: 'organizers', name: 'Faith & Flag Conservatives', icon: '✝', quote: 'Defend traditional family life, religious liberty, and our constitutional heritage.', blurb: 'Energize evangelical and social-conservative turnout networks across every state.' },
      { id: 'market-country-club', legacyKey: 'funders', name: 'Market & Enterprise Conservatives', icon: '⚖', quote: 'Lower taxes, cut red tape, and let private enterprise drive national prosperity.', blurb: 'Channel business donor bundles toward pro-growth fiscal conservatism and deregulation.' },
      { id: 'liberty-western-mavericks', legacyKey: 'reformers', name: 'Liberty & Western Mavericks', icon: '🗽', quote: 'Shrink federal overreach and defend constitutional liberty from Washington mandates.', blurb: 'Mobilize Western individualists, Second Amendment voters, and limited-government purists.' },
      { id: 'heartland-institutionalists', legacyKey: 'localists', name: 'Heartland Institutionalists', icon: '🌾', quote: 'Deliver steady governing majorities, rural strength, and electable ticket balance.', blurb: 'Bridge statehouses, agricultural interests, and pragmatic Senate-win coalition math.' },
    ],
  };
  return fallbackCatalogs[identity] || (identity === 'constitution' || identity === 'liberty' ? fallbackCatalogs.heritage : fallbackCatalogs.people);
}

function factionStandingValue(faction) {
  const direct = game.factionStandings?.[faction.id];
  if (Number.isFinite(Number(direct))) return Number(direct);
  const legacyKey = faction.legacyId || faction.legacyKey;
  const legacy = legacyKey ? game.factionStandings?.[legacyKey] : undefined;
  if (Number.isFinite(Number(legacy))) return Number(legacy);
  return 55;
}

function getPartyApprovalStatusBadge(approval) {
  if (approval >= 55.0) return 'Dominant National Majority';
  if (approval >= 45.0) return 'Broad Coalition Goodwill';
  if (approval >= 35.0) return 'Competitive National Standing';
  if (approval >= 15.0) return 'Pressured / Rebuilding Party';
  if (approval >= 3.0) return 'Emerging / Minor Party';
  return 'Nascent / Fringe Movement';
}

function unifiedPartyApprovalEntries() {
  const fromEngine = game.partyApprovals || game.partyApproval;
  const poll = nationalPoll(game);
  const parties = partyList(game);
  const identity = playerIdentity();
  const presApproval = Number(game.presidentialApproval ?? 44);
  const isCustomPlayer = Boolean(game?.player?.custom);

  return parties.map((party) => {
    const isPlayer = party.id === 'player';
    const pid = isPlayer ? identity : party.id;
    const engineRec = fromEngine?.[party.id] ?? fromEngine?.[pid];
    let composite = typeof engineRec === 'number' ? engineRec : engineRec?.approval ?? engineRec?.composite;

    if (!Number.isFinite(Number(composite)) || !fromEngine) {
      // REQ-59: Calibrated Tri-Factor Inputs (40% Ballot + 20% Presidency + 40% Leader Popularity)
      const partyBallotShare = Number(poll[party.id] ?? party.baseShare ?? 1);
      const isDems = (isPlayer && !isCustomPlayer && pid === 'people') || (!isPlayer && party.id === 'people');
      const isGOP = (isPlayer && !isCustomPlayer && pid === 'heritage') || (!isPlayer && party.id === 'heritage');
      const isLib = party.id === 'liberty';
      const isGrn = party.id === 'green';
      const isCon = party.id === 'constitution';
      const isSoc = party.id === 'socialist';
      const isCust = isPlayer && isCustomPlayer;

      // 1. Generic Ballot Component (40% weight)
      let scaledBallot;
      if (isDems) scaledBallot = 46.0;
      else if (isGOP) scaledBallot = 41.0;
      else if (isLib) scaledBallot = 14.0;
      else if (isGrn) scaledBallot = 9.0;
      else if (isCon) scaledBallot = 7.0;
      else if (isSoc) scaledBallot = 5.0;
      else if (isCust) scaledBallot = Math.max(1.0, partyBallotShare * 10);
      else scaledBallot = Math.max(1.0, partyBallotShare * 6);

      // 2. Presidential Component (20% weight)
      let presComponent;
      if (isDems) presComponent = presApproval; // ~44%
      else if (isGOP) presComponent = Math.max(20, Math.min(80, (100 - presApproval) * 0.68)); // ~38%
      else if (isLib) presComponent = 10.0;
      else if (isGrn) presComponent = 8.0;
      else if (isCon) presComponent = 7.0;
      else if (isSoc) presComponent = 5.0;
      else if (isCust) presComponent = 1.0;
      else presComponent = 5.0;

      // 3. Leader Popularity Component (40% weight, factoring Fame/100)
      let effLeaderPop;
      if (isDems) effLeaderPop = 32.0;
      else if (isGOP) effLeaderPop = 28.0;
      else if (isLib) effLeaderPop = 11.0;
      else if (isGrn) effLeaderPop = 7.0;
      else if (isCon) effLeaderPop = 7.0;
      else if (isSoc) effLeaderPop = 5.0;
      else if (isCust) effLeaderPop = 1.0;
      else effLeaderPop = 5.0;

      composite = roundTo(scaledBallot * 0.40 + presComponent * 0.20 + effLeaderPop * 0.40, 1);
    } else {
      // If engine provided an approval number, ensure custom parties start calibrated at 1.0% when nascent
      if (isPlayer && isCustomPlayer && (game.chairTurn || 0) === 0) {
        composite = 1.0;
      } else if (!isCustomPlayer && (game.chairTurn || 0) === 0) {
        // Natural alignment with 2028 benchmarks
        if (pid === 'people' && composite > 48) composite = 40.0;
        else if (pid === 'heritage' && composite > 42) composite = 35.2;
        else if (pid === 'liberty') composite = 12.0;
        else if (pid === 'green') composite = 8.0;
        else if (pid === 'constitution') composite = 7.0;
        else if (pid === 'socialist') composite = 5.0;
      }
    }

    const finalVal = roundTo(Number(composite), 1);
    const statusLabel = getPartyApprovalStatusBadge(finalVal);
    return {
      id: party.id,
      name: party.name,
      color: party.color,
      approval: finalVal,
      statusLabel,
    };
  });
}

function ensureSuperPacCatalog() {
  const existing = game.superPacs || game.campaign?.superPacs;
  if (Array.isArray(existing) && existing.length) return existing;
  return [
    { id: 'workers-first-pac', name: 'Workers First PAC', lean: 'people', petIssue: 'Union Rights & Manufacturing', poolMillions: 18, spentMillions: 0, targetStateId: 'MI', demandStatus: 'pending', demandText: 'Commit to protecting domestic manufacturing & collective bargaining in priority messaging (+$6M PAC pool if accommodated).' },
    { id: 'green-future-action', name: 'Green Future Action', lean: 'people', petIssue: 'Clean Energy Transition', poolMillions: 14, spentMillions: 0, targetStateId: 'AZ', demandStatus: 'pending', demandText: 'Elevate Clean Energy & Climate Resilience among coalition messaging (+$5M PAC pool if accommodated).' },
    { id: 'healthcare-access-project', name: 'Healthcare Access Project', lean: 'people', petIssue: 'Prescription & Care Access', poolMillions: 15, spentMillions: 0, targetStateId: 'PA', demandStatus: 'pending', demandText: 'Defend lower prescription caps & hospital access across battleground media buys (+$5M PAC pool if accommodated).' },
    { id: 'energy-independence-pac', name: 'Energy Independence PAC', lean: 'heritage', petIssue: 'Domestic Energy & Drilling', poolMillions: 20, spentMillions: 0, targetStateId: 'PA', demandStatus: 'pending', demandText: 'Back domestic oil, gas & grid permitting streamlining (+$7M PAC pool if accommodated).' },
    { id: 'american-freedom-fund', name: 'American Freedom Fund', lean: 'heritage', petIssue: 'Tax Relief & Deregulation', poolMillions: 17, spentMillions: 0, targetStateId: 'GA', demandStatus: 'pending', demandText: 'Pledge permanent small-business tax relief & regulatory rollback (+$6M PAC pool if accommodated).' },
    { id: 'constitutional-defense-fund', name: 'Constitutional Defense Fund', lean: 'heritage', petIssue: 'Judicial & Constitutional Textualism', poolMillions: 14, spentMillions: 0, targetStateId: 'OH', demandStatus: 'pending', demandText: 'Emphasize strict constitutional appointments & Second Amendment protections (+$5M PAC pool if accommodated).' },
    { id: 'main-street-growth-pac', name: 'Main Street Growth Coalition', lean: 'swing', petIssue: 'Cost of Living & Small Business', poolMillions: 12, spentMillions: 0, targetStateId: 'WI', demandStatus: 'pending', demandText: 'Prioritize bipartisan inflation relief and suburban cost-of-living stability (+$5M PAC pool if accommodated).' },
  ];
}

function getDemographicGroups() {
  const cfg = window.PartyChairData.DEMOGRAPHIC_CONFIG?.groups;
  if (Array.isArray(cfg) && cfg.length) return cfg;
  return [
    { id: 'white', label: 'White Voters (High Swing Elasticity)' },
    { id: 'black', label: 'Black Voters' },
    { id: 'hispanic', label: 'Hispanic / Latino Voters' },
    { id: 'asian', label: 'Asian American & Pacific Islander Voters' },
    { id: 'native', label: 'Native American Voters' },
    { id: 'multiracial', label: 'Multiracial Voters' },
    { id: 'independent', label: 'Unaligned Independents' },
  ];
}

function getCustomLeaderArchetypes() {
  return window.PartyChairData.STARTING_LEADER_ARCHETYPES
    || window.PartyChairData.CUSTOM_LEADER_ARCHETYPES
    || [];
}

function formatAxisValue(val) {
  const n = Number(val || 0);
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}`;
}

function cleanCustomIssuePositions(positions) {
  if (!positions) return null;
  const res = { ...positions };
  delete res._baseId;
  return res;
}

function startingIssuePositionsFallback(partyId) {
  const issues = window.PartyChairData?.VERSION_021_ISSUES || [];
  const pillars = window.PartyChairData?.PLATFORM_PILLARS || [];
  const res = {};
  issues.forEach((issue) => {
    if (issue.defaults && issue.defaults[partyId] !== undefined) {
      res[issue.id] = issue.defaults[partyId];
      return;
    }
    const pillar = pillars.find((p) => p.id === issue.pillarId);
    if (pillar && pillar.defaults && pillar.defaults[partyId] !== undefined) {
      res[issue.id] = Math.round(pillar.defaults[partyId]);
      return;
    }
    res[issue.id] = 5;
  });
  return res;
}

function getCustomPartyIssuePositions() {
  const base = template();
  const baseId = base.id || selectedTemplate || 'people';
  if (!customIssuePositions) {
    const defaults = window.PartyChairEngine?.startingIssuePositions
      ? window.PartyChairEngine.startingIssuePositions(base)
      : startingIssuePositionsFallback(baseId);
    customIssuePositions = { ...defaults, _baseId: baseId };
  }
  return customIssuePositions;
}

function customPlatformMarkup() {
  const issues = window.PartyChairData?.VERSION_021_ISSUES || [];
  const positions = getCustomPartyIssuePositions();
  const base = template();
  const cleanedPositions = cleanCustomIssuePositions(positions);
  const axes = window.PartyChairEngine?.recalculateWeightedPlatformAxes
    ? window.PartyChairEngine.recalculateWeightedPlatformAxes(cleanedPositions, base, [])
    : { economic: base.economic || 0, social: base.social || 0, climate: base.climate || 0, local: base.local || 0 };

  const rawCategories = [...new Set(issues.map((i) => i.category))];
  const categories = ['All', ...rawCategories];
  if (!categories.includes(customIssueCategory)) customIssueCategory = 'All';
  const displayedIssues = customIssueCategory === 'All'
    ? issues
    : issues.filter((i) => i.category === customIssueCategory);

  const issueRows = displayedIssues.map((issue) => {
    const val = Number(positions[issue.id] ?? 5);
    const stanceDesc = window.PartyChairData?.STANCE_DESCRIPTIONS?.[issue.id]?.[val] || '';
    return `
      <article class="issue-row custom-setup-issue" style="margin-bottom:8px;padding:9px 12px;background:#0e1721;border:1px solid var(--line);border-radius:8px">
        <div class="issue-title" style="display:flex;justify-content:space-between;align-items:center">
          <b>${safe(issue.label)}</b>
          <output for="custom-issue-${issue.id}" id="custom-output-${issue.id}" aria-live="polite" style="font-family:Consolas,monospace;font-weight:700;color:var(--gold);font-size:13px">${val}/10</output>
        </div>
        <div class="issue-range" style="display:flex;align-items:center;gap:10px;margin:5px 0">
          <span style="font-size:11.5px;color:var(--muted);width:32%;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${safe(issue.low)}">${safe(issue.low)}</span>
          <input type="range" class="custom-issue-slider" id="custom-issue-${issue.id}" data-custom-issue="${issue.id}" min="1" max="10" step="1" value="${val}" style="flex:1;--range:${((val - 1) / 9) * 100}%" aria-label="${safe(issue.label)} position">
          <span style="font-size:11.5px;color:var(--muted);width:32%;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${safe(issue.high)}">${safe(issue.high)}</span>
        </div>
        <div class="stance-description" id="custom-stance-desc-${issue.id}" style="font-size:12px;color:var(--gold);margin:3px 0 2px;font-style:italic;line-height:1.35">${safe(stanceDesc)}</div>
      </article>
    `;
  }).join('');

  return `
    <div class="custom-platform-container" style="margin-top:14px">
      <div class="eyebrow">02 / Customize Platform Stances (1–10 Scale Across 41 National Issues)</div>
      <small style="color:var(--muted);display:block;margin-top:2px">
        Choose your positions on each national issue. Ideological summary axes update live below from your chosen stances.
      </small>

      <!-- Live Calculated Summary Axes -->
      <div class="v07-platform-summary-box" style="margin:10px 0 12px;padding:10px 12px;background:#0d1520;border:1px solid var(--line);border-radius:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span class="eyebrow" style="font-size:11px">Live Calculated Ideological Profile</span>
          <span style="font-size:11px;color:var(--gold);font-family:Consolas,monospace">Weighted from ${(window.PartyChairData?.VERSION_021_ISSUES || []).length} issues</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px">
          <div style="padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:#152230">
            <small style="color:var(--muted);display:block;font-size:10.5px">Economic</small>
            <b id="custom-axis-economic" style="font-size:12.5px;font-family:Consolas,monospace">${formatAxisValue(axes.economic)}</b>
          </div>
          <div style="padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:#152230">
            <small style="color:var(--muted);display:block;font-size:10.5px">Social</small>
            <b id="custom-axis-social" style="font-size:12.5px;font-family:Consolas,monospace">${formatAxisValue(axes.social)}</b>
          </div>
          <div style="padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:#152230">
            <small style="color:var(--muted);display:block;font-size:10.5px">Climate</small>
            <b id="custom-axis-climate" style="font-size:12.5px;font-family:Consolas,monospace">${formatAxisValue(axes.climate)}</b>
          </div>
          <div style="padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:#152230">
            <small style="color:var(--muted);display:block;font-size:10.5px">Party Structure</small>
            <b id="custom-axis-local" style="font-size:12.5px;font-family:Consolas,monospace">${formatAxisValue(axes.local)}</b>
          </div>
        </div>
      </div>

      <!-- Categorized issue tabs -->
      <div class="issue-categories" role="tablist" aria-label="Custom issue categories" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
        ${categories.map((cat) => `
          <button type="button" role="tab" data-custom-cat="${safe(cat)}" class="${customIssueCategory === cat ? 'selected' : ''}" style="padding:4px 8px;font-size:12px">
            ${safe(cat)} <small>${cat === 'All' ? issues.length : issues.filter((i) => i.category === cat).length}</small>
          </button>
        `).join('')}
      </div>

      <!-- Scrollable issue list -->
      <div class="custom-issue-list" style="max-height:460px;overflow-y:auto;padding-right:4px">
        ${issueRows}
      </div>
    </div>
  `;
}

function renderCurrentPoliticianPicker() {
  const allStates = window.PartyChairData?.STATES || [];
  const curOffice = customPoliticianOffice || 'governor';
  const curState = customPoliticianState || 'PA';

  let seatOptionsHtml = '';
  if (curOffice === 'governor') {
    seatOptionsHtml = `<option value="${curState}" selected>${curState} Gubernatorial Seat</option>`;
  } else if (curOffice === 'senate') {
    seatOptionsHtml = `
      <option value="1" ${customPoliticianSeat === '1' ? 'selected' : ''}>Senate Class I</option>
      <option value="2" ${customPoliticianSeat === '2' ? 'selected' : ''}>Senate Class II</option>
      <option value="3" ${customPoliticianSeat === '3' ? 'selected' : ''}>Senate Class III</option>
    `;
  } else if (curOffice === 'house') {
    const activeHouseDistList = game?.currentHouseMap?.districts || window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS || [];
    const districts = activeHouseDistList.filter((d) => (d.stateId || d.id?.split('-')[0]) === curState);
    if (districts.length > 0) {
      if (!districts.some((d) => d.id === customPoliticianSeat)) {
        customPoliticianSeat = districts[0].id;
      }
      seatOptionsHtml = districts.map((d) => `
        <option value="${d.id}" ${customPoliticianSeat === d.id ? 'selected' : ''}>District ${d.id}</option>
      `).join('');
    } else {
      seatOptionsHtml = `<option value="${curState}-1">${curState}-1</option>`;
    }
  }

  const incumbent = window.PartyChairEngine?.getIncumbentForClaimedSeat
    ? window.PartyChairEngine.getIncumbentForClaimedSeat(curOffice, curState, customPoliticianSeat)
    : null;

  return `
    <div class="current-politician-picker" style="margin-top:14px;padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.12);border-radius:8px">
      <div class="eyebrow" style="color:var(--gold)">3-Step Incumbent Role & Seat Selection</div>
      <p style="font-size:12.5px;color:var(--text-muted);margin:4px 0 10px">Claim an active real-world elected official who will defect and serve as your party's founding sitting member.</p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">1. Office</label>
          <select id="cur-pol-office" style="width:100%;padding:6px 8px;border-radius:4px;background:var(--surface,#18202c);color:#fff;border:1px solid rgba(255,255,255,0.2)">
            <option value="governor" ${curOffice === 'governor' ? 'selected' : ''}>Governor</option>
            <option value="senate" ${curOffice === 'senate' ? 'selected' : ''}>U.S. Senate</option>
            <option value="house" ${curOffice === 'house' ? 'selected' : ''}>U.S. House</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">2. State</label>
          <select id="cur-pol-state" style="width:100%;padding:6px 8px;border-radius:4px;background:var(--surface,#18202c);color:#fff;border:1px solid rgba(255,255,255,0.2)">
            ${allStates.map((s) => `<option value="${s.id}" ${curState === s.id ? 'selected' : ''}>${safe(s.name)} (${s.id})</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">3. Seat</label>
          <select id="cur-pol-seat" style="width:100%;padding:6px 8px;border-radius:4px;background:var(--surface,#18202c);color:#fff;border:1px solid rgba(255,255,255,0.2)">
            ${seatOptionsHtml}
          </select>
        </div>
      </div>

      <div class="claimed-incumbent-card" style="padding:10px 12px;background:rgba(0,0,0,0.25);border-radius:6px;border-left:3px solid var(--gold);display:flex;justify-content:space-between;align-items:center">
        <div>
          <small style="color:var(--gold);text-transform:uppercase;font-size:10.5px;font-weight:700;display:block">Real-World Incumbent Identified</small>
          <b style="font-size:14px;color:#fff">${incumbent ? safe(incumbent.name) : 'Incumbent Politician'}</b>
          <span style="font-size:12px;color:var(--text-muted);margin-left:6px">(${incumbent ? incumbent.rawParty : 'D/R'}) · ${incumbent ? safe(incumbent.title) : `${curState} ${curOffice}`}</span>
        </div>
        <span class="v07-incumbent-badge" style="font-size:11px;padding:3px 8px;background:rgba(226,189,112,0.15);color:var(--gold);border:1px solid var(--gold);border-radius:4px">DEFECTION TARGET</span>
      </div>
    </div>
  `;
}

/* ==========================================================================
   VERSION 0.16.2: CUSTOM PARTY CREATOR & FACTION ANCHORING
   ========================================================================== */
function renderCustomEmblemSvg(emblemId) {
  const emblem = (window.PartyChairData?.CUSTOM_PARTY_EMBLEMS || []).find((e) => e.id === emblemId);
  return emblem ? emblem.svg : '';
}

function customPartyCreatorMarkup() {
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
    // Catalog Faction Picker with Pairwise <= 2.0 Compatibility
    const cat = (typeof window.PartyChairEngine?.getFactionsCatalog === 'function' ? window.PartyChairEngine.getFactionsCatalog() : (window.PartyChairData?.ALL_PARTY_FACTIONS || []));
    const factionMap = new Map(cat.map((f) => [f.id, f]));
    
    // Compute total voters of chosen
    let totalVotersChosen = 0;
    customSelectedFactionIds.forEach((fid) => {
      const f = factionMap.get(fid);
      const fVoters = f ? (f.targetVoters || window.PartyChairData?.FACTION_NATIONAL_TOTALS?.[f.id] || 0) : 0;
      totalVotersChosen += fVoters;
    });

    let advisoryLabel = '● Realism Recommended · Under 1.0M Voters';
    if (totalVotersChosen >= 5000000) advisoryLabel = '● Roleplay / Sandbox Experience · Over 5.0M Voters';
    else if (totalVotersChosen >= 1000000) advisoryLabel = '● Healthy Balance Recommended · 1.0M–5.0M Voters';

    // Group catalog factions by party
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

                  return `
                    <label style="display:flex;align-items:flex-start;gap:8px;font-size:12px;color:${isDisabled ? 'rgba(255,255,255,0.4)' : '#fff'};cursor:${isDisabled ? 'not-allowed' : 'pointer'}" title="${safe(tooltip)}">
                      <input type="checkbox" data-custom-faction="${safe(f.id)}" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                      <div>
                        <b>${safe(f.name)}</b> ${isAnchor ? '<span style="font-size:10px;color:var(--gold)">🔒 ANCHOR</span>' : ''}
                        <small style="display:block;font-size:11px;color:var(--text-muted)">Econ ${fEcon.toFixed(1)} · Soc ${fSoc.toFixed(1)} · ${(fVoters / 1000000).toFixed(2)}M Voters</small>
                      </div>
                    </label>
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

/* ==========================================================================
   SETUP SCREEN
   ========================================================================== */
function setupMarkup() {
  const leaderArchetypes = getCustomLeaderArchetypes();
  if (leaderArchetypes.length && !leaderArchetypes.some((a) => a.id === selectedLeaderArchetype)) {
    selectedLeaderArchetype = leaderArchetypes[0].id;
  }
  const isCustomMode = custom || selectedTemplate === 'custom';
  return `
    <header class="topbar"><div class="brand"><img class="brand-icon" src="assets/coalition-builder-icon.svg" alt=""> COALITION BUILDER: <i>PARTY CHAIR</i></div><div class="topbar-actions"><button type="button" class="text-button" id="open-save-slots-1" data-dup-id="open-save-slots">Load Saved Game (5 Slots)</button><span class="top-status">VERSION 0.18.3</span></div></header>
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
          ${isCustomMode ? customPartyCreatorMarkup() : ''}
          ${isCustomMode && customOrigin !== 'not_major_movement' && (!customSelectedFactionIds || customSelectedFactionIds.length === 0) ? '<p style="color:#f59e0b;font-size:12.5px;margin:8px 0 4px">Select at least one starting faction (including extremist or unaffiliated wings), or choose "Not a Major Movement" to build a custom 100K faction.</p>' : ''}
          <!-- [v0.18.4 ATLAS-HOTSEAT] -->
          ${window.AtlasMultiplayerSystem ? window.AtlasMultiplayerSystem.renderHotseatSetupToggle(isCustomMode ? 'player' : selectedTemplate) : ''}
          <button type="button" id="start-game" class="button button-gold start-button" ${isCustomMode && ((customOrigin === 'not_major_movement' && Object.values(custom100kStateAllocations || {}).reduce((s, v) => s + (Number(v) || 0), 0) !== 100000) || (customOrigin !== 'not_major_movement' && (!customSelectedFactionIds || customSelectedFactionIds.length === 0))) ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>Take the chair <span>→</span></button>
          <p class="setup-foot">Version 0.18.3 · Opponent AI & Campaign Telemetry · Local autosave</p>
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

function axisSlider(id, label, left, right, value) {
  return `<label class="axis-control"><span><b>${label}</b><small>${left} <em>↔</em> ${right}</small></span><input type="range" min="-1" max="1" step="0.1" value="${value}" id="axis-${id}"></label>`;
}

/* ==========================================================================
   SHARED & CORE METRICS MARKUP
   ========================================================================== */
// REQ-166: Deprecated in v0.15.3 in favor of fullscreen Factions tab
function factionsMarkup() {
  return '';
}

function getPillarProseStance(pillar, avg) {
  const roundStance = Math.max(1, Math.min(10, Math.round(avg)));
  const labels = {
    'tax-economy': {
      1: 'Max Progressive Revenue & Universal Guarantees',
      2: 'Aggressive High-Earner Tax Expansion',
      3: 'Targeted Working-Family Relief & 28% Corporate Rate',
      4: 'Pragmatic Revenue & Loophole Reform',
      5: 'Revenue-Neutral Baseline & Stable Brackets',
      6: 'Competitive Pro-Growth Tax Cuts',
      7: 'Broad-Based Individual & Corporate Relief',
      8: 'Supply-Side Low-Tax & Deregulation Focus',
      9: 'Drastic Spending & Regulatory Reductions',
      10: 'Pure Laissez-Faire & Consumption Tax Transition',
    },
    'foreign-policy': {
      1: 'Anti-Imperialist Restraint & Global Demilitarization',
      2: 'Strict Multilateralism & Treaty Diplomacy',
      3: 'Diplomatic Coalitions & Defense Streamlining',
      4: 'Selective Engagement & Strategic Prudence',
      5: 'Balanced Defense & Alliance Commitments',
      6: 'Active Global Deterrence & Forward Posture',
      7: 'Robust Modernization & Counter-Rival Pivot',
      8: 'Peace Through Strength & Military Dominance',
      9: 'Unilateral Decisive Force & Defense Surge',
      10: 'Unquestioned Global Hegemony & Maximum Arms',
    },
    'climate-policy': {
      1: 'Emergency Green Transformation & Zero Emissions',
      2: 'Rapid Renewable Subsidies & Fossil Phaseout',
      3: 'Clean Energy Incentives & Pragmatic Targets',
      4: 'All-of-the-Above Transition with Natural Gas',
      5: 'Market-Based Incentives & Grid Reliability',
      6: 'Domestic Permitting Reform & Base Production',
      7: 'Energy Independence & Accelerated Leasing',
      8: 'Fossil Energy Dominance & Subsidy Rollbacks',
      9: 'Complete Climate Regulation Elimination',
      10: 'Unrestricted Extraction & Fossil Primacy',
    },
    'religious-policy': {
      1: 'Strict Secularism & Separation of Church and State',
      2: 'Public Sphere Secular Neutrality',
      3: 'Pluralistic Coexistence & Nondiscrimination',
      4: 'Individual Conscience & Civil Accommodations',
      5: 'Balanced Accommodation & Faith-Based Charities',
      6: 'Broad Religious Liberty Protections',
      7: 'Institutional Religious Freedom Guarantees',
      8: 'Heritage & Faith Affirmation in Public Life',
      9: 'Civic Moral Integration & Religious Primacy',
      10: 'Explicit Religious Governance & Moral Law',
    },
    'social-services': {
      1: 'Universal Single-Payer & Guaranteed Public Goods',
      2: 'Major Public Option & Expanded Entitlements',
      3: 'Strengthened Safety Net & Subsidized Access',
      4: 'Targeted Supports with Fiscal Guardrails',
      5: 'Public-Private Balance & Means-Tested Care',
      6: 'Private Competition & Personal Savings Focus',
      7: 'Market Choice & Block-Grant Flexibilities',
      8: 'Entitlement Restructuring & Work Incentives',
      9: 'Private Accounts & Deep Federal Reductions',
      10: 'Complete Market Provision & Philanthropy',
    },
    'social-justice': {
      1: 'Systemic Equity Mandates & Reparative Rights',
      2: 'Comprehensive Civil Rights & Inclusion Protections',
      3: 'Equal Opportunity & Robust Antidiscrimination',
      4: 'Bipartisan Fairness & Merit-Based Opportunity',
      5: 'Neutral Legal Protections & Balanced Norms',
      6: 'Colorblind Legal Standards & Traditional Values',
      7: 'Community Standards & Conscience Safeguards',
      8: 'Traditional Social Norms & Family Protections',
      9: 'Faith-Rooted Cultural Restoration',
      10: 'Strict Traditional Moral Legislation',
    },
    'party-structure': {
      1: 'Radical Grassroots Sovereignty & Local Member Voting',
      2: 'Decentralized Community Chapter Governance',
      3: 'Broad Field Empowerment & Chapter Voice',
      4: 'Collaborative State-National Coordination',
      5: 'Equitable Federal Balance & Shared Direction',
      6: 'Disciplined Committee Guidance & State Chapters',
      7: 'Strong National Leadership & Strategic Alignment',
      8: 'Centralized Resource Management & Unified Direction',
      9: 'Top-Down Machine Coordination & Executive Control',
      10: 'Strict National Command & Hierarchical Authority',
    },
    'party-ideology': {
      1: 'Uncompromising Movement Purity & Anti-Compromise',
      2: 'Strict Platform Fidelity & Base Enforcement',
      3: 'Principled Cohesion with Deliberative Debate',
      4: 'Cohesive Vision with Pragmatic Coalitions',
      5: 'Big-Tent Inclusivity & Balanced Compromise',
      6: 'Candidate Autonomy in Swing Battlegrounds',
      7: 'Broad Ideological Leeway & District Tailoring',
      8: 'Decentralized Candidate Autonomy & Open Factions',
      9: 'Minimal Ideological Constraints & Free Votes',
      10: 'Total Candidate Autonomy & Zero Platform Enactment',
    },
    'democracy-policy': {
      1: 'Universal Automatic Enfranchisement & Voting Expansion',
      2: 'National Voting Access Standards & Ethics Reform',
      3: 'Strengthened Electoral Integrity & Access Guarantees',
      4: 'Modernized State Administration & Fair Procedures',
      5: 'Balanced Integrity Safeguards & Equal Ballot Access',
      6: 'Standardized Identification & Security Protocols',
      7: 'Voter Identification & Accurate Roll Maintenance',
      8: 'Strict Ballot Security & State-Led Oversight',
      9: 'Tighter Registration Verification & State Autonomy',
      10: 'Restricted Executive Authority & Maximal Security',
    },
    'establishment-stance': {
      1: 'Total Institutional Stewardship & Unwavering Norms',
      2: 'Dedicated Institutional Defense & Reform',
      3: 'Respect for Established Governance & Precedent',
      4: 'Constructive Reform Through Institutional Channels',
      5: 'Pragmatic Modernization with Stable Continuity',
      6: 'Skeptical Reform of Entrenched Bureaucracies',
      7: 'Outsider Scrutiny & Federal Agency Downsizing',
      8: 'Populist Challenge to Entrenched Institutions',
      9: 'Aggressive Disruption of Bureaucratic Elites',
      10: 'Full Populist Dismantling of Unaccountable Systems',
    },
  };
  return labels[pillar.id]?.[roundStance] || (avg < 4 ? pillar.lowLabel : avg > 7 ? pillar.highLabel : 'Balanced Policy Framework');
}

function platformMarkup() {
  const pillars = window.PartyChairData?.PLATFORM_PILLARS;
  if (!pillars || !pillars.length) {
    const axes = [
      ['economic', 'Economic policy', 'Public investment', 'Market freedom'],
      ['social', 'Social policy', 'Progressive', 'Traditional'],
      ['climate', 'Climate', 'Rapid transition', 'Gradual transition'],
      ['local', 'Party structure', 'Local control', 'National direction'],
    ];
    return axes.map(([id, label, left, right]) => {
      const value = Number(game.player[id] || 0);
      return `<div class="platform-row"><div><b>${label}</b><small>${left}<span>${value.toFixed(2)}</span><span>${right}</span></small></div><div class="platform-track"><i style="left:${(value + 1) * 50}%"></i></div></div>`;
    }).join('');
  }

  const pId = playerIdentity();
  return pillars.map((pillar) => {
    const issueIds = pillar.issues || [];
    let sum = 0;
    let count = 0;
    issueIds.forEach((id) => {
      const val = Number(game.issuePositions?.[id]);
      if (Number.isFinite(val)) {
        sum += val;
        count++;
      }
    });
    const avg = count > 0 ? (sum / count) : (pillar.defaults?.[pId] ?? 5.5);
    const pct = Math.max(0, Math.min(100, ((avg - 1) / 9) * 100));
    const isInternal = !pillar.impactsVoters;
    const internalBadge = isInternal
      ? `<span class="v07-mini-badge" style="background:#2b3342;color:#94a3b8;font-size:10px;margin-left:6px;border:1px solid #475569" title="Internal party discipline & organization; does not shift public voter preference">Internal Party Machinery (Does Not Impact Voters)</span>`
      : '';
    const proseStance = getPillarProseStance(pillar, avg);
    return `<div class="platform-row v09-pillar-row" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px">
        <b>${pillar.number}. ${safe(pillar.shortName || pillar.name)}${internalBadge}</b>
        <span class="v09-pillar-stance-badge">${safe(proseStance)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);margin:3px 0 5px">
        <span>${safe(pillar.lowLabel)}</span>
        <span>${safe(pillar.highLabel)}</span>
      </div>
      <div class="platform-track"><i style="left:${pct}%" title="${safe(pillar.name)}: ${safe(proseStance)}"></i></div>
    </div>`;
  }).join('');
}

function pollMarkup() {
  const poll = nationalPoll(game);
  const parties = partyList(game);
  const sorted = parties.slice().sort((a, b) => poll[b.id] - poll[a.id]);
  const isComplete = game.phase === 'complete';
  return `<div class="poll-list">${sorted.map((party) => `<div class="poll-row"><div class="poll-label"><i style="background:${party.color}"></i><b>${safe(party.name)}</b>${isComplete ? `<strong>${poll[party.id]}%</strong>` : '<small style="color:var(--muted)">Outlook Only</small>'}</div><div class="meter"><i style="width:${isComplete ? poll[party.id] : 50}%;--meter:${party.color}"></i></div></div>`).join('')}</div>`;
}

function memberCohortsMarkup() {
  const aff = (game?.voterModel?.affiliations) || VOTER_MODEL.affiliations;
  const totalRep = (game?.voterModel?.representedVoters) || VOTER_MODEL.representedVoters || 155_000_000;
  const libertyVoters = aff.thirdParty?.byParty?.liberty ? aff.thirdParty.byParty.liberty : (aff.liberty?.representedVoters || 1_147_900);
  const greenVoters = aff.thirdParty?.byParty?.green ? aff.thirdParty.byParty.green : (aff.green?.representedVoters || 493_400);
  const rawOther = aff.thirdParty?.byParty?.other ? aff.thirdParty.byParty.other : (aff.other?.representedVoters || 3_602_200);

  const conVoters = aff.thirdParty?.byParty?.constitution ? aff.thirdParty.byParty.constitution : Math.round(rawOther * 0.45);
  const socVoters = aff.thirdParty?.byParty?.socialist ? aff.thirdParty.byParty.socialist : Math.round(rawOther * 0.40);

  const isCustomPlayer = Boolean(game?.player?.custom || game?.player?.id === 'custom');
  const customVoters = isCustomPlayer
    ? (aff.thirdParty?.byParty?.custom ? aff.thirdParty.byParty.custom : Math.round(rawOther * 0.15))
    : 0;

  // Strict invariant: minor parties are never bundled into generic 'Other' or '3rd party'
  const rows = [
    ['people', 'Democratic Party', aff.people.representedVoters, '#3478c8'],
    ['heritage', 'Republican Party', aff.heritage.representedVoters, '#c9474e'],
    ['independent', 'Independent / Unaffiliated', aff.independent.representedVoters, '#a9b4bf'],
    ['liberty', 'Libertarian Party', libertyVoters, '#e2bd45'],
    ['green', 'Green Party', greenVoters, '#55bf78'],
    ['constitution', 'Constitution Party', conVoters, '#a84214'],
    ['socialist', 'Peace and Freedom Party', socVoters, '#d62828'],
  ];

  if (isCustomPlayer) {
    rows.push(['custom', game.player.name || 'Custom Party', customVoters, game.player.color || '#8b5cf6']);
  }

  return rows.map(([, label, count, color]) => {
    const share = count / totalRep * 100;
    return `<div class="cohort-row"><div><b>${label}</b><strong>${formatMillions(count)}M</strong></div><div class="meter"><i style="width:${share}%;--meter:${color}"></i></div><small>${share.toFixed(1)}% of modeled electorate (155.00M represented voters)</small></div>`;
  }).join('');
}

function electionMarkup() {
  const election = game.lastElection;
  if (!election) return '';
  const winner = partyList(game).find((party) => party.id === election.winner);
  const pres = election.presidential;
  const isPresidential = (election.type === 'presidential' || election.cycleType === 'presidential' || ((election.year || game.year || 2028) % 4 === 0));
  const presWinnerId = election.presidentialWinner || (election.ev?.people >= 270 ? 'people' : 'heritage');
  const presWinnerName = presWinnerId === 'people' ? (game.presidentialTicket?.people || 'Jon Ossoff') : (game.presidentialTicket?.heritage || 'J. D. Vance');
  const presWinnerParty = presWinnerId === 'people' ? 'Democratic' : 'Republican';
  const presEv = (presWinnerId === 'people' ? (election.ev?.people || pres?.demEv) : (election.ev?.heritage || pres?.repEv)) || 270;
  const presOtherEv = 538 - presEv;
  const presRunnerName = presWinnerId === 'people' ? (game.presidentialTicket?.heritage || 'J. D. Vance') : (game.presidentialTicket?.people || 'Jon Ossoff');

  const presCard = isPresidential
    ? `
    <div class="presidential-outcome-card">
      <div class="outcome-badge">${election.year || game.year || 2028} Presidential Election Result</div>
      <h3>${safe(presWinnerName)} (${presWinnerParty}) elected President</h3>
      <p>Electoral College: <b>${presEv}</b> to <b>${presOtherEv}</b> EV for ${safe(presRunnerName)} (270 to win). Top-of-the-ticket margins exerted a <b>34% coattail effect</b> across all 435 U.S. House districts.</p>
    </div>`
    : `
    <div class="presidential-outcome-card">
      <div class="outcome-badge">${election.year || game.year} Midterm Election Result</div>
      <h3>Midterm General Election Decided</h3>
      <p>In this midterm cycle, national governing headwinds and local coalition organizing shaped congressional, gubernatorial, and state legislative battlegrounds across the nation.</p>
    </div>`;

  if (election.senate) {
    const legSeats = election.seats || election.legislature?.seats || {};
    const houseWinnerId = election.legislature?.winner || winner?.id;
    const houseWinner = partyList(game).find((p) => p.id === houseWinnerId) || winner;
    const senateCount = (election.senate || []).filter((race) => race.winner === 'people').length;
    const senateTotal = (election.senate || []).length || 33;
    const senateClassRoman = election.senateClass === 1 ? 'I' : election.senateClass === 2 ? 'II' : election.senateClass === 3 ? 'III' : (game.activeSenateClass === 1 ? 'I' : game.activeSenateClass === 2 ? 'II' : 'III');
    const govCount = (election.governors || []).filter((race) => race.winner === 'people').length;
    const govTotal = (election.governors || []).length;
    const stateLegCount = Object.values(election.stateLegislatures || {}).reduce((sum, chambers) => sum + chambers.filter((party) => party === 'people').length, 0);
    return `<section class="panel election-panel ${election.playerWon ? 'win' : 'loss'}">
      <div class="eyebrow">${election.year || game.year || 2028} ${isPresidential ? 'Presidential' : 'Midterm'} General Election · All Maps Called</div>
      <h2>Election Night is Decided</h2>
      ${presCard}
      <p>${safe(houseWinner?.name || 'Coalition')} leads the U.S. House with ${legSeats[houseWinner?.id] ?? game.seats ?? 0} seats. Your 20-turn organizing machine shaped ${isPresidential ? 'presidential, ' : ''}House, Senate Class ${senateClassRoman}, gubernatorial, and state legislative outcomes.</p>
      <div class="election-pills">
        ${isPresidential ? `<span style="--party:#3478c8"><i></i>Presidency · ${safe(presWinnerName)} (${presEv} EV)</span>` : `<span style="--party:#3478c8"><i></i>White House · ${safe(presWinnerName)} (${presWinnerParty})</span>`}
        <span style="--party:#2459b3"><i></i>Democrats · ${senateCount}/${senateTotal} Senate Class ${senateClassRoman} · ${govCount}/${govTotal} Governors · ${stateLegCount} State Chambers</span>
        <span style="--party:${game.player.color}"><i></i>${safe(game.player.name)} · ${legSeats.player ?? game.seats ?? 0} U.S. House seats · ${election.nationalVote?.player ?? 0}% national vote</span>
      </div>
    </section>`;
  }
  return '';
}

/* ==========================================================================
   TAB 1: ACTIONS — FULLSCREEN 4-STEP GUIDED TURN WORKFLOW
   ========================================================================== */
function getTurnStepButtonState() {
  const isComplete = game.phase === 'complete';
  if (isComplete) return { canConfirm: false, confirmLabel: 'Election Complete' };
  if (game.phase === 'organizing') {
    return {
      canConfirm: true,
      confirmLabel: 'Resolve Primaries & Launch General Election Campaign',
    };
  }
  const turnNum = Math.min(20, (game.chairTurn || 0) + 1);
  if (turnNum >= 20) {
    return { canConfirm: true, confirmLabel: 'Confirm Turn 20 · Resolve Primaries & Election Night' };
  }
  return { canConfirm: true, confirmLabel: `Confirm Turn ${turnNum}/20` };
}

function step1IssuesMarkup() {
  const issues = activePlatformIssues();
  const categories = [...new Set(issues.map((issue) => issue.category))];
  if (!categories.includes(issueCategory)) issueCategory = categories[0];
  const selected = issues.filter((issue) => issue.category === issueCategory);
  const controlsDisabled = game.phase === 'complete';
  const priorities = new Set(game.issuePriorities || []);

  const rows = selected.map((issue) => {
    const value = game.issuePositions?.[issue.id] || 5;
    const isPriority = priorities.has(issue.id);
    const stanceDesc = issueStanceText(issue.id, value);
    return `<article class="issue-row v09-text-first-issue ${isPriority ? 'v07-priority-highlight' : ''}">
      <div class="issue-title">
        <div class="v09-issue-header">
          <b>${safe(issue.label)}</b>
          ${isPriority ? '<span class="v07-mini-badge">PRIORITY 2x</span>' : ''}
        </div>
        <output for="issue-${issue.id}" aria-live="polite" class="v09-stance-callout">${safe(stanceDesc)}</output>
      </div>
      <div class="issue-range">
        <span class="v09-range-pole">${safe(issue.low)}</span>
        <input type="range" id="issue-${issue.id}" data-issue="${issue.id}" min="1" max="10" step="1" value="${value}" aria-label="${safe(issue.label)} position: ${safe(stanceDesc)}" style="--range:${(value - 1) / 9 * 100}%" ${controlsDisabled ? 'disabled' : ''}>
        <span class="v09-range-pole high">${safe(issue.high)}</span>
      </div>
      <div class="stance-description" id="stance-desc-${issue.id}" style="display:none">${safe(stanceDesc)}</div>
      ${issue.poll ? `<small class="issue-salience">${safe(issue.poll)}</small>` : '<small class="issue-salience">Unified platform stance directly informs voter trust and party coalition profile.</small>'}
    </article>`;
  }).join('');

  return `
    <section class="panel section-panel issue-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Step 1 of 4 · Unified Party Platform (Text-First Stances)</div>
          <h2>Set Your Issue Positions</h2>
        </div>
        <span class="turnout-chip">Live Policy Prose Platform</span>
      </div>
      <p class="section-intro">Adjust your national platform across ${issues.length} policy issues. Every position is rendered as complete, descriptive legislative text. Moving any stance directly recalibrates your 10 Platform Pillars below (weighted 2x for issues prioritized in Step 2) and shifts Electorate Trust.</p>

      <div class="v07-platform-summary-box">
        <div class="eyebrow">Dynamic Platform Summary (10 Platform Pillars)</div>
        <div class="platform-list v07-platform-grid">${platformMarkup()}</div>
      </div>

      <div class="issue-categories" role="tablist" aria-label="Issue categories">
        ${categories.map((category) => `<button type="button" role="tab" aria-selected="${issueCategory === category}" data-issue-category="${safe(category)}" class="${issueCategory === category ? 'selected' : ''}">${safe(category)} <small>${issues.filter((issue) => issue.category === category).length}</small></button>`).join('')}
      </div>
      <div class="issue-list">${rows}</div>
    </section>`;
}

const QUEST_REQUIREMENTS_MAP = {
  'win-re-election': 'Requires holding the White House during a Presidential election year with a first-term incumbent eligible for re-election.',
  'affirm-succession': 'Requires holding the White House during a Presidential election year with a term-limited (second-term) incumbent.',
  'take-back-white-house': 'Requires a Presidential election year where your party does not hold the White House but has won the Presidency within the last 20 years.',
  'win-white-house': 'Requires a Presidential election year for an emerging party that has not held the White House in the last 20 years, with at least 20.0% national polling/generic ballot.',
  'building-brand': 'Requires a Presidential election year for an out-of-power party with fewer than 100K registered members.',
  'holding-the-house': 'Requires holding an active House majority (at least 218 House seats) entering the election cycle.',
  'holding-the-senate': 'Requires holding an active Senate majority (at least 50 Senate seats) entering the election cycle.',
  'win-the-house': 'Requires entering the election cycle with a minority of House seats (fewer than 218 seats) as a major party.',
  'win-the-senate': 'Requires entering the election cycle with a minority of Senate seats (fewer than 50 seats) as a major party.',
  'holding-house-and-senate': 'Requires holding majorities in both congressional chambers (≥ 218 House seats & ≥ 50 Senate seats).',
  'holding-the-trifecta': 'Requires holding a federal trifecta (the White House, ≥ 218 House seats, and ≥ 50 Senate seats).',
  'win-first-seat': 'Requires being a minor or emerging party with 0 current seats in Congress or governorships.',
  'win-first-house-seat': 'Requires being a minor or emerging party with 0 current U.S. House seats.',
  'win-first-senate-seat': 'Requires being a minor or emerging party with 0 current U.S. Senate seats.',
  'win-first-governor': 'Requires being a minor or emerging party with 0 current Governorships.',
  'growing-in-state': 'Requires choosing a target state to expand party registration, vote share, and local chapters.',
  'passing-state-legislation': 'Requires holding legislative presence to sponsor and pass state policy bills.',
};

function questSelectionModalMarkup() {
  const allQuests = window.PartyChairEngine?.OVERALL_PRIORITY_QUESTS || [];
  const eligibleQuests = (window.PartyChairEngine?.getEligibleOverallQuests ? window.PartyChairEngine.getEligibleOverallQuests(game) : allQuests);
  const activeMainPriorities = (game.priorities?.main || (game.activeOverallQuest ? [game.activeOverallQuest] : [])).filter(Boolean);

  const diffBadgeColor = {
    Easy: '#55bf78',
    Medium: '#e2bd45',
    Hard: '#e67e22',
    Insane: '#e74c3c',
    Impossible: '#9b59b6',
  };

  const questCatalogCards = allQuests.map((quest) => {
    const isEligible = eligibleQuests.some((q) => q.id === quest.id);
    const isAlreadySelected = activeMainPriorities.includes(quest.id);
    const diffColor = diffBadgeColor[quest.difficulty] || '#e2bd45';
    const reqText = quest.eligibilityRequirementText || QUEST_REQUIREMENTS_MAP[quest.id] || quest.triggerRequirement || quest.requirementText || 'Open to all parties';
    const isGrowingInState = quest.id === 'growing-in-state';
    const chosenState = game.priorities?.targetState || game.activeOverallQuestTargetState || 'PA';

    return `
      <div class="quest-catalog-card ${isAlreadySelected ? 'already-active' : ''}" style="${!isEligible ? 'opacity:0.4;filter:grayscale(0.6)' : ''}">
        <div>
          <div class="quest-card-header">
            <b>${safe(quest.name)}</b>
            <span class="v07-mini-badge" style="background:${diffColor};color:#0b1118;font-weight:700">${safe(quest.difficulty)}</span>
          </div>
          <div class="quest-trigger-requirement ${isEligible ? 'eligible' : 'ineligible'}">
            ${isEligible
              ? `<b>Requirement:</b> <span class="met-condition">Eligible ✓</span> <small style="display:block;margin-top:2px;color:var(--muted)">(${safe(reqText)})</small>`
              : `<b>Eligibility Requirements:</b> <span class="unmet-condition">${safe(reqText)}</span>`}
          </div>
          ${isGrowingInState ? `
            <div class="quest-state-picker" style="margin: 8px 0;">
              <label for="quest-target-state-select" style="font-size:12px;color:var(--gold);font-weight:600;display:block;margin-bottom:4px">Target State:</label>
              <select id="quest-target-state-select" class="v07-select" style="width:100%;padding:6px 8px">
                ${STATES.map((s) => `<option value="${s.id}" ${chosenState === s.id ? 'selected' : ''}>${s.name} (${s.id})</option>`).join('')}
              </select>
            </div>
          ` : ''}
          <div class="quest-goal-desc">${safe(quest.description)}</div>
          <div class="quest-acceptance-bonus">
            ⚡ <b>Acceptance Bonus:</b> ${safe(quest.acceptanceBonusText || 'None')}
          </div>
          <div class="quest-reward-text">
            🏆 <b>Reward:</b> ${safe(quest.rewardText || `+${quest.happinessReward || 8} Member Happiness`)}
          </div>
        </div>
        <div style="margin-top:14px;display:flex;justify-content:flex-end">
          ${isAlreadySelected ? `
            <span class="v07-mini-badge" style="background:var(--gold);color:#0b1118;font-weight:700;padding:6px 12px;font-size:12px">ACTIVE MAJOR PRIORITY ✓</span>
          ` : isEligible ? `
            <button type="button" class="button button-gold button-small" data-pick-main-quest="${safe(quest.id)}" data-slot-index="${questModalTargetSlot}">
              Select for Slot ${questModalTargetSlot + 1} →
            </button>
          ` : `
            <button type="button" class="button button-small" disabled style="opacity:0.5">Ineligible</button>
          `}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="v08-modal-overlay" id="quest-modal-overlay">
      <div class="v08-modal-content quest-modal-content">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px">
          <div>
            <div class="eyebrow">Strategic Quests Catalog · Slot ${questModalTargetSlot + 1}</div>
            <h2 style="margin:2px 0;font-family:'Iowan Old Style',Palatino,Georgia,serif;font-size:26px">Select Major Priority Quest</h2>
            <p style="margin:4px 0 0;color:var(--muted);font-size:13.5px">
              Choose an overarching national strategic quest for your party this cycle. Displays requirements, immediate acceptance bonuses, and victory rewards.
            </p>
          </div>
          <button type="button" class="button button-gold" id="close-quest-modal">Cancel ✕</button>
        </div>

        <div class="quest-catalog-filter-bar">
          <span style="font-size:13px;color:var(--muted)">Showing <b>${allQuests.length}</b> Quests Catalog (<b>${eligibleQuests.length}</b> Eligible for your party)</span>
          <span style="font-size:12px;color:var(--gold)">⚡ Acceptance bonus awarded upon cycle confirmation and lock-in</span>
        </div>

        <div class="quest-catalog-grid">
          ${questCatalogCards}
        </div>
      </div>
    </div>
  `;
}

function majorPrioritiesConfirmModalMarkup() {
  const allQuests = window.PartyChairEngine?.OVERALL_PRIORITY_QUESTS || [];
  const selectedIds = game.priorities?.main || [];
  const bonusesListMarkup = selectedIds.map((id) => {
    const q = allQuests.find((x) => x.id === id);
    if (!q) return '';
    return `<li><b>${safe(q.name)}:</b> ${safe(q.acceptanceBonusText || 'Acceptance bonus granted')}</li>`;
  }).filter(Boolean).join('');

  return `
    <div class="v08-modal-overlay" id="major-priorities-modal-overlay">
      <div class="v08-modal-content major-priorities-confirm-modal">
        <div class="confirm-modal-icon">🔒</div>
        <h2 class="confirm-modal-title">Lock Major Priorities?</h2>
        <p class="confirm-modal-prompt">Are you sure? This can't change after being selected.</p>
        <p class="confirm-modal-desc">
          Your 3 Major Priorities define the national party's core commitments for the entire ${game?.year || 2028} election cycle. Once confirmed and locked, they are permanently binding through election night and cannot be altered or substituted.
        </p>
        <div class="pending-acceptance-bonuses">
          <b>Acceptance Bonuses Awarded Upon Lock-In:</b>
          <ul>${bonusesListMarkup || '<li>Standard cycle lock-in bonuses apply</li>'}</ul>
        </div>
        <div class="confirm-modal-actions">
          <button type="button" class="button button-gold" id="btn-lock-major-priorities-confirm">Confirm & Lock Major Priorities</button>
          <button type="button" class="button" id="btn-lock-major-priorities-cancel">Go Back / Review</button>
        </div>
      </div>
    </div>
  `;
}

// REQ-255: Targetable Opponent Stronghold Dropdown Qualification Indicator (>= 55% opponent share)
function renderTargetTerritorySelectorMarkup(game, quest, currentTarget, knownSharesMatrix) {
  if (!quest?.isTargetable) return '';
  const tracking = game?.customPriorityTracking?.[quest.id] || {};
  let selectedId = currentTarget || tracking.targetId || 'PA';
  const isLocked = Boolean(game?.priorities?.handLocked || game?.prioritiesLocked);
  const playerPid = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');

  const getOpponentShare = (st) => {
    if (knownSharesMatrix) {
      const entry = knownSharesMatrix[st.id] !== undefined ? knownSharesMatrix[st.id] : knownSharesMatrix[st.name];
      if (typeof entry === 'number') {
        return entry <= 1.0 ? entry * 100 : entry;
      }
      if (entry && typeof entry === 'object') {
        if (typeof entry.opponentShare === 'number') return entry.opponentShare <= 1.0 ? entry.opponentShare * 100 : entry.opponentShare;
        if (typeof entry.opponent === 'number') return entry.opponent <= 1.0 ? entry.opponent * 100 : entry.opponent;
        const shares = Object.entries(entry).filter(([p]) => p !== playerPid && p !== 'player').map(([_, v]) => Number(v) || 0);
        if (shares.length > 0) {
          const maxVal = Math.max(...shares);
          return maxVal <= 1.0 ? maxVal * 100 : maxVal;
        }
      }
    }
    try {
      if (typeof window?.PartyChairEngine?.supportByState === 'function') {
        const support = window.PartyChairEngine.supportByState(game, st);
        const rivalShares = Object.entries(support).filter(([pid]) => pid !== playerPid && pid !== 'player').map(([_, v]) => Number(v) || 0);
        if (rivalShares.length > 0) return Math.max(...rivalShares);
      }
    } catch (_) {}
    const baseLean = Math.abs(st.basePartisanLean || st.partisanLean || 0);
    return 50 + baseLean;
  };

  const isStrongholdQuest = quest.id === 'crack-opponent-stronghold';
  const threshold = 55.0;

  if (isStrongholdQuest) {
    const selectedStateObj = STATES.find((s) => s.id === selectedId) || STATES[0];
    if (getOpponentShare(selectedStateObj) < threshold) {
      const firstQualifying = STATES.find((s) => getOpponentShare(s) >= threshold);
      if (firstQualifying) selectedId = firstQualifying.id;
    }
  }

  const optionsHtml = STATES.map((st) => {
    const oppShare = getOpponentShare(st);
    const qualifies = !isStrongholdQuest || oppShare >= threshold;
    const isSelected = selectedId === st.id;

    if (isStrongholdQuest) {
      if (qualifies) {
        return `<option value="${st.id}" ${isSelected ? 'selected' : ''}>★ Hostile Stronghold · ${st.name} (${st.id})</option>`;
      } else {
        return `<option value="${st.id}" disabled style="color:var(--dim)">${st.name} (${st.id}) · Uncontested Ground</option>`;
      }
    }
    return `<option value="${st.id}" ${isSelected ? 'selected' : ''}>${st.name} (${st.id})</option>`;
  }).join('');

  return `
    <div style="margin:8px 0">
      <label style="font-size:11px;font-weight:700;color:var(--gold);display:block;margin-bottom:3px">Target Territory:</label>
      <select data-targetable-select="${safe(quest.id)}" ${isLocked ? 'disabled' : ''} style="width:100%;padding:4px 6px;font-size:11.5px;border-radius:4px">
        ${optionsHtml}
      </select>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.renderTargetTerritorySelectorMarkup = renderTargetTerritorySelectorMarkup;
  if (window.PartyChairApp) {
    window.PartyChairApp.renderTargetTerritorySelectorMarkup = renderTargetTerritorySelectorMarkup;
  }
}

function step2PrioritiesMarkup() {
  const issues = activePlatformIssues();
  const regionDefs = window.PartyChairData.OVERLAPPING_REGION_DEFINITIONS || [];
  const allQuests = window.PartyChairData?.OVERALL_PRIORITY_QUESTS || window.PartyChairEngine?.OVERALL_PRIORITY_QUESTS || [];
  const isDisabled = game.phase === 'complete';
  const isLocked = Boolean(game.priorities?.handLocked || game.prioritiesLocked);
  const isFocusesLocked = Boolean(game.focusesLocked);

  const identity = playerIdentity();
  const tierInfo = getPlayerTierInfo(game);
  const maxFocusSlots = getPlayerMaxFocusSlots(game);

  // Ensure game.priorities data structure exists with institutional tier-scaled Party Focus slots (3 -> 5 -> 7)
  if (!game.priorities) {
    game.priorities = {
      main: game.activeOverallQuest ? [game.activeOverallQuest] : [],
      additional: [],
      offeredQuestIds: [],
      lockedMainPriorities: [],
      redrawCount: 0,
      handLocked: false,
    };
  }
  if (!Array.isArray(game.priorities.additional)) {
    game.priorities.additional = [];
  }
  if (game.priorities.additional.length > maxFocusSlots) {
    game.priorities.additional = game.priorities.additional.slice(0, maxFocusSlots);
  }
  while (game.priorities.additional.length < maxFocusSlots) {
    const idx = game.priorities.additional.length;
    if (idx === 0) game.priorities.additional.push({ type: 'issue', targetId: (game.issuePriorities && game.issuePriorities[0]) || '' });
    else if (idx === 1) game.priorities.additional.push({ type: 'issue', targetId: (game.issuePriorities && game.issuePriorities[1]) || '' });
    else if (idx === 2) game.priorities.additional.push({ type: 'issue', targetId: (game.issuePriorities && game.issuePriorities[2]) || '' });
    else if (idx === 3) game.priorities.additional.push({ type: 'region', targetId: (game.regionalPriorities && game.regionalPriorities[0]) || '' });
    else game.priorities.additional.push({ type: 'issue', targetId: '' });
  }

  // Ensure Draft-of-7 offered hand is dealt
  if (!Array.isArray(game.priorities.offeredQuestIds) || game.priorities.offeredQuestIds.length === 0) {
    if (window.PartyChairEngine?.generateOfferedPrioritiesHand) {
      const dealt = window.PartyChairEngine.generateOfferedPrioritiesHand(game, game.priorities.redrawCount || 0);
      game.priorities.offeredQuestIds = dealt.map((q) => q.id);
    }
  }

  const mainQuests = game.priorities.main || [];
  const additionalSlots = game.priorities.additional || [];
  const offeredIds = game.priorities.offeredQuestIds || [];

  const redrawCost = (game.priorities.redrawCount || 0) + 1;
  const canRedraw = !isLocked && (game.actionsLeft ?? 20) >= redrawCost;

  const diffBadgeColor = {
    Easy: '#55bf78',
    Medium: '#e2bd45',
    Hard: '#e67e22',
    Insane: '#e74c3c',
    Impossible: '#9b59b6',
  };

  // Render 3 Active Major Priority Slots (REQ-97, REQ-98, REQ-230)
  const mainCardsHtml = [0, 1, 2].map((slotIdx) => {
    const questId = mainQuests[slotIdx];
    const quest = allQuests.find((q) => q.id === questId);

    if (!quest) {
      return `
        <div class="main-priority-slot main-priority-empty" style="cursor:default">
          <span class="main-priority-empty-icon">${isLocked ? '🔒' : '✚'}</span>
          <div class="main-priority-empty-label">Major Priority ${slotIdx + 1} ${isLocked ? 'Locked' : 'Unassigned'}</div>
          <small>${isLocked ? 'Priorities locked for this cycle' : 'Select a directive from the Draft-of-7 Hand below'}</small>
        </div>
      `;
    }

    const diffColor = diffBadgeColor[quest.difficulty] || '#e2bd45';
    const tracking = game.customPriorityTracking?.[quest.id] || {};
    const targetStateId = tracking.targetId || game.priorities?.targetState || 'PA';
    const targetStateObj = STATES.find((s) => s.id === targetStateId);

    let displayName = quest.name;
    if (quest.id === 'growing-in-state') {
      displayName = `Grow our party in ${targetStateObj?.name || targetStateId}`;
    } else if (quest.id === 'crack-opponent-stronghold') {
      displayName = `Crack an Opponent Stronghold (${targetStateObj?.name || targetStateId})`;
    } else if (quest.id === 'crack-opponents-fortress') {
      displayName = `Crack an Opponent's Fortress (${targetStateObj?.name || targetStateId})`;
    }

    return `
      <div class="main-priority-slot main-priority-card">
        <div>
          <div class="main-priority-card-top">
            <div>
              <div class="main-priority-badge-row">
                <span class="v07-mini-badge" style="background:${diffColor};color:#0b1118;font-weight:700">${safe(quest.difficulty)}</span>
                <span style="font-size:11.5px;color:var(--gold);text-transform:uppercase;font-weight:700">Slot ${slotIdx + 1}</span>
                ${isLocked ? '<span class="vibe-padlock-badge" style="font-size:11px;color:var(--gold);font-weight:700;margin-left:6px">🔒 LOCKED</span>' : ''}
              </div>
              <h4 class="main-priority-quest-name">${safe(displayName)}</h4>
            </div>
            ${!isLocked ? `
              <button type="button" class="button button-small" data-draft-deselect-quest="${safe(quest.id)}" style="padding:2px 8px;font-size:11px" title="Deselect directive">
                Deselect ✕
              </button>
            ` : ''}
          </div>
          <div class="main-priority-goal">${safe(quest.description)}</div>
          <div class="main-priority-bonus">
            ⚡ <b>Acceptance:</b> ${safe(quest.acceptanceBonusText || 'None')}
          </div>
          <div class="main-priority-reward">
            🏆 <b>Reward:</b> ${safe(quest.rewardText || `+${quest.happinessReward || 8} Member Happiness`)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render the 7 Offered Cards (REQ-231)
  const draftCardsHtml = offeredIds.map((qId) => {
    const quest = allQuests.find((q) => q.id === qId);
    if (!quest) return '';

    const isSelected = mainQuests.includes(qId);
    const slotIdx = mainQuests.indexOf(qId);
    const diffColor = diffBadgeColor[quest.difficulty] || '#e2bd45';

    // Targetable state dropdown (REQ-255)
    let targetSelectorHtml = '';
    if (quest.isTargetable) {
      const tracking = game.customPriorityTracking?.[quest.id] || {};
      const currentTarget = tracking.targetId || 'PA';
      targetSelectorHtml = renderTargetTerritorySelectorMarkup(game, quest, currentTarget);
    }

    return `
      <div class="draft-priority-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}">
        <div>
          <div class="draft-card-top">
            <span class="v07-mini-badge" style="background:${diffColor};color:#0b1118;font-weight:700">${safe(quest.difficulty)}</span>
            ${isSelected ? `<span class="v07-mini-badge" style="background:var(--gold);color:#0b1118;font-weight:700">Slot ${slotIdx + 1} Assigned ✓</span>` : ''}
          </div>
          <h4 class="draft-card-title">${safe(quest.name)}</h4>
          <p class="draft-card-desc">${safe(quest.description)}</p>
          ${targetSelectorHtml}
          <div class="draft-card-meta">
            <div class="draft-card-bonus">⚡ <b>Acceptance:</b> ${safe(quest.acceptanceBonusText || 'None')}</div>
            <div class="draft-card-reward">🏆 <b>Reward:</b> ${safe(quest.rewardText || `+${quest.happinessReward || 8} Member Happiness`)}</div>
          </div>
        </div>
        <div class="draft-card-actions">
          ${isSelected ? `
            ${!isLocked ? `
              <button type="button" class="button button-small" data-draft-deselect-quest="${safe(quest.id)}" style="padding:4px 10px;font-size:11.5px">
                Deselect ✕
              </button>
            ` : '<span style="font-size:11.5px;color:var(--gold);font-weight:700">🔒 Committed</span>'}
          ` : `
            ${!isLocked ? `
              <button type="button" class="button button-small button-gold" data-draft-select-quest="${safe(quest.id)}" ${mainQuests.length >= 3 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''} style="padding:4px 10px;font-size:11.5px;font-weight:700">
                ${mainQuests.length >= 3 ? '3 Slots Full' : 'Select Priority +'}
              </button>
            ` : '<span style="font-size:11.5px;color:var(--muted)">Unselected</span>'}
          `}
        </div>
      </div>
    `;
  }).join('');

  // Render Party Focus slots (REQ-156: 7 for Major, 3 for Minor)
  const additionalRowsHtml = Array.from({ length: maxFocusSlots }, (_, slotIdx) => slotIdx).map((slotIdx) => {
    const slot = additionalSlots[slotIdx] || { type: 'issue', targetId: '' };
    const slotType = slot.type || 'issue';
    const targetId = slot.targetId || '';

    let dropdownHtml = '';
    let noteHtml = '';
    const slotDisabled = isDisabled || isFocusesLocked;

    if (slotType === 'issue') {
      dropdownHtml = `
        <select data-additional-target="${slotIdx}" ${slotDisabled ? 'disabled' : ''}>
          <option value="">-- Choose National Issue --</option>
          ${issues.map((i) => `<option value="${safe(i.id)}" ${targetId === i.id ? 'selected' : ''}>${safe(i.label)} (${safe(i.category)})</option>`).join('')}
        </select>
      `;
      noteHtml = `<span class="additional-note-badge note-issue">★ Increases party base loyalty (+1.5 Supporter Trust & 2× Weight)</span>`;
    } else if (slotType === 'state') {
      dropdownHtml = `
        <select data-additional-target="${slotIdx}" ${slotDisabled ? 'disabled' : ''}>
          <option value="">-- Choose State --</option>
          ${STATES.map((s) => `<option value="${safe(s.id)}" ${targetId === s.id ? 'selected' : ''}>${safe(s.id)} · ${safe(s.name)}</option>`).join('')}
        </select>
      `;
      noteHtml = `<span class="additional-note-badge note-state">✚ +5,000 registered voters in state</span>`;
    } else {
      dropdownHtml = `
        <select data-additional-target="${slotIdx}" ${slotDisabled ? 'disabled' : ''}>
          <option value="">-- Choose Region --</option>
          ${regionDefs.map((r) => `<option value="${safe(r.id)}" ${targetId === r.id ? 'selected' : ''}>${safe(r.name || r.id)} (${(r.states || []).length} states)</option>`).join('')}
        </select>
      `;
      noteHtml = `<span class="additional-note-badge note-region">🌐 +500 registered voters per state in region</span>`;
    }

    const isFilled = Boolean(targetId);

    return `
      <div class="additional-priority-row ${isFilled ? 'slot-filled' : ''}">
        <div class="additional-priority-label">
          <span>Party Focus ${slotIdx + 1}</span>
          ${isFilled ? '<span style="color:#8ce4be;font-size:13px">✓</span>' : ''}
        </div>
        <div class="additional-type-selector">
          <button type="button" class="additional-type-btn ${slotType === 'issue' ? 'active' : ''}" data-set-additional-type="${slotIdx}" data-type="issue" ${slotDisabled ? 'disabled style="opacity:0.6;cursor:not-allowed"' : ''}>Issue</button>
          <button type="button" class="additional-type-btn ${slotType === 'state' ? 'active' : ''}" data-set-additional-type="${slotIdx}" data-type="state" ${slotDisabled ? 'disabled style="opacity:0.6;cursor:not-allowed"' : ''}>State</button>
          <button type="button" class="additional-type-btn ${slotType === 'region' ? 'active' : ''}" data-set-additional-type="${slotIdx}" data-type="region" ${slotDisabled ? 'disabled style="opacity:0.6;cursor:not-allowed"' : ''}>Region</button>
        </div>
        <div class="additional-target-wrap">
          ${dropdownHtml}
          ${noteHtml}
        </div>
        <div>
          ${isFilled && !slotDisabled ? `
            <button type="button" class="text-button" data-clear-additional-slot="${slotIdx}" title="Clear slot" style="color:var(--muted);font-size:16px;padding:4px">✕</button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const activeMainCount = mainQuests.filter(Boolean).length;
  const activeAdditionalCount = additionalSlots.filter((s) => s.targetId).length;

  return `${v0180PollingMissBannerMarkup()}
    <section class="panel section-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Step 2 of 5 · Strategic Priorities</div>
          <h2>Two-Tier National Priority Architecture</h2>
        </div>
        <span class="turnout-chip">${activeMainCount}/3 Major Priorities · ${activeAdditionalCount}/${maxFocusSlots} Party Focus Targets</span>
      </div>
      <p class="section-intro">
        Configure your party's strategic posture for the ${game?.year || 2028} election cycle across two distinct decks: 
        <b>3 Major Priorities</b> chosen from this cycle's Draft-of-7 Hand, plus <b>Party Focus (${maxFocusSlots} slots)</b> spanning national issues, critical battleground states, and cultural regions. Choices stage without bonuses until locked in.
      </p>

      ${isLocked ? `
        <div class="vibe-locked-banner" style="margin-bottom:18px;padding:12px 16px;background:rgba(226,189,112,0.1);border:1px solid var(--gold);border-radius:6px;display:flex;align-items:center;gap:12px">
          <span style="font-size:24px">🔒</span>
          <div>
            <b style="color:var(--gold);font-size:14px">Major Strategic Priorities Locked for Cycle ${game?.year || 2028}</b>
            <span style="display:block;font-size:12.5px;color:var(--text-muted);margin-top:2px">These 3 core national directives are permanently locked and binding on party leadership through the election.</span>
          </div>
        </div>
      ` : ''}

      <!-- Major Priorities Deck (3 Slots) -->
      <div class="priority-deck">
        <div class="priority-deck-header">
          <div class="priority-deck-title">
            <h3>Tier 1 · 3 Active Major Priorities</h3>
            <span class="v07-mini-badge" style="background:var(--gold);color:#0b1118;font-weight:700">Master Strategic Quests</span>
          </div>
          <span style="font-size:13px;color:var(--muted)">${activeMainCount} of 3 Slots Assigned</span>
        </div>
        <div class="main-priorities-grid" style="margin-top:12px">
          ${mainCardsHtml}
        </div>

        ${!isLocked && activeMainCount === 3 ? `
          <div style="margin-top:16px;text-align:center">
            <button type="button" class="button button-gold" id="btn-lock-main-priorities" style="width:100%;padding:12px;font-size:14px;font-weight:700">
              🔒 Lock & Confirm 3 Major Strategic Priorities for Cycle ${game?.year || 2028}
            </button>
            <small style="color:var(--muted);display:block;margin-top:6px">Locking commits these quests for the 2-year cycle and activates immediate acceptance bonuses.</small>
          </div>
        ` : ''}

        <!-- Draft-of-7 Hand -->
        <div class="draft-hand-container">
          <div class="draft-hand-header">
            <div>
              <b style="font-size:13.5px;color:var(--gold)">Draft-of-7 Hand (Cycle ${game?.year || 2028})</b>
              <span style="font-size:12px;color:var(--text-muted);display:block">Select up to 3 strategic directives from this cycle's dealt hand of 7 options.</span>
            </div>
            ${!isLocked ? `
              <button type="button" class="button btn-redraw-hand" id="btn-redraw-hand" ${canRedraw ? '' : 'disabled'}>
                🗘 Redraw Hand (${redrawCost} Action${redrawCost === 1 ? '' : 's'})
              </button>
            ` : '<span style="font-size:12px;color:var(--muted)">Hand Locked for Cycle</span>'}
          </div>
          <div class="draft-hand-grid">
            ${draftCardsHtml}
          </div>
        </div>
      </div>

      <!-- Party Focus Deck (Tier-scaled slots: 3 -> 5 -> 7) -->
      <div class="priority-deck" style="margin-top:28px">
        <div class="priority-deck-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <div class="priority-deck-title">
              <h3>Tier 2 · Party Focus (${maxFocusSlots} Slots)</h3>
              <span class="v07-mini-badge" style="background:#72bbf6;color:#0b1118;font-weight:700">Geographic & Policy Targets</span>
              ${isFocusesLocked ? '<span class="vibe-padlock-badge" style="font-size:11px;color:var(--gold);font-weight:700;margin-left:8px">🔒 LOCKED FOR CYCLE</span>' : ''}
            </div>
            <p class="priority-deck-subtitle" style="margin:4px 0 0">
              Direct up to ${maxFocusSlots} flexible targeted priorities (${safe(tierInfo.name)}: ${maxFocusSlots} slots unlocked; expands at Federally Recognized [5] and Major Party [7] status). Choices stage without bonuses until locked in.
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:13px;color:var(--muted)">${activeAdditionalCount} of ${maxFocusSlots} Slots Assigned</span>
            ${!isFocusesLocked ? `
              <button type="button" class="button button-gold" id="btn-lock-party-focuses" ${activeAdditionalCount === 0 || isDisabled ? 'disabled' : ''} style="font-weight:700;padding:8px 16px;font-size:13px">
                🔒 Lock In Party Focuses
              </button>
            ` : `
              <button type="button" class="button" disabled style="opacity:0.6;font-size:13px;padding:8px 16px">
                ✔ Focuses Committed
              </button>
            `}
          </div>
        </div>
        <div class="additional-priorities-list" style="margin-top:14px">
          ${additionalRowsHtml}
        </div>
      </div>

      ${majorPrioritiesConfirmModalOpen ? majorPrioritiesConfirmModalMarkup() : ''}
    </section>
  `;
}


/* ==========================================================================
   STEP 4: STATE LEGISLATIVE SLATE CONTESTATION
   ========================================================================== */
function step4StateLegMarkup() {
  const identity = playerIdentity();
  const isMajor = (V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(identity));
  const contestedStates = game.contestedStateSlates || game.stateLegislativeSlates || [];
  const stateSeatTotal = window.PartyChairData.VERSION_05_STATE_HOUSE_SEATS?.totalSeats || 7386;
  const actionsRemaining = game.organizingActionsRemaining ?? 20;

  if (isMajor) {
    return `
      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Step 4 of 5 · The Recruitment Phase</div>
            <h2>State Legislative Slate Contestation</h2>
          </div>
          <span class="v14-slate-status v14-slate-contested">Automatic Major Party Slates (98/98 Chambers)</span>
        </div>
        <p class="map-summary" style="margin-bottom:16px">
          As a major national party (<b>${safe(game.player?.name)}</b>), your state party committees and county apparatus automatically field full candidate slates across all 98 state legislative chambers nationwide without requiring committee treasury expenditures or direct leadership action.
        </p>
        <div class="v14-slate-card">
          <h3 style="color:var(--gold);margin:0 0 8px 0;font-size:18px">Nationwide Chamber Presence: 100% Contested</h3>
          <p style="margin:0 0 12px 0;font-size:13.5px;color:var(--text-muted)">
            All 50 states are actively contested on Election Night. Statewide legislative seats and chamber control will resolve organically via district partisan lean, candidate recruitment quality, and the piecewise bell-curve seat engine.
          </p>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <div><small style="color:var(--muted)">Contested Chambers</small><b style="display:block;font-size:18px;color:#84db9f">98 / 98</b></div>
            <div><small style="color:var(--muted)">Contested States</small><b style="display:block;font-size:18px;color:#84db9f">50 / 50</b></div>
            <div><small style="color:var(--muted)">Legislative Ratio</small><b style="display:block;font-size:18px;color:var(--gold)">Universal Allocation</b></div>
          </div>
        </div>
      </section>
    `;
  }

  // Bicameral 99-Chamber State Legislative Contestation UI (v0.16.9)
  const year = game.year || 2028;
  const allChambers = window.PartyChairData?.getBicameralChambersForYear
    ? window.PartyChairData.getBicameralChambersForYear(year)
    : [];
  const houseChambers = allChambers.filter((c) => c.chamber === 'house');
  const senateChambers = allChambers.filter((c) => c.chamber === 'senate' || c.chamber === 'unicameral');
  const visibleChambers = bicameralChamberFilter === 'house'
    ? houseChambers
    : bicameralChamberFilter === 'senate'
      ? senateChambers
      : allChambers;

  const partyTier = getPlayerTierInfo(game).tier;
  const coattailMap = window.PartyChairData?.SLATE_COATTAIL_BY_PARTY_TIER || { 0: 0.25, 1: 0.50, 2: 1.00, 3: 1.50, 4: 2.50, 5: 2.50 };
  const coattailPerChamber = coattailMap[partyTier] ?? 0.25;
  const tierMatrix = window.PartyChairData?.SLATE_TIER_MATRIX || {};
  const tierForChamber = (ch) => {
    const map = ch.chamber === 'house' ? (game.contestedStateHouseSlates || {}) : (game.contestedStateSenateSlates || {});
    return Number(map[ch.stateId] || 0);
  };
  const contestedChambersCount = allChambers.filter((ch) => ch.isOnCycle && tierForChamber(ch) > 0).length;

  return `
    <section class="panel section-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Step 4 of 5 · Bicameral Grassroots Haven (${year})</div>
          <h2>State Legislative Slate Contestation</h2>
        </div>
        <span class="turnout-chip ${contestedChambersCount > 0 ? '' : 'warning'}">${contestedChambersCount} of ${allChambers.length} Chambers Active</span>
      </div>
      <p class="map-summary" style="margin-bottom:12px">
        Here, you can contest the state legislative races. Major parties automatically contest every race, while smaller parties need to get candidates to sign up in bunches. Winning seats gives you a better starting point in future years, regardless of party tier
      </p>

      <div class="v14-slate-card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <div class="v07-filter-tabs">
            <button type="button" data-slate-filter="all" class="${bicameralChamberFilter === 'all' ? 'selected' : ''}">All (${allChambers.length})</button>
            <button type="button" data-slate-filter="house" class="${bicameralChamberFilter === 'house' ? 'selected' : ''}">State House (${houseChambers.length})</button>
            <button type="button" data-slate-filter="senate" class="${bicameralChamberFilter === 'senate' ? 'selected' : ''}">State Senate (${senateChambers.length})</button>
          </div>
          <div style="font-size:13px;color:var(--text)">
            <b>Actions Remaining:</b> ${actionsRemaining}
          </div>
        </div>
      </div>

      <div class="v165-chamber-grid">
        ${visibleChambers.map((ch) => {
          const curTier = tierForChamber(ch);
          const spec = tierMatrix[curTier] || { label: 'Uncontested', voteCap: 0, turnoutPenalty: 1 };
          const nextCycleLabel = ch.nextElectionYear % 4 === 0 ? 'Presidential' : 'Midterms';
          const votersGained = curTier * 1000;
          const activeCoattail = curTier > 0 ? coattailPerChamber : 0;
          return `
            <div class="v165-chamber-card ${ch.isOnCycle ? '' : 'v165-chamber-offcycle'} ${curTier > 0 ? 'is-active' : ''}">
              <div class="v165-chamber-head">
                <div>
                  <b>${safe(ch.label)}</b>
                  <small>${ch.isOnCycle ? `${ch.seatsUp} of ${ch.totalSeats} seats up in ${year}` : `Off-cycle · ${ch.totalSeats} seats`}</small>
                </div>
                <span class="v14-slate-status ${!ch.isOnCycle ? 'v14-slate-uncontested' : curTier > 0 ? 'v14-slate-contested' : 'v14-slate-uncontested'}">
                  ${!ch.isOnCycle ? 'Off-Cycle' : curTier > 0 ? `Tier ${curTier} / 5` : 'Uncontested'}
                </span>
              </div>
              ${!ch.isOnCycle ? `
                <div class="v165-offcycle-badge">🔒 Off-Cycle in ${year} (Next Election: ${ch.nextElectionYear} ${nextCycleLabel})</div>
              ` : `
                <div class="v165-yield-row">
                  <small>${safe(spec.label)}</small>
                </div>
                <div class="v165-stepper">
                  <button type="button" class="button button-small" data-slate-step="-1" data-state="${ch.stateId}" data-chamber="${ch.chamber}" ${curTier <= 0 ? 'disabled' : ''}>−</button>
                  <span class="v165-stepper-val">Tier ${curTier} / 5</span>
                  <button type="button" class="button button-small button-gold" data-slate-step="1" data-state="${ch.stateId}" data-chamber="${ch.chamber}" ${curTier >= 5 || actionsRemaining < 1 ? 'disabled' : ''}>+</button>
                </div>
              `}
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderStatewideExecutiveDrawerMarkup(year) {
  const data = window.PartyChairData || {};
  const registry = Array.isArray(data.STATEWIDE_OFFICES_REGISTRY) ? data.STATEWIDE_OFFICES_REGISTRY : [];
  const isOnCycle = data.isStatewideOfficeOnCycle || (() => true);
  const onCycleOffices = registry.filter((o) => isOnCycle(o, year));
  if (!onCycleOffices.length) return '';

  const byState = {};
  onCycleOffices.forEach((o) => {
    if (!byState[o.stateId]) byState[o.stateId] = [];
    byState[o.stateId].push(o);
  });
  const stateIds = Object.keys(byState).sort();
  const contestedMap = game.contestedStatewideOffices || {};
  const officers = (game.sittingMembers || []).filter((m) => m.office === 'statewide_executive');
  const officerByOfficeId = new Map(officers.map((m) => [m.officeId || `${m.stateId}-${m.subOffice}`, m]));
  const totalContested = onCycleOffices.filter((o) => contestedMap[o.id] || (window.PartyChairEngine?.hasAutomaticStatewideContestation?.(game, o.stateId))).length;

  return `
    <details class="v14-slate-card" style="margin-top:16px">
      <summary style="cursor:pointer;font-weight:700;display:flex;justify-content:space-between;align-items:center">
        <span>Statewide Elected Executive Offices (${year} · ${onCycleOffices.length} On-Cycle Seats across ${stateIds.length} States)</span>
        <span class="turnout-chip">${totalContested} / ${onCycleOffices.length} Contested</span>
      </summary>
      <p class="map-summary" style="margin:8px 0 12px">
        Contest independent statewide constitutional offices—Attorneys General, Secretaries of State, Treasurers, and sectoral commissioners. States where you hold the Governorship or any statewide seat are contested automatically; other seats cost <b>$500K + 1 Action</b> each or <b>$1.5M</b> for a full state slate.
      </p>
      <div class="v165-chamber-grid">
        ${stateIds.map((stId) => {
          const list = byState[stId];
          const autoFree = Boolean(window.PartyChairEngine?.hasAutomaticStatewideContestation?.(game, stId));
          const allContested = autoFree || list.every((o) => contestedMap[o.id]);
          return `
            <div class="v165-chamber-card ${allContested ? 'is-active' : ''}">
              <div class="v165-chamber-head">
                <div>
                  <b>${safe(stId)} Statewide Ticket</b>
                  <small>${list.length} seat${list.length === 1 ? '' : 's'} on ballot · ${autoFree ? 'Auto-Contested' : allContested ? 'Full Slate Filed' : 'Open Contestation'}</small>
                </div>
                ${!allContested ? `<button type="button" class="button button-small button-gold" data-contest-seo-slate="${safe(stId)}">Full Slate ($1.5M)</button>` : '<span class="v14-slate-status v14-slate-contested">Active</span>'}
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">
                ${list.map((o) => {
                  const inc = officerByOfficeId.get(o.id);
                  const holderParty = game.statewideOffices?.[o.id] || inc?.party || 'heritage';
                  const isContested = autoFree || Boolean(contestedMap[o.id]);
                  const partyTag = holderParty === 'people' ? 'D' : holderParty === 'heritage' ? 'R' : '3P';
                  return `
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;padding:4px 0;border-top:1px solid var(--line)">
                      <div>
                        <b>${safe(o.title)}</b>
                        <div style="color:var(--muted)">${safe(inc?.name || 'Incumbent')} (${partyTag}) · Q ${Number(inc?.quality || 7.0).toFixed(1)}</div>
                      </div>
                      ${isContested
                        ? '<span class="v14-slate-status v14-slate-contested">Filed</span>'
                        : `<button type="button" class="button button-small" data-contest-seo="${safe(o.id)}">Contest ($500K)</button>`}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </details>
  `;
}

function step3PrimariesMarkup() {
  const data = window.PartyChairData;
  const parties = partyList(game);
  const partyOptions = parties.map((p) => {
    const key = (p.id === 'player' && !p.custom) ? (p.baseTemplateId || 'people') : p.id;
    return { id: key, name: p.name, label: `${p.name} Primary` };
  });

  // REQ-111: Strict Party Scoping for Primary Endorsements
  primaryParty = playerIdentity();

  const currentPartyObj = partyOptions.find((p) => p.id === primaryParty) || partyOptions[0];

  if (game.primariesResolved) {
    return `<section class="panel section-panel"><div class="eyebrow">Step 3 of 5 · Primaries Complete</div><h2>${game?.year || 2028} Primary Nominees Selected</h2><p>${safe(game.primaryResultSummary || `The ${game?.year || 2028} primaries have resolved.`)}</p></section>`;
  }

  const senateClass = game.activeSenateClass || 3;
  const senateClassRoman = senateClass === 1 ? 'I' : senateClass === 2 ? 'II' : 'III';
  const activeSenateRacesList = game.activeSenateRaces || data.VERSION_01_SENATE_RACES || [];
  const activeGovStatesList = game.activeGubernatorialStates || data.VERSION_01_GUBERNATORIAL_ELECTIONS || [];

  const senateRaces = activeSenateRacesList.map((race) => {
    const stateObj = STATES.find((s) => s.id === race.state);
    return { id: `senate:${race.state}`, kind: 'senate', stateId: race.state, label: `${race.state} · ${stateObj?.name || race.state} Senate (Class ${senateClassRoman})` };
  });
  const govRaces = activeGovStatesList.map((stateId) => {
    const stateObj = STATES.find((s) => s.id === stateId);
    return { id: `governor:${stateId}`, kind: 'governor', stateId, label: `${stateId} · ${stateObj?.name || stateId} Governor (${game?.year || 2028})` };
  });
  const houseRaces = (data.VERSION_01_HOUSE_DISTRICTS || []).map((district) => ({
    id: `house:${district.id}`,
    kind: 'house',
    stateId: district.stateId,
    label: `House · ${district.id}`,
  }));
  // v0.16.9.1: Other Statewide Offices (on-cycle partisan statewide executives grouped by state)
  const allStatewideRaces = (data.STATEWIDE_OFFICES_REGISTRY || [])
    .map((o) => {
      const stateObj = STATES.find((s) => s.id === o.stateId);
      return {
        id: `statewide:${o.id}`,
        officeId: o.id,
        kind: 'statewide',
        stateId: o.stateId,
        title: o.title,
        officeDef: o,
        nextElectionYear: o.nextElectionYear,
        label: `${o.stateId} · ${o.title} (${stateObj?.name || o.stateId})`,
      };
    });
  const statewideStates = [...new Set(allStatewideRaces.map((r) => r.stateId))].sort();
  if (primaryFilter === 'statewide') {
    if (!primaryStatewideState || !statewideStates.includes(primaryStatewideState)) {
      const fromRace = primaryRace?.startsWith('statewide:') ? primaryRace.split(':')[1].split('-')[0] : null;
      primaryStatewideState = (fromRace && statewideStates.includes(fromRace)) ? fromRace : (statewideStates[0] || 'NC');
    }
  }
  const statewideRacesForSelectedState = allStatewideRaces.filter((r) => r.stateId === primaryStatewideState);

  // REQ-114: State leg races removed from Step 3 and given dedicated Step 4
  const poolByFilter = {
    senate: senateRaces,
    governor: govRaces,
    statewide: statewideRacesForSelectedState.length ? statewideRacesForSelectedState : allStatewideRaces,
    minor: [...senateRaces, ...govRaces],
    house: houseRaces,
  };
  const currentList = poolByFilter[primaryFilter] || senateRaces;
  if (!currentList.some((r) => r.id === primaryRace)) {
    primaryRace = currentList[0]?.id || 'senate:GA';
  }

  const parts = primaryRace.split(':');
  const stateId = parts[0] === 'state-leg' ? parts[1] : parts[1].split('-')[0];
  const stateObj = STATES.find((s) => s.id === stateId);
  const rawField = game.primaryFields?.[primaryRace]?.[primaryParty]
    || (primaryRace.startsWith('statewide:') && window.PartyChairEngine?.version01CandidateField
      ? window.PartyChairEngine.version01CandidateField(game, primaryRace, primaryParty)
      : data.VERSION_01_PRIMARY_FIELD(primaryRace, stateObj?.name || stateId, primaryParty, game.seed));
  const endorsedId = game.primaryEndorsements?.[primaryRace] || game.raceEndorsements?.[primaryRace];
  const field = (rawField || []).map((c) => {
    const norm = V07 ? V07.normalizeCandidateRecord(c, `${game.seed}:${c.id}`) : c;
    return { ...norm, endorsed: Boolean(norm.endorsed || (endorsedId && norm.id === endorsedId)) };
  });

  const sittingIncumbent = field.find((c) => c.isIncumbent || c.incumbent);
  const recruit = field.find((c) => c.recruit) || (() => {
    const r = data.VERSION_01_STATE_RECRUIT(primaryRace, stateObj?.name || stateId, primaryParty, game.seed, game.chairTurn || 0);
    return V07 ? V07.normalizeCandidateRecord(r, `${game.seed}:${primaryRace}:recruit`, 7) : r;
  })();
  const stateStandouts = (game.stateLegStandouts?.[primaryParty] || game.stateLegStandouts?.[game.player?.id] || []);
  const matchingStandout = stateStandouts.find((s) => (s.state || s.stateId) === stateId);
  const isStatehouseStandoutRecruit = Boolean(recruit.isStateLegStandout || recruit.office === 'stateLeg' || matchingStandout);
  const recruitCost = isStatehouseStandoutRecruit ? 0 : 1; // $0 cost for sitting state lawmakers
  const happiness = Math.round(game.sittingMemberHappiness ?? 70);
  const endorsedCount = Object.keys(game.primaryEndorsements || {}).length;

  const threshold = ['NC', 'GA', 'OH', 'PA', 'TX', 'MI', 'WI', 'NV', 'AZ', 'FL'].includes(stateId) ? '5%' : '2%';
  const presMarginVal = window.PartyChairEngine?.presidentialStateMargin ? window.PartyChairEngine.presidentialStateMargin(game, stateId) : 0;
  const isSpoiler = Math.abs(presMarginVal) <= 3.5;
  const isDoubleDigit = field.some((c) => (c.poll || 0) >= 10);
  const commissionedPoll = game.commissionedPolls?.[primaryRace];
  const isHouse = primaryRace.startsWith('house:');
  const pollCost = isHouse ? 1.0 : 2.0;

  const benchMembers = (game.roster || []).map((id) => memberById(id)).filter(Boolean);

  const primaryRaceStateId = primaryRace && primaryRace.includes(':') ? primaryRace.split(':')[1].split('-')[0] : null;
  const candidateCards = field.map((candidate) => {
    const isThisEndorsed = candidate.endorsed || endorsedId === candidate.id;
    const isThisIncumbent = Boolean(candidate.isIncumbent || candidate.incumbent);
    const triggersBacklash = Boolean(sittingIncumbent && !isThisIncumbent);
    const ratings = candidate.ratings || {};
    const eraBadges = candidateEraBadgeMarkup(candidate, primaryRaceStateId || candidate.stateId);

    // REQ-212: Qualitative Vetting Tier & Vet Candidate Action
    const vettingRecord = game.candidateVetting?.[candidate.id] || (candidate.isVetted ? {
      vetted: true,
      tier: candidate.vulnerabilityTier || 'Clean',
      label: candidate.vulnerabilityTier === 'Toxic' ? 'Toxic Record' : candidate.vulnerabilityTier === 'Baggage' ? 'Significant Baggage' : candidate.vulnerabilityTier === 'Minor' ? 'Minor Vulnerabilities' : 'Clean Record',
      summary: candidate.vettingReport || 'Clean Record — Comprehensive vetting reveals no significant liabilities.'
    } : null);
    const isVetted = Boolean(candidate.isVetted || vettingRecord?.vetted);
    const vettingTier = vettingRecord?.tier || (candidate.vulnerabilityTier || 'Clean');
    const tierClass = `tier-${vettingTier.toLowerCase()}`;
    const vettingBadge = isVetted
      ? `<span class="v07-mini-badge v07-vetting-badge ${tierClass}" title="${safe(vettingRecord?.summary || 'Candidate has been formally vetted')}">Vetted: ${safe(vettingRecord?.label || vettingTier)}</span>`
      : '';
    const vetButton = (!isVetted && game.phase === 'organizing')
      ? `<button type="button" class="button button-small v07-vet-btn" data-action="vet-candidate" data-candidate="${candidate.id}" title="Spend $500k to conduct comprehensive background opposition vetting" ${(game.treasury || 0) < 0.5 ? 'disabled' : ''}>Vet Candidate ($500k)</button>`
      : '';

    return `<article class="v07-candidate-card ${isThisEndorsed ? 'endorsed' : ''} ${triggersBacklash ? 'backlash-risk' : ''}">
      <div class="v07-candidate-top">
        <div>
          <div class="v07-candidate-badges">
            <b>${safe(candidate.name)}</b>
            ${isThisIncumbent ? `<span class="v07-incumbent-badge" title="Sitting member of Congress/Governor">INCUMBENT</span>` : ''}
            ${candidate.recruit ? `<span class="v07-mini-badge">STATE RECRUIT</span>` : ''}
            ${(candidate.isStateLegStandout || candidate.office === 'stateLeg') ? `<span class="v07-mini-badge statehouse-standout-badge">★ SITTING STATE LAWMAKER</span>` : ''}
            ${eraBadges}
            ${vettingBadge}
            ${memberMetricsBadgesMarkup(candidate, `<span class="v07-quality-badge">Quality ${candidate.quality || 6}/10</span>`)}
          </div>
          <small>${safe(resolveMemberFactionName(candidate))} · Primary Poll: <b>${Math.max(0, Math.round(candidate.poll || 15))}%</b></small>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          ${vetButton}
          <button type="button" class="button ${isThisEndorsed ? 'button-gold' : ''}"
            data-action="candidate-endorse"
            data-race="${primaryRace}"
            data-party="${primaryParty}"
            data-candidate="${candidate.id}"
            title="${isThisEndorsed ? 'Filtered national party support active for this candidate' : 'Filter national party resources and institutional backing (+10 pts in primary)'}"
            ${game.phase !== 'organizing' || isThisEndorsed ? 'disabled' : ''}>
            ${isThisEndorsed ? 'Filtered Support ✓' : 'Filtering support'}
          </button>
        </div>
      </div>
      ${isVetted && vettingRecord?.summary ? `<div class="v07-vetting-report ${tierClass}" style="margin:6px 0;font-size:12px;font-style:italic;color:var(--text-muted);">${safe(vettingRecord.summary)}</div>` : ''}
      ${triggersBacklash ? `<div class="v07-backlash-warning">⚠ Sitting Incumbent Protection Alert: Filtering support for ${safe(candidate.name)} instead of incumbent ${safe(sittingIncumbent.name)} causes <b>-18 Sitting Member Happiness</b> and <b>-8 Base Supporter Trust</b>.</div>` : ''}
      ${statBarsMarkup(ratings, false)}
    </article>`;
  }).join('');

  return `
        <section class="panel section-panel candidate-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Step 3 of 5 · The Recruitment Phase</div>
          <h2>Filter Primary Support</h2>
        </div>
        <div class="v07-happiness-pill ${happiness < 45 ? 'bad' : happiness < 65 ? 'warn' : ''}">
          Sitting Member Happiness: <b>${happiness}/100</b>
        </div>
      </div>
      <p class="section-intro">Inspect 10-stat ratings, Fame scores, and incumbent status across every active <b>Senate Class ${senateClassRoman}</b> and <b>${game?.year || 2028} Governor</b> primary. Filter support for 1 candidate per race (${endorsedCount} total race filtered support allocation${endorsedCount === 1 ? '' : 's'} active). Small parties without filed candidates can recruit state prospects below.</p>

      <div class="v07-filter-tabs">
        <button type="button" data-primary-filter="senate" class="${primaryFilter === 'senate' ? 'selected' : ''}">Senate Class ${senateClassRoman} (${senateRaces.length})</button>
        <button type="button" data-primary-filter="governor" class="${primaryFilter === 'governor' ? 'selected' : ''}">${game?.year || 2028} Governors (${govRaces.length})</button>
        <button type="button" data-primary-filter="statewide" class="${primaryFilter === 'statewide' ? 'selected' : ''}">Other Statewide Offices (${allStatewideRaces.length})</button>
        <button type="button" data-primary-filter="house" class="${primaryFilter === 'house' ? 'selected' : ''}">House (${houseRaces.length})</button>
      </div>

      ${(primaryFilter === 'senate' || primaryFilter === 'governor' || primaryFilter === 'minor') ? `
        <div class="v07-race-pills">
          ${currentList.map((r) => {
            const hasEndorsed = Boolean(game.primaryEndorsements?.[r.id] || game.raceEndorsements?.[r.id]);
            return `<button type="button" class="v07-race-pill ${primaryRace === r.id ? 'selected' : ''} ${hasEndorsed ? 'done' : ''}" data-pick-race="${r.id}">${safe(r.stateId)} ${hasEndorsed ? '✓' : ''}</button>`;
          }).join('')}
        </div>` : ''}

      ${primaryFilter === 'statewide' ? `
        <div class="v07-race-pills" style="margin-bottom:8px">
          ${statewideStates.map((stId) => {
            const stRaces = allStatewideRaces.filter((r) => r.stateId === stId);
            const anyEndorsed = stRaces.some((r) => Boolean(game.primaryEndorsements?.[r.id] || game.raceEndorsements?.[r.id]));
            return `<button type="button" class="v07-race-pill ${primaryStatewideState === stId ? 'selected' : ''} ${anyEndorsed ? 'done' : ''}" data-pick-statewide-state="${stId}">${safe(stId)} (${stRaces.length}) ${anyEndorsed ? '✓' : ''}</button>`;
          }).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;padding:8px 10px;background:var(--panel2);border:1px solid var(--line);border-radius:8px">
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
            ${statewideRacesForSelectedState.map((r) => {
              const hasEndorsed = Boolean(game.primaryEndorsements?.[r.id] || game.raceEndorsements?.[r.id]);
              const isOn = data.isStatewideOfficeOnCycle ? data.isStatewideOfficeOnCycle(r.officeDef || r, game.year || 2028) : true;
              const cycleTag = isOn ? '' : ` (Off-Cycle · ${r.nextElectionYear || ((game.year || 2028) + 2)})`;
              return `<button type="button" class="button button-small ${primaryRace === r.id ? 'button-gold' : ''}" data-pick-race="${r.id}" style="${isOn ? '' : 'opacity:0.75'}">${safe(r.title)}${safe(cycleTag)} ${hasEndorsed ? '✓' : ''}</button>`;
            }).join('')}
          </div>
          ${(() => {
            const autoFree = Boolean(window.PartyChairEngine?.hasAutomaticStatewideContestation?.(game, primaryStatewideState));
            const curOfficeId = primaryRace.startsWith('statewide:') ? primaryRace.split(':')[1] : '';
            const curContested = autoFree || Boolean(game.contestedStatewideOffices?.[curOfficeId]);
            const allStContested = autoFree || statewideRacesForSelectedState.every((r) => Boolean(game.contestedStatewideOffices?.[r.officeId]));
            if (allStContested) return '<span class="v14-slate-status v14-slate-contested">Statewide Slate Contested</span>';
            return `<div style="display:flex;gap:6px">
              ${!curContested && curOfficeId ? `<button type="button" class="button button-small" data-contest-seo="${safe(curOfficeId)}">Contest Seat ($500K)</button>` : ''}
              <button type="button" class="button button-small button-gold" data-contest-seo-slate="${safe(primaryStatewideState)}">Full ${safe(primaryStatewideState)} Slate ($1.5M)</button>
            </div>`;
          })()}
        </div>` : ''}

      <div class="inline-controls" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <select id="primary-race" style="flex:2">${currentList.map((race) => `<option value="${race.id}" ${primaryRace === race.id ? 'selected' : ''}>${safe(race.label)} ${game.primaryEndorsements?.[race.id] ? '✓' : ''}</option>`).join('')}</select>
        <select id="primary-party" style="flex:1" disabled title="Locked to your party (${safe(currentPartyObj?.name || primaryParty)})">
          <option value="${safe(primaryParty)}" selected>${safe(currentPartyObj?.name || primaryParty)} Primary (Active)</option>
        </select>
        <button type="button" class="button button-small button-gold" data-action="commission-poll-btn" data-race="${primaryRace}" ${game.treasury < pollCost ? 'disabled' : ''}>
          Commission Poll ($${pollCost}M)
        </button>
      </div>

      <!-- Minor Party Race Tracking & Ballot Access Alerts -->
      <div class="vibe-race-alerts" style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 14px">
        <span class="ballot-access-badge" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(85,191,120,0.15);border:1px solid #55bf78;border-radius:4px;font-size:12px;font-weight:600;color:#55bf78" title="Statutory retention threshold to preserve statewide minor party ballot line">
          🏛 Ballot Access Battle (${threshold} Retention Threshold)
        </span>
        ${isSpoiler ? `
          <span class="spoiler-alert-badge" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(231,76,60,0.15);border:1px solid #e74c3c;border-radius:4px;font-size:12px;font-weight:600;color:#e74c3c" title="Projected minor vote margin falls within major party spread">
            ⚠️ Spoiler Contested Race
          </span>
        ` : ''}
        ${isDoubleDigit ? `
          <span class="viability-alert-badge" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(226,189,112,0.15);border:1px solid var(--gold);border-radius:4px;font-size:12px;font-weight:600;color:var(--gold)" title="Minor party candidate exceeds double-digit statutory benchmark">
            ⚡ Double-Digit Viable (≥10%)
          </span>
        ` : ''}
      </div>

      ${commissionedPoll ? `
        <div class="commissioned-poll-snapshot" style="padding:10px 14px;background:rgba(226,189,112,0.12);border:1px solid var(--gold);border-radius:6px;margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <b style="color:var(--gold);font-size:12px;text-transform:uppercase">🎯 Commissioned Accurate Poll Snapshot</b>
            <small style="color:var(--text-muted)">Conducted ${safe(commissionedPoll.timestamp)}</small>
          </div>
          <div style="display:flex;gap:14px;margin-top:6px;font-size:13px;flex-wrap:wrap">
            <span>Democratic: <b>${commissionedPoll.shares.people}%</b></span>
            <span>Republican: <b>${commissionedPoll.shares.heritage}%</b></span>
            <span>Libertarian: <b>${commissionedPoll.shares.liberty}%</b></span>
            <span>Green: <b>${commissionedPoll.shares.green}%</b></span>
            <span style="color:var(--gold)">Leader: <b>${safe(commissionedPoll.leader)} (+${commissionedPoll.margin}%)</b></span>
          </div>
        </div>
      ` : ''}

      ${benchMembers.length > 0 ? `
        <div class="deploy-bench-leader-strip" style="margin:10px 0 16px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.18);border-radius:6px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <div>
            <b style="font-size:13px;color:var(--gold)">Deploy Bench Leader to Run</b>
            <small style="display:block;color:var(--text-muted)">Transfers personal Fame & Popularity directly into candidate baseline quality.</small>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <select id="deploy-leader-select" style="padding:4px 8px;border-radius:4px;background:var(--surface,#18202c);color:#fff;border:1px solid rgba(255,255,255,0.2)">
              ${benchMembers.map((m) => `<option value="${m.id}">${safe(m.name)} (Fame ${m.fame || 50} · Pop ${m.popularity || 50})</option>`).join('')}
            </select>
            <button type="button" class="button button-small button-gold" data-action="deploy-leader-candidate-btn" data-race="${primaryRace}">Deploy Candidate</button>
          </div>
        </div>
      ` : ''}

      <div class="v07-candidate-grid">
        ${field.length > 0 ? candidateCards : `
          <div class="empty-field-notice" style="grid-column:1 / -1;padding:24px 20px;text-align:center;background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.14);border-radius:8px;">
            <p style="margin:0 0 6px 0;font-size:14px;font-weight:600;color:var(--text)">No candidates currently filed in the ${safe(currentPartyObj?.name || primaryParty)} primary.</p>
            <p style="margin:0;font-size:12.5px;color:var(--text-muted)">Encourage and recruit a candidate below to field this seat for your party.</p>
          </div>
        `}
      </div>

      <article class="recruit-prospect v07-recruit-card">
        <div class="v07-recruit-info">
          <div class="eyebrow">${safe(stateObj?.name || stateId)} · ${safe(currentPartyObj?.name || primaryParty)} State Candidate Recruit (Avg Quality 7)</div>
          <div class="v07-candidate-badges">
            <b>${safe(matchingStandout ? matchingStandout.name : recruit.name)}</b>
            ${isStatehouseStandoutRecruit ? `<span class="v07-mini-badge statehouse-standout-badge">★ SITTING STATE LAWMAKER</span>` : ''}
            ${memberMetricsBadgesMarkup(matchingStandout || recruit, `<span class="v07-quality-badge">Quality ${(matchingStandout || recruit).quality || 7}/10</span>`)}
          </div>
          <small>${safe(resolveMemberFactionName(matchingStandout || recruit))} · Projected primary poll ${Math.max(0, Math.round((matchingStandout || recruit).poll || 18))}%</small>
          ${statBarsMarkup((matchingStandout || recruit).ratings || {}, true)}
        </div>
        <button type="button" class="button button-small" data-action="encourage-state-recruit" data-race="${primaryRace}" data-party="${primaryParty}"
          ${game.phase !== 'organizing' || (game.organizingActionsRemaining ?? game.actionsLeft) <= 0 || (recruitCost > 0 && game.treasury < recruitCost) || field.some((c) => c.recruit) ? 'disabled' : ''}>
          ${field.some((c) => c.recruit) ? 'In Primary ✓' : isStatehouseStandoutRecruit ? 'Recruit · Free ($0) (1 action)' : `Recruit · ${money(recruitCost)} (1 action)`}
        </button>
      </article>

      ${(() => {
        const isThirdOrCustom = Boolean(game.player?.custom) || !['people', 'heritage'].includes(primaryParty);
        const isFusionRace = ['senate:', 'governor:', 'house:'].some((prefix) => String(primaryRace).startsWith(prefix));
        if (!isThirdOrCustom || !isFusionRace) return '';
        const tierInfo = getPlayerTierInfo(game);
        const existingFusion = game.fusionEndorsements?.[primaryRace];
        const pledges = window.PartyChairData?.FUSION_POLICY_PLEDGES || [
          { id: 'pledge-electoral-reform', label: 'Ballot Access & Ranked-Choice Pledge', description: 'Commits the cross-endorsed nominee to back open ballot access and anti-spoiler electoral reforms.' },
        ];
        const defaultPartner = fusionPartnerSelection || (['green', 'socialist'].includes(primaryParty) ? 'people' : ['liberty', 'constitution'].includes(primaryParty) ? 'heritage' : 'people');
        const activePledge = pledges.find((pl) => pl.id === fusionPledgeSelection) || pledges[0];
        const totalFusions = Object.keys(game.fusionEndorsements || {}).length;
        const leverage = Number(game.fusionLegislativeLeverage || 0);

        if (existingFusion) {
          return `
            <div class="v159-fusion-card v159-fusion-active">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <div>
                  <div class="eyebrow" style="color:var(--gold)">Active Fusion Ballot Line · Cross-Endorsement Secured</div>
                  <b style="font-size:15px">${safe(existingFusion.candidateName)} (${existingFusion.partnerPartyId === 'people' ? 'Democratic' : 'Republican'} + ${safe(game.player.name)} Fusion Line)</b>
                </div>
                <span class="v159-sys-badge sys-rcv">Fusion Active ✓</span>
              </div>
              <p style="margin:6px 0 0;font-size:12.5px;color:var(--muted)">
                Signed Pledge: <b style="color:var(--text)">${safe(existingFusion.policyPledgeLabel)}</b> · Delivers state ballot retention credit, fusion-line voter conversions, and legislative leverage on victory.
              </p>
            </div>
          `;
        }

        if (tierInfo.tier < 2) {
          return `
            <div class="v159-fusion-card" style="opacity:0.78">
              <div class="eyebrow">Fusion Voting & Cross-Endorsement Ballot Line</div>
              <b style="font-size:14px">🔒 Unlocks at Ballot-Qualified Minor Status (Tier 2)</b>
              <p style="margin:5px 0 0;font-size:12.5px;color:var(--muted)">
                Reach 2% national presidential vote or secure multi-state ballot lines to cross-endorse major-party nominees in exchange for binding Policy Pledges, ballot retention credit, and voter registration growth.
              </p>
            </div>
          `;
        }

        return `
          <div class="v159-fusion-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
              <div>
                <div class="eyebrow" style="color:#7ee3d4">Fusion Voting & Cross-Endorsement Ballot Line</div>
                <b style="font-size:15px">Offer Your Ballot Line to a Major-Party Nominee</b>
                <p style="margin:4px 0 0;font-size:12.5px;color:var(--muted)">
                  Instead of running a spoiler campaign in ${safe(primaryRace)}, cross-endorse a friendly major-party nominee who signs your Policy Pledge. Earns state ballot retention credit, voter registration conversions, and ideological leverage.
                </p>
              </div>
              ${(totalFusions > 0 || leverage > 0) ? `<span class="turnout-chip">${totalFusions} Fusion Line${totalFusions === 1 ? '' : 's'} · ${leverage} Leg. Leverage</span>` : ''}
            </div>
            <div class="v159-fusion-controls">
              <div>
                <label for="fusion-partner-select">Major-Party Nominee</label>
                <select id="fusion-partner-select">
                  <option value="people" ${defaultPartner === 'people' ? 'selected' : ''}>Democratic Party Nominee</option>
                  <option value="heritage" ${defaultPartner === 'heritage' ? 'selected' : ''}>Republican Party Nominee</option>
                </select>
              </div>
              <div>
                <label for="fusion-pledge-select">Required Policy Pledge</label>
                <select id="fusion-pledge-select">
                  ${pledges.map((pl) => `<option value="${safe(pl.id)}" ${activePledge.id === pl.id ? 'selected' : ''}>${safe(pl.label)}</option>`).join('')}
                </select>
              </div>
              <button type="button" class="button button-small button-gold" id="btn-offer-fusion-endorsement" data-race="${safe(primaryRace)}"
                ${game.phase !== 'organizing' || (game.organizingActionsRemaining ?? game.actionsLeft) <= 0 ? 'disabled' : ''}>
                Offer Fusion Line (1 Action)
              </button>
            </div>
            <small style="display:block;margin-top:8px;color:var(--muted);font-size:12px">
              <b>Pledge Terms:</b> ${safe(activePledge.description || '')}
            </small>
          </div>
        `;
      })()}
    </section>`;
}

function availableBillEndorsers() {
  const endorsed = game.pendingBill?.endorsements || [];
  const allies = { organizers: ['workers', 'localists'], workers: ['organizers', 'reformers'], reformers: ['organizers', 'funders'], localists: ['pragmatists', 'organizers'], pragmatists: ['localists', 'funders'], funders: ['pragmatists', 'workers'] };
  const bill = BILLS.find((candidate) => candidate.id === game.pendingBill?.id);
  const allowed = endorsed.length ? new Set(endorsed.flatMap((id) => allies[id] || [])) : new Set(bill?.supporters || []);
  const pse = window.PartySystemsEngine;
  const tripartite = pse && game.pendingBill ? pse.getBillSignoffRequirement(game, game.pendingBill) : { required: false };
  const baseMatches = FACTIONS.filter((faction) => allowed.has(faction.id) && !endorsed.includes(faction.id));
  if (tripartite.required && pse) {
    const allFacs = [...FACTIONS, ...(game.factions || [])];
    const seen = new Set(baseMatches.map((f) => f.id));
    allFacs.forEach((f) => {
      if (!f || seen.has(f.id) || endorsed.includes(f.id)) return;
      if (pse.isLaborFaction(f) || pse.isBusinessFaction(f)) {
        seen.add(f.id);
        baseMatches.push(f);
      }
    });
  }
  return baseMatches;
}

function legislationMarkup() {
  const bill = BILLS.find((candidate) => candidate.id === game.pendingBill?.id);
  const passed = (game.passedBills || []).slice(-5).reverse();
  if (!bill && !passed.length) return `<p class="quiet-note">No state policy bills have been introduced yet. Choose an eligible state in Step 4 to enact state policy legislation.</p>`;
  const billStatus = bill ? `<div class="bill-status"><b>${safe(bill.name)} (${safe(game.pendingBill.stateName || game.pendingBill.stateId)})</b><small>${safe(bill.effect)}</small><div class="bill-chain">${game.pendingBill.endorsements.length ? game.pendingBill.endorsements.map((id) => `<span>${safe(FACTIONS.find((faction) => faction.id === id)?.name || id)}</span>`).join('<i>→</i>') : '<span>Awaiting first endorsement</span>'}</div><small>${game.pendingBill.endorsements.length} faction endorsement(s)</small></div>` : '';
  const history = passed.map((entry) => {
    const item = BILLS.find((candidate) => candidate.id === entry.id);
    const boostVal = Number(entry.boost !== undefined ? entry.boost : 3.5);
    const sign = boostVal >= 0 ? '+' : '';
    return item ? `<div class="passed-bill"><span>${entry.stateId || entry.year}</span><b>${safe(item.name)} (${sign}${boostVal.toFixed(1)} support in ${safe(entry.stateName || entry.stateId || 'state')})</b></div>` : '';
  }).join('');
  return `${billStatus}${history ? `<div class="passed-bills"><small>Recently enacted</small>${history}</div>` : ''}`;
}

function step4WorkMarkup() {
  if (game.phase === 'organizing' && (game.actionsLeft <= 0 || typeof game.actionsLeft !== 'number') && (game.organizingActionsRemaining > 0)) {
    game.actionsLeft = Math.min(4, game.organizingActionsRemaining);
  }
  const actionsRemaining = typeof game.organizingActionsRemaining === 'number'
    ? game.organizingActionsRemaining
    : (game.actionsLeft || 0);
  const disabled = actionsRemaining <= 0 || game.phase === 'complete' ? 'disabled' : '';
  const identity = playerIdentity();
  const activeBill = BILLS.find((bill) => bill.id === game.pendingBill?.id);
  const happiness = game.sittingMemberHappiness ?? 70;
  const requiredEndorsements = happiness >= 75 || (happiness >= 55 && game.seats >= 218) ? 2 : 3;
  const unpassedBills = BILLS;
  const leastExpensiveBill = Math.min(...unpassedBills.map((bill) => bill.cost));
  const endorsers = availableBillEndorsers();

  // REQ-14: State-Targeted Policy Bills (States where player party controls >= 1 legislative chamber)
  const billEligibleStates = STATES.filter((s) => V07 ? V07.canIntroduceBillInState(game, s.id, identity) : true);

  // REQ-15: All 50 States for Chapter Expansion & Tours
  const selectedChapterState = getSelectedActionState('chapter-state', mapState);
  const stateChapterOptions = STATES.map((s) => `<option value="${s.id}" ${s.id === selectedChapterState ? 'selected' : ''}>${s.id} · ${safe(s.name)} (${stateChaptersFor(s.id)} chapters)</option>`).join('');

  // REQ-168: Keynote and Tour pools strictly restricted to actively appointed Party Leaders
  const appointedLeaderIds = Object.values(game.leadershipRoles?.player || game.player?.leadershipRoles || {}).filter(Boolean);
  const partyLeaderPool = appointedLeaderIds
    .map((id) => memberById(id))
    .filter((m) => m && (m.party === identity || (identity === 'player' && (!m.party || m.party === 'player'))));
  const currentKeynote = game.keynoteSpeakerId ? memberById(game.keynoteSpeakerId) : null;

  // Active races for recruit shortcut
  const recruitSenateClass = game.activeSenateClass || 3;
  const recruitSenateRoman = recruitSenateClass === 1 ? 'I' : recruitSenateClass === 2 ? 'II' : 'III';
  const activeSenateRacesList2 = game.activeSenateRaces || window.PartyChairData.VERSION_01_SENATE_RACES || [];
  const activeGovStatesList2 = game.activeGubernatorialStates || window.PartyChairData.VERSION_01_GUBERNATORIAL_ELECTIONS || [];
  const recruitRaces = [
    ...activeSenateRacesList2.map((r) => ({ id: `senate:${r.state}`, label: `Senate Class ${recruitSenateRoman} · ${r.state}` })),
    ...activeGovStatesList2.map((st) => ({ id: `governor:${st}`, label: `Governor ${game?.year || 2028} · ${st}` })),
  ];

  return `
    <section class="panel action-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Step 5 of 5 · The Recruitment Phase</div>
          <h2>Execute Party Machine Operations</h2>
        </div>
        <span class="action-count">${game.organizingActionsRemaining ?? game.actionsLeft ?? 20} <small>actions left</small></span>
      </div>
      <div class="v13-action-pool-meter">
        <span class="v13-action-counter-pill">[ ${game.organizingActionsRemaining ?? game.actionsLeft ?? 20} Actions Remaining ]</span>
        <p>Spend your 20 pre-campaign leadership actions on 50-state chapters, legislative bills, voter drives, and candidate recruitment before advancing to the general campaign.</p>
      </div>
      ${activeEraFeedbackBannerMarkup()}

      <div class="action-grid">
        <!-- 1. Open a State Chapter -->
        ${(() => {
          const pseChUi = window.PartySystemsEngine;
          const chCostMult = pseChUi ? pseChUi.getChapterCostModifier(game) : 1.0;
          const chCost = Math.round(6 * chCostMult * 10) / 10;
          const costBadge = chCost === 0 ? '1 action · Free ($0M)' : `1 action · $${chCost}M`;
          return `
        <div class="action-card">
          <div class="action-head"><i>✳</i><b>Open a State Chapter (50 States)</b><span>${costBadge}</span></div>
          <p>Expand grassroots field infrastructure in any specific state. Local Youth Chapters operate under each state network.</p>
          <div class="inline-controls">
            <select id="chapter-state">${stateChapterOptions}</select>
            <button type="button" class="button button-small v09-btn-chapter-75" data-action="chapter" ${disabled || game.treasury < chCost ? 'disabled' : ''}>Open State Chapter</button>
          </div>
        </div>`;
        })()}

        <!-- 2. Statewide Voter Registration & Outreach -->
        ${(() => {
          const regTier = getPlayerTierInfo(game).tier;
          const regSpec = window.PartyChairEngine?.getRegistrationTierSpec
            ? window.PartyChairEngine.getRegistrationTierSpec(regTier)
            : { cost: regTier, yield: [100, 1000, 2000, 3000, 5000, 10000][regTier] || 100 };
          const regDisabled = disabled || (game.treasury < regSpec.cost);
          return `
        <div class="action-card v164-registration-card">
          <div class="action-head"><i>📋</i><b>Statewide Voter Registration &amp; Outreach</b><span>1 action · ${regSpec.cost}M</span></div>
          <p>Target demographic communities or unaligned Independents inside a state to permanently expand your party's registered voter base (+${regSpec.yield.toLocaleString()} registered voters at current institutional status).</p>
          <div class="inline-controls">
            <select id="reg-state">${STATES.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('reg-state', mapState) ? 'selected' : ''}>${s.id} · ${safe(s.name)}</option>`).join('')}</select>
            <button type="button" class="button button-small button-gold" data-action="voter-registration-drive" ${regDisabled ? 'disabled' : ''}>Register</button>
          </div>
        </div>`;
        })()}

        <!-- [v0.18.4 MAPS-BALLOT] Sponsor Ballot Initiative -->
        ${window.RedistrictingBallotSystem?.renderBallotInitiativeActionCard ? window.RedistrictingBallotSystem.renderBallotInitiativeActionCard(game, { disabled, selectedState: mapState }) : ''}

        <!-- 3. Court Politician to Caucus / Defect -->
        <div class="action-card" style="border-color:#1abc9c88;background:linear-gradient(145deg,#102624,#111b26)">
          <div class="action-head"><i style="color:#1abc9c">🤝</i><b>Court Politician to Caucus / Defect</b><span>1 action · $4M</span></div>
          <p>Court sitting Senators, Governors, and House members to switch party affiliation. Discontent (Happiness ≤ 40) and ideological compatibility required.</p>
          ${(() => {
            const isFringe = (typeof getPartyInstitutionalTier === 'function')
              ? (getPartyInstitutionalTier(game, identity) === 1)
              : (window.BallotAccess?.isFringeParty ? window.BallotAccess.isFringeParty(game, identity) : false);

            if (isFringe) {
              return `<div class="inline-controls" style="flex-direction:column;align-items:stretch;gap:6px">
                <div class="v07-warn-note" style="margin:4px 0;font-size:12px;color:#f87171;line-height:1.4">
                  <b>Ballot Access Restricted:</b> Fringe movements lack the statutory ballot standing required to convince sitting lawmakers to switch parties. Qualify for state ballots to ascend beyond Tier 1 before courting sitting politicians.
                </div>
                <button type="button" class="button button-small" style="border-color:#1abc9c;color:#7df2da;opacity:0.4;cursor:not-allowed" disabled>Court Defection (Tier 2+ Required)</button>
              </div>`;
            }

            const isMajorParty = V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(identity);
            const catalog = (game?.factions && game.factions.length) ? game.factions : (window.PartyChairData?.FACTIONS_CATALOG || []);
            const factionPartyId = (game?.player?.custom && identity === 'player') ? (game.player.baseTemplateId || 'people') : identity;
            const isRacial = (f) => f.type === 'racial' || ['dem_black_voters', 'dem_traditional_latin', 'dem_acculturated_latin', 'gop_cubans', 'gop_black_conservatives', 'gop_asian_conservatives', 'dem_asian_pacific'].includes(f.id);
            const playerNonRacialFactions = catalog.filter((f) => (f.partyId === identity || f.partyId === factionPartyId) && !isRacial(f));

            const eligibleTargets = (game.sittingMembers || []).filter((m) => {
              if (m.party === identity) return false;
              if (m.party !== 'independent' && (m.happiness ?? 50) > 40) return false;

              const targetFId = m.factionId || (window.PartyChairData?.resolvePoliticianFactionId ? window.PartyChairData.resolvePoliticianFactionId(m) : null);
              const targetFaction = catalog.find((f) => f.id === targetFId || f.name === m.faction || f.id === m.faction);
              const targetEcon = targetFaction?.sliders?.economic ?? targetFaction?.economic ?? 5;
              const targetSocial = targetFaction?.sliders?.social ?? targetFaction?.social ?? 5;

              return playerNonRacialFactions.some((pf) => {
                const pEcon = pf.sliders?.economic ?? pf.economic ?? 5;
                const pSoc = pf.sliders?.social ?? pf.social ?? 5;
                return Math.abs(pEcon - targetEcon) <= 2.0 && Math.abs(pSoc - targetSocial) <= 2.0;
              });
            });

            const roleOptions = !isMajorParty ? `
              <select id="court-role-select" style="margin-top:6px">
                ${(V07?.LEADERSHIP_ROLES_SCHEMA || window.PartyChairData.LEADERSHIP_ROLES || []).map((r) => `<option value="${r.id}">Appoint: ${safe(r.label || r.title)}</option>`).join('')}
              </select>
            ` : '';

            const optionsHtml = eligibleTargets.map((m) => {
              const officePrefix = m.office === 'senate' ? 'Sen.' : m.office === 'governor' ? 'Gov.' : 'Rep.';
              const partyLabel = m.party === 'people' ? 'Democratic' : m.party === 'heritage' ? 'Republican' : m.party === 'independent' ? 'Independent' : m.party;
              const loc = m.stateId || m.district || m.state || '';
              return `<option value="${safe(m.id)}">${officePrefix} ${safe(m.name)} (${safe(loc)} · ${safe(partyLabel)})</option>`;
            }).join('');

            return `<div class="inline-controls" style="flex-direction:column;align-items:stretch;gap:6px">
              <select id="ind-caucus-target">
                ${optionsHtml || '<option value="" disabled>[ No Discontent Lawmakers Meeting Ideological Bridge ]</option>'}
              </select>
              ${roleOptions}
              <button type="button" class="button button-small" style="border-color:#1abc9c;color:#7df2da" data-action="persuade-independent-caucus" ${disabled || game.treasury < 4 || !eligibleTargets.length ? 'disabled' : ''}>Court Defection</button>
            </div>`;
          })()}
        </div>

        <!-- 4. State-Targeted Policy Bill -->
        ${(() => {
          const billSignoff = (activeBill && window.PartySystemsEngine)
            ? window.PartySystemsEngine.getBillSignoffRequirement(game, game.pendingBill)
            : { required: false, canPass: true, hasLabor: true, hasBusiness: true };
          const signoffNote = billSignoff.required
            ? `<div style="margin:6px 0 8px;font-size:12px;color:${billSignoff.canPass ? '#6ee7b7' : '#fbbf24'}"><b>Tripartite Compact Sign-Off:</b> Labor Bloc ${billSignoff.hasLabor ? '✓ Secured' : '· Required'} &nbsp;|&nbsp; Business Bloc ${billSignoff.hasBusiness ? '✓ Secured' : '· Required'}</div>`
            : '';
          return activeBill
            ? `<div class="action-card v07-card-highlight">
                <div class="action-head"><i>⌁</i><b>Pending Bill: ${safe(activeBill.name)} (${safe(game.pendingBill.stateId)})</b><span>1 action</span></div>
                <p>Enacting in ${safe(game.pendingBill.stateName || game.pendingBill.stateId)} tests local alignment. Policies that resonate with local voters rally enthusiastic support, while measures out of step with state sentiment risk public backlash. Endorsements: ${game.pendingBill.endorsements.length}/${requiredEndorsements}.</p>
                ${signoffNote}
                <div class="inline-controls">
                  <select id="bill-endorser">${endorsers.map((faction) => `<option value="${faction.id}">${safe(faction.name)}</option>`).join('')}</select>
                  <button type="button" class="button button-small" data-action="endorse-bill" ${disabled || !endorsers.length ? 'disabled' : ''}>Win Support</button>
                  <button type="button" class="button button-small button-gold" data-action="pass-bill" ${disabled || game.pendingBill.endorsements.length < requiredEndorsements || (billSignoff.required && !billSignoff.canPass) || game.treasury < 3 ? 'disabled' : ''}>Enact ($3M)</button>
                </div>
              </div>`
            : `<div class="action-card">
                <div class="action-head"><i>§</i><b>State-Targeted Policy Bill</b><span>1 action · $2–3M</span></div>
                <p>Requires controlling at least 1 chamber in the target state legislature (${billEligibleStates.length} eligible states). Passing signature state legislation tests regional alignment—promising meaningful local momentum if received well, but risking voter backlash if mismatched.</p>
                ${billEligibleStates.length
                  ? `<div class="inline-controls">
                      <select id="bill-state">${billEligibleStates.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('bill-state', billEligibleStates[0]?.id) ? 'selected' : ''}>${s.id} · ${safe(s.name)}</option>`).join('')}</select>
                      <select id="bill-choice">${unpassedBills.map((bill) => `<option value="${bill.id}">${safe(bill.name)} · ${money(bill.cost)}</option>`).join('')}</select>
                      <button type="button" class="button button-small" data-action="introduce-bill" ${disabled || game.treasury < leastExpensiveBill ? 'disabled' : ''}>Introduce</button>
                    </div>`
                  : `<small class="v07-warn-note">Your party currently controls zero state legislative chambers. Win state legislative races to unlock state policy bills.</small>`}
              </div>`;
        })()}

        <!-- 5. National Convention Keynote Speaker -->
        <div class="action-card v07-keynote-card">
          <div class="action-head"><i>★</i><b>National Convention Keynote Speaker</b><span>Free · 1x Cycle</span></div>
          <p>${currentKeynote
            ? `Keynote Delivered by <b>${safe(currentKeynote.name)}</b> (+25 Fame, +8 faction confidence, +2.0 turnout in ${(game.keynoteRegions || []).join(', ')}).`
            : `Select 1 appointed Party Leader for +25 Fame, +8 faction confidence, and +2.0 turnout across their home overlapping region.`}</p>
          <div class="inline-controls">
            ${partyLeaderPool.length ? `
              <select id="keynote-speaker-2" data-dup-id="keynote-speaker">
                ${partyLeaderPool.map((m) => `<option value="${m.id}" ${game.keynoteSpeakerId === m.id ? 'selected' : ''}>${safe(m.name)} · Fame ${Math.round(m.fame || 40)} · ${safe(m.stateId || m.region)}</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" id="select-keynote-3" data-dup-id="select-keynote" ${game.phase === 'complete' || currentKeynote ? 'disabled' : ''}>${currentKeynote ? 'Selected ✓' : 'Name Keynote'}</button>
            ` : `
              <select id="keynote-speaker-4" data-dup-id="keynote-speaker" disabled>
                <option>[ Appoint Party Leaders in Leadership Menu to Select Keynote ]</option>
              </select>
              <button type="button" class="button button-small button-gold" id="select-keynote-5" data-dup-id="select-keynote" disabled>Name Keynote</button>
            `}
          </div>
        </div>

        <!-- 6. Recruit State Candidate -->
        <div class="action-card">
          <div class="action-head"><i>⚑</i><b>Recruit State Candidate (Avg Qual 7)</b><span>1 action</span></div>
          <p>Encourages a high-tier (avg 7/10 quality) local candidate into a Senate Class III or Governor primary.</p>
          <div class="inline-controls">
            <select id="step4-recruit-race">${recruitRaces.map((r) => `<option value="${r.id}">${safe(r.label)}</option>`).join('')}</select>
            <button type="button" class="button button-small" id="step4-open-recruit">Open in Step 3</button>
          </div>
        </div>

        <!-- 7. Send a Leader on State Tour -->
        <div class="action-card tour-card">
          <div class="action-head"><i>➜</i><b>Send a Leader on State Tour</b><span>1 action</span></div>
          <p>Deploy an appointed party leader to a specific state (+1–2 state chapters, +3 Fame, +memberships).</p>
          <div class="inline-controls">
            ${partyLeaderPool.length ? `
              <select id="tour-member-6" data-dup-id="tour-member">${partyLeaderPool.map((m) => `<option value="${m.id}">${safe(m.name)} (${safe(m.stateId || m.region)})</option>`).join('')}</select>
              <select id="tour-state">${STATES.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('tour-state', mapState) ? 'selected' : ''}>${s.id} · ${safe(s.name)}</option>`).join('')}</select>
              <button type="button" class="button button-small" data-action="tour" ${disabled ? 'disabled' : ''}>Deploy</button>
            ` : `
              <select id="tour-member-7" data-dup-id="tour-member" disabled><option>[ Appoint Party Leaders in Leadership Menu to Deploy Tours ]</option></select>
              <button type="button" class="button button-small" data-action="tour" disabled>Deploy</button>
            `}
          </div>
        </div>

        <!-- 8. Small-Donor Drive -->
        <div class="action-card">
          <div class="action-head"><i>✦</i><b>Run a Small-Donor Drive</b><span>1 action</span></div>
          <p>State-targeted donor tour (~$5M baseline yield). Success scales with state party membership, faction morale, and campaign finance stance, but is subject to local visit fatigue.</p>
          <div class="inline-controls" style="display:flex;gap:8px;align-items:center">
            <select id="fundraise-state" style="flex:1">
              ${STATES.map((s) => {
                const visits = game.donorDriveVisits?.[s.id] || 0;
                const fatigue = visits === 0 ? '100%' : visits === 1 ? '70%' : visits === 2 ? '45%' : '25%';
                return `<option value="${s.id}" ${getSelectedActionState('fundraise-state', mapState) === s.id ? 'selected' : ''}>${s.name} (${s.id}) · ${visits} prior visit${visits === 1 ? '' : 's'} (${fatigue} yield)</option>`;
              }).join('')}
            </select>
            <button type="button" class="button button-small button-gold" data-action="fundraise" ${disabled}>Drive</button>
          </div>
        </div>

        <!-- 9. Launch Presidential Ballot Access Petition Drive -->
        ${(() => {
          const allJurisdictions = STATES.some((s) => s.id === 'DC') ? STATES : [...STATES, { id: 'DC', name: 'District of Columbia' }];
          const uncertified = allJurisdictions.filter((s) => {
            const acc = game?.ballotAccess?.[identity];
            return !(acc && (acc.presidential?.[s.id] || acc[s.id]));
          });
          const certifiedCount = allJurisdictions.length - uncertified.length;
          const batchHint = certifiedCount < 35 ? '5–10 remaining states' : '3–5 remaining states';
          return `
          <div class="action-card v07-petition-card">
            <div class="action-head"><i>✍</i><b>Launch Presidential Ballot Access Petition Drive</b><span>1 action · Statutory Cost · Presidential Slate · ${certifiedCount}/${allJurisdictions.length} Certified</span></div>
            <p>Circulate multi-state presidential petitions to qualify your ticket across ${batchHint} per drive (expanding until all 50 states + DC are certified). <b>Note: Downballot ballot access (U.S. Senate, House, Governor, and State Legislature) must be obtained separately per contest.</b> Active state chapters trim statutory filing costs, and a deep signature buffer shields the drive against rival audits.</p>
            ${uncertified.length ? `
            <div class="inline-controls" style="flex-direction:column;align-items:stretch;gap:6px">
              <div style="display:flex;gap:6px">
                <select id="petition-buffer" style="flex:1">
                  <option value="minimum">Minimum Buffer</option>
                  <option value="prudent" selected>Prudent Buffer</option>
                  <option value="ironclad">Ironclad Defense</option>
                </select>
                <button type="button" class="button button-small" style="flex:1.5;border-color:var(--blue);color:var(--blue)" data-action="launch-petition-drive" ${disabled || game.treasury < 1.0 ? 'disabled' : ''}>Petition Presidential Ballot Line</button>
              </div>
            </div>
            ` : `
            <div style="padding:8px;font-size:13px;color:var(--green);background:var(--panel2);border:1px solid var(--line);border-radius:6px">
              ✓ <b>Full 50-State Presidential Ballot Access Certified:</b> Your party's presidential ticket is qualified across all 50 states + DC. (Downballot candidates must qualify per contest).
            </div>
            `}
          </div>`;
        })()}

        <!-- 10. Enact State Trifecta Voting Reform -->
        ${(() => {
          const bMod = window.BallotAccess;
          const trifectaStates = bMod ? bMod.getEligibleTrifectaStates(game, identity) : [];
          const bills = window.PartyChairData?.STATE_VOTING_LAW_BILLS || [
            { id: 'strict-photo-id', name: 'Strict Photo Voter ID & Signature Match Mandate' },
            { id: 'universal-vote-by-mail', name: 'Universal Vote-by-Mail & Automatic Registration' },
            { id: 'early-voting-expansion', name: 'Early Voting Window & Drop-Box Expansion' },
          ];
          return `
          <div class="action-card v07-trifecta-card">
            <div class="action-head"><i>🏛</i><b>Enact State Trifecta Voting Reform</b><span>1 action · $2M</span></div>
            <p>Leverage unified state control (Governor + House + Senate) to enact structural voting and election administration laws that reshape turnout, registration, and petition requirements.</p>
            ${trifectaStates.length ? `
            <div class="inline-controls" style="flex-direction:column;align-items:stretch;gap:6px">
              <div style="display:flex;gap:6px">
                <select id="voting-law-state" style="flex:1">
                  ${trifectaStates.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('voting-law-state', trifectaStates[0]?.id) ? 'selected' : ''}>${s.id} · ${safe(s.name)} (Trifecta)</option>`).join('')}
                </select>
                <select id="voting-law-bill" style="flex:1.5">
                  ${bills.map((b) => `<option value="${b.id}">${safe(b.name || b.shortName)}</option>`).join('')}
                </select>
              </div>
              <button type="button" class="button button-small" style="border-color:#c084fc;color:#e9d5ff" data-action="enact-state-voting-law" ${disabled || game.treasury < 2.0 ? 'disabled' : ''}>Enact Voting Reform (-$2M)</button>
            </div>
            ` : `
            <small class="v07-warn-note">Requires holding a unified state trifecta (Governor + both state legislative chambers) to enact structural voting laws.</small>
            `}
          </div>`;
        })()}
        ${/* [v0.18.4 MEDIA-SHOCKS] */ window.MediaShocksSystem ? window.MediaShocksSystem.renderOrganizingCards(game, disabled) : ''}
        ${window.FactionEraStability?.renderRealignmentCharterCard ? window.FactionEraStability.renderRealignmentCharterCard(game, identity, disabled) : ''}
      </div>
    </section>`;
}
const step5StatesMarkup = step4WorkMarkup;

// REQ-87 & REQ-122: 13-Tier Consensus Rating Engine & "Safe" Rebrand
function formatRating(rating) {
  if (!rating) return '';
  return String(rating)
    .replace(/Solid Dem/g, 'Safe Dem')
    .replace(/Solid GOP/g, 'Safe GOP')
    .replace(/Solid Democratic/g, 'Safe Democratic')
    .replace(/Solid Republican/g, 'Safe Republican')
    .replace(/Solid D/g, 'Safe D')
    .replace(/Solid R/g, 'Safe R')
    .replace(/^Solid /g, 'Safe ');
}
const TIER_13_VALUES = window.PartyChairEngine?.TIER_13_VALUES || {
  'Safe Dem': 6, 'Safe D': 6, 'Solid Dem': 6, 'Solid D': 6,
  'Very Likely Dem': 5, 'Very Likely D': 5,
  'Likely Dem': 4, 'Likely D': 4,
  'Favored Dem': 3, 'Favored D': 3,
  'Lean Dem': 2, 'Lean D': 2,
  'Tilt Dem': 1, 'Tilt D': 1,
  'Toss-Up': 0, 'Toss-up': 0, 'Tossup': 0,
  'Tilt GOP': -1, 'Tilt R': -1,
  'Lean GOP': -2, 'Lean R': -2,
  'Favored GOP': -3, 'Favored R': -3,
  'Likely GOP': -4, 'Likely R': -4,
  'Very Likely GOP': -5, 'Very Likely R': -5,
  'Safe GOP': -6, 'Safe R': -6, 'Solid GOP': -6, 'Solid R': -6,
};

const TIER_13_ORDER = window.PartyChairEngine?.TIER_13_ORDER || [
  'Safe Dem',
  'Very Likely Dem',
  'Likely Dem',
  'Favored Dem',
  'Lean Dem',
  'Tilt Dem',
  'Toss-Up',
  'Tilt GOP',
  'Lean GOP',
  'Favored GOP',
  'Likely GOP',
  'Very Likely GOP',
  'Safe GOP',
];

const TIER_13_COLORS = window.PartyChairEngine?.TIER_13_COLORS || {
  'Solid Dem': '#1d4ed8',
  'Very Likely Dem': '#2563eb',
  'Likely Dem': '#3b82f6',
  'Favored Dem': '#60a5fa',
  'Lean Dem': '#93c5fd',
  'Tilt Dem': '#bfdbfe',
  'Toss-Up': '#fbbf24',
  'Tilt GOP': '#fecaca',
  'Lean GOP': '#fca5a5',
  'Favored GOP': '#f87171',
  'Likely GOP': '#ef4444',
  'Very Likely GOP': '#dc2626',
  'Solid GOP': '#b91c1c',
  // Short aliases
  'Solid D': '#1d4ed8',
  'Very Likely D': '#2563eb',
  'Likely D': '#3b82f6',
  'Favored D': '#60a5fa',
  'Lean D': '#93c5fd',
  'Tilt D': '#bfdbfe',
  'Toss-up': '#fbbf24',
  'Tossup': '#fbbf24',
  'Tilt R': '#fecaca',
  'Lean R': '#fca5a5',
  'Favored R': '#f87171',
  'Likely R': '#ef4444',
  'Very Likely R': '#dc2626',
  'Solid R': '#b91c1c',
  // REQ-174: Third-Party Multi-Tier Gradients
  // Libertarian (Amber / Gold)
  'Solid LIB': '#b45309',
  'Likely LIB': '#d97706',
  'Lean LIB': '#f59e0b',
  'Tilt LIB': '#fde68a',
  // Green (Emerald / Forest Green)
  'Solid GRN': '#047857',
  'Likely GRN': '#10b981',
  'Lean GRN': '#34d399',
  'Tilt GRN': '#a7f3d0',
  // Constitution (Purple / Violet)
  'Solid CON': '#581c87',
  'Likely CON': '#7e22ce',
  'Lean CON': '#a855f7',
  'Tilt CON': '#e9d5ff',
  // Socialist (Crimson / Rose)
  'Solid SOC': '#881337',
  'Likely SOC': '#be123c',
  'Lean SOC': '#f43f5e',
  'Tilt SOC': '#fecdd3',
  // Independent (Teal / Cyan)
  'Solid IND': '#0f766e',
  'Likely IND': '#14b8a6',
  'Lean IND': '#2dd4bf',
  'Tilt IND': '#99f6e4',
};

function proceduralCustomColor(rating, baseHex = '#9333ea') {
  const r = String(rating).toLowerCase();
  let hex = baseHex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  const num = parseInt(hex, 16);
  let red = (num >> 16) & 255;
  let green = (num >> 8) & 255;
  let blue = num & 255;

  if (r.includes('solid')) {
    red = Math.round(red * 0.75);
    green = Math.round(green * 0.75);
    blue = Math.round(blue * 0.75);
  } else if (r.includes('likely')) {
    // primary color
  } else if (r.includes('lean')) {
    red = Math.round(red * 0.6 + 255 * 0.4);
    green = Math.round(green * 0.6 + 255 * 0.4);
    blue = Math.round(blue * 0.6 + 255 * 0.4);
  } else if (r.includes('tilt')) {
    red = Math.round(red * 0.25 + 255 * 0.75);
    green = Math.round(green * 0.25 + 255 * 0.75);
    blue = Math.round(blue * 0.25 + 255 * 0.75);
  }
  return `rgb(${red}, ${green}, ${blue})`;
}

function ratingColor(rating) {
  if (!rating) return '#fbbf24';
  if (TIER_13_COLORS[rating]) return TIER_13_COLORS[rating];
  const r = String(rating).toLowerCase().trim();
  if (r.includes('solid dem') || r === 'solid d') return '#1d4ed8';
  if (r.includes('very likely dem') || r.includes('very likely d')) return '#2563eb';
  if (r.includes('likely dem') || r === 'likely d') return '#3b82f6';
  if (r.includes('favored dem') || r.includes('favored d')) return '#60a5fa';
  if (r.includes('lean dem') || r === 'lean d') return '#93c5fd';
  if (r.includes('tilt dem') || r.includes('tilt d')) return '#bfdbfe';
  if (r.includes('toss')) return '#fbbf24';
  if (r.includes('tilt gop') || r.includes('tilt r')) return '#fecaca';
  if (r.includes('lean gop') || r === 'lean r') return '#fca5a5';
  if (r.includes('favored gop') || r.includes('favored r')) return '#f87171';
  if (r.includes('likely gop') || r === 'likely r') return '#ef4444';
  if (r.includes('very likely gop') || r.includes('very likely r')) return '#dc2626';
  if (r.includes('safe gop') || r.includes('solid gop') || r === 'safe r' || r === 'solid r') return '#b91c1c';

  // REQ-174: Third-Party Multi-Tier Gradients
  if (r.includes('solid lib')) return '#b45309';
  if (r.includes('likely lib')) return '#d97706';
  if (r.includes('lean lib')) return '#f59e0b';
  if (r.includes('tilt lib')) return '#fde68a';

  if (r.includes('solid grn')) return '#047857';
  if (r.includes('likely grn')) return '#10b981';
  if (r.includes('lean grn')) return '#34d399';
  if (r.includes('tilt grn')) return '#a7f3d0';

  if (r.includes('solid con')) return '#581c87';
  if (r.includes('likely con')) return '#7e22ce';
  if (r.includes('lean con')) return '#a855f7';
  if (r.includes('tilt con')) return '#e9d5ff';

  if (r.includes('solid soc')) return '#881337';
  if (r.includes('likely soc')) return '#be123c';
  if (r.includes('lean soc')) return '#f43f5e';
  if (r.includes('tilt soc')) return '#fecdd3';

  if (r.includes('solid ind')) return '#0f766e';
  if (r.includes('likely ind')) return '#14b8a6';
  if (r.includes('lean ind')) return '#2dd4bf';
  if (r.includes('tilt ind')) return '#99f6e4';

  if (game?.player?.custom || game?.player?.color) {
    return proceduralCustomColor(r, game?.player?.color || '#9333ea');
  }

  return '#fbbf24';
}

function ratingClass(rating) {
  if (!rating) return 'rating-toss-up';
  const r = String(rating).toLowerCase().trim();
  if (r.includes('solid dem') || r === 'solid d') return 'rating-solid-dem';
  if (r.includes('very likely dem') || r.includes('very likely d')) return 'rating-very-likely-dem';
  if (r.includes('likely dem') || r === 'likely d') return 'rating-likely-dem';
  if (r.includes('favored dem') || r.includes('favored d')) return 'rating-favored-dem';
  if (r.includes('lean dem') || r === 'lean d') return 'rating-lean-dem';
  if (r.includes('tilt dem') || r.includes('tilt d')) return 'rating-tilt-dem';
  if (r.includes('toss')) return 'rating-toss-up';
  if (r.includes('tilt gop') || r.includes('tilt r')) return 'rating-tilt-gop';
  if (r.includes('lean gop') || r === 'lean r') return 'rating-lean-gop';
  if (r.includes('favored gop') || r.includes('favored r')) return 'rating-favored-gop';
  if (r.includes('likely gop') || r === 'likely r') return 'rating-likely-gop';
  if (r.includes('very likely gop') || r.includes('very likely r')) return 'rating-very-likely-gop';
  if (r.includes('safe gop') || r.includes('solid gop') || r === 'safe r' || r === 'solid r') return 'rating-safe-gop';

  // REQ-174: Third-Party Rating Chip Classes
  if (r.includes('solid lib')) return 'rating-solid-lib';
  if (r.includes('likely lib')) return 'rating-likely-lib';
  if (r.includes('lean lib')) return 'rating-lean-lib';
  if (r.includes('tilt lib')) return 'rating-tilt-lib';

  if (r.includes('solid grn')) return 'rating-solid-grn';
  if (r.includes('likely grn')) return 'rating-likely-grn';
  if (r.includes('lean grn')) return 'rating-lean-grn';
  if (r.includes('tilt grn')) return 'rating-tilt-grn';

  if (r.includes('solid con')) return 'rating-solid-con';
  if (r.includes('likely con')) return 'rating-likely-con';
  if (r.includes('lean con')) return 'rating-lean-con';
  if (r.includes('tilt con')) return 'rating-tilt-con';

  if (r.includes('solid soc')) return 'rating-solid-soc';
  if (r.includes('likely soc')) return 'rating-likely-soc';
  if (r.includes('lean soc')) return 'rating-lean-soc';
  if (r.includes('tilt soc')) return 'rating-tilt-soc';

  if (r.includes('solid ind')) return 'rating-solid-ind';
  if (r.includes('likely ind')) return 'rating-likely-ind';
  if (r.includes('lean ind')) return 'rating-lean-ind';
  if (r.includes('tilt ind')) return 'rating-tilt-ind';

  return 'rating-toss-up';
}

function consensusRating(...args) {
  if (window.PartyChairEngine?.consensusRating) {
    return window.PartyChairEngine.consensusRating(...args);
  }
  const list = (Array.isArray(args[0]) ? args[0] : args).filter(Boolean);
  if (!list.length) return 'Toss-Up';
  let sum = 0;
  for (const r of list) {
    sum += TIER_13_VALUES[r] !== undefined ? TIER_13_VALUES[r] : 0;
  }
  const avg = sum / list.length;
  const rounded = Math.max(-6, Math.min(6, Math.round(avg)));
  return TIER_13_ORDER[6 - rounded];
}

function wavePendulumMarkup() {
  const envBaseline = (typeof game.nationalEnvironment === 'number') ? game.nationalEnvironment : 9.0;
  const wave = (game.campaign?.active && typeof game.campaign?.waveMomentum === 'number' && game.campaign.waveMomentum !== 0)
    ? game.campaign.waveMomentum
    : (typeof game.campaign?.waveMomentum === 'number' && game.campaign.waveMomentum !== 0)
      ? game.campaign.waveMomentum
      : (typeof game.waveMomentum === 'number' && game.waveMomentum !== 0)
        ? game.waveMomentum
        : envBaseline;
  const clamped = Math.max(-20, Math.min(20, wave));
  const wavePct = Math.round(((clamped + 20) / 40) * 90 + 5);
  const absWave = Math.abs(wave);
  const magnitudeWord = absWave >= 17 ? 'Landslide' : absWave >= 8 ? 'Wave' : absWave >= 3 ? 'Lean' : 'Dead Heat';
  const waveLabel = wave > 0.5
    ? `Democratic ${magnitudeWord} (+${wave.toFixed(1)} pts)`
    : wave < -0.5
      ? `Republican ${magnitudeWord} (${wave.toFixed(1)} pts)`
      : 'Even National Environment (0.0)';
  const partyColor = wave > 0.5 ? '#3478c8' : wave < -0.5 ? '#c9474e' : 'var(--gold)';

  return `
    <section class="v08-wave-pendulum-panel" aria-label="20-Point National Environment and Momentum Gauge">
      <div class="section-heading">
        <div>
          <div class="eyebrow">20-Point National Environment & Wave Gauge</div>
          <h2 style="margin:2px 0;font-size:20px;font-family:'Iowan Old Style',Palatino,Georgia,serif">National Tug-of-War Momentum (±20 Scale)</h2>
        </div>
        <span class="turnout-chip" style="border-color:${partyColor};color:${partyColor}">${waveLabel}</span>
      </div>
      <div class="v08-pendulum-track-wrapper">
        <div class="v08-pendulum-track" role="progressbar" aria-valuenow="${wave.toFixed(1)}" aria-valuemin="-20" aria-valuemax="20">
          <div class="v08-pendulum-center-mark" title="Even 0.0 National Environment"></div>
          <div class="v08-pendulum-needle" style="left:${wavePct}%" title="National Environment: ${wave >= 0 ? '+' : ''}${wave.toFixed(1)} pts (${magnitudeWord})"></div>
        </div>
      </div>
      <div class="v09-pendulum-ticks">
        <span style="left:6%" class="landslide">◀ GOP Landslide (-20)</span>
        <span style="left:28%" class="wave">GOP Wave (-10)</span>
        <span style="left:50%">Even (0)</span>
        <span style="left:72%" class="wave">Dem Wave (+10)</span>
        <span style="left:94%" class="landslide dem">Dem Landslide (+20) ▶</span>
      </div>
      <p style="margin:10px 0 0;font-size:12.5px;color:var(--muted);line-height:1.4">
        <b>20-Point Environment Gauge:</b> Readings around <b>±10</b> signify a historic Wave; readings near <b>±20</b> represent an across-the-board Landslide. Current standing: <b>${waveLabel}</b>.
      </p>
    </section>`;
}

function forecastersMarkup() {
  const outlets = game.forecasters?.outlets || {
    cooked: 'The Cooked Political Report',
    sallow: "Sallow's Crystal Ball",
    inside: 'Upside Elections',
  };
  const sallow = game.forecasters?.sallow || game.forecasters?.sabato || {};
  const cooked = game.forecasters?.cooked || game.forecasters?.cook || {};
  const inside = game.forecasters?.inside || {};
  const consensus = game.forecasters?.consensus || {};
  const isPresYear = (game?.year || 2028) % 4 === 0;

  const tallyOutlet7 = (outletMap) => {
    const counts = { 'Solid Dem': 0, 'Likely Dem': 0, 'Lean Dem': 0, 'Toss-Up': 0, 'Lean GOP': 0, 'Likely GOP': 0, 'Solid GOP': 0 };
    let demEv = 0, repEv = 0, tossEv = 0, thirdEv = 0;
    if (isPresYear) {
      STATES.forEach((s) => {
        const r = outletMap[`presidential:${s.id}`] || 'Toss-Up';
        counts[r] = (counts[r] || 0) + 1;
        const ev = s.ev || 3;
        if (r.endsWith('Dem') || r.endsWith('D')) demEv += ev;
        else if (r.endsWith('GOP') || r.endsWith('R')) repEv += ev;
        else if (r.includes('LIB') || r.includes('GRN') || r.includes('CON') || (r.includes('SOC') || r.includes('PFP')) || r.includes('IND')) thirdEv += ev;
        else tossEv += ev;
      });
    }
    return { counts, demEv, repEv, tossEv, thirdEv };
  };

  const tallyConsensus13 = () => {
    const counts = {};
    TIER_13_ORDER.forEach((t) => { counts[t] = 0; });
    let demEv = 0, repEv = 0, tossEv = 0, thirdEv = 0;
    if (isPresYear) {
      STATES.forEach((s) => {
        const k = `presidential:${s.id}`;
        const r = consensus[k] || consensusRating(sallow[k], cooked[k], inside[k]) || 'Toss-Up';
        counts[r] = (counts[r] || 0) + 1;
        const ev = s.ev || 3;
        const val = TIER_13_VALUES[r] || 0;
        if (val > 0 && !r.includes('LIB') && !r.includes('GRN') && !r.includes('CON') && !(r.includes('SOC') || r.includes('PFP')) && !r.includes('IND')) demEv += ev;
        else if (val < 0) repEv += ev;
        else if (r.includes('LIB') || r.includes('GRN') || r.includes('CON') || (r.includes('SOC') || r.includes('PFP')) || r.includes('IND')) thirdEv += ev;
        else tossEv += ev;
      });
    }
    return { counts, demEv, repEv, tossEv, thirdEv };
  };

  const sallowTally = tallyOutlet7(sallow);
  const cookedTally = tallyOutlet7(cooked);
  const insideTally = tallyOutlet7(inside);
  const consensusTally = tallyConsensus13();

  const activeSenateClass = game?.activeSenateClass || (window.PartyChairEngine?.getSenateClassForYear ? window.PartyChairEngine.getSenateClassForYear(game?.year || 2028) : 3);
  const activeSenateRoman = activeSenateClass === 1 ? 'I' : activeSenateClass === 2 ? 'II' : 'III';
  const activeSenateList = game?.activeSenateRaces || (window.PartyChairEngine?.getActiveSenateRaces ? window.PartyChairEngine.getActiveSenateRaces(game, game?.year || 2028) : []);
  const senateCompetitiveKeys = (activeSenateList && activeSenateList.length > 0)
    ? activeSenateList.map((r) => {
        const stId = r.stateId || r.state;
        const stObj = STATES.find((s) => s.id === stId);
        return {
          key: `senate:${stId}`,
          office: 'U.S. Senate',
          name: `${stObj?.name || stId} Senate (Class ${activeSenateRoman})`,
        };
      })
    : ['PA', 'GA', 'NV', 'AZ', 'WI', 'OH', 'TX', 'FL', 'NC'].map((st) => ({
        key: `senate:${st}`,
        office: 'U.S. Senate',
        name: `${STATES.find((s) => s.id === st)?.name || st} Senate (Class ${activeSenateRoman})`,
      }));

  const battlegroundStates = ['PA', 'GA', 'NV', 'NC', 'AZ', 'WI', 'MI', 'NH', 'FL', 'TX', 'OH', 'VA', 'ME'];
  const stateLegBattlegrounds = ['PA', 'MI', 'WI', 'AZ', 'GA', 'NV', 'NH', 'MN', 'VA', 'NC', 'AK', 'ME', 'TX', 'FL', 'OH', 'CO'];
  const allCompetitiveKeys = [
    ...(isPresYear ? battlegroundStates.map((st) => ({ key: `presidential:${st}`, office: 'President', name: `${STATES.find((s) => s.id === st)?.name || st} (${STATES.find((s) => s.id === st)?.ev || 3} EV)` })) : []),
    ...senateCompetitiveKeys,
    ...['NH', 'NC', 'IN', 'WA', 'UT'].map((st) => ({ key: `governor:${st}`, office: 'Governor', name: `${STATES.find((s) => s.id === st)?.name || st} Gubernatorial` })),
    ...['PA-1', 'PA-7', 'PA-8', 'AZ-1', 'AZ-6', 'CA-13', 'CA-22', 'CA-27', 'CA-45', 'NY-4', 'NY-17', 'NY-19', 'MI-7', 'MI-8', 'VA-2', 'VA-7'].map((d) => ({ key: `house:${d}`, office: 'U.S. House', name: `${d} Battleground District` })),
    ...stateLegBattlegrounds.map((st) => ({ key: `stateLeg:${st}`, office: 'State Legislature', name: `${STATES.find((s) => s.id === st)?.name || st} State Legislature` })),
  ];

  const filteredRaces = allCompetitiveKeys.filter((r) => {
    if (forecasterRaceFilter === 'presidential') return r.office === 'President';
    if (forecasterRaceFilter === 'senate') return r.office === 'U.S. Senate';
    if (forecasterRaceFilter === 'governor') return r.office === 'Governor';
    if (forecasterRaceFilter === 'house') return r.office === 'U.S. House';
    if (forecasterRaceFilter === 'stateLeg') return r.office === 'State Legislature';
    return true;
  });

  return `
    <section class="panel section-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Satirical Forecasters · Consensus Engine</div>
          <h2>Pundit Forecaster Multi-Chamber Projections</h2>
        </div>
      </div>

      <div class="v08-forecasters-grid" style="grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:12px">
        <!-- Consensus 13-Tier Card -->
        <article class="v08-forecaster-card" style="border-color:var(--gold);background:linear-gradient(135deg, #182838, #131e2b)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <span class="eyebrow" style="color:var(--gold)">Blended Consensus</span>
            <button type="button" class="button button-small button-gold" data-jump-forecaster-map="consensus" style="padding:2px 8px;font-size:11px">Inspect Map →</button>
          </div>
          <h3 style="color:var(--gold)">Consensus Forecast</h3>
          <p style="font-size:12.5px;color:var(--muted);margin:0 0 8px">“Synthesizing Cooked, Sallow, and Upside Elections into fine-grained continuous tiers.”</p>
          ${isPresYear ? `
            <div style="font-family:Consolas,monospace;font-size:12px;color:var(--gold);margin-bottom:8px">
              <b>Projected EVs:</b> Dem ${consensusTally.demEv} · Toss-Up ${consensusTally.tossEv} · Rep ${consensusTally.repEv}${consensusTally.thirdEv ? ` · 3rd Party ${consensusTally.thirdEv}` : ''}
            </div>
          ` : `<div style="font-size:11.5px;color:var(--muted);margin-bottom:8px"><b>Midterm Cycle:</b> Presidential inactive; Senate & House active.</div>`}
          <div class="v08-gradient-continuous-bar" title="13-Tier Blended Gradient">
            ${TIER_13_ORDER.map((t) => `<div style="background:${TIER_13_COLORS[t]}" title="${t}: ${consensusTally.counts[t] || 0}"></div>`).join('')}
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">
            ${TIER_13_ORDER.filter((t) => consensusTally.counts[t] > 0 || t === 'Toss-Up').map((t) => `
              <span class="v08-rating-chip ${ratingClass(t)}" style="font-size:10px;padding:1px 6px">${safe(formatRating(t))}: ${consensusTally.counts[t] || 0}</span>
            `).join('')}
          </div>
        </article>

        <!-- Cooked Political Report Card -->
        <article class="v08-forecaster-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <span class="eyebrow">Cook Report Parody</span>
            <button type="button" class="button button-small" data-jump-forecaster-map="cooked" style="padding:2px 8px;font-size:11px">Inspect Map →</button>
          </div>
          <h3>${safe(outlets.cooked || 'The Cooked Political Report')}</h3>
          <p style="font-size:12.5px;color:var(--muted);margin:0 0 8px">“Serving cautious qualitative ratings straight from the beltway kitchen.”</p>
          ${isPresYear ? `
            <div style="font-family:Consolas,monospace;font-size:12px;color:var(--gold);margin-bottom:8px">
              <b>Projected EVs:</b> Dem ${cookedTally.demEv} · Toss-Up ${cookedTally.tossEv} · Rep ${cookedTally.repEv}${cookedTally.thirdEv ? ` · 3rd Party ${cookedTally.thirdEv}` : ''}
            </div>
          ` : `<div style="font-size:11.5px;color:var(--muted);margin-bottom:8px"><b>Midterm Cycle:</b> Presidential inactive; Senate & House active.</div>`}
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <span class="v08-rating-chip rating-safe-dem">Safe Dem: ${cookedTally.counts['Solid Dem'] || 0}</span>
            <span class="v08-rating-chip rating-likely-dem">Likely Dem: ${cookedTally.counts['Likely Dem'] || 0}</span>
            <span class="v08-rating-chip rating-lean-dem">Lean Dem: ${cookedTally.counts['Lean Dem'] || 0}</span>
            <span class="v08-rating-chip rating-toss-up">Toss-Up: ${cookedTally.counts['Toss-Up'] || 0}</span>
            <span class="v08-rating-chip rating-lean-gop">Lean GOP: ${cookedTally.counts['Lean GOP'] || 0}</span>
            <span class="v08-rating-chip rating-likely-gop">Likely GOP: ${cookedTally.counts['Likely GOP'] || 0}</span>
            <span class="v08-rating-chip rating-safe-gop">Safe GOP: ${cookedTally.counts['Solid GOP'] || 0}</span>
          </div>
        </article>

        <!-- Sallow's Crystal Ball Card -->
        <article class="v08-forecaster-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <span class="eyebrow">Sabato Parody</span>
            <button type="button" class="button button-small" data-jump-forecaster-map="sallow" style="padding:2px 8px;font-size:11px">Inspect Map →</button>
          </div>
          <h3>${safe(outlets.sallow || "Sallow's Crystal Ball")}</h3>
          <p style="font-size:12.5px;color:var(--muted);margin:0 0 8px">“Consulting the mystic crystal ball to pick winners without false precision.”</p>
          ${isPresYear ? `
            <div style="font-family:Consolas,monospace;font-size:12px;color:var(--gold);margin-bottom:8px">
              <b>Projected EVs:</b> Dem ${sallowTally.demEv} · Toss-Up ${sallowTally.tossEv} · Rep ${sallowTally.repEv}${sallowTally.thirdEv ? ` · 3rd Party ${sallowTally.thirdEv}` : ''}
            </div>
          ` : `<div style="font-size:11.5px;color:var(--muted);margin-bottom:8px"><b>Midterm Cycle:</b> Presidential inactive; Senate & House active.</div>`}
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <span class="v08-rating-chip rating-safe-dem">Safe Dem: ${sallowTally.counts['Solid Dem'] || 0}</span>
            <span class="v08-rating-chip rating-likely-dem">Likely Dem: ${sallowTally.counts['Likely Dem'] || 0}</span>
            <span class="v08-rating-chip rating-lean-dem">Lean Dem: ${sallowTally.counts['Lean Dem'] || 0}</span>
            <span class="v08-rating-chip rating-toss-up">Toss-Up: ${sallowTally.counts['Toss-Up'] || 0}</span>
            <span class="v08-rating-chip rating-lean-gop">Lean GOP: ${sallowTally.counts['Lean GOP'] || 0}</span>
            <span class="v08-rating-chip rating-likely-gop">Likely GOP: ${sallowTally.counts['Likely GOP'] || 0}</span>
            <span class="v08-rating-chip rating-safe-gop">Safe GOP: ${sallowTally.counts['Solid GOP'] || 0}</span>
          </div>
        </article>

        <!-- Upside Elections Card -->
        <article class="v08-forecaster-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <span class="eyebrow">Inside Elections Parody</span>
            <button type="button" class="button button-small" data-jump-forecaster-map="inside" style="padding:2px 8px;font-size:11px">Inspect Map →</button>
          </div>
          <h3>${safe(outlets.inside || 'Upside Elections')}</h3>
          <p style="font-size:12.5px;color:var(--muted);margin:0 0 8px">“Candidate fundamentals and district mechanics tracked without sugar-coating.”</p>
          ${isPresYear ? `
            <div style="font-family:Consolas,monospace;font-size:12px;color:var(--gold);margin-bottom:8px">
              <b>Projected EVs:</b> Dem ${insideTally.demEv} · Toss-Up ${insideTally.tossEv} · Rep ${insideTally.repEv}${insideTally.thirdEv ? ` · 3rd Party ${insideTally.thirdEv}` : ''}
            </div>
          ` : `<div style="font-size:11.5px;color:var(--muted);margin-bottom:8px"><b>Midterm Cycle:</b> Presidential inactive; Senate & House active.</div>`}
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <span class="v08-rating-chip rating-safe-dem">Safe Dem: ${insideTally.counts['Solid Dem'] || 0}</span>
            <span class="v08-rating-chip rating-likely-dem">Likely Dem: ${insideTally.counts['Likely Dem'] || 0}</span>
            <span class="v08-rating-chip rating-lean-dem">Lean Dem: ${insideTally.counts['Lean Dem'] || 0}</span>
            <span class="v08-rating-chip rating-toss-up">Toss-Up: ${insideTally.counts['Toss-Up'] || 0}</span>
            <span class="v08-rating-chip rating-lean-gop">Lean GOP: ${insideTally.counts['Lean GOP'] || 0}</span>
            <span class="v08-rating-chip rating-likely-gop">Likely GOP: ${insideTally.counts['Likely GOP'] || 0}</span>
            <span class="v08-rating-chip rating-safe-gop">Safe GOP: ${insideTally.counts['Solid GOP'] || 0}</span>
          </div>
        </article>
      </div>

      <!-- Interactive Forecast Projections Container -->
      ${(() => {
        const effectiveForecastChamber = (!isPresYear && forecastMapChamber === 'presidential') ? 'senate' : (forecastMapChamber || 'presidential');
        const forecastMap = nationalMapSvg(effectiveForecastChamber, { forecaster: true, chamberClass: activeSenateRoman });
        const isPollingSource = forecasterMapSource === 'polling';
        const activeOutletData = forecasterMapSource === 'consensus'
          ? (game.forecasters?.consensus || {})
          : (game.forecasters?.[forecasterMapSource] || {});
        const activeOutletName = isPollingSource
          ? 'Polling Average (Live Simulation)'
          : forecasterMapSource === 'consensus'
            ? 'Consensus Forecast'
            : (outlets[forecasterMapSource] || forecasterMapSource);

        let forecastScoreboard = '';
        if (isPollingSource) {
          const natPoll = nationalPoll(game) || {};
          const parties = partyList(game);
          const pollRows = parties.map((p) => {
            const canonicalId = (p.id === 'player' && !p.custom) ? (p.baseTemplateId || 'people') : p.id;
            const val = Number(natPoll[p.id] ?? natPoll[canonicalId] ?? 0);
            return { id: p.id, canonicalId, name: p.name, color: p.color || '#8b5cf6', share: val };
          }).filter((r) => r.share > 0).sort((a, b) => b.share - a.share);
          const totalShare = pollRows.reduce((s, r) => s + r.share, 0) || 100;

          let chamberHeadline = '';
          let chamberMetric = '';
          if (effectiveForecastChamber === 'presidential') {
            chamberHeadline = isPresYear ? `${game?.year || 2028} Presidential Polling Average` : `Midterm Cycle (${game.year || 2030}) · National Generic Ballot`;
            if (isPresYear) {
              let dEv = 0, rEv = 0, tEv = 0, oEv = 0;
              STATES.forEach((s) => {
                const bd = getStatePollingBreakdown(s);
                const ev = s.ev || 3;
                if (bd.margin < 3.0) tEv += ev;
                else if (bd.leader.canonicalId === 'people') dEv += ev;
                else if (bd.leader.canonicalId === 'heritage') rEv += ev;
                else oEv += ev;
              });
              chamberMetric = `<b>Polling EVs:</b> Dem ${dEv} · Close (<3%) ${tEv} · Rep ${rEv}${oEv ? ` · 3rd Party ${oEv}` : ''}`;
            } else {
              chamberMetric = `<b>Midterm Generic Ballot:</b> ${pollRows.slice(0, 2).map((r) => `${safe(r.name.split(' ')[0])} ${r.share.toFixed(1)}%`).join(' · ')}`;
            }
          } else if (effectiveForecastChamber === 'senate') {
            chamberHeadline = `U.S. Senate Polling Average (Class ${activeSenateRoman} · ${game?.year || 2028})`;
            const senateList = activeSenateList.length ? activeSenateList : STATES.map((s) => ({ stateId: s.id }));
            let dLead = 0, rLead = 0, close = 0, oLead = 0;
            senateList.forEach((r) => {
              const st = STATES.find((s) => s.id === (r.stateId || r.state));
              if (!st) return;
              const bd = getStatePollingBreakdown(st);
              if (bd.margin < 3.0) close += 1;
              else if (bd.leader.canonicalId === 'people') dLead += 1;
              else if (bd.leader.canonicalId === 'heritage') rLead += 1;
              else oLead += 1;
            });
            chamberMetric = `<b>Class ${activeSenateRoman} Polling:</b> Dem ${dLead} · Close ${close} · Rep ${rLead}${oLead ? ` · 3rd Party ${oLead}` : ''}`;
          } else if (effectiveForecastChamber === 'house') {
            chamberHeadline = `U.S. House District Polling Average (435 Districts)`;
            const distCatalog = window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS || [];
            let dLead = 0, rLead = 0, close = 0, oLead = 0;
            distCatalog.forEach((d) => {
              const st = STATES.find((s) => s.id === d.stateId);
              if (!st) return;
              const bd = getStatePollingBreakdown(st, d);
              if (bd.margin < 3.0) close += 1;
              else if (bd.leader.canonicalId === 'people') dLead += 1;
              else if (bd.leader.canonicalId === 'heritage') rLead += 1;
              else oLead += 1;
            });
            chamberMetric = `<b>House Polling:</b> Dem ${dLead} · Close ${close} · Rep ${rLead}${oLead ? ` · 3rd Party ${oLead}` : ''}`;
          } else {
            chamberHeadline = `50-State Legislature Polling Average (${game?.year || 2028})`;
            let dLead = 0, rLead = 0, close = 0, oLead = 0;
            STATES.forEach((s) => {
              if (s.id === 'NE') return;
              const bd = getStatePollingBreakdown(s);
              if (bd.margin < 3.0) close += 1;
              else if (bd.leader.canonicalId === 'people') dLead += 1;
              else if (bd.leader.canonicalId === 'heritage') rLead += 1;
              else oLead += 1;
            });
            chamberMetric = `<b>Statehouses:</b> Dem ${dLead} · Close ${close} · Rep ${rLead}${oLead ? ` · 3rd Party ${oLead}` : ''} · NE Nonpartisan`;
          }

          forecastScoreboard = `
            <div class="presidential-scoreboard v08-qualitative-scoreboard" style="display:flex;flex-direction:column;gap:8px;padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <div>
                  <span class="eyebrow" style="font-size:11px;color:#7ee3d4">${safe(activeOutletName)}</span>
                  <h4 style="margin:2px 0 0;font-size:16px;font-family:'Iowan Old Style',Palatino,Georgia,serif">${safe(chamberHeadline)}</h4>
                </div>
                <div style="font-family:Consolas,monospace;font-size:13px;color:var(--gold)">
                  ${chamberMetric}
                </div>
              </div>
              <div class="v159-polling-bar" role="img" aria-label="National Polling Share Bar">
                ${pollRows.map((r) => `<div class="v159-polling-seg" style="width:${((r.share / totalShare) * 100).toFixed(2)}%;background:${r.color}" title="${safe(r.name)}: ${r.share.toFixed(1)}%"></div>`).join('')}
              </div>
              <div class="v159-polling-pills">
                ${pollRows.map((r) => `<span class="v159-polling-pill"><i style="background:${r.color}"></i>${safe(r.name.replace(' Party', ''))}: <b>${r.share.toFixed(1)}%</b></span>`).join('')}
              </div>
            </div>`;
        } else if (effectiveForecastChamber === 'presidential') {
          if (!isPresYear) {
            forecastScoreboard = `
              <div class="presidential-scoreboard v08-qualitative-scoreboard" style="padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px;margin-bottom:10px">
                <h4 style="margin:0 0 4px;font-size:15px;color:var(--gold)">Midterm Election Cycle (${game.year || 2030})</h4>
                <p style="margin:0;font-size:13px;color:var(--muted)">Presidential elections occur constitutionally every 4 years. The presidential race is inactive this cycle. Inspect U.S. Senate, House, and State Legislature projections below.</p>
              </div>`;
          } else {
            let demEv = 0, repEv = 0, tossEv = 0;
            const counts = {};
            TIER_13_ORDER.forEach((t) => { counts[t] = 0; });
            STATES.forEach((s) => {
              const k = `presidential:${s.id}`;
              const r = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
              counts[r] = (counts[r] || 0) + 1;
              const ev = s.ev || 3;
              const val = TIER_13_VALUES[r] || 0;
              if (val > 0) demEv += ev;
              else if (val < 0) repEv += ev;
              else tossEv += ev;
            });

            forecastScoreboard = `
              <div class="presidential-scoreboard v08-qualitative-scoreboard" style="display:flex;flex-direction:column;gap:8px;padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px;margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                  <div>
                    <span class="eyebrow" style="font-size:11px;color:var(--gold)">${safe(activeOutletName)}</span>
                    <h4 style="margin:2px 0 0;font-size:16px;font-family:'Iowan Old Style',Palatino,Georgia,serif">${game?.year || 2028} Presidential Electoral Projection</h4>
                  </div>
                  <div style="font-family:Consolas,monospace;font-size:13px;color:var(--gold)">
                    <b>Projected EVs:</b> Dem ${demEv} · Toss-Up ${tossEv} · Rep ${repEv}
                  </div>
                </div>
                ${forecasterMapSource === 'consensus' ? `
                  <div class="v08-gradient-continuous-bar">
                    ${TIER_13_ORDER.map((t) => `<div style="background:${TIER_13_COLORS[t]}" title="${safe(formatRating(t))}: ${counts[t] || 0}"></div>`).join('')}
                  </div>
                ` : ''}
                <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:4px">
                  ${TIER_13_ORDER.filter((t) => counts[t] > 0 || (forecasterMapSource !== 'consensus' && !['Very Likely Dem', 'Favored Dem', 'Tilt Dem', 'Tilt GOP', 'Favored GOP', 'Very Likely GOP'].includes(t))).map((t) => `
                    <span class="v08-rating-chip ${ratingClass(t)}" style="font-size:10px;padding:1px 6px">${safe(formatRating(t))}: ${counts[t] || 0}</span>
                  `).join('')}
                </div>
              </div>`;
          }
        } else if (effectiveForecastChamber === 'senate') {
          const counts = {};
          TIER_13_ORDER.forEach((t) => { counts[t] = 0; });
          const senateList = activeSenateList.length ? activeSenateList : STATES.map((s) => ({ stateId: s.id }));
          senateList.forEach((r) => {
            const stId = r.stateId || r.state;
            const k = `senate:${stId}`;
            const rat = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
            counts[rat] = (counts[rat] || 0) + 1;
          });

          forecastScoreboard = `
            <div class="presidential-scoreboard v08-qualitative-scoreboard" style="display:flex;flex-direction:column;gap:8px;padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <div>
                  <span class="eyebrow" style="font-size:11px;color:var(--gold)">${safe(activeOutletName)}</span>
                  <h4 style="margin:2px 0 0;font-size:16px;font-family:'Iowan Old Style',Palatino,Georgia,serif">U.S. Senate Projection (Class ${activeSenateRoman} · ${game?.year || 2028})</h4>
                </div>
              </div>
              ${forecasterMapSource === 'consensus' ? `
                <div class="v08-gradient-continuous-bar">
                  ${TIER_13_ORDER.map((t) => `<div style="background:${TIER_13_COLORS[t]}" title="${safe(formatRating(t))}: ${counts[t] || 0}"></div>`).join('')}
                </div>
              ` : ''}
              <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:4px">
                ${TIER_13_ORDER.filter((t) => counts[t] > 0 || (forecasterMapSource !== 'consensus' && !['Very Likely Dem', 'Favored Dem', 'Tilt Dem', 'Tilt GOP', 'Favored GOP', 'Very Likely GOP'].includes(t))).map((t) => `
                  <span class="v08-rating-chip ${ratingClass(t)}" style="font-size:10px;padding:1px 6px">${safe(formatRating(t))}: ${counts[t] || 0}</span>
                `).join('')}
              </div>
            </div>`;
        } else if (effectiveForecastChamber === 'house') {
          const counts = {};
          TIER_13_ORDER.forEach((t) => { counts[t] = 0; });
          const activeHouseMap = (game?.currentHouseMap?.districts?.length ? game.currentHouseMap : (game?.activeHouseMapKey && game[game.activeHouseMapKey]?.districts?.length ? game[game.activeHouseMapKey] : null));
          const forecastDistricts = activeHouseMap?.districts || MAPS.districts;
          forecastDistricts.forEach((d) => {
            const k = `house:${d.id}`;
            const kAlt = `house:${d.id.replace(/-(\d)$/, '-0$1')}`;
            const r = activeOutletData[k] || activeOutletData[kAlt] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
            counts[r] = (counts[r] || 0) + 1;
          });

          forecastScoreboard = `
            <div class="presidential-scoreboard v08-qualitative-scoreboard" style="display:flex;flex-direction:column;gap:8px;padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <div>
                  <span class="eyebrow" style="font-size:11px;color:var(--gold)">${safe(activeOutletName)}</span>
                  <h4 style="margin:2px 0 0;font-size:16px;font-family:'Iowan Old Style',Palatino,Georgia,serif">U.S. House District Projections (435 Districts)</h4>
                </div>
              </div>
              ${forecasterMapSource === 'consensus' ? `
                <div class="v08-gradient-continuous-bar">
                  ${TIER_13_ORDER.map((t) => `<div style="background:${TIER_13_COLORS[t]}" title="${safe(formatRating(t))}: ${counts[t] || 0}"></div>`).join('')}
                </div>
              ` : ''}
              <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:4px">
                ${TIER_13_ORDER.filter((t) => counts[t] > 0 || (forecasterMapSource !== 'consensus' && !['Very Likely Dem', 'Favored Dem', 'Tilt Dem', 'Tilt GOP', 'Favored GOP', 'Very Likely GOP'].includes(t))).map((t) => `
                  <span class="v08-rating-chip ${ratingClass(t)}" style="font-size:10px;padding:1px 6px">${safe(formatRating(t))}: ${counts[t] || 0}</span>
                `).join('')}
              </div>
            </div>`;
        } else if (effectiveForecastChamber === 'stateLeg') {
          const counts = {};
          TIER_13_ORDER.forEach((t) => { counts[t] = 0; });
          let demLeg = 0, repLeg = 0, tossLeg = 0, thirdLeg = 0;
          STATES.forEach((s) => {
            if (s.id === 'NE') return;
            const k = `stateLeg:${s.id}`;
            const r = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
            counts[r] = (counts[r] || 0) + 1;
            const val = TIER_13_VALUES[r] || 0;
            if (r.includes('LIB') || r.includes('GRN') || r.includes('CON') || (r.includes('SOC') || r.includes('PFP')) || r.includes('IND')) thirdLeg += 1;
            else if (val > 0) demLeg += 1;
            else if (val < 0) repLeg += 1;
            else tossLeg += 1;
          });

          forecastScoreboard = `
            <div class="presidential-scoreboard v08-qualitative-scoreboard" style="display:flex;flex-direction:column;gap:8px;padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <div>
                  <span class="eyebrow" style="font-size:11px;color:var(--gold)">${safe(activeOutletName)}</span>
                  <h4 style="margin:2px 0 0;font-size:16px;font-family:'Iowan Old Style',Palatino,Georgia,serif">State Legislature Control Projections (50 States)</h4>
                </div>
                <div style="font-family:Consolas,monospace;font-size:13px;color:var(--gold)">
                  <b>Projected Statehouses:</b> Dem-Led ${demLeg} · Split/Toss-Up ${tossLeg} · GOP-Led ${repLeg}${thirdLeg ? ` · 3rd Party ${thirdLeg}` : ''} · NE Nonpartisan
                </div>
              </div>
              ${forecasterMapSource === 'consensus' ? `
                <div class="v08-gradient-continuous-bar">
                  ${TIER_13_ORDER.map((t) => `<div style="background:${TIER_13_COLORS[t]}" title="${safe(formatRating(t))}: ${counts[t] || 0}"></div>`).join('')}
                </div>
              ` : ''}
              <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:4px">
                ${TIER_13_ORDER.filter((t) => counts[t] > 0 || (forecasterMapSource !== 'consensus' && !['Very Likely Dem', 'Favored Dem', 'Tilt Dem', 'Tilt GOP', 'Favored GOP', 'Very Likely GOP'].includes(t))).map((t) => `
                  <span class="v08-rating-chip ${ratingClass(t)}" style="font-size:10px;padding:1px 6px">${safe(formatRating(t))}: ${counts[t] || 0}</span>
                `).join('')}
              </div>
            </div>`;
        }

        return `
          <section id="forecast-projection-map-container" class="panel section-panel version01-map" style="margin-top:18px">
            <div class="section-heading">
              <div>
                <div class="eyebrow">Interactive Forecast Intelligence · ${game?.year || 2028}</div>
                <h2>Election Forecast Projections Map</h2>
              </div>
              <div class="v07-filter-tabs" aria-label="Forecast Chamber Selector">
                <button type="button" data-forecast-map-chamber="presidential" class="${effectiveForecastChamber === 'presidential' ? 'selected' : ''}">Presidential${!isPresYear ? ' (Inactive)' : ''}</button>
                <button type="button" data-forecast-map-chamber="senate" class="${effectiveForecastChamber === 'senate' ? 'selected' : ''}">U.S. Senate (Class ${activeSenateRoman})</button>
                <button type="button" data-forecast-map-chamber="house" class="${effectiveForecastChamber === 'house' ? 'selected' : ''}">U.S. House (435 Districts)</button>
                <button type="button" data-forecast-map-chamber="stateLeg" class="${effectiveForecastChamber === 'stateLeg' ? 'selected' : ''}">State Legislatures (50 States)</button>
              </div>
            </div>

            <div class="map-subtabs v08-pundit-selector-bar" style="margin-bottom:12px" aria-label="Forecaster Projection Model Switcher">
              <span style="font-size:12px;font-weight:700;color:var(--gold);display:flex;align-items:center;padding:0 6px">Projection Model:</span>
              <button type="button" data-forecaster-source="consensus" class="${forecasterMapSource === 'consensus' ? 'selected' : ''}">
                Consensus Forecast
              </button>
              <button type="button" data-forecaster-source="cooked" class="${forecasterMapSource === 'cooked' ? 'selected' : ''}">
                The Cooked Report
              </button>
              <button type="button" data-forecaster-source="sallow" class="${forecasterMapSource === 'sallow' ? 'selected' : ''}">
                Sallow's Crystal Ball
              </button>
              <button type="button" data-forecaster-source="inside" class="${forecasterMapSource === 'inside' ? 'selected' : ''}">
                Upside Elections
              </button>
              <button type="button" data-forecaster-source="polling" class="${forecasterMapSource === 'polling' ? 'selected' : ''}">
                Polling Average <small>(Live Sim)</small>
              </button>
            </div>

            ${forecastScoreboard}
            ${forecastMap.view}
            ${forecastMap.legend}
          </section>
        `;
      })()}

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:20px 0 10px">
        <div>
          <b style="font-size:16px;font-family:'Iowan Old Style',Palatino,Georgia,serif">Battleground Race Ratings Comparison · U.S. Senate Projection (Class ${activeSenateRoman})</b>
          <span style="display:block;font-size:12px;color:var(--muted)">Individual forecasters provide discrete ratings; Consensus blends them into fine-grained continuous tiers.</span>
        </div>
        <div class="v07-filter-tabs">
          <button type="button" data-forecaster-filter="all" class="${forecasterRaceFilter === 'all' ? 'selected' : ''}">All</button>
          ${isPresYear ? `<button type="button" data-forecaster-filter="presidential" class="${forecasterRaceFilter === 'presidential' ? 'selected' : ''}">Presidential</button>` : ''}
          <button type="button" data-forecaster-filter="senate" class="${forecasterRaceFilter === 'senate' ? 'selected' : ''}">Senate (Class ${activeSenateRoman})</button>
          <button type="button" data-forecaster-filter="governor" class="${forecasterRaceFilter === 'governor' ? 'selected' : ''}">Governors</button>
          <button type="button" data-forecaster-filter="house" class="${forecasterRaceFilter === 'house' ? 'selected' : ''}">Key House</button>
          <button type="button" data-forecaster-filter="stateLeg" class="${forecasterRaceFilter === 'stateLeg' ? 'selected' : ''}">State Legislatures</button>
        </div>
      </div>

      <div class="v08-triage-table-wrap">
        <table class="v08-triage-table">
          <thead>
            <tr>
              <th>Office & Race</th>
              <th>The Cooked Report</th>
              <th>Sallow's Crystal Ball</th>
              <th>Upside Elections</th>
              <th>Consensus</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRaces.map((r) => {
              const sal = sallow[r.key] || sallow[r.key.replace(/-(\d)$/, '-0$1')] || (r.key.startsWith('house:') ? sallow[`house:${r.key.slice(6).replace(/-(\d)$/, '-0$1')}`] : null) || 'Lean Dem';
              const ck = cooked[r.key] || cooked[r.key.replace(/-(\d)$/, '-0$1')] || (r.key.startsWith('house:') ? cooked[`house:${r.key.slice(6).replace(/-(\d)$/, '-0$1')}`] : null) || 'Toss-Up';
              const ins = inside[r.key] || inside[r.key.replace(/-(\d)$/, '-0$1')] || (r.key.startsWith('house:') ? inside[`house:${r.key.slice(6).replace(/-(\d)$/, '-0$1')}`] : null) || 'Toss-Up';
              const con = consensus[r.key] || consensusRating(sal, ck, ins);
              return `<tr>
                <td><b>${safe(r.name)}</b> <small style="display:block;color:var(--muted)">${safe(r.office)}</small></td>
                <td><span class="v08-rating-chip ${ratingClass(ck)}">${safe(formatRating(ck))}</span></td>
                <td><span class="v08-rating-chip ${ratingClass(sal)}">${safe(formatRating(sal))}</span></td>
                <td><span class="v08-rating-chip ${ratingClass(ins)}">${safe(formatRating(ins))}</span></td>
                <td><span class="v08-rating-chip ${ratingClass(con)}" style="box-shadow:0 0 6px rgba(0,0,0,0.4)">${safe(formatRating(con))}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
}

function electionHistoryMarkup() {
  const simulatedCycles = (game.elections || []).slice().reverse();
  const historicalCycles = (window.PartyChairData.HISTORICAL_ELECTIONS || []);

  const totalSimulated = simulatedCycles.length;
  const totalHistorical = historicalCycles.length;

  return `
    <div class="v08-history-timeline" aria-label="Unified Election History Timeline">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span class="eyebrow">${totalSimulated} Simulated Cycles · ${totalHistorical} Historical Baselines</span>
        <div class="v07-filter-tabs">
          <button type="button" data-history-tab="all" class="${historyViewTab === 'all' ? 'selected' : ''}">All Cycles</button>
          <button type="button" data-history-tab="simulated" class="${historyViewTab === 'simulated' ? 'selected' : ''}">Simulated (2028+)</button>
          <button type="button" data-history-tab="historical" class="${historyViewTab === 'historical' ? 'selected' : ''}">Historical Baselines</button>
        </div>
      </div>

      ${(historyViewTab !== 'historical' && simulatedCycles.length)
        ? simulatedCycles.map((cycle) => {
            const pres = cycle.presidential || {};
            const leg = cycle.legislature || {};
            const seats = cycle.seats || leg.seats || {};
            const demHouse = seats.people || 0;
            const repHouse = seats.heritage || 0;
            const demSen = (cycle.senate || []).filter((r) => r.winner === 'people').length;
            const repSen = (cycle.senate || []).filter((r) => r.winner === 'heritage').length;
            const presWinnerId = cycle.presidentialWinner || (cycle.ev?.people >= 270 ? 'people' : 'heritage');
            const winnerName = presWinnerId === 'people' ? (game.presidentialTicket?.people || 'Jon Ossoff') : (game.presidentialTicket?.heritage || 'J. D. Vance');
            const winnerParty = presWinnerId === 'people' ? 'Democratic' : 'Republican';
            return `
              <article class="v08-history-card">
                <span class="v08-history-badge v08-badge-player">Simulated Cycle · ${cycle.year}</span>
                <h3 style="margin:4px 0 6px;font-size:17px;font-family:'Iowan Old Style',Palatino,Georgia,serif">
                  ${cycle.year} General Election · ${safe(winnerName)} (${winnerParty})
                </h3>
                <div class="v08-history-stats">
                  ${(cycle.type === 'presidential' || cycle.cycleType === 'presidential' || (cycle.year % 4 === 0)) ? `<span>Presidency: ${safe(winnerName)} (${cycle.ev?.people || pres.demEv || 270}–${cycle.ev?.heritage || pres.repEv || 268} EV)</span>` : `<span>Midterm Cycle · White House: ${safe(winnerName)}</span>`}
                  <span>House: D ${demHouse} / R ${repHouse}</span>
                  <span>Senate Class ${cycle.senateClass === 1 ? 'I' : cycle.senateClass === 2 ? 'II' : 'III'}: D ${demSen} / R ${repSen}</span>
                </div>
                <p class="v08-history-summary">
                  Player-generated simulated general election outcome resulting from grand-strategy organizing and the 5-month campaign.
                </p>
              </article>`;
          }).join('')
        : ''}

      ${(historyViewTab !== 'simulated' && historicalCycles.length)
        ? historicalCycles.map((entry) => {
            const isBaseline = Boolean(entry.isScenarioBaseline);
            const badgeCls = isBaseline ? 'v08-badge-baseline' : 'v08-badge-historical';
            const badgeLabel = isBaseline ? '2026 Scenario Baseline' : 'Certified Historical Record';
            const cardCls = isBaseline ? 'baseline' : 'historical';
            return `
              <article class="v08-history-card ${cardCls}">
                <span class="v08-history-badge ${badgeCls}">${badgeLabel}</span>
                <h3 style="margin:4px 0 6px;font-size:17px;font-family:'Iowan Old Style',Palatino,Georgia,serif">
                  ${safe(entry.label || `${entry.year} Election`)} · ${safe(entry.winnerName)}
                </h3>
                <div class="v08-history-stats">
                  ${entry.nationalVote ? `<span>Popular Vote: D ${entry.nationalVote.people}% / R ${entry.nationalVote.heritage}%</span>` : ''}
                  ${entry.ev ? `<span>Electoral College: D ${entry.ev.people} / R ${entry.ev.heritage}</span>` : ''}
                  ${entry.houseSeats ? `<span>House: D ${entry.houseSeats.people} / R ${entry.houseSeats.heritage}</span>` : ''}
                  ${entry.senateSeats ? `<span>Senate: D ${entry.senateSeats.people} / R ${entry.senateSeats.heritage}</span>` : ''}
                </div>
                <p class="v08-history-summary">${safe(entry.summary)}</p>
              </article>`;
          }).join('')
        : ''}
      ${window.PartySystemsUI ? window.PartySystemsUI.renderHistoricalEraTimeline(game) : ''}
    </div>`;
}

function leaderDeploymentModalMarkup() {
  const recommended = game.campaign?.recommendedStates || [];
  const recStateIds = new Set(recommended.map((r) => r.stateId));
  const deployments = game.campaign?.leaderDeployments || {};
  const currentRoles = game.leadershipRoles?.player || game.player?.leadershipRoles || {};

  const identity = playerIdentity();
  const partySitting = (game.sittingMembers || []).filter((m) => m.party === identity);
  const benchMembers = [...game.roster].map((id) => memberById(id)).filter(Boolean);
  const pool = [...partySitting, ...benchMembers].filter((v, idx, arr) => arr.findIndex((x) => x.id === v.id) === idx);

  const appointedIds = Object.values(currentRoles).filter(Boolean);
  const activeLeaders = pool
    .slice()
    .sort((a, b) => {
      const aApp = appointedIds.includes(a.id) ? 1 : 0;
      const bApp = appointedIds.includes(b.id) ? 1 : 0;
      return bApp - aApp || (b.fame || 0) - (a.fame || 0);
    })
    .slice(0, 4);

  const stateRows = MAPS.states.filter((s) => s.id !== 'DC');
  const isComplete = game.phase === 'complete';
  const geometry = stateRows.map((state) => {
    const margin = window.PartyChairEngine.presidentialStateMargin ? window.PartyChairEngine.presidentialStateMargin(game, state.id) : 0;
    const isTarget = recStateIds.has(state.id);
    const fillColor = margin >= 20 ? '#1d5fb4'
      : margin >= 10 ? '#2c70c6'
      : margin >= 3 ? '#5c94dc'
      : margin > -3 ? '#7c6fa5'
      : margin > -10 ? '#d4656c'
      : margin > -20 ? '#bf3b42'
      : '#9a1d24';
    const recObj = recommended.find((r) => r.stateId === state.id);
    const targetTag = isTarget ? ` ★ TARGET: ${recObj?.reason || 'Battleground'}` : '';
    const assignedLeaderId = Object.keys(deployments).find((lid) => deployments[lid] === state.id);
    const assignedLeader = assignedLeaderId ? memberById(assignedLeaderId) : null;
    const assignedTag = assignedLeader ? ` [Surrogate: ${assignedLeader.name} (+1 Boost)]` : '';
    const qualLean = margin >= 10 ? 'Solid Democratic' : margin >= 5 ? 'Likely Democratic' : margin >= 1.5 ? 'Lean Democratic' : margin > -1.5 ? 'Toss-Up' : margin > -5 ? 'Lean Republican' : margin > -10 ? 'Likely Republican' : 'Solid Republican';
    const leanText = isComplete
      ? `${qualLean} (${Math.abs(margin) < 0.05 ? 'EVEN' : `${margin > 0 ? 'D+' : 'R+'}${Math.abs(margin).toFixed(1)}`})`
      : qualLean;
    const _depStName = state.name || window.PartyChairData?.STATES?.find((s) => s.id === state.id)?.name || state.id;
    const title = `${_depStName} (${state.id}) · Partisan Lean: ${leanText}${targetTag}${assignedTag}`;
    return `<path style="fill:${fillColor}" class="map-state-shape ${isTarget ? 'target-state-highlight' : ''}" d="${state.q.split('!').map(decodePath).join('')}" data-deploy-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
  }).join('');
  const labels = stateRows.map((state) => `<text x="${state.cx}" y="${state.cy}" class="map-label" pointer-events="none">${state.id}</text>`).join('');
  const mapSvg = `<svg class="us-map-svg" viewBox="${MAPS.viewBox}" role="img" aria-label="National Leader Deployment Map">${geometry}${labels}</svg>`;

  return `
    <div class="v08-modal-overlay" id="deployment-modal-overlay">
      <div class="v08-modal-content">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px">
          <div>
            <div class="eyebrow">Surrogate Deployment</div>
            <h2 style="margin:2px 0;font-family:'Iowan Old Style',Palatino,Georgia,serif;font-size:26px">Weekly National Leader Deployment Map</h2>
            <p style="margin:4px 0 0;color:var(--muted);font-size:13.5px">
              Deploy your active national party leaders to critical battleground states each week. Each surrogate deployment grants a flat <b>+1 boost to all races in the assigned state</b>.
            </p>
          </div>
          <button type="button" class="button button-gold" id="close-deployment-modal">Save & Close ✕</button>
        </div>

        <div style="margin:10px 0">
          ${mapSvg}
        </div>

        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin:12px 0 6px;font-size:13px;color:var(--muted)">
          <span><i style="display:inline-block;width:12px;height:12px;border:2px solid #e2bd70;background:#e2bd7033;margin-right:6px;border-radius:2px"></i><b>Pulsing Gold Border:</b> Recommended Target States</span>
          <span><b>Lean Shading:</b> Blue = Dem Lean · Red = Rep Lean · Slate = Toss-Up</span>
        </div>

        <h3 style="margin:16px 0 8px;font-family:'Iowan Old Style',Palatino,Georgia,serif;font-size:18px">Active National Surrogates & Assignments</h3>
        <div class="v08-leaders-deploy-list">
          ${activeLeaders.map((leader) => {
            const assignedStateId = deployments[leader.id] || '';
            const assignedStateObj = STATES.find((s) => s.id === assignedStateId);
            return `
              <div class="v08-leader-deploy-card">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
                  <b>${safe(leader.name)}</b>
                  ${memberMetricsBadgesMarkup(leader)}
                </div>
                <small style="color:var(--muted)">${safe(leader.title || 'National Party Leader')} · ${safe(leader.office || 'Senior Member')} · Charisma ${leader.ratings?.charisma || 6}</small>
                <div style="margin-top:6px">
                  <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:3px">Deploy to State:</label>
                  <select data-deploy-leader="${leader.id}" style="width:100%;padding:6px;background:#101923;color:var(--text);border:1px solid var(--line);border-radius:6px">
                    <option value="">— Unassigned (No State Boost) —</option>
                    <optgroup label="★ Recommended Target Battlegrounds">
                      ${recommended.map((rec) => `<option value="${rec.stateId}" ${assignedStateId === rec.stateId ? 'selected' : ''}>★ ${rec.name} (${rec.stateId}) — ${rec.reason}</option>`).join('')}
                    </optgroup>
                    <optgroup label="All 50 States">
                      ${STATES.map((st) => `<option value="${st.id}" ${assignedStateId === st.id ? 'selected' : ''}>${st.name} (${st.id}) · ${st.ev} EV</option>`).join('')}
                    </optgroup>
                  </select>
                </div>
                <span class="v08-boost-preview">
                  ${assignedStateObj ? `⚡ Active: +1 boost to Presidential, Senate, Gov & House in ${assignedStateObj.name} (${assignedStateObj.id})` : '⚪ No active state boost'}
                </span>
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

function superPacsPanelMarkup() {
  const pse = window.PartySystemsEngine;
  if (pse && pse.isSuperPacOutlawed(game)) {
    return `
      <section class="panel section-panel" style="background:linear-gradient(135deg,#0f221d,#0d151d);border-left:4px solid #059669">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Post-Citizens United Campaign Finance Regime</div>
            <h3 style="margin:2px 0 4px;font-size:18px;font-family:'Iowan Old Style',Palatino,Georgia,serif">Super PACs Dissolved Nationwide</h3>
          </div>
          <span class="v09-pac-pool-pill" style="border-color:#059669;color:#6ee7b7">Grassroots & Public Matching Active</span>
        </div>
        <p style="margin:0;color:var(--muted);font-size:13.5px;line-height:1.5">
          Following the Supreme Court’s landmark overturning of <i>Citizens United</i>, independent Super PACs have been outlawed across all fifty states. Mega-donor conduits have dried up—making grassroots member dues, neighborhood State Chapters, and public-matching Squeaky Clean nominees the decisive engines of victory.
        </p>
      </section>
    `;
  }
  const isMajor = V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(playerIdentity());
  if (!isMajor) {
    return `
      <section class="panel section-panel" style="background:linear-gradient(135deg,#121822,#0d131a);border-left:3px solid var(--border)">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Independent & Grassroots Campaign</div>
            <h3 style="margin:2px 0 4px;font-size:17px;font-family:'Iowan Old Style',Palatino,Georgia,serif">Grassroots Campaign Financing</h3>
          </div>
        </div>
        <p style="margin:0;color:var(--text-muted);font-size:13px;line-height:1.5">
          Independent & Grassroots Campaign: Third parties do not operate Super PACs. Direct campaign assistance is funded from committee treasury.
        </p>
      </section>
    `;
  }
  const pacs = ensureSuperPacCatalog();
  const isGreenEra = game?.partySystems?.currentEraId === 'era_13_green_transition';
  const totalPacPool = pacs.reduce((sum, p) => sum + Number(p.pool ?? p.poolMillions ?? p.funds ?? 0), 0);
  const actionsLeft = game.campaign?.monthlyActionsLeft ?? game.campaign?.weeklyActionsLeft ?? 8;
  const raceOptions = Object.keys(game.candidateFunding || {})
    .filter((rk) => rk.startsWith('senate:') || rk.startsWith('governor:'))
    .slice(0, 35);
  const fallbackRaces = ['senate:PA', 'senate:MI', 'senate:WI', 'senate:AZ', 'senate:GA', 'senate:NV', 'senate:NC', 'senate:OH', 'governor:NC', 'governor:NH'];
  const targetRaces = raceOptions.length ? raceOptions : fallbackRaces;
  return `
    <section class="panel section-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Independent Expenditure Coalitions</div>
          <h2>Super PACs, Issue Demands & Pet-Issue Ad Spending</h2>
        </div>
        <span class="v09-pac-pool-pill">$${roundTo(totalPacPool, 1)}M Separate PAC Pool</span>
      </div>
      <p style="margin:0 0 8px;color:var(--muted);font-size:13.5px">
        Super PAC treasuries remain strictly separate from National Committee funds. Each committee is restricted to buying battleground ads around its <b>signature pet issue</b> and may condition cash surges on platform or campaign demands.${isGreenEra ? ' <b>Green Transition Climate:</b> Clean-energy outside groups are strongly out-fundraising legacy fossil-fuel committees across the airwaves.' : ''}
      </p>
      <div class="v09-superpac-grid">
        ${pacs.map((pac) => {
          const poolAmt = Number(pac.pool ?? pac.poolMillions ?? pac.funds ?? 10);
          const leanTag = pac.lean === 'people' ? 'Dem-Aligned PAC' : pac.lean === 'heritage' ? 'GOP-Aligned PAC' : (pac.tagline || 'Independent Expenditure Committee');
          const demandObj = pac.activeDemand || null;
          const demandStatus = demandObj?.status ?? pac.demandStatus ?? 'none';
          const demandText = demandObj?.summary || demandObj?.description || pac.demandText || (demandStatus === 'pending' ? `Accommodate ${pac.petIssueLabel || pac.petIssue || 'signature issue'} priority (+$4.5M PAC pool).` : '');
          const demandPending = demandStatus === 'pending' && demandText;
          const selectedRace = pac.targetRaceKey || targetRaces[0];
          const issueLabel = pac.petIssueLabel || pac.petIssue || pac.issue || 'Issue Advocacy';
          const isAccessible = window.PartyChairEngine?.isFactionSuperPacAccessible ? window.PartyChairEngine.isFactionSuperPacAccessible(game, pac.id) : true;
          return `
            <article class="v09-pac-card">
              <div>
                <div class="v09-pac-top">
                  <div>
                    <b>${safe(pac.name)}</b>
                    <small style="color:var(--muted);font-size:12px">${safe(leanTag)}${pac.standing !== undefined ? ` · Standing ${Math.round(pac.standing)}` : ''}</small>
                  </div>
                  <span class="v09-pac-pool-pill">$${roundTo(poolAmt, 1)}M PAC Pool</span>
                </div>
                <div style="margin:8px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
                  <span class="v09-pac-issue-tag">Pet Issue: ${safe(issueLabel)}</span>
                  ${!isAccessible ? '<span class="v07-mini-badge" style="background:rgba(239,68,68,0.2);color:#f87171;border-color:#ef4444">Access Suspended · Faction Alienated</span>' : ''}
                </div>
                ${demandPending
                  ? `<div class="v09-pac-demand-box">
                      <b>PAC Issue Demand:</b> ${safe(demandText)}
                      <div class="v09-pac-demand-actions">
                        <button type="button" class="button button-small button-gold" data-pac-demand="${safe(pac.id)}" data-pac-choice="accept">Accommodate Demand</button>
                        <button type="button" class="button button-small" data-pac-demand="${safe(pac.id)}" data-pac-choice="defy">Decline</button>
                      </div>
                    </div>`
                  : `<small style="color:${demandStatus === 'accepted' ? '#8ce4be' : 'var(--muted)'};font-size:12px">${safe(pac.lastStatusNote || (demandStatus === 'accepted' ? '✓ Platform accommodation secured; full ad pipeline unlocked.' : (demandStatus === 'declined' || demandStatus === 'defied') ? 'PAC operating independently after demand refusal.' : 'No pending policy demands.'))}</small>`}
              </div>
              <div style="display:flex;gap:6px;align-items:center;margin-top:8px">
                <select id="pac-race-${safe(pac.id)}" style="flex:1;padding:6px;background:#101923;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:12px">
                  ${targetRaces.map((rk) => `<option value="${safe(rk)}" ${rk === selectedRace ? 'selected' : ''}>${safe(rk.toUpperCase())}</option>`).join('')}
                </select>
                <button type="button" class="button button-small button-gold" data-pac-ad="${safe(pac.id)}" ${poolAmt < 2 || !isAccessible ? 'disabled' : ''}>Deploy Independent Airtime</button>
              </div>
            </article>`;
        }).join('')}
      </div>
    </section>`;
}

function campaignPollingMapMarkup() {
  const activeClass = game?.activeSenateClass || (window.PartyChairEngine?.getSenateClassForYear ? window.PartyChairEngine.getSenateClassForYear(game?.year || 2028) : 3);
  const activeRoman = activeClass === 1 ? 'I' : activeClass === 2 ? 'II' : 'III';

  const prevSource = forecasterMapSource;
  const prevSenateClass = senateMapClass;
  forecasterMapSource = 'consensus';
  senateMapClass = activeRoman;

  let mapMode = 'senate';
  if (campaignPollingTab === 'house') mapMode = 'house';
  else if (campaignPollingTab === 'governor') mapMode = 'governors';
  else if (campaignPollingTab === 'stateLeg') mapMode = 'state-legislatures';
  else mapMode = 'senate';

  const mapResult = nationalMapSvg(mapMode);

  forecasterMapSource = prevSource;
  senateMapClass = prevSenateClass;

  return `
    <section class="panel section-panel v08-campaign-polling-panel" style="margin-bottom:20px">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Battleground Intelligence & Polling Consensus</div>
          <h2>Live Campaign Polling & Consensus Forecasts</h2>
          <p style="margin:4px 0 0;font-size:13px;color:var(--muted)">Synthesized consensus projections across active chambers.</p>
        </div>
        <div class="v07-filter-tabs">
          <button type="button" class="tab-btn ${campaignPollingTab === 'senate' ? 'selected' : ''}" data-camp-poll-tab="senate">Senators</button>
          <button type="button" class="tab-btn ${campaignPollingTab === 'house' ? 'selected' : ''}" data-camp-poll-tab="house">House</button>
          <button type="button" class="tab-btn ${campaignPollingTab === 'governor' ? 'selected' : ''}" data-camp-poll-tab="governor">Governor</button>
          <button type="button" class="tab-btn ${campaignPollingTab === 'stateLeg' ? 'selected' : ''}" data-camp-poll-tab="stateLeg">State Legislature</button>
        </div>
      </div>
      <div class="v08-campaign-map-container" style="min-height:360px">
        ${mapResult.view}
        ${mapResult.legend}
      </div>
      <div class="v08-commissioned-polling-bar" style="display:flex;gap:12px;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--border);flex-wrap:wrap">
        <button type="button" class="btn btn-primary button button-gold" id="btn-commission-poll" data-action="commission-race-poll" ${game.treasury < 1.0 ? 'disabled' : ''}>
          📊 Commission Race Poll ($1.0M)
        </button>
        <button type="button" class="btn btn-secondary button button-secondary" id="btn-view-commissioned-polls" data-action="open-commissioned-polls">
          📋 Commissioned polls (${Array.isArray(game.commissionedPolls) ? game.commissionedPolls.length : (game.commissionedPolls && typeof game.commissionedPolls === 'object' ? Object.keys(game.commissionedPolls).length : 0)})
        </button>
        <span style="font-size:12px;color:var(--muted)">Poll any contested battleground race to uncover internal margin intelligence.</span>
      </div>
    </section>
  `;
}

function commissionPollModalMarkup() {
  const activeClass = game?.activeSenateClass || (window.PartyChairEngine?.getSenateClassForYear ? window.PartyChairEngine.getSenateClassForYear(game?.year || 2028) : 3);
  const senateRaces = game?.activeSenateRaces || (window.PartyChairEngine?.getActiveSenateRaces ? window.PartyChairEngine.getActiveSenateRaces(game, game?.year || 2028) : []);
  const govStates = game?.activeGubernatorialStates || (window.PartyChairEngine?.getActiveGubernatorialStates ? window.PartyChairEngine.getActiveGubernatorialStates(game?.year || 2028) : []);
  const allDistricts = window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS || [];
  const stateLegs = window.PartyChairData?.VERSION_01_STATE_LEGISLATIVE_RACES || [];

  return `
    <div class="v08-modal-overlay" id="commission-poll-modal-overlay">
      <div class="v08-modal-content" style="max-width:680px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px">
          <div>
            <div class="eyebrow">Strategic Polling Operations · Campaign Month ${game?.campaign?.week || 1} of 5</div>
            <h2 style="margin:2px 0;font-family:'Iowan Old Style',Palatino,Georgia,serif;font-size:24px">Commission Battleground Race Poll</h2>
            <p style="margin:4px 0 0;color:var(--muted);font-size:13px">
              Direct field survey operations ($1.0M treasury) to uncover internal likely voter preference with ±3.5% margin of error.
            </p>
          </div>
          <button type="button" class="button button-gold" id="close-commission-poll-modal">Cancel ✕</button>
        </div>

        <div style="background:#131c27;border:1px solid var(--line);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
          <label style="font-size:13px;font-weight:600;color:var(--text)">
            Select Battleground Contest:
          </label>
          <select id="commission-race-select" style="width:100%;padding:8px 10px;background:#101923;border:1px solid var(--line);border-radius:6px;color:var(--text);font-size:13.5px">
            <optgroup label="U.S. Senate (Class ${activeClass === 1 ? 'I' : activeClass === 2 ? 'II' : 'III'})">
              ${senateRaces.map((r) => {
                const st = STATES.find((s) => s.id === r.state);
                return `<option value="senate:${r.state}" data-office="senate" data-state-id="${r.state}">Senate: ${st ? st.name : r.state} (${r.state})</option>`;
              }).join('')}
            </optgroup>
            <optgroup label="Gubernatorial Contests">
              ${govStates.map((stId) => {
                const st = STATES.find((s) => s.id === stId);
                return `<option value="governor:${stId}" data-office="governor" data-state-id="${stId}">Governor: ${st ? st.name : stId} (${stId})</option>`;
              }).join('')}
            </optgroup>
            <optgroup label="Competitive U.S. House Battlegrounds">
              ${allDistricts.slice(0, 30).map((d) => `<option value="house:${d.id}" data-office="house" data-state-id="${d.stateId}">House: ${d.id} (PVI ${d.pvi || d.lean})</option>`).join('')}
            </optgroup>
            <optgroup label="State Legislative Chambers">
              ${stateLegs.slice(0, 20).map((leg) => {
                const st = STATES.find((s) => s.id === leg.stateId);
                const chamber = leg.id.endsWith(':upper') ? 'State Senate' : 'State House';
                return `<option value="stateLeg:${leg.id}" data-office="stateLeg" data-state-id="${leg.stateId}">State Leg: ${st ? st.name : leg.stateId} ${chamber}</option>`;
              }).join('')}
            </optgroup>
          </select>

          <div style="font-size:12px;color:var(--muted);line-height:1.5">
            <b>Survey Specifications:</b> Sample N = 600 likely voters · Random digit dialing & verified voter files · Weighting by race, age, and education · Margin of Error ±3.5% at 95% confidence.
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button type="button" class="button button-secondary" id="btn-cancel-commission-poll">Cancel</button>
          <button type="button" class="button button-gold" id="btn-confirm-commission-poll" ${(game?.treasury || 0) < 1.0 ? 'disabled' : ''}>
            Conduct Poll ($1.0M) →
          </button>
        </div>
      </div>
    </div>
  `;
}

function commissionedPollsModalMarkup() {
  const polls = Array.isArray(game?.commissionedPolls)
    ? game.commissionedPolls
    : (game?.commissionedPolls && typeof game.commissionedPolls === 'object' ? Object.values(game.commissionedPolls).filter((v) => v && typeof v === 'object') : []);

  return `
    <div class="v08-modal-overlay" id="commissioned-polls-modal-overlay">
      <div class="v08-modal-content" style="max-width:850px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px">
          <div>
            <div class="eyebrow">Polling Archive · Campaign ${game?.year || 2028}</div>
            <h2 style="margin:2px 0;font-family:'Iowan Old Style',Palatino,Georgia,serif;font-size:24px">Commissioned Internal Surveys Archive</h2>
            <p style="margin:4px 0 0;color:var(--muted);font-size:13px">
              Review historical survey tracking and top-line margins across battleground races polled by your campaign.
            </p>
          </div>
          <button type="button" class="button button-gold" id="close-commissioned-polls-modal">Close ✕</button>
        </div>

        ${polls.length === 0 ? `
          <div style="padding:48px 16px;text-align:center;color:var(--muted)">
            <p style="font-size:16px;margin:0 0 8px">No internal surveys commissioned yet this election cycle.</p>
            <p style="font-size:13px;margin:0">Click <b>"📊 Commission Race Poll ($1.0M)"</b> on the Live Campaign Polling panel to test battleground waters.</p>
          </div>
        ` : `
          <div style="max-height:60vh;overflow-y:auto;border:1px solid var(--line);border-radius:10px;background:#0d141d">
            <table class="v08-triage-table" style="width:100%;margin:0">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Race & Office</th>
                  <th>Your Party</th>
                  <th>Rival Party</th>
                  <th>Undecided</th>
                  <th>Margin</th>
                  <th>MoE</th>
                </tr>
              </thead>
              <tbody>
                ${polls.map((p) => {
                  const lead = p.margin >= 0 ? `+${p.margin}% Lead` : `${p.margin}% Deficit`;
                  const pillColor = p.margin >= 0 ? '#4caf50' : '#f44336';
                  return `
                    <tr>
                      <td><span style="font-family:Consolas,monospace;font-size:12px;background:#182534;padding:3px 7px;border-radius:4px">Month ${p.month}</span></td>
                      <td><b>${safe(p.title || p.raceKey)}</b> <small style="display:block;color:var(--muted)">${safe(p.raceKey)}</small></td>
                      <td><b style="color:var(--gold);font-size:14px">${p.playerShare}%</b></td>
                      <td><span style="font-size:14px">${p.rivalShare}%</span></td>
                      <td><span style="color:var(--muted);font-size:13px">${p.undecided}%</span></td>
                      <td><span style="font-weight:700;color:${pillColor}">${lead}</span></td>
                      <td><small style="color:var(--muted)">±${p.moe || 3.5}%</small></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid var(--line)">
          <span style="font-size:12px;color:var(--muted)">Total Commissioned: <b>${polls.length}</b> surveys ($${(polls.length * 1.0).toFixed(1)}M spent)</span>
          <button type="button" class="button button-secondary" id="btn-close-commissioned-polls">Close Archive</button>
        </div>
      </div>
    </div>
  `;
}

function campaignDashboardMarkup() {
  const c = game.campaign || {};
  const week = c.week || 1;
  const maxWeeks = c.maxWeeks || 5;
  const actionsLeft = c.monthlyActionsLeft ?? c.weeklyActionsLeft ?? 8;
  const wave = c.waveMomentum ?? game.waveMomentum ?? 0;
  const happiness = Math.round(game.sittingMemberHappiness ?? 70);
  const requests = c.weeklyRequests || [];
  const fundingEntries = Object.values(game.candidateFunding || {});
  const currentEvent = c.currentEvent;
  const isOctoberSurpriseWeek = week === 4 || (currentEvent?.isOctoberSurprise && !c.octoberSurpriseResolved);

  const filteredCandidates = fundingEntries.filter((entry) => {
    if (campaignTriageFilter === 'senate' && entry.kind !== 'Senate') return false;
    if (campaignTriageFilter === 'governor' && entry.kind !== 'Governor') return false;
    if (campaignTriageFilter === 'house' && entry.kind !== 'House') return false;
    if (campaignTriageSearch) {
      const q = campaignTriageSearch.toLowerCase();
      if (!entry.candidateName?.toLowerCase().includes(q) && !entry.raceKey?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const eligibleBallotStates = STATES.filter((s) => !(game.stateLegislatures?.[s.id] || []).includes(playerIdentity()));
  const coalitionFactions = partySpecificFactions(playerIdentity());
  const lowCoalitionFactions = coalitionFactions.filter((f) => factionStandingValue(f) < 35);
  const splinters = game.splinterFactions || [];
  const switches = game.partySwitches || [];

  return `
    <div class="v08-campaign-dashboard">
      ${lowCoalitionFactions.length || splinters.length || switches.length ? `
        <div class="v09-bolt-alert">
          <div>
            <b>⚠ Coalition Stress & Alignment Watch:</b>
            ${lowCoalitionFactions.length ? ` <span>${lowCoalitionFactions.map((f) => safe(f.name)).join(', ')} below 35 standing (Bolt Risk).</span>` : ''}
            ${splinters.length ? ` <span>Active Splinter Ticket(s): ${splinters.map((sp) => safe(sp.name || sp)).join(', ')}.</span>` : ''}
            ${switches.length ? ` <span>Recent Aisle-Crossings: ${switches.slice(-2).map((sw) => safe(sw.name || sw)).join(', ')}.</span>` : ''}
          </div>
          <button type="button" class="button button-small" data-main-tab="party-info">Inspect Factions →</button>
        </div>` : ''}
      <section class="v08-campaign-header">
        <div>
          <div class="eyebrow">5-Month Campaign Command</div>
          <h2>Campaign Month ${week} of ${maxWeeks}</h2>
          <p style="margin:4px 0 0;color:var(--muted);font-size:14px">
            General election campaign phase. Allocate candidate funds, triage battlegrounds, and execute grand-strategy operations before Election Night.
          </p>
        </div>
        <div class="v08-campaign-kpis">
          <div class="v08-kpi-pill"><small>National Treasury</small><b>$${game.treasury}M</b></div>
          <div class="v08-kpi-pill"><small>Monthly Actions</small><b>${actionsLeft}/5</b></div>
          <div class="v08-kpi-pill"><small>Wave Momentum</small><b style="color:${wave >= 0 ? '#3478c8' : '#c9474e'}">${wave >= 0 ? 'D+' : 'R+'}${Math.abs(wave).toFixed(1)}</b></div>
          <div class="v08-kpi-pill"><small>Sitting Member Happiness</small><b style="color:${happiness < 45 ? '#e8887e' : '#75c89a'}">${happiness}/100</b></div>
        </div>
      </section>

      ${isOctoberSurpriseWeek && !c.octoberSurpriseResolved && !c.eventResolved && currentEvent
        ? `<section class="v08-october-surprise">
            <span class="v08-breaking-tag">🚨 BREAKING NEWS · OCTOBER SURPRISE (MONTH 4)</span>
            <h3 class="v08-surprise-title">${safe(currentEvent.title)}</h3>
            <p class="v08-surprise-text">${safe(currentEvent.body || currentEvent.text || '')}</p>
            <div class="v08-choices-grid">
              ${(currentEvent.choices || []).map((choice, idx) => `
                <div class="v08-choice-card">
                  <div>
                    <h4>${safe(choice.label)}</h4>
                    <p>${safe(choice.effect || choice.label)}</p>
                  </div>
                  <button type="button" class="button button-gold" data-campaign-event-choice="${idx}">Execute Decision →</button>
                </div>
              `).join('')}
            </div>
          </section>`
        : isOctoberSurpriseWeek && c.octoberSurpriseResolved && currentEvent
          ? `<section class="v08-october-surprise" style="border-color:#75c89a;background:linear-gradient(135deg,#13221a,#121a24);animation:none">
              <span class="v08-breaking-tag" style="background:#75c89a;color:#0e1713">OCTOBER SURPRISE RESOLVED</span>
              <h3 style="margin:4px 0 6px;font-size:20px;font-family:'Iowan Old Style',Palatino,Georgia,serif">${safe(currentEvent.title)}</h3>
              <p style="margin:0;font-size:13.5px;color:var(--muted)">Strategic crisis response enacted and recorded in campaign history.</p>
            </section>`
        : currentEvent && !c.eventResolved
          ? `<section class="panel section-panel v08-campaign-event-panel" style="border-left:4px solid var(--gold);background:#131c27">
              <div class="section-heading">
                <div>
                  <div class="eyebrow">Campaign Event · Month ${week} of ${maxWeeks}</div>
                  <h3 style="margin:2px 0 4px;font-size:20px;font-family:'Iowan Old Style',Palatino,Georgia,serif">${safe(currentEvent.title)}</h3>
                </div>
                <span class="turnout-chip warning">Decision Required</span>
              </div>
              <p style="margin:0 0 12px;font-size:14px;color:var(--muted)">${safe(currentEvent.body || currentEvent.text || '')}</p>
              <div class="v08-choices-grid">
                ${(currentEvent.choices || []).map((choice, idx) => `
                  <div class="v08-choice-card">
                    <div>
                      <h4>${safe(choice.label)}</h4>
                      <p>${safe(choice.effect || choice.label)}</p>
                    </div>
                    <button type="button" class="button button-gold" data-campaign-event-choice="${idx}">Execute Decision →</button>
                  </div>
                `).join('')}
              </div>
            </section>`
        : currentEvent && c.eventResolved
          ? `<section class="panel section-panel" style="border-left:4px solid #75c89a;background:#111a22">
              <div class="section-heading">
                <div>
                  <div class="eyebrow">Resolved Campaign Event · Month ${week}</div>
                  <h4 style="margin:2px 0 0;font-size:16px;font-family:'Iowan Old Style',Palatino,Georgia,serif">${safe(currentEvent.title)}</h4>
                </div>
                <span class="turnout-chip" style="background:#1b3829;color:#84db9f">Enacted ✓</span>
              </div>
              <p style="margin:4px 0 0;font-size:13px;color:var(--muted)">${safe(game.lastNote || 'Event decision resolved for this campaign month.')}</p>
            </section>`
          : ''}

      ${activeEraFeedbackBannerMarkup()}

      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Monthly Campaign Funding Requests</div>
            <h2>Monthly Funding Requests (Month ${week})</h2>
          </div>
          <span class="turnout-chip">${requests.filter((r) => r.status === 'pending').length} Pending Decisions</span>
        </div>
        <p style="margin:0 0 12px;color:var(--muted);font-size:13.5px">
          Nominees facing competitive pressure request emergency national committee funds. Refusing or ignoring requests in close races inflicts <b>margin-sensitive upset penalties</b> on Sitting Member Happiness.
        </p>

        ${requests.length
          ? `<div class="v08-requests-grid">
              ${requests.map((req) => {
                const isPacDemand = req.sourceType === 'superpac' || Boolean(req.pacId);
                const isPending = req.status === 'pending';
                if (isPacDemand) {
                  return `
                  <article class="v08-request-card">
                    <div class="v08-request-header">
                      <b>${safe(req.pacName || 'Allied Super PAC')}</b>
                      <span class="v08-risk-tag v08-risk-pac">SUPER PAC DEMAND</span>
                    </div>
                    <small style="color:var(--muted)">Policy Alignment · Issue: <b>${safe(req.petIssueLabel || 'Platform Stance')}</b></small>
                    <p style="margin:4px 0 8px;font-size:13px;line-height:1.4">${safe(req.label || req.summary || req.text || '')}</p>
                    <div class="v08-request-actions">
                      ${isPending
                        ? `<button type="button" class="button button-small button-gold" data-approve-funding="${req.id}">Align & Accept</button>
                           <button type="button" class="button button-small" data-refuse-funding="${req.id}">Refuse</button>`
                        : req.status === 'approved'
                          ? `<span class="v08-badge-approved">Aligned (Ad surge unlocked)</span>`
                          : `<span class="v08-badge-refused">Refused (PAC standing lowered)</span>`}
                    </div>
                  </article>`;
                }
                const risk = req.riskLevel || 'med';
                const amt = Number(req.amount || 0);
                return `
                  <article class="v08-request-card">
                    <div class="v08-request-header">
                      <b>${safe(req.candidateName)}</b>
                      <span class="v08-risk-tag v08-risk-${risk}">${risk.toUpperCase()} UPSET RISK</span>
                    </div>
                    <small style="color:var(--muted)">${safe(req.kind)} · Race: <b>${safe(req.raceKey)}</b></small>
                    <p style="margin:4px 0 8px;font-size:13px;line-height:1.4">${safe(req.label || req.text || '')}</p>
                    <div class="v08-request-actions">
                      ${isPending
                        ? `<button type="button" class="button button-small button-gold" data-approve-funding="${req.id}" ${game.treasury < amt ? 'disabled' : ''}>Approve ($${amt}M)</button>
                           <button type="button" class="button button-small" data-refuse-funding="${req.id}">Refuse</button>`
                        : req.status === 'approved'
                          ? `<span class="v08-badge-approved">Approved ($${amt}M allocated)</span>`
                          : `<span class="v08-badge-refused">Refused (Candidate aggrieved)</span>`}
                    </div>
                  </article>`;
              }).join('')}
            </div>`
          : !isMajorParty(game, 'player')
            ? `<p class="quiet-note">Independent & Grassroots Campaign: Third parties do not operate Super PACs. Direct campaign assistance is funded from committee treasury.</p>`
            : `<p class="quiet-note">No new funding requests this month.</p>`}
      </section>

      <section class="panel section-panel" style="background:linear-gradient(135deg,#182535,#121b25)">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <div class="eyebrow">Surrogate Deployment</div>
            <h3 style="margin:2px 0;font-family:'Iowan Old Style',Palatino,Georgia,serif;font-size:20px">National Leader Deployment Command</h3>
            <p style="margin:4px 0 0;color:var(--muted);font-size:13px">
              Active surrogates provide a flat <b>+1 boost to all races</b> in their assigned state.
            </p>
          </div>
          <button type="button" class="button button-gold" id="open-deployment-modal">
            🗺️ Open 50-State Deployment Map →
          </button>
        </div>
      </section>

      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Candidate Budget Triage & Baselines</div>
            <h2>Candidate Budget Triage</h2>
          </div>
          <span class="turnout-chip">Baselines: $1M House / $5M Senate</span>
        </div>
        <p style="margin:0 0 10px;color:var(--muted);font-size:13.5px">
          Manage general election funding across all 480 congressional & gubernatorial races. Pulling funds from close/trailing races triggers fury and Sitting Member Happiness loss; unendorsed primary winners start unhappy (-1.2% general penalty) until pacified.
        </p>

        <div class="v08-triage-controls">
          <div class="v07-filter-tabs">
            <button type="button" data-triage-filter="all" class="${campaignTriageFilter === 'all' ? 'selected' : ''}">All Nominees (${fundingEntries.length})</button>
            <button type="button" data-triage-filter="senate" class="${campaignTriageFilter === 'senate' ? 'selected' : ''}">Senate (${fundingEntries.filter((f) => f.kind === 'Senate').length})</button>
            <button type="button" data-triage-filter="governor" class="${campaignTriageFilter === 'governor' ? 'selected' : ''}">Governors (${fundingEntries.filter((f) => f.kind === 'Governor').length})</button>
            <button type="button" data-triage-filter="house" class="${campaignTriageFilter === 'house' ? 'selected' : ''}">House (${fundingEntries.filter((f) => f.kind === 'House').length})</button>
          </div>
          <input type="text" id="triage-search" placeholder="Search candidate or race..." value="${safe(campaignTriageSearch)}" style="padding:6px 12px;background:#101923;border:1px solid var(--line);border-radius:6px;color:var(--text);font-size:13px" />
        </div>

        <div class="v08-triage-table-wrap">
          <table class="v08-triage-table">
            <thead>
              <tr>
                <th>Candidate & Race</th>
                <th>Baseline</th>
                <th>Allocated</th>
                <th>Nominee Happiness</th>
                <th>Flags</th>
                <th>Funding Controls</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCandidates.slice(0, 50).map((cand) => {
                const isHouse = cand.kind === 'House' || cand.raceKey?.startsWith('house:');
                const unitCost = isHouse ? 1 : 2;
                const lift = window.PartyChairEngine?.computeFundingPollingLift ? window.PartyChairEngine.computeFundingPollingLift(cand.allocated || 0) : (cand.pollingLift || 0);
                return `
                <tr>
                  <td><b>${safe(cand.candidateName)}</b> <small style="display:block;color:var(--muted)">${safe(cand.kind)} · ${safe(cand.raceKey)}</small></td>
                  <td>$${cand.baseline}M</td>
                  <td>
                    <b style="color:var(--gold)">$${cand.allocated}M</b>
                    <small style="display:block;color:var(--accent);font-size:11px">(+${lift.toFixed(1)}% in polls)</small>
                  </td>
                  <td>
                    <span style="font-family:Consolas,monospace;font-size:12px">${cand.happiness ?? 60}/100</span>
                    <div class="meter" style="width:70px;height:4px;margin-top:3px"><i style="width:${cand.happiness ?? 60}%;--meter:${(cand.happiness ?? 60) < 45 ? '#e8887e' : '#75c89a'}"></i></div>
                  </td>
                  <td>
                    ${cand.unhappy ? `<span class="v08-unhappy-pill">⚠ Unhappy Nominee</span>` : ''}
                    ${cand.pulled ? `<span class="v08-pulled-pill">💸 Funds Pulled</span>` : ''}
                    ${!cand.unhappy && !cand.pulled ? `<small style="color:var(--muted)">Nominee aligned</small>` : ''}
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button type="button" class="button button-small" data-allocate-funds="${cand.raceKey}" ${game.treasury < unitCost ? 'disabled' : ''}>+${unitCost === 1 ? '$1M' : '$2M'}</button>
                      <button type="button" class="button button-small button-danger" data-pull-funds="${cand.raceKey}" ${cand.allocated <= 0 ? 'disabled' : ''}>Pull</button>
                    </div>
                  </td>
                </tr>
              `;}).join('')}
            </tbody>
          </table>
        </div>
        ${filteredCandidates.length > 50 ? `<small style="display:block;margin-top:6px;color:var(--muted)">Showing top 50 of ${filteredCandidates.length} nominees matching filter.</small>` : ''}
      </section>

      ${superPacsPanelMarkup()}

      ${campaignPollingMapMarkup()}

      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Strategic Operations</div>
            <h2>Monthly Grand-Strategy Actions</h2>
          </div>
          <span class="turnout-chip">${actionsLeft}/${c.maxMonthlyActions || 8} Actions Remaining</span>
        </div>

        <div class="v08-actions-grid">
          <div class="v08-action-card">
            <div>
              <span class="v08-action-cost">COST: $2M · 1 ACTION</span>
              <h3>Self-Vet & Rapid Response</h3>
              <p>Thoroughly vet a nominated candidate and establish a rapid-response quarantine to neutralize corruption vulnerability before rival super PACs attack.</p>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <select id="self-vet-select" style="flex-grow:1;padding:6px;background:#101923;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:12px">
                ${fundingEntries.map((f) => `<option value="${f.raceKey}">${safe(f.kind || 'Contest')} · ${safe(f.raceKey)}</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" id="btn-self-vet" ${actionsLeft <= 0 || game.treasury < 2 ? 'disabled' : ''}>Vet</button>
            </div>
          </div>

          <div class="v08-action-card">
            <div>
              <span class="v08-action-cost">COST: $3M · 1 ACTION</span>
              <h3>Opposition Research Blitz</h3>
              <p>Release an opposition research dossier in a battleground state to erode rival standing with undecided swing voters. Impact scales with your party's institutional rank.</p>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <select id="oppo-select" style="flex-grow:1;padding:6px;background:#101923;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:12px">
                ${STATES.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('oppo-select', STATES[0]?.id) ? 'selected' : ''}>${s.name} (${s.id})</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" id="btn-oppo" ${actionsLeft <= 0 || game.treasury < 3 ? 'disabled' : ''}>Release</button>
            </div>
          </div>

          <div class="v08-action-card">
            <div>
              <span class="v08-action-cost">COST: $0M · 1 ACTION (FREE FINANCIALLY)</span>
              <h3>Volunteer Drive</h3>
              <p>Mobilize grassroots volunteers and neighborhood precinct teams to register voters for your party in a target state. Voter gains scale with your party's institutional rank.</p>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <select id="volunteer-state-select" class="v08-volunteer-state-select" style="flex-grow:1;padding:6px;background:#101923;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:12px">
                ${STATES.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('volunteer-state-select', STATES[0]?.id) ? 'selected' : ''}>${s.name} (${s.id})</option>`).join('')}
              </select>
              <button type="button" class="button button-gold" id="action-volunteer-drive" ${actionsLeft <= 0 ? 'disabled' : ''}>
                Launch Volunteer Drive (Free · 1 Action) →
              </button>
            </div>
          </div>

          <div class="v08-action-card">
            <div>
              <span class="v08-action-cost">COST: $4M · 1 ACTION</span>
              <h3>National Media Blitz</h3>
              <p>Run a coordinated national media push across Sunday talk shows and digital podcasts to build credibility with independent and persuadable voters. Impact scales with your party's institutional rank.</p>
            </div>
            <button type="button" class="button button-gold" id="action-surrogate-blitz" style="margin-top:8px" ${actionsLeft <= 0 || game.treasury < 4 ? 'disabled' : ''}>
              Deploy National Media Blitz →
            </button>
          </div>

          <div class="v08-action-card">
            <div>
              <span class="v08-action-cost">COST: $0M · 1 ACTION (FREE FINANCIALLY)</span>
              <h3>Joint Victory Fund</h3>
              <p>Coordinate with state party chapters to execute an emergency joint victory fundraiser directly into your treasury. Yield scales with your party's institutional rank.</p>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <select id="joint-state-select" style="flex-grow:1;padding:6px;background:#101923;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:12px">
                ${STATES.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('joint-state-select', STATES[0]?.id) ? 'selected' : ''}>${s.name} (${s.id})</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" id="btn-joint-victory" ${actionsLeft <= 0 ? 'disabled' : ''}>Fundraise</button>
            </div>
          </div>

          <div class="v08-action-card">
            <div>
              <span class="v08-action-cost">COST: $4M · 1 ACTION</span>
              <h3>State Ballot Initiative</h3>
              <p>Where your party lacks legislative control, qualify citizen ballot initiatives (voting rights, minimum wage, reproductive freedom) to boost core turnout. Impact scales with your party's institutional rank.</p>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <select id="ballot-state-select" style="flex-grow:1;padding:6px;background:#101923;color:var(--text);border:1px solid var(--line);border-radius:6px;font-size:12px">
                ${eligibleBallotStates.map((s) => `<option value="${s.id}" ${s.id === getSelectedActionState('ballot-state-select', eligibleBallotStates[0]?.id) ? 'selected' : ''}>${s.name} (${s.id})</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" id="btn-ballot-measure" ${actionsLeft <= 0 || game.treasury < 4 || !eligibleBallotStates.length ? 'disabled' : ''}>Qualify</button>
            </div>
          </div>
        </div>
      </section>

      ${v0180CampaignWarRoomMarkup()}

      <div class="v07-step-nav panel">
        <span class="v07-turn-note">
          ${safe(game.lastNote || `Campaign Month ${week} of 5. Make strategic allocations then advance the month.`)}
        </span>
        ${window.AtlasMultiplayerSystem && window.AtlasMultiplayerSystem.isMultiplayerEnabled(game)
          ? window.AtlasMultiplayerSystem.renderHotseatTurnButton(game)
          : `<button type="button" class="button button-gold advance-week-btn" id="advance-campaign-week">${week < maxWeeks ? `Advance to Campaign Month ${week + 1} of 5 →` : `Proceed to General Election Night ${game?.year || 2028} ★`}</button>`}
      </div>
    </div>`;
}


function v0180CampaignWarRoomMarkup() {
  const CO = window.CampaignOverhaul;
  const c = game?.campaign;
  if (!CO || !c) return '';
  const month = Number(c.month || c.week || 1);
  const eff = CO.getMonthEfficiency(month);
  const actionsLeft = c.monthlyActionsLeft ?? c.weeklyActionsLeft ?? 8;
  const maxActs = c.maxMonthlyActions ?? 8;
  const ticker = (c.rivalActivity?.tickerItems || []).slice(0, 8);
  const morningWire = (c.rivalActivity?.morningWireHeadlines || c.morningWireHeadlines || []).slice(0, 6);
  const mapPins = c.rivalActivity?.mapPins || [];
  const showPins = Boolean(window.__v0181ShowRivalPins);
  const surrogates = CO.getEligibleSurrogates(game);
  const usedSur = new Set(c.surrogatesUsedThisMonth || []);
  const activeCrises = (c.activeCrises || []).filter((cr) => !cr.resolved);
  const debate = c.pendingDebate && !c.pendingDebate.resolved ? c.pendingDebate : null;
  const ultimatum = c.pendingUltimatum && !c.pendingUltimatum.resolved ? c.pendingUltimatum : null;
  const dossiers = (c.oppoDossiers || []).filter((d) => !d.detonated);
  const tossups = month >= 4 ? CO.getTossUpWatchRaces(game) : [];
  const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
  const isMajor = CO.isPlayerMajorParty ? CO.isPlayerMajorParty(game) : Boolean(game.player?.isMajor || ['people', 'heritage'].includes(pId));
  // #16: Show ALL active issues (not .slice(0, 12))
  const issues = window.PartySystemsEngine?.getActiveIssuesForGame
    ? window.PartySystemsEngine.getActiveIssuesForGame(game)
    : (window.PartyChairData?.VERSION_021_ISSUES || window.PartyChairData?.ISSUES || []);
  const statesList = (window.PartyChairData?.STATES || []).slice().sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));
  const _normRecSt = (x) => (typeof x === 'string' ? x : (x?.stateId || x?.id || x?.code || ''));
  const defaultState = _normRecSt(window.__v0181SelectedState) || _normRecSt(c.recommendedStates?.[0]) || 'PA';
  const satVal = Number(c.stateSaturation?.[defaultState] || 0);
  const satTier = CO.getSaturationTier ? CO.getSaturationTier(satVal) : { label: 'Fresh', effMult: 1 };
  const allFactions = (game.factions || []).slice(0, 40);
  const rivalParties = (game.rivals || []).filter((r) => r && r.id);
  const defaultRival = window.__v0181SelectedRival || rivalParties[0]?.id || (pId === 'people' ? 'heritage' : 'people');
  const _recIds = (c.recommendedStates || []).map(_normRecSt).filter(Boolean);
  const defaultBlitz = _recIds.length >= 3 ? _recIds.slice(0, 3) : ['PA', 'MI', 'WI'];

  return `
    <section class="panel section-panel v0180-war-room" style="margin-top:14px;border:1px solid rgba(226,189,112,0.35);">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
        <div>
          <h3 style="margin:0;">Campaign War Room · Month ${month} (${safe(eff.name)})</h3>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Persuasion Efficiency: <b>${Math.round(eff.persuasion * 100)}%</b> · Turnout Efficiency: <b>${Math.round(eff.turnout * 100)}%</b></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span data-v0182-sat-badge class="badge" style="background:rgba(148,163,184,0.16);color:#cbd5e1;padding:4px 10px;border-radius:999px;font-size:11px;">Airwaves (${safe(defaultState)}): <b>${safe(satTier.label)} (${Math.round((satTier.effMult || 1) * 100)}%)</b></span>
          <span class="badge" style="background:rgba(226,189,112,0.18);color:#e2bd70;padding:4px 10px;border-radius:999px;font-weight:700;">Actions Remaining: ${actionsLeft} / ${maxActs}</span>
        </div>
      </div>

      ${/* [v0.18.4 MEDIA-SHOCKS] */ window.MediaShocksSystem ? window.MediaShocksSystem.renderMediaBalanceBar(game) : ''}
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px;padding:8px 10px;background:rgba(15,23,42,0.45);border-radius:8px;">
        <label style="font-size:12px;">Target State:
          <select id="v0180-state-select" style="margin-left:4px;padding:3px 6px;border-radius:6px;background:#0f172a;color:#f8fafc;border:1px solid rgba(148,163,184,0.35);">
            ${statesList.map((st) => {
              const stSat = CO.getSaturationTier ? CO.getSaturationTier(c.stateSaturation?.[st.id] || 0) : { label: 'Fresh' };
              return `<option value="${safe(st.id)}" ${st.id === defaultState ? 'selected' : ''}>${safe(st.id)} — ${safe(st.name)} [${safe(stSat.label)}]</option>`;
            }).join('')}
          </select>
        </label>
        <label style="font-size:12px;">Target Faction:
          <select id="v0180-faction-select" style="margin-left:4px;padding:3px 6px;border-radius:6px;background:#0f172a;color:#f8fafc;border:1px solid rgba(148,163,184,0.35);">
            ${allFactions.map((f) => `<option value="${safe(f.id)}" ${f.id === (window.__v0181SelectedFaction || allFactions[0]?.id) ? 'selected' : ''}>${safe(f.name || f.id)}</option>`).join('')}
          </select>
        </label>
        <label style="font-size:12px;">Target Rival:
          <select id="v0180-rival-select" style="margin-left:4px;padding:3px 6px;border-radius:6px;background:#0f172a;color:#f8fafc;border:1px solid rgba(148,163,184,0.35);">
            ${rivalParties.map((r) => `<option value="${safe(r.id)}" ${r.id === defaultRival ? 'selected' : ''}>${safe(r.name || r.id)}</option>`).join('')}
          </select>
        </label>
        <button type="button" class="button button-secondary" style="font-size:11px;padding:4px 8px;" data-v0180-toggle-pins="1">${showPins ? 'Hide' : 'Show'} Rival Map Pins (${mapPins.length})</button>
      </div>

      ${(() => {
        const selStObj = statesList.find((s) => s.id === defaultState) || { id: defaultState, name: defaultState, ev: 10 };
        const airSpend = c.airwavesSpendByState?.[defaultState] || {};
        const fieldOff = c.fieldOfficesByState?.[defaultState] || {};
        const oppoShock = Number(c.oppoStateEffects?.[defaultState] || 0);
        const totalAirSpend = Object.values(airSpend).reduce((s, v) => s + Number(v || 0), 0);
        const totalOffices = Object.values(fieldOff).reduce((s, v) => s + Number(v || 0), 0);
        const satBadgeBg = satTier.id === 'open' ? 'rgba(74,222,128,0.16)' : satTier.id === 'crowded' ? 'rgba(250,204,21,0.16)' : satTier.id === 'saturated' ? 'rgba(249,115,22,0.16)' : 'rgba(239,68,68,0.16)';
        const satBadgeColor = satTier.id === 'open' ? '#86efac' : satTier.id === 'crowded' ? '#fde047' : satTier.id === 'saturated' ? '#fdba74' : '#fca5a5';

        return `
          <div style="background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.25);border-radius:8px;padding:10px 14px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
              <div style="font-size:12.5px;font-weight:700;color:#e2bd70;letter-spacing:0.04em;">
                STATE AIRWAVES &amp; GROUND BALANCE · ${safe(defaultState)} (${safe(selStObj.name)}, ${selStObj.ev || 10} EV)
              </div>
              <span class="badge" style="background:${satBadgeBg};color:${satBadgeColor};padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;">
                ${safe(satTier.label)} (${Math.round((satTier.effMult || 1) * 100)}% Ad Eff · ${satTier.costMult}x Cost)
              </span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;font-size:12px;">
              <div style="background:rgba(30,41,59,0.55);padding:8px 10px;border-radius:6px;">
                <div style="font-weight:700;color:#93c5fd;margin-bottom:4px;">Airwaves Ad Spending ($${totalAirSpend.toFixed(1)}M Total)</div>
                ${Object.keys(airSpend).length ? Object.entries(airSpend).map(([pid, amt]) => `<div>• ${safe(pid)}: <b>$${Number(amt).toFixed(1)}M</b></div>`).join('') : '<div style="color:var(--text-muted);font-style:italic;">No ad buys yet</div>'}
              </div>
              <div style="background:rgba(30,41,59,0.55);padding:8px 10px;border-radius:6px;">
                <div style="font-weight:700;color:#86efac;margin-bottom:4px;">Active Field Offices (${totalOffices} Total)</div>
                ${Object.keys(fieldOff).length ? Object.entries(fieldOff).map(([pid, cnt]) => `<div>• ${safe(pid)}: <b>${cnt} offices</b></div>`).join('') : '<div style="color:var(--text-muted);font-style:italic;">No ground offices established</div>'}
              </div>
              ${oppoShock > 0 ? `
                <div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);padding:8px 10px;border-radius:6px;">
                  <div style="font-weight:700;color:#fca5a5;margin-bottom:4px;">Opposition Dossier Drag</div>
                  <div>• Active Poll Shock: <b>-${oppoShock.toFixed(1)}%</b></div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      })()}

      ${showPins && mapPins.length ? `
        <div style="background:rgba(30,41,59,0.65);border:1px solid rgba(148,163,184,0.25);border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:11.5px;">
          <b>Rival Chair Map Pins (Month ${month}):</b>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
            ${mapPins.slice(0, 16).map((pin) => `<span class="badge" style="background:rgba(248,113,113,0.16);color:#fecaca;padding:2px 7px;border-radius:6px;">${safe(pin.stateId)}: ${safe(pin.partyName)} (${safe(pin.action)}, $${Number(pin.spend || 0).toFixed(1)}M${pin.isCounter ? ' · Counter' : ''})</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${morningWire.length ? `
        <div style="background:linear-gradient(135deg, rgba(30,41,59,0.92), rgba(15,23,42,0.96));border:1px solid rgba(239,68,68,0.4);border-left:4px solid #ef4444;border-radius:8px;padding:9px 12px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span class="badge" style="background:#ef4444;color:#ffffff;font-size:10px;font-weight:900;letter-spacing:0.08em;padding:2px 6px;border-radius:4px;">THE MORNING WIRE</span>
            <span style="font-size:11px;color:#94a3b8;font-weight:600;">CABLE &amp; CAMPAIGN TRAIL INTELLIGENCE</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            ${morningWire.map((hl) => `<div style="font-size:12px;color:#f1f5f9;line-height:1.4;">• ${safe(hl)}</div>`).join('')}
          </div>
        </div>
      ` : ''}

      ${ticker.length ? `
        <div style="background:rgba(15,23,42,0.65);border-radius:8px;padding:8px 12px;margin-bottom:10px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:#e2bd70;margin-bottom:4px;">THIS MONTH ON THE TRAIL (RIVAL CHAIR MOVES)</div>
          ${ticker.map((t) => `<div style="font-size:12px;opacity:0.9;margin-top:2px;">• ${safe(t)}</div>`).join('')}
        </div>
      ` : ''}

      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px;">
        <span style="font-size:12px;font-weight:700;">Theme of Month ${month}:</span>
        ${c.themeSelectedThisMonth
          ? `<span style="font-size:12px;color:#86efac;">Active: <b>${safe(c.activeThemeName || c.activeThemeId)}</b></span>`
          : `<select id="v0180-theme-select" style="padding:4px 8px;border-radius:6px;background:#0f172a;color:#f8fafc;border:1px solid rgba(148,163,184,0.35);">
              ${issues.map((i) => `<option value="${safe(i.id)}">${safe(i.label || i.name || i.id)}${(c.usedThemes || []).includes(i.id) ? ' (Used — Stale Penalty)' : ''}</option>`).join('')}
            </select>
            <button type="button" class="button button-secondary" data-v0180-action="select-campaign-theme">Set Theme</button>`}
      </div>

      ${debate ? `
        <div style="background:rgba(59,130,246,0.14);border:1px solid rgba(59,130,246,0.4);border-radius:8px;padding:10px;margin-bottom:10px;">
          <div style="font-weight:700;font-size:13px;">${safe(debate.title)}${debate.qualifiesThirdPartyBreakout ? ' · ★ 3rd-Party Breakout Stage!' : ''}</div>
          <div style="margin:6px 0;display:flex;flex-direction:column;gap:6px;">
            ${(debate.questions || []).map((q, qIdx) => `
              <div style="background:rgba(15,23,42,0.55);padding:6px 8px;border-radius:6px;font-size:12px;">
                <div><b>Q${qIdx + 1} (${safe(q.category)}):</b> ${safe(q.prompt || q.question || q.text || q.issueId)}</div>
                <select id="v0180-debate-q${qIdx}" style="margin-top:4px;padding:3px 6px;border-radius:5px;background:#0f172a;color:#f8fafc;border:1px solid rgba(148,163,184,0.35);font-size:11.5px;">
                  <option value="pragmatic">Pragmatic Center (Broad Appeal &amp; Trust)</option>
                  <option value="aggressive">Aggressive Counter-Punch (High Risk / High Reward)</option>
                  <option value="base">Rally the Base (Turnout Surge)</option>
                  <option value="visionary">Forward-Looking Vision (Downballot Coattails)</option>
                </select>
              </div>
            `).join('')}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
            <button type="button" class="button button-gold" data-v0180-action="resolve-campaign-debate" data-posture="pivot_swing">Pivot to Swing Issues</button>
            <button type="button" class="button button-secondary" data-v0180-action="resolve-campaign-debate" data-posture="attack_record">Attack Opponent Record</button>
            <button type="button" class="button button-secondary" data-v0180-action="resolve-campaign-debate" data-posture="protect_base">Protect the Base</button>
            <button type="button" class="button button-secondary" data-v0180-action="resolve-campaign-debate" data-posture="elevate_downballot">Elevate Downballot Ticket</button>
          </div>
        </div>
      ` : ''}

      ${ultimatum ? `
        <div style="background:rgba(239,68,68,0.14);border:1px solid rgba(239,68,68,0.45);border-radius:8px;padding:10px;margin-bottom:10px;">
          <div style="font-weight:700;font-size:13px;color:#fca5a5;">${safe(ultimatum.headline)}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
            <button type="button" class="button button-gold" data-v0180-action="resolve-trail-ultimatum" data-id="${safe(ultimatum.id)}" data-choice="meet">Meet Demand ($2M, +10 Hap)</button>
            <button type="button" class="button button-secondary" data-v0180-action="resolve-trail-ultimatum" data-id="${safe(ultimatum.id)}" data-choice="compromise">Compromise ($1M, +5 Hap)</button>
            <button type="button" class="button button-secondary" data-v0180-action="resolve-trail-ultimatum" data-id="${safe(ultimatum.id)}" data-choice="ignore">Call Bluff (-12% Turnout)</button>
          </div>
        </div>
      ` : ''}

      ${activeCrises.map((cr) => `
        <div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.4);border-radius:8px;padding:10px;margin-bottom:8px;">
          <div style="font-weight:700;font-size:13px;">[${safe(cr.trait)}] ${safe(cr.title)}</div>
          <div style="font-size:12px;margin:3px 0 6px;">${safe(cr.headline)}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${(cr.choices || []).map((ch) => {
              const chCost = Number(ch.cost || 0);
              const cantAfford = chCost > 0 && Number(game.treasury || 0) < chCost;
              return `<button type="button" class="button button-secondary" data-v0180-action="resolve-campaign-crisis" data-crisis-id="${safe(cr.id)}" data-choice-id="${safe(ch.id)}" ${cantAfford ? 'disabled' : ''}>${safe(ch.label)}${cantAfford ? ` (Need $${chCost}M)` : ''}</button>`;
            }).join('')}
          </div>
        </div>
      `).join('')}

      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        <button type="button" class="button button-secondary" data-v0180-action="campaign-microtarget-faction">Micro-Target Faction Ads ($1.5M · Regional +Persuasion &amp; Membership)</button>
        <button type="button" class="button button-secondary" data-v0180-action="campaign-town-hall-barnstorm">Town Hall Barnstorm ($0.5M · +Persuasion &amp; Turnout)</button>
        <button type="button" class="button button-secondary" data-v0180-action="campaign-coalition-unity-summit" ${c.unitySummitUsedMonth === month ? 'disabled' : ''}>Coalition Unity Summit ($0 · +5 Hap to 2 Factions)</button>
        ${isMajor ? `<button type="button" class="button button-secondary" data-v0180-action="campaign-spoiler-wedge">Spoiler Wedge Blitz ($1.5M · Siphon Rival)</button>` : ''}
        <button type="button" class="button button-secondary" data-v0180-action="campaign-viral-telethon" ${c.telethonUsedMonth === month ? 'disabled' : ''}>Viral Livestream Telethon ($0 · +$2–5M &amp; Membership)</button>
        ${month <= 3 ? `<button type="button" class="button button-secondary" data-v0180-action="commission-oppo-research">Commission Oppo Research ($1.5M)</button>` : ''}
        ${dossiers.map((d) => `<button type="button" class="button button-gold" data-v0180-action="release-oppo-dossier" data-id="${safe(d.id)}">Detonate Oppo: ${safe(d.targetName)} (${safe(d.stateId)})</button>`).join('')}
      </div>

      ${month === 5 && !c.finalBlitzCompleted ? `
        <div style="margin-top:10px;padding:8px 10px;background:rgba(226,189,112,0.1);border:1px solid rgba(226,189,112,0.35);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
          <b style="font-size:12px;">Final 72 Hours Blitz Stops:</b>
          ${[0, 1, 2].map((bIdx) => `
            <select id="v0180-blitz-${bIdx}" style="padding:3px 6px;border-radius:5px;background:#0f172a;color:#f8fafc;border:1px solid rgba(148,163,184,0.35);font-size:11.5px;">
              ${statesList.map((st) => `<option value="${safe(st.id)}" ${st.id === defaultBlitz[bIdx] ? 'selected' : ''}>${safe(st.id)}</option>`).join('')}
            </select>
          `).join('')}
          <button type="button" class="button button-gold" data-v0180-action="resolve-final-blitz">Launch Final 72 Hours Blitz</button>
        </div>
      ` : ''}

      ${surrogates.length ? `
        <div style="margin-top:10px;font-size:12px;">
          <b>Top-10 Surrogates (Min. 50 Fame):</b>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;">
            ${surrogates.slice(0, 10).map((s) => `<button type="button" class="button button-secondary" style="font-size:11px;padding:3px 8px;" data-v0180-action="deploy-surrogate" data-id="${safe(s.id || s.name)}" ${usedSur.has(s.id || s.name) ? 'disabled' : ''}>${safe(s.name)} (Fame ${s.fame})</button>`).join('')}
          </div>
        </div>
      ` : ''}

      ${tossups.length ? `
        <div style="margin-top:8px;font-size:12px;color:#fcd34d;">
          <b>Toss-Up Watch (Months 4–5):</b> ${tossups.map((t) => `${safe(t.stateId)} (${safe(t.office || 'Race')} ±${t.margin}%)`).join(' · ')}
        </div>
      ` : ''}
    </section>
  `;
}

function v0180PollingMissBannerMarkup() {
  const rep = game?.lastElection?.pollingMissReport;
  if (!rep) return '';
  const regStr = Object.entries(rep.regionalRealized || {})
    .map(([r, v]) => `${r}: ${v >= 0 ? '+' : ''}${Number(v).toFixed(1)}`)
    .join(' · ');
  return `
    <section class="panel section-panel" style="margin-bottom:12px;border:1px solid rgba(99,179,237,0.4);background:rgba(15,23,42,0.75);">
      <h3 style="margin:0 0 6px;">Final Polling Accuracy &amp; Miss Report (${rep.year})</h3>
      <div style="font-size:13px;font-weight:600;color:#93c5fd;">${safe(rep.summary)}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Regional Misses: ${safe(regStr)}</div>
      <div style="font-size:12px;margin-top:4px;">
        Dead-On State: <b>${safe(rep.deadOnState?.stateName || rep.deadOnState?.stateId || '—')}</b> (${rep.deadOnState?.error >= 0 ? '+' : ''}${Number(rep.deadOnState?.error || 0).toFixed(1)} pts) ·
        Biggest Miss: <b>${safe(rep.biggestMissState?.stateName || rep.biggestMissState?.stateId || '—')}</b> (${rep.biggestMissState?.error >= 0 ? '+' : ''}${Number(rep.biggestMissState?.error || 0).toFixed(1)} pts)
      </div>
    </section>
  `;
}

function realignmentSummaryMarkup() {
  const r = game.lastRealignment;
  if (!r || !r.parties || !r.parties.length) return '';
  return `
    <section class="panel section-panel">
      <div class="eyebrow">${formatMillions(game?.voterModel?.representedVoters || 155_000_000)} Million Represented Voters · Continuous Electorate</div>
      <h2>Inter-Cycle Electorate Realignment (Between Elections)</h2>
      <p class="section-intro">Parties that won more of the popular vote than expected gained voters, while underperforming parties lost voters (shifting by 1/4th of the difference). Voting blocks adjust between elections and remain maintained into the next cycle.</p>
      <div style="overflow-x:auto;margin-top:12px">
        <table class="table" style="width:100%;font-size:13.5px">
          <thead>
            <tr>
              <th>Party</th>
              <th>Expected Vote %<br><small style="font-weight:normal;color:var(--text-muted)">(Share of Non-Ind. Voters)</small></th>
              <th>Actual Vote %<br><small style="font-weight:normal;color:var(--text-muted)">(Popular Vote)</small></th>
              <th>Performance<br><small style="font-weight:normal;color:var(--text-muted)">(Difference)</small></th>
              <th>Electorate Shift<br><small style="font-weight:normal;color:var(--text-muted)">(1/4th Diff)</small></th>
              <th>Voters Gained / Lost</th>
              <th>New Maintained Base</th>
            </tr>
          </thead>
          <tbody>
            ${r.parties.map((p) => {
              const diffSign = p.diff >= 0 ? '+' : '';
              const shiftSign = p.shareDeltaOfAllVoters >= 0 ? '+' : '';
              const voterSign = p.voterChange >= 0 ? '+' : '';
              const color = p.diff >= 0 ? '#55bf78' : '#e8887e';
              return `
                <tr>
                  <td><b style="color:${p.color}">${safe(p.name)}</b></td>
                  <td><b>${p.expectedShare.toFixed(1)}%</b></td>
                  <td><b>${p.actualShare.toFixed(1)}%</b></td>
                  <td><b style="color:${color}">${diffSign}${p.diff.toFixed(1)} pts</b></td>
                  <td><b style="color:${color}">${shiftSign}${p.shareDeltaOfAllVoters.toFixed(2)}% of all voters</b></td>
                  <td><b style="color:${color}">${voterSign}${formatMillions(p.voterChange)}M</b></td>
                  <td><b>${formatMillions(p.newVoters)}M</b> <small style="color:var(--text-muted)">(${p.newBaseShare.toFixed(1)}%)</small></td>
                </tr>
              `;
            }).join('')}
            <tr style="border-top:1px solid var(--line);background:rgba(255,255,255,0.02)">
              <td><b style="color:#a9b4bf">Independent Voters</b></td>
              <td colspan="4" style="color:var(--text-muted)"><small>Targeted ideological transfers preserve non-partisan independent balance</small></td>
              <td><b style="color:${(r.independentChange || 0) >= 0 ? '#55bf78' : '#e8887e'}">${(r.independentChange || 0) >= 0 ? '+' : ''}${formatMillions(r.independentChange || 0)}M</b></td>
              <td><b>${formatMillions(r.newIndependentVoters || 48_000_000)}M</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function autopsyModalMarkup() {
  const election = game.lastElection;
  const autopsy = election?.autopsyReport;
  if (!autopsy) return '';

  const playerWon = autopsy.playerWon;
  const isDispositionChosen = Boolean(game.autopsyDisposition);

  return `
    <div class="v07-autopsy-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="autopsy-modal-title">
      <div class="v07-autopsy-modal-content">
        <div class="autopsy-modal-header">
          <div>
            <div class="eyebrow" style="color:var(--gold)">National Committee Strategic Inquest · Cycle ${autopsy.year}</div>
            <h2 id="autopsy-modal-title" class="autopsy-serif-title">Official Post-Election Committee Inquest</h2>
            <div class="autopsy-subtitle">
              <span>Outcome: <b style="color:${playerWon ? '#55bf78' : '#e8887e'}">${playerWon ? 'Victory & Coalition Majority' : 'Defeat & Governing Minority'}</b></span>
              <span>Represented Shift: <b class="autopsy-mono-stat">${autopsy.netMillionsFormatted} Represented Voters</b></span>
            </div>
          </div>
          <button type="button" class="autopsy-close-btn" id="btn-close-autopsy" title="Close Inquest (Esc)">✕</button>
        </div>

        <div class="autopsy-modal-scroll">
          ${election?.recounts?.length ? `
          <div class="autopsy-section" style="border-left:4px solid #f59e0b;padding-left:14px;background:#17223066;border-radius:6px;padding-top:8px;padding-bottom:8px">
            <h3 class="autopsy-section-title" style="color:#fbbf24">Statutory Close-Margin Recounts</h3>
            <p style="font-size:13px;color:#d1d5db;margin:4px 0 8px">Under state election statutes, races decided by within statutory recount margins (≤ 0.50%) triggered mandatory automatic recounts before final certification.</p>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${election.recounts.map((r) => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:#111923;border-radius:6px;font-size:13px">
                  <span><b>${r.stateId} (${r.ev} EV)</b>: Initial margin ${r.initialMargin > 0 ? '+' : ''}${r.initialMargin.toFixed(2)}% → Recount adjustment ${r.recountAdjustment > 0 ? '+' : ''}${r.recountAdjustment.toFixed(3)}% (${r.finalMargin > 0 ? '+' : ''}${r.finalMargin.toFixed(2)}%)</span>
                  <span style="font-weight:bold;color:${r.flipped ? '#f87171' : '#34d399'}">${r.flipped ? `FLIPPED to ${r.newWinner === 'people' ? 'Democratic' : r.newWinner === 'heritage' ? 'Republican' : r.newWinner}` : 'Margin Upheld ✓'}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- SECTION 1: 3-PARAGRAPH COALITION MOVEMENT DOSSIER -->
          <div class="autopsy-section">
            <h3 class="autopsy-section-title">The State of the Coalition: Strategic Movement Dossier</h3>
            <div class="autopsy-kpi-row">
              <div class="autopsy-kpi-card">
                <small>College-Educated & Suburban</small>
                <b class="autopsy-mono-stat" style="color:${autopsy.blocDeltas.college >= 0 ? '#55bf78' : '#e8887e'}">${autopsy.blocDeltas.college >= 0 ? '+' : ''}${(autopsy.blocDeltas.college / 1_000_000).toFixed(2)}M</b>
                <span>155M Scale CVAP</span>
              </div>
              <div class="autopsy-kpi-card">
                <small>Industrial & Working-Class</small>
                <b class="autopsy-mono-stat" style="color:${autopsy.blocDeltas.workingClass >= 0 ? '#55bf78' : '#e8887e'}">${autopsy.blocDeltas.workingClass >= 0 ? '+' : ''}${(autopsy.blocDeltas.workingClass / 1_000_000).toFixed(2)}M</b>
                <span>Manufacturing corridors</span>
              </div>
              <div class="autopsy-kpi-card">
                <small>Racial & Cultural Cohorts</small>
                <b class="autopsy-mono-stat" style="color:${autopsy.blocDeltas.racial >= 0 ? '#55bf78' : '#e8887e'}">${autopsy.blocDeltas.racial >= 0 ? '+' : ''}${(autopsy.blocDeltas.racial / 1_000_000).toFixed(2)}M</b>
                <span>Metro & rural minority base</span>
              </div>
              <div class="autopsy-kpi-card">
                <small>Independent Defectors</small>
                <b class="autopsy-mono-stat" style="color:${autopsy.blocDeltas.independent >= 0 ? '#55bf78' : '#e8887e'}">${autopsy.blocDeltas.independent >= 0 ? '+' : ''}${(autopsy.blocDeltas.independent / 1_000_000).toFixed(2)}M</b>
                <span>Protest & minor defection</span>
              </div>
            </div>

            <div class="autopsy-dossier-prose">
              ${autopsy.dossierParagraphs.map((p) => `<p>${safe(p)}</p>`).join('')}
            </div>
          </div>

          <!-- SECTION 2: REGIONAL FAULTLINES -->
          <div class="autopsy-section">
            <h3 class="autopsy-section-title">Regional Alignment & Faultline Shifts</h3>
            <div class="autopsy-faultlines-grid">
              <div class="faultline-card solidified">
                <div class="faultline-header">
                  <span class="faultline-icon">🛡️</span>
                  <b>Solidified Strongholds</b>
                </div>
                <p>States shifting deeper into the party column (≥2.5 pt shift):</p>
                <ul class="faultline-list">
                  ${autopsy.regionalFaultlines.solidified.map((st) => `<li><b>${safe(st.name)} (${st.stateId})</b> <span>+${Math.abs(st.margin).toFixed(1)} margin</span></li>`).join('')}
                </ul>
              </div>

              <div class="faultline-card battlegrounds">
                <div class="faultline-header">
                  <span class="faultline-icon">⚡</span>
                  <b>Emerging Battlegrounds</b>
                </div>
                <p>Formerly safe or uncompetitive states now within 5.0 pts:</p>
                <ul class="faultline-list">
                  ${autopsy.regionalFaultlines.battlegrounds.map((st) => `<li><b>${safe(st.name)} (${st.stateId})</b> <span>${st.margin >= 0 ? '+' : ''}${st.margin.toFixed(1)} margin</span></li>`).join('')}
                </ul>
              </div>

              <div class="faultline-card lost">
                <div class="faultline-header">
                  <span class="faultline-icon">⚠️</span>
                  <b>Lost Bastions & Redoubts</b>
                </div>
                <p>Historical battlegrounds that slipped into the rival column:</p>
                <ul class="faultline-list">
                  ${autopsy.regionalFaultlines.lost.map((st) => `<li><b>${safe(st.name)} (${st.stateId})</b> <span>${st.margin.toFixed(1)} margin</span></li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <!-- SECTION 3: FACTION POST-MORTEM & BLAME GAME -->
          <div class="autopsy-section">
            <h3 class="autopsy-section-title">The Caucus Inquest & Faction Blame Game</h3>
            <p class="autopsy-subtitle-quiet">Party ideological factions clash over responsibility for election results and national platform posture:</p>
            <div class="autopsy-blame-grid">
              ${autopsy.blameGame.map((b) => `
                <div class="autopsy-quote-card ${b.alignment}">
                  <div class="quote-header">
                    <span class="v15-politician-faction-badge">${safe(b.factionName || b.faction || b.wing || 'Faction')}</span>
                    <b>${safe(b.speaker)}</b>
                  </div>
                  <blockquote class="quote-body">${safe(b.quote)}</blockquote>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SECTION 4: STRATEGIC CHAIR DISPOSITIONS -->
          <div class="autopsy-section autopsy-disposition-section">
            <h3 class="autopsy-section-title">Executive Autopsy Disposition</h3>
            <p class="autopsy-subtitle-quiet">The National Chair must establish the official committee posture before advancing into the next cycle:</p>

            <div class="disposition-cards-grid">
              <div class="disposition-card ${game.autopsyDisposition === 'endorse' ? 'selected' : ''}">
                <div class="disp-title">1. Endorse Reform Recommendations</div>
                <div class="disp-subtitle">Empower the Ascendant Movement Wing</div>
                <div class="disp-bullets">
                  <span class="pro">✓ Ascendant Wing: +8.0 Confidence</span>
                  <span class="pro">✓ Base Morale: +4.0 Supporter Trust</span>
                  <span class="con">✕ Establishment: -7.0 Confidence</span>
                  <span class="con">✕ Sitting Member Happiness: -5.0</span>
                </div>
                <button type="button" class="button button-gold" data-autopsy-action="endorse" ${isDispositionChosen ? 'disabled' : ''}>
                  ${game.autopsyDisposition === 'endorse' ? '✓ Adopted Official Stance' : 'Adopt Recommendations'}
                </button>
              </div>

              <div class="disposition-card ${game.autopsyDisposition === 'shelve' ? 'selected' : ''}">
                <div class="disp-title">2. Shelve Report & Reaffirm Unity</div>
                <div class="disp-subtitle">Protect Institutional Establishment</div>
                <div class="disp-bullets">
                  <span class="pro">✓ Sitting Member Happiness: +4.0</span>
                  <span class="pro">✓ Donor Treasury: +$5M next cycle</span>
                  <span class="con">✕ Movement Activists: -5.0 Confidence</span>
                  <span class="con">✕ Grassroots volunteer energy dampens</span>
                </div>
                <button type="button" class="button button-gold" data-autopsy-action="shelve" ${isDispositionChosen ? 'disabled' : ''}>
                  ${game.autopsyDisposition === 'shelve' ? '✓ Adopted Official Stance' : 'Shelve Inquest Report'}
                </button>
              </div>

              <div class="disposition-card ${game.autopsyDisposition === 'regional-review' ? 'selected' : ''}">
                <div class="disp-title">3. Order Decentralization Review</div>
                <div class="disp-subtitle">Defer Autopsy Decisions to the States</div>
                <div class="disp-bullets">
                  <span class="pro">✓ State Party Trust & Autonomy boost</span>
                  <span class="pro">✓ Defuses national faction rebellion</span>
                  <span class="con">✕ Administrative Cost: -$3M Treasury</span>
                  <span class="con">✕ National messaging clarity weakens</span>
                </div>
                <button type="button" class="button button-gold" data-autopsy-action="regional-review" ${isDispositionChosen ? 'disabled' : ''}>
                  ${game.autopsyDisposition === 'regional-review' ? '✓ Adopted Official Stance' : 'Order Regional Review'}
                </button>
              </div>
            </div>
            ${isDispositionChosen ? `
              <div class="disp-confirmed-notice">
                <span>Official Inquest Disposition Recorded: <b>${safe(game.lastNote || '')}</b></span>
                <button type="button" class="button button-small" id="btn-reopen-autopsy-close">Dismiss Inquest Window</button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function actionsTabMarkup() {
  if (game.phase === 'complete') {
    return `
      ${/* [v0.18.4 MAPS-BALLOT] */ (game.redistrictingWarRoom?.active && window.RedistrictingBallotSystem?.renderRedistrictingWarRoomModal) ? window.RedistrictingBallotSystem.renderRedistrictingWarRoomModal(game) : ''}
      ${game.activeAutopsyModal ? autopsyModalMarkup() : ''}
      ${electionMarkup()}
      ${realignmentSummaryMarkup()}
      <section class="panel section-panel">
        <div class="eyebrow">Cycle Complete · Continuous Politics</div>
        <h2>${game?.year || 2028} General Election Resolved</h2>
        <p class="section-intro">Inspect final maps in the <b>Map</b> tab, state results in <b>States</b>, or Electoral College & Forecaster history in <b>Forecast</b>.</p>
        <div class="inline-controls" style="margin-top:14px">
          <button type="button" class="button button-gold" id="btn-view-autopsy-report">View Post-Election Autopsy Report →</button>
          <button type="button" class="button button-gold" id="start-next-cycle">Start Next Cycle (${(game.year || 2028) + 2}) →</button>
          <button type="button" class="button button-gold" data-main-tab="map">Inspect Final Maps →</button>
          <button type="button" class="button" data-main-tab="forecast">Review Election Forecast →</button>
        </div>
      </section>`;
  }

  if (game.campaign?.active) {
    return campaignDashboardMarkup();
  }

  const step = currentStep();
  const stepDefs = [
    { step: 1, id: 'issues', label: 'Unified Platform Issues' },
    { step: 2, id: 'priorities', label: 'Major Priorities & Focus' },
    { step: 3, id: 'endorsements', label: 'Primary Endorsements' },
    { step: 4, id: 'state-leg', label: 'State Legislative Slates' },
    { step: 5, id: 'work', label: 'Recruitment Actions Pool' },
  ];
  const { canConfirm, confirmLabel } = getTurnStepButtonState();

  let bodyMarkup = '';
  if (step === 1) bodyMarkup = step1IssuesMarkup();
  else if (step === 2) bodyMarkup = step2PrioritiesMarkup();
  else if (step === 3) bodyMarkup = step3PrimariesMarkup();
  else if (step === 4) bodyMarkup = step4StateLegMarkup();
  else bodyMarkup = step4WorkMarkup();

  return `
    <div class="v07-step-wizard">
      <nav class="v07-step-bar" aria-label="Turn workflow steps">
        ${stepDefs.map((s) => `<button type="button" class="v07-step-pill ${step === s.step ? 'active' : step > s.step ? 'completed' : ''}" data-turn-step="${s.step}">
          <small>Step ${s.step} of 5</small>
          <b>${safe(s.label)}</b>
        </button>`).join('')}
      </nav>
      ${bodyMarkup}
      <div class="v07-step-nav panel">
        <button type="button" class="button" id="step-back" ${step <= 1 ? 'disabled' : ''}>← Back</button>
        <span class="v07-turn-note">${safe(game.lastNote || 'Advance through Steps 1–5, then Confirm Turn.')}</span>
        ${step < 5
          ? `<button type="button" class="button button-gold" id="step-next">Next Step (Step ${step + 1} of 5) →</button>`
          : `<button type="button" class="button button-gold" id="advance-year" ${canConfirm ? '' : 'disabled'}>${confirmLabel} →</button>`}
        ${window.AtlasMultiplayerSystem ? window.AtlasMultiplayerSystem.renderHotseatTurnButton(game) : ''}
      </div>
    </div>`;
}

/* ==========================================================================
   TAB 2: MAP — FULLSCREEN NATIONAL MAP & SENATE CLASS I/II/III FIX (BUG-01)
   ========================================================================== */
function decodePath(encoded) {
  let x = 0, y = 0, position = 0;
  const number = () => { let result = 0, shift = 0, chunk; do { chunk = encoded.charCodeAt(position++) - 63; result |= (chunk & 0x1f) << shift; shift += 5; } while (chunk >= 0x20); return result & 1 ? ~(result >> 1) : result >> 1; };
  const coordinates = [];
  while (position < encoded.length) { x += number(); y += number(); coordinates.push([x / 10, y / 10]); }
  if (!coordinates.length) return '';
  return `M${coordinates.map(([px, py]) => `${px},${py}`).join('L')}Z`;
}
const svgPath = (row, cls, title) => `<path class="${cls}" d="${row.q.split('!').map(decodePath).join('')}" data-map-state="${row.stateId || row.id}" tabindex="0"><title>${safe(title)}</title></path>`;
const partyClass = (party) => party === 'people' ? 'party-dem' : party === 'heritage' ? 'party-rep' : party === 'split' ? 'party-split' : party === 'ind-dem' ? 'party-ind-dem' : ['ind-rep', 'independent', 'other', 'liberty', 'green'].includes(party) ? 'party-other' : 'party-pending';

function nationalMapSvg(mode, options = {}) {
  const isPres = mode === 'presidential';
  const stateRows = isPres ? MAPS.states : MAPS.states.filter((state) => state.id !== 'DC');
  const activeHouseMap = (game?.currentHouseMap?.districts?.length ? game.currentHouseMap : (game?.activeHouseMapKey && game[game.activeHouseMapKey]?.districts?.length ? game[game.activeHouseMapKey] : null));
  const sittingHouse = (game.sittingMembers || []).filter((m) => m.office === 'house');
  const liveHouseMap = new Map(sittingHouse.map((m) => [m.districtId || m.district, m.party || m.caucus]));
  const houseById = new Map();
  if (game.representatives?.length) {
    game.representatives.forEach((rep) => {
      const liveParty = liveHouseMap.get(rep.districtId) || (rep.partyId === game.player.id ? playerIdentity() : rep.partyId);
      houseById.set(rep.districtId, {
        id: rep.districtId,
        party: liveParty,
        label: `${rep.name} (${liveParty})`,
      });
    });
  } else {
    MAPS.houseResults.forEach((row) => {
      const liveParty = liveHouseMap.get(row.id);
      houseById.set(row.id, liveParty ? { ...row, party: liveParty } : row);
    });
  }
  const voterDistricts = new Map(VOTER_MODEL.districts.map((row) => [`${row.stateId}-${Number(row.district)}`, row]));
  const voterStates = new Map((game?.voterModel?.states || VOTER_MODEL.states).map((row) => [row.stateId, row]));
  const resolveDistrictVoters = (stateId, districtNo) => {
    const direct = voterDistricts.get(`${stateId}-${districtNo}`);
    if (direct) return direct;
    const stVoters = voterStates.get(stateId);
    if (!stVoters) return null;
    const stSeats = game?.states?.find((s) => s.id === stateId)?.districtCount || activeHouseMap?.seats?.[stateId] || 1;
    const repCount = Math.round((stVoters.representedVoters || 1000000) / Math.max(1, stSeats));
    const aff = stVoters.affiliations || {};
    return {
      representedVoters: repCount,
      affiliations: {
        people: Math.round((aff.people || 0) / Math.max(1, stSeats)),
        heritage: Math.round((aff.heritage || 0) / Math.max(1, stSeats)),
        independent: Math.round((aff.independent || 0) / Math.max(1, stSeats)),
        liberty: Math.round((aff.liberty || 0) / Math.max(1, stSeats)),
        green: Math.round((aff.green || 0) / Math.max(1, stSeats)),
        constitution: Math.round((aff.constitution || 0) / Math.max(1, stSeats)),
        socialist: Math.round((aff.socialist || 0) / Math.max(1, stSeats)),
        other: Math.round((aff.other || 0) / Math.max(1, stSeats)),
      },
    };
  };

  const chamber = computeSenateChamberBreakdown();
  const activeSenateClsNum = game?.activeSenateClass || 3;
  const targetSenateClassNum = options.chamberClass
    ? effectiveSenateClassNum(options.chamberClass)
    : (mode === 'senate-class' ? activeSenateClsNum : effectiveSenateClassNum(senateMapClass));
  const isUniversalSenate = mode === 'senate-combined' || (mode === 'senate' && targetSenateClassNum === 'universal');
  const senateByState = new Map(
    chamber.seats
      .filter((row) => isUniversalSenate || Number(row.classNum) === targetSenateClassNum)
      .map((row) => [row.stateId, row])
  );
  const senatePairByState = new Map();
  chamber.seats.forEach((row) => {
    const arr = senatePairByState.get(row.stateId) || [];
    arr.push(row);
    senatePairByState.set(row.stateId, arr);
  });

  const presForecast = (window.PartyChairEngine.presidentialForecast && game) ? window.PartyChairEngine.presidentialForecast(game) : null;
  const districts = mode === 'house' ? (activeHouseMap?.districts || MAPS.districts) : [];
  const houseCounts = { people: 0, heritage: 0, other: 0, pending: 0 };
  districts.forEach((district) => {
    const result = houseById.get(district.id);
    const key = !result || result.pending ? 'pending' : result.party || 'pending';
    houseCounts[key] = (houseCounts[key] || 0) + 1;
  });

  let svgDefs = '';
  if (isUniversalSenate) {
    const swatchPalette = {
      people: '#3478c8',
      heritage: '#c9474e',
      'ind-dem': '#1abc9c',
      'ind-rep': '#d48270',
      other: '#c3924d',
    };
    const keys = Object.keys(swatchPalette);
    const patterns = [];
    for (const k1 of keys) {
      for (const k2 of keys) {
        if (k1 === k2) continue;
        patterns.push(`<pattern id="split-${k1}-${k2}" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)"><rect x="0" y="0" width="6" height="12" fill="${swatchPalette[k1]}"></rect><rect x="6" y="0" width="6" height="12" fill="${swatchPalette[k2]}"></rect></pattern>`);
      }
    }
    svgDefs = `<defs>${patterns.join('')}</defs>`;
  }

  let geometry = '';
  const isComplete = game.phase === 'complete';
  const isPresYear = (game?.year || 2028) % 4 === 0;
  const isForecasterMode = options.forecaster !== undefined
    ? Boolean(options.forecaster)
    : false;
  const isPollingMode = isForecasterMode && forecasterMapSource === 'polling';
  const forecasterOutlets = game.forecasters?.outlets || {
    cooked: 'The Cooked Political Report',
    sallow: "Sallow's Crystal Ball",
    inside: 'Upside Elections',
  };
  const activeOutletData = forecasterMapSource === 'consensus'
    ? (game.forecasters?.consensus || {})
    : (game.forecasters?.[forecasterMapSource] || {});
  const activeOutletName = isPollingMode
    ? 'Polling Average'
    : forecasterMapSource === 'consensus'
      ? 'Consensus Forecast'
      : (forecasterOutlets[forecasterMapSource] || forecasterMapSource);

  if (mode === 'house') {
    if (isForecasterMode) {
      const customDistList = activeHouseMap?.modelDistricts || activeHouseMap?.districts;
      const distMetaMap = new Map((customDistList || window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS || []).map((d) => [d.id, d]));
      geometry = districts.map((district) => {
        const districtNo = Number(String(district.id).split('-').at(-1));
        const stateId = String(district.id).split('-')[0];
        const voters = resolveDistrictVoters(stateId, districtNo);
        if (isPollingMode) {
          const stObj = STATES.find((s) => s.id === stateId);
          const dMeta = distMetaMap.get(district.id) || distMetaMap.get(district.id.replace(/-0(\d)$/, '-$1'));
          const bd = getStatePollingBreakdown(stObj, dMeta, `house:${district.id}`);
          const fillColor = pollingMarginColor(bd.leader.canonicalId, bd.margin, bd.leader.color);
          const title = `${district.id} — ${bd.summaryText}${voters ? ` · ${formatMillions(voters.representedVoters)}M modeled voters` : ''}`;
          return `<path style="fill:${fillColor}" class="map-district" d="${district.q.split('!').map(decodePath).join('')}" data-map-state="${district.stateId || district.id}" tabindex="0"><title>${safe(title)}</title></path>`;
        }
        const k = `house:${district.id}`;
        const kAlt = `house:${district.id.replace(/-(\d)$/, '-0$1')}`;
        const r = activeOutletData[k] || activeOutletData[kAlt] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
        const fillColor = ratingColor(r);
        const title = `${district.id} District · Rating: ${formatRating(r)} [${activeOutletName}]${voters ? ` · ${formatMillions(voters.representedVoters)}M modeled voters` : ''}`;
        return `<path style="fill:${fillColor}" class="map-district" d="${district.q.split('!').map(decodePath).join('')}" data-map-state="${district.stateId || district.id}" tabindex="0"><title>${safe(title)}</title></path>`;
      }).join('');
      geometry += stateRows.map((state) => svgPath(state, 'map-state-outline', state.id)).join('');
    } else {
      geometry = districts.map((district) => {
        const result = houseById.get(district.id);
        const cls = partyClass(result?.party);
        const districtNo = Number(String(district.id).split('-').at(-1));
        const stateId = String(district.id).split('-')[0];
        const voters = resolveDistrictVoters(stateId, districtNo);
        const presMargin = window.PartyChairEngine.presidentialStateMargin ? window.PartyChairEngine.presidentialStateMargin(game, stateId) : 0;
        const coattail = presMargin * 0.34;
        const coattailNote = isComplete
          ? ` · Pres. coattail: ${coattail >= 0 ? 'D+' : 'R+'}${Math.abs(coattail).toFixed(1)}%`
          : ` · Pres. coattail: ${coattail >= 2 ? 'Strong Dem' : coattail >= 0.5 ? 'Lean Dem' : coattail > -0.5 ? 'Neutral' : coattail > -2 ? 'Lean Rep' : 'Strong Rep'}`;
        const mix = voters ? ` · D ${formatMillions(voters.affiliations.people)}M · R ${formatMillions(voters.affiliations.heritage)}M · I ${formatMillions(voters.affiliations.independent)}M · third party ${formatMillions(((voters.affiliations.liberty || 0) + (voters.affiliations.green || 0) + (voters.affiliations.constitution || 0) + (voters.affiliations.socialist || 0) + (voters.affiliations.other || 0)))}M` : '';
        return svgPath(district, `map-district ${cls} ${result?.pending ? 'uncalled' : ''}`, `${district.id}: ${result?.label || 'Result pending'}${result?.pending ? ' (uncalled)' : ''}${voters ? ` · ${formatMillions(voters.representedVoters)}M modeled voters` : ''}${coattailNote}${mix}`);
      }).join('');
      geometry += stateRows.map((state) => svgPath(state, 'map-state-outline', state.id)).join('');
    }
  } else if (mode === 'presidential') {
    if (isForecasterMode) {
      if (isPresYear) {
        geometry = stateRows.map((state) => {
          const stateVoters = voterStates.get(state.id);
          if (isPollingMode) {
            const bd = getStatePollingBreakdown(state);
            const fillColor = pollingMarginColor(bd.leader.canonicalId, bd.margin, bd.leader.color);
            const title = `${state.id} — ${bd.summaryText} · ${state.ev || 3} EV · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
            return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
          }
          const k = `presidential:${state.id}`;
          const r = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
          const fillColor = ratingColor(r);
          const title = `${state.name || state.id} (${state.id}) · ${state.ev || 3} EV · Rating: ${formatRating(r)} [${activeOutletName}] · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
          return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
        }).join('');
        const dcGeo = MAPS.states.find((s) => s.id === 'DC');
        if (dcGeo) {
          const dcR = activeOutletData['presidential:DC'] || 'Solid Dem';
          const dcFill = isPollingMode ? '#1d4ed8' : ratingColor(dcR);
          const dcTitle = isPollingMode ? 'DC — Dem: 90.0% · Rep: 7.5% · 3 EV' : `DC · 3 EV · Rating: ${formatRating(dcR)} [${activeOutletName}]`;
          geometry += `<circle cx="${dcGeo.cx}" cy="${dcGeo.cy}" r="4.5" style="fill:${dcFill}" class="map-dc-callout" tabindex="0"><title>${safe(dcTitle)}</title></circle>`;
        }
      } else {
        geometry = stateRows.map((state) => {
          const title = `${state.name || state.id} (${state.id}) · No Presidential Election in ${game.year || 2030} (Midterm Cycle)`;
          return `<path style="fill:#334155" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
        }).join('');
      }
    } else {
      // REQ-163: Recent Presidential Election Map (2024 certified baseline: Trump 312 Red, Harris 226 Blue; or certified in-game results)
      const harris2024States = new Set(['CA', 'CO', 'CT', 'DE', 'DC', 'HI', 'IL', 'MD', 'MA', 'MN', 'NH', 'NJ', 'NM', 'NY', 'OR', 'RI', 'VT', 'VA', 'WA', 'ME']);
      const inGameOutcome = (game.lastElection?.year && (game.lastElection?.presidentialResults || game.lastElection?.presidential))
        ? game.lastElection
        : (isComplete && game.presidentialForecast ? { presidentialResults: game.presidentialForecast.byState, year: game.year } : null);

      geometry = stateRows.map((state) => {
        let party, winnerName, leadText;
        if (inGameOutcome?.presidentialResults?.[state.id]) {
          const res = inGameOutcome.presidentialResults[state.id];
          party = typeof res === 'string' ? res : (res?.winner || 'pending');
          winnerName = party === 'people' ? (game.presidentialTicket?.people || 'Democratic') : (game.presidentialTicket?.heritage || 'Republican');
          leadText = `Certified ${inGameOutcome.year || game.year}: ${winnerName} (${party === 'people' ? 'D' : 'R'})`;
        } else {
          party = harris2024States.has(state.id) ? 'people' : 'heritage';
          winnerName = party === 'people' ? 'Kamala Harris' : 'Donald Trump';
          leadText = `Certified 2024 Baseline: ${winnerName} (${party === 'people' ? 'Dem' : 'GOP'})`;
        }
        const stateVoters = voterStates.get(state.id);
        const title = `${state.name || state.id} (${state.id}) · ${state.ev || 3} EV · ${leadText} · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
        return svgPath(state, `map-state-shape ${partyClass(party)}`, title);
      }).join('');

      const dcGeo = MAPS.states.find((s) => s.id === 'DC');
      if (dcGeo) {
        const dcParty = inGameOutcome?.presidentialResults?.['DC'] ? (typeof inGameOutcome.presidentialResults['DC'] === 'string' ? inGameOutcome.presidentialResults['DC'] : inGameOutcome.presidentialResults['DC'].winner) : 'people';
        const dcName = dcParty === 'people' ? (inGameOutcome ? game.presidentialTicket?.people || 'Democratic' : 'Kamala Harris') : (inGameOutcome ? game.presidentialTicket?.heritage || 'Republican' : 'Donald Trump');
        const dcTitle = `DC · 3 EV · ${inGameOutcome ? `Certified ${inGameOutcome.year || game.year}` : 'Certified 2024'}: ${dcName} (${dcParty === 'people' ? 'Dem' : 'GOP'})`;
        geometry += `<circle cx="${dcGeo.cx}" cy="${dcGeo.cy}" r="4.5" class="map-dc-callout ${partyClass(dcParty)}" tabindex="0"><title>${safe(dcTitle)}</title></circle>`;
      }
    }
  } else if (mode === 'lean-gradient') {
    geometry = stateRows.map((state) => {
      const fullState = STATES.find((s) => s.id === state.id) || state;
      const baseLean = fullState.leanPercent !== undefined
        ? fullState.leanPercent
        : (fullState.lean !== undefined ? -fullState.lean * 100 : 0);
      const fillColor = baseLean >= 12.0 ? '#1d5fb4'
        : baseLean >= 5.0 ? '#2c70c6'
        : baseLean >= 2.0 ? '#5c94dc'
        : baseLean > -2.0 ? '#7c6fa5'
        : baseLean > -5.0 ? '#d4656c'
        : baseLean > -12.0 ? '#bf3b42'
        : '#9a1d24';
      const qualitativeLean = baseLean >= 12.0 ? 'Safe Democratic'
        : baseLean >= 5.0 ? 'Likely Democratic'
        : baseLean >= 2.0 ? 'Lean Democratic'
        : baseLean > -2.0 ? 'Competitive Toss-Up'
        : baseLean > -5.0 ? 'Lean Republican'
        : baseLean > -12.0 ? 'Likely Republican'
        : 'Safe Republican';
      const leanFormatted = Math.abs(baseLean) < 0.05 ? 'EVEN' : `${baseLean > 0 ? 'D+' : 'R+'}${Math.abs(baseLean).toFixed(1)}%`;
      const stateVoters = voterStates.get(state.id);
      const title = `${state.name || state.id} (${state.id}) · Absolute Partisan Lean: ${leanFormatted} (${qualitativeLean}) · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
      return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
    }).join('');
  } else if (mode === 'trifectas') {
    geometry = stateRows.map((state) => {
      const [lower, upper] = game.stateLegislatures?.[state.id] || MAPS.legislatures[state.id] || [];
      const gov = game.governorships?.[state.id] || MAPS.governors[state.id];
      let cls = 'party-mixed-control';
      let label = 'Mixed Control';
      if (state.id === 'NE' || lower === 'nonpartisan' || upper === 'nonpartisan') {
        cls = 'party-nonpartisan';
        label = 'Nebraska (NE) · Nonpartisan Unicameral Legislature';
      } else if (lower === 'people' && upper === 'people' && gov === 'people') {
        cls = 'party-dem-trifecta';
        label = 'Democrat Trifecta (Gov + Both Chambers)';
      } else if (lower === 'heritage' && upper === 'heritage' && gov === 'heritage') {
        cls = 'party-rep-trifecta';
        label = 'Republican Trifecta (Gov + Both Chambers)';
      } else {
        cls = 'party-mixed-control';
        label = 'Mixed Control (Divided Government)';
      }
      const stateVoters = voterStates.get(state.id);
      const title = `${state.name || state.id} (${state.id}) · ${label} · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
      return svgPath(state, `map-state-shape ${cls}`, title);
    }).join('');
  } else if (mode === 'senate-combined' || isUniversalSenate) {
    if (isForecasterMode) {
      geometry = stateRows.map((state) => {
        const k = `senate:${state.id}`;
        const r = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
        const fillColor = ratingColor(r);
        const stateVoters = voterStates.get(state.id);
        const title = `${state.name || state.id} (${state.id}) · Universal Senate Projection · Rating: ${r} [${activeOutletName}] · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
        return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
      }).join('');
    } else {
      // REQ-163: Combined 50-State Senate Map: Blue (Both Dem), Red (Both GOP), Purple (Split: 1 Dem + 1 GOP)
      geometry = stateRows.map((state) => {
        const pair = (senatePairByState.get(state.id) || []).slice().sort((a, b) => a.classNum - b.classNum);
        const stateVoters = voterStates.get(state.id);
        const s1 = pair[0];
        const s2 = pair[1] || pair[0];
        const isDem = (s) => s && (s.caucus === 'people' || s.party === 'people');
        const isGop = (s) => s && (s.caucus === 'heritage' || s.party === 'heritage');

        let fillColor, statusLabel;
        if (isDem(s1) && isDem(s2)) {
          fillColor = '#3478c8'; // Blue
          statusLabel = 'Democratic Delegation (Both Dem)';
        } else if (isGop(s1) && isGop(s2)) {
          fillColor = '#c9474e'; // Red
          statusLabel = 'Republican Delegation (Both GOP)';
        } else {
          fillColor = '#8654a4'; // Purple
          statusLabel = 'Split Delegation (1 Dem + 1 GOP)';
        }
        const delegationText = pair.map((s) => `Class ${V07 ? V07.normalizeSenateClassRoman(s.classNum) : s.classNum}: ${s.incumbent || s.label} [${s.affiliationLabel}]`).join(' · ');
        const title = `${state.name || state.id} (${state.id}) · ${statusLabel} · ${delegationText} · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
        return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
      }).join('');
    }
  } else {
    geometry = stateRows.map((state) => {
      let party, title;
      if (mode === 'governors') {
        const activeGovs = game?.activeGubernatorialStates || (window.PartyChairData?.VERSION_01_GUBERNATORIAL_ELECTIONS) || ['NH', 'NC', 'IN', 'WA', 'UT', 'DE', 'MO', 'MT', 'ND', 'VT', 'WV'];
        const stateVoters = voterStates.get(state.id);
        if (isForecasterMode) {
          if (!activeGovs.includes(state.id)) {
            const noGovTitle = `${state.name || state.id} · No Gubernatorial election contested this cycle`;
            return `<path style="fill:#334155" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(noGovTitle)}</title></path>`;
          }
          if (isPollingMode) {
            const bd = getStatePollingBreakdown(state, null, `governor:${state.id}`);
            const fillColor = pollingMarginColor(bd.leader.canonicalId, bd.margin, bd.leader.color);
            const govTitle = `${state.name || state.id} Gubernatorial — ${bd.summaryText} · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
            return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(govTitle)}</title></path>`;
          }
          const k = `governor:${state.id}`;
          const r = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
          const fillColor = ratingColor(r);
          const govTitle = `${state.name || state.id} Gubernatorial · Rating: ${formatRating(r)} [${activeOutletName}] · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
          return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(govTitle)}</title></path>`;
        }
        party = game.governorships?.[state.id] || MAPS.governors[state.id];
        title = `${state.id}: ${party === 'people' ? 'Democratic' : party === 'heritage' ? 'Republican' : 'Unknown'} governor${MAPS.pendingGovernors.includes(state.id) ? ' (race pending)' : ''}`;
      } else if (mode === 'senate' || mode === 'senate-class') {
        const seat = senateByState.get(state.id);
        const stateVoters = voterStates.get(state.id);
        const activeClass = targetSenateClassNum;
        const activeRoman = activeClass === 1 ? 'I' : activeClass === 2 ? 'II' : 'III';

        if (isForecasterMode) {
          if (!seat) {
            const noSeatTitle = `${state.name || state.id} · No Class ${activeRoman} Senate seat contested this cycle`;
            return `<path style="fill:#334155" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(noSeatTitle)}</title></path>`;
          }
          const incName = seat?.incumbent || seat?.label || 'Contested Seat';
          if (isPollingMode) {
            const bd = getStatePollingBreakdown(state, null, `senate:${state.id}`);
            const fillColor = pollingMarginColor(bd.leader.canonicalId, bd.margin, bd.leader.color);
            const seatTitle = `${state.id} Senate (Class ${seat.classNum}: ${incName}) — ${bd.summaryText} · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
            return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(seatTitle)}</title></path>`;
          }
          const k = `senate:${state.id}`;
          const r = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
          const fillColor = ratingColor(r);
          const seatTitle = `${state.name || state.id} Senate (Class ${seat.classNum}: ${incName}) · Rating: ${formatRating(r)} [${activeOutletName}] · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
          return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(seatTitle)}</title></path>`;
        }
        // REQ-163: Non-forecaster mode (Current Senate Class map) shows sitting incumbent party control
        if (!seat) {
          const noSeatTitle = `${state.name || state.id} · No Senate Class ${activeRoman} seat contested this cycle`;
          return `<path style="fill:#334155" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(noSeatTitle)}</title></path>`;
        }
        const incName = seat?.incumbent || seat?.label || 'Class ' + activeRoman + ' seat';
        party = seat.visualKey || seat.party || 'pending';
        const affiliationLabel = seat?.affiliationLabel || 'Sitting Incumbent';
        title = `${state.id}, Senate Class ${activeRoman} · Incumbent: ${incName} · ${affiliationLabel}`;
      } else if (mode === 'stateLeg' && isForecasterMode) {
        const stateVoters = voterStates.get(state.id);
        if (state.id === 'NE') {
          const neTitle = `Nebraska (NE) · Nonpartisan Unicameral Legislature · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
          return `<path style="fill:#475569" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(neTitle)}</title></path>`;
        }
        if (isPollingMode) {
          const bd = getStatePollingBreakdown(state, null, `state-leg:${state.id}`);
          const fillColor = pollingMarginColor(bd.leader.canonicalId, bd.margin, bd.leader.color);
          const legTitle = `${state.id} State Legislature — ${bd.summaryText} · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
          return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(legTitle)}</title></path>`;
        }
        const k = `stateLeg:${state.id}`;
        const r = activeOutletData[k] || consensusRating(game.forecasters?.sallow?.[k], game.forecasters?.cooked?.[k], game.forecasters?.inside?.[k]) || 'Toss-Up';
        const fillColor = ratingColor(r);
        const legTitle = `${state.name || state.id} (${state.id}) State Legislature · Rating: ${formatRating(r)} [${activeOutletName}] · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`;
        return `<path style="fill:${fillColor}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-map-state="${state.id}" tabindex="0"><title>${safe(legTitle)}</title></path>`;
      } else {
        const [lower, upper] = game.stateLegislatures?.[state.id] || MAPS.legislatures[state.id] || [];
        party = [lower, upper].includes('unknown') ? 'unknown' : lower === upper ? lower : [lower, upper].every((value) => ['people', 'heritage'].includes(value)) ? 'split' : lower === 'nonpartisan' ? 'nonpartisan' : 'other';
        title = `${state.id}: lower ${lower || 'unknown'}, upper ${upper || 'unknown'}`;
      }
      const stateVoters = voterStates.get(state.id);
      return svgPath(state, `map-state-shape ${partyClass(party)}`, `${title} · ${formatMillions(stateVoters?.representedVoters || 0)}M modeled voters`);
    }).join('');
  }
  const labels = stateRows.map((state) => `<text x="${state.cx}" y="${state.cy}" class="map-label" pointer-events="none">${state.id}</text>`).join('');
  const view = `<svg class="us-map-svg" viewBox="${MAPS.viewBox}" role="img" aria-label="United States ${mode} control map">${svgDefs}${geometry}${labels}</svg>`;
  let legend = '';
  if (isForecasterMode) {
    if (isPollingMode) {
      legend = `
        <div class="v08-gradient-legend" style="margin-top:10px">
          <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#7ee3d4;margin-bottom:4px">
            <span>◀ Democratic Margin</span>
            <span>Live Polling Average Margin Gradient</span>
            <span>Republican Margin ▶</span>
          </div>
          <div class="v159-polling-legend-bar"></div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);flex-wrap:wrap;gap:4px">
            <span style="color:#60a5fa;font-weight:700">D+20%+</span>
            <span>D+10%</span>
            <span>D+3%</span>
            <span style="color:#cbd5e1;font-weight:700">Close (&lt;3%)</span>
            <span>R+3%</span>
            <span>R+10%</span>
            <span style="color:#f87171;font-weight:700">R+20%+</span>
          </div>
          ${mode === 'stateLeg' ? '<div class="map-legend" style="margin-top:6px"><span><i style="background:#475569"></i>Nebraska (Nonpartisan)</span></div>' : ''}
          ${(mode === 'senate' || mode === 'senate-class') && !isUniversalSenate ? '<div class="map-legend" style="margin-top:6px"><span><i style="background:#334155"></i>No seat up this cycle</span></div>' : ''}
        </div>`;
    } else if (forecasterMapSource === 'consensus') {
      legend = `
        <div class="v08-gradient-legend" style="margin-top:10px">
          <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:var(--gold);margin-bottom:4px">
            <span>◀ Democratic Advantage</span>
            <span>Consensus Blended Spectrum</span>
            <span>Republican Advantage ▶</span>
          </div>
          <div class="v08-gradient-continuous-bar">
            ${TIER_13_ORDER.map((t) => `<div style="background:${TIER_13_COLORS[t]}" title="${safe(formatRating(t))}"></div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);flex-wrap:wrap;gap:4px">
            <span style="color:#1d4ed8;font-weight:700">Safe Dem</span>
            <span>Very Likely Dem</span>
            <span>Likely Dem</span>
            <span>Favored Dem</span>
            <span>Lean Dem</span>
            <span>Tilt Dem</span>
            <span style="color:#fbbf24;font-weight:700">Toss-Up</span>
            <span>Tilt GOP</span>
            <span>Lean GOP</span>
            <span>Favored GOP</span>
            <span>Likely GOP</span>
            <span>Very Likely GOP</span>
            <span style="color:#b91c1c;font-weight:700">Safe GOP</span>
          </div>
          ${mode === 'stateLeg' ? '<div class="map-legend" style="margin-top:6px"><span><i style="background:#475569"></i>Nebraska (Nonpartisan)</span></div>' : ''}
        </div>`;
    } else {
      legend = `
        <div class="map-legend" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
          <span><i style="background:#1d4ed8"></i>Safe Dem</span>
          <span><i style="background:#3b82f6"></i>Likely Dem</span>
          <span><i style="background:#93c5fd"></i>Lean Dem</span>
          <span><i style="background:#fbbf24"></i>Toss-Up</span>
          <span><i style="background:#fca5a5"></i>Lean GOP</span>
          <span><i style="background:#ef4444"></i>Likely GOP</span>
          <span><i style="background:#b91c1c"></i>Safe GOP</span>
          ${(mode === 'senate' || mode === 'senate-class') && !isUniversalSenate ? '<span><i style="background:#334155"></i>No seat in class</span>' : ''}
          ${mode === 'governors' ? '<span><i style="background:#334155"></i>No race this cycle</span>' : ''}
          ${mode === 'stateLeg' ? '<span><i style="background:#475569"></i>Nebraska (Nonpartisan)</span>' : ''}
        </div>`;
    }
  } else if (mode === 'presidential') {
    const hasInGamePres = (game.lastElection?.year && (game.lastElection?.presidentialResults || game.lastElection?.presidential)) || (isComplete && game.presidentialForecast);
    const demName = hasInGamePres ? (game.presidentialTicket?.people || 'Democratic') : 'Kamala Harris (Democratic · 226 EV)';
    const repName = hasInGamePres ? (game.presidentialTicket?.heritage || 'Republican') : 'Donald Trump (Republican · 312 EV)';
    legend = `<div class="map-legend"><span><i class="party-dem"></i>${safe(demName)}</span><span><i class="party-rep"></i>${safe(repName)}</span></div>`;
  } else if (mode === 'senate-combined') {
    legend = `<div class="map-legend"><span><i class="party-dem"></i>Both Senators Democratic (or caucus Dem)</span><span><i class="party-rep"></i>Both Senators Republican (or caucus GOP)</span><span><i class="party-split"></i>Split Delegation (1 Dem + 1 GOP)</span></div>`;
  } else if (mode === 'senate-class' || mode === 'senate') {
    const activeRoman = targetSenateClassNum === 1 ? 'I' : targetSenateClassNum === 2 ? 'II' : 'III';
    legend = `<div class="map-legend"><span><i class="party-dem"></i>Democratic Incumbent</span><span><i class="party-rep"></i>Republican Incumbent</span><span><i class="party-ind-dem"></i>Independent (Caucuses Dem)</span><span><i style="background:#334155"></i>No Class ${activeRoman} seat up</span></div>`;
  } else if (mode === 'house') {
    legend = `<div class="map-legend"><span><i class="party-dem"></i>Democratic Incumbent</span><span><i class="party-rep"></i>Republican Incumbent</span><span><i class="party-other"></i>Other / Independent Incumbent</span></div>`;
  } else if (mode === 'lean-gradient') {
    legend = `<div class="v08-gradient-legend">
      <div class="v08-gradient-bar"></div>
      <div class="v08-gradient-labels">
        <span>Safe Democratic</span>
        <span>Lean Democratic</span>
        <span>Competitive Toss-Up</span>
        <span>Lean Republican</span>
        <span>Safe Republican</span>
      </div>
    </div>`;
  } else if (mode === 'trifectas') {
    legend = `<div class="map-legend">
      <span><i class="party-dem-trifecta"></i>Democrat Trifecta</span>
      <span><i class="party-rep-trifecta"></i>Republican Trifecta</span>
      <span><i class="party-mixed-control"></i>Mixed Control</span>
      <span><i class="party-nonpartisan"></i>Nonpartisan (NE)</span>
    </div>`;
  } else {
    legend = `<div class="map-legend"><span><i class="party-dem"></i>Democratic</span><span><i class="party-rep"></i>Republican</span>${mode === 'senate' ? '<span><i class="party-ind-dem"></i>Independent (Caucuses Dem)</span>' : ''}${isUniversalSenate ? '<span><i style="background:repeating-linear-gradient(45deg,#3478c8 0 6px,#c9474e 6px 12px)"></i>Split Delegation (50/50 Diagonal)</span><span><i style="background:repeating-linear-gradient(45deg,#1abc9c 0 6px,#3478c8 6px 12px)"></i>Split (Ind + Dem)</span><span><i style="background:repeating-linear-gradient(45deg,#1abc9c 0 6px,#c9474e 6px 12px)"></i>Split (Ind + GOP)</span>' : ''}<span><i class="party-other"></i>Other / Independent</span>${!isUniversalSenate ? '<span><i class="party-pending"></i>No seat in class / pending</span>' : ''}${mode === 'state-legislatures' ? '<span><i class="party-split"></i>Split legislature (whole state)</span>' : ''}</div>`;
  }
  return { view, legend, houseCounts, presForecast, senateByState, chamber };
}

function mapTabMarkup() {
  const isPresYear = (game?.year || 2028) % 4 === 0;
  const activeSenateClass = game?.activeSenateClass || (window.PartyChairEngine?.getSenateClassForYear ? window.PartyChairEngine.getSenateClassForYear(game?.year || 2028) : 3);
  const activeSenateRoman = activeSenateClass === 1 ? 'I' : activeSenateClass === 2 ? 'II' : 'III';

  let currentMapMode = activeMap;
  if (currentMapMode === 'senate') currentMapMode = 'senate-class';

  const tabs = [
    ['presidential', 'Recent Presidential (2024 / Certified)'],
    ['house', 'Current House Control (435 Districts)'],
    ['senate-class', `Current Senate Class (Class ${activeSenateRoman})`],
    ['senate-combined', 'Combined 50-State Senate (Delegations)'],
    ['governors', 'Governorships'],
    ['state-legislatures', 'State Legislatures'],
    ['lean-gradient', 'Partisan Lean Gradient'],
    ['trifectas', 'Trifectas & Mixed Control'],
  ];

  const env = game.nationalEnvironment || 0;
  const nationalLabel = env === 0 ? 'Even' : `${env > 0 ? 'D' : 'R'}+${Math.abs(env).toFixed(1)}`;
  const map = nationalMapSvg(currentMapMode, { forecaster: false, chamberClass: activeSenateRoman });
  const chamber = map.chamber || computeSenateChamberBreakdown();

  const senatePairByState = new Map();
  chamber.seats.forEach((row) => {
    const arr = senatePairByState.get(row.stateId) || [];
    arr.push(row);
    senatePairByState.set(row.stateId, arr);
  });

  let detail = '';

  if (currentMapMode === 'presidential') {
    const inGameOutcome = (game.lastElection?.year && (game.lastElection?.presidentialResults || game.lastElection?.presidential))
      ? game.lastElection
      : (game.phase === 'complete' && game.presidentialForecast ? { presidentialResults: game.presidentialForecast.byState, year: game.year } : null);

    let demEv = 0, repEv = 0;
    if (inGameOutcome?.presidentialResults) {
      STATES.forEach((s) => {
        const res = inGameOutcome.presidentialResults[s.id];
        const w = typeof res === 'string' ? res : res?.winner;
        const ev = s.ev || 3;
        if (w === 'people') demEv += ev;
        else if (w === 'heritage') repEv += ev;
      });
    } else {
      demEv = 226;
      repEv = 312;
    }
    const demName = inGameOutcome ? (game.presidentialTicket?.people || 'Democratic Nominee') : 'Kamala Harris';
    const repName = inGameOutcome ? (game.presidentialTicket?.heritage || 'Republican Nominee') : 'Donald Trump';
    const presYearLabel = inGameOutcome ? inGameOutcome.year || game.year : 2024;
    const winnerTitle = repEv > demEv ? `${repName} won President with ${repEv} EV` : `${demName} won President with ${demEv} EV`;

    detail = `
      <div class="presidential-scoreboard">
        <div class="ec-candidate dem">
          <span class="candidate-party">Democratic</span>
          <b class="candidate-name">${safe(demName)}</b>
          <span class="candidate-ev">${demEv} <small>EV</small></span>
        </div>
        <div class="ec-bar-wrapper">
          <div class="ec-bar" role="progressbar" aria-valuenow="${demEv}" aria-valuemin="0" aria-valuemax="538">
            <div class="ec-segment dem" style="width:${(demEv / 538) * 100}%"></div>
            <div class="ec-marker-270" title="270 needed to win"><span>270 to win</span></div>
            <div class="ec-segment rep" style="width:${(repEv / 538) * 100}%"></div>
          </div>
          <div class="ec-subbar">
            <span>${demEv} Electoral Votes</span>
            <span class="ec-majority-note">270 needed to win</span>
            <span>${repEv} Electoral Votes</span>
          </div>
        </div>
        <div class="ec-candidate rep">
          <span class="candidate-party">Republican</span>
          <b class="candidate-name">${safe(repName)}</b>
          <span class="candidate-ev">${repEv} <small>EV</small></span>
        </div>
      </div>
      <p class="map-summary"><b>Certified ${presYearLabel} Presidential Outcome:</b> ${winnerTitle}. Displays historical certified outcome representing current executive branch reality.</p>`;
  } else if (currentMapMode === 'house') {
    detail = `<div class="presidential-scoreboard v08-qualitative-scoreboard" style="padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px">
      <h4 style="margin:0 0 4px;font-size:15px;color:var(--gold)">Current U.S. House of Representatives (435 Districts)</h4>
      <p style="margin:0;font-size:13px;color:var(--muted)">Sitting incumbent party control: <b>${map.houseCounts.people || 0} Democratic</b> · <b>${map.houseCounts.heritage || 0} Republican</b>${map.houseCounts.other ? ` · <b>${map.houseCounts.other} Other</b>` : ''}. All 435 congressional districts are contested every two years.</p>
    </div>`;
  } else if (currentMapMode === 'senate-class') {
    const clsNum = activeSenateClass;
    const seats = chamber.seats.filter((row) => row.classNum === clsNum);
    const demC = seats.filter((r) => r.caucus === 'people').length;
    const indD = seats.filter((r) => r.isIndependent && r.caucus === 'people').length;
    const repC = seats.filter((r) => r.caucus === 'heritage').length;
    detail = `<div class="presidential-scoreboard v08-qualitative-scoreboard" style="padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px">
      <h4 style="margin:0 0 4px;font-size:15px;color:var(--gold)">Current U.S. Senate Class ${activeSenateRoman} (${seats.length} Seats Contested)</h4>
      <p style="margin:0;font-size:13px;color:var(--muted)">Incumbent seats up for election this cycle: <b>${demC} Democratic</b>${indD ? ` (including ${indD} Independent caucusing Dem)` : ''} · <b>${repC} Republican</b>. Inactive states (${50 - seats.length} states) are shaded in neutral slate (#334155).</p>
    </div>`;
  } else if (currentMapMode === 'senate-combined') {
    let demStates = 0, repStates = 0, splitStates = 0;
    MAPS.states.filter((s) => s.id !== 'DC').forEach((st) => {
      const pair = (senatePairByState.get(st.id) || []);
      const isDem = (s) => s && (s.caucus === 'people' || s.party === 'people');
      const isGop = (s) => s && (s.caucus === 'heritage' || s.party === 'heritage');
      if (pair.length >= 2 && pair.every(isDem)) demStates++;
      else if (pair.length >= 2 && pair.every(isGop)) repStates++;
      else splitStates++;
    });
    detail = `<div class="presidential-scoreboard v08-qualitative-scoreboard" style="padding:12px;background:#101a26;border:1px solid var(--line);border-radius:8px">
      <h4 style="margin:0 0 4px;font-size:15px;color:var(--gold)">Combined 50-State U.S. Senate Delegations (100 Seats)</h4>
      <p style="margin:0;font-size:13px;color:var(--muted)">State delegation control: <b style="color:#3478c8">${demStates} Democratic Delegations (Blue)</b> · <b style="color:#c9474e">${repStates} Republican Delegations (Red)</b> · <b style="color:#8654a4">${splitStates} Split Delegations (Purple: 1 Dem + 1 GOP)</b>.</p>
    </div>`;
  } else if (currentMapMode === 'governors') {
    detail = `<p class="map-summary">Gubernatorial control across all 50 states. ${(game?.activeGubernatorialStates || window.PartyChairData.VERSION_01_GUBERNATORIAL_ELECTIONS || []).length} governorships are up in ${game?.year || 2028}.</p>`;
  } else if (currentMapMode === 'lean-gradient') {
    detail = `<p class="map-summary"><b>Partisan Lean Gradient:</b> Continuous smooth partisan tilt across all 50 states. Blue indicates Democratic lean; Red indicates Republican lean; Slate/Purple indicates pure Toss-Up territory. Use the gradient legend to evaluate national elasticity.</p>`;
  } else if (currentMapMode === 'trifectas') {
    detail = `<p class="map-summary"><b>Trifectas & Mixed Control:</b> State government control across the nation. Colors distinctly map Democratic Trifectas, Republican Trifectas, Divided Gov/Leg combinations, and Split Legislatures (whole-state Purple). Nonpartisan Nebraska is indicated separately.</p>`;
  } else {
    const totals = { people: 0, heritage: 0, split: 0, nonpartisan: 0, other: 0, unknown: 0 };
    Object.entries(MAPS.legislatures).forEach(([state, chambers]) => {
      const [a, b] = game.stateLegislatures?.[state] || chambers;
      const key = [a, b].includes('unknown') ? 'unknown' : a === b ? a : ['people', 'heritage'].includes(a) && ['people', 'heritage'].includes(b) ? 'split' : 'other';
      totals[key] = (totals[key] || 0) + 1;
    });
    detail = `<p class="map-summary">${totals.people} states Democratic both chambers · ${totals.heritage} Republican · ${totals.split} split (purple) · ${totals.nonpartisan} nonpartisan (NE).</p>`;
  }

  // Clicked-state quick inspector below the map
  const cleanStateId = String(mapState || 'PA').split('-')[0];
  const inspectedState = STATES.find((s) => s.id === cleanStateId) || STATES[0];
  const stateSenators = chamber.seats.filter((s) => s.stateId === inspectedState.id).sort((a, b) => a.classNum - b.classNum);
  const stateLeg = game.stateLegislatures?.[inspectedState.id] || ['heritage', 'heritage'];
  const stateGovParty = game.governorships?.[inspectedState.id] || MAPS.governors[inspectedState.id];
  const stateVoters = (game?.voterModel?.states || VOTER_MODEL.states).find((s) => s.stateId === inspectedState.id);
  const statePresMargin = window.PartyChairEngine.presidentialStateMargin ? window.PartyChairEngine.presidentialStateMargin(game, inspectedState.id) : 0;
  const trifectaLabel = (function() {
    const [lower, upper] = stateLeg;
    if (lower === 'nonpartisan') return `Nonpartisan Unicameral (NE) · Gov: ${stateGovParty === 'people' ? 'Dem' : 'GOP'}`;
    if (lower === 'people' && upper === 'people' && stateGovParty === 'people') return 'Democrat Trifecta';
    if (lower === 'heritage' && upper === 'heritage' && stateGovParty === 'heritage') return 'Republican Trifecta';
    return 'Mixed Control';
  })();

  return `
    <section class="panel section-panel version01-map">
      <div class="section-heading">
        <div><div class="eyebrow">Version 0.18.3 · Fullscreen National Political Map</div><h2>Political Landscape</h2></div>
        <div class="environment-chip">National environment <b>${nationalLabel}</b></div>
      </div>
      <div class="map-tabs">${tabs.map(([id, label]) => `<button type="button" data-map="${id}" class="${(currentMapMode === id || (id === 'senate-class' && activeMap === 'senate')) ? 'selected' : ''}">${label}</button>`).join('')}</div>
      ${detail}
      ${map.view}
      ${map.legend}
      <div class="v07-map-inspector">
        <div>
          <small class="eyebrow">Selected State Dossier · ${safe(inspectedState.id)}</small>
          <h3>${safe(inspectedState.name)} (${inspectedState.ev} EV)</h3>
          <p>${formatMillions(stateVoters?.representedVoters || 0)}M represented voters · Overlapping Regions: <b>${safe(stateOverlappingRegions(inspectedState.id).join(', '))}</b></p>
        </div>
        <div class="v07-map-facts">
          <div><small>Senators</small><b>${stateSenators.map((s) => {
            const partyTag = s.isIndependent
              ? (s.caucus === 'people' ? 'I · Caucuses Dem' : s.caucus === 'heritage' ? 'I · Caucuses GOP' : 'I')
              : (s.party === 'people' ? 'D' : s.party === 'heritage' ? 'R' : 'I');
            return `Class ${V07 ? V07.normalizeSenateClassRoman(s.classNum) : s.classNum}: ${safe(s.incumbent || s.label)} (${partyTag})`;
          }).join(' · ') || '—'}</b></div>
          <div><small>Governor &amp; Legislature</small><b>Gov: ${formatPartyDisplayName(stateGovParty, 'full')} · Lower: ${formatPartyDisplayName(stateLeg[0], 'short')} · Upper: ${formatPartyDisplayName(stateLeg[1], 'short')}</b></div>
          <div><small>Trifecta & Partisan Outlook</small><b>${trifectaLabel} · ${game.phase === 'complete' ? `Margin: ${statePresMargin >= 0 ? 'D+' : 'R+'}${Math.abs(statePresMargin).toFixed(1)}%` : `Outlook: ${statePresMargin >= 10 ? 'Safe D' : statePresMargin >= 5 ? 'Likely D' : statePresMargin >= 1.5 ? 'Lean D' : statePresMargin > -1.5 ? 'Toss-Up' : statePresMargin > -5 ? 'Lean R' : statePresMargin > -10 ? 'Likely R' : 'Safe R'}`}</b></div>
        </div>
        <button type="button" class="button button-small" data-open-state="${inspectedState.id}">Inspect in States Tab →</button>
      </div>
    </section>`;
}

const renderPoliticalLandscape = mapTabMarkup;

/* ==========================================================================
   TAB 3: STATES — FULLSCREEN 50-STATE DIRECTORY & VOTER REGISTRATION
   ========================================================================== */
function getFieldDirectorDispatch(state, game) {
  const identity = playerIdentity();
  const chapters = stateChaptersFor(state.id, identity);
  const presMargin = presidentialStateMargin(game, state.id);
  const region = (state.regions || [state.region])[0] || 'Heartland';
  const visits = game.donorDriveVisits?.[state.id] || 0;
  const pollSnapshot = game.commissionedPolls?.[`senate:${state.id}`] || game.commissionedPolls?.[`governor:${state.id}`];

  const terrainDesc = presMargin >= 5
    ? `Strong partisan winds favor our coalition across major metropolitan hubs, but rural county lines remain fiercely contested.`
    : presMargin <= -5
    ? `Conservative strongholds remain entrenched across outer suburban and rural precincts; expanding our line requires winning disaffected moderates and non-college workers.`
    : `Dead-heat battleground terrain; suburban precinct captains report ticket-splitting sentiments and volatile swing-voter loyalties.`;

  const groundIntel = chapters >= 3
    ? `Grassroots machinery is fully operational with ${chapters} active field chapters coordinating volunteer canvassing and precinct walks.`
    : chapters >= 1
    ? `Local machinery operates with ${chapters} organized chapter, maintaining steady voter registration tables at county events and community halls.`
    : `Field footprint is currently nascent; opening an additional county chapter will dramatically amplify voter turnout and surrogate leverage.`;

  const donorNote = visits > 0
    ? `Surrogate donor tours have visited this state ${visits} time${visits === 1 ? '' : 's'}; repeat appeals will encounter diminishing returns from donor fatigue.`
    : `State donor networks remain fresh and untapped, offering optimal yield for upcoming high-profile surrogate fundraising drives.`;

  const pollNote = pollSnapshot
    ? `Commissioned race polling confirms a ${formatPartyDisplayName(pollSnapshot.leader, 'full')} lead of +${pollSnapshot.margin}%, providing dependable baseline data for tactical volunteer deployment.`
    : `Field staff recommend commissioning a certified race poll to confirm localized polling margins before committing major advertising dollars.`;

  return `“${terrainDesc} ${groundIntel} ${donorNote} ${pollNote} Immediate tactical priority: solidify local union and civic group endorsements while accelerating ballot retention petition drives in key suburban corridors.”`;
}

function renderStateVoterRegistrationTable(game) {
  const vmStates = game?.voterModel?.states || VOTER_MODEL.states || [];
  const stateList = Array.isArray(vmStates) ? vmStates : Object.values(vmStates);
  const isCustomPlayer = Boolean(game?.player?.custom || game?.player?.id === 'custom');
  const catalog = (game?.factions && game.factions.length) ? game.factions : (window.PartyChairData?.FACTIONS_CATALOG || []);

  const rowsData = stateList.filter((s) => s.stateId !== 'DC').map((st) => {
    const totalRep = st.representedVoters || st.sampleVoters || 1;
    const aff = st.affiliations || {};

    const getPartyVoters = (pid, fallbackSample) => {
      if (st.factions && Object.keys(st.factions).length > 0) {
        const pFactions = catalog.filter((f) => f.partyId === pid || (pid === 'independent' && (f.partyId === 'independent' || f.id.startsWith('swg_'))));
        if (pFactions.length > 0) {
          const sum = pFactions.reduce((s, f) => s + (st.factions[f.id] || 0), 0);
          if (sum > 0) return sum;
        }
      }
      if (aff[pid] !== undefined) return aff[pid];
      return (fallbackSample || 0);
    };

    const dem = getPartyVoters('people', aff.people);
    const rep = getPartyVoters('heritage', aff.heritage);
    const ind = getPartyVoters('independent', aff.independent);
    const lib = getPartyVoters('liberty', aff.liberty);
    const grn = getPartyVoters('green', aff.green);
    const con = getPartyVoters('constitution', aff.constitution ?? Math.round((aff.other || 0) * 0.45));
    const soc = getPartyVoters('socialist', aff.socialist ?? Math.round((aff.other || 0) * 0.40));
    const rawOther = (aff.other || 0);
    const cust = isCustomPlayer ? getPartyVoters(game?.player?.id, aff[game?.player?.id] ?? Math.round(rawOther * 0.15)) : 0;
    const stateObj = STATES.find((s) => s.id === st.stateId);
    const isLowPop = totalRep < 1000000 || ['VT', 'WY', 'AK', 'DE', 'ND', 'SD'].includes(st.stateId);

    const deltas = game?.voterModel?.stateDeltas?.[st.stateId] || game?.stateVoterDeltas?.[st.stateId] || {};

    return {
      stateId: st.stateId,
      name: st.name || stateObj?.name || st.stateId,
      ev: stateObj?.ev || 3,
      totalRep,
      dem,
      rep,
      ind,
      lib,
      grn,
      con,
      soc,
      cust,
      isLowPop,
      deltas,
    };
  });

  rowsData.sort((a, b) => {
    let valA = a[regSortCol] ?? a.name;
    let valB = b[regSortCol] ?? b.name;
    if (typeof valA === 'string') {
      return regSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return regSortDir === 'asc' ? valA - valB : valB - valA;
  });

  const sortArrow = (col) => (regSortCol === col ? (regSortDir === 'asc' ? ' ▲' : ' ▼') : '');

  const formatGainBadge = (val) => {
    if (!val || val <= 0) return '';
    const txt = val >= 1000000 ? `+${(val / 1000000).toFixed(2)}M` : `+${Math.round(val / 1000)}K`;
    return `<span class="v15-reg-gain-badge">${txt}</span>`;
  };

  const formatMajorCell = (val, total, isLowPop, deltaVal = 0) => {
    const formatted = isLowPop
      ? `${(val / 1000000).toFixed(3)}M`
      : `${(val / 1000000).toFixed(2)}M`;
    const pct = ((val / total) * 100).toFixed(1);
    const badge = formatGainBadge(deltaVal);
    return `${formatted}${badge} <small style="color:var(--text-muted)">(${pct}%)</small>`;
  };

  const formatMinorCell = (val, total, deltaVal = 0) => {
    const formatted = val < 1000000 ? `${(val / 1000).toFixed(0)}K` : `${(val / 1000000).toFixed(2)}M`;
    const pct = ((val / total) * 100).toFixed(1);
    const badge = formatGainBadge(deltaVal);
    return `${formatted}${badge} <small style="color:var(--text-muted)">(${pct}%)</small>`;
  };

  return `
    <div class="state-reg-table-wrap" style="overflow-x:auto;margin-top:14px;border:1px solid rgba(255,255,255,0.12);border-radius:8px">
      <table class="state-reg-table" style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:right">
        <thead>
          <tr style="background:rgba(255,255,255,0.04);border-bottom:2px solid rgba(255,255,255,0.15);color:var(--gold);text-transform:uppercase;font-size:11px">
            <th style="padding:10px 12px;text-align:left;cursor:pointer" data-reg-sort="stateId">State (EV)${sortArrow('stateId')}</th>
            <th style="padding:10px 12px;cursor:pointer" data-reg-sort="totalRep">Total Voters${sortArrow('totalRep')}</th>
            <th style="padding:10px 12px;cursor:pointer;color:#72bbf6" data-reg-sort="dem">Democratic${sortArrow('dem')}</th>
            <th style="padding:10px 12px;cursor:pointer;color:#e77c85" data-reg-sort="rep">Republican${sortArrow('rep')}</th>
            <th style="padding:10px 12px;cursor:pointer;color:#a9b4bf" data-reg-sort="ind">Independent${sortArrow('ind')}</th>
            <th style="padding:10px 12px;cursor:pointer;color:#e2bd45" data-reg-sort="lib">Libertarian${sortArrow('lib')}</th>
            <th style="padding:10px 12px;cursor:pointer;color:#55bf78" data-reg-sort="grn">Green${sortArrow('grn')}</th>
            <th style="padding:10px 12px;cursor:pointer;color:#a84214" data-reg-sort="con">Constitution${sortArrow('con')}</th>
            <th style="padding:10px 12px;cursor:pointer;color:#d62828" data-reg-sort="soc">Peace &amp; Freedom${sortArrow('soc')}</th>
            ${isCustomPlayer ? `<th style="padding:10px 12px;cursor:pointer;color:${game.player.color || '#8b5cf6'}" data-reg-sort="cust">${safe(game.player.name)}${sortArrow('cust')}</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${rowsData.map((row) => {
            const totalDelta = Object.values(row.deltas).reduce((sum, d) => sum + (Number(d) || 0), 0);
            const totalFormatted = row.isLowPop ? (row.totalRep / 1000000).toFixed(3) : (row.totalRep / 1000000).toFixed(2);
            return `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.15)">
              <td style="padding:8px 12px;text-align:left">
                <b>${safe(row.name)}</b> <small style="color:var(--text-muted)">(${safe(row.stateId)} · ${row.ev} EV)</small>
              </td>
              <td style="padding:8px 12px;font-weight:600">${totalFormatted}M${formatGainBadge(totalDelta)}</td>
              <td style="padding:8px 12px;color:#9bc7f2">${formatMajorCell(row.dem, row.totalRep, row.isLowPop, row.deltas.people || row.deltas.dem)}</td>
              <td style="padding:8px 12px;color:#f0989e">${formatMajorCell(row.rep, row.totalRep, row.isLowPop, row.deltas.heritage || row.deltas.rep)}</td>
              <td style="padding:8px 12px;color:#c8d1db">${formatMajorCell(row.ind, row.totalRep, row.isLowPop, row.deltas.independent || row.deltas.ind)}</td>
              <td style="padding:8px 12px;color:#ebd178">${formatMinorCell(row.lib, row.totalRep, row.deltas.liberty || row.deltas.lib)}</td>
              <td style="padding:8px 12px;color:#8ce4be">${formatMinorCell(row.grn, row.totalRep, row.deltas.green || row.deltas.grn)}</td>
              <td style="padding:8px 12px;color:#c9714b">${formatMinorCell(row.con, row.totalRep, row.deltas.constitution || row.deltas.con)}</td>
              <td style="padding:8px 12px;color:#e86464">${formatMinorCell(row.soc, row.totalRep, row.deltas.socialist || row.deltas.soc)}</td>
              ${isCustomPlayer ? `<td style="padding:8px 12px;color:${game.player.color || '#8b5cf6'}">${formatMinorCell(row.cust, row.totalRep, row.deltas[game.player?.id] || row.deltas.custom || row.deltas.cust)}</td>` : ''}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function statesTabMarkup() {
  const identity = playerIdentity();
  const regionNames = V07?.OVERLAPPING_REGION_NAMES || Object.keys(V07?.OVERLAPPING_REGIONS || {});
  const filterRegions = ['All', ...regionNames];
  if (!filterRegions.includes(stateRegionFilter)) stateRegionFilter = 'All';

  const parties = partyList(game);
  const query = stateSearch.trim().toLowerCase();

  const filteredStates = STATES.filter((state) => {
    const regs = stateOverlappingRegions(state.id);
    if (stateRegionFilter !== 'All' && !regs.includes(stateRegionFilter)) return false;
    if (stateBillEligibleOnly && !(V07 ? V07.canIntroduceBillInState(game, state.id, identity) : true)) return false;
    if (query && !state.name.toLowerCase().includes(query) && !state.id.toLowerCase().includes(query)) return false;
    return true;
  });

  if (!filteredStates.some((s) => s.id === mapState) && filteredStates.length) {
    mapState = filteredStates[0].id;
  }
  const activeState = STATES.find((s) => s.id === mapState) || filteredStates[0] || STATES[0];
  const activeRegions = stateOverlappingRegions(activeState.id);
  const support = supportByState(game, activeState);
  const presMargin = presidentialStateMargin(game, activeState.id);
  const stateLeg = game.stateLegislatures?.[activeState.id] || ['heritage', 'heritage'];
  const billEligible = V07 ? V07.canIntroduceBillInState(game, activeState.id, identity) : false;
  const seatBreakdown = game.stateHouseSeatCounts?.[activeState.id] || {};
  const playerChambers = stateLeg.filter((c) => c === identity).length;
  const activeChapters = stateChaptersFor(activeState.id, identity);
  const rivalPartyId = identity === 'people' ? 'heritage' : 'people';
  const rivalChapters = stateChaptersFor(activeState.id, rivalPartyId);
  const localChapterList = (game.localChapters || []).filter((c) => c.stateId === activeState.id && c.active !== false);

  const sittingInState = (game.sittingMembers || []).filter((m) => m.stateId === activeState.id);
  const senatorsInState = sittingInState.filter((m) => m.office === 'senate').sort((a, b) => (a.senateClass || 0) - (b.senateClass || 0));
  const governorInState = sittingInState.filter((m) => m.office === 'governor');
  const houseInState = sittingInState.filter((m) => m.office === 'house').sort((a, b) => (a.district || 0) - (b.district || 0));

  const isHigherOfficeContender = (m) => {
    if (!m) return false;
    if (m.office === 'senate' || m.office === 'governor') return true;
    return (m.fame || 0) >= 40 || (m.quality || 0) >= 6;
  };

  const memberMatchesBenchFilter = (m, filter) => {
    if (!filter || filter === 'all') return true;
    if (filter === 'higher-office') return isHigherOfficeContender(m);
    if (filter === 'rising-stars') {
      return ((m.quality || 0) >= 7 && ((m.age && m.age < 52) || (m.fame || 0) < 55)) || Boolean(m.isRisingStar);
    }
    if (filter === 'party-elders') {
      return (m.age && m.age >= 65) || (m.fame || 0) >= 60 || Boolean(m.isElder);
    }
    return true;
  };

  const filteredSenators = senatorsInState.filter((m) => memberMatchesBenchFilter(m, sittingMembersFilter));
  const filteredGovernor = governorInState.filter((m) => memberMatchesBenchFilter(m, sittingMembersFilter));
  const filteredHouse = houseInState.filter((m) => memberMatchesBenchFilter(m, sittingMembersFilter));

  const stateSenateRace = (game?.activeSenateRaces || window.PartyChairData.VERSION_01_SENATE_RACES || []).find((r) => r.state === activeState.id);
  const stateGovRace = (game?.activeGubernatorialStates || window.PartyChairData.VERSION_01_GUBERNATORIAL_ELECTIONS || []).includes(activeState.id);
  const sampleRaceId = stateSenateRace ? `senate:${activeState.id}` : stateGovRace ? `governor:${activeState.id}` : null;
  const recruitPreview = sampleRaceId ? window.PartyChairData.VERSION_01_STATE_RECRUIT(sampleRaceId, activeState.name, identity, game.seed, game.chairTurn || 0) : null;

  const renderRosterMember = (m) => {
    const isInd = !m.hasSwitchedThisCycle && (
      m.isIndependent === true ||
      m.party === 'independent' ||
      m.rawParty === 'independent' ||
      m.rawParty === 'I' ||
      ['Bernie Sanders', 'Angus King'].includes(m.name)
    );
    const partyLabel = isInd
      ? 'IND'
      : m.party === 'people'
        ? 'Democratic'
        : m.party === 'heritage'
          ? 'Republican'
          : m.party === 'player'
            ? (game.player?.name || 'Custom')
            : (templateForDisplay(m.party) || m.party);
    const tagCls = isInd
      ? 'ind'
      : m.party === 'people'
        ? 'dem'
        : m.party === 'heritage'
          ? 'rep'
          : 'ind';
    const caucus = isInd ? (m.caucus || 'people') : null;
    const caucusCls = caucus === 'people' ? 'dem' : caucus === 'heritage' ? 'rep' : 'ind';
    const caucusText = caucus === 'people' ? 'Caucuses Dem' : caucus === 'heritage' ? 'Caucuses GOP' : 'Unaligned Ind';
    const officeText = m.office === 'senate' ? `Senate Class ${V07 ? V07.normalizeSenateClassRoman(m.senateClass || m.class) : m.senateClass}` : m.office === 'governor' ? 'Governor' : m.districtId || 'House';
    const isHigherOffice = isHigherOfficeContender(m);
    const higherOfficePip = isHigherOffice
      ? `<span class="v13-pip-higher-office" title="Higher Office Contender">▲</span>`
      : '';
    const partyColor = m.party === 'people' ? '#3478c8' : m.party === 'heritage' ? '#c9474e' : m.party === 'player' ? (game.player?.color || '#8b5cf6') : (PARTY_ARCHETYPES.find((p) => p.id === m.party)?.color || '#1abc9c');
    const customStyle = (!['people', 'heritage'].includes(m.party) && !isInd)
      ? `style="background:${partyColor}33;color:${partyColor};border:1px solid ${partyColor}66"`
      : '';
    return `<details class="v07-member-dossier">
      <summary>
        <div>
          <b>${safe(m.name)}</b>${higherOfficePip}
          <span class="v07-party-tag ${tagCls}" ${customStyle}>${safe(partyLabel)}</span>
          ${isInd ? `<span class="v09-caucus-pill ${caucusCls}">${caucusText}</span>` : ''}
          ${m.isIncumbent ? '<span class="v07-incumbent-badge">INCUMBENT</span>' : ''}
        </div>
        <div class="v07-member-meta">
          ${memberMetricsBadgesMarkup(m, `<span class="v07-quality-badge">Q${m.quality || 6}</span>`)}
          <span>${safe(officeText)}</span>
        </div>
      </summary>
      <div class="v07-member-body">
        <small>Faction: ${safe(resolveMemberFactionName(m))} · Personal Happiness: ${Math.round(m.happiness ?? 70)}/100 · Age: ${m.age || (m.birthYear ? (game.year || 2028) - m.birthYear : 'Unknown')}${m.careerLongevity ? ` · Service: ${m.careerLongevity} yrs` : ''}</small>
        ${statBarsMarkup(m.ratings || {}, true)}
        ${(() => {
          const bio = window.PartyChairData?.getPoliticianBio ? window.PartyChairData.getPoliticianBio(m) : null;
          if (!bio) return '';
          return `
            <div class="v18-politician-bio-card">
              <div class="v18-bio-row"><strong>Roots:</strong> <span>${safe(bio.hometown || 'Grassroots Community')}</span> · <strong>Education:</strong> <span>${safe(bio.almaMater || 'State University')}</span></div>
              <div class="v18-bio-row"><strong>Background:</strong> <span>${safe(bio.career || 'Public Service')}</span></div>
              <div class="v18-bio-row"><strong>Career Milestone:</strong> <span>${safe(bio.milestone || 'Distinguished legislative service.')}</span></div>
            </div>`;
        })()}
      </div>
    </details>`;
  };

  return `
    <section class="panel section-panel">
      <div class="section-heading">
        <div><div class="eyebrow">Fullscreen 50-State Directory</div><h2>States, Chapters & Sitting Officials</h2>
${Object.values(game?.chapters || {}).reduce((a, b) => a + (Number(b) || 0), 0) === 0 ? '<div style="font-size:12px;color:#fcd34d;margin:6px 0;">Tip: Establish your first state chapter to unlock recurring chapter fundraising and 3-cycle turnout cushions.</div>' : ''}</div>
        <span class="turnout-chip">${totalPlayerStateChapters().toLocaleString()} Total Player Chapters</span>
      </div>

      <div class="v07-subview-toggle" style="display:flex;gap:10px;margin:12px 0 16px">
        <button type="button" class="button button-small ${stateSubview === 'directory' ? 'button-gold' : ''}" data-state-subview="directory">50-State Directory & Dossiers</button>
        <button type="button" class="button button-small ${stateSubview === 'registration' ? 'button-gold' : ''}" data-state-subview="registration">State Voter Registration Table (Disaggregated)</button>
      </div>

      ${stateSubview === 'registration' ? renderStateVoterRegistrationTable(game) : `
      <div class="v07-filter-tabs">
        ${filterRegions.map((reg) => `<button type="button" data-state-region="${safe(reg)}" class="${stateRegionFilter === reg ? 'selected' : ''}">${safe(reg)}</button>`).join('')}
      </div>

      <div class="v07-state-toolbar">
        <input type="search" id="state-search" placeholder="Search state name or code (e.g. Ohio, AK, PA)..." value="${safe(stateSearch)}">
        <label class="v07-inline-check"><input type="checkbox" id="state-bill-eligible" ${stateBillEligibleOnly ? 'checked' : ''}> Bill-Eligible States Only (Control ≥1 chamber)</label>
      </div>

      <div class="v07-states-layout">
        <div class="v07-states-list">
          ${filteredStates.map((state) => {
            const stSupport = supportByState(game, state);
            const top = parties.slice().sort((a, b) => stSupport[b.id] - stSupport[a.id])[0];
            const chaptersHere = stateChaptersFor(state.id, identity);
            const eligible = V07 ? V07.canIntroduceBillInState(game, state.id, identity) : false;
            const fedProfile = game.stateFederalism?.[state.id] || null;
            const pipClass = fedProfile ? `v12-state-health-pip pip-${fedProfile.healthPip || 'green'}` : 'v12-state-health-pip pip-green';
            const pipTitle = fedProfile?.healthTooltip || `${state.name} State Committee: Healthy & autonomous`;
            const sysBadgesCompact = getStateElectoralBadgesMarkup(state.id, true);
            const btBadgeCompact = getStateBreakthroughBadgeMarkup(state.id, true);
            return `<button type="button" class="v07-state-row-btn ${activeState.id === state.id ? 'selected' : ''}" data-select-state="${state.id}">
              <span class="state-code">${state.id}</span>
              <div>
                <b>${safe(state.name)} <span class="${pipClass}" title="${safe(pipTitle)}"></span></b>
                <small>${chaptersHere} ch. · ${eligible ? 'Bill OK' : 'No leg.'}${fedProfile?.inReceivership ? ' · Receivership' : ''}</small>
                ${(sysBadgesCompact || btBadgeCompact) ? `<div class="v159-state-badges-row" style="margin-top:3px">${sysBadgesCompact}${btBadgeCompact}</div>` : ''}
              </div>
              <span class="v07-state-leader" style="--party:${top.color}"><i></i>${game.phase === 'complete' ? `${Math.round(stSupport[top.id])}%` : (top.id === 'people' ? 'Dem' : 'GOP')}</span>
            </button>`;
          }).join('') || '<p class="quiet-note">No states match this filter.</p>'}
        </div>

        <div class="v07-state-detail">
          ${(() => {
            const activeFed = game.stateFederalism?.[activeState.id] || null;
            if (!activeFed) return '';
            const isCrisis = Boolean(activeFed.crisis);
            const inRec = Boolean(activeFed.inReceivership);
            const isRebel = activeFed.frictionTier === 'rebellion';
            const isMild = activeFed.frictionTier === 'mild';
            return `
              <div class="v12-federalism-banner ${isCrisis ? 'crisis' : (inRec ? 'receivership' : (isRebel ? 'rebellion' : (isMild ? 'friction' : 'healthy')))}">
                <div class="fed-banner-header">
                  <span class="v12-state-health-pip pip-${activeFed.healthPip}"></span>
                  <b>${safe(activeFed.healthTooltip)}</b>
                </div>
                <div class="fed-banner-body">
                  <span>Platform Distance: <b>${activeFed.platformDistance.toFixed(2)} pts</b></span>
                  <span>Fundraising Efficiency: <b>${Math.round((activeFed.fundraisingMultiplier || 1.0) * 100)}%</b></span>
                  ${inRec ? `<span class="v12-badge-rec">Under National Administration ($0.5M/turn payroll · ${activeFed.receivershipTurnsLeft} turns left)</span>` : ''}
                  ${isRebel ? `<span class="v12-badge-rebel">Severe Rebellion: Local chair disavowed national platform (-20% turnout)</span>` : ''}
                </div>
                ${isCrisis && game.phase === 'organizing' ? `
                  <div class="fed-crisis-box">
                    <div class="crisis-title">⚠️ ${safe(activeFed.crisis.title)}</div>
                    <p class="crisis-desc">${safe(activeFed.crisis.description)}</p>
                    <div class="crisis-actions">
                      <button type="button" class="button button-small button-gold" data-crisis-choice="receivership" data-crisis-state="${activeState.id}" ${game.treasury < 5 ? 'disabled' : ''}>Full Federal Receivership ($5M)</button>
                      <button type="button" class="button button-small" data-crisis-choice="grant" data-crisis-state="${activeState.id}" ${game.treasury < 3 ? 'disabled' : ''}>Matching Grant ($3M · 60% success)</button>
                      <button type="button" class="button button-small button-muted" data-crisis-choice="ignore" data-crisis-state="${activeState.id}">Non-Intervention (Preserve Funds)</button>
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          })()}
          <div class="section-heading">
            <div>
              <div class="eyebrow">${safe(activeState.id)} · ${activeState.ev} Electoral Votes</div>
              <h2>${safe(activeState.name)}</h2>
              <div class="v159-state-badges-row">
                ${getStateElectoralBadgesMarkup(activeState.id, false)}
                ${getStateBreakthroughBadgeMarkup(activeState.id, false)}
              </div>
            </div>
            <div class="v07-region-badges">
              ${activeRegions.map((r) => `<span class="v07-region-pill ${(game.regionalPriorities || []).includes(r) ? 'prioritized' : ''}">${safe(r)} ${(game.regionalPriorities || []).includes(r) ? '★' : ''}</span>`).join('')}
            </div>
          </div>

          <div class="v07-state-kpis">
            <div class="v07-kpi-box">
              <small>Party Chapters</small>
              <b>${activeChapters} Player · ${rivalChapters} Rival</b>
              <span>Includes Youth Chapters (active organizational category)</span>
              <button type="button" class="button button-small" data-quick-chapter="${activeState.id}" ${game.phase === 'complete' || (game.organizingActionsRemaining ?? game.actionsLeft) <= 0 || game.treasury < 6 ? 'disabled' : ''}>Open State Chapter ($6M · 1 act)</button>
            </div>
            <div class="v07-kpi-box">
              <small>State Legislature & Bills</small>
              <b>Lower: ${formatPartyDisplayName(stateLeg[0], 'short')} · Upper: ${formatPartyDisplayName(stateLeg[1], 'short')}</b>
              ${(() => {
                const seoList = (game.sittingMembers || []).filter((m) => m.office === 'statewide_executive' && m.stateId === activeState.id);
                if (!seoList.length) return '';
                return `<div style="margin-top:8px;padding-top:6px;border-top:1px solid var(--line);font-size:12px">
                  <div class="eyebrow" style="margin-bottom:4px">Statewide Elected Executive Officers (${seoList.length})</div>
                  ${seoList.map((o) => `<div><b>${safe(o.title || o.subOffice)}:</b> ${safe(o.name)} (${o.party === 'people' ? 'D' : o.party === 'heritage' ? 'R' : '3P'})</div>`).join('')}
                </div>`;
              })()}
              <span>State House seats: D ${seatBreakdown.people || 0} · R ${seatBreakdown.heritage || 0}</span>
              <span class="${billEligible ? 'v07-ok-text' : 'v07-muted-text'}">${billEligible ? `✓ Eligible for State Policy Bill (${playerChambers}/2 chambers)` : '✕ Control at least 1 chamber to introduce bills'}</span>
            </div>
            <div class="v07-kpi-box">
              <small>Presidential & Support Forecast</small>
              <b>${game.phase === 'complete' ? `${presMargin >= 0 ? 'D+' : 'R+'}${Math.abs(presMargin).toFixed(1)}% Pres.` : `${presMargin >= 10 ? 'Safe D' : presMargin >= 5 ? 'Likely D' : presMargin >= 1.5 ? 'Lean D' : presMargin > -1.5 ? 'Toss-Up' : presMargin > -5 ? 'Lean R' : presMargin > -10 ? 'Likely R' : 'Safe R'} (${presMargin >= 0 ? 'Dem' : 'GOP'} Lean)`}</b>
              <span>${game.phase === 'complete' ? parties.map((p) => `${safe(p.name.split(' ')[0])} ${Math.round(support[p.id])}%`).join(' · ') : 'Qualitative Forecaster Outlook (Cook & Sallow)'}</span>
            </div>
          </div>

          <!-- Field Director Qualitative Dispatch -->
          <div class="vibe-dispatch-card" style="margin:16px 0;padding:12px 16px;background:rgba(255,255,255,0.03);border-left:3px solid var(--gold);border-radius:6px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:11px;font-weight:700;letter-spacing:0.05em;color:var(--gold);text-transform:uppercase">Field Director Qualitative Dispatch</span>
              <span style="font-size:11.5px;color:var(--text-muted)">${safe(activeState.name)} State Organization</span>
            </div>
            <p style="font-size:13px;line-height:1.55;margin:0;color:var(--text)">
              ${getFieldDirectorDispatch(activeState, game)}
            </p>
          </div>

          <!-- Proposal 4: 50-State Political Geography & Bellwether Counties -->
          ${(() => {
            const geoProfile = window.PartyChairData?.getStatePoliticalGeography ? window.PartyChairData.getStatePoliticalGeography(activeState.id) : null;
            if (!geoProfile) return '';
            return `
              <div class="v18-political-geography-card">
                <div class="v18-geo-header">
                  <span class="v18-geo-title">State Political Geography & Bellwether Counties</span>
                  <span class="v18-geo-coalitions">${safe(geoProfile.coalitions || '')}</span>
                </div>
                <p class="v18-geo-terrain">${safe(geoProfile.terrain || '')}</p>
                <div class="v18-bellwether-grid">
                  ${(geoProfile.bellwethers || []).map((b) => `
                    <div class="v18-bellwether-item">
                      <div class="v18-bellwether-name"><b>${safe(b.name)}</b> <span class="v18-bellwether-seat">${safe(b.seat ? `(${b.seat})` : '')}</span></div>
                      <div class="v18-bellwether-profile">${safe(b.profile || '')}</div>
                    </div>
                  `).join('')}
                </div>
              </div>`;
          })()}

          <div class="v07-roster-section">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <h3 style="margin:0">Sitting U.S. Senators & Governor (${filteredSenators.length + filteredGovernor.length})</h3>
              <div class="v13-bench-filters">
                <button type="button" class="button button-small ${sittingMembersFilter === 'all' ? 'button-gold' : ''}" data-bench-filter="all">All</button>
                <button type="button" class="button button-small ${sittingMembersFilter === 'rising-stars' ? 'button-gold' : ''}" data-bench-filter="rising-stars">Rising Stars</button>
                <button type="button" class="button button-small ${sittingMembersFilter === 'higher-office' ? 'button-gold' : ''}" data-bench-filter="higher-office">Higher Office ▲</button>
                <button type="button" class="button button-small ${sittingMembersFilter === 'party-elders' ? 'button-gold' : ''}" data-bench-filter="party-elders">Party Elders</button>
              </div>
            </div>
            <div class="v07-dossier-list">${[...filteredSenators, ...filteredGovernor].map(renderRosterMember).join('') || '<p class="quiet-note">No statewide records match this filter.</p>'}</div>
          </div>

          <div class="v07-roster-section">
            <h3 style="margin-top:14px">U.S. House Delegation (${filteredHouse.length} District${filteredHouse.length === 1 ? '' : 's'})</h3>
            <div class="v07-dossier-list v07-house-scroll">${filteredHouse.map(renderRosterMember).join('') || '<p class="quiet-note">No district records match this filter.</p>'}</div>
          </div>

          ${recruitPreview ? `<div class="v07-roster-section">
            <h3>${game?.year || 2028} State Recruit Prospect (${safe(sampleRaceId)})</h3>
            <div class="v07-recruit-preview">
              <div><b>${safe(recruitPreview.name)}</b> ${memberMetricsBadgesMarkup(recruitPreview, `<span class="v07-quality-badge">Avg Quality ${recruitPreview.quality}/10</span>`)}</div>
              <button type="button" class="button button-small" data-open-primary="${sampleRaceId}">View in Primary Endorsements →</button>
            </div>
          </div>` : ''}

          ${localChapterList.length ? `<details class="chapter-directory" style="margin-top:12px"><summary>Local Chapters & Youth Chapters in ${safe(activeState.name)} (${localChapterList.length})</summary><div class="v07-local-tags">${localChapterList.map((c) => `<span>${safe(c.name)} (${c.partyId === 'people' ? 'D' : 'R'})</span>`).join('')}</div></details>` : ''}
        </div>
      </div>
      `}
    </section>`;
}

/* ==========================================================================
   TAB 4: PARTY INFORMATION — STANDING, TRUST, NATIONAL ENVIRONMENT & FORECASTERS
   ========================================================================== */
function jointVictoryCompactsMarkup(game) {
  let compacts = [];
  if (Array.isArray(game.jointVictoryCompacts) && game.jointVictoryCompacts.length) {
    compacts = game.jointVictoryCompacts;
  } else if (Array.isArray(game.compacts) && game.compacts.length) {
    compacts = game.compacts;
  } else {
    // Populate baseline default compacts from Super PACs / National Steering Summit
    const pacs = game.superPacs || [];
    const fromPacs = pacs
      .filter((p) => p.demandStatus === 'accepted' || p.activeDemand?.status === 'accepted')
      .map((p) => ({
        id: `compact-${p.id}`,
        pacName: p.name,
        term: `${game?.year || 2028} Cycle · ${p.petIssueLabel || p.petIssue || 'Targeted'} Media Reserve`,
        reserve: `$${(p.poolMillions || p.pool || 8.0).toFixed(1)}M`,
        status: 'pending',
      }));
    if (fromPacs.length) {
      compacts = fromPacs;
    } else {
      compacts = [
        {
          id: 'compact-workers-first',
          pacName: 'Workers First Action Fund',
          term: '2028 Cycle · Rust Belt Media Reserve',
          reserve: '$6.0M',
          status: 'pending',
        },
        {
          id: 'compact-civic-future',
          pacName: 'Civic Future Steering Committee',
          term: '2028 Cycle · Independent Voter Outreach',
          reserve: '$4.5M',
          status: 'honored',
        },
      ];
      game.jointVictoryCompacts = compacts;
    }
  }

  return `
    <section class="panel section-panel v13-compacts-card">
      <div class="v13-compacts-header">
        <div>
          <div class="eyebrow">Strategic Super PAC Steering & Ad Reserves</div>
          <h3>Active Joint Victory Compacts</h3>
        </div>
        <span class="turnout-chip">${compacts.length} Active Agreement${compacts.length === 1 ? '' : 's'}</span>
      </div>
      <p style="font-size:12.5px;color:var(--text-muted);margin:0 0 12px;line-height:1.4">
        Formal joint fundraising and issue ad steering pacts negotiated between party leadership and aligned independent expenditure committees. Honoring agreed terms preserves donor goodwill; violating compact terms triggers capital strikes.
      </p>
      <div class="v13-compacts-list">
        ${compacts.map((c) => {
          const statusCls = (c.status || 'pending').toLowerCase();
          const statusLabel = statusCls === 'honored' ? 'Honored' : statusCls === 'violated' ? 'Violated' : 'Pending';
          return `
            <div class="v13-compact-row">
              <div class="v13-compact-info">
                <span class="v13-compact-name">${safe(c.pacName || c.name || 'Joint Steering Partner')}</span>
                <span class="v13-compact-term">${safe(c.term || `${game?.year || 2028} Cycle Agreement`)}</span>
              </div>
              <div class="v13-compact-meta">
                <span class="v13-compact-reserve">${safe(c.reserve || c.reserveAmount || '$0.0M')}</span>
                <span class="v13-compact-status ${statusCls}">${statusLabel}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}


const CABINET_AND_OPPOSITION_ROLES = [
  // Governing Administration Cabinet (4 Roles) - REQ-110
  { id: 'cabinet_state', label: 'Secretary of State', category: 'institutional', requiresPresidency: true, multiplier: 1.5, passiveDesc: '+3.0 Foreign policy authority, international alliance credibility, and national stature.' },
  { id: 'cabinet_treasury', label: 'Secretary of the Treasury', category: 'institutional', requiresPresidency: true, multiplier: 1.5, passiveDesc: '+$6M annual party fundraising yield and +2.0 economic policy credibility.' },
  { id: 'cabinet_ag', label: 'Attorney General', category: 'institutional', requiresPresidency: true, multiplier: 1.5, passiveDesc: '+2.5 Rule-of-law standing, civil rights protection, and anti-corruption deterrence.' },
  { id: 'cabinet_defense', label: 'Secretary of Defense', category: 'institutional', requiresPresidency: true, multiplier: 1.5, passiveDesc: '+3.0 Defense posture confidence and veteran/military community appeal.' },
  // Out-Party Chamber Opposition Leaders (3 Roles) - REQ-110
  { id: 'opposition_house', label: 'House Opposition Leader', category: 'institutional', requiredOffice: 'house', requiresOpposition: true, multiplier: 1.0, passiveDesc: 'High-visibility House counterweight to White House (+2.0 national media spotlight, +1.5% turnout mobilization across House districts).' },
  { id: 'opposition_senate', label: 'Senate Opposition Leader', category: 'institutional', requiredOffice: 'senate', requiresOpposition: true, multiplier: 1.0, passiveDesc: 'High-visibility Senate counterweight to White House (+2.0 national media spotlight, +1.5% turnout mobilization across Senate states).' },
  { id: 'opposition_gov', label: 'Gubernatorial Opposition Leader', category: 'institutional', requiredOffice: 'governor', requiresOpposition: true, multiplier: 1.0, passiveDesc: 'High-visibility Governors counterweight to White House (+2.0 national media spotlight, +1.5% turnout mobilization across gubernatorial battlegrounds).' },
];

function partyInfoTabMarkup() {
  const identity = playerIdentity();
  const isMajor = window.PartyChairEngine.isMajorParty
    ? window.PartyChairEngine.isMajorParty(game, 'player')
    : (V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(identity));

  const baseRoleDefs = V07?.LEADERSHIP_ROLES_SCHEMA || window.PartyChairData.LEADERSHIP_ROLES || [];
  const allRoleDefs = [...baseRoleDefs];
  CABINET_AND_OPPOSITION_ROLES.forEach((ar) => {
    if (!allRoleDefs.some((r) => r.id === ar.id)) allRoleDefs.push(ar);
  });

  const governingParty = game?.governingParty || game?.lastElection?.presidentialWinner || 'people';
  const holdsPresidency = governingParty === identity;

  // Build eligible candidate pools per office (REQ-127: No candidate truncation caps, all members included)
  const partySitting = (game.sittingMembers || []).filter((m) => m.party === identity);
  const benchMembers = [...(game.roster || []), ...MEMBERS.filter((m) => m.party === identity).map((m) => m.id)]
    .map((id) => memberById(id))
    .filter((m) => m && (m.party === identity || !m.party));
  const senators = partySitting.filter((m) => m.office === 'senate').sort((a, b) => (b.fame || 0) - (a.fame || 0));
  const reps = partySitting.filter((m) => m.office === 'house').sort((a, b) => (b.fame || 0) - (a.fame || 0));
  const govs = partySitting.filter((m) => m.office === 'governor').sort((a, b) => (b.fame || 0) - (a.fame || 0));
  const standoutLegs = (game.stateLegStandouts?.[identity] || []).map((s) => ({
    ...s,
    displayTitle: `[State Leg · ${s.state || s.stateId}]`
  }));
  const federalGovernorCount = partySitting.filter((m) => ['senate', 'house', 'governor', 'president'].includes(m.office)).length;
  const stateLegAdditions = (federalGovernorCount < 3) ? standoutLegs : [];
  const allPartyMembers = [...partySitting, ...benchMembers, ...stateLegAdditions]
    .filter((v, idx, arr) => arr.findIndex((x) => x.id === v.id) === idx)
    .sort((a, b) => (b.fame || 0) - (a.fame || 0) || (b.quality || 0) - (a.quality || 0));

  function isRoleAccessible(role) {
    if (role.category === 'faction' && role.partyId && role.partyId !== identity) return false;
    if (role.requiresPresidency) return holdsPresidency;
    if (role.requiresOpposition) {
      if (holdsPresidency) return false;
      const count = partySitting.filter((m) => m.office === role.requiredOffice).length;
      const rivalCount = (game.sittingMembers || []).filter((m) => m.office === role.requiredOffice && m.party !== identity && m.party !== governingParty).length;
      return count > 0 && count >= rivalCount;
    }
    if (V07?.isRoleUnlockedForParty) {
      return V07.isRoleUnlockedForParty(game, identity, role);
    }
    return true;
  }

  // REQ-109: Inaccessible roles hidden completely from hierarchy view
  const accessibleRoles = allRoleDefs.filter(isRoleAccessible);
  const filteredRoles = roleCategoryFilter === 'all'
    ? accessibleRoles
    : accessibleRoles.filter((r) => r.category === roleCategoryFilter || (roleCategoryFilter === 'party' && r.category === 'faction'));

  const currentRoles = game.leadershipRoles?.player || game.player?.leadershipRoles || {};
  const appointedIds = new Set(Object.values(currentRoles).filter(Boolean));
  const appointedNames = new Set([...appointedIds].map((id) => memberById(id)?.name).filter(Boolean));
  const snubbedHighFame = partySitting.filter((m) => (m.fame || 0) >= 75 && !appointedIds.has(m.id) && !appointedNames.has(m.name));

  const rolesMarkup = filteredRoles.map((role) => {
    const holderId = currentRoles[role.id];
    const holder = holderId ? memberById(holderId) : null;
    let pool = allPartyMembers;
    // REQ-127 & REQ-224: Chamber-Exclusive Scoping & Statehouse Farm Team
    if (role.requiredOffice === 'senate') pool = senators;
    else if (role.requiredOffice === 'house') pool = reps;
    else if (role.requiredOffice === 'governor') pool = govs;
    else if (role.id === 'stateLegCaucusChair') {
      pool = [...partySitting.filter((m) => m.office === 'stateLeg'), ...(game.stateLegStandouts?.[identity] || [])];
    }
    else if (role.id === 'president' || role.id === 'vicePresident' || role.id?.startsWith('cabinet_')) {
      pool = [...govs, ...senators, ...allPartyMembers];
    }

    // REQ-108: Faction Leader Candidate Dropdown Eligibility Filtering
    if (role.category === 'faction' && (role.factionId || role.factionName)) {
      const fId = role.factionId || role.id.replace('faction_', '');
      const fName = role.factionName || role.label;
      pool = pool.filter((m) =>
        m.factionId === fId ||
        m.faction === fId ||
        m.faction === fName ||
        m.wing === fName ||
        m.wing === fId
      );
    }

    return `<article class="v07-role-card ${holder ? 'filled' : 'vacant'}">
      <div class="v07-role-top">
        <div>
          <span class="eyebrow">${role.category === 'institutional' ? 'Category A · Institutional' : 'Category B · Party & Faction'}</span>
          <b>${safe(role.getLabel ? role.getLabel(partySitting.filter((m) => m.office === (role.requiredOffice || 'house')).length >= 218 || isMajor) : (role.label || role.title))}</b>
        </div>
        ${(role.multiplier || 1) >= 5 ? `<span class="v07-five-x-badge">5x IMPACT</span>` : role.isLocked ? `<span class="v07-mini-badge" style="background:var(--border);color:var(--gold)">Locked Office</span>` : role.allowOverlap ? `<span class="v07-mini-badge">Overlap Allowed</span>` : `<span class="v07-mini-badge">Officeholder</span>`}
      </div>
      <p>${safe(role.passiveDesc || role.passiveLabel || role.passiveEffect || '')}</p>
      ${holder ? `<div style="margin:4px 0">${politicianTraitsBadgesMarkup(holder)}</div>` : ''}
      ${role.id === 'president' || role.id === 'vicePresident' || role.isLocked
        ? `<div class="v07-role-assign" style="padding:4px 0">
            <span class="v07-rating-chip" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);color:var(--text);font-weight:600">
              🔒 Locked: ${safe(holder ? holder.name : 'Governing Administration')}
            </span>
          </div>`
        : `<div class="v07-role-assign">
            <select data-assign-role="${role.id}" aria-label="Assign ${safe(role.label || role.title)}">
              <option value="">— Vacant —</option>
              ${holder && !pool.some((p) => p.id === holder.id) && (holder.party === identity || (identity === 'player' && (!holder.party || holder.party === 'player'))) ? `<option value="${holder.id}" selected>${safe(holder.name)} (Fame ${Math.round(holder.fame || 50)})</option>` : ''}
              ${pool.length === 0 ? '<option value="" disabled>— No Eligible Party Members Available —</option>' : ''}
              ${pool.map((c) => {
                const traits = getPoliticianTraits(c);
                const traitsLabel = traits.length ? ` [${traits.slice(0, 2).join(', ')}]` : '';
                return `<option value="${c.id}" ${holder && (holder.id === c.id || holder.name === c.name) ? 'selected' : ''}>${c.displayTitle ? safe(c.displayTitle) + ' ' : ''}${safe(c.name)}${traitsLabel} · Fame ${Math.round(c.fame || 40)} · Q${c.quality || 6}</option>`;
              }).join('')}
            </select>
          </div>`}
    </article>`;
  }).join('');

  return `
    <div class="v07-forecast-layout">
      <!-- Structured Party Hierarchy -->
      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Structured Party Hierarchy</div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <h2 style="margin:0">Party Leadership Hierarchy</h2>
              ${institutionalStatusBadgeMarkup(game)}
              ${partyDoctrineBadgeMarkup(game)}
            </div>
          </div>
          <div class="v07-filter-tabs">
            <button type="button" data-role-filter="all" class="${roleCategoryFilter === 'all' ? 'selected' : ''}">All Accessible (${accessibleRoles.length})</button>
            <button type="button" data-role-filter="institutional" class="${roleCategoryFilter === 'institutional' ? 'selected' : ''}">Institutional (${accessibleRoles.filter(r => r.category === 'institutional').length})</button>
            <button type="button" data-role-filter="party" class="${roleCategoryFilter === 'party' ? 'selected' : ''}">Party & Factions (${accessibleRoles.filter(r => r.category !== 'institutional').length})</button>
          </div>
        </div>
        ${snubbedHighFame.length ? `<div class="v07-backlash-warning" style="margin-bottom:12px">⚠ High-Fame Ambition Warning: <b>${snubbedHighFame.length}</b> politician(s) with Fame ≥ 75 have no major leadership role (${snubbedHighFame.slice(0, 5).map((m) => `${safe(m.name)} [${Math.round(m.fame)}]`).join(', ')}${snubbedHighFame.length > 5 ? ', …' : ''}). Appoint them below to stop Sitting Member Happiness decay.</div>` : ''}
        <div class="v07-role-grid">${rolesMarkup}</div>
      </section>
      ${/* [v0.18.4 MEDIA-SHOCKS] */ window.MediaShocksSystem ? window.MediaShocksSystem.renderMediaBalanceBar(game) : ''}

      <!-- [v0.18.4 COALITION-POLITICS] Proposals #5 & #6 Panels -->
      ${window.CoalitionPoliticsSystem ? window.CoalitionPoliticsSystem.renderPrimaryRulesPanel(game) + window.CoalitionPoliticsSystem.renderPatronageGridPanel(game) : ''}

      <div class="main-grid">
        <div class="left-column">
          <!-- Election History & Records -->
          <section class="panel section-panel">
            <div class="section-heading">
              <div>
                <div class="eyebrow">Unified Election History Timeline</div>
                <h2>Election History & Records</h2>
              </div>
            </div>
            ${electionHistoryMarkup()}
            <div style="margin-top:14px;border-top:1px solid var(--line);padding-top:10px">
              <details open>
                <summary style="cursor:pointer;color:var(--gold);font-size:13.5px;font-weight:600">Chair Organizing Diary Log</summary>
                <div class="diary-list" style="margin-top:8px">${diaryMarkup()}</div>
              </details>
            </div>
          </section>
        </div>

        <aside class="right-column">
          
          <section class="panel section-panel">
            <div class="eyebrow">Unified Platform Profile</div>
            <h2>Current Platform Summary</h2>
            <div class="platform-list">${platformMarkup()}</div>
          </section>
          <section class="panel section-panel">
            <div class="eyebrow">Legislative Session · ${game.year}</div>
            <h2>State Policy Bills</h2>
            <div class="legislation-list">${legislationMarkup()}</div>
          </section>
        </aside>
      </div>
    </div>`;
}

function factionsTabMarkup() {
  const identity = playerIdentity();
  const catalog = (game?.factions && game.factions.length) ? game.factions : (window.PartyChairData?.FACTIONS_CATALOG || []);
  const stateMatrix = window.PartyChairData?.FACTION_STATE_MATRIX || {};
  const designations = game?.factionDesignations || (window.PartyChairEngine?.evaluateFactionTiers ? window.PartyChairEngine.evaluateFactionTiers(game) : {});
  const happinessMap = game?.factionHappiness || game?.factionStandings || {};
  const confidenceMap = game?.factionConfidence || {};
  const voterTotals = game?.voterModel?.factions || window.PartyChairData?.FACTION_NATIONAL_TOTALS || {};

  // Player party factions & metrics
  const partyFactions = catalog.filter((f) => f.partyId === identity);
  const totalPartyVoters = partyFactions.reduce((sum, f) => sum + Number(voterTotals[f.id] ?? voterTotals[f.name] ?? f.targetVoters ?? 0), 0);
  const avgH = partyFactions.length
    ? partyFactions.reduce((sum, f) => sum + Number(happinessMap[f.id] ?? happinessMap[f.name] ?? 60), 0) / partyFactions.length
    : 60;
  const grassrootsMult = game?.grassrootsMultiplier ?? (window.PartyChairEngine?.computeGrassrootsMultiplier ? window.PartyChairEngine.computeGrassrootsMultiplier(game) : round(0.50 + (avgH / 100) * 0.70, 3));
  const leadingFaction = partyFactions.find((f) => (designations[f.id] || f.status) === 'leading') || partyFactions[0];
  const turnoutDragActive = avgH < 45;

  // Filtered factions list
  let displayedFactions = catalog;
  if (factionCategoryFilter === 'player') {
    displayedFactions = partyFactions;
  } else if (factionCategoryFilter === 'people') {
    displayedFactions = catalog.filter((f) => f.partyId === 'people');
  } else if (factionCategoryFilter === 'heritage') {
    displayedFactions = catalog.filter((f) => f.partyId === 'heritage');
  } else if (factionCategoryFilter === 'independent') {
    displayedFactions = catalog.filter((f) => f.partyId === 'independent' || f.id.startsWith('swg_'));
  } else if (factionCategoryFilter === 'minor') {
    displayedFactions = catalog.filter((f) => !['people', 'heritage', 'independent'].includes(f.partyId) && !f.id.startsWith('swg_'));
  }

  // REQ-284: Nationwide aggregation or active state for 50-State Faction Inspector
  const isNationwide = factionInspectorState === 'nationwide';
  const activeState = isNationwide ? null : (STATES.find((s) => s.id === factionInspectorState) || STATES[0]);
  const stateFactions = isNationwide
    ? (game?.voterModel?.factions || window.PartyChairData?.FACTION_NATIONAL_TOTALS || {})
    : (game?.voterModel?.states?.[activeState.id]?.factions || stateMatrix[activeState.id] || {});

  const totalStateFactionVoters = isNationwide
    ? catalog.reduce((sum, f) => sum + Number(stateFactions[f.id] ?? stateFactions[f.name] ?? f.targetVoters ?? 0), 0)
    : catalog.reduce((sum, f) => sum + Number(stateFactions[f.id] ?? stateFactions[f.name] ?? 0), 0);

  // Active Coalition Compacts Widget Helper
  function activeCompactsWidgetMarkup() {
    const pacts = game?.activeCoalitionPacts || [];
    return `
      <section class="panel section-panel v15-compacts-widget" style="margin-top:14px">
        <div class="section-heading">
          <div>
            <div class="eyebrow" style="color:#38bdf8">Multi-Cycle Accords · Filtering Commitments</div>
            <h3>Active Coalition Compacts</h3>
          </div>
          <span class="v15-compacts-count">${pacts.length} Active Pact${pacts.length === 1 ? '' : 's'}</span>
        </div>
        ${pacts.length === 0 ? `<p class="quiet-note">No active multi-cycle coalition pacts.</p>` : `
          <div class="v15-compacts-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:10px;margin-top:10px">
            ${pacts.map((pact) => `
              <article class="v15-compact-card panel" style="background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.25);padding:12px;border-radius:6px">
                <div class="v15-compact-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                  <b style="font-size:14px;color:#f1f5f9">${safe(pact.factionName)}</b>
                  <span class="v15-badge badge-blue">Cycle ${6 - (pact.cyclesRemaining || 5)} of 5 (${pact.cyclesRemaining || 5} left)</span>
                </div>
                <div class="v15-compact-metrics" style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                  <span>Primary Candidate Filtering Quota:</span>
                  <b style="color:${pact.filtersAppliedThisCycle >= pact.targetFiltersPerCycle ? '#75c89a' : '#f59e0b'}">${pact.filtersAppliedThisCycle || 0} / ${pact.targetFiltersPerCycle || 1} Filtered</b>
                </div>
                <div class="meter"><i style="width:${Math.min(100, Math.round(((pact.filtersAppliedThisCycle || 0) / (pact.targetFiltersPerCycle || 1)) * 100))}%;--meter:#38bdf8"></i></div>
                <small style="color:var(--text-muted);font-size:11px;display:block;margin-top:6px">${pact.filtersAppliedThisCycle >= pact.targetFiltersPerCycle ? '✔ Cycle Quota Fulfilled' : '⚠ Primary filtering support required to avoid Betrayal Crisis'}</small>
              </article>
            `).join('')}
          </div>
        `}
      </section>
    `;
  }

  // Faction card generator helper
  function factionCardMarkup(f) {
    const tier = designations[f.id] || f.status || 'minor';
    const hVal = Math.round(Number(happinessMap[f.id] ?? happinessMap[f.name] ?? f.startingHappiness ?? 50));
    const cVal = Math.round(Number(confidenceMap[f.id] ?? confidenceMap[f.name] ?? 50));
    const natVoters = Number(voterTotals[f.id] ?? voterTotals[f.name] ?? f.targetVoters ?? 0);
    const partyName = f.partyId === 'people' ? 'Democratic' : f.partyId === 'heritage' ? 'Republican' : f.partyId === 'independent' ? 'Independent / Swing' : f.partyId === 'liberty' ? 'Libertarian' : f.partyId === 'green' ? 'Green' : f.partyId === 'constitution' ? 'Constitution' : f.partyId === 'socialist' ? 'Socialist' : (f.partyId === 'none' ? 'Unaffiliated' : 'Other');

    const tierBadgeClass = tier === 'leading' ? 'badge-gold' : tier === 'major' ? 'badge-blue' : tier === 'minor' ? 'badge-purple' : 'badge-dim';
    const tierLabel = tier === 'leading' ? '👑 Leading Faction' : tier === 'major' ? '★ Major Faction' : tier === 'minor' ? '◆ Minor Faction' : '· Fringe Faction';
    const typeLabel = f.type === 'racial' ? 'Racial Demographic' : 'Ideological Wing';
    const isUnaffiliated = f.partyId === 'none';
    const isIndependentPool = f.partyId === 'none' || f.partyId === 'independent' || f.partyId === 'unaffiliated';
    const isUltimatum = f.ultimatumTurnsRemaining !== null && f.ultimatumTurnsRemaining !== undefined;
    const isInOtherParty = f.partyId !== identity && !isIndependentPool;
    const isPlayerOwnFaction = f.partyId === identity;
    // [v0.18.4 FACTION-ERA-FIXES]
    const isAnchorFaction = window.FactionEraStability?.isEffectiveIroncladAnchor ? window.FactionEraStability.isEffectiveIroncladAnchor(game, f) : (f.id === 'dem_liberal_establishment' || f.id === 'gop_maga' || Boolean(f.isIroncladAnchor));
    const isOrganizing = game?.phase === 'organizing';
    const courtshipGoodwill = Math.round(Number(game?.factionCourtship?.[f.id]?.[identity] || 0));
    const canConveneSummit = isIndependentPool && isOrganizing;
    const canOpenCourtship = isInOtherParty && isOrganizing && hVal < 50;
    const canDriveWedge = isInOtherParty && isOrganizing && hVal < 60;
    const canSubsidizeDissidents = isInOtherParty && isOrganizing && isUltimatum;
    const canExpelFaction = isPlayerOwnFaction && isOrganizing && !isAnchorFaction;

    return `
      <article class="v15-faction-card panel ${tier === 'leading' ? 'is-leading' : ''}">
        <div class="v15-faction-head">
          <div class="v15-faction-title">
            <span class="v15-badge ${tierBadgeClass}">${tierLabel}</span>
            <span class="v15-badge badge-outline">${typeLabel}</span>
            ${window.PartyChairData?.getFactionCohesionLabel ? `<span class="v15-badge badge-outline" style="border-color:rgba(131,168,213,0.4);color:#83a8d5">${safe(window.PartyChairData.getFactionCohesionLabel(f))}</span>` : ''}
            ${isUnaffiliated ? `<span class="v15-badge v15-unaffiliated-badge">★ Unaffiliated</span><span class="v15-badge badge-gold" style="margin-left:4px">⚡ Actively Courting Coalitions</span>` : ''}
            ${isUltimatum ? `<span class="v15-badge v15-ultimatum-badge">⚠️ ULTIMATUM (${f.ultimatumTurnsRemaining} Turn${f.ultimatumTurnsRemaining === 1 ? '' : 's'} Left)</span>` : ''}
            <h3>${safe(f.name)}</h3>
            <div class="v15-party-sub"><span class="dot dot-${f.partyId}"></span> ${partyName} · <b>${natVoters.toLocaleString()}</b> voters (${(natVoters / 1_000_000).toFixed(2)}M)</div>
            <div class="v15-friction-tag" style="margin-top:6px;font-size:11.5px;color:${(f.frictionIndex || 0) >= 80 ? '#e8887e' : (f.frictionIndex || 0) >= 50 ? '#e2bd70' : 'var(--text-muted)'}">Friction Index: <b>${f.frictionIndex || 0} / 100</b>${(f.frictionIndex || 0) >= 100 ? ' (Breach Level)' : ''}</div>
            ${(() => {
              const auditRec = game?.factionPowerAudit?.auditRecords?.[f.id];
              const narr = window.PartyChairEngine?.getFactionPowerNarrative ? window.PartyChairEngine.getFactionPowerNarrative(auditRec) : null;
              return narr ? `<div style="margin-top:4px;font-size:11.5px;color:var(--text-muted);font-style:italic">${safe(narr)}</div>` : '';
            })()}
          </div>
        </div>

        <div class="v15-meters-row">
          <div class="v15-meter-group">
            <div class="v15-meter-label">
              <span>Standing / Happiness</span>
              <b style="color:${hVal < 45 ? '#e8887e' : hVal < 60 ? '#e2bd70' : '#75c89a'}">${hVal} <small>/ 100</small></b>
            </div>
            <div class="meter"><i style="width:${hVal}%;--meter:${hVal < 45 ? '#e8887e' : hVal < 60 ? '#e2bd70' : '#75c89a'}"></i></div>
            <small class="v15-meter-caption">${hVal < 45 ? 'Restless (Drag Risk)' : hVal < 60 ? 'Watchful Partner' : 'Firm Coalition Support'}</small>
          </div>
          <div class="v15-meter-group">
            <div class="v15-meter-label">
              <span>Internal Confidence</span>
              <b style="color:#83a8d5">${cVal} <small>/ 100</small></b>
            </div>
            <div class="meter"><i style="width:${cVal}%;--meter:#83a8d5"></i></div>
            <small class="v15-meter-caption">Modified by Elders, Autopsies & Support</small>
          </div>
        </div>

        <div class="v15-sliders-row">
          <span class="v15-slider-chip">Social: <b>${f.sliders?.social ?? 5.0}</b></span>
          <span class="v15-slider-chip">Economic: <b>${f.sliders?.economic ?? 5.0}</b></span>
          <span class="v15-slider-chip">Governance: <b>${f.sliders?.governance ?? 5.0}</b></span>
        </div>

        <div class="v15-issues-row">
          <span class="eyebrow" style="font-size:11px">2 Key Issues:</span>
          ${(f.keyIssues || []).map((issue) => `<span class="v15-issue-tag">${safe(issue)}</span>`).join('')}
        </div>

        ${(() => {
          const extSet = window.PartyChairEngine?.EXTREMIST_FACTION_IDS;
          const isExt = Boolean(f.isExtremist || (extSet instanceof Set ? extSet.has(f.id) : Array.isArray(extSet) ? extSet.includes(f.id) : false));
          return isExt ? '<div style="margin:6px 0 4px"><span class="v15-extremist-badge" title="Extremist: Cannot be a member of any party with more than 5 million members of other factions.">Extremist</span></div>' : '';
        })()}
        <p class="v15-faction-flavor">${safe(f.flavor || '')}</p>

        ${courtshipGoodwill > 0 ? `<div style="margin-top:6px;font-size:11.5px;color:#75c89a">Coalition Goodwill: <b>${courtshipGoodwill} / 100</b></div>` : ''}
        ${canConveneSummit ? `
          <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
            <button type="button" class="v15-summit-btn" data-summit-faction="${f.id}" style="flex:1;padding:8px 10px;background:rgba(226,189,112,0.15);border:1px solid var(--gold);color:var(--gold);border-radius:4px;font-weight:700;cursor:pointer">
              🏛️ Convene Coalition Summit (1 Action)
            </button>
            <button type="button" class="button button-small" data-faction-op="court-independent-faction" data-faction-id="${f.id}" style="padding:8px 10px">
              🤝 Court Independent ($1.5M)
            </button>
          </div>
        ` : isInOtherParty && isOrganizing ? `
          <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
            ${canOpenCourtship ? `
              <button type="button" class="v15-summit-btn" data-faction-op="open-courtship-dialogue" data-faction-id="${f.id}" style="flex:1;padding:8px 10px;background:rgba(56,189,248,0.15);border:1px solid #38bdf8;color:#7dd3fc;border-radius:4px;font-weight:700;cursor:pointer">
                🤝 Open Courtship Dialogue (1 Action)
              </button>
            ` : `
              <button type="button" class="v15-summit-btn" disabled title="Loyal to parent party (Happiness >= 50). Must be destabilized or alienated first." style="flex:1;padding:8px 10px;opacity:0.45;cursor:not-allowed">
                🤝 Open Courtship Dialogue (1 Action)
              </button>
            `}
            ${canDriveWedge ? `
              <button type="button" class="button button-small" data-faction-op="drive-coalition-wedge" data-faction-id="${f.id}" style="padding:8px 10px">
                🪓 Drive Wedge ($2M)
              </button>
            ` : ''}
            ${canSubsidizeDissidents ? `
              <button type="button" class="button button-small" data-faction-op="subsidize-dissident-caucus" data-faction-id="${f.id}" style="padding:8px 10px;border-color:#e8887e;color:#e8887e">
                💰 Subsidize Dissidents ($3M)
              </button>
            ` : ''}
          </div>
        ` : canExpelFaction ? `
          <button type="button" class="button button-small" data-faction-op="expel-faction" data-faction-id="${f.id}" style="margin-top:10px;width:100%;padding:7px 10px;border-color:rgba(232,136,126,0.5);color:#e8887e">
            🚫 Expel Faction to Independent (1 Action)
          </button>
        ` : ''}
      </article>
    `;
  }

  // State Inspector Table Generator
  function stateGroupTableMarkup(title, partyCode, factionsList) {
    const listWithVoters = factionsList.map((f) => {
      const v = Number(stateFactions[f.id] ?? stateFactions[f.name] ?? 0);
      const pct = totalStateFactionVoters > 0 ? ((v / totalStateFactionVoters) * 100).toFixed(2) : '0.00';
      return { ...f, voters: v, pct };
    }).sort((a, b) => b.voters - a.voters);

    const groupSum = listWithVoters.reduce((s, f) => s + f.voters, 0);
    const groupPct = totalStateFactionVoters > 0 ? ((groupSum / totalStateFactionVoters) * 100).toFixed(1) : '0.0';

    return `
      <div class="v15-state-group-card panel">
        <div class="v15-state-group-head">
          <div>
            <h4>${title}</h4>
            <span class="v15-state-group-sub">${groupSum.toLocaleString()} voters · ${groupPct}% of State</span>
          </div>
        </div>
        <table class="v15-state-table">
          <thead>
            <tr>
              <th>Faction</th>
              <th>Type</th>
              <th style="text-align:right">Voters</th>
              <th style="text-align:right">Share</th>
            </tr>
          </thead>
          <tbody>
            ${listWithVoters.map((f) => `
              <tr>
                <td><b>${safe(f.name)}</b></td>
                <td><small class="v15-mini-tag">${f.type === 'racial' ? 'Racial' : 'Ideology'}</small></td>
                <td style="text-align:right;font-family:monospace;font-weight:600">${f.voters.toLocaleString()}</td>
                <td style="text-align:right;font-family:monospace;color:var(--muted)">${f.pct}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  const demFactions = catalog.filter((f) => f.partyId === 'people');
  const gopFactions = catalog.filter((f) => f.partyId === 'heritage');
  const swingFactions = catalog.filter((f) => f.partyId === 'independent' || f.id.startsWith('swg_'));
  const minorFactions = catalog.filter((f) => !['people', 'heritage', 'independent'].includes(f.partyId) && !f.id.startsWith('swg_'));

  return `
    <div class="v15-factions-layout">
      <!-- Top Executive Overview & KPI Strip -->
      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">National Coalition Dynamics · Standing & Confidence</div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <h2 style="margin:0">National Faction Health & 51-State Allocations</h2>
              ${partyDoctrineBadgeMarkup(game)}
            </div>
          </div>
        </div>

        ${(() => {
          const pendingDemands = (game.coalitionDemands || []).filter((d) => d.status === 'pending');
          if (!pendingDemands.length) return '';
          return pendingDemands.map((demand) => `
            <div class="v07-backlash-warning" style="margin-bottom:12px;border:1px solid rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);padding:12px 14px;border-radius:8px;font-size:13px">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
                <div>
                  <div class="eyebrow" style="color:#f59e0b;font-size:11px">Binding Coalition Demand</div>
                  <h4 style="margin:2px 0 4px;font-size:15px">${safe(demand.title)}</h4>
                  <span style="display:block;font-size:12px;color:var(--text)">${safe(demand.narrative)}</span>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button type="button" class="button button-small button-gold" data-demand-action="accept" data-demand-id="${safe(demand.id)}">Accept Demand</button>
                  ${demand.type === 'rival_quarantine' ? `<button type="button" class="button button-small" data-demand-action="fake_compliance" data-demand-id="${safe(demand.id)}">Public Repudiation Only</button>` : ''}
                  <button type="button" class="button button-small" data-demand-action="refuse" data-demand-id="${safe(demand.id)}">Refuse</button>
                </div>
              </div>
            </div>
          `).join('');
        })()}

        ${(() => {
          const activeThreats = (game.factionBoltThreats || []).filter((t) => t.status !== 'appeased' && t.status !== 'expelled');
          if (!activeThreats.length) return '';
          const canAct = game.campaign?.active ? (game.campaign.weeklyActionsLeft || 0) > 0 : (game.actionsLeft || 0) > 0;
          return activeThreats.map((threat) => `
            <div class="v07-backlash-warning" style="margin-bottom:12px;border:1px solid hsl(7 62% 59%);background:hsla(7, 62%, 59%, 0.14);padding:12px 14px;border-radius:8px;color:#ffd0c8;font-size:13px">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
                <div>
                  <b>⚠️ BOLT ULTIMATUM — ${safe(threat.factionName || threat.factionId)} (${threat.turnsRemaining ?? 2} Turn${(threat.turnsRemaining ?? 2) === 1 ? '' : 's'} Remaining)</b>
                  <span style="display:block;font-size:12px;margin-top:3px;color:var(--text)">${safe(threat.reason || 'Dissident faction leaders are threatening to break away and launch a rival splinter ticket.')}</span>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button type="button" class="button button-small button-gold" data-appease-faction="${safe(threat.factionId)}" data-appease-mode="concession" ${!canAct || (game.treasury || 0) < 3 ? 'disabled' : ''}>Funding Concession ($3M · 1 Act)</button>
                  <button type="button" class="button button-small" data-appease-faction="${safe(threat.factionId)}" data-appease-mode="platform" ${!canAct ? 'disabled' : ''}>Platform Compromise (1 Act)</button>
                </div>
              </div>
            </div>
          `).join('');
        })()}

        ${(game.activeSplinters || []).length ? `
          <div class="v07-backlash-warning" style="margin-bottom:12px;border:1px solid hsl(32 48% 48%);background:hsla(32, 48%, 48%, 0.12);padding:10px 14px;border-radius:8px;font-size:12.5px">
            <b>⚡ Active Splinter Fourth Party:</b> ${(game.activeSplinters || []).map((sp) => `<b>${safe(sp.name || sp.id)}</b>`).join(', ')} — Actively competing for disaffected base voters across battleground states.
          </div>
        ` : ''}

        ${turnoutDragActive ? `
          <div class="v07-backlash-warning" style="margin-bottom:14px;border:1px solid #e8887e;background:rgba(232,136,126,0.12);padding:10px 14px;border-radius:6px;color:#ff9e94;font-size:13px">
            ⚠ <b>TURNOUT DRAG ACTIVE:</b> Average Faction Happiness for ${safe(game.player.name)} is <b>${avgH.toFixed(1)}/100</b> (below the 45 threshold). A nationwide base turnout penalty of <b>−9.0%</b> is currently applied across all federal and state races.
          </div>
        ` : ''}

        <div class="v15-kpi-grid">
          <div class="v15-kpi-card">
            <small>Party Average Happiness</small>
            <b style="color:${avgH < 45 ? '#e8887e' : avgH < 60 ? '#e2bd70' : '#75c89a'}">${avgH.toFixed(1)} <small>/ 100</small></b>
            <div class="meter"><i style="width:${avgH}%;--meter:${avgH < 45 ? '#e8887e' : avgH < 60 ? '#e2bd70' : '#75c89a'}"></i></div>
            <span>${turnoutDragActive ? '⚠ Below 45 threshold (−9% turnout drag)' : 'Above threshold (Full turnout readiness)'}</span>
          </div>

          <div class="v15-kpi-card">
            <small>Grassroots Multiplier</small>
            <b style="color:var(--gold)">${grassrootsMult.toFixed(3)}x</b>
            <div class="meter"><i style="width:${Math.min(100, grassrootsMult * 65)}%;--meter:var(--gold)"></i></div>
            <span>Scales volunteer energy and field outreach with coalition morale</span>
          </div>

          <div class="v15-kpi-card">
            <small>Dominant Leading Faction</small>
            <b style="color:#d9e2ea;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${safe(leadingFaction?.name || 'Liberal Establishment')}</b>
            <span class="v15-badge badge-gold" style="width:fit-content;margin-top:6px">👑 Leading Faction</span>
            <span>Dictates national platform posture & party identity</span>
          </div>

          <div class="v15-kpi-card">
            <small>Registered Party Voters</small>
            <b>${(totalPartyVoters / 1_000_000).toFixed(2)}M <small>/ 155M</small></b>
            <div class="meter"><i style="width:${(totalPartyVoters / 155_000_000) * 100}%;--meter:var(--blue)"></i></div>
            <span>${partyFactions.length} internal factions registered across all 50 states + DC</span>
          </div>
        </div>
      </section>

      <!-- Active Coalition Compacts Widget -->
      ${activeCompactsWidgetMarkup()}

      <!-- Demographic Voting-Bloc Representation Disclaimer -->
      <div class="v15-demographic-disclaimer">
        <span class="v15-disclaimer-title">ℹ Demographic Faction Scope:</span>
        Explicit racial, ethnic, and religious factions (such as <i>Black Voters</i>, <i>Mormons</i>, <i>Cubans</i>, or <i>Traditional Latin Voters</i>) do not encompass all members of those demographic groups. Rather, they represent distinctive, politically organized voting blocs that mobilize and vote with high electoral cohesion within the party system.
      </div>

      <!-- National Factions Catalog Filter & Grid -->
      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">National Coalition Directory</div>
            <h2>${catalog.length} National Political Factions</h2>
          </div>
          <div class="v07-filter-tabs">
            <button type="button" data-faction-filter="player" class="${factionCategoryFilter === 'player' ? 'selected' : ''}">${safe(game.player.name)} (${partyFactions.length})</button>
            <button type="button" data-faction-filter="all" class="${factionCategoryFilter === 'all' ? 'selected' : ''}">All Factions (${catalog.length})</button>
            <button type="button" data-faction-filter="people" class="${factionCategoryFilter === 'people' ? 'selected' : ''}">Democratic (${demFactions.length})</button>
            <button type="button" data-faction-filter="heritage" class="${factionCategoryFilter === 'heritage' ? 'selected' : ''}">Republican (${gopFactions.length})</button>
            <button type="button" data-faction-filter="independent" class="${factionCategoryFilter === 'independent' ? 'selected' : ''}">Independent / Swing (${swingFactions.length})</button>
            <button type="button" data-faction-filter="minor" class="${factionCategoryFilter === 'minor' ? 'selected' : ''}">Minor / Unaffiliated (${minorFactions.length})</button>
          </div>
        </div>

        <div class="v15-factions-grid">
          ${displayedFactions.map(factionCardMarkup).join('')}
        </div>
      </section>

      <!-- 51-Jurisdiction State Faction Inspector -->
      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">State-Level Micro-Demographics</div>
            <h2>51-Jurisdiction State Faction Inspector</h2>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <label for="faction-state-select" style="font-size:13px;color:var(--muted)">50-State Dropdown:</label>
            <select id="faction-state-select" class="v07-select" style="padding:6px 12px;background:var(--panel2);border:1px solid var(--line);border-radius:6px;color:var(--text);font-weight:600">
              <option value="nationwide" ${isNationwide ? 'selected' : ''}>Nationwide</option>
              ${STATES.map((s) => `<option value="${s.id}" ${!isNationwide && activeState && s.id === activeState.id ? 'selected' : ''}>${safe(s.name)} (${s.id}) · ${s.ev || s.electoralVotes || 3} EV</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="v15-state-summary-strip">
          <div class="v15-state-stat">
            <small>${isNationwide ? 'Inspected Scope' : 'Inspected State'}</small>
            <b>${isNationwide ? 'Nationwide' : `${safe(activeState.name)} (${activeState.id})`}</b>
            <span>${isNationwide ? 'All Regions · 50 States + DC' : `${activeState.ev || activeState.electoralVotes || 3} Electoral Votes · ${activeState.region || 'Nation'} Region`}</span>
          </div>
          <div class="v15-state-stat">
            <small>${isNationwide ? 'Represented Voters Nationwide' : 'Represented Voters in State'}</small>
            <b>${totalStateFactionVoters.toLocaleString()}</b>
            <span>${isNationwide ? 'The full national electorate, allocated to factions' : 'The full state electorate, allocated to factions'}</span>
          </div>
          <div class="v15-state-stat">
            <small>Reconciliation Variance</small>
            <b style="color:#75c89a">0 Variance (0.000%)</b>
            <span class="v15-cert-badge-small">✔ Strictly Reconciled to Baseline</span>
          </div>
        </div>

        <div class="v15-state-grid">
          ${stateGroupTableMarkup('Democratic Party Factions', 'people', demFactions)}
          ${stateGroupTableMarkup('Republican Party Factions', 'heritage', gopFactions)}
          ${stateGroupTableMarkup('Independent / Swing Factions', 'independent', swingFactions)}
          ${stateGroupTableMarkup('Minor & Unaffiliated Factions', 'minor', minorFactions)}
        </div>
      </section>
    </div>
  `;
}

function summitModalMarkup() {
  if (!summitModalOpen || !summitModalFactionId) return '';
  const f = (game?.factions || window.PartyChairData?.FACTIONS_CATALOG || []).find((x) => x.id === summitModalFactionId);
  if (!f) return '';
  const demands = (window.PartyChairEngine?.generateMergerCoalitionDemands || window.PartyChairEngine?.generateCoalitionDemands) ? (window.PartyChairEngine.generateMergerCoalitionDemands || window.PartyChairEngine.generateCoalitionDemands)(game, f.id) : null;
  if (!demands) return '';

  const natVoters = Number(game?.voterModel?.factions?.[f.id] ?? f.targetVoters ?? 1000000);
  const canAfford = (game?.organizingActionsRemaining ?? 20) >= 1;
  const hasHostile = demands.cohabitationPreview?.some((p) => p.impact === 'hostile');

  return `
    <div class="v08-modal-overlay v15-summit-backdrop" id="summit-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="summit-dialog-title">
      <div class="v08-modal-content v15-summit-dialog" style="max-width:700px;max-height:90vh;overflow-y:auto;background:hsl(226, 21%, 12%);border:1px solid hsl(220, 14%, 26%);border-radius:8px;padding:24px;color:#f1f5f9">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px">
          <div>
            <div class="eyebrow" style="color:var(--gold)">Coalition Summit & Negotiation · Organizing Phase</div>
            <h2 id="summit-dialog-title" style="font-family:'Iowan Old Style',Palatino,Georgia,serif;color:hsl(42, 25%, 92%);font-size:24px;margin:4px 0 6px">${safe(f.name)}</h2>
            <div style="font-size:12.5px;color:var(--text-muted)">${f.type === 'racial' ? 'Racial Demographic' : 'Ideological Wing'} · <b>${natVoters.toLocaleString()}</b> voters (${(natVoters / 1_000_000).toFixed(2)}M) · Tier: <b style="text-transform:uppercase;color:#38bdf8">${demands.tier}</b></div>
          </div>
          <button type="button" class="button button-gold" data-close-summit="true">✕</button>
        </div>

        ${demands.blocked ? `
          <div class="v15-blocked-warning" style="background:rgba(232, 136, 126, 0.15);border:1px solid #e8887e;padding:16px;border-radius:6px;margin:16px 0">
            <h4 style="color:#ff9e94;margin:0 0 6px;font-size:15px">⛔ Summit Blocked: 5.0M-Member Invariant</h4>
            <p style="color:#f87171;font-size:13px;margin:0">${safe(demands.blockedReason)}</p>
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button type="button" class="button button-gold" data-close-summit="true">Dismiss Summit</button>
          </div>
        ` : `
          <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(226,189,112,0.08);border:1px solid rgba(226,189,112,0.25);padding:10px 14px;border-radius:6px;margin-bottom:16px;font-size:13px">
            <span>Summit Cost: <b style="color:var(--gold)">1 Organizing Action</b></span>
            <span>Actions Available: <b style="color:${canAfford ? '#75c89a' : '#e8887e'}">${game?.organizingActionsRemaining ?? 20} / 20</b></span>
          </div>

          <div style="margin-bottom:18px">
            <h3 style="font-size:14px;color:hsl(42, 25%, 92%);margin:0 0 10px;font-weight:700">📜 Non-Negotiable Charter of Demands (${demands.tier.toUpperCase()} TIER)</h3>
            ${demands.sliderShifts.length === 0 ? `<p style="font-size:12.5px;color:var(--text-muted);margin:0 0 10px">No platform adjustments demanded (existing platform coordinates already align with faction ideals).</p>` : `
              <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px">
                ${demands.sliderShifts.map((s) => `
                  <div style="background:rgba(26,188,156,0.08);border:1px solid #1abc9c;border-radius:6px;padding:10px 12px">
                    <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px">
                      <span style="color:#5eead4;font-weight:700">Platform Adjustment: ${safe(s.issue)}</span>
                      <span style="color:#5eead4">Faction Ideal: ${s.target} / 10</span>
                    </div>
                    <div style="font-size:12px;color:var(--text)">Shift party stance from <b>${s.from}</b> ➔ <b style="color:#5eead4">${s.to}</b> (${demands.tier === 'major' ? 'Exact Ideal Snap' : '±1 Shift'})</div>
                  </div>
                `).join('')}
              </div>
            `}

            ${demands.filteringPact && demands.filteringPact.targetFiltersPerCycle > 0 ? `
              <div style="background:rgba(56,189,248,0.08);border:1px solid #38bdf8;border-radius:6px;padding:10px 12px;margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px">
                  <span style="color:#38bdf8;font-weight:700">Multi-Cycle Primary Filtering Pact</span>
                  <span style="color:#38bdf8">${demands.filteringPact.cyclesRemaining} Cycles Commitment</span>
                </div>
                <div style="font-size:12px;color:var(--text)">Pledge to deploy Filtering Support to at least <b style="color:#38bdf8">${demands.filteringPact.targetFiltersPerCycle} primary candidate${demands.filteringPact.targetFiltersPerCycle > 1 ? 's' : ''}/cycle</b> from this faction.</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Fulfilling quota awards +5 Standing & +2 Confidence per cycle. Quota breach triggers Betrayal Crisis (-30 Standing, -10 Confidence, 1-turn ultimatum).</div>
              </div>
            ` : ''}
          </div>

          <div style="margin-bottom:18px">
            <h3 style="font-size:14px;color:hsl(42, 25%, 92%);margin:0 0 10px;font-weight:700">⚖️ Ideological Cohabitation Preview & Morale Impact</h3>
            ${demands.cohabitationPreview.length === 0 ? `<p style="font-size:12.5px;color:var(--text-muted);margin:0">No existing member factions in party.</p>` : `
              <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:8px;margin-bottom:8px">
                ${demands.cohabitationPreview.map((p) => `
                  <div style="background:rgba(255,255,255,0.03);border:1px solid ${p.impact === 'compatible' ? 'rgba(117,200,154,0.3)' : p.impact === 'strain' ? 'rgba(226,189,112,0.3)' : 'rgba(232,136,126,0.3)'};padding:8px 10px;border-radius:5px">
                    <b style="font-size:12px;color:#f1f5f9;display:block">${safe(p.factionName)}</b>
                    <small style="font-size:11px;color:${p.impact === 'compatible' ? '#75c89a' : p.impact === 'strain' ? '#e2bd70' : '#e8887e'}">
                      ${p.happinessDelta > 0 ? `+${p.happinessDelta}` : p.happinessDelta} Standing (${p.impact === 'compatible' ? 'Compatible' : p.impact === 'strain' ? 'Strain' : 'Hostile'}, Dist ${p.distance})
                    </small>
                  </div>
                `).join('')}
              </div>
            `}
            ${hasHostile ? `
              <div style="background:rgba(232,136,126,0.15);border:1px solid #e8887e;border-radius:6px;padding:10px 12px;margin-top:8px;font-size:12px;color:#ff9e94">
                ⚠️ <b>Hostile Cohabitation Warning:</b> Severe ideological distance (> 4.0) with existing factions will trigger activist volunteer backlash, imposing an immediate temporary <b>-3.0% turnout drag</b> for this cycle!
              </div>
            ` : ''}
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px">
            <button type="button" class="button" data-close-summit="true" style="padding:8px 16px">Cancel</button>
            <button type="button" class="button button-gold" data-sign-accord="${f.id}" ${canAfford ? '' : 'disabled style="opacity:0.5;cursor:not-allowed"'} style="padding:8px 18px;font-weight:800">
              📜 Sign Coalition Accord (1 Action)
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

function forecastTabMarkup() {
  const identity = playerIdentity();
  const isMajor = window.PartyChairEngine.isMajorParty
    ? window.PartyChairEngine.isMajorParty(game, 'player')
    : (V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(identity));
  const trust = V07 ? V07.normalizeTrust(game.trust || game.player?.trust) : { supporters: 65, independents: 50, opponents: 25 };
  const trustFx = V07 ? V07.calculateTrustEffects(trust) : { turnoutMultiplier: 1.0, independentMarginLift: 0, transferAppealWeight: 0.24 };
  const happiness = Math.round(game.sittingMemberHappiness ?? 70);

  return `
    <div class="v07-forecast-layout">
      <!-- Public & Coalition Trust Panel -->
      <section class="panel section-panel">
        <div class="section-heading">
          <div><div class="eyebrow">Tri-Partisan Electorate Trust System</div><h2>Public & Coalition Trust</h2></div>
          <span class="turnout-chip">${isMajor ? 'Major Party (≥20% Last Pres. Vote)' : 'Minor / Emerging Party (<20% Threshold)'}</span>
        </div>
        <div class="v07-trust-grid">
          <div class="v07-trust-card">
            <small>Base Party Supporters</small>
            <b>${trust.supporters.toFixed(1)} <small>/ 100</small></b>
            <div class="meter"><i style="width:${trust.supporters}%;--meter:#3478c8"></i></div>
            <span>Turnout Multiplier: <b>${trustFx.turnoutMultiplier.toFixed(2)}x</b> across all states</span>
          </div>
          <div class="v07-trust-card">
            <small>Independents</small>
            <b>${trust.independents.toFixed(1)} <small>/ 100</small></b>
            <div class="meter"><i style="width:${trust.independents}%;--meter:hsl(174 36% 56%)"></i></div>
            <span>Swing Persuasion Lift: <b>${trustFx.independentMarginLift >= 0 ? '+' : ''}${trustFx.independentMarginLift.toFixed(2)} pts</b></span>
          </div>
          <div class="v07-trust-card">
            <small>Opponent Party Members</small>
            <b>${trust.opponents.toFixed(1)} <small>/ 100</small></b>
            <div class="meter"><i style="width:${trust.opponents}%;--meter:hsl(32 48% 48%)"></i></div>
            <span>RCV / 3-Party Transfer Weight: <b>${(trustFx.transferAppealWeight * 100).toFixed(1)}%</b></span>
          </div>
          <div class="v07-trust-card">
            <small>Sitting Member Happiness</small>
            <b>${happiness} <small>/ 100</small></b>
            <div class="meter"><i style="width:${happiness}%;--meter:${happiness < 45 ? '#e8887e' : '#75c89a'}"></i></div>
            <span>Modifies legislative passage, fundraising, and incumbent turnout</span>
          </div>
        </div>
      </section>

      <!-- Unified Party Approval Tracker -->
      <section class="panel section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">National Standing Across All Parties</div>
            <h2>Unified Party Approval Tracker</h2>
          </div>
          <span class="turnout-chip">All Active Political Organizations</span>
        </div>
        <div class="v09-approval-grid">
          ${unifiedPartyApprovalEntries().map((entry) => `
            <article class="v09-approval-card">
              <div class="v09-approval-head">
                <b style="color:${entry.color}">${safe(entry.name)}</b>
                <span>${entry.approval.toFixed(1)}%</span>
              </div>
              <div class="meter"><i style="width:${Math.min(100, entry.approval)}%;--meter:${entry.color}"></i></div>
              <small style="color:var(--muted);font-size:12px">${safe(entry.statusLabel)}</small>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Active Joint Victory Compacts Widget -->
      ${jointVictoryCompactsMarkup(game)}

      <!-- 20-Point National Environment & Satirical Forecasters -->
      <div class="main-grid">
        <div class="left-column">
          ${wavePendulumMarkup()}
          ${forecastersMarkup()}
        </div>

        <aside class="right-column">
          <!-- Electorate Affiliation Model -->
          <section class="panel section-panel">
            <div class="eyebrow">155.00 Million Represented Voters</div>
            <h2>Electorate Affiliation Model</h2>
            <div class="cohort-list">${memberCohortsMarkup()}</div>
            <p class="poll-foot">Every modeled voter metric scales to 155.00 million represented U.S. voters across states and congressional districts.</p>
          </section>
        </aside>
      </div>
    </div>`;
}

function diaryMarkup() {
  const entries = [...(game.yearLog || []).map((entry) => ({ year: entry.year, line: entry.action })), ...(game.retirements || []).map((entry) => ({ year: entry.year, line: `${entry.name} retired from the leadership roster.` }))]
    .slice(-8)
    .reverse();
  if (!entries.length) return `<p class="quiet-note">Your organizing record will appear here as you make decisions.</p>`;
  return entries.map((entry) => `<div class="diary-entry"><span>${entry.turn ? `T${entry.turn}` : `T${(game.chairTurn || 0) + 1}`}</span><p>${safe(entry.line)}</p></div>`).join('');
}

/* ==========================================================================
   FULLSCREEN APP SHELL & ATMOSPHERIC WIRE
   ========================================================================== */
function getMorningWireHeadline(game) {
  const year = game.year || 2028;
  const isCamp = Boolean(game.campaign?.active);
  const actionsRem = game.organizingActionsRemaining ?? 20;
  const phaseLabel = isCamp ? `CAMPAIGN MONTH ${game.campaign.month || game.campaign.week}/5 · ${game.campaign.monthlyActionsLeft ?? game.campaign.weeklyActionsLeft ?? 8}/${game.campaign.maxMonthlyActions || 8} ACTIONS REMAINING` : `ORGANIZING PHASE · ${actionsRem} ACTIONS REMAINING`;
  const presLead = (game.phase === 'complete')
    ? (game.lastElection?.presidential ? `${game.lastElection.presidential.winnerName || 'Winner'} claims Electoral College victory` : 'Election concluded')
    : (game.forecasters?.cooked?.rating || 'Ossoff-Vance battleground remains tight across Sunbelt and Rust Belt');

  const isMinor = !['people', 'heritage'].includes(game.player?.baseTemplateId);
  const customOrMinor = game.player?.custom
    ? `${safe(game.player.name)} surges as autonomous third force in ${game?.year || 2028} landscape`
    : (isMinor ? `${safe(game.player.name)} mounts nationwide 50-state ballot access offensive` : null);
  const story = customOrMinor || presLead;

  // [v0.18.4 MEDIA-SHOCKS]
  const msChyron = window.MediaShocksSystem?.getChyronOverride ? window.MediaShocksSystem.getChyronOverride(game) : null;
  const dynamicChyron = msChyron || (window.PartyChairData?.getDynamicCableNewsChyron ? window.PartyChairData.getDynamicCableNewsChyron(game) : null);
  const tagLabel = dynamicChyron ? dynamicChyron.categoryLabel : 'THE BELTWAY RUNDOWN';
  const headlineText = dynamicChyron ? dynamicChyron.headline : `DISPATCH: ${story} — Field directors report high voter interest as ballot retention deadlines approach.`;

  return `<div class="wire-inner" style="display:flex;align-items:center;gap:12px;padding:8px 16px;background:rgba(226,189,112,0.08);border-bottom:1px solid rgba(226,189,112,0.25);font-size:12.5px">
    <span class="wire-tag" style="background:var(--gold);color:#0b1118;font-weight:800;font-size:10.5px;padding:2px 8px;border-radius:3px;letter-spacing:0.05em">${safe(tagLabel)}</span>
    <span class="wire-time" style="color:var(--text-muted);font-weight:600;font-size:11.5px">${year} · ${phaseLabel}</span>
    <span class="wire-headline" style="flex:1;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>ALERT:</b> ${safe(headlineText)}</span>
    <span class="wire-pulse" style="color:var(--gold);font-weight:700;font-size:11px;letter-spacing:0.05em;display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#55bf78"></span>LIVE WIRE</span>
  </div>`;
}

/* ==========================================================================
   VERSION 0.15.9 DECISION MODALS (REFORM, KINGMAKER, CONTINGENT, DOCTRINE, DEBATE)
   ========================================================================== */

// Temporary playtest prototype pending TBD-02 State Ballot Initiative / Legislative Reform mechanics
function electoralReformModalMarkup() {
  const evt = game?.pendingElectoralReformEvent;
  if (!evt) return '';
  const stateList = (evt.stateNames && evt.stateNames.length) ? evt.stateNames : (evt.states || []);
  return `
    <div class="v08-modal-overlay" id="electoral-reform-modal-overlay">
      <div class="v159-modal-dialog v159-modal-compact" role="dialog" aria-modal="true" aria-labelledby="reform-modal-title">
        <div class="eyebrow" style="color:#7ee3d4">Inter-Cycle Electoral Reform Dispatch · ${evt.year || game.year}</div>
        <h2 id="reform-modal-title">${safe(evt.title || 'State Electoral Reform Enacted')}</h2>
        <p style="font-size:13.5px;line-height:1.55;color:var(--text);margin:8px 0 12px">
          ${safe(evt.summary || 'Voters enacted new electoral rules ahead of the upcoming cycle.')}
        </p>
        <div class="v159-modal-summary-strip">
          <span class="v159-sys-badge ${evt.reformType === 'approval' ? 'sys-approval' : evt.reformType === 'proportional' ? 'sys-prop' : 'sys-rcv'}">${safe(evt.reformLabel || 'Electoral Reform')}</span>
          ${stateList.map((st) => `<span class="v159-tally-chip">${safe(st)}</span>`).join('')}
        </div>
        <div class="v159-modal-footer">
          <button type="button" class="button button-gold" id="btn-dismiss-electoral-reform">Continue</button>
        </div>
      </div>
    </div>
  `;
}

function kingmakerModalMarkup() {
  const list = game?.pendingKingmakerNegotiations;
  if (!Array.isArray(list) || !list.length) return '';
  const neg = list[0];
  const playerKey = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
  const demSeats = Number(neg.seats?.people || 0);
  const repSeats = Number(neg.seats?.heritage || 0);
  const playerSeats = Number(neg.playerSeats || neg.seats?.[playerKey] || 0);
  const isFederal = neg.chamber === 'house' || neg.chamber === 'senate';

  // Ensure selected partner is valid for this negotiation
  if (!kingmakerSelectedPartner
    || (kingmakerSelectedPartner === 'people' && !neg.canKingmakeDem)
    || (kingmakerSelectedPartner === 'heritage' && !neg.canKingmakeRep)) {
    kingmakerSelectedPartner = neg.canKingmakeDem ? 'people' : neg.canKingmakeRep ? 'heritage' : 'independent';
  }
  const activePartner = kingmakerSelectedPartner;
  const activeConcession = kingmakerSelectedConcession || 'gavels';

  const distantMajor = ['green', 'socialist'].includes(playerKey)
    ? 'heritage'
    : ['liberty', 'constitution'].includes(playerKey)
      ? 'people'
      : null;

  const propEligibleStates = STATES.filter((s) => (s.ev || 3) >= 7);
  const reformStateOptions = kingmakerReformType === 'proportional' ? propEligibleStates : STATES;
  const st1 = neg.stateId || (reformStateOptions.some((s) => s.id === kingmakerTargetState1) ? kingmakerTargetState1 : (reformStateOptions[0]?.id || 'PA'));
  const st2 = reformStateOptions.some((s) => s.id === kingmakerTargetState2 && s.id !== st1) ? kingmakerTargetState2 : (reformStateOptions.find((s) => s.id !== st1)?.id || 'CO');

  return `
    <div class="v08-modal-overlay" id="kingmaker-modal-overlay">
      <div class="v159-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="kingmaker-modal-title">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div class="eyebrow" style="color:var(--gold)">Hung Chamber · Balance of Power Bargaining</div>
          ${list.length > 1 ? `<span class="turnout-chip">Chamber 1 of ${list.length} Pending</span>` : ''}
        </div>
        <h2 id="kingmaker-modal-title">Kingmaker Caucus: ${safe(neg.chamberLabel)}</h2>
        <p style="font-size:13.5px;line-height:1.5;color:var(--muted);margin:6px 0 0">
          Neither major party cleared the ${neg.majorityNeeded}-seat majority threshold. Your ${playerSeats}-seat caucus holds the decisive votes to organize the chamber under a Confidence-and-Supply agreement.
        </p>

        <div class="v159-modal-summary-strip">
          <span class="v159-tally-chip" style="border-color:#3478c8;color:#7fb4f2">Democrats: ${demSeats}</span>
          <span class="v159-tally-chip" style="border-color:#c9474e;color:#f49499">Republicans: ${repSeats}</span>
          <span class="v159-tally-chip" style="border-color:${game.player.color};color:var(--gold)">${safe(game.player.name)}: ${playerSeats}</span>
          <span class="v159-tally-chip">Majority Needed: ${neg.majorityNeeded}</span>
        </div>

        <div class="eyebrow" style="margin-top:10px">1. Choose Coalition Partner</div>
        <div class="v159-option-grid">
          <button type="button" class="v159-option-card ${activePartner === 'people' ? 'selected' : ''}" data-kingmaker-partner="people" ${neg.canKingmakeDem ? '' : 'disabled'}>
            <b>Back Democratic Leadership</b>
            <small>${neg.canKingmakeDem ? `Combined ${demSeats + playerSeats} seats (${neg.majorityNeeded} needed).` : 'Insufficient combined seats for majority.'}${distantMajor === 'people' && neg.canKingmakeDem ? ' ⚠ Expect fierce backlash from purist base factions.' : ''}</small>
          </button>
          <button type="button" class="v159-option-card ${activePartner === 'heritage' ? 'selected' : ''}" data-kingmaker-partner="heritage" ${neg.canKingmakeRep ? '' : 'disabled'}>
            <b>Back Republican Leadership</b>
            <small>${neg.canKingmakeRep ? `Combined ${repSeats + playerSeats} seats (${neg.majorityNeeded} needed).` : 'Insufficient combined seats for majority.'}${distantMajor === 'heritage' && neg.canKingmakeRep ? ' ⚠ Expect fierce backlash from purist base factions.' : ''}</small>
          </button>
          <button type="button" class="v159-option-card ${activePartner === 'independent' ? 'selected' : ''}" data-kingmaker-partner="independent">
            <b>Remain Independent</b>
            <small>Refuse to prop up either major party. Energizes loyal grassroots activists without extracting legislative concessions.</small>
          </button>
        </div>

        ${activePartner !== 'independent' ? `
          ${activePartner === distantMajor ? `
            <div class="v159-warning-callout">
              ⚠ <b>Coalition Backlash Warning:</b> Crossing the aisle to back an ideologically distant major party will trigger sharp outrage among your founding purist wing.
            </div>
          ` : ''}

          <div class="eyebrow" style="margin-top:10px">2. Demand Confidence-and-Supply Concession</div>
          <div class="v159-option-grid">
            <button type="button" class="v159-option-card ${activeConcession === 'gavels' ? 'selected' : ''}" data-kingmaker-concession="gavels">
              <b>Committee Gavels</b>
              <small>Elevate caucus lawmakers to committee chairmanships — boosting personal stature, faction confidence, and Independent credibility.</small>
            </button>
            <button type="button" class="v159-option-card ${activeConcession === 'electoral_reform' ? 'selected' : ''}" data-kingmaker-concession="electoral_reform">
              <b>Electoral Reform & Ballot Access</b>
              <small>Enact anti-spoiler voting rules (RCV, Approval, or Proportional) and automatic ballot access in ${isFederal ? '2 target states' : safe(neg.stateName || 'this state')}.</small>
            </button>
            <button type="button" class="v159-option-card ${activeConcession === 'stronghold_funding' ? 'selected' : ''}" data-kingmaker-concession="stronghold_funding">
              <b>Stronghold State Funding</b>
              <small>Direct organizational grants (+$${isFederal ? '8.0' : '3.0'}M treasury) and voter registration drives into core stronghold states.</small>
            </button>
          </div>

          ${activeConcession === 'electoral_reform' ? `
            <div class="v159-inline-select-row">
              <div style="flex:1;min-width:160px">
                <label for="kingmaker-reform-type">Reform System</label>
                <select id="kingmaker-reform-type">
                  <option value="rcv" ${kingmakerReformType === 'rcv' ? 'selected' : ''}>Ranked-Choice Voting (RCV)</option>
                  <option value="approval" ${kingmakerReformType === 'approval' ? 'selected' : ''}>Approval Voting</option>
                  <option value="proportional" ${kingmakerReformType === 'proportional' ? 'selected' : ''}>Proportional House & State Leg (5+ Seat States)</option>
                </select>
              </div>
              ${isFederal ? `
                <div style="flex:1;min-width:150px">
                  <label for="kingmaker-state-1">Target State 1</label>
                  <select id="kingmaker-state-1">
                    ${reformStateOptions.map((s) => `<option value="${s.id}" ${s.id === st1 ? 'selected' : ''}>${safe(s.name)} (${s.id})</option>`).join('')}
                  </select>
                </div>
                <div style="flex:1;min-width:150px">
                  <label for="kingmaker-state-2">Target State 2</label>
                  <select id="kingmaker-state-2">
                    ${reformStateOptions.map((s) => `<option value="${s.id}" ${s.id === st2 ? 'selected' : ''}>${safe(s.name)} (${s.id})</option>`).join('')}
                  </select>
                </div>
              ` : `
                <div style="flex:1;min-width:150px">
                  <label>Target State</label>
                  <div style="padding:7px 10px;background:hsl(226 21% 14%);border-radius:6px;font-size:12.5px;color:var(--gold);font-weight:700">${safe(neg.stateName || neg.stateId)}</div>
                </div>
              `}
            </div>
          ` : ''}
        ` : ''}

        <div class="v159-modal-footer">
          <button type="button" class="button button-gold" id="btn-confirm-kingmaker"
            data-chamber="${safe(neg.chamber)}"
            data-state="${safe(neg.stateId || '')}">
            ${activePartner === 'independent' ? 'Confirm Independent Stance' : 'Sign Confidence-and-Supply Accord'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function contingentElectionModalMarkup() {
  const pend = game?.pendingContingentElection;
  if (!pend || pend.resolved) return '';
  const evByParty = pend.evByParty || {};
  const delTotals = pend.houseDelegationTally?.totals || {};
  const playerKey = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
  const labelFor = (pid) => pid === 'people' ? 'Democratic'
    : pid === 'heritage' ? 'Republican'
    : pid === playerKey ? (game.player?.name || 'Your Party')
    : (PARTY_ARCHETYPES.find((p) => p.id === pid)?.name || pid);

  const topThree = (pend.topThreeParties && pend.topThreeParties.length)
    ? pend.topThreeParties
    : Object.entries(evByParty).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([partyId, ev]) => ({ partyId, ev }));

  const endorseChoices = ['people', 'heritage'];
  if (!endorseChoices.includes(playerKey) && topThree.some((t) => t.partyId === playerKey)) {
    endorseChoices.push(playerKey);
  }
  if (!endorseChoices.includes(contingentEndorseParty)) {
    contingentEndorseParty = 'people';
  }

  return `
    <div class="v08-modal-overlay" id="contingent-election-modal-overlay">
      <div class="v159-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="contingent-modal-title">
        <div class="eyebrow" style="color:hsl(7 62% 66%)">Constitutional Crisis · 12th Amendment Contingent Election (${pend.year || game.year})</div>
        <h2 id="contingent-modal-title">Electoral College Deadlock — House Delegation Brokering</h2>
        <p style="font-size:13.5px;line-height:1.5;color:var(--muted);margin:6px 0 0">
          No presidential ticket secured the constitutional majority of 270 electoral votes. Under the 12th Amendment, the newly elected U.S. House of Representatives votes by <b>state delegation</b> (1 vote per state; <b>26 state delegations</b> required to elect the President).
        </p>

        <div class="v159-modal-summary-strip" style="flex-direction:column;gap:8px">
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
            <span style="font-size:11.5px;font-weight:700;color:var(--gold);text-transform:uppercase;min-width:130px">Electoral College:</span>
            ${topThree.map((t) => `<span class="v159-tally-chip">${safe(labelFor(t.partyId))}: ${t.ev} EV</span>`).join('')}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
            <span style="font-size:11.5px;font-weight:700;color:#7ee3d4;text-transform:uppercase;min-width:130px">House Delegations:</span>
            <span class="v159-tally-chip" style="border-color:#3478c8;color:#7fb4f2">Dem: ${delTotals.people || 0}</span>
            <span class="v159-tally-chip" style="border-color:#c9474e;color:#f49499">Rep: ${delTotals.heritage || 0}</span>
            ${!['people', 'heritage'].includes(playerKey) ? `<span class="v159-tally-chip" style="border-color:${game.player.color};color:var(--gold)">${safe(game.player.name)}: ${delTotals[playerKey] || 0}</span>` : ''}
            <span class="v159-tally-chip">Tied / Split: ${delTotals.tied || 0}</span>
          </div>
        </div>

        <div class="eyebrow" style="margin-top:10px">1. Broker Presidential Endorsement in House Delegations</div>
        <div class="v159-option-grid">
          ${endorseChoices.map((pid) => `
            <button type="button" class="v159-option-card ${contingentEndorseParty === pid ? 'selected' : ''}" data-contingent-endorse="${safe(pid)}">
              <b>Back ${safe(labelFor(pid))} Ticket</b>
              <small>${evByParty[pid] || 0} Electoral Votes · ${delTotals[pid] || 0} House State Delegations</small>
            </button>
          `).join('')}
        </div>

        <div class="eyebrow" style="margin-top:10px">2. Extract Constitutional Concession</div>
        <div class="v159-option-grid">
          <button type="button" class="v159-option-card ${contingentConcession === 'cabinet' ? 'selected' : ''}" data-contingent-concession="cabinet">
            <b>Federal Cabinet Appointment</b>
            <small>Secure a premier Cabinet seat for your party's leadership inside the incoming administration.</small>
          </button>
          <button type="button" class="v159-option-card ${contingentConcession === 'platform' ? 'selected' : ''}" data-contingent-concession="platform">
            <b>Binding Platform Planks</b>
            <small>Bind the incoming White House to adopt 3 core policy planks from your coalition manifesto.</small>
          </button>
          <button type="button" class="v159-option-card ${contingentConcession === 'electoral_reform' ? 'selected' : ''}" data-contingent-concession="electoral_reform">
            <b>Multi-State Electoral Reform</b>
            <small>Enact RCV, Approval, or Proportional voting reforms across 4 battleground states.</small>
          </button>
        </div>

        ${contingentConcession === 'cabinet' ? `
          <div class="v159-inline-select-row">
            <div style="flex:1">
              <label for="contingent-cabinet-select">Designated Cabinet Portfolio</label>
              <select id="contingent-cabinet-select" style="width:100%">
                <option value="cabinet_state" ${contingentCabinetRole === 'cabinet_state' ? 'selected' : ''}>Secretary of State (Foreign Policy & Stature)</option>
                <option value="cabinet_treasury" ${contingentCabinetRole === 'cabinet_treasury' ? 'selected' : ''}>Secretary of the Treasury (Fundraising & Economic Authority)</option>
                <option value="cabinet_defense" ${contingentCabinetRole === 'cabinet_defense' ? 'selected' : ''}>Secretary of Defense (National Security & Defense Posture)</option>
                <option value="cabinet_ag" ${contingentCabinetRole === 'cabinet_ag' ? 'selected' : ''}>Attorney General (Rule of Law & Anti-Corruption)</option>
              </select>
            </div>
          </div>
        ` : contingentConcession === 'electoral_reform' ? `
          <div class="v159-inline-select-row">
            <div style="flex:1">
              <label for="contingent-reform-select">Constitutional Reform Package (4 States)</label>
              <select id="contingent-reform-select" style="width:100%">
                <option value="rcv" ${contingentReformType === 'rcv' ? 'selected' : ''}>Ranked-Choice Voting across 4 States</option>
                <option value="approval" ${contingentReformType === 'approval' ? 'selected' : ''}>Approval Voting across 4 States</option>
                <option value="proportional" ${contingentReformType === 'proportional' ? 'selected' : ''}>Proportional House & State Legislatures across 4 Eligible States</option>
              </select>
            </div>
          </div>
        ` : ''}

        <div class="v159-modal-footer">
          <button type="button" class="button button-gold" id="btn-confirm-contingent-election">Cast Decisive Delegation Vote & Certify President</button>
        </div>
      </div>
    </div>
  `;
}

function identityCrisisModalMarkup() {
  const ic = game?.identityCrisis;
  if (!ic || !ic.triggered || ic.resolved) return '';
  const nonFoundPct = Math.round((ic.nonFoundingShare || 0) * 100);
  const votersM = ((ic.totalPartyVoters || 0) / 1_000_000).toFixed(2);
  return `
    <div class="v08-modal-overlay" id="identity-crisis-modal-overlay">
      <div class="v159-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="doctrine-modal-title">
        <div class="eyebrow" style="color:var(--gold)">Historic Turning Point · Big-Tent Inflection Point</div>
        <h2 id="doctrine-modal-title">The Ideological Crossroads of ${safe(game.player.name)}</h2>
        <p style="font-size:13.5px;line-height:1.55;color:var(--muted);margin:6px 0 0">
          Your movement has outgrown its original ideological cradle${votersM > 0 ? ` (${votersM}M affiliated voters${nonFoundPct > 0 ? `, with ${nonFoundPct}% drawn from newly recruited swing wings` : ''})` : ''}. Founding activists and pragmatic newcomers are pulling the party in opposite directions. As Party Chair, you must establish your party's permanent governing doctrine.
        </p>

        <div class="v159-doctrine-grid">
          <div class="v159-doctrine-card path-big-tent">
            <div>
              <div class="eyebrow" style="color:#7ee3d4">Path A · Institutional Governing Coalition</div>
              <h3>Moderate & Professionalize</h3>
              <ul class="v159-doctrine-list">
                <li>Unlocks national institutional donor networks and fundraising scale.</li>
                <li>Sharply reduces internal coalition cohabitation drag across diverse wings.</li>
                <li>Substantially boosts Independent persuasion and suburban credibility.</li>
              </ul>
              <div class="v159-warning-callout">
                ⚠ <b>"Sellout" Backlash Risk:</b> Founding purist vanguard activists will suffer an immediate morale shock and issue a 2-turn ultimatum before bolting to form a rival Splinter Fourth Party.
              </div>
            </div>
            <button type="button" class="button button-gold" style="width:100%" data-resolve-doctrine="big_tent">
              🏛️ Adopt Big-Tent Moderation
            </button>
          </div>

          <div class="v159-doctrine-card path-vanguard">
            <div>
              <div class="eyebrow" style="color:#f4a498">Path B · Movement Purity & Grassroots Power</div>
              <h3>Stay Pure / Populist Vanguard</h3>
              <ul class="v159-doctrine-list">
                <li>Delivers a permanent surge in Base Supporter trust and election-day turnout.</li>
                <li>Amplifies grassroots organizing energy and volunteer intensity.</li>
                <li>Keeps founding ideological activists firmly united behind leadership.</li>
              </ul>
              <div class="v159-warning-callout" style="border-color:hsl(32 48% 48%);background:hsla(32, 48%, 48%, 0.12);color:#f3d08b">
                ⚖ <b>Electoral Trade-off:</b> Imposes a lasting ceiling on suburban centrist appeal and keeps institutional megadonors at arm's length.
              </div>
            </div>
            <button type="button" class="button" style="width:100%;border-color:hsl(7 62% 59%);color:#f4a498" data-resolve-doctrine="vanguard">
              🔥 Commit to Populist Vanguard
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function ascensionGauntletModalMarkup() {
  const modal = game?.pendingAscensionGauntletModal;
  if (!modal) return '';
  return `
    <div class="v07-modal-overlay" role="dialog" aria-modal="true" aria-label="${safe(modal.title || 'Crossing into the Fringe')}">
      <div class="v07-modal-card v164-gauntlet-modal">
        <div class="eyebrow">Institutional Breakthrough</div>
        <h2>${safe(modal.title || 'Crossing into the Fringe')}</h2>
        <p class="v164-gauntlet-headline"><b>${safe(modal.headline || 'Movement Breaks Through Political Isolation')}</b></p>
        <p>${safe(modal.body || 'Your movement has broken out of total public isolation and shed its pariah stigma, earning recognition as an active fringe party.')}</p>
        <div class="v07-modal-actions">
          <button type="button" class="button button-gold" data-dismiss-gauntlet-modal>Continue to Dashboard</button>
        </div>
      </div>
    </div>`;
}

function debateStageModalMarkup() {
  const evt = game?.pendingDebateStageEvent;
  if (!evt) return '';
  return `
    <div class="v08-modal-overlay" id="debate-stage-modal-overlay">
      <div class="v159-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="debate-modal-title">
        <div class="eyebrow" style="color:var(--gold)">National Media Blackout Shattered · Contender Milestone</div>
        <h2 id="debate-modal-title">${safe(evt.title || 'The National Debate Stage')}</h2>
        <p style="font-size:14px;line-height:1.55;color:var(--text);margin:8px 0 14px">
          ${safe(evt.body || 'Crossing 15% in national polling forces a third podium onto the prime-time debate stage. Choose your prime-time strategy:')}
        </p>
        <div class="v159-option-grid">
          ${(evt.choices || []).map((c, idx) => `
            <button type="button" class="v159-option-card" data-resolve-debate-choice="${idx}">
              <b>${safe(c.label)}</b>
              <small>${safe(c.effect || '')}</small>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Version 0.16.1: Cluster A Presidential Primaries & Convention UI Functions
   ========================================================================== */

function renderPresidentialDelegateTrackerMarkup(game) {
  if (!game || !game.presidentialPrimaries || !game.presidentialPrimaries.active) return '';
  const pp = game.presidentialPrimaries;
  const playerParty = playerIdentity();
  const field = pp.primaryFieldByParty?.[playerParty] || [];
  if (field.length === 0) return '';

  const totalDel = 3979;
  const clinchTarget = 2000;
  const waveLabel = pp.wave === 1
    ? 'Wave 1: Early States'
    : pp.wave === 2
      ? 'Wave 2: Super Tuesday'
      : pp.stage === 'convention'
        ? 'Nominating Convention'
        : 'Wave 3: Late Battlegrounds';

  const segmentsHtml = field.map((c, idx) => {
    const del = c.delegates || 0;
    const pct = ((del / totalDel) * 100).toFixed(2);
    const colors = ['#38bdf8', '#fbbf24', '#34d399', '#f472b6', '#a78bfa'];
    const segColor = colors[idx % colors.length];
    if (del <= 0) return '';
    return `<div class="delegate-progress-segment" style="width: ${pct}%; background: ${segColor};" title="${safe(c.name)}: ${del.toLocaleString()} delegates (${pct}%)">
      ${del > 120 ? safe(c.name.split(' ').slice(-1)[0]) : ''}
    </div>`;
  }).join('');

  const candidateCardsHtml = field.map((c) => {
    const del = c.delegates || 0;
    const isClinched = del >= clinchTarget;
    const gap = Math.max(0, clinchTarget - del);
    const statusLabel = isClinched
      ? 'Clinched Majority'
      : c.status === 'withdrawn'
        ? 'Suspended Campaign'
        : c.id === pp.backedCandidateId
          ? 'Backed by Chair'
          : 'Active Contender';

    return `
      <div class="delegate-candidate-card ${isClinched ? 'presumptive-nominee' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b class="delegate-cand-name">${safe(c.name)}</b>
          <span style="font-size:10px; color:${c.status === 'withdrawn' ? '#94a3b8' : isClinched ? '#facc15' : '#38bdf8'}; font-weight:700;">${statusLabel}</span>
        </div>
        <div class="delegate-cand-meta">
          <span>${safe((c.office || 'Governor').toUpperCase())} · ${safe(c.stateId || 'US')}</span>
          ${c.momentum ? `<span style="color:${c.momentum > 0 ? '#34d399' : '#f87171'}; font-weight:600;">${c.momentum > 0 ? '+' : ''}${c.momentum.toFixed(1)} Momentum</span>` : ''}
        </div>
        <div class="delegate-cand-count">${del.toLocaleString()} <span style="font-size:11px; font-weight:500; color:#94a3b8;">pledged delegates</span></div>
        <div class="delegate-cand-clinch-gap">${isClinched ? '<b style="color:#facc15;">★ Nomination Majority Reached</b>' : `${gap.toLocaleString()} delegates to clinch`}</div>
      </div>`;
  }).join('');

  return `
    <section class="presidential-delegate-tracker">
      <div class="delegate-tracker-header">
        <div class="delegate-tracker-title">
          <span>${game.year || 2032} Presidential Nominating Primaries · ${waveLabel}</span>
        </div>
        <span class="delegate-tracker-clinch-badge">Majority Line: 2,000 Pledged Delegates</span>
      </div>
      <div class="delegate-progress-bar-container">
        <div class="delegate-majority-marker"></div>
        <div class="delegate-majority-marker-label">2,000 Line</div>
        ${segmentsHtml}
      </div>
      <div class="delegate-candidate-cards">
        ${candidateCardsHtml}
      </div>
    </section>`;
}

function presidentialPrimaryGauntletMarkup(game) {
  if (!game || !game.presidentialPrimaries || !game.presidentialPrimaries.active) return '';
  const pp = game.presidentialPrimaries;
  const playerParty = playerIdentity();
  const field = pp.primaryFieldByParty?.[playerParty] || [];
  const activeCandidates = field.filter((c) => c.status === 'active');
  const wave = pp.wave || 1;
  const waveTitle = wave === 1
    ? 'Wave 1: Early Momentum States (IA, NH, NV, SC — 186 Delegates)'
    : wave === 2
      ? 'Wave 2: Super Tuesday Sweep (15 States — 1,645 Delegates)'
      : 'Wave 3: Late Consolidation Battlegrounds (32 States — 2,148 Delegates)';

  const nextBtnLabel = wave === 1
    ? 'Advance to Super Tuesday →'
    : wave === 2
      ? 'Advance to Late Battleground States →'
      : 'Enter National Nominating Convention →';

  return `
    <section class="panel section-panel presidential-gauntlet-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Presidential Nominating Primary Gauntlet · Wave ${wave} of 3</div>
          <h2>${waveTitle}</h2>
        </div>
        <span class="gauntlet-wave-badge">Primary Phase</span>
      </div>
      <p class="section-intro">
        Pledged delegates are awarded proportionally among candidates crossing the 15.0% viability threshold in each state. Manage lane consolidation, committee resources, and early momentum before the National Nominating Convention.
      </p>

      <div style="margin-top: 14px; background: #070d18; border: 1px solid #1e2d42; border-radius: 8px; padding: 14px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Chair Primary Strategy Actions</h4>
        ${pp.chairStrategyUsed
          ? `<p style="font-size: 12px; color: #94a3b8; margin: 0;"><i>Chair leadership action deployed for this wave. Further strategic interventions unlock in the next wave or at the convention.</i></p>`
          : `<div class="gauntlet-strategy-actions">
              <button type="button" class="button" data-pres-strategy="neutrality">
                <b>Institutional Neutrality</b> · <small>+6 Faction Harmony</small>
              </button>
              ${activeCandidates[0] ? `
              <button type="button" class="button" data-pres-strategy="back_candidate" data-candidate-id="${activeCandidates[0].id}" ${(game.treasury || 0) < 3.0 ? 'disabled' : ''}>
                <b>Deploy Committee Warchest</b> · <small>$3.0M for +5.0% Wave Lift to Frontrunner</small>
              </button>` : ''}
              ${activeCandidates.length > 2 && activeCandidates[activeCandidates.length - 1] ? `
              <button type="button" class="button" data-pres-strategy="broker_lane" data-candidate-id="${activeCandidates[activeCandidates.length - 1].id}" ${game.actionsLeft <= 0 ? 'disabled' : ''}>
                <b>Broker Lane Consolidation</b> · <small>Rival Drops Out & Endorses</small>
              </button>` : ''}
            </div>`}
      </div>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button type="button" class="button button-gold" id="btn-advance-pres-wave">
          ${nextBtnLabel}
        </button>
      </div>
    </section>`;
}

function stepAsideDilemmaModalMarkup(game) {
  if (!game?.presidentialPrimaries?.incumbentVulnerable || game.presidentialPrimaries.incumbentSteppedAside || game.presidentialPrimaries.incumbentContestChosen || (game.presidentialApproval ?? 44) >= 40) {
    return '';
  }

  return `
    <div class="v08-modal-overlay">
      <div class="v08-modal-content era-realignment-modal" style="max-width: 720px;">
        <div class="eyebrow">Urgent Leadership Dilemma · Incumbent Renomination Crisis</div>
        <h2>The Incumbent Renomination Crisis</h2>
        <p style="margin: 12px 0 16px 0; line-height: 1.5; color: #cbd5e1;">
          With the President's approval ratings severely depressed (${Math.round(game.presidentialApproval ?? 38)}%) and factional unrest boiling over across key party bases, leadership must determine whether to defend the incumbent or orchestrate a graceful step-aside before primary ballot filing closes.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px;">
          <div style="background: #1e293b; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px;">
            <h3 style="color: #60a5fa; margin: 0 0 8px 0; font-size: 15px;">Option A: Pressure Incumbent to Step Aside</h3>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.45; margin: 0 0 14px 0;">
              The President gracefully declines re-election. Avoids an agonizing primary civil war, reduces governing fatigue drag by 60%, and opens the nomination to a dynamic open-seat field.
            </p>
            <button type="button" class="button button-gold" id="btn-step-aside-confirm">Orchestrate Graceful Step-Aside →</button>
          </div>
          <div style="background: #1e293b; border: 1px solid #ef4444; border-radius: 8px; padding: 16px;">
            <h3 style="color: #f87171; margin: 0 0 8px 0; font-size: 15px;">Option B: Stand by the Incumbent</h3>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.45; margin: 0 0 14px 0;">
              The President enters the arena to battle challengers. Risks a bruised general election candidacy and burns defensive committee spending.
            </p>
            <button type="button" class="button" id="btn-stand-by-confirm">Stand by the Incumbent →</button>
          </div>
        </div>
      </div>
    </div>`;
}

function nominatingConventionModalMarkup(game) {
  if (game?.presidentialPrimaries?.stage !== 'convention') return '';
  const pp = game.presidentialPrimaries;
  const conv = pp.conventionData || {};
  const amendments = conv.platformAmendments || [];
  const vpRoster = conv.vpRoster || [];
  const keynotes = conv.keynoteSpeakers || [];
  const selectedVp = conv.selectedVp;
  const isBrokered = Boolean(pp.brokeredConvention);
  const isBrokeredResolved = Boolean(conv.brokeredResolved);

  return `
    <div class="v08-modal-overlay">
      <div class="convention-modal-dialog">
        <div class="eyebrow">National Nominating Convention · Hall of Delegates</div>
        <h2 style="margin: 4px 0 8px 0; color: #facc15;">${game.year || 2032} National Convention Floor</h2>
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
          Floor delegates have convened to finalize the party's governing platform, ratify the national ticket, and unify the coalition heading into the general election.
        </p>

        <!-- Section 1: Platform Floor Votes -->
        <div class="convention-section">
          <h3 style="font-size: 15px; color: #f8fafc; margin: 0 0 6px 0;">1. Factional Platform Floor Votes</h3>
          <p style="font-size: 12px; color: #94a3b8; margin: 0 0 10px 0;">
            Cast the tie-breaking committee vote on contested platform amendments. Adopting an amendment shifts national party doctrine and impacts wing happiness.
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${amendments.map((a) => `
              <div style="background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px;">
                <b style="font-size: 13px; color: #f1f5f9;">${safe(a.title)}</b>
                ${a.resolved
                  ? `<div style="margin-top: 6px; font-size: 12px; color: #34d399;"><b>✓ Ratified Plank:</b> ${safe(a.adopted)}</div>`
                  : `<div style="display: flex; gap: 10px; margin-top: 8px;">
                      <button type="button" class="button" data-vote-plank="A" data-amendment-id="${a.id}">
                        <b>Plank A:</b> ${safe(a.sideA.name)} <small>(+7 ${safe(a.sideA.factionName)})</small>
                      </button>
                      <button type="button" class="button" data-vote-plank="B" data-amendment-id="${a.id}">
                        <b>Plank B:</b> ${safe(a.sideB.name)} <small>(+7 ${safe(a.sideB.factionName)})</small>
                      </button>
                    </div>`}
              </div>`).join('')}
          </div>
        </div>

        <!-- Section 2: Vice Presidential Running Mate Selection -->
        <div class="convention-section">
          <h3 style="font-size: 15px; color: #f8fafc; margin: 0 0 6px 0;">2. Vice Presidential Running Mate Selection</h3>
          <p style="font-size: 12px; color: #94a3b8; margin: 0 0 10px 0;">
            Select a running mate to balance the ticket geographically and heal primary fractures.
          </p>
          <div class="convention-item-grid">
            ${vpRoster.map((v) => `
              <div class="convention-item-card ${selectedVp?.id === v.id ? 'highlight' : ''}">
                <div>
                  <b style="font-size: 14px; color: #f8fafc;">${safe(v.name)}</b>
                  <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${safe(v.stateId)} · Fame ${v.fame || 60}</div>
                  <div style="font-size: 11.5px; color: #38bdf8; margin-top: 6px;">
                    ${v.isRunnerUp ? '<b style="color: #facc15;">★ Primary Runner-Up: Faction Healing Accord</b>' : 'Regional & Executive Anchor'}
                  </div>
                </div>
                <button type="button" class="button ${selectedVp?.id === v.id ? 'button-gold' : ''}" data-select-vp="${v.id}">
                  ${selectedVp?.id === v.id ? 'Selected Running Mate ✓' : 'Select Running Mate'}
                </button>
              </div>`).join('')}
          </div>
        </div>

        <!-- Section 3: Prime-Time Keynote Address -->
        <div class="convention-section">
          <h3 style="font-size: 15px; color: #f8fafc; margin: 0 0 6px 0;">3. Prime-Time Convention Keynote Address</h3>
          <p style="font-size: 12px; color: #94a3b8; margin: 0 0 10px 0;">
            Appoint a prominent leader to deliver the prime-time convention speech (+5 Fame, +2.0% national general election enthusiasm).
          </p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${keynotes.map((s) => `
              <button type="button" class="button ${conv.keynoteSpeakerSelectedId === s.id ? 'button-gold' : ''}" data-keynote-speaker="${s.id}">
                ${conv.keynoteSpeakerSelectedId === s.id ? '★ Speaker Appointed: ' : ''}${safe(s.name)}
              </button>`).join('')}
          </div>
        </div>

        <!-- Section 4: Brokered Multi-Ballot Showdown -->
        ${isBrokered && !isBrokeredResolved ? `
        <div class="convention-section" style="border: 1px solid #eab308; background: #162032; border-radius: 8px; padding: 14px; margin-top: 14px;">
          <h3 style="font-size: 15px; color: #facc15; margin: 0 0 6px 0;">Contested Convention Floor: Ballot ${pp.ballotCount || 1} Deadlock</h3>
          <p style="font-size: 12.5px; color: #cbd5e1; margin: 0 0 12px 0;">
            No candidate crossed the 2,000 delegate threshold. Pledged delegates are now unbound. Broker an accord with kingmaker delegates on Ballot 2 to crown the nominee.
          </p>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="button button-gold" data-brokered-deal="vp">
              Offer Vice Presidency to Kingmaker (Secures 100% of Delegates)
            </button>
            <button type="button" class="button" data-brokered-deal="cabinet_platform">
              Cabinet & Platform Accords (Secures 80% of Delegates)
            </button>
          </div>
        </div>` : ''}

        <!-- Finalize Button -->
        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <button type="button" class="button button-gold" id="btn-finalize-convention" ${isBrokered && !isBrokeredResolved ? 'disabled' : ''}>
            Adjourn Convention & Crown Official Presidential Ticket →
          </button>
        </div>
      </div>
    </div>`;
}

function renderPresidentialModals(game) {
  if (!game) return '';
  return `${stepAsideDilemmaModalMarkup(game)}${nominatingConventionModalMarkup(game)}`;
}

function renderBallotCrisisModalMarkup(game) {
  const crisis = game?.pendingBallotCrisis;
  if (!crisis) return '';

  const stateName = (STATES.find((s) => s.id === crisis.stateId)?.name) || crisis.stateId;
  const challengePartyLabel = crisis.challengerParty === 'heritage' ? 'Republican' : crisis.challengerParty === 'people' ? 'Democratic' : 'Major party';

  return `
    <div class="modal-backdrop">
      <div class="modal panel v07-crisis-modal" style="max-width:580px;border-color:#f8717188;background:linear-gradient(155deg,#201416,#141e2a)">
        <div class="section-heading">
          <div>
            <div class="eyebrow" style="color:#f87171">Statutory Ballot Access Challenge</div>
            <h2 style="margin:4px 0">Formal Petition Challenge: ${safe(stateName)} (${safe(crisis.stateId)})</h2>
          </div>
        </div>
        <div style="margin:12px 0;font-size:14px;color:#d8e2ec;line-height:1.5">
          <p>Operatives and election attorneys affiliated with the <b>${safe(challengePartyLabel)} Party</b> have filed a formal legal challenge against your petition affidavits before the ${safe(crisis.stateId)} State Board of Elections.</p>
          <p>Following a signature audit, the state board has flagged defective affidavits. With a signature buffer of <b>${crisis.bufferPct}%</b>, your ballot line is set to be invalidated unless emergency legal action or an affidavit cure blitz is launched immediately.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
          <button type="button" class="button button-gold" data-action="resolve-ballot-crisis" data-crisis-option="law_firm" style="justify-content:space-between;text-align:left;padding:12px">
            <div>
              <b>Retain Elite Election Law Firm</b>
              <small style="display:block;color:#fef08a">Retain top constitutional counsel to file an emergency appeal before the state supreme court.</small>
            </div>
            <span style="font-size:12px;white-space:nowrap;padding:4px 8px;border-radius:6px;background:#0004">$2.5M · 70% Overturn</span>
          </button>
          <button type="button" class="button" data-action="resolve-ballot-crisis" data-crisis-option="cure_blitz" style="justify-content:space-between;text-align:left;padding:12px;border-color:#38bdf888">
            <div>
              <b>Emergency Signature Cure Blitz</b>
              <small style="display:block;color:#bae6fd">Mobilize grassroots volunteers to contact signers and cure defective affidavits before certification.</small>
            </div>
            <span style="font-size:12px;white-space:nowrap;padding:4px 8px;border-radius:6px;background:#0004">1 Action · $1.5M · 60% Overturn</span>
          </button>
          <button type="button" class="button" data-action="resolve-ballot-crisis" data-crisis-option="concede" style="justify-content:space-between;text-align:left;padding:12px;border-color:#64748b66;opacity:0.85">
            <div>
              <b>Concede the State Ballot Line</b>
              <small style="display:block;color:#94a3b8">Forfeit the state ballot line to preserve campaign warchest. Local chapter morale will suffer.</small>
            </div>
            <span style="font-size:12px;white-space:nowrap;padding:4px 8px;border-radius:6px;background:#0004">Free ($0) · -15 Chapter Morale</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderScandalCrisisModalMarkup(game) {
  const crisis = game?.pendingScandalCrisis;
  if (!crisis) return '';

  return `
    <div class="modal-backdrop">
      <div class="modal panel v07-scandal-modal" style="max-width:620px;border-color:hsl(7 62% 59% / 0.8);background:linear-gradient(155deg,#231416,#141926);box-shadow:0 24px 50px rgba(0,0,0,0.8);">
        <div class="section-heading">
          <div>
            <div class="eyebrow" style="color:hsl(7 62% 66%)">Campaign Crisis Dilemma · Media Spotlight Inquest</div>
            <h2 style="margin:4px 0 6px 0;color:#fecaca">${safe(crisis.headline || crisis.title)}</h2>
          </div>
        </div>
        <div style="margin:12px 0;font-size:14px;color:#e2e8f0;line-height:1.55">
          <p>${safe(crisis.narrative)}</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:18px">
          <button type="button" class="button button-gold" data-action="resolve-scandal-crisis" data-crisis-option="stand_by" style="justify-content:space-between;text-align:left;padding:14px;border:1px solid hsl(32 48% 48%);background:rgba(217, 119, 6, 0.12);">
            <div>
              <b style="font-size:14px;color:#fef08a">Stand By Nominee</b>
              <small style="display:block;color:#fef9c3;margin-top:4px">Deploy emergency legal counsel, buy defensive airtime, and absorb the immediate press fallout.</small>
              <div style="margin-top:6px;font-size:12px;color:#cbd5e1">
                • Nominee suffers -4.0% individual polling drag (-2 Quality, -10 Popularity)<br>
                • National committee suburban approval absorbs -1.5% ding<br>
                • Candidate's aligned faction appreciates committee loyalty (+4 Happiness)<br>
                • Seat remains contested on the general election ballot
              </div>
            </div>
            <span style="font-size:12px;white-space:nowrap;padding:6px 10px;border-radius:6px;background:rgba(0,0,0,0.4);color:#facc15;align-self:flex-start">$3.5M Treasury</span>
          </button>
          <button type="button" class="button" data-action="resolve-scandal-crisis" data-crisis-option="abandon" style="justify-content:space-between;text-align:left;padding:14px;border:1px solid hsl(7 62% 59% / 0.5);background:rgba(239, 68, 68, 0.1);">
            <div>
              <b style="font-size:14px;color:#fca5a5">Abandon and Disavow Nominee</b>
              <small style="display:block;color:#fecaca;margin-top:4px">Cut off committee funding, withdraw endorsement, and protect the national party brand.</small>
              <div style="margin-top:6px;font-size:12px;color:#cbd5e1">
                • Protects national party brand (+2 Independent Trust)<br>
                • Nominee suffers catastrophic -18.0% collapse (effectively conceding seat)<br>
                • Candidate's aligned faction is furious (-14 Happiness & Faction Bolt Warning)
              </div>
            </div>
            <span style="font-size:12px;white-space:nowrap;padding:6px 10px;border-radius:6px;background:rgba(0,0,0,0.4);color:#94a3b8;align-self:flex-start">No Treasury Cost</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function activeV159DecisionModalMarkup() {
  if (game?.pendingContingentElection && !game.pendingContingentElection.resolved) return contingentElectionModalMarkup();
  if (Array.isArray(game?.pendingKingmakerNegotiations) && game.pendingKingmakerNegotiations.length > 0) return kingmakerModalMarkup();
  if (game?.identityCrisis?.triggered && !game.identityCrisis.resolved) return identityCrisisModalMarkup();
  if (game?.pendingAscensionGauntletModal) return ascensionGauntletModalMarkup();
  if (game?.pendingDebateStageEvent) return debateStageModalMarkup();
  if (game?.pendingElectoralReformEvent) return electoralReformModalMarkup();
  return '';
}

function renderSuccessionCrisisModalMarkup(game) {
  if (!game?.founderLegacy?.active || !game.founderLegacy.successionTriggered || game.founderLegacy.successionResolved) {
    return '';
  }
  const founderName = game.founderLegacy.founderName || game?.player?.leaderName || game?.customLeader?.name || 'The Founding Chair';
  const reason = game.founderLegacy.successionTriggerReason;
  const reasonText = reason === 'retirement'
    ? `${safe(founderName)} has stepped down from active leadership, stepping aside after defining an era.`
    : reason === 'major_defeat'
      ? `A devastating electoral cycle has shaken ${safe(founderName)}'s grip on the national movement.`
      : `The initial charismatic momentum surrounding ${safe(founderName)}'s founding banner has crested.`;

  // REQ-256: Interpolate founderName and active archetype traits into succession option descriptions
  const activeTraitPhrases = [];
  if (Array.isArray(game?.founderLegacy?.activeTraits)) {
    activeTraitPhrases.push(...game.founderLegacy.activeTraits);
  }
  if (Array.isArray(game?.founderLegacy?.archetypeTraits)) {
    activeTraitPhrases.push(...game.founderLegacy.archetypeTraits);
  }
  if (Array.isArray(game?.archetypeTraits)) {
    activeTraitPhrases.push(...game.archetypeTraits);
  }

  // Origin archetype
  const originId = game?.customParty?.originStoryId || game?.player?.customOrigin || game?.customOrigin || game?.founderLegacy?.originStoryId;
  const allOrigins = window.PartyChairData?.CUSTOM_PARTY_ORIGINS || [];
  const originObj = allOrigins.find((o) => o.id === originId);
  if (originObj?.name && !activeTraitPhrases.includes(originObj.name)) {
    activeTraitPhrases.push(originObj.name);
  }

  // Leader archetype
  const archId = game?.founderLegacy?.founderArchetypeId || game?.customLeaderArchetype || game?.player?.leaderArchetype || game?.player?.archetype;
  const allArchs = window.PartyChairData?.CUSTOM_LEADER_ARCHETYPES || window.PartyChairData?.STARTING_LEADER_ARCHETYPES || [];
  const archObj = allArchs.find((a) => a.id === archId);
  if (archObj && !activeTraitPhrases.includes(archObj.name || archObj.label)) {
    activeTraitPhrases.push(archObj.name || archObj.label);
  }

  // Charter traits
  const charterTraitIds = game?.customParty?.charterTraitIds || game?.player?.customCharterTraits || game?.customCharterTraits || [];
  const allCharterTraits = window.PartyChairData?.CUSTOM_CHARTER_TRAITS || [];
  if (Array.isArray(charterTraitIds)) {
    charterTraitIds.forEach((tId) => {
      const tr = allCharterTraits.find((t) => t.id === tId);
      if (tr?.name && !activeTraitPhrases.includes(tr.name)) {
        activeTraitPhrases.push(tr.name);
      }
    });
  }

  const traitAtmosphere = activeTraitPhrases.length > 0
    ? activeTraitPhrases.join(' and ')
    : 'founding ethos';

  return `
    <div class="succession-modal-overlay">
      <div class="succession-modal-panel">
        <div class="eyebrow" style="color:var(--gold)">Historical Transition · Party Succession</div>
        <h2 style="margin:6px 0 12px;font-size:22px;color:var(--text)">Survive the Founder: The First Succession Crisis</h2>
        <p style="font-size:14px;color:var(--text);line-height:1.5;margin-bottom:12px">
          ${safe(reasonText)} Every political movement forged in the image of a singular founder faces an existential crossroads: does the party dissolve into nostalgia, tear itself apart in factional strife, or institutionalize into a lasting national force?
        </p>
        <p style="font-size:13px;color:var(--text-muted);font-style:italic;margin-bottom:16px">
          Choose how the national committee navigates this historic leadership mantle:
        </p>
        <div class="succession-paths-grid">
          <div class="succession-card">
            <div>
              <h4>Institutionalize the Machine</h4>
              <p>Fade ${safe(founderName)}'s personal branding into the permanent party infrastructure. Guided by the movement's foundational ${safe(traitAtmosphere)}, the party institutionalizes into a durable national organization rather than a personality cult.</p>
              <div class="succession-effect">
                <b>Institutional Fortification:</b> Grassroots organizers and machine factions rally behind stable governance; short-term fundraising dips as casual donors recalibrate.
              </div>
            </div>
            <button type="button" class="button button-gold" data-action="resolve-succession-crisis" data-path="institutionalize">
              Institutionalize Party Apparatus
            </button>
          </div>
          <div class="succession-card">
            <div>
              <h4>Anoint a Handpicked Heir</h4>
              <p>${safe(founderName)} formally endorses a trusted protégé to inherit the mantle. Rooted in ${safe(founderName)}'s heritage of ${safe(traitAtmosphere)}, charismatic continuity endures, though ambitious rivals within the leadership bench may quietly grumble.</p>
              <div class="succession-effect">
                <b>Enduring Charisma:</b> Carries forward substantial donor enthusiasm and grassroots loyalty; non-endorsed factions show mild wariness.
              </div>
            </div>
            <button type="button" class="button button-gold" data-action="resolve-succession-crisis" data-path="anoint_heir">
              Anoint Designated Heir
            </button>
          </div>
          <div class="succession-card">
            <div>
              <h4>Open Factional Power Struggle</h4>
              <p>Refuse to crown a designated successor to ${safe(founderName)} from above and let the factions contest party supremacy in an open brawl. High drama tested against ${safe(founderName)}'s charter of ${safe(traitAtmosphere)} will either forge a battle-tested new vanguard or expose internal fractures.</p>
              <div class="succession-effect">
                <b>Unvarnished Mandate:</b> Emergent leadership is determined purely by internal faction strength; tests the raw loyalty of your coalition base.
              </div>
            </div>
            <button type="button" class="button button-gold" data-action="resolve-succession-crisis" data-path="power_struggle">
              Open the Floor to Contest
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.renderSuccessionCrisisModalMarkup = renderSuccessionCrisisModalMarkup;
  if (window.PartyChairApp) {
    window.PartyChairApp.renderSuccessionCrisisModalMarkup = renderSuccessionCrisisModalMarkup;
  }
}

function renderInternalAnchorCrisisModalMarkup(game) {
  if (!game?.activeAnchorCrisis || game.activeAnchorCrisis.resolved) {
    return '';
  }
  const fId = game.activeAnchorCrisis.factionId;
  const f = (game.factions || []).find((x) => x.id === fId);
  const fName = f?.name || (fId === 'dem_liberal_establishment' ? 'The Liberal Establishment' : 'Nationalist Populists (MAGA)');
  const partyName = fId === 'dem_liberal_establishment' ? 'Democratic' : 'Republican';

  return `
    <div class="anchor-crisis-overlay">
      <div class="anchor-crisis-panel">
        <div class="eyebrow" style="color:#ef4444">Emergency Factional Alarm · High-Stakes Revolt</div>
        <h2 style="margin:6px 0 12px;font-size:22px;color:#fff">Internal Anchor Crisis: ${safe(fName)} in Open Rebellion</h2>
        <p style="font-size:14px;color:#cbd5e1;line-height:1.5;margin-bottom:12px">
          As an ironclad cornerstone of the ${safe(partyName)} coalition, <b>${safe(fName)}</b> cannot bolt the party or defect to rivals. However, their profound dissatisfaction has boiled over into an unmitigated party crisis.
        </p>
        <div style="background:rgba(239,68,68,0.12);border:1px solid #ef4444;border-radius:6px;padding:12px 14px;margin-bottom:16px">
          <b style="color:#fca5a5;font-size:13px;display:block;margin-bottom:4px">Atmospheric Impact of Factional Paralysis:</b>
          <ul style="margin:0;padding-left:18px;color:#e2e8f0;font-size:12.5px;line-height:1.4">
            <li><b>Turnout Resistance:</b> Grassroots field operations face demobilization and sluggish door-knocking across base jurisdictions.</li>
            <li><b>Capital Strike:</b> Major institutional financiers and bundlers withhold checks until leadership restores ideological order.</li>
            <li><b>Primary Threat:</b> Rebellious primary challengers prepare to contest vulnerable incumbents across state battlegrounds.</li>
          </ul>
        </div>
        <p style="font-size:13px;color:var(--text-muted);font-style:italic;margin-bottom:18px">
          The national committee must convene emergency negotiations to address core platform grievances and restore internal confidence before Election Night.
        </p>
        <button type="button" class="button button-gold" data-action="resolve-anchor-crisis" style="width:100%;padding:12px;font-size:14px;font-weight:700">
          Acknowledge Crisis & Dispatch Envoys to Convene Talks
        </button>
      </div>
    </div>
  `;
}

function campaignMarkup() {
  const player = game.player;
  const identity = playerIdentity();
  const customEmblemSvg = player.custom && player.customEmblem ? renderCustomEmblemSvg(player.customEmblem) : '';
  const stateControlCount = Object.values(game.stateLegislatures || {}).filter((chambers) => chambers?.[0] === identity).length;
  const stateSeatTotal = window.PartyChairData.VERSION_05_STATE_HOUSE_SEATS.totalSeats;
  const tab = currentTab();
  const tabs = [
    { id: 'actions', label: 'Actions', eyebrow: 'The Recruitment Phase' },
    { id: 'map', label: 'Map', eyebrow: 'National Landscape' },
    { id: 'states', label: 'States', eyebrow: '50-State Directory' },
    { id: 'forecast', label: 'Forecast', eyebrow: 'Election Projections & Forecasts' },
    { id: 'party-info', label: 'Party Information', eyebrow: 'Party Standing & Metrics' },
    { id: 'factions', label: 'Factions', eyebrow: `${(game?.factions || []).length || 37} National Factions & State Allocations` },
  ];
  // [v0.18.4 COALITION-POLITICS] Strict era-gated Diplomacy Hub tab
  if (window.CoalitionPoliticsSystem?.isDiplomacyHubUnlocked?.(game)) {
    tabs.push({ id: 'diplomacy-hub', label: 'Diplomacy Hub', eyebrow: 'Coalition & Splinter Diplomacy' });
  }

  let viewportContent = '';
  if (tab === 'map') viewportContent = mapTabMarkup();
  else if (tab === 'states') viewportContent = statesTabMarkup();
  else if (tab === 'forecast') viewportContent = forecastTabMarkup();
  else if (tab === 'party-info') viewportContent = partyInfoTabMarkup();
  else if (tab === 'factions') viewportContent = factionsTabMarkup();
  else if (tab === 'diplomacy-hub' && window.CoalitionPoliticsSystem?.isDiplomacyHubUnlocked?.(game)) viewportContent = window.CoalitionPoliticsSystem.renderDiplomacyHubTab(game);
  else viewportContent = actionsTabMarkup();

  return `
    <header class="topbar">
      <div class="brand"><img class="brand-icon" src="assets/coalition-builder-icon.svg" alt=""> COALITION BUILDER: <i>PARTY CHAIR</i></div>
      <div class="top-status">
        <span style="--party:${player.color}" class="status-party">${safe(player.name)}</span>
        <span class="status-divider"></span>
        <span>${game.phase === 'organizing' ? `${game?.year || 2028} · THE RECRUITMENT PHASE (${game.organizingActionsRemaining ?? 20} Actions Remaining)` : game.campaign?.active ? `${game?.year || 2028} · CAMPAIGN MONTH ${game.campaign.week}/5` : `${game?.year || 2028} · ELECTION COMPLETE`}</span>
        ${window.PartySystemsUI ? window.PartySystemsUI.renderTopBarEraBadge(game) : ''}
        ${/* [v0.18.4 MEDIA-SHOCKS] */ window.MediaShocksSystem ? window.MediaShocksSystem.renderTopHudPill(game) : ''}
        ${window.AtlasMultiplayerSystem ? window.AtlasMultiplayerSystem.renderHeaderControls(game) : ''}
        <button type="button" class="text-button" id="open-primary-archive-8" data-dup-id="open-primary-archive">Primary Archive</button>
        <button type="button" class="text-button" id="open-save-slots-9" data-dup-id="open-save-slots">Saves (5 Slots)</button>
        <button type="button" class="text-button" id="new-game">New party</button>
      </div>
    </header>

    <main class="screen campaign-screen ${robotPartyThemeClass()}">
      <div class="vibe-morning-wire">${getMorningWireHeadline(game)}</div>
      <section class="dashboard-head">
        <div style="display:flex;align-items:center;gap:16px">
          ${customEmblemSvg ? `<div class="dashboard-custom-emblem" style="width:48px;height:48px;color:${player.color || 'var(--gold)'}">${customEmblemSvg}</div>` : ''}
          <div>
            <div class="eyebrow">Coalition Builder: Party Chair · Version 0.18.3</div>
            <h1>${safe(player.name)}</h1>
            ${player.custom && player.customMotto ? `<div class="custom-party-motto" style="font-style:italic;color:var(--gold);font-size:13.5px;margin:2px 0 6px">“${safe(player.customMotto)}”</div>` : ''}
            <p>${game?.year || 2028} cycle · ${safe(templateForDisplay(player.baseTemplateId))} · ${game.phase === 'organizing' ? `${game.organizingActionsRemaining ?? 20} recruitment actions remaining before primaries & Campaign Phase` : game.campaign?.active ? `Campaign Month ${game.campaign.week} of 5 · ${5 - game.campaign.week} months to Election Night` : `${game?.year || 2028} general election complete`}</p>
          </div>
        </div>
        <div class="v07-header-badges">
          ${institutionalStatusBadgeMarkup(game)}
          ${partyDoctrineBadgeMarkup(game)}
          ${window.PartySystemsUI?.renderCoalitionStabilityHud ? window.PartySystemsUI.renderCoalitionStabilityHud(game) : ''}
          <span class="v07-happiness-pill">Sitting Member Happiness: <b>${Math.round(game.sittingMemberHappiness ?? 70)}/100</b></span>
          ${game.campaign?.active
            ? `<span class="v07-happiness-pill">Campaign Actions: <b>${game.campaign.monthlyActionsLeft ?? game.campaign.weeklyActionsLeft ?? 8}/${game.campaign.maxMonthlyActions || 8}</b></span>
               <span class="v07-happiness-pill">Wave Momentum: <b>${game.campaign.waveMomentum >= 0 ? 'D' : 'R'}+${Math.abs(game.campaign.waveMomentum || 0).toFixed(1)}</b></span>`
            : `<span class="v07-happiness-pill">Recruitment Actions Remaining: <b>${game.organizingActionsRemaining ?? 20}/20</b></span>`}
        </div>
      </section>

      ${renderPresidentialDelegateTrackerMarkup(game)}

      <section class="resource-strip panel">
        <div class="resource-main"><small>National Committee Budget</small><b>${money(game.treasury)}</b>${institutionalStatusBadgeMarkup(game, true)}</div>
        <div class="resource-main"><small>Represented Voters</small><b>${formatMillions(modeledVotersForParty(identity))}M</b><span>of ${formatMillions(totalModeledElectorate())}M represented voters${game?.partySystems?.robotCitizenship?.active ? ' (Human + Synthetic)' : ''}</span></div>
        <div class="resource-main"><small>50-State Chapters</small><b>${totalPlayerStateChapters().toLocaleString()}</b><span>Incl. Youth Chapters</span></div>
        <div class="resource-main"><small>State Houses Controlled</small><b>${stateControlCount}</b><span>${playerStateHouseSeats().toLocaleString()} of ${stateSeatTotal.toLocaleString()} seats</span></div>
        <div class="resource-main"><small>Governorships Controlled</small><b>${playerGovernorshipsCount()}</b><span>of 50 state executives</span></div>
        <div class="resource-main"><small>U.S. Senate Seats</small><b>${playerSenateSeats()}</b><span>of 100 Senate seats</span></div>
        <div class="resource-main"><small>U.S. House Seats</small><b>${playerHouseSeats()}</b><span>of 435 House seats</span></div>
      </section>

      <nav class="v07-tabbar" role="tablist" aria-label="Main Game Views">
        ${tabs.map((t) => `<button type="button" role="tab" aria-selected="${tab === t.id}" data-main-tab="${t.id}" class="v07-tab-btn ${tab === t.id ? 'selected' : ''}">
          <small>${safe(t.eyebrow)}</small>
          <b>${safe(t.label)}</b>
        </button>`).join('')}
      </nav>

      <div class="v07-tab-viewport">
        ${viewportContent}
      </div>

      ${deploymentModalOpen ? leaderDeploymentModalMarkup() : ''}
      ${questModalOpen ? questSelectionModalMarkup() : ''}
      ${commissionPollModalOpen ? commissionPollModalMarkup() : ''}
      ${commissionedPollsModalOpen ? commissionedPollsModalMarkup() : ''}
      ${summitModalOpen ? summitModalMarkup() : ''}
      ${activeV159DecisionModalMarkup()}
      ${renderPresidentialModals(game)}
      ${renderBallotCrisisModalMarkup(game)}
      ${renderScandalCrisisModalMarkup(game)}
      ${renderSuccessionCrisisModalMarkup(game)}
      ${renderInternalAnchorCrisisModalMarkup(game)}
      ${/* [v0.18.4 LEADING-FACTION] */ (window.LeadingFactionSystem && game?.pendingLeadingFactionChallenge ? window.LeadingFactionSystem.renderLeadingFactionChallengeModal(game, safe) : '')}
      ${window.PartySystemsUI ? (window.PartySystemsUI.renderActivePartySystemsModal ? window.PartySystemsUI.renderActivePartySystemsModal(game) : window.PartySystemsUI.renderRealignmentModal(game)) : ''}
      ${eraDossierModalOpen && window.PartySystemsUI ? window.PartySystemsUI.renderEraDossierModal(game) : ''}

      <footer class="footer"><span>COALITION BUILDER: PARTY CHAIR · V0.18.3</span><span>${formatMillions(totalModeledElectorate())}M Represented Voters Model · Local Autosave</span></footer>
    </main>`;
}

function syncGameSessionState() {
  if (!game) return;
  if (game.phase === 'organizing') {
    if (typeof game.organizingActionsRemaining !== 'number') {
      game.organizingActionsRemaining = 20;
    }
    if ((game.actionsLeft <= 0 || typeof game.actionsLeft !== 'number') && game.organizingActionsRemaining > 0) {
      game.actionsLeft = Math.min(4, game.organizingActionsRemaining);
    }
  }

  // Bug 2 Fix: Pre-initialize game.priorities and game.priorities.additional so listeners & DOM match reliably
  const maxFocusSlots = getPlayerMaxFocusSlots(game);
  if (!game.priorities) {
    game.priorities = {
      main: game.activeOverallQuest ? [game.activeOverallQuest] : [],
      additional: [],
      offeredQuestIds: [],
      lockedMainPriorities: [],
      redrawCount: 0,
      handLocked: false,
    };
  }
  if (!Array.isArray(game.priorities.additional)) {
    game.priorities.additional = [];
  }
  if (game.priorities.additional.length > maxFocusSlots) {
    game.priorities.additional = game.priorities.additional.slice(0, maxFocusSlots);
  }
  while (game.priorities.additional.length < maxFocusSlots) {
    const idx = game.priorities.additional.length;
    if (idx === 0) game.priorities.additional.push({ type: 'issue', targetId: (game.issuePriorities && game.issuePriorities[0]) || '' });
    else if (idx === 1) game.priorities.additional.push({ type: 'issue', targetId: (game.issuePriorities && game.issuePriorities[1]) || '' });
    else if (idx === 2) game.priorities.additional.push({ type: 'issue', targetId: (game.issuePriorities && game.issuePriorities[2]) || '' });
    else if (idx === 3) game.priorities.additional.push({ type: 'region', targetId: (game.regionalPriorities && game.regionalPriorities[0]) || '' });
    else game.priorities.additional.push({ type: 'issue', targetId: '' });
  }
}

// ============================================================================
// REQ-220 - REQ-223: DECISION DESK BROADCAST SCREEN & PLAYBACK
// ============================================================================

let electionNightInterval = null;
let primaryAutoPlayInterval = null;

function stopPrimaryAutoPlayback() {
  if (primaryAutoPlayInterval) {
    clearInterval(primaryAutoPlayInterval);
    primaryAutoPlayInterval = null;
  }
}

function ensurePrimaryAutoPlayback() {
  const p = game?.activePresidentialPrimary;
  if (!game || game.phase !== 'presidential-primary' || !p || p.stage === 'complete' || p.paused || p.autoPlay === false) {
    stopPrimaryAutoPlayback();
    return;
  }
  const speed = [1, 2, 4].includes(Number(p.speed)) ? Number(p.speed) : 1;
  const stepMs = Math.max(1200, Math.round((Number(p.intervalMs) || 8000) / speed));
  if (primaryAutoPlayInterval && primaryAutoPlayInterval._stepMs === stepMs) return;
  stopPrimaryAutoPlayback();
  const handle = setInterval(() => {
    const curP = game?.activePresidentialPrimary;
    if (!game || game.phase !== 'presidential-primary' || !curP || curP.stage === 'complete' || curP.paused || curP.autoPlay === false) {
      stopPrimaryAutoPlayback();
      return;
    }
    game = window.PartyChairEngine.takeAction(game, 'advance-primary-day', {});
    if (typeof saveGame === 'function') saveGame(game);
    if (typeof render === 'function') render();
    if (!game?.activePresidentialPrimary || game.activePresidentialPrimary.stage === 'complete') {
      stopPrimaryAutoPlayback();
    }
  }, stepMs);
  handle._stepMs = stepMs;
  primaryAutoPlayInterval = handle;
}

function buildElectionHoverTooltipHtml(race, snapEval) {
  if (!race) return '';
  const pct = snapEval ? Math.round(snapEval.pct) : (race.isCalled ? 100 : 0);
  const isNotOpenYet = Boolean(snapEval && snapEval.isOpen === false && !snapEval.isCalled && pct === 0);
  if (isNotOpenYet) {
    return `<div style="font-weight:700;font-size:12.5px;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.14);padding-bottom:3px;">${safe(race.name || race.stateId || race.code || 'Race')} <span style="opacity:0.75;font-weight:500;">· Polls Open</span></div><div style="font-size:12px;opacity:0.85;">Polls not closed yet — awaiting returns.</div>`;
  }
  const shares = snapEval?.currentShares || snapEval?.liveShares || race.finalShares || race.shares || null;
  let rowsHtml = '';
  if (shares && typeof shares === 'object' && Object.keys(shares).length > 0) {
    const sorted = Object.entries(shares)
      .filter(([, v]) => Number(v) > 0.05)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 5);
    rowsHtml = sorted.map(([pid, val]) => {
      const col = getElectionPartyColor(pid);
      const label = getElectionPartyShort(pid);
      return `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:2px;"><span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${col};margin-right:6px;"></span>${safe(label)}</span><b>${Number(val).toFixed(1)}%</b></div>`;
    }).join('');
  } else {
    const lead = Math.abs(Number(snapEval?.liveLead ?? race.finalWinningMargin ?? 0));
    const winP = snapEval?.liveLeader || race.finalWinner || 'people';
    const oppP = winP === 'people' ? 'heritage' : 'people';
    const wPct = Math.min(99, Math.max(50, 50 + lead / 2));
    const oPct = Math.max(1, 100 - wPct);
    rowsHtml = `
      <div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:2px;"><span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${getElectionPartyColor(winP)};margin-right:6px;"></span>${safe(getElectionPartyShort(winP))}</span><b>${wPct.toFixed(1)}%</b></div>
      <div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:2px;"><span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${getElectionPartyColor(oppP)};margin-right:6px;"></span>${safe(getElectionPartyShort(oppP))}</span><b>${oPct.toFixed(1)}%</b></div>
    `;
  }
  const statusTxt = (snapEval?.isCalled || race.isCalled) ? 'CALLED' : `${pct}% Reporting`;
  return `<div style="font-weight:700;font-size:12.5px;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.14);padding-bottom:3px;">${safe(race.name || race.stateId || race.code || 'Race')} <span style="opacity:0.75;font-weight:500;">· ${safe(statusTxt)}</span></div>${rowsHtml}`;
}

function ensureElectionHoverTooltipBound() {
  if (typeof document === 'undefined' || window.__enHoverBound) return;
  window.__enHoverBound = true;
  let tip = document.getElementById('en-hover-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'en-hover-tooltip';
    tip.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;display:none;background:rgba(12,18,32,0.96);color:#f1f5f9;border:1px solid rgba(148,163,184,0.35);border-radius:8px;padding:8px 11px;min-width:175px;box-shadow:0 8px 24px rgba(0,0,0,0.45);font-family:inherit;';
    document.body.appendChild(tip);
  }
  document.addEventListener('pointerover', (e) => {
    if (!game?.electionNight?.active) return;
    const stateEl = e.target?.closest?.('[data-desk-state]');
    const rowEl = e.target?.closest?.('.the-count-row[data-race-id]');
    if (!stateEl && !rowEl) return;
    const enEngine = window.ElectionNightEngine;
    if (!enEngine?.evaluateElectionNightAt || !game.electionNight?.timeline) return;
    const snap = enEngine.evaluateElectionNightAt(game.electionNight.timeline, game.electionNight.elapsedMinutes || 0);
    const activeTab = game.electionNight.activeTab || 'president';
    const allRaces = game.electionNight.timeline.races || [];
    let race = null;
    let snapEval = null;
    if (rowEl) {
      const rid = rowEl.getAttribute('data-race-id');
      snapEval = (snap.theCountRaces || []).find((r) => r.id === rid) || (snap.raceEvaluations || []).find((r) => r.id === rid) || null;
      race = allRaces.find((r) => r.id === rid) || snapEval;
    } else if (stateEl) {
      const stId = stateEl.getAttribute('data-desk-state');
      race = allRaces.find((r) => r.stateId === stId && r.raceKind === activeTab)
        || allRaces.find((r) => r.stateId === stId);
      if (race) snapEval = (snap.theCountRaces || []).find((r) => r.id === race.id) || (snap.raceEvaluations || []).find((r) => r.id === race.id) || null;
    }
    if (!race) return;
    tip.innerHTML = buildElectionHoverTooltipHtml(race, snapEval);
    tip.style.display = 'block';
  });
  document.addEventListener('pointermove', (e) => {
    if (tip.style.display !== 'block') return;
    tip.style.left = `${Math.min(window.innerWidth - 220, e.clientX + 14)}px`;
    tip.style.top = `${Math.min(window.innerHeight - 140, e.clientY + 14)}px`;
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target?.closest?.('[data-desk-state], .the-count-row[data-race-id]')) {
      tip.style.display = 'none';
    }
  });
}

// v0.18.2 (QA Fix #1): In-place DOM patching during Election Night playback — zero innerHTML wipes or flicker
function patchElectionNightLiveDOM() {
  if (typeof document === 'undefined' || !game?.electionNight?.active) return;
  const enEngine = window.ElectionNightEngine;
  if (!enEngine?.evaluateElectionNightAt || !game.electionNight?.timeline) return;
  const snap = enEngine.evaluateElectionNightAt(game.electionNight.timeline, game.electionNight.elapsedMinutes || 0);
  const activeTab = game.electionNight.activeTab || 'president';
  const mapMode = game.electionNight.mapMode || 'called';
  const allRaces = game.electionNight.timeline.races || [];

  // 1 (#4): Patch clock text directly from snap.clockLabel
  const clockEl = document.querySelector('.desk-clock, [data-en-clock]');
  if (clockEl && snap.clockLabel) {
    clockEl.textContent = snap.clockLabel;
  }

  // 1b (#2): Patch EV / Senate / House scoreboard, Sallow Forecast, and Call Ticker from snap.scoreboard / snap.forecast / snap.calls
  const sb = snap.scoreboard || {};
  const evDem = document.querySelector('[data-en-ev="people"]');
  const evRep = document.querySelector('[data-en-ev="heritage"]');
  if (evDem && sb.president) evDem.textContent = String(sb.president.people || 0);
  if (evRep && sb.president) evRep.textContent = String(sb.president.heritage || 0);
  const senDem = document.querySelector('[data-en-senate="people"]');
  const senRep = document.querySelector('[data-en-senate="heritage"]');
  if (senDem && sb.senate) senDem.textContent = String(sb.senate.people || 0);
  if (senRep && sb.senate) senRep.textContent = String(sb.senate.heritage || 0);
  const hseDem = document.querySelector('[data-en-house="people"]');
  const hseRep = document.querySelector('[data-en-house="heritage"]');
  if (hseDem && sb.house) hseDem.textContent = String(sb.house.people || 0);
  if (hseRep && sb.house) hseRep.textContent = String(sb.house.heritage || 0);
  const presOddsEl = document.querySelector('[data-en-sallow-forecast="president"]');
  if (presOddsEl && snap.forecast?.presidentialWinOdds) {
    const o = snap.forecast.presidentialWinOdds;
    const dEl = presOddsEl.querySelector('[data-en-odds-dem]');
    const rEl = presOddsEl.querySelector('[data-en-odds-rep]');
    if (dEl) dEl.textContent = `Democrat: ${o.people || 0}%`;
    if (rEl) rEl.textContent = `Republican: ${o.heritage || 0}%`;
  } else {
    const forecastEl = document.querySelector('[data-en-sallow-forecast]');
    if (forecastEl && snap.forecast?.medianSeatsDem !== undefined) {
      forecastEl.textContent = `${snap.forecast.medianSeatsDem} seats`;
    }
  }
  const tickerEl = document.querySelector('[data-en-call-ticker]');
  if (tickerEl && Array.isArray(snap.calls) && snap.calls.length > 0) {
    const latest = snap.calls[0];
    tickerEl.textContent = `${latest.name}: Called for ${getElectionPartyShort(latest.winnerPartyId)} (${latest.timestampLabel || ''})`;
  }

  // 2 (#3): Patch SVG state fills & opacities in-place using Array.find on raceEvaluations
  document.querySelectorAll('[data-desk-state]').forEach((pathEl) => {
    const stId = pathEl.getAttribute('data-desk-state');
    const race = allRaces.find((r) => r.stateId === stId && r.raceKind === activeTab);
    if (!race) return;
    const stEval = (snap.theCountRaces || []).find((r) => r.id === race.id) || (snap.raceEvaluations || []).find((r) => r.id === race.id);
    const isOpen = (game.electionNight.elapsedMinutes || 0) >= (race.closeMinutes || 0);
    const pct = stEval ? stEval.pct : 0;
    const isCalled = stEval ? stEval.isCalled : false;
    const leader = stEval ? stEval.liveLeader : race.finalWinner;
    const lead = stEval ? stEval.liveLead : Math.abs(race.finalWinningMargin || 0);
    if (!isOpen) {
      pathEl.style.fill = '#22304F';
      pathEl.style.fillOpacity = '0.45';
    } else if (isCalled) {
      pathEl.style.fill = getElectionPartyColor(race.finalWinner);
      pathEl.style.fillOpacity = '1';
    } else {
      pathEl.style.fill = getElectionPartyColor(leader);
      pathEl.style.fillOpacity = mapMode === 'margin'
        ? String(Math.round((0.35 + 0.65 * Math.min(1, lead / 15)) * 100) / 100)
        : String(Math.round((0.40 + 0.60 * (pct / 100)) * 100) / 100);
    }
  });

  // 3 (#35): Patch existing "The Count" race rows AND append newly opened states in-place without wiping scroll
  const countContainer = document.querySelector('.the-count-list');
  (snap.theCountRaces || []).filter((r) => r.raceKind === activeTab).forEach((r) => {
    let row = document.querySelector(`.the-count-row[data-race-id="${r.id}"]`);
    const col = getElectionPartyColor(r.liveLeader);
    if (!row && countContainer) {
      const div = document.createElement('div');
      div.className = 'the-count-row';
      div.setAttribute('data-race-id', r.id);
      div.innerHTML = `<span class="count-code">${safe(r.code)}</span><span class="count-name">${safe(r.name)}</span><span class="count-lead" style="color:${col}">${safe(getElectionPartyShort(r.liveLeader))} +${Math.abs(r.liveLead).toFixed(1)}</span><span class="count-progress"><span class="count-progress-fill" style="width:${Math.round(r.pct)}%;background:${col}"></span></span><span class="count-status ${r.isCalled ? 'called' : 'pct'}">${r.isCalled ? 'CALLED' : `${Math.round(r.pct)}%`}</span>`;
      countContainer.appendChild(div);
      return;
    }
    if (!row) return;
    const leadEl = row.querySelector('.count-lead');
    const fillEl = row.querySelector('.count-progress-fill');
    const statEl = row.querySelector('.count-status');
    if (leadEl) { leadEl.textContent = `${getElectionPartyShort(r.liveLeader)} +${Math.abs(r.liveLead).toFixed(1)}`; leadEl.style.color = col; }
    if (fillEl) { fillEl.style.width = `${Math.round(r.pct)}%`; fillEl.style.background = col; }
    if (statEl) { statEl.textContent = r.isCalled ? 'CALLED' : `${Math.round(r.pct)}%`; statEl.className = `count-status ${r.isCalled ? 'called' : 'pct'}`; }
  });

  // 4 (#34): Prepend newly called races into the "Just Called" feed in-place
  const calledFeed = document.querySelector('.just-called-list, .just-called-feed');
  if (calledFeed && Array.isArray(snap.calls)) {
    snap.calls.slice(0, 20).reverse().forEach((c) => {
      if (calledFeed.querySelector(`.just-called-item[data-call-id="${c.id}"]`)) return;
      const qn = calledFeed.querySelector('.quiet-note');
      if (qn) qn.remove();
      const item = document.createElement('div');
      item.className = 'just-called-item';
      item.setAttribute('data-call-id', c.id);
      const pCol = getElectionPartyColor(c.winnerPartyId);
      const pSh = getElectionPartyShort(c.winnerPartyId);
      item.innerHTML = `<div class="just-called-row"><div class="just-called-left"><span class="just-called-badge">${safe(String(c.raceKind || '').toUpperCase().slice(0, 4))}</span><span class="just-called-name">${safe(c.name)}</span></div><div class="just-called-right"><span class="just-called-party-pill" style="background:${pCol}">${safe(pSh)}${c.electoralVotes ? ` · ${c.electoralVotes} EV` : ''}</span><span class="just-called-time">${safe(c.timestampLabel || '')}</span></div></div>`;
      calledFeed.prepend(item);
    });
  }

  // 5 (#36): Update Breaking Call banner in-place when a clinch occurs mid-broadcast
  const breakHost = document.querySelector('[data-en-breaking-host]');
  if (breakHost && snap.breakingCall && !game.electionNight.breakingBannerDismissed) {
    if (breakHost.getAttribute('data-breaking-key') !== snap.breakingCall.headline) {
      breakHost.setAttribute('data-breaking-key', snap.breakingCall.headline);
      breakHost.innerHTML = `<div class="breaking-call-banner" style="margin:8px 0;padding:10px 14px;border-radius:8px;background:rgba(226,189,112,0.16);border:1px solid #e2bd70;font-weight:700;">★ ${safe(snap.breakingCall.stamp || 'BREAKING')}: ${safe(snap.breakingCall.headline)}</div>`;
    }
  }
}

function ensureElectionNightPlayback() {
  ensureElectionHoverTooltipBound();
  if (electionNightInterval) return;
  if (!game || !game.electionNight || !game.electionNight.active) return;
  if (game.electionNight.paused || game.electionNight.completed) return;

  electionNightInterval = setInterval(() => {
    if (!game || !game.electionNight || !game.electionNight.active || game.electionNight.paused || game.electionNight.completed) {
      stopElectionNightPlayback();
      return;
    }
    const speed = game.electionNight.speed || 1;
    const delta = 0.75 * speed;
    const nextMin = Math.min(540, (game.electionNight.elapsedMinutes || 0) + delta);
    game.electionNight.elapsedMinutes = nextMin;
    if (nextMin >= 540) {
      game.electionNight.completed = true;
      stopElectionNightPlayback();
      render();
      return;
    }
    patchElectionNightLiveDOM();
  }, 250);
}

function stopElectionNightPlayback() {
  if (electionNightInterval) {
    clearInterval(electionNightInterval);
    electionNightInterval = null;
  }
}

function getElectionPartyColor(partyId) {
  if (partyId === 'people') return '#3b82f6';
  if (partyId === 'heritage') return '#ef4444';
  if (partyId === 'liberty') return '#f59e0b';
  if (partyId === 'green') return '#10b981';
  if (partyId === 'constitution') return '#8b5cf6';
  if (partyId === 'socialist') return '#ec4899';
  if (partyId === 'independent') return '#14b8a6';
  if (partyId === 'split') return '#a855f7';
  if (partyId === 'player' && game?.player?.color) return game.player.color;
  const arch = allPartyArchetypes().find((p) => p.id === partyId);
  return arch?.color || '#64748b';
}

function getElectionPartyShort(partyId) {
  if (partyId === 'people') return 'DEM';
  if (partyId === 'heritage') return 'GOP';
  if (partyId === 'liberty') return 'LIB';
  if (partyId === 'green') return 'GRN';
  if (partyId === 'constitution') return 'CON';
  if (partyId === 'socialist') return 'PFP';
  if (partyId === 'independent') return 'IND';
  if (partyId === 'split') return 'SPLIT';
  if (partyId === 'player') return (game?.player?.partyCode || 'PLY');
  return String(partyId || '').slice(0, 3).toUpperCase();
}

function renderElectionNightScreen() {
  const enEngine = (typeof window !== 'undefined' && window.ElectionNightEngine) || (typeof global !== 'undefined' && global.ElectionNightEngine);
  if (!enEngine) return '<main class="screen election-night-screen"><p>Loading Decision Desk...</p></main>';

  let timeline = game.electionNight.timeline;
  if (!timeline && game.lastElection) {
    timeline = enEngine.buildElectionNightTimeline(game, game.lastElection);
    game.electionNight.timeline = timeline;
  }
  if (!timeline) return '<main class="screen election-night-screen"><p>No election returns available.</p></main>';

  const elapsed = game.electionNight.elapsedMinutes || 0;
  const snapshot = enEngine.evaluateElectionNightAt(timeline, elapsed);
  const activeTab = game.electionNight.activeTab || (timeline.isPresidential ? 'president' : 'senate');
  const mapMode = game.electionNight.mapMode || 'winner';
  const speed = game.electionNight.speed || 1;
  const paused = Boolean(game.electionNight.paused);

  // 1. Header
  const statusPill = snapshot.isFinished
    ? '<span class="desk-status-pill called">★ CALLED</span>'
    : '<span class="desk-status-pill live"><span class="pulse-dot"></span> LIVE</span>';

  const phaseLabels = timeline.isPresidential ? [
    '1. Polls close',
    '2. Early returns',
    '3. Decisive states',
    '4. Presidency called'
  ] : [
    '1. Polls close',
    '2. Early returns',
    '3. Battleground counts',
    '4. All races called'
  ];

  const phaseMarkup = phaseLabels.map((label, idx) => {
    const isAct = (idx + 1) <= snapshot.phaseIndex;
    return `<span class="desk-phase-pip ${isAct ? 'active' : ''}">${safe(label)}</span>`;
  }).join('');

  const speeds = [1, 2, 4, 8];
  const speedPillsMarkup = speeds.map((s) => `
    <button type="button" class="desk-ctrl-btn ${speed === s ? 'active' : ''}" data-desk-action="speed" data-speed="${s}">${s}×</button>
  `).join('');

  // 2. Breaking Banner
  const breakingMarkup = (snapshot.breakingCall && !game.electionNight.breakingBannerDismissed) ? `
    <div class="breaking-banner">
      <span class="breaking-stamp">${safe(snapshot.breakingCall.stamp)}</span>
      <span class="breaking-headline">${safe(snapshot.breakingCall.headline)}</span>
      <button type="button" class="breaking-dismiss" id="desk-btn-dismiss-banner" title="Dismiss">✕</button>
    </div>
  ` : '';

  // 3. Race Tabs & Filter
  const availableTabs = [
    ...(timeline.isPresidential ? [{ id: 'president', label: 'President' }] : []),
    { id: 'senate', label: 'Senate' },
    { id: 'house', label: 'House' },
    { id: 'governors', label: 'Governors' },
    { id: 'statewide_executive', label: 'Statewide Exec' },
    { id: 'state_leg', label: 'State Legislatures' },
  ];

  const tabsMarkup = availableTabs.map((t) => `
    <button type="button" class="desk-tab-pill ${activeTab === t.id ? 'active' : ''}" data-desk-action="tab" data-tab="${t.id}">${safe(t.label)}</button>
  `).join('');

  // 4. Map Rendering for Active Tab
  const stateRows = MAPS.states.filter((s) => s.id !== 'DC');

  const mapGeometry = stateRows.map((state) => {
    const _enStName = state.name || window.PartyChairData?.STATES?.find((s) => s.id === state.id)?.name || state.id;
    const race = timeline.races.find((r) => r.raceKind === activeTab && r.stateId === state.id);
    let fillColor = '#22304F';
    let fillOpacity = 0.5;
    let title = `${_enStName} (${state.id})`;

    if (race) {
      const stateEval = snapshot.raceEvaluations.find((re) => re.id === race.id);
      const isOpen = stateEval ? stateEval.isOpen : (elapsed >= race.closeMinutes);
      const isCalled = stateEval ? stateEval.isCalled : false;
      const pct = stateEval ? stateEval.pct : 0;
      const leader = stateEval ? stateEval.liveLeader : race.finalWinner;
      const lead = stateEval ? stateEval.liveLead : Math.abs(race.finalWinningMargin);

      if (!isOpen) {
        fillColor = '#22304F';
        fillOpacity = 0.45;
        title = `${_enStName} (${state.id}) · Polls close at ${enEngine.formatSimTime(race.closeMinutes)} · Too early to call`;
      } else {
        fillOpacity = Math.round((0.40 + 0.60 * (pct / 100)) * 100) / 100;
        if (isCalled) {
          fillColor = getElectionPartyColor(race.finalWinner);
          fillOpacity = 1.0;
          title = `${_enStName} (${state.id}) · ${race.ev ? `${race.ev} EV · ` : ''}CALLED for ${getElectionPartyShort(race.finalWinner)} · 100% counted`;
        } else {
          if (mapMode === 'margin') {
            const intensity = Math.min(1, lead / 15);
            fillColor = getElectionPartyColor(leader);
            fillOpacity = Math.round((0.35 + 0.65 * intensity) * 100) / 100;
          } else {
            fillColor = getElectionPartyColor(leader);
          }
          title = `${_enStName} (${state.id}) · ${race.ev ? `${race.ev} EV · ` : ''}Leading: ${getElectionPartyShort(leader)} +${lead.toFixed(1)}% · ${Math.round(pct)}% counted`;
        }
      }
    } else {
      fillColor = '#1a2432';
      fillOpacity = 0.35;
      title = `${_enStName} (${state.id}) · No contest in this chamber`;
    }

    return `<path style="fill:${fillColor};fill-opacity:${fillOpacity}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}" data-desk-state="${state.id}" tabindex="0"><title>${safe(title)}</title></path>`;
  }).join('');

  const mapLabels = stateRows.map((state) => `<text x="${state.cx}" y="${state.cy}" class="map-label" pointer-events="none">${state.id}</text>`).join('');
  const mapSvg = `<svg class="desk-map-svg" viewBox="${MAPS.viewBox}" role="img" aria-label="Election Night Live Results Map">${mapGeometry}${mapLabels}</svg>`;

  // 5. "The Count" Live Closest-First Table for Active Tab
  const seoNightResults = (activeTab === 'statewide' || activeTab === 'statewide_executive')
    ? (game.statewideOfficesHistory?.[game.year] || (window.ElectionNightEngine?.resolveStatewideOffices ? window.ElectionNightEngine.resolveStatewideOffices(game, game.year).results : []))
    : [];
  const activeTabRaces = snapshot.theCountRaces.filter((r) => r.raceKind === activeTab);
  const theCountMarkup = activeTabRaces.length > 0 ? activeTabRaces.map((r) => {
    const isCalled = r.isCalled;
    const leaderColor = getElectionPartyColor(r.liveLeader);
    const leaderShort = getElectionPartyShort(r.liveLeader);
    const leadText = `${leaderShort} +${Math.abs(r.liveLead).toFixed(1)}`;
    const pct = Math.round(r.pct);

    return `
      <div class="the-count-row" data-race-id="${safe(r.id)}">
        <span class="count-code">${safe(r.code)}</span>
        <span class="count-name" title="${safe(r.name)}">${safe(r.name)}</span>
        <span class="count-lead" style="color:${leaderColor}">${safe(leadText)}</span>
        <div class="count-progress-bar">
          <div class="count-progress-fill" style="width:${pct}%;background:${leaderColor}"></div>
        </div>
        <span class="count-status ${isCalled ? 'called' : 'pct'}">${isCalled ? 'CALLED' : `${pct}%`}</span>
      </div>
    `;
  }).join('') : (activeTab === 'statewide' && seoNightResults.length > 0
      ? seoNightResults.slice().sort((a, b) => Math.abs(a.margin) - Math.abs(b.margin)).map((r) => {
          const leaderColor = getElectionPartyColor(r.winner);
          const leaderShort = getElectionPartyShort(r.winner);
          const leadText = `${leaderShort} +${Math.abs(r.margin).toFixed(1)}`;
          return `
            <div class="the-count-row" data-race-id="statewide:${safe(r.officeId)}">
              <span class="count-code">${safe(r.stateId)}</span>
              <span class="count-name" title="${safe(r.title)}">${safe(r.title)} · ${safe(r.incumbentName || '')}</span>
              <span class="count-lead" style="color:${leaderColor}">${safe(leadText)}</span>
              <div class="count-progress-bar">
                <div class="count-progress-fill" style="width:100%;background:${leaderColor}"></div>
              </div>
              <span class="count-status called">${r.flipped ? 'FLIP' : 'HOLD'}</span>
            </div>
          `;
        }).join('')
      : '<div class="quiet-note" style="padding:12px;text-align:center;">Polls have not closed yet for this category.</div>');

  // 6. Scoreboard for Active Tab
  const tabScore = snapshot.scoreboard[activeTab] || { people: 0, heritage: 0, third: 0, totalCalled: 0 };
  let thresholdLabel = '270 to win';
  let totalCap = 538;
  let tabTitle = 'The Presidency';
  if (activeTab === 'senate') { thresholdLabel = '51 to win'; totalCap = 100; tabTitle = 'The U.S. Senate'; }
  else if (activeTab === 'house') { thresholdLabel = '218 to win'; totalCap = 435; tabTitle = 'The U.S. House'; }
  else if (activeTab === 'governors') { thresholdLabel = 'Governor Control'; totalCap = 50; tabTitle = 'The Governorships'; }
  else if (activeTab === 'statewide' || activeTab === 'statewide_executive') {
    const seoDem = seoNightResults.filter((r) => r.winner === 'people').length;
    const seoRep = seoNightResults.filter((r) => r.winner === 'heritage').length;
    tabScore.people = seoDem;
    tabScore.heritage = seoRep;
    tabScore.third = Math.max(0, seoNightResults.length - seoDem - seoRep);
    thresholdLabel = `${(game.cycleFlips?.statewide || []).length} Flips`;
    totalCap = Math.max(1, seoNightResults.length);
    tabTitle = 'Statewide Elected Executives';
  }
  else if (activeTab === 'state_leg') { thresholdLabel = 'State Chambers'; totalCap = 99; tabTitle = 'State Legislatures'; }

  const demPct = Math.min(100, (tabScore.people / totalCap) * 100);
  const repPct = Math.min(100, (tabScore.heritage / totalCap) * 100);
  const thirdPct = Math.min(100, (tabScore.third / totalCap) * 100);

  // 7. Sallow Live Forecast Card
  let forecastCardMarkup = '';
  if (activeTab === 'president' && snapshot.forecast.presidentialWinOdds) {
    const odds = snapshot.forecast.presidentialWinOdds;
    const demOdd = odds.people || 0;
    const repOdd = odds.heritage || 0;
    forecastCardMarkup = `
      <div class="desk-card">
        <div class="forecast-card-header">
          <span class="forecast-card-title">SALLOW LIVE DESK FORECAST</span>
          <span>Projections, not calls</span>
        </div>
        <div class="forecast-grid">
          <div class="forecast-odds-row" data-en-sallow-forecast="president">
            <span style="color:#3b82f6;font-weight:700" data-en-odds-dem>Democrat: ${demOdd}%</span>
            <span style="color:#ef4444;font-weight:700" data-en-odds-rep>Republican: ${repOdd}%</span>
          </div>
          <div class="forecast-bar">
            <div class="forecast-fill" style="width:${demOdd}%;background:#3b82f6"></div>
          </div>
        </div>
      </div>
    `;
  } else if ((activeTab === 'senate' || activeTab === 'house') && snapshot.forecast[activeTab]) {
    const fc = snapshot.forecast[activeTab];
    const odds = fc.majorityOdds || {};
    forecastCardMarkup = `
      <div class="desk-card">
        <div class="forecast-card-header">
          <span class="forecast-card-title">SALLOW LIVE CONTROL FORECAST</span>
          <span>Projections, not calls</span>
        </div>
        <div class="forecast-grid">
          <div class="forecast-odds-row">
            <span style="color:#3b82f6;font-weight:700">Dem Majority: ${odds.people || 0}%</span>
            <span style="color:#ef4444;font-weight:700">GOP Majority: ${odds.heritage || 0}%</span>
            <span style="color:var(--gold);font-weight:700">Hung: ${odds.hung || 0}%</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px;">
            Median Democratic projection: <b style="color:#f1f5f9" data-en-sallow-forecast>${fc.medianSeatsDem} seats</b> (80% confidence: ${fc.range80Dem[0]}–${fc.range80Dem[1]})
          </div>
        </div>
      </div>
    `;
  }

  // 8. "Just Called" Feed
  const recentCalls = snapshot.calls.slice(0, 20);
  const callsMarkup = recentCalls.length > 0 ? recentCalls.map((c) => {
    const pColor = getElectionPartyColor(c.winnerPartyId);
    const pShort = getElectionPartyShort(c.winnerPartyId);
    const kindBadge = c.raceKind.toUpperCase().slice(0, 4);
    const evText = c.electoralVotes ? ` · ${c.electoralVotes} EV` : '';
    const noteText = c.isRecountPending
      ? `${safe(c.name)}: Razor-thin margin triggered an automatic statutory recount.`
      : `${safe(c.name)}: Called for ${safe(pShort)} based on certified reporting thresholds.`;

    return `
      <div class="just-called-item" data-call-id="${safe(c.id)}">
        <div class="just-called-row">
          <div class="just-called-left">
            <span class="just-called-badge">${safe(kindBadge)}</span>
            <span class="just-called-name">${safe(c.name)}</span>
          </div>
          <div class="just-called-right">
            <span class="just-called-party-pill" style="background:${pColor}">${safe(pShort)}${evText}</span>
            <span class="just-called-time">${safe(c.timestampLabel)}</span>
          </div>
        </div>
        <div class="just-called-note">${safe(noteText)}</div>
      </div>
    `;
  }).join('') : '<div class="quiet-note" style="padding:10px;text-align:center;">No races called yet. Waiting for polls to close.</div>';

  // 9. Completion Card / Footer
  const completionMarkup = snapshot.isFinished ? `
    <div class="final-decision-card">
      <div class="final-eyebrow">ALL RETURNS COUNTED</div>
      <div class="final-headline">${timeline.isPresidential ? (() => {
        const demEv = snapshot.scoreboard?.president?.people || 0;
        const repEv = snapshot.scoreboard?.president?.heritage || 0;
        const thirdEv = snapshot.scoreboard?.president?.third || 0;
        if (demEv >= 270) return 'Democrats Win the White House';
        if (repEv >= 270) return 'Republicans Win the White House';
        if (thirdEv >= 270) return `${safe(game?.player?.name || 'Third Party')} Wins the White House`;
        return 'Electoral College Deadlock — 12th Amendment Contingent Election';
      })() : 'Midterm Election Resolution Complete'}</div>
      <div class="final-summary">
        ${timeline.isPresidential ? `Final Electoral College: ${snapshot.scoreboard.president.people} Dem · ${snapshot.scoreboard.president.heritage} GOP` : `Senate: ${snapshot.scoreboard.senate.people} Dem · ${snapshot.scoreboard.senate.heritage} GOP | House: ${snapshot.scoreboard.house.people} Dem · ${snapshot.scoreboard.house.heritage} GOP`}
      </div>
${(game?.electionNight?.completed || snapshot.isFinished) ? v0180PollingMissBannerMarkup() : ''}
      <button type="button" class="button button-gold desk-complete-btn" id="desk-btn-complete">See the full results →</button>
    </div>
  ` : `
    <div style="font-size:11px;color:var(--dim);text-align:center;line-height:1.4;padding:8px 0;">
      States report at their own pace: two hours in the smallest, six in the largest. The desk calls a race once the margin is safe at the share counted.
    </div>
  `;

  return `
    <main class="screen election-night-screen">
      <!-- TOP DECISION DESK HEADER -->
      <header class="decision-desk-header">
        <div class="desk-header-left">
          ${statusPill}
          <span class="desk-clock" data-en-clock>${snapshot.clockLabel}</span>
          <span class="desk-title">DECISION DESK · NOV 7, ${game?.year || 2028}</span>
          <span class="badge" style="font-size:11px;margin-left:8px;background:rgba(15,23,42,0.7);padding:3px 8px;border-radius:6px;">
            ${timeline.isPresidential ? `EV: <b data-en-ev="people">${snapshot.scoreboard.president.people}</b>–<b data-en-ev="heritage">${snapshot.scoreboard.president.heritage}</b> · ` : ''}
            Sen: <b data-en-senate="people">${snapshot.scoreboard.senate.people}</b>–<b data-en-senate="heritage">${snapshot.scoreboard.senate.heritage}</b> ·
            House: <b data-en-house="people">${snapshot.scoreboard.house.people}</b>–<b data-en-house="heritage">${snapshot.scoreboard.house.heritage}</b>
          </span>
          <span data-en-call-ticker style="font-size:11px;margin-left:8px;opacity:0.85;">${snapshot.calls[0] ? safe(`${snapshot.calls[0].name}: ${getElectionPartyShort(snapshot.calls[0].winnerPartyId)}`) : 'Awaiting first calls'}</span>
        </div>
        <div class="desk-phases">
          ${phaseMarkup}
        </div>
        <div class="desk-header-right">
          <div class="desk-controls">
            <button type="button" class="desk-ctrl-btn" id="desk-btn-playpause">${paused ? '▶ Play' : '⏸ Pause'}</button>
            ${speedPillsMarkup}
            <button type="button" class="desk-ctrl-btn desk-skip-btn" id="desk-btn-skip">Skip to the end ⏭</button>
          </div>
        </div>
      </header>
      <div data-en-breaking-host></div>

      ${breakingMarkup}
      ${/* [v0.18.4 MAPS-BALLOT] */ window.RedistrictingBallotSystem?.renderBallotMeasuresStrip ? window.RedistrictingBallotSystem.renderBallotMeasuresStrip(game) : ''}

      <!-- 2-COLUMN BROADCAST GRID -->
      <div class="decision-desk-grid">
        <!-- LEFT COLUMN: MAP & THE COUNT TABLE -->
        <div class="desk-left-col">
          <div class="desk-card">
            <div class="desk-tabs-bar">
              <div class="desk-tabs-pills">
                ${tabsMarkup}
              </div>
              <div class="desk-map-mode-toggle">
                <button type="button" class="desk-mode-btn ${mapMode === 'winner' ? 'active' : ''}" data-desk-action="map-mode" data-mode="winner">Winner</button>
                <button type="button" class="desk-mode-btn ${mapMode === 'margin' ? 'active' : ''}" data-desk-action="map-mode" data-mode="margin">Margin</button>
              </div>
            </div>

            ${mapSvg}

            <div class="desk-map-footer">
              <span><b>${tabScore.people}</b> Dem · <b>${tabScore.heritage}</b> GOP · <b>${tabScore.third}</b> Other called</span>
              <span>Map brightness shows vote counted</span>
            </div>
          </div>

          <div class="desk-card">
            <div class="desk-the-count-header">
              <span>THE COUNT</span>
              <span>CLOSEST FIRST</span>
            </div>
            <div class="the-count-list">
              ${theCountMarkup}
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: SCOREBOARD, SALLOW FORECAST & JUST CALLED FEED -->
        <div class="desk-right-col">
          <div class="desk-card">
            <div class="scoreboard-title-row">
              <span class="scoreboard-title">${safe(tabTitle)}</span>
              <span style="font-size:12px;color:var(--muted)">${snapshot.isFinished ? '100% Counted' : 'Live Returns'}</span>
            </div>
            <div class="scoreboard-numbers">
              <div class="score-box-left">
                <div class="score-party-label" style="color:#3b82f6">Democrats</div>
                <div class="score-num" style="color:#3b82f6">${tabScore.people}</div>
              </div>
              <div>
                <span class="score-threshold-pill">${safe(thresholdLabel)}</span>
              </div>
              <div class="score-box-right">
                <div class="score-party-label" style="color:#ef4444">Republicans</div>
                <div class="score-num" style="color:#ef4444">${tabScore.heritage}</div>
              </div>
            </div>

            <div class="scoreboard-stacked-bar">
              <div class="stacked-segment" style="width:${demPct}%;background:#3b82f6"></div>
              <div class="stacked-segment" style="width:${thirdPct}%;background:var(--gold)"></div>
              <div class="stacked-segment" style="width:${repPct}%;background:#ef4444"></div>
            </div>

            ${tabScore.third > 0 ? `
              <div class="scoreboard-chips">
                <span class="score-chip" style="color:var(--gold)">Other / 3rd Parties: ${tabScore.third}</span>
              </div>
            ` : ''}
          </div>

          ${forecastCardMarkup}

          <div class="desk-card">
            <div class="just-called-header">
              JUST CALLED
            </div>
            <div class="just-called-list">
              ${callsMarkup}
            </div>
          </div>

          ${completionMarkup}
        </div>
      </div>
    </main>
  `;
}

function bindElectionNightControls() {
  document.querySelector('#desk-btn-playpause')?.addEventListener('click', () => {
    if (!game || !game.electionNight) return;
    game.electionNight.paused = !game.electionNight.paused;
    render();
  });

  document.querySelectorAll('[data-desk-action="speed"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = Number(btn.dataset.speed) || 1;
      if (!game || !game.electionNight) return;
      game.electionNight.speed = s;
      game.electionNight.paused = false;
      render();
    });
  });

  document.querySelector('#desk-btn-skip')?.addEventListener('click', () => {
    if (!game || !game.electionNight) return;
    game.electionNight.elapsedMinutes = 540;
    game.electionNight.completed = true;
    stopElectionNightPlayback();
    render();
  });

  document.querySelectorAll('[data-desk-action="tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (!game || !game.electionNight) return;
      game.electionNight.activeTab = tab;
      render();
    });
  });

  document.querySelectorAll('[data-desk-action="map-mode"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (!game || !game.electionNight) return;
      game.electionNight.mapMode = mode;
      render();
    });
  });

  document.querySelector('#desk-btn-dismiss-banner')?.addEventListener('click', () => {
    if (!game || !game.electionNight) return;
    game.electionNight.breakingBannerDismissed = true;
    render();
  });

  document.querySelector('#desk-btn-complete')?.addEventListener('click', () => {
    dispatchAction('election-night-complete');
    stopElectionNightPlayback();
    if (game && typeof saveGame === 'function') saveGame(game);
    render();
  });
}



function renderPrimarySvgMap(stateResults = {}) {
  const stateRows = (MAPS?.states || []).filter((s) => s.id !== 'DC');
  const paths = stateRows.map((state) => {
    const res = stateResults[state.id];
    const fill = res?.winnerColor || '#22304F';
    const opacity = res ? 0.95 : 0.38;
    const _primStName = state.name || window.PartyChairData?.STATES?.find((s) => s.id === state.id)?.name || state.id;
    const title = res
      ? `${_primStName} (${state.id}) · Winner: ${res.winnerName} (${res.shares?.[res.winnerId] || 0}% · ${res.totalDelegates || 0} del)`
      : `${_primStName} (${state.id}) · Upcoming Primary`;
    return `<path style="fill:${fill};fill-opacity:${opacity}" class="map-state-shape" d="${state.q.split('!').map(decodePath).join('')}"><title>${safe(title)}</title></path>`;
  }).join('');
  const labels = stateRows.map((s) => `<text x="${s.cx}" y="${s.cy}" class="map-label" pointer-events="none">${s.id}</text>`).join('');
  const insetIds = [ ['DC', 'District of Columbia'], ['TERR', 'Territories / Abroad'] ];
  const insets = insetIds.map(([id, name]) => {
    const res = stateResults[id];
    const col = res?.winnerColor || 'var(--line)';
    return `<button type="button" data-primary-state="${safe(id)}" style="cursor:pointer;color:inherit;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:6px;background:var(--panel2);border:1px solid ${col};font-size:12px">
      <span style="width:10px;height:10px;border-radius:50%;background:${col}"></span>
      <b>${name}:</b> ${res ? `${safe(res.winnerName)} (${res.shares?.[res.winnerId] || 0}% · ${res.totalDelegates || 0} del)` : 'Upcoming'}
    </button>`;
  }).join('');
  return `<svg class="desk-map-svg" viewBox="${MAPS?.viewBox || '0 0 960 600'}" role="img" aria-label="Presidential Primary Map">${paths}${labels}</svg><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${insets}</div>`;
}

function renderPresidentialPrimaryScreen() {
  const p = game?.activePresidentialPrimary;
  if (!p) return '';
  const _autoBar = p.stage !== 'complete' ? `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding:10px 14px;margin-bottom:12px;border-radius:10px;background:rgba(15,23,42,0.85);border:1px solid rgba(226,189,112,0.4);">
      <div style="font-size:12.5px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.paused ? '#f59e0b' : '#22c55e'};margin-right:6px;"></span>
        <b>${p.paused ? 'PRIMARY BROADCAST PAUSED' : 'AUTO-PLAYING PRESIDENTIAL PRIMARY'}</b>
        <span style="opacity:0.8;margin-left:8px;">Sit back and watch the primaries unfold (~2–3 min at 1×), or pause anytime.</span>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button type="button" class="button button-secondary" style="font-size:11.5px;padding:4px 10px;" data-v0182-primary="primary-toggle-pause">${p.paused ? '▶ Resume' : '⏸ Pause'}</button>
        <button type="button" class="button ${(p.speed || 1) === 1 ? 'button-gold' : 'button-secondary'}" style="font-size:11.5px;padding:4px 8px;" data-v0182-primary="primary-set-speed" data-speed="1">1×</button>
        <button type="button" class="button ${p.speed === 2 ? 'button-gold' : 'button-secondary'}" style="font-size:11.5px;padding:4px 8px;" data-v0182-primary="primary-set-speed" data-speed="2">2×</button>
        <button type="button" class="button ${p.speed === 4 ? 'button-gold' : 'button-secondary'}" style="font-size:11.5px;padding:4px 8px;" data-v0182-primary="primary-set-speed" data-speed="4">4×</button>
        <button type="button" class="button button-secondary" style="font-size:11.5px;padding:4px 10px;" data-v0182-primary="primary-skip-to-end">Skip to Nominee ⏭</button>
      </div>
    </div>
  ` : '';
  const activeCands = (p.candidates || []).slice().sort((a, b) => Number(b.delegates || 0) - Number(a.delegates || 0) || Number(b.nationalPoll || 0) - Number(a.nationalPoll || 0));
  const curDay = p.schedule?.[p.scheduleIndex] || null;
  const statesToday = curDay?.states || [];
  if (p.stage === 'voting' && statesToday.length && !statesToday.includes(primaryFilterStatePick)) {
    primaryFilterStatePick = statesToday[0];
  }

  const delegateBars = activeCands.map((c) => {
    const pct = Math.min(100, Math.round((Number(c.delegates || 0) / Math.max(1, p.clinchTarget)) * 100));
    return `
      <div style="margin-bottom:8px;opacity:${c.droppedOut ? '0.45' : '1'}">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:3px">
          <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c.color};margin-right:6px"></span><b>${safe(c.name)}</b> <small style="color:var(--muted)">(${safe(c.factionName)}${c.isGenerated ? ' · Newcomer' : ''}${c.droppedOut ? ' · Dropped Out' : ''})</small></span>
          <span><b>${c.delegates || 0}</b> / ${p.clinchTarget} del · ${Number(c.nationalPoll || 0).toFixed(1)}%</span>
        </div>
        <div style="height:8px;background:var(--panel2);border-radius:999px;overflow:hidden;border:1px solid var(--line)">
          <div style="height:100%;width:${pct}%;background:${c.color}"></div>
        </div>
      </div>
    `;
  }).join('');

  let stagePanel = '';
  if (p.stage === 'order') {
    stagePanel = `
      <div class="v14-slate-card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
          <div>
            <div class="eyebrow">Step 1 · Primary Calendar Order</div>
            <h3 style="margin:2px 0">Customize Your ${p.year} Primary Schedule</h3>
          </div>
          <button type="button" class="button button-gold" data-pri-action="advance">Lock Order &amp; Begin 5 Debate Days</button>
        </div>
        <p class="map-summary" style="margin-bottom:10px">Promote states earlier (+2 State Standing, +1 Base Trust) or relegate states later (-2 State Standing, -1 Base Trust). Your custom order persists into future presidential cycles.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px">
          ${(p.schedule || []).map((day, dIdx) => `
            <div class="v165-chamber-card">
              <div style="font-weight:700;margin-bottom:6px">${safe(day.date)} · ${safe(day.label)}</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${(day.states || []).map((st) => `
                  <span style="display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:6px;background:var(--panel2);border:1px solid var(--line);font-size:12px">
                    <b>${safe(st)}</b>
                    ${dIdx > 0 ? `<button type="button" class="button button-small" style="padding:0 4px" data-pri-reorder="${safe(st)}" data-pri-dir="earlier" title="Promote earlier">↑</button>` : ''}
                    ${dIdx < p.schedule.length - 1 ? `<button type="button" class="button button-small" style="padding:0 4px" data-pri-reorder="${safe(st)}" data-pri-dir="later" title="Relegate later">↓</button>` : ''}
                  </span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (p.stage === 'debates') {
    stagePanel = `
      <div class="v14-slate-card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
          <div>
            <div class="eyebrow">Step 2 · Nationally Televised Debates</div>
            <h3 style="margin:2px 0">Debate Day ${p.debateDay} of ${p.maxDebateDays}</h3>
          </div>
          <button type="button" class="button button-gold" data-pri-action="advance">Stay Neutral (Skip Debate)</button>
        </div>
        <p class="map-summary" style="margin-bottom:10px">Deploying party resources behind a primary contender alters debate performance and public stature, but stirs resentment among rival caucuses and draws on leadership standing. Remaining entirely neutral across all primary contests fosters deep party-wide harmony.</p>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:6px">
          <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted)">Deployable Intervention Assets:</span>
          <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" data-pri-asset="politicalCapital" ${primaryFilterAssets.politicalCapital ? 'checked' : ''}>
            <span>Political Capital <span style="color:var(--muted)">(Debate &amp; Polling Stature)</span></span>
          </label>
          <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" data-pri-asset="staffSupport" ${primaryFilterAssets.staffSupport ? 'checked' : ''}>
            <span>Field Staff <span style="color:var(--muted)">(Early State Operations)</span></span>
          </label>
          <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" data-pri-asset="donorConduits" ${primaryFilterAssets.donorConduits ? 'checked' : ''}>
            <span>Donor Conduits <span style="color:var(--muted)">(Fundraising Coffers)</span></span>
          </label>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px">
          ${activeCands.filter((c) => !c.droppedOut).map((c) => `
            <div class="v165-chamber-card">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="width:12px;height:12px;border-radius:50%;background:${c.color}"></span>
                <b>${safe(c.name)}</b>
              </div>
              <div style="font-size:12px;color:var(--muted);margin-bottom:8px">${safe(c.factionName)} · Q ${Number(c.quality).toFixed(1)} · Fame ${Math.round(c.fame)}</div>
              <button type="button" class="button button-small" data-pri-filter-cand="${safe(c.id)}">Deploy Primary Support</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (p.stage === 'voting') {
    stagePanel = `
      <div class="v14-slate-card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
          <div>
            <div class="eyebrow">Step 3 · Primary Election Day (${p.scheduleIndex + 1} / ${p.schedule.length})</div>
            <h3 style="margin:2px 0">${safe(curDay?.date || '')} · ${safe(curDay?.label || 'Primary Day')} (${statesToday.length} contest${statesToday.length === 1 ? '' : 's'})</h3>
          </div>
          <button type="button" class="button button-gold" data-pri-action="advance">Run Primary Neutral (No Intervention)</button>
        </div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:6px">
          <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted)">Deployable Intervention Assets:</span>
          <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" data-pri-asset="politicalCapital" ${primaryFilterAssets.politicalCapital ? 'checked' : ''}>
            <span>Political Capital</span>
          </label>
          <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" data-pri-asset="staffSupport" ${primaryFilterAssets.staffSupport ? 'checked' : ''}>
            <span>Field Staff</span>
          </label>
          <label style="font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" data-pri-asset="donorConduits" ${primaryFilterAssets.donorConduits ? 'checked' : ''}>
            <span>Donor Conduits</span>
          </label>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
          <label style="font-size:13px"><b>Focus Early-State Ground Operations:</b></label>
          <select id="pri-filter-state">
            ${statesToday.map((st) => `<option value="${safe(st)}" ${primaryFilterStatePick === st ? 'selected' : ''}>${safe(st)}</option>`).join('')}
          </select>
          ${activeCands.filter((c) => !c.droppedOut).slice(0, 6).map((c) => `
            <button type="button" class="button button-small" data-pri-filter-cand="${safe(c.id)}" style="border-color:${c.color}">Support ${safe(c.name)}</button>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    stagePanel = `
      <div class="v14-slate-card" style="margin-bottom:14px">
        <div class="eyebrow">Nomination Clinched · ${p.year}</div>
        <h2 style="margin:4px 0">${safe(p.nomineeName)} Wins the Presidential Nomination!</h2>
        <p class="map-summary" style="margin-bottom:12px">
          ${p.neutralityBonusAwarded ? '<b>Full Neutrality Reward:</b> Every faction in your party rallied around the chair\'s principled neutrality, lifting coalition morale! ' : ''}
          Losing major factions received -2 Confidence. Full results and rival primary maps are archived in the Primary Archive.
        </p>
        <button type="button" class="button button-gold" data-pri-action="finish">Proceed to General Campaign</button>
      </div>
    `;
  }

  return `
    <header class="topbar">
      <div class="brand"><img class="brand-icon" src="assets/coalition-builder-icon.svg" alt=""> COALITION BUILDER: <i>PARTY CHAIR</i></div>
      <div class="topbar-actions">
        <span style="--party:${game.player.color}" class="status-party">${safe(game.player.name)}</span>
        <span>${p.year} · PRESIDENTIAL PRIMARY (${p.interventionsCount === 0 ? 'Neutral' : `${p.interventionsCount} Interventions`})</span>
        <button type="button" class="text-button" id="open-primary-archive-10" data-dup-id="open-primary-archive">Primary Archive</button>
        <button type="button" class="text-button" id="open-save-slots-11" data-dup-id="open-save-slots">Saves (5 Slots)</button>
      </div>
    </header>
    <main class="screen campaign-screen">${_autoBar}
      ${stagePanel}
      <div style="display:grid;grid-template-columns:1.35fr 1fr;gap:14px;align-items:start">
        <section class="panel section-panel">
          <div class="eyebrow">Interactive Primary Map (${Object.keys(p.stateResults || {}).length} States Reported)</div>
          ${renderPrimarySvgMap(p.stateResults || {})}
        </section>
        <section class="panel section-panel">
          <div class="eyebrow">Live Delegate Race (${p.clinchTarget} to Clinch)</div>
          <div style="margin-top:10px">${delegateBars}</div>
        </section>
      </div>
    </main>
  `;
}

function renderPrimaryArchiveModalMarkup() {
  if (!primaryArchiveOpen || !game) return '';
  const years = Object.keys(game.simulatedPrimaries || {}).sort((a, b) => Number(b) - Number(a));
  if (years.length && (!primaryArchiveYear || !years.includes(String(primaryArchiveYear)))) {
    primaryArchiveYear = years[0];
  }
  const latestYr = primaryArchiveYear || years[0];
  const byParty = latestYr ? (game.simulatedPrimaries[latestYr] || {}) : {};
  const partyIds = Array.from(new Set([...Object.keys(byParty || {}), ...Object.keys(game.presidentialTicket || {})].filter((pid) => byParty?.[pid])));
  if (partyIds.length && !byParty[primaryArchiveParty]) primaryArchiveParty = partyIds[0];
  const rec = byParty[primaryArchiveParty] || null;
  return `
    <div class="v167-save-slots-modal" id="primary-archive-backdrop">
      <div class="v167-save-slots-card" style="width:min(860px,96vw);max-height:88vh;overflow:auto" role="dialog" aria-label="Simulated Primaries Archive">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div>
            <div class="eyebrow">Simulated Primaries Archive${latestYr ? ` · ${latestYr}` : ''}</div>
            <h2 style="margin:2px 0 0">Cross-Party Primary Returns &amp; Maps</h2>
          </div>
          <button type="button" class="button button-small" id="close-primary-archive">Close</button>
        </div>
        ${!partyIds.length ? '<p class="map-summary">No presidential primaries have been simulated yet.</p>' : `
          ${years.length > 1 ? `<div class="v07-race-pills" style="margin-bottom:8px">
            ${years.map((yr) => `<button type="button" class="v07-race-pill ${String(latestYr) === String(yr) ? 'selected' : ''}" data-archive-year="${safe(yr)}">${safe(yr)} Cycle</button>`).join('')}
          </div>` : ''}
          <div class="v07-filter-tabs" style="margin-bottom:10px">
            ${partyIds.map((pid) => `<button type="button" data-archive-party="${safe(pid)}" class="${primaryArchiveParty === pid ? 'selected' : ''}">${safe(formatPartyDisplayName(pid, 'short'))}</button>`).join('')}
          </div>
          ${rec ? `
            <p class="map-summary"><b>Nominee:</b> ${safe(rec.nomineeName)} · <b>Clinch Target:</b> ${rec.clinchTarget} delegates</p>
            ${renderPrimarySvgMap(rec.stateResults || {})}
            <div style="margin-top:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">
              ${(rec.candidates || []).slice(0, 8).map((c) => `
                <div class="v165-chamber-card" style="padding:8px">
                  <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c.color};margin-right:6px"></span><b>${safe(c.name)}</b></div>
                  <small style="color:var(--muted)">${safe(c.factionName)} · <b>${c.delegates || 0}</b> del</small>
                </div>
              `).join('')}
            </div>
          ` : ''}
        `}
      </div>
    </div>
  `;
}

function renderSaveSlotsModalMarkup() {
  if (!saveSlotsModalOpen) return '';
  const slots = cachedSaveSlots || (window.PartyChairEngine?.listSaveSlots ? window.PartyChairEngine.listSaveSlots() : []);
  return `
    <div class="v167-save-slots-modal" id="save-slots-backdrop">
      <div class="v167-save-slots-card" role="dialog" aria-label="Local Save Slots">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div>
            <div class="eyebrow">Local IndexedDB · 5 Slots (100MB+ Ready)</div>
            <h2 style="margin:2px 0 0">Campaign Save Slots</h2>
          </div>
          <button type="button" class="button button-small" id="close-save-slots">Close</button>
        </div>
        <p class="map-summary" style="margin-bottom:10px">Save and load up to 5 local campaigns right in your browser or desktop app.</p>
        ${slots.map((s) => {
          const ts = s.savedAt ? new Date(s.savedAt).toLocaleString() : '';
          return `
            <div class="v167-save-slot-row">
              <div>
                <b>Slot ${s.slot}: ${s.empty ? 'Empty Slot' : safe(s.partyName)}</b>
                <div style="font-size:12px;color:var(--muted)">
                  ${s.empty ? 'No campaign saved yet.' : `${s.year} · ${safe(s.phase)} · Saved ${safe(ts)}`}
                </div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${game ? `<button type="button" class="button button-small button-gold" data-save-slot="${s.slot}">${s.empty ? 'Save' : 'Overwrite'}</button>` : ''}
                ${!s.empty ? `<button type="button" class="button button-small" data-load-slot="${s.slot}">Load</button>` : ''}
                ${!s.empty ? `<button type="button" class="button button-small" data-delete-slot="${s.slot}">Delete</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function render() {
  if (typeof document !== 'undefined') { const _tip = document.getElementById('en-hover-tooltip'); if (_tip && _tip.style) _tip.style.display = 'none'; }
  if (typeof ensurePrimaryAutoPlayback === 'function') ensurePrimaryAutoPlayback();
  syncGameSessionState();
  if (game && V07 && (!game.sittingMembers?.length || !game.trust || !game.leadershipRoles)) {
    game = V07.hydrateV07GameState(game);
  }
  if (game && game.electionNight?.active) {
    app.innerHTML = renderElectionNightScreen();
    bindElectionNightControls();
    ensureElectionNightPlayback();
    return;
  }
  stopElectionNightPlayback();
  if (game && game.phase === 'presidential-primary' && game.activePresidentialPrimary) {
    app.innerHTML = renderPresidentialPrimaryScreen() + renderSaveSlotsModalMarkup() + renderPrimaryArchiveModalMarkup();
    if (game) saveGame(game);
    bind();
    return;
  }
  const gameOverOverlay = (game && game.gameOver) ? `
    <div id="party-collapse-gameover-modal" style="position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,0.88);display:flex;align-items:center;justify-content:center;padding:24px">
      <div style="max-width:520px;width:100%;background:#0f172a;border:2px solid #ef4444;border-radius:12px;padding:28px;color:#f8fafc;box-shadow:0 24px 60px rgba(0,0,0,0.65);text-align:center">
        <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#f87171;font-weight:700;margin-bottom:8px">Game Over · ${safe(String(game.year || 2028))}</div>
        <h2 style="margin:0 0 12px;font-size:24px;color:#fff">${safe(game.gameOverTitle || 'Party Collapsed — All Factions Lost')}</h2>
        <p style="margin:0 0 22px;font-size:14.5px;line-height:1.55;color:#cbd5e1">${safe(game.gameOverMessage || 'Every faction in your party has abandoned the coalition. Without a base of support, your party has collapsed.')}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button type="button" class="button" data-action="open-political-atlas" data-atlas-start-tab="legacy" style="padding:12px 20px;font-size:14px;font-weight:700">Open Political Atlas &amp; Legacy</button>
          <button type="button" id="btn-gameover-new-party" class="button button-gold" style="padding:12px 24px;font-size:14px;font-weight:700">Return to Party Setup</button>
        </div>
      </div>
    </div>
  ` : '';
  // [v0.18.4 ATLAS-HOTSEAT]
  const atlasHotseatOverlay = window.AtlasMultiplayerSystem ? window.AtlasMultiplayerSystem.renderOverlays(game, MAPS) : '';
  app.innerHTML = (game ? campaignMarkup() : setupMarkup()) + gameOverOverlay + renderSaveSlotsModalMarkup() + (game ? renderPrimaryArchiveModalMarkup() : '') + atlasHotseatOverlay;
  if (game) saveGame(game);
  bind();
  // [v0.18.4 ATLAS-HOTSEAT]
  if (window.AtlasMultiplayerSystem) {
    window.AtlasMultiplayerSystem.bindUI(game, { setGame: (g) => { game = g; }, render, saveGame, resetToSetup: () => { game = null; render(); } });
  }
  renderTutorial();
}

function dispatchAction(actionId, payload = {}) {
  if (
    actionId === 'start-campaign' &&
    game &&
    (game.year || 2028) % 4 === 0 &&
    !game.simulatedPrimaries?.[game.year || 2028]?.[playerIdentity()] &&
    game.phase !== 'presidential-primary'
  ) {
    actionId = 'start-presidential-primary';
  }
  if (game && game.phase === 'organizing' && (game.actionsLeft <= 0 || typeof game.actionsLeft !== 'number') && (game.organizingActionsRemaining > 0)) {
    game.actionsLeft = Math.min(4, game.organizingActionsRemaining);
  }
  const prevActions = game?.actionsLeft ?? 0;
  const prevOrg = game?.organizingActionsRemaining;
  game = takeAction(game, actionId, payload);
  if (game && game.phase === 'organizing') {
    if (typeof game.organizingActionsRemaining !== 'number') {
      game.organizingActionsRemaining = 20;
    }
    if (game.actionsLeft < prevActions && game.organizingActionsRemaining === prevOrg) {
      const spent = prevActions - game.actionsLeft;
      game.organizingActionsRemaining = Math.max(0, game.organizingActionsRemaining - spent);
      if (game.organizingActionsRemaining > 0 && game.actionsLeft <= 0) {
        game.actionsLeft = Math.min(4, game.organizingActionsRemaining);
      }
    }
  }
  if (game && window.PartyChairEngine?.enforceGameTrustCaps) {
    window.PartyChairEngine.enforceGameTrustCaps(game);
  }
  if (game && typeof saveGame === 'function') {
    saveGame(game);
  }
  if (V07 && game) {
    // Fallback safeguard if any field stayed stale
    if (!game.trust) game = V07.hydrateV07GameState(game);
  }
}

function bind() {
  const nameInput = document.querySelector('#custom-party-name');
  const leaderInput = document.querySelector('#custom-leader-name');
  const colorInput = document.querySelector('#custom-party-color');
  document.querySelectorAll('[data-template]').forEach((button) => button.addEventListener('click', () => {
    selectedTemplate = button.dataset.template;
    custom = false;
    if (nameInput) customPartyName = nameInput.value;
    render();
  }));
  document.querySelectorAll('[data-leader-archetype]').forEach((button) => button.addEventListener('click', () => {
    selectedLeaderArchetype = button.dataset.leaderArchetype;
    if (nameInput) customPartyName = nameInput.value;
    render();
  }));

  // Consolidated bindings for Custom Party Inputs (REQ-246 & REQ-263)
  const syncPartyName = (e) => {
    customPartyName = e.target.value;
    e.target.classList.remove('invalid');
  };
  ['#custom-party-name', '#party-name'].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.addEventListener('input', syncPartyName);
      el.addEventListener('change', syncPartyName);
    }
  });

  const syncLeaderName = (e) => {
    customLeaderName = e.target.value;
  };
  ['#custom-leader-name', '#leader-name'].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.addEventListener('input', syncLeaderName);
      el.addEventListener('change', syncLeaderName);
    }
  });

  const syncColorValue = (e) => {
    customPartyColor = e.target.value;
    ['#custom-party-color', '#custom-party-color-hex', '#party-color', '#party-color-hex'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el && el !== e.target && el.value !== e.target.value) {
        el.value = e.target.value;
      }
    });
  };
  ['#custom-party-color', '#custom-party-color-hex', '#party-color', '#party-color-hex'].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.addEventListener('input', syncColorValue);
      el.addEventListener('change', syncColorValue);
    }
  });

  document.querySelectorAll('[data-custom-color]').forEach((btn) => btn.addEventListener('click', () => {
    customPartyColor = btn.dataset.customColor;
    render();
  }));

  document.querySelectorAll('[data-custom-cat]').forEach((button) => button.addEventListener('click', () => {
    customIssueCategory = button.dataset.customCat;
    if (nameInput) customPartyName = nameInput.value;
    render();
  }));

  document.querySelectorAll('[data-custom-issue]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const issueId = input.dataset.customIssue;
      const val = Number(event.target.value);
      const positions = getCustomPartyIssuePositions();
      positions[issueId] = val;

      const out = document.querySelector(`#custom-output-${issueId}`);
      if (out) out.textContent = `${val}/10`;

      const descEl = document.querySelector(`#custom-stance-desc-${issueId}`);
      if (descEl) {
        const desc = window.PartyChairData?.STANCE_DESCRIPTIONS?.[issueId]?.[val] || '';
        descEl.textContent = desc;
      }

      input.style.setProperty('--range', `${((val - 1) / 9) * 100}%`);

      const cleaned = cleanCustomIssuePositions(positions);
      const axes = window.PartyChairEngine?.recalculateWeightedPlatformAxes
        ? window.PartyChairEngine.recalculateWeightedPlatformAxes(cleaned, template(), [])
        : { economic: 0, social: 0, climate: 0, local: 0 };

      const eco = document.querySelector('#custom-axis-economic');
      if (eco) eco.textContent = formatAxisValue(axes.economic);
      const soc = document.querySelector('#custom-axis-social');
      if (soc) soc.textContent = formatAxisValue(axes.social);
      const cli = document.querySelector('#custom-axis-climate');
      if (cli) cli.textContent = formatAxisValue(axes.climate);
      const loc = document.querySelector('#custom-axis-local');
      if (loc) loc.textContent = formatAxisValue(axes.local);
    });
  });

  document.querySelector('#cur-pol-office')?.addEventListener('change', (e) => {
    customPoliticianOffice = e.target.value;
    if (customPoliticianOffice === 'governor') customPoliticianSeat = customPoliticianState;
    else if (customPoliticianOffice === 'senate') customPoliticianSeat = '1';
    else customPoliticianSeat = `${customPoliticianState}-1`;
    render();
  });
  document.querySelector('#cur-pol-state')?.addEventListener('change', (e) => {
    customPoliticianState = e.target.value;
    if (customPoliticianOffice === 'governor') customPoliticianSeat = customPoliticianState;
    else if (customPoliticianOffice === 'senate') customPoliticianSeat = '1';
    else customPoliticianSeat = `${customPoliticianState}-1`;
    render();
  });
  document.querySelector('#cur-pol-seat')?.addEventListener('change', (e) => {
    customPoliticianSeat = e.target.value;
    render();
  });

  document.querySelector('#btn-close-alloc-modal')?.addEventListener('click', () => {
    allocValidationModalOpen = false;
    render();
  });
  document.querySelector('#alloc-validation-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'alloc-validation-modal-overlay') {
      allocValidationModalOpen = false;
      render();
    }
  });

  const start = document.querySelector('#start-game');
  if (start) start.addEventListener('click', () => {
    if (nameInput) customPartyName = nameInput.value;
    if (leaderInput) customLeaderName = leaderInput.value;
    const colorInput = document.querySelector('#custom-party-color-hex')
      || document.querySelector('#custom-party-color')
    if (colorInput) customPartyColor = colorInput.value;

    const isCustomMode = custom || selectedTemplate === 'custom';
    const customName = (customPartyName || '').trim();
    if (isCustomMode && !customName) {
      nameInput?.focus();
      nameInput?.classList.add('invalid');
      return;
    }

    if (isCustomMode && customOrigin === 'not_major_movement') {
      const allocSum = Object.values(custom100kStateAllocations || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
      if (allocSum !== 100000) {
        allocValidationModalOpen = true;
        allocValidationSum = allocSum;
        render();
        return;
      }
    } else if (isCustomMode && (!Array.isArray(customSelectedFactionIds) || customSelectedFactionIds.length === 0)) {
      render();
      return;
    }

    const archetypeChoice = custom ? selectedLeaderArchetype : null;
    const positions = custom ? cleanCustomIssuePositions(getCustomPartyIssuePositions()) : null;
    const calculatedAxes = (custom && positions && window.PartyChairEngine?.recalculateWeightedPlatformAxes)
      ? window.PartyChairEngine.recalculateWeightedPlatformAxes(positions, template(), [])
      : null;

    let claimedSeat = null;
    if (custom && archetypeChoice === 'current-politician') {
      const office = customPoliticianOffice || 'governor';
      const stateId = customPoliticianState || 'PA';
      const seatId = customPoliticianSeat || (office === 'governor' ? stateId : office === 'senate' ? '1' : `${stateId}-1`);
      const incumbent = window.PartyChairEngine?.getIncumbentForClaimedSeat
        ? window.PartyChairEngine.getIncumbentForClaimedSeat(office, stateId, seatId)
        : null;
      claimedSeat = {
        office,
        stateId,
        seatId,
        incumbentName: incumbent?.name || null,
        party: incumbent?.party || null,
        districtId: office === 'house' ? seatId : undefined,
        senateClass: office === 'senate' ? (parseInt(seatId, 10) || 1) : undefined,
      };
    }

    const customValues = isCustomMode ? {
      ...(calculatedAxes || {}),
      issuePositions: positions,
      leaderArchetype: archetypeChoice,
      color: customPartyColor || '#8b5cf6',
      leaderName: (customLeaderName || '').trim() || undefined,
      claimedSeat,
      code: customPartyCode,
      emblem: customSelectedEmblem,
      motto: customPartyMotto,
      foundingStateId: customFoundingStateId,
      origin: customOrigin,
      schismParentPartyId: customSchismParent,
      charterTraits: customCharterTraits,
    } : {};

    game = createGame({
      baseTemplateId: selectedTemplate,
      customName: isCustomMode ? customName : '',
      customValues,
      issuePositions: positions,
      customOrigin,
      customCharterTraits,
      customCode: customPartyCode,
      customEmblem: customSelectedEmblem,
      customMotto: customPartyMotto,
      foundingStateId: customFoundingStateId,
      schismParentPartyId: customSchismParent,
      selectedFactionIds: customSelectedFactionIds,
      customFactionName: custom100kName,
      customFactionSliders: custom100kSliders,
      customFactionKeyIssues: custom100kIssues,
      customFactionStateAllocations: custom100kStateAllocations,
    });
    if (V07) game = V07.hydrateV07GameState(game);
    // [v0.18.4 ATLAS-HOTSEAT]
    if (window.AtlasMultiplayerSystem && game) game = window.AtlasMultiplayerSystem.applyHotseatSetupToGame(game);
    if (archetypeChoice && game) {
      game.player = game.player || {};
      game.player.leaderArchetype = archetypeChoice;
      if (customPartyColor) game.player.color = customPartyColor;
      if (customLeaderName) game.player.leaderName = customLeaderName;
    }
    resetCustomPartySetupDefaults();
    const tutorialStatus = JSON.parse(localStorage.getItem(TUTORIAL_STORAGE_KEY) || 'null')?.status;
    if (!['completed', 'skipped'].includes(tutorialStatus)) {
      tutorialActive = true;
      tutorialStepIndex = 0;
      persistTutorial('active');
    }
    render();
  });

  // Top-level Fullscreen Tab Bar (REQ-01)
  document.querySelectorAll('[data-main-tab]').forEach((button) => button.addEventListener('click', () => {
    dispatchAction('set-active-tab', { tab: button.dataset.mainTab });
    render();
  }));

  // 4-Step Guided Turn Workflow (REQ-02)
  document.querySelectorAll('[data-turn-step]').forEach((button) => button.addEventListener('click', () => {
    dispatchAction('set-turn-step', { step: Number(button.dataset.turnStep) });
    render();
  }));
  document.querySelector('#step-back')?.addEventListener('click', () => {
    dispatchAction('set-turn-step', { step: Math.max(1, currentStep() - 1) });
    render();
  });
  document.querySelector('#step-next')?.addEventListener('click', () => {
    dispatchAction('set-turn-step', { step: Math.min(5, currentStep() + 1) });
    render();
  });

  // Step 1: 40 Issue Sliders (REQ-37 Unified Platform)
  document.querySelectorAll('[data-issue-category]').forEach((button) => button.addEventListener('click', () => {
    issueCategory = button.dataset.issueCategory;
    render();
  }));
  document.querySelectorAll('[data-issue]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const val = Number(event.target.value);
      const desc = window.PartyChairData?.STANCE_DESCRIPTIONS?.[input.dataset.issue]?.[val] || '';
      const out = document.querySelector(`output[for="issue-${input.dataset.issue}"]`);
      if (out) out.textContent = desc;
      const descEl = document.querySelector(`#stance-desc-${input.dataset.issue}`);
      if (descEl) descEl.textContent = desc;
      input.setAttribute('aria-label', `${input.dataset.issue} position: ${desc}`);
      input.style.setProperty('--range', `${((val - 1) / 9) * 100}%`);
    });
    input.addEventListener('change', (event) => {
      completeTutorialStep('issue-slider');
      dispatchAction('set-issue-position', { issueId: input.dataset.issue, value: Number(event.target.value) });
      render();
    });
  });

  // Step 2: Two-Tier Strategic Priorities (PRIORITIES_REWORK_DESIGN.md)
  // Main Priorities Deck: Quest Selection Modal triggers
  document.querySelectorAll('[data-open-quest-modal]').forEach((el) => {
    const handler = () => {
      questModalTargetSlot = Number(el.dataset.openQuestModal) || 0;
      questModalOpen = true;
      render();
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });

  document.querySelector('#close-quest-modal')?.addEventListener('click', () => {
    questModalOpen = false;
    render();
  });

  document.querySelectorAll('[data-pick-main-quest]').forEach((btn) => btn.addEventListener('click', () => {
    const questId = btn.dataset.pickMainQuest;
    const slotIdx = Number(btn.dataset.slotIndex) || 0;
    dispatchAction('select-main-priority', { questId, slotIndex: slotIdx });
    questModalOpen = false;
    render();
  }));

  document.querySelectorAll('[data-remove-main-quest]').forEach((btn) => btn.addEventListener('click', () => {
    const slotIdx = Number(btn.dataset.removeMainQuest) || 0;
    dispatchAction('deselect-main-priority', { slotIndex: slotIdx });
    render();
  }));

  // Additional Priorities Deck: Slot Type Switchers
  document.querySelectorAll('[data-set-additional-type]').forEach((btn) => btn.addEventListener('click', () => {
    if (game.focusesLocked) return;
    const maxFocusSlots = getPlayerMaxFocusSlots(game);

    const slotIdx = Number(btn.dataset.setAdditionalType) || 0;
    const newType = btn.dataset.type;
    
    if (!game.priorities) {
      game.priorities = { main: [], additional: [] };
    }
    if (!Array.isArray(game.priorities.additional)) {
      game.priorities.additional = [];
    }
    while (game.priorities.additional.length < maxFocusSlots) {
      game.priorities.additional.push({ type: 'issue', targetId: '' });
    }

    const currentSlot = game.priorities.additional[slotIdx] || { type: 'issue', targetId: '' };
    if (currentSlot.type !== newType) {
      game.priorities.additional[slotIdx] = { type: newType, targetId: '' };
      dispatchAction('set-additional-priority-type', { slotIndex: slotIdx, type: newType });
      render();
    }
  }));

  // Additional Priorities Deck: Target Dropdown Change
  document.querySelectorAll('[data-additional-target]').forEach((select) => select.addEventListener('change', (e) => {
    if (game.focusesLocked) return;
    const maxFocusSlots = getPlayerMaxFocusSlots(game);

    const slotIdx = Number(select.dataset.additionalTarget) || 0;
    const targetId = e.target.value;

    if (!game.priorities) {
      game.priorities = { main: [], additional: [] };
    }
    if (!Array.isArray(game.priorities.additional)) {
      game.priorities.additional = [];
    }
    while (game.priorities.additional.length < maxFocusSlots) {
      game.priorities.additional.push({ type: 'issue', targetId: '' });
    }

    const currentType = game.priorities.additional[slotIdx]?.type || 'issue';
    game.priorities.additional[slotIdx] = { type: currentType, targetId };

    dispatchAction('set-additional-priority', { slotIndex: slotIdx, type: currentType, targetId });
    render();
  }));

  // Additional Priorities Deck: Clear Slot (REQ-155)
  document.querySelectorAll('[data-clear-additional-slot]').forEach((btn) => btn.addEventListener('click', () => {
    if (game.focusesLocked) return;
    const slotIdx = Number(btn.dataset.clearAdditionalSlot) || 0;
    dispatchAction('clear-additional-priority', { slotIndex: slotIdx });
    render();
  }));

  // REQ-155: Lock In Party Focuses Action
  document.querySelector('#btn-lock-party-focuses')?.addEventListener('click', () => {
    if (game.focusesLocked) return;
    dispatchAction('lock-party-focuses', {});
    render();
  });

  // Major Priorities Confirmation Modal & Lock Handlers (REQ-97)
  document.querySelector('#btn-lock-major-priorities-confirm')?.addEventListener('click', () => {
    majorPrioritiesConfirmModalOpen = false;
    game.prioritiesLocked = true;
    dispatchAction('lock-priorities', {});
    render();
  });
  document.querySelector('#btn-lock-major-priorities-cancel')?.addEventListener('click', () => {
    majorPrioritiesConfirmModalOpen = false;
    render();
  });
  document.querySelector('#major-priorities-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'major-priorities-modal-overlay') {
      majorPrioritiesConfirmModalOpen = false;
      render();
    }
  });

  // Bench Quick Filters Handler (REQ-93)
  document.querySelectorAll('[data-bench-filter]').forEach((button) => button.addEventListener('click', () => {
    sittingMembersFilter = button.dataset.benchFilter || 'all';
    render();
  }));

  // Legacy Step 2 fallbacks for compatibility
  document.querySelectorAll('[data-select-overall-quest]').forEach((button) => button.addEventListener('click', () => {
    dispatchAction('select-overall-priority-quest', { questId: button.dataset.selectOverallQuest });
    render();
  }));
  document.querySelector('[data-clear-overall-quest]')?.addEventListener('click', () => {
    dispatchAction('select-overall-priority-quest', { questId: null });
    render();
  });
  document.querySelectorAll('[data-priority-cat]').forEach((button) => button.addEventListener('click', () => {
    priorityIssueCategory = button.dataset.priorityCat;
    render();
  }));
  document.querySelectorAll('[data-toggle-issue-priority]').forEach((button) => button.addEventListener('click', () => {
    dispatchAction('toggle-issue-priority', { issueId: button.dataset.toggleIssuePriority });
    render();
  }));
  document.querySelectorAll('[data-toggle-region-priority]').forEach((button) => button.addEventListener('click', () => {
    dispatchAction('toggle-regional-priority', { region: button.dataset.toggleRegionPriority });
    render();
  }));

  // Step 3: Primary Endorsements (REQ-04, REQ-05, REQ-08, REQ-10)
  document.querySelectorAll('[data-primary-filter]').forEach((button) => button.addEventListener('click', () => {
    primaryFilter = button.dataset.primaryFilter;
    render();
  }));
  document.querySelectorAll('[data-pick-race]').forEach((button) => button.addEventListener('click', () => {
    primaryRace = button.dataset.pickRace;
    render();
  }));
  document.querySelectorAll('[data-pick-statewide-state]').forEach((button) => button.addEventListener('click', () => {
    primaryStatewideState = button.dataset.pickStatewideState;
    const data = window.PartyChairData || {};
    const first = (data.STATEWIDE_OFFICES_REGISTRY || []).find((o) => o.stateId === primaryStatewideState);
    if (first) primaryRace = `statewide:${first.id}`;
    render();
  }));
  document.querySelectorAll('[data-contest-seo]').forEach((button) => button.addEventListener('click', () => {
    dispatchAction('contest-statewide-office', { officeId: button.dataset.contestSeo });
    render();
  }));
  document.querySelectorAll('[data-contest-seo-slate]').forEach((button) => button.addEventListener('click', () => {
    dispatchAction('contest-statewide-slate', { stateId: button.dataset.contestSeoSlate });
    render();
  }));
  // Step 4: Bicameral State Legislative Slate Filter & +/- Tier Stepper Controls (v0.16.9.1 fix)
  document.querySelectorAll('[data-slate-filter]').forEach((button) => button.addEventListener('click', () => {
    bicameralChamberFilter = button.dataset.slateFilter || 'all';
    render();
  }));
  document.querySelectorAll('[data-slate-step]').forEach((button) => button.addEventListener('click', () => {
    const delta = Number(button.dataset.slateStep || 0);
    const stateId = button.dataset.state;
    const chamber = button.dataset.chamber || (stateId === 'NE' ? 'unicameral' : 'house');
    if (stateId && delta) {
      dispatchAction('set-state-legislative-slate-tier', { stateId, chamber, delta });
      render();
    }
  }));
  document.querySelector('#primary-race')?.addEventListener('change', (event) => {
    completeTutorialStep('endorse-candidate');
    primaryRace = event.target.value;
    render();
  });
  document.querySelector('#primary-party')?.addEventListener('change', (event) => {
    primaryParty = event.target.value;
    render();
  });

  // Step 4: Keynote Speaker, Recruit Bridge & Actions
  document.querySelector('[data-dup-id="select-keynote"]')?.addEventListener('click', () => {
    const memberId = document.querySelector('[data-dup-id="keynote-speaker"]')?.value;
    if (memberId) {
      dispatchAction('select-keynote-speaker', { memberId });
      render();
    }
  });
  document.querySelector('#step4-open-recruit')?.addEventListener('click', () => {
    const chosen = document.querySelector('#step4-recruit-race')?.value;
    if (chosen) {
      primaryRace = chosen;
      primaryFilter = chosen.startsWith('governor:') ? 'governor' : 'senate';
    }
    dispatchAction('set-turn-step', { step: 3 });
    render();
  });

  // Generic [data-action] handlers
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
    if (game && game.phase === 'organizing' && (game.actionsLeft <= 0 || typeof game.actionsLeft !== 'number') && (game.organizingActionsRemaining > 0)) {
      game.actionsLeft = Math.min(4, game.organizingActionsRemaining);
    }
    const action = button.dataset.action;
    let payload = {};
    if (action === 'recruit') payload.memberId = button.dataset.member;
    if (action === 'contest-state-legislative-slate') payload.stateId = button.dataset.state;
    if (action === 'candidate-endorse' || action === 'encourage-state-recruit') {
      payload.raceId = button.dataset.race;
      payload.partyId = button.dataset.party;
      payload.candidateId = button.dataset.candidate;
    }
    if (action === 'chapter') {
      payload.stateId = document.querySelector('#chapter-state')?.value || mapState;
    }
    if (action === 'introduce-bill') {
      payload.billId = document.querySelector('#bill-choice')?.value;
      payload.stateId = document.querySelector('#bill-state')?.value;
    }
    if (action === 'endorse-bill') payload.factionId = document.querySelector('#bill-endorser')?.value;
    if (action === 'tour') {
      payload.memberId = document.querySelector('[data-dup-id="tour-member"]')?.value;
      payload.stateId = document.querySelector('#tour-state')?.value;
      payload.actionId = 'member-tour';
    }
    if (action === 'voter-registration-drive') {
      payload.stateId = document.querySelector('#reg-state')?.value || mapState;
    }
    // [v0.18.4 MAPS-BALLOT]
    if (action === 'sponsor-ballot-initiative') {
      payload.stateId = document.querySelector('#ballot-init-state')?.value || mapState;
      payload.archetypeId = document.querySelector('#ballot-init-archetype')?.value;
    }
    if (action === 'persuade-independent-caucus' || action === 'court-politician') {
      const targetId = button.dataset.targetId || document.querySelector('#ind-caucus-target')?.value || '';
      if (!targetId) return;
      payload.memberId = targetId;
      payload.targetId = targetId;
      payload.leadershipRoleId = document.querySelector('#court-role-select')?.value;
      payload.concessionType = 'committee';
    }
    if (action === 'fundraise') {
      payload.stateId = document.querySelector('#fundraise-state')?.value || mapState;
    }
    if (action === 'launch-petition-drive') {
      payload.stateId = button.dataset.stateId || document.querySelector('#petition-state')?.value || null;
      payload.bufferTier = document.querySelector('#petition-buffer')?.value || 'prudent';
    }
    if (action === 'enact-state-voting-law') {
      payload.stateId = document.querySelector('#voting-law-state')?.value;
      payload.billId = document.querySelector('#voting-law-bill')?.value;
    }
    if (action === 'resolve-ballot-crisis') {
      payload.option = button.dataset.crisisOption || 'law_firm';
    }
    if (action === 'vet-candidate') {
      payload.candidateId = button.dataset.candidate;
    }
    if (action === 'resolve-scandal-crisis') {
      payload.option = button.dataset.crisisOption || 'stand_by';
    }
    if (action === 'resolve-succession-crisis') {
      payload.path = button.dataset.path;
    }
    // [v0.18.4 LEADING-FACTION]
    if (action === 'resolve-leading-faction-challenge') {
      payload.decision = button.dataset.decision || 'accept';
    }
    if (action === 'promote-state-legislator') {
      payload.memberId = button.dataset.memberId;
      payload.targetOffice = button.dataset.targetOffice;
    }
    if (action === 'commission-poll-btn') {
      payload.actionId = 'commission-poll';
      payload.raceId = button.dataset.race;
    }
    if (action === 'deploy-leader-candidate-btn') {
      payload.actionId = 'deploy-leader-candidate';
      payload.raceId = button.dataset.race;
      payload.leaderId = document.querySelector('#deploy-leader-select')?.value;
    }
    const prevActionsLeft = game?.actionsLeft ?? 0;
    const prevTreasury = game?.treasury ?? 0;
    const actionId = payload.actionId || action;
    delete payload.actionId;
    dispatchAction(actionId, payload);

    // Graceful standalone UI fallback if engine.js v0.9 action handlers are pending merge
    if (actionId === 'voter-registration-drive' && game && game.actionsLeft === prevActionsLeft && prevActionsLeft > 0 && prevTreasury >= 5) {
      game.treasury -= 5;
      game.actionsLeft -= 1;
      if (typeof game.organizingActionsRemaining === 'number') {
        game.organizingActionsRemaining = Math.max(0, game.organizingActionsRemaining - 1);
        if (game.organizingActionsRemaining > 0 && game.actionsLeft <= 0) {
          game.actionsLeft = Math.min(4, game.organizingActionsRemaining);
        }
      }
      const stObj = STATES.find((s) => s.id === payload.stateId);
      const isMajor = V07 ? V07.isMajorParty(game, 'player') : ['people', 'heritage'].includes(playerIdentity());
      const stateEv = stObj?.ev || 3;
      const voterGain = isMajor ? (2500 * stateEv) : (1000 * stateEv);
      if (window.PartyChairEngine?.addVotersToModel && game.voterModel) {
        window.PartyChairEngine.addVotersToModel(game.voterModel, payload.stateId, voterGain, playerIdentity());
      }
      if (!game.stateVoterDeltas) game.stateVoterDeltas = {};
      if (!game.stateVoterDeltas[payload.stateId]) game.stateVoterDeltas[payload.stateId] = {};
      game.stateVoterDeltas[payload.stateId][playerIdentity()] = (game.stateVoterDeltas[payload.stateId][playerIdentity()] || 0) + voterGain;
      game.lastNote = `Conducted Voter Registration & Outreach in ${payload.stateId} (+${voterGain.toLocaleString()} registered voters).`;
    }
    if ((actionId === 'persuade-independent-caucus' || actionId === 'court-politician') && game && game.actionsLeft === prevActionsLeft && prevActionsLeft > 0 && prevTreasury >= 4 && payload.targetId) {
      const targetParty = playerIdentity();
      const rawPartyTag = targetParty === 'people' ? 'D' : targetParty === 'heritage' ? 'R' : targetParty === 'player' ? (game.player?.partyCode || 'P') : targetParty.toUpperCase().slice(0, 3);
      game.treasury -= 4;
      game.actionsLeft -= 1;
      if (typeof game.organizingActionsRemaining === 'number') {
        game.organizingActionsRemaining = Math.max(0, game.organizingActionsRemaining - 1);
        if (game.organizingActionsRemaining > 0 && game.actionsLeft <= 0) {
          game.actionsLeft = Math.min(4, game.organizingActionsRemaining);
        }
      }
      game.sittingMembers = (game.sittingMembers || []).map((m) => {
        if (m.id === payload.targetId || m.name === payload.targetId || m.sittingId === payload.targetId) {
          return {
            ...m,
            party: targetParty,
            rawParty: rawPartyTag,
            caucus: targetParty,
            isIndependent: false,
            hasSwitchedThisCycle: true,
          };
        }
        return m;
      });
      game.roster = [...new Set([...(game.roster || []), payload.targetId])];
      game.recruited = [...new Set([...(game.recruited || game.roster || []), payload.targetId])];
      game.lastNote = `Courted lawmaker ${payload.targetId} to defect to ${safe(game.player?.name || 'your party')}.`;
    }
    render();
  }));

  document.querySelector('#btn-gameover-new-party')?.addEventListener('click', () => {
    try { localStorage.removeItem('partyChairGame.save.v18.3'); localStorage.removeItem('partyChairGame.save.v16.2'); } catch (_) {}
    game = null;
    resetCustomPartySetupDefaults();
    render();
  });

  // Custom Party Creator controls (REQ-235 - REQ-242)
  document.querySelector('#btn-create-custom-party')?.addEventListener('click', () => {
    selectedTemplate = 'custom';
    custom = true;
    render();
  });
  document.querySelectorAll('[data-custom-origin]').forEach((card) => card.addEventListener('click', () => {
    customOrigin = card.dataset.customOrigin;
    render();
  }));
  // Bug #8: Wire Major-Party Schism parent radio buttons so Republican Party can be selected
  document.querySelectorAll('input[name="schism-parent"]').forEach((radio) => radio.addEventListener('change', () => {
    if (radio.checked) {
      customSchismParent = radio.value;
      render();
    }
  }));
  document.querySelectorAll('[data-custom-emblem]').forEach((btn) => btn.addEventListener('click', () => {
    customSelectedEmblem = btn.dataset.customEmblem;
    render();
  }));
  document.querySelectorAll('[data-custom-trait]').forEach((cb) => cb.addEventListener('change', () => {
    const trait = cb.dataset.customTrait;
    if (cb.checked) {
      if (trait === 'big_tent_pragmatism') customCharterTraits = customCharterTraits.filter((t) => t !== 'doctrinal_vanguard');
      if (trait === 'doctrinal_vanguard') customCharterTraits = customCharterTraits.filter((t) => t !== 'big_tent_pragmatism');
      if (!customCharterTraits.includes(trait)) customCharterTraits.push(trait);
    } else {
      customCharterTraits = customCharterTraits.filter((t) => t !== trait);
    }
    render();
  }));
  document.querySelectorAll('[data-custom-faction]').forEach((cb) => cb.addEventListener('change', () => {
    const fid = cb.dataset.customFaction;
    if (cb.checked) {
      if (!customSelectedFactionIds.includes(fid)) customSelectedFactionIds.push(fid);
    } else {
      customSelectedFactionIds = customSelectedFactionIds.filter((x) => x !== fid);
    }
    render();
  }));
  document.querySelectorAll('[data-alloc-preset]').forEach((btn) => btn.addEventListener('click', () => {
    const preset = btn.dataset.allocPreset;
    const homeState = customFoundingStateId || 'PA';
    if (preset === 'home-state') {
      custom100kStateAllocations = { [homeState]: 100000 };
    } else if (preset === 'regional') {
      const homeStObj = STATES.find((s) => s.id === homeState);
      const reg = homeStObj?.region || 'Rust Belt';
      const regStates = STATES.filter((s) => s.region === reg).map((s) => s.id);
      const perState = Math.floor(100000 / regStates.length / 100) * 100;
      custom100kStateAllocations = {};
      regStates.forEach((st, idx) => {
        custom100kStateAllocations[st] = idx === 0 ? (100000 - perState * (regStates.length - 1)) : perState;
      });
    } else if (preset === 'national') {
      const perState = 2000;
      custom100kStateAllocations = {};
      STATES.forEach((s) => {
        custom100kStateAllocations[s.id] = perState;
      });
    } else if (preset === 'clear') {
      custom100kStateAllocations = {};
    }
    render();
  }));
  document.querySelectorAll('[data-state-alloc]').forEach((input) => {
    input.addEventListener('input', (e) => {
      const st = input.dataset.stateAlloc;
      const val = parseInt(e.target.value, 10) || 0;
      custom100kStateAllocations[st] = Math.max(0, val);
      const sum = Object.values(custom100kStateAllocations).reduce((a, b) => a + b, 0);
      const totalEl = document.querySelector('#custom-100k-total');
      if (totalEl) {
        totalEl.textContent = `Allocated: ${sum.toLocaleString()} / 100,000 Voters`;
        totalEl.style.color = sum === 100000 ? '#86efac' : '#f87171';
      }
      const startBtn = document.querySelector('#start-game');
      if (startBtn && (custom || selectedTemplate === 'custom') && customOrigin === 'not_major_movement') {
        if (sum === 100000) {
          startBtn.removeAttribute('disabled');
          startBtn.style.opacity = '1';
          startBtn.style.cursor = 'pointer';
        } else {
          startBtn.setAttribute('disabled', 'disabled');
          startBtn.style.opacity = '0.5';
          startBtn.style.cursor = 'not-allowed';
        }
      }
    });
    const handleSnap = () => {
      const st = input.dataset.stateAlloc;
      const raw = parseInt(input.value, 10) || 0;
      const snapped = Math.max(0, Math.round(raw / 100) * 100);
      input.value = snapped;
      custom100kStateAllocations[st] = snapped;
      const sum = Object.values(custom100kStateAllocations).reduce((a, b) => a + b, 0);
      const totalEl = document.querySelector('#custom-100k-total');
      if (totalEl) {
        totalEl.textContent = `Allocated: ${sum.toLocaleString()} / 100,000 Voters`;
        totalEl.style.color = sum === 100000 ? '#86efac' : '#f87171';
      }
      const startBtn = document.querySelector('#start-game');
      if (startBtn && (custom || selectedTemplate === 'custom') && customOrigin === 'not_major_movement') {
        if (sum === 100000) {
          startBtn.removeAttribute('disabled');
          startBtn.style.opacity = '1';
          startBtn.style.cursor = 'pointer';
        } else {
          startBtn.setAttribute('disabled', 'disabled');
          startBtn.style.opacity = '0.5';
          startBtn.style.cursor = 'not-allowed';
        }
      }
    };
    input.addEventListener('change', handleSnap);
    input.addEventListener('blur', handleSnap);
  });
  document.querySelector('#custom-party-code')?.addEventListener('input', (e) => {
    customPartyCode = e.target.value.toUpperCase().slice(0, 4);
  });
  document.querySelector('#custom-party-motto')?.addEventListener('input', (e) => {
    customPartyMotto = e.target.value;
  });
  document.querySelector('#custom-founding-state')?.addEventListener('change', (e) => {
    customFoundingStateId = e.target.value;
    render();
  });
  document.querySelector('#custom-100k-name')?.addEventListener('input', (e) => {
    custom100kName = e.target.value;
  });
  document.querySelector('#custom-100k-econ')?.addEventListener('input', (e) => {
    custom100kSliders.economic = parseFloat(e.target.value);
  });
  document.querySelector('#custom-100k-soc')?.addEventListener('input', (e) => {
    custom100kSliders.social = parseFloat(e.target.value);
  });

  // Draft-of-7 Priorities Controls (REQ-230, REQ-231)
  document.querySelector('#btn-redraw-hand')?.addEventListener('click', () => {
    dispatchAction('redraw-priorities-hand');
    render();
  });
  document.querySelectorAll('[data-draft-select-quest]').forEach((btn) => btn.addEventListener('click', () => {
    const questId = btn.dataset.draftSelectQuest;
    dispatchAction('select-main-priority', { questId });
    render();
  }));
  document.querySelectorAll('[data-draft-deselect-quest]').forEach((btn) => btn.addEventListener('click', () => {
    const questId = btn.dataset.draftDeselectQuest;
    dispatchAction('deselect-main-priority', { questId });
    render();
  }));
  document.querySelectorAll('[data-targetable-select]').forEach((sel) => sel.addEventListener('change', (e) => {
    const questId = sel.dataset.targetableSelect;
    const targetStateId = e.target.value;
    dispatchAction('select-main-priority', { questId, targetStateId });
    render();
  }));
  document.querySelector('#btn-lock-main-priorities')?.addEventListener('click', () => {
    majorPrioritiesConfirmModalOpen = true;
    render();
  });

  // Forecast Map Chamber Controls (REQ-162)
  document.querySelectorAll('[data-forecast-map-chamber]').forEach((button) => button.addEventListener('click', () => {
    forecastMapChamber = button.dataset.forecastMapChamber;
    render();
  }));

  // Map Tab Controls
  document.querySelectorAll('[data-map]').forEach((button) => button.addEventListener('click', () => {
    activeMap = button.dataset.map;
    if (activeMap === 'senate') {
      const activeClass = game?.activeSenateClass || 3;
      senateMapClass = activeClass === 1 ? 'I' : activeClass === 2 ? 'II' : 'III';
    }
    render();
  }));
  document.querySelectorAll('[data-forecaster-source]').forEach((button) => button.addEventListener('click', () => {
    forecasterMapSource = button.dataset.forecasterSource;
    render();
  }));
  document.querySelectorAll('[data-jump-forecaster-map]').forEach((button) => button.addEventListener('click', () => {
    forecasterMapSource = button.dataset.jumpForecasterMap;
    dispatchAction('set-active-tab', { tab: 'forecast' });
    const el = document.getElementById('forecast-projection-map-container');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    render();
  }));
  document.querySelectorAll('[data-senate-class]').forEach((button) => button.addEventListener('click', () => {
    activeMap = 'senate';
    senateMapClass = button.dataset.senateClass;
    render();
  }));
  document.querySelectorAll('[data-map-state]').forEach((el) => el.addEventListener('click', () => {
    mapState = String(el.dataset.mapState || 'PA').split('-')[0];
    render();
  }));
  document.querySelectorAll('[data-open-state]').forEach((btn) => btn.addEventListener('click', () => {
    mapState = btn.dataset.openState;
    dispatchAction('set-active-tab', { tab: 'states' });
    render();
  }));

  // States Tab Controls
  document.querySelectorAll('[data-state-region]').forEach((btn) => btn.addEventListener('click', () => {
    stateRegionFilter = btn.dataset.stateRegion;
    render();
  }));
  document.querySelector('#state-search')?.addEventListener('input', (e) => {
    stateSearch = e.target.value;
    render();
    const el = document.querySelector('#state-search');
    if (el) { el.focus(); el.setSelectionRange(stateSearch.length, stateSearch.length); }
  });
  document.querySelector('#state-bill-eligible')?.addEventListener('change', (e) => {
    stateBillEligibleOnly = e.target.checked;
    render();
  });
  document.querySelectorAll('[data-select-state]').forEach((btn) => btn.addEventListener('click', () => {
    mapState = btn.dataset.selectState;
    render();
  }));
  document.querySelectorAll('[data-quick-chapter]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('chapter', { stateId: btn.dataset.quickChapter });
    render();
  }));
  document.querySelectorAll('[data-open-primary]').forEach((btn) => btn.addEventListener('click', () => {
    primaryRace = btn.dataset.openPrimary;
    primaryFilter = primaryRace.startsWith('governor:') ? 'governor' : 'senate';
    dispatchAction('set-active-tab', { tab: 'actions' });
    dispatchAction('set-turn-step', { step: 3 });
    render();
  }));

  // Strategic Priorities Lock-In (REQ-69)

  // State Subview & Registration Sorting (REQ-66)
  document.querySelectorAll('[data-state-subview]').forEach((button) => button.addEventListener('click', () => {
    stateSubview = button.dataset.stateSubview;
    render();
  }));
  document.querySelectorAll('[data-reg-sort]').forEach((th) => th.addEventListener('click', () => {
    const col = th.dataset.regSort;
    if (regSortCol === col) {
      regSortDir = regSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      regSortCol = col;
      regSortDir = 'asc';
    }
    render();
  }));

  // Forecast Tab: Leadership Roles & Filter (REQ-11)
  document.querySelectorAll('[data-role-filter]').forEach((btn) => btn.addEventListener('click', () => {
    roleCategoryFilter = btn.dataset.roleFilter;
    render();
  }));
  document.querySelectorAll('[data-assign-role]').forEach((select) => select.addEventListener('change', (e) => {
    dispatchAction('assign-leadership-role', { roleId: select.dataset.assignRole, memberId: e.target.value || null });
    render();
  }));

  // Forecast Tab: Forecaster and History Filters (REQ-12 & REQ-38)
  document.querySelectorAll('[data-forecaster-filter]').forEach((btn) => btn.addEventListener('click', () => {
    forecasterRaceFilter = btn.dataset.forecasterFilter;
    render();
  }));
  document.querySelectorAll('[data-history-tab]').forEach((btn) => btn.addEventListener('click', () => {
    historyViewTab = btn.dataset.historyTab;
    render();
  }));

  // MAS-01: Active Era Dossier & Historic Realignment Transition Modal controls
  document.querySelectorAll('[data-open-era-dossier]').forEach((btn) => btn.addEventListener('click', () => {
    eraDossierModalOpen = true;
    render();
  }));
  document.querySelectorAll('[data-close-era-dossier]').forEach((btn) => btn.addEventListener('click', () => {
    eraDossierModalOpen = false;
    render();
  }));
  document.querySelectorAll('[data-dismiss-realignment-modal]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('dismiss-realignment-modal');
    render();
  }));
  document.querySelectorAll('[data-era-decision]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('resolve-era-decision', { decisionId: btn.dataset.eraDecision });
    render();
  }));
  document.querySelectorAll('[data-switch-chair-party]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('switch-chair-party', { partyId: btn.dataset.switchChairParty });
    render();
  }));
  document.querySelectorAll('[data-absorb-regional-party]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('absorb-regional-party', { regionalPartyId: btn.dataset.absorbRegionalParty });
    render();
  }));

  // MAS-01 Phase 4: Era #18 Coalition Party Selection, Bargaining, Stability Summit & Fracture Crisis
  document.querySelectorAll('[data-select-coalition-party]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('select-coalition-era-party', { partyId: btn.dataset.selectCoalitionParty });
    render();
  }));
  document.querySelectorAll('[data-coalition-bargain]').forEach((btn) => btn.addEventListener('click', () => {
    const mode = btn.dataset.coalitionBargain;
    if (mode === 'anchor') {
      const checked = Array.from(document.querySelectorAll('.era-coalition-partner-cb:checked')).map((el) => el.value);
      dispatchAction('resolve-coalition-bargaining', { mode: 'anchor', partnerIds: checked });
    } else if (mode === 'join') {
      dispatchAction('resolve-coalition-bargaining', { mode: 'join', invitationId: btn.dataset.coalitionInvitation });
    } else {
      dispatchAction('resolve-coalition-bargaining', { mode: 'opposition' });
    }
    render();
  }));
  document.querySelectorAll('[data-stabilize-coalition]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('stabilize-coalition', {});
    render();
  }));
  document.querySelectorAll('[data-resolve-coalition-fracture]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('resolve-coalition-fracture', { choice: btn.dataset.resolveCoalitionFracture });
    render();
  }));

  // MAS-01 Phase 4: Era #16 Robot Party Selection
  document.querySelectorAll('[data-select-robot-party]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('select-robot-era-party', { partyId: btn.dataset.selectRobotParty });
    render();
  }));

  // Version 0.16.1: Cluster A Presidential Primaries & Convention Event Listeners
  document.querySelectorAll('[data-pres-strategy]').forEach((btn) => btn.addEventListener('click', () => {
    const strategy = btn.dataset.presStrategy;
    const candidateId = btn.dataset.candidateId || null;
    dispatchAction('presidential-primary-chair-strategy', { strategy, candidateId });
    render();
  }));

  document.querySelector('#btn-advance-pres-wave')?.addEventListener('click', () => {
    dispatchAction('presidential-primary-advance-wave');
    render();
  });

  document.querySelector('#btn-step-aside-confirm')?.addEventListener('click', () => {
    dispatchAction('presidential-primary-step-aside');
    render();
  });

  document.querySelector('#btn-stand-by-confirm')?.addEventListener('click', () => {
    dispatchAction('presidential-primary-stand-by');
    render();
  });

  document.querySelectorAll('[data-vote-plank]').forEach((btn) => btn.addEventListener('click', () => {
    const amendmentId = btn.dataset.amendmentId;
    const adoptSide = btn.dataset.votePlank;
    dispatchAction('convention-vote-plank', { amendmentId, adoptSide });
    render();
  }));

  document.querySelectorAll('[data-select-vp]').forEach((btn) => btn.addEventListener('click', () => {
    const vpCandidateId = btn.dataset.selectVp;
    dispatchAction('convention-select-vp', { vpCandidateId });
    render();
  }));

  document.querySelectorAll('[data-keynote-speaker]').forEach((btn) => btn.addEventListener('click', () => {
    const speakerId = btn.dataset.keynoteSpeaker;
    dispatchAction('convention-deliver-keynote', { speakerId });
    render();
  }));

  document.querySelectorAll('[data-brokered-deal]').forEach((btn) => btn.addEventListener('click', () => {
    const dealType = btn.dataset.brokeredDeal;
    const concessions = dealType === 'vp'
      ? { offerVp: true }
      : dealType === 'cabinet_platform'
        ? { cabinetPosts: true, platformDemands: true }
        : {};
    dispatchAction('convention-broker-deal', { concessions });
    render();
  }));

  document.querySelector('#btn-finalize-convention')?.addEventListener('click', () => {
    dispatchAction('convention-finalize');
    render();
  });

  // Post-Election: Start Next Cycle (2030)
  document.querySelector('#start-next-cycle')?.addEventListener('click', () => {
    if (window.PartyChairEngine?.startNextCycle) {
      game = window.PartyChairEngine.startNextCycle(game);
      if (V07 && game) game = V07.hydrateV07GameState(game);
      if (game && typeof saveGame === 'function') saveGame(game);
      render();
    } else {
      dispatchAction('start-next-cycle');
      if (game && typeof saveGame === 'function') saveGame(game);
      render();
    }
  });

  // Campaign Phase: Polling & Consensus Forecast Map Tabs (REQ-133)
  document.querySelectorAll('[data-camp-poll-tab]').forEach((btn) => btn.addEventListener('click', () => {
    campaignPollingTab = btn.dataset.campPollTab;
    render();
  }));

  // Factions Tab: Faction Filter and State Inspector (REQ-152)
  document.querySelectorAll('[data-faction-filter]').forEach((btn) => btn.addEventListener('click', () => {
    factionCategoryFilter = btn.dataset.factionFilter;
    render();
  }));
  const factionStateSelect = document.querySelector('#faction-state-select');
  if (factionStateSelect) {
    factionStateSelect.addEventListener('change', (e) => {
      factionInspectorState = e.target.value;
      render();
    });
  }

  // REC-02, REC-03, REC-06: Faction Courtship, Wedge, Subsidize, and Expulsion action bindings
  document.querySelectorAll('[data-faction-op]').forEach((btn) => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const op = btn.dataset.factionOp;
    const fid = btn.dataset.factionId;
    if (op && fid) {
      dispatchAction(op, { factionId: fid });
      render();
    }
  }));

  // Coalition Summit Modal bindings (SUM-02, SUM-06)
  document.querySelectorAll('[data-summit-faction]').forEach((btn) => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const fid = btn.dataset.summitFaction;
    summitModalFactionId = fid;
    summitModalOpen = true;
    render();
  }));
  document.querySelectorAll('[data-close-summit]').forEach((btn) => btn.addEventListener('click', () => {
    summitModalOpen = false;
    summitModalFactionId = null;
    render();
  }));
  document.querySelector('#summit-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'summit-modal-overlay') {
      summitModalOpen = false;
      summitModalFactionId = null;
      render();
    }
  });
  document.querySelectorAll('[data-sign-accord]').forEach((btn) => btn.addEventListener('click', () => {
    const fid = btn.dataset.signAccord;
    if (fid) {
      dispatchAction('sign-coalition-accord', { factionId: fid });
      summitModalOpen = false;
      summitModalFactionId = null;
      render();
    }
  }));

  // Campaign Phase: Advance Week & October Surprise (REQ-39 & REQ-41)
  document.querySelector('#advance-campaign-week')?.addEventListener('click', () => {
    if (window.PartyChairEngine?.advanceCampaignWeek) {
      game = window.PartyChairEngine.advanceCampaignWeek(game);
      if (V07 && game) game = V07.hydrateV07GameState(game);
      if (game && typeof saveGame === 'function') saveGame(game);
      render();
    }
  });
  document.querySelectorAll('[data-campaign-event-choice]').forEach((btn) => btn.addEventListener('click', () => {
    if (window.PartyChairEngine?.applyCampaignEventChoice) {
      game = window.PartyChairEngine.applyCampaignEventChoice(game, Number(btn.dataset.campaignEventChoice));
      if (V07 && game) game = V07.hydrateV07GameState(game);
      if (game && typeof saveGame === 'function') saveGame(game);
      render();
    } else {
      dispatchAction('resolve-campaign-event', { choiceIndex: Number(btn.dataset.campaignEventChoice) });
      if (game && typeof saveGame === 'function') saveGame(game);
      render();
    }
  }));

  // Campaign Phase: Weekly Funding Requests (REQ-19)
  document.querySelectorAll('[data-approve-funding]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('approve-funding-request', { requestId: btn.dataset.approveFunding });
    render();
  }));
  document.querySelectorAll('[data-refuse-funding]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('refuse-funding-request', { requestId: btn.dataset.refuseFunding });
    render();
  }));

  // Campaign Phase: Candidate Budget Triage (REQ-19)
  document.querySelectorAll('[data-triage-filter]').forEach((btn) => btn.addEventListener('click', () => {
    campaignTriageFilter = btn.dataset.triageFilter;
    render();
  }));
  const triageSearchInput = document.querySelector('#triage-search');
  if (triageSearchInput) {
    triageSearchInput.addEventListener('input', (e) => {
      campaignTriageSearch = e.target.value;
      render();
    });
  }
  document.querySelectorAll('[data-allocate-funds]').forEach((btn) => btn.addEventListener('click', () => {
    const raceKey = btn.dataset.allocateFunds;
    const isHouse = raceKey.startsWith('house:');
    const amount = isHouse ? 1 : 2;
    dispatchAction('allocate-candidate-funds', { raceKey, amount });
    render();
  }));
  document.querySelectorAll('[data-pull-funds]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('pull-candidate-funds', { raceKey: btn.dataset.pullFunds });
    render();
  }));

  // Live Campaign Polling & Commissioned Polls (REQ-140)
  document.querySelector('#btn-commission-poll')?.addEventListener('click', () => {
    commissionPollModalOpen = true;
    render();
  });
  document.querySelector('#btn-view-commissioned-polls')?.addEventListener('click', () => {
    commissionedPollsModalOpen = true;
    render();
  });
  document.querySelector('#close-commission-poll-modal')?.addEventListener('click', () => {
    commissionPollModalOpen = false;
    render();
  });
  document.querySelector('#btn-cancel-commission-poll')?.addEventListener('click', () => {
    commissionPollModalOpen = false;
    render();
  });
  document.querySelector('#close-commissioned-polls-modal')?.addEventListener('click', () => {
    commissionedPollsModalOpen = false;
    render();
  });
  document.querySelector('#btn-close-commissioned-polls')?.addEventListener('click', () => {
    commissionedPollsModalOpen = false;
    render();
  });
  document.querySelector('#commission-poll-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'commission-poll-modal-overlay') {
      commissionPollModalOpen = false;
      render();
    }
  });
  document.querySelector('#commissioned-polls-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'commissioned-polls-modal-overlay') {
      commissionedPollsModalOpen = false;
      render();
    }
  });
  document.querySelector('#btn-confirm-commission-poll')?.addEventListener('click', () => {
    const raceSelect = document.querySelector('#commission-race-select');
    if (!raceSelect) return;
    const raceKey = raceSelect.value;
    const opt = raceSelect.selectedOptions?.[0];
    const office = opt?.dataset?.office || raceKey.split(':')[0];
    const stateId = opt?.dataset?.stateId || raceKey.split(':')[1];
    dispatchAction('commission-race-poll', { raceKey, office, stateId });
    commissionPollModalOpen = false;
    commissionedPollsModalOpen = true;
    render();
  });

  // Campaign Phase: National Leader Deployment Modal (REQ-40)
  document.querySelector('#open-deployment-modal')?.addEventListener('click', () => {
    deploymentModalOpen = true;
    render();
  });
  document.querySelector('#close-deployment-modal')?.addEventListener('click', () => {
    deploymentModalOpen = false;
    render();
  });
  document.querySelectorAll('[data-deploy-leader]').forEach((select) => select.addEventListener('change', (e) => {
    dispatchAction('deploy-leader', { leaderId: select.dataset.deployLeader, stateId: e.target.value });
    render();
  }));
  document.querySelectorAll('[data-deploy-state]').forEach((path) => path.addEventListener('click', () => {
    const stId = path.dataset.deployState;
    const deployments = game?.campaign?.leaderDeployments || {};
    const identity = playerIdentity();
    const partySitting = (game?.sittingMembers || []).filter((m) => m.party === identity);
    const unassignedLeader = partySitting.find((m) => !deployments[m.id]);
    if (unassignedLeader) {
      dispatchAction('deploy-leader', { leaderId: unassignedLeader.id, stateId: stId });
      render();
    }
  }));

  // Campaign Phase: Weekly Grand Strategy Actions (REQ-26/28/29/31/34)
  document.querySelector('#btn-self-vet')?.addEventListener('click', () => {
    const raceKey = document.querySelector('#self-vet-select')?.value;
    if (raceKey) {
      dispatchAction('vet-or-oppo', { mode: 'self-vet', raceKey });
      render();
    }
  });
  document.querySelector('#btn-oppo')?.addEventListener('click', () => {
    const stateId = document.querySelector('#oppo-select')?.value;
    if (stateId) {
      dispatchAction('vet-or-oppo', { mode: 'oppo', stateId });
      render();
    }
  });
  document.querySelector('#action-volunteer-drive')?.addEventListener('click', () => {
    const stateId = document.querySelector('#volunteer-state-select')?.value || 'PA';
    dispatchAction('volunteer-drive', { stateId });
    render();
  });
  document.querySelector('#action-surrogate-blitz')?.addEventListener('click', () => {
    dispatchAction('surrogate-media-blitz', {});
    render();
  });
  document.querySelector('#btn-joint-victory')?.addEventListener('click', () => {
    const stateId = document.querySelector('#joint-state-select')?.value;
    const identity = playerIdentity();
    const partySitting = (game?.sittingMembers || []).filter((m) => m.party === identity);
    const leader = partySitting.slice().sort((a, b) => ((b.fame || 50) + (b.ratings?.charisma || 6) * 4) - ((a.fame || 50) + (a.ratings?.charisma || 6) * 4))[0];
    if (stateId) {
      dispatchAction('joint-fundraising', { stateId, leaderId: leader?.id || null });
      render();
    }
  });
  document.querySelector('#btn-ballot-measure')?.addEventListener('click', () => {
    const stateId = document.querySelector('#ballot-state-select')?.value;
    if (stateId) {
      dispatchAction('ballot-measure', { stateId, issueId: 'voting-access' });
      render();
    }
  });

  // Campaign Phase: Super PAC Demands & Issue Ad Spending
  document.querySelectorAll('[data-pac-demand]').forEach((btn) => btn.addEventListener('click', () => {
    const pacId = btn.dataset.pacDemand;
    const rawChoice = btn.dataset.pacChoice || 'accept';
    const decision = (rawChoice === 'defy' || rawChoice === 'decline') ? 'defy' : 'accept';
    const prevPacs = JSON.stringify(game?.superPacs || game?.campaign?.superPacs || null);
    dispatchAction('respond-pac-demand', { pacId, decision });
    const afterPacs = JSON.stringify(game?.superPacs || game?.campaign?.superPacs || null);
    if (game && prevPacs === afterPacs) {
      const catalog = ensureSuperPacCatalog().map((p) => ({ ...p }));
      const target = catalog.find((p) => p.id === pacId);
      if (target) {
        const status = decision === 'accept' ? 'accepted' : 'defied';
        target.activeDemand = { ...(target.activeDemand || {}), status };
        target.demandStatus = status;
        if (decision === 'accept') {
          const bonus = 4.5;
          target.pool = roundTo(Number(target.pool ?? target.poolMillions ?? 10) + bonus, 1);
          game.lastNote = `Accommodated ${target.name} demand (+$${bonus}M added to independent PAC pool).`;
        } else {
          game.lastNote = `Stood firm against ${target.name} demand; party platform kept unchanged.`;
        }
        game.superPacs = catalog;
      }
    }
    render();
  }));

  document.querySelectorAll('[data-pac-ad]').forEach((btn) => btn.addEventListener('click', () => {
    const pacId = btn.dataset.pacAd;
    const raceKey = document.querySelector(`#pac-race-${pacId}`)?.value || 'senate:PA';
    const stateId = raceKey.split(':')[1]?.split('-')[0] || 'PA';
    const prevNote = game?.lastNote;
    dispatchAction('allocate-pac-ads', { pacId, raceKey, amount: 2 });
    if (game?.campaign && game.lastNote === prevNote) {
      const catalog = ensureSuperPacCatalog().map((p) => ({ ...p }));
      const target = catalog.find((p) => p.id === pacId);
      const curPool = Number(target?.pool ?? target?.poolMillions ?? 0);
      if (target && curPool >= 2) {
        target.pool = roundTo(curPool - 2, 1);
        target.poolMillions = target.pool;
        target.spentThisCycle = roundTo(Number(target.spentThisCycle || target.spentMillions || 0) + 2, 1);
        target.targetRaceKey = raceKey;
        game.superPacs = catalog;
        game.campaign.campaignAdModifiers = game.campaign.campaignAdModifiers || {};
        game.campaign.campaignAdModifiers[stateId] = (game.campaign.campaignAdModifiers[stateId] || 0) + 1.0;
        game.lastNote = `${target.name} deployed $2M in ${target.petIssueLabel || target.petIssue || 'issue'} ads for ${raceKey}.`;
      }
    }
    render();
  }));

  // Post-Election Autopsy Modal Actions (REQ-76, REQ-77)
  document.querySelector('#btn-view-autopsy-report')?.addEventListener('click', () => {
    dispatchAction('open-autopsy-modal');
    render();
  });
  document.querySelector('#btn-close-autopsy')?.addEventListener('click', () => {
    dispatchAction('close-autopsy-modal');
    render();
  });
  document.querySelector('#btn-reopen-autopsy-close')?.addEventListener('click', () => {
    dispatchAction('close-autopsy-modal');
    render();
  });
  document.querySelectorAll('[data-autopsy-action]').forEach((btn) => btn.addEventListener('click', () => {
    const disposition = btn.dataset.autopsyAction;
    dispatchAction('resolve-autopsy-disposition', { disposition });
    render();
  }));

  // State Machine Crisis Actions (REQ-82)
  document.querySelectorAll('[data-crisis-choice]').forEach((btn) => btn.addEventListener('click', () => {
    const choice = btn.dataset.crisisChoice;
    const stateId = btn.dataset.crisisState;
    dispatchAction('resolve-state-crisis', { stateId, choice });
    render();
  }));

  // Version 0.15.9: Fusion Voting & Cross-Endorsement Handlers
  document.querySelector('#fusion-partner-select')?.addEventListener('change', (e) => {
    fusionPartnerSelection = e.target.value;
    render();
  });
  document.querySelector('#fusion-pledge-select')?.addEventListener('change', (e) => {
    fusionPledgeSelection = e.target.value;
    render();
  });
  document.querySelector('#btn-offer-fusion-endorsement')?.addEventListener('click', (e) => {
    const raceId = e.currentTarget.dataset.race || primaryRace;
    const partnerPartyId = document.querySelector('#fusion-partner-select')?.value || fusionPartnerSelection || 'people';
    const policyPledgeId = document.querySelector('#fusion-pledge-select')?.value || fusionPledgeSelection || 'pledge-electoral-reform';
    dispatchAction('offer-fusion-endorsement', { raceId, partnerPartyId, policyPledgeId });
    render();
  });

  // Version 0.15.9: Inter-Cycle Electoral Reform Popup Dismiss
  document.querySelector('#btn-dismiss-electoral-reform')?.addEventListener('click', () => {
    dispatchAction('dismiss-electoral-reform-event', {});
    render();
  });

  // Version 0.15.9: Kingmaker Caucus Confidence-and-Supply Modal Handlers
  document.querySelectorAll('[data-kingmaker-partner]').forEach((btn) => btn.addEventListener('click', () => {
    kingmakerSelectedPartner = btn.dataset.kingmakerPartner;
    render();
  }));
  document.querySelectorAll('[data-kingmaker-concession]').forEach((btn) => btn.addEventListener('click', () => {
    kingmakerSelectedConcession = btn.dataset.kingmakerConcession;
    render();
  }));
  document.querySelector('#kingmaker-reform-type')?.addEventListener('change', (e) => {
    kingmakerReformType = e.target.value;
    render();
  });
  document.querySelector('#kingmaker-state-1')?.addEventListener('change', (e) => {
    kingmakerTargetState1 = e.target.value;
    render();
  });
  document.querySelector('#kingmaker-state-2')?.addEventListener('change', (e) => {
    kingmakerTargetState2 = e.target.value;
    render();
  });
  document.querySelector('#btn-confirm-kingmaker')?.addEventListener('click', (e) => {
    const chamber = e.currentTarget.dataset.chamber;
    const stateId = e.currentTarget.dataset.state || null;
    const partner = kingmakerSelectedPartner || 'independent';
    const concession = kingmakerSelectedConcession || 'gavels';
    const targetStates = stateId
      ? [stateId]
      : [
          document.querySelector('#kingmaker-state-1')?.value || kingmakerTargetState1,
          document.querySelector('#kingmaker-state-2')?.value || kingmakerTargetState2,
        ].filter(Boolean);
    const reformType = document.querySelector('#kingmaker-reform-type')?.value || kingmakerReformType || 'rcv';
    dispatchAction('resolve-kingmaker-negotiation', { chamber, stateId, partner, concession, targetStates, reformType });
    kingmakerSelectedPartner = null;
    kingmakerSelectedConcession = 'gavels';
    render();
  });

  // Version 0.15.9: 12th Amendment Contingent Election Modal Handlers
  document.querySelectorAll('[data-contingent-endorse]').forEach((btn) => btn.addEventListener('click', () => {
    contingentEndorseParty = btn.dataset.contingentEndorse;
    render();
  }));
  document.querySelectorAll('[data-contingent-concession]').forEach((btn) => btn.addEventListener('click', () => {
    contingentConcession = btn.dataset.contingentConcession;
    render();
  }));
  document.querySelector('#contingent-cabinet-select')?.addEventListener('change', (e) => {
    contingentCabinetRole = e.target.value;
    render();
  });
  document.querySelector('#contingent-reform-select')?.addEventListener('change', (e) => {
    contingentReformType = e.target.value;
    render();
  });
  document.querySelector('#btn-confirm-contingent-election')?.addEventListener('click', () => {
    const cabinetRole = document.querySelector('#contingent-cabinet-select')?.value || contingentCabinetRole || 'cabinet_state';
    const reformType = document.querySelector('#contingent-reform-select')?.value || contingentReformType || 'rcv';
    dispatchAction('resolve-contingent-election', {
      endorseParty: contingentEndorseParty || 'people',
      concession: contingentConcession || 'cabinet',
      cabinetRole,
      reformType,
    });
    render();
  });

  // Version 0.15.9: Ideological Crossroads & Party Doctrine Modal Handlers
  document.querySelectorAll('[data-resolve-doctrine]').forEach((btn) => btn.addEventListener('click', () => {
    const doctrine = btn.dataset.resolveDoctrine;
    dispatchAction('resolve-identity-crisis', { doctrine });
    render();
  }));

  // Version 0.15.9: Debate Stage Breakthrough Modal Handlers
  document.querySelectorAll('[data-resolve-debate-choice]').forEach((btn) => btn.addEventListener('click', () => {
    const choiceIndex = Number(btn.dataset.resolveDebateChoice) || 0;
    dispatchAction('resolve-debate-stage-event', { choiceIndex });
    render();
  }));

  // Version 0.15.9: Purist Bolt Threat Appeasement Handlers
  document.querySelectorAll('[data-appease-faction]').forEach((btn) => btn.addEventListener('click', () => {
    const factionId = btn.dataset.appeaseFaction;
    const mode = btn.dataset.appeaseMode || 'concession';
    dispatchAction('appease-faction-threat', { factionId, mode });
    render();
  }));

  // Version 0.17.0: Coalition Demands Response Handlers
  document.querySelectorAll('[data-demand-action]').forEach((btn) => btn.addEventListener('click', () => {
    const demandId = btn.dataset.demandId;
    const response = btn.dataset.demandAction;
    dispatchAction('respond-coalition-demand', { demandId, response });
    render();
  }));

  // Confirm Turn / Election Resolution / Launch Campaign (REQ-101)
  document.querySelector('#advance-year')?.addEventListener('click', () => {
    if (game && game.phase === 'organizing') {
      // Fast-forward discrete turns to resolve primaries and enter 15-Week Campaign Phase
      game.chairTurn = 19;
      game.organizingActionsRemaining = 0;
      game.actionsLeft = 0;
    }
    game = advanceYear(game);
    if (V07 && game) game = V07.hydrateV07GameState(game);
    render();
  });

  // Topbar Save Management (#95 non-blocking confirmation & #40 stop playback)
  document.querySelector('#new-game')?.addEventListener('click', (ev) => {
    const btn = ev.currentTarget;
    if (btn && btn.dataset.confirmArmed !== '1') {
      btn.dataset.confirmArmed = '1';
      btn.dataset.origLabel = btn.textContent || 'New Game';
      btn.textContent = 'Click again to confirm New Party';
      setTimeout(() => {
        if (btn.dataset.confirmArmed === '1') {
          btn.dataset.confirmArmed = '';
          btn.textContent = btn.dataset.origLabel || 'New Game';
        }
      }, 4500);
      return;
    }
    if (btn) btn.dataset.confirmArmed = '';
    if (typeof stopElectionNightPlayback === 'function') stopElectionNightPlayback();
    if (typeof stopPrimaryAutoPlayback === 'function') stopPrimaryAutoPlayback();
    {
      Object.keys(localStorage).filter((k) => k.startsWith('partyChairGame.save.')).forEach((k) => localStorage.removeItem(k));
      game = null;
      custom = false;
      customIssuePositions = null;
      customPartyName = '';
      customIssueCategory = 'All';
      selectedLeaderArchetype = 'former-politician';
      selectedTemplate = 'people';
      activeMap = 'house';
      senateMapClass = 'universal';
      issueCategory = 'Economy & Affordability';
      render();
    }
  });
  document.querySelector('[data-dup-id="open-primary-archive"]')?.addEventListener('click', () => {
    primaryArchiveOpen = true;
    render();
  });
  document.querySelector('#close-primary-archive')?.addEventListener('click', () => {
    primaryArchiveOpen = false;
    render();
  });
  document.querySelector('#primary-archive-backdrop')?.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'primary-archive-backdrop') {
      primaryArchiveOpen = false;
      render();
    }
  });
  document.querySelectorAll('[data-archive-year]').forEach((btn) => btn.addEventListener('click', () => {
    primaryArchiveYear = btn.dataset.archiveYear;
    render();
  }));
  document.querySelectorAll('[data-archive-party]').forEach((btn) => btn.addEventListener('click', () => {
    primaryArchiveParty = btn.dataset.archiveParty;
    render();
  }));
  document.querySelectorAll('[data-pri-reorder]').forEach((btn) => btn.addEventListener('click', () => {
    dispatchAction('reorder-primary-state', { stateId: btn.dataset.priReorder, direction: btn.dataset.priDir });
    render();
  }));
  document.querySelectorAll('[data-pri-asset]').forEach((cb) => cb.addEventListener('change', (e) => {
    primaryFilterAssets[e.target.dataset.priAsset] = Boolean(e.target.checked);
  }));
  document.querySelector('#pri-filter-state')?.addEventListener('change', (e) => {
    primaryFilterStatePick = e.target.value;
  });
  document.querySelectorAll('[data-pri-filter-cand]').forEach((btn) => btn.addEventListener('click', () => {
    const st = document.querySelector('#pri-filter-state')?.value || primaryFilterStatePick || null;
    dispatchAction('filter-primary-support', { candidateId: btn.dataset.priFilterCand, stateId: st, assets: { ...primaryFilterAssets } });
    render();
  }));
  document.querySelectorAll('[data-pri-action]').forEach((btn) => btn.addEventListener('click', () => {
    const act = btn.dataset.priAction;
    if (act === 'advance') dispatchAction('advance-primary-day', {});
    else if (act === 'finish') dispatchAction('finish-presidential-primary', {});
    render();
  }));
  document.querySelector('[data-dup-id="open-save-slots"]')?.addEventListener('click', async () => {
    saveSlotsModalOpen = true;
    if (window.PartyChairEngine?.listSaveSlotsAsync) {
      cachedSaveSlots = await window.PartyChairEngine.listSaveSlotsAsync();
    }
    render();
  });
  document.querySelector('#close-save-slots')?.addEventListener('click', () => {
    saveSlotsModalOpen = false;
    render();
  });
  document.querySelector('#save-slots-backdrop')?.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'save-slots-backdrop') {
      saveSlotsModalOpen = false;
      render();
    }
  });
  document.querySelectorAll('[data-save-slot]').forEach((btn) => btn.addEventListener('click', async () => {
    const slot = Number(btn.dataset.saveSlot);
    if (game && window.PartyChairEngine?.saveToSlotAsync) {
      await window.PartyChairEngine.saveToSlotAsync(slot, game);
      cachedSaveSlots = await window.PartyChairEngine.listSaveSlotsAsync();
      render();
    }
  }));
  document.querySelectorAll('[data-load-slot]').forEach((btn) => btn.addEventListener('click', async () => {
    const slot = Number(btn.dataset.loadSlot);
    if (window.PartyChairEngine?.loadFromSlotAsync) {
      const loaded = await window.PartyChairEngine.loadFromSlotAsync(slot);
      if (loaded) {
        game = loaded;
        saveSlotsModalOpen = false;
        render();
      }
    }
  }));
  document.querySelectorAll('[data-delete-slot]').forEach((btn) => btn.addEventListener('click', async () => {
    const slot = Number(btn.dataset.deleteSlot);
    if (window.PartyChairEngine?.deleteSaveSlotAsync) {
      await window.PartyChairEngine.deleteSaveSlotAsync(slot);
      cachedSaveSlots = await window.PartyChairEngine.listSaveSlotsAsync();
      render();
    }
  }));
  // [v0.18.4 COALITION-POLITICS] Bind Proposals #5, #6, #9 UI listeners
  if (window.CoalitionPoliticsSystem?.bindEvents) {
    window.CoalitionPoliticsSystem.bindEvents(game, dispatchAction, render);
  }
}

window.PartyChairApp = {
  render,
  campaignMarkup,
  campaignDashboardMarkup,
  campaignPollingMapMarkup,
  commissionPollModalMarkup,
  commissionedPollsModalMarkup,
  factionsTabMarkup,
  statesTabMarkup,
  summitModalMarkup,
  forecastersMarkup,
  partyInfoTabMarkup,
  forecastTabMarkup,
  actionsTabMarkup,
  step1IssuesMarkup,
  step2PrioritiesMarkup,
  step3PrimariesMarkup,
  step4WorkMarkup,
  step5StatesMarkup: step4WorkMarkup,
  step4StateLegMarkup,
  majorPrioritiesConfirmModalMarkup,
  platformMarkup,
  unifiedPartyApprovalEntries,
  playerIdentity,
  modeledVotersForParty,
  stateSlateCost,
  renderPoliticalLandscape: mapTabMarkup,
  mapTabMarkup,
  nationalMapSvg,
  renderStateVoterRegistrationTable,
  factionsMarkup,
  memberMetricsBadgesMarkup,
  getForecastMapChamber: () => forecastMapChamber,
  setForecastMapChamber: (c) => { forecastMapChamber = c; },
  getForecasterMapSource: () => forecasterMapSource,
  setForecasterMapSource: (s) => { forecasterMapSource = s; },
  getForecasterRaceFilter: () => forecasterRaceFilter,
  setForecasterRaceFilter: (f) => { forecasterRaceFilter = f; },
  getPlayerTierInfo,
  getPlayerMaxFocusSlots,
  institutionalStatusBadgeMarkup,
  partyDoctrineBadgeMarkup,
  getStateElectoralBadgesMarkup,
  getStateBreakthroughBadgeMarkup,
  electoralReformModalMarkup,
  kingmakerModalMarkup,
  contingentElectionModalMarkup,
  identityCrisisModalMarkup,
  formatPartyDisplayName,
  institutionalStatusBadgeMarkup,
  ascensionGauntletProgressStripMarkup,
  ascensionGauntletModalMarkup,
  getFieldDirectorDispatch,
  debateStageModalMarkup,
  activeV159DecisionModalMarkup,
  getActiveMap: () => activeMap,
  setActiveMap: (m) => { activeMap = m; },
  getCampaignPollingTab: () => campaignPollingTab,
  setCampaignPollingTab: (t) => { campaignPollingTab = t; },
  getFactionCategoryFilter: () => factionCategoryFilter,
  setFactionCategoryFilter: (f) => { factionCategoryFilter = f; },
  getSummitModalOpen: () => summitModalOpen,
  setSummitModalOpen: (open) => { summitModalOpen = open; },
  getSummitModalFactionId: () => summitModalFactionId,
  setSummitModalFactionId: (id) => { summitModalFactionId = id; },
  getGame: () => game,
  setGame: (g) => { game = g; },
  setFactionInspectorState: (st) => { factionInspectorState = st; },
  getSelectedActionState,
  setSelectedActionState,
  candidateEraBadgeMarkup,
  activeEraFeedbackBannerMarkup,
  eraChairSwitcherMarkup,
  eraRegionalMergerMarkup,
  regionalStateBadgeMarkup,
  superPacsPanelMarkup,
  // Version 0.16.9 Exports (Coding Agent A)
  setupMarkup,
  customPartyCreatorMarkup,
  allocationValidationModalMarkup,
  resetCustomPartySetupDefaults,
  getAllocValidationModalOpen: () => allocValidationModalOpen,
  setAllocValidationModalOpen: (open) => { allocValidationModalOpen = open; },
  getAllocValidationSum: () => allocValidationSum,
  setAllocValidationSum: (sum) => { allocValidationSum = sum; },
  getCustom100kStateAllocations: () => custom100kStateAllocations,
  setCustom100kStateAllocations: (allocs) => { custom100kStateAllocations = allocs; },
  getCustomPartyName: () => customPartyName,
  setCustomPartyName: (name) => { customPartyName = name; },
  getCustomLeaderName: () => customLeaderName,
  setCustomLeaderName: (name) => { customLeaderName = name; },
  getCustomPartyColor: () => customPartyColor,
  setCustomPartyColor: (color) => { customPartyColor = color; },
  getCustomPartyMotto: () => customPartyMotto,
  setCustomPartyMotto: (motto) => { customPartyMotto = motto; },
  getCustomSelectedTemplate: () => selectedTemplate,
  setCustomSelectedTemplate: (tmpl) => { selectedTemplate = tmpl; },
  getCustom: () => custom,
  setCustom: (c) => { custom = c; },
  getCustomIssuePositions: () => customIssuePositions,
  setCustomIssuePositions: (pos) => { customIssuePositions = pos; },
  getCustomOrigin: () => customOrigin,
  setCustomOrigin: (o) => { customOrigin = o; },
  getCustomSelectedFactionIds: () => customSelectedFactionIds,
  setCustomSelectedFactionIds: (fids) => { customSelectedFactionIds = fids; },
};

render();

// v0.18.2: Delegated Campaign War Room action bindings
if (typeof document !== 'undefined' && !window.__v0180WarRoomBound) {
  window.__v0180WarRoomBound = true;
  document.addEventListener('change', (e) => {
    if (e.target?.id === 'v0180-state-select') {
      window.__v0181SelectedState = e.target.value;
      const satBadge = document.querySelector('[data-v0182-sat-badge]');
      const CO = window.CampaignOverhaul;
      if (satBadge && CO && game?.campaign) {
        const stId = e.target.value;
        const tier = CO.getSaturationTier ? CO.getSaturationTier(Number(game.campaign.stateSaturation?.[stId] || 0)) : { label: 'Fresh', effMult: 1 };
        satBadge.innerHTML = `Airwaves (${safe(stId)}): <b>${safe(tier.label)} (${Math.round((tier.effMult || 1) * 100)}%)</b>`;
      }
    } else if (e.target?.id === 'v0180-rival-select') {
      window.__v0181SelectedRival = e.target.value;
    } else if (e.target?.id === 'v0180-faction-select') {
      window.__v0181SelectedFaction = e.target.value;
    } else if (e.target?.classList?.contains('war-room-strat-select')) {
      // [v0.18.4 MAPS-BALLOT]
      dispatchAction('select-redistricting-strategy', { stateId: e.target.dataset.state, strategy: e.target.value });
    }
  });
  document.addEventListener('click', (e) => {
    // [v0.18.4 MEDIA-SHOCKS]
    if (window.MediaShocksSystem?.handleUiClick?.(e, () => game, (g) => { game = g; }, typeof saveGame === 'function' ? saveGame : null, typeof render === 'function' ? render : null)) return;
    const primCtrlBtn = e.target?.closest?.('[data-v0182-primary]');
    if (primCtrlBtn && game) {
      const pAct = primCtrlBtn.getAttribute('data-v0182-primary');
      const spd = primCtrlBtn.getAttribute('data-speed');
      game = window.PartyChairEngine.takeAction(game, pAct, spd ? { speed: Number(spd) } : {});
      if (typeof saveGame === 'function') saveGame(game);
      if (typeof render === 'function') render();
      return;
    }
    const primStateBtn = e.target?.closest?.('[data-primary-state]');
    if (primStateBtn && game?.activePresidentialPrimary) {
      primaryFilterStatePick = primStateBtn.getAttribute('data-primary-state');
      if (typeof render === 'function') render();
      return;
    }
    const pinBtn = e.target?.closest?.('[data-v0180-toggle-pins]');
    if (pinBtn) {
      window.__v0181ShowRivalPins = !window.__v0181ShowRivalPins;
      if (typeof render === 'function') render();
      return;
    }
    const btn = e.target?.closest?.('[data-v0180-action]');
    if (!btn || !game) return;
    const act = btn.getAttribute('data-v0180-action');
    const stateSel = document.getElementById('v0180-state-select');
    const facSel = document.getElementById('v0180-faction-select');
    const rivalSel = document.getElementById('v0180-rival-select');
    const _normRecId = (x) => (typeof x === 'string' ? x : (x?.stateId || x?.id || x?.code || ''));
    const targetState = stateSel?.value || _normRecId(window.__v0181SelectedState) || _normRecId(game.campaign?.recommendedStates?.[0]) || 'PA';
    const targetFaction = facSel?.value || 'ind_moderates';
    const targetRival = rivalSel?.value || window.__v0181SelectedRival || undefined;
    let payload = { stateId: targetState, factionId: targetFaction, partyId: targetRival };
    if (act === 'select-campaign-theme') {
      const sel = document.getElementById('v0180-theme-select');
      payload = { issueId: sel?.value || 'cost-of-living' };
    } else if (act === 'resolve-campaign-debate') {
      const answers = [0, 1, 2].map((i) => document.getElementById(`v0180-debate-q${i}`)?.value || 'pragmatic');
      payload = { posture: btn.getAttribute('data-posture') || 'pivot_swing', answers };
    } else if (act === 'resolve-campaign-crisis') {
      payload = { crisisId: btn.getAttribute('data-crisis-id'), choiceId: btn.getAttribute('data-choice-id') };
    } else if (act === 'resolve-trail-ultimatum') {
      payload = { ultimatumId: btn.getAttribute('data-id'), choice: btn.getAttribute('data-choice') };
    } else if (act === 'release-oppo-dossier') {
      payload = { dossierId: btn.getAttribute('data-id') };
    } else if (act === 'deploy-surrogate') {
      payload = { politicianId: btn.getAttribute('data-id'), stateId: targetState };
    } else if (act === 'resolve-final-blitz') {
      const picks = [0, 1, 2].map((i) => document.getElementById(`v0180-blitz-${i}`)?.value).filter(Boolean);
      const _fbBlitz = (game.campaign?.recommendedStates || []).map(_normRecId).filter(Boolean).slice(0, 3);
      payload = { stateIds: picks.length ? picks : (_fbBlitz.length ? _fbBlitz : ['PA', 'MI', 'WI']) };
    }
    game = window.PartyChairEngine.takeAction(game, act, payload);
    if (typeof saveGame === 'function') saveGame(game);
    if (typeof render === 'function') render();
  });
}

})();
