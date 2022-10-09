"use strict";

module.exports = {
    meta: {
        docs: {
            description: "Use special alias for 'exports' directive.",
            category: "Possible Errors",
            recommended: true,
            url: "https://github.com/Oshi41/eslint-plugin-brd/blob/master/docs/rules/export-alias.md"
        },

        fixable: "code",
        messages: {},
        schema: [{ type: "string" }],

        type: "problem"
    },

    create(context) {
        const exportsName = "exports";
        const alias = context.options[0];
        let anyFileChanges = false;
        let anyExport = false;
        const possibleExportAliases = new Set();
        const message = `Use ${alias} as alias for 'exports'`;

        const report = obj => {
            context.report(obj);
            anyFileChanges = true;
        };

        // SMTH = exports
        const fixExportAssignment = function(node) {
            if (node.right.type === "Identifier" &&
                node.operator === "=" &&
                node.right.name === exportsName &&
                node.left.type === "Identifier" &&
                node.left.name !== alias) {
                possibleExportAliases.add(node.left.name);

                report({
                    node,
                    message,
                    fix: fixer => fixer.replaceText(node.left, alias)
                });
            }
        };

        // [let\var] [E\A] = exports;
        const fixExportVariable = function(node) {
            if (node.declarations.length !== 1) {
                return;
            }

            const declaration = node.declarations[0];

            if (!declaration.init || declaration.init.type !== "Identifier" || declaration.init.name !== exportsName) {
                return;
            }

            if (node.kind !== "const" || declaration.id.type === "Identifier" && declaration.id.name !== alias) {
                if (declaration.id.name !== alias) {
                    possibleExportAliases.add(declaration.id.name);
                }

                report({
                    node,
                    message,
                    fix: fixer => fixer.replaceText(node, `const ${alias} = ${exportsName};`)
                });
            }
        };

        // A.smth = {..}
        // A.t.foo = {...}
        const fixWrongExportingAliasUsage = function(node) {
            if (node.operator !== "=" || node.left.type !== "MemberExpression") {
                return;
            }

            let source = node.left;

            while (source.object.type === "MemberExpression") {
                source = source.object;
            }

            if (source.object.type === "Identifier" &&
                possibleExportAliases.has(source.object.name)) {
                report({
                    node,
                    message,
                    fix: fixer => fixer.replaceText(source.object, alias)
                });
            }
        };

        // exports.foo = [];
        // exports.foo = {};
        // exports.foo = '123';
        // exports.foo = 123;
        // exports.foo = true;
        const replaceExports = function(node) {
            if (node.left.type === "MemberExpression" && context.getSourceCode().getText(node.left.object) === exportsName) {
                report({
                    node,
                    message,
                    fix: fixer => fixer.replaceText(node.left.object, alias)
                });
            }
        };

        const toExportAliasString = function(node, propName) {
            const sourceCode = context.getSourceCode();

            const createStr = function(str) {
                return `${alias}.${propName || str} = ${sourceCode.getText(node)}`;
            };

            switch (node.type) {
                case "ObjectExpression":
                    let txt = node.properties.filter(x => x.type === "Property")
                        .map(x => x.type === "Property" && toExportAliasString(x.value, sourceCode.getText(x.key)))
                        .join("\n");

                    // no prop name - top level definition
                    if (propName) {
                        txt = `${alias}.${propName} = ${txt || "{}"}`;
                    }

                    return txt;

                case "ArrowFunctionExpression":
                case "FunctionExpression":
                    return createStr(node.id && node.id.type === "Identifier" && node.id.name || "func");

                case "ArrayExpression":
                    return createStr("arr");

                default:
                    return createStr("foo");
            }
        };

        // exports = []
        // exports = '123'
        // exports = 123
        // exports = true
        // exports = function(){}
        // exports = function name(){}
        // exports = ()=>{}f
        const moveToExportAlias = function(node) {

            // exports = {...}
            if (node.left.type === "Identifier" &&
                node.left.name === exportsName &&
                node.right ||

                // module.exports = {...}
                node.left.type === "MemberExpression" &&
                context.getSourceCode().getText(node.left.object) === "module" &&
                context.getSourceCode().getText(node.left.property) === exportsName) {

                report({
                    node,
                    message,
                    fix: fixer => fixer.replaceText(node, toExportAliasString(node.right, ""))
                });
            }
        };

        const findAnyExports = function(node) {
            if (node.left.type === "MemberExpression" && node.left.object.type === "Identifier" &&
                node.left.object.name === alias && node.left.property.type === "Identifier") {
                anyExport = true;
            }
        };

        // insert export alias at center
        const visitLastNode = function(segment, node) {
            if (node.type !== "Program") {
                return;
            }

            if (node.body.length < 1 || anyFileChanges || !anyExport) {
                return;
            }

            for (const bodyElement of node.body) {
                if (bodyElement.type === "VariableDeclaration" && bodyElement.declarations.length === 1 &&
                    bodyElement.kind === "const") {
                    const declaration = bodyElement.declarations[0];

                    if (declaration.id.type === "Identifier" && declaration.init &&
                        declaration.init.type === "Identifier" && declaration.id.name === alias &&
                        declaration.init.name === exportsName) {
                        return;
                    }
                }
            }

            context.report({
                node: node.body[0],
                message,
                fix: fixer => fixer.insertTextBefore(node.body[0], `const ${alias} = ${exportsName}\n`)
            });
        };

        return {
            AssignmentExpression: node => {
                fixExportAssignment(node);
                fixWrongExportingAliasUsage(node);
                moveToExportAlias(node);
                replaceExports(node);
                findAnyExports(node);
            },
            VariableDeclaration: fixExportVariable,
            onCodePathSegmentEnd: visitLastNode
        };
    }
};
