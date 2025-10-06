import { StudentsManager } from '@/components/managers/StudentsManager'
import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'
import { StorageInfo, ClassInfo } from '@/types/common'

interface StudentsManagerViewProps extends StorageInfo {
  classInfo: ClassInfo
  onPasteModalOpen?: () => void
}

export function StudentsManagerView({
  classInfo,
  persisted,
  usage,
  quota,
  usagePercent,
  isRequesting,
  onRequestPersistence,
  onPasteModalOpen
}: StudentsManagerViewProps) {
  const manager = StudentsManager({ 
    classId: classInfo.id, 
    className: classInfo.name,
    onPasteNames: onPasteModalOpen
  })
  
  return (
    <>
      <ActionsSidebar
        activeTab="students"
        persisted={persisted}
        usage={usage}
        quota={quota}
        usagePercent={usagePercent}
        isRequesting={isRequesting}
        onRequestPersistence={onRequestPersistence}
        studentsActions={{
          addStudent: manager.actions.addStudent,
          pasteNames: onPasteModalOpen || manager.actions.pasteNames
        }}
      />
      <MainContent
        activeTab="students"
        currentClass={classInfo}
        studentsContent={manager.content}
      />
    </>
  )
} 