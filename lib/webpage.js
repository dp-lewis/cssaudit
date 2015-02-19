var phantom = require('phantom'),
  Q = require('q');

function requestPage(url, testToRun) {
  var deferred = Q.defer();
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      console.log('opening' + url);      
      page.open(url, function () {
        
        page.evaluate(testToRun, function (result) {
          deferred.resolve(result);
        });
      });
    });
  });
  return deferred.promise;
}

function testPages(urls, testToRun) {
  var deferred = Q.defer(),
    results = [],
    queue = [];

  urls.forEach(function (url) {
    queue.push(Q.promise(function (resolve) {
      requestPage(url, testToRun).then(function (result) {
        results.push(result);
        resolve();
      });
    }));
  });

  Q.allSettled(queue).done(function () {
    deferred.resolve(results);
  });

  return deferred.promise;
}

module.exports = {
  'testPages': function (urls, testToRun) {
    return Q.Promise(function (resolve) {
      testPages(urls, testToRun).then(function (results) {
        resolve(results);
      });
    });
  }
};
