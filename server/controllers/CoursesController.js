var CONTROLLER_NAME = 'courses';

var courseModel = require('../data/course');

module.exports = {
    getCourses: function(req, res, next) {

        courseModel.getAll(function(err, data) {
            if (err) {
                return next(err);
            }

            res.render(CONTROLLER_NAME + '/coursesLanding', {
                courses: data
            });
        });
    }
};