import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function GET(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)

  if (!session.userId) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const [user] = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    telegramBotToken: users.telegramBotToken,
    telegramChatId: users.telegramChatId,
    whatsappNumber: users.whatsappNumber,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.id, session.userId)).limit(1)

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}

export async function PATCH(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)

  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const allowed = ['name', 'telegramBotToken', 'telegramChatId', 'whatsappNumber']
    const updates: Record<string, string> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    const [updated] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, session.userId))
      .returning()

    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error('[user patch]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
