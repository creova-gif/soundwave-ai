import type { ContentItem, Platform } from '@/lib/types'

export interface AmplificationResult {
  triggered: boolean
  parentContentId: string
  velocityScore: number
  derivativesCreated: ContentItem[]
  reason?: string
}

/**
 * Autonomous Viral Cascade State Machine
 * When a post achieves a viral velocity spike (Z-Score >= 2.5),
 * this engine synthesizes platform-native derivative content across
 * secondary channels to force algorithm exposure.
 *
 * Safeguards:
 * 1. Strict Depth Limit: Derivatives CANNOT spawn further derivatives (depth <= 1).
 * 2. Idempotency: Duplicate calls on the same item are ignored if already amplified.
 */
export function triggerAmplificationCascade(
  viralItem: ContentItem,
  options: {
    targetPlatforms?: Platform[]
    now?: Date
  } = {}
): AmplificationResult {
  const now = options.now || new Date()

  // Safeguard 1: Prevent recursive cascades (depth cap = 1)
  if (viralItem.isDerivative) {
    return {
      triggered: false,
      parentContentId: viralItem.id,
      velocityScore: viralItem.velocityScore || 0,
      derivativesCreated: [],
      reason: 'Safety Guard: Cannot trigger cascade on an already derivative item (depth limit <= 1).',
    }
  }

  // Safeguard 2: Idempotency guard
  if (viralItem.viralStatus === 'amplified') {
    return {
      triggered: false,
      parentContentId: viralItem.id,
      velocityScore: viralItem.velocityScore || 0,
      derivativesCreated: [],
      reason: 'Item has already executed its viral amplification cascade.',
    }
  }

  const basePlatforms: Platform[] = options.targetPlatforms || ['youtube', 'instagram', 'twitter']
  const targetPlatforms = basePlatforms.filter((p) => p !== viralItem.platform)

  const derivatives: ContentItem[] = []

  for (const platform of targetPlatforms) {
    let derivativeContent = ''
    let onScreenHook = ''
    let visualDirection = ''
    let tone: ContentItem['tone'] = 'hype'
    let format: ContentItem['format'] = 'hook'
    const scheduledOffsetMinutes = platform === 'twitter' ? 30 : platform === 'youtube' ? 90 : 180

    if (platform === 'youtube') {
      onScreenHook = `THE SOUND THAT TOOK OVER TIKTOK`
      visualDirection = `Rapid 0.5s beat-matched cuts of high-energy performance. Big centered bold typography.`
      derivativeContent = `The viral sound everyone is asking about. Stream the full release now (Link in description).`
      tone = 'hype'
      format = 'cta'
    } else if (platform === 'instagram') {
      onScreenHook = `Why everyone is saving this sound...`
      visualDirection = `Behind-the-scenes studio session: DAW screen zoomed in on the master channel with waveform bouncing.`
      derivativeContent = `Over 1M+ streams this week. We made this in a bedroom at 3 AM. Listen with headphones.`
      tone = 'storytelling'
      format = 'hook'
    } else if (platform === 'twitter') {
      onScreenHook = `THREAD: Deconstructing our viral hook`
      visualDirection = `Thread format: Tweet 1 hooks with audio snippet; Tweets 2-4 breakdown the chords and lyrics; Tweet 5 links Spotify.`
      derivativeContent = `1/5 The story behind the drop that broke the algorithm this morning 🧵👇`
      tone = 'controversial'
      format = 'statement'
    }

    const derivativeItem: ContentItem = {
      id: `derivative-${viralItem.id}-${platform}-${Date.now().toString(36)}`,
      campaignId: viralItem.campaignId,
      platform,
      type: 'full_post',
      content: derivativeContent,
      hashtags: viralItem.hashtags.concat(['#ViralMusic', '#Trending']),
      status: 'approved',
      scheduledFor: new Date(now.getTime() + scheduledOffsetMinutes * 60 * 1000),
      createdAt: now,
      variantGroupId: viralItem.variantGroupId,
      parentContentId: viralItem.id,
      isDerivative: true,
      viralStatus: 'normal',
      tone,
      format,
      onScreenHook,
      visualDirection,
      engagement: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: 0,
        reach: 0,
      },
    }

    derivatives.push(derivativeItem)
  }

  return {
    triggered: true,
    parentContentId: viralItem.id,
    velocityScore: viralItem.velocityScore || 2.5,
    derivativesCreated: derivatives,
  }
}
