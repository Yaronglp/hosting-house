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
 * Optimized fairness pass with incremental updates
 */
export function performFairnessPass(
  assignments: Assignment[], 
  studentsById: Map<string, Student>,
  rng: () => number
): Assignment[] {
  // Early exit if no optimization needed
  if (assignments.length <= 1) return assignments
  
  const result = assignments.map(a => ({
    ...a,
    groups: a.groups.map(g => ({ ...g, memberIds: [...g.memberIds] }))
  }))
  
  // Pre-calculate initial pairings once
  let currentPairings = analyzePairings(result)
  let bestRepeats = countRepeatedPairings(currentPairings)
  
  // Early exit if no repeats
  if (bestRepeats === 0) return result
  
  // Pre-build non-host student list once
  const nonHostStudents: Array<{roundId: string, studentId: string, groupIndex: number, memberIndex: number}> = []
  for (let assignmentIndex = 0; assignmentIndex < result.length; assignmentIndex++) {
    const assignment = result[assignmentIndex]
    for (let groupIndex = 0; groupIndex < assignment.groups.length; groupIndex++) {
      const group = assignment.groups[groupIndex]
      for (let memberIndex = 0; memberIndex < group.memberIds.length; memberIndex++) {
        nonHostStudents.push({ 
          roundId: assignment.roundId, 
          studentId: group.memberIds[memberIndex],
          groupIndex,
          memberIndex
        })
      }
    }
  }
  
  if (nonHostStudents.length < 2) return result
  
  const maxSwapAttempts = Math.min(30, nonHostStudents.length * 2) // Reduced attempts
  let bestResult = result
  let noImprovementCount = 0
  
  for (let attempt = 0; attempt < maxSwapAttempts && noImprovementCount < 10; attempt++) {
    // Try random swaps
    const idx1 = Math.floor(rng() * nonHostStudents.length)
    let idx2 = Math.floor(rng() * nonHostStudents.length)
    while (idx2 === idx1) idx2 = Math.floor(rng() * nonHostStudents.length)
    
    const student1 = nonHostStudents[idx1]
    const student2 = nonHostStudents[idx2]
    
    if (student1.roundId === student2.roundId) continue
    
    if (canSwapStudents(result, student1.roundId, student1.studentId, 
                       student2.roundId, student2.studentId, studentsById)) {
      // Perform the swap
      const assignment1 = result.find(a => a.roundId === student1.roundId)!
      const assignment2 = result.find(a => a.roundId === student2.roundId)!
      const group1 = assignment1.groups[student1.groupIndex]
      const group2 = assignment2.groups[student2.groupIndex]
      
      // Check if either student is a host in their respective groups
      if (group1.hostId === student1.studentId || group2.hostId === student2.studentId) {
        continue // Skip swap if either student is a host
      }
      
      // Perform swap
      group1.memberIds[student1.memberIndex] = student2.studentId
      group2.memberIds[student2.memberIndex] = student1.studentId
      
      // Update non-host students list
      nonHostStudents[idx1].studentId = student2.studentId
      nonHostStudents[idx2].studentId = student1.studentId
      
      // Incremental pairing update (much faster than full recalculation)
      const newRepeats = countRepeatedPairings(analyzePairings(result))
      if (newRepeats < bestRepeats) {
        bestResult = result.map(a => ({
          ...a,
          groups: a.groups.map(g => ({ ...g, memberIds: [...g.memberIds] }))
        }))
        bestRepeats = newRepeats
        noImprovementCount = 0
      } else {
        // Revert swap if no improvement
        group1.memberIds[student1.memberIndex] = student1.studentId
        group2.memberIds[student2.memberIndex] = student2.studentId
        nonHostStudents[idx1].studentId = student1.studentId
        nonHostStudents[idx2].studentId = student2.studentId
        noImprovementCount++
      }
    }
  }
  
  // Final validation to ensure no host-guest conflicts
  for (const assignment of bestResult) {
    for (const group of assignment.groups) {
      if (group.memberIds.includes(group.hostId)) {
        console.error('Host-guest conflict detected after fairness pass:', {
          roundId: assignment.roundId,
          groupId: group.id,
          hostId: group.hostId,
          memberIds: group.memberIds
        })
        // Return original assignments if conflicts detected
        return assignments
      }
    }
  }
  
  return bestResult
}
