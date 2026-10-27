module.exports = {
  setupFiles: ['<rootDir>/__mocks__/setup-env.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
    '^@testing-library/react-native$': '<rootDir>/__mocks__/@testing-library/react-native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*)',
  ],
};
