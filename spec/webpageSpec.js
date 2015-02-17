/*global expect, describe, it, jasmine*/

var webpage = require('../lib/webpage.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000000;

describe('webpage', function () {
  it('should do its shit', function (done) {
    var pagesToTest, testToRun;

    pagesToTest = ['http://www.google.com.au', 'http://www.finder.com.au'];

    testToRun = function () {
      return document.title;
    };

    webpage.testPages(pagesToTest, testToRun).then(function (results) {
      expect(typeof results).toBe('object');
      done();
    });
  });
});
