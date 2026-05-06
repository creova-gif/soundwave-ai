import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function GET(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(campaigns)
    .where(eq(campaigns.userId, session.userId))
    .orderBy(desc(campaigns.createdAt))

  return NextResponse.json({ campaigns: rows })
}

export async function POST(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const [campaign] = await db.insert(campaigns).values({
      userId: session.userId,
      name: body.name,
      status: body.status ?? 'draft',
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      targetReach: body.targetReach ?? 0,
      currentReach: body.currentReach ?? 0,
      budget: body.budget ?? '0',
      platforms: body.platforms ?? [],
      songTitle: body.songTitle,
      artist: body.artist,
      genre: body.genre,
      audioUrl: body.audioUrl,
      artworkUrl: body.artworkUrl,
    }).returning()

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (err) {
    console.error('[campaigns post]', err)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
