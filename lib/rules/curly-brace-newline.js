"use strict";

const Values = ["same", "new", "new_for_long_declaration"];
const msgs = ["Newline requires here", "Newline is not required here"];

module.exports = {
    meta: {
        docs: {
            description: "Managing curly brace newline style",
            category: "Stylistic Issues",

            recommended: false,
            url: ""
        },

        fixable: "code",
        messages: {},
        schema: {
            type: "array",
            items: {
                anyOf: [
                    { type: "string" },
                    {
                        type: "object",
                        properties: {
                            start: {
                                oneOf: [{ enum: Values }]
                            },
                            end: {
                                oneOf: [{ enum: Values.slice(0, 2) }]
                            }
                        }
                    }
                ]
            }
        },

        type: "layout"
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const opts = context.options;

        /**
         * find actual user-confurable node
         * @param node - contains curly brace inside
         */
        const findOptions = function(node) {
            if (!node) {
                return null;
            }

            let nodeType = node.type;
            const parent = node.parent;

            // special case - block used by many statements
            if (nodeType === "BlockStatement") {

                // special case - finalizer
                if (parent.type === "TryStatement") {

                    // @ts-ignore
                    nodeType = parent.finalizer === node
                        ? "FinalStatement"
                        : parent.type;
                } else {
                    const findForParent = findOptions(node.parent, opts);

                    if (findForParent) {
                        return findForParent;
                    }
                }
            }

            const index = opts.indexOf(nodeType);

            if (index < 0 || index + 1 >= opts.length) {
                return null;
            }

            return {
                ...opts[index + 1],
                node
            };
        };

        /**
         * Check newline between braces
         */
        const checkBraces = function(node, start, end, logic) {
            if (!node || !start || !end) {
                return;
            }

            const actuallySameLine = start.loc.start.line === end.loc.start.line;

            // checking for multiline declaration
            if (Values[2] === logic) {
                const firstsNodeToken = context.getSourceCode().getFirstToken(node);

                if (!firstsNodeToken) {
                    return;
                }

                const multilineDeclaration = firstsNodeToken.loc.start.line < start.loc.start.line;

                logic = multilineDeclaration
                    ? Values[1]
                    : Values[0];
            }

            // same line as expected
            if (Values[0] === logic && actuallySameLine) {
                return;
            }

            // new line as expected
            if (Values[1] === logic && !actuallySameLine) {
                return;
            }

            const message = logic === Values[1]
                ? msgs[0]
                : msgs[1];

            const fix = logic === Values[1]
                ? fixer => fixer.insertTextBeforeRange(end.range, "\n")
                : fixer => fixer.replaceTextRange([start.range[1], end.range[0]], " ");

            context.report({
                node,
                message,
                fix
            });

        };

        /**
         * Performing rule
         * @param node - contains cyrly brace
         */
        const visitNode = function(currentNode) {
            const actualOptions = findOptions(currentNode);

            if (!actualOptions) {
                return;
            }

            const {
                node,
                start,
                end
            } = actualOptions;

            if (start) {
                const curlyStart = sourceCode.getFirstToken(node, token => token.value === "{");

                if (curlyStart) {
                    checkBraces(node,
                        sourceCode.getTokenBefore(curlyStart),
                        curlyStart,
                        start);
                }
            }

            if (end) {
                const curlyEnd = sourceCode.getLastToken(node, token => token.value === "}");

                if (curlyEnd) {
                    checkBraces(node,
                        sourceCode.getTokenBefore(curlyEnd),
                        curlyEnd,
                        end);
                }
            }
        };

        return {
            ClassBody: visitNode,
            BlockStatement: visitNode,
            ObjectExpression: visitNode,
            ExportNamedDeclaration: visitNode
        };
    }
};
