/**
 * Screen reader support utilities
 */

/**
 * Screen reader announcements
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'
  
  document.body.appendChild(announcement)
  announcement.textContent = message
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Error boundary for accessibility
 */
export function handleAccessibilityError(error: Error, errorInfo: any) {
  console.error('Accessibility Error:', error, errorInfo)
  
  // Announce error to screen readers
  announceToScreenReader('אירעה שגיאה. אנא נסה שנית או פנה לתמיכה.', 'assertive')
  
  // Focus on error message if available
  const errorElement = document.querySelector('[role="alert"]')
  if (errorElement) {
    (errorElement as HTMLElement).focus()
  }
}
