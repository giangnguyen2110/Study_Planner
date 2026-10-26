module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^react-native/setup-env$': '<rootDir>/__mocks__/setup-env.js',
    '^react-native/asset-registry$': '<rootDir>/__mocks__/setup-env.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
