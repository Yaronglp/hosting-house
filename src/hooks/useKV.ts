import { useState, useEffect, useCallback } from 'react'
import { kvGet, kvSet, kvRemove } from '@/lib/db'

/**
 * React hook for reactive KV operations
 * @param key - The storage key
 * @param initialValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue, loading]
 */
export function useKV<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, () => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await kvGet<T>(key)
        if (stored !== undefined) {
          setValue(stored)
        }
      } catch (error) {
        console.error(`Failed to load KV key "${key}":`, error)
      } finally {
        setLoading(false)
      }
    }

    loadValue()
  }, [key])

  // Set value and persist (optimistic update)
  const setValueAndPersist = useCallback(async (newValue: T) => {
    // Update local state immediately for responsive UI
    setValue(newValue)
    
    try {
      // Then persist to storage
      await kvSet(key, newValue)
    } catch (error) {
      console.error(`Failed to set KV key "${key}":`, error)
      // Optionally: revert the optimistic update here if needed
      throw error
    }
  }, [key])

  // Remove value
  const removeValue = useCallback(async () => {
    try {
      await kvRemove(key)
      setValue(initialValue)
    } catch (error) {
      console.error(`Failed to remove KV key "${key}":`, error)
      throw error
    }
  }, [key, initialValue])

  return [value, setValueAndPersist, removeValue, loading]
}

/**
 * Hook for getting multiple KV values at once
 * @param keys - Array of keys to fetch
 * @returns [values, loading] where values is Record<string, unknown>
 */
export function useKVBatch(keys: string[]): [Record<string, unknown>, boolean] {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadValues = async () => {
      try {
        const results: Record<string, unknown> = {}
        await Promise.all(
          keys.map(async (key) => {
            const value = await kvGet(key)
            if (value !== undefined) {
              results[key] = value
            }
          })
        )
        setValues(results)
      } catch (error) {
        console.error('Failed to load KV batch:', error)
      } finally {
        setLoading(false)
      }
    }

    if (keys.length > 0) {
      loadValues()
    } else {
      setLoading(false)
    }
  }, [keys])

  return [values, loading]
}
