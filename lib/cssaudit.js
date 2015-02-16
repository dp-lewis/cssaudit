var q = require('q');

module.exports = {
  init: function () {

    return {
      'run': function () {
        var deferred = q.defer();

        deferred.resolve();
        return deferred.promise;
      }
    };
  }
};
