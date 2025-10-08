import { useState, useEffect } from 'react'
import { useStudents } from '@/hooks/useStudents'
import { useKV } from '@/hooks/useKV'
import { Student, KV_KEYS, DEFAULT_SETTINGS } from '@/lib/types'
import { FormCard } from './FormCard'
import { FormField } from './FormField'
import { FormInput } from './FormInput'
import { FormCheckbox } from './FormCheckbox'
import { FormActions } from './FormActions'
import { StudentPreferences } from './StudentPreferences'
import { useFormSubmit } from './useFormSubmit'

interface StudentFormProps {
  classId: string
  studentId?: string // undefined for new student
  onSave: (studentId: string) => void
  onCancel: () => void
}

export function StudentForm({ classId, studentId, onSave, onCancel }: StudentFormProps) {
  const [students, setStudents] = useStudents(classId)
  const [settings] = useKV(KV_KEYS.settings(classId), DEFAULT_SETTINGS)
  const [formData, setFormData] = useState({
    name: '',
    canHost: true,
    avoid: [] as string[]
  })

  // Load existing student data if editing
  useEffect(() => {
    if (studentId) {
      const existingStudent = students.find(s => s.id === studentId)
      if (existingStudent) {
        setFormData({
          name: existingStudent.name,
          canHost: existingStudent.canHost,
          avoid: existingStudent.avoid
        })
      }
    }
  }, [studentId, students])

  const { handleSubmit, isLoading } = useFormSubmit({
    onSubmit: async (data) => {
      if (studentId) {
        // Edit existing student
        const updatedStudents = students.map(s => 
          s.id === studentId 
            ? { 
                ...s, 
                name: data.name.trim(),
                canHost: data.canHost,
                avoid: data.avoid
              }
            : s
        )
        await setStudents(updatedStudents)
        onSave(studentId)
      } else {
        // Create new student
        const newStudentId = `student_${Date.now()}_${Math.random().toString(36).substring(2)}`
        const newStudent: Student = {
          id: newStudentId,
          classId,
          name: data.name.trim(),
          canHost: data.canHost,
          avoid: data.avoid
        }
        
        const updatedStudents = [...students, newStudent]
        await setStudents(updatedStudents)
        onSave(newStudentId)
      }
    },
    onSuccess: () => {},
    validate: (data) => !data.name.trim() ? 'שם התלמיד הוא שדה חובה' : null
  })

  return (
    <FormCard title={studentId ? 'ערוך תלמיד' : 'הוסף תלמיד חדש'}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData) }} data-cy="student-form" role="form">
        <FormField label="שם התלמיד" required>
          <FormInput
            id="name"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="לדוגמה: יוסי כהן"
            required
            testId="student-name-input"
          />
        </FormField>

        <FormCheckbox
          id="canHost"
          checked={formData.canHost}
          onChange={(checked) => setFormData(prev => ({ ...prev, canHost: checked }))}
          label="יכול לארח"
          testId="student-can-host-checkbox"
        />


        <StudentPreferences
          students={students}
          currentStudentId={studentId}
          avoid={formData.avoid}
          onAvoidChange={(avoid) => setFormData(prev => ({ ...prev, avoid }))}
        />

        <FormActions
          onCancel={onCancel}
          onSubmit={() => handleSubmit(formData)}
          isLoading={isLoading}
        />
      </form>
    </FormCard>
  )
}
