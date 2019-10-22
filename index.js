#!/usr/bin/env node

const l = console.log
const acorn = require('./acorn/dist/acorn.js')
const Visitor = require('./visitor')
const fs = require('fs')
const path = require('path')
const { parse } = require("@babel/parser")

function checkFileOrPackageDependency(s = "") {

    /**
     * ./ => refers to index.js file
     * ./cs => refers to cs.*js file
     */

    const exts = [".ts", ".js", ".jsx", ".tsx", "index.js", "index.ts"]
    let ext = path.extname(s)
    if (exts.find(_ext => _ext == ext) == undefined) {
        ext = ""
    }
    //l(s, " ext:" + ext)
    try {
        if (fs.existsSync(s)) {
            //l(s, " yes exists")
            return true
        }
        if (ext.length == 0) {
            for (let i = 0; i <= exts.length; i++) {
                const file = s + exts[i]
                if (fs.existsSync(file)) {
                    //l(file, " yes exists")
                    return true
                }
            }
        } else {
            if (fs.existsSync(s)) {
                //l(s, " yes exists")
                return true
            }
        }
    } catch (e) {
        throw e
    }
}

function getFileFullPath(s) {
    const platformSep = path.sep
    const exts = [".ts", ".js", ".jsx", ".tsx", platformSep + "index.js", platformSep + "index.ts"]
    let ext = path.extname(s)
    if (exts.find(_ext => _ext == ext) == undefined) {
        ext = ""
    }

    // l(s, " ext:" + ext)
    try {
        for (let i = 0; i <= exts.length; i++) {
            const file = s + exts[i]
            if (fs.existsSync(file)) {
                return file
            }
        }
        if (fs.existsSync(s)) {
            return s
        }
        if (ext.length == 0) {
            for (let i = 0; i <= exts.length; i++) {
                const file = s + exts[i]
                if (fs.existsSync(file)) {
                    return file
                }
            }
        } else {
            if (fs.existsSync(s)) {
                return s
            }
        }
    } catch (e) {
        throw e
    }
}

// pull in the cmd line args
const args = process.argv[2]
const visitor = new Visitor()

function getReqs(file) {
    //l(file, " in getReqs")
    const buffer = fs.readFileSync(file).toString()

    /*const body = acorn.parse(buffer, {
        sourceType: "module"
    }).body*/

    const body = parse(buffer, {
        plugins: ["stage-1", "jsx", /*"flow",*/ "classProperties", "typescript", "decorators-legacy" /*, "decorators"*/ ],
        sourceType: "module"
    }).program.body

    // l(body)

    let reqs = []
    const min = visitor.run(body, (node) => {
        if (node) {
            if (node.type === "CallExpression") {
                const callee = node.callee.name
                if (callee == 'require') {
                    const args = (node.arguments)[0].value
                    const value = args
                    reqs.push({ buffer, value })
                }
            }
            if (node.type === "MemberExpression") {}
            if (node.type === "ImportSpecifier") {
                //l(node.specifiers)
            }
            if (node.type === "ImportDefaultSpecifier") {
                //l(node.specifiers)
            }
            if (node.type === "ImportNamespaceSpecifier") {}
            if (node.type === "ImportDeclaration") {
                //l(node)
                const value = node.source.value
                let specifiers = []
                node.specifiers.forEach((specifier) => {
                    let local = specifier.local.name
                    specifiers.push(local)
                })
                reqs.push({ buffer, value, importSpecifiers: specifiers })
            }
        }
    })
    return reqs
}

function _depTree(opts) {
    let { file, filePath } = opts
    //l(opts)
    let parent
    if (filePath == undefined) {
        filePath = file
    }
    let reqs = []
    let h = {
        dependencies: [],
        name: file,
        filePath,
        fileDependency: true
    }

    // check if file is a file dependency or package dependency
    if (checkFileOrPackageDependency(filePath)) {
        filePath = getFileFullPath(filePath)
        reqs = getReqs(filePath)
        parent = path.dirname(filePath)
        reqs.forEach((req) => {
                const reqPath = path.resolve(parent, req.value)
                h.dependencies.push(_depTree({ filePath: reqPath, file: req.value }))
            })
            //l(h)
        return h
    }
    h = {
            name: file,
            packageDependency: true
        }
        //l(h)
    return h
}

let tree = _depTree({ file: args /*"./test/test.js"*/ })

l(tree)

writeToJson(args, tree)

function writeToJson(id, graph) {
    //l("writing to json")
    graph = {...graph, id }
    let f = JSON.stringify(graph)
    fs.writeFileSync("depGraph.json", f)
}
// l(min)
// fs.writeFileSync('test/test.min.js', min)