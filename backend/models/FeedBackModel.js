const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
    name: String,
    email: { type: String, index: true, unique: true },
    Feedback: String,
    Rating: Number,
    CreatedAt: { type: Date, index: true }
});

// Ensure indexes are created
FeedbackSchema.index({ email: 1 }, { unique: true });
FeedbackSchema.index({ CreatedAt: 1 });

const Feedback = mongoose.model('Feedbacks', FeedbackSchema);
module.exports = Feedback;