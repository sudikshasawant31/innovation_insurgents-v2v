import { db, hasDatabase } from '@/lib/db'
import { locationTracking, sosAlert, guardianProfile, user } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function updateLocation(
  userId: string,
  latitude: number,
  longitude: number,
  accuracy: number
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!hasDatabase) {
      return { success: true }
    }

    // Find existing location tracking
    const existing = await db.query.locationTracking.findFirst({
      where: (table) => eq(table.userId, userId),
    })

    if (existing) {
      await db
        .update(locationTracking)
        .set({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          accuracy,
          createdAt: new Date(),
        })
        .where(eq(locationTracking.id, existing.id))
    } else {
      await db.insert(locationTracking).values({
        id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        accuracy,
        status: 'idle',
        sosActive: false,
        createdAt: new Date(),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating location:', error)
    return { success: false, error: 'Failed to update location' }
  }
}

export async function activateSOS(
  userId: string,
  reason: string,
  currentLocation?: { lat?: number; lng?: number; latitude?: number; longitude?: number; accuracy?: number } | null
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!hasDatabase) {
      console.info('[sos]', { userId, reason, currentLocation })
      return { success: true }
    }

    // Get user location
    const location = await db.query.locationTracking.findFirst({
      where: (table) => eq(table.userId, userId),
    })

    if (!location) {
      return { success: false, error: 'Location not available' }
    }

    // Update location status
    await db
      .update(locationTracking)
      .set({
        status: 'sos',
        sosActive: true,
        sosStartTime: new Date(),
      })
      .where(eq(locationTracking.id, location.id))

    // Create SOS alert
    const alert = await db.insert(sosAlert).values({
      id: `sos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      alertType: 'sos',
      severity: 'critical',
      message: reason || 'Emergency SOS activated',
      guardianNotified: false,
      emergencyContactCalled: false,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      },
      isResolved: false,
      createdAt: new Date(),
    })

    // Get guardians and notify them
    const guardians = await db.query.guardianProfile.findMany({
      where: (table) => and(eq(table.userId, userId), eq(table.canReceiveAlerts, true)),
    })

    // Mark alert as notified
    if (guardians.length > 0) {
      await db
        .update(sosAlert)
        .set({
          guardianNotified: true,
        })
        .where(eq(sosAlert.id, alert[0].id))

      // TODO: Send SMS/notifications to guardians
    }

    return { success: true }
  } catch (error) {
    console.error('Error activating SOS:', error)
    return { success: false, error: 'Failed to activate SOS' }
  }
}

export async function deactivateSOS(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!hasDatabase) {
      return { success: true }
    }

    // Update location status
    await db
      .update(locationTracking)
      .set({
        status: 'idle',
        sosActive: false,
      })
      .where(eq(locationTracking.userId, userId))

    // Resolve active SOS alerts
    await db
      .update(sosAlert)
      .set({
        isResolved: true,
        resolvedAt: new Date(),
      })
      .where(and(eq(sosAlert.userId, userId), eq(sosAlert.isResolved, false)))

    return { success: true }
  } catch (error) {
    console.error('Error deactivating SOS:', error)
    return { success: false, error: 'Failed to deactivate SOS' }
  }
}

export async function getLatestLocation(userId: string) {
  try {
    if (!hasDatabase) {
      return null
    }

    return await db.query.locationTracking.findFirst({
      where: (table) => eq(table.userId, userId),
    })
  } catch (error) {
    console.error('Error fetching location:', error)
    return null
  }
}

export async function getActiveSOS() {
  try {
    if (!hasDatabase) {
      return []
    }

    return await db.query.sosAlert.findMany({
      where: (table) => eq(table.isResolved, false),
      orderBy: (table, { desc }) => desc(table.createdAt),
      limit: 50,
    })
  } catch (error) {
    console.error('Error fetching active SOS:', error)
    return []
  }
}

export async function createHealthAlert(
  userId: string,
  alertType: string,
  severity: 'critical' | 'high' | 'medium' | 'low',
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!hasDatabase) {
      return { success: true }
    }

    // Get user location
    const location = await db.query.locationTracking.findFirst({
      where: (table) => eq(table.userId, userId),
    })

    await db.insert(sosAlert).values({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      alertType,
      severity,
      message,
      guardianNotified: false,
      emergencyContactCalled: severity === 'critical',
      location: location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
          }
        : null,
      isResolved: false,
      createdAt: new Date(),
    })

    // Notify guardians if critical
    if (severity === 'critical') {
      const guardians = await db.query.guardianProfile.findMany({
        where: (table) => and(eq(table.userId, userId), eq(table.canReceiveAlerts, true)),
      })

      // TODO: Send SMS/notifications to guardians
    }

    return { success: true }
  } catch (error) {
    console.error('Error creating health alert:', error)
    return { success: false, error: 'Failed to create alert' }
  }
}
