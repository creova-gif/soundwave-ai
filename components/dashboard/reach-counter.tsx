'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Clock } from 'lucide-react'

interface ReachCounterProps {
  currentReach: number
  targetReach: number
  daysRemaining: number
}

function AnimatedNumber({ value, formatter }: { value: number; formatter: (n: number) => string }) {
  const spring = useSpring(value, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState(formatter(value))

  useEffect(() => {
    spring.set(value)
    return spring.on('change', (v) => setDisplay(formatter(Math.round(v))))
  }, [value, spring, formatter])

  return <span>{display}</span>
}

export function ReachCounter({ currentReach, targetReach, daysRemaining }: ReachCounterProps) {
  const [displayedReach, setDisplayedReach] = useState(currentReach)
  const percentage = Math.min((displayedReach / targetReach) * 100, 100)
  const dailyTarget = Math.ceil((targetReach - displayedReach) / Math.max(daysRemaining, 1))

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedReach((prev) => prev + Math.floor(Math.random() * 5000))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Total Reach
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
              <AnimatedNumber value={displayedReach} formatter={formatNumber} />
            </span>
            <span className="text-sm text-muted-foreground">/ {formatNumber(targetReach)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-primary">
            <TrendingUp className="h-3 w-3" />
            <span>+{formatNumber(Math.floor(displayedReach * 0.12))} today</span>
          </div>
        </div>

        {/* Progress bar with animated fill */}
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-chart-1"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(1)}% of goal</span>
            <span>{formatNumber(targetReach - displayedReach)} to go</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              Daily Target
            </div>
            <p className="text-lg font-semibold">{formatNumber(dailyTarget)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Days Left
            </div>
            <p className="text-lg font-semibold">{daysRemaining}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
