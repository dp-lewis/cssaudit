var cssaudit = require('./lib/cssaudit'),
  stylesheets,
  sitemaps;

stylesheets = ['http://findercdn.com.au/static/1405/css/static.min.css'];
sitemaps = ['http://www.finder.com.au/sitemap.xml'];

cssaudit.init({
  'stylesheets': stylesheets,
  'sitemaps': sitemaps,
  'output': './output/cssaudit.json'
}).then(function (results) {
  console.log(results);
});
