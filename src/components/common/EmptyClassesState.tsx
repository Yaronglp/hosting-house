import { BookOpen } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface EmptyClassesStateProps {
  onAddClass: () => void
}

export function EmptyClassesState({ onAddClass }: EmptyClassesStateProps) {
  return (
    <EmptyState
      icon={<BookOpen className="h-6 w-6" />}
      title="אין כיתות עדיין"
      description="התחל על ידי יצירת הכיתה הראשונה שלך. כל כיתה תוכל לנהל תלמידים, סבבי אירוח והגדרות נפרדות."
      action={{
        label: "צור כיתה ראשונה",
        onClick: onAddClass
      }}
    />
  )
}
