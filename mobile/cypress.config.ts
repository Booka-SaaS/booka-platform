import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:4200',
    viewportWidth: 375,  // Mobile width (iPhone X)
    viewportHeight: 812, // Mobile height (iPhone X)
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
