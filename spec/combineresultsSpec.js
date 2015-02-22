/*global describe, it, expect*/
var combineresults = require('../lib/combineresults.js');

describe('combineresults', function () {

  it('should combine results in an array', function (done) {
    var results = [];

    results.push({
      'html': {
        'selector': 'html',
        'used': 2,
        'url': 'http://mydomain.com/home.html'
      },
      'body': {
        'selector': 'body',
        'used': 5,
        'url': 'http://mydomain.com/home.html'
      }
    });

    results.push({
      'html': {
        'selector': 'html',
        'used': 4,
        'url': 'http://mydomain.com/aboutus.html'
      },
      'body': {
        'selector': 'body',
        'used': 10,
        'url': 'http://mydomain.com/aboutus.html'
      }
    });

    combineresults.process(results).then(function (result) {
      expect(typeof result).toBe('object');
      done();
    });
  });

});
