/**
 * political-trends-system.js
 * 
 * Manages:
 * 1. Independent Caucus Exceptions (Bernie Sanders & Angus King ruleset):
 *    - Independent characters who aren't controlled by the Democratic Party machine.
 *    - Count toward Democratic Senate chamber majority/plurality.
 *    - Colored aquamarine green (#1abc9c) on Senate maps.
 *    - Specific retirement / re-election timetables (Sanders retires 2030; King runs in 2030, retires 2036).
 * 2. Political Trends Framework:
 *    - Extensible architecture reserved for Version 0.15+ to dynamically spawn exceptions,
 *      independent caucus alliances, and shifting multi-cycle political movements.
 */

(() => {
  const INDEPENDENT_CAUCUS_EXCEPTIONS = [
    {
      id: 'sanders-vt-1',
      memberId: 'senate:VT:class-1',
      name: 'Bernie Sanders',
      stateId: 'VT',
      senateClass: 1,
      party: 'independent',
      rawParty: 'I',
      caucus: 'people',
      isPartyControlled: false,
      mapColor: '#1abc9c', // Aquamarine green
      electionYear: 2024,
      retiresYear: 2030, // Steps down at the end of current term
      reelectionYears: [],
      rulesSummary: 'Autonomous Independent caucusing with Democrats; colored aquamarine green on maps; steps down at end of current term in 2030.'
    },
    {
      id: 'king-me-1',
      memberId: 'senate:ME:class-1',
      name: 'Angus King',
      stateId: 'ME',
      senateClass: 1,
      party: 'independent',
      rawParty: 'I',
      caucus: 'people',
      isPartyControlled: false,
      mapColor: '#1abc9c', // Aquamarine green
      electionYear: 2024,
      retiresYear: 2036, // Steps down after 2030-2036 term
      reelectionYears: [2030], // Runs for re-election in 2030
      rulesSummary: 'Autonomous Independent caucusing with Democrats; colored aquamarine green on maps; runs for re-election in 2030, then steps down in 2036.'
    }
  ];

  function getIndependentException(memberOrId) {
    if (!memberOrId) return null;
    const id = typeof memberOrId === 'string' ? memberOrId : (memberOrId.id || memberOrId.sittingId);
    const name = typeof memberOrId === 'object' ? memberOrId.name : null;
    return INDEPENDENT_CAUCUS_EXCEPTIONS.find((e) => e.memberId === id || (name && e.name.toLowerCase() === name.toLowerCase())) || null;
  }

  function isIndependentCaucusException(memberOrId) {
    return Boolean(getIndependentException(memberOrId));
  }

  function getIndependentMapColor(memberOrId) {
    const exc = getIndependentException(memberOrId);
    return exc ? exc.mapColor : null;
  }

  function shouldMemberRetire(memberOrId, currentYear) {
    const exc = getIndependentException(memberOrId);
    if (!exc) return false;
    return currentYear >= exc.retiresYear;
  }

  function shouldMemberRunReelection(memberOrId, currentYear) {
    const exc = getIndependentException(memberOrId);
    if (!exc) return false;
    return (exc.reelectionYears || []).includes(currentYear);
  }

  // Future-proof Political Trends Framework (v0.15+ hook)
  const POLITICAL_TRENDS_FRAMEWORK = {
    versionReady: '0.15',
    archetypes: [
      {
        id: 'independent-caucus-partner',
        name: 'Autonomous Independent Partner',
        description: 'Officeholders who maintain distinct non-party branding but caucus with a major party for chamber power (replicating Sanders/King).',
        mapColor: '#1abc9c',
        partyControlled: false
      },
      {
        id: 'breakaway-maverick',
        name: 'Breakaway Maverick',
        description: 'Incumbents who break away from their national party due to severe factional friction or regional divergence.',
        partyControlled: false
      },
      {
        id: 'regional-splinter-bloc',
        name: 'Regional Splinter Movement',
        description: 'Independent political movements capturing localized legislative or federal seats.',
        partyControlled: false
      }
    ],
    activeTrends: [],
    // Method hook for future cycle simulations
    evaluateTrendsForCycle(game, cycleYear) {
      // Reserved for Version 0.15+ execution
      return [];
    }
  };

  // Export to PartyChairData
  window.PartyChairData = window.PartyChairData || {};
  window.PartyChairData.INDEPENDENT_CAUCUS_EXCEPTIONS = INDEPENDENT_CAUCUS_EXCEPTIONS;
  window.PartyChairData.POLITICAL_TRENDS_FRAMEWORK = POLITICAL_TRENDS_FRAMEWORK;
  window.PartyChairData.getIndependentException = getIndependentException;
  window.PartyChairData.isIndependentCaucusException = isIndependentCaucusException;
  window.PartyChairData.getIndependentMapColor = getIndependentMapColor;
  window.PartyChairData.shouldMemberRetire = shouldMemberRetire;
  window.PartyChairData.shouldMemberRunReelection = shouldMemberRunReelection;
})();
