import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Student, Round } from '@/lib/types'
import { EmptyPlanState } from '@/components/common/EmptyPlanState'
import { PlanGenerationError } from '@/components/common/PlanGenerationError'

interface PlanGeneratorViewProps {
  onGenerate: () => void
  canGenerate: boolean
  isGenerating: boolean
  error: string | null
  students: Student[]
  sortedRounds: Round[]
}

export function PlanGeneratorView({
  onGenerate,
  canGenerate,
  isGenerating,
  error,
  students,
  sortedRounds
}: PlanGeneratorViewProps) {
  if (!canGenerate) {
    return (
      <>
        <EmptyPlanState
          onGenerate={onGenerate}
          hasStudents={students.length > 0}
          hasRounds={sortedRounds.length > 0}
        />
        {error && canGenerate && (
          <PlanGenerationError
            error={error}
            onRetry={onGenerate}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Card data-cy="plan-generator">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>מחולל תוכנית</CardTitle>
              <CardDescription>מארח פעם אחת + שיבוץ אורחים עם העדפות</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={onGenerate} 
                disabled={!canGenerate || isGenerating}
                aria-label="צור תוכנית חדשה - מקש קיצור Ctrl+G"
                data-cy="generate-plan-button"
              >
                {isGenerating ? 'מחשב...' : 'צור תוכנית'}
              </Button>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600 mt-2" role="alert" aria-live="assertive">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            תלמידים: {students.length} • סבבים: {sortedRounds.length}
          </div>
        </CardContent>
      </Card>

      {error && canGenerate && (
        <PlanGenerationError
          error={error}
          onRetry={onGenerate}
        />
      )}
    </>
  )
} 