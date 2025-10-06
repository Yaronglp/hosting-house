// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your component test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Import the mount command for component testing
import { mount } from 'cypress/react'

// Add the mount command to Cypress
Cypress.Commands.add('mount', mount)

// Extend Cypress Chainable interface for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // on uncaught exceptions from the application
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})
