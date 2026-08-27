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
    variant={isSelected ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
    data-cy="student-chip"
  >
    {student.name}
  </Button>
))

StudentChip.displayName = 'StudentChip'
