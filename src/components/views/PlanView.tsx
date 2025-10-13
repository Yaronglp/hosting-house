import { memo } from 'react'
import { PlanManager } from '@/components/managers/PlanManager'
import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'
import { ClassInfo } from '@/types/common'

interface PlanViewProps {
  classInfo: ClassInfo
}

const MemoizedPlanManager = memo(PlanManager)

export function PlanView({
  classInfo
}: PlanViewProps) {
  return (
    <>
      <ActionsSidebar
        activeTab="plan"
      />
      <MainContent
        activeTab="plan"
        currentClass={classInfo}
        planContent={<MemoizedPlanManager classId={classInfo.id} />}
      />
    </>
  )
} 