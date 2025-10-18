import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { AlertTriangle } from 'lucide-react'

interface PlanGenerationErrorProps {
  error: string
  onRetry: () => void
}

export function PlanGenerationError({ 
  error, 
  onRetry 
}: PlanGenerationErrorProps) {
  return (
    <Card className="border-[var(--validation-error-border)] bg-[var(--validation-error-bg)]">
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-[var(--validation-error-bg)] text-[var(--validation-error-icon)] w-fit mx-auto">
            <AlertTriangle className="padding-left-default" style={{ height: '48px', width: '48px' }} />
          </div>
          <div className="space-y-2">
            <h1 className="font-semibold text-[var(--validation-error-text)] mt-1" cy-data="plan-generation-error-title">שגיאה ביצירת התוכנית</h1>
            <p className="text-xl text-[var(--validation-error-text)] max-w-md mx-auto mb-1">{error}</p>
          </div>
          <div className="bg-[var(--validation-error-bg)] rounded-lg p-4 text-[var(--validation-error-text)] text-base padding-default">
            <h2 className="mb-2 text-2xl">הצעות לפתרון:</h2>
            <ul className="space-y-1 text-right text-xl">
              <li> בדוק שיש מספיק מארחים זמינים</li>
              <li> בדוק שאין הימנעויות בין תלמידים שמונעות שיבוץ</li>
              <li> נסה להפחית את מספר הסבבים או להוסיף מארחים</li>
            </ul>
          </div>
          <Button className="padding-horizontal-default" variant="destructive" onClick={onRetry} data-cy="retry-generation-button">
           נסה שוב
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
