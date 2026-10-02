import { dailyTokenBudget, requestsPerMinute } from '@/lib/ai/limits'

export interface QuotaStore {
  incrementRequests(userId: number, bucket: string): Promise<number>
  getTokens(userId: number, bucket: string): Promise<number>
  addTokens(userId: number, bucket: string, tokens: number): Promise<void>
}

export class QuotaStoreError extends Error {
  constructor() {
    super('quota store unavailable')
  }
}

export type QuotaDecision =
  | { ok: true }
  | {
      ok: false
      error: string
      retryAfterSeconds: number
      action: 'rate_limited' | 'budget_exceeded'
    }

export function minuteBucket(now: Date): string {
  return `rpm:${now.toISOString().slice(0, 16)}`
}

export function dayBucket(now: Date): string {
  return `day:${now.toISOString().slice(0, 10)}`
}

export async function consumeAgentQuota(
  store: QuotaStore,
  userId: number,
  now = new Date(),
): Promise<QuotaDecision> {
  let count: number
  try {
    count = await store.incrementRequests(userId, minuteBucket(now))
  } catch {
    throw new QuotaStoreError()
  }

  if (count > requestsPerMinute()) {
    return {
      ok: false,
      error: 'Rate limit exceeded',
      retryAfterSeconds: Math.max(1, 60 - now.getUTCSeconds()),
      action: 'rate_limited',
    }
  }

  let used: number
  try {
    used = await store.getTokens(userId, dayBucket(now))
  } catch {
    throw new QuotaStoreError()
  }

  if (used >= dailyTokenBudget()) {
    const nextDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    return {
      ok: false,
      error: 'Daily token budget exceeded',
      retryAfterSeconds: Math.max(1, Math.ceil((nextDay - now.getTime()) / 1000)),
      action: 'budget_exceeded',
    }
  }

  return { ok: true }
}
