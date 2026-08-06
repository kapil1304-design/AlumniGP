# AlumniGp — Product Vision Document

**Date:** 2026-07-28
**Status:** Vision (north-star). Not an implementation spec. v1 build will be scoped in a follow-up plan.
**Owner:** Kapil

---

## 1. Product Summary

**AlumniGp is a curated, intentional network for people who have crossed paths — classmates, coursemates, colleagues, and campus companions.** It reconnects them for career, life, and community, without becoming another noisy recruiting platform.

The platform is **emotion-filled at heart and professional in surface**. It optimizes for genuine, deliberate connections — not follower counts, not cold outreach, not mass hiring. Every reach-out beyond your immediate circle is a small, considered act, which keeps the platform trustworthy and spam-free by design.

**One-line pitch:** *"Your class, forever free. The rest of the world, one deliberate reach at a time."*

---

## 2. Target Audience

**Educational and geographic communities only, global from day 1:**

- **Schools** (K-12) — reconnecting old classmates, teachers, and school-year cohorts.
- **Colleges & Universities** — undergraduate and postgraduate batches, across departments and campuses.
- **Courses** — online courses (MOOCs), bootcamps, certifications, offline short courses — cohorts of people who learned the same thing at the same time, whether or not through a formal institution.
- **Cities** — city-wise circles for local meetups and reconnection, whether or not you studied there. Useful when a member relocates and wants to find others in their new city.

**Workplaces, offices, and companies are explicitly OUT OF SCOPE.** The platform is deliberately non-commercial in its affiliation model — every circle is educational or geographic. Ex-colleague reconnection is not a use case supported here.

**Geographic scope:** Global from launch. English at start; framework supports additional languages (Hindi, Spanish, Mandarin, Arabic, etc.) rolled out post-beta. Address handling uses a global-capable Maps API from day one.

**Institute/circle directory model:** User-generated. There is no pre-loaded list of schools, colleges, courses, or cities. Users can:
- Search and filter existing schools / colleges / courses / cities,
- Or create a new one if theirs doesn't exist. The creating user becomes the first member, but does **not** become an admin.
- No school, college, course provider, city authority, or circle receives official verification power inside the product.

---

## 3. Platform Identity & Principles

These principles override any feature idea that conflicts with them.

1. **Intentional over unlimited.** No subscription that grants unlimited outreach. Every cross-circle interaction has a small cost so it stays deliberate.
2. **Emotional but professional in public.** The public feed, profiles, and search remain professional. Anything personal (including romance, if it arises) happens privately in DMs — not in shared channels, not in profile flags.
3. **Trust comes from peers, not from purchase.** Verified status is earned by peer vouching, never sold.
4. **Rank honestly.** Search results are ordered by relevance to the query, not by who paid more.
5. **Anti-spam by design.** No bulk outreach tools, no recruiter accounts, no mass DM, no paid "priority visibility." Ever.
6. **Free tribe, paid explorer.** Your home circle is free forever. Reaching outside your home circle is where money changes hands.
7. **Small, respectful money flows.** Prefer packaged, low-friction top-ups over subscriptions or per-click credits.
8. **No member-admin hierarchy.** Circle creators and early members do not receive moderation or enforcement powers. Abuse handling is centralized with the platform admin.

---

## 4. Circle Model

### 4.1 Structural units

**Circle** — the primary unit of the platform. Four types exist:

- **School** — a K-12 institution. Created by any user; approved as-is (verification is at the member level, not the school level).
- **College / University** — an undergraduate or postgraduate institution, including individual campuses.
- **Course** — an online course, MOOC, bootcamp, certification, or offline short course. Not tied to a formal institute — e.g., "Andrew Ng Coursera Machine Learning, 2020" or "Le Wagon Berlin Batch 42".
- **City** — a geographic circle for local meetups and reconnection. A user may live in a city without having studied there.

**Home Circle = Circle + Batch year (or cohort period for Course, or membership period for City)** — the required primary affiliation for every member. Examples:

- `Delhi Public School RK Puram + Batch of 2010` (School)
- `IIT Bombay + Batch of 2018 + CSE tag` (College)
- `Coursera Deep Learning Specialization + 2021` (Course)
- `Bangalore + resident since 2022` (City)

A user's home circle is their **free tribe** — all interactions inside it (chat, events, member browsing, connecting) cost nothing, forever.

**Multi-affiliation is the norm, not the exception.** A typical user will belong to several home circles at once — their school + college + one or two courses + their current city + past cities they studied in. Each home circle is independently free. The switcher between circles is a primary UI element.

### 4.2 Optional tags on each home-circle membership

Tags refine identity without splitting the circle:

- Department / Course (CSE, Mechanical, MBA, MBBS, Marketing, etc.)
- Section (A / B / C)
- Hostel / House
- Clubs & societies (Robotics, Cricket, Debate)
- Degree level (UG / PG / PhD)
- City of study or work

Tags are **filters**, not walls. Someone in your batch searching "CSE alumni" simply narrows the view — they do not enter a separate circle.

### 4.3 Optional user-created micro-circles

Any member of a home circle can create a **micro-circle** for a closer circle: e.g., `IIT Bombay CSE 2018`, `IIT Bombay Robotics Alumni 2015-2020`, `Delhi HQ 2020-2023 Marketing Team`.

- Invite-only or open-join
- Micro-circles have their own chat, events, and member list
- If you are a member of a micro-circle, it counts as your **free tribe** for that scope
- Micro-circles do NOT create additional paywalls; they are convenience spaces
- Micro-circle creators can invite members and manage basic micro-circle details, but cannot warn, remove, ban, or discipline members. Enforcement remains with the platform admin.

### 4.4 Cross-circle behavior

Everyone outside your home circles and micro-circles is an **external contact**. Reaching them (unlock profile, DM, referral request) requires paid wallet money — as per Section 8.

Different batches of the same institute are **different circles**. A 2018 alumnus reaching a 2019 alumnus is a paid interaction.

### 4.5 Institute deduplication & naming

Because the institute directory is user-generated, two members may inadvertently create the same institute under different names (e.g., "IIT Bombay" and "Indian Institute of Technology, Bombay"). To prevent fragmentation:

- **Fuzzy-match at creation:** when a user starts typing a new institute name, the system suggests existing near-matches; the user must explicitly choose "still create new" if none fit.
- **Merge proposals:** any member of an institute can propose a merge with another; the merge requires broadcast + peer approval from a minimum threshold of both circles' verified members. Actual merge is executed by platform admin.
- **Canonical name:** each institute has a canonical display name and can hold aliases (e.g., "IIT Bombay" alias of "Indian Institute of Technology Bombay") — search matches all aliases.
- **Location as a tiebreaker:** two institutes with identical names but different cities remain separate (e.g., "St. Xavier's Mumbai" vs. "St. Xavier's Kolkata").

### 4.6 Leaving a circle, deleting an account, memorialization

- **Leaving a circle:** a member may leave any of their circles at any time. Chat history they authored remains visible to others (like leaving a WhatsApp group); their profile is no longer surfaced to that circle's members.
- **Deleting an account:** a member may delete their account. All personal data is purged within 30 days; content they posted is anonymized ("former member") rather than deleted, to preserve conversational continuity for others.
- **Memorialization (v2):** family members can request that a deceased member's account be memorialized — profile marked "In memory of," posts frozen, no further logins accepted. Requires proof of death per platform-admin policy.

---

## 5. User Types & Profiles

### 5.1 Alumni Member (the primary user)

Profile fields — **collected in full at signup** (see §9.1). No lazy "complete your profile later" pattern.

- **Identity:** Full name, profile photo, cover photo (optional), short bio, pronouns (optional), date of birth (used for the 16+ age gate; only birth year shown publicly).
- **Affiliations (1..N home circles), at least one required at signup:** For each — circle type (School / College / Course / City), name of the school/college/course provider/city, batch year (or cohort / residency period), tags (department, degree level, section, hostel, clubs, course provider, sub-course), start & end dates, role (student / alumnus / current resident).
- **Current life:** Current city (address via global Maps API), preferred contact language, languages spoken.
- **Skills & interests:** Free-form + suggested tag chips (learn later, mentor others in, curious about).
- **External links:** Personal website, LinkedIn, GitHub, portfolio (optional, member choice to display).
- **Credentials (optional at signup, expandable later):** Education/course certificates, or supporting documents where voluntarily provided. Government/citizenship ID is optional, consent-based, and requested only when legally appropriate for a specific trust or safety review. Sensitive documents are private, encrypted, access-controlled, and never shown publicly.
- **Trust signals:** Peer-vouched verified badge, number of vouches received, account age, and profile completeness.
- **Privacy controls:** Which fields are visible to (a) home circle only, (b) unlocked external contacts, (c) nobody.

### 5.2 Circle Creator / First Member

The first user who creates a new institute/circle becomes the first member, not an admin. They can:

- Invite known people into the circle via WhatsApp or email
- Approve the second member's request to join (bootstrap-only authority — see clarification below)
- Participate in normal peer-vouching after the circle grows
- Report abuse or raise alerts to the platform admin

They cannot warn, remove, ban, mute, moderate chat, promote co-admins, or control the circle as an authority figure.

**Bootstrap-only authority clarification:** The first member's power to approve the second (and, together with member #2, the third) exists only to let a brand-new circle grow past the "chicken-and-egg" phase. Once the circle reaches 3 members, the standard peer-vouching rule takes over and the first member has no residual authority beyond that of any other member. There is no permanent "founder admin" role.

### 5.3 Micro-circle Creator

Micro-circle creators can invite people and edit basic micro-circle details, but they do not receive enforcement powers.

### 5.4 Platform Admin (internal, us / owner)

The platform admin is the only authority with enforcement power. Platform admin can:

- Review raised alerts and abuse reports
- Issue warnings
- Remove members from a circle
- Suspend or ban accounts
- Suspend institutes/circles in severe cases
- Review identity/document evidence when required
- Override peer-vouch decisions in edge cases such as harassment, impersonation, fraud, or safety risk
- Handle wallet disputes

### 5.5 Not offered

**No recruiter accounts. No employer accounts. No B2B/Institute-management tier. No institute verification. No circle-admin or moderator roles for members.** Institutes are member-created communities, not paying B2B customers.

---

## 6. Verification & Trust

### 6.1 Peer-vouching (the default, primary method)

When a new user requests to join a home circle:

1. If the requester came through a WhatsApp/email invite, the invite must be bound to the exact invited email address or phone number.
2. For email invites, the OTP must go only to the predefined invited email address. The user cannot join the circle using a different email address.
3. A **broadcast alert** goes to currently verified members of that circle.
4. Any verified member can approve or object.
5. Once **3 approvals** are received, the requester is admitted.
6. Objections or abuse concerns trigger platform-admin review before admission.

### 6.2 Edge cases

- **Brand-new institute/circle (0 members yet):** The creator is automatically admitted as the first member, but receives no admin powers.
- **Circle with 1 existing member:** The second member can join only after approval by the first member, preferably through a bound WhatsApp/email invite.
- **Circle with 2 existing members:** The third member can join after approval by the existing members. The 3-approval rule does not apply yet because there are not enough members.
- **Circle with 3 or more existing members:** Standard 3-approval rule applies. If 30 days pass without 3 approvals, the case escalates to platform admin for manual review.
- **Document support:** A user may optionally upload proof such as an ID card, degree/certificate, employment proof, citizenship card, or other government ID only with explicit consent and only where legally appropriate. These documents are used only for specific trust/safety review cases and are not visible to ordinary members.

### 6.3 Trust signals surfaced on profile

- "Verified by N members of [Circle]"
- Peer vouch count over time
- Account age
- Profile completeness and credential-review status where applicable

### 6.4 Verified badge is never sold

Badges are strictly earned via peer vouching. Any premium tier that includes "instant verification" is explicitly excluded from this platform's roadmap forever.

---

## 7. Core Features (by access tier)

### 7.1 Free (everyone, forever, unlimited)

Everything **inside your home circles and micro-circles**:

- Circle chat (real-time messaging feed)
- Events tab (create, RSVP, remind for reunions, meetups)
- Members tab (browse, filter by tag, connect)
- Announcements (platform-admin pinned for official notices; circle activity posts remain member-created)
- Institute page (about, gallery, history, notable alumni)
- Notifications (new members, events, mentions) — with **digest mode** for high-activity circles: users can opt into a single daily/weekly summary rather than per-event alerts, so a batch of 500 doesn't spam every member on every join request
- Profile viewing of anyone in your circles
- Direct messaging with anyone in your circles
- Reporting, blocking, "not interested"
- Editing your own profile, uploading documents for peer vouching

### 7.2 Free with signup bonus wallet (~₹100 / $10 one-time)

The signup wallet bonus buys **exploration only** — enough to feel curiosity, not enough to spam:

- Enter external circles to browse
- Search across the entire platform with all filters
- See match previews (name, institute, batch, current role/city) — enough to know it's the right person

**Explicitly cannot** use bonus balance to unlock full contact info, send a DM, or request a referral. Those actions require paid (real-money) wallet balance.

### 7.3 Paid wallet — circle-entry packs

The **only** paid interaction model. There is no subscription.

Users top up their wallet with real money and spend it on **circle-entry packs**:

- **Small pack** — Entry to one external circle + up to 3 contacts (each contact = unlock full profile + send one DM). Fixed low fee.
- **Large pack** — Entry to one external circle + up to 10 contacts, better per-contact price.

A "contact" = one external person whose full profile you unlock and to whom you send a first message. Once the recipient replies, the conversation continues freely between the two of you without further pack deduction.

Additional packs can be purchased at any time. Wallet balance never expires. Unused balance stays in the user's account (and in our platform float).

### 7.4 Explicitly excluded features (never)

- Subscription plans of any kind
- Unlimited-DM or unlimited-outreach tiers
- Priority visibility / paid ranking boosts
- Advanced filters as a paid gate (all filters are free)
- Paid verified badges
- Public job board / bulk job postings
- Recruiter accounts, employer accounts, B2B institute plans
- Bulk-outreach or mass-DM tools
- Public dating / matchmaking / "looking for" indicators
- Ads
- Bulk Excel/CSV loading of members
- Institute-controlled verification or institute admin dashboards
- "People you may know" / mutual-connections / second-degree suggestion surfaces (would create the same cold-outreach dynamic we're avoiding)
- Public "who viewed your profile" lists (encourages vanity behavior)

---

## 8. Payment Plans

### 8.1 Model — wallet only

- One-time **signup bonus:** ~₹100 / $10 equivalent (exploration only, per Section 7.2)
- **Top-up packs** (indicative, tuned during beta):
  - ₹200 / $2.50
  - ₹500 / $6
  - ₹1000 / $12 (bonus balance added)
  - ₹2000 / $24 (larger bonus balance added)
- Multi-currency, geo-detected default currency

### 8.2 Circle-entry pack pricing (indicative, tuned during beta)

- Small pack (1 external circle, up to 3 contacts): ₹99 / $1.20
- Large pack (1 external circle, up to 10 contacts): ₹249 / $3

Exact numbers finalized after early user testing.

### 8.3 Payment gateway integration — deferred

The wallet ledger, pack semantics, and all UX are built during beta. **Real-money top-ups are integrated after beta is validated.** Until then, top-ups are simulated (test-mode) so all product behaviors can be exercised end-to-end.

At launch, integrations include:
- **Stripe** for international payments
- **Razorpay** for India (UPI, cards, netbanking, wallets)
- Additional regional gateways added as demand emerges

### 8.4 Refunds & disputes

- Unused wallet balance is refundable within a 30-day window from top-up, minus payment-gateway fees. After 30 days, balance is non-refundable but never expires.
- Contact packs are non-refundable once used, but if a contact turns out to be a fake account (later detected), the pack contact is credited back.
- Platform admin adjudicates disputes.

### 8.5 Revenue streams (all wallet-driven)

1. Circle-entry packs (primary)
2. Wallet-balance float (secondary, cash-flow benefit)
3. Small non-refunded balance drift (tertiary)

---

## 9. Usage Flows

### 9.1 Onboarding (new user, first time)

Onboarding is **one long, deliberate registration form** — not a lazy drip. Rationale: a platform for intentional connection should ask users to be intentional at the door. All required profile fields are collected before the user enters the app.

**Step 1 — Email OTP:** User enters email → receives 6-digit OTP → verifies. This is the only credential the platform stores; no password.

**Step 2 — Age gate:** User enters date of birth. If under 16, signup is blocked with a friendly explanation and a "come back when you're 16" note.

**Step 3 — Identity block:** Full name, profile photo, pronouns (optional), current city (via global Maps API), short bio, languages spoken.

**Step 4 — Affiliations (at least one required):** User adds one or more home circles. For each affiliation:
- Choose type: School / College / Course / City
- Search existing circles → select if found, or create if not (becomes first member per §5.2)
- Specify batch year, cohort period, or residency period as appropriate
- Add optional tags (department, section, hostel, clubs, sub-course, etc.)
- If they came via a bound WhatsApp/email invite, the OTP goes only to the predefined invited address; the account cannot switch to a different address to claim the invite.

**Step 5 — Skills & interests + optional external links.**

**Step 6 — Privacy preferences.**

**Step 7 — Submit:** account is created. For each affiliation, a join request is broadcast to that circle's verified members. Until 3 vouches arrive (or bootstrap rules apply), the user is in "unverified" state — can view public circle pages but cannot post in circle chat or receive cross-circle contact requests.

**Step 8 — Verified:** signup wallet bonus (~₹100 / $10) credited, full home-circle access unlocked, welcome mail sent.

### 9.1a Login (returning user)

**Passwordless, email-OTP only:**
1. User enters email → 6-digit OTP sent → enters OTP → session cookie issued.
2. Sessions are long-lived on trusted devices, short-lived on new devices; user can revoke sessions from a "Devices" panel.
3. Google / Apple sign-in may be added later as an optional convenience, but email OTP remains the default and always available.
4. No password field exists anywhere in the platform.

### 9.2 Adding more affiliations later

- User can add another affiliation (a school, college, course, or city) at any time — each triggers its own home-circle verification flow. All required affiliations were collected at signup (§9.1); adding more later is optional.

### 9.3 In-circle daily use (free)

Open the app → land on home feed showing all your home circles' recent activity, event reminders, announcements → tap into any circle → chat, RSVP, browse members, connect.

### 9.4 Cross-circle discovery (mostly free, contact is paid)

1. Search bar: filter by school / college / course / city, batch year, department, current city, skills.
2. See match previews with basic info — free, powered by signup bonus balance or normal browsing.
3. Find a person you want to reach → "Contact" button prompts a pack purchase (Small or Large) if you don't have an active pack for that external circle.
4. Pay pack fee (deducted from wallet balance) → full profile unlocked + you can send one DM.
5. If they reply, conversation is free from that point.
6. Pack lasts for that external circle only; contacting someone in a different circle requires a new pack.

### 9.5 Reporting & moderation

- Any user can report a message, profile, event, or member → routed to platform admin → platform admin can warn, remove, suspend, or ban depending on severity.

---

## 10. User Benefits

### 10.1 Alumni Member

- **Free forever** for their class/team/batch — no financial commitment to stay in touch.
- Rediscover long-lost classmates and colleagues.
- Get personal referrals when job-hunting (via 1-on-1 paid contact).
- Attend real reunions and meetups organized by their circle.
- Trusted network — peer-vouched, spam-free, no cold outreach.

### 10.2 Circle Creator / Early Member

- Help start the circle without becoming responsible for moderation.
- Invite known classmates, colleagues, or batchmates by WhatsApp/email.
- Raise alerts when something is wrong, while enforcement remains with the platform admin.

### 10.3 Platform (us)

- Trust-driven, defensible community model.
- Wallet-based revenue with float benefits.
- Low customer-support surface due to the anti-spam design.

---

## 11. Accessibility Commitments

- **WCAG 2.2 AA compliance** across web (and later, mobile).
- Full keyboard navigation, ARIA labeling, screen-reader friendliness.
- Color contrast meeting AA thresholds; user-selectable text size.
- **Multi-language support** built in from the start (English at launch, additional languages rolled out during and after beta): i18n framework in place, all user-facing strings extractable.
- **Mobile-first responsive web** before native app ships.
- Reduced-motion mode respected.
- Alt text mandatory for user-uploaded images posted in public spaces (announcements, institute page).

---

## 12. Non-Functional Requirements

- **Global Maps API** integration from day one for addresses (institute location, member current city, event venues). Provider TBD (Google Maps / Mapbox / OpenStreetMap-based).
- **Data protection:** GDPR (EU), DPDP (India), CCPA (California) compliant. Full data export and delete-my-account flow.
- **Content moderation:** report flows, admin dashboards, keyword filters for known abuse patterns, human review pipeline.
- **Anti-spam by design:** no bulk-outreach tools, ever. Rate limits on DMs even inside home circles (e.g., first-time DM to any given recipient throttled to N/hour; abusive burst patterns auto-flagged for platform-admin review).
- **Search privacy:** external-circle searches do NOT reveal to the target who searched for them. There is no "who viewed your profile" surface.
- **Payments-agnostic ledger:** wallet balance stored in a gateway-neutral ledger table; gateway integration is a plug-in layer.
- **Reliability targets:** 99.5% uptime for beta, 99.9% at launch.
- **Security:** email verification, 2FA optional for users and mandatory for platform admins, password hashing (Argon2 or bcrypt), CSRF/XSS protection standard, audit log for platform-admin actions.

---

## 13. Recommended Tech Stack (indicative, to be finalized in v1 plan)

- **Frontend:** Next.js (React) with TypeScript. Server components for SEO on public institute pages.
- **Backend:** Node.js API (colocated in Next.js) or a dedicated service — decision in v1 plan. TypeScript throughout.
- **Database:** PostgreSQL (relational, strong integrity for wallet + memberships).
- **Object storage:** S3-compatible (profile photos, documents, event images).
- **Realtime chat:** WebSockets (Pusher / Ably / self-hosted).
- **Search:** PostgreSQL full-text at first; migrate to a dedicated engine (OpenSearch / Meilisearch) as scale demands.
- **Maps:** Google Maps or Mapbox — decision in v1 plan.
- **Auth:** email-OTP only (passwordless) via Auth.js or a lightweight custom flow. Sessions are cookie-based, long-lived on trusted devices, revocable per device. Google/Apple sign-in may be added as optional convenience in a later phase but is not primary.
- **Payments (deferred):** Stripe + Razorpay behind a gateway-neutral wallet ledger.
- **Hosting:** Vercel or Netlify for frontend; Railway / Fly.io / AWS for backend and DB.
- **Mobile (later):** React Native or Expo, reusing the API layer.

---

## 14. Roadmap Phases

### Phase 0 — Beta (no real money)

- Email-OTP signup and login (passwordless)
- All-details-at-signup registration form (identity + at least one affiliation + skills + privacy)
- Circle creation + search across all four types (School / College / Course / City)
- Home circle model (circle + batch year / cohort period + tags)
- Multi-affiliation supported from day one; circle switcher in the UI
- Invite-bound onboarding via WhatsApp/email
- Peer-vouching verification with early-member exceptions and 3-approval rule after the circle reaches 3 members
- In-circle chat, events, members, announcements, circle page
- Raise alert / report abuse flow with platform-admin action tools
- Cross-circle search with filters + match previews
- Wallet ledger + pack purchase flow (test-mode only, no real gateway)
- Simulated top-ups so all flows are exercised end-to-end
- WCAG 2.2 AA baseline
- English UI

### Phase 1 — Public Launch

- Payment gateway integration: Stripe (global) + Razorpay (India)
- Real wallet top-ups, real pack purchases
- Multi-language rollout begins (Hindi + one more)
- Micro-circles (user-created)
- Refund flow

### Phase 2 — Depth

- Advanced platform-admin tools (reports queue, member risk review, event insights, moderation analytics)
- Structured 1-on-1 mentorship flow (still per-contact paid, no subscription)
- Reputation / vouching improvements
- More languages

### Phase 3 — Native Mobile

- iOS + Android apps (React Native or Expo)
- Push notifications
- Native OAuth (Apple Sign-in mandatory on iOS)

---

## 15. Success Metrics

Metrics reflect the platform's ethos: **quality of connection over volume**.

- **Verified rate:** % of signups that complete peer vouching within 14 days. Target: >70%.
- **In-circle WAU / MAU:** healthy chat and event activity inside home circles.
- **Reply rate on paid first-DMs:** % of paid first-DMs that receive a reply. This is the *quality* metric — a low reply rate means the paid experience is disappointing. Target: >40%.
- **Retained conversation rate:** % of replied conversations that continue past 3 exchanges. Target: >30%.
- **Wallet top-up conversion:** % of active users who top up at least once within 90 days.
- **Repeat top-up rate:** % of first-top-up users who top up again within 6 months.
- **Support ticket volume per 1000 MAU:** should stay low thanks to the trust model. Target: <5.

Deliberately **not** tracked as success metrics: total DMs sent (would incentivize spam), average time on platform (would incentivize doom-scrolling), profile views (would incentivize vanity).

---

## 16. Open Questions & Deferred Decisions

Items to think about between now and the v1 implementation plan:

1. **Exact top-up denominations and pack pricing** — finalize after brief user research or during closed beta.
2. **Micro-circles in v1 or v2?** Currently in Phase 1; could be pulled forward or pushed back.
3. **Which Maps provider** — Google Maps (comprehensive, more expensive) vs. Mapbox (cheaper, good coverage) vs. OSM-based (free, less complete for India). Decide in v1 tech plan.
4. **First non-English language** for Phase 1 — Hindi is likely; confirm based on early beta user geography.
5. **Inactive first-member policy** — what happens if the first member stops approving early joins before the circle reaches 3 members.
6. **Content moderation SLAs** — how fast must reports be actioned. Define before launch.
7. **Age policy** — beta launches with a hard minimum age of 16 (self-attested). Schools (K-12) alumni circles for classes that would put current members below 16 are gated until they age in, with parental-consent flow deferred to Phase 2 pending legal review per jurisdiction.
8. **Data-residency requirements** for EU / India users — where does data physically live? Legal + hosting decision.

---

## 17. What v1 will actually build (preview)

The v1 implementation plan (to be written next) will scope Phase 0 above into a shippable beta. Rough shape:

- Web only, English only, no real payments (test-mode wallet)
- Email-OTP authentication (no passwords)
- Long-form all-details signup collecting identity + at least one affiliation + skills + privacy
- Circle creation + invite-bound peer vouching across all four types (School / College / Course / City)
- Multi-affiliation from day one (users can join more than one circle at signup and add more later)
- In-circle chat + events + members + announcements
- Raise alert / report abuse + platform-admin warning/removal actions
- Cross-circle search + match preview + pack purchase (simulated)
- WCAG 2.2 AA baseline
- Global Maps API for addresses

Everything else in this vision doc waits its turn in Phases 1, 2, 3.

---

## 18. Brand & Design Principles (name-neutral)

**Product name status: NOT FINALIZED.** Final name depends on domain and trademark availability. Candidates surfaced during exploration: `CrossRoads`, `Again`, `PastLink`, `TribeTrail`. All designs, mockups, and copy in this repo use a placeholder wordmark until a name is chosen.

Regardless of the final name, the brand system commits to the following principles.

### 18.1 Verbal identity

- **User-facing vocabulary:**
  - "Circle" — the primary unit (Home Circle, Micro Circle, External Circle). Not "group", not "network", not "community" in user copy.
  - "Vouched" and "Verified" — trust signals.
  - "Reach" or "Contact" — the paid act of crossing into an external circle. Never "outreach", "InMail", "message blast", "connect request".
  - "Circle chat", "Members", "Announcements", "Events" — tab labels.
- **Tone of voice:** humane, editorial, unhurried. Avoid enterprise-blue vocabulary: no "leverage", "opportunity", "network effects", "engagement", "onboarding funnel". Prefer "reconnect", "reach", "circle", "old world".
- **Sample copy voice:**
  - Hero: *"The people you knew before, when the world felt smaller."*
  - Refusal: *"Reaching outside your circle takes a small step. Add credit to continue."* (not "Insufficient balance. Recharge now.")
  - Empty state: *"No one from your circle has posted yet. Be the first."* (not "No content to display.")

### 18.2 Visual identity (guidance, not lock-in)

The visual direction should feel **warm, editorial, and un-corporate.** Not SaaS, not LinkedIn, not Instagram. The current working direction is a **hybrid** developed across two iterations:

- **Original exploration A — "Warm workspace"** (root `index.html`, `styles.css`, `script.js`): cream background with mint/coral/sun/blue accents, pill-shaped controls, three-panel product-tour hero, Inter typography. Retained for reference; its animated network canvas and workspace panel are the source of the "product preview" section in the current hybrid.
- **Original exploration B — "Editorial memory"** (earlier version of `preview/index.html`): softer paper background with a single terracotta accent, serif display type (Fraunces) paired with sans body (Inter), single-column memory-first layout, no product-tour, sparse imagery.
- **Hybrid (current working direction, `preview/index.html`):** Fraunces serif for display + Inter for labels, jewel-warm palette (terracotta / saffron / marigold / teal / rose / plum), editorial hero and prose from B, plus a workspace preview panel and network diagram from A. Content leads with feeling; product surface reassures the visitor that the mechanism exists.

Whichever final direction ships:

- **No corporate blue as primary.** No stock photography of "diverse professionals in a meeting room."
- **Typography carries the tone.** Big, confident, warm.
- **Whitespace and silence.** Not every space needs a card, badge, or CTA.
- **Real detail over stock illustration.** If we show a product surface, show a real one, not a generic mockup.

### 18.3 Logo direction

Whatever the final name, the mark should be a simple geometric symbol readable at 24px favicon size — a circle, an intersection, a loop, a doorway. No wordmark-only logo, no gradient-heavy identity.

### 18.4 Accessibility as a brand promise

The accessibility commitments in Section 11 are not merely compliance — they are part of the brand. Any UI that fails WCAG 2.2 AA at the design stage is off-brand, not just non-compliant.

---

*End of vision document. This is a north-star, not a build spec. The v1 build is scoped separately in the implementation plan.*
