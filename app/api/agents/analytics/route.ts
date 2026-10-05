import { NextRequest } from 'next/server'
import { createAnalyticsAgent } from '@/lib/agents/analytics-agent'
import { analyticsRequestSchema, analyticsToMessages } from '@/lib/ai/agent-schemas'
import { runAgentRoute } from '@/lib/ai/run-agent-route'

export async function POST(req: NextRequest) {
  return runAgentRoute(req, {
    agentType: 'analytics',
    schema: analyticsRequestSchema,
    createAgent: createAnalyticsAgent,
    toMessages: analyticsToMessages,
  })
}
