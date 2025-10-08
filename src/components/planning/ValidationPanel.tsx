import { memo } from 'react'
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ValidationResult } from '@/lib/validation'

interface ValidationPanelProps {
  validation: ValidationResult | null
  onRetry?: () => void
  isRetrying?: boolean
}

// Extract validation item component for better composition
const ValidationItem = memo(({ 
  message, 
  count, 
  details, 
  type 
}: { 
  message: string
  count?: number
  details?: string[]
  type: 'error' | 'warning'
}) => {
  const isError = type === 'error'
  const bgColor = isError ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
  const textColor = isError ? 'text-red-800' : 'text-yellow-800'
  const countBgColor = isError ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
  const detailColor = isError ? 'text-red-700' : 'text-yellow-700'
  const maxDetails = isError ? 5 : 3

  return (
    <div className={`${bgColor} border rounded-md p-3`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`font-medium ${textColor}`}>{message}</span>
        {count && (
          <span className={`text-sm ${countBgColor} px-2 py-1 rounded`} data-cy="item-count">
            {count}
          </span>
        )}
      </div>
      {details && details.length > 0 && (
        <div className={`text-sm ${detailColor}`}>
          <ul className="list-disc pr-5 mt-1">
            {details.slice(0, maxDetails).map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
            {details.length > maxDetails && (
              <li className={isError ? 'text-red-500' : 'text-yellow-500'}>
                ועוד {details.length - maxDetails} נוספים...
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
})

ValidationItem.displayName = 'ValidationItem'

// Extract validation section component
const ValidationSection = memo(({ 
  items, 
  type, 
  title, 
  icon: Icon,
  dataCy
}: { 
  items: Array<{ message: string; count?: number; details?: string[] }>
  type: 'error' | 'warning'
  title: string
  icon: React.ComponentType<{ className?: string }>
  dataCy?: string
}) => {
  if (items.length === 0) return null

  const iconColor = type === 'error' ? 'text-red-600' : 'text-yellow-600'

  return (
    <div className="space-y-2" data-cy={dataCy}>
      <div className={`flex items-center gap-2 ${iconColor}`}>
        <Icon className="h-4 w-4 padding-left-default" />
        <span className="font-medium">{title} ({items.length})</span>
      </div>
      {items.map((item, index) => (
        <ValidationItem
          key={index}
          message={item.message}
          count={item.count}
          details={item.details}
          type={type}
        />
      ))}
    </div>
  )
})

ValidationSection.displayName = 'ValidationSection'

// Extract retry button component
const RetryButton = memo(({ onRetry, isRetrying }: { onRetry: () => void; isRetrying: boolean }) => (
  <Button 
    variant="outline" 
    size="sm" 
    onClick={onRetry}
    disabled={isRetrying}
    data-cy="retry-button"
  >
    {isRetrying ? (
      <>
        <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
        מנסה תיקון...
      </>
    ) : (
      'ניסיון תיקון'
    )}
  </Button>
))

RetryButton.displayName = 'RetryButton'

// Extract success state component
const SuccessState = memo(() => (
  <div className="bg-green-50 border border-green-200 rounded-md p-3">
    <div className="flex items-center gap-2 text-green-800">
      <CheckCircle className="h-4 w-4 padding-left-default" data-cy="success-icon"/>
      <span>התוכנית עומדת בכל הדרישות!</span>
    </div>
    <div className="text-sm text-green-700 mt-1">
      כל התלמידים קיבלו שיבוץ<br />
      אין תלמידים שלא שובצו
    </div>
  </div>
))

SuccessState.displayName = 'SuccessState'

export const ValidationPanel = memo(({ validation, onRetry, isRetrying }: ValidationPanelProps) => {
  if (!validation) return null

  const { errors, warnings, isValid } = validation

  return (
    <Card data-cy="validation-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600 padding-left-default" cy-data="success-icon"/>
            ) : (
              <XCircle className="h-5 w-5 text-red-600 padding-left-default" cy-data="error-icon"/>
            )}
            <CardTitle>
              {isValid ? 'תוכנית תקינה' : 'בעיות בתוכנית'}
            </CardTitle>
          </div>
          {!isValid && onRetry && (
            <RetryButton onRetry={onRetry} isRetrying={isRetrying} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ValidationSection
          items={errors}
          type="error"
          title="שגיאות חוסמות"
          icon={XCircle}
          dataCy="validation-errors"
        />

        <ValidationSection
          items={warnings}
          type="warning"
          title="אזהרות"
          icon={AlertTriangle}
          dataCy="validation-warnings"
        />

        {isValid && <SuccessState />}
      </CardContent>
    </Card>
  )
})

ValidationPanel.displayName = 'ValidationPanel'