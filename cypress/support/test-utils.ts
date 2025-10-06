/// <reference types="cypress" />

// Test utilities for the Hosting House application

export const TEST_DATA = {
  CLASSES: [
    { name: 'כיתה א', year: '2024' },
    { name: 'כיתה ב', year: '2024' },
    { name: 'כיתה ג', year: '2025' }
  ],
  STUDENTS: [
    'יוסי כהן',
    'שרה לוי', 
    'דוד ישראלי',
    'מיכל רוזן',
    'אבי כהן',
    'רחל לוי',
    'משה ישראלי',
    'רחל כהן'
  ],
  ROUNDS: [
    'סבב ראשון',
    'סבב שני',
    'סבב שלישי'
  ]
}

export const TEST_SCENARIOS = {
  // Scenario with minimal data
  MINIMAL: {
    students: ['יוסי כהן', 'שרה לוי', 'דוד ישראלי'],
    rounds: ['סבב ראשון']
  },
  
  // Scenario with constraints
  CONSTRAINED: {
    students: ['יוסי כהן', 'שרה לוי', 'דוד ישראלי', 'מיכל רוזן'],
    rounds: ['סבב ראשון', 'סבב שני'],
    constraints: {
      avoid: [['יוסי כהן', 'שרה לוי']],
      like: [['דוד ישראלי', 'מיכל רוזן']]
    }
  },
  
  // Scenario that might cause generation issues
  PROBLEMATIC: {
    students: ['יוסי כהן', 'שרה לוי', 'דוד ישראלי'],
    rounds: ['סבב ראשון', 'סבב שני', 'סבב שלישי'],
    constraints: {
      canHost: ['יוסי כהן'] // Only one student can host
    }
  }
}

export const VALIDATION_MESSAGES = {
  ERRORS: {
    DUPLICATE_HOST: 'מארח כפול',
    CAPACITY_OVERFLOW: 'קיבולת חריגה',
    INSUFFICIENT_HOSTS: 'מארחים לא מספיקים'
  },
  WARNINGS: {
    AVOID_VIOLATED: 'הפרת הימנעות',
    REPEATED_PAIRING: 'זיווג חוזר',
    LIKE_UNMET: 'העדפה לא מולאה'
  }
}

export const ACCESSIBILITY_CHECKS = {
  ARIA_ROLES: [
    'banner',
    'main',
    'navigation',
    'button',
    'form',
    'alert',
    'region',
    'group'
  ],
  KEYBOARD_SHORTCUTS: {
    'ctrl+1': 'classes',
    'ctrl+2': 'students', 
    'ctrl+3': 'rounds',
    'ctrl+4': 'plan'
  }
}

// Helper functions for common test operations
export const TestHelpers = {
  // Create a complete test setup
  createCompleteSetup: () => {
    cy.get('[data-cy="add-class-button"]').click()
    cy.get('[data-cy="class-name-input"]').type('כיתה א')
    cy.get('[data-cy="class-year-input"]').type('2024')
    cy.get('[data-cy="save-button"]').click()
    
    cy.get('[data-cy="tab-students"]').click()
    cy.get('[data-cy="paste-names-button"]').click()
    cy.get('[data-cy="names-textarea"]').type(TEST_DATA.STUDENTS.slice(0, 6).join('\n'))
    cy.get('[data-cy="add-students-button"]').click()
    
    cy.get('[data-cy="tab-rounds"]').click()
    cy.get('[data-cy="add-round-button"]').click()
    cy.get('[data-cy="round-name-input"]').type('סבב ראשון')
    cy.get('[data-cy="save-round-button"]').click()
    
    cy.get('[data-cy="add-round-button"]').click()
    cy.get('[data-cy="round-name-input"]').type('סבב שני')
    cy.get('[data-cy="save-round-button"]').click()
  },
  
  // Generate a plan and wait for completion
  generatePlan: () => {
    cy.get('[data-cy="tab-plan"]').click()
    cy.get('[data-cy="generate-plan-button"]').click()
    cy.get('[data-cy="plan-board"]', { timeout: 10000 }).should('be.visible')
  },
  
  // Check that plan is valid
  checkPlanValid: () => {
    cy.get('[data-cy="validation-panel"]').should('contain', 'תוכנית תקינה')
  },
  
  // Check accessibility basics
  checkAccessibility: () => {
    cy.get('[data-cy="app-header"]').should('have.attr', 'role', 'banner')
    cy.get('[data-cy="tab-classes"]').should('have.attr', 'role', 'button')
  }
}

// Mock functions for testing
export const MockFunctions = {
  // Mock successful plan generation
  mockPlanGeneration: () => {
    cy.window().then((win) => {
      win.fetch = cy.stub().resolves({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    })
  },
  
  // Mock Web Share API
  mockWebShare: () => {
    cy.window().then((win) => {
      win.navigator.share = cy.stub().resolves()
    })
  },
  
  // Mock clipboard API
  mockClipboard: () => {
    cy.window().then((win) => {
      win.navigator.clipboard = {
        writeText: cy.stub().resolves()
      }
    })
  }
}

// Performance testing utilities
export const PerformanceHelpers = {
  // Measure page load time
  measurePageLoad: () => {
    cy.window().then((win) => {
      const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart
      expect(loadTime).to.be.lessThan(3000) // Should load within 3 seconds
    })
  },
  
  // Measure plan generation time
  measurePlanGeneration: () => {
    const startTime = Date.now()
    cy.get('[data-cy="generate-plan-button"]').click()
    cy.get('[data-cy="plan-board"]', { timeout: 10000 }).should('be.visible').then(() => {
      const endTime = Date.now()
      const generationTime = endTime - startTime
      expect(generationTime).to.be.lessThan(10000) // Should generate within 10 seconds
    })
  }
}

// Data validation utilities
export const DataValidation = {
  // Check that all students are present
  checkAllStudents: (expectedStudents: string[]) => {
    expectedStudents.forEach(student => {
      cy.get('[data-cy="student-item"]').should('contain', student)
    })
  },
  
  // Check that all rounds are present
  checkAllRounds: (expectedRounds: string[]) => {
    expectedRounds.forEach(round => {
      cy.get('[data-cy="round-item"]').should('contain', round)
    })
  },
  
  // Check that plan has correct structure
  checkPlanStructure: (expectedRounds: number, expectedGroupsPerRound: number) => {
    cy.get('[data-cy="round-board"]').should('have.length', expectedRounds)
    cy.get('[data-cy="group-card"]').should('have.length', expectedRounds * expectedGroupsPerRound)
  }
}

