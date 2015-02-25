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

function createExportObject(stylesheets, selectorResults, urls) {
  var preparedObject = {};

  if (typeof stylesheets === 'string') {
    stylesheets = [stylesheets];
  }

  preparedObject.stylesheets = stylesheets;
  preparedObject.results = objToArray(selectorResults);
  preparedObject.totalSelectors = preparedObject.results.length;
  preparedObject.totalUrls = urls.length;
  preparedObject.urls = urls;

  return preparedObject;
}

module.exports = {
  process: function (fileText, selectorResults, urls) {
    var deferred = Q.defer();

    deferred.resolve(createExportObject(fileText, selectorResults, urls));

    return deferred.promise;
  }
};
