import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useClasses } from '@/hooks/useClasses'
import { Student, KV_KEYS } from '@/lib/types'
import { kvGet } from '@/lib/db'
import { EmptyClassesState } from '@/components/common/EmptyClassesState'
import { useAnnouncer } from '@/hooks/useAccessibility'
import { Trash2, Edit, Users } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/Dialog'

interface ClassesListProps {
  currentClassId: string | null
  onClassSelect: (classId: string | null) => void
  onClassEdit: (classId: string) => void
  onClassAdd: () => void
}

export function ClassesList({ currentClassId, onClassSelect, onClassEdit, onClassAdd }: ClassesListProps) {
  const [classes, setClasses] = useClasses()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({})
  const announce = useAnnouncer()

  // Load student counts for all classes
  useEffect(() => {
    const loadStudentCounts = async () => {
      const counts: Record<string, number> = {}
      for (const cls of classes) {
        const studentsKey = KV_KEYS.students(cls.id)
        try {
          const students = await kvGet<Student[]>(studentsKey) || []
          counts[cls.id] = students.length
        } catch {
          counts[cls.id] = 0
        }
      }
      setStudentCounts(counts)
    }
    loadStudentCounts()
  }, [classes])

  const handleDeleteClick = (classId: string) => {
    const classToDelete = classes.find(c => c.id === classId)
    if (!classToDelete) return
    setDeleteConfirm({ id: classId, name: classToDelete.name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    
    const classToDelete = classes.find(c => c.id === deleteConfirm.id)
    setIsDeleting(deleteConfirm.id)
    
    try {
      const updatedClasses = classes.filter(c => c.id !== deleteConfirm.id)
      await setClasses(updatedClasses)
      
      // If deleted class was selected, select another one
      if (currentClassId === deleteConfirm.id && updatedClasses.length > 0) {
        onClassSelect(updatedClasses[0].id)
      }
      
      announce(`כיתה "${classToDelete?.name}" נמחקה בהצלחה`)
    } catch (error) {
      console.error('Failed to delete class:', error)
      announce('שגיאה במחיקת הכיתה', 'assertive')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSelectClass = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId)
    onClassSelect(classId)
    announce(`נבחרה כיתה: ${selectedClass?.name}`)
  }

  // Show empty state if no classes
  if (classes.length === 0) {
    return <EmptyClassesState onAddClass={onClassAdd} />
  }

  return (
    <div className="space-y-4 w-full">
      {classes.map((cls) => (
        <Card 
          key={cls.id} 
          className={`w-full cursor-pointer transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-neon-cyan ${
            currentClassId === cls.id ? 'ring-2 ring-neon-cyan bg-[var(--overlay-neon-cyan-10)]' : ''
          }`}
          onClick={() => handleSelectClass(cls.id)}
          role="button"
          tabIndex={0}
          aria-label={`בחר כיתה ${cls.name}`}
          data-cy="class-item"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleSelectClass(cls.id)
            }
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                {cls.year && (
                  <CardDescription>שנת לימודים {cls.year}</CardDescription>
                )}
                <CardDescription className="flex items-center gap-1 text-sm mt-1">
                  <Users className="h-3.5 w-3.5" />
                  {studentCounts[cls.id] !== undefined ? studentCounts[cls.id] : '...'} תלמידים
                </CardDescription>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  נוצר: {new Date(cls.createdAt).toLocaleDateString('he-IL')}
                </CardDescription>
              </div>
              
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClassEdit(cls.id)
                  }}
                  aria-label={`ערוך כיתה ${cls.name}`}
                  className="h-8 w-8 p-0 hover:bg-[var(--overlay-neon-cyan-10)] focus:ring-2 focus:ring-neon-cyan"
                  data-cy="edit-class-button"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(cls.id)
                  }}
                  disabled={isDeleting === cls.id}
                  aria-label={`מחק כיתה ${cls.name}`}
                  className="h-8 w-8 p-0 hover:bg-[var(--validation-error-bg)] focus:ring-2 focus:ring-[var(--validation-error-border)] disabled:opacity-50"
                  data-cy="delete-class-button"
                >
                  {isDeleting === cls.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--validation-error-icon)] border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-[var(--validation-error-icon)]" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 pb-6">
            <div className={`flex items-center gap-2 text-sm rounded-md px-3 py-2 ${
              currentClassId !== cls.id && 'text-transparent bg-transparent pointer-events-none select-none'
            }`}>
              <Users className="h-4 w-4" />
              <span>כיתה פעילה</span>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="w-full border-dashed border-2 border-muted hover:border-neon-cyan transition-colors">
        <CardContent className="py-8">
          <div className="text-center">
            <Button 
              onClick={onClassAdd}
              aria-label="הוסף כיתה חדשה"
              data-cy="add-class-button"
            >
              + הוסף כיתה חדשה
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="מחק כיתה"
        message={deleteConfirm ? `האם אתה בטוח שברצונך למחוק את כיתה "${deleteConfirm.name}"? פעולה זו לא ניתנת לביטול.` : ''}
        confirmText="מחק"
        cancelText="ביטול"
        variant="danger"
        data-cy="confirm-delete-button"
      />
    </div>
  )
}
