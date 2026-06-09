const base = require('./jest.config.cjs');

module.exports = {
  ...base,
  testMatch: ['<rootDir>/**/*.integration.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
};
