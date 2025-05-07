/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    // Map jsonpath-plus-browser to its CJS build for Jest
    '^jsonpath-plus-browser$': '<rootDir>/node_modules/jsonpath-plus-browser/dist/index-node-cjs.js',
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json'
      },
    ],
  },
  // Remove transformIgnorePatterns - no longer needed with module mapping
  // transformIgnorePatterns: [
  //   '/node_modules/(?!jsonpath-plus-browser).+\\.js$',
  //   '/node_modules/(?!jsonpath-plus-browser).+\\.mjs$'
  // ],
}; 