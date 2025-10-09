import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Eye, Table, Share } from 'lucide-react'

type ViewMode = 'generator' | 'board' | 'table' | 'share'

interface ViewModeNavigationProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasAssignments: boolean
}

export function ViewModeNavigation({ 
  viewMode, 
  onViewModeChange, 
  hasAssignments 
}: ViewModeNavigationProps) {
  if (!hasAssignments) return null

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="view-mode-responsive gap-2" role="tablist" aria-label="מצבי תצוגה">
          <Button
            variant={viewMode === 'generator' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('generator')}
            role="tab"
            aria-selected={viewMode === 'generator'}
            aria-label="יוצר קבוצות מפגש"
            data-cy="generator-view-button"
          >
            יוצר קבוצות מפגש
          </Button>
          <Button
            variant={viewMode === 'board' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('board')}
            role="tab"
            aria-selected={viewMode === 'board'}
            aria-label="לוח מפגשים"
            data-cy="board-view-button"
          >
            <Eye className="h-4 w-4 ml-2 padding-left-default" />
            לוח מפגשים
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            role="tab"
            aria-selected={viewMode === 'table'}
            aria-label="תצוגת טבלה"
            data-cy="table-view-button"
          >
            <Table className="h-4 w-4 ml-2 padding-left-default" />
            תצוגה בטבלה
          </Button>
          <Button
            variant={viewMode === 'share' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('share')}
            role="tab"
            aria-selected={viewMode === 'share'}
            aria-label="שיתוף וגיבוי"
            data-cy="share-view-button"
          >
            <Share className="h-4 w-4 ml-2 padding-left-default" />
            שיתוף
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 