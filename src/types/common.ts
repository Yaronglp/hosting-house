// Common prop interfaces used across multiple components

export interface StorageInfo {
  persisted: boolean | null
  usage: number
  quota: number | null
  usagePercent: number
  isRequesting: boolean
  onRequestPersistence: () => void
}

export interface ClassInfo {
  id: string
  name: string
} 