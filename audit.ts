import { db, hasDatabase } from '@/lib/db'
import { auditLog2 } from '@/lib/db/schema'
import { headers } from 'next/headers'

export interface AuditLogEntry {
  userId: string
  action: string
  resourceType?: string
  resourceId?: string
  status: 'success' | 'failure'
  details?: Record<string, any>
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    if (!hasDatabase) {
      console.info('[audit]', entry)
      return
    }

    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await db.insert(auditLog2).values({
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: entry.userId,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      status: entry.status,
      details: entry.details ? JSON.parse(JSON.stringify(entry.details)) : null,
      ipAddress,
      userAgent,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error('Audit logging error:', error)
    // Don't throw - audit should never break the main operation
  }
}

export async function getAuditLogs(userId: string, limit: number = 100) {
  try {
    if (!hasDatabase) {
      return []
    }

    return await db.query.auditLog2.findMany({
      where: (auditLog, { eq }) => eq(auditLog.userId, userId),
      limit,
      orderBy: (auditLog, { desc }) => desc(auditLog.createdAt),
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

export async function getLoginHistory(userId: string) {
  try {
    if (!hasDatabase) {
      return []
    }

    const logs = await db.query.auditLog2.findMany({
      where: (auditLog, { eq, and }) =>
        and(eq(auditLog.userId, userId), eq(auditLog.action, 'login')),
      limit: 20,
      orderBy: (auditLog, { desc }) => desc(auditLog.createdAt),
    })
    return logs
  } catch (error) {
    console.error('Error fetching login history:', error)
    return []
  }
}
