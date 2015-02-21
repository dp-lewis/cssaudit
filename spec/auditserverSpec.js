/*global xdescribe, expect, it*/
var auditserver = require('../lib/auditserver.js');

xdescribe('audit server', function () {
  it('should do its shit', function (done) {
    auditserver.start(['html', 'body']).then(function (server) {
      expect(typeof server).toBe('object');
      server.stop();
      done();
    });
  });
});
