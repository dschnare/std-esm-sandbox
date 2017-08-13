# When running `npm test` (uses `nyc`)

- If the `cjs` `@std/esm` setting is not set to `true` when running `nyc` then
  we get an error ( https://github.com/standard-things/esm/issues/28 ).

- If the `lcov` reporter is configured for `nyc`

      // .nycrc
      "reporter": [
        "lcov",
        "text-summary"
      ],

  then the following error occurs

      undefined:5
          // "lcov",
          ^
      SyntaxError: Unexpected token / in JSON at position 71    at Object.parse (native)
          at Object.Config.loadConfig (/std-esm-sandbox/esm/node_modules/nyc/lib/config-util.js:21:21)
          at Object.<anonymous> (/std-esm-sandbox/esm/node_modules/nyc/bin/nyc.js:23:25)
          at Module._compile (module.js:570:32)
          at Object.Module._extensions..js (module.js:579:10)
          at Module.load (module.js:487:32)
          at tryModuleLoad (module.js:446:12)
          at Function.Module._load (module.js:438:3)
          at Module.runMain (module.js:604:10)
          at run (bootstrap_node.js:394:7)
