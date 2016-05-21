var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

module.exports.init = function() {
    var userSchema = mongoose.Schema({
        username: {
            type: String,
            require: '{PATH} is required',
            unique: true
        },
        salt: String,
        hashPass: String,
        courses: [{
            type: String,
            unique: true
        }],
        tests: [{
            testName: String,
            grade: Number,
            date: Date
        }]
    });

    userSchema.method({
        authenticate: function(password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            } else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', userSchema);
};