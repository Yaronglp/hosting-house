import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Settings } from 'lucide-react'

interface SetupRequiredProps {
  title: string
  steps: string[]
  currentStep: number
}

export function SetupRequired({ 
  title,
  steps,
  currentStep 
}: SetupRequiredProps) {
  return (
    <Card className="border-[var(--validation-info-border)] bg-[var(--validation-info-bg)]">
      <CardHeader>
        <CardTitle className="text-[var(--validation-info-text)] flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                index < currentStep 
                  ? 'bg-[var(--validation-success-icon)] text-white' 
                  : index === currentStep
                  ? 'bg-[var(--validation-info-text)] text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={`text-sm ${
                index < currentStep 
                  ? 'text-[var(--validation-success-text)] line-through' 
                  : index === currentStep
                  ? 'text-[var(--validation-info-text)] font-medium'
                  : 'text-muted-foreground'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
