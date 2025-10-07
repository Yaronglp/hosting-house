import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from './Button'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

const variantStyles = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
  warning: 'toast-warning',
}

const variantIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

export function ToastItem({ toast, onClose }: ToastItemProps) {
  const Icon = variantIcons[toast.variant]

  useEffect(() => {
    const duration = toast.duration ?? 4000
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 animate-in slide-in-from-right ${variantStyles[toast.variant]}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium" dir="rtl">
        {toast.message}
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-black/10"
        onClick={() => onClose(toast.id)}
        aria-label="סגור הודעה"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      aria-label="הודעות"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
