import { useEffect, useRef, useCallback } from 'react'
import { 
  announceToScreenReader, 
  addKeyboardSupport, 
  addTouchSupport,
  prefersReducedMotion,
  prefersHighContrast 
} from '@/lib/accessibility'

// Hook for managing focus trapping in modals
export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !ref.current) return

    const element = ref.current
    const focusableElements = element.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return ref
}

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

// Hook for enhanced button with keyboard and touch support
export function useAccessibleButton(
  onClick: () => void,
  options: {
    ariaLabel?: string
    disabled?: boolean
    hapticFeedback?: boolean
  } = {}
) {
  const ref = useRef<HTMLButtonElement>(null)
  const { ariaLabel, disabled = false, hapticFeedback = false } = options

  useEffect(() => {
    const button = ref.current
    if (!button || disabled) return

    // Add enhanced keyboard support
    const removeKeyboardSupport = addKeyboardSupport(button, onClick, {
      ariaLabel,
      enterKey: true,
      spaceKey: true
    })

    // Add touch support
    const removeTouchSupport = addTouchSupport(button, onClick, {
      hapticFeedback
    })

    return () => {
      removeKeyboardSupport()
      removeTouchSupport()
    }
  }, [onClick, ariaLabel, disabled, hapticFeedback])

  return ref
}

// Hook for managing user preferences
export function useUserPreferences() {
  const reducedMotion = prefersReducedMotion()
  const highContrast = prefersHighContrast()

  return {
    reducedMotion,
    highContrast,
    animationDuration: reducedMotion ? 0 : 200
  }
}

// Hook for managing loading states with announcements
export function useLoadingState(isLoading: boolean, loadingMessage: string = 'טוען...') {
  const announce = useAnnouncer()

  useEffect(() => {
    if (isLoading) {
      announce(loadingMessage, 'polite')
    }
  }, [isLoading, loadingMessage, announce])

  return isLoading
}

// Hook for error handling with accessibility
export function useAccessibleError() {
  const announce = useAnnouncer()

  const handleError = useCallback((error: string | Error) => {
    const message = typeof error === 'string' ? error : error.message
    announce(`שגיאה: ${message}`, 'assertive')
  }, [announce])

  return handleError
}

// Hook for managing skip links
export function useSkipLinks(links: Array<{ id: string; label: string }>) {
  useEffect(() => {
    const skipContainer = document.createElement('div')
    skipContainer.className = 'skip-links'
    
    links.forEach(({ id, label }) => {
      const skipLink = document.createElement('a')
      skipLink.href = `#${id}`
      skipLink.textContent = label
      skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 bg-blue-600 text-white px-4 py-2 rounded z-50 text-sm'
      
      skipLink.addEventListener('click', (e) => {
        e.preventDefault()
        const target = document.getElementById(id)
        if (target) {
          target.setAttribute('tabindex', '-1')
          target.focus()
          target.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      skipContainer.appendChild(skipLink)
    })
    
    document.body.insertBefore(skipContainer, document.body.firstChild)
    
    return () => {
      if (skipContainer.parentNode) {
        skipContainer.parentNode.removeChild(skipContainer)
      }
    }
  }, [links])
}

// Hook for managing ARIA live regions
export function useAriaLiveRegion(id: string) {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const region = document.getElementById(id)
    if (region) {
      region.setAttribute('aria-live', priority)
      region.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = ''
      }, 1000)
    }
  }, [id])

  useEffect(() => {
    const region = document.createElement('div')
    region.id = id
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)
    
    return () => {
      const existingRegion = document.getElementById(id)
      if (existingRegion) {
        document.body.removeChild(existingRegion)
      }
    }
  }, [id])

  return announce
}

// Hook for managing modal accessibility
export function useModal(isOpen: boolean) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Set aria-hidden on other content
      const otherElements = document.querySelectorAll('body > *:not([role="dialog"])')
      otherElements.forEach(el => el.setAttribute('aria-hidden', 'true'))
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden'
      
      // Focus modal
      if (modalRef.current) {
        modalRef.current.focus()
      }
    } else {
      // Restore previous focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
      
      // Remove aria-hidden
      const hiddenElements = document.querySelectorAll('[aria-hidden="true"]')
      hiddenElements.forEach(el => el.removeAttribute('aria-hidden'))
      
      // Restore scrolling
      document.body.style.overflow = ''
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = ''
      const hiddenElements = document.querySelectorAll('[aria-hidden="true"]')
      hiddenElements.forEach(el => el.removeAttribute('aria-hidden'))
    }
  }, [isOpen])

  return modalRef
}
