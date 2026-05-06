# Product Requirements Document
## SoundWave AI — Viral Engine

**Version:** 1.5 (Strategically Refined)  
**Status:** v1.0 Launched · v1.5 In Planning  
**Live URL:** https://sound-wave-ai.replit.app  
**Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript · Supabase (v2)

---

## 1. Product Positioning

**SoundWave AI is not a marketing tool. It is a distribution engine.**

Independent artists don't fail because of bad music. They fail because:
- No consistent posting
- No understanding of platform algorithms
- No ability to scale content volume

> **Input:** 1 song  
> **Output:** 100+ pieces of optimized content across 6 platforms  
> **Goal:** Force algorithm exposure

**Category:** AI Growth Engine for Music Distribution

**Not competing with:** Hootsuite, Buffer (they schedule posts)  
**We do:** Generate → test → optimize → scale content automatically

---

## 2. Target Users

| Persona | Description | Pain |
|---|---|---|
| Independent Artist | Solo musician releasing music, no team | No bandwidth to post consistently |
| Small Label | Manages 2–10 artists | Can't scale content across artists |
| Music Manager | Oversees campaign execution | Spends hours on manual posting |

---

## 3. The Core System Loop

**This loop IS the product. Every feature must serve it.**

```
Generate → Distribute → Measure → Adapt → Repeat
```

| Phase | What Happens |
|---|---|
| **Generate** | AI creates hooks, captions, scripts, hashtags — multiple variations per post |
| **Distribute** | Cross-platform posting at time-optimized windows |
| **Measure** | Track engagement per post, detect viral signals early |
| **Adapt** | Double down on winning formats, kill low-performing patterns |

---

## 4. Realistic Performance Expectations

| Tier | Expected Impressions |
|---|---|
| Baseline | 500K – 2M per campaign |
| High-performing | 5M – 20M+ |
| Viral outlier | 50M+ |

> Investors and users trust ranges, not promises.

---

## 5. Feature Inventory

### 5.1 Current (v1.0 — Launched)

| Feature | Status |
|---|---|
| Landing page with platform pills | Live |
| Dashboard overview (reach counter, charts, agent logs) | Live |
| Analytics (engagement metrics, reach over time, platform breakdown) | Live |
| Content queue with AI generation | Live |
| Campaign management (create, pause, track) | Live |
| Platform connections UI (6 platforms) | Live |
| AI Agents control panel (4 agents) | Live |
| Settings (agent config, notifications, content rules, API keys) | Live |
| Demo mode banner | Live |
| Production deployment on Replit Autoscale | Live |

---

### 5.2 Planned (v1.5 — Next 30 Days)

#### 5.2.1 Multi-Variant Content Generation Engine
**Current:** Single output per AI generation  
**New:** 5–10 variations per post

Each variation tagged with:
- **Tone:** Emotional / Hype / Storytelling / Controversial
- **Format:** Question / Statement / Hook / CTA

Enables A/B testing later. Feeds the Adapt phase of the core loop.

---

#### 5.2.2 Intelligent Posting Engine (Adaptive)
**Current:** Static scheduling  
**New:** Dynamic, platform-aware posting rules

| Platform | Daily Frequency | Timing Logic |
|---|---|---|
| TikTok | 3–6/day | Engagement heatmap |
| Instagram | 2–4/day | Historical performance |
| YouTube Shorts | 1–3/day | Peak audience time |
| X / Twitter | 4–8/day | Trend windows |
| Facebook | 1–2/day | Community activity |
| Spotify | Pitch only | Release windows |

---

#### 5.2.3 Viral Signal Detection (Critical New Feature)

Detect early signals before a post pops:
- High watch time relative to average
- Save rate spike
- Comment velocity acceleration
- Share-to-view ratio threshold

**If triggered automatically:**
1. Repost variation within 6–12 hours
2. Push similar content formats across platforms
3. Increase posting frequency for that format

> This is how virality gets manufactured, not waited for.

---

#### 5.2.4 Content Amplification Engine

When a post performs above threshold:

System auto-generates:
- Thread version → X / Twitter
- Story format → Instagram
- Extended writeup → YouTube description
- Slight variation → reposts

> 1 viral post becomes 10 derivative posts automatically.

---

#### 5.2.5 Campaign Intelligence Layer

Upgrade Campaigns page from tracker to decision engine:

**Status indicators:** On Track / At Risk / Viral  

**Suggested actions (auto-generated):**
- "Increase TikTok output — engagement rate 2x average"
- "Switch hook style on Instagram — saves rate dropping"
- "Pause Facebook — zero traction in 48 hours"

> Users shouldn't have to think. The system tells them what to do.

---

### 5.3 AI Agent Evolution (v2.0)

| Agent | Learns | Outputs |
|---|---|---|
| **Content Agent** | Which hooks perform best, artist's tone/style | Personalized content, not generic AI |
| **Posting Agent** | Best times per platform, fatigue thresholds | Adaptive schedule, avoids spam penalties |
| **Analytics Agent** | Historical performance patterns | Predictions: "This post will outperform by ~40%" |
| **Orchestrator** | Full campaign context | Autonomous decisions: increase/decrease/pivot strategy |

---

## 6. Data Layer (Required for v2)

**Current:** In-memory mock store — no persistence  
**Required:** PostgreSQL via Supabase

### Database Schema

| Table | Key Fields |
|---|---|
| `users` | id, email, plan, created_at |
| `campaigns` | id, user_id, name, status, target_reach, platforms |
| `content` | id, campaign_id, platform, body, hashtags, tone, format, status |
| `posts` | id, content_id, platform_post_id, posted_at, engagement |
| `metrics` | post_id, views, likes, comments, shares, saves, watch_time |
| `agent_decisions` | id, campaign_id, agent, decision, rationale, timestamp |

Without persistence:
- Can't learn from past campaigns
- Can't improve AI outputs over time
- Can't build defensibility against competitors

---

## 7. Monetization

### Pricing Tiers

| Tier | Price | Limits |
|---|---|---|
| **Free** | $0 | 1 campaign, 10 posts/day, limited AI |
| **Pro** | $29–$79/month | Unlimited campaigns, full automation, analytics |
| **Label** | $199–$499/month | Multi-artist dashboard, priority AI, advanced analytics |

### Future Revenue
- Pay-per-viral-boost (one-time fee to activate amplification engine)
- CREOVA agency bundle (SoundWave AI as backend engine for client campaigns)

---

## 8. Growth Strategy

### Phase 1: Artists (0 → 100 users)
- DM outreach to independent artists
- Offer free campaigns to 10 artists
- Capture results as case studies

### Phase 2: TikTok Growth Loop
- Post proof: "We got this artist 1M views in 7 days"
- Funnel viewers → landing page
- Let the product market itself

### Phase 3: CREOVA Integration
- Bundle SoundWave AI into CREOVA agency services
- Use as the tech backbone for client campaigns
- Turns agency into a tech-enabled powerhouse

---

## 9. Technical Roadmap

| Phase | Timeline | Deliverables |
|---|---|---|
| **Phase 1** | 0–30 days | Supabase integration, auth system, real campaign storage |
| **Phase 2** | 30–60 days | TikTok + Instagram API OAuth, real posting (not simulation) |
| **Phase 3** | 60–90 days | Trend detection engine, A/B testing, viral signal automation |
| **Phase 4** | 90–120 days | Audio analysis (BPM, mood, genre), auto-style content generation |
| **Phase 5** | 120+ days | Mobile app (Expo), push notifications for approvals |

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Platform API restrictions (TikTok especially) | Human-in-the-loop approval flow, platform-specific compliance |
| Spam detection / shadowbanning | Content variation engine, posting frequency limits, fatigue thresholds |
| AI-generated content fatigue | Multi-variant system, tone/format diversity |
| Overpromising results | Range-based expectations, not guarantees |

---

## 11. Competitive Positioning

| Tool | What They Do | SoundWave AI |
|---|---|---|
| Hootsuite | Schedule posts | Generate + test + optimize + scale |
| Buffer | Queue content manually | Autonomous 24/7 content engine |
| DistroKid | Distribute audio | Distribute content at volume |
| Feature.fm | Playlist pitching | Algorithm forcing across all platforms |

**Moat:** The more campaigns run, the more the agents learn. Data compounding creates defensibility over time.

---

## 12. Final Positioning Statement

> SoundWave AI is not a tool artists use.  
> It is a system that replaces their marketing team.
