/*global it, describe, expect */
var fetchurl = require('../lib/fetchurl.js'),
  fs = require('fs'),
  nock = require('nock'),
  nockSitemaps;

nockSitemaps = nock('http://localhost', {
  reqheaders: {
    'Content-Type': 'text/xml'
  }
}).get('/sitemap1.xml')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/sitemap1.xml');
  });


describe('fetch url', function () {
  it('should get the contents of a url', function (done) {
    fetchurl.fetch('http://localhost/sitemap1.xml').then(function (result) {
      expect(typeof result).toBe('string');
      done();
    });
  });
});
