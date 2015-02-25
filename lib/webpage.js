var phantom = require('phantom'),
  Q = require('q'),
  Queue = require("promise-queue");

Queue.configure(Q.promise);

function requestPage(url, testToRun, dataForTest) {
  var deferred = Q.defer(), timer1;

  timer1 = setTimeout(function () {
    console.log('Phantom just did not want to play');
    deferred.resolve();
  }, 10000);

  phantom.create('--ssl-protocol=any', '--load-images=false', function (ph) {
    clearTimeout(timer1);

    var timer2 = setTimeout(function () {
      console.log('Timed out: ' + url);
      ph.exit();
      deferred.resolve();
    }, 60000);

    ph.createPage(function (page) {

      // open a page for each viewport size required...
      page.open(url, function () {
        // evaluate the first function for the test
        page.evaluate(testToRun, function (result) {
          clearTimeout(timer2);
          console.log(url);
          ph.exit();
          deferred.resolve(result);
        }, dataForTest);
      });
    });
  });

  return deferred.promise;
}

function testPages(urls, testToRun, dataForTest, queueSize) {
  var deferred = Q.defer(),
    results = [],
    queue = new Queue(queueSize || 10, urls.length);

  urls.forEach(function (url) {
    queue.add(function () {
      return requestPage(url, testToRun, dataForTest);
    }).then(function (result) {
      try {
        result = JSON.parse(result);
      } catch (ignore) {}
      results.push(result);

      if (queue.getPendingLength() === 0) {
        deferred.resolve(results);
      }
    });
  });

  return deferred.promise;
}

module.exports = {
  'testPages': function (urls, testToRun, dataForTest, queueSize) {
    return Q.Promise(function (resolve, reject) {
      if (!dataForTest) {
        reject('Data for test was not found');
      } else {
        testPages(urls, testToRun, dataForTest, queueSize).then(function (results) {
          resolve(results);
        });
      }
    });
  }
};
