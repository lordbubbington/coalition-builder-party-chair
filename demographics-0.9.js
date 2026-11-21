// Coalition Builder: Party Chair — Demographic Electorate Model
// Census CVAP demographic breakdowns, group-level elasticity, and baseline party affiliations.

(function PartyChairDemographicsModule() {
  const DEFAULT_GROUPS = [
    {
      id: 'white',
      name: 'White',
      cvapPercent: 65,
      swingElasticity: 1.45,
      baselinePartyShare: { people: 40, heritage: 52, independent: 8 },
      issuePriorities: [
        { issueId: 'cost-of-living', weight: 1.2 },
        { issueId: 'taxes-spending', weight: 1.1 },
        { issueId: 'border-enforcement', weight: 1.0 },
      ],
    },
    {
      id: 'black',
      name: 'Black',
      cvapPercent: 13,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 82, heritage: 11, independent: 7 },
      issuePriorities: [
        { issueId: 'racial-equity', weight: 1.3 },
        { issueId: 'criminal-justice-reform', weight: 1.2 },
        { issueId: 'voting-rules', weight: 1.1 },
      ],
    },
    {
      id: 'hispanic',
      name: 'Hispanic / Latino',
      cvapPercent: 14,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 56, heritage: 36, independent: 8 },
      issuePriorities: [
        { issueId: 'cost-of-living', weight: 1.2 },
        { issueId: 'immigration-visas', weight: 1.2 },
        { issueId: 'minimum-wage', weight: 1.0 },
      ],
    },
    {
      id: 'asian',
      name: 'Asian',
      cvapPercent: 5,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 60, heritage: 33, independent: 7 },
      issuePriorities: [
        { issueId: 'business-regulation', weight: 1.2 },
        { issueId: 'taxes-spending', weight: 1.1 },
        { issueId: 'health-coverage', weight: 1.0 },
      ],
    },
    {
      id: 'native',
      name: 'Native American',
      cvapPercent: 1,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 58, heritage: 34, independent: 8 },
      issuePriorities: [
        { issueId: 'state-federal', weight: 1.3 },
        { issueId: 'health-coverage', weight: 1.1 },
        { issueId: 'climate-action', weight: 1.0 },
      ],
    },
    {
      id: 'multiracial',
      name: 'Multiracial',
      cvapPercent: 2,
      swingElasticity: 1.0,
      baselinePartyShare: { people: 62, heritage: 30, independent: 8 },
      issuePriorities: [
        { issueId: 'climate-action', weight: 1.2 },
        { issueId: 'lgbtq-policy', weight: 1.1 },
        { issueId: 'voting-rules', weight: 1.0 },
      ],
    },
  ];

  function buildById(groups) {
    return Object.fromEntries(groups.map((g) => [g.id, { ...g }]));
  }

  function cloneDefaultDemographicConfig() {
    const groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
    return {
      version: '0.10',
      description: 'Census CVAP demographic electorate model with group-specific voting elasticity and baseline leanings.',
      groups,
      byId: buildById(groups),
      nationalCvapShares: {
        white: 0.65,
        hispanic: 0.14,
        black: 0.13,
        asian: 0.05,
        nativeAmerican: 0.01,
        multiracial: 0.02,
      },
      elasticityMultipliers: {
        white: 1.45,
        hispanic: 1.15,
        black: 0.75,
        asian: 1.10,
        nativeAmerican: 1.05,
        multiracial: 1.20,
      },
      groupBaselines: {
        white: { people: 40, heritage: 52, independent: 38, liberty: 3, green: 1, other: 4 },
        black: { people: 82, heritage: 11, independent: 24, liberty: 1, green: 2, other: 4 },
        hispanic: { people: 56, heritage: 36, independent: 34, liberty: 2, green: 2, other: 4 },
        asian: { people: 60, heritage: 33, independent: 35, liberty: 2, green: 2, other: 3 },
        nativeAmerican: { people: 58, heritage: 34, independent: 30, liberty: 3, green: 3, other: 2 },
        multiracial: { people: 62, heritage: 30, independent: 38, liberty: 3, green: 3, other: 2 },
      },
      groupPriorities: {
        white: ['cost-of-living', 'taxes-spending', 'border-enforcement', 'business-regulation'],
        black: ['racial-equity', 'criminal-justice-reform', 'voting-rules', 'health-coverage', 'minimum-wage'],
        hispanic: ['cost-of-living', 'immigration-visas', 'health-coverage', 'minimum-wage'],
        asian: ['business-regulation', 'taxes-spending', 'health-coverage'],
        nativeAmerican: ['state-federal', 'health-coverage', 'climate-action'],
        multiracial: ['climate-action', 'lgbtq-policy', 'voting-rules'],
      },
      cloneDefaultDemographicConfig,
      updateGroupAffiliationShare,
    };
  }

  function updateGroupAffiliationShare(config, groupId, partyId, value) {
    const next = JSON.parse(JSON.stringify(config));
    const targetGroup = next.groups.find((g) => g.id === groupId);
    if (!targetGroup) return next;
    const clampedVal = Math.max(0, Math.min(100, Number(value) || 0));
    const otherParties = Object.keys(targetGroup.baselinePartyShare).filter((p) => p !== partyId);
    const otherTotal = otherParties.reduce((sum, p) => sum + (targetGroup.baselinePartyShare[p] || 0), 0);
    const remaining = Math.max(0, 100 - clampedVal);
    targetGroup.baselinePartyShare[partyId] = clampedVal;
    if (otherTotal > 0) {
      otherParties.forEach((p) => {
        targetGroup.baselinePartyShare[p] = Math.round((targetGroup.baselinePartyShare[p] / otherTotal) * remaining * 10) / 10;
      });
      const currentSum = Object.values(targetGroup.baselinePartyShare).reduce((a, b) => a + b, 0);
      const diff = 100 - currentSum;
      if (otherParties.length > 0) {
        targetGroup.baselinePartyShare[otherParties[0]] = Math.round((targetGroup.baselinePartyShare[otherParties[0]] + diff) * 10) / 10;
      }
    } else {
      const split = remaining / (otherParties.length || 1);
      otherParties.forEach((p) => {
        targetGroup.baselinePartyShare[p] = split;
      });
    }
    next.byId = buildById(next.groups);
    next.cloneDefaultDemographicConfig = cloneDefaultDemographicConfig;
    next.updateGroupAffiliationShare = updateGroupAffiliationShare;
    return next;
  }

  const DEMOGRAPHIC_CONFIG = cloneDefaultDemographicConfig();

  window.PartyChairData = window.PartyChairData || {};
  window.PartyChairData.DEMOGRAPHIC_CONFIG = DEMOGRAPHIC_CONFIG;
})();