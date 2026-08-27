import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/components/ui/utils'
import { Eye, Table, Share } from 'lucide-react'

type ViewMode = 'generator' | 'board' | 'table' | 'share'

interface ViewPlanModeNavigationProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasAssignments: boolean
}

const viewModeItems = [
  {
    id: 'generator' as const,
    label: 'יוצר קבוצות מפגש',
    ariaLabel: 'יוצר קבוצות מפגש',
    dataCy: 'generator-view-button',
    icon: null,
  },
  {
    id: 'board' as const,
    label: 'לוח מפגשים',
    ariaLabel: 'לוח מפגשים',
    dataCy: 'board-view-button',
    icon: Eye,
  },
  {
    id: 'table' as const,
    label: 'תצוגה ברשימה',
    ariaLabel: 'תצוגת טבלה',
    dataCy: 'table-view-button',
    icon: Table,
  },
  {
    id: 'share' as const,
    label: 'שיתוף',
    ariaLabel: 'שיתוף וגיבוי',
    dataCy: 'share-view-button',
    icon: Share,
  },
]

export function ViewPlanModeNavigation({ 
  viewMode, 
  onViewModeChange, 
  hasAssignments 
}: ViewPlanModeNavigationProps) {
  if (!hasAssignments) return null

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="view-mode-nav view-mode-responsive" role="tablist" aria-label="מצבי תצוגה">
          {viewModeItems.map((item) => {
            const Icon = item.icon
            const isActive = viewMode === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'view-mode-tab',
                  isActive ? 'view-mode-tab-active' : 'view-mode-tab-inactive'
                )}
                onClick={() => onViewModeChange(item.id)}
                role="tab"
                aria-selected={isActive}
                aria-label={item.ariaLabel}
                data-cy={item.dataCy}
              >
                {Icon && <Icon className="h-4 w-4 ml-2 padding-left-default" />}
                {item.label}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
