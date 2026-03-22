# Nordic Walking Tours Northern Ireland

A responsive landing page for guided Nordic walking tours along the North Coast of Northern Ireland, built with React + TypeScript.

**Live site**: https://nordicwalk.fit

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **React Router** (SPA routing)
- **Supabase** (PostgreSQL knowledge base + Edge Functions)
- **Tanstack Query** (data fetching)
- **Vitest** (64 unit tests)
- **OpenRouter** (AI chat via Supabase Edge Function with tool-use)

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
│   ├── ChatWidget.tsx   # AI chat widget
│   ├── Footer.tsx
│   └── ui/              # shadcn/ui components
├── pages/
│   ├── Index.tsx        # Main landing page (composes all sections)
│   └── NotFound.tsx     # 404 page
├── hooks/
│   ├── useScrollReveal.ts  # Intersection Observer scroll animations
│   ├── useChat.ts         # Chat hook for AI widget
│   ├── use-mobile.tsx     # Responsive breakpoint detection
│   └── use-toast.ts       # Toast notifications
├── integrations/supabase/  # Supabase client & types
├── assets/              # Tour location & instructor images
└── test/                # Vitest setup & tests

supabase/
├── functions/chat/
│   └── index.ts         # AI chat Edge Function (OpenRouter + tool-use)
├── migrations/          # DB schema, seed data, RLS policies
└── config.toml

docs/
└── KNOWLEDGE_BASE_GUIDE.md  # How to edit agent knowledge (EN/RU)
```

## Deployment

Deployed to **GitHub Pages** via GitHub Actions with custom domain `nordicwalk.fit`. Every push to `main` triggers a build and deploy (see `.github/workflows/deploy.yml`).

## AI Chat

The site includes a floating chat widget powered by [OpenRouter](https://openrouter.ai) via a Supabase Edge Function. The chat agent has tool-use capabilities — it can look up tour details and check the current time to give accurate, context-aware answers.

### Architecture

```
Browser (ChatWidget) → Supabase Edge Function → OpenRouter → AI Model
                              ↕
                     Supabase PostgreSQL
                   (tours + knowledge_base)
```

- **Frontend**: `ChatWidget.tsx` + `useChat.ts` hook with SSE streaming
- **Backend**: Supabase Edge Function (`supabase/functions/chat/index.ts`) acts as a secure proxy
- **Knowledge Base**: All business knowledge stored in Supabase DB (`tours` + `knowledge_base` tables), editable via the [Supabase Dashboard](https://supabase.com/dashboard) — see `docs/KNOWLEDGE_BASE_GUIDE.md`
- **Provider**: Configurable via Supabase secrets (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`) — swap providers without code changes

### Security

- API keys stored as Supabase secrets (never exposed to the browser)
- CORS origin whitelist: only `nordicwalk.fit` and `localhost` allowed
- IP-based rate limiting: 20 requests/minute per IP (via Cloudflare `cf-connecting-ip`)
- Message size validation: 2000 character max per message
- Response size capped at 500 tokens per message
- RLS policies: anon role can only read active rows, no write access
- AI provider error details not exposed to clients

### Edge Function Deployment

```bash
npx supabase login --token <token>
npx supabase secrets set AI_BASE_URL=https://openrouter.ai/api/v1 AI_API_KEY=<key> AI_MODEL=google/gemini-2.5-flash --project-ref ywdqxkypzrlfqdghjdrq
npx supabase functions deploy chat --project-ref ywdqxkypzrlfqdghjdrq
```

## Contact

- **Instructor**: Sasha
- **Location**: Coleraine, Northern Ireland
- **Tour Areas**: Portrush, Portstewart, Whiterocks, Benone Beach
