'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Bot, Sparkles, Send, BarChart3, RefreshCw, Zap } from 'lucide-react'
import { store } from '@/lib/store'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

const agents = [
  {
    id: 'content',
    name: 'Content Agent',
    description: 'Generates viral captions, hashtags, and video scripts',
    icon: Sparkles,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    borderColor: 'border-chart-1/20',
    glowColor: 'rgba(var(--chart-1), 0.15)',
    endpoint: '/api/agents/content',
  },
  {
    id: 'posting',
    name: 'Posting Agent',
    description: 'Schedules and publishes content across platforms',
    icon: Send,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/20',
    glowColor: 'rgba(var(--chart-2), 0.15)',
    endpoint: '/api/agents/posting',
  },
  {
    id: 'analytics',
    name: 'Analytics Agent',
    description: 'Monitors performance and provides insights',
    icon: BarChart3,
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    borderColor: 'border-chart-3/20',
    glowColor: 'rgba(var(--chart-3), 0.15)',
    endpoint: '/api/agents/analytics',
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    description: 'Coordinates all agents and makes strategic decisions',
    icon: Bot,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    glowColor: 'rgba(var(--primary), 0.15)',
    endpoint: '/api/agents/analytics',
  },
]

const cardVariants = {
  hidden: { y: 16 },
  visible: (i: number) => ({
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function AgentsPage() {
  const [agentStatus, setAgentStatus] = useState(store.getAgentStatus())
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: selectedAgent ? agents.find((a) => a.id === selectedAgent)?.endpoint || '/api/agents/content' : '/api/agents/content',
    }),
  })

  const toggleAgent = (agentId: string) => {
    const currentStatus = agentStatus[agentId]
    const newStatus = currentStatus === 'running' ? 'paused' : 'running'
    store.setAgentStatus(agentId, newStatus)
    setAgentStatus({ ...agentStatus, [agentId]: newStatus })
  }

  const handleRunAgent = async (agentId: string) => {
    setSelectedAgent(agentId)
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) return

    const prompts: Record<string, string> = {
      content: 'Analyze current TikTok trends and generate 3 viral caption ideas for our summer track.',
      posting: 'Calculate the optimal posting times for all platforms today.',
      analytics: 'Generate a quick performance report for the last 24 hours.',
      orchestrator: 'Review campaign progress and recommend the next best actions.',
    }

    sendMessage({ text: customPrompt || prompts[agentId] })
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'running': return 'bg-success'
      case 'paused': return 'bg-warning'
      case 'stopped': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'running': return 'Running'
      case 'paused': return 'Paused'
      case 'stopped': return 'Stopped'
      default: return 'Idle'
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: -8 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">AI Agents</h1>
        <p className="text-muted-foreground">Manage and monitor your autonomous marketing agents</p>
      </motion.div>

      {/* Agent Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {agents.map((agent, i) => {
          const isRunning = agentStatus[agent.id] === 'running'
          return (
            <motion.div
              key={agent.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className={`relative overflow-hidden h-full transition-colors ${isRunning ? 'border-border/60' : ''}`}>
                {/* Running glow effect */}
                {isRunning && (
                  <motion.div
                    className={`absolute inset-0 ${agent.bgColor} opacity-30`}
                    animate={{ opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div className={`absolute right-0 top-0 h-32 w-32 ${agent.bgColor} rounded-bl-full opacity-40`} />

                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${agent.bgColor} border ${agent.borderColor}`}>
                        <agent.icon className={`h-5 w-5 ${agent.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription className="text-xs">{agent.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs gap-1.5 ${isRunning ? 'border-success/30' : 'border-warning/30'}`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${getStatusColor(agentStatus[agent.id])} ${isRunning ? 'animate-pulse' : ''}`} />
                        {getStatusLabel(agentStatus[agent.id])}
                      </Badge>
                      <Switch checked={isRunning} onCheckedChange={() => toggleAgent(agent.id)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunAgent(agent.id)}
                      disabled={status === 'streaming'}
                      className="flex-1"
                    >
                      <Zap className="mr-2 h-3.5 w-3.5" />
                      Run Now
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Agent Console */}
      <motion.div
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Agent Console
            </CardTitle>
            <CardDescription>Send commands to agents and view responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter a custom command for the agents..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex flex-wrap gap-2">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRunAgent(agent.id)}
                  disabled={status === 'streaming'}
                >
                  <agent.icon className={`mr-2 h-3.5 w-3.5 ${agent.color}`} />
                  Run {agent.name}
                </Button>
              ))}
            </div>

            <ScrollArea className="h-[300px] rounded-lg border border-border bg-secondary/20 p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">Agent responses will appear here...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-lg p-3 ${
                        message.role === 'user' ? 'bg-primary/10 ml-auto max-w-[80%]' : 'bg-card max-w-[90%]'
                      }`}
                    >
                      <div className="mb-1 text-xs font-medium text-muted-foreground">
                        {message.role === 'user' ? 'You' : 'Agent'}
                      </div>
                      <div className="text-sm">
                        {message.parts?.map((part, idx) => {
                          if (part.type === 'text') return <span key={idx}>{part.text}</span>
                          return null
                        })}
                      </div>
                    </motion.div>
                  ))}
                  {status === 'streaming' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Agent is thinking...
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.28, duration: 0.35 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Generate Content', icon: Sparkles, color: 'text-chart-1', agent: 'content', prompt: 'Generate 5 viral TikTok captions for our track' },
                { label: 'Optimize Schedule', icon: Send, color: 'text-chart-2', agent: 'posting', prompt: 'Find optimal posting times for today' },
                { label: 'Get Report', icon: BarChart3, color: 'text-chart-3', agent: 'analytics', prompt: 'Generate a campaign performance report' },
                { label: 'Find Trends', icon: Zap, color: 'text-warning', agent: 'analytics', prompt: 'Detect trending topics on TikTok right now' },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="justify-start hover:border-border/80 transition-colors"
                  onClick={() => { setCustomPrompt(action.prompt); handleRunAgent(action.agent) }}
                >
                  <action.icon className={`mr-2 h-4 w-4 ${action.color}`} />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
