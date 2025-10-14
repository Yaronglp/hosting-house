describe('Student Management - Operations and Preferences', () => {
  beforeEach(() => {
    cy.clearAppData()
    cy.visit('/')
    cy.waitForAppReady()
    cy.createClass('כיתה לבדיקת תלמידים', 'תשפ״ה')
  })

  it('should add individual student via form', () => {
    cy.addIndividualStudent('יוסי כהן')
    cy.verifyStudentCount(1)
  })

  it('should add multiple students via paste modal', () => {
    const studentNames = [
      'יוסי כהן',
      'שרה לוי',
      'דוד ישראלי',
      'מיכל רוזן',
      'אבי גולד'
    ]
    
    cy.addStudentsViaPaste(studentNames)
    cy.verifyStudentCount(studentNames.length)
    cy.verifyStudentsExist(studentNames)
  })

  it('should edit student details (name and canHost flag)', () => {
    cy.addStudentsViaPaste(['יוסי כהן'])
    
    cy.editStudentByIndex(0, { 
      name: 'יוסי כהן המעודכן', 
      canHost: false 
    })
    
    // Verify changes
    cy.get('[data-cy="student-item"]').should('contain', 'יוסי כהן המעודכן')
    cy.get('[data-cy="student-can-host-toggle"]').should('contain', 'לא')
  })

  it('should delete students', () => {
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי'])
    cy.verifyStudentCount(3)
    
    // Delete first student (index 0)
    cy.deleteStudentByIndex(0)
    
    // Verify student was deleted
    cy.verifyStudentCount(2)
    cy.verifyStudentsExist(['שרה לוי', 'יוסי כהן'])
    cy.get('[data-cy="student-item"]').should('not.contain', 'דוד ישראלי')
  })

  it('should test student preferences (avoid selections)', () => {
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי', 'דוד ישראלי', 'מיכל רוזן'])
    
    // Edit first student to avoid second student
    cy.editStudentByIndex(0, { avoidStudent: true })
    
    // Verify preference was saved
    cy.get('[data-cy="student-item"]').first().should('contain', 'מעדיף לא להיות איתם')
  })

  it('should show empty state when no students', () => {
    cy.verifyEmptyStudentsState()
    
    // Add students to verify empty state disappears
    cy.addStudentsViaPaste(['יוסי כהן'])
    cy.contains('אין תלמידים בכיתה').should('not.exist')
    cy.get('[data-cy="student-item"]').should('be.visible')
  })

  it('should handle duplicate names in paste modal', () => {
    const studentNames = [
      'יוסי כהן',
      'שרה לוי',
      'יוסי כהן', // Duplicate
      'דוד ישראלי',
      'שרה לוי'   // Duplicate
    ]
    
    cy.navigateToTab('students')
    cy.testPasteModal(studentNames, 3) // Should only add unique names (3 students, not 5)
    cy.verifyStudentsExist(['יוסי כהן', 'שרה לוי', 'דוד ישראלי'])
  })

  it('should verify student count updates', () => {
    cy.navigateToTab('students')
    cy.verifyStudentCount(0)
    
    // Add students
    cy.addStudentsViaPaste(['יוסי כהן', 'שרה לוי'])
    cy.verifyStudentCount(2)
    
    // Delete a student
    cy.deleteStudentByIndex(0)
    cy.verifyStudentCount(1)
  })

  it('should test student form validation', () => {
    // Try to add student without name
    cy.navigateToTab('students')
    cy.get('[data-cy="add-student-button"]').click()
    cy.get('[data-cy="save-button"]').click()
    
    // Should not create student (form validation)
    cy.get('[data-cy="student-item"]').should('not.exist')
    
    // Add student with valid name
    cy.get('[data-cy="student-name-input"]').type('יוסי כהן')
    cy.get('[data-cy="save-button"]').click()
    cy.get('[data-cy="student-item"]').should('contain', 'יוסי כהן')
  })

  // TODO: Fix this test
  it('should test paste modal with empty input', () => {
    cy.navigateToTab('students')
    cy.get('[data-cy="paste-names-button"]').click()
    
    // Try to submit empty textarea
    cy.get('[data-cy="add-students-button"]').click()
    
    // Should not add any students (validation prevents empty submission)
    cy.verifyStudentCount(0)
    
    // Add valid names
    cy.testPasteModal(['יוסי כהן', 'שרה לוי'], 2)
  })
})
