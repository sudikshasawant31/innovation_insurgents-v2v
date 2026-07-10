import { burnoutExpectedFields, burnoutFactorWeights, type BurnoutFactor } from './burnout-config'

export type BurnoutAnswers = {
  ageRange?: string
  employment?: string
  student?: string
  arrangement?: string
  caregiving?: number
  householdLoad?: number
  sleepHours?: number
  sleepQuality?: number
  fallingAsleep?: number
  nightAwakenings?: number
  refreshed?: number
  workHours?: number
  workDays?: number
  overtime?: number
  breaks?: number
  disconnect?: number
  workload?: number
  stress?: number
  exhaustion?: number
  irritability?: number
  motivation?: number
  overwhelmed?: number
  accomplishment?: number
  concentration?: number
  exercise?: number
  social?: number
  screenTime?: number
  hydration?: number
  meals?: number
  relaxation?: number
  menstrualImpact?: number
  pregnancyPostpartum?: boolean
  menopauseImpact?: number
  unableToFunction?: boolean
  selfHarmThoughts?: boolean
  feelingUnsafe?: boolean
}

export type BurnoutResult = {
  totalScore: number
  riskLevel: 'Low' | 'Mild' | 'Moderate' | 'High'
  factorScores: Record<BurnoutFactor, number>
  completeness: number
  urgentSupport: boolean
  explanation: string
  recommendations: string[]
  reassessmentDays: number
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function ten(value = 0) {
  return clamp(value, 0, 10)
}

function answeredCount(answers: BurnoutAnswers) {
  return Object.values(answers).filter((value) => value !== undefined && value !== '').length
}

export function calculateBurnoutRisk(answers: BurnoutAnswers): BurnoutResult {
  const sleepPressure = clamp(
    ((answers.sleepHours && answers.sleepHours < 7 ? (7 - answers.sleepHours) * 14 : 0) +
      (10 - ten(answers.sleepQuality)) * 4 +
      ten(answers.fallingAsleep) * 3 +
      ten(answers.nightAwakenings) * 3 +
      (10 - ten(answers.refreshed)) * 4) /
      2.4,
  )

  const workloadPressure = clamp(
    ((answers.workHours && answers.workHours > 8 ? (answers.workHours - 8) * 9 : 0) +
      (answers.workDays && answers.workDays > 5 ? (answers.workDays - 5) * 10 : 0) +
      ten(answers.overtime) * 5 +
      (10 - ten(answers.breaks)) * 4 +
      (10 - ten(answers.disconnect)) * 5 +
      ten(answers.workload) * 5) /
      2.5,
  )

  const emotionalPressure = clamp(
    (ten(answers.stress) +
      ten(answers.exhaustion) +
      ten(answers.irritability) +
      ten(answers.motivation) +
      ten(answers.overwhelmed) +
      ten(answers.accomplishment) +
      ten(answers.concentration)) *
      1.35,
  )

  const recoveryPressure = clamp(
    ((10 - ten(answers.relaxation)) * 5 +
      (10 - ten(answers.social)) * 3 +
      (10 - ten(answers.exercise)) * 3 +
      ten(answers.screenTime) * 2) /
      1.3,
  )

  const caregivingPressure = clamp(
    (ten(answers.caregiving) * 4 +
      ten(answers.householdLoad) * 4 +
      ten(answers.menstrualImpact) * 2.5 +
      ten(answers.menopauseImpact) * 2.5 +
      (answers.pregnancyPostpartum ? 12 : 0)) /
      1.45,
  )

  const lifestylePressure = clamp(
    ((10 - ten(answers.hydration)) * 3 +
      (10 - ten(answers.meals)) * 3 +
      (10 - ten(answers.exercise)) * 3 +
      ten(answers.screenTime) * 2) /
      1.1,
  )

  const factorScores: Record<BurnoutFactor, number> = {
    sleep: Math.round(sleepPressure),
    workload: Math.round(workloadPressure),
    emotionalExhaustion: Math.round(emotionalPressure),
    recovery: Math.round(recoveryPressure),
    caregivingBurden: Math.round(caregivingPressure),
    lifestyle: Math.round(lifestylePressure),
  }

  const totalScore = Math.round(
    Object.entries(factorScores).reduce(
      (sum, [factor, score]) => sum + score * burnoutFactorWeights[factor as BurnoutFactor],
      0,
    ),
  )

  const riskLevel = totalScore >= 70 ? 'High' : totalScore >= 45 ? 'Moderate' : totalScore >= 25 ? 'Mild' : 'Low'
  const urgentSupport =
    Boolean(answers.selfHarmThoughts || answers.feelingUnsafe || answers.unableToFunction) ||
    (ten(answers.stress) >= 9 && ten(answers.exhaustion) >= 9)

  const recommendations = [
    totalScore >= 45 ? 'Schedule a recovery block and reduce non-urgent load this week.' : 'Keep protecting recovery time and check in again next week.',
    factorScores.sleep >= 45 ? 'Prioritize a consistent sleep window and reduce late screen time.' : 'Maintain current sleep habits.',
    factorScores.workload >= 45 ? 'Add short breaks and a clear end-of-work boundary.' : 'Keep breaks visible in your daily routine.',
    factorScores.caregivingBurden >= 45 ? 'Discuss one practical task that can be shared or postponed.' : 'Continue tracking caregiving load.',
  ]

  return {
    totalScore,
    riskLevel,
    factorScores,
    completeness: Math.round(clamp((answeredCount(answers) / burnoutExpectedFields) * 100)),
    urgentSupport,
    explanation: `This is a wellness burnout-risk estimate based on sleep, workload, emotional exhaustion, recovery, caregiving burden, and lifestyle inputs. It is not a diagnosis.`,
    recommendations,
    reassessmentDays: riskLevel === 'High' ? 7 : riskLevel === 'Moderate' ? 14 : 30,
  }
}
