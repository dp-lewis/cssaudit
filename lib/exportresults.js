var Q = require('q');

function objToArray(obj) {
  var key, exportArray = [], index = 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key].id = index;
      exportArray.push(obj[key]);
      index = index + 1;
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
