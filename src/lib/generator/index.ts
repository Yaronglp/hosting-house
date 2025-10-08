// Re-export all generator functionality from individual modules
export { generatePlan } from './core-generator'
export type { GenerateInput, GenerateOptions, GenerateResult } from './types'

// Re-export individual utilities for advanced usage
export {
  mulberry32,
  hashSeed,
  shuffleInPlace
} from './rng-utils'

export {
  pickUniqueHosts,
  buildHostSlots
} from './host-selection'

export {
  violatesAvoid,
  assignGuestsToSlots
} from './guest-assignment'

export {
  analyzePairings,
  countRepeatedPairings,
  canSwapStudents,
  performFairnessPass
} from './fairness-pass'
