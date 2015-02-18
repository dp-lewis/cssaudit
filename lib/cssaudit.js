var Q = require('q'), sitemap = require('./sitemap.js');



module.exports = {
  init: function (options) {

    return {
      'run': function () {
        var deferred = Q.defer();

        sitemap.fetch(options.sitemaps).then(function () {
          deferred.resolve();
        });

        return deferred.promise;
      }
    };
  }
};
