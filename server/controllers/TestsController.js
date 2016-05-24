var CONTROLLER_NAME = 'tests';

var testModel = require('../data/test'),
    userModel = require('../data/users');

function checkUserAnswers(testQuestions, userAnswers) {
    var userScore = {},
        correctAnswersCount = 0;

    for (var item in testQuestions) {
        var currentQuestion = testQuestions[item];
        var userAnswer = userAnswers[currentQuestion.question.replace(/\s/g, '-')] | 0;
        var correctAnswer = currentQuestion.correctAnswer;

        if (userAnswer === correctAnswer) {
            userScore[currentQuestion.question] = {
                isCorrect: true,
                userAnswer: currentQuestion.answers[userAnswer]
            };
            correctAnswersCount++;
        } else {
            userScore[currentQuestion.question] = {
                isCorrect: false,
                userAnswer: currentQuestion.answers[userAnswer],
                correctAnswer: currentQuestion.answers[correctAnswer]
            };
        }
    }

    return [userScore, correctAnswersCount];
}

function evaluateTest(totalQuestionsCount, correctAnswersCount) {
    var answersPercent = Math.round(correctAnswersCount * 100 / totalQuestionsCount);

    if (answersPercent < 50) {
        return 2;
    } else if (answersPercent >= 50 && answersPercent < 60) {
        return 3;
    } else if (answersPercent >= 60 && answersPercent < 70) {
        return 4;
    } else if (answersPercent >= 70 && answersPercent < 80) {
        return 5;
    } else {
        return 6;
    }
}

module.exports = {
    getTestById: function(req, res, next) {
        var testName = req.params.testId;
        testName = testName.replace(/-/g, ' ');

        testModel.getByName(testName, function(err, data) {
            if (err) {
                return next(err);
            }

            res.render(CONTROLLER_NAME + '/testLanding', {
                test: data
            });
        });
    },

    // TODO: Validate if answer is missing. User skip question.
    submitTest: function(req, res, next) {
        var user = req.user,
            userAnswers = req.body;

        testModel.getByName(userAnswers.testName, function(err, testData) {
            if (err) {
                return next(err);
            }

            var testQuestions = testData.questions,
                checkedAnswers = checkUserAnswers(testQuestions, userAnswers),
                userScore = checkedAnswers[0],
                correctAnswersCount = checkedAnswers[1],
                totalQuestionsCount = testQuestions.length,
                userGrade = evaluateTest(totalQuestionsCount, correctAnswersCount);

            userModel.findOne(user.username, function(err, userData) {
                if (err) {
                    return next(err);
                }

                var lastTest = userData.tests[userData.tests.length - 1];

                userModel.update({
                        'tests._id': lastTest._id
                    }, {
                        $set: {
                            'tests.$.grade': userGrade
                        }
                    },
                    function(err, data) {
                        if (err) {
                            return next(err);
                        }

                        res.render(CONTROLLER_NAME + '/testResult', {
                            userGrade: userGrade,
                            userScore: userScore,
                            correctAnswersCount: correctAnswersCount,
                            courseName: testData.course
                        });
                    });
            });
        });
    }
};