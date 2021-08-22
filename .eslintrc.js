module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          "Function": false,
          // add a custom message to help explain why not to use it
          // add a custom message, AND tell the plugin how to fix it
          "{}": {
            "message": "Use object instead",
            "fixWith": "object"
          }
        }
      }
    ]
  },
  ignorePatterns: ['webpack.config.js'],
};
