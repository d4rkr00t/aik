'use strict';

module.exports = {
  root: true,

  parser: 'babel-eslint',

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      generators: true
    }
  },

  rules: {
    // http://eslint.org/docs/rules/

    // Possible errors
    'no-cond-assign': 'warn',
    'no-constant-condition': 'warn',
    'no-dupe-args': 'warn',
    'no-dupe-keys': 'warn',
    'no-duplicate-case': 'warn',
    'no-empty-character-class': 'warn',
    'no-empty': 'warn',
    'no-ex-assign': 'warn',
    'no-extra-semi': 'warn',
    'no-func-assign': 'warn',
    'no-invalid-regexp': 'warn',
    'no-irregular-whitespace': 'warn',
    'no-negated-in-lhs': 'warn',
    'no-obj-calls': 'warn',
    'no-unexpected-multiline': 'warn',
    'no-unreachable': 'warn',
    'use-isnan': 'warn',
    'valid-typeof': 'warn',

    // Best practices
    'array-callback-return': 'warn',
    'guard-for-in': 'warn',
    'no-div-regex': 'warn',
    'no-empty-pattern': 'warn',
    'no-eq-null': 'warn',
    'no-eval': 'warn',
    'no-extend-native': 'warn',
    'no-extra-bind': 'warn',
    'no-extra-label': 'warn',
    'no-fallthrough': 'warn',
    'no-implied-eval': 'warn',
    'no-invalid-this': 'warn',
    'no-labels': 'warn',
    'no-lone-blocks': 'warn',
    'no-native-reassign': 'warn',
    'no-new-func': 'warn',
    'no-self-assign': 'warn',
    'no-self-compare': 'warn',
    'no-unmodified-loop-condition': 'warn',
    'no-unused-labels': 'warn',
    'no-useless-call': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-concat': 'warn',
    'no-void': 'warn',
    'no-with': 'warn',

    // Variables
    'no-delete-var': 'warn',
    'no-label-var': 'warn',
    'no-undef-init': 'warn',
    'no-undef': 'warn',
    'no-unused-vars': 'warn',

    // ECMAScript 6
    'constructor-super': 'warn',
    'no-class-assign': 'warn',
    'no-const-assign': 'warn',
    'no-dupe-class-members': 'warn',
    'no-duplicate-imports': 'warn',
    'no-new-symbol': 'warn',
    'no-this-before-super': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-rename': 'warn',
    'require-yield': 'warn'
  }
};