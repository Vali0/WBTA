var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    update: function(id, data, callback) {
        User.update(id, data, callback);
    },
    findOne: function(username, callback) {
        User.findOne({
            username: username
        }, callback);
    }
};