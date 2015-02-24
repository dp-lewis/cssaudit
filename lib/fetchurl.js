var http = require('http'),
  https = require('https'),
  Q = require('q'),
  zlib = require('zlib'),
  URL = require('url');

function fetch(url) {
  var deferred = Q.defer(),
    req,
    resolve,
    urlDetails;

  urlDetails = URL.parse(url);

  if (urlDetails.protocol === 'https:') {
    req = https.get(url);
  } else {
    req = http.get(url);
  }

  resolve = function (data) {
    if (!data || typeof data !== 'string') {
      deferred.reject('fetch url data did not return with a string');
    } else {
      deferred.resolve(data);
    }
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
