import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/useKV'
import { Round, KV_KEYS } from '@/lib/types'
import { useToast } from '@/hooks/useToast'
import { FormCard } from './FormCard'
import { FormField } from './FormField'
import { FormInput } from './FormInput'
import { FormActions } from './FormActions'
import { useFormSubmit } from './useFormSubmit'

interface RoundFormProps {
  classId: string
  roundId?: string // undefined for new round
  onSave: (roundId: string) => void
  onCancel: () => void
  onRoundAdded?: () => void
  onRoundUpdated?: () => void
}

export function RoundForm({ classId, roundId, onSave, onCancel, onRoundAdded, onRoundUpdated }: RoundFormProps) {
  const [rounds, setRounds] = useKV<Round[]>(KV_KEYS.rounds(classId), [])
  const [formData, setFormData] = useState({
    date: ''
  })

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

  const { handleSubmit, isLoading } = useFormSubmit({
    onSubmit: async (data) => {
      // Check for duplicate dates
      const selectedDateString = new Date(data.date).toDateString()
      const existingDate = rounds.find(r => {
        if (!r.dateWindow) return false
        return new Date(r.dateWindow.start).toDateString() === selectedDateString
      })

      if (existingDate && (!roundId || existingDate.id !== roundId)) {
        throw new Error('תאריך זה כבר קיים במערכת')
      }

      if (roundId) {
        // Edit existing round
        const updatedRounds = rounds.map(r => 
          r.id === roundId 
            ? { 
                ...r, 
                name: new Date(data.date).toLocaleDateString('he-IL'),
                dateWindow: {
                  start: new Date(data.date)
                }
              }
            : r
        )
        await setRounds(updatedRounds)
        onRoundUpdated?.()
        onSave(roundId)
      } else {
        // Create new round
        const newRoundId = `round_${Date.now()}_${Math.random().toString(36).substring(2)}`
        const newRound: Round = {
          id: newRoundId,
          classId,
          name: new Date(data.date).toLocaleDateString('he-IL'),
          dateWindow: {
            start: new Date(data.date)
          },
          order: rounds.length
        }
        
        const updatedRounds = [...rounds, newRound]
        await setRounds(updatedRounds)
        onRoundAdded?.()
        onSave(newRoundId)
      }
    },
    onSuccess: () => {},
    validate: (data) => !data.date ? 'תאריך המפגש הוא שדה חובה' : null
  })

  return (
    <FormCard title={roundId ? 'ערוך תאריך מפגש' : 'הוסף תאריך מפגש'}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData) }} data-cy="round-form">
        <FormField label="תאריך המפגש" required>
          <FormInput
            id="date"
            type="date"
            value={formData.date}
            onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
            min={new Date().toISOString().split('T')[0]}
            required
            testId="round-date-input"
          />
        </FormField>

        <FormActions
          onCancel={onCancel}
          onSubmit={() => handleSubmit(formData)}
          isLoading={isLoading}
        />
      </form>
    </FormCard>
  )
}
