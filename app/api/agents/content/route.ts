import { createContentAgent } from '@/lib/agents/content-agent'
import { createAgentUIStreamResponse, convertToModelMessages } from 'ai'
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

  const { messages, songTitle, genre, mood, platform } = await req.json()

  const agent = createContentAgent()

  // If we have a specific task, create a focused prompt
  if (songTitle && platform) {
    const taskMessages = [
      {
        role: 'user' as const,
        content: `Generate viral content for the song "${songTitle}" (${genre || 'pop'}, ${mood || 'upbeat'} mood) for ${platform}. 
        
First analyze current trends on ${platform}, then generate a compelling caption with hashtags. 
Also create 3 variations for A/B testing.`,
      },
    ]

    return createAgentUIStreamResponse({
      agent,
      uiMessages: taskMessages,
    })
  }

  // Otherwise, use the provided messages for a conversational flow
  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  })
}
