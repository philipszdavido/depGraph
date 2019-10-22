{
    dependencies: [{
            dependencies: [{
                dependencies: [{
                    dependencies: [{ name: '@angular/compiler', packageDependency: true }],
                    name: './req2.js',
                    filePath: 'test\\req2.js',
                    fileDependency: true
                }],
                name: './req1.js',
                filePath: 'test\\req1.js',
                fileDependency: true
            }],
            name: './req0.js',
            filePath: 'test\\req0.js',
            fileDependency: true
        },
        {
            dependencies: [{ name: '@angular/compiler', packageDependency: true }],
            name: './req2.js',
            filePath: 'test\\req2.js',
            fileDependency: true
        },
        { name: '@angular/core', packageDependency: true }
    ],
    name: './test/test.js',
    filePath: './test/test.js',
    fileDependency: true
}