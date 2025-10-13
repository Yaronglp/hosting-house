import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { backupAllDataToFile } from '@/utils/backup'
import { useToast } from '@/hooks/useToast'

interface ActionsSidebarProps {
  activeTab: string
  classesActions?: {
    addClass: () => void
    canOpenSettings: boolean
    openSettings: () => void
  }
  studentsActions?: {
    addStudent: () => void
    pasteNames: () => void
  }
  roundsActions?: {
    addRound: () => void
  }
}

export function ActionsSidebar({
  activeTab,
  classesActions,
  studentsActions,
  roundsActions
}: ActionsSidebarProps) {
  const { error } = useToast()
  return (
    <aside className="lg:w-80 w-full flex-shrink-0 space-y-4">
      <Card className="hologram w-full">
        <CardHeader>
          <CardTitle className="neon-text text-lg">⚡ פעולות</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {activeTab === 'classes' && classesActions && (
              <>
                <Button 
                  className="border-0 hologram w-full"
                  onClick={classesActions.addClass}
                >
                  ➕ הוסף כיתה
                </Button>
                {classesActions.canOpenSettings && (
                  <Button 
                    className="border-0 hologram w-full"
                    onClick={classesActions.openSettings}
                  >
                    ⚙️ הגדרות כיתה
                  </Button>
                )}
              </>
            )}
            {activeTab === 'students' && studentsActions && (
              <>
                <Button 
                  className="border-0 hologram w-full"
                  onClick={studentsActions.addStudent}
                >
                  👤 הוסף תלמיד
                </Button>
                <Button 
                  className="border-0 hologram w-full"
                  onClick={studentsActions.pasteNames}
                >
                  📋 הזן רשימת שמות תלמידים
                </Button>
              </>
            )}
            {activeTab === 'rounds' && roundsActions && (
              <Button 
                className="border-0 hologram w-full"
                onClick={roundsActions.addRound}
              >
                🔄 הוסף תאריך מפגש
              </Button>
            )}
            <Button className="border-0 hologram w-full" onClick={() => backupAllDataToFile(error)}>
              💾 גיבוי
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
} 