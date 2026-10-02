import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'
import { BotTokenError, sealBotToken } from '@/lib/crypto/bot-token'

export async function POST(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { botToken, chatId } = await request.json()
    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Bot token and chat ID are required' }, { status: 400 })
    }
    if (typeof botToken !== 'string' || typeof chatId !== 'string' || chatId.length > 64) {
      return NextResponse.json({ error: 'Bot token and chat ID are required' }, { status: 400 })
    }

    let sealedToken: string
    try {
      sealedToken = sealBotToken(botToken)
    } catch (err) {
      if (err instanceof BotTokenError && err.code === 'invalid') {
        return NextResponse.json({ error: 'Invalid bot token' }, { status: 400 })
      }
      console.error('[telegram test] bot token storage is not configured')
      return NextResponse.json({ error: 'Token storage is not configured' }, { status: 503 })
    }

    const message = `✅ *SoundWave AI Connected!*\n\nYour Telegram notifications are now active. You'll receive alerts when:\n• 🚀 A campaign goes live\n• 🔥 Content goes viral\n• 📊 Daily performance digest\n• ⚠️ Any issues that need attention`

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    const telegramData = await telegramRes.json()
    if (!telegramData.ok) {
      return NextResponse.json({ error: telegramData.description ?? 'Telegram API error' }, { status: 400 })
    }

    await db.update(users)
      .set({ telegramBotToken: sealedToken, telegramChatId: chatId, updatedAt: new Date() })
      .where(eq(users.id, session.userId))

    return NextResponse.json({ success: true, message: 'Test message sent! Check your Telegram.' })
  } catch {
    console.error('[telegram test] request failed')
    return NextResponse.json({ error: 'Failed to send test message' }, { status: 500 })
  }
}
