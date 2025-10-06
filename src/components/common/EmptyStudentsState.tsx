import { Users } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface EmptyStudentsStateProps {
  onAddStudents: () => void
}

export function EmptyStudentsState({ onAddStudents }: EmptyStudentsStateProps) {
  return (
    <EmptyState
      icon={<Users className="h-6 w-6" />}
      title="אין תלמידים בכיתה"
      description="הוסף תלמידים לכיתה כדי להתחיל לתכנן את סבבי בית המארח. תוכל להדביק רשימת שמות או להוסיף תלמידים אחד אחד."
      action={{
        label: "הוסף תלמידים",
        onClick: onAddStudents
      }}
    />
  )
}
