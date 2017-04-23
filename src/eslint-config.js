module.exports = {
  root: true,

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    impliedStrict: true,
    ecmaFeatures: {
      jsx: true,
      generators: true
    }
  },

  plugins: ["react"],

  rules: {
    // http://eslint.org/docs/rules/

    // Possible errors
    "no-cond-assign": "warn",
    "no-constant-condition": "warn",
    "no-dupe-args": "warn",
    "no-dupe-keys": "warn",
    "no-duplicate-case": "warn",
    "no-empty-character-class": "warn",
    "no-empty": "warn",
    "no-ex-assign": "warn",
    "no-extra-semi": "warn",
    "no-func-assign": "warn",
    "no-invalid-regexp": "warn",
    "no-irregular-whitespace": "warn",
    "no-negated-in-lhs": "warn",
    "no-obj-calls": "warn",
    "no-unexpected-multiline": "warn",
    "no-unreachable": "warn",
    "use-isnan": "warn",
    "valid-typeof": "warn",
    "require-await": "warn",

    // Best practices
    "array-callback-return": "warn",
    "guard-for-in": "warn",
    "no-div-regex": "warn",
    "no-empty-pattern": "warn",
    "no-eq-null": "warn",
    "no-eval": "warn",
    "no-extend-native": "warn",
    "no-extra-bind": "warn",
    "no-extra-label": "warn",
    "no-fallthrough": "warn",
    "no-global-assign": "warn",
    "no-implied-eval": "warn",
    "no-invalid-this": "warn",
    "no-labels": "warn",
    "no-lone-blocks": "warn",
    "no-new-func": "warn",
    "no-self-assign": "warn",
    "no-self-compare": "warn",
    "no-unmodified-loop-condition": "warn",
    "no-unused-expressions": "warn",
    "no-unused-labels": "warn",
    "no-useless-call": "warn",
    "no-useless-escape": "warn",
    "no-useless-concat": "warn",
    "no-useless-return": "warn",
    "no-void": "warn",
    "no-with": "warn",

    // Variables
    "no-delete-var": "warn",
    "no-label-var": "warn",
    "no-undef-init": "warn",
    "no-undef": "warn",
    "no-unused-vars": "warn",

    // ECMAScript 6
    "constructor-super": "warn",
    "no-class-assign": "warn",
    "no-const-assign": "warn",
    "no-dupe-class-members": "warn",
    "no-duplicate-imports": "warn",
    "no-new-symbol": "warn",
    "no-this-before-super": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-constructor": "warn",
    "no-useless-rename": "warn",
    "require-yield": "warn",

    // https://github.com/yannickcr/eslint-plugin-react
    "react/jsx-key": "warn",
    "react/jsx-no-comment-textnodes": "warn",
    "react/jsx-no-duplicate-props": ["warn", { ignoreCase: true }],
    "react/jsx-no-undef": "warn",
    "react/jsx-pascal-case": ["warn", { allowAllCaps: true }],
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
    "react/no-danger-with-children": "warn",
    "react/no-deprecated": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-is-mounted": "warn",
    "react/react-in-jsx-scope": "warn",
    "react/require-render-return": "warn",
    "react/style-prop-object": "warn"
  }
};
