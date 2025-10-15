describe('Rounds Management - Meeting Dates Operations', () => {
  beforeEach(() => {
    cy.clearAppData()
    cy.visit('/')
    cy.waitForAppReady()
    cy.createClass('כיתה לבדיקת מפגשים', 'תשפ״ה')
  })
  
  it('should add multiple rounds with dates', () => {
    cy.getFutureDate(7).then(futureDate1 => {
      cy.getFutureDate(14).then(futureDate2 => {
        cy.getFutureDate(21).then(futureDate3 => {
          cy.addRound(futureDate1)
          cy.addRound(futureDate2)
          cy.addRound(futureDate3)
          
          // Verify all rounds were created
          cy.get('[data-cy="round-item"]').should('have.length', 3)
          
          // Verify rounds are displayed
          cy.get('[data-cy="round-item"]').should('be.visible')
        })
      })
    })
  })

  it('should edit round dates', () => {
    cy.getFutureDate(7).then(originalDate => {
      cy.getFutureDate(14).then(newDate => {
        // Create initial round
        cy.addRound(originalDate)
        
        // Edit the round
        cy.get('[data-cy="edit-round-button"]').first().click()
        cy.get('[data-cy="round-date-input"]').clear().type(newDate)
        cy.get('[data-cy="save-round-button"]').click()
        
        // Verify round was updated
        cy.get('[data-cy="round-item"]').should('be.visible')
      })
    })
  })

  it('should delete rounds', () => {
    cy.getFutureDate(7).then(date1 => {
      cy.getFutureDate(14).then(date2 => {
        cy.getFutureDate(21).then(date3 => {
          // Create multiple rounds
          cy.addRound(date1)
          cy.addRound(date2)
          cy.addRound(date3)
          
          // Verify all rounds exist
          cy.get('[data-cy="round-item"]').should('have.length', 3)
          
          // Delete first round
          cy.get('[data-cy="delete-round-button"]').first().click()
          cy.get('[data-cy="dialog-confirm-button"]').click()
          
          // Verify round was deleted
          cy.get('[data-cy="round-item"]').should('have.length', 2)
        })
      })
    })
  })

  it('should reject duplicate dates', () => {
    cy.getFutureDate(7).then(futureDate => {
      // Create first round
      cy.addRound(futureDate)
      
      // Try to create round with same date
      cy.get('[data-cy="add-round-button"]').click()
      cy.get('[data-cy="round-date-input"]').type(futureDate)
      cy.get('[data-cy="save-round-button"]').click()
      
      // Should show error message in toast
      cy.get('[role="alert"]', { timeout: 10000 }).should('contain', 'תאריך זה כבר קיים במערכת')
      
      // Verify still inside form
      cy.get('[data-cy="round-form"]').should('be.visible')
    })
  })

  it('should show empty state when no rounds', () => {
    // Navigate to rounds tab first
    cy.navigateToTab('rounds')
    
    // Should show empty state initially
    cy.get('[data-cy="empty-rounds-state"]').should('be.visible')
    cy.get('[data-cy="add-round-button"]').should('be.visible')
    
    // Add round to verify empty state disappears
    cy.getFutureDate(7).then(date => {
      cy.addRound(date)
      cy.get('[data-cy="empty-rounds-state"]').should('not.exist')
      cy.get('[data-cy="round-item"]').should('be.visible')
    })
  })

  it('should test round form validation', () => {
    // Try to create round without date
    cy.navigateToTab('rounds')
    cy.get('[data-cy="add-round-button"]').click()
    cy.get('[data-cy="save-round-button"]').click()
    
    // Should show error message in toast
    cy.checkNativeValidation('[data-cy="round-date-input"]', false, `Please fill out this field.`)
    
    // Add round with valid date
    cy.getFutureDate(7).then(date => {
      cy.get('[data-cy="round-date-input"]').type(date)
      cy.get('[data-cy="save-round-button"]').click()
      cy.get('[data-cy="round-item"]').should('be.visible')
    })
  })

  it('should handle round date input constraints', () => {
    cy.navigateToTab('rounds')
    cy.get('[data-cy="add-round-button"]').click()
    
    // Check that date input has min attribute set to today
    cy.get('[data-cy="round-date-input"]').should('have.attr', 'min')
    
    // Try to select today's date (should be allowed)
    const today = new Date().toISOString().split('T')[0]
    cy.get('[data-cy="round-date-input"]').type(today)
    cy.get('[data-cy="save-round-button"]').click()
    
    // Should create round successfully
    cy.get('[data-cy="round-item"]').should('be.visible')
  })

  it('should test round editing with validation', () => {
    cy.getFutureDate(7).then(originalDate => {
      cy.getFutureDate(14).then(newDate => {
        // Create initial round
        cy.addRound(originalDate)
        
        // Edit to a different valid date
        cy.get('[data-cy="edit-round-button"]').first().click()
        cy.get('[data-cy="round-date-input"]').clear().type(newDate)
        cy.get('[data-cy="save-round-button"]').click()
        
        // Should update successfully
        cy.get('[data-cy="round-item"]').should('be.visible')
        
        // Try to edit to past date
        cy.get('[data-cy="edit-round-button"]').first().click()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const pastDate = yesterday.toISOString().split('T')[0]
        cy.get('[data-cy="round-date-input"]').clear().type(pastDate)
        cy.get('[data-cy="save-round-button"]').click()
        
        // Should show native error in tooltip
        cy.checkNativeValidation('[data-cy="round-date-input"]', false, `Value must be ${new Date().toLocaleString('en-GB').split(',')[0]} or later`)
      })
    })
  })
})
