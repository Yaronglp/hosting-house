import { Student } from '../types'

/**
 * Pick unique hosts for a round, considering avoid preferences
 */
export function pickUniqueHosts(students: Student[], numGroups: number, rng: () => number): string[] {
  const hostEligible = students.filter(s => s.canHost)
  if (hostEligible.length < numGroups) {
    throw new Error('insufficient-hosts')
  }
  
  const studentsById = new Map(students.map(s => [s.id, s]))
  const selectedHosts: string[] = []
  const pool = [...hostEligible]
  shuffleInPlace(pool, rng)
  
  // Try to select hosts that don't avoid each other
  for (const candidate of pool) {
    if (selectedHosts.length >= numGroups) break
    
    // Check if this candidate conflicts with already selected hosts
    const hasConflict = selectedHosts.some(selectedId => {
      const selected = studentsById.get(selectedId)!
      return candidate.avoid.includes(selectedId) || selected.avoid.includes(candidate.id)
    })
    
    if (!hasConflict) {
      selectedHosts.push(candidate.id)
    }
  }
  
  // If we couldn't find enough non-conflicting hosts, fill with remaining hosts
  if (selectedHosts.length < numGroups) {
    const remaining = pool.filter(host => !selectedHosts.includes(host.id))
    const needed = numGroups - selectedHosts.length
    selectedHosts.push(...remaining.slice(0, needed).map(host => host.id))
  }
  
  return selectedHosts
}


/**
 * Build host slots for a round
 */
export function buildHostSlots(
  hostIds: string[], 
  studentsById: Map<string, Student>, 
  groupSize?: number
): Array<{ hostId: string, capacity: number, memberIds: string[] }> {
  const slots: Array<{ hostId: string, capacity: number, memberIds: string[] }> = []
  for (const hostId of hostIds) {
    const host = studentsById.get(hostId)!
    // Use group size setting for all hosts (groupSize = number of guests, +1 for host)
    const capacity = (groupSize || 6) + 1
    slots.push({ hostId, capacity, memberIds: [] })
  }
  return slots
}

// Import shuffleInPlace from rng-utils
import { shuffleInPlace } from './rng-utils'
