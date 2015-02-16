var phantom = require('phantom'),
  Q = require('q');

function testPage(cb) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open("http://www.google.com", function (status) {
        console.log("opened google? ", status);
        page.evaluate(function () {
          return document.title;
        }, function (result) {
          console.log('Page title is ' + result);
          ph.exit();
          cb();
        });
      });
    });
  });
}

module.exports = {
  'testPage': function () {
    return Q.Promise(function (resolve) {
      testPage(function () {
        resolve();
      });
    });
  }
};
