import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { contentItems } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function GET(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const campaignId = url.searchParams.get('campaignId')

  const query = db.select().from(contentItems).where(eq(contentItems.userId, session.userId)).orderBy(desc(contentItems.createdAt))

  const rows = await query
  const filtered = campaignId ? rows.filter(r => r.campaignId === parseInt(campaignId)) : rows

  return NextResponse.json({ content: filtered })
}

export async function POST(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const [item] = await db.insert(contentItems).values({
      campaignId: body.campaignId,
      userId: session.userId,
      platform: body.platform,
      type: body.type ?? 'full_post',
      content: body.content,
      hashtags: body.hashtags ?? [],
      status: body.status ?? 'pending',
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
      tone: body.tone,
      format: body.format,
    }).returning()

    return NextResponse.json({ item }, { status: 201 })
  } catch (err) {
    console.error('[content post]', err)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
