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
- **Routing**: React Router (SPA, serves from `/` on custom domain `nordicwalk.fit`)
- **Styling**: Tailwind CSS utility-first + CSS variables in `src/index.css`
- **Components**: shadcn/ui (Radix UI) in `src/components/ui/`
- **Animations**: Custom `useScrollReveal` hook (IntersectionObserver) with Tailwind animation classes (`animate-fade-up`, `animate-slide-left`, `animate-slide-right`)
- **Booking**: Client-side mailto: form (no backend persistence yet)
- **Backend**: Supabase Edge Functions for serverless AI proxy; PostgreSQL for knowledge base (`tours` + `knowledge_base` tables)
- **Knowledge Base**: All business knowledge (tours, FAQ, policies, contact info) stored in Supabase DB — editable via Dashboard, cached 5 min in Edge Function
- **Deployment**: GitHub Pages via Actions (`.github/workflows/deploy.yml`), custom domain `nordicwalk.fit`, auto-deploys on push to `main`
- **AI Chat**: Floating chat widget (`ChatWidget.tsx`) backed by Supabase Edge Function (`supabase/functions/chat/`) that proxies to OpenRouter with tool-use support
- **Security**: CORS origin whitelist, IP rate limiting (20 req/min via `cf-connecting-ip`), RLS policies on DB tables, message size validation (2000 char max), API keys as Supabase secrets
- **AI Provider**: Configurable via env vars (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`) — supports OpenRouter, Gemini, OpenAI, Anthropic with zero code changes
- **SEO**: Comprehensive meta tags (OG, Twitter, geo), 6 JSON-LD schemas, AI-friendly `robots.txt` + `llms.txt`, sitemap
- **AI Crawlers**: `robots.txt` allows search bots (ChatGPT, Perplexity, Claude, etc.) + training bots; blocks CCBot, Bytespider, Diffbot, cohere-ai

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
| `supabase/functions/chat/index.ts` | AI chat Edge Function (OpenRouter + tool-use + rate limiting + CORS) |
| `supabase/migrations/` | Database schema, seed data, and RLS policies |
| `src/components/ChatWidget.tsx` | Floating chat UI |
| `src/hooks/useChat.ts` | Chat hook (SSE streaming from Edge Function) |
| `src/components/ChatMessage.tsx` | Chat message bubble component |
| `docs/KNOWLEDGE_BASE_GUIDE.md` | How to edit the knowledge base (bilingual EN/RU) |
| `public/robots.txt` | Crawler rules: AI search bots, training bots, blocked scrapers |
| `public/llms.txt` | Structured Markdown summary for LLMs |
| `public/sitemap.xml` | XML sitemap |
| `public/og-image.jpg` | Social sharing preview image (1024x680, CC BY 2.0) |

## Supabase Commands

```bash
npx supabase login --token <token>                                      # Authenticate (one-time)
npx supabase functions deploy chat --project-ref ywdqxkypzrlfqdghjdrq   # Deploy Edge Function
npx supabase secrets set AI_BASE_URL=... AI_API_KEY=... AI_MODEL=... --project-ref ywdqxkypzrlfqdghjdrq  # Set provider
npx supabase db push --linked                                           # Apply DB migrations
npx supabase gen types typescript --project-id ywdqxkypzrlfqdghjdrq > src/integrations/supabase/types.ts  # Regen types
```

## Database Tables

| Table | Purpose | Editable via |
|-------|---------|-------------|
| `tours` | Tour offerings (name, duration, price, locations) | Supabase Dashboard |
| `knowledge_base` | FAQ, policies, contact, about, guidelines | Supabase Dashboard |

See `docs/KNOWLEDGE_BASE_GUIDE.md` for editing instructions.

## AI Provider Config (Supabase Secrets)

| Secret | Current Value |
|--------|--------------|
| `AI_BASE_URL` | `https://openrouter.ai/api/v1` |
| `AI_API_KEY` | (stored as Supabase secret) |
| `AI_MODEL` | `google/gemini-2.5-flash` |
