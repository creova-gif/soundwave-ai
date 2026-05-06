# SoundWave AI — Viral Engine

AI-powered music marketing command center that autonomously generates content, posts across platforms, and tracks campaign analytics.

## Run & Operate

- `npm run dev` — starts Next.js dev server on port 5000 (webpack mode)
- `npm run build` — production build (webpack mode, required — Turbopack breaks CSS)
- `npm run start` — production server on port 5000
- `npm run db:push` — push Drizzle schema changes to the database

Required env vars: `DATABASE_URL`, `SESSION_SECRET` (already provisioned as Replit secrets)

## Stack

- **Framework**: Next.js 16.2.4 (App Router, webpack mode)
- **UI**: Tailwind CSS v4, shadcn/ui (Radix UI), Framer Motion, Recharts
- **Fonts**: Space Grotesk, Syne, JetBrains Mono
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/react`)
- **Auth**: iron-session v8 (encrypted cookies) + bcryptjs — sessions in `sw_session` cookie
- **Database**: Replit PostgreSQL + Drizzle ORM (`lib/db/schema.ts`, `lib/db/index.ts`)
- **State**: Zustand (`lib/store.ts`) — still used for mock/demo data
- **Language**: TypeScript 5.7

## Where things live

- `app/` — Next.js App Router pages
  - `app/page.tsx` — Landing page
  - `app/login/page.tsx` — Login/register page (split-screen)
  - `app/dashboard/` — Dashboard routes (overview, agents, analytics, campaigns, content, platforms, settings)
  - `app/api/auth/` — register, login, logout, user (PATCH for Telegram/WhatsApp)
  - `app/api/campaigns/` — GET/POST + `[id]` PATCH/DELETE
  - `app/api/content/` — GET/POST + `[id]` PATCH/DELETE
  - `app/api/dashboard/` — aggregate stats endpoint
  - `app/api/telegram/test/` — real Telegram Bot API test + save credentials
- `components/dashboard/music-player.tsx` — Floating mini-player with animated waveform
- `components/dashboard/` — Sidebar, charts, stats cards, etc.
- `components/ui/` — shadcn/ui primitives
- `lib/db/schema.ts` — Drizzle schema: users, campaigns, content_items, agent_logs
- `lib/db/index.ts` — Drizzle + pg Pool client
- `lib/session.ts` — iron-session config (SessionData type, cookie options)
- `lib/types.ts` — Platform type includes telegram + whatsapp
- `proxy.ts` — Route protection (replaces middleware.ts in Next.js 16)
- `drizzle.config.ts` — Points to `lib/db/schema.ts`

## Architecture decisions

- Webpack used instead of Turbopack (`--webpack` flag) — Turbopack fails to build Tailwind v4 CSS
- `css-loader url: false` + `watchOptions.ignored: .local/**` in `next.config.mjs` — do not remove
- `typedRoutes: false` — prevents Next.js 16 rebuild loop on every compile
- **proxy.ts not middleware.ts** — Next.js 16 deprecates `middleware.ts`; must export `proxy` function (not `middleware`)
- Auth uses iron-session encrypted cookies, no DB session table needed
- Dashboard pages still use Zustand mock store — API routes exist for real data, migration ongoing

## Product

- **Landing page** — Hero, features grid, platform pills, CTA
- **Login/Register** — Split-screen, email+password, redirects to `/dashboard`
- **Dashboard overview** — Stats cards, reach counter, engagement chart, content queue, agent logs
- **Music Player** — Floating animated waveform player (bottom bar), 4-track demo queue
- **Settings → Connections** — Telegram bot setup (BotFather guide + real API test) + WhatsApp number
- **Agents** — View/control AI agents (analytics, content, posting)
- **Analytics** — Charts and metrics across platforms
- **Campaigns** — Campaign management (DB-backed via API)
- **Content** — Content queue and scheduling (DB-backed via API)
- **Platforms** — Platform connection management (telegram + whatsapp added as platform types)

## User preferences

- Wants Telegram bot integration (BotFather credentials → real Telegram Bot API alerts)
- Wants WhatsApp as a marketing platform (content generation + wa.me links)
- Wants embedded music player in dashboard

## Gotchas

- Must run with `--webpack` flag — Turbopack breaks Tailwind v4 CSS processing
- `next.config.mjs` webpack override sets `css-loader url: false` AND `watchOptions.ignored` — do not remove either
- Route protection file is `proxy.ts` (not `middleware.ts`) — must export `async function proxy`
- iron-session requires SESSION_SECRET ≥ 32 chars — already set as a Replit secret
- `npm run db:push` must be run after schema changes

## Pointers

- Tailwind v4 docs: https://tailwindcss.com/docs/v4
- Next.js App Router: https://nextjs.org/docs/app
- iron-session v8: https://github.com/vvo/iron-session
- Drizzle ORM: https://orm.drizzle.team
