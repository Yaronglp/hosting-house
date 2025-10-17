import { Student } from '@/lib/types'
import { FormCheckbox } from './FormCheckbox'

interface StudentPreferencesProps {
  students: Student[]
  currentStudentId?: string
  avoid: string[]
  onAvoidChange: (studentIds: string[]) => void
}

export function StudentPreferences({
  students,
  currentStudentId,
  avoid,
  onAvoidChange
}: StudentPreferencesProps) {
  const otherStudents = students.filter(student => student.id !== currentStudentId)

  if (otherStudents.length === 0) {
    return null
  }

  const handleAvoidToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      onAvoidChange([...avoid, studentId])
    } else {
      onAvoidChange(avoid.filter(id => id !== studentId))
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium mb-2 mt-2 padding-vertical-default">
        תלמידים שהתלמיד מעדיף לא להיות איתם
      </label>
      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-input rounded-md p-2 padding-default">
        {otherStudents.map(student => (
          <FormCheckbox
            key={student.id}
            id={`avoid-${student.id}`}
            checked={avoid.includes(student.id)}
            onChange={(checked) => handleAvoidToggle(student.id, checked)}
            label={student.name}
            testId="avoid-student-checkbox"
            className="padding-default"
          />
        ))}
      </div>
    </div>
  )
}
