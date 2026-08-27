'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Music2, Play, ArrowRight, Bot, TrendingUp, BarChart3, Sparkles,
  Zap, Globe, CheckCircle2, Radio, Star,
} from 'lucide-react'
import { PlatformIcon } from '@/components/icons/platform-icons'

const platforms = [
  { name: 'TikTok', platform: 'tiktok' as const },
  { name: 'Instagram', platform: 'instagram' as const },
  { name: 'YouTube', platform: 'youtube' as const },
  { name: 'Twitter/X', platform: 'twitter' as const },
  { name: 'Facebook', platform: 'facebook' as const },
  { name: 'Spotify', platform: 'spotify' as const },
]

const features = [
  { icon: Bot, title: 'AI Agents', description: 'Autonomous agents generate viral content, schedule posts, and analyze performance 24/7 without you lifting a finger.' },
  { icon: TrendingUp, title: 'Trend Detection', description: 'Real-time monitoring of trending sounds, hashtags, and formats across every platform before they peak.' },
  { icon: Sparkles, title: 'Content Generation', description: 'AI creates platform-specific captions, hashtags, and video scripts optimized for maximum engagement.' },
  { icon: BarChart3, title: 'Analytics', description: 'Track reach, engagement, and campaign progress toward your goals in one unified real-time view.' },
  { icon: Zap, title: 'Auto Posting', description: 'Schedule and publish content at optimal times across all platforms simultaneously.' },
  { icon: Globe, title: 'Multi-Platform', description: 'Reach audiences on TikTok, Instagram, YouTube, Twitter, Facebook, and Spotify at once.' },
]

const testimonials = [
  { text: 'SoundWave AI got my single to 2M streams in 10 days. The agents worked around the clock.', name: 'Maya R.', role: 'Independent Artist' },
  { text: "I never thought AI could understand my sound, but the content it generates is genuinely on-brand.", name: 'Darius K.', role: 'Producer' },
  { text: 'From 500 to 50K followers in one campaign. The trend detection is insanely accurate.', name: 'Lena V.', role: 'Singer-Songwriter' },
]

const D = 'var(--font-display)'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ─── Floating pill navbar ─── */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
        <div className="anim-fade-up anim-d1 flex items-center gap-2 rounded-full border border-border/50 bg-card/85 px-3 py-2 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
              <Music2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span style={{ fontFamily: D, fontWeight: 700, fontSize: '0.85rem', letterSpacing: '-0.02em' }}>
              SoundWave AI
            </span>
          </div>
          <nav className="hidden items-center md:flex">
            {['Features', 'How It Works', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                {item}
              </Link>
            ))}
          </nav>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Launch <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-32">

        {/* Breathing orbs — CSS animated */}
        <div
          className="anim-orb pointer-events-none absolute -top-24 -left-20 h-[650px] w-[650px] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(0.35 0.11 44 / 0.85) 0%, transparent 65%)' }}
        />
        <div
          className="anim-orb-2 pointer-events-none absolute bottom-0 -right-10 h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(0.22 0.08 36 / 0.7) 0%, transparent 65%)' }}
        />

        {/* Badge */}
        <div className="anim-fade-up anim-d1 relative z-10 mb-8 flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 px-4 py-2 text-sm backdrop-blur">
          <span
            className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground"
            style={{ animation: 'orb-pulse 2.5s ease-in-out infinite' }}
          >
            New
          </span>
          <span className="text-muted-foreground">Your music reaches everywhere, automatically</span>
        </div>

        {/* Heading — Unbounded font, huge */}
        <h1
          className="anim-fade-up anim-d2 relative z-10 max-w-5xl text-balance text-center"
          style={{
            fontFamily: D,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            fontSize: 'clamp(2.6rem, 7.5vw, 6rem)',
          }}
        >
          Reach{' '}
          <span className="text-primary">20 Million</span>
          {' '}people{' '}
          <span style={{ color: 'oklch(0.65 0.02 50)' }}>in 2 weeks</span>
        </h1>

        {/* Subtitle */}
        <p
          className="anim-fade-up anim-d3 relative z-10 mt-7 max-w-lg text-center text-lg leading-relaxed text-muted-foreground"
        >
          Autonomous AI agents generate viral content, post across 6 platforms,
          and optimize your campaign 24/7 — no constant involvement needed.
        </p>

        {/* CTA buttons */}
        <div className="anim-fade-up anim-d4 relative z-10 mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background shadow-xl transition-opacity hover:opacity-85"
          >
            Start Your Campaign
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-8 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-card"
          >
            <Play className="h-4 w-4 fill-current text-primary" />
            Watch Demo
          </Link>
        </div>

        {/* Platform pills */}
        <div className="anim-fade-up anim-d5 relative z-10 mt-9 flex flex-wrap items-center justify-center gap-2.5">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="flex cursor-default items-center gap-2 rounded-full border border-border/50 bg-card/70 px-4 py-2 text-sm backdrop-blur transition-transform hover:scale-105"
            >
              <PlatformIcon platform={p.platform} size={15} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        {/* Floating preview cards */}
        <div className="anim-fade-up anim-d6 relative z-10 mt-14 flex w-full max-w-3xl flex-col items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Illustrative example — not live campaign data</span>
        <div className="flex w-full items-end justify-center gap-4">

          {/* Left — Campaign Live */}
          <div className="anim-float hidden w-48 flex-col rounded-3xl border border-border/50 bg-card/80 p-5 shadow-2xl backdrop-blur-xl sm:flex">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div style={{ fontFamily: D, fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
              Sample Campaign
            </div>
            <div className="mt-1 text-xs text-muted-foreground">6 platforms · 24/7</div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Example: 4 agents active</span>
            </div>
          </div>

          {/* Center — Reach stats */}
          <div className="anim-float-2 flex max-w-xs flex-1 flex-col rounded-3xl border border-border/50 bg-card/75 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Today's Reach</span>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">+18% ↑</span>
            </div>
            <div style={{ fontFamily: D, fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
              1.94M
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { name: 'TikTok', pct: 85 },
                { name: 'Instagram', pct: 72 },
                { name: 'YouTube', pct: 60 },
              ].map((row) => (
                <div key={row.name} className="flex items-center gap-2.5 text-xs">
                  <span className="w-16 text-muted-foreground">{row.name}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted" style={{ height: 5 }}>
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${row.pct}%`, animation: `progress-fill 1.4s ease both` }}
                    />
                  </div>
                  <span className="w-7 text-right text-muted-foreground">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Content stats */}
          <div className="anim-float-3 hidden w-48 flex-col rounded-3xl border border-border/50 bg-card/80 p-5 shadow-2xl backdrop-blur-xl sm:flex">
            <div className="text-xs text-muted-foreground">Content generated</div>
            <div style={{ fontFamily: D, fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 4 }}>
              142
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">posts this week</div>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {[{ label: 'Viral', pct: 82 }, { label: 'Posts', pct: 94 }, { label: 'Reels', pct: 77 }].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-xs font-bold text-primary">
                    {item.pct}%
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section className="border-y border-border/50 bg-card/30 py-14">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {[
            { value: '24/7', label: 'Autonomous' },
            { value: '6+', label: 'Platforms' },
            { value: '20/day', label: 'AI Posts' },
            { value: '<30m', label: 'Trend Response' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div style={{ fontFamily: D, fontWeight: 900, fontSize: '2.4rem', letterSpacing: '-0.03em', lineHeight: 1, color: 'oklch(0.70 0.16 46)' }}>
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Features
            </div>
            <h2
              className="text-balance"
              style={{ fontFamily: D, fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1.08 }}
            >
              Everything you need<br />for viral growth
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              A complete agentic system that handles content creation, posting, and analytics automatically
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="border-y border-border/50 bg-card/30 py-28 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              How It Works
            </div>
            <h2
              className="mb-16"
              style={{ fontFamily: D, fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1.08 }}
            >
              From setup to viral<br />in 3 steps
            </h2>
          </motion.div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: '01', title: 'Connect Platforms', description: 'Link TikTok, Instagram, YouTube, Twitter, Facebook, and Spotify in minutes.' },
              { step: '02', title: 'Launch Campaign', description: 'Upload your music, set your goals, and activate AI agents with one click.' },
              { step: '03', title: 'Watch It Grow', description: 'Monitor analytics as your agents work autonomously to maximize reach.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  style={{
                    fontFamily: D,
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 32px oklch(0.70 0.16 46 / 0.4)',
                  }}
                >
                  {item.step}
                </div>
                <h3 className="mb-2" style={{ fontFamily: D, fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Trusted by artists worldwide
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="rounded-3xl border border-border/60 bg-card p-6"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-12 text-center"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 110%, oklch(0.28 0.09 44 / 0.6), transparent 65%)' }}
            />
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                Get Started Free
              </div>
              <h2 style={{ fontFamily: D, fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
                Ready to go viral?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Start your autonomous marketing campaign today and let AI agents handle the heavy lifting
              </p>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full bg-foreground px-9 py-3.5 text-sm font-bold text-background shadow-lg transition-opacity hover:opacity-90"
                >
                  Launch Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
                {['No credit card required', 'Demo mode included', 'Connect your own APIs'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Music2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span style={{ fontFamily: D, fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>
              SoundWave AI
            </span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SoundWave AI. Built with AI SDK & Next.js</p>
        </div>
      </footer>
    </div>
  )
}
