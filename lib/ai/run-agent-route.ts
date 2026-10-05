import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { createAgentUIStreamResponse, type Agent } from 'ai'
import type { z } from 'zod'
import { writeAgentLog } from '@/lib/ai/agent-log'
import { dbQuotaStore } from '@/lib/ai/db-quota-store'
import {
  AGENT_MODEL_ID,
  AGENT_TIMEOUT_MS,
} from '@/lib/ai/limits'
import { consumeAgentQuota, dayBucket, QuotaStoreError } from '@/lib/ai/quota'
import { requestAction, type UserUiMessage } from '@/lib/ai/agent-schemas'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

type AgentType = 'content' | 'posting' | 'analytics'

export async function runAgentRoute<S extends z.ZodTypeAny>(
  req: NextRequest,
  config: {
    agentType: AgentType
    schema: S
    createAgent: () => { readonly tools: object }
    toMessages: (data: z.output<S>) => UserUiMessage[]
  },
): Promise<Response> {
  const sessionResponse = NextResponse.next()
  let userId: number | undefined
  try {
    const session = await getIronSession<SessionData>(req, sessionResponse, sessionOptions)
    userId = session.userId
  } catch {
    console.error('[agent] session read failed')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = config.schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'Invalid request',
      fields: [...new Set(parsed.error.issues.map((issue) => issue.path.map(String).join('.') || 'body'))],
    }, { status: 400 })
  }

  let quota
  try {
    quota = await consumeAgentQuota(dbQuotaStore, userId)
  } catch (err) {
    if (err instanceof QuotaStoreError) {
      return NextResponse.json({ error: 'Agent usage store unavailable' }, { status: 503 })
    }
    throw err
  }

  if (!quota.ok) {
    await writeAgentLog({
      userId,
      agentType: config.agentType,
      action: quota.action,
      status: 'error',
      details: { reason: quota.action },
    })
    return NextResponse.json(
      { error: quota.error },
      { status: 429, headers: { 'Retry-After': String(quota.retryAfterSeconds) } },
    )
  }

  const uiMessages = config.toMessages(parsed.data)
  const agent = config.createAgent()
  const usage = { steps: 0, inputTokens: 0, outputTokens: 0 }
  let logged = false
  const action = requestAction(parsed.data as { action?: string; songTitle?: string })

  const persist = async (status: 'info' | 'error') => {
    if (logged) return
    logged = true
    const totalTokens = usage.inputTokens + usage.outputTokens
    try {
      await dbQuotaStore.addTokens(userId, dayBucket(new Date()), totalTokens)
    } catch {
      console.error('[agent] token budget update failed')
    }
    await writeAgentLog({
      userId,
      agentType: config.agentType,
      action,
      status,
      details: {
        model: AGENT_MODEL_ID,
        steps: usage.steps,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens,
      },
    })
  }

  try {
    return await createAgentUIStreamResponse({
      agent: agent as Agent,
      uiMessages,
      abortSignal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
      timeout: { totalMs: AGENT_TIMEOUT_MS },
      onStepFinish: (step) => {
        usage.steps += 1
        usage.inputTokens += step.usage?.inputTokens ?? 0
        usage.outputTokens += step.usage?.outputTokens ?? 0
      },
      onFinish: () => persist('info'),
      onError: () => {
        void persist('error')
        return 'The agent request failed.'
      },
    })
  } catch {
    console.error('[agent] stream setup failed')
    await persist('error')
    return NextResponse.json({ error: 'Agent request failed' }, { status: 502 })
  }
}
