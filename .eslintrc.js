module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': ['error', { ts: 'never' }],
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
