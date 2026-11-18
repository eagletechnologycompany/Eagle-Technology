# Eagle Technology — Content & Governance Review Register
**Document Status**: Active Review  
**Last Updated**: 2026-11-17  
**Source of Truth**: Read-Only Blueprint (*Company Foundation, Brand Strategy & Official Website Development Blueprint*)  
**Scope**: Public Startup Website, Private Customer Portal, Founder Operations Dashboard

---

## 1. Governance & Source-of-Truth Rules

In accordance with Section 2 of the Eagle Technology Platform Specification:
1. The supplied DOCX blueprint is a **read-only source of truth** and is never modified, deleted, or overwritten.
2. No facts, metrics, client names, revenue numbers, or founder identities may be invented.
3. Every unconfirmed or unapproved item is recorded here with one of the following approved status flags:
   - `[To be confirmed]`
   - `[Coming soon]`
   - `[Founder approval required]`
   - `[Integration pending]`

---

## 2. Review Register & Status Matrix

| ID | Item / Area | Platform Surface | Current Implementation State | Status Flag | Action Required from Founders |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CR-01** | **Founding Team Names & Bios** | Public Website (`/about`), Dashboard (`/dashboard/team`) | Role-based placeholder profiles (`Founder & CEO`, `Frontend Developer`, `Backend Developer`, `Graphic Designer & Video Editor`, `AI & Automation Specialist`). No fictional names used. | `[Founder approval required]` | Founders to provide real names, approved photographs, and verified professional bios upon final agreement. |
| **CR-02** | **Legal Entity & Registration** | Public Footer, Legal Notice, Proposal Templates | Marked as *"Ethiopian-founded technology company in formation (Addis Ababa, Ethiopia)"*. | `[Integration pending]` | CEO and founders to register trade name, tax identification (TIN), and commercial licensing with Ethiopian authorities. |
| **CR-03** | **Customer Testimonials & Case Metrics** | Public Website (`/work`, `/`) | Strictly zero fake client quotes or fabricated ROI percentages. Replaced by transparent **Capability & Demonstration Studies** with full architecture breakdowns. | `[To be confirmed]` | Add verified client testimonials only after the first commercial deliverables are formally completed and signed off. |
| **CR-04** | **Commercial Pricing & Estimation** | Public Website (`/solutions`, `/contact`), Portal (`/portal`) | Multi-step interactive scoping calculator with milestone-based estimate placeholders. | `[Founder approval required]` | Founders to approve baseline hourly/daily rates and standard project tiers for local (ETB) and regional (USD) clients. |
| **CR-05** | **Physical Office & Direct Phone** | Public Contact (`/contact`), Footer | Primary contact via verified digital channels (`contact@eagletechnology.et` placeholder, inquiry form). Office listed as *"Addis Ababa, Ethiopia (Physical location to be announced)"*. | `[To be confirmed]` | Founders to confirm primary office address, working hours, and official phone line once operational lease is finalized. |
| **CR-06** | **Payment Gateway Integration** | Customer Portal (`/portal`), Invoicing | Milestone payment tracker with placeholder bank transfer details (CBE / Awash / Telebirr). No live checkout pretending to charge cards. | `[Integration pending]` | Integrate compliant Ethiopian payment processors (Telebirr, CBE Birr, Chapa) and international Stripe once merchant accounts are verified. |
| **CR-07** | **Founders' Agreement & Equity Split** | Operations Dashboard (`/dashboard/documents`, `/dashboard/goals`) | Goal item #2 tracked in dashboard at 0% / Not started. Internal document template created. | `[Founder approval required]` | All five founders must review, sign, and archive the formal Founders' Agreement and Company Charter. |
| **CR-08** | **Developer Platform & SDK** | Customer Portal (`/portal/developer`), API Docs | Developer sandbox foundation live with sandbox API keys (`eag_test_...`), mock webhook triggers, and TypeScript/Python SDK code examples. | `[Coming soon]` | Backend and AI specialists to review production rate limits, webhook delivery retries, and API token generation scope. |
| **CR-09** | **Domain & DNS Setup** | Infrastructure, Email | Local and staging environment active. Production domain pending final registrar assignment. | `[Integration pending]` | CEO to secure primary domain (e.g., `eagletechnology.et` / `eagletechnology.com`) and configure DKIM, SPF, and DMARC DNS records. |
| **CR-10** | **Terms of Service & Privacy Policy** | Public Pages (`/terms`, `/privacy`), Footer | Live dedicated legal and privacy disclosures aligned with Ethiopian electronic commerce laws and international privacy baselines, explicitly marked with review status notices. | `[Founder approval required]` | Founders to submit draft terms for review by an Ethiopian legal specialist prior to high-volume commercial launch. |

---

## 3. Separation of Concerns Audit

- **Public Marketing Website (`/`, `/about`, `/solutions`, `/work`, `/insights`, `/contact`)**:
  - Contains **zero** private customer records, zero internal founder task data, zero internal meeting notes, zero raw credentials.
  - Answers the 7 core business questions clearly: What Eagle does, who Eagle helps, what problems Eagle solves, why to trust Eagle, next steps, onboarding process, and post-signup value.
- **Private Customer & Partner Portal (`/portal/**`)**:
  - Accessible only to authenticated client/partner roles.
  - Provides active project milestone tracking, deliverable review/acceptance, structured change request submission, and Developer Sandbox preview.
- **Private Founder Operations Dashboard (`/dashboard/**`)**:
  - Accessible only to the 5 authenticated founding roles (`ceo`, `frontend`, `backend`, `design`, `ai-automation`).
  - Isolated behind HTTP-only HMAC-signed session cookies and scrypt cryptographic validation.

---

## 4. Verification Sign-Off

This register is maintained under version control in the workspace root. Any modification to public claims or service definitions must be logged here and approved by the founding team.
