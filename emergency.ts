import { db } from '@/lib/db'
import { emergencyContact } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface EmergencyContactInput {
  userId: string
  name: string
  phone: string
  relationship?: string
  isPrimary?: boolean
}

export async function createEmergencyContact(input: EmergencyContactInput) {
  // If marking as primary, unmark others
  if (input.isPrimary) {
    await db
      .update(emergencyContact)
      .set({ isPrimary: false })
      .where(eq(emergencyContact.userId, input.userId))
  }

  const result = await db
    .insert(emergencyContact)
    .values({
      id: Math.random().toString(36).substring(7),
      ...input,
    })
    .returning()

  return result[0]
}

export async function getEmergencyContacts(userId: string) {
  return await db
    .select()
    .from(emergencyContact)
    .where(eq(emergencyContact.userId, userId))
}

export async function getPrimaryEmergencyContact(userId: string) {
  const result = await db
    .select()
    .from(emergencyContact)
    .where((t) => eq(t.userId, userId) && eq(t.isPrimary, true))
    .limit(1)

  return result[0] || null
}

export async function updateEmergencyContact(id: string, name: string, phone: string, relationship?: string) {
  const result = await db
    .update(emergencyContact)
    .set({ name, phone, relationship })
    .where(eq(emergencyContact.id, id))
    .returning()

  return result[0]
}

export async function deleteEmergencyContact(id: string) {
  await db.delete(emergencyContact).where(eq(emergencyContact.id, id))
}

export interface EmergencyAlert {
  userId: string
  contactId: string
  timestamp: Date
  location?: string
  message: string
}

// In-memory storage for emergency alerts (would be persisted to DB in production)
const emergencyAlerts: EmergencyAlert[] = []

export async function triggerEmergencyAlert(userId: string, primaryContactId: string, message: string) {
  const alert: EmergencyAlert = {
    userId,
    contactId: primaryContactId,
    timestamp: new Date(),
    message,
  }

  emergencyAlerts.push(alert)

  // In a real app, this would trigger:
  // 1. SMS/Call to emergency contacts
  // 2. Geolocation services
  // 3. Emergency services if needed
  // 4. Real-time notifications

  return alert
}

export function getEmergencyAlerts(userId: string) {
  return emergencyAlerts.filter((a) => a.userId === userId)
}
