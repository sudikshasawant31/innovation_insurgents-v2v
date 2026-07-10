import { db } from '@/lib/db'
import { healthAssessment } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface AssessmentInput {
  userId: string
  age: number
  weight: number
  height: number
  menstrualCycleLength: number
  cycleRegularity: string
  symptoms: string[]
  medicalHistory: string[]
  medications: string[]
}

export interface RiskScores {
  pcos: number
  anemia: number
  thyroid: number
  endometriosis: number
  postpartumDepression: number
  menopause: number
  vitaminDeficiency: number
  overallRisk: number
}

export async function createAssessment(input: AssessmentInput) {
  const riskScores = calculateRiskScores(input)

  const result = await db
    .insert(healthAssessment)
    .values({
      id: Math.random().toString(36).substring(7),
      userId: input.userId,
      age: input.age,
      weight: input.weight.toString(),
      height: input.height.toString(),
      menstrualCycleLength: input.menstrualCycleLength,
      cycleRegularity: input.cycleRegularity,
      symptoms: input.symptoms,
      medicalHistory: input.medicalHistory,
      medications: input.medications,
      riskScores: riskScores as any,
    })
    .returning()

  return result[0]
}

export async function getLatestAssessment(userId: string) {
  const result = await db
    .select()
    .from(healthAssessment)
    .where(eq(healthAssessment.userId, userId))
    .orderBy((t) => [t.createdAt])
    .limit(1)

  return result[0] || null
}

export async function getUserAssessments(userId: string) {
  return await db
    .select()
    .from(healthAssessment)
    .where(eq(healthAssessment.userId, userId))
    .orderBy((t) => [t.createdAt])
}

function calculateRiskScores(input: AssessmentInput): RiskScores {
  let pcos = 0
  let anemia = 0
  let thyroid = 0
  let endometriosis = 0
  let postpartumDepression = 0
  let menopause = 0
  let vitaminDeficiency = 0

  // PCOS Risk Factors
  if (input.age >= 20 && input.age <= 40) pcos += 15
  if (input.weight > 70) pcos += 20
  if (input.cycleRegularity === 'irregular') pcos += 30
  if (input.symptoms.includes('hair-loss')) pcos += 20
  if (input.symptoms.includes('acne')) pcos += 15
  if (input.symptoms.includes('weight-gain')) pcos += 15
  if (input.medicalHistory.includes('diabetes')) pcos += 25
  pcos = Math.min(pcos, 100)

  // Anemia Risk Factors
  if (input.symptoms.includes('fatigue')) anemia += 20
  if (input.symptoms.includes('shortness-breath')) anemia += 25
  if (input.symptoms.includes('dizziness')) anemia += 15
  if (input.weight < 50) anemia += 15
  if (input.medicalHistory.includes('anemia')) anemia += 30
  anemia = Math.min(anemia, 100)

  // Thyroid Risk Factors
  if (input.symptoms.includes('fatigue')) thyroid += 15
  if (input.symptoms.includes('weight-gain')) thyroid += 15
  if (input.symptoms.includes('hair-loss')) thyroid += 20
  if (input.symptoms.includes('cold-sensitivity')) thyroid += 25
  if (input.medicalHistory.includes('thyroid')) thyroid += 40
  if (input.age > 35) thyroid += 10
  thyroid = Math.min(thyroid, 100)

  // Endometriosis Risk Factors
  if (input.symptoms.includes('severe-cramps')) endometriosis += 30
  if (input.symptoms.includes('heavy-bleeding')) endometriosis += 25
  if (input.cycleRegularity === 'very-heavy') endometriosis += 20
  if (input.age >= 25 && input.age <= 40) endometriosis += 15
  endometriosis = Math.min(endometriosis, 100)

  // Postpartum Depression Risk Factors
  if (input.medicalHistory.includes('depression')) postpartumDepression += 35
  if (input.symptoms.includes('mood-changes')) postpartumDepression += 25
  if (input.medicalHistory.includes('anxiety')) postpartumDepression += 25
  postpartumDepression = Math.min(postpartumDepression, 100)

  // Menopause Risk Factors
  if (input.age >= 45) menopause += 40
  if (input.age >= 50) menopause += 35
  if (input.symptoms.includes('hot-flashes')) menopause += 40
  if (input.symptoms.includes('mood-changes')) menopause += 20
  menopause = Math.min(menopause, 100)

  // Vitamin Deficiency Risk Factors
  if (input.symptoms.includes('fatigue')) vitaminDeficiency += 15
  if (input.symptoms.includes('weakness')) vitaminDeficiency += 15
  if (input.weight < 50) vitaminDeficiency += 20
  if (input.medicalHistory.includes('digestive-issues')) vitaminDeficiency += 25
  vitaminDeficiency = Math.min(vitaminDeficiency, 100)

  const overallRisk = Math.round(
    (pcos + anemia + thyroid + endometriosis + postpartumDepression + menopause + vitaminDeficiency) / 7
  )

  return {
    pcos,
    anemia,
    thyroid,
    endometriosis,
    postpartumDepression,
    menopause,
    vitaminDeficiency,
    overallRisk,
  }
}
