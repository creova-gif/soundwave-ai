'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Clock, CheckCircle, Edit, Trash2, Plus, Sparkles, Send } from 'lucide-react'
import { store } from '@/lib/store'
import { PlatformIcon } from '@/components/icons/platform-icons'
import type { ContentItem, Platform } from '@/lib/types'

const platformColors: Record<Platform, string> = {
  tiktok: 'bg-[#00f2ea]/15 text-[#00f2ea] border-[#00f2ea]/20',
  instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  youtube: 'bg-red-500/15 text-red-400 border-red-500/20',
  twitter: 'bg-foreground/15 text-foreground border-foreground/20',
  facebook: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  spotify: 'bg-green-500/15 text-green-400 border-green-500/20',
}

const platformLabels: Record<Platform, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X / Twitter',
  facebook: 'Facebook',
  spotify: 'Spotify',
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/15 text-warning border-warning/20' },
  approved: { label: 'Approved', color: 'bg-success/15 text-success border-success/20' },
  posted: { label: 'Posted', color: 'bg-primary/15 text-primary border-primary/20' },
  failed: { label: 'Failed', color: 'bg-destructive/15 text-destructive border-destructive/20' },
}

export default function ContentPage() {
  const [contentQueue, setContentQueue] = useState(store.getContentQueue())
  const [filter, setFilter] = useState<'all' | Platform>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | ContentItem['status']>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [newContent, setNewContent] = useState({
    platform: 'tiktok' as Platform,
    content: '',
    hashtags: '',
  })

  const filteredContent = contentQueue.filter((item) => {
    if (filter !== 'all' && item.platform !== filter) return false
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    return true
  })

  const handleApprove = (id: string) => {
    store.updateContent(id, { status: 'approved' })
    setContentQueue([...store.getContentQueue()])
  }

  const handleDelete = (id: string) => {
    store.deleteContent(id)
    setContentQueue([...store.getContentQueue()])
  }

  const handleAddContent = () => {
    store.addContent({
      campaignId: 'campaign-1',
      type: 'full_post',
      platform: newContent.platform,
      content: newContent.content,
      hashtags: newContent.hashtags.split(',').map((h) => h.trim()).filter(Boolean),
      status: 'pending',
    })
    setContentQueue([...store.getContentQueue()])
    setNewContent({ platform: 'tiktok', content: '', hashtags: '' })
  }

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 2000))
    const platforms: Platform[] = ['tiktok', 'instagram', 'twitter']
    platforms.forEach((platform) => {
      store.addContent({
        campaignId: 'campaign-1',
        type: 'full_post',
        platform,
        content: `AI-generated content for ${platform}: Your new summer anthem just dropped. This beat hits different.`,
        hashtags: ['#NewMusic', '#SummerVibes', '#FYP', '#Viral'],
        status: 'pending',
      })
    })
    setContentQueue([...store.getContentQueue()])
    setIsGenerating(false)
  }

  const formatTime = (date?: Date) => {
    if (!date) return 'Not scheduled'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Content Queue</h1>
          <p className="text-muted-foreground">{contentQueue.length} items in queue</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateAI} disabled={isGenerating}>
            <Sparkles className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
                <DialogDescription>Create new content for your campaign</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={newContent.platform} onValueChange={(v) => setNewContent({ ...newContent, platform: v as Platform })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(platformLabels) as Platform[]).map((p) => (
                        <SelectItem key={p} value={p}>
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={p} size={14} />
                            {platformLabels[p]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Write your post content..."
                    value={newContent.content}
                    onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hashtags (comma-separated)</label>
                  <Input
                    placeholder="#NewMusic, #Viral, #FYP"
                    value={newContent.hashtags}
                    onChange={(e) => setNewContent({ ...newContent, hashtags: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddContent}>Add to Queue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {(Object.keys(platformLabels) as Platform[]).map((p) => (
              <SelectItem key={p} value={p}>
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={p} size={14} />
                  {platformLabels[p]}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Grid */}
      <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item) => (
            <motion.div
              key={item.id}
              layout
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Card className="h-full hover:border-border/80 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      className={`flex items-center gap-1.5 border ${platformColors[item.platform]}`}
                      variant="secondary"
                    >
                      <PlatformIcon platform={item.platform} size={11} />
                      {platformLabels[item.platform]}
                    </Badge>
                    <Badge
                      className={`border ${statusConfig[item.status].color}`}
                      variant="secondary"
                    >
                      {statusConfig[item.status].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.hashtags.map((tag) => (
                      <span key={tag} className="text-xs text-primary font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(item.scheduledFor)}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {item.status === 'pending' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success" onClick={() => handleApprove(item.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {item.status === 'approved' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredContent.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Sparkles className="mb-4 h-10 w-10 text-muted-foreground/40" />
              <p className="mb-4 text-muted-foreground">No content found</p>
              <Button onClick={handleGenerateAI} disabled={isGenerating}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content with AI
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
