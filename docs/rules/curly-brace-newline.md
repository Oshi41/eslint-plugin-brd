# xxxx/curly-brace-newline
> Managing curly brace newline style
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

Rule can force newline before and after curly brace.

### Incorrect examples

```js
// brd-curly-brace-newline: ['error', 'IfStatement', {start: 'same'}]
function x() {
    
}

// brd-curly-brace-newline: ['error', 'IfStatement', {start: 'new'}]
function x()
{

}

// brd-curly-brace-newline: ['error', 'IfStatement', {start: 'new_for_long_declaration'}]
function x() {
    
}
// brd-curly-brace-newline: ['error', 'IfStatement', {start: 'new_for_long_declaration'}]
function longFunction(firstParameter, secondParameter,
    thirdParameter)
{
    
}
```

## Options

Rule accept option array. 

First param is a name of AST node which contains curly brace inside. It may be:
1) IsStatement
2) WhileStatement
3) ForStatement
4) ForInStatement
5) ForOfStatement
6) ClassBody
7) ObjectExpression
8) ExportNamedDeclaration
9) FunctionExpression
10) ArrowFunctionExpression

Second param is configuration object
```
{
    // style for opening brace
    start?: "same" | "new" | "new_for_long_declaration",
    
    // style for closing brace
    end?: "same" | "new"
}
```

1) same - force brace to stay on the same line
2) new - force brace to be on new line
3) new_for_long_declaration - if function declaration tooks more than one line,
forces brace to be on new line, otherwise stays on same line

   

## Implementation

- [Rule source](../../lib/rules/curly-brace-newline.js)
- [Test source](../../tests/lib/rules/curly-brace-newline.js)
