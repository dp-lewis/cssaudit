var Q = require('q'), sitemap = require('./sitemap.js');

function fetchSitemaps(sitemaps) {
  var deferred = Q.defer(), fetches = [];

  sitemaps.forEach(function (item) {
    fetches.push(sitemap.fetch(item));
  });

  Q.all(fetches).then(function (results) {
    console.log(results[0].urlset.url.length);
  }).done(function () {
    deferred.resolve();
  });

  return deferred.promise;
}

module.exports = {
  init: function (options) {

    return {
      'run': function () {
        var deferred = Q.defer();

        fetchSitemaps(options.sitemaps).then(function () {
          deferred.resolve();
        });

        return deferred.promise;
      }
    };
  }
};
