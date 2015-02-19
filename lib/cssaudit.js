var Q = require('q'), sitemap = require('./sitemap.js'),
  webpage = require('./webpage');

module.exports = {
  init: function (options) {

    return {
      'run': function () {
        var deferred = Q.defer();

        sitemap.fetch(options.sitemaps).then(function (result) {
          
          var urls = result[0].urlset.url.map(function (info) {
            return info.loc[0];
          });

         // webpage.testPages(urls, function () {
         //   return document.title;
         // }).then(function () {
            deferred.resolve();
        //  });

        });

        return deferred.promise;
      }
    };
  }
};
