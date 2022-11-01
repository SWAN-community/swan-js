const path = require('path');
const { compilerOptions } = require('./tsconfig');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  rootDir: './tests',
  testPathIgnorePatterns: [],
  'automock': false,
  'resetMocks': false,
};
