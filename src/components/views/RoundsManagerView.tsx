import { RoundsManager } from '@/components/managers/RoundsManager'
import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'
import { StorageInfo, ClassInfo } from '@/types/common'

interface RoundsManagerViewProps extends StorageInfo {
  classInfo: ClassInfo
}

export function RoundsManagerView({
  classInfo,
  persisted,
  usage,
  quota,
  usagePercent,
  isRequesting,
  onRequestPersistence
}: RoundsManagerViewProps) {
  const manager = RoundsManager({ 
    classId: classInfo.id, 
    className: classInfo.name 
  })
  
  return (
    <>
      <ActionsSidebar
        activeTab="rounds"
        persisted={persisted}
        usage={usage}
        quota={quota}
        usagePercent={usagePercent}
        isRequesting={isRequesting}
        onRequestPersistence={onRequestPersistence}
        roundsActions={{
          addRound: manager.actions.addRound
        }}
      />
      <MainContent
        activeTab="rounds"
        currentClass={classInfo}
        roundsContent={manager.content}
      />
    </>
  )
} 