import Dexie, { Table } from 'dexie'

// KV store interface
interface KVEntry {
  key: string
  value: unknown
}

// Database schema
export class BaitMeareahDB extends Dexie {
  kv!: Table<KVEntry>

  constructor() {
    super('BaitMeareahDB')
    this.version(1).stores({
      kv: '&key' // Primary key on 'key' field
    })
  }
}

// Create database instance
export const db = new BaitMeareahDB()

// KV helpers
export async function kvGet<T = unknown>(key: string): Promise<T | undefined> {
  const entry = await db.kv.get(key)
  return entry?.value as T | undefined
}

export async function kvSet<T = unknown>(key: string, value: T): Promise<void> {
  await db.kv.put({ key, value })
}

export async function kvRemove(key: string): Promise<void> {
  await db.kv.delete(key)
}

export async function kvClear(): Promise<void> {
  await db.kv.clear()
}

export async function kvKeys(): Promise<string[]> {
  return await db.kv.orderBy('key').keys() as string[]
}
