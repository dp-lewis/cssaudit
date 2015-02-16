/*global describe, it*/
var stylesheets, sitemaps, cssaudit = require('../lib/cssaudit.js');

stylesheets = ['http://findercdn.com.au/static/1405/css/static.min.css'];
sitemaps = ['http://www.finder.com.au/sitemap.xml'];


describe('cssaudit', function () {
  it('should do its shit', function (done) {

    var myaudit = cssaudit.init({
      'stylesheets': stylesheets,
      'sitemaps': sitemaps,
      'output': './output/cssaudit.json'
    });

    myaudit.run().then(function () {
      done();
    });

  });
});
