var Q = require('q'),
  css = require('css'),
  fetchurl = require('./fetchurl').fetch;

function getSelectors(rawCSS) {
  var deferred = Q.defer(),
    parsedCSS = css.parse(rawCSS),
    selectors = [];

  parsedCSS.stylesheet.rules.forEach(function (rule) {
    if (rule.selectors) {
      rule.selectors.forEach(function (selector) {
        selectors.push({
          'selector': selector
        });
      });
    }
  });

  deferred.resolve(selectors);

  return deferred.promise;
}

module.exports = {
  process: function (url) {
    var deferred = Q.defer();

    fetchurl(url).then(function (rawCSS) {
      return getSelectors(rawCSS);
    }).then(function (selectors) {
      deferred.resolve(selectors);
    });

    return deferred.promise;
  }
};
