const path = require('path')
const resolve = _path => path.resolve(__dirname, _path)
const DOMGlobals = ['window', 'document']
const NodeGlobals = ['module']


module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: '@typescript-eslint/parser', // 配置ts解析器
  parserOptions: {
    project: resolve('./tsconfig.json'), 
    tsconfigRootDir: resolve('./'),
    sourceType: 'module'
  },
  // plugins: ['prettier'],
  rules: {
    'indent': ['off', 2],
    'no-unused-vars': 'warn',
    'no-restricted-globals': ['error', ...DOMGlobals, ...NodeGlobals],
    'no-console': 'off',
    // 禁止对使用 const 定义的常量重新赋值
    'no-const-assign': 'error',
    }
};