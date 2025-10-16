import { memo } from 'react'
import { PlanManager } from '@/components/managers/PlanManager'
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
    <MainContent
      activeTab="plan"
      currentClass={classInfo}
      planContent={<MemoizedPlanManager classId={classInfo.id} />}
    />
  )
} 