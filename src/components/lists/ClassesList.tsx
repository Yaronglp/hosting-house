import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card'
import { cn, compactButtonLabelClass } from '@/components/ui/utils'
import { useClasses } from '@/hooks/useClasses'
import { Student, KV_KEYS } from '@/lib/types'
import { kvGet } from '@/lib/db'
import { EmptyClassesState } from '@/components/common/EmptyClassesState'
import { useAnnouncer } from '@/hooks/useAccessibility'
import { useToast } from '@/hooks/useToast'
import { Trash2, Edit, Users, Award, Settings } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/Dialog'

const ACTIVE_CLASS_INDICATOR: 'badge' | 'footer' | 'footer-all' = 'badge'

interface ClassesListProps {
  currentClassId: string | null
  onClassSelect: (classId: string | null) => void
  onClassEdit: (classId: string) => void
  onClassAdd: () => void
  onClassSettings?: (classId: string) => void
}

export function ClassesList({ currentClassId, onClassSelect, onClassEdit, onClassAdd, onClassSettings }: ClassesListProps) {
  const [classes, setClasses] = useClasses()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({})
  const announce = useAnnouncer()
  const { success } = useToast()

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
      success(`נמחקה כיתה "${classToDelete?.name}" בהצלחה!`)
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
    <div className="w-full">
      <div className="flex justify-between items-center padding-bottom-default mb-2">
        <p className="text-lg text-muted-foreground">
          {classes.length} כיתות מוגדרות
        </p>
        <Button onClick={onClassAdd} data-cy="add-class-button" className={compactButtonLabelClass}>
          הוסף כיתה חדשה
        </Button>
      </div>

      <div className="classes-list">
      {classes.map((cls) => (
        <Card 
          key={cls.id} 
          className={`w-full cursor-pointer transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary ${
            currentClassId === cls.id ? 'ring-2 ring-primary ring-offset-2 selected-surface' : ''
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{cls.name}</CardTitle>
                  {ACTIVE_CLASS_INDICATOR === 'badge' && currentClassId === cls.id && (
                    <span className="active-class-badge" data-cy="active-class-badge">
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      כיתה פעילה
                    </span>
                  )}
                </div>
                {cls.year && (
                  <CardDescription>שנת לימודים {cls.year}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
              <p className="flex items-center gap-1 mt-0">
                <Users className="h-3.5 w-3.5" />
                <span className="padding-right-default">{studentCounts[cls.id] !== undefined ? studentCounts[cls.id] : '...'} תלמידים</span>
              </p>
              <p className="mb-0">נוצר: {new Date(cls.createdAt).toLocaleDateString('he-IL')}</p>
              </CardContent>
            </div>
            
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              {onClassSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClassSettings(cls.id)
                  }}
                  aria-label={`הגדרות כיתה ${cls.name}`}
                  className="h-8 w-8 p-0 interactive-surface focus:ring-2 focus:ring-primary"
                  data-cy="settings-button"
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClassEdit(cls.id)
                }}
                aria-label={`ערוך כיתה ${cls.name}`}
                className="h-8 w-8 p-0 interactive-surface focus:ring-2 focus:ring-primary"
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
          
          {ACTIVE_CLASS_INDICATOR !== 'badge' &&
            (ACTIVE_CLASS_INDICATOR === 'footer-all' || currentClassId === cls.id) && (
            <CardFooter className={cn(
              'card-footer-meta',
              currentClassId === cls.id
                ? 'text-[var(--selection-info-text)]'
                : 'text-transparent bg-transparent pointer-events-none select-none border-transparent'
            )}>
              <Award className="h-4 w-4" />
              <span className="padding-right-default">כיתה פעילה</span>
            </CardFooter>
          )}
        </Card>
      ))}
      </div>

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
