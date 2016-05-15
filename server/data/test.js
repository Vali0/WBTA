var Test = require('mongoose').model('Test');

module.exports = {
    getByName: function(name, callback) {
        Test.findOne({
            name: name
        }, callback);
    }
};