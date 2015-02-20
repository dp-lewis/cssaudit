var phantom = require('phantom'),
  Q = require('q');

function requestPage(url, testToRun, collectResult) {
  var deferred = Q.defer(),
    pollForResult;

  pollForResult = function (page, pollFunction, successCallback) {
    page.evaluate(collectResult, function (result) {
      if (result === false) {
        setTimeout(function () {
          pollForResult(page, pollFunction, successCallback);
        }, 100);
      } else {
        successCallback(result);
      }
    });
  };

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      console.log('opening' + url);
      page.open(url, function () {
        // evaluate the first function for the test
        page.evaluate(testToRun, function () {
          // poll for the result
          pollForResult(page, collectResult, function (result) {
            deferred.resolve(result);
          });
        });
      });
    });
  });
  return deferred.promise;
}

function testPages(urls, testToRun, collectResult) {
  var deferred = Q.defer(),
    results = [],
    queue = [];

  urls.forEach(function (url) {
    queue.push(Q.promise(function (resolve) {
      requestPage(url, testToRun, collectResult).then(function (result) {
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
  'testPages': function (urls, testToRun, collectResult) {
    return Q.Promise(function (resolve) {
      testPages(urls, testToRun, collectResult).then(function (results) {
        resolve(results);
      });
    });
  }
};
