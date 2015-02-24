/*global window, document*/
var Q = require('q'),
  sitemap = require('./sitemap.js'),
  webpage = require('./webpage'),
  prepcss = require('../lib/prepcss'),
  combineresults = require('../lib/combineresults.js'),
  exportresults = require('../lib/exportresults.js'),
  createreport = require('../lib/createreport.js'),
  fs = require('fs-extra');

module.exports = {
  init: function (options) {

    return {
      'run': function () {
        var deferred = Q.defer(),
          urls = options.urls || [],
          selectors = [],
          promisesForFiles = [],
          filename = options.filename || 'cssaudit',
          outputDir = options.output || './output',
          queueSize = options.queueSize || 10,
          template = options.template || __dirname + '/templates/basic.mustache';

        // fetch the URLs from the sitemap but only if sitemaps are defined
        if (options.sitemaps) {
          promisesForFiles.push(sitemap.fetch(options.sitemaps).then(function (results) {
            var localDeferred = Q.defer();

            // combine all the URLs into one array
            results.forEach(function (result) {
              var resulturls = result.urlset.url.map(function (info) {
                return info.loc[0];
              });

              urls = urls.concat(resulturls);
            });

            // if we're testing things out just take 5 urls
            if (options.sampleRun === true) {
              console.log('This is a sample run using 5 of ' + urls.length + ' URLs');
              urls = urls.slice(0, 5);
            }

            localDeferred.resolve();

            // get the CSS info
            return localDeferred.promise;
          }));
        }

        // Fetch the selectors from the stylesheets provided
        promisesForFiles.push(prepcss.process(options.stylesheets).then(function (results) {
          selectors = results;
          return Q.promise();
        }));


        Q.allSettled(promisesForFiles).then(function () {

          // we expect that the selectors have comeback 
          if (!selectors || !selectors.length || typeof selectors !== 'object' || selectors[0] === undefined) {
            throw 'There was a problem with the selectors';
          }

          // rework the selectors
          var testPages;

          testPages = webpage.testPages(urls, function (clientAuditData) {
            // Start of the code that's executed in PhantomJS

            return (function (data) {

              if (!data || !data.length || typeof data !== 'object') {
                return {
                  'selector': 'ERROR',
                  'url': document.location.href
                };
              }

              var results = {};

              function checkSelector(selectorInfo) {
                var mockedSelector = selectorInfo.selector;

                mockedSelector = mockedSelector.replace(':before', '');
                mockedSelector = mockedSelector.replace(':after', '');
                mockedSelector = mockedSelector.replace(':hover', '');
                mockedSelector = mockedSelector.replace(':visited', '');

                try {
                  results[selectorInfo.selector] = {
                    'selector': selectorInfo.selector,
                    'used': document.querySelectorAll(mockedSelector).length,
                    'url': document.location.href,
                    'stylesheet': selectorInfo.stylesheet
                  };
                } catch (e) {
                  results[selectorInfo.selector] = {
                    'selector': selectorInfo.selector,
                    'used': 0,
                    'message': 'problem running this selector',
                    'stylesheet': selectorInfo.stylesheet
                  };
                }
              } // end checkSelector

              data.forEach(checkSelector);

              return JSON.stringify(results);

            }(clientAuditData));

            // End of the code that's executed in PhantomJS
          }, selectors, queueSize);

          return testPages;

        }).then(function (results) {

          return combineresults.process(results);

        }).then(function (results) {
          return exportresults.process(options.stylesheets, results, urls);

        }).then(function (results) {

          return Q.promise(function (resolve, reject) {
            fs.outputFile(outputDir + '/' + filename + '.json', JSON.stringify(results), function (err) {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            });
          }).then(function (results) {
            return createreport.process(template, results);
          });

        }).done(function (results) {

          fs.outputFile(outputDir + '/' + filename + '.html', results, function (err) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(results);
            }
          });

        });

        return deferred.promise;
      }
    };
  }
};
