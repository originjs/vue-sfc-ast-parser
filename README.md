# vue-sfc-ast-parser
An AST parser for `vue-sfc`. This is extracted from [vue-codemod](https://github.com/originjs/vue-codemod)

## Template parser
The AST parser for `template` part of `vue-sfc` is [vue-eslint-parser](https://github.com/vuejs/vue-eslint-parser).

## Script parser
The AST parser for `script` part of `vue-sfc` is [jscodeshift](https://github.com/facebook/jscodeshift). Actually it's using [babel parser](https://github.com/babel/babel/tree/master/packages/babel-parser).

## Style parser
There is no valid AST parser for `style` part yet. Contributions are welcome. :-)
