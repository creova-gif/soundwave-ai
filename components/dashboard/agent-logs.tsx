'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Sparkles, Send, BarChart3, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import type { AgentLog } from '@/lib/types'

interface AgentLogsProps {
  logs: AgentLog[]
}

const agentIcons = {
  content: Sparkles,
  posting: Send,
  analytics: BarChart3,
  orchestrator: Bot,
}

const agentColors = {
  content: 'text-chart-1 bg-chart-1/10',
  posting: 'text-chart-2 bg-chart-2/10',
  analytics: 'text-chart-3 bg-chart-3/10',
  orchestrator: 'text-primary bg-primary/10',
}

const statusIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const statusColors = {
  success: 'text-success',
  error: 'text-destructive',
  info: 'text-info',
}

export function AgentLogs({ logs }: AgentLogsProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Agent Activity</CardTitle>
        <Badge variant="outline" className="animate-pulse">
          <div className="mr-1 h-2 w-2 rounded-full bg-success" />
          Live
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {logs.map((log) => {
                const AgentIcon = agentIcons[log.agentType]
                const StatusIcon = statusIcons[log.status]
                const agentColor = agentColors[log.agentType]
                return (
                  <motion.div
                    key={log.id}
                    initial={{ x: -10, height: 0 }}
                    animate={{ x: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex gap-3 overflow-hidden"
                  >
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${agentColor.split(' ')[1]}`}>
                      <AgentIcon className={`h-4 w-4 ${agentColor.split(' ')[0]}`} />
                    </div>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize">{log.agentType}</span>
                        <StatusIcon className={`h-3 w-3 flex-shrink-0 ${statusColors[log.status]}`} />
                        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">{formatTime(log.timestamp)}</span>
                      </div>
                      <p className="text-sm text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
