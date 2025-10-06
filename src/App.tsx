import { useEffect, useState } from 'react'
import './index.css'
import { SWUpdateBanner } from './sw-update'
import { useStorage } from '@/hooks/useStorage'
import { useKV } from '@/hooks/useKV'
import { Class, KV_KEYS, DEFAULT_SETTINGS } from '@/lib/types'
import { AppHeader } from '@/components/layout/AppHeader'
import { BackgroundEffects } from '@/components/layout/BackgroundEffects'
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
  const [classes] = useKV<Class[]>(KV_KEYS.CLASSES, [])
  const { requestPersistence, ...storageRest } = useStorage()
  const { toasts, dismissToast, success, error } = useToast()
  const [showPasteModal, setShowPasteModal] = useState(false)

  const currentClass = currentClassId ? classes.find(c => c.id === currentClassId) : null
  const [classSettings] = useKV(currentClassId ? KV_KEYS.settings(currentClassId) : '', DEFAULT_SETTINGS)
  const groupSize = classSettings.groupSize
  
  // Handle persistence request with user feedback
  const handleRequestPersistence = async () => {
    try {
      const result = await requestPersistence()
      if (result) {
        success('✅ אחסון מתמיד הופעל בהצלחה! הנתונים שלך מוגנים כעת.')
      } else {
        error('❌ לא ניתן להפעיל אחסון מתמיד. ייתכן שהדפדפן לא תומך או שהמשתמש דחה את הבקשה.')
      }
    } catch (err) {
      error('❌ שגיאה בהפעלת אחסון מתמיד. אנא נסה שוב.')
    }
  }

  // Map storage props to match StorageInfo interface
  const storageProps = {
    ...storageRest,
    onRequestPersistence: handleRequestPersistence
  }

  useEffect(() => {
    // Auto-request persistence on app load (silent)
    requestPersistence()
  }, [])

  // Auto-select first class if no current class is set or if current class no longer exists
  useEffect(() => {
    if (classes.length > 0) {
      if (!currentClassId || !classes.find(c => c.id === currentClassId)) {
        setCurrentClassId(classes[0].id)
      }
    }
  }, [classes, setCurrentClassId]) // Removed currentClassId from dependencies to prevent infinite loop

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
      <BackgroundEffects />
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
              onClassSelect={setCurrentClassId}
              {...storageProps}
            />
          )}
          
          {active === 'students' && currentClass && (
            <StudentsManagerView
              classInfo={currentClass}
              onPasteModalOpen={handlePasteModalOpen}
              {...storageProps}
            />
          )}
          
          {active === 'students' && !currentClass && (
            <EmptyView activeTab={active} {...storageProps} />
          )}
          
          {active === 'rounds' && currentClass && (
            <RoundsManagerView
              classInfo={currentClass}
              {...storageProps}
            />
          )}
          
          {active === 'rounds' && !currentClass && (
            <EmptyView activeTab={active} {...storageProps} />
          )}
          
          {active === 'plan' && currentClass && (
            <PlanView
              classInfo={currentClass}
              {...storageProps}
            />
          )}
          
          {active === 'plan' && !currentClass && (
            <EmptyView activeTab={active} {...storageProps} />
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
