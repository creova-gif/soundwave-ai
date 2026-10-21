import type {
  Campaign,
  ContentItem,
  Post,
  AgentLog,
  PlatformCredential,
  AnalyticsData,
  Platform,
  Song,
  AudioClip,
} from './types'
import { generateMultiVariants } from './agents/content-agent'
import { triggerAmplificationCascade } from './agents/amplification-agent'

// Mock data for demonstration - replace with Supabase when connected
let _idCounter = 1
const generateId = () => `id-${_idCounter++}`

// Fixed reference point so server and client render identical data
const REF = new Date('2026-05-06T19:00:00.000Z')
const ago = (ms: number) => new Date(REF.getTime() - ms)
const from = (ms: number) => new Date(REF.getTime() + ms)
const H = 3600000
const M = 60000
const D = 86400000

// Sample song
const sampleSong: Song = {
  id: 'song-1',
  title: 'Summer Vibes',
  artist: 'Your Artist Name',
  audioUrl: '/audio/sample.mp3',
  artworkUrl: '/images/album-art.jpg',
  genre: 'Pop',
  duration: 210,
  createdAt: new Date('2024-01-15'),
}

// Sample campaign
const sampleCampaign: Campaign = {
  id: 'campaign-1',
  name: '20M Reach Campaign',
  songId: 'song-1',
  song: sampleSong,
  status: 'active',
  startDate: REF,
  endDate: from(14 * D),
  targetReach: 20000000,
  currentReach: 2847293,
  budget: 500,
  platforms: ['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'spotify'],
  createdAt: REF,
}

// Sample content queue
const sampleContent: ContentItem[] = [
  {
    id: 'content-1',
    campaignId: 'campaign-1',
    type: 'full_post',
    platform: 'tiktok',
    content: 'POV: You found your new summer anthem. This beat hits different at sunset.',
    hashtags: ['#SummerVibes', '#NewMusic', '#TikTokMusic', '#Viral', '#FYP'],
    status: 'approved',
    scheduledFor: from(2 * H),
    createdAt: REF,
    variantGroupId: 'vg-alpha-101',
    tone: 'hype',
    format: 'hook',
    onScreenHook: 'Wait for the beat drop at 0:15...',
    visualDirection: 'Fast jump cuts synced with kick drums. Neon rim lighting, eye-level stare.',
    viralStatus: 'viral_spike',
    velocityScore: 3.42,
    engagement: { views: 42890, likes: 6420, comments: 842, shares: 1420, saves: 3100, clicks: 520, reach: 51200 },
  },
  {
    id: 'content-2',
    campaignId: 'campaign-1',
    type: 'full_post',
    platform: 'instagram',
    content: 'New track just dropped. Link in bio.',
    hashtags: ['#NewMusic', '#SummerVibes', '#InstaMusic', '#Explore'],
    status: 'pending',
    scheduledFor: from(4 * H),
    createdAt: REF,
    variantGroupId: 'vg-alpha-101',
    tone: 'storytelling',
    format: 'statement',
    onScreenHook: 'We made this in a bedroom at 3 AM',
    visualDirection: 'Dim bedroom lighting, slow camera pan across synth and headphones.',
    viralStatus: 'normal',
    velocityScore: 0.85,
  },
  {
    id: 'content-3',
    campaignId: 'campaign-1',
    type: 'full_post',
    platform: 'twitter',
    content: 'Just dropped something special. RT if you feel it.',
    hashtags: ['#NewMusic', '#NowPlaying'],
    status: 'pending',
    createdAt: REF,
    variantGroupId: 'vg-alpha-101',
    tone: 'controversial',
    format: 'question',
    onScreenHook: 'Is Pop music officially back?',
    visualDirection: 'Direct quote graphic paired with Spotify soundwave animation.',
    viralStatus: 'normal',
    velocityScore: 0.42,
  },
]

// Sample posts (already published)
const samplePosts: Post[] = [
  {
    id: 'post-1',
    campaignId: 'campaign-1',
    contentId: 'content-0',
    platform: 'tiktok',
    platformPostId: 'tt-123456',
    status: 'posted',
    postedAt: ago(6 * H),
    engagement: { views: 1247893, likes: 89234, comments: 4521, shares: 12847, saves: 34521, clicks: 8934, reach: 1456789 },
  },
  {
    id: 'post-2',
    campaignId: 'campaign-1',
    contentId: 'content-0',
    platform: 'instagram',
    platformPostId: 'ig-789012',
    status: 'posted',
    postedAt: ago(12 * H),
    engagement: { views: 456123, likes: 34521, comments: 1234, shares: 5678, saves: 12345, clicks: 3456, reach: 567890 },
  },
  {
    id: 'post-3',
    campaignId: 'campaign-1',
    contentId: 'content-0',
    platform: 'youtube',
    platformPostId: 'yt-345678',
    status: 'posted',
    postedAt: ago(24 * H),
    engagement: { views: 234567, likes: 12345, comments: 567, shares: 2345, saves: 5678, clicks: 8901, reach: 345678 },
  },
]

// Sample agent logs
const sampleLogs: AgentLog[] = [
  {
    id: 'log-1',
    campaignId: 'campaign-1',
    agentType: 'content',
    action: 'Generated new content',
    details: 'Created 5 TikTok captions with viral hooks',
    status: 'success',
    timestamp: ago(30 * M),
  },
  {
    id: 'log-2',
    campaignId: 'campaign-1',
    agentType: 'posting',
    action: 'Posted to TikTok',
    details: 'Successfully posted content-1 at optimal time (6 PM EST)',
    status: 'success',
    timestamp: ago(2 * H),
  },
  {
    id: 'log-3',
    campaignId: 'campaign-1',
    agentType: 'analytics',
    action: 'Performance analysis',
    details: 'TikTok post trending! Engagement rate 7.2% above average',
    status: 'success',
    timestamp: ago(1 * H),
  },
  {
    id: 'log-4',
    campaignId: 'campaign-1',
    agentType: 'orchestrator',
    action: 'Strategy adjustment',
    details: 'Increasing TikTok post frequency based on performance',
    status: 'info',
    timestamp: ago(15 * M),
  },
]

// Platform credentials
const syncedAt = ago(20 * M)
const sampleCredentials: PlatformCredential[] = [
  { platform: 'tiktok', connected: true, username: '@yourartist', followers: 125000, lastSynced: syncedAt },
  { platform: 'instagram', connected: true, username: '@yourartist', followers: 89000, lastSynced: syncedAt },
  { platform: 'youtube', connected: true, username: 'Your Artist', followers: 45000, lastSynced: syncedAt },
  { platform: 'twitter', connected: true, username: '@yourartist', followers: 32000, lastSynced: syncedAt },
  { platform: 'facebook', connected: false },
  { platform: 'spotify', connected: true, username: 'Your Artist', followers: 67000, lastSynced: syncedAt },
]

// Analytics data for charts (last 14 days) — deterministic, no Math.random()
const reachValues = [112000, 198000, 245000, 310000, 289000, 402000, 487000, 521000, 468000, 534000, 612000, 578000, 690000, 748000]
const engagementValues = [7300, 12800, 15900, 20100, 18700, 26100, 31600, 33800, 30400, 34700, 39800, 37600, 44900, 48600]
const postsPerDay = [7, 8, 6, 9, 7, 10, 8, 9, 7, 10, 11, 8, 9, 10]

const generateAnalyticsData = (): AnalyticsData[] => {
  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(REF)
    date.setUTCDate(date.getUTCDate() - (13 - i))
    return {
      date: date.toISOString().split('T')[0],
      reach: reachValues[i],
      engagement: engagementValues[i],
      posts: postsPerDay[i],
    }
  })
}

// Store state
let campaigns: Campaign[] = [sampleCampaign]
let contentQueue: ContentItem[] = sampleContent
let posts: Post[] = samplePosts
let agentLogs: AgentLog[] = sampleLogs
let credentials: PlatformCredential[] = sampleCredentials
let analyticsData: AnalyticsData[] = generateAnalyticsData()
let agentStatus: { [key: string]: 'running' | 'paused' | 'stopped' } = {
  content: 'running',
  posting: 'running',
  analytics: 'running',
  orchestrator: 'running',
}

// Store functions
export const store = {
  // Campaigns
  getCampaigns: () => campaigns,
  getCampaign: (id: string) => campaigns.find((c) => c.id === id),
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: generateId(),
      createdAt: new Date(),
    }
    campaigns.push(newCampaign)
    return newCampaign
  },
  updateCampaign: (id: string, updates: Partial<Campaign>) => {
    const index = campaigns.findIndex((c) => c.id === id)
    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...updates }
      return campaigns[index]
    }
    return null
  },

  // Content
  getContentQueue: (campaignId?: string) =>
    campaignId ? contentQueue.filter((c) => c.campaignId === campaignId) : contentQueue,
  addContent: (content: Omit<ContentItem, 'id' | 'createdAt'>) => {
    const newContent: ContentItem = {
      ...content,
      id: generateId(),
      createdAt: new Date(),
    }
    contentQueue.push(newContent)
    return newContent
  },
  updateContent: (id: string, updates: Partial<ContentItem>) => {
    const index = contentQueue.findIndex((c) => c.id === id)
    if (index !== -1) {
      contentQueue[index] = { ...contentQueue[index], ...updates }
      return contentQueue[index]
    }
    return null
  },
  deleteContent: (id: string) => {
    contentQueue = contentQueue.filter((c) => c.id !== id)
  },

  // v1.5 Multi-Variant & Amplification Engine
  generateVariantsForSong: (params: {
    songTitle: string
    artist?: string
    genre: string
    mood: string
    platform: Platform
    campaignId?: string
    variantCount?: number
  }) => {
    const variants = generateMultiVariants(params)
    variants.forEach((v) => contentQueue.push(v))
    store.addLog({
      agentType: 'content',
      action: 'Multi-Variants Generated',
      details: `Synthesized ${variants.length} multi-variant angles with visual hooks for ${params.platform}`,
      status: 'success',
    })
    return variants
  },

  triggerViralCascade: (contentId?: string) => {
    const target = contentId
      ? contentQueue.find((c) => c.id === contentId)
      : contentQueue.find((c) => c.viralStatus === 'viral_spike') || contentQueue[0]

    if (!target) return null

    target.viralStatus = 'viral_spike'
    target.velocityScore = 3.65

    const cascade = triggerAmplificationCascade(target)
    if (cascade.triggered && cascade.derivativesCreated.length > 0) {
      cascade.derivativesCreated.forEach((d) => contentQueue.unshift(d))
      target.viralStatus = 'amplified'

      store.addLog({
        agentType: 'analytics',
        action: 'Viral Velocity Spike (Z=3.65)',
        details: `Spike detected on ${target.platform}. Autonomous cascade dispatched ${cascade.derivativesCreated.length} derivative cuts.`,
        status: 'success',
      })
    }

    return cascade
  },

  // Posts
  getPosts: (campaignId?: string) => (campaignId ? posts.filter((p) => p.campaignId === campaignId) : posts),
  addPost: (post: Omit<Post, 'id'>) => {
    const newPost: Post = { ...post, id: generateId() }
    posts.push(newPost)
    return newPost
  },

  // Agent logs
  getLogs: (limit = 50) => agentLogs.slice(-limit).reverse(),
  addLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => {
    const newLog: AgentLog = {
      ...log,
      id: generateId(),
      timestamp: new Date(),
    }
    agentLogs.push(newLog)
    return newLog
  },

  // Platform credentials
  getCredentials: () => credentials,
  updateCredential: (platform: Platform, updates: Partial<PlatformCredential>) => {
    const index = credentials.findIndex((c) => c.platform === platform)
    if (index !== -1) {
      credentials[index] = { ...credentials[index], ...updates }
      return credentials[index]
    }
    return null
  },

  // Analytics
  getAnalytics: () => analyticsData,
  getTotalReach: () => analyticsData.reduce((sum, d) => sum + d.reach, 0),
  getPlatformStats: (): { platform: Platform; reach: number; percentage: number }[] => {
    const totalReach = 2847293 // From campaign
    const distribution: { platform: Platform; percentage: number }[] = [
      { platform: 'tiktok', percentage: 45 },
      { platform: 'instagram', percentage: 25 },
      { platform: 'youtube', percentage: 15 },
      { platform: 'twitter', percentage: 8 },
      { platform: 'facebook', percentage: 4 },
      { platform: 'spotify', percentage: 3 },
    ]
    return distribution.map((d) => ({
      platform: d.platform,
      reach: Math.floor((totalReach * d.percentage) / 100),
      percentage: d.percentage,
    }))
  },

  // Agent status
  getAgentStatus: () => agentStatus,
  setAgentStatus: (agent: string, status: 'running' | 'paused' | 'stopped') => {
    agentStatus[agent] = status
    store.addLog({
      agentType: agent as AgentLog['agentType'],
      action: `Agent ${status}`,
      details: `${agent} agent is now ${status}`,
      status: status === 'running' ? 'success' : 'info',
    })
  },

  // Simulate real-time updates
  simulateEngagement: () => {
    // Update campaign reach
    const campaign = campaigns[0]
    if (campaign) {
      campaign.currentReach += Math.floor(Math.random() * 10000)
    }

    // Update post engagement
    posts.forEach((post) => {
      post.engagement.views += Math.floor(Math.random() * 1000)
      post.engagement.likes += Math.floor(Math.random() * 100)
      post.engagement.comments += Math.floor(Math.random() * 10)
    })
  },
}

export type Store = typeof store
