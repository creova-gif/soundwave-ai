import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'
import {
  BotTokenError,
  encryptBotToken,
  isSealedBotToken,
  maskBotToken,
  sealBotToken,
} from '@/lib/crypto/bot-token'

function toPublicUser(user: {
  id: number
  email: string
  name: string | null
  telegramBotToken: string | null
  telegramChatId: string | null
  whatsappNumber: string | null
  createdAt: Date
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    telegramBotToken: maskBotToken(user.telegramBotToken),
    telegramChatId: user.telegramChatId,
    whatsappNumber: user.whatsappNumber,
    createdAt: user.createdAt,
  }
}

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

  if (user.telegramBotToken && !isSealedBotToken(user.telegramBotToken)) {
    try {
      const sealed = encryptBotToken(user.telegramBotToken)
      await db.update(users)
        .set({ telegramBotToken: sealed, updatedAt: new Date() })
        .where(eq(users.id, user.id))
      user.telegramBotToken = sealed
    } catch {
      console.error('[user] bot token reseal skipped')
    }
  }

  return NextResponse.json({ user: toPublicUser(user) })
}

export async function PATCH(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)

  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const updates: {
      name?: string
      telegramBotToken?: string | null
      telegramChatId?: string
      whatsappNumber?: string
      updatedAt: Date
    } = { updatedAt: new Date() }

    if ('name' in body) {
      if (typeof body.name !== 'string' || body.name.length > 255) {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
      }
      updates.name = body.name
    }
    if ('telegramChatId' in body) {
      if (typeof body.telegramChatId !== 'string' || body.telegramChatId.length > 64) {
        return NextResponse.json({ error: 'Invalid chat id' }, { status: 400 })
      }
      updates.telegramChatId = body.telegramChatId
    }
    if ('whatsappNumber' in body) {
      if (typeof body.whatsappNumber !== 'string' || body.whatsappNumber.length > 30) {
        return NextResponse.json({ error: 'Invalid WhatsApp number' }, { status: 400 })
      }
      updates.whatsappNumber = body.whatsappNumber
    }
    if ('telegramBotToken' in body) {
      if (body.telegramBotToken == null || body.telegramBotToken === '') {
        updates.telegramBotToken = null
      } else if (typeof body.telegramBotToken !== 'string') {
        return NextResponse.json({ error: 'Invalid bot token' }, { status: 400 })
      } else {
        try {
          updates.telegramBotToken = sealBotToken(body.telegramBotToken)
        } catch (err) {
          if (err instanceof BotTokenError && err.code === 'invalid') {
            return NextResponse.json({ error: 'Invalid bot token' }, { status: 400 })
          }
          console.error('[user] bot token storage is not configured')
          return NextResponse.json({ error: 'Token storage is not configured' }, { status: 503 })
        }
      }
    }

    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, session.userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        telegramBotToken: users.telegramBotToken,
        telegramChatId: users.telegramChatId,
        whatsappNumber: users.whatsappNumber,
        createdAt: users.createdAt,
      })

    if (!updated) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ user: toPublicUser(updated) })
  } catch {
    console.error('[user patch] update failed')
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
