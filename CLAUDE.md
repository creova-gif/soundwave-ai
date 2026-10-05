# CLAUDE.md — soundwave-ai

## Project Overview
AI/audio distribution platform — turns one song into platform-optimized content across 6 platforms. Real, launched v1.0 product (live at sound-wave-ai.replit.app), not a prototype.

## Technology Stack
Next.js 16, React 19, TypeScript, Tailwind CSS v4, Drizzle ORM, Supabase v2, `@ai-sdk/react`. Dev server runs on a hardcoded port 5000 (`next dev -p 5000 --webpack`) — do not assume Vite/generic React tooling.

## CI
`npm ci && npm run lint && npm run build`.

## AI Agent Rules
- Run `npm run lint` before considering any change complete — this repo has lint configured, unlike most of the portfolio's build-only tier.
- No automated test suite exists yet; don't claim test coverage that isn't there.
- The dev server binds to port 5000 specifically (`next dev -p 5000`) — if that port is in use, the existing script needs to change, not just the invocation.
- The landing page displays specific-looking live metrics (e.g. "Today's Reach 1.94M", "142 posts this week"). Verify whether these are real user data or illustrative/demo numbers before treating them as fact in any other context — not yet confirmed either way.

## Definition of Done
Lint and build both pass.
