var CONTROLLER_NAME = 'tests';

var testModel = require('../data/test');

module.exports = {
    getTestById: function(req, res, next) {
        var testName = req.params.testId;
        testName = testName.replace('-', ' ');

        testModel.getByName(testName, function(err, data) {
            if(err) {
                return next(err);
            }

            res.render(CONTROLLER_NAME + '/testLanding', {
                test: data
            });
        });
    }
};