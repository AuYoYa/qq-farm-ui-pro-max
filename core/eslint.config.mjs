import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    typescript: true,
    stylistic: false,
    yaml: false,
    jsonc: false,
    markdown: false,
    formatters: false,
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    rules: {
      'no-console': 'off',
      'no-use-before-define': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
      'prefer-const': 'off',
      'valid-typeof': 'warn',
      'unused-imports/no-unused-vars': 'off',
      'perfectionist/sort-imports': 'off',
      'ts/consistent-type-definitions': 'off',
      'ts/consistent-type-imports': 'off',
      'ts/no-explicit-any': 'off',
      'ts/no-require-imports': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'node/handle-callback-err': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/no-new-array': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'jsdoc/require-returns-description': 'off',
    },
  },
)
