import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { campaigns, contentItems, agentLogs } from '@/lib/db/schema'
import { eq, desc, sum, count } from 'drizzle-orm'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function GET(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const uid = session.userId

  const [userCampaigns, userContent, recentLogs] = await Promise.all([
    db.select().from(campaigns).where(eq(campaigns.userId, uid)).orderBy(desc(campaigns.createdAt)),
    db.select().from(contentItems).where(eq(contentItems.userId, uid)).orderBy(desc(contentItems.createdAt)).limit(20),
    db.select().from(agentLogs).where(eq(agentLogs.userId, uid)).orderBy(desc(agentLogs.timestamp)).limit(50),
  ])

  const totalReach = userCampaigns.reduce((sum, c) => sum + (c.currentReach ?? 0), 0)
  const activeCampaigns = userCampaigns.filter(c => c.status === 'active').length
  const pendingContent = userContent.filter(c => c.status === 'pending').length
  const postedContent = userContent.filter(c => c.status === 'posted').length
  const totalEngagement = userContent.reduce((sum, c) => sum + (c.likes ?? 0) + (c.comments ?? 0) + (c.shares ?? 0), 0)

  return NextResponse.json({
    stats: {
      totalReach,
      activeCampaigns,
      totalCampaigns: userCampaigns.length,
      pendingContent,
      postedContent,
      totalContent: userContent.length,
      totalEngagement,
    },
    campaigns: userCampaigns.slice(0, 5),
    recentContent: userContent.slice(0, 10),
    agentLogs: recentLogs,
  })
}
