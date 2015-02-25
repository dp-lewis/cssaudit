var Q = require('q'),
  get = require('simple-get');

function fetch(url) {
  var deferred = Q.defer();

  get.concat(url, function (err, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data.toString());
    }
  });

  return deferred.promise;
}

module.exports = {
  'fetch': fetch
};
