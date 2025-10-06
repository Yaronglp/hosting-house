import { useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface UseFormSubmitProps<T> {
  onSubmit: (data: T) => Promise<void>
  onSuccess: () => void
  validate?: (data: T) => string | null
}

export function useFormSubmit<T = any>({ onSubmit, onSuccess, validate }: UseFormSubmitProps<T>) {
  const [isLoading, setIsLoading] = useState(false)
  const { error } = useToast()

  const handleSubmit = async (data: T) => {
    // Validate if validator provided
    if (validate) {
      const validationError = validate(data)
      if (validationError) {
        error(validationError)
        return
      }
    }

    setIsLoading(true)
    try {
      await onSubmit(data)
      onSuccess()
    } catch (err) {
      console.error('Form submission error:', err)
      error('שגיאה בשמירת הנתונים')
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSubmit, isLoading }
}
