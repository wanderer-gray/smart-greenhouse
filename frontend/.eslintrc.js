module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  globals: {
    http: true,
    nofity: true,
    AuthAPI: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
  }
}
