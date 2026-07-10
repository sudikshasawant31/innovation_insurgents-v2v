export type BurnoutFactor =
  | 'sleep'
  | 'workload'
  | 'emotionalExhaustion'
  | 'recovery'
  | 'caregivingBurden'
  | 'lifestyle'

export const burnoutFactorWeights: Record<BurnoutFactor, number> = {
  // Sleep has a strong relationship with recovery, mood, and stress resilience.
  sleep: 0.18,
  // Workload captures long hours, overtime, breaks, and difficulty disconnecting.
  workload: 0.2,
  // Emotional exhaustion is the clearest user-reported burnout signal.
  emotionalExhaustion: 0.26,
  // Recovery covers rest, social connection, and time away from demands.
  recovery: 0.14,
  // Caregiving and unpaid household work are common hidden contributors.
  caregivingBurden: 0.12,
  // Lifestyle is weighted lower because it is supportive, not diagnostic.
  lifestyle: 0.1,
}

export const burnoutExpectedFields = 27
