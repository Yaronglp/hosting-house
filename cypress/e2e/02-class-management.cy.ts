describe('Class Management - CRUD Operations', () => {
  beforeEach(() => {
    cy.clearAppData()
    cy.visit('/')
    cy.waitForAppReady()
  })

  it('should create multiple classes and switch between them', () => {
    // Create first class
    cy.createClass('כיתה א׳1', 'תשפ״ה')
    cy.verifyHeaderShowsClass('כיתה א׳1')
    
    // Create second class
    cy.createClass('כיתה ב׳2', 'תשפ״ו')
    cy.verifyHeaderShowsClass('כיתה ב׳2')
    
    // Create third class
    cy.createClass('כיתה ג׳3', 'תשפ״ז')
    cy.verifyHeaderShowsClass('כיתה ג׳3')
    
    // Verify all classes are listed
    cy.get('[data-cy="class-item"]').should('have.length', 3)
    cy.get('[data-cy="class-item"]').should('contain', 'כיתה א׳1')
    cy.get('[data-cy="class-item"]').should('contain', 'כיתה ב׳2')
    cy.get('[data-cy="class-item"]').should('contain', 'כיתה ג׳3')
  })

  it('should edit class name and year', () => {
    cy.createClass('כיתה מקורית', 'תשפ״ה')
    
    // Edit the class
    cy.get('[data-cy="edit-class-button"]').first().click()
    cy.get('[data-cy="class-name-input"]').clear().type('כיתה מעודכנת')
    cy.get('[data-cy="class-year-input"]').clear().type('תשפ״ו')
    cy.get('[data-cy="save-button"]').click()
    
    // Verify changes
    cy.get('[data-cy="class-item"]').should('contain', 'כיתה מעודכנת')
    cy.verifyHeaderShowsClass('כיתה מעודכנת')
  })

  it('should delete class with confirmation dialog', () => {
    cy.createClass('כיתה למחיקה', 'תשפ״ה')
    cy.createClass('כיתה שניה', 'תשפ״ו')
    
    cy.get('[data-cy="class-item"]').should('have.length', 2)
    
    // Delete first class by finding the delete button within the first class item
    cy.get('[data-cy="class-item"]').first().within(() => {
      cy.get('[data-cy="delete-class-button"]').should('be.visible').click()
    })
    cy.get('[data-cy="dialog-confirm-button"]').should('be.visible').click()
    
    // Verify class was deleted
    cy.get('[data-cy="class-item"]').should('have.length', 1)
    cy.get('[data-cy="class-item"]').should('not.contain', 'כיתה למחיקה')
    cy.get('[data-cy="class-item"]').should('contain', 'כיתה שניה')
    
    // Verify second class is now selected
    cy.get('[data-cy="app-header"]').should('contain', 'כיתה שניה')
  })

  it('should show empty state when no classes exist', () => {
    // Should show empty state initially
    cy.verifyEmptyClassesState()
    
    // Create a class to verify empty state disappears
    cy.createClass('כיתה ראשונה')
    cy.get('[data-cy="empty-classes-state"]').should('not.exist')
    cy.get('[data-cy="class-item"]').should('be.visible')
  })

  it('should test class settings (group size configuration)', () => {
    cy.createClass('כיתה עם הגדרות', 'תשפ״ה')
    
    // Open class settings
    cy.get('[data-cy="settings-button"]').click()
    
    // Verify settings panel opens
    cy.get('[data-cy="class-settings"]').should('be.visible')
    
    // Change group size
    cy.get('[data-cy="group-size-input"]').clear().type('8')
    cy.get('[data-cy="save-settings-button"]').click()
    
    // Verify settings were saved
    cy.get('[data-cy="class-settings"]').should('not.exist')
  })

  it('should verify current class indicator in header', () => {
    // No class selected initially
    cy.get('[data-cy="app-header"]').should('not.contain', '•')
    
    // Create and select first class
    cy.createClass('כיתה ראשונה', 'תשפ״ה')
    cy.get('[data-cy="app-header"]').should('contain', 'כיתה ראשונה')
    
    // Create second class (should be auto-selected)
    cy.createClass('כיתה שניה', 'תשפ״ו')
    cy.get('[data-cy="app-header"]').should('contain', 'כיתה שניה')
    
    // Switch back to first class
    cy.get('[data-cy="class-item"]').first().click()
    cy.get('[data-cy="app-header"]').should('contain', 'כיתה ראשונה')
  })

  it('should handle class form validation', () => {
    // Try to create class without name
    cy.navigateToTab('classes')
    cy.get('[data-cy="add-class-button"]').click()
    cy.get('[data-cy="save-button"]').click()
    
    // Should not create class (form validation)
    cy.get('[data-cy="class-item"]').should('not.exist')
    
    // Create class with valid name
    cy.get('[data-cy="class-name-input"]').type('כיתה תקינה')
    cy.get('[data-cy="save-button"]').click()
    cy.get('[data-cy="class-item"]').should('contain', 'כיתה תקינה')
  })

  it('should test class deletion with students (cascade behavior)', () => {
    cy.createClass('כיתה עם תלמידים', 'תשפ״ה')
    
    // Add some students
    const studentNames = ['יוסי כהן', 'שרה לוי', 'דוד ישראלי']
    cy.addStudentsViaPaste(studentNames)
    
    // Verify students exist
    cy.navigateToTab('students')
    cy.get('[data-cy="student-item"]').should('have.length', 3)
    
    // Delete the class
    cy.navigateToTab('classes')
    cy.get('[data-cy="delete-class-button"]').click()
    cy.get('[data-cy="dialog-confirm-button"]').should('be.visible').click()
    
    cy.get('[data-cy="class-item"]').should('not.exist')
    cy.contains('אין כיתות עדיין').should('be.visible')
  })
})
