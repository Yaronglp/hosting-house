import { Student, Round, Assignment } from '../types'

export interface GenerateOptions {
  seed: string
}

export interface GenerateInput {
  students: Student[]
  rounds: Round[]
  groupSize?: number // Optional group size setting
  numGroups?: number // Number of groups to create in the first round
}

export interface GenerateResult {
  assignments: Assignment[]
  seed: string
}
