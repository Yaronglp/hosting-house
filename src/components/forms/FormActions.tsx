import { Button } from '@/components/ui/Button'

interface FormActionsProps {
  onCancel: () => void
  onSubmit: () => void
  isLoading: boolean
  submitText?: string
  cancelText?: string
}

export function FormActions({ 
  onCancel, 
  onSubmit, 
  isLoading, 
  submitText = 'שמור',
  cancelText = 'ביטול'
}: FormActionsProps) {
  return (
    <div className="flex gap-3 justify-end mt-8">
      <Button type="button" variant="outline" onClick={onCancel} data-cy="cancel-button">
        {cancelText}
      </Button>
      <Button type="submit" disabled={isLoading} onClick={onSubmit} data-cy="save-button">
        {isLoading ? 'שומר...' : submitText}
      </Button>
    </div>
  )
}
