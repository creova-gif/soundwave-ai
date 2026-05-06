'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Send, Eye, Heart } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    postsToday: number
    scheduled: number
    totalViews: number
    engagementRate: number
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Posts Today',
      value: stats.postsToday.toString(),
      icon: Send,
      change: '+3 from yesterday',
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
    },
    {
      title: 'Scheduled',
      value: stats.scheduled.toString(),
      icon: FileText,
      change: 'Next in 2h',
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
    },
    {
      title: 'Total Views',
      value: formatNumber(stats.totalViews),
      icon: Eye,
      change: '+18.2% this week',
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    },
    {
      title: 'Engagement',
      value: stats.engagementRate.toFixed(1) + '%',
      icon: Heart,
      change: 'Above average',
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
        >
          <Card className="overflow-hidden transition-colors hover:border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
