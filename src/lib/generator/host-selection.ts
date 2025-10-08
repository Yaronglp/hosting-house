import { Student } from '../types'

/**
 * Pick unique hosts for a round
 */
export function pickUniqueHosts(students: Student[], numGroups: number, rng: () => number): string[] {
  const hostEligible = students.filter(s => s.canHost)
  if (hostEligible.length < numGroups) {
    throw new Error('insufficient-hosts')
  }
  const pool = [...hostEligible]
  shuffleInPlace(pool, rng)
  return pool.slice(0, numGroups).map(host => host.id)
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
    // Use group size setting for all hosts
    const capacity = (groupSize || 6) + 2
    slots.push({ hostId, capacity, memberIds: [] })
  }
  return slots
}

// Import shuffleInPlace from rng-utils
import { shuffleInPlace } from './rng-utils'
