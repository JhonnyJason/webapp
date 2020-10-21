module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:vue/recommended',
    '@vue/prettier',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': ['warn', { singleQuote: false, semi: true }],
    '@typescript-eslint/no-floating-promises': 'warn'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  }
}
