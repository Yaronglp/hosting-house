import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { backupAllDataToFile } from '@/utils/backup'

interface ActionsSidebarProps {
  activeTab: string
  persisted: boolean | null
  usage: number
  quota: number | null
  usagePercent: number
  isRequesting: boolean
  onRequestPersistence: () => void
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
  persisted,
  usage,
  quota,
  usagePercent,
  isRequesting,
  onRequestPersistence,
  classesActions,
  studentsActions,
  roundsActions
}: ActionsSidebarProps) {
  return (
    <aside className="lg:w-80 w-full flex-shrink-0 space-y-4">
      <Card className="retro-card hologram w-full">
        <CardHeader>
          <CardTitle className="neon-text text-lg terminal-cursor">⚡ פעולות</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="text-sm neon-text-green padding-bottom-default">
            שמירת נתונים במכשיר: {persisted === null ? '🔄 בודק…' : persisted ? '✅ מאופשר' : '❌ לא מאופשר'}
          </div>
          {isRequesting && (
            <div className="text-xs text-blue-400 mb-2">
              🔄 מבקש הרשאה מהדפדפן...
            </div>
          )}
          <div className="retro-loading-bar mb-2"></div>
          <div className="flex flex-col gap-3">
            {activeTab === 'classes' && classesActions && (
              <>
                <Button 
                  className="retro-button border-0 hologram w-full"
                  onClick={classesActions.addClass}
                >
                  ➕ הוסף כיתה
                </Button>
                {classesActions.canOpenSettings && (
                  <Button 
                    className="retro-button border-0 hologram w-full"
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
                  className="retro-button border-0 hologram w-full"
                  onClick={studentsActions.addStudent}
                >
                  👤 הוסף תלמיד
                </Button>
                <Button 
                  className="retro-button border-0 hologram w-full"
                  onClick={studentsActions.pasteNames}
                >
                  📋 הזן רשימת שמות תלמידים
                </Button>
              </>
            )}
            {activeTab === 'rounds' && roundsActions && (
              <Button 
                className="retro-button border-0 hologram w-full"
                onClick={roundsActions.addRound}
              >
                🔄 הוסף סבב
              </Button>
            )}
            <Button className="retro-button border-0 hologram w-full" onClick={() => backupAllDataToFile()}>
              💾 גיבוי
            </Button>
            <Button 
              className="retro-button border-0 hologram w-full" 
              disabled={isRequesting || persisted === true} 
              onClick={onRequestPersistence}
            >
              {isRequesting ? '🔄 מבקש...' : persisted === true ? '✅ מאופשר' : '🔒 בקש לשמור נתונים במכשיר'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
} 