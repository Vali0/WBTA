var mongoose = require('mongoose');

module.exports.init = function() {
    var testSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        questions: [{
            question: String,
            answers: [String],
            correctAnswer: Number
        }],
        course: {
            type: String,
            required: true
        }
    });

    var Test = mongoose.model('Test', testSchema);
};