/**
 * Coalition Builder: Party Chair — Version 0.19.0 Major Party Inverse-Power Autopsy Catalog (M1–M10).
 *
 * M1–M5 (Out of the Presidency): Helpful rebuilding options (strongest bounce-back at M1, lightest at M5).
 * M6–M10 (Controls the Presidency): Harmful infighting, hubris & thermostatic backlash options
 * (mildest at M6, harshest factional civil war at M10 Full Trifecta + 3 Priorities).
 *
 * Exposes `AUTOPSY_MAJOR` on `window.AutopsyCatalogMajor` and `module.exports`.
 */
(function (root, factory) {
  const catalog = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = catalog;
  }
  if (typeof window !== 'undefined') {
    window.AutopsyCatalogMajor = catalog;
  }
  if (root && typeof root === 'object') {
    root.AutopsyCatalogMajor = catalog;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const AUTOPSY_MAJOR = {
    // ------------------------------------------------------------------------
    // M1: 0 Priorities, No House, No Senate, No Pres — Max Buffs
    // ------------------------------------------------------------------------
    M1: [
      {
        id: 'major_m1_emergency_renewal_war_chest',
        track: 'major',
        bucket: 'M1',
        name: 'Emergency Renewal War Chest',
        theme: 'Locked-out party donors rally behind an all-hands rebuilding fund.',
        stateTargeting: null,
        effects: {
          treasury: 35,
          supporterTrust: 6,
        },
        summaryTemplate: '+$35M war chest & +6 Supporter Trust',
      },
      {
        id: 'major_m1_50_state_ground_up_rebuild',
        track: 'major',
        bucket: 'M1',
        name: '50-State Ground-Up Rebuild',
        theme: 'Sweep away Washington consultants and pour resources into local county committees.',
        stateTargeting: { mode: 'swing_states', count: 10 },
        effects: {
          chapters: 35,
          organizingActions: 4,
        },
        summaryTemplate: '+35 chapters across 10 battleground states & +4 Organizing Actions next cycle',
      },
      {
        id: 'major_m1_listening_tour_message_reset',
        track: 'major',
        bucket: 'M1',
        name: 'Listening Tour & Message Reset',
        theme: 'Humble town halls across alienated swing counties win back skeptical independents.',
        stateTargeting: { mode: 'swing_states', count: 10 },
        effects: {
          voters: 1400000,
          independentTrust: 8,
        },
        summaryTemplate: '+1,400,000 voters across 10 swing states & +8 Independent Trust',
      },
      {
        id: 'major_m1_existential_unity_truce',
        track: 'major',
        bucket: 'M1',
        name: 'Existential Unity Truce',
        theme: 'Total lock-out forces every warring wing to sign an ironclad reconstruction pact.',
        stateTargeting: null,
        effects: {
          factionHappiness: 15,
          factionConfidence: 12,
          factionFriction: -15,
          caucusStrength: 18,
        },
        summaryTemplate: '+15 Faction Happiness, +12 Confidence, -15 Friction & +18 Caucus Strength',
      },
      {
        id: 'major_m1_next_generation_recruitment_wave',
        track: 'major',
        bucket: 'M1',
        name: 'Next-Generation Recruitment Wave',
        theme: 'Clear out stale leadership to fast-track six breakout governors, mayors, and veterans.',
        stateTargeting: null,
        effects: {
          spawnCandidates: { count: 6, quality: 9.5, fame: 72 },
          candidateFameBoost: { count: 6, delta: 10 },
        },
        summaryTemplate: 'Recruit 6 Q9.5 (Fame 72) challengers & +10 Fame to top 6 roster stars',
      },
      {
        id: 'major_m1_resistance_media_counter_offensive',
        track: 'major',
        bucket: 'M1',
        name: 'Resistance Media Counter-Offensive',
        theme: 'Unite surrogates around an aggressive daily rapid-response narrative against the new majority.',
        stateTargeting: null,
        effects: {
          waveMomentum: 3.5,
          nationalEnvShift: 2.5,
        },
        summaryTemplate: '+3.5 Wave Momentum & +2.5% National Environment shift',
      },
      {
        id: 'major_m1_statehouse_fortress_strategy',
        track: 'major',
        bucket: 'M1',
        name: 'Statehouse Fortress Strategy',
        theme: 'Rebuild state legislative benches in lost capitals to contest redistricting and policy.',
        stateTargeting: { mode: 'lost_statehouse', count: 8 },
        effects: {
          chapters: 20,
          voters: 800000,
        },
        summaryTemplate: '+20 chapters & +800,000 voters across 8 lost statehouse battlegrounds',
      },
    ],

    // ------------------------------------------------------------------------
    // M2: 0 Priorities, No Pres, holds House or Senate — Strong Buffs
    // ------------------------------------------------------------------------
    M2: [
      {
        id: 'major_m2_opposition_defense_fund',
        track: 'major',
        bucket: 'M2',
        name: 'Opposition Defense Fund',
        theme: 'Grassroots contributors back the remaining congressional firewall against the White House.',
        stateTargeting: null,
        effects: {
          treasury: 26,
          supporterTrust: 5,
        },
        summaryTemplate: '+$26M defense fund & +5 Supporter Trust',
      },
      {
        id: 'major_m2_swing_district_field_surge',
        track: 'major',
        bucket: 'M2',
        name: 'Swing-District Field Surge',
        theme: 'Anchor full-time field directors in eight decisive congressional battlegrounds.',
        stateTargeting: { mode: 'swing_states', count: 8 },
        effects: {
          chapters: 26,
          organizingActions: 3,
        },
        summaryTemplate: '+26 chapters across 8 swing states & +3 Organizing Actions next cycle',
      },
      {
        id: 'major_m2_kitchen_table_voter_reengagement',
        track: 'major',
        bucket: 'M2',
        name: 'Kitchen-Table Voter Re-Engagement',
        theme: 'Pivot sharply from Beltway process fights to cost-of-living relief for swing voters.',
        stateTargeting: { mode: 'swing_states', count: 8 },
        effects: {
          voters: 950000,
          independentTrust: 6,
        },
        summaryTemplate: '+950,000 voters across 8 swing states & +6 Independent Trust',
      },
      {
        id: 'major_m2_caucus_closing_of_ranks',
        track: 'major',
        bucket: 'M2',
        name: 'Caucus Closing of Ranks',
        theme: 'Shared opposition duties bridge ideological rifts across congressional and statehouse wings.',
        stateTargeting: null,
        effects: {
          factionHappiness: 11,
          factionConfidence: 9,
          factionFriction: -10,
          caucusStrength: 12,
        },
        summaryTemplate: '+11 Faction Happiness, +9 Confidence, -10 Friction & +12 Caucus Strength',
      },
      {
        id: 'major_m2_oversight_accountability_spotlight',
        track: 'major',
        bucket: 'M2',
        name: 'Oversight & Accountability Spotlight',
        theme: 'Subpoena-backed hearings elevate rising committee stars onto national primetime.',
        stateTargeting: null,
        effects: {
          spawnCandidates: { count: 4, quality: 9.2, fame: 66 },
          candidateFameBoost: { count: 4, delta: 8 },
        },
        summaryTemplate: 'Recruit 4 Q9.2 (Fame 66) challengers & +8 Fame to top 4 candidates',
      },
      {
        id: 'major_m2_midterm_wave_positioning',
        track: 'major',
        bucket: 'M2',
        name: 'Midterm Wave Positioning',
        theme: 'Weaponize early administration missteps to tilt the national generic ballot.',
        stateTargeting: null,
        effects: {
          waveMomentum: 2.6,
          nationalEnvShift: 1.8,
        },
        summaryTemplate: '+2.6 Wave Momentum & +1.8% National Environment shift',
      },
      {
        id: 'major_m2_targeted_swing_state_voter_drive',
        track: 'major',
        bucket: 'M2',
        name: 'Targeted Swing-State Voter Drive',
        theme: 'Concentrate precinct captains and registration teams in five tipping-point states.',
        stateTargeting: { mode: 'swing_states', count: 5 },
        effects: {
          voters: 700000,
          chapters: 10,
        },
        summaryTemplate: '+700,000 voters & +10 chapters in {STATES}',
      },
    ],

    // ------------------------------------------------------------------------
    // M3: 1 Priority, No Pres — Solid Buffs
    // ------------------------------------------------------------------------
    M3: [
      {
        id: 'major_m3_bounce_back_donor_drive',
        track: 'major',
        bucket: 'M3',
        name: 'Bounce-Back Donor Drive',
        theme: 'Point to one clear strategic win as proof the party is poised for a comeback.',
        stateTargeting: null,
        effects: {
          treasury: 18,
          supporterTrust: 4,
        },
        summaryTemplate: '+$18M war chest & +4 Supporter Trust',
      },
      {
        id: 'major_m3_battleground_chapter_investment',
        track: 'major',
        bucket: 'M3',
        name: 'Battleground Chapter Investment',
        theme: 'Reinforce county organizations across six core purple battlegrounds.',
        stateTargeting: { mode: 'swing_states', count: 6 },
        effects: {
          chapters: 18,
          organizingActions: 2,
        },
        summaryTemplate: '+18 chapters across 6 swing states & +2 Organizing Actions next cycle',
      },
      {
        id: 'major_m3_independent_outreach_initiative',
        track: 'major',
        bucket: 'M3',
        name: 'Independent Outreach Initiative',
        theme: 'Reintroduce the opposition agenda to Ticket-Splitters and suburban independents.',
        stateTargeting: { mode: 'swing_states', count: 6 },
        effects: {
          voters: 600000,
          independentTrust: 5,
        },
        summaryTemplate: '+600,000 voters across 6 swing states & +5 Independent Trust',
      },
      {
        id: 'major_m3_post_election_coalition_reset',
        track: 'major',
        bucket: 'M3',
        name: 'Post-Election Coalition Reset',
        theme: 'Settle primary grievances early to keep the coalition unified for the next campaign.',
        stateTargeting: null,
        effects: {
          factionHappiness: 8,
          factionConfidence: 6,
          factionFriction: -7,
        },
        summaryTemplate: '+8 Faction Happiness, +6 Confidence & -7 Friction',
      },
      {
        id: 'major_m3_challenger_recruitment_push',
        track: 'major',
        bucket: 'M3',
        name: 'Challenger Recruitment Push',
        theme: 'Draft credible district and statewide recruits to capitalize on thermostatic backlash.',
        stateTargeting: null,
        effects: {
          spawnCandidates: { count: 3, quality: 9.0, fame: 60 },
          candidateFameBoost: { count: 3, delta: 6 },
        },
        summaryTemplate: 'Recruit 3 Q9.0 (Fame 60) challengers & +6 Fame to top 3 candidates',
      },
      {
        id: 'major_m3_thermostatic_counter_wave',
        track: 'major',
        bucket: 'M3',
        name: 'Thermostatic Counter-Wave',
        theme: 'Sharpen contrast ads framing the new White House as out of touch.',
        stateTargeting: null,
        effects: {
          waveMomentum: 1.8,
          nationalEnvShift: 1.2,
        },
        summaryTemplate: '+1.8 Wave Momentum & +1.2% National Environment shift',
      },
      {
        id: 'major_m3_donor_base_stabilization',
        track: 'major',
        bucket: 'M3',
        name: 'Donor-Base Stabilization',
        theme: 'Pair small-donor sustainers with faction outreach to steady the national committee.',
        stateTargeting: null,
        effects: {
          treasury: 12,
          factionHappiness: 6,
          supporterTrust: 4,
        },
        summaryTemplate: '+$12M war chest, +6 Faction Happiness & +4 Supporter Trust',
      },
    ],

    // ------------------------------------------------------------------------
    // M4: 2 Priorities, No Pres — Moderate Buffs
    // ------------------------------------------------------------------------
    M4: [
      {
        id: 'major_m4_steady_opposition_fundraising',
        track: 'major',
        bucket: 'M4',
        name: 'Steady Opposition Fundraising',
        theme: 'Strong downballot results reassure major bundlers ahead of the next cycle.',
        stateTargeting: null,
        effects: {
          treasury: 11,
          supporterTrust: 3,
        },
        summaryTemplate: '+$11M war chest & +3 Supporter Trust',
      },
      {
        id: 'major_m4_targeted_field_maintenance',
        track: 'major',
        bucket: 'M4',
        name: 'Targeted Field Maintenance',
        theme: 'Preserve active year-round field offices across four pivotal battleground states.',
        stateTargeting: { mode: 'swing_states', count: 4 },
        effects: {
          chapters: 10,
          organizingActions: 1,
        },
        summaryTemplate: '+10 chapters in {STATES} & +1 Organizing Action next cycle',
      },
      {
        id: 'major_m4_suburban_persuasion_campaign',
        track: 'major',
        bucket: 'M4',
        name: 'Suburban Persuasion Campaign',
        theme: 'Target pragmatic suburban corridors to widen opposition margins.',
        stateTargeting: { mode: 'swing_states', count: 4 },
        effects: {
          voters: 320000,
          independentTrust: 3,
        },
        summaryTemplate: '+320,000 voters in {STATES} & +3 Independent Trust',
      },
      {
        id: 'major_m4_pragmatic_caucus_detente',
        track: 'major',
        bucket: 'M4',
        name: 'Pragmatic Caucus Detente',
        theme: 'Split committee assignments fairly to keep ideological wings pulling together.',
        stateTargeting: null,
        effects: {
          factionHappiness: 5,
          factionConfidence: 4,
          factionFriction: -4,
        },
        summaryTemplate: '+5 Faction Happiness, +4 Confidence & -4 Friction',
      },
      {
        id: 'major_m4_selective_star_recruitment',
        track: 'major',
        bucket: 'M4',
        name: 'Selective Star Recruitment',
        theme: 'Handpick two top-tier statewide prospects for the upcoming cycle.',
        stateTargeting: null,
        effects: {
          spawnCandidates: { count: 2, quality: 8.8, fame: 55 },
        },
        summaryTemplate: 'Recruit 2 high-ceiling Q8.8 (Fame 55) challengers',
      },
      {
        id: 'major_m4_shadow_government_messaging',
        track: 'major',
        bucket: 'M4',
        name: 'Shadow-Government Messaging',
        theme: 'Contrast congressional oversight deliverables against White House missteps.',
        stateTargeting: null,
        effects: {
          waveMomentum: 1.1,
          nationalEnvShift: 0.7,
        },
        summaryTemplate: '+1.1 Wave Momentum & +0.7% National Environment shift',
      },
      {
        id: 'major_m4_grassroots_retention_audit',
        track: 'major',
        bucket: 'M4',
        name: 'Grassroots Retention Audit',
        theme: 'Modernize small-dollar reactivation lists while soothing active party volunteers.',
        stateTargeting: null,
        effects: {
          supporterTrust: 4,
          factionHappiness: 4,
          treasury: 5,
        },
        summaryTemplate: '+4 Supporter Trust, +4 Faction Happiness & +$5M',
      },
    ],

    // ------------------------------------------------------------------------
    // M5: 3 Priorities, No Pres — Light Buffs
    // ------------------------------------------------------------------------
    M5: [
      {
        id: 'major_m5_victory_lap_donor_appeal',
        track: 'major',
        bucket: 'M5',
        name: 'Victory-Lap Donor Appeal',
        theme: 'Celebrate downballot clean-sweep metrics with reliable party financiers.',
        stateTargeting: null,
        effects: {
          treasury: 6,
          supporterTrust: 2,
        },
        summaryTemplate: '+$6M war chest & +2 Supporter Trust',
      },
      {
        id: 'major_m5_precision_precinct_tune_up',
        track: 'major',
        bucket: 'M5',
        name: 'Precision Precinct Tune-Up',
        theme: 'Add targeted volunteer captains in three razor-thin swing states.',
        stateTargeting: { mode: 'swing_states', count: 3 },
        effects: {
          chapters: 5,
        },
        summaryTemplate: '+5 chapters in {STATES}',
      },
      {
        id: 'major_m5_modest_swing_registration',
        track: 'major',
        bucket: 'M5',
        name: 'Modest Swing Registration',
        theme: 'Quietly register lean-opposition commuters in three key battlegrounds.',
        stateTargeting: { mode: 'swing_states', count: 3 },
        effects: {
          voters: 150000,
          independentTrust: 2,
        },
        summaryTemplate: '+150,000 voters in {STATES} & +2 Independent Trust',
      },
      {
        id: 'major_m5_tactical_coalition_smoothing',
        track: 'major',
        bucket: 'M5',
        name: 'Tactical Coalition Smoothing',
        theme: 'Keep coalition partners content after fulfilling all downballot priorities.',
        stateTargeting: null,
        effects: {
          factionHappiness: 3,
          factionFriction: -2,
        },
        summaryTemplate: '+3 Faction Happiness & -2 Friction',
      },
      {
        id: 'major_m5_bench_grooming',
        track: 'major',
        bucket: 'M5',
        name: 'Bench Grooming',
        theme: 'Promote one promising state lawmaker and elevate existing top surrogates.',
        stateTargeting: null,
        effects: {
          spawnCandidates: { count: 1, quality: 8.5, fame: 50 },
          candidateFameBoost: { count: 2, delta: 3 },
        },
        summaryTemplate: 'Recruit 1 Q8.5 (Fame 50) prospect & +3 Fame to top 2 candidates',
      },
      {
        id: 'major_m5_measured_counter_messaging',
        track: 'major',
        bucket: 'M5',
        name: 'Measured Counter-Messaging',
        theme: 'Maintain disciplined air cover without overplaying your opposition hand.',
        stateTargeting: null,
        effects: {
          waveMomentum: 0.6,
          nationalEnvShift: 0.3,
        },
        summaryTemplate: '+0.6 Wave Momentum & +0.3% National Environment shift',
      },
      {
        id: 'major_m5_presidential_blame_vs_downballot_credit',
        track: 'major',
        bucket: 'M5',
        name: 'Presidential Blame vs. Downballot Credit',
        theme: 'Fundraising surges on congressional wins even as presidential nominees trade blame.',
        stateTargeting: null,
        effects: {
          treasury: 8,
          supporterTrust: 3,
          factionFriction: 3,
        },
        summaryTemplate: '+$8M & +3 Supporter Trust, at the cost of +3 Friction',
      },
    ],

    // ------------------------------------------------------------------------
    // M6: 0 Priorities, Controls Pres — Mild Debuffs
    // ------------------------------------------------------------------------
    M6: [
      {
        id: 'major_m6_patronage_squabbles',
        track: 'major',
        bucket: 'M6',
        name: 'Patronage Squabbles',
        theme: 'Missed priorities spark bickering over White House appointments and agency posts.',
        stateTargeting: null,
        effects: {
          factionHappiness: -4,
          factionFriction: 4,
        },
        summaryTemplate: '-4 Faction Happiness & +4 Friction',
      },
      {
        id: 'major_m6_donor_fatigue_sets_in',
        track: 'major',
        bucket: 'M6',
        name: 'Donor Fatigue Sets In',
        theme: 'Financiers slow checks as the incumbent coalition struggles to deliver early wins.',
        stateTargeting: null,
        effects: {
          treasury: -8,
          supporterTrust: -2,
        },
        summaryTemplate: '-$8M war chest & -2 Supporter Trust',
      },
      {
        id: 'major_m6_honeymoon_stumble',
        track: 'major',
        bucket: 'M6',
        name: 'Honeymoon Stumble',
        theme: 'Early legislative misfires cool independent enthusiasm for the administration.',
        stateTargeting: null,
        effects: {
          independentTrust: -3,
          waveMomentum: -0.6,
        },
        summaryTemplate: '-3 Independent Trust & -0.6 Wave Momentum',
      },
      {
        id: 'major_m6_neglected_state_parties',
        track: 'major',
        bucket: 'M6',
        name: 'Neglected State Parties',
        theme: 'Campaign staff depart for West Wing jobs, hollowing out four battleground committees.',
        stateTargeting: { mode: 'swing_states', count: 4 },
        effects: {
          chapters: -6,
        },
        summaryTemplate: '-6 chapters in {STATES}',
      },
      {
        id: 'major_m6_base_disappointment',
        track: 'major',
        bucket: 'M6',
        name: 'Base Disappointment',
        theme: 'Lead factions grumble that the White House watered down its core agenda.',
        stateTargeting: null,
        effects: {
          topFactionHappiness: -6,
          presidentialApproval: -3,
        },
        summaryTemplate: '-6 Top Faction Happiness & -3 Presidential Approval',
      },
      {
        id: 'major_m6_staff_poaching_drain',
        track: 'major',
        bucket: 'M6',
        name: 'Staff Poaching Drain',
        theme: 'Administration staffing strips experienced field talent from the National Committee.',
        stateTargeting: null,
        effects: {
          organizingActions: -1,
          factionConfidence: -3,
        },
        summaryTemplate: '-1 Organizing Action next cycle & -3 Faction Confidence',
      },
      {
        id: 'major_m6_moderate_wing_restlessness',
        track: 'major',
        bucket: 'M6',
        name: 'Moderate-Wing Restlessness',
        theme: 'Wavering swing voters peel away in four key states as governing compromises sour.',
        stateTargeting: { mode: 'swing_states', count: 4 },
        effects: {
          nationalEnvShift: -0.5,
          voters: -200000,
        },
        summaryTemplate: '-0.5% National Environment shift & -200,000 voters in {STATES}',
      },
    ],

    // ------------------------------------------------------------------------
    // M7: 1 Priority, Controls Pres — Moderate Debuffs
    // ------------------------------------------------------------------------
    M7: [
      {
        id: 'major_m7_cabinet_confirmation_turf_war',
        track: 'major',
        bucket: 'M7',
        name: 'Cabinet Confirmation Turf War',
        theme: 'Rival caucuses ambush key nominees over ideological and patronage slights.',
        stateTargeting: null,
        effects: {
          factionHappiness: -7,
          factionFriction: 7,
          caucusStrength: -6,
        },
        summaryTemplate: '-7 Faction Happiness, +7 Friction & -6 Caucus Strength',
      },
      {
        id: 'major_m7_post_victory_donor_complacency',
        track: 'major',
        bucket: 'M7',
        name: 'Post-Victory Donor Complacency',
        theme: 'Holding the Oval Office lulls bundlers into closing their checkbooks too early.',
        stateTargeting: null,
        effects: {
          treasury: -14,
          supporterTrust: -4,
        },
        summaryTemplate: '-$14M war chest & -4 Supporter Trust',
      },
      {
        id: 'major_m7_thermostatic_swing_backlash',
        track: 'major',
        bucket: 'M7',
        name: 'Thermostatic Swing Backlash',
        theme: 'Midterm-cycle voters instinctively recoil against executive-branch headlines.',
        stateTargeting: null,
        effects: {
          independentTrust: -5,
          waveMomentum: -1.1,
          nationalEnvShift: -0.9,
        },
        summaryTemplate: '-5 Independent Trust, -1.1 Wave Momentum & -0.9% National Environment drag',
      },
      {
        id: 'major_m7_field_apparatus_atrophy',
        track: 'major',
        bucket: 'M7',
        name: 'Field Apparatus Atrophy',
        theme: 'National HQ shutters battleground offices across five states to cut burn rate.',
        stateTargeting: { mode: 'swing_states', count: 5 },
        effects: {
          chapters: -12,
          organizingActions: -1,
        },
        summaryTemplate: '-12 chapters in {STATES} & -1 Organizing Action next cycle',
      },
      {
        id: 'major_m7_ideological_wing_feud',
        track: 'major',
        bucket: 'M7',
        name: 'Ideological Wing Feud',
        theme: 'Public infighting between flagship party wings drags down White House approval.',
        stateTargeting: null,
        effects: {
          topFactionHappiness: -10,
          factionFriction: 10,
          presidentialApproval: -4,
        },
        summaryTemplate: '-10 Top Faction Happiness, +10 Friction & -4 Presidential Approval',
      },
      {
        id: 'major_m7_suburban_voter_drift',
        track: 'major',
        bucket: 'M7',
        name: 'Suburban Voter Drift',
        theme: 'Ticket-splitters drift back toward the opposition across five pivotal swing states.',
        stateTargeting: { mode: 'swing_states', count: 5 },
        effects: {
          voters: -450000,
        },
        summaryTemplate: '-450,000 voters in {STATES}',
      },
      {
        id: 'major_m7_primary_challenge_rumblings',
        track: 'major',
        bucket: 'M7',
        name: 'Primary Challenge Rumblings',
        theme: 'Restless activists threaten vulnerable incumbents ahead of next cycle primaries.',
        stateTargeting: null,
        effects: {
          sittingMemberHappiness: -6,
          factionConfidence: -6,
          candidateFameBoost: { count: 1, delta: -4 },
        },
        summaryTemplate: '-6 Sitting Member Happiness, -6 Confidence & -4 Fame to top candidate',
      },
    ],

    // ------------------------------------------------------------------------
    // M8: 2 Priorities, Controls Pres — Significant Debuffs
    // ------------------------------------------------------------------------
    M8: [
      {
        id: 'major_m8_open_factional_turf_war',
        track: 'major',
        bucket: 'M8',
        name: 'Open Factional Turf War',
        theme: 'Victorious wings clash openly over credit, committee gavels, and floor strategy.',
        stateTargeting: null,
        effects: {
          factionHappiness: -10,
          factionConfidence: -8,
          factionFriction: 12,
          caucusStrength: -10,
        },
        summaryTemplate: '-10 Faction Happiness, -8 Confidence, +12 Friction & -10 Caucus Strength',
      },
      {
        id: 'major_m8_white_house_overreach_backlash',
        track: 'major',
        bucket: 'M8',
        name: 'White House Overreach Backlash',
        theme: 'Aggressive executive actions energize independent swing voters against the ruling party.',
        stateTargeting: null,
        effects: {
          independentTrust: -7,
          waveMomentum: -1.8,
          nationalEnvShift: -1.5,
        },
        summaryTemplate: '-7 Independent Trust, -1.8 Wave Momentum & -1.5% National Environment drag',
      },
      {
        id: 'major_m8_complacent_machine_collapse',
        track: 'major',
        bucket: 'M8',
        name: 'Complacent Machine Collapse',
        theme: 'Beltway arrogance starves six swing-state committees of cash and organizing capacity.',
        stateTargeting: { mode: 'swing_states', count: 6 },
        effects: {
          treasury: -22,
          chapters: -18,
          organizingActions: -2,
        },
        summaryTemplate: '-$22M war chest, -18 chapters across 6 swing states & -2 Organizing Actions',
      },
      {
        id: 'major_m8_swing_voter_exodus',
        track: 'major',
        bucket: 'M8',
        name: 'Swing-Voter Exodus',
        theme: 'Centrist voters abandon the incumbent coalition across eight battleground states.',
        stateTargeting: { mode: 'swing_states', count: 8 },
        effects: {
          voters: -850000,
        },
        summaryTemplate: '-850,000 voters across 8 swing states',
      },
      {
        id: 'major_m8_lobbyist_patronage_scandal',
        track: 'major',
        bucket: 'M8',
        name: 'Lobbyist & Patronage Scandal',
        theme: 'Cozy K-Street ties inside the administration trigger an ethics firestorm.',
        stateTargeting: null,
        effects: {
          presidentialApproval: -7,
          supporterTrust: -6,
          independentTrust: -5,
        },
        summaryTemplate: '-7 Presidential Approval, -6 Supporter Trust & -5 Independent Trust',
      },
      {
        id: 'major_m8_caucus_schism_warning',
        track: 'major',
        bucket: 'M8',
        name: 'Caucus Schism Warning',
        theme: 'Vulnerable incumbents revolt against party whip demands as factional tension spikes.',
        stateTargeting: null,
        effects: {
          topFactionHappiness: -14,
          factionFriction: 15,
          sittingMemberHappiness: -10,
        },
        summaryTemplate: '-14 Top Faction Happiness, +15 Friction & -10 Sitting Member Happiness',
      },
      {
        id: 'major_m8_opposition_awakening',
        track: 'major',
        bucket: 'M8',
        name: 'Opposition Awakening',
        theme: 'Your governing momentum galvanizes a massive fundraising windfall for the rival party.',
        stateTargeting: null,
        effects: {
          nationalEnvShift: -2.0,
          rivalTreasury: 10,
        },
        summaryTemplate: '-2.0% National Environment shift & +$10M granted to main rival treasury',
      },
    ],

    // ------------------------------------------------------------------------
    // M9: 3 Priorities, Controls Pres, No Trifecta — Heavy Debuffs
    // ------------------------------------------------------------------------
    M9: [
      {
        id: 'major_m9_factional_purity_spiral',
        track: 'major',
        bucket: 'M9',
        name: 'Factional Purity Spiral',
        theme: 'With the presidency won and 3 priorities achieved, rival wings demand total ideological obedience.',
        stateTargeting: null,
        effects: {
          factionHappiness: -14,
          factionConfidence: -11,
          factionFriction: 16,
          caucusStrength: -14,
        },
        summaryTemplate: '-14 Faction Happiness, -11 Confidence, +16 Friction & -14 Caucus Strength',
      },
      {
        id: 'major_m9_severe_thermostatic_backlash',
        track: 'major',
        bucket: 'M9',
        name: 'Severe Thermostatic Backlash',
        theme: 'Unrelenting partisan saturation drives independents sharply into the opposition camp.',
        stateTargeting: null,
        effects: {
          independentTrust: -9,
          waveMomentum: -2.5,
          nationalEnvShift: -2.2,
        },
        summaryTemplate: '-9 Independent Trust, -2.5 Wave Momentum & -2.2% National Environment drag',
      },
      {
        id: 'major_m9_national_committee_hollowing',
        track: 'major',
        bucket: 'M9',
        name: 'National Committee Hollowing',
        theme: 'West Wing takeover drains committee reserves and shutters 24 state chapters.',
        stateTargeting: { mode: 'swing_states', count: 8 },
        effects: {
          treasury: -30,
          chapters: -24,
          organizingActions: -2,
        },
        summaryTemplate: '-$30M war chest, -24 chapters across 8 swing states & -2 Organizing Actions',
      },
      {
        id: 'major_m9_suburban_working_class_defection',
        track: 'major',
        bucket: 'M9',
        name: 'Suburban & Working-Class Defection',
        theme: 'Cross-pressured voters peel away en masse across ten decisive swing states.',
        stateTargeting: { mode: 'swing_states', count: 10 },
        effects: {
          voters: -1250000,
        },
        summaryTemplate: '-1,250,000 voters across 10 swing states',
      },
      {
        id: 'major_m9_governing_arrogance_crisis',
        track: 'major',
        bucket: 'M9',
        name: 'Governing Arrogance Crisis',
        theme: 'Triumphalist miscalculations alienate both loyal base voters and independents.',
        stateTargeting: null,
        effects: {
          presidentialApproval: -10,
          supporterTrust: -8,
          independentTrust: -8,
        },
        summaryTemplate: '-10 Presidential Approval, -8 Supporter Trust & -8 Independent Trust',
      },
      {
        id: 'major_m9_intraparty_primary_warfare',
        track: 'major',
        bucket: 'M9',
        name: 'Intraparty Primary Warfare',
        theme: 'Ideological PACs declare open season on sitting caucus lawmakers.',
        stateTargeting: null,
        effects: {
          sittingMemberHappiness: -14,
          caucusStrength: -16,
          factionFriction: 18,
        },
        summaryTemplate: '-14 Sitting Member Happiness, -16 Caucus Strength & +18 Friction',
      },
      {
        id: 'major_m9_third_party_rival_surge',
        track: 'major',
        bucket: 'M9',
        name: 'Third-Party & Rival Surge',
        theme: 'Disaffected voters bolt toward insurgent alternatives across six swing battlegrounds.',
        stateTargeting: { mode: 'swing_states', count: 6 },
        effects: {
          nationalEnvShift: -2.5,
          voters: -600000,
        },
        summaryTemplate: '-2.5% National Environment drag & -600,000 voters across 6 swing states',
      },
    ],

    // ------------------------------------------------------------------------
    // M10: 3 Priorities, Full Trifecta — Peak Infighting & Backlash Debuffs
    // ------------------------------------------------------------------------
    M10: [
      {
        id: 'major_m10_trifecta_civil_war',
        track: 'major',
        bucket: 'M10',
        name: 'Trifecta Civil War',
        theme: 'With zero opposition left to blame, every caucus turns its fire inward.',
        stateTargeting: null,
        effects: {
          factionHappiness: -18,
          factionConfidence: -15,
          factionFriction: 22,
          caucusStrength: -20,
        },
        summaryTemplate: '-18 Faction Happiness, -15 Confidence, +22 Friction & -20 Caucus Strength',
      },
      {
        id: 'major_m10_historic_thermostatic_recoil',
        track: 'major',
        bucket: 'M10',
        name: 'Historic Thermostatic Recoil',
        theme: 'Unified one-party rule sparks a fierce nationwide backlash from center-ground voters.',
        stateTargeting: null,
        effects: {
          independentTrust: -12,
          waveMomentum: -3.5,
          nationalEnvShift: -3.0,
        },
        summaryTemplate: '-12 Independent Trust, -3.5 Wave Momentum & -3.0% National Environment drag',
      },
      {
        id: 'major_m10_imperial_complacency_collapse',
        track: 'major',
        bucket: 'M10',
        name: 'Imperial Complacency Collapse',
        theme: 'Bloat and infighting drain the treasury and dismantle grassroots offices nationwide.',
        stateTargeting: { mode: 'swing_states', count: 10 },
        effects: {
          treasury: -40,
          chapters: -32,
          organizingActions: -3,
        },
        summaryTemplate: '-$40M war chest, -32 chapters across 10 swing states & -3 Organizing Actions',
      },
      {
        id: 'major_m10_mass_independent_flight',
        track: 'major',
        bucket: 'M10',
        name: 'Mass Independent Flight',
        theme: 'Swaths of swing voters defect across a dozen battleground states after trifecta overreach.',
        stateTargeting: { mode: 'swing_states', count: 12 },
        effects: {
          voters: -1850000,
        },
        summaryTemplate: '-1,850,000 voters across 12 swing states',
      },
      {
        id: 'major_m10_hubris_overreach_implosion',
        track: 'major',
        bucket: 'M10',
        name: 'Hubris & Overreach Implosion',
        theme: 'Public blunders shatter White House standing with both the base and independents.',
        stateTargeting: null,
        effects: {
          presidentialApproval: -14,
          supporterTrust: -10,
          independentTrust: -10,
        },
        summaryTemplate: '-14 Presidential Approval, -10 Supporter Trust & -10 Independent Trust',
      },
      {
        id: 'major_m10_splinter_secession_crisis',
        track: 'major',
        bucket: 'M10',
        name: 'Splinter & Secession Crisis',
        theme: 'Your most alienated wing inches toward an open walkout as legislative discipline fractures.',
        stateTargeting: null,
        effects: {
          lowestFactionHappiness: -25,
          factionFriction: 28,
          sittingMemberHappiness: -16,
        },
        summaryTemplate: '-25 Lowest Faction Happiness, +28 Friction & -16 Sitting Member Happiness',
      },
      {
        id: 'major_m10_oppositions_golden_hour',
        track: 'major',
        bucket: 'M10',
        name: "The Opposition's Golden Hour",
        theme: 'Rival donors pour emergency fortunes into challenging your unchecked trifecta.',
        stateTargeting: null,
        effects: {
          nationalEnvShift: -3.2,
          rivalTreasury: 18,
          caucusStrength: -12,
        },
        summaryTemplate: '-3.2% National Environment drag, +$18M to main rival & -12 Caucus Strength',
      },
    ],
  };

  const api = { AUTOPSY_MAJOR };
  Object.keys(AUTOPSY_MAJOR).forEach((bucketId) => {
    Object.defineProperty(api, bucketId, {
      value: AUTOPSY_MAJOR[bucketId],
      enumerable: false,
      configurable: false,
      writable: false,
    });
  });
  return api;
});
