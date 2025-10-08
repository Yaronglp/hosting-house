// KV Keys for data storage
export const KV_KEYS = {
  // Global data
  CLASSES: 'classes',
  
  // Per-class data (use with classId)
  students: (classId: string) => `students:${classId}`,
  rounds: (classId: string) => `rounds:${classId}`,
  assignments: (classId: string) => `assignments:${classId}`,
  settings: (classId: string) => `settings:${classId}`,
} as const

// Data types
export interface Class {
  id: string
  name: string
  year?: string
  createdAt: Date
  updatedAt: Date
}

export interface Student {
  id: string
  classId: string
  name: string
  canHost: boolean
  avoid: string[] // Student IDs
}

export interface Round {
  id: string
  classId: string
  name: string
  dateWindow?: {
    start: Date
    end: Date
  }
  order: number
}

export interface Group {
  id: string
  roundId: string
  hostId: string
  memberIds: string[]
  notes?: string
}

export interface Assignment {
  roundId: string
  groups: Group[]
}

export interface ClassSettings {
  groupSize: number
}

// Default values
export const DEFAULT_SETTINGS: ClassSettings = {
  groupSize: 6,
}

