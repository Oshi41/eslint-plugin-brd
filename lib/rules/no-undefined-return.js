"use strict";

module.exports = {
    meta: {
        docs: {
            description: "Do not return undefined",
            category: "Best Practices",
            recommended: false,
            url: ""
        },

        fixable: "code",
        messages: {},
        schema: [],

        type: "layout"
    },

    create(context) {
        return {
            ReturnStatement(node) {
                if (node.argument &&
                    node.argument.type === "Identifier" &&
                    node.argument.name === "undefined") {
                    context.report({
                        node,
                        message: "Do not return 'undefined' statement",
                        fix: fixer => fixer.replaceText(node, "return;")
                    });
                }
            }
        };
    }
};
