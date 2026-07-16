export const defaultMerchants = [
  {
    id: 'm1',
    name: 'Acme Corp',
    planTier: 'Enterprise',
    daysSinceLastLogin: 2,
    apiErrorRate: 0.1,
    openSupportTickets: 0,
    monthlyRevenue: 5000,
  },
  {
    id: 'm2',
    name: 'Globex Inc',
    planTier: 'Pro',
    daysSinceLastLogin: 21,
    apiErrorRate: 0.5,
    openSupportTickets: 1,
    monthlyRevenue: 1500,
  },
  {
    id: 'm3',
    name: 'Soylent Corp',
    planTier: 'Startup',
    daysSinceLastLogin: 14, // Exact boundary condition test
    apiErrorRate: 8.2,
    openSupportTickets: 0,
    monthlyRevenue: 250,
  },
  {
    id: 'm4',
    name: 'Initech',
    planTier: 'Pro',
    daysSinceLastLogin: 3,
    apiErrorRate: 1.2,
    openSupportTickets: 4, // Exceeds threshold
    monthlyRevenue: 2000,
  },
  {
    id: 'm5',
    name: 'Umbrella Corp',
    planTier: 'Enterprise',
    daysSinceLastLogin: 45, // 3 signals total
    apiErrorRate: 12.5,
    openSupportTickets: 5,
    monthlyRevenue: 8500,
  },
  {
    id: 'm6',
    name: 'Wayne Enterprises',
    planTier: 'Enterprise',
    daysSinceLastLogin: 1,
    apiErrorRate: 0,
    openSupportTickets: 0,
    monthlyRevenue: 10000,
  }
];

export function analyzeMerchant(merchant) {
  const signals = [];
  
  // Edge Case: Boundaries. Using >= 14 instead of > 14 so it triggers exactly on day 14.
  if (merchant.daysSinceLastLogin >= 14) {
    signals.push({ type: 'engagement', description: `No login for ${merchant.daysSinceLastLogin} days` });
  }
  
  if (merchant.apiErrorRate >= 5.0) {
    signals.push({ type: 'technical', description: `High API error rate (${merchant.apiErrorRate}%)` });
  }
  
  if (merchant.openSupportTickets >= 3) {
    signals.push({ type: 'support', description: `${merchant.openSupportTickets} open support tickets` });
  }
  
  let riskLevel = 'Safe';
  if (signals.length >= 2) {
    riskLevel = 'High';
  } else if (signals.length === 1) {
    riskLevel = 'Medium';
  }
  
  // Edge Case: Handling Multi-signal actions.
  // Instead of just picking the first one, we combine them.
  let recommendedActions = [];
  
  if (riskLevel === 'Safe') {
    recommendedActions.push('None required. Monitor normally.');
  } else {
    if (riskLevel === 'High') {
      recommendedActions.push('Immediate CSM Intervention - Schedule rescue call.');
    }
    
    // Add specific tactical actions for each triggered signal
    signals.forEach(signal => {
      if (signal.type === 'engagement') recommendedActions.push('Send re-engagement email.');
      if (signal.type === 'technical') recommendedActions.push('Flag to Tech Support.');
      if (signal.type === 'support') recommendedActions.push('Bump tickets to P1.');
    });
  }
  
  return {
    ...merchant,
    signals,
    riskLevel,
    recommendedAction: recommendedActions.join(' ')
  };
}
