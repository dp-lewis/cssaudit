var cssaudit = require('./lib/cssaudit'),
  myaudit;

myaudit = cssaudit.init({
  'stylesheets': ['http://www.david-lewis.com/wp-content/themes/davidlewis/style.css'],
  'sitemaps': ['http://www.david-lewis.com/sitemap-posttype-post.xml'],
  'output': './output/david-lewis.html'
});

myaudit.run().done(function () {
  console.log('done');
}, function (err) {
  console.log(err);
});
