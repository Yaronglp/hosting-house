import { Assignment, Student, Round } from '../types'

/**
 * Generate Hebrew summary text for WhatsApp/messaging
 */
export function generateHebrewSummary(
  assignments: Assignment[],
  students: Student[],
  rounds: Round[],
  className: string
): string {
  const studentsById = new Map(students.map(s => [s.id, s]))
  const sortedRounds = [...rounds].sort((a, b) => a.order - b.order)
  
  let summary = `📋 תוכנית בית מארח - כיתה ${className}\n`
  summary += `📅 ${new Date().toLocaleDateString('he-IL')}\n\n`
  
  sortedRounds.forEach((round, index) => {
    const assignment = assignments.find(a => a.roundId === round.id)
    if (!assignment) return
    
    summary += `🏠 ${round.name}\n`
    
    assignment.groups.forEach(group => {
      const host = studentsById.get(group.hostId)
      const guests = group.memberIds.map(id => studentsById.get(id)).filter(Boolean)
      
      summary += `👑 מארח: ${host?.name || 'לא ידוע'}\n`
      if (guests.length > 0) {
        summary += `👥 אורחים: ${guests.map(g => g!.name).join(', ')}\n`
      } else {
        summary += `👥 אורחים: אין\n`
      }
      summary += `📊 ${guests.length} אורחים\n`
    })
    
    if (index < sortedRounds.length - 1) {
      summary += '\n' + '─'.repeat(25) + '\n\n'
    }
  })
  
  summary += `\n🎯 סה"כ ${students.length} תלמידים ב-${sortedRounds.length} תאריכי מפגש`
  summary += `\n📱 נוצר באמצעות בית מארח PWA`
  
  return summary
}
