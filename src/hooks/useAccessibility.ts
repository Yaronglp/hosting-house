import { useEffect, useCallback } from 'react'
import { 
  announceToScreenReader, 
} from '@/lib/accessibility'

// Hook for keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const key = e.key.toLowerCase()
      const modifiers: string[] = []
      
      if (e.ctrlKey || e.metaKey) modifiers.push('ctrl')
      if (e.altKey) modifiers.push('alt')
      if (e.shiftKey) modifiers.push('shift')

      const shortcutKey = modifiers.length > 0 
        ? `${modifiers.join('+')}+${key}` 
        : key

      if (shortcuts[shortcutKey]) {
        e.preventDefault()
        shortcuts[shortcutKey]()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [shortcuts])
}

// Hook for screen reader announcements
export function useAnnouncer() {
  return useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }, [])
}
