/**
 * Focus management utilities for modals and overlays
 */

/**
 * Trap focus within an element (for modals, dialogs, etc.)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  firstElement?.focus()

  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Create skip link for keyboard navigation
 */
export function createSkipLink(targetId: string, text: string = 'דלג לתוכן הראשי'): HTMLElement {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50'
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth' })
    }
  })
  
  return skipLink
}

/**
 * Utility for managing focus during route changes
 */
export function manageFocusForSPA() {
  let lastFocusedElement: HTMLElement | null = null

  return {
    saveFocus: () => {
      lastFocusedElement = document.activeElement as HTMLElement
    },
    restoreFocus: () => {
      if (lastFocusedElement && lastFocusedElement.focus) {
        lastFocusedElement.focus()
      }
    },
    focusMainContent: () => {
      const main = document.querySelector('main')
      if (main) {
        main.setAttribute('tabindex', '-1')
        main.focus()
        // Announce page change to screen readers
        announceToScreenReader('עמוד חדש נטען', 'assertive')
      }
    }
  }
}

// Import announceToScreenReader from screen-reader module
import { announceToScreenReader } from './screen-reader'
