# Product Requirements Document
## SoundWave AI — Viral Engine

**Version:** 1.0  
**Status:** Launched  
**Live URL:** https://sound-wave-ai.replit.app  
**Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript

---

## 1. Product Overview

SoundWave AI is an AI-powered music marketing command center that helps independent artists and labels reach mass audiences without a full marketing team. The system uses autonomous AI agents to generate viral content, schedule cross-platform posts, and track campaign analytics — all from a single dashboard.

**Core value proposition:** Launch a music track and reach 20 million people in 2 weeks with zero manual posting.

---

## 2. Target Users

| Persona | Description |
|---|---|
| Independent Artist | Solo musician releasing music, no marketing budget or team |
| Small Label | Manages 2–10 artists, needs scalable automation |
| Music Manager | Oversees campaigns across multiple platforms for a roster |

---

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Reduce time spent on social media marketing | < 30 min/day of manual work |
| Increase total reach per release | 10M+ streams within 2 weeks of launch |
| Maintain platform presence | 6+ posts/day across all platforms |
| Improve content quality | > 5% average engagement rate |

---

## 4. Feature Inventory (Current v1.0)

### 4.1 Landing Page
- Hero section with platform pills (TikTok, Instagram, YouTube, X/Twitter, Facebook, Spotify)
- Features grid explaining AI agent capabilities
- How It Works section (3-step walkthrough)
- Call-to-action linking to dashboard

### 4.2 Dashboard Overview (`/dashboard`)
- **Total Reach Counter** — live animated counter showing cumulative reach vs. 20M goal with gradient progress bar
- **Stats Cards** — Posts Today, Scheduled, Total Views, Engagement Rate
- **Reach Over Time chart** — 14-day area chart (Recharts)
- **Platform Breakdown** — horizontal bar breakdown by platform with percentage share
- **Content Queue Preview** — next 3 queued posts with platform icon badges and status
- **Agent Activity Log** — real-time log feed with AnimatePresence entries
- **Refresh** and **Pause Agents** controls

### 4.3 Analytics (`/dashboard/analytics`)
- Campaign goal progress tracker (current reach vs. target, days remaining, on-track status)
- Engagement metrics: Views, Likes, Comments, Shares with trend deltas
- Reach Over Time area chart (14-day)
- Platform Distribution pie/donut chart
- Hourly Engagement Pattern bar chart (best posting times)
- Top Performing Content list

### 4.4 Content Queue (`/dashboard/content`)
- Card-based content queue with platform icon badges (real SVG icons)
- Status badges: Approved / Pending / Posted / Failed
- Filters by platform and status
- Per-post actions: Edit, Approve, Delete
- **Generate with AI** — streams AI-generated captions, hashtags, and scripts via Vercel AI SDK
- **Add Content** manual creation flow

### 4.5 Campaigns (`/dashboard/campaigns`)
- Campaign cards with animated progress bar (reach progress)
- Stats grid: Target, Current reach, Budget, Duration
- Platform badges with real icons for all 6 platforms
- Status indicators: Draft / Active / Paused / Completed
- Start / Pause / Resume campaign controls
- **New Campaign** dialog — name, target reach, budget, duration

### 4.6 Platform Connections (`/dashboard/platforms`)
- Connection status hub showing all 6 platforms with real SVG icons
- Per-platform detail cards: account handle, follower count, last synced time
- Sync and Disconnect actions per platform
- 5 of 6 platforms connected in demo mode

### 4.7 AI Agents (`/dashboard/agents`)
- 4 autonomous agent cards: Content Agent, Posting Agent, Analytics Agent, Orchestrator
- Running status indicators with animated pulse
- Enable/disable toggle per agent
- **Run Now** trigger for on-demand execution
- **View Logs** per agent
- **Agent Console** — send custom instructions to agents via AI streaming API

### 4.8 Settings (`/dashboard/settings`)
- **Agents tab** — auto-approve toggle, trend responder, max posts/day (6–24), min time between posts (1–4h), AI model selection (GPT-4o, GPT-4o Mini, Claude Sonnet)
- **Notifications tab** — email, push, viral alerts, error alerts, daily digest toggles
- **Content tab** — require manual approval, content guidelines textarea, banned words list
- **API Keys tab** — OpenAI key, PostEverywhere key fields with demo mode warning

### 4.9 Demo Mode Banner
- Persistent banner across all dashboard pages indicating mock data
- Directs users to Settings → API Keys to connect real platforms

---

## 5. AI Agent Architecture

| Agent | Role | API Route |
|---|---|---|
| Content Agent | Generates captions, hashtags, video scripts | `/api/agents/content` |
| Posting Agent | Schedules and publishes content | `/api/agents/posting` |
| Analytics Agent | Monitors performance, detects trends | `/api/agents/analytics` |
| Orchestrator | Coordinates agents, adjusts strategy | Managed by Orchestrator logic |

All agents use the **Vercel AI SDK** with streaming responses. Currently in demo/simulation mode — no real platform API keys required to run.

---

## 6. Supported Platforms

| Platform | Icon | Content Types |
|---|---|---|
| TikTok | Real SVG | Short-form video captions, hooks |
| Instagram | Real SVG | Feed posts, Reels, Stories |
| YouTube | Real SVG | Shorts, long-form descriptions |
| X / Twitter | Real SVG | Tweets, thread starters |
| Facebook | Real SVG | Posts, community engagement |
| Spotify | Real SVG | Playlist pitching, bio copy |

---

## 7. Technical Requirements

| Requirement | Decision |
|---|---|
| Framework | Next.js 16.2.4 App Router |
| Bundler | Webpack (Turbopack disabled — CSS url() bug) |
| Styling | Tailwind CSS v4, custom oklch dark theme |
| Animations | Framer Motion v12 |
| Charts | Recharts |
| State | Zustand (client-side store) |
| AI | Vercel AI SDK, streaming |
| Deployment | Replit Autoscale |
| Build | `next build --webpack` |
| Production server | `next start -p 5000` |
| Security | 0 known vulnerabilities (pnpm audit clean) |

---

## 8. Out of Scope (v1.0)

- Real platform OAuth connections (TikTok API, Instagram Graph API, etc.)
- Persistent database (Supabase / PostgreSQL)
- User authentication / multi-account support
- Billing / subscription management
- Audio/video upload and processing
- Real AI content moderation
- Mobile native app

---

## 9. Roadmap (v2.0 Ideas)

1. **Real platform integrations** — OAuth connect TikTok, Instagram, YouTube
2. **User auth** — Supabase Auth for multi-user support
3. **Database persistence** — store campaigns, content, and analytics in PostgreSQL
4. **Stripe billing** — subscription tiers (Free / Pro / Label)
5. **Audio upload** — analyze track mood/tempo to inform content style
6. **Trend detection** — real-time TikTok trending audio/hashtag detection
7. **A/B content testing** — run two caption variants, promote the winner
8. **Mobile app** — Expo-based companion app for approvals on the go
