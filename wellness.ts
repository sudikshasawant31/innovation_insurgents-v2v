import { db } from '@/lib/db'
import { moodEntry, wellnessRecommendation } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export interface MoodEntryInput {
  userId: string
  moodScore: number
  depressionScore?: number
  anxietyScore?: number
  sleepQuality?: number
  stressLevel?: number
  notes?: string
}

export async function createMoodEntry(input: MoodEntryInput) {
  const result = await db
    .insert(moodEntry)
    .values({
      id: Math.random().toString(36).substring(7),
      ...input,
    })
    .returning()

  return result[0]
}

export async function getMoodHistory(userId: string, days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  return await db
    .select()
    .from(moodEntry)
    .where(eq(moodEntry.userId, userId))
    .orderBy(desc(moodEntry.createdAt))
}

export async function getWellnessRecommendations(userId: string) {
  return await db
    .select()
    .from(wellnessRecommendation)
    .where(eq(wellnessRecommendation.userId, userId))
    .orderBy(desc(wellnessRecommendation.createdAt))
}

export async function createWellnessRecommendation(
  userId: string,
  category: string,
  title: string,
  description: string,
  priority = 'medium'
) {
  const result = await db
    .insert(wellnessRecommendation)
    .values({
      id: Math.random().toString(36).substring(7),
      userId,
      category,
      title,
      description,
      priority,
    })
    .returning()

  return result[0]
}

export async function completeRecommendation(id: string) {
  const result = await db
    .update(wellnessRecommendation)
    .set({ isCompleted: true, completedAt: new Date() })
    .where(eq(wellnessRecommendation.id, id))
    .returning()

  return result[0]
}

export async function generatePersonalizedRecommendations(userId: string, riskScores: any) {
  const recommendations = []

  // Nutrition recommendations
  if (riskScores.anemia > 50) {
    recommendations.push({
      category: 'nutrition',
      title: 'Iron-Rich Foods',
      description: 'Include spinach, red meat, and legumes to boost iron levels.',
      priority: 'high',
    })
  }

  if (riskScores.vitaminDeficiency > 50) {
    recommendations.push({
      category: 'nutrition',
      title: 'Vitamin Supplements',
      description: 'Consider Vitamin B12, Vitamin D, and multivitamin supplements.',
      priority: 'high',
    })
  }

  // Lifestyle recommendations
  if (riskScores.pcos > 50) {
    recommendations.push({
      category: 'lifestyle',
      title: 'Regular Exercise',
      description: 'Aim for 150 minutes of moderate exercise per week to manage PCOS.',
      priority: 'high',
    })
  }

  // Mental wellness
  if (riskScores.postpartumDepression > 50) {
    recommendations.push({
      category: 'mental',
      title: 'Mental Health Support',
      description: 'Consider speaking with a therapist or counselor for support.',
      priority: 'high',
    })
  }

  // Medical check-ups
  if (riskScores.thyroid > 50) {
    recommendations.push({
      category: 'medical',
      title: 'Thyroid Screening',
      description: 'Schedule a comprehensive thyroid function test with your doctor.',
      priority: 'high',
    })
  }

  // Create recommendations in database
  for (const rec of recommendations) {
    await createWellnessRecommendation(
      userId,
      rec.category,
      rec.title,
      rec.description,
      rec.priority
    )
  }

  return recommendations
}

export async function getMoodStats(userId: string) {
  const entries = await getMoodHistory(userId, 30)
  if (entries.length === 0) return null

  const moodScores = entries.map((e) => e.moodScore)
  const depressionScores = entries.filter((e) => e.depressionScore).map((e) => e.depressionScore)
  const anxietyScores = entries.filter((e) => e.anxietyScore).map((e) => e.anxietyScore)

  return {
    averageMood: moodScores.reduce((a, b) => a + b) / moodScores.length,
    averageDepression: depressionScores.length ? depressionScores.reduce((a, b) => a + b) / depressionScores.length : 0,
    averageAnxiety: anxietyScores.length ? anxietyScores.reduce((a, b) => a + b) / anxietyScores.length : 0,
    totalEntries: entries.length,
    latestEntry: entries[0],
  }
}
