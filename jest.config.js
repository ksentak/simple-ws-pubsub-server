module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts?$',
  testPathIgnorePatterns: ['<rootDir>/src/tests/testUtils/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/interfaces/',
    '<rootDir>/src/config.ts',
    '<rootDir>/src/tests/testUtils/',
  ],
  collectCoverage: true,
  silent: true,
};
