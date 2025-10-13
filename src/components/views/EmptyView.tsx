import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'

interface EmptyViewProps {
  activeTab: string
}

export function EmptyView({
  activeTab
}: EmptyViewProps) {
  return (
    <>
      <ActionsSidebar
        activeTab={activeTab}
      />
      <MainContent
        activeTab={activeTab}
        currentClass={null}
      />
    </>
  )
} 