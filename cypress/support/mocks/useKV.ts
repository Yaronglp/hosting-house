// Mock implementation of useKV hook for Cypress tests
export const useKV = (key: string, defaultValue: any) => {
  const mockStudents = [
    { id: '1', classId: 'class1', name: 'יוסי כהן', canHost: true, capacity: 6, like: [], avoid: [] },
    { id: '2', classId: 'class1', name: 'שרה לוי', canHost: true, capacity: 6, like: [], avoid: [] }
  ]

  const mockSettings = { groupSize: 6 }

  if (key.includes('students')) return [mockStudents, () => {}]
  if (key.includes('settings')) return [mockSettings, () => {}]
  return [defaultValue, () => {}]
}
