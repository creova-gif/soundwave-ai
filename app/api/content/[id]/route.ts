import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { contentItems } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const allowed = ['status', 'content', 'hashtags', 'scheduledFor', 'tone', 'format', 'views', 'likes', 'comments', 'shares', 'saves', 'clicks', 'reach']
    const updates: Record<string, unknown> = { updatedAt: new Date() }
    for (const key of allowed) {
      if (key in body) {
        updates[key] = key === 'scheduledFor' && body[key] ? new Date(body[key]) : body[key]
      }
    }

    const [updated] = await db.update(contentItems).set(updates)
      .where(and(eq(contentItems.id, parseInt(id)), eq(contentItems.userId, session.userId)))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ item: updated })
  } catch (err) {
    console.error('[content patch]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.delete(contentItems)
    .where(and(eq(contentItems.id, parseInt(id)), eq(contentItems.userId, session.userId)))

  return NextResponse.json({ success: true })
}
