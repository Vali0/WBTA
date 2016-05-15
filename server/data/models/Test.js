var mongoose = require('mongoose');

module.exports.init = function() {
    var testSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        course: {
            type: String,
            unique:true,
            required: true
        },
        students: [{
            type: String,
            unique: true
        }]
    });

    var Test = mongoose.model('Test', testSchema);
};