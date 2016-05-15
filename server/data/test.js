var Test = require('mongoose').model('Test');

module.exports = {
    getTest: function(testName, callback) {
        Test.findOne({
            name: testName
        }, callback);
    }
};