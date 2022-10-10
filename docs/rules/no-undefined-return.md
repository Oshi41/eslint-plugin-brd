# brd/no-undefined-return
> Do not return undefined
> - ⭐️ This rule is included in `plugin:brd/recommended` preset.
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Examples

```js
// brd/no-undefined-return: ['error']
function correct() {
    if (rand()) {
        return 1;
    }
    if (rand()) {
        return 'string';
    }
    if (rand()) {
        return true;
    }
    if (rand()) {
        return [];
    }
    if (rand()) {
        return { };
    }
    if (rand()) {
        return null;
    }
    if (!rand()) {
        return;
    }    
}

function incorrect() {
    if (rand()) {
        return undefined;
    }
    if (rand()){
        return (undefined)
    }
}

```

## Options

No additional options for rule

## Implementation

- [Rule source](../../lib/rules/no-undefined-return.js)
- [Test source](../../tests/lib/rules/no-undefined-return.js)
