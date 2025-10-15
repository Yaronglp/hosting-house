import { Student } from '../types'

/**
 * Performance-optimized avoid checking with pre-computed maps
 */
class AvoidChecker {
  private avoidMap: Map<string, Set<string>> = new Map()
  
  constructor(studentsById: Map<string, Student>) {
    this.buildAvoidMap(studentsById)
  }
  
  private buildAvoidMap(studentsById: Map<string, Student>) {
    for (const [id, student] of studentsById) {
      this.avoidMap.set(id, new Set(student.avoid))
    }
  }
  
  /**
   * Fast O(1) avoid checking using pre-computed maps
   */
  violatesAvoid(guestId: string, memberIds: string[]): boolean {
    const guestAvoids = this.avoidMap.get(guestId)
    if (!guestAvoids) return false
    
    // Check if guest avoids any member
    for (const memberId of memberIds) {
      if (guestAvoids.has(memberId)) return true
      
      // Check if member avoids guest
      const memberAvoids = this.avoidMap.get(memberId)
      if (memberAvoids?.has(guestId)) return true
    }
    
    return false
  }
}

/**
 * Validate that no student appears multiple times in the same group
 */
export function validateNoDuplicates(hostSlots: Array<{ hostId: string, capacity: number, memberIds: string[] }>): boolean {
  const allHostIds = new Set(hostSlots.map(slot => slot.hostId))
  
  for (const slot of hostSlots) {
    const allIds = [slot.hostId, ...slot.memberIds]
    const uniqueIds = new Set(allIds)
    
    // Check for duplicates within the group
    if (uniqueIds.size !== allIds.length) {
      console.error('Duplicate student found in group:', {
        hostId: slot.hostId,
        memberIds: slot.memberIds,
        allIds
      })
      return false
    }
    
    // Check if host is assigned as guest in their own group
    if (slot.memberIds.includes(slot.hostId)) {
      console.error('Host assigned as guest in their own group:', {
        hostId: slot.hostId,
        memberIds: slot.memberIds
      })
      return false
    }
    
    // Check if any guest is a host in another group
    for (const memberId of slot.memberIds) {
      if (allHostIds.has(memberId)) {
        console.error('Host assigned as guest in different group:', {
          guestId: memberId,
          hostId: slot.hostId,
          memberIds: slot.memberIds
        })
        return false
      }
    }
  }
  return true
}

/**
 * Check if a guest violates avoid constraints
 */
export function violatesAvoid(guestId: string, memberIds: string[], studentsById: Map<string, Student>): boolean {
  const guest = studentsById.get(guestId)!
  for (const memberId of memberIds) {
    if (guest.avoid.includes(memberId)) return true
    const member = studentsById.get(memberId)!
    if (member.avoid.includes(guestId)) return true
  }
  return false
}


/**
 * Calculate balanced distribution of guests across groups
 */
function calculateTargetDistribution(totalGuests: number, numGroups: number): number[] {
  const basePerGroup = Math.floor(totalGuests / numGroups)
  const extraGuests = totalGuests % numGroups
  
  const distribution: number[] = []
  for (let i = 0; i < numGroups; i++) {
    distribution.push(basePerGroup + (i < extraGuests ? 1 : 0))
  }
  
  return distribution
}

/**
 * Find the first valid guest for a group (optimized)
 */
function findValidGuest(
  guests: Student[],
  slot: { hostId: string, memberIds: string[] },
  allHostIds: Set<string>,
  avoidChecker: AvoidChecker
): number {
  for (let j = 0; j < guests.length; j++) {
    const guest = guests[j]
    // Skip if guest is a host in any group
    if (allHostIds.has(guest.id)) continue
    if (avoidChecker.violatesAvoid(guest.id, [slot.hostId, ...slot.memberIds])) continue
    return j
  }
  return -1
}

/**
 * Assign guests to a specific group (optimized)
 */
function assignGuestsToGroup(
  guests: Student[],
  slot: { hostId: string, memberIds: string[] },
  targetCount: number,
  allHostIds: Set<string>,
  avoidChecker: AvoidChecker
): boolean {
  for (let i = 0; i < targetCount && guests.length > 0; i++) {
    const guestIndex = findValidGuest(guests, slot, allHostIds, avoidChecker)
    
    if (guestIndex === -1) {
      // No valid guest found, try next group
      break
    }
    
    const assignedGuest = guests[guestIndex]
    
    // Check for duplicate assignment
    if (slot.memberIds.includes(assignedGuest.id)) {
      console.error('Attempting to assign duplicate guest:', assignedGuest.name, 'to group with host:', slot.hostId)
      return false
    }
    
    slot.memberIds.push(assignedGuest.id)
    guests.splice(guestIndex, 1)
  }
  
  return true
}

/**
 * Assign guests with balanced distribution across groups (optimized)
 */
function assignGuestsBalanced(
  guests: Student[],
  hostSlots: Array<{ hostId: string, capacity: number, memberIds: string[] }>,
  allHostIds: Set<string>,
  avoidChecker: AvoidChecker,
  rng: () => number
): boolean {
  const numGroups = hostSlots.length
  const totalGuests = guests.length
  const targetDistribution = calculateTargetDistribution(totalGuests, numGroups)
  
  // Shuffle the target distribution to avoid bias
  shuffleInPlace(targetDistribution, rng)
  
  // Assign guests with balanced distribution across groups
  for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
    const slot = hostSlots[groupIndex]
    const targetForThisGroup = targetDistribution[groupIndex]
    
    const success = assignGuestsToGroup(guests, slot, targetForThisGroup, allHostIds, avoidChecker)
    if (!success) return false
  }
  
  return true
}

/**
 * Fallback strategies for placing remaining guests (optimized)
 */
function assignRemainingGuests(
  guests: Student[],
  hostSlots: Array<{ hostId: string, capacity: number, memberIds: string[] }>,
  allHostIds: Set<string>,
  avoidChecker: AvoidChecker
): boolean {
  // Try multiple strategies to place remaining guests
  const strategies = [
    // Strategy 1: Try to place in groups with most space
    (guest: Student) => {
      let bestGroupIndex = -1
      let maxSpace = -1
      for (let i = 0; i < hostSlots.length; i++) {
        const slot = hostSlots[i]
        const space = slot.capacity - slot.memberIds.length
        if (space > maxSpace && !avoidChecker.violatesAvoid(guest.id, [slot.hostId, ...slot.memberIds])) {
          maxSpace = space
          bestGroupIndex = i
        }
      }
      return bestGroupIndex
    },
    // Strategy 2: Try to place in any available group
    (guest: Student) => {
      for (let i = 0; i < hostSlots.length; i++) {
        const slot = hostSlots[i]
        if (slot.memberIds.length < slot.capacity && !avoidChecker.violatesAvoid(guest.id, [slot.hostId, ...slot.memberIds])) {
          return i
        }
      }
      return -1
    },
    // Strategy 3: Force placement (ignore avoid preferences as last resort)
    (guest: Student) => {
      for (let i = 0; i < hostSlots.length; i++) {
        const slot = hostSlots[i]
        if (slot.memberIds.length < slot.capacity) {
          return i
        }
      }
      return -1
    }
  ]
  
  for (const guest of guests) {
    // Skip if guest is a host in any group
    if (allHostIds.has(guest.id)) continue
    
    let bestGroupIndex = -1
    
    // Try each strategy in order
    for (const strategy of strategies) {
      bestGroupIndex = strategy(guest)
      if (bestGroupIndex !== -1) break
    }
    
    if (bestGroupIndex === -1) {
      console.warn(`Could not place guest ${guest.name} in any group, but continuing...`)
      continue // Skip this guest rather than failing completely
    }
    
    // Check for duplicate assignment
    if (hostSlots[bestGroupIndex].memberIds.includes(guest.id)) {
      console.error('Attempting to assign duplicate guest in fallback:', guest.name, 'to group with host:', hostSlots[bestGroupIndex].hostId)
      continue // Skip this guest
    }
    
    hostSlots[bestGroupIndex].memberIds.push(guest.id)
  }
  
  return true
}

/**
 * Assign guests to host slots with balanced distribution (optimized)
 */
export function assignGuestsToSlots(
  guests: Student[],
  hostSlots: Array<{ hostId: string, capacity: number, memberIds: string[] }>,
  studentsById: Map<string, Student>,
  rng: () => number
): boolean {
  // Get all host IDs to prevent hosts from being assigned as guests
  const allHostIds = new Set(hostSlots.map(slot => slot.hostId))
  
  // Create optimized avoid checker
  const avoidChecker = new AvoidChecker(studentsById)
  
  // Try balanced assignment first
  const balancedSuccess = assignGuestsBalanced(guests, hostSlots, allHostIds, avoidChecker, rng)
  if (balancedSuccess && guests.length === 0) {
    return true
  }
  
  // If there are still unassigned guests, try fallback strategies
  if (guests.length > 0) {
    return assignRemainingGuests(guests, hostSlots, allHostIds, avoidChecker)
  }
  
  // Validate no duplicates were created
  if (!validateNoDuplicates(hostSlots)) {
    console.error('Duplicate students detected in group assignment')
    return false
  }
  
  return true // Successfully assigned all guests
}

// Import shuffleInPlace from rng-utils
import { shuffleInPlace } from './rng-utils'
