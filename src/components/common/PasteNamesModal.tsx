import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useStudents } from '@/hooks/useStudents'
import { Student } from '@/lib/types'
import { useToast } from '@/hooks/useToast'

interface PasteNamesModalProps {
  classId: string
  groupSize: number
  onClose: () => void
  onStudentsAdded: (count: number) => void
}

export function PasteNamesModal({ classId, groupSize, onClose, onStudentsAdded }: PasteNamesModalProps) {
  const [students, setStudents] = useStudents(classId)
  const { error } = useToast()
  const [namesText, setNamesText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      setMounted(false)
      document.body.style.overflow = ''
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!namesText.trim()) {
      error('אנא הזן שמות תלמידים')
      return
    }

    setIsLoading(true)
    try {
      // Parse names from textarea (one per line)
      const names = namesText
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0)
        .filter((name, index, array) => array.indexOf(name) === index) // Remove duplicates

      if (names.length === 0) {
        error('לא נמצאו שמות תקינים')
        return
      }

      // Create new students
      const newStudents: Student[] = names.map(name => {
        const studentId = `student_${Date.now()}_${Math.random().toString(36).substring(2)}`
        
        return {
          id: studentId,
          classId,
          name,
          canHost: true,
          avoid: []
        }
      })

      // Add to existing students
      const updatedStudents = [...students, ...newStudents]
      await setStudents(updatedStudents)
      
      onStudentsAdded(newStudents.length)
      onClose()
    } catch (err) {
      console.error('Failed to add students:', err)
      error('שגיאה בהוספת התלמידים')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      data-cy="paste-modal"
    >
      <div className="w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
        <Card className="w-full shadow-2xl border-2 bg-card">
          <CardHeader>
            <CardTitle>הוסף תלמידים</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="names" className="block text-sm font-medium mb-2 padding-bottom-default">
                  שמות התלמידים (שורה אחת לכל תלמיד)
                </label>
                <textarea
                  id="names"
                  value={namesText}
                  onChange={(e) => setNamesText(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring resize-none bg-input text-foreground padding-default"
                  style={{ height: '6rem', lineHeight: '1.5rem' }}
                  placeholder="יוסי כהן&#10;שרה לוי&#10;..."
                  dir="rtl"
                  required
                  data-cy="names-textarea"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  כל שם בשורה נפרדת. שמות כפולים יוסרו אוטומטית.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onClose} data-cy="cancel-paste-button">
                  ביטול
                </Button>
                <Button type="submit" disabled={isLoading} data-cy="add-students-button">
                  {isLoading ? 'מוסיף...' : 'הוסף תלמידים'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
