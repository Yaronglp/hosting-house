import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/useKV'
import { ClassSettings as ClassSettingsType, KV_KEYS, DEFAULT_SETTINGS } from '@/lib/types'
import { FormCard } from '@/components/forms/FormCard'
import { FormField } from '@/components/forms/FormField'
import { FormInput } from '@/components/forms/FormInput'
import { FormActions } from '@/components/forms/FormActions'
import { useFormSubmit } from '@/components/forms/useFormSubmit'

interface ClassSettingsProps {
  classId: string
  className: string
  onClose: () => void
}

export function ClassSettings({ classId, className, onClose }: ClassSettingsProps) {
  const [settings, setSettings] = useKV<ClassSettingsType>(
    KV_KEYS.settings(classId), 
    DEFAULT_SETTINGS
  )
  const [formData, setFormData] = useState({
    groupSize: DEFAULT_SETTINGS.groupSize,
  })

  // Load current settings into form
  useEffect(() => {
    setFormData({
      groupSize: settings.groupSize,
    })
  }, [settings])

  const { handleSubmit, isLoading } = useFormSubmit({
    onSubmit: async (data) => {
      const newSettings: ClassSettingsType = {
        groupSize: data.groupSize,
      }
      await setSettings(newSettings)
      onClose()
    },
    onSuccess: () => {},
    validate: (data) => {
      if (data.groupSize === 0) return 'יש להזין גודל קבוצה'
      if (data.groupSize < 3 || data.groupSize > 15) return 'גודל קבוצה חייב להיות בין 3 ל-15'
      return null
    }
  })


  return (
    <FormCard title={`הגדרות כיתה: ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData) }} data-cy="class-settings">
        <FormField label="מספר התלמידים הרצוי בכל קבוצה (לא כולל המארח)" required>
          <FormInput
            id="groupSize"
            type="number"
            value={formData.groupSize === 0 ? '' : formData.groupSize.toString()}
            onChange={(value) => {
              const numValue = parseInt(value)
              setFormData(prev => ({ ...prev, groupSize: isNaN(numValue) ? 0 : numValue }))
            }}
            min="3"
            max="15"
            required
            testId="group-size-input"
          />
        </FormField>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 mt-2 text-xl">השפעה על הגדרות אחרות:</h4>
          <ul className="text-lg text-muted-foreground space-y-1">
            <li>מספר הקבוצות יחושב אוטומטית לפי מספר התלמידים</li>
          </ul>
        </div>

        <FormActions
          onCancel={onClose}
          onSubmit={() => handleSubmit(formData)}
          isLoading={isLoading}
        />
      </form>
    </FormCard>
  )
}
