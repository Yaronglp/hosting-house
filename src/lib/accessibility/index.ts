// Re-export all accessibility functionality from individual modules
export { trapFocus, createSkipLink, manageFocusForSPA } from './focus-management'
export { addKeyboardSupport, KeyboardShortcuts } from './keyboard-support'
export { addTouchSupport } from './touch-support'
export { announceToScreenReader, handleAccessibilityError } from './screen-reader'
export { prefersReducedMotion, prefersHighContrast, prefersColorScheme } from './media-queries'
export { createAccessibleTooltip } from './tooltips'
