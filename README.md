# 🚀 SSU IT Club Website

<div align="center">

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.174.0-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.4.0-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br />

**"Where Ideas Meet Innovation."**  
The official, production-grade landing page for the **Sri Sri University (SSU) IT Club**  
*Faculty of Engineering & Technology • Academic Year 2026–2027*

[Key Features](#-key-features) • [Installation Guide](#-installation--setup) • [Customization](#-content-management--customization) • [Collaboration Guide](#-collaboration--git-workflow) • [Roadmap](#-future-roadmap)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Official Brand Palette](#-official-brand-palette)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Project](#-running-the-project)
- [Production Build & Preview](#-production-build--preview)
- [Content Management & Customization](#-content-management--customization)
  - [1. Adding / Updating Events](#1-adding--updating-events)
  - [2. Publishing Announcements](#2-publishing-announcements)
  - [3. Managing Executive Team Members](#3-managing-executive-team-members)
  - [4. Updating Club Info & Social Links](#4-updating-club-info--social-links)
  - [5. Adjusting Carousel Speeds & Direction](#5-adjusting-carousel-speeds--direction)
- [Collaboration & Git Workflow](#-collaboration--git-workflow)
  - [Branching Convention](#branching-convention)
  - [Standard 6-Step Workflow](#standard-6-step-workflow)
  - [Commit Message Guidelines](#commit-message-guidelines)
- [Contribution & Code Standards](#-contribution--code-standards)
- [Deployment Guide](#-deployment-guide)
- [Future Roadmap](#-future-roadmap)
- [Maintainers & Contributors](#-maintainers--contributors)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🌐 Overview

The **SSU IT Club Website** (`SSU-IT-Club-Website`) is the central digital presence of the Information Technology Club at Sri Sri University. Designed as a high-performance, interactive Single Page Application (SPA), it showcases student initiatives, facilitates event discovery, and fosters interdisciplinary tech collaboration across computing, engineering, design, and management faculties.

### Core Objectives
- 📢 **Broadcast Announcements**: Real-time official bulletins, hackathon updates, and project calls.
- 📅 **Showcase Events**: Interactive carousels highlighting workshops, seminars, and quizzes with direct registration handoff.
- 🎟️ **Instant Registration**: In-browser ticket reservations with instant client-side validation and printable passes.
- 🌟 **Recognize Leadership**: Executive committee member profiles with direct contact channels.
- 🧭 **Visual Journey**: A scroll-driven interactive timeline tracing student development from beginner discovery to technical leadership.

---

## 🎨 Official Brand Palette

The platform strictly adheres to the university club's three-color visual identity, with CSS variables declared in `src/index.css` and tokens in `tailwind.config.js`:

| Role | Colour Name | HEX Code | CSS Variable | Applied UI Context |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | **Dark Brown** | `#672C1C` | `--primary-color` | Section titles, primary CTA buttons, active navigation, footer background |
| **Secondary Accent** | **Mustard Gold** | `#AE7B29` | `--secondary-color` | Borders, glowing badges, 3D ambient lights, hover underlines, icons |
| **Canvas Base** | **Pure White** | `#FFFFFF` | `--background-color` | Page background, content containers, event card surfaces |
| **Surface Subtle** | **Warm Sand** | `#FAF6F4` | `--primary-subtle` | Alternating section fills (`#about`, `#team`, form input backdrops) |
| **Editorial Dark** | **Obsidian Black**| `#000000` | Localized | Scoped exclusively to the high-contrast Announcements section |

---

## ✨ Key Features

### 🎬 1. Cinematic Launch Sequence (`IntroAnimation.jsx`)
- Plays automatically on the user's first visit per browser session (tracked via `sessionStorage`).
- **Choreographed Sequence**:
  1. The Sri Sri University logo fades in and scales gently at center screen.
  2. The university logo glides smoothly to the left, making balanced space.
  3. The IT Club logo fades in alongside with zero overlapping.
  4. The tagline *"Where Ideas Meet Innovation"* appears beneath both emblems.
  5. Both logos dynamically calculate viewport coordinates and fly to their exact header positions.
- Can be replayed at any time using the **"Replay Intro Animation"** button in the footer.
- Automatically bypassed when `prefers-reduced-motion` is active.

### 🧭 2. Sticky Dual-Logo Navigation (`Navbar.jsx`)
- Renders **independent brand logos**: Sri Sri University (left) and SSU IT Club (right).
- Dynamic sticky backdrop blur (`backdrop-blur-md`) with subtle border elevation on scroll.
- Real-time scroll spy highlighting the current active section with a smooth spring underline indicator.
- Fully responsive slide-down mobile menu drawer with touch-friendly tap targets.

### 💻 3. Interactive 3D Developer Workstation (`Hero.jsx` & `Hero3D.jsx`)
- Built with **Three.js** and WebGL.
- Features a floating 3D laptop with an illuminated terminal running syntax-highlighted IT Club code and a blinking cursor.
- Orbital silicon processor die and floating golden code brackets (`{ }`).
- Responsive mouse parallax: gently tilts and tracks cursor coordinates on desktop.
- Optimized performance with automatic resource disposal on component unmount.

### 🏛️ 4. Four Core Pillars (`About.jsx`)
- Clear presentation of club foundations on warm sand surface (`#FAF6F4`):
  - **Learn Together**: Hands-on coding workshops, peer labs, and technical sprints.
  - **Build Connections**: Open collaborative student network and senior mentorship.
  - **Explore Innovation**: Software development, open-source tools, and digital tech.
  - **Create Experiences**: Annual gatherings, quizzes, exhibitions, and hackathons.

### 🛤️ 5. Scroll-Driven Winding Path Journey (`ClubJourney.jsx`)
- An interactive SVG curved trajectory synced with user scroll progress via Framer Motion's `useScroll` and `useTransform`.
- An animated golden traveler bead traverses the path across 4 milestone phases:
  1. *Foundations* — Curiosity Meets Computing
  2. *Skill-Building* — Hands-On Coding & Dev Labs
  3. *Student Projects* — Transforming Concepts into Products
  4. *Excellence & Impact* — Competitions, Seminars & Leadership

### 📢 6. Kinetic Editorial Announcements (`Announcements.jsx` & `AnnouncementModal.jsx`)
- Scoped solid black (`#000000`) background with ambient radial backlights.
- Multi-layered kinetic typography marquees and ASCII chevron ribbons streaming in opposing directions.
- **Continuous Right-to-Left moving cards**: Real text cards travel across the viewport in an infinite loop without jitter, gaps, or layout jumps.
- Strictly text-based (no image placeholders), preserving official university bulletin standards.
- Interactive features: Category filtering pills, live status indicator, pause on hover/touch, manual play/pause toggle, and a **"Read Full Notice"** modal dialog.

### 📅 7. Upcoming Events Carousel (`UpcomingEvents.jsx` & `EventCard.jsx`)
- Continuous **Right-to-Left moving card carousel** showcasing workshops, quizzes, and seminars.
- Category filtering (`Workshop`, `Competition`, `Showcase`, `Seminar`, `Community`) and an "Open Registrations Only" toggle.
- Interactive 3D card tilt effect responding to fine mouse pointer coordinates.
- **"Register Now"** button that pre-selects the chosen event and smoothly scrolls to `#registration` accounting for sticky header height.

### 🎟️ 8. Interactive Registration Pass Generator (`EventRegistration.jsx` & `registration.js`)
- Comprehensive form validation for student name, institutional email, phone number, university, department, and academic year.
- Dynamic event pre-selection synchronized with the active events list.
- Simulates realistic network transmission latency (900ms) with animated loader.
- Fires a celebratory multi-colored confetti burst (`canvas-confetti`) upon completion.
- Produces a printable, branded confirmation pass with a unique ticket identifier (`ITCLUB-XXX-####`).

### 💡 9. Student & Faculty Project Proposal Incubation Hub (`ProjectProposal.jsx`, `sampleProposals.js`, `projectProposals.js`)
- **Direct Collaboration with IT Cell**: Allows any student or faculty member across the university to propose project ideas or departmental automation systems for the IT Cell to build.
- **Interactive Role Switcher**: Dedicated toggle between **Student Proposal** (Degree, Semester, Roll No) and **Faculty / Staff Lead** (Department, Faculty Employee Code).
- **Core Problem & Solution Scope**: Captures project title, primary technology domain, concise problem statement, in-depth context explanation, and target timeline.
- **Interactive Solution Objectives Builder**: Dynamic checklist builder where proposers add specific deliverables and pain points to be solved with quick-add suggestion chips.
- **Real-Time Live Blueprint Card**: Sticky side container displaying a live readiness meter (0%–100%), real-time proposal summary, domain tag, and review roadmap.
- **Interactive Sample Proposals Catalog**: Collapsible drawer with real-world sample proposals that can be loaded into the form with one click.
- **Celebratory Confirmation & Pass**: Fires `canvas-confetti`, assigns a tracking ticket ID (`SSU-ITP-STU-####` or `SSU-ITP-FAC-####`), saves to browser storage, and provides a printable receipt.

### 👥 10. Executive Committee Carousel (`TeamMembers.jsx` & `MemberCard.jsx`)
- Continuous **Left-to-Right moving card carousel** creating visual rhythm opposite to the events carousel.
- Displays student leader portraits, designations, department tags, and bios.
- Click-to-call (`tel:`), click-to-email (`mailto:`), and LinkedIn profile links.

### 📬 11. Contact & Community Hub (`Contact.jsx` & `Footer.jsx`)
- Campus location details, official email, phone numbers, and office hours.
- Interactive contact dispatch form with validation and submission confirmation.
- Footer with dual logos, quick links, replay intro button, back-to-top button, and dynamic copyright year.

### ♿ 12. Accessibility & Performance Polish
- **Custom Cursor Follower** (`CustomCursor.jsx`): Dual-ring desktop follower that expands over clickable elements; automatically disabled on touch devices.
- **Reduced Motion Compliance**: All keyframe carousels, marquees, Three.js rotations, and scroll animations respect `prefers-reduced-motion: reduce`.
- **Keyboard & Screen Reader Friendly**: Accessible ARIA labels, modal focus trapping, and duplicate carousel elements marked with `aria-hidden="true"`.

---

## 🛠️ Technology Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          SSU IT CLUB WEBSITE                           │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ Layer              │ Technology         │ Version / Purpose            │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ Core Framework     │ React              │ 19.0.0 (Component Engine)    │
│ DOM Renderer       │ React DOM          │ 19.0.0 (DOM Mounting)        │
│ Build Tool         │ Vite               │ 6.2.0 (HMR & Asset Bundling) │
│ CSS Framework      │ Tailwind CSS       │ 3.4.17 (Utility Styling)     │
│ Post-Processor     │ PostCSS / Autopref │ 8.5.3 / 10.4.20 (CSS Engine) │
│ 3D Graphics        │ Three.js           │ 0.174.0 (WebGL Workstation)  │
│ Motion Engine      │ Framer Motion      │ 14.4.0 (Scroll & Transitions)│
│ Iconography        │ Lucide React       │ 1.16.0 (Vector Icons)        │
│ Particle FX        │ Canvas Confetti    │ 1.9.4 (Celebration Effects)  │
│ Language           │ JavaScript (ESM)   │ Modern ECMAScript / JSX      │
│ Type Definitions   │ TypeScript Types   │ 5.7.3 (@types/* Dev Tooling) │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 📁 Project Directory Structure

```text
SSU-IT-Club-Website/
├── public/
│   ├── favicon.svg             # Browser tab icon
│   └── icons.svg               # SVG icons bundle
├── src/
│   ├── assets/
│   │   ├── CLUB_Logo.png       # Official IT Club brand logo (Mustard & Brown)
│   │   ├── university-logo.png # Official Sri Sri University brand logo
│   │   ├── hero.png            # Static fallback graphic
│   │   ├── events/             # Vector event illustrations (SVG)
│   │   │   ├── annual-meet.svg
│   │   │   ├── coding-workshop.svg
│   │   │   ├── creativity-showcase.svg
│   │   │   ├── inter-college-quiz.svg
│   │   │   ├── tech-seminar.svg
│   │   │   └── tech-workshop.svg
│   │   └── members/            # Executive member portrait placeholders (SVG)
│   │       ├── member-1.svg
│   │       └── ...
│   ├── components/
│   │   ├── About.jsx           # Four core pillars section (#about)
│   │   ├── AnnouncementModal.jsx# Full bulletin modal dialog
│   │   ├── Announcements.jsx   # Moving cards bulletin board (#announcements)
│   │   ├── ClubJourney.jsx     # Scroll-driven winding timeline (#journey)
│   │   ├── Contact.jsx         # Campus contact details & form (#contact)
│   │   ├── CustomCursor.jsx    # Desktop cursor follower
│   │   ├── EventCard.jsx       # Individual event card with 3D tilt
│   │   ├── EventRegistration.jsx# Ticket registration & pass generator (#registration)
│   │   ├── Footer.jsx          # Dual logos, sitemap & replay intro
│   │   ├── Hero.jsx            # Main headline & CTA buttons (#hero)
│   │   ├── Hero3D.jsx          # Three.js 3D WebGL developer workstation
│   │   ├── IntroAnimation.jsx  # Cinematic two-logo launch sequence
│   │   ├── MemberCard.jsx      # Individual team profile card
│   │   ├── Navbar.jsx          # Sticky header with active indicator
│   │   ├── ProjectProposal.jsx # Student & Faculty project suggestion incubator (#proposals)
│   │   ├── SocialIcons.jsx     # Vector social platform icons
│   │   ├── TeamMembers.jsx     # Executive committee carousel (#team)
│   │   └── UpcomingEvents.jsx  # Event showcase carousel (#events)
│   ├── data/
│   │   ├── announcements.js    # Data store: Bulletins, pinned notices, dates
│   │   ├── clubInfo.js         # Data store: University info, contacts, social URLs
│   │   ├── events.js           # Data store: Events, dates, venues, seat counts
│   │   ├── members.js          # Data store: Executive team details & bios
│   │   └── sampleProposals.js  # Domains, branch options, and sample proposal templates
│   ├── utils/
│   │   ├── projectProposals.js # Proposal validator & ticket generator
│   │   └── registration.js     # Form validation rules & ticket generator
│   ├── App.jsx                 # Master application layout orchestrator
│   ├── index.css               # Global Tailwind directives & carousel keyframes
│   └── main.jsx                # React 19 root DOM mount
├── index.html                  # HTML entry point, Google Fonts preconnect
├── package.json                # Project dependencies and npm scripts
├── postcss.config.js           # PostCSS configuration for Tailwind
├── tailwind.config.js          # Custom theme extensions, colors, and shadows
├── tsconfig.json               # TypeScript base configuration
├── tsconfig.app.json           # Client app TypeScript config
├── tsconfig.node.json          # Vite node runtime TypeScript config
└── vite.config.ts              # Vite configuration & Rollup chunk splitting
```

---

## 📋 Prerequisites

Ensure the following tools are installed on your workstation:

- **Node.js**: `v18.0.0` or `v20.0.0+` LTS ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or `v10.0.0+` (included with Node.js)
- **Git**: For version control and branch management ([Download Git](https://git-scm.com/))
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari with WebGL enabled

Check your installed versions by running:
```bash
node -v
npm -v
git --version
```

---

## 💻 Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/SSU-IT-Club-Website.git
   ```
   *(Replace `<your-username>` with your GitHub username or organization name).*

2. **Navigate into the Project Root**:
   ```bash
   cd SSU-IT-Club-Website
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```
   *(Or run `npm ci` for an exact, clean install matching `package-lock.json`).*

---

## 🏃 Running the Project

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The terminal will confirm server startup:
```text
  VITE v6.2.0  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to **`http://localhost:5173/`**. Any changes made to source files will reflect instantaneously on screen.

---

## 📦 Production Build & Preview

### Generate the Production Bundle
To compile an optimized, production-ready static build:

```bash
npm run build
```

Vite compiles all assets into the `dist/` directory. By configuration in `vite.config.ts`, heavy libraries (`three` and `framer-motion`) are cleanly split into separate vendor chunks for maximum browser caching.

### Preview the Production Build Locally
To test the built production bundle before deploying:

```bash
npm run preview
```

This starts a local static preview server at **`http://localhost:4173/`**.

---

## ⚙️ Content Management & Customization

The project decouples website content from React component code. You can modify announcements, events, members, and contact info safely without touching JSX:

### 1. Adding / Updating Events
Open `src/data/events.js`. Add an event object to the `EVENTS` array:

```javascript
// src/data/events.js
{
  id: "ai-bootcamp-2027",
  title: "AI & Full-Stack Prototyping Bootcamp",
  shortDescription: "A hands-on weekend workshop guiding students through modern web architectures, API integration, and intelligent app design.",
  category: "Workshop",          // "Workshop" | "Competition" | "Showcase" | "Seminar" | "Community"
  date: "January 24, 2027",
  time: "10:00 AM – 3:30 PM",
  venue: "CS Laboratory 4 • Silicon Block",
  deadline: "January 20, 2027",
  status: "Registration Open",   // "Registration Open" | "Coming Soon" | "Registration Closed" | "Event Completed"
  image: techWorkshopImg,        // Imported SVG from src/assets/events/
  externalUrl: null,             // Set to "https://forms.google.com/..." OR null to use built-in form
  seatsTotal: 100,
  seatsLeft: 38,
  tags: ["Hands-On", "React", "Certificates Provided"]
}
```

### 2. Publishing Announcements
Open `src/data/announcements.js`. Add an object to the `ANNOUNCEMENTS` array:

```javascript
// src/data/announcements.js
{
  id: "ann-05",
  title: "Call for Project Submissions: Annual Tech Showcase",
  category: "Club Activity",    // "Important Update" | "Upcoming Event" | "Workshop Announcement" | "Registration Reminder" | "Club Activity"
  date: "November 05, 2026",
  pinned: true,                  // true renders a glowing gold [PINNED] badge
  shortMessage: "Submissions are open for our upcoming Student Creativity Showcase. Present your software and hardware projects to faculty and peers.",
  fullContent: `Full details, submission guidelines, abstract format, and exhibition rules go here...`,
  author: "Technical Committee",
  actionLink: "#events",
  actionText: "Explore Showcase Details"
}
```

### 3. Managing Executive Team Members
1. Place student portrait images into `src/assets/members/` (e.g. `president-jane.jpg`).
2. Open `src/data/members.js`, import the photo, and update the member entry:

```javascript
// src/data/members.js
import janePhoto from '../assets/members/president-jane.jpg';

{
  id: "member-1",
  name: "Jane Doe",
  role: "Club President",
  department: "Department of Computer Science & Engineering",
  yearOfStudy: "Final Year Undergraduate",
  bio: "Passionate about open-source tools, student tech leadership, and university hackathons.",
  image: janePhoto,
  email: "president.itclub@srisriuniversity.edu.in", // Clickable mailto: link
  phone: "+91 98765 43210",                         // Clickable tel: link
  linkedin: "https://linkedin.com/in/janedoe",      // Profile link (or null to hide)
  isPlaceholder: false
}
```

### 4. Updating Club Info & Social Links
Open `src/data/clubInfo.js` to modify the university name, contact address, official emails, or social media handles. Setting any social link to `null` automatically hides its icon from the navigation and footer.

### 5. Adjusting Carousel Speeds & Direction
Open `src/index.css` and locate the animation classes:
- **Our Team Carousel** (Left to Right): Edit `.animate-carousel-right` (default: `42s`).
- **Upcoming Events Carousel** (Right to Left): Edit `.animate-carousel-left` (default: `42s`).
- **Announcements Cards Carousel** (Right to Left): Edit `.animate-announcements-cards` (default: `46s`).

*Increasing the seconds duration slows down the movement; decreasing it speeds it up.*

---

## 🤝 Collaboration & Git Workflow

To collaborate smoothly with seniors, coordinators, and contributors, follow this standard Git feature branch workflow:

### Branching Convention
Never commit directly to the `main` branch. Use the appropriate branch prefix:

| Prefix | Usage | Example |
| :--- | :--- | :--- |
| `feature/` | New section, UI feature, or interactive component | `feature/alumni-directory` |
| `fix/` | Bug fixes, alignment adjustments, or typo corrections | `fix/registration-validation` |
| `content/` | Updating events, announcements, or team members | `content/spring-2027-events` |
| `docs/` | Documentation, README updates, or asset guides | `docs/update-readme` |

### Standard 6-Step Workflow

1. **Update Your Local Main Branch**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a Dedicated Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Implement Changes & Verify Locally**:
   - Run `npm run dev` and test your modifications.
   - Press `F12` to ensure **0 errors** in the browser console.
   - Run `npm run build` to confirm production bundling succeeds.

4. **Commit with Meaningful Messages**:
   ```bash
   git add .
   git commit -m "feat: add registration link for AI Bootcamp 2027"
   ```

5. **Push Your Branch to GitHub**:
   ```bash
   git push -u origin feature/your-feature-name
   ```

6. **Open a Pull Request (PR)**:
   - Navigate to the repository on GitHub.
   - Click **"Compare & pull request"**.
   - Fill in a clear description of changes made and tag senior coordinators for review.

### Commit Message Guidelines
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features or UI components
- `fix:` Bug fixes or error patches
- `docs:` Documentation updates
- `style:` Formatting, CSS, or Tailwind adjustments without logic changes
- `refactor:` Code restructuring that does not alter external behavior

---

## 🛡️ Contribution & Code Standards

- **Decoupled Architecture**: Keep component files in `src/components/` and data in `src/data/`. Do not hardcode dynamic lists directly inside JSX.
- **Brand Consistency**: Always use the defined palette classes (`bg-[#672C1C]`, `text-[#AE7B29]`, `bg-[#FAF6F4]`, `bg-white`).
- **Mobile-First Design**: Verify layouts on mobile (375px), tablet (768px), and laptop (1280px+) viewports.
- **Accessibility**: Include descriptive `alt` tags on all images and ensure all custom interactive buttons have accessible `aria-label` tags.
- **Security**: **Never** commit passwords, API tokens, private phone numbers, or credentials to Git.

---

## 🚀 Deployment Guide

This static React/Vite application can be deployed instantly to modern cloud hosting platforms:

### Option A: Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import `SSU-IT-Club-Website`. Vercel automatically detects **Vite**.
4. Click **"Deploy"**. Your website is live with HTTPS and global CDN caching.

### Option B: Netlify
1. Run `npm run build` locally.
2. Drag and drop the generated `dist/` folder into [Netlify Drop](https://app.netlify.com/drop).
3. Your site is live immediately.

### Option C: GitHub Pages
1. In `vite.config.ts`, add the base path matching your repository name:
   ```typescript
   export default defineConfig({
     base: '/SSU-IT-Club-Website/',
     // ...
   })
   ```
2. Build and publish using the `gh-pages` npm package:
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```

---

## 🔮 Future Roadmap

- [ ] **Live REST Backend**: Connect `src/utils/registration.js` to an automated database (or Google Apps Script Webhook) for real-time ticket logging.
- [ ] **Automated Email Passes**: Deliver automated confirmation emails with QR codes for on-campus event check-ins.
- [ ] **Alumni & Project Archive**: Dedicated showcase gallery for student projects created during past hackathons.
- [ ] **Calendar Synchronization**: One-click "Add to Google Calendar" / "Download .ics" buttons on event cards.
- [ ] **Automated CI/CD**: GitHub Actions workflow running automated build and lint checks on every Pull Request.

---

## 👥 Maintainers & Contributors

### Core Maintainers
- **Student Lead & Developer**: [Your Name](https://github.com/<your-username>) — `@<your-username>`
- **Technical Coordinator**: *To be updated* — `@<coordinator-username>`

### Faculty Mentorship
- **Faculty Coordinator**: Department of Computer Science & Information Technology, Sri Sri University

*(To add your name as a contributor, submit a Pull Request following our [Collaboration Guide](#-collaboration--git-workflow)).*

---

## 📄 License

This project and its assets are maintained for the **Sri Sri University IT Club**.  
*No formal open-source license has been specified. All rights remain with the Sri Sri University IT Club and its respective contributors unless explicitly stated.*

---

## 🏛️ Acknowledgements

- **Sri Sri University (SSU)** — Faculty of Engineering & Technology, for promoting student leadership and technological innovation.
- **SSU IT Club Executive Committee** — For ongoing feedback, event coordination, and community guidance.
- **Open Source Community** — Built with gratitude on [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Three.js](https://threejs.org/), [Framer Motion](https://www.framer.com/motion/), and [Lucide Icons](https://lucide.dev/).

---

<div align="center">
  <sub>Developed with ❤️ by the students of <strong>Sri Sri University IT Club</strong> • 2026–2027</sub>
</div>
