import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { db } from '@/lib/db'
import { contentItems } from '@/lib/db/schema'
import { sessionOptions, type SessionData } from '@/lib/session'
import { generateMultiVariants } from '@/lib/agents/content-agent'
import type { Platform } from '@/lib/types'

export async function POST(request: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(request, res, sessionOptions)

  try {
    const body = await request.json()
    const {
      songTitle,
      artist = 'Unknown Artist',
      genre = 'Pop',
      mood = 'Energetic',
      platform = 'tiktok' as Platform,
      campaignId = 1,
      variantCount = 6,
    } = body

    if (!songTitle) {
      return NextResponse.json({ error: 'songTitle is required' }, { status: 400 })
    }

    const generatedVariants = generateMultiVariants({
      songTitle,
      artist,
      genre,
      mood,
      platform,
      campaignId: String(campaignId),
      variantCount,
    })

    // If database connection and userId are active, persist to PostgreSQL
    if (session.userId && db) {
      try {
        const rowsToInsert = generatedVariants.map((v) => ({
          campaignId: Number(campaignId) || 1,
          userId: session.userId,
          platform: v.platform,
          type: v.type,
          content: v.content,
          hashtags: v.hashtags,
          status: v.status,
          scheduledFor: v.scheduledFor,
          tone: v.tone,
          format: v.format,
          variantGroupId: v.variantGroupId,
          onScreenHook: v.onScreenHook,
          visualDirection: v.visualDirection,
          viralStatus: v.viralStatus,
        }))
        const inserted = await db.insert(contentItems).values(rowsToInsert).returning()
        return NextResponse.json({ variants: inserted, variantGroupId: generatedVariants[0]?.variantGroupId }, { status: 201 })
      } catch (dbErr) {
        console.warn('[db insert fallback]', dbErr)
      }
    }

    // Return generated variants directly (supports demo mode or client store)
    return NextResponse.json({ variants: generatedVariants, variantGroupId: generatedVariants[0]?.variantGroupId }, { status: 200 })
  } catch (err) {
    console.error('[generate-variants post]', err)
    return NextResponse.json({ error: 'Failed to generate variants' }, { status: 500 })
  }
}
