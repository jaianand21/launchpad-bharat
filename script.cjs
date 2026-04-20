const fs = require('fs');
const contentPath = 'src/utils/resourceContent.js';

let fileContent = fs.readFileSync(contentPath, 'utf8');

const newData = {
  38: `
## 1. Unit Economics Sheet
Compute LTV:CAC ratios accurately to impress institutional funds

### 📌 What it is?
A spreadsheet that calculates if your business model actually makes money by comparing Customer Acquisition Cost (CAC) versus Lifetime Value (LTV). Shows if you spend ₹100 to get a customer, do you make ₹300 back over time?

### 🎯 Why you need it?
* **Investor Proof:** VCs won't fund if LTV < 3x CAC
* **Sustainability Check:** Know if you're building a profitable business or burning cash
* **Channel Optimization:** Which marketing channel gives best return?
* **Pricing Power:** Should you increase prices or reduce costs?

### 📍 Which Stage?
Post-Revenue (6+ months) - When you have paying customers and repeat purchases.

### 📝 Step-by-Step Calculation:
**Step 1: Calculate CAC (Cost to Get One Customer)**
Formula: Total Sales & Marketing Cost / Number of New Customers
Example:
- Instagram Ads: ₹50,000
- Salaries of sales team: ₹30,000
- Software tools: ₹5,000
- Total: ₹85,000
- New customers acquired: 100
- CAC = ₹85,000 / 100 = ₹850 per customer

**Step 2: Calculate LTV (Lifetime Value)**
Formula: Average Revenue Per User (ARPU) × Gross Margin × Average Customer Lifespan
Example:
- Monthly subscription: ₹500
- Gross margin: 70% (₹350 after server/costs)
- Average customer stays: 8 months
- LTV = ₹350 × 8 = ₹2,800

**Step 3: Calculate Ratio**
LTV:CAC = ₹2,800 : ₹850 = 3.3:1
Benchmarks:
- \`<1:1\` = Dead business (losing money)
- \`1:1 to 3:1\` = Surviving but risky
- \`3:1 to 5:1\` = Healthy (investor sweet spot)
- \`>5:1\` = Under-investing in growth (spend more on ads!)

**Step 4: Track Monthly**
Update CAC every month (ad costs fluctuate)
Track LTV by cohort (customers who joined in January vs June behave differently)
Segment by channel (Organic LTV usually higher than Paid)

**Step 5: Improve the Ratio**
Increase LTV: Upsell, reduce churn, increase prices
Decrease CAC: Better targeting, referral programs, organic growth

### 📎 Documents Required:
* Accounting software data (Zoho Books, Tally)
* Customer payment records
* Marketing spend receipts
* Churn rate data (how many customers leave per month)

### 🔗 Official Links:
* [LTV Calculator](https://www.calku.com/calculator/ltv)
* [Unit Economics Template](https://www.cooleygo.com/resources/business-guides/calculating-cac-and-ltv/)
* [Stripe Benchmarks](https://stripe.com/atlas/guides/saas-pricing)

### 💡 Pro Tips:
* **Payback Period:** How many months to recover CAC? Should be <12 months. If ₹850 CAC and ₹350/month margin = 2.4 months (excellent).
* **Cohort Analysis:** Track customers who joined together. Do they stay longer? Spend more in month 3?
* **Blended CAC:** Separate organic (free) vs paid. Paid CAC is what matters for scaling.
* **Gross Margin:** Don't use revenue, use gross profit (revenue minus direct costs). For SaaS, gross margin is 70-80%. For E-commerce, 20-30%.

### 💰 Cost & Time:
* **Template:** ₹0 (Google Sheets free)
* **Software:** ₹0 (Excel or Google Sheets)
* **Time:** 2 hours to set up initially, 30 mins/month to update
* **Complexity:** Simple for subscription businesses, harder for one-time purchase businesses
`,
  39: `
## 2. Burn Rate Calculator
Actively monitor cash depletion to predict your exact runway cliff

### 📌 What it is?
Monthly calculation of how much cash your startup is losing (burning). Shows exactly how many months until you run out of money at current spending speed.

### 🎯 Why you need it?
* **Death Warning:** Know 6 months before you die, not 6 days
* **Fundraising Trigger:** Start raising when you have 6 months runway left
* **Cost Control:** Spot sudden spikes in spending immediately
* **Scenario Planning:** If I fire 2 employees, how much longer do I survive?

### 📍 Which Stage?
From Day 1 - Critical once you have funding (angel/VC) or if bootstrapped with limited savings.

### 📝 Step-by-Step Process:
**Step 1: Calculate Gross Burn (Total Monthly Spending)**
Categories:
- Salaries: ₹2,00,000 (founders + 2 employees)
- Office Rent: ₹25,000
- Software/Tools: ₹15,000 (servers, Zoom, Slack)
- Marketing: ₹30,000
- Misc: ₹10,000
- **Total Gross Burn: ₹2,80,000/month**

**Step 2: Calculate Net Burn (Money Actually Lost)**
Net Burn = Gross Burn - Monthly Revenue
Example:
- Gross Burn: ₹2,80,000
- Monthly Revenue: ₹1,00,000
- **Net Burn: ₹1,80,000/month**
*(If revenue > burn, you're profitable! Negative burn = profit)*

**Step 3: Calculate Runway**
Runway = Current Cash in Bank / Net Burn
Example:
- Current Bank Balance: ₹9,00,000
- Net Burn: ₹1,80,000/month
- **Runway: 5 months**
Meaning: You will run out of money in 5 months if revenue doesn't increase and costs don't decrease.

**Step 4: Set Up Monthly Tracker Create spreadsheet with columns:**
Month | Starting Balance | Revenue In | Expenses Out | Net Burn | Ending Balance | Runway (months remaining)

**Step 5: Action Triggers**
* **Green:** >9 months runway (comfortable)
* **Yellow:** 6-9 months runway (start networking for next round)
* **Red:** <6 months runway (emergency fundraising mode)
* **Black:** <3 months runway (cut costs drastically or take loan)

**Step 6: Scenario Planning**
"If we hire 1 more developer (₹40k/month):"
New burn: ₹2,20,000
New runway: 9,00,000 / 2,20,000 = 4.1 months (cutting it close)

"If we reduce marketing by ₹15k:"
New burn: ₹1,65,000
New runway: 5.4 months (extra month of life)

### 📎 Documents Required:
* Bank statements (current account)
* Credit card statements
* Payroll records
* Invoices pending (accounts receivable)

### 🔗 Official Links:
* [Burn Rate Template](https://www.pilot.com/bookkeeping/burn-rate/)
* [Runway Calculator](https://www.wallstreetprep.com/knowledge/burn-rate/)

### 💡 Pro Tips:
* **Weekly Pulse:** Check bank balance every Friday. If dropping faster than expected, investigate immediately.
* **Committed vs Discretionary:** Separate fixed costs (salaries, rent) from optional (marketing, events). In crisis, cut discretionary first.
* **Founder Salaries:** If taking ₹0 salary, remember to add "market rate" salary to burn calculation (investors ask this).
* **Phantom Burn:** Include costs you're not paying yet but will (taxes due, pending invoices).

### 💰 Cost & Time:
* **Tool:** ₹0 (Google Sheets)
* **Time:** 1 hour setup, 15 mins/week to update
* **Accuracy:** Check against actual bank balance monthly to catch errors
`,
  47: `
## 3. Cash Flow Tracker
Forecast accounts receivable to prevent unexpected liquidity crashes

### 📌 What it is?
A forward-looking view of when money comes IN (customer payments) vs when money goes OUT (bills to pay), showing daily/weekly cash position. Different from Burn Rate (which is monthly average).

### 🎯 Why you need it?
* **Timing Issues:** You have ₹5 lakh in bank but ₹6 lakh due in bills next week = crisis even though "profitable"
* **Client Delays:** Customer promised to pay on 1st but pays on 15th. Can you survive the gap?
* **Seasonality:** E-commerce has high cash before Diwali, low after. Plan accordingly.
* **Payroll Protection:** Ensure salary day always covered even if client delays payment.

### 📍 Which Stage?
B2B Startups - When you have 30-60 day payment terms (credit) to customers.

### 📝 Step-by-Step Process:
**Step 1: List All Cash Inflows (Expected Receipts)**
Date | Client | Amount | Probability
--- | --- | --- | ---
1st Aug | Client A | ₹50,000 | 100% (confirmed)
5th Aug | Client B | ₹30,000 | 80% (promised)
10th Aug | New Lead C | ₹40,000 | 30% (hopeful)
*Total Expected: ₹1,20,000 (weighted by probability)*

**Step 2: List All Cash Outflows (Fixed Payments)**
Date | Expense | Amount
--- | --- | ---
1st Aug | Rent | ₹25,000
5th Aug | Salaries | ₹2,00,000
7th Aug | Server Bill | ₹15,000
10th Aug | Vendor Payment | ₹40,000
*Total Due: ₹2,80,000*

**Step 3: Daily/Weekly Cash Position**
Aug 1: Opening ₹3,00,000 + ₹50,000 (Client A) - ₹25,000 (Rent) = ₹3,25,000
Aug 5: ₹3,25,000 + ₹24,000 (Client B 80%) - ₹2,00,000 (Salaries) = ₹1,49,000
Aug 7: ₹1,49,000 - ₹15,000 = ₹1,34,000 (DANGER: Low for Aug 10 vendor payment)

**Step 4: Identify Crunch Points**
Aug 7-9: Balance drops to ₹1,34,000 but need ₹40,000 on Aug 10
Action: Call Client B on Aug 3 to confirm payment by Aug 4, or defer vendor to Aug 15

**Step 5: Rolling 13-Week Forecast**
Update every Monday
Move week by week (this week actuals, next 12 weeks forecast)
Adjust for new deals, delayed payments

**Step 6: Contingency Planning**
"If Client B delays by 10 days:"
Options:
1. Delay vendor payment (negotiate)
2. Use credit card for immediate expenses
3. Call other clients for advance payment (offer 5% discount)
4. Emergency line of credit (keep ready with bank)

### 📎 Documents Required:
* Sales pipeline (expected closing dates)
* Client contracts (payment terms)
* Vendor bills (due dates)
* Bank statement (current position)

### 🔗 Official Links:
* [Cash Flow Template](https://www.score.org/resource/12-month-cash-flow-statement)
* [Wave Accounting](https://www.waveapps.com/) (free cash flow reports)

### 💡 Pro Tips:
* **Conservative Estimates:** Assume clients pay 5 days late, not on due date.
* **Cushion:** Keep 1 month expenses as "zero day" buffer never touched.
* **Auto-reminders:** Set calendar alerts 3 days before big payments due.
* **Cash is King:** Profit on paper doesn't pay salaries. Cash in bank does.

### 💰 Cost & Time:
* **Tool:** Excel or Google Sheets (₹0)
* **Time:** 1 hour/week to update rolling forecast
* **Bank Integration:** Some tools like QuickBooks auto-sync (₹500-1500/month)
`,
  48: `
## 4. Expense Tracking Templates
Standardized logging systems for employee travel and petty cash

### 📌 What it is?
Pre-made forms and systems for employees to report business expenses (travel, meals, office supplies) with receipts, ensuring proper documentation for accounting and tax deductions.

### 🎯 Why you need it?
* **Tax Deduction:** Business expenses reduce taxable income (save 25-30% on taxes)
* **Reimbursement:** Employees get money back quickly without confusion
* **Audit Proof:** If tax department asks questions, you have receipts ready
* **Budget Control:** See which department/employee spends most

### 📍 Which Stage?
3+ employees - When founders stop paying for everything personally.

### 📝 Step-by-Step Process:
**Template Structure (Per Expense Report):**

**Employee Info:**
Name: _______
Department: _______
Date Range: _______ to _______
Manager Approval: _______

**Expense Table:**
| Date | Category | Description | Amount | Receipt Attached? |
|---|---|---|---|---|
| 1/8 | Travel | Taxi to client meeting | ₹450 | Yes |
| 2/8 | Meals | Lunch with prospect | ₹800 | Yes |
| 3/8 | Office | Printer ink | ₹1,200 | Yes |
| | | **Total** | **₹2,450** | |

**Categories to Track:**
Travel (local/foreign) | Meals & Entertainment (client meetings) | Office Supplies | Communication (phone bills) | Marketing (events, printing) | Professional Fees (CA, lawyer) | Rent/Utilities

**Step 1: Submission**
Employee fills form weekly/monthly
Attaches physical receipts or digital photos
Submits to manager + accounts team

**Step 2: Verification**
Manager checks if business-related
Accounts checks if within budget/policy
Flags any missing receipts

**Step 3: Reimbursement**
Approved expenses paid with salary or separate transfer
Timeline: 7-15 days standard

**Step 4: Recording**
Entries made in accounting software
Tagged by project/client if applicable (for billing back to clients)

**Petty Cash System:**
Keep ₹5,000-10,000 cash in office for small urgent expenses
Custodian maintains register: Who took money, when, for what, returned change?
Replenish when running low with proper documentation

### 📎 Documents Required:
* Receipts (original or photo)
* Expense policy document (what's allowed)
* Bank details for reimbursement
* Approval signatures

### 🔗 Official Links:
* [Expense Template](https://www.smartsheet.com/expense-report-template)
* [Wave Receipts](https://www.waveapps.com/receipts) (scan with phone)

### 💡 Pro Tips:
* **Policy Limits:** Set clear rules (e.g., "Meals up to ₹500 per person", "Economy class flights only")
* **Digital First:** Use apps like Expensify or Zoho Expense - employees photograph receipt, auto-fills details.
* **GST Input:** If vendor gave GST invoice, company can claim credit. Ensure GST number on receipt.
* **TDS:** Some professional payments attract TDS (tax deduction). Accounts must deduct before paying.

### 💰 Cost & Time:
* **Excel Template:** ₹0
* **Expense Software:** ₹500-2,000/user/month (Expensify, Zoho Expense)
* **Time:** Employee spends 10 mins/week, accounts spends 30 mins/week
`,
  60: `
## 5. Product Roadmap Template
Align your engineers on quarterly shipping timelines cohesively

### 📌 What it is?
A visual document showing what features get built when, over next 3-6 months. Shows priorities (P0 critical, P1 important, P2 nice-to-have) and timelines (Now, Next, Later).

### 🎯 Why you need it?
* **Team Alignment:** Everyone knows what's being built and why
* **Expectation Management:** Customers/investors know when features arrive
* **Resource Planning:** Know if you need more developers before big feature
* **Focus:** Prevents "shiny object syndrome" (chasing random ideas)

### 📍 Which Stage?
Post-MVP - When you have a live product and team of 2+ developers.

### 📝 Step-by-Step Process:
**Step 1: Choose Format**
* **Kanban Board:** Trello, Linear, GitHub Projects (columns: Backlog, This Month, In Progress, Done)
* **Gantt Chart:** For complex dependencies (use ClickUp, Asana, or Excel)
* **Now/Next/Later:** Simple three-bucket system (low maintenance)

**Step 2: Categorize Work**
Themes (Big Goals):
- User Growth
- Revenue Optimization  
- Technical Debt
- Platform Stability

Features under each:
- Growth: Referral program, Social sharing, SEO improvements
- Revenue: Payment gateway #2, Upsell prompts, Pricing page redesign
- Tech Debt: Database optimization, Code refactoring

**Step 3: Prioritization (RICE or ICE Method)**
RICE Scoring:
- Reach: How many users affected? (1-10)
- Impact: How much does it help? (1-10)
- Confidence: How sure are we? (1-10)
- Effort: How many weeks? (1-10, inverse)
Score = (R×I×C)/E

**Step 4: Quarterly Planning**
Q3 2024 (July-Sept):
- July: Referral Program (P0), Bug fixes (P0)
- August: Mobile App V1 (P0), Email Notifications (P1)
- September: Advanced Analytics (P1), UI Polish (P2)

Q4 2024 (Oct-Dec):
- October: Payment Integration (P0)
- November: Winter Marketing Campaign features (P1)
- December: Performance Optimization (P1)

**Step 5: Sprint Planning (Weekly)**
Break quarterly features into 2-week sprints
Assign to developers
Daily standups (15 min): What did you do yesterday? What today? Any blocks?

**Step 6: Review & Adapt**
Monthly roadmap review: Did we ship on time?
If delays: Move less critical items to "Next" bucket
Customer feedback: Adjust priorities based on user requests

### 📎 Documents Required:
* Feature specification documents
* User stories ("As a user, I want to...")
* Technical architecture docs
* Design mockups (Figma links)
* Bug backlog

### 🔗 Official Links:
* [Roadmap Template](https://www.productplan.com/templates/)
* [Linear](https://linear.app/) (free for small teams)
* [Notion Roadmap](https://www.notion.so/templates/roadmap)

### 💡 Pro Tips:
* **Under-promise:** If you think it takes 2 weeks, commit to 3. Buffer for bugs/testing.
* **No Feature Creep:** If new idea comes mid-quarter, it goes to "Next" unless something current is deprioritized.
* **Public Roadmap:** Share with customers (Canny, Trello public board) to show transparency.
* **Tech Debt:** Allocate 20% of engineering time to fixing old code, not just new features.

### 💰 Cost & Time:
* **Tools:** Linear free, Notion free, Jira paid (₹700/user/month)
* **Planning Meeting:** 2 hours/quarter with whole team
* **Daily Standups:** 15 mins/day (5 hours/month)
`,
  63: `
## 6. Customer Support Escalation Form
Resolve tickets furiously quickly using a tiered escalation model

### 📌 What it is?
A system where customer complaints/issues move through levels based on severity/complexity: Level 1 (basic) → Level 2 (technical) → Level 3 (founders/managers). Ensures no ticket falls through cracks.

### 🎯 Why you need it?
* **Response Time:** Critical issues (payment failed) get immediate attention
* **Efficiency:** Junior staff handle password resets, seniors handle architecture bugs
* **Customer Satisfaction:** Clear SLAs (Service Level Agreements) - "We respond in 2 hours"
* **Tracking:** Know which issues happen most (product improvement data)

### 📍 Which Stage?
10+ paying customers - When you can't handle all support personally anymore.

### 📝 Step-by-Step Process:
**Tier Structure:**

**Level 1 - Frontline (Support Executive)**
Handles: Password resets, How-to questions, Billing inquiries
Skills: Communication, empathy, basic product knowledge
Response Time: Within 2 hours
Resolution Time: 24 hours

**Level 2 - Technical (Product Team)**
Handles: Bugs, Integration issues, Feature requests
Skills: Technical debugging, API knowledge
Response Time: Within 4 hours
Resolution Time: 48-72 hours (may need code deployment)

**Level 3 - Management (Founders/Head of Support)**
Handles: Escalations (customer threatening to leave), Legal issues, Refund requests > ₹X
Skills: Decision making authority, compensation approval
Response Time: Within 24 hours
Resolution Time: Case by case

**Escalation Triggers:**
Customer uses word "cancel", "refund", "legal", "competitor"
Issue unresolved for >48 hours at Level 1
Technical complexity requires code change
High-value customer (Enterprise plan)

**The Form (Ticket Creation):**
Ticket ID: #1234
Customer: [Name, Email, Plan type]
Category: [Billing/Technical/Feature Request/Complaint]
Severity: [Critical/High/Medium/Low]
- Critical: Service down, Payment stuck
- High: Feature broken for multiple users
- Medium: Single user issue, workaround exists
- Low: Feature request, cosmetic issue
Assigned To: [Name]
Due By: [Date/Time]
Status: [Open/In Progress/Waiting Customer/Resolved/Closed]

**Step 1: Ticket Creation**
Customer emails or submits form
Auto-assigned to Level 1 based on category
Acknowledgment sent immediately: "We received your request #1234"

**Step 2: Initial Response**
Level 1 attempts resolution using knowledge base
If can't solve in 2 attempts or 24 hours → Escalate to Level 2

**Step 3: Escalation**
Level 1 adds detailed notes: "Tried X, Y, Z. Customer using Android v12. Error screenshot attached."
Level 2 picks up, has technical context
If needs code fix → Escalate to Level 3 with business impact assessment

**Step 4: Resolution & Follow-up**
Mark as resolved
Customer confirms fix
Close ticket
Weekly report: How many tickets, average resolution time, common issues

### 📎 Documents Required:
* Knowledge base (FAQ articles)
* Product documentation
* Customer database (to check plan type/history)
* Internal escalation contact list

### 🔗 Official Links:
* [Zendesk](https://www.zendesk.com/) (industry standard)
* [Freshdesk](https://freshdesk.com/) (free tier available)
* [Intercom](https://www.intercom.com/) (for chat-based support)

### 💡 Pro Tips:
* **Canned Responses:** Create templates for common issues ("How to reset password" steps) to save time.
* **CSAT:** After resolution, send survey: "How satisfied were you?" Target >80% satisfaction.
* **SLA Breach Alerts:** If ticket crosses time limit, auto-alert manager.
* **Root Cause Analysis:** If same bug causes 10 tickets, fix the bug, not just handle tickets.

### 💰 Cost & Time:
* **Software:** Freshdesk free (up to 3 agents), then ₹1,500/agent/month
* **Setup:** 4 hours to configure workflows
* **Training:** 2 hours for support staff
`,
  64: `
## 7. CRM Setup Blueprint
Deploy automated sales funnels that catch leads relentlessly at scale

### 📌 What it is?
CRM (Customer Relationship Management) system that tracks every lead from first contact to paying customer. Automates follow-up emails, reminds sales team to call, shows pipeline (how many deals closing this month).

### 🎯 Why you need it?
* **No Leads Lost:** Every inquiry gets tracked, nothing forgotten in email inbox
* **Sales Forecasting:** Predict revenue: "We have ₹5 lakh in pipeline, 30% close rate = ₹1.5 lakh expected"
* **Automation:** Auto-send welcome email when lead fills form, schedule follow-up in 3 days
* **Team Coordination:** If one salesperson leaves, new person sees full history

### 📍 Which Stage?
B2B Startups or high-ticket B2C - When sales process involves multiple touchpoints (calls, demos, proposals).

### 📝 Step-by-Step Setup:
**Step 1: Choose CRM**
Free Options: HubSpot Free (up to 1,000 contacts), Zoho CRM Free
Paid: Salesforce (enterprise), Pipedrive (SME friendly), Freshsales
India Specific: LeadSquared, Zoho CRM (Chennai based, good support)

**Step 2: Define Pipeline Stages**
Typical B2B SaaS:
1. New Lead (inquiry form filled)
2. Contacted (email/call sent)
3. Qualified (need confirmed, budget checked)
4. Demo Given (product shown)
5. Proposal Sent (pricing shared)
6. Negotiation (discounts/terms discussed)
7. Closed Won (payment received!) 🎉
8. Closed Lost (chose competitor or postponed) ❌

**Step 3: Lead Capture**
Website form → Auto-creates CRM entry
Email integration: Forward leads from Gmail to CRM
Phone calls: Log manually or use telephony integration

**Step 4: Automation Setup**
Trigger: Lead moves to "Contacted"
Action: Wait 2 days
Condition: If no reply
Action: Send follow-up email template

Trigger: Lead sits in "Proposal Sent" for 7 days
Action: Alert sales manager + Suggest call

**Step 5: Scoring & Prioritization**
Assign points:
Opened email: +5 points
Clicked pricing link: +10 points
Requested demo: +20 points
Hot leads (>30 points) get called first

**Step 6: Reporting**
Dashboard showing:
Pipeline value (total ₹ in all stages)
Conversion rate (Leads → Customers %)
Average deal size
Sales cycle length (days from first contact to close)

### 📎 Documents Required:
* Email templates for each stage
* Product demo script
* Pricing sheet
* Customer onboarding checklist

### 🔗 Official Links:
* [HubSpot Free CRM](https://www.hubspot.com/products/crm)
* [Zoho CRM](https://www.zoho.com/crm/) (free up to 3 users)
* [Pipedrive](https://www.pipedrive.com/) (visual pipeline, paid)

### 💡 Pro Tips:
* **Integration:** Connect CRM to your email (tracks opens/clicks) and calendar (schedules meetings).
* **Mobile App:** Salespeople must be able to update CRM from phone immediately after client meeting (memory fresh).
* **Duplicate Check:** Ensure same lead from multiple sources (LinkedIn + Website) merges into one record.
* **Custom Fields:** Track Indian-specific data: GST number, Payment terms (Net 30/45/60), Regional language preference.

### 💰 Cost & Time:
* **Software:** ₹0-₹1,500/user/month
* **Setup:** 8-16 hours initially
* **Training:** 4 hours per sales person
* **ROI:** Usually pays for itself with 1 extra deal closed per month
`,
  66: `
## 8. North Star Metrics Guide
Identify the lone singular metric your startup should obsessively push

### 📌 What it is?
The ONE metric that best captures the core value you deliver to customers. If this number grows, your business grows. All teams align to improve this number.

### 🎯 Why you need it?
* **Focus:** Stop arguing about vanity metrics (app downloads, website visits). Focus on what matters.
* **Decision Filter:** "Will this feature improve North Star Metric?" If no, don't build.
* **Investor Language:** Shows you understand your business deeply.
* **Culture:** Unites team around single goal.

### 📍 Which Stage?
Post-Product-Market Fit - When you know what value you deliver and need to scale it.

### 📝 Step-by-Step Process:
**Step 1: Choose Your North Star**
Examples by Business Type:

SaaS (Subscription):
- Monthly Recurring Revenue (MRR) growth
- OR Weekly Active Teams (engagement)
- NOT: Total signups (inflated by tire-kickers)

Marketplace (Uber/OLA):
- Monthly Rides Completed (transactions)
- NOT: Drivers onboarded (supply without demand useless)

Social Media (Instagram):
- Daily Active Users (DAU) or Time Spent
- NOT: Total registered users (ghost accounts)

E-commerce:
- Gross Merchandise Value (GMV) or Repeat Purchase Rate
- NOT: Website traffic

B2B Enterprise:
- Number of Active Teams/Companies
- NOT: Revenue (lagging indicator, teams using = future revenue)

**Step 2: Define Inputs (Levers) What moves the North Star?**
If North Star = Weekly Active Users:
Inputs:
- New user activation rate (Day 1 experience)
- Retention (do they come back week 2?)
- Resurrection (can we bring back inactive users?)

**Step 3: Set Up Tracking**
Instrument analytics to track this metric daily/weekly
Dashboard visible to all (TV screen in office or Slack bot)
Historical trend (is it growing 5% week over week?)

**Step 4: Align Teams**
Marketing: "We bring in users who activate (complete first transaction)"
Product: "We build features that increase retention"
Engineering: "We ensure uptime so users can complete actions"
Support: "We resolve issues in <2 hours to prevent churn"

**Step 5: Review Cadence**
Daily: Check number (did it drop? investigate)
Weekly: Team meeting - what did we do to move it?
Monthly: Strategic review - if flat, change strategy

**Step 6: Evolve It**
Early stage: Focus on activation (do users "get" the product?)
Growth stage: Focus on retention (do they stay?)
Scale stage: Focus on monetization (can we charge more?)

### 📎 Documents Required:
* Analytics dashboard setup (Mixpanel, Amplitude, or Metabase)
* Definition document: "This is our North Star, this is how we calculate it"
* Historical data (at least 3 months to see trend)

### 🔗 Official Links:
* [Amplitude Guide](https://amplitude.com/blog/2018/02/05/north-star-metric-framework)
* [Sean Ellis on Metrics](https://growthhackers.com/articles)

### 💡 Pro Tips:
* **Lag vs Lead:** Revenue is lag metric (tells you past). North Star should be lead metric (predicts future).
* **Not Vanity:** "Total registered users" is vanity (can buy with ads). "Weekly active users doing core action" is real.
* **Gameable:** Ensure metric can't be gamed. "Support tickets resolved" → agents close tickets without solving. "Customer satisfaction" harder to fake.
* **Single Metric:** Don't have 5 North Stars. One primary, 2-3 supporting.

### 💰 Cost & Time:
* **Analytics Tools:** Mixpanel free tier, Amplitude free (up to 10M events/month)
* **Setup:** 4-8 hours to instrument tracking
* **Team Alignment:** Ongoing (weekly 30-min review)
`,
  68: `
## 9. Branding Kit Fundamentals
Rapidly deploy cohesive logos and messaging that look heavily funded

### 📌 What it is?
A Brand Kit (or Brand Guidelines) is a folder containing your logo files (different formats), color codes (HEX values), fonts, and tone of voice rules. Ensures everything you create (website, visiting cards, social media) looks consistent and professional.

### 🎯 Why you need it?
* **Professionalism:** Mismatched fonts/colors make you look amateur
* **Recognition:** Customers recognize you instantly (like McDonald's yellow)
* **Delegation:** Designer knows exactly what colors to use without asking you
* **Speed:** Pre-made templates mean you create content 10x faster

### 📍 Which Stage?
Pre-launch - Before first marketing material goes out. Can evolve but start with basics.

### 📝 Step-by-Step Process:
**Step 1: Logo Package**
Must have files:
- Logo_main.png (for web)
- Logo_main.svg (vector, scales to any size)
- Logo_white.png (for dark backgrounds)
- Logo_black.png (for grayscale printing)
- Favicon.ico (browser tab icon)

Sizes:
- 16x16, 32x32 (favicon)
- 500x500 (social media profile)
- 2000x600 (website header)
- Vector (print - visiting cards, banners)

**Step 2: Color Palette**
Primary Color: #FF6B35 (Your main brand orange)
Secondary Color: #004E89 (Deep blue)
Accent Color: #F7C548 (Yellow)

Neutral Colors:
- Dark Gray: #333333 (body text)
- Light Gray: #F5F5F5 (backgrounds)
- White: #FFFFFF
- Black: #000000
Tools to pick: Coolors.co, Adobe Color

**Step 3: Typography (Fonts)**
Heading Font: Poppins Bold (or Montserrat, Playfair Display)
Body Font: Inter (or Roboto, Open Sans)
Rules:
- Headings: 32px-48px, Bold
- Subheadings: 24px, Semi-bold
- Body: 16px, Regular
- Small: 12px-14px, Light

**Step 4: Tone of Voice**
Who you are: Friendly but professional, Simple language (no jargon), Indian context.
Who you are NOT: Corporate/boring, Over-casual (no "bro", "dude"), Generic.
Examples:
✅ "Launch your startup in 30 days"
❌ "Leverage our synergistic platform to optimize entrepreneurial outcomes"

**Step 5: Design Templates Create once, reuse:**
Social media post template (Canva)
Email newsletter template (Mailchimp)
Presentation template (Google Slides/PPT)
Invoice template (branded)
Letterhead (for official letters)

**Step 6: Brand Book Document One PDF containing:**
Logo usage (clear space around logo, don't stretch/distort)
Color codes
Font names
Photography style (stock photos vs real photos?)
Icon style (line icons vs filled?)

### 📎 Documents Required:
* Logo source files (AI/EPS from designer)
* Color hex codes
* Font files (if custom)
* High-res photos of founders/office
* Templates created

### 🔗 Official Links:
* [Canva Brand Kit](https://www.canva.com/) (upload logo/colors, auto-applies to designs)
* [Coolors](https://coolors.co/) (generate color palettes)
* [Google Fonts](https://fonts.google.com/) (free fonts)

### 💡 Pro Tips:
* **Consistency:** Use exactly 2 fonts max, 3 colors max. Restraint looks premium.
* **Hierarchy:** Most important info biggest. Don't make everything bold.
* **White Space:** Leave breathing room. Crowded = cheap.
* **Hire Designer:** Once for logo (₹5,000-15,000), then DIY with templates using brand kit.

### 💰 Cost & Time:
* **Logo Design:** ₹5,000-25,000 (freelancer) or ₹0 (Canva logo maker)
* **Brand Kit Creation:** 1 day to compile
* **Templates:** 2-3 days to create initial set
* **Ongoing:** ₹0 (just follow rules)
`,
  69: `
## 10. Content Distribution Workflow
Create compounding attention machines rather than posting sporadically

### 📌 What it is?
A system where you create one piece of content (like a blog post) and automatically adapt it for 5+ platforms (LinkedIn post, Twitter thread, Instagram carousel, Email newsletter, YouTube video) rather than creating from scratch each time.

### 🎯 Why you need it?
* **Efficiency:** 1 hour writing → 1 week of content across all channels
* **Consistency:** Post regularly without daily stress
* **Reach:** Different audiences prefer different platforms
* **SEO:** Blog posts compound over time (old posts still bring traffic)

### 📍 Which Stage?
Growth Stage - When you have product working and need to build audience.

### 📝 Step-by-Step Process:
**Step 1: Content Pillars (Themes) Decide 3-5 topics you'll always talk about:**
Example for Launchpad Bharat:
1. Startup funding tips (How to raise angel round)
2. Success stories (Featured founder journeys)
3. Government schemes (Startup India benefits)
4. Mistakes to avoid (Post-mortems)
5. Tools & templates (Free resources)

**Step 2: Create Core Content (The "Hub")**
Once per week: Write detailed blog post or record video (long-form, 10 mins+ reading).
Example: "Complete Guide to Startup India Registration (2024)"

**Step 3: Atomize (Break into smaller pieces)**
From one blog post, create:

Twitter/X Thread (7-10 tweets): Hook, Key steps, Mistakes, CTA
LinkedIn Post (Long-form): Story, Bullet points, Tag people, Question
Instagram Carousel (5-7 slides): Title graphic, 1 step/slide, Infographic, CTA
Email Newsletter: Subject, Summary of blog, CTA, PS
YouTube Shorts/Reels: 60-second video explaining one tip
WhatsApp Status: Image with key stat, "Swipe up"

**Step 4: Scheduling Don't post everything same day. Space out:**
Day 1: Blog post live + Email sent
Day 2: LinkedIn post
Day 3: Twitter thread
Day 5: Instagram carousel
Day 7: YouTube video

**Step 5: Repurpose Old Content**
After 3 months, update old blog post with new info, republish as "Updated for 2024", redistribute.

**Step 6: Distribution Channels**
Owned: Email list (most valuable, you control)
Rented: Social media (algorithm decides reach)
Earned: Guest posts on others' blogs, podcast interviews

### 📎 Documents Required:
* Blog posts (written content)
* Canva templates (for social graphics)
* Scheduling tool (Later, Buffer, or native scheduling)
* Email list (Mailchimp/ConvertKit)

### 🔗 Official Links:
* [Buffer](https://buffer.com/) (schedule to multiple platforms)
* [Later](https://later.com/) (visual planner for Instagram)
* [Repurpose.io](https://repurpose.io/) (auto-convert video to audio to text)

### 💡 Pro Tips:
* **80/20 Rule:** 80% educational/helpful content, 20% promotional (your product).
* **Evergreen:** Create content that stays relevant for years.
* **CTA Variation:** Each platform gets slightly different call-to-action.
* **Batch Creation:** Spend Monday writing, Tuesday creating graphics, Wednesday scheduling.

### 💰 Cost & Time:
* **Scheduling Tools:** Buffer free (10 posts/channel), paid ₹1,500/month
* **Design:** Canva free (₹0) or Pro ₹1,000/year
* **Time:** 4 hours to create one piece of pillar content + all atomized versions
* **ROI:** One good blog post can bring 1000s of visitors over 2 years
`,
  70: `
## 11. Social Media Growth Playbook
Attack Instagram algorithms maliciously to grow audience share for zero dollars

### 📌 What it is?
Organic (free) strategies to grow followers on Instagram/LinkedIn/Twitter by understanding how platform algorithms work and gaming them favorably.

### 🎯 Why you need it?
* **Zero Cost:** No ad spend required
* **Trust:** Organic followers engage more than paid followers
* **Validation:** If people follow you, your content is resonating
* **Distribution:** Platform promotes your content to non-followers if engagement is high

### 📍 Which Stage?
Early Stage - Before you have budget for paid ads, use organic to get first 1000 true fans.

### 📝 Step-by-Step Process:
**Instagram Specific:**

**Step 1: Profile Optimization**
Bio: Clear description + CTA + Link (use Linktree if multiple links)
Highlights: Organized stories (Customer Reviews, FAQs, Behind Scenes)
Grid: First 9 photos create visual impression. Make them cohesive (color theme).

**Step 2: Content Types That Work**
Reels (Highest reach): 15-30 secs, Educational tips, Trending audio, Hooks in first 3 secs.
Carousels (Saves = algorithm boost): 5-7 slides, Step-by-step guides.
Stories (Engagement): Polls, Q&A stickers, Behind-the-scenes.

**Step 3: Hashtag Strategy**
Don't use #entrepreneur (100M posts, you'll drown)
Use mid-size: #indianstartups (100K posts) + niche: #fintechstartups (10K posts)
Mix: 3 broad + 10 mid + 2 niche = 15 hashtags. Put in caption.

**Step 4: Engagement Pods/Groups**
Join WhatsApp/Telegram groups of fellow founders
When you post, everyone comments/likes in first 30 minutes
Algorithm sees initial engagement, pushes to Explore page
Reciprocate by engaging on their posts

**Step 5: Consistency Schedule**
Starting out: 1 Reel/day, 3 Carousels/week, Stories 3-5/day. Time: 9 AM, 12 PM, 6 PM.
Advanced: 3 Reels/day when launching product.

**Step 6: Collaboration**
DM 10 accounts in your niche per week
Propose: "I do Reel for your page, you do for mine" (audience swap)

**LinkedIn Specific (for B2B):**
Post Tuesday-Thursday, 8-10 AM
Text posts with line breaks perform better than links
Comment on big accounts (10 thoughtful comments per day)
"Broetry" format: One sentence per line, dramatic, gets engagement.

### 📎 Documents Required:
* Content calendar (what to post when)
* Canva templates (consistent look)
* Bank of photos/videos (B-roll)
* Engagement tracking sheet

### 🔗 Official Links:
* [Instagram Creator Studio](https://business.facebook.com/creatorstudio) (schedule posts free)
* [Later](https://later.com/) (visual planning)

### 💡 Pro Tips:
* **Engage Before Posting:** Spend 15 mins commenting on others' content before you post.
* **Reply to Comments:** First 60 minutes after posting, reply to every comment immediately.
* **Controversy (Careful):** Mild disagreement sparks comments. Comments = reach.
* **Bio Link:** Use "Link in bio" tools that track clicks (Linktree, Campsite).

### 💰 Cost & Time:
* **Tools:** ₹0 (native apps + Canva free)
* **Time:** 1 hour/day for creation + engagement (or hire VA for ₹10,000/month)
* **Growth Rate:** Realistic: 100-500 followers/month organic with consistency
`,
  72: `
## 12. Paid Ads Unit Economics
Manipulate Meta and Google algorithms to pull down customer acquisition costs

### 📌 What it is?
Understanding how to run Facebook/Instagram (Meta) and Google ads profitably by tracking Cost Per Acquisition (CPA) and optimizing campaigns to reduce cost while maintaining quality.

### 🎯 Why you need it?
* **Scale:** Organic reaches limit. Ads let you 10x growth quickly.
* **Targeting:** Show ads only to "25-year-old IIT grad interested in startups in Bangalore"
* **Measurable:** Know exactly that ₹50 spent = 1 customer (₹50 CAC)
* **Retargeting:** Show ads to people who visited your website but didn't buy (high intent)

### 📍 Which Stage?
Product-Market Fit achieved - When you know LTV and can afford to spend ₹X to get customer who pays ₹Y.

### 📝 Step-by-Step Process:
**Step 1: Platform Selection**
Meta (Facebook/Instagram): Best for B2C, visual products. Cost: ₹20-100 per click.
Google Ads: Best for high intent searches. Cost: ₹50-300 per click.
LinkedIn Ads: Best for B2B. Cost: ₹200-500 per click (very expensive).

**Step 2: Campaign Structure**
Campaign: Startup Course
├── Ad Set 1: Age 22-26, Mumbai/Delhi, Interest "Entrepreneurship"
├── Ad Set 2: Age 27-32, Bangalore, Interest "IIT" or "IIM"
└── Ad Set 3: Lookalike (people similar to existing customers)

**Step 3: Creative Testing (A/B Test) Create 3-5 versions of ad:**
Image A: Founder photo vs Product screenshot
Headline A: "Launch Startup" vs "Quit 9-5 Job"
Call to Action: "Learn More" vs "Sign Up Free"
Run for ₹500 each, kill losers, scale winners.

**Step 4: Optimization Metrics**
Key Numbers:
- CTR (Click Through Rate): % who click ad. Good = >1% Meta, >5% Google
- CPC (Cost Per Click): ₹ spent / clicks. Lower is better.
- CPM (Cost Per 1000 impressions): Shows if audience is expensive
- CPA (Cost Per Acquisition): ₹ spent / purchases. Must be < LTV/3
Optimization Actions:
If CTR low: Change creative
If CPC high: Audience too broad/narrow
If CPA high: Landing page not converting

**Step 5: Retargeting (Magic)**
Install Meta Pixel on your website
Create Custom Audience: "Visited pricing page in last 7 days but didn't buy"
Show them specific ad: "Still thinking? Here's 10% off"
Cost: 50% cheaper than cold traffic

**Step 6: Scaling**
When CPA is good, increase budget 20% every 3 days
Don't jump from ₹500/day to ₹10,000/day (algorithm resets learning)
Duplicate winning ad sets rather than increasing budget on same one

### 📎 Documents Required:
* Ad creative (images/videos)
* Landing page (optimized for conversion)
* Meta Pixel installed (code on website)
* Payment method (card with international transactions)
* GST number (for invoicing)

### 🔗 Official Links:
* [Meta Business Manager](https://business.facebook.com/)
* [Google Ads](https://ads.google.com/)
* [LinkedIn Campaign Manager](https://www.linkedin.com/campaign-manager/)

### 💡 Pro Tips:
* **Start Small:** ₹500/day for 1 week testing. Don't burn ₹50,000 on day 1.
* **Lookalike Audiences:** Upload your existing customer list, Meta finds similar people.
* **Frequency Cap:** Don't show same ad to person >3 times.
* **Attribution:** Customer might see Instagram ad, search Google, click email. Last click gets credit.

### 💰 Cost & Time:
* **Minimum Budget:** ₹10,000-20,000/month to learn (test phase)
* **Scaling Budget:** ₹1-5 lakh/month for growth
* **Time:** 5-10 hours/week managing campaigns
* **Professional Help:** Hire agency for 15-20% of ad spend
`,
  73: `
## 13. Conversion Rate Framework
A/B test landing pages mechanically to squeeze signups violently out of traffic

### 📌 What it is?
Systematic process of testing changes to your website (headlines, buttons, colors, images) to increase percentage of visitors who take desired action (sign up, buy, download).

### 🎯 Why you need it?
* **Free Growth:** Double conversion rate = double customers without spending more on ads
* **Data-Driven:** Stop guessing what works, let users vote with behavior
* **Compound:** 5% improvement every month = 80% improvement in year

### 📍 Which Stage?
Post-launch - When you have 100+ visitors/day to get statistical significance in tests.

### 📝 Step-by-Step Process:
**Step 1: Identify Conversion Points Where do users drop off?**
Funnel: Homepage (100%) → Signup Page (40%) → Payment (10%) → Purchase Complete (5%)
Focus on biggest drop: Homepage to Signup (60% leaving)

**Step 2: Form Hypothesis**
Current: "We help startups grow"
Test: "Launch your startup in 30 days without coding"
Reason: Specific benefit + time frame + objection handling

**Step 3: Set Up A/B Test Use tools:**
VWO: Visual Website Optimizer
Unbounce: For landing page specific testing
Split URL: Send 50% traffic to page A, 50% to page B

**Step 4: Statistical Significance**
Run until 95% confidence (tool calculates this)
Minimum 100 conversions per variant (rough rule)
Run for full business cycles (don't stop on weekend if B2B)

**Step 5: Winners & Iteration**
If B wins, make B permanent. New hypothesis.
High-Impact Tests:
1. Headline: Benefit-driven vs Feature-driven
2. CTA Button: "Sign Up" vs "Get Started Free"
3. Form Fields: Remove one field
4. Social Proof: Add testimonial above fold
5. Urgency: Add countdown timer
6. Pricing: Show monthly vs annual default
7. Risk Reversal: "No credit card required" badge
8. Visuals: Product screenshot vs Happy customer photo

### 📎 Documents Required:
* Heatmap tool (Hotjar, CrazyEgg)
* Analytics set up (Google Analytics 4)
* Test variants designed (images/copy)
* Developer time to implement code changes

### 🔗 Official Links:
* [VWO](https://vwo.com/) (free trial, then paid)
* [Optimizely](https://www.optimizely.com/) (enterprise)
* [Unbounce](https://unbounce.com/) (landing page builder with testing)

### 💡 Pro Tips:
* **One Change at a Time:** If you change headline AND button color, you don't know which helped.
* **Test High Traffic Pages:** Homepage, Pricing page, Checkout flow.
* **Mobile vs Desktop:** Test separately. Mobile usually converts lower but improving it matters more.

### 💰 Cost & Time:
* **Tools:** VWO starts ₹8,000/month, Hotjar free (heatmaps)
* **Development:** 2-4 hours per test setup
* **Duration:** 2-4 weeks per test for valid results
* **ROI:** Even 20% improvement can mean lakhs in revenue if traffic is high
`,
  74: `
## 14. Email Welcome Sequences
Automate user onboarding messages to radically drop platform churn

### 📌 What it is?
Series of 5-7 automated emails sent to new user over first 7-14 days, teaching them how to use product, showing value, and preventing them from forgetting about you (churn).

### 🎯 Why you need it?
* **Activation:** Users who complete onboarding are 3x more likely to stay
* **Education:** They don't know how to use your features unless you tell them
* **Relationship:** Builds trust before asking for sale/upgrade
* **Automation:** Set up once, runs for every new user forever

### 📍 Which Stage?
Post-launch - When you notice users sign up but don't "activate" (complete first key action).

### 📝 Step-by-Step Process:
**The Sequence (Example for SaaS):**

* **Email 1: Welcome (Immediate)**
  Subject: Welcome to [Product]! Here's your next step...
  Body: Warm welcome, Quick intro, CTA: Complete profile, PS: Reply if you need help

* **Email 2: Quick Win (Day 1)**
  Subject: Get your first [result] in 5 minutes
  Body: Tutorial, Video link or GIF, Success story

* **Email 3: Social Proof (Day 3)**
  Subject: How [Similar Company] achieved [Result]
  Body: Case study, Specific numbers, CTA

* **Email 4: Feature Deep Dive (Day 5)**
  Subject: Most people miss this powerful feature...
  Body: Explain one underused feature, Why it matters, How to access it

* **Email 5: Check-in/Support (Day 7)**
  Subject: How's your first week going?
  Body: Personal tone, Ask what's blocking them, Offer 15-min call

* **Email 6: Advanced Tips (Day 10)**
  Subject: Power user secrets
  Body: Advanced features for engaged users

* **Email 7: Ask for Feedback/Review (Day 14)**
  Subject: Quick favor?
  Body: Ask for testimonial/review or survey on why they haven't activated

**Technical Setup:**
Trigger: When user signs up
Timing: Spaced out
Personalization: Use first name, mention their company
Skip Logic: If user already activated, skip tutorial emails, send advanced ones instead

### 📎 Documents Required:
* Email copy written (7 emails)
* Images/GIFs for tutorials
* Landing pages for CTAs
* Email marketing tool setup

### 🔗 Official Links:
* [Mailchimp](https://mailchimp.com/) (free up to 500 contacts)
* [ConvertKit](https://convertkit.com/) (great for automation)
* [Sendy](https://sendy.co/) (self-hosted, one-time ₹5,000)

### 💡 Pro Tips:
* **Subject Lines:** Use curiosity gap or specificity.
* **Plain Text:** Emails that look like personal text often get better open rates.
* **Single CTA:** One clear action per email.
* **Unsubscribe:** Easy unsubscribe link required by law (CAN-SPAM).

### 💰 Cost & Time:
* **Tools:** ₹0-₹1,500/month
* **Writing:** 1 day to write sequence
* **Setup:** 4 hours to configure automation
* **ROI:** Can reduce churn by 20-30% (huge impact on LTV)
`,
  75: `
## 15. B2B Sales Funnel Mechanics
Close enterprise deals predictably using psychological top-down funnels

### 📌 What it is?
Structured process for selling to other businesses (not consumers), typically high-ticket (₹1 lakh+), involving multiple decision makers, and longer sales cycle (1-6 months).

### 🎯 Why you need it?
* **Predictability:** Know that 10 meetings → 3 proposals → 1 deal
* **Efficiency:** Focus only on qualified leads
* **Scaling:** Hire salespeople with clear playbook
* **Higher Value:** One B2B deal = 100 B2C customers revenue

### 📍 Which Stage?
Product-Market Fit + Case Studies - When you have 2-3 happy customers who can give testimonials.

### 📝 Step-by-Step Process:
**The Funnel Stages:**

**1. Lead Generation (Top)**
Sources: LinkedIn outreach (cold), Content marketing (warm), Referrals (hot), Events/Webinars, Partnerships.

**2. Qualification (BANT Framework)**
Budget: Do they have ₹X allocated?
Authority: Are you talking to decision maker?
Need: Do they really have the problem?
Timeline: When do they need solution?

**3. Discovery Call (30-45 mins)**
Ask questions, don't pitch: "What does your current process look like?", "What happens if you don't solve this?".
Goal: Understand pain, map stakeholders.

**4. Demo/Proposal (Value Presentation)**
Tailored to their specific pain points.
ROI calculation: "If we save you 10 hours/week at ₹500/hour, that's ₹2 lakh/year value"
Leave behind: Proposal PDF.

**5. Technical/Security Review**
Their IT team checks your security.
Legal reviews contract terms.

**6. Negotiation**
Price objections → Remove features to match budget.
Procurement delays → Provide templates they can use.
Decision delays → Set hard deadline with consequence.

**7. Close**
Contract signed, Advance payment (min 25%), Kickoff call scheduled.

**Psychological Tactics:**
Social Proof: "We just signed [Competitor]..."
Scarcity: "We can only onboard 3 new enterprise clients this quarter..."
Authority: Founder/CEO joins final negotiation call.

### 📎 Documents Required:
* Sales deck (presentation)
* Proposal template & Contract/MSA
* Case studies (PDF)
* Security questionnaire responses
* ROI calculator

### 🔗 Official Links:
* [Salesforce](https://www.salesforce.com/) (CRM for enterprise)
* [HubSpot Sales](https://www.hubspot.com/products/sales) (free CRM)
* [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions)

### 💡 Pro Tips:
* **Champion Building:** Find one internal employee who loves your product. They sell to their boss for you.
* **Multi-threading:** Don't rely on one contact. Build relationships with 3-4 people in company.
* **Follow-up:** 80% of sales require 5 follow-ups after meeting. Most people stop at 2.
* **Pilot Program:** Offer 3-month paid pilot instead of annual contract.

### 💰 Cost & Time:
* **Sales Cycle:** 1-6 months (enterprise), 2-4 weeks (SME)
* **CAC:** ₹50,000-2,00,000
* **LTV:** Must be >₹5-10 lakh to justify B2B sales cost
* **Team:** Salesperson salary ₹25,000-75,000/month + commission (5-10% of deal)
`,
  90: `
## 16. Lean Validation Loops
Iterate features ferociously without burning out your cash buffer

### 📌 What it is?
Rapid experimentation methodology where you test ideas in days (not months) with minimal code, measure results, and decide to pivot or persevere based on data.

### 🎯 Why you need it?
* **Speed:** Don't spend 6 months building something nobody wants
* **Cash Conservation:** Test with ₹5,000, not ₹5,00,000
* **Learning:** Failed experiments teach what customers actually want
* **Agility:** Beat big competitors who move slow

### 📍 Which Stage?
All stages - Especially early when resources are tight.

### 📝 Step-by-Step Process:
**The Build-Measure-Learn Loop:**

**1. Form Hypothesis**
"We believe that [type of user] needs [solution] because [problem]"
Example: "We believe that small shop owners need WhatsApp automation because they waste 2 hours daily replying to price queries."

**2. Build MVP (Minimum Viable Test)**
Level 1: Fake Door Test (Landing page with "Coming Soon")
Level 2: Concierge MVP (Manually do the service for first 10 customers)
Level 3: Wizard of Oz (Looks automated, but you doing manually behind curtain)
Level 4: Piecemeal MVP (Use Zapier, Airtable, Typeform)

**3. Define Success Metric Before launching test, decide:**
"If 20 out of 100 people sign up, we build it"
"If retention is >40% after 1 week, we proceed"

**4. Run Experiment (1-2 weeks)**
Launch to small group (100-500 users)
Measure religiously

**5. Analyze & Decide**
Persevere: Metric hit target -> Build actual product
Pivot: Metric way below target -> Change direction based on behavior
Kill: No one uses it -> Stop wasting time

**Example Validation:**
Idea: AI chatbot for customer service
Test: Put "Chat with AI" button, actually connects to human founder.
Result: 80% asked same 5 questions, 20% complex.
Decision: Build FAQ bot for 80%, human handoff for 20%.

### 📎 Documents Required:
* Experiment tracking sheet (hypothesis, metric, result)
* User interview questions
* Analytics dashboard for the test
* Rollback plan

### 🔗 Official Links:
* [Lean Startup](https://theleanstartup.com/) (Eric Ries book)
* [Experiment Board](https://www.javelin.com/)
* [Validation Patterns](https://www.validationpatterns.com/)

### 💡 Pro Tips:
* **Innovation Accounting:** Don't compare new feature to mature product metrics. Look for trend (improving week over week).
* **Cohort Analysis:** Compare users who joined during experiment vs before.
* **Vanity Metrics:** Don't celebrate "1000 app downloads". Activation matters.
* **Kill Your Darlings:** If hypothesis fails, kill it fast.

### 💰 Cost & Time:
* **Experiment Cost:** ₹0-₹10,000 (usually just time)
* **Duration:** 1-2 weeks per experiment
* **Team:** Product manager + 1 developer
* **ROI:** One successful experiment that hits product-market fit = company saved
`,
  93: `
## 17. ICE Scoring Matrices
Prioritize product pipelines mechanically based solely on mathematical impact

### 📌 What it is?
ICE (Impact, Confidence, Ease) is a prioritization framework where every feature idea gets a score 1-10 on three criteria, then ranked by total score. Removes bias from roadmap.

### 🎯 Why you need it?
* **Objectivity:** Ideas judged by potential, not who suggested them
* **Alignment:** Team agrees on scoring, reduces arguments
* **Efficiency:** Do high-ICE features first, low-ICE later
* **Transparency:** Everyone sees why Feature A got built before Feature B

### 📍 Which Stage?
Growth Stage - When you have more feature ideas than resources to build them.

### 📝 Step-by-Step Process:
**The Formula:**
ICE Score = Impact × Confidence × Ease

**Scoring Rubric:**
Impact (Business Value): 10 = 50%+ improvement in metric, 5 = 10-20% improvement, 1 = <5% improvement.
Confidence (Certainty): 10 = Already validated, 5 = Medium evidence, 1 = Pure guess.
Ease (Technical Effort): 10 = Ship in 1 day, 5 = 2-4 weeks, 1 = 3+ months.

**Example Calculation:**
Referral Program: Impact 9, Confidence 8, Ease 6 = 432 (1st Priority)
AI Chatbot: Impact 10, Confidence 3, Ease 2 = 60 (Low Priority)

**The Process:**
Step 1: Idea Collection (Everyone submits to shared board)
Step 2: Scoring Session (Product manager presents, team debates scores, assign numbers)
Step 3: Ranking (Sort by ICE Score)
Step 4: Selection (Pick top items that fit next sprint)
Step 5: Review (Did it achieve predicted impact? Adjust future confidence scores)

**Variations:**
RICE: Reach × Impact × Confidence / Effort
Weighted: Impact 40%, Confidence 30%, Ease 30%

### 📎 Documents Required:
* Spreadsheet template
* List of all feature ideas
* North Star Metric definition
* Technical estimates

### 🔗 Official Links:
* [ICE Framework](https://www.productplan.com/glossary/ice-scoring-model/)
* [RICE Method](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
* [Productboard](https://www.productboard.com/) (has ICE scoring built-in)

### 💡 Pro Tips:
* **Calibration:** First few times, scores will be wrong. Calibrate after 3-4 features ship.
* **Tie Breaker:** If scores equal, pick faster one (higher Ease) to maintain velocity.
* **No Sacred Cows:** CEO's idea must go through same scoring.
* **Re-score:** Old ideas should be re-scored quarterly.

### 💰 Cost & Time:
* **Tool:** ₹0 (Google Sheets)
* **Time:** 1 hour/week for scoring meeting
* **Participants:** Product manager + Tech lead + Business stakeholder
`
};

let match = fileContent.match(/export const resourceContentData = \{([\s\S]*)\};/);
if (match) {
  let innerContent = match[1];

  for (const ObjectKey of Object.keys(newData)) {
    const id = ObjectKey;
    const content = newData[id];
    // escape backticks
    const escapedContent = content.replace(/\`/g, '\\`');
    if (innerContent.includes(id + ':')) {
      console.log('ID ' + id + ' already exists. Consider replacing it.');
    } else {
      innerContent += '\n  ' + id + ': `\n' + escapedContent + '`,';
    }
  }

  const finalContent = fileContent.replace(match[1], innerContent);
  fs.writeFileSync(contentPath, finalContent, 'utf8');
  console.log("Done!");
} else {
  console.error("Could not find export const resourceContent in the file.");
}


