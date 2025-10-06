import { useState } from 'react'
import { StudentsTable } from '../lists/StudentsTable'
import { StudentForm } from '../forms/StudentForm'
import { useKV } from '@/hooks/useKV'
import { KV_KEYS, DEFAULT_SETTINGS } from '@/lib/types'

type ViewMode = 'table' | 'form' | 'paste'

interface StudentsManagerProps {
  classId: string
  className: string
  onPasteNames?: () => void
}

export function StudentsManager({ classId, className, onPasteNames }: StudentsManagerProps) {
  const [settings] = useKV(KV_KEYS.settings(classId), DEFAULT_SETTINGS)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [editingStudentId, setEditingStudentId] = useState<string | undefined>()

  const groupSize = settings.groupSize

  const handleStudentAdd = () => {
    setEditingStudentId(undefined)
    setViewMode('form')
  }

  const handleStudentEdit = (studentId: string) => {
    setEditingStudentId(studentId)
    setViewMode('form')
  }

  const handleFormSave = () => {
    setViewMode('table')
  }

  const handleFormCancel = () => {
    setViewMode('table')
  }

  const handlePasteNames = () => {
    if (onPasteNames) {
      onPasteNames()
    }
  }

  // Expose actions for external use
  const actions = {
    addStudent: handleStudentAdd,
    pasteNames: handlePasteNames,
    canAddStudents: true
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'form':
        return (
          <StudentForm
            classId={classId}
            studentId={editingStudentId}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )
      default:
        return (
          <StudentsTable
            classId={classId}
            onStudentEdit={handleStudentEdit}
            onStudentAdd={handleStudentAdd}
            onPasteNames={handlePasteNames}
          />
        )
    }
  }

  return {
    content: renderContent(),
    actions,
    viewMode
  }
}
