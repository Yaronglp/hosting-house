import { Sparkles, Users, Clock } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface EmptyPlanStateProps {
  onGenerate: () => void
  hasStudents: boolean
  hasRounds: boolean
}

export function EmptyPlanState({ 
  onGenerate, 
  hasStudents, 
  hasRounds 
}: EmptyPlanStateProps) {
  if (!hasStudents && !hasRounds) {
    return (
      <EmptyState
        icon={<Sparkles className="h-6 w-6" />}
        title="מוכן להתחיל?"
        description="כדי ליצור תוכנית בית מארח, תחילה הוסף תלמידים וצור סבבי אירוח. אחר כך תוכל ליצור תוכנית אוטומטית עם כל ההעדפות והמגבלות."
      />
    )
  }

  if (!hasStudents) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="חסרים תלמידים"
        description="הוסף תלמידים לכיתה כדי ליצור תוכנית אירוח. לפחות תלמיד אחד נדרש כדי להתחיל."
      />
    )
  }

  if (!hasRounds) {
    return (
      <EmptyState
        icon={<Clock className="h-6 w-6" />}
        title="חסרים סבבי אירוח"
        description="צור לפחות סבב אירוח אחד כדי ליצור תוכנית. כל סבב מייצג מועד שבו תלמיד יארח את הכיתה."
      />
    )
  }

  return (
    <EmptyState
      icon={<Sparkles className="h-6 w-6" />}
      title="מוכן ליצור תוכנית!"
      description="יש לך תלמידים וסבבי אירוח. לחץ על 'צור תוכנית' כדי ליצור שיבוץ אוטומטי שמתחשב בכל ההעדפות והמגבלות שהגדרת."
      action={{
        label: "צור תוכנית",
        onClick: onGenerate
      }}
    />
  )
}
