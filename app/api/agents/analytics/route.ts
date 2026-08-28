import { createAnalyticsAgent } from '@/lib/agents/analytics-agent'
import { createAgentUIStreamResponse } from 'ai'
import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function POST(req: Request) {
  // Previously unauthenticated -- anyone could trigger real gpt-4o agent calls
  // (a cost-abuse vector) and, once real platform posting replaces the current
  // mock tool implementations, could have posted content with no auth at all.
  const authRes = NextResponse.next()
  const session = await getIronSession<SessionData>(req as any, authRes, sessionOptions)
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messages, action, platform, timeRange } = await req.json()

  const agent = createAnalyticsAgent()

  // Handle specific analytics actions
  if (action === 'report') {
    const taskMessages = [
      {
        role: 'user' as const,
        content: `Generate a comprehensive campaign performance report. Include total reach, engagement metrics, top performing content, and strategy recommendations.`,
      },
    ]

    return createAgentUIStreamResponse({
      agent,
      uiMessages: taskMessages,
    })
  }

  if (action === 'trends' && platform) {
    const taskMessages = [
      {
        role: 'user' as const,
        content: `Detect current trends on ${platform} that we can capitalize on for our music marketing campaign.`,
      },
    ]

    return createAgentUIStreamResponse({
      agent,
      uiMessages: taskMessages,
    })
  }

  if (action === 'stats' && platform) {
    const taskMessages = [
      {
        role: 'user' as const,
        content: `Fetch current engagement stats from ${platform} for the ${timeRange || '24h'} time range. Provide insights on performance.`,
      },
    ]

    return createAgentUIStreamResponse({
      agent,
      uiMessages: taskMessages,
    })
  }

  // Default: use provided messages
  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  })
}
