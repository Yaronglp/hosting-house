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
    <div className="flex gap-3 mt-8 min-[500px]:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        data-cy="cancel-button"
        className="flex-1 min-[500px]:flex-none"
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        data-cy="save-button"
        className="flex-1 min-[500px]:flex-none"
      >
        {isLoading ? 'שומר...' : submitText}
      </Button>
    </div>
  )
}
