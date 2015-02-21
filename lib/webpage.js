var phantom = require('phantom'),
  Q = require('q'),
  Queue = require("madlib-promise-queue");

function requestPage(url, testToRun, passToTests) {
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
      page.open(url, function () {
        // evaluate the first function for the test
        page.evaluate(testToRun, function (result) {
          clearTimeout(timer2);
          console.log(url);
          ph.exit();
          deferred.resolve(result);
        }, passToTests);
      });
    });
  });

  return deferred.promise;
}

function testPages(urls, testToRun, passToTests) {
  var deferred = Q.defer(),
    results = [],
    queue = new Queue(10, "fifo"),
    counter = 0;

  function createPagePromise(url) {
    var newPromise = Q.promise(function (resolve) {
      requestPage(url, testToRun, passToTests).then(function (result) {
        try {
          result = JSON.parse(result);
        } catch (ignore) {}
        results.push(result);
        queue.done();
        resolve();
      });
    });

    return newPromise;
  }

  urls.forEach(function (url) {
    queue.ready().then(function () {
      createPagePromise(url).then(function () {
        counter = counter + 1;
        if (counter === urls.length) {
          deferred.resolve(results);
        }
      });
    });
  });

  return deferred.promise;
}

module.exports = {
  'testPages': function (urls, testToRun, passToTests) {
    return Q.Promise(function (resolve) {
      testPages(urls, testToRun, passToTests).then(function (results) {
        resolve(results);
      });
    });
  }
};
