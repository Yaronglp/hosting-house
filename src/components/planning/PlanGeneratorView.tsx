import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card'
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
              <CardTitle>יוצר קבוצות מפגש</CardTitle>
              <CardDescription className="padding-left-default">כל מארח יכול לארח פעם אחת + שיבוץ אורחים על סמך העדפות שנבחרו</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={onGenerate} 
                disabled={!canGenerate || isGenerating}
                aria-label="צור תוכנית חדשה"
                data-cy="generate-plan-button"
                className="cta-primary"
              >
                {isGenerating ? 'מחשב...' : 'צור תוכנית'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="card-footer-meta">
          תלמידים: {students.length} • תאריכי מפגש: {sortedRounds.length}
        </CardFooter>
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