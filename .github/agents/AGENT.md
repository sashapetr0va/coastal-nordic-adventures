---
name: "coastal-nordic-adventures"
description: "AI guidance for the Nordic Walking Tours Northern Ireland website. Use when: understanding project architecture, implementing new features, debugging components, improving styling, adding tours/locations, integrating booking features, or working with Supabase."
---

# Nordic Walking Tours Northern Ireland - Project Agent

## Project Overview

Single-page React landing site for guided Nordic walking tours along the North Coast of Northern Ireland. Instructor: Sasha, based in Coleraine.

**Live site**: https://sashapetr0va.github.io/coastal-nordic-adventures/

## Tech Stack

- **React 18 + TypeScript + Vite** (dev server on port 8080)
- **Tailwind CSS** + **shadcn/ui** (Radix UI components in `src/components/ui/`)
- **React Router** with `basename="/coastal-nordic-adventures"` for GitHub Pages
- **Supabase** (PostgreSQL backend, client in `src/integrations/supabase/`)
- **Tanstack Query** for async data fetching
- **Sonner** for toast notifications
- **Vitest** (unit tests) + **Playwright** (E2E)

## Architecture

### Page Structure
All sections render on `/` via `src/pages/Index.tsx`:
Navbar → HeroSection → AboutSection → LocationsSection → BenefitsSection → ToursSection → BookingSection → ContactSection → Footer

### Key Patterns

**Scroll Animations** — sections use `useScrollReveal()` hook (IntersectionObserver):
```tsx
const { ref, isVisible } = useScrollReveal();
<section ref={ref} className={isVisible ? "animate-fade-up" : "opacity-0"}>
```
Animation classes: `animate-fade-up`, `animate-slide-left`, `animate-slide-right`

**Booking** — client-side mailto: form in BookingSection.tsx → opens email client → `sashe4ka.petrova@gmail.com`. No backend persistence yet.

**Styling** — Tailwind utility-first with custom tokens:
- Colors: `ocean`, `ocean-light`, `sand`, `sand-dark`, `forest`, `forest-light`, `cliff`
- Fonts: DM Serif Display (headings), DM Sans (body)
- CSS variables in `src/index.css`, theme in `tailwind.config.ts`

### Custom Hooks
- `useScrollReveal` — viewport animation trigger
- `useIsMobile` — responsive breakpoint (768px)
- `use-toast` — toast notification management

## Development

```bash
npm run dev        # Dev server at localhost:8080
npm run build      # Production build → dist/
npm run test       # Unit tests (Vitest)
npm run lint       # ESLint
```

## Deployment

GitHub Pages via Actions — auto-deploys on push to `main`. Workflow: `.github/workflows/deploy.yml`

## Adding Features

**New section**: Create `src/components/NewSection.tsx` → add `useScrollReveal()` → import in `src/pages/Index.tsx` → add anchor `id` for navbar

**New tour/location**: Add to data arrays in ToursSection.tsx or LocationsSection.tsx (currently hardcoded). For dynamic data, use Tanstack Query + Supabase.

**Form handling**: Use `useState` for form state, Sonner for feedback (`toast.success()`), mailto: or Supabase for submission.

## Guidelines

- Use Tailwind utility classes — no inline styles or hardcoded colors
- Mobile-first responsive (`md:`, `lg:` breakpoints)
- Import assets via `@/assets/` alias
- Add `useScrollReveal()` to new sections
- Write semantic HTML with descriptive alt text
- Keep tone warm, welcoming, and adventure-focused

## Key Files

| File | Role |
|------|------|
| `src/pages/Index.tsx` | Main page — composes all sections |
| `src/App.tsx` | Router + providers |
| `src/components/*Section.tsx` | Individual sections |
| `src/hooks/useScrollReveal.ts` | Scroll animation logic |
| `tailwind.config.ts` | Theme colors, fonts, animations |
| `index.html` | HTML entry with SEO + schema.org JSON-LD |
| `.github/workflows/deploy.yml` | GitHub Pages CI/CD |

## Contact Info

- **Email**: sashe4ka.petrova@gmail.com
- **Phone**: +447541772498
- **Tour Areas**: Portrush, Portstewart, Whiterocks, Benone Beach
