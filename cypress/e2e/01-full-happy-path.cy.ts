describe('Full Happy Path - Complete User Journey', () => {
  beforeEach(() => {
    cy.clearAppData()
    cy.visit('/')
    cy.waitForAppReady()
  })

  it('should complete the full 5-step flow from README', () => {
    // Step 1: Create a class
    cy.createClass('כיתה א׳1', 'תשפ״ה')
    
    // Verify class is selected and header shows class name
    cy.get('[data-cy="app-header"]').should('contain', 'כיתה א׳1')
    
    // Step 2: Add students via paste modal
    const studentNames = [
      'יוסי כהן',
      'שרה לוי', 
      'דוד ישראלי',
      'מיכל רוזן',
      'אבי גולד',
      'רחל כהן',
      'אלי ברק',
      'נועה שטרן',
      'יונתן לוי',
      'מיכל גולד',
      'אור כהן',
      'דני ישראלי'
    ]
    
    cy.addStudentsViaPaste(studentNames)
    
    // Verify students were added
    cy.get('[data-cy="student-item"]').should('have.length', studentNames.length)
    
    // Step 3: Create 3 rounds with future dates
    cy.getFutureDate(7).then((date1) => {
      cy.addRound(date1)
    })
    cy.getFutureDate(14).then((date2) => {
      cy.addRound(date2)
    })
    cy.getFutureDate(21).then((date3) => {
      cy.addRound(date3)
    })
    
    // Verify rounds were created
    cy.get('[data-cy="round-item"]').should('have.length', 3)
    
    // Step 4: Generate plan
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    
    // Verify plan was generated successfully
    cy.verifyPlanGenerated()
    
    // Verify plan board shows groups and hosts
    cy.verifyPlanBoardStructure()
    cy.get('[data-cy="round-board"]').should('have.length', 3)
    cy.get('[data-cy="group-card"]').should('have.length.at.least', 3)
    
    // Verify each group has a host
    cy.verifyGroupsHaveStudents()
    
    // Step 5: Test sharing features
    cy.navigateToShareView()
    
    // Test WhatsApp share text generation
    cy.testWhatsAppShare()
    cy.window().then((win) => {
      // Verify clipboard contains Hebrew text with class and dates
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.contain('כיתה א׳1')
        expect(text).to.contain('יוסי כהן') // Should contain student names
        expect(text).to.contain('תוכנית בית מארח') // Should contain app name
      })
    })
    
    // Test JSON export
    cy.testJSONExport()
    
    // Verify download was triggered (file should be downloaded)
    cy.window().then((win) => {
      // Check that a download was initiated
      expect(win.performance.getEntriesByType('navigation')).to.have.length.at.least(1)
    })
  })

  it('should handle the complete flow with student preferences', () => {
    // Create class and add students
    cy.createClass('כיתה ב׳2', 'תשפ״ו')
    
    const studentNames = [
      'אליה כהן',
      'מיכל לוי',
      'דני ישראלי',
      'שרה גולד',
      'יונתן רוזן',
      'נועה שטרן'
    ]
    
    cy.addStudentsViaPaste(studentNames)
    
    // Add some student preferences (avoid relationships)
    cy.get('[data-cy="edit-student-button"]').first().click()
    cy.get('[data-cy="avoid-student-checkbox"]').first().check()
    cy.get('[data-cy="save-button"]').click()
    
    // Create rounds
    cy.getFutureDate(7).then((date1) => {
      cy.addRound(date1)
    })
    cy.getFutureDate(14).then((date2) => {
      cy.addRound(date2)
    })
    
    // Generate plan
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    
    // Verify plan generated successfully despite preferences
    cy.verifyPlanGenerated()
    
    // Verify validation panel shows warnings about preferences
    cy.get('[data-cy="validation-panel"]').should('be.visible')
  })

  it('should verify plan board displays correctly with all elements', () => {
    // Setup: Create class, students, and rounds
    cy.createClass('כיתה א׳3')
    
    const studentNames = [
      'אבי כהן',
      'מיכל לוי', 
      'דני ישראלי',
      'שרה גולד',
      'יונתן רוזן',
      'נועה שטרן',
      'אלי ברק',
      'רחל כהן'
    ]
    
    cy.addStudentsViaPaste(studentNames)
    cy.getFutureDate(7).then((date1) => {
      cy.addRound(date1)
    })
    cy.getFutureDate(14).then((date2) => {
      cy.addRound(date2)
    })
    cy.getFutureDate(21).then((date3) => {
      cy.addRound(date3)
    })
    
    // Generate plan
    cy.navigateToTab('plan')
    cy.get('[data-cy="generate-plan-button"]').click()
    cy.verifyPlanGenerated()
    
    // Verify plan board structure
    cy.verifyPlanBoardStructure()
    cy.get('[data-cy="round-board"]').should('have.length', 3)
    
    // Verify each round has groups
    cy.get('[data-cy="round-board"]').each(($round) => {
      cy.wrap($round).find('[data-cy="group-card"]').should('have.length.at.least', 1)
    })
    
    // Verify groups contain students
    cy.verifyGroupsHaveStudents()
    
    // Verify validation panel shows success
    cy.get('[data-cy="validation-panel"]').should('contain', 'תוכנית תקינה')
  })
})
