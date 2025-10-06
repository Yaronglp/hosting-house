import { useState } from 'react'
import { ClassesList } from '../lists/ClassesList'
import { ClassForm } from '../forms/ClassForm'
import { ClassSettings } from '../common/ClassSettings'
import { useKV } from '@/hooks/useKV'
import { Class, KV_KEYS } from '@/lib/types'

type ViewMode = 'list' | 'form' | 'settings'

interface ClassesManagerProps {
  currentClassId: string | null
  onClassSelect: (classId: string) => void
}

export function ClassesManager({ currentClassId, onClassSelect }: ClassesManagerProps) {
  const [classes] = useKV<Class[]>(KV_KEYS.CLASSES, [])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingClassId, setEditingClassId] = useState<string | undefined>()

  const currentClass = currentClassId ? classes.find(c => c.id === currentClassId) : null

  const handleClassAdd = () => {
    setEditingClassId(undefined)
    setViewMode('form')
  }

  const handleClassEdit = (classId: string) => {
    setEditingClassId(classId)
    setViewMode('form')
  }

  const handleFormSave = (classId: string) => {
    onClassSelect(classId)
    setViewMode('list')
  }

  const handleFormCancel = () => {
    setViewMode('list')
  }

  const handleSettingsOpen = () => {
    if (currentClassId) {
      setViewMode('settings')
    }
  }

  const handleSettingsClose = () => {
    setViewMode('list')
  }

  // Expose these functions for external use (like from App sidebar)
  const actions = {
    openSettings: handleSettingsOpen,
    addClass: handleClassAdd,
    canOpenSettings: !!currentClass
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'form':
        return (
          <ClassForm
            classId={editingClassId}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )
      case 'settings':
        return currentClass ? (
          <ClassSettings
            classId={currentClass.id}
            className={currentClass.name}
            onClose={handleSettingsClose}
          />
        ) : null
      default:
        return (
          <ClassesList
            currentClassId={currentClassId}
            onClassSelect={onClassSelect}
            onClassEdit={handleClassEdit}
            onClassAdd={handleClassAdd}
          />
        )
    }
  }

  return {
    content: renderContent(),
    actions,
    viewMode,
    currentClass
  }
}
