const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
    name: String,
    email: { type: String},
    Feedback: String,
    Rating: Number,
    CreatedAt: { type: Date, index: true }
});

// Ensure indexes are created
const Feedback = mongoose.model('Feedbacks', FeedbackSchema);
module.exports = Feedback;