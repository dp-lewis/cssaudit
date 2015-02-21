var Q = require('q');

function objToArray(obj) {
  var key, exportArray = [];
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      exportArray.push(obj[key]);
    }
  }

  return exportArray;
}

function createExportObject(fileText, selectorResults) {
  var preparedObject = {};

  preparedObject.file = fileText;
  preparedObject.results = objToArray(selectorResults);

  return preparedObject;

}

module.exports = {
  process: function (fileText, selectorResults) {
    var deferred = Q.defer();

    deferred.resolve(createExportObject(fileText, selectorResults));

    return deferred.promise;
  }
};
