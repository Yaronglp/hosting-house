import { Assignment, Student, Round } from '../types'
import { ValidationError } from './types'

/**
 * Check for duplicate hosts across all assignments
 */
export function checkDuplicateHosts(
  assignments: Assignment[],
  students: Student[]
): ValidationError | null {
  const studentsById = new Map(students.map(s => [s.id, s]))
  const hostIds = new Set<string>()
  const duplicateHosts: string[] = []
  
  for (const assignment of assignments) {
    for (const group of assignment.groups) {
      if (hostIds.has(group.hostId)) {
        const student = studentsById.get(group.hostId)
        duplicateHosts.push(student?.name || group.hostId)
      }
      hostIds.add(group.hostId)
    }
  }
  
  if (duplicateHosts.length > 0) {
    return {
      type: 'blocking',
      code: 'duplicate-hosts',
      message: 'מארחים כפולים נמצאו',
      count: duplicateHosts.length,
      details: duplicateHosts
    }
  }
  
  return null
}


/**
 * Check for insufficient hosts
 */
export function checkInsufficientHosts(
  students: Student[],
  rounds: Round[]
): ValidationError | null {
  const hostsNeeded = rounds.length
  const hostsAvailable = students.filter(s => s.canHost).length
  
  if (hostsAvailable < hostsNeeded) {
    return {
      type: 'blocking',
      code: 'insufficient-hosts',
      message: 'אין מספיק מארחים זמינים',
      count: hostsNeeded - hostsAvailable
    }
  }
  
  return null
}
