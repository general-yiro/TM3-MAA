# TM Sports — Web App Implementation Plan (Tier 1 MVP + Tier 2 Previews)

Complete digital platform for **TM Sports** (serving 150–300 active athletic members across USA & Canada), featuring high-converting public landing and service pages, member self-service portal, single-owner admin operations console, and interactive previews of Tier 2 Stripe payment and Telegram automation workflows.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during the alignment phase and govern the architectural blueprint:

- **Confirmed Scope**: Tier 1 MVP foundation (Public Website, 7 Services, Timetable Schedule, Announcements, Member Portal, Admin Panel, Manual Approval Flow) with interactive interactive working previews of Tier 2 (Stripe Checkout simulator, Telegram Bot notification stream, interactive class registration & capacity tracker).
- **Confirmed Visual Identity**: Athletic Blaze Orange (`#FF5500` / `#EA580C`) paired with deep Slate Charcoal (`#0F172A` / `#1E293B`) and crisp off-white canvas. Energetic, bold, high-contrast, professional athletic club feel with clean display typography (`Barlow Condensed` / `Plus Jakarta Sans`) and tabular numeral figures.
- **Confirmed Role Switching**: Persistent, unobtrusive top/bottom evaluation bar allowing 1-click role toggling between **Visitor (Public)**, **Member (Alex Rivers - Active)**, **Pending Member (Sarah Lin - Pending)**, and **Admin (Coach Marcus - Owner)** with instantaneous state preservation.

---

## 1. Overview & Core Concept

- **What It Does**: TM Sports provides an all-in-one athletic club hub:
  1. **Public Showcase**: Hero story, 7 specialized disciplines (Aerobics, Strength Training, Dance, Taekwondo for Kids, 1-on-1 Personal Training, Open Gym, Hiking Events), weekly visual schedule, location & contact.
  2. **Membership Registration**: Dynamic onboarding questionnaire capturing health goals, selected sports, emergency contact, and family/kids details.
  3. **Member Dashboard**: Real-time membership status badge, active service enrollments, renewal requests, personal QR/check-in pass, and personalized announcements.
  4. **Admin Operations HQ**: Quick KPI counters (Active/Pending/Expired, monthly new signups, popular sports), searchable/filterable member directory, approval/rejection actions, manual renewal management, and announcement authoring.
  5. **Tier 2 Previews**: Live Stripe card payment checkout modal with instant status flip, and Telegram notification center showing alerts for announcements, schedule shifts, and event reminders.
- **Target Audience / Persona**:
  - *Current & Prospective Members* (adults & parents registering children for Taekwondo/events).
  - *Club Owner / Head Coach* needing an effortless, zero-friction administrative tool to manage members and post news without technical complexity.
- **Key Value**: Replaces scattered paperwork, manual chat messages, and untracked signups with an authoritative, unified digital hub.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Visitor & Public Navigation Flow**:
   - Lands on hero section with dynamic video/photo athletic motif and marquee stats.
   - Explores **Services Bento Grid** (Aerobics, Strength, Dance, Taekwondo, PT, Open Gym, Hiking) with clear schedules and pricing tiers.
   - Inspects weekly timetable with filterable day/category chips.
   - Browses official announcements and location/contact form.
2. **Onboarding & Registration Flow**:
   - Clicks "Join TM Sports" or service-specific CTA.
   - 3-step registration: Personal Details $\rightarrow$ Service & Program Selection $\rightarrow$ Emergency & Waiver.
   - Immediate feedback with `Pending Approval` confirmation state and welcome simulation.
3. **Member Portal Flow**:
   - Logged-in view showing digital membership badge (`Active`, `Pending`, or `Expired`).
   - Quick access to assigned classes, upcoming hiking excursions, and personal attendance history.
   - 1-click "Request Renewal" or "Simulate Online Stripe Renewal (Tier 2)".
4. **Admin Command Flow**:
   - Accesses `/admin` or switches role via toolbar.
   - Views key metrics strip (Total Members, Active vs Pending, Revenue estimate, Most Subscribed discipline).
   - Reviews pending registrations: Approve $\rightarrow$ auto-generates member ID and welcome email/telegram trigger; or Reject with custom note.
   - Announcement creator: Draft title, category, priority, and simulated broadcast to member feeds.
   - Event manager: Toggle free vs. paid hiking trips with registration caps.

### Visual Identity & Theme

- **Aesthetic Direction**: High-energy athletic performance, structured, athletic editorial layout adhering to strict anti-slop rules (no generic purple gradients, no pill badge sandwiches, no fake compiler tags).
- **Color Palette & Distribution (60-30-10)**:
  - *60% Neutral Canvas*: Slate-950 deep dark background (`#0A0F1D`) for hero and dark mode panels, or crisp pure white / off-white slate (`#F8FAFC`) for daylight reading with high legibility.
  - *30% Structural Surfaces*: Slate-900 / Slate-800 (`#1E293B`, `#0F172A`) with hairline borders (`border-slate-800` or `border-slate-200`).
  - *10% Athletic Accent*: Blaze Orange (`#FF5500` / `#F97316`) for primary action buttons, active tab indicators, and critical focal elements.
  - *Semantic States*: Emerald (`#10B981`) for Active, Amber (`#F59E0B`) for Pending, Rose (`#F43F5E`) for Expired.
- **Typography & Scale**:
  - *Display / Brand*: Athletic Condensed / Heavy Sans (`Plus Jakarta Sans` / `Barlow Condensed` tracking-tight).
  - *Body Prose*: Crisp, readable `Plus Jakarta Sans` or `DM Sans` (15px–16px, 1.6 line height).
  - *Data & Schedules*: Monospace tabular numerals (`tabular-nums font-mono`).
- **Interactive Feedback**:
  - 150ms hover transitions (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Toast notifications for administrative actions and registration submissions.
  - Interactive role switcher toolbar affixed safely at top-right or bottom-center.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Reactive State Store with Pre-Loaded Realistic Data**:
  - *Chosen Approach*: React Context + LocalStorage persistence seeded with 12 diverse athletic members (Taekwondo kids, aerobics regulars, hiking enthusiasts, PT clients) and real announcements.
  - *Why*: Enables instant zero-latency role toggling (switching from Visitor to Sarah Lin to Coach Marcus) without server cold starts or database credential setup, while persisting changes throughout user evaluation.
- **Decision 2: Tier 2 Interactive Previews Embedded Directly**:
  - *Chosen Approach*: Fully working Stripe-style checkout modal (simulating card input, test transaction processing, invoice generation, and status upgrade) and a Telegram Notification Drawer (simulating bot broadcast alerts to mobile users).
  - *Why*: Fulfills the user's selected preference to preview Tier 2 capabilities today without delaying Tier 1 delivery.
- **Decision 3: Zero-Pill & Top Bar Contract Compliance**:
  - *Chosen Approach*: Top navigation bar strictly adheres to the one-row, three-zone contract (`[TM Sports Wordmark] — [Home, Services, Schedule, Announcements, About] — [Join / Member Portal]`). All metadata rendered cleanly with unboxed text and typographic bullet separators (`·`).

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Bar Contract (Header)                       │
│  [TM Sports]       [Services · Schedule · News · About · Contact]      │
│                                            [Join / Member Portal / Admin]
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Interactive Role Switcher Ribbon                    │
│   [👁️ Visitor]   [👤 Active Member]   [⏳ Pending]   [🛡️ Club Admin]   │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│           Public Views            │ │           Portal Views            │
│  - Hero with Athletic Video/Photo │ │  - Member Dashboard               │
│  - 7 Service Bento Grid Cards     │ │    * Digital Membership Card & QR │
│  - Weekly Class Timetable         │ │    * Active Classes & Waitlist    │
│  - Latest Announcements           │ │    * Renewal & Payment Actions    │
│  - Registration Modal / Form      │ │  - Admin Operations HQ            │
│  - Contact & Map Directions       │ │    * Metrics & Analytics KPI Strip│
│                                   │ │    * Member Directory & Filter    │
│                                   │ │    * Approval / Rejection Queue   │
│                                   │ │    * Announcement Publisher       │
└───────────────────────────────────┘ └───────────────────────────────────┘
                  │                                   │
                  └─────────────────┬─────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Tier 2 Automation Previews                        │
│   - Stripe Checkout Simulation (Card processing, receipt, auto-renew)   │
│   - Telegram Bot Live Stream (Broadcast channel alerts & direct alerts)│
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Central State & Persistence (React + LS)               │
│   - Members State (Profile, Services, Status, Dates, Emergency Contacts)│
│   - Classes & Schedule Data (Capacity, Instructor, Time, Location)      │
│   - Announcements & Telegram Broadcast Stream                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Core Entities

```typescript
type MembershipStatus = 'active' | 'pending' | 'expired';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: MembershipStatus;
  joinDate: string;
  renewalDate: string;
  services: string[]; // e.g., ['Aerobics', 'Taekwondo Kids', 'Open Gym']
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes?: string;
  childProfile?: {
    childName: string;
    age: number;
    beltRank?: string;
  };
}

interface Service {
  id: string;
  title: string;
  category: 'group' | 'combat' | 'personal' | 'outdoor' | 'facility';
  shortDesc: string;
  fullDesc: string;
  weeklySchedule: string;
  pricing: string;
  spotsTotal: number;
  spotsFilled: number;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'event' | 'schedule' | 'facility' | 'urgent';
  content: string;
  pinned?: boolean;
}

interface TelegramAlert {
  id: string;
  timestamp: string;
  sender: 'TM Sports Bot' | 'Coach Marcus';
  message: string;
  target: 'all' | 'member' | 'admin';
}
```

### Interactive State Transitions

1. **New Registration**:
   - Visitor fills form $\rightarrow$ adds new record with status `pending`.
   - Admin receives visual alert counter in the top bar.
   - Admin clicks `Approve` $\rightarrow$ member flips to `active`, welcome Telegram message triggered, renewal date set to +30 days.
2. **Tier 2 Stripe Payment**:
   - Member with `pending` or `expired` status clicks "Pay via Stripe".
   - Realistic Stripe Checkout modal opens with test card auto-fill.
   - Processing spinner $\rightarrow$ payment succeeds $\rightarrow$ receipt generated $\rightarrow$ status immediately updates to `active`.
3. **Class Registration & Waitlist**:
   - Timetable shows live spots (e.g., 18/20 filled).
   - Member registers $\rightarrow$ spots increment; if full, option to join waitlist with simulated Telegram alert when a slot opens.
4. **Admin Announcement Publish**:
   - Admin drafts announcement $\rightarrow$ instantly updates public page, member dashboard feed, and Telegram broadcast simulation.
