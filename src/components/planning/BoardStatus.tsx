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
      <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
        {error}
      </div>
    )}

    {selectedStudentId && (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="text-blue-800 text-sm">
          נבחר: <strong>{selectedStudent?.name}</strong>
          <span className="text-blue-600 mr-2">- בחר קבוצה יעד</span>
        </div>
      </div>
    )}
  </>
))

BoardStatus.displayName = 'BoardStatus'
