import { RoundsManager } from '@/components/managers/RoundsManager'
import { MainContent } from '@/components/layout/MainContent'
import { ClassInfo } from '@/types/common'
import { useToast } from '@/hooks/useToast'

interface RoundsManagerViewProps {
  classInfo: ClassInfo
}

export function RoundsManagerView({
  classInfo
}: RoundsManagerViewProps) {
  const { success } = useToast()

  const handleRoundAdded = () => {
    success(`✅ נוסף תאריך מפגש בהצלחה!`)
  }

  const handleRoundUpdated = () => {
    success(`✅ עודכן תאריך מפגש בהצלחה!`)
  }

  const manager = RoundsManager({ 
    classId: classInfo.id, 
    className: classInfo.name,
    onRoundAdded: handleRoundAdded,
    onRoundUpdated: handleRoundUpdated
  })
  
  return (
    <MainContent
      activeTab="rounds"
      currentClass={classInfo}
      roundsContent={manager.content}
    />
  )
} 