import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Assignment, Student, Round, Class } from '@/lib/types'
import { 
  generateHebrewSummary, 
  generatePrintHTML, 
  exportToJSON, 
  parseImportJSON,
  copyToClipboard, 
  printHTML, 
  downloadFile,
  shareContent 
} from '@/lib/sharing'
import { 
  Copy, 
  Printer, 
  Download, 
  Upload, 
  MessageCircle,
  CheckCircle,
  AlertCircle 
} from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/Dialog'

interface SharingPanelProps {
  assignments: Assignment[]
  students: Student[]
  rounds: Round[]
  classData: Class
  settings?: any
  onImportData?: (data: any) => Promise<void>
}

export function SharingPanel({ 
  assignments, 
  students, 
  rounds, 
  classData, 
  settings,
  onImportData 
}: SharingPanelProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importConfirm, setImportConfirm] = useState<{ data: any; message: string } | null>(null)

  // Generate Hebrew summary for messaging
  const handleGenerateSummary = async () => {
    try {
      const summary = generateHebrewSummary(assignments, students, rounds, classData.name)
      
      // Try Web Share API first
      const shared = await shareContent('תוכנית בית מארח', summary)
      
      if (shared) {
        setShareStatus('הושתף בהצלחה!')
      } else {
        // Fallback to clipboard
        const copied = await copyToClipboard(summary)
        if (copied) {
          setCopyStatus('הועתק ללוח!')
        } else {
          setCopyStatus('שגיאה בהעתקה')
        }
      }
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setCopyStatus(null)
        setShareStatus(null)
      }, 3000)
    } catch (error) {
      console.error('Failed to generate summary:', error)
      setCopyStatus('שגיאה ביצירת הסיכום')
      setTimeout(() => setCopyStatus(null), 3000)
    }
  }

  // Copy summary to clipboard
  const handleCopyToClipboard = async () => {
    try {
      const summary = generateHebrewSummary(assignments, students, rounds, classData.name)
      const copied = await copyToClipboard(summary)
      
      if (copied) {
        setCopyStatus('הועתק ללוח!')
      } else {
        setCopyStatus('שגיאה בהעתקה')
      }
      
      setTimeout(() => setCopyStatus(null), 3000)
    } catch (error) {
      console.error('Failed to copy:', error)
      setCopyStatus('שגיאה בהעתקה')
      setTimeout(() => setCopyStatus(null), 3000)
    }
  }

  // Generate and open print view
  const handlePrint = () => {
    try {
      const printHTML_content = generatePrintHTML(assignments, students, rounds, classData.name)
      printHTML(printHTML_content)
    } catch (error) {
      console.error('Failed to print:', error)
    }
  }

  // Export data as JSON
  const handleExportJSON = () => {
    try {
      const jsonData = exportToJSON(classData, students, rounds, assignments, settings)
      const filename = `bait-meareah-${classData.name}-${new Date().toISOString().split('T')[0]}.json`
      downloadFile(jsonData, filename, 'application/json')
    } catch (error) {
      console.error('Failed to export:', error)
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
    } catch (error) {
      console.error('Failed to import:', error)
      setImportError('שגיאה בייבוא הנתונים: ' + (error as Error).message)
    } finally {
      setIsImporting(false)
    }
  }

  const hasData = assignments.length > 0 && students.length > 0 && rounds.length > 0

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>שיתוף וגיבוי</CardTitle>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* WhatsApp/Text Summary */}
        <div className="space-y-2">
          <h4 className="font-medium">שיתוף הודעה</h4>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateSummary}
              disabled={!hasData}
            >
              <MessageCircle className="h-4 w-4 ml-2" />
              שתף ב-WhatsApp
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyToClipboard}
              disabled={!hasData}
            >
              <Copy className="h-4 w-4 ml-2" />
              העתק ללוח
            </Button>
          </div>
          {(copyStatus || shareStatus) && (
            <div className={`text-sm flex items-center gap-1 ${
              copyStatus?.includes('שגיאה') || shareStatus?.includes('שגיאה') 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {copyStatus?.includes('שגיאה') || shareStatus?.includes('שגיאה') ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {copyStatus || shareStatus}
            </div>
          )}
        </div>

        {/* Print View */}
        <div className="space-y-2">
          <h4 className="font-medium">הדפסה</h4>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            disabled={!hasData}
          >
            <Printer className="h-4 w-4 ml-2" />
            הדפס תוכנית
          </Button>
        </div>

        {/* Export/Import */}
        <div className="space-y-2">
          <h4 className="font-medium">גיבוי והעברה</h4>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportJSON}
              disabled={!hasData}
            >
              <Download className="h-4 w-4 ml-2" />
              ייצא נתונים
            </Button>
            <label className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!onImportData || isImporting}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 ml-2" />
                  {isImporting ? 'מייבא...' : 'ייבא נתונים'}
                </span>
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
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {importError}
            </div>
          )}
        </div>

        {/* Info */}
        {!hasData && (
          <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
            צור תוכנית תחילה כדי לאפשר שיתוף והדפסה
          </div>
        )}
      </CardContent>
    </Card>
    
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
