import {
  pgTable, serial, text, varchar, integer,
  timestamp, numeric, boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
  telegramBotToken: text('telegram_bot_token'),
  telegramChatId: text('telegram_chat_id'),
  whatsappNumber: varchar('whatsapp_number', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  targetReach: integer('target_reach').default(0),
  currentReach: integer('current_reach').default(0),
  budget: numeric('budget', { precision: 10, scale: 2 }).default('0'),
  platforms: text('platforms').array(),
  songTitle: varchar('song_title', { length: 255 }),
  artist: varchar('artist', { length: 255 }),
  genre: varchar('genre', { length: 100 }),
  audioUrl: text('audio_url'),
  artworkUrl: text('artwork_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const contentItems = pgTable('content_items', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: varchar('platform', { length: 50 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().default('full_post'),
  content: text('content').notNull(),
  hashtags: text('hashtags').array(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  scheduledFor: timestamp('scheduled_for'),
  tone: varchar('tone', { length: 50 }),
  format: varchar('format', { length: 50 }),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  shares: integer('shares').default(0),
  saves: integer('saves').default(0),
  clicks: integer('clicks').default(0),
  reach: integer('reach').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const agentLogs = pgTable('agent_logs', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id'),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  agentType: varchar('agent_type', { length: 50 }).notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  details: text('details'),
  status: varchar('status', { length: 50 }).notNull().default('info'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  contentItems: many(contentItems),
  agentLogs: many(agentLogs),
}))

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, { fields: [campaigns.userId], references: [users.id] }),
  contentItems: many(contentItems),
  agentLogs: many(agentLogs),
}))

export const contentItemsRelations = relations(contentItems, ({ one }) => ({
  campaign: one(campaigns, { fields: [contentItems.campaignId], references: [campaigns.id] }),
  user: one(users, { fields: [contentItems.userId], references: [users.id] }),
}))

export const agentLogsRelations = relations(agentLogs, ({ one }) => ({
  user: one(users, { fields: [agentLogs.userId], references: [users.id] }),
}))

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
export type Campaign = typeof campaigns.$inferSelect
export type InsertCampaign = typeof campaigns.$inferInsert
export type ContentItem = typeof contentItems.$inferSelect
export type InsertContentItem = typeof contentItems.$inferInsert
export type AgentLog = typeof agentLogs.$inferSelect
export type InsertAgentLog = typeof agentLogs.$inferInsert
