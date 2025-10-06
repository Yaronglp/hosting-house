// Mock implementation of useToast hook for Cypress tests
export const useToast = () => ({
  toasts: [],
  showToast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  dismissToast: () => {}
})
