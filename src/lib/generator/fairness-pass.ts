import { Assignment, Student } from '../types'
import { violatesAvoid } from './guest-assignment'

/**
 * Analyze pairings across all assignments
 */
export function analyzePairings(assignments: Assignment[]): Map<string, Set<string>> {
  const pairings = new Map<string, Set<string>>()
  
  for (const assignment of assignments) {
    for (const group of assignment.groups) {
      const allMembers = [group.hostId, ...group.memberIds]
      for (let i = 0; i < allMembers.length; i++) {
        for (let j = i + 1; j < allMembers.length; j++) {
          const [id1, id2] = [allMembers[i], allMembers[j]].sort()
          if (!pairings.has(id1)) pairings.set(id1, new Set())
          pairings.get(id1)!.add(id2)
        }
      }
    }
  }
  
  return pairings
}

/**
 * Count repeated pairings
 */
export function countRepeatedPairings(pairings: Map<string, Set<string>>): number {
  let repeats = 0
  for (const partners of pairings.values()) {
    if (partners.size > 1) {
      repeats += partners.size - 1
    }
  }
  return repeats
}

/**
 * Check if two students can be swapped
 */
export function canSwapStudents(
  assignments: Assignment[], 
  roundId1: string, student1: string,
  roundId2: string, student2: string,
  studentsById: Map<string, Student>
): boolean {
  // Cannot swap hosts
  const assignment1 = assignments.find(a => a.roundId === roundId1)!
  const assignment2 = assignments.find(a => a.roundId === roundId2)!
  const group1 = assignment1.groups[0]
  const group2 = assignment2.groups[0]
  
  if (group1.hostId === student1 || group2.hostId === student2) return false
  
  // Check if swap would violate avoid constraints
  const group1Members = [group1.hostId, ...group1.memberIds.filter(id => id !== student1), student2]
  const group2Members = [group2.hostId, ...group2.memberIds.filter(id => id !== student2), student1]
  
  return !violatesAvoid(student2, group1Members.filter(id => id !== student2), studentsById) &&
         !violatesAvoid(student1, group2Members.filter(id => id !== student1), studentsById)
}

/**
 * Perform fairness pass to reduce repeated pairings
 */
export function performFairnessPass(
  assignments: Assignment[], 
  studentsById: Map<string, Student>,
  rng: () => number
): Assignment[] {
  const result = assignments.map(a => ({
    ...a,
    groups: a.groups.map(g => ({ ...g, memberIds: [...g.memberIds] }))
  }))
  
  const maxSwapAttempts = 50
  let bestResult = result
  let bestRepeats = countRepeatedPairings(analyzePairings(result))
  
  for (let attempt = 0; attempt < maxSwapAttempts; attempt++) {
    const current = bestResult.map(a => ({
      ...a,
      groups: a.groups.map(g => ({ ...g, memberIds: [...g.memberIds] }))
    }))
    
    // Find all students who are not hosts
    const nonHostStudents: Array<{roundId: string, studentId: string}> = []
    for (const assignment of current) {
      for (const group of assignment.groups) {
        for (const memberId of group.memberIds) {
          nonHostStudents.push({ roundId: assignment.roundId, studentId: memberId })
        }
      }
    }
    
    if (nonHostStudents.length < 2) break
    
    // Try random swaps
    const idx1 = Math.floor(rng() * nonHostStudents.length)
    let idx2 = Math.floor(rng() * nonHostStudents.length)
    while (idx2 === idx1) idx2 = Math.floor(rng() * nonHostStudents.length)
    
    const student1 = nonHostStudents[idx1]
    const student2 = nonHostStudents[idx2]
    
    if (student1.roundId === student2.roundId) continue
    
    if (canSwapStudents(current, student1.roundId, student1.studentId, 
                       student2.roundId, student2.studentId, studentsById)) {
      // Perform the swap
      const assignment1 = current.find(a => a.roundId === student1.roundId)!
      const assignment2 = current.find(a => a.roundId === student2.roundId)!
      const group1 = assignment1.groups[0]
      const group2 = assignment2.groups[0]
      
      const idx1InGroup = group1.memberIds.indexOf(student1.studentId)
      const idx2InGroup = group2.memberIds.indexOf(student2.studentId)
      
      group1.memberIds[idx1InGroup] = student2.studentId
      group2.memberIds[idx2InGroup] = student1.studentId
      
      const newRepeats = countRepeatedPairings(analyzePairings(current))
      if (newRepeats < bestRepeats) {
        bestResult = current
        bestRepeats = newRepeats
      }
    }
  }
  
  return bestResult
}
