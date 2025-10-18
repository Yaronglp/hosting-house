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
            if (!assignment) return null
            return (
              <div key={round.id} className="border rounded-lg p-3 padding-default">
                <div className="mb-2 text-xl">תאריך המפגש: <u>{round.name}</u></div>
                {assignment.groups.map(group => (
                  <div key={group.id}>
                    <div className="mb-1 plan-host-name text-xl">
                      מארח: {students.find(s => s.id === group.hostId)?.name || group.hostId}
                    </div>
                    <div className="pl-3 text-xl">
                      אורחים:
                      <ul className="list-disc pr-5">
                        {group.memberIds.map(memberId => (
                          <li key={memberId} className="text-xl">{students.find(student => student.id === memberId)?.name || memberId}</li>
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