var Q = require('q'),
  css = require('css'),
  cssbeautify = require('cssbeautify'),
  fetchurl = require('./fetchurl').fetch;

function getSelectors(rawCSS, url) {
  var deferred = Q.defer(),
    prettyCSS = cssbeautify(rawCSS),
    parsedCSS = css.parse(prettyCSS, { 'silent': true }),
    selectors = [];

  parsedCSS.stylesheet.rules.forEach(function (rule) {
    if (rule.selectors) {
      rule.selectors.forEach(function (selector) {
        selectors.push({
          'selector': selector,
          'stylesheet': url
        });
      });
    }
  });

  deferred.resolve(selectors);

  return deferred.promise;
}

function single(url) {
  var deferred = Q.defer();

  fetchurl(url)
    .then(function (rawCSS) {
      return getSelectors(rawCSS, url);
    })
    .then(function (selectors) {
      deferred.resolve(selectors);
    });

  return deferred.promise;
}

function multiple(urls) {
  var deferred = Q.defer(), promises, finalResults = [];

  promises = urls.map(function (url) {
    return fetchurl(url).then(function (rawCSS) {
      return getSelectors(rawCSS, url);
    });
  });

  Q.allSettled(promises).then(function (results) {
    results.forEach(function (result) {
      finalResults = finalResults.concat(result.value);
    });
    deferred.resolve(finalResults);
  });

  return deferred.promise;
}

module.exports = {
  process: function (urls) {
    var deferred = Q.defer();

    if (typeof urls === 'string') {
      single(urls)
        .then(function (selectors) {
          deferred.resolve(selectors);
        });
    } else {
      multiple(urls)
        .then(function (selectors) {
          deferred.resolve(selectors);
        });
    }

    return deferred.promise;
  }
};
