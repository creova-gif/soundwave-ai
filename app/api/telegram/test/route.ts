import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function POST(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { botToken, chatId } = await request.json()
    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Bot token and chat ID are required' }, { status: 400 })
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
      .set({ telegramBotToken: botToken, telegramChatId: chatId, updatedAt: new Date() })
      .where(eq(users.id, session.userId))

    return NextResponse.json({ success: true, message: 'Test message sent! Check your Telegram.' })
  } catch (err) {
    console.error('[telegram test]', err)
    return NextResponse.json({ error: 'Failed to send test message' }, { status: 500 })
  }
}
