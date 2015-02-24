/*global window, document*/
var Q = require('q'),
  sitemap = require('./sitemap.js'),
  webpage = require('./webpage'),
  prepcss = require('../lib/prepcss'),
  combineresults = require('../lib/combineresults.js'),
  exportresults = require('../lib/exportresults.js'),
  createreport = require('../lib/createreport.js'),
  fs = require('fs-extra');


function clientProcessSelectors(clientAuditData) {
  // Start of the code that's executed in PhantomJS

  return (function (data) {

    if (!data || !data.length || typeof data !== 'object') {
      return [{
        'selector': 'ERROR',
        'url': document.location.href
      }];
    }

    var results = {};

    function checkSelector(selectorInfo) {
      var mockedSelector = selectorInfo.selector.replace(':before', '')
        .replace(':after', '')
        .replace(':hover', '')
        .replace(':visited', '');

      // using a try and catch as PhantomJS gets cranky with vendor prefixes
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
}

function createFile(path, data, stringify) {
  return Q.promise(function (resolve, reject) {
    var fileData = data;

    if (stringify) {
      fileData = JSON.stringify(data);
    }

    fs.outputFile(path, fileData, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  init: function (options) {

    return {
      'run': function () {
        var deferred = Q.defer(),
          urls = options.urls || [],
          promisesForFiles = [],
          filename = options.filename || 'cssaudit',
          outputDir = options.output || './output',
          queueSize = options.queueSize || 10,
          template = options.template || __dirname + '/templates/basic.mustache';

        // Fetch the selectors from the stylesheets provided
        promisesForFiles.push(prepcss.process(options.stylesheets).then(function (selectors) {
          return Q.promise(function (resolve, reject) {
            if (!selectors) {
              reject('No CSS was available');
            } else {
              resolve(selectors);
            }
          });
        }));

        // fetch the URLs from the sitemap but only if sitemaps are defined
        if (options.sitemaps && options.sitemaps.length > 0) {
          promisesForFiles.push(sitemap.fetch(options.sitemaps).then(function (results) {
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

            return Q.promise();
          }));
        }

        if (promisesForFiles.length === 0) {

          deferred.reject('Sorry there was a small problem, please try again.');

        } else {

          Q.allSettled(promisesForFiles).then(function (results) {

            return webpage.testPages(urls, clientProcessSelectors, results[0].value, queueSize);

          }).then(function (results) {

            // combine all the results into one object
            return combineresults.process(results);

          }).then(function (results) {
            // exporting results formats the JSON file with a few extra bits of info
            return exportresults.process(options.stylesheets, results, urls);

          }).then(function (results) {
            // output JSON file and request that the data is stringified
            return createFile(outputDir + '/' + filename + '.json', results, true);

          }).then(function (results) {
            // prep object for use with template
            return createreport.process(template, results);

          }).then(function (results) {
            // output HTML file
            return createFile(outputDir + '/' + filename + '.html', results);

          }).done(function () {
            deferred.resolve();
          });

        }



        return deferred.promise;
      }
    };
  }
};
