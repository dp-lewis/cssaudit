/*global window, expect, describe, it, jasmine*/

var webpage = require('../lib/webpage.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('webpage', function () {
  it('should do its shit', function (done) {
    var pagesToTest, testToRun, collectResult;

    pagesToTest = ['http://www.google.com.au', 'http://www.finder.com.au'];

    testToRun = function () {
      window.didItWork = 'it certainly did';
    };

    collectResult = function () {
      return window.didItWork;
    };

    webpage.testPages(pagesToTest, testToRun, collectResult).then(function (results) {
      expect(typeof results).toBe('object');
      expect(results.length).toBe(2);
      expect(results[0]).toBe('it certainly did');
      done();
    });
  });

  it('should do its shit with an asynchronous test', function (done) {
    var pagesToTest, testToRun, collectResult;

    pagesToTest = ['http://www.google.com.au'];

    testToRun = function () {
      window.setTimeout(function () {
        window.didItWork = 'hell yeah!';
      }, 500);

    };

    collectResult = function () {
      return window.didItWork || false;
    };

    webpage.testPages(pagesToTest, testToRun, collectResult).then(function (results) {
      expect(typeof results).toBe('object');
      expect(results[0]).toBe('hell yeah!');
      done();
    });
  });

  it('should have access to data passed to it from the outside', function (done) {
    var pagesToTest, testToRun, collectResult, options;

    options = {
      'testing': true
    };

    pagesToTest = ['http://www.google.com.au'];

    testToRun = function (passedOptions) {
      window.passedOptions = passedOptions;

    };

    collectResult = function () {
      return window.passedOptions;
    };

    webpage.testPages(pagesToTest, testToRun, collectResult, options).then(function (results) {
      expect(typeof results).toBe('object');
      expect(results[0].testing).toBe(true);
      done();
    });
  });
});
