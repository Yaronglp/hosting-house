import { PlanManager } from '@/components/managers/PlanManager'
import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'
import { StorageInfo, ClassInfo } from '@/types/common'

interface PlanViewProps extends StorageInfo {
  classInfo: ClassInfo
}

export function PlanView({
  classInfo,
  persisted,
  usage,
  quota,
  usagePercent,
  isRequesting,
  onRequestPersistence
}: PlanViewProps) {
  return (
    <>
      <ActionsSidebar
        activeTab="plan"
        persisted={persisted}
        usage={usage}
        quota={quota}
        usagePercent={usagePercent}
        isRequesting={isRequesting}
        onRequestPersistence={onRequestPersistence}
      />
      <MainContent
        activeTab="plan"
        currentClass={classInfo}
        planContent={<PlanManager classId={classInfo.id} />}
      />
    </>
  )
} 