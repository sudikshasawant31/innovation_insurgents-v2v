import { calculateBoneHealthRisk } from './bone-scoring'

declare const test: (name: string, fn: () => void) => void
declare const expect: (actual: unknown) => { toBe: (expected: unknown) => void }

test('returns low bone health estimate when protective factors are present', () => {
  const result = calculateBoneHealthRisk({ age: 32, heightCm: 165, weightKg: 62, calciumServings: 3, weightBearing: 5, strengthTraining: 2, smoking: false })
  expect(result.riskLevel).toBe('Low')
})

test('returns elevated estimate for multiple professional follow-up factors', () => {
  const result = calculateBoneHealthRisk({ age: 68, heightCm: 160, weightKg: 47, menopause: 'post', previousFracture: true, parentHipFracture: true, falls: 1 })
  expect(result.riskLevel).toBe('Elevated')
})
