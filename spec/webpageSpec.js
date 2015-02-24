/*global window, expect, describe, it, jasmine, afterEach, beforeEach*/

var webpage = require('../lib/webpage.js'),
  fs = require('fs'),
  http = require('http');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('webpage', function () {
  var server;

  beforeEach(function (done) {
    // set up fake server to soak up request
    fs.readFile(__dirname + '/fixtures/index.html', function (err, data) {
      /*jslint unparam: true*/
      server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }).listen(7701);

      done();
    });
  });

  afterEach(function () {
    // tear down server
    server.close();
  });


  it('should do its shit', function (done) {
    var pagesToTest, testToRun;

    pagesToTest = ['http://locahost:7701/one.html', 'http://localhost:7701/two.html'];

    testToRun = function () {
      return 'it certainly did';
    };

    webpage.testPages(pagesToTest, testToRun, {}).then(function (results) {
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

    pagesToTest = ['http://locahost:7701/one.html'];

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
