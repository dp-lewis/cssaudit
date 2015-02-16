/*global describe, it*/

var webpage = require('../lib/webpage.js');

describe('webpage', function () {
  it('should do its shit', function (done) {
    webpage.testPage().then(function () {
      done();
    });
  });
});
