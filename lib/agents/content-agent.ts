import { stepCountIs, ToolLoopAgent, tool } from 'ai'
import { z } from 'zod'
import { AGENT_MAX_OUTPUT_TOKENS, AGENT_MAX_STEPS, AGENT_MODEL_ID } from '@/lib/ai/limits'
import type { Platform, ContentItem } from '@/lib/types'

// Content Agent - Generates viral content for music marketing
export function createContentAgent() {
  return new ToolLoopAgent({
    model: AGENT_MODEL_ID,
    stopWhen: stepCountIs(AGENT_MAX_STEPS),
    maxOutputTokens: AGENT_MAX_OUTPUT_TOKENS,
    maxRetries: 0,
    instructions: `You are a viral music marketing expert specializing in social media content creation.
Your goal is to create engaging, platform-specific content that hooks viewers in the first second.

Guidelines:
- TikTok: Use trending sounds/formats, hooks in first 1s, duet-ready content
- Instagram: Visual-first, use Reels format, strong CTAs
- YouTube: Compelling thumbnails concept, shorts-optimized
- Twitter/X: Engagement bait, thread-ready, trending topic hijacking
- Facebook: Community-focused, shareable, emotional hooks
- Spotify: Pre-save focused, playlist-ready descriptions

Always include:
1. A compelling hook (first line must grab attention)
2. Platform-appropriate hashtags
3. Call-to-action
4. Emoji usage appropriate to platform`,
    tools: {
      analyzeTrends: tool({
        description: 'Analyze current trending topics and sounds on a platform',
        inputSchema: z.object({
          platform: z.enum(['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify']),
        }),
        execute: async ({ platform }) => {
          // Mock trending data - would connect to real APIs
          const trends: Record<Platform, string[]> = {
            tiktok: ['#SummerSounds', '#NewMusicFriday', '#VocalChallenge', '#DuetThis'],
            instagram: ['#MusicReels', '#NewArtist', '#BehindTheMusic', '#StudioLife'],
            youtube: ['#Shorts', '#MusicVideo', '#Reaction', '#FirstListen'],
            twitter: ['#NewMusic', '#NowPlaying', '#MusicTwitter', '#StreamParty'],
            facebook: ['#SupportIndieArtists', '#LiveMusic', '#MusicCommunity'],
            spotify: ['#SpotifyPlaylist', '#NewRelease', '#IndieMusic'],
          }
          return {
            platform,
            trending: trends[platform],
            optimalPostTime: getOptimalTime(platform),
            engagement_tips: `Focus on ${platform === 'tiktok' ? 'hooks in first 3 seconds' : 'visual storytelling'}`,
          }
        },
      }),

      generateCaption: tool({
        description: 'Generate a platform-specific caption for the song',
        inputSchema: z.object({
          platform: z.enum(['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify']),
          songTitle: z.string(),
          genre: z.string(),
          mood: z.string(),
          targetAudience: z.string().nullable(),
        }),
        execute: async ({ platform, songTitle, genre, mood }) => {
          // AI would generate this - mock for now
          const captions: Record<Platform, string> = {
            tiktok: `POV: You just found your new favorite song. ${songTitle} hits different.`,
            instagram: `New music alert. ${songTitle} is OUT NOW. Link in bio.`,
            youtube: `${songTitle} - Official Audio. Like & Subscribe for more ${genre} vibes.`,
            twitter: `Just dropped: ${songTitle}. This ${mood} track is everything. RT if you feel it.`,
            facebook: `Our new single ${songTitle} is here! Share with someone who needs this ${mood} energy.`,
            spotify: `${songTitle} - the perfect addition to your ${mood} playlist. Stream now.`,
          }
          return { caption: captions[platform], platform }
        },
      }),

      generateHashtags: tool({
        description: 'Generate optimal hashtags for maximum reach',
        inputSchema: z.object({
          platform: z.enum(['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify']),
          genre: z.string(),
          mood: z.string(),
          count: z.number().min(3).max(30).nullable(),
        }),
        execute: async ({ platform, genre, mood, count }) => {
          const hashtagCount = count || (platform === 'instagram' ? 20 : 5)
          const baseHashtags = ['#NewMusic', '#NowPlaying', `#${genre.replace(/\s/g, '')}`, `#${mood}Vibes`]
          const platformSpecific: Record<Platform, string[]> = {
            tiktok: ['#FYP', '#ForYou', '#Viral', '#TikTokMusic', '#MusicTok'],
            instagram: ['#Reels', '#InstaMusic', '#Explore', '#MusicReels', '#NewArtist'],
            youtube: ['#Shorts', '#YouTube', '#MusicVideo', '#Subscribe'],
            twitter: ['#MusicTwitter', '#RT', '#NewMusicFriday'],
            facebook: ['#Music', '#Share', '#Listen'],
            spotify: ['#Spotify', '#Playlist', '#Stream'],
          }
          const allHashtags = [...baseHashtags, ...platformSpecific[platform]]
          return {
            hashtags: allHashtags.slice(0, hashtagCount),
            platform,
          }
        },
      }),

      createVariations: tool({
        description: 'Create A/B test variations of content',
        inputSchema: z.object({
          originalContent: z.string(),
          platform: z.enum(['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify']),
          variationCount: z.number().min(2).max(5),
        }),
        execute: async ({ originalContent, variationCount }) => {
          const variations = []
          const hooks = ['POV:', 'Wait for it...', 'This is your sign to', 'When you realize', 'Nobody talks about']
          for (let i = 0; i < variationCount; i++) {
            variations.push({
              id: `var-${i + 1}`,
              content: `${hooks[i % hooks.length]} ${originalContent}`,
            })
          }
          return { variations }
        },
      }),

      generateVideoScript: tool({
        description: 'Generate a script for short-form video content',
        inputSchema: z.object({
          platform: z.enum(['tiktok', 'instagram', 'youtube']),
          songTitle: z.string(),
          duration: z.number().describe('Video duration in seconds'),
          style: z.enum(['reaction', 'behind-the-scenes', 'lyric-focus', 'dance', 'aesthetic']),
        }),
        execute: async ({ platform, songTitle, duration, style }) => {
          return {
            script: {
              hook: `[0-3s] Start with the catchiest part of ${songTitle}`,
              body: `[3-${duration - 5}s] ${style === 'reaction' ? 'Show genuine reaction to the drop' : 'Showcase the vibe'}`,
              cta: `[${duration - 5}s-end] Point to bio / ask for follow`,
            },
            tips: [
              'Film in vertical (9:16)',
              'Good lighting is essential',
              'Add captions for accessibility',
              `Best for ${platform}: ${style} content`,
            ],
          }
        },
      }),
    },
  })
}

function getOptimalTime(platform: Platform): string {
  const times: Record<Platform, string> = {
    tiktok: '7 PM - 9 PM EST',
    instagram: '11 AM - 1 PM EST',
    youtube: '2 PM - 4 PM EST',
    twitter: '9 AM - 11 AM EST',
    facebook: '1 PM - 3 PM EST',
    spotify: 'Friday 12 AM EST',
  }
  return times[platform]
}

// Export a function to run single-post generation
export async function generateContent(
  songTitle: string,
  genre: string,
  mood: string,
  platforms: Platform[]
): Promise<ContentItem[]> {
  const results: ContentItem[] = []

  for (const platform of platforms) {
    const content: ContentItem = {
      id: `gen-${Date.now()}-${platform}`,
      campaignId: 'campaign-1',
      type: 'full_post',
      platform,
      content: `AI-generated caption for ${songTitle} on ${platform}`,
      hashtags: ['#NewMusic', '#NowPlaying', `#${genre.replace(/\s+/g, '')}`],
      status: 'pending',
      createdAt: new Date(),
    }
    results.push(content)
  }

  return results
}

export interface GenerateMultiVariantsParams {
  songTitle: string
  artist?: string
  genre: string
  mood: string
  platform: Platform
  campaignId?: string
  clipLabel?: string
  variantCount?: number
}

// Generate 5-10 Multi-Variant outputs with visual scaffolding & tone tagging
export function generateMultiVariants(params: GenerateMultiVariantsParams): ContentItem[] {
  const {
    songTitle,
    artist = 'Artist',
    genre,
    mood,
    platform,
    campaignId = 'campaign-1',
    clipLabel = 'The Beat Drop',
    variantCount = 6,
  } = params

  const variantGroupId = `vg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`
  const variants: ContentItem[] = []

  const templates: Array<{
    tone: ContentItem['tone']
    format: ContentItem['format']
    hook: string
    visual: string
    caption: string
  }> = [
    {
      tone: 'hype',
      format: 'hook',
      hook: `Wait for the switch at 0:15...`,
      visual: `Fast-paced jump cuts sync with kick drums. Neon rim lighting, direct-to-lens stare.`,
      caption: `Turn the volume all the way up for this one. "${songTitle}" hits completely different on good speakers. Which platform did you find this on?`,
    },
    {
      tone: 'emotional',
      format: 'statement',
      hook: `I wrote this when I was about to quit music.`,
      visual: `Muted color grading, handheld 35mm grain. Solo shot in dim bedroom with audio waveform reflected in window.`,
      caption: `Almost didn't release "${songTitle}". Sometimes the songs that scare you the most are the ones you need to put out into the world.`,
    },
    {
      tone: 'storytelling',
      format: 'question',
      hook: `What if this was the last song of summer?`,
      visual: `Golden hour sunset drive, camera mounted on passenger side. Windows down, volume knob turned to max.`,
      caption: `Every summer needs that one unforgettable soundtrack. Is "${songTitle}" going on your playlist this weekend?`,
    },
    {
      tone: 'controversial',
      format: 'statement',
      hook: `People said ${genre} was dead. We proved them wrong.`,
      visual: `Split screen: Top half shows DAW project with 80+ tracks, bottom half shows live crowd reacting to the drop.`,
      caption: `They told us nobody listens to raw ${genre} anymore. "${songTitle}" is climbing the charts anyway. Proof that real production always wins.`,
    },
    {
      tone: 'hype',
      format: 'cta',
      hook: `Duet this with your favorite guitar solo`,
      visual: `Vertical 9:16 split-screen layout with left half open for user Duet/Remix. Waveform active at bottom.`,
      caption: `Open verse / duet challenge for "${songTitle}"! Show us what you'd add to this rhythm. Best submissions get pinned.`,
    },
    {
      tone: 'storytelling',
      format: 'hook',
      hook: `POV: You made a beat at 3 AM and it sounds like this`,
      visual: `Low-angle shot looking up at the producer desk, ambient studio purple hue, head nod starting subtle then locking in.`,
      caption: `Late night sessions always hit different. "${songTitle}" started from a 10-second voice memo. Out everywhere now.`,
    },
  ]

  const count = Math.min(variantCount, templates.length)

  for (let i = 0; i < count; i++) {
    const t = templates[i]
    variants.push({
      id: `variant-${variantGroupId}-${i + 1}`,
      campaignId,
      platform,
      type: 'full_post',
      content: t.caption,
      hashtags: [
        `#${genre.replace(/\s+/g, '')}`,
        `#${mood.replace(/\s+/g, '')}Vibes`,
        '#NewMusic',
        '#SoundWaveAI',
        '#FYP',
      ],
      status: 'pending',
      scheduledFor: new Date(Date.now() + (i + 1) * 3 * 3600 * 1000), // staggered every 3 hours
      createdAt: new Date(),
      variantGroupId,
      tone: t.tone,
      format: t.format,
      onScreenHook: t.hook,
      visualDirection: t.visual,
      viralStatus: 'normal',
      velocityScore: 0,
      engagement: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: 0,
        reach: 0,
      },
    })
  }

  return variants
}
