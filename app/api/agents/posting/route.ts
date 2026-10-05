import { createPostingAgent } from '@/lib/agents/posting-agent'
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

  const { messages, action, content, platform } = await req.json()

  const agent = createPostingAgent()

  // Handle specific posting actions
  if (action === 'schedule' && content && platform) {
    const taskMessages = [
      {
        role: 'user' as const,
        content: `Find the optimal time to post on ${platform} and schedule this content: "${content}"`,
      },
    ]

    return createAgentUIStreamResponse({
      agent,
      uiMessages: taskMessages,
    })
  }

  if (action === 'post' && content && platform) {
    const taskMessages = [
      {
        role: 'user' as const,
        content: `Post the following content to ${platform}: "${content}". First check rate limits, then post if allowed.`,
      },
    ]

    return createAgentUIStreamResponse({
      agent,
      uiMessages: taskMessages,
    })
  }

  if (action === 'optimal-times') {
    const taskMessages = [
      {
        role: 'user' as const,
        content: `Calculate the optimal posting times for all platforms (TikTok, Instagram, YouTube, Twitter, Facebook) based on our audience engagement data.`,
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
