"use strict";

const UnaryOperators = ["-", "+", "!", "~"];
const BinaryOperators = ["==", "!=", "===", "!==", "<", "<=", ">", ">=", "<<", ">>", ">>>", "+", "-", "*", "/", "%", "**", ",", "^", "&"];
const LogicalOperators = ["||", "&&", "??"];
const AssignmentOperators = ["=", "+=", "-=", "*=", "/=", "%=", "**=", "<<=", ">>=", ">>>=", ",=", "^=", "&=", "|="];
const UpdateOperators = ["++", "--"];
const All = [...new Set([...UnaryOperators, ...BinaryOperators, ...LogicalOperators, ...AssignmentOperators, ...UpdateOperators])];

module.exports = {
    meta: {
        docs: {
            description: "Spacing within operators",
            category: "Stylistic Issues",
            recommended: true,
            url: ""
        },

        fixable: "code",
        messages: {},
        schema: [
            {
                definitions: {
                    spaceDef: {
                        type: "object",
                        properties: {
                            before: { type: "boolean" },
                            after: { type: "boolean" },
                            overrides: {
                                type: "array",
                                items: {
                                    anyOf: [
                                        { enum: All },
                                        {
                                            type: "object",
                                            properties: {
                                                before: { type: "boolean" },
                                                after: { type: "boolean" }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },

                type: "object",
                properties: {
                    unaries: { $ref: "#/$defs/spaceDef" },
                    binaries: { $ref: "#/$defs/spaceDef" },
                    logicals: { $ref: "#/$defs/spaceDef" },
                    assigns: { $ref: "#/$defs/spaceDef" },
                    updates: { $ref: "#/$defs/spaceDef" }
                }
            }
        ],

        type: "layout"
    },

    create(context) {
        const raw = context.options[0];
        const unaries = new Map();
        const binaries = new Map();

        const fillMapFromSettings = function(map, settings, array) {
            if (!settings) {
                return;
            }

            const {
                before,
                after,
                overrides
            } = settings;
            const param = {
                before,
                after
            };

            for (const unaryOperator of array) {
                map.set(unaryOperator, param);
            }

            if (overrides) {
                for (let i = 0; i < overrides.length - 1; i += 2) {
                    const key = overrides[i];
                    const value = overrides[i + 1];

                    map.set(key, value);
                }
            }
        };

        fillMapFromSettings(unaries, raw.unaries, UnaryOperators);
        fillMapFromSettings(unaries, raw.updates, UpdateOperators);

        fillMapFromSettings(binaries, raw.binaries, BinaryOperators);
        fillMapFromSettings(binaries, raw.logicals, LogicalOperators);
        fillMapFromSettings(binaries, raw.assigns, AssignmentOperators);

        const sourceCode = context.getSourceCode();

        const fixSpaceBetween = function(owner, left, right, shouldBeTogether) {
            if (!left || !right) {
                return;
            }

            if (!left.range || !right.range) {
                return;
            }

            if (sourceCode.isSpaceBetweenTokens(left, right) === !shouldBeTogether) {
                return;
            }

            context.report({
                node: owner,
                message: shouldBeTogether ? "No space required" : "Space required",
                fix: shouldBeTogether
                    ? fixer => fixer.removeRange([left.range[1], right.range[0]])
                    : fixer => fixer.insertTextAfter(left, " ")
            });
        };

        const visitBinaries = function(node, operator) {
            if (!binaries.has(operator)) {
                return;
            }

            const {
                before,
                after
            } = binaries.get(operator);
            const operatorToken = sourceCode.getFirstToken(node, token => token.value === operator);

            if (!operatorToken) {
                return;
            }

            if (before !== undefined) {
                const beforeToken = sourceCode.getTokenBefore(operatorToken);

                if (beforeToken) {
                    fixSpaceBetween(node, beforeToken, operatorToken, !before);
                }
            }

            if (after !== undefined) {
                const tokenAfter = sourceCode.getTokenAfter(operatorToken);

                if (tokenAfter) {
                    fixSpaceBetween(node, operatorToken, tokenAfter, !after);
                }
            }
        };

        const visitUnaries = function(node) {
            if (!unaries.has(node.operator)) {
                return;
            }

            const {
                before,
                after
            } = unaries.get(node.operator);
            const operatorToken = sourceCode.getFirstToken(node, token => token.value === node.operator);

            if (!operatorToken) {
                return;
            }

            const fixSpace = function(left, right, shouldBeTogether) {
                if (!left || !left.range || !node.range || !right || !right.range) {
                    return;
                }

                // out of unary node
                if (left.range[0] < node.range[0] || node.range[1] < right.range[1]) {
                    return;
                }

                fixSpaceBetween(node, left, right, shouldBeTogether);
            };

            if (before !== undefined) {
                fixSpace(sourceCode.getTokenBefore(operatorToken), operatorToken, !before);
            }

            if (after !== undefined) {
                fixSpace(operatorToken, sourceCode.getTokenAfter(operatorToken), !after);
            }
        };

        return {
            UnaryExpression: visitUnaries,
            UpdateExpression: visitUnaries,
            BinaryExpression: node => visitBinaries(node, node.operator),
            LogicalExpression: node => visitBinaries(node, node.operator),
            AssignmentExpression: node => visitBinaries(node, node.operator),
            VariableDeclarator: node => node.init && node.id && visitBinaries(node, "=")
        };
    }
};
