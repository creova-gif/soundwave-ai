# SoundWave AI — Viral Engine

**Not a marketing tool. A distribution engine. Input one song, get 100+ pieces of platform-optimized content across 6 platforms, built to force algorithm exposure for independent artists.**

[![Status](https://img.shields.io/badge/status-v1.0_launched-brightgreen)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

*(Positioning statement above is from the product's own PRD — kept verbatim because it's a clear, specific claim, not marketing filler.)*

---

![SoundWave AI dashboard](docs/screenshots/dashboard.png)

---

## What this is

Independent artists don't fail because of bad music — they fail because of no consistent posting, no understanding of platform algorithms, and no ability to scale content volume. SoundWave AI addresses that directly: one song in, dozens of optimized short-form clips and posts out, tailored per platform, at a volume no individual artist could produce manually.

**Explicitly not competing with** Hootsuite or Buffer — those schedule posts you already made. SoundWave AI generates the content itself.

**Live:** [sound-wave-ai.replit.app](https://sound-wave-ai.replit.app) — this is a real, launched v1.0 product, not a prototype.

---

## Core Features

- **AI content generation agent** — turns a single song into platform-specific content variations
- **AI posting agent** — handles distribution across platforms
- **AI analytics agent** — tracks performance to feed back into content strategy
- **Auth system** — full login/register/logout flow

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend / Backend | Next.js 16, React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Database / Auth | Supabase v2 |
| AI SDK | `@ai-sdk/react` |
| ORM | Drizzle (`db:push` script) |

---

## Getting Started (Local Dev)

### Prerequisites
- Node.js 18+
- Supabase project (auth + database)

### Installation

```bash
git clone https://github.com/creova-gif/soundwave-ai.git
cd soundwave-ai
npm install
```

### Running locally

```bash
npm run dev
```
Runs on port 5000 by default.

### Database

```bash
npm run db:push
```

---

## Roadmap / Status

Per the product's own PRD: **v1.0 launched**, v1.5 in planning (marked "strategically refined" in the roadmap doc — worth reviewing `PRD.md` directly for what's actually changing in v1.5).

## Contributing

This is a private, proprietary CREOVA product. External contributions are not accepted at this time.

## License

Proprietary — All Rights Reserved. See `LICENSE`.

## Credits

Built by CREOVA. Product lead: Justin Mafie.
