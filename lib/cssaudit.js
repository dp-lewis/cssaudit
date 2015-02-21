/*global window, document*/
var Q = require('q'),
  sitemap = require('./sitemap.js'),
  webpage = require('./webpage'),
  prepcss = require('../lib/prepcss'),
  combineresults = require('../lib/combineresults.js'),
  exportresults = require('../lib/exportresults.js'),
  createreport = require('../lib/createreport.js'),
  fs = require('fs');

module.exports = {
  init: function (options) {

    return {
      'run': function () {
        var deferred = Q.defer(),
          urls;

        // fetch the URLs from the sitemap
        sitemap.fetch(options.sitemaps).then(function (result) {

          urls = result[0].urlset.url.map(function (info) {
            return info.loc[0];
          });
          // get the CSS info
          return prepcss.process(options.stylesheets[0]);

        }).then(function (selectors) {

          // rework the selectors
          var testPages, selectorsOnly;

          selectorsOnly = selectors.map(function (selector) {
            return selector.selector;
          });

          testPages = webpage.testPages(urls, function (clientAuditData) {

            function clientaudit(data) {

              var results = {};

              function checkSelector(selector) {
                var mockedSelector = selector;

                mockedSelector = selector.replace(':before', '');
                mockedSelector = mockedSelector.replace(':after', '');
                mockedSelector = mockedSelector.replace(':hover', '');
                mockedSelector = mockedSelector.replace(':visited', '');

                try {
                  results[selector] = {
                    'selector': selector,
                    'used': document.querySelectorAll(mockedSelector).length,
                    'url': document.location.href
                  };
                } catch (e) {
                  results[selector] = {
                    'selector': selector,
                    'used': 0,
                    'message': 'problem running this selector'
                  };

                }
              }

              data.forEach(checkSelector);
              return JSON.stringify(results);
            }

            return clientaudit(clientAuditData);

          }, selectorsOnly);

          return testPages;

        }).then(function (results) {
          return combineresults.process(results);

        }).then(function (results) {

          return exportresults.process(options.stylesheets[0], results, urls);

        }).then(function (results) {

          return createreport.process('templates/basic.mustache', results);

        }).done(function (results) {

          fs.writeFile(options.output, results, function (err) {
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
