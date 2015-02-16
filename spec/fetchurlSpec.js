var fetchurl = require('../lib/fetchurl.js');


describe('fetch url', function () {
  it('should do its shit', function (done) {
    fetchurl.fetch('http://www.finder.com.au/sitemap.xml').then(function (result) {
	  expect(typeof result).toBe('string');  	
      done();
    });
  });
});
