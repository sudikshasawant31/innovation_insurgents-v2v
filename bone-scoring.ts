export type BoneAnswers = {
  age?: number
  heightCm?: number
  weightKg?: number
  menopause?: string
  earlyMenopause?: boolean
  absentPeriods?: boolean
  previousFracture?: boolean
  parentHipFracture?: boolean
  familyOsteoporosis?: boolean
  rheumatoid?: boolean
  thyroid?: boolean
  absorption?: boolean
  longTermSteroids?: boolean
  eatingDisorder?: boolean
  calciumServings?: number
  vitaminD?: number
  sunlight?: number
  weightBearing?: number
  strengthTraining?: number
  smoking?: boolean
  alcohol?: number
  sedentary?: number
  falls?: number
  heightLoss?: boolean
  backPain?: boolean
  balance?: boolean
}

export type BoneResult = {
  totalScore: number
  riskLevel: 'Low' | 'Moderate' | 'Elevated'
  bmi: number | null
  factors: string[]
  protectiveFactors: string[]
  recommendations: string[]
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

export function calculateBoneHealthRisk(answers: BoneAnswers): BoneResult {
  const heightM = answers.heightCm ? answers.heightCm / 100 : null
  const bmi = heightM && answers.weightKg ? Number((answers.weightKg / (heightM * heightM)).toFixed(1)) : null
  let score = 0
  const factors: string[] = []
  const protectiveFactors: string[] = []

  const add = (points: number, label: string) => {
    score += points
    factors.push(label)
  }

  if ((answers.age || 0) >= 65) add(18, 'Age 65 or above')
  else if ((answers.age || 0) >= 50) add(9, 'Age 50 or above')
  if (bmi !== null && bmi < 19) add(10, 'Low BMI')
  if (answers.menopause === 'post') add(12, 'Postmenopause')
  if (answers.earlyMenopause) add(8, 'Early menopause history')
  if (answers.absentPeriods) add(6, 'Irregular or absent periods')
  if (answers.previousFracture) add(16, 'Previous fracture')
  if (answers.parentHipFracture) add(12, 'Parent with hip fracture')
  if (answers.familyOsteoporosis) add(8, 'Family history of osteoporosis')
  if (answers.rheumatoid) add(8, 'Rheumatoid arthritis')
  if (answers.thyroid) add(6, 'Thyroid condition')
  if (answers.absorption) add(8, 'Digestive or absorption condition')
  if (answers.longTermSteroids) add(12, 'Long-term steroid use')
  if (answers.eatingDisorder) add(8, 'Eating disorder history')
  if ((answers.calciumServings || 0) < 2) add(7, 'Low calcium-rich food intake')
  if ((answers.vitaminD || 0) < 4) add(6, 'Low vitamin D or sunlight support')
  if ((answers.weightBearing || 0) < 3) add(7, 'Low weight-bearing activity')
  if ((answers.strengthTraining || 0) < 2) add(6, 'Low strength training')
  if (answers.smoking) add(8, 'Smoking')
  if ((answers.alcohol || 0) > 7) add(5, 'Higher alcohol intake')
  if ((answers.sedentary || 0) > 8) add(5, 'High sedentary time')
  if ((answers.falls || 0) > 0) add(8, 'Recent falls')
  if (answers.heightLoss) add(8, 'Height loss')
  if (answers.backPain) add(6, 'Persistent back pain')
  if (answers.balance) add(6, 'Balance concerns')

  if ((answers.calciumServings || 0) >= 3) protectiveFactors.push('Regular calcium-rich foods')
  if ((answers.weightBearing || 0) >= 4) protectiveFactors.push('Weight-bearing activity')
  if ((answers.strengthTraining || 0) >= 2) protectiveFactors.push('Strength training')
  if (!answers.smoking) protectiveFactors.push('No smoking reported')

  const totalScore = Math.round(clamp(score))
  const riskLevel = totalScore >= 45 ? 'Elevated' : totalScore >= 22 ? 'Moderate' : 'Low'

  return {
    totalScore,
    riskLevel,
    bmi,
    factors,
    protectiveFactors,
    recommendations: [
      'Discuss bone-density testing with a clinician if your estimate is moderate or elevated.',
      'Use food-first calcium and vitamin D tracking; ask a clinician before supplements.',
      'Prioritize safe weight-bearing, strength, balance, and fall-prevention activities.',
    ],
  }
}
