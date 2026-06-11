const tsJestTransformer = require.resolve('ts-jest');

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [tsJestTransformer, { tsconfig: 'tsconfig.json' }],
  },
  setupFiles: ['<rootDir>/tests/setup-env.ts'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '\\.integration\\.spec\\.ts$'],
  collectCoverageFrom: [
    'src/**/*.ts',
    'services/**/*.ts',
    '!src/server.ts',
    '!services/**/src/main.ts',
  ],
};
