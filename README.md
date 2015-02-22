[![Build Status](https://travis-ci.org/dp-lewis/cssaudit.svg?branch=master)](https://travis-ci.org/dp-lewis/cssaudit)

# CSS Audit
CSS Audit helps identify unused selectors in your CSS. This is designed to help you make an informed decision about whether you can remove a CSS selector from your stylesheet.

This is especially useful on older websites where the original authors of the CSS are no longer available and you are faced with adding new features without knowing what is no longer needed.

## Installing

```
npm install git+https://github.com/dp-lewis/cssaudit.git
```

## How it works

You provide CSS Audit with a stylesheet and a site map, it will then extract all the CSS selectors and check how many times they're used on each URL found in the sitemap.

The speed of the test is dependant on your internet connection, page requests are queued and executed in parallel with a maximum of 10 pages being requested at a time.

### Limitations
The selectors are checked using PhantomJS which means it won't give you information on selectors that aren't understood by WebKit. 

The selectors are tested on page load, so any CSS selectors that are used following user interaction (i.e. JavaScript) will report as having 0 uses.

## Example output

CSS Audit outputs a HTML report, and example can be viewed here: http://dp-lewis.github.io/cssaudit/

## How to use
```
var cssaudit = require('cssaudit'),
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
