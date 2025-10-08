import { useState, useEffect, useCallback } from 'react'
import { useKV } from './useKV'
import { Student, KV_KEYS } from '@/lib/types'

// Global state for students to enable cross-component updates
const studentsState = new Map<string, {
  students: Student[]
  listeners: Set<() => void>
}>()

/**
 * Hook for managing students with cross-component synchronization
 * @param classId - The class ID
 * @returns [students, setStudents, loading]
 */
export function useStudents(classId: string): [Student[], (students: Student[]) => Promise<void>, boolean] {
  const [students, setStudentsKV, , loading] = useKV<Student[]>(KV_KEYS.students(classId), [])
  const [, forceUpdate] = useState({})

  // Initialize state for this class if not exists
  if (!studentsState.has(classId)) {
    studentsState.set(classId, {
      students: [],
      listeners: new Set()
    })
  }

  const state = studentsState.get(classId)!

  // Update global state when KV state changes
  useEffect(() => {
    // Sort students alphabetically when loading from KV
    const sortedStudents = [...students].sort((a, b) => 
      a.name.localeCompare(b.name, 'he', { sensitivity: 'base' })
    )
    state.students = sortedStudents
    // Notify all listeners
    state.listeners.forEach(listener => listener())
  }, [students, state])

  // Add this component as a listener
  useEffect(() => {
    const listener = () => {
      forceUpdate({})
    }
    state.listeners.add(listener)
    
    return () => {
      state.listeners.delete(listener)
    }
  }, [state])

  // Enhanced setStudents that updates both KV and global state
  const setStudents = useCallback(async (newStudents: Student[]) => {
    // Sort students alphabetically by name
    const sortedStudents = [...newStudents].sort((a, b) => 
      a.name.localeCompare(b.name, 'he', { sensitivity: 'base' })
    )
    
    // Update KV storage
    await setStudentsKV(sortedStudents)
    // Update global state immediately
    state.students = sortedStudents
    // Notify all listeners
    state.listeners.forEach(listener => listener())
  }, [setStudentsKV, state])

  return [state.students, setStudents, loading]
}
