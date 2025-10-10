import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'error'
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  variant = 'default' 
}: EmptyStateProps) {
  return (
    <Card className={`text-center ${variant === 'error' ? 'border-[var(--validation-error-border)] bg-[var(--validation-error-bg)]' : ''}`}>
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-4">
          {icon && (
            <div className={`p-3 rounded-full ${
              variant === 'error' 
                ? 'bg-[var(--validation-error-bg)] text-[var(--validation-error-icon)]' 
                : 'bg-[var(--validation-info-bg)] text-[var(--validation-info-text)]'
            }`}>
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${
              variant === 'error' ? 'text-[var(--validation-error-text)]' : 'text-foreground'
            }`}>
              {title}
            </h3>
            <p className={`text-sm max-w-md mx-auto ${
              variant === 'error' ? 'text-[var(--validation-error-text)]' : 'text-muted-foreground'
            }`}>
              {description}
            </p>
          </div>
          {action && (
            <Button 
              onClick={action.onClick}
              variant={variant === 'error' ? 'destructive' : 'default'}
              className="mt-4"
            >
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
