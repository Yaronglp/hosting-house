import { ClassesManager } from '@/components/managers/ClassesManager'
import { MainContent } from '@/components/layout/MainContent'
import { useToast } from '@/hooks/useToast'

interface ClassesManagerViewProps {
  currentClassId: string | null
  onClassSelect: (classId: string) => void
}

export function ClassesManagerView({ 
  currentClassId, 
  onClassSelect
}: ClassesManagerViewProps) {
  const { success } = useToast()

  const handleClassAdded = () => {
    success(`✅ נוספה כיתה בהצלחה!`)
  }

  const handleClassUpdated = () => {
    success(`✅ עודכנה כיתה בהצלחה!`)
  }

  const manager = ClassesManager({ 
    currentClassId, 
    onClassSelect,
    onClassAdded: handleClassAdded,
    onClassUpdated: handleClassUpdated
  })
  
  return (
    <MainContent
      activeTab="classes"
      currentClass={manager.currentClass}
      classesContent={manager.content}
    />
  )
} 