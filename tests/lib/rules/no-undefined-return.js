"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/no-undefined-return");

new RuleTester().run("no-undefined-return", rule, {
    valid: [
        {
            code: "function a() { return 1; return '123'; return null; return []; if (a > 2) return;  return {}}",
            options: []
        }
    ],
    invalid: [
        {
            code: "function a(){return undefined; return (undefined); return ((((((undefined))))));}",
            output: "function a(){return; return; return;}",
            options: [],
            errors: 3
        }
    ]
});
