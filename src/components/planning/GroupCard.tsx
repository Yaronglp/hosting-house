import { memo } from 'react'
import { Student } from '@/lib/types'
import { Crown } from 'lucide-react'
import { StudentChip } from './StudentChip'

interface GroupCardProps {
  group: {
    id: string
    hostId: string
    memberIds: string[]
  }
  host: Student
  members: Student[]
  isTargetable: boolean
  selectedStudentId: string | null
  onGroupClick: () => void
  onStudentClick: (studentId: string) => void
}

export const GroupCard = memo(({ 
  group, 
  host, 
  members, 
  isTargetable, 
  selectedStudentId, 
  onGroupClick, 
  onStudentClick 
}: GroupCardProps) => (
  <div
    className={`border rounded-lg p-3 padding-default cursor-pointer transition-colors ${
      isTargetable 
        ? 'border-neon-cyan bg-[var(--overlay-neon-cyan-10)] hover:bg-[var(--overlay-neon-cyan-20)]' 
        : 'border-muted hover:border-muted-foreground'
    }`}
    onClick={onGroupClick}
    data-cy="group-card"
  >
    {/* Host */}
    <div className="flex items-center gap-2 mb-2">
      <Crown className="h-4 w-4 text-neon-orange padding-left-default" />
      <span className="font-medium padding-left-default" data-cy="host-student">{host.name}</span>
      <span className="text-xs text-muted-foreground">
        ({group.memberIds.length} אורחים)
      </span>
    </div>

    {/* Members */}
    {members.length > 0 ? (
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">אורחים:</div>
        <div className="flex flex-wrap gap-1" data-cy="group-members">
          {members.map(member => (
            <StudentChip
              key={member.id}
              student={member}
              isSelected={selectedStudentId === member.id}
              onClick={() => onStudentClick(member.id)}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="text-xs text-muted-foreground italic">
        אין אורחים
      </div>
    )}
  </div>
))

GroupCard.displayName = 'GroupCard'
