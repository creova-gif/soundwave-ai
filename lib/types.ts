export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'spotify' | 'telegram' | 'whatsapp'

export interface Song {
  id: string
  title: string
  artist: string
  audioUrl: string
  artworkUrl: string
  genre: string
  duration: number
  createdAt: Date
}

export interface Campaign {
  id: string
  name: string
  songId: string
  song?: Song
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate: Date
  endDate: Date
  targetReach: number
  currentReach: number
  budget: number
  platforms: Platform[]
  createdAt: Date
}

export type ContentTone = 'emotional' | 'hype' | 'storytelling' | 'controversial'
export type ContentFormat = 'question' | 'statement' | 'hook' | 'cta'
export type ViralStatus = 'normal' | 'monitoring' | 'viral_spike' | 'amplified'

export interface AudioClip {
  id: string
  campaignId: string
  type: 'drop' | 'hook' | 'intro' | 'verse'
  startTimeSeconds: number
  endTimeSeconds: number
  label: string
  audioUrl: string
  createdAt: Date
}

export interface ContentMetricsSnapshot {
  id: string
  contentItemId: string
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  snapshotTime: Date
}

export interface ContentItem {
  id: string
  campaignId: string
  type: 'caption' | 'hashtags' | 'video_script' | 'full_post'
  platform: Platform
  content: string
  hashtags: string[]
  status: 'pending' | 'approved' | 'posted' | 'failed'
  scheduledFor?: Date
  createdAt: Date
  engagement?: EngagementMetrics
  tone?: ContentTone
  format?: ContentFormat
  variantGroupId?: string
  onScreenHook?: string
  visualDirection?: string
  audioClipId?: string
  parentContentId?: string
  isDerivative?: boolean
  viralStatus?: ViralStatus
  velocityScore?: number
}

export interface Post {
  id: string
  campaignId: string
  contentId: string
  platform: Platform
  platformPostId?: string
  status: 'scheduled' | 'posting' | 'posted' | 'failed'
  postedAt?: Date
  engagement: EngagementMetrics
  error?: string
}

export interface EngagementMetrics {
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  reach: number
}

export interface AgentLog {
  id: string
  campaignId?: string
  agentType: 'content' | 'posting' | 'analytics' | 'orchestrator'
  action: string
  details: string
  status: 'success' | 'error' | 'info'
  timestamp: Date
}

export interface PlatformCredential {
  platform: Platform
  connected: boolean
  username?: string
  followers?: number
  lastSynced?: Date
}

export interface AnalyticsData {
  date: string
  reach: number
  engagement: number
  posts: number
}

export interface PlatformStats {
  platform: Platform
  reach: number
  engagement: number
  followers: number
  posts: number
  topContent?: ContentItem
}
