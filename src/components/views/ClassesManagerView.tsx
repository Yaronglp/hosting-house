import { ClassesManager } from '@/components/managers/ClassesManager'
import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'

interface ClassesManagerViewProps {
  currentClassId: string | null
  onClassSelect: (classId: string) => void
}

export function ClassesManagerView({ 
  currentClassId, 
  onClassSelect
}: ClassesManagerViewProps) {
  const manager = ClassesManager({ currentClassId, onClassSelect })
  
  return (
    <>
      <ActionsSidebar
        activeTab="classes"
        classesActions={{
          addClass: manager.actions.addClass,
          canOpenSettings: manager.actions.canOpenSettings,
          openSettings: manager.actions.openSettings
        }}
      />
      <MainContent
        activeTab="classes"
        currentClass={manager.currentClass}
        classesContent={manager.content}
      />
    </>
  )
} 