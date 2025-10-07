import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@/hooks/useKV'
import { Class, KV_KEYS } from '@/lib/types'

// Global singleton state
class ClassesManager {
  private static instance: ClassesManager
  private classes: Class[] = []
  private setClasses: ((classes: Class[]) => Promise<void>) | null = null
  private subscribers: Set<() => void> = new Set()

  static getInstance(): ClassesManager {
    if (!ClassesManager.instance) {
      ClassesManager.instance = new ClassesManager()
    }
    return ClassesManager.instance
  }

  setKVInstance(classes: Class[], setClasses: (classes: Class[]) => Promise<void>) {
    this.classes = classes
    this.setClasses = setClasses
    this.notifySubscribers()
  }

  getClasses(): Class[] {
    return [...this.classes]
  }

  async updateClasses(newClasses: Class[]) {
    this.classes = newClasses
    if (this.setClasses) {
      await this.setClasses(newClasses)
    }
    this.notifySubscribers()
  }

  subscribe(callback: () => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback())
  }
}

// Singleton hook for classes
export function useClasses() {
  const [classes, setClasses] = useKV<Class[]>(KV_KEYS.CLASSES, [])
  const [localClasses, setLocalClasses] = useState<Class[]>([])
  const manager = ClassesManager.getInstance()

  // Initialize the singleton with the KV instance
  useEffect(() => {
    manager.setKVInstance(classes, setClasses)
  }, [classes, setClasses, manager])

  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setLocalClasses(manager.getClasses())
    })
    
    // Set initial state
    setLocalClasses(manager.getClasses())
    
    return () => {
      unsubscribe()
    }
  }, [manager])

  // Return the singleton's update function
  const updateClasses = useCallback(async (newClasses: Class[]) => {
    await manager.updateClasses(newClasses)
  }, [manager])

  return [localClasses, updateClasses] as const
}
