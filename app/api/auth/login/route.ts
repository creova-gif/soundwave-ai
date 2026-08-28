import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const now = new Date()
    if (user.lockedUntil && user.lockedUntil > now) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 60000)
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${minutesLeft} minute(s).` },
        { status: 429 },
      )
    }

    const valid = await bcrypt.compare(password, user.hashedPassword)
    if (!valid) {
      const attempts = user.failedLoginAttempts + 1
      const update: Partial<typeof users.$inferInsert> =
        attempts >= MAX_ATTEMPTS
          ? { failedLoginAttempts: 0, lockedUntil: new Date(now.getTime() + LOCKOUT_MS) }
          : { failedLoginAttempts: attempts }
      await db.update(users).set(update).where(eq(users.id, user.id))
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (user.failedLoginAttempts || user.lockedUntil) {
      await db.update(users).set({ failedLoginAttempts: 0, lockedUntil: null }).where(eq(users.id, user.id))
    }

    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })
    const session = await getIronSession<SessionData>(request, res, sessionOptions)
    session.userId = user.id
    session.email = user.email
    session.name = user.name ?? undefined
    await session.save()

    return res
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
