var http = require('http'),
  Q = require('q'),
  zlib = require('zlib');

function fetch(url) {
  var deferred = Q.defer(),
    req = http.get(url),
    resolve;

  resolve = function (data) {
    deferred.resolve(data);
  };

  req.on('response', function (res) {
    var chunks = [];
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      var buffer = Buffer.concat(chunks),
        encoding = res.headers['content-encoding'];

      if (encoding === 'gzip') {
        zlib.gunzip(buffer, function (err, decoded) {
          if (err) {
            deferred.reject(err);
          } else {
            resolve(decoded.toString());
          }
        });
      } else if (encoding === 'deflate') {
        zlib.inflate(buffer, function (err, decoded) {
          if (err) {
            deferred.reject(err);
          } else {
            resolve(decoded.toString());
          }
        });
      } else {
        resolve(buffer.toString());
      }
    });
  });

  req.on('error', function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
}

module.exports = {
  'fetch': fetch
};
