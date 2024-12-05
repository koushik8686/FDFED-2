    const mongoose = require('mongoose');

    const FeedbackSchema = mongoose.Schema({
        name: String,
        email: String,
        Feedback: String,
        Rating: Number,
        CreatedAt:Date
    })

    const Feedback = mongoose.model('Feedbacks', FeedbackSchema);
    module.exports = Feedback;