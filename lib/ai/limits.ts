export const AGENT_MODEL_ID = 'openai/gpt-4o'

/** Replaces the AI SDK agent default of 20 steps. */
export const AGENT_MAX_STEPS = 4

/** Per model call, not the whole loop. */
export const AGENT_MAX_OUTPUT_TOKENS = 800

export const AGENT_TIMEOUT_MS = 25_000

export const AGENT_MAX_MESSAGES = 20
export const AGENT_MAX_MESSAGE_CHARS = 4_000
export const AGENT_MAX_PARTS = 8
/** Cap total text across all messages/parts (~daily budget / 4). */
export const AGENT_MAX_TOTAL_CHARS = 40_000
export const AGENT_MAX_SHORT_FIELD = 120
export const AGENT_MAX_MOOD_CHARS = 40
export const AGENT_MAX_CONTENT_CHARS = 4_000

const DEFAULT_REQUESTS_PER_MINUTE = 8
const DEFAULT_DAILY_TOKEN_BUDGET = 40_000

export function requestsPerMinute(): number {
  return readPositiveInt('AGENT_REQUESTS_PER_MINUTE', DEFAULT_REQUESTS_PER_MINUTE)
}

export function dailyTokenBudget(): number {
  return readPositiveInt('AGENT_DAILY_TOKEN_BUDGET', DEFAULT_DAILY_TOKEN_BUDGET)
}

function readPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name]
  if (raw == null || raw === '') return fallback
  const value = Number(raw)
  if (!Number.isSafeInteger(value) || value < 1) return fallback
  return value
}
