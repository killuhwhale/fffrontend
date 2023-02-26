module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'detox'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', 'e2e/*.test.js'],
      env: {
        'detox/detox': true,
        jest: true,
        'jest/globals': true,
      },
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
};
