const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema(
    {
        askedBy : {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User'
                },
        originalReviewAuthor : {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User'
                },
        reviewID : {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Review'
                },
        questionText: {
                    type: String,
                    required: true, 
        },
        answerText: {
                    type: String,
                    default: null,
        }
    },
    {
        timestamps: true
    }
)

const Question = mongoose.model("Question", QuestionSchema)

module.exports = Question