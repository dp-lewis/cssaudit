/*global describe, it, expect*/
var sitemap = require('../lib/sitemap.js'),
  fs = require('fs'),
  nock = require('nock'),
  nockSitemaps;

nockSitemaps = nock('http://localhost').get('/sitemap1.xml')
  .times(2)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/sitemap1.xml');
  })
  .get('/sitemap2.xml')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/sitemap2.xml');
  });

describe('sitemap', function () {
  it('should do fetch a sitemap', function (done) {
    sitemap.fetch('http://localhost/sitemap1.xml').then(function (result) {
      expect(typeof result).toBe('object');
      expect(result.length).toBe(1);
      done();
    });
  });

  it('should fetch multiple sitemaps', function (done) {
    sitemap.fetch(['http://localhost/sitemap1.xml', 'http://localhost/sitemap2.xml']).then(function (result) {
      expect(typeof result).toBe('object');
      expect(result.length).toBe(2);
      done();
    });
  });
});
