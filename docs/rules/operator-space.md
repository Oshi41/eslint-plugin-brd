# brd/operator-space
> Spacing within operators
> - ⭐️ This rule is included in `plugin:brd/recommended` preset.
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

> Managing spacing between operators

## Options

### Settings structure

```text
{
    unaries: {
        before: true | false,
        after: true | false,
        overrides: ["OPERATOR",  {before: true | false, after: true | false}]    
    },
    
    binaries: {
        before: true | false,
        after: true | false,
        overrides: ["OPERATOR", {before: true | false, after: true | false}]
    },
    
    logicals: {
        before: true | false,
        after: true | false,
        overrides: ["OPERATOR", {before: true | false, after: true | false}]
    },
    
    asigns: {
        before: true | false,
        after: true | false,
        overrides: ["OPERATOR", {before: true | false, after: true | false}]
    },
    
    updates: {
        before: true | false,
        after: true | false,
        overrides: ["OPERATOR", {before: true | false, after: true | false}]
    }
}
```

### Unaries

* '\-'
* '\+'
* '!'
* '~'

### Binaries

* "=="
* "!="
* "==="
* "!=="
* "<"
* "<="
* ">"
* ">="
* "<<"
* ">>"
* ">>>"
* "+"
* "-"
* "*"
* "/"
* "%"
* "**"
* ','
* "^"
* "&"

### Logicals

* '||'
* '&&'
* '??'

### Assigns

* "="
* "+="
* "-="
* "*="
* "/="
* "%="
* "**="
* "<<="
* ">>="
* ">>>="
* ",="
* "^="
* "&="
* "|="

### Overrides

You can override any possible value by passing array with operator name and settings. You can select any operator from
list.

See examples in rule tests

## Implementation

- [Rule source](../../lib/rules/operator-space.js)
- [Test source](../../tests/lib/rules/operator-space.js)
