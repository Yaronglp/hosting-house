import { ClassesManager } from '@/components/managers/ClassesManager'
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
    <MainContent
      activeTab="classes"
      currentClass={manager.currentClass}
      classesContent={manager.content}
    />
  )
} 