import { useCallback, useMemo, useState } from 'react'
import { Assignment, Student, Round } from '@/lib/types'

interface MoveAction {
  studentId: string
  fromRoundId: string
  toRoundId: string
  fromGroupId: string
  toGroupId: string
}

interface UsePlanBoardLogicProps {
  assignments: Assignment[]
  students: Student[]
  rounds: Round[]
  onUpdateAssignments: (assignments: Assignment[]) => void
}

export function usePlanBoardLogic({ assignments, students, rounds, onUpdateAssignments }: UsePlanBoardLogicProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [moveHistory, setMoveHistory] = useState<MoveAction[]>([])
  const [error, setError] = useState<string | null>(null)

  // Memoize expensive computations
  const studentsById = useMemo(() => new Map(students.map(s => [s.id, s])), [students])
  const sortedRounds = useMemo(() => [...rounds].sort((a, b) => a.order - b.order), [rounds])

  // Memoize validation function
  const canMoveStudent = useCallback((
    studentId: string,
    fromRoundId: string,
    toRoundId: string,
    toGroupId: string
  ): { valid: boolean; reason?: string } => {
    const student = studentsById.get(studentId)
    if (!student) return { valid: false, reason: 'תלמיד לא נמצא' }

    const toAssignment = assignments.find(a => a.roundId === toRoundId)
    const toGroup = toAssignment?.groups.find(g => g.id === toGroupId)
    if (!toGroup) return { valid: false, reason: 'קבוצה לא נמצאה' }

    const hostStudent = studentsById.get(toGroup.hostId)
    if (!hostStudent) return { valid: false, reason: 'מארח לא נמצא' }

    // Cannot move a host
    if (toGroup.hostId === studentId) {
      return { valid: false, reason: 'לא ניתן להעביר מארח' }
    }

    // Check capacity
    if (toGroup.memberIds.length >= hostStudent.capacity) {
      return { valid: false, reason: 'הקבוצה מלאה' }
    }

    // Check avoid constraints
    const allMembersInTarget = [toGroup.hostId, ...toGroup.memberIds]
    for (const memberId of allMembersInTarget) {
      const member = studentsById.get(memberId)
      if (student.avoid.includes(memberId) || member?.avoid.includes(studentId)) {
        const memberName = member?.name || memberId
        return { valid: false, reason: `הימנעות עם ${memberName}` }
      }
    }

    return { valid: true }
  }, [assignments, studentsById])

  // Memoize move execution
  const moveStudent = useCallback((action: MoveAction) => {
    const validation = canMoveStudent(
      action.studentId,
      action.fromRoundId,
      action.toRoundId,
      action.toGroupId
    )

    if (!validation.valid) {
      setError(validation.reason || 'לא ניתן לבצע מעבר')
      return false
    }

    // Create updated assignments
    const newAssignments = assignments.map(assignment => {
      if (assignment.roundId === action.fromRoundId && assignment.roundId === action.toRoundId) {
        // Moving within the same round
        return {
          ...assignment,
          groups: assignment.groups.map(group => {
            if (group.id === action.fromGroupId) {
              return {
                ...group,
                memberIds: group.memberIds.filter(id => id !== action.studentId)
              }
            } else if (group.id === action.toGroupId) {
              return {
                ...group,
                memberIds: [...group.memberIds, action.studentId]
              }
            }
            return group
          })
        }
      } else if (assignment.roundId === action.fromRoundId) {
        // Remove student from source group
        return {
          ...assignment,
          groups: assignment.groups.map(group => {
            if (group.id === action.fromGroupId) {
              return {
                ...group,
                memberIds: group.memberIds.filter(id => id !== action.studentId)
              }
            }
            return group
          })
        }
      } else if (assignment.roundId === action.toRoundId) {
        // Add student to target group
        return {
          ...assignment,
          groups: assignment.groups.map(group => {
            if (group.id === action.toGroupId) {
              return {
                ...group,
                memberIds: [...group.memberIds, action.studentId]
              }
            }
            return group
          })
        }
      }
      return assignment
    })

    onUpdateAssignments(newAssignments)
    setMoveHistory(prev => [...prev, action])
    setError(null)
    setSelectedStudentId(null)
    return true
  }, [assignments, canMoveStudent, onUpdateAssignments])

  // Memoize undo function
  const undoLastMove = useCallback(() => {
    if (moveHistory.length === 0) return

    const lastMove = moveHistory[moveHistory.length - 1]
    const reverseAction: MoveAction = {
      studentId: lastMove.studentId,
      fromRoundId: lastMove.toRoundId,
      toRoundId: lastMove.fromRoundId,
      fromGroupId: lastMove.toGroupId,
      toGroupId: lastMove.fromGroupId
    }

    // Execute reverse move
    const newAssignments = assignments.map(assignment => {
      if (assignment.roundId === reverseAction.fromRoundId && assignment.roundId === reverseAction.toRoundId) {
        return {
          ...assignment,
          groups: assignment.groups.map(group => {
            if (group.id === reverseAction.fromGroupId) {
              return {
                ...group,
                memberIds: group.memberIds.filter(id => id !== reverseAction.studentId)
              }
            } else if (group.id === reverseAction.toGroupId) {
              return {
                ...group,
                memberIds: [...group.memberIds, reverseAction.studentId]
              }
            }
            return group
          })
        }
      } else if (assignment.roundId === reverseAction.fromRoundId) {
        return {
          ...assignment,
          groups: assignment.groups.map(group => {
            if (group.id === reverseAction.fromGroupId) {
              return {
                ...group,
                memberIds: group.memberIds.filter(id => id !== reverseAction.studentId)
              }
            }
            return group
          })
        }
      } else if (assignment.roundId === reverseAction.toRoundId) {
        return {
          ...assignment,
          groups: assignment.groups.map(group => {
            if (group.id === reverseAction.toGroupId) {
              return {
                ...group,
                memberIds: [...group.memberIds, reverseAction.studentId]
              }
            }
            return group
          })
        }
      }
      return assignment
    })

    onUpdateAssignments(newAssignments)
    setMoveHistory(prev => prev.slice(0, -1))
    setError(null)
    setSelectedStudentId(null)
  }, [assignments, moveHistory, onUpdateAssignments])

  // Memoize event handlers
  const handleStudentClick = useCallback((studentId: string) => {
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null)
      setError(null)
    } else {
      setSelectedStudentId(studentId)
      setError(null)
    }
  }, [selectedStudentId])

  const handleGroupClick = useCallback((roundId: string, groupId: string) => {
    if (!selectedStudentId) return

    // Find source location
    let sourceRoundId = ''
    let sourceGroupId = ''
    
    for (const assignment of assignments) {
      for (const group of assignment.groups) {
        if (group.memberIds.includes(selectedStudentId) || group.hostId === selectedStudentId) {
          sourceRoundId = assignment.roundId
          sourceGroupId = group.id
          break
        }
      }
      if (sourceRoundId) break
    }

    if (!sourceRoundId) {
      setError('לא נמצא מיקום המקור של התלמיד')
      return
    }

    if (sourceRoundId === roundId && sourceGroupId === groupId) {
      setSelectedStudentId(null)
      setError(null)
      return
    }

    const action: MoveAction = {
      studentId: selectedStudentId,
      fromRoundId: sourceRoundId,
      toRoundId: roundId,
      fromGroupId: sourceGroupId,
      toGroupId: groupId
    }

    moveStudent(action)
  }, [selectedStudentId, assignments, moveStudent])

  const handleCancelSelection = useCallback(() => {
    setSelectedStudentId(null)
    setError(null)
  }, [])

  return {
    selectedStudentId,
    moveHistory,
    error,
    studentsById,
    sortedRounds,
    handleStudentClick,
    handleGroupClick,
    handleCancelSelection,
    undoLastMove
  }
}
