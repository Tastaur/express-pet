/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ["<rootDir>/src"],
  testMatch: ['**/_test/**/*.test.ts'],
};