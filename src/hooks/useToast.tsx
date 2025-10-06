import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast, ToastVariant } from '@/components/ui/Toast'

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, variant: ToastVariant = 'info', duration?: number) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const newToast: Toast = { id, message, variant, duration }
    
    setToasts((prev) => [...prev, newToast])
  }, [])

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }, [showToast])

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }, [showToast])

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration)
  }, [showToast])

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }, [showToast])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value = {
    toasts,
    showToast,
    success,
    error,
    info,
    warning,
    dismissToast,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
} 