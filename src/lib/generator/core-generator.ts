import { Assignment, Group, Round, Student } from '../types'
import { GenerateInput, GenerateOptions, GenerateResult } from './types'
import { mulberry32, hashSeed, shuffleInPlace } from './rng-utils'
import { pickUniqueHosts, buildHostSlots } from './host-selection'
import { assignGuestsToSlots } from './guest-assignment'
import { performFairnessPass } from './fairness-pass'

/**
 * Main plan generation function
 */
export function generatePlan(input: GenerateInput, options: GenerateOptions): GenerateResult {
  const rng = mulberry32(hashSeed(options.seed))
  const studentsById = new Map<string, Student>(input.students.map(s => [s.id, s]))
  const rounds = [...input.rounds].sort((a, b) => a.order - b.order)

  // Determine number of groups to create per round
  const numGroups = input.numGroups || Math.min(rounds.length, Math.floor(input.students.length / 3))
  
  // Track used hosts across all rounds
  const usedHosts = new Set<string>()
  const assignments: Assignment[] = []

  // Generate plan for each round
  for (const round of rounds) {
    // Get available hosts (those who haven't hosted yet)
    const availableHosts = input.students.filter(s => s.canHost && !usedHosts.has(s.id))
    
    if (availableHosts.length < numGroups) {
      throw new Error('insufficient-hosts')
    }

    // Pick unique hosts for this round
    const hostIds = pickUniqueHosts(availableHosts, numGroups, rng)
    const hostSlots = buildHostSlots(hostIds, studentsById, input.groupSize)

    // Mark these hosts as used
    hostIds.forEach(hostId => usedHosts.add(hostId))

    // Get all non-host students as guests for this round
    const nonHosts = input.students.filter(s => !hostIds.includes(s.id))
    const guests = [...nonHosts]
    shuffleInPlace(guests, rng)

    const maxRetries = 100
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Reset all slots
      for (const slot of hostSlots) slot.memberIds = []

      // Try to assign guests
      const success = assignGuestsToSlots(guests, hostSlots, studentsById, rng)
      
      if (success) break
      
      // Reset guests for next attempt
      const nonHosts = input.students.filter(s => !hostIds.includes(s.id))
      guests.splice(0, guests.length, ...nonHosts)
      shuffleInPlace(guests, rng)
    }

    // Create groups for this round
    const groups: Group[] = hostSlots.map((slot, index) => ({
      id: `group_${round.id}_${slot.hostId}_${index}`,
      roundId: round.id,
      hostId: slot.hostId,
      memberIds: [...slot.memberIds],
    }))

    assignments.push({
      roundId: round.id,
      groups: groups
    })
  }

  // Apply fairness pass to reduce repeated pairings across all rounds
  const finalAssignments = performFairnessPass(assignments, studentsById, rng)

  return { assignments: finalAssignments, seed: options.seed }
}
