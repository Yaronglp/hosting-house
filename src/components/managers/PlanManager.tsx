import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { usePlanGeneration } from '@/hooks/usePlanGeneration'
import { ViewPlanModeNavigation } from '@/components/layout/ViewPlanModeNavigation'
import { PlanGeneratorView } from '@/components/planning/PlanGeneratorView'
import { PlanTableView } from '@/components/lists/PlanTableView'
import { PlanBoard } from '@/components/planning/PlanBoard'
import { SharingPanel } from '@/components/sharing/SharingPanel'

interface PlanManagerProps {
  classId: string
}

type ViewMode = 'generator' | 'board' | 'table' | 'share'

export function PlanManager({ classId }: PlanManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('generator')
  
  const {
    students,
    rounds,
    assignments,
    currentClass,
    settings,
    error,
    isGenerating,
    isRetrying,
    validation,
    canGenerate,
    runGenerate,
    handleRetry,
    handleUpdateAssignments,
    handleImportData,
    reroll
  } = usePlanGeneration(classId)

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const handleGenerate = async () => {
    reroll()
    const success = await runGenerate()
    if (success) {
      setViewMode('board')
    }
  }

  return (
    <div className="space-y-4" id="plan-manager-main">
      {/* View Mode Navigation */}
      <ViewPlanModeNavigation 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        hasAssignments={assignments.length > 0}
      />

      {/* Generator View */}
      {(viewMode === 'generator' || assignments.length === 0) && (
        <PlanGeneratorView
          onGenerate={handleGenerate}
          canGenerate={canGenerate}
          isGenerating={isGenerating}
          error={error}
          students={students}
          sortedRounds={rounds}
        />
      )}

      {/* Board View */}
      {viewMode === 'board' && assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>לוח תכנון אינטראקטיבי</CardTitle>
            <CardDescription>ע״מ לבצע שינויים בין קבוצות תלמידים, לחץ על תלמיד ולאחר מכן על קבוצה מבוקשת</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanBoard
              assignments={assignments}
              students={students}
              rounds={rounds}
              onUpdateAssignments={handleUpdateAssignments}
              validation={validation}
              onRetry={handleRetry}
              isRetrying={isRetrying}
            />
          </CardContent>
        </Card>
      )}

      {/* Table View */}
      {viewMode === 'table' && assignments.length > 0 && (
        <PlanTableView
          assignments={assignments}
          students={students}
          sortedRounds={rounds}
        />
      )}

      {/* Sharing View */}
      {viewMode === 'share' && (
        <SharingPanel
          assignments={assignments}
          students={students}
          rounds={rounds}
          classData={currentClass || { id: classId, name: 'כיתה', createdAt: new Date(), updatedAt: new Date() }}
          settings={settings}
          onImportData={handleImportData}
        />
      )}

    </div>
  )
}
