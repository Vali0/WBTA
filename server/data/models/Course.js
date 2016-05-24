var mongoose = require('mongoose');

module.exports.init = function() {
    var courseSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        lecture: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        assignedTests: [{
            type: String,
            unique: true
        }],
        students: [{
            type: String,
            unique: true
        }]
    });

    var Course = mongoose.model('Course', courseSchema);
};