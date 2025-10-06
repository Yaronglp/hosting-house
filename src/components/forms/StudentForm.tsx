import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/useKV'
import { Student, KV_KEYS, DEFAULT_STUDENT_CAPACITY, DEFAULT_SETTINGS } from '@/lib/types'
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
  const [students, setStudents] = useKV<Student[]>(KV_KEYS.students(classId), [])
  const [settings] = useKV(KV_KEYS.settings(classId), DEFAULT_SETTINGS)
  const [formData, setFormData] = useState({
    name: '',
    canHost: true,
    capacity: DEFAULT_STUDENT_CAPACITY(settings.groupSize),
    like: [] as string[],
    avoid: [] as string[]
  })
  const [capacityInput, setCapacityInput] = useState(DEFAULT_STUDENT_CAPACITY(settings.groupSize).toString())

  // Load existing student data if editing
  useEffect(() => {
    if (studentId) {
      const existingStudent = students.find(s => s.id === studentId)
      if (existingStudent) {
        setFormData({
          name: existingStudent.name,
          canHost: existingStudent.canHost,
          capacity: existingStudent.capacity,
          like: existingStudent.like,
          avoid: existingStudent.avoid
        })
        setCapacityInput(existingStudent.capacity.toString())
      }
    } else {
      // For new students, use current settings
      const defaultCapacity = DEFAULT_STUDENT_CAPACITY(settings.groupSize)
      setFormData(prev => ({
        ...prev,
        capacity: defaultCapacity
      }))
      setCapacityInput(defaultCapacity.toString())
    }
  }, [studentId, students, settings.groupSize])

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
                capacity: data.capacity,
                like: data.like,
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
          capacity: data.capacity,
          like: data.like,
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

        <FormField label="קיבולת">
          <FormInput
            id="capacity"
            type="number"
            value={capacityInput}
            onChange={(value) => {
              setCapacityInput(value)
              const numValue = parseInt(value)
              if (!isNaN(numValue) && numValue > 0) {
                setFormData(prev => ({ 
                  ...prev, 
                  capacity: numValue
                }))
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '' || parseInt(e.target.value) <= 0) {
                setCapacityInput('1')
                setFormData(prev => ({ 
                  ...prev, 
                  capacity: 1 
                }))
              }
            }}
            className="w-24 text-center"
            testId="student-capacity-input"
          />
        </FormField>

        <StudentPreferences
          students={students}
          currentStudentId={studentId}
          like={formData.like}
          avoid={formData.avoid}
          onLikeChange={(like) => setFormData(prev => ({ ...prev, like }))}
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
