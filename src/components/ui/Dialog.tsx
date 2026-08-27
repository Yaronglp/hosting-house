import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  showCloseButton?: boolean
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousActiveElement.current = document.activeElement as HTMLElement

      document.body.style.overflow = 'hidden'
      
      if (dialogRef.current) {
        dialogRef.current.focus()
      }
    } else {
      // Restore previous focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
      
      // Restore scrolling
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  const dialogContent = (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        className="modal-panel animate-in zoom-in-95 duration-200"
      >
        <Card className="w-full border-0 bg-transparent shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle id="dialog-title">{title}</CardTitle>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onClose}
                  aria-label="סגור"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {children}
              {footer && <div className="flex gap-3 justify-end pt-4">{footer}</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'אישור',
  cancelText = 'ביטול',
  variant = 'default',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showCloseButton={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose} data-cy="dialog-cancel-button">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            data-cy="dialog-confirm-button"
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-xl whitespace-pre-line mt-2 mb-3" dir="rtl">
        {message}
      </p>
    </Dialog>
  )
} 