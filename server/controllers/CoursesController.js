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
    },
    getCourseById: function(req, res, next) {
        console.log(req.params);
        var courseId = req.params.id;

        courseModel.getById(courseId, function(err, data) {
            if(err) {
                return next(err);
            }

            res.render(CONTROLLER_NAME + '/courseDetails', {
                course: data
            });
        });
    }
};