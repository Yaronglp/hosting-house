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
    <Card className={`text-center ${variant === 'error' ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-4">
          {icon && (
            <div className={`p-3 rounded-full ${
              variant === 'error' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${
              variant === 'error' ? 'text-red-800' : 'text-gray-900'
            }`}>
              {title}
            </h3>
            <p className={`text-sm max-w-md mx-auto ${
              variant === 'error' ? 'text-red-700' : 'text-gray-600'
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
