"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/operator-space");

new RuleTester().run("operator-space", rule, {
    valid: [],
    invalid: [
        {
            code: "if(a>b){}else if(b<a){}",
            output: "if(a > b){}else if(b<a){}",
            options: [{
                binaries: {
                    before: true,
                    after: true,
                    overrides: [
                        "<", {
                            before: false,
                            after: false
                        }
                    ]
                }
            }],
            errors: 2
        },
        {
            code: "1+(+'1')",
            output: "1 + (+'1')",
            options: [{
                binaries: {
                    before: true,
                    after: true
                },
                unaries: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "1+(+'1')",
            output: "1 + (+ '1')",
            options: [{
                binaries: {
                    before: true,
                    after: true
                },
                unaries: {
                    before: true,
                    after: true
                }
            }],
            errors: 3
        },

        {
            code: "++ z",
            output: "++z",
            options: [{
                updates: {
                    before: false,
                    after: false
                }
            }],
            errors: 1
        },
        {
            code: "z ++",
            output: "z++",
            options: [{
                updates: {
                    before: false,
                    after: false
                }
            }],
            errors: 1
        },
        {
            code: "z --",
            output: "z--",
            options: [{
                updates: {
                    before: false,
                    after: false
                }
            }],
            errors: 1
        },
        {
            code: "if (z || 2){}",
            output: "if (z||2){}",
            options: [{
                logicals: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "if (z && 2){}",
            output: "if (z&&2){}",
            options: [{
                logicals: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },

        {
            code: "z += 2",
            output: "z+=2",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z *= 2",
            output: "z*=2",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z /= 2",
            output: "z/=2",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z &= true",
            output: "z&=true",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z |= true",
            output: "z|=true",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },

        {
            code: "var z = 5",
            output: "var z=5",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z += 5",
            output: "z+=5",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z -= 5",
            output: "z-=5",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z *= 5",
            output: "z*=5",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z /= 5",
            output: "z/=5",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },
        {
            code: "z %= 5",
            output: "z%=5",
            options: [{
                assigns: {
                    before: false,
                    after: false
                }
            }],
            errors: 2
        },

        {
            code: "var a = 1 * + '1'",
            output: "var a = 1 * +'1'",
            options: [{
                unaries: {
                    before: false,
                    after: false
                }
            }],
            errors: 1
        },
        {
            code: "var a = 1 * - '1'",
            output: "var a = 1 * -'1'",
            options: [{
                unaries: {
                    before: false,
                    after: false
                }
            }],
            errors: 1
        },
        {
            code: "var a = 1 * ! true",
            output: "var a = 1 * !true",
            options: [{
                unaries: {
                    before: false,
                    after: false
                }
            }],
            errors: 1
        },
        {
            code: "var a = 1 * ~ true",
            output: "var a = 1 * ~true",
            options: [{
                unaries: {
                    before: false,
                    after: false
                }
            }],
            errors: 1
        }

    ]
});
