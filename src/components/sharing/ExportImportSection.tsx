import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Assignment, Student, Round, Class } from '@/lib/types'
import { 
  exportToJSON, 
  parseImportJSON,
  downloadFile
} from '@/lib/sharing'
import { 
  Download, 
  Upload,
  AlertCircle 
} from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { useToast } from '@/hooks/useToast'

interface ExportImportSectionProps {
  assignments: Assignment[]
  students: Student[]
  rounds: Round[]
  classData: Class
  settings?: any
  hasData: boolean
  onImportData?: (data: any) => Promise<void>
}

export function ExportImportSection({ 
  assignments, 
  students, 
  rounds, 
  classData, 
  settings,
  hasData,
  onImportData 
}: ExportImportSectionProps) {
  const { success, error } = useToast()
  const [importError, setImportError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importConfirm, setImportConfirm] = useState<{ data: any; message: string } | null>(null)

  // Export data as JSON
  const handleExportJSON = () => {
    try {
      const jsonData = exportToJSON(classData, students, rounds, assignments, settings)
      const filename = `bait-meareah-${classData.name}-${new Date().toISOString().split('T')[0]}.json`
      downloadFile(jsonData, filename, 'application/json')
      success('הנתונים יוצאו בהצלחה')
    } catch (error) {
      console.error('Failed to export:', error)
      error('שגיאה בייצוא הנתונים')
    }
  }

  // Import data from JSON file
  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onImportData) return

    setIsImporting(true)
    setImportError(null)

    try {
      const text = await file.text()
      const importData = parseImportJSON(text)
      
      // Show confirmation
      const confirmMessage = `כיתה: ${importData.class.name}\nתלמידים: ${importData.students.length}\nסבבים: ${importData.rounds.length}\nתאריך יצירה: ${new Date(importData.timestamp).toLocaleString('he-IL')}\n\nפעולה זו תחליף את כל הנתונים הקיימים.`
      
      setImportConfirm({ data: importData, message: confirmMessage })
      event.target.value = '' // Reset file input
    } catch (error) {
      console.error('Failed to import:', error)
      setImportError('שגיאה בייבוא הקובץ: ' + (error as Error).message)
      event.target.value = ''
    } finally {
      setIsImporting(false)
    }
  }

  const handleImportConfirm = async () => {
    if (!importConfirm || !onImportData) return
    
    setIsImporting(true)
    try {
      await onImportData(importConfirm.data)
      setImportConfirm(null)
      success('הנתונים יובאו בהצלחה')
    } catch (error) {
      console.error('Failed to import:', error)
      setImportError('שגיאה בייבוא הנתונים: ' + (error as Error).message)
      error('שגיאה בייבוא הנתונים')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <h4 className="font-medium">גיבוי והעברה</h4>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportJSON}
            disabled={!hasData}
          >
            <Download className="h-4 w-4 ml-2 padding-left-default" />
            ייצא נתונים
          </Button>
          <label className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!onImportData || isImporting}
              className="w-full"
            >
              <Upload className="h-4 w-4 ml-2 padding-left-default" />
              {isImporting ? 'מייבא...' : 'ייבא נתונים'}
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={!onImportData || isImporting}
            />
          </label>
        </div>
        {importError && (
          <div className="text-sm text-[var(--validation-error-text)] flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {importError}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!importConfirm}
        onClose={() => setImportConfirm(null)}
        onConfirm={handleImportConfirm}
        title="ייבוא נתונים"
        message={importConfirm ? `האם אתה בטוח שברצונך לייבא נתונים מקובץ זה?\n\n${importConfirm.message}` : ''}
        confirmText="ייבא"
        cancelText="ביטול"
        variant="default"
      />
    </>
  )
}
