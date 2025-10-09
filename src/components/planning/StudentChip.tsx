import { memo } from 'react'
import { Student } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface StudentChipProps {
  student: Student
  isSelected: boolean
  onClick: () => void
}

export const StudentChip = memo(({ student, isSelected, onClick }: StudentChipProps) => (
  <Button
    variant={isSelected ? "default" : "ghost"}
    size="sm"
    className={`px-2 py-1 text-xs ${
      isSelected
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    onClick={onClick}
    data-cy="student-chip"
  >
    {student.name}
  </Button>
))

StudentChip.displayName = 'StudentChip'
