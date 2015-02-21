var fs = require('fs.extra'),
  Q = require('q');

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
              'used': 0,
              'urls': []
            };
          }

          finalResults[key].used += result[key].used;
          if (result[key].used > 0) {
            finalResults[key].urls.push(result[key].url);            
          }

        }
      }
    });

    deferred.resolve(finalResults);

    return deferred.promise;
  }
};
