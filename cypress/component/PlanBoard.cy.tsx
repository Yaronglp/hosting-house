/// <reference types="cypress" />
import React from 'react'
// Ensure TypeScript picks up custom cy.mount command typings
import '../support/component'
import { PlanBoard } from '../../src/components/planning/PlanBoard'

// Mock data
const mockStudents = [
  { id: '1', classId: 'class1', name: 'יוסי כהן', canHost: true, capacity: 6, like: [], avoid: [] },
  { id: '2', classId: 'class1', name: 'שרה לוי', canHost: true, capacity: 6, like: [], avoid: [] },
  { id: '3', classId: 'class1', name: 'דוד ישראלי', canHost: true, capacity: 6, like: [], avoid: [] },
  { id: '4', classId: 'class1', name: 'מיכל רוזן', canHost: true, capacity: 6, like: [], avoid: [] }
]

const mockRounds = [
  { id: '1', classId: 'class1', name: 'סבב ראשון', order: 0 },
  { id: '2', classId: 'class1', name: 'סבב שני', order: 1 }
]

const mockAssignments = [
  {
    roundId: '1',
    groups: [
      { id: '1', roundId: '1', hostId: '1', memberIds: ['2', '3'] },
      { id: '2', roundId: '1', hostId: '4', memberIds: [] }
    ]
  },
  {
    roundId: '2',
    groups: [
      { id: '3', roundId: '2', hostId: '2', memberIds: ['1', '4'] },
      { id: '4', roundId: '2', hostId: '3', memberIds: [] }
    ]
  }
]

describe('PlanBoard Component', () => {
  const defaultProps = {
    assignments: mockAssignments,
    students: mockStudents,
    rounds: mockRounds,
    onUpdateAssignments: () => {}
  }

  it('should render plan board with all rounds', () => {
    cy.mount(<PlanBoard {...defaultProps} />)
    
    cy.get('[data-cy="plan-board"]').should('be.visible')
    cy.get('[data-cy="round-board"]').should('have.length', 2)
    cy.get('[data-cy="round-board"]').first().should('contain', 'סבב ראשון')
    cy.get('[data-cy="round-board"]').last().should('contain', 'סבב שני')
  })

  it('should render groups for each round', () => {
    cy.mount(<PlanBoard {...defaultProps} />)
    
    // First round should have 2 groups
    cy.get('[data-cy="round-board"]').first().find('[data-cy="group-card"]').should('have.length', 2)
    
    // Second round should have 2 groups
    cy.get('[data-cy="round-board"]').last().find('[data-cy="group-card"]').should('have.length', 2)
  })

  it('should display host and members in each group', () => {
    cy.mount(<PlanBoard {...defaultProps} />)
    
    // Check first group in first round
    cy.get('[data-cy="group-card"]').first().should('contain', 'יוסי כהן')
    cy.get('[data-cy="group-card"]').first().should('contain', 'שרה לוי')
    cy.get('[data-cy="group-card"]').first().should('contain', 'דוד ישראלי')
    
    // Check second group in first round
    cy.get('[data-cy="group-card"]').eq(1).should('contain', 'מיכל רוזן')
  })

  it('should handle student selection', () => {
    cy.mount(<PlanBoard {...defaultProps} />)

    cy.get('[data-cy="student-chip"]').first().click()
    cy.get('[data-cy="student-chip"]').first().should('have.class', 'bg-blue-600 text-white')
    cy.get('[data-cy="student-chip"]').eq(2).should('have.class', 'bg-gray-100 text-gray-700 hover:bg-gray-200')
  })

  it('should handle student movement between groups', () => {
    const onUpdateAssignments = cy.stub()
    cy.mount(<PlanBoard {...defaultProps} onUpdateAssignments={onUpdateAssignments} />)
    
    // Select a student
    cy.get('[data-cy="student-chip"]').first().click()
    
    // Move to different group
    cy.get('[data-cy="group-card"]').eq(1).click()
    
    cy.then(() => {
      expect(onUpdateAssignments).to.have.been.called
    })
  })


  it('should handle undo functionality', () => {
    cy.mount(<PlanBoard {...defaultProps} />)
    
    // Make a move
    cy.get('[data-cy="student-chip"]').first().click()
    cy.get('[data-cy="group-card"]').eq(1).click()
    
    // Undo the move
    cy.contains('button', 'בטל מעבר אחרון').click()
    
    // Should revert the change
    cy.get('[data-cy="student-chip"]').first().should('be.visible')
  })

  it('should show group statistics', () => {
    cy.mount(<PlanBoard {...defaultProps} />)
    
    // Check group member counts are rendered as (members/capacity)
    cy.get('[data-cy="group-card"]').first().should('contain', '(2/6)')
    cy.get('[data-cy="group-card"]').eq(1).should('contain', '(0/6)')
  })

  it('should handle empty groups', () => {
    const emptyAssignments = [
      {
        roundId: '1',
        groups: [
          { id: '1', roundId: '1', hostId: '1', memberIds: [] }
        ]
      }
    ]
    
    cy.mount(<PlanBoard {...defaultProps} assignments={emptyAssignments} />)
    
    cy.get('[data-cy="group-card"]').should('contain', 'אין אורחים')
  })

  it('should be accessible', () => {
    cy.mount(<PlanBoard {...defaultProps} />)
    
    // Student chip is a native button
    cy.get('[data-cy="student-chip"]').first().should($el => {
      expect($el.prop('tagName')).to.equal('BUTTON')
    })
  })


  it('should handle different group sizes', () => {
    const largeAssignments = [
      {
        roundId: '1',
        groups: [
          { id: '1', roundId: '1', hostId: '1', memberIds: ['2', '3', '4'] }
        ]
      }
    ]
    
    cy.mount(<PlanBoard {...defaultProps} assignments={largeAssignments} />)
    
    cy.get('[data-cy="group-card"]').should('contain', '(3/6)')
  })
})
