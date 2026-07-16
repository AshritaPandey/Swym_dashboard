# v1 Specification Document: Merchant Churn Dashboard

## 1. The Merchant Record Shape (Data Model)
The dashboard will track the health of various merchants using a specific data structure. Each merchant record will contain:
- `id` (string): Unique identifier.
- `name` (string): Company name.
- `planTier` (string): 'Startup', 'Pro', or 'Enterprise'.
- `daysSinceLastLogin` (number): Days since someone from the merchant logged into the platform.
- `apiErrorRate` (number): Percentage of API calls failing over the last 7 days.
- `openSupportTickets` (number): Number of unresolved issues.
- `monthlyRevenue` (number): MRR from this merchant.

## 2. Churn Signals (What we track and why)
We will use three primary quantitative signals to determine if a merchant is at risk of churning:
1. **Engagement Drop-off**: `daysSinceLastLogin` > 14. 
   *Why it matters:* If they aren't logging into the dashboard, they aren't getting value from the product.
2. **Technical Friction**: `apiErrorRate` > 5%. 
   *Why it matters:* If their integrations are failing, they are experiencing active pain and might look for more stable competitors.
3. **Support Frustration**: `openSupportTickets` > 3. 
   *Why it matters:* A backlog of unresolved issues indicates they are blocked and likely unhappy with customer service turnaround.

## 3. Risk Scoring & Next Steps
We will classify merchants into three risk tiers based on how many signals they trigger. Each tier will have an automated recommended next step.

* **High Risk**: Triggers 2 or more of the churn signals.
  * *Next Step:* "Immediate CSM Intervention" - Escalate directly to a Customer Success Manager to schedule a rescue call.
* **Medium Risk**: Triggers exactly 1 of the churn signals.
  * *Next Step (if Engagement Drop-off):* "Send automated re-engagement email highlighting new features."
  * *Next Step (if Technical Friction):* "Flag to Technical Support for proactive API health check."
  * *Next Step (if Support Frustration):* "Bump support ticket priority to P1."
* **Safe**: Triggers 0 churn signals.
  * *Next Step:* "None required. Monitor normally."
