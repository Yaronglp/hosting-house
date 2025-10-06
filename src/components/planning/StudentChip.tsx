import { memo } from 'react'
import { Student } from '@/lib/types'

interface StudentChipProps {
  student: Student
  isSelected: boolean
  onClick: () => void
}

export const StudentChip = memo(({ student, isSelected, onClick }: StudentChipProps) => (
  <button
    className={`px-2 py-1 text-xs rounded-md transition-colors ${
      isSelected
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    onClick={onClick}
    data-cy="student-chip"
  >
    {student.name}
  </button>
))

StudentChip.displayName = 'StudentChip'
