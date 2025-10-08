import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useKeyboardShortcuts } from '@/hooks/useAccessibility'
import { usePlanGeneration } from '@/hooks/usePlanGeneration'
import { ViewModeNavigation } from '@/components/layout/ViewModeNavigation'
import { PlanGeneratorView } from '@/components/planning/PlanGeneratorView'
import { PlanTableView } from '@/components/lists/PlanTableView'
import { ValidationPanel } from '@/components/planning/ValidationPanel'
import { PlanBoard } from '@/components/planning/PlanBoard'
import { SharingPanel } from '@/components/sharing/SharingPanel'

interface PlanManagerProps {
  classId: string
}

type ViewMode = 'generator' | 'board' | 'table' | 'share'

export function PlanManager({ classId }: PlanManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('generator')
  
  // Use custom hook for all plan generation logic
  const {
    students,
    rounds,
    assignments,
    currentClass,
    settings,
    seed,
    setSeed,
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

  // Handle view mode changes with announcements
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  // Enhanced generate that switches to board view on success
  const handleGenerate = async () => {
    // Auto-generate a new seed for variety
    reroll()
    const success = await runGenerate()
    if (success) {
      setViewMode('board')
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+g': () => canGenerate && handleGenerate(),
    '1': () => setViewMode('generator'),
    '2': () => assignments.length > 0 && setViewMode('board'),
    '3': () => assignments.length > 0 && setViewMode('table'),
    '4': () => assignments.length > 0 && setViewMode('share'),
  })

  return (
    <div className="space-y-4" id="plan-manager-main">
      {/* View Mode Navigation */}
      <ViewModeNavigation 
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

      {/* Validation Panel - hidden in share mode */}
      {validation && viewMode !== 'share' && (
        <ValidationPanel 
          validation={validation} 
          onRetry={handleRetry}
          isRetrying={isRetrying}
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

      {/* ARIA live region for announcements */}
      <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>
    </div>
  )
}
