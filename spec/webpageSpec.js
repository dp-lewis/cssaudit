/*global window, expect, describe, it, jasmine*/

var webpage = require('../lib/webpage.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('webpage', function () {
  it('should do its shit', function (done) {
    var pagesToTest, testToRun;

    pagesToTest = ['http://www.google.com.au', 'http://www.david-lewis.com'];

    testToRun = function () {
      return 'it certainly did';
    };

    webpage.testPages(pagesToTest, testToRun).then(function (results) {
      expect(typeof results).toBe('object');
      expect(results.length).toBe(2);
      expect(results[0]).toBe('it certainly did');
      done();
    });
  });

  it('should have access to data passed to it from the outside', function (done) {
    var pagesToTest, testToRun, options;

    options = {
      'testing': true
    };

    pagesToTest = ['http://www.google.com.au'];

    testToRun = function (passedOptions) {
      return passedOptions;
    };

    webpage.testPages(pagesToTest, testToRun, options).then(function (results) {
      expect(typeof results).toBe('object');
      expect(results[0].testing).toBe(true);
      done();
    });
  });
});
