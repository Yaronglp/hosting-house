import { ClassesManagerView } from '@/components/views/ClassesManagerView'
import { StudentsManagerView } from '@/components/views/StudentsManagerView'
import { RoundsManagerView } from '@/components/views/RoundsManagerView'
import { PlanView } from '@/components/views/PlanView'
import { EmptyView } from '@/components/views/EmptyView'
import { Class } from '@/lib/types'

interface ViewRouterProps {
  activeTab: string
  currentClass: Class | null
  currentClassId: string | null
  onClassSelect: (classId: string) => void
}

export function ViewRouter({ 
  activeTab, 
  currentClass, 
  currentClassId, 
  onClassSelect 
}: ViewRouterProps) {
  if (activeTab === 'classes') {
    return (
      <ClassesManagerView 
        currentClassId={currentClassId}
        onClassSelect={onClassSelect}
      />
    )
  }
  
  if (activeTab === 'students') {
    if (currentClass) {
      return <StudentsManagerView classInfo={currentClass} />
    }
    return <EmptyView activeTab={activeTab} />
  }
  
  if (activeTab === 'rounds') {
    if (currentClass) {
      return <RoundsManagerView classInfo={currentClass} />
    }
    return <EmptyView activeTab={activeTab} />
  }
  
  if (activeTab === 'plan') {
    if (currentClass) {
      return <PlanView classInfo={currentClass} />
    }
    return <EmptyView activeTab={activeTab} />
  }
  
  // Fallback for unknown tabs
  return <EmptyView activeTab={activeTab} />
}
