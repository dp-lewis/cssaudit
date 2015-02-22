/*global describe, it, expect */
var prepcss = require('../lib/prepcss');

describe('prep css', function () {
  it('Should fetch the contents of the CSS file', function (done) {
    prepcss.process('http://findercdn.com.au/static/1405/css/static.min.css').then(function (selectors) {
      expect(typeof selectors[0].selector).toBe('string');
      done();
    });
  });
});
