import { useEffect, useState } from 'react'
import './index.css'
import { SWUpdateBanner } from './sw-update'
import { useStorage } from '@/hooks/useStorage'
import { useKV } from '@/hooks/useKV'
import { useClasses } from '@/hooks/useClasses'
import { Class } from '@/lib/types'
import { AppHeader } from '@/components/layout/AppHeader'
import { ViewRouter } from '@/components/layout/ViewRouter'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

function App() {
  const [active, setActive] = useState('classes')
  const [currentClassId, setCurrentClassId] = useKV<string | null>('currentClassId', null)
  const [classes] = useClasses()
  const { requestPersistence } = useStorage()
  const { toasts, dismissToast } = useToast()
  const [currentClass, setCurrentClass] = useState<Class | null>(null)

  useEffect(() => {
    if (currentClassId) {
      if (classes.length > 0) {
        const foundClass = classes.find(c => c.id === currentClassId)
        setCurrentClass(foundClass || null)
      }
    } else {
      setCurrentClass(null)
    }
  }, [currentClassId, classes])

  useEffect(() => {
    // Auto-request persistence on app load (silent)
    requestPersistence()
  }, [])

  return (
    <div className="min-h-screen app-shell flex flex-col max-w-full overflow-x-hidden">
      <SWUpdateBanner />
      <ToastContainer toasts={toasts} onClose={dismissToast} />
      <AppHeader 
        currentClassName={currentClass?.name}
        activeTab={active}
        onTabChange={setActive}
      />

      <div className="flex flex-col lg:flex-row gap-6 py-6">
        <ViewRouter
          activeTab={active}
          currentClass={currentClass}
          currentClassId={currentClassId}
          onClassSelect={setCurrentClassId}
        />
      </div>
    </div>
  )
}

export default App
