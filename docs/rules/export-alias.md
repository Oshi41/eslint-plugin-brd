# brd/export-alias
> Use special alias for 'exports' directive.
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details
Rule forces to use special alias for export directive.

### Correct examples

```js
// brd/export-alias: ['error', 'E']
const E = exports;

E.t = function(param) {
    console.log('here')
}

E.foo = bar;
```

### Incorrect examples
```js
// brd/export-alias: ['error', 'E']
const A = exports; // wrong alias
var E = exports; // only const 

// only alias allowed
exports = {
    a: '123'
}
module.exports = [];
```

## Options

Pass string as alias name


## Implementation

- [Rule source](../../lib/rules/export-alias.js)
- [Test source](../../tests/lib/rules/export-alias.js)
