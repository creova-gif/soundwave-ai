'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Bot, Bell, Shield, Key, Save, AlertTriangle,
  MessageCircle, Send, CheckCircle2, Loader2,
  ExternalLink, Phone, Hash, Copy, ChevronRight,
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoApproveContent: false,
    maxPostsPerDay: 12,
    enableTrendResponder: true,
    agentModel: 'gpt-4o',
    emailNotifications: true,
    pushNotifications: false,
    notifyOnViral: true,
    notifyOnError: true,
    dailyDigest: true,
    contentGuidelines: 'Keep content positive and engaging. Avoid controversial topics. Focus on the music and the vibe.',
    bannedWords: '',
    requireApproval: true,
    openaiKey: '',
    postEverywhereKey: '',
  })

  const [telegram, setTelegram] = useState({ botToken: '', chatId: '' })
  const [whatsapp, setWhatsapp] = useState({ phone: '' })
  const [telegramStatus, setTelegramStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle')
  const [telegramError, setTelegramError] = useState('')
  const [whatsappSaved, setWhatsappSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/user').then(r => r.json()).then(({ user }) => {
      if (!user) return
      if (user.telegramBotToken) setTelegram(t => ({ ...t, botToken: user.telegramBotToken }))
      if (user.telegramChatId) setTelegram(t => ({ ...t, chatId: user.telegramChatId }))
      if (user.whatsappNumber) setWhatsapp({ phone: user.whatsappNumber })
      if (user.telegramBotToken && user.telegramChatId) setTelegramStatus('connected')
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSaving(false)
  }

  const handleTelegramTest = async () => {
    if (!telegram.botToken || !telegram.chatId) {
      setTelegramError('Both Bot Token and Chat ID are required')
      setTelegramStatus('error')
      return
    }
    setTelegramStatus('testing')
    setTelegramError('')
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: telegram.botToken, chatId: telegram.chatId }),
      })
      const data = await res.json()
      if (res.ok) {
        setTelegramStatus('connected')
      } else {
        setTelegramError(data.error ?? 'Connection failed')
        setTelegramStatus('error')
      }
    } catch {
      setTelegramError('Network error')
      setTelegramStatus('error')
    }
  }

  const handleWhatsappSave = async () => {
    await fetch('/api/auth/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsappNumber: whatsapp.phone }),
    })
    setWhatsappSaved(true)
    setTimeout(() => setWhatsappSaved(false), 2000)
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">Configure your marketing automation system</p>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1">
          <TabsTrigger value="agents" className="gap-2">
            <Bot className="h-4 w-4" />Agents
          </TabsTrigger>
          <TabsTrigger value="connections" className="gap-2">
            <MessageCircle className="h-4 w-4" />Connections
            {telegramStatus === 'connected' && (
              <span className="ml-1 h-2 w-2 rounded-full bg-green-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />Notifications
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <Shield className="h-4 w-4" />Content
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />API Keys
          </TabsTrigger>
        </TabsList>

        {/* Agents */}
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" />Agent Configuration</CardTitle>
              <CardDescription>Control how your AI agents behave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-approve Content</p>
                  <p className="text-sm text-muted-foreground">Automatically approve AI-generated content for posting</p>
                </div>
                <Switch checked={settings.autoApproveContent} onCheckedChange={(v) => setSettings({ ...settings, autoApproveContent: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Trend Responder</p>
                  <p className="text-sm text-muted-foreground">Auto-generate content when trends are detected</p>
                </div>
                <Switch checked={settings.enableTrendResponder} onCheckedChange={(v) => setSettings({ ...settings, enableTrendResponder: v })} />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Max Posts Per Day</label>
                <Select value={settings.maxPostsPerDay.toString()} onValueChange={(v) => setSettings({ ...settings, maxPostsPerDay: parseInt(v) })}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[6, 12, 18, 24].map(n => <SelectItem key={n} value={n.toString()}>{n} posts/day</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="font-medium">AI Model</label>
                <Select value={settings.agentModel} onValueChange={(v) => setSettings({ ...settings, agentModel: v })}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                    <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connections */}
        <TabsContent value="connections" className="space-y-6">
          {/* Telegram */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2481cc]/15 border border-[#2481cc]/25">
                    <Send className="h-5 w-5 text-[#2481cc]" />
                  </div>
                  <div>
                    <CardTitle>Telegram</CardTitle>
                    <CardDescription>Get AI agent alerts directly in Telegram</CardDescription>
                  </div>
                </div>
                {telegramStatus === 'connected' && (
                  <Badge variant="outline" className="border-green-500/40 text-green-500 gap-1">
                    <CheckCircle2 className="h-3 w-3" />Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Setup Guide</p>
                {[
                  { step: '1', text: 'Open Telegram and search for', link: { label: '@BotFather', href: 'https://t.me/botfather' } },
                  { step: '2', text: 'Send /newbot and follow the prompts to create your bot' },
                  { step: '3', text: 'Copy the bot token BotFather sends you' },
                  { step: '4', text: 'Get your Chat ID from', link: { label: '@userinfobot', href: 'https://t.me/userinfobot' } },
                ].map(({ step, text, link }) => (
                  <div key={step} className="flex items-start gap-3 text-sm">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">{step}</span>
                    <span className="text-muted-foreground">
                      {text}{' '}
                      {link && (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[#2481cc] hover:underline inline-flex items-center gap-0.5">
                          {link.label}<ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Key className="h-3.5 w-3.5 text-muted-foreground" />Bot Token
                  </label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="1234567890:ABCDEFabcdef..."
                      value={telegram.botToken}
                      onChange={(e) => { setTelegram({ ...telegram, botToken: e.target.value }); setTelegramStatus('idle') }}
                      className="pr-9 font-mono text-xs"
                    />
                    {telegram.botToken && (
                      <button onClick={() => copyToClipboard(telegram.botToken, 'token')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {copied === 'token' ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />Chat ID
                  </label>
                  <Input
                    type="text" placeholder="e.g. 123456789"
                    value={telegram.chatId}
                    onChange={(e) => { setTelegram({ ...telegram, chatId: e.target.value }); setTelegramStatus('idle') }}
                    className="font-mono"
                  />
                </div>
              </div>

              {telegramStatus === 'error' && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />{telegramError}
                </div>
              )}
              {telegramStatus === 'connected' && (
                <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-500">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />Connected! Check your Telegram for the test message.
                </div>
              )}

              <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-2">You'll receive alerts for:</p>
                <div className="grid grid-cols-2 gap-1">
                  {['Campaign goes live', 'Content goes viral 🔥', 'Daily digest at 9am', 'Agent errors'].map(t => (
                    <div key={t} className="flex items-center gap-1.5">
                      <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />{t}
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleTelegramTest}
                disabled={telegramStatus === 'testing' || !telegram.botToken || !telegram.chatId}
                className="gap-2">
                {telegramStatus === 'testing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {telegramStatus === 'connected' ? 'Send Another Test' : 'Connect & Test'}
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/15 border border-[#25D366]/25">
                  <Phone className="h-5 w-5 text-[#25D366]" />
                </div>
                <div>
                  <CardTitle>WhatsApp</CardTitle>
                  <CardDescription>Generate WhatsApp-optimized campaign content</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground space-y-2">
                <p className="text-foreground font-medium">How it works</p>
                <p>Add your number to generate WhatsApp-specific content — short punchy messages, broadcast scripts, and status updates tailored for the platform. AI also auto-generates{' '}
                  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline inline-flex items-center gap-0.5">
                    wa.me quick-share links<ExternalLink className="h-3 w-3" />
                  </a>{' '}for every campaign.
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />WhatsApp Business Number
                </label>
                <div className="flex gap-2">
                  <Input
                    type="tel" placeholder="+1 555 000 0000"
                    value={whatsapp.phone}
                    onChange={(e) => { setWhatsapp({ phone: e.target.value }); setWhatsappSaved(false) }}
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={handleWhatsappSave} className="gap-2 flex-shrink-0">
                    {whatsappSaved ? <><CheckCircle2 className="h-4 w-4 text-green-500" />Saved</> : <><Save className="h-4 w-4" />Save</>}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Include country code — e.g. +44 7911 123456</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Content the AI generates for WhatsApp:</p>
                <div className="grid grid-cols-2 gap-1">
                  {['Broadcast messages', 'Status update scripts', 'Story captions', 'wa.me campaign links'].map(t => (
                    <div key={t} className="flex items-center gap-1.5">
                      <ChevronRight className="h-3 w-3 text-[#25D366] flex-shrink-0" />{t}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                { key: 'notifyOnViral', label: 'Viral Content Alerts', desc: 'Get notified when content goes viral' },
                { key: 'notifyOnError', label: 'Error Alerts', desc: 'Get notified when agents encounter errors' },
                { key: 'dailyDigest', label: 'Daily Digest', desc: 'Receive a daily performance summary' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={settings[key as keyof typeof settings] as boolean}
                    onCheckedChange={(v) => setSettings({ ...settings, [key]: v })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Content Guidelines</CardTitle>
              <CardDescription>Set rules for AI-generated content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Manual Approval</p>
                  <p className="text-sm text-muted-foreground">Review all content before posting</p>
                </div>
                <Switch checked={settings.requireApproval} onCheckedChange={(v) => setSettings({ ...settings, requireApproval: v })} />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Content Guidelines</label>
                <Textarea value={settings.contentGuidelines} onChange={(e) => setSettings({ ...settings, contentGuidelines: e.target.value })} rows={4} />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Banned Words (comma-separated)</label>
                <Input placeholder="word1, word2, word3" value={settings.bannedWords} onChange={(e) => setSettings({ ...settings, bannedWords: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" />API Configuration</CardTitle>
              <CardDescription>Manage your API keys and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-warning/50 bg-warning/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium text-warning">Demo Mode</p>
                    <p className="text-sm text-muted-foreground">Running with AI-generated mock data. Add API keys to connect real platforms.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-medium">OpenAI API Key</label>
                <Input type="password" placeholder="sk-..." value={settings.openaiKey} onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="font-medium">PostEverywhere API Key</label>
                <Input type="password" placeholder="pe_..." value={settings.postEverywhereKey} onChange={(e) => setSettings({ ...settings, postEverywhereKey: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
