/* eslint-disable eslint-plugin/prefer-output-null */
"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/export-alias");

new RuleTester({
    parserOptions: {
        ecmaVersion: 2017
    }
}).run("export-alias", rule, {
    valid: [

        {
            code: "const E = exports;",
            options: ["E"]
        },
        {
            code: "const AAA     =     exports;",
            options: ["AAA"]
        }
    ],
    invalid: [

        {
            code: "const E = exports;",
            output: "const A = exports;",
            options: ["A"],
            errors: 1
        },

        {
            code: "const E = exports; E.foo = bar;",
            output: "const A = exports; A.foo = bar;",
            options: ["A"],
            errors: 2
        },

        {
            code: `const E = exports;
exports = {
b: true,
o: {},
func: function() {},
str: '123',
num: 123,
arr: [],
}`,
            output: `const E = exports;
E.b = true
E.o = {}
E.func = function() {}
E.str = '123'
E.num = 123
E.arr = []`,
            options: ["E"],
            errors: 1
        },

        {
            code: `exports = {
b: true,
o: {},
func: function() {},
str: '123',
num: 123,
arr: [],
someFunc: a
}`,
            output: `E.b = true
E.o = {}
E.func = function() {}
E.str = '123'
E.num = 123
E.arr = []
E.someFunc = a`,
            options: ["E"],
            errors: 1
        },
        {
            code: `E.b = true
E.o = {}
E.func = function() {}
E.str = '123'
E.num = 123
E.arr = []
E.someFunc = a`,
            output: `const E = exports
E.b = true
E.o = {}
E.func = function() {}
E.str = '123'
E.num = 123
E.arr = []
E.someFunc = a`,
            options: ["E"],
            errors: 1
        },

        {
            code: "function main(){} exports.a = []; exports.b = '123';",
            output: "function main(){} E.a = []; E.b = '123';",
            options: ["E"],
            errors: 2
        },
        {
            code: "function main(){} E.a = []; E.b = '123';",
            output: `const E = exports
function main(){} E.a = []; E.b = '123';`,
            options: ["E"],
            errors: 1
        },

        {
            code: "var A = exports; A.dfd.fd = 123; A.t.t.t.t.t.t.t = 123",
            output: "const E = exports; E.dfd.fd = 123; E.t.t.t.t.t.t.t = 123",
            options: ["E"],
            errors: 3
        },

        {
            code: "exports = []; exports = 123; exports = function name(){}; exports = function(){};",
            output: "E.arr = []; E.foo = 123; E.name = function name(){}; E.func = function(){};",
            options: ["E"],
            errors: 4
        },

        {
            code: "module.exports = []; module.exports = 123; module.exports = function name(){}; module.exports = function(){};",
            output: "E.arr = []; E.foo = 123; E.name = function name(){}; E.func = function(){};",
            options: ["E"],
            errors: 4
        },
        {
            code: "E.a = ()=>{}",
            output: `const E = exports
E.a = ()=>{}`,
            options: ["E"],
            errors: 1
        }
    ]
});
