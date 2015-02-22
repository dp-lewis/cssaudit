var Q = require('q'),
  fs = require('fs'),
  Mustache = require('mustache');


module.exports = {
  process: function (templateLocation, templateData) {
    var deferred = Q.defer();

    fs.readFile(templateLocation, function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(Mustache.render(data.toString(), templateData));
      }
    });

    return deferred.promise;
  }
};
