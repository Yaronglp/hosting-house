import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useStudents } from '@/hooks/useStudents'
import { useToast } from '@/hooks/useToast'
import { ConfirmDialog } from '@/components/ui/Dialog'

interface StudentsTableProps {
  classId: string
  onStudentEdit: (studentId: string) => void
  onStudentAdd: () => void
  onPasteNames: () => void
}

export function StudentsTable({ classId, onStudentEdit, onStudentAdd, onPasteNames }: StudentsTableProps) {
  const [students, setStudents] = useStudents(classId)
  const { error } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)

  const handleDeleteClick = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (!student) return
    setDeleteConfirm({ id: studentId, name: student.name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    
    setIsDeleting(deleteConfirm.id)
    try {
      const updatedStudents = students.filter(s => s.id !== deleteConfirm.id)
      await setStudents(updatedStudents)
    } catch (err) {
      console.error('Failed to delete student:', err)
      error('שגיאה במחיקת התלמיד')
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleCanHost = async (studentId: string) => {
    try {
      const updatedStudents = students.map(s => 
        s.id === studentId 
          ? { ...s, canHost: !s.canHost }
          : s
      )
      await setStudents(updatedStudents)
    } catch (err) {
      console.error('Failed to update student:', err)
      error('שגיאה בעדכון התלמיד')
    }
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">אין תלמידים בכיתה</p>
          <div className="flex gap-2">
            <Button onClick={onStudentAdd} data-cy="add-student-button">הוסף תלמיד</Button>
            <Button variant="outline" onClick={onPasteNames} data-cy="paste-names-button">הזן רשימת שמות תלמידים</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold margin-top-default">תלמידי הכיתה</h2>
          <p className="text-sm text-muted-foreground">
            {students.length} תלמידים <br /> {students.filter(s => s.canHost).length} יכולים לארח
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPasteNames} data-cy="paste-names-button">
          הזן רשימת שמות תלמידים
          </Button>
          <Button onClick={onStudentAdd} data-cy="add-student-button">
            הוסף תלמיד
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground padding-vertical-default">
        💡 <strong>טיפ:</strong> לחץ על "יכול לארח" כדי לשנות במהירות
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-right p-3 font-medium">שם</th>
              <th className="text-center p-3 font-medium">יכול לארח</th>
              <th className="text-center p-3 font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-muted/50" data-cy="student-item">
                <td className="p-3">
                  <div className="font-medium">{student.name}</div>
                  <div className="text-xs text-muted-foreground text-small">
                    {student.avoid.length > 0 && `כמות תלמידים שהתלמיד מעדיף לא להיות איתם: ${student.avoid.length}`}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <Button
                    onClick={() => toggleCanHost(student.id)}
                    size="sm"
                    variant={student.canHost ? "default" : "ghost"}
                    style={{ width: '64px', minWidth: '64px', maxWidth: '64px' }}
                    className={`px-2 py-1 text-xs font-medium ${
                      student.canHost 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    data-cy="student-can-host-toggle"
                  >
                    {student.canHost ? 'כן' : 'לא'}
                  </Button>
                </td>
                <td className="p-3 text-center">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStudentEdit(student.id)}
                      data-cy="edit-student-button"
                    >
                      ערוך
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting === student.id}
                      onClick={() => handleDeleteClick(student.id)}
                      data-cy="delete-student-button"
                    >
                      {isDeleting === student.id ? 'מוחק...' : 'מחק'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="מחק תלמיד"
        message={deleteConfirm ? `האם אתה בטוח שברצונך למחוק את ${deleteConfirm.name}?` : ''}
        confirmText="מחק"
        cancelText="ביטול"
        variant="danger"
        data-cy="confirm-delete-button"
      />
    </div>
  )
}
