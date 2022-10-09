# brd/simple-null-check
> Prefer simple null check
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

Rule suggest to use simple null check for preventing common mistakes.

### Correct examples

```js
// brd/simple-null-check : 'error'

const obj = {};
if (!obj) {
    console.log('empty');
}
if (obj) {
    console.log('non empty');
}
```

### Incorrect examples
```js
// brd/simple-null-check : 'error'

const obj = {};
if (obj == 0 || obj === 0) {
    console.log('empty');
}
if (obj !== 0 || obj != 0 || obj != +(-0)) {
    console.log('non empty');
}
```

## Options

No options provided


## Implementation

- [Rule source](../../lib/rules/simple-null-check.js)
- [Test source](../../tests/lib/rules/simple-null-check.js)
