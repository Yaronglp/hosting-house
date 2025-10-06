import { Student } from '../types'

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
 * Calculate like score for a guest in a group
 */
export function likeScore(guestId: string, memberIds: string[], studentsById: Map<string, Student>): number {
  const guest = studentsById.get(guestId)!
  let score = 0
  for (const memberId of memberIds) {
    if (guest.like.includes(memberId)) score += 1
    const member = studentsById.get(memberId)!
    if (member.like.includes(guestId)) score += 1
  }
  return score
}

/**
 * Assign guests to host slots with balanced distribution
 */
export function assignGuestsToSlots(
  guests: Student[],
  hostSlots: Array<{ hostId: string, capacity: number, memberIds: string[] }>,
  studentsById: Map<string, Student>,
  rng: () => number
): boolean {
  const numGroups = hostSlots.length
  const totalGuests = guests.length
  const basePerGroup = Math.floor(totalGuests / numGroups)
  const extraGuests = totalGuests % numGroups
  
  // Create target distribution (e.g., for 7 guests in 3 groups: [3, 2, 2])
  const targetDistribution: number[] = []
  for (let i = 0; i < numGroups; i++) {
    targetDistribution.push(basePerGroup + (i < extraGuests ? 1 : 0))
  }
  
  // Shuffle the target distribution to avoid bias
  shuffleInPlace(targetDistribution, rng)
  
  let guestIndex = 0
  
  // Assign guests with balanced distribution across groups
  for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
    const slot = hostSlots[groupIndex]
    const targetForThisGroup = targetDistribution[groupIndex]
    
    // Try to assign the target number of guests to this group
    for (let i = 0; i < targetForThisGroup && guestIndex < guests.length; i++) {
      let bestGuestIndex = -1
      let bestScore = -Infinity
      
      // Find the best guest for this group
      for (let j = guestIndex; j < guests.length; j++) {
        const guest = guests[j]
        if (violatesAvoid(guest.id, [slot.hostId, ...slot.memberIds], studentsById)) continue
        const score = likeScore(guest.id, [slot.hostId, ...slot.memberIds], studentsById)
        if (score > bestScore) {
          bestScore = score
          bestGuestIndex = j
        }
      }
      
      if (bestGuestIndex === -1) {
        // No valid guest found, try next group
        break
      }
      
      // Assign the best guest to this group
      const assignedGuest = guests[bestGuestIndex]
      slot.memberIds.push(assignedGuest.id)
      
      // Remove assigned guest from the pool
      guests.splice(bestGuestIndex, 1)
    }
  }
  
  // If there are still unassigned guests, try to place them anywhere possible
  if (guests.length > 0) {
    for (const guest of guests) {
      let bestGroupIndex = -1
      let bestScore = -Infinity
      for (let i = 0; i < hostSlots.length; i++) {
        const slot = hostSlots[i]
        if (slot.memberIds.length >= slot.capacity) continue
        if (violatesAvoid(guest.id, [slot.hostId, ...slot.memberIds], studentsById)) continue
        const score = likeScore(guest.id, [slot.hostId, ...slot.memberIds], studentsById)
        if (score > bestScore) {
          bestScore = score
          bestGroupIndex = i
        }
      }
      if (bestGroupIndex === -1) {
        return false // Stuck - cannot place all guests
      }
      hostSlots[bestGroupIndex].memberIds.push(guest.id)
    }
  }
  
  return true // Successfully assigned all guests
}

// Import shuffleInPlace from rng-utils
import { shuffleInPlace } from './rng-utils'
