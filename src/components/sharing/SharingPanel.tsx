import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Assignment, Student, Round, Class } from '@/lib/types'
import { ShareSection } from './ShareSection'
import { PrintSection } from './PrintSection'
import { ExportImportSection } from './ExportImportSection'

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
  const hasData = assignments.length > 0 && students.length > 0 && rounds.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>שיתוף וגיבוי</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ShareSection 
          assignments={assignments}
          students={students}
          rounds={rounds}
          classData={classData}
          hasData={hasData}
        />

        <PrintSection 
          assignments={assignments}
          students={students}
          rounds={rounds}
          classData={classData}
          hasData={hasData}
        />

        <ExportImportSection 
          assignments={assignments}
          students={students}
          rounds={rounds}
          classData={classData}
          settings={settings}
          hasData={hasData}
          onImportData={onImportData}
        />

        {/* Info */}
        {!hasData && (
          <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
            צור תוכנית תחילה כדי לאפשר שיתוף והדפסה
          </div>
        )}
      </CardContent>
    </Card>
  )
}
