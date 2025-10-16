import { StudentsManager } from '@/components/managers/StudentsManager'
import { MainContent } from '@/components/layout/MainContent'
import { ClassInfo } from '@/types/common'

interface StudentsManagerViewProps {
  classInfo: ClassInfo
  onPasteModalOpen?: () => void
}

export function StudentsManagerView({
  classInfo,
  onPasteModalOpen
}: StudentsManagerViewProps) {
  const manager = StudentsManager({ 
    classId: classInfo.id, 
    className: classInfo.name,
    onPasteNames: onPasteModalOpen
  })
  
  return (
    <MainContent
      activeTab="students"
      currentClass={classInfo}
      studentsContent={manager.content}
    />
  )
} 