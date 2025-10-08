import { Clock } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface EmptyRoundsStateProps {
  onAddRound: () => void
}

export function EmptyRoundsState({ onAddRound }: EmptyRoundsStateProps) {
  return (
    <EmptyState
      icon={<Clock className="h-6 w-6" />}
      title="אין תאריכי מפגש"
      description="צור תאריכי מפגש כדי לתכנן מתי כל תלמיד יארח. כל תאריך מפגש יכול לכלול תאריכים ושמות מותאמים אישית."
      action={{
        label: "הוסף תאריך מפגש",
        onClick: onAddRound
      }}
    />
  )
}
