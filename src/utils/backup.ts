import { db, kvKeys, kvGet } from '@/lib/db'

export function backupToFile(data: unknown, filename = `bait-meareah-backup-${new Date().toISOString()}.json`) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportAllData(): Promise<Record<string, unknown>> {
  try {
    const keys = await kvKeys()
    const data: Record<string, unknown> = {}
    
    await Promise.all(
      keys.map(async (key) => {
        const value = await kvGet(key)
        if (value !== undefined) {
          data[key] = value
        }
      })
    )
    
    return {
      version: 1,
      timestamp: new Date().toISOString(),
      data,
    }
  } catch (error) {
    console.error('Failed to export data:', error)
    throw error
  }
}

export async function importAllData(backup: any): Promise<void> {
  try {
    if (!backup.data || !backup.version) {
      throw new Error('Invalid backup format')
    }
    
    // Clear existing data
    await db.kv.clear()
    
    // Import data
    const entries = Object.entries(backup.data).map(([key, value]) => ({
      key,
      value,
    }))
    
    await db.kv.bulkPut(entries)
  } catch (error) {
    console.error('Failed to import data:', error)
    throw error
  }
}

export async function backupAllDataToFile(onError?: (message: string) => void): Promise<void> {
  try {
    const data = await exportAllData()
    const filename = `bait-meareah-backup-${new Date().toISOString().split('T')[0]}.json`
    backupToFile(data, filename)
  } catch (error) {
    console.error('Failed to backup data:', error)
    const errorMessage = 'שגיאה בגיבוי הנתונים'
    if (onError) {
      onError(errorMessage)
    } else {
      alert(errorMessage)
    }
  }
}
