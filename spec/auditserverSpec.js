/*global describe, expect, it*/
var auditserver = require('../lib/auditserver.js');

describe('audit server', function () {
  it('should do its shit', function (done) {
    auditserver.start(['html', 'body']).then(function (server) {
      console.log(server);
      expect(typeof server).toBe('object');
      server.stop();
      done();
    });
  });
});
