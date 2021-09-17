module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['react-hooks', 'prettier'],
  rules: {
    'func-names': ['warn', 'as-needed'],
    'func-style': 'off',
    'no-nested-ternary': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 100,
      },
    ],
  },
  env: {
    browser: true,
  },
  overrides: [
    {
      files: ['*.spec.js?(x)', '**/__test__/**', '*.spec.ts?(x)'],
      env: { jest: true },
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
};
