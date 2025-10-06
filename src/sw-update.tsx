import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/Button'

export function SWUpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(needRefresh)
  }, [needRefresh])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-4 w-fit rounded-md border bg-card p-3 shadow">
      <div className="flex items-center gap-3">
        <span className="text-sm">גרסה חדשה זמינה — רענן</span>
        <Button
          size="sm"
          onClick={() => updateServiceWorker(true).then(() => setNeedRefresh(false))}
        >
          רענן
        </Button>
      </div>
    </div>
  )
} 