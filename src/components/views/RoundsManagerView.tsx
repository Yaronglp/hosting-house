import { RoundsManager } from '@/components/managers/RoundsManager'
import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'
import { ClassInfo } from '@/types/common'

interface RoundsManagerViewProps {
  classInfo: ClassInfo
}

export function RoundsManagerView({
  classInfo
}: RoundsManagerViewProps) {
  const manager = RoundsManager({ 
    classId: classInfo.id, 
    className: classInfo.name 
  })
  
  return (
    <>
      <ActionsSidebar
        activeTab="rounds"
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