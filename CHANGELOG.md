# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- AI chat widget (`ChatWidget.tsx`, `ChatMessage.tsx`) with streaming responses
- `useChat` hook for SSE streaming from Supabase Edge Function
- Supabase Edge Function (`supabase/functions/chat/`) proxying to OpenRouter
- Tool-use support in the chat Edge Function:
  - `get_tour_info` — returns details about a specific tour (duration, group size, locations)
  - `get_current_time` — returns current date/time in Europe/London timezone
- Server-side tool-call loop (up to 3 rounds) with streaming final response
- Provider-agnostic AI backend — switch providers (OpenRouter, Gemini, OpenAI) via env vars (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`)
- IP-based rate limiting on Edge Function (20 requests/minute per IP)
- CORS origin whitelist — only `nordicwalk.fit` and `localhost` origins allowed
- Unit tests for ChatMessage, ChatWidget, useChat hook, Supabase client, and Edge Function logic (rate limiter, CORS, tool execution)
- Supabase knowledge base: `tours` table (structured tour data) and `knowledge_base` table (FAQ, policies, contact, guidelines)
- Edge Function reads knowledge from Supabase DB with 5-minute in-memory cache
- Database migrations and seed data (`supabase/migrations/`)
- Dynamic system prompt and tool definitions built from DB content
- Supabase agent skill: `supabase-postgres-best-practices`
- OpenRouter agent skill: `create-agent`

### Changed
- Edge Function refactored: hardcoded SYSTEM_PROMPT and TOUR_DATA replaced with DB queries
- Tool `get_tour_info` enum now dynamically populated from active tours in DB
- Updated README and CLAUDE.md with architecture diagrams, security docs, and deployment instructions

### Security
- Removed leaked OpenRouter API key from `.env` (moved to Supabase secrets)
- Added CORS origin whitelist (replaces `Access-Control-Allow-Origin: *`)
- Added rate limiting to prevent abuse of the AI chat endpoint

## [1.0.0] - 2026-03-20

### Added
- Single-page React landing site for Nordic Walking Tours NI
- Section components: Hero, About, Locations, Benefits, Tours, Booking, Contact
- Scroll reveal animations via `useScrollReveal` hook (IntersectionObserver)
- Tailwind CSS theming with custom color tokens (ocean, sand, forest, cliff)
- shadcn/ui component library integration
- Client-side mailto: booking form
- Supabase client configuration
- GitHub Pages deployment via Actions
- Custom domain `nordicwalk.fit`
- SEO meta tags and schema.org JSON-LD in `index.html`
- Custom favicon

### Fixed
- SPA routing on GitHub Pages (basename on BrowserRouter)
- CI install via regenerated `package-lock.json`
- Removed `.env` from git tracking
