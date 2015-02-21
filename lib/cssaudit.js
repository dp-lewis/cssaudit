/*global window, document*/
var Q = require('q'),
  sitemap = require('./sitemap.js'),
  webpage = require('./webpage'),
  prepcss = require('../lib/prepcss'),
  auditserver = require('../lib/auditserver.js'),
  combineresults = require('../lib/combineresults.js'),
  exportresults = require('../lib/exportresults.js'),
  fs = require('fs');

module.exports = {
  init: function (options) {

    return {
      'run': function () {
        var deferred = Q.defer(), urls, server;

        // fetch the URLs from the sitemap
        sitemap.fetch(options.sitemaps).then(function (result) {
          urls = result[0].urlset.url.map(function (info) {
            return info.loc[0];
          });
          // get the CSS info
          return prepcss.process(options.stylesheets[0]);

        }).then(function (selectors) {

          // rework the selectors
          var selectorsOnly = selectors.map(function (selector) {
            return selector.selector;
          });

          return auditserver.start(selectorsOnly);

        }).then(function (serverDetails) {

          server = serverDetails;

          return webpage.testPages(urls, function (options) {

            // inject a call to the test server into the page
            (function (d, script) {
              script = d.createElement('script');
              script.type = 'text/javascript';
              script.src = 'http://' + options.host + ':' + options.port;
              d.getElementsByTagName('head')[0].appendChild(script);
            }(document));

          }, function () {

            return window.clientaudit ? window.clientaudit(window.clientAuditData) : false;

          }, {
            'host': server.host,
            'port': server.port
          });

        }).then(function (results) {
          return combineresults.process(results);

        }).then(function (results) {

          return exportresults.process(options.stylesheets[0], results);

        }).done(function (results) {
          server.stop();

          fs.writeFile(options.output, JSON.stringify(results), function (err) {
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
