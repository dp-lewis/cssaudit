/*global describe, it, expect */
var prepcss = require('../lib/prepcss'),
  fs = require('fs'),
  nock = require('nock'),
  nockCSS;

nockCSS = nock('http://localhost', {
  reqheaders: {
    'Content-Type': 'text/css'
  }
}).get('/stylesheet1.css')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/stylesheet1.css');
  });

describe('prep css', function () {
  it('Should fetch the contents of the CSS file', function (done) {
    prepcss.process('http://localhost/stylesheet1.css').then(function (selectors) {
      expect(typeof selectors[0].selector).toBe('string');
      done();
    });
  });
});
