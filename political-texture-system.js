/**
 * Coalition Builder: Party Chair — Political Texture & Narrative System
 * Provides rich qualitative flavor, expanded politician traits, bespoke backstories,
 * 50-state political geography & bellwether county profiles, and dynamic cable-news chyrons.
 * Strictly qualitative narrative per Rule 7 with zero runtime performance drag.
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. EXPANDED POLITICIAN TRAITS TAXONOMY (40 TRAITS)
  // ============================================================================
  const EXPANDED_POLITICIAN_TRAITS_REGISTRY = {
    // --- 8 Canonical Baseline Traits ---
    'Rising Star': {
      id: 'rising-star',
      name: 'Rising Star',
      category: 'career_stage',
      description: 'Rapidly gaining national visibility and grassroots excitement; generates heightened donor virality and volunteer surges.',
      maxAge: 59,
      effects: { donorViralityMultiplier: 1.5, volunteerSurgeMultiplier: 1.35 },
    },
    'Established Politician': {
      id: 'established-politician',
      name: 'Established Politician',
      category: 'career_stage',
      description: 'Seasoned legislative veteran with institutional seniority, reliable party loyalty, and a hardened electoral baseline.',
      minAge: 40,
      effects: { volatilityMultiplier: 0.65, baselineDefenseFloor: 4.0 },
    },
    'Corrupt': {
      id: 'corrupt',
      name: 'Corrupt',
      category: 'ethics',
      description: 'Dogged by ethics investigations, campaign finance entanglements, or federal probes; highly vulnerable to opposition research.',
      effects: { vulnerabilityDelta: 45, scandalOddsMultiplier: 2.0 },
    },
    'Squeaky Clean': {
      id: 'squeaky-clean',
      name: 'Squeaky Clean',
      category: 'ethics',
      description: 'Celebrated for personal ethics, financial transparency, and untainted public standing; immune to standard opposition smears.',
      effects: { oppoImmunity: true, suburbanSwingLift: 2.5 },
    },
    'Polished': {
      id: 'polished',
      name: 'Polished',
      category: 'communication',
      description: 'Camera-ready orator with sharp debate delivery and high message discipline; excels in televised broadcast forums.',
      effects: { debatePerformanceMultiplier: 1.15, earnedMediaEfficiencyMultiplier: 1.20 },
    },
    'Rough': {
      id: 'rough',
      name: 'Rough',
      category: 'communication',
      description: 'Unvarnished, plain-spoken populist orator who connects instinctively with blue-collar workers and rural precinct halls.',
      effects: { workingClassRuralAppeal: 3.0, earnedMediaEfficiencyMultiplier: 0.82 },
    },
    'Disciplined': {
      id: 'disciplined',
      name: 'Disciplined',
      category: 'operational',
      description: 'Strictly stays on party message with tactical caution; avoids unforced gaffes and honors caucus leadership direction.',
      effects: { volatilityMultiplier: 0.55, unforcedGaffeOddsMultiplier: 0.0 },
    },
    'Undisciplined': {
      id: 'undisciplined',
      name: 'Undisciplined',
      category: 'operational',
      description: 'Spontaneous and provocative figure prone to unscripted outbursts, hot-mic gaffes, and volatile polling swings.',
      effects: { volatilityMultiplier: 1.65, unforcedGaffeOddsMultiplier: 2.5 },
    },

    // --- Background & Roots (10 Traits) ---
    'Military Veteran': {
      id: 'military-veteran',
      name: 'Military Veteran',
      category: 'background',
      description: 'Decorated service in the armed forces; commands deep respect among rural voters, working families, and veterans.',
      effects: { workingClassRuralAppeal: 2.2, baselineDefenseFloor: 2.5 },
    },
    'Union Stalwart': {
      id: 'union-stalwart',
      name: 'Union Stalwart',
      category: 'background',
      description: 'Lifelong ally of organized labor and trade councils; unlocks volunteer mobilization surges in manufacturing hubs.',
      effects: { volunteerSurgeMultiplier: 1.25, workingClassRuralAppeal: 2.5 },
    },
    'Prosecutorial Edge': {
      id: 'prosecutorial-edge',
      name: 'Prosecutorial Edge',
      category: 'background',
      description: 'Former prosecutor or attorney general; conducts sharp, forensic questioning on debate stages and in committee hearings.',
      effects: { debatePerformanceMultiplier: 1.20, vulnerabilityDelta: -10 },
    },
    'Small-Town Pillar': {
      id: 'small-town-pillar',
      name: 'Small-Town Pillar',
      category: 'background',
      description: 'Deep roots in civic clubs, county fairs, and local commerce; fortifies rural turnout defenses and small-dollar enthusiasm.',
      effects: { baselineDefenseFloor: 3.0, workingClassRuralAppeal: 1.5 },
    },
    'Academic Theorist': {
      id: 'academic-theorist',
      name: 'Academic Theorist',
      category: 'background',
      description: 'Former scholar or think-tank fellow; brings intellectual rigor and policy credibility to complex legislative battles.',
      effects: { debatePerformanceMultiplier: 1.10, earnedMediaEfficiencyMultiplier: 1.10 },
    },
    'K-Street Veteran': {
      id: 'k-street-veteran',
      name: 'K-Street Veteran',
      category: 'background',
      description: 'Connected institutional insider with deep corporate rolodexes; elevates high-dollar donor bundling efficiency.',
      effects: { donorViralityMultiplier: 1.30, baselineDefenseFloor: 1.5 },
    },
    'Local Sports Legend': {
      id: 'local-sports-legend',
      name: 'Local Sports Legend',
      category: 'background',
      description: 'Beloved collegiate or professional athletics figure; enjoys an unshakeable baseline of statewide goodwill and fame.',
      effects: { baselineDefenseFloor: 3.5, suburbanSwingLift: 1.5 },
    },
    'Grassroots Organizer': {
      id: 'grassroots-organizer',
      name: 'Grassroots Organizer',
      category: 'background',
      description: 'Seasoned precinct captain who cut teeth in community door-knocking; accelerates volunteer recruitment drives.',
      effects: { volunteerSurgeMultiplier: 1.30, donorViralityMultiplier: 1.15 },
    },
    'Self-Made Entrepreneur': {
      id: 'self-made-entrepreneur',
      name: 'Self-Made Entrepreneur',
      category: 'background',
      description: 'Private-sector executive or business founder; projects fiscal competence and commands suburban moderate appeal.',
      effects: { suburbanSwingLift: 2.0, donorViralityMultiplier: 1.20 },
    },
    'Dynastic Name': {
      id: 'dynastic-name',
      name: 'Dynastic Name',
      category: 'background',
      description: 'Scion of a legendary political family; enters politics with high immediate name recognition and national press access.',
      effects: { earnedMediaEfficiencyMultiplier: 1.25, baselineDefenseFloor: 2.0 },
    },

    // --- Campaign & Media Style (10 Traits) ---
    'Sunday Show Fixture': {
      id: 'sunday-show-fixture',
      name: 'Sunday Show Fixture',
      category: 'media_style',
      description: 'Frequent network roundtable panelist; maximizes the earned-media publicity value of party initiatives.',
      effects: { earnedMediaEfficiencyMultiplier: 1.30, debatePerformanceMultiplier: 1.08 },
    },
    'Relentless Door-Knocker': {
      id: 'relentless-door-knocker',
      name: 'Relentless Door-Knocker',
      category: 'media_style',
      description: 'Tireless retail campaigner who spends cycles on front porches; lifts field operation yields in contested home counties.',
      effects: { volunteerSurgeMultiplier: 1.25, baselineDefenseFloor: 2.5 },
    },
    'Floor Speech Maverick': {
      id: 'floor-speech-maverick',
      name: 'Floor Speech Maverick',
      category: 'media_style',
      description: 'Fiery chamber speaker whose viral floor speeches dominate social feeds and spark small-dollar fundraising spikes.',
      effects: { donorViralityMultiplier: 1.25, earnedMediaEfficiencyMultiplier: 1.15 },
    },
    'Oratorical Phenom': {
      id: 'oratorical-phenom',
      name: 'Oratorical Phenom',
      category: 'media_style',
      description: 'Spellbinding public speaker capable of electrifying packed convention arenas and stadium rallies.',
      effects: { debatePerformanceMultiplier: 1.25, volunteerSurgeMultiplier: 1.20 },
    },
    'Digital Native': {
      id: 'digital-native',
      name: 'Digital Native',
      category: 'media_style',
      description: 'Master of algorithmic outreach, livestreams, and digital memes; multiplies online donation momentum.',
      effects: { donorViralityMultiplier: 1.35, volunteerSurgeMultiplier: 1.15 },
    },
    'Media Darling': {
      id: 'media-darling',
      name: 'Media Darling',
      category: 'media_style',
      description: 'Consistently praised by national political columnists; dampens the damage of rival negative advertising.',
      effects: { earnedMediaEfficiencyMultiplier: 1.25, vulnerabilityDelta: -15 },
    },
    'Quiet Diplomat': {
      id: 'quiet-diplomat',
      name: 'Quiet Diplomat',
      category: 'media_style',
      description: 'Works quietly behind closed cloakroom doors; soothes intra-party ideological friction and stabilizes alliances.',
      effects: { volatilityMultiplier: 0.70, baselineDefenseFloor: 2.0 },
    },
    'Cautious Deliberator': {
      id: 'cautious-deliberator',
      name: 'Cautious Deliberator',
      category: 'media_style',
      description: 'Risk-averse and measured operator; virtually immune to unforced message mistakes and tactical traps.',
      effects: { unforcedGaffeOddsMultiplier: 0.0, volatilityMultiplier: 0.60 },
    },
    'Populist Firebrand': {
      id: 'populist-firebrand',
      name: 'Populist Firebrand',
      category: 'media_style',
      description: 'Uncompromising tribune for the disaffected; mobilizes non-voters with fiery anti-establishment rhetoric.',
      effects: { workingClassRuralAppeal: 3.5, donorViralityMultiplier: 1.20, volatilityMultiplier: 1.25 },
    },
    'Deep-Pocket Rolodex': {
      id: 'deep-pocket-rolodex',
      name: 'Deep-Pocket Rolodex',
      category: 'media_style',
      description: 'Commands access to major private finance networks; can summon rapid emergency cash infusions for key races.',
      effects: { donorViralityMultiplier: 1.40, baselineDefenseFloor: 1.5 },
    },

    // --- Legislative & Governance (8 Traits) ---
    'Machine Loyalist': {
      id: 'machine-loyalist',
      name: 'Machine Loyalist',
      category: 'governance',
      description: 'Steadfast party regular who enforces caucus discipline and honors organizational hierarchy.',
      effects: { volatilityMultiplier: 0.60, baselineDefenseFloor: 2.5 },
    },
    'Budget Hawk': {
      id: 'budget-hawk',
      name: 'Budget Hawk',
      category: 'governance',
      description: 'Relentless fiscal watchdog who scrutinizes appropriations and projects unbending spending discipline.',
      effects: { suburbanSwingLift: 1.8, vulnerabilityDelta: -10 },
    },
    'Bipartisan Dealmaker': {
      id: 'bipartisan-dealmaker',
      name: 'Bipartisan Dealmaker',
      category: 'governance',
      description: 'Proven record of cross-aisle legislation; holds strong appeal among independent swing voters in purple battlegrounds.',
      effects: { suburbanSwingLift: 3.0, volatilityMultiplier: 0.75 },
    },
    'Doctrinal Purist': {
      id: 'doctrinal-purist',
      name: 'Doctrinal Purist',
      category: 'governance',
      description: 'Refuses ideological dilution or compromise; strictly enforces party platform principles among allies.',
      effects: { volunteerSurgeMultiplier: 1.20, scandalOddsMultiplier: 0.5 },
    },
    'Committee Workhorse': {
      id: 'committee-workhorse',
      name: 'Committee Workhorse',
      category: 'governance',
      description: 'Diligent legislative craftsman who masters complex bill markup; extends career longevity and chamber influence.',
      effects: { baselineDefenseFloor: 3.0, volatilityMultiplier: 0.70 },
    },
    'Backbench Agitator': {
      id: 'backbench-agitator',
      name: 'Backbench Agitator',
      category: 'governance',
      description: 'Insurgent firebrand who challenges party leadership mandates; provokes factional tension and media drama.',
      effects: { earnedMediaEfficiencyMultiplier: 1.15, volatilityMultiplier: 1.30 },
    },
    'Kingmaker Conduit': {
      id: 'kingmaker-conduit',
      name: 'Kingmaker Conduit',
      category: 'governance',
      description: 'Maintains intimate ties with influential state party power-brokers and independent swing PAC directors.',
      effects: { donorViralityMultiplier: 1.20, suburbanSwingLift: 1.5 },
    },
    'Statehouse Alum': {
      id: 'statehouse-alum',
      name: 'Statehouse Alum',
      category: 'governance',
      description: 'Rose through state legislative ranks; bridges state capitol delegations and federal campaign machinery seamlessly.',
      effects: { volunteerSurgeMultiplier: 1.15, baselineDefenseFloor: 2.0 },
    },

    // --- Character & Volatility (4 Traits) ---
    'Gaffe Prone': {
      id: 'gaffe-prone',
      name: 'Gaffe Prone',
      category: 'character',
      description: 'Vulnerable to awkward press slips and hot-mic stumbles, though often viewed by voters as endearing authenticity.',
      effects: { unforcedGaffeOddsMultiplier: 1.8, volatilityMultiplier: 1.35 },
    },
    'Teflon Brand': {
      id: 'teflon-brand',
      name: 'Teflon Brand',
      category: 'character',
      description: 'Naturally bulletproof public figure against whom opponent attacks and opposition research fail to stick.',
      effects: { vulnerabilityDelta: -35, baselineDefenseFloor: 3.5 },
    },
    'Charismatic Fundraiser': {
      id: 'charismatic-fundraiser',
      name: 'Charismatic Fundraiser',
      category: 'character',
      description: 'Effortlessly charms donor galas and grassroots rallies alike; multiplies campaign finance momentum.',
      effects: { donorViralityMultiplier: 1.35, earnedMediaEfficiencyMultiplier: 1.15 },
    },
    'Principled Contrarian': {
      id: 'principled-contrarian',
      name: 'Principled Contrarian',
      category: 'character',
      description: 'Renowned for breaking with party orthodoxy on core conscience votes; enjoys unmatched independent credibility.',
      effects: { suburbanSwingLift: 2.5, volatilityMultiplier: 0.85 },
    },
  };

  const ALL_POLITICIAN_TRAIT_NAMES = Object.keys(EXPANDED_POLITICIAN_TRAITS_REGISTRY);

  // Case-insensitive / legacy alias support
  EXPANDED_POLITICIAN_TRAITS_REGISTRY['Established politician'] = EXPANDED_POLITICIAN_TRAITS_REGISTRY['Established Politician'];

  // ============================================================================
  // 2. BESPOKE POLITICIAN HISTORICAL BIOS & BACKSTORIES
  // ============================================================================
  const POLITICIAN_BIOS_REGISTRY = {
    // --- Democratic Figures ---
    'Jon Ossoff': {
      hometown: 'Atlanta, GA',
      almaMater: 'Georgetown University (BSFS) · London School of Economics (MSc)',
      career: 'Investigative Journalist & Documentary Filmmaker; CEO of Insight TWI',
      milestone: 'Won historic 2021 Georgia Senate runoff, securing the Senate majority; authored landmark bipartisan postal reform.',
    },
    'Gretchen Whitmer': {
      hometown: 'East Lansing, MI',
      almaMater: 'Michigan State University (BA & JD)',
      career: 'Ingham County Prosecutor; Michigan Senate Minority Leader',
      milestone: 'Won decisive 2022 re-election in battleground Michigan; secured state legislative trifecta for first time in 40 years.',
    },
    'Cory Booker': {
      hometown: 'Newark, NJ',
      almaMater: 'Stanford University (BA & MA) · Oxford (Rhodes) · Yale Law (JD)',
      career: 'Tenant Rights Attorney; Newark City Council Member; Mayor of Newark',
      milestone: 'Championed landmark First Step Act criminal justice reform; nationally recognized for urban revitalization and coalition building.',
    },
    'Alexandria Ocasio-Cortez': {
      hometown: 'Bronx, NY',
      almaMater: 'Boston University (BA in Economics and International Relations)',
      career: 'Community Organizer for National Hispanic Institute; Educational Director',
      milestone: 'Stunned political world in 2018 primary victory over 10-term incumbent; built one of the largest digital grassroots donor networks.',
    },
    'Andy Beshear': {
      hometown: 'Dawson Springs, KY',
      almaMater: 'Vanderbilt University (BA) · University of Virginia (JD)',
      career: 'Kentucky Attorney General; Consumer Protection Litigator',
      milestone: 'Won two consecutive gubernatorial terms in deep-red Kentucky; acclaimed for steady crisis leadership following historic floods and tornadoes.',
    },
    'Amy Klobuchar': {
      hometown: 'Plymouth, MN',
      almaMater: 'Yale University (BA) · University of Chicago Law (JD)',
      career: 'Hennepin County Attorney; Commercial Law Litigator',
      milestone: 'Authored more bipartisan bills enacted into law than almost any contemporary senator; proven winner in rural and industrial Minnesota.',
    },
    'Josh Shapiro': {
      hometown: 'Abington, PA',
      almaMater: 'University of Rochester (BA) · Georgetown Law (JD)',
      career: 'State Representative; Montgomery County Commission Chair; PA Attorney General',
      milestone: 'Reopened collapsed I-95 corridor in record 12 days; won Pennsylvania governorship by 15 points with broad suburban-rural cross-over.',
    },
    'Raphael Warnock': {
      hometown: 'Savannah, GA',
      almaMater: 'Morehouse College (BA) · Union Theological Seminary (MDiv & PhD)',
      career: 'Senior Pastor of Historic Ebenezer Baptist Church; Civil Rights Advocate',
      milestone: 'Preached from Dr. Martin Luther King Jr.’s pulpit; won two grueling statewide Georgia runoff elections in consecutive cycles.',
    },
    'Mark Kelly': {
      hometown: 'Tucson, AZ',
      almaMater: 'U.S. Merchant Marine Academy (BS) · U.S. Naval Postgraduate School (MS)',
      career: 'U.S. Navy Captain & Combat Aviator; NASA Space Shuttle Commander',
      milestone: 'Flew 39 combat missions in Operation Desert Storm; logged 54 days in space across four shuttle missions; won back-to-back Arizona Senate races.',
    },
    'Wes Moore': {
      hometown: 'Baltimore, MD',
      almaMater: 'Valley Forge Military Academy · Johns Hopkins (BA) · Oxford (Rhodes)',
      career: 'U.S. Army Captain (82nd Airborne, Afghanistan); CEO of Robin Hood Foundation',
      milestone: 'First Black Governor of Maryland; led historic state economic development agenda and infrastructure recovery.',
    },
    'Bernie Sanders': {
      hometown: 'Burlington, VT',
      almaMater: 'University of Chicago (BA in Political Science)',
      career: 'Mayor of Burlington; U.S. Representative; U.S. Senator',
      milestone: 'Longest-serving independent lawmaker in congressional history; ignited modern democratic socialist and progressive grassroots movement.',
    },
    'Elizabeth Warren': {
      hometown: 'Oklahoma City, OK / Cambridge, MA',
      almaMater: 'University of Houston (BS) · Rutgers Law (JD)',
      career: 'Law Professor (Harvard, Penn, Texas); Special Advisor to Consumer Financial Protection Bureau',
      milestone: 'Conceived and spearheaded establishment of the Consumer Financial Protection Bureau (CFPB); relentless banking and antitrust watchdog.',
    },
    'Sherrod Brown': {
      hometown: 'Mansfield, OH',
      almaMater: 'Yale University (BA) · Ohio State University (MA & MPA)',
      career: 'Ohio Secretary of State; U.S. Representative; U.S. Senator',
      milestone: 'Championed the "Dignity of Work"; chaired Senate Banking Committee; won multiple Senate terms in increasingly conservative Ohio.',
    },
    'John Fetterman': {
      hometown: 'York, PA / Braddock, PA',
      almaMater: 'Albright College (BA) · Harvard Kennedy School (MPP)',
      career: 'AmeriCorps Director; Mayor of Braddock; Lieutenant Governor of Pennsylvania',
      milestone: 'Revitalized historic rust-belt steel town of Braddock; flipped Pennsylvania Senate seat in 2022 despite late-campaign stroke recovery.',
    },
    'Mary Peltola': {
      hometown: 'Bethel, AK',
      almaMater: 'University of Northern Colorado · University of Alaska Fairbanks',
      career: 'Alaska State Representative; Executive Director of Kuskokwim River Inter-Tribal Fish Commission',
      milestone: 'First Alaska Native elected to Congress; flipped Alaska’s at-large congressional district on "Fish, Family, and Freedom" platform.',
    },
    'Rob Sand': {
      hometown: 'Decorah, IA',
      almaMater: 'Brown University (BA) · University of Iowa College of Law (JD)',
      career: 'Iowa Assistant Attorney General; Chief Public Integrity Prosecutor',
      milestone: 'Uncovered historic multi-state lottery rigging scandal; only Democrat to win statewide election in Iowa in the 2022 midterm cycle.',
    },

    // --- Republican Figures ---
    'J. D. Vance': {
      hometown: 'Middletown, OH',
      almaMater: 'Ohio State University (BA) · Yale Law School (JD)',
      career: 'U.S. Marine Corps Combat Correspondent (Iraq); Venture Capitalist; Author',
      milestone: 'Penned cultural phenomenon memoir "Hillbilly Elegy"; forged populist working-class coalition to win 2022 Ohio Senate election.',
    },
    'Marco Rubio': {
      hometown: 'Miami, FL',
      almaMater: 'University of Florida (BS) · University of Miami School of Law (JD)',
      career: 'West Miami City Commissioner; Florida Speaker of the House; U.S. Senator',
      milestone: 'Authored landmark Uyghur Forced Labor Prevention Act; Vice Chair of Senate Intelligence Committee; expanded child tax credit.',
    },
    'Ted Cruz': {
      hometown: 'Houston, TX',
      almaMater: 'Princeton University (BA) · Harvard Law School (JD)',
      career: 'Texas Solicitor General; Appellate Litigator; Constitutional Law Professor',
      milestone: 'Argued nine cases before U.S. Supreme Court; staged famous 21-hour Senate floor speech; runner-up in 2016 presidential primaries.',
    },
    'Glenn Youngkin': {
      hometown: 'Richmond, VA',
      almaMater: 'Rice University (BS in Mechanical Engineering) · Harvard Business School (MBA)',
      career: 'Collegiate Basketball Player; Co-CEO of The Carlyle Group',
      milestone: 'Engineered historic 2021 Virginia gubernatorial victory with signature red fleece vest, uniting suburban moderates and rural conservatives.',
    },
    'Katie Britt': {
      hometown: 'Enterprise, AL',
      almaMater: 'University of Alabama (BS & JD)',
      career: 'Attorney; Chief of Staff to Sen. Richard Shelby; CEO of Business Council of Alabama',
      milestone: 'First woman elected to U.S. Senate from Alabama; delivered 2024 Republican State of the Union response; influential Appropriations leader.',
    },
    'Tom Cotton': {
      hometown: 'Dardanelle, AR',
      almaMater: 'Harvard College (BA) · Harvard Law School (JD)',
      career: 'U.S. Army Captain (101st Airborne, Iraq & Afghanistan Bronze Star); McKinsey Consultant',
      milestone: 'Ranger tab veteran; influential national security voice; author of best-selling military history and defense doctrine.',
    },
    'Ron DeSantis': {
      hometown: 'Dunedin, FL',
      almaMater: 'Yale University (BA) · Harvard Law School (JD)',
      career: 'U.S. Navy JAG Officer (SEAL Team One Advisor in Iraq); Federal Prosecutor; U.S. Representative',
      milestone: 'Won historic 19-point re-election victory in Florida in 2022, transforming Florida from quintessential swing state to conservative stronghold.',
    },
    'Josh Hawley': {
      hometown: 'Lexington, MO',
      almaMater: 'Stanford University (BA) · Yale Law School (JD)',
      career: 'Supreme Court Clerk (Chief Justice Roberts); Missouri Attorney General',
      milestone: 'Youngest Missouri AG in century; unseated two-term incumbent in 2018; outspoken proponent of economic populism and corporate antitrust.',
    },
    'Tommy Tuberville': {
      hometown: 'Camden, AR / Auburn, AL',
      almaMater: 'Southern Arkansas University (BS in Physical Education)',
      career: 'Collegiate Head Football Coach (Auburn, Ole Miss, Texas Tech, Cincinnati)',
      milestone: 'Coached Auburn to undefeated 13-0 SEC Championship season; ousted incumbent senator in 2020 on staunch outsider conservative platform.',
    },
    'Phil Scott': {
      hometown: 'Barre, VT',
      almaMater: 'University of Vermont (BS in Industrial Education)',
      career: 'DuBois Construction Co-Owner; Stock Car Racing Champion; VT Lieutenant Governor',
      milestone: 'All-time winningest stock car driver at Thunder Road speedway; won five consecutive gubernatorial terms in deep-blue Vermont with 70%+ margins.',
    },
    'Lisa Murkowski': {
      hometown: 'Ketchikan, AK',
      almaMater: 'Georgetown University (BA) · Willamette University College of Law (JD)',
      career: 'Commercial Attorney; Alaska State Representative',
      milestone: 'Won historic write-in campaign for U.S. Senate in 2010 after losing primary; veteran consensus broker on bipartisan energy and infrastructure laws.',
    },
    'Spencer Cox': {
      hometown: 'Fairview, UT',
      almaMater: 'Snow College · Utah State (BA) · Washington and Lee Law (JD)',
      career: 'Family Farm Operator; Telecommunications VP; Mayor of Fairview; Utah Lt. Governor',
      milestone: 'Spearheaded national "Disagree Better" civic campaign as National Governors Association Chair; champion of rural broadband and water conservation.',
    },
    'Ken Paxton': {
      hometown: 'Minot, ND / McKinney, TX',
      almaMater: 'Baylor University (BA & MBA) · University of Virginia School of Law (JD)',
      career: 'Corporate Counsel at JCPenney; Texas State Representative; Texas State Senator',
      milestone: 'Elected to three terms as Texas Attorney General; filed hundreds of landmark federal constitutional challenges against federal regulations.',
    },

    // --- Third-Party & Independent Leaders ---
    'Chase Oliver': {
      hometown: 'Atlanta, GA',
      almaMater: 'Maritime Logistics & Restaurant Hospitality Background',
      career: 'Maritime Shipping Coordinator; Anti-War Activist; Libertarian Party Organizer',
      milestone: 'Earned over 80,000 votes in 2022 Georgia Senate election, forcing a historic runoff; won 2024 Libertarian presidential nomination on seventh ballot.',
    },
    'Jill Stein': {
      hometown: 'Chicago, IL / Lexington, MA',
      almaMater: 'Harvard College (BA) · Harvard Medical School (MD)',
      career: 'Internal Medicine Physician; Clinical Instructor; Environmental Health Advocate',
      milestone: 'Pioneered the Green New Deal framework during 2012 and 2016 presidential campaigns; veteran organizer against coal plants and toxic incinerators.',
    },
    'Spike Cohen': {
      hometown: 'Baltimore, MD',
      almaMater: 'Web Design & Digital Media Production Background',
      career: 'Web Designer; Digital Broadcast Host; Founder of "You Are The Power" Civic Organization',
      milestone: '2020 Libertarian vice presidential nominee; founded nationwide grassroots mutual aid and property rights advocacy network.',
    },
    'Kshama Sawant': {
      hometown: 'Pune, India / Seattle, WA',
      almaMater: 'University of Mumbai (BS) · North Carolina State University (PhD in Economics)',
      career: 'Software Engineer; Economics Professor; Seattle City Council Member',
      milestone: 'First socialist elected in Seattle in a century; led the successful movement for the nation’s first $15/hr minimum wage ordinance and Amazon Tax.',
    },
  };

  // ============================================================================
  // 3. 50-STATE POLITICAL GEOGRAPHY & BELLWETHER COUNTIES REGISTRY
  // ============================================================================
  const STATE_POLITICAL_GEOGRAPHY = {
    PA: {
      terrain: 'Classic rust-belt battleground defined by the Philadelphia suburban collar counties against Pittsburgh’s industrial valleys and the conservative T-shaped rural interior.',
      coalitions: 'Working-class union trades, suburban college-educated moderates, rural evangelicals, and Philadelphia Black community.',
      bellwethers: [
        { name: 'Northampton County', seat: 'Easton', profile: 'Lehigh Valley swing bellwether; voted for the presidential winner in almost every election since 1920.' },
        { name: 'Erie County', seat: 'Erie', profile: 'Industrial Great Lakes bellwether where manufacturing shifts and union loyalty decide tight statewide outcomes.' },
        { name: 'Bucks County', seat: 'Doylestown', profile: 'Premier Philadelphia collar county testing suburban moderate resistance and fiscal conservatism.' },
      ],
    },
    WI: {
      terrain: 'Perpetually balanced battleground split between Dane County’s surging progressive university turnout, Milwaukee’s diverse urban base, and conservative WOW suburbs colliding with rural driftless farm counties.',
      coalitions: 'Dairy farm cooperatives, Milwaukee African-American voters, Madison student mobilization, and suburban Waukesha fiscal conservatives.',
      bellwethers: [
        { name: 'Door County', seat: 'Sturgeon Bay', profile: 'The premier statewide barometer; voted for the winner in every presidential race for nearly a century.' },
        { name: 'Kenosha County', seat: 'Kenosha', profile: 'Rust-belt industrial lakefront county caught between suburban commuter growth and traditional union roots.' },
        { name: 'Sauk County', seat: 'Baraboo', profile: 'Southwestern agricultural and small-town hub mirroring the state’s broader rural-suburban divide.' },
      ],
    },
    MI: {
      terrain: 'Industrial battleground anchored by Wayne and Oakland counties in metro Detroit, balanced against West Michigan’s Christian conservative bastion and the northern Upper Peninsula.',
      coalitions: 'UAW auto workers, Macomb County Reagan Democrats, Oakland County educated suburbanites, and Detroit Black voters.',
      bellwethers: [
        { name: 'Saginaw County', seat: 'Saginaw', profile: 'Auto parts manufacturing hub in mid-Michigan; ultra-tight partisan margins mirror state totals.' },
        { name: 'Macomb County', seat: 'Mt. Clemens', profile: 'The birthplace of the "Reagan Democrat"; decisive test of blue-collar industrial populism.' },
        { name: 'Kent County', seat: 'Grand Rapids', profile: 'Rapidly diversifying West Michigan metropolitan county transitioning from classic GOP stronghold to suburban swing.' },
      ],
    },
    AZ: {
      terrain: 'Sunbelt battleground where Maricopa County contains over 60% of the entire state electorate, flanked by progressive Tucson and conservative rural borderlands.',
      coalitions: 'Latino working-class neighborhoods, East Valley suburban professionals, retirees, and Native American sovereign nations.',
      bellwethers: [
        { name: 'Maricopa County', seat: 'Phoenix', profile: 'The mega-county that decides Arizona; shifting political loyalties here dictate statewide margins.' },
        { name: 'Pima County', seat: 'Tucson', profile: 'Progressive university anchor and Hispanic cultural capital providing essential Democratic baseline margins.' },
        { name: 'Pinal County', seat: 'Florence', profile: 'Booming exurban growth corridor reflecting the conservative suburban push against Phoenix density.' },
      ],
    },
    GA: {
      terrain: 'Sunbelt battleground transformed by the booming, diverse Atlanta metropolitan ring, balanced against deep-red north Georgia foothills and the historic rural Black Belt.',
      coalitions: 'Atlanta Black professional and civic leadership, northern suburban college graduates, rural agricultural communities.',
      bellwethers: [
        { name: 'Gwinnett County', seat: 'Lawrenceville', profile: 'Vibrant, racially diverse suburban powerhouse driving Georgia’s modern political realignment.' },
        { name: 'Cobb County', seat: 'Marietta', profile: 'Historic suburban conservative fortress that evolved into an educated swing battleground.' },
        { name: 'Peach County', seat: 'Fort Valley', profile: 'Middle Georgia agricultural bellwether tracking statewide presidential and Senate margins with eerie precision.' },
      ],
    },
    NV: {
      terrain: 'Desert gaming battleground where Clark County (Las Vegas) accounts for nearly three-quarters of all votes, opposed by rural cattle and mining "Cow Counties".',
      coalitions: 'Culinary Union service industry workers, Latino hospitality labor, Washoe suburban independents, and rural mining communities.',
      bellwethers: [
        { name: 'Washoe County', seat: 'Reno', profile: 'Northern Nevada’s decisive purple pivot point; whoever wins Washoe almost invariably captures the state.' },
        { name: 'Clark County', seat: 'Las Vegas', profile: 'High-density union powerhouse requiring high Democratic turnout margins to overcome rural deficits.' },
      ],
    },
    NC: {
      terrain: 'Diverse mid-Atlantic battleground where fast-growing Research Triangle and Charlotte metros compete against heavily rural coastal plains and Appalachian foothills.',
      coalitions: 'Biotech and university professionals, rural Black voters in the eastern belt, and traditional conservative small-town families.',
      bellwethers: [
        { name: 'Nash County', seat: 'Nashville', profile: 'Down-the-middle swing county in eastern North Carolina tracking statewide margins within decimal points.' },
        { name: 'New Hanover County', seat: 'Wilmington', profile: 'Coastal port and university city testing coastal suburban independence and growth dynamics.' },
        { name: 'Wake County', seat: 'Raleigh', profile: 'Explosive Research Triangle growth hub delivering massive turnout margins for progressive statewide candidates.' },
      ],
    },
    FL: {
      terrain: 'Former swing-state titan that has trended decisively conservative, driven by massive domestic retiree migration and rightward shifts in South Florida Hispanic communities.',
      coalitions: 'Cuban-American and Venezuelan-American anti-socialist coalitions, Panhandle conservatives, I-4 corridor suburbanites, and South Florida retirees.',
      bellwethers: [
        { name: 'Pinellas County', seat: 'Clearwater', profile: 'St. Petersburg coastal bellwether; one of the few remaining genuine swing counties on the Gulf Coast.' },
        { name: 'Hillsborough County', seat: 'Tampa', profile: 'Diverse metropolitan heart of the I-4 corridor testing Hispanic working-class and suburban trends.' },
        { name: 'Duval County', seat: 'Jacksonville', profile: 'Consolidated metropolis in northeast Florida displaying growing progressive consolidation.' },
      ],
    },
    OH: {
      terrain: 'Industrial Heartland fortress featuring a trio of Democratic metropolitan anchors (Cleveland, Columbus, Cincinnati) encircled by culturally conservative small towns and Appalachian valleys.',
      coalitions: 'Industrial manufacturing workers, rural agricultural families, suburban corporate corridors, and urban minority communities.',
      bellwethers: [
        { name: 'Ottawa County', seat: 'Port Clinton', profile: 'Lake Erie shoreline bellwether that has mirrored Ohio’s industrial working-class political trajectory.' },
        { name: 'Stark County', seat: 'Canton', profile: 'Hall of Fame city manufacturing hub reflecting working-class shifts throughout eastern Ohio.' },
        { name: 'Wood County', seat: 'Bowling Green', profile: 'Northwestern college and farming county serving as a reliable regional barometer.' },
      ],
    },
    TX: {
      terrain: 'Megastate frontier where booming Democratic metropolitan triangles (Dallas-Fort Worth, Houston, Austin, San Antonio) contest a deeply conservative oil-and-gas interior and shifting Rio Grande Valley.',
      coalitions: 'Suburban corporate professionals, Tejano borderland communities, rural energy workers, and urban minority coalitions.',
      bellwethers: [
        { name: 'Tarrant County', seat: 'Fort Worth', profile: 'Historically the most populous Republican urban county in America, now an intense razor-thin battleground.' },
        { name: 'Williamson County', seat: 'Georgetown', profile: 'Austin high-tech suburban boomtown that flipped from reliable red to competitive purple.' },
        { name: 'Cameron County', seat: 'Brownsville', profile: 'South Texas border anchor illuminating working-class Hispanic trends in energy and border enforcement.' },
      ],
    },
    CA: {
      terrain: 'Progressive coastal powerhouse anchored by the Bay Area and Los Angeles basin, balanced by conservative Central Valley agriculture and rural Shasta/Modoc mountain regions.',
      coalitions: 'Tech industry innovators, Latino and Asian-American coalitions, Hollywood creatives, and Central Valley farmworkers.',
      bellwethers: [
        { name: 'Orange County', seat: 'Santa Ana', profile: 'Historic birthplace of modern conservatism transformed into an educated, diverse suburban battleground.' },
        { name: 'Fresno County', seat: 'Fresno', profile: 'Central Valley agricultural capital balancing rural farming conservatism against urban Hispanic growth.' },
      ],
    },
    NY: {
      terrain: 'Empire State featuring an overwhelming Democratic vote reservoir in New York City, contrasted with culturally moderate Long Island suburbs and conservative upstate rural counties.',
      coalitions: 'Wall Street financial sector, public-sector municipal unions, upstate dairy farmers, and outer-borough immigrant enclaves.',
      bellwethers: [
        { name: 'Nassau County', seat: 'Mineola', profile: 'Wealthy Long Island suburban county testing suburban tax grievances, crime concerns, and swing voter swings.' },
        { name: 'Erie County', seat: 'Buffalo', profile: 'Western New York industrial anchor balancing blue-collar union traditions with upstate fiscal caution.' },
      ],
    },
    CO: {
      terrain: 'Rocky Mountain progressive bastion driven by high-tech Denver suburbs and Boulder academia, balanced by energy-producing Western Slope and agrarian eastern plains.',
      coalitions: 'Outdoor recreation and clean tech professionals, Front Range Hispanic communities, and Western Slope ranchers.',
      bellwethers: [
        { name: 'Jefferson County', seat: 'Golden', profile: 'Denver suburban heavyweight that reliably mirrors Colorado’s statewide outcomes.' },
        { name: 'Pueblo County', seat: 'Pueblo', profile: 'Historic steel city testing Latino blue-collar union loyalties against rising conservative populism.' },
      ],
    },
    VA: {
      terrain: 'Commonwealth battleground shaped by the massive, highly educated federal and defense workforce in Northern Virginia, competing with Richmond, Hampton Roads, and rural Shenandoah/Appalachia.',
      coalitions: 'Federal civil servants and defense contractors, Hampton Roads military families, Black civic leadership, and rural southern farmers.',
      bellwethers: [
        { name: 'Chesterfield County', seat: 'Chesterfield', profile: 'Richmond suburban bellwether whose shifting suburban margins decide Virginia gubernatorial contests.' },
        { name: 'Virginia Beach', seat: 'Virginia Beach', profile: 'Military and resort metropolis in Hampton Roads that swings reliably between major parties.' },
      ],
    },
    MN: {
      terrain: 'Upper Midwest battleground with the longest unbroken Democratic presidential streak in the nation, anchored by Twin Cities metro density versus a sharply conservative Iron Range and farm country.',
      coalitions: 'Twin Cities progressive professionals, Somali and Hmong immigrant communities, Iron Range mining unions, and southern agrarian cooperatives.',
      bellwethers: [
        { name: 'Olmsted County', seat: 'Rochester', profile: 'Mayo Clinic medical research powerhouse testing suburban professional trends.' },
        { name: 'St. Louis County', seat: 'Duluth', profile: 'Historic Iron Range mining capital where blue-collar economic populism clashes with environmental policy.' },
      ],
    },
    NH: {
      terrain: 'Fiercely independent Granite State characterized by low-tax fiscal conservatism, high civic engagement, and sharp primary season scrutiny.',
      coalitions: 'Southern commuter suburbs along the Massachusetts border, Seacoast moderates, and northern libertarian rural communities.',
      bellwethers: [
        { name: 'Hillsborough County', seat: 'Manchester', profile: 'Home to Manchester and Nashua; holds the largest slice of votes and dictates statewide victories.' },
        { name: 'Merrimack County', seat: 'Concord', profile: 'State capital region balancing state government workers with rural conservative towns.' },
      ],
    },
    IA: {
      terrain: 'Agricultural powerhouse that shifted from quintessential swing state to conservative fortress, driven by rural consolidation and evangelical strength.',
      coalitions: 'Corn and soybean farmers, agricultural processing labor, Des Moines suburban corporate hubs, and university enclaves.',
      bellwethers: [
        { name: 'Polk County', seat: 'Des Moines', profile: 'The urban and suburban center of the state; essential for statewide minority party margins.' },
        { name: 'Marshall County', seat: 'Marshalltown', profile: 'Manufacturing and agricultural processing bellwether with a rapidly growing Hispanic workforce.' },
      ],
    },
    ME: {
      terrain: 'Split-electoral-vote northeastern frontier divided between coastal southern Maine (1st CD) and the expansive, working-class rural interior and timberlands (2nd CD).',
      coalitions: 'Portland creative professionals, coastal lobstermen, northern paper mill workers, and independent libertarian voters.',
      bellwethers: [
        { name: 'Kennebec County', seat: 'Augusta', profile: 'Central Maine capital county that frequently mirrors the state’s unified general election vote.' },
        { name: 'Aroostook County', seat: 'Houlton', profile: 'Northern timber and potato farming county tracking blue-collar populist shifts in the 2nd Congressional District.' },
      ],
    },
    AK: {
      terrain: 'Frontier wilderness state with nonpartisan independent streak, high veteran density, powerful Native regional corporations, and resource-dependent oil economy.',
      coalitions: 'Alaska Native regional corporations, oil and gas sector employees, commercial fishing fleets, and Mat-Su conservative retirees.',
      bellwethers: [
        { name: 'Anchorage Municipality', seat: 'Anchorage', profile: 'Contains over 40% of the state’s population; moderates here decide competitive ranked-choice elections.' },
        { name: 'Matanuska-Susitna Borough', seat: 'Palmer', profile: 'Fast-growing conservative redoubt providing overwhelming margins for populist candidates.' },
      ],
    },
  };

  // Generic fallback generator for states not explicitly mapped above
  function getStatePoliticalGeography(stateId) {
    if (STATE_POLITICAL_GEOGRAPHY[stateId]) return STATE_POLITICAL_GEOGRAPHY[stateId];
    return {
      terrain: `Statewide political terrain characterized by competing municipal urban cores, commuter suburban belts, and rural agricultural precinct networks.`,
      coalitions: `Local civic organizations, business chambers, small-town trade councils, and regional cultural voting blocs.`,
      bellwethers: [
        { name: 'Central Metropolitan County', seat: 'Capital Core', profile: 'High-density urban and suburban population center driving voter turnout volume.' },
        { name: 'Industrial Valley County', seat: 'Manufacturing Hub', profile: 'Working-class regional center reflecting economic shifts and trade sentiment.' },
      ],
    };
  }

  // ============================================================================
  // 4. DYNAMIC CABLE NEWS CHYRON & EDITORIAL WIRE REGISTRY (100+ HEADLINES)
  // ============================================================================
  const CABLE_NEWS_CHYRON_REGISTRY = {
    breaking_national: [
      'BREAKING NEWS: Labor Department jobs report exceeds estimates; White House cites manufacturing resilience as markets rally.',
      'DEVELOPING NOW: Federal Reserve signals steady rate posture; congressional committees clash over deficit projections.',
      'JUST IN: Supreme Court issues landmark federalism ruling; state attorneys general announce coordinated legal challenges.',
      'CAPITOL HILL SCOOP: Bipartisan Senate working group drafts compromise emergency infrastructure framework ahead of deadline.',
      'WHITE HOUSE BRIEFING: National Security Advisor warns of escalating geopolitical supply chain tensions.',
      'THE SITUATION ROOM: Consumer confidence index climbs to 18-month high; holiday retail forecasts project strong growth.',
      'NEWS ALERT: Department of Energy announces major domestic battery grid grants in industrial battlegrounds.',
      'SPECIAL REPORT: Congressional Budget Office releases 10-year fiscal outlook; debt ceiling debate intensifies.',
      'INSIDE POLITICS: New national poll reveals independent voters prioritizing cost-of-living and governmental transparency.',
      'LIVE DESK: Defense appropriations bill clears House committee after marathon overnight markup session.',
      'BREAKING: Census Bureau releases updated metropolitan migration data; Sunbelt states gain congressional apportionment leverage.',
      'THE LEAD: Federal regulators announce sweeping inquiry into algorithmic prescription drug pricing practices.',
      'NATIONWIDE BULLETIN: Small business federation optimism survey shows cautious expansion amid steady wage growth.',
      'BREAKING REPORT: Governors from both parties convene emergency regional water compact summit in the Rockies.',
      'NEWS FLASH: Record voter registration surges reported across 12 battleground states ahead of primary deadlines.',
      'MORNING WIRE: Network anchors debate whether macroeconomic trends favor the incumbent governing coalition.',
      'DEVELOPING: Clean energy manufacturing consortium announces $4B factory investment in the Midwest rust belt.',
      'SPECIAL BULLETIN: Agriculture Department reports record harvest yields; farm state lawmakers push crop insurance updates.',
    ],

    faction_drama: [
      'COALITION CRISIS: Progressive caucus leaders threaten procedural revolt unless platform environmental mandates are restored.',
      'SMOKE-FILLED ROOM: Behind closed doors at the national party retreat, institutional moderates push back on primary challenges.',
      'FACTION WAR: Traditional conservative caucuses issue blistering rebuke against populist insurgents in joint press release.',
      'PRIMARY DRAMA: Grassroots insurgent mounts fiery rally; claims party establishment is suppressing ballot petition signatures.',
      'IDEOLOGICAL SHOWDOWN: Big-tent party leaders scramble to mediate bitter public rift between labor stalwarts and tech donors.',
      'PARTY CRACKDOWN: Chair reportedly warns rebel faction that repeated floor defections will result in committee stripped assignments.',
      'HOT MIC MOMENT: Prominent caucus chair overheard questioning leadership competence during closed-door fundraising breakfast.',
      'GRASSROOTS REVOLT: County party chapters pass unanimous resolution demanding party chair sign enforceable policy pledge.',
      'SECRET SUMMIT: Disaffected party elders meet at private Washington dinner to discuss succession and platform direction.',
      'FACTION ULTIMATUM: Purist wing sets 48-hour deadline for national committee to guarantee prime-time convention keynote.',
      'INTERNAL MEMO LEAK: Strategists warn party leadership that suburban moderates are alienating working-class base voters.',
      'COALITION FRACTURE: Rural lawmakers threaten to form independent legislative caucus unless agricultural priorities are funded.',
      'DELEGATE DISPUTE: Battle looms over state convention rules as rival factions dispute credentials of newly seated slates.',
      'BACKROOM PRESSURE: Senior senator summons warring faction chairs for late-night cloakroom peace talks.',
      'DONOR BOYCOTT: Major donor network pauses disbursements until leadership clarifies doctrinal dispute with rebel caucus.',
      'CIVIL WAR AVERTED?: Party chair announces tentative coalition agreement following grueling 14-hour summit.',
      'THE RECKONING: Dissident lawmakers host rival press conference; declare the current party machine out of touch with the base.',
      'RED LINE DRAWN: Faith-and-flag delegates warn leadership that compromise on signature social plank will trigger a walkout.',
    ],

    campaign_trail: [
      'ON THE TRAIL: Candidate bus tour sweeps through industrial Pennsylvania; rallies draw thunderous overflow crowds at union halls.',
      'DEBATE SPOTLIGHT: Fact-checkers scrutinize heated exchange over healthcare subsidies during live televised broadcast.',
      'GROUND WAR: Field directors dispatch 2,000 precinct canvassers across Milwaukee and Green Bay in massive weekend GOTV blitz.',
      'SURROGATE BLITZ: High-profile governor headlines raucous college campus rally; urges youth cohort to register early.',
      'AD WARS: Campaigns flood Phoenix airwaves with dueling $5M ad buys targeting independent suburban women.',
      'RETAIL POLITICS: Candidate serves pancakes at legendary New Hampshire diner; fields unscripted grilling from local voters.',
      'TOWN HALL CLASH: Fiery confrontation erupts at rural forum over water rights and federal grazing permits.',
      'DIGITAL VIRALITY: Candidate’s witty retort at state fair corn dog stand racks up 15 million views across social platforms.',
      'CAMPAIGN SHAKEUP: Struggling challenger replaces veteran campaign manager with aggressive digital communications operative.',
      'BATTLEGROUND SPRINT: Five statewide contenders descend on Atlanta airport hotel for high-stakes donor breakfast.',
      'POLLING SURGE: Fresh gold-standard poll shows race narrowing to dead heat inside the statistical margin of error.',
      'GAFFE WATCH: Campaign spokespeople scramble to clarify candidate’s off-the-cuff remarks on regional defense spending.',
      'GRASSROOTS MOMENTUM: Over 10,000 small-dollar donors contribute in 24 hours following explosive debate performance.',
      'MARATHON CANVASS: Candidate pledges to visit all 99 Iowa county courthouses before the close of early voting.',
      'HIGH-STAKES PITCH: Contender makes direct economic appeal to auto parts workers outside factory gates in Flint.',
      'CLOSING ARGUMENT: Final campaign television ads hit the airwaves; tone shifts from policy debate to character contrast.',
      'WAR ROOM DISPATCH: Field organizers report record door-knock completion rates in Las Vegas culinary precincts.',
      'ENDORSEMENT COUP: Beloved former NFL coach endorses Senate hopeful at packed Friday night football rally in Alabama.',
    ],

    super_pac_wars: [
      'MONEY IN POLITICS: Independent expenditure Super PAC books $12M broadcast ad flight attacking rival judicial record.',
      'SWING PAC SURPRISE: Veterans-First PAC officially endorses moderate challenger; pledges multi-state digital airtime blitz.',
      'DARK MONEY CONTROVERSY: Good-governance watchdog files FEC complaint over alleged illegal Super PAC coordination.',
      'AIRWAVES SATURATION: Viewers in Charlotte report receiving 18 campaign ads during a single 30-minute evening newscast.',
      'MEGA-DONOR INFUSION: Tech billionaire transfers $25M check to affiliated independent expenditure committee.',
      'PAC SPLIT: Competing conservative Super PACs back rival candidates in bitter open-seat Senate primary brawl.',
      'GRASSROOTS COUNTER-ATTACK: Campaign releases fiery video condemning out-of-state Super PAC smear attacks.',
      'MEDIA MARKET CRISIS: Local television stations in Madison and Reno declare ad inventory completely sold out.',
      'STRATEGIC SHIFT: Super PAC pulls advertising from non-competitive territory to double down on must-win rust-belt battleground.',
      'INDEPENDENT EXPENDITURE: Clean Water Action Fund unleashes scathing billboard campaign along interstate corridors.',
      'FINANCIAL DISCLOSURE: Quarterly FEC filings reveal record-shattering $250M total warchest across competing PAC networks.',
      'SHADOW CAMPAIGN: Political analysts observe independent PACs spending more on field mobilization than candidate committees.',
      'PAC RETALIATION: Allied Super PAC launches devastating rapid-response ads within two hours of rival attack.',
      'THE MONEY TRAIL: Investigative report maps network of corporate conduits funding multi-state ballot measure campaigns.',
      'WARCHEST DEPLETION: Minor-party fledgling PAC struggles to match broadcast rates amid skyrocketing commercial airtime costs.',
      'PAC ALLIANCE STRAIN: Super PAC board reportedly threatens to withhold airtime support following candidate policy pivot.',
    ],

    statewide_frontlines: [
      'STATE CAPITOL SHOWDOWN: Partisan legislative standoff paralyzes state budget negotiations as midnight deadline looms.',
      'ATTORNEY GENERAL INQUIRY: State AG launches sweeping probe into utility rate hikes and corporate lobbying disclosures.',
      'GOVERNOR VETO: State executive issues stinging veto of legislative redistricting plan; calls emergency special session.',
      'STATEHOUSE UPSET: Grassroots challenger unseats 16-year veteran committee chair in suburban state house primary.',
      'SUPREME COURT WATCH: State high court agrees to hear expedited challenge regarding mail-in ballot cure procedures.',
      'BALLOT ACCESS BATTLE: Secretary of State certifies third-party petitions after tense recount of signature affidavits.',
      'SPECIAL ELECTION SENSATION: Dramatic swing in state senate seat sends shockwaves through legislative majority.',
      'TRIFECTA AMBITIONS: Party chair declares 5-state legislative contestation push the centerpiece of long-term strategy.',
      'CAPITOL CORRIDORS: State lawmakers pass historic bipartisan rural broadband funding measure amid standing ovations.',
      'EXECUTIVE CONTROVERSY: State treasurer faces scrutiny over state pension fund investments in private equity ventures.',
      'LEGISLATIVE GRIDLOCK: Minority caucus walks out of chamber to deny legislative quorum on controversial regulatory bill.',
      'STATE OF THE STATE: Governor delivers ambitious policy address; outlines $2B tax cut and teacher salary increases.',
      'GRASSROOTS FARM TEAM: Statehouse standout lawmakers tipped as prime recruits for upcoming federal congressional races.',
      'AUDITOR GENERAL AUDIT: Blistering investigative report reveals millions in misallocated state procurement contracts.',
      'REDISTRICTING RULING: Federal panel orders state to draw additional competitive minority-opportunity congressional district.',
    ],

    third_party_surge: [
      'THIRD-FORCE RISING: Minor party crosses statutory signature threshold to secure official ballot line in 48 states.',
      'DEBATE EXCLUSION LAWSUIT: Third-party presidential ticket files federal injunction seeking podium access at debates.',
      'SPOILER DEBATE: Pundits argue whether surging independent bid threatens major-party margins in critical swing states.',
      'HISTORIC ASCENT: Minor party attains Recognized Contender Tier status following breakthrough statehouse seat wins.',
      'FUSION BALLOT PUSH: Reform advocates petition state legislatures to permit multi-party cross-nomination fusion lines.',
      'KINGMAKER SCENARIO: Narrow legislative split positions three independent lawmakers to dictate control of the state house.',
      'MMP REFORM MOVEMENT: Grassroots citizen initiative advocating proportional representation gathers 250,000 signatures.',
      'CENTRIST CRACK-UP: Former governors from both parties launch independent civic renewal movement at national press club.',
      'BALLOT STRUGGLE: Minor party volunteers celebrate round-the-clock signature drive outside county election board.',
      'POLLING ANOMALY: New survey finds 22% of young voters willing to abandon traditional duopoly parties this cycle.',
      'DISMISSIVE BLOWBACK: Major party establishment spokespeople label third-party contenders as tactical distractions.',
      'COALITION ACCORD: Minor party signs historic confidence-and-supply agreement with governing legislative majority.',
      'INDEPENDENT THREAT: High-profile business executive hints at self-funded independent presidential campaign.',
      'PETITION CHALLENGE: Major party attorneys file 4,000-page objection challenging signatures on independent ballot petitions.',
      'BALLOT VICTORY: State supreme court orders secretary of state to place independent ticket on November ballot.',
    ],
  };

  // ============================================================================
  // 5. HELPER FUNCTIONS & PROCEDURAL GENERATORS
  // ============================================================================

  /**
   * Derives or generates an authentic biographical profile for any politician.
   */
  function getPoliticianBio(member, seed = 2028, year = 2028) {
    if (!member) return null;
    const name = member.name || member.id;
    if (POLITICIAN_BIOS_REGISTRY[name]) {
      return POLITICIAN_BIOS_REGISTRY[name];
    }

    // Procedural generation for dynamic candidates and statehouse standouts
    const stateId = member.stateId || member.state || 'PA';
    const stateGeo = getStatePoliticalGeography(stateId);
    const office = member.office || 'house';
    const traits = Array.isArray(member.traits) ? member.traits : [];

    // Derive authentic hometown from state geography
    const hometowns = {
      PA: ['Allentown', 'Bethlehem', 'Lancaster', 'Scranton', 'Reading', 'Altoona', 'State College', 'Norristown'],
      OH: ['Canton', 'Akron', 'Dayton', 'Parma', 'Youngstown', 'Findlay', 'Springfield', 'Mansfield'],
      MI: ['Kalamazoo', 'Traverse City', 'Saginaw', 'Dearborn', 'Troy', 'Muskegon', 'Battle Creek', 'Bay City'],
      WI: ['Appleton', 'Oshkosh', 'Eau Claire', 'Janesville', 'Wausau', 'La Crosse', 'Sheboygan', 'Beloit'],
      AZ: ['Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Flagstaff', 'Yuma', 'Prescott'],
      GA: ['Augusta', 'Columbus', 'Macon', 'Athens', 'Sandy Springs', 'Roswell', 'Albany', 'Valdosta'],
      NC: ['Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Asheville', 'Gastonia', 'Concord'],
      FL: ['Tallahassee', 'St. Petersburg', 'Hialeah', 'Gainesville', 'Pensacola', 'Sarasota', 'Ocala', 'Naples'],
      TX: ['Lubbock', 'Amarillo', 'Waco', 'Abilene', 'Beaumont', 'Tyler', 'Midland', 'San Angelo'],
      CA: ['Bakersfield', 'Modesto', 'Stockton', 'Chula Vista', 'Irvine', 'Fremont', 'San Bernardino', 'Santa Rosa'],
      NY: ['Syracuse', 'Albany', 'Yonkers', 'Utica', 'Binghamton', 'White Plains', 'Ithaca', 'Saratoga Springs'],
    };
    const pool = hometowns[stateId] || ['Springfield', 'Oakwood', 'Fairview', 'Riverside', 'Franklin', 'Clinton', 'Greenville', 'Salem'];
    const hNum = Math.abs((name.split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0), 0) + (member.birthYear || 1975)) % pool.length);
    const hometown = `${pool[hNum]}, ${stateId}`;

    // Derive alma mater
    const colleges = {
      PA: ['Penn State University', 'University of Pennsylvania', 'Temple University', 'University of Pittsburgh', 'Villanova University'],
      OH: ['Ohio State University', 'Ohio University', 'Miami University', 'Case Western Reserve', 'University of Cincinnati'],
      MI: ['University of Michigan', 'Michigan State University', 'Wayne State University', 'Western Michigan University'],
      WI: ['University of Wisconsin-Madison', 'Marquette University', 'UW-Milwaukee', 'UW-La Crosse'],
      AZ: ['Arizona State University', 'University of Arizona', 'Northern Arizona University'],
      GA: ['University of Georgia', 'Georgia Tech', 'Georgia State University', 'Emory University'],
      NC: ['UNC Chapel Hill', 'Duke University', 'NC State University', 'Wake Forest University'],
      FL: ['University of Florida', 'Florida State University', 'University of Miami', 'UCF'],
      TX: ['University of Texas at Austin', 'Texas A&M University', 'Baylor University', 'Texas Tech University'],
      CA: ['UC Berkeley', 'UCLA', 'Stanford University', 'USC', 'UC Davis'],
      NY: ['Columbia University', 'Cornell University', 'NYU', 'SUNY Binghamton', 'Syracuse University'],
    };
    const cPool = colleges[stateId] || ['State University', 'Regional College of Law', 'Metropolitan State College', 'Polytechnic Institute'];
    const cNum = Math.abs((hNum * 3 + (member.quality || 5)) % cPool.length);
    const almaMater = `${cPool[cNum]} (${member.quality >= 7 ? 'JD / MPA' : 'BA / BS'})`;

    // Derive career from traits
    let career = 'Attorney & Local Civic Board Member';
    if (traits.includes('Military Veteran')) career = 'U.S. Armed Forces Officer & Defense Logistics Consultant';
    else if (traits.includes('Union Stalwart')) career = 'Trade Union Business Representative & Labor Council Organizer';
    else if (traits.includes('Prosecutorial Edge')) career = 'County Deputy District Attorney & Special Prosecutor';
    else if (traits.includes('Self-Made Entrepreneur')) career = 'Commercial Contractor & Regional Chamber of Commerce Director';
    else if (traits.includes('Academic Theorist')) career = 'Adjunct Professor of Constitutional Law & Public Policy Fellow';
    else if (traits.includes('Small-Town Pillar')) career = 'Community Bank Vice President & Rotary Club President';
    else if (traits.includes('Grassroots Organizer')) career = 'Field Campaign Director & Civic Voter Mobilization Lead';
    else if (traits.includes('Statehouse Alum')) career = 'Former State Legislative Whip & Municipal Council Member';

    // Derive signature milestone
    const milestones = [
      `Spearheaded regional workforce development legislation expanding vocational apprenticeships across ${stateId}.`,
      `Championed state regulatory modernization and small business tax relief as committee vice chair.`,
      `Authored bipartisan legislation fortifying emergency disaster infrastructure and municipal flood control.`,
      `Rose to statewide prominence following decisive leadership on consumer protection and utility oversight.`,
      `Built an acclaimed non-profit community health initiative delivering preventative clinic services to rural counties.`,
      `Negotiated landmark cross-party compromise on judicial ethics reform and public records transparency.`,
    ];
    const mNum = Math.abs((hNum * 7 + (member.fame || 30)) % milestones.length);
    const milestone = milestones[mNum];

    return { hometown, almaMater, career, milestone };
  }

  /**
   * Picks a dynamic, context-aware cable news chyron based on active game state.
   */
  function getDynamicCableNewsChyron(game) {
    if (!game) return CABLE_NEWS_CHYRON_REGISTRY.breaking_national[0];
    const seed = (game.seed || 2028) + (game.year || 2028) + (game.chairTurn || 0) + (game.organizingActionsRemaining || 0);

    let category = 'breaking_national';
    if (game.phase === 'presidential-primary') {
      category = 'campaign_trail';
    } else if (game.phase === 'general-campaign' || game.campaign?.active) {
      const roll = seed % 3;
      category = roll === 0 ? 'campaign_trail' : roll === 1 ? 'super_pac_wars' : 'breaking_national';
    } else if (game.sittingMemberHappiness && game.sittingMemberHappiness < 55) {
      category = 'faction_drama';
    } else if (game.player && !['people', 'heritage'].includes(game.player.baseTemplateId)) {
      category = (seed % 2 === 0) ? 'third_party_surge' : 'statewide_frontlines';
    } else {
      const cats = ['breaking_national', 'faction_drama', 'campaign_trail', 'statewide_frontlines'];
      category = cats[seed % cats.length];
    }

    const items = CABLE_NEWS_CHYRON_REGISTRY[category] || CABLE_NEWS_CHYRON_REGISTRY.breaking_national;
    const index = Math.abs(seed) % items.length;
    return {
      category,
      categoryLabel: category.toUpperCase().replace(/_/g, ' '),
      headline: items[index],
    };
  }

  // ============================================================================
  // 6. ATTACH TO GLOBAL PARTY CHAIR DATA REGISTRY
  // ============================================================================
  const PoliticalTexture = {
    EXPANDED_POLITICIAN_TRAITS_REGISTRY,
    ALL_POLITICIAN_TRAIT_NAMES,
    POLITICIAN_BIOS_REGISTRY,
    STATE_POLITICAL_GEOGRAPHY,
    CABLE_NEWS_CHYRON_REGISTRY,
    getStatePoliticalGeography,
    getPoliticianBio,
    getDynamicCableNewsChyron,
  };

  if (typeof window !== 'undefined') {
    window.PartyChairData = window.PartyChairData || {};
    Object.assign(window.PartyChairData, PoliticalTexture);
    window.PoliticalTexture = PoliticalTexture;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PoliticalTexture;
  }
})();
