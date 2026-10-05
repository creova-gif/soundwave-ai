import { NextRequest } from 'next/server'
import { createPostingAgent } from '@/lib/agents/posting-agent'
import { postingRequestSchema, postingToMessages } from '@/lib/ai/agent-schemas'
import { runAgentRoute } from '@/lib/ai/run-agent-route'

export async function POST(req: NextRequest) {
  return runAgentRoute(req, {
    agentType: 'posting',
    schema: postingRequestSchema,
    createAgent: createPostingAgent,
    toMessages: postingToMessages,
  })
}
