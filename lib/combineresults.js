var Q = require('q');

function dedupe(collection) {
  return collection.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
}

module.exports = {
  process: function (results) {
    var deferred = Q.defer(), finalResults = {}, key;

    // loop through the results and check each property, transferring it's results to the finalResults object
    results.forEach(function (result) {
      // loop through results and create an object to count things up...
      for (key in result) {
        if (result.hasOwnProperty(key)) {

          // 
          if (!finalResults[key]) {
            finalResults[key] = {
              'selector': key,
              'exampleUrl': '',
              'totalUrls': 0,
              'used': 0,
              'urls': [],
              'stylesheets': []
            };
          }

          finalResults[key].used += result[key].used;
          if (result[key].used > 0) {
            finalResults[key].exampleUrl = result[key].url;
            finalResults[key].urls.push(result[key].url);
            finalResults[key].totalUrls = finalResults[key].urls.length;
            finalResults[key].stylesheets.push(result[key].stylesheet);
            finalResults[key].stylesheets = dedupe(finalResults[key].stylesheets);
          }

        }
      }
    });

    deferred.resolve(finalResults);

    return deferred.promise;
  }
};
