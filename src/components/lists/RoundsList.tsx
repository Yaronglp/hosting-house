import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useKV } from '@/hooks/useKV'
import { Round, KV_KEYS } from '@/lib/types'
import { useToast } from '@/hooks/useToast'
import { ConfirmDialog } from '@/components/ui/Dialog'

interface RoundsListProps {
  classId: string
  onRoundEdit: (roundId: string) => void
  onRoundAdd: () => void
}

export function RoundsList({ classId, onRoundEdit, onRoundAdd }: RoundsListProps) {
  const [rounds, setRounds] = useKV<Round[]>(KV_KEYS.rounds(classId), [])
  const { error } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)

  const handleDeleteClick = (roundId: string) => {
    const round = rounds.find(r => r.id === roundId)
    if (!round) return
    setDeleteConfirm({ id: roundId, name: round.name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    
    setIsDeleting(deleteConfirm.id)
    try {
      // Remove the round and reorder remaining rounds
      const updatedRounds = rounds
        .filter(r => r.id !== deleteConfirm.id)
        .map((r, index) => ({ ...r, order: index }))
      
      await setRounds(updatedRounds)
    } catch (err) {
      console.error('Failed to delete round:', err)
      error('שגיאה במחיקת תאריך המפגש')
    } finally {
      setIsDeleting(null)
    }
  }

  // Sort rounds by order
  const sortedRounds = [...rounds].sort((a, b) => a.order - b.order)

  if (rounds.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">אין תאריכי מפגש בכיתה</p>
          <Button onClick={onRoundAdd} data-cy="add-round-button">הוסף תאריך מפגש</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">תאריכי מפגש</h2>
          <p className="text-sm text-muted-foreground">
            {rounds.length} תאריכי מפגש מוגדרים
          </p>
        </div>
        <Button onClick={onRoundAdd} data-cy="add-round-button">
          הוסף תאריך מפגש
        </Button>
      </div>
      
      <div className="space-y-3">
        {sortedRounds.map((round, index) => (
          <Card key={round.id} className="relative" data-cy="round-item">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{round.order + 1}
                    </span>
                  </div>
                  
                  <CardDescription>
                    תאריך: {new Date(round.dateWindow.start).toLocaleDateString('he-IL')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRoundEdit(round.id)}
                    data-cy="edit-round-button"
                  >
                    ערוך
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting === round.id}
                    onClick={() => handleDeleteClick(round.id)}
                    data-cy="delete-round-button"
                  >
                    {isDeleting === round.id ? 'מוחק...' : 'מחק'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="מחק תאריך מפגש"
        message={deleteConfirm ? `האם אתה בטוח שברצונך למחוק את "${deleteConfirm.name}"?` : ''}
        confirmText="מחק"
        cancelText="ביטול"
        variant="danger"
        data-cy="confirm-delete-button"
      />
    </div>
  )
}
