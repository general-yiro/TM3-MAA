# 🏋️ TM Sports — Final Web App Proposal
### 3-Tier System | Finalized Blueprint

---

## 📋 Project Summary (Confirmed Details)

| Detail | Answer |
|---|---|
| **Location** | USA / Canada |
| **Languages** | English + Local language |
| **Members (current)** | 150–300 active members |
| **Payment Gateway** | Stripe |
| **Tech Stack** | Next.js (React) + Supabase |
| **Admin (T1)** | Single admin/owner |
| **Telegram** | New channel — to be created |
| **Taekwondo (Kids)** | Separate membership fee |
| **Hiking Events** | Mix — some free, some paid |
| **T1 Deadline** | ASAP — within 1 month |
| **Logo** | Available (no brand colors yet) |

---

## 🛠️ Recommended Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | Fast, SEO-friendly, modern React |
| **Backend / Database** | Supabase | Auth, DB, storage — all-in-one, generous free tier |
| **Authentication** | Supabase Auth | Google, Apple, Email sign-in built-in |
| **Payments** | Stripe | Industry standard for USA/CA, supports subscriptions |
| **Email** | Resend or SendGrid | Transactional emails (receipts, reminders) |
| **Telegram Bot** | Python (aiogram) or Node.js | Robust, well-documented Telegram Bot API |
| **Hosting** | Vercel (frontend) + Supabase cloud | Free to start, scales easily |
| **Styling** | Tailwind CSS + shadcn/ui | Beautiful, fast UI components |

**Monthly running costs at scale:**
- Vercel: Free → $20/month (Pro)
- Supabase: Free → $25/month (Pro at 500+ members)
- Stripe: 2.9% + $0.30 per transaction (no monthly fee)
- Email: Free → $20/month
- Telegram Bot: Free (hosted on a cheap VPS ~$5/month)

---

---

## 🟢 TIER 1 — MVP "Be Found & Grow"
### Timeline: 3–4 weeks | Goal: Live within 1 month

> The foundation. TM gets a professional online presence. Members can sign up, log in, and see their membership status. Admin has full control through a clean dashboard.

---

### 🌐 Public Website Pages

- **Home Page** — Hero banner, mission statement, quick service highlights, CTA buttons
- **Services Page** — Cards for each service with description, schedule, and pricing info:
  - Group Aerobics
  - Strength / Weight Training
  - Dancing Classes
  - Taekwondo for Kids
  - Personal Training (1-on-1)
  - Open Gym Access
  - Hiking Events
- **Schedule Page** — Visual weekly class timetable (static/informational at T1)
- **Announcements Page** — Latest news, closures, events (posted by admin)
- **About Us Page** — TM's story, team, values
- **Contact & Location Page** — Map embed, phone, email, social links, contact form

---

### 🔐 Authentication

- Email + Password sign-up/login
- **Google Sign-In** (OAuth)
- **Apple Sign-In** (OAuth)
- Email verification on sign-up
- Password reset via email
- Role system: **Member** | **Admin**

---

### 👤 Member Dashboard (After Login)

- Profile: Name, photo, phone, date of birth, emergency contact
- Membership status badge: `Active` / `Pending` / `Expired`
- Which service(s) they're enrolled in
- Announcements feed (same as public, but personalized greeting)
- Option to request a membership renewal (manual at T1)

---

### 🔧 Admin Panel (T1 — Single Admin)

- **Members List** — View all registered members, filter by status, search by name
- **Member Detail View** — Profile, membership status, service selected, join date
- **Approve / Reject / Activate / Deactivate** member accounts manually
- **Announcements Manager** — Create, edit, delete, publish announcements
- **Basic Dashboard Stats:**
  - Total members
  - Active vs Pending vs Expired
  - New sign-ups this month
  - Which services are most subscribed

---

### 💳 Membership Registration Flow

1. Visitor fills out registration form on the website
2. Selects their desired service(s) and membership type
3. Submits → status is `Pending`
4. Admin receives notification (email) → reviews and approves
5. Member status changes to `Active`, they get a welcome email
6. *(Payment is manual / in-person at T1 — Stripe added in T2)*

---

### 🎨 Branding (T1)

Since you have a logo but no brand colors, I will:
- Extract colors from your logo and build a cohesive color palette
- Use those colors throughout the entire design
- Build a modern, energetic design fitting for a sports/fitness brand
- Ensure the site looks stunning on mobile and desktop

---

**✅ T1 Total Feature Count: ~35 features**
**⏱ Build Timeline: 3–4 weeks**
**💰 Build Cost (hiring):** $8,000–$15,000
**💰 Build Cost (us building it):** $0 (just hosting costs below)
**🔁 Monthly Running Cost:** ~$0–50/month (free tiers cover 150–300 members easily)

---

---

## 🔵 TIER 2 — "Automate & Connect"
### = Tier 1 + All of the below | Timeline: +6–8 weeks

> Stripe payments go live. Telegram bot goes live. Members get automated reminders. Admin gets a richer control panel and revenue visibility.

---

### 💳 Online Payments (Stripe)

- Members pay for membership online during registration
- Recurring monthly/annual subscription billing (auto-renew)
- Self-service renewal from dashboard
- Stripe-hosted checkout (secure, no card data stored by TM)
- Automatic email receipt after payment
- Admin sees full payment history per member
- Admin can issue refunds from the panel
- Stripe webhook for instant membership activation after payment

---

### 🤖 Telegram Bot (New channel + Bot)

**Setup:**
- Create TM's official Telegram channel
- Build a custom bot that members subscribe to
- Members link their Telegram to their TM account with one click

**Automated Notifications sent to members:**
- 📢 New announcements (auto-posted when admin publishes one)
- ⚠️ Membership expiry reminders — 7 days, 3 days, 1 day before
- ✅ Membership renewed/activated confirmation
- 📅 Class schedule & weekly timetable (posted every Sunday/Monday)
- 🥾 Hiking event registration confirmation + reminder 2 days before event
- 💳 Payment receipt notification
- 👋 New member welcome message
- 👶 Child pickup reminders + Taekwondo check-in confirmation

**Admin Telegram Alerts:**
- New registration submitted (pending approval)
- Payment received
- Member renewal

**Admin Broadcasting:**
- Admin sends a message from the web panel → it goes to all bot subscribers instantly

---

### 📅 Interactive Class Schedule

- Real-time timetable with class details
- Members can **register interest** in a class (waitlist/pre-signup)
- Admin can see headcounts per class
- Schedule changes auto-notify affected members via Telegram

---

### 🔔 Enhanced Email Automation

- Welcome email on account creation
- Approval/rejection email
- Payment receipt with itemized invoice
- Expiry reminder emails (7 days + 3 days + 1 day)
- Re-engagement email for lapsed members

---

### 📊 Enhanced Admin Panel

- **Revenue Dashboard:** Monthly income, payment trends chart
- **Upcoming Expirations:** List of members expiring in next 14 days
- **Member Management:** Advanced search, filter by service, status, date
- **Announcement Scheduler:** Write now, publish later
- **Export:** Download full member list + payment data as CSV/Excel
- **Hiking / Event Manager:** Create events, set capacity, mark free vs paid

---

**✅ T2 Total New Features: ~30 additional**
**⏱ Build Timeline: +6–8 weeks after T1**
**💰 Build Cost (hiring):** +$12,000–$25,000
**💰 Build Cost (us):** $0 build + services below
**🔁 Monthly Running Cost:** ~$50–150/month
*(Supabase Pro ~$25, email ~$20, Stripe % on revenue, Telegram bot VPS ~$5)*

---

---

## 🔴 TIER 3 — "Full Operations HQ"
### = Tier 2 + All of the below | Timeline: +10–16 weeks

> TM manages every aspect of its business from one platform. Full class booking, children profiles, employee management, payroll, and detailed financials.

---

### 📆 Full Class Booking System

- Real-time online booking for every class type
- Capacity limits per class with automatic waitlist
- Waitlist auto-promotion: spot opens → next person gets Telegram/email alert
- Cancellation with configurable window (e.g., cancel 2hrs before, no penalty)
- **Personal Training booking:** Pick trainer → pick available slot → confirm
- **Open Gym booking:** Reserve a time slot to use the gym
- **Taekwondo (Kids) booking:** Parent books on behalf of child
- **Hiking registration:** Register + pay in one step (for paid events)

---

### 👶 Children & Family Module

- Parents add children under their account
- Each child has their own profile: name, age, photo, health notes
- Separate enrollment and attendance tracking per child
- Child pickup reminder notifications to parent (Telegram + push)
- Taekwondo class check-in/check-out confirmation sent to parent
- Emergency contact per child visible to trainer/admin

---

### 💼 Internal ERP — Employee Module

- **Employee Profiles:** Name, role, phone, contract, start date, photo
- **Role System:** Admin | Trainer | Receptionist | Manager
- **Staff Schedule Planner:** Weekly planner showing who teaches what, when
- **Attendance Tracking:** Clock-in / clock-out (web or manual entry)
- **Leave Management:**
  - Employee submits leave request
  - Admin approves/denies
  - Leave balance tracked (vacation, sick, personal)
  - Company-wide leave calendar
- **Payroll Module:**
  - Define each employee's rate (hourly or salary)
  - Auto-calculate monthly gross pay from hours worked
  - Add bonuses, deductions
  - Generate PDF payslip per employee per month
  - Employee self-service: log in to see their own payslips
- **Trainer Commission Tracking:** Track PT sessions led → calculate commission

---

### 💰 Full Financial Dashboard

- **Income:** Memberships + PT sessions + events + classes — categorized
- **Expenses:** Salaries, utilities, equipment, rent — manual entry
- **Profit & Loss:** Monthly, quarterly, yearly view
- **Cash Flow Chart:** Visual graph of income vs expense over time
- **Outstanding Payments:** Members who haven't paid, with quick action button
- **Revenue Forecast:** Projected next-month income from active subscriptions
- **Export:** Full financial report to PDF or Excel (accountant-ready)

---

### 📊 Advanced Analytics

- Member retention rate (renewed vs churned by month)
- Most popular classes by attendance
- Attendance heatmap (busy days/times)
- Revenue breakdown by service category
- New vs returning members per month
- Trainer performance (sessions led, attendance rate)

---

### 📱 Progressive Web App (PWA)

- Members can "install" the TM app on their phone home screen
- Push notifications (without needing Telegram)
- Offline access to schedule and profile info
- Fast, app-like experience on any device

---

### 🔐 Advanced Security

- Two-factor authentication (2FA) for admin logins
- Detailed audit log: every admin action logged with timestamp
- GDPR-compliant: members can request full data export or account deletion
- Role-based access control for all admin features
- Automatic session expiry for security

---

**✅ T3 Total New Features: ~50 additional**
**⏱ Build Timeline: +10–16 weeks after T2**
**💰 Build Cost (hiring):** +$25,000–$55,000
**💰 Build Cost (us):** $0 build + services
**🔁 Monthly Running Cost:** ~$150–400/month
*(Supabase Pro, email, Stripe, Telegram, push notification service, analytics)*

---

---

## 💲 Total Cost Summary

| | T1 Only | T1 + T2 | T1 + T2 + T3 |
|---|---|---|---|
| **Build (Agency/Dev)** | $8K–$15K | $20K–$40K | $45K–$95K |
| **Build (Us / Self)** | $0 | $0 | $0 |
| **Monthly Running** | $0–$50 | $50–$150 | $150–$400 |
| **Timeline** | 3–4 wks | 9–12 wks | 19–28 wks |

> [!IMPORTANT]
> If we're building this together (you + me), the development cost is essentially **$0**. You only pay the monthly service fees above. This is a massive cost advantage vs hiring an agency.

---

## 🗺️ Recommended Rollout Plan

```
MONTH 1  →  🟢 T1 LIVE: Website, sign-up, basic admin
             Start collecting members online immediately
             
MONTH 2-3 →  🔵 T2 BUILD: Stripe payments + Telegram bot
             
MONTH 3-4 →  🔵 T2 LIVE: Members pay online, get Telegram alerts
             
MONTH 5-8 →  🔴 T3 BUILD: Full booking + ERP + financials
             
MONTH 8+  →  🔴 T3 LIVE: Complete operations platform
```

---

## 🎯 Next Steps

1. **Share your logo** so I can extract brand colors and start the design
2. **Confirm the feature list for T1** — anything to add or remove?
3. **We start building T1** — targeting live within 4 weeks
4. Meanwhile, **we plan T2** feature-by-feature in parallel

> [!TIP]
> Once you share the logo, I can generate a full mockup of the homepage so you can see the design before a single line of code is written. Just say the word!
