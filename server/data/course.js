var Course = require('mongoose').model('Course');

module.exports = {
    getAll: function(callback) {
        Course.find({}, callback);
    },
    getById: function(id, callback) {
        Course.findOne({_id: id}, callback);
    }
};