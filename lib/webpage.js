var phantom = require('phantom'),
  Q = require('q');

function requestPage(url, testToRun, collectResult, passToTests) {
  var deferred = Q.defer(),
    pollForResult;

  pollForResult = function (page, pollFunction, passToTests, successCallback) {
    page.evaluate(collectResult, function (result) {
      if (result === false) {
        setTimeout(function () {
          pollForResult(page, pollFunction, passToTests, successCallback);
        }, 100);
      } else {
        successCallback(result);
      }
    }, passToTests);
  };

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(url, function () {
        // evaluate the first function for the test
        page.evaluate(testToRun, function () {
          // poll for the result
          pollForResult(page, collectResult, passToTests, function (result) {
            deferred.resolve(result);
          });
        }, passToTests);
      });
    });
  });
  return deferred.promise;
}

function testPages(urls, testToRun, collectResult, passToTests) {
  var deferred = Q.defer(),
    results = [],
    queue = [];

  urls.forEach(function (url) {
    queue.push(Q.promise(function (resolve) {
      requestPage(url, testToRun, collectResult, passToTests).then(function (result) {
        try {
          result = JSON.parse(result);
        } catch (ignore) {
        }
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
  'testPages': function (urls, testToRun, collectResult, passToTests) {
    return Q.Promise(function (resolve) {
      testPages(urls, testToRun, collectResult, passToTests).then(function (results) {
        resolve(results);
      });
    });
  }
};
