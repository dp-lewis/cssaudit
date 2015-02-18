/*jslint browser: true*/

window.clientaudit = function (data) {

  var results = {};

  function checkSelector(selector) {
    var mockedSelector = selector;

    mockedSelector = selector.selector.replace(':before', '');
    mockedSelector = mockedSelector.replace(':after', '');
    mockedSelector = mockedSelector.replace(':hover', '');

    try {
      results[selector.selector] = {
        'selector' : selector.selector,
        'used': document.querySelectorAll(mockedSelector).length
      };
    } catch (e) {
      results[selector.selector] = {
        'selector' : selector.selector,
        'used': 0,
        'message': 'problem running this selector'
      };

    }
  }

  data.forEach(checkSelector);

  return JSON.stringify(results);

};

