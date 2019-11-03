const l = console.log
const acorn = require('./acorn/dist/acorn.js')
const Visitor = require('./visitor')
const fs = require('fs')
const path = require('path')


function getFileFullPath(s) {
    const platformSep = path.sep
    const exts = [".ts", ".js", ".jsx", ".tsx", platformSep + "index.js", platformSep + "index.ts"]
    let ext = path.extname(s)
    if (exts.find(_ext => _ext == ext) == undefined) {
        ext = ""
    }

    l(s, " ext:" + ext)
    try {
        for (let i = 0; i <= exts.length - 1; i++) {
            const file = s + exts[i]
            l(file)
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

let f = "c:/wamp/www/developerse/projects/post_prjs/chat-app/src/app/guards/route.guard"
let g = "/c/wamp/www/developerse/projects/post_prjs/chat-app/cmp/app.module.ts"

l(getFileFullPath(f))