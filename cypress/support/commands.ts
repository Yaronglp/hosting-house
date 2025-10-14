/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************


Cypress.Commands.add('clearAppData', () => {
  cy.window().then((win) => {
    if (win.indexedDB) {
      // Delete the database and wait for completion
      const deleteRequest = win.indexedDB.deleteDatabase('BaitMeareahDB')
      
      return new Cypress.Promise((resolve) => {
        deleteRequest.onsuccess = () => {
          // Also clear localStorage and sessionStorage
          win.localStorage.clear()
          win.sessionStorage.clear()
          resolve()
        }
        deleteRequest.onerror = () => {
          // Even if delete fails, clear storage
          win.localStorage.clear()
          win.sessionStorage.clear()
          resolve()
        }
        deleteRequest.onblocked = () => {
          // If blocked, still clear storage
          win.localStorage.clear()
          win.sessionStorage.clear()
          resolve()
        }
      })
    } else {
      // No IndexedDB, just clear storage
      win.localStorage.clear()
      win.sessionStorage.clear()
      return Promise.resolve()
    }
  })
})


// Wait for app to be ready
Cypress.Commands.add('waitForAppReady', () => {
  cy.get('[data-cy="app-header"]', { timeout: 10000 }).should('be.visible')
})


// Navigate to specific tab
Cypress.Commands.add('navigateToTab', (tabName: string) => {
  cy.get(`[data-cy="tab-${tabName}"]`).click()
  cy.get(`[data-cy="tab-${tabName}"]`).should('have.class', 'neon-text-pink')
})


// Helper commands for common flows
Cypress.Commands.add('createClass', (name: string, year?: string) => {
  cy.navigateToTab('classes')
  cy.get('[data-cy="add-class-button"]').click()
  cy.get('[data-cy="class-name-input"]').type(name)
  if (year) {
    cy.get('[data-cy="class-year-input"]').type(year)
  }
  cy.get('[data-cy="save-button"]').click()
  cy.get('[data-cy="class-item"]').should('contain', name)
})

Cypress.Commands.add('addStudentsViaPaste', (names: string[]) => {
  cy.navigateToTab('students')
  cy.get('[data-cy="paste-names-button"]').click()
  cy.get('[data-cy="names-textarea"]').type(names.join('\n'))
  cy.get('[data-cy="add-students-button"]').click()
  cy.get('[data-cy="student-item"]').should('have.length', names.length)
})

Cypress.Commands.add('addRound', (date: string) => {
  cy.navigateToTab('rounds')
  cy.get('[data-cy="add-round-button"]').click()
  cy.get('[data-cy="round-date-input"]').type(date)
  cy.get('[data-cy="save-round-button"]').click()
  cy.get('[data-cy="round-item"]').should('be.visible')
})

Cypress.Commands.add('verifyPlanGenerated', () => {
  cy.get('[data-cy="plan-board"]', { timeout: 10000 }).should('be.visible')
  cy.get('[data-cy="validation-panel"]').should('contain', 'תוכנית תקינה')
})

Cypress.Commands.add('getFutureDate', (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return cy.wrap(date.toISOString().split('T')[0]); // Returns YYYY-MM-DD format
})

// Navigate to share view
Cypress.Commands.add('navigateToShareView', () => {
  cy.get('[data-cy="share-view-button"]').click()
})

// Test WhatsApp share
Cypress.Commands.add('testWhatsAppShare', () => {
  cy.get('[data-cy="whatsapp-share-button"]').click()
})

// Test JSON export
Cypress.Commands.add('testJSONExport', () => {
  cy.get('[data-cy="export-json-button"]').click()
})

// Verify plan board structure
Cypress.Commands.add('verifyPlanBoardStructure', () => {
  cy.get('[data-cy="plan-board"]').should('be.visible')
  cy.get('[data-cy="round-board"]').should('have.length.at.least', 1)
  cy.get('[data-cy="group-card"]').should('have.length.at.least', 1)
})

// Verify groups have students
Cypress.Commands.add('verifyGroupsHaveStudents', () => {
  cy.get('[data-cy="group-card"]').each(($group) => {
    cy.wrap($group).find('[data-cy="student-chip"]').should('have.length.at.least', 2)
  })
})

// Verify empty classes state
Cypress.Commands.add('verifyEmptyClassesState', () => {
  // Check for empty state by looking for the title text
  cy.contains('אין כיתות עדיין').should('be.visible')
  cy.get('[data-cy="add-class-button"]').should('be.visible')
})

// Verify header shows class name
Cypress.Commands.add('verifyHeaderShowsClass', (className: string) => {
  // Wait a bit for the header to update
  cy.wait(500)
  cy.get('[data-cy="app-header"]').should('contain', className)
})

Cypress.Commands.add('addIndividualStudent', (name: string) => {
  cy.navigateToTab('students')
  cy.get('[data-cy="add-student-button"]').click()
  cy.get('[data-cy="student-name-input"]').type(name)
  cy.get('[data-cy="save-button"]').click()
  cy.get('[data-cy="student-item"]').should('contain', name)
})

Cypress.Commands.add('deleteStudentByIndex', (index: number = 0) => {
  cy.get('[data-cy="student-item"]').eq(index).within(() => {
    cy.get('[data-cy="delete-student-button"]').click()
  })
  cy.get('[data-cy="dialog-confirm-button"]').should('be.visible').click()
  cy.get('[data-cy="dialog-confirm-button"]').should('not.exist')
})

Cypress.Commands.add('editStudentByIndex', (index: number, updates: { name?: string; canHost?: boolean; avoidStudent?: boolean }) => {
  cy.get('[data-cy="student-item"]').eq(index).within(() => {
    cy.get('[data-cy="edit-student-button"]').click()
  })
  
  if (updates.name) {
    cy.get('[data-cy="student-name-input"]').clear().type(updates.name)
  }
  
  if (updates.canHost !== undefined) {
    if (updates.canHost) {
      cy.get('[data-cy="student-can-host-checkbox"]').check()
    } else {
      cy.get('[data-cy="student-can-host-checkbox"]').uncheck()
    }
  }
  
  if (updates.avoidStudent) {
    cy.get('[data-cy="avoid-student-checkbox"]').first().check()
  }
  
  cy.get('[data-cy="save-button"]').click()
})

Cypress.Commands.add('verifyStudentCount', (expectedCount: number) => {
  cy.get('[data-cy="student-item"]').should('have.length', expectedCount)
})

Cypress.Commands.add('verifyStudentsExist', (names: string[]) => {
  names.forEach(name => {
    cy.get('[data-cy="student-item"]').should('contain', name)
  })
})

Cypress.Commands.add('verifyEmptyStudentsState', () => {
  cy.navigateToTab('students')
  cy.contains('אין תלמידים בכיתה').should('be.visible')
  cy.get('[data-cy="add-student-button"]').should('be.visible')
  cy.get('[data-cy="paste-names-button"]').should('be.visible')
})

Cypress.Commands.add('testPasteModal', (names: string[], expectedCount?: number) => {
  cy.get('[data-cy="paste-names-button"]').click()
  cy.get('[data-cy="names-textarea"]').type(names.join('\n'))
  cy.get('[data-cy="add-students-button"]').click()
  
  if (expectedCount !== undefined) {
    cy.get('[data-cy="student-item"]').should('have.length', expectedCount)
  }
})

declare global {
  namespace Cypress {
    interface Chainable {
      clearAppData(): Chainable<void>
      waitForAppReady(): Chainable<void>
      navigateToTab(tabName: string): Chainable<void>
      createClass(name: string, year?: string): Chainable<void>
      addStudentsViaPaste(names: string[]): Chainable<void>
      addRound(date: string): Chainable<void>
      verifyPlanGenerated(): Chainable<void>
      getFutureDate(daysFromNow: number): Chainable<string>
      navigateToShareView(): Chainable<void>
      testWhatsAppShare(): Chainable<void>
      testJSONExport(): Chainable<void>
      verifyPlanBoardStructure(): Chainable<void>
      verifyGroupsHaveStudents(): Chainable<void>
      verifyEmptyClassesState(): Chainable<void>
      verifyHeaderShowsClass(className: string): Chainable<void>
      addIndividualStudent(name: string): Chainable<void>
      deleteStudentByIndex(index?: number): Chainable<void>
      editStudentByIndex(index: number, updates: { name?: string; canHost?: boolean; avoidStudent?: boolean }): Chainable<void>
      verifyStudentCount(expectedCount: number): Chainable<void>
      verifyStudentsExist(names: string[]): Chainable<void>
      verifyEmptyStudentsState(): Chainable<void>
      testPasteModal(names: string[], expectedCount?: number): Chainable<void>
    }
  }
}

// Export to make this file a module
export {}

