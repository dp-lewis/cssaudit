var cssaudit = require('./lib/cssaudit'),
  stylesheets,
  sitemaps,
  myaudit;

stylesheets = ['http://www.david-lewis.com/wp-content/themes/davidlewis/style.css'];
sitemaps = ['http://www.david-lewis.com/sitemap-posttype-post.xml'];

myaudit = cssaudit.init({
  'stylesheets': stylesheets,
  'sitemaps': sitemaps,
  'output': './output/dpl.html'
});

myaudit.run().done(function () {
  console.log('done');
}, function (err) {
  console.log(err);
});
