import React from 'react'
import { ValidationPanel } from '../../src/components/planning/ValidationPanel'

// Mock data
const mockValidation = {
  isValid: true,
  errors: [],
  warnings: []
}

const mockValidationWithErrors = {
  isValid: false,
  errors: [
    { type: 'duplicate_host', message: 'יוסי כהן מארח פעמיים', count: 1 },
    { type: 'capacity_overflow', message: 'קבוצה 1 חורגת מקיבולת', count: 1 }
  ],
  warnings: [
    { type: 'avoid_violated', message: 'הפרת הימנעות: יוסי כהן עם שרה לוי', count: 1 },
    { type: 'repeated_pairing', message: 'זיווג חוזר: יוסי כהן עם דוד ישראלי', count: 1 }
  ]
}

function RetryHarness() {
  const [retrying, setRetrying] = React.useState(false)
  return (
    <ValidationPanel
      validation={mockValidationWithErrors}
      isRetrying={retrying}
      onRetry={() => setRetrying(true)}
    />
  )
}

describe('ValidationPanel Component', () => {
  it('should render success state when plan is valid', () => {
    cy.mount(<ValidationPanel validation={mockValidation} />)
    
    cy.get('[data-cy="validation-panel"]').should('be.visible')
    cy.get('[data-cy="validation-panel"]').should('contain', 'תוכנית תקינה')
    cy.get('[data-cy="success-icon"]').should('be.visible')
  })

  it('should render errors when plan is invalid', () => {
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} />)
    
    cy.get('[data-cy="validation-panel"]').should('be.visible')
    cy.get('[data-cy="validation-panel"]').should('contain', 'בעיות בתוכנית')
  })

  it('should display blocking errors', () => {
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} />)
    
    cy.get('[data-cy="validation-errors"]').should('be.visible')
    cy.get('[data-cy="validation-errors"]').should('contain', 'שגיאות חוסמות')
    cy.get('[data-cy="validation-errors"]').should('contain', 'יוסי כהן מארח פעמיים')
    cy.get('[data-cy="validation-errors"]').should('contain', 'קבוצה 1 חורגת מקיבולת')
  })

  it('should display warnings', () => {
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} />)
    
    cy.get('[data-cy="validation-warnings"]').should('be.visible')
    cy.get('[data-cy="validation-warnings"]').should('contain', 'אזהרות')
    cy.get('[data-cy="validation-warnings"]').should('contain', 'הפרת הימנעות')
    cy.get('[data-cy="validation-warnings"]').should('contain', 'זיווג חוזר')
  })

  it('should show retry button when plan is invalid', () => {
    const onRetry = cy.stub()
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} onRetry={onRetry} />)
    
    cy.get('[data-cy="retry-button"]').should('be.visible')
    cy.get('[data-cy="retry-button"]').should('contain', 'ניסיון תיקון')
  })

  it('should handle retry button click', () => {
    const onRetry = cy.stub()
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} onRetry={onRetry} />)
    
    cy.get('[data-cy="retry-button"]').click()
    
    cy.then(() => {
      expect(onRetry).to.have.been.called
    })
  })

 
  it('shows loading after clicking retry (via parent state)', () => {
    cy.mount(<RetryHarness />)
    cy.get('[data-cy="retry-button"]').click()
    cy.get('[data-cy="retry-button"]').should('contain', 'מנסה תיקון...')
    cy.get('[data-cy="retry-button"]').should('be.disabled')
  })

  it('should not show retry button when plan is valid', () => {
    cy.mount(<ValidationPanel validation={mockValidation} />)
    
    cy.get('[data-cy="retry-button"]').should('not.exist')
  })

  it('should display error counts', () => {
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} />)
    
    cy.get('[data-cy="validation-errors"]').should('contain', '2')
    cy.get('[data-cy="validation-warnings"]').should('contain', '2')
  })

  it('should handle empty validation state', () => {
    cy.mount(<ValidationPanel validation={null} />)
    
    cy.get('[data-cy="validation-panel"]').should('not.exist')
  })

  it('should support keyboard navigation', () => {
    const onRetry = cy.stub()
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} onRetry={onRetry} />)
    
    // Test tab navigation
    cy.get('[data-cy="retry-button"]').focus().should('be.focused').click().then(() => {
      expect(onRetry).to.have.been.called
    })
  })

  it('should handle different error types', () => {
    const complexValidation = {
      isValid: false,
      errors: [
        { type: 'duplicate_host', message: 'מארח כפול', count: 1 },
        { type: 'capacity_overflow', message: 'קיבולת חריגה', count: 2 },
        { type: 'insufficient_hosts', message: 'מארחים לא מספיקים', count: 1 }
      ],
      warnings: [
        { type: 'avoid_violated', message: 'הפרת הימנעות', count: 3 },
        { type: 'repeated_pairing', message: 'זיווג חוזר', count: 2 },
        { type: 'like_unmet', message: 'העדפה לא מולאה', count: 1 }
      ]
    }
    
    cy.mount(<ValidationPanel validation={complexValidation} />)
    
    cy.get('[data-cy="validation-errors"]').should('contain', 'מארח כפול')
    cy.get('[data-cy="validation-errors"]').should('contain', 'קיבולת חריגה')
    cy.get('[data-cy="validation-errors"]').should('contain', 'מארחים לא מספיקים')
    
    cy.get('[data-cy="validation-warnings"]').should('contain', 'הפרת הימנעות')
    cy.get('[data-cy="validation-warnings"]').should('contain', 'זיווג חוזר')
    cy.get('[data-cy="validation-warnings"]').should('contain', 'העדפה לא מולאה')
  })

  it('should handle large error counts', () => {
    const largeValidation = {
      isValid: false,
      errors: Array.from({ length: 10 }, (_, i) => ({
        type: 'error',
        message: `שגיאה ${i + 1}`,
        count: 1
      })),
      warnings: Array.from({ length: 5 }, (_, i) => ({
        type: 'warning',
        message: `אזהרה ${i + 1}`,
        count: 1
      }))
    }
    
    cy.mount(<ValidationPanel validation={largeValidation} />)
    
    cy.get('[data-cy="validation-errors"]').should('contain', '10')
    cy.get('[data-cy="validation-warnings"]').should('contain', '5')
  })

  it('should handle retry button states correctly', () => {
    const onRetry = cy.stub()
    
    // Test normal state
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} onRetry={onRetry} />)
    cy.get('[data-cy="retry-button"]').should('not.be.disabled')
    
    // Test loading state
    cy.mount(<ValidationPanel validation={mockValidationWithErrors} onRetry={onRetry} isRetrying={true} />)
    cy.get('[data-cy="retry-button"]').should('be.disabled')
  })
})
