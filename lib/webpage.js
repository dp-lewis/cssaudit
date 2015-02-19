var phantom = require('phantom'),
  Q = require('q');

function requestPage(page, url, testToRun, cb) {
  page.open(url, function () {
    console.log('opening ' + url);
    page.evaluate(testToRun, function (result) {
      console.log(result);
      cb(result);
    });
  });
}

function testPages(urls, testToRun) {
  var deferred = Q.defer(),
    counter = 0,
    doit,
    results = [];

  doit = function (page) {
    requestPage(page, urls[counter], testToRun, function (result) {
      results.push(result);
      if (counter === urls.length) {
        deferred.resolve(results);
      } else {
        counter = counter + 1;
        doit(page);
      }
    });
  };

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      doit(page);
    });
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
