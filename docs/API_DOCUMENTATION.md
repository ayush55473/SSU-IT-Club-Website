# 🔌 SSU IT Club Website — External Free API Documentation

> **Policy Compliance**: Zero money spent. No subscriptions. No credit card required. All services have genuinely usable free tiers or are open-access public utilities.

---

## 📋 Comprehensive API Integration Matrix

| # | API Name | Provider | Key Required? | Free-Tier Limitations | Integration Status | Env Variables |
|---|---|---|---|---|---|---|
| **1** | **Campus Weather API** | [Open-Meteo](https://open-meteo.com) | ❌ None | 10,000 requests/day, open access | 🟢 **Active & Integrated** | None |
| **2** | **Digital Event Pass QR API** | [QR Server](https://goqr.me/api/) | ❌ None | Unlimited standard resolution generation | 🟢 **Active & Integrated** | None |
| **3** | **Global Tech Wire API** | [Dev.to](https://developers.forem.com/api) | ❌ None | Open public REST endpoints | 🟢 **Active & Integrated** | None |
| **4** | **Campus Location & Mapping** | [OpenStreetMap](https://www.openstreetmap.org) | ❌ None | Free for open web usage & attribution | 🟢 **Active & Integrated** | None |
| **5** | **Visitor Geolocation API** | [ipapi.co](https://ipapi.co/) | ❌ None | 1,000 requests/day without registration | 🟢 **Active & Integrated** | None |
| **6** | **Daily Tech Innovation Quote** | [Open Public / Curated CS](https://dummyjson.com) | ❌ None | Unlimited daily caching | 🟢 **Active & Integrated** | None |
| **7** | **Contact Message Dispatch** | [Web3Forms](https://web3forms.com) | 🔑 Free Access Key | 250 submissions/month free forever | 🟡 **Supported & Ready** (Falls back to DB & Local Archive) | `VITE_WEB3FORMS_ACCESS_KEY` |
| **8** | **Cloud Database & Realtime** | [Supabase](https://supabase.com) | 🔑 Free API Key | 500MB DB, 50k MAU, 2 free projects | 🟡 **Configured & Ready** (Falls back to LocalStorage) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

---

## 🔍 Detailed Specification Per API

### 1. Open-Meteo Weather API
- **Official Documentation**: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)
- **API Purpose**: Supplies live temperature (°C), weather conditions, humidity, and wind speed for Sri Sri University's campus coordinates (20.4625° N, 85.8830° E).
- **Service File**: [`src/services/api/weatherService.js`](../src/services/api/weatherService.js)
- **UI Location**: Displayed in the Campus Location card in [`src/components/Contact.jsx`](../src/components/Contact.jsx).
- **Authentication**: None required.
- **Caching & Resilience**: 15-minute `localStorage` cache prevents redundant requests. 6-second timeout with graceful fallback.

### 2. QR Server API
- **Official Documentation**: [https://goqr.me/api/doc/create-qr-code/](https://goqr.me/api/doc/create-qr-code/)
- **API Purpose**: Encodes event registration details and project proposal tracking IDs into high-contrast scannable QR tickets for physical door check-in at campus venues.
- **Service File**: [`src/services/api/qrService.js`](../src/services/api/qrService.js)
- **UI Location**: 
  - [`src/components/EventRegistration.jsx`](../src/components/EventRegistration.jsx) (Official Student Entry Pass).
  - [`src/components/ProjectProposal.jsx`](../src/components/ProjectProposal.jsx) (Project Tracking Pass).
- **Authentication**: None required.
- **Fallback**: Secondary [QuickChart QR](https://quickchart.io/qr) fallback image generator.

### 3. Dev.to / Open-Source Tech News API
- **Official Documentation**: [https://developers.forem.com/api/v1](https://developers.forem.com/api/v1)
- **API Purpose**: Streams live software engineering articles, open-source discussions, and emerging technology trends for computer science students.
- **Service File**: [`src/services/api/techNewsService.js`](../src/services/api/techNewsService.js)
- **UI Location**: Embedded inside [`src/components/Announcements.jsx`](../src/components/Announcements.jsx) with a dedicated tab toggle.
- **Authentication**: None required.
- **Caching & Resilience**: 30-minute `localStorage` cache with offline fallbacks.

### 4. OpenStreetMap Mapping
- **Official Documentation**: [https://wiki.openstreetmap.org/wiki/Embeddable_tiles](https://wiki.openstreetmap.org/wiki/Embeddable_tiles)
- **API Purpose**: Provides an interactive campus locator map for visitors attending university hackathons and seminars.
- **UI Location**: "View Campus Map" toggle in [`src/components/Contact.jsx`](../src/components/Contact.jsx).
- **Authentication**: None required.

### 5. ipapi.co Geolocation API
- **Official Documentation**: [https://ipapi.co/api/](https://ipapi.co/api/)
- **API Purpose**: Automatically detects visitor country and dialing code (`+91` for India) to pre-format form fields.
- **Service File**: [`src/services/api/geoService.js`](../src/services/api/geoService.js)
- **UI Location**: Phone inputs in [`src/components/EventRegistration.jsx`](../src/components/EventRegistration.jsx) and [`src/components/JoinTeamModal.jsx`](../src/components/JoinTeamModal.jsx).
- **Authentication**: None required.
- **Caching**: Stored in `sessionStorage` per browser tab session. Default to India (+91) if blocked.

### 6. Daily Tech Innovation Quotes
- **API Purpose**: Delivers daily wisdom from computing pioneers (Ada Lovelace, Alan Turing, Grace Hopper, Linus Torvalds).
- **Service File**: [`src/services/api/quoteService.js`](../src/services/api/quoteService.js)
- **UI Location**: Hero banner in [`src/components/Hero.jsx`](../src/components/Hero.jsx).
- **Authentication**: None required.
- **Caching**: 24-hour cache.

### 7. Web3Forms Email Dispatch
- **Official Documentation**: [https://docs.web3forms.com/](https://docs.web3forms.com/)
- **API Purpose**: Dispatches contact form messages directly to the club's official email address without needing a Node.js backend.
- **Service File**: [`src/services/api/contactDispatchService.js`](../src/services/api/contactDispatchService.js)
- **UI Location**: Contact Us form in [`src/components/Contact.jsx`](../src/components/Contact.jsx).
- **Authentication**: Free public Access Key.
- **How to Get Key**: Visit [https://web3forms.com](https://web3forms.com), enter your email, receive key instantly (no password, no card).
- **Fallback**: If not configured, messages are automatically saved to Supabase `contact_messages` and locally archived in browser storage.

### 8. Supabase Backend Services
- **Official Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **API Purpose**: Cloud PostgreSQL database, Row Level Security, Admin authentication, and Realtime state synchronization.
- **Service File**: [`src/lib/supabase.js`](../src/lib/supabase.js)
- **Setup Script**: [`supabase_setup.sql`](../supabase_setup.sql)
- **Authentication**: Free account registration at [https://supabase.com](https://supabase.com).
- **Fallback**: Complete offline local storage simulation when keys are not configured.

---

## 🛡️ Security Guidelines

1. **Client-Side Safe Keys**: Only public form endpoints and Supabase anon keys (which are protected by Postgres Row Level Security) are used in frontend variables.
2. **Never Commit Secrets**: Secrets must never be committed to git. Use `.env.local` for private variables.
3. **No Financial Risk**: None of the selected services can convert into paid accounts automatically.
