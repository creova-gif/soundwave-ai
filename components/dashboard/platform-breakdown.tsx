'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlatformIcon } from '@/components/icons/platform-icons'
import type { Platform } from '@/lib/types'

interface PlatformBreakdownProps {
  data: { platform: Platform; reach: number; percentage: number }[]
}

const platformConfig: Record<Platform, { label: string; color: string }> = {
  tiktok: { label: 'TikTok', color: 'bg-[#00f2ea]' },
  instagram: { label: 'Instagram', color: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]' },
  youtube: { label: 'YouTube', color: 'bg-[#ff0000]' },
  twitter: { label: 'X / Twitter', color: 'bg-foreground' },
  facebook: { label: 'Facebook', color: 'bg-[#1877f2]' },
  spotify: { label: 'Spotify', color: 'bg-[#1db954]' },
}

export function PlatformBreakdown({ data }: PlatformBreakdownProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Platform Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, i) => {
          const config = platformConfig[item.platform]
          return (
            <motion.div
              key={item.platform}
              initial={{ x: -8 }}
              animate={{ x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={item.platform} size={16} />
                  <span className="font-medium">{config.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums text-muted-foreground">{formatNumber(item.reach)}</span>
                  <span className="w-10 text-right text-xs text-muted-foreground">({item.percentage}%)</span>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className={`h-full rounded-full ${config.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}
