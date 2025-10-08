import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useKV } from '@/hooks/useKV'
import { ClassSettings as ClassSettingsType, KV_KEYS, DEFAULT_SETTINGS } from '@/lib/types'
import { useToast } from '@/hooks/useToast'

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
  const { error, success } = useToast()
  const [formData, setFormData] = useState({
    groupSize: DEFAULT_SETTINGS.groupSize,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Load current settings into form
  useEffect(() => {
    setFormData({
      groupSize: settings.groupSize,
    })
  }, [settings])

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setFormData(prev => ({ ...prev, groupSize: 0 }))
    } else {
      const numValue = parseInt(value)
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, groupSize: numValue }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.groupSize === 0) {
      error('יש להזין גודל קבוצה')
      return
    }
    if (formData.groupSize < 3 || formData.groupSize > 15) {
      error('גודל קבוצה חייב להיות בין 3 ל-15')
      return
    }

    setIsLoading(true)
    try {
      const newSettings: ClassSettingsType = {
        groupSize: formData.groupSize,
      }
      await setSettings(newSettings)
      success('הגדרות נשמרו בהצלחה')
      onClose()
    } catch (err) {
      console.error('Failed to save settings:', err)
      error('שגיאה בשמירת ההגדרות')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>הגדרות כיתה: {className}</CardTitle>
            <CardDescription>
              קבע את ההגדרות הבסיסיות עבור הכיתה
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            סגור
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="groupSize" className="block text-sm font-medium mb-2">
            מספר התלמידים הרצוי בכל קבוצה (לא כולל המארח)
            </label>
            <input
              id="groupSize"
              type="number"
              min="3"
              max="15"
              value={formData.groupSize === 0 ? '' : formData.groupSize}
              onChange={handleGroupSizeChange}
              className="w-24 px-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg padding-default">
            <h4 className="font-medium mb-2">השפעה על הגדרות אחרות:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• מספר הקבוצות יחושב אוטומטית לפי מספר התלמידים</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'שומר...' : 'שמור הגדרות'}
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>
      
    </>
  )
}
