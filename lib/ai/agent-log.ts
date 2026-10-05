import { db } from '@/lib/db'
import { agentLogs } from '@/lib/db/schema'

export async function writeAgentLog(entry: {
  userId: number
  agentType: 'content' | 'posting' | 'analytics'
  action: string
  status: 'info' | 'error'
  details: Record<string, unknown>
}) {
  try {
    await db.insert(agentLogs).values({
      userId: entry.userId,
      agentType: entry.agentType,
      action: entry.action.slice(0, 255),
      status: entry.status,
      details: JSON.stringify(entry.details).slice(0, 4_000),
    })
  } catch {
    console.error('[agent-log] write failed')
  }
}
