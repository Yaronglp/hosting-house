import { Button } from '@/components/ui/Button'
import { Assignment, Student, Round, Class } from '@/lib/types'
import { 
  generatePrintHTML, 
  printHTML 
} from '@/lib/sharing'
import { Printer } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

interface PrintSectionProps {
  assignments: Assignment[]
  students: Student[]
  rounds: Round[]
  classData: Class
  hasData: boolean
}

export function PrintSection({ 
  assignments, 
  students, 
  rounds, 
  classData,
  hasData 
}: PrintSectionProps) {
  const { success, error } = useToast()

  // Generate and open print view
  const handlePrint = () => {
    try {
      const printHTML_content = generatePrintHTML(assignments, students, rounds, classData.name)
      printHTML(printHTML_content)
      success('חלון ההדפסה נפתח')
    } catch (error) {
      console.error('Failed to print:', error)
      error('שגיאה בהדפסה')
    }
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium">הדפסה</h4>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        disabled={!hasData}
      >
        <Printer className="h-4 w-4 ml-2 padding-left-default" />
        הדפס תוכנית
      </Button>
    </div>
  )
}
