[![Build Status](https://travis-ci.org/dp-lewis/cssaudit.svg?branch=dev)](https://travis-ci.org/dp-lewis/cssaudit)

# cssaudit
CSS Audit helps identify unused selectors in your CSS


```
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
```
