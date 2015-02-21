var fetchurl = require('./fetchurl'),
  parseString = require('xml2js').parseString,
  Q = require('q');

function processSitemap(sitemapurl) {
  return Q.Promise(function (resolve, reject) {
    fetchurl.fetch(sitemapurl).then(function (result) {

      parseString(result, function (err, parsedResult) {
        if (err) {
          reject(err);
        } else {
          resolve(parsedResult);
        }
      });

    }, reject);
  });
}

function single(sitemap) {
  return Q.Promise(function (resolve, reject) {
    processSitemap(sitemap).then(function () {
      resolve([sitemap]);
    }, reject);
  });
}

function multiple(sitemaps) {
  var deferred = Q.defer(),
    fetches = [];

  sitemaps.forEach(function (item) {
    fetches.push(processSitemap(item));
  });

  Q.all(fetches).then(function (results) {
    deferred.resolve(results);
  });

  return deferred.promise;
}

module.exports = {
  fetch: function (urls) {
    var returnValue;

    if (typeof urls === 'string') {
      returnValue = single(urls);
    } else {
      returnValue = multiple(urls);
    }
    return returnValue;
  }
};
