// Re-export all validation functionality from individual modules
export { validatePlan } from './core-validation'
export { retryRoundPlacement } from './retry-logic'
export type { ValidationError, ValidationResult } from './types'

// Re-export individual checkers for advanced usage
export {
  checkDuplicateHosts,
  checkInsufficientHosts
} from './error-checkers'

export {
  checkAvoidViolations,
  checkRepeatedPairings
} from './warning-checkers'
