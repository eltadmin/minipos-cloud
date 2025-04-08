module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    }],
  },
  overrides: [
    {
      // These files need to use 'any' type for external integrations
      files: [
        'src/cash-registers/entities/cash-register.entity.ts',
        'src/cash-registers/services/communication.service.ts',
        'src/config/logger.config.ts'
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}; 