/**
 * Keyboard support utilities
 */

/**
 * Enhanced keyboard support for interactive elements
 */
export function addKeyboardSupport(
  element: HTMLElement,
  onClick: () => void,
  options: {
    role?: string
    ariaLabel?: string
    enterKey?: boolean
    spaceKey?: boolean
  } = {}
): () => void {
  const { role = 'button', ariaLabel, enterKey = true, spaceKey = true } = options

  // Set ARIA attributes
  element.setAttribute('role', role)
  element.setAttribute('tabindex', '0')
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel)
  }

  // Add focus styles
  element.classList.add('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2')

  function handleKeydown(e: KeyboardEvent) {
    if ((enterKey && e.key === 'Enter') || (spaceKey && e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  element.addEventListener('keydown', handleKeydown)
  element.addEventListener('click', onClick)

  return () => {
    element.removeEventListener('keydown', handleKeydown)
    element.removeEventListener('click', onClick)
  }
}

/**
 * Custom hook for managing keyboard shortcuts
 */
export class KeyboardShortcuts {
  private shortcuts: Map<string, () => void> = new Map()

  constructor() {
    document.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  addShortcut(key: string, modifiers: string[], callback: () => void) {
    const shortcutKey = [...modifiers, key].join('+').toLowerCase()
    this.shortcuts.set(shortcutKey, callback)
  }

  removeShortcut(key: string, modifiers: string[]) {
    const shortcutKey = [...modifiers, key].join('+').toLowerCase()
    this.shortcuts.delete(shortcutKey)
  }

  private handleKeydown(e: KeyboardEvent) {
    const modifiers: string[] = []
    if (e.ctrlKey) modifiers.push('ctrl')
    if (e.altKey) modifiers.push('alt')
    if (e.shiftKey) modifiers.push('shift')
    if (e.metaKey) modifiers.push('meta')

    const shortcutKey = [...modifiers, e.key.toLowerCase()].join('+')
    const callback = this.shortcuts.get(shortcutKey)
    
    if (callback) {
      e.preventDefault()
      callback()
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this))
    this.shortcuts.clear()
  }
}
