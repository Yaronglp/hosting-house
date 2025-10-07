/**
 * Utility for creating accessible tooltips
 */
export function createAccessibleTooltip(
  trigger: HTMLElement, 
  content: string,
  position: 'top' | 'bottom' | 'left' | 'right' = 'top'
): () => void {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`
  
  trigger.setAttribute('aria-describedby', tooltipId)
  
  let tooltip: HTMLElement | null = null
  let showTimeout: number
  let hideTimeout: number

  function showTooltip() {
    clearTimeout(hideTimeout)
    showTimeout = setTimeout(() => {
      tooltip = document.createElement('div')
      tooltip.id = tooltipId
      tooltip.textContent = content
      tooltip.setAttribute('role', 'tooltip')
      tooltip.className = `absolute z-50 px-2 py-1 text-sm bg-gray-900 text-white rounded shadow-lg ${
        position === 'top' ? 'bottom-full mb-1' :
        position === 'bottom' ? 'top-full mt-1' :
        position === 'left' ? 'right-full mr-1' :
        'left-full ml-1'
      }`
      
      trigger.style.position = 'relative'
      trigger.appendChild(tooltip)
    }, 500)
  }

  function hideTooltip() {
    clearTimeout(showTimeout)
    hideTimeout = setTimeout(() => {
      if (tooltip) {
        trigger.removeChild(tooltip)
        tooltip = null
      }
    }, 100)
  }

  trigger.addEventListener('mouseenter', showTooltip)
  trigger.addEventListener('mouseleave', hideTooltip)
  trigger.addEventListener('focus', showTooltip)
  trigger.addEventListener('blur', hideTooltip)

  return () => {
    clearTimeout(showTimeout)
    clearTimeout(hideTimeout)
    trigger.removeEventListener('mouseenter', showTooltip)
    trigger.removeEventListener('mouseleave', hideTooltip)
    trigger.removeEventListener('focus', showTooltip)
    trigger.removeEventListener('blur', hideTooltip)
    if (tooltip) {
      trigger.removeChild(tooltip)
    }
  }
}
