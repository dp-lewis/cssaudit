/*global describe, it, beforeEach, afterEach*/
var stylesheets,
  sitemaps,
  cssaudit = require('../lib/cssaudit.js'),
  http = require('http'),
  fs = require('fs'),
  nock = require('nock'),
  nockSitemaps,
  nockCSS;

nockSitemaps = nock('http://localhost:7701').get('/sitemap1.xml')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/sitemap1.xml');
  })
  .get('/sitemap2.xml')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/sitemap2.xml');
  });

nockCSS = nock('http://localhost:7701').get('/stylesheet1.css')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/stylesheet1.css');
  })
  .get('/stylesheet2.css')
  .times(1)
  .reply(200, function () {
    return fs.createReadStream(__dirname + '/fixtures/stylesheet2.css');
  });

describe('cssaudit', function () {

  var server, stylesheets, sitemaps;

  stylesheets = ['http://localhost:7701/stylesheet1.css', 'http://localhost:7701/stylesheet2.css'];
  sitemaps = ['http://localhost:7701/sitemap1.xml', 'http://localhost:7701/sitemap2.xml'];


  beforeEach(function (done) {
    // set up fake server to soak up request
    fs.readFile(__dirname + '/fixtures/index.html', function (err, data) {
      /*jslint unparam: true*/
      server = http.createServer(function (req, res) {
        console.log('reading..');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }).listen(7701);

      done();
    });
  });

  afterEach(function () {
    // tear down server
    server.close();
  });

  it('should do its shit', function (done) {

    var myaudit = cssaudit.init({
      'stylesheets': stylesheets,
      'sitemaps': sitemaps,
      'output': './output/cssaudittest'
    });

    myaudit.run().done(function (results) {
      done();
    });

  });
});
