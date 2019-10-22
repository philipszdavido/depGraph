const l = console.log
const acorn = require('./acorn/dist/acorn.js')
const Visitor = require('./visitor')
const fs = require('fs')
const path = require('path')

// pull in the cmd line args
//const args = process.argv[2]
const args = "test/test.js"
const buffer = fs.readFileSync(args).toString()

const body = acorn.parse(buffer, {
    sourceType: "module"
}).body
l(body[2])

// const min = new Visitor().run(body)