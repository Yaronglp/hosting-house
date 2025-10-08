import { Assignment, Student, Round } from '../types'
import { ValidationResult } from './types'
import { 
  checkDuplicateHosts, 
  checkInsufficientHosts 
} from './error-checkers'
import { 
  checkAvoidViolations, 
  checkRepeatedPairings, 
  checkUnmetLikes 
} from './warning-checkers'

/**
 * Main validation function that orchestrates all validation checks
 */
export function validatePlan(
  assignments: Assignment[], 
  students: Student[], 
  rounds: Round[]
): ValidationResult {
  const errors = []
  const warnings = []

  // Check for blocking errors
  const duplicateHostsError = checkDuplicateHosts(assignments, students)
  if (duplicateHostsError) errors.push(duplicateHostsError)


  const insufficientHostsError = checkInsufficientHosts(students, rounds)
  if (insufficientHostsError) errors.push(insufficientHostsError)

  // Check for warnings
  const avoidViolationsWarning = checkAvoidViolations(assignments, students, rounds)
  if (avoidViolationsWarning) warnings.push(avoidViolationsWarning)

  const repeatedPairingsWarning = checkRepeatedPairings(assignments, students, rounds)
  if (repeatedPairingsWarning) warnings.push(repeatedPairingsWarning)

  const unmetLikesWarning = checkUnmetLikes(assignments, students, rounds)
  if (unmetLikesWarning) warnings.push(unmetLikesWarning)

  return {
    errors,
    warnings,
    isValid: errors.length === 0
  }
}
