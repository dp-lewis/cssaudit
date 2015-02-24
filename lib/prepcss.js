var Q = require('q'),
  css = require('css'),
  cssbeautify = require('cssbeautify'),
  fetchurl = require('./fetchurl').fetch;

function getSelectors(rawCSS, url) {
  var deferred = Q.defer(), prettyCSS, parsedCSS, selectors = [];

  prettyCSS = cssbeautify(rawCSS);
  parsedCSS = css.parse(prettyCSS, { 'silent': true });

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
  return fetchurl(url)
    .then(function (rawCSS) {
      return getSelectors(rawCSS, url);
    });
}

function multiple(urls) {
  var deferred = Q.defer(), promises, finalResults = [];

  promises = urls.map(single);

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
    var promise;

    if (typeof urls === 'string') {
      promise = single(urls);
    } else {
      promise = multiple(urls);
    }

    return promise;
  }
};
