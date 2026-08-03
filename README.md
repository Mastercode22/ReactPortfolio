# Emmanuel Quarshie — World-Class Digital Portfolio & Architecture

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4.7-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An ultra-premium, high-performance single-page application (SPA) digital portfolio built for **Emmanuel Quarshie** — Principal Digital Architect & Design Engineer based in Anbert Garden, Ghana.

Designed to rival the polish, spacing, and motion design of modern tech leaders such as **Apple**, **Linear**, **Vercel**, **Framer**, and **Stripe**.

---

## 🎨 Design System & Philosophy

The user interface follows a strictly proportioned visual harmony:

- **40% Neumorphism**: Soft tactile shadows (`8px 8px 18px rgba(0,0,0,.08), -8px -8px 18px rgba(255,255,255,.95)` in light mode & deep inner/outer contrast in dark mode) applied to buttons, input fields, theme toggles, skill cards, and statistics widgets.
- **30% Glassmorphism**: Translucent floating navigation bar, backdrop blur filters (`backdrop-blur-xl`), project quick-view modals, tooltips, and floating status badges.
- **20% Apple-Grade Minimalism**: Clean 8px spacing grid, SF Pro Display / Inter typography, 170% line-height, and uncluttered visual hierarchy.
- **10% Luxury Gradients**: Ambient radial glow blobs, active link indicator pills, and gradient text highlights (`#6C63FF` → `#7C5CFF` → `#5FA8FF`).

---

## ⚡ Key Features

- **Dual-Theme Engine (Light & Dark)**:
  - Light Palette: Background `#F6F7FB`, Secondary `#EEF1F6`, Cards `#FFFFFF`, Primary Text `#1B2430`.
  - Dark Palette: Background `#090B13`, Secondary `#111827`, Cards `#171E2F`, Primary Text `#F8FAFC`.
  - Persistent state saved in `localStorage` with automatic system preference detection.
- **Client-Side SPA Routing (`react-router-dom`)**:
  - Zero full page reloads, persistent Navbar & Footer.
  - Smooth Framer Motion page transitions (fade, slide, scale, blur) with automatic top-of-page scroll restoration.
- **Interactive 3D Device Mockup**:
  - Floating MacBook and Smartphone mockups responding dynamically to cursor tilt movement.
- **Mouse-Following Ambient Radial Glow**:
  - Smooth 120px blur cursor tracking layer that automatically adapts colors per theme.
- **Project Case Studies & Detail Modal**:
  - Modal quick-view dialogs + dedicated `/projects/:id` routes detailing executive overviews, architecture blueprints, performance metrics, and live demo links.
- **Bento Grid Services Showcase**:
  - Neumorphic Bento layout highlighting Core Frontend Architecture, React SPAs, E-Commerce, Enterprise Dashboards, UI/UX Precision, and Web Vitals Optimization.
- **Interactive Skills Matrix**:
  - Rotating/scaling vector tech icons with skill level progress meters and informative tooltips.
- **Connected 6-Step Development Workflow**:
  - Visual blueprint mapping Discovery → Planning → UI Design → Development → Testing → Deployment.
- **GitHub Activity Telemetry**:
  - Simulated 52-week contribution matrix, repository statistics, and pinned open-source projects.
- **Interactive Testimonials Carousel**:
  - Auto-sliding glass card carousel with star ratings and client avatars.
- **Contact Form & Interactive Map**:
  - Neumorphic contact form with animated floating labels + embedded Google Map for **Anbert Garden, Ghana**.
- **Interactive Resume (`/resume`)**:
  - Complete curriculum vitae view with print styles and direct PDF download trigger.

---

## 📂 Project Architecture

```
portfolio/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
├── public/
│   └── theo.pdf
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── ui/
│   │   │   ├── NeumorphicButton.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── MouseGlow.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   ├── ProjectModal.jsx
│   │   │   ├── DeviceMockup.jsx
│   │   │   └── ScrollToTop.jsx
│   │   └── sections/
│   │       ├── Hero.jsx
│   │       ├── About.jsx
│   │       ├── Services.jsx
│   │       ├── TechStack.jsx
│   │       ├── FeaturedProjects.jsx
│   │       ├── Experience.jsx
│   │       ├── Certifications.jsx
│   │       ├── Testimonials.jsx
│   │       ├── Process.jsx
│   │       ├── GithubSection.jsx
│   │       └── Contact.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── ProjectDetailPage.jsx
│   │   ├── ExperiencePage.jsx
│   │   ├── CertificationsPage.jsx
│   │   ├── TestimonialsPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── ResumePage.jsx
│   └── data/
│       ├── projects.js
│       ├── services.js
│       ├── experience.js
│       ├── certifications.js
│       ├── testimonials.js
│       └── skills.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation

1. **Clone or navigate to project directory**:
   ```bash
   cd c:\xampp\htdocs\portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The bundled production assets will be output to the `/dist` folder.

---

## 👤 Author

**Emmanuel Quarshie**
- **Role**: Principal Digital Architect & Design Engineer
- **Location**: Anbert Garden, Ghana
- **Email**: `emmanuel.quarshie@example.com`
- **GitHub**: [github.com/emmanuelquarshie](https://github.com/emmanuelquarshie)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
