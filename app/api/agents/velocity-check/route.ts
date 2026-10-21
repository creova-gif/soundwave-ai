import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { evaluateViralSignal } from '@/lib/agents/analytics-agent'
import { triggerAmplificationCascade } from '@/lib/agents/amplification-agent'
import { store } from '@/lib/store'
import type { ContentItem } from '@/lib/types'

export async function POST(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)

  try {
    const body = await request.json()
    const { contentItemId, simulated = false } = body

    if (simulated) {
      // Direct simulation path
      const result = store.triggerViralCascade(contentItemId)
      return NextResponse.json({
        success: true,
        simulation: true,
        cascade: result,
      })
    }

    // Historical baseline for user's past 10 posts
    const historicalSamples = [
      { shares: 120, saves: 340, comments: 85, likes: 1200 },
      { shares: 95, saves: 280, comments: 60, likes: 980 },
      { shares: 150, saves: 410, comments: 110, likes: 1450 },
      { shares: 80, saves: 220, comments: 45, likes: 800 },
      { shares: 130, saves: 390, comments: 90, likes: 1300 },
    ]

    const item: ContentItem | undefined = store
      .getContentQueue()
      .find((c) => c.id === contentItemId) || store.getContentQueue()[0]

    if (!item) {
      return NextResponse.json({ error: 'No content item found to evaluate' }, { status: 404 })
    }

    const currentMetrics = item.engagement || {
      shares: 1420,
      saves: 3100,
      comments: 842,
      likes: 6420,
    }

    const evaluation = evaluateViralSignal(currentMetrics, historicalSamples)

    let cascadeResult = null
    if (evaluation.shouldCascade) {
      item.velocityScore = evaluation.zScore
      item.viralStatus = 'viral_spike'
      cascadeResult = triggerAmplificationCascade(item)
      if (cascadeResult.triggered) {
        cascadeResult.derivativesCreated.forEach((d) => store.addContent(d))
        item.viralStatus = 'amplified'
        store.addLog({
          agentType: 'analytics',
          action: `Viral Spike Detected (Z=${evaluation.zScore})`,
          details: `Post ${item.id} exceeded velocity threshold. Autonomous cascade dispatched ${cascadeResult.derivativesCreated.length} derivatives.`,
          status: 'success',
        })
      }
    }

    return NextResponse.json({
      contentItemId: item.id,
      evaluation,
      cascade: cascadeResult,
    })
  } catch (err) {
    console.error('[velocity-check error]', err)
    return NextResponse.json({ error: 'Failed to run velocity evaluation' }, { status: 500 })
  }
}
