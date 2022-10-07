"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/curly-brace-newline");

new RuleTester().run("curly-brace-newline", rule, {
    valid: [
        {
            code: "if (1 == true) { }",
            options: ["IfStatement", {
                start: "same",
                end: "same"
            }]
        },
        {
            code: `if (1 == true)
{ }`,
            options: ["IfStatement", {
                start: "new",
                end: "same"
            }]
        },
        {
            code: `if (1 == true)
{
}`,
            options: ["IfStatement", {
                start: "new",
                end: "new"
            }]
        },
        {
            code: "if (1==2){};for(;;){};while(true){};try{}catch(e){}finally{}",
            options: [
                "IfStatement", {
                    start: "same",
                    end: "same"
                },
                "WhileStatement", {
                    start: "same",
                    end: "same"
                },
                "ForStatement", {
                    start: "same",
                    end: "same"
                },
                "TryStatement", {
                    start: "same",
                    end: "same"
                },
                "CatchClause", {
                    start: "same",
                    end: "same"
                }
            ]
        },
        {
            code: `function a(first, second,
                third)
{
                    foo();
                }`,
            options: ["FunctionDeclaration", { start: "new_for_long_declaration" }]
        }
    ],
    invalid: [
        {
            code: "if (1 == true){ }",
            output: `if (1 == true)
{ }`,
            options: ["IfStatement", { start: "new" }],
            errors: 1
        },
        {
            code: "if (1 == true){ }",
            output: `if (1 == true){ 
}`,
            options: ["IfStatement", { end: "new" }],
            errors: 1
        },
        {
            code: "if (1==2){};for(;;){};while(true){};try{}catch(e){}finally{}",
            output: `if (1==2){
};for(;;){
};while(true){
};try{
}catch(e){
}finally{
}`,
            options: [
                "IfStatement", { end: "new" },
                "ForStatement", { end: "new" },
                "WhileStatement", { end: "new" },
                "TryStatement", { end: "new" },
                "CatchClause", { end: "new" },
                "FinalStatement", { end: "new" }
            ],
            errors: 6
        },
        {
            code: "if (1==2){};for(;;){};while(true){};try{}catch(e){}finally{}",
            output: `if (1==2)
{
};for(;;)
{
};while(true)
{
};try
{
}catch(e)
{
}finally
{
}`,
            options: [
                "IfStatement", {
                    start: "new",
                    end: "new"
                },
                "ForStatement", {
                    start: "new",
                    end: "new"
                },
                "WhileStatement", {
                    start: "new",
                    end: "new"
                },
                "TryStatement", {
                    start: "new",
                    end: "new"
                },
                "CatchClause", {
                    start: "new",
                    end: "new"
                },
                "FinalStatement", {
                    start: "new",
                    end: "new"
                }
            ],
            errors: 12
        },
        {
            code: "var obj = {prop1: 1, prop2: true, prop3: '123', prop4: function(){}, prop5: {}}",
            output: `var obj = 
{prop1: 1, prop2: true, prop3: '123', prop4: function(){}, prop5: 
{
}
}`,
            options: ["ObjectExpression", {
                start: "new",
                end: "new"
            }],
            errors: 4
        },
        {
            code: `function a(first, second,
                third){
                    foo();
                }`,
            output: `function a(first, second,
                third)
{
                    foo();
                }`,
            options: ["FunctionDeclaration", { start: "new_for_long_declaration" }],
            errors: 1
        }
    ]
});
