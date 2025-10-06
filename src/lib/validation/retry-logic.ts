import { Assignment, Student, Round } from '../types'
import { generatePlan } from '../generator'

/**
 * Retry round placement with a new seed
 */
export function retryRoundPlacement(
  assignments: Assignment[],
  students: Student[],
  rounds: Round[],
  seed: string
): Promise<{ assignments: Assignment[], seed: string }> {
  // Generate new seed for retry
  const newSeed = Math.random().toString(36).slice(2)
  
  try {
    const result = generatePlan({ students, rounds }, { seed: newSeed })
    return Promise.resolve(result)
  } catch (error) {
    // If retry fails, return original with new seed
    return Promise.resolve({ assignments, seed: newSeed })
  }
}
