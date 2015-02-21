var http = require('http'),
  Q = require('q'),
  fs = require('fs'),
  index = fs.readFileSync(__dirname + '/auditserver/clientaudit.js'),
  getDirName = require('path').dirname;

module.exports = {
  // with the server we expose all the selectors 
  // we have found plus some functionality to count their use
  start: function (selectors) {
    var deferred = Q.defer(), server;

    server = http.createServer(function (req, res) {
      /*jslint unparam: true */
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      // include the selector data plus the original file data in the server output
      res.end('window.clientAuditData = ' + JSON.stringify(selectors) + ';' + index);

    }).listen(0, function () {

      deferred.resolve({
        'host': 'localhost',
        'port': server.address().port,
        'stop': function () {
          server.close();
        }
      });

    });

    return deferred.promise;
  }
};


