# When running `npm test` (uses `nyc`)

- If the `cjs` `@std/esm` setting is not set to `true` when running `nyc` then
  we get an error: https://github.com/standard-things/esm/issues/28

- If the `lcov` reporter is configured for `nyc`

      // .nycrc
      "reporter": [
        "lcov",
        "text-summary"
      ],

  then running `nyc` the first time works just fine (delete your `.nyc_output`
  and the `coverage` folders first), but every other time the following error
  occurs (i.e. running `nyc` with an existing `.nyc_output` and `coverage`
  folder from a previous run):

        /std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/lcovonly/index.js:32
        writer.println('FN:' + [meta.decl.start.line, meta.name].join(','));
                                    ^

        TypeError: Cannot read property 'decl' of undefined
            at /std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/lcovonly/index.js:32:37
            at Array.forEach (native)
            at LcovOnlyReport.onDetail (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/lcovonly/index.js:30:28)
            at LcovReport.(anonymous function) [as onDetail] (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/lcov/index.js:21:24)
            at Visitor.(anonymous function) [as onDetail] (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:34:30)
            at ReportNode.Node.visit (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:123:17)
            at /std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:116:23
            at Array.forEach (native)
            at visitChildren (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:115:32)
            at ReportNode.Node.visit (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:126:5)
