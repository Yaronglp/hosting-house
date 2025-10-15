import { Assignment, Group, Round, Student } from '../types'
import { GenerateInput, GenerateOptions, GenerateResult } from './types'
import { mulberry32, hashSeed, shuffleInPlace } from './rng-utils'
import { pickUniqueHosts, buildHostSlots } from './host-selection'
import { assignGuestsToSlots } from './guest-assignment'
import { performFairnessPass } from './fairness-pass'

/**
 * Generate plan for a single round
 */
function generateRoundPlan(
  round: Round,
  input: GenerateInput,
  studentsById: Map<string, Student>,
  usedHosts: Set<string>,
  numGroups: number,
  rng: () => number
): Assignment {
  // Get available hosts (those who haven't hosted yet)
  const availableHosts = input.students.filter(s => s.canHost && !usedHosts.has(s.id))
  
  if (availableHosts.length < numGroups) {
    throw new Error('insufficient-hosts')
  }

  // Pick unique hosts for this round
  const hostIds = pickUniqueHosts(availableHosts, numGroups, rng)
  let hostSlots = buildHostSlots(hostIds, studentsById, input.groupSize)

  // Mark these hosts as used
  hostIds.forEach(hostId => usedHosts.add(hostId))

  // Get all non-host students as guests for this round
  const nonHosts = input.students.filter(s => !hostIds.includes(s.id))
  const guests = [...nonHosts]
  shuffleInPlace(guests, rng)
  
  // Clean guest list to remove any hosts
  const hostIdsSet = new Set(hostIds)
  const validGuests = guests.filter(g => !hostIdsSet.has(g.id))
  guests.splice(0, guests.length, ...validGuests)

  // Try to assign guests with retry logic
  const assignmentSuccess = tryAssignGuestsWithRetry(
    guests, 
    hostSlots, 
    studentsById, 
    input, 
    usedHosts, 
    numGroups, 
    rng
  )

  if (!assignmentSuccess) {
    throw new Error('avoid-preferences-conflict')
  }

  // Create groups for this round
  const groups: Group[] = hostSlots.map((slot, index) => ({
    id: `group_${round.id}_${slot.hostId}_${index}`,
    roundId: round.id,
    hostId: slot.hostId,
    memberIds: [...slot.memberIds],
  }))

  return {
    roundId: round.id,
    groups: groups
  }
}

/**
 * Try to assign guests with retry logic and host selection changes
 */
function tryAssignGuestsWithRetry(
  guests: Student[],
  hostSlots: Array<{ hostId: string, capacity: number, memberIds: string[] }>,
  studentsById: Map<string, Student>,
  input: GenerateInput,
  usedHosts: Set<string>,
  numGroups: number,
  rng: () => number
): boolean {
  const maxRetries = 200
  let hostIds = hostSlots.map(slot => slot.hostId)
  let hostIdsSet = new Set(hostIds)
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Reset all slots
    for (const slot of hostSlots) slot.memberIds = []

    // Try to assign guests
    const success = assignGuestsToSlots(guests, hostSlots, studentsById, rng)
    
    if (success) {
      return true
    }
    
    // Reset guests for next attempt
    const nonHosts = input.students.filter(s => !hostIds.includes(s.id))
    guests.splice(0, guests.length, ...nonHosts)
    shuffleInPlace(guests, rng)
    
    // Clean guest list
    const validGuests = guests.filter(g => !hostIdsSet.has(g.id))
    guests.splice(0, guests.length, ...validGuests)
    
    // Try different host selection if we're having trouble
    if (attempt > 50 && attempt % 25 === 0) {
      const newHostIds = tryRetryHostSelection(input, usedHosts, numGroups, rng)
      if (newHostIds.length === numGroups) {
        // Update host selection
        hostIds = newHostIds
        hostSlots = buildHostSlots(hostIds, studentsById, input.groupSize)
        hostIdsSet.clear()
        hostIds.forEach(id => hostIdsSet.add(id))
        usedHosts.delete(hostIds[0])
        if (hostIds.length > 1) usedHosts.delete(hostIds[1])
      }
    }
  }
  
  return false
}

/**
 * Try to retry host selection when assignment is failing
 */
function tryRetryHostSelection(
  input: GenerateInput,
  usedHosts: Set<string>,
  numGroups: number,
  rng: () => number
): string[] {
  try {
    return pickUniqueHosts(
      input.students.filter(s => s.canHost && !usedHosts.has(s.id)), 
      numGroups, 
      rng
    )
  } catch (e) {
    console.warn('Failed to retry host selection:', e)
    return []
  }
}

/**
 * Main plan generation function (refactored for better maintainability)
 */
export function generatePlan(input: GenerateInput, options: GenerateOptions): GenerateResult {
  const rng = mulberry32(hashSeed(options.seed))
  const studentsById = new Map<string, Student>(input.students.map(s => [s.id, s]))
  const rounds = [...input.rounds].sort((a, b) => a.order - b.order)

  // Determine number of groups to create per round
  const groupSize = input.groupSize || 6
  const numGroups = input.numGroups || Math.ceil(input.students.length / groupSize)
  
  // Track used hosts across all rounds
  const usedHosts = new Set<string>()
  const assignments: Assignment[] = []

  // Generate plan for each round
  for (const round of rounds) {
    const assignment = generateRoundPlan(
      round, 
      input, 
      studentsById, 
      usedHosts, 
      numGroups, 
      rng
    )
    assignments.push(assignment)
  }

  // Apply fairness pass to reduce repeated pairings across all rounds
  const finalAssignments = performFairnessPass(assignments, studentsById, rng)

  return { assignments: finalAssignments, seed: options.seed }
}
