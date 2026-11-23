# ANTHIX — Scalable Creative Technology Architecture

> **Brand**: ANTHIX  
> **Tagline**: *"Ideas Into Impact."*  
> **Business Areas**: Digital Solutions · AI & Automation · Technical Training

---

## 📁 Clean, Scalable & Professional Project Structure

The project has been refactored into a modular, production-ready React + TypeScript architecture:

```text
src/
├── assets/                          # Static assets and brand imagery
│
├── components/
│   ├── common/                      # Globally shared components
│   │   ├── Navbar.tsx               # Sticky header with active routing & mobile drawer
│   │   ├── Footer.tsx               # Minimalist footer with router links
│   │   ├── Button.tsx               # Reusable button with variants (primary, outline, ghost)
│   │   └── LoadingScreen.tsx        # Branded loading sequence
│   │
│   └── animations/                  # Motion and scroll animation primitives
│       ├── ScrollReveal.tsx         # GSAP ScrollTrigger element reveal wrapper
│       ├── ParallaxSection.tsx      # Smooth parallax scroll wrapper
│       └── AnimatedBackground.tsx   # Atmospheric lavender/blue background illumination
│
├── pages/
│   ├── home/                        # Home Page (fully implemented)
│   │   ├── Home.tsx                 # Master Home page orchestrator
│   │   └── components/
│   │       ├── Hero.tsx             # Priority one: headline, line reveal, CTAs
│   │       ├── HeroScene3D.tsx      # Three.js 3D crystal core & orbital rings
│   │       ├── AboutPreview.tsx     # The ANTHIX Approach (IDEA → TECH → IMPACT)
│   │       ├── ServicesPreview.tsx  # 3 distinct service experiences
│   │       ├── AIShowcase.tsx       # Interactive node canvas & system philosophy
│   │       ├── WhyAnthix.tsx        # 4 foundational principles
│   │       ├── Process.tsx          # 4-stage process roadmap
│   │       ├── ProjectConcepts.tsx  # 3 architectural concept showcases
│   │       └── ContactCTA.tsx       # Verified inquiry form & closing CTA
│   │
│   ├── about/                       # About Page
│   │   ├── About.tsx                # Dedicated About page
│   │   └── components/              # Ready for independent subcomponents
│   │
│   ├── services/                    # Services Page
│   │   ├── Services.tsx             # Dedicated Services page
│   │   └── components/              # Ready for independent subcomponents
│   │
│   └── contact/                     # Contact Page
│       ├── Contact.tsx              # Dedicated Contact page with validation
│       └── components/              # Ready for independent subcomponents
│
├── layouts/
│   └── MainLayout.tsx               # Top-level shell (Navbar + Content + Footer)
│
├── hooks/
│   ├── useScrollPosition.ts         # Window scroll tracking & header transitions
│   └── useReducedMotion.ts          # Accessibility & prefers-reduced-motion hook
│
├── utils/
│   └── cn.ts                        # Tailwind class merge utility (clsx + tailwind-merge)
│
├── types/
│   └── index.ts                     # TypeScript interfaces (ServiceType, ContactFormData)
│
├── App.tsx                          # React Router route definitions
├── main.tsx                         # React 18 DOM root
└── index.css                        # Tailwind base directives & typography
```

---

## 🚦 Routing Setup (`react-router-dom`)

The project uses clean, accessible routing with automatic scroll-to-top on navigation:
* `/` → `Home` (Interactive 3D visuals, scroll-driven storytelling, full homepage)
* `/about` → `About` (Brand vision, engineering approach, institutional focus)
* `/services` → `Services` (Deep dive into Digital Solutions, AI & Automation, Technical Training)
* `/contact` → `Contact` (Direct inquiry submission with audience classification)

---

## 🚀 Running the Project

```bash
cd frontend

# Install dependencies (if needed)
npm install

# Run local development server
npm run dev

# Run production build and TypeScript checks
npm run build
```
