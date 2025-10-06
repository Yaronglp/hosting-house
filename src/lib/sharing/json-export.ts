import { Assignment, Student, Round, Class } from '../types'

export interface ExportData {
  version: string
  timestamp: string
  class: Class
  students: Student[]
  rounds: Round[]
  assignments: Assignment[]
  settings?: any
}

/**
 * Export data as JSON
 */
export function exportToJSON(
  classData: Class,
  students: Student[],
  rounds: Round[],
  assignments: Assignment[],
  settings?: any
): string {
  const exportData: ExportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    class: classData,
    students,
    rounds,
    assignments,
    settings
  }
  
  return JSON.stringify(exportData, null, 2)
}

/**
 * Import data from JSON
 */
export function parseImportJSON(jsonString: string): ExportData {
  try {
    const data = JSON.parse(jsonString)
    
    // Basic validation
    if (!data.version || !data.class || !Array.isArray(data.students) || !Array.isArray(data.rounds)) {
      throw new Error('Invalid export format')
    }
    
    return data as ExportData
  } catch (error) {
    throw new Error('Failed to parse JSON: ' + (error as Error).message)
  }
}
