import { AlertTriangle } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface InfeasiblePlanErrorProps {
  reason: string
  suggestions?: string[]
  onRetry?: () => void
}

export function InfeasiblePlanError({ 
  reason, 
  suggestions = [],
  onRetry 
}: InfeasiblePlanErrorProps) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-6 w-6" />}
      title="לא ניתן ליצור תוכנית"
      description={reason}
      variant="error"
      action={onRetry ? {
        label: "נסה שוב",
        onClick: onRetry
      } : undefined}
    />
  )
}
