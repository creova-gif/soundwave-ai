import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { agentQuotas } from '@/lib/db/schema'
import type { QuotaStore } from '@/lib/ai/quota'

/**
 * Shared Postgres counters so Replit Autoscale instances enforce one limit.
 * `rpm:<UTC minute>` counts requests. `day:<UTC date>` counts tokens.
 */
export const dbQuotaStore: QuotaStore = {
  async incrementRequests(userId, bucket) {
    const rows = await db
      .insert(agentQuotas)
      .values({ userId, bucket, requests: 1, tokens: 0 })
      .onConflictDoUpdate({
        target: [agentQuotas.userId, agentQuotas.bucket],
        set: { requests: sql`${agentQuotas.requests} + 1` },
      })
      .returning({ requests: agentQuotas.requests })

    const count = rows[0]?.requests
    if (count == null) throw new Error('quota increment failed')
    return count
  },

  async getTokens(userId, bucket) {
    const rows = await db
      .select({ tokens: agentQuotas.tokens })
      .from(agentQuotas)
      .where(and(eq(agentQuotas.userId, userId), eq(agentQuotas.bucket, bucket)))
      .limit(1)
    return rows[0]?.tokens ?? 0
  },

  async addTokens(userId, bucket, tokens) {
    if (tokens <= 0) return
    await db
      .insert(agentQuotas)
      .values({ userId, bucket, requests: 0, tokens })
      .onConflictDoUpdate({
        target: [agentQuotas.userId, agentQuotas.bucket],
        set: { tokens: sql`${agentQuotas.tokens} + ${tokens}` },
      })
  },
}
