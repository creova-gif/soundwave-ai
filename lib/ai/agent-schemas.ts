import { z } from 'zod'
import {
  AGENT_MAX_CONTENT_CHARS,
  AGENT_MAX_MESSAGE_CHARS,
  AGENT_MAX_MESSAGES,
  AGENT_MAX_MOOD_CHARS,
  AGENT_MAX_PARTS,
  AGENT_MAX_SHORT_FIELD,
} from '@/lib/ai/limits'

const platforms = ['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify'] as const
const timeRanges = ['1h', '24h', '7d', '14d', '30d'] as const

export const platformSchema = z.string().trim().toLowerCase().pipe(z.enum(platforms))

function singleLine(max: number) {
  return z.string().trim().min(1).max(max).refine(
    (value) => !/[\u0000-\u001F\u007F]/.test(value),
    'Must be a single line',
  )
}

const textPartSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1).max(AGENT_MAX_MESSAGE_CHARS),
}).strip()

const userMessageSchema = z.object({
  id: z.string().min(1).max(128).optional(),
  role: z.literal('user'),
  content: z.string().min(1).max(AGENT_MAX_MESSAGE_CHARS).optional(),
  parts: z.array(textPartSchema).max(AGENT_MAX_PARTS).optional(),
}).strip().superRefine((message, ctx) => {
  const hasParts = (message.parts?.length ?? 0) > 0
  const hasContent = typeof message.content === 'string' && message.content.length > 0
  if (!hasParts && !hasContent) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Text is required', path: ['parts'] })
  }
})

const messagesSchema = z.array(userMessageSchema).max(AGENT_MAX_MESSAGES)

export type UserUiMessage = {
  id: string
  role: 'user'
  parts: Array<{ type: 'text'; text: string }>
}

function userText(text: string): UserUiMessage {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    parts: [{ type: 'text', text }],
  }
}

function fromClientMessage(message: z.infer<typeof userMessageSchema>): UserUiMessage {
  const parts = message.parts && message.parts.length > 0
    ? message.parts.map((part) => ({ type: 'text' as const, text: part.text }))
    : [{ type: 'text' as const, text: message.content ?? '' }]
  return {
    id: message.id ?? crypto.randomUUID(),
    role: 'user',
    parts,
  }
}

function field(value: string): string {
  return value.replaceAll('"', "'")
}

export const contentRequestSchema = z.object({
  messages: messagesSchema.optional(),
  songTitle: singleLine(AGENT_MAX_SHORT_FIELD).optional(),
  genre: singleLine(AGENT_MAX_SHORT_FIELD).optional(),
  mood: singleLine(AGENT_MAX_MOOD_CHARS).optional(),
  platform: platformSchema.optional(),
}).superRefine((body, ctx) => {
  const task = Boolean(body.songTitle && body.platform)
  const chat = (body.messages?.length ?? 0) > 0
  if (!task && !chat) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Send messages or a song task',
      path: ['messages'],
    })
  }
})

export const postingRequestSchema = z.object({
  messages: messagesSchema.optional(),
  action: z.enum(['schedule', 'post', 'optimal-times']).optional(),
  content: z.string().trim().min(1).max(AGENT_MAX_CONTENT_CHARS).optional(),
  platform: platformSchema.optional(),
}).superRefine((body, ctx) => {
  if (body.action === 'schedule' || body.action === 'post') {
    if (!body.content) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Content is required', path: ['content'] })
    }
    if (!body.platform) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Platform is required', path: ['platform'] })
    }
    return
  }
  if (body.action === 'optimal-times') return
  if ((body.messages?.length ?? 0) === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Send messages or an action', path: ['messages'] })
  }
})

export const analyticsRequestSchema = z.object({
  messages: messagesSchema.optional(),
  action: z.enum(['report', 'trends', 'stats']).optional(),
  platform: platformSchema.optional(),
  timeRange: z.enum(timeRanges).optional(),
}).superRefine((body, ctx) => {
  if (body.action === 'report') return
  if (body.action === 'trends' || body.action === 'stats') {
    if (!body.platform) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Platform is required', path: ['platform'] })
    }
    return
  }
  if ((body.messages?.length ?? 0) === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Send messages or an action', path: ['messages'] })
  }
})

export function contentToMessages(body: z.infer<typeof contentRequestSchema>): UserUiMessage[] {
  if (body.songTitle && body.platform) {
    const genre = field(body.genre ?? 'pop')
    const mood = field(body.mood ?? 'upbeat')
    const title = field(body.songTitle)
    return [userText(
      `Generate viral content for the song "${title}" (${genre}, ${mood} mood) for ${body.platform}.

First analyze current trends on ${body.platform}, then generate a compelling caption with hashtags.
Also create 3 variations for A/B testing.`,
    )]
  }
  return (body.messages ?? []).map(fromClientMessage)
}

export function postingToMessages(body: z.infer<typeof postingRequestSchema>): UserUiMessage[] {
  if ((body.action === 'schedule' || body.action === 'post') && body.content && body.platform) {
    const content = body.content.replaceAll('"', "'")
    const verb = body.action === 'schedule'
      ? `Find the optimal time to post on ${body.platform} and schedule this content`
      : `Post the following content to ${body.platform}. First check rate limits, then post if allowed`
    return [userText(`${verb}: "${content}"`)]
  }
  if (body.action === 'optimal-times') {
    return [userText(
      'Calculate the optimal posting times for all platforms (TikTok, Instagram, YouTube, Twitter, Facebook) based on our audience engagement data.',
    )]
  }
  return (body.messages ?? []).map(fromClientMessage)
}

export function analyticsToMessages(body: z.infer<typeof analyticsRequestSchema>): UserUiMessage[] {
  if (body.action === 'report') {
    return [userText(
      'Generate a comprehensive campaign performance report. Include total reach, engagement metrics, top performing content, and strategy recommendations.',
    )]
  }
  if (body.action === 'trends' && body.platform) {
    return [userText(
      `Detect current trends on ${body.platform} that we can capitalize on for our music marketing campaign.`,
    )]
  }
  if (body.action === 'stats' && body.platform) {
    const timeRange = body.timeRange ?? '24h'
    return [userText(
      `Fetch current engagement stats from ${body.platform} for the ${timeRange} time range. Provide insights on performance.`,
    )]
  }
  return (body.messages ?? []).map(fromClientMessage)
}

export function requestAction(body: { action?: string; songTitle?: string }): string {
  if (body.action) return body.action
  if (body.songTitle) return 'song-task'
  return 'chat'
}
