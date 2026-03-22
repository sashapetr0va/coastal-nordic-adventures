# CLAUDE.md

## Project Overview

Nordic Walking Tours NI — a single-page React landing site for guided Nordic walking tours along the North Coast of Northern Ireland.

## Commands

```bash
npm run dev        # Dev server on localhost:8080
npm run build      # Production build to dist/
npm run test       # Unit tests (Vitest)
npm run lint       # ESLint
```

## Architecture

- **SPA**: Single page app — all sections render on `/` via `src/pages/Index.tsx`
- **Routing**: React Router with `basename="/coastal-nordic-adventures"` for GitHub Pages
- **Styling**: Tailwind CSS utility-first + CSS variables in `src/index.css`
- **Components**: shadcn/ui (Radix UI) in `src/components/ui/`
- **Animations**: Custom `useScrollReveal` hook (IntersectionObserver) with Tailwind animation classes (`animate-fade-up`, `animate-slide-left`, `animate-slide-right`)
- **Booking**: Client-side mailto: form (no backend persistence yet)
- **Backend**: Supabase client configured in `src/integrations/supabase/` (database tables not yet populated)
- **Deployment**: GitHub Pages via Actions (`.github/workflows/deploy.yml`), auto-deploys on push to `main`

## Key Conventions

- Tailwind utility classes for all styling — no inline styles or hardcoded colors
- Mobile-first responsive design (`md:`, `lg:` breakpoints)
- New sections should use `useScrollReveal()` and follow existing section component patterns
- Asset imports via `@/assets/` alias (configured in vite.config.ts)
- Custom color tokens: `ocean`, `sand`, `forest`, `cliff` (defined in tailwind.config.ts)
- Fonts: DM Serif Display (headings), DM Sans (body)

## Important Files

| File | Role |
|------|------|
| `src/pages/Index.tsx` | Main page — composes all section components |
| `src/App.tsx` | Router + providers setup |
| `src/components/*Section.tsx` | Individual page sections |
| `src/hooks/useScrollReveal.ts` | Scroll animation logic |
| `tailwind.config.ts` | Theme colors, fonts, animations |
| `index.html` | HTML entry with SEO meta tags + schema.org JSON-LD |
| `.github/workflows/deploy.yml` | GitHub Pages CI/CD |
