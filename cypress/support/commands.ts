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

// Stable selectors using data-cy attributes
Cypress.Commands.add('getBySel', (selector: string, ...args) => 
  cy.get(`[data-cy="${selector}"]`, ...args)
)

// Programmatic login/state setup for testing
Cypress.Commands.add('login', (user = 'demo') => {
  // For this PWA app, we'll seed the database with test data
  cy.window().then((win) => {
    // Clear existing data
    if (win.indexedDB) {
      win.indexedDB.deleteDatabase('hosting-house-db')
    }
  })
  cy.visit('/')
})

// Seed test data for consistent testing
Cypress.Commands.add('seedTestData', () => {
  cy.window().then((win) => {
    // This will be implemented based on the app's storage structure
    // For now, we'll use the app's natural flow
  })
})

// Clear all app data
Cypress.Commands.add('clearAppData', () => {
  cy.window().then((win) => {
    if (win.indexedDB) {
      win.indexedDB.deleteDatabase('hosting-house-db')
    }
  })
})

// Wait for app to be ready
Cypress.Commands.add('waitForAppReady', () => {
  cy.get('[data-cy="app-header"]', { timeout: 10000 }).should('be.visible')
})

// Keyboard navigation helper: simulate pressing Tab from an element and return focused element
// Allows usage like: cy.get('body').tab() or cy.get('[data-cy="input"]').tab()
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject: JQuery<HTMLElement>) => {
  return cy.window().then((win) => {
    const doc = win.document
    const focusable = Array.from(
      doc.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null)

    const active = doc.activeElement as HTMLElement | null
    const currentIndex = active ? focusable.indexOf(active) : -1
    const nextIndex = (currentIndex + 1) % focusable.length
    const next = focusable[nextIndex]
    if (next) next.focus()
    return cy.focused()
  })
})

// Navigate to specific tab
Cypress.Commands.add('navigateToTab', (tabName: string) => {
  cy.get(`[data-cy="tab-${tabName}"]`).click()
  cy.get(`[data-cy="tab-${tabName}"]`).should('have.class', 'active')
})

// Create a test class
Cypress.Commands.add('createTestClass', (className: string, year: string = '2024') => {
  cy.navigateToTab('classes')
  cy.get('[data-cy="add-class-button"]').click()
  cy.get('[data-cy="class-name-input"]').type(className)
  cy.get('[data-cy="class-year-input"]').type(year)
  cy.get('[data-cy="save-class-button"]').click()
  cy.get('[data-cy="class-item"]').should('contain', className)
})

// Add test students
Cypress.Commands.add('addTestStudents', (studentNames: string[]) => {
  cy.navigateToTab('students')
  cy.get('[data-cy="paste-names-button"]').click()
  cy.get('[data-cy="names-textarea"]').type(studentNames.join('\n'))
  cy.get('[data-cy="add-students-button"]').click()
  cy.get('[data-cy="student-item"]').should('have.length', studentNames.length)
})

// Create test rounds
Cypress.Commands.add('createTestRounds', (roundNames: string[]) => {
  cy.navigateToTab('rounds')
  roundNames.forEach((roundName, index) => {
    cy.get('[data-cy="add-round-button"]').click()
    cy.get('[data-cy="round-name-input"]').type(roundName)
    cy.get('[data-cy="save-round-button"]').click()
    cy.get('[data-cy="round-item"]').should('contain', roundName)
  })
})

// Generate a plan
Cypress.Commands.add('generatePlan', () => {
  cy.navigateToTab('plan')
  cy.get('[data-cy="generate-plan-button"]').click()
  cy.get('[data-cy="plan-board"]', { timeout: 10000 }).should('be.visible')
})

// Check for validation errors
Cypress.Commands.add('checkValidationErrors', (expectedErrors: string[] = []) => {
  if (expectedErrors.length === 0) {
    cy.get('[data-cy="validation-panel"]').should('contain', 'תוכנית תקינה')
  } else {
    cy.get('[data-cy="validation-errors"]').should('be.visible')
    expectedErrors.forEach(error => {
      cy.get('[data-cy="validation-errors"]').should('contain', error)
    })
  }
})

// Export data
Cypress.Commands.add('exportData', () => {
  cy.navigateToTab('plan')
  cy.get('[data-cy="share-tab"]').click()
  cy.get('[data-cy="export-json-button"]').click()
})

// Import data
Cypress.Commands.add('importData', (filePath: string) => {
  cy.navigateToTab('plan')
  cy.get('[data-cy="share-tab"]').click()
  cy.get('[data-cy="import-json-input"]').selectFile(filePath)
  cy.get('[data-cy="confirm-import-button"]').click()
})

declare global {
  namespace Cypress {
    interface Chainable {
      getBySel(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>
      login(user?: string): Chainable<void>
      seedTestData(): Chainable<void>
      clearAppData(): Chainable<void>
      waitForAppReady(): Chainable<void>
      tab(): Chainable<JQuery<HTMLElement>>
      navigateToTab(tabName: string): Chainable<void>
      createTestClass(className: string, year?: string): Chainable<void>
      addTestStudents(studentNames: string[]): Chainable<void>
      createTestRounds(roundNames: string[]): Chainable<void>
      generatePlan(): Chainable<void>
      checkValidationErrors(expectedErrors?: string[]): Chainable<void>
      exportData(): Chainable<void>
      importData(filePath: string): Chainable<void>
    }
  }
}

