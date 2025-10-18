import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Student, Round, Assignment } from '@/lib/types'

interface PlanTableViewProps {
  assignments: Assignment[]
  students: Student[]
  sortedRounds: Round[]
}

export function PlanTableView({ 
  assignments, 
  students, 
  sortedRounds 
}: PlanTableViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>תוכנית מפורטת</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedRounds.map((round) => {
            const assignment = assignments.find(a => a.roundId === round.id)
            if (!assignment) return (
              <div key={round.id} className="text-lg">אין נתונים עבור {round.name}</div>
            )
            return (
              <div key={round.id} className="border rounded-lg p-3 padding-default">
                <div className="font-medium mb-2">{round.name}</div>
                {assignment.groups.map(group => (
                  <div key={group.id} className="text-lg">
                    <div className="mb-1 plan-host-name">
                      מארח: {students.find(s => s.id === group.hostId)?.name || group.hostId}
                    </div>
                    <div className="pl-3">
                      אורחים:
                      <ul className="list-disc pr-5">
                        {group.memberIds.map(memberId => (
                          <li key={memberId}>{students.find(student => student.id === memberId)?.name || memberId}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 