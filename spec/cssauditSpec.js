/*global describe, it*/
var stylesheets, sitemaps, cssaudit = require('../lib/cssaudit.js');

stylesheets = ['http://www.david-lewis.com/wp-content/themes/davidlewis/style.css'];
sitemaps = ['http://www.david-lewis.com/sitemap-posttype-post.xml'];


describe('cssaudit', function () {
  it('should do its shit', function (done) {

    var myaudit = cssaudit.init({
      'stylesheets': stylesheets,
      'sitemaps': sitemaps,
      'output': './output/cssaudit.html'
    });

    myaudit.run().then(function (results) {
      done();
    });

  });
});
