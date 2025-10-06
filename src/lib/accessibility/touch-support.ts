/**
 * Touch support utilities
 */

/**
 * Touch-friendly click handlers
 */
export function addTouchSupport(
  element: HTMLElement,
  onInteraction: () => void,
  options: {
    minTouchTarget?: number
    hapticFeedback?: boolean
  } = {}
): () => void {
  const { minTouchTarget = 44, hapticFeedback = false } = options

  // Ensure minimum touch target size
  const rect = element.getBoundingClientRect()
  if (rect.width < minTouchTarget || rect.height < minTouchTarget) {
    element.style.minWidth = `${minTouchTarget}px`
    element.style.minHeight = `${minTouchTarget}px`
  }

  // Add touch-friendly styles
  element.classList.add('touch-manipulation', 'select-none')

  let touchStartTime = 0
  let touchMoved = false

  function handleTouchStart(e: TouchEvent) {
    touchStartTime = Date.now()
    touchMoved = false
    element.classList.add('opacity-75')
  }

  function handleTouchMove() {
    touchMoved = true
    element.classList.remove('opacity-75')
  }

  function handleTouchEnd(e: TouchEvent) {
    element.classList.remove('opacity-75')
    
    const touchDuration = Date.now() - touchStartTime
    if (!touchMoved && touchDuration < 500) {
      e.preventDefault()
      
      // Haptic feedback on supported devices
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10)
      }
      
      onInteraction()
    }
  }

  element.addEventListener('touchstart', handleTouchStart, { passive: true })
  element.addEventListener('touchmove', handleTouchMove, { passive: true })
  element.addEventListener('touchend', handleTouchEnd)

  return () => {
    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)
  }
}
