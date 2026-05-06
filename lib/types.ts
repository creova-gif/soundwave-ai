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
