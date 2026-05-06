'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlatformIcon } from '@/components/icons/platform-icons'
import {
  Music,
  Zap,
  TrendingUp,
  Bot,
  BarChart3,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Globe,
} from 'lucide-react'

const platforms = [
  { name: 'TikTok', platform: 'tiktok' as const },
  { name: 'Instagram', platform: 'instagram' as const },
  { name: 'YouTube', platform: 'youtube' as const },
  { name: 'Twitter/X', platform: 'twitter' as const },
  { name: 'Facebook', platform: 'facebook' as const },
  { name: 'Spotify', platform: 'spotify' as const },
]

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Agents',
    description: 'Autonomous agents generate viral content, schedule posts, and analyze performance 24/7',
  },
  {
    icon: TrendingUp,
    title: 'Trend Detection',
    description: 'Real-time monitoring of trending sounds, hashtags, and formats across all platforms',
  },
  {
    icon: Sparkles,
    title: 'Content Generation',
    description: 'AI creates platform-specific captions, hashtags, and video scripts optimized for engagement',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track reach, engagement, and progress toward your goals in real-time',
  },
  {
    icon: Zap,
    title: 'Automated Posting',
    description: 'Schedule and publish content at optimal times across all platforms simultaneously',
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Reach audiences on TikTok, Instagram, YouTube, Twitter, Facebook, and Spotify',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="border-b border-border"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Music className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">SoundWave AI</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <Button asChild>
            <Link href="/dashboard">
              Launch Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        {/* Animated background orbs */}
        <motion.div
          className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/8 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-chart-1/8 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
            <Badge variant="outline" className="mb-6">
              <Zap className="mr-1 h-3 w-3 text-primary" />
              AI-Powered Music Marketing
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl"
          >
            Reach{' '}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              20 Million
            </span>{' '}
            People in 2 Weeks
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl"
          >
            Autonomous AI agents that generate viral content, post across 6 platforms, and optimize your music marketing campaign 24/7 - without constant involvement.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" asChild className="group">
              <Link href="/dashboard">
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Start Your Campaign
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </motion.div>

          {/* Platform Pills */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.name}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.07, y: -2 }}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 cursor-default"
              >
                <PlatformIcon platform={platform.platform} size={18} />
                <span className="text-sm">{platform.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="container mx-auto grid gap-8 px-4 md:grid-cols-4"
        >
          {[
            { value: '24/7', label: 'Autonomous Operation' },
            { value: '6', label: 'Platforms Supported' },
            { value: '10-20', label: 'AI Posts Per Day' },
            { value: '<30min', label: 'Trend Response Time' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4">Features</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need for Viral Growth
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              A complete agentic system that handles content creation, posting, and analytics automatically
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => (
              <motion.div key={feature.title} variants={fadeUp} custom={i}>
                <Card className="h-full transition-colors hover:border-primary/30 hover:bg-card/80">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-border bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4">How It Works</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight md:text-4xl">
              From Setup to Viral in 3 Steps
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {[
              {
                step: '1',
                title: 'Connect Your Platforms',
                description: 'Link your TikTok, Instagram, YouTube, Twitter, Facebook, and Spotify accounts',
              },
              {
                step: '2',
                title: 'Launch Your Campaign',
                description: 'Upload your music, set your goals, and activate the AI agents',
              },
              {
                step: '3',
                title: 'Watch It Grow',
                description: 'Monitor real-time analytics as your agents work autonomously to maximize reach',
              },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
                >
                  {item.step}
                </motion.div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-chart-1/10" />
              <CardContent className="relative py-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Ready to Go Viral?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                  Start your autonomous marketing campaign today and let AI agents handle the heavy lifting
                </p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild className="group">
                    <Link href="/dashboard">
                      Launch Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Demo mode included
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Connect your own APIs
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Music className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">SoundWave AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with AI SDK, Next.js, and Vercel
          </p>
        </div>
      </footer>
    </div>
  )
}
