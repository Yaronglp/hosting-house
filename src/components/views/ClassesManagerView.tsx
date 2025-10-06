import { ClassesManager } from '@/components/managers/ClassesManager'
import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'
import { StorageInfo } from '@/types/common'

interface ClassesManagerViewProps extends StorageInfo {
  currentClassId: string | null
  onClassSelect: (classId: string) => void
}

export function ClassesManagerView({ 
  currentClassId, 
  onClassSelect,
  persisted,
  usage,
  quota,
  usagePercent,
  isRequesting,
  onRequestPersistence
}: ClassesManagerViewProps) {
  const manager = ClassesManager({ currentClassId, onClassSelect })
  
  return (
    <>
      <ActionsSidebar
        activeTab="classes"
        persisted={persisted}
        usage={usage}
        quota={quota}
        usagePercent={usagePercent}
        isRequesting={isRequesting}
        onRequestPersistence={onRequestPersistence}
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