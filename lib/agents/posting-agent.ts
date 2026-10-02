import { stepCountIs, ToolLoopAgent, tool } from 'ai'
import { z } from 'zod'
import { AGENT_MAX_OUTPUT_TOKENS, AGENT_MAX_STEPS, AGENT_MODEL_ID } from '@/lib/ai/limits'
import type { Platform, ContentItem, Post } from '@/lib/types'

// Posting Agent - Handles scheduling and cross-platform posting
export function createPostingAgent() {
  return new ToolLoopAgent({
    model: AGENT_MODEL_ID,
    stopWhen: stepCountIs(AGENT_MAX_STEPS),
    maxOutputTokens: AGENT_MAX_OUTPUT_TOKENS,
    maxRetries: 0,
    instructions: `You are a social media posting specialist responsible for scheduling and publishing content across multiple platforms.

Your responsibilities:
1. Determine optimal posting times based on platform and audience
2. Handle cross-platform posting with appropriate formatting
3. Manage scheduling to avoid post fatigue
4. Handle rate limits and retries gracefully
5. Track posting success and failures

Best practices:
- Never post the same content to multiple platforms within 30 minutes
- Respect platform-specific rate limits
- Optimize posting times based on engagement data
- Always verify content is approved before posting`,
    tools: {
      getOptimalTime: tool({
        description: 'Calculate the best time to post on a specific platform',
        inputSchema: z.object({
          platform: z.enum(['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify']),
          timezone: z.string().nullable(),
          audienceLocation: z.string().nullable(),
        }),
        execute: async ({ platform }) => {
          // Peak engagement times by platform (mock data - would use analytics)
          const peakHours: Record<Platform, { hour: number; day: string }[]> = {
            tiktok: [
              { hour: 19, day: 'weekday' },
              { hour: 21, day: 'weekend' },
            ],
            instagram: [
              { hour: 11, day: 'weekday' },
              { hour: 13, day: 'weekend' },
            ],
            youtube: [
              { hour: 14, day: 'weekday' },
              { hour: 10, day: 'weekend' },
            ],
            twitter: [
              { hour: 9, day: 'weekday' },
              { hour: 12, day: 'weekend' },
            ],
            facebook: [
              { hour: 13, day: 'weekday' },
              { hour: 11, day: 'weekend' },
            ],
            spotify: [{ hour: 0, day: 'friday' }],
          }

          const now = new Date()
          const isWeekend = now.getDay() === 0 || now.getDay() === 6
          const peaks = peakHours[platform]
          const relevantPeak = peaks.find((p) => (isWeekend ? p.day === 'weekend' : p.day === 'weekday')) || peaks[0]

          const nextPostTime = new Date()
          nextPostTime.setHours(relevantPeak.hour, 0, 0, 0)
          if (nextPostTime < now) {
            nextPostTime.setDate(nextPostTime.getDate() + 1)
          }

          return {
            platform,
            recommendedTime: nextPostTime.toISOString(),
            engagementScore: Math.floor(Math.random() * 30) + 70, // 70-100
            reasoning: `Based on historical data, ${platform} sees highest engagement at ${relevantPeak.hour}:00`,
          }
        },
      }),

      postToTikTok: tool({
        description: 'Post content to TikTok',
        inputSchema: z.object({
          content: z.string(),
          hashtags: z.array(z.string()),
          mediaUrl: z.string().nullable(),
        }),
        execute: async ({ content, hashtags }) => {
          // Mock TikTok API call
          return {
            success: true,
            platformPostId: `tt-${Date.now()}`,
            postUrl: `https://tiktok.com/@user/video/${Date.now()}`,
            message: 'Posted to TikTok successfully',
            content: `${content} ${hashtags.join(' ')}`,
          }
        },
      }),

      postToInstagram: tool({
        description: 'Post content to Instagram',
        inputSchema: z.object({
          content: z.string(),
          hashtags: z.array(z.string()),
          mediaUrl: z.string().nullable(),
          type: z.enum(['feed', 'reel', 'story']),
        }),
        execute: async ({ content, hashtags, type }) => {
          return {
            success: true,
            platformPostId: `ig-${Date.now()}`,
            postUrl: `https://instagram.com/p/${Date.now()}`,
            message: `Posted ${type} to Instagram successfully`,
            content: `${content}\n.\n.\n.\n${hashtags.join(' ')}`,
          }
        },
      }),

      postToYouTube: tool({
        description: 'Post content to YouTube',
        inputSchema: z.object({
          title: z.string(),
          description: z.string(),
          hashtags: z.array(z.string()),
          mediaUrl: z.string(),
          type: z.enum(['short', 'video']),
        }),
        execute: async ({ title, type }) => {
          return {
            success: true,
            platformPostId: `yt-${Date.now()}`,
            postUrl: `https://youtube.com/${type === 'short' ? 'shorts' : 'watch'}/${Date.now()}`,
            message: `Posted ${type} to YouTube successfully`,
            title,
          }
        },
      }),

      postToTwitter: tool({
        description: 'Post content to Twitter/X',
        inputSchema: z.object({
          content: z.string(),
          hashtags: z.array(z.string()),
          mediaUrl: z.string().nullable(),
        }),
        execute: async ({ content, hashtags }) => {
          const tweet = `${content} ${hashtags.slice(0, 3).join(' ')}`
          if (tweet.length > 280) {
            return {
              success: false,
              error: 'Tweet exceeds 280 characters',
            }
          }
          return {
            success: true,
            platformPostId: `tw-${Date.now()}`,
            postUrl: `https://twitter.com/user/status/${Date.now()}`,
            message: 'Posted to Twitter successfully',
            content: tweet,
          }
        },
      }),

      postToFacebook: tool({
        description: 'Post content to Facebook',
        inputSchema: z.object({
          content: z.string(),
          hashtags: z.array(z.string()),
          mediaUrl: z.string().nullable(),
        }),
        execute: async ({ content }) => {
          return {
            success: true,
            platformPostId: `fb-${Date.now()}`,
            postUrl: `https://facebook.com/posts/${Date.now()}`,
            message: 'Posted to Facebook successfully',
            content,
          }
        },
      }),

      schedulePost: tool({
        description: 'Schedule a post for later',
        inputSchema: z.object({
          contentId: z.string(),
          platform: z.enum(['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify']),
          scheduledTime: z.string(),
        }),
        execute: async ({ contentId, platform, scheduledTime }) => {
          return {
            success: true,
            contentId,
            platform,
            scheduledTime,
            message: `Scheduled for ${new Date(scheduledTime).toLocaleString()}`,
          }
        },
      }),

      checkRateLimit: tool({
        description: 'Check if we can post to a platform (rate limiting)',
        inputSchema: z.object({
          platform: z.enum(['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify']),
        }),
        execute: async ({ platform }) => {
          // Mock rate limit check
          const limits: Record<Platform, { postsPerHour: number; postsPerDay: number }> = {
            tiktok: { postsPerHour: 3, postsPerDay: 10 },
            instagram: { postsPerHour: 5, postsPerDay: 25 },
            youtube: { postsPerHour: 2, postsPerDay: 10 },
            twitter: { postsPerHour: 10, postsPerDay: 100 },
            facebook: { postsPerHour: 5, postsPerDay: 25 },
            spotify: { postsPerHour: 1, postsPerDay: 5 },
          }
          return {
            platform,
            canPost: true,
            remainingPosts: Math.floor(Math.random() * limits[platform].postsPerHour) + 1,
            limits: limits[platform],
          }
        },
      }),
    },
  })
}

// Helper function to post content
export async function postContent(content: ContentItem): Promise<Post> {
  const post: Post = {
    id: `post-${Date.now()}`,
    campaignId: content.campaignId,
    contentId: content.id,
    platform: content.platform,
    status: 'posting',
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

  try {
    // Simulate posting delay
    await new Promise((r) => setTimeout(r, 1000))
    post.status = 'posted'
    post.postedAt = new Date()
    post.platformPostId = `${content.platform}-${Date.now()}`
  } catch (error) {
    post.status = 'failed'
    post.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return post
}
