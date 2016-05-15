(function() {
    'use strict';
    $('#assign-course').on('click', function() {
        var courseName = $(this).attr('data-course-name');

        httpRequester.sendRequest(window.location.href, 'PUT', JSON.stringify({
            courseName: courseName
        })).then(function(response) {
            console.log(response);
        }, function(err) {
            console.log(err);
        });
    });
}());