import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const [campaign] = await db.select().from(campaigns)
    .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, session.userId)))
    .limit(1)

  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ campaign })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const allowed = ['name', 'status', 'startDate', 'endDate', 'targetReach', 'currentReach', 'budget', 'platforms', 'songTitle', 'artist', 'genre', 'audioUrl', 'artworkUrl']
    const updates: Record<string, unknown> = { updatedAt: new Date() }
    for (const key of allowed) {
      if (key in body) {
        if (key === 'startDate' || key === 'endDate') {
          updates[key] = body[key] ? new Date(body[key]) : null
        } else {
          updates[key] = body[key]
        }
      }
    }

    const [updated] = await db.update(campaigns).set(updates)
      .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, session.userId)))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ campaign: updated })
  } catch (err) {
    console.error('[campaigns patch]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.delete(campaigns)
    .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, session.userId)))

  return NextResponse.json({ success: true })
}
