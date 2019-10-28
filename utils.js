const fs = require("fs")
const path = require("path")
const l = console.log
const { exec } = require("child_process")
const baseDir = process.cwd()

function prjType() {
    if (fs.existsSync("angular.json")) {
        return "angular"
    }

    // check for react

    // read package.json
    const json = fs.readFileSync("package.json")
}

function writeToCmp(id) {
    const graph = JSON.parse(fs.readFileSync("depGraph.json").toString())
    const deps = graph.dependencies
    const fldParts = "cmp/" + path.basename(graph.filePath)
    l(fldParts)
    fs.mkdirSync("cmp")
    fs.mkdirSync(fldParts)
    const filetoWrite = path.resolve(graph.filePath, baseDir + path.sep + fldParts)
    const buffer = fs.readFileSync(graph.filePath).toString()
    fs.writeFileSync(filetoWrite + path.sep + path.basename(graph.filePath), buffer)


    //process.chdir(fldParts)
    //initNodeEnv()
    //writeFiles(deps)
}

function initNodeEnv() {
    exec("npm init -y", (err, std, stderr) => {
        l("init a Node environ")
    })
}

function writeFiles(file) {

}

exports.writeToCmp = writeToCmp