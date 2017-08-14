import * as glob from 'glob'
import * as fs from 'fs'
import * as path from 'path'

/*
Module to require all .js files in the lib directory and any
nested directories. Excludes the following:

- *.test.js
- lib/index.js.
- lib/main.js
*/

const libDir = 'lib'
const files = glob.sync('**/*.js', {
  cwd: path.resolve(libDir),
  ignore: [
    // Ignore tests
    '**/*.test.js',
    // Ignore entry points
    'index.js',
    'main.js'
  ]
})

files.forEach(f => require(path.resolve(libDir, f)))
