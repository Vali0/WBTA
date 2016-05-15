var Course = require('mongoose').model('Course');

module.exports = {
    getAll: function(callback) {
        Course.find({}, callback);
    }
};