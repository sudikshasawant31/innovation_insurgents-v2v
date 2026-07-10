import { calculateBurnoutRisk } from './burnout-scoring'

declare const test: (name: string, fn: () => void) => void
declare const expect: (actual: unknown) => { toBe: (expected: unknown) => void; toBeGreaterThan: (expected: number) => void; toContain: (expected: unknown) => void }

test('returns low wellness burnout estimate for rested low-load inputs', () => {
  const result = calculateBurnoutRisk({ sleepHours: 8, sleepQuality: 9, stress: 1, exhaustion: 1, workHours: 6, breaks: 9, exercise: 8, hydration: 8 })
  expect(result.riskLevel).toBe('Low')
})

test('returns moderate estimate for mixed workload and recovery pressure', () => {
  const result = calculateBurnoutRisk({ sleepHours: 6, sleepQuality: 5, stress: 6, exhaustion: 6, workHours: 10, workDays: 6, breaks: 4, caregiving: 5 })
  expect(['Mild', 'Moderate']).toContain(result.riskLevel)
  expect(result.totalScore).toBeGreaterThan(24)
})

test('flags urgent support when self-harm thoughts are reported', () => {
  const result = calculateBurnoutRisk({ selfHarmThoughts: true, stress: 9, exhaustion: 9 })
  expect(result.urgentSupport).toBe(true)
})
