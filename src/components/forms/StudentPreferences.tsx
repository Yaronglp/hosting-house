import { Student } from '@/lib/types'

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
  const otherStudents = students.filter(s => s.id !== currentStudentId)

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
      <label className="block text-sm font-medium mb-2">
        תלמידים שהתלמיד מעדיף לא להיות איתם
      </label>
      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-input rounded-md p-2">
        {otherStudents.map(student => (
          <label key={student.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={avoid.includes(student.id)}
              onChange={(e) => handleAvoidToggle(student.id, e.target.checked)}
              className="rounded"
              data-cy="avoid-student-checkbox"
            />
            <span>{student.name}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
