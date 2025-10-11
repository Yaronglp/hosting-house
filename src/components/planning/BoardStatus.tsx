import { memo } from 'react'
import { Student } from '@/lib/types'

interface BoardStatusProps {
  error: string | null
  selectedStudentId: string | null
  selectedStudent: Student | undefined
}

export const BoardStatus = memo(({ error, selectedStudentId, selectedStudent }: BoardStatusProps) => (
  <>
    {error && (
      <div className="bg-[var(--validation-error-bg)] border-[var(--validation-error-border)] rounded-md p-3 text-[var(--validation-error-text)] text-sm">
        {error}
      </div>
    )}

    {selectedStudentId && (
      <div className="bg-[var(--validation-info-bg)] border-[var(--validation-info-border)] rounded-md p-3">
        <div className="text-[var(--selection-info-text)] text-sm">
          נבחר: <strong>{selectedStudent?.name}</strong> - בחר קבוצת יעד
        </div>
      </div>
    )}
  </>
))

BoardStatus.displayName = 'BoardStatus'
