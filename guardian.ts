import { db } from '@/lib/db'
import { guardianProfile, user } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export interface GuardianInvitation {
  userId: string
  email: string
  relationship: string
  phoneNumber: string
}

export async function addGuardian(
  userId: string,
  guardianEmail: string,
  relationship: string,
  phoneNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find guardian user
    const guardianUser = await db.query.user.findFirst({
      where: (table) => eq(table.email, guardianEmail),
    })

    if (!guardianUser) {
      return { success: false, error: 'Guardian email not found. They need to create an account first.' }
    }

    // Check if already guardian
    const existing = await db.query.guardianProfile.findFirst({
      where: (table) =>
        and(eq(table.userId, userId), eq(table.guardianUserId, guardianUser.id)),
    })

    if (existing) {
      return { success: false, error: 'This person is already your guardian' }
    }

    // Add guardian
    await db.insert(guardianProfile).values({
      id: `guardian_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      guardianUserId: guardianUser.id,
      relationship,
      phoneNumber,
      canViewHealth: true,
      canViewLocation: false,
      canReceiveAlerts: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error adding guardian:', error)
    return { success: false, error: 'Failed to add guardian' }
  }
}

export async function getMyGuardians(userId: string) {
  try {
    return await db.query.guardianProfile.findMany({
      where: (table) => eq(table.userId, userId),
    })
  } catch (error) {
    console.error('Error fetching guardians:', error)
    return []
  }
}

export async function getMyWards(guardianUserId: string) {
  try {
    return await db.query.guardianProfile.findMany({
      where: (table) => eq(table.guardianUserId, guardianUserId),
    })
  } catch (error) {
    console.error('Error fetching wards:', error)
    return []
  }
}

export async function updateGuardianPermissions(
  guardianProfileId: string,
  permissions: {
    canViewHealth?: boolean
    canViewLocation?: boolean
    canReceiveAlerts?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const guardian = await db.query.guardianProfile.findFirst({
      where: (table) => eq(table.id, guardianProfileId),
    })

    if (!guardian) {
      return { success: false, error: 'Guardian not found' }
    }

    await db
      .update(guardianProfile)
      .set({
        canViewHealth: permissions.canViewHealth ?? guardian.canViewHealth,
        canViewLocation: permissions.canViewLocation ?? guardian.canViewLocation,
        canReceiveAlerts: permissions.canReceiveAlerts ?? guardian.canReceiveAlerts,
        updatedAt: new Date(),
      })
      .where((table) => table.id === guardianProfileId)

    return { success: true }
  } catch (error) {
    console.error('Error updating guardian permissions:', error)
    return { success: false, error: 'Failed to update permissions' }
  }
}

export async function removeGuardian(guardianProfileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const guardian = await db.query.guardianProfile.findFirst({
      where: (table) => eq(table.id, guardianProfileId),
    })

    if (!guardian) {
      return { success: false, error: 'Guardian not found' }
    }

    await db.delete(guardianProfile).where((table) => table.id === guardianProfileId)

    return { success: true }
  } catch (error) {
    console.error('Error removing guardian:', error)
    return { success: false, error: 'Failed to remove guardian' }
  }
}
