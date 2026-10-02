import { NextRequest } from 'next/server'
import { createContentAgent } from '@/lib/agents/content-agent'
import { contentRequestSchema, contentToMessages } from '@/lib/ai/agent-schemas'
import { runAgentRoute } from '@/lib/ai/run-agent-route'

export async function POST(req: NextRequest) {
  return runAgentRoute(req, {
    agentType: 'content',
    schema: contentRequestSchema,
    createAgent: createContentAgent,
    toMessages: contentToMessages,
  })
}
