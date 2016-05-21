(function() {
    'use strict';
    $('#participate-test').on('click', function(event) {
        var locationHref = $(this).attr('href'),
            testName = $(this).attr('data-test-name');

        httpRequester.sendRequest(locationHref, 'PUT', JSON.stringify({
            testName: testName
        })).then(function(response) {
            console.log(response);
        }, function(err) {
            console.log(err);
        });
    });
}());