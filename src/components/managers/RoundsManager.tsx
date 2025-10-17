import { useState } from 'react'
import { RoundsList } from '../lists/RoundsList'
import { RoundForm } from '../forms/RoundForm'

type ViewMode = 'list' | 'form'

interface RoundsManagerProps {
  classId: string
  onRoundAdded?: () => void
  onRoundUpdated?: () => void
}

export function RoundsManager({ classId, onRoundAdded, onRoundUpdated }: RoundsManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingRoundId, setEditingRoundId] = useState<string | undefined>()

  const handleRoundAdd = () => {
    setEditingRoundId(undefined)
    setViewMode('form')
  }

  const handleRoundEdit = (roundId: string) => {
    setEditingRoundId(roundId)
    setViewMode('form')
  }

  const handleFormSave = () => {
    setViewMode('list')
  }

  const handleFormCancel = () => {
    setViewMode('list')
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'form':
        return (
          <RoundForm
            classId={classId}
            roundId={editingRoundId}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            onRoundAdded={onRoundAdded}
            onRoundUpdated={onRoundUpdated}
          />
        )
      default:
        return (
          <RoundsList
            classId={classId}
            onRoundEdit={handleRoundEdit}
            onRoundAdd={handleRoundAdd}
          />
        )
    }
  }

  return {
    content: renderContent()
  }
}
