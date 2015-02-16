var fetchurl = require('./fetchurl'),
  parseString = require('xml2js').parseString,
  Q = require('q');

module.exports = {
  fetch: function (url) {
    return Q.Promise(function (resolve, reject) {
      fetchurl.fetch(url).then(function (result) {
        parseString(result, function (err, parsedResult) {
          resolve(parsedResult);
        })

      }, reject);
    });
  }
};
