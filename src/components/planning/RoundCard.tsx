import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Student, Round, Assignment } from '@/lib/types'
import { Users } from 'lucide-react'
import { GroupCard } from './GroupCard'

interface RoundCardProps {
  round: Round
  assignment: Assignment
  studentsById: Map<string, Student>
  selectedStudentId: string | null
  onGroupClick: (roundId: string, groupId: string) => void
  onStudentClick: (studentId: string) => void
}

export const RoundCard = memo(({ 
  round, 
  assignment, 
  studentsById, 
  selectedStudentId, 
  onGroupClick, 
  onStudentClick 
}: RoundCardProps) => (
  <Card className="overflow-hidden" data-cy="round-board">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        {round.name}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {assignment.groups.map(group => {
        const host = studentsById.get(group.hostId)
        const members = group.memberIds.map(id => studentsById.get(id)).filter(Boolean) as Student[]
        const isTargetable = !!selectedStudentId

        if (!host) return null

        return (
          <GroupCard
            key={group.id}
            group={group}
            host={host}
            members={members}
            isTargetable={isTargetable}
            selectedStudentId={selectedStudentId}
            onGroupClick={() => onGroupClick(round.id, group.id)}
            onStudentClick={onStudentClick}
          />
        )
      })}
    </CardContent>
  </Card>
))

RoundCard.displayName = 'RoundCard'
