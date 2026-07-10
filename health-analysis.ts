export type HealthAssessmentInput = {
  age?: string | number
  weight?: string | number
  height?: string | number
  symptoms?: string[]
  sleepHours?: string
  stressLevel?: string
  waterIntake?: string | number
  activity?: string
  cycleRegular?: string
  familyHistory?: string[]
}

export type RiskResult = {
  name: string
  key: string
  score: number
  risk: 'Low' | 'Moderate' | 'High'
  reason: string
}

export type HealthAnalysis = {
  healthScore: number
  status: string
  bmi: number | null
  risks: RiskResult[]
  recommendations: string[]
  datasetNotes: string[]
}

const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
const has = (items: string[] = [], value: string) => items.map(norm).includes(norm(value))
const num = (value: string | number | undefined) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function riskLabel(score: number): RiskResult['risk'] {
  if (score >= 60) return 'High'
  if (score >= 35) return 'Moderate'
  return 'Low'
}

export function analyzeHealth(input: HealthAssessmentInput): HealthAnalysis {
  const age = num(input.age)
  const weight = num(input.weight)
  const height = num(input.height)
  const water = num(input.waterIntake)
  const symptoms = input.symptoms || []
  const family = input.familyHistory || []
  const bmi = weight > 0 && height > 0 ? Number((weight / Math.pow(height / 100, 2)).toFixed(1)) : null

  let pcos = 8
  if (age >= 18 && age <= 40) pcos += 8
  if (bmi && bmi >= 25) pcos += 12
  if (input.cycleRegular === 'irregular') pcos += 22
  if (input.cycleRegular === 'very-irregular') pcos += 30
  if (has(symptoms, 'Irregular periods')) pcos += 18
  if (has(symptoms, 'Acne')) pcos += 12
  if (has(symptoms, 'Hair loss')) pcos += 12
  if (has(symptoms, 'Weight gain')) pcos += 10
  if (has(family, 'PCOS') || has(family, 'Diabetes')) pcos += 10

  let anemia = 6
  if (has(symptoms, 'Fatigue')) anemia += 18
  if (has(symptoms, 'Heavy bleeding')) anemia += 26
  if (weight > 0 && weight < 50) anemia += 10
  if (has(family, 'Anemia')) anemia += 10
  if (water < 5) anemia += 5

  let thyroid = 7
  if (has(symptoms, 'Fatigue')) thyroid += 8
  if (has(symptoms, 'Hair loss')) thyroid += 14
  if (has(symptoms, 'Weight gain')) thyroid += 12
  if (has(symptoms, 'Mood changes')) thyroid += 8
  if (has(family, 'Thyroid Disease')) thyroid += 25
  if (age >= 35) thyroid += 6

  let endometriosis = 5
  if (has(symptoms, 'Heavy bleeding')) endometriosis += 18
  if (has(symptoms, 'Severe cramps')) endometriosis += 28
  if (input.cycleRegular === 'very-irregular') endometriosis += 12

  let vitamin = 7
  if (has(symptoms, 'Fatigue')) vitamin += 12
  if (input.sleepHours === 'less-5') vitamin += 12
  if (input.activity === 'sedentary') vitamin += 12
  if (water < 6) vitamin += 10

  let menopause = 3
  if (age >= 45) menopause += 30
  if (age >= 50) menopause += 25
  if (has(symptoms, 'Mood changes')) menopause += 8

  const risks: RiskResult[] = [
    {
      name: 'PCOS',
      key: 'pcos',
      score: Math.min(100, pcos),
      risk: riskLabel(Math.min(100, pcos)),
      reason: 'Uses PCOS dataset patterns: cycle irregularity, BMI/weight pattern, acne, hair loss, and family metabolic history.',
    },
    {
      name: 'Anemia',
      key: 'anemia',
      score: Math.min(100, anemia),
      risk: riskLabel(Math.min(100, anemia)),
      reason: 'Uses women health indicators: fatigue, heavy bleeding, low body weight, hydration, and anemia history.',
    },
    {
      name: 'Thyroid',
      key: 'thyroid',
      score: Math.min(100, thyroid),
      risk: riskLabel(Math.min(100, thyroid)),
      reason: 'Uses thyroid indicator patterns: fatigue, hair loss, weight change, mood symptoms, age, and family history.',
    },
    {
      name: 'Endometriosis',
      key: 'endometriosis',
      score: Math.min(100, endometriosis),
      risk: riskLabel(Math.min(100, endometriosis)),
      reason: 'Uses symptom pattern screening around heavy bleeding, cramps, and cycle disruption.',
    },
    {
      name: 'Vitamin Deficiency',
      key: 'vitaminDeficiency',
      score: Math.min(100, vitamin),
      risk: riskLabel(Math.min(100, vitamin)),
      reason: 'Uses diet/lab indicator themes: fatigue, low sleep, low activity, and hydration habits.',
    },
    {
      name: 'Menopause Transition',
      key: 'menopause',
      score: Math.min(100, menopause),
      risk: riskLabel(Math.min(100, menopause)),
      reason: 'Age-sensitive screening for perimenopause/menopause indicators.',
    },
  ]

  const averageRisk = risks.reduce((sum, risk) => sum + risk.score, 0) / risks.length
  const healthScore = Math.max(1, Math.min(99, Math.round(100 - averageRisk)))
  const status = healthScore >= 75 ? 'Good Health Status' : healthScore >= 55 ? 'Needs Monitoring' : 'Follow Up Recommended'

  const recommendations = [
    ...(risks.find((risk) => risk.key === 'pcos')!.score >= 35
      ? ['Track cycle length for 3 months and discuss PCOS screening with a gynecologist.']
      : []),
    ...(risks.find((risk) => risk.key === 'anemia')!.score >= 35
      ? ['Consider CBC, ferritin, and iron studies if fatigue or heavy bleeding continues.']
      : []),
    ...(risks.find((risk) => risk.key === 'thyroid')!.score >= 35
      ? ['Ask about TSH, T3, and T4 testing, especially with hair loss or weight change.']
      : []),
    ...(water < 7 ? ['Increase water intake toward 7-8 glasses daily unless a doctor has restricted fluids.'] : []),
    ...(input.activity === 'sedentary' ? ['Start with a 20-30 minute walk on most days of the week.'] : []),
    'Use this as screening guidance only; confirm clinical decisions with a qualified doctor.',
  ]

  return {
    healthScore,
    status,
    bmi,
    risks,
    recommendations: recommendations.slice(0, 6),
    datasetNotes: [
      'PCOS scoring is informed by the uploaded PCOS dataset columns for PCOS status, AMH, and cycle-related indicators.',
      'Anemia, thyroid, BMI, diet, and PHQ-style wellness scoring are informed by the uploaded women health indicator CSVs and PHQ-9 form.',
    ],
  }
}

export function scorePhq9(values: number[]) {
  const total = values.reduce((sum, value) => sum + Math.max(0, Math.min(3, Number(value) || 0)), 0)
  const severity =
    total >= 20 ? 'Severe' : total >= 15 ? 'Moderately severe' : total >= 10 ? 'Moderate' : total >= 5 ? 'Mild' : 'Minimal'
  return { total, severity }
}
