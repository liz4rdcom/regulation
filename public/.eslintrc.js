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
    'no-console': "warn",
    'no-unused-expressions': "warn",
    'arrow-body-style': "off",
    'arrow-parens': "off",
    'prefer-destructuring': "off",
    'object-shorthand': "off",
    'no-use-before-define': "error",
    'class-methods-use-this': "off",
    'no-param-reassign': "warn",
    'no-return-await': "off",
    'no-plusplus': "warn",
    'space-before-function-paren': "off",
    'semi': "warn",
    'no-unused-vars': "warn",
    'no-trailing-spaces': "warn",
    'no-multiple-empty-lines': "warn",
    'eol-last': "warn",
    'padded-blocks': "warn",
    'prefer-arrow-callback': "warn",
    'comma-dangle': "warn"
  }
}
