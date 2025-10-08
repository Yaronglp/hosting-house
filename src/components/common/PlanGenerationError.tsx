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
    <Card className="border-red-200 bg-red-50">
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600 w-fit mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-800">שגיאה ביצירת התוכנית</h3>
            <p className="text-sm text-red-700 max-w-md mx-auto">{error}</p>
          </div>
          <div className="bg-red-100 rounded-lg p-4 text-red-800 text-sm padding-default">
            <h4 className="font-medium mb-2">הצעות לפתרון:</h4>
            <ul className="space-y-1 text-right">
              <li>• בדוק שיש מספיק מארחים זמינים</li>
              <li>• ודא שהיכולת של המארחים מספקת לכל התלמידים</li>
              <li>• בדוק שאין הימנעויות שמונעות שיבוץ</li>
              <li>• נסה להפחית את מספר הסבבים או להוסיף מארחים</li>
            </ul>
          </div>
          <Button variant="destructive" onClick={onRetry}>
            נסה שוב עם Seed אחר
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
