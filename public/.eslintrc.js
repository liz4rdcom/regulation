// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 1,
    'no-unused-expressions': 1,
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'prefer-destructuring': 0,
    'object-shorthand': 0,
    'no-use-before-define': 2,
    'class-methods-use-this': 0,
    'no-param-reassign': 1,
    'no-return-await': 0,
    'no-plusplus': 1,
    'space-before-function-paren': 0,
    'semi': 1,
    'no-unused-vars': 1,
    'no-trailing-spaces': 1,
    'no-multiple-empty-lines': 1,
    'eol-last': 1,
    'padded-blocks': 1,
    'prefer-arrow-callback': 1,
    'comma-dangle': 1
  }
}
