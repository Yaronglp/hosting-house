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
        ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
    onClick={onGroupClick}
    data-cy="group-card"
  >
    {/* Host */}
    <div className="flex items-center gap-2 mb-2">
      <Crown className="h-4 w-4 text-yellow-600 padding-left-default" />
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
