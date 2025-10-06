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
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
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
                  ? 'bg-green-500 text-white' 
                  : index === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={`text-sm ${
                index < currentStep 
                  ? 'text-green-700 line-through' 
                  : index === currentStep
                  ? 'text-blue-700 font-medium'
                  : 'text-gray-600'
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
