import { Assignment, Student, Round } from '../types'
import { ValidationError } from './types'

/**
 * Check for avoid violations
 */
export function checkAvoidViolations(
  assignments: Assignment[],
  students: Student[],
  rounds: Round[]
): ValidationError | null {
  const studentsById = new Map(students.map(s => [s.id, s]))
  const avoidViolations: string[] = []
  
  for (const assignment of assignments) {
    for (const group of assignment.groups) {
      const allMembers = [group.hostId, ...group.memberIds]
      const round = rounds.find(r => r.id === assignment.roundId)
      
      for (let i = 0; i < allMembers.length; i++) {
        for (let j = i + 1; j < allMembers.length; j++) {
          const student1 = studentsById.get(allMembers[i])
          const student2 = studentsById.get(allMembers[j])
          
          if (student1?.avoid.includes(allMembers[j]) || 
              student2?.avoid.includes(allMembers[i])) {
            avoidViolations.push(
              `${student1?.name} ↔ ${student2?.name} (${round?.name})`
            )
          }
        }
      }
    }
  }
  
  if (avoidViolations.length > 0) {
    return {
      type: 'warning',
      code: 'avoid-violated',
      message: 'הימנעויות הופרו',
      count: avoidViolations.length,
      details: avoidViolations
    }
  }
  
  return null
}

/**
 * Check for repeated pairings
 */
export function checkRepeatedPairings(
  assignments: Assignment[],
  students: Student[],
  rounds: Round[]
): ValidationError | null {
  const studentsById = new Map(students.map(s => [s.id, s]))
  const pairings = new Map<string, string[]>()
  
  for (const assignment of assignments) {
    for (const group of assignment.groups) {
      const allMembers = [group.hostId, ...group.memberIds]
      const round = rounds.find(r => r.id === assignment.roundId)
      
      for (let i = 0; i < allMembers.length; i++) {
        for (let j = i + 1; j < allMembers.length; j++) {
          const [id1, id2] = [allMembers[i], allMembers[j]].sort()
          const pairKey = `${id1}-${id2}`
          
          if (!pairings.has(pairKey)) {
            pairings.set(pairKey, [])
          }
          pairings.get(pairKey)!.push(round?.name || assignment.roundId)
        }
      }
    }
  }
  
  const repeatedPairs: string[] = []
  for (const [pairKey, roundNames] of pairings.entries()) {
    if (roundNames.length > 1) {
      const [id1, id2] = pairKey.split('-')
      const student1 = studentsById.get(id1)
      const student2 = studentsById.get(id2)
      repeatedPairs.push(
        `${student1?.name} ↔ ${student2?.name} (${roundNames.join(', ')})`
      )
    }
  }
  
  if (repeatedPairs.length > 0) {
    return {
      type: 'warning',
      code: 'repeated-pairings',
      message: 'צמד תלמידים שיפגשו יותר מפעם אחת',
      count: repeatedPairs.length,
      details: repeatedPairs
    }
  }
  
  return null
}

