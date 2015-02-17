var phantom = require('phantom'),
  Q = require('q');

function requestPage(page, url, cb) {
  page.open(url, function () {
    page.evaluate(function () {
      return document.title;
    }, function (result) {
      cb(result);
    });
  });
}

function testPages(urls) {
  var deferred = Q.defer(),
    counter = 0,
    doit;

  doit = function (page) {
    requestPage(page, urls[counter], function () {
      if (counter === urls.length) {
        deferred.resolve();
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
  'testPages': function (urls) {
    return Q.Promise(function (resolve) {
      testPages(urls).then(function () {
        resolve();
      });
    });
  }
};
