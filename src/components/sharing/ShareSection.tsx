import { Button } from '@/components/ui/Button'
import { Assignment, Student, Round, Class } from '@/lib/types'
import { 
  generateHebrewSummary, 
  copyToClipboard, 
  shareContent 
} from '@/lib/sharing'
import { 
  Copy, 
  MessageCircle
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'

interface ShareSectionProps {
  assignments: Assignment[]
  students: Student[]
  rounds: Round[]
  classData: Class
  hasData: boolean
}

export function ShareSection({ 
  assignments, 
  students, 
  rounds, 
  classData,
  hasData 
}: ShareSectionProps) {
  const { success, error } = useToast()

  // Generate Hebrew summary for messaging
  const handleGenerateSummary = async () => {
    try {
      const summary = generateHebrewSummary(assignments, students, rounds, classData.name)
      
      // Try Web Share API first
      const shared = await shareContent('תוכנית בית מארח', summary)
      
      if (shared) {
        success('שותף בהצלחה!')
      } else {
        // Fallback to clipboard
        const copied = await copyToClipboard(summary)
        if (copied) {
          success('הועתק ללוח!')
        } else {
          error('שגיאה בהעתקה')
        }
      }
    } catch (error) {
      console.error('Failed to generate summary:', error)
      error('שגיאה ביצירת הסיכום')
    }
  }

  // Copy summary to clipboard
  const handleCopyToClipboard = async () => {
    try {
      const summary = generateHebrewSummary(assignments, students, rounds, classData.name)
      const copied = await copyToClipboard(summary)
      
      if (copied) {
        success('הועתק ללוח!')
      } else {
        error('שגיאה בהעתקה')
      }
    } catch (error) {
      console.error('Failed to copy:', error)
      error('שגיאה בהעתקה')
    }
  }

  return (
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
    </div>
  )
}
