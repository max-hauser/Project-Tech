module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    "no-underscore-dangle" : ["off", { "allow": ["foo_", "_bar"] }],
    "prefer-template": ["allow-single-concat"],
    "import/newline-after-import": ["error", {count: 2}],
    "no-use-before-define": ["error", {"functions": false, "classes": false}]
  }
};
