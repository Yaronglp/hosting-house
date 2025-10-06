import React from 'react'
import { AppHeader } from '../../src/components/layout/AppHeader'

describe('AppHeader Component', () => {
  it('should render with default props', () => {
    cy.mount(<AppHeader activeTab="classes" onTabChange={() => {}} />)
    
    cy.get('[data-cy="app-header"]').should('be.visible')
    cy.get('[data-cy="app-header"]').should('contain', '🏠 בית מארח')
    
    // Check all navigation tabs are present
    cy.get('[data-cy="tab-classes"]').should('be.visible')
    cy.get('[data-cy="tab-students"]').should('be.visible')
    cy.get('[data-cy="tab-rounds"]').should('be.visible')
    cy.get('[data-cy="tab-plan"]').should('be.visible')
  })

  it('should display current class name when provided', () => {
    cy.mount(
      <AppHeader 
        activeTab="classes" 
        onTabChange={() => {}} 
        currentClassName="כיתה א"
      />
    )
    
    cy.get('[data-cy="app-header"]').should('contain', 'כיתה א')
  })

  it('should highlight active tab', () => {
    cy.mount(<AppHeader activeTab="students" onTabChange={() => {}} />)
    
    cy.get('[data-cy="tab-students"]').should('have.class', 'neon-text-pink')
    cy.get('[data-cy="tab-classes"]').should('not.have.class', 'neon-text-pink')
    cy.get('[data-cy="tab-rounds"]').should('not.have.class', 'neon-text-pink')
    cy.get('[data-cy="tab-plan"]').should('not.have.class', 'neon-text-pink')
  })

  it('should call onTabChange when tab is clicked', () => {
    const onTabChange = cy.stub()
    cy.mount(<AppHeader activeTab="classes" onTabChange={onTabChange} />)
    
    cy.get('[data-cy="tab-students"]').click().then(() => {
      expect(onTabChange).to.have.been.calledWith('students')
    })
    
    cy.get('[data-cy="tab-rounds"]').click().then(() => {
      expect(onTabChange).to.have.been.calledWith('rounds')
    })
    
    cy.get('[data-cy="tab-plan"]').click().then(() => {
      expect(onTabChange).to.have.been.calledWith('plan')
    })
  })

  it('should be accessible', () => {
    cy.mount(<AppHeader activeTab="classes" onTabChange={() => {}} />)
    
    // Check ARIA attributes
    cy.get('[data-cy="tab-classes"]').should('have.attr', 'role', 'button')
    cy.get('[data-cy="tab-students"]').should('have.attr', 'role', 'button')
    cy.get('[data-cy="tab-rounds"]').should('have.attr', 'role', 'button')
    cy.get('[data-cy="tab-plan"]').should('have.attr', 'role', 'button')
    
    // Check keyboard navigation
    cy.get('[data-cy="tab-classes"]').focus()
    cy.get('[data-cy="tab-classes"]').should('be.focused')
  })

  it('should handle all tab states correctly', () => {
    const tabs = ['classes', 'students', 'rounds', 'plan']
    
    tabs.forEach(tab => {
      cy.mount(<AppHeader activeTab={tab} onTabChange={() => {}} />)
      cy.get(`[data-cy="tab-${tab}"]`).should('have.class', 'neon-text-pink')
      
      // Other tabs should not be active
      tabs.filter(t => t !== tab).forEach(otherTab => {
        cy.get(`[data-cy="tab-${otherTab}"]`).should('not.have.class', 'neon-text-pink')
      })
    })
  })
})
