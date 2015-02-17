/*global describe, it*/

var webpage = require('../lib/webpage.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000000;

describe('webpage', function () {
  it('should do its shit', function (done) {
    webpage.testPages(['http://www.google.com.au', 'http://www.finder.com.au']).then(function () {
      done();
    });
  });
});
