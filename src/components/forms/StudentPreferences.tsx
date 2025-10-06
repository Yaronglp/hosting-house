import { Student } from '@/lib/types'

interface StudentPreferencesProps {
  students: Student[]
  currentStudentId?: string
  like: string[]
  avoid: string[]
  onLikeChange: (studentIds: string[]) => void
  onAvoidChange: (studentIds: string[]) => void
}

export function StudentPreferences({
  students,
  currentStudentId,
  like,
  avoid,
  onLikeChange,
  onAvoidChange
}: StudentPreferencesProps) {
  const otherStudents = students.filter(s => s.id !== currentStudentId)

  if (otherStudents.length === 0) {
    return null
  }

  const handleLikeToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      onLikeChange([...like, studentId])
      onAvoidChange(avoid.filter(id => id !== studentId))
    } else {
      onLikeChange(like.filter(id => id !== studentId))
    }
  }

  const handleAvoidToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      onAvoidChange([...avoid, studentId])
      onLikeChange(like.filter(id => id !== studentId))
    } else {
      onAvoidChange(avoid.filter(id => id !== studentId))
    }
  }

  const selectAllLike = () => {
    onLikeChange(otherStudents.map(s => s.id))
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium" style={{ alignSelf: 'end' }}>
            תלמידים שהתלמיד אוהב להיות איתם
          </label>
          <button
            type="button"
            onClick={selectAllLike}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            סמן הכל
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-input rounded-md p-2">
          {otherStudents.map(student => (
            <label key={student.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={like.includes(student.id)}
                onChange={(e) => handleLikeToggle(student.id, e.target.checked)}
                className="rounded"
                data-cy="like-student-checkbox"
              />
              <span>{student.name}</span>
            </label>
          ))}
        </div>
      </div>

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
    </>
  )
}
