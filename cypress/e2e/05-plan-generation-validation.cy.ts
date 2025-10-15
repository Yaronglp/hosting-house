describe('Plan Generation Validation - Edge Cases and Error Handling', () => {
  beforeEach(() => {
    cy.clearAppData()
    cy.visit('/')
    cy.waitForAppReady()
  })

  it('should show empty state for insufficient rounds (no rounds)', () => {
    cy.createClass('כיתה ללא מפגשים', 'תשפ״ה')
    
    // Add students but no rounds
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי', 'מיכל רוזן'])

    cy.navigateToTab('plan')
    
    cy.get('[data-cy="empty-plan-state-no-rounds"]').should('be.visible')
    cy.get('[data-cy="empty-plan-state-no-rounds"]').should('contain', 'חסרים תאריכי מפגש')
  })

  it('should show error for insufficient hosts (all students canHost=false)', () => {
    cy.createClass('כיתה ללא מארחים', 'תשפ״ה')
    
    // Add students and disable hosting for all
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי', 'מיכל רוזן'])
    
    // Disable hosting for all students
    cy.get('[data-cy="student-item"]').each(($student) => {
      cy.wrap($student).find('[data-cy="student-can-host-toggle"]').click()
    })
    
    cy.getFutureDate(7).then(futureDate => {
      cy.addRound(futureDate)
    })
    
    // Try to generate plan
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    
    cy.get('[cy-data="plan-generation-error-title"]').should('be.visible')
    cy.get('[cy-data="plan-generation-error-title"]').should('contain', 'שגיאה ביצירת התוכנית')
  })

  it('should generate plan successfully with minimum requirements', () => {
    cy.createClass('כיתה מינימלית', 'תשפ״ה')
    
    // Add minimum students (3)
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי'])
    cy.getFutureDate(7).then(futureDate => {
      cy.addRound(futureDate)
    })
    
    // Generate plan
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    
    // Should generate successfully
    cy.verifyPlanGenerated()
    cy.get('[data-cy="plan-board"]').should('be.visible')
  })

  it('should handle generation with student preferences (avoid)', () => {
    cy.createClass('כיתה עם העדפות', 'תשפ״ה')
    
    // Add students
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי', 'מיכל רוזן', 'אבי גולד'])
    
    // Set some avoid preferences
    cy.editStudentByIndex(0, { avoidStudent: true })
    
    cy.getFutureDate(7).then(futureDate => {
      cy.addRound(futureDate)
    })
    cy.getFutureDate(14).then(futureDate => {
      cy.addRound(futureDate)
    })
    
    // Generate plan
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    
    // Should generate successfully despite preferences
    cy.verifyPlanGenerated()
    
    // Check for warnings about preferences
    cy.get('[data-cy="validation-panel"]').should('be.visible')
  })

  it('should display validation warnings correctly', () => {
    cy.createClass('כיתה עם אזהרות', 'תשפ״ה')
    
    // Add students with preferences
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי', 'מיכל רוזן'])
    
    // Set avoid preferences
    cy.editStudentByIndex(0, { avoidStudent: true })
    
    cy.getFutureDate(7).then(futureDate => {
      cy.addRound(futureDate)
    })
    cy.getFutureDate(14).then(futureDate => {
      cy.addRound(futureDate)
    })
    
    // Generate plan
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    cy.verifyPlanGenerated()
    
    // Check for warnings
    cy.get('[data-cy="validation-panel"]').should('be.visible')
    cy.get('[data-cy="validation-warnings"]').should('be.visible')
  })

  it('should handle generation with complex avoid preferences', () => {
    cy.createClass('כיתה עם העדפות מורכבות', 'תשפ״ה')
    
    // Add students with many preferences that previously caused failure
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי', 'מיכל רוזן', 'אבי גולד', 'רחל כהן'])

    // Set avoid preferences for first student
    cy.get('[data-cy="student-item"]').eq(0).within(() => {
        cy.get('[data-cy="edit-student-button"]').click()
    })

    cy.get('[data-cy="avoid-student-checkbox"]').first().check()
    cy.get('[data-cy="avoid-student-checkbox"]').eq(1).check()
    cy.get('[data-cy="avoid-student-checkbox"]').eq(2).check()
    cy.get('[data-cy="save-button"]').click()
    
    // Set avoid preferences for another student
    cy.get('[data-cy="student-item"]').eq(4).within(() => {
        cy.get('[data-cy="edit-student-button"]').click()
    })

    cy.get('[data-cy="avoid-student-checkbox"]').first().check()
    cy.get('[data-cy="avoid-student-checkbox"]').eq(1).check()
    cy.get('[data-cy="avoid-student-checkbox"]').eq(2).check()
    cy.get('[data-cy="save-button"]').click()

    cy.getFutureDate(7).then(futureDate => {
      cy.addRound(futureDate)
    })
    cy.getFutureDate(14).then(futureDate => {
      cy.addRound(futureDate)
    })
    
    // Generate plan - should now succeed with improved algorithm
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    
    // Should generate successfully despite complex avoid preferences
    cy.verifyPlanGenerated()
    cy.get('[data-cy="plan-board"]').should('be.visible')
    
    // Check for validation warnings about avoid preferences
    cy.get('[data-cy="validation-panel"]').should('be.visible')
  })

  it('should show appropriate empty states messages for different empty states scenarios', () => {
    cy.createClass('כיתה לבדיקת שגיאות', 'תשפ״ה')
    
    // Test 1: No students
    cy.navigateToTab('plan')
    cy.get('[data-cy="empty-plan-state-no-students-and-rounds"]').should('be.visible')
    cy.get('[data-cy="empty-plan-state-no-students-and-rounds"]').should('contain', 'מוכן להתחיל?')
    
    // Test 2: Add students but no rounds
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי'])
    cy.navigateToTab('plan')
    cy.get('[data-cy="empty-plan-state-no-rounds"]').should('be.visible')
    cy.get('[data-cy="empty-plan-state-no-rounds"]').should('contain', 'חסרים תאריכי מפגש')
    
    // Test 3: Add rounds but disable all hosting
    cy.getFutureDate(7).then(futureDate => {
      cy.addRound(futureDate)
    })

    cy.navigateToTab('students')
    cy.get('[data-cy="student-item"]').each(($student) => {
        cy.wrap($student).find('[data-cy="student-can-host-toggle"]').click()
    })

    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    cy.get('[cy-data="plan-generation-error-title"]').should('be.visible')
    cy.get('[cy-data="plan-generation-error-title"]').should('contain', 'שגיאה ביצירת התוכנית')
  })
})
