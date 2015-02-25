/*global describe, it, expect */
var prepcss = require('../lib/prepcss'),
  fs = require('fs'),
  nock = require('nock'),
  nockCSS;

nockCSS = nock('http://localhost').get('/stylesheet1.css')
  .times(2)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/stylesheet1.css');
  })
  .get('/stylesheet2.css')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/stylesheet2.css');
  });

describe('prep css', function () {
  it('Should fetch the contents of a CSS file', function (done) {
    prepcss.process('http://localhost/stylesheet1.css').then(function (selectors) {
      expect(typeof selectors[0].selector).toBe('string');
      done();
    });
  });

  it('Should combine the contents of multiple CSS files', function (done) {
    prepcss.process(['http://localhost/stylesheet1.css', 'http://localhost/stylesheet2.css']).then(function (selectors) {
      expect(typeof selectors[0].selector).toBe('string');
      done();
    });
  });
});
