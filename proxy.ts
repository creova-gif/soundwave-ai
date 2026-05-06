import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard')) {
    const res = NextResponse.next()
    const session = await getIronSession<SessionData>(request, res, sessionOptions)

    if (!session.userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return res
  }

  if (pathname === '/login') {
    const res = NextResponse.next()
    const session = await getIronSession<SessionData>(request, res, sessionOptions)

    if (session.userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}

