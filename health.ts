'use server'

import { getUserId, getIpAddress } from '@/lib/server-utils'
import { createAssessment, getLatestAssessment } from '@/lib/services/assessment'
import { createMoodEntry, generatePersonalizedRecommendations, getWellnessRecommendations } from '@/lib/services/wellness'
import { createEmergencyContact, getEmergencyContacts } from '@/lib/services/emergency'
import { db } from '@/lib/db'
import { auditLog } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

export async function submitHealthAssessment(data: any) {
  try {
    const userId = await getUserId()
    const ipAddress = await getIpAddress()

    const assessment = await createAssessment({
      userId,
      ...data,
    })

    if (assessment.riskScores) {
      await generatePersonalizedRecommendations(userId, assessment.riskScores)
    }

    await db.insert(auditLog).values({
      id: Math.random().toString(36).substring(7),
      userId,
      action: 'assessment_submitted',
      resourceType: 'assessment',
      resourceId: assessment.id,
      ipAddress,
    })

    revalidatePath('/dashboard')
    revalidatePath('/assessment')

    return { success: true, assessment }
  } catch (error) {
    console.error('[v0] Submit assessment error:', error)
    throw error
  }
}

export async function logMoodEntry(data: any) {
  try {
    const userId = await getUserId()
    const ipAddress = await getIpAddress()

    const entry = await createMoodEntry({
      userId,
      ...data,
    })

    await db.insert(auditLog).values({
      id: Math.random().toString(36).substring(7),
      userId,
      action: 'mood_logged',
      resourceType: 'mood',
      resourceId: entry.id,
      ipAddress,
    })

    revalidatePath('/mental-wellness')
    revalidatePath('/dashboard')

    return { success: true, entry }
  } catch (error) {
    console.error('[v0] Log mood error:', error)
    throw error
  }
}

export async function addEmergencyContact(data: any) {
  try {
    const userId = await getUserId()
    const ipAddress = await getIpAddress()

    const contact = await createEmergencyContact({
      userId,
      ...data,
    })

    await db.insert(auditLog).values({
      id: Math.random().toString(36).substring(7),
      userId,
      action: 'emergency_contact_added',
      resourceType: 'emergency_contact',
      resourceId: contact.id,
      ipAddress,
    })

    revalidatePath('/emergency')

    return { success: true, contact }
  } catch (error) {
    console.error('[v0] Add emergency contact error:', error)
    throw error
  }
}

export async function getUserRecommendations() {
  try {
    const userId = await getUserId()
    const recommendations = await getWellnessRecommendations(userId)
    return recommendations
  } catch (error) {
    console.error('[v0] Get recommendations error:', error)
    throw error
  }
}

export async function getLatestUserAssessment() {
  try {
    const userId = await getUserId()
    const assessment = await getLatestAssessment(userId)
    return assessment
  } catch (error) {
    console.error('[v0] Get latest assessment error:', error)
    throw error
  }
}

export async function getUserEmergencyContacts() {
  try {
    const userId = await getUserId()
    const contacts = await getEmergencyContacts(userId)
    return contacts
  } catch (error) {
    console.error('[v0] Get emergency contacts error:', error)
    throw error
  }
}
