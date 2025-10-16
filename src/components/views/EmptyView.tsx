import { MainContent } from '@/components/layout/MainContent'

interface EmptyViewProps {
  activeTab: string
}

export function EmptyView({
  activeTab
}: EmptyViewProps) {
  return (
    <MainContent
      activeTab={activeTab}
      currentClass={null}
    />
  )
} 