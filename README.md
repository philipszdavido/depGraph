A dependency graph profiler that outputs the dependencies (both file and package dependencies) of a file.

# Usage

```sh
npm i depGraph -g
```

You can use it anywhere in your machine.

You have a Node app

```
/node-prj
    -/src
        -/a
            -/aa
                -aa.js
            -a.js
        -/b
            -b.js
        -/c
            -c.js
        -index.js
        -package.json
```

To get the dependencies of `a.js`:

```
cd node-prj
depGraph src/a/a.js
```

Output:

```
{
    name: "src/a/a.js",
    filePath: "src/a/a.js",
    fileDependency: true,
    dependencies: [
        ...
    ]
}
```

# Contributing

All pull requests and issues are welcome.
