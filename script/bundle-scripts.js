/*
A module/command line tool that bundles the client scripts in the project.
*/

import * as fs from 'fs'
import * as path from 'path'
import EventEmitter from 'events'
import browserify from 'browserify'
import tsify from 'tsify'
import watchify from 'watchify'
import exorcist from 'exorcist'
import uglifyify from 'uglifyify'
import UglifyJs from 'uglify-js'
import mkdirp from 'mkdirp'

// Entry files to include in the bundle (and their deps)
const entries = [
  './lib/index.js'
]
// The file to write
const outFile = 'dist/static/bundle.js'

export default function bundleScripts ({ debug = false, minify = false, watch = false } = {}) {
  const b = browserify({
    debug,
    entries,
    cache: {},
    packageCache: {}
  })

  b.plugin(tsify)

  if (minify) {
    b.transform(uglifyify)
  }

  if (watch) {
    // See: https://www.npmjs.com/package/watchify#options
    b.plugin(watchify, {
      delay: 100
    })
  }

  const emitter = new EventEmitter()

  b.on('update', () => {
    const s = new Date()
    bundle().then(() => {
      const dt = new Date() - s
      emitter.emit('complete', dt)
    }).catch(error => {
      emitter.emit('error', error)
      return Promise.reject(error)
    })
  })

  return [
    path.dirname(outFile),
    path.dirname(outFile + '.map')
  ].reduce((p, d) => {
    return p.then(() => mkdir(d))
  }, Promise.resolve()).then(() => bundle()).then(() => emitter)

  function bundle() {
    return new Promise((resolve, reject) => {
      let p = b.bundle()
      let resolved = false

      if (debug) {
        p = p.pipe(exorcist(outFile + '.map'))
      }

      p.pipe(fs.createWriteStream(outFile, 'utf8'))
        .on('error', error => {
          if (!resolved) {
            resolved = true
            reject(error)
          }
        })
        .on('close', () => {
          if (!resolved) {
            resolved = true
            if (minify) {
              uglify(outFile, debug ? outFile + '.map' : null)
                .then(() => resolve(), reject)
            } else {
              resolve()
            }
          }
        })
    })
  }
}

function mkdir (dirName) {
  return new Promise((resolve, reject) => {
    mkdirp(dirName, error => error ? reject(error) : resolve())
  })
}

function readFile (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (error, text) => {
      error ? reject(error) : resolve(text)
    })
  })
}

function writeFile (fileName, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, 'utf8', (error) => {
      error ? reject(error) : resolve()
    })
  })
}

function uglify (sourceFile, sourceMapFile = null) {
  return Promise.all([
    readFile(sourceFile),
    sourceMapFile
      ? readFile(sourceMapFile)
      : null
  ]).then(([ code, sourceMap ]) => {
    const sourceMapOpts = sourceMap
      ? {
        content: sourceMap,
        // Assume the source map will be saved next to the uglified file
        url: path.basename(sourceMapFile)
      }
      : undefined
    const result = UglifyJs.minify({ [path.basename(sourceFile)]: code }, {
      sourceMap: sourceMapOpts
    })

    return Promise.all([
      writeFile(sourceFile, result.code),
      result.map
        ? writeFile(sourceMapFile, result.map)
        : null
    ])
  })
}

// Usage: bundle-scripts [--minify] [--watch] [--debug]
if (require.main === module) {
  const start = new Date()
  bundleScripts({
    debug: process.argv.includes('--debug'),
    minify: process.argv.includes('--minify'),
    watch: process.argv.includes('--watch')
  }).then(emitter => {
    const dt = new Date() - start
    const seconds = (dt / 1000).toFixed(2)
    console.log('bundle-scripts completed in', seconds, 'seconds')

    emitter.on('complete', dt => {
      const seconds = (dt / 1000).toFixed(2)
      console.log('bundle-scripts completed in', seconds, 'seconds')
    })
    emitter.on('error', error => {
      console.error(error)
    })
  }).catch(error => console.error(error))
}
