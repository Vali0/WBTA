var Course = require('mongoose').model('Course');

module.exports = {
    getAll: function(callback) {
        Course.find({}, callback);
    },
    getById: function(name, callback) {
        Course.findOne({name: name}, callback);
    }
};