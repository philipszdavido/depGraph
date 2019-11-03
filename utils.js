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
    const gFilePath = graph.filePath
    const fldParts = "cmp/" + path.basename(gFilePath)
    l(fldParts)
    if (!fs.existsSync(fldParts)) {
        if (!fs.existsSync("cmp"))
            fs.mkdirSync("cmp")
        fs.mkdirSync(fldParts)
    }
    const filetoWrite = path.resolve(gFilePath, baseDir + path.sep + fldParts)
    l(filetoWrite)
        //const buffer = fs.readFileSync(graph.filePath).toString()
    const fileToWrite2 = filetoWrite + path.sep + path.basename(gFilePath)
    l(fileToWrite2)
        //fs.writeFileSync(fileToWrite2, buffer)

    //process.chdir(fldParts)
    //initNodeEnv()

    //let gg = baseDir + path.sep + graph.fullPath
    let gg = path.join(baseDir, graph.fullPath)
    graph.fullPath = gg
    l(gg)
        //graph.dependencies.forEach(dep => {
    writeFiles(graph /*dep*/ , filetoWrite, path.basename(graph.filePath))
    buildWebpack(graph, filetoWrite, fileToWrite2)
        //})
}

function initNodeEnv() {
    exec("npm init -y", (err, std, stderr) => {
        l("init a Node environ")
    })
}

function writeFiles(o, dirTo, id) {
    if (o.fileDependency) {
        const filePath = o.fullPath
        const sep = path.sep

        l("------------")
            //l(baseDir + sep + "cmp" + sep + id)
        l(filePath)
        let Parfile = baseDir + sep + "cmp" + sep + id

        let whatWeGot = ''
        const baseDirParts = baseDir.split(sep)
        const len = baseDirParts.length
        const fileParts = filePath.split(sep)

        for (let i = len; i <= fileParts.length - 1; i++) {

            l(fileParts[i])
            const ff = fileParts[i]
            if (i == fileParts.length - 1) {
                whatWeGot += ff
            } else {
                whatWeGot += ff + sep
            }
            if (i < fileParts.length - 1) {
                const dirToCreate = Parfile + sep + whatWeGot
                l(dirToCreate)
                if (!fs.existsSync(dirToCreate)) {
                    fs.mkdirSync(dirToCreate)
                }
            } else {
                const buffer = fs.readFileSync(filePath /*+ '.ts'*/ ).toString()
                fs.writeFileSync(Parfile + sep + whatWeGot /*+ '.ts'*/ , buffer)
            }
        }
        whatWeGot = Parfile + sep + whatWeGot
        o.destPath = whatWeGot
        l(whatWeGot)
        l(Parfile)
            //l(filePath.split(path.sep))

        //let filetoW = path.resolve(baseDir, o.filePath)
        //const fileToWrite2 = filetoWrite + path.sep + path.basename(o.filePath)
        //l(filetoWrite)
        //l(fileToWrite2)
        //const buffer = fs.readFileSync(o.filePath + '.ts').toString()
        //fs.writeFileSync(fileToWrite2 + '.ts', buffer)
        if (o.dependencies) {
            for (const dep of o.dependencies) {
                writeFiles(dep, dirTo, id)
            }
        }
    }
}

function buildWebpack(graph, filetoWrite, f2) {
    let webpackConfig = {
        entry: graph.destPath,
        output: {
            path: filetoWrite,
            filename: 'dist/' + path.basename(graph.filePath) + '.' + path.extname(graph.filePath)
        }
    }
    l(webpackConfig)
    l(graph.destPath)
        //return
    process.chdir(filetoWrite)
    const webpack = require("webpack")
    const compiler = webpack(webpackConfig)
    compiler.run((err, stats) => {
        if (err) {
            console.error(err)
            return
        }
        if (!stats.hasErrors()) {
            writePackagejson(graph)
            process.chdir(baseDir)
        }
        l(stats.toString())
            //l(stats)
    })
}

function writePackagejson(graph) {
    let packageJson = {
        "name": graph.id,
        "main": "dist/" + path.basename(graph.filePath) + '.' + path.extname(graph.filePath),
        "dependencies": {}
    }
    fs.writeFileSync("package.json", JSON.stringify(packageJson))
}

exports.writeToCmp = writeToCmp