var cssaudit = require('./lib/cssaudit'),
  stylesheets,
  sitemaps,
  myaudit;

stylesheets = ['http://www.david-lewis.com/wp-content/themes/davidlewis/style.css'];
sitemaps = ['http://www.david-lewis.com/sitemap-posttype-post.xml', 'http://www.david-lewis.com/sitemap-posttype-page.xml'];

myaudit = cssaudit.init({
  'stylesheets': stylesheets,
  'sitemaps': sitemaps,
  'output': './output/david-lewis.json'
});

myaudit.run().done(function (results) {
	console.log('done');
});
