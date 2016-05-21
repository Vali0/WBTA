var CONTROLLER_NAME = 'users';

var encryption = require('../utilities/encryption');

var users = require('../data/users'),
    courseModel = require('../data/course'),
    testModel = require('../data/test');

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
        res.render(CONTROLLER_NAME + '/profile', {
            currentUser: req.user
        });
    },
    // FIX THIS! user model is in req.user
    updateProfile: function(req, res, next) {
        users.findOne(req.body.username, function(err, user) {
            var sites = distinctSiteNames(user.sites.concat(req.body.sites));

            if (err) {
                return next(err);
            }

            users.update({
                _id: user._id
            }, sites, function() {
                res.send('/');
            });
        });
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
    },

    // TODO: Validate if answer is missing. User skip question.
    evaluateTest: function(req, res, next) {
        var user = req.user,
            userAnswers = req.body;

        testModel.getByName(userAnswers.testName, function(err, data) {
            if (err) {
                console.log(err);
                return next(err);
            }

            console.log(data);
            var testQuestions = data.questions;
            var userScore = {};
            for (var item in testQuestions) {
                if (testQuestions.hasOwnProperty(item)) {
                    var userAnswer = userAnswers[testQuestions[item].question];
                    var correctAnswer = testQuestions[item].correctAnswer;

                    if (userAnswer === correctAnswer) {
                        userScore[userAnswers.testName] = true;
                    } else {
                        userScore[userAnswers.testName] = correctAnswer;
                    }
                }
            }

            // TODO: Calculate student grade and write it in database. Probably one answer should be 10%

            res.end();
        });
    }
};