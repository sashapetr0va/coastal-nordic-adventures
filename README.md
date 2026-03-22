# Nordic Walking Tours Northern Ireland

A responsive landing page for guided Nordic walking tours along the North Coast of Northern Ireland, built with React + TypeScript.

**Live site**: https://sashapetr0va.github.io/coastal-nordic-adventures/

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **React Router** (SPA routing)
- **Supabase** (PostgreSQL backend)
- **Tanstack Query** (data fetching)
- **Vitest** + **Playwright** (testing)

## Getting Started

```bash
npm install
npm run dev        # Dev server at http://localhost:8080
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run test       # Run unit tests
npm run lint       # Run ESLint
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── Navbar.tsx       # Fixed navigation header
│   ├── HeroSection.tsx  # Landing hero with CTA
│   ├── AboutSection.tsx # Instructor introduction
│   ├── LocationsSection.tsx
│   ├── BenefitsSection.tsx
│   ├── ToursSection.tsx
│   ├── BookingSection.tsx  # Mailto booking form
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   └── ui/              # shadcn/ui components
├── pages/
│   ├── Index.tsx        # Main landing page (composes all sections)
│   └── NotFound.tsx     # 404 page
├── hooks/
│   ├── useScrollReveal.ts  # Intersection Observer scroll animations
│   ├── use-mobile.tsx      # Responsive breakpoint detection
│   └── use-toast.ts        # Toast notifications
├── integrations/supabase/  # Supabase client & types
├── assets/              # Tour location & instructor images
└── test/                # Vitest setup & tests
```

## Deployment

Deployed to **GitHub Pages** via GitHub Actions. Every push to `main` triggers a build and deploy (see `.github/workflows/deploy.yml`).

## Contact

- **Instructor**: Sasha
- **Location**: Coleraine, Northern Ireland
- **Tour Areas**: Portrush, Portstewart, Whiterocks, Benone Beach
