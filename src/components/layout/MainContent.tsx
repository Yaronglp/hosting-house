import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface MainContentProps {
  activeTab: string
  currentClass: { id: string; name: string } | null
  classesContent?: ReactNode
  studentsContent?: ReactNode
  roundsContent?: ReactNode
  planContent?: ReactNode
}

export function MainContent({
  activeTab,
  currentClass,
  classesContent,
  studentsContent,
  roundsContent,
  planContent
}: MainContentProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'classes': return '🏫 כיתות'
      case 'students': return '👥 תלמידים'
      case 'rounds': return '🔄 תאריכי מפגשים'
      case 'plan': return '📋 תכנון'
      default: return ''
    }
  }

  const NoClassMessage = ({ children }: { children: ReactNode }) => (
    <div className="text-center neon-text-green opacity-70 py-8">
      {children}
    </div>
  )

  return (
    <>
      <main className="flex-1 min-w-0 w-full">
        <Card className="hologram vhs-static w-full">
          <CardHeader>
            <CardTitle className="neon-text text-xl">
              {getTabTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            {activeTab === 'classes' && classesContent}
            
            {activeTab === 'students' && studentsContent}
            {activeTab === 'students' && !currentClass && (
              <NoClassMessage>
                <p>🏫 בחר כיתה תחילה כדי לנהל תלמידים</p>
                <p className="text-sm mt-2">עבור לכרטיסיית "כיתות" וצור או בחר כיתה</p>
              </NoClassMessage>
            )}
            
            {activeTab === 'rounds' && roundsContent}
            {activeTab === 'rounds' && !currentClass && (
              <NoClassMessage>
                <p>🏫 בחר כיתה תחילה כדי לנהל תאריכי מפגש</p>
                <p className="text-sm mt-2">עבור לכרטיסיית "כיתות" וצור או בחר כיתה</p>
              </NoClassMessage>
            )}
            
            {activeTab === 'plan' && planContent}
            {activeTab === 'plan' && !currentClass && (
              <NoClassMessage>
                <p>🏫 בחר כיתה תחילה כדי ליצור תכנון</p>
                <p className="text-sm mt-2">עבור לכרטיסיית "כיתות" וצור או בחר כיתה</p>
              </NoClassMessage>
            )}
            
            {!['classes', 'students', 'rounds', 'plan'].includes(activeTab) && (
              <div className="text-sm neon-text-green opacity-70">
                🚀 ממשק התחלתי — נבנה בהמשך לפי האפיקים.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
} 