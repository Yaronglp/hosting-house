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
  const { error, success } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)

  const handleDeleteClick = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (!student) return
    setDeleteConfirm({ id: studentId, name: student.name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    
    const studentToDelete = students.find(s => s.id === deleteConfirm.id)
    setIsDeleting(deleteConfirm.id)
    try {
      const updatedStudents = students.filter(s => s.id !== deleteConfirm.id)
      await setStudents(updatedStudents)
      success(`נמחק תלמיד "${studentToDelete?.name}" בהצלחה!`)
    } catch (err) {
      console.error('Failed to delete student:', err)
      error('שגיאה במחיקת התלמיד')
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleCanHost = async (studentId: string) => {
    try {
      const updatedStudents = students.map(student => 
        student.id === studentId 
          ? { ...student, canHost: !student.canHost }
          : student
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
          <p className="mb-4 text-xl">אין תלמידים בכיתה</p>
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
          <h2 className="text-xl font-semibold margin-top-default">תלמידי הכיתה</h2>
          <p className="text-xl">
            {students.length} תלמידים <br /> {students.filter(s => s.canHost).length} יכולים לארח
          </p>
        </div>
        <div className="students-actions-buttons">
          <Button variant="outline" onClick={onPasteNames} data-cy="paste-names-button" className="students-actions-button">
          הזן רשימת שמות תלמידים
          </Button>
          <Button onClick={onStudentAdd} data-cy="add-student-button" className="students-actions-button">
            הוסף תלמיד
          </Button>
        </div>
      </div>

      <div className="text-lg padding-vertical-default flex">
        <span>💡</span>
        <strong className="padding-left-default">טיפ:</strong> לחץ על "יכול לארח" כדי לשנות במהירות את יכולת התלמיד לארח.
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-right p-3 font-medium text-xl">שם</th>
              <th className="text-center p-3 font-medium text-xl">יכול לארח</th>
              <th className="text-center p-3 font-medium text-xl">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-muted/50" data-cy="student-item">
                <td className="p-3 padding-vertical-default">
                  <div className="font-medium text-xl">{student.name}</div>
                  <div className="text-lg padding-top-default">
                    {student.avoid.length > 0 && `כמות תלמידים שהתלמיד מעדיף לא להיות איתם: ${student.avoid.length}`}
                  </div>
                </td>
                <td className="p-3 text-center padding-vertical-default">
                  <Button
                    onClick={() => toggleCanHost(student.id)}
                    size="sm"
                    variant={student.canHost ? 'default' : 'outline'}
                    className="min-w-[3rem]"
                    data-cy="student-can-host-toggle"
                  >
                    {student.canHost ? 'כן' : 'לא'}
                  </Button>
                </td>
                <td className="p-3 text-center padding-vertical-default">
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
