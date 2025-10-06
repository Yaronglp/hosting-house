import { memo } from 'react'
import { Assignment, Student, Round } from '@/lib/types'
import { BoardControls } from './BoardControls'
import { BoardStatus } from './BoardStatus'
import { RoundCard } from './RoundCard'
import { usePlanBoardLogic } from './usePlanBoardLogic'

interface PlanBoardProps {
  assignments: Assignment[]
  students: Student[]
  rounds: Round[]
  onUpdateAssignments: (assignments: Assignment[]) => void
}

export const PlanBoard = memo(({ assignments, students, rounds, onUpdateAssignments }: PlanBoardProps) => {
  const {
    selectedStudentId,
    moveHistory,
    error,
    studentsById,
    sortedRounds,
    handleStudentClick,
    handleGroupClick,
    handleCancelSelection,
    undoLastMove
  } = usePlanBoardLogic({ assignments, students, rounds, onUpdateAssignments })

  return (
    <div className="space-y-6" data-cy="plan-board">
      <BoardControls
        moveHistoryLength={moveHistory.length}
        selectedStudentId={selectedStudentId}
        onUndo={undoLastMove}
        onCancelSelection={handleCancelSelection}
      />

      <BoardStatus
        error={error}
        selectedStudentId={selectedStudentId}
        selectedStudent={selectedStudentId ? studentsById.get(selectedStudentId) : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedRounds.map(round => {
          const assignment = assignments.find(a => a.roundId === round.id)
          if (!assignment) return null

          return (
            <RoundCard
              key={round.id}
              round={round}
              assignment={assignment}
              studentsById={studentsById}
              selectedStudentId={selectedStudentId}
              onGroupClick={handleGroupClick}
              onStudentClick={handleStudentClick}
            />
          )
        })}
      </div>
    </div>
  )
})

PlanBoard.displayName = 'PlanBoard'