import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@/hooks/useKV'
import { useClasses } from '@/hooks/useClasses'
import { useAnnouncer } from '@/hooks/useAccessibility'
import { useToast } from '@/hooks/useToast'
import { KV_KEYS, Student, Round, Assignment, ClassSettings } from '@/lib/types'
import { generatePlan } from '@/lib/generator'
import { validatePlan, retryRoundPlacement, ValidationResult } from '@/lib/validation'
import { ExportData } from '@/lib/sharing'

export function usePlanGeneration(classId: string) {
  // Data state
  const [students, setStudents] = useKV<Student[]>(KV_KEYS.students(classId), [])
  const [rounds, setRounds] = useKV<Round[]>(KV_KEYS.rounds(classId), [])
  const [assignments, setAssignments] = useKV<Assignment[]>(KV_KEYS.assignments(classId), [])
  const [classes, setClasses] = useClasses()
  const [settings, setSettings] = useKV<ClassSettings>(KV_KEYS.settings(classId), { groupSize: 6 })

  // Generation state
  const [seed, setSeed] = useState<string>(() => Math.random().toString(36).slice(2))
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [validation, setValidation] = useState<ValidationResult | null>(null)

  const announce = useAnnouncer()
  const { success } = useToast()
  const sortedRounds = useMemo(() => [...rounds].sort((a, b) => a.order - b.order), [rounds])
  const currentClass = classes.find(c => c.id === classId)
  const canGenerate = students.length > 0 && sortedRounds.length > 0

  // Validate assignments whenever they change
  useEffect(() => {
    if (assignments.length > 0 && students.length > 0 && sortedRounds.length > 0) {
      const validationResult = validatePlan(assignments, students, sortedRounds)
      setValidation(validationResult)
    } else {
      setValidation(null)
    }
  }, [assignments, students, sortedRounds])

  const runGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setValidation(null)
    announce('מתחיל ליצור תוכנית...')
    
    try {
      const result = generatePlan({ 
        students, 
        rounds: sortedRounds, 
        groupSize: settings.groupSize,
        numGroups: Math.min(sortedRounds.length, Math.floor(students.length / 3))
      }, { seed })
      await setAssignments(result.assignments)
      announce('תוכנית נוצרה בהצלחה!')
      return true
    } catch (e: any) {
      let errorMessage = 'יצירת התוכנית נכשלה'
      
      if (e?.message === 'insufficient-hosts') {
        errorMessage = 'אין מספיק מארחים עבור מספר תאריכי המפגש. עדכן יכולת אירוח או הפחת תאריכי מפגש.'
      }
      
      setError(errorMessage)
      announce(`שגיאה: ${errorMessage}`, 'assertive')
      console.error(e)
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    setError(null)
    announce('מנסה ליצור תוכנית חדשה...')
    
    try {
      const result = await retryRoundPlacement(assignments, students, sortedRounds, seed)
      await setAssignments(result.assignments)
      setSeed(result.seed)
      announce('תוכנית חדשה נוצרה בהצלחה!')
    } catch (e: any) {
      const errorMessage = 'ניסיון התיקון נכשל'
      setError(errorMessage)
      announce(`שגיאה: ${errorMessage}`, 'assertive')
      console.error(e)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleUpdateAssignments = async (newAssignments: Assignment[]) => {
    await setAssignments(newAssignments)
    announce('תוכנית עודכנה')
  }

  const handleImportData = async (importData: ExportData) => {
    try {
      // Update class data if needed
      if (importData.class.id !== classId) {
        const existingClassIndex = classes.findIndex(c => c.id === importData.class.id)
        if (existingClassIndex >= 0) {
          const updatedClasses = [...classes]
          updatedClasses[existingClassIndex] = importData.class
          await setClasses(updatedClasses)
        } else {
          await setClasses([...classes, importData.class])
        }
      }

      // Import students, rounds, and assignments
      await setStudents(importData.students)
      await setRounds(importData.rounds)
      await setAssignments(importData.assignments || [])
      
      // Import settings if available
      if (importData.settings) {
        await setSettings(importData.settings)
      }

      setError(null)
      const successMessage = `הייבוא הושלם בהצלחה! יובאו: ${importData.students.length} תלמידים, ${importData.rounds.length} סבבים, ${importData.assignments?.length || 0} הקצאות`
      success(successMessage)
      announce('נתונים יובאו בהצלחה')
    } catch (e: any) {
      console.error('Import failed:', e)
      const errorMessage = 'הייבוא נכשל: ' + e.message
      setError(errorMessage)
      announce(`שגיאה: ${errorMessage}`, 'assertive')
    }
  }

  const reroll = () => {
    const newSeed = Math.random().toString(36).slice(2)
    setSeed(newSeed)
    announce('Seed חדש נוצר')
  }

  return {
    // Data
    students,
    rounds: sortedRounds,
    assignments,
    currentClass,
    settings,
    
    // Generation state
    seed,
    setSeed,
    error,
    isGenerating,
    isRetrying,
    validation,
    canGenerate,
    
    // Actions
    runGenerate,
    handleRetry,
    handleUpdateAssignments,
    handleImportData,
    reroll
  }
} 