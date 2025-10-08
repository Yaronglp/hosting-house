import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useKV } from '@/hooks/useKV'
import { Round, KV_KEYS } from '@/lib/types'
import { useToast } from '@/hooks/useToast'

interface RoundFormProps {
  classId: string
  roundId?: string // undefined for new round
  onSave: (roundId: string) => void
  onCancel: () => void
}

export function RoundForm({ classId, roundId, onSave, onCancel }: RoundFormProps) {
  const [rounds, setRounds] = useKV<Round[]>(KV_KEYS.rounds(classId), [])
  const { error } = useToast()
  const [formData, setFormData] = useState({
    date: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Load existing round data if editing
  useEffect(() => {
    if (roundId) {
      const existingRound = rounds.find(r => r.id === roundId)
      if (existingRound) {
        setFormData({
          date: existingRound.dateWindow?.start ? 
            new Date(existingRound.dateWindow.start).toISOString().split('T')[0] : ''
        })
      }
    }
  }, [roundId, rounds])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date) {
      error('אנא הזן תאריך המפגש')
      return
    }

    // Check if date is in the past
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    
    if (selectedDate < today) {
      error('לא ניתן לבחור תאריך בעבר')
      return
    }

    // Check for duplicate dates
    const selectedDateString = new Date(formData.date).toDateString()
    const existingDate = rounds.find(r => {
      if (!r.dateWindow) return false
      return new Date(r.dateWindow.start).toDateString() === selectedDateString
    })

    if (existingDate && (!roundId || existingDate.id !== roundId)) {
      error('תאריך זה כבר קיים במערכת')
      return
    }

    setIsLoading(true)
    try {
      if (roundId) {
        // Edit existing round
        const updatedRounds = rounds.map(r => 
          r.id === roundId 
            ? { 
                ...r, 
                name: new Date(formData.date).toLocaleDateString('he-IL'),
                dateWindow: {
                  start: new Date(formData.date),
                  end: new Date(formData.date)
                }
              }
            : r
        )
        await setRounds(updatedRounds)
        onSave(roundId)
      } else {
        // Create new round
        const newRoundId = `round_${Date.now()}_${Math.random().toString(36).substring(2)}`
        const newRound: Round = {
          id: newRoundId,
          classId,
          name: new Date(formData.date).toLocaleDateString('he-IL'),
          dateWindow: {
            start: new Date(formData.date),
            end: new Date(formData.date)
          },
          order: rounds.length // Add to end
        }
        
        const updatedRounds = [...rounds, newRound]
        await setRounds(updatedRounds)
        onSave(newRoundId)
      }
    } catch (err) {
      console.error('Failed to save round:', err)
      error('שגיאה בשמירת תאריך המפגש')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roundId ? 'ערוך תאריך מפגש' : 'הוסף תאריך מפגש'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} data-cy="round-form">
          <div className="p-4 bg-muted/50 rounded-lg max-w-md padding-default" style={{ marginTop: '1rem' }}>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              תאריך המפגש *
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="w-44 px-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              data-cy="round-date-input"
            />
          </div>

          <div className="flex gap-3 justify-end" style={{ marginTop: '2rem' }}>
            <Button type="button" variant="outline" onClick={onCancel} data-cy="cancel-round-button">
              ביטול
            </Button>
            <Button type="submit" disabled={isLoading} data-cy="save-round-button">
              {isLoading ? 'שומר...' : 'שמור'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
