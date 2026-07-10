import { db, hasDatabase } from '@/lib/db'
import { biometricAuth, userSession } from '@/lib/db/schema'
import { and, eq, gt } from 'drizzle-orm'
import crypto from 'crypto'

export async function enableBiometric(
  userId: string,
  biometricType: 'fingerprint' | 'face' | 'iris',
  biometricData: string,
  deviceId: string,
  deviceName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!hasDatabase) {
      return { success: true }
    }

    // Hash biometric data for secure storage
    const biometricHash = crypto.createHash('sha256').update(biometricData).digest('hex')

    // Check if already exists
    const existing = await db.query.biometricAuth.findFirst({
      where: (table, { eq, and }) => and(eq(table.userId, userId), eq(table.deviceId, deviceId)),
    })

    if (existing) {
      // Update existing
      await db
        .update(biometricAuth)
        .set({
          biometricHash,
          isEnabled: true,
          updatedAt: new Date(),
        })
        .where(eq(biometricAuth.id, existing.id))
    } else {
      // Create new
      await db.insert(biometricAuth).values({
        id: `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        biometricType,
        biometricHash,
        deviceId,
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Biometric enrollment error:', error)
    return { success: false, error: 'Failed to enable biometric authentication' }
  }
}

export async function verifyBiometric(
  userId: string,
  biometricData: string,
  deviceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!hasDatabase) {
      return { success: true }
    }

    const biometricHash = crypto.createHash('sha256').update(biometricData).digest('hex')

    const record = await db.query.biometricAuth.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.userId, userId), eq(table.deviceId, deviceId), eq(table.isEnabled, true)),
    })

    if (!record) {
      return { success: false, error: 'Biometric not found or disabled' }
    }

    // In production, use more sophisticated biometric matching algorithms
    const isValid = record.biometricHash === biometricHash

    if (isValid) {
      await db
        .update(biometricAuth)
        .set({
          lastUsed: new Date(),
        })
        .where(eq(biometricAuth.id, record.id))

      return { success: true }
    }

    return { success: false, error: 'Biometric verification failed' }
  } catch (error) {
    console.error('Biometric verification error:', error)
    return { success: false, error: 'Biometric verification failed' }
  }
}

export async function disableBiometric(userId: string, deviceId: string): Promise<void> {
  try {
    if (!hasDatabase) {
      return
    }

    await db
      .update(biometricAuth)
      .set({
        isEnabled: false,
        updatedAt: new Date(),
      })
      .where(and(eq(biometricAuth.userId, userId), eq(biometricAuth.deviceId, deviceId)))
  } catch (error) {
    console.error('Error disabling biometric:', error)
  }
}

export async function createSession(
  userId: string,
  deviceId: string,
  deviceName: string,
  ipAddress: string,
  userAgent: string,
  expiryHours: number = 168
): Promise<string> {
  try {
    if (!hasDatabase) {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000)

    await db.insert(userSession).values({
      id: sessionId,
      userId,
      deviceId,
      deviceName,
      ipAddress,
      userAgent,
      lastActivity: new Date(),
      expiresAt,
      isActive: true,
      createdAt: new Date(),
    })

    return sessionId
  } catch (error) {
    console.error('Session creation error:', error)
    throw error
  }
}

export async function getActiveSessions(userId: string) {
  try {
    if (!hasDatabase) {
      return []
    }

    const now = new Date()
    return await db.query.userSession.findMany({
      where: (table, { eq, and, gt }) =>
        and(eq(table.userId, userId), eq(table.isActive, true), gt(table.expiresAt, now)),
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
}

export async function terminateSession(sessionId: string): Promise<void> {
  try {
    if (!hasDatabase) {
      return
    }

    await db
      .update(userSession)
      .set({
        isActive: false,
      })
      .where(eq(userSession.id, sessionId))
  } catch (error) {
    console.error('Error terminating session:', error)
  }
}
