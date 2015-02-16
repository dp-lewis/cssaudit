var sitemap = require('../lib/sitemap.js');


describe('sitemap', function () {
  it('should do its shit', function (done) {
    sitemap.fetch('http://www.finder.com.au/sitemap.xml').then(function (result) {
      expect(typeof result).toBe('object');
      done();
    });
  });
});
