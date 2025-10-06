import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/useKV'
import { Class, KV_KEYS } from '@/lib/types'
import { FormCard } from './FormCard'
import { FormField } from './FormField'
import { FormInput } from './FormInput'
import { FormActions } from './FormActions'
import { useFormSubmit } from './useFormSubmit'

interface ClassFormProps {
  classId?: string // undefined for new class
  onSave: (classId: string) => void
  onCancel: () => void
}

export function ClassForm({ classId, onSave, onCancel }: ClassFormProps) {
  const [classes, setClasses] = useKV<Class[]>(KV_KEYS.CLASSES, [])
  const [formData, setFormData] = useState({
    name: '',
    year: '',
  })

  // Load existing class data if editing
  useEffect(() => {
    if (classId) {
      const existingClass = classes.find(c => c.id === classId)
      if (existingClass) {
        setFormData({
          name: existingClass.name,
          year: existingClass.year || '',
        })
      }
    }
  }, [classId, classes])

  const { handleSubmit, isLoading } = useFormSubmit({
    onSubmit: async (data) => {
      const now = new Date()
      
      if (classId) {
        // Edit existing class
        const updatedClasses = classes.map(c => 
          c.id === classId 
            ? { 
                ...c, 
                name: data.name.trim(),
                year: data.year.trim() || undefined,
                updatedAt: now 
              }
            : c
        )
        await setClasses(updatedClasses)
        onSave(classId)
      } else {
        // Create new class
        const newClassId = `class_${Date.now()}_${Math.random().toString(36).substring(2)}`
        const newClass: Class = {
          id: newClassId,
          name: data.name.trim(),
          year: data.year.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        }
        
        const updatedClasses = [...classes, newClass]
        await setClasses(updatedClasses)
        onSave(newClassId)
      }
    },
    onSuccess: () => {},
    validate: (data) => !data.name.trim() ? 'שם הכיתה הוא שדה חובה' : null
  })

  return (
    <FormCard title={classId ? 'ערוך כיתה' : 'הוסף כיתה חדשה'}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData) }} data-cy="class-form">
        <FormField label="שם הכיתה" required>
          <FormInput
            id="name"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="לדוגמה: כיתה ה׳1"
            required
            data-cy="class-name-input"
          />
        </FormField>

        <FormField label="שנת לימודים">
          <FormInput
            id="year"
            value={formData.year}
            onChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
            placeholder="לדוגמה: תשפ״ה"
            className="max-w-xs"
            data-cy="class-year-input"
          />
        </FormField>

        <FormActions
          onCancel={onCancel}
          onSubmit={() => handleSubmit(formData)}
          isLoading={isLoading}
        />
      </form>
    </FormCard>
  )
}
