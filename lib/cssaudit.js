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
          filename = options.filename || 'cssaudit',
          outputDir = options.output || './output',
          template = options.template || __dirname + '/templates/basic.mustache';

        // fetch the URLs from the sitemap
        sitemap.fetch(options.sitemaps).then(function (results) {

          // combine all the URLs into one array
          results.forEach(function (result) {
            var  resulturls = result.urlset.url.map(function (info) {
              return info.loc[0];
            });

            urls = urls.concat(resulturls);
          });

          // get the CSS info
          return prepcss.process(options.stylesheets);

        }).then(function (selectors) {

          // rework the selectors
          var testPages;

          testPages = webpage.testPages(urls, function (clientAuditData) {

            function clientaudit(data) {

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
              }

              data.forEach(checkSelector);
              return JSON.stringify(results);
            }

            return clientaudit(clientAuditData);

          }, selectors);

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
