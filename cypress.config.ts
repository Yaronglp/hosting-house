import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // add tasks, code coverage, etc.
      return config
    },
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'cypress/support/component-index.html',
    setupNodeEvents(on, config) {
      // Add module replacement for mocks
      on('file:preprocessor', (file) => {
        if (file.filePath.includes('src/hooks/useKV')) {
          return { outputPath: 'cypress/support/mocks/useKV.ts' }
        }
        if (file.filePath.includes('src/hooks/useToast')) {
          return { outputPath: 'cypress/support/mocks/useToast.ts' }
        }
        return file
      })
      return config
    },
  },
})
