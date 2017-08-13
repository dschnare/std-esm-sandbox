# When running `npm test` (uses `nyc`)

- If the `cjs` `@std/esm` setting is not set to `true` when running `nyc` then
  we get an error: https://github.com/standard-things/esm/issues/28

  NOTE: The first error in the thread was only caused when passing
  `--require @std/esm` to `nyc` directly. We can get past this by instead
  passing `-r @std/esm` to `mocha`.

  However, every second or third run of `npm test` will result with this error:

      Cannot read property 'decl' of undefined
      TypeError: Cannot read property 'decl' of undefined
          at /std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/html/annotator.js:83:28
          at Array.forEach (native)
          at annotateFunctions (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/html/annotator.js:79:26)
          at Object.annotateSourceCode (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/html/annotator.js:192:9)
          at HtmlReport.onDetail (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-reports/lib/html/index.js:217:39)
          at Visitor.(anonymous function) [as onDetail] (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:34:30)
          at ReportNode.Node.visit (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:123:17)
          at /std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:116:23
          at Array.forEach (native)
          at visitChildren (/std-esm-sandbox/esm/node_modules/nyc/node_modules/istanbul-lib-report/lib/tree.js:115:32)

  NOTE: You can see this error if after running `npm test` you get a low test
  coverage for `get-message.js` you open `coverage/index.html` and view the
  source code for `get-message.js`.

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
