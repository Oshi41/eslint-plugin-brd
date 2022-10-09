"use strict";

module.exports = {
    meta: {
        docs: {
            description: "Prefer simple null check",
            category: "Possible Errors",
            recommended: false,
            url: ""
        },

        fixable: "code",
        messages: {},
        schema: [],

        type: "problem"
    },

    create(context) {
        const operators = ["==", "===", "!=", "!=="];
        const binaryOperators = ["!", "+", "-"];

        /**
         * Is current node 0 or undefined
         * @return boolean|null
         * true - 0 or undefined
         * false - inverted value !(0)
         * null - not 0 or undefined
         */
        const isUndefOperand = function(node) {
            if (node.type === "Literal" && node.value === 0) {
                return true;
            }

            // Possibly can insert 'undefined' here
            // if (node.type === "Identifier" && node.name === "undefined") {
            //     return true;
            // }

            if (node.type === "UnaryExpression" && binaryOperators.includes(node.operator)) {
                let innerResult = isUndefOperand(node.argument);

                if (innerResult !== null) {
                    if (node.operator === "!") {
                        innerResult = !innerResult;
                    }
                    return innerResult;
                }
            }

            return null;
        };

        const checkBinary = function(node) {
            if (!operators.includes(node.operator)) {
                return;
            }

            let other = null;
            let undef = isUndefOperand(node.left);

            if (undef !== null) {
                other = node.right;
            } else if ((undef = isUndefOperand(node.right)) !== null) {
                other = node.left;
            }

            if (!other) {
                return;
            }

            if (node.operator.includes("!")) {
                undef = !undef;
            }

            const text = `${undef ? "!" : ""}${context.getSourceCode().getText(other)}`;

            context.report({
                node,
                message: "Use '!' for null-checking",
                fix: fixer => fixer.replaceText(node, text)
            });

        };

        return {
            BinaryExpression: checkBinary
        };
    }
};
