/*
Module to require all .js files in the lib directory and any
nested directories. Used only so that nyc can report test coverage for
all files. Excludes the following:

- *.test.js
- lib/index.js.
- lib/main.js

NOTE: This technique is required because we are using @std/esm and currently
nyc does not load modules in the same fashion when the nyc `all` settings is
set to true. So instead we manually require all source modules ourselves.
*/

import glob from 'glob'
import fs from 'fs'
import path from 'path'

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
