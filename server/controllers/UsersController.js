var CONTROLLER_NAME = 'users';

var encryption = require('../utilities/encryption');

var users = require('../data/users'),
    courseModel = require('../data/course');

function distinctSiteNames(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

module.exports = {
    getRegister: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/register');
    },
    postRegister: function(req, res, next) {
        var newUserData = req.body;

        if (newUserData.password != newUserData.confirmPassword) {
            req.session.error = 'Passwords do not match!';
            res.redirect('/register');
        } else {
            newUserData.salt = encryption.generateSalt();
            newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, newUserData.password);
            newUserData.points = 0;

            users.create(newUserData, function(err, user) {
                if (err) {
                    return next(err);
                }

                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    } else {
                        res.redirect('/');
                    }
                });
            });
        }
    },
    getLogin: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/login');
    },
    getProfile: function(req, res, next) {
        var user = req.user,
            userGradesPerTest = {},
            userAverageGrades = {};

        for (var item in user.tests) {
            var currentTest = user.tests[item];

            userGradesPerTest[currentTest.testName] = userGradesPerTest[currentTest.testName] || {};
            userGradesPerTest[currentTest.testName].gradesSum = userGradesPerTest[currentTest.testName].gradesSum + currentTest.grade || currentTest.grade;
            userGradesPerTest[currentTest.testName].gradesCount = userGradesPerTest[currentTest.testName].gradesCount + 1 || 1;
        }

        for (var testName in userGradesPerTest) {
            userAverageGrades[testName] = userGradesPerTest[testName].gradesSum / userGradesPerTest[testName].gradesCount;
        }

        res.render(CONTROLLER_NAME + '/profile', {
            currentUser: req.user,
            averageGrades: userAverageGrades
        });
    },
    updateProfile: function(req, res, next) {
        // TODO: Implement
    },
    assignCourse: function(req, res, next) {
        var user = req.user,
            courseName = req.body.courseName;

        users.assignCourse(user._id, courseName, function(err, data) {
            if (err) {
                // mongoose blow silently
                return next(err);
            }

            courseModel.assignStudent(courseName, user.username, function(err, data) {
                if (err) {
                    return next(err);
                }

                res.render('course/' + courseName);
            });
        });
    },
    assignTest: function(req, res, next) {
        var user = req.user,
            testName = req.body.testName;

        users.assignTest(user._id, testName, function(err, data) {
            if (err) {
                return next(err);
            }

            res.end();
        });
    }
};