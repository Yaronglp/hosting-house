import { useState } from 'react'
import { StudentsManager } from '@/components/managers/StudentsManager'
import { MainContent } from '@/components/layout/MainContent'
import { PasteNamesModal } from '@/components/common/PasteNamesModal'
import { ClassInfo } from '@/types/common'
import { useKV } from '@/hooks/useKV'
import { useToast } from '@/hooks/useToast'
import { KV_KEYS, DEFAULT_SETTINGS } from '@/lib/types'

interface StudentsManagerViewProps {
  classInfo: ClassInfo
}

export function StudentsManagerView({
  classInfo
}: StudentsManagerViewProps) {
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [classSettings] = useKV(KV_KEYS.settings(classInfo.id), DEFAULT_SETTINGS)
  const { success } = useToast()
  const groupSize = classSettings.groupSize

  const handlePasteModalOpen = () => {
    setShowPasteModal(true)
  }

  const handlePasteModalClose = () => {
    setShowPasteModal(false)
  }

  const handleStudentsAdded = (count: number) => {
    success(`✅ נוספו ${count} תלמידים בהצלחה!`)
  }

  const handleStudentAdded = () => {
    success(`✅ נוסף תלמיד בהצלחה!`)
  }

  const handleStudentUpdated = () => {
    success(`✅ עודכן תלמיד בהצלחה!`)
  }

  const manager = StudentsManager({ 
    classId: classInfo.id, 
    className: classInfo.name,
    onPasteNames: handlePasteModalOpen,
    onStudentAdded: handleStudentAdded,
    onStudentUpdated: handleStudentUpdated
  })
  
  return (
    <>
      <MainContent
        activeTab="students"
        currentClass={classInfo}
        studentsContent={manager.content}
      />
      
      {showPasteModal && (
        <PasteNamesModal
          classId={classInfo.id}
          groupSize={groupSize}
          onClose={handlePasteModalClose}
          onStudentsAdded={handleStudentsAdded}
        />
      )}
    </>
  )
} 