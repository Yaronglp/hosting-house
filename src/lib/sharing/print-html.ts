import { Assignment, Student, Round } from '../types'

/**
 * Generate clean print layout
 */
export function generatePrintHTML(
  assignments: Assignment[],
  students: Student[],
  rounds: Round[],
  className: string
): string {
  const studentsById = new Map(students.map(s => [s.id, s]))
  const sortedRounds = [...rounds].sort((a, b) => a.order - b.order)
  
  let html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>תוכנית בית מארח - ${className}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Hebrew', sans-serif;
      margin: 20px;
      color: #333;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #2563eb;
    }
    .header .subtitle {
      margin: 5px 0;
      color: #666;
      font-size: 16px;
    }
    .round {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .round-title {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 8px;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      border-right: 4px solid #2563eb;
    }
    .groups-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .groups-table th,
    .groups-table td {
      border: 1px solid #ddd;
      padding: 12px 8px;
      text-align: right;
    }
    .groups-table th {
      background: #f8fafc;
      font-weight: bold;
    }
    .host-name {
      font-weight: bold;
      color: #1d4ed8;
    }
    .capacity-info {
      font-size: 12px;
      color: #666;
    }
    .guests-list {
      line-height: 1.4;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    @media print {
      body { margin: 0; }
      .round { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>תוכנית בית מארח</h1>
    <div class="subtitle">כיתה: ${className}</div>
    <div class="subtitle">תאריך: ${new Date().toLocaleDateString('he-IL')}</div>
    <div class="subtitle">${students.length} תלמידים • ${sortedRounds.length} סבבים</div>
  </div>
`

  sortedRounds.forEach(round => {
    const assignment = assignments.find(a => a.roundId === round.id)
    if (!assignment) return
    
    html += `
  <div class="round">
    <div class="round-title">${round.name}</div>
    <table class="groups-table">
      <thead>
        <tr>
          <th>מארח</th>
          <th>אורחים</th>
          <th>תפוסה</th>
        </tr>
      </thead>
      <tbody>
`
    
    assignment.groups.forEach(group => {
      const host = studentsById.get(group.hostId)
      const guests = group.memberIds.map(id => studentsById.get(id)).filter(Boolean)
      
      html += `
        <tr>
          <td class="host-name">${host?.name || 'לא ידוע'}</td>
          <td class="guests-list">
            ${guests.length > 0 ? guests.map(g => g!.name).join('<br>') : '<em>אין אורחים</em>'}
          </td>
          <td class="capacity-info">${guests.length} אורחים</td>
        </tr>
`
    })
    
    html += `
      </tbody>
    </table>
  </div>
`
  })
  
  html += `
  <div class="footer">
    נוצר באמצעות בית מארח Yaron Galperin • ${new Date().toLocaleString('he-IL')}
  </div>
</body>
</html>
`
  
  return html
}
