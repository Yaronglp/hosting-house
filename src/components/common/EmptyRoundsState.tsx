import { Clock } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface EmptyRoundsStateProps {
  onAddRound: () => void
}

export function EmptyRoundsState({ onAddRound }: EmptyRoundsStateProps) {
  return (
    <EmptyState
      icon={<Clock className="h-6 w-6" />}
      title="אין סבבי אירוח"
      description="צור סבבי אירוח כדי לתכנן מתי כל תלמיד יארח. כל סבב יכול לכלול תאריכים ושמות מותאמים אישית."
      action={{
        label: "הוסף סבב ראשון",
        onClick: onAddRound
      }}
    />
  )
}
