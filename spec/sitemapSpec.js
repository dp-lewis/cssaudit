/*global describe, it, expect*/
var sitemap = require('../lib/sitemap.js');


describe('sitemap', function () {
  it('should do fetch a sitemap', function (done) {
    sitemap.fetch('http://www.finder.com.au/sitemap.xml').then(function (result) {
      expect(typeof result).toBe('object');
      done();
    });
  });

  it('should do fetch multiple sitemaps', function (done) {
    sitemap.fetch(['http://www.finder.com.au/sitemap.xml', 'http://www.finder.com.au/sitemap.xml']).then(function (result) {
      expect(typeof result).toBe('object');
      done();
    });
  });
});
