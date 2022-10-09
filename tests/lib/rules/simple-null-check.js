"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/simple-null-check");

new RuleTester().run("simple-null-check", rule, {
    valid: [
        {
            code: "var a = bar(); if (!a){make()}",
            options: []
        },
        {
            code: "var a = bar() === undefined; if (!a){make()}",
            options: []
        },
        {
            code: "var a = bar() !== undefined; if (!a){make()}",
            options: []
        },
        {
            code: "if (bar !== undefined){make()} else {other()}",
            options: []
        }
    ],
    invalid: [
        {
            code: "var a = bar() !== 0",
            output: "var a = bar()",
            options: [],
            errors: 1
        },
        {
            code: "var a = bar() !== -0",
            output: "var a = bar()",
            options: [],
            errors: 1
        },
        {
            code: "var a = bar() !== +0",
            output: "var a = bar()",
            options: [],
            errors: 1
        },
        {
            code: "var a = bar() !== -(+(0))",
            output: "var a = bar()",
            options: [],
            errors: 1
        },
        {
            code: "var a = bar() !== !(+(0))",
            output: "var a = !bar()",
            options: [],
            errors: 1
        }
    ]
});
