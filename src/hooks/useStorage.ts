import { useState, useEffect } from 'react'

interface StorageInfo {
  persisted: boolean | null
  usage: number
  quota: number
  usagePercent: number
}

export function useStorage() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    persisted: null,
    usage: 0,
    quota: 0,
    usagePercent: 0,
  })
  const [isRequesting, setIsRequesting] = useState(false)

  const requestPersistence = async () => {
    if (!('storage' in navigator) || !('persist' in navigator.storage)) {
      console.warn('Storage persistence not supported in this browser')
      return false
    }

    setIsRequesting(true)
    try {
      const persisted = await navigator.storage.persist()
      setStorageInfo(prev => ({ ...prev, persisted }))
      
      // Log the result for debugging
      console.log('Storage persistence request result:', persisted)
      
      return persisted
    } catch (error) {
      console.error('Failed to request storage persistence:', error)
      return false
    } finally {
      setIsRequesting(false)
    }
  }

  const updateStorageInfo = async () => {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return
    }

    try {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      const quota = estimate.quota || 0
      const usagePercent = quota > 0 ? (usage / quota) * 100 : 0

      setStorageInfo(prev => ({
        ...prev,
        usage,
        quota,
        usagePercent,
      }))
    } catch (error) {
      console.error('Failed to get storage estimate:', error)
    }
  }

  useEffect(() => {
    // Check if already persisted
    if ('storage' in navigator && 'persisted' in navigator.storage) {
      navigator.storage.persisted().then(persisted => {
        setStorageInfo(prev => ({ ...prev, persisted }))
      })
    }

    // Get storage usage
    updateStorageInfo()

    // Update storage info periodically
    const interval = setInterval(updateStorageInfo, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    ...storageInfo,
    isRequesting,
    requestPersistence,
    updateStorageInfo,
  }
}
