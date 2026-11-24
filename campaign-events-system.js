/* ==========================================================================
   v0.18.5 STANDALONE MODULE:
   Campaign Events Overhaul — 157 Dynamic Events, Multi-Month Story Arcs,
   Exact 1/3 Tier 1-4 Voter Registration Mechanic, Breaking News Desk UI,
   and Ultra-Rare All-Tier Generational Windfall (+10,000 Voters x 10 States).
   Exposes window.CampaignEventsSystem (and module.exports for Node tests).
   Zero Math.random() — 100% deterministic seeded FNV-1a hashing.
   ========================================================================== */
(function (global) {
  'use strict';

  const VERSION = '0.18.5';
  const JACKPOT_ID = 'ev_historic_civic_awakening';
  const JACKPOT_STATES_COUNT = 10;
  const JACKPOT_VOTERS_PER_STATE = 10000;
  const JACKPOT_MONTHLY_ODDS = 0.018;
  const EVENT_COOLDOWN_CYCLES = 6;
  const MAX_HISTORY = 60;

  const REGION_STATES = {
    'New England': ['ME', 'NH', 'VT', 'MA', 'RI', 'CT'],
    'Mid-Atlantic': ['NY', 'NJ', 'PA', 'DE', 'MD'],
    'Rust Belt': ['OH', 'MI', 'WI', 'IN', 'IL', 'MN', 'IA'],
    'Sun Belt': ['AZ', 'NV', 'NM', 'TX', 'FL', 'GA', 'NC'],
    'Mountain West': ['MT', 'WY', 'ID', 'CO', 'UT', 'AK', 'ND', 'SD'],
    'Pacific': ['CA', 'OR', 'WA', 'HI'],
    'South': ['VA', 'SC', 'TN', 'AL', 'MS', 'LA', 'AR', 'KY', 'WV', 'OK', 'MO', 'KS', 'NE'],
  };

  const STATE_TO_REGION = {};
  Object.entries(REGION_STATES).forEach(([reg, list]) => {
    list.forEach((st) => { STATE_TO_REGION[st] = reg; });
  });

  const PARTY_LABELS = {
    people: 'Democratic Party',
    heritage: 'Republican Party',
    liberty: 'Libertarian Party',
    green: 'Green Party',
    constitution: 'Constitution Party',
    socialist: 'Socialist Party',
    justice: 'Justice Party',
    player: 'Your Party',
  };

  /* ------------------------------------------------------------------------
     Deterministic Hash & Utility Helpers (Zero Math.random)
     ------------------------------------------------------------------------ */
  function fnv1aHash(str) {
    const s = String(str || '');
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  function seededUnit(seedStr) {
    return (parseInt(fnv1aHash(seedStr), 16) >>> 0) / 4294967296;
  }

  function clamp(v, lo, hi) {
    const n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  function round1(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 10) / 10;
  }

  function round2(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100) / 100;
  }

  function safeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPlayerPartyId(game) {
    if (!game) return 'people';
    if (game.player?.custom) return 'player';
    return game.player?.baseTemplateId || game.player?.id || 'people';
  }

  function getPlayerTier(game) {
    const pId = getPlayerPartyId(game);
    const raw = game?.partyTiers?.[pId]?.tier ?? game?.partyTiers?.[pId] ?? game?.parties?.[pId]?.tier;
    if (Number.isFinite(Number(raw))) return clamp(Number(raw), 0, 5);
    return ['people', 'heritage'].includes(pId) ? 5 : 1;
  }

  /* ------------------------------------------------------------------------
     157-EVENT MASTER CATALOG
     - Tier 1 Core: 30 events (10 [REG] = 33.3%)
     - Tier 2 Core: 30 events (10 [REG] = 33.3%)
     - Tier 3 Core: 30 events (10 [REG] = 33.3%)
     - Tier 4 Core: 30 events (10 [REG] = 33.3%)
     - Tier 5 Exclusive: 18 events (2 [REG])
     - Universal Multi-Tier & Story-Arc: 18 events (6 [REG] = 33.3%)
     - Ultra-Rare All-Tier Windfall ("Jackpot"): 1 event (all Tiers 0-5)
     Total = 157 distinct events.
     ------------------------------------------------------------------------ */
  const RAW_EVENT_SPECS = [
    // === 6.1 TIER 1 CORE POOL (30 events | 10 [REG]) ===
    ['ev_t1_01', 'tier1', 'ballot_legal', 'critical', false, 'arc_ballot_lawfare', 1, 'Ballot-Access Petition Signature Challenge in {STATE}', 'Rival attorneys in {STATE} filed an emergency objection challenging thousands of your petition signatures weeks before ballots print.'],
    ['ev_t1_02', 'tier1', 'grassroots', 'standard', true, null, 0, 'County Fair Straw Poll Surprise Win in {STATE}', 'Your volunteers swept a crowded county fair straw poll in {STATE}, turning heads among local reporters and undecided voters.'],
    ['ev_t1_03', 'tier1', 'media_viral', 'major', true, null, 0, 'Local Radio Host Grants Uncut 90-Minute Interview', 'A popular syndicated talk host in {REGION} gave your ticket an unedited 90-minute showcase on {THEME}, lighting up the phone lines.'],
    ['ev_t1_04', 'tier1', 'debate_trail', 'standard', false, null, 0, 'Major-Party "Spoiler Effect" Op-Ed Blitz', '{RIVAL_PARTY} columnists coordinated a regional op-ed wave warning voters in {STATE} not to "waste their ballot" on an insurgent ticket.'],
    ['ev_t1_05', 'tier1', 'grassroots', 'standard', true, null, 0, 'College Campus Free-Speech Rally Sparks Sign-Ups', 'An overflow student rally in {STATE} turned into a spontaneous voter-registration table line stretching across the quad.'],
    ['ev_t1_06', 'tier1', 'ballot_legal', 'major', false, null, 0, 'Secretary of State Notary Technicality Threatens Filing', 'A last-minute notary stamp formatting dispute in {STATE} could knock downballot nominees off the general election slate.'],
    ['ev_t1_07', 'tier1', 'media_viral', 'major', true, null, 0, 'Small-Town Diner Livestream Hits 2M Views', 'An unvarnished Q&A with working families in {STATE} racked up 2 million views overnight and flooded your website with volunteers.'],
    ['ev_t1_08', 'tier1', 'grassroots', 'standard', false, null, 0, 'Volunteer Van Breaks Down Mid-Tour in {STATE}', 'Your regional organizing van threw a rod outside a key county seat in {STATE}, stranding yard signs and canvass packets.'],
    ['ev_t1_09', 'tier1', 'coalition', 'major', true, null, 0, 'Disillusioned {RIVAL_PARTY} Precinct Captain Defects', 'A respected 20-year {RIVAL_PARTY} precinct captain in {STATE} publicly crossed over, bringing a binder of disaffected neighborhood voters.'],
    ['ev_t1_10', 'tier1', 'debate_trail', 'critical', false, 'arc_debate_gate', 1, 'Debate Commission Refuses Stage Entry', 'The debate commission cited strict legacy polling rules to bar your nominee from the {STATE} stage, sparking grassroots outrage.'],
    ['ev_t1_11', 'tier1', 'coalition', 'standard', false, null, 0, 'Rival Purists Demand Ideological Litmus Test', 'Hardline activists inside {FACTION} circulated an open pledge demanding zero compromise on {THEME} or they will sit out GOTV.'],
    ['ev_t1_12', 'tier1', 'media_viral', 'standard', true, null, 0, 'Crowdfunded Billboard Campaign Goes Up on {STATE} Interstate', 'Grassroots donors funded 14 highway billboards along major commuter corridors in {STATE} with a QR link to register and volunteer.'],
    ['ev_t1_13', 'tier1', 'ballot_legal', 'standard', false, null, 0, 'Municipal Election Clerk Praises Clean Filing', 'County clerks in {STATE} publicly commended your chapter for submitting the cleanest ballot paperwork in a decade.'],
    ['ev_t1_14', 'tier1', 'media_viral', 'standard', false, null, 0, 'Indie Documentary Crew Follows Your Trail Bus', 'An acclaimed independent filmmaker asked for unfiltered backstage access to your {REGION} campaign swing.'],
    ['ev_t1_15', 'tier1', 'grassroots', 'standard', true, null, 0, 'Farmers\' Market & Union Hall Listening Tour', 'Direct face-to-face conversations on {THEME} across {STATE} opened doors with skeptical independent voters.'],
    ['ev_t1_16', 'tier1', 'gaffe', 'major', false, null, 0, 'Fringe Spokesperson Off-Message Podcast Rant', 'A local surrogate went off-script on a late-night podcast, handing {RIVAL_PARTY} trackers a 20-second clip to blast across {STATE}.'],
    ['ev_t1_17', 'tier1', 'coalition', 'standard', false, null, 0, 'Regional Third-Party Coalition Endorsement Offer', 'Independent reform clubs in {REGION} offered a joint cross-endorsement if you share stage time at their autumn convention.'],
    ['ev_t1_18', 'tier1', 'ballot_legal', 'major', false, null, 0, 'State Legislature Floats Higher Ballot-Signature Threshold', 'Establishment lawmakers in {STATE} introduced a bill doubling future minor-party signature requirements.'],
    ['ev_t1_19', 'tier1', 'media_viral', 'standard', true, null, 0, 'Viral Infographics Break Through Local Subreddits in {STATE}', 'Volunteer-designed policy explainers on {THEME} topped regional forums in {STATE}, driving thousands of clicks to registration portals.'],
    ['ev_t1_20', 'tier1', 'economic', 'major', false, null, 0, 'Micro-Donor Match Challenge from Retired Entrepreneur', 'A retired local business founder in {STATE} offered to match small-dollar contributions dollar-for-dollar up to $2.5M.'],
    ['ev_t1_21', 'tier1', 'grassroots', 'standard', true, null, 0, 'County Courthouse Steps Rally Draws Unexpected Crowd', 'Three times the expected crowd packed the courthouse lawn in {STATE} to hear your closing pitch on {THEME}.'],
    ['ev_t1_22', 'tier1', 'media_viral', 'standard', false, null, 0, 'Local Newspaper Editorial Calls Your Platform "Refreshingly Honest"', 'The flagship paper in {STATE} stopped short of an endorsement but praised your willingness to debate real numbers.'],
    ['ev_t1_23', 'tier1', 'coalition', 'standard', false, null, 0, 'Rival Campaigns Poach Your Field Organizers in {STATE}', 'Flush with major-party cash, {RIVAL_PARTY} field directors offered paid stipends to lure away your top volunteer leads.'],
    ['ev_t1_24', 'tier1', 'economic', 'major', false, null, 0, 'Federal Matching-Funds 5% Threshold Polling Surge', 'A fresh tracking poll put your party within striking distance of the 5% national threshold, energizing donors and {FACTION}.'],
    ['ev_t1_25', 'tier1', 'grassroots', 'standard', true, null, 0, 'Door-to-Door Ballot-Line Canvass Hits Rural Counties', 'Weekend canvassers knocked 18,000 doors in overlooked rural counties of {STATE} that neither major party visited.'],
    ['ev_t1_26', 'tier1', 'gaffe', 'standard', false, null, 0, 'Overzealous Volunteer Clashes with Local Press', 'A heated hallway argument between a chapter volunteer and a TV reporter in {STATE} briefly hijacked your media coverage.'],
    ['ev_t1_27', 'tier1', 'debate_trail', 'standard', false, null, 0, 'Cross-Party Town Hall on {THEME} Draws Undecideds', 'A nonpartisan civic group in {STATE} invited all ballot-qualified parties to debate {THEME} on equal footing.'],
    ['ev_t1_28', 'tier1', 'ballot_legal', 'critical', false, 'arc_ballot_lawfare', 2, 'State Supreme Court Grants Emergency Ballot Injunction', 'After marathon oral arguments, appellate judges in {STATE} weighed whether to restore your ballot line before absentee printing.'],
    ['ev_t1_29', 'tier1', 'debate_trail', 'critical', false, 'arc_debate_gate', 2, 'Counter-Programming Livestream Debate Draws 800k Viewers', 'Locked off the main stage, your live-rebuttal stream broke platform records and trended #1 across {REGION}.'],
    ['ev_t1_30', 'tier1', 'ballot_legal', 'critical', false, 'arc_ballot_lawfare', 3, 'Courtroom Victory Bounce or Write-In Contingency Scramble in {STATE}', 'The final ruling on your {STATE} ballot access landed just as early voting opened, defining your campaign\'s underdog narrative.'],

    // === 6.2 TIER 2 CORE POOL (30 events | 10 [REG]) ===
    ['ev_t2_01', 'tier2', 'media_viral', 'major', true, null, 0, 'Three-Hour Long-Form Podcast Goes Viral', 'Your nominee\'s relaxed three-hour podcast appearance on {THEME} drew 6M listeners and sparked a nationwide wave of voter lookups.'],
    ['ev_t2_02', 'tier2', 'economic', 'standard', false, null, 0, 'Regional Chamber of Commerce Invites Your Nominee', 'Small-business leaders across {REGION} invited your party to present an alternative economic blueprint alongside major-party speakers.'],
    ['ev_t2_03', 'tier2', 'grassroots', 'major', true, null, 0, 'First Competitive State-House District Polls Within 3 Points', 'Internal tracking in {STATE} shows your flagship state-legislative nominee within striking distance of an historic upset.'],
    ['ev_t2_04', 'tier2', 'debate_trail', 'standard', false, null, 0, '{RIVAL_PARTY} Runs "A Vote for Them Is a Vote for Us" Mailers', 'Sensing momentum in {STATE}, {RIVAL_PARTY} dropped glossy fear-based mailers targeting your softest swing supporters.'],
    ['ev_t2_05', 'tier2', 'ballot_legal', 'major', true, null, 0, 'State-Level Ranked-Choice Voting Coalition Seeks Co-Sponsor', 'Electoral reform advocates in {STATE} want your chapters to co-anchor a high-visibility pro-RCV voter registration push.'],
    ['ev_t2_06', 'tier2', 'media_viral', 'standard', false, null, 0, 'Regional TV News Anchors Feature Your {STATE} Surge', 'Evening anchors in three {REGION} media markets ran back-to-back segments asking whether your party could tip the cycle.'],
    ['ev_t2_07', 'tier2', 'coalition', 'major', false, null, 0, 'Internal Split Between Pragmatic Builders and Movement Purists', 'Growth pains boiled over as {FACTION} clashed with pragmatic state chairs over softening rhetoric to win suburban voters.'],
    ['ev_t2_08', 'tier2', 'grassroots', 'major', true, null, 0, 'Multi-County Voter Registration Caravan in {REGION}', 'Your state chapters organized a 12-county registration caravan targeting independent households across {REGION}.'],
    ['ev_t2_09', 'tier2', 'coalition', 'major', false, null, 0, 'Retired State Senator Endorses Your Reform Slate', 'A respected retired lawmaker in {STATE} endorsed your ticket, lending instant institutional credibility with older moderates.'],
    ['ev_t2_10', 'tier2', 'scandal', 'major', false, null, 0, 'Rapid-Growth Accounting Audit Finds Filing Errors', 'Fast fundraising outpaced your volunteer compliance team, leaving messy FEC paperwork that rival trackers quickly publicized.'],
    ['ev_t2_11', 'tier2', 'grassroots', 'standard', true, null, 0, 'Suburban Parent Coalition Rallies Around Your {THEME} Plank', 'Grassroots parent groups in {STATE} suburbs embraced your stance on {THEME} and offered to host neighborhood registration nights.'],
    ['ev_t2_12', 'tier2', 'scandal', 'major', false, null, 0, 'Rival Opposition Researchers Dig Up Nominee\'s Old Blog Posts', 'A decade-old hot take from your nominee\'s private blog surfaced in {STATE} local press just as swing voters tuned in.'],
    ['ev_t2_13', 'tier2', 'economic', 'major', false, null, 0, 'Regional Tech & Small-Business Founders Host Fundraiser', 'Independent entrepreneurs in {REGION} organized a high-energy reception ready to back your ground game.'],
    ['ev_t2_14', 'tier2', 'coalition', 'major', true, null, 0, 'Local Mayor Switches Registration to Your Party in {STATE}', 'A popular small-city mayor in {STATE} left {RIVAL_PARTY} on live TV to join your coalition, inspiring local voters to re-register.'],
    ['ev_t2_15', 'tier2', 'media_viral', 'standard', false, null, 0, 'Cable News Panel Mocks Your Polling Ceiling', 'Beltway pundits laughed off your {REGION} momentum on Sunday morning television, firing up your online base.'],
    ['ev_t2_16', 'tier2', 'grassroots', 'standard', true, null, 0, 'Weekend Canvass Blitz Breaks State Chapter Record', 'Chapters across {STATE} logged their highest door-knocking weekend ever, converting undecided renters and commuters.'],
    ['ev_t2_17', 'tier2', 'coalition', 'major', false, null, 0, 'Fusion Cross-Endorsement Feelers from Vulnerable Incumbent', 'A nervous moderate incumbent in {STATE} quietly asked whether your party would cross-endorse them in exchange for platform votes.'],
    ['ev_t2_18', 'tier2', 'media_viral', 'standard', false, null, 0, '{STATE} Polling Firm Finally Includes Your Ticket in Top-Line', 'For the first time this cycle, a gold-standard pollster in {STATE} listed your nominee on the main ballot prompt instead of "Other."'],
    ['ev_t2_19', 'tier2', 'grassroots', 'standard', true, null, 0, 'Youth & First-Time Voter Festival Booths Overflow in {STATE}', 'Music-festival and campus registration booths in {STATE} ran out of clipboards as first-time voters lined up to hear your pitch.'],
    ['ev_t2_20', 'tier2', 'coalition', 'standard', false, null, 0, 'State Party Chair Feuds with National Committee Over Messaging', 'Your {STATE} chair publicly complained that national talking points on {THEME} don\'t fit local swing districts.'],
    ['ev_t2_21', 'tier2', 'economic', 'standard', false, null, 0, 'Regional Energy/Cost-of-Living Forum Hands You the Mic', 'With household budgets squeezed in {REGION}, a televised civic forum gave your party equal billing on pocketbook solutions.'],
    ['ev_t2_22', 'tier2', 'grassroots', 'standard', true, null, 0, 'Rural Broadband & Civic Access Registration Drive', 'Partnering with local co-ops in {STATE}, your organizers registered rural voters frustrated with both establishment parties.'],
    ['ev_t2_23', 'tier2', 'scandal', 'major', false, null, 0, 'Controversial Donor Pledge Tests Party Ethics Charter', 'A wealthy polarizing figure offered a $3M check that could transform your {STATE} map—at the cost of infuriating {FACTION}.'],
    ['ev_t2_24', 'tier2', 'debate_trail', 'major', false, null, 0, 'Rival Super PAC Buys First Negative Ad Against Your Party', 'Being attacked on TV by a {RIVAL_PARTY} Super PAC proves they take your {STATE} rise seriously—but the spot stings with moderates.'],
    ['ev_t2_25', 'tier2', 'grassroots', 'standard', true, null, 0, 'Independent Voter League Co-Hosts Registration Night in {STATE}', 'Nonaligned voter clubs in {STATE} opened their halls for a joint registration and ballot-education evening.'],
    ['ev_t2_26', 'tier2', 'media_viral', 'standard', false, null, 0, 'Statehouse Slate Nominee Delivers Viral Floor Speech', 'A sharp 2-minute rebuttal by one of your state legislative candidates in {STATE} racked up millions of shares.'],
    ['ev_t2_27', 'tier2', 'ballot_legal', 'standard', false, null, 0, 'Ballot-Position Lawsuit Over "Top-of-Ticket" Column Order', 'Election officials in {STATE} relegated your slate to the bottom corner of the ballot; your lawyers see a winnable equal-protection suit.'],
    ['ev_t2_28', 'tier2', 'media_viral', 'standard', false, null, 0, 'Regional Newspaper Syndicate Runs Profile on Your Chairmanship', 'A Sunday feature across {REGION} examined whether your party is building a lasting regional machine.'],
    ['ev_t2_29', 'tier2', 'debate_trail', 'critical', false, 'arc_debate_gate', 3, 'National Debate Exclusion Fuels Protest March Outside Venue', 'Thousands rallied outside the debate hall in {STATE}, forcing network anchors to cover your campaign during the pre-show.'],
    ['ev_t2_30', 'tier2', 'economic', 'major', false, null, 0, '{STATE} Duopoly Dissatisfaction Hits Record High', 'New polling in {STATE} shows 68% of voters want a viable alternative to both legacy parties heading into the final stretch.'],

    // === 6.3 TIER 3 CORE POOL (30 events | 10 [REG]) ===
    ['ev_t3_01', 'tier3', 'debate_trail', 'critical', true, null, 0, 'National Poll Crosses 15% Debate Stage Threshold', 'A headline national poll put your party above 15% for the first time, shattering the two-party glass ceiling and triggering registration spikes.'],
    ['ev_t3_02', 'tier3', 'coalition', 'major', false, null, 0, 'Sitting U.S. Representative Explores Caucus Switch', 'A disgruntled House member from {STATE} signaled openness to caucusing with your party if you back their re-election bid.'],
    ['ev_t3_03', 'tier3', 'debate_trail', 'critical', false, null, 0, 'Both Major Parties Coordinate Attack Ads Against Your Surge', 'Alarmed by your rise in {REGION}, both establishment committees simultaneously launched "untested and risky" ad flights.'],
    ['ev_t3_04', 'tier3', 'grassroots', 'major', true, null, 0, 'Tri-State Grassroots Voter Registration Push in {REGION}', 'Flush with momentum, your regional directors launched a synchronized tri-state voter registration blitz across {REGION}.'],
    ['ev_t3_05', 'tier3', 'economic', 'standard', false, null, 0, 'Wall Street & Policy Think-Tanks Request Economic White Paper', 'Institutional analysts are finally modeling what your {THEME} platform would do to federal markets and state budgets.'],
    ['ev_t3_06', 'tier3', 'debate_trail', 'major', true, null, 0, '{STATE} Governor\'s Race Turns Into a True Three-Way Toss-Up', 'A stunning {STATE} poll shows a three-way dead heat for Governor, pulling national media and fresh voter sign-ups into the state.'],
    ['ev_t3_07', 'tier3', 'scandal', 'critical', false, 'arc_superpac_rogue', 1, 'Allied Super PAC Airs Unauthorized Hard-Edge Attack Spot', 'An independent PAC backing your movement aired a blistering personal attack in {STATE} without your committee\'s approval.'],
    ['ev_t3_08', 'tier3', 'coalition', 'major', false, null, 0, 'National Labor or Trade Association Splits Endorsement', 'A major national guild declined to endorse either legacy party in {STATE}, opening a lane for your coalition.'],
    ['ev_t3_09', 'tier3', 'media_viral', 'major', true, null, 0, 'Primetime Network Town Hall Slot Secured', 'A broadcast network offered your nominee a solo 60-minute primetime town hall focused on {THEME} and {REGION} voters.'],
    ['ev_t3_10', 'tier3', 'coalition', 'major', false, null, 0, '{FACTION} Threatens Revolt Over Big-Tent Moderation', 'Founding activists in {FACTION} warn that courting moderate swing voters in {STATE} is diluting the party\'s soul.'],
    ['ev_t3_11', 'tier3', 'grassroots', 'standard', true, null, 0, 'Early-Voting Mailer Blitz Targets Independent Households', 'Your data team identified 400,000 persuadable unaffiliated households across {REGION} ready for registration and early ballots.'],
    ['ev_t3_12', 'tier3', 'gaffe', 'major', false, null, 0, 'Nominee Stumbles on Foreign-Policy Pop Quiz', 'A cable anchor caught your nominee flat-footed on an overseas treaty question, triggering 48 hours of "readiness" chatter.'],
    ['ev_t3_13', 'tier3', 'media_viral', 'major', false, null, 0, '12th Amendment Deadlock Scenario Dominates Sunday Shows', 'Pundits spent an hour mapping out how your {REGION} electoral votes could deny both legacy parties 270 EVs.'],
    ['ev_t3_14', 'tier3', 'coalition', 'major', false, null, 0, 'Rival Party Offers Quiet Non-Aggression Pact in {STATE}', 'Backchannel envoys from {RIVAL_PARTY} floated standing down in two districts if you soften attacks on their Senate nominee.'],
    ['ev_t3_15', 'tier3', 'grassroots', 'standard', true, null, 0, 'Civic-Tech App Automates Voter Registration at Your Rallies', 'A volunteer-built mobile check-in tool lets every rally attendee in {STATE} verify or switch registration in 45 seconds.'],
    ['ev_t3_16', 'tier3', 'scandal', 'major', false, null, 0, 'High-Profile Surrogate Faces Ethics Inquiry', 'A prominent surrogate campaigning for you in {STATE} was hit with a state ethics inquiry over past consulting contracts.'],
    ['ev_t3_17', 'tier3', 'grassroots', 'standard', true, null, 0, 'Regional Swing-County Registration Surge in {STATE}', 'Bellwether suburban counties in {STATE} reported a sudden spike in party-switch forms favoring your ticket.'],
    ['ev_t3_18', 'tier3', 'media_viral', 'standard', false, null, 0, 'Major Pollster Overhauls Likely-Voter Model After Your Gains', 'Pollsters admitted their traditional two-party turnout screens underestimated your surge across {REGION}.'],
    ['ev_t3_19', 'tier3', 'scandal', 'critical', false, 'arc_superpac_rogue', 2, 'Fact-Check Backlash Forces Network Ad Pull', 'Local TV stations in {STATE} pulled the rogue Super PAC spot after fact-checkers rated its central claim misleading.'],
    ['ev_t3_20', 'tier3', 'coalition', 'standard', false, null, 0, 'Coalition Bargaining Speculation Spooks {FACTION}', 'Leaked talk about post-election legislative kingmaking prompted {FACTION} leaders to demand public red lines.'],
    ['ev_t3_21', 'tier3', 'grassroots', 'major', true, null, 0, 'Working-Class Voter Registration Drive in {REGION}', 'Organizers set up shift-change tables outside manufacturing plants and distribution hubs across {REGION}.'],
    ['ev_t3_22', 'tier3', 'coalition', 'critical', false, 'arc_incumbent_feud', 1, '{INCUMBENT} Breaks Ranks on {THEME} in {STATE}', '{INCUMBENT} publicly distanced themselves from your national talking points on {THEME} to protect their local margin.'],
    ['ev_t3_23', 'tier3', 'media_viral', 'standard', false, null, 0, 'Bipartisan Editorial Board Endorses Your Congressional Slate', 'A major metro editorial board endorsed three of your House candidates as "the credible reform voice Congress needs."'],
    ['ev_t3_24', 'tier3', 'ballot_legal', 'major', true, null, 0, 'Ballot-Initiative Co-Branding Sparks Turnout & Sign-Ups', 'Aligning your {STATE} field operation with a popular statewide ballot initiative opened a massive registration funnel.'],
    ['ev_t3_25', 'tier3', 'scandal', 'major', false, null, 0, 'Rival Chair Leaks Private Coalition-Talks Audio', '{RIVAL_PARTY} leaked a clipped recording of exploratory coalition talks, accusing you of backroom horse-trading.'],
    ['ev_t3_26', 'tier3', 'grassroots', 'standard', true, null, 0, 'Suburban Women & Independents Registration Forum', 'Packed suburban listening sessions in {STATE} converted undecided swing voters into active registered party members.'],
    ['ev_t3_27', 'tier3', 'economic', 'major', false, null, 0, 'Regional Infrastructure Crisis Tests Governing Credibility', 'A bridge and transit shutdown in {REGION} put every party\'s practical governing plan under the microscope.'],
    ['ev_t3_28', 'tier3', 'coalition', 'critical', false, 'arc_superpac_rogue', 3, 'Donor Revolt vs. Hardline Base Consolidation', 'The fallout from the rogue Super PAC saga reached a climax—forcing a final choice between institutional donors and base firebrands.'],
    ['ev_t3_29', 'tier3', 'coalition', 'critical', false, 'arc_incumbent_feud', 2, 'Coattail Negotiation with {INCUMBENT} in {STATE}', 'Behind closed doors, {INCUMBENT}\'s campaign demanded targeted ad money and messaging autonomy before appearing at your rally.'],
    ['ev_t3_30', 'tier3', 'coalition', 'critical', false, 'arc_incumbent_feud', 3, 'Split-Ticket Truce or Primary Revenge Fallout', 'Your handling of the {INCUMBENT} standoff in {STATE} cemented either a disciplined ticket truce or a bitter public rift.'],

    // === 6.4 TIER 4 CORE POOL (30 events | 10 [REG]) ===
    ['ev_t4_01', 'tier4', 'grassroots', 'major', true, null, 0, 'Swing-State Voter Registration War Peaks in {STATE}', 'Both contenders poured field staff into {STATE} ahead of the statutory voter-registration cutoff.'],
    ['ev_t4_02', 'tier4', 'scandal', 'major', false, null, 0, 'Shadow Transition Team Names Leak to Washington Press', 'A premature Cabinet shortlist leaked to Politico, infuriating {FACTION} and letting {RIVAL_PARTY} mock your "presumptuous" tone.'],
    ['ev_t4_03', 'tier4', 'coalition', 'major', false, null, 0, 'National Union & Trade Federation Endorsement Bidding War', 'Two powerhouse national associations are deciding whether to unleash their 50-state mail and ground machines for your ticket.'],
    ['ev_t4_04', 'tier4', 'grassroots', 'major', true, null, 0, 'Battleground Suburban Registration Blitz Across {REGION}', 'High-growth collar counties across {REGION} are up for grabs with thousands of newly arrived unregistered residents.'],
    ['ev_t4_05', 'tier4', 'debate_trail', 'major', false, null, 0, '{RIVAL_NOMINEE} Challenges You to Unmoderated Town Hall', '{RIVAL_NOMINEE} threw down a gauntlet for a live, unscripted 90-minute debate in {STATE} with no moderator guardrails.'],
    ['ev_t4_06', 'tier4', 'economic', 'major', false, null, 0, 'Mega-Donor Bundler Threatens Freeze Over {THEME}', 'Your top Wall Street bundler threatened to pause $8M in late-cycle checks unless you soften your rhetoric on {THEME}.'],
    ['ev_t4_07', 'tier4', 'grassroots', 'major', true, null, 0, 'High-Turnout Early-Vote Registration Surge in {STATE}', 'Same-day registration lines wrapped around early-voting centers in {STATE}, putting ground-game lawyers and canvassers to work.'],
    ['ev_t4_08', 'tier4', 'coalition', 'major', false, null, 0, 'Swing-State Governor Refuses to Appear at National Rally', 'A cautious swing-state executive in {STATE} skipped your flagship rally, fueling "party disunity" headlines.'],
    ['ev_t4_09', 'tier4', 'media_viral', 'standard', false, null, 0, 'Network Fact-Check Spotlight on Rival\'s Economic Math', 'Independent budget analysts shredded {RIVAL_PARTY}\'s centerpiece proposal on primetime TV, handing you a clean opening.'],
    ['ev_t4_10', 'tier4', 'coalition', 'standard', false, null, 0, 'Rural County-Chair Rebellion Over Ad-Buy Allocation', 'County chairs across {REGION} protested that TV spending is ignoring rural radio and local weekly newspapers.'],
    ['ev_t4_11', 'tier4', 'grassroots', 'major', true, null, 0, 'Multilingual Community Registration Campaign in {STATE}', 'Targeted neighborhood outreach in fast-growing metro areas of {STATE} opened a high-yield voter-registration corridor.'],
    ['ev_t4_12', 'tier4', 'debate_trail', 'major', false, null, 0, 'Opposing Super PAC Saturates {STATE} Media Markets', 'An opposing Super PAC bought out local broadcast inventory across {STATE}, spiking airwaves saturation for everyone.'],
    ['ev_t4_13', 'tier4', 'media_viral', 'major', false, null, 0, 'Former Cabinet Secretary Endorses Your Ticket', 'A prominent bipartisan former Cabinet officer crossed over to endorse your nominee on national television.'],
    ['ev_t4_14', 'tier4', 'grassroots', 'standard', true, null, 0, 'Young-Voter Concert & Registration Tour Hits {REGION}', 'Chart-topping artists joined your campus tour across {REGION}, pairing headline sets with live voter-registration kiosks.'],
    ['ev_t4_15', 'tier4', 'scandal', 'major', false, null, 0, 'Leaked Internal Polling Memo Sparks Media Panic', 'A pessimistic internal memo from {STATE} leaked to reporters, rattling donors and emboldening {RIVAL_PARTY}.'],
    ['ev_t4_16', 'tier4', 'coalition', 'major', false, null, 0, 'Congressional Leadership Clashes with Presidential Campaign', 'Hill committee chairs want emergency House defense funds while the presidential war room insists on holding {STATE}.'],
    ['ev_t4_17', 'tier4', 'grassroots', 'standard', true, null, 0, 'Veteran & First-Responder Registration Push in {STATE}', 'Civic-service chapters across {STATE} organized a high-trust voter registration and absentee-ballot drive.'],
    ['ev_t4_18', 'tier4', 'economic', 'critical', false, null, 0, 'Surprise Federal Reserve Rate Signal Reshapes {THEME}', 'An unexpected Fed policy signal moved mortgage rates overnight, putting economic competence front and center.'],
    ['ev_t4_19', 'tier4', 'media_viral', 'standard', false, null, 0, 'Rival Campaign Suffers High-Profile Staff Resignation', '{RIVAL_PARTY}\'s communications director quit amid internal infighting, giving you a 72-hour news-cycle window.'],
    ['ev_t4_20', 'tier4', 'grassroots', 'standard', true, null, 0, 'Faith & Civic Network Voter Registration Weekend', 'Community congregations and neighborhood associations across {STATE} launched a nonpartisan registration weekend.'],
    ['ev_t4_21', 'tier4', 'coalition', 'major', false, null, 0, 'Downballot Senate Incumbents Demand Emergency Ad Rescue', 'Three endangered Senate nominees warned that losing their seats will cost the chamber unless you wire reserve cash now.'],
    ['ev_t4_22', 'tier4', 'gaffe', 'major', false, null, 0, 'Viral Hot-Mic Moment at {STATE} Press Gaggle', 'An unguarded remark caught on a boom mic in {STATE} drew 15M views before your press shop could issue a clarification.'],
    ['ev_t4_23', 'tier4', 'grassroots', 'major', true, null, 0, 'Union-Hall & Plant-Gate Voter Registration Push', 'Local organizers teamed up with blue-collar shift stewards in {REGION} to register thousands of hourly workers.'],
    ['ev_t4_24', 'tier4', 'economic', 'major', false, null, 0, 'Regional Supply-Chain Disruption Hits {REGION} Headlines', 'Port and rail bottlenecks drove up grocery and fuel prices across {REGION}, testing every party\'s crisis response.'],
    ['ev_t4_25', 'tier4', 'scandal', 'major', false, null, 0, 'Rival Oppo Dossier Drops on Senior Surrogate', '{RIVAL_PARTY} released a glossy opposition binder targeting your most visible surrogate in {STATE}.'],
    ['ev_t4_26', 'tier4', 'ballot_legal', 'major', true, null, 0, 'Statewide Ballot-Initiative Registration Synergy in {STATE}', 'A high-salience ballot initiative in {STATE} is pulling infrequent voters to register—if your field teams capture them first.'],
    ['ev_t4_27', 'tier4', 'foreign_shock', 'major', false, null, 0, 'Bipartisan Foreign-Policy Elders Issue Warning Letter', 'Forty former ambassadors published a joint letter questioning global stability under the next administration.'],
    ['ev_t4_28', 'tier4', 'grassroots', 'standard', true, null, 0, 'Senior-Citizen & Retiree Registration Drive in {STATE}', 'Targeted community-center clinics across {STATE} helped newly relocated retirees update their registration and mail ballots.'],
    ['ev_t4_29', 'tier4', 'media_viral', 'standard', false, null, 0, 'National Convention Bounce Fades Faster Than Modeled', 'Post-convention tracking shows your initial bump cooling in {REGION}, requiring a fresh narrative jolt.'],
    ['ev_t4_30', 'tier4', 'debate_trail', 'major', false, null, 0, 'Late-Cycle Third-Party Surge Threatens {STATE} Margin', 'A surging minor-party nominee is pulling 5% in {STATE} polls, disproportionately siphoning your softest {FACTION} voters.'],

    // === 6.5 TIER 5 EXCLUSIVE POOL (18 events | 2 [REG]) ===
    ['ev_t5_01', 'tier5', 'scandal', 'critical', false, null, 0, 'Cabinet Resignation Rumors Shake Incumbent Credibility', 'West Wing leaks about an imminent Cabinet resignation forced your party onto defense across every morning show.'],
    ['ev_t5_02', 'tier5', 'gaffe', 'major', false, null, 0, 'White House Rose Garden Signing Backfires on {THEME}', 'A staged legislative ceremony went sideways when reporters pressed on fine-print carve-outs unpopular in {STATE}.'],
    ['ev_t5_03', 'tier5', 'economic', 'critical', false, null, 0, 'Federal Government Shutdown Standoff Weeks Before Election', 'Capitol Hill brinkmanship pushed federal agencies to the edge of a shutdown just as independent voters lock in their choices.'],
    ['ev_t5_04', 'tier5', 'ballot_legal', 'critical', false, null, 0, 'Supreme Court Emergency Shadow-Docket Ruling Polarizes Base', 'A surprise late-night Supreme Court order electrified {FACTION} while triggering backlash in suburban swing districts.'],
    ['ev_t5_05', 'tier5', 'coalition', 'major', false, null, 0, 'Trifecta Fatigue: Independent Voters Demand Divided Check', 'Focus groups in {STATE} show swing voters warming to split-ticket voting as a check on one-party Washington power.'],
    ['ev_t5_06', 'tier5', 'scandal', 'major', false, null, 0, 'Billion-Dollar Super PAC Coordination Complaint Filed', 'Watchdog groups filed a high-profile FEC complaint alleging illegal ad coordination between your committee and allied PACs.'],
    ['ev_t5_07', 'tier5', 'coalition', 'major', false, null, 0, 'Speaker & Senate Leader Publicly Undercut Chair Strategy', 'Congressional leaders told reporters they disagree with your battleground triage in {REGION}, exposing top-level friction.'],
    ['ev_t5_08', 'tier5', 'economic', 'major', false, null, 0, 'National Infrastructure Ribbon-Cutting Blitz in {REGION}', 'Major federal projects opened ahead of schedule across {REGION}, giving your incumbents a high-visibility jobs backdrop.'],
    ['ev_t5_09', 'tier5', 'foreign_shock', 'critical', false, null, 0, 'Foreign Trade Retaliation Tariffs Hit {STATE} Exports', 'Abrupt retaliatory tariffs from overseas trading partners slammed agricultural and industrial exporters in {STATE}.'],
    ['ev_t5_10', 'tier5', 'grassroots', 'major', true, null, 0, 'Historic 50-State Voter Registration Machine Mobilizes', 'Your national data warehouse unlocked a synchronized voter-registration and chase operation across battleground counties.'],
    ['ev_t5_11', 'tier5', 'debate_trail', 'major', false, null, 0, 'Incumbent Approval Rating Diverges Sharply from Downballot', 'Ticket-splitting is surging in {STATE}, forcing a choice between defending the top of the ticket or insulating Congress.'],
    ['ev_t5_12', 'tier5', 'economic', 'major', false, null, 0, 'Wall Street Donor Strike Over Tax/Regulatory Plank', 'Major institutional donors froze Q3 transfers to protest a populist amendment championed by {FACTION}.'],
    ['ev_t5_13', 'tier5', 'media_viral', 'major', false, null, 0, 'Former President Delivers Barnburner Rally in {STATE}', 'A beloved former President stepped back onto the trail in {STATE}, electrifying volunteers and dominating evening broadcasts.'],
    ['ev_t5_14', 'tier5', 'foreign_shock', 'critical', false, null, 0, 'National Security Leak Triggers Emergency Briefing', 'Classified intelligence memos appeared in the morning papers, turning national security into the cycle\'s defining test.'],
    ['ev_t5_15', 'tier5', 'coalition', 'major', false, null, 0, 'Swing-District House Freshmen Demand Distance from Top Ticket', 'A bloc of 18 frontline House members requested permission to run localized ads breaking with the national {THEME} line.'],
    ['ev_t5_16', 'tier5', 'grassroots', 'major', true, null, 0, 'Battleground Turnout & Registration Warchest Unlock', 'Allied civic groups matched your committee\'s late field push, funding full-time registrars across {STATE}.'],
    ['ev_t5_17', 'tier5', 'debate_trail', 'major', false, null, 0, 'Major Network Anchor Presses Nominee on Unkept Promise', 'A viral primetime interview clip contrasted your party\'s prior-cycle pledge on {THEME} with current legislative results.'],
    ['ev_t5_18', 'tier5', 'economic', 'critical', false, null, 0, 'Late-Breaking Jobs & CPI Print Dominates Final 10 Days', 'The final pre-election Bureau of Labor Statistics report landed like a thunderbolt across every battleground newsroom.'],

    // === 6.6 UNIVERSAL MULTI-TIER & STORY-ARC POOL (18 events | 6 [REG] = 33.3% | Eligible Tiers 1-5) ===
    ['ev_u_01', 'universal', 'scandal', 'critical', false, 'arc_whistleblower', 1, 'Internal Donor Memo Leaks to Investigative Desk', 'An anonymous staffer leaked a blunt internal strategy memo mocking swing-voter priorities in {STATE}. How you handle the next 24 hours will echo for months.'],
    ['ev_u_02', 'universal', 'scandal', 'critical', false, 'arc_whistleblower', 2, 'Whistleblower Fallout: Media Feeding Frenzy vs. Transparency Halo', 'The leaked-memo story hit its second wave across {REGION} newsrooms, directly shaped by how you responded last month.'],
    ['ev_u_03', 'universal', 'debate_trail', 'critical', false, 'arc_whistleblower', 3, 'Debate Stage Ambush: Moderator Reopens Leaked Memo', 'With millions watching, the moderator read verbatim lines from your leaked donor memo and demanded a direct answer.'],
    ['ev_u_04', 'universal', 'media_viral', 'major', true, 'arc_grassroots_wave', 1, 'Breakout Town Hall Moment in {STATE}', 'A passionate, unscripted exchange on {THEME} in {STATE} ignited grassroots energy and sent thousands searching for your party.'],
    ['ev_u_05', 'universal', 'grassroots', 'major', true, 'arc_grassroots_wave', 2, 'Regional Volunteer Stampede Across {REGION}', 'Building on your {STATE} town hall wave, volunteer sign-ups doubled across neighboring states in {REGION}.'],
    ['ev_u_06', 'universal', 'grassroots', 'critical', true, 'arc_grassroots_wave', 3, 'Election-Week Same-Day Registration & Turnout Surge in {STATE}', 'Your multi-month grassroots wave culminated in packed early-vote and same-day registration lines across {STATE}.'],
    ['ev_u_07', 'universal', 'coalition', 'critical', false, 'arc_coalition_rift', 1, 'Restless {FACTION} Publishes Open Manifesto', 'Leaders of {FACTION} published a sharp manifesto warning that ignoring their demands on {THEME} will fracture base turnout.'],
    ['ev_u_08', 'universal', 'coalition', 'critical', false, 'arc_coalition_rift', 2, 'Emergency Trail Coalition Summit with {FACTION}', 'You convened an urgent hotel-ballroom summit in {STATE} with {FACTION} delegates to hammer out a unity deal before October.'],
    ['ev_u_09', 'universal', 'coalition', 'critical', false, 'arc_coalition_rift', 3, 'October Unity Rally or Floor Boycott Showdown', 'The coalition rift reached its final verdict: either a triumphant unity rally in {STATE} or a costly activist boycott.'],
    ['ev_u_10', 'universal', 'economic', 'major', false, 'arc_economic_jolt', 1, 'Sudden Regional Plant Closure Shakes {REGION}', 'A flagship employer in {REGION} announced 4,500 layoffs, jolting voters and putting {THEME} under an intense spotlight.'],
    ['ev_u_11', 'universal', 'economic', 'major', false, 'arc_economic_jolt', 2, 'Emergency Relief Package Showdown Over {REGION} Jobs', 'Lawmakers traded fire over an emergency worker-relief package for {REGION} while families waited for real answers.'],
    ['ev_u_12', 'universal', 'economic', 'critical', false, 'arc_economic_jolt', 3, 'Pocketbook Closing Argument Tests {THEME}', 'In the final stretch, voters across {REGION} judged which party actually showed up after the plant closure.'],
    ['ev_u_13', 'universal', 'foreign_shock', 'critical', false, 'arc_foreign_flashpoint', 1, 'Overseas Diplomatic Flashpoint Dominates Cable News', 'An abrupt maritime and diplomatic crisis overseas knocked domestic ads off the airwaves overnight.'],
    ['ev_u_14', 'universal', 'foreign_shock', 'major', false, 'arc_foreign_flashpoint', 2, 'Bipartisan Security Briefing vs. Partisan Critique', 'With tensions simmering abroad, voters watched whether your party projected steady leadership or partisan point-scoring.'],
    ['ev_u_15', 'universal', 'foreign_shock', 'critical', false, 'arc_foreign_flashpoint', 3, 'Commander-in-Chief Closing Test', 'Foreign-policy anxiety lingered into the closing weeks, amplifying the stakes of every national security message.'],
    ['ev_u_16', 'universal', 'grassroots', 'major', true, 'arc_voter_surge', 1, 'Campus & Working-Class Registration Drive Ignites in {STATE}', 'A coalition of student groups and local civic clubs sparked an unexpected voter-registration wave in {STATE}.'],
    ['ev_u_17', 'universal', 'ballot_legal', 'major', true, 'arc_voter_surge', 2, 'Secretary of State Registration Backlog Threatens New Voters', 'County clerks in {STATE} fell weeks behind processing new registration cards—putting your newly signed voters at risk.'],
    ['ev_u_18', 'universal', 'grassroots', 'critical', true, 'arc_voter_surge', 3, 'Record Early-Vote & Registration Surge in {REGION}', 'Cleared registration rolls unleashed a massive wave of first-time and newly switched voters across {REGION}.'],

    // === 6.7 ULTRA-RARE ALL-TIER GENERATIONAL WINDFALL ("JACKPOT") (1 event | Eligible Tiers 0-5) ===
    [
      JACKPOT_ID, 'jackpot', 'historic', 'historic', true, null, 0,
      'The Midnight Broadcast: A Generational Political Awakening',
      'An unscripted 4-minute exchange from your {STATE} town hall—captured on a volunteer\'s phone and amplified overnight by podcasters, local radio hosts, and grassroots organizers—has detonated across the country. County election clerks from coast to coast are reporting overwhelmed online voter-registration portals and lines outside local offices. Political veterans are calling it a lightning-in-a-bottle moment that comes around once in a career.'
    ],
  ];

  /* ------------------------------------------------------------------------
     Bespoke Asymmetric Choice Builder (Improvement #1)
     ------------------------------------------------------------------------ */
  function buildChoicesForEvent(spec, ctx) {
    const [id, tierPool, category, severity, hasVoterRegOption, arcId, arcBeat] = spec;
    const isHighTier = ['tier4', 'tier5'].includes(tierPool);
    const bigCost = isHighTier ? 4.0 : (tierPool === 'tier3' ? 2.5 : 1.5);
    const medCost = isHighTier ? 2.0 : 1.0;

    // Special All-Tier Generational Windfall Event (+10,000 voters x 10 states)
    if (id === JACKPOT_ID) {
      return [
        {
          id: 'jackpot_ride_lightning',
          label: 'Ride the Lightning Nationwide',
          cost: 0,
          actionCost: 0,
          isJackpot: true,
          trustDelta: { supporters: 3, independents: 4, opponents: 1 },
          saturationDelta: -15,
          stakes: ['+10,000 Voters in 10 States (+100k)', '+4 Ind Trust', '-15 Saturation (10 States)'],
          summary: 'Lock in the historic 100,000-voter surge nationwide and clear airwaves clutter across all 10 surging states.',
        },
        {
          id: 'jackpot_warchest',
          label: 'Convert Moment into a Grassroots War Chest',
          cost: 0,
          actionCost: 0,
          isJackpot: true,
          treasuryDelta: 6.0,
          factionHappinessDelta: 4,
          stakes: ['+10,000 Voters in 10 States (+100k)', '+$6.0M Small-Dollar Surge', '+4 All Factions Hap'],
          summary: 'Lock in the historic 100,000-voter surge and channel the viral energy into a $6.0M grassroots fundraising explosion.',
        },
        {
          id: 'jackpot_fuel_map',
          label: 'Pour Fuel on the 10-State Map',
          cost: 2.0,
          actionCost: 0,
          isJackpot: true,
          freeFieldOffices: 3,
          jackpotPollBoost: 1.5,
          stakes: ['-$2.0M', '+10,000 Voters in 10 States (+100k)', '+3 Field Offices', '+1.5% in 10 States'],
          summary: 'Lock in the historic 100,000-voter surge and immediately open 3 field offices across the surging states.',
        },
      ];
    }

    // Category-tailored bespoke asymmetric 3-choice sets
    let choices;
    if (category === 'scandal' || category === 'gaffe') {
      choices = [
        {
          id: 'full_transparency',
          label: 'Get Ahead of It with Full Transparency',
          cost: medCost,
          actionCost: 1,
          statePollDelta: -0.4,
          trustDelta: { supporters: -1, independents: 3.5, opponents: 1 },
          factionHappinessDelta: -2,
          arcFlag: 'transparent',
          stakes: [`-$${medCost}M`, '-1 Act', `${ctx.stateId} -0.4%`, '+3.5 Ind Trust', 'Defuses Arc'],
          summary: 'Release the full record immediately, trading a brief dip for durable Independent credibility.',
        },
        {
          id: 'counter_offensive',
          label: `Counter-Attack ${ctx.rivalPartyName} & Burn News Cycle`,
          cost: bigCost,
          actionCost: 1,
          regionalPollDelta: 1.1,
          trustDelta: { supporters: 3, independents: -2, opponents: -1 },
          factionHappinessDelta: 5,
          burnOppoBonus: true,
          arcFlag: 'counterattack',
          stakes: [`-$${bigCost}M`, '-1 Act', `${ctx.region} +1.1%`, `${ctx.factionName} +5 Hap`, '-2 Ind Trust'],
          summary: 'Go on offense against rival hypocrisy; if you hold an Oppo Dossier, unleash it for an extra +1.2% swing.',
        },
        {
          id: 'contain_quietly',
          label: 'Contain Quietly & Shield Downballot Nominees',
          cost: 0,
          actionCost: 0,
          statePollDelta: -1.1,
          trustDelta: { supporters: -1, independents: 0.5, opponents: 0 },
          factionHappinessDelta: -3,
          arcFlag: 'contained_risk',
          stakes: ['$0', `${ctx.stateId} -1.1%`, 'Saves Cash/Actions', 'Escalation Risk'],
          summary: 'Preserve committee cash and actions, accepting a localized hit and risking a tougher media follow-up.',
        },
      ];
    } else if (category === 'coalition') {
      choices = [
        {
          id: 'platform_concession',
          label: `Adopt ${ctx.factionName} Plank on ${ctx.themeLabel}`,
          cost: 0,
          actionCost: 1,
          statePollDelta: 0.6,
          factionHappinessDelta: 9,
          factionFrictionDelta: -18,
          trustDelta: { supporters: 3, independents: -1.5, opponents: 0 },
          arcFlag: 'conceded',
          stakes: ['-1 Act', `${ctx.factionName} +9 Hap / -18 Friction`, `${ctx.stateId} +0.6%`, '-1.5 Ind Trust'],
          summary: 'Cement base loyalty and halt defection friction at the cost of a modest centrist chill.',
        },
        {
          id: 'broker_compromise',
          label: `Broker Trail Compromise & Fund ${ctx.stateId} Field Push`,
          cost: medCost,
          actionCost: 1,
          statePollDelta: 1.2,
          factionHappinessDelta: 4,
          factionFrictionDelta: -8,
          addChapter: true,
          trustDelta: { supporters: 1, independents: 2, opponents: 0 },
          arcFlag: 'compromised',
          stakes: [`-$${medCost}M`, '-1 Act', `${ctx.stateId} +1.2% & +1 Ch`, `${ctx.factionName} +4 Hap`],
          summary: 'Invest committee resources to keep the coalition united while expanding local ground infrastructure.',
        },
        {
          id: 'hold_firm_swing',
          label: 'Hold the Center & Pitch Undecided Independents',
          cost: 0,
          actionCost: 0,
          regionalPollDelta: 1.3,
          factionHappinessDelta: -5,
          factionFrictionDelta: 8,
          trustDelta: { supporters: -2, independents: 3.5, opponents: 1 },
          arcFlag: 'held_firm',
          stakes: ['$0', `${ctx.region} +1.3%`, '+3.5 Ind Trust', `${ctx.factionName} -5 Hap`],
          summary: 'Signal independence from factional pressure to win swing voters across the region.',
        },
      ];
    } else if (category === 'economic' || category === 'foreign_shock') {
      choices = [
        {
          id: 'regional_blitz',
          label: `Launch ${ctx.region} Rapid-Response Ad Blitz`,
          cost: bigCost,
          actionCost: 1,
          regionalPollDelta: 1.8,
          saturationDelta: -20,
          trustDelta: { supporters: 2, independents: 2, opponents: 0 },
          arcFlag: 'aggressive_response',
          stakes: [`-$${bigCost}M`, '-1 Act', `${ctx.region} +1.8%`, '-20 Saturation'],
          summary: 'Seize the news cycle across the entire region with a coordinated message tied to live conditions.',
        },
        {
          id: 'bipartisan_statesman',
          label: 'Take the Steady Statesman Lane on National TV',
          cost: 0,
          actionCost: 1,
          statePollDelta: 1.0,
          trustDelta: { supporters: 0, independents: 4, opponents: 1.5 },
          factionHappinessDelta: -1,
          arcFlag: 'statesman',
          stakes: ['-1 Act', `${ctx.stateId} +1.0%`, '+4 Ind Trust', `${ctx.factionName} -1 Hap`],
          summary: 'Project calm executive readiness to persuade undecided moderates without spending treasury.',
        },
        {
          id: 'populist_fundraise',
          label: `Rally ${ctx.factionName} & Launch Emergency Appeal`,
          cost: 0,
          actionCost: 0,
          treasuryDelta: isHighTier ? 4.5 : 2.5,
          factionHappinessDelta: 5,
          statePollDelta: 0.4,
          trustDelta: { supporters: 2.5, independents: -1, opponents: 0 },
          arcFlag: 'populist',
          stakes: [`+$${isHighTier ? '4.5' : '2.5'}M`, `${ctx.factionName} +5 Hap`, `${ctx.stateId} +0.4%`, '-1 Ind Trust'],
          summary: 'Energize grassroots donors and lock in your base war chest for the closing stretch.',
        },
      ];
    } else if (category === 'ballot_legal') {
      choices = [
        {
          id: 'legal_war_room',
          label: `Deploy Emergency Election-Law Team to ${ctx.stateId}`,
          cost: medCost,
          actionCost: 1,
          statePollDelta: 1.4,
          addChapter: true,
          trustDelta: { supporters: 2.5, independents: 1.5, opponents: 0 },
          arcFlag: 'fought_court',
          stakes: [`-$${medCost}M`, '-1 Act', `${ctx.stateId} +1.4% & +1 Ch`, '+2.5 Sup Trust'],
          summary: 'Bring in top ballot-access litigators to turn legal pushback into an underdog victory.',
        },
        {
          id: 'public_pressure',
          label: 'Take the Fight to Local Press & Civic Watchdogs',
          cost: 0,
          actionCost: 1,
          regionalPollDelta: 1.0,
          saturationDelta: -25,
          trustDelta: { supporters: 2, independents: 2.5, opponents: 0 },
          arcFlag: 'public_pressure',
          stakes: ['-1 Act', `${ctx.region} +1.0%`, '-25 Saturation', '+2.5 Ind Trust'],
          summary: 'Turn establishment obstruction into free earned media across the region.',
        },
        {
          id: 'conserve_pivot',
          label: 'Preserve Treasury & Pivot Organizers to Neighboring States',
          cost: 0,
          actionCost: 0,
          treasuryDelta: 1.5,
          statePollDelta: -0.6,
          regionalPollDelta: 0.7,
          arcFlag: 'pivoted',
          stakes: ['+$1.5M Saved', `${ctx.stateId} -0.6%`, `${ctx.region} +0.7%`],
          summary: 'Avoid a costly legal quagmire and redeploy resources to cleaner nearby targets.',
        },
      ];
    } else {
      // media_viral | grassroots | debate_trail
      choices = [
        {
          id: 'amplify_wave',
          label: `Amplify Momentum Across ${ctx.region}`,
          cost: bigCost,
          actionCost: 1,
          regionalPollDelta: 1.7,
          saturationDelta: -20,
          trustDelta: { supporters: 2, independents: 2, opponents: 0 },
          arcFlag: 'amplified',
          stakes: [`-$${bigCost}M`, '-1 Act', `${ctx.region} +1.7%`, '-20 Saturation'],
          summary: 'Pour paid media behind the headline to turn a single-state moment into a regional wave.',
        },
        {
          id: 'grassroots_fundraise',
          label: 'Convert Spotlight into Small-Dollar Surge & Chapter Growth',
          cost: 0,
          actionCost: 1,
          treasuryDelta: isHighTier ? 4.0 : 2.5,
          addChapter: true,
          factionHappinessDelta: 4,
          stakes: ['-1 Act', `+$${isHighTier ? '4.0' : '2.5'}M`, `${ctx.stateId} +1 Ch`, `${ctx.factionName} +4 Hap`],
          summary: 'Build lasting party infrastructure and cash reserves off the media spike.',
        },
        {
          id: 'elevate_downballot',
          label: `Share Spotlight with ${ctx.incumbentName} & Local Slate`,
          cost: 0,
          actionCost: 0,
          statePollDelta: 1.3,
          trustDelta: { supporters: 2, independents: 2.5, opponents: 0 },
          factionHappinessDelta: 3,
          stakes: ['$0', `${ctx.stateId} +1.3%`, '+2.5 Ind Trust', `${ctx.factionName} +3 Hap`],
          summary: 'Lift downballot turnout and sitting-member morale without touching your budget.',
        },
      ];
    }

    // Exact 1/3 Voter Registration Option Injection (Improvement #4 & Section 4)
    if (hasVoterRegOption) {
      const regYield = tierPool === 'tier1' ? 4000
        : tierPool === 'tier2' ? 5500
          : tierPool === 'tier3' ? 7500
            : tierPool === 'tier4' ? 9500
              : 6500;
      const regCost = ['tier4', 'tier5'].includes(tierPool) ? 1.5 : 0.5;
      choices[2] = {
        id: 'voter_reg_drive',
        label: `Convert Moment into ${ctx.stateId} Voter Registration Drive`,
        cost: regCost,
        actionCost: 0,
        isVoterRegOption: true,
        regBaseVoters: regYield,
        statePollDelta: 0.4,
        trustDelta: { supporters: 1.5, independents: 1.5, opponents: 0 },
        arcFlag: 'reg_drive',
        stakes: [`-$${regCost}M`, `Usually +${regYield.toLocaleString()} ${ctx.stateId} Voters (~78%)`, `${ctx.stateId} +0.4%`, '+1.5 Ind Trust'],
        summary: `Deploy registration teams while voters are tuned in. Usually succeeds (~78% base odds, boosted by local chapters), adding lasting party voters in ${ctx.stateId}.`,
      };
    }

    return choices;
  }

  const EVENT_CATALOG = RAW_EVENT_SPECS.map((spec) => ({
    id: spec[0],
    tierPool: spec[1],
    category: spec[2],
    severity: spec[3],
    hasVoterRegOption: Boolean(spec[4]),
    arcId: spec[5] || null,
    arcBeat: Number(spec[6] || 0),
    titleTemplate: spec[7],
    bodyTemplate: spec[8],
  }));

  const EVENT_BY_ID = new Map(EVENT_CATALOG.map((e) => [e.id, e]));

  /* ------------------------------------------------------------------------
     State Normalization & Save Compaction
     ------------------------------------------------------------------------ */
  function defaultCampaignEventsState() {
    return {
      history: [],
      firedEventIds: [],
      activeArcs: [],
      pendingEvent: null,
      jackpotTriggered: false,
      jackpotYear: null,
      rivalReactions: [],
    };
  }

  function normalizeCampaignEvents(game) {
    if (!game || typeof game !== 'object') return game;
    const base = defaultCampaignEventsState();
    if (!game.campaignEvents || typeof game.campaignEvents !== 'object') {
      game.campaignEvents = base;
    } else {
      game.campaignEvents = {
        ...base,
        ...game.campaignEvents,
        history: Array.isArray(game.campaignEvents.history) ? game.campaignEvents.history.slice(-MAX_HISTORY) : [],
        firedEventIds: Array.isArray(game.campaignEvents.firedEventIds) ? game.campaignEvents.firedEventIds.slice(-120) : [],
        activeArcs: Array.isArray(game.campaignEvents.activeArcs) ? game.campaignEvents.activeArcs : [],
        pendingEvent: game.campaignEvents.pendingEvent || null,
        jackpotTriggered: Boolean(game.campaignEvents.jackpotTriggered),
        jackpotYear: game.campaignEvents.jackpotYear ?? null,
        rivalReactions: Array.isArray(game.campaignEvents.rivalReactions) ? game.campaignEvents.rivalReactions.slice(-10) : [],
      };
    }
    return game;
  }

  function compactCampaignEventsForSave(copy) {
    if (!copy || typeof copy !== 'object' || !copy.campaignEvents) return copy;
    copy.campaignEvents = {
      ...copy.campaignEvents,
      history: (copy.campaignEvents.history || []).slice(-MAX_HISTORY),
      firedEventIds: (copy.campaignEvents.firedEventIds || []).slice(-90),
      rivalReactions: (copy.campaignEvents.rivalReactions || []).slice(-6),
    };
    return copy;
  }

  /* ------------------------------------------------------------------------
     Dynamic Context Token Resolver (Improvement #3 — Zero Legacy Factions)
     ------------------------------------------------------------------------ */
  function buildDynamicContext(game, month, salt = '') {
    const pId = getPlayerPartyId(game);
    const tier = getPlayerTier(game);
    const states = Array.isArray(game?.states) && game.states.length
      ? game.states
      : (global.PartyChairData?.STATES || [{ id: 'PA', name: 'Pennsylvania', lean: 0 }]);

    // Pick closest competitive state (or strongest stronghold for Tier 0-2)
    let chosenState = states[0];
    if (tier <= 2) {
      const preferred = ['NH', 'MT', 'WY', 'AK', 'NV', 'CO', 'VT', 'ME', 'NM', 'ID', 'OR', 'AZ'];
      const avail = states.filter((s) => preferred.includes(s.id));
      const pool = avail.length ? avail : states;
      const idx = Math.floor(seededUnit(`${game?.seed || 1}:${game?.year || 2028}:m${month}:st:${salt}`) * pool.length);
      chosenState = pool[idx] || states[0];
    } else {
      const swing = states.slice().sort((a, b) => Math.abs(Number(a.lean || 0)) - Math.abs(Number(b.lean || 0))).slice(0, 12);
      const idx = Math.floor(seededUnit(`${game?.seed || 1}:${game?.year || 2028}:m${month}:st:${salt}`) * swing.length);
      chosenState = swing[idx] || states[0];
    }
    const stateId = chosenState.id || 'PA';
    const region = STATE_TO_REGION[stateId] || 'Rust Belt';

    // Live faction from game.factions (zero legacy localists/pragmatists/workers/reformers)
    const livePartyFactions = (game?.factions || []).filter((f) => f && f.partyId === pId);
    const sortedFacs = livePartyFactions.slice().sort((a, b) => Number(a.happiness ?? 60) - Number(b.happiness ?? 60));
    const chosenFaction = sortedFacs[0] || (game?.factions || [])[0] || null;
    const factionId = chosenFaction?.id || null;
    const factionName = chosenFaction?.name || 'Base Coalition';

    // Threatened incumbent or top nominee
    const sitting = (game?.sittingMembers || []).filter((m) => m && (m.party === pId || m.caucus === pId));
    const inc = sitting.find((m) => m.state === stateId || m.stateId === stateId) || sitting[0] || null;
    const incumbentName = inc?.name || game?.presidentialTicket?.[pId] || `${PARTY_LABELS[pId] || 'Party'} Nominee`;

    // Leading rival party & nominee
    const rivalPartyId = pId === 'people' ? 'heritage' : (pId === 'heritage' ? 'people' : (game?.governingParty && game.governingParty !== pId ? game.governingParty : 'heritage'));
    const rivalPartyName = PARTY_LABELS[rivalPartyId] || 'Opposition Party';
    const rivalNominee = game?.presidentialTicket?.[rivalPartyId] || `${rivalPartyName} Nominee`;

    // Active Campaign Theme
    const themeId = game?.campaign?.monthlyTheme || 'cost-of-living';
    const issueObj = (global.PartyChairData?.VERSION_021_ISSUES || []).find((i) => i.id === themeId);
    const themeLabel = issueObj?.name || issueObj?.label || String(themeId).replace(/-/g, ' ');
    const eraId = String(game?.partySystems?.currentEraId || 'era_contemporary');

    return {
      playerPartyId: pId,
      tier,
      stateId,
      stateName: chosenState.name || stateId,
      region,
      factionId,
      factionName,
      incumbentName,
      rivalPartyId,
      rivalPartyName,
      rivalNominee,
      themeId,
      themeLabel,
      eraId,
    };
  }

  function applyTokens(str, ctx) {
    return String(str || '')
      .replace(/\{STATE\}/g, ctx.stateId)
      .replace(/\{REGION\}/g, ctx.region)
      .replace(/\{FACTION\}/g, ctx.factionName)
      .replace(/\{INCUMBENT\}/g, ctx.incumbentName)
      .replace(/\{RIVAL_PARTY\}/g, ctx.rivalPartyName)
      .replace(/\{RIVAL_NOMINEE\}/g, ctx.rivalNominee)
      .replace(/\{THEME\}/g, ctx.themeLabel)
      .replace(/\{ERA\}/g, ctx.eraId);
  }

  /* ------------------------------------------------------------------------
     Eligible Pool Query (Exact 1/3 [REG] Invariant for Tiers 1, 2, 3, 4)
     ------------------------------------------------------------------------ */
  function getEligibleEventsForTier(tier) {
    const t = clamp(Number(tier ?? 1), 0, 5);
    const corePool = t <= 1 ? 'tier1' : `tier${t}`;
    return EVENT_CATALOG.filter((e) => e.tierPool === corePool || e.tierPool === 'universal');
  }

  /* ------------------------------------------------------------------------
     Strict 155,000,000 Voter Conservation Transfer Helper
     ------------------------------------------------------------------------ */
  function transferStateVotersConserved(game, stateId, targetPartyId, deltaVoters) {
    const amount = Math.max(0, Math.round(Number(deltaVoters || 0)));
    if (!game?.voterModel?.states || amount <= 0) return 0;
    const st = game.voterModel.states.find((s) => s && (s.stateId === stateId || s.id === stateId));
    if (!st || !st.affiliations) return 0;

    const is1to1 = game.voterModel.voterScale === '1:1' || Number(st.representedVoters || 0) >= 100000 && Number(st.sampleVoters || 0) >= 100000;
    const unitDelta = is1to1 ? amount : Math.max(1, Math.round(amount / 100));

    let remaining = unitDelta;
    const donorOrder = ['independent', 'other', 'people', 'heritage', 'liberty', 'green', 'constitution', 'socialist']
      .filter((k) => k !== targetPartyId && Number(st.affiliations[k] || 0) > 0);

    donorOrder.forEach((donorKey) => {
      if (remaining <= 0) return;
      const avail = Math.max(0, Number(st.affiliations[donorKey] || 0) - (is1to1 ? 500 : 5));
      const take = Math.min(avail, remaining);
      if (take > 0) {
        st.affiliations[donorKey] = Number(st.affiliations[donorKey] || 0) - take;
        remaining -= take;
      }
    });

    const transferredUnits = unitDelta - remaining;
    if (transferredUnits > 0) {
      st.affiliations[targetPartyId] = Number(st.affiliations[targetPartyId] || 0) + transferredUnits;
      // Keep top-level voterModel.affiliations summary in sync if present
      if (game.voterModel.affiliations?.[targetPartyId]) {
        const mult = is1to1 ? 1 : 100;
        game.voterModel.affiliations[targetPartyId].sampleVoters = Number(game.voterModel.affiliations[targetPartyId].sampleVoters || 0) + transferredUnits;
        game.voterModel.affiliations[targetPartyId].representedVoters = Number(game.voterModel.affiliations[targetPartyId].representedVoters || 0) + (transferredUnits * mult);
      }
    }
    return is1to1 ? transferredUnits : transferredUnits * 100;
  }

  function selectTenSeededStates(game, month) {
    const states = (game?.voterModel?.states || []).filter((s) => s && (s.stateId || s.id) !== 'DC');
    const pool = states.length >= 10
      ? states.map((s) => s.stateId || s.id)
      : Object.keys(STATE_TO_REGION);
    const ranked = pool.map((stId) => ({
      stId,
      score: seededUnit(`${game?.seed || 1}:${game?.year || 2028}:m${month}:jackpot_st:${stId}`),
    })).sort((a, b) => b.score - a.score);
    return ranked.slice(0, JACKPOT_STATES_COUNT).map((r) => r.stId);
  }

  /* ------------------------------------------------------------------------
     Monthly Event Roll (with Arcs, Shocks, & Ultra-Rare Generational Windfall)
     ------------------------------------------------------------------------ */
  function instantiateEvent(game, eventDef, month, options = {}) {
    const spec = RAW_EVENT_SPECS.find((s) => s[0] === eventDef.id);
    const ctx = options.ctx || buildDynamicContext(game, month, eventDef.id);
    const choices = buildChoicesForEvent(spec, ctx);
    const jackpotStates = eventDef.id === JACKPOT_ID ? selectTenSeededStates(game, month) : null;

    let body = applyTokens(eventDef.bodyTemplate, ctx);
    if (options.arcContext) {
      const prevFlag = options.arcContext.flags?.[options.arcContext.flags.length - 1];
      if (prevFlag === 'contained_risk') {
        body += ' Because you tried to contain the story quietly earlier, reporters are pushing twice as hard.';
      } else if (prevFlag === 'transparent') {
        body += ' Your earlier transparency earned goodwill with editors and moderated the backlash.';
      } else if (prevFlag === 'amplified') {
        body += ` Your earlier ${ctx.region} amplification has doubled volunteer turnout heading into this beat.`;
      }
    }

    return {
      id: eventDef.id,
      title: applyTokens(eventDef.titleTemplate, ctx),
      body,
      tierPool: eventDef.tierPool,
      category: eventDef.category,
      severity: eventDef.severity,
      hasVoterRegOption: eventDef.hasVoterRegOption,
      arcId: eventDef.arcId,
      arcBeat: eventDef.arcBeat,
      month,
      year: Number(game?.year || 2028),
      context: ctx,
      jackpotStates,
      choices,
      resolved: false,
      outcome: null,
    };
  }

  function rollMonthlyCampaignEvent(game, month, options = {}) {
    if (!game) return game;
    normalizeCampaignEvents(game);
    const ce = game.campaignEvents;
    const m = clamp(Number(month || game.campaign?.month || game.campaign?.week || 1), 1, 5);
    const year = Number(game.year || 2028);

    // 1. Check ultra-rare All-Tier Generational Windfall ("Jackpot") — 1.8% per month, once per 15 cycles
    const cooldownOk = !ce.jackpotTriggered || (ce.jackpotYear != null && (year - ce.jackpotYear) >= 30);
    const jackpotRoll = seededUnit(`${game.seed || 1}:${year}:m${m}:historic_windfall`);
    if (options.forceJackpot || (cooldownOk && jackpotRoll < JACKPOT_MONTHLY_ODDS)) {
      const jpDef = EVENT_BY_ID.get(JACKPOT_ID);
      const pending = instantiateEvent(game, jpDef, m);
      ce.pendingEvent = pending;
      ce.jackpotTriggered = true;
      ce.jackpotYear = year;
      return game;
    }

    // 2. Check active multi-month Story Arcs due this month
    const dueArc = (ce.activeArcs || []).find((a) => a && !a.completed && Number(a.nextMonth) <= m);
    if (dueArc) {
      const nextBeat = Number(dueArc.currentBeat || 1) + 1;
      const beatDef = EVENT_CATALOG.find((e) => e.arcId === dueArc.arcId && e.arcBeat === nextBeat);
      if (beatDef) {
        const ctx = { ...buildDynamicContext(game, m, beatDef.id), stateId: dueArc.stateId || 'PA', region: STATE_TO_REGION[dueArc.stateId] || 'Rust Belt' };
        if (dueArc.factionId) {
          const liveF = (game.factions || []).find((f) => f.id === dueArc.factionId);
          if (liveF) { ctx.factionId = liveF.id; ctx.factionName = liveF.name; }
        }
        ce.pendingEvent = instantiateEvent(game, beatDef, m, { ctx, arcContext: dueArc });
        return game;
      }
    }

    // 3. Roll from tier-eligible pool (excluding Beat 2/3 arc follow-ups and recent cooldown IDs)
    const tier = getPlayerTier(game);
    const eligible = getEligibleEventsForTier(tier).filter((e) => e.arcBeat <= 1);
    const recentSet = new Set((ce.firedEventIds || []).slice(-(EVENT_COOLDOWN_CYCLES * 5)));
    let pool = eligible.filter((e) => !recentSet.has(e.id));
    if (!pool.length) pool = eligible;

    // Cross-system weighting: active shocks boost economic/foreign_shock events 3x; active ballot initiatives boost ballot_legal 2x
    const activeShocks = game.mediaShocks?.activeShocks || game.activeShocks || [];
    const hasShock = Array.isArray(activeShocks) && activeShocks.length > 0;
    const hasBallotInit = Boolean(game.redistrictingBallot?.activeInitiatives?.length || Object.keys(game.campaign?.ballotMeasures || {}).length);

    const weighted = [];
    pool.forEach((ev) => {
      let weight = 1;
      if (hasShock && (ev.category === 'economic' || ev.category === 'foreign_shock')) weight = 3;
      if (hasBallotInit && ev.category === 'ballot_legal') weight = 2;
      if (m >= 4 && ev.severity === 'critical') weight += 1;
      for (let i = 0; i < weight; i += 1) weighted.push(ev);
    });

    const pickIdx = Math.floor(seededUnit(`${game.seed || 1}:${year}:m${m}:ev:pick`) * weighted.length);
    const chosen = weighted[pickIdx] || pool[0];
    ce.pendingEvent = instantiateEvent(game, chosen, m);
    return game;
  }

  /* ------------------------------------------------------------------------
     Resolve Campaign Event (Trust, Regional Swings, [REG] 78% Roll, Jackpot, Rival Counter)
     ------------------------------------------------------------------------ */
  function resolveCampaignEvent(game, choiceIdOrIndex) {
    if (!game) return game;
    normalizeCampaignEvents(game);
    const ce = game.campaignEvents;
    const ev = ce.pendingEvent;
    if (!ev || ev.resolved) return game;

    const choice = typeof choiceIdOrIndex === 'number'
      ? (ev.choices[choiceIdOrIndex] || ev.choices[0])
      : (ev.choices.find((c) => c.id === choiceIdOrIndex) || ev.choices[0]);
    if (!choice) return game;

    const cost = Number(choice.cost || 0);
    if (cost > 0 && Number(game.treasury || 0) < cost) {
      game.lastNote = `Insufficient funds ($${cost}M required) for "${choice.label}".`;
      return game;
    }

    const pId = getPlayerPartyId(game);
    const ctx = ev.context || buildDynamicContext(game, ev.month, ev.id);
    const outcomeNotes = [];
    let outcomeTag = 'resolved';

    // 1. Treasury & Action Cost
    const netCash = round2((choice.treasuryDelta || 0) - cost);
    if (netCash !== 0) {
      game.treasury = Math.max(0, round2(Number(game.treasury || 0) + netCash));
      outcomeNotes.push(`${netCash > 0 ? '+' : ''}$${netCash}M treasury`);
    }
    if (choice.actionCost && game.campaign) {
      const curActs = Number(game.campaign.monthlyActionsLeft ?? game.campaign.weeklyActionsLeft ?? 8);
      game.campaign.monthlyActionsLeft = Math.max(0, curActs - choice.actionCost);
      game.campaign.weeklyActionsLeft = game.campaign.monthlyActionsLeft;
    }

    // 2. Lift 0.1x Trust Dampener -> Severity-Scaled Trust
    const trustScale = ev.severity === 'historic' ? 1.0 : (ev.severity === 'critical' ? 0.85 : (ev.severity === 'major' ? 0.65 : 0.45));
    if (choice.trustDelta) {
      if (!game.trust) game.trust = { supporters: 65, independents: 35, opponents: 12 };
      ['supporters', 'independents', 'opponents'].forEach((k) => {
        if (choice.trustDelta[k]) {
          game.trust[k] = clamp(round1(Number(game.trust[k] ?? 35) + choice.trustDelta[k] * trustScale), 0, 100);
        }
      });
      if (game.player) game.player.trust = { ...game.trust };
    }

    // 3. Poll Swings (Single State, Region, or Jackpot 10-State)
    if (!game.campaign) game.campaign = { active: true, month: ev.month || 1, week: ev.month || 1 };
    if (!game.campaign.eventStatePolls) game.campaign.eventStatePolls = {};
    const addPoll = (stId, delta) => {
      game.campaign.eventStatePolls[stId] = round2((game.campaign.eventStatePolls[stId] || 0) + delta);
    };

    if (choice.statePollDelta) {
      addPoll(ctx.stateId, choice.statePollDelta);
      outcomeNotes.push(`${ctx.stateId} ${choice.statePollDelta > 0 ? '+' : ''}${choice.statePollDelta}%`);
    }
    if (choice.regionalPollDelta) {
      const regStates = (REGION_STATES[ctx.region] || [ctx.stateId]).slice(0, 4);
      regStates.forEach((stId) => addPoll(stId, choice.regionalPollDelta));
      outcomeNotes.push(`${regStates.join('/')} +${choice.regionalPollDelta}%`);
    }
    if (choice.burnOppoBonus && Array.isArray(game.campaign.oppoDossiers) && game.campaign.oppoDossiers.length > 0) {
      game.campaign.oppoDossiers = game.campaign.oppoDossiers.slice(1);
      addPoll(ctx.stateId, 1.2);
      outcomeNotes.push(`Burned Oppo Dossier (+1.2% ${ctx.stateId})`);
    }

    // 4. Airwaves Saturation Relief
    if (choice.saturationDelta) {
      if (!game.campaign.stateSaturation) game.campaign.stateSaturation = {};
      const targets = choice.isJackpot && Array.isArray(ev.jackpotStates) ? ev.jackpotStates : [ctx.stateId];
      targets.forEach((stId) => {
        game.campaign.stateSaturation[stId] = clamp(Number(game.campaign.stateSaturation[stId] || 0) + choice.saturationDelta, 0, 100);
      });
    }

    // 5. Instant State Chapter (written cleanly to playerPartyId — avoiding .player split)
    if (choice.addChapter && game.stateOrganizations?.[ctx.stateId]) {
      const org = game.stateOrganizations[ctx.stateId][pId] || { chapters: 0, strength: 20 };
      org.chapters = Number(org.chapters || 0) + 1;
      org.strength = clamp(Number(org.strength || 20) + 6, 0, 100);
      game.stateOrganizations[ctx.stateId][pId] = org;
      outcomeNotes.push(`+1 ${ctx.stateId} chapter`);
    }

    // 6. Live Faction Happiness & Friction (Zero Dead Faction Buckets)
    if (choice.factionHappinessDelta || choice.factionFrictionDelta) {
      const targetFacs = choice.isJackpot
        ? (game.factions || []).filter((f) => f && f.partyId === pId)
        : (game.factions || []).filter((f) => f && f.id === ctx.factionId);
      targetFacs.forEach((f) => {
        if (choice.factionHappinessDelta) {
          f.happiness = clamp(round1(Number(f.happiness ?? 60) + choice.factionHappinessDelta), 0, 100);
          if (game.factionHappiness) game.factionHappiness[f.id] = f.happiness;
          if (game.factionStandings) game.factionStandings[f.id] = f.happiness;
        }
        if (choice.factionFrictionDelta) {
          f.frictionIndex = clamp(round1(Number(f.frictionIndex || 0) + choice.factionFrictionDelta), 0, 100);
        }
      });
    }

    // 7. Exact "Usually (But Not Always)" Voter Registration Option
    let regResult = null;
    if (choice.isVoterRegOption) {
      const stOrg = game.stateOrganizations?.[ctx.stateId]?.[pId];
      const hasInfra = Number(stOrg?.chapters || 0) >= 2 || Number(game.campaign?.fieldOfficesByState?.[ctx.stateId]?.[pId] || 0) >= 1;
      let successProb = 0.78;
      if (hasInfra) successProb += 0.08;
      if (ev.month <= 3) successProb += 0.05;
      if (ev.month >= 5) successProb -= 0.10;
      if (Number(game.trust?.independents || 0) >= 25) successProb += 0.05;
      successProb = clamp(successProb, 0.55, 0.92);

      const roll = seededUnit(`${game.seed || 1}:${game.year || 2028}:m${ev.month}:reg:${ev.id}`);
      if (roll < successProb) {
        const isStrong = roll < (successProb * 0.25);
        const mult = isStrong ? 1.35 : 1.0;
        const targetVoters = Math.round((choice.regBaseVoters || 5000) * mult);
        const added = transferStateVotersConserved(game, ctx.stateId, pId, targetVoters);
        regResult = { succeeded: true, strong: isStrong, votersAdded: added, stateId: ctx.stateId, probability: round2(successProb) };
        outcomeTag = isStrong ? 'reg_strong_success' : 'reg_success';
        outcomeNotes.push(`+${added.toLocaleString()} registered voters in ${ctx.stateId}`);
      } else {
        // Fizzle (~22% miss): 0 voters added, small consolation bump
        if (game.trust) game.trust.supporters = clamp(round1(Number(game.trust.supporters || 65) + 1), 0, 100);
        regResult = { succeeded: false, strong: false, votersAdded: 0, stateId: ctx.stateId, probability: round2(successProb) };
        outcomeTag = 'reg_fizzle';
        outcomeNotes.push(`Registration drive in ${ctx.stateId} hit clerk/turnout friction (0 new voters, +1 Sup Trust)`);
      }
    }

    // 8. Ultra-Rare All-Tier Generational Windfall ("Jackpot"): +10,000 Voters in 10 Seeded States
    let jackpotResult = null;
    if (choice.isJackpot && Array.isArray(ev.jackpotStates)) {
      let totalAdded = 0;
      const perState = {};
      ev.jackpotStates.forEach((stId) => {
        const added = transferStateVotersConserved(game, stId, pId, JACKPOT_VOTERS_PER_STATE);
        perState[stId] = added;
        totalAdded += added;
        if (choice.jackpotPollBoost) addPoll(stId, choice.jackpotPollBoost);
      });
      if (choice.freeFieldOffices) {
        if (!game.campaign.fieldOfficesByState) game.campaign.fieldOfficesByState = {};
        ev.jackpotStates.slice(0, choice.freeFieldOffices).forEach((stId) => {
          if (!game.campaign.fieldOfficesByState[stId]) game.campaign.fieldOfficesByState[stId] = {};
          game.campaign.fieldOfficesByState[stId][pId] = Number(game.campaign.fieldOfficesByState[stId][pId] || 0) + 1;
        });
      }
      jackpotResult = { states: ev.jackpotStates, perState, totalAdded };
      outcomeTag = 'historic_windfall';
      outcomeNotes.unshift(`HISTORIC SURGE: +${totalAdded.toLocaleString()} voters across 10 states (${ev.jackpotStates.join(', ')})`);
    }

    // 9. Advance or Spawn Multi-Month Story Arc
    if (ev.arcId) {
      const existingArc = (ce.activeArcs || []).find((a) => a.arcId === ev.arcId && !a.completed);
      if (ev.arcBeat === 1 && !existingArc) {
        ce.activeArcs.push({
          arcId: ev.arcId,
          currentBeat: 1,
          maxBeats: 3,
          stateId: ctx.stateId,
          factionId: ctx.factionId,
          flags: choice.arcFlag ? [choice.arcFlag] : [],
          nextMonth: Math.min(5, ev.month + 1),
          completed: false,
        });
      } else if (existingArc) {
        existingArc.currentBeat = ev.arcBeat;
        if (choice.arcFlag) existingArc.flags.push(choice.arcFlag);
        if (ev.arcBeat >= existingArc.maxBeats) {
          existingArc.completed = true;
        } else {
          existingArc.nextMonth = Math.min(5, ev.month + 1);
        }
      }
    }

    // 10. Rival Chair News-Cycle Reaction (Morning Wire)
    const rivalReaction = `${ctx.rivalPartyName} Chair responded to "${ev.title}" by shifting rapid-response ads toward ${ctx.stateId}.`;
    ce.rivalReactions = [...(ce.rivalReactions || []), { year: ev.year, month: ev.month, text: rivalReaction }].slice(-10);
    if (Array.isArray(game.campaign.morningWireHeadlines)) {
      game.campaign.morningWireHeadlines = [rivalReaction, ...game.campaign.morningWireHeadlines].slice(0, 8);
    }

    // 11. Finalize Event & Record History
    ev.resolved = true;
    ev.chosenId = choice.id;
    ev.outcome = { tag: outcomeTag, notes: outcomeNotes, regResult, jackpotResult, rivalReaction };
    ce.firedEventIds = [...(ce.firedEventIds || []).filter((id) => id !== ev.id), ev.id].slice(-120);
    ce.history = [...(ce.history || []), {
      year: ev.year,
      month: ev.month,
      eventId: ev.id,
      title: ev.title,
      severity: ev.severity,
      choiceId: choice.id,
      choiceLabel: choice.label,
      outcomeTag,
      keyStates: jackpotResult ? jackpotResult.states : [ctx.stateId],
      summary: outcomeNotes.join(' · '),
    }].slice(-MAX_HISTORY);
    ce.pendingEvent = null;

    game.lastNote = `Month ${ev.month} Event Resolved: ${ev.title} — ${outcomeNotes.join(' · ')}`;
    return game;
  }

  /* ------------------------------------------------------------------------
     Cross-System Helpers (Debate Arc Callbacks & Political Atlas Defining Event)
     ------------------------------------------------------------------------ */
  function getArcDebateCallbackQuestion(game) {
    const arcs = game?.campaignEvents?.activeArcs || [];
    const whistle = arcs.find((a) => a && a.arcId === 'arc_whistleblower');
    if (whistle) {
      const hid = (whistle.flags || []).includes('contained_risk');
      return {
        id: `dq_arc_whistle_${game.year || 2028}`,
        category: 'Breaking Arc',
        issueId: game.campaign?.monthlyTheme || 'institutional-trust',
        prompt: hid
          ? `Your campaign tried to contain the leaked ${whistle.stateId} donor memo earlier this cycle. Why should voters trust your leadership now?`
          : `You released the full ${whistle.stateId} donor memo to the public earlier this cycle. How do you prove that transparency translates into governing discipline?`,
      };
    }
    return null;
  }

  function attachDefiningEventToAtlas(game) {
    if (!game || !Array.isArray(game.atlasHistory) || !game.atlasHistory.length) return game;
    const yr = Number(game.year || 2028);
    const cycleEvents = (game.campaignEvents?.history || []).filter((h) => Number(h.year) === yr);
    if (!cycleEvents.length) return game;
    const rank = { historic: 4, critical: 3, major: 2, standard: 1 };
    const top = cycleEvents.slice().sort((a, b) => (rank[b.severity] || 1) - (rank[a.severity] || 1))[0];
    const snap = game.atlasHistory[game.atlasHistory.length - 1];
    if (snap && Number(snap.year) === yr) {
      snap.definingEvent = {
        title: top.title,
        month: top.month,
        choiceLabel: top.choiceLabel,
        impactSummary: top.summary,
      };
    }
    return game;
  }

  /* ------------------------------------------------------------------------
     UI Renderers: Breaking News Desk Modal & 5-Month Campaign Timeline Strip
     ------------------------------------------------------------------------ */
  function renderCampaignTimelineStrip(game) {
    if (!game?.campaign?.active) return '';
    normalizeCampaignEvents(game);
    const yr = Number(game.year || 2028);
    const curM = Number(game.campaign.month || game.campaign.week || 1);
    const hist = (game.campaignEvents.history || []).filter((h) => Number(h.year) === yr);
    const byMonth = new Map(hist.map((h) => [Number(h.month), h]));
    const pending = game.campaignEvents.pendingEvent;

    return `
      <section class="panel" id="v0185-campaign-timeline" style="margin:12px 0;padding:12px 16px;border:1px solid #1e293b;background:rgba(15,23,42,0.72);border-radius:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;flex-wrap:wrap">
          <strong style="font-size:12.5px;letter-spacing:0.1em;text-transform:uppercase;color:#e2bd70">Campaign News Cycle Timeline (${yr})</strong>
          ${pending && !pending.resolved ? `<button type="button" class="button button-small button-gold" data-v0185-open-desk="1">Breaking News Decision Pending →</button>` : ''}
        </div>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px">
          ${[1, 2, 3, 4, 5].map((m) => {
            const rec = byMonth.get(m);
            const isCur = m === curM;
            const isPend = pending && !pending.resolved && Number(pending.month) === m;
            const border = rec?.severity === 'historic' ? '#f59e0b' : isPend ? '#ef4444' : isCur ? '#e2bd70' : '#1e293b';
            return `
              <div style="padding:8px 10px;border-radius:8px;border:1px solid ${border};background:${rec ? 'rgba(30,41,59,0.75)' : 'rgba(15,23,42,0.45)'};font-size:11.5px">
                <div style="font-weight:700;color:${isCur ? '#f3d285' : '#94a3b8'};margin-bottom:3px">Month ${m}${rec?.severity === 'historic' ? ' ★' : ''}</div>
                <div style="color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${safeHtml(rec ? `${rec.title} — ${rec.summary}` : (isPend ? pending.title : 'Upcoming'))}">
                  ${rec ? safeHtml(rec.title) : (isPend ? '<span style="color:#fca5a5">Action Required</span>' : '<span style="color:#64748b">Upcoming</span>')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  function renderBreakingNewsModal(game) {
    if (!game?.campaign?.active) return '';
    normalizeCampaignEvents(game);
    const ev = game.campaignEvents.pendingEvent;
    if (!ev || ev.resolved) return '';

    const isJackpot = ev.id === JACKPOT_ID || ev.severity === 'historic';
    const badgeText = isJackpot
      ? 'HISTORIC BREAKING EVENT · ONCE-IN-A-GENERATION SURGE'
      : ev.severity === 'critical'
        ? `BREAKING NEWS · MONTH ${ev.month} CRITICAL DECISION`
        : ev.arcId
          ? `DEVELOPING STORY ARC (BEAT ${ev.arcBeat}/3) · MONTH ${ev.month}`
          : `CAMPAIGN DESK · MONTH ${ev.month}`;

    const accent = isJackpot ? '#f59e0b' : (ev.severity === 'critical' ? '#ef4444' : '#e2bd70');
    const bgGrad = isJackpot
      ? 'linear-gradient(155deg,#1e1405 0%,#0f172a 55%,#271a04 100%)'
      : 'linear-gradient(155deg,#0f172a 0%,#0b1220 100%)';

    const jackpotGrid = isJackpot && Array.isArray(ev.jackpotStates) ? `
      <div style="margin:14px 0;padding:12px 14px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.45);border-radius:10px">
        <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#fbbf24;margin-bottom:8px">
          ⚡ SOMETHING UNPRECEDENTED JUST HAPPENED — +10,000 NEW VOTERS IN 10 STATES (+100,000 TOTAL)
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${ev.jackpotStates.map((st) => `<span style="padding:4px 10px;border-radius:999px;background:rgba(245,158,11,0.22);border:1px solid #f59e0b;color:#fef3c7;font-size:12px;font-weight:700">${safeHtml(st)} +10,000</span>`).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div id="v0185-breaking-news-modal" style="position:fixed;inset:0;z-index:100015;background:rgba(2,6,23,0.88);display:flex;align-items:center;justify-content:center;padding:20px">
        <div style="width:100%;max-width:760px;max-height:92vh;overflow:auto;background:${bgGrad};border:2px solid ${accent};border-radius:14px;padding:24px;color:#f8fafc;box-shadow:0 28px 70px rgba(0,0,0,0.8)">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
            <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${accent}26;border:1px solid ${accent};color:${accent};font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase">${safeHtml(badgeText)}</span>
            <span style="font-size:12px;color:#94a3b8">${safeHtml(ev.context?.stateId || 'US')} · ${safeHtml(ev.context?.region || 'National')} · Treasury: $${Number(game.treasury || 0).toFixed(1)}M</span>
          </div>
          <h2 style="margin:0 0 10px;font-size:24px;color:#fff;font-family:'Iowan Old Style',Palatino,Georgia,serif">${safeHtml(ev.title)}</h2>
          <p style="margin:0 0 14px;font-size:14.5px;line-height:1.58;color:#cbd5e1">${safeHtml(ev.body)}</p>
          ${jackpotGrid}
          <div style="display:grid;gap:10px;margin-top:14px">
            ${(ev.choices || []).map((ch) => {
              const cantAfford = Number(ch.cost || 0) > Number(game.treasury || 0);
              return `
                <button type="button" class="button ${ch.isJackpot ? 'button-gold' : ''}" data-v0185-choice="${safeHtml(ch.id)}" ${cantAfford ? 'disabled' : ''} style="display:block;width:100%;text-align:left;padding:14px 16px;border:1px solid ${ch.isVoterRegOption ? '#38bdf8' : '#334155'};background:rgba(15,23,42,0.82);border-radius:10px">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px">
                    <strong style="font-size:14.5px;color:#fff">${safeHtml(ch.label)}</strong>
                    ${ch.isVoterRegOption ? '<span style="font-size:11px;padding:2px 8px;border-radius:999px;background:rgba(56,189,248,0.18);color:#7dd3fc;font-weight:700">VOTER REG OPTION</span>' : ''}
                  </div>
                  <div style="font-size:12.5px;color:#94a3b8;margin-bottom:8px;line-height:1.4">${safeHtml(ch.summary || '')}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px">
                    ${(ch.stakes || []).map((st) => `<span style="font-size:11px;padding:2px 8px;border-radius:6px;background:#1e293b;color:#e2e8f0;font-weight:600">${safeHtml(st)}</span>`).join('')}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderOverlays(game) {
    return renderBreakingNewsModal(game);
  }

  const _uiBridge = { game: null, hooks: {} };
  function ensureDelegatedListeners() {
    if (typeof document === 'undefined' || global.__v0185CampaignEventsBound) return;
    global.__v0185CampaignEventsBound = true;
    document.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('[data-v0185-choice]');
      if (!btn || !_uiBridge.game) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const choiceId = btn.getAttribute('data-v0185-choice');
      const next = resolveCampaignEvent(_uiBridge.game, choiceId);
      if (typeof _uiBridge.hooks?.setGame === 'function') _uiBridge.hooks.setGame(next);
      if (typeof _uiBridge.hooks?.saveGame === 'function') _uiBridge.hooks.saveGame(next);
      if (typeof _uiBridge.hooks?.render === 'function') _uiBridge.hooks.render();
    }, true);
  }

  function bindUI(game, hooks = {}) {
    _uiBridge.game = game;
    _uiBridge.hooks = hooks;
    ensureDelegatedListeners();
  }

  const CampaignEventsSystem = {
    VERSION,
    JACKPOT_ID,
    JACKPOT_STATES_COUNT,
    JACKPOT_VOTERS_PER_STATE,
    JACKPOT_MONTHLY_ODDS,
    EVENT_CATALOG,
    EVENT_BY_ID,
    fnv1aHash,
    seededUnit,
    defaultCampaignEventsState,
    normalizeCampaignEvents,
    compactCampaignEventsForSave,
    getEligibleEventsForTier,
    buildDynamicContext,
    transferStateVotersConserved,
    rollMonthlyCampaignEvent,
    resolveCampaignEvent,
    getArcDebateCallbackQuestion,
    attachDefiningEventToAtlas,
    renderCampaignTimelineStrip,
    renderBreakingNewsModal,
    renderOverlays,
    bindUI,
  };

  if (typeof document !== 'undefined') ensureDelegatedListeners();
  if (typeof global !== 'undefined') global.CampaignEventsSystem = CampaignEventsSystem;
  if (typeof module !== 'undefined' && module.exports) module.exports = CampaignEventsSystem;
})(typeof window !== 'undefined' ? window : global);
