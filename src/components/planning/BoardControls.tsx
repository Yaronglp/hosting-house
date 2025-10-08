import { memo } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRightLeft } from 'lucide-react'

interface BoardControlsProps {
  moveHistoryLength: number
  selectedStudentId: string | null
  onUndo: () => void
  onCancelSelection: () => void
}

export const BoardControls = memo(({ 
  moveHistoryLength, 
  selectedStudentId, 
  onUndo, 
  onCancelSelection 
}: BoardControlsProps) => (
  <div className="flex items-center justify-between">
    <div className="text-sm text-muted-foreground padding-bottom-default">
      לחץ על תלמיד כדי לבחור, ואז על קבוצה כדי להעביר
    </div>
    <div className="flex gap-2">
      {moveHistoryLength > 0 && (
        <Button variant="outline" size="sm" onClick={onUndo}>
          <ArrowRightLeft className="h-4 w-4 ml-2 padding-left-default" />
          בטל מעבר אחרון
        </Button>
      )}
      {selectedStudentId && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancelSelection}
        >
          בטל בחירה
        </Button>
      )}
    </div>
  </div>
))

BoardControls.displayName = 'BoardControls'
