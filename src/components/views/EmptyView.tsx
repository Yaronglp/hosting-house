import { ActionsSidebar } from '@/components/common/ActionsSidebar'
import { MainContent } from '@/components/layout/MainContent'
import { StorageInfo } from '@/types/common'

interface EmptyViewProps extends StorageInfo {
  activeTab: string
}

export function EmptyView({
  activeTab,
  persisted,
  usage,
  quota,
  usagePercent,
  isRequesting,
  onRequestPersistence
}: EmptyViewProps) {
  return (
    <>
      <ActionsSidebar
        activeTab={activeTab}
        persisted={persisted}
        usage={usage}
        quota={quota}
        usagePercent={usagePercent}
        isRequesting={isRequesting}
        onRequestPersistence={onRequestPersistence}
      />
      <MainContent
        activeTab={activeTab}
        currentClass={null}
      />
    </>
  )
} 