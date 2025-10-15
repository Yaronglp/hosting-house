import { useEffect, useState } from 'react'
import './index.css'
import { SWUpdateBanner } from './sw-update'
import { useStorage } from '@/hooks/useStorage'
import { useKV } from '@/hooks/useKV'
import { useClasses } from '@/hooks/useClasses'
import { Class, KV_KEYS, DEFAULT_SETTINGS } from '@/lib/types'
import { AppHeader } from '@/components/layout/AppHeader'
import { ClassesManagerView } from '@/components/views/ClassesManagerView'
import { StudentsManagerView } from '@/components/views/StudentsManagerView'
import { RoundsManagerView } from '@/components/views/RoundsManagerView'
import { PlanView } from '@/components/views/PlanView'
import { EmptyView } from '@/components/views/EmptyView'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'
import { PasteNamesModal } from '@/components/common/PasteNamesModal'

function App() {
  const [active, setActive] = useState('classes')
  const [currentClassId, setCurrentClassId] = useKV<string | null>('currentClassId', null)
  const [classes] = useClasses()
  const { requestPersistence } = useStorage()
  const { toasts, dismissToast, success } = useToast()
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [currentClass, setCurrentClass] = useState<Class | null>(null)

  useEffect(() => {
    if (currentClassId) {
      if (classes.length > 0) {
        const foundClass = classes.find(c => c.id === currentClassId)
        setCurrentClass(foundClass || null)
      }
      // If classes.length is 0, we're still loading, so don't change currentClass
    } else {
      setCurrentClass(null)
    }
  }, [currentClassId, classes])

  const [classSettings] = useKV(currentClassId ? KV_KEYS.settings(currentClassId) : '', DEFAULT_SETTINGS)
  const groupSize = classSettings.groupSize

  useEffect(() => {
    // Auto-request persistence on app load (silent)
    requestPersistence()
  }, [])


  const handlePasteModalOpen = () => {
    setShowPasteModal(true)
  }

  const handlePasteModalClose = () => {
    setShowPasteModal(false)
  }

  const handleStudentsAdded = (count: number) => {
    success(`✅ נוספו ${count} תלמידים בהצלחה!`)
  }

  return (
    <div className="min-h-screen retro-grid flex flex-col max-w-full overflow-x-hidden">
      <SWUpdateBanner />
      <ToastContainer toasts={toasts} onClose={dismissToast} />
      <AppHeader 
        currentClassName={currentClass?.name}
        activeTab={active}
        onTabChange={setActive}
      />

      <div className="w-full max-w-7xl mx-auto px-4 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 py-6">
          {active === 'classes' && (
            <ClassesManagerView 
              currentClassId={currentClassId}
              onClassSelect={(classId) => {
                setCurrentClassId(classId)
              }}
            />
          )}
          
          {active === 'students' && currentClass && (
            <StudentsManagerView
              classInfo={currentClass}
              onPasteModalOpen={handlePasteModalOpen}
            />
          )}
          
          {active === 'students' && !currentClass && (
            <EmptyView activeTab={active} />
          )}
          
          {active === 'rounds' && currentClass && (
            <RoundsManagerView
              classInfo={currentClass}
            />
          )}
          
          {active === 'rounds' && !currentClass && (
            <EmptyView activeTab={active} />
          )}
          
          {active === 'plan' && currentClass && (
            <PlanView
              classInfo={currentClass}
            />
          )}
          
          {active === 'plan' && !currentClass && (
            <EmptyView activeTab={active} />
          )}
        </div>
      </div>

      {/* Global Paste Names Modal */}
      {showPasteModal && currentClass && (
        <PasteNamesModal
          classId={currentClass.id}
          groupSize={groupSize}
          onClose={handlePasteModalClose}
          onStudentsAdded={handleStudentsAdded}
        />
      )}
    </div>
  )
}

export default App
