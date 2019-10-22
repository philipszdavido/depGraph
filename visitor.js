const l = console.log
const fs = require('fs')
const acorn = require("acorn")
const EMPTY_STRING = ""

class Visitor {

    constructor() {
        this.exports = []
        this.cb = null
    }

    parseModule(path = "") {
        l(path)
        path = path.split("/")[1]
        const fileContent = fs.readFileSync('test/req0.js')

        const bdy = acorn.parse(fileContent, {
            sourceType: "module"
        }).body

        const code = this.run(bdy)
        let st = `return {`
        for (const exprt of this.exports) {
            st += exprt.property + ':' + exprt.value + ','
        }
        st += '}'
        this.exports = []
        let str = `
        (function() {
            ${code}
            ${st}
        })()
        `
        return str;
    }

    visitVariableDeclaration(node) {
        let str = ''
        str += node.kind + ' '
        str += this.visitNodes(node.declarations)
        return str + '\n'
    }

    visitVariableDeclarator(node) {
        let str = ''
        str += this.visitNode(node.id)
        str += '='
        str += this.visitNode(node.init)
        return str + ';' + '\n'
    }

    visitIdentifier(node) {
        return node.name
    }

    visitLiteral(node) {
        return node.raw
    }

    visitBinaryExpression(node) {
        let str = ''
        str += this.visitNode(node.left)
        str += node.operator
        str += this.visitNode(node.right)
        return str + '\n'
    }

    visitFunctionDeclaration(node) {
        let str = 'function '
        str += this.visitNode(node.id)
        str += '('
        for (let param = 0; param < node.params.length; param++) {
            str += this.visitNode(node.params[param])
            str += ((node.params[param] == undefined) ? '' : ',')
        }
        str = node.params.length > 0 ? str.slice(0, str.length - 1) : str
        str += '){'
        str += this.visitNode(node.body)
        str += '}'
        return str + '\n'
    }

    visitBlockStatement(node) {
        let str = ''
        str += this.visitNodes(node.body)
        return str
    }

    visitCallExpression(node) {
        // l(node)
        let str = ''
        const callee = this.visitIdentifier(node.callee)

        /*str += callee + '('
        for (const arg of node.arguments) {
            str += this.visitNode(arg) + ','
        }
        str = str.slice(0, str.length - 1)
        str += ');'
        return str + '\n'*/

        if (callee == 'require') {
            const args = this.visitNode(node.arguments[0])
                //l(args)
                //const value = args
                //str += value

            //str += this.parseModule(args)
            return str;
        } else {
            str += callee + '('
            for (const arg of node.arguments) {
                str += this.visitNode(arg) + ','
            }
            str = str.slice(0, str.length - 1)
            str += ');'
            return str + '\n'
        }
    }

    visitReturnStatement(node) {
        let str = 'return ';
        str += this.visitNode(node.argument)
        return str + '\n'
    }

    visitExpressionStatement(node) {
        return this.visitNode(node.expression)
    }

    visitAssignmentExpression(node) {
        //l(node)
        const op = node.operator
        const right = this.visitNode(node.right)

        if (node.left.type == "MemberExpression") {
            return this.visitMemberExpression(node.left, right)
        } else {
            let str = ''
            str += this.visitNode(node.left)
            str += op
            str += right
            return str
        }
    }

    visitMemberExpression(node, val) {
        const object = this.visitNode(node.object)
        const property = this.visitNode(node.property)
        const computed = node.computed
            // l(property, val)
        if (object == "exports") {
            this.exports.push({ "value": val, "property": property })
        }
        return EMPTY_STRING
    }

    visitImportDeclaration(node) {
        const specifiers = this.visitNodes(node.specifiers)
        return EMPTY_STRING
    }

    visitImportDefaultSpecifier(node) {

    }

    visitImportNamespaceSpecifier(node) {

    }

    visitImportSpecifier(node) {

    }

    visitNodes(nodes) {
        let str = ''
        for (const node of nodes) {
            str += this.visitNode(node)
        }
        return str
    }

    visitNode(node) {
        let str = ''
        this.cb(node)
        switch (node.type) {
            case 'VariableDeclaration':
                str += this.visitVariableDeclaration(node)
                break;
            case 'VariableDeclarator':
                str += this.visitVariableDeclarator(node)
                break;
            case 'Literal':
                str += this.visitLiteral(node)
                break;
            case 'Identifier':
                str += this.visitIdentifier(node)
                break;
            case 'BinaryExpression':
                str += this.visitBinaryExpression(node)
                break;
            case 'FunctionDeclaration':
                str += this.visitFunctionDeclaration(node)
                break;
            case 'BlockStatement':
                str += this.visitBlockStatement(node)
                break;
            case "CallExpression":
                str += this.visitCallExpression(node)
                break;
            case "ReturnStatement":
                str += this.visitReturnStatement(node)
                break;
            case "ExpressionStatement":
                str += this.visitExpressionStatement(node)
                break;
            case "AssignmentExpression":
                str += this.visitAssignmentExpression(node)
                break;
            case "MemberExpression":
                str += this.visitMemberExpression(node)
                break;
            case "ImportSpecifier":
                str += this.visitImportSpecifier(node)
                break;
            case "ImportDefaultSpecifier":
                str += this.visitImportDefaultSpecifier(node)
                break;
            case "ImportNamespaceSpecifier":
                str += this.visitImportNamespaceSpecifier(node)
                break;
            case "ImportDeclaration":
                str += this.visitImportDeclaration(node)
                break;
        }
        return str
    }

    run(body, cb) {
        let str = ''
        this.cb = cb
        str += this.visitNodes(body)
        return str
    }
}

module.exports = Visitor