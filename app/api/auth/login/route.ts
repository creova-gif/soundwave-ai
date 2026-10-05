import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes
const IP_WINDOW_MS = 15 * 60 * 1000
const IP_MAX_ATTEMPTS = 30
const GENERIC_AUTH_ERROR = 'Invalid email or password'

// Process-local IP throttle. Not shared across instances; still raises the
// cost of spraying one account from a single source IP alongside the
// atomic DB counter.
const ipAttempts = new Map<string, number[]>()

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

function consumeIpAttempt(ip: string, now = Date.now()): boolean {
  const recent = (ipAttempts.get(ip) || []).filter((t) => now - t < IP_WINDOW_MS)
  if (recent.length >= IP_MAX_ATTEMPTS) {
    ipAttempts.set(ip, recent)
    return false
  }
  recent.push(now)
  ipAttempts.set(ip, recent)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request)
    if (!consumeIpAttempt(ip)) {
      // Same generic body as credential failures — do not disclose throttle type.
      return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 })
    }

    const { email, password } = await request.json()

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1)
    if (!user) {
      // Burn similar work to reduce timing oracle vs known accounts.
      await bcrypt.compare(password, '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUV')
      return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 })
    }

    const now = new Date()
    if (user.lockedUntil && user.lockedUntil > now) {
      return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.hashedPassword)
    if (!valid) {
      // Atomic increment + lock transition so concurrent failures cannot
      // overwrite each other below the threshold.
      await db.execute(sql`
        UPDATE users
        SET
          failed_login_attempts = CASE
            WHEN COALESCE(failed_login_attempts, 0) + 1 >= ${MAX_ATTEMPTS} THEN 0
            ELSE COALESCE(failed_login_attempts, 0) + 1
          END,
          locked_until = CASE
            WHEN COALESCE(failed_login_attempts, 0) + 1 >= ${MAX_ATTEMPTS}
              THEN NOW() + (${LOCKOUT_MS} * INTERVAL '1 millisecond')
            ELSE locked_until
          END
        WHERE id = ${user.id}
      `)
      return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 })
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
