var mongoose = require('mongoose');

module.exports.init = function() {
    var courseSchema = mongoose.Schema({
        name: {
            type: String,
            unique: true,
            required: true
        },
        lecture: {
            type: String,
            required: true
        },
        assignedTests: [{
            type: String
        }],
        students: [{
            type: String,
            unique: true
        }]
    });

    var Course = mongoose.model('Course', courseSchema);
};