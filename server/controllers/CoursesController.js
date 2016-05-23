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
        var courseName = req.params.id,
            currentUser = req.user,
            isCourseAssigned = false;

        courseName = courseName.replace(/-/g, ' ');
        courseModel.getById(courseName, function(err, data) {
            if (err) {
                return next(err);
            }

            if (currentUser.courses.indexOf(courseName) >= 0) {
                isCourseAssigned = true;
            }

            res.render(CONTROLLER_NAME + '/courseDetails', {
                course: data,
                isCourseAssigned: isCourseAssigned
            });
        });
    }
};